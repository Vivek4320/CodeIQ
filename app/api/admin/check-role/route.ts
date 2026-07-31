import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { ADMIN_EMAIL } from "@/lib/admin-auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    if (!email) return NextResponse.json({ role: "user" });

    // Hardcoded admin
    if (email === ADMIN_EMAIL) return NextResponse.json({ role: "admin" });

    // Check DB
    const rows = await query("SELECT role FROM users WHERE email = $1", [email]);
    return NextResponse.json({ role: rows[0]?.role || "user" });
  } catch {
    return NextResponse.json({ role: "user" });
  }
}
