"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  Users,
  Sliders,
  Calendar,
  BarChart3,
  Settings,
  Building2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

interface DashboardSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function DashboardSidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const { user, activeCompany } = useAuth();
  const { theme } = useTheme();

  const navLinks = [
    {
      name: "Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      name: "AI Studio",
      href: "/dashboard/ai-studio",
      icon: Sparkles,
      active: pathname === "/dashboard/ai-studio",
      badge: "AI",
    },
    {
      name: "Calendar",
      href: "/dashboard/calendar",
      icon: Calendar,
      active: pathname.startsWith("/dashboard/calendar"),
    },
    {
      name: "Employees",
      href: "/dashboard/employees",
      icon: Users,
      active: pathname === "/dashboard/employees",
    },
    {
      name: "Constraints",
      href: "/dashboard/constraints",
      icon: Sliders,
      active: pathname === "/dashboard/constraints",
    },
    {
      name: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart3,
      active: pathname.startsWith("/dashboard/analytics"),
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
      active: pathname.startsWith("/dashboard/settings"),
    },
  ];


  const logoSrc =
    theme === "dark"
      ? "/images/logo/orbit-weave-logo-dark-bg.svg"
      : "/images/logo/orbit-weave-logo-indigo-light-bg.svg";

  const symbolSrc =
    theme === "dark"
      ? "/images/logo/orbit-weave-symbol-dark-bg.svg"
      : "/images/logo/orbit-weave-symbol-light-bg.svg";

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col h-full lg:h-full shrink-0 overflow-hidden border-r border-slate-200/80 dark:border-slate-800/80 bg-[#F8FAFC] dark:bg-[#0D111D] transition-all duration-300 ease-in-out lg:static ${
          collapsed ? "w-20" : "w-64"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Top Header / Brand Logo */}
        <div className="flex h-16 shrink-0 items-center justify-between px-4 border-b border-slate-200/60 dark:border-slate-800/60">

          <Link
            href="/"
            className="flex items-center space-x-2 transition opacity-95 hover:opacity-100 focus:outline-hidden overflow-hidden"
          >
            {collapsed ? (
              <Image
                src={symbolSrc}
                alt="ORBIT"
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
                style={{ width: "auto", height: "auto" }}
                priority
              />
            ) : (
              <Image
                src={logoSrc}
                alt="ORBIT"
                width={125}
                height={32}
                className="h-7 w-auto object-contain"
                style={{ width: "auto" }}
                priority
              />
            )}
          </Link>

          {/* Close on Mobile / Collapse on Desktop */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 lg:hidden cursor-pointer"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={onToggleCollapse}
              className="hidden lg:inline-flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition cursor-pointer"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Workspace Card (if expanded) */}
        {!collapsed && activeCompany && (
          <div className="p-3 mx-3 mt-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="flex items-center space-x-2.5">
              <div className="h-8 w-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#2F5BFF] flex items-center justify-center shrink-0">
                <Building2 className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                  {activeCompany.name}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {activeCompany.role}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1 px-3 py-3 overflow-y-auto">
          {!collapsed && (
            <div className="px-2 pt-1 pb-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
              Menu
            </div>
          )}
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onCloseMobile}
                title={collapsed ? item.name : undefined}
                className={`group flex items-center rounded-full text-xs font-semibold transition-colors duration-150 ${
                  collapsed ? "justify-center p-2.5" : "px-3.5 py-2.5 space-x-3"
                } ${
                  item.active
                    ? "bg-[#2F2C59] text-white shadow-xs dark:bg-indigo-600"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 transition-colors ${
                    item.active
                      ? "text-white"
                      : "text-slate-400 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200"
                  }`}
                />
                {!collapsed && (
                  <span className="flex-1 truncate">{item.name}</span>
                )}
                {!collapsed && item.badge && (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Block at bottom (Full Name Display) */}
        <div className="p-3 border-t border-slate-200/70 dark:border-slate-800/70 shrink-0">
          {!collapsed ? (
            <Link
              href="/dashboard/profile"
              onClick={onCloseMobile}
              className={`p-3 rounded-2xl border shadow-[0_1px_2px_rgba(15,23,42,0.04)] flex items-center space-x-2.5 transition group cursor-pointer ${
                pathname.startsWith("/dashboard/profile")
                  ? "bg-indigo-50/50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800"
                  : "bg-white dark:bg-slate-900 border-slate-200/70 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80"
              }`}
              title="View account profile"
            >
              <div className="h-8 w-8 rounded-full bg-[#2F2C59] dark:bg-indigo-600 text-white font-semibold text-xs flex items-center justify-center shrink-0 shadow-xs">
                {user?.full_name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="min-w-0 flex-1 text-left">
                <div
                  className="text-xs font-semibold text-slate-900 dark:text-white truncate group-hover:text-[#2F5BFF] transition-colors"
                  title={user?.full_name || undefined}
                >
                  {user?.full_name || "User Account"}
                </div>
                <div
                  className="text-[11px] text-slate-500 dark:text-slate-400 truncate"
                  title={user?.email || undefined}
                >
                  {user?.email || "Authenticated"}
                </div>
              </div>
            </Link>
          ) : (
            <Link
              href="/dashboard/profile"
              onClick={onCloseMobile}
              className="flex justify-center"
              title={user?.full_name || "Account Profile"}
            >
              <div
                className={`h-8 w-8 rounded-full text-white font-semibold text-xs flex items-center justify-center shrink-0 shadow-xs cursor-pointer transition ${
                  pathname.startsWith("/dashboard/profile")
                    ? "bg-indigo-600 ring-2 ring-indigo-400 ring-offset-2 dark:ring-offset-slate-900"
                    : "bg-[#2F2C59] dark:bg-indigo-600 hover:opacity-90"
                }`}
              >
                {user?.full_name?.charAt(0).toUpperCase() || "U"}
              </div>
            </Link>
          )}
        </div>

      </aside>
    </>
  );
}
