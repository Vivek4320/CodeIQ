import { query } from "./db";

const COOKIE_NAME = "codeiq_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

function secret(): string {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value) throw new Error("ADMIN_SESSION_SECRET is not set");
  return value;
}

function toHex(bytes: ArrayBuffer): string {
  return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function fromHex(value: string): Uint8Array {
  const bytes = new Uint8Array(value.length / 2);
  for (let index = 0; index < bytes.length; index += 1) bytes[index] = parseInt(value.slice(index * 2, index * 2 + 2), 16);
  return bytes;
}

async function sign(value: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret()), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return toHex(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value)));
}

export async function createAdminSession(email: string): Promise<string> {
  const payload = `${encodeURIComponent(email)}|${Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS}`;
  return `${payload}|${await sign(payload)}`;
}

export async function getAdminEmailFromSession(value: string | null | undefined): Promise<string | null> {
  if (!value) return null;
  const parts = value.split("|");
  if (parts.length !== 3 || Number(parts[1]) < Math.floor(Date.now() / 1000)) return null;
  const expected = await sign(`${parts[0]}|${parts[1]}`);
  const actual = fromHex(parts[2]);
  const expectedBytes = fromHex(expected);
  if (actual.length !== expectedBytes.length || !actual.every((byte, index) => byte === expectedBytes[index])) return null;
  return decodeURIComponent(parts[0]);
}

export async function getAdminEmailFromRequest(req: Request): Promise<string | null> {
  const cookieHeader = req.headers.get("cookie") || "";
  const cookie = cookieHeader.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${COOKIE_NAME}=`));
  return getAdminEmailFromSession(cookie?.slice(COOKIE_NAME.length + 1));
}

export async function requireAdmin(req: Request): Promise<string | null> {
  const email = await getAdminEmailFromRequest(req);
  if (!email) return null;
  const rows = await query("SELECT role FROM users WHERE email = $1", [email]);
  if (email === process.env.ADMIN_EMAIL || rows[0]?.role === "admin") return email;
  return null;
}

export const adminCookieName = COOKIE_NAME;
export const adminSessionMaxAge = SESSION_TTL_SECONDS;