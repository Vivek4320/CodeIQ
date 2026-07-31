import { NextResponse } from "next/server";
import { getCompletionClient } from "@/lib/keyking";

export async function POST(req: Request) {
  try {
    const { language, code, cursorPosition } = await req.json();

    if (!language || code === undefined || cursorPosition === undefined) {
      return NextResponse.json({ completions: [] }, { status: 200 });
    }

    // Extract context: ~30 lines before cursor, ~5 lines after
    const lines = code.split("\n");
    let charCount = 0;
    let cursorLine = 0;
    for (let i = 0; i < lines.length; i++) {
      if (charCount + lines[i].length >= cursorPosition) {
        cursorLine = i;
        break;
      }
      charCount += lines[i].length + 1;
    }

    const contextStart = Math.max(0, cursorLine - 30);
    const contextEnd = Math.min(lines.length, cursorLine + 5);
    const contextCode = lines.slice(contextStart, contextEnd).join("\n");
    const currentLine = lines[cursorLine] || "";

    const prompt = `You are a code completion engine for ${language} code.

Current line being edited:
${currentLine}

Surrounding context (cursor is on the current line above):
\`\`\`${language}
${contextCode}
\`\`\`

Based on the code above, suggest exactly 3-5 short, relevant code completions for the current cursor position.

Rules:
- Return ONLY a JSON array of objects with "label", "type", and "detail" fields
- "label" is the completion text (1-3 words max, no newlines)
- "type" is one of: "function", "method", "keyword", "variable", "class", "property", "snippet"
- "detail" is a brief 2-5 word description
- Prefer reusing variable/function names already present in the code
- Do not include explanations, markdown, or code fences — only the raw JSON array
- If no completions make sense, return an empty array []

Return JSON array:`;

    // KeyKing handles provider routing with automatic fallback
    const keyking = getCompletionClient();

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      const data = await keyking.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
        max_tokens: 256,
      });

      clearTimeout(timeout);

      const text = data.choices?.[0]?.message?.content?.trim();
      if (!text) return NextResponse.json({ completions: [] }, { status: 200 });

      return NextResponse.json({ completions: parseCompletions(text) });
    } catch {
      clearTimeout(timeout);
      return NextResponse.json({ completions: [] }, { status: 200 });
    }
  } catch {
    return NextResponse.json({ completions: [] }, { status: 200 });
  }
}

// Shared JSON parser
function parseCompletions(
  text: string,
): { label: string; type: string; detail: string; isAI: boolean }[] {
  try {
    const cleaned = text
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/```\s*$/, "")
      .trim();
    const parsed: { label: string; type: string; detail: string }[] = JSON.parse(cleaned);
    return parsed
      .filter((c) => c.label && typeof c.label === "string")
      .slice(0, 5)
      .map((c) => ({
        label: c.label,
        type: c.type || "snippet",
        detail: c.detail || "AI suggestion",
        isAI: true,
      }));
  } catch {
    return [];
  }
}
