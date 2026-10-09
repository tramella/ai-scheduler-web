"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");

  const plans = [
    {
      name: "Community",
      badge: "Free",
      description: "For small teams and independent managers testing AI scheduling.",
      priceMonthly: "$0",
      priceAnnual: "$0",
      period: "forever",
      subtext: "No credit card required",
      ctaText: "Start Free",
      ctaHref: "/product",
      popular: false,
      features: [
        "5 schedule generations / day",
        "Deterministic rule validation",
        "Excel (.xlsx) import & export",
        "Natural language prompt builder",
        "Standard shift constraints check",
      ],
    },
    {
      name: "Pro",
      badge: "Most Popular",
      description: "For growing stores requiring multi-location rosters and custom constraints.",
      priceMonthly: "$39",
      priceAnnual: "$29",
      period: "/month",
      subtext: "billed annually ($348/yr)",
      ctaText: "Start Free Trial",
      ctaHref: "/register",
      popular: true,
      features: [
        "Unlimited schedule generations",
        "Multi-location & branch support",
        "Custom labor rules & rest intervals",
        "Roster history & saved templates",
        "Priority solver processing",
        "Email & live chat support",
      ],
    },
    {
      name: "Enterprise",
      badge: "Custom",
      description: "For organizations needing HRIS integration and tailored labor agreements.",
      priceMonthly: "Custom",
      priceAnnual: "Custom",
      period: "",
      subtext: "Custom billing & dedicated SLA",
      ctaText: "Contact Sales",
      ctaHref: "/contact",
      popular: false,
      features: [
        "Bring Your Own Key (BYOK)",
        "Direct HRIS integrations",
        "Custom collective bargaining rules",
        "SSO / SAML 2.0 access control",
        "99.9% uptime SLA",
        "Dedicated onboarding specialist",
      ],
    },
  ];

  const comparisonRows = [
    { feature: "Daily Generations", community: "5 / day", pro: "Unlimited", enterprise: "Unlimited" },
    { feature: "Excel (.xlsx) Import & Export", community: "Yes", pro: "Yes (Up to 10MB)", enterprise: "Direct API + Unlimited" },
    { feature: "Rule Engine Validation", community: "Deterministic", pro: "Deterministic + Custom", enterprise: "Full Custom Labor Code" },
    { feature: "Multi-Location Support", community: "Single", pro: "Up to 10 branches", enterprise: "Unlimited" },
    { feature: "Support SLA", community: "Community FAQ", pro: "24h Email & Chat", enterprise: "Dedicated SLA Manager" },
  ];

  return (
    <main className="min-h-[calc(100vh-4rem)] py-12 sm:py-20 bg-slate-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 space-y-3">
          <div className="inline-flex items-center space-x-2 rounded-full bg-slate-900/[0.05] px-3.5 py-1 text-xs font-semibold text-slate-800">
            <Sparkles className="h-3.5 w-3.5 text-[#FF7A59]" />
            <span>Transparent Pricing</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#2F2C59]">
            Simple plans for every team.
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto">
            Start free with our copilot or unlock multi-store rules with Pro.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="pt-2">
            <div className="inline-flex items-center rounded-2xl bg-white p-1.5 border border-slate-200 shadow-xs">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`rounded-xl px-4 py-1.5 text-xs font-bold transition cursor-pointer ${
                  billingCycle === "monthly"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("annual")}
                className={`rounded-xl px-4 py-1.5 text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                  billingCycle === "annual"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>Annual</span>
                <span className="rounded-full bg-[#FF7A59]/15 px-2 py-0.5 text-[10px] font-bold text-[#FF7A59]">
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
                    ? "border-2 border-[#2F2C59] shadow-lg lg:-translate-y-1.5"
                    : "border border-slate-200/90 shadow-xs hover:border-slate-300"
                }`}
              >
                {/* Popular Pill */}
                {isPro && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#2F2C59] px-3.5 py-0.5 text-xs font-semibold text-white shadow-xs">
                    <span>{plan.badge}</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                    {!isPro && (
                      <span className="rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
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
                      <span className="text-4xl font-extrabold tracking-tight text-slate-900">
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
                    className={`w-full inline-flex items-center justify-center rounded-xl py-2.5 px-4 text-xs font-semibold transition active:scale-[0.99] mb-6 ${
                      isPro
                        ? "bg-[#2F2C59] text-white hover:bg-[#1E1B3A] border border-[#2F2C59]"
                        : "bg-slate-100 text-slate-900 hover:bg-slate-200 border border-slate-200"
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Link>

                  {/* Features List */}
                  <div className="space-y-2.5 pt-5 border-t border-slate-100">
                    <ul className="space-y-2 text-xs text-slate-600">
                      {plan.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start">
                          <Check className="h-3.5 w-3.5 text-slate-800 shrink-0 mt-0.5 mr-2" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center space-x-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-slate-700 shrink-0" />
                  <span>Deterministic validation guaranteed</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Matrix */}
        <div className="max-w-4xl mx-auto rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs mb-14">
          <div className="text-center max-w-md mx-auto mb-6">
            <h3 className="text-lg font-bold text-slate-900">
              Plan Comparison
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-600 bg-slate-50/70">
                  <th className="py-2.5 px-3">Feature</th>
                  <th className="py-2.5 px-3">Community</th>
                  <th className="py-2.5 px-3 font-semibold text-slate-900">Pro</th>
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
                    <td className="py-3 px-3 font-semibold text-slate-900 text-xs bg-slate-50/50">
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
        <div className="max-w-2xl mx-auto rounded-3xl border border-slate-200/90 bg-white p-7 text-center shadow-xs">
          <h3 className="text-lg font-bold text-slate-900 mb-1.5">
            Questions about pricing?
          </h3>
          <p className="text-xs text-slate-600 mb-4 max-w-sm mx-auto">
            Learn more about custom rules, Excel formats, and billing in our FAQ.
          </p>
          <div className="flex items-center justify-center gap-2.5">
            <Link
              href="/faq"
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-[#2F2C59] hover:bg-[#1E1B3A] rounded-xl transition shadow-xs border border-[#2F2C59]"
            >
              <span>Read FAQ</span>
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl transition"
            >
              Contact Sales
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
