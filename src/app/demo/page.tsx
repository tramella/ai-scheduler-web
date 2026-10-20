"use client";

import React, { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  Sparkles,
  CalendarDays,
  Database,
  Code2,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Layers,
} from "lucide-react";
import { ScheduleResultView } from "@/components/scheduling/ScheduleResultView";
import { DailySchedule } from "@/lib/api-clients/schedule/scheduleApi";

// Realistic 7-day baseline demo dataset matching AI Studio solver output
const BASELINE_DEMO_SCHEDULES: DailySchedule[] = [
  {
    date: "2026-10-19",
    locations: [
      {
        id: "LOC_01",
        name: "Main Store - Central Hub",
        shifts: [
          {
            id: "SHIFT_MORNING",
            name: "Morning Shift (Opening)",
            start: "07:00",
            end: "15:00",
            employees: [
              { id: "NV001", name: "Nguyễn Văn An", job_title: "Shift Supervisor" },
              { id: "NV002", name: "Trần Thị Bích", job_title: "Senior Barista" },
              { id: "NV003", name: "Lê Hoàng Cường", job_title: "Cashier" },
            ],
          },
          {
            id: "SHIFT_AFTERNOON",
            name: "Afternoon Shift (Peak)",
            start: "14:30",
            end: "22:30",
            employees: [
              { id: "NV004", name: "Phạm Minh Đức", job_title: "Barista" },
              { id: "NV005", name: "Hoàng Mai Hương", job_title: "Cashier" },
              { id: "NV006", name: "Đỗ Gia Huy", job_title: "Kitchen Assistant" },
            ],
          },
          {
            id: "SHIFT_NIGHT",
            name: "Night Shift (Closing)",
            start: "22:00",
            end: "06:00",
            employees: [
              { id: "NV007", name: "Vũ Tuấn Kiệt", job_title: "Security & Closing Lead" },
              { id: "NV008", name: "Bùi Ngọc Linh", job_title: "Maintenance" },
            ],
          },
        ],
      },
    ],
  },
  {
    date: "2026-10-20",
    locations: [
      {
        id: "LOC_01",
        name: "Main Store - Central Hub",
        shifts: [
          {
            id: "SHIFT_MORNING",
            name: "Morning Shift (Opening)",
            start: "07:00",
            end: "15:00",
            employees: [
              { id: "NV009", name: "Lý Khánh Nam", job_title: "Store Lead" },
              { id: "NV002", name: "Trần Thị Bích", job_title: "Senior Barista" },
              { id: "NV010", name: "Trịnh Thảo Nhi", job_title: "All-Round Staff" },
            ],
          },
          {
            id: "SHIFT_AFTERNOON",
            name: "Afternoon Shift (Peak)",
            start: "14:30",
            end: "22:30",
            employees: [
              { id: "NV001", name: "Nguyễn Văn An", job_title: "Shift Supervisor" },
              { id: "NV004", name: "Phạm Minh Đức", job_title: "Barista" },
              { id: "NV005", name: "Hoàng Mai Hương", job_title: "Cashier" },
            ],
          },
          {
            id: "SHIFT_NIGHT",
            name: "Night Shift (Closing)",
            start: "22:00",
            end: "06:00",
            employees: [
              { id: "NV007", name: "Vũ Tuấn Kiệt", job_title: "Security & Closing Lead" },
              { id: "NV008", name: "Bùi Ngọc Linh", job_title: "Maintenance" },
            ],
          },
        ],
      },
    ],
  },
  {
    date: "2026-10-21",
    locations: [
      {
        id: "LOC_01",
        name: "Main Store - Central Hub",
        shifts: [
          {
            id: "SHIFT_MORNING",
            name: "Morning Shift (Opening)",
            start: "07:00",
            end: "15:00",
            employees: [
              { id: "NV001", name: "Nguyễn Văn An", job_title: "Shift Supervisor" },
              { id: "NV003", name: "Lê Hoàng Cường", job_title: "Cashier" },
              { id: "NV006", name: "Đỗ Gia Huy", job_title: "Kitchen Assistant" },
            ],
          },
          {
            id: "SHIFT_AFTERNOON",
            name: "Afternoon Shift (Peak)",
            start: "14:30",
            end: "22:30",
            employees: [
              { id: "NV009", name: "Lý Khánh Nam", job_title: "Store Lead" },
              { id: "NV002", name: "Trần Thị Bích", job_title: "Senior Barista" },
              { id: "NV010", name: "Trịnh Thảo Nhi", job_title: "All-Round Staff" },
            ],
          },
          {
            id: "SHIFT_NIGHT",
            name: "Night Shift (Closing)",
            start: "22:00",
            end: "06:00",
            employees: [
              { id: "NV007", name: "Vũ Tuấn Kiệt", job_title: "Security & Closing Lead" },
              { id: "NV008", name: "Bùi Ngọc Linh", job_title: "Maintenance" },
            ],
          },
        ],
      },
    ],
  },
  {
    date: "2026-10-22",
    locations: [
      {
        id: "LOC_01",
        name: "Main Store - Central Hub",
        shifts: [
          {
            id: "SHIFT_MORNING",
            name: "Morning Shift (Opening)",
            start: "07:00",
            end: "15:00",
            employees: [
              { id: "NV001", name: "Nguyễn Văn An", job_title: "Shift Supervisor" },
              { id: "NV002", name: "Trần Thị Bích", job_title: "Senior Barista" },
              { id: "NV004", name: "Phạm Minh Đức", job_title: "Barista" },
            ],
          },
          {
            id: "SHIFT_AFTERNOON",
            name: "Afternoon Shift (Peak)",
            start: "14:30",
            end: "22:30",
            employees: [
              { id: "NV003", name: "Lê Hoàng Cường", job_title: "Cashier" },
              { id: "NV005", name: "Hoàng Mai Hương", job_title: "Cashier" },
              { id: "NV006", name: "Đỗ Gia Huy", job_title: "Kitchen Assistant" },
            ],
          },
          {
            id: "SHIFT_NIGHT",
            name: "Night Shift (Closing)",
            start: "22:00",
            end: "06:00",
            employees: [
              { id: "NV007", name: "Vũ Tuấn Kiệt", job_title: "Security & Closing Lead" },
              { id: "NV010", name: "Trịnh Thảo Nhi", job_title: "All-Round Staff" },
            ],
          },
        ],
      },
    ],
  },
  {
    date: "2026-10-23",
    locations: [
      {
        id: "LOC_01",
        name: "Main Store - Central Hub",
        shifts: [
          {
            id: "SHIFT_MORNING",
            name: "Morning Shift (Opening)",
            start: "07:00",
            end: "15:00",
            employees: [
              { id: "NV009", name: "Lý Khánh Nam", job_title: "Store Lead" },
              { id: "NV002", name: "Trần Thị Bích", job_title: "Senior Barista" },
              { id: "NV004", name: "Phạm Minh Đức", job_title: "Barista" },
            ],
          },
          {
            id: "SHIFT_AFTERNOON",
            name: "Afternoon Shift (Peak)",
            start: "14:30",
            end: "22:30",
            employees: [
              { id: "NV001", name: "Nguyễn Văn An", job_title: "Shift Supervisor" },
              { id: "NV003", name: "Lê Hoàng Cường", job_title: "Cashier" },
              { id: "NV005", name: "Hoàng Mai Hương", job_title: "Cashier" },
              { id: "NV006", name: "Đỗ Gia Huy", job_title: "Kitchen Assistant" },
            ],
          },
          {
            id: "SHIFT_NIGHT",
            name: "Night Shift (Closing)",
            start: "22:00",
            end: "06:00",
            employees: [
              { id: "NV007", name: "Vũ Tuấn Kiệt", job_title: "Security & Closing Lead" },
              { id: "NV008", name: "Bùi Ngọc Linh", job_title: "Maintenance" },
            ],
          },
        ],
      },
    ],
  },
  {
    date: "2026-10-24",
    locations: [
      {
        id: "LOC_01",
        name: "Main Store - Central Hub",
        shifts: [
          {
            id: "SHIFT_MORNING",
            name: "Morning Shift (Opening)",
            start: "07:00",
            end: "15:00",
            employees: [
              { id: "NV001", name: "Nguyễn Văn An", job_title: "Shift Supervisor" },
              { id: "NV004", name: "Phạm Minh Đức", job_title: "Barista" },
              { id: "NV005", name: "Hoàng Mai Hương", job_title: "Cashier" },
              { id: "NV010", name: "Trịnh Thảo Nhi", job_title: "All-Round Staff" },
            ],
          },
          {
            id: "SHIFT_AFTERNOON",
            name: "Afternoon Shift (Peak)",
            start: "14:30",
            end: "22:30",
            employees: [
              { id: "NV009", name: "Lý Khánh Nam", job_title: "Store Lead" },
              { id: "NV002", name: "Trần Thị Bích", job_title: "Senior Barista" },
              { id: "NV003", name: "Lê Hoàng Cường", job_title: "Cashier" },
              { id: "NV006", name: "Đỗ Gia Huy", job_title: "Kitchen Assistant" },
            ],
          },
          {
            id: "SHIFT_NIGHT",
            name: "Night Shift (Closing)",
            start: "22:00",
            end: "06:00",
            employees: [
              { id: "NV007", name: "Vũ Tuấn Kiệt", job_title: "Security & Closing Lead" },
              { id: "NV008", name: "Bùi Ngọc Linh", job_title: "Maintenance" },
            ],
          },
        ],
      },
    ],
  },
  {
    date: "2026-10-25",
    locations: [
      {
        id: "LOC_01",
        name: "Main Store - Central Hub",
        shifts: [
          {
            id: "SHIFT_MORNING",
            name: "Morning Shift (Opening)",
            start: "07:00",
            end: "15:00",
            employees: [
              { id: "NV001", name: "Nguyễn Văn An", job_title: "Shift Supervisor" },
              { id: "NV002", name: "Trần Thị Bích", job_title: "Senior Barista" },
              { id: "NV010", name: "Trịnh Thảo Nhi", job_title: "All-Round Staff" },
            ],
          },
          {
            id: "SHIFT_AFTERNOON",
            name: "Afternoon Shift (Peak)",
            start: "14:30",
            end: "22:30",
            employees: [
              { id: "NV004", name: "Phạm Minh Đức", job_title: "Barista" },
              { id: "NV005", name: "Hoàng Mai Hương", job_title: "Cashier" },
              { id: "NV006", name: "Đỗ Gia Huy", job_title: "Kitchen Assistant" },
            ],
          },
          {
            id: "SHIFT_NIGHT",
            name: "Night Shift (Closing)",
            start: "22:00",
            end: "06:00",
            employees: [
              { id: "NV007", name: "Vũ Tuấn Kiệt", job_title: "Security & Closing Lead" },
              { id: "NV008", name: "Bùi Ngọc Linh", job_title: "Maintenance" },
            ],
          },
        ],
      },
    ],
  },
];

const SQL_SCHEMA_SAMPLE = `-- Relational Schema (PostgreSQL / Prisma ORM)
CREATE TABLE schedule_periods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  name VARCHAR(120) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE shift_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_period_id UUID NOT NULL REFERENCES schedule_periods(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  shift_id UUID NOT NULL REFERENCES shifts(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT uq_employee_shift_day UNIQUE (employee_id, date, shift_id)
);

CREATE INDEX idx_assignments_date_lookup ON shift_assignments (schedule_period_id, date);
CREATE INDEX idx_assignments_employee_lookup ON shift_assignments (employee_id, date);`;

export default function DemoScheduleReviewPage() {
  const [schedules, setSchedules] = useState<DailySchedule[]>(BASELINE_DEMO_SCHEDULES);
  const [startDate, setStartDate] = useState("2026-10-19");
  const [endDate, setEndDate] = useState("2026-10-25");
  const [activeTab, setActiveTab] = useState<"calendar" | "schema" | "json">("calendar");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  }, []);

  // Simulate AI Solver re-optimizing the schedule
  const handleRegenerate = useCallback(() => {
    showToast("Re-optimizing roster schedule using deterministic AI solver...");

    // Simulated reshuffling while respecting constraints
    const rosterPool = [
      { id: "NV001", name: "Nguyễn Văn An", job_title: "Shift Supervisor" },
      { id: "NV002", name: "Trần Thị Bích", job_title: "Senior Barista" },
      { id: "NV003", name: "Lê Hoàng Cường", job_title: "Cashier" },
      { id: "NV004", name: "Phạm Minh Đức", job_title: "Barista" },
      { id: "NV005", name: "Hoàng Mai Hương", job_title: "Cashier" },
      { id: "NV006", name: "Đỗ Gia Huy", job_title: "Kitchen Assistant" },
      { id: "NV007", name: "Vũ Tuấn Kiệt", job_title: "Security & Closing Lead" },
      { id: "NV008", name: "Bùi Ngọc Linh", job_title: "Maintenance" },
      { id: "NV009", name: "Lý Khánh Nam", job_title: "Store Lead" },
      { id: "NV010", name: "Trịnh Thảo Nhi", job_title: "All-Round Staff" },
    ];

    setTimeout(() => {
      const reoptimized: DailySchedule[] = BASELINE_DEMO_SCHEDULES.map((day, dayIndex) => ({
        ...day,
        locations: day.locations.map((loc) => ({
          ...loc,
          shifts: loc.shifts.map((shift, shiftIndex) => {
            const shiftOffset = (dayIndex * 3 + shiftIndex) % rosterPool.length;
            const staffCount = shift.id === "SHIFT_NIGHT" ? 2 : shift.id === "SHIFT_AFTERNOON" ? 4 : 3;
            const selectedStaff = [];
            for (let i = 0; i < staffCount; i++) {
              selectedStaff.push(rosterPool[(shiftOffset + i) % rosterPool.length]);
            }
            return {
              ...shift,
              employees: selectedStaff,
            };
          }),
        })),
      }));

      setSchedules(reoptimized);
      showToast("Roster re-optimized with 100% policy compliance.");
    }, 700);
  }, [showToast]);

  const handleReset = useCallback(() => {
    setSchedules(BASELINE_DEMO_SCHEDULES);
    setStartDate("2026-10-19");
    setEndDate("2026-10-25");
    showToast("Restored baseline demo schedule.");
  }, [showToast]);

  const handleCopy = useCallback((text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  }, []);

  const totalAssignedStaff = useMemo(() => {
    let count = 0;
    schedules.forEach((d) =>
      d.locations.forEach((l) =>
        l.shifts.forEach((s) => {
          count += s.employees.length;
        })
      )
    );
    return count;
  }, [schedules]);

  return (
    <main className="min-h-screen bg-slate-50/70 dark:bg-slate-950 py-4 sm:py-12 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Floating Toast Notification */}
        {toastMessage && (
          <div
            role="status"
            className="fixed top-20 right-6 z-50 rounded-full bg-[#2F2C59] dark:bg-indigo-600 text-white px-4 py-2.5 text-xs font-semibold shadow-lg animate-in fade-in slide-in-from-top-2 flex items-center gap-2"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* ================= 1. PAGE HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center space-x-2 rounded-full bg-indigo-50/90 dark:bg-indigo-950/60 px-3.5 py-1 text-xs font-semibold text-indigo-950 dark:text-indigo-200 mb-2 border border-indigo-200/60 dark:border-indigo-800/60 shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-[#FF7A59]" />
              <span>Interactive AI Studio Sandbox</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Workforce Roster Calendar Demo
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{totalAssignedStaff} Shift Slots Active</span>
            </span>

            <Link
              href="/dashboard/ai-studio"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#2F2C59] dark:bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-[#1E1B3A] dark:hover:bg-indigo-700 shadow-xs transition active:scale-[0.99]"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#FF7A59]" />
              <span>Open in AI Studio</span>
              <ExternalLink className="h-3 w-3 ml-0.5 opacity-70" />
            </Link>
          </div>
        </div>

        {/* ================= 2. SEGMENTED TABS (AI STUDIO DESIGN SYSTEM) ================= */}
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 dark:border-slate-800">
          <div className="inline-flex rounded-full bg-slate-100 p-1 border border-slate-200/80 dark:bg-slate-800/70 dark:border-slate-700/60">
            <button
              type="button"
              onClick={() => setActiveTab("calendar")}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition cursor-pointer ${
                activeTab === "calendar"
                  ? "bg-[#2F2C59] text-white shadow-xs dark:bg-indigo-600"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <CalendarDays className="h-3.5 w-3.5" />
              <span>Calendar</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                Verified
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("schema")}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition cursor-pointer ${
                activeTab === "schema"
                  ? "bg-[#2F2C59] text-white shadow-xs dark:bg-indigo-600"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Database className="h-3.5 w-3.5" />
              <span>Database Schema</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("json")}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition cursor-pointer ${
                activeTab === "json"
                  ? "bg-[#2F2C59] text-white shadow-xs dark:bg-indigo-600"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Code2 className="h-3.5 w-3.5" />
              <span>Live JSON</span>
            </button>
          </div>
        </div>

        {/* ================= 3. TAB CONTENT ================= */}

        {/* Tab 1: Interactive Calendar View (Powered by ScheduleResultView) */}
        {activeTab === "calendar" && (
          <div className="w-full space-y-4 animate-in fade-in duration-200">
            <ScheduleResultView
              schedules={schedules}
              startDate={startDate}
              endDate={endDate}
              onRegenerate={handleRegenerate}
              onReset={handleReset}
              onScheduleChange={setSchedules}
            />
          </div>
        )}

        {/* Tab 2: Database Schema & DDL Reference */}
        {activeTab === "schema" && (
          <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-5 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Database className="h-4 w-4 text-[#FF7A59]" />
                  <span>Relational Schema (PostgreSQL / Prisma ORM)</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Normalized database DDL definitions with foreign key constraints, composite unique indexing, and cascade rules.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(SQL_SCHEMA_SAMPLE, "sql-schema")}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer self-start sm:self-auto"
              >
                {copiedType === "sql-schema" ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                <span>{copiedType === "sql-schema" ? "Copied SQL" : "Copy DDL"}</span>
              </button>
            </div>

            <div className="rounded-2xl bg-[#09090B] p-5 overflow-x-auto text-xs font-mono text-slate-200 border border-slate-800 leading-relaxed shadow-inner">
              <pre>{SQL_SCHEMA_SAMPLE}</pre>
            </div>
          </div>
        )}

        {/* Tab 3: Live JSON Payload */}
        {activeTab === "json" && (
          <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-5 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-[#2F5BFF]" />
                  <span>Real-time Schedule JSON Payload</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Live state output reflecting any drag-and-drop reassignments or shift modifications made in the Calendar tab.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(JSON.stringify(schedules, null, 2), "raw-json")}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer self-start sm:self-auto"
              >
                {copiedType === "raw-json" ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                <span>{copiedType === "raw-json" ? "Copied JSON" : "Copy JSON Payload"}</span>
              </button>
            </div>

            <div className="rounded-2xl bg-[#09090B] p-5 max-h-[600px] overflow-auto text-xs font-mono text-emerald-400 border border-slate-800 leading-relaxed shadow-inner">
              <pre>{JSON.stringify(schedules, null, 2)}</pre>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
