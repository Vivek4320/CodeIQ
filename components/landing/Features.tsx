"use client";

import { Sparkles, Zap, GitBranch, Share2 } from "lucide-react";
import { useTheme } from "./ThemeContext";

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI code completion",
    desc: "Inline suggestions that adapt to your function, your variable names, and your intent — not generic boilerplate.",
  },
  {
    icon: Zap,
    title: "Instant execution",
    desc: "Run Python, JavaScript, C++, Java, Go, Rust, HTML, and CSS the moment you hit compile. No containers to wait on.",
  },
  {
    icon: GitBranch,
    title: "Auto-saved history",
    desc: "Every run is versioned automatically. Roll back to any point without thinking about it.",
  },
  {
    icon: Share2,
    title: "Shareable programs",
    desc: "Send a link that runs live for anyone who opens it — output included, not just source.",
  },
];

export default function Features() {
  const { theme } = useTheme();

  return (
    <section id="features" style={{ borderTop: `1px solid ${theme.border}`, backgroundColor: theme.panel }}>
      <div style={{ maxWidth: "1040px", margin: "0 auto", padding: "96px 24px" }}>
        <h2
          className="font-display"
          style={{ fontSize: "clamp(28px, 4vw, 38px)", fontWeight: 400, marginBottom: "12px", lineHeight: 1.15 }}
        >
          Everything you need to write,<br />
          <span style={{ fontStyle: "italic" }}>run, and share code.</span>
        </h2>
        <p className="font-body" style={{ fontSize: "15px", color: theme.muted, marginBottom: "48px", maxWidth: "440px", lineHeight: 1.65 }}>
          One editor, multiple languages, and an assistant that&apos;s actually paying attention.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(250px, 100%), 1fr))", gap: "16px" }}>
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              style={{
                borderRadius: "12px",
                border: `1px solid ${theme.border}`,
                backgroundColor: theme.bg,
                padding: "28px",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${theme.accent}40`;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = theme.border;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{
                width: "40px", height: "40px", borderRadius: "10px",
                backgroundColor: `${theme.accent}12`,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: "20px",
              }}>
                <Icon size={18} style={{ color: theme.accent }} />
              </div>
              <h3 className="font-body" style={{ fontSize: "16px", fontWeight: 600, marginBottom: "10px", color: theme.text }}>{title}</h3>
              <p className="font-body" style={{ fontSize: "13.5px", color: theme.muted, lineHeight: 1.65 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
