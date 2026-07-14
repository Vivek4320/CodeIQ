import { NextResponse } from "next/server";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ completions: [] }, { status: 200 });
    }

    const { language, code, cursorPosition } = await req.json();

    if (!language || code === undefined || cursorPosition === undefined) {
      return NextResponse.json({ completions: [] }, { status: 200 });
    }

    // Extract context: ~20 lines before cursor, ~5 lines after
    const lines = code.split("\n");
    let charCount = 0;
    let cursorLine = 0;
    for (let i = 0; i < lines.length; i++) {
      if (charCount + lines[i].length >= cursorPosition) {
        cursorLine = i;
        break;
      }
      charCount += lines[i].length + 1;
    }

    const contextStart = Math.max(0, cursorLine - 20);
    const contextEnd = Math.min(lines.length, cursorLine + 5);
    const contextCode = lines.slice(contextStart, contextEnd).join("\n");

    const prompt = `You are a code completion engine. Given the following ${language} code context, suggest exactly 5 short, relevant code completions.

Rules:
- Return ONLY a JSON array of objects with "label", "type", and "detail" fields
- "label" is the completion text (short, 1-3 words max, no newlines)
- "type" is one of: "function", "method", "keyword", "variable", "class", "property", "snippet"
- "detail" is a brief 2-5 word description
- Do not include explanations, markdown, or code fences — only the raw JSON array
- If no completions make sense, return an empty array []

Code context:
\`\`\`${language}
${contextCode}
\`\`\`

Return JSON array:`;

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 256,
        },
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ completions: [] }, { status: 200 });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!text) {
      return NextResponse.json({ completions: [] }, { status: 200 });
    }

    // Parse JSON, handling markdown code fences if present
    let parsed: { label: string; type: string; detail: string }[];
    try {
      const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json({ completions: [] }, { status: 200 });
    }

    const completions = parsed
      .filter((c) => c.label && typeof c.label === "string")
      .slice(0, 5)
      .map((c) => ({
        label: c.label,
        type: c.type || "snippet",
        detail: c.detail || "AI suggestion",
        isAI: true,
      }));

    return NextResponse.json({ completions });
  } catch {
    return NextResponse.json({ completions: [] }, { status: 200 });
  }
}
