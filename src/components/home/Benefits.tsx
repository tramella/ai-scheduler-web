import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

export const Benefits: React.FC = () => {
  return (
    <section className="py-16 md:py-20 border-t border-slate-200/80 bg-slate-50/50 relative">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-[#2F2C59]/40 bg-[#2F2C59] p-8 sm:p-14 text-center relative overflow-hidden shadow-xl text-white">
          {/* Subtle Ambient Radial Highlight */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-gradient-to-br from-[#2F5BFF]/30 to-transparent rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-gradient-to-tr from-[#FF7A59]/20 to-transparent rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <div className="inline-flex items-center space-x-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold text-white border border-white/15">
              <Sparkles className="h-3.5 w-3.5 text-[#FF7A59]" />
              <span>Ready in 60 seconds</span>
            </div>

            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Automate your workforce scheduling
            </h3>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Upload your employee roster and generate conflict-free shift schedules today.
            </p>

            {/* CTAs */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/product"
                className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3 text-sm font-bold text-[#2F2C59] bg-white hover:bg-slate-100 rounded-full shadow-md transition active:scale-[0.98]"
              >
                <span>Generate schedule free</span>
                <ArrowRight className="ml-2 h-4 w-4 text-[#2F2C59]" />
              </Link>
            </div>

            {/* Trust Points */}
            <div className="pt-5 flex flex-wrap items-center justify-center gap-5 text-xs text-slate-300 font-medium">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Excel (.xlsx) compatible</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Zero double-bookings</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
