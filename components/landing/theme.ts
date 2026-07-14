export interface ThemeColors {
  bg: string;
  panel: string;
  text: string;
  muted: string;
  faint: string;
  border: string;
  accent: string;
  accentHover: string;
  cardBg: string;
  cardBorder: string;
  codeBg: string;
  codeText: string;
  heroGlow: string;
  navbarBg: string;
}

export const themes: Record<string, ThemeColors & { label: string }> = {
  midnight: {
    label: "Midnight",
    bg: "#000000",
    panel: "#0A0A0A",
    text: "#FFFFFF",
    muted: "rgba(255,255,255,0.55)",
    faint: "rgba(255,255,255,0.35)",
    border: "rgba(255,255,255,0.14)",
    accent: "#FFFFFF",
    accentHover: "rgba(255,255,255,0.85)",
    cardBg: "#0A0A0A",
    cardBorder: "rgba(255,255,255,0.14)",
    codeBg: "#0A0A0A",
    codeText: "rgba(255,255,255,0.85)",
    heroGlow: "rgba(255,255,255,0.03)",
    navbarBg: "rgba(0,0,0,0.8)",
  },
  cyberpunk: {
    label: "Cyberpunk",
    bg: "#0a0014",
    panel: "#120025",
    text: "#F0E6FF",
    muted: "rgba(200,170,255,0.6)",
    faint: "rgba(200,170,255,0.35)",
    border: "rgba(180,80,255,0.25)",
    accent: "#FF2E97",
    accentHover: "#FF5CB8",
    cardBg: "#120025",
    cardBorder: "rgba(180,80,255,0.3)",
    codeBg: "#120025",
    codeText: "rgba(200,170,255,0.85)",
    heroGlow: "rgba(180,80,255,0.08)",
    navbarBg: "rgba(10,0,20,0.85)",
  },
  retro: {
    label: "Retro Gaming",
    bg: "#1a1a2e",
    panel: "#16213e",
    text: "#EAEAEA",
    muted: "rgba(234,234,234,0.55)",
    faint: "rgba(234,234,234,0.35)",
    border: "rgba(255,204,0,0.25)",
    accent: "#FFCC00",
    accentHover: "#FFD633",
    cardBg: "#16213e",
    cardBorder: "rgba(255,204,0,0.3)",
    codeBg: "#16213e",
    codeText: "rgba(234,234,234,0.85)",
    heroGlow: "rgba(255,204,0,0.06)",
    navbarBg: "rgba(26,26,46,0.85)",
  },
  neonNights: {
    label: "Neon Nights",
    bg: "#0B0E1A",
    panel: "#111528",
    text: "#E8EAFF",
    muted: "rgba(200,210,255,0.55)",
    faint: "rgba(200,210,255,0.3)",
    border: "rgba(100,140,255,0.2)",
    accent: "#6C63FF",
    accentHover: "#8B85FF",
    cardBg: "#111528",
    cardBorder: "rgba(100,140,255,0.25)",
    codeBg: "#111528",
    codeText: "rgba(200,210,255,0.85)",
    heroGlow: "rgba(108,99,255,0.08)",
    navbarBg: "rgba(11,14,26,0.85)",
  },
  ocean: {
    label: "Deep Ocean",
    bg: "#041C2C",
    panel: "#062438",
    text: "#D4EEFF",
    muted: "rgba(150,200,230,0.6)",
    faint: "rgba(150,200,230,0.35)",
    border: "rgba(0,180,220,0.2)",
    accent: "#00B4DC",
    accentHover: "#33C5E6",
    cardBg: "#062438",
    cardBorder: "rgba(0,180,220,0.25)",
    codeBg: "#062438",
    codeText: "rgba(212,238,255,0.85)",
    heroGlow: "rgba(0,180,220,0.07)",
    navbarBg: "rgba(4,28,44,0.85)",
  },
  hacker: {
    label: "Hacker",
    bg: "#0D0D0D",
    panel: "#141414",
    text: "#00FF41",
    muted: "rgba(0,255,65,0.5)",
    faint: "rgba(0,255,65,0.3)",
    border: "rgba(0,255,65,0.15)",
    accent: "#00FF41",
    accentHover: "#33FF66",
    cardBg: "#141414",
    cardBorder: "rgba(0,255,65,0.2)",
    codeBg: "#141414",
    codeText: "rgba(0,255,65,0.8)",
    heroGlow: "rgba(0,255,65,0.05)",
    navbarBg: "rgba(13,13,13,0.85)",
  },
  lightmode: {
    label: "Light Mode",
    bg: "#FFFFFF",
    panel: "#F5F5F5",
    text: "#111111",
    muted: "rgba(17,17,17,0.55)",
    faint: "rgba(17,17,17,0.35)",
    border: "rgba(0,0,0,0.12)",
    accent: "#111111",
    accentHover: "#333333",
    cardBg: "#F5F5F5",
    cardBorder: "rgba(0,0,0,0.15)",
    codeBg: "#F5F5F5",
    codeText: "rgba(17,17,17,0.85)",
    heroGlow: "rgba(0,0,0,0.03)",
    navbarBg: "rgba(255,255,255,0.85)",
  },
};

export type ThemeKey = keyof typeof themes;

// Keep backward-compatible default export
export const colors = themes.midnight;
