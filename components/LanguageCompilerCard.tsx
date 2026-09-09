"use client";

import Link from "next/link";

interface LanguageCompilerCardProps {
  slug: string;
  h1: string;
  version: string;
}

export default function LanguageCompilerCard({
  slug,
  h1,
  version,
}: LanguageCompilerCardProps) {
  return (
    <Link
      href={`/${slug}`}
      className="font-body"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        padding: "16px 20px",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "10px",
        textDecoration: "none",
        transition: "all 0.2s ease",
        background: "rgba(255,255,255,0.02)",
      }}
      onMouseEnter={(event) => {
        event.currentTarget.style.borderColor = "rgba(124,107,250,0.5)";
        event.currentTarget.style.background = "rgba(124,107,250,0.06)";
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
        event.currentTarget.style.background = "rgba(255,255,255,0.02)";
      }}
    >
      <span
        style={{
          fontSize: "16px",
          fontWeight: 600,
          color: "inherit",
          opacity: 0.9,
        }}
      >
        {h1}
      </span>
      <span
        style={{
          fontFamily: "var(--font-geist-mono, monospace)",
          fontSize: "11px",
          opacity: 0.45,
        }}
      >
        {version}
      </span>
    </Link>
  );
}