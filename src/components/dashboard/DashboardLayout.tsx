"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardSidebar } from "./DashboardSidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Authentication protection
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0B0F19]">
        <div className="flex flex-col items-center space-y-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#2F2C59] dark:border-indigo-500 border-t-transparent"></div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Verifying workspace credentials...
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className="h-screen h-dvh flex overflow-hidden bg-white dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 transition-colors">
      {/* 1. Left Dedicated Sidebar (Pinned, fits 100vh, doesn't scroll with page) */}
      <DashboardSidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* 2. Main Content Canvas with Header (NO FOOTER, Center-Only Scroll) */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-white dark:bg-[#0B0F19]">
        {/* Top Header (Pinned at top, doesn't scroll) */}
        <DashboardHeader onToggleSidebar={() => setMobileOpen(true)} />

        {/* Center Main Content (ONLY THIS SCROLLS VERTICALLY) */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 bg-white dark:bg-[#0B0F19]">
          {children}
        </main>
      </div>
    </div>
  );
}

