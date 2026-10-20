"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Building2,
  Users,
  ShieldCheck,
  Search,
  Filter,
  Store,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  ExternalLink,
  Plus,
  Lock,
  Unlock,
  Layers,
  Sparkles,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { KpiCard } from "@/components/ui/KpiCard";
import { Card, CARD_BASE_CLASSES } from "@/components/ui/Card";
import { PillButton } from "@/components/ui/PillButton";
import { StatusChip } from "@/components/ui/StatusChip";
import { useAuth } from "@/context/AuthContext";

interface TenantCompany {
  id: string;
  code: string;
  name: string;
  creator: {
    full_name: string;
    email: string;
    phone_number?: string;
  };
  store_count: number;
  staff_count: number;
  subscription_tier: "Enterprise" | "Growth" | "Starter";
  is_active: boolean;
  created_at: string;
  ai_monthly_solves: number;
}

const INITIAL_COMPANIES: TenantCompany[] = [
  {
    id: "cmp-01",
    code: "TCH-VN",
    name: "The Coffee House Specialty",
    creator: {
      full_name: "Nguyen Van A",
      email: "owner@tch.vn",
      phone_number: "+84 90 123 4567",
    },
    store_count: 8,
    staff_count: 64,
    subscription_tier: "Enterprise",
    is_active: true,
    created_at: "2026-01-12T10:00:00Z",
    ai_monthly_solves: 640,
  },
  {
    id: "cmp-02",
    code: "METRO-RET",
    name: "Metro Retail Stores",
    creator: {
      full_name: "Tran Thi B",
      email: "admin@metro.com",
      phone_number: "+84 91 234 5678",
    },
    store_count: 5,
    staff_count: 42,
    subscription_tier: "Growth",
    is_active: true,
    created_at: "2026-02-04T14:30:00Z",
    ai_monthly_solves: 410,
  },
  {
    id: "cmp-03",
    code: "ZENITH-HC",
    name: "Zenith Healthcare Clinics",
    creator: {
      full_name: "Dr. Sarah Jenkins",
      email: "sarah@zenithhealth.org",
      phone_number: "+1 (555) 345-6789",
    },
    store_count: 4,
    staff_count: 36,
    subscription_tier: "Enterprise",
    is_active: true,
    created_at: "2026-02-18T09:15:00Z",
    ai_monthly_solves: 520,
  },
  {
    id: "cmp-04",
    code: "AURORA-DINE",
    name: "Aurora Dining & Lounges",
    creator: {
      full_name: "Kevin Nguyen",
      email: "kevin@aurora.com",
      phone_number: "+84 98 765 4321",
    },
    store_count: 3,
    staff_count: 28,
    subscription_tier: "Growth",
    is_active: false,
    created_at: "2026-03-01T16:45:00Z",
    ai_monthly_solves: 120,
  },
  {
    id: "cmp-05",
    code: "NEXUS-FIT",
    name: "Nexus Wellness Studios",
    creator: {
      full_name: "Marcus Vance",
      email: "mvance@nexusfit.co",
      phone_number: "+1 (555) 789-0123",
    },
    store_count: 6,
    staff_count: 48,
    subscription_tier: "Enterprise",
    is_active: true,
    created_at: "2026-03-22T11:20:00Z",
    ai_monthly_solves: 380,
  },
  {
    id: "cmp-06",
    code: "BAKERY-ART",
    name: "Artisan Bread Collective",
    creator: {
      full_name: "Chloe Dupont",
      email: "cdupont@artisanbake.fr",
      phone_number: "+33 6 12 34 56 78",
    },
    store_count: 2,
    staff_count: 14,
    subscription_tier: "Starter",
    is_active: true,
    created_at: "2026-04-05T08:00:00Z",
    ai_monthly_solves: 95,
  },
];

export default function AdminCompaniesPage() {
  const { isSuperAdmin, setSimulatedRole } = useAuth();
  const [companies, setCompanies] = useState<TenantCompany[]>(INITIAL_COMPANIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Toggle company active status
  const handleToggleStatus = (company: TenantCompany) => {
    const nextStatus = !company.is_active;
    setCompanies((prev) =>
      prev.map((c) =>
        c.id === company.id ? { ...c, is_active: nextStatus } : c
      )
    );
    showToast(
      `Tenant ${company.name} (${company.code}) has been ${
        nextStatus ? "reactivated" : "suspended"
      }.`
    );
  };

  // Filtered tenants calculation
  const filteredCompanies = useMemo(() => {
    return companies.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.creator.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.creator.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchTier = tierFilter === "all" || c.subscription_tier === tierFilter;
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && c.is_active) ||
        (statusFilter === "inactive" && !c.is_active);

      return matchSearch && matchTier && matchStatus;
    });
  }, [companies, searchQuery, tierFilter, statusFilter]);

  // Aggregated KPIs
  const stats = useMemo(() => {
    return {
      total: companies.length,
      active: companies.filter((c) => c.is_active).length,
      stores: companies.reduce((acc, c) => acc + c.store_count, 0),
      staff: companies.reduce((acc, c) => acc + c.staff_count, 0),
      enterpriseCount: companies.filter((c) => c.subscription_tier === "Enterprise").length,
    };
  }, [companies]);

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
                  Tenant registry inspection and subscription override controls require the
                  <span className="font-semibold text-amber-950 dark:text-amber-100"> SUPER_ADMIN </span>
                  privilege level.
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
          eyebrow="ORBIT Platform Operations • Multi-Tenant Registry"
          title="Customer Organizations"
          description="Audit all customer workspaces, track subscribed plan quotas, and monitor store distribution across the network."
          actions={
            <>
              <Link href="/dashboard/admin/users">
                <PillButton variant="info">
                  <Users className="h-3.5 w-3.5 text-slate-500" />
                  <span>User Directory</span>
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
            label="Total Workspaces"
            value={stats.total}
            chip={`${stats.active} Active`}
            chipVariant="success"
            note="Customer businesses enrolled"
            icon={Building2}
            iconVariant="indigo"
          />

          <KpiCard
            label="Network Stores"
            value={stats.stores}
            chip="All branches"
            chipVariant="info"
            note="Managed physical locations"
            icon={Store}
            iconVariant="blue"
          />

          <KpiCard
            label="Enrolled Workforce"
            value={stats.staff}
            chip="Staff pool"
            chipVariant="neutral"
            note="Cross-organization staff count"
            icon={Users}
            iconVariant="orange"
          />

          <KpiCard
            label="Enterprise Tiers"
            value={stats.enterpriseCount}
            chip="Custom SLA"
            chipVariant="info"
            note="Deterministic priority solvers"
            icon={CreditCard}
            iconVariant="emerald"
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
                placeholder="Search by company code (e.g. TCH-VN), workspace name, or creator..."
                className="w-full pl-10 pr-4 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#2F5BFF]/30"
              />
            </div>

            {/* Filter Selectors */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#2F5BFF]/30 cursor-pointer"
              >
                <option value="all">All Subscription Tiers</option>
                <option value="Enterprise">Enterprise Tier</option>
                <option value="Growth">Growth Tier</option>
                <option value="Starter">Starter Tier</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#2F5BFF]/30 cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Tenants</option>
                <option value="inactive">Suspended Tenants</option>
              </select>

              {(searchQuery || tierFilter !== "all" || statusFilter !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setTierFilter("all");
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

        {/* ================= 4. TENANTS TABLE ================= */}
        <Card padding="none" className="overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Multi-Tenant Registry Directory
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Showing {filteredCompanies.length} of {companies.length} workspaces
              </p>
            </div>
            <div className="text-[11px] font-semibold text-slate-400">
              API: <span className="font-mono text-slate-600 dark:text-slate-300">/api/admin/companies</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  <th className="py-3 px-4 sm:px-5">Workspace / Code</th>
                  <th className="py-3 px-4">Creator / Owner</th>
                  <th className="py-3 px-4 text-center">Stores</th>
                  <th className="py-3 px-4 text-center">Staff Capacity</th>
                  <th className="py-3 px-4">Plan Tier</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 sm:px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredCompanies.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 dark:text-slate-500">
                      No customer workspaces found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredCompanies.map((c) => (
                    <tr
                      key={c.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      {/* Workspace & Code */}
                      <td className="py-3.5 px-4 sm:px-5">
                        <div className="flex items-center space-x-3">
                          <div className="h-9 w-9 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#2F5BFF] flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900/50">
                            <Building2 className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-white">
                              {c.name}
                            </div>
                            <div className="text-[11px] font-mono text-slate-400">
                              {c.code} • Joined {new Date(c.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Creator */}
                      <td className="py-3.5 px-4">
                        <div>
                          <div className="font-medium text-slate-800 dark:text-slate-200">
                            {c.creator.full_name}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            {c.creator.email}
                          </div>
                        </div>
                      </td>

                      {/* Store Count */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                          {c.store_count}
                        </span>
                        <span className="text-[11px] text-slate-400 ml-1">branches</span>
                      </td>

                      {/* Staff Count */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                          {c.staff_count}
                        </span>
                        <span className="text-[11px] text-slate-400 ml-1">users</span>
                      </td>

                      {/* Plan Tier */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            c.subscription_tier === "Enterprise"
                              ? "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/60"
                              : c.subscription_tier === "Growth"
                              ? "bg-blue-50 dark:bg-blue-950/60 text-[#2F5BFF] dark:text-blue-300"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          <CreditCard className="h-3 w-3" />
                          <span>{c.subscription_tier}</span>
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {c.is_active ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                            <span>Active</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
                            <Lock className="h-3 w-3 text-rose-500" />
                            <span>Suspended</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 sm:px-5 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(c)}
                            title={c.is_active ? "Suspend workspace" : "Activate workspace"}
                            className={`p-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                              c.is_active
                                ? "border-rose-200 dark:border-rose-900/60 bg-rose-50/60 dark:bg-rose-950/30 text-rose-600 hover:bg-rose-100"
                                : "border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-600 hover:bg-emerald-100"
                            }`}
                          >
                            {c.is_active ? (
                              <Lock className="h-3.5 w-3.5 text-rose-500" />
                            ) : (
                              <Unlock className="h-3.5 w-3.5 text-emerald-500" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Telemetry info footer */}
        <div className="p-4 rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-[#2F5BFF] shrink-0" />
            <span>
              Multi-tenant data isolation strictly enforced by tenant company keys in every MongoDB aggregation pipeline.
            </span>
          </div>
          <Link
            href="/dashboard/billing"
            className="text-[#2F5BFF] hover:underline font-semibold flex items-center space-x-1"
          >
            <span>View billing tiers</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
