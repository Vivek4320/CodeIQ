import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shared Code",
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
};

export default function ShareLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
