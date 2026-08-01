"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/components/landing/ThemeContext";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { Download, X, Share, Plus } from "lucide-react";

export default function PWAInstall() {
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Don't show if already installed
    if (window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
      return;
    }

    // Don't show if dismissed this session
    if (sessionStorage.getItem("pwa-install-dismissed")) return;

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    if (isIOS) {
      // iOS doesn't support beforeinstallprompt — show manual guide
      setTimeout(() => setShowIOSGuide(true), 4000);
      return;
    }

    // Android/Chrome — listen for beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => setShowBanner(true), 2500);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setShowBanner(false);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setShowIOSGuide(false);
    sessionStorage.setItem("pwa-install-dismissed", "true");
  };

  if (isInstalled) return null;

  // iOS Safari install guide
  if (showIOSGuide && !sessionStorage.getItem("pwa-install-dismissed")) {
    return (
      <div style={{
        position: "fixed",
        bottom: isMobile ? "calc(68px + env(safe-area-inset-bottom, 0px))" : "24px",
        left: isMobile ? "12px" : "auto",
        right: isMobile ? "12px" : "24px",
        width: isMobile ? "auto" : "360px",
        zIndex: 900,
        backgroundColor: theme.panel,
        border: `1px solid ${theme.border}`,
        borderRadius: "16px",
        padding: "16px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        animation: "pwaSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      }}>
        {/* Close button */}
        <button onClick={handleDismiss} style={{
          position: "absolute", top: "8px", right: "8px",
          width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center",
          backgroundColor: "transparent", border: "none", cursor: "pointer", color: theme.faint, borderRadius: "6px",
        }}>
          <X size={14} />
        </button>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
          <div style={{
            width: "40px", height: "40px", borderRadius: "10px",
            backgroundColor: `${theme.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <Download size={18} style={{ color: theme.accent }} />
          </div>
          <div>
            <div className="font-body" style={{ fontSize: "14px", fontWeight: 600, color: theme.text }}>Install CodeIQ</div>
            <div className="font-body" style={{ fontSize: "11px", color: theme.muted }}>Add to your Home Screen</div>
          </div>
        </div>

        {/* Steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Step num={1} theme={theme}>
            Tap the <ShareIcon theme={theme} /> <b>Share</b> button below
          </Step>
          <Step num={2} theme={theme}>
            Scroll down and tap <b>&quot;Add to Home Screen&quot;</b>
          </Step>
          <Step num={3} theme={theme}>
            Tap <b>Add</b> to confirm
          </Step>
        </div>

        {/* Bottom hint */}
        <div style={{
          marginTop: "12px", padding: "8px 12px", borderRadius: "8px",
          backgroundColor: `${theme.accent}08`, border: `1px solid ${theme.accent}15`,
        }}>
          <span className="font-mono" style={{ fontSize: "10px", color: theme.muted }}>
            💡 Look for the icon below the address bar ↑
          </span>
        </div>
      </div>
    );
  }

  // Android/Chrome install banner
  if (showBanner && !sessionStorage.getItem("pwa-install-dismissed")) {
    return (
      <div style={{
        position: "fixed",
        bottom: isMobile ? "calc(68px + env(safe-area-inset-bottom, 0px))" : "24px",
        left: isMobile ? "12px" : "auto",
        right: isMobile ? "12px" : "24px",
        width: isMobile ? "auto" : "360px",
        zIndex: 900,
        backgroundColor: theme.panel,
        border: `1px solid ${theme.border}`,
        borderRadius: "16px",
        padding: "14px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        animation: "pwaSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      }}>
        <div style={{
          width: "42px", height: "42px", borderRadius: "11px",
          backgroundColor: `${theme.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Download size={19} style={{ color: theme.accent }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="font-body" style={{ fontSize: "13px", fontWeight: 600, color: theme.text, marginBottom: "1px" }}>
            Install CodeIQ
          </div>
          <div className="font-body" style={{ fontSize: "11px", color: theme.muted }}>
            Add to home screen for quick access
          </div>
        </div>
        <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
          <button onClick={handleInstall} style={{
            padding: "8px 16px", fontSize: "12px", fontWeight: 600,
            backgroundColor: theme.accent, color: theme.bg, border: "none", borderRadius: "8px", cursor: "pointer",
          }}>
            Install
          </button>
          <button onClick={handleDismiss} style={{
            width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center",
            backgroundColor: "transparent", border: "none", cursor: "pointer", color: theme.faint, borderRadius: "6px",
          }}>
            <X size={14} />
          </button>
        </div>
      </div>
    );
  }

  return null;
}

function Step({ num, theme, children }: { num: number; theme: any; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
      <div style={{
        width: "22px", height: "22px", borderRadius: "50%", flexShrink: 0,
        backgroundColor: `${theme.accent}15`, display: "flex", alignItems: "center", justifyContent: "center",
        marginTop: "1px",
      }}>
        <span className="font-mono" style={{ fontSize: "10px", fontWeight: 700, color: theme.accent }}>{num}</span>
      </div>
      <span className="font-body" style={{ fontSize: "12px", color: theme.muted, lineHeight: 1.5 }}>
        {children}
      </span>
    </div>
  );
}

function ShareIcon({ theme }: { theme: any }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: "18px", height: "18px", borderRadius: "4px",
      backgroundColor: `${theme.accent}20`, verticalAlign: "middle", margin: "0 2px",
    }}>
      <Share size={11} style={{ color: theme.accent }} />
    </span>
  );
}
