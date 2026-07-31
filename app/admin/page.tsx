"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/components/landing/ThemeContext";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { Users, Code2, Play, Star, AlertTriangle, TrendingUp, Clock } from "lucide-react";

interface Stats {
  totalUsers: number;
  totalLanguages: number;
  totalRuns: number;
  totalFeedback: number;
  avgRating: number;
  errorRate: number;
}

export default function AdminDashboard() {
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentRuns, setRecentRuns] = useState<any[]>([]);
  const [langUsage, setLangUsage] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const email = localStorage.getItem("codeiq_admin");
    if (!email) return;
    fetch(`/api/admin/stats?email=${email}`)
      .then(r => r.json())
      .then(data => {
        setStats(data.stats);
        setRecentRuns(data.recentRuns || []);
        setLangUsage(data.langUsage || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ color: theme.faint }}>Loading dashboard...</p>;
  if (!stats) return <p style={{ color: theme.faint }}>Failed to load stats</p>;

  const topLang = langUsage[0];

  return (
    <div>
      <h1 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "24px" }}>Dashboard</h1>

      {/* Stats Cards — 4 key metrics */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" }}>
        {[
          { label: "Total Users", value: stats.totalUsers, icon: Users, color: "#60A5FA", sub: "registered" },
          { label: "Languages", value: stats.totalLanguages, icon: Code2, color: "#34D399", sub: "active" },
          { label: "Total Runs", value: stats.totalRuns, icon: Play, color: "#FBBF24", sub: "executions" },
          { label: "Error Rate", value: `${stats.errorRate}%`, icon: AlertTriangle, color: stats.errorRate > 5 ? "#EF4444" : "#34D399", sub: "of all runs" },
        ].map(({ label, value, icon: Icon, color, sub }) => (
          <div key={label} style={{ padding: "20px", border: `1px solid ${theme.border}`, borderRadius: "12px", backgroundColor: theme.panel }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <span style={{ fontSize: "12px", color: theme.faint, fontWeight: 500 }}>{label}</span>
              <Icon size={18} style={{ color }} />
            </div>
            <div style={{ fontSize: "28px", fontWeight: 700, color: theme.text }}>{value}</div>
            <div style={{ fontSize: "11px", color: theme.faint, marginTop: "2px" }}>{sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "20px" }}>
        {/* Quick Stats */}
        <div style={{ padding: "20px", border: `1px solid ${theme.border}`, borderRadius: "12px", backgroundColor: theme.panel }}>
          <h2 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "16px", color: theme.faint }}>Quick Overview</h2>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "12px" }}>
            <div style={{ padding: "14px", borderRadius: "8px", backgroundColor: `${theme.text}05` }}>
              <div style={{ fontSize: "11px", color: theme.faint, marginBottom: "4px" }}>⭐ Avg Rating</div>
              <div style={{ fontSize: "22px", fontWeight: 700 }}>{stats.avgRating}</div>
              <div style={{ fontSize: "11px", color: theme.faint }}>/ 5 from {stats.totalFeedback} reviews</div>
            </div>
            <div style={{ padding: "14px", borderRadius: "8px", backgroundColor: `${theme.text}05` }}>
              <div style={{ fontSize: "11px", color: theme.faint, marginBottom: "4px" }}>🏆 Top Language</div>
              <div style={{ fontSize: "22px", fontWeight: 700 }}>{topLang?.language || "N/A"}</div>
              <div style={{ fontSize: "11px", color: theme.faint }}>{topLang?.count || 0} runs</div>
            </div>
            <div style={{ padding: "14px", borderRadius: "8px", backgroundColor: `${theme.text}05` }}>
              <div style={{ fontSize: "11px", color: theme.faint, marginBottom: "4px" }}>📈 Runs per User</div>
              <div style={{ fontSize: "22px", fontWeight: 700 }}>{stats.totalUsers > 0 ? Math.round(stats.totalRuns / stats.totalUsers) : 0}</div>
              <div style={{ fontSize: "11px", color: theme.faint }}>average executions</div>
            </div>
            <div style={{ padding: "14px", borderRadius: "8px", backgroundColor: `${theme.text}05` }}>
              <div style={{ fontSize: "11px", color: theme.faint, marginBottom: "4px" }}>✅ Success Rate</div>
              <div style={{ fontSize: "22px", fontWeight: 700 }}>{(100 - stats.errorRate).toFixed(1)}%</div>
              <div style={{ fontSize: "11px", color: theme.faint }}>of all executions</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{ padding: "20px", border: `1px solid ${theme.border}`, borderRadius: "12px", backgroundColor: theme.panel }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <Clock size={14} style={{ color: theme.faint }} />
            <h2 style={{ fontSize: "14px", fontWeight: 600, color: theme.faint }}>Recent Activity</h2>
          </div>
          {recentRuns.length === 0 && <p style={{ fontSize: "13px", color: theme.faint }}>No activity yet</p>}
          {recentRuns.slice(0, 8).map((r: any, i: number) => {
            const time = new Date(r.created_at);
            const timeAgo = getTimeAgo(time);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", borderRadius: "6px", backgroundColor: i % 2 === 0 ? "transparent" : `${theme.text}03`, fontSize: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ padding: "2px 8px", borderRadius: "4px", backgroundColor: `${theme.accent}12`, color: theme.accent, fontSize: "10px", fontWeight: 600, fontFamily: "monospace" }}>{r.language}</span>
                  <span style={{ color: theme.text }}>{r.user_name || r.user_email?.split("@")[0] || "User"}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: theme.faint, fontSize: "11px" }}>{r.project_name}</span>
                  <span style={{ color: theme.faint, fontSize: "10px" }}>{timeAgo}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* System Status Bar */}
      <div style={{ marginTop: "20px", padding: "16px 20px", border: `1px solid ${theme.border}`, borderRadius: "12px", backgroundColor: theme.panel, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#34D399" }} />
            <span style={{ fontSize: "12px", color: theme.text }}>System Online</span>
          </div>
          <span style={{ fontSize: "11px", color: theme.faint }}>Node.js {typeof process !== 'undefined' ? process.version : ''}</span>
          <span style={{ fontSize: "11px", color: theme.faint }}>Next.js 16.2</span>
        </div>
        <a href="/admin/analytics" style={{ fontSize: "12px", color: theme.accent, textDecoration: "none" }}>View full analytics →</a>
      </div>
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
