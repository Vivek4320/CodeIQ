import { MetadataRoute } from 'next';
import { allLanguageSlugs } from '@/lib/compilerLanguages';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://code-iq-ai.vercel.app';

  const languagePages = allLanguageSlugs.map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/online-code-compiler`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    ...languagePages,
  ];
}