"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { ScheduleTable } from "@/components/ScheduleTable";
import { ErrorBanner } from "@/components/ErrorBanner";
import { generateSchedule, exportSchedule, DailySchedule } from "@/lib/apiClient";

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [start, setStart] = useState("2026-10-01");
  const [end, setEnd] = useState("2026-10-02");
  const [prompt, setPrompt] = useState("Assign employees based on skills and balance shift workload.");
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [schedules, setSchedules] = useState<DailySchedule[] | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (!selected.name.match(/\.(xlsx|xls)$/i)) {
        setError("Only Excel files (.xlsx, .xls) are allowed!");
        return;
      }
      if (selected.size > 2 * 1024 * 1024) {
        setError("File size must be under 2MB!");
        return;
      }
      setError(null);
      setFile(selected);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!start || !end) {
      setError("Please select start and end dates.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await generateSchedule({
        file: file || undefined,
        start,
        end,
        prompt: prompt.trim() || undefined
      });

      if (res.schedules && res.schedules.length > 0) {
        setSchedules(res.schedules);
      } else {
        setError("No schedule assignments could be generated for the selected range.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred while generating the schedule.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!schedules) return;
    try {
      setExporting(true);
      const blob = await exportSchedule(schedules);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `workforce_schedule_${start}_${end}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to download Excel file.");
      }
    } finally {
      setExporting(false);
    }
  };

  const handleReset = () => {
    setSchedules(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6">
            <ErrorBanner message={error} onDismiss={() => setError(null)} />
          </div>
        )}

        {!schedules ? (
          /* ================= SCREEN 1: GENERATE FORM ================= */
          <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900">Schedule Parameters</h2>
              <p className="text-sm text-slate-500">
                Upload your employee roster or let the AI schedule from system data.
              </p>
            </div>

            <form onSubmit={handleGenerate} className="space-y-6">
              {/* DATE RANGE */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* EXCEL UPLOAD */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Employee Excel File <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="mt-1 flex justify-center rounded-xl border border-dashed border-slate-300 px-6 pt-5 pb-6 hover:border-indigo-400 transition">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-slate-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-slate-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-hidden"
                      >
                        <span>{file ? file.name : "Upload a file"}</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          accept=".xlsx,.xls"
                          onChange={handleFileChange}
                          className="sr-only"
                        />
                      </label>
                      {!file && <p className="pl-1">or drag and drop</p>}
                    </div>
                    <p className="text-xs text-slate-500">.XLSX or .XLS up to 2MB</p>
                  </div>
                </div>
                {file && (
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
                    <span>Selected: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(1)} KB)</span>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="text-rose-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* PROMPT */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Natural Language Scheduling Requirements
                </label>
                <textarea
                  rows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., Prioritize assigning senior cashiers to morning shifts and ensure fair weekend distribution."
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition"
              >
                {loading ? (
                  <>
                    <svg
                      className="mr-3 h-5 w-5 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    AI Reasoning & Generating Schedule...
                  </>
                ) : (
                  "Generate Schedule"
                )}
              </button>
            </form>
          </div>
        ) : (
          /* ================= SCREEN 2: SCHEDULE RESULT ================= */
          <div className="space-y-6">
            <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-xs sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Generated Workforce Schedule</h2>
                <p className="text-xs text-slate-500">
                  Range: <span className="font-semibold text-slate-700">{start}</span> to{" "}
                  <span className="font-semibold text-slate-700">{end}</span>
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={handleReset}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-xs hover:bg-slate-50 transition"
                >
                  Create New Schedule
                </button>
                <button
                  onClick={handleExport}
                  disabled={exporting}
                  className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-emerald-500 disabled:opacity-50 transition"
                >
                  {exporting ? "Exporting..." : "Export Excel (.xlsx)"}
                </button>
              </div>
            </div>

            <ScheduleTable schedules={schedules} />
          </div>
        )}
      </main>
    </div>
  );
}
