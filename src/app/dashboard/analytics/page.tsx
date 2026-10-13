"use client";

import React, { useState } from "react";
import {
  Clock,
  TrendingUp,
  ShieldCheck,
  DollarSign,
  Download,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { KpiCard } from "@/components/ui/KpiCard";
import { StatusChip } from "@/components/ui/StatusChip";
import { PillButton } from "@/components/ui/PillButton";

export default function AnalyticsPage() {
  const { lang } = useLanguage();
  const [selectedPeriod, setSelectedPeriod] = useState<"week42" | "week41" | "month10">("week42");

  const roleAllocation = [
    { role: "Barista", hours: 384, percentage: 42.8, color: "bg-[#2F5BFF]" },
    { role: "Cashier", hours: 296, percentage: 33.0, color: "bg-[#FF7A59]" },
    { role: "Shift supervisor", hours: 136, percentage: 15.2, color: "bg-[#2F2C59] dark:bg-indigo-500" },
    { role: "Kitchen & prep", hours: 80, percentage: 9.0, color: "bg-emerald-500" },
  ];

  const dailyLoad = [
    { day: "Mon", totalStaff: 16, morning: 6, afternoon: 6, night: 4, hours: 128 },
    { day: "Tue", totalStaff: 16, morning: 6, afternoon: 6, night: 4, hours: 128 },
    { day: "Wed", totalStaff: 18, morning: 7, afternoon: 7, night: 4, hours: 144 },
    { day: "Thu", totalStaff: 16, morning: 6, afternoon: 6, night: 4, hours: 128 },
    { day: "Fri", totalStaff: 20, morning: 8, afternoon: 8, night: 4, hours: 160 },
    { day: "Sat", totalStaff: 22, morning: 9, afternoon: 9, night: 4, hours: 176 },
    { day: "Sun", totalStaff: 14, morning: 5, afternoon: 5, night: 4, hours: 112 },
  ];

  const staffWorkload = [
    { name: "Nguyễn Văn An", role: "Supervisor", hours: 40, status: "Optimal" },
    { name: "Lý Khánh Nam", role: "Supervisor", hours: 40, status: "Optimal" },
    { name: "Vũ Tuấn Kiệt", role: "Supervisor", hours: 36, status: "Optimal" },
    { name: "Trần Thị Bình", role: "Barista", hours: 38, status: "Optimal" },
    { name: "Lê Hoàng Long", role: "Barista", hours: 38, status: "Optimal" },
    { name: "Hoàng Gia Huy", role: "Barista", hours: 34, status: "Optimal" },
    { name: "Bùi Tuyết Mai", role: "Barista", hours: 32, status: "Optimal" },
    { name: "Phạm Thảo Vy", role: "Cashier", hours: 36, status: "Optimal" },
    { name: "Dương Quốc Bảo", role: "Cashier", hours: 34, status: "Optimal" },
    { name: "Trịnh Thùy Linh", role: "Cashier", hours: 32, status: "Optimal" },
  ];

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* ================= 1. PAGE HEADER ================= */}
        <PageHeader
          eyebrow={
            lang === "vi"
              ? "Tuần 42 • 12/10 – 18/10/2026 • Chi nhánh: Central Hub"
              : "Week 42 • Oct 12 – Oct 18, 2026 • Store: Central Hub"
          }
          title={lang === "vi" ? "Phân tích lực lượng lao động" : "Workforce analytics"}
          description={
            lang === "vi"
              ? "Phân bổ khối lượng ca làm việc, tuân thủ định mức và hiệu quả quỹ lương"
              : "Operational workload distribution, labor compliance, and payroll efficiency"
          }
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 p-1 text-xs font-semibold gap-1">
                <button
                  type="button"
                  onClick={() => setSelectedPeriod("week42")}
                  className={`rounded-full px-3 py-1.5 transition cursor-pointer ${
                    selectedPeriod === "week42"
                      ? "bg-[#2F2C59] text-white dark:bg-indigo-600 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {lang === "vi" ? "Tuần 42" : "Week 42"}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPeriod("week41")}
                  className={`rounded-full px-3 py-1.5 transition cursor-pointer ${
                    selectedPeriod === "week41"
                      ? "bg-[#2F2C59] text-white dark:bg-indigo-600 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {lang === "vi" ? "Tuần 41" : "Week 41"}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPeriod("month10")}
                  className={`rounded-full px-3 py-1.5 transition cursor-pointer ${
                    selectedPeriod === "month10"
                      ? "bg-[#2F2C59] text-white dark:bg-indigo-600 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {lang === "vi" ? "Tháng 10" : "Month"}
                </button>
              </div>

              <PillButton variant="secondary" onClick={() => {}}>
                <Download className="h-3.5 w-3.5" />
                <span>{lang === "vi" ? "Xuất file CSV" : "Export CSV"}</span>
              </PillButton>
            </div>
          }
        />

        {/* ================= 2. FOUR CORE OPERATIONAL KPIS ================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          
          {/* KPI 1: Scheduled Hours */}
          <KpiCard
            label={lang === "vi" ? "Tổng số giờ xếp ca" : "Total scheduled hours"}
            value="896h"
            chip="-24h under cap"
            chipVariant="success"
            note={lang === "vi" ? "Định mức: 920.0h • Đạt 97.4%" : "Budget: 920.0h • 97.4% utilized"}
            icon={Clock}
            iconVariant="blue"
          >
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-[#2F5BFF] w-[97.4%] rounded-full" />
            </div>
          </KpiCard>

          {/* KPI 2: Overtime Avoidance */}
          <KpiCard
            label={lang === "vi" ? "Vi phạm làm thêm giờ" : "Overtime breaches"}
            value="0"
            chip="100% compliant"
            chipVariant="success"
            note={lang === "vi" ? "Quy định 48h được tuân thủ nghiêm ngặt" : "Statutory 48h rule enforced strictly"}
            icon={ShieldCheck}
            iconVariant="emerald"
          >
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-full rounded-full" />
            </div>
          </KpiCard>

          {/* KPI 3: Fairness Index */}
          <KpiCard
            label={lang === "vi" ? "Chỉ số công bằng" : "Fairness index"}
            value="98.2%"
            chip="±1.4h deviation"
            chipVariant="neutral"
            note={lang === "vi" ? "Phân bổ đồng đều giữa các nhân viên" : "Balanced load across full-time staff"}
            icon={TrendingUp}
            iconVariant="orange"
          >
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-[#FF7A59] w-[98.2%] rounded-full" />
            </div>
          </KpiCard>

          {/* KPI 4: Labor Cost Estimate */}
          <KpiCard
            label={lang === "vi" ? "Ước tính quỹ lương" : "Estimated payroll"}
            value="44.8M ₫"
            chip="-1.2M VND"
            chipVariant="success"
            note={lang === "vi" ? "Ngân sách: 46.0M VND • ~50k/h" : "Budget: 46.0M VND • 50k VND / hr avg"}
            icon={DollarSign}
            iconVariant="indigo"
          >
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-[#2F2C59] dark:bg-indigo-500 w-[96.5%] rounded-full" />
            </div>
          </KpiCard>

        </div>

        {/* ================= 3. CHARTS & BREAKDOWNS (12-COL GRID) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* LEFT: DAILY WORKLOAD & SHIFTS (7 COLS) */}
          <Card padding="lg" className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {lang === "vi" ? "Số lượng nhân sự & ca làm theo ngày" : "Daily staffing & shift volume"}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {lang === "vi"
                    ? "Nhân sự được phân công theo ca sáng, ca chiều và ca đêm"
                    : "Staff assigned per day across morning, afternoon, and night shifts"}
                </p>
              </div>
              <StatusChip variant="neutral">
                {lang === "vi" ? "122 ca tổng cộng" : "122 total shifts"}
              </StatusChip>
            </div>

            {/* Daily Bars */}
            <div className="space-y-3 pt-1">
              {dailyLoad.map((item) => {
                const maxLoad = 24;
                const pct = (item.totalStaff / maxLoad) * 100;
                return (
                  <div key={item.day} className="space-y-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                      <div className="flex items-center space-x-2">
                        <span className="w-8 font-semibold text-slate-800 dark:text-slate-200">
                          {item.day}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                          {item.totalStaff} staff • {item.hours}h
                        </span>
                      </div>
                      <div className="flex items-center space-x-2.5 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                        <span className="text-[#2F5BFF] font-medium">{item.morning} {lang === "vi" ? "sáng" : "morning"}</span>
                        <span className="text-[#FF7A59] font-medium">{item.afternoon} {lang === "vi" ? "chiều" : "afternoon"}</span>
                        <span className="text-[#2F2C59] dark:text-indigo-400 font-medium">{item.night} {lang === "vi" ? "đêm" : "night"}</span>
                      </div>
                    </div>

                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                      <div
                        style={{ width: `${(item.morning / item.totalStaff) * pct}%` }}
                        className="h-full bg-[#2F5BFF]"
                        title={`Morning: ${item.morning} staff`}
                      />
                      <div
                        style={{ width: `${(item.afternoon / item.totalStaff) * pct}%` }}
                        className="h-full bg-[#FF7A59]"
                        title={`Afternoon: ${item.afternoon} staff`}
                      />
                      <div
                        style={{ width: `${(item.night / item.totalStaff) * pct}%` }}
                        className="h-full bg-[#2F2C59] dark:bg-indigo-500"
                        title={`Night: ${item.night} staff`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#2F5BFF]" />
                  <span>{lang === "vi" ? "Sáng (07:00 – 15:00)" : "Morning (07:00 – 15:00)"}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#FF7A59]" />
                  <span>{lang === "vi" ? "Chiều (14:00 – 22:00)" : "Afternoon (14:00 – 22:00)"}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#2F2C59] dark:bg-indigo-500" />
                  <span>{lang === "vi" ? "Đêm (22:00 – 06:00)" : "Night (22:00 – 06:00)"}</span>
                </span>
              </div>
            </div>
          </Card>

          {/* RIGHT: ROLE ALLOCATION & FAIRNESS BREAKDOWN (5 COLS) */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Box 1: Role Allocation */}
            <Card padding="lg" className="space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {lang === "vi" ? "Phân bổ nhân lực theo vai trò" : "Labor by department"}
                </h2>
                <StatusChip variant="neutral">
                  896h total
                </StatusChip>
              </div>

              {/* High-level segmented summary bar */}
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                {roleAllocation.map((ra) => (
                  <div
                    key={ra.role}
                    style={{ width: `${ra.percentage}%` }}
                    className={`h-full ${ra.color}`}
                    title={`${ra.role}: ${ra.percentage}%`}
                  />
                ))}
              </div>

              <div className="space-y-3 pt-1">
                {roleAllocation.map((ra) => (
                  <div key={ra.role} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {ra.role}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 tabular-nums font-medium">
                        {ra.hours}h ({ra.percentage}%)
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${ra.color} rounded-full`}
                        style={{ width: `${ra.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Box 2: Staff Workload Sample */}
            <Card padding="lg" className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {lang === "vi" ? "Định mức giờ làm theo nhân sự" : "Weekly staff workload"}
                </h2>
                <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 text-[11px] font-semibold">
                  Max 40h • Cap 48h
                </span>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {staffWorkload.map((sw) => (
                  <div
                    key={sw.name}
                    className="flex items-center justify-between text-xs p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 transition hover:border-slate-200 dark:hover:border-slate-700"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">{sw.name}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{sw.role}</div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-0.5">
                      <div className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                        {sw.hours}.0h
                      </div>
                      <StatusChip variant="success">
                        {sw.status}
                      </StatusChip>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
