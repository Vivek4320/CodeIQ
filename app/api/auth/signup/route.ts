import { NextResponse } from "next/server";
import { query, ensureTables } from "@/lib/db";

export async function POST(req: Request) {
  try {
    await ensureTables();

    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const existing = await query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.length > 0) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const result = await query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id",
      [name, email, password]
    );

    const userId = result[0].id;

    return NextResponse.json({
      user: { id: userId, name, email },
      message: "Account created successfully",
    });
  } catch (error: any) {
    console.error("Signup error:", error.message);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
