"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/components/landing/ThemeContext";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { Plus, Edit2, Trash2, X, Check, ToggleLeft, ToggleRight } from "lucide-react";
import LanguageLogo, { LOGOS } from "@/components/LanguageLogo";

interface Language {
  id: number; name: string; slug: string; extension: string;
  is_active: number; compiler_cmd: string | null; run_cmd: string | null;
  compile_cmd: string | null; piston_lang: string | null; piston_version: string | null;
  stdin_support: number; category: string; sort_order: number;
}

const EMPTY_LANG: Partial<Language> = { name: "", slug: "", extension: ".py", compiler_cmd: "", run_cmd: "", compile_cmd: "", piston_lang: "", piston_version: "", stdin_support: 0, category: "general", sort_order: 0, is_active: 1 };

export default function LanguagesPage() {
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const [languages, setLanguages] = useState<Language[]>([]);
  const [editing, setEditing] = useState<Partial<Language> | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch("/api/admin/languages").then(r => r.json()).then(d => { setLanguages(d.languages || []); setLoading(false); });
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    const email = localStorage.getItem("codeiq_admin");
    if (!email || !editing) return;
    const method = editing.id ? "PUT" : "POST";
    await fetch("/api/admin/languages", {
      method, headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, ...editing }),
    });
    setEditing(null);
    load();
  };

  const toggleActive = async (lang: Language) => {
    const email = localStorage.getItem("codeiq_admin");
    if (!email) return;
    await fetch("/api/admin/languages", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, id: lang.id, is_active: !lang.is_active }),
    });
    load();
  };

  const remove = async (id: number) => {
    const email = localStorage.getItem("codeiq_admin");
    if (!email || !confirm("Delete this language?")) return;
    await fetch("/api/admin/languages", {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, id }),
    });
    load();
  };

  const inputStyle = { padding: "6px 10px", fontSize: "13px", backgroundColor: theme.bg, color: theme.text, border: `1px solid ${theme.border}`, borderRadius: "6px", outline: "none", width: "100%" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 600 }}>Languages</h1>
        <button onClick={() => setEditing({ ...EMPTY_LANG })} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", fontSize: "13px", fontWeight: 500, backgroundColor: theme.accent, color: theme.bg, border: "none", borderRadius: "8px", cursor: "pointer" }}>
          <Plus size={14} /> Add Language
        </button>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={() => setEditing(null)}>
          <div style={{ backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "12px", padding: isMobile ? "16px" : "24px", width: isMobile ? "calc(100% - 32px)" : "500px", maxHeight: "80vh", overflow: "auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: 600 }}>{editing.id ? "Edit" : "Add"} Language</h2>
              <button onClick={() => setEditing(null)} style={{ background: "none", border: "none", color: theme.faint, cursor: "pointer" }}><X size={18} /></button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "12px" }}>
              <div><label style={{ fontSize: "11px", color: theme.faint, display: "block", marginBottom: "4px" }}>Name *</label><input style={inputStyle} value={editing.name || ""} onChange={e => setEditing({ ...editing, name: e.target.value })} /></div>
              <div><label style={{ fontSize: "11px", color: theme.faint, display: "block", marginBottom: "4px" }}>Slug *</label><input style={inputStyle} value={editing.slug || ""} onChange={e => setEditing({ ...editing, slug: e.target.value })} /></div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div><label style={{ fontSize: "11px", color: theme.faint, display: "block", marginBottom: "4px" }}>Preview</label><LanguageLogo language={editing.slug || ""} size={40} /></div>
                <div style={{ flex: 1 }}><label style={{ fontSize: "11px", color: theme.faint, display: "block", marginBottom: "4px" }}>Extension</label><input style={inputStyle} value={editing.extension || ""} onChange={e => setEditing({ ...editing, extension: e.target.value })} /></div>
              </div>
              <div style={{ gridColumn: "span 2" }}><label style={{ fontSize: "11px", color: theme.faint, display: "block", marginBottom: "4px" }}>Compiler Command</label><input style={inputStyle} value={editing.compiler_cmd || ""} onChange={e => setEditing({ ...editing, compiler_cmd: e.target.value })} placeholder="e.g., gcc" /></div>
              <div style={{ gridColumn: "span 2" }}><label style={{ fontSize: "11px", color: theme.faint, display: "block", marginBottom: "4px" }}>Run Command</label><input style={inputStyle} value={editing.run_cmd || ""} onChange={e => setEditing({ ...editing, run_cmd: e.target.value })} placeholder="e.g., python -u {file}" /></div>
              <div style={{ gridColumn: "span 2" }}><label style={{ fontSize: "11px", color: theme.faint, display: "block", marginBottom: "4px" }}>Compile Command</label><input style={inputStyle} value={editing.compile_cmd || ""} onChange={e => setEditing({ ...editing, compile_cmd: e.target.value })} placeholder="e.g., gcc {file} -o {out}" /></div>
              <div><label style={{ fontSize: "11px", color: theme.faint, display: "block", marginBottom: "4px" }}>Piston Language</label><input style={inputStyle} value={editing.piston_lang || ""} onChange={e => setEditing({ ...editing, piston_lang: e.target.value })} /></div>
              <div><label style={{ fontSize: "11px", color: theme.faint, display: "block", marginBottom: "4px" }}>Piston Version</label><input style={inputStyle} value={editing.piston_version || ""} onChange={e => setEditing({ ...editing, piston_version: e.target.value })} /></div>
              <div><label style={{ fontSize: "11px", color: theme.faint, display: "block", marginBottom: "4px" }}>Category</label><input style={inputStyle} value={editing.category || ""} onChange={e => setEditing({ ...editing, category: e.target.value })} /></div>
              <div><label style={{ fontSize: "11px", color: theme.faint, display: "block", marginBottom: "4px" }}>Sort Order</label><input style={{ ...inputStyle, width: "80px" }} type="number" value={editing.sort_order || 0} onChange={e => setEditing({ ...editing, sort_order: Number(e.target.value) })} /></div>
              <div style={{ gridColumn: "span 2", display: "flex", gap: "16px", alignItems: "center" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: theme.text, cursor: "pointer" }}>
                  <input type="checkbox" checked={!!editing.stdin_support} onChange={e => setEditing({ ...editing, stdin_support: e.target.checked ? 1 : 0 })} /> Stdin Support
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: theme.text, cursor: "pointer" }}>
                  <input type="checkbox" checked={!!editing.is_active} onChange={e => setEditing({ ...editing, is_active: e.target.checked ? 1 : 0 })} /> Active
                </label>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "20px" }}>
              <button onClick={() => setEditing(null)} style={{ padding: "8px 16px", fontSize: "13px", backgroundColor: "transparent", color: theme.muted, border: `1px solid ${theme.border}`, borderRadius: "6px", cursor: "pointer" }}>Cancel</button>
              <button onClick={save} style={{ padding: "8px 16px", fontSize: "13px", fontWeight: 500, backgroundColor: theme.accent, color: theme.bg, border: "none", borderRadius: "6px", cursor: "pointer" }}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Languages Table */}
      <div style={{ border: `1px solid ${theme.border}`, borderRadius: "12px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr style={{ backgroundColor: theme.panel, borderBottom: `1px solid ${theme.border}` }}>
              {["", "Name", "Slug", "Ext", "Category", "Compiler", "Stdin", "Active", "Actions"].map(h => (
                <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: theme.faint, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {languages.map(lang => (
              <tr key={lang.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                <td style={{ padding: "10px 12px" }}><LanguageLogo language={lang.slug} size={28} /></td>
                <td style={{ padding: "10px 12px", fontWeight: 500 }}>{lang.name}</td>
                <td style={{ padding: "10px 12px", color: theme.faint, fontFamily: "monospace" }}>{lang.slug}</td>
                <td style={{ padding: "10px 12px", color: theme.faint, fontFamily: "monospace" }}>{lang.extension}</td>
                <td style={{ padding: "10px 12px" }}><span style={{ padding: "2px 8px", borderRadius: "4px", backgroundColor: `${theme.accent}15`, color: theme.accent, fontSize: "11px" }}>{lang.category}</span></td>
                <td style={{ padding: "10px 12px", color: theme.faint, fontFamily: "monospace", fontSize: "11px" }}>{lang.compiler_cmd || "Piston"}</td>
                <td style={{ padding: "10px 12px" }}>{lang.stdin_support ? "✅" : "—"}</td>
                <td style={{ padding: "10px 12px" }}>
                  <button onClick={() => toggleActive(lang)} style={{ background: "none", border: "none", cursor: "pointer", color: lang.is_active ? "#34D399" : theme.faint }}>
                    {lang.is_active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                  </button>
                </td>
                <td style={{ padding: "10px 12px" }}>
                  <div style={{ display: "flex", gap: "4px" }}>
                    <button onClick={() => setEditing(lang)} style={{ background: "none", border: "none", cursor: "pointer", color: theme.faint, padding: "4px" }}><Edit2 size={14} /></button>
                    <button onClick={() => remove(lang.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#EF4444", padding: "4px" }}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
