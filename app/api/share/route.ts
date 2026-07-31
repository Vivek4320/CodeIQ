import { NextResponse } from "next/server";
import { query, tablesReady } from "@/lib/db";
import crypto from "crypto";

// POST — create share link
export async function POST(req: Request) {
  try {
    await tablesReady;
    const { email, projectName, language, code, htmlCode, cssCode } = await req.json();

    if (!email || !language) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const users = await query("SELECT id FROM users WHERE email = $1", [email]);
    if (users.length === 0) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const shareId = crypto.randomBytes(8).toString("hex");

    // For HTML/CSS, store separately with clear structure
    const codeData = language === "html" || language === "css"
      ? JSON.stringify({
          format: "codeiq-web",
          html: { file: "index.html", code: htmlCode || "" },
          css: { file: "style.css", code: cssCode || "" },
        })
      : code;

    await query(
      "INSERT INTO shared_code (share_id, user_id, project_name, language, code) VALUES ($1, $2, $3, $4, $5)",
      [shareId, users[0].id, projectName || "untitled", language, codeData]
    );

    return NextResponse.json({
      shareUrl: `/share/${shareId}`,
      shareId,
      message: "Share link created!",
    });
  } catch (error: any) {
    console.error("Share error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET — fetch shared code
export async function GET(req: Request) {
  try {
    await tablesReady;
    const { searchParams } = new URL(req.url);
    const shareId = searchParams.get("id");

    if (!shareId) {
      return NextResponse.json({ error: "Share ID is required" }, { status: 400 });
    }

    const results = await query(
      "SELECT project_name, language, code, created_at, views FROM shared_code WHERE share_id = $1",
      [shareId]
    );

    if (results.length === 0) {
      return NextResponse.json({ error: "Shared code not found" }, { status: 404 });
    }

    // Increment view count
    await query("UPDATE shared_code SET views = views + 1 WHERE share_id = $1", [shareId]);

    return NextResponse.json({ shared: results[0] });
  } catch (error: any) {
    console.error("Get shared error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
