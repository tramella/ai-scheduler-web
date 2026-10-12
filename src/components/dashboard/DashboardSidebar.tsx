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
      name: "Employees",
      href: "/dashboard#roster",
      icon: Users,
      active: false,
    },
    {
      name: "Constraints",
      href: "/dashboard#rules",
      icon: Sliders,
      active: false,
    },
    {
      name: "Calendar",
      href: "/dashboard#calendar",
      icon: Calendar,
      active: false,
    },
    {
      name: "Analytics",
      href: "/dashboard#reports",
      icon: BarChart3,
      active: false,
    },
    {
      name: "Settings",
      href: "/dashboard#settings",
      icon: Settings,
      active: false,
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
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col h-full lg:h-full shrink-0 overflow-hidden border-r border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 ease-in-out lg:static ${
          collapsed ? "w-20" : "w-64"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Top Header / Brand Logo */}
        <div className="flex h-16 shrink-0 items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800">

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
                priority
              />
            ) : (
              <Image
                src={logoSrc}
                alt="ORBIT"
                width={125}
                height={32}
                className="h-7 w-auto object-contain"
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
              className="hidden lg:inline-flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
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
          <div className="p-3 mx-3 mt-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#2F2C59] dark:text-indigo-400 shrink-0">
                <Building2 className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {activeCompany.name}
                </div>
                <div className="text-[10px] text-slate-400 dark:text-slate-400 truncate">
                  {activeCompany.role}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onCloseMobile}
                title={collapsed ? item.name : undefined}
                className={`group flex items-center rounded-xl text-xs font-semibold transition-all ${
                  collapsed ? "justify-center p-2.5" : "px-3 py-2.5 space-x-3"
                } ${
                  item.active
                    ? "bg-[#2F2C59] text-white shadow-xs dark:bg-indigo-600"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
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
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Status Card (if expanded) */}
        {!collapsed && (
          <div className="p-3 m-3 rounded-2xl bg-gradient-to-br from-indigo-50/80 to-slate-50 dark:from-indigo-950/20 dark:to-slate-800/40 border border-indigo-100 dark:border-indigo-900/40 text-xs">
            <div className="flex items-center space-x-1.5 text-indigo-700 dark:text-indigo-400 font-semibold mb-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>ORBIT Engine v2.4</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Deterministic constraint validation active for all shifts.
            </p>
          </div>
        )}

        {/* User Compact Strip at bottom */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="h-7 w-7 rounded-lg bg-[#2F2C59] dark:bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
              {user?.full_name?.charAt(0).toUpperCase() || "U"}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1 text-left">
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {user?.full_name?.split(" ")[0]}
                </div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                  {user?.email}
                </div>
              </div>
            )}
          </div>
        </div>

      </aside>
    </>
  );
}
