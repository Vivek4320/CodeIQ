"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTheme } from "./ThemeContext";

export default function CTASection() {
  const { theme } = useTheme();

  return (
    <section style={{ borderTop: `1px solid ${theme.border}`, textAlign: "center", padding: "80px 24px" }}>
      <h2 className="font-display" style={{ fontSize: "clamp(30px, 5vw, 42px)", fontWeight: 400, marginBottom: "28px" }}>
        Start writing code that <span style={{ fontStyle: "italic" }}>finishes itself.</span>
      </h2>
      <Link
        href="/editor"
        className="font-body"
        style={{
          fontWeight: 500,
          backgroundColor: theme.accent,
          color: theme.bg,
          padding: "14px 30px",
          borderRadius: "6px",
          border: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          cursor: "pointer",
          textDecoration: "none",
          transition: "background 0.2s ease",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.accentHover; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = theme.accent; }}
      >
        Get started free <ArrowRight size={16} />
      </Link>
    </section>
  );
}
