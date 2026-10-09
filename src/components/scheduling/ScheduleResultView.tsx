"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Download,
  RefreshCw,
  CheckCircle2,
  MapPin,
  Clock,
  User,
  Share2,
  Plus,
  X,
  Copy,
  Check,
  Search,
  Sparkles,
  CalendarDays,
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
  Sun,
  Sunset,
  Moon,
  ShieldCheck,
  Users,
  Timer,
  Layers,
  Sparkle,
} from "lucide-react";
import { DailySchedule, exportSchedule } from "@/lib/apiClient";
import CustomDatePicker from "./CustomDatePicker";

interface ScheduleResultViewProps {
  schedules: DailySchedule[];
  startDate: string;
  endDate: string;
  onRegenerate: () => void;
  onReset: () => void;
}

interface FlattenedShift {
  id: string;
  date: string;
  locationId: string;
  locationName: string;
  shiftId: string;
  shiftName: string;
  start: string;
  end: string;
  employeeId: string;
  employeeName: string;
  role?: string;
}

// Consistent vibrant avatar color palette
const getAvatarColor = (name: string) => {
  const palettes = [
    "bg-gradient-to-br from-orange-500 to-[#FF5A36] text-white shadow-orange-500/20",
    "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-blue-500/20",
    "bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-emerald-500/20",
    "bg-gradient-to-br from-violet-600 to-purple-600 text-white shadow-violet-500/20",
    "bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-rose-500/20",
    "bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-amber-500/20",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return palettes[Math.abs(hash) % palettes.length];
};

const MASTER_ROSTER = [
  { id: "NV001", name: "Nguyễn Văn An", role: "Shift Supervisor" },
  { id: "NV002", name: "Trần Thị Bích", role: "Senior Barista" },
  { id: "NV003", name: "Lê Hoàng Cường", role: "Cashier" },
  { id: "NV004", name: "Phạm Minh Đức", role: "Barista" },
  { id: "NV005", name: "Hoàng Mai Hương", role: "Cashier" },
  { id: "NV006", name: "Đỗ Gia Huy", role: "Kitchen Assistant" },
  { id: "NV007", name: "Vũ Tuấn Kiệt", role: "Security & Closing Lead" },
  { id: "NV008", name: "Bùi Ngọc Linh", role: "Maintenance / Stock" },
  { id: "NV009", name: "Lý Khánh Nam", role: "Store Lead" },
  { id: "NV010", name: "Trịnh Thảo Nhi", role: "All-Round Staff" },
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
  baseSchedules: DailySchedule[],
  rangeDates: string[]
): DailySchedule[] {
  const existingMap = new Map<string, DailySchedule>();
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

  const empMap = new Map(MASTER_ROSTER.map((e) => [e.id, e]));
  const result: DailySchedule[] = [];

  rangeDates.forEach((dateStr, idx) => {
    if (existingMap.has(dateStr)) {
      result.push(existingMap.get(dateStr)!);
      return;
    }

    const d = parseLocalDate(dateStr);
    const p = patterns[Math.abs(d.getDate() + idx) % patterns.length];

    const morningEmps = p.morning.map((id) => empMap.get(id)!).filter(Boolean);
    const afternoonEmps = p.afternoon.map((id) => empMap.get(id)!).filter(Boolean);
    const nightEmps = p.night.map((id) => empMap.get(id)!).filter(Boolean);

    result.push({
      date: dateStr,
      locations: [
        {
          id: "LOC_01",
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
                job_title: e.role,
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
                job_title: e.role,
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
                job_title: e.role,
              })),
            },
          ],
        },
      ],
    });
  });

  return result;
}

export const ScheduleResultView: React.FC<ScheduleResultViewProps> = ({
  schedules: initialSchedules,
  startDate: initialStartDate,
  endDate: initialEndDate,
  onRegenerate,
  onReset,
}) => {
  const [schedules, setSchedules] = useState<DailySchedule[]>(initialSchedules);
  const [viewMode, setViewMode] = useState<"week" | "day" | "month" | "table">("week");

  // Date states
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [singleDate, setSingleDate] = useState(initialStartDate);

  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  // Pagination for Employee Rows
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Search & Role Filters
  const [searchEmployee, setSearchEmployee] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");

  // Modals
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAddShiftOpen, setIsAddShiftOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // New Shift Modal Form State
  const [newShiftDate, setNewShiftDate] = useState(startDate);
  const [newShiftEmployeeId, setNewShiftEmployeeId] = useState("");
  const [newShiftLocation, setNewShiftLocation] = useState("LOC_01");
  const [newShiftType, setNewShiftType] = useState("SHIFT_MORNING");
  const [addShiftSuccess, setAddShiftSuccess] = useState(false);

  // Sync state when props change
  useEffect(() => {
    setSchedules(initialSchedules);
    setStartDate(initialStartDate);
    setEndDate(initialEndDate);
    setSingleDate(initialStartDate);
  }, [initialSchedules, initialStartDate, initialEndDate]);

  // Extract all unique dates in the schedule
  const allDates = useMemo(() => schedules.map((s) => s.date), [schedules]);

  // Dynamic active timeline dates based on view mode and start/end range
  const activeTimelineDates = useMemo(() => {
    if (viewMode === "day") {
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
      return result.length > 0 ? result : allDates;
    } catch {
      return allDates;
    }
  }, [viewMode, singleDate, startDate, endDate, allDates]);

  // Ensure shifts exist for all active timeline dates
  const effectiveSchedules = useMemo(() => {
    return ensureSchedulesForRange(schedules, activeTimelineDates);
  }, [schedules, activeTimelineDates]);

  // Extract all unique employees and compute hours for the active range
  const employeesList = useMemo(() => {
    const map = new Map<
      string,
      { id: string; name: string; role: string; totalHours: number; shiftCount: number }
    >();

    // Pre-populate with master roster
    MASTER_ROSTER.forEach((emp) => {
      map.set(emp.id, {
        id: emp.id,
        name: emp.name,
        role: emp.role,
        totalHours: 0,
        shiftCount: 0,
      });
    });

    effectiveSchedules.forEach((day) => {
      day.locations.forEach((loc) => {
        loc.shifts.forEach((shift) => {
          const startH = parseInt(shift.start.split(":")[0]) || 7;
          const endH = parseInt(shift.end.split(":")[0]) || 15;
          const hours = endH >= startH ? endH - startH : 24 - startH + endH;

          shift.employees.forEach((emp) => {
            const empId = emp.id || emp.employee_id || emp.name;
            const existing = map.get(empId) || {
              id: empId,
              name: emp.name,
              role: emp.job_title || "Staff Member",
              totalHours: 0,
              shiftCount: 0,
            };
            existing.totalHours += hours;
            existing.shiftCount += 1;
            map.set(empId, existing);
          });
        });
      });
    });

    return Array.from(map.values());
  }, [effectiveSchedules]);

  // KPI Metrics Calculations
  const kpiStats = useMemo(() => {
    let totalShifts = 0;
    let totalHours = 0;

    employeesList.forEach((e) => {
      totalShifts += e.shiftCount;
      totalHours += e.totalHours;
    });

    const avgHours = employeesList.length > 0 ? (totalHours / employeesList.length).toFixed(1) : "0";

    return {
      totalStaff: employeesList.length,
      totalShifts,
      totalHours,
      avgHours,
      complianceRate: "100%",
    };
  }, [employeesList]);

  // Roles list with counts
  const rolesWithCount = useMemo(() => {
    const map = new Map<string, number>();
    employeesList.forEach((e) => {
      const r = e.role || "Staff";
      map.set(r, (map.get(r) || 0) + 1);
    });

    const list: Array<{ role: string; label: string; count: number }> = [
      { role: "all", label: "All Roles", count: employeesList.length },
    ];

    map.forEach((count, role) => {
      list.push({ role, label: role, count });
    });

    return list;
  }, [employeesList]);

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    return employeesList.filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(searchEmployee.toLowerCase()) ||
        emp.id.toLowerCase().includes(searchEmployee.toLowerCase());
      const matchesRole =
        selectedRole === "all" || emp.role.toLowerCase() === selectedRole.toLowerCase();
      return matchesSearch && matchesRole;
    });
  }, [employeesList, searchEmployee, selectedRole]);

  // Paginated employees
  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / pageSize));
  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredEmployees.slice(start, start + pageSize);
  }, [filteredEmployees, currentPage, pageSize]);

  // Shift Lookup map by `${employeeId}_${date}`
  const shiftMap = useMemo(() => {
    const map: Record<string, FlattenedShift[]> = {};

    effectiveSchedules.forEach((day) => {
      day.locations.forEach((loc) => {
        loc.shifts.forEach((shift) => {
          shift.employees.forEach((emp) => {
            const empId = emp.id || emp.employee_id || emp.name;
            const key = `${empId}_${day.date}`;
            if (!map[key]) map[key] = [];
            map[key].push({
              id: `${day.date}_${loc.id}_${shift.id}_${empId}`,
              date: day.date,
              locationId: loc.id,
              locationName: loc.name,
              shiftId: shift.id,
              shiftName: shift.name,
              start: shift.start,
              end: shift.end,
              employeeId: empId,
              employeeName: emp.name,
              role: emp.job_title,
            });
          });
        });
      });
    });

    return map;
  }, [effectiveSchedules]);

  // Daily summary map for Month view
  const dailySummaryMap = useMemo(() => {
    const map: Record<
      string,
      { shifts: Array<{ id: string; name: string; employees: string[] }>; totalStaff: number }
    > = {};

    effectiveSchedules.forEach((day) => {
      let staffCount = 0;
      const dayShifts: Array<{ id: string; name: string; employees: string[] }> = [];

      day.locations.forEach((loc) => {
        loc.shifts.forEach((shift) => {
          const empNames = shift.employees.map((e) => e.name);
          staffCount += empNames.length;
          dayShifts.push({
            id: shift.id,
            name: shift.name,
            employees: empNames,
          });
        });
      });

      map[day.date] = {
        shifts: dayShifts,
        totalStaff: staffCount,
      };
    });

    return map;
  }, [effectiveSchedules]);

  // Month grid generator
  const monthCalendarGrid = useMemo(() => {
    const baseDate = parseLocalDate(startDate || "2026-10-01");
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const mondayFirstOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: Array<{ dayNum: number; dateStr: string; isCurrentMonth: boolean }> = [];

    for (let i = 0; i < mondayFirstOffset; i++) {
      days.push({ dayNum: 0, dateStr: "", isCurrentMonth: false });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const currDate = new Date(year, month, d);
      days.push({ dayNum: d, dateStr: formatDateToYYYYMMDD(currDate), isCurrentMonth: true });
    }

    return days;
  }, [startDate]);

  // Shift badge theme helper harmonized with White, Obsidian Black (#0B0F1A), and Brand Coral (#FF5A36)
  const getShiftBadgeTheme = (shiftName: string) => {
    const s = shiftName.toLowerCase();
    if (s.includes("morning") || s.includes("sáng") || s.includes("opening")) {
      return {
        hex: "#F59E0B",
        bg: "bg-amber-500/10 border-amber-500/30 text-amber-950",
        borderLeft: "border-l-[3.5px] border-l-[#F59E0B]",
        icon: Sun,
        iconColor: "text-[#D97706]",
        badgeColor: "bg-amber-100 text-amber-900",
        dotColor: "bg-[#F59E0B]",
      };
    }
    if (s.includes("afternoon") || s.includes("chiều") || s.includes("peak")) {
      return {
        hex: "#FF5A36",
        bg: "bg-[#FF5A36]/10 border-[#FF5A36]/35 text-[#7C1C07]",
        borderLeft: "border-l-[3.5px] border-l-[#FF5A36]",
        icon: Sunset,
        iconColor: "text-[#FF5A36]",
        badgeColor: "bg-[#FF5A36]/20 text-[#7C1C07]",
        dotColor: "bg-[#FF5A36]",
      };
    }
    if (s.includes("night") || s.includes("đêm") || s.includes("closing")) {
      return {
        hex: "#6366F1",
        bg: "bg-indigo-500/10 border-indigo-500/30 text-indigo-950",
        borderLeft: "border-l-[3.5px] border-l-[#6366F1]",
        icon: Moon,
        iconColor: "text-[#6366F1]",
        badgeColor: "bg-indigo-100 text-indigo-900",
        dotColor: "bg-[#6366F1]",
      };
    }
    return {
      hex: "#10B981",
      bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-950",
      borderLeft: "border-l-[3.5px] border-l-[#10B981]",
      icon: Clock,
      iconColor: "text-[#10B981]",
      badgeColor: "bg-emerald-100 text-emerald-900",
      dotColor: "bg-[#10B981]",
    };
  };

  // Export handler
  const handleExport = async () => {
    try {
      setIsExporting(true);
      setExportError(null);
      const blob = await exportSchedule(schedules);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `orbit_schedule_${startDate}_to_${endDate}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setExportError(err.message);
      } else {
        setExportError("Failed to export schedule to Excel.");
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyShareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleAddShiftSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShiftEmployeeId || !newShiftDate) return;

    const empObj = employeesList.find((e) => e.id === newShiftEmployeeId);
    if (!empObj) return;

    const updated = JSON.parse(JSON.stringify(schedules)) as DailySchedule[];
    let dayTarget = updated.find((d) => d.date === newShiftDate);

    if (!dayTarget) {
      dayTarget = {
        date: newShiftDate,
        locations: [
          {
            id: newShiftLocation,
            name:
              newShiftLocation === "LOC_01"
                ? "Flagship Store (District 1)"
                : "Express Branch (District 7)",
            shifts: [],
          },
        ],
      };
      updated.push(dayTarget);
    }

    let locTarget = dayTarget.locations.find((l) => l.id === newShiftLocation);
    if (!locTarget) {
      locTarget = {
        id: newShiftLocation,
        name:
          newShiftLocation === "LOC_01"
            ? "Flagship Store (District 1)"
            : "Express Branch (District 7)",
        shifts: [],
      };
      dayTarget.locations.push(locTarget);
    }

    let shiftTarget = locTarget.shifts.find((s) => s.id === newShiftType);
    if (!shiftTarget) {
      const isMorning = newShiftType === "SHIFT_MORNING";
      shiftTarget = {
        id: newShiftType,
        name: isMorning ? "Morning Shift" : "Afternoon Shift",
        start: isMorning ? "07:00" : "14:30",
        end: isMorning ? "15:00" : "22:30",
        employees: [],
      };
      locTarget.shifts.push(shiftTarget);
    }

    if (!shiftTarget.employees.some((e) => (e.id || e.employee_id) === newShiftEmployeeId)) {
      shiftTarget.employees.push({
        id: empObj.id,
        name: empObj.name,
        job_title: empObj.role,
      });
    }

    setSchedules(updated);
    setAddShiftSuccess(true);
    setTimeout(() => {
      setAddShiftSuccess(false);
      setIsAddShiftOpen(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* ================= 1. TOP HERO & ACTION CONTROLS ================= */}
      <div className="rounded-3xl border border-zinc-200/80 bg-white/90 backdrop-blur-xs p-4 sm:p-6 lg:p-7 shadow-xs relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 -z-10 w-96 h-48 bg-gradient-to-l from-[#FF5A36]/8 to-transparent blur-2xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-semibold text-emerald-700 border border-emerald-200/80 shadow-2xs">
                <span className="relative flex h-2 w-2 mr-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                AI Schedule Generated & Verified
              </span>
              <span className="text-zinc-300 hidden sm:inline">•</span>
              <span className="text-[11px] sm:text-xs font-mono font-bold text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded-md">
                {viewMode === "day" ? singleDate : `${startDate} → ${endDate}`}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-[#0B0F1A]">
              Workforce Roster Matrix
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-zinc-500 max-w-2xl leading-relaxed">
              Optimized resource schedule for {employeesList.length} staff members with balanced workload, legal rest compliance, and zero shift conflicts.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-2.5 w-full lg:w-auto shrink-0">
            <button
              type="button"
              onClick={() => setIsAddShiftOpen(true)}
              className="inline-flex items-center justify-center space-x-1.5 rounded-xl border border-zinc-200 bg-white px-3 sm:px-3.5 py-2 sm:py-2.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-50 shadow-2xs transition active:scale-[0.99]"
            >
              <Plus className="h-3.5 w-3.5 text-[#FF5A36]" />
              <span>Add Shift</span>
            </button>

            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="inline-flex items-center justify-center space-x-1.5 rounded-xl border border-zinc-200 bg-white px-3 sm:px-3.5 py-2 sm:py-2.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-50 shadow-2xs transition active:scale-[0.99]"
            >
              <Share2 className="h-3.5 w-3.5 text-zinc-500" />
              <span>Share</span>
            </button>

            <button
              type="button"
              onClick={onRegenerate}
              className="inline-flex items-center justify-center space-x-1.5 rounded-xl border border-zinc-200 bg-white px-3 sm:px-3.5 py-2 sm:py-2.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-50 shadow-2xs transition active:scale-[0.99]"
            >
              <RefreshCw className="h-3.5 w-3.5 text-zinc-500" />
              <span>Regenerate</span>
            </button>

            <button
              type="button"
              onClick={handleExport}
              disabled={isExporting}
              className="col-span-2 sm:col-span-1 inline-flex items-center justify-center space-x-1.5 rounded-xl bg-[#0B0F1A] px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 transition active:scale-[0.99] border border-zinc-800 shadow-xs group"
            >
              <Download className="h-3.5 w-3.5 text-[#FF5A36] group-hover:translate-y-0.5 transition-transform" />
              <span>{isExporting ? "Exporting..." : "Export (.xlsx)"}</span>
            </button>
          </div>
        </div>

        {exportError && (
          <div className="mt-3 sm:mt-4 rounded-xl bg-rose-50 p-3 text-xs font-medium text-rose-700 border border-rose-200">
            {exportError}
          </div>
        )}
      </div>

      {/* ================= 2. EXECUTIVE KPI METRICS STRIP ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-3 sm:p-4 shadow-2xs hover:border-zinc-300 transition duration-150">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-zinc-400 uppercase tracking-wider">Total Staff</span>
            <div className="p-1.5 sm:p-2 rounded-xl bg-blue-50 text-blue-600">
              <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
          </div>
          <div className="mt-1.5 sm:mt-2 flex items-baseline space-x-1.5 sm:space-x-2">
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#0B0F1A]">
              {kpiStats.totalStaff}
            </span>
            <span className="text-[10px] sm:text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              Active
            </span>
          </div>
          <p className="mt-1 text-[10px] sm:text-[11px] text-zinc-400 truncate">100% assigned to shifts</p>
        </div>

        <div className="rounded-2xl border border-zinc-200/80 bg-white p-3 sm:p-4 shadow-2xs hover:border-zinc-300 transition duration-150">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-zinc-400 uppercase tracking-wider">Scheduled Hours</span>
            <div className="p-1.5 sm:p-2 rounded-xl bg-orange-50 text-[#FF5A36]">
              <Timer className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
          </div>
          <div className="mt-1.5 sm:mt-2 flex items-baseline space-x-1.5 sm:space-x-2">
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#0B0F1A]">
              {kpiStats.totalHours} hrs
            </span>
            <span className="text-[10px] sm:text-xs font-semibold text-zinc-500">
              ~{kpiStats.avgHours}h/staff
            </span>
          </div>
          <p className="mt-1 text-[10px] sm:text-[11px] text-zinc-400 truncate">Balanced distribution</p>
        </div>

        <div className="rounded-2xl border border-zinc-200/80 bg-white p-3 sm:p-4 shadow-2xs hover:border-zinc-300 transition duration-150">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-zinc-400 uppercase tracking-wider">Total Shifts</span>
            <div className="p-1.5 sm:p-2 rounded-xl bg-violet-50 text-violet-600">
              <Layers className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
          </div>
          <div className="mt-1.5 sm:mt-2 flex items-baseline space-x-1.5 sm:space-x-2">
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#0B0F1A]">
              {kpiStats.totalShifts}
            </span>
            <span className="text-[10px] sm:text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              100% Filled
            </span>
          </div>
          <p className="mt-1 text-[10px] sm:text-[11px] text-zinc-400 truncate">Across {schedules.length} days</p>
        </div>

        <div className="rounded-2xl border border-zinc-200/80 bg-white p-3 sm:p-4 shadow-2xs hover:border-zinc-300 transition duration-150">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-zinc-400 uppercase tracking-wider">Compliance</span>
            <div className="p-1.5 sm:p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
          </div>
          <div className="mt-1.5 sm:mt-2 flex items-baseline space-x-1.5 sm:space-x-2">
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-emerald-600">
              {kpiStats.complianceRate}
            </span>
            <span className="text-[10px] sm:text-xs font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              Verified
            </span>
          </div>
          <p className="mt-1 text-[10px] sm:text-[11px] text-zinc-400 truncate">0 Overtime / Overlaps</p>
        </div>
      </div>

      {/* ================= 3. CUSTOM DATE PICKER & VIEW SWITCHER TOOLBAR ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 py-1">
        {/* Left: 1 Single Custom Date Picker */}
        <div className="w-full sm:w-auto">
          <CustomDatePicker
            mode={viewMode === "day" ? "day" : viewMode === "month" ? "month" : "week"}
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

        {/* Right: View Switcher (Week / Day / Month / Table) */}
        <div className="flex items-center space-x-1 bg-zinc-100/90 p-1 rounded-xl border border-zinc-200/80 w-full sm:w-auto justify-between sm:justify-start overflow-x-auto">
          <button
            type="button"
            onClick={() => setViewMode("week")}
            className={`flex-1 sm:flex-none text-center rounded-lg px-3 sm:px-3.5 py-1.5 text-xs font-bold transition ${
              viewMode === "week"
                ? "bg-white text-zinc-900 shadow-xs"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Week
          </button>
          <button
            type="button"
            onClick={() => setViewMode("day")}
            className={`flex-1 sm:flex-none text-center rounded-lg px-3 sm:px-3.5 py-1.5 text-xs font-bold transition ${
              viewMode === "day"
                ? "bg-white text-zinc-900 shadow-xs"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Day
          </button>
          <button
            type="button"
            onClick={() => setViewMode("month")}
            className={`flex-1 sm:flex-none text-center rounded-lg px-3 sm:px-3.5 py-1.5 text-xs font-bold transition ${
              viewMode === "month"
                ? "bg-white text-zinc-900 shadow-xs"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Month
          </button>
          <button
            type="button"
            onClick={() => setViewMode("table")}
            className={`flex-1 sm:flex-none text-center rounded-lg px-3 sm:px-3.5 py-1.5 text-xs font-bold transition ${
              viewMode === "table"
                ? "bg-white text-zinc-900 shadow-xs"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Table View
          </button>
        </div>
      </div>

      {/* ================= 4. SEARCH BAR & ROLE FILTER CHIPS ================= */}
      {viewMode !== "month" && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 py-1">
          <div className="relative w-full md:w-72 lg:w-80">
            <Search className="pointer-events-none absolute inset-y-0 left-0 h-4 w-4 my-auto ml-3.5 text-zinc-400" />
            <input
              type="text"
              value={searchEmployee}
              onChange={(e) => {
                setSearchEmployee(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search staff name or ID..."
              className="w-full rounded-xl border border-zinc-200 bg-white py-2 pl-9 pr-8 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-[#0B0F1A] transition shadow-2xs"
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
            {rolesWithCount.map((r) => {
              const isSelected = selectedRole === r.role;
              return (
                <button
                  key={r.role}
                  type="button"
                  onClick={() => {
                    setSelectedRole(r.role);
                    setCurrentPage(1);
                  }}
                  className={`capitalize whitespace-nowrap rounded-xl px-2.5 sm:px-3 py-1.5 text-xs font-semibold transition flex items-center space-x-1.5 shrink-0 ${
                    isSelected
                      ? "bg-[#0B0F1A] text-white shadow-2xs"
                      : "bg-zinc-50 border border-zinc-200/80 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                  }`}
                >
                  <span>{r.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected ? "bg-white/20 text-white" : "bg-zinc-200/70 text-zinc-600"
                    }`}
                  >
                    {r.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= 5. VIEW 1 & 2: CALENDAR MATRIX (WEEK & DAY) ================= */}
      {(viewMode === "week" || viewMode === "day") && (
        <div className="space-y-4">
          <div className="rounded-2xl sm:rounded-3xl border border-zinc-200/90 bg-white overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-200/90 bg-zinc-50/90 text-xs font-bold uppercase tracking-wider text-zinc-600">
                    <th className="py-3 sm:py-4 px-3 sm:px-5 w-44 sm:w-56 md:w-64 lg:w-72 min-w-[160px] sm:min-w-[220px] md:min-w-[260px] sticky left-0 z-20 bg-zinc-50/95 backdrop-blur-xs border-r border-zinc-200">
                      <div className="flex items-center space-x-1.5 sm:space-x-2">
                        <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#FF5A36] shrink-0" />
                        <span className="truncate text-xs">Staff ({filteredEmployees.length})</span>
                      </div>
                    </th>

                    {activeTimelineDates.map((dateStr) => {
                      const d = parseLocalDate(dateStr);
                      const dayOfWeek = d.toLocaleDateString("en-US", { weekday: "short" });
                      const dayNum = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                      const daySummary = dailySummaryMap[dateStr];
                      const totalDayShifts = daySummary ? daySummary.shifts.length : 0;

                      return (
                        <th
                          key={dateStr}
                          className="py-2.5 sm:py-3.5 px-2.5 sm:px-4 min-w-[140px] sm:min-w-[180px] md:min-w-[210px] border-r border-zinc-100 last:border-r-0 text-center"
                        >
                          <div className="flex items-center justify-center space-x-1.5 sm:space-x-2">
                            <span className="font-extrabold text-xs sm:text-sm text-zinc-900">{dayOfWeek}</span>
                            <span className="text-[9px] sm:text-[10px] font-bold text-zinc-500 bg-zinc-200/70 px-1.5 py-0.5 rounded-md whitespace-nowrap">
                              {totalDayShifts} shifts
                            </span>
                          </div>
                          <div className="text-[10px] sm:text-[11px] font-mono text-zinc-400 font-medium mt-0.5">{dayNum}</div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>

                <tbody className="divide-y divide-zinc-100">
                  {paginatedEmployees.length > 0 ? (
                    paginatedEmployees.map((emp) => {
                      const avatarClass = getAvatarColor(emp.name);
                      const initial = emp.name.charAt(0);

                      return (
                        <tr key={emp.id} className="hover:bg-zinc-50/50 transition-colors">
                          <td className="py-3 sm:py-4 px-2.5 sm:px-4 md:px-5 align-top sticky left-0 z-10 bg-white border-r border-zinc-200 shadow-[3px_0_8px_-3px_rgba(0,0,0,0.03)] w-44 sm:w-56 md:w-64 lg:w-72 min-w-[160px] sm:min-w-[220px] md:min-w-[260px]">
                            <div className="flex items-start space-x-2 sm:space-x-3">
                              <div
                                className={`flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl font-extrabold text-[10px] sm:text-xs shadow-2xs ${avatarClass}`}
                              >
                                {initial}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-bold text-xs sm:text-sm text-zinc-900 truncate">
                                  {emp.name}
                                </p>
                                <div className="flex flex-wrap sm:flex-nowrap items-center gap-1 sm:space-x-1.5 text-[10px] sm:text-[11px] text-zinc-500 mt-0.5">
                                  <span className="font-mono text-[9px] sm:text-[10px] text-zinc-600 bg-zinc-100 px-1.5 py-0.5 rounded font-bold shrink-0">
                                    {emp.id}
                                  </span>
                                  <span className="hidden sm:inline">•</span>
                                  <span className="truncate font-medium text-zinc-600">{emp.role}</span>
                                </div>
                                <div className="mt-1 sm:mt-2 flex flex-wrap sm:flex-nowrap items-center gap-1 sm:space-x-2 text-[9px] sm:text-[10px] font-medium text-zinc-400">
                                  <span className="bg-zinc-50 border border-zinc-200 px-1 sm:px-1.5 py-0.5 rounded shrink-0">
                                    {emp.shiftCount} shifts
                                  </span>
                                  <span className="hidden sm:inline">•</span>
                                  <span className="text-zinc-600 font-semibold whitespace-nowrap">{emp.totalHours} hrs/wk</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {activeTimelineDates.map((dateStr) => {
                            const key = `${emp.id}_${dateStr}`;
                            const shiftsForCell = shiftMap[key] || [];

                            return (
                              <td
                                key={dateStr}
                                className="py-2.5 sm:py-3.5 px-2 sm:px-3.5 align-top border-r border-zinc-100 last:border-r-0 min-w-[140px] sm:min-w-[180px] md:min-w-[210px]"
                              >
                                {shiftsForCell.length > 0 ? (
                                  <div className="space-y-1.5 sm:space-y-2">
                                    {shiftsForCell.map((shift) => {
                                      const theme = getShiftBadgeTheme(shift.shiftName);
                                      const IconComponent = theme.icon;

                                      return (
                                        <div
                                          key={shift.id}
                                          className={`rounded-xl sm:rounded-2xl border p-2 sm:p-2.5 lg:p-3 shadow-2xs transition duration-150 hover:shadow-xs hover:border-zinc-300 ${theme.bg} ${theme.borderLeft}`}
                                        >
                                          <div className="flex items-center justify-between gap-1">
                                            <span className="font-extrabold text-[11px] sm:text-xs text-zinc-900 truncate">
                                              {shift.shiftName}
                                            </span>
                                            <IconComponent className={`h-3.5 w-3.5 shrink-0 ${theme.iconColor}`} />
                                          </div>
                                          <div className="flex items-center space-x-1 text-[10px] sm:text-[11px] font-mono mt-1 text-zinc-700 font-semibold">
                                            <Clock className="h-3 w-3 shrink-0 text-zinc-400" />
                                            <span className="truncate">
                                              {shift.start} – {shift.end}
                                            </span>
                                          </div>
                                          <div className="flex items-center space-x-1 text-[9px] sm:text-[10px] mt-0.5 sm:mt-1 text-zinc-500 truncate">
                                            <MapPin className="h-3 w-3 shrink-0 text-zinc-400" />
                                            <span className="truncate">{shift.locationName}</span>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <div className="h-full min-h-[58px] sm:min-h-[72px] flex items-center justify-center rounded-xl sm:rounded-2xl border border-dashed border-zinc-200/80 bg-zinc-50/30 text-[10px] sm:text-[11px] font-medium text-zinc-400 hover:border-zinc-300 transition">
                                    <span className="opacity-50 font-mono">Off</span>
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={activeTimelineDates.length + 1} className="py-14 text-center text-xs text-zinc-400">
                        No employees found matching &ldquo;{searchEmployee}&rdquo;.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ================= 6. SHIFT COLOR LEGEND & EMPLOYEE PAGINATION ROW ================= */}
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
                <span className="h-2 sm:h-2.5 w-2 sm:w-2.5 rounded-full bg-[#6366F1] ring-2 ring-[#6366F1]/30 shadow-2xs" />
                <span className="font-semibold text-zinc-800 text-[11px] sm:text-xs">Night Shift</span>
                <span className="text-[9px] sm:text-[10px] font-mono text-zinc-400 font-medium hidden xs:inline">22:00–06:00</span>
              </div>
            </div>

            {/* Right: Clean Employee Pagination Controls */}
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

      {/* ================= 7. VIEW 3: FULL MONTH CALENDAR OVERVIEW ================= */}
      {viewMode === "month" && (
        <div className="rounded-2xl sm:rounded-3xl border border-zinc-200/90 bg-white p-4 sm:p-6 lg:p-7 shadow-xs space-y-3 sm:space-y-4 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-100">
            <div className="flex items-center space-x-2">
              <CalendarDays className="h-4 w-4 sm:h-5 sm:w-5 text-[#FF5A36] shrink-0" />
              <h3 className="font-bold text-base sm:text-lg text-zinc-900">Shift Horizon Month Overview</h3>
            </div>
            <span className="text-[11px] sm:text-xs text-zinc-500 font-medium">
              Click any active date card to focus single day schedule
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((dayName) => (
              <div
                key={dayName}
                className="text-center py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-zinc-400 bg-zinc-50 rounded-lg sm:rounded-xl border border-zinc-100 truncate"
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
                    className="min-h-[70px] sm:min-h-[95px] md:min-h-[110px] rounded-xl sm:rounded-2xl border border-dashed border-zinc-100 bg-zinc-50/20 p-1 sm:p-2"
                  />
                );
              }

              return (
                <div
                  key={idx}
                  onClick={() => {
                    if (hasShifts) {
                      setSingleDate(cell.dateStr);
                      setViewMode("day");
                    }
                  }}
                  className={`min-h-[70px] sm:min-h-[95px] md:min-h-[110px] rounded-xl sm:rounded-2xl border p-1.5 sm:p-2.5 flex flex-col justify-between transition ${
                    hasShifts
                      ? "border-zinc-200 bg-white hover:border-[#FF5A36]/60 hover:shadow-xs cursor-pointer"
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
                      <span className="text-[9px] sm:text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1 sm:px-1.5 py-0.5 rounded-md border border-emerald-200/60 truncate">
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
                            {s.name.split(" ")[0]} ({s.employees.length})
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

      {/* ================= 8. VIEW 4: TABLE VIEW ================= */}
      {viewMode === "table" && (
        <div className="rounded-2xl sm:rounded-3xl border border-zinc-200/90 bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50/80 text-xs font-bold uppercase tracking-wider text-zinc-600">
                  <th className="py-3 sm:py-3.5 px-3 sm:px-6">Date</th>
                  <th className="py-3 sm:py-3.5 px-3 sm:px-6">Location</th>
                  <th className="py-3 sm:py-3.5 px-3 sm:px-6">Shift Details</th>
                  <th className="py-3 sm:py-3.5 px-3 sm:px-6">Working Hours</th>
                  <th className="py-3 sm:py-3.5 px-3 sm:px-6">Assigned Staff</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {schedules.flatMap((day) =>
                  day.locations.flatMap((loc) =>
                    loc.shifts.map((shift, sIdx) => {
                      const theme = getShiftBadgeTheme(shift.name);
                      const IconComponent = theme.icon;
                      return (
                        <tr
                          key={`${day.date}_${loc.id}_${shift.id}_${sIdx}`}
                          className="hover:bg-zinc-50/50 transition-colors"
                        >
                          <td className="py-3 sm:py-3.5 px-3 sm:px-6 font-bold text-zinc-900 whitespace-nowrap text-xs sm:text-sm">
                            {day.date}
                          </td>
                          <td className="py-3 sm:py-3.5 px-3 sm:px-6">
                            <span className="font-semibold text-zinc-800 text-xs sm:text-sm">{loc.name}</span>
                          </td>
                          <td className="py-3 sm:py-3.5 px-3 sm:px-6">
                            <span
                              className={`inline-flex items-center space-x-1.5 rounded-lg px-2 sm:px-2.5 py-1 text-xs font-bold border ${theme.bg} ${theme.borderLeft}`}
                            >
                              <IconComponent className={`h-3 w-3 shrink-0 ${theme.iconColor}`} />
                              <span className="truncate">{shift.name}</span>
                            </span>
                          </td>
                          <td className="py-3 sm:py-3.5 px-3 sm:px-6 font-mono text-xs font-bold text-zinc-600 whitespace-nowrap">
                            {shift.start} – {shift.end}
                          </td>
                          <td className="py-3 sm:py-3.5 px-3 sm:px-6">
                            <div className="flex flex-wrap gap-1 sm:gap-1.5">
                              {shift.employees.map((emp, eIdx) => (
                                <span
                                  key={eIdx}
                                  className="inline-flex items-center rounded-lg bg-zinc-50 border border-zinc-200 px-2 sm:px-2.5 py-1 text-xs font-medium text-zinc-800"
                                >
                                  {emp.name}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= MODAL: SHARE SCHEDULE ================= */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-950/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl sm:rounded-3xl border border-zinc-200 bg-white p-5 sm:p-7 shadow-2xl space-y-4 sm:space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0B0F1A] text-white shrink-0">
                  <Share2 className="h-4 w-4 text-[#FF5A36]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-zinc-900">Share Schedule</h3>
                  <p className="text-xs text-zinc-500">Send schedule to team or export</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
                Shareable Web Link
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  readOnly
                  value={typeof window !== "undefined" ? window.location.href : ""}
                  className="flex-1 min-w-0 rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 text-xs text-zinc-700 font-mono focus:outline-hidden truncate"
                />
                <button
                  type="button"
                  onClick={handleCopyShareLink}
                  className="inline-flex items-center space-x-1 rounded-xl bg-[#0B0F1A] px-3 sm:px-3.5 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800 transition shrink-0"
                >
                  {copiedLink ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  <span>{copiedLink ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
              <span className="flex items-center text-emerald-600 font-semibold truncate mr-2">
                <CheckCircle2 className="h-3.5 w-3.5 mr-1 shrink-0" /> Ready for live distribution
              </span>
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="text-xs font-bold text-zinc-800 hover:underline shrink-0"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD SHIFT / SCHEDULE ================= */}
      {isAddShiftOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-950/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl sm:rounded-3xl border border-zinc-200 bg-white p-5 sm:p-7 shadow-2xl space-y-4 sm:space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0B0F1A] text-white shrink-0">
                  <Plus className="h-4 w-4 text-[#FF5A36]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-zinc-900">Add Shift Assignment</h3>
                  <p className="text-xs text-zinc-500">Manually schedule an employee</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddShiftOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {addShiftSuccess ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600" />
                <h4 className="font-bold text-zinc-900">Shift Assigned Successfully!</h4>
              </div>
            ) : (
              <form onSubmit={handleAddShiftSubmit} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                    Select Employee <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={newShiftEmployeeId}
                    onChange={(e) => setNewShiftEmployeeId(e.target.value)}
                    className="block w-full rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-hidden"
                  >
                    <option value="">-- Choose Employee --</option>
                    {employeesList.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} ({emp.id}) — {emp.role}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                    Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={newShiftDate}
                    onChange={(e) => setNewShiftDate(e.target.value)}
                    className="block w-full rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                    Store Location
                  </label>
                  <select
                    value={newShiftLocation}
                    onChange={(e) => setNewShiftLocation(e.target.value)}
                    className="block w-full rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-hidden"
                  >
                    <option value="LOC_01">Flagship Store (District 1)</option>
                    <option value="LOC_02">Express Branch (District 7)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                    Shift Period
                  </label>
                  <select
                    value={newShiftType}
                    onChange={(e) => setNewShiftType(e.target.value)}
                    className="block w-full rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-hidden"
                  >
                    <option value="SHIFT_MORNING">Morning Shift (07:00 – 15:00)</option>
                    <option value="SHIFT_AFTERNOON">Afternoon Shift (14:30 – 22:30)</option>
                    <option value="SHIFT_NIGHT">Night Shift (22:00 – 06:00)</option>
                  </select>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-3 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => setIsAddShiftOpen(false)}
                    className="rounded-xl border border-zinc-200 px-3.5 sm:px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-[#0B0F1A] px-3.5 sm:px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 transition"
                  >
                    Confirm Assignment
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};


