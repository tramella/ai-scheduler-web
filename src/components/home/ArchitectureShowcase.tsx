import React from "react";
import { Cpu, ShieldCheck, Zap, Lock, Binary, RefreshCw, CheckCircle2 } from "lucide-react";

export const ArchitectureShowcase: React.FC = () => {
  return (
    <section className="py-20 md:py-28 border-t border-slate-200/80 bg-slate-50/50 relative overflow-hidden">
      {/* Background grid accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#dcdfe8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-60"></div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-2 rounded-full border border-slate-200/90 bg-white px-3.5 py-1 text-xs font-semibold text-slate-800 shadow-2xs">
            <span className="flex h-2 w-2 rounded-full bg-[#2F5BFF] ring-2 ring-[#FF7A59]/40"></span>
            <span>The ORBIT Core Philosophy</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#0F172A]">
            AI proposes. Code decides.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Generic chatbots hallucinate shifts and miss overtime laws. ORBIT pairs generative language reasoning with a hard deterministic mathematical validator.
          </p>
        </div>

        {/* Dual Engine Interactive Flow Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch max-w-6xl mx-auto">
          {/* Card 1: GenAI Cognitive Engine */}
          <div className="rounded-3xl border border-slate-200 bg-white p-7 sm:p-8 shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-[#2F5BFF]/50 transition">
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2F2C59] text-white shadow-xs border border-[#2F2C59]">
                <Cpu className="h-6 w-6 text-[#2F5BFF]" />
              </div>
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#2F5BFF]">
                  Layer 01 • Cognitive
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                  Natural Language Reasoning
                </h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Interprets fuzzy managerial intent, balances skill specializations, reads employee requests, and drafts a proposed shift assignment matrix.
              </p>
            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 p-4 border border-slate-100 text-xs font-mono space-y-1.5 text-slate-700">
              <div className="flex items-center text-emerald-600 font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                <span>Multi-Model Intelligence</span>
              </div>
              <p className="text-slate-500 text-[11px]">Gemini 2.5 Flash • OpenAI GPT-4o</p>
            </div>
          </div>

          {/* Card 2: Safe Data Hydration & Token Diet */}
          <div className="rounded-3xl border border-slate-200 bg-white p-7 sm:p-8 shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-[#FF7A59]/50 transition">
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2F2C59] text-white shadow-xs border border-[#2F2C59]">
                <Lock className="h-6 w-6 text-[#FF7A59]" />
              </div>
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF7A59]">
                  Layer 02 • Privacy
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                  Token Diet & Data Shield
                </h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                PII data (avatars, emails, phone numbers) are stripped in-memory before AI reasoning. Inputs are minified to reduce 80% token consumption.
              </p>
            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 p-4 border border-slate-100 text-xs font-mono space-y-1.5 text-slate-700">
              <div className="flex items-center text-emerald-600 font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                <span>Zero Data Retention</span>
              </div>
              <p className="text-slate-500 text-[11px]">Never used to train public models</p>
            </div>
          </div>

          {/* Card 3: Deterministic Rule Validator */}
          <div className="rounded-3xl border border-slate-200 bg-white p-7 sm:p-8 shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-[#2F5BFF]/50 transition">
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2F2C59] text-white shadow-xs border border-[#2F2C59]">
                <ShieldCheck className="h-6 w-6 text-[#2F5BFF]" />
              </div>
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#2F5BFF]">
                  Layer 03 • Hard Math
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                  Deterministic Rule Kernel
                </h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Enforces non-negotiable business rules: max hours per week, mandatory 1-shift-per-day, and rest intervals. Rejects any AI hallucination instantly.
              </p>
            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 p-4 border border-slate-100 text-xs font-mono space-y-1.5 text-slate-700">
              <div className="flex items-center text-emerald-600 font-semibold">
                <Binary className="h-3.5 w-3.5 mr-1" />
                <span>100% Conflict-Free Guarantee</span>
              </div>
              <p className="text-slate-500 text-[11px]">Audited by Node.js constraint engine</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
