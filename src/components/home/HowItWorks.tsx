import React from "react";
import { UploadCloud, Sliders, Cpu, Download, Check, X } from "lucide-react";
import { SectionHeading } from "@/components/home/SectionHeading";

const STEPS = [
  { icon: UploadCloud, title: "Upload your roster", detail: "An .xlsx or .csv with roles, availability and weekly hours." },
  { icon: Sliders, title: "Write your rules", detail: "In plain language: rest hours, station minimums, overtime caps." },
  { icon: Cpu, title: "ORBIT verifies every shift", detail: "AI drafts the schedule, then a rule engine checks it. Anything that breaks a rule is rejected." },
  { icon: Download, title: "Export and share", detail: "Download a formatted .xlsx, ready to print or send to your team." },
];

const LOG = [
  { icon: null, dot: "bg-[#FF7A59]", head: "AI proposed", body: "Linh T. closes Fri 23:00, opens Sat 06:00" },
  { icon: X, dot: "bg-rose-500", head: "Rule check failed", body: "Minimum rest is 14h. This gap is 7h." },
  { icon: Check, dot: "bg-[#2F5BFF]", head: "Fixed automatically", body: "Sat opening moved to Minh P. (certified, 31h this week)" },
];

export const HowItWorks: React.FC = () => (
  <section id="how-it-works" className="scroll-mt-16 border-t border-slate-200/70 bg-[#F6F7FB] py-16 dark:border-slate-800 dark:bg-slate-900/40 md:py-24">
    <div className="mx-auto grid max-w-7xl items-start gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
      <div>
        <SectionHeading title="AI proposes. Code decides." description="From spreadsheet to a verified roster in four steps." />
        <ol className="relative mt-10 space-y-8 before:absolute before:bottom-3 before:left-[19px] before:top-3 before:w-px before:bg-slate-300 dark:before:bg-slate-700">
          {STEPS.map(({ icon: Icon, title, detail }, i) => (
            <li key={title} className="relative flex gap-5">
              <span className={`z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-4 ring-[#F6F7FB] dark:ring-slate-900 ${i === 2 ? "bg-[#2F2C59] text-white" : "border border-slate-300 bg-white text-[#2F5BFF] dark:border-slate-700 dark:bg-slate-800"}`}>
                <Icon className="h-4 w-4" />
              </span>
              <div className="pt-1.5">
                <h3 className="font-bold text-slate-900 dark:text-white">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="lg:sticky lg:top-28">
        <div className="rounded-[28px] bg-[#2F2C59] p-6 text-white shadow-2xl shadow-[#2F2C59]/30 sm:p-8">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">What step 3 looks like</p>
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-indigo-100">Example</span>
          </div>
          <ol className="relative mt-6 space-y-6 before:absolute before:bottom-2 before:left-[11px] before:top-2 before:w-px before:bg-white/15">
            {LOG.map(({ icon: Icon, dot, head, body }) => (
              <li key={head} className="relative flex gap-4">
                <span className={`z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${dot}`}>
                  {Icon && <Icon className="h-3.5 w-3.5 stroke-[3] text-white" />}
                </span>
                <div>
                  <p className="text-sm font-semibold">{head}</p>
                  <p className="mt-0.5 text-sm text-indigo-100/80">{body}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-7 flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/10">
            <span className="text-sm text-indigo-100">Final roster</span>
            <span className="flex items-center gap-1.5 text-sm font-semibold tabular-nums">
              <Check className="h-4 w-4 stroke-[3] text-emerald-400" /> 38 shifts · 0 conflicts
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
);