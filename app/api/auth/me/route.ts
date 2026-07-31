import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const rows = await query("SELECT id, name, email FROM users WHERE email = $1", [email]);

    if (rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: rows[0] });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
