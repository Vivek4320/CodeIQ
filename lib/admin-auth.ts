import { query } from "./db";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "vivekpankhaniya43@gmail.com";

export async function isAdmin(email: string): Promise<boolean> {
  if (email === ADMIN_EMAIL) return true;
  try {
    const rows = await query("SELECT role FROM users WHERE email = $1", [email]);
    return rows.length > 0 && rows[0].role === "admin";
  } catch {
    return false;
  }
}

export async function getAdminUser(email: string) {
  try {
    const rows = await query("SELECT id, name, email, role FROM users WHERE email = $1", [email]);
    if (rows.length === 0) return null;
    return { ...rows[0], role: email === ADMIN_EMAIL ? "admin" : rows[0].role };
  } catch {
    return null;
  }
}

export { ADMIN_EMAIL };
