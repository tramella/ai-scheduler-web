"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Users,
  Building2,
  Cpu,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  CalendarCheck,
  Terminal,
  Zap,
  CreditCard,
  Store,
  Layers,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { KpiCard } from "@/components/ui/KpiCard";
import { Card, CARD_BASE_CLASSES } from "@/components/ui/Card";
import { StatusChip } from "@/components/ui/StatusChip";
import { PillButton } from "@/components/ui/PillButton";
import { useAuth } from "@/context/AuthContext";

/* -------------------------------------------------------------------------- */
/*  Data & Types                                                              */
/* -------------------------------------------------------------------------- */

const OVERVIEW_DATA = {
  users: {
    total: 148,
    active: 139,
    inactive: 9,
    super_admins: 3,
  },
  companies: {
    total: 24,
    active: 22,
    inactive: 2,
  },
  resources: {
    employees: 342,
    shifts: 1840,
    locations: 48,
    constraints: 112,
  },
  ai_telemetry: {
    solves_this_month: 2480,
    avg_latency_ms: 154,
    total_tokens_consumed: 3420000,
    estimated_cost_usd: 12.85,
  },
};

const RECENT_TENANTS = [
  {
    id: "CMP-01",
    name: "The Coffee House Specialty",
    code: "TCH-VN",
    owner: "Nguyen Van A",
    email: "owner@tch.vn",
    stores: 8,
    staff: 64,
    plan: "Enterprise",
    status: "Active",
    joined: "Oct 12, 2026",
  },
  {
    id: "CMP-02",
    name: "Metro Retail Stores",
    code: "METRO-RET",
    owner: "Tran Thi B",
    email: "admin@metro.com",
    stores: 5,
    staff: 42,
    plan: "Growth",
    status: "Active",
    joined: "Oct 10, 2026",
  },
  {
    id: "CMP-03",
    name: "Apex Healthcare Clinic",
    code: "APEX-MED",
    owner: "Dr. Le Hoang",
    email: "hr@apexmed.vn",
    stores: 2,
    staff: 18,
    plan: "Enterprise",
    status: "Active",
    joined: "Oct 08, 2026",
  },
  {
    id: "CMP-04",
    name: "Aurora Dining & Lounges",
    code: "AURORA-DINE",
    owner: "Kevin Nguyen",
    email: "kevin@aurora.com",
    stores: 3,
    staff: 28,
    plan: "Growth",
    status: "Active",
    joined: "Sep 28, 2026",
  },
];

/* -------------------------------------------------------------------------- */
/*  Visual Elements matching User Dashboard                                   */
/* -------------------------------------------------------------------------- */

function UptimeRing({ percent }: { percent: number }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative h-28 w-28 shrink-0">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="9" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="white"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - percent / 100)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-semibold tabular-nums text-white">{percent}%</span>
        <span className="text-[11px] text-white/60">uptime</span>
      </div>
    </div>
  );
}

function MiniSparkline({ values, barClass }: { values: number[]; barClass: string }) {
  const max = Math.max(...values);
  return (
    <div className="flex h-9 items-end gap-1" aria-hidden>
      {values.map((v, i) => (
        <div
          key={i}
          className={`flex-1 rounded-[3px] ${barClass} ${i === values.length - 1 ? "opacity-100" : "opacity-30"}`}
          style={{ height: `${Math.max(15, (v / max) * 100)}%` }}
        />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page Component                                                            */
/* -------------------------------------------------------------------------- */

export default function AdminOverviewPage() {
  const { isSuperAdmin, setSimulatedRole } = useAuth();

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Authorization banner if previewing */}
        {!isSuperAdmin && (
          <div className="rounded-3xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-5 text-amber-900 dark:text-amber-200 shadow-xs">
            <div className="flex items-start space-x-3.5">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="text-sm font-bold">
                  Restricted Platform Area — Product Owner Mode
                </div>
                <div className="text-xs text-amber-800 dark:text-amber-300">
                  You are previewing the ORBIT SaaS Product Owner console. Switch your active session to Product Owner (Super Admin) to simulate root system operations.
                </div>
                <div className="pt-2">
                  <PillButton
                    variant="primary"
                    onClick={() => setSimulatedRole("SUPER_ADMIN")}
                    className="!bg-amber-600 hover:!bg-amber-700"
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Emulate Product Owner Role</span>
                  </PillButton>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 1. PAGE HEADER ================= */}
        <PageHeader
          eyebrow="ORBIT Platform Operations • SaaS Root Console"
          title="Platform Overview"
          description="Global multi-tenant metrics, cross-organization resource allocation, and AI solver telemetry."
          actions={
            <>
              <Link href="/dashboard/admin/companies">
                <PillButton variant="info">
                  <Building2 className="h-3.5 w-3.5 text-slate-500" />
                  <span>Customer Tenants ({OVERVIEW_DATA.companies.total})</span>
                </PillButton>
              </Link>
              <Link href="/dashboard/admin/users">
                <PillButton variant="primary">
                  <Users className="h-3.5 w-3.5" />
                  <span>User Directory</span>
                </PillButton>
              </Link>
            </>
          }
        />

        {/* ================= 2. ROW 1: HERO + KPIS ================= */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* Hero Card: Platform Engine Health */}
          <section
            aria-label="Platform Engine Health"
            className="relative overflow-hidden rounded-3xl bg-[#2F2C59] p-6 text-white lg:col-span-4 flex flex-col justify-between"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-white/[0.04]" />
            <div className="pointer-events-none absolute -bottom-20 -left-10 h-44 w-44 rounded-full bg-white/[0.04]" />

            <div>
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60">Solver engine health</p>
                  <p className="mt-1 text-4xl font-semibold tabular-nums tracking-tight">
                    99.98%
                    <span className="ml-1.5 text-base font-normal text-white/60">SLA</span>
                  </p>
                </div>
                <UptimeRing percent={100} />
              </div>

              <ul className="relative mt-6 space-y-3">
                <li className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2.5 text-white/80">
                    <span className="h-2 w-2 rounded-full bg-[#6F8CFF]" />
                    AI Solves (Month)
                  </span>
                  <span className="font-semibold tabular-nums">
                    {OVERVIEW_DATA.ai_telemetry.solves_this_month.toLocaleString()}
                  </span>
                </li>
                <li className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2.5 text-white/80">
                    <span className="h-2 w-2 rounded-full bg-[#FF7A59]" />
                    Avg Solver Latency
                  </span>
                  <span className="font-semibold tabular-nums">
                    {OVERVIEW_DATA.ai_telemetry.avg_latency_ms} ms
                  </span>
                </li>
                <li className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2.5 text-white/80">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Est. Cloud AI Cost
                  </span>
                  <span className="font-semibold tabular-nums">
                    ${OVERVIEW_DATA.ai_telemetry.estimated_cost_usd}
                  </span>
                </li>
              </ul>
            </div>

            <Link
              href="/dashboard/ai-logs"
              className="relative mt-6 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-white px-4 py-2.5 text-xs font-semibold text-[#2F2C59] transition hover:bg-white/90"
            >
              <span>Inspect Telemetry & AI Logs</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </section>

          {/* 4 Standardized KPI Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-8">
            <KpiCard
              label="Global Accounts"
              value={OVERVIEW_DATA.users.total}
              chip={`${Math.round((OVERVIEW_DATA.users.active / OVERVIEW_DATA.users.total) * 100)}% active`}
              chipVariant="success"
              note={`${OVERVIEW_DATA.users.active} active · ${OVERVIEW_DATA.users.inactive} locked`}
              icon={Users}
              iconVariant="blue"
            >
              <MiniSparkline values={[98, 112, 126, 135, 142, 145, 148]} barClass="bg-[#2F5BFF]" />
            </KpiCard>

            <KpiCard
              label="Customer Tenants"
              value={OVERVIEW_DATA.companies.total}
              chip={`${OVERVIEW_DATA.companies.active} live`}
              chipVariant="info"
              note="Cross-organization multi-tenancy"
              icon={Building2}
              iconVariant="orange"
            >
              <MiniSparkline values={[14, 16, 18, 20, 22, 23, 24]} barClass="bg-[#FF7A59]" />
            </KpiCard>

            <KpiCard
              label="Managed Personnel"
              value={OVERVIEW_DATA.resources.employees}
              chip="48 locations"
              chipVariant="neutral"
              note={`${OVERVIEW_DATA.resources.shifts.toLocaleString()} shifts currently scheduled`}
              icon={UserCheck}
              iconVariant="indigo"
            >
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-full w-[88%] rounded-full bg-[#2F2C59] dark:bg-indigo-400" />
              </div>
            </KpiCard>

            <KpiCard
              label="Engine Verification"
              value="100%"
              valueClass="text-emerald-600 dark:text-emerald-400"
              chip="Verified"
              chipVariant="success"
              note="112 solver constraints strictly enforced"
              icon={ShieldCheck}
              iconVariant="emerald"
            >
              <div className="flex gap-1.5">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="h-2 flex-1 rounded-full bg-emerald-500" />
                ))}
              </div>
            </KpiCard>
          </div>
        </div>

        {/* ================= 3. ROW 2: TENANTS TABLE + SYSTEM RESOURCES ================= */}
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
          {/* Customer Tenants Card Table (8 cols) */}
          <Card padding="none" className="overflow-hidden lg:col-span-8">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                  Recently Subscribed Customer Tenants
                </h2>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Organizations utilizing ORBIT AI scheduling across retail, F&B, and healthcare
                </p>
              </div>

              <Link href="/dashboard/admin/companies">
                <PillButton variant="secondary" className="!text-xs">
                  <span>View All Tenants</span>
                  <ArrowRight className="h-3 w-3" />
                </PillButton>
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    <th className="py-3 px-5">Workspace & Code</th>
                    <th className="py-3 px-4">Account Owner</th>
                    <th className="py-3 px-4 text-center">Stores</th>
                    <th className="py-3 px-4 text-center">Staff Pool</th>
                    <th className="py-3 px-4">Plan Tier</th>
                    <th className="py-3 px-5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {RECENT_TENANTS.map((t) => (
                    <tr
                      key={t.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="py-3.5 px-5">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {t.name}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400">
                          {t.code} · Joined {t.joined}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                        <div className="font-medium text-slate-800 dark:text-slate-200">
                          {t.owner}
                        </div>
                        <div className="text-[11px] text-slate-400">{t.email}</div>
                      </td>

                      <td className="py-3.5 px-4 text-center font-semibold text-slate-900 dark:text-white tabular-nums">
                        {t.stores}
                      </td>

                      <td className="py-3.5 px-4 text-center font-semibold text-slate-900 dark:text-white tabular-nums">
                        {t.staff}
                      </td>

                      <td className="py-3.5 px-4">
                        <StatusChip variant={t.plan === "Enterprise" ? "info" : "neutral"}>
                          {t.plan}
                        </StatusChip>
                      </td>

                      <td className="py-3.5 px-5 text-right">
                        <StatusChip variant="success">{t.status}</StatusChip>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Showing 4 of {OVERVIEW_DATA.companies.total} total active workspaces</span>
              <Link
                href="/dashboard/admin/companies"
                className="font-semibold text-[#2F5BFF] hover:underline flex items-center gap-1"
              >
                <span>Manage all tenant quotas</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </Card>

          {/* Platform Infrastructure Sidecard (4 cols) */}
          <Card padding="lg" className="lg:col-span-4 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                  Platform Core Architecture
                </h2>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Network scale across all customer clusters
                </p>
              </div>
              <StatusChip variant="success">All Systems Live</StatusChip>
            </div>

            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="h-9 w-9 rounded-xl bg-blue-50 text-[#2F5BFF] dark:bg-blue-950/60 flex items-center justify-center">
                    <Store className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">Physical Stores</div>
                    <div className="text-[11px] text-slate-400">Connected retail branches</div>
                  </div>
                </div>
                <div className="text-base font-bold text-slate-900 dark:text-white tabular-nums">
                  {OVERVIEW_DATA.resources.locations}
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="h-9 w-9 rounded-xl bg-orange-50 text-[#FF7A59] dark:bg-orange-950/60 flex items-center justify-center">
                    <CalendarCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">Shifts Dispatched</div>
                    <div className="text-[11px] text-slate-400">Active roster slots</div>
                  </div>
                </div>
                <div className="text-base font-bold text-slate-900 dark:text-white tabular-nums">
                  {OVERVIEW_DATA.resources.shifts.toLocaleString()}
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="h-9 w-9 rounded-xl bg-indigo-50 text-[#2F2C59] dark:bg-indigo-950/60 dark:text-indigo-300 flex items-center justify-center">
                    <Layers className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">Active Rules & Labor Laws</div>
                    <div className="text-[11px] text-slate-400">Hard & soft constraints</div>
                  </div>
                </div>
                <div className="text-base font-bold text-slate-900 dark:text-white tabular-nums">
                  {OVERVIEW_DATA.resources.constraints}
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 flex items-center justify-center">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">Platform Operators</div>
                    <div className="text-[11px] text-slate-400">Product Owner credentials</div>
                  </div>
                </div>
                <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {OVERVIEW_DATA.users.super_admins}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Kernel Version 2.8.4</span>
              <Link href="/dashboard/billing" className="font-semibold text-[#2F5BFF] hover:underline">
                View Global Billing
              </Link>
            </div>
          </Card>
        </div>

      </div>
    </DashboardLayout>
  );
}
