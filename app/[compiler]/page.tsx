import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { compilerLanguages, getLanguageBySlug } from "@/lib/compilerLanguages";
import CompilerLanding from "@/components/CompilerLanding";

export async function generateStaticParams() {
  return compilerLanguages.map((lang) => ({
    compiler: lang.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ compiler: string }>;
}): Promise<Metadata> {
  const { compiler } = await params;
  const lang = getLanguageBySlug(compiler);

  if (!lang) return {};

  return {
    title: lang.title,
    description: lang.description,
    keywords: [
      `${lang.name} compiler`,
      `online ${lang.name} editor`,
      `run ${lang.name} online`,
      `${lang.name} compiler online free`,
    ],
    alternates: {
      canonical: `https://code-iq-ai.vercel.app/${lang.slug}`,
    },
    openGraph: {
      title: lang.title,
      description: lang.description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
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

  return <CompilerLanding lang={lang} />;
}