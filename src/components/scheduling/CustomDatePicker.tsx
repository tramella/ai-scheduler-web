"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Sparkles,
  RotateCcw,
} from "lucide-react";

interface CustomDatePickerProps {
  mode: "week" | "day" | "month";
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
  singleDate?: string; // YYYY-MM-DD
  onDateChange: (result: { singleDate?: string; startDate?: string; endDate?: string }) => void;
  className?: string;
}

export function parseLocalDate(dateStr: string): Date {
  if (!dateStr) return new Date();
  const parts = dateStr.split("-").map(Number);
  if (parts.length === 3) {
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }
  return new Date(dateStr);
}

export function formatDateToYYYYMMDD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function CustomDatePicker({
  mode,
  startDate = "2026-10-05",
  endDate = "2026-10-09",
  singleDate = "2026-10-05",
  onDateChange,
  className = "",
}: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse initial view month from selected dates
  const initialDateStr = mode === "day" ? singleDate : startDate;
  const initialDateObj = useMemo(() => {
    try {
      const d = parseLocalDate(initialDateStr);
      return isNaN(d.getTime()) ? new Date(2026, 9, 1) : d;
    } catch {
      return new Date(2026, 9, 1);
    }
  }, [initialDateStr]);

  const [viewMonth, setViewMonth] = useState<Date>(
    new Date(initialDateObj.getFullYear(), initialDateObj.getMonth(), 1)
  );

  // Temporary selection state inside popover
  const [tempSingle, setTempSingle] = useState(singleDate);
  const [tempStart, setTempStart] = useState(startDate);
  const [tempEnd, setTempEnd] = useState(endDate);

  // Range selection step: "idle" | "selecting_end"
  const [rangeStep, setRangeStep] = useState<"idle" | "selecting_end">("idle");
  const [hoverDate, setHoverDate] = useState<string | null>(null);

  // Keep in sync when external props change
  useEffect(() => {
    setTempSingle(singleDate);
    setTempStart(startDate);
    setTempEnd(endDate);
    setRangeStep("idle");
    setHoverDate(null);
    const d = parseLocalDate(mode === "day" ? singleDate : startDate);
    if (!isNaN(d.getTime())) {
      setViewMonth(new Date(d.getFullYear(), d.getMonth(), 1));
    }
  }, [singleDate, startDate, endDate, mode]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setRangeStep("idle");
        setHoverDate(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePrevMonth = () => {
    setViewMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Build grid calendar days
  const calendarGrid = useMemo(() => {
    const year = viewMonth.getFullYear();
    const month = viewMonth.getMonth(); // 0-indexed

    // First day of current month (0 is Sunday, 1 is Monday...)
    const firstDay = new Date(year, month, 1).getDay();
    // Total days in current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // Total days in prev month
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const cells: Array<{
      dateStr: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      dateObj: Date;
    }> = [];

    // Prev month padding
    for (let i = firstDay - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevDate = new Date(year, month - 1, dayNum);
      const y = prevDate.getFullYear();
      const m = String(prevDate.getMonth() + 1).padStart(2, "0");
      const d = String(dayNum).padStart(2, "0");
      cells.push({
        dateStr: `${y}-${m}-${d}`,
        dayNumber: dayNum,
        isCurrentMonth: false,
        dateObj: prevDate,
      });
    }

    // Current month days
    for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
      const currDate = new Date(year, month, dayNum);
      const y = currDate.getFullYear();
      const m = String(month + 1).padStart(2, "0");
      const d = String(dayNum).padStart(2, "0");
      cells.push({
        dateStr: `${y}-${m}-${d}`,
        dayNumber: dayNum,
        isCurrentMonth: true,
        dateObj: currDate,
      });
    }

    // Next month padding to complete 35 or 42 grid cells
    const remaining = 35 - cells.length > 0 ? 35 - cells.length : 42 - cells.length;
    for (let dayNum = 1; dayNum <= remaining; dayNum++) {
      const nextDate = new Date(year, month + 1, dayNum);
      const y = nextDate.getFullYear();
      const m = String(nextDate.getMonth() + 1).padStart(2, "0");
      const d = String(dayNum).padStart(2, "0");
      cells.push({
        dateStr: `${y}-${m}-${d}`,
        dayNumber: dayNum,
        isCurrentMonth: false,
        dateObj: nextDate,
      });
    }

    return cells;
  }, [viewMonth]);

  // Handle cell click (Flexible two-step range selection)
  const handleCellClick = (cellDateStr: string) => {
    if (mode === "day") {
      setTempSingle(cellDateStr);
    } else {
      // Range mode
      if (rangeStep === "idle") {
        // Step 1: User chooses start date
        setTempStart(cellDateStr);
        setTempEnd(cellDateStr);
        setRangeStep("selecting_end");
      } else {
        // Step 2: User chooses end date
        if (cellDateStr < tempStart) {
          // If clicked date is earlier than start, swap them
          setTempStart(cellDateStr);
          setTempEnd(tempStart);
        } else {
          setTempEnd(cellDateStr);
        }
        setRangeStep("idle");
        setHoverDate(null);
      }
    }
  };

  // Quick preset ranges
  const applyPreset = (days: number) => {
    const base = parseLocalDate(tempStart || "2026-10-05");
    const end = new Date(base.getFullYear(), base.getMonth(), base.getDate() + days - 1);
    const sStr = formatDateToYYYYMMDD(base);
    const eStr = formatDateToYYYYMMDD(end);
    setTempStart(sStr);
    setTempEnd(eStr);
    setRangeStep("idle");
    setHoverDate(null);
  };

  const applyThisWeek = () => {
    setTempStart("2026-10-05");
    setTempEnd("2026-10-09");
    setRangeStep("idle");
    setHoverDate(null);
    setViewMonth(new Date(2026, 9, 1));
  };

  const handleApply = () => {
    if (mode === "day") {
      onDateChange({ singleDate: tempSingle });
    } else {
      // Guarantee start <= end
      let finalStart = tempStart;
      let finalEnd = tempEnd;
      if (finalStart > finalEnd) {
        finalStart = tempEnd;
        finalEnd = tempStart;
      }
      onDateChange({ startDate: finalStart, endDate: finalEnd });
    }
    setRangeStep("idle");
    setHoverDate(null);
    setIsOpen(false);
  };

  const handleCancel = () => {
    // Reset to original
    setTempSingle(singleDate);
    setTempStart(startDate);
    setTempEnd(endDate);
    setRangeStep("idle");
    setHoverDate(null);
    setIsOpen(false);
  };

  // Button label formatting
  const buttonLabel = useMemo(() => {
    try {
      if (mode === "day") {
        const d = parseLocalDate(singleDate);
        return d.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      } else if (mode === "month") {
        const d = parseLocalDate(startDate || singleDate);
        return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
      } else {
        const s = parseLocalDate(startDate);
        const e = parseLocalDate(endDate);
        const sStr = s.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        const eStr = e.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        return `${sStr} — ${eStr}`;
      }
    } catch {
      return mode === "day" ? singleDate : `${startDate} — ${endDate}`;
    }
  }, [mode, singleDate, startDate, endDate]);

  const monthHeaderTitle = viewMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Effective range for highlighting (incorporating hover preview)
  const { effectiveStart, effectiveEnd } = useMemo(() => {
    if (mode === "day") {
      return { effectiveStart: tempSingle, effectiveEnd: tempSingle };
    }

    let s = tempStart;
    let e = tempEnd;

    if (rangeStep === "selecting_end" && hoverDate) {
      if (hoverDate < s) {
        s = hoverDate;
        e = tempStart;
      } else {
        e = hoverDate;
      }
    }

    if (s > e) {
      const temp = s;
      s = e;
      e = temp;
    }

    return { effectiveStart: s, effectiveEnd: e };
  }, [mode, tempSingle, tempStart, tempEnd, rangeStep, hoverDate]);

  // Range summary duration badge
  const rangeDurationText = useMemo(() => {
    if (mode === "day") return null;
    try {
      const s = parseLocalDate(effectiveStart);
      const e = parseLocalDate(effectiveEnd);
      const diffDays = Math.max(1, Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1);
      return `${diffDays} day${diffDays > 1 ? "s" : ""}`;
    } catch {
      return null;
    }
  }, [mode, effectiveStart, effectiveEnd]);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* 1 Single Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full sm:w-auto inline-flex items-center justify-between sm:justify-start space-x-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 px-3.5 py-2 text-xs font-bold text-zinc-900 shadow-2xs transition focus:outline-hidden hover:border-[#2F5BFF]/50 active:scale-[0.99] group"
      >
        <div className="flex items-center space-x-2 truncate">
          <CalendarIcon className="h-4 w-4 text-[#2F5BFF] shrink-0 group-hover:rotate-6 transition-transform" />
          <span className="truncate">{buttonLabel}</span>
        </div>
        <ChevronDown
          className={`h-3.5 w-3.5 text-zinc-400 transition-transform duration-150 shrink-0 ${
            isOpen ? "rotate-180 text-[#2F5BFF]" : ""
          }`}
        />
      </button>

      {/* Popover Calendar */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 z-50 w-[calc(100vw-2.5rem)] max-w-[340px] sm:w-84 rounded-3xl border border-zinc-200 bg-white p-4 sm:p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
          {/* Top Status & Presets */}
          {mode !== "day" && (
            <div className="mb-3 space-y-2 pb-3 border-b border-zinc-100">
              {/* Range Instruction Pill */}
              <div className="flex items-center justify-between">
                {rangeStep === "selecting_end" ? (
                  <span className="inline-flex items-center text-[11px] font-bold text-[#FF7A59]">
                    <span className="relative flex h-2 w-2 mr-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF7A59] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF7A59]"></span>
                    </span>
                    Click End Date to complete range
                  </span>
                ) : (
                  <div className="flex items-center space-x-1.5 text-xs text-zinc-700 font-bold">
                    <span className="font-mono text-[11px] text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-md">
                      {effectiveStart} → {effectiveEnd}
                    </span>
                    {rangeDurationText && (
                      <span className="text-[10px] font-bold bg-blue-500/10 text-[#2F5BFF] px-1.5 py-0.5 rounded-md border border-[#2F5BFF]/20">
                        {rangeDurationText}
                      </span>
                    )}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setTempStart(startDate);
                    setTempEnd(endDate);
                    setRangeStep("idle");
                    setHoverDate(null);
                  }}
                  className="text-zinc-400 hover:text-zinc-700 p-1"
                  title="Reset Range"
                >
                  <RotateCcw className="h-3 w-3" />
                </button>
              </div>

              {/* Quick Presets */}
              <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none pt-1">
                <button
                  type="button"
                  onClick={applyThisWeek}
                  className="rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-1 text-[11px] font-medium text-zinc-700 hover:bg-blue-500/10 hover:text-[#2F5BFF] hover:border-[#2F5BFF]/40 transition"
                >
                  This Week
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset(3)}
                  className="rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-1 text-[11px] font-medium text-zinc-700 hover:bg-blue-500/10 hover:text-[#2F5BFF] hover:border-[#2F5BFF]/40 transition"
                >
                  3 Days
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset(5)}
                  className="rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-1 text-[11px] font-medium text-zinc-700 hover:bg-blue-500/10 hover:text-[#2F5BFF] hover:border-[#2F5BFF]/40 transition"
                >
                  5 Days
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset(7)}
                  className="rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-1 text-[11px] font-medium text-zinc-700 hover:bg-blue-500/10 hover:text-[#2F5BFF] hover:border-[#2F5BFF]/40 transition"
                >
                  7 Days
                </button>
              </div>
            </div>
          )}

          {/* Header with Prev/Next Month */}
          <div className="flex items-center justify-between mb-3 px-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-xl text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition shadow-2xs border border-zinc-100"
              title="Previous Month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-extrabold text-[#2F2C59]">
              {monthHeaderTitle}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-xl text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition shadow-2xs border border-zinc-100"
              title="Next Month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Weekday labels */}
          <div className="grid grid-cols-7 text-center text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
            <span>Su</span>
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
          </div>

          {/* Days Grid */}
          <div
            className="grid grid-cols-7 gap-y-1 text-center text-xs"
            onMouseLeave={() => {
              if (rangeStep === "selecting_end") setHoverDate(null);
            }}
          >
            {calendarGrid.map((cell, idx) => {
              const { dateStr, dayNumber, isCurrentMonth } = cell;

              let isSelected = false;
              let isInRange = false;
              let isRangeStart = false;
              let isRangeEnd = false;

              if (mode === "day") {
                isSelected = dateStr === tempSingle;
              } else {
                isInRange = dateStr >= effectiveStart && dateStr <= effectiveEnd;
                isRangeStart = dateStr === effectiveStart;
                isRangeEnd = dateStr === effectiveEnd;
              }

              return (
                <div
                  key={`${dateStr}-${idx}`}
                  onMouseEnter={() => {
                    if (rangeStep === "selecting_end") {
                      setHoverDate(dateStr);
                    }
                  }}
                  className={`relative py-0.5 flex items-center justify-center transition-colors ${
                    isInRange && !isRangeStart && !isRangeEnd
                      ? "bg-blue-500/10 text-indigo-950 font-bold"
                      : ""
                  } ${
                    isRangeStart && effectiveStart !== effectiveEnd
                      ? "bg-gradient-to-r from-transparent to-blue-500/10 rounded-l-xl"
                      : ""
                  } ${
                    isRangeEnd && effectiveStart !== effectiveEnd
                      ? "bg-gradient-to-l from-transparent to-blue-500/10 rounded-r-xl"
                      : ""
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleCellClick(dateStr)}
                    className={`h-8 w-8 rounded-xl flex items-center justify-center text-xs transition duration-150 ${
                      isSelected || isRangeStart || isRangeEnd
                        ? "bg-[#2F5BFF] text-white shadow-xs font-extrabold hover:bg-[#254acc] scale-105"
                        : isCurrentMonth
                        ? isInRange
                          ? "text-[#2F5BFF] font-extrabold hover:bg-[#2F5BFF]/20"
                          : "text-zinc-800 hover:bg-zinc-100 font-medium"
                        : "text-zinc-300 hover:text-zinc-500 hover:bg-zinc-50 font-normal"
                    }`}
                  >
                    {dayNumber}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Action Footer: Cancel & Apply */}
          <div className="flex items-center space-x-2 pt-3 mt-3 border-t border-zinc-100">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 rounded-xl border border-zinc-200 bg-white py-2.5 text-xs font-bold text-zinc-700 hover:bg-zinc-50 transition shadow-2xs"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="flex-1 rounded-xl bg-[#2F2C59] hover:bg-[#1E1B3A] text-white py-2.5 text-xs font-bold shadow-xs transition active:scale-[0.98] border border-[#2F2C59] flex items-center justify-center space-x-1.5"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#FF7A59]" />
              <span>Apply Range</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
