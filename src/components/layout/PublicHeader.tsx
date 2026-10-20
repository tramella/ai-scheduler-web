"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { UserAvatar } from "@/components/ui/UserAvatar";

const NAV_LINKS = [
  { name: "Product", href: "/product" },
  { name: "Pricing", href: "/pricing" },
  { name: "FAQ", href: "/faq" },
  { name: "Contact", href: "/contact" },
];

export const PublicHeader: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  const [menuPathname, setMenuPathname] = useState(pathname);
  if (pathname !== menuPathname) {
    setMenuPathname(pathname);
    setMenuOpen(false);
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const closeMenu = () => setMenuOpen(false);

  // Transparent header at page top, solid + blurred on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    router.push("/login");
  };

  const solid = scrolled || menuOpen;

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b backdrop-blur-xl transition-colors duration-200 ${
        solid
          ? "bg-white/85 dark:bg-slate-950/85 border-slate-200/70 dark:border-slate-800/70"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo: adapts to light/dark theme automatically */}
        <Link href="/" aria-label="ORBIT home" className="flex items-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2F5BFF]">
          <Image
            src="/images/logo/orbit-weave-logo-indigo-light-bg.svg"
            alt="ORBIT"
            width={156}
            height={40}
            priority
            className="h-8 w-auto dark:hidden"
            style={{ width: "auto" }}
          />
          <Image
            src="/images/logo/orbit-weave-logo-dark-bg.svg"
            alt="ORBIT"
            width={156}
            height={40}
            priority
            className="hidden h-8 w-auto dark:block"
            style={{ width: "auto" }}
          />
        </Link>

        {/* Center navigation */}
        <nav aria-label="Main" className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                  active
                    ? "bg-[#2F2C59]/[0.08] font-semibold text-[#2F2C59] dark:bg-white/10 dark:text-white"
                    : "font-medium text-slate-600 hover:bg-slate-900/[0.04] hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right action controls */}
        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                title="Go to dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3.5 text-sm font-medium text-slate-800 transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                <UserAvatar src={user?.avatar_url} name={user?.full_name} size="xs" />
                Dashboard
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                aria-label="Log out"
                title="Log out"
                className="cursor-pointer rounded-full p-2 text-slate-400 transition hover:bg-slate-900/[0.05] hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-slate-200"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-3.5 py-1.5 text-sm font-medium text-slate-600 transition hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-full px-3.5 py-1.5 text-sm font-medium text-slate-600 transition hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle trigger */}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="md:hidden cursor-pointer rounded-xl p-2.5 text-slate-700 dark:text-slate-200"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="orbit-rise md:hidden absolute inset-x-0 top-full border-b border-slate-200/70 bg-white px-4 pb-6 pt-2 shadow-xl dark:border-slate-800 dark:bg-slate-950"
        >
          <nav aria-label="Mobile" className="flex flex-col">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center justify-between rounded-xl px-3 py-3.5 text-base ${
                    active
                      ? "bg-[#2F2C59]/[0.06] font-semibold text-[#2F2C59] dark:bg-white/10 dark:text-white"
                      : "font-medium text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {link.name}
                  {active && <span className="h-1.5 w-1.5 rounded-full bg-[#FF7A59]" />}
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
            {isAuthenticated ? (
              <>
                <p className="px-3 text-xs text-slate-500">
                  Signed in as{" "}
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{user?.full_name}</span>
                </p>
                <Link href="/dashboard" onClick={closeMenu} className="btn-primary py-3 text-center text-sm">
                  Go to dashboard
                </Link>
                <button type="button" onClick={handleLogout} className="cursor-pointer rounded-full px-4 py-3 text-sm font-medium text-rose-600">
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link href="/register" onClick={closeMenu} className="btn-primary py-3 text-center text-sm">
                  Get started
                </Link>
                <Link href="/login" onClick={closeMenu} className="btn-secondary py-3 text-center text-sm">
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};