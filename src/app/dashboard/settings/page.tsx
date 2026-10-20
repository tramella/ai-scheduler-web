"use client";

import React, { useState } from "react";
import {
  Globe,
  Building2,
  Clock,
  Sparkles,
  Bell,
  Save,
  CheckCircle2,
  Lock,
  Sun,
  Sunset,
  Moon,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { PillButton } from "@/components/ui/PillButton";
import { StatusChip } from "@/components/ui/StatusChip";

function calculateShiftHours(start: string, end: string): string {
  const [sH, sM] = (start || "00:00").split(":").map(Number);
  const [eH, eM] = (end || "00:00").split(":").map(Number);
  let totalMin = (eH * 60 + eM) - (sH * 60 + sM);
  if (totalMin < 0) totalMin += 24 * 60;
  return (totalMin / 60).toFixed(1);
}

import { fetchSettingsApi, updateSettingsApi } from "@/lib/apiClient";

export default function SettingsPage() {
  const { activeCompany } = useAuth();
  const { theme, setTheme } = useTheme();
  const { lang, setLang } = useLanguage();

  // Active section tab
  const [activeTab, setActiveTab] = useState<
    "general" | "store" | "shifts" | "ai" | "notifications"
  >("general");

  // Store profile
  const [storeName, setStoreName] = useState(activeCompany?.name || "");
  const [storeAddress, setStoreAddress] = useState("");
  const [timezone, setTimezone] = useState("Asia/Ho_Chi_Minh (GMT+7)");
  const [currency, setCurrency] = useState("VND");

  // Shift presets
  const [shifts, setShifts] = useState<any[]>([]);

  // AI Engine preferences
  const [selectedEngine, setSelectedEngine] = useState<"gemini" | "openai">("gemini");
  const [autoEnforceRules, setAutoEnforceRules] = useState(true);

  // Notifications
  const [notifyOvertime, setNotifyOvertime] = useState(true);
  const [notifyPublish, setNotifyPublish] = useState(true);
  const [notifyRestViolations, setNotifyRestViolations] = useState(true);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetchSettingsApi();
        if (res.data) {
          if (res.data.company?.name) {
            setStoreName(res.data.company.name);
          }
          if (res.data.locations && res.data.locations.length > 0) {
            setStoreAddress(res.data.locations[0].address || "Central Hub Location");
          }
          if (res.data.shifts && res.data.shifts.length > 0) {
            const mappedShifts = res.data.shifts.map((s: any) => ({
              id: s._id || s.id,
              name: s.name,
              startTime: s.start_time || "07:00",
              endTime: s.end_time || "15:00",
              minStaff: s.required_staff || 4,
              supervisorRequired: true,
              color: s.name?.toLowerCase().includes("morning") ? "#2F5BFF" : s.name?.toLowerCase().includes("afternoon") ? "#FF7A59" : "#2F2C59"
            }));
            setShifts(mappedShifts);
          }
        }
      } catch (err) {
        console.warn("Using local settings fallback:", err);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateSettingsApi({
        storeName,
        max_hours_per_day: 8,
        min_rest_hours: 12,
        balance_workload: autoEnforceRules
      });
      setToastMessage(lang === "vi" ? "Đã cập nhật cài đặt thành công." : "Settings updated successfully.");
    } catch (err: any) {
      setToastMessage(err.message || "Failed to update settings");
    } finally {
      setIsSaving(false);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* ================= TOAST FEEDBACK ================= */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 rounded-full bg-[#2F2C59] dark:bg-indigo-600 text-white px-4 py-2 text-xs font-semibold shadow-lg animate-in fade-in slide-in-from-top-2 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* ================= 1. PAGE HEADER ================= */}
        <PageHeader
          eyebrow={lang === "vi" ? "Quản trị không gian làm việc • Central Hub" : "Workspace governance • Central Hub"}
          title={lang === "vi" ? "Cài đặt không gian làm việc" : "Workspace settings"}
          description={
            lang === "vi"
              ? "Quản lý ngôn ngữ, hồ sơ cửa hàng, ca làm việc, bộ giải AI và thông báo"
              : "Manage language, store profile, shift configurations, AI solver engine, and alerts"
          }
          actions={
            <PillButton variant="primary" onClick={handleSave}>
              <Save className="h-3.5 w-3.5" />
              <span>{lang === "vi" ? "Lưu thay đổi" : "Save changes"}</span>
            </PillButton>
          }
        />

        {/* ================= 2. SEGMENTED TAB NAVIGATION ================= */}
        <div className="flex items-center overflow-x-auto pb-1">
          <div className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 p-1 text-xs font-semibold gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab("general")}
              className={`rounded-full px-4 py-1.5 transition cursor-pointer ${
                activeTab === "general"
                  ? "bg-[#2F2C59] text-white dark:bg-indigo-600 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {lang === "vi" ? "Chung" : "General"}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("store")}
              className={`rounded-full px-4 py-1.5 transition cursor-pointer ${
                activeTab === "store"
                  ? "bg-[#2F2C59] text-white dark:bg-indigo-600 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {lang === "vi" ? "Hồ sơ cửa hàng" : "Store profile"}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("shifts")}
              className={`rounded-full px-4 py-1.5 transition cursor-pointer ${
                activeTab === "shifts"
                  ? "bg-[#2F2C59] text-white dark:bg-indigo-600 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {lang === "vi" ? "Mẫu ca làm việc" : "Shift presets"}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("ai")}
              className={`rounded-full px-4 py-1.5 transition cursor-pointer ${
                activeTab === "ai"
                  ? "bg-[#2F2C59] text-white dark:bg-indigo-600 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {lang === "vi" ? "Động cơ AI" : "AI engine"}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("notifications")}
              className={`rounded-full px-4 py-1.5 transition cursor-pointer ${
                activeTab === "notifications"
                  ? "bg-[#2F2C59] text-white dark:bg-indigo-600 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {lang === "vi" ? "Thông báo" : "Notifications"}
            </button>
          </div>
        </div>

        {/* ================= 3. TAB PANELS ================= */}

        {/* Tab 0: General (Language & Theme) */}
        {activeTab === "general" && (
          <Card padding="lg" className="space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-50 text-[#2F2C59] dark:bg-indigo-950/50 dark:text-indigo-300">
                <Globe className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {lang === "vi" ? "Tùy chọn chung" : "General preferences"}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {lang === "vi"
                    ? "Ngôn ngữ hiển thị giao diện và chế độ sáng/tối"
                    : "Interface display language and light/dark appearance mode"}
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Language Switcher */}
              <div className="p-4 rounded-2xl bg-slate-50/60 dark:bg-slate-800/30 border border-slate-200/70 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">
                    {lang === "vi" ? "Ngôn ngữ giao diện" : "Interface language"}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {lang === "vi"
                      ? "Chuyển đổi giữa tiếng Anh (English) và tiếng Việt (Tiếng Việt)"
                      : "Choose between English and Vietnamese for the dashboard"}
                  </div>
                </div>

                <div className="inline-flex items-center rounded-full bg-white dark:bg-slate-900 p-1 border border-slate-200/80 dark:border-slate-700 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setLang("en")}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                      lang === "en"
                        ? "bg-[#2F2C59] text-white dark:bg-indigo-600 shadow-xs"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    English (EN)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLang("vi")}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                      lang === "vi"
                        ? "bg-[#2F2C59] text-white dark:bg-indigo-600 shadow-xs"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    Tiếng Việt (VN)
                  </button>
                </div>
              </div>

              {/* Theme Switcher */}
              <div className="p-4 rounded-2xl bg-slate-50/60 dark:bg-slate-800/30 border border-slate-200/70 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">
                    {lang === "vi" ? "Chế độ hiển thị" : "Display appearance"}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {lang === "vi"
                      ? "Chọn giao diện sáng hoặc giao diện tối dịu mắt"
                      : "Select light or dark high-contrast theme"}
                  </div>
                </div>

                <div className="inline-flex items-center rounded-full bg-white dark:bg-slate-900 p-1 border border-slate-200/80 dark:border-slate-700 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setTheme("light")}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                      theme === "light"
                        ? "bg-[#2F2C59] text-white dark:bg-indigo-600 shadow-xs"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Sun className="h-3.5 w-3.5" />
                    <span>{lang === "vi" ? "Chế độ sáng" : "Light mode"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme("dark")}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                      theme === "dark"
                        ? "bg-[#2F2C59] text-white dark:bg-indigo-600 shadow-xs"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Moon className="h-3.5 w-3.5" />
                    <span>{lang === "vi" ? "Chế độ tối" : "Dark mode"}</span>
                  </button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Tab: Store Profile */}
        {activeTab === "store" && (
          <Card padding="lg" className="space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-50 text-[#2F5BFF] dark:bg-blue-950/50">
                <Building2 className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {lang === "vi" ? "Thông tin cửa hàng" : "Store information"}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {lang === "vi" ? "Thông tin chi nhánh và địa chỉ vận hành" : "Basic branch details and operating regional localization"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  {lang === "vi" ? "Tên cửa hàng hoặc chi nhánh" : "Store or branch name"}
                </label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2F5BFF]/50 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  {lang === "vi" ? "Địa chỉ chi nhánh" : "Store location address"}
                </label>
                <input
                  type="text"
                  value={storeAddress}
                  onChange={(e) => setStoreAddress(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2F5BFF]/50 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  {lang === "vi" ? "Múi giờ vận hành" : "Operational timezone"}
                </label>
                <div className="relative">
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="appearance-none w-full px-3.5 pr-9 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2F5BFF]/50 font-medium cursor-pointer"
                  >
                    <option value="Asia/Ho_Chi_Minh (GMT+7)">Asia/Ho_Chi_Minh (GMT+7)</option>
                    <option value="Asia/Bangkok (GMT+7)">Asia/Bangkok (GMT+7)</option>
                    <option value="Asia/Singapore (GMT+8)">Asia/Singapore (GMT+8)</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  {lang === "vi" ? "Đơn vị tiền tệ" : "Operational currency"}
                </label>
                <div className="relative">
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="appearance-none w-full px-3.5 pr-9 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2F5BFF]/50 font-medium cursor-pointer"
                  >
                    <option value="VND">Vietnamese Dong (VND ₫)</option>
                    <option value="USD">US Dollar (USD $)</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Tab 3: Shift Presets */}
        {activeTab === "shifts" && (
          <Card padding="lg" className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-orange-50 text-[#FF7A59] dark:bg-orange-950/50">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {lang === "vi" ? "Mẫu ca làm việc mặc định" : "Default shift templates"}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {lang === "vi" ? "Khung giờ làm việc chuẩn được áp dụng khi tự động xếp lịch" : "Predefined working windows applied during weekly schedule generation"}
                  </p>
                </div>
              </div>
              <StatusChip variant="neutral">{shifts.length} active shifts</StatusChip>
            </div>

            {shifts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-8 text-center bg-slate-50/50 dark:bg-slate-800/20 text-xs text-slate-400">
                {lang === "vi" ? "Chưa có mẫu ca làm việc nào được cấu hình." : "No shift templates configured yet."}
              </div>
            ) : (
              <div className="space-y-3.5">
                {shifts.map((shift: any, idx: number) => {
                  const Icon = idx === 0 ? Sun : idx === 1 ? Sunset : Moon;
                  const hours = calculateShiftHours(shift.startTime, shift.endTime);

                  return (
                    <div
                      key={shift.id}
                      className="p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                          <span className="text-xs font-semibold text-slate-900 dark:text-white">
                            {shift.name}
                          </span>
                        </div>
                        <StatusChip variant="neutral">{hours} hours</StatusChip>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                          {lang === "vi" ? "Giờ bắt đầu" : "Start time"}
                        </label>
                        <input
                          type="time"
                          value={shift.startTime}
                          onChange={(e) => {
                            const next = [...shifts];
                            next[idx].startTime = e.target.value;
                            setShifts(next);
                          }}
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white tabular-nums focus:outline-none focus:ring-2 focus:ring-[#2F5BFF]/50"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                          {lang === "vi" ? "Giờ kết thúc" : "End time"}
                        </label>
                        <input
                          type="time"
                          value={shift.endTime}
                          onChange={(e) => {
                            const next = [...shifts];
                            next[idx].endTime = e.target.value;
                            setShifts(next);
                          }}
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white tabular-nums focus:outline-none focus:ring-2 focus:ring-[#2F5BFF]/50"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                          {lang === "vi" ? "Nhân sự tối thiểu" : "Min staff required"}
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={shift.minStaff}
                          onChange={(e) => {
                            const next = [...shifts];
                            next[idx].minStaff = Number(e.target.value);
                            setShifts(next);
                          }}
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white tabular-nums focus:outline-none focus:ring-2 focus:ring-[#2F5BFF]/50"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            )}
          </Card>
        )}

        {/* Tab 4: AI Engine */}
        {activeTab === "ai" && (
          <Card padding="lg" className="space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-50 text-[#2F2C59] dark:bg-indigo-950/50 dark:text-indigo-300">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {lang === "vi" ? "Bộ giải tối ưu hóa AI" : "AI optimization solver"}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {lang === "vi" ? "Lựa chọn mô hình thông minh xử lý xếp ca tự động" : "Select algorithmic model engine powering automated scheduling"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option 1: Gemini (Free tier) */}
              <div
                onClick={() => setSelectedEngine("gemini")}
                className={`p-4 rounded-2xl border transition cursor-pointer ${
                  selectedEngine === "gemini"
                    ? "border-[#2F2C59] dark:border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/20 shadow-xs ring-2 ring-[#2F5BFF]/30"
                    : "border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30"
                }`}
              >
                <div className="flex items-center justify-between pb-2">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">
                    Google Gemini 2.5 Flash
                  </span>
                  <StatusChip variant="success">Free tier • 1 generation</StatusChip>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Deterministic fast schedule generation. Includes 1 free generation on standard tier.
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Available & active</span>
                </div>
              </div>

              {/* Option 2: OpenAI GPT-4o (Paid tier) */}
              <div
                className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20 opacity-80"
              >
                <div className="flex items-center justify-between pb-2">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">
                    OpenAI GPT-4o
                  </span>
                  <StatusChip variant="info">Pro plan</StatusChip>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Complex multi-location constraint optimization with deep workload balance.
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <Lock className="h-3.5 w-3.5 text-slate-400" />
                  <span>Requires Pro subscription</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoEnforceRules}
                  onChange={(e) => setAutoEnforceRules(e.target.checked)}
                  className="rounded-md border-slate-300 text-[#2F2C59] focus:ring-[#2F5BFF]/50 h-4 w-4"
                />
                <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                  {lang === "vi"
                    ? "Kiểm tra ràng buộc nghiêm ngặt (Từ chối lịch làm việc nếu vi phạm quy định pháp luật)"
                    : "Strict deterministic verification (reject schedules with any hard compliance violation)"}
                </span>
              </label>
            </div>
          </Card>
        )}

        {/* Tab 5: Notifications */}
        {activeTab === "notifications" && (
          <Card padding="lg" className="space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50">
                <Bell className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {lang === "vi" ? "Cảnh báo & thông báo" : "Alerts & notifications"}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {lang === "vi"
                    ? "Cấu hình thông báo tức thì khi nhân viên vượt giờ hoặc công bố lịch"
                    : "Configure real-time alerts for overtime warnings and schedule publication"}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {/* Toggle 1 */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/60 dark:bg-slate-800/30 border border-slate-200/70 dark:border-slate-800 gap-4">
                <div>
                  <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                    {lang === "vi" ? "Cảnh báo vượt giờ làm việc" : "Overtime threshold warnings"}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
                    {lang === "vi"
                      ? "Cảnh báo quản lý khi nhân sự vượt quá 40 giờ quy định trong tuần"
                      : "Alert manager when any staff member exceeds 40 scheduled hours in a week"}
                  </span>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={notifyOvertime}
                  onClick={() => setNotifyOvertime(!notifyOvertime)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#2F5BFF]/50 ${
                    notifyOvertime ? "bg-[#2F2C59] dark:bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                      notifyOvertime ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 2 */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/60 dark:bg-slate-800/30 border border-slate-200/70 dark:border-slate-800 gap-4">
                <div>
                  <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                    {lang === "vi" ? "Cảnh báo khoảng nghỉ giữa 2 ca" : "Statutory rest interval alerts"}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
                    {lang === "vi"
                      ? "Gắn cờ cảnh báo nếu thời gian hồi phục giữa 2 ca liên tiếp dưới 11 giờ"
                      : "Flag any back-to-back shift assignments with less than 11 hours recovery"}
                  </span>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={notifyRestViolations}
                  onClick={() => setNotifyRestViolations(!notifyRestViolations)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#2F5BFF]/50 ${
                    notifyRestViolations ? "bg-[#2F2C59] dark:bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                      notifyRestViolations ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 3 */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/60 dark:bg-slate-800/30 border border-slate-200/70 dark:border-slate-800 gap-4">
                <div>
                  <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                    {lang === "vi" ? "Thông báo phát hành lịch làm việc" : "Roster publication notifications"}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
                    {lang === "vi"
                      ? "Gửi thông báo đến toàn bộ nhân viên khi lịch tuần mới được duyệt"
                      : "Notify staff team when a new weekly schedule is approved and published"}
                  </span>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={notifyPublish}
                  onClick={() => setNotifyPublish(!notifyPublish)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#2F5BFF]/50 ${
                    notifyPublish ? "bg-[#2F2C59] dark:bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                      notifyPublish ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </Card>
        )}

      </div>
    </DashboardLayout>
  );
}
