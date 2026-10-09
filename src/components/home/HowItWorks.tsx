import React from "react";
import {
  UploadCloud,
  Sliders,
  Cpu,
  Download,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

interface Step {
  step: string;
  stage: string;
  title: string;
  detail: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const HowItWorks: React.FC = () => {
  const steps: Step[] = [
    {
      step: "01",
      stage: "Ingestion",
      title: "Upload Roster",
      detail: "Drop your employee .xlsx or .csv sheet with roles, availability, and weekly hours.",
      icon: UploadCloud,
    },
    {
      step: "02",
      stage: "Directives",
      title: "Define Rules",
      detail: "Write requirements in plain English — rest hours, station minimums, and overtime caps.",
      icon: Sliders,
    },
    {
      step: "03",
      stage: "Verification",
      title: "Audit Constraints",
      detail: "Mathematical engine tests permutations to guarantee 0 conflicts and 100% compliance.",
      icon: Cpu,
    },
    {
      step: "04",
      stage: "Dispatch",
      title: "Export Schedule",
      detail: "Download formatted .xlsx matrix ready for store printouts and staff dispatch.",
      icon: Download,
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 border-t border-slate-200/80 bg-slate-50/50 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-18 space-y-2.5">
          <div className="inline-flex items-center space-x-2 rounded-full bg-slate-900/[0.05] px-3.5 py-1 text-xs font-semibold text-slate-800">
            <Sparkles className="h-3.5 w-3.5 text-[#FF7A59]" />
            <span>Operational Roadmap</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#2F2C59]">
            From spreadsheet to roster in 4 steps.
          </h2>
          <p className="text-base text-slate-600">
            A deterministic pipeline designed for autonomous store scheduling.
          </p>
        </div>

        {/* Roadmap Architecture */}
        <div className="relative max-w-6xl mx-auto">
          
          {/* Desktop Horizontal Connecting Track */}
          <div className="hidden lg:block absolute top-[28px] left-[6%] right-[6%] h-0.5 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 z-0"></div>

          {/* 4 Connected Milestone Nodes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative z-10">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              const isLast = idx === steps.length - 1;

              return (
                <div key={idx} className="relative flex flex-col group">
                  
                  {/* Top Node Indicator */}
                  <div className="flex items-center justify-start lg:justify-center mb-5">
                    <div className="flex items-center space-x-3 lg:space-x-0">
                      {/* Numbered Milestone Circle */}
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white border-2 border-slate-200 group-hover:border-[#2F2C59] group-hover:bg-[#2F2C59] group-hover:text-white text-slate-900 shadow-xs transition-all duration-200">
                        <span className="font-mono text-sm font-black">
                          {s.step}
                        </span>
                      </div>

                      {/* Mobile / Tablet Connector Line info */}
                      <div className="lg:hidden flex flex-col">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Phase {idx + 1}
                        </span>
                        <span className="text-sm font-bold text-slate-900">
                          {s.stage}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Milestone Card */}
                  <div className="flex-1 flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all">
                    <div className="space-y-3">
                      {/* Icon + Stage Tag */}
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="h-9 w-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Icon className="h-4.5 w-4.5" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50 border border-slate-200/70 px-2 py-0.5 rounded-full">
                          {s.stage}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-[#2F2C59] transition-colors">
                        {s.title}
                      </h3>

                      {/* Detail */}
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {s.detail}
                      </p>
                    </div>

                    {/* Progress Indicator Arrow at Bottom for desktop */}
                    {!isLast && (
                      <div className="hidden lg:flex justify-end pt-4 mt-2 text-slate-300 group-hover:text-slate-500 transition-colors">
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
