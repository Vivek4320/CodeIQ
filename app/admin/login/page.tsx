"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";
import { useTheme } from "@/components/landing/ThemeContext";

export default function AdminLoginPage() {
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error || "Invalid admin credentials");
        return;
      }

      window.location.assign("/admin");
    } catch {
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", background: theme.bg, color: theme.text, display: "grid", placeItems: "center", padding: "24px" }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", opacity: 0.35, backgroundImage: `linear-gradient(${theme.border} 1px, transparent 1px), linear-gradient(90deg, ${theme.border} 1px, transparent 1px)`, backgroundSize: "48px 48px", maskImage: "linear-gradient(to bottom, black, transparent 75%)" }} />

      <div style={{ width: "100%", maxWidth: "430px", position: "relative" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "7px", color: theme.muted, textDecoration: "none", fontSize: "13px", marginBottom: "22px" }}>
          <ArrowLeft size={15} /> Back to CodeIQ
        </Link>

        <section style={{ border: `1px solid ${theme.border}`, background: theme.panel, borderRadius: "18px", padding: "32px", boxShadow: `0 20px 60px ${theme.text}0d` }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "26px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", display: "grid", placeItems: "center", background: `${theme.accent}14`, color: theme.accent, border: `1px solid ${theme.accent}25` }}>
              <ShieldCheck size={25} />
            </div>
            <div>
              <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: theme.accent }}>CodeIQ</div>
              <h1 style={{ margin: "3px 0 0", fontSize: "23px", lineHeight: 1.2 }}>Admin Portal</h1>
            </div>
          </div>

          <p style={{ margin: "0 0 24px", color: theme.muted, fontSize: "13px", lineHeight: 1.6 }}>
            Sign in with the administrator credentials configured for this deployment.
          </p>

          {error && (
            <div role="alert" style={{ marginBottom: "18px", padding: "11px 13px", borderRadius: "9px", border: "1px solid #ef444455", background: "#ef444410", color: "#ef4444", fontSize: "13px", lineHeight: 1.5 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: "grid", gap: "17px" }}>
            <label style={{ display: "grid", gap: "7px" }}>
              <span style={{ fontSize: "12px", fontWeight: 600, color: theme.faint }}>Admin email</span>
              <input
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@example.com"
                required
                disabled={loading}
                style={{ width: "100%", boxSizing: "border-box", padding: "12px 13px", borderRadius: "9px", border: `1px solid ${theme.border}`, background: theme.bg, color: theme.text, outline: "none", fontSize: "14px" }}
              />
            </label>

            <label style={{ display: "grid", gap: "7px" }}>
              <span style={{ fontSize: "12px", fontWeight: 600, color: theme.faint }}>Password</span>
              <div style={{ position: "relative" }}>
                <LockKeyhole size={16} style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", color: theme.faint, pointerEvents: "none" }} />
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter admin password"
                  required
                  disabled={loading}
                  style={{ width: "100%", boxSizing: "border-box", padding: "12px 44px 12px 38px", borderRadius: "9px", border: `1px solid ${theme.border}`, background: theme.bg, color: theme.text, outline: "none", fontSize: "14px" }}
                />
                <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"} style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", border: 0, background: "transparent", color: theme.faint, cursor: "pointer", padding: "8px" }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </label>

            <button type="submit" disabled={loading} style={{ marginTop: "3px", minHeight: "44px", border: 0, borderRadius: "9px", background: loading ? theme.faint : theme.accent, color: theme.bg, fontSize: "14px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}>
              {loading ? "Signing in…" : "Sign in to Admin"}
            </button>
          </form>

          <div style={{ marginTop: "22px", paddingTop: "17px", borderTop: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "center", gap: "7px", color: theme.faint, fontSize: "11px" }}>
            <LockKeyhole size={13} /> Secure administrator session
          </div>
        </section>
      </div>
    </main>
  );
}
