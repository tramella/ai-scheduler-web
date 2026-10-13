"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  Calendar,
  User,
  Home,
} from "lucide-react";

export function MobileBottomNav() {
  const pathname = usePathname();

  const isOverview = pathname === "/dashboard";
  const isStudio = pathname.startsWith("/dashboard/ai-studio");
  const isCalendar = pathname.startsWith("/dashboard/calendar");
  const isProfile = pathname.startsWith("/dashboard/profile");

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 inset-x-0 z-40 lg:hidden border-t border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1 shadow-lg pb-[max(0.375rem,env(safe-area-inset-bottom))]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* 1. Dashboard */}
        <Link
          href="/dashboard"
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition min-w-[54px] ${
            isOverview
              ? "text-[#2F2C59] dark:text-indigo-400 font-bold"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium"
          }`}
        >
          <div
            className={`relative p-1 rounded-lg transition ${
              isOverview
                ? "bg-indigo-50 dark:bg-indigo-950/60 text-[#2F2C59] dark:text-indigo-300"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            <LayoutDashboard className="h-4.5 w-4.5" />
            {isOverview && (
              <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-[#2F2C59] dark:bg-indigo-400" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 leading-none">Dashboard</span>
        </Link>

        {/* 2. Studio */}
        <Link
          href="/dashboard/ai-studio"
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition min-w-[54px] ${
            isStudio
              ? "text-[#2F2C59] dark:text-indigo-400 font-bold"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium"
          }`}
        >
          <div
            className={`relative p-1 rounded-lg transition ${
              isStudio
                ? "bg-indigo-50 dark:bg-indigo-950/60 text-[#2F2C59] dark:text-indigo-300"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            <Sparkles className="h-4.5 w-4.5" />
            {isStudio && (
              <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-[#2F2C59] dark:bg-indigo-400" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 leading-none">Studio</span>
        </Link>

        {/* 3. Center Raised Home Icon -> switch to website */}
        <Link
          href="/"
          className="relative -top-2.5 flex flex-col items-center justify-center group shrink-0"
          title="Switch to Website"
          aria-label="Switch to Website"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2F2C59] hover:bg-[#1E1B3A] dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white shadow-md transition-transform active:scale-95 ring-4 ring-white dark:ring-slate-900">
            <Home className="h-5 w-5" />
          </div>
          <span className="text-[9.5px] font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
            Website
          </span>
        </Link>

        {/* 4. Schedule (Calendar) */}
        <Link
          href="/dashboard/calendar"
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition min-w-[54px] ${
            isCalendar
              ? "text-[#2F2C59] dark:text-indigo-400 font-bold"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium"
          }`}
        >
          <div
            className={`relative p-1 rounded-lg transition ${
              isCalendar
                ? "bg-indigo-50 dark:bg-indigo-950/60 text-[#2F2C59] dark:text-indigo-300"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            <Calendar className="h-4.5 w-4.5" />
            {isCalendar && (
              <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-[#2F2C59] dark:bg-indigo-400" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 leading-none">Schedule</span>
        </Link>

        {/* 5. Profile Page */}
        <Link
          href="/dashboard/profile"
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition min-w-[54px] ${
            isProfile
              ? "text-[#2F2C59] dark:text-indigo-400 font-bold"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium"
          }`}
          aria-label="Account profile"
        >
          <div
            className={`relative p-1 rounded-lg transition ${
              isProfile
                ? "bg-indigo-50 dark:bg-indigo-950/60 text-[#2F2C59] dark:text-indigo-300"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            <User className="h-4.5 w-4.5" />
            {isProfile && (
              <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-[#2F2C59] dark:bg-indigo-400" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 leading-none">Profile</span>
        </Link>
      </div>
    </nav>
  );
}
