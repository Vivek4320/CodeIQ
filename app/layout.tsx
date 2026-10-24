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

const siteUrl = "https://code-iq-ai.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Free Online Code Compiler & AI Code Editor | CodeIQ",
    template: "%s | CodeIQ",
  },
  description:
    "Write, run, and understand code online with CodeIQ, a browser-based code editor and compiler for 12 programming languages with AI-powered coding assistance.",
  applicationName: "CodeIQ",
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
    "AI coding assistant",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Free Online Code Compiler & AI Code Editor | CodeIQ",
    description:
      "Write, run, and understand code in your browser with CodeIQ. Explore 12 programming languages and AI-powered coding assistance.",
    url: siteUrl,
    siteName: "CodeIQ",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Free Online Code Compiler & AI Code Editor | CodeIQ",
    description:
      "Write, run, and understand code online with CodeIQ's browser-based compiler and AI coding assistant.",
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
                url: siteUrl,
                description:
                  "A browser-based online code compiler and editor supporting 12 programming languages, with AI-powered coding assistance.",
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
                url: siteUrl,
                description:
                  "CodeIQ provides a browser-based multi-language online code compiler and editor.",
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
              <PageTransition>{children}</PageTransition>
            </ToastProvider>
            <FeedbackTrigger />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
