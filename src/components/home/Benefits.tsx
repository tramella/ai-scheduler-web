import React from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { WeaveMark } from "@/components/ui/WeaveMark";

export const Benefits: React.FC = () => (
  <section className="border-t border-slate-200/70 bg-[#F6F7FB] py-20 dark:border-slate-800 dark:bg-slate-950 md:py-24">
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[36px] bg-[#2F2C59] px-6 py-14 text-white shadow-2xl shadow-[#2F2C59]/30 sm:px-14 sm:py-20">
        {/* Họa tiết weave từ logo, hai viên thuốc đan chéo */}
        <WeaveMark className="pointer-events-none absolute -bottom-24 -right-16 w-[26rem] opacity-[0.16]" />
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#2F5BFF]/30 blur-3xl" />

        <div className="relative max-w-xl">
          <h3 className="text-3xl font-display font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
            Automate your workforce scheduling.
          </h3>
          <p className="mt-5 text-base leading-relaxed text-indigo-100/85 sm:text-lg">
            Upload your roster and get a conflict-free schedule in about a minute.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/product"
              className="group inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-[#2F2C59] shadow-md transition hover:bg-slate-100 active:scale-[0.98]"
            >
              Generate a free schedule
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-semibold text-white ring-1 ring-white/30 transition hover:bg-white/10 active:scale-[0.98]"
            >
              View pricing
            </Link>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-indigo-100/85">
            {["No credit card required", "Works with your Excel files"].map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 stroke-[3] text-[#7B9BFF]" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);