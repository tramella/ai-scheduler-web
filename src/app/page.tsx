import React from "react";
import { Hero } from "@/components/home/Hero";
import { Pillars } from "@/components/home/Pillars";
import { HowItWorks } from "@/components/home/HowItWorks";
import { IndustryProof } from "@/components/home/IndustryProof";
import { Benefits } from "@/components/home/Benefits";

export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col">
      {/* 1. Hero with Interactive Live Playground */}
      <Hero />

      {/* 2. Core Value Pillars */}
      <Pillars />

      {/* 3. Operational Roadmap (How ORBIT Works) */}
      <HowItWorks />

      {/* 4. Real-World Store Proof & Industry Solutions */}
      <IndustryProof />

      {/* 5. Streamlined Final CTA */}
      <Benefits />
    </main>
  );
}
