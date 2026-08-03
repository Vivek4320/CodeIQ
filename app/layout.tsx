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
import PWARegister from "@/components/PWARegister";
import PWAInstall from "@/components/PWAInstall";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CodeIQ — Code Smarter. Run Faster.",
  description: "A modern, browser-based code editor with AI assistance, live execution, and 12+ language support. Write, run, and share code from your browser.",
  keywords: ["code editor", "online compiler", "AI coding", "programming", "developer tools"],
  authors: [{ name: "Vivek Pankhaniya" }],
  creator: "Vivek Pankhaniya",

  // PWA manifest
  manifest: "/manifest.json",

  // Apple PWA
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CodeIQ",
  },

  // Icons — logo.png as favicon so browser tab shows CodeIQ logo
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" }
    ],
    apple: [
      { url: "/logo.png", sizes: "200x200", type: "image/png" },
    ],
  },

  // Open Graph
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "CodeIQ",
    title: "CodeIQ — Code Smarter. Run Faster.",
    description: "A modern, browser-based code editor with AI assistance, live execution, and 12+ language support.",
  },

  // Twitter
  twitter: {
    card: "summary_large_image",
    title: "CodeIQ — Code Smarter. Run Faster.",
    description: "A modern, browser-based code editor with AI assistance, live execution, and 12+ language support.",
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
        {/* PWA meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="CodeIQ" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" sizes="200x200" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="CodeIQ" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#000000" />

        {/* PWA splash screen — shows while app loads, auto-hides */}
        <style dangerouslySetInnerHTML={{ __html: `
          #pwa-splash {
            position: fixed; inset: 0; z-index: 99999;
            background: #000; display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            transition: opacity 0.4s ease;
          }
          #pwa-splash img { width: 80px; height: 80px; border-radius: 18px; }
          #pwa-splash p { color: #fff; font-family: sans-serif; font-size: 16px; font-weight: 600; margin-top: 16px; }
          #pwa-splash .dots::after { content: '...'; animation: dots 1.5s steps(4, end) infinite; }
          @keyframes dots {
            0% { content: ''; } 25% { content: '.'; } 50% { content: '..'; } 75% { content: '...'; }
          }
        `}} />

        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col">
        {/* PWA splash screen — visible until React mounts */}
        <div id="pwa-splash">
          <img src="/logo.png" alt="CodeIQ" />
          <p>CodeIQ<span className="dots"></span></p>
        </div>
        <script dangerouslySetInnerHTML={{ __html: `
          window.addEventListener('load', function() {
            var splash = document.getElementById('pwa-splash');
            if (splash) {
              splash.style.opacity = '0';
              setTimeout(function() { splash.remove(); }, 500);
            }
          });
        `}} />
        <PWARegister />
        <ClientCursor />
        <ThemeProvider>
          <ThemeStyle />
          <AuthProvider>
            <ToastProvider>
              <PageTransition>
                {children}
              </PageTransition>
            </ToastProvider>
            <PWAInstall />
            <FeedbackTrigger />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
