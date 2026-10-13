import React from "react";
import { Hero } from "@/components/home/Hero";
import { BentoFeatures } from "@/components/home/BentoFeatures";
import { ArchitectureShowcase } from "@/components/home/ArchitectureShowcase";
import { RoiCalculator } from "@/components/home/RoiCalculator";
import { HowItWorks } from "@/components/home/HowItWorks";
import { IndustryProof } from "@/components/home/IndustryProof";
import { Benefits } from "@/components/home/Benefits";

export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col">
      {/* 1. Hero with Interactive Live Playground & Conflict Simulation */}
      <Hero />

      {/* 2. Operational Capabilities (Bento Grid) */}
      <BentoFeatures />

      {/* 3. Deep Architectural Authority (AI proposes. Code decides.) */}
      <ArchitectureShowcase />

      {/* 4. Interactive ROI & Time Saved Estimator */}
      <RoiCalculator />

      {/* 5. Operational Roadmap (How ORBIT Works in 4 Steps) */}
      <HowItWorks />

      {/* 6. Real-World Store Proof & Industry Solutions */}
      <IndustryProof />

      {/* 7. High-Impact Final CTA */}
      <Benefits />
    </main>
  );
}
