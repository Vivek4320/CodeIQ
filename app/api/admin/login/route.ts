import { NextResponse } from "next/server";
import { createAdminSession, adminCookieName, adminSessionMaxAge } from "@/lib/admin-session";

export const runtime = "nodejs";

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i += 1) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const adminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || "";
    const sessionSecret = process.env.ADMIN_SESSION_SECRET || "";

    // Admin authentication is intentionally independent from the users table.
    // Credentials must exist in the server-side environment only.
    if (!adminEmail || !adminPassword || !sessionSecret) {
      console.error("Admin authentication is not configured");
      return NextResponse.json({ error: "Admin authentication is not configured" }, { status: 503 });
    }

    if (!safeEqual(email, adminEmail) || !safeEqual(password, adminPassword)) {
      return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 });
    }

    const response = NextResponse.json({ user: { email: adminEmail, name: "Administrator" } });
    response.cookies.set(adminCookieName, await createAdminSession(adminEmail), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: adminSessionMaxAge,
    });

    return response;
  } catch (error: any) {
    console.error("Admin login error:", error?.message || error);
    return NextResponse.json({ error: "Unable to sign in" }, { status: 500 });
  }
}
