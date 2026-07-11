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
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if ((existing as any[]).length > 0) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const [result] = await pool.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, password]
    );

    const userId = (result as any).insertId;

    return NextResponse.json({
      user: { id: userId, name, email },
      message: "Account created successfully",
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
