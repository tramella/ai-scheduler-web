"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Lock,
  Mail,
  User,
  Building,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  Check,
} from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotice(null);

    // Simulate registration
    setTimeout(() => {
      setLoading(false);
      setNotice(
        "Account created! ORBIT is currently in Free Community mode. You can start creating schedules immediately in the Copilot Workspace."
      );
    }, 500);
  };

  const isPasswordValid = password.length >= 8;

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
            Create your account
          </h1>
          <p className="text-sm text-zinc-600">
            Start generating conflict-free workforce schedules in seconds.
          </p>
        </div>

        {/* Notice Message if clicked */}
        {notice && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5 text-xs text-emerald-900 shadow-2xs space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <p className="font-bold text-sm text-emerald-950">Account Ready!</p>
            </div>
            <p className="leading-relaxed text-emerald-800">{notice}</p>
            <Link
              href="/product"
              className="inline-flex items-center justify-center w-full rounded-xl bg-emerald-900 py-2.5 px-4 text-xs font-semibold text-white hover:bg-emerald-800 transition"
            >
              <span>Launch Scheduling Workspace</span>
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </div>
        )}

        {/* Card Form */}
        <div className="rounded-3xl border border-zinc-200/90 bg-white p-7 sm:p-9 shadow-xs">
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Name */}
            <div>
              <label
                htmlFor="reg-name"
                className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5"
              >
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative rounded-xl border border-zinc-200 bg-zinc-50/40 shadow-2xs focus-within:border-zinc-900 focus-within:bg-white focus-within:ring-2 focus-within:ring-zinc-900/10 transition">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <User className="h-4 w-4 text-zinc-400" />
                </div>
                <input
                  id="reg-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Anna Vance"
                  className="block w-full rounded-xl bg-transparent py-2.5 pl-10 pr-3.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="reg-email"
                className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5"
              >
                Work Email <span className="text-rose-500">*</span>
              </label>
              <div className="relative rounded-xl border border-zinc-200 bg-zinc-50/40 shadow-2xs focus-within:border-zinc-900 focus-within:bg-white focus-within:ring-2 focus-within:ring-zinc-900/10 transition">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Mail className="h-4 w-4 text-zinc-400" />
                </div>
                <input
                  id="reg-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="anna@company.com"
                  className="block w-full rounded-xl bg-transparent py-2.5 pl-10 pr-3.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Company */}
            <div>
              <label
                htmlFor="reg-company"
                className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5"
              >
                Store / Organization <span className="text-zinc-400 font-normal">(Optional)</span>
              </label>
              <div className="relative rounded-xl border border-zinc-200 bg-zinc-50/40 shadow-2xs focus-within:border-zinc-900 focus-within:bg-white focus-within:ring-2 focus-within:ring-zinc-900/10 transition">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Building className="h-4 w-4 text-zinc-400" />
                </div>
                <input
                  id="reg-company"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Acme Hospitality Group"
                  className="block w-full rounded-xl bg-transparent py-2.5 pl-10 pr-3.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="reg-password"
                className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5"
              >
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative rounded-xl border border-zinc-200 bg-zinc-50/40 shadow-2xs focus-within:border-zinc-900 focus-within:bg-white focus-within:ring-2 focus-within:ring-zinc-900/10 transition">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Lock className="h-4 w-4 text-zinc-400" />
                </div>
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
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

              {/* Password Helper */}
              <div className="flex items-center space-x-1.5 pt-2 text-[11px] text-zinc-500">
                <div
                  className={`flex h-3.5 w-3.5 items-center justify-center rounded-full ${
                    isPasswordValid ? "bg-emerald-500 text-white" : "bg-zinc-200 text-zinc-400"
                  }`}
                >
                  <Check className="h-2.5 w-2.5" />
                </div>
                <span>Minimum 8 characters</span>
              </div>
            </div>

            <p className="text-[11px] text-zinc-500 leading-relaxed pt-1">
              By creating an account, you agree to ORBIT&apos;s Terms of Service and Privacy Policy.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center rounded-xl bg-[#0B0F1A] py-3 px-4 text-sm font-semibold text-white shadow-xs hover:bg-zinc-800 disabled:opacity-50 transition active:scale-[0.99] border border-zinc-800 group mt-2"
            >
              <span>{loading ? "Creating account..." : "Create Account"}</span>
              <ArrowRight className="ml-2 h-4 w-4 text-[#FF5A36] group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>

          {/* Bottom Link */}
          <div className="mt-6 pt-5 border-t border-zinc-100 text-center text-xs text-zinc-500 space-y-2">
            <div>
              <span>Already have an account? </span>
              <Link
                href="/login"
                className="font-bold text-zinc-900 hover:text-[#FF5A36] transition-colors"
              >
                Sign in
              </Link>
            </div>
            <div className="pt-1">
              <Link
                href="/product"
                className="inline-flex items-center space-x-1 font-semibold text-zinc-600 hover:text-zinc-900"
              >
                <span>⚡ Try ORBIT Free Copilot without registering</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Security badge */}
        <div className="flex items-center justify-center space-x-2 text-xs text-zinc-400">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Zero credit card required for Community preview</span>
        </div>
      </div>
    </main>
  );
}
