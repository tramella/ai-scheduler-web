"use client";

import React from "react";
import { ShieldCheck, Sliders, Edit2, Trash2 } from "lucide-react";
import { ConstraintRule, CATEGORY_LABELS } from "./types";

interface ConstraintCardsProps {
  constraints: ConstraintRule[];
  searchTerm: string;
  onToggleStatus: (id: string) => void;
  onEditConstraint: (rule: ConstraintRule) => void;
  onDeleteConstraint: (id: string) => void;
  pagination?: React.ReactNode;
}

export function ConstraintCards({
  constraints,
  searchTerm,
  onToggleStatus,
  onEditConstraint,
  onDeleteConstraint,
  pagination,
}: ConstraintCardsProps) {
  return (
    <div className="space-y-4">
      {constraints.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {constraints.map((rule) => {
            const isHard = rule.type === "hard";

            return (
              <div
                key={rule.id}
                className="rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:border-slate-300 dark:hover:border-slate-700 transition space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top Bar: Code chip + Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 tabular-nums">
                        {rule.code}
                      </span>
                      {isHard ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60">
                          <ShieldCheck className="h-3 w-3" />
                          <span>Hard</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-[#2F5BFF] dark:text-blue-300 border border-blue-200/50">
                          <Sliders className="h-3 w-3 text-[#2F5BFF]" />
                          <span>Soft</span>
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => onToggleStatus(rule.id)}
                      className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold cursor-pointer transition ${
                        rule.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60"
                          : "bg-slate-100 text-slate-500 border border-slate-200/60 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700/60"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          rule.status === "Active" ? "bg-emerald-500" : "bg-slate-400"
                        }`}
                      />
                      <span>{rule.status}</span>
                    </button>
                  </div>

                  {/* Rule Name & Description */}
                  <div>
                    <h3 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">
                      {rule.name}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {rule.description}
                    </p>
                  </div>

                  {/* Parameter & Category Breakdown */}
                  <div className="space-y-2 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span className="text-xs">Category:</span>
                      <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                        {CATEGORY_LABELS[rule.category]}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span className="text-xs">Threshold:</span>
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                        {rule.threshold} {rule.unit}
                      </span>
                    </div>

                    {!isHard && (
                      <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                        <span className="text-xs">Weight penalty:</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#2F5BFF] rounded-full"
                              style={{ width: `${rule.weight}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                            {rule.weight}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span className="text-xs">Scope:</span>
                      <span className="text-xs text-slate-500 truncate max-w-[150px]">
                        {rule.scope}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end space-x-1">
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
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 py-12 text-center text-xs text-slate-400 shadow-2xs">
          {searchTerm
            ? `No constraints found matching "${searchTerm}".`
            : "No constraints available."}
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
