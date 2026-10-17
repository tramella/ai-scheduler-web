"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Clock,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Download,
  ArrowRight,
  Sun,
  Sunset,
  Moon,
  CheckCircle2,
  Users,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { PillButton } from "@/components/ui/PillButton";

/* -------------------------------------------------------------------------- */
/*  Constants & Types                                                         */
/* -------------------------------------------------------------------------- */

const SHIFT_TYPES = [
  {
    key: "morning" as const,
    name: "Morning",
    nameVi: "Ca sáng",
    bar: "bg-[#2F5BFF]",
    text: "text-[#2F5BFF]",
    soft: "bg-blue-50 dark:bg-blue-950/40",
    time: "07:00 – 15:00",
    start: 7,
    end: 15,
    icon: Sun,
  },
  {
    key: "afternoon" as const,
    name: "Afternoon",
    nameVi: "Ca chiều",
    bar: "bg-[#FF7A59]",
    text: "text-[#FF7A59]",
    soft: "bg-orange-50 dark:bg-orange-950/40",
    time: "14:30 – 22:30",
    start: 14.5,
    end: 22.5,
    icon: Sunset,
  },
  {
    key: "night" as const,
    name: "Night",
    nameVi: "Ca đêm",
    bar: "bg-[#2F2C59] dark:bg-indigo-400",
    text: "text-[#2F2C59] dark:text-indigo-300",
    soft: "bg-indigo-50 dark:bg-indigo-950/40",
    time: "22:00 – 06:00",
    start: 22,
    end: 30,
    icon: Moon,
  },
];

const CARD =
  "rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_1px_2px_rgba(15,23,42,0.04)]";

function segments(start: number, end: number): [number, number][] {
  return end > 24 ? [[start, 24], [0, end - 24]] : [[start, end]];
}

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

/* -------------------------------------------------------------------------- */
/*  Main Component                                                            */
/* -------------------------------------------------------------------------- */

import { fetchDashboardAnalyticsApi } from "@/lib/apiClient";

export default function AnalyticsPage() {
  const { lang } = useLanguage();
  const [selectedPeriod, setSelectedPeriod] = useState<"week42" | "week41" | "month10">("week42");
  const [selectedDayIdx, setSelectedDayIdx] = useState(1);
  const [workloadFilter, setWorkloadFilter] = useState<"all" | "cap" | "under">("all");
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    async function loadAnalytics() {
      try {
        setIsLoading(true);
        const periodParam = selectedPeriod === "week41" ? "previous" : "current";
        const res = await fetchDashboardAnalyticsApi(periodParam);
        if (res.data) {
          setAnalyticsData(res.data);
          const tIdx = res.data.dailyLoad?.findIndex((d: any) => d.isToday);
          if (tIdx !== -1 && typeof tIdx === "number") {
            setSelectedDayIdx(tIdx);
          }
        }
      } catch (err) {
        console.warn("Failed to load analytics from API:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadAnalytics();
  }, [selectedPeriod]);

  const roleAllocation: any[] = analyticsData?.roleAllocation || [];
  const dailyLoad: any[] = analyticsData?.dailyLoad || [];

  const maxSlots = Math.max(1, ...dailyLoad.map((d: any) => (d.morning || 0) + (d.afternoon || 0) + (d.night || 0)));
  const activeDay = dailyLoad[selectedDayIdx] || dailyLoad[0] || { totalStaff: 0, hours: 0, morning: 0, afternoon: 0, night: 0, supervisor: "Unassigned", fullDate: "No active day" };

  const scheduledHoursStats = analyticsData?.scheduledHours || { total: 0, budget: 0, utilizationPercent: 0 };
  const overtimeStats = analyticsData?.overtimeBreaches || { count: 0, compliant: true };
  const fairnessStats = analyticsData?.fairnessIndex || { score: 100, stdDevHours: 0 };
  const payrollStats = analyticsData?.estimatedPayroll || { totalVnd: 0, formattedVnd: "0 ₫", budgetVnd: 0 };

  const rawStaffWorkload: any[] = analyticsData?.staffWorkload || [];

  const staffWorkload = rawStaffWorkload.map((sw: any) => ({
    name: sw.name,
    role: sw.role,
    initial: sw.avatar || (sw.name ? sw.name.slice(0, 1).toUpperCase() : "E"),
    hours: sw.scheduledHours !== undefined ? sw.scheduledHours : sw.hours || 0,
    target: sw.targetHours !== undefined ? sw.targetHours : sw.target || 40,
    status: sw.status === "optimal" || sw.status === "Optimal" ? "Optimal" : (sw.scheduledHours || sw.hours || 0) >= 40 ? "Overtime" : "Under cap"
  }));

  const filteredStaff = staffWorkload.filter((sw: any) => {
    if (workloadFilter === "cap") return sw.hours >= 40;
    if (workloadFilter === "under") return sw.hours < 40;
    return true;
  });

  const atCapCount = staffWorkload.filter((sw: any) => sw.hours >= 40).length;
  const underCapCount = staffWorkload.filter((sw: any) => sw.hours < 40).length;

  const periodHeaderLabel = analyticsData?.period?.startDate && analyticsData?.period?.endDate
    ? `${new Date(analyticsData.period.startDate).toLocaleDateString()} – ${new Date(analyticsData.period.endDate).toLocaleDateString()}`
    : dailyLoad.length > 0
    ? `${dailyLoad[0]?.fullDate} – ${dailyLoad[dailyLoad.length - 1]?.fullDate}`
    : "Current period";

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* ================= 1. PAGE HEADER ================= */}
        <PageHeader
          eyebrow={
            lang === "vi"
              ? `${periodHeaderLabel} · Không gian làm việc quản trị`
              : `${periodHeaderLabel} · Central Hub Workspace`
          }
          title={lang === "vi" ? "Phân tích lực lượng lao động" : "Workforce analytics"}
          description={
            lang === "vi"
              ? "Phân bổ khối lượng ca làm việc, tuân thủ định mức và hiệu quả quỹ lương"
              : "Operational workload distribution, labor compliance, and payroll efficiency"
          }
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 p-1 text-xs font-semibold gap-1">
                <button
                  type="button"
                  onClick={() => setSelectedPeriod("week42")}
                  className={`rounded-full px-3 py-1.5 transition cursor-pointer ${
                    selectedPeriod === "week42"
                      ? "bg-[#2F2C59] text-white dark:bg-indigo-600 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {lang === "vi" ? "Tuần này" : "Current week"}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPeriod("week41")}
                  className={`rounded-full px-3 py-1.5 transition cursor-pointer ${
                    selectedPeriod === "week41"
                      ? "bg-[#2F2C59] text-white dark:bg-indigo-600 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {lang === "vi" ? "Tuần trước" : "Previous week"}
                </button>
              </div>

              <PillButton variant="secondary" onClick={() => {}}>
                <Download className="h-3.5 w-3.5" />
                <span>{lang === "vi" ? "Xuất file CSV" : "Export CSV"}</span>
              </PillButton>
            </div>
          }
        />

        {/* ================= 2. FOUR CORE OPERATIONAL KPIS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* KPI 1: Scheduled Hours */}
          <article className={`${CARD} p-5 hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col justify-between`}>
            <div>
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-[#2F5BFF] flex items-center justify-center shrink-0">
                  <Clock className="h-[18px] w-[18px]" />
                </div>
                <span className="rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#2F5BFF] dark:text-blue-300 px-2.5 py-1 text-[11px] font-semibold tabular-nums">
                  {Math.round(scheduledHoursStats.budget - scheduledHoursStats.total)}h under cap
                </span>
              </div>
              <p className="mt-4 text-[13px] font-medium text-slate-500 dark:text-slate-400">
                {lang === "vi" ? "Tổng số giờ xếp ca" : "Total scheduled hours"}
              </p>
              <p className="mt-1 text-[28px] font-semibold tracking-tight tabular-nums text-slate-900 dark:text-white">
                {scheduledHoursStats.total}h
              </p>
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#2F5BFF] rounded-full"
                  style={{ width: `${Math.min(100, scheduledHoursStats.utilizationPercent)}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === "vi"
                  ? `Định mức: ${scheduledHoursStats.budget}h · Đạt ${scheduledHoursStats.utilizationPercent}%`
                  : `Budget: ${scheduledHoursStats.budget}h · ${scheduledHoursStats.utilizationPercent}% utilized`}
              </p>
            </div>
          </article>

          {/* KPI 2: Overtime Breaches */}
          <article className={`${CARD} p-5 hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col justify-between`}>
            <div>
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="h-[18px] w-[18px]" />
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                  overtimeStats.compliant
                    ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
                    : "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300"
                }`}>
                  {overtimeStats.compliant ? "100% compliant" : `${overtimeStats.count} breaches`}
                </span>
              </div>
              <p className="mt-4 text-[13px] font-medium text-slate-500 dark:text-slate-400">
                {lang === "vi" ? "Vi phạm làm thêm giờ" : "Overtime breaches"}
              </p>
              <p className={`mt-1 text-[28px] font-semibold tracking-tight tabular-nums ${
                overtimeStats.compliant ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600"
              }`}>
                {overtimeStats.count}
              </p>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex gap-1.5">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="h-1.5 flex-1 rounded-full bg-emerald-500" />
                ))}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === "vi" ? "Quy định 48h tuân thủ tuyệt đối" : "Statutory 48h limit enforced"}
              </p>
            </div>
          </article>

          {/* KPI 3: Fairness Index */}
          <article className={`${CARD} p-5 hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col justify-between`}>
            <div>
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-2xl bg-orange-50 dark:bg-orange-950/50 text-[#FF7A59] flex items-center justify-center shrink-0">
                  <TrendingUp className="h-[18px] w-[18px]" />
                </div>
                <span className="rounded-full bg-orange-50 dark:bg-orange-950/60 text-[#FF7A59] dark:text-orange-300 px-2.5 py-1 text-[11px] font-semibold tabular-nums">
                  ±{fairnessStats.stdDevHours}h deviation
                </span>
              </div>
              <p className="mt-4 text-[13px] font-medium text-slate-500 dark:text-slate-400">
                {lang === "vi" ? "Chỉ số công bằng" : "Fairness index"}
              </p>
              <p className="mt-1 text-[28px] font-semibold tracking-tight tabular-nums text-slate-900 dark:text-white">
                {fairnessStats.score}%
              </p>
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#FF7A59] rounded-full"
                  style={{ width: `${Math.min(100, fairnessStats.score)}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === "vi" ? "Phân bổ đều giữa nhân sự full-time" : "Even distribution across staff"}
              </p>
            </div>
          </article>

          {/* KPI 4: Estimated Payroll */}
          <article className={`${CARD} p-5 hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col justify-between`}>
            <div>
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-[#2F2C59] dark:text-indigo-300 flex items-center justify-center shrink-0">
                  <DollarSign className="h-[18px] w-[18px]" />
                </div>
                <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 text-[11px] font-semibold tabular-nums">
                  ~50k VND / hr
                </span>
              </div>
              <p className="mt-4 text-[13px] font-medium text-slate-500 dark:text-slate-400">
                {lang === "vi" ? "Ước tính quỹ lương" : "Estimated payroll"}
              </p>
              <p className="mt-1 text-[28px] font-semibold tracking-tight tabular-nums text-[#2F2C59] dark:text-indigo-300">
                {payrollStats.formattedVnd}
              </p>
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-[#2F2C59] dark:bg-indigo-400 w-[96.5%] rounded-full" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === "vi" ? "Dựa trên định mức ca làm việc" : "Based on scheduled shift hours"}
              </p>
            </div>
          </article>

        </div>

        {/* ================= 3. PRIMARY VISUALIZATION: DAILY STAFFING & SHIFT DISTRIBUTION ================= */}
        <section
          aria-label="Daily staffing and shift distribution"
          className={`${CARD} p-6 sm:p-7 space-y-6`}
        >
          {/* Header & Legends */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                  {lang === "vi" ? "Phân bổ nhân sự & ca làm việc theo ngày" : "Daily staffing & shift distribution"}
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="h-3 w-3" />
                  {analyticsData?.totalShifts || 0} shifts
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {lang === "vi"
                  ? "Khối lượng nhân sự chia theo 3 ca làm · Chọn ngày để kiểm tra chi tiết ca trực"
                  : "Staff headcount assigned per day across morning, afternoon, and night slots · Click any day to inspect"}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
              {SHIFT_TYPES.map((s) => (
                <span key={s.key} className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-medium">
                  <span className={`h-2.5 w-2.5 rounded-full ${s.bar}`} />
                  <span>{lang === "vi" ? s.nameVi : s.name} ({s.time})</span>
                </span>
              ))}
            </div>
          </div>

          {dailyLoad.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center text-xs text-slate-400">
              {lang === "vi" ? "Chưa có phân bổ ca trực nào trong kỳ này." : "No daily staffing load recorded for this period."}
            </div>
          ) : (
            <>
              {/* Elevated Vertical Stacked Bars Chart */}
              <div className="relative pt-2">
                {/* Background Guidelines with Headcount Ticks */}
                <div className="pointer-events-none absolute inset-x-0 top-2 h-56" aria-hidden>
                  {[
                    { pct: 0, label: `${maxSlots} staff` },
                    { pct: 33.3, label: `${Math.round(maxSlots * 0.66)} staff` },
                    { pct: 66.6, label: `${Math.round(maxSlots * 0.33)} staff` },
                    { pct: 100, label: "0" },
                  ].map((g) => (
                    <div
                      key={g.pct}
                      className="absolute inset-x-0 border-t border-dashed border-slate-200/80 dark:border-slate-800 flex items-center justify-end"
                      style={{ top: `${g.pct}%` }}
                    >
                      <span className="text-[10px] text-slate-400 tabular-nums -mt-4 pr-1">
                        {g.label}
                      </span>
                    </div>
                  ))}
                </div>

            {/* 7 Day Column Tracks */}
            <div className="relative grid grid-cols-7 gap-2 sm:gap-6 pr-8">
              {dailyLoad.map((d: any, i: number) => {
                const isSelected = i === selectedDayIdx;
                const isToday = d.isToday;
                return (
                  <button
                    key={d.day}
                    type="button"
                    onClick={() => setSelectedDayIdx(i)}
                    aria-pressed={isSelected}
                    aria-label={`${d.fullDate}: ${d.totalStaff} staff, ${d.hours} hours`}
                    className="group flex flex-col items-center gap-3.5 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[#2F5BFF]/50 cursor-pointer"
                  >
                    {/* Stacked Vertical Bar */}
                    <div className="flex h-56 w-full max-w-[48px] flex-col-reverse gap-0.5 rounded-t-xl overflow-hidden bg-slate-100/50 dark:bg-slate-800/20 p-1">
                      {SHIFT_TYPES.map((s) => (
                        <div
                          key={s.key}
                          className={`w-full rounded-md transition-all duration-200 ${s.bar} ${
                            isSelected ? "opacity-100 scale-x-105 shadow-xs" : "opacity-40 group-hover:opacity-75"
                          }`}
                          style={{ height: `${(d[s.key] / maxSlots) * 100}%` }}
                          title={`${s.name}: ${d[s.key]} staff`}
                        />
                      ))}
                    </div>

                    {/* Day Pill Button */}
                    <div
                      className={`flex w-full flex-col items-center rounded-2xl px-1.5 py-2 transition-all ${
                        isSelected
                          ? "bg-[#2F2C59] text-white dark:bg-indigo-600 shadow-sm"
                          : "text-slate-600 group-hover:bg-slate-100 dark:text-slate-400 dark:group-hover:bg-slate-800"
                      }`}
                    >
                      <span className="text-[11px] font-medium">{d.day}</span>
                      <span className="text-sm font-semibold tabular-nums mt-0.5">{d.dayNum}</span>
                    </div>

                    {/* Indicator dots & staff count */}
                    <div className="flex flex-col items-center -mt-1.5 gap-1">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isToday ? "bg-[#FF7A59]" : "bg-transparent"
                        }`}
                        aria-hidden
                      />
                      <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 tabular-nums">
                        {d.totalStaff} staff
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Integrated Selected-Day Inspection Panel */}
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/40 p-4 sm:p-5 border border-slate-100 dark:border-slate-800/80 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {activeDay.fullDate} · {activeDay.totalStaff} {lang === "vi" ? "nhân sự trực ca" : "staff on duty"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {activeDay.hours}h {lang === "vi" ? "tổng giờ vận hành · Trưởng ca phụ trách:" : "operational hours · Lead supervisor:"} <strong className="font-semibold text-slate-800 dark:text-slate-200">{activeDay.supervisor}</strong>
                </p>
              </div>

              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                activeDay.isToday
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                  : "bg-blue-50 text-[#2F5BFF] dark:bg-blue-950/50 dark:text-blue-300"
              }`}>
                {activeDay.isToday ? "Live today" : "Scheduled"}
              </span>
            </div>

            {/* 3 Shift Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {SHIFT_TYPES.map((s) => {
                const Icon = s.icon;
                const staffCount = activeDay[s.key];
                return (
                  <div key={s.key} className={`rounded-2xl p-4 border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`h-8 w-8 rounded-xl ${s.soft} flex items-center justify-center shrink-0`}>
                          <Icon className={`h-4 w-4 ${s.text}`} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-900 dark:text-white">
                            {lang === "vi" ? s.nameVi : s.name}
                          </p>
                          <p className="text-[11px] tabular-nums text-slate-500 dark:text-slate-400">
                            {s.time}
                          </p>
                        </div>
                      </div>
                      <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold tabular-nums text-slate-700 dark:text-slate-200">
                        {staffCount} staff
                      </span>
                    </div>

                    <TimeTrack start={s.start} end={s.end} barClass={s.bar} />
                  </div>
                );
              })}
            </div>
          </div>
          </>
          )}
        </section>

        {/* ================= 4. SUPPORTING VISUALIZATIONS (12-COL SPLIT) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* LEFT: LABOR ALLOCATION BY ROLE (5 COLS) */}
          <section
            aria-label="Department labor breakdown"
            className={`${CARD} p-6 lg:col-span-5 space-y-5`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                  {lang === "vi" ? "Phân bổ theo vai trò" : "Labor allocation by role"}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {lang === "vi" ? "Tỷ lệ giờ làm việc theo bộ phận" : "Weekly operational hours by department"}
                </p>
              </div>
              <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold tabular-nums text-slate-600 dark:text-slate-300">
                {scheduledHoursStats.total}h total
              </span>
            </div>

            {roleAllocation.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-6 text-center text-xs text-slate-400">
                {lang === "vi" ? "Chưa có dữ liệu phân bổ vai trò cho kỳ này." : "No role allocation data for this period."}
              </div>
            ) : (
              <>
                {/* Segmented Multi-Color Track */}
                <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex gap-0.5">
                  {roleAllocation.map((ra: any) => (
                    <div
                      key={ra.role}
                      style={{ width: `${ra.percentage}%` }}
                      className={`h-full ${ra.color}`}
                      title={`${ra.role}: ${ra.percentage}%`}
                    />
                  ))}
                </div>

                {/* Department Breakdown List */}
                <div className="space-y-3.5 pt-1">
                  {roleAllocation.map((ra: any) => (
                    <div key={ra.role} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-2 font-medium text-slate-800 dark:text-slate-200">
                          <span className={`h-2.5 w-2.5 rounded-full ${ra.color}`} />
                          <span>{ra.role}</span>
                          <span className="text-[11px] text-slate-400 font-normal">({ra.staffCount} staff)</span>
                        </span>
                        <span className="text-slate-700 dark:text-slate-300 tabular-nums font-semibold">
                          {ra.hours}h <span className="text-slate-400 font-normal">({ra.percentage}%)</span>
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${ra.color} rounded-full`}
                          style={{ width: `${ra.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>{lang === "vi" ? `Tổng nhân sự: ${staffWorkload.length} nhân viên` : `Staff pool: ${staffWorkload.length} personnel`}</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {scheduledHoursStats.total > 0 ? `${scheduledHoursStats.utilizationPercent}% capacity` : "0% capacity"}
              </span>
            </div>
          </section>

          {/* RIGHT: WEEKLY STAFF WORKLOAD DISTRIBUTION (7 COLS) */}
          <section
            aria-label="Staff workload distribution"
            className={`${CARD} p-6 lg:col-span-7 space-y-4`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                  {lang === "vi" ? "Định mức giờ theo nhân sự" : "Weekly staff workload"}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {lang === "vi"
                    ? "Giờ làm việc so với trần 40.0h tiêu chuẩn & giới hạn luật định 48.0h"
                    : "Workload against 40.0h standard ceiling and 48.0h statutory overtime limit"}
                </p>
              </div>

              {/* Filter Pills */}
              <div className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 p-1 text-xs font-medium gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setWorkloadFilter("all")}
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${
                    workloadFilter === "all"
                      ? "bg-[#2F2C59] text-white dark:bg-indigo-600 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  All ({staffWorkload.length})
                </button>
                <button
                  type="button"
                  onClick={() => setWorkloadFilter("cap")}
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${
                    workloadFilter === "cap"
                      ? "bg-[#2F2C59] text-white dark:bg-indigo-600 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  At 40h cap ({atCapCount})
                </button>
                <button
                  type="button"
                  onClick={() => setWorkloadFilter("under")}
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${
                    workloadFilter === "under"
                      ? "bg-[#2F2C59] text-white dark:bg-indigo-600 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Under cap ({underCapCount})
                </button>
              </div>
            </div>

            {/* Employee Workload Ledger with Threshold Progress Bars */}
            <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
              {filteredStaff.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-8 text-center text-xs text-slate-400">
                  {lang === "vi" ? "Chưa có dữ liệu phân bổ ca của nhân viên trong kỳ này." : "No staff workload assignments recorded for this period."}
                </div>
              ) : (
                filteredStaff.map((sw: any) => {
                const pct = (sw.hours / 40) * 100;
                const isAtCap = sw.hours >= 40;
                return (
                  <div
                    key={sw.name}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 transition hover:border-slate-200 dark:hover:border-slate-700 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#2F2C59] dark:bg-indigo-600 text-white font-semibold text-xs shrink-0">
                          {sw.initial}
                        </div>
                        <div className="min-w-0">
                          <span className="font-semibold text-slate-900 dark:text-white truncate block">
                            {sw.name}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate block">
                            {sw.role}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                          {sw.hours}.0h <span className="text-slate-400 font-normal">/ 40h</span>
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                            isAtCap
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                              : "bg-blue-50 text-[#2F5BFF] dark:bg-blue-950/60 dark:text-blue-300"
                          }`}
                        >
                          {isAtCap ? "Standard cap reached" : `-${40 - sw.hours}h remaining`}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar with 40h limit visualization */}
                    <div className="relative h-2 w-full bg-slate-200/70 dark:bg-slate-700/60 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isAtCap ? "bg-emerald-500" : "bg-[#2F5BFF]"
                        }`}
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>

            {/* Footer Directory Link */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">
                {lang === "vi" ? "Hiển thị nhân sự ca chính" : "Showing active staff records"}
              </span>
              <Link
                href="/dashboard/employees"
                className="inline-flex items-center gap-1 font-semibold text-[#2F2C59] hover:text-indigo-600 dark:text-indigo-300 transition"
              >
                <span>{lang === "vi" ? "Xem toàn bộ hồ sơ nhân sự" : "View staff directory"}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </section>

        </div>

      </div>
    </DashboardLayout>
  );
}
