"use client";

import React from "react";
import {
  Sparkles,
  Coffee,
  ShoppingBag,
  HeartPulse,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

interface IndustryCard {
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  title: string;
  statNumber: string;
  statLabel: string;
  highlights: string[];
}

export const IndustryProof: React.FC = () => {
  const industries: IndustryCard[] = [
    {
      icon: Coffee,
      tag: "Food & Beverage",
      title: "Cafes & Restaurants",
      statNumber: "5.5h",
      statLabel: "Saved per week on roster planning",
      highlights: [
        "Morning peak rush barista double-staffing",
        "Zero clopening fatigue (late close + early open)",
        "Instant weekend shift balancing across bar crew",
      ],
    },
    {
      icon: ShoppingBag,
      tag: "Retail",
      title: "Stores & Boutiques",
      statNumber: "$1,400",
      statLabel: "Monthly accidental overtime saved",
      highlights: [
        "Guaranteed 1 store keyholder on closing shifts",
        "Strict weekly hour caps for student part-timers",
        "Fair automated rotation of busy Saturday slots",
      ],
    },
    {
      icon: HeartPulse,
      tag: "Healthcare",
      title: "Clinics & Practices",
      statNumber: "100%",
      statLabel: "Mandatory rest & certification compliance",
      highlights: [
        "Required senior practitioner coverage",
        "Strict 14-hour minimum rest intervals",
        "Automated rebalancing during staff leave",
      ],
    },
  ];

  return (
    <section id="solutions" className="py-16 md:py-20 border-t border-slate-200/80 bg-white relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14 space-y-2.5">
          <div className="inline-flex items-center space-x-2 rounded-full bg-slate-900/[0.05] px-3.5 py-1 text-xs font-semibold text-slate-800">
            <Sparkles className="h-3.5 w-3.5 text-[#FF7A59]" />
            <span>Industry Solutions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#2F2C59]">
            Built for your store&apos;s rhythm.
          </h2>
          <p className="text-base text-slate-600">
            Adapts to your shift constraints with zero configuration headaches.
          </p>
        </div>

        {/* 3 Industry Showcase Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
          {industries.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="rounded-3xl border border-slate-200/90 bg-slate-50/50 p-6 sm:p-7 flex flex-col justify-between hover:border-slate-300 hover:bg-white hover:shadow-sm transition-all duration-200 group"
              >
                <div>
                  {/* Top: Icon + Tag */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-200/70">
                    <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-medium text-slate-600 bg-white border border-slate-200 px-2.5 py-0.5 rounded-full">
                      {item.tag}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-900 mt-4">
                    {item.title}
                  </h3>

                  {/* Metric Box */}
                  <div className="mt-3.5 p-3 rounded-2xl bg-white border border-slate-200/80">
                    <div className="text-2xl font-black text-[#2F2C59] tracking-tight">
                      {item.statNumber}
                    </div>
                    <div className="text-[11px] font-medium text-slate-600 mt-0.5">
                      {item.statLabel}
                    </div>
                  </div>

                  {/* Highlights Bullet List */}
                  <div className="mt-4 space-y-2 text-xs text-slate-700">
                    {item.highlights.map((h, hIdx) => (
                      <div key={hIdx} className="flex items-start">
                        <CheckCircle2 className="h-3.5 w-3.5 text-slate-700 mr-2 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Impact Bar */}
        <div className="mt-10 max-w-4xl mx-auto rounded-2xl border border-slate-200/90 bg-slate-50/70 p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 sm:gap-8 text-center sm:text-left">
            <div>
              <div className="text-xl font-bold text-slate-900">0</div>
              <div className="text-xs text-slate-500">Double-Bookings</div>
            </div>
            <div className="hidden sm:block h-7 w-px bg-slate-200"></div>
            <div>
              <div className="text-xl font-bold text-slate-900">&lt; 2.5s</div>
              <div className="text-xs text-slate-500">Optimization Speed</div>
            </div>
            <div className="hidden sm:block h-7 w-px bg-slate-200"></div>
            <div>
              <div className="text-xl font-bold text-slate-900">100%</div>
              <div className="text-xs text-slate-500">Excel Compatible</div>
            </div>
          </div>

          <Link
            href="/product"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl bg-[#2F2C59] text-white text-xs font-semibold hover:bg-[#1E1B3A] transition shadow-xs group border border-[#2F2C59] shrink-0"
          >
            <span>Start Free</span>
            <ArrowRight className="h-3.5 w-3.5 text-white group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
};
