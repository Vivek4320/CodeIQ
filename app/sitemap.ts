import type { MetadataRoute } from "next";
import { getLanguageRegistry } from "@/lib/languageRegistry";

export const revalidate = 3600;

const BASE_URL = "https://code-iq-ai.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const languages = await getLanguageRegistry();

  // Only list public, canonical pages. Avoid setting lastModified to the
  // current build time because that would make unchanged pages look updated.
  return [
    {
      url: BASE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/online-code-compiler`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/features`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/docs`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...languages.map((language) => ({
      url: `${BASE_URL}/${language.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
