"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  Cpu,
  Zap,
  Building2,
  CheckCircle2,
  Lock,
} from "lucide-react";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");

  const plans = [
    {
      name: "Community",
      badge: "Free MVP",
      description: "Ideal for small teams, independent managers, and testing automated AI scheduling without commitment.",
      priceMonthly: "$0",
      priceAnnual: "$0",
      period: "forever",
      subtext: "No credit card required",
      ctaText: "Test Free Copilot",
      ctaHref: "/product",
      popular: false,
      features: [
        "1 instant schedule generation without an account",
        "5 schedule generations / day with free account",
        "Standard Gemini 2.5 AI engine",
        "Deterministic mathematical rule verification",
        "Excel (.xlsx, .xls) employee upload up to 2MB",
        "Natural language scheduling prompts",
        "Single location shift scheduling",
        "Standard shift constraints & max hour checks",
        "One-click Excel (.xlsx) schedule export",
      ],
    },
    {
      name: "Pro",
      badge: "Most Popular",
      description: "For growing businesses requiring multi-location rosters, custom constraints, and flexible AI provider switching.",
      priceMonthly: "$39",
      priceAnnual: "$29",
      period: "/month",
      subtext: "billed annually ($348/yr) or $39 monthly",
      ctaText: "Start 14-Day Free Trial",
      ctaHref: "/register",
      popular: true,
      features: [
        "Everything in Community, plus:",
        "Switch AI Engine: Google Gemini & OpenAI (GPT-4o)",
        "Unlimited schedule generations per day",
        "Multi-location & branch shift scheduling",
        "Custom labor rules & mandatory rest interval limits",
        "Roster history & saved scenario templates",
        "Overtime prediction & shift balance alerts",
        "Priority AI queue with sub-second reasoning",
        "Email & live chat support (24h SLA)",
      ],
    },
    {
      name: "Enterprise",
      badge: "Custom",
      description: "For large organizations needing custom HRIS integration, dedicated infrastructure, and tailored labor agreements.",
      priceMonthly: "Custom",
      priceAnnual: "Custom",
      period: "",
      subtext: "Custom billing & dedicated SLA",
      ctaText: "Contact Sales",
      ctaHref: "/contact",
      popular: false,
      features: [
        "Everything in Pro, plus:",
        "Bring Your Own Key (BYOK) - OpenAI, Claude, Gemini, Groq",
        "Dedicated private cloud tenant & custom LLM models",
        "Direct API & HRIS integrations (BambooHR, Workday)",
        "Custom collective bargaining / union rule engine",
        "SSO / SAML 2.0 & advanced role-based access",
        "99.9% uptime SLA & dedicated account manager",
        "Custom training & onboarding for management teams",
      ],
    },
  ];

  const comparisonRows = [
    { feature: "AI Scheduling Engine", community: "Gemini 2.5 Flash", pro: "Gemini + OpenAI (Switchable)", enterprise: "BYOK / Custom LLM" },
    { feature: "Daily Schedule Generations", community: "1 Free (5 with account)", pro: "Unlimited", enterprise: "Unlimited" },
    { feature: "Excel (.xlsx) Import & Export", community: "✓ Up to 2MB", pro: "✓ Up to 10MB", enterprise: "✓ Unlimited + Direct API" },
    { feature: "Rule Engine Validation", community: "Deterministic (100%)", pro: "Deterministic + Custom Rules", enterprise: "Full Custom Labor Code" },
    { feature: "Multi-Location / Branch Support", community: "Single location", pro: "Up to 10 branches", enterprise: "Unlimited branches" },
    { feature: "Support & SLA", community: "Community FAQ", pro: "24h Priority Email/Chat", enterprise: "Dedicated SLA + Manager" },
  ];

  return (
    <main className="flex-1 py-12 sm:py-20 bg-linear-to-b from-white via-zinc-50/40 to-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center space-x-2 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-800 mb-4 border border-zinc-200/60">
            <Sparkles className="h-3.5 w-3.5 text-[#FF5A36]" />
            <span>Transparent, Scalable Pricing</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900">
            Predictable plans for <span className="text-[#FF5A36]">teams of any size</span>
          </h1>
          <p className="mt-3.5 text-base sm:text-lg text-zinc-600 max-w-xl mx-auto">
            Start immediately with our free community workspace or unlock multi-branch rules and AI provider flexibility with Pro.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="mt-8 inline-flex items-center rounded-2xl bg-zinc-100 p-1.5 border border-zinc-200 shadow-2xs">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                billingCycle === "monthly"
                  ? "bg-white text-zinc-900 shadow-xs"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              Monthly billing
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("annual")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition flex items-center space-x-1.5 ${
                billingCycle === "annual"
                  ? "bg-white text-zinc-900 shadow-xs"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              <span>Annual billing</span>
              <span className="rounded-full bg-[#FF5A36]/10 px-2 py-0.5 text-[10px] font-bold text-[#FF5A36]">
                Save 25%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto items-stretch mb-20">
          {plans.map((plan, idx) => {
            const isPro = plan.popular;
            const price =
              billingCycle === "annual" ? plan.priceAnnual : plan.priceMonthly;

            return (
              <div
                key={idx}
                className={`relative flex flex-col justify-between rounded-3xl p-7 sm:p-8 transition duration-200 ${
                  isPro
                    ? "border-2 border-[#0B0F1A] bg-white shadow-xl shadow-zinc-950/5 lg:-translate-y-2 ring-4 ring-[#FF5A36]/15"
                    : "border border-zinc-200/90 bg-white shadow-xs hover:shadow-md hover:border-zinc-300"
                }`}
              >
                {/* Popular Pill */}
                {isPro && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#0B0F1A] px-4 py-1 text-xs font-bold text-white shadow-xs border border-[#FF5A36]/40 flex items-center space-x-1">
                    <Sparkles className="h-3 w-3 text-[#FF5A36]" />
                    <span>{plan.badge}</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-zinc-900">{plan.name}</h3>
                    {!isPro && (
                      <span className="rounded-md bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold text-zinc-700 border border-zinc-200/60">
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-zinc-600 min-h-11 leading-relaxed mb-6">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline">
                      <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900">
                        {price}
                      </span>
                      {plan.period && (
                        <span className="ml-1.5 text-sm font-semibold text-zinc-500">
                          {plan.period}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 mt-1 font-medium">
                      {plan.subtext}
                    </p>
                  </div>

                  {/* CTA Button */}
                  <Link
                    href={plan.ctaHref}
                    className={`w-full inline-flex items-center justify-center rounded-xl py-3 px-4 text-sm font-semibold shadow-xs transition active:scale-[0.99] mb-8 group ${
                      isPro
                        ? "bg-[#0B0F1A] text-white hover:bg-zinc-800 border border-zinc-800"
                        : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200/80 border border-zinc-200/60"
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="ml-2 h-4 w-4 text-[#FF5A36] group-hover:translate-x-0.5 transition-transform" />
                  </Link>

                  {/* Features List */}
                  <div className="space-y-3 pt-6 border-t border-zinc-100">
                    <p className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                      Included capabilities:
                    </p>
                    <ul className="space-y-2.5 text-sm text-zinc-600">
                      {plan.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start">
                          <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5 mr-2.5" />
                          <span className="leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Trust Note */}
                <div className="mt-8 pt-4 border-t border-zinc-100 text-[11px] text-zinc-500 flex items-center space-x-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Deterministic validation guaranteed</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Matrix */}
        <div className="max-w-5xl mx-auto rounded-3xl border border-zinc-200/90 bg-white p-6 sm:p-10 shadow-xs mb-16">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-zinc-900">
              Detailed Plan Comparison
            </h3>
            <p className="text-sm text-zinc-500 mt-1.5">
              Everything you need to select the right scheduling tier for your organization.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-xs font-bold uppercase tracking-wider text-zinc-600 bg-zinc-50/50">
                  <th className="py-3 px-4">Feature</th>
                  <th className="py-3 px-4">Community</th>
                  <th className="py-3 px-4 text-[#FF5A36]">Pro (Popular)</th>
                  <th className="py-3 px-4">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-zinc-50/40 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-zinc-900">
                      {row.feature}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-600 text-xs sm:text-sm">
                      {row.community}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-zinc-900 text-xs sm:text-sm bg-orange-50/20">
                      {row.pro}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-600 text-xs sm:text-sm">
                      {row.enterprise}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Teaser */}
        <div className="max-w-3xl mx-auto rounded-3xl border border-zinc-200/90 bg-linear-to-br from-white via-zinc-50 to-orange-50/30 p-8 text-center shadow-2xs">
          <div className="flex justify-center mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0B0F1A] text-white shadow-xs">
              <HelpCircle className="h-5 w-5 text-[#FF5A36]" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-zinc-900 mb-2">
            Have questions about how ORBIT pricing works?
          </h3>
          <p className="text-sm text-zinc-600 mb-6 max-w-lg mx-auto leading-relaxed">
            Learn more about our zero-hallucination guarantee, custom shift rules, and how multi-provider switching works.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/faq"
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-[#0B0F1A] hover:bg-zinc-800 rounded-xl transition shadow-xs group"
            >
              <span>Read Full FAQ</span>
              <ArrowRight className="ml-2 h-4 w-4 text-[#FF5A36] group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-50 rounded-xl transition"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
