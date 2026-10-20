"use client";

import React, { useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  Users,
  Store,
  Download,
  Check,
  Receipt,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { PillButton } from "@/components/ui/PillButton";
import { StatusChip } from "@/components/ui/StatusChip";

export interface InvoiceItem {
  id: string;
  date: string;
  amount: string;
  status: "PAID" | "PENDING";
  plan: string;
  pdf_url?: string;
}

const INVOICES: InvoiceItem[] = [
  {
    id: "INV-2026-003",
    date: "2026-10-01",
    amount: "$79.00",
    status: "PAID",
    plan: "Pro Plan (Monthly)",
  },
  {
    id: "INV-2026-002",
    date: "2026-09-01",
    amount: "$79.00",
    status: "PAID",
    plan: "Pro Plan (Monthly)",
  },
  {
    id: "INV-2026-001",
    date: "2026-08-01",
    amount: "$79.00",
    status: "PAID",
    plan: "Pro Plan (Monthly)",
  },
];

const DAILY_USAGE_DATA = [
  { day: "Oct 08", tokens: 1840, solves: 2 },
  { day: "Oct 09", tokens: 2450, solves: 3 },
  { day: "Oct 10", tokens: 1200, solves: 1 },
  { day: "Oct 11", tokens: 3100, solves: 4 },
  { day: "Oct 12", tokens: 2800, solves: 3 },
  { day: "Oct 13", tokens: 1950, solves: 2 },
  { day: "Oct 14", tokens: 3650, solves: 5 },
];

export default function BillingPage() {
  const [invoices] = useState<InvoiceItem[]>(INVOICES);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const currentPlan = {
    name: "Professional",
    tagline: "Autonomous shift scheduling for growing retail & cafe teams",
    price: "$79",
    billingCycle: "Billed monthly",
    renewalDate: "November 01, 2026",
    paymentMethod: "Visa ending in 4242",
    seatsUsed: 18,
    seatsMax: 30,
    storesUsed: 3,
    storesMax: 5,
    tokensUsed: 42800,
    tokensMax: 100000,
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* Toast */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 rounded-full bg-[#2F2C59] text-white px-5 py-2.5 shadow-lg border border-indigo-400/40 text-xs font-semibold flex items-center space-x-2 animate-in fade-in slide-in-from-top-2">
            <Check className="h-4 w-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Page Header */}
        <PageHeader
          eyebrow="Subscription & Resource Quota"
          title="Billing & Quota Management"
          description="Monitor active tier entitlements, monthly AI token consumption, store seats, and payment records."
          actions={
            <PillButton
              variant="primary"
              onClick={() => showToast("Upgrade portal opened.")}
            >
              <Sparkles className="h-4 w-4 text-[#FF7A59]" />
              <span>Change Subscription Plan</span>
            </PillButton>
          }
        />

        {/* Top Section: Active Plan Card + Resource Gauges */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Active Plan Card (5 cols) */}
          <div className="lg:col-span-5 rounded-3xl bg-[#2F2C59] text-white p-7 sm:p-8 shadow-xl relative overflow-hidden flex flex-col justify-between">
            {/* Ambient Glows */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-60 h-60 bg-gradient-to-br from-[#2F5BFF]/40 to-transparent rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-60 h-60 bg-gradient-to-tr from-[#FF7A59]/30 to-transparent rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-widest text-indigo-200 font-bold bg-white/10 px-3 py-1 rounded-full border border-white/15">
                  Current Tier
                </span>
                <span className="inline-flex items-center text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                  Active
                </span>
              </div>

              <div>
                <h3 className="text-3xl font-black tracking-tight text-white">
                  {currentPlan.name} Plan
                </h3>
                <p className="text-xs text-indigo-200 mt-1 leading-relaxed">
                  {currentPlan.tagline}
                </p>
              </div>

              <div className="pt-2">
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl font-black text-white font-mono tracking-tight">
                    {currentPlan.price}
                  </span>
                  <span className="text-xs text-indigo-200">/ month ({currentPlan.billingCycle})</span>
                </div>
                <div className="text-[11px] text-indigo-300 mt-1">
                  Renews on <strong>{currentPlan.renewalDate}</strong> via {currentPlan.paymentMethod}
                </div>
              </div>

              <div className="pt-4 border-t border-white/15 space-y-2 text-xs text-indigo-100">
                <div className="flex items-center space-x-2">
                  <Check className="h-3.5 w-3.5 text-emerald-400 stroke-[3]" />
                  <span>Unlimited deterministic 0-conflict solves</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-3.5 w-3.5 text-emerald-400 stroke-[3]" />
                  <span>Native Excel (.xlsx) matrix 1-click export</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-3.5 w-3.5 text-emerald-400 stroke-[3]" />
                  <span>Up to 5 store branches with multi-location rules</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-6 pt-4 border-t border-white/15 flex items-center justify-between text-xs">
              <span className="text-indigo-200">Need Enterprise SLA?</span>
              <button
                type="button"
                onClick={() => showToast("Contact sales dialog opened.")}
                className="text-white font-bold hover:underline"
              >
                Contact Sales →
              </button>
            </div>
          </div>

          {/* Quota Usage Gauges (7 cols) */}
          <Card padding="lg" className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Monthly Resource Entitlements
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  Resets in 18 days
                </span>
              </div>

              <div className="mt-5 space-y-5">
                {/* Gauge 1: AI Generation Tokens */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                      <Sparkles className="h-3.5 w-3.5 mr-1.5 text-[#FF7A59]" />
                      AI Generation Tokens
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {currentPlan.tokensUsed.toLocaleString()} / {currentPlan.tokensMax.toLocaleString()} (43%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#2F5BFF] transition-all"
                      style={{ width: "43%" }}
                    />
                  </div>
                  <div className="text-[11px] text-slate-400 flex justify-between">
                    <span>57,200 tokens remaining</span>
                    <span>100k cap</span>
                  </div>
                </div>

                {/* Gauge 2: Frontline Staff Seats */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                      <Users className="h-3.5 w-3.5 mr-1.5 text-indigo-500" />
                      Employee Roster Seats
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {currentPlan.seatsUsed} / {currentPlan.seatsMax} staff (60%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#2F2C59] dark:bg-indigo-500 transition-all"
                      style={{ width: "60%" }}
                    />
                  </div>
                  <div className="text-[11px] text-slate-400 flex justify-between">
                    <span>12 seats available</span>
                    <span>30 staff tier</span>
                  </div>
                </div>

                {/* Gauge 3: Physical Locations */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                      <Store className="h-3.5 w-3.5 mr-1.5 text-emerald-500" />
                      Physical Store Locations
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {currentPlan.storesUsed} / {currentPlan.storesMax} stores (60%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all"
                      style={{ width: "60%" }}
                    />
                  </div>
                  <div className="text-[11px] text-slate-400 flex justify-between">
                    <span>2 branches available</span>
                    <span>5 branches tier</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Usage Breakdown Mini Grid */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2.5">
                Past 7 Days AI Token Activity
              </div>
              <div className="grid grid-cols-7 gap-1.5 text-center">
                {DAILY_USAGE_DATA.map((d, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="h-14 flex items-end justify-center">
                      <div
                        className="w-full rounded-md bg-[#2F5BFF]/80 dark:bg-[#2F5BFF]"
                        style={{ height: `${(d.tokens / 3650) * 100}%` }}
                        title={`${d.day}: ${d.tokens} tokens`}
                      />
                    </div>
                    <div className="text-[9px] font-mono text-slate-400 truncate">
                      {d.day.replace("Oct ", "10/")}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </Card>

        </div>

        {/* Invoice History Section */}
        <Card padding="lg" className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Payment History & Invoices
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Download receipts and monthly subscription tax invoices.
              </p>
            </div>
            <Receipt className="h-5 w-5 text-slate-400" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px] font-mono">
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Billing Date</th>
                  <th className="py-3 px-4">Plan Item</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      {inv.id}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      {inv.date}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                      {inv.plan}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      {inv.amount}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <StatusChip variant={inv.status === "PAID" ? "success" : "warning"}>
                        {inv.status}
                      </StatusChip>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => showToast(`Downloaded invoice ${inv.id}`)}
                        className="inline-flex items-center space-x-1 text-xs text-[#2F5BFF] hover:underline font-semibold cursor-pointer"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>PDF</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

      </div>
    </DashboardLayout>
  );
}
