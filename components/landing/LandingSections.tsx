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
      <AnimateIn type="fadeIn" duration={0.8}>
        <Hero />
      </AnimateIn>
      <MarqueeTicker />
      <AnimateIn type="slideLeft" delay={0.05}>
        <StickyStory />
      </AnimateIn>
      <AnimateIn type="scaleUp">
        <AIAgentShowcase />
      </AnimateIn>
      <AnimateIn type="blur">
        <HorizontalCards />
      </AnimateIn>
      <AnimateIn type="fadeUp" delay={0.1}>
        <FAQ />
      </AnimateIn>
    </main>
  );
}
