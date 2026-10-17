import React from "react";
import { MessageSquare, Sliders, FileSpreadsheet, Check, ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/home/SectionHeading";
import { WeaveMark } from "@/components/ui/WeaveMark";

const HOURS = [36, 38, 35, 37, 36, 38];
const base = "relative overflow-hidden rounded-[28px] p-7 sm:p-8";
const light = "border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900";

const Chip: React.FC<{ children: React.ReactNode; dark?: boolean }> = ({ children, dark }) => (
  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${dark ? "bg-white/10 text-white ring-1 ring-white/15" : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"}`}>
    {children}
  </span>
);

export const BentoFeatures: React.FC = () => (
  <section className="border-t border-slate-200/70 bg-white py-16 dark:border-slate-800 dark:bg-slate-950 md:py-24">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionHeading title="Built for the realities of shift work." className="mb-10" />

      <div className="grid gap-4 md:grid-cols-3">
        {/* Rules bằng ngôn ngữ tự nhiên */}
        <div className={`${base} flex flex-col justify-between gap-8 bg-[#2F2C59] text-white md:col-span-2`}>
          <WeaveMark className="pointer-events-none absolute -right-10 -top-10 w-52 opacity-[0.08]" />
          <div className="relative max-w-md space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
              <MessageSquare className="h-5 w-5 text-[#FF7A59]" />
            </div>
            <h3 className="text-2xl font-bold">Tell it your rules like you&apos;d tell a colleague</h3>
            <p className="text-sm leading-relaxed text-indigo-100/80">Describe what you need in plain English. ORBIT turns it into rules the scheduler enforces.</p>
          </div>
          <div className="relative space-y-3">
            <div className="rounded-2xl bg-white/[0.07] p-4 ring-1 ring-white/10">
              <p className="text-xs text-indigo-200/70">You wrote</p>
              <p className="mt-1 text-sm leading-relaxed sm:text-base">&ldquo;Ensure at least 1 shift supervisor on duty for Friday closing and cap all part-time cashiers at 25h/week.&rdquo;</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Chip dark><Check className="h-3 w-3 text-[#7B9BFF]" /> Friday close · min 1 supervisor</Chip>
              <Chip dark><Check className="h-3 w-3 text-[#7B9BFF]" /> Part-time cashiers · max 25h/week</Chip>
            </div>
          </div>
        </div>

        {/* Cân bằng giờ */}
        <div className={`${base} ${light} flex flex-col justify-between gap-8`}>
          <div className="space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2F5BFF]/10 text-[#2F5BFF]"><Sliders className="h-5 w-5" /></div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Fair hours, no burnout</h3>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">Hours are spread evenly so nobody burns out and overtime doesn&apos;t sneak in.</p>
          </div>
          <div>
            <div className="flex h-20 items-end gap-2" role="img" aria-label="Weekly hours per employee, all between 35 and 38">
              {HOURS.map((h, i) => <div key={i} className="flex-1 rounded-t-lg bg-[#2F5BFF]/80" style={{ height: `${(h / 40) * 100}%` }} />)}
            </div>
          </div>
        </div>

        {/* Excel */}
        <div className={`${base} ${light} flex flex-col justify-between gap-6 md:col-span-3 md:flex-row md:items-center`}>
          <div className="max-w-lg space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600"><FileSpreadsheet className="h-5 w-5" /></div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Keep working in Excel</h3>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">Upload the roster you already have and download a print-ready schedule. Nothing for your team to install.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Chip><FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" /> roster.xlsx</Chip>
            <ArrowRight className="h-4 w-4 text-slate-300" />
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700"><WeaveMark className="h-5 w-5" /></span>
            <ArrowRight className="h-4 w-4 text-slate-300" />
            <Chip><FileSpreadsheet className="h-3.5 w-3.5 text-[#2F5BFF]" /> schedule.xlsx</Chip>
          </div>
        </div>
      </div>
    </div>
  </section>
);