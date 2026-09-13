"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/components/landing/ThemeContext";

interface SavePromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated?: boolean;
  defaultName?: string;
  extension?: string;
  onSave?: (fileName: string) => void;
}

export default function SavePromptModal({
  isOpen,
  onClose,
  isAuthenticated = false,
  defaultName = "untitled",
  extension = ".txt",
  onSave,
}: SavePromptModalProps) {
  const { theme } = useTheme();
  const [fileName, setFileName] = useState(defaultName);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setFileName(defaultName);
      setError("");
    }
  }, [isOpen, defaultName]);

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmed = fileName.trim();
    if (!trimmed) {
      setError("Please enter a file name.");
      return;
    }

    const withoutExtension = trimmed.replace(/\.[^./\\]+$/, "");
    if (!withoutExtension.trim()) {
      setError("Please enter a valid file name.");
      return;
    }

    setError("");
    onSave?.(withoutExtension);
  };

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
          }}
        >
          <X size={18} />
        </button>

        <div style={{ marginBottom: "24px", paddingRight: "28px" }}>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 600,
              color: theme.text,
              marginBottom: "8px",
            }}
            className="font-display"
          >
            {isAuthenticated ? "Save File" : "Save your code"}
          </h2>
          <p style={{ fontSize: "14px", lineHeight: 1.6, color: theme.muted }}>
            {isAuthenticated
              ? "Choose a name for your file before saving it."
              : "Create an account to save your work and access it anytime."}
          </p>
        </div>

        {isAuthenticated ? (
          <div>
            <label
              className="font-body"
              style={{ display: "block", fontSize: "12px", fontWeight: 600, color: theme.muted, marginBottom: "8px" }}
            >
              File name
            </label>
            <div style={{ display: "flex", alignItems: "stretch", marginBottom: error ? "8px" : "18px" }}>
              <input
                autoFocus
                value={fileName}
                onChange={(e) => {
                  setFileName(e.target.value);
                  if (error) setError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave();
                }}
                placeholder="my-program"
                className="font-mono"
                style={{
                  flex: 1,
                  minWidth: 0,
                  padding: "12px 12px",
                  fontSize: "13px",
                  color: theme.text,
                  backgroundColor: theme.bg,
                  border: `1px solid ${error ? "#ef4444" : theme.border}`,
                  borderRight: "none",
                  borderRadius: "8px 0 0 8px",
                  outline: "none",
                }}
              />
              <span
                className="font-mono"
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "0 12px",
                  fontSize: "12px",
                  color: theme.muted,
                  backgroundColor: theme.panel,
                  border: `1px solid ${error ? "#ef4444" : theme.border}`,
                  borderRadius: "0 8px 8px 0",
                }}
              >
                {extension}
              </span>
            </div>
            {error && <p style={{ margin: "0 0 14px", fontSize: "12px", color: "#ef4444" }}>{error}</p>}
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: "11px 16px",
                  fontSize: "13px",
                  fontWeight: 500,
                  backgroundColor: "transparent",
                  color: theme.muted,
                  border: `1px solid ${theme.border}`,
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                style={{
                  flex: 1,
                  padding: "11px 16px",
                  fontSize: "13px",
                  fontWeight: 600,
                  backgroundColor: theme.accent,
                  color: theme.bg,
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Save File
              </button>
            </div>
          </div>
        ) : (
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
              }}
            >
              Log In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
