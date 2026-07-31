import { NextResponse } from "next/server";
import { AGENT_TOOLS, executeTool } from "@/lib/agent-tools";
import { getAgentClient } from "@/lib/keyking";
import type { ChatMessage, ToolCall } from "keyking-sdk";

const MAX_ITERATIONS = 4;

// Rate limit for AI agent (stricter — costs money per request)
const agentRateMap = new Map<string, { count: number; resetAt: number }>();
const AGENT_RATE_LIMIT = 10;
const AGENT_RATE_WINDOW = 60_000;

function checkAgentRateLimit(ip: string): { ok: boolean; retryAfter?: number } {
  const now = Date.now();
  const entry = agentRateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    agentRateMap.set(ip, { count: 1, resetAt: now + AGENT_RATE_WINDOW });
    return { ok: true };
  }
  entry.count++;
  if (entry.count > AGENT_RATE_LIMIT) {
    return { ok: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  return { ok: true };
}

const SYSTEM_PROMPT = `You are CodeIQ, a friendly and helpful AI coding assistant. You can code AND have normal conversations.

## Who You Are
- Your name is **CodeIQ**
- You are a coding assistant that lives inside the CodeIQ editor
- You are warm, friendly, and encouraging
- You love helping people learn and write code

## Greetings — IMPORTANT
When user says hi, hello, hey, or any greeting:
- Reply warmly: "Hello! Nice to meet you 👋 I'm CodeIQ, your AI coding assistant. How can I help you today?"
- Keep it short and friendly
- Do NOT use any tools for greetings

## Personality
- Be friendly, warm, and conversational
- Answer general questions (math, science, life advice, etc.) helpfully
- Be encouraging — especially with beginners
- Keep responses concise but not robotic
- Use simple, easy-to-understand language

## When to Use Tools
- **run_code**: User wants to run/test code, or you generate code and want to verify it
- **calculator**: User asks a math question
- **read_editor**: User asks about the code in the editor

When user just wants to chat or asks a general question — DO NOT use any tools. Just reply directly as a normal conversation.

## When to Write Code
- User asks to create/write/generate code
- User asks to fix/improve/refactor code
- User asks to explain code
- User asks to run code

## Rules
1. Be friendly and conversational for normal chat
2. For code tasks: write simple, beginner-friendly code
3. Code must produce output (print/console.log) — never use input() or Scanner
4. When generating code, run it to verify it works
5. Be concise — no unnecessary verbosity

## Explaining Code — IMPORTANT
When user asks to EXPLAIN code, break it into numbered steps (1. 2. 3. ...) with short sentences, one idea per step. Use line breaks between steps. Example:
"Here is how this code works:

1. First, it imports the necessary libraries.

2. It defines a function called greet that takes a name parameter.

3. Inside the function, it creates a greeting string with the name."

## Response Format
For code tasks reply with JSON:
{"plan":"what you did (use numbered steps for explanations)","code":"the code or empty","review":""}

For normal conversation (greetings, general questions, chat) reply with JSON:
{"plan":"your conversational reply","code":"","review":""}`;

// Stream an SSE event to the client
function sseEvent(encoder: TextEncoder, data: Record<string, unknown>): Uint8Array {
  return encoder.encode(`data: ${JSON.stringify(data)}\n\n`);
}

// Parse text-based tool calls from Llama models
// Format: <function/tool_name>{"arg": "value"}</function>
function parseTextToolCalls(content: string): ToolCall[] {
  const calls: ToolCall[] = [];
  const regex = /<function\/(\w+)>([\s\S]*?)<\/function>/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const toolName = match[1];
    let args = match[2].trim();

    try {
      JSON.parse(args);
    } catch {
      args = JSON.stringify({ input: args });
    }

    calls.push({
      id: `call_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      type: "function",
      function: { name: toolName, arguments: args },
    });
  }

  return calls;
}

export async function POST(req: Request) {
  try {
    const { messages, language, existingCode } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 });
    }

    // Rate limit (skip localhost)
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (ip !== "127.0.0.1" && ip !== "::1" && ip !== "unknown") {
      const rate = checkAgentRateLimit(ip);
      if (!rate.ok) {
        return NextResponse.json({ error: `AI agent rate limit exceeded. Try again in ${rate.retryAfter} seconds.` }, { status: 429 });
      }
    }

    const keyking = getAgentClient();

    // Build conversation
    const conversation: ChatMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
    ];

    // Add conversation history (last 6 messages to save tokens)
    const recentMessages = messages.slice(-6);
    for (const msg of recentMessages) {
      conversation.push({
        role: msg.role === "agent" ? "assistant" : "user",
        content: msg.role === "agent"
          ? `Plan: ${msg.plan || ""}\n\nCode:\n\`\`\`${language}\n${msg.code || ""}\n\`\`\`\n\nReview: ${msg.review || msg.content}`
          : msg.content,
      });
    }

    // Add editor context — only for code-related messages, not normal chat
    const lastUserMsg = messages[messages.length - 1]?.content?.toLowerCase() || "";
    const codeKeywords = ["code", "editor", "fix", "bug", "error", "run", "explain", "refactor", "optimize", "write", "create", "function", "class", "import", "def ", "var ", "const ", "let ", "print", "console", "output", "debug", "test", "implement", "build", "add", "update", "change", "modify", "improve", "language"];
    const isCodeRelated = codeKeywords.some((kw) => lastUserMsg.includes(kw)) || lastUserMsg.length > 30;

    if (isCodeRelated && existingCode && existingCode.trim().length > 0) {
      const truncatedCode = existingCode.length > 2000 ? existingCode.slice(0, 2000) + "\n// ... truncated" : existingCode;
      conversation.push({
        role: "user",
        content: `[System: Editor ${language} code]:\n\`\`\`${language}\n${truncatedCode}\n\`\`\``,
      });
    }

    // Create response stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const baseUrl = new URL(req.url).origin;

        try {
          // ========================================
          // REASONING LOOP: Think -> Tool -> Observe -> Repeat
          // ========================================
          for (let iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
            // Send thinking event
            controller.enqueue(sseEvent(encoder, {
              type: "thinking",
              content: iteration === 0 ? "Analyzing your request..." : "Processing tool result...",
              iteration: iteration + 1,
            }));

            // Call LLM with tools via KeyKing
            const data = await keyking.chat.completions.create({
              model: "llama-3.3-70b-versatile",
              messages: conversation,
              tools: AGENT_TOOLS,
              tool_choice: "auto",
              temperature: 0.3,
              max_tokens: 2048,
            });

            const assistantMessage = data.choices?.[0]?.message;

            if (!assistantMessage) {
              controller.enqueue(sseEvent(encoder, { type: "error", content: "No response from AI" }));
              break;
            }

            // Add assistant message to conversation
            conversation.push(assistantMessage);

            // ========================================
            // Did the LLM want to use a tool?
            // ========================================

            // Check for proper API tool_calls first
            let toolCalls = assistantMessage.tool_calls;

            // Fallback: parse text-based tool calls from Llama models
            // Llama sometimes outputs: <function/tool_name>args</function>
            if ((!toolCalls || toolCalls.length === 0) && assistantMessage.content) {
              const textToolCalls = parseTextToolCalls(assistantMessage.content);
              if (textToolCalls.length > 0) {
                toolCalls = textToolCalls;
                // Remove tool call text from content so it doesn't show as answer
                assistantMessage.content = assistantMessage.content.replace(/<function\/\w+>[\s\S]*?<\/function>/g, "").trim();
              }
            }

            if (toolCalls && toolCalls.length > 0) {
              for (const toolCall of toolCalls) {
                const functionName = toolCall.function.name;
                let functionArgs: Record<string, unknown> = {};

                try {
                  functionArgs = JSON.parse(toolCall.function.arguments);
                } catch {
                  functionArgs = {};
                }

                // Send tool usage event to frontend
                controller.enqueue(sseEvent(encoder, {
                  type: "tool",
                  tool: functionName,
                  args: functionArgs,
                  status: "running",
                }));

                // Execute the tool
                const toolResult = await executeTool(functionName, functionArgs, {
                  existingCode: existingCode || "",
                  language: language || "javascript",
                  baseUrl,
                });

                // Send tool result to frontend
                controller.enqueue(sseEvent(encoder, {
                  type: "tool",
                  tool: functionName,
                  args: functionArgs,
                  result: toolResult,
                  status: "done",
                }));

                // Add tool result to conversation
                conversation.push({
                  role: "tool",
                  tool_call_id: toolCall.id,
                  content: toolResult,
                });
              }
              // Loop continues — LLM will process tool results
            } else {
              // ========================================
              // No tool call — this is the final answer
              // ========================================
              const content = assistantMessage.content || "";

              // Try to parse as structured JSON
              let plan = "";
              let code = "";
              let review = "";

              try {
                const cleaned = content.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
                const parsed = JSON.parse(cleaned);
                plan = parsed.plan || "";
                code = parsed.code || "";
                review = parsed.review || "";
              } catch {
                // Not JSON — use raw content as review
                review = content;
              }

              // Clean code field
              if (code) {
                code = code.replace(/^```(?:\w*)\s*\n?/i, "").replace(/\n?\s*```$/, "").trim();
              }

              // Send final answer
              controller.enqueue(sseEvent(encoder, {
                type: "answer",
                plan,
                code,
                review: review || "Task completed.",
              }));

              break; // Done!
            }
          }
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : String(err);
          console.error("Agent error:", message);
          controller.enqueue(sseEvent(encoder, { type: "error", content: message }));
        }

        controller.enqueue(sseEvent(encoder, { type: "done" }));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: unknown) {
    console.error("Agent error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
