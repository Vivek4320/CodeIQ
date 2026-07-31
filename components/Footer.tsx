"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, MessageSquare } from "lucide-react";
import { useTheme } from "@/components/landing/ThemeContext";
import { useAuth } from "@/components/AuthContext";
import Logo from "@/components/landing/Logo";
import FeedbackModal from "@/components/FeedbackModal";

export default function Footer() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [showFeedback, setShowFeedback] = useState(false);

  const links = [
    { label: "Home", href: "/" },
    { label: "Features", href: user ? "/features" : "/signup" },
    { label: "Docs", href: user ? "/docs" : "/signup" },
    ...(user ? [{ label: "Dashboard", href: "/dashboard" }] : []),
  ];

  const languages = ["JS", "TS", "PY", "C", "C++", "Java", "Go", "Rust", "RB", "HS"];

  return (
    <>
      <footer style={{ marginTop: "auto" }}>
        {/* Big brand section */}
        <div
          style={{
            borderTop: `1px solid ${theme.border}`,
            borderBottom: `1px solid ${theme.border}`,
            padding: "56px 24px",
            textAlign: "center",
          }}
        >
          <Link href="/" style={{ textDecoration: "none", display: "flex", justifyContent: "center" }}>
            <Logo iconSize={75} textSize={60} />
          </Link>

          {/* Language pills */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              flexWrap: "wrap",
              marginTop: "28px",
            }}
          >
            {languages.map((lang) => (
              <span
                key={lang}
                className="font-mono"
                style={{
                  fontSize: "11px",
                  fontWeight: 500,
                  padding: "5px 12px",
                  borderRadius: "20px",
                  border: `1px solid ${theme.border}`,
                  color: theme.faint,
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = theme.accent; e.currentTarget.style.color = theme.accent; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.faint; }}
              >
                {lang}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom section */}
        <div
          style={{
            maxWidth: "1040px",
            margin: "0 auto",
            padding: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          {/* Links */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-mono"
                style={{
                  fontSize: "12px",
                  color: theme.muted,
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = theme.text; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = theme.muted; }}
              >
                {link.label}
                <ArrowUpRight size={10} style={{ opacity: 0.5 }} />
              </Link>
            ))}
            {/* Feedback button */}
            <button
              onClick={() => setShowFeedback(true)}
              className="font-mono"
              style={{
                fontSize: "12px",
                color: theme.muted,
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: 0,
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = theme.text; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = theme.muted; }}
            >
              <MessageSquare size={12} />
              Feedback
            </button>
          </div>

          {/* Copyright */}
          <span className="font-mono" style={{ fontSize: "11px", color: theme.faint }}>
            © 2026 — write less, ship more
          </span>
        </div>
      </footer>

      <FeedbackModal isOpen={showFeedback} onClose={() => setShowFeedback(false)} />
    </>
  );
}
