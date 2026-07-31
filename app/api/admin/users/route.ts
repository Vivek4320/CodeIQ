import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { isAdmin } from "@/lib/admin-auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    if (!email || !await isAdmin(email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const rows = await query("SELECT id, name, email, role, image, created_at FROM users ORDER BY created_at DESC");
    return NextResponse.json({ users: rows });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { email, userId, role } = await req.json();
    if (!email || !await isAdmin(email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    await query("UPDATE users SET role = $1 WHERE id = $2", [role, userId]);
    return NextResponse.json({ message: "Role updated" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
