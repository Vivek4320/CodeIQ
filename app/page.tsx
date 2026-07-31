import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LandingSections from "@/components/landing/LandingSections";

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-display",
});
const bodyFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export default function LandingPage() {
  return (
    <div
      className={`${display.variable} ${bodyFont.variable} ${mono.variable}`}
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Navbar />
      <LandingSections />
      <Footer />
    </div>
  );
}
