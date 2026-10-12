"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  Calendar,
  Sparkles,
  CheckCircle2,
  Clock,
  Building2,
  TrendingUp,
  FileSpreadsheet,
  Settings,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

export default function DashboardPage() {
  const { user, activeCompany } = useAuth();

  // Weekly shift summary data
  const weeklyScheduleOverview = [
    { day: "Monday", date: "Oct 12", shifts: 16, staffCount: 14, status: "Optimized" },
    { day: "Tuesday", date: "Oct 13", shifts: 16, staffCount: 15, status: "Optimized" },
    { day: "Wednesday", date: "Oct 14", shifts: 18, staffCount: 16, status: "Optimized" },
    { day: "Thursday", date: "Oct 15", shifts: 16, staffCount: 14, status: "Optimized" },
    { day: "Friday", date: "Oct 16", shifts: 20, staffCount: 18, status: "Optimized" },
    { day: "Saturday", date: "Oct 17", shifts: 22, staffCount: 20, status: "Optimized" },
    { day: "Sunday", date: "Oct 18", shifts: 14, staffCount: 12, status: "Optimized" },
  ];

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Top Header Banner */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-md border border-indigo-100 dark:border-indigo-900/60">
                Live Workspace
              </span>
              {activeCompany?.role && (
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                  Role: {activeCompany.role}
                </span>
              )}
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Welcome back, {user?.full_name}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Here is your workforce scheduling summary for the active roster cycle.
            </p>
          </div>

          {/* Quick Action Button */}
          <div className="flex items-center space-x-3">
            <Link
              href="/product"
              className="inline-flex items-center space-x-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#2F2C59] hover:bg-[#1E1B3A] dark:bg-indigo-600 dark:hover:bg-indigo-700 rounded-xl shadow-xs transition active:scale-[0.99] border border-[#2F2C59] dark:border-indigo-600 cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>Launch AI Scheduler</span>
            </Link>
          </div>
        </div>

        {/* 4 Core KPI Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs hover:shadow-xs transition">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-semibold">Active Staff</span>
              <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl text-[#2F2C59] dark:text-indigo-400">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">28</div>
              <div className="mt-1 flex items-center text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                <TrendingUp className="h-3.5 w-3.5 mr-1" />
                <span>100% available this roster</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs hover:shadow-xs transition">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-semibold">Scheduled Shifts</span>
              <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl text-[#2F2C59] dark:text-indigo-400">
                <Calendar className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">122</div>
              <div className="mt-1 flex items-center text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                <span>Zero staffing gaps</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs hover:shadow-xs transition">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-semibold">AI Validation Score</span>
              <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl text-[#2F2C59] dark:text-indigo-400">
                <Sparkles className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">99.4%</div>
              <div className="mt-1 flex items-center text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                <span>0 hard constraints violated</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs hover:shadow-xs transition">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-semibold">Planned Labor</span>
              <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl text-[#2F2C59] dark:text-indigo-400">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">896 hrs</div>
              <div className="mt-1 flex items-center text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span>Within weekly budget (920 hrs)</span>
              </div>
            </div>
          </div>

        </div>

        {/* Quick Action Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <Link
            href="/product"
            className="group block rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs hover:border-[#2F2C59]/40 dark:hover:border-indigo-500/40 hover:shadow-sm transition"
          >
            <div className="flex items-start justify-between">
              <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl text-[#2F2C59] dark:text-indigo-400 group-hover:bg-[#2F2C59] dark:group-hover:bg-indigo-600 group-hover:text-white transition">
                <Sparkles className="h-5 w-5" />
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">AI Shift Generator</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Upload staff rosters and enter custom rules in natural language to generate optimal shifts.
            </p>
          </Link>

          <div className="group block rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs transition">
            <div className="flex items-start justify-between">
              <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-semibold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md">
                Spreadsheet Ready
              </span>
            </div>
            <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">Employee Roster (.xlsx)</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Manage employee roles, contracts, target working hours, and qualification certifications.
            </p>
          </div>

          <div className="group block rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs transition">
            <div className="flex items-start justify-between">
              <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300">
                <Settings className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                Config
              </span>
            </div>
            <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">Rules & Constraints</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Define maximum consecutive workdays, rest intervals between shifts, and overtime caps.
            </p>
          </div>

        </div>

        {/* Weekly Schedule Preview Table */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Current Week Schedule Preview
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Week 42 (Oct 12, 2026 - Oct 18, 2026)
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-100 dark:border-emerald-800/60">
                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                Validated by AI Engine
              </span>
              <Link
                href="/product"
                className="inline-flex items-center space-x-1 text-xs font-semibold text-[#2F2C59] dark:text-indigo-400 hover:underline px-2 py-1"
              >
                <span>View Full Details</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Schedule Table */}
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-3">Day</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3 text-center">Total Shifts</th>
                  <th className="py-3 px-3 text-center">Staff Scheduled</th>
                  <th className="py-3 px-3 text-right">Optimization</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {weeklyScheduleOverview.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-3 font-semibold text-slate-900 dark:text-white">{item.day}</td>
                    <td className="py-3.5 px-3 text-slate-500 dark:text-slate-400">{item.date}</td>
                    <td className="py-3.5 px-3 text-center">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-semibold text-slate-800 dark:text-slate-200">
                        {item.shifts} shifts
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center font-medium">
                      {item.staffCount} members
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800/60">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Workspace Summary Footer Strip */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-3">
          <div className="flex items-center space-x-2">
            <Building2 className="h-4 w-4 text-slate-400 dark:text-slate-500" />
            <span>Workspace: <strong className="text-slate-800 dark:text-slate-200">{activeCompany?.name || "Personal"}</strong></span>
            <span>•</span>
            <span>Account Type: <strong className="text-slate-800 dark:text-slate-200">{user?.account_type}</strong></span>
          </div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>Verified email: <strong className="text-slate-800 dark:text-slate-200">{user?.email}</strong></span>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
