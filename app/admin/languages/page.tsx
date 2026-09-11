"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Search, RefreshCw, Pencil, Power, Trash2, X } from "lucide-react";
import { useTheme } from "@/components/landing/ThemeContext";
import { useIsMobile } from "@/hooks/useMediaQuery";
import LanguageLogo from "@/components/LanguageLogo";

type Language = any;

const emptyForm = {
  name: "", slug: "", extension: "", editor_key: "", execution_type: "judge0", language_id: "",
  version: "", title: "", description: "", h1: "", sample_code: "", stdin_support: true,
  category: "general", sort_order: 0,
};

export default function LanguagesPage() {
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<any>(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/admin/languages", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to load languages");
      setLanguages(data.languages || []);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => languages.filter(l => `${l.name} ${l.slug} ${l.editorKey}`.toLowerCase().includes(search.toLowerCase())), [languages, search]);
  const active = languages.filter(l => l.isActive).length;
  const judge0 = languages.filter(l => l.executionType === "judge0").length;

  const addLanguage = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError("");
    try {
      const res = await fetch("/api/admin/languages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add language");
      setShowForm(false); setForm(emptyForm); await load();
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  };

  const toggle = async (language: Language) => {
    const res = await fetch("/api/admin/languages", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: language.id, is_active: !language.isActive }) });
    if (res.ok) load(); else { const data = await res.json(); setError(data.error || "Update failed"); }
  };

  const remove = async (language: Language) => {
    if (!confirm(`Delete ${language.name}? This removes it from the registry.`)) return;
    const res = await fetch("/api/admin/languages", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: language.id }) });
    if (res.ok) load(); else { const data = await res.json(); setError(data.error || "Delete failed"); }
  };

  const field = (key: string, label: string, type = "text", required = false) => (
    <label style={{ display: "grid", gap: 6, fontSize: 12, color: theme.faint }}>
      {label}
      <input required={required} type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: type === "number" ? Number(e.target.value) : e.target.value })} style={{ width: "100%", boxSizing: "border-box", padding: "10px 11px", border: `1px solid ${theme.border}`, borderRadius: 8, background: theme.bg, color: theme.text, outline: "none" }} />
    </label>
  );

  return <div>
    <div style={{ display: "flex", alignItems: isMobile ? "flex-start" : "center", justifyContent: "space-between", gap: 16, flexDirection: isMobile ? "column" : "row", marginBottom: 22 }}>
      <div><h1 style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>Languages</h1><p style={{ color: theme.faint, fontSize: 13, margin: "7px 0 0" }}>Central registry for every language supported by CodeIQ.</p></div>
      <button onClick={() => { setForm(emptyForm); setShowForm(true); }} style={{ display: "flex", alignItems: "center", gap: 7, border: 0, borderRadius: 8, padding: "10px 14px", background: theme.accent, color: theme.bg, fontWeight: 600, cursor: "pointer" }}><Plus size={16}/> Add Language</button>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 10, marginBottom: 18 }}>
      {[{label:"Total",value:languages.length},{label:"Active",value:active},{label:"Judge0",value:judge0},{label:"Custom",value:Math.max(0,languages.length-12)}].map(c => <div key={c.label} style={{ padding: 16, border: `1px solid ${theme.border}`, borderRadius: 10, background: theme.panel }}><div style={{fontSize:11,color:theme.faint,textTransform:"uppercase",letterSpacing:".06em"}}>{c.label}</div><div style={{fontSize:22,fontWeight:600,marginTop:4}}>{c.value}</div></div>)}
    </div>

    <div style={{ display:"flex", gap:8, marginBottom:12 }}><div style={{position:"relative",flex:1}}><Search size={15} style={{position:"absolute",left:11,top:11,color:theme.faint}}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search languages..." style={{width:"100%",boxSizing:"border-box",padding:"9px 11px 9px 32px",border:`1px solid ${theme.border}`,borderRadius:8,background:theme.bg,color:theme.text}}/></div><button onClick={load} title="Refresh" style={{border:`1px solid ${theme.border}`,background:theme.panel,color:theme.text,borderRadius:8,padding:"0 11px",cursor:"pointer"}}><RefreshCw size={15}/></button></div>
    {error && <div style={{marginBottom:12,padding:10,borderRadius:8,background:"#ef444415",color:"#ef4444",fontSize:13}}>{error}</div>}

    {loading ? <p style={{color:theme.faint}}>Loading...</p> : <div style={{border:`1px solid ${theme.border}`,borderRadius:10,overflow:"auto"}}><table style={{minWidth:isMobile?"1050px":"100%",width:"100%",borderCollapse:"collapse",fontSize:13}}><thead><tr style={{background:theme.panel,borderBottom:`1px solid ${theme.border}`}}>{["Language","Runtime","Version","ID","Executions","Status","Actions"].map(h=><th key={h} style={{padding:12,textAlign:"left",color:theme.faint,fontSize:10,textTransform:"uppercase",letterSpacing:".06em"}}>{h}</th>)}</tr></thead><tbody>{filtered.map(l=><tr key={l.id || l.slug} style={{borderBottom:`1px solid ${theme.border}`}}><td style={{padding:12}}><div style={{display:"flex",alignItems:"center",gap:9}}><LanguageLogo language={l.editorKey || l.slug} size={26}/><div><div style={{fontWeight:600}}>{l.name}</div><div style={{fontSize:10,color:theme.faint}}>{l.slug}</div></div></div></td><td style={{padding:12,color:theme.faint}}>{l.executionType}</td><td style={{padding:12,color:theme.faint}}>{l.version}</td><td style={{padding:12,fontFamily:"monospace",color:theme.faint}}>{l.languageId ?? "—"}</td><td style={{padding:12,color:theme.faint}}>{l.executionCount}</td><td style={{padding:12}}><span style={{padding:"4px 8px",borderRadius:999,background:l.isActive?"#10b98118":"#ef444418",color:l.isActive?"#10b981":"#ef4444",fontSize:11}}>{l.isActive?"Active":"Disabled"}</span></td><td style={{padding:12}}><div style={{display:"flex",gap:5}}><button title="Toggle active" onClick={()=>toggle(l)} style={{border:`1px solid ${theme.border}`,background:theme.panel,color:theme.text,borderRadius:6,padding:6,cursor:"pointer"}}><Power size={14}/></button><button title="Delete" onClick={()=>remove(l)} style={{border:`1px solid #ef444433`,background:"#ef444408",color:"#ef4444",borderRadius:6,padding:6,cursor:"pointer"}}><Trash2 size={14}/></button></div></td></tr>)}</tbody></table></div>}

    {showForm && <div style={{position:"fixed",inset:0,zIndex:100,background:"rgba(0,0,0,.62)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}><form onSubmit={addLanguage} style={{width:"min(760px,100%)",maxHeight:"90vh",overflow:"auto",background:theme.panel,border:`1px solid ${theme.border}`,borderRadius:14,padding:22,boxSizing:"border-box"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}><div><h2 style={{margin:0,fontSize:19}}>Add Language</h2><p style={{margin:"5px 0 0",fontSize:12,color:theme.faint}}>One registry entry powers the editor, compiler page, API and execution layer.</p></div><button type="button" onClick={()=>setShowForm(false)} style={{border:0,background:"transparent",color:theme.faint,cursor:"pointer"}}><X size={19}/></button></div><div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:12}}>{field("name","Display name","text",true)}{field("editor_key","Editor key","text",true)}{field("slug","Page slug","text",true)}{field("extension","Extension","text",true)}{field("version","Runtime / version","text",true)}{field("language_id","Judge0 Language ID","number",form.execution_type==="judge0")}</div><div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:12,marginTop:12}}><label style={{display:"grid",gap:6,fontSize:12,color:theme.faint}}>Execution type<select value={form.execution_type} onChange={e=>setForm({...form,execution_type:e.target.value})} style={{padding:10,border:`1px solid ${theme.border}`,borderRadius:8,background:theme.bg,color:theme.text}}><option value="judge0">Judge0</option><option value="live-vm">Live VM</option><option value="live-preview">Live Preview</option></select></label>{field("category","Category")}</div>{field("title","SEO title")}{field("h1","Page H1")}{field("description","SEO description")}<label style={{display:"grid",gap:6,fontSize:12,color:theme.faint,marginTop:12}}>Starter code<textarea required value={form.sample_code} onChange={e=>setForm({...form,sample_code:e.target.value})} rows={10} style={{padding:10,border:`1px solid ${theme.border}`,borderRadius:8,background:theme.bg,color:theme.text,fontFamily:"monospace",resize:"vertical"}}/></label><div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:18}}><button type="button" onClick={()=>setShowForm(false)} style={{padding:"9px 14px",border:`1px solid ${theme.border}`,background:"transparent",color:theme.text,borderRadius:8,cursor:"pointer"}}>Cancel</button><button disabled={saving} type="submit" style={{padding:"9px 16px",border:0,background:theme.accent,color:theme.bg,borderRadius:8,fontWeight:600,cursor:"pointer"}}>{saving?"Adding...":"Add Language"}</button></div></form></div>}
  </div>;
}
