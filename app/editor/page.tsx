"use client";

import { useState, useCallback, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, History, Share2, Copy, Check, X, Clock, Palette, Bot } from "lucide-react";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import { useTheme } from "@/components/landing/ThemeContext";
import { themes, type ThemeKey } from "@/components/landing/theme";
import { themeIcons } from "@/components/landing/ThemeIcons";
import { useAuth } from "@/components/AuthContext";
import { useToast } from "@/components/Toast";
import Logo from "@/components/landing/Logo";
import CodeEditor from "@/components/editor/CodeEditor";
import EditorToolbar from "@/components/editor/EditorToolbar";
import OutputPanel from "@/components/editor/OutputPanel";
import dynamic from "next/dynamic";
import Terminal from "@/components/editor/Terminal";
import { useIsMobile } from "@/hooks/useMediaQuery";

const AgentPanel = dynamic(() => import("@/components/editor/AgentPanel"), {
  loading: () => <div style={{ padding: "20px", fontSize: "13px", textAlign: "center", opacity: 0.5 }}>Loading AI Agent...</div>,
  ssr: false,
});

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
  haskell: `-- Welcome to CodeIQ!\nmain :: IO ()\nmain = putStrLn "Hello, World!"`,
  c: `#include <stdio.h>\n\nint main() {\n  printf("Hello, World!\\n");\n  return 0;\n}`,
  html: `<div class="card">\n  <h1>Welcome to CodeIQ</h1>\n  <p>Write HTML and CSS, see the live preview. Start editing to build something amazing.</p>\n  <button class="btn">Get Started →</button>\n</div>`,
  css: `/* CodeIQ CSS Editor */\n\n:root {\n  --primary: #3b82f6;\n  --primary-dark: #2563eb;\n  --bg: #ffffff;\n  --surface: #f8fafc;\n  --text: #1e293b;\n  --muted: #64748b;\n  --border: #e2e8f0;\n  --radius: 12px;\n}\n\n* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\nbody {\n  font-family: 'Segoe UI', system-ui, sans-serif;\n  background: var(--bg);\n  color: var(--text);\n  min-height: 100vh;\n  display: grid;\n  place-items: center;\n}\n\n.card {\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: var(--radius);\n  padding: 2rem;\n  max-width: 400px;\n  width: 90%;\n  box-shadow: 0 4px 24px rgba(0,0,0,0.06);\n}\n\nh1 {\n  font-size: 1.5rem;\n  font-weight: 600;\n  margin-bottom: 0.5rem;\n}\n\np {\n  color: var(--muted);\n  line-height: 1.6;\n  margin-bottom: 1.5rem;\n}\n\n.btn {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  padding: 10px 20px;\n  background: var(--primary);\n  color: white;\n  border: none;\n  border-radius: 8px;\n  font-size: 14px;\n  font-weight: 500;\n  cursor: pointer;\n  transition: background 0.2s;\n}\n\n.btn:hover {\n  background: var(--primary-dark);\n}`,
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
  haskell: "main.hs",
  c: "main.c",
  html: "index.html",
  css: "style.css",
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

function EditorPage() {
  const { theme, themeKey, setTheme } = useTheme();
  const { user } = useAuth();
  const isMobile = useIsMobile();
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

  // HTML/CSS linked state
  const [htmlCode, setHtmlCode] = useState(DEFAULT_CODE.html);
  const [cssCode, setCssCode] = useState(DEFAULT_CODE.css);
  const isWebLanguage = language === "html" || language === "css";
  const [webTab, setWebTab] = useState<"html" | "css">("html");

  // Auto-save state
  const [currentProjectId, setCurrentProjectId] = useState<number | null>(
    projectId ? Number(projectId) : null
  );
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const codeRef = useRef(code);
  const projectNameRef = useRef(projectName);
  const htmlCodeRef = useRef(htmlCode);
  const cssCodeRef = useRef(cssCode);

  // Keep refs in sync with state
  useEffect(() => { codeRef.current = code; }, [code]);
  useEffect(() => { projectNameRef.current = projectName; }, [projectName]);
  useEffect(() => { htmlCodeRef.current = htmlCode; }, [htmlCode]);
  useEffect(() => { cssCodeRef.current = cssCode; }, [cssCode]);

  // Protect applied code from being reset
  useEffect(() => {
    if (appliedCodeRef.current && code !== appliedCodeRef.current) {
      setCode(appliedCodeRef.current);
    }
  }, [code]);

  // Linked code change handler for HTML/CSS
  const handleCodeChange = useCallback((newCode: string) => {
    appliedCodeRef.current = null; // User manually edited, clear protection
    setCode(newCode);
    if (language === "html") setHtmlCode(newCode);
    else if (language === "css") setCssCode(newCode);
  }, [language]);

  // History & Share state
  const [showHistory, setShowHistory] = useState(false);
  const [showAgent, setShowAgent] = useState(false);
  const [agentKey, setAgentKey] = useState(0);
  const appliedCodeRef = useRef<string | null>(null);
  const [runHistory, setRunHistory] = useState<RunHistory[]>([]);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  // Terminal state for interactive programs
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalKey, setTerminalKey] = useState(0);

  // Input prompt state
  const [inputPrompts, setInputPrompts] = useState<{ prompt: string; index: number }[]>([]);

  // Close theme menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (themeMenuRef.current && !themeMenuRef.current.contains(e.target as Node)) {
        setShowThemeMenu(false);
      }
    }
    if (showThemeMenu) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showThemeMenu]);

  // Load project
  useEffect(() => {
    if (!user) return;
    fetch(`/api/projects?email=${encodeURIComponent(user.email)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.projects || data.projects.length === 0) return;

        const loadProject = (project: any) => {
          setLanguage(project.language);
          setProjectName(project.name.replace(/\.[^.]+$/, ""));
          setCurrentProjectId(project.id);
          setSaveStatus("saved");

          // For HTML/CSS, parse JSON code with clear structure
          if (project.language === "html" || project.language === "css") {
            try {
              const parsed = JSON.parse(project.code);
              if (parsed.format === "codeiq-web") {
                setHtmlCode(parsed.html?.code || "");
                setCssCode(parsed.css?.code || "");
                setCode(project.language === "html" ? (parsed.html?.code || "") : (parsed.css?.code || ""));
              } else {
                // Fallback for old format
                setHtmlCode(parsed.html || "");
                setCssCode(parsed.css || "");
                setCode(project.language === "html" ? (parsed.html || "") : (parsed.css || ""));
              }
            } catch {
              setHtmlCode(project.code);
              setCssCode("");
              setCode(project.code);
            }
          } else {
            setCode(project.code);
          }
        };

        if (projectId) {
          const project = data.projects.find((p: any) => p.id === Number(projectId));
          if (project) loadProject(project);
        } else {
          loadProject(data.projects[0]);
          window.history.replaceState(null, "", `/editor?id=${data.projects[0].id}`);
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

  // Clear output when user edits code
  const lastRunCodeRef = useRef(code);
  useEffect(() => {
    if (output.length === 0) return;
    if (code === lastRunCodeRef.current) return;
    setOutput([]);
  }, [code]);

  // Auto-save with 3-second debounce
  useEffect(() => {
    if (!user) return;

    const timer = setTimeout(async () => {
      const currentCode = codeRef.current;
      const currentHtml = htmlCodeRef.current;
      const currentCss = cssCodeRef.current;
      const currentName = projectNameRef.current;
      const name = isWebLanguage ? currentName : `${currentName}.${FILE_NAMES[language]?.split(".")[1] || "txt"}`;

      setSaveStatus("saving");
      try {
        if (currentProjectId) {
          const res = await fetch("/api/projects", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: user.email, projectId: currentProjectId, name, language, code: currentCode, htmlCode: currentHtml, cssCode: currentCss }),
          });
          if (res.ok) setSaveStatus("saved");
          else setSaveStatus("idle");
        } else {
          const res = await fetch("/api/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: user.email, name, language, code: currentCode, htmlCode: currentHtml, cssCode: currentCss }),
          });
          const data = await res.json();
          if (res.ok && data.project) {
            setCurrentProjectId(data.project.id);
            setSaveStatus("saved");
            window.history.replaceState(null, "", `/editor?id=${data.project.id}`);
          } else {
            setSaveStatus("idle");
          }
        }
      } catch {
        setSaveStatus("idle");
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [code, projectName, language, user, currentProjectId, htmlCode, cssCode]);

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
    // For HTML/CSS, preserve the other's code
    if (lang === "html") {
      setCode(htmlCode);
    } else if (lang === "css") {
      setCode(cssCode);
    } else {
      setCode(DEFAULT_CODE[lang] || "");
    }
    setOutput([]);
    setShowTerminal(false);
    setProjectName("untitled");
    setCurrentProjectId(null);
    setSaveStatus("idle");
  }, [htmlCode, cssCode]);

  const detectInputPrompts = useCallback((lang: string, code: string): { prompt: string; index: number }[] => {
    // Check if any input() is inside a loop — if so, too complex for pre-detection
    const lines = code.split("\n");
    let inLoop = false;
    let loopDepth = 0;
    let loopIndent = 0;
    for (const line of lines) {
      const trimmed = line.trim();
      const indent = line.length - line.trimStart().length;

      // Detect loop start
      if (/(for|while)\s+\w/.test(trimmed)) {
        loopDepth++;
        loopIndent = indent;
        inLoop = true;
      }

      // Check for input inside loop (anywhere in line, not just start)
      if (inLoop && /\b(input|gets|scanf|cin|getline)\s*\(/.test(trimmed)) {
        return []; // Input inside loop — use terminal instead
      }

      // Detect loop exit: non-empty line at base (<= loop) indentation
      if (inLoop && trimmed !== "" && !/(for|while)\s+\w/.test(trimmed)) {
        if (indent <= loopIndent) {
          loopDepth--;
          if (loopDepth <= 0) { inLoop = false; loopDepth = 0; }
        }
      }
    }

    const prompts: { prompt: string; index: number }[] = [];
    if (lang === "python") {
      const regex = /input\s*\(\s*["']([^"']*)["']\s*\)/g;
      let match;
      let i = 0;
      while ((match = regex.exec(code)) !== null) {
        prompts.push({ prompt: match[1] || `Input ${i + 1}`, index: i });
        i++;
      }
      const bareRegex = /input\s*\(\s*\)/g;
      while ((match = bareRegex.exec(code)) !== null) {
        prompts.push({ prompt: `Input ${i + 1}`, index: i });
        i++;
      }
    }
    if (lang === "javascript" || lang === "typescript") {
      const regex = /prompt\s*\(\s*["']([^"']*)["']\s*\)/g;
      let match;
      let i = 0;
      while ((match = regex.exec(code)) !== null) {
        prompts.push({ prompt: match[1] || `Input ${i + 1}`, index: i });
        i++;
      }
    }
    return prompts;
  }, []);

  // Run code + save to history
  const handleRun = useCallback(async () => {
    // Close agent panel when running
    setShowAgent(false);

    // For HTML/CSS, generate preview link
    if (isWebLanguage) {
      setIsRunning(true);
      try {
        const res = await fetch("/api/preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ htmlCode, cssCode }),
        });
        const data = await res.json();
        if (res.ok && data.previewUrl) {
          window.open(data.previewUrl, "_blank");
          toast("Preview opened in new tab!", "success");
        } else {
          toast(data.error || "Failed to generate preview", "error");
        }
      } catch {
        toast("Failed to generate preview", "error");
      }
      setIsRunning(false);
      return;
    }

    lastRunCodeRef.current = code;
    setOutput([]);

    // Detect input prompts
    const prompts = detectInputPrompts(language, code);
    const hasInput = /\b(input|gets|scanf|cin|getline)\s*\(/.test(code);

    if (prompts.length > 0) {
      // Simple input — show input fields
      setInputPrompts(prompts);
      setShowTerminal(false);
      return;
    }

    if (hasInput && prompts.length === 0) {
      // Complex input (inside loops) — show textarea for all inputs
      setInputPrompts([{ prompt: "stdin", index: 0 }]);
      setShowTerminal(false);
      return;
    }

    // Run via API (no input needed)
    setIsRunning(true);
    setShowTerminal(false);
    try {
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(user?.email ? { "x-user-email": user.email } : {}) },
        body: JSON.stringify({ language, code }),
      });
      const data = await res.json();
      if (data.error) {
        setOutput([data.error]);
      } else if (data.output && data.output.length > 0) {
        const clean = data.output.filter((l: string) => l.trim() !== "" && l !== "(no output)");
        setOutput(clean);
      } else {
        setOutput(["(no output)"]);
      }
    } catch (e: any) {
      setOutput(["Error: " + e.message]);
    } finally {
      setIsRunning(false);
      if (user) {
        fetch("/api/runs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email, projectName, language, code, output }),
        });
      }
    }
  }, [isWebLanguage, htmlCode, cssCode, toast, code, language, user, projectName, detectInputPrompts]);

  const handleReset = useCallback(() => {
    setCode(DEFAULT_CODE[language] || "");
    setOutput([]);
  }, [language]);

  const handleSave = useCallback(async () => {
    if (!user) return;
    const isWeb = language === "html" || language === "css";
    const name = isWeb ? projectName : `${projectName}.${FILE_NAMES[language]?.split(".")[1] || "txt"}`;
    try {
      const method = currentProjectId ? "PUT" : "POST";
      const body: Record<string, unknown> = { email: user.email, name, language, code };
      if (currentProjectId) body.projectId = currentProjectId;

      const res = await fetch("/api/projects", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        if (!currentProjectId && data.project) {
          setCurrentProjectId(data.project.id);
          window.history.replaceState(null, "", `/editor?id=${data.project.id}`);
        }
        setSaveStatus("saved");
        toast("Project saved successfully!", "success");
      } else {
        toast(data.error || "Failed to save", "error");
      }
    } catch {
      toast("Failed to save project", "error");
    }
  }, [user, projectName, language, code, toast, currentProjectId]);

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
      style={{ height: "100vh", display: "flex", flexDirection: "column", backgroundColor: theme.bg, color: theme.text, overflow: "hidden" }}
    >
      {/* Header — VS Code style */}
      <div
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          height: isMobile ? "48px" : "38px", padding: isMobile ? "0 10px" : "0 12px",
          borderBottom: `1px solid ${theme.border}`,
          backgroundColor: theme.panel, flexShrink: 0,
          fontSize: "12px", color: theme.muted,
          gap: "8px",
        }}
      >
        {/* Left: Logo + Project */}
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "6px" : "10px", minWidth: 0, flex: 1 }}>
          <Link href="/dashboard" style={{ display: "flex", alignItems: "center", color: theme.muted, textDecoration: "none", flexShrink: 0 }}
            onMouseEnter={(e) => { e.currentTarget.style.color = theme.text; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = theme.muted; }}>
            <Logo iconSize={18} textSize={0} />
          </Link>
          <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} className="font-mono"
            style={{ fontSize: "12px", fontWeight: 500, color: theme.text, backgroundColor: "transparent", border: "none", outline: "none", padding: "2px 4px", width: isMobile ? "90px" : "150px", minWidth: 0, borderRadius: "3px" }}
            onFocus={(e) => { e.currentTarget.style.backgroundColor = `${theme.text}08`; }}
            onBlur={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }} />
          {!isMobile && (
            <span className="font-mono" style={{ fontSize: "10px", color: theme.faint, flexShrink: 0 }}>
              {isWebLanguage ? "" : `· ${FILE_NAMES[language] || "main.txt"}`}
            </span>
          )}
          {saveStatus && saveStatus !== "idle" && (
            <span className="font-mono" style={{ fontSize: "10px", color: saveStatus === "saving" ? "#FBBF24" : "#34D399", flexShrink: 0 }}>
              {saveStatus === "saving" ? "●" : "○"}
            </span>
          )}
        </div>

        {/* Right: Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "2px" : "2px", flexShrink: 0 }}>
          {/* Theme */}
          <div ref={themeMenuRef} style={{ position: "relative" }}>
            <button onClick={() => setShowThemeMenu(!showThemeMenu)} title="Theme"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", width: isMobile ? "34px" : "28px", height: isMobile ? "34px" : "28px", backgroundColor: showThemeMenu ? `${theme.accent}15` : "transparent", color: showThemeMenu ? theme.accent : theme.muted, border: "none", borderRadius: "6px", cursor: "pointer", transition: "all 0.1s ease" }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${theme.text}10`; e.currentTarget.style.color = theme.text; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = showThemeMenu ? `${theme.accent}15` : "transparent"; e.currentTarget.style.color = showThemeMenu ? theme.accent : theme.muted; }}>
              <Palette size={14} />
            </button>
            {showThemeMenu && (
              <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "8px", padding: "4px", minWidth: "160px", zIndex: 50, boxShadow: "0 8px 30px -8px rgba(0,0,0,0.35)" }}>
                {(Object.keys(themes) as ThemeKey[]).map((key) => {
                  const t = themes[key];
                  const isActive = key === themeKey;
                  return (
                    <button key={key} onClick={() => { setTheme(key); setShowThemeMenu(false); }}
                      style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", padding: "6px 10px", border: "none", borderRadius: "4px", backgroundColor: isActive ? `${theme.accent}12` : "transparent", color: isActive ? theme.accent : theme.muted, cursor: "pointer", fontSize: "12px", textAlign: "left", transition: "background 0.1s ease" }}
                      onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = `${theme.text}08`; }}
                      onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = "transparent"; }}>
                      {(() => { const Icon = themeIcons[key]; return <Icon size={13} style={{ flexShrink: 0 }} />; })()}
                      <span className="font-body">{t.label}</span>
                      {isActive && <span style={{ marginLeft: "auto", width: "4px", height: "4px", borderRadius: "50%", backgroundColor: theme.accent }} />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          {/* History */}
          <button onClick={() => { setShowHistory(!showHistory); setShowAgent(false); }} title="History"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: isMobile ? "34px" : "28px", height: isMobile ? "34px" : "28px", backgroundColor: showHistory ? `${theme.accent}15` : "transparent", color: showHistory ? theme.accent : theme.muted, border: "none", borderRadius: "6px", cursor: "pointer", transition: "all 0.1s ease" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${theme.text}10`; e.currentTarget.style.color = theme.text; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = showHistory ? `${theme.accent}15` : "transparent"; e.currentTarget.style.color = showHistory ? theme.accent : theme.muted; }}>
            <History size={14} />
          </button>
          {/* Share */}
          <button onClick={handleShare} title="Share"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: isMobile ? "34px" : "28px", height: isMobile ? "34px" : "28px", backgroundColor: "transparent", color: theme.muted, border: "none", borderRadius: "6px", cursor: "pointer", transition: "all 0.1s ease" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${theme.text}10`; e.currentTarget.style.color = theme.text; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = theme.muted; }}>
            <Share2 size={14} />
          </button>
          <div style={{ width: "1px", height: isMobile ? "20px" : "16px", backgroundColor: theme.border, margin: isMobile ? "0 2px" : "0 4px" }} />
          {/* CodeIQ AI */}
          <button onClick={() => { setShowAgent(!showAgent); setShowHistory(false); }}
            title="CodeIQ AI"
            style={{ display: "flex", alignItems: "center", gap: "5px", height: isMobile ? "34px" : "28px", padding: isMobile ? "0 8px" : "0 10px", fontSize: "11px", fontWeight: 500,
              backgroundColor: showAgent ? `${theme.accent}15` : "transparent", color: showAgent ? theme.accent : theme.muted,
              border: "none", borderRadius: "6px", cursor: "pointer", transition: "all 0.1s ease" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${theme.text}10`; e.currentTarget.style.color = theme.text; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = showAgent ? `${theme.accent}15` : "transparent"; e.currentTarget.style.color = showAgent ? theme.accent : theme.muted; }}>
            <Bot size={13} />
            {!isMobile && <span className="font-mono">CodeIQ</span>}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div ref={containerRef} style={{ flex: 1, display: "flex", flexDirection: isMobile ? "column" : "row", padding: isMobile ? "8px" : "16px 24px 24px", gap: isMobile ? "8px" : "0", minHeight: 0, overflow: "hidden" }}>

        {isWebLanguage ? (
          /* HTML/CSS: Side-by-side on desktop, tabbed on mobile */
          <div style={{ width: "100%", display: "flex", flexDirection: "column", border: `1px solid ${theme.border}`, borderRadius: "8px", overflow: "hidden", minHeight: isMobile ? "auto" : "400px", flex: isMobile ? "none" : 1 }}>
            <EditorToolbar language={language} onLanguageChange={handleLanguageChange} onRun={handleRun} isRunning={isRunning} saveStatus={saveStatus} />
            {isMobile ? (
              /* Mobile: tabbed layout */
              <>
                <div style={{ display: "flex", borderBottom: `1px solid ${theme.border}`, backgroundColor: theme.panel }}>
                  {(["html", "css"] as const).map((tab) => (
                    <button key={tab} onClick={() => { setWebTab(tab); setLanguage(tab); setCode(tab === "html" ? htmlCode : cssCode); }}
                      className="font-mono" style={{
                        flex: 1, padding: "8px", fontSize: "11px", fontWeight: 600, textTransform: "uppercase",
                        letterSpacing: "0.08em", cursor: "pointer", border: "none",
                        backgroundColor: "transparent", transition: "all 0.15s ease",
                        color: webTab === tab ? theme.accent : theme.faint,
                        borderBottom: `2px solid ${webTab === tab ? theme.accent : "transparent"}`,
                      }}>
                      {tab === "html" ? "index.html" : "style.css"}
                    </button>
                  ))}
                </div>
                <div style={{ flex: 1, minHeight: "300px" }}>
                  <CodeEditor language={webTab} value={webTab === "html" ? htmlCode : cssCode} onChange={webTab === "html" ? setHtmlCode : setCssCode} />
                </div>
              </>
            ) : (
              /* Desktop: side-by-side editors */
              <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", borderRight: `1px solid ${theme.border}`, minWidth: 0 }}>
                  <div className="font-mono" style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: language === "html" ? theme.accent : theme.faint, padding: "6px 12px", borderBottom: `1px solid ${theme.border}`, backgroundColor: theme.panel, display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}
                    onClick={() => { setLanguage("html"); setCode(htmlCode); }}>
                    <span style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: language === "html" ? theme.accent : theme.faint }} />
                    index.html
                  </div>
                  <div style={{ flex: 1, minHeight: 0 }}>
                    <CodeEditor language="html" value={htmlCode} onChange={setHtmlCode} />
                  </div>
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
                  <div className="font-mono" style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: language === "css" ? theme.accent : theme.faint, padding: "6px 12px", borderBottom: `1px solid ${theme.border}`, backgroundColor: theme.panel, display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}
                    onClick={() => { setLanguage("css"); setCode(cssCode); }}>
                    <span style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: language === "css" ? theme.accent : theme.faint }} />
                    style.css
                  </div>
                  <div style={{ flex: 1, minHeight: 0 }}>
                    <CodeEditor language="css" value={cssCode} onChange={setCssCode} />
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Other languages: Editor + Output split */
          <>
            <div style={{ width: isMobile ? "100%" : `${splitPos}%`, flex: isMobile ? 1 : "none", display: "flex", flexDirection: "column", border: `1px solid ${theme.border}`, borderRadius: "8px", overflow: "hidden", height: isMobile ? "auto" : "100%" }}>
              <EditorToolbar language={language} onLanguageChange={handleLanguageChange} onRun={handleRun} isRunning={isRunning} saveStatus={saveStatus} />
              <div style={{ flex: 1, minHeight: 0 }}>
                <CodeEditor language={language} value={code} onChange={handleCodeChange} />
              </div>
            </div>

            {!isMobile && <div onMouseDown={handleDragStart} style={{ width: "6px", backgroundColor: theme.border, cursor: "col-resize", display: "flex", alignItems: "center", justifyContent: "center", transition: "background-color 0.2s ease", flexShrink: 0 }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.accent; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = theme.border; }}>
              <div style={{ width: "2px", height: "40px", borderRadius: "1px", backgroundColor: theme.faint }} />
            </div>}

            {showHistory ? (
              <div style={{ width: isMobile ? "100%" : `${100 - splitPos}%`, flex: isMobile ? 1 : "none", border: `1px solid ${theme.border}`, borderRadius: "8px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div style={{ padding: "10px 16px", borderBottom: `1px solid ${theme.border}`, backgroundColor: theme.panel, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Clock size={14} style={{ color: theme.faint }} />
                    <span className="font-mono" style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: theme.faint }}>Run History</span>
                  </div>
                  <button onClick={() => setShowHistory(false)} style={{ background: "none", border: "none", cursor: "pointer", color: theme.faint, padding: "2px" }}>
                    <X size={14} />
                  </button>
                </div>
                <div style={{ flex: 1, overflow: "auto", padding: "8px" }}>
                  {runHistory.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px 20px" }}>
                      <History size={24} style={{ color: theme.faint, marginBottom: "8px" }} />
                      <p className="font-mono" style={{ fontSize: "12px", color: theme.faint }}>No runs yet. Click "Run" to save history.</p>
                    </div>
                  ) : (
                    runHistory.map((run) => (
                      <button key={run.id} onClick={() => { setCode(run.code); setLanguage(run.language); setShowHistory(false); }}
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
              <>
                {/* Output Panel or Terminal */}
                <div style={{ width: isMobile ? "100%" : `${100 - splitPos}%`, flex: isMobile ? 1 : "none", border: `1px solid ${theme.border}`, borderRadius: "8px", overflow: "hidden", height: isMobile ? "auto" : "100%", display: showAgent ? "none" : "block" }}>
                  {showTerminal ? (
                    <Terminal
                      key={terminalKey}
                      language={language}
                      code={code}
                      onExit={(exitCode) => {
                        setIsRunning(false);
                        setShowTerminal(false);
                      }}
                    />
                  ) : (
                    <OutputPanel
                      output={output}
                      isRunning={isRunning}
                      inputFields={inputPrompts.length > 0 ? inputPrompts : undefined}
                      onRunWithInput={async (values) => {
                        const stdin = values.join("\n");
                        const prompts = inputPrompts.map((p) => p.prompt);
                        setInputPrompts([]);
                        lastRunCodeRef.current = code;
                        setOutput([]);
                        setIsRunning(true);
                        try {
                          const res = await fetch("/api/execute", {
                            method: "POST",
                            headers: { "Content-Type": "application/json", ...(user?.email ? { "x-user-email": user.email } : {}) },
                            body: JSON.stringify({ language, code, stdinInput: stdin, inputPrompts: prompts }),
                          });
                          const data = await res.json();
                          if (data.error) setOutput([data.error]);
                          else if (data.output) setOutput(data.output.filter((l: string) => l.trim() !== "" && l !== "(no output)"));
                          else setOutput(["(no output)"]);
                        } catch (e: any) {
                          setOutput(["Error: " + e.message]);
                        } finally {
                          setIsRunning(false);
                        }
                      }}
                      onClear={() => { setOutput([]); setInputPrompts([]); }}
                    />
                  )}
                </div>

                {/* AI Agent — Desktop: side panel, Mobile: bottom sheet */}
                {!isMobile ? (
                  <div style={{ width: `${100 - splitPos}%`, border: `1px solid ${theme.border}`, borderRadius: "0 8px 8px 0", overflow: "hidden", height: "100%", display: showAgent ? "block" : "none" }}>
                    <AgentPanel key={agentKey} language={language} existingCode={code}
                      onApplyAndRun={(lang, newCode) => {
                        appliedCodeRef.current = newCode;
                        setCode(newCode);
                        if (lang === "html") setHtmlCode(newCode);
                        else if (lang === "css") setCssCode(newCode);
                        lastRunCodeRef.current = newCode;
                        setOutput([]);
                        setIsRunning(true);
                        fetch("/api/execute", {
                          method: "POST",
                          headers: { "Content-Type": "application/json", ...(user?.email ? { "x-user-email": user.email } : {}) },
                          body: JSON.stringify({ language: lang, code: newCode }),
                        })
                          .then((r) => r.json())
                          .then((data) => {
                            if (data.error) setOutput([data.error]);
                            else if (data.output) setOutput(data.output.filter((l: string) => l.trim() !== "" && l !== "(no output)"));
                            else setOutput(["(no output)"]);
                          })
                          .catch((e) => setOutput(["Error: " + e.message]))
                          .finally(() => setIsRunning(false));
                      }}
                      onClose={() => setShowAgent(false)}
                    onNewChat={() => setAgentKey((k) => k + 1)} />
                  </div>
                ) : showAgent && (
                  /* Mobile: bottom sheet */
                  <>
                    <div onClick={() => setShowAgent(false)} style={{
                      position: "fixed", inset: 0, zIndex: 199,
                      backgroundColor: "rgba(0,0,0,0.45)",
                      animation: "agentFadeIn 0.2s ease",
                    }} />
                    <div style={{
                      position: "fixed", bottom: 0, left: 0, right: 0,
                      height: "75vh", zIndex: 200,
                      backgroundColor: theme.bg,
                      borderTopLeftRadius: "20px", borderTopRightRadius: "20px",
                      border: `1px solid ${theme.border}`, borderBottom: "none",
                      display: "flex", flexDirection: "column",
                      boxShadow: "0 -8px 40px rgba(0,0,0,0.4)",
                      animation: "agentSheetUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}>
                      {/* Drag handle */}
                      <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px", cursor: "pointer" }}
                        onClick={() => setShowAgent(false)}>
                        <div style={{ width: "36px", height: "4px", borderRadius: "2px", backgroundColor: theme.faint, opacity: 0.5 }} />
                      </div>
                      <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
                        <AgentPanel key={agentKey} language={language} existingCode={code}
                          onApplyAndRun={(lang, newCode) => {
                            appliedCodeRef.current = newCode;
                            setCode(newCode);
                            if (lang === "html") setHtmlCode(newCode);
                            else if (lang === "css") setCssCode(newCode);
                            lastRunCodeRef.current = newCode;
                            setOutput([]);
                            setIsRunning(true);
                            fetch("/api/execute", {
                              method: "POST",
                              headers: { "Content-Type": "application/json", ...(user?.email ? { "x-user-email": user.email } : {}) },
                              body: JSON.stringify({ language: lang, code: newCode }),
                            })
                              .then((r) => r.json())
                              .then((data) => {
                                if (data.error) setOutput([data.error]);
                                else if (data.output) setOutput(data.output.filter((l: string) => l.trim() !== "" && l !== "(no output)"));
                                else setOutput(["(no output)"]);
                              })
                              .catch((e) => setOutput(["Error: " + e.message]))
                              .finally(() => setIsRunning(false));
                          }}
                          onClose={() => setShowAgent(false)}
                        onNewChat={() => setAgentKey((k) => k + 1)} />
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes agentFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes agentSheetUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
      `}</style>

      {/* Share modal */}
      {showShare && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}
          onClick={() => setShowShare(false)}>
          <div style={{ backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "12px", padding: isMobile ? "20px" : "28px", width: "100%", maxWidth: "420px", margin: isMobile ? "16px" : "0" }}
            onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display" style={{ fontSize: "20px", fontWeight: 400, marginBottom: "12px" }}>Share your code</h3>
            <p className="font-body" style={{ fontSize: "13px", color: theme.muted, marginBottom: "16px" }}>
              Anyone with this link can view your code.
            </p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <input readOnly value={`${window.location.origin}${shareUrl}`} className="font-mono"
                style={{ flex: 1, minWidth: 0, padding: "10px 12px", fontSize: "13px", backgroundColor: theme.bg, color: theme.text, border: `1px solid ${theme.border}`, borderRadius: "6px", outline: "none" }} />
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

// Wrap with Suspense for useSearchParams
export default function EditorPageWrapper() {
  return (
    <Suspense fallback={<div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#000", color: "#fff" }}><span style={{ fontSize: "13px", opacity: 0.5 }}>Loading editor...</span></div>}>
      <EditorPage />
    </Suspense>
  );
}
