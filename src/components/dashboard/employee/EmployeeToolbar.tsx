"use client";

import React from "react";
import { Search, X, ChevronDown, List, LayoutGrid } from "lucide-react";

interface EmployeeToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedRole: string;
  onRoleChange: (value: string) => void;
  roles: string[];
  totalEmployeesCount: number;
  selectedType: string;
  onTypeChange: (value: string) => void;
  fullTimeCount: number;
  partTimeCount: number;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  onResetFilters: () => void;
  viewMode: "table" | "cards";
  onViewModeChange: (mode: "table" | "cards") => void;
}

export function EmployeeToolbar({
  searchTerm,
  onSearchChange,
  selectedRole,
  onRoleChange,
  roles,
  totalEmployeesCount,
  selectedType,
  onTypeChange,
  fullTimeCount,
  partTimeCount,
  selectedStatus,
  onStatusChange,
  onResetFilters,
  viewMode,
  onViewModeChange,
}: EmployeeToolbarProps) {
  const hasActiveFilters =
    Boolean(searchTerm) ||
    selectedRole !== "all" ||
    selectedType !== "all" ||
    selectedStatus !== "all";

  return (
    <div className="rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Search Input & Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search Bar */}
          <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute inset-y-0 left-0 h-3.5 w-3.5 my-auto ml-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search staff, ID, phone..."
              className="w-full rounded-full border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 py-2 pl-9 pr-8 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5BFF]/50 transition"
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

          {/* Role Dropdown */}
          <div className="relative">
            <select
              value={selectedRole}
              onChange={(e) => onRoleChange(e.target.value)}
              className="appearance-none rounded-full border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 py-2 pl-3.5 pr-8 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5BFF]/50 transition cursor-pointer"
            >
              <option value="all">All roles ({totalEmployeesCount})</option>
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
          </div>

          {/* Contract Type Dropdown */}
          <div className="relative">
            <select
              value={selectedType}
              onChange={(e) => onTypeChange(e.target.value)}
              className="appearance-none rounded-full border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 py-2 pl-3.5 pr-8 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5BFF]/50 transition cursor-pointer"
            >
              <option value="all">All contracts</option>
              <option value="Full-time">Full-time ({fullTimeCount})</option>
              <option value="Part-time">Part-time ({partTimeCount})</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="appearance-none rounded-full border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 py-2 pl-3.5 pr-8 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5BFF]/50 transition cursor-pointer"
            >
              <option value="all">All statuses</option>
              <option value="Active">Active</option>
              <option value="On Leave">On leave</option>
              <option value="Off Duty">Off duty</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
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
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-full self-end md:self-auto shrink-0">
          <button
            type="button"
            onClick={() => onViewModeChange("table")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
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
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
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
    </div>
  );
}
