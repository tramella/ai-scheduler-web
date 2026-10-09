"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  User,
  CheckCircle2,
  Download,
  Copy,
  Check,
  Database,
  Code2,
  Table as TableIcon,
  LayoutGrid,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileSpreadsheet,
  Layers,
  Filter,
  Share2,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Search,
  X,
  CalendarDays,
  ChevronsLeft,
  ChevronsRight,
  Sun,
  Sunset,
  Moon,
} from "lucide-react";
import CustomDatePicker from "@/components/scheduling/CustomDatePicker";

// Realistic Multi-Day Demo Dataset
const INITIAL_DEMO_DATA = {
  meta: {
    range_start: "2026-10-05",
    range_end: "2026-10-09",
    generated_at: "2026-10-06T00:25:00Z",
    ai_engine: "Google Gemini 2.5 Flash",
    rule_validator: "ORBIT Deterministic Constraint Engine v2.0",
    compliance_score: "100%",
  },
  schedules: [
    {
      date: "2026-10-05",
      day_of_week: "Monday",
      locations: [
        {
          id: "LOC_01",
          code: "HCM_D1",
          name: "Flagship Store (District 1)",
          shifts: [
            {
              id: "SHIFT_MORNING",
              name: "Morning Shift (Opening)",
              start: "07:00",
              end: "15:00",
              employees: [
                { id: "NV001", name: "Nguyễn Văn An", role: "Shift Supervisor", skills: ["Supervisor", "Cashier"] },
                { id: "NV002", name: "Trần Thị Bích", role: "Senior Barista", skills: ["Barista", "Opening"] },
                { id: "NV003", name: "Lê Hoàng Cường", role: "Cashier", skills: ["Cashier", "Customer Service"] },
              ],
            },
            {
              id: "SHIFT_AFTERNOON",
              name: "Afternoon Shift (Peak)",
              start: "14:30",
              end: "22:30",
              employees: [
                { id: "NV004", name: "Phạm Minh Đức", role: "Barista", skills: ["Barista", "Inventory"] },
                { id: "NV005", name: "Hoàng Mai Hương", role: "Cashier", skills: ["Cashier", "POS"] },
                { id: "NV006", name: "Đỗ Gia Huy", role: "Kitchen Assistant", skills: ["Kitchen", "Prep"] },
              ],
            },
            {
              id: "SHIFT_NIGHT",
              name: "Night Shift (Closing)",
              start: "22:00",
              end: "06:00",
              employees: [
                { id: "NV007", name: "Vũ Tuấn Kiệt", role: "Security & Closing Lead", skills: ["Supervisor", "Security"] },
                { id: "NV008", name: "Bùi Ngọc Linh", role: "Maintenance / Stock", skills: ["Inventory", "Closing"] },
              ],
            },
          ],
        },
      ],
    },
    {
      date: "2026-10-06",
      day_of_week: "Tuesday",
      locations: [
        {
          id: "LOC_01",
          code: "HCM_D1",
          name: "Flagship Store (District 1)",
          shifts: [
            {
              id: "SHIFT_MORNING",
              name: "Morning Shift (Opening)",
              start: "07:00",
              end: "15:00",
              employees: [
                { id: "NV004", name: "Phạm Minh Đức", role: "Barista", skills: ["Barista"] },
                { id: "NV005", name: "Hoàng Mai Hương", role: "Cashier", skills: ["Cashier"] },
                { id: "NV009", name: "Lý Khánh Nam", role: "Store Lead", skills: ["Supervisor"] },
              ],
            },
            {
              id: "SHIFT_AFTERNOON",
              name: "Afternoon Shift (Peak)",
              start: "14:30",
              end: "22:30",
              employees: [
                { id: "NV001", name: "Nguyễn Văn An", role: "Shift Supervisor", skills: ["Supervisor"] },
                { id: "NV006", name: "Đỗ Gia Huy", role: "Kitchen Assistant", skills: ["Kitchen"] },
                { id: "NV010", name: "Trịnh Thảo Nhi", role: "All-Round Staff", skills: ["Barista"] },
              ],
            },
            {
              id: "SHIFT_NIGHT",
              name: "Night Shift (Closing)",
              start: "22:00",
              end: "06:00",
              employees: [
                { id: "NV007", name: "Vũ Tuấn Kiệt", role: "Security & Closing Lead", skills: ["Security"] },
                { id: "NV008", name: "Bùi Ngọc Linh", role: "Maintenance / Stock", skills: ["Inventory"] },
              ],
            },
          ],
        },
      ],
    },
    {
      date: "2026-10-07",
      day_of_week: "Wednesday",
      locations: [
        {
          id: "LOC_01",
          code: "HCM_D1",
          name: "Flagship Store (District 1)",
          shifts: [
            {
              id: "SHIFT_MORNING",
              name: "Morning Shift (Opening)",
              start: "07:00",
              end: "15:00",
              employees: [
                { id: "NV001", name: "Nguyễn Văn An", role: "Shift Supervisor", skills: ["Supervisor"] },
                { id: "NV002", name: "Trần Thị Bích", role: "Senior Barista", skills: ["Barista"] },
                { id: "NV010", name: "Trịnh Thảo Nhi", role: "All-Round Staff", skills: ["Barista"] },
              ],
            },
            {
              id: "SHIFT_AFTERNOON",
              name: "Afternoon Shift (Peak)",
              start: "14:30",
              end: "22:30",
              employees: [
                { id: "NV003", name: "Lê Hoàng Cường", role: "Cashier", skills: ["Cashier"] },
                { id: "NV004", name: "Phạm Minh Đức", role: "Barista", skills: ["Barista"] },
                { id: "NV005", name: "Hoàng Mai Hương", role: "Cashier", skills: ["Cashier"] },
              ],
            },
          ],
        },
      ],
    },
    {
      date: "2026-10-08",
      day_of_week: "Thursday",
      locations: [
        {
          id: "LOC_01",
          code: "HCM_D1",
          name: "Flagship Store (District 1)",
          shifts: [
            {
              id: "SHIFT_MORNING",
              name: "Morning Shift (Opening)",
              start: "07:00",
              end: "15:00",
              employees: [
                { id: "NV009", name: "Lý Khánh Nam", role: "Store Lead", skills: ["Supervisor"] },
                { id: "NV003", name: "Lê Hoàng Cường", role: "Cashier", skills: ["Cashier"] },
                { id: "NV006", name: "Đỗ Gia Huy", role: "Kitchen Assistant", skills: ["Kitchen"] },
              ],
            },
            {
              id: "SHIFT_AFTERNOON",
              name: "Afternoon Shift (Peak)",
              start: "14:30",
              end: "22:30",
              employees: [
                { id: "NV002", name: "Trần Thị Bích", role: "Senior Barista", skills: ["Barista"] },
                { id: "NV008", name: "Bùi Ngọc Linh", role: "Maintenance / Stock", skills: ["Inventory"] },
                { id: "NV010", name: "Trịnh Thảo Nhi", role: "All-Round Staff", skills: ["Barista"] },
              ],
            },
          ],
        },
      ],
    },
    {
      date: "2026-10-09",
      day_of_week: "Friday",
      locations: [
        {
          id: "LOC_01",
          code: "HCM_D1",
          name: "Flagship Store (District 1)",
          shifts: [
            {
              id: "SHIFT_MORNING",
              name: "Morning Shift (Opening)",
              start: "07:00",
              end: "15:00",
              employees: [
                { id: "NV001", name: "Nguyễn Văn An", role: "Shift Supervisor", skills: ["Supervisor"] },
                { id: "NV004", name: "Phạm Minh Đức", role: "Barista", skills: ["Barista"] },
                { id: "NV005", name: "Hoàng Mai Hương", role: "Cashier", skills: ["Cashier"] },
              ],
            },
            {
              id: "SHIFT_AFTERNOON",
              name: "Afternoon Shift (Peak)",
              start: "14:30",
              end: "22:30",
              employees: [
                { id: "NV002", name: "Trần Thị Bích", role: "Senior Barista", skills: ["Barista"] },
                { id: "NV007", name: "Vũ Tuấn Kiệt", role: "Security Lead", skills: ["Security"] },
                { id: "NV009", name: "Lý Khánh Nam", role: "Store Lead", skills: ["Supervisor"] },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const EMPLOYEES_MASTER = [
  { id: "NV001", name: "Nguyễn Văn An", role: "Shift Supervisor", shiftCount: 4, totalHours: 32 },
  { id: "NV002", name: "Trần Thị Bích", role: "Senior Barista", shiftCount: 4, totalHours: 32 },
  { id: "NV003", name: "Lê Hoàng Cường", role: "Cashier", shiftCount: 3, totalHours: 24 },
  { id: "NV004", name: "Phạm Minh Đức", role: "Barista", shiftCount: 4, totalHours: 32 },
  { id: "NV005", name: "Hoàng Mai Hương", role: "Cashier", shiftCount: 4, totalHours: 32 },
  { id: "NV006", name: "Đỗ Gia Huy", role: "Kitchen Assistant", shiftCount: 3, totalHours: 24 },
  { id: "NV007", name: "Vũ Tuấn Kiệt", role: "Security & Closing Lead", shiftCount: 3, totalHours: 24 },
  { id: "NV008", name: "Bùi Ngọc Linh", role: "Maintenance / Stock", shiftCount: 3, totalHours: 24 },
  { id: "NV009", name: "Lý Khánh Nam", role: "Store Lead", shiftCount: 3, totalHours: 24 },
  { id: "NV010", name: "Trịnh Thảo Nhi", role: "All-Round Staff", shiftCount: 3, totalHours: 24 },
];

function parseLocalDate(dateStr: string): Date {
  if (!dateStr) return new Date();
  const parts = dateStr.split("-").map(Number);
  if (parts.length === 3) {
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }
  return new Date(dateStr);
}

function formatDateToYYYYMMDD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function ensureSchedulesForRange(
  baseSchedules: any[],
  rangeDates: string[]
): any[] {
  const existingMap = new Map<string, any>();
  baseSchedules.forEach((s) => existingMap.set(s.date, s));

  const patterns = [
    {
      morning: ["NV001", "NV002", "NV003"],
      afternoon: ["NV004", "NV005", "NV006"],
      night: ["NV007", "NV008"],
    },
    {
      morning: ["NV009", "NV004", "NV005"],
      afternoon: ["NV001", "NV006", "NV010"],
      night: ["NV007", "NV008"],
    },
    {
      morning: ["NV001", "NV002", "NV010"],
      afternoon: ["NV003", "NV004", "NV005"],
      night: ["NV007", "NV009"],
    },
    {
      morning: ["NV009", "NV003", "NV006"],
      afternoon: ["NV002", "NV005", "NV010"],
      night: ["NV001", "NV008"],
    },
    {
      morning: ["NV001", "NV004", "NV005"],
      afternoon: ["NV002", "NV007", "NV009"],
      night: ["NV006", "NV008"],
    },
  ];

  const empMap = new Map(EMPLOYEES_MASTER.map((e) => [e.id, e]));
  const result: any[] = [];

  rangeDates.forEach((dateStr, idx) => {
    if (existingMap.has(dateStr)) {
      result.push(existingMap.get(dateStr));
      return;
    }

    const d = parseLocalDate(dateStr);
    const dayOfWeek = d.toLocaleDateString("en-US", { weekday: "long" });
    const p = patterns[Math.abs(d.getDate() + idx) % patterns.length];

    const morningEmps = p.morning.map((id) => empMap.get(id)!).filter(Boolean);
    const afternoonEmps = p.afternoon.map((id) => empMap.get(id)!).filter(Boolean);
    const nightEmps = p.night.map((id) => empMap.get(id)!).filter(Boolean);

    result.push({
      date: dateStr,
      day_of_week: dayOfWeek,
      locations: [
        {
          id: "LOC_01",
          code: "HCM_D1",
          name: "Flagship Store (District 1)",
          shifts: [
            {
              id: "SHIFT_MORNING",
              name: "Morning Shift (Opening)",
              start: "07:00",
              end: "15:00",
              employees: morningEmps.map((e) => ({
                id: e.id,
                name: e.name,
                role: e.role,
              })),
            },
            {
              id: "SHIFT_AFTERNOON",
              name: "Afternoon Shift (Peak)",
              start: "14:30",
              end: "22:30",
              employees: afternoonEmps.map((e) => ({
                id: e.id,
                name: e.name,
                role: e.role,
              })),
            },
            {
              id: "SHIFT_NIGHT",
              name: "Night Shift (Closing)",
              start: "22:00",
              end: "06:00",
              employees: nightEmps.map((e) => ({
                id: e.id,
                name: e.name,
                role: e.role,
              })),
            },
          ],
        },
      ],
    });
  });

  return result;
}

export default function DemoScheduleReviewPage() {
  const [data, setData] = useState(INITIAL_DEMO_DATA);
  const [activeTab, setActiveTab] = useState<"calendar" | "schema" | "json">("calendar");
  const [calendarView, setCalendarView] = useState<"week" | "day" | "month">("week");

  // Single Date Picker & Range States
  const [startDate, setStartDate] = useState("2026-10-05");
  const [endDate, setEndDate] = useState("2026-10-09");
  const [singleDate, setSingleDate] = useState("2026-10-05");

  // Search, Role & Pagination states
  const [searchEmployee, setSearchEmployee] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Modals
  const [isAddShiftOpen, setIsAddShiftOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [newEmpId, setNewEmpId] = useState("");
  const [newDate, setNewDate] = useState("2026-10-05");
  const [newShift, setNewShift] = useState("SHIFT_MORNING");

  const dates = useMemo(() => data.schedules.map((s) => s.date), [data]);

  // Active Timeline Dates (Dynamic Range)
  const activeTimelineDates = useMemo(() => {
    if (calendarView === "day") {
      return [singleDate];
    }
    try {
      const result: string[] = [];
      const current = parseLocalDate(startDate);
      const end = parseLocalDate(endDate);
      let count = 0;
      while (current <= end && count < 31) {
        result.push(formatDateToYYYYMMDD(current));
        current.setDate(current.getDate() + 1);
        count++;
      }
      return result.length > 0 ? result : dates;
    } catch {
      return dates;
    }
  }, [calendarView, singleDate, startDate, endDate, dates]);

  // Effective schedules for selected range
  const effectiveSchedules = useMemo(() => {
    return ensureSchedulesForRange(data.schedules, activeTimelineDates);
  }, [data.schedules, activeTimelineDates]);

  // Roles list
  const rolesList = useMemo(() => {
    const set = new Set<string>();
    EMPLOYEES_MASTER.forEach((e) => set.add(e.role));
    return ["all", ...Array.from(set)];
  }, []);

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    return EMPLOYEES_MASTER.filter((emp) => {
      const matchSearch =
        emp.name.toLowerCase().includes(searchEmployee.toLowerCase()) ||
        emp.id.toLowerCase().includes(searchEmployee.toLowerCase());
      const matchRole =
        selectedRole === "all" || emp.role.toLowerCase() === selectedRole.toLowerCase();
      return matchSearch && matchRole;
    });
  }, [searchEmployee, selectedRole]);

  // Paginated employees
  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / pageSize));
  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredEmployees.slice(start, start + pageSize);
  }, [filteredEmployees, currentPage, pageSize]);

  // Shift Lookup map by `${empId}_${date}`
  const shiftLookup = useMemo(() => {
    const map: Record<string, any[]> = {};
    effectiveSchedules.forEach((day) => {
      day.locations.forEach((loc: any) => {
        loc.shifts.forEach((shift: any) => {
          shift.employees.forEach((emp: any) => {
            const key = `${emp.id}_${day.date}`;
            if (!map[key]) map[key] = [];
            map[key].push({
              shiftName: shift.name,
              start: shift.start,
              end: shift.end,
              location: loc.name,
            });
          });
        });
      });
    });
    return map;
  }, [effectiveSchedules]);

  // Month grid map
  const dailySummaryMap = useMemo(() => {
    const map: Record<string, { shifts: any[]; totalStaff: number }> = {};
    effectiveSchedules.forEach((day) => {
      let count = 0;
      const shiftsArr: any[] = [];
      day.locations.forEach((loc: any) => {
        loc.shifts.forEach((s: any) => {
          count += s.employees.length;
          shiftsArr.push({
            name: s.name,
            staffCount: s.employees.length,
          });
        });
      });
      map[day.date] = { shifts: shiftsArr, totalStaff: count };
    });
    return map;
  }, [effectiveSchedules]);

  // October 2026 Calendar Month Grid
  const monthCalendarGrid = useMemo(() => {
    const days: ({ dayNum: number; dateStr: string; isCurrentMonth: boolean })[] = [];
    for (let i = 0; i < 3; i++) {
      days.push({ dayNum: 0, dateStr: "", isCurrentMonth: false });
    }
    for (let d = 1; d <= 31; d++) {
      const dayStr = String(d).padStart(2, "0");
      days.push({ dayNum: d, dateStr: `2026-10-${dayStr}`, isCurrentMonth: true });
    }
    return days;
  }, []);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleAddShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpId || !newDate) return;
    const emp = EMPLOYEES_MASTER.find((e) => e.id === newEmpId);
    if (!emp) return;

    const updated = JSON.parse(JSON.stringify(data));
    let dayTarget = updated.schedules.find((s: any) => s.date === newDate);
    if (!dayTarget) {
      dayTarget = {
        date: newDate,
        day_of_week: "Custom Day",
        locations: [
          {
            id: "LOC_01",
            code: "HCM_D1",
            name: "Flagship Store (District 1)",
            shifts: [],
          },
        ],
      };
      updated.schedules.push(dayTarget);
    }

    let loc = dayTarget.locations[0];
    let sTarget = loc.shifts.find((s: any) => s.id === newShift);
    if (!sTarget) {
      sTarget = {
        id: newShift,
        name: newShift === "SHIFT_MORNING" ? "Morning Shift" : "Afternoon Shift",
        start: newShift === "SHIFT_MORNING" ? "07:00" : "14:30",
        end: newShift === "SHIFT_MORNING" ? "15:00" : "22:30",
        employees: [],
      };
      loc.shifts.push(sTarget);
    }

    if (!sTarget.employees.some((e: any) => e.id === newEmpId)) {
      sTarget.employees.push({ id: emp.id, name: emp.name, role: emp.role });
    }

    setData(updated);
    setIsAddShiftOpen(false);
  };

  const getShiftBadgeTheme = (shiftName: string) => {
    const s = shiftName.toLowerCase();
    if (s.includes("morning") || s.includes("sáng") || s.includes("opening")) {
      return {
        hex: "#F59E0B",
        bg: "bg-amber-500/10 border-amber-500/30 text-amber-950",
        borderLeft: "border-l-4 border-l-[#F59E0B]",
        icon: Sun,
        iconColor: "text-[#D97706]",
      };
    }
    if (s.includes("afternoon") || s.includes("chiều") || s.includes("peak")) {
      return {
        hex: "#FF5A36",
        bg: "bg-[#FF5A36]/10 border-[#FF5A36]/35 text-[#7C1C07]",
        borderLeft: "border-l-4 border-l-[#FF5A36]",
        icon: Sunset,
        iconColor: "text-[#FF5A36]",
      };
    }
    if (s.includes("night") || s.includes("đêm") || s.includes("closing")) {
      return {
        hex: "#6366F1",
        bg: "bg-indigo-500/10 border-indigo-500/30 text-indigo-950",
        borderLeft: "border-l-4 border-l-[#6366F1]",
        icon: Moon,
        iconColor: "text-[#6366F1]",
      };
    }
    return {
      hex: "#10B981",
      bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-950",
      borderLeft: "border-l-4 border-l-[#10B981]",
      icon: Clock,
      iconColor: "text-[#10B981]",
    };
  };

  return (
    <main className="flex-1 py-8 sm:py-16 bg-linear-to-b from-white via-zinc-50/40 to-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-zinc-200">
          <div>
            <div className="inline-flex items-center space-x-2 rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-800 mb-2 border border-zinc-200/80">
              <Sparkles className="h-3.5 w-3.5 text-[#FF5A36]" />
              <span>Modern Calendar & Resource Matrix</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#0B0F1A]">
              Workforce Roster Calendar
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-zinc-500">
              Paginated employee profiles • Interactive adaptive date picker • Month overview grid
            </p>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-2.5 w-full md:w-auto">
            <button
              type="button"
              onClick={() => setIsAddShiftOpen(true)}
              className="inline-flex items-center justify-center space-x-1.5 rounded-xl border border-zinc-200 bg-white px-3 sm:px-3.5 py-2 sm:py-2.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-50 shadow-2xs transition"
            >
              <Plus className="h-3.5 w-3.5 text-[#FF5A36] shrink-0" />
              <span>Add Shift</span>
            </button>

            <button
              type="button"
              onClick={() => setIsShareOpen(true)}
              className="inline-flex items-center justify-center space-x-1.5 rounded-xl border border-zinc-200 bg-white px-3 sm:px-3.5 py-2 sm:py-2.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-50 shadow-2xs transition"
            >
              <Share2 className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
              <span>Share</span>
            </button>

            <button
              type="button"
              onClick={() => handleCopy(JSON.stringify(data, null, 2), "export-json")}
              className="col-span-2 sm:col-span-1 inline-flex items-center justify-center space-x-1.5 rounded-xl bg-[#0B0F1A] px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs font-semibold text-white hover:bg-zinc-800 shadow-xs transition border border-zinc-800"
            >
              <Download className="h-3.5 w-3.5 text-[#FF5A36] shrink-0" />
              <span>Export JSON / Schema</span>
            </button>
          </div>
        </div>

        {/* View Selection & Time Navigation Bar with Custom Date Picker */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 py-1">
          {/* Left: 1 Custom Date Picker Dropdown */}
          <div className="w-full sm:w-auto">
            <CustomDatePicker
              mode={calendarView === "day" ? "day" : calendarView === "month" ? "month" : "week"}
              startDate={startDate}
              endDate={endDate}
              singleDate={singleDate}
              onDateChange={({ singleDate: sD, startDate: st, endDate: ed }) => {
                if (sD) setSingleDate(sD);
                if (st) setStartDate(st);
                if (ed) setEndDate(ed);
              }}
            />
          </div>

          {/* Right: View Switcher */}
          <div className="flex items-center space-x-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200 w-full sm:w-auto overflow-x-auto scrollbar-none shrink-0">
            <button
              type="button"
              onClick={() => {
                setActiveTab("calendar");
                setCalendarView("week");
              }}
              className={`flex-1 sm:flex-none text-center whitespace-nowrap rounded-lg px-2.5 sm:px-3.5 py-1.5 text-xs font-bold transition ${
                activeTab === "calendar" && calendarView === "week"
                  ? "bg-white text-zinc-900 shadow-xs"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              Week
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("calendar");
                setCalendarView("day");
              }}
              className={`flex-1 sm:flex-none text-center whitespace-nowrap rounded-lg px-2.5 sm:px-3.5 py-1.5 text-xs font-bold transition ${
                activeTab === "calendar" && calendarView === "day"
                  ? "bg-white text-zinc-900 shadow-xs"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              Day
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("calendar");
                setCalendarView("month");
              }}
              className={`flex-1 sm:flex-none text-center whitespace-nowrap rounded-lg px-2.5 sm:px-3.5 py-1.5 text-xs font-bold transition ${
                activeTab === "calendar" && calendarView === "month"
                  ? "bg-white text-zinc-900 shadow-xs"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              Month
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("schema")}
              className={`flex-1 sm:flex-none text-center whitespace-nowrap rounded-lg px-2.5 sm:px-3.5 py-1.5 text-xs font-bold transition ${
                activeTab === "schema"
                  ? "bg-white text-zinc-900 shadow-xs"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              Schema
            </button>
          </div>
        </div>

        {/* Search & Role Filter Bar */}
        {activeTab === "calendar" && calendarView !== "month" && (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 py-1">
            <div className="relative w-full md:w-80">
              <Search className="pointer-events-none absolute inset-y-0 left-0 h-4 w-4 my-auto ml-3 text-zinc-400" />
              <input
                type="text"
                value={searchEmployee}
                onChange={(e) => {
                  setSearchEmployee(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search staff name or ID..."
                className="w-full rounded-xl border border-zinc-200 bg-white py-2 pl-9 pr-8 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 shadow-2xs"
              />
              {searchEmployee && (
                <button
                  type="button"
                  onClick={() => setSearchEmployee("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-zinc-400 hover:text-zinc-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none py-1 -mx-2 px-2 sm:mx-0 sm:px-0 w-full md:w-auto">
              {rolesList.map((role) => {
                const isSelected = selectedRole === role;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => {
                      setSelectedRole(role);
                      setCurrentPage(1);
                    }}
                    className={`capitalize whitespace-nowrap rounded-xl px-2.5 sm:px-3 py-1.5 text-xs font-semibold transition shrink-0 ${
                      isSelected
                        ? "bg-[#0B0F1A] text-white shadow-2xs"
                        : "bg-zinc-50 border border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                    }`}
                  >
                    {role === "all" ? "All Roles" : role}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= CALENDAR MATRIX VIEW (WEEK & DAY) ================= */}
        {activeTab === "calendar" && (calendarView === "week" || calendarView === "day") && (
          <div className="space-y-4">
            <div className="rounded-2xl sm:rounded-3xl border border-zinc-200/90 bg-white overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 bg-zinc-50/90 text-xs font-bold uppercase tracking-wider text-zinc-600">
                      <th className="py-3 sm:py-4 px-3 sm:px-5 w-44 sm:w-56 md:w-64 lg:w-72 min-w-[160px] sm:min-w-[220px] md:min-w-[260px] sticky left-0 z-20 bg-zinc-50/95 backdrop-blur-xs border-r border-zinc-200">
                        <div className="flex items-center space-x-1.5 sm:space-x-2">
                          <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#FF5A36] shrink-0" />
                          <span className="truncate text-xs">Staff ({filteredEmployees.length})</span>
                        </div>
                      </th>

                      {activeTimelineDates.map((dStr) => {
                        const d = parseLocalDate(dStr);
                        const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
                        const dateDisplay = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                        return (
                          <th
                            key={dStr}
                            className="py-2.5 sm:py-3.5 px-2.5 sm:px-4 min-w-[140px] sm:min-w-[180px] md:min-w-[210px] border-r border-zinc-100 last:border-r-0 text-center"
                          >
                            <div className="font-extrabold text-xs sm:text-sm text-zinc-900">{dayName}</div>
                            <div className="text-[10px] sm:text-[11px] font-mono text-zinc-400 font-normal mt-0.5">{dateDisplay}</div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-zinc-100">
                    {paginatedEmployees.length > 0 ? (
                      paginatedEmployees.map((emp) => (
                        <tr key={emp.id} className="hover:bg-zinc-50/40 transition-colors">
                          <td className="py-3 sm:py-4 px-2.5 sm:px-4 md:px-5 align-top sticky left-0 z-10 bg-white border-r border-zinc-200 shadow-[2px_0_6px_-2px_rgba(0,0,0,0.04)] w-44 sm:w-56 md:w-64 lg:w-72 min-w-[160px] sm:min-w-[220px] md:min-w-[260px]">
                            <div className="flex items-start space-x-2 sm:space-x-3">
                              <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-[#0B0F1A] text-white font-extrabold text-[10px] sm:text-xs shadow-2xs">
                                {emp.name.charAt(0)}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-bold text-xs sm:text-sm text-zinc-900 truncate">
                                  {emp.name}
                                </p>
                                <div className="flex flex-wrap sm:flex-nowrap items-center gap-1 sm:space-x-1.5 text-[10px] sm:text-[11px] text-zinc-500 mt-0.5">
                                  <span className="font-mono text-[9px] sm:text-[10px] text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded font-semibold shrink-0">
                                    {emp.id}
                                  </span>
                                  <span className="hidden sm:inline">•</span>
                                  <span className="truncate">{emp.role}</span>
                                </div>
                                <div className="mt-1 sm:mt-1.5 flex flex-wrap sm:flex-nowrap items-center gap-1 sm:space-x-2 text-[9px] sm:text-[10px] text-zinc-400">
                                  <span>{emp.shiftCount} shifts</span>
                                  <span className="hidden sm:inline">•</span>
                                  <span>{emp.totalHours} hrs/wk</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {activeTimelineDates.map((dStr) => {
                            const key = `${emp.id}_${dStr}`;
                            const shifts = shiftLookup[key] || [];

                            return (
                              <td key={dStr} className="py-2.5 sm:py-3 px-2 sm:px-3 align-top border-r border-zinc-100 last:border-r-0 min-w-[140px] sm:min-w-[180px] md:min-w-[210px]">
                                {shifts.length > 0 ? (
                                  <div className="space-y-1.5">
                                    {shifts.map((s, sIdx) => {
                                      const theme = getShiftBadgeTheme(s.shiftName);
                                      const IconComponent = theme.icon;

                                      return (
                                        <div
                                          key={sIdx}
                                          className={`rounded-xl sm:rounded-2xl border p-2 sm:p-2.5 shadow-2xs transition hover:shadow-xs ${theme.bg} ${theme.borderLeft}`}
                                        >
                                          <div className="flex items-center justify-between gap-1">
                                            <span className="font-bold text-[11px] sm:text-xs truncate">
                                              {s.shiftName}
                                            </span>
                                            <IconComponent className={`h-3.5 w-3.5 shrink-0 ${theme.iconColor}`} />
                                          </div>
                                          <div className="flex items-center space-x-1 text-[10px] sm:text-[11px] font-mono mt-1 opacity-90">
                                            <Clock className="h-3 w-3 shrink-0" />
                                            <span>{s.start} – {s.end}</span>
                                          </div>
                                          <div className="flex items-center space-x-1 text-[9px] sm:text-[10px] mt-0.5 sm:mt-1 text-zinc-500 truncate">
                                            <MapPin className="h-3 w-3 shrink-0 text-zinc-400" />
                                            <span className="truncate">{s.location}</span>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <div className="h-full min-h-[58px] sm:min-h-[64px] flex items-center justify-center rounded-xl sm:rounded-2xl border border-dashed border-zinc-200/70 bg-zinc-50/20 text-[10px] sm:text-[11px] text-zinc-400">
                                    <span className="opacity-60">Off</span>
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={activeTimelineDates.length + 1} className="py-12 text-center text-xs text-zinc-400">
                          No employees found matching &ldquo;{searchEmployee}&rdquo;.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Shift Color Legend & Pagination Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-2 px-1">
              {/* Left: Shift Color Palette Legend */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-zinc-500 font-medium">
                <div className="flex items-center space-x-1.5 bg-white px-2.5 py-1 rounded-xl border border-zinc-200/80 shadow-2xs">
                  <span className="h-2 sm:h-2.5 w-2 sm:w-2.5 rounded-full bg-[#F59E0B] ring-2 ring-[#F59E0B]/30 shadow-2xs" />
                  <span className="font-semibold text-zinc-800 text-[11px] sm:text-xs">Morning Shift</span>
                  <span className="text-[9px] sm:text-[10px] font-mono text-zinc-400 font-medium hidden xs:inline">07:00–15:00</span>
                </div>
                <div className="flex items-center space-x-1.5 bg-white px-2.5 py-1 rounded-xl border border-zinc-200/80 shadow-2xs">
                  <span className="h-2 sm:h-2.5 w-2 sm:w-2.5 rounded-full bg-[#FF5A36] ring-2 ring-[#FF5A36]/30 shadow-2xs" />
                  <span className="font-semibold text-zinc-800 text-[11px] sm:text-xs">Afternoon Shift</span>
                  <span className="text-[9px] sm:text-[10px] font-mono text-zinc-400 font-medium hidden xs:inline">14:30–22:30</span>
                </div>
                <div className="flex items-center space-x-1.5 bg-white px-2.5 py-1 rounded-xl border border-zinc-200/80 shadow-2xs">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#6366F1] ring-2 ring-[#6366F1]/30 shadow-2xs" />
                  <span className="font-semibold text-zinc-800 text-[11px] sm:text-xs">Night Shift</span>
                  <span className="text-[9px] sm:text-[10px] font-mono text-zinc-400 font-medium hidden xs:inline">22:00–06:00</span>
                </div>
              </div>

              {/* Right: Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center space-x-1 sm:space-x-1.5 self-center sm:self-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 disabled:opacity-30 disabled:pointer-events-none transition shadow-2xs"
                    title="First Page"
                  >
                    <ChevronsLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 disabled:opacity-30 disabled:pointer-events-none transition shadow-2xs"
                    title="Previous Page"
                  >
                    <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>

                  <span className="px-2.5 sm:px-3.5 py-1 text-[11px] sm:text-xs font-bold text-zinc-800 whitespace-nowrap">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    type="button"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage >= totalPages}
                    className="p-1.5 rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 disabled:opacity-30 disabled:pointer-events-none transition shadow-2xs"
                    title="Next Page"
                  >
                    <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage >= totalPages}
                    className="p-1.5 rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 disabled:opacity-30 disabled:pointer-events-none transition shadow-2xs"
                    title="Last Page"
                  >
                    <ChevronsRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= VIEW 3: FULL MONTH VIEW ================= */}
        {activeTab === "calendar" && calendarView === "month" && (
          <div className="rounded-2xl sm:rounded-3xl border border-zinc-200/90 bg-white p-4 sm:p-6 lg:p-7 shadow-xs space-y-3 sm:space-y-4 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-100">
              <div className="flex items-center space-x-2">
                <CalendarDays className="h-4 w-4 sm:h-5 sm:w-5 text-[#FF5A36] shrink-0" />
                <h3 className="font-bold text-base sm:text-lg text-zinc-900">October 2026 Monthly Matrix</h3>
              </div>
              <span className="text-[11px] sm:text-xs text-zinc-500">
                Click any active date to focus Day view
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((dayName) => (
                <div
                  key={dayName}
                  className="text-center py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-zinc-400 bg-zinc-50 rounded-lg sm:rounded-xl truncate"
                >
                  {dayName}
                </div>
              ))}

              {monthCalendarGrid.map((cell, idx) => {
                const summary = cell.dateStr ? dailySummaryMap[cell.dateStr] : null;
                const hasShifts = summary && summary.shifts.length > 0;

                if (!cell.isCurrentMonth) {
                  return (
                    <div
                      key={idx}
                      className="min-h-[70px] sm:min-h-[95px] md:min-h-[110px] rounded-xl sm:rounded-2xl border border-dashed border-zinc-100 bg-zinc-50/30 p-1 sm:p-2"
                    />
                  );
                }

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (hasShifts) {
                        setSingleDate(cell.dateStr);
                        setCalendarView("day");
                      }
                    }}
                    className={`min-h-[70px] sm:min-h-[95px] md:min-h-[110px] rounded-xl sm:rounded-2xl border p-1.5 sm:p-2 flex flex-col justify-between transition ${
                      hasShifts
                        ? "border-zinc-200 bg-white hover:border-[#FF5A36]/60 hover:shadow-sm cursor-pointer"
                        : "border-zinc-100 bg-zinc-50/40 text-zinc-400"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className={`h-5 w-5 sm:h-6 sm:w-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold shrink-0 ${
                          hasShifts ? "bg-[#0B0F1A] text-white" : "text-zinc-500"
                        }`}
                      >
                        {cell.dayNum}
                      </span>
                      {hasShifts && (
                        <span className="text-[9px] sm:text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1 sm:px-1.5 py-0.5 rounded truncate">
                          {summary.totalStaff} staff
                        </span>
                      )}
                    </div>

                    {hasShifts ? (
                      <div className="space-y-0.5 sm:space-y-1 my-0.5 sm:my-1 overflow-hidden">
                        {summary.shifts.slice(0, 2).map((s, sIdx) => {
                          const theme = getShiftBadgeTheme(s.name);
                          return (
                            <div
                              key={sIdx}
                              className={`text-[9px] sm:text-[10px] truncate px-1 sm:px-1.5 py-0.5 rounded-md font-medium border ${theme.bg}`}
                            >
                              {s.name.split(" ")[0]} ({s.staffCount})
                            </div>
                          );
                        })}
                        {summary.shifts.length > 2 && (
                          <span className="text-[8px] sm:text-[9px] text-zinc-400 font-medium pl-0.5 sm:pl-1 block truncate">
                            +{summary.shifts.length - 2} more
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-[9px] sm:text-[10px] text-zinc-300 italic">No shifts</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= DATABASE SCHEMA TAB ================= */}
        {activeTab === "schema" && (
          <div className="rounded-2xl sm:rounded-3xl border border-zinc-200/90 bg-white p-4 sm:p-6 lg:p-7 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="font-bold text-sm sm:text-base text-zinc-900 flex items-center space-x-2">
                <Database className="h-4 w-4 text-[#FF5A36] shrink-0" />
                <span>Prisma ORM & SQL DDL</span>
              </h3>
              <button
                type="button"
                onClick={() => handleCopy(JSON.stringify(data, null, 2), "schema-json")}
                className="inline-flex items-center space-x-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 self-start sm:self-auto"
              >
                {copiedType === "schema-json" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span>Copy Data JSON</span>
              </button>
            </div>
            <div className="rounded-2xl bg-[#09090B] p-4 sm:p-5 overflow-x-auto text-xs font-mono text-zinc-200">
              <pre>{`-- SQL Shift Assignment Table Schema
CREATE TABLE IF NOT EXISTS shift_assignments (
  id SERIAL PRIMARY KEY,
  schedule_date DATE NOT NULL,
  location_id VARCHAR(50) NOT NULL,
  shift_id VARCHAR(50) NOT NULL,
  employee_id VARCHAR(50) NOT NULL,
  CONSTRAINT unique_daily_emp UNIQUE(schedule_date, employee_id)
);`}</pre>
            </div>
          </div>
        )}

        {/* Modal: Add Shift */}
        {isAddShiftOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-950/40 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-2xl sm:rounded-3xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm sm:text-base text-zinc-900">Add Shift Assignment</h3>
                <button type="button" onClick={() => setIsAddShiftOpen(false)} className="p-1 text-zinc-400 hover:text-zinc-700">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <form onSubmit={handleAddShift} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">Employee</label>
                  <select
                    required
                    value={newEmpId}
                    onChange={(e) => setNewEmpId(e.target.value)}
                    className="block w-full rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 text-xs text-zinc-900"
                  >
                    <option value="">-- Choose Employee --</option>
                    {EMPLOYEES_MASTER.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name} ({e.id})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="block w-full rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 text-xs text-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">Shift</label>
                  <select
                    value={newShift}
                    onChange={(e) => setNewShift(e.target.value)}
                    className="block w-full rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 text-xs text-zinc-900"
                  >
                    <option value="SHIFT_MORNING">Morning Shift (07:00 – 15:00)</option>
                    <option value="SHIFT_AFTERNOON">Afternoon Shift (14:30 – 22:30)</option>
                    <option value="SHIFT_NIGHT">Night Shift (22:00 – 06:00)</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddShiftOpen(false)}
                    className="px-3.5 sm:px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-50 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-[#0B0F1A] px-3.5 sm:px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 transition"
                  >
                    Add to Calendar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Share */}
        {isShareOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-950/40 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-2xl sm:rounded-3xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm sm:text-base text-zinc-900">Share Schedule</h3>
                <button type="button" onClick={() => setIsShareOpen(false)} className="p-1 text-zinc-400 hover:text-zinc-700">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-zinc-500">Copy link to share this interactive roster matrix with your team:</p>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  readOnly
                  value={typeof window !== "undefined" ? window.location.href : ""}
                  className="flex-1 min-w-0 rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 text-xs font-mono truncate"
                />
                <button
                  type="button"
                  onClick={() => handleCopy(window.location.href, "share-link")}
                  className="rounded-xl bg-[#0B0F1A] px-3 sm:px-3.5 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800 transition shrink-0"
                >
                  {copiedType === "share-link" ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}

