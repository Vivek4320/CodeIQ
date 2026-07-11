"use client";

import { useTheme } from "./ThemeContext";

const LANGS = ["Python", "JavaScript", "C++", "Java", "Go", "Rust", "TypeScript", "Ruby"];

export default function MarqueeTicker() {
  const { theme } = useTheme();

  return (
    <section
      style={{
        borderTop: `1px solid ${theme.border}`,
        borderBottom: `1px solid ${theme.border}`,
        overflow: "hidden",
        padding: "16px 0",
      }}
    >
      <div className="marquee-track font-mono" style={{ fontSize: "14px", color: theme.faint }}>
        {[...LANGS, ...LANGS].map((lang, i) => (
          <span key={i} style={{ padding: "0 28px", whiteSpace: "nowrap" }}>
            {lang}
          </span>
        ))}
      </div>
    </section>
  );
}
