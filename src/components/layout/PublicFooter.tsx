import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, ShieldCheck, CheckCircle2 } from "lucide-react";

export const PublicFooter: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-800/90 bg-[#0B0F19] text-slate-400 relative overflow-hidden">
      {/* Subtle Bottom Ambient Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 -z-0 w-[600px] h-[200px] bg-gradient-to-t from-[#2F5BFF]/10 to-transparent blur-3xl pointer-events-none"></div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Top Feature Summary Strip */}
        <div className="pb-12 mb-12 border-b border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <Link href="/" className="inline-flex items-center group transition opacity-95 hover:opacity-100">
              <Image
                src="/images/logo/orbit-weave-logo-dark-bg.svg"
                alt="ORBIT"
                width={140}
                height={40}
                className="h-8 w-auto object-contain"
              />
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/product"
              className="inline-flex items-center space-x-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#2F2C59] hover:bg-[#1E1B3A] rounded-xl transition border border-[#2F2C59] shadow-xs group"
            >
              <span>Try Free</span>
              <ArrowRight className="h-3.5 w-3.5 text-white group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Multi-Column Sitemap Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 mb-14">
          {/* Column 1: Brand & Technology */}
          <div className="col-span-2 md:col-span-1 space-y-3.5">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Technology
            </h4>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Deterministic workforce scheduling engine. AI reasons through your operational rules while strict mathematical constraints guarantee zero double-bookings.
            </p>
          </div>

          {/* Column 2: Product */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Product & Studio
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li>
                <Link href="/product" className="hover:text-white transition-colors">
                  AI Scheduler Studio
                </Link>
              </li>
              <li>
                <Link href="/demo" className="hover:text-white transition-colors">
                  Interactive Demo Roster
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  Pricing & Plans
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-white transition-colors">
                  Operational Roadmap
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Resources
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  FAQ & Knowledge Base
                </Link>
              </li>
              <li>
                <Link href="/product" className="hover:text-white transition-colors">
                  Excel (.xlsx) Templates
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Custom Shift Rules
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  Labor Law Compliance
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Platform & Auth */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Platform & Access
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Manager Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  Create Free Account
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Specialists
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="border-t border-slate-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} ORBIT Platform. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4 text-slate-400 font-mono text-[11px]">
            <span>AI proposes. Math validates.</span>
            <span>•</span>
            <span className="text-slate-300">100% Conflict-Free Matrix</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
