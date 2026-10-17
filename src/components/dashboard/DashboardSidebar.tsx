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
  Palmtree,
  Store,
  Award,
  Terminal,
  CreditCard,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { UserAvatar } from "@/components/ui/UserAvatar";

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
  const { user, activeCompany, isSuperAdmin, isCompanyAdmin, isStoreManager, isStaff } = useAuth();
  const { theme } = useTheme();

  // 1. Platform Administration Links (Exclusive to ORBIT Product Owner / Super Admin)
  const adminLinks = [
    {
      name: "Platform Overview",
      href: "/dashboard/admin",
      icon: ShieldCheck,
      active: pathname === "/dashboard/admin",
      badge: "ROOT",
    },
    {
      name: "Customer Tenants",
      href: "/dashboard/admin/companies",
      icon: Building2,
      active: pathname === "/dashboard/admin/companies",
    },
    {
      name: "Global User Directory",
      href: "/dashboard/admin/users",
      icon: Users,
      active: pathname === "/dashboard/admin/users",
    },
    {
      name: "AI Engine Telemetry",
      href: "/dashboard/ai-logs",
      icon: Terminal,
      active: pathname.startsWith("/dashboard/ai-logs"),
    },
    {
      name: "Platform Subscriptions",
      href: "/dashboard/billing",
      icon: CreditCard,
      active: pathname.startsWith("/dashboard/billing"),
    },
  ];

  // 2. Client Business Workspace Navigation (For Business Owners, Managers & Staff)
  const allWorkspaceLinks = [
    {
      name: "Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
      roles: ["COMPANY_ADMIN", "STORE_MANAGER"],
    },
    {
      name: "AI Studio",
      href: "/dashboard/ai-studio",
      icon: Sparkles,
      active: pathname === "/dashboard/ai-studio",
      badge: "AI",
      roles: ["COMPANY_ADMIN"],
    },
    {
      name: "Calendar",
      href: "/dashboard/calendar",
      icon: Calendar,
      active: pathname.startsWith("/dashboard/calendar"),
      roles: ["COMPANY_ADMIN", "STORE_MANAGER", "STAFF"],
    },
    {
      name: "Employees",
      href: "/dashboard/employees",
      icon: Users,
      active: pathname === "/dashboard/employees",
      roles: ["COMPANY_ADMIN", "STORE_MANAGER"],
    },
    {
      name: "Leave Requests",
      href: "/dashboard/leave-requests",
      icon: Palmtree,
      active: pathname.startsWith("/dashboard/leave-requests"),
      roles: ["COMPANY_ADMIN", "STORE_MANAGER", "STAFF"],
    },
    {
      name: "Locations",
      href: "/dashboard/locations",
      icon: Store,
      active: pathname.startsWith("/dashboard/locations"),
      roles: ["COMPANY_ADMIN"],
    },
    {
      name: "Skills Matrix",
      href: "/dashboard/skills",
      icon: Award,
      active: pathname.startsWith("/dashboard/skills"),
      roles: ["COMPANY_ADMIN"],
    },
    {
      name: "Constraints",
      href: "/dashboard/constraints",
      icon: Sliders,
      active: pathname === "/dashboard/constraints",
      roles: ["COMPANY_ADMIN", "STORE_MANAGER"],
    },
    {
      name: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart3,
      active: pathname.startsWith("/dashboard/analytics"),
      roles: ["COMPANY_ADMIN", "STORE_MANAGER"],
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
      active: pathname.startsWith("/dashboard/settings"),
      roles: ["COMPANY_ADMIN"],
    },
  ];

  // Determine client links visible based on client role
  const navLinks = allWorkspaceLinks.filter((link) => {
    if (isCompanyAdmin) return link.roles.includes("COMPANY_ADMIN");
    if (isStoreManager) return link.roles.includes("STORE_MANAGER");
    if (isStaff) return link.roles.includes("STAFF");
    return true; // Default fallback
  });


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
        {!collapsed && (
          isSuperAdmin ? (
            <div className="p-3 mx-3 mt-3 rounded-2xl bg-gradient-to-br from-[#2F2C59] to-indigo-900 text-white shadow-xs border border-indigo-700/60">
              <div className="flex items-center space-x-2.5">
                <div className="h-8 w-8 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-400/30">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold truncate tracking-wide">
                    ORBIT SaaS Platform
                  </div>
                  <div className="text-[10px] text-amber-200/90 font-medium truncate flex items-center space-x-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Product Owner (Root)</span>
                  </div>
                </div>
              </div>
            </div>
          ) : activeCompany ? (
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
                    {activeCompany.role === "COMPANY_ADMIN"
                      ? "Business Owner"
                      : activeCompany.role === "STORE_MANAGER"
                      ? "Store Manager"
                      : "Staff Member"}
                  </div>
                </div>
              </div>
            </div>
          ) : null
        )}

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1 px-3 py-3 overflow-y-auto">
          {/* ORBIT Product Owner (Super Admin) Menu */}
          {isSuperAdmin ? (
            <>
              {!collapsed && (
                <div className="px-2 pt-1 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center space-x-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Product Owner Suite</span>
                </div>
              )}
              <div className="space-y-1">
                {adminLinks.map((item) => {
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
                          ? "bg-indigo-600 text-white shadow-xs"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 shrink-0 transition-colors ${
                          item.active
                            ? "text-white"
                            : "text-slate-400 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                        }`}
                      />
                      {!collapsed && (
                        <span className="flex-1 truncate">{item.name}</span>
                      )}
                      {!collapsed && item.badge && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-400/20 text-amber-600 dark:text-amber-300">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Client Business Experience Preview for Product Owner */}
              <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60">
                {!collapsed && (
                  <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Client Business Tools (Preview)
                  </div>
                )}
                <div className="space-y-1">
                  {allWorkspaceLinks.map((item) => {
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
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Client Workspace Menu (Business Owner, Store Manager, Staff) */}
              {!collapsed && (
                <div className="px-2 pt-1 pb-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                  {isCompanyAdmin
                    ? "Business Operations (Owner)"
                    : isStoreManager
                    ? "Store Operations"
                    : "My Work"}
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
            </>
          )}
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
              <UserAvatar
                src={user?.avatar_url}
                name={user?.full_name}
                size="sm"
              />
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
              <UserAvatar
                src={user?.avatar_url}
                name={user?.full_name}
                size="sm"
                className={
                  pathname.startsWith("/dashboard/profile")
                    ? "ring-2 ring-indigo-400 ring-offset-2 dark:ring-offset-slate-900"
                    : ""
                }
              />
            </Link>
          )}
        </div>

      </aside>
    </>
  );
}
