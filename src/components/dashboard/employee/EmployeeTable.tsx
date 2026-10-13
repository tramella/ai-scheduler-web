"use client";

import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import { EmployeeProfile } from "./types";
import { StatusChip } from "@/components/ui/StatusChip";

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
    <div className="rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 text-xs font-medium">
              <th className="py-3 px-4">Employee</th>
              <th className="py-3 px-3">Role &amp; skills</th>
              <th className="py-3 px-3">Contract</th>
              <th className="py-3 px-3">Weekly target</th>
              <th className="py-3 px-3">Store location</th>
              <th className="py-3 px-3 text-center">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
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
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#2F2C59] dark:bg-indigo-600 text-white font-semibold text-xs shadow-xs shrink-0">
                          {initial}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                            {emp.name}
                          </div>
                          <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 mt-0.5">
                            <span className="tabular-nums bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">
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
                        <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                          {emp.role}
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {emp.skills.slice(0, 2).map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                            >
                              {skill}
                            </span>
                          ))}
                          {emp.skills.length > 2 && (
                            <span className="text-[10px] text-slate-400 self-center tabular-nums">
                              +{emp.skills.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Col 3: Contract */}
                    <td className="py-3 px-3">
                      <StatusChip
                        variant={emp.employmentType === "Full-time" ? "info" : "neutral"}
                      >
                        {emp.employmentType}
                      </StatusChip>
                    </td>

                    {/* Col 4: Weekly Target Hours & Progress */}
                    <td className="py-3 px-3">
                      <div className="w-28 space-y-1">
                        <div className="flex items-center justify-between text-[11px] tabular-nums">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {emp.scheduledHours}h
                          </span>
                          <span className="text-slate-400">/{emp.targetHours}h</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              isFull ? "bg-emerald-500 w-full" : "bg-[#2F5BFF] w-3/4"
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
                        className="cursor-pointer transition outline-none focus-visible:ring-2 focus-visible:ring-[#2F5BFF]/50 rounded-full"
                        title="Toggle status"
                      >
                        <StatusChip
                          variant={
                            emp.status === "Active"
                              ? "success"
                              : emp.status === "On Leave"
                              ? "warning"
                              : "neutral"
                          }
                          pulse={emp.status === "Active"}
                        >
                          {emp.status}
                        </StatusChip>
                      </button>
                    </td>

                    {/* Col 7: Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          type="button"
                          onClick={() => onEditEmployee(emp)}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                          title="Edit employee"
                          aria-label={`Edit ${emp.name}`}
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteEmployee(emp.id)}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
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
