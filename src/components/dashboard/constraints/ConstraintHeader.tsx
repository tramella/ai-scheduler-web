"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";

interface ConstraintHeaderProps {
  hardCount: number;
  softCount: number;
  totalActive: number;
  onAddConstraint: () => void;
}

export function ConstraintHeader({
  hardCount,
  softCount,
  totalActive,
  onAddConstraint,
}: ConstraintHeaderProps) {
  return (
    <PageHeader
      eyebrow={`Engine governance • ${totalActive} active rules (${hardCount} hard, ${softCount} soft)`}
      title="Scheduling constraints"
      description="Regulatory compliance thresholds and operational fairness rules for the solver"
      actions={
        <>
          <Link
            href="/dashboard/ai-studio"
            className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 px-3.5 py-2 text-xs font-semibold transition"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
            <span>Test in AI Studio</span>
          </Link>

          <button
            type="button"
            onClick={onAddConstraint}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#2F2C59] hover:bg-[#1E1B3A] dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white px-4 py-2 text-xs font-semibold transition shadow-xs active:scale-[0.99] cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add constraint</span>
          </button>
        </>
      }
    />
  );
}
