"use client";

const LOGOS: Record<string, { color: string; bg: string; label: string; letter: string }> = {
  javascript: { color: "#F7DF1E", bg: "#F7DF1E20", label: "JavaScript", letter: "JS" },
  typescript: { color: "#3178C6", bg: "#3178C620", label: "TypeScript", letter: "TS" },
  python:     { color: "#3776AB", bg: "#3776AB20", label: "Python", letter: "Py" },
  c:          { color: "#A8B9CC", bg: "#55555520", label: "C", letter: "C" },
  cpp:        { color: "#00599C", bg: "#00599C20", label: "C++", letter: "++" },
  java:       { color: "#ED8B00", bg: "#ED8B0020", label: "Java", letter: "Jv" },
  go:         { color: "#00ADD8", bg: "#00ADD820", label: "Go", letter: "Go" },
  rust:       { color: "#DEA584", bg: "#DEA58420", label: "Rust", letter: "Rs" },
  ruby:       { color: "#CC342D", bg: "#CC342D20", label: "Ruby", letter: "Rb" },
  haskell:    { color: "#5e5086", bg: "#5e508620", label: "Haskell", letter: "λ" },
  kotlin:     { color: "#7F52FF", bg: "#7F52FF20", label: "Kotlin", letter: "Kt" },
  swift:      { color: "#F05138", bg: "#F0513820", label: "Swift", letter: "Sw" },
  html:       { color: "#E34F26", bg: "#E34F2620", label: "HTML", letter: "<>" },
  css:        { color: "#1572B6", bg: "#1572B620", label: "CSS", letter: "CSS" },
};

interface LanguageLogoProps {
  language: string;
  size?: number;
  showLabel?: boolean;
}

export default function LanguageLogo({ language, size = 32, showLabel = false }: LanguageLogoProps) {
  const config = LOGOS[language] || { color: "#999", bg: "#99999920", label: language, letter: language.slice(0, 2).toUpperCase() };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div style={{
        width: size, height: size, borderRadius: "8px",
        backgroundColor: config.bg, display: "flex", alignItems: "center", justifyContent: "center",
        border: `1px solid ${config.color}30`,
      }}>
        <span style={{
          fontSize: size * 0.38, fontWeight: 800, color: config.color,
          fontFamily: "var(--font-mono), monospace", letterSpacing: "-0.02em",
        }}>{config.letter}</span>
      </div>
      {showLabel && (
        <span style={{ fontSize: "13px", fontWeight: 500 }}>{config.label}</span>
      )}
    </div>
  );
}

export { LOGOS };
