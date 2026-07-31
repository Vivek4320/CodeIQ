"use client";

import Hero from "@/components/landing/Hero";
import MarqueeTicker from "@/components/landing/MarqueeTicker";
import StickyStory from "@/components/landing/StickyStory";
import AIAgentShowcase from "@/components/landing/AIAgentShowcase";
import HorizontalCards from "@/components/landing/HorizontalCards";
import FAQ from "@/components/landing/FAQ";
import AnimateIn from "@/components/landing/AnimateIn";

export default function LandingSections() {
  return (
    <main style={{ flex: 1 }}>
      <AnimateIn slideUp={0} duration={0.8}>
        <Hero />
      </AnimateIn>
      <MarqueeTicker />
      <AnimateIn delay={0.1}>
        <StickyStory />
      </AnimateIn>
      <AnimateIn>
        <AIAgentShowcase />
      </AnimateIn>
      <AnimateIn>
        <HorizontalCards />
      </AnimateIn>
      <AnimateIn>
        <FAQ />
      </AnimateIn>
    </main>
  );
}
