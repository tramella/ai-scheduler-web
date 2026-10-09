"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Paperclip,
  ArrowRight,
  FileSpreadsheet,
  X,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { LoadingState } from "@/components/scheduling/LoadingState";
import { ScheduleResultView } from "@/components/scheduling/ScheduleResultView";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import CustomDatePicker from "@/components/scheduling/CustomDatePicker";
import { generateSchedule, DailySchedule } from "@/lib/apiClient";

export default function ProductPage() {
  const [file, setFile] = useState<File | null>(null);
  const [useSampleRoster, setUseSampleRoster] = useState(false);
  const [start, setStart] = useState("2026-10-01");
  const [end, setEnd] = useState("2026-10-05");
  const [prompt, setPrompt] = useState(
    "Create a balanced weekly schedule. Assign employees based on skills and keep shifts within contractual hours."
  );
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [schedules, setSchedules] = useState<DailySchedule[] | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 220)}px`;
    }
  }, [prompt]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleGenerate();
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    setError(null);
    if (!selectedFile.name.match(/\.(xlsx|xls)$/i)) {
      setError("Please upload a valid .xlsx or .xls file.");
      return;
    }
    if (selectedFile.size > 2 * 1024 * 1024) {
      setError("File size exceeds 2 MB limit.");
      return;
    }
    setFile(selectedFile);
    setUseSampleRoster(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!start || !end) {
      setError("Please specify both a Start Date and an End Date.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await generateSchedule({
        file: file || undefined,
        start,
        end,
        prompt: prompt.trim() || undefined,
      });

      if (res.schedules && res.schedules.length > 0) {
        setSchedules(res.schedules);
      } else {
        setError(
          "No schedule could be generated. Please verify your employee availability and constraints."
        );
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to generate schedule.");
      } else {
        setError("Failed to generate schedule.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSchedules(null);
    setError(null);
    setFile(null);
    setUseSampleRoster(false);
  };

  const quickPromptChips = [
    { label: "Fair Workload Balance", prompt: "Distribute shift hours and weekend slots evenly across all team members." },
    { label: "Morning Priority", prompt: "Prioritize morning shifts for qualified cashiers with a 35 hours/week cap." },
    { label: "Min 2 Staff Per Shift", prompt: "Ensure at least 2 staff members per shift and respect all unavailability dates." },
    { label: "12h Mandatory Rest", prompt: "Prevent consecutive late-to-early shifts and enforce mandatory 12-hour rest." },
  ];

  return (
    <main className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-start py-8 sm:py-14 px-4 sm:px-6 lg:px-8 bg-slate-50/50">
      <div className="w-full max-w-4xl mx-auto space-y-6">
        
        {/* Error Notification */}
        {error && (
          <div className="w-full max-w-3xl mx-auto">
            <ErrorBanner
              message={error}
              onDismiss={() => setError(null)}
              onRetry={() => handleGenerate()}
            />
          </div>
        )}

        {loading ? (
          <div className="max-w-2xl mx-auto py-8">
            <LoadingState />
          </div>
        ) : schedules ? (
          <ScheduleResultView
            schedules={schedules}
            startDate={start}
            endDate={end}
            onRegenerate={() => handleGenerate()}
            onReset={handleReset}
          />
        ) : (
          <div className="space-y-6">
            
            {/* Header */}
            <div className="text-center max-w-xl mx-auto space-y-2">
              <div className="inline-flex items-center space-x-2 rounded-full bg-slate-900/[0.05] px-3.5 py-1 text-xs font-semibold text-slate-800">
                <Sparkles className="h-3.5 w-3.5 text-[#FF7A59]" />
                <span>ORBIT Copilot</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#2F2C59]">
                Build your schedule
              </h1>
              <p className="text-xs sm:text-sm text-slate-600">
                Attach an employee roster and state your shift constraints.
              </p>
            </div>

            {/* Prompt Box */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative rounded-3xl border transition-all duration-150 bg-white shadow-sm ${
                isDragging
                  ? "border-[#2F2C59] ring-2 ring-[#2F2C59]/10"
                  : "border-slate-200/90 focus-within:border-[#2F2C59] focus-within:ring-2 focus-within:ring-[#2F2C59]/10"
              }`}
            >
              {/* Attached file badge */}
              {(file || useSampleRoster) && (
                <div className="px-4 pt-3.5 pb-1 flex items-center gap-2">
                  <div className="inline-flex items-center space-x-2 rounded-xl bg-slate-100 border border-slate-200 px-3 py-1 text-xs text-slate-800">
                    <FileSpreadsheet className="h-3.5 w-3.5 text-slate-600 shrink-0" />
                    <span className="font-semibold truncate max-w-[200px] sm:max-w-xs">
                      {file ? file.name : "Sample Roster (8 Staff)"}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setFile(null);
                        setUseSampleRoster(false);
                      }}
                      className="ml-1 text-slate-400 hover:text-slate-800 p-0.5 rounded transition"
                      title="Remove"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              )}

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    validateAndSetFile(e.target.files[0]);
                  }
                }}
                className="hidden"
              />

              {/* Prompt Textarea */}
              <div className="p-4 sm:p-5">
                <textarea
                  ref={textareaRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={3}
                  placeholder="Describe your shift rules and constraints..."
                  className="w-full resize-none bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden leading-relaxed"
                />
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 pb-3.5 pt-2 border-t border-slate-100 bg-slate-50/50 rounded-b-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    <Paperclip className="h-3.5 w-3.5 text-slate-500" />
                    <span>{file ? "Change File" : "Attach Excel (.xlsx)"}</span>
                  </button>

                  {!file && !useSampleRoster && (
                    <button
                      type="button"
                      onClick={() => setUseSampleRoster(true)}
                      className="inline-flex items-center space-x-1 rounded-xl border border-dashed border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition"
                    >
                      <Zap className="h-3 w-3 text-[#FF7A59]" />
                      <span>Use Demo Data</span>
                    </button>
                  )}

                  <CustomDatePicker
                    mode="week"
                    startDate={start}
                    endDate={end}
                    onDateChange={({ startDate: s, endDate: e }) => {
                      if (s) setStart(s);
                      if (e) setEnd(e);
                    }}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleGenerate()}
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-xl bg-[#2F2C59] px-5 py-2 text-xs font-semibold text-white hover:bg-[#1E1B3A] disabled:opacity-50 transition border border-[#2F2C59] cursor-pointer shadow-xs"
                >
                  <Sparkles className="mr-1.5 h-3.5 w-3.5 text-[#FF7A59]" />
                  <span>Generate Schedule</span>
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5 text-white" />
                </button>
              </div>
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-500">Quick Templates:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {quickPromptChips.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPrompt(chip.prompt)}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-white hover:bg-slate-50 p-2.5 text-xs text-left text-slate-700 shadow-2xs transition active:scale-[0.99] cursor-pointer"
                  >
                    <span className="font-medium text-slate-800">{chip.label}</span>
                    <span className="text-[11px] text-slate-500">Apply</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}
