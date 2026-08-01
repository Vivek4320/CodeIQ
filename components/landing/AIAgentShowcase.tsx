"use client";

import { Bot, Bug, Lightbulb, Zap, Code2, Check } from "lucide-react";
import { useTheme } from "./ThemeContext";
import { useState, useEffect, useCallback } from "react";
import { useIsMobile } from "@/hooks/useMediaQuery";

const DEMO_SCENARIOS = [
  {
    title: "Fix Bug",
    messages: [
      { role: "user" as const, content: "Fix the bug in this code" },
      { role: "agent" as const, thinking: "Analyzing your request..." },
      { role: "agent" as const, tool: { name: "run_code", status: "done", label: "Run code" } },
      {
        role: "agent" as const,
        plan: "Found the issue — `nums` was being shadowed by the loop variable. Fixed it and verified the output.",
        code: "def find_max(nums):\n    maximum = nums[0]\n    for num in nums[1:]:\n        if num > maximum:\n            maximum = num\n    return maximum\n\nprint(find_max([3, 1, 4, 1, 5, 9]))",
        output: "9",
      },
    ],
  },
  {
    title: "Explain Code",
    messages: [
      { role: "user" as const, content: "Explain what this code does" },
      { role: "agent" as const, thinking: "Reading editor contents..." },
      { role: "agent" as const, tool: { name: "read_editor", status: "done", label: "Read editor" } },
      {
        role: "agent" as const,
        plan: "Here's a step-by-step breakdown of the code:",
        steps: [
          "1. Parses the input JSON config file and validates required fields",
          "2. Initializes the database connection pool with retry logic",
          "3. Registers middleware for auth, logging, and error handling",
          "4. Mounts route handlers for /api/users and /api/projects",
          "5. Starts listening on the configured port",
        ],
      },
    ],
  },
  {
    title: "Generate Code",
    messages: [
      { role: "user" as const, content: "Write a function to sort a list" },
      { role: "agent" as const, thinking: "Writing implementation..." },
      { role: "agent" as const, tool: { name: "write_file", status: "done", label: "Write file" } },
      { role: "agent" as const, tool: { name: "run_code", status: "done", label: "Run code" } },
      {
        role: "agent" as const,
        plan: "Wrote a quicksort implementation and verified the output:",
        code: "def quicksort(arr):\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    middle = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quicksort(left) + middle + quicksort(right)\n\nprint(quicksort([3, 6, 8, 10, 1, 2, 1]))",
        output: "[1, 1, 2, 3, 6, 8, 10]",
      },
    ],
  },
];

type DemoMessage = (typeof DEMO_SCENARIOS)[number]["messages"][number];

const CAPABILITIES = [
  { icon: Bug, label: "Find & fix bugs", desc: "Analyzes your code, finds issues, and fixes them" },
  { icon: Lightbulb, label: "Explain code", desc: "Step-by-step breakdowns in plain language" },
  { icon: Code2, label: "Generate code", desc: "Writes code from natural language descriptions" },
  { icon: Zap, label: "Run & verify", desc: "Executes code to confirm it actually works" },
];

export default function AIAgentShowcase() {
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const [activeScenario, setActiveScenario] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState(0);

  const resetAndAdvance = useCallback(() => {
    setActiveScenario((prev) => (prev + 1) % DEMO_SCENARIOS.length);
    setVisibleMessages(0);
  }, []);

  // Auto-cycle scenario every 6 seconds
  useEffect(() => {
    const timer = setInterval(resetAndAdvance, 6000);
    return () => clearInterval(timer);
  }, [resetAndAdvance]);

  // Reveal messages one by one within the active scenario
  useEffect(() => {
    const scenario = DEMO_SCENARIOS[activeScenario];
    if (visibleMessages < scenario.messages.length) {
      const timer = setTimeout(() => {
        setVisibleMessages((prev) => prev + 1);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [activeScenario, visibleMessages]);

  const currentMessages = DEMO_SCENARIOS[activeScenario].messages;

  const handleTabClick = (index: number) => {
    setActiveScenario(index);
    setVisibleMessages(0);
  };

  return (
    <section style={{ borderTop: `1px solid ${theme.border}`, padding: "96px 24px" }}>
      <div style={{ maxWidth: "1040px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "6px 16px", borderRadius: "50px",
            border: `1px solid ${theme.border}`, backgroundColor: theme.panel,
            marginBottom: "24px", fontSize: "12px", color: theme.muted,
          }}>
            <Bot size={13} style={{ color: theme.accent }} />
            AI Agent
          </div>
          <h2 className="font-display" style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 400, lineHeight: 1.15, marginBottom: "16px" }}>
            Your code, with a<br />
            <span style={{ fontStyle: "italic" }}>brain attached.</span>
          </h2>
          <p className="font-body" style={{ fontSize: "15px", color: theme.muted, maxWidth: "500px", margin: "0 auto", lineHeight: 1.65 }}>
            An AI agent that doesn&apos;t just suggest — it reads your code, runs it, finds bugs, and fixes them. Like a pair programmer that never sleeps.
          </p>
        </div>

        {/* Content: Agent demo + Capabilities */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "40px" : "48px", alignItems: "start" }}>
          {/* Left: Live demo mockup */}
          <div>
            {/* Scenario tabs */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
              {DEMO_SCENARIOS.map((scenario, i) => (
                <button key={i} onClick={() => handleTabClick(i)}
                  className="font-body"
                  style={{
                    padding: "6px 14px", fontSize: "12px", fontWeight: 600, borderRadius: "50px",
                    border: `1px solid ${activeScenario === i ? theme.accent : theme.border}`,
                    backgroundColor: activeScenario === i ? `${theme.accent}12` : "transparent",
                    color: activeScenario === i ? theme.accent : theme.muted,
                    cursor: "pointer", transition: "all 0.25s ease",
                  }}>
                  {scenario.title}
                </button>
              ))}
            </div>
            <div style={{
              border: `1px solid ${theme.border}`, borderRadius: "14px",
              backgroundColor: theme.panel, overflow: "hidden",
              boxShadow: "0 20px 60px -15px rgba(0,0,0,0.2)",
            }}>
            {/* Header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "12px 16px", borderBottom: `1px solid ${theme.border}`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Bot size={14} style={{ color: theme.accent }} />
                <span className="font-body" style={{ fontSize: "13px", fontWeight: 600, color: theme.text }}>CodeIQ Agent</span>
              </div>
              <span className="font-mono" style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "4px", backgroundColor: `${theme.accent}12`, color: theme.accent, fontWeight: 600 }}>
                python
              </span>
            </div>

            {/* Messages */}
            <div style={{ padding: "16px", minHeight: "320px", display: "flex", flexDirection: "column", gap: "12px" }}>
              {currentMessages.slice(0, visibleMessages).map((msg: DemoMessage, i: number) => {
                if (msg.role === "user") {
                  return (
                    <div key={i} style={{ display: "flex", justifyContent: "flex-end" }}>
                      <div style={{
                        padding: "10px 14px", borderRadius: "10px 10px 2px 10px",
                        backgroundColor: `${theme.accent}15`, color: theme.text,
                        fontSize: "13px", maxWidth: "80%",
                      }}>
                        {(msg as { content: string }).content}
                      </div>
                    </div>
                  );
                }

                const agentMsg = msg as { thinking?: string; tool?: { name: string; status: string; label: string }; plan?: string; code?: string; output?: string; steps?: string[] };

                if (agentMsg.thinking) {
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "4px 0" }}>
                      <div style={{ display: "flex", gap: "3px" }}>
                        {[0, 1, 2].map((d) => (
                          <div key={d} style={{
                            width: "4px", height: "4px", borderRadius: "50%",
                            backgroundColor: theme.accent,
                            animation: `agentBounce 1.4s ease-in-out ${d * 0.16}s infinite`,
                          }} />
                        ))}
                      </div>
                      <span style={{ fontSize: "12px", color: theme.faint }}>{agentMsg.thinking}</span>
                    </div>
                  );
                }

                if (agentMsg.tool) {
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 10px", borderRadius: "6px", backgroundColor: `${theme.accent}06` }}>
                      <Check size={12} style={{ color: theme.accent }} />
                      <span className="font-mono" style={{ fontSize: "11px", color: theme.muted }}>{agentMsg.tool.label}</span>
                      <span className="font-mono" style={{ fontSize: "9px", padding: "1px 5px", borderRadius: "3px", backgroundColor: `${theme.accent}10`, color: theme.accent, fontWeight: 600, marginLeft: "auto" }}>done</span>
                    </div>
                  );
                }

                if (agentMsg.plan && agentMsg.steps) {
                  return (
                    <div key={i}>
                      <p style={{ fontSize: "13px", color: theme.muted, margin: "0 0 10px", lineHeight: 1.5 }}>{agentMsg.plan}</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        {agentMsg.steps.map((step, si) => (
                          <div key={si} style={{
                            padding: "8px 12px", borderRadius: "6px",
                            backgroundColor: `${theme.accent}06`, fontSize: "12.5px",
                            color: theme.muted, lineHeight: 1.5,
                          }}>
                            {step}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }

                if (agentMsg.plan && agentMsg.code) {
                  return (
                    <div key={i}>
                      <p style={{ fontSize: "13px", color: theme.muted, margin: "0 0 10px", lineHeight: 1.5 }}>{agentMsg.plan}</p>
                      <div style={{ border: `1px solid ${theme.border}`, borderRadius: "8px", overflow: "hidden" }}>
                        <div style={{ padding: "6px 12px", borderBottom: `1px solid ${theme.border}`, backgroundColor: theme.bg }}>
                          <span className="font-mono" style={{ fontSize: "10px", color: theme.faint }}>python</span>
                        </div>
                        <pre className="font-mono" style={{ fontSize: "11.5px", lineHeight: 1.6, color: theme.codeText, padding: "12px", margin: 0, backgroundColor: theme.bg, whiteSpace: "pre-wrap" }}>
                          {agentMsg.code}
                        </pre>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "8px" }}>
                        <span style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: "#34D399" }} />
                        <span className="font-mono" style={{ fontSize: "11px", color: "#34D399" }}>{agentMsg.output}</span>
                      </div>
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </div>
          </div>

          {/* Right: Capabilities */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {CAPABILITIES.map(({ icon: Icon, label, desc }, i) => (
              <div key={label} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <div style={{
                  width: "42px", height: "42px", borderRadius: "10px",
                  backgroundColor: `${theme.accent}10`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <Icon size={18} style={{ color: theme.accent }} />
                </div>
                <div>
                  <h3 className="font-body" style={{ fontSize: "15px", fontWeight: 600, marginBottom: "4px", color: theme.text }}>{label}</h3>
                  <p className="font-body" style={{ fontSize: "13px", color: theme.muted, lineHeight: 1.55 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes agentBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.3; }
          40% { transform: translateY(-3px); opacity: 1; }
        }
      `}</style>
    </section>
  );
}
