"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpen, Rocket, Code2, Settings, ChevronRight, ChevronDown, Sparkles, Moon, Bot, Gamepad2, Waves, Shield, Sun, ArrowLeft } from "lucide-react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import { useTheme } from "@/components/landing/ThemeContext";
import { themes } from "@/components/landing/theme";
import { useIsMobile } from "@/hooks/useMediaQuery";

interface RegistryLanguage { id: string; name: string; version?: string; executionType?: string; }

const SECTIONS = [
  { id: "getting-started", icon: Rocket, title: "Getting Started" },
  { id: "quick-start", icon: BookOpen, title: "Quick Start" },
  { id: "languages", icon: Code2, title: "Supported Languages" },
  { id: "ai-completion", icon: Sparkles, title: "AI Completion" },
  { id: "themes", icon: Settings, title: "Themes" },
];

const THEME_ITEMS = [
  { name: "Midnight", icon: Moon, desc: "Clean dark with white accents", color: themes.midnight.accent },
  { name: "Cyberpunk", icon: Bot, desc: "Neon pink on deep purple", color: themes.cyberpunk.accent },
  { name: "Retro Gaming", icon: Gamepad2, desc: "Yellow on navy blue", color: themes.retro.accent },
  { name: "Neon Nights", icon: Sparkles, desc: "Purple on dark blue", color: themes.neonNights.accent },
  { name: "Deep Ocean", icon: Waves, desc: "Cyan on dark teal", color: themes.ocean.accent },
  { name: "Hacker", icon: Shield, desc: "Green on black", color: themes.hacker.accent },
  { name: "Light Mode", icon: Sun, desc: "Clean white with black text", color: themes.lightmode.accent },
];

export default function DocsPage() {
  const { theme, themeKey } = useTheme();
  const isMobile = useIsMobile();
  const [activeSection, setActiveSection] = useState("getting-started");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [languages, setLanguages] = useState<RegistryLanguage[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/languages", { cache: "no-store" })
      .then((res) => res.ok ? res.json() : null)
      .then((data) => setLanguages(Array.isArray(data?.languages) ? data.languages : []))
      .catch(() => setLanguages([]));
  }, []);

  useEffect(() => {
    const close = (e: MouseEvent) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false); };
    if (dropdownOpen) document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [dropdownOpen]);

  const count = languages.length;
  const displayCount = count || 12;
  const section = SECTIONS.find((s) => s.id === activeSection) || SECTIONS[0];
  const executionLabel = (lang: RegistryLanguage) => lang.executionType === "live-vm" ? "Live (VM)" : lang.executionType === "live-preview" ? "Live preview" : "Judge0 API";

  return (
    <PageLayout>
      <div style={{ maxWidth: "1040px", margin: "0 auto", padding: "24px 24px 0" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 14px", fontSize: "12px", fontWeight: 500, color: theme.muted, backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "8px", textDecoration: "none" }}><ArrowLeft size={14} /> Home</Link>
      </div>

      <div style={{ maxWidth: "1040px", margin: "0 auto", padding: isMobile ? "24px 16px 60px" : "60px 24px 100px", display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? "24px" : "48px" }}>
        <aside style={{ width: isMobile ? "100%" : "220px", flexShrink: 0 }}>
          {isMobile ? (
            <div ref={dropdownRef} style={{ position: "relative" }}>
              <button onClick={() => setDropdownOpen(!dropdownOpen)} style={{ width: "100%", padding: "14px 16px", fontSize: "14px", fontWeight: 500, backgroundColor: theme.panel, color: theme.text, border: `1px solid ${theme.border}`, borderRadius: "12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", textAlign: "left" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>{(() => { const Icon = section.icon; return <Icon size={16} style={{ color: theme.accent }} />; })()}<span>{section.title}</span></div><ChevronDown size={16} style={{ color: theme.faint, transform: dropdownOpen ? "rotate(180deg)" : "none" }} />
              </button>
              {dropdownOpen && <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 50, backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "12px", padding: "6px" }}>{SECTIONS.map((s) => { const Icon = s.icon; return <button key={s.id} onClick={() => { setActiveSection(s.id); setDropdownOpen(false); }} style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "12px 14px", border: "none", borderRadius: "8px", backgroundColor: s.id === activeSection ? `${theme.accent}12` : "transparent", color: s.id === activeSection ? theme.accent : theme.text, cursor: "pointer", fontSize: "14px", textAlign: "left" }}><Icon size={16} /><span>{s.title}</span></button>; })}</div>}
            </div>
          ) : (
            <><div className="font-mono" style={{ fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: theme.faint, marginBottom: "16px" }}>Documentation</div><nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>{SECTIONS.map((s) => { const Icon = s.icon; return <button key={s.id} onClick={() => setActiveSection(s.id)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", border: "none", borderRadius: "8px", backgroundColor: s.id === activeSection ? `${theme.accent}15` : "transparent", color: s.id === activeSection ? theme.accent : theme.muted, cursor: "pointer", fontSize: "13px", fontWeight: 500, textAlign: "left" }}><Icon size={16} />{s.title}{s.id === activeSection && <ChevronRight size={14} style={{ marginLeft: "auto" }} />}</button>; })}</nav></>
          )}
        </aside>

        <main style={{ flex: 1, minWidth: 0 }}>
          {activeSection === "getting-started" && <>
            <h1 className="font-display" style={{ fontSize: "clamp(28px, 4vw, 38px)", fontWeight: 400, marginBottom: "12px" }}>Getting Started with CodeIQ</h1>
            <p className="font-body" style={{ fontSize: "15px", color: theme.muted, lineHeight: 1.7, marginBottom: "16px", maxWidth: "620px" }}>CodeIQ is a browser-based code editor that lets you write, run, and share code in {displayCount} active languages — no setup required.</p>
            <p className="font-body" style={{ fontSize: "15px", color: theme.muted, lineHeight: 1.7, maxWidth: "620px" }}>Open the editor, pick your language, start coding, and run your program instantly. Save projects when you are ready.</p>
            <pre className="font-mono" style={{ marginTop: "24px", padding: "18px", border: `1px solid ${theme.border}`, borderRadius: "10px", backgroundColor: theme.panel, color: theme.codeText, fontSize: "13px", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{`// Welcome to CodeIQ!\nconsole.log("Hello, World!");`}</pre>
          </>}

          {activeSection === "quick-start" && <>
            <h1 className="font-display" style={{ fontSize: "clamp(28px, 4vw, 38px)", fontWeight: 400, marginBottom: "12px" }}>Quick Start Guide</h1>
            <p className="font-body" style={{ fontSize: "15px", color: theme.muted, lineHeight: 1.7, marginBottom: "24px" }}>Get up and running quickly with any active language in the central registry.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>{["Open the editor and select your programming language", "Write your code and save your project when ready", "Click Run to execute the program and view its output"].map((text, i) => <div key={text} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 18px", border: `1px solid ${theme.border}`, borderRadius: "10px", backgroundColor: theme.panel }}><span className="font-mono" style={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: `${theme.accent}18`, color: theme.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 600 }}>{i + 1}</span><span className="font-body" style={{ fontSize: "14px" }}>{text}</span></div>)}</div>
          </>}

          {activeSection === "languages" && <>
            <h1 className="font-display" style={{ fontSize: "clamp(28px, 4vw, 38px)", fontWeight: 400, marginBottom: "12px" }}>Supported Languages</h1>
            <p className="font-body" style={{ fontSize: "15px", color: theme.muted, lineHeight: 1.7, marginBottom: "16px", maxWidth: "650px" }}>CodeIQ supports {displayCount} active languages. This table is loaded directly from the central language registry, so adding a language in Admin automatically updates this page.</p>
            <div style={{ marginTop: "24px", border: `1px solid ${theme.border}`, borderRadius: "10px", overflow: "hidden", overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse" }}><thead><tr style={{ backgroundColor: theme.panel }}><th className="font-mono" style={{ padding: "12px 18px", fontSize: "11px", textAlign: "left", color: theme.faint }}>Language</th><th className="font-mono" style={{ padding: "12px 18px", fontSize: "11px", textAlign: "left", color: theme.faint }}>Version</th><th className="font-mono" style={{ padding: "12px 18px", fontSize: "11px", textAlign: "left", color: theme.faint }}>Execution</th></tr></thead><tbody>{languages.map((lang, i) => <tr key={lang.id} style={{ borderTop: i ? `1px solid ${theme.border}` : "none" }}><td className="font-body" style={{ padding: "12px 18px", fontSize: "14px", fontWeight: 500 }}>{lang.name}</td><td className="font-mono" style={{ padding: "12px 18px", fontSize: "13px", color: theme.muted }}>{lang.version || "Latest"}</td><td style={{ padding: "12px 18px" }}><span className="font-mono" style={{ fontSize: "11px", color: theme.accent, backgroundColor: `${theme.accent}15`, borderRadius: "20px", padding: "4px 10px" }}>{executionLabel(lang)}</span></td></tr>)}</tbody></table></div>
          </>}

          {activeSection === "ai-completion" && <>
            <h1 className="font-display" style={{ fontSize: "clamp(28px, 4vw, 38px)", fontWeight: 400, marginBottom: "12px" }}>AI Code Completion</h1>
            <p className="font-body" style={{ fontSize: "15px", color: theme.muted, lineHeight: 1.7, maxWidth: "620px" }}>CodeIQ uses KeyKing SDK for AI-powered code completions. Suggestions appear based on your code context and active language while you type.</p>
          </>}

          {activeSection === "themes" && <>
            <h1 className="font-display" style={{ fontSize: "clamp(28px, 4vw, 38px)", fontWeight: 400, marginBottom: "12px" }}>Editor Themes</h1>
            <p className="font-body" style={{ fontSize: "15px", color: theme.muted, lineHeight: 1.7, marginBottom: "24px", maxWidth: "620px" }}>Switch between CodeIQ's handcrafted themes from the editor or Navbar.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>{THEME_ITEMS.map((t) => { const Icon = t.icon; const iconColor = themeKey === "lightmode" && t.color === "#FFFFFF" ? "#111111" : themeKey !== "lightmode" && t.color === "#111111" ? "#FFFFFF" : t.color; return <div key={t.name} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px", border: `1px solid ${theme.border}`, borderRadius: "10px", backgroundColor: theme.panel }}><div style={{ width: "34px", height: "34px", borderRadius: "8px", backgroundColor: `${iconColor}18`, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon size={17} style={{ color: iconColor }} /></div><div><div className="font-body" style={{ fontSize: "13px", fontWeight: 600 }}>{t.name}</div><div className="font-mono" style={{ fontSize: "11px", color: theme.faint }}>{t.desc}</div></div></div>; })}</div>
          </>}
        </main>
      </div>
    </PageLayout>
  );
}
