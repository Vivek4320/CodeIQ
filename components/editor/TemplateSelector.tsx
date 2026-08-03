"use client";

import { useState } from "react";
import { useTheme } from "@/components/landing/ThemeContext";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { FileCode, X, Search, BookOpen, Zap, GitBranch } from "lucide-react";
import { TEMPLATES, type CodeTemplate } from "@/data/templates";

const CATEGORY_ICONS: Record<string, typeof FileCode> = {
  Basics: FileCode,
  Algorithms: GitBranch,
  "Data Structures": BookOpen,
  OOP: BookOpen,
  Web: Zap,
  Concurrency: Zap,
};

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: "#34D399",
  Intermediate: "#FBBF24",
  Advanced: "#EF4444",
};

interface TemplateSelectorProps {
  language: string;
  onSelect: (code: string) => void;
  onClose: () => void;
}

export default function TemplateSelector({ language, onSelect, onClose }: TemplateSelectorProps) {
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredTemplates = TEMPLATES.filter((t) => {
    const matchesLang = t.language === language;
    const matchesSearch = search === "" ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.tags.some(tag => tag.includes(search.toLowerCase()));
    const matchesCategory = !selectedCategory || t.category === selectedCategory;
    return matchesLang && matchesSearch && matchesCategory;
  });

  const categories = [...new Set(TEMPLATES.filter(t => t.language === language).map(t => t.category))];

  const handleSelect = (template: CodeTemplate) => {
    onSelect(template.code);
    onClose();
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      display: "flex", alignItems: isMobile ? "flex-end" : "center",
      justifyContent: "center",
      backgroundColor: "rgba(0,0,0,0.6)",
      animation: "fadeIn 0.2s ease",
    }} onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: isMobile ? "100%" : "600px",
          maxHeight: isMobile ? "85vh" : "80vh",
          backgroundColor: theme.panel,
          border: `1px solid ${theme.border}`,
          borderRadius: isMobile ? "16px 16px 0 0" : "16px",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
          animation: isMobile ? "slideUp 0.3s ease" : "fadeIn 0.2s ease",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 20px", borderBottom: `1px solid ${theme.border}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <BookOpen size={18} style={{ color: theme.accent }} />
            <span className="font-body" style={{ fontSize: "15px", fontWeight: 600, color: theme.text }}>
              Code Templates
            </span>
            <span className="font-mono" style={{ fontSize: "11px", color: theme.faint, padding: "2px 8px", borderRadius: "4px", backgroundColor: `${theme.accent}10` }}>
              {language}
            </span>
          </div>
          <button onClick={onClose} style={{
            width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center",
            backgroundColor: "transparent", border: "none", cursor: "pointer", color: theme.faint, borderRadius: "6px",
          }}>
            <X size={16} />
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: "12px 20px", borderBottom: `1px solid ${theme.border}` }}>
          <div style={{ position: "relative" }}>
            <Search size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: theme.faint }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search templates..."
              className="font-body"
              style={{
                width: "100%", padding: "8px 12px 8px 36px", fontSize: "13px",
                backgroundColor: theme.bg, color: theme.text,
                border: `1px solid ${theme.border}`, borderRadius: "8px", outline: "none",
              }}
            />
          </div>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div style={{ padding: "8px 20px", display: "flex", gap: "6px", flexWrap: "wrap", borderBottom: `1px solid ${theme.border}` }}>
            <button
              onClick={() => setSelectedCategory(null)}
              style={{
                padding: "4px 12px", fontSize: "11px", fontWeight: 500, borderRadius: "12px",
                border: `1px solid ${!selectedCategory ? theme.accent : theme.border}`,
                backgroundColor: !selectedCategory ? `${theme.accent}15` : "transparent",
                color: !selectedCategory ? theme.accent : theme.muted,
                cursor: "pointer", transition: "all 0.15s ease",
              }}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                style={{
                  padding: "4px 12px", fontSize: "11px", fontWeight: 500, borderRadius: "12px",
                  border: `1px solid ${selectedCategory === cat ? theme.accent : theme.border}`,
                  backgroundColor: selectedCategory === cat ? `${theme.accent}15` : "transparent",
                  color: selectedCategory === cat ? theme.accent : theme.muted,
                  cursor: "pointer", transition: "all 0.15s ease",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Templates List */}
        <div style={{ flex: 1, overflow: "auto", padding: "12px 20px" }}>
          {filteredTemplates.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <FileCode size={32} style={{ color: theme.faint, marginBottom: "12px" }} />
              <p className="font-body" style={{ fontSize: "13px", color: theme.faint }}>
                No templates found for this language
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {filteredTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleSelect(template)}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: "12px",
                    padding: "14px", border: `1px solid ${theme.border}`, borderRadius: "10px",
                    backgroundColor: theme.bg, cursor: "pointer", textAlign: "left",
                    transition: "all 0.15s ease", width: "100%",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = theme.accent;
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = theme.border;
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div style={{
                    width: "36px", height: "36px", borderRadius: "8px",
                    backgroundColor: `${theme.accent}10`, display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    {(() => { const Icon = CATEGORY_ICONS[template.category] || FileCode; return <Icon size={16} style={{ color: theme.accent }} />; })()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <span className="font-body" style={{ fontSize: "13px", fontWeight: 600, color: theme.text }}>
                        {template.name}
                      </span>
                      <span style={{
                        fontSize: "10px", fontWeight: 600, padding: "1px 6px", borderRadius: "4px",
                        backgroundColor: `${DIFFICULTY_COLORS[template.difficulty]}15`,
                        color: DIFFICULTY_COLORS[template.difficulty],
                      }}>
                        {template.difficulty}
                      </span>
                    </div>
                    <p className="font-body" style={{ fontSize: "12px", color: theme.muted, lineHeight: 1.4 }}>
                      {template.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
      `}</style>
    </div>
  );
}
