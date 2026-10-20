"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  Sun,
  Moon,
  Bell,
  Search,
  ChevronDown,
  Building2,
  User,
  LogOut,
  CheckCircle2,
  Sparkles,
  Users,
  Sliders,
  Home,
  Calendar,
  BarChart3,
  Settings,
  Palmtree,
  Store,
  Award,
  Terminal,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useRouter, usePathname } from "next/navigation";
import { UserAvatar } from "@/components/ui/UserAvatar";

interface DashboardHeaderProps {
  onToggleSidebar?: () => void;
}

export function DashboardHeader({ onToggleSidebar }: DashboardHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isAiStudio = pathname.startsWith("/dashboard/ai-studio");
  const isEmployees = pathname.startsWith("/dashboard/employees");
  const isLeaveRequests = pathname.startsWith("/dashboard/leave-requests");
  const isLocations = pathname.startsWith("/dashboard/locations");
  const isSkills = pathname.startsWith("/dashboard/skills");
  const isAiLogs = pathname.startsWith("/dashboard/ai-logs");
  const isBilling = pathname.startsWith("/dashboard/billing");
  const isConstraints = pathname.startsWith("/dashboard/constraints");
  const isCalendar = pathname.startsWith("/dashboard/calendar");
  const isAnalytics = pathname.startsWith("/dashboard/analytics");
  const isSettings = pathname.startsWith("/dashboard/settings");
  const isProfile = pathname.startsWith("/dashboard/profile");
  const isAdminOverview = pathname === "/dashboard/admin";
  const isAdminUsers = pathname === "/dashboard/admin/users";
  const isAdminCompanies = pathname === "/dashboard/admin/companies";

  const {
    user,
    activeCompany,
    companies,
    switchCompany,
    logout,
    isSuperAdmin,
    isCompanyAdmin,
    isStoreManager,
    isStaff,
    simulatedRole,
    setSimulatedRole,
  } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const logoSrc =
    theme === "dark"
      ? "/images/logo/orbit-weave-logo-dark-bg.svg"
      : "/images/logo/orbit-weave-logo-indigo-light-bg.svg";

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const companyMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (companyMenuRef.current && !companyMenuRef.current.contains(event.target as Node)) {
        setCompanyDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setProfileDropdownOpen(false);
    logout();
    router.push("/login");
  };

  return (
    <>
      <header className="shrink-0 z-30 h-16 w-full border-b border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors">
        <div className="flex h-full items-center justify-between px-3.5 sm:px-6">

          {/* Left: Mobile Toggle & Desktop Breadcrumb */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {onToggleSidebar && (
              <button
                type="button"
                onClick={onToggleSidebar}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden cursor-pointer"
                aria-label="Toggle navigation sidebar"
              >
                <Menu className="h-5 w-5" />
              </button>
            )}

            <div className="hidden sm:flex items-center space-x-2">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                {isSuperAdmin ? "ORBIT Platform" : "Business Workspace"}
              </span>
              <span className="text-slate-300 dark:text-slate-700">/</span>
              {isAiStudio ? (
                <div key="breadcrumb-ai-studio" className="flex items-center space-x-1.5">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {activeCompany?.name || "Overview"}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">/</span>
                  <h1 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-1">
                    <Sparkles className="h-3.5 w-3.5 text-indigo-500 mr-1" />
                    <span>AI Studio</span>
                  </h1>
                </div>
              ) : isEmployees ? (
                <div key="breadcrumb-employees" className="flex items-center space-x-1.5">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {activeCompany?.name || "Overview"}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">/</span>
                  <h1 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-1">
                    <Users className="h-3.5 w-3.5 text-[#2F5BFF] mr-1" />
                    <span>Employees</span>
                  </h1>
                </div>
              ) : isLeaveRequests ? (
                <div key="breadcrumb-leaves" className="flex items-center space-x-1.5">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {activeCompany?.name || "Overview"}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">/</span>
                  <h1 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-1">
                    <Palmtree className="h-3.5 w-3.5 text-[#FF7A59] mr-1" />
                    <span>Leave Requests</span>
                  </h1>
                </div>
              ) : isLocations ? (
                <div key="breadcrumb-locations" className="flex items-center space-x-1.5">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {activeCompany?.name || "Overview"}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">/</span>
                  <h1 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-1">
                    <Store className="h-3.5 w-3.5 text-[#2F5BFF] mr-1" />
                    <span>Locations</span>
                  </h1>
                </div>
              ) : isSkills ? (
                <div key="breadcrumb-skills" className="flex items-center space-x-1.5">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {activeCompany?.name || "Overview"}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">/</span>
                  <h1 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-1">
                    <Award className="h-3.5 w-3.5 text-[#FF7A59] mr-1" />
                    <span>Skills Matrix</span>
                  </h1>
                </div>
              ) : isAiLogs ? (
                <div key="breadcrumb-ailogs" className="flex items-center space-x-1.5">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {activeCompany?.name || "Overview"}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">/</span>
                  <h1 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-1">
                    <Terminal className="h-3.5 w-3.5 text-[#2F5BFF] mr-1" />
                    <span>AI Audit Logs</span>
                  </h1>
                </div>
              ) : isBilling ? (
                <div key="breadcrumb-billing" className="flex items-center space-x-1.5">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {activeCompany?.name || "Overview"}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">/</span>
                  <h1 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-1">
                    <CreditCard className="h-3.5 w-3.5 text-emerald-500 mr-1" />
                    <span>Billing & Quota</span>
                  </h1>
                </div>
              ) : isConstraints ? (
                <div key="breadcrumb-constraints" className="flex items-center space-x-1.5">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {activeCompany?.name || "Overview"}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">/</span>
                  <h1 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-1">
                    <Sliders className="h-3.5 w-3.5 text-[#2F5BFF] mr-1" />
                    <span>Constraints</span>
                  </h1>
                </div>
              ) : isCalendar ? (
                <div key="breadcrumb-calendar" className="flex items-center space-x-1.5">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {activeCompany?.name || "Overview"}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">/</span>
                  <h1 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-1">
                    <Calendar className="h-3.5 w-3.5 text-[#2F5BFF] mr-1" />
                    <span>Calendar</span>
                  </h1>
                </div>
              ) : isAnalytics ? (
                <div key="breadcrumb-analytics" className="flex items-center space-x-1.5">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {activeCompany?.name || "Overview"}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">/</span>
                  <h1 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-1">
                    <BarChart3 className="h-3.5 w-3.5 text-[#FF7A59] mr-1" />
                    <span>Analytics</span>
                  </h1>
                </div>
              ) : isSettings ? (
                <div key="breadcrumb-settings" className="flex items-center space-x-1.5">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {activeCompany?.name || "Overview"}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">/</span>
                  <h1 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-1">
                    <Settings className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400 mr-1" />
                    <span>Settings</span>
                  </h1>
                </div>
              ) : isProfile ? (
                <div key="breadcrumb-profile" className="flex items-center space-x-1.5">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {activeCompany?.name || "Overview"}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">/</span>
                  <h1 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-1">
                    <User className="h-3.5 w-3.5 text-[#2F5BFF] mr-1" />
                    <span>Profile</span>
                  </h1>
                </div>
              ) : isAdminOverview ? (
                <div key="breadcrumb-admin" className="flex items-center space-x-1.5">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    Platform Console
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">/</span>
                  <h1 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-indigo-600 mr-1" />
                    <span>Platform Overview</span>
                  </h1>
                </div>
              ) : isAdminUsers ? (
                <div key="breadcrumb-admin-users" className="flex items-center space-x-1.5">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    Platform Console
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">/</span>
                  <h1 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-1">
                    <Users className="h-3.5 w-3.5 text-[#2F5BFF] mr-1" />
                    <span>Global Users</span>
                  </h1>
                </div>
              ) : isAdminCompanies ? (
                <div key="breadcrumb-admin-companies" className="flex items-center space-x-1.5">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    Platform Console
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">/</span>
                  <h1 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-1">
                    <Building2 className="h-3.5 w-3.5 text-[#2F5BFF] mr-1" />
                    <span>Tenants Registry</span>
                  </h1>
                </div>
              ) : (
                <h1 key="breadcrumb-overview" className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                  {activeCompany?.name || "Overview"}
                </h1>
              )}
            </div>
          </div>

          {/* Center: Mobile Logo (< sm) or Desktop Search (>= lg) */}
          <div className="flex sm:hidden items-center justify-center">
            <Link href="/dashboard" className="flex items-center" aria-label="Go to Dashboard">
              <Image
                src={logoSrc}
                alt="ORBIT"
                width={100}
                height={26}
                className="h-6 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          <div className="hidden lg:flex items-center max-w-xs w-full mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                readOnly
                placeholder="Search staff, shifts, constraints... (Ctrl+K)"
                className="w-full pl-9 pr-3.5 py-2 text-xs rounded-full border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5BFF]/50"
              />
            </div>
          </div>

          {/* Right: Actions, Theme Toggle, Company Switcher, Profile */}
          <div className="flex items-center space-x-1.5 sm:space-x-2.5">

            {/* ORBIT Product Owner Status Pill */}
            {isSuperAdmin && (
              <Link
                href="/dashboard/admin"
                className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800 text-[11px] font-bold text-indigo-700 dark:text-indigo-300 shadow-2xs hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition"
                title="ORBIT SaaS Product Owner Platform Console"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-amber-500" />
                <span>ORBIT PRODUCT OWNER</span>
              </Link>
            )}

            {/* Exit Dashboard Button (Desktop) */}
            <Link
              href="/"
              className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-[#2F5BFF]/50"
              title="Exit Dashboard and return to Website"
              aria-label="Exit Dashboard"
            >
              <Home className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span>Exit dashboard</span>
            </Link>
            
            {/* Dark Mode Toggle Button (Desktop) */}
            <button
              type="button"
              onClick={toggleTheme}
              className="hidden sm:inline-flex p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#2F5BFF]/50"
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-slate-600" />
              )}
            </button>

            {/* Notification Bell (Always visible on mobile & desktop) */}
            <button
              type="button"
              className="relative p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#2F5BFF]/50"
              aria-label="Notifications"
            >
              <Bell className="h-4.5 w-4.5 sm:h-4 sm:w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#2F5BFF]"></span>
            </button>

            {/* Company Switcher Dropdown (Desktop) */}
            {companies.length > 0 && (
              <div className="relative hidden sm:block" ref={companyMenuRef}>
                <button
                  type="button"
                  onClick={() => setCompanyDropdownOpen(!companyDropdownOpen)}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-full border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#2F5BFF]/50 shadow-sm"
                >
                  <Building2 className="h-3.5 w-3.5 text-[#2F5BFF] shrink-0" />
                  <span className="max-w-[110px] truncate">{activeCompany?.name || "Workspace"}</span>
                  <ChevronDown className="h-3 w-3 text-slate-400" />
                </button>

                {companyDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 p-2 shadow-xl z-40 space-y-1 animate-fade-in">
                    <div className="px-3 py-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                      Switch workspace
                    </div>
                    {companies.map((comp) => (
                      <button
                        key={comp.id}
                        type="button"
                        onClick={() => {
                          switchCompany(comp.id);
                          setCompanyDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs rounded-2xl transition flex items-center justify-between cursor-pointer ${
                          comp.id === activeCompany?.id
                            ? "bg-indigo-50 dark:bg-indigo-950/60 font-semibold text-[#2F2C59] dark:text-indigo-300"
                            : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                      >
                        <span className="truncate">{comp.name}</span>
                        {comp.id === activeCompany?.id && (
                          <CheckCircle2 className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Profile Avatar & Dropdown (Desktop) */}
            <div className="relative hidden sm:block" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#2F5BFF]/50"
                aria-label="User profile menu"
              >
                <UserAvatar
                  src={user?.avatar_url}
                  name={user?.full_name}
                  size="sm"
                />
                <div className="hidden md:block text-left text-xs pr-1">
                  <div className="font-semibold text-slate-800 dark:text-slate-200 max-w-[100px] truncate leading-tight">
                    {user?.full_name?.split(" ")[0]}
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">
                    {activeCompany?.role || user?.account_type}
                  </div>
                </div>
                <ChevronDown className="h-3 w-3 text-slate-400 hidden sm:block" />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 p-2.5 shadow-xl z-40 space-y-2 animate-fade-in text-xs">
                  {/* User summary card */}
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
                    <div className="font-semibold text-slate-900 dark:text-white truncate">
                      {user?.full_name}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {user?.email}
                    </div>
                    <div className="mt-1.5 flex items-center space-x-1.5">
                      <span className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full">
                        {user?.account_type}
                      </span>
                      {activeCompany?.role && (
                        <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-slate-200/70 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                          {activeCompany.role}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Live Role Simulation Control */}
                  <div className="p-2.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-indigo-900 dark:text-indigo-200">
                      <span>Simulate Role:</span>
                      {simulatedRole && (
                        <button
                          type="button"
                          onClick={() => setSimulatedRole(null)}
                          className="text-[10px] text-indigo-600 dark:text-indigo-400 underline hover:no-underline cursor-pointer"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 text-[10px] font-semibold">
                      <button
                        type="button"
                        onClick={() => setSimulatedRole("SUPER_ADMIN")}
                        className={`px-2 py-1.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center ${
                          isSuperAdmin
                            ? "bg-[#2F2C59] text-white border-[#2F2C59] shadow-xs"
                            : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span className="font-bold">Product Owner</span>
                        <span className={`text-[9px] ${isSuperAdmin ? "text-amber-300" : "text-slate-400"}`}>ORBIT SaaS</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSimulatedRole("COMPANY_ADMIN")}
                        className={`px-2 py-1.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center ${
                          !isSuperAdmin && isCompanyAdmin
                            ? "bg-[#2F5BFF] text-white border-[#2F5BFF] shadow-xs"
                            : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span className="font-bold">Business Owner</span>
                        <span className={`text-[9px] ${!isSuperAdmin && isCompanyAdmin ? "text-blue-100" : "text-slate-400"}`}>Client Tenant</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSimulatedRole("STORE_MANAGER")}
                        className={`px-2 py-1.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center ${
                          !isSuperAdmin && isStoreManager
                            ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                            : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span className="font-bold">Store Manager</span>
                        <span className={`text-[9px] ${!isSuperAdmin && isStoreManager ? "text-amber-100" : "text-slate-400"}`}>Branch Shifts</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSimulatedRole("STAFF")}
                        className={`px-2 py-1.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center ${
                          !isSuperAdmin && isStaff
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                            : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span className="font-bold">Staff Member</span>
                        <span className={`text-[9px] ${!isSuperAdmin && isStaff ? "text-emerald-100" : "text-slate-400"}`}>Roster & Leave</span>
                      </button>
                    </div>
                  </div>

                  {/* Menu Links */}
                  <div className="space-y-0.5 pt-0.5">
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="w-full flex items-center space-x-2 px-3 py-2 rounded-2xl text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
                    >
                      <User className="h-4 w-4 text-slate-400" />
                      <span>Profile</span>
                    </Link>

                    <Link
                      href="/"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="w-full flex items-center space-x-2 px-3 py-2 rounded-2xl text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
                    >
                      <Home className="h-4 w-4 text-slate-400" />
                      <span>Exit dashboard</span>
                    </Link>


                    <button
                      type="button"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        toggleTheme();
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        {theme === "dark" ? (
                          <Sun className="h-4 w-4 text-amber-400" />
                        ) : (
                          <Moon className="h-4 w-4 text-slate-400" />
                        )}
                        <span>Theme</span>
                      </div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400">
                        {theme}
                      </span>
                    </button>
                  </div>

                  {/* Sign out */}
                  <div className="pt-1 border-t border-slate-100 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-2.5 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer font-medium"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </header>
    </>
  );
}
