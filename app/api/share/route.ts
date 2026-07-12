import { NextResponse } from "next/server";
import pool from "@/lib/db";
import crypto from "crypto";

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS shared_code (
      id INT AUTO_INCREMENT PRIMARY KEY,
      share_id VARCHAR(16) UNIQUE NOT NULL,
      user_id INT NOT NULL,
      project_name VARCHAR(255) NOT NULL,
      language VARCHAR(50) NOT NULL,
      code LONGTEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      views INT DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
}

// POST — create share link
export async function POST(req: Request) {
  try {
    await ensureTable();
    const { email, projectName, language, code } = await req.json();

    if (!email || !language || code === undefined) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const [userRows] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    const users = userRows as any[];
    if (users.length === 0) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const shareId = crypto.randomBytes(8).toString("hex");

    await pool.query(
      "INSERT INTO shared_code (share_id, user_id, project_name, language, code) VALUES (?, ?, ?, ?, ?)",
      [shareId, users[0].id, projectName || "untitled", language, code]
    );

    return NextResponse.json({
      shareUrl: `/share/${shareId}`,
      shareId,
      message: "Share link created!",
    });
  } catch (error: any) {
    console.error("Share error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET — fetch shared code
export async function GET(req: Request) {
  try {
    await ensureTable();
    const { searchParams } = new URL(req.url);
    const shareId = searchParams.get("id");

    if (!shareId) {
      return NextResponse.json({ error: "Share ID is required" }, { status: 400 });
    }

    const [rows] = await pool.query(
      "SELECT project_name, language, code, created_at, views FROM shared_code WHERE share_id = ?",
      [shareId]
    );
    const results = rows as any[];

    if (results.length === 0) {
      return NextResponse.json({ error: "Shared code not found" }, { status: 404 });
    }

    // Increment view count
    await pool.query("UPDATE shared_code SET views = views + 1 WHERE share_id = ?", [shareId]);

    return NextResponse.json({ shared: results[0] });
  } catch (error: any) {
    console.error("Get shared error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
