"use client";

import React from "react";
import { ShieldCheck, Sliders, Edit2, Trash2 } from "lucide-react";
import { ConstraintRule, CATEGORY_LABELS } from "./types";

interface ConstraintTableProps {
  constraints: ConstraintRule[];
  searchTerm: string;
  onToggleStatus: (id: string) => void;
  onEditConstraint: (rule: ConstraintRule) => void;
  onDeleteConstraint: (id: string) => void;
  pagination?: React.ReactNode;
}

export function ConstraintTable({
  constraints,
  searchTerm,
  onToggleStatus,
  onEditConstraint,
  onDeleteConstraint,
  pagination,
}: ConstraintTableProps) {
  return (
    <div className="rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-medium">
              <th className="py-3 px-4 font-medium">Rule and specification</th>
              <th className="py-3 px-3 font-medium">Enforcement type</th>
              <th className="py-3 px-3 font-medium">Category</th>
              <th className="py-3 px-3 font-medium">Parameter value</th>
              <th className="py-3 px-3 font-medium">Target scope</th>
              <th className="py-3 px-3 text-center font-medium">Status</th>
              <th className="py-3 px-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {constraints.length > 0 ? (
              constraints.map((rule) => {
                const isHard = rule.type === "hard";

                return (
                  <tr
                    key={rule.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition group"
                  >
                    {/* Col 1: Code & Name */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 tabular-nums">
                            {rule.code}
                          </span>
                          <span className="font-semibold text-xs text-slate-900 dark:text-white">
                            {rule.name}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                          {rule.description}
                        </p>
                      </div>
                    </td>

                    {/* Col 2: Enforcement Type & Weight */}
                    <td className="py-3.5 px-3">
                      {isHard ? (
                        <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>Hard (Strict)</span>
                        </div>
                      ) : (
                        <div className="space-y-1 w-28">
                          <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-[#2F5BFF] dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50">
                            <Sliders className="h-3 w-3 text-[#2F5BFF]" />
                            <span>Soft (W: {rule.weight})</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#2F5BFF] rounded-full"
                              style={{ width: `${rule.weight}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Col 3: Category */}
                    <td className="py-3.5 px-3">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {CATEGORY_LABELS[rule.category]}
                      </span>
                    </td>

                    {/* Col 4: Parameter Threshold */}
                    <td className="py-3.5 px-3">
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                        {rule.threshold}{" "}
                        <span className="text-[11px] font-normal text-slate-500">{rule.unit}</span>
                      </span>
                    </td>

                    {/* Col 5: Scope */}
                    <td className="py-3.5 px-3">
                      <span className="text-xs text-slate-600 dark:text-slate-400 font-medium truncate block max-w-[130px]">
                        {rule.scope}
                      </span>
                    </td>

                    {/* Col 6: Status Toggle */}
                    <td className="py-3.5 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => onToggleStatus(rule.id)}
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold cursor-pointer transition ${
                          rule.status === "Active"
                            ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200/60 dark:border-slate-700/60"
                        }`}
                        title="Click to toggle status"
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            rule.status === "Active" ? "bg-emerald-500" : "bg-slate-400"
                          }`}
                        />
                        <span>{rule.status}</span>
                      </button>
                    </td>

                    {/* Col 7: Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          type="button"
                          onClick={() => onEditConstraint(rule)}
                          className="h-8 w-8 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer flex items-center justify-center"
                          title="Edit rule"
                          aria-label={`Edit ${rule.name}`}
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteConstraint(rule.id)}
                          className="h-8 w-8 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer flex items-center justify-center"
                          title="Delete rule"
                          aria-label={`Delete ${rule.name}`}
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
                    ? `No constraints found matching "${searchTerm}".`
                    : "No constraints available."}
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
