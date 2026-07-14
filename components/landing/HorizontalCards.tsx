"use client";

import { Code2, Zap, Sparkles, Share2, Clock, ArrowRight } from "lucide-react";
import { useTheme } from "./ThemeContext";

const CARDS = [
  {
    icon: Code2,
    number: "10",
    title: "Languages",
    desc: "JavaScript, TypeScript, Python, C, C++, Java, Go, Rust, Ruby, Haskell — one editor for all.",
    accent: "#61AFEF",
  },
  {
    icon: Zap,
    number: "0s",
    title: "Setup time",
    desc: "No installs. No config files. Open a tab and start writing immediately.",
    accent: "#FFCC00",
  },
  {
    icon: Sparkles,
    number: "AI",
    title: "Smart completions",
    desc: "Gemini-powered suggestions that understand your code context in real time.",
    accent: "#C678DD",
  },
  {
    icon: Share2,
    number: "1-click",
    title: "Share & run",
    desc: "Generate a live link anyone can open. Output included, not just source code.",
    accent: "#27C93F",
  },
  {
    icon: Clock,
    number: "Auto",
    title: "Always saved",
    desc: "Code saves automatically as you type. Never lose progress between sessions.",
    accent: "#E06C75",
  },
];

export default function HorizontalCards() {
  const { theme } = useTheme();

  return (
    <section style={{ borderTop: `1px solid ${theme.border}`, padding: "80px 0" }}>
      <div style={{ maxWidth: "1040px", margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <div
            className="font-mono"
            style={{
              fontSize: "11px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: theme.faint,
              marginBottom: "12px",
            }}
          >
            Why CodeIQ
          </div>
          <h2 className="font-display" style={{ fontSize: "clamp(26px, 4vw, 34px)", fontWeight: 400 }}>
            Built for speed,<br />
            <span style={{ fontStyle: "italic" }}>designed for focus.</span>
          </h2>
        </div>

        {/* Cards grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "12px",
          }}
        >
          {CARDS.map(({ icon: Icon, number, title, desc, accent }) => (
            <div
              key={title}
              style={{
                border: `1px solid ${theme.border}`,
                borderRadius: "12px",
                padding: "24px",
                backgroundColor: theme.panel,
                transition: "all 0.25s ease",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = accent;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = theme.border;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* Icon + Number */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    backgroundColor: `${accent}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={17} style={{ color: accent }} />
                </div>
                <span
                  className="font-display"
                  style={{
                    fontSize: "22px",
                    fontWeight: 400,
                    color: accent,
                    lineHeight: 1,
                  }}
                >
                  {number}
                </span>
              </div>

              {/* Title */}
              <h3
                className="font-body"
                style={{
                  fontSize: "15px",
                  fontWeight: 600,
                  marginBottom: "8px",
                  color: theme.text,
                }}
              >
                {title}
              </h3>

              {/* Description */}
              <p
                className="font-body"
                style={{
                  fontSize: "12.5px",
                  color: theme.muted,
                  lineHeight: 1.6,
                }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom link */}
        <div style={{ marginTop: "32px", textAlign: "center" }}>
          <a
            href="/features"
            className="font-body"
            style={{
              fontSize: "13px",
              fontWeight: 500,
              color: theme.muted,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = theme.accent; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = theme.muted; }}
          >
            Explore all features <ArrowRight size={13} />
          </a>
        </div>
      </div>
    </section>
  );
}
