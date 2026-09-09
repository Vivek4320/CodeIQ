import type { Metadata } from "next";
import Link from "next/link";
import { Instrument_Serif, Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LanguageCompilerCard from "@/components/LanguageCompilerCard";
import { compilerLanguages } from "@/lib/compilerLanguages";

const BASE_URL = "https://code-iq-ai.vercel.app";

export const metadata: Metadata = {
  title: "Online Code Compiler & Editor – Run Code Online | CodeIQ",
  description:
    "Write, run and test code online with CodeIQ. Use an online compiler and editor for Python, C, C++, Java, JavaScript, TypeScript, Go, Rust, Ruby, Haskell, HTML, CSS and more.",
  keywords: [
    "online code compiler",
    "online compiler",
    "run code online",
    "code editor online",
    "online IDE",
    "browser compiler",
    "free online compiler",
    "multi-language compiler",
  ],
  alternates: {
    canonical: `${BASE_URL}/online-code-compiler`,
  },
  openGraph: {
    title: "Online Code Compiler & Editor – Run Code Online | CodeIQ",
    description:
      "Write, run and test code online with CodeIQ. Supports Python, C, C++, Java, JavaScript, TypeScript, Go, Rust, Ruby, Haskell, HTML and CSS.",
    url: `${BASE_URL}/online-code-compiler`,
    siteName: "CodeIQ",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Online Code Compiler & Editor | CodeIQ",
    description:
      "Run code online in 12 languages — Python, Java, C++, JavaScript, Go, Rust and more. Free browser-based compiler.",
  },
};

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

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Online Code Compiler",
        item: `${BASE_URL}/online-code-compiler`,
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "CodeIQ",
    url: BASE_URL,
    description:
      "A browser-based online code compiler and editor supporting Python, C, C++, Java, JavaScript, TypeScript, Go, Rust, Ruby, Haskell, HTML and CSS.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${BASE_URL}/editor`,
    },
  },
];

export default function OnlineCodeCompilerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div
        className={`${display.variable} ${bodyFont.variable}`}
        style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        <Navbar />

        <main
          style={{
            flex: 1,
            padding: "40px 24px 72px",
            maxWidth: "1100px",
            margin: "0 auto",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" style={{ marginBottom: "28px" }}>
            <ol
              style={{
                display: "flex",
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
                  style={{
                    fontFamily: "var(--font-geist-mono, monospace)",
                    fontSize: "12px",
                    color: "var(--color-muted, #888)",
                    textDecoration: "none",
                  }}
                >
                  Home
                </Link>
              </li>
              <li
                aria-hidden="true"
                style={{
                  fontFamily: "var(--font-geist-mono, monospace)",
                  fontSize: "12px",
                  color: "var(--color-faint, #555)",
                }}
              >
                /
              </li>
              <li
                style={{
                  fontFamily: "var(--font-geist-mono, monospace)",
                  fontSize: "12px",
                  color: "var(--color-accent, #7c6bfa)",
                }}
                aria-current="page"
              >
                Online Code Compiler
              </li>
            </ol>
          </nav>

          {/* H1 */}
          <h1
            className="font-display"
            style={{
              fontSize: "clamp(32px, 5vw, 52px)",
              marginBottom: "16px",
              lineHeight: 1.15,
            }}
          >
            Online Code Compiler &amp; Editor
          </h1>

          {/* Intro */}
          <p
            className="font-body"
            style={{
              fontSize: "17px",
              lineHeight: 1.75,
              maxWidth: "720px",
              marginBottom: "20px",
              opacity: 0.75,
            }}
          >
            CodeIQ is a free, browser-based coding environment where you can
            write, compile and run code without installing anything. Whether
            you&apos;re a student learning your first programming language, a
            developer testing a quick snippet, or an interviewer checking a
            candidate&apos;s solution — CodeIQ gives you a clean, fast editor
            ready to go in seconds.
          </p>
          <p
            className="font-body"
            style={{
              fontSize: "17px",
              lineHeight: 1.75,
              maxWidth: "720px",
              marginBottom: "48px",
              opacity: 0.75,
            }}
          >
            CodeIQ supports 12 programming languages: Python, C, C++, Java,
            JavaScript, TypeScript, Go, Rust, Ruby, Haskell, HTML and CSS.
            Each language has a dedicated editor with syntax highlighting, a
            version badge, and instant execution — backed by the Judge0
            execution engine for compiled languages and a Live VM for
            JavaScript and TypeScript.
          </p>

          {/* Language grid */}
          <section aria-labelledby="languages-heading">
            <h2
              className="font-display"
              id="languages-heading"
              style={{ fontSize: "26px", marginBottom: "20px" }}
            >
              Supported Languages
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "12px",
                marginBottom: "60px",
              }}
            >
              {compilerLanguages.map((lang) => (
                <LanguageCompilerCard
                  key={lang.slug}
                  slug={lang.slug}
                  h1={lang.h1}
                  version={lang.version}
                />
              ))}
            </div>
          </section>

          {/* Why CodeIQ */}
          <section aria-labelledby="why-codeiq-heading" style={{ marginBottom: "60px" }}>
            <h2
              className="font-display"
              id="why-codeiq-heading"
              style={{ fontSize: "26px", marginBottom: "20px" }}
            >
              Why Use an Online Compiler?
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "16px",
              }}
            >
              {[
                {
                  title: "No installation needed",
                  body: "Open a browser, go to CodeIQ, and start coding. No IDE download, no compiler setup, no PATH configuration.",
                },
                {
                  title: "Instant execution",
                  body: "Code is compiled or evaluated immediately. Results appear in the output panel within seconds.",
                },
                {
                  title: "Multiple languages in one place",
                  body: "Switch between Python, C++, Java, JavaScript and more without switching tools or environments.",
                },
                {
                  title: "AI assistant included",
                  body: "The full CodeIQ editor includes an AI coding assistant to help you debug, explain code, and suggest improvements.",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  style={{
                    padding: "20px",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "10px",
                    background: "rgba(255,255,255,0.02)",
                  }}
                >
                  <h3
                    className="font-body"
                    style={{
                      fontSize: "15px",
                      fontWeight: 600,
                      marginBottom: "8px",
                      opacity: 0.9,
                    }}
                  >
                    {card.title}
                  </h3>
                  <p
                    className="font-body"
                    style={{
                      fontSize: "14px",
                      lineHeight: 1.7,
                      opacity: 0.55,
                      margin: 0,
                    }}
                  >
                    {card.body}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section aria-labelledby="cta-heading" style={{ marginBottom: "16px" }}>
            <h2
              className="font-display"
              id="cta-heading"
              style={{ fontSize: "26px", marginBottom: "14px" }}
            >
              Start Coding Now
            </h2>
            <p
              className="font-body"
              style={{ fontSize: "15px", opacity: 0.6, marginBottom: "20px" }}
            >
              Pick a language above to open its dedicated compiler page, or go
              straight to the full editor with all features.
            </p>
            <Link
              href="/editor"
              style={{
                display: "inline-block",
                padding: "12px 28px",
                fontSize: "15px",
                fontWeight: 600,
                background: "#7c6bfa",
                color: "#fff",
                borderRadius: "8px",
                textDecoration: "none",
              }}
            >
              Open Full Editor →
            </Link>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
