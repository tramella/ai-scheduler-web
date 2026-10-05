"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Lock, Mail, Eye, EyeOff, Sparkles, CheckCircle2, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotice(null);

    // Simulate authentication UX
    setTimeout(() => {
      setLoading(false);
      setNotice(
        "ORBIT is currently operating in Free Community mode. You can start generating schedules directly in the Copilot Workspace!"
      );
    }, 500);
  };

  return (
    <main className="flex-1 flex items-center justify-center py-12 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-linear-to-b from-white via-zinc-50/40 to-white">
      {/* Ambient warm glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 -z-10 w-[600px] h-[320px] bg-gradient-to-b from-[#FF5A36]/8 via-[#FF5A36]/3 to-transparent blur-3xl rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center mb-2 group transition">
            <Image
              src="/orbit-logo-dark.svg"
              alt="ORBIT"
              width={160}
              height={48}
              className="h-9 sm:h-10 w-auto object-contain"
              priority
            />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0B0F1A]">
            Welcome back
          </h1>
          <p className="text-sm text-zinc-600">
            Sign in to access your organization&apos;s workspace.
          </p>
        </div>

        {/* Notice Message if clicked */}
        {notice && (
          <div className="rounded-2xl border border-orange-200/80 bg-orange-50/50 p-4 text-xs text-zinc-800 shadow-2xs space-y-2 animate-in fade-in duration-150">
            <div className="flex items-center space-x-2 text-zinc-900 font-bold">
              <Sparkles className="h-4 w-4 text-[#FF5A36]" />
              <span>Community Preview Mode</span>
            </div>
            <p className="leading-relaxed text-zinc-600">{notice}</p>
            <Link
              href="/product"
              className="inline-flex items-center text-xs font-bold text-[#0B0F1A] hover:text-[#FF5A36] transition-colors pt-1"
            >
              <span>Go to Scheduling Workspace</span>
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </div>
        )}

        {/* Card Form */}
        <div className="rounded-3xl border border-zinc-200/90 bg-white p-7 sm:p-9 shadow-xs">
          {/* Quick Demo Login / Google Auth button */}
          <div className="space-y-3 mb-6">
            <button
              type="button"
              onClick={() => {
                setEmail("demo.manager@company.com");
                setPassword("demo123456");
              }}
              className="w-full inline-flex items-center justify-center space-x-2 rounded-xl border border-zinc-200 bg-zinc-50/60 hover:bg-zinc-100 hover:border-zinc-300 py-2.5 px-4 text-xs font-semibold text-zinc-700 transition active:scale-[0.99]"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#FF5A36]" />
              <span>Fill Demo Account Credentials</span>
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-zinc-400 font-medium text-[11px]">
                or sign in with email
              </span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5"
              >
                Work Email <span className="text-rose-500">*</span>
              </label>
              <div className="relative rounded-xl border border-zinc-200 bg-zinc-50/40 shadow-2xs focus-within:border-zinc-900 focus-within:bg-white focus-within:ring-2 focus-within:ring-zinc-900/10 transition">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Mail className="h-4 w-4 text-zinc-400" />
                </div>
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="manager@company.com"
                  className="block w-full rounded-xl bg-transparent py-2.5 pl-10 pr-3.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="login-password"
                  className="block text-xs font-bold uppercase tracking-wider text-zinc-700"
                >
                  Password <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setNotice("Password reset links are sent automatically for registered enterprise pilot accounts.")
                  }
                  className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative rounded-xl border border-zinc-200 bg-zinc-50/40 shadow-2xs focus-within:border-zinc-900 focus-within:bg-white focus-within:ring-2 focus-within:ring-zinc-900/10 transition">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Lock className="h-4 w-4 text-zinc-400" />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full rounded-xl bg-transparent py-2.5 pl-10 pr-10 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 hover:text-zinc-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center rounded-xl bg-[#0B0F1A] py-3 px-4 text-sm font-semibold text-white shadow-xs hover:bg-zinc-800 disabled:opacity-50 transition active:scale-[0.99] border border-zinc-800 group"
            >
              <span>{loading ? "Signing in..." : "Sign In to Workspace"}</span>
              <ArrowRight className="ml-2 h-4 w-4 text-[#FF5A36] group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>

          {/* Bottom Link */}
          <div className="mt-6 pt-5 border-t border-zinc-100 text-center text-xs text-zinc-500 space-y-2">
            <div>
              <span>Don&apos;t have an account? </span>
              <Link
                href="/register"
                className="font-bold text-zinc-900 hover:text-[#FF5A36] transition-colors"
              >
                Create an account
              </Link>
            </div>
            <div className="pt-1">
              <Link
                href="/product"
                className="inline-flex items-center space-x-1 font-semibold text-zinc-600 hover:text-zinc-900"
              >
                <span>⚡ Try ORBIT Free Copilot without an account</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Security badge */}
        <div className="flex items-center justify-center space-x-2 text-xs text-zinc-400">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Encrypted 256-bit SSL Connection</span>
        </div>
      </div>
    </main>
  );
}
