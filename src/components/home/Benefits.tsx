import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Check } from "lucide-react";

export const Benefits: React.FC = () => {
  return (
    <section className="py-16 md:py-20 border-t border-slate-200/80 bg-slate-50/50 relative">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-800 bg-[#2F2C59] p-8 sm:p-12 text-center relative overflow-hidden shadow-xl text-white">
          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <div className="inline-flex items-center space-x-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-white">
              <Sparkles className="h-3.5 w-3.5 text-[#FF7A59]" />
              <span>Ready in 60 Seconds</span>
            </div>

            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Automate your workforce scheduling
            </h3>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Upload your employee roster and generate conflict-free shift schedules today.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/product"
                className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3 text-sm font-semibold text-[#2F2C59] bg-white hover:bg-slate-100 rounded-xl shadow-xs transition active:scale-[0.99]"
              >
                <span>Launch Free Copilot</span>
                <ArrowRight className="ml-2 h-4 w-4 text-[#2F2C59]" />
              </Link>
            </div>

            {/* Trust Points */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-5 text-xs text-slate-300 font-medium">
              <div className="flex items-center space-x-1.5">
                <Check className="h-3.5 w-3.5 text-white" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Check className="h-3.5 w-3.5 text-white" />
                <span>Excel (.xlsx) Compatible</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Check className="h-3.5 w-3.5 text-white" />
                <span>Zero Double-Bookings</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
