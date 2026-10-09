import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, FileSpreadsheet, ShieldCheck, Zap, CheckCircle2 } from "lucide-react";
import { InteractivePlayground } from "@/components/home/InteractivePlayground";

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden py-12 sm:py-18 bg-gradient-to-b from-slate-50/80 via-white to-slate-50/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Container */}
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-10">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center space-x-2 rounded-full bg-slate-900/[0.05] px-3.5 py-1 text-xs font-semibold text-slate-800 mb-4">
            <Sparkles className="h-3.5 w-3.5 text-[#FF7A59]" />
            <span>AI Shift Operating System</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#2F2C59] leading-tight">
            Shift scheduling without the <span className="text-[#2F5BFF]">spreadsheet chaos</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-3.5 text-base sm:text-lg text-slate-600 max-w-lg mx-auto leading-relaxed">
            Upload your roster, state your shift rules, and generate mathematically verified schedules in seconds.
          </p>

          {/* Action Buttons */}
          <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/product"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-[#2F2C59] px-7 py-3 text-sm font-semibold text-white hover:bg-[#1E1B3A] transition shadow-xs group border border-[#2F2C59] active:scale-[0.99] cursor-pointer"
            >
              <span>Launch Free Copilot</span>
              <ArrowRight className="ml-2 h-4 w-4 text-white group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a
              href="#playground"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs transition active:scale-[0.99]"
            >
              <FileSpreadsheet className="mr-2 h-4 w-4 text-[#2F5BFF]" />
              <span>Try Live Playground</span>
            </a>
          </div>

          {/* Micro Guarantees */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-5 text-xs text-slate-500 font-medium">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#2F5BFF] shrink-0" />
              <span>Zero Double-Bookings</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Zap className="h-3.5 w-3.5 text-[#FF7A59] shrink-0" />
              <span>&lt; 2.5s Optimization</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-[#2F5BFF] shrink-0" />
              <span>Deterministic Validation</span>
            </div>
          </div>
        </div>

        {/* Interactive Studio Preview Box */}
        <div id="playground" className="mt-8 sm:mt-10 scroll-mt-24">
          <InteractivePlayground />
        </div>
      </div>
    </section>
  );
};
