import { NextResponse } from "next/server";
import vm from "vm";
import { execSync, exec as execCb } from "child_process";
import { writeFileSync, unlinkSync, existsSync } from "fs";
import { join } from "path";
import { query } from "@/lib/db";
import { getLanguageByEditorKey } from "@/lib/languageRegistry";

export const maxDuration = 60;

const IS_WIN = process.platform === "win32";
const TMP_DIR = IS_WIN ? (process.env.TEMP || "C:/Temp") : "/tmp";
const IS_VERCEL = process.env.VERCEL === "1" || process.env.VERCEL === "true";
const JUDGE0_API_URL = (process.env.JUDGE0_API_URL || "").trim().replace(/\/+$/, "");
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY || "";
const MAX_CODE_LENGTH = 50000;

function executionRequestId(): string { return Math.random().toString(36).slice(2, 10); }
function isValidJudge0Url(value: string): boolean { if (!value || value.includes("your-server-ip")) return false; try { const url = new URL(value); return (url.protocol === "http:" || url.protocol === "https:") && Boolean(url.hostname); } catch { return false; } }
function judge0Hostname(value: string): string | null { try { return new URL(value).hostname || null; } catch { return null; } }
function logJudge0Config(): void { console.info("[Judge0] configuration", { urlConfigured: Boolean(JUDGE0_API_URL), hostname: judge0Hostname(JUDGE0_API_URL), apiKeyConfigured: Boolean(JUDGE0_API_KEY), urlValid: isValidJudge0Url(JUDGE0_API_URL) }); }
function judge0ServiceResponse(message: string, status: string, httpStatus = 503, requestId?: string): NextResponse { console.error("[JUDGE0 DEBUG] final API response", { requestId: requestId ?? null, httpStatus, status, error: message, outputLength: 0 }); return NextResponse.json({ output: [], error: message, status }, { status: httpStatus }); }
function judge0HttpError(statusCode: number): { error: string; status: string } { if (statusCode === 401 || statusCode === 403) return { error: "Judge0 authentication failed. Check the server-side API key configuration.", status: "Authentication Error" }; if (statusCode === 404) return { error: "Judge0 endpoint was not found. Check JUDGE0_API_URL.", status: "Invalid Endpoint" }; if (statusCode === 429) return { error: "Judge0 rate limit exceeded. Please try again later.", status: "Rate Limited" }; if (statusCode >= 500) return { error: "Judge0 is temporarily unavailable.", status: "Judge0 Service Error" }; return { error: "Judge0 rejected the execution request.", status: "Judge0 Request Error" }; }
async function readJudge0Response(response: Response): Promise<{ error?: unknown; status?: unknown; token?: unknown }> { try { const body = await response.json() as Record<string, unknown>; return { error: body.error, status: body.status, token: body.token }; } catch { return {}; } }

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 50; const RATE_WINDOW = 60_000;
function checkRateLimit(ip: string): { ok: boolean; retryAfter?: number } { const now = Date.now(); const entry = rateLimitMap.get(ip); if (!entry || now > entry.resetAt) { rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW }); return { ok: true }; } entry.count++; if (entry.count > RATE_LIMIT) return { ok: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) }; return { ok: true }; }
setInterval(() => { const now = Date.now(); for (const [ip, entry] of rateLimitMap) if (now > entry.resetAt) rateLimitMap.delete(ip); }, 300_000);

if (IS_WIN) {
  try { const { readdirSync } = require("fs"); const base = join(process.env.LOCALAPPDATA || "", "Microsoft/WinGet/Packages"); const dirs = readdirSync(base).filter((d: string) => d.includes("WinLibs")); for (const dir of dirs) { const binDir = join(base, dir, "mingw64/bin"); if (existsSync(join(binDir, "gcc.exe"))) { process.env.PATH = binDir + ";" + (process.env.PATH || ""); break; } } } catch { }
  const goPath = "C:/Program Files/Go/bin"; if (existsSync(join(goPath, "go.exe"))) process.env.PATH = goPath + ";" + (process.env.PATH || "");
  const rubyPath = "C:/Ruby33-x64/bin"; if (existsSync(join(rubyPath, "ruby.exe"))) process.env.PATH = rubyPath + ";" + (process.env.PATH || "");
  const stackPath = join(process.env.APPDATA || "", "local/bin"); if (existsSync(join(stackPath, "stack.exe"))) process.env.PATH = stackPath + ";" + (process.env.PATH || "");
}

export async function POST(req: Request) {
  const requestId = executionRequestId();
  try {
    const { language, code, stdinInput, inputPrompts } = await req.json();
    if (!code || !language) return NextResponse.json({ error: "Code and language are required" }, { status: 400 });
    if (code.length > MAX_CODE_LENGTH) return NextResponse.json({ error: `Code too long (${code.length} chars). Maximum is ${MAX_CODE_LENGTH} characters.` }, { status: 413 });

    const registryLanguage = await getLanguageByEditorKey(language);
    if (!registryLanguage) return NextResponse.json({ output: [], error: `Language "${language}" is not enabled in the CodeIQ language registry.` }, { status: 400 });

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (ip !== "127.0.0.1" && ip !== "::1" && ip !== "unknown") { const rate = checkRateLimit(ip); if (!rate.ok) return NextResponse.json({ error: `Rate limit exceeded. Try again in ${rate.retryAfter} seconds.` }, { status: 429 }); }

    if (language === "java") {
      const userEmail = req.headers.get("x-user-email");
      if (!userEmail) return NextResponse.json({ error: "Login required to run Java code. Please log in first." }, { status: 401 });
      const users = await query("SELECT id FROM users WHERE email = $1", [userEmail]);
      if (users.length === 0) return NextResponse.json({ error: "Invalid user. Please log in again." }, { status: 401 });
    }

    if (language === "javascript") return executeJS(code);
    if (language === "typescript") { try { const ts = require("typescript"); const jsCode = ts.transpileModule(code, { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.None } }).outputText; return executeJS(jsCode); } catch { return executeJS(stripTypeScript(code)); } }

    if (!IS_VERCEL && stdinInput !== undefined && stdinInput.trim()) { const localResult = await executeWithStdin(language, code, stdinInput, inputPrompts); if (localResult) return localResult; }
    if (!IS_VERCEL) { const result = tryLocalExec(language, code); if (result) return result; }

    const judgeResult = await executeViaJudge0(language, code, stdinInput, requestId, registryLanguage.languageId);
    if (judgeResult) return judgeResult;
    if (registryLanguage.executionType === "judge0" && !isValidJudge0Url(JUDGE0_API_URL)) return judge0ServiceResponse("Code execution service is temporarily unavailable.", "Service Unavailable", 503, requestId);
    return NextResponse.json({ output: [], error: `Language "${language}" is not supported by the configured execution engine.` }, { status: 400 });
  } catch (error: any) { return NextResponse.json({ error: error.message, output: [] }, { status: 500 }); }
}

function executeWithStdin(lang: string, code: string, stdinInput: string, inputPrompts?: string[]): Promise<NextResponse | null> {
  return new Promise((resolve) => {
    const tmpId = `${Date.now()}_${Math.random().toString(36).slice(2)}`; let cmd = ""; let args: string[] = []; let tmpFile = "";
    if (lang === "python") { const pyCmd = findCompiler("python") || findCompiler("python3"); if (!pyCmd) { resolve(null); return; } tmpFile = join(TMP_DIR, `codeiq_${tmpId}.py`); writeFileSync(tmpFile, code); cmd = pyCmd; args = ["-u", tmpFile]; }
    else if (lang === "javascript") { tmpFile = join(TMP_DIR, `codeiq_${tmpId}.js`); writeFileSync(tmpFile, code); cmd = "node"; args = [tmpFile]; }
    else if (lang === "ruby") { const rubyCmd = findCompiler("ruby"); if (!rubyCmd) { resolve(null); return; } tmpFile = join(TMP_DIR, `codeiq_${tmpId}.rb`); writeFileSync(tmpFile, code); cmd = rubyCmd; args = [tmpFile]; }
    else if (lang === "go") { const goCmd = findCompiler("go"); if (!goCmd) { resolve(null); return; } tmpFile = join(TMP_DIR, `codeiq_${tmpId}.go`); writeFileSync(tmpFile, code); cmd = goCmd; args = ["run", tmpFile]; }
    else if (lang === "c") { const gcc = findCompiler("gcc"); if (!gcc) { resolve(null); return; } tmpFile = join(TMP_DIR, `codeiq_${tmpId}.c`); const binFile = join(TMP_DIR, `codeiq_${tmpId}${IS_WIN ? ".exe" : ""}`); writeFileSync(tmpFile, code); try { execSync(`"${gcc}" "${tmpFile}" -o "${binFile}" -lm 2>&1`, { timeout: 10000, encoding: "utf-8" }); cmd = binFile; args = []; } catch (e: any) { resolve(NextResponse.json({ output: (e.stderr || e.stdout || "").split("\n").filter(Boolean), error: "Compilation Error" })); return; } }
    else if (lang === "cpp") { const gpp = findCompiler("g++") || findCompiler("c++"); if (!gpp) { resolve(null); return; } tmpFile = join(TMP_DIR, `codeiq_${tmpId}.cpp`); const binFile = join(TMP_DIR, `codeiq_${tmpId}${IS_WIN ? ".exe" : ""}`); writeFileSync(tmpFile, code); try { execSync(`"${gpp}" "${tmpFile}" -o "${binFile}" 2>&1`, { timeout: 10000, encoding: "utf-8" }); cmd = binFile; args = []; } catch (e: any) { resolve(NextResponse.json({ output: (e.stderr || e.stdout || "").split("\n").filter(Boolean), error: "Compilation Error" })); return; } }
    else if (lang === "java") { const javacCmd = findCompiler("javac"); const javaCmd = findCompiler("java"); if (!javacCmd || !javaCmd) { resolve(null); return; } tmpFile = join(TMP_DIR, `Main_${tmpId}.java`); writeFileSync(tmpFile, code); try { execSync(`"${javacCmd}" "${tmpFile}" 2>&1`, { timeout: 15000, encoding: "utf-8" }); cmd = javaCmd; args = ["-cp", TMP_DIR, "Main"]; } catch (e: any) { resolve(NextResponse.json({ output: (e.stderr || e.stdout || "").split("\n").filter(Boolean), error: "Compilation Error" })); return; } }
    else { resolve(null); return; }
    const proc = execCb(`"${cmd}" ${args.map(a => `"${a}"`).join(" ")}`, { timeout: 15000, encoding: "utf-8", maxBuffer: 1024 * 1024, env: process.env }, (error, stdout, stderr) => { try { if (tmpFile && existsSync(tmpFile)) unlinkSync(tmpFile); } catch { } let output = (stdout || "") + (stderr || ""); if (inputPrompts?.length) for (const prompt of inputPrompts) output = output.replace(new RegExp(prompt.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"), ""); const lines = output.replace(/\r/g, "").trimEnd().split("\n").filter(Boolean); if (!lines.length) lines.push("(no output)"); lines.push("", "Process exited with 0"); resolve(NextResponse.json({ output: lines, error: null })); });
    if (proc.stdin) { proc.stdin.write(stdinInput); proc.stdin.end(); }
  });
}
function commandExists(cmd: string): boolean { try { execSync(IS_WIN ? `where ${cmd}` : `which ${cmd}`, { stdio: "ignore" }); return true; } catch { return false; } }
function findCompiler(name: string): string | null { if (commandExists(name)) return name; if (IS_WIN) { const hardcoded = join(process.env.LOCALAPPDATA || "", "Microsoft/WinGet/Packages/BrechtSanders.WinLibs.POSIX.UCRT_Microsoft.Winget.Source_8wekyb3d8bbwe/mingw64/bin", name + ".exe"); if (existsSync(hardcoded)) return hardcoded; try { const base = join(process.env.LOCALAPPDATA || "", "Microsoft/WinGet/Packages"); const { readdirSync } = require("fs"); for (const dir of readdirSync(base).filter((d: string) => d.includes("WinLibs"))) { const full = join(base, dir, "mingw64/bin", name + ".exe"); if (existsSync(full)) return full; } } catch { } } return null; }

const JUDGE0_LANGUAGES: Record<string, number> = { c: 50, cpp: 54, java: 62, javascript: 63, python: 71, go: 60, ruby: 72, rust: 73, typescript: 74, haskell: 85 };

async function executeViaJudge0(lang: string, code: string, stdinInput?: string, requestId?: string, languageIdOverride?: number | null): Promise<NextResponse | null> {
  const languageId = languageIdOverride ?? JUDGE0_LANGUAGES[lang]; logJudge0Config();
  if (!languageId || !isValidJudge0Url(JUDGE0_API_URL)) { console.warn("[Judge0] request skipped", { requestId: requestId ?? null, language: lang, languageId: languageId || null, reason: !languageId ? "unsupported-language" : "invalid-or-missing-url" }); return null; }
  try {
    console.info("[Judge0] request started", { requestId: requestId ?? null, language: lang, languageId });
    const headers: Record<string, string> = { "Content-Type": "application/json" }; if (JUDGE0_API_KEY) headers["X-Auth-Token"] = JUDGE0_API_KEY;
    const submitRes = await fetch(`${JUDGE0_API_URL}/submissions?base64_encoded=false&wait=false`, { method: "POST", headers, signal: AbortSignal.timeout(25000), body: JSON.stringify({ language_id: languageId, source_code: code, stdin: stdinInput || "" }) });
    console.info("[Judge0] submission response", { httpStatus: submitRes.status });
    if (!submitRes.ok) { const details = await readJudge0Response(submitRes); const httpError = judge0HttpError(submitRes.status); console.error("[Judge0] submission response", { requestId: requestId ?? null, httpStatus: submitRes.status, error: details.error ?? null, status: details.status ?? null }); return judge0ServiceResponse(httpError.error, httpError.status, 503, requestId); }
    const submission = await readJudge0Response(submitRes); const token = submission.token;
    if (!token) return NextResponse.json({ output: [], error: "Judge0 did not return a submission token.", status: "Judge0 Request Error" });
    const maxAttempts = 20; const pollingStartedAt = Date.now();
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await new Promise(r => setTimeout(r, attempt === 0 ? 250 : 500));
      const resultRes = await fetch(`${JUDGE0_API_URL}/submissions/${token}?base64_encoded=false`, { headers, signal: AbortSignal.timeout(10000) });
      if (!resultRes.ok) { const details = await readJudge0Response(resultRes); const httpError = judge0HttpError(resultRes.status); return judge0ServiceResponse(httpError.error, httpError.status, 503, requestId); }
      const result = await resultRes.json(); const statusId = Number(result.status?.id || 0);
      if (statusId > 2) {
        const outputText = [result.stdout, result.stderr, result.compile_output].filter(Boolean).join("\n").replace(/\r/g, "").trimEnd();
        const lines = outputText ? outputText.split("\n") : ["(no output)"];
        if (result.status?.description && result.status.description !== "Accepted") lines.push("", result.status.description);
        console.info("[Judge0] completed", { requestId: requestId ?? null, status: result.status?.description, elapsedMs: Date.now() - pollingStartedAt });
        return NextResponse.json({ output: lines, error: statusId === 3 ? null : result.status?.description || "Execution failed", status: result.status?.description || "Completed" });
      }
    }
    return judge0ServiceResponse("Judge0 execution timed out. Please try again.", "Execution Timeout", 504, requestId);
  } catch (error: any) { console.error("[Judge0] request failed", { requestId, error: error?.message }); return judge0ServiceResponse("Unable to reach the code execution service.", "Judge0 Network Error", 503, requestId); }
}

function executeJS(code: string): NextResponse {
  try {
    const output: string[] = []; const sandbox = { console: { log: (...args: any[]) => output.push(args.map(formatValue).join(" ")), error: (...args: any[]) => output.push(args.map(formatValue).join(" ")) }, setTimeout, clearTimeout, Promise, JSON, Math, Date, Array, Object, String, Number, Boolean, RegExp, Map, Set };
    vm.createContext(sandbox); const script = new vm.Script(code); script.runInContext(sandbox, { timeout: 5000 });
    return NextResponse.json({ output: output.length ? output : ["(no output)"], error: null });
  } catch (error: any) { return NextResponse.json({ output: [], error: error?.message || "JavaScript execution failed" }); }
}
function formatValue(value: any): string { if (typeof value === "string") return value; try { return JSON.stringify(value); } catch { return String(value); } }
function stripTypeScript(code: string): string { let result = code; result = result.replace(/interface\s+\w+\s*\{[\s\S]*?\}/g, ""); result = result.replace(/type\s+\w+(?:\s*<[^>]+>)?\s*=\s*[^;]+;?/g, ""); const genericTypes = result.match(/<[^>\n]+>/g) || []; for (const gt of genericTypes) { try { result = result.replace(new RegExp(String.raw`\)\s*:\s*${gt}\s*([>{=])`, "g"), ")$1"); } catch { } } result = result.replace(/\bas\s+(?:string|number|boolean|any|void|unknown|object|[\w\[\]<>]+)\b/g, ""); return result; }

function tryLocalExec(_lang: string, _code: string): NextResponse | null { return null; }
