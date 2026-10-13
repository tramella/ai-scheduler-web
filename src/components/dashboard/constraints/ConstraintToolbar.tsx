"use client";

import React from "react";
import { Search, X, List, LayoutGrid, Filter } from "lucide-react";
import { CATEGORY_LABELS } from "./types";

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
    <div className="space-y-3">
      {/* Search Input & Segmented Enforcement Type Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Search input + type pill toggles */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Pill Search */}
          <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute inset-y-0 left-0 h-3.5 w-3.5 my-auto ml-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Filter rules by name or code..."
              className="w-full rounded-full border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 py-2 pl-9 pr-8 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5BFF]/50 shadow-xs transition"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                aria-label="Clear search"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Type Segmented Pill */}
          <div className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 p-1 text-xs font-medium">
            <button
              type="button"
              onClick={() => onTypeChange("all")}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition cursor-pointer ${
                selectedType === "all"
                  ? "bg-[#2F2C59] text-white dark:bg-indigo-600 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              All types ({hardCount + softCount})
            </button>
            <button
              type="button"
              onClick={() => onTypeChange("hard")}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition cursor-pointer ${
                selectedType === "hard"
                  ? "bg-[#2F2C59] text-white dark:bg-indigo-600 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Hard ({hardCount})
            </button>
            <button
              type="button"
              onClick={() => onTypeChange("soft")}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition cursor-pointer ${
                selectedType === "soft"
                  ? "bg-[#2F2C59] text-white dark:bg-indigo-600 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Soft ({softCount})
            </button>
          </div>

          {/* Status Segmented Pill */}
          <div className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 p-1 text-xs font-medium">
            <button
              type="button"
              onClick={() => onStatusChange("all")}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition cursor-pointer ${
                selectedStatus === "all"
                  ? "bg-[#2F2C59] text-white dark:bg-indigo-600 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              All statuses
            </button>
            <button
              type="button"
              onClick={() => onStatusChange("Active")}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition cursor-pointer ${
                selectedStatus === "Active"
                  ? "bg-[#2F2C59] text-white dark:bg-indigo-600 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Active
            </button>
            <button
              type="button"
              onClick={() => onStatusChange("Paused")}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition cursor-pointer ${
                selectedStatus === "Paused"
                  ? "bg-[#2F2C59] text-white dark:bg-indigo-600 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Paused
            </button>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="h-3 w-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Right: View Mode Segmented Control */}
        <div className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 p-1 text-xs font-semibold self-end md:self-auto shrink-0">
          <button
            type="button"
            onClick={() => onViewModeChange("table")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
              viewMode === "table"
                ? "bg-[#2F2C59] text-white shadow-xs dark:bg-indigo-600"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <List className="h-3.5 w-3.5" />
            <span>Table</span>
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("cards")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
              viewMode === "cards"
                ? "bg-[#2F2C59] text-white shadow-xs dark:bg-indigo-600"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span>Cards</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 text-xs font-medium mr-1 flex items-center shrink-0">
          <Filter className="h-3.5 w-3.5 mr-1" /> Category:
        </span>
        <button
          type="button"
          onClick={() => onCategoryChange("all")}
          className={`px-3 py-1.5 rounded-full font-semibold transition cursor-pointer shrink-0 text-xs ${
            selectedCategory === "all"
              ? "bg-[#2F2C59] text-white dark:bg-indigo-600 shadow-xs"
              : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
          }`}
        >
          All categories
        </button>
        {Object.entries(CATEGORY_LABELS).map(([catKey, label]) => (
          <button
            key={catKey}
            type="button"
            onClick={() => onCategoryChange(catKey)}
            className={`px-3 py-1.5 rounded-full font-semibold transition cursor-pointer shrink-0 text-xs ${
              selectedCategory === catKey
                ? "bg-[#2F2C59] text-white dark:bg-indigo-600 shadow-xs"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
