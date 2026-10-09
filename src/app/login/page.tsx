"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      router.push("/product");
    }, 400);
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/50">
      <div className="w-full max-w-sm space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-1.5">
          <Link href="/" className="inline-flex items-center mb-3 transition opacity-95 hover:opacity-100">
            <Image
              src="/images/logo/orbit-weave-logo-indigo-light-bg.svg"
              alt="ORBIT"
              width={140}
              height={40}
              className="h-8 w-auto object-contain"
              priority
            />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Sign in
          </h1>
        </div>

        {/* Card Form */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-7 sm:p-8 shadow-xs">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Email
              </label>
              <div className="relative rounded-xl border border-slate-200 bg-slate-50/50 focus-within:border-[#2F2C59] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#2F2C59]/10 transition">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="block w-full rounded-xl bg-transparent py-2.5 pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="login-password"
                  className="block text-xs font-semibold text-slate-700"
                >
                  Password
                </label>
                <Link
                  href="/contact"
                  className="text-xs text-slate-500 hover:text-slate-900 transition-colors"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative rounded-xl border border-slate-200 bg-slate-50/50 focus-within:border-[#2F2C59] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#2F2C59]/10 transition">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full rounded-xl bg-transparent py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center rounded-xl bg-[#2F2C59] py-2.5 px-4 text-sm font-semibold text-white hover:bg-[#1E1B3A] disabled:opacity-50 transition active:scale-[0.99] border border-[#2F2C59] mt-2 cursor-pointer shadow-xs"
            >
              <span>{loading ? "Signing in..." : "Continue"}</span>
              <ArrowRight className="ml-2 h-4 w-4 text-white" />
            </button>
          </form>

          {/* Bottom Switch Link */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
            <span>Don&apos;t have an account? </span>
            <Link
              href="/register"
              className="font-semibold text-slate-900 hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
