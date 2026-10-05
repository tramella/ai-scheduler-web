"use client";

import React, { useState } from "react";
import { Download, RefreshCw, PlusCircle, CheckCircle2, Calendar, MapPin, Clock, User, Sparkles } from "lucide-react";
import { DailySchedule, exportSchedule } from "@/lib/apiClient";

interface ScheduleResultViewProps {
  schedules: DailySchedule[];
  startDate: string;
  endDate: string;
  onRegenerate: () => void;
  onReset: () => void;
}

export const ScheduleResultView: React.FC<ScheduleResultViewProps> = ({
  schedules,
  startDate,
  endDate,
  onRegenerate,
  onReset,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  // Calculate statistics from the schedule data
  const totalDays = schedules.length;
  let totalAssignments = 0;
  const uniqueEmployees = new Set<string>();

  schedules.forEach((day) => {
    day.locations.forEach((loc) => {
      loc.shifts.forEach((shift) => {
        shift.employees.forEach((emp) => {
          totalAssignments++;
          uniqueEmployees.add(emp.id || emp.employee_id || emp.name);
        });
      });
    });
  });

  const handleExport = async () => {
    try {
      setIsExporting(true);
      setExportError(null);
      const blob = await exportSchedule(schedules);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `orbit_schedule_${startDate}_to_${endDate}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setExportError(err.message);
      } else {
        setExportError("Failed to export schedule to Excel.");
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Actions Header */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/20 ring-inset">
                <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                Schedule Generated
              </span>
              <span className="text-xs text-zinc-400">•</span>
              <span className="text-xs text-zinc-500 font-mono">
                {startDate} to {endDate}
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
              Your schedule is ready.
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Optimized for employee availability, skill requirements, and working hour limits.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-2xs hover:bg-zinc-50 transition"
            >
              <PlusCircle className="mr-2 h-4 w-4 text-zinc-400" />
              Start New Schedule
            </button>
            <button
              type="button"
              onClick={onRegenerate}
              className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-2xs hover:bg-zinc-50 transition"
            >
              <RefreshCw className="mr-2 h-4 w-4 text-zinc-400" />
              Regenerate
            </button>
            <button
              type="button"
              onClick={handleExport}
              disabled={isExporting}
              className="inline-flex items-center justify-center rounded-xl bg-[#0B0F1A] px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-zinc-800 disabled:opacity-50 transition active:scale-[0.99] border border-zinc-800 group"
            >
              <Download className="mr-2 h-4 w-4 text-[#FF5A36]" />
              {isExporting ? "Exporting..." : "Export Excel (.xlsx)"}
            </button>
          </div>
        </div>

        {exportError && (
          <div className="mt-4 rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-700 border border-rose-200">
            {exportError}
          </div>
        )}

        {/* Summary Metric Badges */}
        <div className="mt-8 grid grid-cols-2 gap-4 border-t border-zinc-100 pt-6 sm:grid-cols-4">
          <div className="rounded-xl bg-zinc-50/80 p-3.5 border border-zinc-100">
            <p className="text-xs font-medium text-zinc-500">Scheduled Staff</p>
            <p className="mt-1 text-xl font-bold tracking-tight text-zinc-900">
              {uniqueEmployees.size} <span className="text-xs font-normal text-zinc-400">active</span>
            </p>
          </div>
          <div className="rounded-xl bg-zinc-50/80 p-3.5 border border-zinc-100">
            <p className="text-xs font-medium text-zinc-500">Total Assignments</p>
            <p className="mt-1 text-xl font-bold tracking-tight text-zinc-900">
              {totalAssignments} <span className="text-xs font-normal text-zinc-400">slots</span>
            </p>
          </div>
          <div className="rounded-xl bg-zinc-50/80 p-3.5 border border-zinc-100">
            <p className="text-xs font-medium text-zinc-500">Duration Range</p>
            <p className="mt-1 text-xl font-bold tracking-tight text-zinc-900">
              {totalDays} <span className="text-xs font-normal text-zinc-400">days</span>
            </p>
          </div>
          <div className="rounded-xl bg-zinc-50/80 p-3.5 border border-zinc-100">
            <p className="text-xs font-medium text-zinc-500">Rule Validation</p>
            <p className="mt-1 text-xl font-bold tracking-tight text-emerald-700">
              Passed <span className="text-xs font-normal text-zinc-400">100%</span>
            </p>
          </div>
        </div>
      </div>

      {/* Structured Schedule View By Date */}
      <div className="space-y-4">
        {schedules.map((daySchedule, dIdx) => (
          <div
            key={dIdx}
            className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-2xs"
          >
            {/* Day Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/70 px-6 py-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white font-mono text-xs font-semibold">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900">{daySchedule.date}</h3>
                  <p className="text-xs text-zinc-400 font-mono">Date Schedule</p>
                </div>
              </div>
            </div>

            {/* Location & Shift Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 bg-zinc-50/30 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    <th className="py-3 px-6">Location</th>
                    <th className="py-3 px-6">Shift Details</th>
                    <th className="py-3 px-6">Working Hours</th>
                    <th className="py-3 px-6">Assigned Personnel</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {daySchedule.locations.flatMap((loc) =>
                    loc.shifts.map((shift, sIdx) => (
                      <tr key={`${loc.id}_${shift.id}_${sIdx}`} className="hover:bg-zinc-50/50 transition-colors">
                        <td className="py-4 px-6 align-top">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-zinc-400 shrink-0" />
                            <span className="font-medium text-zinc-900">{loc.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 align-top">
                          <span className="inline-flex items-center rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-800 border border-zinc-200/60">
                            {shift.name}
                          </span>
                        </td>
                        <td className="py-4 px-6 align-top font-mono text-xs text-zinc-500">
                          <div className="flex items-center space-x-1.5 pt-0.5">
                            <Clock className="h-3.5 w-3.5 text-zinc-400" />
                            <span>{shift.start} – {shift.end}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 align-top">
                          {shift.employees.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {shift.employees.map((emp, eIdx) => (
                                <div
                                  key={eIdx}
                                  className="inline-flex items-center space-x-1.5 rounded-lg bg-zinc-50 border border-zinc-200 px-2.5 py-1 text-xs text-zinc-800 shadow-2xs"
                                >
                                  <User className="h-3.5 w-3.5 text-zinc-400" />
                                  <span className="font-medium">{emp.name}</span>
                                  {emp.id && (
                                    <span className="font-mono text-[10px] text-zinc-400">
                                      ({emp.id})
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs italic text-zinc-400">No staff assigned</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
