"use client";

import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import { EmployeeProfile } from "./types";

interface EmployeeTableProps {
  employees: EmployeeProfile[];
  searchTerm: string;
  onToggleStatus: (id: string) => void;
  onEditEmployee: (employee: EmployeeProfile) => void;
  onDeleteEmployee: (id: string) => void;
  pagination?: React.ReactNode;
}

export function EmployeeTable({
  employees,
  searchTerm,
  onToggleStatus,
  onEditEmployee,
  onDeleteEmployee,
  pagination,
}: EmployeeTableProps) {
  return (
    <div className="rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-bold tracking-wider">
              <th className="py-3 px-4">Employee</th>
              <th className="py-3 px-3">Role &amp; Skills</th>
              <th className="py-3 px-3">Contract</th>
              <th className="py-3 px-3">Weekly Target</th>
              <th className="py-3 px-3">Store Location</th>
              <th className="py-3 px-3 text-center">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
            {employees.length > 0 ? (
              employees.map((emp) => {
                const initial = emp.name.charAt(0);
                const isFull = emp.scheduledHours >= emp.targetHours;

                return (
                  <tr
                    key={emp.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition group"
                  >
                    {/* Col 1: Employee Identity */}
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#2F2C59] dark:bg-indigo-600 text-white font-extrabold text-xs shadow-2xs shrink-0">
                          {initial}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                            {emp.name}
                          </div>
                          <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 mt-0.5">
                            <span className="font-mono text-[9px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded font-bold text-slate-600 dark:text-slate-300">
                              {emp.id}
                            </span>
                            <span className="truncate">{emp.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Col 2: Role & Skills */}
                    <td className="py-3 px-3">
                      <div>
                        <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                          {emp.role}
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {emp.skills.slice(0, 2).map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                            >
                              {skill}
                            </span>
                          ))}
                          {emp.skills.length > 2 && (
                            <span className="text-[9px] text-slate-400 self-center">
                              +{emp.skills.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Col 3: Contract */}
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                          emp.employmentType === "Full-time"
                            ? "bg-indigo-50 dark:bg-indigo-950/60 text-[#2F2C59] dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {emp.employmentType}
                      </span>
                    </td>

                    {/* Col 4: Weekly Target Hours & Progress */}
                    <td className="py-3 px-3">
                      <div className="w-28 space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            {emp.scheduledHours}h
                          </span>
                          <span className="text-slate-400">/{emp.targetHours}h</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              isFull ? "bg-emerald-500 w-full" : "bg-indigo-500 w-3/4"
                            }`}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Col 5: Location */}
                    <td className="py-3 px-3">
                      <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 truncate block max-w-[160px]">
                        {emp.location.split(" (")[0]}
                      </span>
                    </td>

                    {/* Col 6: Status */}
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => onToggleStatus(emp.id)}
                        className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold cursor-pointer transition ${
                          emp.status === "Active"
                            ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60"
                            : emp.status === "On Leave"
                            ? "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200/60 dark:border-slate-700/60"
                        }`}
                        title="Click to toggle status"
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            emp.status === "Active"
                              ? "bg-emerald-500"
                              : emp.status === "On Leave"
                              ? "bg-amber-500"
                              : "bg-slate-400"
                          }`}
                        />
                        <span>{emp.status}</span>
                      </button>
                    </td>

                    {/* Col 7: Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          type="button"
                          onClick={() => onEditEmployee(emp)}
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                          title="Edit employee"
                          aria-label={`Edit ${emp.name}`}
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteEmployee(emp.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                          title="Delete employee"
                          aria-label={`Delete ${emp.name}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="py-12 text-center text-xs text-slate-400">
                  {searchTerm
                    ? `No employees found matching "${searchTerm}".`
                    : "No employees available."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          {pagination}
        </div>
      )}
    </div>
  );
}
