"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ExternalLink, Copy, Check, Code2, Eye, Code } from "lucide-react";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import { useTheme } from "@/components/landing/ThemeContext";

const display = Instrument_Serif({ subsets: ["latin"], weight: ["400"], style: ["normal", "italic"], variable: "--font-display" });
const bodyFont = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

export default function SharePage() {
  const { theme } = useTheme();
  const params = useParams();
  const shareId = params.id as string;
  const [shared, setShared] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview");

  useEffect(() => {
    if (!shareId) return;
    fetch(`/api/share?id=${shareId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.shared) setShared(data.shared);
      })
      .finally(() => setLoading(false));
  }, [shareId]);

  const isWeb = shared?.language === "html" || shared?.language === "css";

  const getCode = (): string => {
    if (!shared?.code) return "";
    if (isWeb) {
      try {
        const parsed = JSON.parse(shared.code);
        return `<!-- HTML -->\n${parsed.html || ""}\n\n/* CSS */\n${parsed.css || ""}`;
      } catch {
        return shared.code;
      }
    }
    return shared.code;
  };

  const getPreviewHtml = (): string => {
    if (!shared?.code) return "";
    try {
      const parsed = JSON.parse(shared.code);
      const htmlCode = parsed.format === "codeiq-web" ? (parsed.html?.code || "") : (parsed.html || "");
      const cssCode = parsed.format === "codeiq-web" ? (parsed.css?.code || "") : (parsed.css || "");
      return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 16px; }
  ${cssCode}
</style>
</head>
<body>
${htmlCode}
</body>
</html>`;
    } catch {
      return "";
    }
  };

  const copyCode = () => {
    const code = getCode();
    if (code) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`${display.variable} ${bodyFont.variable} ${mono.variable}`}
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: theme.bg, color: theme.text }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 24px", borderBottom: `1px solid ${theme.border}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Code2 size={20} style={{ color: theme.accent }} />
          <span className="font-display" style={{ fontSize: "20px", fontStyle: "italic" }}>CodeIQ</span>
          <span className="font-mono" style={{ fontSize: "11px", color: theme.faint, padding: "2px 8px", borderRadius: "4px", backgroundColor: `${theme.accent}15` }}>
            Shared
          </span>
        </div>
        {isWeb && shared && (
          <div style={{ display: "flex", gap: "4px" }}>
            <button
              onClick={() => setViewMode("preview")}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "6px 12px", fontSize: "12px", fontWeight: 500,
                backgroundColor: viewMode === "preview" ? `${theme.accent}15` : "transparent",
                color: viewMode === "preview" ? theme.accent : theme.muted,
                border: `1px solid ${viewMode === "preview" ? theme.accent : theme.border}`,
                borderRadius: "6px", cursor: "pointer",
              }}
            >
              <Eye size={14} /> Preview
            </button>
            <button
              onClick={() => setViewMode("code")}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "6px 12px", fontSize: "12px", fontWeight: 500,
                backgroundColor: viewMode === "code" ? `${theme.accent}15` : "transparent",
                color: viewMode === "code" ? theme.accent : theme.muted,
                border: `1px solid ${viewMode === "code" ? theme.accent : theme.border}`,
                borderRadius: "6px", cursor: "pointer",
              }}
            >
              <Code size={14} /> Code
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, maxWidth: isWeb ? "1200px" : "900px", margin: "0 auto", padding: "40px 24px 80px", width: "100%" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px" }}>
            <span className="font-mono" style={{ color: theme.faint }}>Loading shared code...</span>
          </div>
        ) : !shared ? (
          <div style={{ textAlign: "center", padding: "60px" }}>
            <h2 className="font-display" style={{ fontSize: "24px", marginBottom: "12px" }}>Code not found</h2>
            <p className="font-body" style={{ color: theme.muted, fontSize: "14px" }}>
              This share link may have expired or been removed.
            </p>
          </div>
        ) : isWeb && viewMode === "preview" ? (
          /* Preview mode for HTML/CSS */
          <div style={{ border: `1px solid ${theme.border}`, borderRadius: "10px", overflow: "hidden" }}>
            <div style={{ padding: "10px 16px", backgroundColor: theme.panel, borderBottom: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#34D399" }} />
                <span className="font-mono" style={{ fontSize: "12px", color: theme.faint }}>Preview</span>
              </div>
              <button
                onClick={copyLink}
                style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  padding: "4px 10px", fontSize: "12px",
                  backgroundColor: "transparent", color: theme.muted,
                  border: `1px solid ${theme.border}`, borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy Link</>}
              </button>
            </div>
            <iframe
              srcDoc={getPreviewHtml()}
              title="Preview"
              style={{ width: "100%", height: "500px", border: "none", backgroundColor: "#fff" }}
            />
          </div>
        ) : (
          /* Code view */
          <>
            <div style={{ marginBottom: "24px" }}>
              <h1 className="font-display" style={{ fontSize: "28px", fontWeight: 400, marginBottom: "8px" }}>
                {shared.project_name}
              </h1>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span className="font-mono" style={{ fontSize: "12px", padding: "4px 10px", borderRadius: "20px", backgroundColor: `${theme.accent}15`, color: theme.accent }}>
                  {shared.language}
                </span>
                <span className="font-mono" style={{ fontSize: "12px", color: theme.faint }}>
                  {shared.views} views
                </span>
              </div>
            </div>

            <div style={{ border: `1px solid ${theme.border}`, borderRadius: "10px", overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", backgroundColor: theme.panel, borderBottom: `1px solid ${theme.border}` }}>
                <span className="font-mono" style={{ fontSize: "12px", color: theme.faint }}>source code</span>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button onClick={copyCode}
                    style={{ display: "flex", alignItems: "center", gap: "6px", padding: "4px 10px", fontSize: "12px", backgroundColor: "transparent", color: theme.muted, border: `1px solid ${theme.border}`, borderRadius: "4px", cursor: "pointer" }}>
                    {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
                  </button>
                </div>
              </div>
              <pre className="font-mono" style={{ padding: "20px", margin: 0, fontSize: "13px", lineHeight: 1.7, color: theme.codeText, backgroundColor: theme.panel, overflow: "auto", whiteSpace: "pre-wrap" }}>
                {getCode()}
              </pre>
            </div>
          </>
        )}

        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <Link href="/signup" className="font-body"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 24px", fontSize: "14px", fontWeight: 500, backgroundColor: theme.accent, color: theme.bg, borderRadius: "8px", textDecoration: "none" }}>
            Try CodeIQ yourself <ExternalLink size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
