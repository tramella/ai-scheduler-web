import React from "react";
import {
  ShieldCheck,
  Scale,
  FileSpreadsheet,
  Check,
  Sparkles,
} from "lucide-react";

interface PillarItem {
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  title: string;
  description: string;
  checklist: string[];
}

export const Pillars: React.FC = () => {
  const pillars: PillarItem[] = [
    {
      icon: ShieldCheck,
      tag: "Verification",
      title: "Zero Double-Booking Validator",
      description:
        "Guarantees no employee is ever assigned to overlapping stations or scheduled without mandatory rest.",
      checklist: [
        "1-shift/day cap per employee",
        "Enforces 14h rest intervals",
        "Prevents station collisions",
      ],
    },
    {
      icon: Scale,
      tag: "Fairness",
      title: "Fair Weekend & Shift Balancing",
      description:
        "Mathematically distributes prime hours, weekend slots, and closing shifts evenly across the team.",
      checklist: [
        "Even weekend rotation",
        "Weekly contract hour limits",
        "Reduces staff turnover",
      ],
    },
    {
      icon: FileSpreadsheet,
      tag: "Compatibility",
      title: "Native 1-Click Excel Sync",
      description:
        "Upload your existing store spreadsheet (.xlsx, .csv) and download a color-coded, print-ready weekly matrix.",
      checklist: [
        "Preserves staff roles & skills",
        "Printable weekly matrix",
        "Standard Microsoft Excel (.xlsx)",
      ],
    },
  ];

  return (
    <section className="py-16 md:py-20 border-t border-slate-200/80 bg-white relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-12 sm:mb-14 space-y-2.5">
          <div className="inline-flex items-center space-x-2 rounded-full bg-slate-900/[0.05] px-3.5 py-1 text-xs font-semibold text-slate-800">
            <Sparkles className="h-3.5 w-3.5 text-[#FF7A59]" />
            <span>Core Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#2F2C59]">
            Built for shift operations.
          </h2>
          <p className="text-base text-slate-600">
            Turn raw staff availability into verified, conflict-free rosters in seconds.
          </p>
        </div>

        {/* 3-Column Pillars Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="rounded-3xl border border-slate-200/90 bg-slate-50/50 p-6 sm:p-7 flex flex-col justify-between hover:border-slate-300 hover:bg-white hover:shadow-sm transition-all duration-200 group"
              >
                <div>
                  {/* Top Header: Icon & Tag */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-200/70">
                    <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 group-hover:scale-105 transition-transform">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-medium text-slate-600 bg-white border border-slate-200 px-2.5 py-0.5 rounded-full">
                      {pillar.tag}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-slate-900 mt-4 group-hover:text-[#2F2C59] transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                {/* Checklist Footer */}
                <div className="mt-6 pt-4 border-t border-slate-200/70 space-y-2">
                  {pillar.checklist.map((item, cIdx) => (
                    <div key={cIdx} className="flex items-center text-xs font-medium text-slate-700">
                      <div className="h-3.5 w-3.5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center mr-2 shrink-0">
                        <Check className="h-2 w-2 stroke-[3]" />
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
