import { NextResponse } from "next/server";
import { query } from "@/lib/db";

const ADMIN_EMAIL = "vivekpankhaniya43@gmail.com";

// POST — submit feedback (anyone can)
export async function POST(req: Request) {
  try {
    const { name, email, rating, comment } = await req.json();

    if (!rating || !comment) {
      return NextResponse.json({ error: "Rating and comment are required" }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    // Try to find user_id if email provided
    let userId = null;
    if (email) {
      const users = await query("SELECT id FROM users WHERE email = $1", [email]);
      if (users.length > 0) userId = users[0].id;
    }

    await query(
      "INSERT INTO feedback (user_id, name, email, rating, comment) VALUES ($1, $2, $3, $4, $5)",
      [userId, name || null, email || null, rating, comment]
    );

    return NextResponse.json({ message: "Thank you for your feedback! 🙏" });
  } catch (error: any) {
    console.error("Feedback error:", error);
    return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 });
  }
}

// GET — list feedback (admin only)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    // Only admin can view feedback
    if (!email || email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const rows = await query(
      "SELECT id, name, email, rating, comment, created_at FROM feedback ORDER BY created_at DESC LIMIT 100"
    );
    return NextResponse.json({ feedback: rows });
  } catch (error: any) {
    console.error("Get feedback error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
