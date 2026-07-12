import { NextResponse } from "next/server";
import pool from "@/lib/db";

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  // Add image column if not exists (for Google auth)
  try {
    await pool.query("ALTER TABLE users ADD COLUMN image VARCHAR(500) DEFAULT NULL");
  } catch {}
}

export async function POST(req: Request) {
  try {
    await ensureTable();
    const { name, email, image } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if user exists
    const [existing] = await pool.query("SELECT id, name, email FROM users WHERE email = ?", [email]);
    const users = existing as any[];

    if (users.length > 0) {
      // Update image if provided
      if (image) {
        await pool.query("UPDATE users SET image = ? WHERE email = ?", [image, email]);
      }
      return NextResponse.json({ user: users[0], message: "Login successful" });
    }

    // New user — create account
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, image) VALUES (?, ?, ?, ?)",
      [name, email, "google_oauth", image || null]
    );

    return NextResponse.json({
      user: { id: (result as any).insertId, name, email },
      message: "Account created successfully",
    });
  } catch (error: any) {
    console.error("Google auth error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
