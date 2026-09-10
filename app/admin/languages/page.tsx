"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/components/landing/ThemeContext";
import { useIsMobile } from "@/hooks/useMediaQuery";
import LanguageLogo from "@/components/LanguageLogo";

export default function LanguagesPage() {
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const [languages, setLanguages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/admin/languages").then((response) => { if (!response.ok) throw new Error(); return response.json(); }).then((data) => setLanguages(data.languages || [])).catch(() => setError(true)).finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ color: theme.faint }}>Loading...</p>;
  if (error) return <p style={{ color: "#EF4444" }}>Unable to load data. Please try again.</p>;

  return <div>
    <h1 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "8px" }}>Languages</h1>
    <p style={{ color: theme.faint, fontSize: "13px", marginBottom: "22px" }}>Supported languages and execution providers used by CodeIQ.</p>
    {languages.length === 0 ? <p style={{ color: theme.faint }}>No data available yet.</p> : <div style={{ border: `1px solid ${theme.border}`, borderRadius: "8px", overflow: "hidden", overflowX: "auto" }}><table style={{ minWidth: isMobile ? "760px" : "100%", width: "100%", borderCollapse: "collapse", fontSize: "13px" }}><thead><tr style={{ background: theme.panel, borderBottom: `1px solid ${theme.border}` }}>{["Language", "Provider", "Language ID", "Executions", "Success rate", "Status"].map((heading) => <th key={heading} style={{ padding: "12px", textAlign: "left", color: theme.faint, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{heading}</th>)}</tr></thead><tbody>{languages.map((language) => <tr key={language.slug} style={{ borderBottom: `1px solid ${theme.border}` }}><td style={{ padding: "12px", display: "flex", alignItems: "center", gap: "9px", fontWeight: 500 }}><LanguageLogo language={language.slug} size={25} />{language.name}</td><td style={{ padding: "12px", color: theme.faint }}>{language.executionType === "live-vm" ? "Live VM" : language.executionType === "live-preview" ? "Live preview" : "Judge0"}</td><td style={{ padding: "12px", color: theme.faint, fontFamily: "monospace" }}>{language.languageId ?? "Not applicable"}</td><td style={{ padding: "12px", color: theme.faint }}>{language.executionCount}</td><td style={{ padding: "12px", color: theme.faint }}>{language.successRate === null ? "Unavailable" : `${language.successRate}%`}</td><td style={{ padding: "12px", color: "#34D399" }}>Available</td></tr>)}</tbody></table></div>}
  </div>;
}
