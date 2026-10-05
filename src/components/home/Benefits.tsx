import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export const Benefits: React.FC = () => {
  return (
    <section className="py-16 md:py-20 border-t border-zinc-200/80 bg-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-zinc-200 bg-gradient-to-b from-white via-zinc-50/60 to-zinc-100/50 p-8 sm:p-12 text-center relative overflow-hidden shadow-2xs">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-0 w-[350px] h-[200px] bg-[#FF5A36]/6 blur-3xl rounded-full pointer-events-none"></div>

          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <div className="inline-flex items-center space-x-1.5 rounded-full bg-white border border-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-800 shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-[#FF5A36]" />
              <span>Instant Setup • No Credit Card Required</span>
            </div>
            
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-950">
              Ready to automate your workforce scheduling?
            </h3>
            
            <p className="text-zinc-600 text-sm sm:text-base leading-relaxed">
              Upload your employee roster and generate conflict-free schedules in seconds.
            </p>
            
            <div className="pt-2">
              <Link
                href="/product"
                className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-semibold text-white bg-zinc-950 hover:bg-zinc-800 rounded-2xl shadow-xs transition active:scale-[0.99] group border border-zinc-800"
              >
                <span>Try ORBIT Free</span>
                <ArrowRight className="ml-2 h-4 w-4 text-[#FF5A36] group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
