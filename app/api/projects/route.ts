import { NextResponse } from "next/server";
import { query, tablesReady } from "@/lib/db";
import fs from "fs";
import path from "path";

const PROJECTS_DIR = path.join(process.cwd(), "data", "web-projects");

function getProjectDir(projectId: number): string {
  return path.join(PROJECTS_DIR, String(projectId));
}

function saveWebFiles(projectId: number, htmlCode: string, cssCode: string) {
  const dir = getProjectDir(projectId);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(path.join(dir, "index.html"), htmlCode || "", "utf-8");
  fs.writeFileSync(path.join(dir, "style.css"), cssCode || "", "utf-8");
}

function deleteWebFiles(projectId: number) {
  const dir = getProjectDir(projectId);
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

// GET — fetch all projects for a user
export async function GET(req: Request) {
  try {
    await tablesReady;
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const users = await query("SELECT id FROM users WHERE email = $1", [email]);
    if (users.length === 0) {
      return NextResponse.json({ projects: [] });
    }

    const projects = await query(
      "SELECT id, name, language, code, created_at, updated_at FROM projects WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 50",
      [users[0].id]
    );

    return NextResponse.json({ projects });
  } catch (error: any) {
    console.error("Get projects error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST — save a project
export async function POST(req: Request) {
  try {
    await tablesReady;
    const { email, name, language, code, htmlCode, cssCode } = await req.json();

    if (!email || !name || !language) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const users = await query("SELECT id FROM users WHERE email = $1", [email]);
    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // For HTML/CSS, store JSON in DB + save files to folder
    const isWeb = language === "html" || language === "css";
    const codeData = isWeb
      ? JSON.stringify({
          format: "codeiq-web",
          html: { file: "index.html", code: htmlCode || "" },
          css: { file: "style.css", code: cssCode || "" },
        })
      : code || "";

    const result = await query(
      "INSERT INTO projects (user_id, name, language, code) VALUES ($1, $2, $3, $4) RETURNING id",
      [users[0].id, name, language, codeData]
    );

    const projectId = result[0].id;

    // Save files to folder
    if (isWeb) {
      saveWebFiles(projectId, htmlCode || "", cssCode || "");
    }

    return NextResponse.json({
      project: { id: projectId, name, language, code: codeData },
      message: "Project saved successfully",
    });
  } catch (error: any) {
    console.error("Save project error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT — update an existing project
export async function PUT(req: Request) {
  try {
    await tablesReady;
    const { email, projectId, name, language, code, htmlCode, cssCode } = await req.json();

    if (!email || !projectId || !name || !language) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const users = await query("SELECT id FROM users WHERE email = $1", [email]);
    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // For HTML/CSS, store JSON in DB + save files to folder
    const isWeb = language === "html" || language === "css";
    const codeData = isWeb
      ? JSON.stringify({
          format: "codeiq-web",
          html: { file: "index.html", code: htmlCode || "" },
          css: { file: "style.css", code: cssCode || "" },
        })
      : code || "";

    await query(
      "UPDATE projects SET name = $1, language = $2, code = $3 WHERE id = $4 AND user_id = $5",
      [name, language, codeData, projectId, users[0].id]
    );

    // Save files to folder
    if (isWeb) {
      saveWebFiles(projectId, htmlCode || "", cssCode || "");
    }

    return NextResponse.json({
      project: { id: projectId, name, language, code: codeData },
      message: "Project updated successfully",
    });
  } catch (error: any) {
    console.error("Update project error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE — delete a project
export async function DELETE(req: Request) {
  try {
    await tablesReady;
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("id");
    const email = searchParams.get("email");

    if (!projectId || !email) {
      return NextResponse.json({ error: "Project ID and email are required" }, { status: 400 });
    }

    const users = await query("SELECT id FROM users WHERE email = $1", [email]);
    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete files from folder
    deleteWebFiles(Number(projectId));

    await query("DELETE FROM projects WHERE id = $1 AND user_id = $2", [projectId, users[0].id]);

    return NextResponse.json({ message: "Project deleted" });
  } catch (error: any) {
    console.error("Delete project error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
