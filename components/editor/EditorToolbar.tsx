"use client";

import { Play, BookOpen } from "lucide-react";
import { useTheme } from "@/components/landing/ThemeContext";
import { useIsMobile } from "@/hooks/useMediaQuery";
import LanguageSelector from "./LanguageSelector";

interface EditorToolbarProps {
  language: string;
  onLanguageChange: (lang: string) => void;
  onRun: () => void;
  isRunning: boolean;
  saveStatus?: "idle" | "saving" | "saved";
  onTemplates?: () => void;
}

export default function EditorToolbar({ language, onLanguageChange, onRun, isRunning, saveStatus, onTemplates }: EditorToolbarProps) {
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
        {/* Templates button */}
        {onTemplates && (
          <button onClick={onTemplates} title="Code Templates" aria-label="Open code templates"
            style={{ display: "flex", alignItems: "center", gap: "4px", padding: isMobile ? "5px 10px" : "6px 12px",
              fontSize: isMobile ? "11px" : "12px", fontWeight: 500,
              backgroundColor: "transparent", color: theme.muted,
              border: `1px solid ${theme.border}`, borderRadius: "6px",
              cursor: "pointer", transition: "all 0.15s ease" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = theme.accent; e.currentTarget.style.color = theme.text; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.muted; }}>
            <BookOpen size={isMobile ? 12 : 13} />
            {!isMobile && "Templates"}
          </button>
        )}

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
