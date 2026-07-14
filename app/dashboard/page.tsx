"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Code2, FileCode, Trash2, ExternalLink, ArrowLeft } from "lucide-react";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import Footer from "@/components/Footer";
import { useTheme } from "@/components/landing/ThemeContext";
import { useAuth } from "@/components/AuthContext";

const display = Instrument_Serif({ subsets: ["latin"], weight: ["400"], style: ["normal", "italic"], variable: "--font-display" });
const bodyFont = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

const LANGUAGES_LIST = ["JavaScript", "TypeScript", "Python", "C", "C++", "Java", "Go", "Rust", "Ruby", "Haskell"];

interface Project {
  id: number;
  name: string;
  language: string;
  code: string;
  created_at: string;
  updated_at: string;
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr + (dateStr.endsWith("Z") ? "" : "Z")).getTime();
  const diff = now - then;
  const secs = Math.floor(diff / 1000);
  if (secs < 10) return "just now";
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function DashboardPage() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/projects?email=${encodeURIComponent(user.email)}`)
      .then((res) => res.json())
      .then((data) => {
        setProjects(data.projects || []);
      })
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, [user]);

  const deleteProject = async (id: number) => {
    if (!user) return;
    try {
      await fetch(`/api/projects?id=${id}&email=${encodeURIComponent(user.email)}`, { method: "DELETE" });
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch {}
  };

  const stats = [
    { label: "Projects", value: projects.length, icon: FileCode },
    { label: "Languages", value: LANGUAGES_LIST.length, icon: Code2 },
  ];

  return (
    <div
      className={`${display.variable} ${bodyFont.variable} ${mono.variable}`}
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: theme.bg, color: theme.text }}
    >
      <main style={{ flex: 1, maxWidth: "1040px", margin: "0 auto", padding: "40px 24px 80px", width: "100%" }}>
        {/* Back to Home */}
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 14px", fontSize: "12px", fontWeight: 500, color: theme.muted, backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "8px", textDecoration: "none", marginBottom: "28px", transition: "all 0.2s ease" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = theme.accent; e.currentTarget.style.color = theme.text; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.muted; }}>
          <ArrowLeft size={14} /> Home
        </Link>

        {/* Welcome */}
        <div style={{ marginBottom: "36px" }}>
          <h1 className="font-display" style={{ fontSize: "clamp(28px, 4vw, 38px)", fontWeight: 400, marginBottom: "8px" }}>
            Welcome back, <span style={{ fontStyle: "italic", color: theme.accent }}>{user?.name?.split(" ")[0]}</span>.
          </h1>
          <p className="font-body" style={{ fontSize: "15px", color: theme.muted }}>
            Start coding or pick up where you left off.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px", marginBottom: "32px" }}>
          {stats.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              style={{
                padding: "20px", border: `1px solid ${theme.border}`, borderRadius: "10px",
                backgroundColor: theme.panel, display: "flex", alignItems: "center", gap: "14px",
              }}
            >
              <div style={{
                width: "40px", height: "40px", borderRadius: "10px",
                backgroundColor: `${theme.accent}12`, display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon size={18} style={{ color: theme.accent }} />
              </div>
              <div>
                <div className="font-body" style={{ fontSize: "22px", fontWeight: 600 }}>{value}</div>
                <div className="font-mono" style={{ fontSize: "11px", color: theme.faint, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* New Project Button */}
        <Link
          href="/editor"
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "12px 24px", fontSize: "14px", fontWeight: 500,
            backgroundColor: theme.accent, color: theme.bg,
            borderRadius: "8px", border: "none", cursor: "pointer",
            textDecoration: "none", marginBottom: "36px",
            transition: "opacity 0.2s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
        >
          <Plus size={16} /> New Project
        </Link>

        {/* Recent Projects */}
        <div>
          <h2 className="font-display" style={{ fontSize: "22px", fontWeight: 400, marginBottom: "16px" }}>
            Recent Projects
          </h2>

          {loading ? (
            <div style={{ padding: "40px", textAlign: "center" }}>
              <span className="font-mono" style={{ fontSize: "13px", color: theme.faint }}>Loading projects...</span>
            </div>
          ) : projects.length === 0 ? (
            <div
              style={{
                padding: "40px", textAlign: "center",
                border: `1px dashed ${theme.border}`, borderRadius: "10px",
              }}
            >
              <FileCode size={32} style={{ color: theme.faint, marginBottom: "12px" }} />
              <p className="font-body" style={{ fontSize: "14px", color: theme.muted, marginBottom: "4px" }}>
                No projects yet
              </p>
              <p className="font-mono" style={{ fontSize: "12px", color: theme.faint }}>
                Click "New Project" to start coding
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/editor?id=${project.id}`}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "14px 18px", border: `1px solid ${theme.border}`, borderRadius: "8px",
                    backgroundColor: theme.panel, transition: "border-color 0.2s ease",
                    textDecoration: "none", color: theme.text, cursor: "pointer",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = theme.accent; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = theme.border; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <FileCode size={18} style={{ color: theme.accent }} />
                    <div>
                      <span className="font-body" style={{ fontSize: "14px", fontWeight: 500 }}>{project.name}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "2px" }}>
                        <span className="font-mono" style={{ fontSize: "11px", color: theme.faint }}>{project.language}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <ExternalLink size={14} style={{ color: theme.faint }} />
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); deleteProject(project.id); }}
                      style={{
                        padding: "6px", backgroundColor: "transparent", border: "none",
                        cursor: "pointer", color: theme.faint, borderRadius: "4px",
                        transition: "color 0.2s ease", display: "flex", alignItems: "center",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = "#EF4444"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = theme.faint; }}
                      title="Delete project"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
