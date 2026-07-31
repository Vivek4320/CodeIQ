"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/components/landing/ThemeContext";
import { useIsMobile } from "@/hooks/useMediaQuery";

export default function AnalyticsPage() {
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const [stats, setStats] = useState<any>(null);
  const [langUsage, setLangUsage] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const email = localStorage.getItem("codeiq_admin");
    if (!email) return;
    fetch(`/api/admin/stats?email=${email}`).then(r => r.json()).then(d => {
      setStats(d.stats);
      setLangUsage(d.langUsage || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <p style={{ color: theme.faint }}>Loading analytics...</p>;

  const maxCount = langUsage[0]?.count || 1;

  return (
    <div>
      <h1 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "24px" }}>Analytics</h1>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)", gap: "16px", marginBottom: "32px" }}>
        {[
          { label: "Total Runs", value: stats?.totalRuns || 0 },
          { label: "Active Languages", value: stats?.totalLanguages || 0 },
          { label: "Error Rate", value: `${stats?.errorRate || 0}%` },
        ].map(({ label, value }) => (
          <div key={label} style={{ padding: "20px", border: `1px solid ${theme.border}`, borderRadius: "12px", backgroundColor: theme.panel }}>
            <div style={{ fontSize: "12px", color: theme.faint, marginBottom: "4px" }}>{label}</div>
            <div style={{ fontSize: "28px", fontWeight: 700 }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Language usage chart */}
      <div style={{ padding: "24px", border: `1px solid ${theme.border}`, borderRadius: "12px", backgroundColor: theme.panel }}>
        <h2 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "20px" }}>Language Usage</h2>
        {langUsage.length === 0 ? (
          <p style={{ color: theme.faint }}>No data yet</p>
        ) : (
          <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", height: "200px", padding: "0 8px" }}>
            {langUsage.map((l: any) => {
              const height = (l.count / maxCount) * 180;
              return (
                <div key={l.language} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "11px", color: theme.text, fontWeight: 500 }}>{l.count}</span>
                  <div style={{ width: "100%", height: `${height}px`, backgroundColor: theme.accent, borderRadius: "4px 4px 0 0", opacity: 0.8, transition: "height 0.3s" }} />
                  <span style={{ fontSize: "10px", color: theme.faint, textAlign: "center", wordBreak: "break-all" }}>{l.language}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
