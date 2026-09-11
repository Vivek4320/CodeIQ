"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useTheme } from "@/components/landing/ThemeContext";
import LanguageLogo from "@/components/LanguageLogo";

const FALLBACK_LANGUAGES = [
  { slug: "javascript", name: "JavaScript", extension: ".js", sampleCode: `console.log("Hello, World!");` },
  { slug: "typescript", name: "TypeScript", extension: ".ts", sampleCode: `console.log("Hello, World!");` },
  { slug: "python", name: "Python", extension: ".py", sampleCode: `print("Hello, World!")` },
  { slug: "cpp", name: "C++", extension: ".cpp", sampleCode: `#include <iostream>\nint main(){ std::cout << "Hello, World!"; }` },
  { slug: "java", name: "Java", extension: ".java", sampleCode: `public class Main { public static void main(String[] args){ System.out.println("Hello, World!"); } }` },
  { slug: "go", name: "Go", extension: ".go", sampleCode: `package main\nimport "fmt"\nfunc main(){ fmt.Println("Hello, World!") }` },
  { slug: "rust", name: "Rust", extension: ".rs", sampleCode: `fn main(){ println!("Hello, World!"); }` },
  { slug: "ruby", name: "Ruby", extension: ".rb", sampleCode: `puts "Hello, World!"` },
  { slug: "haskell", name: "Haskell", extension: ".hs", sampleCode: `main = putStrLn "Hello, World!"` },
  { slug: "c", name: "C", extension: ".c", sampleCode: `#include <stdio.h>\nint main(){ printf("Hello, World!\\n"); return 0; }` },
  { slug: "html", name: "HTML", extension: ".html", sampleCode: `<h1>Hello, World!</h1>` },
  { slug: "css", name: "CSS", extension: ".css", sampleCode: `body { font-family: sans-serif; }` },
];

interface LanguageSelectorProps { language: string; onSelect: (lang: string) => void; }

export default function LanguageSelector({ language, onSelect }: LanguageSelectorProps) {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [languages, setLanguages] = useState(FALLBACK_LANGUAGES);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/languages", { cache: "no-store" }).then(r => r.json()).then(d => {
      if (Array.isArray(d.languages) && d.languages.length) setLanguages(d.languages);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const current = languages.find((l) => l.slug === language) || languages[0];
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen(!open)} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "5px 12px", fontSize: "13px", fontWeight: 500, backgroundColor: "transparent", color: theme.text, border: `1px solid ${theme.border}`, borderRadius: "8px", cursor: "pointer" }}>
        <LanguageLogo language={language} size={20} />
        <span className="font-mono">{current?.name || language}</span>
        <ChevronDown size={14} style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s", color: theme.faint }} />
      </button>
      {open && <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "10px", padding: "6px", minWidth: "210px", maxHeight: "320px", overflow: "auto", zIndex: 50, boxShadow: "0 12px 40px -8px rgba(0,0,0,0.4)" }}>
        {languages.map((lang) => <button key={lang.slug} onClick={() => { onSelect(lang.slug); setOpen(false); }} style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "7px 10px", border: "none", borderRadius: "6px", backgroundColor: language === lang.slug ? `${theme.accent}15` : "transparent", color: language === lang.slug ? theme.accent : theme.text, cursor: "pointer", fontSize: "13px", textAlign: "left" }}>
          <LanguageLogo language={lang.slug} size={22} />
          <span className="font-body" style={{ flex: 1 }}>{lang.name}</span>
          <span className="font-mono" style={{ fontSize: "10px", color: theme.faint }}>{lang.extension}</span>
        </button>)}
      </div>}
    </div>
  );
}
