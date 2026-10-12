"use client";

import React, { useState, useRef, useEffect } from "react";
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
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { ProfileModal } from "./ProfileModal";
import { useRouter, usePathname } from "next/navigation";

interface DashboardHeaderProps {
  onToggleSidebar?: () => void;
}

export function DashboardHeader({ onToggleSidebar }: DashboardHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isAiStudio = pathname === "/dashboard/ai-studio";
  const isEmployees = pathname === "/dashboard/employees";
  const { user, activeCompany, companies, switchCompany, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

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
        <div className="flex h-full items-center justify-between px-4 sm:px-6">

          
          {/* Left: Mobile Toggle & Breadcrumb / Status */}
          <div className="flex items-center space-x-3">
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
                Workspace
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
              ) : (
                <h1 key="breadcrumb-overview" className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                  {activeCompany?.name || "Overview"}
                </h1>
              )}
            </div>

            {/* AI Engine Status Badge */}
            <div className="hidden md:inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Deterministic AI: Online</span>
            </div>
          </div>

          {/* Center: Search input */}
          <div className="hidden lg:flex items-center max-w-xs w-full mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                readOnly
                placeholder="Search staff, shifts, constraints... (Ctrl+K)"
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:border-[#2F2C59] dark:focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Right: Actions, Theme Toggle, Company Switcher, Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Dark Mode Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-slate-600" />
              )}
            </button>

            {/* Notification Bell */}
            <button
              type="button"
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#2F5BFF]"></span>
            </button>

            {/* Company Switcher Dropdown */}
            {companies.length > 0 && (
              <div className="relative" ref={companyMenuRef}>
                <button
                  type="button"
                  onClick={() => setCompanyDropdownOpen(!companyDropdownOpen)}
                  className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/80 transition cursor-pointer"
                >
                  <Building2 className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
                  <span className="max-w-[110px] truncate">{activeCompany?.name || "Workspace"}</span>
                  <ChevronDown className="h-3 w-3 text-slate-400" />
                </button>

                {companyDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1.5 shadow-xl z-40 space-y-1 animate-fade-in">
                    <div className="px-2.5 py-1 text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Switch Workspace
                    </div>
                    {companies.map((comp) => (
                      <button
                        key={comp.id}
                        type="button"
                        onClick={() => {
                          switchCompany(comp.id);
                          setCompanyDropdownOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-2 text-xs rounded-xl transition flex items-center justify-between cursor-pointer ${
                          comp.id === activeCompany?.id
                            ? "bg-indigo-50 dark:bg-indigo-950/60 font-semibold text-[#2F2C59] dark:text-indigo-300"
                            : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60"
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

            {/* Profile Avatar & Dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                aria-label="User profile menu"
              >
                <div className="h-8 w-8 rounded-xl bg-[#2F2C59] dark:bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  {user?.full_name?.charAt(0).toUpperCase() || "U"}
                </div>
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
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 shadow-xl z-40 space-y-1.5 animate-fade-in text-xs">
                  {/* User summary card */}
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200/60 dark:border-slate-700/60">
                    <div className="font-bold text-slate-900 dark:text-white truncate">
                      {user?.full_name}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {user?.email}
                    </div>
                    <div className="mt-1 flex items-center space-x-1">
                      <span className="text-[10px] font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.2 rounded-md">
                        {user?.account_type}
                      </span>
                      {activeCompany?.role && (
                        <span className="text-[10px] font-medium text-slate-600 dark:text-slate-300 bg-slate-200/80 dark:bg-slate-600 px-1.5 py-0.2 rounded-md">
                          {activeCompany.role}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Menu Links */}
                  <div className="space-y-0.5 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        setProfileModalOpen(true);
                      }}
                      className="w-full flex items-center space-x-2 px-2.5 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition cursor-pointer"
                    >
                      <User className="h-4 w-4 text-slate-400" />
                      <span>Profile</span>
                    </button>


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

      {/* Profile Detail Modal */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </>
  );
}
