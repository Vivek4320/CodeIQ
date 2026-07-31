"use client";

import { useState } from "react";
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
  {
    q: "Can I use CodeIQ on mobile?",
    a: "CodeIQ is responsive and works on tablets. For the best coding experience, we recommend using it on a desktop or laptop computer.",
  },
];

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
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} style={{ borderBottom: `1px solid ${theme.border}`, borderRadius: "8px", transition: "background 0.2s ease" }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${theme.text}05`; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}>
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "18px 0", background: "none", border: "none", cursor: "pointer",
                    textAlign: "left", gap: "16px",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = theme.accent; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = theme.text; }}
                >
                  <span className="font-body" style={{ fontSize: "15px", fontWeight: 500, color: isOpen ? theme.accent : theme.text, transition: "color 0.15s ease" }}>
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={16}
                    style={{
                      color: theme.faint, flexShrink: 0, transition: "transform 0.2s ease",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </button>
                <div style={{
                  maxHeight: isOpen ? "200px" : "0", overflow: "hidden",
                  transition: "max-height 0.3s ease",
                }}>
                  <p className="font-body" style={{ fontSize: "14px", color: theme.muted, lineHeight: 1.65, paddingBottom: isOpen ? "18px" : "0" }}>
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
