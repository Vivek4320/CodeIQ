"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/components/landing/ThemeContext";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { Shield, ShieldOff } from "lucide-react";

export default function UsersPage() {
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const load = () => {
    setLoading(true);
    fetch(`/api/admin/users?page=${page}&search=${encodeURIComponent(search)}`).then(r => { if (!r.ok) throw new Error(); return r.json(); }).then(d => { setUsers(d.users || []); setTotal(d.total || 0); setError(false); }).catch(() => setError(true)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [page, search]);

  const toggleRole = async (userId: number, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    await fetch("/api/admin/users", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role: newRole }),
    });
    load();
  };

  if (loading) return <p style={{ color: theme.faint }}>Loading users...</p>;
  if (error) return <p style={{ color: "#EF4444" }}>Unable to load data. Please try again.</p>;

  return (
    <div>
      <div style={{ display: "flex", gap: "12px", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 600 }}>Users ({total})</h1>
        <input value={search} onChange={(event) => { setPage(1); setSearch(event.target.value); }} placeholder="Search name or email" style={{ padding: "9px 12px", width: isMobile ? "100%" : "260px", background: theme.panel, color: theme.text, border: `1px solid ${theme.border}`, borderRadius: "6px" }} />
      </div>
      {users.length === 0 && <p style={{ color: theme.faint, marginBottom: "16px" }}>No data available yet.</p>}
      <div style={{ border: `1px solid ${theme.border}`, borderRadius: "12px", overflow: "hidden", overflowX: isMobile ? "auto" : "hidden" }}>
        <table style={{ width: isMobile ? "980px" : "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr style={{ backgroundColor: theme.panel, borderBottom: `1px solid ${theme.border}` }}>
              {["Name", "Email", "Role", "Joined", "Last activity", "Projects", "Runs", "Actions"].map(h => (
                <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: theme.faint, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u: any) => (
              <tr key={u.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                <td style={{ padding: "10px 12px", fontWeight: 500 }}>{u.name}</td>
                <td style={{ padding: "10px 12px", color: theme.faint, fontFamily: "monospace", fontSize: "12px" }}>{u.email}</td>
                <td style={{ padding: "10px 12px" }}>
                  <span style={{ padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: 600, backgroundColor: u.role === "admin" ? "#FBBF2420" : `${theme.accent}15`, color: u.role === "admin" ? "#FBBF24" : theme.accent }}>
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: "10px 12px", color: theme.faint, fontSize: "12px" }}>{new Date(u.created_at).toLocaleDateString()}</td>
                <td style={{ padding: "10px 12px", color: theme.faint, fontSize: "12px" }}>{u.last_activity ? new Date(u.last_activity).toLocaleDateString() : "No activity"}</td>
                <td style={{ padding: "10px 12px", color: theme.faint }}>{u.project_count}</td>
                <td style={{ padding: "10px 12px", color: theme.faint }}>{u.execution_count}</td>
                <td style={{ padding: "10px 12px" }}>
                  {u.email !== "vivekpankhaniya43@gmail.com" && (
                    <button onClick={() => toggleRole(u.id, u.role)} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "4px 8px", fontSize: "11px", backgroundColor: "transparent", color: u.role === "admin" ? "#EF4444" : "#34D399", border: `1px solid ${u.role === "admin" ? "#EF444440" : "#34D39940"}`, borderRadius: "4px", cursor: "pointer" }}>
                      {u.role === "admin" ? <><ShieldOff size={12} /> Remove Admin</> : <><Shield size={12} /> Make Admin</>}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {total > 20 && <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "14px" }}><button disabled={page === 1} onClick={() => setPage(page - 1)} style={{ padding: "7px 12px" }}>Previous</button><span style={{ padding: "7px 4px", color: theme.faint }}>Page {page}</span><button disabled={page * 20 >= total} onClick={() => setPage(page + 1)} style={{ padding: "7px 12px" }}>Next</button></div>}
    </div>
  );
}
