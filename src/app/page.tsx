import React from "react";
import { Hero } from "@/components/home/Hero";
import { Pillars } from "@/components/home/Pillars";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Benefits } from "@/components/home/Benefits";

export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col">
      {/* 1. Hero with Interactive Live Playground */}
      <Hero />

      {/* 2. Core Value Pillars (Clean & Human-Crafted) */}
      <Pillars />

      {/* 3. 3-Step Minimal Workflow */}
      <HowItWorks />

      {/* 4. Streamlined Final CTA */}
      <Benefits />
    </main>
  );
}
