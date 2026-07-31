"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { Terminal as XTerminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { WebLinksAddon } from "@xterm/addon-web-links";
import "@xterm/xterm/css/xterm.css";
import { useTheme } from "@/components/landing/ThemeContext";

interface TerminalProps {
  language: string;
  code: string;
  onExit?: (code: number, output: string[]) => void;
}

export default function Terminal({ language, code, onExit }: TerminalProps) {
  const { theme } = useTheme();
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerminal | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const [isRunning, setIsRunning] = useState(true);
  const [exitCode, setExitCode] = useState<number | null>(null);
  const outputBufferRef = useRef("");

  const cleanup = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  // Strip ANSI escape codes for clean OutputPanel display
  const stripAnsi = useCallback((str: string): string => {
    return str
      // OSC sequences: ESC ] ... (BEL or ESC \)
      .replace(/\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)/g, "")
      // CSI sequences: ESC [ ... final_byte
      .replace(/\x1b\[[0-?]*[ -/]*[@-~]/g, "")
      // Single-char escapes: ESC + one char
      .replace(/\x1b[@-Z\\-_]/g, "")
      // Stray partial sequences
      .replace(/\[[\d;]*[a-zA-Z]/g, "")
      .replace(/\[[\?][\d;]*[a-zA-Z]/g, "");
  }, []);

  useEffect(() => {
    if (!terminalRef.current) return;

    // Create xterm instance
    const xterm = new XTerminal({
      fontFamily: "var(--font-mono), 'JetBrains Mono', 'Fira Code', monospace",
      fontSize: 13,
      lineHeight: 1.4,
      cursorBlink: true,
      cursorStyle: "bar",
      theme: {
        background: theme.bg,
        foreground: theme.codeText,
        cursor: theme.accent,
        cursorAccent: theme.bg,
        selectionBackground: `${theme.accent}30`,
        black: "#000000",
        red: "#EF4444",
        green: "#34D399",
        yellow: "#FBBF24",
        blue: "#60A5FA",
        magenta: "#C678DD",
        cyan: "#22D3EE",
        white: "#FFFFFF",
        brightBlack: "#666666",
        brightRed: "#FF6B6B",
        brightGreen: "#6EE7B7",
        brightYellow: "#FCD34D",
        brightBlue: "#93C5FD",
        brightMagenta: "#D8B4FE",
        brightCyan: "#67E8F9",
        brightWhite: "#FFFFFF",
      },
    });

    const fitAddon = new FitAddon();
    xterm.loadAddon(fitAddon);
    xterm.loadAddon(new WebLinksAddon());

    // Selection tracking for copy/paste
    xterm.onSelectionChange(() => {
      const selection = xterm.getSelection();
      if (selection) {
        navigator.clipboard.writeText(selection).catch(() => {});
      }
    });

    xterm.open(terminalRef.current);
    fitAddon.fit();
    xtermRef.current = xterm;
    fitAddonRef.current = fitAddon;

    // WebSocket connection — separate WS server on port 3001
    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsPort = window.location.port ? `:${parseInt(window.location.port) + 1}` : ":3001";
    const wsUrl = `${wsProtocol}//${window.location.hostname}${wsPort}`;
    console.log("[Terminal] Connecting to:", wsUrl);
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("[Terminal] Connected! Sending run command...");
      // Send run command
      ws.send(JSON.stringify({ type: "run", language, code }));

      // Send initial size
      ws.send(JSON.stringify({ type: "resize", cols: xterm.cols, rows: xterm.rows }));
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.type === "output") {
          xterm.write(msg.data);
          outputBufferRef.current += msg.data;
        }

        if (msg.type === "exit") {
          setIsRunning(false);
          setExitCode(msg.code);
          const cleanLines = stripAnsi(outputBufferRef.current)
            .replace(/\r/g, "")
            .split("\n")
            .filter((l: string) => l.trim() !== "");
          onExit?.(msg.code, cleanLines);
        }

        if (msg.type === "error") {
          xterm.write(`\r\n\x1b[31mError: ${msg.data}\x1b[0m\r\n`);
          setIsRunning(false);
          setExitCode(1);
          onExit?.(1, []);
        }
      } catch {}
    };

    ws.onclose = () => {
      if (isRunning) {
        setIsRunning(false);
      }
    };

    // Capture user input → send to server
    xterm.onData((data: string) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "input", data }));
      }
    });

    // Handle resize
    const resizeObserver = new ResizeObserver(() => {
      fitAddon.fit();
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "resize", cols: xterm.cols, rows: xterm.rows }));
      }
    });
    resizeObserver.observe(terminalRef.current);

    // Focus terminal
    xterm.focus();

    return () => {
      resizeObserver.disconnect();
      xterm.dispose();
      cleanup();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, code]);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", backgroundColor: theme.bg }}>
      {/* Terminal header */}
      <div
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "8px 14px", borderBottom: `1px solid ${theme.border}`,
          backgroundColor: theme.panel, flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              width: "7px", height: "7px", borderRadius: "50%",
              backgroundColor: isRunning ? "#FBBF24" : exitCode === 0 ? "#34D399" : "#EF4444",
            }}
          />
          <span className="font-mono" style={{ fontSize: "11px", fontWeight: 600, color: theme.faint, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Terminal
          </span>
          <span className="font-mono" style={{ fontSize: "10px", padding: "1px 6px", borderRadius: "3px", backgroundColor: `${theme.accent}10`, color: theme.accent, fontWeight: 600 }}>
            {language}
          </span>
          {isRunning && (
            <span className="font-mono" style={{ fontSize: "10px", color: "#FBBF24" }}>Running...</span>
          )}
          {!isRunning && exitCode !== null && (
            <span className="font-mono" style={{ fontSize: "10px", color: exitCode === 0 ? "#34D399" : "#EF4444" }}>
              Exit: {exitCode}
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <button onClick={() => {
            const el = terminalRef.current;
            if (!el) return;
            const selection = window.getSelection()?.toString() || "";
            if (selection) navigator.clipboard.writeText(selection);
          }} title="Copy selection"
            style={{ padding: "3px 8px", fontSize: "10px", backgroundColor: "transparent", color: theme.faint, border: `1px solid ${theme.border}`, borderRadius: "4px", cursor: "pointer", fontFamily: "var(--font-mono), monospace", transition: "all 0.15s ease" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = theme.accent; e.currentTarget.style.color = theme.text; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.faint; }}>
            Copy
          </button>
          <button onClick={() => {
            navigator.clipboard.readText().then((text) => {
              if (text && wsRef.current?.readyState === WebSocket.OPEN) {
                wsRef.current.send(JSON.stringify({ type: "input", data: text }));
              }
            });
          }} title="Paste from clipboard"
            style={{ padding: "3px 8px", fontSize: "10px", backgroundColor: "transparent", color: theme.faint, border: `1px solid ${theme.border}`, borderRadius: "4px", cursor: "pointer", fontFamily: "var(--font-mono), monospace", transition: "all 0.15s ease" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = theme.accent; e.currentTarget.style.color = theme.text; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.faint; }}>
            Paste
          </button>
        </div>
      </div>

      {/* Terminal container */}
      <div
        ref={terminalRef}
        style={{ flex: 1, padding: "4px 0", overflow: "hidden" }}
      />
    </div>
  );
}
