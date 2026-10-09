"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, Sparkles } from "lucide-react";

export const PublicHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Product", href: "/product" },
    { name: "Pricing", href: "/pricing" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        
        {/* Left: Brand Logo */}
        <div className="flex items-center">
          <Link
            href="/"
            className="flex items-center transition opacity-95 hover:opacity-100 focus:outline-hidden"
          >
            <Image
              src="/images/logo/orbit-weave-logo-indigo-light-bg.svg"
              alt="ORBIT"
              width={125}
              height={34}
              className="h-7 sm:h-8 w-auto object-contain"
              priority
            />
          </Link>
        </div>

        {/* Center: Ultra-Light Grey Capsule Navigation (No border, rounded-full) */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-1.5 text-xs sm:text-sm rounded-full transition-all duration-150 ${
                  active
                    ? "bg-slate-900/[0.05] text-slate-950 font-semibold"
                    : "text-slate-600 font-medium hover:text-slate-950 hover:bg-slate-900/[0.025]"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right: Auth & Primary Action CTA */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            href="/login"
            className="px-3 py-1.5 text-sm font-semibold text-slate-600 hover:text-slate-950 rounded-full hover:bg-slate-900/[0.025] transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/product"
            className="inline-flex items-center justify-center space-x-1.5 px-4.5 py-2 text-sm font-semibold text-white bg-[#2F2C59] hover:bg-[#1E1B3A] rounded-xl shadow-xs transition-all active:scale-[0.99] border border-[#2F2C59]"
          >
            <span>Try Free</span>
            <ArrowRight className="ml-1 h-3.5 w-3.5 text-white" />
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center p-2 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-slate-100 focus:outline-hidden"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2 text-sm rounded-full transition ${
                    active
                      ? "font-semibold text-slate-950 bg-slate-900/[0.05]"
                      : "font-medium text-slate-600 hover:text-slate-950 hover:bg-slate-900/[0.025]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
          <div className="pt-3 border-t border-slate-100 flex flex-col space-y-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center px-4 py-2 text-sm font-medium text-slate-700 bg-slate-50 rounded-xl hover:bg-slate-100 transition border border-slate-200/80"
            >
              Log in
            </Link>
            <Link
              href="/product"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center px-4 py-2 text-sm font-semibold text-white bg-[#2F2C59] hover:bg-[#1E1B3A] rounded-xl shadow-xs transition border border-[#2F2C59]"
            >
              Launch Free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
