"use client";

import { Play } from "lucide-react";
import { useTheme } from "@/components/landing/ThemeContext";
import LanguageSelector from "./LanguageSelector";

interface EditorToolbarProps {
  language: string;
  onLanguageChange: (lang: string) => void;
  onRun: () => void;
  isRunning: boolean;
  saveStatus?: "idle" | "saving" | "saved";
}

export default function EditorToolbar({ language, onLanguageChange, onRun, isRunning, saveStatus }: EditorToolbarProps) {
  const { theme } = useTheme();

  return (
    <div
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 16px",
        backgroundColor: theme.panel, borderBottom: `1px solid ${theme.border}`,
        borderRadius: "8px 8px 0 0",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <LanguageSelector language={language} onSelect={onLanguageChange} />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {/* Save status indicator */}
        {saveStatus && saveStatus !== "idle" && (
          <span className="font-mono" style={{ fontSize: "11px", color: saveStatus === "saving" ? "#FBBF24" : "#34D399", display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: saveStatus === "saving" ? "#FBBF24" : "#34D399" }} />
            {saveStatus === "saving" ? "Saving..." : "Saved"}
          </span>
        )}

        {/* Run */}
        <button onClick={onRun} disabled={isRunning} title="Run code"
          style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 16px", fontSize: "12px", fontWeight: 600, backgroundColor: isRunning ? theme.faint : theme.accent, color: isRunning ? theme.panel : theme.bg, border: "none", borderRadius: "6px", cursor: isRunning ? "not-allowed" : "pointer", transition: "all 0.2s ease" }}
          onMouseEnter={(e) => { if (!isRunning) e.currentTarget.style.opacity = "0.85"; }}
          onMouseLeave={(e) => { if (!isRunning) e.currentTarget.style.opacity = "1"; }}>
          <Play size={14} fill="currentColor" /> {isRunning ? "Running..." : "Run"}
        </button>
      </div>
    </div>
  );
}
