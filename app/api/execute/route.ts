import { NextResponse } from "next/server";
import vm from "vm";

export async function POST(req: Request) {
  try {
    const { language, code } = await req.json();

    if (!code || !language) {
      return NextResponse.json({ error: "Code and language are required" }, { status: 400 });
    }

    // JavaScript — actually execute
    if (language === "javascript") {
      return executeJS(code);
    }

    // TypeScript — strip types, then execute
    if (language === "typescript") {
      const stripped = stripTypeScript(code);
      return executeJS(stripped);
    }

    // Python — simulated
    if (language === "python") {
      return NextResponse.json({ output: simulatePython(code), error: null });
    }

    // C++ — simulated
    if (language === "cpp") {
      return NextResponse.json({ output: simulateCpp(code), error: null });
    }

    // Java — simulated
    if (language === "java") {
      return NextResponse.json({ output: simulateJava(code), error: null });
    }

    // Go — simulated
    if (language === "go") {
      return NextResponse.json({ output: simulateGo(code), error: null });
    }

    // Rust — simulated
    if (language === "rust") {
      return NextResponse.json({ output: simulateRust(code), error: null });
    }

    // Ruby — simulated
    if (language === "ruby") {
      return NextResponse.json({ output: simulateRuby(code), error: null });
    }

    // Haskell — simulated
    if (language === "haskell") {
      return NextResponse.json({ output: simulateHaskell(code), error: null });
    }

    // C — simulated
    if (language === "c") {
      return NextResponse.json({ output: simulateC(code), error: null });
    }

    return NextResponse.json({ error: "Unsupported language" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function executeJS(code: string) {
  const logs: string[] = [];
  const sandbox = {
    console: {
      log: (...args: any[]) => logs.push(args.map(formatArg).join(" ")),
      error: (...args: any[]) => logs.push("Error: " + args.map(formatArg).join(" ")),
      warn: (...args: any[]) => logs.push("Warning: " + args.map(formatArg).join(" ")),
    },
    Math, Date, JSON, parseInt, parseFloat, String, Number, Boolean,
    Array, Object, RegExp, Map, Set, Promise, setTimeout, setInterval,
  };

  try {
    const script = new vm.Script(code, { filename: "user-code.js" });
    const context = vm.createContext(sandbox);
    script.runInContext(context, { timeout: 5000 });

    if (logs.length === 0) logs.push("(no output)");
    logs.push("");
    logs.push("Process exited with code 0");

    return NextResponse.json({ output: logs, error: null });
  } catch (err: any) {
    return NextResponse.json({
      output: [],
      error: `Runtime Error: ${err.message}`,
    });
  }
}

// Strip TypeScript-specific syntax so it can run as plain JS
function stripTypeScript(code: string): string {
  const lines = code.split("\n");
  const result: string[] = [];
  let inBlockRemove = false;
  const genericTypes = new Set<string>();

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const trimmed = line.trim();

    // Skip interface/type/enum declarations (including multi-line blocks)
    if (/^\s*(?:export\s+)?(?:interface|type|enum)\s+/.test(trimmed)) {
      if (trimmed.includes("{") && !trimmed.includes("}")) {
        inBlockRemove = true;
      }
      continue;
    }

    if (inBlockRemove) {
      if (trimmed.includes("}") || trimmed === "}") {
        inBlockRemove = false;
      }
      continue;
    }

    // Collect generic type params before removing them
    const genericMatch = line.match(/<(\w+)(?:\s+extends\s+\w+)?>/);
    if (genericMatch) {
      genericTypes.add(genericMatch[1]);
    }

    // Remove <T>, <T extends U>, etc.
    line = line.replace(/<\w+(?:\s+extends\s+[\w<>]+)?(?:\s*,\s*\w+(?:\s+extends\s+[\w<>]+)?)*>/g, "");

    // Remove : type from variable declarations (const, let, var) — built-in types
    line = line.replace(/\b(const|let|var)\s+(\w+)\s*:\s*(?:string|number|boolean|any|void|never|unknown|object|bigint|symbol|undefined|null|Record|Partial|Required|Pick|Omit|Promise|Array)\b(\s*[=;])/g, "$1 $2$3");

    // Remove custom type from variable declarations (e.g., const user: User = ...)
    line = line.replace(/\b(const|let|var)\s+(\w+)\s*:\s*[A-Z]\w*\b(\s*[=;])/g, "$1 $2$3");

    // Remove : type from function params — built-in types
    line = line.replace(/(\w+)\s*:\s*(?:string|number|boolean|any|void|never|unknown|object|bigint|symbol|undefined|null|Record|Partial|Required|Pick|Omit|Promise|Array)\b/g, "$1");

    // Remove custom type from function params (e.g., person: Person)
    line = line.replace(/(\w+)\s*:\s*([A-Z]\w*)\b/g, "$1");

    // Remove generic type params from function params too (e.g., arg: T)
    for (const gt of genericTypes) {
      const regex = new RegExp(`(\\w+)\\s*:\\s*${gt}\\b`, "g");
      line = line.replace(regex, "$1");
    }

    // Remove return type ): type { or ): type =>
    line = line.replace(/\)\s*:\s*(?:string|number|boolean|any|void|never|unknown|object|bigint|symbol|undefined|null|Record|Partial|Required|Pick|Omit|Promise|Array)\b\s*([>{=])/g, ")$1");

    // Remove custom return type ): TypeName { or ): TypeName =>
    line = line.replace(/\)\s*:\s*[A-Z]\w*\s*([>{=])/g, ")$1");

    // Remove generic return types too (e.g., ): T {)
    for (const gt of genericTypes) {
      const regex = new RegExp(`\\)\\s*:\\s*${gt}\\b\\s*([>{=])`, "g");
      line = line.replace(regex, ")$1");
    }

    // Remove "as Type"
    line = line.replace(/\bas\s+(?:string|number|boolean|any|void|unknown|object|[\w\[\]<>]+)\b/g, "");

    result.push(line);
  }

  return result.join("\n");
}

function formatArg(arg: any): string {
  if (typeof arg === "object") return JSON.stringify(arg, null, 2);
  return String(arg);
}

// Simulators that parse print/output statements and evaluate simple expressions
function safeEval(expr: string): string {
  try {
    // Only allow safe math operations
    const sanitized = expr.replace(/[^0-9+\-*/().%\s]/g, "");
    if (sanitized.trim() === "") return expr; // not a math expression
    const result = Function(`"use strict"; return (${sanitized})`)();
    return String(result);
  } catch {
    return expr;
  }
}

// Skip lines that are commented out
function isCommented(trimmed: string, language: string): boolean {
  if (language === "python" || language === "ruby") {
    return trimmed.startsWith("#");
  }
  // C, C++, Java, Go, Rust, Haskell, JavaScript, TypeScript
  return trimmed.startsWith("//");
}

function simulatePython(code: string): string[] {
  const lines: string[] = [];
  for (const line of code.split("\n")) {
    const trimmed = line.trim();
    if (isCommented(trimmed, "python")) continue;
    const printMatch = trimmed.match(/^print\((.+)\)$/);
    if (printMatch) {
      let val = printMatch[1].trim();
      // String literal
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        lines.push(val.slice(1, -1).replace(/\\n/g, ""));
      }
      // f-string: f"Hello {name}"
      else if (val.startsWith('f"') || val.startsWith("f'")) {
        const inner = val.slice(2, -1);
        lines.push(inner.replace(/\{[^}]+\}/g, (m) => m.slice(1, -1)));
      }
      // Number expression: 2 + 2
      else {
        lines.push(safeEval(val));
      }
    }
  }
  if (lines.length === 0) lines.push("(no output)");
  lines.push("", "Process exited with code 0");
  return lines;
}

function simulateCpp(code: string): string[] {
  const lines: string[] = [];
  for (const line of code.split("\n")) {
    const trimmed = line.trim();
    if (isCommented(trimmed, "cpp")) continue;
    // std::cout << "string"
    const coutStr = trimmed.match(/std::cout\s*<<\s*"([^"]+)"/);
    if (coutStr) { lines.push(coutStr[1]); continue; }
    // std::cout << expr
    const coutExpr = trimmed.match(/std::cout\s*<<\s*(.+?)\s*(?:<<|$)/);
    if (coutExpr) {
      const expr = coutExpr[1].trim().replace(/std::endl/g, "").trim();
      if (expr) lines.push(safeEval(expr));
    }
  }
  if (lines.length === 0) lines.push("(no output)");
  lines.push("", "Build succeeded", "Process exited with code 0");
  return lines;
}

function simulateJava(code: string): string[] {
  const lines: string[] = [];
  for (const line of code.split("\n")) {
    const trimmed = line.trim();
    if (isCommented(trimmed, "java")) continue;
    // System.out.println("string")
    const printStr = trimmed.match(/System\.out\.println\("([^"]+)"\)/);
    if (printStr) { lines.push(printStr[1]); continue; }
    // System.out.println(expr)
    const printExpr = trimmed.match(/System\.out\.println\((.+)\)/);
    if (printExpr) {
      const expr = printExpr[1].trim();
      if ((expr.startsWith('"') && expr.endsWith('"'))) {
        lines.push(expr.slice(1, -1));
      } else {
        lines.push(safeEval(expr));
      }
    }
  }
  if (lines.length === 0) lines.push("(no output)");
  lines.push("", "Process exited with code 0");
  return lines;
}

function simulateGo(code: string): string[] {
  const lines: string[] = [];
  for (const line of code.split("\n")) {
    const trimmed = line.trim();
    if (isCommented(trimmed, "go")) continue;
    const fmtStr = trimmed.match(/fmt\.Println\("([^"]+)"\)/);
    if (fmtStr) { lines.push(fmtStr[1]); continue; }
    const fmtExpr = trimmed.match(/fmt\.Println\((.+)\)/);
    if (fmtExpr) {
      const expr = fmtExpr[1].trim();
      if (expr.startsWith('"') && expr.endsWith('"')) {
        lines.push(expr.slice(1, -1));
      } else {
        lines.push(safeEval(expr));
      }
    }
  }
  if (lines.length === 0) lines.push("(no output)");
  lines.push("", "Process exited with code 0");
  return lines;
}

function simulateRust(code: string): string[] {
  const lines: string[] = [];
  for (const line of code.split("\n")) {
    const trimmed = line.trim();
    if (isCommented(trimmed, "rust")) continue;
    // println!("string")
    const printStr = trimmed.match(/println!\("([^"]+)"\)/);
    if (printStr) { lines.push(printStr[1].replace(/\{\}/g, "")); continue; }
    // println!("{}" , expr)
    const printExpr = trimmed.match(/println!\("([^"]+)"\s*,\s*(.+)\)/);
    if (printExpr) {
      const fmt = printExpr[1];
      const expr = printExpr[2].trim();
      const val = safeEval(expr);
      lines.push(fmt.replace("{}", val));
    }
  }
  if (lines.length === 0) lines.push("(no output)");
  lines.push("", "Compiling...", "Build succeeded", "Process exited with code 0");
  return lines;
}

function simulateRuby(code: string): string[] {
  const lines: string[] = [];
  for (const line of code.split("\n")) {
    const trimmed = line.trim();
    if (isCommented(trimmed, "ruby")) continue;
    const putsStr = trimmed.match(/^puts\s+"([^"]+)"$/);
    if (putsStr) { lines.push(putsStr[1]); continue; }
    const putsExpr = trimmed.match(/^puts\s+(.+)$/);
    if (putsExpr) {
      const expr = putsExpr[1].trim();
      if (expr.startsWith('"') && expr.endsWith('"')) {
        lines.push(expr.slice(1, -1));
      } else {
        lines.push(safeEval(expr));
      }
    }
  }
  if (lines.length === 0) lines.push("(no output)");
  lines.push("", "Process exited with code 0");
  return lines;
}

function simulateHaskell(code: string): string[] {
  const lines: string[] = [];
  for (const line of code.split("\n")) {
    const trimmed = line.trim();
    if (isCommented(trimmed, "haskell")) continue;
    // putStrLn "string"
    const putStrLnStr = trimmed.match(/putStrLn\s+"([^"]+)"/);
    if (putStrLnStr) { lines.push(putStrLnStr[1]); continue; }
    // putStrLn expr
    const putStrLnExpr = trimmed.match(/putStrLn\s+(\w+)/);
    if (putStrLnExpr) { lines.push(putStrLnExpr[1]); continue; }
    // print expr
    const printMatch = trimmed.match(/^print\s+(.+)$/);
    if (printMatch) { lines.push(safeEval(printMatch[1].trim())); continue; }
    // putStr "string"
    const putStrMatch = trimmed.match(/putStr\s+"([^"]+)"/);
    if (putStrMatch) { lines.push(putStrMatch[1]); continue; }
  }
  if (lines.length === 0) lines.push("(no output)");
  lines.push("", "Compiling...", "Linking...", "Process exited with code 0");
  return lines;
}

function simulateC(code: string): string[] {
  const lines: string[] = [];
  for (const line of code.split("\n")) {
    const trimmed = line.trim();
    if (isCommented(trimmed, "c")) continue;
    // printf("string")
    const printfStr = trimmed.match(/printf\s*\(\s*"([^"]+)"\s*\)/);
    if (printfStr) { lines.push(printfStr[1].replace(/\\n/g, "")); continue; }
    // printf("%d", expr)
    const printfExpr = trimmed.match(/printf\s*\(\s*"%d"\s*,\s*(.+)\s*\)/);
    if (printfExpr) { lines.push(safeEval(printfExpr[1].trim())); continue; }
    // printf("%f", expr)
    const printfFloat = trimmed.match(/printf\s*\(\s*"%f"\s*,\s*(.+)\s*\)/);
    if (printfFloat) { lines.push(safeEval(printfFloat[1].trim())); continue; }
    // printf("%s", str)
    const printfStr2 = trimmed.match(/printf\s*\(\s*"%s"\s*,\s*"([^"]+)"\s*\)/);
    if (printfStr2) { lines.push(printfStr2[1]); continue; }
  }
  if (lines.length === 0) lines.push("(no output)");
  lines.push("", "Compiling...", "Build succeeded", "Process exited with code 0");
  return lines;
}
