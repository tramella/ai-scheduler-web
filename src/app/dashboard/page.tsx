"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Sun,
  Sunset,
  Moon,
  CheckCircle2,
  CalendarDays,
  CalendarCheck,
  Users,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { KpiCard } from "@/components/ui/KpiCard";

/* -------------------------------------------------------------------------- */
/*  Data                                                                      */
/* -------------------------------------------------------------------------- */

const TODAY_INDEX = 1; // Tuesday, Oct 13

const WEEK = [
  { day: "Monday", short: "Mon", dayNum: "12", label: "Mon, Oct 12", shifts: 16, staff: 14, morning: 6, afternoon: 6, night: 4 },
  { day: "Tuesday", short: "Tue", dayNum: "13", label: "Tue, Oct 13", shifts: 16, staff: 15, morning: 6, afternoon: 6, night: 4 },
  { day: "Wednesday", short: "Wed", dayNum: "14", label: "Wed, Oct 14", shifts: 18, staff: 16, morning: 7, afternoon: 7, night: 4 },
  { day: "Thursday", short: "Thu", dayNum: "15", label: "Thu, Oct 15", shifts: 16, staff: 14, morning: 6, afternoon: 6, night: 4 },
  { day: "Friday", short: "Fri", dayNum: "16", label: "Fri, Oct 16", shifts: 20, staff: 18, morning: 8, afternoon: 8, night: 4 },
  { day: "Saturday", short: "Sat", dayNum: "17", label: "Sat, Oct 17", shifts: 22, staff: 20, morning: 9, afternoon: 9, night: 4 },
  { day: "Sunday", short: "Sun", dayNum: "18", label: "Sun, Oct 18", shifts: 14, staff: 12, morning: 5, afternoon: 5, night: 4 },
];

type ShiftKey = "morning" | "afternoon" | "night";

const SHIFT_TYPES: {
  key: ShiftKey;
  name: string;
  time: string;
  start: number;
  end: number; // > 24 means it wraps past midnight
  supervisor: string;
  initial: string;
  icon: React.ElementType;
  text: string;
  bar: string;
  soft: string;
  heroDot: string;
}[] = [
  {
    key: "morning",
    name: "Morning shift",
    time: "07:00 – 15:00",
    start: 7,
    end: 15,
    supervisor: "Nguyễn Văn An",
    initial: "A",
    icon: Sun,
    text: "text-[#2F5BFF]",
    bar: "bg-[#2F5BFF]",
    soft: "bg-blue-50 dark:bg-blue-950/40",
    heroDot: "bg-[#6F8CFF]",
  },
  {
    key: "afternoon",
    name: "Afternoon shift",
    time: "14:30 – 22:30",
    start: 14.5,
    end: 22.5,
    supervisor: "Lý Khánh Nam",
    initial: "N",
    icon: Sunset,
    text: "text-[#FF7A59]",
    bar: "bg-[#FF7A59]",
    soft: "bg-orange-50 dark:bg-orange-950/40",
    heroDot: "bg-[#FF7A59]",
  },
  {
    key: "night",
    name: "Night shift",
    time: "22:00 – 06:00",
    start: 22,
    end: 30,
    supervisor: "Vũ Tuấn Kiệt",
    initial: "K",
    icon: Moon,
    text: "text-[#2F2C59] dark:text-indigo-300",
    bar: "bg-[#2F2C59] dark:bg-indigo-400",
    soft: "bg-indigo-50 dark:bg-indigo-950/40",
    heroDot: "bg-indigo-300",
  },
];

const MAX_SLOTS = Math.max(...WEEK.map((d) => d.morning + d.afternoon + d.night));

const CARD =
  "rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_1px_2px_rgba(15,23,42,0.04)]";

/* -------------------------------------------------------------------------- */
/*  Small building blocks                                                     */
/* -------------------------------------------------------------------------- */

function segments(start: number, end: number): [number, number][] {
  return end > 24 ? [[start, 24], [0, end - 24]] : [[start, end]];
}

/** 24h track showing when a shift runs */
function TimeTrack({ start, end, barClass }: { start: number; end: number; barClass: string }) {
  return (
    <div className="relative h-1.5 w-full rounded-full bg-slate-200/70 dark:bg-slate-700/60" aria-hidden>
      {segments(start, end).map(([s, e], i) => (
        <div
          key={i}
          className={`absolute top-0 h-full rounded-full ${barClass}`}
          style={{ left: `${(s / 24) * 100}%`, width: `${((e - s) / 24) * 100}%` }}
        />
      ))}
    </div>
  );
}

function CoverageRing({ percent }: { percent: number }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative h-28 w-28 shrink-0">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="9" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="white"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - percent / 100)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-semibold tabular-nums text-white">{percent}%</span>
        <span className="text-[11px] text-white/60">covered</span>
      </div>
    </div>
  );
}

function Sparkline({ values, highlight, barClass }: { values: number[]; highlight: number; barClass: string }) {
  const max = Math.max(...values);
  return (
    <div className="flex h-9 items-end gap-1" aria-hidden>
      {values.map((v, i) => (
        <div
          key={i}
          className={`flex-1 rounded-[3px] ${barClass} ${i === highlight ? "opacity-100" : "opacity-25"}`}
          style={{ height: `${Math.max(12, (v / max) * 100)}%` }}
        />
      ))}
    </div>
  );
}

type KpiProps = {
  label: string;
  value: string;
  chip: string;
  chipClass: string;
  note: string;
  icon: React.ElementType;
  iconClass: string;
  valueClass?: string;
  children?: React.ReactNode;
};

const Kpi = KpiCard;

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

import { fetchDashboardSummaryApi } from "@/lib/apiClient";

export default function DashboardPage() {
  const { user } = useAuth();
  const [summaryData, setSummaryData] = useState<any>(null);
  const [selected, setSelected] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    async function loadSummary() {
      try {
        setIsLoading(true);
        const res = await fetchDashboardSummaryApi();
        if (res.data) {
          setSummaryData(res.data);
          if (typeof res.data.todayIndex === "number") {
            setSelected(res.data.todayIndex);
          }
        }
      } catch (err) {
        console.warn("Failed to load dashboard summary, using fallback:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSummary();
  }, []);

  const weekList = summaryData?.weekData || WEEK;
  const todayIdx = typeof summaryData?.todayIndex === "number" ? summaryData.todayIndex : TODAY_INDEX;
  const today = weekList[todayIdx] || WEEK[0];
  const day = weekList[selected] || today;

  const staffPool = summaryData?.staffPool || { total: 28, active: 28, availableRatio: 100 };
  const weeklyStats = summaryData?.weeklyStats || {
    totalShifts: 122,
    totalHours: 896,
    budgetHours: 920,
    utilizationPercent: 97.4,
    complianceScore: 100,
    activeRulesCount: 6
  };
  const coveragePercent = summaryData?.todayCoverage?.coveragePercent ?? 100;

  const status =
    selected < todayIdx
      ? { text: "Completed", cls: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300" }
      : selected === todayIdx
      ? { text: "Live now", cls: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300" }
      : { text: "Scheduled", cls: "bg-blue-50 text-[#2F5BFF] dark:bg-blue-950/50 dark:text-blue-300" };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        {/* ============================ Header ============================ */}
        <PageHeader
          eyebrow="Tuesday, October 13"
          title={`Welcome back, ${user?.full_name?.split(" ")[0] || "Manager"}`}
          actions={
            <>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                Oct 12 – Oct 18, 2026
              </span>
              <Link
                href="/dashboard/ai-studio"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#2F2C59] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#1E1B3A] active:scale-[0.99] dark:bg-indigo-600 dark:hover:bg-indigo-700"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Generate schedule
              </Link>
            </>
          }
        />

        {/* ===================== Row 1: Hero + KPIs ===================== */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* Hero – today's coverage */}
          <section
            aria-label="Today's coverage"
            className="relative overflow-hidden rounded-3xl bg-[#2F2C59] p-6 text-white lg:col-span-4"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-white/[0.04]" />
            <div className="pointer-events-none absolute -bottom-20 -left-10 h-44 w-44 rounded-full bg-white/[0.04]" />

            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60">On duty today</p>
                <p className="mt-1 text-4xl font-semibold tabular-nums tracking-tight">
                  {today.staff}
                  <span className="ml-1.5 text-base font-normal text-white/60">staff</span>
                </p>
              </div>
              <CoverageRing percent={coveragePercent} />
            </div>

            <ul className="relative mt-6 space-y-3">
              {SHIFT_TYPES.map((s) => (
                <li key={s.key} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2.5 text-white/80">
                    <span className={`h-2 w-2 rounded-full ${s.heroDot}`} />
                    {s.name}
                  </span>
                  <span className="font-semibold tabular-nums">{today[s.key] || 0}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/dashboard/ai-studio"
              className="relative mt-6 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-white px-4 py-2.5 text-xs font-semibold text-[#2F2C59] transition hover:bg-white/90"
            >
              Review in AI Studio
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </section>

          {/* KPI grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-8">
            <Kpi
              label="Staff pool"
              value={String(staffPool.total)}
              chip={`${staffPool.availableRatio}% active`}
              chipClass="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
              note={`${staffPool.active} / ${staffPool.total} personnel available`}
              icon={Users}
              iconClass="bg-blue-50 text-[#2F5BFF] dark:bg-blue-950/50"
            >
              <Sparkline values={weekList.map((d: any) => d.staff)} highlight={todayIdx} barClass="bg-[#2F5BFF]" />
            </Kpi>

            <Kpi
              label="Weekly shifts"
              value={String(weeklyStats.totalShifts)}
              chip="3 shifts / day"
              chipClass="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              note="Demand fully satisfied · 0 gaps"
              icon={CalendarCheck}
              iconClass="bg-orange-50 text-[#FF7A59] dark:bg-orange-950/50"
            >
              <Sparkline values={weekList.map((d: any) => d.shifts)} highlight={todayIdx} barClass="bg-[#FF7A59]" />
            </Kpi>

            <Kpi
              label="Total hours"
              value={`${weeklyStats.totalHours}h`}
              chip={`Cap ${weeklyStats.budgetHours}h`}
              chipClass="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              note={`${weeklyStats.utilizationPercent}% of budget`}
              icon={Clock}
              iconClass="bg-indigo-50 text-[#2F2C59] dark:bg-indigo-950/50 dark:text-indigo-300"
            >
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-[#2F2C59] dark:bg-indigo-400"
                  style={{ width: `${Math.min(100, weeklyStats.utilizationPercent)}%` }}
                />
              </div>
            </Kpi>

            <Kpi
              label="Statutory audit"
              value={`${weeklyStats.complianceScore}%`}
              valueClass="text-emerald-600 dark:text-emerald-400"
              chip="Passed"
              chipClass="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
              note={`${weeklyStats.activeRulesCount} rules strictly enforced`}
              icon={ShieldCheck}
              iconClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
            >
              <div className="flex gap-1.5">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="h-2 flex-1 rounded-full bg-emerald-500" />
                ))}
              </div>
            </Kpi>
          </div>
        </div>

        {/* ================= Row 2: Weekly chart + Day panel ================= */}
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
          {/* Weekly staffing chart */}
          <section aria-label="Weekly staffing" className={`${CARD} p-6 lg:col-span-8`}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">Weekly staffing</h2>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Week 42 · Select a day to see its shifts
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                {SHIFT_TYPES.map((s) => (
                  <span key={s.key} className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <span className={`h-2 w-2 rounded-full ${s.bar}`} />
                    {s.key.charAt(0).toUpperCase() + s.key.slice(1)}
                  </span>
                ))}
                <Link
                  href="/dashboard/calendar"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#2F2C59] transition hover:text-indigo-600 dark:text-indigo-300"
                >
                  Open calendar
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Bars */}
            <div className="relative mt-6">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-44" aria-hidden>
                {[0, 50, 100].map((p) => (
                  <div
                    key={p}
                    className="absolute inset-x-0 border-t border-dashed border-slate-200/80 dark:border-slate-800"
                    style={{ top: `${p}%` }}
                  />
                ))}
              </div>

              <div className="relative grid grid-cols-7 gap-2 sm:gap-4">
                {weekList.map((d: any, i: number) => {
                  const isSelected = i === selected;
                  const isToday = i === todayIdx;
                  return (
                    <button
                      key={d.day}
                      type="button"
                      onClick={() => setSelected(i)}
                      aria-pressed={isSelected}
                      aria-label={`${d.day}, ${d.shifts} shifts, ${d.staff} staff`}
                      className="group flex flex-col items-center gap-3 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[#2F5BFF]/50"
                    >
                      <div className="flex h-44 w-full max-w-[44px] flex-col-reverse gap-0.5">
                        {SHIFT_TYPES.map((s) => (
                          <div
                            key={s.key}
                            className={`w-full rounded-md transition-opacity duration-150 ${s.bar} ${
                              isSelected ? "opacity-100" : "opacity-35 group-hover:opacity-70"
                            }`}
                            style={{ height: `${(d[s.key] / (MAX_SLOTS || 1)) * 100}%` }}
                          />
                        ))}
                      </div>

                      <div
                        className={`flex w-full flex-col items-center rounded-2xl px-1 py-1.5 transition-colors ${
                          isSelected
                            ? "bg-[#2F2C59] text-white dark:bg-indigo-600"
                            : "text-slate-500 group-hover:bg-slate-100 dark:text-slate-400 dark:group-hover:bg-slate-800"
                        }`}
                      >
                        <span className="text-[11px] font-medium">{d.short}</span>
                        <span className="text-sm font-semibold tabular-nums">{d.dayNum}</span>
                      </div>

                      <span
                        className={`-mt-1 h-1 w-1 rounded-full ${isToday ? "bg-[#FF7A59]" : "bg-transparent"}`}
                        aria-hidden
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected-day summary */}
            <div className="mt-4 grid grid-cols-3 divide-x divide-slate-200/80 rounded-2xl bg-slate-50 py-4 dark:divide-slate-800 dark:bg-slate-800/40">
              {[
                { label: "Assignments", value: `${day.shifts} shifts` },
                { label: "Staffing", value: `${day.staff} staff` },
                { label: "Coverage", value: "100%" },
              ].map((m) => (
                <div key={m.label} className="px-4 text-center">
                  <p className="text-xs text-slate-500 dark:text-slate-400">{m.label}</p>
                  <p className="mt-0.5 text-sm font-semibold tabular-nums text-slate-900 dark:text-white sm:text-base">
                    {m.value}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Day panel */}
          <section aria-label="Shifts for selected day" className={`${CARD} p-6 lg:col-span-4`}>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                  {selected === todayIdx ? "Today’s shifts" : "Shifts"}
                </h2>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {day.label} · {day.staff} staff
                </p>
              </div>
              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${status.cls}`}>
                {selected === TODAY_INDEX && (
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60 motion-reduce:animate-none" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </span>
                )}
                {status.text}
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {SHIFT_TYPES.map((s) => {
                const Icon = s.icon;
                return (
                  <article key={s.key} className={`rounded-2xl p-4 ${s.soft}`}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-slate-900">
                          <Icon className={`h-4 w-4 ${s.text}`} />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{s.name}</p>
                          <p className="text-xs tabular-nums text-slate-500 dark:text-slate-400">{s.time}</p>
                        </div>
                      </div>
                      <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-xs font-semibold tabular-nums text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                        {day[s.key]} staff
                      </span>
                    </div>

                    <div className="mt-3">
                      <TimeTrack start={s.start} end={s.end} barClass={s.bar} />
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2F2C59] text-[10px] font-semibold text-white">
                        {s.initial}
                      </div>
                      <span className="truncate text-xs text-slate-600 dark:text-slate-400">
                        Lead: <span className="font-medium text-slate-800 dark:text-slate-200">{s.supervisor}</span>
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5" />
                100% covered
              </span>
              <Link
                href="/dashboard/ai-studio"
                className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                Edit in AI Studio
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}