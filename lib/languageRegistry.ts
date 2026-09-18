import { query } from "@/lib/db";
import { compilerLanguages, type CompilerLanguage } from "@/lib/compilerLanguages";

export interface RegistryLanguage extends CompilerLanguage {
  languageId: number | null;
  stdinSupport: boolean;
  category: string;
  sortOrder: number;
  isActive: boolean;
  id?: number;
}

const LEGACY_JUDGE0_IDS: Record<string, number | null> = {
  c: 50, cpp: 54, java: 62, javascript: 63, python: 71,
  go: 60, ruby: 72, rust: 73, typescript: 74, haskell: 85,
  php: 68,
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
  const editorKey = row.editor_key || row.slug;
  const configuredLanguageId = row.language_id == null ? null : Number(row.language_id);
  const languageId = editorKey === "php"
    ? 68
    : (configuredLanguageId ?? LEGACY_JUDGE0_IDS[editorKey] ?? null);

  return {
    slug: row.slug,
    name: row.name,
    editorKey,
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
    languageId,
    stdinSupport: Boolean(row.stdin_support),
    category: row.category || "general",
    sortOrder: Number(row.sort_order || 0),
    isActive: row.is_active !== false,
    id: row.id == null ? undefined : Number(row.id),
  };
}

function mergeBuiltInLanguage(
  staticLanguage: CompilerLanguage,
  dbLanguage?: RegistryLanguage,
): RegistryLanguage {
  const fallback = staticToRegistry(staticLanguage);
  if (!dbLanguage) return fallback;

  return {
    ...fallback,
    ...dbLanguage,
    // Built-in language URLs are canonical and must not change if a legacy
    // database row uses an editor key/slug such as "python" instead of
    // the public page slug "python-compiler".
    slug: fallback.slug,
    editorKey: fallback.editorKey,
    executionType: dbLanguage.executionType || fallback.executionType,
    languageId: dbLanguage.languageId ?? fallback.languageId,
    extension: dbLanguage.extension || fallback.extension,
    sampleCode: dbLanguage.sampleCode || fallback.sampleCode,
    version: dbLanguage.version || fallback.version,
    stdinSupport: dbLanguage.stdinSupport || fallback.stdinSupport,
    category: dbLanguage.category || fallback.category,
  };
}

export async function getLanguageRegistry(includeInactive = false): Promise<RegistryLanguage[]> {
  try {
    const rows = await query(`
      SELECT id, slug, name, extension, is_active, stdin_support, category, sort_order,
             execution_type, language_id, editor_key, title, description, h1, version,
             sample_code, use_cases, faq_items, related_slugs
      FROM languages
      ${includeInactive ? "" : "WHERE is_active = TRUE"}
      ORDER BY sort_order ASC, name ASC
    `);

    const dbLanguages = rows.map(rowToLanguage);
    const dbByEditorKey = new Map(dbLanguages.map((language) => [language.editorKey, language]));
    const dbBySlug = new Map(dbLanguages.map((language) => [language.slug, language]));

    const merged = compilerLanguages.map((language) =>
      mergeBuiltInLanguage(
        language,
        dbByEditorKey.get(language.editorKey) || dbBySlug.get(language.slug),
      )
    );

    const builtInKeys = new Set(compilerLanguages.map((language) => language.editorKey));
    const builtInSlugs = new Set(compilerLanguages.map((language) => language.slug));
    for (const language of dbLanguages) {
      if (!builtInKeys.has(language.editorKey) && !builtInSlugs.has(language.slug)) {
        merged.push(language);
      }
    }

    return merged.sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
  } catch (error) {
    console.error("Language registry query failed:", error);
    return compilerLanguages.map(staticToRegistry);
  }
}

export async function getLanguageByRegistrySlug(slug: string): Promise<RegistryLanguage | undefined> {
  const languages = await getLanguageRegistry();
  return languages.find((language) => language.slug === slug);
}

export async function getLanguageByEditorKey(editorKey: string): Promise<RegistryLanguage | undefined> {
  const languages = await getLanguageRegistry();
  return languages.find((language) => language.editorKey === editorKey);
}
