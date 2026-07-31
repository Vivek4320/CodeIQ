"use client";

import { useState, useRef, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { useTheme } from "@/components/landing/ThemeContext";

interface InputField {
  prompt: string;
  index: number;
}

interface OutputPanelProps {
  output: string[];
  isRunning: boolean;
  inputFields?: InputField[];
  onRunWithInput?: (values: string[]) => void;
  onClear?: () => void;
}

export default function OutputPanel({ output, isRunning, inputFields, onRunWithInput, onClear }: OutputPanelProps) {
  const { theme } = useTheme();
  const [values, setValues] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [history, setHistory] = useState<{ prompt: string; value: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset when new input fields come in
  useEffect(() => {
    if (inputFields && inputFields.length > 0 && !submitted) {
      setValues([]);
      setCurrentIndex(0);
      setHistory([]);
    }
  }, [inputFields, submitted]);

  // Focus input when index changes
  useEffect(() => {
    if (inputRef.current && inputFields && inputFields.length > 0 && !submitted) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [currentIndex, inputFields, submitted]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, output]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputFields) return;

    const val = values[currentIndex] || "";
    if (val.trim() === "") return;

    // Add to history
    setHistory((prev) => [...prev, { prompt: inputFields[currentIndex].prompt, value: val }]);

    if (currentIndex < inputFields.length - 1) {
      // More inputs needed — move to next
      setCurrentIndex((i) => i + 1);
      setValues((prev) => [...prev, ""]);
    } else {
      // All inputs collected — run
      setSubmitted(true);
      const allValues = [...values.slice(0, currentIndex), val];
      onRunWithInput?.(allValues);
    }
  };

  // No input needed — just show output
  if (!inputFields || inputFields.length === 0) {
    return (
      <div style={{ backgroundColor: theme.panel, height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Header theme={theme} isRunning={isRunning} output={output} onClear={onClear} />
        <div style={{ padding: "12px 16px", overflow: "auto", flex: 1 }}>
          {output.length === 0 && !isRunning && (
            <span className="font-mono" style={{ fontSize: "12px", color: theme.faint }}>
              Click &quot;Run&quot; to see output...
            </span>
          )}
          {output.map((line, i) => (
            <pre key={i} className="font-mono" style={{ fontSize: "13px", lineHeight: 1.6, color: line.startsWith("Error") ? "#EF4444" : theme.codeText, margin: 0, whiteSpace: "pre-wrap" }}>
              {line}
            </pre>
          ))}
          {isRunning && (
            <span className="font-mono" style={{ fontSize: "12px", color: "#FBBF24" }}>▶ Executing...</span>
          )}
        </div>
      </div>
    );
  }

  const currentField = inputFields[currentIndex];

  return (
    <div style={{ backgroundColor: theme.panel, height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <Header theme={theme} isRunning={isRunning} output={output} onClear={() => { setValues([]); setCurrentIndex(0); setHistory([]); setSubmitted(false); onClear?.(); }} />

      <div ref={scrollRef} style={{ padding: "12px 16px", overflow: "auto", flex: 1, fontFamily: "var(--font-mono), monospace" }}>
        {/* Chat-style input history */}
        {history.map((h, i) => (
          <div key={i} style={{ marginBottom: "8px" }}>
            <div style={{ fontSize: "12px", color: theme.faint, marginBottom: "2px" }}>{h.prompt}</div>
            <div style={{ fontSize: "13px", color: theme.text, paddingLeft: "8px" }}>{h.value}</div>
          </div>
        ))}

        {/* Current input — terminal style */}
        {!submitted && currentField && (
          <form onSubmit={handleSubmit} style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: history.length > 0 ? "4px" : 0 }}>
            <span style={{ fontSize: "13px", color: theme.accent, flexShrink: 0 }}>{currentField.prompt}</span>
            <input
              ref={inputRef}
              type="text"
              value={values[currentIndex] || ""}
              onChange={(e) => {
                const updated = [...values];
                updated[currentIndex] = e.target.value;
                setValues(updated);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              className="font-mono"
              style={{
                flex: 1, fontSize: "13px", padding: "2px 0",
                backgroundColor: "transparent", color: theme.text,
                border: "none", outline: "none",
              }}
              autoFocus
            />
            <span className="font-mono" style={{ fontSize: "11px", color: theme.faint, animation: "blink 1s infinite" }}>▌</span>
          </form>
        )}

        {/* Textarea for complex input (stdin) */}
        {!submitted && currentField && currentField.prompt === "stdin" && (
          <form onSubmit={(e) => { e.preventDefault(); if (values[0]?.trim()) { setSubmitted(true); onRunWithInput?.([values[0]]); } }} style={{ marginTop: history.length > 0 ? "4px" : 0 }}>
            <div className="font-mono" style={{ fontSize: "11px", color: theme.faint, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Enter all inputs (one per line, space-separated for rows):
            </div>
            <textarea
              value={values[0] || ""}
              onChange={(e) => setValues([e.target.value])}
              placeholder={"2\n1 2\n3 4\nhello"}
              className="font-mono"
              rows={5}
              style={{
                width: "100%", fontSize: "13px", padding: "8px 10px",
                backgroundColor: theme.bg, color: theme.text,
                border: `1px solid ${theme.border}`, borderRadius: "6px",
                outline: "none", resize: "vertical", lineHeight: 1.5,
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = theme.accent; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = theme.border; }}
              autoFocus
            />
            <button type="submit" style={{
              marginTop: "8px", padding: "6px 16px", fontSize: "12px", fontWeight: 600,
              backgroundColor: (values[0] || "").trim() ? theme.accent : theme.border,
              color: (values[0] || "").trim() ? theme.bg : theme.faint,
              border: "none", borderRadius: "6px",
              cursor: (values[0] || "").trim() ? "pointer" : "not-allowed",
            }}>
              ▶ Run
            </button>
          </form>
        )}

        {/* Output lines */}
        {output.map((line, i) => (
          <pre key={i} className="font-mono" style={{ fontSize: "13px", lineHeight: 1.6, color: line.startsWith("Error") ? "#EF4444" : theme.codeText, margin: 0, whiteSpace: "pre-wrap" }}>
            {line}
          </pre>
        ))}

        {isRunning && (
          <span className="font-mono" style={{ fontSize: "12px", color: "#FBBF24" }}>▶ Executing...</span>
        )}

        {output.length === 0 && !isRunning && history.length === 0 && !currentField && (
          <span className="font-mono" style={{ fontSize: "12px", color: theme.faint }}>Click &quot;Run&quot; to see output...</span>
        )}
      </div>

      <style>{`@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`}</style>
    </div>
  );
}

function Header({ theme, isRunning, output, onClear }: { theme: any; isRunning: boolean; output: string[]; onClear?: () => void }) {
  return (
    <div className="font-mono" style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: theme.faint, padding: "10px 16px", borderBottom: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: isRunning ? "#FBBF24" : output.length > 0 ? "#34D399" : theme.faint }} />
        Output
        {isRunning && <span style={{ color: "#FBBF24" }}>Running...</span>}
      </div>
      {output.length > 0 && onClear && (
        <button onClick={onClear} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "2px 8px", fontSize: "10px", fontWeight: 500, backgroundColor: "transparent", color: theme.faint, border: `1px solid ${theme.border}`, borderRadius: "4px", cursor: "pointer", transition: "all 0.2s ease" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = theme.accent; e.currentTarget.style.color = theme.text; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.faint; }}>
          <Trash2 size={10} /> Clear
        </button>
      )}
    </div>
  );
}
