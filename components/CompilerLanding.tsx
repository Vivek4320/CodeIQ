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
import { compilerLanguages } from "@/lib/compilerLanguages";

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-display",
});
const bodyFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

/** Human-readable label per execution type */
function executionLabel(type: CompilerLanguage["executionType"]): string {
  if (type === "live-vm") return "Live VM (runs in-browser, instant)";
  if (type === "live-preview") return "Live Preview (rendered in-browser)";
  return "Judge0 Execution Engine (sandboxed server)";
}

/** Section heading styles */
function SectionH2({
  children,
  theme,
}: {
  children: React.ReactNode;
  theme: ReturnType<typeof useTheme>["theme"];
}) {
  return (
    <h2
      className="font-display"
      style={{ fontSize: "24px", marginBottom: "14px", color: theme.text }}
    >
      {children}
    </h2>
  );
}

export default function CompilerLanding({ lang }: { lang: CompilerLanguage }) {
  const { theme } = useTheme();

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
        body: JSON.stringify({ language: lang.editorKey, code }),
      });
      const data = await res.json();
      if (data.error) {
        setOutput([data.error, ...(data.output || [])]);
      } else if (data.output && data.output.length > 0) {
        setOutput(data.output);
      } else {
        setOutput(["(no output)"]);
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setOutput(["Error: " + msg]);
    } finally {
      setIsRunning(false);
    }
  }, [code, lang.editorKey]);

  /** Related languages for the "Explore More" section */
  const relatedLanguages = lang.relatedSlugs
    .map((slug) => compilerLanguages.find((l) => l.slug === slug))
    .filter(Boolean) as CompilerLanguage[];

  const isPreview = lang.executionType === "live-preview";

  return (
    <div
      className={`${display.variable} ${bodyFont.variable} ${mono.variable}`}
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Navbar />

      <main
        style={{
          flex: 1,
          padding: "40px 24px 64px",
          maxWidth: "1100px",
          margin: "0 auto",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* ── Breadcrumb ─────────────────────────────────────────── */}
        <nav
          aria-label="Breadcrumb"
          style={{ marginBottom: "28px" }}
        >
          <ol
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              listStyle: "none",
              padding: 0,
              margin: 0,
              flexWrap: "wrap",
            }}
          >
            <li>
              <Link
                href="/"
                className="font-mono"
                style={{
                  fontSize: "12px",
                  color: theme.muted,
                  textDecoration: "none",
                }}
              >
                Home
              </Link>
            </li>
            <li
              aria-hidden="true"
              className="font-mono"
              style={{ fontSize: "12px", color: theme.faint }}
            >
              /
            </li>
            <li>
              <Link
                href="/online-code-compiler"
                className="font-mono"
                style={{
                  fontSize: "12px",
                  color: theme.muted,
                  textDecoration: "none",
                }}
              >
                Online Code Compiler
              </Link>
            </li>
            <li
              aria-hidden="true"
              className="font-mono"
              style={{ fontSize: "12px", color: theme.faint }}
            >
              /
            </li>
            <li
              className="font-mono"
              style={{ fontSize: "12px", color: theme.accent }}
              aria-current="page"
            >
              {lang.h1}
            </li>
          </ol>
        </nav>

        {/* ── H1 + intro ─────────────────────────────────────────── */}
        <h1
          className="font-display"
          style={{ fontSize: "42px", marginBottom: "12px", color: theme.text }}
        >
          {lang.h1}
        </h1>
        <p
          className="font-body"
          style={{
            fontSize: "17px",
            color: theme.muted,
            marginBottom: "36px",
            maxWidth: "700px",
            lineHeight: 1.7,
          }}
        >
          {lang.executionType === "live-preview"
            ? `Write ${lang.name} code and see it rendered instantly — no installation, no configuration. CodeIQ gives you a live preview environment right in your browser.`
            : lang.executionType === "live-vm"
            ? `Write ${lang.name} and run it instantly in a Live VM — no compilation step, no setup. CodeIQ executes ${lang.name} code directly in your browser.`
            : `Write ${lang.name} code and run it online — no installation needed. CodeIQ compiles and executes your ${lang.name} program via a sandboxed server and returns the output in seconds.`}
        </p>

        {/* ── Working Editor ─────────────────────────────────────── */}
        <section aria-label={`${lang.name} code editor`}>
          <div
            style={{
              border: `1px solid ${theme.border}`,
              borderRadius: "10px",
              overflow: "hidden",
              marginBottom: "16px",
            }}
          >
            {/* Toolbar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 14px",
                backgroundColor: theme.panel,
                borderBottom: `1px solid ${theme.border}`,
              }}
            >
              <span
                className="font-mono"
                style={{ fontSize: "12px", color: theme.muted }}
              >
                main.{lang.extension}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span
                  className="font-mono"
                  style={{
                    fontSize: "11px",
                    color: theme.faint,
                    padding: "3px 8px",
                    border: `1px solid ${theme.border}`,
                    borderRadius: "4px",
                  }}
                >
                  {lang.version}
                </span>
                {!isPreview && (
                  <button
                    onClick={handleRun}
                    disabled={isRunning}
                    aria-label={isRunning ? "Running code..." : "Run code"}
                    style={{
                      padding: "6px 16px",
                      fontSize: "13px",
                      fontWeight: 500,
                      backgroundColor: theme.accent,
                      color: theme.bg,
                      border: "none",
                      borderRadius: "6px",
                      cursor: isRunning ? "default" : "pointer",
                      opacity: isRunning ? 0.6 : 1,
                    }}
                  >
                    {isRunning ? "Running…" : "▶ Run"}
                  </button>
                )}
              </div>
            </div>

            {/* Editor + Output */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: isPreview ? "340px" : "480px",
              }}
            >
              <div
                style={{
                  flex: 1,
                  minHeight: 0,
                  borderBottom: isPreview
                    ? "none"
                    : `1px solid ${theme.border}`,
                }}
              >
                <CodeEditor
                  language={lang.editorKey}
                  value={code}
                  onChange={setCode}
                />
              </div>
              {!isPreview && (
                <div style={{ height: "180px" }}>
                  <OutputPanel
                    output={output}
                    isRunning={isRunning}
                    onClear={() => setOutput([])}
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Open Full Editor CTA ─────────────────────────────── */}
        <div style={{ marginBottom: "52px" }}>
          <Link
            href="/editor"
            style={{
              display: "inline-block",
              padding: "10px 20px",
              fontSize: "14px",
              fontWeight: 500,
              border: `1px solid ${theme.border}`,
              borderRadius: "8px",
              color: theme.text,
              textDecoration: "none",
            }}
          >
            Open Full Editor — save, share & AI assistant →
          </Link>
        </div>

        {/* ── How to use ──────────────────────────────────────── */}
        <section style={{ marginBottom: "48px" }}>
          <SectionH2 theme={theme}>
            How to Run {lang.name} Code Online
          </SectionH2>
          <ol
            className="font-body"
            style={{
              paddingLeft: "20px",
              color: theme.muted,
              lineHeight: 2,
              fontSize: "15px",
            }}
          >
            <li>
              Type or paste your {lang.name} code into the editor above.
            </li>
            {isPreview ? (
              <li>
                The live preview updates automatically as you type — no
                button to press.
              </li>
            ) : (
              <li>
                Click the <strong style={{ color: theme.text }}>▶ Run</strong>{" "}
                button to compile and execute your code.
              </li>
            )}
            <li>
              {isPreview
                ? "See your rendered output in the preview panel."
                : "View the output in the panel below the editor."}
            </li>
            <li>
              Use the{" "}
              <Link
                href="/editor"
                style={{ color: theme.accent, textDecoration: "none" }}
              >
                Full Editor
              </Link>{" "}
              for save, share, and AI assistant features.
            </li>
          </ol>
        </section>

        {/* ── Code example explanation ─────────────────────────── */}
        <section style={{ marginBottom: "48px" }}>
          <SectionH2 theme={theme}>
            {lang.name} Code Example
          </SectionH2>
          <p
            className="font-body"
            style={{
              color: theme.muted,
              lineHeight: 1.75,
              fontSize: "15px",
              maxWidth: "740px",
              marginBottom: "16px",
            }}
          >
            The example above demonstrates a practical {lang.name} program.
            {lang.executionType === "live-preview"
              ? ` You can edit the code directly — the output refreshes in real time inside the preview panel.`
              : ` Click ▶ Run to execute it and see the output. You can modify the code and run it again at any time.`}
          </p>
          <div
            style={{
              padding: "14px 18px",
              backgroundColor: theme.panel,
              border: `1px solid ${theme.border}`,
              borderRadius: "8px",
              borderLeft: `3px solid ${theme.accent}`,
            }}
          >
            <p
              className="font-mono"
              style={{
                fontSize: "12px",
                color: theme.faint,
                margin: 0,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "6px",
              }}
            >
              Runtime
            </p>
            <p
              className="font-body"
              style={{ margin: 0, color: theme.text, fontSize: "14px" }}
            >
              {lang.version} · {executionLabel(lang.executionType)}
            </p>
          </div>
        </section>

        {/* ── Use cases ─────────────────────────────────────────── */}
        <section style={{ marginBottom: "48px" }}>
          <SectionH2 theme={theme}>
            Why Use CodeIQ for {lang.name}?
          </SectionH2>
          <ul
            className="font-body"
            style={{
              paddingLeft: "20px",
              color: theme.muted,
              lineHeight: 2,
              fontSize: "15px",
            }}
          >
            {lang.useCases.map((uc) => (
              <li key={uc}>{uc}</li>
            ))}
            <li>
              AI-powered code suggestions and debugging — available in the{" "}
              <Link
                href="/editor"
                style={{ color: theme.accent, textDecoration: "none" }}
              >
                full CodeIQ editor
              </Link>
            </li>
            <li>
              No installation, no account required to use the compiler
            </li>
          </ul>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────── */}
        <section style={{ marginBottom: "56px" }}>
          <SectionH2 theme={theme}>
            Frequently Asked Questions
          </SectionH2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {lang.faqItems.map((item) => (
              <div
                key={item.q}
                style={{
                  padding: "18px 20px",
                  border: `1px solid ${theme.border}`,
                  borderRadius: "8px",
                  backgroundColor: theme.panel,
                }}
              >
                <h3
                  className="font-body"
                  style={{
                    fontSize: "15px",
                    fontWeight: 600,
                    color: theme.text,
                    margin: "0 0 8px",
                  }}
                >
                  {item.q}
                </h3>
                <p
                  className="font-body"
                  style={{
                    fontSize: "14px",
                    color: theme.muted,
                    margin: 0,
                    lineHeight: 1.7,
                  }}
                >
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Explore More Compilers ─────────────────────────────── */}
        <section>
          <SectionH2 theme={theme}>Explore More CodeIQ Compilers</SectionH2>
          <p
            className="font-body"
            style={{
              color: theme.muted,
              fontSize: "14px",
              marginBottom: "20px",
            }}
          >
            CodeIQ supports 12 programming languages. Try another one:
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(170px, 1fr))",
              gap: "10px",
            }}
          >
            {relatedLanguages.map((related) => (
              <Link
                key={related.slug}
                href={`/${related.slug}`}
                className="font-body"
                style={{
                  display: "block",
                  padding: "12px 16px",
                  border: `1px solid ${theme.border}`,
                  borderRadius: "8px",
                  color: theme.muted,
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: 500,
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = theme.accent;
                  e.currentTarget.style.color = theme.accent;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = theme.border;
                  e.currentTarget.style.color = theme.muted;
                }}
              >
                {related.h1}
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}