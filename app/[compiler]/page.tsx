import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { compilerLanguages, getLanguageBySlug } from "@/lib/compilerLanguages";

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

  return (
    <main className="min-h-screen px-6 py-16 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">
        Online {lang.name} Compiler
      </h1>
      <p className="text-lg text-gray-500 mb-10">
        Write, compile and run {lang.name} code online — free, fast, and no
        signup required. Powered by CodeIQ&apos;s AI-assisted editor.
      </p>

      {/* 
        ⚠️ Yaha tમારો actual editor component embed karo.
        Homepage ma jे component use thai rahyu chhe (jem CodeEditor, PlaygroundEditor, etc)
        e import karके niche mukjo, defaultLanguage ane defaultCode props pass karके:

        <CodeEditor 
          defaultLanguage={lang.name.toLowerCase()} 
          defaultCode={lang.sampleCode} 
        />
      */}

      <section className="mt-16">
        <h2 className="text-2xl font-semibold mb-4">
          Why use CodeIQ for {lang.name}?
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-400">
          <li>Instant {lang.name} code execution directly in your browser</li>
          <li>AI-powered code suggestions and debugging assistance</li>
          <li>No installation, setup, or sign-up required</li>
          <li>Share your {lang.name} code with a single link</li>
        </ul>
      </section>
    </main>
  );
}