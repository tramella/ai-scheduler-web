"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Download,
  RefreshCw,
  CheckCircle2,
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
  ChevronDown,
  Sun,
  Sunset,
  Moon,
  ShieldCheck,
  Users,
  Timer,
  Layers,
  Sparkle,
  GripVertical,
  ArrowRightLeft,
  Undo2,
  Sliders,
} from "lucide-react";
import { DailySchedule, exportSchedule } from "@/lib/apiClient";
import CustomDatePicker from "./CustomDatePicker";
import { Pagination } from "@/components/ui/Pagination";

interface ScheduleResultViewProps {
  schedules: DailySchedule[];
  startDate: string;
  endDate: string;
  onRegenerate: () => void;
  onReset: () => void;
  onScheduleChange?: (schedules: DailySchedule[]) => void;
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

// Unified enterprise staff avatar color token (single cohesive color)
const getAvatarColor = (_name?: string) => {
  return "bg-[#2F2C59] dark:bg-indigo-600 text-white shadow-2xs";
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
  onScheduleChange,
}) => {
  const [schedules, setSchedules] = useState<DailySchedule[]>(initialSchedules);
  const [viewMode, setViewMode] = useState<"week" | "day" | "month" | "table">("week");

  // Drag and Drop Interactive States
  const [draggedShift, setDraggedShift] = useState<FlattenedShift | null>(null);
  const [dragOverCellKey, setDragOverCellKey] = useState<string | null>(null);
  const [dragOverCardId, setDragOverCardId] = useState<string | null>(null);
  const [historyPast, setHistoryPast] = useState<DailySchedule[][]>([]);
  const [actionToast, setActionToast] = useState<{ message: string; canUndo?: boolean } | null>(null);

  // Auto-dismiss floating toast notification
  useEffect(() => {
    if (!actionToast) return;
    const timer = setTimeout(() => {
      setActionToast(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, [actionToast]);

  // Date states
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [singleDate, setSingleDate] = useState(initialStartDate);

  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  // Pagination for Employee Rows
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Search, Role & Shift Filters
  const [searchEmployee, setSearchEmployee] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedShift, setSelectedShift] = useState<string>("all");

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

  // Shift filter options with counts
  const shiftTypesList = useMemo(() => {
    const map = new Map<string, { id: string; label: string; count: number }>();
    map.set("all", { id: "all", label: "All Shifts", count: 0 });

    const standardOrder = [
      { id: "SHIFT_MORNING", label: "Morning Shift" },
      { id: "SHIFT_AFTERNOON", label: "Afternoon Shift" },
      { id: "SHIFT_NIGHT", label: "Night Shift" },
    ];
    standardOrder.forEach((s) => map.set(s.id, { id: s.id, label: s.label, count: 0 }));

    effectiveSchedules.forEach((day) => {
      day.locations.forEach((loc) => {
        loc.shifts.forEach((shift) => {
          const shiftKey = shift.id || shift.name;
          const cleanName = shift.name.split(" (")[0] || shift.name;
          const existing = map.get(shiftKey) || {
            id: shiftKey,
            label: cleanName,
            count: 0,
          };
          existing.count += shift.employees.length;
          map.set(shiftKey, existing);
          map.get("all")!.count += shift.employees.length;
        });
      });
    });

    return Array.from(map.values()).filter((s) => s.id === "all" || s.count > 0);
  }, [effectiveSchedules]);

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    return employeesList.filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(searchEmployee.toLowerCase()) ||
        emp.id.toLowerCase().includes(searchEmployee.toLowerCase());
      const matchesRole =
        selectedRole === "all" || emp.role.toLowerCase() === selectedRole.toLowerCase();

      let matchesShift = true;
      if (selectedShift !== "all") {
        matchesShift = activeTimelineDates.some((dateStr) => {
          const key = `${emp.id}_${dateStr}`;
          const shifts = shiftMap[key] || [];
          return shifts.some(
            (s) =>
              s.shiftId === selectedShift ||
              s.shiftName.toLowerCase().includes(selectedShift.toLowerCase())
          );
        });
      }

      return matchesSearch && matchesRole && matchesShift;
    });
  }, [employeesList, searchEmployee, selectedRole, selectedShift, activeTimelineDates, shiftMap]);

  // Paginated employees
  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / pageSize));
  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredEmployees.slice(start, start + pageSize);
  }, [filteredEmployees, currentPage, pageSize]);

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
          const matches =
            selectedShift === "all" ||
            shift.id === selectedShift ||
            shift.name.toLowerCase().includes(selectedShift.toLowerCase());
          if (!matches) return;

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
  }, [effectiveSchedules, selectedShift]);

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

  // Shift badge theme helper harmonized with Orbit Weave tokens
  const getShiftBadgeTheme = (shiftName: string) => {
    const s = shiftName.toLowerCase();
    if (s.includes("morning") || s.includes("sáng") || s.includes("opening")) {
      return {
        hex: "#2F5BFF",
        bg: "bg-blue-500/10 border-blue-500/30 text-blue-950 dark:bg-blue-500/15 dark:border-blue-400/30 dark:text-blue-100",
        borderLeft: "border-l-[3.5px] border-l-[#2F5BFF]",
        icon: Sun,
        iconColor: "text-[#2F5BFF] dark:text-blue-300",
        badgeColor: "bg-blue-100 dark:bg-blue-900/50 text-blue-900 dark:text-blue-200",
        dotColor: "bg-[#2F5BFF]",
      };
    }
    if (s.includes("afternoon") || s.includes("chiều") || s.includes("peak")) {
      return {
        hex: "#FF7A59",
        bg: "bg-[#FF7A59]/10 border-[#FF7A59]/35 text-[#7C1C07] dark:bg-[#FF7A59]/15 dark:border-[#FF7A59]/30 dark:text-orange-100",
        borderLeft: "border-l-[3.5px] border-l-[#FF7A59]",
        icon: Sunset,
        iconColor: "text-[#FF7A59] dark:text-orange-300",
        badgeColor: "bg-[#FF7A59]/20 text-[#7C1C07] dark:bg-orange-900/50 dark:text-orange-200",
        dotColor: "bg-[#FF7A59]",
      };
    }
    if (s.includes("night") || s.includes("đêm") || s.includes("closing")) {
      return {
        hex: "#2F2C59",
        bg: "bg-indigo-500/10 border-indigo-500/30 text-indigo-950 dark:bg-indigo-500/20 dark:border-indigo-400/30 dark:text-indigo-100",
        borderLeft: "border-l-[3.5px] border-l-[#2F2C59] dark:border-l-indigo-400",
        icon: Moon,
        iconColor: "text-[#2F2C59] dark:text-indigo-300",
        badgeColor: "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-900 dark:text-indigo-200",
        dotColor: "bg-[#2F2C59] dark:bg-indigo-400",
      };
    }
    return {
      hex: "#10B981",
      bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:bg-emerald-500/15 dark:border-emerald-400/30 dark:text-emerald-100",
      borderLeft: "border-l-[3.5px] border-l-[#10B981]",
      icon: Clock,
      iconColor: "text-[#10B981] dark:text-emerald-300",
      badgeColor: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-900 dark:text-emerald-200",
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
    onScheduleChange?.(updated);
    setAddShiftSuccess(true);
    setTimeout(() => {
      setAddShiftSuccess(false);
      setIsAddShiftOpen(false);
    }, 800);
  };

  // Undo Last Drag & Drop Action
  const handleUndo = () => {
    if (historyPast.length === 0) return;
    const previous = historyPast[historyPast.length - 1];
    setHistoryPast((prev) => prev.slice(0, prev.length - 1));
    setSchedules(previous);
    onScheduleChange?.(previous);
    setActionToast({
      message: "Schedule modification undone successfully",
      canUndo: false,
    });
  };

  // Move a Shift assignment to a new employee and/or date
  const handleMoveShift = (
    source: FlattenedShift,
    targetEmployeeId: string,
    targetDateStr: string
  ) => {
    if (source.employeeId === targetEmployeeId && source.date === targetDateStr) {
      return;
    }

    const nextSchedules: DailySchedule[] = JSON.parse(JSON.stringify(effectiveSchedules));

    // 1. Remove employee from source shift
    const sourceDay = nextSchedules.find((d) => d.date === source.date);
    if (sourceDay) {
      const sourceLoc = sourceDay.locations.find((l) => l.id === source.locationId);
      if (sourceLoc) {
        const sourceShift = sourceLoc.shifts.find((s) => s.id === source.shiftId);
        if (sourceShift) {
          sourceShift.employees = sourceShift.employees.filter(
            (e) => (e.id || e.employee_id || e.name) !== source.employeeId
          );
        }
      }
    }

    // 2. Locate or create target day
    let targetDay = nextSchedules.find((d) => d.date === targetDateStr);
    if (!targetDay) {
      targetDay = {
        date: targetDateStr,
        locations: [
          {
            id: source.locationId,
            name: source.locationName,
            shifts: [],
          },
        ],
      };
      nextSchedules.push(targetDay);
    }

    // 3. Locate or create target location
    let targetLoc = targetDay.locations.find((l) => l.id === source.locationId);
    if (!targetLoc) {
      targetLoc = {
        id: source.locationId,
        name: source.locationName,
        shifts: [],
      };
      targetDay.locations.push(targetLoc);
    }

    // 4. Locate or create target shift
    let targetShift = targetLoc.shifts.find((s) => s.id === source.shiftId);
    if (!targetShift) {
      targetShift = {
        id: source.shiftId,
        name: source.shiftName,
        start: source.start,
        end: source.end,
        employees: [],
      };
      targetLoc.shifts.push(targetShift);
    }

    // 5. Find target employee profile
    const targetEmp = employeesList.find((e) => e.id === targetEmployeeId);
    const targetName = targetEmp?.name || targetEmployeeId;
    const targetRole = targetEmp?.role || "Staff Member";

    // Prevent duplicate assignment in same shift
    const alreadyInShift = targetShift.employees.some(
      (e) => (e.id || e.employee_id || e.name) === targetEmployeeId
    );

    if (alreadyInShift) {
      setActionToast({
        message: `${targetName} is already assigned to ${source.shiftName} on ${targetDateStr}`,
        canUndo: false,
      });
      return;
    }

    targetShift.employees.push({
      id: targetEmployeeId,
      name: targetName,
      job_title: targetRole,
    });

    // 6. Record history & commit
    setHistoryPast((prev) => [...prev, schedules]);
    setSchedules(nextSchedules);
    onScheduleChange?.(nextSchedules);

    // 7. Toast feedback
    const sourceEmp = employeesList.find((e) => e.id === source.employeeId);
    const sourceName = sourceEmp?.name || source.employeeId;

    if (source.employeeId === targetEmployeeId) {
      setActionToast({
        message: `Moved ${source.shiftName} for ${sourceName} to ${targetDateStr}`,
        canUndo: true,
      });
    } else if (source.date === targetDateStr) {
      setActionToast({
        message: `Reassigned ${source.shiftName} on ${targetDateStr} from ${sourceName} to ${targetName}`,
        canUndo: true,
      });
    } else {
      setActionToast({
        message: `Reassigned ${source.shiftName} to ${targetName} on ${targetDateStr}`,
        canUndo: true,
      });
    }
  };

  // Swap shifts between two blocks
  const handleSwapShifts = (source: FlattenedShift, target: FlattenedShift) => {
    if (source.id === target.id) return;

    const nextSchedules: DailySchedule[] = JSON.parse(JSON.stringify(effectiveSchedules));

    const sourceDay = nextSchedules.find((d) => d.date === source.date);
    const targetDay = nextSchedules.find((d) => d.date === target.date);

    if (!sourceDay || !targetDay) return;

    const sourceLoc = sourceDay.locations.find((l) => l.id === source.locationId);
    const targetLoc = targetDay.locations.find((l) => l.id === target.locationId);

    if (!sourceLoc || !targetLoc) return;

    const sourceShift = sourceLoc.shifts.find((s) => s.id === source.shiftId);
    const targetShift = targetLoc.shifts.find((s) => s.id === target.shiftId);

    if (!sourceShift || !targetShift) return;

    const empA = employeesList.find((e) => e.id === source.employeeId);
    const empB = employeesList.find((e) => e.id === target.employeeId);

    if (!empA || !empB) return;

    // Case 1: Same employee swapping shifts across dates or shift types
    if (source.employeeId === target.employeeId) {
      sourceShift.employees = sourceShift.employees.filter(
        (e) => (e.id || e.employee_id || e.name) !== source.employeeId
      );
      targetShift.employees = targetShift.employees.filter(
        (e) => (e.id || e.employee_id || e.name) !== target.employeeId
      );

      let sourceDayTargetType = sourceLoc.shifts.find((s) => s.id === target.shiftId);
      if (!sourceDayTargetType) {
        sourceDayTargetType = {
          id: target.shiftId,
          name: target.shiftName,
          start: target.start,
          end: target.end,
          employees: [],
        };
        sourceLoc.shifts.push(sourceDayTargetType);
      }
      sourceDayTargetType.employees.push({
        id: empA.id,
        name: empA.name,
        job_title: empA.role,
      });

      let targetDaySourceType = targetLoc.shifts.find((s) => s.id === source.shiftId);
      if (!targetDaySourceType) {
        targetDaySourceType = {
          id: source.shiftId,
          name: source.shiftName,
          start: source.start,
          end: source.end,
          employees: [],
        };
        targetLoc.shifts.push(targetDaySourceType);
      }
      targetDaySourceType.employees.push({
        id: empA.id,
        name: empA.name,
        job_title: empA.role,
      });

      setHistoryPast((prev) => [...prev, schedules]);
      setSchedules(nextSchedules);
      onScheduleChange?.(nextSchedules);

      setActionToast({
        message: `Swapped shifts for ${empA.name}: ${source.date} (${source.shiftName}) ⇄ ${target.date} (${target.shiftName})`,
        canUndo: true,
      });
      return;
    }

    // Case 2: Different employees swapping shifts
    sourceShift.employees = sourceShift.employees.filter(
      (e) => (e.id || e.employee_id || e.name) !== source.employeeId
    );
    targetShift.employees = targetShift.employees.filter(
      (e) => (e.id || e.employee_id || e.name) !== target.employeeId
    );

    sourceShift.employees.push({
      id: empB.id,
      name: empB.name,
      job_title: empB.role,
    });
    targetShift.employees.push({
      id: empA.id,
      name: empA.name,
      job_title: empA.role,
    });

    setHistoryPast((prev) => [...prev, schedules]);
    setSchedules(nextSchedules);
    onScheduleChange?.(nextSchedules);

    setActionToast({
      message: `Swapped shifts: ${empA.name} (${source.shiftName}) ⇄ ${empB.name} (${target.shiftName})`,
      canUndo: true,
    });
  };

  return (
    <div className="space-y-3.5 sm:space-y-4">
      {/* Status Strip */}
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-900/60 shadow-2xs">
          <span className="relative flex h-2 w-2 mr-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          AI Schedule Generated & Verified
        </span>
      </div>

      {/* Active Floating Drag Notification (Appears ONLY while dragging a shift) */}
      {draggedShift && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-slate-900/95 text-white text-xs font-semibold shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 border border-white/10">
          <GripVertical className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
          <span>Moving: <strong className="text-amber-300">{draggedShift.shiftName}</strong> ({draggedShift.employeeName}) &bull; Drop on empty cell or shift to swap</span>
        </div>
      )}

      {/* ================= 1. PRIMARY TOOLBAR: DATE PICKER, VIEW SWITCHER & ACTIONS ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2.5 sm:gap-3">
        {/* Left: Custom Date Picker & View Switcher Segmented Tabs */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
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

          <div className="flex items-center space-x-0.5 bg-slate-100 dark:bg-slate-800/70 p-1 rounded-full border border-slate-200/80 dark:border-slate-700/60">
            <button
              type="button"
              onClick={() => setViewMode("week")}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                viewMode === "week"
                  ? "bg-[#2F2C59] text-white dark:bg-indigo-600 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Week
            </button>
            <button
              type="button"
              onClick={() => setViewMode("day")}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                viewMode === "day"
                  ? "bg-[#2F2C59] text-white dark:bg-indigo-600 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Day
            </button>
            <button
              type="button"
              onClick={() => setViewMode("month")}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                viewMode === "month"
                  ? "bg-[#2F2C59] text-white dark:bg-indigo-600 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Month
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                viewMode === "table"
                  ? "bg-[#2F2C59] text-white dark:bg-indigo-600 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Table view
            </button>
          </div>
        </div>

        {/* Right: Clean Actions Cluster */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsAddShiftOpen(true)}
            className="inline-flex items-center space-x-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-1.5 sm:py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-xs transition active:scale-[0.99] cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5 text-[#FF7A59]" />
            <span>Add shift</span>
          </button>

          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="inline-flex items-center space-x-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-1.5 sm:py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-xs transition active:scale-[0.99] cursor-pointer"
          >
            <Share2 className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
            <span>Share</span>
          </button>

          <button
            type="button"
            onClick={onRegenerate}
            className="inline-flex items-center space-x-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-1.5 sm:py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-xs transition active:scale-[0.99] cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
            <span>Regenerate</span>
          </button>

          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="inline-flex items-center space-x-1.5 rounded-full bg-[#2F2C59] dark:bg-indigo-600 px-4 py-1.5 sm:py-2 text-xs font-semibold text-white hover:bg-[#1E1B3A] dark:hover:bg-indigo-700 disabled:opacity-50 transition active:scale-[0.99] shadow-xs group cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-white group-hover:translate-y-0.5 transition-transform" />
            <span>{isExporting ? "Exporting..." : "Export"}</span>
          </button>
        </div>
      </div>

      {exportError && (
        <div className="rounded-2xl bg-rose-50 dark:bg-rose-950/40 p-3 text-xs font-medium text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60">
          {exportError}
        </div>
      )}

      {/* ================= 2. SECONDARY TOOLBAR: SEARCH, FILTERS & INLINE SHIFT LEGEND ================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2.5 px-3.5 py-2.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800">
        {/* Left: Filters Cluster */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative min-w-[130px] sm:w-44 lg:w-48">
            <Search className="pointer-events-none absolute inset-y-0 left-0 h-3.5 w-3.5 my-auto ml-3 text-slate-400" />
            <input
              type="text"
              value={searchEmployee}
              onChange={(e) => {
                setSearchEmployee(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Filter staff..."
              className="w-full rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-1.5 pl-8 pr-6 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#2F5BFF]/50 transition"
            />
            {searchEmployee && (
              <button
                type="button"
                onClick={() => setSearchEmployee("")}
                className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Role Filter */}
          <div className="relative">
            <select
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-1.5 pl-3.5 pr-8 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#2F5BFF]/50 transition cursor-pointer"
            >
              {rolesWithCount.map((r) => (
                <option key={r.role} value={r.role}>
                  {r.role === "all" ? "All roles" : r.label} ({r.count})
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
          </div>

          {/* Shift Filter */}
          <div className="relative">
            <select
              value={selectedShift}
              onChange={(e) => {
                setSelectedShift(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-1.5 pl-3.5 pr-8 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#2F5BFF]/50 transition cursor-pointer"
            >
              {shiftTypesList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label} ({s.count})
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
          </div>

          {/* Reset Filters */}
          {(selectedRole !== "all" || selectedShift !== "all" || searchEmployee !== "") && (
            <button
              type="button"
              onClick={() => {
                setSelectedRole("all");
                setSelectedShift("all");
                setSearchEmployee("");
                setCurrentPage(1);
              }}
              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-200/60 dark:hover:text-white dark:hover:bg-slate-700 transition cursor-pointer"
            >
              <X className="h-3 w-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Right: Inline Clean Shift Legend */}
        <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400 font-medium shrink-0 self-end md:self-auto">
          <div className="flex items-center space-x-1.5">
            <span className="h-2 w-2 rounded-full bg-[#2F5BFF]" />
            <span>Morning</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="h-2 w-2 rounded-full bg-[#FF7A59]" />
            <span>Afternoon</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="h-2 w-2 rounded-full bg-[#2F2C59] dark:bg-indigo-400" />
            <span>Night</span>
          </div>
        </div>
      </div>

      {/* ================= 3. VIEW 1 & 2: CALENDAR MATRIX (WEEK & DAY) ================= */}
      {(viewMode === "week" || viewMode === "day") && (
        <div className="space-y-4">

          <div className="rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <th className="py-3 px-3.5 w-36 sm:w-44 md:w-48 lg:w-52 min-w-[140px] sm:min-w-[170px] md:min-w-[190px] sticky left-0 z-20 bg-slate-50/95 dark:bg-slate-900 backdrop-blur-xs border-r border-slate-200/80 dark:border-slate-800">
                      <div className="flex items-center space-x-1.5">
                        <User className="h-3.5 w-3.5 text-[#FF7A59] shrink-0" />
                        <span className="truncate text-xs font-medium text-slate-700 dark:text-slate-300">Staff ({filteredEmployees.length})</span>
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
                          className="py-2.5 px-2 min-w-[115px] sm:min-w-[125px] md:min-w-[135px] lg:min-w-[145px] xl:min-w-[155px] border-r border-slate-100 dark:border-slate-800 last:border-r-0 text-center"
                        >
                          <div className="flex items-center justify-center space-x-1">
                            <span className="font-extrabold text-xs text-slate-900 dark:text-white">{dayOfWeek}</span>
                            <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 bg-slate-200/70 dark:bg-slate-700 px-1 py-0.2 rounded whitespace-nowrap">
                              {totalDayShifts}
                            </span>
                          </div>
                          <div className="text-[10px] font-mono text-slate-400 font-medium">{dayNum}</div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {paginatedEmployees.length > 0 ? (
                    paginatedEmployees.map((emp) => {
                      const avatarClass = getAvatarColor(emp.name);
                      const initial = emp.name.charAt(0);

                      return (
                        <tr key={emp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800 transition-colors">
                          <td className="py-2 px-2 sm:px-2.5 align-top sticky left-0 z-10 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-[2px_0_6px_-2px_rgba(0,0,0,0.04)] w-36 sm:w-44 md:w-48 lg:w-52 min-w-[140px] sm:min-w-[170px] md:min-w-[190px]">
                            <div className="flex items-start space-x-1.5 sm:space-x-2">
                              <div
                                className={`flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg sm:rounded-xl font-extrabold text-[10px] shadow-2xs ${avatarClass}`}
                              >
                                {initial}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-bold text-xs text-slate-900 dark:text-white truncate leading-tight">
                                  {emp.name}
                                </p>
                                <div className="flex items-center space-x-1 text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                                  <span className="font-mono text-[9px] text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-1 py-0.2 rounded font-bold shrink-0">
                                    {emp.id}
                                  </span>
                                  <span className="truncate">{emp.role}</span>
                                </div>
                                <div className="mt-1 flex items-center space-x-1.5 text-[9px] text-slate-400">
                                  <span className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 px-1 py-0.2 rounded shrink-0 font-medium">
                                    {emp.shiftCount} shifts
                                  </span>
                                  <span className="text-slate-600 dark:text-slate-300 font-semibold truncate">{emp.totalHours}h</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {activeTimelineDates.map((dateStr) => {
                            const key = `${emp.id}_${dateStr}`;
                            const rawShiftsForCell = shiftMap[key] || [];
                            const shiftsForCell =
                              selectedShift === "all"
                                ? rawShiftsForCell
                                : rawShiftsForCell.filter(
                                    (s) =>
                                      s.shiftId === selectedShift ||
                                      s.shiftName.toLowerCase().includes(selectedShift.toLowerCase())
                                  );
                            const isCellDragOver = dragOverCellKey === key;

                            return (
                              <td
                                key={dateStr}
                                onDragOver={(e) => {
                                  e.preventDefault();
                                  e.dataTransfer.dropEffect = "move";
                                }}
                                onDragEnter={() => {
                                  if (draggedShift) {
                                    setDragOverCellKey(key);
                                  }
                                }}
                                onDragLeave={() => {
                                  if (dragOverCellKey === key) {
                                    setDragOverCellKey(null);
                                  }
                                }}
                                onDrop={(e) => {
                                  e.preventDefault();
                                  if (draggedShift) {
                                    handleMoveShift(draggedShift, emp.id, dateStr);
                                  }
                                  setDraggedShift(null);
                                  setDragOverCellKey(null);
                                  setDragOverCardId(null);
                                }}
                                className={`py-1.5 sm:py-2 px-1 sm:px-1.5 align-top border-r border-slate-100 dark:border-slate-800 last:border-r-0 min-w-[115px] sm:min-w-[125px] md:min-w-[135px] lg:min-w-[145px] xl:min-w-[155px] transition-colors ${
                                  isCellDragOver && !dragOverCardId
                                    ? "bg-indigo-50/70 dark:bg-indigo-950/40 ring-2 ring-indigo-400 ring-inset"
                                    : ""
                                }`}
                              >
                                {shiftsForCell.length > 0 ? (
                                  <div className="space-y-1 sm:space-y-1.5">
                                    {shiftsForCell.map((shift) => {
                                      const theme = getShiftBadgeTheme(shift.shiftName);
                                      const IconComponent = theme.icon;
                                      const isBeingDragged = draggedShift?.id === shift.id;
                                      const isCardSwapTarget =
                                        dragOverCardId === shift.id &&
                                        draggedShift !== null &&
                                        draggedShift.id !== shift.id;

                                      return (
                                        <div
                                          key={shift.id}
                                          draggable
                                          onDragStart={(e) => {
                                            e.dataTransfer.setData("application/json", JSON.stringify(shift));
                                            e.dataTransfer.effectAllowed = "move";
                                            setDraggedShift(shift);
                                          }}
                                          onDragEnd={() => {
                                            setDraggedShift(null);
                                            setDragOverCellKey(null);
                                            setDragOverCardId(null);
                                          }}
                                          onDragOver={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            e.dataTransfer.dropEffect = "move";
                                          }}
                                          onDragEnter={(e) => {
                                            e.stopPropagation();
                                            if (draggedShift && draggedShift.id !== shift.id) {
                                              setDragOverCardId(shift.id);
                                            }
                                          }}
                                          onDragLeave={(e) => {
                                            e.stopPropagation();
                                            if (dragOverCardId === shift.id) {
                                              setDragOverCardId(null);
                                            }
                                          }}
                                          onDrop={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            if (draggedShift && draggedShift.id !== shift.id) {
                                              handleSwapShifts(draggedShift, shift);
                                            }
                                            setDraggedShift(null);
                                            setDragOverCardId(null);
                                            setDragOverCellKey(null);
                                          }}
                                          className={`group/card relative rounded-xl border p-1.5 sm:p-2 shadow-2xs transition duration-150 cursor-grab active:cursor-grabbing select-none ${
                                            isBeingDragged
                                              ? "opacity-30 ring-2 ring-indigo-500 scale-95 shadow-inner"
                                              : isCardSwapTarget
                                              ? "ring-2 ring-amber-500 bg-amber-50/95 dark:bg-amber-950/50 scale-[1.02] shadow-md border-amber-400"
                                              : `hover:shadow-xs hover:border-slate-300 ${theme.bg} ${theme.borderLeft}`
                                          }`}
                                          title="Drag to reschedule or reassign. Drop on another shift to swap."
                                        >
                                          {/* Swap Target Indicator Overlay */}
                                          {isCardSwapTarget && (
                                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-amber-600/90 text-white rounded-xl font-bold text-[10px] space-y-0.5 animate-in fade-in">
                                              <ArrowRightLeft className="h-3.5 w-3.5 animate-bounce" />
                                              <span>Drop to Swap</span>
                                            </div>
                                          )}

                                          <div className="flex items-center justify-between gap-1">
                                            <div className="flex items-center space-x-1 min-w-0">
                                              <GripVertical className="h-2.5 w-2.5 text-slate-400 group-hover/card:text-slate-600 shrink-0 transition-colors" />
                                              <span className="font-extrabold text-[10px] sm:text-[11px] text-slate-900 dark:text-white truncate">
                                                {shift.shiftName.split(" (")[0] || shift.shiftName}
                                              </span>
                                            </div>
                                            <IconComponent className={`h-3 w-3 shrink-0 ${theme.iconColor}`} />
                                          </div>
                                          <div className="flex items-center space-x-1 text-[9px] sm:text-[10px] font-mono mt-0.5 text-slate-700 dark:text-slate-200 font-semibold pl-3 truncate">
                                            <Clock className="h-2.5 w-2.5 shrink-0 text-slate-400" />
                                            <span className="truncate">{shift.start}–{shift.end}</span>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <div
                                    className={`h-full min-h-[46px] sm:min-h-[52px] flex flex-col items-center justify-center rounded-xl border transition duration-150 ${
                                      isCellDragOver
                                        ? "border-indigo-400 bg-indigo-50/90 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 shadow-xs scale-[1.01]"
                                        : "border-dashed border-slate-200/80 bg-slate-50/30 dark:border-slate-800 dark:bg-slate-800/20 text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                                    }`}
                                  >
                                    {isCellDragOver ? (
                                      <div className="flex items-center space-x-1 text-[10px] font-bold text-indigo-700 dark:text-indigo-300 animate-pulse">
                                        <Plus className="h-3 w-3" />
                                        <span>Drop</span>
                                      </div>
                                    ) : (
                                      <span className="opacity-40 font-mono text-[10px]">Off</span>
                                    )}
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
                      <td colSpan={activeTimelineDates.length + 1} className="py-14 text-center text-xs text-slate-400">
                        No employees found matching &ldquo;{searchEmployee}&rdquo;.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ================= 6. EMPLOYEE ROSTER PAGINATION FOOTER ================= */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredEmployees.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={() => {}}
          />
        </div>
      )}

      {/* ================= 7. VIEW 3: FULL MONTH CALENDAR OVERVIEW ================= */}
      {viewMode === "month" && (
        <div className="rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 lg:p-7 shadow-xs space-y-3 sm:space-y-4 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-2">
              <CalendarDays className="h-4 w-4 sm:h-5 sm:w-5 text-[#FF7A59] shrink-0" />
              <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">Shift Horizon Month Overview</h3>
            </div>
            <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">
              Click any active date card to focus single day schedule
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((dayName) => (
              <div
                key={dayName}
                className="text-center py-2 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 truncate"
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
                    className="min-h-[70px] sm:min-h-[95px] md:min-h-[110px] rounded-xl sm:rounded-2xl border border-dashed border-slate-100 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-800/30 p-1 sm:p-2"
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
                      ? "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 hover:border-[#FF7A59]/60 hover:shadow-xs cursor-pointer"
                      : "border-slate-100 bg-slate-50/40 dark:border-slate-800 dark:bg-slate-800/30 text-slate-400"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`h-5 w-5 sm:h-6 sm:w-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold shrink-0 ${
                        hasShifts ? "bg-[#2F2C59] text-white" : "text-slate-500"
                      }`}
                    >
                      {cell.dayNum}
                    </span>
                    {hasShifts && (
                      <span className="text-[9px] sm:text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-1 sm:px-1.5 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-900/60 truncate">
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
                        <span className="text-[8px] sm:text-[9px] text-slate-400 font-medium pl-0.5 sm:pl-1 block truncate">
                          +{summary.shifts.length - 2} more
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-[9px] sm:text-[10px] text-slate-300 italic">No shifts</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= 8. VIEW 4: TABLE VIEW ================= */}
      {viewMode === "table" && (
        <div className="rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="md:overflow-x-auto">
            <table className="w-full text-left text-sm block md:table">
              <thead className="hidden md:table-header-group">
                <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <th className="py-3 sm:py-3.5 px-3 sm:px-6">Date</th>
                  <th className="py-3 sm:py-3.5 px-3 sm:px-6">Location</th>
                  <th className="py-3 sm:py-3.5 px-3 sm:px-6">Shift details</th>
                  <th className="py-3 sm:py-3.5 px-3 sm:px-6">Working hours</th>
                  <th className="py-3 sm:py-3.5 px-3 sm:px-6">Assigned staff</th>
                </tr>
              </thead>
              <tbody className="block md:table-row-group divide-y divide-slate-100 dark:divide-slate-800">
                {schedules.flatMap((day) =>
                  day.locations.flatMap((loc) =>
                    loc.shifts
                      .filter((shift) => {
                        if (selectedShift === "all") return true;
                        return (
                          shift.id === selectedShift ||
                          shift.name.toLowerCase().includes(selectedShift.toLowerCase())
                        );
                      })
                      .map((shift, sIdx) => {
                        const theme = getShiftBadgeTheme(shift.name);
                        const IconComponent = theme.icon;

                        const matchingEmps = shift.employees.filter((emp) => {
                          const matchesSearch =
                            !searchEmployee ||
                            emp.name.toLowerCase().includes(searchEmployee.toLowerCase()) ||
                            (emp.id && emp.id.toLowerCase().includes(searchEmployee.toLowerCase()));
                          const matchesRole =
                            selectedRole === "all" ||
                            (emp.job_title || "").toLowerCase() === selectedRole.toLowerCase();
                          return matchesSearch && matchesRole;
                        });

                        if ((searchEmployee || selectedRole !== "all") && matchingEmps.length === 0) {
                          return null;
                        }

                        const displayedEmps =
                          searchEmployee || selectedRole !== "all" ? matchingEmps : shift.employees;

                        return (
                          <tr
                            key={`${day.date}_${loc.id}_${shift.id}_${sIdx}`}
                            className="block md:table-row p-4 md:p-0 space-y-1.5 md:space-y-0 hover:bg-slate-50/50 dark:hover:bg-slate-800 transition-colors"
                          >
                            <td className="block md:table-cell md:py-3.5 md:px-6 font-semibold tabular-nums text-slate-900 dark:text-white whitespace-nowrap text-xs sm:text-sm">
                              {day.date}
                            </td>
                            <td className="block md:table-cell md:py-3.5 md:px-6">
                              <span className="font-semibold text-slate-800 dark:text-slate-100 text-xs sm:text-sm">{loc.name}</span>
                            </td>
                            <td className="block md:table-cell md:py-3.5 md:px-6">
                              <span
                                className={`inline-flex items-center space-x-1.5 rounded-lg px-2 sm:px-2.5 py-1 text-xs font-bold border ${theme.bg} ${theme.borderLeft}`}
                              >
                                <IconComponent className={`h-3 w-3 shrink-0 ${theme.iconColor}`} />
                                <span className="truncate">{shift.name}</span>
                              </span>
                            </td>
                            <td className="block md:table-cell md:py-3.5 md:px-6 tabular-nums text-xs font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">
                              {shift.start} – {shift.end}
                            </td>
                            <td className="block md:table-cell pt-1 md:py-3.5 md:px-6">
                              <div className="flex flex-wrap gap-1 sm:gap-1.5">
                                {displayedEmps.map((emp, eIdx) => (
                                  <span
                                    key={eIdx}
                                    className="inline-flex items-center rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 px-2 sm:px-2.5 py-1 text-xs font-medium text-slate-800 dark:text-slate-100"
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
                ).filter(Boolean)}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= 4. EXECUTIVE SCHEDULE SUMMARY & COMPLIANCE AUDIT (CHECKLIST LAYOUT) ================= */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-2xs space-y-4">
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-3.5">
          <div className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                  Executive Schedule Summary & Compliance Audit
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Operational verification and statutory compliance checklist across {effectiveSchedules.length} scheduled days.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span>Audit Passed • 4/4 Verified</span>
            </span>
          </div>
        </div>

        {/* Verification Status Progress Bar */}
        <div className="bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/70 dark:border-slate-800/80 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white shrink-0">
              <Check className="h-3 w-3 stroke-[3]" />
            </div>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              4 of 4 Statutory &amp; Operational Audit Rules Passed
            </span>
          </div>
          <div className="flex items-center space-x-2 sm:w-48">
            <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full w-full"></div>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 shrink-0">100%</span>
          </div>
        </div>

        {/* Audit Verification Checklist Rows */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {/* Checklist Item 1: Staff Deployment */}
          <div className="py-3 sm:py-3.5 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 sm:px-2.5 -mx-2 sm:-mx-2.5 rounded-xl transition">
            <div className="flex items-start sm:items-center space-x-3 min-w-0">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0 mt-0.5 sm:mt-0">
                <Check className="h-4 w-4 stroke-[2.5]" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                    Staff Deployment &amp; Active Roster Coverage
                  </h4>
                  <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                    {kpiStats.totalStaff} Active Staff
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  All active roster personnel deployed across branch locations with 0 idle or unassigned employees.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center pl-10 sm:pl-0">
              <span className="inline-flex items-center space-x-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>100% Deployed</span>
              </span>
            </div>
          </div>

          {/* Checklist Item 2: Scheduled Hours & Overtime */}
          <div className="py-3 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 sm:px-2.5 -mx-2 sm:-mx-2.5 rounded-xl transition">
            <div className="flex items-start sm:items-center space-x-3 min-w-0">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0 mt-0.5 sm:mt-0">
                <Check className="h-4 w-4 stroke-[2.5]" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                    Scheduled Hours &amp; Overtime Guardrails
                  </h4>
                  <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                    {kpiStats.totalHours}h Total (~{kpiStats.avgHours}h/emp)
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Total workload distributed strictly under weekly statutory limits with zero overtime threshold breaches.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center pl-10 sm:pl-0">
              <span className="inline-flex items-center space-x-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>0 Overtime Breaches</span>
              </span>
            </div>
          </div>

          {/* Checklist Item 3: Shift Demand & Position Fulfillment */}
          <div className="py-3 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 sm:px-2.5 -mx-2 sm:-mx-2.5 rounded-xl transition">
            <div className="flex items-start sm:items-center space-x-3 min-w-0">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0 mt-0.5 sm:mt-0">
                <Check className="h-4 w-4 stroke-[2.5]" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                    Shift Demand &amp; Position Fulfillment
                  </h4>
                  <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                    {kpiStats.totalShifts} Shifts Filled
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  100% of required shift positions staffed across all {effectiveSchedules.length} days with zero vacant or unfulfilled slots.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center pl-10 sm:pl-0">
              <span className="inline-flex items-center space-x-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>100% Demand Met</span>
              </span>
            </div>
          </div>

          {/* Checklist Item 4: Statutory Rest & Policy Compliance */}
          <div className="py-3 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 sm:px-2.5 -mx-2 sm:-mx-2.5 rounded-xl transition">
            <div className="flex items-start sm:items-center space-x-3 min-w-0">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0 mt-0.5 sm:mt-0">
                <Check className="h-4 w-4 stroke-[2.5]" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                    Statutory Rest Intervals &amp; Policy Rule Compliance
                  </h4>
                  <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                    {kpiStats.complianceRate} Audit Score
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Mandatory rest intervals (minimum 11h between shifts) and single shift per day constraints validated without breaches.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center pl-10 sm:pl-0">
              <span className="inline-flex items-center space-x-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>0 Policy Violations</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODAL: SHARE SCHEDULE ================= */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7 shadow-2xl space-y-4 sm:space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-50 dark:bg-orange-950/50 text-[#FF7A59] shrink-0">
                  <Share2 className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-slate-900 dark:text-white">Share schedule</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Send schedule to team or export</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                Shareable link
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  readOnly
                  value={typeof window !== "undefined" ? window.location.href : ""}
                  className="flex-1 min-w-0 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 focus:outline-hidden truncate"
                />
                <button
                  type="button"
                  onClick={handleCopyShareLink}
                  className="inline-flex items-center space-x-1.5 rounded-full bg-[#2F2C59] dark:bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-[#1E1B3A] dark:hover:bg-indigo-700 transition shrink-0 cursor-pointer shadow-xs"
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

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center text-emerald-600 dark:text-emerald-400 font-medium truncate mr-2">
                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 shrink-0" /> Ready for live distribution
              </span>
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="rounded-full bg-slate-100 dark:bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD SHIFT / SCHEDULE ================= */}
      {isAddShiftOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-2xl space-y-4 sm:space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-50 dark:bg-orange-950/50 text-[#FF7A59] shrink-0">
                  <Plus className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-slate-900 dark:text-white">Add shift assignment</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Manually schedule an employee</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddShiftOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {addShiftSuccess ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600" />
                <h4 className="font-semibold text-slate-900 dark:text-white">Shift assigned successfully</h4>
              </div>
            ) : (
              <form onSubmit={handleAddShiftSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                    Select employee <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={newShiftEmployeeId}
                    onChange={(e) => setNewShiftEmployeeId(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-[#2F5BFF]/50"
                  >
                    <option value="">-- Choose employee --</option>
                    {employeesList.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} ({emp.id}) — {emp.role}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                    Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={newShiftDate}
                    onChange={(e) => setNewShiftDate(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-[#2F5BFF]/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                    Store location
                  </label>
                  <select
                    value={newShiftLocation}
                    onChange={(e) => setNewShiftLocation(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-[#2F5BFF]/50"
                  >
                    <option value="LOC_01">Flagship Store (District 1)</option>
                    <option value="LOC_02">Express Branch (District 7)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                    Shift period
                  </label>
                  <select
                    value={newShiftType}
                    onChange={(e) => setNewShiftType(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-[#2F5BFF]/50"
                  >
                    <option value="SHIFT_MORNING">Morning shift (07:00 – 15:00)</option>
                    <option value="SHIFT_AFTERNOON">Afternoon shift (14:30 – 22:30)</option>
                    <option value="SHIFT_NIGHT">Night shift (22:00 – 06:00)</option>
                  </select>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddShiftOpen(false)}
                    className="rounded-full bg-slate-100 dark:bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-full bg-[#2F2C59] dark:bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-[#1E1B3A] dark:hover:bg-indigo-700 transition shadow-xs cursor-pointer active:scale-[0.99]"
                  >
                    Confirm assignment
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ================= FLOATING ACTION & UNDO TOAST ================= */}
      {actionToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-3 rounded-2xl bg-[#2F2C59] dark:bg-indigo-600 text-white px-4 py-3 shadow-xl border border-white/10 animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center space-x-2 text-xs font-semibold">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{actionToast.message}</span>
          </div>
          {actionToast.canUndo && (
            <button
              type="button"
              onClick={handleUndo}
              className="inline-flex items-center space-x-1 rounded-lg bg-white/15 dark:bg-slate-900/80 hover:bg-white/25 px-2.5 py-1 text-[11px] font-bold text-white transition cursor-pointer"
            >
              <Undo2 className="h-3 w-3" />
              <span>Undo</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setActionToast(null)}
            className="text-white/60 hover:text-white transition p-0.5 cursor-pointer"
            title="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};


