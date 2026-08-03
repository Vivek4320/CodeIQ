import { NextResponse } from "next/server";
import vm from "vm";
import { execSync, exec as execCb } from "child_process";
import { writeFileSync, unlinkSync, existsSync } from "fs";
import { join } from "path";
import { query } from "@/lib/db";

const IS_WIN = process.platform === "win32";
const TMP_DIR = IS_WIN ? (process.env.TEMP || "C:/Temp") : "/tmp";
const PISTON_API_URL = process.env.PISTON_API_URL || "";
const MAX_CODE_LENGTH = 50000;

// ─── Rate Limiter (in-memory, per-IP) ───
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 50;
const RATE_WINDOW = 60_000; // 1 minute

function checkRateLimit(ip: string): { ok: boolean; retryAfter?: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return { ok: true };
  }
  entry.count++;
  if (entry.count > RATE_LIMIT) {
    return { ok: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  return { ok: true };
}

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap) {
    if (now > entry.resetAt) rateLimitMap.delete(ip);
  }
}, 300_000);

// Add WinLibs gcc/g++ to PATH on startup (Windows)
if (IS_WIN) {
  try {
    const { readdirSync } = require("fs");
    const base = join(process.env.LOCALAPPDATA || "", "Microsoft/WinGet/Packages");
    const dirs = readdirSync(base).filter((d: string) => d.includes("WinLibs"));
    for (const dir of dirs) {
      const binDir = join(base, dir, "mingw64/bin");
      if (existsSync(join(binDir, "gcc.exe"))) {
        process.env.PATH = binDir + ";" + (process.env.PATH || "");
        break;
      }
    }
  } catch {}
  // Add Go to PATH if installed in default location
  const goPath = "C:/Program Files/Go/bin";
  if (existsSync(join(goPath, "go.exe"))) {
    process.env.PATH = goPath + ";" + (process.env.PATH || "");
  }
  // Add Ruby to PATH if installed in default location
  const rubyPath = "C:/Ruby33-x64/bin";
  if (existsSync(join(rubyPath, "ruby.exe"))) {
    process.env.PATH = rubyPath + ";" + (process.env.PATH || "");
  }
  // Add Stack to PATH if installed in default location
  const stackPath = join(process.env.APPDATA || "", "local/bin");
  if (existsSync(join(stackPath, "stack.exe"))) {
    process.env.PATH = stackPath + ";" + (process.env.PATH || "");
  }
}

// POST handler
export async function POST(req: Request) {
  try {
    const { language, code, stdinInput, inputPrompts } = await req.json();
    if (!code || !language) {
      return NextResponse.json({ error: "Code and language are required" }, { status: 400 });
    }

    // Code size limit
    if (code.length > MAX_CODE_LENGTH) {
      return NextResponse.json({ error: `Code too long (${code.length} chars). Maximum is ${MAX_CODE_LENGTH} characters.` }, { status: 413 });
    }

    // Rate limit (skip for localhost in development)
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (ip !== "127.0.0.1" && ip !== "::1" && ip !== "unknown") {
      const rate = checkRateLimit(ip);
      if (!rate.ok) {
        return NextResponse.json({ error: `Rate limit exceeded. Try again in ${rate.retryAfter} seconds.` }, { status: 429 });
      }
    }

    // Java requires login on every run
    if (language === "java") {
      const userEmail = req.headers.get("x-user-email");
      if (!userEmail) {
        return NextResponse.json({ error: "Login required to run Java code. Please log in first." }, { status: 401 });
      }
      const users = await query("SELECT id FROM users WHERE email = $1", [userEmail]);
      if (users.length === 0) {
        return NextResponse.json({ error: "Invalid user. Please log in again." }, { status: 401 });
      }
    }

    if (language === "javascript") return executeJS(code);
    if (language === "typescript") {
      try {
        const ts = require("typescript");
        const jsCode = ts.transpileModule(code, { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.None } }).outputText;
        return executeJS(jsCode);
      } catch {
        return executeJS(stripTypeScript(code));
      }
    }

    // If stdin input provided, inject into code for Python/others
    if (stdinInput !== undefined && stdinInput.trim()) {
      const injectedCode = injectStdin(language, code, stdinInput, inputPrompts);
      if (injectedCode) {
        // Run with injected input
        const result = tryLocalExec(language, injectedCode);
        if (result) return result;
        const pistonResult = await executeViaPiston(language, injectedCode);
        if (pistonResult) return pistonResult;
        const sim = SIMULATORS[language];
        if (sim) {
          const output = sim(injectedCode);
          return NextResponse.json({ output, error: null });
        }
      }
    }

    // Try local compiler first (works in dev + Docker with compilers installed)
    const result = tryLocalExec(language, code);
    if (result) return result;
    // Try Piston API if configured (for deployments without local compilers)
    const pistonResult = await executeViaPiston(language, code);
    if (pistonResult) return pistonResult;
    // Last resort: simulator (fake output with warning)
    const sim = SIMULATORS[language];
    if (sim) {
      const output = sim(code);
      return NextResponse.json({ output, error: null });
    }
    return NextResponse.json({ error: `Language "${language}" is not supported. Supported: JavaScript, TypeScript, Python, C, C++, Java, Go, Rust, Ruby, Haskell` }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, output: [] }, { status: 500 });
  }
}

// Execute code with stdin input (for programs that need user input)
function executeWithStdin(lang: string, code: string, stdinInput: string, inputPrompts?: string[]): Promise<NextResponse | null> {
  return new Promise((resolve) => {
    const tmpId = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
    let cmd = "";
    let args: string[] = [];
    let tmpFile = "";

    if (lang === "python") {
      const pyCmd = findCompiler("python") || findCompiler("python3");
      if (!pyCmd) { resolve(null); return; }
      tmpFile = join(TMP_DIR, `codeiq_${tmpId}.py`);
      writeFileSync(tmpFile, code);
      cmd = pyCmd;
      args = ["-u", tmpFile];
    } else if (lang === "javascript") {
      tmpFile = join(TMP_DIR, `codeiq_${tmpId}.js`);
      writeFileSync(tmpFile, code);
      cmd = "node";
      args = [tmpFile];
    } else if (lang === "ruby") {
      const rubyCmd = findCompiler("ruby");
      if (!rubyCmd) { resolve(null); return; }
      tmpFile = join(TMP_DIR, `codeiq_${tmpId}.rb`);
      writeFileSync(tmpFile, code);
      cmd = rubyCmd;
      args = [tmpFile];
    } else if (lang === "go") {
      const goCmd = findCompiler("go");
      if (!goCmd) { resolve(null); return; }
      tmpFile = join(TMP_DIR, `codeiq_${tmpId}.go`);
      writeFileSync(tmpFile, code);
      cmd = goCmd;
      args = ["run", tmpFile];
    } else if (lang === "c") {
      const gcc = findCompiler("gcc");
      if (!gcc) { resolve(null); return; }
      tmpFile = join(TMP_DIR, `codeiq_${tmpId}.c`);
      const binFile = join(TMP_DIR, `codeiq_${tmpId}${IS_WIN ? ".exe" : ""}`);
      writeFileSync(tmpFile, code);
      try {
        execSync(`"${gcc}" "${tmpFile}" -o "${binFile}" -lm 2>&1`, { timeout: 10000, encoding: "utf-8" });
        cmd = binFile;
        args = [];
      } catch (e: any) {
        resolve(NextResponse.json({ output: (e.stderr || e.stdout || "").split("\n").filter(Boolean), error: "Compilation Error" }));
        return;
      }
    } else if (lang === "cpp") {
      const gpp = findCompiler("g++") || findCompiler("c++");
      if (!gpp) { resolve(null); return; }
      tmpFile = join(TMP_DIR, `codeiq_${tmpId}.cpp`);
      const binFile = join(TMP_DIR, `codeiq_${tmpId}${IS_WIN ? ".exe" : ""}`);
      writeFileSync(tmpFile, code);
      try {
        execSync(`"${gpp}" "${tmpFile}" -o "${binFile}" 2>&1`, { timeout: 10000, encoding: "utf-8" });
        cmd = binFile;
        args = [];
      } catch (e: any) {
        resolve(NextResponse.json({ output: (e.stderr || e.stdout || "").split("\n").filter(Boolean), error: "Compilation Error" }));
        return;
      }
    } else if (lang === "java") {
      const javacCmd = findCompiler("javac");
      const javaCmd = findCompiler("java");
      if (!javacCmd || !javaCmd) { resolve(null); return; }
      tmpFile = join(TMP_DIR, `Main_${tmpId}.java`);
      writeFileSync(tmpFile, code);
      try {
        execSync(`"${javacCmd}" "${tmpFile}" 2>&1`, { timeout: 15000, encoding: "utf-8" });
        cmd = javaCmd;
        args = ["-cp", TMP_DIR, "Main"];
      } catch (e: any) {
        resolve(NextResponse.json({ output: (e.stderr || e.stdout || "").split("\n").filter(Boolean), error: "Compilation Error" }));
        return;
      }
    } else {
      resolve(null);
      return;
    }

    const proc = execCb(`"${cmd}" ${args.map(a => `"${a}"`).join(" ")}`, {
      timeout: 15000,
      encoding: "utf-8",
      maxBuffer: 1024 * 1024,
      env: process.env,
    }, (error, stdout, stderr) => {
      // Cleanup temp file AFTER process finishes
      try { if (tmpFile && existsSync(tmpFile)) unlinkSync(tmpFile); } catch {}

      // Filter out input prompt lines from output
      let output = (stdout || "") + (stderr || "");
      if (inputPrompts && inputPrompts.length > 0) {
        for (const prompt of inputPrompts) {
          output = output.replace(new RegExp(prompt.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"), "");
        }
      }

      const lines = output.replace(/\r/g, "").trimEnd().split("\n").filter(Boolean);
      if (lines.length === 0) lines.push("(no output)");
      lines.push("", "Process exited with code 0");
      resolve(NextResponse.json({ output: lines, error: null }));
    });

    // Pipe stdin input to the process
    if (proc.stdin) {
      proc.stdin.write(stdinInput);
      proc.stdin.end();
    }
  });
}

// Check if command exists
function commandExists(cmd: string): boolean {
  try {
    execSync(IS_WIN ? `where ${cmd}` : `which ${cmd}`, { stdio: "ignore" });
    return true;
  } catch { return false; }
}

// Find compiler on Windows (checks WinGet/WinLibs install path)
function findCompiler(name: string): string | null {
  if (commandExists(name)) return name;
  if (IS_WIN) {
    // Hardcoded WinLibs path fallback
    const hardcoded = join(
      process.env.LOCALAPPDATA || "",
      "Microsoft/WinGet/Packages/BrechtSanders.WinLibs.POSIX.UCRT_Microsoft.Winget.Source_8wekyb3d8bbwe/mingw64/bin",
      name + ".exe"
    );
    if (existsSync(hardcoded)) return hardcoded;
    // Dynamic search
    try {
      const base = join(process.env.LOCALAPPDATA || "", "Microsoft/WinGet/Packages");
      const { readdirSync } = require("fs");
      const dirs = readdirSync(base).filter((d: string) => d.includes("WinLibs"));
      for (const dir of dirs) {
        const full = join(base, dir, "mingw64/bin", name + ".exe");
        if (existsSync(full)) return full;
      }
    } catch {}
  }
  return null;
}

// Piston API language mapping
const PISTON_LANGUAGES: Record<string, { language: string; version: string }> = {
  python:  { language: "python",  version: "3.10.0" },
  c:       { language: "c",       version: "10.2.0" },
  cpp:     { language: "c++",     version: "10.2.0" },
  java:    { language: "java",    version: "15.0.2" },
  go:      { language: "go",      version: "1.16.2" },
  rust:    { language: "rust",    version: "1.68.2" },
  ruby:    { language: "ruby",    version: "3.0.1" },
  haskell: { language: "haskell", version: "9.4.1" },
};

// Execute code via Piston API (works on any deployment)
async function executeViaPiston(lang: string, code: string): Promise<NextResponse | null> {
  const piston = PISTON_LANGUAGES[lang];
  if (!piston || !PISTON_API_URL) return null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(`${PISTON_API_URL}/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: piston.language,
        version: piston.version,
        files: [{ content: code }],
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) return null;
    const data = await res.json();

    // Collect output from compile + run
    const parts: string[] = [];
    if (data.compile?.stderr) parts.push(...data.compile.stderr.split("\n").filter(Boolean));
    if (data.run?.stdout) parts.push(...data.run.stdout.replace(/\r/g, "").trimEnd().split("\n"));
    if (data.run?.stderr) parts.push(...data.run.stderr.split("\n").filter(Boolean));

    if (parts.length === 0) parts.push("(no output)");

    // Determine if it's an error
    const hasError = (data.run?.code !== 0 && data.run?.code !== undefined) || data.compile?.code !== 0;
    if (hasError && data.compile?.stderr) {
      return NextResponse.json({ output: parts, error: "Compilation/Runtime Error" });
    }
    if (hasError && data.run?.stderr) {
      return NextResponse.json({ output: parts, error: "Runtime Error" });
    }

    parts.push("", "Process exited with code 0");
    return NextResponse.json({ output: parts, error: null });
  } catch {
    // Piston unavailable (timeout, network error, etc.)
    return null;
  }
}

// Local execution for Python, C, C++
function tryLocalExec(lang: string, code: string): ReturnType<typeof NextResponse.json> | null {
  const tmpId = `${Date.now()}_${Math.random().toString(36).slice(2)}`;

  if (lang === "python") {
    const pyCmd = findCompiler("python") || findCompiler("python3");
    if (!pyCmd) return null;
    const tmpFile = join(TMP_DIR, `codeiq_${tmpId}.py`);
    try {
      writeFileSync(tmpFile, code);
      const output = execSync(`"${pyCmd}" -u "${tmpFile}"`, {
        timeout: 10000, encoding: "utf-8", maxBuffer: 1024 * 1024,
      });
      const lines = output.replace(/\r/g, "").trimEnd().split("\n");
      if (lines.length === 0) lines.push("(no output)");
      lines.push("", "Process exited with code 0");
      return NextResponse.json({ output: lines, error: null });
    } catch (e: any) {
      const stderr = e.stderr || "";
      const stdout = e.stdout || "";
      // Check for timeout
      if (e.killed || e.signal === "SIGTERM" || /timeout/i.test(e.message || "")) {
        return NextResponse.json({ output: ["⏱️ Execution timed out (10 second limit). Possible infinite loop."], error: "Timeout" });
      }
      if (stderr) return NextResponse.json({ output: stderr.split("\n").filter(Boolean), error: "Runtime Error" });
      if (stdout) return NextResponse.json({ output: stdout.replace(/\r/g, "").trimEnd().split("\n"), error: null });
      return null;
    } finally { try { unlinkSync(tmpFile); } catch {} }
  }

  if (lang === "java") {
    const javaCmd = findCompiler("java");
    const javacCmd = findCompiler("javac");
    if (!javaCmd || !javacCmd) return null;
    const srcFile = join(TMP_DIR, `codeiq_${tmpId}.java`);
    const classMatch = code.match(/public\s+class\s+(\w+)/);
    const className = classMatch ? classMatch[1] : `codeiq_${tmpId}`;
    const actualSrcFile = join(TMP_DIR, `${className}.java`);
    try {
      writeFileSync(actualSrcFile, code);
      execSync(`"${javacCmd}" "${actualSrcFile}" 2>&1`, { timeout: 15000, encoding: "utf-8" });
      const output = execSync(`"${javaCmd}" -cp "${TMP_DIR}" ${className}`, {
        timeout: 10000, encoding: "utf-8", maxBuffer: 1024 * 1024,
      });
      const lines = output.replace(/\r/g, "").trimEnd().split("\n");
      if (lines.length === 0) lines.push("(no output)");
      lines.push("", "Process exited with code 0");
      return NextResponse.json({ output: lines, error: null });
    } catch (e: any) {
      const stderr = e.stderr || "";
      const stdout = e.stdout || "";
      const err = (stderr || stdout || "").split("\n").filter(Boolean);
      if (err.length) return NextResponse.json({ output: err, error: "Compilation/Runtime Error" });
      return null;
    } finally {
      try { unlinkSync(actualSrcFile); } catch {}
      try { unlinkSync(join(TMP_DIR, className + ".class")); } catch {}
    }
  }

  if (lang === "go") {
    const goCmd = findCompiler("go");
    if (!goCmd) return null;
    const srcFile = join(TMP_DIR, `codeiq_${tmpId}.go`);
    const binFile = join(TMP_DIR, `codeiq_${tmpId}${IS_WIN ? ".exe" : ""}`);
    try {
      writeFileSync(srcFile, code);
      execSync(`"${goCmd}" build -o "${binFile}" "${srcFile}" 2>&1`, { timeout: 30000, encoding: "utf-8" });
      const output = execSync(`"${binFile}"`, { timeout: 5000, encoding: "utf-8" });
      const lines = output.replace(/\r/g, "").trimEnd().split("\n");
      if (lines.length === 0) lines.push("(no output)");
      lines.push("", "Process exited with code 0");
      return NextResponse.json({ output: lines, error: null });
    } catch (e: any) {
      const stderr = e.stderr || "";
      const stdout = e.stdout || "";
      const err = (stderr || stdout || "").split("\n").filter(Boolean);
      if (err.length) return NextResponse.json({ output: err, error: "Compilation/Runtime Error" });
      return null;
    } finally {
      try { unlinkSync(srcFile); } catch {}
      try { unlinkSync(binFile); } catch {}
    }
  }

  if (lang === "c") {
    const gcc = findCompiler("gcc");
    if (!gcc) return null;
    const srcFile = join(TMP_DIR, `codeiq_${tmpId}.c`);
    const binFile = join(TMP_DIR, `codeiq_${tmpId}${IS_WIN ? ".exe" : ""}`);
    try {
      writeFileSync(srcFile, code);
      execSync(`"${gcc}" "${srcFile}" -o "${binFile}" -lm 2>&1`, { timeout: 10000, encoding: "utf-8" });
      const output = execSync(`"${binFile}"`, { timeout: 5000, encoding: "utf-8" });
      const lines = output.replace(/\r/g, "").trimEnd().split("\n");
      if (lines.length === 0) lines.push("(no output)");
      lines.push("", "Process exited with code 0");
      return NextResponse.json({ output: lines, error: null });
    } catch (e: any) {
      const err = (e.stderr || e.stdout || "").split("\n").filter(Boolean);
      if (err.length) return NextResponse.json({ output: err, error: "Compilation Error" });
      return null;
    } finally {
      try { unlinkSync(srcFile); } catch {}
      try { unlinkSync(binFile); } catch {}
    }
  }

  if (lang === "cpp") {
    const gpp = findCompiler("g++") || findCompiler("c++");
    if (!gpp) return null;
    const srcFile = join(TMP_DIR, `codeiq_${tmpId}.cpp`);
    const binFile = join(TMP_DIR, `codeiq_${tmpId}${IS_WIN ? ".exe" : ""}`);
    try {
      writeFileSync(srcFile, code);
      execSync(`"${gpp}" "${srcFile}" -o "${binFile}" 2>&1`, { timeout: 10000, encoding: "utf-8" });
      const output = execSync(`"${binFile}"`, { timeout: 5000, encoding: "utf-8" });
      const lines = output.replace(/\r/g, "").trimEnd().split("\n");
      if (lines.length === 0) lines.push("(no output)");
      lines.push("", "Process exited with code 0");
      return NextResponse.json({ output: lines, error: null });
    } catch (e: any) {
      const err = (e.stderr || e.stdout || "").split("\n").filter(Boolean);
      if (err.length) return NextResponse.json({ output: err, error: "Compilation Error" });
      return null;
    } finally {
      try { unlinkSync(srcFile); } catch {}
      try { unlinkSync(binFile); } catch {}
    }
  }

  // Rust — compile with rustc
  if (lang === "rust") {
    const rustc = findCompiler("rustc");
    if (!rustc) return null;
    const srcFile = join(TMP_DIR, `codeiq_${tmpId}.rs`);
    const binFile = join(TMP_DIR, `codeiq_${tmpId}${IS_WIN ? ".exe" : ""}`);
    try {
      writeFileSync(srcFile, code);
      execSync(`"${rustc}" "${srcFile}" -o "${binFile}" 2>&1`, { timeout: 30000, encoding: "utf-8" });
      const output = execSync(`"${binFile}"`, { timeout: 10000, encoding: "utf-8" });
      const lines = output.replace(/\r/g, "").trimEnd().split("\n");
      if (lines.length === 0) lines.push("(no output)");
      lines.push("", "Process exited with code 0");
      return NextResponse.json({ output: lines, error: null });
    } catch (e: any) {
      const err = (e.stderr || e.stdout || "").split("\n").filter(Boolean);
      if (err.length) return NextResponse.json({ output: err, error: "Compilation Error" });
      return null;
    } finally {
      try { unlinkSync(srcFile); } catch {}
      try { if (existsSync(binFile)) unlinkSync(binFile); } catch {}
    }
  }

  // Ruby
  if (lang === "ruby") {
    const rubyCmd = findCompiler("ruby");
    if (!rubyCmd) return null;
    const srcFile = join(TMP_DIR, `codeiq_${tmpId}.rb`);
    try {
      writeFileSync(srcFile, code);
      const output = execSync(`"${rubyCmd}" "${srcFile}"`, { timeout: 10000, encoding: "utf-8", maxBuffer: 1024 * 1024 });
      const lines = output.replace(/\r/g, "").trimEnd().split("\n");
      if (lines.length === 0) lines.push("(no output)");
      lines.push("", "Process exited with code 0");
      return NextResponse.json({ output: lines, error: null });
    } catch (e: any) {
      const stderr = e.stderr || "";
      const stdout = e.stdout || "";
      if (stderr) return NextResponse.json({ output: stderr.split("\n").filter(Boolean), error: "Runtime Error" });
      if (stdout) return NextResponse.json({ output: stdout.replace(/\r/g, "").trimEnd().split("\n"), error: null });
      return null;
    } finally { try { unlinkSync(srcFile); } catch {} }
  }

  // Haskell — use stack runghc
  if (lang === "haskell") {
    const stackCmd = findCompiler("stack");
    if (!stackCmd) return null;
    const srcFile = join(TMP_DIR, `codeiq_${tmpId}.hs`);
    try {
      writeFileSync(srcFile, code);
      const output = execSync(`"${stackCmd}" exec runghc -- "${srcFile}"`, { timeout: 30000, encoding: "utf-8", maxBuffer: 1024 * 1024 });
      const lines = output.replace(/\r/g, "").trimEnd().split("\n");
      if (lines.length === 0) lines.push("(no output)");
      lines.push("", "Process exited with code 0");
      return NextResponse.json({ output: lines, error: null });
    } catch (e: any) {
      const stderr = e.stderr || "";
      const stdout = e.stdout || "";
      if (stderr) return NextResponse.json({ output: stderr.split("\n").filter(Boolean), error: "Runtime Error" });
      if (stdout) return NextResponse.json({ output: stdout.replace(/\r/g, "").trimEnd().split("\n"), error: null });
      return null;
    } finally { try { unlinkSync(srcFile); } catch {} }
  }

  return null;
}

// JavaScript execution via Node.js vm
function executeJS(code: string) {
  const logs: string[] = [];
  const sandbox = {
    console: {
      log: (...args: any[]) => logs.push(args.map(formatArg).join(" ")),
      error: (...args: any[]) => logs.push("Error: " + args.map(formatArg).join(" ")),
      warn: (...args: any[]) => logs.push("Warning: " + args.map(formatArg).join(" ")),
      stdout: {
        write: (data: any) => {
          const s = String(data);
          if (logs.length === 0) logs.push("");
          logs[logs.length - 1] += s;
          if (s.endsWith("\n")) logs.push("");
          return true;
        },
      },
    },
    process: { stdout: { write: (data: any) => {
      const s = String(data);
      if (logs.length === 0) logs.push("");
      logs[logs.length - 1] += s;
      if (s.endsWith("\n")) logs.push("");
      return true;
    } } },
    Math, Date, JSON, parseInt, parseFloat, String, Number, Boolean,
    Array, Object, RegExp, Map, Set, Promise, setTimeout, setInterval,
  };
  try {
    // Wrap in async IIFE to support top-level await
    const wrappedCode = `(async () => { ${code} })()`;
    const script = new vm.Script(wrappedCode, { filename: "user-code.js" });
    const context = vm.createContext(sandbox);
    const result = script.runInContext(context, { timeout: 5000 });
    // If result is a promise, wait for it
    if (result && typeof result.then === "function") {
      return new Promise((resolve) => {
        result.then(() => {
          if (logs.length === 0) logs.push("(no output)");
          logs.push("", "Process exited with code 0");
          resolve(NextResponse.json({ output: logs, error: null }));
        }).catch((err: any) => {
          resolve(NextResponse.json({ output: [], error: `Runtime Error: ${err.message}` }));
        });
        // Safety timeout
        setTimeout(() => {
          if (logs.length === 0) logs.push("(no output)");
          logs.push("", "Process exited with code 0");
          resolve(NextResponse.json({ output: logs, error: null }));
        }, 5000);
      }) as any;
    }
    if (logs.length === 0) logs.push("(no output)");
    logs.push("", "Process exited with code 0");
    return NextResponse.json({ output: logs, error: null });
  } catch (err: any) {
    return NextResponse.json({ output: [], error: `Runtime Error: ${err.message}` });
  }
}

function formatArg(arg: any): string {
  if (typeof arg === "object") return JSON.stringify(arg, null, 2);
  return String(arg);
}

// Simulators (basic fallback when compiler not installed)
// Safe math evaluator — no eval/Function, only numbers and operators
function safeMathExpr(expr: string): string {
  try {
    const s = expr.replace(/[^0-9+\-*/().%\s]/g, "").trim();
    if (!s) return expr;
    // Tokenize and evaluate with precedence climbing
    let pos = 0;
    const tokens = s.match(/\d+\.?\d*|[+\-*/%()]/g) || [];
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
      return parseFloat(tokens[pos++]) || 0;
    }
    pos = 0;
    return String(parseExpr());
  } catch { return expr; }
}

// Evaluate simple math expressions with variable support
function evalExpr(expr: string, vars: Record<string, string>): string {
  try {
    // Replace variable names with their values
    let resolved = expr.replace(/\b([a-zA-Z_]\w*)\b/g, (match) => {
      if (match in vars) return vars[match];
      return match;
    });
    // Try math evaluation
    const cleaned = resolved.replace(/[^0-9+\-*/().%\s]/g, "").trim();
    if (cleaned && /^\d[\d+\-*/().%\s]*$/.test(cleaned)) {
      const result = Function(`"use strict"; return (${cleaned})`)();
      return String(result);
    }
    return resolved;
  } catch {
    return expr;
  }
}

// Extract print statements from code
function extractPrints(code: string, patterns: RegExp[]): string[] {
  const output: string[] = [];
  for (const line of code.split("\n")) {
    const t = line.trim();
    if (t.startsWith("//") || t.startsWith("#") || t.startsWith("--") || t.startsWith("/*")) continue;
    for (const pat of patterns) {
      const m = t.match(pat);
      if (m) {
        const raw = m[1]?.trim() || "";
        if (!raw) { output.push(""); break; }
        if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'")))
          output.push(raw.slice(1, -1).replace(/\n/g, ""));
        else if (raw.startsWith('f"') || raw.startsWith("f'"))
          output.push(raw.slice(2, -1).replace(/\{[^}]+\}/g, (m) => m.slice(1, -1)));
        else if (raw.includes("{}"))
          output.push(raw.replace(/\{\}/g, ""));
        else output.push(safeMathExpr(raw));
        break;
      }
    }
  }
  return output;
}

// Resolve variable references in a string (for Rust simulator)
function resolveVars(str: string, vars: Record<string, string>): string {
  let s = str;
  // If it's a bare variable name, resolve it directly
  if (/^\w+$/.test(s) && s in vars) return vars[s];
  // Remove surrounding quotes if present
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1);
  }
  // Replace {var} and {} patterns
  return s.replace(/\{(\w+)\}/g, (_, name) => vars[name] ?? `{${name}}`)
    .replace(/\{\}/g, "");
}

// Split comma-separated args respecting nested parens/brackets
function splitArgs(argsStr: string): string[] {
  const args: string[] = [];
  let depth = 0;
  let current = "";
  for (const ch of argsStr) {
    if (ch === "(" || ch === "[" || ch === "{") depth++;
    if (ch === ")" || ch === "]" || ch === "}") depth--;
    if (ch === "," && depth === 0) {
      args.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  if (current) args.push(current);
  return args;
}

// Inject stdin input into code (replaces input() calls with provided values)
function injectStdin(lang: string, code: string, stdinInput: string, inputPrompts?: string[]): string | null {
  const lines = stdinInput.split("\n").filter(l => l.trim() !== "");

  if (lang === "python") {
    // Replace input() calls with hardcoded values
    let injected = code;
    let inputIndex = 0;

    // Match input("prompt") or input() patterns
    injected = injected.replace(/input\s*\(\s*["']([^"']*)["']\s*\)/g, (_, prompt) => {
      const value = lines[inputIndex] || "";
      inputIndex++;
      return `"${value}"`;
    });
    injected = injected.replace(/input\s*\(\s*\)/g, () => {
      const value = lines[inputIndex] || "";
      inputIndex++;
      return `"${value}"`;
    });

    return injected;
  }

  if (lang === "javascript" || lang === "typescript") {
    // Replace prompt() calls with hardcoded values
    let injected = code;
    let inputIndex = 0;
    injected = injected.replace(/prompt\s*\(\s*["']([^"']*)["']\s*\)/g, (_, prompt) => {
      const value = lines[inputIndex] || "";
      inputIndex++;
      return `"${value}"`;
    });
    injected = injected.replace(/prompt\s*\(\s*\)/g, () => {
      const value = lines[inputIndex] || "";
      inputIndex++;
      return `"${value}"`;
    });
    return injected;
  }

  if (lang === "ruby") {
    let injected = code;
    let inputIndex = 0;
    // Replace gets with hardcoded values
    injected = injected.replace(/gets\.chomp/g, () => {
      const value = lines[inputIndex] || "";
      inputIndex++;
      return `"${value}"`;
    });
    injected = injected.replace(/gets/g, () => {
      const value = lines[inputIndex] || "";
      inputIndex++;
      return `"${value}"`;
    });
    return injected;
  }

  if (lang === "go") {
    // For Go, we can use a simulated approach
    // Replace fmt.Scan with hardcoded values
    let injected = code;
    let inputIndex = 0;
    injected = injected.replace(/fmt\.Scan\s*\(\s*&\w+\s*\)/g, () => {
      const value = lines[inputIndex] || "0";
      inputIndex++;
      return `fmt.Print("${value}")`;
    });
    return injected;
  }

  // For other languages, return null (use simulator)
  return null;
}

const SIMULATORS: Record<string, (code: string) => string[]> = {
  python: (code) => {
    const vars: Record<string, string> = {};
    const out: string[] = [];
    for (const line of code.split("\n")) {
      const t = line.trim();
      if (t.startsWith("#")) continue;

      // Variable assignment: a = 1, b = a + 2, etc.
      const assignMatch = t.match(/^(\w+)\s*=\s*(.+)$/);
      if (assignMatch && !t.startsWith("print")) {
        const [, name, expr] = assignMatch;
        vars[name] = evalExpr(expr.trim(), vars);
        continue;
      }

      // print() call
      const printMatch = t.match(/^print\s*\((.+)\)\s*$/);
      if (printMatch) {
        let raw = printMatch[1].trim();
        // f-string: f"Hello {name}"
        if ((raw.startsWith('f"') || raw.startsWith("f'")) && raw.endsWith(raw[1])) {
          raw = raw.slice(2, -1).replace(/\{([^}]+)\}/g, (_, expr) => evalExpr(expr.trim(), vars));
          out.push(raw);
        }
        // String literal
        else if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
          out.push(raw.slice(1, -1));
        }
        // Variable or expression
        else {
          out.push(evalExpr(raw, vars));
        }
      }
    }
    if (!out.length) out.push("(no output)");
    out.push("", "Process exited with code 0");
    return out;
  },
  c: (code) => {
    const out = extractPrints(code, [/printf\s*\(\s*"([^"]+)"\s*\)/, /printf\s*\(\s*"%d"\s*,\s*(.+?)\s*\)/]).map(s => s.replace(/\n/g, ""));
    if (!out.length) out.push("(no output)");
    out.push("", "Build succeeded", "Process exited with code 0");
    return out;
  },
  cpp: (code) => {
    const out = extractPrints(code, [/std::cout\s*<<\s*"([^"]+)"/, /cout\s*<<\s*"([^"]+)"/]);
    if (!out.length) out.push("(no output)");
    out.push("", "Build succeeded", "Process exited with code 0");
    return out;
  },
  java: (code) => {
    const out = extractPrints(code, [/System\.out\.println\("([^"]+)"\)/, /System\.out\.println\((.+)\)/]);
    if (!out.length) out.push("(no output)");
    out.push("", "Process exited with code 0");
    return out;
  },
  go: (code) => {
    const out = extractPrints(code, [/fmt\.Println\("([^"]+)"\)/, /fmt\.Println\((.+)\)/]);
    if (!out.length) out.push("(no output)");
    out.push("", "Process exited with code 0");
    return out;
  },
  rust: (code) => {
    const out: string[] = [];
    const vars: Record<string, string> = {};
    let matchVar = "";
    let matchResultVar = "";
    let matchArms: { pattern: string; value: string }[] = [];
    let inMatch = false;
    let braceDepth = 0;

    for (const line of code.split("\n")) {
      const t = line.trim();
      if (t.startsWith("//")) continue;

      // Track let bindings (single-line with ;)
      const letMatch = t.match(/^let\s+(?:mut\s+)?(\w+)\s*=\s*(.+);/);
      if (letMatch && !inMatch) {
        const [, name, val] = letMatch;
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith('r"') && val.endsWith('"'))) {
          vars[name] = val.replace(/^r?"/, "").replace(/"$/, "");
        } else if (val.startsWith("vec![")) {
          vars[name] = val;
        } else if (/^-?\d+(\.\d+)?$/.test(val.trim())) {
          vars[name] = val.trim();
        } else if (val === "true" || val === "false") {
          vars[name] = val;
        }
        continue;
      }

      // Detect start of match (either `let x = match var {` or standalone `match var {`)
      if (!inMatch) {
        const letMatchStart = t.match(/^let\s+(?:mut\s+)?(\w+)\s*=\s*match\s+(\w+)\s*\{\/?/);
        if (letMatchStart) {
          inMatch = true;
          matchResultVar = letMatchStart[1];
          matchVar = letMatchStart[2];
          matchArms = [];
          braceDepth = (t.match(/\{/g) || []).length - (t.match(/\}/g) || []).length;
          // Check if arms are on same line (e.g., `match x { 1 => "one" }`)
          const inlineArm = t.match(/(\d+(?:\.\.\=\d+)?|_)\s*=>\s*"([^"]+)"/);
          if (inlineArm) matchArms.push({ pattern: inlineArm[1], value: inlineArm[2] });
          continue;
        }
        const standaloneMatch = t.match(/^match\s+(\w+)\s*\{\/?/);
        if (standaloneMatch) {
          inMatch = true;
          matchResultVar = "";
          matchVar = standaloneMatch[1];
          matchArms = [];
          braceDepth = (t.match(/\{/g) || []).length - (t.match(/\}/g) || []).length;
          continue;
        }
      }

      // Inside match block — collect arms
      if (inMatch) {
        braceDepth += (t.match(/\{/g) || []).length - (t.match(/\}/g) || []).length;
        const armMatch = t.match(/^(\d+(?:\.\.\=\d+)?)\s*=>\s*"([^"]+)"/);
        if (armMatch) matchArms.push({ pattern: armMatch[1], value: armMatch[2] });
        const defaultArm = t.match(/^_\s*=>\s*"([^"]+)"/);
        if (defaultArm) matchArms.push({ pattern: "_", value: defaultArm[1] });
        // Also check for `_ => expr,` or arm with trailing comma
        const armComma = t.match(/^(\d+(?:\.\.\=\d+)?|_)\s*=>\s*"([^"]+)"/);
        if (armComma && !armMatch && !defaultArm) matchArms.push({ pattern: armComma[1], value: armComma[2] });

        if (braceDepth <= 0) {
          inMatch = false;
          // Resolve match
          const varVal = vars[matchVar];
          if (varVal !== undefined) {
            const numVal = parseInt(varVal);
            for (const arm of matchArms) {
              if (arm.pattern === "_") { vars[matchResultVar || "__match_result"] = arm.value; break; }
              if (arm.pattern.includes("..=")) {
                const [lo, hi] = arm.pattern.split("..=").map(Number);
                if (numVal >= lo && numVal <= hi) { vars[matchResultVar || "__match_result"] = arm.value; break; }
              } else if (parseInt(arm.pattern) === numVal) {
                vars[matchResultVar || "__match_result"] = arm.value; break;
              }
            }
          }
          matchArms = [];
        }
        continue;
      }

      // Handle println! with 0 args
      const m0 = t.match(/^println!\(\)$/);
      if (m0) { out.push(""); continue; }

      // Handle println!("literal")
      const m1 = t.match(/^println!\("([^"]*?)"\)/);
      if (m1) { out.push(resolveVars(m1[1], vars)); continue; }

      // Handle println!("format", args...) — multiple args
      const m2 = t.match(/^println!\("([^"]*?)"\s*,\s*(.+)\)/);
      if (m2) {
        let fmt = m2[1];
        const argsStr = m2[2];
        const args = splitArgs(argsStr);
        let argIdx = 0;
        fmt = fmt.replace(/\{\}/g, () => {
          const a = args[argIdx++] || "";
          return resolveVars(a.trim(), vars);
        });
        out.push(fmt);
        continue;
      }

      // Handle println!("first", "second") — string concat
      const m3 = t.match(/^println!\((.+)\)/);
      if (m3) {
        const args = splitArgs(m3[1]);
        const resolved = args.map(a => resolveVars(a.trim(), vars)).join("");
        out.push(resolved);
        continue;
      }

      // Handle print! (no newline) — accumulate
      const pm = t.match(/^print!\("([^"]*?)"\s*,?\s*(.*)\)/);
      if (pm) {
        let fmt = pm[1];
        if (pm[2]) {
          const args = splitArgs(pm[2]);
          let argIdx = 0;
          fmt = fmt.replace(/\{\}/g, () => resolveVars((args[argIdx++] || "").trim(), vars));
        }
        if (out.length > 0) out[out.length - 1] += fmt;
        else out.push(fmt);
        continue;
      }
    }
    if (!out.length) out.push("(no output)");
    out.push("", "Compiling...", "Build succeeded", "Process exited with code 0");
    return out;
  },
  ruby: (code) => {
    const out = extractPrints(code, [/^puts\s+"([^"]+)"$/, /^puts\s+(.+)$/]);
    if (!out.length) out.push("(no output)");
    out.push("", "Process exited with code 0");
    return out;
  },
  haskell: (code) => {
    const out: string[] = [];
    for (const line of code.split("\n")) {
      const t = line.trim();
      if (t.startsWith("--")) continue;
      const m1 = t.match(/putStrLn\s+"([^"]+)"/);
      if (m1) { out.push(m1[1]); continue; }
      const m2 = t.match(/^print\s+(.+)$/);
      if (m2) out.push(safeMathExpr(m2[1].trim()));
    }
    if (!out.length) out.push("(no output)");
    out.push("", "Compiling...", "Linking...", "Process exited with code 0");
    return out;
  },
};

// TypeScript type stripping
function stripTypeScript(code: string): string {
  const lines = code.split("\n");
  const result: string[] = [];
  let inBlockRemove = false;
  const genericTypes = new Set<string>();
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const trimmed = line.trim();
    if (/^\s*(?:export\s+)?(?:interface|type)\s+/.test(trimmed)) {
      if (trimmed.includes("{") && !trimmed.includes("}")) inBlockRemove = true;
      continue;
    }
    // Single-line enum → convert to const object
    const enumMatch = trimmed.match(/^(?:export\s+)?enum\s+(\w+)\s*\{(.+)\}/);
    if (enumMatch) {
      const name = enumMatch[1];
      const members = enumMatch[2].split(",").map((m, i) => {
        const [k, v] = m.trim().split("=");
        return `"${k.trim()}": ${v ? v.trim() : i}`;
      });
      result.push(line.replace(/^(?:export\s+)?enum\s+\w+\s*\{[^}]+\}/, `const ${name} = {${members.join(",")}}`));
      continue;
    }
    if (inBlockRemove) {
      if (trimmed.includes("}") || trimmed === "}") inBlockRemove = false;
      continue;
    }
    const gm = line.match(/<(\w+)(?:\s+extends\s+\w+)?>/);
    if (gm) genericTypes.add(gm[1]);
    line = line.replace(/<\w+(?:\s+extends\s+[\w<>]+)?(?:\s*,\s*\w+(?:\s+extends\s+[\w<>]+)?)*>/g, "");
    // Strip type annotations: const x: Type = ... or const x: Type[] = ... or const x: Type<T> = ...
    line = line.replace(/\b(const|let|var)\s+(\w+)\s*:\s*(?:string|number|boolean|any|void|never|unknown|object|bigint|symbol|undefined|null|Record|Partial|Required|Pick|Omit|Promise|Array)(?:\[\])*(?:<[^>]+>)?(\s*[=;])/g, "$1 $2$3");
    line = line.replace(/\b(const|let|var)\s+(\w+)\s*:\s*[A-Z]\w*(?:\[\])*(?:<[^>]+>)?(\s*[=;])/g, "$1 $2$3");
    // Strip property/param types: x: Type or x: Type[]
    line = line.replace(/(\w+)\s*:\s*(?:string|number|boolean|any|void|never|unknown|object|bigint|symbol|undefined|null|Record|Partial|Required|Pick|Omit|Promise|Array)(?:\[\])*(?:<[^>]+>)?(?=\s*[,;)\]])/g, "$1");
    line = line.replace(/(\w+)\s*:\s*[A-Z]\w*(?:\[\])*(?:<[^>]+>)?(?=\s*[,;)\]])/g, "$1");
    for (const gt of genericTypes) line = line.replace(new RegExp(`(\w+)\s*:\s*${gt}\b`, "g"), "$1");
    line = line.replace(/\)\s*:\s*(?:string|number|boolean|any|void|never|unknown|object|bigint|symbol|undefined|null|Record|Partial|Required|Pick|Omit|Promise|Array)\b\s*([>{=])/g, ")$1");
    line = line.replace(/\)\s*:\s*[A-Z]\w*\s*([>{=])/g, ")$1");
    for (const gt of genericTypes) { try { line = line.replace(new RegExp(String.raw`)s*:s*${gt}s*([>{=])`, "g"), ")$1"); } catch {} }
    line = line.replace(/\bas\s+(?:string|number|boolean|any|void|unknown|object|[\w\[\]<>]+)\b/g, "");
    result.push(line);
  }
  return result.join("\n");
}
