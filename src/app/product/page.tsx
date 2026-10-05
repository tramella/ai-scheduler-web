"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Paperclip,
  Calendar,
  ArrowRight,
  FileSpreadsheet,
  X,
  Clock,
  CheckCircle2,
  HelpCircle,
  CornerDownLeft,
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
    "Create a balanced weekly schedule. Make sure employees are assigned only during their available hours, match critical skills, and do not exceed maximum working limits."
  );
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [schedules, setSchedules] = useState<DailySchedule[] | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 260)}px`;
    }
  }, [prompt]);

  // Handle keyboard shortcut (Ctrl+Enter or Cmd+Enter)
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
          "No schedule could be generated from the provided information. Please check your employee data or adjust your constraints."
        );
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "We couldn't generate your schedule. Please try again.");
      } else {
        setError("We couldn't generate your schedule. Please try again.");
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
    { label: "⚖️ Fair Shift Balancing", prompt: "Assign employees based on skills and balance shift workload evenly across all team members." },
    { label: "🌅 Morning Cashiers Priority", prompt: "Prioritize morning shifts for qualified cashiers with a strict 35 hours/week limit." },
    { label: "👥 Min 2 Staff Per Station", prompt: "Ensure at least 2 staff members per shift and strictly respect all unavailability dates." },
    { label: "🛡️ Zero Consecutive Nights", prompt: "Prevent employees from working consecutive evening/night shifts and enforce mandatory 12h rest." },
  ];

  return (
    <main className="flex-1 flex flex-col items-center justify-start py-8 sm:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-linear-to-b from-white via-zinc-50/40 to-white">
      {/* Ambient background glow */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 -z-10 w-[700px] h-[380px] bg-gradient-to-b from-[#FF5A36]/10 via-[#FF5A36]/4 to-transparent blur-3xl rounded-full pointer-events-none"></div>

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
          /* ================= LOADING COPILOT STATE ================= */
          <div className="max-w-2xl mx-auto py-8">
            <LoadingState />
          </div>
        ) : schedules ? (
          /* ================= GENERATED RESULT MATRIX ================= */
          <ScheduleResultView
            schedules={schedules}
            startDate={start}
            endDate={end}
            onRegenerate={() => handleGenerate()}
            onReset={handleReset}
          />
        ) : (
          /* ================= PROMPT-FIRST COPILOT WORKSPACE ================= */
          <div className="space-y-6">
            {/* Header / Focal Intro */}
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center space-x-2 rounded-full border border-zinc-200/90 bg-white/90 backdrop-blur-xs px-3.5 py-1 text-xs font-medium text-zinc-800 shadow-2xs">
                <Sparkles className="h-3.5 w-3.5 text-[#FF5A36]" />
                <span className="font-bold text-zinc-900">ORBIT Copilot</span>
                <span className="text-zinc-300">•</span>
                <span className="text-zinc-600">Prompt-First AI Scheduling Workspace</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0B0F1A]">
                What schedule do you want to build?
              </h1>
              <p className="text-sm sm:text-base text-zinc-600 max-w-lg mx-auto leading-relaxed">
                Attach your employee roster, specify constraints in plain English, and let AI generate a mathematically audited shift matrix.
              </p>
            </div>

            {/* Unified Floating AI Prompt Box (Perplexity / Cursor / Linear style) */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative rounded-3xl border transition-all duration-200 bg-white shadow-xl shadow-zinc-950/5 ${
                isDragging
                  ? "border-[#FF5A36] ring-4 ring-[#FF5A36]/10 bg-orange-50/20"
                  : "border-zinc-300/80 hover:border-zinc-400 focus-within:border-[#0B0F1A] focus-within:ring-4 focus-within:ring-zinc-950/5"
              }`}
            >
              {/* Top Context Chips & Uploaded Roster Badge */}
              {(file || useSampleRoster) && (
                <div className="px-5 pt-4 pb-1 flex flex-wrap items-center gap-2 animate-in fade-in duration-150">
                  <div className="inline-flex items-center space-x-2 rounded-xl bg-emerald-50 border border-emerald-200/80 px-3 py-1.5 text-xs text-emerald-900 shadow-2xs">
                    <FileSpreadsheet className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="font-bold truncate max-w-[200px] sm:max-w-xs">
                      {file ? file.name : "Sample Coffee Shop Roster (8 Staff)"}
                    </span>
                    {file && (
                      <span className="text-emerald-600/80 font-mono text-[11px]">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setFile(null);
                        setUseSampleRoster(false);
                      }}
                      className="ml-1 text-emerald-700 hover:text-emerald-900 p-0.5 rounded-md hover:bg-emerald-100 transition"
                      title="Remove attached file"
                    >
                      <X className="h-3.5 w-3.5" />
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

              {/* Main Prompt Input Area */}
              <div className="p-4 sm:p-5">
                <textarea
                  ref={textareaRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={3}
                  placeholder="Describe your scheduling rules, constraints, or goals (e.g., 'Prioritize morning shifts for cashiers, max 35 hrs/week, ensure 2 staff on duty per shift')..."
                  className="w-full resize-none bg-transparent text-sm sm:text-base text-zinc-900 placeholder-zinc-400 focus:outline-hidden leading-relaxed"
                />
              </div>

              {/* Prompt Box Footer / Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 pb-4 pt-2 border-t border-zinc-100 bg-zinc-50/40 rounded-b-3xl">
                {/* Left Micro Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Attach File Button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`inline-flex items-center space-x-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition shadow-2xs ${
                      file
                        ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                        : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
                    }`}
                  >
                    <Paperclip className="h-3.5 w-3.5 text-zinc-500" />
                    <span>{file ? "Change Roster" : "Attach Excel Roster"}</span>
                  </button>

                  {/* Use Sample Roster Demo Button */}
                  {!file && !useSampleRoster && (
                    <button
                      type="button"
                      onClick={() => setUseSampleRoster(true)}
                      className="inline-flex items-center space-x-1 rounded-xl border border-dashed border-zinc-300 bg-white px-2.5 py-1.5 text-[11px] font-medium text-zinc-600 hover:text-zinc-900 hover:border-zinc-400 transition"
                    >
                      <Zap className="h-3 w-3 text-[#FF5A36]" />
                      <span>Use Demo Data</span>
                    </button>
                  )}

                  {/* Custom Calendar Date Picker */}
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

                {/* Right Action: Generate Roster Button */}
                <div className="flex items-center space-x-2">
                  <span className="hidden sm:inline-flex items-center text-[11px] text-zinc-400 font-mono">
                    <CornerDownLeft className="h-3 w-3 mr-0.5" /> Enter to send
                  </span>
                  <button
                    type="button"
                    onClick={() => handleGenerate()}
                    disabled={loading}
                    className="inline-flex items-center justify-center rounded-2xl bg-[#0B0F1A] px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-zinc-800 disabled:opacity-50 transition-all duration-150 active:scale-[0.99] border border-zinc-800 group"
                  >
                    <Sparkles className="mr-2 h-4 w-4 text-[#FF5A36] group-hover:rotate-12 transition-transform" />
                    <span>Generate Roster</span>
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5 text-[#FF5A36] group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Prompt Suggestion Chips */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs text-zinc-500 px-1">
                <span className="font-semibold text-zinc-700">Suggested Directives:</span>
                <span className="text-zinc-400">Click to apply prompt</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {quickPromptChips.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPrompt(chip.prompt)}
                    className="flex items-center justify-between rounded-xl border border-zinc-200/90 bg-white hover:bg-zinc-50 hover:border-zinc-300 p-2.5 text-xs text-left text-zinc-700 shadow-2xs transition active:scale-[0.99]"
                  >
                    <span className="font-semibold text-zinc-800">{chip.label}</span>
                    <span className="text-[11px] text-zinc-400 font-mono">Use</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Trust & Guarantee Banner */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-500">
              <div className="inline-flex items-center space-x-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Deterministic Rule Verification</span>
              </div>
              <span className="text-zinc-300">•</span>
              <div className="inline-flex items-center space-x-1.5">
                <Zap className="h-4 w-4 text-[#FF5A36]" />
                <span>Zero Double-Booking Guarantee</span>
              </div>
              <span className="text-zinc-300">•</span>
              <div className="inline-flex items-center space-x-1.5">
                <FileSpreadsheet className="h-4 w-4 text-zinc-400" />
                <span>Instant XLSX Export</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
