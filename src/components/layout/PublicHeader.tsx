"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";

export const PublicHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Product", href: "/product" },
    { name: "Pricing", href: "/pricing" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/70 bg-white/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-18">
        
        {/* Left: Bigger Brand Logo (flex-1 to ensure true centering for middle nav) */}
        <div className="flex-1 flex items-center justify-start">
          <Link
            href="/"
            className="flex items-center space-x-3 group transition opacity-95 hover:opacity-100 focus:outline-hidden"
          >
            <Image
              src="/images/logo/orbit-weave-logo-indigo-light-bg.svg"
              alt="ORBIT"
              width={140}
              height={40}
              className="h-8 sm:h-9 w-auto object-contain"
              priority
            />
          </Link>
        </div>

        {/* Center: All Navigation Links Centered */}
        <nav className="hidden md:flex items-center justify-center space-x-1 sm:space-x-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                isActive(link.href)
                  ? "text-zinc-950 font-semibold bg-zinc-100/90"
                  : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/60"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right: Auth & Primary CTA (flex-1 to balance left logo) */}
        <div className="hidden md:flex flex-1 items-center justify-end space-x-3">
          <Link
            href="/login"
            className="px-3.5 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-950 rounded-xl hover:bg-zinc-100/60 transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/product"
            className="inline-flex items-center justify-center px-4.5 py-2.5 text-sm font-semibold text-white bg-zinc-950 hover:bg-zinc-800 rounded-xl shadow-xs transition-all duration-150 active:scale-[0.99] group border border-zinc-800"
          >
            <span>Try ORBIT Free</span>
            <ArrowRight className="ml-1.5 h-3.5 w-3.5 text-[#FF5A36] group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center p-2 rounded-xl text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 focus:outline-hidden"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-200 bg-white/95 backdrop-blur-lg px-4 pt-2 pb-6 space-y-3 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 text-base font-medium rounded-xl ${
                  isActive(link.href)
                    ? "text-zinc-950 bg-zinc-100 font-semibold"
                    : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="pt-3 border-t border-zinc-100 flex flex-col space-y-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center px-4 py-2.5 text-sm font-medium text-zinc-700 bg-zinc-50 rounded-xl hover:bg-zinc-100 transition"
            >
              Log in
            </Link>
            <Link
              href="/product"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center px-4 py-2.5 text-sm font-semibold text-white bg-zinc-950 rounded-xl hover:bg-zinc-800 shadow-xs transition"
            >
              Try ORBIT Free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
