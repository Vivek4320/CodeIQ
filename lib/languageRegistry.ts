import { query } from "@/lib/db";
import { compilerLanguages, type CompilerLanguage } from "@/lib/compilerLanguages";

export interface RegistryLanguage extends CompilerLanguage {
  languageId: number | null;
  stdinSupport: boolean;
  category: string;
  sortOrder: number;
  isActive: boolean;
}

const LEGACY_JUDGE0_IDS: Record<string, number | null> = {
  c: 50, cpp: 54, java: 62, javascript: 63, python: 71,
  go: 60, ruby: 72, rust: 73, typescript: 74, haskell: 85,
  html: null, css: null,
};

function parseJson<T>(value: unknown, fallback: T): T {
  if (Array.isArray(value)) return value as T;
  if (typeof value === "string") {
    try { return JSON.parse(value) as T; } catch { return fallback; }
  }
  return fallback;
}

export function staticToRegistry(lang: CompilerLanguage): RegistryLanguage {
  return {
    ...lang,
    languageId: LEGACY_JUDGE0_IDS[lang.editorKey] ?? null,
    stdinSupport: lang.executionType === "judge0",
    category: lang.executionType === "live-preview" ? "web" : "general",
    sortOrder: 0,
    isActive: true,
  };
}

function rowToLanguage(row: any): RegistryLanguage {
  return {
    slug: row.slug,
    name: row.name,
    editorKey: row.editor_key || row.slug,
    title: row.title || `Online ${row.name} Compiler – Run ${row.name} Code Online | CodeIQ`,
    description: row.description || `Write and run ${row.name} code online with CodeIQ.`,
    extension: row.extension,
    sampleCode: row.sample_code || `// Welcome to CodeIQ ${row.name} editor`,
    h1: row.h1 || `Online ${row.name} ${row.execution_type === "live-preview" ? "Editor" : "Compiler"}`,
    version: row.version || "Latest",
    executionType: row.execution_type || "judge0",
    useCases: parseJson<string[]>(row.use_cases, []),
    faqItems: parseJson<{ q: string; a: string }[]>(row.faq_items, []),
    relatedSlugs: parseJson<string[]>(row.related_slugs, []),
    languageId: row.language_id == null ? null : Number(row.language_id),
    stdinSupport: Boolean(row.stdin_support),
    category: row.category || "general",
    sortOrder: Number(row.sort_order || 0),
    isActive: row.is_active !== false,
  };
}

export async function getLanguageRegistry(): Promise<RegistryLanguage[]> {
  try {
    const rows = await query(`
      SELECT slug, name, extension, is_active, stdin_support, category, sort_order,
             execution_type, language_id, editor_key, title, description, h1, version,
             sample_code, use_cases, faq_items, related_slugs
      FROM languages
      WHERE is_active = TRUE
      ORDER BY sort_order ASC, name ASC
    `);
    if (rows.length > 0) return rows.map(rowToLanguage);
  } catch (error) {
    console.error("Language registry query failed:", error);
  }
  return compilerLanguages.map(staticToRegistry);
}

export async function getLanguageByRegistrySlug(slug: string): Promise<RegistryLanguage | undefined> {
  const languages = await getLanguageRegistry();
  return languages.find((language) => language.slug === slug);
}

export async function getLanguageByEditorKey(editorKey: string): Promise<RegistryLanguage | undefined> {
  const languages = await getLanguageRegistry();
  return languages.find((language) => language.editorKey === editorKey);
}
