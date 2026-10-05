import React from "react";
import { DailySchedule } from "@/lib/apiClient";

interface ScheduleTableProps {
  schedules: DailySchedule[];
}

export const ScheduleTable: React.FC<ScheduleTableProps> = ({ schedules }) => {
  if (!schedules || schedules.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
        No schedule assignments found.
      </div>
    );
  }

  // Flatten for simple, clean table rendering
  const rows: {
    date: string;
    locationName: string;
    shiftName: string;
    startTime: string;
    endTime: string;
    empId: string;
    empName: string;
    jobTitle?: string;
  }[] = [];

  schedules.forEach((day) => {
    day.locations.forEach((loc) => {
      loc.shifts.forEach((shift) => {
        shift.employees.forEach((emp) => {
          rows.push({
            date: day.date,
            locationName: loc.name || loc.code || loc.id,
            shiftName: shift.name,
            startTime: shift.start,
            endTime: shift.end,
            empId: emp.id || emp.employee_id || "N/A",
            empName: emp.name || "Unknown",
            jobTitle: emp.job_title
          });
        });
      });
    });
  });

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              <th scope="col" className="px-6 py-3">Date</th>
              <th scope="col" className="px-6 py-3">Location</th>
              <th scope="col" className="px-6 py-3">Shift</th>
              <th scope="col" className="px-6 py-3">Time</th>
              <th scope="col" className="px-6 py-3">Employee ID</th>
              <th scope="col" className="px-6 py-3">Employee Name</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-900">{row.date}</td>
                <td className="whitespace-nowrap px-6 py-4 text-slate-600">{row.locationName}</td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-700/10 ring-inset">
                    {row.shiftName}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-slate-500">
                  {row.startTime} - {row.endTime}
                </td>
                <td className="whitespace-nowrap px-6 py-4 font-mono text-xs text-slate-500">{row.empId}</td>
                <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-900">
                  {row.empName}
                  {row.jobTitle && (
                    <span className="ml-2 text-xs text-slate-400 font-normal">({row.jobTitle})</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
