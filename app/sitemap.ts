import { MetadataRoute } from 'next';
import { compilerLanguages } from '@/lib/compilerLanguages';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://code-iq-ai.vercel.app';

  const compilerPages = compilerLanguages.map((lang) => ({
    url: `${baseUrl}/${lang.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...compilerPages,
  ];
}