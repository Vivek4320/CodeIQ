import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/landing/ThemeContext";
import { ThemeStyle } from "@/components/landing/ThemeStyle";
import { AuthProvider } from "@/components/AuthContext";
import { ToastProvider } from "@/components/Toast";
import { ClientCursor } from "@/components/ClientOnly";
import FeedbackTrigger from "@/components/FeedbackTrigger";
import PageTransition from "@/components/PageTransition";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CodeIQ — Online Code Compiler & Editor | 12 Languages",
  description:
    "Write, compile and run code online with CodeIQ. Free browser-based IDE supporting Python, JavaScript, TypeScript, Java, C, C++, Go, Rust, Ruby, Haskell, HTML and CSS. No signup needed.",
  keywords: [
    "online compiler",
    "online code editor",
    "run code online",
    "browser IDE",
    "free online compiler",
    "online code compiler",
    "multi-language compiler",
    "python compiler",
    "c compiler",
    "c++ compiler",
    "java compiler",
    "javascript editor",
    "typescript editor",
    "go compiler",
    "rust compiler",
    "ruby compiler",
    "haskell compiler",
    "html editor",
    "css editor",
  ],
  alternates: {
    canonical: "https://code-iq-ai.vercel.app",
  },
  openGraph: {
    title: "CodeIQ — Online Code Compiler & Editor | 12 Languages",
    description:
      "Write and run code online for Python, JavaScript, Java, C++, Go, Rust, Ruby and more. Free browser-based compiler — no signup needed.",
    url: "https://code-iq-ai.vercel.app",
    siteName: "CodeIQ",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "CodeIQ — Online Code Compiler & Editor",
    description:
      "Run Python, JavaScript, Java, C++, Go, Rust and 6 more languages directly in your browser. Free online compiler.",
  },
  verification: {
    google: "iYCIJ-Qy5f6rKexF-iMawziYVw0-7wHPzef7mP5RxlQ",
  },
};
export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                name: "CodeIQ",
                url: "https://code-iq-ai.vercel.app",
                description:
                  "A free, browser-based online code compiler and editor supporting Python, JavaScript, TypeScript, Java, C, C++, Go, Rust, Ruby, Haskell, HTML and CSS.",
                applicationCategory: "DeveloperApplication",
                operatingSystem: "Web",
                offers: {
                  "@type": "Offer",
                  price: "0",
                  priceCurrency: "USD",
                },
              },
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "CodeIQ",
                url: "https://code-iq-ai.vercel.app",
                description: "CodeIQ provides a free multi-language online code compiler and editor.",
              },
            ]),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ClientCursor />
        <ThemeProvider>
          <ThemeStyle />
          <AuthProvider>
            <ToastProvider>
              <PageTransition>
                {children}
              </PageTransition>
            </ToastProvider>
            <FeedbackTrigger />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
