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
import { Home, Code2, LayoutDashboard, BookOpen, Sparkles, Palette, User, LogIn } from "lucide-react";

export default function Navbar() {
  const { theme, themeKey, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [themeSheetOpen, setThemeSheetOpen] = useState(false);
  const themesLinkRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close desktop dropdowns on outside click
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
    ...(user ? [{ label: "Editor", href: "/editor", icon: Code2 }] : []),
    ...(user ? [{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard }] : []),
    { label: "Features", href: user ? "/features" : "/signup", icon: Sparkles },
    { label: "Docs", href: user ? "/docs" : "/signup", icon: BookOpen },
  ];

  // ─── Mobile: Bottom Navigation Bar ────────────────────────────────
  if (isMobile) {
    // Bottom nav items
    const bottomNavItems = user
      ? [
          { label: "Home", href: "/", icon: Home },
          { label: "Editor", href: "/editor", icon: Code2 },
          { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
          { label: "Themes", icon: Palette, onClick: () => setThemeSheetOpen(true) },
          { label: "Profile", icon: User, onClick: () => setProfileOpen(!profileOpen) },
        ]
      : [
          { label: "Home", href: "/", icon: Home },
          { label: "Features", href: "/signup", icon: Sparkles },
          { label: "Docs", href: "/signup", icon: BookOpen },
          { label: "Themes", icon: Palette, onClick: () => setThemeSheetOpen(true) },
          { label: "Login", href: "/login", icon: LogIn },
        ];

    return (
      <>
        {/* Top navbar — logo only */}
        <nav style={{ width: "100%", boxSizing: "border-box", padding: "12px 16px", backgroundColor: theme.panel, borderBottom: `1px solid ${theme.border}` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
              <Logo iconSize={30} textSize={22} />
            </Link>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {user && (
                <button onClick={() => window.location.href = "/editor"}
                  style={{ padding: "6px 14px", fontSize: "12px", fontWeight: 600, backgroundColor: theme.accent, color: theme.bg, border: "none", borderRadius: "20px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}>
                  <Code2 size={13} /> Run
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* Profile dropdown sheet */}
        {profileOpen && user && (
          <>
            <div onClick={() => setProfileOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 998, backgroundColor: "rgba(0,0,0,0.4)" }} />
            <div style={{
              position: "fixed", bottom: "calc(68px + env(safe-area-inset-bottom, 0px))", left: "16px", right: "16px", zIndex: 1001,
              backgroundColor: theme.panel, border: `1px solid ${theme.border}`,
              borderRadius: "16px", padding: "16px",
              boxShadow: "0 -8px 32px rgba(0,0,0,0.3)",
              animation: "sheetSlideUp 0.25s ease",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px", paddingBottom: "14px", borderBottom: `1px solid ${theme.border}` }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: `${theme.accent}20`, border: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span className="font-body" style={{ fontSize: "16px", fontWeight: 600, color: theme.accent, textTransform: "uppercase" }}>{user.name.charAt(0)}</span>
                </div>
                <div>
                  <div className="font-body" style={{ fontSize: "14px", fontWeight: 600, color: theme.text }}>{user.name}</div>
                  <div className="font-mono" style={{ fontSize: "11px", color: theme.faint }}>{user.email}</div>
                </div>
              </div>
              <button onClick={() => { logout(); setProfileOpen(false); }}
                style={{ width: "100%", padding: "10px", fontSize: "13px", fontWeight: 500, backgroundColor: "#EF444415", color: "#EF4444", border: `1px solid #EF444430`, borderRadius: "10px", cursor: "pointer", textAlign: "center" }}>
                Logout
              </button>
            </div>
          </>
        )}

        {/* Theme bottom sheet */}
        {themeSheetOpen && (
          <>
            <div onClick={() => setThemeSheetOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 998, backgroundColor: "rgba(0,0,0,0.4)" }} />
            <div style={{
              position: "fixed", bottom: "calc(68px + env(safe-area-inset-bottom, 0px))", left: "16px", right: "16px", zIndex: 1001,
              backgroundColor: theme.panel, border: `1px solid ${theme.border}`,
              borderRadius: "16px", padding: "12px",
              boxShadow: "0 -8px 32px rgba(0,0,0,0.3)",
              animation: "sheetSlideUp 0.25s ease",
              maxHeight: "50vh", overflowY: "auto",
            }}>
              <div className="font-mono" style={{ fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: theme.faint, padding: "6px 8px 8px" }}>
                Choose Theme
              </div>
              {(Object.keys(themes) as ThemeKey[]).map((key) => {
                const t = themes[key]; const isActive = key === themeKey;
                const Icon = themeIcons[key];
                return (
                  <button key={key} onClick={() => { setTheme(key); setThemeSheetOpen(false); }}
                    style={{
                      display: "flex", alignItems: "center", gap: "12px", width: "100%",
                      padding: "12px 10px", border: "none", borderRadius: "10px",
                      backgroundColor: isActive ? `${theme.accent}15` : "transparent",
                      color: isActive ? theme.accent : theme.text, cursor: "pointer",
                      fontSize: "14px", fontWeight: 500, textAlign: "left",
                    }}>
                    <Icon size={16} style={{ flexShrink: 0 }} />
                    <span>{t.label}</span>
                    {isActive && <span style={{ marginLeft: "auto", width: "6px", height: "6px", borderRadius: "50%", backgroundColor: theme.accent }} />}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* Bottom navigation bar */}
        <nav style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 997,
          backgroundColor: theme.panel,
          borderTop: `1px solid ${theme.border}`,
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
          boxShadow: "0 -2px 16px rgba(0,0,0,0.15)",
        }} role="navigation" aria-label="Main navigation">
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-around",
            height: "60px",
          }}>
            {bottomNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.href ? pathname === item.href : false;
              return (
                <Link
                  key={item.label}
                  href={item.href || "#"}
                  onClick={(e) => {
                    if (item.onClick) { e.preventDefault(); item.onClick(); }
                  }}
                  aria-label={item.label}
                  aria-current={isActive ? "page" : undefined}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    gap: "2px", textDecoration: "none", flex: 1, height: "100%",
                    color: isActive ? theme.accent : theme.muted,
                    transition: "color 0.2s ease",
                    WebkitTapHighlightColor: "transparent",
                    position: "relative",
                  }}>
                  {/* Active indicator dot */}
                  {isActive && (
                    <span style={{
                      position: "absolute", top: "4px",
                      width: "4px", height: "4px", borderRadius: "50%",
                      backgroundColor: theme.accent,
                    }} />
                  )}
                  <Icon size={22} strokeWidth={isActive ? 2.2 : 1.6} style={{ marginTop: isActive ? "4px" : "0", transition: "all 0.2s ease" }} />
                  <span className="font-mono" style={{
                    fontSize: "10px",
                    fontWeight: isActive ? 600 : 400,
                    letterSpacing: "0.01em",
                    transition: "all 0.2s ease",
                  }}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>

        <style>{`
          @keyframes sheetSlideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        `}</style>
      </>
    );
  }

  // ─── Desktop: original layout ──────────────────────────────────────
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
