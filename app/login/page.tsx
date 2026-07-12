"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { Instrument_Serif, Inter } from "next/font/google";
import Footer from "@/components/Footer";
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
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const { theme } = useTheme();
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = (): Errors => {
    const e: Errors = {};

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
    setTouched({ email: true, password: true });

    if (Object.keys(validationErrors).length === 0) {
      await login(email.trim().toLowerCase(), password);
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
              Welcome <span style={{ fontStyle: "italic" }}>back.</span>
            </h1>
            <p className="font-body" style={{ fontSize: "14px", color: theme.muted }}>
              Sign in to continue to CodeIQ.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Email */}
            <div>
              <label className="font-mono" style={labelStyle}>Email</label>
              <input
                type="email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => handleBlur("email")}
                placeholder="you@example.com" className="font-body"
                style={inputStyle("email")}
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
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur("password")}
                  placeholder="••••••••" className="font-body"
                  style={{ ...inputStyle("password"), paddingRight: "40px" }}
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

            <button type="submit" className="font-body" style={{ marginTop: "8px", fontWeight: 500, fontSize: "14px", backgroundColor: theme.accent, color: theme.bg, padding: "12px 24px", borderRadius: "8px", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "background 0.2s ease" }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.accentHover; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = theme.accent; }}
            >
              Sign in <ArrowRight size={16} />
            </button>
          </form>

          <div style={{ display: "flex", alignItems: "center", gap: "16px", margin: "28px 0" }}>
            <div style={{ flex: 1, height: "1px", backgroundColor: theme.border }} />
            <span className="font-mono" style={{ fontSize: "11px", color: theme.faint }}>or</span>
            <div style={{ flex: 1, height: "1px", backgroundColor: theme.border }} />
          </div>

          <GoogleSignIn onSuccess={loginWithGoogle} text="Continue with Google" />

          <p className="font-body" style={{ fontSize: "13px", color: theme.muted, textAlign: "center", marginTop: "28px" }}>
            Don&apos;t have an account?{" "}
            <Link href="/signup" style={{ color: theme.accent, textDecoration: "none", fontWeight: 500 }}>Sign up</Link>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
