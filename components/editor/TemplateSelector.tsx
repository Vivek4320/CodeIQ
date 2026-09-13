"use client";

import { useEffect, useMemo, useState } from "react";
import { X, Search, Code2, FileCode, Layout, Database, Server, Cpu, Braces } from "lucide-react";
import { useTheme } from "@/components/landing/ThemeContext";
import { templates, type Template } from "@/data/templates";

interface TemplateSelectorProps {
  language: string;
  onSelect: (code: string, language: string) => void;
  onClose: () => void;
}

interface RegistryLanguage {
  id: string;
  name: string;
  sampleCode?: string;
  category?: string;
}

const CATEGORY_ICONS: Record<string, any> = {
  Basics: Braces, API: Server, Async: Cpu, OOP: Code2, Advanced: Code2,
  IO: Database, Data: Database, Collections: Database, STL: Layout,
  Concurrency: Cpu, "Data Structures": Layout, UI: Layout, Layout: Layout,
};

function getTemplateCode(template: Template): string {
  if (template.language !== "html") return template.code;
  return template.code.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "").replace(/\n{3,}/g, "\n\n").trim();
}

export default function TemplateSelector({ language, onSelect, onClose }: TemplateSelectorProps) {
  const { theme } = useTheme();
  const [search, setSearch] = useState("");
  const [selectedLang, setSelectedLang] = useState(language);
  const [registryLanguages, setRegistryLanguages] = useState<RegistryLanguage[]>([]);

  useEffect(() => {
    fetch("/api/languages", { cache: "no-store" })
      .then((res) => res.ok ? res.json() : null)
      .then((data) => setRegistryLanguages(Array.isArray(data?.languages) ? data.languages : []))
      .catch(() => setRegistryLanguages([]));
  }, []);

  useEffect(() => setSelectedLang(language), [language]);

  const dynamicTemplates = useMemo<Template[]>(() => {
    const existingLanguages = new Set(templates.map((template) => template.language));
    return registryLanguages
      .filter((item) => item.id && item.sampleCode && !existingLanguages.has(item.id))
      .map((item) => ({
        id: `registry-${item.id}-starter`,
        name: `${item.name} Starter`,
        language: item.id,
        category: item.category || "Basics",
        description: `Starter code from the central ${item.name} language registry`,
        code: item.sampleCode || "",
      }));
  }, [registryLanguages]);

  const allTemplates = useMemo(() => [...templates, ...dynamicTemplates], [dynamicTemplates]);
  const languages = useMemo(() => {
    const registryOrder = registryLanguages.map((item) => item.id).filter(Boolean);
    const templateLanguages = [...new Set(allTemplates.map((template) => template.language))];
    return [...new Set([...registryOrder, ...templateLanguages])];
  }, [registryLanguages, allTemplates]);

  const filtered = allTemplates.filter((t) =>
    t.language === selectedLang &&
    (!search || t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSelect = (template: Template) => {
    onSelect(getTemplateCode(template), template.language);
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ width: "90%", maxWidth: "520px", maxHeight: "80vh", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "16px", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}><div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: `${theme.accent}15`, display: "flex", alignItems: "center", justifyContent: "center" }}><FileCode size={16} style={{ color: theme.accent }} /></div><div><div style={{ fontSize: "15px", fontWeight: 600, color: theme.text }}>Code Templates</div><div style={{ fontSize: "11px", color: theme.muted }}>{allTemplates.length} snippets across {languages.length} languages</div></div></div>
          <button onClick={onClose} style={{ width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "transparent", border: "none", cursor: "pointer", color: theme.muted, borderRadius: "6px" }}><X size={16} /></button>
        </div>
        <div style={{ padding: "12px 20px 8px" }}><div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px", backgroundColor: theme.bg, border: `1px solid ${theme.border}`, borderRadius: "8px" }}><Search size={14} style={{ color: theme.muted, flexShrink: 0 }} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search templates..." style={{ flex: 1, background: "none", border: "none", outline: "none", color: theme.text, fontSize: "13px", fontFamily: "inherit" }} /></div></div>
        <div style={{ padding: "8px 20px", display: "flex", gap: "6px", overflowX: "auto", flexShrink: 0 }}>{languages.map((lang) => <button key={lang} onClick={() => setSelectedLang(lang)} style={{ padding: "5px 12px", fontSize: "11px", fontWeight: 600, whiteSpace: "nowrap", backgroundColor: selectedLang === lang ? theme.accent : "transparent", color: selectedLang === lang ? theme.bg : theme.muted, border: `1px solid ${selectedLang === lang ? theme.accent : theme.border}`, borderRadius: "16px", cursor: "pointer" }}>{registryLanguages.find((item) => item.id === lang)?.name || lang}</button>)}</div>
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 20px 16px" }}>{filtered.length === 0 ? <div style={{ textAlign: "center", padding: "40px 20px", color: theme.muted, fontSize: "13px" }}>No templates found</div> : <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>{filtered.map((template) => { const Icon = CATEGORY_ICONS[template.category] || Code2; return <button key={template.id} onClick={() => handleSelect(template)} style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "12px", backgroundColor: theme.bg, border: `1px solid ${theme.border}`, borderRadius: "10px", cursor: "pointer", textAlign: "left", width: "100%" }}><div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: `${theme.accent}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon size={14} style={{ color: theme.accent }} /></div><div style={{ minWidth: 0, flex: 1 }}><div style={{ fontSize: "13px", fontWeight: 600, color: theme.text, marginBottom: "2px" }}>{template.name}</div><div style={{ fontSize: "11px", color: theme.muted, lineHeight: 1.4 }}>{template.description}</div><div style={{ display: "inline-block", marginTop: "4px", padding: "2px 6px", fontSize: "9px", fontWeight: 600, color: theme.accent, backgroundColor: `${theme.accent}10`, borderRadius: "4px" }}>{template.category}</div></div></button>; })}</div>}</div>
      </div>
    </div>
  );
}
