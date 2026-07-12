import { NextResponse } from "next/server";
import pool from "@/lib/db";

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS run_history (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      project_name VARCHAR(255) NOT NULL,
      language VARCHAR(50) NOT NULL,
      code LONGTEXT NOT NULL,
      output LONGTEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
}

// GET — fetch run history
export async function GET(req: Request) {
  try {
    await ensureTable();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const projectName = searchParams.get("project");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const [userRows] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    const users = userRows as any[];
    if (users.length === 0) return NextResponse.json({ runs: [] });

    let query = "SELECT id, project_name, language, code, output, created_at FROM run_history WHERE user_id = ?";
    const params: any[] = [users[0].id];

    if (projectName) {
      query += " AND project_name = ?";
      params.push(projectName);
    }

    query += " ORDER BY created_at DESC LIMIT 50";

    const [runs] = await pool.query(query, params);
    return NextResponse.json({ runs });
  } catch (error: any) {
    console.error("Get runs error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST — save a run
export async function POST(req: Request) {
  try {
    await ensureTable();
    const { email, projectName, language, code, output } = await req.json();

    if (!email || !projectName || !language || code === undefined) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const [userRows] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    const users = userRows as any[];
    if (users.length === 0) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const [result] = await pool.query(
      "INSERT INTO run_history (user_id, project_name, language, code, output) VALUES (?, ?, ?, ?, ?)",
      [users[0].id, projectName, language, code, JSON.stringify(output || [])]
    );

    return NextResponse.json({ runId: (result as any).insertId, message: "Run saved" });
  } catch (error: any) {
    console.error("Save run error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
