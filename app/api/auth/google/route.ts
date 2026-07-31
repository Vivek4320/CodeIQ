import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { credential } = await req.json();

    if (!credential) {
      return NextResponse.json({ error: "Google credential is required" }, { status: 400 });
    }

    // Verify JWT with Google's tokeninfo endpoint
    let payload: any;
    try {
      const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
      if (!googleRes.ok) {
        return NextResponse.json({ error: "Invalid Google token" }, { status: 401 });
      }
      payload = await googleRes.json();
    } catch {
      return NextResponse.json({ error: "Failed to verify Google token" }, { status: 401 });
    }

    const email = payload.email;
    const name = payload.name || "";
    const image = payload.picture || "";

    if (!email) {
      return NextResponse.json({ error: "Email not found in Google token" }, { status: 400 });
    }

    // Check if user exists
    const users = await query("SELECT id, name, email FROM users WHERE email = $1", [email]);

    if (users.length > 0) {
      // Update image if provided
      if (image) {
        await query("UPDATE users SET image = $1 WHERE email = $2", [image, email]);
      }
      return NextResponse.json({ user: users[0], message: "Login successful" });
    }

    // New user — create account
    const result = await query(
      "INSERT INTO users (name, email, password, image) VALUES ($1, $2, $3, $4) RETURNING id",
      [name, email, "google_oauth", image || null]
    );

    return NextResponse.json({
      user: { id: result[0].id, name, email },
      message: "Account created successfully",
    });
  } catch (error: any) {
    console.error("Google auth error:", error.message);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
