"use client";

import { Sparkles, Zap, GitBranch, Share2, Terminal, Shield, Globe, Cpu, ArrowLeft } from "lucide-react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import { useTheme } from "@/components/landing/ThemeContext";

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI Code Completion",
    desc: "Real-time AI-powered suggestions powered by Google Gemini. Completions adapt to your function names, variable names, and coding intent.",
    details: ["Powered by Google Gemini AI", "Context-aware suggestions", "Works across all 10 languages", "Instant inline completions"],
  },
  {
    icon: Zap,
    title: "Instant Execution",
    desc: "Run code in 10 languages the moment you hit Run. JavaScript and TypeScript execute live — others run through our smart simulator.",
    details: ["Sub-second output", "10 languages supported", "No setup required", "Real-time results"],
  },
  {
    icon: GitBranch,
    title: "Auto-saved History",
    desc: "Your code is saved automatically as you type. Every run is versioned, so you can always roll back to any previous version.",
    details: ["Auto-save as you type", "Automatic versioning", "One-click rollback", "Unlimited history"],
  },
  {
    icon: Share2,
    title: "Shareable Programs",
    desc: "Send a link that runs live for anyone who opens it — output included, not just source code.",
    details: ["Live output sharing", "No account needed", "Permanent links", "Embed anywhere"],
  },
  {
    icon: Terminal,
    title: "10 Languages",
    desc: "Write in JavaScript, TypeScript, Python, C, C++, Java, Go, Rust, Ruby, or Haskell — all from one editor.",
    details: ["JavaScript & TypeScript", "Python, C & C++", "Java, Go & Rust", "Ruby & Haskell"],
  },
  {
    icon: Shield,
    title: "Secure Sandboxing",
    desc: "JavaScript and TypeScript run in an isolated VM sandbox. Your code never touches the host system.",
    details: ["Isolated execution", "5-second timeout", "No data persistence", "Safe evaluation"],
  },
  {
    icon: Globe,
    title: "7 Game Themes",
    desc: "Switch between Midnight, Cyberpunk, Retro Gaming, Neon Nights, Deep Ocean, Hacker, and Light Mode — all with one click.",
    details: ["7 unique themes", "Instant switching", "Theme selector in editor", "Persists across sessions"],
  },
  {
    icon: Cpu,
    title: "Lightweight & Fast",
    desc: "Built with Next.js and CodeMirror. The editor loads fast and stays responsive no matter the project size.",
    details: ["Fast load time", "60fps scrolling", "Minimal memory usage", "Optimized rendering"],
  },
];

export default function FeaturesPage() {
  const { theme } = useTheme();

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

      {/* Hero */}
      <section style={{ maxWidth: "720px", margin: "0 auto", padding: "80px 24px 60px", textAlign: "center" }}>
        <div
          className="font-mono"
          style={{
            fontSize: "12px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: theme.accent,
            marginBottom: "20px",
          }}
        >
          Features
        </div>
        <h1
          className="font-display"
          style={{ fontSize: "clamp(36px, 6vw, 56px)", lineHeight: 1.1, fontWeight: 400, marginBottom: "20px" }}
        >
          Everything you need to<br />
          <span style={{ fontStyle: "italic" }}>write, run, and share.</span>
        </h1>
        <p
          className="font-body"
          style={{ fontSize: "17px", color: theme.muted, maxWidth: "500px", margin: "0 auto", lineHeight: 1.6 }}
        >
          One editor, multiple languages, and an assistant that&apos;s actually paying attention to what you&apos;re building.
        </p>
      </section>

      {/* Feature Grid */}
      <section style={{ maxWidth: "1040px", margin: "0 auto", padding: "40px 24px 100px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
          {FEATURES.map(({ icon: Icon, title, desc, details }) => (
            <div
              key={title}
              style={{
                border: `1px solid ${theme.border}`,
                borderRadius: "12px",
                backgroundColor: theme.panel,
                padding: "28px",
                transition: "border-color 0.2s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = theme.accent; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = theme.border; }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  backgroundColor: `${theme.accent}12`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "18px",
                }}
              >
                <Icon size={20} style={{ color: theme.accent }} />
              </div>
              <h3
                className="font-body"
                style={{ fontSize: "18px", fontWeight: 600, marginBottom: "10px" }}
              >
                {title}
              </h3>
              <p
                className="font-body"
                style={{ fontSize: "14px", color: theme.muted, lineHeight: 1.65, marginBottom: "18px" }}
              >
                {desc}
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                {details.map((item) => (
                  <li
                    key={item}
                    className="font-mono"
                    style={{ fontSize: "12px", color: theme.faint, display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    <span style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: theme.accent, flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
