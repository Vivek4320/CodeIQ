"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, History, Share2, Copy, Check, X, Clock } from "lucide-react";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import { useTheme } from "@/components/landing/ThemeContext";
import { useAuth } from "@/components/AuthContext";
import { useToast } from "@/components/Toast";
import CodeEditor from "@/components/editor/CodeEditor";
import EditorToolbar from "@/components/editor/EditorToolbar";
import OutputPanel from "@/components/editor/OutputPanel";

const display = Instrument_Serif({ subsets: ["latin"], weight: ["400"], style: ["normal", "italic"], variable: "--font-display" });
const bodyFont = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

const DEFAULT_CODE: Record<string, string> = {
  javascript: `// Welcome to CodeIQ!\nconsole.log("Hello, World!");`,
  typescript: `// TypeScript\nfunction greet(name: string): string {\n  return \`Hello, \${name}!\`;\n}\nconsole.log(greet("CodeIQ"));`,
  python: `# Welcome to CodeIQ!\nprint("Hello, World!")`,
  cpp: `#include <iostream>\n\nint main() {\n  std::cout << "Hello, World!" << std::endl;\n  return 0;\n}`,
  java: `public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}`,
  go: `package main\n\nimport "fmt"\n\nfunc main() {\n  fmt.Println("Hello, World!")\n}`,
  rust: `fn main() {\n  println!("Hello, World!");\n}`,
  ruby: `# Welcome to CodeIQ!\nputs "Hello, World!"`,
};

const FILE_NAMES: Record<string, string> = {
  javascript: "main.js",
  typescript: "main.ts",
  python: "main.py",
  cpp: "main.cpp",
  java: "Main.java",
  go: "main.go",
  rust: "main.rs",
  ruby: "main.rb",
};

interface RunHistory {
  id: number;
  project_name: string;
  language: string;
  code: string;
  output: string;
  created_at: string;
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr + (dateStr.endsWith("Z") ? "" : "Z")).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 10) return "just now";
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

export default function EditorPage() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("id");
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(DEFAULT_CODE.javascript);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [projectName, setProjectName] = useState("untitled");
  const [splitPos, setSplitPos] = useState(60);
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // History & Share state
  const [showHistory, setShowHistory] = useState(false);
  const [runHistory, setRunHistory] = useState<RunHistory[]>([]);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [showShare, setShowShare] = useState(false);

  // Load project
  useEffect(() => {
    if (!projectId || !user) return;
    fetch(`/api/projects?email=${encodeURIComponent(user.email)}`)
      .then((res) => res.json())
      .then((data) => {
        const project = data.projects?.find((p: any) => p.id === Number(projectId));
        if (project) {
          setLanguage(project.language);
          setCode(project.code);
          setProjectName(project.name.replace(/\.[^.]+$/, ""));
          setOutput([]);
        }
      });
  }, [projectId, user]);

  // Load run history
  const loadHistory = useCallback(() => {
    if (!user) return;
    fetch(`/api/runs?email=${encodeURIComponent(user.email)}&project=${encodeURIComponent(projectName)}`)
      .then((res) => res.json())
      .then((data) => setRunHistory(data.runs || []));
  }, [user, projectName]);

  useEffect(() => {
    if (showHistory) loadHistory();
  }, [showHistory, loadHistory]);

  // Drag handler
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setSplitPos(Math.min(Math.max((e.clientX - rect.left) / rect.width * 100, 25), 75));
    };
    const onMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }, []);

  const handleLanguageChange = useCallback((lang: string) => {
    setLanguage(lang);
    setCode(DEFAULT_CODE[lang] || "");
    setOutput([]);
    setProjectName("untitled");
  }, []);

  // Run code + save to history
  const handleRun = useCallback(async () => {
    setIsRunning(true);
    setOutput([]);
    try {
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, code }),
      });
      const data = await res.json();
      const result = data.error ? [data.error] : data.output;
      setOutput(result);

      // Save to run history
      if (user) {
        fetch("/api/runs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            projectName,
            language,
            code,
            output: result,
          }),
        });
      }
    } catch {
      setOutput(["Error: Failed to execute code"]);
    }
    setIsRunning(false);
  }, [language, code, user, projectName]);

  const handleReset = useCallback(() => {
    setCode(DEFAULT_CODE[language] || "");
    setOutput([]);
  }, [language]);

  const handleSave = useCallback(async () => {
    if (!user) return;
    const name = `${projectName}.${FILE_NAMES[language]?.split(".")[1] || "txt"}`;
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, name, language, code }),
      });
      const data = await res.json();
      if (res.ok) toast("Project saved successfully!", "success");
      else toast(data.error || "Failed to save", "error");
    } catch {
      toast("Failed to save project", "error");
    }
  }, [user, projectName, language, code, toast]);

  // Share code
  const handleShare = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, projectName, language, code }),
      });
      const data = await res.json();
      if (res.ok) {
        setShareUrl(data.shareUrl);
        setShowShare(true);
        toast("Share link created!", "success");
      } else {
        toast(data.error || "Failed to share", "error");
      }
    } catch {
      toast("Failed to create share link", "error");
    }
  }, [user, projectName, language, code, toast]);

  const copyShareUrl = () => {
    const fullUrl = `${window.location.origin}${shareUrl}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`${display.variable} ${bodyFont.variable} ${mono.variable}`}
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: theme.bg, color: theme.text }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 24px", borderBottom: `1px solid ${theme.border}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "6px", color: theme.muted, textDecoration: "none", fontSize: "13px", transition: "color 0.2s ease" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = theme.text; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = theme.muted; }}>
            <ArrowLeft size={16} /> Dashboard
          </Link>
          <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} className="font-mono"
            style={{ fontSize: "13px", color: theme.faint, backgroundColor: "transparent", border: "none", outline: "none", padding: "4px 8px", borderBottom: `1px solid ${theme.border}`, width: "140px" }} />
          <span className="font-mono" style={{ fontSize: "12px", color: theme.faint }}>{language}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* History button */}
          <button onClick={() => setShowHistory(!showHistory)} title="Run history"
            style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 10px", fontSize: "12px", backgroundColor: showHistory ? `${theme.accent}15` : "transparent", color: showHistory ? theme.accent : theme.muted, border: `1px solid ${showHistory ? theme.accent : theme.border}`, borderRadius: "6px", cursor: "pointer", transition: "all 0.2s ease" }}
            onMouseEnter={(e) => { if (!showHistory) { e.currentTarget.style.borderColor = theme.accent; e.currentTarget.style.color = theme.text; }}}
            onMouseLeave={(e) => { if (!showHistory) { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.muted; }}}>
            <History size={14} />
          </button>
          {/* Share button */}
          <button onClick={handleShare} title="Share code"
            style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 10px", fontSize: "12px", backgroundColor: "transparent", color: theme.muted, border: `1px solid ${theme.border}`, borderRadius: "6px", cursor: "pointer", transition: "all 0.2s ease" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = theme.accent; e.currentTarget.style.color = theme.text; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.muted; }}>
            <Share2 size={14} />
          </button>
          <span className="font-body" style={{ fontSize: "13px", color: theme.muted, marginLeft: "8px" }}>{user?.name}</span>
        </div>
      </div>

      {/* Main content */}
      <div ref={containerRef} style={{ flex: 1, display: "flex", padding: "16px 24px 24px", gap: "0", minHeight: 0 }}>

        {/* Left: Code Editor */}
        <div style={{ width: `${splitPos}%`, display: "flex", flexDirection: "column", border: `1px solid ${theme.border}`, borderRadius: "8px 0 0 8px", overflow: "hidden", minHeight: "400px" }}>
          <EditorToolbar language={language} onLanguageChange={handleLanguageChange} onRun={handleRun} onSave={handleSave} isRunning={isRunning} />
          <div style={{ flex: 1, minHeight: 0 }}>
            <CodeEditor language={language} value={code} onChange={setCode} />
          </div>
        </div>

        {/* Drag handle */}
        <div onMouseDown={handleDragStart} style={{ width: "6px", backgroundColor: theme.border, cursor: "col-resize", display: "flex", alignItems: "center", justifyContent: "center", transition: "background-color 0.2s ease", flexShrink: 0 }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.accent; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = theme.border; }}>
          <div style={{ width: "2px", height: "40px", borderRadius: "1px", backgroundColor: theme.faint }} />
        </div>

        {/* Right: Output or History */}
        {showHistory ? (
          <div style={{ width: `${100 - splitPos}%`, border: `1px solid ${theme.border}`, borderRadius: "0 8px 8px 0", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            {/* History header */}
            <div style={{ padding: "10px 16px", borderBottom: `1px solid ${theme.border}`, backgroundColor: theme.panel, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Clock size={14} style={{ color: theme.faint }} />
                <span className="font-mono" style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: theme.faint }}>Run History</span>
              </div>
              <button onClick={() => setShowHistory(false)} style={{ background: "none", border: "none", cursor: "pointer", color: theme.faint, padding: "2px" }}>
                <X size={14} />
              </button>
            </div>
            {/* History list */}
            <div style={{ flex: 1, overflow: "auto", padding: "8px" }}>
              {runHistory.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px" }}>
                  <History size={24} style={{ color: theme.faint, marginBottom: "8px" }} />
                  <p className="font-mono" style={{ fontSize: "12px", color: theme.faint }}>No runs yet. Click "Run" to save history.</p>
                </div>
              ) : (
                runHistory.map((run) => (
                  <button key={run.id} onClick={() => { setCode(run.code); setLanguage(run.language); try { setOutput(JSON.parse(run.output)); } catch {} setShowHistory(false); }}
                    style={{ display: "block", width: "100%", textAlign: "left", padding: "12px", marginBottom: "4px", border: `1px solid ${theme.border}`, borderRadius: "8px", backgroundColor: theme.panel, cursor: "pointer", transition: "border-color 0.2s ease" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = theme.accent; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = theme.border; }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span className="font-mono" style={{ fontSize: "11px", color: theme.accent }}>{run.language}</span>
                      <span className="font-mono" style={{ fontSize: "11px", color: theme.faint }}>{timeAgo(run.created_at)}</span>
                    </div>
                    <pre className="font-mono" style={{ fontSize: "11px", color: theme.muted, margin: 0, whiteSpace: "pre-wrap", maxHeight: "40px", overflow: "hidden" }}>
                      {run.code.slice(0, 100)}...
                    </pre>
                  </button>
                ))
              )}
            </div>
          </div>
        ) : (
          <div style={{ width: `${100 - splitPos}%`, border: `1px solid ${theme.border}`, borderRadius: "0 8px 8px 0", overflow: "hidden", minHeight: "400px" }}>
            <OutputPanel output={output} isRunning={isRunning} onClear={() => setOutput([])} />
          </div>
        )}
      </div>

      {/* Share modal */}
      {showShare && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}
          onClick={() => setShowShare(false)}>
          <div style={{ backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "12px", padding: "28px", width: "100%", maxWidth: "420px" }}
            onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display" style={{ fontSize: "20px", fontWeight: 400, marginBottom: "12px" }}>Share your code</h3>
            <p className="font-body" style={{ fontSize: "13px", color: theme.muted, marginBottom: "16px" }}>
              Anyone with this link can view your code.
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              <input readOnly value={`${window.location.origin}${shareUrl}`} className="font-mono"
                style={{ flex: 1, padding: "10px 12px", fontSize: "13px", backgroundColor: theme.bg, color: theme.text, border: `1px solid ${theme.border}`, borderRadius: "6px", outline: "none" }} />
              <button onClick={copyShareUrl}
                style={{ padding: "10px 16px", fontSize: "13px", fontWeight: 500, backgroundColor: theme.accent, color: theme.bg, border: "none", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap" }}>
                {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
              </button>
            </div>
            <button onClick={() => setShowShare(false)} style={{ marginTop: "16px", width: "100%", padding: "8px", fontSize: "13px", backgroundColor: "transparent", color: theme.muted, border: `1px solid ${theme.border}`, borderRadius: "6px", cursor: "pointer" }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
