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
import TemplateSelector from "@/components/editor/TemplateSelector";
import SavePromptModal from "@/components/editor/SavePromptModal";

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
  html: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>My Web Page</title>\n</head>\n<body>\n  <h1>Hello, World!</h1>\n  <p>Start building your webpage here.</p>\n</body>\n</html>`,
  css: `/* CodeIQ CSS Editor */\n\n* {\n  box-sizing: border-box;\n}\n\nbody {\n  margin: 0;\n  font-family: Arial, sans-serif;\n  padding: 40px;\n}`,
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

function EditorPage({ initialLanguage }: { initialLanguage?: string } = {}) {
  const { theme, themeKey, setTheme } = useTheme();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("id");
  const [language, setLanguage] = useState(initialLanguage || "javascript");
  const [code, setCode] = useState(DEFAULT_CODE[initialLanguage || "javascript"] || DEFAULT_CODE.javascript);
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

  const [currentProjectId, setCurrentProjectId] = useState<number | null>(projectId ? Number(projectId) : null);

  useEffect(() => {
    if (appliedCodeRef.current && code !== appliedCodeRef.current) {
      setCode(appliedCodeRef.current);
    }
  }, [code]);

  const handleCodeChange = useCallback((newCode: string) => {
    appliedCodeRef.current = null;
    setCode(newCode);
    if (language === "html") setHtmlCode(newCode);
    else if (language === "css") setCssCode(newCode);
  }, [language]);

  const [showHistory, setShowHistory] = useState(false);
  const [showAgent, setShowAgent] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [agentKey, setAgentKey] = useState(0);
  const appliedCodeRef = useRef<string | null>(null);
  const [runHistory, setRunHistory] = useState<RunHistory[]>([]);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalKey, setTerminalKey] = useState(0);
  const [inputPrompts, setInputPrompts] = useState<{ prompt: string; index: number }[]>([]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (themeMenuRef.current && !themeMenuRef.current.contains(e.target as Node)) setShowThemeMenu(false);
    }
    if (showThemeMenu) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showThemeMenu]);

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
          if (project.language === "html" || project.language === "css") {
            try {
              const parsed = JSON.parse(project.code);
              if (parsed.format === "codeiq-web") {
                setHtmlCode(parsed.html?.code || "");
                setCssCode(parsed.css?.code || "");
                setCode(project.language === "html" ? (parsed.html?.code || "") : (parsed.css?.code || ""));
              } else {
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

  useEffect(() => {
    if (!user) return;
    const draftCode = sessionStorage.getItem("codeiq_draft_code");
    if (!draftCode) return;
    const draftLanguage = sessionStorage.getItem("codeiq_draft_language") || "javascript";
    const draftName = sessionStorage.getItem("codeiq_draft_name") || "untitled";
    const draftHtml = sessionStorage.getItem("codeiq_draft_html");
    const draftCss = sessionStorage.getItem("codeiq_draft_css");
    if (currentProjectId === null) {
      setLanguage(draftLanguage);
      setProjectName(draftName);
      setCode(draftCode);
      if (draftHtml) setHtmlCode(draftHtml);
      if (draftCss) setCssCode(draftCss);
    }
    sessionStorage.removeItem("codeiq_draft_code");
    sessionStorage.removeItem("codeiq_draft_language");
    sessionStorage.removeItem("codeiq_draft_name");
    sessionStorage.removeItem("codeiq_draft_html");
    sessionStorage.removeItem("codeiq_draft_css");
  }, [user]);

  const loadHistory = useCallback(() => {
    if (!user) return;
    fetch(`/api/runs?email=${encodeURIComponent(user.email)}&project=${encodeURIComponent(projectName)}`)
      .then((res) => res.json()).then((data) => setRunHistory(data.runs || []));
  }, [user, projectName]);

  useEffect(() => { if (showHistory) loadHistory(); }, [showHistory, loadHistory]);

  const lastRunCodeRef = useRef(code);
  useEffect(() => {
    if (output.length === 0) return;
    if (code === lastRunCodeRef.current) return;
    setOutput([]);
  }, [code]);

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
    if (lang === "html") setCode(htmlCode);
    else if (lang === "css") setCode(cssCode);
    else setCode(DEFAULT_CODE[lang] || "");
    setOutput([]);
    setShowTerminal(false);
    setProjectName("untitled");
    setCurrentProjectId(null);
  }, [htmlCode, cssCode]);

  const detectInputPrompts = useCallback((lang: string, code: string): { prompt: string; index: number }[] => {
    const lines = code.split("\n");
    let inLoop = false;
    let loopDepth = 0;
    let loopIndent = 0;
    for (const line of lines) {
      const trimmed = line.trim();
      const indent = line.length - line.trimStart().length;
      if (/(for|while)\s+\w/.test(trimmed)) { loopDepth++; loopIndent = indent; inLoop = true; }
      if (inLoop && /\b(input|gets|scanf|cin|getline)\s*\(/.test(trimmed)) return [];
      if (inLoop && trimmed !== "" && !/(for|while)\s+\w/.test(trimmed) && indent <= loopIndent) {
        loopDepth--;
        if (loopDepth <= 0) { inLoop = false; loopDepth = 0; }
      }
    }
    const prompts: { prompt: string; index: number }[] = [];
    if (lang === "python") {
      const regex = /input\s*\(\s*["']([^"']*)["']\s*\)/g;
      let match; let i = 0;
      while ((match = regex.exec(code)) !== null) { prompts.push({ prompt: match[1] || `Input ${i + 1}`, index: i }); i++; }
      const bareRegex = /input\s*\(\s*\)/g;
      while ((match = bareRegex.exec(code)) !== null) { prompts.push({ prompt: `Input ${i + 1}`, index: i }); i++; }
    }
    if (lang === "javascript" || lang === "typescript") {
      const regex = /prompt\s*\(\s*["']([^"']*)["']\s*\)/g;
      let match; let i = 0;
      while ((match = regex.exec(code)) !== null) { prompts.push({ prompt: match[1] || `Input ${i + 1}`, index: i }); i++; }
    }
    return prompts;
  }, []);

  const handleRunWithInput = useCallback(async (values: string[]) => {
    setShowAgent(false);
    setShowTerminal(true);
    setIsRunning(true);
    setOutput([]);

    try {
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(user?.email ? { "x-user-email": user.email } : {}),
        },
        body: JSON.stringify({
          language,
          code,
          stdinInput: values.join("\n"),
          inputPrompts: inputPrompts.map((item) => item.prompt),
        }),
      });
      const data = await res.json();
      if (data.error) setOutput([data.error, ...(data.output || [])]);
      else if (data.output && data.output.length > 0) setOutput(data.output);
      else setOutput(["(no output)"]);
    } catch (e: any) {
      setOutput(["Error: " + e.message]);
    } finally {
      setIsRunning(false);
      setInputPrompts([]);
    }
  }, [user, language, code, inputPrompts]);

  const handleRun = useCallback(async () => {
    setShowAgent(false);
    if (isWebLanguage) {
      setIsRunning(true);
      try {
        const res = await fetch("/api/preview", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ htmlCode, cssCode }) });
        const data = await res.json();
        if (res.ok && data.previewUrl) { window.open(data.previewUrl, "_blank"); toast("Preview opened in new tab!", "success"); }
        else toast(data.error || "Failed to generate preview", "error");
      } catch { toast("Failed to generate preview", "error"); }
      setIsRunning(false);
      return;
    }
    lastRunCodeRef.current = code;
    setOutput([]);
    setShowTerminal(true);
    const prompts = detectInputPrompts(language, code);
    const hasInput = /\b(input|gets|scanf|cin|getline)\s*\(/.test(code);
    if (prompts.length > 0) { setInputPrompts(prompts); setIsRunning(false); return; }
    if (hasInput && prompts.length === 0) { setInputPrompts([{ prompt: "stdin", index: 0 }]); setIsRunning(false); return; }
    setIsRunning(true);
    try {
      const res = await fetch("/api/execute", { method: "POST", headers: { "Content-Type": "application/json", ...(user?.email ? { "x-user-email": user.email } : {}) }, body: JSON.stringify({ language, code }) });
      const data = await res.json();
      if (data.error) setOutput([data.error, ...(data.output || [])]);
      else if (data.output && data.output.length > 0) setOutput(data.output);
      else setOutput(["(no output)"]);
    } catch (e: any) { setOutput(["Error: " + e.message]); }
    finally {
      setIsRunning(false);
      if (user) fetch("/api/runs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: user.email, projectName, language, code, output }) });
    }
  }, [isWebLanguage, htmlCode, cssCode, toast, code, language, user, projectName, detectInputPrompts]);

  const showOutputPanel = !isWebLanguage || showTerminal || isRunning || output.length > 0 || inputPrompts.length > 0;

  const handleReset = useCallback(() => {
    setCode(DEFAULT_CODE[language] || "");
    setOutput([]);
    setInputPrompts([]);
    setShowTerminal(false);
  }, [language]);

  const handleSave = useCallback(async () => {
    if (!user) {
      sessionStorage.setItem("codeiq_draft_code", code);
      sessionStorage.setItem("codeiq_draft_language", language);
      sessionStorage.setItem("codeiq_draft_name", projectName);
      if (language === "html" || language === "css") {
        sessionStorage.setItem("codeiq_draft_html", htmlCode);
        sessionStorage.setItem("codeiq_draft_css", cssCode);
      }
      setShowSavePrompt(true);
      return;
    }
    const isWeb = language === "html" || language === "css";
    const name = isWeb ? projectName : `${projectName}.${FILE_NAMES[language]?.split(".")[1] || "txt"}`;
    try {
      const method = currentProjectId ? "PUT" : "POST";
      const body: Record<string, unknown> = { email: user.email, name, language, code };
      if (currentProjectId) body.projectId = currentProjectId;
      const res = await fetch("/api/projects", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (res.ok) {
        if (!currentProjectId && data.project) { setCurrentProjectId(data.project.id); window.history.replaceState(null, "", `/editor?id=${data.project.id}`); }
        toast("Project saved successfully!", "success");
      } else toast(data.error || "Failed to save", "error");
    } catch { toast("Failed to save", "error"); }
  }, [user, projectName, language, code, htmlCode, cssCode, currentProjectId, toast]);

  const handleShare = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch("/api/share", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: user.email, projectName, language, code }) });
      const data = await res.json();
      if (res.ok) { setShareUrl(data.shareUrl); setShowShare(true); toast("Share link created!", "success"); }
      else toast(data.error || "Failed to share", "error");
    } catch { toast("Failed to create share link", "error"); }
  }, [user, projectName, language, code, toast]);

  const copyShareUrl = () => {
    const fullUrl = `${window.location.origin}${shareUrl}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`${display.variable} ${bodyFont.variable} ${mono.variable}`} style={{ height: "100vh", display: "flex", flexDirection: "column", backgroundColor: theme.bg, color: theme.text, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: isMobile ? "48px" : "38px", padding: isMobile ? "0 10px" : "0 12px", borderBottom: `1px solid ${theme.border}`, backgroundColor: theme.panel, flexShrink: 0, fontSize: "12px", color: theme.muted, gap: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "6px" : "10px", minWidth: 0, flex: 1 }}>
          <Link href="/dashboard" style={{ display: "flex", alignItems: "center", color: theme.muted, textDecoration: "none", flexShrink: 0 }}><Logo iconSize={18} textSize={0} /></Link>
          <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} className="font-mono" style={{ fontSize: "12px", fontWeight: 500, color: theme.text, backgroundColor: "transparent", border: "none", outline: "none", padding: "2px 4px", width: isMobile ? "90px" : "150px", minWidth: 0, borderRadius: "3px" }} />
          {!isMobile && <span className="font-mono" style={{ fontSize: "10px", color: theme.faint, flexShrink: 0 }}>{isWebLanguage ? "" : `· ${FILE_NAMES[language] || "main.txt"}`}</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "2px", flexShrink: 0 }}>
          <div ref={themeMenuRef} style={{ position: "relative" }}>
            <button onClick={() => setShowThemeMenu(!showThemeMenu)} title="Theme" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: isMobile ? "34px" : "28px", height: isMobile ? "34px" : "28px", backgroundColor: showThemeMenu ? `${theme.accent}15` : "transparent", color: showThemeMenu ? theme.accent : theme.muted, border: "none", borderRadius: "6px", cursor: "pointer" }}><Palette size={14} /></button>
            {showThemeMenu && <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "8px", padding: "4px", minWidth: "160px", zIndex: 50 }}>{(Object.keys(themes) as ThemeKey[]).map((key) => { const t = themes[key]; const isActive = key === themeKey; return <button key={key} onClick={() => { setTheme(key); setShowThemeMenu(false); }} style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", padding: "6px 10px", border: "none", borderRadius: "4px", backgroundColor: isActive ? `${theme.accent}12` : "transparent", color: isActive ? theme.accent : theme.muted, cursor: "pointer", fontSize: "12px", textAlign: "left" }}>{(() => { const Icon = themeIcons[key]; return <Icon size={13} style={{ flexShrink: 0 }} />; })()}<span className="font-body">{t.label}</span>{isActive && <span style={{ marginLeft: "auto", width: "4px", height: "4px", borderRadius: "50%", backgroundColor: theme.accent }} />}</button>; })}</div>}
          </div>
          <button onClick={() => { setShowHistory(!showHistory); setShowAgent(false); }} title="History" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: isMobile ? "34px" : "28px", height: isMobile ? "34px" : "28px", backgroundColor: showHistory ? `${theme.accent}15` : "transparent", color: showHistory ? theme.accent : theme.muted, border: "none", borderRadius: "6px", cursor: "pointer" }}><History size={14} /></button>
          <button onClick={handleShare} title="Share" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: isMobile ? "34px" : "28px", height: isMobile ? "34px" : "28px", backgroundColor: "transparent", color: theme.muted, border: "none", borderRadius: "6px", cursor: "pointer" }}><Share2 size={14} /></button>
          <div style={{ width: "1px", height: isMobile ? "20px" : "16px", backgroundColor: theme.border, margin: isMobile ? "0 2px" : "0 4px" }} />
          <button onClick={() => { setShowAgent(!showAgent); setShowHistory(false); }} title="CodeIQ AI" style={{ display: "flex", alignItems: "center", gap: "5px", height: isMobile ? "34px" : "28px", padding: isMobile ? "0 8px" : "0 10px", fontSize: "11px", fontWeight: 500, backgroundColor: showAgent ? `${theme.accent}15` : "transparent", color: showAgent ? theme.accent : theme.muted, border: "none", borderRadius: "6px", cursor: "pointer" }}><Bot size={13} />{!isMobile && <span className="font-mono">CodeIQ</span>}</button>
        </div>
      </div>

      <div ref={containerRef} style={{ flex: 1, display: "flex", flexDirection: isMobile ? "column" : "row", padding: isMobile ? "8px" : "16px 24px 24px", gap: isMobile ? "8px" : "0", minHeight: 0, overflow: "hidden" }}>
        {isWebLanguage ? (
          <div style={{ width: "100%", display: "flex", flexDirection: "column", border: `1px solid ${theme.border}`, borderRadius: "8px", overflow: "hidden", minHeight: isMobile ? "auto" : "400px", flex: isMobile ? "none" : 1 }}>
            <EditorToolbar language={language} onLanguageChange={handleLanguageChange} onRun={handleRun} onSave={handleSave} isRunning={isRunning} onTemplates={() => setShowTemplates(true)} />
            {isMobile ? (
              <>
                <div style={{ display: "flex", borderBottom: `1px solid ${theme.border}`, backgroundColor: theme.panel }}>
                  {(["html", "css"] as const).map((tab) => <button key={tab} onClick={() => { setWebTab(tab); setLanguage(tab); setCode(tab === "html" ? htmlCode : cssCode); }} className="font-mono" style={{ flex: 1, padding: "8px", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", cursor: "pointer", border: "none", backgroundColor: "transparent", color: webTab === tab ? theme.accent : theme.faint, borderBottom: `2px solid ${webTab === tab ? theme.accent : "transparent"}` }}>{tab === "html" ? "index.html" : "style.css"}</button>)}
                </div>
                <div style={{ flex: 1, minHeight: "300px" }}><CodeEditor language={webTab} value={webTab === "html" ? htmlCode : cssCode} onChange={(newCode) => { if (webTab === "html") setHtmlCode(newCode); else setCssCode(newCode); setCode(newCode); }} /></div>
              </>
            ) : (
              <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", borderRight: `1px solid ${theme.border}`, minWidth: 0 }}>
                  <div className="font-mono" style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: language === "html" ? theme.accent : theme.faint, padding: "6px 12px", borderBottom: `1px solid ${theme.border}`, backgroundColor: theme.panel, display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }} onClick={() => { setLanguage("html"); setCode(htmlCode); }}><span style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: language === "html" ? theme.accent : theme.faint }} />index.html</div>
                  <div style={{ flex: 1, minHeight: 0 }}><CodeEditor language="html" value={htmlCode} onChange={(newCode) => { setHtmlCode(newCode); setCode(newCode); }} /></div>
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
                  <div className="font-mono" style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: language === "css" ? theme.accent : theme.faint, padding: "6px 12px", borderBottom: `1px solid ${theme.border}`, backgroundColor: theme.panel, display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }} onClick={() => { setLanguage("css"); setCode(cssCode); }}><span style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: language === "css" ? theme.accent : theme.faint }} />style.css</div>
                  <div style={{ flex: 1, minHeight: 0 }}><CodeEditor language="css" value={cssCode} onChange={(newCode) => { setCssCode(newCode); setCode(newCode); }} /></div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <div
              style={{
                width: isMobile ? "100%" : `${splitPos}%`,
                flex: isMobile ? (showOutputPanel ? "0 0 60%" : 1) : "none",
                minWidth: 0,
                minHeight: 0,
                display: "flex",
                flexDirection: "column",
                border: `1px solid ${theme.border}`,
                borderRadius: "8px",
                overflow: "hidden",
                height: isMobile ? "auto" : "100%",
              }}
            >
              <EditorToolbar language={language} onLanguageChange={handleLanguageChange} onRun={handleRun} onSave={handleSave} isRunning={isRunning} onTemplates={() => setShowTemplates(true)} />
              <div style={{ flex: 1, minHeight: 0 }}><CodeEditor language={language} value={code} onChange={handleCodeChange} /></div>
            </div>

            {showOutputPanel && (
              <>
                {!isMobile && (
                  <div
                    onMouseDown={handleDragStart}
                    title="Drag to resize"
                    style={{
                      width: "8px",
                      flexShrink: 0,
                      cursor: "col-resize",
                      backgroundColor: theme.bg,
                      borderLeft: `1px solid ${theme.border}`,
                      borderRight: `1px solid ${theme.border}`,
                    }}
                  />
                )}
                <div
                  style={{
                    width: isMobile ? "100%" : `${100 - splitPos}%`,
                    flex: isMobile ? "0 0 40%" : 1,
                    minWidth: 0,
                    minHeight: isMobile ? "220px" : 0,
                    border: `1px solid ${theme.border}`,
                    borderRadius: "8px",
                    overflow: "hidden",
                    backgroundColor: theme.panel,
                  }}
                >
                  <OutputPanel
                    output={output}
                    isRunning={isRunning}
                    inputFields={inputPrompts}
                    onRunWithInput={handleRunWithInput}
                    onClear={() => {
                      setOutput([]);
                      setInputPrompts([]);
                      setShowTerminal(false);
                    }}
                  />
                </div>
              </>
            )}
          </>
        )}
      </div>

      {showTemplates && (
        <TemplateSelector
          language={language}
          onSelect={(templateCode, lang) => {
            appliedCodeRef.current = templateCode;
            setLanguage(lang);
            setCode(templateCode);
            if (lang === "html") {
              setHtmlCode(templateCode);
              setWebTab("html");
            } else if (lang === "css") {
              setCssCode(templateCode);
              setWebTab("css");
            }
            setOutput([]);
            setShowTerminal(false);
          }}
          onClose={() => setShowTemplates(false)}
        />
      )}

      {/* The remaining share/save/agent UI stays unchanged in the deployed component. */}
      {showShare && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={() => setShowShare(false)}>
          <div style={{ backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "12px", padding: isMobile ? "20px" : "28px", width: "100%", maxWidth: "420px", margin: isMobile ? "16px" : "0" }} onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display" style={{ fontSize: "20px", fontWeight: 400, marginBottom: "12px" }}>Share your code</h3>
            <p className="font-body" style={{ fontSize: "13px", color: theme.muted, marginBottom: "16px" }}>Anyone with this link can view your code.</p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}><input readOnly value={`${window.location.origin}${shareUrl}`} className="font-mono" style={{ flex: 1, minWidth: 0, padding: "10px 12px", fontSize: "13px", backgroundColor: theme.bg, color: theme.text, border: `1px solid ${theme.border}`, borderRadius: "6px", outline: "none" }} /><button onClick={copyShareUrl} style={{ padding: "10px 16px", fontSize: "13px", fontWeight: 500, backgroundColor: theme.accent, color: theme.bg, border: "none", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap" }}>{copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}</button></div>
            <button onClick={() => setShowShare(false)} style={{ marginTop: "16px", width: "100%", padding: "8px", fontSize: "13px", backgroundColor: "transparent", color: theme.muted, border: `1px solid ${theme.border}`, borderRadius: "6px", cursor: "pointer" }}>Close</button>
          </div>
        </div>
      )}
      <SavePromptModal isOpen={showSavePrompt} onClose={() => setShowSavePrompt(false)} />
    </div>
  );
}

export default function EditorPageContent({ initialLanguage }: { initialLanguage?: string } = {}) {
  return <Suspense fallback={<div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#000", color: "#fff" }}><span style={{ fontSize: "13px", opacity: 0.5 }}>Loading editor...</span></div>}><EditorPage initialLanguage={initialLanguage} /></Suspense>;
}
