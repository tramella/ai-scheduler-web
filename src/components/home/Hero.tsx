import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, FileSpreadsheet, ShieldCheck, Zap, Bot, CheckCircle2 } from "lucide-react";
import { InteractivePlayground } from "@/components/home/InteractivePlayground";

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-10 pb-20 md:pt-18 md:pb-28">
      {/* Dynamic Ambient Space Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-[750px] h-[420px] bg-gradient-to-b from-[#FF5A36]/12 via-[#FF5A36]/4 to-transparent blur-3xl rounded-full pointer-events-none opacity-80"></div>
      
      {/* Background Dot Matrix Pattern */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-50"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Floating Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center space-x-2 rounded-full border border-zinc-200/90 bg-white/90 backdrop-blur-md px-4 py-1.5 text-xs font-semibold text-zinc-800 shadow-2xs">
            <span className="flex h-2 w-2 rounded-full bg-[#FF5A36] animate-pulse"></span>
            <span className="font-bold text-zinc-950">ORBIT 2.0</span>
            <span className="text-zinc-300">•</span>
            <span className="text-zinc-600">The Autonomous Shift Operating System</span>
          </div>
        </div>

        {/* Hero Headlines & Value Proposition */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#0B0F1A] text-balance leading-[1.08]">
            Transform messy rosters into{" "}
            <span className="bg-gradient-to-r from-zinc-950 via-zinc-800 to-[#FF5A36] bg-clip-text text-transparent">
              conflict-free schedules.
            </span>
          </h1>
          <p className="mt-6 text-base sm:text-lg md:text-xl text-zinc-600 text-balance leading-relaxed max-w-2xl mx-auto font-normal">
            Upload your employee Excel sheet, state your operational rules in plain English, and let AI reason with strict mathematical constraint validation.
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/product"
              className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 text-sm font-bold text-white bg-[#0B0F1A] hover:bg-zinc-800 rounded-2xl shadow-md transition-all active:scale-[0.99] group border border-zinc-800"
            >
              <Sparkles className="mr-2 h-4 w-4 text-[#FF5A36]" />
              <span>Launch AI Scheduler Free</span>
              <ArrowRight className="ml-2 h-4 w-4 text-[#FF5A36] group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#playground"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold text-zinc-700 bg-white hover:bg-zinc-50 rounded-2xl border border-zinc-200 shadow-2xs transition-colors"
            >
              <FileSpreadsheet className="mr-2 h-4 w-4 text-zinc-400" />
              <span>Test Interactive Playground</span>
            </a>
          </div>

          {/* Micro Proof Metric Badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-500 font-medium">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>100% Conflict-Free Guarantee</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Zap className="h-4 w-4 text-[#FF5A36] shrink-0" />
              <span>&lt; 2.5s Generation Speed</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="h-4 w-4 text-zinc-800 shrink-0" />
              <span>Deterministic Rule Verification</span>
            </div>
          </div>
        </div>

        {/* Interactive Live Playground Showcase */}
        <div id="playground" className="mt-10 scroll-mt-24">
          <InteractivePlayground />
        </div>
      </div>
    </section>
  );
};
