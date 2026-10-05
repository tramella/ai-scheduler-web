"use client";

import React, { useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  Clock,
  User,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Zap,
  SlidersHorizontal
} from "lucide-react";
import Link from "next/link";

interface Scenario {
  id: string;
  title: string;
  badge: string;
  prompt: string;
  stats: { employees: number; shifts: number; hours: number; ruleCompliance: string };
  rows: {
    name: string;
    role: string;
    shifts: { day: string; time: string; station: string; active: boolean }[];
    total: number;
  }[];
}

export const InteractivePlayground: React.FC = () => {
  const scenarios: Scenario[] = [
    {
      id: "retail",
      title: "Retail Weekend Rush",
      badge: "Skill Matching",
      prompt: "Prioritize senior cashiers for Saturday & Sunday morning peak. Ensure at least 1 supervisor on duty during closing.",
      stats: { employees: 4, shifts: 14, hours: 112, ruleCompliance: "100% Passed" },
      rows: [
        {
          name: "Anna Vance",
          role: "Lead Cashier",
          shifts: [
            { day: "Mon", time: "08:00–16:00", station: "Front Register", active: true },
            { day: "Tue", time: "08:00–16:00", station: "Front Register", active: true },
            { day: "Wed", time: "OFF", station: "Rest Day", active: false },
            { day: "Sat", time: "08:00–16:00", station: "Rush Cashier", active: true },
            { day: "Sun", time: "08:00–16:00", station: "Rush Cashier", active: true },
          ],
          total: 32,
        },
        {
          name: "David Kim",
          role: "Shift Supervisor",
          shifts: [
            { day: "Mon", time: "OFF", station: "Rest Day", active: false },
            { day: "Tue", time: "14:00–22:00", station: "Store Closing", active: true },
            { day: "Wed", time: "14:00–22:00", station: "Store Closing", active: true },
            { day: "Sat", time: "14:00–22:00", station: "Weekend Supervisor", active: true },
            { day: "Sun", time: "14:00–22:00", station: "Weekend Supervisor", active: true },
          ],
          total: 32,
        },
        {
          name: "Michael Chen",
          role: "Inventory & Floor",
          shifts: [
            { day: "Mon", time: "09:00–17:00", station: "Aisle Stocking", active: true },
            { day: "Tue", time: "OFF", station: "Rest Day", active: false },
            { day: "Wed", time: "09:00–17:00", station: "Aisle Stocking", active: true },
            { day: "Sat", time: "09:00–17:00", station: "Floor Support", active: true },
            { day: "Sun", time: "OFF", station: "Rest Day", active: false },
          ],
          total: 24,
        },
        {
          name: "Sarah Miller",
          role: "Customer Service",
          shifts: [
            { day: "Mon", time: "10:00–18:00", station: "Help Desk", active: true },
            { day: "Tue", time: "10:00–18:00", station: "Help Desk", active: true },
            { day: "Wed", time: "OFF", station: "Rest Day", active: false },
            { day: "Sat", time: "10:00–18:00", station: "Help Desk", active: true },
            { day: "Sun", time: "10:00–18:00", station: "Help Desk", active: true },
          ],
          total: 32,
        },
      ],
    },
    {
      id: "fairness",
      title: "Fair Workload Balance",
      badge: "Anti-Burnout",
      prompt: "Equally distribute shifts across all part-time staff. Cap weekly hours at 28h per employee and avoid consecutive evening shifts.",
      stats: { employees: 4, shifts: 12, hours: 96, ruleCompliance: "100% Passed" },
      rows: [
        {
          name: "Anna Vance",
          role: "Service Staff",
          shifts: [
            { day: "Mon", time: "08:00–14:00", station: "Morning Shift", active: true },
            { day: "Tue", time: "OFF", station: "Rest Day", active: false },
            { day: "Wed", time: "08:00–14:00", station: "Morning Shift", active: true },
            { day: "Sat", time: "08:00–14:00", station: "Morning Shift", active: true },
            { day: "Sun", time: "08:00–14:00", station: "Morning Shift", active: true },
          ],
          total: 24,
        },
        {
          name: "David Kim",
          role: "Service Staff",
          shifts: [
            { day: "Mon", time: "14:00–20:00", station: "Afternoon Shift", active: true },
            { day: "Tue", time: "14:00–20:00", station: "Afternoon Shift", active: true },
            { day: "Wed", time: "OFF", station: "Rest Day", active: false },
            { day: "Sat", time: "14:00–20:00", station: "Afternoon Shift", active: true },
            { day: "Sun", time: "OFF", station: "Rest Day", active: false },
          ],
          total: 18,
        },
        {
          name: "Michael Chen",
          role: "Service Staff",
          shifts: [
            { day: "Mon", time: "OFF", station: "Rest Day", active: false },
            { day: "Tue", time: "08:00–14:00", station: "Morning Shift", active: true },
            { day: "Wed", time: "14:00–20:00", station: "Afternoon Shift", active: true },
            { day: "Sat", time: "OFF", station: "Rest Day", active: false },
            { day: "Sun", time: "14:00–20:00", station: "Afternoon Shift", active: true },
          ],
          total: 18,
        },
        {
          name: "Sarah Miller",
          role: "Service Staff",
          shifts: [
            { day: "Mon", time: "14:00–20:00", station: "Afternoon Shift", active: true },
            { day: "Tue", time: "OFF", station: "Rest Day", active: false },
            { day: "Wed", time: "08:00–14:00", station: "Morning Shift", active: true },
            { day: "Sat", time: "14:00–20:00", station: "Afternoon Shift", active: true },
            { day: "Sun", time: "08:00–14:00", station: "Morning Shift", active: true },
          ],
          total: 24,
        },
      ],
    },
    {
      id: "night",
      title: "Night Rest Intervals",
      badge: "Labor Compliance",
      prompt: "Ensure mandatory 14-hour rest interval between evening closing shifts and morning opening shifts. Strictly 0 double-bookings.",
      stats: { employees: 4, shifts: 13, hours: 104, ruleCompliance: "100% Passed" },
      rows: [
        {
          name: "David Kim",
          role: "Night Lead",
          shifts: [
            { day: "Mon", time: "16:00–00:00", station: "Night Closing", active: true },
            { day: "Tue", time: "OFF (Rest)", station: "Mandatory Rest", active: false },
            { day: "Wed", time: "16:00–00:00", station: "Night Closing", active: true },
            { day: "Sat", time: "16:00–00:00", station: "Night Closing", active: true },
            { day: "Sun", time: "OFF (Rest)", station: "Mandatory Rest", active: false },
          ],
          total: 24,
        },
        {
          name: "Anna Vance",
          role: "Day Opener",
          shifts: [
            { day: "Mon", time: "07:00–15:00", station: "Morning Open", active: true },
            { day: "Tue", time: "07:00–15:00", station: "Morning Open", active: true },
            { day: "Wed", time: "07:00–15:00", station: "Morning Open", active: true },
            { day: "Sat", time: "OFF", station: "Rest Day", active: false },
            { day: "Sun", time: "07:00–15:00", station: "Morning Open", active: true },
          ],
          total: 32,
        },
        {
          name: "Michael Chen",
          role: "Swing Staff",
          shifts: [
            { day: "Mon", time: "OFF", station: "Rest Day", active: false },
            { day: "Tue", time: "16:00–00:00", station: "Night Closing", active: true },
            { day: "Wed", time: "OFF (Rest)", station: "Mandatory Rest", active: false },
            { day: "Sat", time: "07:00–15:00", station: "Morning Open", active: true },
            { day: "Sun", time: "16:00–00:00", station: "Night Closing", active: true },
          ],
          total: 24,
        },
        {
          name: "Sarah Miller",
          role: "Day Support",
          shifts: [
            { day: "Mon", time: "09:00–17:00", station: "Day Support", active: true },
            { day: "Tue", time: "OFF", station: "Rest Day", active: false },
            { day: "Wed", time: "09:00–17:00", station: "Day Support", active: true },
            { day: "Sat", time: "OFF", station: "Rest Day", active: false },
            { day: "Sun", time: "09:00–17:00", station: "Day Support", active: true },
          ],
          total: 24,
        },
      ],
    },
  ];

  const [activeScenario, setActiveScenario] = useState<Scenario>(scenarios[0]);
  const [animating, setAnimating] = useState(false);

  const handleSelectScenario = (sc: Scenario) => {
    if (sc.id === activeScenario.id) return;
    setAnimating(true);
    setTimeout(() => {
      setActiveScenario(sc);
      setAnimating(false);
    }, 150);
  };

  return (
    <div className="relative mx-auto max-w-5xl">
      {/* Interactive Scenario Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 px-1">
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="h-4 w-4 text-[#FF5A36]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-700 font-mono">
            Interactive Live Playground:
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-zinc-100/80 border border-zinc-200/80 shadow-2xs">
          {scenarios.map((sc) => {
            const isSelected = activeScenario.id === sc.id;
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => handleSelectScenario(sc)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                  isSelected
                    ? "bg-[#0B0F1A] text-white shadow-xs scale-100"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-white/60"
                }`}
              >
                <span>{sc.title}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-normal ${
                    isSelected ? "bg-[#FF5A36] text-white font-bold" : "bg-zinc-200/70 text-zinc-600"
                  }`}
                >
                  {sc.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Glass Simulation Canvas Card */}
      <div className="rounded-3xl border border-zinc-300/80 bg-white shadow-2xl shadow-zinc-950/10 overflow-hidden transition-all">
        {/* Terminal Header & Live Prompt Input Bar */}
        <div className="border-b border-zinc-100 bg-zinc-50/70 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start space-x-3 w-full">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-[#FF5A36] shadow-2xs mt-0.5">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="w-full">
                <div className="flex items-center justify-between text-xs text-zinc-400 font-mono mb-1">
                  <span>Natural Language Directive</span>
                  <span className="flex items-center text-emerald-600 font-semibold">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Validated in 0.18s
                  </span>
                </div>
                <div className="rounded-xl border border-zinc-200 bg-white p-2.5 sm:p-3 text-xs sm:text-sm font-medium text-zinc-800 shadow-2xs font-sans">
                  &ldquo;{activeScenario.prompt}&rdquo;
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Grid Schedule Simulation View */}
        <div className={`overflow-x-auto transition-opacity duration-200 ${animating ? "opacity-30" : "opacity-100"}`}>
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/40 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                <th className="py-3 px-4 sm:px-6">Employee</th>
                <th className="py-3 px-2 text-center">Mon</th>
                <th className="py-3 px-2 text-center">Tue</th>
                <th className="py-3 px-2 text-center">Wed</th>
                <th className="py-3 px-2 text-center">Sat</th>
                <th className="py-3 px-2 text-center">Sun</th>
                <th className="py-3 px-4 text-right">Weekly Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {activeScenario.rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-zinc-50/60 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6">
                    <div>
                      <p className="font-bold text-zinc-900">{row.name}</p>
                      <p className="text-xs text-zinc-400">{row.role}</p>
                    </div>
                  </td>
                  {row.shifts.map((shift, sIdx) => (
                    <td key={sIdx} className="py-3 px-1.5 text-center">
                      {shift.active ? (
                        <div className="inline-flex flex-col items-center justify-center rounded-xl bg-zinc-100/90 border border-zinc-200/80 px-2.5 py-1.5 shadow-2xs hover:border-zinc-300 transition">
                          <span className="font-mono text-[11px] font-bold text-zinc-900 leading-tight">
                            {shift.time}
                          </span>
                          <span className="text-[10px] text-[#FF5A36] font-semibold leading-tight">
                            {shift.station}
                          </span>
                        </div>
                      ) : (
                        <div className="inline-flex flex-col items-center justify-center rounded-lg bg-zinc-50 border border-zinc-100 px-2 py-1 text-zinc-400 font-mono text-[11px]">
                          <span>OFF</span>
                          <span className="text-[9px] text-zinc-400/80">{shift.station}</span>
                        </div>
                      )}
                    </td>
                  ))}
                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center font-mono text-xs font-bold text-zinc-800 bg-zinc-100 px-2.5 py-1 rounded-lg border border-zinc-200/60">
                      <Clock className="mr-1 h-3 w-3 text-zinc-500" />
                      {row.total}h
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Strip: Metric Stats & Action CTA */}
        <div className="border-t border-zinc-100 bg-zinc-50/70 p-4 sm:px-6 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-4 text-zinc-600">
            <span className="flex items-center">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2"></span>
              Rule Engine: <strong className="ml-1 text-emerald-700 font-bold">{activeScenario.stats.ruleCompliance}</strong>
            </span>
            <span className="text-zinc-300">•</span>
            <span>
              Assignments: <strong className="text-zinc-900 font-semibold">{activeScenario.stats.shifts} shifts</strong>
            </span>
            <span className="text-zinc-300">•</span>
            <span>
              Total Hours: <strong className="text-zinc-900 font-semibold">{activeScenario.stats.hours} hrs</strong>
            </span>
          </div>

          <Link
            href="/product"
            className="inline-flex items-center justify-center rounded-xl bg-[#0B0F1A] px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 transition active:scale-[0.99] border border-zinc-800 group"
          >
            <span>Create Custom Schedule in Copilot</span>
            <ArrowRight className="ml-1.5 h-3.5 w-3.5 text-[#FF5A36] group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
