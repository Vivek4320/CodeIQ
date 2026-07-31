import { NextResponse } from "next/server";
import { query, tablesReady } from "@/lib/db";

export async function GET() {
  try {
    await tablesReady;

    // Test connection
    const rows = await query("SELECT COUNT(*) as count FROM users");

    return NextResponse.json({
      message: "Database connected! Users table ready.",
      totalUsers: rows[0].count,
    });
  } catch (error: any) {
    console.error("DB Setup error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}