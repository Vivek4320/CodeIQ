import { NextResponse } from "next/server";
import { query, tablesReady } from "@/lib/db";

export async function GET(req: Request) {
  try {
    await tablesReady;
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const projectName = searchParams.get("project");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const users = await query("SELECT id FROM users WHERE email = $1", [email]);
    if (users.length === 0) return NextResponse.json({ runs: [] });

    let sql = "SELECT id, project_name, language, code, output, created_at FROM run_history WHERE user_id = $1";
    const params: any[] = [users[0].id];

    if (projectName) {
      sql += " AND project_name = $2";
      params.push(projectName);
    }

    sql += " ORDER BY created_at DESC LIMIT 50";

    const runs = await query(sql, params);
    return NextResponse.json({ runs });
  } catch (error: any) {
    console.error("Get runs error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await tablesReady;
    const { email, projectName, language, code, output } = await req.json();

    if (!email || !projectName || !language || code === undefined) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const users = await query("SELECT id FROM users WHERE email = $1", [email]);
    if (users.length === 0) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const result = await query(
      "INSERT INTO run_history (user_id, project_name, language, code, output) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [users[0].id, projectName, language, code, JSON.stringify(output || [])]
    );

    return NextResponse.json({ runId: result[0].id, message: "Run saved" });
  } catch (error: any) {
    console.error("Save run error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
