"use client";

import React from "react";
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
  Building2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

export default function DashboardPage() {
  const { user, activeCompany } = useAuth();

  const weeklySchedule = [
    {
      day: "Monday",
      short: "MON",
      dayNum: "12",
      date: "Oct 12, 2026",
      shifts: 16,
      staff: 14,
      morning: 6,
      afternoon: 6,
      night: 4,
      isToday: false,
    },
    {
      day: "Tuesday",
      short: "TUE",
      dayNum: "13",
      date: "Oct 13, 2026",
      shifts: 16,
      staff: 15,
      morning: 6,
      afternoon: 6,
      night: 4,
      isToday: true,
    },
    {
      day: "Wednesday",
      short: "WED",
      dayNum: "14",
      date: "Oct 14, 2026",
      shifts: 18,
      staff: 16,
      morning: 7,
      afternoon: 7,
      night: 4,
      isToday: false,
    },
    {
      day: "Thursday",
      short: "THU",
      dayNum: "15",
      date: "Oct 15, 2026",
      shifts: 16,
      staff: 14,
      morning: 6,
      afternoon: 6,
      night: 4,
      isToday: false,
    },
    {
      day: "Friday",
      short: "FRI",
      dayNum: "16",
      date: "Oct 16, 2026",
      shifts: 20,
      staff: 18,
      morning: 8,
      afternoon: 8,
      night: 4,
      isToday: false,
    },
    {
      day: "Saturday",
      short: "SAT",
      dayNum: "17",
      date: "Oct 17, 2026",
      shifts: 22,
      staff: 20,
      morning: 9,
      afternoon: 9,
      night: 4,
      isToday: false,
    },
    {
      day: "Sunday",
      short: "SUN",
      dayNum: "18",
      date: "Oct 18, 2026",
      shifts: 14,
      staff: 12,
      morning: 5,
      afternoon: 5,
      night: 4,
      isToday: false,
    },
  ];

  const todayShifts = [
    {
      name: "Morning Shift",
      time: "07:00 – 15:00",
      supervisor: "Nguyễn Văn An",
      initial: "A",
      staffCount: 6,
      icon: Sun,
      iconColor: "text-[#2F5BFF]",
      borderLeft: "border-l-[3.5px] border-l-[#2F5BFF]",
      bg: "bg-blue-50/50 dark:bg-blue-950/20",
    },
    {
      name: "Afternoon Shift",
      time: "14:30 – 22:30",
      supervisor: "Lý Khánh Nam",
      initial: "N",
      staffCount: 6,
      icon: Sunset,
      iconColor: "text-[#FF7A59]",
      borderLeft: "border-l-[3.5px] border-l-[#FF7A59]",
      bg: "bg-orange-50/50 dark:bg-orange-950/20",
    },
    {
      name: "Night Shift",
      time: "22:00 – 06:00",
      supervisor: "Vũ Tuấn Kiệt",
      initial: "K",
      staffCount: 4,
      icon: Moon,
      iconColor: "text-[#2F2C59] dark:text-indigo-400",
      borderLeft: "border-l-[3.5px] border-l-[#2F2C59] dark:border-l-indigo-500",
      bg: "bg-indigo-50/50 dark:bg-indigo-950/20",
    },
  ];

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* ================= 1. REFINED WORKSPACE HEADER ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              Welcome back, {user?.full_name?.split(" ")[0] || "Manager"}
            </h1>
          </div>

          <div className="flex items-center space-x-2.5">
            <span className="text-xs font-mono text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 font-medium">
              Oct 12 – Oct 18, 2026
            </span>
            <Link
              href="/dashboard/ai-studio"
              className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#2F2C59] hover:bg-[#1E1B3A] dark:bg-indigo-600 dark:hover:bg-indigo-700 rounded-xl transition shadow-2xs active:scale-[0.99] cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Generate Schedule</span>
            </Link>
          </div>
        </div>

        {/* ================= 2. FOUR ELEGANT OPERATIONAL KPI BLOCKS ================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          
          {/* Block 1: Staff Pool */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-4.5 shadow-2xs hover:shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition duration-150">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Staff Pool</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50/80 dark:bg-blue-950/50 text-[#2F5BFF] border border-blue-100 dark:border-blue-900/50">
                <Users className="h-4 w-4" />
              </div>
            </div>
            
            <div className="mt-2.5 flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">28</span>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded">
                100% Active
              </span>
            </div>

            <div className="mt-3">
              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-[#2F5BFF] w-full rounded-full transition-all duration-500" />
              </div>
              <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400 truncate">
                28 / 28 personnel available
              </p>
            </div>
          </div>

          {/* Block 2: Weekly Shifts */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-4.5 shadow-2xs hover:shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition duration-150">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Weekly Shifts</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-50/80 dark:bg-orange-950/50 text-[#FF7A59] border border-orange-100 dark:border-orange-900/50">
                <CalendarCheck className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-2.5 flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">122</span>
              <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded">
                3 Ca / Day
              </span>
            </div>

            <div className="mt-3">
              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-[#FF7A59] w-full rounded-full transition-all duration-500" />
              </div>
              <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400 truncate">
                100% Demand satisfied &bull; 0 gaps
              </p>
            </div>
          </div>

          {/* Block 3: Scheduled Hours */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-4.5 shadow-2xs hover:shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition duration-150">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Hours</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-[#2F2C59] dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60">
                <Clock className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-2.5 flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">896h</span>
              <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded font-mono">
                Cap: 920h
              </span>
            </div>

            <div className="mt-3">
              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-[#2F2C59] dark:bg-indigo-500 w-[97.4%] rounded-full transition-all duration-500" />
              </div>
              <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400 truncate">
                97.4% Budget &bull; ~32.0h / staff
              </p>
            </div>
          </div>

          {/* Block 4: Rule Compliance */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-4.5 shadow-2xs hover:shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition duration-150">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Statutory Audit</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50/80 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-2.5 flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">100%</span>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded">
                Passed
              </span>
            </div>

            <div className="mt-3">
              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-full rounded-full transition-all duration-500" />
              </div>
              <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400 truncate">
                4 / 4 Rules strictly enforced
              </p>
            </div>
          </div>

        </div>

        {/* ================= 3. BEAUTIFULLY STYLED OPERATIONAL TABLE & TODAY'S ROSTER ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* LEFT: WEEKLY SCHEDULE TABLE (8 COLS) */}
          <div className="lg:col-span-8 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-2xs space-y-4">
            
            {/* Table Header Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800 gap-2">
              <div className="flex items-center space-x-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-[#2F2C59] dark:text-indigo-400">
                  <CalendarDays className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    Weekly Schedule Operations
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Week 42 &bull; Oct 12 – Oct 18, 2026
                  </p>
                </div>
              </div>

              <Link
                href="/dashboard/ai-studio"
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#2F2C59] dark:text-indigo-400 hover:text-indigo-600 transition self-start sm:self-auto"
              >
                <span>Open Calendar Canvas</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Aesthetic Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                    <th className="py-2.5 px-3">Day &amp; Date</th>
                    <th className="py-2.5 px-3">Shift Composition</th>
                    <th className="py-2.5 px-3 text-center">Assignments</th>
                    <th className="py-2.5 px-3 text-center">Staffing</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {weeklySchedule.map((row) => (
                    <tr
                      key={row.day}
                      className={`group transition-colors ${
                        row.isToday
                          ? "bg-indigo-50/50 dark:bg-indigo-950/30"
                          : "hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                      }`}
                    >
                      
                      {/* Day & Date with Visual Badge */}
                      <td className="py-2.5 px-3">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`h-9 w-9 rounded-xl flex flex-col items-center justify-center shrink-0 transition shadow-2xs ${
                              row.isToday
                                ? "bg-[#2F2C59] dark:bg-indigo-600 text-white"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 group-hover:bg-slate-200/70"
                            }`}
                          >
                            <span className="text-[8px] uppercase tracking-wider font-extrabold leading-none">
                              {row.short}
                            </span>
                            <span className="text-xs font-black mt-0.5 leading-none">
                              {row.dayNum}
                            </span>
                          </div>

                          <div>
                            <div className="flex items-center space-x-1.5">
                              <span className="font-bold text-xs text-slate-900 dark:text-white">
                                {row.day}
                              </span>
                              {row.isToday && (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-indigo-100 dark:bg-indigo-900/60 text-[#2F2C59] dark:text-indigo-300">
                                  Today
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] font-mono text-slate-400">
                              {row.date}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Shift Composition Badges */}
                      <td className="py-2.5 px-3">
                        <div className="flex items-center space-x-1.5 text-[10px] font-medium">
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-[#2F5BFF] border border-blue-200/50 dark:border-blue-800/40 font-semibold">
                            <Sun className="h-2.5 w-2.5 shrink-0" />
                            <span>{row.morning}</span>
                          </span>
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-orange-50 dark:bg-orange-950/40 text-[#FF7A59] border border-orange-200/50 dark:border-orange-800/40 font-semibold">
                            <Sunset className="h-2.5 w-2.5 shrink-0" />
                            <span>{row.afternoon}</span>
                          </span>
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-[#2F2C59] dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/40 font-semibold">
                            <Moon className="h-2.5 w-2.5 shrink-0" />
                            <span>{row.night}</span>
                          </span>
                        </div>
                      </td>

                      {/* Assignments */}
                      <td className="py-2.5 px-3 text-center">
                        <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200/50 dark:border-slate-700/50">
                          {row.shifts} shifts
                        </span>
                      </td>

                      {/* Staffing */}
                      <td className="py-2.5 px-3 text-center font-medium text-slate-700 dark:text-slate-300">
                        <span className="inline-flex items-center space-x-1 font-mono text-xs">
                          <Users className="h-3 w-3 text-slate-400" />
                          <span>{row.staff}</span>
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-2.5 px-3 text-right">
                        <span className="inline-flex items-center space-x-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/70 dark:border-emerald-800/60 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                          <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                          <span>100% Covered</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT: TODAY'S ACTIVE OPERATIONS (4 COLS) */}
          <div className="lg:col-span-4 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-2xs space-y-4">
            
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Today&apos;s Shifts
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  Tue, Oct 13 &bull; 16 Staff On Duty
                </p>
              </div>

              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                Live Now
              </span>
            </div>

            {/* Shift Cards */}
            <div className="space-y-2.5">
              {todayShifts.map((shift) => {
                const IconComponent = shift.icon;
                return (
                  <div
                    key={shift.name}
                    className={`rounded-xl border p-3 shadow-2xs transition hover:shadow-xs ${shift.bg} ${shift.borderLeft}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5 font-extrabold text-xs text-slate-900 dark:text-white">
                        <IconComponent className={`h-3.5 w-3.5 ${shift.iconColor}`} />
                        <span>{shift.name}</span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                        {shift.time}
                      </span>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-1.5 min-w-0">
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#2F2C59] text-white text-[9px] font-bold">
                          {shift.initial}
                        </div>
                        <span className="text-[11px] text-slate-600 dark:text-slate-400 truncate">
                          Lead: <strong className="text-slate-800 dark:text-slate-200">{shift.supervisor}</strong>
                        </span>
                      </div>
                      
                      <span className="font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300 bg-white/80 dark:bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-200/60 dark:border-slate-700/60 shrink-0">
                        {shift.staffCount} staff
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <Link
                href="/dashboard/ai-studio"
                className="w-full inline-flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition cursor-pointer"
              >
                <span>Edit Shifts in AI Studio</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
