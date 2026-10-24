import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CodeIQ Documentation — Getting Started & Supported Languages",
  description:
    "Learn how to use CodeIQ, choose a programming language, run code, use AI code completion, and customize your editor.",
  alternates: { canonical: "/docs" },
  robots: { index: true, follow: true },
};

export default function DocsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
