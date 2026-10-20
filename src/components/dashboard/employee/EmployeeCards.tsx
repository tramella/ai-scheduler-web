"use client";

import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import { EmployeeProfile } from "./types";
import { StatusChip } from "@/components/ui/StatusChip";
import { UserAvatar } from "@/components/ui/UserAvatar";

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
            return (
              <div
                key={emp.id}
                className="rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:border-slate-300 dark:hover:border-slate-700 transition space-y-3.5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <UserAvatar
                      src={emp.avatar_url}
                      name={emp.name}
                      size="md"
                      shape="rounded"
                      className="shrink-0"
                    />
                    <div>
                      <h3 className="font-semibold text-xs text-slate-900 dark:text-white">
                        {emp.name}
                      </h3>
                      <span className="tabular-nums text-[11px] text-slate-400">
                        {emp.id} &bull; {emp.employmentType}
                      </span>
                    </div>
                  </div>

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
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span className="text-[11px]">Primary role:</span>
                    <strong className="font-semibold text-slate-900 dark:text-slate-200">
                      {emp.role}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span className="text-[11px]">Weekly target:</span>
                    <span className="tabular-nums text-xs font-semibold text-slate-800 dark:text-slate-200">
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
                        className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center space-x-1">
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
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center text-xs text-slate-400 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          {searchTerm
            ? `No employees found matching "${searchTerm}".`
            : "No employees available."}
        </div>
      )}

      {pagination && (
        <div className="rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          {pagination}
        </div>
      )}
    </div>
  );
}
