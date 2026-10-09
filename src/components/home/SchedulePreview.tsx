import React from "react";
import { CheckCircle2, Clock, Sparkles } from "lucide-react";

export const SchedulePreview: React.FC = () => {
  const scheduleRows = [
    {
      name: "Anna Vance",
      role: "Lead Cashier",
      skills: ["Cashier", "Customer Service"],
      shifts: [
        { day: "Mon", time: "08:00–16:00", type: "Morning", status: "assigned" },
        { day: "Tue", time: "08:00–16:00", type: "Morning", status: "assigned" },
        { day: "Wed", time: "OFF", type: "Off", status: "off" },
        { day: "Thu", time: "08:00–16:00", type: "Morning", status: "assigned" },
        { day: "Fri", time: "08:00–16:00", type: "Morning", status: "assigned" },
      ],
      totalHours: 32,
    },
    {
      name: "Michael Chen",
      role: "Floor Staff",
      skills: ["Inventory", "Stocking"],
      shifts: [
        { day: "Mon", time: "09:00–17:00", type: "Day", status: "assigned" },
        { day: "Tue", time: "OFF", type: "Off", status: "off" },
        { day: "Wed", time: "09:00–17:00", type: "Day", status: "assigned" },
        { day: "Thu", time: "09:00–17:00", type: "Day", status: "assigned" },
        { day: "Fri", time: "OFF", type: "Off", status: "off" },
      ],
      totalHours: 24,
    },
    {
      name: "Sarah Miller",
      role: "Supervisor",
      skills: ["Management", "Closing"],
      shifts: [
        { day: "Mon", time: "OFF", type: "Off", status: "off" },
        { day: "Tue", time: "14:00–22:00", type: "Evening", status: "assigned" },
        { day: "Wed", time: "14:00–22:00", type: "Evening", status: "assigned" },
        { day: "Thu", time: "OFF", type: "Off", status: "off" },
        { day: "Fri", time: "14:00–22:00", type: "Evening", status: "assigned" },
      ],
      totalHours: 24,
    },
    {
      name: "David Kim",
      role: "Security & Clean",
      skills: ["Security", "Maintenance"],
      shifts: [
        { day: "Mon", time: "08:00–16:00", type: "Morning", status: "assigned" },
        { day: "Tue", time: "08:00–16:00", type: "Morning", status: "assigned" },
        { day: "Wed", time: "08:00–16:00", type: "Morning", status: "assigned" },
        { day: "Thu", time: "08:00–16:00", type: "Morning", status: "assigned" },
        { day: "Fri", time: "OFF", type: "Off", status: "off" },
      ],
      totalHours: 32,
    },
  ];

  return (
    <div className="relative mx-auto max-w-5xl rounded-3xl border border-slate-200/90 bg-white shadow-xl shadow-slate-950/5 overflow-hidden">
      {/* Top Window Bar */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-3 sm:px-6">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-[#FF7A59]"></div>
            <div className="h-2.5 w-2.5 rounded-full bg-[#2F5BFF]"></div>
            <div className="h-2.5 w-2.5 rounded-full bg-[#2F2C59]"></div>
          </div>
          <span className="text-xs font-mono font-medium text-slate-400 pl-2">
            orbit_schedule_oct_week1.xlsx
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-600/20 ring-inset">
            <CheckCircle2 className="mr-1 h-3 w-3 text-emerald-600" />
            Validated (0 Conflicts)
          </div>
          <span className="hidden sm:inline-flex items-center text-xs text-slate-500 font-medium">
            <Sparkles className="mr-1 h-3 w-3 text-[#FF7A59]" />
            AI Optimized
          </span>
        </div>
      </div>

      {/* Schedule Table / Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th className="py-3 px-4 sm:px-6">Employee</th>
              <th className="py-3 px-3 text-center">Mon</th>
              <th className="py-3 px-3 text-center">Tue</th>
              <th className="py-3 px-3 text-center">Wed</th>
              <th className="py-3 px-3 text-center">Thu</th>
              <th className="py-3 px-3 text-center">Fri</th>
              <th className="py-3 px-4 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {scheduleRows.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3.5 px-4 sm:px-6">
                  <div>
                    <p className="font-bold text-slate-900">{row.name}</p>
                    <p className="text-xs text-slate-400">{row.role}</p>
                  </div>
                </td>
                {row.shifts.map((shift, sIdx) => (
                  <td key={sIdx} className="py-3.5 px-2 text-center">
                    {shift.status === "assigned" ? (
                      <div className="inline-block rounded-xl bg-slate-100 px-2.5 py-1 text-xs font-mono font-medium text-slate-800 border border-slate-200/70 shadow-2xs hover:border-[#2F5BFF]/30 transition">
                        {shift.time}
                      </div>
                    ) : (
                      <span className="text-xs font-mono text-slate-300">
                        OFF
                      </span>
                    )}
                  </td>
                ))}
                <td className="py-3.5 px-4 text-right">
                  <span className="inline-flex items-center font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/60">
                    <Clock className="mr-1 h-3 w-3 text-slate-400" />
                    {row.totalHours}h
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom Summary Strip */}
      <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
        <div className="flex items-center space-x-4">
          <span>
            Scheduled: <strong className="font-semibold text-slate-800">4 Employees</strong>
          </span>
          <span>•</span>
          <span>
            Total Shifts: <strong className="font-semibold text-slate-800">14 Shifts</strong>
          </span>
          <span>•</span>
          <span>
            Total Time: <strong className="font-semibold text-slate-800">112 Hours</strong>
          </span>
        </div>
        <div className="text-slate-500 font-mono text-[11px]">
          Deterministic Rule Engine: Passed 100%
        </div>
      </div>
    </div>
  );
};
