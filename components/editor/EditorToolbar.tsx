"use client";

import { Play } from "lucide-react";
import { useTheme } from "@/components/landing/ThemeContext";
import { useIsMobile } from "@/hooks/useMediaQuery";
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
  const isMobile = useIsMobile();
  const isWebLanguage = language === "html" || language === "css";
  const runLabel = isWebLanguage ? "Preview" : "Run";

  return (
    <div
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: isMobile ? "6px 10px" : "10px 16px",
        backgroundColor: theme.panel, borderBottom: `1px solid ${theme.border}`,
        borderRadius: "8px 8px 0 0",
        gap: "8px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0, flex: 1 }}>
        <LanguageSelector language={language} onSelect={onLanguageChange} />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
        <button onClick={onRun} disabled={isRunning} title="Run code" aria-label={isRunning ? "Running code" : runLabel}
          style={{ display: "flex", alignItems: "center", gap: isMobile ? "4px" : "6px", padding: isMobile ? "5px 12px" : "6px 16px", fontSize: isMobile ? "11px" : "12px", fontWeight: 600, backgroundColor: isRunning ? theme.faint : theme.accent, color: isRunning ? theme.panel : theme.bg, border: "none", borderRadius: "6px", cursor: isRunning ? "not-allowed" : "pointer", transition: "all 0.2s ease" }}
          onMouseEnter={(e) => { if (!isRunning) e.currentTarget.style.opacity = "0.85"; }}
          onMouseLeave={(e) => { if (!isRunning) e.currentTarget.style.opacity = "1"; }}>
          <Play size={isMobile ? 12 : 14} fill="currentColor" /> {isRunning ? "Running..." : runLabel}
        </button>
      </div>
    </div>
  );
}
