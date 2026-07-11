"use client";

import { Sparkles, Zap, GitBranch, Share2, Terminal, Shield, Globe, Cpu } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useTheme } from "@/components/landing/ThemeContext";

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI Code Completion",
    desc: "Inline suggestions that adapt to your function, your variable names, and your intent — not generic boilerplate pulled from nowhere.",
    details: ["Context-aware suggestions", "Multi-line completions", "Learns your coding style", "Supports 6+ languages"],
  },
  {
    icon: Zap,
    title: "Instant Execution",
    desc: "Run Python, JavaScript, C++, Java, Go, and Rust the moment you hit compile. No containers to wait on, no queue to clear.",
    details: ["Sub-second output", "No setup required", "6 languages supported", "Real-time results"],
  },
  {
    icon: GitBranch,
    title: "Auto-saved History",
    desc: "Every run is versioned automatically. Roll back to any point without thinking about manual commits or saves.",
    details: ["Automatic versioning", "One-click rollback", "Diff comparison", "Unlimited history"],
  },
  {
    icon: Share2,
    title: "Shareable Programs",
    desc: "Send a link that runs live for anyone who opens it — output included, not just source code.",
    details: ["Live output sharing", "No account needed", "Permanent links", "Embed anywhere"],
  },
  {
    icon: Terminal,
    title: "Built-in Terminal",
    desc: "Full terminal access right in the browser. Install packages, run scripts, and debug without leaving the editor.",
    details: ["Full shell access", "Package installation", "Environment variables", "Process management"],
  },
  {
    icon: Shield,
    title: "Secure Sandboxing",
    desc: "Every code execution runs in an isolated sandbox. Your code never touches the host system.",
    details: ["Isolated execution", "Resource limits", "No data persistence", "Enterprise-grade security"],
  },
  {
    icon: Globe,
    title: "Cloud Sync",
    desc: "Your projects sync across devices. Start on your laptop, continue on your tablet — everything stays in sync.",
    details: ["Cross-device sync", "Offline support", "Conflict resolution", "Real-time updates"],
  },
  {
    icon: Cpu,
    title: "Lightweight & Fast",
    desc: "Built with performance in mind. The editor loads in under a second and stays responsive no matter the project size.",
    details: ["<1s load time", "60fps scrolling", "Minimal memory usage", "Optimized rendering"],
  },
];

export default function FeaturesPage() {
  const { theme } = useTheme();

  return (
    <PageLayout>
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
          One editor, every language, and an assistant that&apos;s actually paying attention to what you&apos;re building.
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
