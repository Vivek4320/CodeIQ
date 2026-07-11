import { NextResponse } from "next/server";
import pool from "@/lib/db";

// Ensure users table exists
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
}

export async function POST(req: Request) {
  try {
    await ensureTable();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const [rows] = await pool.query("SELECT id, name, email FROM users WHERE email = ?", [email]);
    const users = rows as any[];

    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: users[0] });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
