"use client";

import { Trash2 } from "lucide-react";
import { useTheme } from "@/components/landing/ThemeContext";

interface OutputPanelProps {
  output: string[];
  isRunning: boolean;
  onClear?: () => void;
}

export default function OutputPanel({ output, isRunning, onClear }: OutputPanelProps) {
  const { theme } = useTheme();

  return (
    <div
      style={{
        backgroundColor: theme.panel,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        className="font-mono"
        style={{
          fontSize: "11px", fontWeight: 600, textTransform: "uppercase",
          letterSpacing: "0.08em", color: theme.faint,
          padding: "10px 16px", borderBottom: `1px solid ${theme.border}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{
            width: "6px", height: "6px", borderRadius: "50%",
            backgroundColor: isRunning ? "#FBBF24" : output.length > 0 ? "#34D399" : theme.faint,
          }} />
          Output
          {isRunning && <span style={{ color: "#FBBF24" }}>Running...</span>}
        </div>
        {output.length > 0 && onClear && (
          <button
            onClick={onClear}
            style={{
              display: "flex", alignItems: "center", gap: "4px",
              padding: "2px 8px", fontSize: "10px", fontWeight: 500,
              backgroundColor: "transparent", color: theme.faint,
              border: `1px solid ${theme.border}`, borderRadius: "4px",
              cursor: "pointer", transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = theme.accent; e.currentTarget.style.color = theme.text; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.faint; }}
          >
            <Trash2 size={10} /> Clear
          </button>
        )}
      </div>

      <div style={{ padding: "12px 16px", overflow: "auto", flex: 1 }}>
        {output.length === 0 && !isRunning && (
          <span className="font-mono" style={{ fontSize: "12px", color: theme.faint }}>
            Click "Run" to see output...
          </span>
        )}
        {output.map((line, i) => (
          <pre
            key={i}
            className="font-mono"
            style={{
              fontSize: "13px", lineHeight: 1.6,
              color: line.startsWith("Error") ? "#EF4444" : theme.codeText,
              margin: 0, whiteSpace: "pre-wrap",
            }}
          >
            {line}
          </pre>
        ))}
        {isRunning && (
          <span className="font-mono" style={{ fontSize: "12px", color: "#FBBF24" }}>
            ▶ Executing...
          </span>
        )}
      </div>
    </div>
  );
}
