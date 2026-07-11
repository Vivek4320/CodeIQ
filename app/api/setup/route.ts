import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    // Create users table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Test connection
    const [rows] = await pool.query("SELECT COUNT(*) as count FROM users");

    return NextResponse.json({
      message: "Database connected! Users table ready.",
      totalUsers: (rows as any[])[0].count,
    });
  } catch (error: any) {
    console.error("DB Setup error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
