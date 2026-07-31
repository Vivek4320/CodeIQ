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

  const load = () => {
    const email = localStorage.getItem("codeiq_admin");
    if (!email) return;
    fetch(`/api/admin/users?email=${email}`).then(r => r.json()).then(d => { setUsers(d.users || []); setLoading(false); });
  };
  useEffect(() => { load(); }, []);

  const toggleRole = async (userId: number, currentRole: string) => {
    const email = localStorage.getItem("codeiq_admin");
    if (!email) return;
    const newRole = currentRole === "admin" ? "user" : "admin";
    await fetch("/api/admin/users", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, userId, role: newRole }),
    });
    load();
  };

  if (loading) return <p style={{ color: theme.faint }}>Loading users...</p>;

  return (
    <div>
      <h1 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "24px" }}>Users ({users.length})</h1>
      <div style={{ border: `1px solid ${theme.border}`, borderRadius: "12px", overflow: "hidden", overflowX: isMobile ? "auto" : "hidden" }}>
        <table style={{ width: isMobile ? "600px" : "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr style={{ backgroundColor: theme.panel, borderBottom: `1px solid ${theme.border}` }}>
              {["Name", "Email", "Role", "Joined", "Actions"].map(h => (
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
    </div>
  );
}
