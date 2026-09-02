"use client";

import { Sparkles, Zap, Code2, Share2, ArrowRight, Lightbulb } from "lucide-react";
import Link from "next/link";
import { useTheme } from "./ThemeContext";
import { useEffect, useState } from "react";

// Minimal floating elements - only 2 to avoid clutter
const FLOATING_ITEMS = [
  { text: "JS", icon: Code2, x: 8, y: 18, delay: 0, size: "14px" },
  { text: "Rust", icon: Code2, x: 88, y: 60, delay: 1.2, size: "13px" },
];

const CODE_SNIPPETS = [
  {
    lang: "JavaScript", color: "#F7DF1E",
    lines: [
      { indent: 0, text: 'console.log("Hello, World!");', color: "#61AFEF" },
    ],
    output: "Hello, World!",
  },
  {
    lang: "TypeScript", color: "#3178C6",
    lines: [
      { indent: 0, text: 'const msg: string = "Hello, World!";', color: "#E5C07B" },
      { indent: 0, text: "console.log(msg);", color: "#61AFEF" },
    ],
    output: "Hello, World!",
  },
  {
    lang: "Python", color: "#3776AB",
    lines: [
      { indent: 0, text: 'print("Hello, World!")', color: "#61AFEF" },
    ],
    output: "Hello, World!",
  },
  {
    lang: "C", color: "#A8B9CC",
    lines: [
      { indent: 0, text: "#include <stdio.h>", color: "#C678DD" },
      { indent: 0, text: "", color: "" },
      { indent: 0, text: "int main() {", color: "#C678DD" },
      { indent: 1, text: 'printf("Hello, World!\\n");', color: "#98C379" },
      { indent: 1, text: "return 0;", color: "#E5C07B" },
      { indent: 0, text: "}", color: "#C678DD" },
    ],
    output: "Hello, World!",
  },
  {
    lang: "C++", color: "#00599C",
    lines: [
      { indent: 0, text: "#include <iostream>", color: "#C678DD" },
      { indent: 0, text: "", color: "" },
      { indent: 0, text: "int main() {", color: "#C678DD" },
      { indent: 1, text: 'std::cout << "Hello, World!";', color: "#98C379" },
      { indent: 1, text: "return 0;", color: "#E5C07B" },
      { indent: 0, text: "}", color: "#C678DD" },
    ],
    output: "Hello, World!",
  },
  {
    lang: "Java", color: "#ED8B00",
    lines: [
      { indent: 0, text: "public class Main {", color: "#C678DD" },
      { indent: 1, text: "public static void main(String[] args) {", color: "#C678DD" },
      { indent: 2, text: 'System.out.println("Hello, World!");', color: "#98C379" },
      { indent: 1, text: "}", color: "#C678DD" },
      { indent: 0, text: "}", color: "#C678DD" },
    ],
    output: "Hello, World!",
  },
  {
    lang: "Go", color: "#00ADD8",
    lines: [
      { indent: 0, text: 'package main', color: "#C678DD" },
      { indent: 0, text: "", color: "" },
      { indent: 0, text: 'import "fmt"', color: "#E5C07B" },
      { indent: 0, text: "", color: "" },
      { indent: 0, text: "func main() {", color: "#C678DD" },
      { indent: 1, text: 'fmt.Println("Hello, World!")', color: "#98C379" },
      { indent: 0, text: "}", color: "#C678DD" },
    ],
    output: "Hello, World!",
  },
  {
    lang: "Rust", color: "#CE422B",
    lines: [
      { indent: 0, text: "fn main() {", color: "#C678DD" },
      { indent: 1, text: 'println!("Hello, World!");', color: "#98C379" },
      { indent: 0, text: "}", color: "#C678DD" },
    ],
    output: "Hello, World!",
  },
  {
    lang: "Ruby", color: "#CC342D",
    lines: [
      { indent: 0, text: 'puts "Hello, World!"', color: "#61AFEF" },
    ],
    output: "Hello, World!",
  },
  {
    lang: "Haskell", color: "#5D4F85",
    lines: [
      { indent: 0, text: "main :: IO ()", color: "#E5C07B" },
      { indent: 0, text: 'main = putStrLn "Hello, World!"', color: "#61AFEF" },
    ],
    output: "Hello, World!",
  },
  {
    lang: "HTML", color: "#E34F26",
    lines: [
      { indent: 0, text: "<!DOCTYPE html>", color: "#C678DD" },
      { indent: 0, text: "<html>", color: "#E5C07B" },
      { indent: 1, text: "<body>", color: "#E5C07B" },
      { indent: 2, text: "<h1>Hello, World!</h1>", color: "#98C379" },
      { indent: 1, text: "</body>", color: "#E5C07B" },
      { indent: 0, text: "</html>", color: "#E5C07B" },
    ],
    output: "Hello, World!",
  },
  {
    lang: "CSS", color: "#1572B6",
    lines: [
      { indent: 0, text: "body {", color: "#C678DD" },
      { indent: 1, text: 'font-family: sans-serif;', color: "#E5C07B" },
      { indent: 1, text: "display: grid;", color: "#E5C07B" },
      { indent: 1, text: "place-items: center;", color: "#E5C07B" },
      { indent: 1, text: "height: 100vh;", color: "#E5C07B" },
      { indent: 0, text: "}", color: "#C678DD" },
    ],
    output: "Hello, World!",
  },
];

const CHIPS = CODE_SNIPPETS.map((s) => s.lang);

const FEATURE_BENEFITS = [
  { icon: <Zap size={18} />, label: "Run Instantly", description: "" },
  { icon: <Sparkles size={18} />, label: "AI Code Help", description: "" },
  { icon: <Code2 size={18} />, label: "12+ Languages", description: "" },
  { icon: <Share2 size={18} />, label: "Share Your Code", description: "" },
];

export default function Hero() {
  const { theme } = useTheme();
  const [activeSnippet, setActiveSnippet] = useState(0);
  const [activeChip, setActiveChip] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSnippet((prev) => (prev + 1) % CODE_SNIPPETS.length);
      setActiveChip((prev) => (prev + 1) % CHIPS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const snippet = CODE_SNIPPETS[activeSnippet];

  return (
    <section style={{ position: "relative", overflow: "hidden", padding: isMobile ? "60px 16px 40px" : "100px 24px 80px", minHeight: isMobile ? "auto" : "90vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      {!isMobile && FLOATING_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.text + item.delay} style={{
            position: "absolute", left: item.x + "%", top: item.y + "%",
            padding: "5px 12px", borderRadius: "16px", fontSize: item.size, fontWeight: 600,
            border: "1px solid " + theme.border, color: theme.faint,
            backgroundColor: theme.panel, opacity: 0.5,
            animation: "float 8s ease-in-out " + item.delay + "s infinite",
            display: "flex", alignItems: "center", gap: "5px",
            fontFamily: "var(--font-geist-mono), monospace", userSelect: "none",
          }}>
            <Icon size={11} />
            {item.text}
          </div>
        );
      })}

      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: isMobile ? "clamp(250px, 50vw, 400px)" : "500px", height: isMobile ? "clamp(250px, 50vw, 400px)" : "500px", borderRadius: "50%", background: "radial-gradient(circle, " + theme.accent + "08 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 16px", borderRadius: "50px", border: "1px solid " + theme.border, backgroundColor: theme.panel, marginBottom: "24px", fontSize: "12px", color: theme.muted }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#34D399", animation: "pulse 2s infinite" }} />
          12+ Languages • AI Code Assistant • Instant Execution
        </div>

        {/* Main Headline - Static and clear */}
        <div style={{ marginBottom: "16px" }}>
          <h1 className="font-display" style={{ fontSize: "clamp(52px, 9vw, 96px)", lineHeight: 1.02, fontWeight: 400, marginBottom: "0px" }}>
            Write code.
          </h1>
          <h1 className="font-display" style={{ fontSize: "clamp(52px, 9vw, 96px)", lineHeight: 1.02, fontWeight: 400, marginBottom: "0px" }}>
            Run it.
          </h1>
          <h1 className="font-display" style={{ fontSize: "clamp(52px, 9vw, 96px)", lineHeight: 1.02, fontWeight: 400, marginBottom: "32px" }}>
            <span style={{ fontStyle: "italic" }}>Fix it with AI.</span>
          </h1>
        </div>

        {/* Subheading - Clear value proposition */}
        <p style={{ fontSize: isMobile ? "16px" : "18px", lineHeight: 1.6, color: theme.muted, marginBottom: "36px", maxWidth: "620px", margin: "0 auto 36px auto" }}>
          A browser-based coding environment where you can write, run, and improve code in 12+ languages — with AI assistance when you need it.
        </p>

        {/* Language Chips */}
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", flexWrap: "wrap", marginBottom: "48px", maxWidth: "600px", margin: "0 auto 48px auto" }}>
          {CHIPS.map((chip, i) => (
            <span key={chip} onClick={() => { setActiveChip(i); setActiveSnippet(i); }} style={{
              padding: "5px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: 500,
              border: "1px solid " + (i === activeChip ? theme.accent : theme.border),
              color: i === activeChip ? theme.accent : theme.muted,
              backgroundColor: i === activeChip ? theme.accent + "15" : theme.panel,
              cursor: "pointer", transition: "all 0.3s ease",
              fontFamily: "var(--font-geist-mono), monospace",
            }}>
              {chip}
            </span>
          ))}
        </div>

        {/* Code Preview - Enhanced editor-like appearance */}
        <div style={{ maxWidth: isMobile ? "100%" : "580px", margin: "0 auto 32px auto", border: "1px solid " + theme.border, borderRadius: "14px", overflow: "hidden", textAlign: "left", boxShadow: "0 20px 60px -15px rgba(0,0,0,0.3)", position: "relative" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", backgroundColor: theme.panel, borderBottom: "1px solid " + theme.border }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#FF5F56" }} />
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#FFBD2E" }} />
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#27C93F" }} />
            </div>
            <span className="font-mono" style={{ fontSize: "12px", color: theme.muted, fontWeight: 600 }}>CodeIQ Editor</span>
            <span className="font-mono" style={{ fontSize: "11px", color: snippet.color, fontWeight: 600 }}>{snippet.lang}</span>
          </div>
          
          {/* Code section */}
          <div style={{ padding: "20px", backgroundColor: theme.bg, minHeight: "140px" }}>
            {snippet.lines.map((line, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "2px" }}>
                <span className="font-mono" style={{ fontSize: "11px", color: theme.faint, minWidth: "18px", textAlign: "right", userSelect: "none" }}>{i + 1}</span>
                <span className="font-mono" style={{ fontSize: "13px", lineHeight: 1.7, color: line.color || theme.codeText, paddingLeft: (line.indent * 16) + "px" }}>{line.text}</span>
              </div>
            ))}
          </div>

          {/* Output footer */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderTop: "1px solid " + theme.border, backgroundColor: theme.panel }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#34D399" }} />
              <span className="font-mono" style={{ fontSize: "12px", color: "#34D399" }}>{snippet.output}</span>
            </div>
            <span className="font-mono" style={{ fontSize: "11px", color: theme.faint }}>0.12s</span>
          </div>

          {/* AI Assistant Badge - positioned at bottom right */}
          <div style={{ position: "absolute", bottom: "12px", right: "16px", display: "flex", alignItems: "center", gap: "4px", padding: "4px 8px", borderRadius: "6px", backgroundColor: theme.accent + "15", border: "1px solid " + theme.accent + "40" }}>
            <Sparkles size={12} style={{ color: theme.accent }} />
            <span className="font-mono" style={{ fontSize: "10px", color: theme.accent, fontWeight: 600 }}>AI</span>
          </div>
        </div>

        {/* AI Assistant Card */}
        <div style={{ maxWidth: "400px", margin: "0 auto 48px auto", padding: "16px", borderRadius: "12px", backgroundColor: theme.panel, border: "1px solid " + theme.accent + "30", boxShadow: "0 10px 30px -10px " + theme.accent + "20" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <div style={{ color: theme.accent, marginTop: "2px" }}>
              <Sparkles size={16} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: "13px", fontWeight: 600, color: theme.text, marginBottom: "8px" }}>CodeIQ AI Assistant</p>
              <p style={{ fontSize: "13px", lineHeight: 1.5, color: theme.muted, marginBottom: "12px" }}>Found a possible issue in your code.</p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button style={{ padding: "6px 12px", fontSize: "12px", fontWeight: 500, color: theme.accent, backgroundColor: theme.accent + "15", border: "1px solid " + theme.accent + "40", borderRadius: "6px", cursor: "pointer", transition: "all 0.2s ease" }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.accent + "25"; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = theme.accent + "15"; }}>
                  Explain
                </button>
                <button style={{ padding: "6px 12px", fontSize: "12px", fontWeight: 500, color: theme.bg, backgroundColor: theme.accent, border: "1px solid " + theme.accent, borderRadius: "6px", cursor: "pointer", transition: "all 0.2s ease" }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 12px -2px " + theme.accent + "40"; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}>
                  Fix Bug
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Benefits - Simplified 4 items */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: isMobile ? "16px" : "24px", marginBottom: "48px", maxWidth: "600px", margin: "0 auto 48px auto" }}>
          {FEATURE_BENEFITS.map((item) => (
            <div key={item.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "8px" }}>
              <div style={{ color: theme.accent }}>
                {item.icon}
              </div>
              <span style={{ fontSize: "13px", fontWeight: 600, color: theme.text }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div style={{ display: "flex", justifyContent: "center", gap: isMobile ? "10px" : "12px", flexWrap: isMobile ? "wrap" : "nowrap", flexDirection: isMobile ? "column" : "row" }}>
          <Link
            href="/editor"
            className="font-body"
            style={{
              fontWeight: 600, fontSize: "15px",
              backgroundColor: theme.accent, color: theme.bg,
              padding: "14px 32px", borderRadius: "10px",
              border: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px",
              cursor: "pointer", textDecoration: "none",
              transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
              boxShadow: `0 0 0 0 ${theme.accent}00`,
              width: isMobile ? "100%" : "auto",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px) scale(1.02)"; e.currentTarget.style.boxShadow = `0 8px 30px -4px ${theme.accent}40`; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0) scale(1)"; e.currentTarget.style.boxShadow = `0 0 0 0 ${theme.accent}00`; }}
          >
            Try CodeIQ — It's Free <ArrowRight size={16} />
          </Link>
          <Link
            href="/editor"
            className="font-body"
            style={{
              fontWeight: 500, fontSize: "15px",
              backgroundColor: "transparent", color: theme.muted,
              padding: "14px 32px", borderRadius: "10px",
              border: `1px solid ${theme.border}`,
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px",
              cursor: "pointer", textDecoration: "none",
              transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
              width: isMobile ? "100%" : "auto",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = theme.accent; e.currentTarget.style.color = theme.text; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 6px 20px -4px ${theme.accent}25`; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.muted; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            Explore the Editor
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
      `}</style>
    </section>
  );
}
