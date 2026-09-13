"use client";

import { useEffect, useState } from "react";
import { Sparkles, Zap, GitBranch, Share2, Terminal, Shield, Globe, Cpu, ArrowLeft } from "lucide-react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import { useTheme } from "@/components/landing/ThemeContext";
import AnimateIn from "@/components/landing/AnimateIn";

interface RegistryLanguage {
  id: string;
  name: string;
  version?: string;
  executionType?: string;
}

const STATIC_FEATURES = [
  { icon: GitBranch, title: "Run History", desc: "Review your previous executions from the editor. Projects are saved to your account when you click Save.", details: ["Execution history", "Review previous runs", "Project saves on demand", "Accessible from the editor"] },
  { icon: Share2, title: "Shareable Programs", desc: "Generate a shareable link for any code snippet. Anyone with the link can view and run your code — output included.", details: ["Live output sharing", "No account needed to view", "Permanent links", "Works on any device"] },
  { icon: Shield, title: "Secure Sandboxing", desc: "JavaScript and TypeScript run in an isolated Node.js VM sandbox. Other languages execute through the configured execution service with no host access.", details: ["Isolated VM execution", "Configurable timeout", "No data persistence", "Safe evaluation"] },
  { icon: Globe, title: "7 Unique Themes", desc: "Switch between CodeIQ's handcrafted themes with one click. Your selected theme persists across sessions.", details: ["7 handcrafted themes", "Instant switching", "Theme selector in editor", "Persists across sessions"] },
  { icon: Cpu, title: "Lightweight & Fast", desc: "Built with Next.js 16, React 19, and CodeMirror 6. The editor loads fast and stays responsive.", details: ["Next.js 16 + React 19", "CodeMirror 6 editor", "Minimal memory usage", "Optimized rendering"] },
];

export default function FeaturesPage() {
  const { theme } = useTheme();
  const [languages, setLanguages] = useState<RegistryLanguage[]>([]);

  useEffect(() => {
    fetch("/api/languages", { cache: "no-store" })
      .then((res) => res.ok ? res.json() : null)
      .then((data) => setLanguages(Array.isArray(data?.languages) ? data.languages : []))
      .catch(() => setLanguages([]));
  }, []);

  const languageCount = languages.length || 12;
  const languageNames = languages.length
    ? languages.map((language) => language.name).join(", ")
    : "JavaScript, TypeScript, Python, C, C++, Java, Go, Rust, Ruby, Haskell, HTML, or CSS";
  const languageGroups = languages.length
    ? [
        languages.slice(0, 3).map((l) => l.name).join(", "),
        languages.slice(3, 6).map((l) => l.name).join(", "),
        languages.slice(6, 9).map((l) => l.name).join(", "),
        languages.slice(9).map((l) => l.name).join(", "),
      ].filter(Boolean)
    : ["JavaScript & TypeScript", "Python, C & C++", "Java, Go & Rust", "Ruby, Haskell, HTML & CSS"];

  const features = [
    {
      icon: Sparkles,
      title: "AI Code Completion",
      desc: `Real-time AI-powered suggestions via KeyKing SDK with automatic provider routing. Completions adapt to your code context across all ${languageCount} supported languages.`,
      details: ["Powered by KeyKing AI routing", "Context-aware suggestions", `Works across all ${languageCount} languages`, "Instant inline completions"],
    },
    {
      icon: Zap,
      title: "Instant Execution",
      desc: `Run code in ${languageCount} languages the moment you hit Run. Each language uses its configured execution mode from the central registry.`,
      details: [`${languageCount} languages supported`, "No setup required", "Real-time results", "Per-language execution routing"],
    },
    ...STATIC_FEATURES.slice(0, 2),
    {
      icon: Terminal,
      title: `${languageCount} Languages`,
      desc: `Write in ${languageNames} — all from one editor. The list is loaded from CodeIQ's central language registry, so newly added active languages appear automatically.`,
      details: languageGroups,
    },
    ...STATIC_FEATURES.slice(2),
  ];

  return (
    <PageLayout>
      <div style={{ maxWidth: "1040px", margin: "0 auto", padding: "24px 24px 0" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 14px", fontSize: "12px", fontWeight: 500, color: theme.muted, backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "8px", textDecoration: "none" }}>
          <ArrowLeft size={14} /> Home
        </Link>
      </div>

      <section style={{ maxWidth: "720px", margin: "0 auto", padding: "80px 24px 60px", textAlign: "center" }}>
        <div className="font-mono" style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: theme.accent, marginBottom: "20px" }}>Features</div>
        <h1 className="font-display" style={{ fontSize: "clamp(36px, 6vw, 56px)", lineHeight: 1.1, fontWeight: 400, marginBottom: "20px" }}>
          Everything you need to<br /><span style={{ fontStyle: "italic" }}>write, run, and share.</span>
        </h1>
        <p className="font-body" style={{ fontSize: "17px", color: theme.muted, maxWidth: "500px", margin: "0 auto", lineHeight: 1.6 }}>
          One editor, multiple languages, and an assistant that&apos;s actually paying attention to what you&apos;re building.
        </p>
      </section>

      <section style={{ maxWidth: "1040px", margin: "0 auto", padding: "40px 24px 100px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
          {features.map(({ icon: Icon, title, desc, details }, index) => (
            <AnimateIn key={title} type="scaleUp" delay={index * 0.08}>
              <div style={{ border: `1px solid ${theme.border}`, borderRadius: "12px", backgroundColor: theme.panel, padding: "28px", transition: "border-color 0.2s ease, transform 0.25s ease, box-shadow 0.25s ease" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = theme.accent; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 8px 30px -8px ${theme.accent}20`; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: `${theme.accent}12`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "18px" }}><Icon size={20} style={{ color: theme.accent }} /></div>
                <h3 className="font-body" style={{ fontSize: "18px", fontWeight: 600, marginBottom: "10px" }}>{title}</h3>
                <p className="font-body" style={{ fontSize: "14px", color: theme.muted, lineHeight: 1.65, marginBottom: "18px" }}>{desc}</p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                  {details.map((item) => <li key={item} className="font-mono" style={{ fontSize: "12px", color: theme.faint, display: "flex", alignItems: "center", gap: "8px" }}><span style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: theme.accent, flexShrink: 0 }} />{item}</li>)}
                </ul>
              </div>
            </AnimateIn>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
