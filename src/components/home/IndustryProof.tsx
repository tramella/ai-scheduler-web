"use client";

import React, { useRef, useState } from "react";
import { Coffee, ShoppingBag, HeartPulse, Check } from "lucide-react";
import { SectionHeading } from "@/components/home/SectionHeading";

interface Industry {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  title: string;
  stat: string;
  statLabel: string;
  highlights: string[];
}

// TODO: thay các số liệu minh họa bằng số liệu khách hàng thực khi có.
const INDUSTRIES: Industry[] = [
  {
    id: "cafes",
    icon: Coffee,
    tag: "Food & beverage",
    title: "Cafes & restaurants",
    stat: "5.5h",
    statLabel: "saved per week on roster planning",
    highlights: [
      "Double-staff baristas through the morning rush",
      "No clopening: a late close never leads into an early open",
      "Weekend shifts balanced across the whole bar crew",
    ],
  },
  {
    id: "retail",
    icon: ShoppingBag,
    tag: "Retail",
    title: "Stores & boutiques",
    stat: "$1,400",
    statLabel: "accidental overtime avoided per month",
    highlights: [
      "A keyholder on every closing shift",
      "Strict weekly hour caps for student part-timers",
      "Busy Saturday slots rotated fairly",
    ],
  },
  {
    id: "clinics",
    icon: HeartPulse,
    tag: "Healthcare",
    title: "Clinics & practices",
    stat: "100%",
    statLabel: "of shifts meet rest and certification rules",
    highlights: [
      "Senior practitioner coverage guaranteed",
      "14-hour minimum rest between shifts",
      "Automatic rebalancing when staff are on leave",
    ],
  },
];

export const IndustryProof: React.FC = () => {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = INDUSTRIES[active];

  const onKeyDown = (e: React.KeyboardEvent) => {
    const keys: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    if (!(e.key in keys)) return;
    e.preventDefault();
    const next = (active + keys[e.key] + INDUSTRIES.length) % INDUSTRIES.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="solutions" className="scroll-mt-16 border-t border-slate-200/70 bg-white py-20 dark:border-slate-800 dark:bg-slate-950 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Built for your store's rhythm."
          description="Pick your kind of business to see how ORBIT handles its shift rules."
          className="mb-12"
        />

        <div className="grid gap-4 lg:grid-cols-12">
          {/* Tabs */}
          <div role="tablist" aria-label="Industries" aria-orientation="vertical" onKeyDown={onKeyDown} className="flex gap-2 overflow-x-auto lg:col-span-4 lg:flex-col">
            {INDUSTRIES.map((item, i) => {
              const Icon = item.icon;
              const selected = i === active;
              return (
                <button
                  key={item.id}
                  ref={(el) => { tabRefs.current[i] = el; }}
                  role="tab"
                  id={`tab-${item.id}`}
                  aria-selected={selected}
                  aria-controls={`panel-${item.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(i)}
                  className={`flex min-w-[220px] cursor-pointer items-center gap-4 rounded-2xl border p-4 text-left transition lg:min-w-0 ${
                    selected
                      ? "border-[#2F2C59] bg-[#2F2C59] text-white shadow-lg shadow-[#2F2C59]/20"
                      : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                  }`}
                >
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${selected ? "bg-white/10 text-[#FF7A59]" : "bg-[#2F5BFF]/10 text-[#2F5BFF]"}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-bold">{item.title}</span>
                    <span className={`block text-xs ${selected ? "text-indigo-200" : "text-slate-500"}`}>{item.tag}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Panel */}
          <div
            key={current.id}
            role="tabpanel"
            id={`panel-${current.id}`}
            aria-labelledby={`tab-${current.id}`}
            className="orbit-rise grid gap-8 rounded-[28px] border border-slate-200/80 bg-[#F6F7FB] p-7 dark:border-slate-800 dark:bg-slate-900/50 sm:p-10 md:grid-cols-2 lg:col-span-8"
          >
            <div className="flex flex-col justify-center">
              <p className="text-6xl font-display font-extrabold tabular-nums tracking-tight text-[#2F2C59] dark:text-white sm:text-7xl">
                {current.stat}
              </p>
              <p className="mt-2 max-w-[16rem] text-sm text-slate-600 dark:text-slate-400">{current.statLabel}</p>
            </div>
            <ul className="space-y-4 self-center">
              {current.highlights.map((h) => (
                <li key={h} className="flex items-start gap-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2F5BFF]/10">
                    <Check className="h-3 w-3 stroke-[3] text-[#2F5BFF]" />
                  </span>
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};