import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-session";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    if (!await requireAdmin(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(50, Math.max(10, Number(searchParams.get("limit") || 20)));
    const search = (searchParams.get("search") || "").trim();
    const offset = (page - 1) * limit;
    const pattern = `%${search}%`;
    const rows = await query(
      `SELECT u.id, u.name, u.email, u.role, u.image, u.created_at,
              (SELECT MAX(created_at) FROM run_history WHERE user_id = u.id) AS last_activity,
              (SELECT COUNT(*) FROM projects WHERE user_id = u.id) AS project_count,
              (SELECT COUNT(*) FROM run_history WHERE user_id = u.id) AS execution_count
       FROM users u WHERE ($1 = '' OR u.name ILIKE $2 OR u.email ILIKE $2)
       ORDER BY u.created_at DESC LIMIT $3 OFFSET $4`, [search, pattern, limit, offset]);
    const count = await query("SELECT COUNT(*) AS count FROM users WHERE ($1 = '' OR name ILIKE $2 OR email ILIKE $2)", [search, pattern]);
    return NextResponse.json({ users: rows, total: Number(count[0].count), page, limit });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { userId, role } = await req.json();
    if (!await requireAdmin(req) || !["user", "admin"].includes(role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    await query("UPDATE users SET role = $1 WHERE id = $2", [role, userId]);
    return NextResponse.json({ message: "Role updated" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
