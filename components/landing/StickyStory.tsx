"use client";

import { Sparkles, Zap, GitBranch, Share2 } from "lucide-react";
import { useTheme } from "./ThemeContext";
import { useIsMobile } from "@/hooks/useMediaQuery";

const STORIES = [
  {
    icon: Sparkles,
    tag: "01 — Completion",
    title: "It finishes your thought",
    desc: "Inline suggestions built from your function, your variable names, your intent — not generic boilerplate pulled from nowhere.",
    code: `def is_palindrome(s):
    return s == s[::-1]

# suggested: strip spaces + lowercase
def clean_palindrome(s):
    s = s.lower().replace(" ", "")
    return s == s[::-1]`,
  },
  {
    icon: Zap,
    tag: "02 — Execution",
    title: "Runs the second you hit compile",
    desc: "12 languages. No containers to spin up, no queue to wait in. Output prints in under a second.",
    code: `$ run main.cpp

> Build succeeded
> Output: 55
> Time: 0.09s`,
  },
  {
    icon: GitBranch,
    tag: "03 — History",
    title: "Every run, saved automatically",
    desc: "No manual commits. Every execution is versioned, so you can roll back to any point without thinking twice.",
    code: `v4  2 min ago    fixed edge case
v3  8 min ago    added merge()
v2  14 min ago   base recursion
v1  20 min ago   initial draft`,
  },
  {
    icon: Share2,
    tag: "04 — Sharing",
    title: "One link, live for anyone",
    desc: "Send a program that runs itself. Whoever opens it sees your output — not a screenshot, not a gist.",
    code: `$ share sort.py

> Link created:
  codeiq.dev/p/8f2ka1
> Expires: never`,
  },
];

export default function StickyStory() {
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  return (
    <section style={{ maxWidth: "1040px", margin: "0 auto", padding: "80px 24px" }}>
      <div style={{ display: "flex", gap: isMobile ? "32px" : "56px", alignItems: "flex-start", flexDirection: isMobile ? "column" : "row", flexWrap: "wrap" }}>
        <div style={{ flex: isMobile ? "none" : "1 1 260px", position: isMobile ? "relative" : "sticky", top: isMobile ? "auto" : "40px", minWidth: isMobile ? "auto" : "240px", width: isMobile ? "100%" : "auto" }}>
          <div
            className="font-mono"
            style={{
              fontSize: "12px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: theme.faint,
              marginBottom: "16px",
            }}
          >
            How it works
          </div>
          <h2 className="font-display" style={{ fontSize: "clamp(28px, 4vw, 38px)", fontWeight: 400, lineHeight: 1.15 }}>
            Four things, done <span style={{ fontStyle: "italic" }}>right.</span>
          </h2>
        </div>

        <div style={{ flex: "2 1 420px", display: "flex", flexDirection: "column", gap: isMobile ? "40px" : "88px", minWidth: isMobile ? "auto" : "300px", width: isMobile ? "100%" : "auto" }}>
          {STORIES.map(({ icon: Icon, tag, title, desc, code }) => (
            <div key={tag}>
              <div className="font-mono" style={{ fontSize: "12px", color: theme.faint, marginBottom: "12px" }}>
                {tag}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                <Icon size={18} strokeWidth={1.5} style={{ color: theme.accent }} />
                <h3 className="font-body" style={{ fontSize: "20px", fontWeight: 600 }}>
                  {title}
                </h3>
              </div>
              <p
                className="font-body"
                style={{ fontSize: "15px", color: theme.muted, lineHeight: 1.65, marginBottom: "20px", maxWidth: "460px" }}
              >
                {desc}
              </p>
              <div style={{ border: `1px solid ${theme.border}`, borderRadius: "10px", backgroundColor: theme.panel, padding: "18px" }}>
                <pre
                  className="font-mono"
                  style={{ fontSize: "12.5px", lineHeight: 1.7, color: theme.codeText, margin: 0, whiteSpace: "pre-wrap" }}
                >
                  {code}
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
