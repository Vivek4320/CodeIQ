"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useTheme } from "@/components/landing/ThemeContext";
import LanguageLogo from "@/components/LanguageLogo";

const FALLBACK_LANGUAGES = [
  { slug: "javascript", name: "JavaScript", extension: ".js" },
  { slug: "typescript", name: "TypeScript", extension: ".ts" },
  { slug: "python", name: "Python", extension: ".py" },
  { slug: "cpp", name: "C++", extension: ".cpp" },
  { slug: "java", name: "Java", extension: ".java" },
  { slug: "go", name: "Go", extension: ".go" },
  { slug: "rust", name: "Rust", extension: ".rs" },
  { slug: "ruby", name: "Ruby", extension: ".rb" },
  { slug: "haskell", name: "Haskell", extension: ".hs" },
  { slug: "c", name: "C", extension: ".c" },
  { slug: "html", name: "HTML", extension: ".html" },
  { slug: "css", name: "CSS", extension: ".css" },
];

interface LanguageSelectorProps {
  language: string;
  onSelect: (lang: string) => void;
}

export default function LanguageSelector({ language, onSelect }: LanguageSelectorProps) {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [languages, setLanguages] = useState(FALLBACK_LANGUAGES);

  useEffect(() => {
    fetch("/api/languages").then(r => r.json()).then(d => {
      if (d.languages && d.languages.length > 0) {
        setLanguages(d.languages);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const current = languages.find((l) => l.slug === language) || languages[0];

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex", alignItems: "center", gap: "8px",
          padding: "5px 12px", fontSize: "13px", fontWeight: 500,
          backgroundColor: "transparent", color: theme.text,
          border: `1px solid ${theme.border}`, borderRadius: "8px",
          cursor: "pointer", transition: "border-color 0.2s ease",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = theme.accent; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = theme.border; }}
      >
        <LanguageLogo language={language} size={20} />
        <span className="font-mono">{current.name}</span>
        <ChevronDown size={14} style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s ease", color: theme.faint }} />
      </button>

      {open && (
        <div
          style={{
            position: "absolute", top: "calc(100% + 6px)", left: 0,
            backgroundColor: theme.panel, border: `1px solid ${theme.border}`,
            borderRadius: "10px", padding: "6px", minWidth: "200px", maxHeight: "320px", overflow: "auto", zIndex: 50,
            boxShadow: "0 12px 40px -8px rgba(0,0,0,0.4)",
          }}
        >
          {languages.map((lang) => (
            <button
              key={lang.slug}
              onClick={() => { onSelect(lang.slug); setOpen(false); }}
              style={{
                display: "flex", alignItems: "center", gap: "10px",
                width: "100%", padding: "7px 10px", border: "none", borderRadius: "6px",
                backgroundColor: language === lang.slug ? `${theme.accent}15` : "transparent",
                color: language === lang.slug ? theme.accent : theme.text,
                cursor: "pointer", fontSize: "13px", textAlign: "left",
                transition: "background 0.15s ease",
              }}
              onMouseEnter={(e) => { if (language !== lang.slug) e.currentTarget.style.backgroundColor = `${theme.text}08`; }}
              onMouseLeave={(e) => { if (language !== lang.slug) e.currentTarget.style.backgroundColor = "transparent"; }}
            >
              <LanguageLogo language={lang.slug} size={22} />
              <span className="font-body" style={{ flex: 1 }}>{lang.name}</span>
              <span className="font-mono" style={{ fontSize: "10px", color: theme.faint, backgroundColor: `${theme.text}08`, padding: "2px 6px", borderRadius: "4px" }}>{lang.extension}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
