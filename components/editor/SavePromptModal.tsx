"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/components/landing/ThemeContext";

interface SavePromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SavePromptModal({ isOpen, onClose }: SavePromptModalProps) {
  const { theme } = useTheme();

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        backdropFilter: "blur(2px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: theme.panel,
          border: `1px solid ${theme.border}`,
          borderRadius: "12px",
          padding: "32px",
          maxWidth: "420px",
          width: "90%",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.35)",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "transparent",
            border: "none",
            color: theme.muted,
            cursor: "pointer",
            borderRadius: "6px",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = `${theme.text}10`;
            e.currentTarget.style.color = theme.text;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = theme.muted;
          }}
        >
          <X size={18} />
        </button>

        {/* Content */}
        <div style={{ marginBottom: "24px" }}>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 600,
              color: theme.text,
              marginBottom: "8px",
            }}
            className="font-display"
          >
            Save your code
          </h2>
          <p
            style={{
              fontSize: "14px",
              lineHeight: 1.6,
              color: theme.muted,
            }}
          >
            Create an account to save your work and access it anytime.
          </p>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Link
            href="/signup"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "12px 20px",
              fontSize: "14px",
              fontWeight: 600,
              backgroundColor: theme.accent,
              color: theme.bg,
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              textDecoration: "none",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.9";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Sign Up — It's Free
          </Link>
          <Link
            href="/login"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "12px 20px",
              fontSize: "14px",
              fontWeight: 500,
              backgroundColor: "transparent",
              color: theme.muted,
              border: `1px solid ${theme.border}`,
              borderRadius: "8px",
              cursor: "pointer",
              textDecoration: "none",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = theme.accent;
              e.currentTarget.style.color = theme.text;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = theme.border;
              e.currentTarget.style.color = theme.muted;
            }}
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
