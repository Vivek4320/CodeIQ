"use client";

import { Sparkles, Zap, Code2, Globe, Terminal, FileCode, Braces, Hash, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTheme } from "./ThemeContext";
import { useEffect, useState } from "react";

const FLOATING_ITEMS = [
  { text: "JS", icon: Braces, x: 8, y: 18, delay: 0, size: "14px" },
  { text: "Python", icon: FileCode, x: 82, y: 12, delay: 0.4, size: "13px" },
  { text: "C++", icon: Code2, x: 12, y: 68, delay: 0.8, size: "13px" },
  { text: "Rust", icon: Terminal, x: 88, y: 60, delay: 1.2, size: "13px" },
  { text: "Go", icon: Hash, x: 18, y: 42, delay: 1.6, size: "14px" },
  { text: "TS", icon: Braces, x: 85, y: 38, delay: 0.2, size: "14px" },
  { text: "HTML", icon: Code2, x: 72, y: 78, delay: 0.6, size: "12px" },
  { text: "CSS", icon: Hash, x: 22, y: 82, delay: 1.0, size: "12px" },
  { text: "Java", icon: FileCode, x: 65, y: 20, delay: 1.4, size: "12px" },
  { text: "Ruby", icon: Terminal, x: 35, y: 75, delay: 0.9, size: "12px" },
  { text: "Haskell", icon: Braces, x: 92, y: 82, delay: 1.8, size: "11px" },
  { text: "C", icon: Hash, x: 5, y: 55, delay: 0.3, size: "14px" },
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

export default function Hero() {
  const { theme } = useTheme();
  const [activeSnippet, setActiveSnippet] = useState(0);
  const [activeChip, setActiveChip] = useState(0);
  const [headingText, setHeadingText] = useState("");
  const [headingDone, setHeadingDone] = useState(false);
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const TAGLINES = [
    "Run it instantly.",
    "AI codes with you.",
    "Ship faster with AI.",
  ];
  const fullHeading = TAGLINES[taglineIndex];

  // Heading typing effect — cycles through taglines
  useEffect(() => {
    if (headingDone) {
      const timer = setTimeout(() => {
        setHeadingDone(false);
        setHeadingText("");
        setTaglineIndex((prev) => (prev + 1) % TAGLINES.length);
      }, 4000);
      return () => clearTimeout(timer);
    }

    if (headingText.length < fullHeading.length) {
      const timer = setTimeout(() => {
        setHeadingText(fullHeading.slice(0, headingText.length + 1));
      }, 70);
      return () => clearTimeout(timer);
    } else {
      setHeadingDone(true);
    }
  }, [headingText, headingDone, fullHeading]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSnippet((prev) => (prev + 1) % CODE_SNIPPETS.length);
      setActiveChip((prev) => (prev + 1) % CHIPS.length);
    }, 3000);
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
            backgroundColor: theme.panel, opacity: 0.7,
            animation: "float 5s ease-in-out " + item.delay + "s infinite",
            display: "flex", alignItems: "center", gap: "5px",
            fontFamily: "var(--font-geist-mono), monospace", userSelect: "none",
          }}>
            <Icon size={11} />
            {item.text}
          </div>
        );
      })}

      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, " + theme.accent + "08 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 16px", borderRadius: "50px", border: "1px solid " + theme.border, backgroundColor: theme.panel, marginBottom: "28px", fontSize: "12px", color: theme.muted }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#34D399", animation: "pulse 2s infinite" }} />
          12 Languages &bull; AI Powered &bull; Zero Setup
        </div>

        <h1 className="font-display" style={{ fontSize: "clamp(52px, 9vw, 96px)", lineHeight: 1.02, fontWeight: 400, marginBottom: "8px" }}>
          Write code.
        </h1>
        <h1 className="font-display" style={{ fontSize: "clamp(52px, 9vw, 96px)", lineHeight: 1.02, fontWeight: 400, marginBottom: "32px", minHeight: "1.1em" }}>
          <span style={{ fontStyle: "italic" }}>
            {headingText}
          </span>
          <span style={{ display: "inline-block", width: "3px", height: "0.8em", backgroundColor: theme.accent, marginLeft: "2px", verticalAlign: "middle", animation: "blink 1s step-end infinite" }} />
        </h1>

        <div style={{ display: "flex", justifyContent: "center", gap: "8px", flexWrap: "wrap", marginBottom: "48px" }}>
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

        <div style={{ maxWidth: isMobile ? "100%" : "520px", margin: "0 auto", border: "1px solid " + theme.border, borderRadius: "14px", overflow: "hidden", textAlign: "left", boxShadow: "0 20px 60px -15px rgba(0,0,0,0.3)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", backgroundColor: theme.panel, borderBottom: "1px solid " + theme.border }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#FF5F56" }} />
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#FFBD2E" }} />
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#27C93F" }} />
            </div>
            <span className="font-mono" style={{ fontSize: "11px", color: snippet.color, fontWeight: 600 }}>{snippet.lang}</span>
            <Sparkles size={12} style={{ color: "#FBBF24" }} />
          </div>
          <div style={{ padding: "20px", backgroundColor: theme.bg, minHeight: "140px" }}>
            {snippet.lines.map((line, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "2px" }}>
                <span className="font-mono" style={{ fontSize: "11px", color: theme.faint, minWidth: "18px", textAlign: "right", userSelect: "none" }}>{i + 1}</span>
                <span className="font-mono" style={{ fontSize: "13px", lineHeight: 1.7, color: line.color || theme.codeText, paddingLeft: (line.indent * 16) + "px" }}>{line.text}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", borderTop: "1px solid " + theme.border, backgroundColor: theme.panel }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#34D399" }} />
              <span className="font-mono" style={{ fontSize: "12px", color: "#34D399" }}>{snippet.output}</span>
            </div>
            <span className="font-mono" style={{ fontSize: "11px", color: theme.faint }}>0.12s</span>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "32px", flexWrap: "wrap", marginTop: "48px" }}>
          {[
            { icon: <Zap size={16} />, label: "Instant Execution" },
            { icon: <Sparkles size={16} />, label: "AI Code Agent" },
            { icon: <Code2 size={16} />, label: "12 Languages" },
            { icon: <Globe size={16} />, label: "Shareable Links" },
          ].map((item) => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: theme.muted }}>
              <span style={{ color: theme.accent }}>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "40px" }}>
          <Link
            href="/editor"
            className="font-body"
            style={{
              fontWeight: 500, fontSize: "15px",
              backgroundColor: theme.accent, color: theme.bg,
              padding: "14px 32px", borderRadius: "10px",
              border: "none", display: "inline-flex", alignItems: "center", gap: "8px",
              cursor: "pointer", textDecoration: "none",
              transition: "opacity 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
          >
            Start coding free <ArrowRight size={16} />
          </Link>
          <Link
            href="/signup"
            className="font-body"
            style={{
              fontWeight: 500, fontSize: "15px",
              backgroundColor: "transparent", color: theme.muted,
              padding: "14px 32px", borderRadius: "10px",
              border: `1px solid ${theme.border}`,
              display: "inline-flex", alignItems: "center", gap: "8px",
              cursor: "pointer", textDecoration: "none",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = theme.accent; e.currentTarget.style.color = theme.text; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.muted; }}
          >
            Create account
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
      `}</style>
    </section>
  );
}
