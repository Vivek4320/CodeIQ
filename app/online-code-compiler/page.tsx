import type { Metadata } from "next";
import Link from "next/link";
import { Instrument_Serif, Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LanguageCompilerCard from "@/components/LanguageCompilerCard";
import { getLanguageRegistry } from "@/lib/languageRegistry";

const BASE_URL = "https://code-iq-ai.vercel.app";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const languages = await getLanguageRegistry();
  const names = languages.map((l) => l.name).join(", ");
  return {
    title: "Online Code Compiler & Editor – Run Code Online | CodeIQ",
    description: `Write, run and test code online with CodeIQ. Use dedicated compiler and editor pages for ${names}.`,
    keywords: ["online code compiler", "online compiler", "run code online", "code editor online", "online IDE", "browser compiler", "free online compiler", "multi-language compiler", ...languages.map((l) => `online ${l.name} compiler`)],
    alternates: { canonical: `${BASE_URL}/online-code-compiler` },
    openGraph: { title: "Online Code Compiler & Editor – Run Code Online | CodeIQ", description: `Write and run code online for ${names}.`, url: `${BASE_URL}/online-code-compiler`, siteName: "CodeIQ", type: "website" },
    twitter: { card: "summary", title: "CodeIQ — Online Code Compiler & Editor", description: `Run code online in ${languages.length} languages.` },
  };
}

const display = Instrument_Serif({ subsets: ["latin"], weight: ["400"], style: ["normal", "italic"], variable: "--font-display" });
const bodyFont = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body" });

export default async function OnlineCodeCompilerPage() {
  const compilerLanguages = await getLanguageRegistry();
  const names = compilerLanguages.map((l) => l.name).join(", ");
  const structuredData = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: BASE_URL }, { "@type": "ListItem", position: 2, name: "Online Code Compiler", item: `${BASE_URL}/online-code-compiler` }] },
    { "@context": "https://schema.org", "@type": "WebSite", name: "CodeIQ", url: BASE_URL, description: `A browser-based online code compiler and editor supporting ${names}.` },
    { "@context": "https://schema.org", "@type": "ItemList", name: "CodeIQ Online Compilers and Editors", itemListElement: compilerLanguages.map((lang, index) => ({ "@type": "ListItem", position: index + 1, name: lang.h1, url: `${BASE_URL}/${lang.slug}` })) },
  ];

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    <div className={`${display.variable} ${bodyFont.variable}`} style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <main style={{ flex: 1, padding: "40px 24px 72px", maxWidth: "1100px", margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
        <nav aria-label="Breadcrumb" style={{ marginBottom: 28 }}><ol style={{ display: "flex", gap: 6, listStyle: "none", padding: 0, margin: 0 }}><li><Link href="/" style={{ fontFamily: "monospace", fontSize: 12, color: "#888", textDecoration: "none" }}>Home</Link></li><li aria-hidden="true" style={{ color: "#555" }}>/</li><li style={{ fontFamily: "monospace", fontSize: 12, color: "var(--color-accent, #7c6bfa)" }}>Online Code Compiler</li></ol></nav>
        <h1 className="font-display" style={{ fontSize: "clamp(32px, 5vw, 52px)", marginBottom: 16, lineHeight: 1.15 }}>Online Code Compiler &amp; Editor</h1>
        <p className="font-body" style={{ fontSize: 17, lineHeight: 1.75, maxWidth: 760, marginBottom: 20, opacity: .75 }}>CodeIQ is a free, browser-based coding environment where you can write, compile and run code without installing anything. Choose a language and start coding directly in your browser.</p>
        <p className="font-body" style={{ fontSize: 17, lineHeight: 1.75, maxWidth: 760, marginBottom: 48, opacity: .75 }}>Choose a dedicated page for {names}. Each page explains its runtime, includes a practical example, and links to the other CodeIQ language tools.</p>
        <section aria-labelledby="languages-heading"><h2 className="font-display" id="languages-heading" style={{ fontSize: 26, marginBottom: 20 }}>Supported Languages</h2><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12, marginBottom: 60 }}>{compilerLanguages.map((lang) => <LanguageCompilerCard key={lang.slug} slug={lang.slug} h1={lang.h1} version={lang.version} />)}</div></section>
        <section aria-labelledby="why-codeiq-heading" style={{ marginBottom: 60 }}><h2 className="font-display" id="why-codeiq-heading" style={{ fontSize: 26, marginBottom: 20 }}>Why Use an Online Compiler?</h2><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>{[
          { title: "No installation needed", body: "Open a browser and start coding. No IDE download, compiler setup, or PATH configuration is required." },
          { title: "Fast browser workflow", body: "Write code, run it, and inspect the result from the same browser-based workspace." },
          { title: `${compilerLanguages.length} languages in one place`, body: `Switch between ${names}.` },
          { title: "AI assistant included", body: "The full CodeIQ editor includes an AI coding assistant for debugging, explanations, and code suggestions." },
        ].map(card => <div key={card.title} style={{ padding: 20, border: "1px solid rgba(255,255,255,.07)", borderRadius: 10, background: "rgba(255,255,255,.02)" }}><h3 className="font-body" style={{ fontSize: 15, fontWeight: 600, marginBottom: 8, opacity: .9 }}>{card.title}</h3><p className="font-body" style={{ fontSize: 14, lineHeight: 1.7, opacity: .55, margin: 0 }}>{card.body}</p></div>)}</div></section>
        <section aria-labelledby="cta-heading"><h2 className="font-display" id="cta-heading" style={{ fontSize: 26, marginBottom: 14 }}>Start Coding Now</h2><p className="font-body" style={{ fontSize: 15, opacity: .6, marginBottom: 20 }}>Pick a language above to open its dedicated compiler or editor page, or go straight to the full editor.</p><Link href="/editor" style={{ display: "inline-block", padding: "12px 28px", fontSize: 15, fontWeight: 600, background: "#7c6bfa", color: "#fff", borderRadius: 8, textDecoration: "none" }}>Open Full Editor →</Link></section>
      </main>
      <Footer />
    </div>
  </>;
}
