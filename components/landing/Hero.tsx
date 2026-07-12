"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTheme } from "./ThemeContext";

export default function Hero() {
  const { theme } = useTheme();

  return (
    <section style={{ maxWidth: "720px", margin: "0 auto", padding: "48px 24px 40px", textAlign: "center" }}>
      <h1
        className="font-display"
        style={{ fontSize: "clamp(60px, 10vw, 100px)", lineHeight: 1.08, fontWeight: 400, marginBottom: "20px" }}
      >
        Every language.
        <br />
        <span style={{ fontStyle: "italic" }}>One editor.</span>
      </h1>
      <p
        className="font-body"
        style={{ fontSize: "17px", color: theme.muted, maxWidth: "440px", margin: "0 auto 32px", lineHeight: 1.6 }}
      >
        Write, run, and save code from the browser — with an assistant
        that understands what you&apos;re building.
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: "14px", flexWrap: "wrap" }}>
        <Link
          href="/editor"
          className="font-body"
          style={{
            fontWeight: 500,
            backgroundColor: theme.accent,
            color: theme.bg,
            padding: "12px 24px",
            borderRadius: "6px",
            border: "none",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
            textDecoration: "none",
            transition: "background 0.2s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.accentHover; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = theme.accent; }}
        >
          Start building <ArrowRight size={16} />
        </Link>
        <Link
          href="/docs"
          className="font-body"
          style={{
            fontWeight: 500,
            color: theme.text,
            padding: "12px 24px",
            borderRadius: "6px",
            border: `1px solid ${theme.border}`,
            backgroundColor: "transparent",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = theme.accent;
            e.currentTarget.style.color = theme.accent;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = theme.border;
            e.currentTarget.style.color = theme.text;
          }}
        >
          View docs
        </Link>
      </div>
    </section>
  );
}
