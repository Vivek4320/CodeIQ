"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Plus, Code2, FileCode, Trash2, ExternalLink, ArrowLeft, Folder, FolderOpen, File, Star, MessageSquare, Search, Clock, Play, Zap, Check, Square, Trash } from "lucide-react";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import Footer from "@/components/Footer";
import { useTheme } from "@/components/landing/ThemeContext";
import { useAuth } from "@/components/AuthContext";

const display = Instrument_Serif({ subsets: ["latin"], weight: ["400"], style: ["normal", "italic"], variable: "--font-display" });
const bodyFont = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

const LANGUAGES_LIST = ["JavaScript", "TypeScript", "Python", "C", "C++", "Java", "Go", "Rust", "Ruby", "Haskell", "HTML", "CSS"];

interface Project {
  id: number;
  name: string;
  language: string;
  code: string;
  created_at: string;
  updated_at: string;
}

interface Feedback {
  id: number;
  name: string;
  email: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface RunHistory {
  id: number;
  project_name: string;
  language: string;
  code: string;
  output: string;
  created_at: string;
}

const LANG_COLORS: Record<string, string> = {
  javascript: "#F7DF1E", typescript: "#3178C6", python: "#3776AB", c: "#A8B9CC", cpp: "#00599C",
  java: "#ED8B00", go: "#00ADD8", rust: "#DEA584", ruby: "#CC342D", haskell: "#5D4F85",
  html: "#E34F26", css: "#1572B6",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FeedbackList({ theme, email }: { theme: any; email: string }) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/feedback?email=${encodeURIComponent(email)}`)
      .then((res) => res.json())
      .then((data) => setFeedbacks(data.feedback || []))
      .catch(() => setFeedbacks([]))
      .finally(() => setLoading(false));
  }, [email]);

  if (loading) {
    return <div style={{ padding: "24px", textAlign: "center" }}><span className="font-mono" style={{ fontSize: "12px", color: theme.faint }}>Loading feedback...</span></div>;
  }

  if (feedbacks.length === 0) {
    return (
      <div style={{ padding: "32px", textAlign: "center", border: `1px dashed ${theme.border}`, borderRadius: "10px" }}>
        <MessageSquare size={28} style={{ color: theme.faint, marginBottom: "8px" }} />
        <p className="font-body" style={{ fontSize: "13px", color: theme.muted }}>No feedback yet. Users can submit feedback from the footer.</p>
      </div>
    );
  }

  const avgRating = (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1);

  return (
    <div>
      <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
        <div style={{ padding: "14px 20px", border: `1px solid ${theme.border}`, borderRadius: "10px", backgroundColor: theme.panel, flex: 1 }}>
          <div className="font-body" style={{ fontSize: "22px", fontWeight: 600, color: theme.accent }}>{avgRating}</div>
          <div className="font-mono" style={{ fontSize: "10px", color: theme.faint, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: "2px" }}>Avg Rating</div>
        </div>
        <div style={{ padding: "14px 20px", border: `1px solid ${theme.border}`, borderRadius: "10px", backgroundColor: theme.panel, flex: 1 }}>
          <div className="font-body" style={{ fontSize: "22px", fontWeight: 600 }}>{feedbacks.length}</div>
          <div className="font-mono" style={{ fontSize: "10px", color: theme.faint, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: "2px" }}>Total</div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {feedbacks.map((fb) => (
          <div key={fb.id} style={{ padding: "14px 18px", border: `1px solid ${theme.border}`, borderRadius: "8px", backgroundColor: theme.panel }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span className="font-body" style={{ fontSize: "13px", fontWeight: 500 }}>{fb.name || "Anonymous"}</span>
                <div style={{ display: "flex", gap: "1px" }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={11} fill={s <= fb.rating ? "#FBBF24" : "none"} stroke={s <= fb.rating ? "#FBBF24" : theme.faint} />
                  ))}
                </div>
              </div>
              <span className="font-mono" style={{ fontSize: "10px", color: theme.faint }}>{new Date(fb.created_at).toLocaleDateString()}</span>
            </div>
            <p className="font-body" style={{ fontSize: "13px", color: theme.muted, margin: 0, lineHeight: 1.5 }}>{fb.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
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
  const [expandedFolder, setExpandedFolder] = useState<number | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [runHistory, setRunHistory] = useState<RunHistory[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!user) return;
    fetch(`/api/projects?email=${encodeURIComponent(user.email)}`)
      .then((res) => res.json())
      .then((data) => setProjects(data.projects || []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));

    fetch(`/api/runs?email=${encodeURIComponent(user.email)}`)
      .then((res) => res.json())
      .then((data) => setRunHistory(data.runs || []))
      .catch(() => setRunHistory([]));
  }, [user]);

  // Computed stats
  const mostUsedLang = useMemo(() => {
    if (projects.length === 0) return "—";
    const counts: Record<string, number> = {};
    projects.forEach((p) => { counts[p.language] = (counts[p.language] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";
  }, [projects]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;
    const q = searchQuery.toLowerCase();
    return projects.filter((p) => p.name.toLowerCase().includes(q) || p.language.toLowerCase().includes(q));
  }, [projects, searchQuery]);

  const deleteProject = async (id: number) => {
    if (!user) return;
    try {
      await fetch(`/api/projects?id=${id}&email=${encodeURIComponent(user.email)}`, { method: "DELETE" });
      setProjects((prev) => prev.filter((p) => p.id !== id));
      setSelectedIds((prev) => { const next = new Set(prev); next.delete(id); return next; });
    } catch {}
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredProjects.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredProjects.map((p) => p.id)));
    }
  };

  const deleteSelected = async () => {
    if (!user || selectedIds.size === 0) return;
    const ids = Array.from(selectedIds);
    try {
      await Promise.all(ids.map((id) =>
        fetch(`/api/projects?id=${id}&email=${encodeURIComponent(user.email)}`, { method: "DELETE" })
      ));
      setProjects((prev) => prev.filter((p) => !selectedIds.has(p.id)));
      setSelectedIds(new Set());
    } catch {}
  };

  const stats = [
    { label: "Projects", value: projects.length, icon: FileCode, color: theme.accent },
    { label: "Total Runs", value: runHistory.length, icon: Play, color: "#34D399" },
    { label: "Top Language", value: mostUsedLang, icon: Zap, color: "#FBBF24" },
    { label: "Languages", value: LANGUAGES_LIST.length, icon: Code2, color: "#60A5FA" },
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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px", marginBottom: "32px" }}>
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              style={{
                padding: "18px", border: `1px solid ${theme.border}`, borderRadius: "10px",
                backgroundColor: theme.panel, display: "flex", alignItems: "center", gap: "12px",
              }}
            >
              <div style={{
                width: "36px", height: "36px", borderRadius: "8px",
                backgroundColor: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon size={16} style={{ color }} />
              </div>
              <div>
                <div className="font-body" style={{ fontSize: "18px", fontWeight: 600 }}>{value}</div>
                <div className="font-mono" style={{ fontSize: "10px", color: theme.faint, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
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
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", gap: "12px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <h2 className="font-display" style={{ fontSize: "22px", fontWeight: 400 }}>
                Recent Projects
              </h2>
              {selectedIds.size > 0 && (
                <button onClick={deleteSelected}
                  style={{ display: "flex", alignItems: "center", gap: "5px", padding: "5px 12px", fontSize: "12px", fontWeight: 500, backgroundColor: "#EF444420", color: "#EF4444", border: "1px solid #EF444440", borderRadius: "6px", cursor: "pointer", transition: "all 0.15s ease" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#EF4444"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#EF444420"; e.currentTarget.style.color = "#EF4444"; }}>
                  <Trash size={12} /> Delete ({selectedIds.size})
                </button>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {projects.length > 0 && (
                <button onClick={toggleSelectAll} title={selectedIds.size === filteredProjects.length ? "Deselect all" : "Select all"}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "28px", height: "28px", backgroundColor: "transparent", color: selectedIds.size === filteredProjects.length && filteredProjects.length > 0 ? theme.accent : theme.faint, border: `1px solid ${theme.border}`, borderRadius: "6px", cursor: "pointer", transition: "all 0.15s ease" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = theme.accent; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = theme.border; }}>
                  {selectedIds.size === filteredProjects.length && filteredProjects.length > 0 ? <Check size={14} /> : <Square size={14} />}
                </button>
              )}
              <div style={{ position: "relative", width: "100%", maxWidth: "220px" }}>
                <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: theme.faint }} />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects..."
                  className="font-mono"
                  style={{ width: "100%", padding: "7px 12px 7px 32px", fontSize: "12px", backgroundColor: theme.panel, color: theme.text, border: `1px solid ${theme.border}`, borderRadius: "8px", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s ease" }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = theme.accent; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = theme.border; }} />
              </div>
            </div>
          </div>

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
          ) : filteredProjects.length === 0 ? (
            <div
              style={{
                padding: "40px", textAlign: "center",
                border: `1px dashed ${theme.border}`, borderRadius: "10px",
              }}
            >
              <Search size={32} style={{ color: theme.faint, marginBottom: "12px" }} />
              <p className="font-body" style={{ fontSize: "14px", color: theme.muted, marginBottom: "4px" }}>
                No projects match &quot;{searchQuery}&quot;
              </p>
              <p className="font-mono" style={{ fontSize: "12px", color: theme.faint }}>
                Try a different search term
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {filteredProjects.map((project) => {
                const isWeb = project.language === "html" || project.language === "css";
                const isExpanded = expandedFolder === project.id;

                // Parse files for web projects
                let files: { name: string; lang: string }[] = [];
                if (isWeb) {
                  try {
                    const parsed = JSON.parse(project.code);
                    if (parsed.format === "codeiq-web") {
                      files = [
                        { name: parsed.html?.file || "index.html", lang: "html" },
                        { name: parsed.css?.file || "style.css", lang: "css" },
                      ];
                    }
                  } catch {}
                }

                return (
                  <div key={project.id}>
                    <div
                      style={{
                        display: "flex", alignItems: "center", gap: "12px",
                        padding: "14px 18px", border: `1px solid ${selectedIds.has(project.id) ? theme.accent : theme.border}`, borderRadius: isExpanded ? "8px 8px 0 0" : "8px",
                        backgroundColor: selectedIds.has(project.id) ? `${theme.accent}08` : theme.panel,
                        transition: "all 0.15s ease",
                      }}
                    >
                      {/* Checkbox */}
                      <button onClick={(e) => { e.stopPropagation(); toggleSelect(project.id); }}
                        style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "20px", height: "20px", flexShrink: 0, backgroundColor: "transparent", border: `1.5px solid ${selectedIds.has(project.id) ? theme.accent : theme.border}`, borderRadius: "4px", cursor: "pointer", color: theme.accent, transition: "all 0.15s ease" }}>
                        {selectedIds.has(project.id) ? <Check size={12} /> : <span style={{ width: "8px", height: "8px" }} />}
                      </button>
                      <div
                        style={{ display: "flex", alignItems: "center", gap: "14px", flex: 1, textDecoration: "none", color: theme.text }}
                        onClick={() => {
                          if (isWeb) {
                            setExpandedFolder(isExpanded ? null : project.id);
                          } else {
                            window.location.href = `/editor?id=${project.id}`;
                          }
                        }}
                      >
                        {isWeb ? (
                          isExpanded ? <FolderOpen size={18} style={{ color: theme.accent }} /> : <Folder size={18} style={{ color: theme.accent }} />
                        ) : (
                          <FileCode size={18} style={{ color: theme.accent }} />
                        )}
                        <div>
                          <span className="font-body" style={{ fontSize: "14px", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "200px" }}>{project.name}</span>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "2px" }}>
                            <span className="font-mono" style={{ fontSize: "11px", color: theme.faint }}>{project.language}</span>
                            {isWeb && <span className="font-mono" style={{ fontSize: "10px", color: theme.faint }}>({files.length} files)</span>}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        {!isWeb && (
                          <span
                            onClick={(e) => { e.preventDefault(); window.location.href = `/editor?id=${project.id}`; }}
                            style={{ cursor: "pointer" }}
                          >
                            <ExternalLink size={14} style={{ color: theme.faint }} />
                          </span>
                        )}
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); deleteProject(project.id); }}
                          style={{ padding: "6px", backgroundColor: "transparent", border: "none", cursor: "pointer", color: theme.faint, borderRadius: "4px", transition: "color 0.2s ease", display: "flex", alignItems: "center" }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = "#EF4444"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = theme.faint; }}
                          title="Delete project"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Expanded files */}
                    {isWeb && isExpanded && (
                      <div style={{ border: `1px solid ${theme.border}`, borderTop: "none", borderRadius: "0 0 8px 8px", backgroundColor: theme.panel, padding: "4px 0" }}>
                        {files.map((file) => (
                          <Link
                            key={file.name}
                            href={`/editor?id=${project.id}`}
                            style={{
                              display: "flex", alignItems: "center", gap: "10px",
                              padding: "10px 18px 10px 46px",
                              textDecoration: "none", color: theme.text,
                              transition: "background 0.15s ease",
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${theme.text}08`; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                          >
                            <File size={14} style={{ color: file.lang === "html" ? "#F97316" : "#3B82F6" }} />
                            <span className="font-mono" style={{ fontSize: "13px" }}>{file.name}</span>
                            <span className="font-mono" style={{ fontSize: "10px", color: theme.faint, marginLeft: "auto" }}>{file.lang}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Activity Timeline */}
        {runHistory.length > 0 && (
          <div style={{ marginTop: "48px" }}>
            <h2 className="font-display" style={{ fontSize: "22px", fontWeight: 400, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Clock size={20} style={{ color: theme.accent }} /> Recent Activity
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {runHistory.slice(0, 8).map((run, i) => (
                <div key={run.id} style={{ display: "flex", gap: "12px", position: "relative" }}>
                  {/* Timeline line */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "20px", flexShrink: 0 }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: LANG_COLORS[run.language] || theme.accent, flexShrink: 0, marginTop: "6px" }} />
                    {i < Math.min(runHistory.length, 8) - 1 && <div style={{ width: "1px", flex: 1, backgroundColor: theme.border, margin: "4px 0" }} />}
                  </div>
                  {/* Content */}
                  <div style={{ paddingBottom: "16px", flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                      <span className="font-body" style={{ fontSize: "13px", fontWeight: 500, color: theme.text }}>Ran {run.project_name}</span>
                      <span className="font-mono" style={{ fontSize: "9px", padding: "1px 6px", borderRadius: "3px", backgroundColor: `${LANG_COLORS[run.language] || theme.accent}20`, color: LANG_COLORS[run.language] || theme.accent, fontWeight: 600, textTransform: "uppercase" }}>
                        {run.language}
                      </span>
                    </div>
                    <span className="font-mono" style={{ fontSize: "11px", color: theme.faint }}>{timeAgo(run.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Feedback Section — admin only */}
        {user?.email === "vivekpankhaniya43@gmail.com" && (
          <div style={{ marginTop: "48px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <h2 className="font-display" style={{ fontSize: "22px", fontWeight: 400, display: "flex", alignItems: "center", gap: "8px" }}>
                <MessageSquare size={20} style={{ color: theme.accent }} /> Feedback
              </h2>
              <button onClick={() => setShowFeedback(!showFeedback)} className="font-mono"
                style={{ fontSize: "12px", padding: "6px 14px", borderRadius: "6px", backgroundColor: theme.panel, color: theme.muted, border: `1px solid ${theme.border}`, cursor: "pointer", transition: "all 0.15s ease" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = theme.accent; e.currentTarget.style.color = theme.text; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.muted; }}>
                {showFeedback ? "Hide" : "View All"}
              </button>
            </div>

            {showFeedback && (
              <FeedbackList theme={theme} email={user?.email || ""} />
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
