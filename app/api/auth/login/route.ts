import { NextResponse } from "next/server";
import { query, ensureTables } from "@/lib/db";

export async function POST(req: Request) {
  try {
    await ensureTables();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const users = await query("SELECT id, name, email FROM users WHERE email = $1 AND password = $2", [email, password]);

    if (users.length === 0) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    return NextResponse.json({
      user: users[0],
      message: "Login successful",
    });
  } catch (error: any) {
    console.error("Login error:", error.message);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
