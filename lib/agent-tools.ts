/**
 * Agent Tools — Tool definitions and execution for the AI agent.
 * Tools allow the agent to take actions beyond just generating text.
 */

// ============================================
// Tool Definitions — OpenAI function-calling format
// ============================================
export const AGENT_TOOLS = [
  {
    type: "function" as const,
    function: {
      name: "run_code",
      description: "Execute code in a programming language and get the output. Use this to run code the user asks about or to test code you generate.",
      parameters: {
        type: "object" as const,
        properties: {
          language: {
            type: "string",
            description: "Programming language: javascript, python, typescript, java, cpp, c, go, rust, ruby, haskell, html, css",
          },
          code: {
            type: "string",
            description: "The complete code to execute",
          },
        },
        required: ["language", "code"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "calculator",
      description: "Calculate a math expression. Use for any arithmetic, math problems, or calculations.",
      parameters: {
        type: "object" as const,
        properties: {
          expression: {
            type: "string",
            description: "Math expression to evaluate, e.g. '25 * 17 + 100' or 'Math.sqrt(144)'",
          },
        },
        required: ["expression"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "read_editor",
      description: "Read the current code in the editor. Use when the user asks you to look at, explain, or modify existing code.",
      parameters: {
        type: "object" as const,
        properties: {},
        required: [],
      },
    },
  },
];

// ============================================
// Tool Execution
// ============================================

export async function executeTool(
  name: string,
  args: Record<string, unknown>,
  context: { existingCode: string; language: string; baseUrl: string }
): Promise<string> {
  switch (name) {
    case "run_code":
      return await runCode(args.language as string, args.code as string, context.baseUrl);

    case "calculator":
      return calculator(args.expression as string);

    case "read_editor":
      return readEditor(context.existingCode, context.language);

    default:
      return `Unknown tool: ${name}`;
  }
}

// ============================================
// Individual Tool Implementations
// ============================================

async function runCode(language: string, code: string, baseUrl: string): Promise<string> {
  try {
    const res = await fetch(`${baseUrl}/api/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language, code }),
    });

    if (!res.ok) {
      return `Execution failed with status ${res.status}`;
    }

    const data = await res.json();

    if (data.error) {
      return `Error: ${data.error}\n${(data.output || []).join("\n")}`;
    }

    const output = (data.output || []).join("\n");
    return output || "(no output)";
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return `Execution error: ${message}`;
  }
}

function calculator(expression: string): string {
  try {
    // Only allow safe math characters
    const sanitized = expression.replace(/[^0-9+\-*/().%\s^]|Math\.\w+/g, (match) => {
      if (match.startsWith("Math.")) return match;
      return "";
    });

    if (!sanitized.trim()) {
      return "Error: Invalid expression";
    }

    // Replace ^ with ** for exponentiation
    const jsExpr = sanitized.replace(/\^/g, "**");

    // Safe math evaluator — no eval/Function
    let pos = 0;
    const tokens = jsExpr.match(/\d+\.?\d*|Math\.\w+|[+\-*/%()^]/g) || [];
    function parseExpr(): number {
      let left = parseTerm();
      while (pos < tokens.length && (tokens[pos] === "+" || tokens[pos] === "-")) {
        const op = tokens[pos++];
        const right = parseTerm();
        left = op === "+" ? left + right : left - right;
      }
      return left;
    }
    function parseTerm(): number {
      let left = parseFactor();
      while (pos < tokens.length && (tokens[pos] === "*" || tokens[pos] === "/" || tokens[pos] === "%")) {
        const op = tokens[pos++];
        const right = parseFactor();
        if (op === "*") left *= right;
        else if (op === "/") left = right !== 0 ? left / right : 0;
        else left %= right;
      }
      return left;
    }
    function parseFactor(): number {
      if (tokens[pos] === "-") { pos++; return -parseFactor(); }
      if (tokens[pos] === "(") { pos++; const v = parseExpr(); pos++; return v; }
      if (tokens[pos]?.startsWith("Math.")) {
        const fn = tokens[pos++];
        const val = parseFactor();
        if (fn === "Math.sqrt") return Math.sqrt(val);
        if (fn === "Math.abs") return Math.abs(val);
        if (fn === "Math.floor") return Math.floor(val);
        if (fn === "Math.ceil") return Math.ceil(val);
        if (fn === "Math.round") return Math.round(val);
        return val;
      }
      return parseFloat(tokens[pos++]) || 0;
    }
    pos = 0;
    const result = parseExpr();
    return `${expression} = ${result}`;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return `Calculator error: ${message}`;
  }
}

function readEditor(code: string, language: string): string {
  if (!code || code.trim().length === 0) {
    return "Editor is empty — no code to read.";
  }
  return `Current editor content (${language}):\n\`\`\`${language}\n${code}\n\`\`\``;
}
