import { WebSocketServer, WebSocket } from "ws";
import * as pty from "node-pty";
import { writeFileSync, unlinkSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { randomBytes } from "crypto";

const PORT = 3001;
const IS_WIN = process.platform === "win32";
const TMP_DIR = IS_WIN ? (process.env.TEMP || "C:/Temp") : "/tmp";

if (!existsSync(TMP_DIR)) mkdirSync(TMP_DIR, { recursive: true });

// Add WinLibs to PATH
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
  const goPath = "C:/Program Files/Go/bin";
  if (existsSync(join(goPath, "go.exe"))) {
    process.env.PATH = goPath + ";" + (process.env.PATH || "");
  }
  const rubyPath = "C:/Ruby33-x64/bin";
  if (existsSync(join(rubyPath, "ruby.exe"))) {
    process.env.PATH = rubyPath + ";" + (process.env.PATH || "");
  }
  const stackPath = join(process.env.APPDATA || "", "local/bin");
  if (existsSync(join(stackPath, "stack.exe"))) {
    process.env.PATH = stackPath + ";" + (process.env.PATH || "");
  }
}

function getRunCommand(language: string, tmpFile: string, tmpDir: string) {
  const base = tmpFile.replace(/\.[^.]+$/, "");

  // On Windows, write a .bat file to ensure PATH is set correctly
  if (IS_WIN) {
    let batContent = "@echo off\n";
    const batFile = join(tmpDir, `codeiq_run_${randomBytes(4).toString("hex")}.bat`);
    const existingPath = process.env.PATH || "";

    // Add WinLibs to PATH (only if not already there)
    try {
      const { readdirSync } = require("fs");
      const localAppData = process.env.LOCALAPPDATA || "";
      const winlibsGlob = join(localAppData, "Microsoft/WinGet/Packages");
      const dirs = readdirSync(winlibsGlob).filter((d: string) => d.includes("WinLibs"));
      for (const dir of dirs) {
        const binDir = join(winlibsGlob, dir, "mingw64/bin").replace(/\\/g, "/");
        if (!existingPath.includes("mingw64/bin")) {
          batContent += `set "PATH=${binDir};%PATH%"\n`;
        }
        break;
      }
    } catch {}

    // Add Go to PATH (only if not already there)
    const goPath = "C:/Program Files/Go/bin";
    if (!existingPath.includes("Go/bin") && existsSync(join(goPath, "go.exe"))) {
      batContent += `set "PATH=${goPath};%PATH%"\n`;
    }

    // Add Ruby to PATH (only if not already there)
    const rubyPath = "C:/Ruby33-x64/bin";
    if (!existingPath.includes("Ruby33") && existsSync(join(rubyPath, "ruby.exe"))) {
      batContent += `set "PATH=${rubyPath};%PATH%"\n`;
    }

    // Add Stack to PATH (only if not already there)
    const stackBatPath = join(process.env.APPDATA || "", "local/bin");
    if (!existingPath.includes("stack") && existsSync(join(stackBatPath, "stack.exe"))) {
      batContent += `set "PATH=${stackBatPath};%PATH%"\n`;
    }

    switch (language) {
      case "python": batContent += `python -u "${tmpFile}"`; break;
      case "javascript": batContent += `node "${tmpFile}"`; break;
      case "typescript": batContent += `npx tsx "${tmpFile}"`; break;
      case "c": {
        const bin = `${base}.exe`;
        batContent += `gcc "${tmpFile}" -o "${bin}" -lm && echo --- BUILD OK --- && "${bin}"`;
        break;
      }
      case "cpp": {
        const bin = `${base}.exe`;
        batContent += `g++ "${tmpFile}" -o "${bin}" && echo --- BUILD OK --- && "${bin}"`;
        break;
      }
      case "java": batContent += `javac "${tmpFile}" && echo --- BUILD OK --- && java -cp "${tmpDir}" Main`; break;
      case "go": batContent += `go run "${tmpFile}"`; break;
      case "rust": {
        const bin = `${base}.exe`;
        batContent += `rustc "${tmpFile}" -o "${bin}" && echo --- BUILD OK --- && "${bin}"`;
        break;
      }
      case "ruby": batContent += `ruby "${tmpFile}"`; break;
      case "haskell": batContent += `stack exec runghc -- "${tmpFile}"`; break;
      default: return null;
    }

    writeFileSync(batFile, batContent, "utf-8");
    return { cmd: "cmd.exe", args: ["/c", batFile], cwd: tmpDir, _bat: batFile };
  }

  // Linux/Mac: direct commands
  switch (language) {
    case "python": return { cmd: "python3", args: ["-u", tmpFile], cwd: tmpDir };
    case "javascript": return { cmd: "node", args: [tmpFile], cwd: tmpDir };
    case "typescript": return { cmd: "npx", args: ["tsx", tmpFile], cwd: tmpDir };
    case "c": {
      const bin = base;
      return { cmd: "sh", args: ["-c", `gcc "${tmpFile}" -o "${bin}" -lm && echo "--- BUILD OK ---" && "./${base}"`], cwd: tmpDir };
    }
    case "cpp": {
      const bin = base;
      return { cmd: "sh", args: ["-c", `g++ "${tmpFile}" -o "${bin}" && echo "--- BUILD OK ---" && "./${base}"`], cwd: tmpDir };
    }
    case "java": return { cmd: "sh", args: ["-c", `javac "${tmpFile}" && echo "--- BUILD OK ---" && java -cp "${tmpDir}" Main`], cwd: tmpDir };
    case "go": return { cmd: "go", args: ["run", tmpFile], cwd: tmpDir };
    case "rust": {
      const bin = base;
      return { cmd: "sh", args: ["-c", `rustc "${tmpFile}" -o "${bin}" && echo "--- BUILD OK ---" && "./${base}"`], cwd: tmpDir };
    }
    case "ruby": return { cmd: "ruby", args: [tmpFile], cwd: tmpDir };
    case "haskell": return { cmd: "stack", args: ["exec", "runghc", "--", tmpFile], cwd: tmpDir };
    default: return null;
  }
}

function getFileName(language: string): string {
  const exts: Record<string, string> = {
    python: ".py", javascript: ".js", typescript: ".ts", c: ".c", cpp: ".cpp",
    java: ".java", go: ".go", rust: ".rs", ruby: ".rb", haskell: ".hs",
  };
  if (language === "java") return "Main.java";
  return `codeiq_${randomBytes(4).toString("hex")}${exts[language] || ".txt"}`;
}

function cleanFile(filePath: string) {
  try { if (existsSync(filePath)) unlinkSync(filePath); } catch {}
  const base = filePath.replace(/\.[^.]+$/, "");
  try { if (existsSync(base)) unlinkSync(base); } catch {}
  try { if (existsSync(base + ".exe")) unlinkSync(base + ".exe"); } catch {}
  try { if (existsSync(base + ".class")) unlinkSync(base + ".class"); } catch {}
}

// WebSocket Server
const wss = new WebSocketServer({ port: PORT });

wss.on("connection", (ws: WebSocket) => {
  console.log("[WS] Client connected");

  let ptyProcess: pty.IPty | null = null;
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let tmpFile: string | null = null;
  let batFile: string | null = null;

  function killProcess() {
    if (timeout) { clearTimeout(timeout); timeout = null; }
    if (ptyProcess) { try { ptyProcess.kill(); } catch {} ptyProcess = null; }
  }

  function cleanup() {
    killProcess();
    if (tmpFile) {
      console.log(`[WS] Cleaning: ${tmpFile}`);
      cleanFile(tmpFile);
      tmpFile = null;
    }
    if (batFile) {
      try { if (existsSync(batFile)) unlinkSync(batFile); } catch {}
      batFile = null;
    }
  }

  function resetTimeout() {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      console.log("[WS] Idle timeout!");
      killProcess();
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "output", data: "\r\n⏱️ No activity for 2 minutes — process killed.\r\n" }));
        ws.send(JSON.stringify({ type: "exit", code: -1 }));
      }
    }, 120000);
  }

  ws.on("message", (raw: Buffer) => {
    const msgStr = raw.toString().substring(0, 80);
    console.log(`[WS] ← ${msgStr}`);

    try {
      const msg = JSON.parse(raw.toString());

      // ─── RUN ───
      if (msg.type === "run") {
        const { language, code } = msg;
        if (!language || !code) {
          ws.send(JSON.stringify({ type: "error", data: "Language and code required" }));
          return;
        }

        // Kill any previous process + clean old file
        cleanup();

        // Write code to temp file
        tmpFile = join(TMP_DIR, getFileName(language));
        writeFileSync(tmpFile, code, "utf-8");
        console.log(`[WS] File: ${tmpFile}`);

        const command = getRunCommand(language, tmpFile, TMP_DIR);
        if (!command) {
          ws.send(JSON.stringify({ type: "error", data: `Unsupported: ${language}` }));
          return;
        }
        if ((command as any)._bat) batFile = (command as any)._bat;
        console.log(`[WS] Cmd: ${command.cmd} ${command.args.join(" ")}`);
        console.log(`[WS] CWD: ${command.cwd}`);
        console.log(`[WS] Full args:`, JSON.stringify(command.args));

        try {
          ptyProcess = pty.spawn(command.cmd, command.args, {
            name: "xterm-256color",
            cols: 80,
            rows: 24,
            cwd: command.cwd,
            env: process.env as Record<string, string>,
          });

          // PTY output → WebSocket
          ptyProcess.onData((data: string) => {
            resetTimeout(); // Reset idle timer on every output
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ type: "output", data }));
            }
          });

          // Process exited
          ptyProcess.onExit(({ exitCode }) => {
            console.log(`[WS] Exit: ${exitCode}`);
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ type: "exit", code: exitCode }));
            }
            cleanup();
          });

          // Idle timeout — reset on every output/input
          resetTimeout();

          console.log("[WS] Process spawned OK");
        } catch (err: any) {
          console.log("[WS] Spawn error:", err.message);
          ws.send(JSON.stringify({ type: "error", data: err.message }));
          cleanup();
        }
      }

      // ─── INPUT from user ───
      if (msg.type === "input" && ptyProcess) {
        resetTimeout(); // Reset idle timer on user input
        ptyProcess.write(msg.data);
      }

      // ─── RESIZE terminal ───
      if (msg.type === "resize" && ptyProcess) {
        ptyProcess.resize(msg.cols || 80, msg.rows || 24);
      }
    } catch (err) {
      console.log("[WS] Parse error:", err);
    }
  });

  // ─── Connection closed ───
  ws.on("close", () => {
    console.log("[WS] Client disconnected");
    cleanup();
  });
});

console.log(`> WebSocket server on ws://localhost:${PORT}`);
