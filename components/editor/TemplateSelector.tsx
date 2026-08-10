"use client";

import { useState } from "react";
import { X, Search, Code2, FileCode, Layout, Database, Server, Cpu, Braces } from "lucide-react";
import { useTheme } from "@/components/landing/ThemeContext";
import { templates, type Template } from "@/data/templates";

interface TemplateSelectorProps {
  language: string;
  onSelect: (code: string, language: string) => void;
  onClose: () => void;
}

const CATEGORY_ICONS: Record<string, any> = {
  Basics: Braces,
  API: Server,
  Async: Cpu,
  OOP: Code2,
  Advanced: Code2,
  IO: Database,
  Data: Database,
  Collections: Database,
  STL: Layout,
  Concurrency: Cpu,
  "Data Structures": Layout,
  UI: Layout,
  Layout: Layout,
};

export default function TemplateSelector({ language, onSelect, onClose }: TemplateSelectorProps) {
  const { theme } = useTheme();
  const [search, setSearch] = useState("");
  const [selectedLang, setSelectedLang] = useState(language);

  const filtered = templates.filter((t) => {
    const matchLang = t.language === selectedLang;
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
    return matchLang && matchSearch;
  });

  const languages = [...new Set(templates.map((t) => t.language))];

  const handleSelect = (template: Template) => {
    onSelect(template.code, template.language);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          width: "90%", maxWidth: "520px", maxHeight: "80vh",
          backgroundColor: theme.panel, border: `1px solid ${theme.border}`,
          borderRadius: "16px", overflow: "hidden",
          display: "flex", flexDirection: "column",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: `${theme.accent}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FileCode size={16} style={{ color: theme.accent }} />
            </div>
            <div>
              <div style={{ fontSize: "15px", fontWeight: 600, color: theme.text }}>Code Templates</div>
              <div style={{ fontSize: "11px", color: theme.muted }}>{templates.length} snippets across {languages.length} languages</div>
            </div>
          </div>
          <button onClick={onClose} style={{ width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "transparent", border: "none", cursor: "pointer", color: theme.muted, borderRadius: "6px" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.faint; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}>
            <X size={16} />
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: "12px 20px 8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px", backgroundColor: theme.bg, border: `1px solid ${theme.border}`, borderRadius: "8px" }}>
            <Search size={14} style={{ color: theme.muted, flexShrink: 0 }} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search templates..."
              style={{ flex: 1, background: "none", border: "none", outline: "none", color: theme.text, fontSize: "13px", fontFamily: "inherit" }} />
          </div>
        </div>

        {/* Language tabs */}
        <div style={{ padding: "8px 20px", display: "flex", gap: "6px", overflowX: "auto", flexShrink: 0 }}>
          {languages.map((lang) => (
            <button key={lang} onClick={() => setSelectedLang(lang)}
              style={{
                padding: "5px 12px", fontSize: "11px", fontWeight: 600, whiteSpace: "nowrap",
                backgroundColor: selectedLang === lang ? theme.accent : "transparent",
                color: selectedLang === lang ? theme.bg : theme.muted,
                border: `1px solid ${selectedLang === lang ? theme.accent : theme.border}`,
                borderRadius: "16px", cursor: "pointer", transition: "all 0.15s ease",
              }}>
              {lang}
            </button>
          ))}
        </div>

        {/* Templates list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 20px 16px" }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px", color: theme.muted, fontSize: "13px" }}>
              No templates found
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {filtered.map((template) => {
                const Icon = CATEGORY_ICONS[template.category] || Code2;
                return (
                  <button key={template.id} onClick={() => handleSelect(template)}
                    style={{
                      display: "flex", alignItems: "flex-start", gap: "12px",
                      padding: "12px", backgroundColor: theme.bg,
                      border: `1px solid ${theme.border}`, borderRadius: "10px",
                      cursor: "pointer", textAlign: "left", width: "100%",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = theme.accent; e.currentTarget.style.transform = "translateY(-1px)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.transform = "none"; }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: `${theme.accent}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px" }}>
                      <Icon size={14} style={{ color: theme.accent }} />
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: theme.text, marginBottom: "2px" }}>{template.name}</div>
                      <div style={{ fontSize: "11px", color: theme.muted, lineHeight: 1.4 }}>{template.description}</div>
                      <div style={{ display: "inline-block", marginTop: "4px", padding: "2px 6px", fontSize: "9px", fontWeight: 600, color: theme.accent, backgroundColor: `${theme.accent}10`, borderRadius: "4px" }}>
                        {template.category}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
