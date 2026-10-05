import React from "react";
import Link from "next/link";
import Image from "next/image";

export const PublicFooter: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-zinc-800 bg-[#09090B] text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center group transition opacity-95 hover:opacity-100">
              <Image
                src="/orbit-logo-light.svg"
                alt="ORBIT"
                width={120}
                height={36}
                className="h-7 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-zinc-400 max-w-md leading-relaxed">
              Intelligent workforce scheduling platform. Upload employee rosters, specify operational rules, and generate mathematically validated schedules in seconds.
            </p>
            <div className="flex items-center space-x-3 text-xs text-zinc-500 pt-1">
              <span className="inline-flex items-center rounded-full bg-zinc-800/80 px-2.5 py-1 text-[11px] font-medium text-zinc-300 border border-zinc-700/60">
                <span className="flex h-1.5 w-1.5 rounded-full bg-[#FF5A36] mr-1.5"></span>
                AI Reasoning + Deterministic Rules
              </span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Product
            </h4>
            <ul className="space-y-2.5 text-sm text-zinc-400">
              <li>
                <Link href="/product" className="hover:text-white transition-colors">
                  AI Scheduler Workspace
                </Link>
              </li>
              <li>
                <Link href="/demo" className="hover:text-white transition-colors text-[#FF5A36]">
                  Demo Schedule & Schema
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm text-zinc-400">
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact & Support
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Member Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-zinc-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} ORBIT Platform. All rights reserved.</p>
          <div className="flex items-center space-x-4 text-zinc-400">
            <span>AI proposes. Code validates.</span>
            <span>•</span>
            <span className="text-zinc-300">Deterministic Reliability</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
