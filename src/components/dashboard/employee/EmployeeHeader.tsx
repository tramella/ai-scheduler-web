"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Plus } from "lucide-react";

import { PageHeader } from "@/components/ui/PageHeader";

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
    <PageHeader
      eyebrow={`Staff directory · ${activeCount}/${totalCount} active personnel`}
      title="Employees"
      actions={
        <>
          <Link
            href="/dashboard/ai-studio"
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
            <span>AI scheduler</span>
          </Link>

          <button
            type="button"
            onClick={onAddEmployee}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#2F2C59] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#1E1B3A] active:scale-[0.99] dark:bg-indigo-600 dark:hover:bg-indigo-700 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add employee</span>
          </button>
        </>
      }
    />
  );
}
