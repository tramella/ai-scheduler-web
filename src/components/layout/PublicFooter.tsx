import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { WeaveMark } from "@/components/ui/WeaveMark";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "AI Scheduler Studio", href: "/product" },
      { label: "Interactive demo", href: "/demo" },
      { label: "Pricing", href: "/pricing" },
      { label: "How it works", href: "/#how-it-works" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Excel import & export", href: "/product" },
      { label: "Custom shift rules", href: "/contact" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign in", href: "/login" },
      { label: "Create free account", href: "/register" },
      { label: "Contact support", href: "/contact" },
    ],
  },
];

export const PublicFooter: React.FC = () => (
  <footer className="relative mt-auto overflow-hidden bg-[#0B0F19] text-slate-400">
    {/* Họa tiết weave rất mờ ở góc */}
    <WeaveMark className="pointer-events-none absolute -bottom-24 -right-20 w-[28rem] opacity-[0.06]" />

    <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 lg:px-8">
      {/* Dải CTA */}
      <div className="flex flex-col gap-8 border-b border-white/10 pb-12 md:flex-row md:items-end md:justify-between">
        <div className="max-w-md space-y-4">
          <Link href="/" aria-label="ORBIT home" className="inline-block">
            <Image
              src="/images/logo/orbit-weave-logo-dark-bg.svg"
              alt="ORBIT"
              width={156}
              height={40}
              className="h-8 w-auto"
              style={{ width: "auto" }}
            />
          </Link>
          <p className="text-lg font-medium leading-snug text-white">
            AI drafts the roster. Math checks every shift.
          </p>
        </div>

        <Link
          href="/product"
          className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#2F2C59] transition hover:bg-slate-100 active:scale-[0.98] md:w-auto"
        >
          Try 1 free schedule
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Sitemap */}
      <div className="grid grid-cols-2 gap-10 py-12 md:grid-cols-4">
        <p className="col-span-2 max-w-xs text-sm leading-relaxed md:col-span-1">
          A deterministic scheduling engine for shift-based teams. The AI reasons about your rules; strict constraints prevent overlapping shifts.
        </p>
        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h4 className="mb-4 text-sm font-semibold text-white">{col.title}</h4>
            <ul className="space-y-3 text-sm">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row">
        <p>© {new Date().getFullYear()} ORBIT Platform. All rights reserved.</p>
        <p>AI proposes. Code decides.</p>
      </div>
    </div>
  </footer>
);