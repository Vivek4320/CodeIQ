import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/landing/ThemeContext";
import { ThemeStyle } from "@/components/landing/ThemeStyle";
import { AuthProvider } from "@/components/AuthContext";
import { ToastProvider } from "@/components/Toast";
import ConditionalCursor from "@/components/ConditionalCursor";
import LoadingScreen from "@/components/LoadingScreen";
import FeedbackTrigger from "@/components/FeedbackTrigger";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CodeIQ",
  description: "Write code. Run it instantly.",
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
      <body className="min-h-full flex flex-col">
        <LoadingScreen />
        <ConditionalCursor />
        <ThemeProvider>
          <ThemeStyle />
          <AuthProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
            <FeedbackTrigger />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
