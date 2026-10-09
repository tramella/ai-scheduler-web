"use client";

import React, { useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sun,
  Sunset,
  Moon,
  Users,
  ShieldCheck,
  Check,
} from "lucide-react";
import Link from "next/link";

interface ShiftData {
  day: string;
  type: "morning" | "afternoon" | "night" | "off";
  time: string;
  station: string;
}

interface StaffRow {
  id: string;
  name: string;
  role: string;
  avatar: string;
  shifts: ShiftData[];
  totalHours: number;
  totalShifts: number;
}

interface Scenario {
  id: string;
  title: string;
  prompt: string;
  stats: {
    staffCount: number;
    totalShifts: number;
    totalHours: number;
    auditStatus: string;
    solverSpeed: string;
  };
  rows: StaffRow[];
}

export const InteractivePlayground: React.FC = () => {
  const scenarios: Scenario[] = [
    {
      id: "retail",
      title: "Weekend Supervision",
      prompt: "Ensure at least 1 certified supervisor on closing shifts and balance peak weekend slots.",
      stats: {
        staffCount: 4,
        totalShifts: 14,
        totalHours: 112,
        auditStatus: "100% Verified",
        solverSpeed: "0.14s",
      },
      rows: [
        {
          id: "NV001",
          name: "Anna Vance",
          role: "Shift Supervisor",
          avatar: "AV",
          shifts: [
            { day: "Mon", type: "morning", time: "07:00–15:00", station: "Front Register" },
            { day: "Tue", type: "morning", time: "07:00–15:00", station: "Front Register" },
            { day: "Wed", type: "off", time: "OFF", station: "Rest Day" },
            { day: "Sat", type: "morning", time: "07:00–15:00", station: "Rush Lead" },
            { day: "Sun", type: "morning", time: "07:00–15:00", station: "Rush Lead" },
          ],
          totalHours: 32,
          totalShifts: 4,
        },
        {
          id: "NV002",
          name: "David Kim",
          role: "Senior Barista",
          avatar: "DK",
          shifts: [
            { day: "Mon", type: "off", time: "OFF", station: "Rest Day" },
            { day: "Tue", type: "afternoon", time: "14:30–22:30", station: "Closing Lead" },
            { day: "Wed", type: "afternoon", time: "14:30–22:30", station: "Closing Lead" },
            { day: "Sat", type: "afternoon", time: "14:30–22:30", station: "Supervisor" },
            { day: "Sun", type: "afternoon", time: "14:30–22:30", station: "Supervisor" },
          ],
          totalHours: 32,
          totalShifts: 4,
        },
        {
          id: "NV003",
          name: "Michael Chen",
          role: "Cashier",
          avatar: "MC",
          shifts: [
            { day: "Mon", type: "morning", time: "07:00–15:00", station: "Order Station" },
            { day: "Tue", type: "off", time: "OFF", station: "Rest Day" },
            { day: "Wed", type: "morning", time: "07:00–15:00", station: "Order Station" },
            { day: "Sat", type: "afternoon", time: "14:30–22:30", station: "Support" },
            { day: "Sun", type: "off", time: "OFF", station: "Rest Day" },
          ],
          totalHours: 24,
          totalShifts: 3,
        },
        {
          id: "NV004",
          name: "Sarah Miller",
          role: "Kitchen Assistant",
          avatar: "SM",
          shifts: [
            { day: "Mon", type: "afternoon", time: "14:30–22:30", station: "Kitchen Line" },
            { day: "Tue", type: "afternoon", time: "14:30–22:30", station: "Kitchen Line" },
            { day: "Wed", type: "off", time: "OFF", station: "Rest Day" },
            { day: "Sat", type: "morning", time: "07:00–15:00", station: "Kitchen Line" },
            { day: "Sun", type: "morning", time: "07:00–15:00", station: "Kitchen Line" },
          ],
          totalHours: 32,
          totalShifts: 4,
        },
      ],
    },
    {
      id: "fairness",
      title: "Fair Workload Balance",
      prompt: "Cap weekly workload at 24 hours per staff member and evenly rotate weekend shifts.",
      stats: {
        staffCount: 4,
        totalShifts: 12,
        totalHours: 96,
        auditStatus: "100% Verified",
        solverSpeed: "0.12s",
      },
      rows: [
        {
          id: "NV001",
          name: "Anna Vance",
          role: "Service Staff",
          avatar: "AV",
          shifts: [
            { day: "Mon", type: "morning", time: "07:00–15:00", station: "Morning Open" },
            { day: "Tue", type: "off", time: "OFF", station: "Rest Day" },
            { day: "Wed", type: "morning", time: "07:00–15:00", station: "Morning Open" },
            { day: "Sat", type: "morning", time: "07:00–15:00", station: "Rush Shift" },
            { day: "Sun", type: "off", time: "OFF", station: "Rest Day" },
          ],
          totalHours: 24,
          totalShifts: 3,
        },
        {
          id: "NV002",
          name: "David Kim",
          role: "Service Staff",
          avatar: "DK",
          shifts: [
            { day: "Mon", type: "afternoon", time: "14:30–22:30", station: "Afternoon" },
            { day: "Tue", type: "afternoon", time: "14:30–22:30", station: "Afternoon" },
            { day: "Wed", type: "off", time: "OFF", station: "Rest Day" },
            { day: "Sat", type: "off", time: "OFF", station: "Rest Day" },
            { day: "Sun", type: "afternoon", time: "14:30–22:30", station: "Afternoon" },
          ],
          totalHours: 24,
          totalShifts: 3,
        },
        {
          id: "NV003",
          name: "Michael Chen",
          role: "Service Staff",
          avatar: "MC",
          shifts: [
            { day: "Mon", type: "off", time: "OFF", station: "Rest Day" },
            { day: "Tue", type: "morning", time: "07:00–15:00", station: "Morning" },
            { day: "Wed", type: "afternoon", time: "14:30–22:30", station: "Afternoon" },
            { day: "Sat", type: "afternoon", time: "14:30–22:30", station: "Afternoon" },
            { day: "Sun", type: "off", time: "OFF", station: "Rest Day" },
          ],
          totalHours: 24,
          totalShifts: 3,
        },
        {
          id: "NV004",
          name: "Sarah Miller",
          role: "Service Staff",
          avatar: "SM",
          shifts: [
            { day: "Mon", type: "morning", time: "07:00–15:00", station: "Morning" },
            { day: "Tue", type: "off", time: "OFF", station: "Rest Day" },
            { day: "Wed", type: "morning", time: "07:00–15:00", station: "Morning" },
            { day: "Sat", type: "off", time: "OFF", station: "Rest Day" },
            { day: "Sun", type: "morning", time: "07:00–15:00", station: "Morning" },
          ],
          totalHours: 24,
          totalShifts: 3,
        },
      ],
    },
    {
      id: "rest",
      title: "14h Rest Compliance",
      prompt: "Enforce 14h minimum rest between closing and opening duties with zero double-bookings.",
      stats: {
        staffCount: 4,
        totalShifts: 13,
        totalHours: 104,
        auditStatus: "100% Verified",
        solverSpeed: "0.15s",
      },
      rows: [
        {
          id: "NV001",
          name: "David Kim",
          role: "Night Lead",
          avatar: "DK",
          shifts: [
            { day: "Mon", type: "night", time: "22:00–06:00", station: "Night Closing" },
            { day: "Tue", type: "off", time: "OFF", station: "14h Rest" },
            { day: "Wed", type: "night", time: "22:00–06:00", station: "Night Closing" },
            { day: "Sat", type: "night", time: "22:00–06:00", station: "Night Closing" },
            { day: "Sun", type: "off", time: "OFF", station: "14h Rest" },
          ],
          totalHours: 24,
          totalShifts: 3,
        },
        {
          id: "NV002",
          name: "Anna Vance",
          role: "Day Opener",
          avatar: "AV",
          shifts: [
            { day: "Mon", type: "morning", time: "07:00–15:00", station: "Morning Open" },
            { day: "Tue", type: "morning", time: "07:00–15:00", station: "Morning Open" },
            { day: "Wed", type: "morning", time: "07:00–15:00", station: "Morning Open" },
            { day: "Sat", type: "off", time: "OFF", station: "Rest Day" },
            { day: "Sun", type: "morning", time: "07:00–15:00", station: "Morning Open" },
          ],
          totalHours: 32,
          totalShifts: 4,
        },
        {
          id: "NV003",
          name: "Michael Chen",
          role: "Swing Staff",
          avatar: "MC",
          shifts: [
            { day: "Mon", type: "off", time: "OFF", station: "Rest Day" },
            { day: "Tue", type: "afternoon", time: "14:30–22:30", station: "Afternoon" },
            { day: "Wed", type: "off", time: "OFF", station: "14h Rest" },
            { day: "Sat", type: "morning", time: "07:00–15:00", station: "Morning Open" },
            { day: "Sun", type: "afternoon", time: "14:30–22:30", station: "Afternoon" },
          ],
          totalHours: 24,
          totalShifts: 3,
        },
        {
          id: "NV004",
          name: "Sarah Miller",
          role: "Support",
          avatar: "SM",
          shifts: [
            { day: "Mon", type: "morning", time: "07:00–15:00", station: "Support" },
            { day: "Tue", type: "off", time: "OFF", station: "Rest Day" },
            { day: "Wed", type: "morning", time: "07:00–15:00", station: "Support" },
            { day: "Sat", type: "off", time: "OFF", station: "Rest Day" },
            { day: "Sun", type: "morning", time: "07:00–15:00", station: "Support" },
          ],
          totalHours: 24,
          totalShifts: 3,
        },
      ],
    },
  ];

  const [activeScenario, setActiveScenario] = useState<Scenario>(scenarios[0]);

  const getShiftCard = (shift: ShiftData) => {
    if (shift.type === "off") {
      return (
        <div className="flex h-12 w-full items-center justify-center rounded-xl bg-slate-50/70 border border-dashed border-slate-200/80 text-slate-400 font-mono text-xs">
          <span>—</span>
        </div>
      );
    }

    if (shift.type === "morning") {
      return (
        <div className="flex h-12 w-full flex-col justify-center rounded-xl bg-blue-50/70 border border-blue-200/80 border-l-[3.5px] border-l-[#2F5BFF] px-2.5 py-1 shadow-2xs">
          <div className="flex items-center space-x-1">
            <Sun className="h-3 w-3 text-[#2F5BFF] shrink-0" />
            <span className="font-mono text-[11px] font-bold text-slate-900 leading-tight">
              {shift.time}
            </span>
          </div>
          <span className="text-[10px] font-medium text-slate-600 truncate mt-0.5">
            {shift.station}
          </span>
        </div>
      );
    }

    if (shift.type === "afternoon") {
      return (
        <div className="flex h-12 w-full flex-col justify-center rounded-xl bg-orange-50/70 border border-orange-200/80 border-l-[3.5px] border-l-[#FF7A59] px-2.5 py-1 shadow-2xs">
          <div className="flex items-center space-x-1">
            <Sunset className="h-3 w-3 text-[#FF7A59] shrink-0" />
            <span className="font-mono text-[11px] font-bold text-slate-900 leading-tight">
              {shift.time}
            </span>
          </div>
          <span className="text-[10px] font-medium text-slate-600 truncate mt-0.5">
            {shift.station}
          </span>
        </div>
      );
    }

    return (
      <div className="flex h-12 w-full flex-col justify-center rounded-xl bg-indigo-50/70 border border-indigo-200/80 border-l-[3.5px] border-l-[#2F2C59] px-2.5 py-1 shadow-2xs">
        <div className="flex items-center space-x-1">
          <Moon className="h-3 w-3 text-[#2F2C59] shrink-0" />
          <span className="font-mono text-[11px] font-bold text-slate-900 leading-tight">
            {shift.time}
          </span>
        </div>
        <span className="text-[10px] font-medium text-slate-600 truncate mt-0.5">
          {shift.station}
        </span>
      </div>
    );
  };

  return (
    <div className="relative mx-auto max-w-5xl">
      {/* Container matching Schedule Result View */}
      <div className="rounded-3xl border border-slate-200/90 bg-white shadow-xl shadow-slate-900/[0.04] overflow-hidden">
        
        {/* Top Header Bar: Status Badge, Title, Date Range & Scenario Pills */}
        <div className="p-4 sm:p-6 border-b border-slate-100 bg-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200/80">
                  <span className="relative flex h-2 w-2 mr-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Schedule Generated & Verified
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-mono font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                  2026-10-01 → 2026-10-05
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#2F2C59]">
                Workforce Roster Matrix
              </h2>
            </div>

            {/* Scenario Pills Selector */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200/80 shrink-0">
              {scenarios.map((sc) => {
                const isSelected = activeScenario.id === sc.id;
                return (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => setActiveScenario(sc)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                      isSelected
                        ? "bg-white text-slate-950 shadow-xs font-bold"
                        : "text-slate-600 hover:text-slate-950"
                    }`}
                  >
                    <span>{sc.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Directive Notice */}
          <div className="mt-4 rounded-xl border border-slate-200/80 bg-slate-50/70 px-3.5 py-2 text-xs text-slate-700 flex items-center justify-between">
            <div className="flex items-center space-x-2 truncate">
              <span className="font-semibold text-slate-900">Constraint:</span>
              <span className="truncate">&ldquo;{activeScenario.prompt}&rdquo;</span>
            </div>
            <span className="hidden sm:inline-flex items-center text-[#2F5BFF] font-semibold text-[11px] font-mono shrink-0 ml-2">
              <Check className="h-3.5 w-3.5 mr-1 stroke-[3]" />
              Audited in {activeScenario.stats.solverSpeed}
            </span>
          </div>
        </div>

        {/* Schedule Matrix Table - No Vertical Scrollbar */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-600">
                <th className="py-3 px-4 sm:px-6 w-[200px]">Staff Member</th>
                <th className="py-3 px-2 text-center w-[100px]">Mon</th>
                <th className="py-3 px-2 text-center w-[100px]">Tue</th>
                <th className="py-3 px-2 text-center w-[100px]">Wed</th>
                <th className="py-3 px-2 text-center w-[100px]">Sat</th>
                <th className="py-3 px-2 text-center w-[100px]">Sun</th>
                <th className="py-3 px-4 sm:px-6 text-right w-[120px]">Weekly Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {activeScenario.rows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                  
                  {/* Staff Member Column - 1 Unified Color Theme (#2F2C59) */}
                  <td className="py-3.5 px-4 sm:px-6">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-[#2F2C59] text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                        {row.avatar}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 truncate leading-tight">
                          {row.name}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {row.role}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Shift Columns: Mon, Tue, Wed, Sat, Sun */}
                  {row.shifts.map((shift, sIdx) => (
                    <td key={sIdx} className="py-2.5 px-1.5 text-center">
                      {getShiftCard(shift)}
                    </td>
                  ))}

                  {/* Weekly Total Column */}
                  <td className="py-3.5 px-4 sm:px-6 text-right">
                    <div className="inline-flex items-center font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200/60">
                      <Clock className="mr-1.5 h-3.5 w-3.5 text-slate-500" />
                      <span>{row.totalHours} hrs</span>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Solver Telemetry Bar */}
        <div className="border-t border-slate-100 bg-slate-50/80 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-4 text-slate-600 font-mono text-[11px]">
            <span className="flex items-center">
              <span className="flex h-2 w-2 rounded-full bg-[#2F5BFF] mr-2"></span>
              Audit: <strong className="ml-1 text-[#2F2C59]">{activeScenario.stats.auditStatus}</strong>
            </span>
            <span className="text-slate-300">•</span>
            <span>
              Total Shifts: <strong className="text-slate-900">{activeScenario.stats.totalShifts}</strong>
            </span>
            <span className="text-slate-300">•</span>
            <span>
              Total Hours: <strong className="text-slate-900">{activeScenario.stats.totalHours} hrs</strong>
            </span>
          </div>

          <Link
            href="/product"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#2F5BFF] hover:text-[#1E1B3A] transition"
          >
            <span>Run with your store roster</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
};
