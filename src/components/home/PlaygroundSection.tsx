import React from "react";
import { InteractivePlayground } from "@/components/home/InteractivePlayground";
import { SectionHeading } from "@/components/home/SectionHeading";

export const PlaygroundSection: React.FC = () => (
  <section id="playground" className="scroll-mt-16 border-t border-slate-200/70 bg-white py-16 dark:border-slate-800 dark:bg-slate-950 md:py-24">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionHeading title="Try it on a sample roster." description="Change a rule and watch the schedule update. No sign-up needed." className="mb-10" />
      <div className="rounded-[32px] border border-slate-200/80 bg-[#F6F7FB] p-1.5 dark:border-slate-800 dark:bg-slate-900/40">
        <InteractivePlayground />
      </div>
    </div>
  </section>
);