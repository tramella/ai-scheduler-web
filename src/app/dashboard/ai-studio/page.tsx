"use client";

import React, { useState, useRef, useEffect } from "react";
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
  MapPin,
  ChevronDown,
  ChevronRight,
  Plus,
  X,
  Cpu,
  RotateCcw,
  Filter,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ScheduleResultView } from "@/components/scheduling/ScheduleResultView";
import CustomDatePicker from "@/components/scheduling/CustomDatePicker";
import { DailySchedule } from "@/lib/apiClient";

export interface ConstraintPolicy {
  id: string;
  name: string;
  category: "COMPLIANCE" | "OPERATIONAL";
  description: string;
  enabled: boolean;
  type: "NUMBER" | "BOOLEAN" | "ROLE_SELECT";
  value?: number;
  unit?: string;
  role?: string;
  min?: number;
  max?: number;
  isCustom?: boolean;
}

const DEFAULT_POLICIES: ConstraintPolicy[] = [
  {
    id: "MAX_HOURS",
    name: "Max weekly hours limit",
    category: "COMPLIANCE",
    description: "Standard statutory overtime threshold",
    enabled: true,
    type: "NUMBER",
    value: 48,
    unit: "hrs/week",
    min: 30,
    max: 60,
  },
  {
    id: "MIN_REST",
    name: "Min rest between shifts",
    category: "COMPLIANCE",
    description: "Mandatory recovery interval between consecutive shifts",
    enabled: true,
    type: "NUMBER",
    value: 11,
    unit: "hours",
    min: 8,
    max: 16,
  },
  {
    id: "MANDATORY_ROLE",
    name: "Key leadership coverage",
    category: "OPERATIONAL",
    description: "Ensure verified supervisor on duty for each shift",
    enabled: true,
    type: "ROLE_SELECT",
    value: 1,
    role: "Shift Supervisor",
    unit: "staff",
  },
  {
    id: "ZERO_DOUBLE_BOOKING",
    name: "Zero double-booking",
    category: "COMPLIANCE",
    description: "Guarantee staff is never assigned overlapping slots",
    enabled: true,
    type: "BOOLEAN",
  },
];

const POLICY_TEMPLATES: Omit<ConstraintPolicy, "enabled">[] = [
  {
    id: "MAX_CONSECUTIVE_DAYS",
    name: "Max consecutive days",
    category: "COMPLIANCE",
    description: "Limit working streak before mandatory rest day",
    type: "NUMBER",
    value: 6,
    unit: "days",
    min: 3,
    max: 7,
    isCustom: true,
  },
  {
    id: "FAIRNESS_WORKLOAD",
    name: "Fair workload distribution",
    category: "OPERATIONAL",
    description: "Evenly balance assigned hours among staff of same role",
    type: "BOOLEAN",
    isCustom: true,
  },
  {
    id: "MIN_SHIFT_DURATION",
    name: "Minimum shift length",
    category: "OPERATIONAL",
    description: "Prevent micro-shifts shorter than minimum threshold",
    type: "NUMBER",
    value: 4,
    unit: "hours",
    min: 2,
    max: 8,
    isCustom: true,
  },
  {
    id: "WEEKEND_PART_TIME",
    name: "Prioritize weekend part-time",
    category: "OPERATIONAL",
    description: "Allocate student and part-time workers to Sat & Sun",
    type: "BOOLEAN",
    isCustom: true,
  },
];

export default function AiStudioPage() {
  const { user, activeCompany } = useAuth();

  // Tab: "generator" (AI Generator) | "result" (Calendar Result)
  const [activeTab, setActiveTab] = useState<"generator" | "result">("generator");

  // 1. Generation Parameters
  const [selectedLocation, setSelectedLocation] = useState("Main Store - Central Hub");
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const locationDropdownRef = useRef<HTMLDivElement>(null);

  const availableLocations = [
    {
      id: "LOC_01",
      name: "Main Store - Central Hub",
      badge: "Primary Hub",
      staffCount: "10 active staff",
      staffNum: 10,
      shiftCount: "3 daily shifts",
      shiftBreakdown: "Opening • Peak • Closing",
      complianceStatus: "100% Pre-flight Valid",
    },
    {
      id: "LOC_02",
      name: "Express Branch - East Side",
      badge: "Express Branch",
      staffCount: "8 active staff",
      staffNum: 8,
      shiftCount: "3 daily shifts",
      shiftBreakdown: "Opening • Peak • Closing",
      complianceStatus: "100% Pre-flight Valid",
    },
  ];

  const currentLocation =
    availableLocations.find((l) => l.name === selectedLocation) ||
    availableLocations[0];

  // Close location dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        locationDropdownRef.current &&
        !locationDropdownRef.current.contains(event.target as Node)
      ) {
        setLocationDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [startDate, setStartDate] = useState("2026-10-19");
  const [endDate, setEndDate] = useState("2026-10-25");
  const [promptDirective, setPromptDirective] = useState(
    "Ensure at least 1 Senior Supervisor on every shift. Balance part-time staff across weekend evenings."
  );

  // Constraint Policies State (Combination of Parameterized Cards + Template Builder)
  const [policies, setPolicies] = useState<ConstraintPolicy[]>(DEFAULT_POLICIES);
  const [drawerCategory, setDrawerCategory] = useState<"ALL" | "COMPLIANCE" | "OPERATIONAL">("ALL");
  const [isPoliciesDrawerOpen, setIsPoliciesDrawerOpen] = useState(false);
  const [addPolicyDropdownOpen, setAddPolicyDropdownOpen] = useState(false);
  const addPolicyDropdownRef = useRef<HTMLDivElement>(null);

  // Close add policy dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        addPolicyDropdownRef.current &&
        !addPolicyDropdownRef.current.contains(event.target as Node)
      ) {
        setAddPolicyDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close policies drawer on ESC key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isPoliciesDrawerOpen) {
        setIsPoliciesDrawerOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPoliciesDrawerOpen]);

  const togglePolicy = (id: string) => {
    setPolicies((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const updatePolicyValue = (id: string, value: number) => {
    setPolicies((prev) =>
      prev.map((p) => (p.id === id ? { ...p, value } : p))
    );
  };

  const updatePolicyRole = (id: string, role: string) => {
    setPolicies((prev) =>
      prev.map((p) => (p.id === id ? { ...p, role } : p))
    );
  };

  const removePolicy = (id: string) => {
    setPolicies((prev) => prev.filter((p) => p.id !== id));
  };

  const resetPoliciesToDefault = () => {
    setPolicies(DEFAULT_POLICIES);
    showToast("Restored default constraint policies.");
  };

  const addPolicyFromTemplate = (template: (typeof POLICY_TEMPLATES)[number]) => {
    if (policies.some((p) => p.id === template.id)) return;
    setPolicies((prev) => [...prev, { ...template, enabled: true }]);
    setAddPolicyDropdownOpen(false);
    showToast(`Added policy: ${template.name}`);
  };

  const availableTemplates = POLICY_TEMPLATES.filter(
    (t) => !policies.some((p) => p.id === t.id)
  );

  const enabledPolicies = policies.filter((p) => p.enabled);
  const filteredPolicies = policies.filter((p) => {
    if (drawerCategory === "COMPLIANCE") return p.category === "COMPLIANCE";
    if (drawerCategory === "OPERATIONAL") return p.category === "OPERATIONAL";
    return true;
  });

  const toggleAllFilteredPolicies = (enable: boolean) => {
    setPolicies((prev) =>
      prev.map((p) => {
        if (drawerCategory === "ALL" || p.category === drawerCategory) {
          return { ...p, enabled: enable };
        }
        return p;
      })
    );
    showToast(enable ? "Enabled all filtered policies" : "Disabled all filtered policies");
  };

  const policiesSummaryText = enabledPolicies
    .map((p) => {
      if (p.id === "MAX_HOURS") return `Max ${p.value}h/wk`;
      if (p.id === "MIN_REST") return `Min ${p.value}h rest`;
      if (p.id === "MANDATORY_ROLE") return `${p.value} ${p.role?.split(" ")[0] || "Supervisor"}`;
      if (p.id === "ZERO_DOUBLE_BOOKING") return "No Overlap";
      return p.name;
    })
    .join(" • ");

  // 2. Engine Execution State
  const [solvingStatus, setSolvingStatus] = useState<"IDLE" | "SOLVING">("IDLE");
  const [solvingPhase, setSolvingPhase] = useState<number>(0);
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

  // Multi-phase AI Schedule Generation
  const handleGenerate = () => {
    if (solvingStatus === "SOLVING") return;
    setSolvingStatus("SOLVING");
    setSolvingPhase(1);

    setTimeout(() => {
      setSolvingPhase(2);
    }, 450);

    setTimeout(() => {
      setSolvingPhase(3);
    }, 950);

    setTimeout(() => {
      setSolvingStatus("IDLE");
      setSolvingPhase(0);
      setScheduleStatus("DRAFT");
      setSchedules(sampleDatabaseSchedules);
      setActiveTab("result");
      showToast("Schedule generated! Switched to Calendar view.");
    }, 1450);
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

        {/* Modern Tab Bar Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800/80 gap-3 shrink-0">
          {/* Tab Switcher: Generator (1 word) vs Calendar (1 word) */}
          <div className="inline-flex p-1 bg-slate-100/90 dark:bg-slate-800/70 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
            <button
              type="button"
              onClick={() => setActiveTab("generator")}
              className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === "generator"
                  ? "bg-white dark:bg-slate-900 text-[#2F2C59] dark:text-white shadow-2xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Generator</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("result")}
              className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === "result"
                  ? "bg-white dark:bg-slate-900 text-[#2F2C59] dark:text-white shadow-2xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <CalendarDays className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
              <span>Calendar</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                {scheduleStatus === "PUBLISHED" ? "Published" : "Draft v1"}
              </span>
            </button>
          </div>

          {/* Right Action Area */}
          <div className="flex items-center space-x-2">
            {activeTab === "generator" ? (
              <div className="hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                <span>Deterministic AI Ready</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
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

        {/* TAB 1: STREAMLINED AI GENERATOR (REDESIGNED 2-COLUMN STUDIO WORKSPACE) */}
        {activeTab === "generator" && (
          <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-2.5">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4.5 items-start">
                
                {/* LEFT COLUMN: PRIMARY GENERATION WORKFLOW (7 cols) */}
                <div className="lg:col-span-7 space-y-4">
                  
                  {/* Card 1: Scope & Scheduling Window */}
                  <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white">
                      <span>Scheduling Scope & Window</span>
                      <div className="flex items-center space-x-1.5 text-[11px] font-normal text-emerald-600 dark:text-emerald-400">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>Database Synchronized</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                      {/* Modern Location Dropdown */}
                      <div className="relative" ref={locationDropdownRef}>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center space-x-1.5">
                          <Building2 className="h-3.5 w-3.5 text-slate-400" />
                          <span>Store Location</span>
                        </label>

                        <button
                          type="button"
                          onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                          className="w-full flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-700/70 px-3.5 py-2 text-xs font-semibold text-slate-900 dark:text-slate-100 shadow-2xs transition focus:outline-hidden hover:border-[#2F2C59]/40 dark:hover:border-indigo-500/50 cursor-pointer"
                        >
                          <div className="flex items-center space-x-2 truncate">
                            <MapPin className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                            <span className="truncate">{selectedLocation}</span>
                          </div>
                          <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                            <span className="hidden sm:inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50">
                              {availableLocations.find((l) => l.name === selectedLocation)?.badge || "Location"}
                            </span>
                            <ChevronDown
                              className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-150 ${
                                locationDropdownOpen ? "rotate-180 text-indigo-600 dark:text-indigo-400" : ""
                              }`}
                            />
                          </div>
                        </button>

                        {/* Dropdown Menu */}
                        {locationDropdownOpen && (
                          <div className="absolute left-0 top-full mt-1.5 z-40 w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-150">
                            {availableLocations.map((loc) => {
                              const isSelected = loc.name === selectedLocation;
                              return (
                                <button
                                  key={loc.id}
                                  type="button"
                                  onClick={() => {
                                    setSelectedLocation(loc.name);
                                    setLocationDropdownOpen(false);
                                  }}
                                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition cursor-pointer text-left ${
                                    isSelected
                                      ? "bg-indigo-50/80 dark:bg-indigo-950/60 text-[#2F2C59] dark:text-indigo-300 font-bold"
                                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
                                  }`}
                                >
                                  <div className="flex items-center space-x-2.5 truncate">
                                    <div
                                      className={`p-1.5 rounded-lg ${
                                        isSelected
                                          ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300"
                                          : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                                      }`}
                                    >
                                      <MapPin className="h-3.5 w-3.5" />
                                    </div>
                                    <div className="truncate">
                                      <div className="truncate leading-tight">{loc.name}</div>
                                      <div className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">
                                        {loc.staffCount}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                      {loc.badge}
                                    </span>
                                    {isSelected && <Check className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Modern Date Range using CustomDatePicker */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center space-x-1.5">
                          <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                          <span>Schedule Date Range</span>
                        </label>

                        <CustomDatePicker
                          mode="week"
                          fullWidth
                          startDate={startDate}
                          endDate={endDate}
                          onDateChange={({ startDate: st, endDate: ed }) => {
                            if (st) setStartDate(st);
                            if (ed) setEndDate(ed);
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Directive Prompt & Generate Button */}
                  <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs space-y-3.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <label className="block text-xs font-bold text-slate-900 dark:text-white">
                          Operational Directive Prompt
                        </label>
                        {promptDirective.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setPromptDirective("")}
                            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition cursor-pointer"
                            title="Clear directive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                      <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                        {promptDirective.length}/500 chars
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <textarea
                        rows={3}
                        maxLength={500}
                        value={promptDirective}
                        onChange={(e) => setPromptDirective(e.target.value)}
                        onKeyDown={(e) => {
                          if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                            e.preventDefault();
                            handleGenerate();
                          }
                        }}
                        placeholder="Enter specific instructions (e.g. ensure 1 senior supervisor on duty, balance weekend shifts)..."
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:border-[#2F2C59] focus:ring-2 focus:ring-[#2F2C59]/10 dark:focus:ring-indigo-500/20"
                      />

                      <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 pt-0.5">
                        <span className="flex items-center space-x-1">
                          <span>Shortcut:</span>
                          <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px] text-slate-600 dark:text-slate-300">
                            Ctrl
                          </kbd>
                          <span>+</span>
                          <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px] text-slate-600 dark:text-slate-300">
                            Enter
                          </kbd>
                          <span>to run solver</span>
                        </span>
                        <span>Natural language optimization</span>
                      </div>
                    </div>

                    {/* Directive Presets */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mr-1">Presets:</span>
                      {promptPresets.map((chip, idx) => {
                        const isSelected = promptDirective === chip;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setPromptDirective(chip);
                              showToast(`Applied preset directive: "${chip}"`);
                            }}
                            className={`text-[10px] px-2.5 py-1 rounded-lg transition cursor-pointer border flex items-center space-x-1 ${
                              isSelected
                                ? "bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 font-semibold"
                                : "bg-slate-100 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-200/50 dark:border-slate-700/50"
                            }`}
                          >
                            {isSelected && <Check className="h-2.5 w-2.5 text-indigo-600 dark:text-indigo-400 mr-0.5" />}
                            <span>{chip}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Solving Progress Visualizer */}
                    {solvingStatus === "SOLVING" && (
                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-indigo-200 dark:border-indigo-900/60 space-y-2.5 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2 font-bold text-slate-900 dark:text-white">
                            <div className="h-3.5 w-3.5 rounded-full border-2 border-indigo-600 dark:border-indigo-400 border-t-transparent animate-spin" />
                            <span>AI Optimization Engine Running</span>
                          </div>
                          <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                            {solvingPhase === 1 ? "Phase 1/3 (35%)" : solvingPhase === 2 ? "Phase 2/3 (75%)" : "Phase 3/3 (100%)"}
                          </span>
                        </div>

                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-indigo-600 dark:bg-indigo-500 h-full transition-all duration-300 ease-out"
                            style={{
                              width: solvingPhase === 1 ? "35%" : solvingPhase === 2 ? "75%" : "100%",
                            }}
                          />
                        </div>

                        <div className="space-y-1.5 pt-1 text-[11px]">
                          <div className="flex items-center space-x-2">
                            {solvingPhase > 1 ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                            ) : (
                              <div className="h-3.5 w-3.5 rounded-full border border-indigo-500 border-t-transparent animate-spin shrink-0" />
                            )}
                            <span className={solvingPhase > 1 ? "text-slate-600 dark:text-slate-300" : "font-semibold text-indigo-700 dark:text-indigo-300"}>
                              Ingesting {currentLocation.staffNum} staff constraints & time-off availability
                            </span>
                          </div>

                          <div className="flex items-center space-x-2">
                            {solvingPhase > 2 ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                            ) : solvingPhase === 2 ? (
                              <div className="h-3.5 w-3.5 rounded-full border border-indigo-500 border-t-transparent animate-spin shrink-0" />
                            ) : (
                              <div className="h-3.5 w-3.5 rounded-full border border-slate-300 dark:border-slate-600 shrink-0" />
                            )}
                            <span className={solvingPhase > 2 ? "text-slate-600 dark:text-slate-300" : solvingPhase === 2 ? "font-semibold text-indigo-700 dark:text-indigo-300" : "text-slate-400 dark:text-slate-500"}>
                              Evaluating {enabledPolicies.length} active constraint policies & fairness matrix
                            </span>
                          </div>

                          <div className="flex items-center space-x-2">
                            {solvingPhase >= 3 ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                            ) : (
                              <div className="h-3.5 w-3.5 rounded-full border border-slate-300 dark:border-slate-600 shrink-0" />
                            )}
                            <span className={solvingPhase >= 3 ? "font-semibold text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"}>
                              Zero conflicts verified. Rendering interactive calendar canvas
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

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
                            <span>
                              {solvingPhase === 1
                                ? "Phase 1/3: Ingesting constraints..."
                                : solvingPhase === 2
                                ? "Phase 2/3: Solving fairness matrix..."
                                : "Phase 3/3: Verifying zero conflicts..."}
                            </span>
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

                {/* RIGHT COLUMN: OPERATIONAL INTELLIGENCE & POLICY GUARDRAILS (5 cols) */}
                <div className="lg:col-span-5 space-y-4">
                  
                  {/* Card 3: Operational Readiness Baseline */}
                  <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs space-y-3.5">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white">
                      <div className="flex items-center space-x-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Operational Readiness</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                        Pre-flight Checked
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      {/* Metric 1 */}
                      <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            Staff Pool
                          </span>
                          <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                            <Users className="h-3 w-3" />
                          </div>
                        </div>
                        <div className="mt-1 text-sm font-extrabold text-slate-900 dark:text-white">
                          {currentLocation.staffNum} Staff
                        </div>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                          Active & available
                        </p>
                      </div>

                      {/* Metric 2 */}
                      <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            Shift Slots
                          </span>
                          <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                            <Clock className="h-3 w-3" />
                          </div>
                        </div>
                        <div className="mt-1 text-sm font-extrabold text-slate-900 dark:text-white">
                          3 Shifts/Day
                        </div>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                          Open • Peak • Close
                        </p>
                      </div>

                      {/* Metric 3 */}
                      <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            Compliance
                          </span>
                          <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                            <ShieldCheck className="h-3 w-3" />
                          </div>
                        </div>
                        <div className="mt-1 text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                          Pre-validated
                        </div>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                          0 leave collisions
                        </p>
                      </div>

                      {/* Metric 4 */}
                      <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            Solver Engine
                          </span>
                          <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                            <Cpu className="h-3 w-3" />
                          </div>
                        </div>
                        <div className="mt-1 text-sm font-extrabold text-slate-900 dark:text-white">
                          OR-Tools v2.4
                        </div>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                          Deterministic logic
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card 4: Active Constraint Policies Card */}
                  <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs space-y-3.5">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white">
                      <div className="flex items-center space-x-2">
                        <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Active Constraint Policies</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                        {enabledPolicies.length} Active
                      </span>
                    </div>

                    {/* Compact List of Enabled Policies */}
                    <div className="space-y-2">
                      {enabledPolicies.map((p) => {
                        const isCompliance = p.category === "COMPLIANCE";
                        let valText = "Enforced";
                        if (p.type === "NUMBER") valText = `${p.value} ${p.unit}`;
                        if (p.type === "ROLE_SELECT") valText = `${p.value} ${p.role?.split(" ")[0] || "Supervisor"}`;

                        return (
                          <div
                            key={p.id}
                            className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center space-x-2 min-w-0">
                              <span
                                className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                                  isCompliance ? "bg-emerald-500" : "bg-indigo-500"
                                }`}
                              />
                              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                                {p.name}
                              </span>
                            </div>

                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 shadow-2xs shrink-0 ml-2">
                              {valText}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={resetPoliciesToDefault}
                        className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition cursor-pointer"
                      >
                        Reset Defaults
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsPoliciesDrawerOpen(true)}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition cursor-pointer shadow-2xs group"
                      >
                        <Sliders className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 group-hover:rotate-45 transition-transform" />
                        <span>Configure Policies</span>
                        <ChevronRight className="h-3 w-3 text-slate-400" />
                      </button>
                    </div>
                  </div>

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

        {/* SLIDE-OVER DRAWER FOR CONSTRAINT POLICIES (OPTION A) */}
        {isPoliciesDrawerOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
              onClick={() => setIsPoliciesDrawerOpen(false)}
            />

            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
              <div className="w-screen max-w-lg bg-white dark:bg-[#0D111D] border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-250">
                
                {/* Drawer Header */}
                <div className="px-6 py-4.5 border-b border-slate-200/90 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-[#2F2C59] dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/60">
                      <Sliders className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                        <span>Constraint Policies Engine</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                          {enabledPolicies.length}/{policies.length} Active
                        </span>
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Configure statutory limits, supervisory coverage & fairness optimization
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsPoliciesDrawerOpen(false)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Drawer Category Tabs & Action Bar */}
                <div className="px-6 py-2.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#0D111D] flex flex-wrap items-center justify-between gap-2 shrink-0">
                  {/* Category Filter Pills */}
                  <div className="inline-flex p-0.5 bg-slate-200/70 dark:bg-slate-800 rounded-xl text-xs">
                    <button
                      type="button"
                      onClick={() => setDrawerCategory("ALL")}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                        drawerCategory === "ALL"
                          ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs"
                          : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                      }`}
                    >
                      All ({policies.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setDrawerCategory("COMPLIANCE")}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                        drawerCategory === "COMPLIANCE"
                          ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-2xs"
                          : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                      }`}
                    >
                      Compliance ({policies.filter((p) => p.category === "COMPLIANCE").length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setDrawerCategory("OPERATIONAL")}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                        drawerCategory === "OPERATIONAL"
                          ? "bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 shadow-2xs"
                          : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                      }`}
                    >
                      Operational ({policies.filter((p) => p.category === "OPERATIONAL").length})
                    </button>
                  </div>

                  {/* Actions: Bulk Toggle & Add Policy */}
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        const anyDisabled = filteredPolicies.some((p) => !p.enabled);
                        toggleAllFilteredPolicies(anyDisabled);
                      }}
                      className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition cursor-pointer underline underline-offset-2"
                    >
                      {filteredPolicies.some((p) => !p.enabled) ? "Enable All" : "Disable All"}
                    </button>

                    {/* Add Policy Dropdown */}
                    <div className="relative" ref={addPolicyDropdownRef}>
                      <button
                        type="button"
                        disabled={availableTemplates.length === 0}
                        onClick={() => setAddPolicyDropdownOpen(!addPolicyDropdownOpen)}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer shadow-2xs disabled:opacity-40"
                      >
                        <Plus className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                        <span>Add Policy</span>
                        <ChevronDown className={`h-2.5 w-2.5 text-slate-400 transition-transform ${addPolicyDropdownOpen ? "rotate-180" : ""}`} />
                      </button>

                    {/* Add Policy Templates Menu */}
                    {addPolicyDropdownOpen && (
                      <div className="absolute right-0 top-full mt-1.5 z-50 w-76 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-150">
                        <div className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                          Policy Template Library
                        </div>
                        {availableTemplates.length === 0 ? (
                          <div className="p-3 text-xs text-slate-400 text-center">
                            All templates already added
                          </div>
                        ) : (
                          availableTemplates.map((template) => (
                            <button
                              key={template.id}
                              type="button"
                              onClick={() => addPolicyFromTemplate(template)}
                              className="w-full flex items-start space-x-2.5 p-2 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800/80 transition cursor-pointer group"
                            >
                              <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                                template.category === "COMPLIANCE"
                                  ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400"
                                  : "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400"
                              }`}>
                                <Plus className="h-3.5 w-3.5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                                  {template.name}
                                </div>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                                  {template.description}
                                </p>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

                {/* Drawer Body: Filtered Policy Cards List */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                  {filteredPolicies.length === 0 ? (
                    <div className="py-12 px-4 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
                      <Filter className="h-6 w-6 text-slate-400 mx-auto mb-2" />
                      <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        No policies in this category
                      </div>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                        Switch category filter or add a new policy template.
                      </p>
                      <button
                        type="button"
                        onClick={() => setDrawerCategory("ALL")}
                        className="mt-3 inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 transition cursor-pointer"
                      >
                        <span>Show all rules</span>
                      </button>
                    </div>
                  ) : (
                    filteredPolicies.map((policy) => {
                    const isCompliance = policy.category === "COMPLIANCE";
                    return (
                      <div
                        key={policy.id}
                        className={`p-3.5 rounded-2xl border transition flex flex-col justify-between ${
                          policy.enabled
                            ? "bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-2xs"
                            : "bg-slate-50/50 dark:bg-slate-900/30 border-slate-200/60 dark:border-slate-800/40 opacity-60"
                        }`}
                      >
                        {/* Header: Tag + Switch + Delete */}
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              isCompliance
                                ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50"
                                : "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50"
                            }`}
                          >
                            <ShieldCheck className="h-3 w-3" />
                            <span>{isCompliance ? "Legal Compliance" : "Operational Target"}</span>
                          </span>

                          <div className="flex items-center space-x-2">
                            {policy.isCustom && (
                              <button
                                type="button"
                                onClick={() => removePolicy(policy.id)}
                                className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                                title="Remove policy"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            )}

                            {/* Toggle switch */}
                            <button
                              type="button"
                              onClick={() => togglePolicy(policy.id)}
                              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                                policy.enabled ? "bg-[#2F2C59] dark:bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"
                              }`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                  policy.enabled ? "translate-x-4" : "translate-x-0"
                                }`}
                              />
                            </button>
                          </div>
                        </div>

                        {/* Name & Desc */}
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">
                            {policy.name}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {policy.description}
                          </p>
                        </div>

                        {/* Parameterized Values */}
                        <div className="pt-2.5 mt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                          {policy.type === "NUMBER" && (
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                Threshold limit:
                              </span>
                              <div className="flex items-center space-x-1.5">
                                <input
                                  type="number"
                                  min={policy.min || 1}
                                  max={policy.max || 100}
                                  value={policy.value}
                                  disabled={!policy.enabled}
                                  onChange={(e) => updatePolicyValue(policy.id, Math.max(1, Number(e.target.value)))}
                                  className="w-16 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1 text-center text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-[#2F2C59] dark:focus:border-indigo-500 disabled:opacity-40"
                                />
                                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                                  {policy.unit}
                                </span>
                              </div>
                            </div>
                          )}

                          {policy.type === "ROLE_SELECT" && (
                            <div className="flex items-center justify-between text-xs gap-2">
                              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                Mandatory staff:
                              </span>
                              <div className="flex items-center space-x-1.5">
                                <input
                                  type="number"
                                  min={1}
                                  max={5}
                                  value={policy.value}
                                  disabled={!policy.enabled}
                                  onChange={(e) => updatePolicyValue(policy.id, Math.max(1, Number(e.target.value)))}
                                  className="w-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-1.5 py-1 text-center text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-[#2F2C59] dark:focus:border-indigo-500 disabled:opacity-40"
                                />
                                <select
                                  value={policy.role}
                                  disabled={!policy.enabled}
                                  onChange={(e) => updatePolicyRole(policy.id, e.target.value)}
                                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-[#2F2C59] dark:focus:border-indigo-500 disabled:opacity-40"
                                >
                                  <option value="Shift Supervisor">Supervisor</option>
                                  <option value="Senior Barista">Senior Barista</option>
                                  <option value="Cashier">Cashier Lead</option>
                                  <option value="Security Lead">Security Lead</option>
                                </select>
                              </div>
                            </div>
                          )}

                          {policy.type === "BOOLEAN" && (
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                Solver enforcement:
                              </span>
                              <span
                                className={`text-[11px] font-bold ${
                                  policy.enabled
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : "text-slate-400"
                                }`}
                              >
                                {policy.enabled ? "Strictly Enforced" : "Deactivated"}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }))}
                </div>

                {/* Drawer Footer */}
                <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 flex items-center justify-between shrink-0">
                  <button
                    type="button"
                    onClick={resetPoliciesToDefault}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition cursor-pointer"
                  >
                    Reset Defaults
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsPoliciesDrawerOpen(false);
                      showToast(`Applied ${enabledPolicies.length} constraint policies.`);
                    }}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#2F2C59] hover:bg-[#1E1B3A] dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition active:scale-[0.99] cursor-pointer"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Save & Apply</span>
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
