import React from "react";
import { MessageSquare, ShieldCheck, Sliders, FileSpreadsheet, Sparkles, Zap, Check } from "lucide-react";

export const BentoFeatures: React.FC = () => {
  return (
    <section className="py-20 md:py-28 border-t border-zinc-200/80 bg-zinc-50/40 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-2 rounded-full border border-zinc-200/90 bg-white px-3.5 py-1 text-xs font-semibold text-zinc-800 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-[#FF5A36]" />
            <span>Operational Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#0B0F1A]">
            Built for the realities of shift work.
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
            Every feature is engineered to eliminate manager friction, respect labor laws, and keep your frontline team happy.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Bento Item 1: Large Span 2 Columns */}
          <div className="md:col-span-2 rounded-3xl border border-zinc-200 bg-white p-8 sm:p-10 shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-zinc-300 transition">
            <div className="space-y-4 max-w-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-white shadow-xs border border-zinc-800">
                <MessageSquare className="h-6 w-6 text-[#FF5A36]" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900">
                Natural Language Directives
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Describe complex scheduling desires in plain English just like speaking to an assistant. ORBIT converts qualitative wishes into quantitative shift allocations.
              </p>
            </div>

            {/* Prompt mockup box */}
            <div className="mt-8 rounded-2xl bg-zinc-50 p-4 border border-zinc-200/80 text-xs font-mono text-zinc-800 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                <span>Sample Directive</span>
                <span className="text-[#FF5A36] font-semibold">Gemini Parsed</span>
              </div>
              <p className="text-zinc-900 font-medium font-sans text-xs sm:text-sm">
                &ldquo;Ensure at least 1 shift supervisor on duty for Friday closing and cap all part-time cashiers at 25h/week.&rdquo;
              </p>
            </div>
          </div>

          {/* Bento Item 2: Skill Pinning */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-zinc-300 transition">
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-white shadow-xs border border-zinc-800">
                <ShieldCheck className="h-6 w-6 text-[#FF5A36]" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900">
                Role & Skill Pinning
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Automatically verify that critical stations (Cashier, Kitchen Lead, Supervisor) are staffed only by certified personnel.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-lg bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-800 border border-zinc-200/60">
                Cashier (POS)
              </span>
              <span className="rounded-lg bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-800 border border-zinc-200/60">
                Barista
              </span>
              <span className="rounded-lg bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-800 border border-zinc-200/60">
                Supervisor
              </span>
            </div>
          </div>

          {/* Bento Item 3: Workload & Overtime Balancer */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-zinc-300 transition">
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-white shadow-xs border border-zinc-800">
                <Sliders className="h-6 w-6 text-[#FF5A36]" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900">
                Anti-Burnout Balancer
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Equally balance shift hours among part-time and full-time employees to prevent fatigue, resentment, and unplanned overtime fees.
              </p>
            </div>

            <div className="mt-6 rounded-2xl bg-emerald-50/80 p-3.5 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center space-x-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Standard deviation of hours: &lt; 2.5h</span>
            </div>
          </div>

          {/* Bento Item 4: Large Span 2 Columns */}
          <div className="md:col-span-2 rounded-3xl border border-zinc-200 bg-white p-8 sm:p-10 shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-zinc-300 transition">
            <div className="space-y-4 max-w-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-white shadow-xs border border-zinc-800">
                <FileSpreadsheet className="h-6 w-6 text-[#FF5A36]" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900">
                Seamless Excel In & Out
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                No new proprietary software for your staff to install. Simply upload your existing roster spreadsheet (.xlsx, .xls) and export a fully formatted Excel schedule ready to print or email.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-xl bg-zinc-100 px-3 py-1.5 text-xs font-mono font-medium text-zinc-800 border border-zinc-200">
                .XLSX In-Memory Parser
              </span>
              <span className="inline-flex items-center rounded-xl bg-zinc-100 px-3 py-1.5 text-xs font-mono font-medium text-zinc-800 border border-zinc-200">
                Ready-to-Print Formatting
              </span>
              <span className="inline-flex items-center rounded-xl bg-emerald-100 px-3 py-1.5 text-xs font-mono font-bold text-emerald-800 border border-emerald-200">
                1-Click Export
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
