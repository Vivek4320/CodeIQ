import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online Compiler Features — AI Assistance & Code Sharing",
  description:
    "Explore CodeIQ features including multi-language code execution, AI code completion, shareable programs, run history, and customizable editor themes.",
  alternates: { canonical: "/features" },
  robots: { index: true, follow: true },
};

export default function FeaturesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
