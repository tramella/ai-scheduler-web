"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Plus } from "lucide-react";

interface EmployeeHeaderProps {
  activeCount: number;
  totalCount: number;
  onAddEmployee: () => void;
}

export function EmployeeHeader({
  activeCount,
  totalCount,
  onAddEmployee,
}: EmployeeHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3.5 pb-4 border-b border-slate-200/80 dark:border-slate-800">
      <div>
        <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Staff Directory
          </span>
          <span>&bull;</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
            {activeCount}/{totalCount} Active Personnel
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
          Employees &amp; Roles
        </h1>
      </div>

      <div className="flex items-center space-x-2.5">
        <Link
          href="/dashboard/ai-studio"
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs transition active:scale-[0.99] cursor-pointer"
        >
          <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
          <span>AI Scheduler</span>
        </Link>

        <button
          type="button"
          onClick={onAddEmployee}
          className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#2F2C59] hover:bg-[#1E1B3A] dark:bg-indigo-600 dark:hover:bg-indigo-700 rounded-xl transition shadow-2xs active:scale-[0.99] cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Employee</span>
        </button>
      </div>
    </div>
  );
}
