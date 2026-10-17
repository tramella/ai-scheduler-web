import React from "react";
import Link from "next/link";
import { ArrowRight, Check, FileSpreadsheet } from "lucide-react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

interface Shift { col: number; span: number; label: string; fix?: boolean }
const ROWS: { name: string; role: string; shifts: Shift[] }[] = [
  { name: "Linh T.", role: "Supervisor", shifts: [{ col: 1, span: 2, label: "06–14" }, { col: 4, span: 2, label: "14–22" }] },
  { name: "Minh P.", role: "Cashier", shifts: [{ col: 2, span: 2, label: "09–17" }, { col: 5, span: 1, label: "06–14", fix: true }] },
  { name: "Sara K.", role: "Barista", shifts: [{ col: 1, span: 1, label: "14–22" }, { col: 3, span: 2, label: "06–14" }] },
  { name: "Dev R.", role: "Cashier", shifts: [{ col: 1, span: 2, label: "09–17" }, { col: 4, span: 2, label: "09–17" }] },
];

/** Signature ORBIT behavior: AI suggests (coral) -> mathematical solver verifies (blue). */
const RosterCard: React.FC = () => (
  <div className="relative rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_24px_60px_-20px_rgba(47,44,89,0.25)] dark:border-slate-800 dark:bg-slate-900">
    <div className="mb-4 flex items-center justify-between">
      <p className="text-sm font-semibold text-slate-900 dark:text-white">This week&apos;s roster</p>
      <div className="grid text-xs font-semibold" aria-live="off">
        <span className="orbit-draft col-start-1 row-start-1 inline-flex items-center gap-1.5 rounded-full bg-[#FF7A59]/15 px-2.5 py-1 text-[#C2410C] dark:text-[#FF9C82]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#FF7A59]" /> AI draft · 1 conflict
        </span>
        <span className="orbit-ok col-start-1 row-start-1 inline-flex items-center gap-1.5 rounded-full bg-[#2F5BFF]/10 px-2.5 py-1 text-[#2F5BFF] dark:text-[#7B9BFF]">
          <Check className="h-3 w-3 stroke-[3]" /> Verified · 0 conflicts
        </span>
      </div>
    </div>

    <div className="grid grid-cols-[4.5rem_1fr] gap-x-3 gap-y-2">
      <span />
      <div className="grid grid-cols-5 gap-1.5 text-center text-[11px] font-medium text-slate-400">
        {DAYS.map((d) => <span key={d}>{d}</span>)}
      </div>

      {ROWS.map((row) => (
        <React.Fragment key={row.name}>
          <div className="leading-tight">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{row.name}</p>
            <p className="text-[11px] text-slate-400">{row.role}</p>
          </div>
          <div className="grid grid-cols-5 items-center gap-1.5 rounded-xl bg-slate-50 p-1 dark:bg-slate-800/60">
            {row.shifts.map((s) => (
              <div
                key={s.col}
                style={{ gridColumn: `${s.col} / span ${s.span}`, gridRow: 1 }}
                className="relative flex h-7 items-center justify-center rounded-full bg-[#2F5BFF] text-[11px] font-semibold tabular-nums text-white"
              >
                {s.fix && (
                  <span className="orbit-proposed absolute inset-0 rounded-full border border-dashed border-[#C2410C]/60 bg-[#FF7A59]" />
                )}
                <span className="relative">{s.label}</span>
              </div>
            ))}
          </div>
        </React.Fragment>
      ))}
    </div>

    <ul className="mt-5 grid gap-1.5 border-t border-slate-100 pt-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
      {["14h minimum rest between shifts", "Part-timers capped at 25h / week", "1 supervisor on every closing shift"].map((r) => (
        <li key={r} className="flex items-center gap-2">
          <Check className="h-3.5 w-3.5 shrink-0 stroke-[3] text-[#2F5BFF]" />
          {r}
        </li>
      ))}
    </ul>
  </div>
);

export const Hero: React.FC = () => (
  <section className="relative overflow-hidden bg-[#F6F7FB] pb-16 pt-10 dark:bg-slate-950 sm:pb-20 sm:pt-16 lg:pt-20">
    <div className="glow-weave pointer-events-none absolute inset-x-0 top-0 h-[520px]" />

    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
        {/* Left column: text content */}
        <div className="lg:col-span-7">
          <h1 className="max-w-2xl text-[2.5rem] font-display font-extrabold leading-[1.05] tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-[3.5rem]">
            Shift scheduling without the spreadsheet chaos.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            Upload your roster, describe your rules in plain language, and get a conflict-free schedule in seconds. Every shift is checked before you see it.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/product"
              className="group inline-flex items-center justify-center rounded-full bg-[#2F2C59] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#2F2C59]/25 transition hover:bg-[#1E1B3A] active:scale-[0.98] dark:bg-white dark:text-[#2F2C59]"
            >
              Try 1 free schedule
              <ArrowRight className="ml-2 h-4 w-4 text-[#FF7A59] transition-transform group-hover:translate-x-0.5 dark:text-[#E8613F]" />
            </Link>
            <a
              href="#playground"
              className="inline-flex items-center justify-center rounded-full border border-slate-300/80 bg-white/70 px-6 py-3.5 text-sm font-medium text-slate-700 transition hover:bg-white active:scale-[0.98] dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200"
            >
              <FileSpreadsheet className="mr-2 h-4 w-4 text-[#2F5BFF]" />
              Explore the live roster
            </a>
          </div>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">No credit card required.</p>
        </div>

        {/* Illustrative roster card */}
        <div className="lg:col-span-5">
          <RosterCard />
        </div>
      </div>
    </div>
  </section>
);