"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import { useTheme } from "@/components/landing/ThemeContext";
import CodeEditor from "@/components/editor/CodeEditor";
import OutputPanel from "@/components/editor/OutputPanel";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { CompilerLanguage } from "@/lib/compilerLanguages";

const display = Instrument_Serif({ subsets: ["latin"], weight: ["400"], style: ["normal", "italic"], variable: "--font-display" });
const bodyFont = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

// Map our SEO slugs to the editor's internal language keys
const LANG_KEY_MAP: Record<string, string> = {
  python: "python",
  java: "java",
  cpp: "cpp",
  c: "c",
  javascript: "javascript",
  typescript: "typescript",
  go: "go",
  rust: "rust",
  ruby: "ruby",
  haskell: "haskell",
  html: "html",
  css: "css",
};

export default function CompilerLanding({ lang }: { lang: CompilerLanguage }) {
  const { theme } = useTheme();
  const editorLangKey = LANG_KEY_MAP[lang.name.toLowerCase()] || lang.extension;

  const [code, setCode] = useState(lang.sampleCode);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = useCallback(async () => {
    setIsRunning(true);
    setOutput([]);
    try {
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: editorLangKey, code }),
      });
      const data = await res.json();
      if (data.error) {
        setOutput([data.error]);
      } else if (data.output && data.output.length > 0) {
        setOutput(data.output.filter((l: string) => l.trim() !== ""));
      } else {
        setOutput(["(no output)"]);
      }
    } catch (e: any) {
      setOutput(["Error: " + e.message]);
    } finally {
      setIsRunning(false);
    }
  }, [code, editorLangKey]);

  return (
    <div className={`${display.variable} ${bodyFont.variable} ${mono.variable}`} style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main style={{ flex: 1, padding: "48px 24px", maxWidth: "1100px", margin: "0 auto", width: "100%" }}>
        <h1 className="font-display" style={{ fontSize: "42px", marginBottom: "12px" }}>
          Online {lang.name} Compiler
        </h1>
        <p className="font-body" style={{ fontSize: "17px", color: theme.muted, marginBottom: "32px", maxWidth: "700px" }}>
          Write, compile and run {lang.name} code online — free, fast, and no signup required. Powered by CodeIQ&apos;s AI-assisted editor.
        </p>

        {/* Working mini editor */}
        <div style={{ border: `1px solid ${theme.border}`, borderRadius: "10px", overflow: "hidden", marginBottom: "40px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", backgroundColor: theme.panel, borderBottom: `1px solid ${theme.border}` }}>
            <span className="font-mono" style={{ fontSize: "12px", color: theme.muted }}>main.{lang.extension}</span>
            <button
              onClick={handleRun}
              disabled={isRunning}
              style={{
                padding: "6px 16px", fontSize: "13px", fontWeight: 500,
                backgroundColor: theme.accent, color: theme.bg, border: "none",
                borderRadius: "6px", cursor: isRunning ? "default" : "pointer",
                opacity: isRunning ? 0.6 : 1,
              }}
            >
              {isRunning ? "Running..." : "▶ Run"}
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", height: "480px" }}>
            <div style={{ flex: 1, minHeight: 0, borderBottom: `1px solid ${theme.border}` }}>
              <CodeEditor language={editorLangKey} value={code} onChange={setCode} />
            </div>
            <div style={{ height: "180px" }}>
              <OutputPanel output={output} isRunning={isRunning} onClear={() => setOutput([])} />
            </div>
          </div>
        </div>

        <div style={{ marginBottom: "40px" }}>
          <Link
            href="/editor"
            style={{
              display: "inline-block", padding: "10px 20px", fontSize: "14px", fontWeight: 500,
              border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, textDecoration: "none",
            }}
          >
            Open Full Editor (save, share, AI assistant) →
          </Link>
        </div>

        <section>
          <h2 className="font-display" style={{ fontSize: "26px", marginBottom: "16px" }}>
            Why use CodeIQ for {lang.name}?
          </h2>
          <ul style={{ listStyle: "disc", paddingLeft: "24px", color: theme.muted, lineHeight: 1.9 }}>
            <li>Instant {lang.name} code execution directly in your browser</li>
            <li>AI-powered code suggestions and debugging assistance</li>
            <li>No installation, setup, or sign-up required</li>
            <li>Share your {lang.name} code with a single link (via full editor)</li>
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
}