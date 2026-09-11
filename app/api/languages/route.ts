import { NextResponse } from "next/server";
import { getLanguageRegistry } from "@/lib/languageRegistry";

export async function GET() {
  try {
    const languages = await getLanguageRegistry();
    return NextResponse.json({
      languages: languages.map((language) => ({
        id: language.editorKey,
        name: language.name,
        slug: language.editorKey,
        pageSlug: language.slug,
        extension: `.${language.extension.replace(/^\./, "")}`,
        stdin_support: language.stdinSupport,
        category: language.category,
        executionType: language.executionType,
        languageId: language.languageId,
        version: language.version,
        sampleCode: language.sampleCode,
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
