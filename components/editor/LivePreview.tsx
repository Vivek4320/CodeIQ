"use client";

import { useTheme } from "@/components/landing/ThemeContext";

interface LivePreviewProps {
  htmlCode: string;
  cssCode: string;
}

export default function LivePreview({ htmlCode, cssCode }: LivePreviewProps) {
  const { theme } = useTheme();

  const fullHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    padding: 16px;
  }
  ${cssCode}
</style>
</head>
<body>
${htmlCode}
</body>
</html>`;

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.panel,
      }}
    >
      {/* Preview Header */}
      <div
        className="font-mono"
        style={{
          fontSize: "11px",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: theme.faint,
          padding: "10px 16px",
          borderBottom: `1px solid ${theme.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: "#34D399",
            }}
          />
          Live Preview
        </div>
        <span style={{ fontSize: "10px", color: theme.faint }}>
          Auto-refreshes
        </span>
      </div>

      {/* Preview iframe */}
      <div style={{ flex: 1, padding: "8px", overflow: "hidden" }}>
        <iframe
          srcDoc={fullHtml}
          title="Live Preview"
          style={{
            width: "100%",
            height: "100%",
            border: `1px solid ${theme.border}`,
            borderRadius: "6px",
            backgroundColor: "#ffffff",
          }}
        />
      </div>
    </div>
  );
}
