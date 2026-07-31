import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { WebSocketServer, WebSocket } from "ws";
import * as pty from "node-pty";
import { writeFileSync, unlinkSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { randomBytes } from "crypto";

const dev = process.env.NODE_ENV !== "production";
const hostname = "0.0.0.0";
const port = parseInt(process.env.PORT || "3000", 10);

const IS_WIN = process.platform === "win32";
const TMP_DIR = IS_WIN ? (process.env.TEMP || "C:/Temp") : "/tmp";
const TIMEOUT_MS = 15000;

// Ensure tmp dir exists
if (!existsSync(TMP_DIR)) mkdirSync(TMP_DIR, { recursive: true });

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

// Language → shell command mapping
function getRunCommand(language: string, tmpFile: string, tmpDir: string): { cmd: string; args: string[]; cwd: string } | null {
  const base = tmpFile.replace(/\.[^.]+$/, "");

  switch (language) {
    case "python":
      return { cmd: IS_WIN ? "python" : "python3", args: ["-u", tmpFile], cwd: tmpDir };
    case "javascript":
      return { cmd: "node", args: [tmpFile], cwd: tmpDir };
    case "typescript":
      return { cmd: "npx", args: ["tsx", tmpFile], cwd: tmpDir };
    case "c": {
      const bin = IS_WIN ? `${base}.exe` : base;
      return { cmd: IS_WIN ? "cmd" : "sh", args: IS_WIN ? ["/c", `gcc "${tmpFile}" -o "${bin}" -lm && "${bin}"`] : ["-c", `gcc "${tmpFile}" -o "${base}" -lm && "${base}"`], cwd: tmpDir };
    }
    case "cpp": {
      const bin = IS_WIN ? `${base}.exe` : base;
      return { cmd: IS_WIN ? "cmd" : "sh", args: IS_WIN ? ["/c", `g++ "${tmpFile}" -o "${bin}" && "${bin}"`] : ["-c", `g++ "${tmpFile}" -o "${base}" && "${base}"`], cwd: tmpDir };
    }
    case "java": {
      const className = "Main";
      return { cmd: IS_WIN ? "cmd" : "sh", args: IS_WIN ? ["/c", `javac "${tmpFile}" && java -cp "${tmpDir}" ${className}`] : ["-c", `javac "${tmpFile}" && java -cp "${tmpDir}" ${className}`], cwd: tmpDir };
    }
    case "go":
      return { cmd: "go", args: ["run", tmpFile], cwd: tmpDir };
    case "rust": {
      const bin = IS_WIN ? `${base}.exe` : base;
      return { cmd: IS_WIN ? "cmd" : "sh", args: IS_WIN ? ["/c", `rustc "${tmpFile}" -o "${bin}" && "${bin}"`] : ["-c", `rustc "${tmpFile}" -o "${base}" && "${base}"`], cwd: tmpDir };
    }
    case "ruby":
      return { cmd: "ruby", args: [tmpFile], cwd: tmpDir };
    case "haskell":
      return { cmd: IS_WIN ? "stack" : "runhaskell", args: IS_WIN ? ["exec", "runghc", "--", tmpFile] : [tmpFile], cwd: tmpDir };
    default:
      return null;
  }
}

function getFileExtension(language: string): string {
  const exts: Record<string, string> = {
    python: ".py", javascript: ".js", typescript: ".ts",
    c: ".c", cpp: ".cpp", java: ".java", go: ".go",
    rust: ".rs", ruby: ".rb", haskell: ".hs",
  };
  return exts[language] || ".txt";
}

function getFileName(language: string): string {
  if (language === "java") return "Main.java";
  return `codeiq_${randomBytes(4).toString("hex")}${getFileExtension(language)}`;
}

// ─── Next.js + WebSocket Server ───

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url || "", true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error handling request:", err);
      res.statusCode = 500;
      res.end("Internal Server Error");
    }
  });

  // WebSocket server
  const wss = new WebSocketServer({ server, path: "/terminal" });

  wss.on("connection", (ws: WebSocket) => {
    let ptyProcess: pty.IPty | null = null;
    let timeout: ReturnType<typeof setTimeout> | null = null;
    let tmpFile: string | null = null;
    let outputBuffer = "";

    ws.on("message", (raw: Buffer) => {
      try {
        const msg = JSON.parse(raw.toString());

        if (msg.type === "run") {
          const { language, code } = msg;
          if (!language || !code) {
            ws.send(JSON.stringify({ type: "error", data: "Language and code are required" }));
            return;
          }

          // Get run command
          const command = getRunCommand(language, "", TMP_DIR);
          if (!command) {
            ws.send(JSON.stringify({ type: "error", data: `Unsupported language: ${language}` }));
            return;
          }

          // Write code to temp file
          tmpFile = join(TMP_DIR, getFileName(language));
          writeFileSync(tmpFile, code, "utf-8");

          // Update command with actual file path
          const actualCommand = getRunCommand(language, tmpFile, TMP_DIR);
          if (!actualCommand) return;

          try {
            ptyProcess = pty.spawn(actualCommand.cmd, actualCommand.args, {
              name: "xterm-256color",
              cols: 80,
              rows: 24,
              cwd: actualCommand.cwd,
              env: process.env as Record<string, string>,
            });

            // Pipe PTY output → WebSocket
            ptyProcess.onData((data: string) => {
              outputBuffer += data;
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type: "output", data }));
              }
            });

            // Process exited
            ptyProcess.onExit(({ exitCode }) => {
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type: "exit", code: exitCode }));
              }
              cleanup();
            });

            // Timeout
            timeout = setTimeout(() => {
              if (ptyProcess) {
                try { ptyProcess.kill(); } catch {}
              }
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type: "output", data: "\r\n⏱️ Process killed after 15 seconds timeout.\r\n" }));
                ws.send(JSON.stringify({ type: "exit", code: -1 }));
              }
            }, TIMEOUT_MS);
          } catch (err: any) {
            ws.send(JSON.stringify({ type: "error", data: `Failed to start process: ${err.message}` }));
            cleanup();
          }
        }

        // User input → PTY stdin
        if (msg.type === "input" && ptyProcess) {
          ptyProcess.write(msg.data);
        }

        // Resize terminal
        if (msg.type === "resize" && ptyProcess) {
          ptyProcess.resize(msg.cols || 80, msg.rows || 24);
        }
      } catch (err) {
        console.error("WebSocket message error:", err);
      }
    });

    ws.on("close", () => {
      cleanup();
    });

    function cleanup() {
      if (timeout) { clearTimeout(timeout); timeout = null; }
      if (ptyProcess) {
        try { ptyProcess.kill(); } catch {}
        ptyProcess = null;
      }
      if (tmpFile && existsSync(tmpFile)) {
        try { unlinkSync(tmpFile); } catch {}
        // Also cleanup compiled binaries
        const base = tmpFile.replace(/\.[^.]+$/, "");
        try { if (existsSync(base)) unlinkSync(base); } catch {}
        try { if (existsSync(base + ".exe")) unlinkSync(base + ".exe"); } catch {}
        try { if (existsSync(base + ".class")) unlinkSync(base + ".class"); } catch {}
        // Java creates class in same dir
        const javaClass = join(TMP_DIR, "Main.class");
        try { if (existsSync(javaClass)) unlinkSync(javaClass); } catch {}
        tmpFile = null;
      }
      outputBuffer = "";
    }
  });

  server.listen(port, hostname, () => {
    console.log(`> CodeIQ ready on http://${hostname}:${port}`);
    console.log(`> WebSocket available at ws://${hostname}:${port}/terminal`);
  });
});
