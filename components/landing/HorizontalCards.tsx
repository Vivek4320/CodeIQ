"use client";

import { useTheme } from "./ThemeContext";

const CARDS = [
  { title: "Multi-language", desc: "Python to Rust, same editor, same shortcuts." },
  { title: "Zero setup", desc: "No installs. Open a tab, start writing." },
  { title: "AI-native", desc: "Completion built into every keystroke." },
  { title: "Instant share", desc: "A link that runs, not just reads." },
  { title: "Auto-saved", desc: "Nothing lost between sessions." },
];

export default function HorizontalCards() {
  const { theme } = useTheme();

  return (
    <section style={{ borderTop: `1px solid ${theme.border}`, padding: "72px 0" }}>
      <div style={{ maxWidth: "1040px", margin: "0 auto", padding: "0 24px" }}>
        <h2 className="font-display" style={{ fontSize: "28px", fontWeight: 400, marginBottom: "28px" }}>
          At a glance
        </h2>
      </div>
      <div className="hcards" style={{ display: "flex", gap: "16px", overflowX: "auto", padding: "0 24px 12px", scrollSnapType: "x mandatory" }}>
        {CARDS.map(({ title, desc }) => (
          <div
            key={title}
            style={{
              scrollSnapAlign: "start",
              flex: "0 0 240px",
              border: `1px solid ${theme.cardBorder}`,
              borderRadius: "12px",
              backgroundColor: theme.cardBg,
              padding: "22px",
              transition: "border-color 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = theme.accent; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = theme.cardBorder; }}
          >
            <h3 className="font-body" style={{ fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>
              {title}
            </h3>
            <p className="font-body" style={{ fontSize: "13.5px", color: theme.muted, lineHeight: 1.6 }}>
              {desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
