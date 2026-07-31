"use client";

import { ArrowRight, Play, Check, Sparkles } from "lucide-react";
import Link from "next/link";
import { useTheme } from "./ThemeContext";

const STATS = [
  { value: "12", label: "Languages supported" },
  { value: "<1s", label: "Average run time" },
  { value: "100%", label: "Free forever" },
];

const HIGHLIGHTS = [
  "AI-powered code completion",
  "Auto-save as you type",
  "Instant code execution",
];

export default function CTASection() {
  const { theme } = useTheme();

  return (
    <section style={{ borderTop: `1px solid ${theme.border}` }}>
      <div
        style={{
          maxWidth: "1040px",
          margin: "0 auto",
          padding: "80px 24px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "56px",
          alignItems: "center",
        }}
      >
        {/* Left: Content */}
        <div>
          <div
            className="font-mono"
            style={{
              fontSize: "11px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: theme.accent,
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Sparkles size={13} /> Open source & free
          </div>

          <h2
            className="font-display"
            style={{
              fontSize: "clamp(28px, 4vw, 40px)",
              fontWeight: 400,
              lineHeight: 1.15,
              marginBottom: "20px",
            }}
          >
            Stop switching tabs.<br />
            <span style={{ fontStyle: "italic" }}>Start shipping code.</span>
          </h2>

          <p
            className="font-body"
            style={{
              fontSize: "15px",
              color: theme.muted,
              lineHeight: 1.65,
              marginBottom: "28px",
              maxWidth: "400px",
            }}
          >
            CodeIQ gives you a fast editor, instant execution, and AI suggestions — all in one tab. No installs, no config, just code.
          </p>

          {/* Highlights */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "32px" }}>
            {HIGHLIGHTS.map((item) => (
              <div
                key={item}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div
                  style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    backgroundColor: `${theme.accent}18`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Check size={11} style={{ color: theme.accent }} />
                </div>
                <span className="font-body" style={{ fontSize: "13px", color: theme.muted }}>
                  {item}
                </span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Link
              href="/editor"
              data-magnetic
              className="font-body"
              style={{
                fontWeight: 500,
                fontSize: "14px",
                backgroundColor: theme.accent,
                color: theme.bg,
                padding: "12px 26px",
                borderRadius: "8px",
                border: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                textDecoration: "none",
                transition: "opacity 0.2s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
            >
              Get started free <ArrowRight size={15} />
            </Link>
            <Link
              href="/features"
              data-magnetic
              className="font-body"
              style={{
                fontWeight: 500,
                fontSize: "14px",
                backgroundColor: "transparent",
                color: theme.muted,
                padding: "12px 26px",
                borderRadius: "8px",
                border: `1px solid ${theme.border}`,
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                textDecoration: "none",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = theme.accent; e.currentTarget.style.color = theme.text; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.muted; }}
            >
              See features
            </Link>
          </div>
        </div>

        {/* Right: Code preview card */}
        <div
          style={{
            border: `1px solid ${theme.border}`,
            borderRadius: "14px",
            backgroundColor: theme.panel,
            overflow: "hidden",
          }}
        >
          {/* Terminal header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 16px",
              borderBottom: `1px solid ${theme.border}`,
            }}
          >
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#FF5F56" }} />
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#FFBD2E" }} />
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#27C93F" }} />
            <span className="font-mono" style={{ fontSize: "11px", color: theme.faint, marginLeft: "8px" }}>
              main.py
            </span>
          </div>

          {/* Code */}
          <pre
            className="font-mono"
            style={{
              fontSize: "13px",
              lineHeight: 1.8,
              color: theme.codeText,
              padding: "20px",
              margin: 0,
              whiteSpace: "pre-wrap",
            }}
          >
{`<span style="color:${theme.faint}"># fizzbuzz in 4 lines</span>

<span style="color:#C678DD">for</span> i <span style="color:#C678DD">in</span> <span style="color:#61AFEF">range</span>(<span style="color:#D19A66">1</span>, <span style="color:#D19A66">101</span>):
    <span style="color:#61AFEF">print</span>(<span style="color:#98C379">"Fizz"</span>*<span style="color:#D19A66">not</span>(i%<span style="color:#D19A66">3</span>) + <span style="color:#98C379">"Buzz"</span>*<span style="color:#D19A66">not</span>(i%<span style="color:#D19A66">5</span>) <span style="color:#C678DD">or</span> i)`}
          </pre>

          {/* Run bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 16px",
              borderTop: `1px solid ${theme.border}`,
              backgroundColor: theme.panel,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#27C93F" }} />
              <span className="font-mono" style={{ fontSize: "11px", color: theme.faint }}>Ready</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "5px 12px",
                borderRadius: "6px",
                backgroundColor: `${theme.accent}15`,
                color: theme.accent,
              }}
            >
              <Play size={10} fill="currentColor" />
              <span className="font-mono" style={{ fontSize: "11px", fontWeight: 600 }}>Run</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div
        style={{
          borderTop: `1px solid ${theme.border}`,
          display: "flex",
          justifyContent: "center",
          gap: "64px",
          padding: "32px 24px",
        }}
      >
        {STATS.map((stat) => (
          <div key={stat.label} style={{ textAlign: "center" }}>
            <div
              className="font-display"
              style={{
                fontSize: "28px",
                fontWeight: 400,
                color: theme.accent,
                lineHeight: 1,
                marginBottom: "6px",
              }}
            >
              {stat.value}
            </div>
            <div
              className="font-mono"
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: theme.faint,
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
