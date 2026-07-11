"use client";

import { useTheme } from "@/components/landing/ThemeContext";

export default function Footer() {
  const { theme } = useTheme();

  return (
    <footer style={{ borderTop: `1px solid ${theme.border}`, marginTop: "auto" }}>
      <div
        className="font-mono"
        style={{
          maxWidth: "1040px",
          margin: "0 auto",
          padding: "26px 24px",
          display: "flex",
          justifyContent: "space-between",
          fontSize: "13px",
          color: theme.faint,
        }}
      >
        <span>CodeIQ © 2026</span>
        <span>write less, ship more</span>
      </div>
    </footer>
  );
}
