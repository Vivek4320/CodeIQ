"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/components/landing/ThemeContext";

type Range = "7d" | "30d" | "all";

export default function AnalyticsPage() {
  const { theme } = useTheme();
  const [range, setRange] = useState<Range>("30d");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/analytics?range=${range}`).then((response) => { if (!response.ok) throw new Error(); return response.json(); }).then(setData).catch(() => setError(true)).finally(() => setLoading(false));
  }, [range]);

  if (loading) return <p style={{ color: theme.faint }}>Loading...</p>;
  if (error || !data) return <p style={{ color: "#EF4444" }}>Unable to load data. Please try again.</p>;
  const timeline = data.timeline || [];
  const languages = data.languages || [];
  const maxLanguage = Math.max(...languages.map((item: any) => Number(item.count)), 1);
  const maxDay = Math.max(...timeline.map((item: any) => Number(item.total)), 1);

  return <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "24px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: 600 }}>Analytics</h1>
      <div style={{ display: "flex", border: `1px solid ${theme.border}`, borderRadius: "6px", overflow: "hidden" }}>
        {(["7d", "30d", "all"] as Range[]).map((item) => <button key={item} onClick={() => { setError(false); setRange(item); }} style={{ padding: "8px 12px", background: range === item ? `${theme.accent}18` : theme.panel, color: range === item ? theme.accent : theme.muted, border: 0, borderRight: `1px solid ${theme.border}`, cursor: "pointer" }}>{item === "all" ? "All time" : `Last ${item.slice(0, -1)} days`}</button>)}
      </div>
    </div>
    {timeline.length === 0 && languages.length === 0 ? <p style={{ color: theme.faint }}>No execution data yet</p> : <>
      <section style={{ padding: "20px", border: `1px solid ${theme.border}`, borderRadius: "8px", background: theme.panel, marginBottom: "20px" }}>
        <h2 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "18px" }}>Runs over time</h2>
        {timeline.length === 0 ? <p style={{ color: theme.faint }}>No execution data yet</p> : <div style={{ display: "flex", alignItems: "end", gap: "5px", minHeight: "190px", overflowX: "auto" }}>{timeline.map((item: any) => <div key={String(item.date)} title={`${item.date}: ${item.total} runs`} style={{ minWidth: "18px", height: "170px", display: "flex", alignItems: "end", gap: "2px" }}><div style={{ width: "8px", height: `${(Number(item.successful) / maxDay) * 150}px`, background: "#34D399" }} /><div style={{ width: "8px", height: `${((Number(item.total) - Number(item.successful)) / maxDay) * 150}px`, background: "#EF4444" }} /></div>)}</div>}
        <div style={{ display: "flex", gap: "14px", color: theme.faint, fontSize: "11px", marginTop: "10px" }}><span><i style={{ display: "inline-block", width: "8px", height: "8px", background: "#34D399", marginRight: "5px" }} />Successful</span><span><i style={{ display: "inline-block", width: "8px", height: "8px", background: "#EF4444", marginRight: "5px" }} />Failed</span></div>
      </section>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: "20px" }}>
        <section style={{ padding: "20px", border: `1px solid ${theme.border}`, borderRadius: "8px", background: theme.panel }}><h2 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "18px" }}>Most-used languages</h2>{languages.length === 0 ? <p style={{ color: theme.faint }}>No execution data yet</p> : languages.map((item: any) => <div key={item.language} style={{ marginBottom: "12px" }}><div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "5px" }}><span>{item.language}</span><span style={{ color: theme.faint }}>{item.count}</span></div><div style={{ height: "6px", background: `${theme.text}12` }}><div style={{ height: "100%", width: `${(Number(item.count) / maxLanguage) * 100}%`, background: theme.accent }} /></div></div>)}</section>
        <section style={{ padding: "20px", border: `1px solid ${theme.border}`, borderRadius: "8px", background: theme.panel }}><h2 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "18px" }}>Recent execution activity</h2>{(data.recent || []).length === 0 ? <p style={{ color: theme.faint }}>No execution data yet</p> : data.recent.map((item: any, index: number) => <div key={`${item.created_at}-${index}`} style={{ display: "flex", justifyContent: "space-between", gap: "10px", padding: "9px 0", borderBottom: `1px solid ${theme.border}`, fontSize: "12px" }}><span><b>{item.language}</b> <span style={{ color: theme.faint }}>by {item.user_name || "User"}</span></span><span style={{ color: item.successful ? "#34D399" : "#EF4444" }}>{item.successful ? "Success" : "Failed"}</span></div>)}</section>
      </div>
    </>}
  </div>;
}
