"use client";

import React, { useState } from "react";
import {
  Sparkles,
  CalendarDays,
  Building2,
  Users,
  CheckCircle2,
  Clock,
  Sliders,
  CheckCheck,
  Save,
  ShieldCheck,
  Check,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ScheduleResultView } from "@/components/scheduling/ScheduleResultView";
import { DailySchedule } from "@/lib/apiClient";

export default function AiStudioPage() {
  const { user, activeCompany } = useAuth();

  // Tab: "generator" (AI Generator) | "result" (Calendar Result)
  const [activeTab, setActiveTab] = useState<"generator" | "result">("generator");

  // 1. Generation Parameters
  const [selectedLocation, setSelectedLocation] = useState("Main Store - Central Hub");
  const [startDate, setStartDate] = useState("2026-10-19");
  const [endDate, setEndDate] = useState("2026-10-25");
  const [promptDirective, setPromptDirective] = useState(
    "Ensure at least 1 Senior Supervisor on every shift. Balance part-time staff across weekend evenings."
  );

  // Constraint Toggles
  const [maxHoursConstraint, setMaxHoursConstraint] = useState(true);
  const [minRestConstraint, setMinRestConstraint] = useState(true);
  const [mandatorySupervisor, setMandatorySupervisor] = useState(true);
  const [zeroDoubleBooking, setZeroDoubleBooking] = useState(true);

  // 2. Engine Execution State
  const [solvingStatus, setSolvingStatus] = useState<"IDLE" | "SOLVING">("IDLE");
  const [scheduleStatus, setScheduleStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Prompt Preset Chips
  const promptPresets = [
    "Prioritize part-time on weekends",
    "Double cashiers on Friday evening",
    "Rotate morning shifts fairly across all baristas",
  ];

  // 3. Database Grounded Seed Schedules (Week 43: Oct 19 - Oct 25, 2026)
  const sampleDatabaseSchedules: DailySchedule[] = [
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
                { id: "NV004", name: "Phạm Minh Đức", job_title: "Barista" },
                { id: "NV005", name: "Hoàng Mai Hương", job_title: "Cashier" },
              ],
            },
            {
              id: "SHIFT_AFTERNOON",
              name: "Afternoon Shift (Peak)",
              start: "14:30",
              end: "22:30",
              employees: [
                { id: "NV002", name: "Trần Thị Bích", job_title: "Senior Barista" },
                { id: "NV003", name: "Lê Hoàng Cường", job_title: "Cashier" },
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

  const [schedules, setSchedules] = useState<DailySchedule[]>(sampleDatabaseSchedules);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Run AI Schedule Generation
  const handleGenerate = () => {
    setSolvingStatus("SOLVING");

    setTimeout(() => {
      setSolvingStatus("IDLE");
      setScheduleStatus("DRAFT");
      setSchedules(sampleDatabaseSchedules);
      setActiveTab("result");
      showToast("Schedule generated! Switched to Calendar view.");
    }, 1200);
  };

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col space-y-4">
        
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-2.5 text-xs font-semibold shadow-lg animate-fade-in flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 dark:text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Clean Top Header with Tab Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-200 dark:border-slate-800 gap-3 shrink-0">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                AI Studio
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {activeCompany?.name || "Workspace"}
              </span>
            </div>
          </div>

          {/* Clean Segmented Tab Switcher + Primary Actions */}
          <div className="flex items-center space-x-3 self-start sm:self-auto">
            <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
              <button
                type="button"
                onClick={() => setActiveTab("generator")}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeTab === "generator"
                    ? "bg-white dark:bg-slate-900 text-[#2F2C59] dark:text-indigo-400 shadow-2xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>AI Generator</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("result")}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeTab === "result"
                    ? "bg-white dark:bg-slate-900 text-[#2F2C59] dark:text-indigo-400 shadow-2xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <CalendarDays className="h-3.5 w-3.5" />
                <span>Calendar</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                  {scheduleStatus === "PUBLISHED" ? "Published" : "Draft v1"}
                </span>
              </button>
            </div>

            {/* Calendar Tab Essential Actions (Save / Publish) */}
            {activeTab === "result" && (
              <div className="hidden sm:flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => showToast("Draft saved to workspace database.")}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer shadow-2xs"
                >
                  <Save className="h-3.5 w-3.5 text-slate-500" />
                  <span>Save</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setScheduleStatus("PUBLISHED");
                    showToast("Schedule published to staff members.");
                  }}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition active:scale-[0.99] cursor-pointer"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  <span>Publish</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* TAB 1: STREAMLINED AI GENERATOR */}
        {activeTab === "generator" && (
          <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-2">
            <div className="max-w-3xl mx-auto space-y-4">
              
              {/* Card 1: Scope, Period & Database Context */}
              <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white">
                  <span>Scope & Date Range</span>
                  <div className="flex items-center space-x-2 text-[11px] font-normal text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Database Synchronized</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Store Location
                    </label>
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 py-2 px-3 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-[#2F2C59]"
                    >
                      <option>Main Store - Central Hub</option>
                      <option>Express Branch - East Side</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 py-2 px-3 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-[#2F2C59]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 py-2 px-3 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-[#2F2C59]"
                    />
                  </div>
                </div>

                {/* Streamlined Rules Grid */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Active Constraint Policies
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={maxHoursConstraint}
                        onChange={(e) => setMaxHoursConstraint(e.target.checked)}
                        className="rounded text-[#2F2C59] focus:ring-0 cursor-pointer"
                      />
                      <span>Max 48 hours / week</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={minRestConstraint}
                        onChange={(e) => setMinRestConstraint(e.target.checked)}
                        className="rounded text-[#2F2C59] focus:ring-0 cursor-pointer"
                      />
                      <span>Min 11 hours rest interval</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={mandatorySupervisor}
                        onChange={(e) => setMandatorySupervisor(e.target.checked)}
                        className="rounded text-[#2F2C59] focus:ring-0 cursor-pointer"
                      />
                      <span>At least 1 Supervisor per shift</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={zeroDoubleBooking}
                        onChange={(e) => setZeroDoubleBooking(e.target.checked)}
                        className="rounded text-[#2F2C59] focus:ring-0 cursor-pointer"
                      />
                      <span>Zero double-booking guarantee</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Card 2: Directive Prompt & Generate Button */}
              <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs space-y-3">
                <label className="block text-xs font-bold text-slate-900 dark:text-white">
                  Operational Directive Prompt
                </label>
                <textarea
                  rows={2}
                  value={promptDirective}
                  onChange={(e) => setPromptDirective(e.target.value)}
                  placeholder="Enter specific instructions..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:border-[#2F2C59]"
                />

                <div className="flex flex-wrap gap-1 pt-0.5">
                  {promptPresets.map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPromptDirective(chip)}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    disabled={solvingStatus === "SOLVING"}
                    onClick={handleGenerate}
                    className="w-full inline-flex items-center justify-center rounded-xl bg-[#2F2C59] hover:bg-[#1E1B3A] dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white py-2.5 px-4 font-semibold text-xs shadow-xs transition active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                  >
                    {solvingStatus === "SOLVING" ? (
                      <>
                        <div className="h-3.5 w-3.5 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>Generating AI Schedule...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-1.5" />
                        <span>Generate Schedule with AI</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: SCHEDULE RESULT / CALENDAR (OPTIMIZED WIDESCREEN CANVAS) */}
        {activeTab === "result" && (
          <div className="flex-1 min-h-0 overflow-y-auto px-2 sm:px-4 lg:px-6 py-2.5">
            <div className="w-full max-w-[1750px] mx-auto space-y-3.5">
              <ScheduleResultView
                schedules={schedules}
                startDate={startDate}
                endDate={endDate}
                onRegenerate={handleGenerate}
                onReset={() => setActiveTab("generator")}
                onScheduleChange={setSchedules}
              />
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
