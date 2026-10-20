"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  RotateCcw,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { forgotPasswordApi, resetPasswordApi } from "@/lib/api-clients/auth/authApi";

export default function LoginPage() {
  const router = useRouter();
  const { login, verifyEmail, resendVerification } = useAuth();

  // Mode: "LOGIN" | "VERIFY" | "FORGOT" | "RESET"
  const [mode, setMode] = useState<"LOGIN" | "VERIFY" | "FORGOT" | "RESET">("LOGIN");

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // OTP Verification State
  const [otpCode, setOtpCode] = useState("");
  const [emailPreviewUrl, setEmailPreviewUrl] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Password Reset State
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Status State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // 1. Handle Login Submit
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    try {
      setLoading(true);
      const res = await login({
        email: email.trim(),
        password,
      });

      if (res.success) {
        setSuccessMsg("Welcome back! Loading your dashboard...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 500);
      }
    } catch (err: any) {
      if (err.data && err.data.is_verified === false) {
        // Account not verified yet -> switch to OTP verification mode
        setMode("VERIFY");
        setError("Your account is not verified yet. Please enter the 6-digit code sent to your email.");
      } else {
        setError(err.message || "Invalid email or password.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle OTP Verification for unverified accounts
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
        setSuccessMsg("Account activated! Entering dashboard...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 600);
      }
    } catch (err: any) {
      setError(err.message || "Invalid or expired verification code.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle Resend OTP
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

  // 4. Handle Forgot Password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!email.trim()) {
      setError("Please provide your account email.");
      return;
    }

    try {
      setLoading(true);
      const res = await forgotPasswordApi({ email: email.trim() });
      setMode("RESET");
      setSuccessMsg("If this email exists, a password reset code has been sent.");
      if (res.email_preview_url) {
        setEmailPreviewUrl(res.email_preview_url);
      }
    } catch (err: any) {
      setError(err.message || "Failed to send reset code.");
    } finally {
      setLoading(false);
    }
  };

  // 5. Handle Reset Password Submit
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      await resetPasswordApi({
        email: email.trim(),
        code: resetCode.trim(),
        new_password: newPassword,
      });
      setSuccessMsg("Password reset successfully! You can now log in.");
      setPassword("");
      setMode("LOGIN");
    } catch (err: any) {
      setError(err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#F6F7FB]">
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
              style={{ width: "auto" }}
              priority
            />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {mode === "LOGIN" && "Sign in to ORBIT"}
            {mode === "VERIFY" && "Verify your account"}
            {mode === "FORGOT" && "Reset your password"}
            {mode === "RESET" && "Set new password"}
          </h1>
          <p className="text-xs text-slate-500">
            {mode === "LOGIN" && "Enter your credentials to access your workspace"}
            {mode === "VERIFY" && `Enter the 6-digit code sent to ${email}`}
            {mode === "FORGOT" && "We will send an OTP reset code to your email"}
            {mode === "RESET" && "Enter the OTP code and your new password"}
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

          {/* 1. LOGIN FORM */}
          {mode === "LOGIN" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label
                  htmlFor="login-email"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Email
                </label>
                <div className="relative rounded-xl border border-slate-200 bg-slate-50/50 focus-within:border-[#2F5BFF] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#2F5BFF]/20 transition">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    id="login-email"
                    type="email"
                    required
                    autoComplete="email"
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
                  <button
                    type="button"
                    onClick={() => {
                      setError(null);
                      setSuccessMsg(null);
                      setMode("FORGOT");
                    }}
                    className="text-xs text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative rounded-xl border border-slate-200 bg-slate-50/50 focus-within:border-[#2F5BFF] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#2F5BFF]/20 transition">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
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

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-2.5 px-4 text-sm mt-2 disabled:opacity-50 cursor-pointer"
              >
                <span>{loading ? "Signing in..." : "Continue"}</span>
                <ArrowRight className="ml-2 h-4 w-4 text-white" />
              </button>
            </form>
          )}

          {/* 2. OTP VERIFICATION FORM (IF UNVERIFIED) */}
          {mode === "VERIFY" && (
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label
                  htmlFor="verify-otp"
                  className="block text-xs font-semibold text-slate-700 mb-1.5 text-center"
                >
                  6-Digit Verification Code
                </label>
                <div className="relative rounded-2xl border border-slate-200 bg-slate-50/50 focus-within:border-[#2F2C59] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#2F2C59]/10 transition">
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

              {emailPreviewUrl && (
                <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3 text-xs text-center">
                  <a
                    href={emailPreviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-indigo-600 hover:text-indigo-800 font-semibold"
                  >
                    <span>Preview Email in Ethereal</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || otpCode.length !== 6}
                className="btn-primary w-full py-2.5 px-4 text-sm disabled:opacity-50 cursor-pointer"
              >
                <span>{loading ? "Activating..." : "Activate & Sign In"}</span>
                <ArrowRight className="ml-2 h-4 w-4 text-white" />
              </button>

              <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
                <button
                  type="button"
                  onClick={() => setMode("LOGIN")}
                  className="hover:text-slate-900 cursor-pointer"
                >
                  Back to Sign In
                </button>
                <button
                  type="button"
                  disabled={loading || resendCooldown > 0}
                  onClick={handleResend}
                  className="inline-flex items-center space-x-1 font-semibold text-[#2F2C59] hover:underline disabled:text-slate-400 cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>
                    {resendCooldown > 0 ? `Resend (${resendCooldown}s)` : "Resend code"}
                  </span>
                </button>
              </div>
            </form>
          )}

          {/* 3. FORGOT PASSWORD REQUEST FORM */}
          {mode === "FORGOT" && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label
                  htmlFor="forgot-email"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Account Email
                </label>
                <div className="relative rounded-xl border border-slate-200 bg-slate-50/50 focus-within:border-[#2F2C59] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#2F2C59]/10 transition">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    id="forgot-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="block w-full rounded-xl bg-transparent py-2.5 pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-2.5 px-4 text-sm disabled:opacity-50 cursor-pointer"
              >
                <span>{loading ? "Sending..." : "Send Reset Code"}</span>
                <ArrowRight className="ml-2 h-4 w-4 text-white" />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setMode("LOGIN")}
                  className="text-xs text-slate-500 hover:text-slate-900 cursor-pointer"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* 4. RESET PASSWORD WITH OTP */}
          {mode === "RESET" && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label
                  htmlFor="reset-otp"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  6-Digit Reset Code
                </label>
                <input
                  id="reset-otp"
                  type="text"
                  maxLength={6}
                  required
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="000000"
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-center font-mono font-bold tracking-widest text-slate-900 focus:outline-hidden focus:border-[#2F2C59]"
                />
              </div>

              <div>
                <label
                  htmlFor="new-password"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  New Password
                </label>
                <input
                  id="new-password"
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-sm text-slate-900 focus:outline-hidden focus:border-[#2F2C59]"
                />
              </div>

              {emailPreviewUrl && (
                <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3 text-xs text-center">
                  <a
                    href={emailPreviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-indigo-600 hover:text-indigo-800 font-semibold"
                  >
                    <span>Preview Reset Email in Ethereal</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-2.5 px-4 text-sm disabled:opacity-50 cursor-pointer"
              >
                <span>{loading ? "Updating..." : "Update Password & Sign In"}</span>
                <ArrowRight className="ml-2 h-4 w-4 text-white" />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setMode("LOGIN")}
                  className="text-xs text-slate-500 hover:text-slate-900 cursor-pointer"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* Bottom Switch Link */}
          {mode === "LOGIN" && (
            <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
              <span>Don&apos;t have an account? </span>
              <Link
                href="/register"
                className="font-semibold text-slate-900 hover:underline"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
