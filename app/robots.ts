import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/editor/',
        ],
      },
    ],
    sitemap: 'https://code-iq-ai.vercel.app/sitemap.xml',
  };
}