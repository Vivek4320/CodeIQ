"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, MessageSquare } from "lucide-react";
import { useTheme } from "@/components/landing/ThemeContext";
import { useAuth } from "@/components/AuthContext";
import { useIsMobile } from "@/hooks/useMediaQuery";
import Logo from "@/components/landing/Logo";
import FeedbackModal from "@/components/FeedbackModal";

export default function Footer() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [showFeedback, setShowFeedback] = useState(false);

  const links = [
    { label: "Home", href: "/" },
    { label: "Features", href: user ? "/features" : "/signup" },
    { label: "Docs", href: user ? "/docs" : "/signup" },
    ...(user ? [{ label: "Dashboard", href: "/dashboard" }] : []),
  ];

  /** Language links — descriptive anchor text for SEO internal linking */
  const languageLinks = [
    { label: "JavaScript Editor", href: "/javascript-editor" },
    { label: "TypeScript Editor", href: "/typescript-editor" },
    { label: "Python Compiler", href: "/python-compiler" },
    { label: "C Compiler", href: "/c-compiler" },
    { label: "C++ Compiler", href: "/cpp-compiler" },
    { label: "Java Compiler", href: "/java-compiler" },
    { label: "Go Compiler", href: "/go-compiler" },
    { label: "Rust Compiler", href: "/rust-compiler" },
    { label: "Ruby Compiler", href: "/ruby-compiler" },
    { label: "Haskell Compiler", href: "/haskell-compiler" },
    { label: "HTML Editor", href: "/html-editor" },
    { label: "CSS Editor", href: "/css-editor" },
  ];

  return (
    <>
      <footer style={{ marginTop: "auto" }}>
        {/* Big brand section */}
        <div
          style={{
            borderTop: `1px solid ${theme.border}`,
            borderBottom: `1px solid ${theme.border}`,
            padding: isMobile ? "32px 16px" : "56px 24px",
            textAlign: "center",
          }}
        >
          <Link href="/" style={{ textDecoration: "none", display: "flex", justifyContent: "center" }}>
            <Logo iconSize={isMobile ? 50 : 75} textSize={isMobile ? 40 : 60} />
          </Link>

          {/* Language links — SEO internal links to all 12 compiler pages */}
          <nav aria-label="Language compiler pages">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: isMobile ? "6px" : "8px",
              flexWrap: "wrap",
              marginTop: isMobile ? "20px" : "28px",
            }}
          >
            {languageLinks.map((lang) => (
              <Link
                key={lang.href}
                href={lang.href}
                className="font-mono"
                style={{
                  fontSize: "11px",
                  fontWeight: 500,
                  padding: "5px 12px",
                  borderRadius: "20px",
                  border: `1px solid ${theme.border}`,
                  color: theme.faint,
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = theme.accent; e.currentTarget.style.color = theme.accent; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.faint; }}
              >
                {lang.label}
              </Link>
            ))}
          </div>
          </nav>
        </div>

        {/* Bottom section */}
        <div
          style={{
            maxWidth: "1040px",
            margin: "0 auto",
            padding: isMobile ? "16px" : "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: isMobile ? "center" : "space-between",
            flexDirection: isMobile ? "column" : "row",
            flexWrap: "wrap",
            gap: isMobile ? "12px" : "16px",
          }}
        >
          {/* Links */}
          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "14px" : "20px", flexWrap: "wrap", justifyContent: "center" }}>
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
