"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useTheme } from "./ThemeContext";

const FAQS = [
  {
    q: "What is CodeIQ?",
    a: "CodeIQ is a browser-based code editor that lets you write, run, and share code in 12 languages — no setup required. It also includes an AI coding assistant that can help you write, fix, and understand code.",
  },
  {
    q: "Which programming languages are supported?",
    a: "CodeIQ supports 12 languages: JavaScript, TypeScript, Python, C, C++, Java, Go, Rust, Ruby, Haskell, HTML, and CSS. More languages coming soon!",
  },
  {
    q: "Is CodeIQ free to use?",
    a: "Yes! CodeIQ is completely free to use. Sign up with your email or Google account and start coding instantly.",
  },
  {
    q: "Do I need to install anything?",
    a: "No. CodeIQ runs entirely in your browser. Just open the website, sign in, and start coding. No downloads, no setup, no installations needed.",
  },
  {
    q: "Can I share my code with others?",
    a: "Yes! Every project can be shared via a unique link. Anyone with the link can view and run your code. You can also generate live previews for HTML/CSS projects.",
  },
  {
    q: "How does the AI agent work?",
    a: "The AI agent (CodeIQ) reads your code, understands context, and can help you write new code, fix bugs, optimize performance, and explain how code works. It can even run code to verify it works.",
  },
  {
    q: "Is my code saved?",
    a: "Yes. Every run is auto-saved to your history, and projects are saved to your account. You can access them anytime from the dashboard.",
  },
];

function FAQItem({ faq, isOpen, onToggle, theme }: {
  faq: typeof FAQS[0];
  isOpen: boolean;
  onToggle: () => void;
  theme: any;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [isOpen]);

  return (
    <div
      style={{
        borderBottom: `1px solid ${theme.border}`,
        borderRadius: "8px",
        transition: "background 0.2s ease",
        backgroundColor: isOpen ? `${theme.text}03` : "transparent",
      }}
      onMouseEnter={(e) => { if (!isOpen) e.currentTarget.style.backgroundColor = `${theme.text}05`; }}
      onMouseLeave={(e) => { if (!isOpen) e.currentTarget.style.backgroundColor = "transparent"; }}
    >
      <button
        onClick={onToggle}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "18px 0", background: "none", border: "none", cursor: "pointer",
          textAlign: "left", gap: "16px",
        }}
        aria-expanded={isOpen}
      >
        <span className="font-body" style={{
          fontSize: "15px", fontWeight: 500,
          color: isOpen ? theme.accent : theme.text,
          transition: "color 0.2s ease",
        }}>
          {faq.q}
        </span>
        <ChevronDown
          size={16}
          style={{
            color: isOpen ? theme.accent : theme.faint,
            flexShrink: 0,
            transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), color 0.2s ease",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>
      <div
        ref={contentRef}
        style={{
          maxHeight: isOpen ? `${height + 20}px` : "0",
          opacity: isOpen ? 1 : 0,
          overflow: "hidden",
          transition: "max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease 0.05s",
        }}
      >
        <p className="font-body" style={{
          fontSize: "14px", color: theme.muted, lineHeight: 1.65,
          padding: "0 0 18px",
        }}>
          {faq.a}
        </p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const { theme } = useTheme();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section style={{ borderTop: `1px solid ${theme.border}`, padding: "96px 24px" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2 className="font-display" style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 400, lineHeight: 1.15, marginBottom: "12px" }}>
            Frequently Asked <span style={{ fontStyle: "italic" }}>Questions.</span>
          </h2>
          <p className="font-body" style={{ fontSize: "15px", color: theme.muted, maxWidth: "440px", margin: "0 auto", lineHeight: 1.65 }}>
            Everything you need to know about CodeIQ.
          </p>
        </div>

        {/* FAQ Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {FAQS.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              theme={theme}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
