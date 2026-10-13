"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Sun,
  Sunset,
  Moon,
  Users,
  Clock,
  CheckCircle2,
  Filter,
  X,
  UserCheck,
  Building2,
  Download,
  AlertCircle,
  Plus,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

interface ShiftAssignment {
  id: string;
  name: string;
  role: string;
  avatar: string;
  isLead?: boolean;
}

interface CalendarShift {
  id: string;
  shiftType: "morning" | "afternoon" | "night";
  name: string;
  time: string;
  requiredStaff: number;
  staff: ShiftAssignment[];
}

interface DaySchedule {
  dayName: string;
  dateStr: string;
  dayNum: number;
  isToday: boolean;
  shifts: {
    morning: CalendarShift;
    afternoon: CalendarShift;
    night: CalendarShift;
  };
}

const WEEK_DATA: DaySchedule[] = [
  {
    dayName: "Mon",
    dateStr: "Oct 12",
    dayNum: 12,
    isToday: false,
    shifts: {
      morning: {
        id: "m-12",
        shiftType: "morning",
        name: "Morning Shift",
        time: "07:00 – 15:00",
        requiredStaff: 6,
        staff: [
          { id: "1", name: "Nguyễn Văn An", role: "Supervisor", avatar: "A", isLead: true },
          { id: "2", name: "Trần Thị Bình", role: "Barista", avatar: "B" },
          { id: "3", name: "Lê Hoàng Long", role: "Barista", avatar: "L" },
          { id: "4", name: "Phạm Thảo Vy", role: "Cashier", avatar: "V" },
          { id: "5", name: "Vũ Hải Đăng", role: "Kitchen", avatar: "Đ" },
          { id: "6", name: "Đỗ Minh Khang", role: "Cashier", avatar: "K" },
        ],
      },
      afternoon: {
        id: "a-12",
        shiftType: "afternoon",
        name: "Afternoon Shift",
        time: "14:30 – 22:30",
        requiredStaff: 6,
        staff: [
          { id: "7", name: "Lý Khánh Nam", role: "Supervisor", avatar: "N", isLead: true },
          { id: "8", name: "Hoàng Gia Huy", role: "Barista", avatar: "H" },
          { id: "9", name: "Bùi Tuyết Mai", role: "Barista", avatar: "M" },
          { id: "10", name: "Dương Quốc Bảo", role: "Cashier", avatar: "B" },
          { id: "11", name: "Trịnh Thùy Linh", role: "Cashier", avatar: "L" },
          { id: "12", name: "Hồ Thanh Tùng", role: "Kitchen", avatar: "T" },
        ],
      },
      night: {
        id: "n-12",
        shiftType: "night",
        name: "Night Shift",
        time: "22:00 – 06:00",
        requiredStaff: 4,
        staff: [
          { id: "13", name: "Vũ Tuấn Kiệt", role: "Supervisor", avatar: "K", isLead: true },
          { id: "14", name: "Lê Nhật Quang", role: "Barista", avatar: "Q" },
          { id: "15", name: "Đặng Hữu Phúc", role: "Kitchen", avatar: "P" },
          { id: "16", name: "Phan Văn Hậu", role: "Cashier", avatar: "H" },
        ],
      },
    },
  },
  {
    dayName: "Tue",
    dateStr: "Oct 13",
    dayNum: 13,
    isToday: true,
    shifts: {
      morning: {
        id: "m-13",
        shiftType: "morning",
        name: "Morning Shift",
        time: "07:00 – 15:00",
        requiredStaff: 6,
        staff: [
          { id: "1", name: "Nguyễn Văn An", role: "Supervisor", avatar: "A", isLead: true },
          { id: "2", name: "Trần Thị Bình", role: "Barista", avatar: "B" },
          { id: "17", name: "Cao Đình Trọng", role: "Barista", avatar: "T" },
          { id: "4", name: "Phạm Thảo Vy", role: "Cashier", avatar: "V" },
          { id: "18", name: "Võ Kim Ngân", role: "Cashier", avatar: "N" },
          { id: "5", name: "Vũ Hải Đăng", role: "Kitchen", avatar: "Đ" },
        ],
      },
      afternoon: {
        id: "a-13",
        shiftType: "afternoon",
        name: "Afternoon Shift",
        time: "14:30 – 22:30",
        requiredStaff: 6,
        staff: [
          { id: "7", name: "Lý Khánh Nam", role: "Supervisor", avatar: "N", isLead: true },
          { id: "8", name: "Hoàng Gia Huy", role: "Barista", avatar: "H" },
          { id: "19", name: "Ngô Bá Khá", role: "Barista", avatar: "K" },
          { id: "10", name: "Dương Quốc Bảo", role: "Cashier", avatar: "B" },
          { id: "20", name: "Mai Hồng Ngọc", role: "Cashier", avatar: "N" },
          { id: "12", name: "Hồ Thanh Tùng", role: "Kitchen", avatar: "T" },
        ],
      },
      night: {
        id: "n-13",
        shiftType: "night",
        name: "Night Shift",
        time: "22:00 – 06:00",
        requiredStaff: 4,
        staff: [
          { id: "13", name: "Vũ Tuấn Kiệt", role: "Supervisor", avatar: "K", isLead: true },
          { id: "14", name: "Lê Nhật Quang", role: "Barista", avatar: "Q" },
          { id: "21", name: "Lưu Trọng Hiếu", role: "Kitchen", avatar: "H" },
          { id: "16", name: "Phan Văn Hậu", role: "Cashier", avatar: "H" },
        ],
      },
    },
  },
  {
    dayName: "Wed",
    dateStr: "Oct 14",
    dayNum: 14,
    isToday: false,
    shifts: {
      morning: {
        id: "m-14",
        shiftType: "morning",
        name: "Morning Shift",
        time: "07:00 – 15:00",
        requiredStaff: 7,
        staff: [
          { id: "7", name: "Lý Khánh Nam", role: "Supervisor", avatar: "N", isLead: true },
          { id: "2", name: "Trần Thị Bình", role: "Barista", avatar: "B" },
          { id: "3", name: "Lê Hoàng Long", role: "Barista", avatar: "L" },
          { id: "17", name: "Cao Đình Trọng", role: "Barista", avatar: "T" },
          { id: "4", name: "Phạm Thảo Vy", role: "Cashier", avatar: "V" },
          { id: "5", name: "Vũ Hải Đăng", role: "Kitchen", avatar: "Đ" },
          { id: "18", name: "Võ Kim Ngân", role: "Cashier", avatar: "N" },
        ],
      },
      afternoon: {
        id: "a-14",
        shiftType: "afternoon",
        name: "Afternoon Shift",
        time: "14:30 – 22:30",
        requiredStaff: 7,
        staff: [
          { id: "1", name: "Nguyễn Văn An", role: "Supervisor", avatar: "A", isLead: true },
          { id: "8", name: "Hoàng Gia Huy", role: "Barista", avatar: "H" },
          { id: "9", name: "Bùi Tuyết Mai", role: "Barista", avatar: "M" },
          { id: "19", name: "Ngô Bá Khá", role: "Barista", avatar: "K" },
          { id: "10", name: "Dương Quốc Bảo", role: "Cashier", avatar: "B" },
          { id: "11", name: "Trịnh Thùy Linh", role: "Cashier", avatar: "L" },
          { id: "12", name: "Hồ Thanh Tùng", role: "Kitchen", avatar: "T" },
        ],
      },
      night: {
        id: "n-14",
        shiftType: "night",
        name: "Night Shift",
        time: "22:00 – 06:00",
        requiredStaff: 4,
        staff: [
          { id: "13", name: "Vũ Tuấn Kiệt", role: "Supervisor", avatar: "K", isLead: true },
          { id: "14", name: "Lê Nhật Quang", role: "Barista", avatar: "Q" },
          { id: "15", name: "Đặng Hữu Phúc", role: "Kitchen", avatar: "P" },
          { id: "16", name: "Phan Văn Hậu", role: "Cashier", avatar: "H" },
        ],
      },
    },
  },
  {
    dayName: "Thu",
    dateStr: "Oct 15",
    dayNum: 15,
    isToday: false,
    shifts: {
      morning: {
        id: "m-15",
        shiftType: "morning",
        name: "Morning Shift",
        time: "07:00 – 15:00",
        requiredStaff: 6,
        staff: [
          { id: "1", name: "Nguyễn Văn An", role: "Supervisor", avatar: "A", isLead: true },
          { id: "3", name: "Lê Hoàng Long", role: "Barista", avatar: "L" },
          { id: "17", name: "Cao Đình Trọng", role: "Barista", avatar: "T" },
          { id: "4", name: "Phạm Thảo Vy", role: "Cashier", avatar: "V" },
          { id: "6", name: "Đỗ Minh Khang", role: "Cashier", avatar: "K" },
          { id: "5", name: "Vũ Hải Đăng", role: "Kitchen", avatar: "Đ" },
        ],
      },
      afternoon: {
        id: "a-15",
        shiftType: "afternoon",
        name: "Afternoon Shift",
        time: "14:30 – 22:30",
        requiredStaff: 6,
        staff: [
          { id: "7", name: "Lý Khánh Nam", role: "Supervisor", avatar: "N", isLead: true },
          { id: "8", name: "Hoàng Gia Huy", role: "Barista", avatar: "H" },
          { id: "9", name: "Bùi Tuyết Mai", role: "Barista", avatar: "M" },
          { id: "11", name: "Trịnh Thùy Linh", role: "Cashier", avatar: "L" },
          { id: "20", name: "Mai Hồng Ngọc", role: "Cashier", avatar: "N" },
          { id: "12", name: "Hồ Thanh Tùng", role: "Kitchen", avatar: "T" },
        ],
      },
      night: {
        id: "n-15",
        shiftType: "night",
        name: "Night Shift",
        time: "22:00 – 06:00",
        requiredStaff: 4,
        staff: [
          { id: "13", name: "Vũ Tuấn Kiệt", role: "Supervisor", avatar: "K", isLead: true },
          { id: "14", name: "Lê Nhật Quang", role: "Barista", avatar: "Q" },
          { id: "21", name: "Lưu Trọng Hiếu", role: "Kitchen", avatar: "H" },
          { id: "16", name: "Phan Văn Hậu", role: "Cashier", avatar: "H" },
        ],
      },
    },
  },
  {
    dayName: "Fri",
    dateStr: "Oct 16",
    dayNum: 16,
    isToday: false,
    shifts: {
      morning: {
        id: "m-16",
        shiftType: "morning",
        name: "Morning Shift",
        time: "07:00 – 15:00",
        requiredStaff: 8,
        staff: [
          { id: "1", name: "Nguyễn Văn An", role: "Supervisor", avatar: "A", isLead: true },
          { id: "2", name: "Trần Thị Bình", role: "Barista", avatar: "B" },
          { id: "3", name: "Lê Hoàng Long", role: "Barista", avatar: "L" },
          { id: "17", name: "Cao Đình Trọng", role: "Barista", avatar: "T" },
          { id: "4", name: "Phạm Thảo Vy", role: "Cashier", avatar: "V" },
          { id: "18", name: "Võ Kim Ngân", role: "Cashier", avatar: "N" },
          { id: "5", name: "Vũ Hải Đăng", role: "Kitchen", avatar: "Đ" },
          { id: "6", name: "Đỗ Minh Khang", role: "Cashier", avatar: "K" },
        ],
      },
      afternoon: {
        id: "a-16",
        shiftType: "afternoon",
        name: "Afternoon Shift",
        time: "14:30 – 22:30",
        requiredStaff: 8,
        staff: [
          { id: "7", name: "Lý Khánh Nam", role: "Supervisor", avatar: "N", isLead: true },
          { id: "8", name: "Hoàng Gia Huy", role: "Barista", avatar: "H" },
          { id: "9", name: "Bùi Tuyết Mai", role: "Barista", avatar: "M" },
          { id: "19", name: "Ngô Bá Khá", role: "Barista", avatar: "K" },
          { id: "10", name: "Dương Quốc Bảo", role: "Cashier", avatar: "B" },
          { id: "11", name: "Trịnh Thùy Linh", role: "Cashier", avatar: "L" },
          { id: "20", name: "Mai Hồng Ngọc", role: "Cashier", avatar: "N" },
          { id: "12", name: "Hồ Thanh Tùng", role: "Kitchen", avatar: "T" },
        ],
      },
      night: {
        id: "n-16",
        shiftType: "night",
        name: "Night Shift",
        time: "22:00 – 06:00",
        requiredStaff: 4,
        staff: [
          { id: "13", name: "Vũ Tuấn Kiệt", role: "Supervisor", avatar: "K", isLead: true },
          { id: "14", name: "Lê Nhật Quang", role: "Barista", avatar: "Q" },
          { id: "15", name: "Đặng Hữu Phúc", role: "Kitchen", avatar: "P" },
          { id: "21", name: "Lưu Trọng Hiếu", role: "Kitchen", avatar: "H" },
        ],
      },
    },
  },
  {
    dayName: "Sat",
    dateStr: "Oct 17",
    dayNum: 17,
    isToday: false,
    shifts: {
      morning: {
        id: "m-17",
        shiftType: "morning",
        name: "Morning Shift",
        time: "07:00 – 15:00",
        requiredStaff: 9,
        staff: [
          { id: "1", name: "Nguyễn Văn An", role: "Supervisor", avatar: "A", isLead: true },
          { id: "2", name: "Trần Thị Bình", role: "Barista", avatar: "B" },
          { id: "3", name: "Lê Hoàng Long", role: "Barista", avatar: "L" },
          { id: "8", name: "Hoàng Gia Huy", role: "Barista", avatar: "H" },
          { id: "4", name: "Phạm Thảo Vy", role: "Cashier", avatar: "V" },
          { id: "10", name: "Dương Quốc Bảo", role: "Cashier", avatar: "B" },
          { id: "5", name: "Vũ Hải Đăng", role: "Kitchen", avatar: "Đ" },
          { id: "12", name: "Hồ Thanh Tùng", role: "Kitchen", avatar: "T" },
          { id: "6", name: "Đỗ Minh Khang", role: "Cashier", avatar: "K" },
        ],
      },
      afternoon: {
        id: "a-17",
        shiftType: "afternoon",
        name: "Afternoon Shift",
        time: "14:30 – 22:30",
        requiredStaff: 9,
        staff: [
          { id: "7", name: "Lý Khánh Nam", role: "Supervisor", avatar: "N", isLead: true },
          { id: "9", name: "Bùi Tuyết Mai", role: "Barista", avatar: "M" },
          { id: "17", name: "Cao Đình Trọng", role: "Barista", avatar: "T" },
          { id: "19", name: "Ngô Bá Khá", role: "Barista", avatar: "K" },
          { id: "11", name: "Trịnh Thùy Linh", role: "Cashier", avatar: "L" },
          { id: "18", name: "Võ Kim Ngân", role: "Cashier", avatar: "N" },
          { id: "20", name: "Mai Hồng Ngọc", role: "Cashier", avatar: "N" },
          { id: "15", name: "Đặng Hữu Phúc", role: "Kitchen", avatar: "P" },
          { id: "21", name: "Lưu Trọng Hiếu", role: "Kitchen", avatar: "H" },
        ],
      },
      night: {
        id: "n-17",
        shiftType: "night",
        name: "Night Shift",
        time: "22:00 – 06:00",
        requiredStaff: 4,
        staff: [
          { id: "13", name: "Vũ Tuấn Kiệt", role: "Supervisor", avatar: "K", isLead: true },
          { id: "14", name: "Lê Nhật Quang", role: "Barista", avatar: "Q" },
          { id: "16", name: "Phan Văn Hậu", role: "Cashier", avatar: "H" },
          { id: "5", name: "Vũ Hải Đăng", role: "Kitchen", avatar: "Đ" },
        ],
      },
    },
  },
  {
    dayName: "Sun",
    dateStr: "Oct 18",
    dayNum: 18,
    isToday: false,
    shifts: {
      morning: {
        id: "m-18",
        shiftType: "morning",
        name: "Morning Shift",
        time: "07:00 – 15:00",
        requiredStaff: 5,
        staff: [
          { id: "1", name: "Nguyễn Văn An", role: "Supervisor", avatar: "A", isLead: true },
          { id: "2", name: "Trần Thị Bình", role: "Barista", avatar: "B" },
          { id: "4", name: "Phạm Thảo Vy", role: "Cashier", avatar: "V" },
          { id: "5", name: "Vũ Hải Đăng", role: "Kitchen", avatar: "Đ" },
          { id: "6", name: "Đỗ Minh Khang", role: "Cashier", avatar: "K" },
        ],
      },
      afternoon: {
        id: "a-18",
        shiftType: "afternoon",
        name: "Afternoon Shift",
        time: "14:30 – 22:30",
        requiredStaff: 5,
        staff: [
          { id: "7", name: "Lý Khánh Nam", role: "Supervisor", avatar: "N", isLead: true },
          { id: "8", name: "Hoàng Gia Huy", role: "Barista", avatar: "H" },
          { id: "10", name: "Dương Quốc Bảo", role: "Cashier", avatar: "B" },
          { id: "11", name: "Trịnh Thùy Linh", role: "Cashier", avatar: "L" },
          { id: "12", name: "Hồ Thanh Tùng", role: "Kitchen", avatar: "T" },
        ],
      },
      night: {
        id: "n-18",
        shiftType: "night",
        name: "Night Shift",
        time: "22:00 – 06:00",
        requiredStaff: 4,
        staff: [
          { id: "13", name: "Vũ Tuấn Kiệt", role: "Supervisor", avatar: "K", isLead: true },
          { id: "14", name: "Lê Nhật Quang", role: "Barista", avatar: "Q" },
          { id: "15", name: "Đặng Hữu Phúc", role: "Kitchen", avatar: "P" },
          { id: "16", name: "Phan Văn Hậu", role: "Cashier", avatar: "H" },
        ],
      },
    },
  },
];

export default function CalendarPage() {
  const [viewMode, setViewMode] = useState<"week" | "month">("week");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedDayIndex, setSelectedDayIndex] = useState(1); // Default to Tue (today)
  const [inspectShift, setInspectShift] = useState<{
    day: DaySchedule;
    shift: CalendarShift;
  } | null>(null);

  const roles = ["all", "Supervisor", "Barista", "Cashier", "Kitchen"];

  const filteredWeek = useMemo(() => {
    if (selectedRole === "all") return WEEK_DATA;
    return WEEK_DATA.map((day) => ({
      ...day,
      shifts: {
        morning: {
          ...day.shifts.morning,
          staff: day.shifts.morning.staff.filter((s) => s.role === selectedRole),
        },
        afternoon: {
          ...day.shifts.afternoon,
          staff: day.shifts.afternoon.staff.filter((s) => s.role === selectedRole),
        },
        night: {
          ...day.shifts.night,
          staff: day.shifts.night.staff.filter((s) => s.role === selectedRole),
        },
      },
    }));
  }, [selectedRole]);

  const activeMobileDay = filteredWeek[selectedDayIndex];

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* ================= 1. CALENDAR TOOLBAR ================= */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Week 42 · Oct 12 – Oct 18, 2026
              </p>
              <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                100% covered
              </span>
            </div>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-[28px]">
              Roster calendar
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Week navigation pill */}
            <div className="inline-flex items-center rounded-full border border-slate-200/80 bg-white dark:bg-slate-900 dark:border-slate-800 p-1 shadow-xs">
              <button
                type="button"
                className="p-1 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                title="Previous week"
                aria-label="Previous week"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-3 text-xs font-semibold tabular-nums text-slate-700 dark:text-slate-300">
                Oct 12 – 18
              </span>
              <button
                type="button"
                className="p-1 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                title="Next week"
                aria-label="Next week"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* View Mode Segmented Control */}
            <div className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setViewMode("week")}
                className={`px-3 py-1 rounded-full transition cursor-pointer ${
                  viewMode === "week"
                    ? "bg-[#2F2C59] text-white dark:bg-indigo-600 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Week
              </button>
              <button
                type="button"
                onClick={() => setViewMode("month")}
                className={`px-3 py-1 rounded-full transition cursor-pointer ${
                  viewMode === "month"
                    ? "bg-[#2F2C59] text-white dark:bg-indigo-600 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Month
              </button>
            </div>

            {/* AI Generator Action Button */}
            <Link
              href="/dashboard/ai-studio"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#2F2C59] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#1E1B3A] active:scale-[0.99] dark:bg-indigo-600 dark:hover:bg-indigo-700 cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Generate shifts</span>
            </Link>
          </div>
        </header>

        {/* ================= 2. ROLE FILTER STRIP ================= */}
        <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1 text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-400 text-xs font-medium mr-1 flex items-center">
              <Filter className="h-3.5 w-3.5 mr-1" /> Role:
            </span>
            {roles.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setSelectedRole(r)}
                className={`px-3 py-1.5 rounded-full font-semibold transition cursor-pointer shrink-0 text-xs ${
                  selectedRole === r
                    ? "bg-[#2F2C59] text-white dark:bg-indigo-600 shadow-xs"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                {r === "all" ? "All roles (28)" : r}
              </button>
            ))}
          </div>

          <div className="hidden sm:flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400 shrink-0">
            <span className="inline-flex items-center space-x-1.5">
              <span className="h-2 w-2 rounded-full bg-[#2F5BFF]"></span>
              <span>Morning</span>
            </span>
            <span className="inline-flex items-center space-x-1.5">
              <span className="h-2 w-2 rounded-full bg-[#FF7A59]"></span>
              <span>Afternoon</span>
            </span>
            <span className="inline-flex items-center space-x-1.5">
              <span className="h-2 w-2 rounded-full bg-[#2F2C59] dark:bg-indigo-400"></span>
              <span>Night</span>
            </span>
          </div>
        </div>

        {/* ================= 3. MOBILE DAY PICKER TABS (< md) ================= */}
        <div className="md:hidden flex items-center space-x-1 overflow-x-auto pb-1">
          {filteredWeek.map((day, idx) => (
            <button
              key={day.dayName}
              type="button"
              onClick={() => setSelectedDayIndex(idx)}
              className={`flex-1 min-w-[46px] py-2 px-1 rounded-2xl flex flex-col items-center justify-center transition border ${
                selectedDayIndex === idx
                  ? "bg-[#2F2C59] text-white dark:bg-indigo-600 border-transparent shadow-xs"
                  : day.isToday
                  ? "bg-indigo-50 dark:bg-indigo-950/40 text-[#2F2C59] dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
                  : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-800"
              }`}
            >
              <span className="text-[11px] font-medium">{day.dayName}</span>
              <span className="text-sm font-semibold tabular-nums">{day.dayNum}</span>
              {day.isToday && (
                <span className="h-1 w-1 rounded-full bg-[#FF7A59] mt-0.5"></span>
              )}
            </button>
          ))}
        </div>

        {/* ================= 4. MOBILE SCHEDULE CARD STACK (< md) ================= */}
        <div className="md:hidden space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              {activeMobileDay.dayName}, {activeMobileDay.dateStr}
              {activeMobileDay.isToday && (
                <span className="ml-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                  Today
                </span>
              )}
            </span>
            <span className="text-xs tabular-nums text-slate-500 dark:text-slate-400">
              {activeMobileDay.shifts.morning.staff.length +
                activeMobileDay.shifts.afternoon.staff.length +
                activeMobileDay.shifts.night.staff.length}{" "}
              staff assigned
            </span>
          </div>

          {(["morning", "afternoon", "night"] as const).map((sType) => {
            const shift = activeMobileDay.shifts[sType];
            const isMorning = sType === "morning";
            const isAfternoon = sType === "afternoon";
            const Icon = isMorning ? Sun : isAfternoon ? Sunset : Moon;
            const accentBorder = isMorning
              ? "border-l-[3.5px] border-l-[#2F5BFF] bg-blue-50/40 dark:bg-blue-950/20"
              : isAfternoon
              ? "border-l-[3.5px] border-l-[#FF7A59] bg-orange-50/40 dark:bg-orange-950/20"
              : "border-l-[3.5px] border-l-[#2F2C59] dark:border-l-indigo-400 bg-indigo-50/40 dark:bg-indigo-950/20";

            return (
              <div
                key={shift.id}
                onClick={() => setInspectShift({ day: activeMobileDay, shift })}
                className={`rounded-3xl border border-slate-200/70 dark:border-slate-800 p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:border-slate-300 dark:hover:border-slate-700 transition cursor-pointer ${accentBorder}`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center space-x-2">
                    <Icon
                      className={`h-4 w-4 ${
                        isMorning
                          ? "text-[#2F5BFF]"
                          : isAfternoon
                          ? "text-[#FF7A59]"
                          : "text-[#2F2C59] dark:text-indigo-400"
                      }`}
                    />
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">
                      {shift.name}
                    </span>
                  </div>
                  <span className="text-xs tabular-nums text-slate-500 dark:text-slate-400">
                    {shift.time}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {shift.staff.map((s) => (
                    <span
                      key={s.id}
                      className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        s.isLead
                          ? "bg-indigo-50 dark:bg-indigo-950/60 text-[#2F2C59] dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 font-semibold"
                          : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200/70 dark:border-slate-700/60"
                      }`}
                    >
                      <span>{s.name}</span>
                      {s.isLead && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#2F2C59] text-white dark:bg-indigo-600">
                          Lead
                        </span>
                      )}
                    </span>
                  ))}
                  {shift.staff.length === 0 && (
                    <span className="text-xs text-slate-400 italic">No staff in selected filter</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= 5. DESKTOP / TABLET WEEK MATRIX (>= md) ================= */}
        {viewMode === "week" && (
          <div className="hidden md:block rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[850px]">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
                    <th className="py-3 px-4 w-32 font-medium text-xs text-slate-500 dark:text-slate-400">
                      Shift slot
                    </th>
                    {filteredWeek.map((day) => (
                      <th
                        key={day.dayName}
                        className={`py-3 px-3 text-center transition ${
                          day.isToday ? "bg-indigo-50/40 dark:bg-indigo-950/30" : ""
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            {day.dayName}
                          </span>
                          <span
                            className={`text-sm font-semibold tabular-nums mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full ${
                              day.isToday
                                ? "bg-[#2F2C59] text-white dark:bg-indigo-600 shadow-xs"
                                : "text-slate-900 dark:text-white"
                            }`}
                          >
                            {day.dayNum}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {/* Row 1: Morning Shift */}
                  <tr>
                    <td className="py-3.5 px-4 align-top bg-slate-50/40 dark:bg-slate-800/20 border-r border-slate-100 dark:border-slate-800">
                      <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#2F5BFF]">
                        <Sun className="h-3.5 w-3.5 shrink-0" />
                        <span>Morning</span>
                      </div>
                      <div className="text-[11px] tabular-nums text-slate-400 mt-0.5">
                        07:00 – 15:00
                      </div>
                    </td>
                    {filteredWeek.map((day) => {
                      const shift = day.shifts.morning;
                      return (
                        <td
                          key={day.dayName}
                          onClick={() => setInspectShift({ day, shift })}
                          className={`p-2 align-top border-r last:border-r-0 border-slate-100 dark:border-slate-800 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition cursor-pointer ${
                            day.isToday ? "bg-indigo-50/20 dark:bg-indigo-950/20" : ""
                          }`}
                        >
                          <div className="space-y-1">
                            {shift.staff.map((s) => (
                              <div
                                key={s.id}
                                className={`flex items-center justify-between px-2 py-1 rounded-md text-[11px] ${
                                  s.isLead
                                    ? "bg-blue-100/70 dark:bg-blue-950/60 text-[#2F5BFF] dark:text-blue-300 font-semibold border border-blue-200/60 dark:border-blue-900/50"
                                    : "bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200/60"
                                }`}
                              >
                                <span className="truncate">{s.name}</span>
                                {s.isLead && (
                                  <span className="text-[10px] font-semibold ml-1">L</span>
                                )}
                              </div>
                            ))}
                            {shift.staff.length === 0 && (
                              <div className="text-[11px] text-slate-400 italic py-1 text-center">
                                -
                              </div>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Row 2: Afternoon Shift */}
                  <tr>
                    <td className="py-3.5 px-4 align-top bg-slate-50/40 dark:bg-slate-800/20 border-r border-slate-100 dark:border-slate-800">
                      <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#FF7A59]">
                        <Sunset className="h-3.5 w-3.5 shrink-0" />
                        <span>Afternoon</span>
                      </div>
                      <div className="text-[11px] tabular-nums text-slate-400 mt-0.5">
                        14:30 – 22:30
                      </div>
                    </td>
                    {filteredWeek.map((day) => {
                      const shift = day.shifts.afternoon;
                      return (
                        <td
                          key={day.dayName}
                          onClick={() => setInspectShift({ day, shift })}
                          className={`p-2 align-top border-r last:border-r-0 border-slate-100 dark:border-slate-800 hover:bg-orange-50/40 dark:hover:bg-orange-950/20 transition cursor-pointer ${
                            day.isToday ? "bg-indigo-50/20 dark:bg-indigo-950/20" : ""
                          }`}
                        >
                          <div className="space-y-1">
                            {shift.staff.map((s) => (
                              <div
                                key={s.id}
                                className={`flex items-center justify-between px-2 py-1 rounded-md text-[11px] ${
                                  s.isLead
                                    ? "bg-orange-100/70 dark:bg-orange-950/60 text-[#FF7A59] dark:text-orange-300 font-semibold border border-orange-200/60 dark:border-orange-900/50"
                                    : "bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200/60"
                                }`}
                              >
                                <span className="truncate">{s.name}</span>
                                {s.isLead && (
                                  <span className="text-[10px] font-semibold ml-1">L</span>
                                )}
                              </div>
                            ))}
                            {shift.staff.length === 0 && (
                              <div className="text-[11px] text-slate-400 italic py-1 text-center">
                                -
                              </div>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Row 3: Night Shift */}
                  <tr>
                    <td className="py-3.5 px-4 align-top bg-slate-50/40 dark:bg-slate-800/20 border-r border-slate-100 dark:border-slate-800">
                      <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#2F2C59] dark:text-indigo-400">
                        <Moon className="h-3.5 w-3.5 shrink-0" />
                        <span>Night</span>
                      </div>
                      <div className="text-[11px] tabular-nums text-slate-400 mt-0.5">
                        22:00 – 06:00
                      </div>
                    </td>
                    {filteredWeek.map((day) => {
                      const shift = day.shifts.night;
                      return (
                        <td
                          key={day.dayName}
                          onClick={() => setInspectShift({ day, shift })}
                          className={`p-2 align-top border-r last:border-r-0 border-slate-100 dark:border-slate-800 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 transition cursor-pointer ${
                            day.isToday ? "bg-indigo-50/20 dark:bg-indigo-950/20" : ""
                          }`}
                        >
                          <div className="space-y-1">
                            {shift.staff.map((s) => (
                              <div
                                key={s.id}
                                className={`flex items-center justify-between px-2 py-1 rounded-md text-[11px] ${
                                  s.isLead
                                    ? "bg-indigo-100/70 dark:bg-indigo-950/60 text-[#2F2C59] dark:text-indigo-300 font-semibold border border-indigo-200/60 dark:border-indigo-900/50"
                                    : "bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200/60"
                                }`}
                              >
                                <span className="truncate">{s.name}</span>
                                {s.isLead && (
                                  <span className="text-[10px] font-semibold ml-1">L</span>
                                )}
                              </div>
                            ))}
                            {shift.staff.length === 0 && (
                              <div className="text-[11px] text-slate-400 italic py-1 text-center">
                                -
                              </div>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= 6. MONTH VIEW GRID ================= */}
        {viewMode === "month" && (
          <div className="rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] space-y-3">
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-100 dark:border-slate-800">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => {
                const isSelectedWeek = d >= 12 && d <= 18;
                const isToday = d === 13;
                return (
                  <div
                    key={d}
                    className={`min-h-[72px] sm:min-h-[88px] p-2 rounded-2xl border transition flex flex-col justify-between ${
                      isToday
                        ? "border-[#2F2C59] dark:border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/30"
                        : isSelectedWeek
                        ? "border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30"
                        : "border-slate-100 dark:border-slate-800/60 bg-transparent opacity-60"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-semibold tabular-nums ${
                          isToday
                            ? "h-5 w-5 rounded-full bg-[#2F2C59] dark:bg-indigo-600 text-white flex items-center justify-center text-[11px]"
                            : "text-slate-800 dark:text-slate-200"
                        }`}
                      >
                        {d}
                      </span>
                      {isSelectedWeek && (
                        <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                          3 shifts
                        </span>
                      )}
                    </div>

                    {isSelectedWeek ? (
                      <div className="flex items-center space-x-1 mt-1">
                        <span className="h-2 w-2 rounded-full bg-[#2F5BFF]" title="Morning: 6 staff"></span>
                        <span className="h-2 w-2 rounded-full bg-[#FF7A59]" title="Afternoon: 6 staff"></span>
                        <span className="h-2 w-2 rounded-full bg-[#2F2C59] dark:bg-indigo-400" title="Night: 4 staff"></span>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-300 dark:text-slate-700">--</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= 7. SHIFT INSPECTOR MODAL ================= */}
        {inspectShift && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
              onClick={() => setInspectShift(null)}
            />

            <div className="relative z-50 w-full max-w-md rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4">
              <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {inspectShift.day.dayName}, {inspectShift.day.dateStr}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      Confirmed
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white mt-1">
                    {inspectShift.shift.name}
                  </h3>
                  <p className="text-xs tabular-nums text-slate-500 dark:text-slate-400 mt-0.5">
                    {inspectShift.shift.time} · {inspectShift.shift.staff.length} /{" "}
                    {inspectShift.shift.requiredStaff} assigned
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setInspectShift(null)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#2F5BFF]/50"
                  aria-label="Close dialog"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Roster list */}
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Assigned personnel
                </span>
                {inspectShift.shift.staff.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-2.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#2F2C59] dark:bg-indigo-600 text-white text-xs font-semibold">
                        {s.avatar}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-900 dark:text-white">
                          {s.name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {s.role}
                        </div>
                      </div>
                    </div>

                    {s.isLead ? (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-[#2F2C59] dark:text-indigo-300">
                        Shift leader
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 tabular-nums">8.0 hrs</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Footer actions */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setInspectShift(null)}
                  className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                >
                  Close
                </button>
                <Link
                  href="/dashboard/ai-studio"
                  className="rounded-full bg-[#2F2C59] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#1E1B3A] dark:bg-indigo-600 dark:hover:bg-indigo-700 cursor-pointer"
                >
                  Edit in AI Studio
                </Link>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
