"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");

  const plans = [
    {
      name: "Personal Free",
      badge: "Free Tier",
      description: "Essential AI schedule generation for personal managers and solo operators.",
      priceMonthly: "$0",
      priceAnnual: "$0",
      period: "forever",
      subtext: "No credit card required",
      ctaText: "Start Free",
      ctaHref: "/register",
      popular: false,
      features: [
        "Personal workspace & staff management",
        "Deterministic rule & labor constraint validation",
        "Excel (.xlsx) import & export",
        "Google Gemini AI schedule optimization",
        "Full staff roster & profile directory",
      ],
    },
    {
      name: "Personal Pro",
      badge: "Recommended",
      description: "Advanced AI power with OpenAI & Gemini switcher for power scheduling.",
      priceMonthly: "$29",
      priceAnnual: "$19",
      period: "/month",
      subtext: "billed annually ($228/yr)",
      ctaText: "Get Personal Pro",
      ctaHref: "/register",
      popular: true,
      features: [
        "OpenAI (GPT-4o) + Gemini engine switcher",
        "Unlimited schedule generation runs",
        "Fast parallel AI solver processing",
        "Custom shift constraints & rest intervals",
        "Export to Excel & high-resolution schedule views",
        "Priority AI queue & email support",
      ],
    },
    {
      name: "Company & Business",
      badge: "Version 2 (Coming Soon)",
      description: "Multi-tenant company organizations, departmental roles, and enterprise HRIS.",
      priceMonthly: "V2 Roadmap",
      priceAnnual: "V2 Roadmap",
      period: "",
      subtext: "Launching in Version 2",
      ctaText: "Join V2 Waitlist",
      ctaHref: "/contact",
      popular: false,
      features: [
        "Multi-company & branch tenant switcher",
        "Granular RBAC (Company Admin, Manager, Staff)",
        "Bring Your Own Key (BYOK) - OpenAI / Gemini",
        "Direct HRIS integrations (BambooHR, Workday)",
        "Audit telemetry & organizational security",
        "Custom enterprise labor agreements",
      ],
    },
  ];

  const comparisonRows = [
    { feature: "Target Audience", community: "Personal / Solo Manager", pro: "Personal Power User", enterprise: "Company Organization (V2)" },
    { feature: "AI Scheduling Engine", community: "Google Gemini 2.5", pro: "OpenAI (GPT-4o) + Gemini", enterprise: "BYOK / Custom LLM (V2)" },
    { feature: "Schedule Generations", community: "Standard runs", pro: "Unlimited parallel runs", enterprise: "Unlimited (V2)" },
    { feature: "Excel (.xlsx) Import & Export", community: "Yes", pro: "Yes (Enhanced)", enterprise: "Direct API + Batch (V2)" },
    { feature: "Workspace Type", community: "Personal Workspace", pro: "Personal Workspace", enterprise: "Multi-Company B2B (V2)" },
    { feature: "Role Management", community: "Personal Owner", pro: "Personal Owner", enterprise: "Multi-level RBAC (V2)" },
    { feature: "Support SLA", community: "Community FAQ", pro: "Priority Email Support", enterprise: "Dedicated SLA Manager (V2)" },
  ];

  return (
    <main className="min-h-[calc(100vh-4rem)] py-12 sm:py-20 bg-slate-50/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 space-y-3">
          <div className="inline-flex items-center space-x-2 rounded-full border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-[#FF7A59]" />
            <span className="tracking-tight">Transparent Pricing</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.08]">
            Simple plans for every team.
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Get started with Personal plans for solo store and shift operators, or join the waitlist for Company multi-tenant enterprise in Version 2.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="pt-3">
            <div className="inline-flex items-center rounded-full bg-slate-100 p-1 border border-slate-200/80 shadow-2xs">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition cursor-pointer ${
                  billingCycle === "monthly"
                    ? "bg-[#2F2C59] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("annual")}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                  billingCycle === "annual"
                    ? "bg-[#2F2C59] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>Annual</span>
                <span className="rounded-full bg-[#FF7A59] px-2 py-0.5 text-[10px] font-bold text-white">
                  Save 25%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch mb-16">
          {plans.map((plan, idx) => {
            const isPro = plan.popular;
            const price = billingCycle === "annual" ? plan.priceAnnual : plan.priceMonthly;

            return (
              <div
                key={idx}
                className={`relative flex flex-col justify-between rounded-3xl p-7 sm:p-8 bg-white transition duration-200 ${
                  isPro
                    ? "border-2 border-[#2F5BFF] ring-4 ring-[#2F5BFF]/10 shadow-lg lg:-translate-y-1.5"
                    : "border border-slate-200/80 shadow-xs hover:border-slate-300"
                }`}
              >
                {/* Popular Pill */}
                {isPro && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#2F5BFF] px-4 py-0.5 text-xs font-bold text-white shadow-xs">
                    <span>{plan.badge}</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                    {!isPro && (
                      <span className="rounded-full bg-slate-100 border border-slate-200/70 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 min-h-10 leading-relaxed mb-4">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mb-5">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-extrabold tracking-tight text-slate-900 tabular-nums">
                        {price}
                      </span>
                      {plan.period && (
                        <span className="ml-1.5 text-xs font-semibold text-slate-500">
                          {plan.period}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 font-medium">
                      {plan.subtext}
                    </p>
                  </div>

                  {/* CTA Button */}
                  <Link
                    href={plan.ctaHref}
                    className={`group w-full py-3 px-4 text-xs mb-6 cursor-pointer ${
                      isPro
                        ? "btn-primary"
                        : "btn-secondary"
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5 text-[#FF7A59] transition-transform group-hover:translate-x-0.5 dark:text-[#E8613F]" />
                  </Link>

                  {/* Features List */}
                  <div className="space-y-2.5 pt-5 border-t border-slate-100">
                    <ul className="space-y-2 text-xs text-slate-600">
                      {plan.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start">
                          <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5 mr-2" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center space-x-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span>Deterministic validation guaranteed</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Matrix */}
        <div className="max-w-4xl mx-auto rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs mb-14">
          <div className="text-center max-w-md mx-auto mb-6">
            <h3 className="text-lg font-bold text-slate-900">
              Plan Comparison Matrix
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-600 bg-slate-50/70">
                  <th className="py-2.5 px-3">Feature</th>
                  <th className="py-2.5 px-3">Community</th>
                  <th className="py-2.5 px-3 font-semibold text-[#2F5BFF] bg-indigo-50/50">Pro</th>
                  <th className="py-2.5 px-3">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-3 font-medium text-slate-900">
                      {row.feature}
                    </td>
                    <td className="py-3 px-3 text-slate-600 text-xs">
                      {row.community}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900 text-xs bg-indigo-50/30">
                      {row.pro}
                    </td>
                    <td className="py-3 px-3 text-slate-600 text-xs">
                      {row.enterprise}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Teaser */}
        <div className="max-w-2xl mx-auto rounded-3xl border border-slate-200/80 bg-white p-7 text-center shadow-xs">
          <h3 className="text-lg font-bold text-slate-900 mb-1.5">
            Questions about pricing?
          </h3>
          <p className="text-xs text-slate-600 mb-4 max-w-sm mx-auto">
            Learn more about Gemini vs OpenAI engines, Excel formats, and billing in our knowledge base.
          </p>
          <div className="flex items-center justify-center gap-2.5">
            <Link
              href="/faq"
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-[#2F2C59] hover:bg-[#1E1B3A] rounded-full transition shadow-xs border border-[#2F2C59] active:scale-95"
            >
              <span>Read FAQ</span>
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200/80 hover:bg-slate-200/70 rounded-full transition active:scale-95"
            >
              Contact Sales
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
