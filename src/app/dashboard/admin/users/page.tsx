"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  ShieldCheck,
  Building2,
  Search,
  Lock,
  Unlock,
  UserCheck,
  Mail,
  Phone,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { KpiCard } from "@/components/ui/KpiCard";
import { Card } from "@/components/ui/Card";
import { PillButton } from "@/components/ui/PillButton";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { useAuth } from "@/context/AuthContext";

interface PlatformUser {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  phone_number?: string;
  account_type: "BUSINESS" | "PERSONAL";
  platform_role: "SUPER_ADMIN" | "USER";
  is_active: boolean;
  created_at: string;
  company_count?: number;
  companies?: string[];
}

const INITIAL_USERS: PlatformUser[] = [
  {
    id: "usr-01",
    email: "alex.danvers@orbitops.ai",
    full_name: "Alex Danvers",
    phone_number: "+1 (555) 234-5678",
    account_type: "BUSINESS",
    platform_role: "SUPER_ADMIN",
    is_active: true,
    created_at: "2026-01-15T08:30:00Z",
    company_count: 8,
    companies: ["The Coffee House Specialty", "Metro Retail Stores"],
  },
  {
    id: "usr-02",
    email: "elena.rostova@metro.com",
    full_name: "Elena Rostova",
    phone_number: "+1 (555) 876-5432",
    account_type: "BUSINESS",
    platform_role: "USER",
    is_active: true,
    created_at: "2026-02-10T14:15:00Z",
    company_count: 5,
    companies: ["Metro Retail Stores"],
  },
  {
    id: "usr-03",
    email: "marcus.chen@tch.vn",
    full_name: "Marcus Chen",
    phone_number: "+84 90 123 4567",
    account_type: "BUSINESS",
    platform_role: "SUPER_ADMIN",
    is_active: true,
    created_at: "2026-02-28T09:45:00Z",
    company_count: 4,
    companies: ["The Coffee House Specialty"],
  },
  {
    id: "usr-04",
    email: "sarah.jenkins@zenithhealth.org",
    full_name: "Sarah Jenkins",
    phone_number: "+1 (555) 345-6789",
    account_type: "BUSINESS",
    platform_role: "USER",
    is_active: true,
    created_at: "2026-03-04T11:20:00Z",
    company_count: 3,
    companies: ["Zenith Healthcare Centers"],
  },
  {
    id: "usr-05",
    email: "kevin.nguyen@aurorahospitality.com",
    full_name: "Kevin Nguyen",
    phone_number: "+84 98 765 4321",
    account_type: "BUSINESS",
    platform_role: "USER",
    is_active: false,
    created_at: "2026-03-12T16:00:00Z",
    company_count: 2,
    companies: ["Aurora Dining & Lounges"],
  },
  {
    id: "usr-06",
    email: "david.kim@personaldev.io",
    full_name: "David Kim",
    phone_number: "+1 (555) 456-7890",
    account_type: "PERSONAL",
    platform_role: "USER",
    is_active: true,
    created_at: "2026-04-01T10:10:00Z",
    company_count: 1,
    companies: ["Kim Shift Labs"],
  },
  {
    id: "usr-07",
    email: "jordan.taylor@orbitops.ai",
    full_name: "Jordan Taylor",
    phone_number: "+1 (555) 789-0123",
    account_type: "BUSINESS",
    platform_role: "SUPER_ADMIN",
    is_active: true,
    created_at: "2026-01-20T12:00:00Z",
    company_count: 6,
    companies: ["Platform Core Operations"],
  },
  {
    id: "usr-08",
    email: "rachel.green@coffeegrid.co",
    full_name: "Rachel Green",
    phone_number: "+1 (555) 654-3210",
    account_type: "BUSINESS",
    platform_role: "USER",
    is_active: false,
    created_at: "2026-05-18T15:30:00Z",
    company_count: 1,
    companies: ["Coffee Grid Central"],
  },
];

export default function AdminUsersPage() {
  const { user: currentUser, isSuperAdmin, setSimulatedRole } = useAuth();
  const [users, setUsers] = useState<PlatformUser[]>(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [accountTypeFilter, setAccountTypeFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filtered users calculation
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.phone_number && u.phone_number.includes(searchQuery));

      const matchType =
        accountTypeFilter === "all" || u.account_type === accountTypeFilter;
      const matchRole =
        roleFilter === "all" || u.platform_role === roleFilter;
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && u.is_active) ||
        (statusFilter === "inactive" && !u.is_active);

      return matchSearch && matchType && matchRole && matchStatus;
    });
  }, [users, searchQuery, accountTypeFilter, roleFilter, statusFilter]);

  // Toast notification helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Toggle User Active Status (Lock / Unlock)
  const handleToggleStatus = (targetUser: PlatformUser) => {
    if (currentUser?.email === targetUser.email && targetUser.is_active) {
      alert("Safety Safeguard: You cannot lock your currently active Super Admin account.");
      return;
    }

    const updatedStatus = !targetUser.is_active;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === targetUser.id ? { ...u, is_active: updatedStatus } : u
      )
    );

    showToast(
      `Account ${targetUser.email} has been ${
        updatedStatus ? "unlocked and activated" : "locked and suspended"
      }.`
    );
  };

  // Toggle Super Admin Role
  const handleToggleRole = (targetUser: PlatformUser) => {
    if (currentUser?.email === targetUser.email && targetUser.platform_role === "SUPER_ADMIN") {
      alert("Safety Safeguard: You cannot revoke Super Admin privileges from yourself.");
      return;
    }

    const newRole: "SUPER_ADMIN" | "USER" =
      targetUser.platform_role === "SUPER_ADMIN" ? "USER" : "SUPER_ADMIN";

    setUsers((prev) =>
      prev.map((u) =>
        u.id === targetUser.id ? { ...u, platform_role: newRole } : u
      )
    );

    showToast(
      `Role for ${targetUser.email} updated to ${
        newRole === "SUPER_ADMIN" ? "Super Admin" : "Standard User"
      }.`
    );
  };

  // Count aggregates
  const stats = useMemo(() => {
    return {
      total: users.length,
      active: users.filter((u) => u.is_active).length,
      superAdmins: users.filter((u) => u.platform_role === "SUPER_ADMIN").length,
      deactivated: users.filter((u) => !u.is_active).length,
    };
  }, [users]);

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Toast alert banner */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2.5 rounded-2xl bg-slate-900 text-white px-5 py-3.5 shadow-2xl border border-slate-700 animate-fade-in text-xs font-medium">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Super Admin Authorization Check Banner */}
        {!isSuperAdmin && (
          <div className="rounded-3xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-5 text-amber-900 dark:text-amber-200 shadow-xs">
            <div className="flex items-start space-x-3.5">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="text-sm font-bold">
                  Restricted Platform Area — Super Admin Required
                </div>
                <div className="text-xs text-amber-800 dark:text-amber-300">
                  You are viewing the User Directory in preview mode. Only platform operators with the
                  <span className="font-semibold text-amber-950 dark:text-amber-100"> SUPER_ADMIN </span>
                  role can execute account suspensions and role promotions.
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setSimulatedRole("SUPER_ADMIN")}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Emulate Super Admin Role</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 1. PAGE HEADER ================= */}
        <PageHeader
          eyebrow="ORBIT Platform Security • Access Control"
          title="Global User Directory"
          description="Audit all registered platform accounts, lock or unlock access, and manage SaaS Product Owner authorization privileges."
          actions={
            <>
              <Link href="/dashboard/admin/companies">
                <PillButton variant="info">
                  <Building2 className="h-3.5 w-3.5 text-slate-500" />
                  <span>Customer Tenants</span>
                </PillButton>
              </Link>
              <Link href="/dashboard/admin">
                <PillButton variant="primary">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Platform Overview</span>
                </PillButton>
              </Link>
            </>
          }
        />

        {/* ================= 2. KPI METRICS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <KpiCard
            label="Total Accounts"
            value={stats.total}
            chip="All tenants"
            chipVariant="neutral"
            note="Registered users across SaaS"
            icon={Users}
            iconVariant="indigo"
          />

          <KpiCard
            label="Active Accounts"
            value={stats.active}
            chip={`${Math.round((stats.active / (stats.total || 1)) * 100)}% healthy`}
            chipVariant="success"
            note="Valid authentication status"
            icon={UserCheck}
            iconVariant="emerald"
          />

          <KpiCard
            label="Product Owners"
            value={stats.superAdmins}
            chip="Root access"
            chipVariant="info"
            note="Full platform operations"
            icon={ShieldCheck}
            iconVariant="blue"
          />

          <KpiCard
            label="Locked Accounts"
            value={stats.deactivated}
            valueClass="text-rose-600 dark:text-rose-400"
            chip={stats.deactivated > 0 ? "Restricted" : "0 locked"}
            chipVariant={stats.deactivated > 0 ? "warning" : "neutral"}
            note="Immediate login suspension"
            icon={Lock}
            iconVariant="orange"
          />
        </div>

        {/* ================= 3. SEARCH & FILTERS BAR ================= */}
        <Card padding="md" className="space-y-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by user name, email, or telephone number..."
                className="w-full pl-10 pr-4 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#2F5BFF]/30"
              />
            </div>

            {/* Filter selectors */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={accountTypeFilter}
                onChange={(e) => setAccountTypeFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#2F5BFF]/30 cursor-pointer"
              >
                <option value="all">All Account Types</option>
                <option value="BUSINESS">Business Accounts</option>
                <option value="PERSONAL">Personal Accounts</option>
              </select>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#2F5BFF]/30 cursor-pointer"
              >
                <option value="all">All Platform Roles</option>
                <option value="SUPER_ADMIN">Product Owners Only</option>
                <option value="USER">Standard Users</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#2F5BFF]/30 cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Accounts</option>
                <option value="inactive">Locked Accounts</option>
              </select>

              {(searchQuery || accountTypeFilter !== "all" || roleFilter !== "all" || statusFilter !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setAccountTypeFilter("all");
                    setRoleFilter("all");
                    setStatusFilter("all");
                  }}
                  className="px-3 py-2 text-xs font-semibold rounded-full text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </Card>

        {/* ================= 4. USERS DIRECTORY TABLE ================= */}
        <Card padding="none" className="overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Platform Accounts Directory
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Showing {filteredUsers.length} of {users.length} accounts
              </p>
            </div>
            <div className="text-[11px] font-semibold text-slate-400">
              API: <span className="font-mono text-slate-600 dark:text-slate-300">/api/admin/users</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  <th className="py-3 px-4 sm:px-5">User Identity</th>
                  <th className="py-3 px-4">Contact Info</th>
                  <th className="py-3 px-4">Account Type</th>
                  <th className="py-3 px-4">Platform Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Tenants</th>
                  <th className="py-3 px-4 sm:px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 dark:text-slate-500">
                      No user accounts found matching your query.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const isSelf = currentUser?.email === u.email;
                    return (
                      <tr
                        key={u.id}
                        className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                      >
                        {/* User Identity */}
                        <td className="py-3.5 px-4 sm:px-5">
                          <div className="flex items-center space-x-3">
                            <UserAvatar
                              src={u.avatar_url}
                              name={u.full_name}
                              size="sm"
                              className="shrink-0"
                            />
                            <div>
                              <div className="font-semibold text-slate-900 dark:text-white flex items-center space-x-1.5">
                                <span>{u.full_name}</span>
                                {isSelf && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-[#2F5BFF] dark:text-blue-300 font-bold">
                                    YOU
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                Joined {new Date(u.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Contact Info */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5">
                            <div className="flex items-center space-x-1 text-slate-700 dark:text-slate-300">
                              <Mail className="h-3 w-3 text-slate-400 shrink-0" />
                              <span className="truncate max-w-[180px]">{u.email}</span>
                            </div>
                            {u.phone_number && (
                              <div className="flex items-center space-x-1 text-slate-500 dark:text-slate-400 text-[11px]">
                                <Phone className="h-3 w-3 text-slate-400 shrink-0" />
                                <span>{u.phone_number}</span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Account Type */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                              u.account_type === "BUSINESS"
                                ? "bg-indigo-50 dark:bg-indigo-950/60 text-[#2F5BFF] dark:text-indigo-300"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                            }`}
                          >
                            {u.account_type}
                          </span>
                        </td>

                        {/* Platform Role */}
                        <td className="py-3.5 px-4">
                          {u.platform_role === "SUPER_ADMIN" ? (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#2F2C59] text-white dark:bg-indigo-600 shadow-xs">
                              <ShieldCheck className="h-3 w-3 text-amber-300" />
                              <span>SUPER_ADMIN</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                              USER
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          {u.is_active ? (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                              <span>Active</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
                              <Lock className="h-3 w-3 text-rose-500" />
                              <span>Locked</span>
                            </span>
                          )}
                        </td>

                        {/* Tenants Associated */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center space-x-1 text-slate-600 dark:text-slate-300">
                            <Building2 className="h-3 w-3 text-slate-400 shrink-0" />
                            <span className="font-semibold">{u.company_count || 1}</span>
                            <span className="text-slate-400 text-[11px]">org(s)</span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 sm:px-5 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            {/* Toggle Role Button */}
                            <button
                              type="button"
                              onClick={() => handleToggleRole(u)}
                              disabled={isSelf && u.platform_role === "SUPER_ADMIN"}
                              title={
                                u.platform_role === "SUPER_ADMIN"
                                  ? "Revoke Super Admin privileges"
                                  : "Grant Super Admin role"
                              }
                              className={`p-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                                u.platform_role === "SUPER_ADMIN"
                                  ? "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100"
                                  : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                              } ${
                                isSelf && u.platform_role === "SUPER_ADMIN"
                                  ? "opacity-40 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              <ShieldCheck className="h-3.5 w-3.5" />
                            </button>

                            {/* Lock / Unlock Toggle Button */}
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(u)}
                              disabled={isSelf && u.is_active}
                              title={u.is_active ? "Lock user account" : "Unlock user account"}
                              className={`p-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                                u.is_active
                                  ? "border-rose-200 dark:border-rose-900/60 bg-rose-50/60 dark:bg-rose-950/30 text-rose-600 hover:bg-rose-100"
                                  : "border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-600 hover:bg-emerald-100"
                              } ${
                                isSelf && u.is_active
                                  ? "opacity-40 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              {u.is_active ? (
                                <Lock className="h-3.5 w-3.5 text-rose-500" />
                              ) : (
                                <Unlock className="h-3.5 w-3.5 text-emerald-500" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Security Documentation note */}
        <div className="p-4 rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="h-4 w-4 text-[#2F5BFF] shrink-0" />
            <span>
              All actions are immutably logged into the AI Audit Telemetry table and verified against JWT claims.
            </span>
          </div>
          <Link
            href="/dashboard/ai-logs"
            className="text-[#2F5BFF] hover:underline font-semibold flex items-center space-x-1"
          >
            <span>View audit logs</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
