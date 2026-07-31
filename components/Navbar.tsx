"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/landing/ThemeContext";
import { themes, type ThemeKey } from "@/components/landing/theme";
import { themeIcons } from "@/components/landing/ThemeIcons";
import Logo from "@/components/landing/Logo";
import { useAuth } from "@/components/AuthContext";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { theme, themeKey, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const themesLinkRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        themesLinkRef.current && !themesLinkRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    if (open || profileOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, profileOpen]);

  const navLinks = [
    ...(user ? [{ label: "Editor", href: "/editor" }] : []),
    ...(user ? [{ label: "Dashboard", href: "/dashboard" }] : []),
    { label: "Features", href: user ? "/features" : "/signup" },
    { label: "Docs", href: user ? "/docs" : "/signup" },
  ];

  // Mobile: hamburger menu
  if (isMobile) {
    return (
      <nav style={{ width: "100%", boxSizing: "border-box", padding: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <Logo iconSize={28} textSize={20} />
          </Link>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ background: "none", border: "none", color: theme.text, cursor: "pointer", padding: "8px" }}>
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div style={{ marginTop: "16px", padding: "16px", border: `1px solid ${theme.border}`, borderRadius: "12px", backgroundColor: theme.panel }}>
            {navLinks.map((item) => (
              <Link key={item.label} href={item.href} onClick={() => setMobileMenuOpen(false)}
                style={{ display: "block", padding: "12px 0", fontSize: "15px", fontWeight: 500, color: pathname === item.href ? theme.accent : theme.text, textDecoration: "none", borderBottom: `1px solid ${theme.border}` }}>
                {item.label}
              </Link>
            ))}
            <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
              {user ? (
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} style={{ flex: 1, padding: "10px", fontSize: "14px", fontWeight: 500, backgroundColor: "transparent", color: theme.muted, border: `1px solid ${theme.border}`, borderRadius: "8px", cursor: "pointer" }}>
                  Logout
                </button>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} style={{ flex: 1, padding: "10px", fontSize: "14px", fontWeight: 500, color: theme.text, border: `1px solid ${theme.border}`, borderRadius: "8px", textAlign: "center", textDecoration: "none" }}>
                    Login
                  </Link>
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)} style={{ flex: 1, padding: "10px", fontSize: "14px", fontWeight: 500, backgroundColor: theme.text, color: theme.bg, borderRadius: "8px", textAlign: "center", textDecoration: "none" }}>
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    );
  }

  // Desktop: original layout
  return (
    <nav style={{ width: "100%", boxSizing: "border-box", padding: "36px 24px 28px" }}>
      <div style={{ maxWidth: "1040px", margin: "0 auto", display: "grid", gridTemplateColumns: "auto 1fr", alignItems: "center" }}>
        <div style={{ flexShrink: 0 }}>
          <Link href="/" style={{ textDecoration: "none" }}><Logo iconSize={42} textSize={28} /></Link>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "32px" }}>
          {navLinks.map((item) => (
            <Link key={item.label} href={item.href} className="font-mono nav-link"
              style={{ fontSize: "12px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.12em", color: pathname === item.href ? theme.text : theme.muted, textDecoration: "none", position: "relative", cursor: "pointer", paddingTop: "2px" }}>
              {item.label}
              <span className="nav-underline" style={{ backgroundColor: theme.accent, width: pathname === item.href ? "100%" : undefined }} />
            </Link>
          ))}
          <div ref={themesLinkRef} style={{ position: "relative" }}>
            <a href="#" className="font-mono nav-link" onClick={(e) => { e.preventDefault(); setOpen(!open); }}
              style={{ fontSize: "12px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.12em", color: open ? theme.text : theme.muted, textDecoration: "none", position: "relative", cursor: "pointer" }}>
              Themes
              <span className="nav-underline" style={{ backgroundColor: theme.accent, width: open ? "100%" : undefined }} />
            </a>
            {open && (
              <div ref={dropdownRef} style={{ position: "absolute", top: "calc(100% + 12px)", left: "50%", transform: "translateX(-50%)", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "12px", padding: "8px", minWidth: "200px", zIndex: 50, boxShadow: "0 20px 60px -15px rgba(0,0,0,0.5)" }}>
                <div className="font-mono" style={{ fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: theme.faint, padding: "8px 12px 6px" }}>Choose Theme</div>
                {(Object.keys(themes) as ThemeKey[]).map((key) => {
                  const t = themes[key]; const isActive = key === themeKey;
                  return (
                    <button key={key} onClick={() => { setTheme(key); setOpen(false); }}
                      style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "10px 12px", border: "none", borderRadius: "8px", backgroundColor: isActive ? `${theme.accent}18` : "transparent", color: isActive ? theme.accent : theme.text, cursor: "pointer", fontSize: "14px", fontWeight: 500, textAlign: "left", transition: "background 0.15s ease" }}
                      onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = `${theme.text}08`; }}
                      onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = "transparent"; }}>
                      {(() => { const Icon = themeIcons[key]; return <Icon size={15} style={{ flexShrink: 0 }} />; })()}
                      <span>{t.label}</span>
                      {isActive && <span style={{ marginLeft: "auto", width: "6px", height: "6px", borderRadius: "50%", backgroundColor: theme.accent }} />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          {user ? (
            <div ref={profileRef} style={{ position: "relative" }}>
              <button onClick={() => setProfileOpen(!profileOpen)} style={{ width: "34px", height: "34px", borderRadius: "50%", backgroundColor: `${theme.accent}20`, border: `1px solid ${theme.border}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span className="font-body" style={{ fontSize: "14px", fontWeight: 600, color: theme.accent, textTransform: "uppercase" }}>{user.name.charAt(0)}</span>
              </button>
              {profileOpen && (
                <div style={{ position: "absolute", top: "calc(100% + 10px)", right: 0, backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "12px", padding: "8px", minWidth: "180px", zIndex: 50, boxShadow: "0 20px 60px -15px rgba(0,0,0,0.5)" }}>
                  <div style={{ padding: "10px 12px", borderBottom: `1px solid ${theme.border}`, marginBottom: "4px" }}>
                    <div className="font-body" style={{ fontSize: "13px", fontWeight: 600, color: theme.text }}>{user.name}</div>
                    <div className="font-mono" style={{ fontSize: "11px", color: theme.faint, marginTop: "2px" }}>{user.email}</div>
                  </div>
                  <button onClick={logout} className="font-body" style={{ width: "100%", fontSize: "13px", fontWeight: 500, backgroundColor: "transparent", color: theme.muted, padding: "8px 12px", borderRadius: "6px", border: "none", cursor: "pointer", textAlign: "left" }}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Link href="/login" className="font-body" style={{ fontSize: "14px", fontWeight: 500, color: theme.text, textDecoration: "none", padding: "10px 20px", borderRadius: "4px", border: `1px solid ${theme.border}` }}>Login</Link>
              <Link href="/signup" className="font-body" style={{ fontSize: "14px", fontWeight: 500, backgroundColor: theme.text, color: theme.bg, padding: "10px 22px", borderRadius: "4px", textDecoration: "none" }}>Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
