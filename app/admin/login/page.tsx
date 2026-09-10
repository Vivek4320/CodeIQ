"use client";

import { useState } from "react";
import { useTheme } from "@/components/landing/ThemeContext";
import { Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Invalid admin credentials");
      else window.location.href = "/admin";
    } catch {
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: theme.bg, color: theme.text }}>
      <div style={{ padding: "28px 24px" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "6px", color: theme.muted, textDecoration: "none", fontSize: "13px" }}>
          <ArrowLeft size={14} /> Back to Home
        </Link>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ width: "100%", maxWidth: "380px" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "12px", backgroundColor: `${theme.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Shield size={28} style={{ color: theme.accent }} />
            </div>
            <h1 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "6px" }}>Admin Login</h1>
            <p style={{ fontSize: "13px", color: theme.faint }}>Access the admin dashboard</p>
          </div>

          {error && (
            <div style={{ padding: "10px 14px", marginBottom: "16px", borderRadius: "8px", backgroundColor: "#EF444410", border: "1px solid #EF444430", fontSize: "13px", color: "#EF4444" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: theme.faint, display: "block", marginBottom: "6px" }}>Admin Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com"
                style={{ width: "100%", padding: "10px 14px", fontSize: "14px", backgroundColor: theme.panel, color: theme.text, border: `1px solid ${theme.border}`, borderRadius: "8px", outline: "none", boxSizing: "border-box" }} required />
            </div>
            <div>
              <label style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: theme.faint, display: "block", marginBottom: "6px" }}>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your admin password"
                style={{ width: "100%", padding: "10px 14px", fontSize: "14px", backgroundColor: theme.panel, color: theme.text, border: `1px solid ${theme.border}`, borderRadius: "8px", outline: "none", boxSizing: "border-box" }} required />
            </div>
            <button type="submit" disabled={loading} style={{
              marginTop: "8px", fontWeight: 500, fontSize: "14px",
              backgroundColor: loading ? theme.faint : theme.accent,
              color: theme.bg, padding: "12px 24px", borderRadius: "8px",
              border: "none", cursor: loading ? "not-allowed" : "pointer",
            }}>
              {loading ? "Signing in..." : "Sign in to Admin"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
