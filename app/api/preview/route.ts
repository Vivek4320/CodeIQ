import { NextResponse } from "next/server";
import { query, tablesReady } from "@/lib/db";
import crypto from "crypto";

// POST — create preview link
export async function POST(req: Request) {
  try {
    await tablesReady;
    const { htmlCode, cssCode } = await req.json();

    const previewId = crypto.randomBytes(8).toString("hex");
    const html = htmlCode || "";
    const css = cssCode || "";

    // Store preview source in the database. Do not write to the local
    // filesystem because Vercel serverless functions use an immutable
    // runtime filesystem and /var/task is not writable.
    await query(
      "INSERT INTO previews (preview_id, html_code, css_code) VALUES ($1, $2, $3)",
      [previewId, html, css]
    );

    return NextResponse.json({
      previewUrl: `/preview/${previewId}`,
      previewId,
    });
  } catch (error: any) {
    console.error("Preview error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET — fetch preview
export async function GET(req: Request) {
  try {
    await tablesReady;
    const { searchParams } = new URL(req.url);
    const previewId = searchParams.get("id");

    if (!previewId) {
      return NextResponse.json({ error: "Preview ID is required" }, { status: 400 });
    }

    // Preview data is persisted in the database, which works across Vercel
    // serverless invocations and deployments.
    const results = await query(
      "SELECT html_code, css_code FROM previews WHERE preview_id = $1",
      [previewId]
    );

    if (results.length === 0) {
      return NextResponse.json({ error: "Preview not found" }, { status: 404 });
    }

    return NextResponse.json({
      format: "codeiq-web",
      html: { file: "index.html", code: results[0].html_code || "" },
      css: { file: "style.css", code: results[0].css_code || "" },
    });
  } catch (error: any) {
    console.error("Get preview error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
