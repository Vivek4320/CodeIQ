import type { MetadataRoute } from "next";
import { getLanguageRegistry } from "@/lib/languageRegistry";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://code-iq-ai.vercel.app";
  const languages = await getLanguageRegistry();
  const now = new Date();
  return [
    { url: baseUrl, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/online-code-compiler`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    ...languages.map((language) => ({
      url: `${baseUrl}/${language.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
