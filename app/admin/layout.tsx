"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useTheme } from "@/components/landing/ThemeContext";
import Logo from "@/components/landing/Logo";
import { LayoutDashboard, Users, Code2, BarChart3, MessageSquare, ArrowLeft, LogOut, Menu, X } from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/languages", label: "Languages", icon: Code2 },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/feedback", label: "Feedback", icon: MessageSquare },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    try {
      const email = localStorage.getItem("codeiq_admin");
      setAdminEmail(email);
    } catch {}
    setChecking(false);
  }, []);

  useEffect(() => {
    if (!checking && !adminEmail && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [checking, adminEmail, pathname, router]);

  if (pathname === "/admin/login") return <>{children}</>;

  if (checking) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: theme.bg, color: theme.text }}>
        <p style={{ color: theme.faint }}>Checking access...</p>
      </div>
    );
  }

  if (!adminEmail) return null;

  const logout = () => {
    localStorage.removeItem("codeiq_admin");
    router.push("/admin/login");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", backgroundColor: theme.bg, color: theme.text }}>
      {/* Mobile header */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: "48px", zIndex: 40,
        display: "none", alignItems: "center", justifyContent: "space-between",
        padding: "0 16px", borderBottom: `1px solid ${theme.border}`,
        backgroundColor: theme.panel,
      }} className="admin-mobile-header" suppressHydrationWarning>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Logo iconSize={18} textSize={0} />
          <span style={{ fontSize: "12px", fontWeight: 600 }}>Admin</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "none", color: theme.text, cursor: "pointer", padding: "8px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "44px", minWidth: "44px" }}>
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 45 }} />
      )}

      {/* Sidebar */}
      <aside style={{
        width: "220px", borderRight: `1px solid ${theme.border}`,
        display: "flex", flexDirection: "column", flexShrink: 0,
        position: "fixed", top: 0, bottom: 0, left: 0, zIndex: 50,
        backgroundColor: theme.bg,
        transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        transform: sidebarOpen ? "translateX(0)" : undefined,
      }} className="admin-sidebar">
        <div style={{ padding: "16px", borderBottom: `1px solid ${theme.border}` }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px", color: theme.muted, fontSize: "12px" }}>
            <ArrowLeft size={14} /> Back to Home
          </Link>
        </div>
        <div style={{ padding: "16px 12px 8px", display: "flex", alignItems: "center" }}>
          <Logo iconSize={20} textSize={0} />
          <span style={{ fontSize: "11px", fontWeight: 700, color: theme.faint, textTransform: "uppercase", letterSpacing: "0.1em", marginLeft: "8px" }}>Admin</span>
        </div>
        <nav style={{ flex: 1, padding: "8px" }}>
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
            return (
              <Link key={href} href={href} onClick={() => setSidebarOpen(false)} style={{
                display: "flex", alignItems: "center", gap: "10px", padding: "12px 14px",
                borderRadius: "8px", fontSize: "13px", fontWeight: 500, textDecoration: "none",
                color: active ? theme.accent : theme.muted,
                backgroundColor: active ? `${theme.accent}12` : "transparent",
                marginBottom: "2px", transition: "all 0.15s ease",
                minHeight: "44px",
              }}>
                <Icon size={16} /> {label}
              </Link>
            );
          })}
        </nav>
        <div style={{ padding: "12px 16px", borderTop: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "11px", color: theme.faint, overflow: "hidden", textOverflow: "ellipsis" }}>{adminEmail}</span>
          <button onClick={logout} style={{ background: "none", border: "none", cursor: "pointer", color: theme.faint, padding: "4px" }} title="Logout">
            <LogOut size={14} />
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: "auto", padding: "24px 32px" }} className="admin-main">
        {children}
      </main>

      {/* Responsive CSS */}
      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar {
            transform: translateX(-100%) !important;
            box-shadow: 4px 0 20px rgba(0,0,0,0.3);
          }
          .admin-sidebar.open {
            transform: translateX(0) !important;
          }
          .admin-main {
            padding: 64px 16px 16px !important;
          }
          .admin-mobile-header {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}
