import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { compilerLanguages, getLanguageBySlug, allLanguageSlugs } from "@/lib/compilerLanguages";
import CompilerLanding from "@/components/CompilerLanding";

const BASE_URL = "https://code-iq-ai.vercel.app";

export async function generateStaticParams() {
  return allLanguageSlugs.map((slug) => ({ compiler: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ compiler: string }>;
}): Promise<Metadata> {
  const { compiler } = await params;
  const lang = getLanguageBySlug(compiler);
  if (!lang) return {};

  const canonicalUrl = `${BASE_URL}/${lang.slug}`;

  return {
    title: lang.title,
    description: lang.description,
    keywords: [
      `online ${lang.name.toLowerCase()} compiler`,
      `${lang.name.toLowerCase()} compiler`,
      `run ${lang.name.toLowerCase()} online`,
      `${lang.name.toLowerCase()} editor online`,
      `${lang.name.toLowerCase()} code online`,
      `free ${lang.name.toLowerCase()} compiler`,
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: lang.title,
      description: lang.description,
      url: canonicalUrl,
      siteName: "CodeIQ",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: lang.title,
      description: lang.description,
    },
  };
}

export default async function CompilerPage({
  params,
}: {
  params: Promise<{ compiler: string }>;
}) {
  const { compiler } = await params;
  const lang = getLanguageBySlug(compiler);
  if (!lang) notFound();

  /** BreadcrumbList + SoftwareApplication structured data */
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: BASE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Online Code Compiler",
          item: `${BASE_URL}/online-code-compiler`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: lang.h1,
          item: `${BASE_URL}/${lang.slug}`,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: `CodeIQ — ${lang.h1}`,
      url: `${BASE_URL}/${lang.slug}`,
      description: lang.description,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <CompilerLanding lang={lang} />
    </>
  );
}

// Re-export for Next.js static generation
export { compilerLanguages };