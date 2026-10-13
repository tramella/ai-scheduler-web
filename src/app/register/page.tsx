"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  Building2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { register, verifyEmail, resendVerification } = useAuth();

  // Form State
  const [accountType, setAccountType] = useState<"PERSONAL" | "BUSINESS">("BUSINESS");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Flow State: "REGISTER" | "VERIFY"
  const [step, setStep] = useState<"REGISTER" | "VERIFY">("REGISTER");
  const [otpCode, setOtpCode] = useState("");
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);
  const [emailPreviewUrl, setEmailPreviewUrl] = useState<string | null>(null);

  // Status State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Handle Register Submit
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (accountType === "BUSINESS" && !companyName.trim()) {
      setError("Please provide a company name for your business workspace.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      setLoading(true);
      const res = await register({
        email: email.trim(),
        password,
        full_name: fullName.trim(),
        account_type: accountType,
        company_name: accountType === "BUSINESS" ? companyName.trim() : undefined,
      });

      if (res.success) {
        setStep("VERIFY");
        setSuccessMsg("Account created! Please enter the 6-digit code sent to your email.");
        if (res.verification_code) {
          setDevOtpHint(res.verification_code);
        }
        if (res.email_preview_url) {
          setEmailPreviewUrl(res.email_preview_url);
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP Verification Submit
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!otpCode || otpCode.trim().length !== 6) {
      setError("Please enter a valid 6-digit verification code.");
      return;
    }

    try {
      setLoading(true);
      const res = await verifyEmail({
        email: email.trim(),
        code: otpCode.trim(),
      });

      if (res.success) {
        setSuccessMsg("Account verified successfully! Redirecting to dashboard...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 800);
      }
    } catch (err: any) {
      setError(err.message || "Invalid or expired verification code.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Resend OTP
  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError(null);
    try {
      setLoading(true);
      const res = await resendVerification(email.trim());
      setSuccessMsg("A new verification code has been dispatched.");
      if (res.email_preview_url) {
        setEmailPreviewUrl(res.email_preview_url);
      }
      setResendCooldown(45);
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Failed to resend code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#F6F7FB]">
      <div className="w-full max-w-md space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-1.5">
          <Link href="/" className="inline-flex items-center mb-3 transition opacity-95 hover:opacity-100">
            <Image
              src="/images/logo/orbit-weave-logo-indigo-light-bg.svg"
              alt="ORBIT"
              width={140}
              height={40}
              className="h-8 w-auto object-contain"
              style={{ width: "auto" }}
              priority
            />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {step === "REGISTER" ? "Create your workspace" : "Verify your email"}
          </h1>
          <p className="text-xs text-slate-500">
            {step === "REGISTER"
              ? "Start generating conflict-free schedules in minutes"
              : `Enter the 6-digit code sent to ${email}`}
          </p>
        </div>

        {/* Card Form */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-7 sm:p-8 shadow-xs">
          
          {/* Notification Alerts */}
          {error && (
            <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200/80 p-3.5 flex items-start space-x-2.5 text-xs text-rose-700">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
              <div className="flex-1 font-medium">{error}</div>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200/80 p-3.5 flex items-start space-x-2.5 text-xs text-emerald-800">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
              <div className="flex-1 font-medium">{successMsg}</div>
            </div>
          )}

          {/* STEP 1: REGISTRATION FORM */}
          {step === "REGISTER" && (
            <form onSubmit={handleRegister} className="space-y-4">
              
              {/* Account Type Selector (Personal vs Business) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-full border border-slate-200/80">
                  <button
                    type="button"
                    onClick={() => setAccountType("BUSINESS")}
                    className={`py-1.5 px-3 text-xs font-semibold rounded-full transition text-center cursor-pointer ${
                      accountType === "BUSINESS"
                        ? "bg-[#2F2C59] text-white shadow-xs font-bold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Business (Team)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountType("PERSONAL")}
                    className={`py-1.5 px-3 text-xs font-semibold rounded-full transition text-center cursor-pointer ${
                      accountType === "PERSONAL"
                        ? "bg-[#2F2C59] text-white shadow-xs font-bold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Personal (Solo)
                  </button>
                </div>
              </div>

              {/* Company Name (only for Business) */}
              {accountType === "BUSINESS" && (
                <div>
                  <label
                    htmlFor="reg-company"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Company / Organization Name
                  </label>
                  <div className="relative rounded-xl border border-slate-200 bg-slate-50/50 focus-within:border-[#2F5BFF] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#2F5BFF]/20 transition">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <input
                      id="reg-company"
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Acme Logistics Ltd"
                      className="block w-full rounded-xl bg-transparent py-2.5 pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
                    />
                  </div>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label
                  htmlFor="reg-name"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Full Name
                </label>
                <div className="relative rounded-xl border border-slate-200 bg-slate-50/50 focus-within:border-[#2F5BFF] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#2F5BFF]/20 transition">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    id="reg-name"
                    type="text"
                    required
                    autoComplete="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="block w-full rounded-xl bg-transparent py-2.5 pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="reg-email"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Work Email
                </label>
                <div className="relative rounded-xl border border-slate-200 bg-slate-50/50 focus-within:border-[#2F5BFF] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#2F5BFF]/20 transition">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    id="reg-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@company.com"
                    className="block w-full rounded-xl bg-transparent py-2.5 pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="reg-password"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Password
                </label>
                <div className="relative rounded-xl border border-slate-200 bg-slate-50/50 focus-within:border-[#2F5BFF] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#2F5BFF]/20 transition">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="reg-password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="block w-full rounded-xl bg-transparent py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center rounded-full bg-[#2F2C59] py-2.5 px-4 text-sm font-semibold text-white hover:bg-[#1E1B3A] disabled:opacity-50 transition active:scale-[0.98] border border-[#2F2C59] mt-3 cursor-pointer shadow-xs"
              >
                <span>{loading ? "Creating workspace..." : "Continue to Verification"}</span>
                <ArrowRight className="ml-2 h-4 w-4 text-white" />
              </button>
            </form>
          )}

          {/* STEP 2: VERIFICATION FORM */}
          {step === "VERIFY" && (
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label
                  htmlFor="verify-otp"
                  className="block text-xs font-semibold text-slate-700 mb-1.5 text-center"
                >
                  6-Digit Verification Code
                </label>
                <div className="relative rounded-2xl border border-slate-200 bg-slate-50/50 focus-within:border-[#2F5BFF] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#2F5BFF]/20 transition">
                  <input
                    id="verify-otp"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    autoFocus
                    required
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="000000"
                    className="block w-full rounded-2xl bg-transparent py-3 text-center text-2xl font-mono font-bold tracking-[0.4em] text-slate-900 placeholder:text-slate-300 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Dev Testing Helper (Assists user testing with Ethereal SMTP) */}
              {(devOtpHint || emailPreviewUrl) && (
                <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600 font-medium">
                    <span>Developer Mailer Mode:</span>
                    {devOtpHint && (
                      <button
                        type="button"
                        onClick={() => setOtpCode(devOtpHint)}
                        className="text-[#2F2C59] font-semibold hover:underline cursor-pointer"
                      >
                        Auto-fill ({devOtpHint})
                      </button>
                    )}
                  </div>
                  {emailPreviewUrl && (
                    <a
                      href={emailPreviewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-indigo-600 hover:text-indigo-800 font-semibold"
                    >
                      <span>Preview Email in Ethereal</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              )}

              {/* Submit Verification Button */}
              <button
                type="submit"
                disabled={loading || otpCode.length !== 6}
                className="w-full inline-flex items-center justify-center rounded-full bg-[#2F2C59] py-2.5 px-4 text-sm font-semibold text-white hover:bg-[#1E1B3A] disabled:opacity-50 transition active:scale-[0.98] border border-[#2F2C59] cursor-pointer shadow-xs"
              >
                <span>{loading ? "Activating..." : "Activate & Open Dashboard"}</span>
                <ArrowRight className="ml-2 h-4 w-4 text-white" />
              </button>

              {/* Resend & Back actions */}
              <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
                <button
                  type="button"
                  onClick={() => setStep("REGISTER")}
                  className="hover:text-slate-900 transition-colors"
                >
                  Change email
                </button>
                <button
                  type="button"
                  disabled={loading || resendCooldown > 0}
                  onClick={handleResend}
                  className="inline-flex items-center space-x-1 font-semibold text-[#2F2C59] hover:underline disabled:text-slate-400"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>
                    {resendCooldown > 0 ? `Resend code (${resendCooldown}s)` : "Resend code"}
                  </span>
                </button>
              </div>
            </form>
          )}

          {/* Bottom Switch Link */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
            <span>Already have an account? </span>
            <Link
              href="/login"
              className="font-semibold text-slate-900 hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
