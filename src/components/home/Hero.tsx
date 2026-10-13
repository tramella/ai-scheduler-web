import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, FileSpreadsheet, ShieldCheck, Zap, CheckCircle2 } from "lucide-react";
import { InteractivePlayground } from "@/components/home/InteractivePlayground";

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden py-14 sm:py-20 lg:py-24 bg-gradient-to-b from-slate-50/90 via-white to-slate-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Background Decorative Mesh & Radial Glows */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-60" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#2F5BFF]/10 via-[#2F2C59]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Container */}
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-14">
          
          {/* Top Pill Badge */}
          <div className="inline-flex items-center space-x-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 px-4 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 mb-6 shadow-xs hover:border-slate-300 transition">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20 animate-pulse"></span>
            <span className="text-slate-400 dark:text-slate-500">|</span>
            <Sparkles className="h-3.5 w-3.5 text-[#FF7A59]" />
            <span>Deterministic AI Shift Operating System</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#2F2C59] dark:text-white leading-[1.12]">
            Shift scheduling without the{" "}
            <span className="bg-gradient-to-r from-[#2F5BFF] via-indigo-600 to-[#2F2C59] dark:from-[#2F5BFF] dark:to-indigo-300 bg-clip-text text-transparent">
              spreadsheet chaos.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Upload your roster, state your shift directives in plain language, and generate mathematically verified, conflict-free schedules in seconds.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/product"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-[#2F2C59] px-8 py-3.5 text-sm font-bold text-white hover:bg-[#1E1B3A] transition shadow-md shadow-indigo-950/10 group border border-[#2F2C59] active:scale-[0.98] cursor-pointer"
            >
              <span>Try 1 free schedule</span>
              <ArrowRight className="ml-2 h-4 w-4 text-white group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a
              href="#playground"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-800 px-7 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 shadow-2xs transition active:scale-[0.98]"
            >
              <FileSpreadsheet className="mr-2 h-4 w-4 text-[#2F5BFF]" />
              <span>Explore live roster</span>
            </a>
          </div>

          {/* Micro Guarantees Strip */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">Zero double-bookings</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Zap className="h-4 w-4 text-[#FF7A59] shrink-0" />
              <span>&lt; 0.2s Mathematical solver</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="h-4 w-4 text-[#2F5BFF] shrink-0" />
              <span>100% Deterministic compliance</span>
            </div>
          </div>
        </div>

        {/* Interactive Studio Preview Box */}
        <div id="playground" className="mt-8 sm:mt-12 scroll-mt-24">
          <InteractivePlayground />
        </div>

      </div>
    </section>
  );
};
