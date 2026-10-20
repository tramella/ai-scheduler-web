"use client";

import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { ConstraintRule, ConstraintType, ConstraintCategory, CATEGORY_LABELS } from "./types";

interface AddConstraintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newRule: Omit<ConstraintRule, "id" | "updatedAt">) => void;
}

export function AddConstraintModal({
  isOpen,
  onClose,
  onAdd,
}: AddConstraintModalProps) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<ConstraintType>("hard");
  const [category, setCategory] = useState<ConstraintCategory>("labor_law");
  const [threshold, setThreshold] = useState(8);
  const [unit, setUnit] = useState("hours / day");
  const [weight, setWeight] = useState(80);
  const [scope, setScope] = useState("All Crew Members");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const generatedCode = code.trim() || `RULE-${Math.floor(100 + Math.random() * 900)}`;

    onAdd({
      code: generatedCode,
      name: name.trim(),
      description: description.trim() || "Constraint rule enforced by deterministic AI scheduling engine.",
      type,
      category,
      threshold: Number(threshold),
      unit: unit.trim() || "units",
      weight: type === "hard" ? 100 : Number(weight),
      scope: scope.trim() || "All Crew Members",
      status: "Active",
    });

    // Reset Form
    setName("");
    setCode("");
    setDescription("");
    setType("hard");
    setCategory("labor_law");
    setThreshold(8);
    setUnit("hours / day");
    setWeight(80);
    setScope("All Crew Members");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg max-h-[92vh] flex flex-col rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-2xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-[#2F5BFF] shrink-0">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-slate-900 dark:text-white">
                Add scheduling constraint
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Define a new compliance rule or optimization objective
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
              Rule name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Max daily working hours"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2F5BFF]/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                Rule code (optional)
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. RULE-011"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                Enforcement type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ConstraintType)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden cursor-pointer"
              >
                <option value="hard">Hard (strict compliance)</option>
                <option value="soft">Soft (weighted preference)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                Rule category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ConstraintCategory)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden cursor-pointer"
              >
                {Object.entries(CATEGORY_LABELS).map(([k, label]) => (
                  <option key={k} value={k}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                Target scope
              </label>
              <select
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden cursor-pointer"
              >
                <option value="All Crew Members">All crew members</option>
                <option value="Full-Time Staff">Full-time staff</option>
                <option value="Part-Time Crew">Part-time crew</option>
                <option value="Flagship Store (D1)">Flagship store (D1)</option>
                <option value="Express Branch (D3)">Express branch (D3)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                Parameter threshold
              </label>
              <input
                type="number"
                required
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden tabular-nums"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                Unit of measurement
              </label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g. hours / day, staff"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden"
              />
            </div>
          </div>

          {type === "soft" && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  Optimization weight penalty (1 - 100)
                </label>
                <span className="text-xs font-semibold text-[#2F5BFF] tabular-nums">
                  {weight}/100
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={100}
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#2F2C59] dark:accent-indigo-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
              Description and rationale
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain why this rule is enforced and how the solver should handle it..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 p-3 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2F5BFF]/50"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-slate-100 dark:bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-[#2F2C59] hover:bg-[#1E1B3A] dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white px-5 py-2 text-xs font-semibold shadow-xs transition active:scale-[0.99] cursor-pointer"
            >
              Save constraint
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
