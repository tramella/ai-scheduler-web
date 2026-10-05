import React from "react";
import { XCircle, CheckCircle2, AlertTriangle, Clock, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

export const BeforeAfterComparison: React.FC = () => {
  return (
    <section className="py-20 md:py-28 border-t border-zinc-200/80 bg-white relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-2 rounded-full border border-zinc-200/90 bg-zinc-50 px-3.5 py-1 text-xs font-semibold text-zinc-800 shadow-2xs">
            <span className="font-mono text-[#FF5A36]">VS</span>
            <span>Why Shift Managers Switch</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#0B0F1A]">
            Manual spreadsheets vs. ORBIT Copilot
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
            See the difference between wrestling complex formula grids and generating mathematically audited shift plans with AI.
          </p>
        </div>

        {/* Side by Side Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto items-stretch">
          {/* Left Column: Manual Spreadsheets (The Chaos) */}
          <div className="rounded-3xl border border-rose-200/80 bg-rose-50/30 p-8 sm:p-10 flex flex-col justify-between shadow-xs relative overflow-hidden">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-800">
                  <XCircle className="h-3.5 w-3.5 mr-1 text-rose-600" />
                  Manual Spreadsheets
                </span>
                <span className="text-xs font-mono text-rose-700 font-semibold">4–6 Hours / Week</span>
              </div>

              <h3 className="text-2xl font-bold text-zinc-900">
                Fragile, stressful, and prone to costly double-bookings.
              </h3>

              <ul className="space-y-3.5 text-sm text-zinc-700">
                <li className="flex items-start">
                  <XCircle className="h-4 w-4 text-rose-500 mr-2.5 shrink-0 mt-0.5" />
                  <span><strong>Accidental Double-Bookings:</strong> Staff scheduled simultaneously across 2 stations or shifts.</span>
                </li>
                <li className="flex items-start">
                  <XCircle className="h-4 w-4 text-rose-500 mr-2.5 shrink-0 mt-0.5" />
                  <span><strong>Hidden Overtime Costs:</strong> Exceeding max weekly hours without warning, causing labor violations.</span>
                </li>
                <li className="flex items-start">
                  <XCircle className="h-4 w-4 text-rose-500 mr-2.5 shrink-0 mt-0.5" />
                  <span><strong>Missed Availability:</strong> Accidentally scheduling staff on their registered time-off days.</span>
                </li>
                <li className="flex items-start">
                  <XCircle className="h-4 w-4 text-rose-500 mr-2.5 shrink-0 mt-0.5" />
                  <span><strong>Zero Adaptation:</strong> If someone calls in sick, you restart the entire matrix from scratch.</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 rounded-2xl bg-white/80 p-4 border border-rose-200/60 text-xs text-rose-800 font-medium">
              ⚠️ Result: High manager burnout, employee turnover, and unverified schedule errors.
            </div>
          </div>

          {/* Right Column: ORBIT AI Copilot (The Harmony) */}
          <div className="rounded-3xl border border-emerald-200/90 bg-white p-8 sm:p-10 flex flex-col justify-between shadow-xs relative overflow-hidden ring-4 ring-emerald-500/5">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                  ORBIT AI Copilot
                </span>
                <span className="text-xs font-mono text-emerald-700 font-bold">&lt; 3 Seconds / Schedule</span>
              </div>

              <h3 className="text-2xl font-bold text-zinc-900">
                Intelligent, conflict-free, and mathematically validated.
              </h3>

              <ul className="space-y-3.5 text-sm text-zinc-700">
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 mr-2.5 shrink-0 mt-0.5" />
                  <span><strong>Zero Double-Bookings:</strong> Hard deterministic code guarantees strict 1-shift-per-day enforcement.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 mr-2.5 shrink-0 mt-0.5" />
                  <span><strong>Strict Overtime Compliance:</strong> Automatically limits weekly hours and enforces rest intervals.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 mr-2.5 shrink-0 mt-0.5" />
                  <span><strong>Skill & Station Matching:</strong> Assigns only qualified employees (Cashier, Supervisor, Barista).</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 mr-2.5 shrink-0 mt-0.5" />
                  <span><strong>Instant Excel Export:</strong> Download formatted .xlsx sheets ready to print or email in 1 click.</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 rounded-2xl bg-emerald-50/80 p-4 border border-emerald-200/60 flex items-center justify-between">
              <span className="text-xs text-emerald-900 font-medium">Ready to test with your own file?</span>
              <Link
                href="/product"
                className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-4 py-2 text-xs font-bold text-white hover:bg-zinc-800 transition shadow-xs group"
              >
                <span>Try Instant Demo</span>
                <ArrowRight className="ml-1.5 h-3.5 w-3.5 text-[#FF5A36] group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
