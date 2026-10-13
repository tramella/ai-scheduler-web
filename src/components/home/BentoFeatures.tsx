import React from "react";
import { MessageSquare, ShieldCheck, Sliders, FileSpreadsheet, Sparkles, Check, ArrowRight } from "lucide-react";
import Link from "next/link";

export const BentoFeatures: React.FC = () => {
  return (
    <section className="py-16 md:py-24 border-t border-slate-200/80 bg-slate-50/50 dark:bg-slate-900/50 dark:border-slate-800 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18 space-y-3">
          <div className="inline-flex items-center space-x-2 rounded-full border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-1 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-[#FF7A59]" />
            <span>Operational Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#2F2C59] dark:text-white">
            Built for the realities of shift work.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Every capability is engineered to eliminate manager friction, respect labor laws, and keep your frontline team happy.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
          
          {/* Bento Item 1: Large Span 2 Columns */}
          <div className="md:col-span-2 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-7 sm:p-9 shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-[#2F5BFF]/50 transition">
            <div className="space-y-4 max-w-lg">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 text-[#2F2C59] dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800">
                <MessageSquare className="h-5 w-5 text-[#2F5BFF]" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Natural Language Directives
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Describe complex scheduling desires in plain English just like speaking to an assistant. ORBIT converts qualitative wishes into quantitative shift allocations.
              </p>
            </div>

            {/* Prompt mockup box */}
            <div className="mt-8 rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-200/80 dark:border-slate-700/80 text-xs font-mono text-slate-800 dark:text-slate-200 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>Sample Manager Directive</span>
                <span className="text-[#2F5BFF] font-semibold">Gemini Structured</span>
              </div>
              <p className="text-slate-900 dark:text-slate-100 font-medium font-sans text-xs sm:text-sm">
                &ldquo;Ensure at least 1 shift supervisor on duty for Friday closing and cap all part-time cashiers at 25h/week.&rdquo;
              </p>
            </div>
          </div>

          {/* Bento Item 2: Skill Pinning */}
          <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-7 sm:p-8 shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-[#FF7A59]/50 transition">
            <div className="space-y-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 dark:bg-orange-950/70 text-[#FF7A59] border border-orange-100 dark:border-orange-800">
                <ShieldCheck className="h-5 w-5 text-[#FF7A59]" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Role & Skill Pinning
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Automatically verify that critical stations (Cashier, Kitchen Lead, Supervisor) are staffed only by certified personnel.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-medium text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700">
                Cashier (POS)
              </span>
              <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-medium text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700">
                Barista
              </span>
              <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-medium text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700">
                Supervisor
              </span>
            </div>
          </div>

          {/* Bento Item 3: Workload & Overtime Balancer */}
          <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-7 sm:p-8 shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-[#2F5BFF]/50 transition">
            <div className="space-y-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/70 text-[#2F5BFF] border border-blue-100 dark:border-blue-800">
                <Sliders className="h-5 w-5 text-[#2F5BFF]" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Anti-Burnout Balancer
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Equally balance shift hours among part-time and full-time employees to prevent fatigue, resentment, and unplanned overtime fees.
              </p>
            </div>

            <div className="mt-6 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/60 p-3.5 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 font-medium flex items-center space-x-2">
              <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Standard deviation: &lt; 2.5h across roster</span>
            </div>
          </div>

          {/* Bento Item 4: Large Span 2 Columns */}
          <div className="md:col-span-2 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-7 sm:p-9 shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-[#FF7A59]/50 transition">
            <div className="space-y-4 max-w-lg">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 border border-emerald-100 dark:border-emerald-800">
                <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Seamless Excel In & Out
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                No new proprietary software for your staff to install. Simply upload your existing roster spreadsheet (.xlsx, .csv) and export a fully formatted Excel schedule ready to print or email.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-3.5 py-1.5 text-xs font-mono font-medium text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                .XLSX In-Memory Parser
              </span>
              <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-3.5 py-1.5 text-xs font-mono font-medium text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                Print-Ready Formatting
              </span>
              <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-950/70 px-3.5 py-1.5 text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                1-Click Export
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
