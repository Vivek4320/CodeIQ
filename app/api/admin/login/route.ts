import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { createAdminSession, adminCookieName, adminSessionMaxAge } from "@/lib/admin-session";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: "Email and password are required" }, { status: 400 });

    const isBootstrapAdmin = email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD;
    const users = await query("SELECT id, name, email, role FROM users WHERE email = $1 AND password = $2", [email, password]);
    const isDatabaseAdmin = users[0]?.role === "admin";
    if (!isBootstrapAdmin && !isDatabaseAdmin) return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 });

    const response = NextResponse.json({ user: { email, name: users[0]?.name || "Administrator" } });
    response.cookies.set(adminCookieName, await createAdminSession(email), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: adminSessionMaxAge,
    });
    return response;
  } catch (error: any) {
    console.error("Admin login error:", error.message);
    return NextResponse.json({ error: "Unable to sign in" }, { status: 500 });
  }
}