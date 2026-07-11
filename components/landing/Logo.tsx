"use client";

import { useTheme } from "./ThemeContext";

interface LogoProps {
  iconSize?: number;
  textSize?: number;
}

export default function Logo({ iconSize = 42, textSize = 28 }: LogoProps) {
  const { theme } = useTheme();

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      {/* Abstract Mark */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="20"
          y="2"
          width="24"
          height="24"
          rx="4"
          transform="rotate(45 20 2)"
          fill={theme.accent}
          opacity="0.15"
        />
        <path
          d="M16 12L10 20L16 28"
          stroke={theme.accent}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M24 12L30 20L24 28"
          stroke={theme.accent}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M22 11L18 29"
          stroke={theme.accent}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>

      {/* Text */}
      <span
        className="font-display"
        style={{
          fontSize: `${textSize}px`,
          fontStyle: "italic",
          letterSpacing: "-0.02em",
          color: theme.text,
        }}
      >
        Code<span style={{ color: theme.accent }}>IQ</span>
      </span>
    </div>
  );
}
