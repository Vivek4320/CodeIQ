"use client";

import { useState, useRef, useEffect } from "react";
import { BookOpen, Rocket, Code2, Settings, ChevronRight, ChevronDown, Sparkles, Moon, Bot, Gamepad2, Waves, Shield, Sun, ArrowLeft } from "lucide-react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import { useTheme } from "@/components/landing/ThemeContext";
import { themes } from "@/components/landing/theme";
import { useIsMobile } from "@/hooks/useMediaQuery";

const SECTIONS = [
  {
    id: "getting-started",
    icon: Rocket,
    title: "Getting Started",
    content: {
      heading: "Getting Started with CodeIQ",
      paragraphs: [
        "CodeIQ is a browser-based code editor that lets you write, run, and share code in 12 languages — no setup required.",
        "Simply open the editor, pick your language, and start coding. Your code is auto-saved as you type, and you can run it instantly.",
      ],
      code: `// Welcome to CodeIQ!
// Pick a language and start coding

function greet(name) {
  return \`Hello, \${name}! Welcome to CodeIQ.\`;
}

console.log(greet("World"));`,
    },
  },
  {
    id: "quick-start",
    icon: BookOpen,
    title: "Quick Start",
    content: {
      heading: "Quick Start Guide",
      paragraphs: [
        "Get up and running in 30 seconds. No installs, no configuration, no headaches.",
        "Follow these steps to write and run your first program.",
      ],
      steps: [
        { step: "1", text: "Open CodeIQ and sign up or log in" },
        { step: "2", text: "Click \"New Project\" on the dashboard" },
        { step: "3", text: "Select your programming language from the dropdown" },
        { step: "4", text: "Write your code in the editor — it auto-saves as you type" },
        { step: "5", text: "Click the Run button to see your output instantly" },
      ],
    },
  },
  {
    id: "languages",
    icon: Code2,
    title: "Supported Languages",
    content: {
      heading: "Supported Languages",
      paragraphs: [
        "CodeIQ supports 12 popular programming languages out of the box.",
        "JavaScript and TypeScript execute live in a Node.js VM sandbox. Other languages run via the Piston API (remote execution) or local compilers when available.",
      ],
      languages: [
        { name: "JavaScript", version: "ES2024", status: "Live (VM)" },
        { name: "TypeScript", version: "5.x", status: "Live (VM)" },
        { name: "Python", version: "3.10", status: "Piston API" },
        { name: "C", version: "GCC 10.2", status: "Piston API" },
        { name: "C++", version: "GCC 10.2", status: "Piston API" },
        { name: "Java", version: "15", status: "Piston API" },
        { name: "Go", version: "1.16", status: "Piston API" },
        { name: "Rust", version: "1.68", status: "Piston API" },
        { name: "Ruby", version: "3.0", status: "Piston API" },
        { name: "Haskell", version: "9.4", status: "Piston API" },
        { name: "HTML", version: "5", status: "Live preview" },
        { name: "CSS", version: "3", status: "Live preview" },
      ],
    },
  },
  {
    id: "ai-completion",
    icon: Sparkles,
    title: "AI Completion",
    content: {
      heading: "AI Code Completion",
      paragraphs: [
        "CodeIQ uses KeyKing SDK for zero-trust AI-powered code completions. As you type, suggestions appear based on your code context — no raw API keys needed.",
        "KeyKing automatically routes through Groq (llama-3.3-70b-versatile) with fallback to OpenAI (gpt-4o-mini). AI completions are marked with an \"(AI)\" badge. Static keyword completions are always available as fallback.",
      ],
      code: `// AI completions are powered by KeyKing
// No API key setup needed — KeyKing handles routing

// Export vault from KeyKing Desktop App
// (Settings > Export Vault) and set in .env.local:
//   KK_VAULT=KK_VAULT_eyJhbGciOiJIUzI1NiIs...
//   KK_VAULT_PASS=your-vault-password

// AI completions appear as you type
// They adapt to your code context
// and show relevant suggestions`,
    },
  },
  {
    id: "themes",
    icon: Settings,
    title: "Themes",
    content: {
      heading: "Editor Themes",
      paragraphs: [
        "CodeIQ comes with 7 carefully crafted themes. Switch between them instantly using the theme selector in the editor header or the Navbar.",
        "Your selected theme persists across sessions and applies to the entire interface — editor, dashboard, and landing page.",
      ],
      themes: [
        { name: "Midnight", icon: Moon, desc: "Clean dark with white accents", color: themes.midnight.accent },
        { name: "Cyberpunk", icon: Bot, desc: "Neon pink on deep purple", color: themes.cyberpunk.accent },
        { name: "Retro Gaming", icon: Gamepad2, desc: "Yellow on navy blue", color: themes.retro.accent },
        { name: "Neon Nights", icon: Sparkles, desc: "Purple on dark blue", color: themes.neonNights.accent },
        { name: "Deep Ocean", icon: Waves, desc: "Cyan on dark teal", color: themes.ocean.accent },
        { name: "Hacker", icon: Shield, desc: "Green on black", color: themes.hacker.accent },
        { name: "Light Mode", icon: Sun, desc: "Clean white with black text", color: themes.lightmode.accent },
      ],
    },
  },
];

export default function DocsPage() {
  const { theme, themeKey } = useTheme();
  const isMobile = useIsMobile();
  const [activeSection, setActiveSection] = useState("getting-started");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isLightTheme = themeKey === "lightmode";

  const section = SECTIONS.find((s) => s.id === activeSection)!;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  return (
    <PageLayout>
      {/* Back to Home */}
      <div style={{ maxWidth: "1040px", margin: "0 auto", padding: "24px 24px 0" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 14px", fontSize: "12px", fontWeight: 500, color: theme.muted, backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "8px", textDecoration: "none", transition: "all 0.2s ease" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = theme.accent; e.currentTarget.style.color = theme.text; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.muted; }}>
          <ArrowLeft size={14} /> Home
        </Link>
      </div>

      <div style={{ maxWidth: "1040px", margin: "0 auto", padding: isMobile ? "24px 16px 60px" : "60px 24px 100px", display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? "24px" : "48px" }}>
        {/* Sidebar */}
        <aside style={{ width: isMobile ? "100%" : "220px", flexShrink: 0 }}>
          {isMobile ? (
            /* Mobile: custom styled dropdown */
            <div ref={dropdownRef} style={{ position: "relative" }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  width: "100%", padding: "14px 16px", fontSize: "14px", fontWeight: 500,
                  backgroundColor: theme.panel, color: theme.text,
                  border: `1px solid ${theme.border}`, borderRadius: "12px",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between",
                  textAlign: "left", transition: "border-color 0.2s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = theme.accent; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = theme.border; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {(() => { const Icon = section.icon; return <Icon size={16} style={{ color: theme.accent }} />; })()}
                  <span>{section.title}</span>
                </div>
                <ChevronDown size={16} style={{
                  color: theme.faint, transition: "transform 0.2s ease",
                  transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                }} />
              </button>

              {dropdownOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 50,
                  backgroundColor: theme.panel, border: `1px solid ${theme.border}`,
                  borderRadius: "12px", padding: "6px",
                  boxShadow: "0 16px 48px -8px rgba(0,0,0,0.4)",
                  animation: "dropdownFadeIn 0.2s ease",
                  maxHeight: "50vh", overflowY: "auto",
                }}>
                  {SECTIONS.map((s) => {
                    const Icon = s.icon;
                    const isActive = s.id === activeSection;
                    return (
                      <button
                        key={s.id}
                        onClick={() => { setActiveSection(s.id); setDropdownOpen(false); }}
                        style={{
                          display: "flex", alignItems: "center", gap: "10px",
                          width: "100%", padding: "12px 14px", border: "none", borderRadius: "8px",
                          backgroundColor: isActive ? `${theme.accent}12` : "transparent",
                          color: isActive ? theme.accent : theme.text,
                          cursor: "pointer", fontSize: "14px", fontWeight: 500, textAlign: "left",
                          transition: "background 0.15s ease",
                        }}
                        onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = `${theme.text}08`; }}
                        onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = "transparent"; }}
                      >
                        <Icon size={16} style={{ color: isActive ? theme.accent : theme.faint, flexShrink: 0 }} />
                        <span>{s.title}</span>
                        {isActive && <span style={{ marginLeft: "auto", width: "6px", height: "6px", borderRadius: "50%", backgroundColor: theme.accent, flexShrink: 0 }} />}
                      </button>
                    );
                  })}
                </div>
              )}
              <style>{`@keyframes dropdownFadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }`}</style>
            </div>
          ) : (
            /* Desktop: sidebar nav */
            <>
              <div
                className="font-mono"
                style={{
                  fontSize: "10px", fontWeight: 600, textTransform: "uppercase",
                  letterSpacing: "0.1em", color: theme.faint, marginBottom: "16px",
                }}
              >
                Documentation
              </div>
              <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {SECTIONS.map((s) => {
                  const Icon = s.icon;
                  const isActive = s.id === activeSection;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setActiveSection(s.id)}
                      style={{
                        display: "flex", alignItems: "center", gap: "10px",
                        padding: "10px 12px", border: "none", borderRadius: "8px",
                        backgroundColor: isActive ? `${theme.accent}15` : "transparent",
                        color: isActive ? theme.accent : theme.muted,
                        cursor: "pointer", fontSize: "13px", fontWeight: 500,
                        textAlign: "left", transition: "all 0.15s ease",
                      }}
                      onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = `${theme.text}08`; }}
                      onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = "transparent"; }}
                    >
                      <Icon size={16} />
                      {s.title}
                      {isActive && <ChevronRight size={14} style={{ marginLeft: "auto" }} />}
                    </button>
                  );
                })}
              </nav>
            </>
          )}
        </aside>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1
            className="font-display"
            style={{ fontSize: "clamp(28px, 4vw, 38px)", fontWeight: 400, marginBottom: "12px" }}
          >
            {section.content.heading}
          </h1>

          {section.content.paragraphs.map((p, i) => (
            <p
              key={i}
              className="font-body"
              style={{ fontSize: "15px", color: theme.muted, lineHeight: 1.7, marginBottom: "16px", maxWidth: "600px" }}
            >
              {p}
            </p>
          ))}

          {/* Steps (Quick Start) */}
          {section.content.steps && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "24px" }}>
              {section.content.steps.map((s) => (
                <div
                  key={s.step}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "14px 18px",
                    border: `1px solid ${theme.border}`,
                    borderRadius: "10px",
                    backgroundColor: theme.panel,
                  }}
                >
                  <span
                    className="font-mono"
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      backgroundColor: `${theme.accent}18`,
                      color: theme.accent,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    {s.step}
                  </span>
                  <span className="font-body" style={{ fontSize: "14px", color: theme.text }}>
                    {s.text}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Languages Table */}
          {section.content.languages && (
            <div
              style={{
                marginTop: "24px",
                border: `1px solid ${theme.border}`,
                borderRadius: "10px",
                overflow: "hidden",
                overflowX: "auto",
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: theme.panel }}>
                    <th className="font-mono" style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: theme.faint, padding: "12px 18px", textAlign: "left" }}>Language</th>
                    <th className="font-mono" style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: theme.faint, padding: "12px 18px", textAlign: "left" }}>Version</th>
                    <th className="font-mono" style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: theme.faint, padding: "12px 18px", textAlign: "left" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {section.content.languages.map((lang, i) => (
                    <tr key={lang.name} style={{ borderTop: i > 0 ? `1px solid ${theme.border}` : "none" }}>
                      <td className="font-body" style={{ padding: "12px 18px", fontSize: "14px", fontWeight: 500 }}>{lang.name}</td>
                      <td className="font-mono" style={{ padding: "12px 18px", fontSize: "13px", color: theme.muted }}>{lang.version}</td>
                      <td style={{ padding: "12px 18px" }}>
                        <span
                          className="font-mono"
                          style={{
                            fontSize: "11px",
                            fontWeight: 500,
                            padding: "4px 10px",
                            borderRadius: "20px",
                            backgroundColor: `${theme.accent}15`,
                            color: theme.accent,
                          }}
                        >
                          {lang.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Themes Grid */}
          {section.content.themes && (
            <div style={{ marginTop: "24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
              {section.content.themes.map((t) => {
                const Icon = t.icon;
                // In light mode, swap white icons to dark (and vice versa) so they're always visible
                const iconColor = isLightTheme && t.color === "#FFFFFF"
                  ? "#111111"
                  : !isLightTheme && t.color === "#111111"
                    ? "#FFFFFF"
                    : t.color;
                return (
                  <div
                    key={t.name}
                    style={{
                      display: "flex", alignItems: "center", gap: "12px",
                      padding: "14px 16px", border: `1px solid ${theme.border}`, borderRadius: "10px",
                      backgroundColor: theme.panel, transition: "border-color 0.2s ease",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = theme.accent; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = theme.border; }}
                  >
                    <div style={{
                      width: "34px", height: "34px", borderRadius: "8px",
                      backgroundColor: `${iconColor}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      border: `1px solid ${theme.border}`,
                    }}>
                      <Icon size={17} style={{ color: iconColor }} />
                    </div>
                    <div>
                      <div className="font-body" style={{ fontSize: "13px", fontWeight: 600, color: theme.text }}>{t.name}</div>
                      <div className="font-mono" style={{ fontSize: "11px", color: theme.faint }}>{t.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Code Block */}
          {section.content.code && (
            <div
              style={{
                marginTop: "24px",
                border: `1px solid ${theme.border}`,
                borderRadius: "10px",
                backgroundColor: theme.panel,
                overflow: "hidden",
              }}
            >
              <div
                className="font-mono"
                style={{
                  fontSize: "11px",
                  padding: "10px 18px",
                  borderBottom: `1px solid ${theme.border}`,
                  color: theme.faint,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: theme.accent, opacity: 0.4 }} />
                code
              </div>
              <pre
                className="font-mono"
                style={{
                  fontSize: "13px",
                  lineHeight: 1.7,
                  color: theme.codeText,
                  padding: "18px",
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  overflowX: "auto",
                }}
              >
                {section.content.code}
              </pre>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
