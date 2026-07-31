"use client";

import { useTheme } from "./ThemeContext";

function hexToRgb(hex: string): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

export function ThemeStyle() {
  const { theme } = useTheme();
  const rgb = hexToRgb(theme.accent);

  const css = `
    :root {
      --background: ${theme.bg};
      --foreground: ${theme.text};
      --panel: ${theme.panel};
      --muted: ${theme.muted};
      --faint: ${theme.faint};
      --border: ${theme.border};
      --accent: ${theme.accent};
      --accent-rgb: ${rgb};
      --accent-hover: ${theme.accentHover};
      --card-bg: ${theme.cardBg};
      --card-border: ${theme.cardBorder};
      --code-bg: ${theme.codeBg};
      --code-text: ${theme.codeText};
      --hero-glow: ${theme.heroGlow};
      --navbar-bg: ${theme.navbarBg};
    }

    html, body {
      background: var(--background);
      color: var(--foreground);
      transition: background 0.35s ease, color 0.35s ease;
    }
  `;

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
