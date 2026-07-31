"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { Instrument_Serif, Inter } from "next/font/google";
import Logo from "@/components/landing/Logo";
import { useTheme } from "@/components/landing/ThemeContext";
import { useAuth } from "@/components/AuthContext";
import GoogleSignIn from "@/components/GoogleSignIn";

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-display",
});
const bodyFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

interface Errors {
  name?: string;
  email?: string;
  password?: string;
}

export default function SignupPage() {
  const { theme } = useTheme();
  const { signup, loginWithGoogle } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): Errors => {
    const e: Errors = {};

    if (!name.trim()) {
      e.name = "Name is required";
    } else if (name.trim().length < 2) {
      e.name = "Name must be at least 2 characters";
    }

    if (!email.trim()) {
      e.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.email = "Please enter a valid email";
    }

    if (!password) {
      e.password = "Password is required";
    } else if (password.length < 6) {
      e.password = "Password must be at least 6 characters";
    }

    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    setTouched({ name: true, email: true, password: true });
    setServerError("");

    if (Object.keys(validationErrors).length === 0) {
      setIsLoading(true);
      const result = await signup(name.trim(), email.trim().toLowerCase(), password);
      if (!result.ok && result.error) {
        setServerError(result.error);
      }
      setIsLoading(false);
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const validationErrors = validate();
    setErrors(validationErrors);
  };

  const getBorderColor = (field: keyof Errors) => {
    if (touched[field] && errors[field]) return "#EF4444";
    if (touched[field] && !errors[field]) return theme.accent;
    return theme.border;
  };

  const inputStyle = (field: keyof Errors): React.CSSProperties => ({
    width: "100%", padding: "12px 14px", fontSize: "14px",
    backgroundColor: theme.panel, color: theme.text,
    border: `1px solid ${getBorderColor(field)}`, borderRadius: "8px",
    outline: "none", boxSizing: "border-box",
    transition: "border-color 0.2s ease",
  });

  const labelStyle: React.CSSProperties = {
    fontSize: "11px", fontWeight: 600, textTransform: "uppercase",
    letterSpacing: "0.08em", color: theme.faint,
    display: "block", marginBottom: "6px",
  };

  const errorStyle: React.CSSProperties = {
    fontSize: "11px", color: "#EF4444",
    marginTop: "4px", display: "block",
  };

  return (
    <div
      className={`${display.variable} ${bodyFont.variable}`}
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: theme.bg, color: theme.text }}
    >
      <div style={{ padding: "28px 24px", maxWidth: "1040px", width: "100%", margin: "0 auto" }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <Logo iconSize={36} textSize={24} />
        </Link>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px 80px" }}>
        <div style={{ width: "100%", maxWidth: "380px" }}>
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <h1 className="font-display" style={{ fontSize: "32px", fontWeight: 400, marginBottom: "8px" }}>
              Create your <span style={{ fontStyle: "italic" }}>account.</span>
            </h1>
            <p className="font-body" style={{ fontSize: "14px", color: theme.muted }}>
              Start writing code in seconds.
            </p>
          </div>

          {/* Server error banner */}
          {serverError && (
            <div style={{
              padding: "10px 14px", marginBottom: "16px", borderRadius: "8px",
              backgroundColor: "#EF444410", border: "1px solid #EF444430",
              fontSize: "13px", color: "#EF4444", fontFamily: "var(--font-body), sans-serif",
            }}>
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Name */}
            <div>
              <label className="font-mono" style={labelStyle}>Name</label>
              <input
                type="text" value={name}
                onChange={(e) => { setName(e.target.value); setServerError(""); }}
                onBlur={() => handleBlur("name")}
                placeholder="Vivek" className="font-body"
                style={inputStyle("name")}
                disabled={isLoading}
              />
              {touched.name && errors.name && <span className="font-body" style={errorStyle}>{errors.name}</span>}
            </div>

            {/* Email */}
            <div>
              <label className="font-mono" style={labelStyle}>Email</label>
              <input
                type="email" value={email}
                onChange={(e) => { setEmail(e.target.value); setServerError(""); }}
                onBlur={() => handleBlur("email")}
                placeholder="you@example.com" className="font-body"
                style={inputStyle("email")}
                disabled={isLoading}
              />
              {touched.email && errors.email && <span className="font-body" style={errorStyle}>{errors.email}</span>}
            </div>

            {/* Password */}
            <div>
              <label className="font-mono" style={labelStyle}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setServerError(""); }}
                  onBlur={() => handleBlur("password")}
                  placeholder="••••••••" className="font-body"
                  style={{ ...inputStyle("password"), paddingRight: "40px" }}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer",
                    color: theme.faint, padding: "2px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = theme.text; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = theme.faint; }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {touched.password && errors.password && <span className="font-body" style={errorStyle}>{errors.password}</span>}
            </div>

            <button type="submit" disabled={isLoading} className="font-body" style={{
              marginTop: "8px", fontWeight: 500, fontSize: "14px",
              backgroundColor: isLoading ? theme.faint : theme.accent,
              color: theme.bg, padding: "12px 24px", borderRadius: "8px",
              border: "none", cursor: isLoading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              transition: "background 0.2s ease",
            }}
              onMouseEnter={(e) => { if (!isLoading) e.currentTarget.style.backgroundColor = theme.accentHover; }}
              onMouseLeave={(e) => { if (!isLoading) e.currentTarget.style.backgroundColor = theme.accent; }}
            >
              {isLoading ? (
                <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Creating account...</>
              ) : (
                <>Create account <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div style={{ display: "flex", alignItems: "center", gap: "16px", margin: "28px 0" }}>
            <div style={{ flex: 1, height: "1px", backgroundColor: theme.border }} />
            <span className="font-mono" style={{ fontSize: "11px", color: theme.faint }}>or</span>
            <div style={{ flex: 1, height: "1px", backgroundColor: theme.border }} />
          </div>

          <GoogleSignIn onSuccess={loginWithGoogle} text="Sign up with Google" />

          <p className="font-body" style={{ fontSize: "13px", color: theme.muted, textAlign: "center", marginTop: "28px" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: theme.accent, textDecoration: "none", fontWeight: 500 }}>Sign in</Link>
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
