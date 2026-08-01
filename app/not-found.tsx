"use client";

import Link from "next/link";
import { useTheme } from "@/components/landing/ThemeContext";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  const { theme } = useTheme();

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      backgroundColor: theme.bg, color: theme.text, padding: "24px",
    }}>
      <div style={{ textAlign: "center", maxWidth: "400px" }}>
        {/* Big 404 */}
        <div style={{
          fontSize: "clamp(80px, 20vw, 140px)", fontWeight: 700,
          color: theme.accent, lineHeight: 1, marginBottom: "8px",
          fontFamily: "var(--font-mono), monospace",
          opacity: 0.2,
        }}>
          404
        </div>

        {/* Icon */}
        <div style={{
          width: "64px", height: "64px", borderRadius: "16px", margin: "0 auto 24px",
          backgroundColor: `${theme.accent}12`, display: "flex", alignItems: "center",
          justifyContent: "center",
        }}>
          <span style={{ fontSize: "28px" }}>⟨/⟩</span>
        </div>

        <h1 className="font-display" style={{
          fontSize: "28px", fontWeight: 400, marginBottom: "12px",
        }}>
          Page <span style={{ fontStyle: "italic" }}>not found</span>
        </h1>

        <p className="font-body" style={{
          fontSize: "15px", color: theme.muted, lineHeight: 1.6, marginBottom: "32px",
        }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/"
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "12px 24px", fontSize: "14px", fontWeight: 500,
              backgroundColor: theme.accent, color: theme.bg,
              borderRadius: "8px", textDecoration: "none",
              transition: "all 0.2s ease",
            }}
          >
            <Home size={16} /> Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "12px 24px", fontSize: "14px", fontWeight: 500,
              backgroundColor: "transparent", color: theme.muted,
              border: `1px solid ${theme.border}`, borderRadius: "8px",
              cursor: "pointer", transition: "all 0.2s ease",
            }}
          >
            <ArrowLeft size={16} /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
