"use client";

import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import { EmployeeProfile } from "./types";

interface EmployeeCardsProps {
  employees: EmployeeProfile[];
  searchTerm: string;
  onToggleStatus: (id: string) => void;
  onEditEmployee: (employee: EmployeeProfile) => void;
  onDeleteEmployee: (id: string) => void;
  pagination?: React.ReactNode;
}

export function EmployeeCards({
  employees,
  searchTerm,
  onToggleStatus,
  onEditEmployee,
  onDeleteEmployee,
  pagination,
}: EmployeeCardsProps) {
  return (
    <div className="space-y-4">
      {employees.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {employees.map((emp) => {
            const initial = emp.name.charAt(0);

            return (
              <div
                key={emp.id}
                className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs hover:shadow-xs transition space-y-3.5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2F2C59] dark:bg-indigo-600 text-white font-extrabold text-sm shadow-2xs">
                      {initial}
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-slate-900 dark:text-white">
                        {emp.name}
                      </h3>
                      <span className="font-mono text-[10px] text-slate-400">
                        {emp.id} &bull; {emp.employmentType}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleStatus(emp.id)}
                    className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold cursor-pointer ${
                      emp.status === "Active"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                        : "bg-amber-50 text-amber-700 border border-amber-200/60"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        emp.status === "Active" ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                    />
                    <span>{emp.status}</span>
                  </button>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span className="text-[11px]">Primary Role:</span>
                    <strong className="text-slate-800 dark:text-slate-200">
                      {emp.role}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span className="text-[11px]">Weekly Target:</span>
                    <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                      {emp.scheduledHours}h / {emp.targetHours}h
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span className="text-[11px]">Branch:</span>
                    <span className="text-[11px] truncate max-w-[150px]">
                      {emp.location.split(" (")[0]}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {emp.skills.slice(0, 2).map((s, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => onEditEmployee(emp)}
                      className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                      title="Edit employee"
                      aria-label={`Edit ${emp.name}`}
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteEmployee(emp.id)}
                      className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                      title="Delete"
                      aria-label={`Delete ${emp.name}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 py-12 text-center text-xs text-slate-400 shadow-2xs">
          {searchTerm
            ? `No employees found matching "${searchTerm}".`
            : "No employees available."}
        </div>
      )}

      {pagination && (
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          {pagination}
        </div>
      )}
    </div>
  );
}
