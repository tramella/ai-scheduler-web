import React from "react";
import { Hero } from "@/components/home/Hero";
import { BentoFeatures } from "@/components/home/BentoFeatures";
import { HowItWorks } from "@/components/home/HowItWorks";
import { IndustryProof } from "@/components/home/IndustryProof";
import { Benefits } from "@/components/home/Benefits";
import { PlaygroundSection } from "@/components/home/PlaygroundSection";

export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col">
      {/* 1. Hero with Interactive Live Playground & Conflict Simulation */}
      <Hero />
      <PlaygroundSection />
      <HowItWorks />

      {/* 2. Operational Capabilities (Bento Grid) */}
      <BentoFeatures />

      {/* 6. Real-World Store Proof & Industry Solutions */}
      <IndustryProof />

      {/* 7. High-Impact Final CTA */}
      <Benefits />
    </main>
  );
}
