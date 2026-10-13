"use client";

import React from "react";
import { Search, X, ChevronDown, List, LayoutGrid } from "lucide-react";
import { CATEGORY_LABELS, ConstraintCategory } from "./types";

interface ConstraintToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
  hardCount: number;
  softCount: number;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  onResetFilters: () => void;
  viewMode: "table" | "cards";
  onViewModeChange: (mode: "table" | "cards") => void;
}

export function ConstraintToolbar({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  hardCount,
  softCount,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  onResetFilters,
  viewMode,
  onViewModeChange,
}: ConstraintToolbarProps) {
  const hasActiveFilters =
    Boolean(searchTerm) ||
    selectedType !== "all" ||
    selectedCategory !== "all" ||
    selectedStatus !== "all";

  return (
    <div className="rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] space-y-3">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Search Input & Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search Bar */}
          <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute inset-y-0 left-0 h-3.5 w-3.5 my-auto ml-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Filter rules by name or code..."
              className="w-full rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-1.5 pl-8.5 pr-8 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#2F5BFF]/50 transition"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                aria-label="Clear search"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Type Dropdown */}
          <div className="relative">
            <select
              value={selectedType}
              onChange={(e) => onTypeChange(e.target.value)}
              className="appearance-none rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-1.5 pl-3.5 pr-8 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#2F5BFF]/50 transition cursor-pointer"
            >
              <option value="all">All enforcement types</option>
              <option value="hard">Hard constraints ({hardCount})</option>
              <option value="soft">Soft preferences ({softCount})</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="appearance-none rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-1.5 pl-3.5 pr-8 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#2F5BFF]/50 transition cursor-pointer"
            >
              <option value="all">All categories</option>
              {Object.entries(CATEGORY_LABELS).map(([catKey, label]) => (
                <option key={catKey} value={catKey}>
                  {label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="appearance-none rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-1.5 pl-3.5 pr-8 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#2F5BFF]/50 transition cursor-pointer"
            >
              <option value="all">All statuses</option>
              <option value="Active">Active</option>
              <option value="Paused">Paused</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              <X className="h-3 w-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Right: View Mode Switcher */}
        <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-full border border-slate-200/80 dark:border-slate-700/60 self-end md:self-auto shrink-0">
          <button
            type="button"
            onClick={() => onViewModeChange("table")}
            className={`p-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
              viewMode === "table"
                ? "bg-[#2F2C59] dark:bg-indigo-600 text-white shadow-xs"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
            title="Table view"
            aria-label="Table view"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("cards")}
            className={`p-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
              viewMode === "cards"
                ? "bg-[#2F2C59] dark:bg-indigo-600 text-white shadow-xs"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
            title="Card grid view"
            aria-label="Card grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
