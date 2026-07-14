import { NextResponse } from "next/server";
import pool from "@/lib/db";

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS projects (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      name VARCHAR(255) NOT NULL,
      language VARCHAR(50) NOT NULL,
      code LONGTEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
}

// GET — fetch all projects for a user
export async function GET(req: Request) {
  try {
    await ensureTable();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const [userRows] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    const users = userRows as any[];
    if (users.length === 0) {
      return NextResponse.json({ projects: [] });
    }

    const [projects] = await pool.query(
      "SELECT id, name, language, code, created_at, updated_at FROM projects WHERE user_id = ? ORDER BY updated_at DESC LIMIT 50",
      [users[0].id]
    );

    return NextResponse.json({ projects });
  } catch (error: any) {
    console.error("Get projects error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST — save a project
export async function POST(req: Request) {
  try {
    await ensureTable();
    const { email, name, language, code } = await req.json();

    if (!email || !name || !language || code === undefined) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const [userRows] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    const users = userRows as any[];
    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const [result] = await pool.query(
      "INSERT INTO projects (user_id, name, language, code) VALUES (?, ?, ?, ?)",
      [users[0].id, name, language, code]
    );

    const projectId = (result as any).insertId;

    return NextResponse.json({
      project: { id: projectId, name, language, code },
      message: "Project saved successfully",
    });
  } catch (error: any) {
    console.error("Save project error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT — update an existing project
export async function PUT(req: Request) {
  try {
    await ensureTable();
    const { email, projectId, name, language, code } = await req.json();

    if (!email || !projectId || !name || !language || code === undefined) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const [userRows] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    const users = userRows as any[];
    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await pool.query(
      "UPDATE projects SET name = ?, language = ?, code = ? WHERE id = ? AND user_id = ?",
      [name, language, code, projectId, users[0].id]
    );

    return NextResponse.json({
      project: { id: projectId, name, language, code },
      message: "Project updated successfully",
    });
  } catch (error: any) {
    console.error("Update project error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE — delete a project
export async function DELETE(req: Request) {
  try {
    await ensureTable();
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("id");
    const email = searchParams.get("email");

    if (!projectId || !email) {
      return NextResponse.json({ error: "Project ID and email are required" }, { status: 400 });
    }

    const [userRows] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    const users = userRows as any[];
    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await pool.query("DELETE FROM projects WHERE id = ? AND user_id = ?", [projectId, users[0].id]);

    return NextResponse.json({ message: "Project deleted" });
  } catch (error: any) {
    console.error("Delete project error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
