import React from "react";
import { ShieldCheck, UserCheck, FileSpreadsheet, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export const Pillars: React.FC = () => {
  const pillars = [
    {
      icon: ShieldCheck,
      tag: "Rule Engine",
      title: "Zero Double-Bookings",
      description:
        "Our deterministic validator guarantees every employee is assigned to at most one shift per day, with strict rest intervals between shifts.",
    },
    {
      icon: UserCheck,
      tag: "Skill Matching",
      title: "Fair Skill & Shift Allocation",
      description:
        "Matches certified staff to critical stations (Cashier, Supervisor, Kitchen) while balancing hours across full-time and part-time teams.",
    },
    {
      icon: FileSpreadsheet,
      tag: "Native Workflow",
      title: "1-Click Excel In & Out",
      description:
        "No new software for staff to install. Upload your existing roster (.xlsx, .xls) and download a formatted, print-ready schedule in seconds.",
    },
  ];

  return (
    <section className="py-20 md:py-24 border-t border-zinc-200/80 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-14 space-y-2.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 font-mono">
            Engineered for Real Shift Operations
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950">
            Why managers choose ORBIT.
          </h2>
          <p className="text-sm sm:text-base text-zinc-600">
            Replacing hours of stressful spreadsheet juggling with reliable, conflict-free shift plans.
          </p>
        </div>

        {/* 3 Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="group rounded-3xl border border-zinc-200/90 bg-zinc-50/40 p-7 sm:p-8 hover:bg-white hover:border-zinc-300 hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-950 text-white shadow-2xs">
                      <Icon className="h-5 w-5 text-[#FF5A36]" />
                    </div>
                    <span className="text-[11px] font-mono font-medium text-zinc-400 bg-white px-2.5 py-1 rounded-full border border-zinc-200/60">
                      {p.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-zinc-950">
                    {p.title}
                  </h3>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    {p.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
