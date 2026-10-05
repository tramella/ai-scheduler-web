import React from "react";
import { Upload, MessageSquareText, Sparkles, ArrowRight } from "lucide-react";

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: "01",
      title: "Upload Roster",
      desc: "Drop your existing employee Excel file with names, roles, and availability.",
    },
    {
      num: "02",
      title: "Describe Shift Rules",
      desc: "Type constraints in plain English (e.g. 'Min 2 cashiers in morning, max 35h/wk').",
    },
    {
      num: "03",
      title: "Export .xlsx Schedule",
      desc: "Receive a conflict-free, mathematically verified shift matrix in seconds.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-24 border-t border-zinc-200/80 bg-zinc-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 font-mono">
            Simple 3-Step Flow
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950">
            How ORBIT works.
          </h2>
        </div>

        {/* 3 Steps in a sleek horizontal row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="rounded-3xl border border-zinc-200/80 bg-white p-7 sm:p-8 shadow-2xs relative"
            >
              <span className="font-mono text-xs font-bold text-[#FF5A36] bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200/60 inline-block mb-4">
                Step {step.num}
              </span>
              <h3 className="text-lg font-bold text-zinc-950 mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
