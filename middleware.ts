import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BUILT_IN_LANGUAGES = new Set([
  "javascript",
  "typescript",
  "python",
  "c",
  "cpp",
  "java",
  "go",
  "rust",
  "ruby",
  "haskell",
]);

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname !== "/api/execute" || request.method !== "POST") {
    return NextResponse.next();
  }

  try {
    const body = await request.clone().json();
    const language = typeof body?.language === "string" ? body.language : "";

    if (language && !BUILT_IN_LANGUAGES.has(language)) {
      const url = request.nextUrl.clone();
      url.pathname = "/api/execute-dynamic";
      return NextResponse.rewrite(url);
    }
  } catch {
    // Let the existing route handle malformed requests.
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/execute",
};
