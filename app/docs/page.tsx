"use client";

import { useState } from "react";
import { BookOpen, Rocket, Code2, Settings, ChevronRight } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useTheme } from "@/components/landing/ThemeContext";

const SECTIONS = [
  {
    id: "getting-started",
    icon: Rocket,
    title: "Getting Started",
    content: {
      heading: "Getting Started with CodeIQ",
      paragraphs: [
        "CodeIQ is a browser-based code editor that lets you write, run, and share code in 6+ languages — no setup required.",
        "Simply open the editor, pick your language, and start coding. Your code runs instantly in a secure sandbox.",
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
        { step: "1", text: "Open CodeIQ in your browser" },
        { step: "2", text: "Select your programming language from the dropdown" },
        { step: "3", text: "Write your code in the editor" },
        { step: "4", text: "Hit the Run button or press Ctrl+Enter" },
        { step: "5", text: "See your output instantly in the terminal below" },
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
        "CodeIQ supports 6 popular programming languages out of the box, with more coming soon.",
      ],
      languages: [
        { name: "Python", version: "3.11", status: "Full support" },
        { name: "JavaScript", version: "ES2024", status: "Full support" },
        { name: "TypeScript", version: "5.3", status: "Full support" },
        { name: "C++", version: "C++20", status: "Full support" },
        { name: "Java", version: "17", status: "Full support" },
        { name: "Go", version: "1.21", status: "Full support" },
        { name: "Rust", version: "1.74", status: "Full support" },
        { name: "Ruby", version: "3.2", status: "Full support" },
      ],
    },
  },
  {
    id: "configuration",
    icon: Settings,
    title: "Configuration",
    content: {
      heading: "Editor Configuration",
      paragraphs: [
        "Customize your coding experience with CodeIQ's built-in settings. Adjust themes, font sizes, keybindings, and more.",
        "All settings sync across your devices when you create a free account.",
      ],
      code: `// .codeiqrc — CodeIQ configuration
{
  "theme": "midnight",
  "fontSize": 14,
  "tabSize": 2,
  "wordWrap": true,
  "minimap": false,
  "autoSave": true
}`,
    },
  },
];

export default function DocsPage() {
  const { theme } = useTheme();
  const [activeSection, setActiveSection] = useState("getting-started");

  const section = SECTIONS.find((s) => s.id === activeSection)!;

  return (
    <PageLayout>
      <div style={{ maxWidth: "1040px", margin: "0 auto", padding: "60px 24px 100px", display: "flex", gap: "48px" }}>
        {/* Sidebar */}
        <aside style={{ width: "220px", flexShrink: 0 }}>
          <div
            className="font-mono"
            style={{
              fontSize: "10px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: theme.faint,
              marginBottom: "16px",
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
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 12px",
                    border: "none",
                    borderRadius: "8px",
                    backgroundColor: isActive ? `${theme.accent}15` : "transparent",
                    color: isActive ? theme.accent : theme.muted,
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: 500,
                    textAlign: "left",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = `${theme.text}08`;
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <Icon size={16} />
                  {s.title}
                  {isActive && <ChevronRight size={14} style={{ marginLeft: "auto" }} />}
                </button>
              );
            })}
          </nav>
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
