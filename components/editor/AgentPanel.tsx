"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Bot, User, Check, Loader2, X, Zap, Bug, Lightbulb, Wrench, ChevronRight, Copy } from "lucide-react";
import { useTheme } from "@/components/landing/ThemeContext";

interface ToolStep {
  tool: string;
  args: Record<string, unknown>;
  result?: string;
  status: "running" | "done";
}

interface Message {
  role: "user" | "agent";
  content: string;
  plan?: string;
  code?: string;
  review?: string;
  isPending?: boolean;
  thinking?: string;
  toolSteps?: ToolStep[];
}

interface AgentPanelProps {
  language: string;
  existingCode: string;
  onApplyAndRun: (language: string, code: string) => void;
  onClose: () => void;
  onNewChat: () => void;
}

const QUICK_ACTIONS = [
  { label: "Fix my code", icon: Bug, prompt: "Act as CodeIQ AI Error Detective. Diagnose the current editor code: identify the root cause and evidence, point to the exact line or smallest relevant snippet, explain why it fails, provide the smallest safe fix, and verify it by running the code when supported. Distinguish confirmed errors from suspected issues. Preserve unrelated code and return the complete corrected code." },
  { label: "Explain code", icon: Lightbulb, prompt: "Explain the current editor code step by step in beginner-friendly language. Describe what the important lines do and explain any unfamiliar concepts." },
  { label: "Generate code", icon: Wrench, prompt: "Help me write code for my goal. First ask a brief clarifying question if my goal is not clear; otherwise generate a solution for the current programming language and explain how to use it." },
  { label: "Optimize code", icon: Zap, prompt: "Review the current editor code and suggest meaningful improvements to performance, readability, and maintainability. Explain trade-offs and preserve existing behavior." },
  { label: "Review code", icon: Check, prompt: "Review the current editor code for bugs, edge cases, readability, and security concerns. Prioritize findings by severity, explain evidence, and suggest targeted fixes. Do not claim you ran code unless it was actually executed." },
  { label: "Write tests", icon: ChevronRight, prompt: "Create useful test cases for the current editor code, covering normal cases, edge cases, and likely failures. Explain how to run the tests in the current language." },
];

function ToolIcon({ tool }: { tool: string }) {
  if (tool === "run_code") return <Zap size={11} />;
  if (tool === "calculator") return <span style={{ fontSize: "10px", fontWeight: 700 }}>=</span>;
  if (tool === "read_editor") return <Lightbulb size={11} />;
  return <Wrench size={11} />;
}

/* ���── Tool Step ─── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ToolStepDisplay({ step, theme, isLast }: { step: ToolStep; theme: any; isLast: boolean }) {
  const [expanded, setExpanded] = useState(false);

  const toolLabel: Record<string, string> = {
    run_code: "Run code",
    calculator: "Calculate",
    read_editor: "Read editor",
  };

  return (
    <div style={{ display: "flex", gap: "8px", marginBottom: isLast ? 0 : "2px" }}>
      {/* Timeline */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "14px", flexShrink: 0, paddingTop: "7px" }}>
        {step.status === "running" ? (
          <Loader2 size={12} style={{ color: theme.accent, animation: "agentSpin 1s linear infinite", flexShrink: 0 }} />
        ) : (
          <Check size={10} style={{ color: theme.accent, flexShrink: 0 }} />
        )}
        {!isLast && <div style={{ width: "1px", flex: 1, marginTop: "3px", backgroundColor: `${theme.accent}15` }} />}
      </div>

      {/* Card */}
      <div
        style={{
          flex: 1, padding: "6px 10px", borderRadius: "6px",
          fontSize: "11px", fontFamily: "var(--font-mono), monospace",
          cursor: "pointer", transition: "background-color 0.15s ease",
        }}
        onClick={() => setExpanded(!expanded)}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${theme.accent}06`; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{
            width: "18px", height: "18px", borderRadius: "4px",
            backgroundColor: `${theme.accent}10`, display: "flex", alignItems: "center", justifyContent: "center",
            color: theme.accent, flexShrink: 0,
          }}>
            <ToolIcon tool={step.tool} />
          </div>
          <span style={{ color: theme.muted, fontWeight: 500 }}>{toolLabel[step.tool] || step.tool}</span>
          {step.args && typeof step.args.language === "string" && (
            <span style={{
              fontSize: "9px", padding: "1px 5px", borderRadius: "3px",
              backgroundColor: `${theme.accent}10`, color: theme.accent, fontWeight: 600,
            }}>
              {step.args.language}
            </span>
          )}
          <span style={{
            marginLeft: "auto", color: theme.faint, transition: "transform 0.15s ease",
            transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
          }}>
            <ChevronRight size={12} />
          </span>
        </div>

        {expanded && (
          <div style={{ marginTop: "8px" }}>
            {step.args && typeof step.args.code === "string" && (
              <div style={{ marginBottom: "6px" }}>
                <div style={{ color: theme.faint, fontSize: "9px", marginBottom: "3px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Code</div>
                <pre style={{
                  margin: 0, padding: "8px 10px", borderRadius: "4px",
                  backgroundColor: theme.panel, color: theme.codeText,
                  fontSize: "11px", lineHeight: 1.4, overflow: "auto", maxHeight: "120px",
                  whiteSpace: "pre-wrap", wordBreak: "break-word",
                  border: `1px solid ${theme.border}`,
                }}>
                  {String(step.args.code)}
                </pre>
              </div>
            )}
            {step.args && typeof step.args.expression === "string" && (
              <div style={{ marginBottom: "6px" }}>
                <div style={{ color: theme.faint, fontSize: "9px", marginBottom: "3px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Expression</div>
                <pre style={{
                  margin: 0, padding: "8px 10px", borderRadius: "4px",
                  backgroundColor: theme.panel, color: theme.codeText,
                  fontSize: "11px", border: `1px solid ${theme.border}`,
                }}>
                  {String(step.args.expression)}
                </pre>
              </div>
            )}
            {step.result && (
              <div>
                <div style={{ color: theme.faint, fontSize: "9px", marginBottom: "3px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Result</div>
                <pre style={{
                  margin: 0, padding: "8px 10px", borderRadius: "4px",
                  backgroundColor: theme.panel,
                  color: step.result.startsWith("Error") ? "#EF4444" : theme.codeText,
                  fontSize: "11px", lineHeight: 1.4, overflow: "auto", maxHeight: "120px",
                  whiteSpace: "pre-wrap", wordBreak: "break-word",
                  border: `1px solid ${step.result.startsWith("Error") ? "#EF444420" : theme.border}`,
                }}>
                  {step.result}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Copy Button ─── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CopyButton({ text, theme }: { text: string; theme: any }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      style={{
        display: "flex", alignItems: "center", gap: "3px", padding: "2px 6px",
        fontSize: "10px", borderRadius: "3px", border: `1px solid ${theme.border}`,
        backgroundColor: "transparent", color: theme.faint, cursor: "pointer",
        transition: "all 0.15s ease",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${theme.accent}30`; e.currentTarget.style.color = theme.accent; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.faint; }}
    >
      {copied ? <><Check size={9} /> Copied</> : <><Copy size={9} /> Copy</>}
    </button>
  );
}

/* ─── Formatted Text ─── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FormattedText({ text, theme }: { text: string; theme: any }) {
  const lines = text.replace(/\\r\\n/g, "\\n").split("\\n");
  const blocks: { type: "heading" | "step" | "bullet" | "paragraph"; marker?: string; text: string; indent?: number }[] = [];

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.trim();
    if (!line) continue;

    const heading = line.match(/^#{1,3}\\s+(.+)$/) || line.match(/^\\*\\*(.{2,60})\\*\\*:?$/);
    if (heading) {
      blocks.push({ type: "heading", text: heading[1].replace(/\\*\\*/g, "").replace(/:$/, "") });
      continue;
    }

    const numbered = line.match(/^(\\d+)[.)]\\s+(.+)$/);
    if (numbered) {
      blocks.push({ type: "step", marker: numbered[1], text: numbered[2] });
      continue;
    }

    const bullet = raw.match(/^(\\s*)[-*•]\\s+(.+)$/);
    if (bullet) {
      blocks.push({ type: "bullet", marker: "•", text: bullet[2], indent: Math.min(2, Math.floor(bullet[1].length / 2)) });
      continue;
    }

    const subitem = raw.match(/^(\\s+)([a-z]|\\d+|[ivx]+)[.)]\\s+(.+)$/i);
    if (subitem) {
      blocks.push({ type: "bullet", marker: subitem[2] + ".", text: subitem[3], indent: 1 });
      continue;
    }

    // Treat unmarked lines following a step/bullet as a continuation rather than a new list item.
    const previous = blocks[blocks.length - 1];
    if (previous && (previous.type === "step" || previous.type === "bullet" || previous.type === "paragraph")) {
      previous.text += "\\n" + line;
    } else {
      blocks.push({ type: "paragraph", text: line });
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "9px", padding: "2px 0" }}>
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          return (
            <div key={index} style={{
              marginTop: index === 0 ? 0 : "7px", paddingBottom: "5px",
              borderBottom: `1px solid ${theme.border}`, color: theme.text,
              fontSize: "12px", fontWeight: 700, letterSpacing: "0.01em",
            }}>
              {renderFormattedText(block.text, theme)}
            </div>
          );
        }

        if (block.type === "step") {
          return (
            <div key={index} style={{
              display: "grid", gridTemplateColumns: "22px minmax(0, 1fr)",
              gap: "8px", alignItems: "start",
            }}>
              <span style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: "21px", height: "21px", borderRadius: "7px",
                background: `${theme.accent}18`, color: theme.accent,
                fontSize: "10px", fontWeight: 700, marginTop: "1px",
              }}>{block.marker}</span>
              <div style={{
                minWidth: 0, color: theme.muted, fontSize: "12.5px",
                lineHeight: 1.65, whiteSpace: "pre-wrap",
              }}>
                {renderFormattedText(block.text, theme)}
              </div>
            </div>
          );
        }

        if (block.type === "bullet") {
          return (
            <div key={index} style={{
              display: "grid", gridTemplateColumns: "14px minmax(0, 1fr)",
              gap: "5px", marginLeft: (block.indent || 0) * 12 + 8,
              color: theme.muted, fontSize: "12px", lineHeight: 1.65,
            }}>
              <span style={{ color: theme.accent, fontWeight: 700 }}>{block.marker}</span>
              <div style={{ minWidth: 0, whiteSpace: "pre-wrap" }}>{renderFormattedText(block.text, theme)}</div>
            </div>
          );
        }

        return (
          <p key={index} style={{
            fontSize: "12.5px", color: theme.muted, margin: 0,
            lineHeight: 1.7, whiteSpace: "pre-wrap",
          }}>
            {renderFormattedText(block.text, theme)}
          </p>
        );
      })}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderFormattedText(text: string, theme: any) {
  return text.split(/(`[^`]+`)/g).map((part, partIdx) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={partIdx} style={{
          fontSize: "11px", padding: "1px 4px", borderRadius: "3px",
          backgroundColor: `${theme.accent}08`, color: theme.accent,
          fontFamily: "var(--font-mono), monospace",
        }}>
          {part.slice(1, -1)}
        </code>
      );
    }
    return part.split(/(\*\*[^*]+\*\*)/g).map((boldPart, bpi) => {
      if (boldPart.startsWith("**") && boldPart.endsWith("**")) {
        return <strong key={bpi} style={{ fontWeight: 600, color: theme.text }}>{boldPart.slice(2, -2)}</strong>;
      }
      return <span key={bpi}>{boldPart}</span>;
    });
  });
}

/* ─── Code Block ─── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CodeBlock({ code, language, theme, onApplyAndRun, canApply, isApplied, onApplied }: {
  code: string; language: string; theme: any; onApplyAndRun?: () => void;
  canApply?: boolean; isApplied?: boolean; onApplied?: () => void;
}) {
  return (
    <div style={{ borderRadius: "6px", overflow: "hidden", border: `1px solid ${theme.border}`, marginTop: "8px" }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "5px 10px", backgroundColor: theme.panel,
        borderBottom: `1px solid ${theme.border}`,
      }}>
        <span style={{ fontSize: "10px", color: theme.faint, fontWeight: 500 }}>{language || "code"}</span>
        <div style={{ display: "flex", gap: "4px" }}>
          <CopyButton text={code} theme={theme} />
          {canApply && onApplyAndRun && (
            <button onClick={(e) => { e.stopPropagation(); onApplyAndRun(); onApplied?.(); }} style={{
              display: "flex", alignItems: "center", gap: "3px", padding: "2px 8px",
              fontSize: "10px", fontWeight: 600, borderRadius: "3px", border: "none",
              background: isApplied ? "#34D399" : theme.accent,
              color: isApplied ? "#fff" : theme.panel, cursor: "pointer",
              transition: "all 0.15s ease",
            }}>
              {isApplied ? <><Check size={9} /> Applied</> : <><Check size={9} /> Apply to editor</>}
            </button>
          )}
        </div>
      </div>
      <pre style={{
        padding: "10px 12px", margin: 0, fontSize: "11.5px", lineHeight: 1.5,
        color: theme.codeText, overflow: "auto", whiteSpace: "pre-wrap",
        maxHeight: "220px", fontFamily: "var(--font-mono), monospace",
        backgroundColor: theme.bg,
      }}>
        {code}
      </pre>
    </div>
  );
}

/* ─── Message Content ─── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MessageContent({ msg, theme, language, index, onApplyAndRun, appliedIndex, setAppliedIndex }: {
  msg: Message; theme: any; language: string; index: number;
  onApplyAndRun: (lang: string, code: string) => void;
  appliedIndex: number | null; setAppliedIndex: (i: number) => void;
}) {
  if (msg.isPending && msg.thinking && !msg.toolSteps?.length && !msg.plan) {
    return (
      <div style={{
        padding: "10px 0",
        display: "flex", alignItems: "center", gap: "8px",
      }}>
        <div style={{ display: "flex", gap: "3px" }}>
          {[0, 1, 2].map((d) => (
            <div key={d} style={{
              width: "4px", height: "4px", borderRadius: "50%",
              backgroundColor: theme.accent,
              animation: `agentBounce 1.4s ease-in-out ${d * 0.16}s infinite`,
            }} />
          ))}
        </div>
        <span style={{ fontSize: "11.5px", color: theme.faint }}>{msg.thinking}</span>
      </div>
    );
  }

  return (
    <>
      {msg.toolSteps && msg.toolSteps.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0", marginBottom: "8px" }}>
          {msg.toolSteps.map((step, j) => (
            <ToolStepDisplay key={j} step={step} theme={theme} isLast={j === msg.toolSteps!.length - 1} />
          ))}
        </div>
      )}

      {msg.isPending && msg.toolSteps && msg.toolSteps.length > 0 && !msg.plan && (
        <div style={{
          padding: "6px 0",
          display: "inline-flex", alignItems: "center", gap: "6px",
        }}>
          <Loader2 size={11} style={{ color: theme.accent, animation: "agentSpin 1s linear infinite" }} />
          <span style={{ fontSize: "11px", color: theme.faint }}>Processing...</span>
        </div>
      )}

      {!msg.isPending && (msg.plan || msg.code || msg.review) && (
        <div>
          {msg.plan && msg.code && (
            <div style={{ padding: "10px 0" }}>
              <span style={{ fontSize: "9px", fontWeight: 600, color: theme.accent, textTransform: "uppercase", letterSpacing: "0.08em" }}>Plan</span>
              <FormattedText text={msg.plan} theme={theme} />
            </div>
          )}

          {msg.plan && !msg.code && (
            <div style={{ padding: "4px 0" }}>
              <FormattedText text={msg.plan} theme={theme} />
            </div>
          )}

          {msg.code && (
            <CodeBlock
              code={msg.code} language={language} theme={theme}
              canApply isApplied={appliedIndex === index}
              onApplyAndRun={() => onApplyAndRun(language, msg.code!)}
              onApplied={() => setAppliedIndex(index)}
            />
          )}
        </div>
      )}

      {!msg.isPending && !msg.plan && !msg.code && !msg.review && msg.content && (
        <div style={{ padding: "8px 0" }}>
          <FormattedText text={msg.content} theme={theme} />
        </div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════════ */
export default function AgentPanel({ language, existingCode, onApplyAndRun, onClose, onNewChat }: AgentPanelProps) {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [appliedIndex, setAppliedIndex] = useState<number | null>(null);
  const [inputFocused, setInputFocused] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);

  const handleSubmit = useCallback(async (overrideTask?: string) => {
    const task = (overrideTask || input).trim();
    if (!task || isLoading) return;

    const userMessage: Message = { role: "user", content: task };
    const pendingMessage: Message = { role: "agent", content: "", isPending: true, toolSteps: [] };
    const updatedMessages = [...messages, userMessage, pendingMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);
    setAppliedIndex(null);

    try {
      const historyForApi = updatedMessages
        .filter((m) => !m.isPending)
        .map((m) => ({ role: m.role, content: m.content, plan: m.plan, code: m.code, review: m.review }));

      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: historyForApi, language, existingCode }),
      });

      if (!res.ok) {
        const data = await res.json();
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "agent", content: data.error || "Something went wrong. Please try again." };
          return updated;
        });
        setIsLoading(false);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "agent", content: "No response stream." };
          return updated;
        });
        setIsLoading(false);
        return;
      }

      const decoder = new TextDecoder();
      let streamBuffer = "";

      const handleAgentEvent = (event: Record<string, unknown>) => {
        if (event.type === "thinking") {
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            updated[updated.length - 1] = { ...last, thinking: String(event.content || "") };
            return updated;
          });
        } else if (event.type === "tool") {
          setMessages((prev) => {
            const updated = [...prev];
            const last = { ...updated[updated.length - 1] };
            const steps = [...(last.toolSteps || [])];
            const toolName = String(event.tool || "tool");
            if (event.status === "running") {
              steps.push({ tool: toolName, args: (event.args as Record<string, unknown>) || {}, status: "running" });
            } else if (event.status === "done") {
              for (let i = steps.length - 1; i >= 0; i--) {
                if (steps[i].tool === toolName && steps[i].status === "running") {
                  steps[i] = { ...steps[i], result: String(event.result || ""), status: "done" };
                  break;
                }
              }
            }
            last.toolSteps = steps;
            last.thinking = undefined;
            updated[updated.length - 1] = last;
            return updated;
          });
        } else if (event.type === "answer") {
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: "agent",
              content: String(event.review || event.plan || "Done."),
              plan: typeof event.plan === "string" ? event.plan : undefined,
              code: typeof event.code === "string" && event.code ? event.code : undefined,
              review: typeof event.review === "string" ? event.review : undefined,
              toolSteps: updated[updated.length - 1].toolSteps,
            };
            return updated;
          });
        } else if (event.type === "error") {
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: "agent",
              content: String(event.content || "Something went wrong."),
              toolSteps: updated[updated.length - 1].toolSteps,
            };
            return updated;
          });
        }
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          streamBuffer += decoder.decode();
          break;
        }

        streamBuffer += decoder.decode(value, { stream: true });
        let boundary = streamBuffer.indexOf("\\n\\n");
        while (boundary !== -1) {
          const frame = streamBuffer.slice(0, boundary);
          streamBuffer = streamBuffer.slice(boundary + 2);
          const data = frame
            .split("\\n")
            .filter((line) => line.startsWith("data:"))
            .map((line) => line.slice(5).trimStart())
            .join("\\n")
            .trim();

          if (data && data !== "[DONE]") {
            try {
              handleAgentEvent(JSON.parse(data) as Record<string, unknown>);
            } catch (parseError) {
              console.error("Failed to parse CodeIQ agent event:", parseError);
            }
          }
          boundary = streamBuffer.indexOf("\\n\\n");
        }
      }

      const remainingData = streamBuffer
        .split("\\n")
        .filter((line) => line.startsWith("data:"))
        .map((line) => line.slice(5).trimStart())
        .join("\\n")
        .trim();
      if (remainingData && remainingData !== "[DONE]") {
        try {
          handleAgentEvent(JSON.parse(remainingData) as Record<string, unknown>);
        } catch (parseError) {
          console.error("Failed to parse final CodeIQ agent event:", parseError);
        }
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "agent", content: "Network error. Please check your connection and try again." };
        return updated;
      });
    }
    setIsLoading(false);
  }, [input, isLoading, messages, language, existingCode]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
  };

  const canSend = input.trim().length > 0 && !isLoading;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", backgroundColor: theme.panel }}>

      {/* ─── Header ─── */}
      <div style={{ flexShrink: 0, borderBottom: `1px solid ${theme.border}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Bot size={14} style={{ color: theme.accent }} />
            <span style={{ fontSize: "12px", fontWeight: 600, color: theme.text }}>CodeIQ</span>
            <span style={{
              fontSize: "9px", fontWeight: 600, padding: "2px 6px", borderRadius: "3px",
              backgroundColor: `${theme.accent}10`, color: theme.accent,
              textTransform: "uppercase", letterSpacing: "0.04em",
            }}>
              {language}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {messages.length > 0 && (
              <button onClick={onNewChat} title="New chat"
                style={{
                  width: "24px", height: "24px", borderRadius: "4px",
                  background: "none", border: "none", cursor: "pointer",
                  color: theme.faint, display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "color 0.15s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = theme.text; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = theme.faint; }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
            )}
            <button onClick={onClose} style={{
            width: "24px", height: "24px", borderRadius: "4px",
            background: "none", border: "none", cursor: "pointer",
            color: theme.faint, display: "flex", alignItems: "center", justifyContent: "center",
            transition: "color 0.15s ease",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.color = theme.text; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = theme.faint; }}
          >
            <X size={13} />
          </button>
        </div>
      </div>
      </div>

      {/* ─── Messages ─── */}
      <div style={{ flex: 1, overflow: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: "12px" }}>

        {/* Empty state */}
        {messages.length === 0 && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "24px 16px" }}>
            <div style={{
              width: "44px", height: "44px", borderRadius: "12px",
              backgroundColor: `${theme.accent}14`, border: `1px solid ${theme.accent}30`,
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: "14px",
            }}>
              <Bot size={22} style={{ color: theme.accent }} />
            </div>
            <p style={{ fontSize: "13px", fontWeight: 600, color: theme.text, margin: "0 0 4px" }}>
              What can I help you code today?
            </p>
            <p style={{ fontSize: "12px", color: theme.faint, margin: "0 0 8px", textAlign: "center", lineHeight: 1.6, maxWidth: "270px" }}>
              I’m CodeIQ AI, your coding assistant. I can explain code, find bugs, generate solutions, review code, and help you improve it.
            </p>
            <span style={{ fontSize: "10px", color: theme.accent, backgroundColor: `${theme.accent}10`, borderRadius: "20px", padding: "4px 9px", marginBottom: "16px" }}>
              Working with {language}
            </span>

            {/* Quick actions */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "7px", width: "100%", maxWidth: "300px" }}>
              {QUICK_ACTIONS.map((action) => (
                <button key={action.label} onClick={() => handleSubmit(action.prompt)}
                  style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    padding: "10px 9px", borderRadius: "8px", fontSize: "11px",
                    border: `1px solid ${theme.border}`, backgroundColor: theme.bg,
                    color: theme.muted, cursor: "pointer", textAlign: "left", minHeight: "40px",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${theme.accent}08`; e.currentTarget.style.color = theme.text; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = theme.muted; }}
                >
                  <action.icon size={13} style={{ color: theme.accent, flexShrink: 0 }} />
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg, i) => (
          <div key={i} className="agent-msg" style={{
            display: "flex", gap: "8px",
            flexDirection: msg.role === "user" ? "row-reverse" : "row",
            alignItems: "flex-start",
            animation: "agentFadeSlideIn 0.2s ease-out",
          }}>
            {/* Avatar */}
            <div style={{
              width: "24px", height: "24px", borderRadius: "6px", flexShrink: 0,
              backgroundColor: `${theme.accent}10`,
              display: "flex", alignItems: "center", justifyContent: "center",
              marginTop: "2px",
            }}>
              {msg.role === "user"
                ? <User size={12} style={{ color: theme.accent }} />
                : <Bot size={12} style={{ color: theme.accent }} />
              }
            </div>

            {/* Content */}
            <div style={{ maxWidth: "90%", minWidth: 0 }}>
              {msg.role === "user" ? (
                <div style={{ padding: "8px 0" }}>
                  <p style={{ fontSize: "12.5px", color: theme.text, margin: 0, lineHeight: 1.55, whiteSpace: "pre-wrap" }}>
                    {msg.content}
                  </p>
                </div>
              ) : (
                <MessageContent
                  msg={msg} theme={theme} language={language} index={i}
                  onApplyAndRun={onApplyAndRun} appliedIndex={appliedIndex} setAppliedIndex={setAppliedIndex}
                />
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* ─── Input ─── */}
      <div style={{ flexShrink: 0, borderTop: `1px solid ${theme.border}` }}>
        <div style={{ padding: "10px 14px 14px" }}>
          <div style={{
            display: "flex", alignItems: "flex-end",
            backgroundColor: theme.bg, border: `1px solid ${inputFocused ? `${theme.accent}40` : theme.border}`,
            borderRadius: "8px", overflow: "hidden",
            transition: "border-color 0.15s ease",
          }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              placeholder={`Ask your AI coding assistant about ${language}...`}
              rows={1}
              style={{
                flex: 1, resize: "none", border: "none", outline: "none",
                backgroundColor: "transparent", color: theme.text,
                fontSize: "12.5px", lineHeight: 1.5, padding: "10px 12px",
                fontFamily: "var(--font-body), sans-serif",
                minHeight: "40px", maxHeight: "120px",
              }}
            />
            <button onClick={() => handleSubmit()} disabled={!canSend}
              style={{
                width: "32px", height: "32px", borderRadius: "6px", margin: "4px 6px 4px 0",
                backgroundColor: canSend ? theme.accent : "transparent",
                color: canSend ? theme.panel : theme.faint,
                border: canSend ? "none" : `1px solid ${theme.border}`,
                cursor: canSend ? "pointer" : "default",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, transition: "all 0.15s ease",
              }}
            >
              {isLoading
                ? <Loader2 size={14} style={{ animation: "agentSpin 1s linear infinite" }} />
                : <Send size={14} />
              }
            </button>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", padding: "3px 2px 0" }}>
            <span style={{ fontSize: "10px", color: theme.faint, opacity: 0.5 }}>
              Enter send · Shift+Enter newline
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes agentSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes agentFadeSlideIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes agentBounce { 0%, 80%, 100% { transform: translateY(0); opacity: 0.3; } 40% { transform: translateY(-3px); opacity: 1; } }
        @media (prefers-reduced-motion: reduce) { .agent-msg { animation: none !important; } }
      `}</style>
    </div>
  );
}
