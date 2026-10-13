"use client";

import React, { useState } from "react";
import { Sparkles, Clock, DollarSign, ShieldCheck, ArrowRight, Zap, Check } from "lucide-react";
import Link from "next/link";

export const RoiCalculator: React.FC = () => {
  const [teamSize, setTeamSize] = useState<number>(18);
  const [shiftsPerWeek, setShiftsPerWeek] = useState<number>(32);

  // Calculations based on workforce scheduling benchmarks
  const hoursSavedPerMonth = Math.round(teamSize * 0.95 + shiftsPerWeek * 0.22);
  const overtimeSavedMonthly = Math.round(teamSize * 62 + shiftsPerWeek * 9.5);
  const satisfactionBoost = Math.min(99, 82 + Math.round(teamSize * 0.3));

  return (
    <section className="py-16 md:py-24 border-t border-slate-200/80 bg-white dark:bg-slate-950 dark:border-slate-800 relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -ml-32 w-80 h-80 bg-gradient-to-tr from-blue-100/40 to-transparent dark:from-blue-950/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 -mr-32 w-80 h-80 bg-gradient-to-tl from-indigo-100/40 to-transparent dark:from-indigo-950/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18 space-y-3">
          <div className="inline-flex items-center space-x-2 rounded-full border border-slate-200/90 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3.5 py-1 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-[#FF7A59]" />
            <span>Interactive ROI Estimator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#2F2C59] dark:text-white">
            See how much time you recover.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Every hour spent untangling spreadsheets is an hour stolen from customer service and store operations.
          </p>
        </div>

        {/* Calculator Interactive Card */}
        <div className="max-w-5xl mx-auto rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 p-6 sm:p-10 shadow-lg shadow-slate-900/[0.03]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Sliders (7 cols) */}
            <div className="lg:col-span-7 space-y-7">
              {/* Slider 1: Team Size */}
              <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label htmlFor="team-size-slider" className="text-sm font-bold text-slate-900 dark:text-white flex items-center">
                      Frontline Team Size
                    </label>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Full-time, part-time & seasonal workers
                    </p>
                  </div>
                  <div className="inline-flex items-center font-mono text-base font-black text-[#2F2C59] dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 px-3 py-1 rounded-xl">
                    {teamSize} staff
                  </div>
                </div>

                <input
                  id="team-size-slider"
                  aria-label="Frontline Team Size"
                  type="range"
                  min="4"
                  max="60"
                  step="1"
                  value={teamSize}
                  onChange={(e) => setTeamSize(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#2F5BFF]"
                />

                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>4 staff</span>
                  <span>30 staff</span>
                  <span>60+ staff</span>
                </div>
              </div>

              {/* Slider 2: Weekly Shifts */}
              <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label htmlFor="shifts-slider" className="text-sm font-bold text-slate-900 dark:text-white flex items-center">
                      Weekly Shifts to Staff
                    </label>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Opening, afternoon, closing & weekend slots
                    </p>
                  </div>
                  <div className="inline-flex items-center font-mono text-base font-black text-[#2F5BFF] bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 px-3 py-1 rounded-xl">
                    {shiftsPerWeek} shifts
                  </div>
                </div>

                <input
                  id="shifts-slider"
                  aria-label="Weekly Shifts to Staff"
                  type="range"
                  min="10"
                  max="70"
                  step="2"
                  value={shiftsPerWeek}
                  onChange={(e) => setShiftsPerWeek(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#2F5BFF]"
                />

                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>10 shifts/wk</span>
                  <span>40 shifts/wk</span>
                  <span>70+ shifts/wk</span>
                </div>
              </div>

              {/* Instant Compliance Micro-tags */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <span className="inline-flex items-center text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/70 dark:border-emerald-800/70 px-3 py-1 rounded-full">
                  <Check className="h-3.5 w-3.5 mr-1.5 stroke-[3]" />
                  Zero double-bookings
                </span>
                <span className="inline-flex items-center text-xs font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 border border-blue-200/70 dark:border-blue-800/70 px-3 py-1 rounded-full">
                  <Check className="h-3.5 w-3.5 mr-1.5 stroke-[3]" />
                  14h rest interval enforced
                </span>
                <span className="inline-flex items-center text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 px-3 py-1 rounded-full">
                  <Zap className="h-3.5 w-3.5 mr-1.5 text-[#FF7A59]" />
                  &lt; 0.2s solver speed
                </span>
              </div>
            </div>

            {/* Right Column: Dynamic Projected Impact (5 cols) */}
            <div className="lg:col-span-5 rounded-3xl bg-[#2F2C59] text-white p-7 sm:p-8 shadow-xl relative overflow-hidden flex flex-col justify-between">
              {/* Radial gradient glow */}
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-60 h-60 bg-gradient-to-br from-[#2F5BFF]/40 to-transparent rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-60 h-60 bg-gradient-to-tr from-[#FF7A59]/30 to-transparent rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 space-y-6">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-indigo-200 font-bold">
                    Projected Monthly Impact
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">
                    Your Autonomous Savings
                  </h3>
                </div>

                {/* Primary Stat: Hours */}
                <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/15">
                  <div className="flex items-center justify-between text-xs text-indigo-200">
                    <span className="flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-1.5 text-indigo-300" />
                      Manager Planning Time
                    </span>
                    <span className="font-mono text-emerald-400 font-bold">−88% time</span>
                  </div>
                  <div className="mt-2 text-3xl sm:text-4xl font-black text-white tracking-tight tabular-nums font-mono">
                    {hoursSavedPerMonth} hrs
                    <span className="text-sm font-normal text-indigo-200 ml-1.5 font-sans">saved / month</span>
                  </div>
                </div>

                {/* Secondary Stat: Overtime Leakage */}
                <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/15">
                  <div className="flex items-center justify-between text-xs text-indigo-200">
                    <span className="flex items-center">
                      <DollarSign className="h-3.5 w-3.5 mr-1.5 text-emerald-300" />
                      Overtime Leakage Prevented
                    </span>
                    <span className="font-mono text-emerald-400 font-bold">Zero accidental OT</span>
                  </div>
                  <div className="mt-2 text-2xl sm:text-3xl font-black text-white tracking-tight tabular-nums font-mono">
                    ${overtimeSavedMonthly.toLocaleString()}
                    <span className="text-sm font-normal text-indigo-200 ml-1.5 font-sans">saved / month</span>
                  </div>
                </div>

                {/* Team Fairness Rating */}
                <div className="flex items-center justify-between px-2 text-xs text-indigo-200">
                  <span className="flex items-center">
                    <ShieldCheck className="h-4 w-4 mr-1.5 text-[#FF7A59]" />
                    Fairness Satisfaction Score:
                  </span>
                  <span className="font-mono font-bold text-white text-sm">
                    {satisfactionBoost}%
                  </span>
                </div>
              </div>

              {/* Call to action */}
              <div className="relative z-10 mt-8 pt-5 border-t border-white/15">
                <Link
                  href="/product"
                  className="w-full inline-flex items-center justify-center rounded-full bg-white text-[#2F2C59] py-3 px-5 text-sm font-bold hover:bg-slate-100 transition shadow-md group active:scale-[0.98]"
                >
                  <span>Generate schedule for your {teamSize} staff</span>
                  <ArrowRight className="ml-2 h-4 w-4 text-[#2F2C59] group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
