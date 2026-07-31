/**
 * KeyKing SDK — Zero-Trust LLM routing for CodeIQ.
 *
 * Reads KK_VAULT + KK_VAULT_PASS from env.
 * SDK decrypts the vault and routes through providers with automatic failover.
 */

import { KeyKing, type KeyKingConfig, type Provider } from "keyking-sdk";

const AGENT_ROUTING: { provider: Provider; model: string }[] = [
  { provider: "Groq", model: "llama-3.3-70b-versatile" },
  { provider: "Anthropic", model: "claude-3-5-sonnet-20241022" },
  { provider: "OpenAI", model: "gpt-4o" },
];

const COMPLETION_ROUTING: { provider: Provider; model: string }[] = [
  { provider: "Groq", model: "llama-3.3-70b-versatile" },
  { provider: "OpenAI", model: "gpt-4o-mini" },
];

function buildConfig(routingRules: { provider: Provider; model: string }[], overrides?: Partial<KeyKingConfig>): KeyKingConfig {
  const vault = process.env.KK_VAULT;
  const password = process.env.KK_VAULT_PASS;

  if (!vault || !password) {
    throw new Error("KK_VAULT and KK_VAULT_PASS must be set in .env.local");
  }

  return { vault, password, routingRules, maxRetries: 3, timeout: 60000, ...overrides };
}

let _agentClient: KeyKing | null = null;
let _completionClient: KeyKing | null = null;

export function getAgentClient(): KeyKing {
  if (!_agentClient) _agentClient = new KeyKing(buildConfig(AGENT_ROUTING));
  return _agentClient;
}

export function getCompletionClient(): KeyKing {
  if (!_completionClient) _completionClient = new KeyKing(buildConfig(COMPLETION_ROUTING, { timeout: 10000 }));
  return _completionClient;
}
