import { NextResponse } from "next/server";
import { query, tablesReady } from "@/lib/db";
import crypto from "crypto";
import fs from "fs";
import path from "path";

const PREVIEWS_DIR = path.join(process.cwd(), "data", "web-projects", "previews");

function getPreviewDir(previewId: string): string {
  return path.join(PREVIEWS_DIR, previewId);
}

function savePreviewFiles(previewId: string, htmlCode: string, cssCode: string) {
  const dir = getPreviewDir(previewId);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(path.join(dir, "index.html"), htmlCode || "", "utf-8");
  fs.writeFileSync(path.join(dir, "style.css"), cssCode || "", "utf-8");
}

// POST — create preview link
export async function POST(req: Request) {
  try {
    await tablesReady;
    const { htmlCode, cssCode } = await req.json();

    const previewId = crypto.randomBytes(8).toString("hex");

    await query(
      "INSERT INTO previews (preview_id, html_code, css_code) VALUES ($1, $2, $3)",
      [previewId, htmlCode || "", cssCode || ""]
    );

    // Save files to folder
    savePreviewFiles(previewId, htmlCode || "", cssCode || "");

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

    // Try to read from files first
    const dir = getPreviewDir(previewId);
    const htmlPath = path.join(dir, "index.html");
    const cssPath = path.join(dir, "style.css");

    if (fs.existsSync(htmlPath)) {
      const htmlCode = fs.readFileSync(htmlPath, "utf-8");
      const cssCode = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, "utf-8") : "";
      return NextResponse.json({
        format: "codeiq-web",
        html: { file: "index.html", code: htmlCode },
        css: { file: "style.css", code: cssCode },
      });
    }

    // Fallback to database
    const results = await query(
      "SELECT html_code, css_code FROM previews WHERE preview_id = $1",
      [previewId]
    );

    if (results.length === 0) {
      return NextResponse.json({ error: "Preview not found" }, { status: 404 });
    }

    return NextResponse.json({
      format: "codeiq-web",
      html: { file: "index.html", code: results[0].html_code },
      css: { file: "style.css", code: results[0].css_code },
    });
  } catch (error: any) {
    console.error("Get preview error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
