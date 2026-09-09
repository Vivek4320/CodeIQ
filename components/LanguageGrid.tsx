"use client";

import Link from "next/link";
import type { CompilerLanguage } from "@/lib/compilerLanguages";

export default function LanguageGrid({ languages }: { languages: CompilerLanguage[] }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "12px",
        marginBottom: "60px",
      }}
    >
      {languages.map((lang) => (
        <Link
          key={lang.slug}
          href={`/${lang.slug}`}
          className="lang-grid-card font-body"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            padding: "16px 20px",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "10px",
            textDecoration: "none",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <span
            style={{
              fontSize: "16px",
              fontWeight: 600,
              opacity: 0.9,
            }}
          >
            {lang.h1}
          </span>
          <span
            style={{
              fontFamily: "var(--font-geist-mono, monospace)",
              fontSize: "11px",
              opacity: 0.45,
            }}
          >
            {lang.version}
          </span>
        </Link>
      ))}
      <style>{`
        .lang-grid-card { transition: border-color 0.2s ease, background 0.2s ease; }
        .lang-grid-card:hover { border-color: rgba(124,107,250,0.5) !important; background: rgba(124,107,250,0.06) !important; }
      `}</style>
    </div>
  );
}
