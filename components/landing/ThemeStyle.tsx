"use client";

import { useTheme } from "./ThemeContext";

/**
 * Injects a <style> tag that sets CSS custom properties on :root
 * based on the active theme, so globals.css and any Tailwind
 * utilities that reference these vars stay in sync.
 */
export function ThemeStyle() {
  const { theme } = useTheme();

  const css = `
    :root {
      --background: ${theme.bg};
      --foreground: ${theme.text};
      --panel: ${theme.panel};
      --muted: ${theme.muted};
      --faint: ${theme.faint};
      --border: ${theme.border};
      --accent: ${theme.accent};
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
