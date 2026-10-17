"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Sun,
  Sunset,
  Moon,
  CheckCircle2,
  Filter,
  X,
  Users,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageHeader } from "@/components/ui/PageHeader";

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

const CARD =
  "rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_1px_2px_rgba(15,23,42,0.04)]";

interface ShiftAssignment {
  id: string;
  name: string;
  role: string;
  avatar: string;
  isLead?: boolean;
}

interface CalendarShift {
  id: string;
  shiftType: "morning" | "afternoon" | "night";
  name: string;
  time: string;
  requiredStaff: number;
  staff: ShiftAssignment[];
}

interface DaySchedule {
  dayName: string;
  dateStr: string;
  dayNum: number;
  isToday: boolean;
  shifts: {
    morning: CalendarShift;
    afternoon: CalendarShift;
    night: CalendarShift;
  };
}

import { fetchCalendarScheduleApi } from "@/lib/apiClient";

export default function CalendarPage() {
  const [viewMode, setViewMode] = useState<"week" | "month">("week");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [weekOffset, setWeekOffset] = useState(0);
  const [inspectShift, setInspectShift] = useState<{
    day: DaySchedule;
    shift: CalendarShift;
  } | null>(null);

  const [calendarData, setCalendarData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    async function loadCalendar() {
      try {
        setIsLoading(true);
        const res = await fetchCalendarScheduleApi({ weekOffset });
        if (res.data) {
          setCalendarData(res.data);
          const tIdx = res.data.weekData?.findIndex((d: any) => d.isToday);
          if (tIdx !== -1 && typeof tIdx === "number") {
            setSelectedDayIndex(tIdx);
          }
        }
      } catch (err) {
        console.warn("Failed to load calendar schedule:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCalendar();
  }, [weekOffset]);

  const rawWeek: DaySchedule[] = calendarData?.weekData || [];
  const roles: string[] = calendarData?.roles?.length > 0 ? ["all", ...calendarData.roles] : ["all", "Supervisor", "Barista", "Cashier", "Kitchen Assistant"];

  const filteredWeek = useMemo(() => {
    if (selectedRole === "all") return rawWeek;
    return rawWeek.map((day) => ({
      ...day,
      shifts: {
        morning: {
          ...day.shifts.morning,
          staff: day.shifts.morning.staff.filter((s) => s.role === selectedRole),
        },
        afternoon: {
          ...day.shifts.afternoon,
          staff: day.shifts.afternoon.staff.filter((s) => s.role === selectedRole),
        },
        night: {
          ...day.shifts.night,
          staff: day.shifts.night.staff.filter((s) => s.role === selectedRole),
        },
      },
    }));
  }, [selectedRole, rawWeek]);

  const activeMobileDay = filteredWeek[selectedDayIndex] || filteredWeek[0];
  const weekLabel = calendarData?.weekLabel || "Current week";
  const totalStaffAssigned = calendarData?.totalStaffAssigned || 0;

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* ================= 1. CALENDAR HEADER ================= */}
        <PageHeader
          eyebrow={`Scheduled roster · ${calendarData?.periodInfo?.status || "Active"}`}
          title="Roster calendar"
          actions={
            <>
              {/* Coverage status chip */}
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {totalStaffAssigned > 0 ? `${totalStaffAssigned} assignments` : "0 shifts"}
              </span>

              {/* Week navigation pill */}
              <div className="inline-flex items-center rounded-full border border-slate-200/80 bg-white dark:bg-slate-900 dark:border-slate-800 p-1 shadow-xs">
                <button
                  type="button"
                  onClick={() => setWeekOffset((prev) => prev - 1)}
                  className="p-1 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  title="Previous week"
                  aria-label="Previous week"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="px-3 text-xs font-semibold tabular-nums text-slate-700 dark:text-slate-300">
                  {weekLabel}
                </span>
                <button
                  type="button"
                  onClick={() => setWeekOffset((prev) => prev + 1)}
                  className="p-1 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  title="Next week"
                  aria-label="Next week"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* View Mode Segmented Control */}
              <div className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 p-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setViewMode("week")}
                  className={`px-3 py-1 rounded-full transition cursor-pointer ${
                    viewMode === "week"
                      ? "bg-[#2F2C59] text-white dark:bg-indigo-600 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Week
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("month")}
                  className={`px-3 py-1 rounded-full transition cursor-pointer ${
                    viewMode === "month"
                      ? "bg-[#2F2C59] text-white dark:bg-indigo-600 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Month
                </button>
              </div>

              {/* AI Generator Action Button */}
              <Link
                href="/dashboard/ai-studio"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#2F2C59] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#1E1B3A] active:scale-[0.99] dark:bg-indigo-600 dark:hover:bg-indigo-700 cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Generate shifts</span>
              </Link>
            </>
          }
        />

        {/* ================= 2. ROLE FILTER STRIP & LEGEND ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 overflow-x-auto pb-1 text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-400 text-xs font-medium mr-1 flex items-center">
              <Filter className="h-3.5 w-3.5 mr-1" /> Role:
            </span>
            {roles.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setSelectedRole(r)}
                className={`px-3 py-1.5 rounded-full font-semibold transition cursor-pointer shrink-0 text-xs ${
                  selectedRole === r
                    ? "bg-[#2F2C59] text-white dark:bg-indigo-600 shadow-xs"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                {r === "all" ? `All roles (${totalStaffAssigned})` : r}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400 shrink-0">
            <span className="inline-flex items-center space-x-1.5">
              <span className="h-2 w-2 rounded-full bg-[#2F5BFF]"></span>
              <span>Morning (07:00 – 15:00)</span>
            </span>
            <span className="inline-flex items-center space-x-1.5">
              <span className="h-2 w-2 rounded-full bg-[#FF7A59]"></span>
              <span>Afternoon (14:30 – 22:30)</span>
            </span>
            <span className="inline-flex items-center space-x-1.5">
              <span className="h-2 w-2 rounded-full bg-[#2F2C59] dark:bg-indigo-400"></span>
              <span>Night (22:00 – 06:00)</span>
            </span>
          </div>
        </div>

        {/* ================= 3. MOBILE VIEW (< md) ================= */}
        <div className="md:hidden space-y-4">
          {/* Mobile day picker tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
            {filteredWeek.map((day, idx) => (
              <button
                key={day.dayName}
                type="button"
                onClick={() => setSelectedDayIndex(idx)}
                className={`flex-1 min-w-[50px] py-2 px-1 rounded-2xl flex flex-col items-center justify-center transition border ${
                  selectedDayIndex === idx
                    ? "bg-[#2F2C59] text-white dark:bg-indigo-600 border-transparent shadow-xs"
                    : day.isToday
                    ? "bg-indigo-50 dark:bg-indigo-950/40 text-[#2F2C59] dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
                    : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-800"
                }`}
              >
                <span className="text-[11px] font-medium">{day.dayName}</span>
                <span className="text-sm font-semibold tabular-nums">{day.dayNum}</span>
                {day.isToday && (
                  <span className="h-1 w-1 rounded-full bg-[#FF7A59] mt-0.5"></span>
                )}
              </button>
            ))}
          </div>

          {/* Active day header & shift stack */}
          {activeMobileDay && (
            <>
              <div className="flex items-center justify-between px-1">
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {activeMobileDay.dayName}, {activeMobileDay.dateStr}
                  {activeMobileDay.isToday && (
                    <span className="ml-2 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                      Today
                    </span>
                  )}
                </span>
            <span className="text-xs tabular-nums text-slate-500 dark:text-slate-400">
              {activeMobileDay.shifts.morning.staff.length +
                activeMobileDay.shifts.afternoon.staff.length +
                activeMobileDay.shifts.night.staff.length}{" "}
              staff assigned
            </span>
          </div>

          {(["morning", "afternoon", "night"] as const).map((sType) => {
            const shift = activeMobileDay.shifts[sType];
            const isMorning = sType === "morning";
            const isAfternoon = sType === "afternoon";
            const Icon = isMorning ? Sun : isAfternoon ? Sunset : Moon;
            const accentBorder = isMorning
              ? "border-l-[3.5px] border-l-[#2F5BFF] bg-blue-50/40 dark:bg-blue-950/20"
              : isAfternoon
              ? "border-l-[3.5px] border-l-[#FF7A59] bg-orange-50/40 dark:bg-orange-950/20"
              : "border-l-[3.5px] border-l-[#2F2C59] dark:border-l-indigo-400 bg-indigo-50/40 dark:bg-indigo-950/20";

            return (
              <div
                key={shift.id}
                onClick={() => setInspectShift({ day: activeMobileDay, shift })}
                className={`rounded-3xl border border-slate-200/70 dark:border-slate-800 p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:border-slate-300 dark:hover:border-slate-700 transition cursor-pointer ${accentBorder}`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center space-x-2">
                    <Icon
                      className={`h-4 w-4 ${
                        isMorning
                          ? "text-[#2F5BFF]"
                          : isAfternoon
                          ? "text-[#FF7A59]"
                          : "text-[#2F2C59] dark:text-indigo-400"
                      }`}
                    />
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">
                      {shift.name}
                    </span>
                  </div>
                  <span className="text-xs tabular-nums text-slate-500 dark:text-slate-400">
                    {shift.time}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {shift.staff.map((s) => (
                    <span
                      key={s.id}
                      className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        s.isLead
                          ? "bg-indigo-50 dark:bg-indigo-950/60 text-[#2F2C59] dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 font-semibold"
                          : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200/70 dark:border-slate-700/60"
                      }`}
                    >
                      <span>{s.name}</span>
                      {s.isLead && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#2F2C59] text-white dark:bg-indigo-600">
                          Lead
                        </span>
                      )}
                    </span>
                  ))}
                  {shift.staff.length === 0 && (
                    <span className="text-xs text-slate-400 italic">No staff in selected filter</span>
                  )}
                </div>
              </div>
            );
          })}
          </>
          )}
        </div>

        {/* Empty state when no schedule exists for this week */}
        {!isLoading && totalStaffAssigned === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-8 text-center bg-white dark:bg-slate-900 space-y-3">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-white">Chưa có ca làm việc nào được phân bổ trong tuần này</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Không tìm thấy phân bổ ca nào trong kỳ làm việc này. Bạn có thể sử dụng AI Studio để tạo ca tự động hoặc chọn tuần khác.
            </p>
            <div className="pt-2">
              <Link
                href="/dashboard/ai-studio"
                className="inline-flex items-center gap-2 rounded-full bg-[#2F2C59] dark:bg-indigo-600 text-white px-4 py-2 text-xs font-semibold"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Mở AI Studio</span>
              </Link>
            </div>
          </div>
        )}

        {/* ================= 4. DESKTOP FULL-WIDTH WEEK ROSTER TIMETABLE (>= md) ================= */}
        {viewMode === "week" && (
          <div className="hidden md:block rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
                    <th className="py-3.5 px-4 w-36 font-medium text-xs text-slate-500 dark:text-slate-400">
                      Shift window
                    </th>
                    {filteredWeek.map((day, dIdx) => {
                      const isSelectedDay = dIdx === selectedDayIndex;
                      return (
                        <th
                          key={day.dayName}
                          onClick={() => setSelectedDayIndex(dIdx)}
                          className={`py-3.5 px-3 text-center transition cursor-pointer hover:bg-slate-100/70 dark:hover:bg-slate-800/60 ${
                            isSelectedDay
                              ? "bg-indigo-50/70 dark:bg-indigo-950/40"
                              : day.isToday
                              ? "bg-slate-50/50 dark:bg-slate-800/20"
                              : ""
                          }`}
                        >
                          <div className="flex flex-col items-center">
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                              {day.dayName}
                            </span>
                            <span
                              className={`text-xs font-semibold tabular-nums mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full ${
                                isSelectedDay
                                  ? "bg-[#2F2C59] text-white dark:bg-indigo-600 shadow-xs"
                                  : day.isToday
                                  ? "bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                                  : "text-slate-900 dark:text-white"
                              }`}
                            >
                              {day.dayNum}
                            </span>
                            {day.isToday && (
                              <span className="h-1 w-1 rounded-full bg-[#FF7A59] mt-0.5" />
                            )}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {/* Row 1: Morning Shift */}
                  <tr>
                    <td className="py-4 px-4 align-top bg-slate-50/40 dark:bg-slate-800/20 border-r border-slate-100 dark:border-slate-800">
                      <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#2F5BFF]">
                        <Sun className="h-3.5 w-3.5 shrink-0" />
                        <span>Morning</span>
                      </div>
                      <div className="text-[11px] tabular-nums text-slate-400 mt-1">
                        07:00 – 15:00
                      </div>
                      <div className="mt-2 text-[10px] text-slate-500 dark:text-slate-400">
                        Target: 6 staff
                      </div>
                    </td>
                    {filteredWeek.map((day, dIdx) => {
                      const shift = day.shifts.morning;
                      const isSelectedDay = dIdx === selectedDayIndex;
                      return (
                        <td
                          key={day.dayName}
                          onClick={() => {
                            setSelectedDayIndex(dIdx);
                            setInspectShift({ day, shift });
                          }}
                          className={`p-2 align-top border-r last:border-r-0 border-slate-100 dark:border-slate-800 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition cursor-pointer ${
                            isSelectedDay ? "bg-indigo-50/30 dark:bg-indigo-950/20" : ""
                          }`}
                        >
                          <div className="space-y-1.5 min-h-[90px]">
                            <div className="flex items-center justify-between text-[10px] text-slate-400 pb-1 border-b border-slate-100/60 dark:border-slate-800/60">
                              <span>{shift.staff.length} assigned</span>
                            </div>
                            {shift.staff.map((s) => (
                              <div
                                key={s.id}
                                className={`flex items-center justify-between px-2 py-1 rounded-lg text-[11px] transition ${
                                  s.isLead
                                    ? "bg-blue-100/70 dark:bg-blue-950/60 text-[#2F5BFF] dark:text-blue-300 font-semibold border border-blue-200/60 dark:border-blue-900/50"
                                    : "bg-slate-50 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800"
                                }`}
                              >
                                <span className="truncate">{s.name.split(" ").slice(-1)[0]}</span>
                                {s.isLead && (
                                  <span className="text-[9px] font-semibold px-1 py-0.2 rounded bg-[#2F5BFF] text-white">
                                    Lead
                                  </span>
                                )}
                              </div>
                            ))}
                            {shift.staff.length === 0 && (
                              <div className="text-[11px] text-slate-400 italic py-2 text-center">
                                -
                              </div>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Row 2: Afternoon Shift */}
                  <tr>
                    <td className="py-4 px-4 align-top bg-slate-50/40 dark:bg-slate-800/20 border-r border-slate-100 dark:border-slate-800">
                      <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#FF7A59]">
                        <Sunset className="h-3.5 w-3.5 shrink-0" />
                        <span>Afternoon</span>
                      </div>
                      <div className="text-[11px] tabular-nums text-slate-400 mt-1">
                        14:30 – 22:30
                      </div>
                      <div className="mt-2 text-[10px] text-slate-500 dark:text-slate-400">
                        Target: 6 staff
                      </div>
                    </td>
                    {filteredWeek.map((day, dIdx) => {
                      const shift = day.shifts.afternoon;
                      const isSelectedDay = dIdx === selectedDayIndex;
                      return (
                        <td
                          key={day.dayName}
                          onClick={() => {
                            setSelectedDayIndex(dIdx);
                            setInspectShift({ day, shift });
                          }}
                          className={`p-2 align-top border-r last:border-r-0 border-slate-100 dark:border-slate-800 hover:bg-orange-50/40 dark:hover:bg-orange-950/20 transition cursor-pointer ${
                            isSelectedDay ? "bg-indigo-50/30 dark:bg-indigo-950/20" : ""
                          }`}
                        >
                          <div className="space-y-1.5 min-h-[90px]">
                            <div className="flex items-center justify-between text-[10px] text-slate-400 pb-1 border-b border-slate-100/60 dark:border-slate-800/60">
                              <span>{shift.staff.length} assigned</span>
                            </div>
                            {shift.staff.map((s) => (
                              <div
                                key={s.id}
                                className={`flex items-center justify-between px-2 py-1 rounded-lg text-[11px] transition ${
                                  s.isLead
                                    ? "bg-orange-100/70 dark:bg-orange-950/60 text-[#FF7A59] dark:text-orange-300 font-semibold border border-orange-200/60 dark:border-orange-900/50"
                                    : "bg-slate-50 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800"
                                }`}
                              >
                                <span className="truncate">{s.name.split(" ").slice(-1)[0]}</span>
                                {s.isLead && (
                                  <span className="text-[9px] font-semibold px-1 py-0.2 rounded bg-[#FF7A59] text-white">
                                    Lead
                                  </span>
                                )}
                              </div>
                            ))}
                            {shift.staff.length === 0 && (
                              <div className="text-[11px] text-slate-400 italic py-2 text-center">
                                -
                              </div>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Row 3: Night Shift */}
                  <tr>
                    <td className="py-4 px-4 align-top bg-slate-50/40 dark:bg-slate-800/20 border-r border-slate-100 dark:border-slate-800">
                      <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#2F2C59] dark:text-indigo-400">
                        <Moon className="h-3.5 w-3.5 shrink-0" />
                        <span>Night</span>
                      </div>
                      <div className="text-[11px] tabular-nums text-slate-400 mt-1">
                        22:00 – 06:00
                      </div>
                      <div className="mt-2 text-[10px] text-slate-500 dark:text-slate-400">
                        Target: 4 staff
                      </div>
                    </td>
                    {filteredWeek.map((day, dIdx) => {
                      const shift = day.shifts.night;
                      const isSelectedDay = dIdx === selectedDayIndex;
                      return (
                        <td
                          key={day.dayName}
                          onClick={() => {
                            setSelectedDayIndex(dIdx);
                            setInspectShift({ day, shift });
                          }}
                          className={`p-2 align-top border-r last:border-r-0 border-slate-100 dark:border-slate-800 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 transition cursor-pointer ${
                            isSelectedDay ? "bg-indigo-50/30 dark:bg-indigo-950/20" : ""
                          }`}
                        >
                          <div className="space-y-1.5 min-h-[90px]">
                            <div className="flex items-center justify-between text-[10px] text-slate-400 pb-1 border-b border-slate-100/60 dark:border-slate-800/60">
                              <span>{shift.staff.length} assigned</span>
                            </div>
                            {shift.staff.map((s) => (
                              <div
                                key={s.id}
                                className={`flex items-center justify-between px-2 py-1 rounded-lg text-[11px] transition ${
                                  s.isLead
                                    ? "bg-indigo-100/70 dark:bg-indigo-950/60 text-[#2F2C59] dark:text-indigo-300 font-semibold border border-indigo-200/60 dark:border-indigo-900/50"
                                    : "bg-slate-50 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800"
                                }`}
                              >
                                <span className="truncate">{s.name.split(" ").slice(-1)[0]}</span>
                                {s.isLead && (
                                  <span className="text-[9px] font-semibold px-1 py-0.2 rounded bg-[#2F2C59] dark:bg-indigo-600 text-white">
                                    Lead
                                  </span>
                                )}
                              </div>
                            ))}
                            {shift.staff.length === 0 && (
                              <div className="text-[11px] text-slate-400 italic py-2 text-center">
                                -
                              </div>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= 5. MONTH VIEW GRID ================= */}
        {viewMode === "month" && (
          <div className="rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] space-y-4">
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-100 dark:border-slate-800">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>

            <div className="grid grid-cols-7 gap-2.5">
              {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => {
                const isSelectedWeek = d >= 12 && d <= 18;
                const isToday = d === 13;
                return (
                  <div
                    key={d}
                    className={`min-h-[80px] p-2.5 rounded-2xl border transition flex flex-col justify-between ${
                      isToday
                        ? "border-[#2F2C59] dark:border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/30"
                        : isSelectedWeek
                        ? "border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30"
                        : "border-slate-100 dark:border-slate-800/60 bg-transparent opacity-60"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-semibold tabular-nums ${
                          isToday
                            ? "h-5 w-5 rounded-full bg-[#2F2C59] dark:bg-indigo-600 text-white flex items-center justify-center text-[11px]"
                            : "text-slate-800 dark:text-slate-200"
                        }`}
                      >
                        {d}
                      </span>
                      {isSelectedWeek && (
                        <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                          3 shifts
                        </span>
                      )}
                    </div>

                    {isSelectedWeek ? (
                      <div className="flex items-center space-x-1.5 mt-2">
                        <span className="h-2 w-2 rounded-full bg-[#2F5BFF]" title="Morning: 6 staff"></span>
                        <span className="h-2 w-2 rounded-full bg-[#FF7A59]" title="Afternoon: 6 staff"></span>
                        <span className="h-2 w-2 rounded-full bg-[#2F2C59] dark:bg-indigo-400" title="Night: 4 staff"></span>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-300 dark:text-slate-700">--</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= 6. SHIFT INSPECTOR MODAL ================= */}
        {inspectShift && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
              onClick={() => setInspectShift(null)}
            />

            <div className="relative z-50 w-full max-w-md rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {inspectShift.day.dayName}, {inspectShift.day.dateStr}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      Active roster
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white mt-1">
                    {inspectShift.shift.name}
                  </h3>
                  <p className="text-xs tabular-nums text-slate-500 dark:text-slate-400 mt-0.5">
                    {inspectShift.shift.time} · {inspectShift.shift.staff.length} /{" "}
                    {inspectShift.shift.requiredStaff} staff assigned
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setInspectShift(null)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#2F5BFF]/50"
                  aria-label="Close dialog"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Time track bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Shift timeline (24h)</span>
                  <span className="tabular-nums font-medium">{inspectShift.shift.time}</span>
                </div>
                <TimeTrack
                  start={
                    inspectShift.shift.shiftType === "morning"
                      ? 7
                      : inspectShift.shift.shiftType === "afternoon"
                      ? 14.5
                      : 22
                  }
                  end={
                    inspectShift.shift.shiftType === "morning"
                      ? 15
                      : inspectShift.shift.shiftType === "afternoon"
                      ? 22.5
                      : 30
                  }
                  barClass={
                    inspectShift.shift.shiftType === "morning"
                      ? "bg-[#2F5BFF]"
                      : inspectShift.shift.shiftType === "afternoon"
                      ? "bg-[#FF7A59]"
                      : "bg-[#2F2C59] dark:bg-indigo-400"
                  }
                />
              </div>

              {/* Assigned roster list */}
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Assigned personnel ({inspectShift.shift.staff.length})
                </span>
                {inspectShift.shift.staff.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-2.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#2F2C59] dark:bg-indigo-600 text-white text-xs font-semibold">
                        {s.avatar}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-900 dark:text-white">
                          {s.name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {s.role}
                        </div>
                      </div>
                    </div>

                    {s.isLead ? (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-[#2F2C59] dark:text-indigo-300">
                        Shift leader
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 tabular-nums">8.0 hrs</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Footer actions */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setInspectShift(null)}
                  className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                >
                  Close
                </button>
                <Link
                  href="/dashboard/ai-studio"
                  className="rounded-full bg-[#2F2C59] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#1E1B3A] dark:bg-indigo-600 dark:hover:bg-indigo-700 cursor-pointer"
                >
                  Adjust in AI Studio
                </Link>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
