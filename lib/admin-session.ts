const COOKIE_NAME = "codeiq_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;
const TOKEN_VERSION = "v1";

function secret(): string {
  const value = process.env.ADMIN_PASSWORD;
  if (!value) throw new Error("ADMIN_PASSWORD is not set");
  return value;
}

function toHex(bytes: ArrayBuffer): string {
  return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function fromHex(value: string): Uint8Array {
  if (!/^[0-9a-f]+$/i.test(value) || value.length % 2 !== 0) return new Uint8Array();
  const bytes = new Uint8Array(value.length / 2);
  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = parseInt(value.slice(index * 2, index * 2 + 2), 16);
  }
  return bytes;
}

function base64UrlEncode(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(value: string): string | null {
  try {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
}

function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let index = 0; index < a.length; index += 1) result |= a[index] ^ b[index];
  return result === 0;
}

async function sign(value: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return toHex(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value)));
}

export async function createAdminSession(email: string): Promise<string> {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const encodedEmail = base64UrlEncode(email.trim().toLowerCase());
  const payload = `${TOKEN_VERSION}.${encodedEmail}.${expiresAt}`;
  const signature = await sign(payload);
  return `${payload}.${signature}`;
}

export async function getAdminEmailFromSession(value: string | null | undefined): Promise<string | null> {
  if (!value) return null;

  const parts = value.split(".");
  if (parts.length !== 4) return null;

  const [version, encodedEmail, expiresAt, signature] = parts;
  if (version !== TOKEN_VERSION || !encodedEmail || !signature || !/^\d+$/.test(expiresAt)) return null;

  const expires = Number(expiresAt);
  if (!Number.isSafeInteger(expires) || expires <= Math.floor(Date.now() / 1000)) return null;

  try {
    const payload = `${version}.${encodedEmail}.${expiresAt}`;
    const expected = await sign(payload);
    if (!constantTimeEqual(fromHex(signature), fromHex(expected))) return null;

    const email = base64UrlDecode(encodedEmail);
    if (!email) return null;

    const configuredAdminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    return configuredAdminEmail && email.toLowerCase() === configuredAdminEmail ? email : null;
  } catch {
    return null;
  }
}

export async function getAdminEmailFromRequest(req: Request): Promise<string | null> {
  const cookieHeader = req.headers.get("cookie") || "";
  const prefix = `${COOKIE_NAME}=`;
  const cookie = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));

  return getAdminEmailFromSession(cookie ? cookie.slice(prefix.length) : null);
}

export async function requireAdmin(req: Request): Promise<string | null> {
  return getAdminEmailFromRequest(req);
}

export const adminCookieName = COOKIE_NAME;
export const adminSessionMaxAge = SESSION_TTL_SECONDS;
