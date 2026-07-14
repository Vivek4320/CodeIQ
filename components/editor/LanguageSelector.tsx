"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useTheme } from "@/components/landing/ThemeContext";

const LANGUAGES = [
  { id: "javascript", label: "JavaScript", ext: ".js" },
  { id: "typescript", label: "TypeScript", ext: ".ts" },
  { id: "python", label: "Python", ext: ".py" },
  { id: "cpp", label: "C++", ext: ".cpp" },
  { id: "java", label: "Java", ext: ".java" },
  { id: "go", label: "Go", ext: ".go" },
  { id: "rust", label: "Rust", ext: ".rs" },
  { id: "ruby", label: "Ruby", ext: ".rb" },
  { id: "haskell", label: "Haskell", ext: ".hs" },
  { id: "c", label: "C", ext: ".c" },
];

interface LanguageSelectorProps {
  language: string;
  onSelect: (lang: string) => void;
}

export default function LanguageSelector({ language, onSelect }: LanguageSelectorProps) {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const current = LANGUAGES.find((l) => l.id === language)!;

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex", alignItems: "center", gap: "6px",
          padding: "6px 12px", fontSize: "13px", fontWeight: 500,
          backgroundColor: "transparent", color: theme.text,
          border: `1px solid ${theme.border}`, borderRadius: "6px",
          cursor: "pointer", transition: "border-color 0.2s ease",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = theme.accent; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = theme.border; }}
      >
        <span className="font-mono">{current.label}</span>
        <ChevronDown size={14} style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s ease" }} />
      </button>

      {open && (
        <div
          style={{
            position: "absolute", top: "calc(100% + 6px)", left: 0,
            backgroundColor: theme.panel, border: `1px solid ${theme.border}`,
            borderRadius: "8px", padding: "4px", minWidth: "160px", zIndex: 50,
            boxShadow: "0 10px 40px -10px rgba(0,0,0,0.4)",
          }}
        >
          {LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              onClick={() => { onSelect(lang.id); setOpen(false); }}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                width: "100%", padding: "8px 12px", border: "none", borderRadius: "6px",
                backgroundColor: language === lang.id ? `${theme.accent}15` : "transparent",
                color: language === lang.id ? theme.accent : theme.text,
                cursor: "pointer", fontSize: "13px", textAlign: "left",
                transition: "background 0.15s ease",
              }}
              onMouseEnter={(e) => { if (language !== lang.id) e.currentTarget.style.backgroundColor = `${theme.text}08`; }}
              onMouseLeave={(e) => { if (language !== lang.id) e.currentTarget.style.backgroundColor = "transparent"; }}
            >
              <span className="font-body">{lang.label}</span>
              <span className="font-mono" style={{ fontSize: "11px", color: theme.faint }}>{lang.ext}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
