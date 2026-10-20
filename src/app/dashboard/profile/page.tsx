"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Building2,
  ShieldCheck,
  Lock,
  LogOut,
  KeyRound,
  CheckCircle2,
  ArrowLeft,
  Calendar,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { PillButton } from "@/components/ui/PillButton";
import { StatusChip } from "@/components/ui/StatusChip";
import { ChangePasswordForm } from "@/components/dashboard/ChangePasswordForm";
import { UserAvatar } from "@/components/ui/UserAvatar";

export default function ProfilePage() {
  const router = useRouter();
  const {
    user,
    companies,
    activeCompany,
    logout,
    isSuperAdmin,
    isCompanyAdmin,
    isStoreManager,
    isStaff,
    simulatedRole,
    setSimulatedRole,
  } = useAuth();
  const { lang } = useLanguage();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6">

        {/* ================= 1. PAGE HEADER ================= */}
        <PageHeader
          eyebrow={
            lang === "vi"
              ? "Tài khoản cá nhân • Bảo mật & Phân quyền"
              : "Personal account • Security & Workspaces"
          }
          title={lang === "vi" ? "Hồ sơ tài khoản" : "Account profile"}
          description={
            lang === "vi"
              ? "Quản lý thông tin danh tính, bảo mật mật khẩu và danh sách không gian làm việc của bạn"
              : "Manage personal credentials, password security, and active workspace permissions"
          }
          actions={
            <div className="flex items-center gap-2">
              <Link href="/dashboard">
                <PillButton variant="secondary">
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>{lang === "vi" ? "Tổng quan" : "Dashboard"}</span>
                </PillButton>
              </Link>
              <PillButton
                variant="secondary"
                onClick={handleLogout}
                className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 dark:text-rose-400"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>{lang === "vi" ? "Đăng xuất" : "Sign out"}</span>
              </PillButton>
            </div>
          }
        />

        {/* ================= 2. USER HERO IDENTITY CARD ================= */}
        <Card padding="lg" className="overflow-hidden relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="relative">
                <UserAvatar
                  src={user?.avatar_url}
                  name={user?.full_name}
                  size="xl"
                  shape="rounded"
                />
                <div
                  className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-white"
                  title="Active account"
                >
                  <CheckCircle2 className="h-3 w-3" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    {user?.full_name || (lang === "vi" ? "Người dùng chưa đặt tên" : "Anonymous user")}
                  </h1>
                  <StatusChip variant="info">
                    {user?.account_type || "Admin"}
                  </StatusChip>
                  {activeCompany && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-[#2F2C59] dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                      <Building2 className="h-3 w-3" />
                      <span>{activeCompany.name}</span>
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    <span>{user?.email || "N/A"}</span>
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>{lang === "vi" ? "Email đã xác thực" : "Email verified"}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Meta Stats */}
            <div className="flex items-center gap-3 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
              <div className="flex-1 sm:flex-initial p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-center">
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {lang === "vi" ? "Không gian" : "Workspaces"}
                </div>
                <div className="text-base font-bold text-slate-900 dark:text-white tabular-nums">
                  {companies.length}
                </div>
              </div>
              <div className="flex-1 sm:flex-initial p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-center">
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {lang === "vi" ? "Trạng thái" : "Status"}
                </div>
                <div className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                  {lang === "vi" ? "Hoạt động" : "Active"}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* ================= 3. TWO COLUMN MAIN CONTENT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column (7 cols): Personal Details & Workspaces */}
          <div className="lg:col-span-7 space-y-6">

            {/* 3.1 Personal Details */}
            <Card padding="lg" className="space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-50 text-[#2F5BFF] dark:bg-blue-950/50">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {lang === "vi" ? "Thông tin cá nhân" : "Personal details"}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {lang === "vi"
                      ? "Thông tin tài khoản và định danh liên hệ"
                      : "Authenticated profile information and contact details"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                  <span className="text-slate-400 dark:text-slate-500 block mb-1">
                    {lang === "vi" ? "Họ và tên" : "Full name"}
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white text-sm block">
                    {user?.full_name || "N/A"}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                  <span className="text-slate-400 dark:text-slate-500 block mb-1">
                    {lang === "vi" ? "Email đăng nhập" : "Work email"}
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white truncate block text-sm">
                    {user?.email || "N/A"}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                  <span className="text-slate-400 dark:text-slate-500 block mb-1">
                    {lang === "vi" ? "Số điện thoại" : "Phone number"}
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white block text-sm">
                    {user?.phone_number || (lang === "vi" ? "Chưa cung cấp" : "Not specified")}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                  <span className="text-slate-400 dark:text-slate-500 block mb-1">
                    {lang === "vi" ? "Loại tài khoản" : "Account tier"}
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white capitalize block text-sm">
                    {user?.account_type || "Personal"}
                  </span>
                </div>

                <div className="sm:col-span-2 p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block mb-1">
                      {lang === "vi" ? "Ảnh đại diện (Photo URL)" : "Profile Avatar (Photo URL)"}
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white block text-xs truncate max-w-xs sm:max-w-md">
                      {user?.avatar_url || (lang === "vi" ? "Đang dùng ảnh đại diện mặc định (Placeholder)" : "Using placeholder avatar")}
                    </span>
                  </div>
                  <UserAvatar
                    src={user?.avatar_url}
                    name={user?.full_name}
                    size="sm"
                  />
                </div>
              </div>
            </Card>

            {/* 3.2 Associated Workspaces */}
            <Card padding="lg" className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-50 text-[#2F2C59] dark:bg-indigo-950/50 dark:text-indigo-300">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                      {lang === "vi" ? "Không gian làm việc & Phân quyền" : "Workspaces & permissions"}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {lang === "vi"
                        ? "Các chi nhánh và cửa hàng bạn được cấp quyền truy cập"
                        : "Stores and enterprise hubs you have access to"}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {companies.length} {lang === "vi" ? "không gian" : "total"}
                </span>
              </div>

              {companies.length > 0 ? (
                <div className="space-y-2.5">
                  {companies.map((c) => {
                    const isActive = c.id === activeCompany?.id;
                    return (
                      <div
                        key={c.id}
                        className={`flex items-center justify-between p-4 rounded-2xl border transition ${
                          isActive
                            ? "bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800"
                            : "bg-slate-50/60 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-800"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2.5 rounded-2xl border ${
                              isActive
                                ? "bg-white dark:bg-slate-800 border-indigo-200 dark:border-indigo-700 text-[#2F2C59] dark:text-indigo-300"
                                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400"
                            }`}
                          >
                            <Building2 className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                              <span>{c.name}</span>
                              {isActive && (
                                <StatusChip variant="info">
                                  {lang === "vi" ? "Đang hoạt động" : "Active"}
                                </StatusChip>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                              {lang === "vi" ? "Mã cửa hàng" : "Store code"}: <span className="font-mono font-medium text-slate-700 dark:text-slate-300">{c.code}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <StatusChip variant="neutral">{c.role}</StatusChip>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200/60 dark:border-slate-800 text-center">
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                    {lang === "vi"
                      ? "Chưa tham gia không gian làm việc nào (chế độ tài khoản cá nhân)."
                      : "Personal account mode (no company joined yet)."}
                  </p>
                </div>
              )}
            </Card>

          </div>

          {/* Right Column (5 cols): Security & Change Password */}
          <div className="lg:col-span-5 space-y-6">

            {/* 3.3 RBAC Simulator Card */}
            <Card padding="lg" className="space-y-4 border-indigo-200/70 dark:border-indigo-800/70">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-50 text-[#2F2C59] dark:bg-indigo-950/50 dark:text-indigo-300">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                      {lang === "vi" ? "Chế độ kiểm thử phân quyền (RBAC)" : "Role & Permission Simulator"}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {lang === "vi"
                        ? "Chuyển đổi vai trò tức thì để kiểm tra giao diện & quyền hạn"
                        : "Switch role on the fly to inspect permissions & navigation"}
                    </p>
                  </div>
                </div>
                {simulatedRole && (
                  <button
                    type="button"
                    onClick={() => setSimulatedRole(null)}
                    className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    {lang === "vi" ? "Đặt lại" : "Reset"}
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setSimulatedRole("SUPER_ADMIN")}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between h-20 ${
                      isSuperAdmin
                        ? "bg-[#2F2C59] text-white border-[#2F2C59] shadow-sm"
                        : "bg-slate-50/70 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border-slate-200/70 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <ShieldCheck className="h-4 w-4 text-amber-400" />
                      {isSuperAdmin && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
                    </div>
                    <div>
                      <div className="leading-tight font-bold">Product Owner</div>
                      <div className={`text-[10px] mt-0.5 ${isSuperAdmin ? "text-amber-200" : "text-slate-400"}`}>ORBIT SaaS Provider</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSimulatedRole("COMPANY_ADMIN")}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between h-20 ${
                      !isSuperAdmin && isCompanyAdmin
                        ? "bg-[#2F5BFF] text-white border-[#2F5BFF] shadow-sm"
                        : "bg-slate-50/70 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border-slate-200/70 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <Building2 className="h-4 w-4 text-blue-300" />
                      {!isSuperAdmin && isCompanyAdmin && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                    </div>
                    <div>
                      <div className="leading-tight font-bold">Business Owner</div>
                      <div className={`text-[10px] mt-0.5 ${!isSuperAdmin && isCompanyAdmin ? "text-blue-100" : "text-slate-400"}`}>Client Company Admin</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSimulatedRole("STORE_MANAGER")}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between h-20 ${
                      !isSuperAdmin && isStoreManager
                        ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                        : "bg-slate-50/70 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border-slate-200/70 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <User className="h-4 w-4 text-amber-200" />
                      {!isSuperAdmin && isStoreManager && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                    </div>
                    <div>
                      <div className="leading-tight font-bold">Store Manager</div>
                      <div className={`text-[10px] mt-0.5 ${!isSuperAdmin && isStoreManager ? "text-amber-100" : "text-slate-400"}`}>Branch Shifts & Staff</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSimulatedRole("STAFF")}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between h-20 ${
                      !isSuperAdmin && isStaff
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                        : "bg-slate-50/70 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border-slate-200/70 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <Calendar className="h-4 w-4 text-emerald-200" />
                      {!isSuperAdmin && isStaff && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                    </div>
                    <div>
                      <div className="leading-tight font-bold">Staff Member</div>
                      <div className={`text-[10px] mt-0.5 ${!isSuperAdmin && isStaff ? "text-emerald-100" : "text-slate-400"}`}>My Calendar & Leave</div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
                Current Active Session: <span className="font-bold text-slate-800 dark:text-slate-200">{simulatedRole ? `${simulatedRole} (Simulated)` : `${user?.platform_role || "USER"} / ${activeCompany?.role || "COMPANY_ADMIN"} (Database)`}</span>
              </div>
            </Card>

            {/* 3.4 Change Password Card */}
            <Card padding="lg" className="space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-50 text-[#2F2C59] dark:bg-indigo-950/50 dark:text-indigo-300">
                  <Lock className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {lang === "vi" ? "Bảo mật & Đổi mật khẩu" : "Security & Password"}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {lang === "vi"
                      ? "Cập nhật mật khẩu để bảo vệ tài khoản an toàn"
                      : "Update your password to keep your account secure"}
                  </p>
                </div>
              </div>

              <ChangePasswordForm />
            </Card>

            {/* 3.4 Password Best Practices Notice */}
            <Card padding="md" className="bg-slate-50/80 dark:bg-slate-800/40 border-slate-200/70 dark:border-slate-800">
              <div className="space-y-2 text-xs">
                <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <KeyRound className="h-3.5 w-3.5 text-[#2F5BFF]" />
                  <span>{lang === "vi" ? "Tiêu chuẩn bảo mật" : "Security standards"}</span>
                </div>
                <ul className="space-y-1.5 text-slate-500 dark:text-slate-400 list-disc list-inside">
                  <li>
                    {lang === "vi"
                      ? "Mật khẩu tối thiểu 8 ký tự kết hợp chữ và số."
                      : "At least 8 characters with letters and numbers."}
                  </li>
                  <li>
                    {lang === "vi"
                      ? "Không chia sẻ mật khẩu hoặc mã xác thực phiên."
                      : "Never share your password or session tokens."}
                  </li>
                  <li>
                    {lang === "vi"
                      ? "Nên đổi mật khẩu định kỳ 90 ngày một lần."
                      : "Recommended to rotate credentials every 90 days."}
                  </li>
                </ul>
              </div>
            </Card>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
