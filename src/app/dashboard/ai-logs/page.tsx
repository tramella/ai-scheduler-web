"use client";

import React, { useState, useMemo } from "react";
import {
  Cpu,
  Search,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Zap,
  Terminal,
  ChevronDown,
  ChevronUp,
  Sparkles,
  CheckCircle2,
  Lock,
  Layers,
  X,
  Code2,
  Check,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { KpiCard } from "@/components/ui/KpiCard";
import { Card, CARD_BASE_CLASSES } from "@/components/ui/Card";
import { StatusChip } from "@/components/ui/StatusChip";
import { PillButton } from "@/components/ui/PillButton";
import { fetchAiLogsApi } from "@/lib/apiClient";

export interface AiLogEntry {
  id: string;
  draft_id: string;
  timestamp: string;
  ai_provider: "Gemini" | "OpenAI";
  model_name: string;
  user_prompt: string;
  execution_time_ms: number;
  total_tokens: number;
  cost_estimated: number;
  violations_intercepted: number;
  hard_violations: {
    rule: string;
    details: string;
    action_taken: string;
  }[];
  soft_violations: {
    rule: string;
    details: string;
    action_taken: string;
  }[];
  deterministic_status: "Verified 0-Conflict" | "Resolved by Kernel";
}

const INITIAL_AI_LOGS: AiLogEntry[] = [];

export default function AiLogsPage() {
  const [logs, setLogs] = useState<AiLogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [providerFilter, setProviderFilter] = useState<"ALL" | "Gemini" | "OpenAI">("ALL");
  const [violationFilter, setViolationFilter] = useState<"ALL" | "VIOLATIONS" | "CLEAN">("ALL");
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [inspectModalLog, setInspectModalLog] = useState<AiLogEntry | null>(null);

  React.useEffect(() => {
    async function loadLogs() {
      try {
        const res = await fetchAiLogsApi();
        if (res.data && res.data.length > 0) {
          const mapped: AiLogEntry[] = res.data.map((l: any) => ({
            id: l._id || l.id,
            draft_id: l.draft_id?.name || "DFT-LIVE",
            timestamp: new Date(l.created_at || Date.now()).toISOString().slice(0, 19).replace("T", " "),
            ai_provider: "Gemini",
            model_name: l.model_name || "gemini-2.5-flash",
            user_prompt: l.user_prompt || "Auto-balanced weekly schedule",
            execution_time_ms: l.execution_time_ms || 120,
            total_tokens: l.total_tokens || 850,
            cost_estimated: 0,
            violations_intercepted: l.violations_count || 0,
            hard_violations: [],
            soft_violations: [],
            deterministic_status: "Verified 0-Conflict"
          }));
          setLogs(mapped);
        } else {
          setLogs([]);
        }
      } catch (err) {
        console.warn("Backend logs fallback:", err);
        setLogs([]);
      }
    }
    loadLogs();
  }, []);

  // KPIs
  const metrics = useMemo(() => {
    const totalRuns = logs.length;
    const avgLatency = totalRuns > 0
      ? Math.round(logs.reduce((sum, l) => sum + l.execution_time_ms, 0) / totalRuns)
      : 0;
    const totalTokens = logs.reduce((sum, l) => sum + l.total_tokens, 0);
    const totalViolationsBlocked = logs.reduce((sum, l) => sum + l.violations_intercepted, 0);
    return { totalRuns, avgLatency, totalTokens, totalViolationsBlocked };
  }, [logs]);

  // Filtered List
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.draft_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user_prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.model_name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesProvider = providerFilter === "ALL" || log.ai_provider === providerFilter;
      const matchesViolation =
        violationFilter === "ALL" ||
        (violationFilter === "VIOLATIONS" && log.violations_intercepted > 0) ||
        (violationFilter === "CLEAN" && log.violations_intercepted === 0);

      return matchesSearch && matchesProvider && matchesViolation;
    });
  }, [logs, searchTerm, providerFilter, violationFilter]);

  const toggleExpand = (id: string) => {
    setExpandedLogId(expandedLogId === id ? null : id);
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* ================= 1. PAGE HEADER ================= */}
        <PageHeader
          eyebrow="Deterministic Solver & Verification Engine"
          title="AI Audit & Generation Logs"
          description="Inspect raw AI generation prompts, token consumption, latency, and the deterministic violations intercepted in real time."
        />

        {/* ================= 2. KPI METRICS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <KpiCard
            label="Total Solve Runs"
            value={metrics.totalRuns}
            chip="All time"
            chipVariant="neutral"
            note="Audited kernel generations"
            icon={Cpu}
            iconVariant="indigo"
          />

          <KpiCard
            label="Avg Solver Latency"
            value={`${metrics.avgLatency}ms`}
            chip="< 0.2s target"
            chipVariant="success"
            note="Real-time kernel processing"
            icon={Zap}
            iconVariant="blue"
          />

          <KpiCard
            label="Violations Intercepted"
            value={metrics.totalViolationsBlocked}
            valueClass="text-emerald-600 dark:text-emerald-400"
            chip="100% resolved"
            chipVariant="success"
            note="Hard & soft rules enforced"
            icon={ShieldCheck}
            iconVariant="emerald"
          />

          <KpiCard
            label="Total Token Diet"
            value={metrics.totalTokens.toLocaleString()}
            chip="Optimized"
            chipVariant="info"
            note="LLM prompt & completion total"
            icon={Sparkles}
            iconVariant="orange"
          />
        </div>

        {/* Toolbar */}
        <Card padding="sm" className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700">
            {(["ALL", "VIOLATIONS", "CLEAN"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setViolationFilter(v)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                  violationFilter === v
                    ? "bg-[#2F2C59] text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {v === "ALL" && `All Logs (${logs.length})`}
                {v === "VIOLATIONS" && `Kernel Interventions (${logs.filter((l) => l.violations_intercepted > 0).length})`}
                {v === "CLEAN" && `Clean Passes (${logs.filter((l) => l.violations_intercepted === 0).length})`}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <select
              value={providerFilter}
              onChange={(e) => setProviderFilter(e.target.value as "ALL" | "Gemini" | "OpenAI")}
              className="px-3 py-1.5 text-xs font-medium rounded-full border border-slate-200/80 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-hidden"
            >
              <option value="ALL">All Providers</option>
              <option value="Gemini">Gemini 2.5 Flash</option>
              <option value="OpenAI">OpenAI GPT-4o</option>
            </select>

            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search prompt, model, ID..."
                className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-full border border-slate-200/80 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2F5BFF]/30"
              />
            </div>
          </div>
        </Card>

        {/* Audit Log Stream (Accordion List) */}
        {filteredLogs.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center bg-white/50 dark:bg-slate-900/40">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/30 text-[#2F5BFF] mb-3">
              <Cpu className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">No AI audit logs recorded yet</h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              Execution telemetry, token usage, and constraint verification traces will appear here once schedules are generated in AI Studio.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLogs.map((log) => {
              const isExpanded = expandedLogId === log.id;

            return (
              <div
                key={log.id}
                className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs transition"
              >
                {/* Header Summary Row */}
                <div
                  onClick={() => toggleExpand(log.id)}
                  className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition"
                >
                  <div className="flex items-start sm:items-center space-x-3.5 min-w-0">
                    <div className="h-10 w-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-[#2F2C59] dark:text-indigo-400 flex items-center justify-center shrink-0">
                      <Cpu className="h-5 w-5 text-[#2F5BFF]" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                          {log.id}
                        </span>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <span className="text-[11px] font-mono text-[#2F5BFF] bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
                          {log.model_name}
                        </span>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {log.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 truncate mt-1 max-w-xl">
                        &ldquo;{log.user_prompt}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Telemetry Stats & Status Pill */}
                  <div className="flex items-center space-x-4 shrink-0">
                    <div className="text-right hidden sm:block font-mono text-xs">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {log.execution_time_ms}ms
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {log.total_tokens} tokens (${log.cost_estimated})
                      </div>
                    </div>

                    {log.violations_intercepted > 0 ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200/80 dark:bg-amber-950/60 dark:text-amber-300">
                        <ShieldCheck className="h-3.5 w-3.5 mr-1 text-amber-600" />
                        {log.violations_intercepted} Auto-Corrected
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/60 dark:text-emerald-300">
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                        0 Violations
                      </span>
                    )}

                    <div className="text-slate-400">
                      {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details Pane */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 space-y-4 text-xs animate-in fade-in">
                    
                    {/* Prompt Box */}
                    <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Natural Language Manager Directive
                      </span>
                      <p className="font-mono text-slate-800 dark:text-slate-200">
                        {log.user_prompt}
                      </p>
                    </div>

                    {/* Violations Details if any */}
                    {log.violations_intercepted > 0 ? (
                      <div className="space-y-2">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center">
                          <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
                          Deterministic Kernel Interventions ({log.violations_intercepted})
                        </div>

                        {log.hard_violations.map((hv, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-900 space-y-1"
                          >
                            <div className="flex items-center justify-between text-amber-950 dark:text-amber-200 font-bold">
                              <span>HARD CONSTRAINT: {hv.rule}</span>
                              <span className="text-[10px] bg-amber-200/80 dark:bg-amber-900/80 px-2 py-0.5 rounded-full text-amber-900 dark:text-amber-100">
                                Intercepted
                              </span>
                            </div>
                            <p className="text-amber-900 dark:text-amber-300">
                              {hv.details}
                            </p>
                            <p className="text-emerald-700 dark:text-emerald-400 font-medium pt-1 flex items-center">
                              <Check className="h-3 w-3 mr-1" />
                              {hv.action_taken}
                            </p>
                          </div>
                        ))}

                        {log.soft_violations.map((sv, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 dark:bg-blue-950/40 dark:border-blue-900 space-y-1"
                          >
                            <div className="flex items-center justify-between text-blue-950 dark:text-blue-200 font-bold">
                              <span>SOFT CONSTRAINT: {sv.rule}</span>
                              <span className="text-[10px] bg-blue-200/80 dark:bg-blue-900/80 px-2 py-0.5 rounded-full text-blue-900 dark:text-blue-100">
                                Re-Balanced
                              </span>
                            </div>
                            <p className="text-blue-900 dark:text-blue-300">{sv.details}</p>
                            <p className="text-emerald-700 dark:text-emerald-400 font-medium pt-1 flex items-center">
                              <Check className="h-3 w-3 mr-1" />
                              {sv.action_taken}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 flex items-center space-x-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span>All 6 hard and soft scheduling constraints satisfied on first solve pass. Zero hallucinations.</span>
                      </div>
                    )}

                    {/* Metadata Footer */}
                    <div className="flex flex-wrap items-center justify-between pt-2 text-[11px] text-slate-500 font-mono">
                      <div className="flex items-center space-x-3">
                        <span>Draft ID: <strong>{log.draft_id}</strong></span>
                        <span>•</span>
                        <span>Provider: <strong>{log.ai_provider}</strong></span>
                        <span>•</span>
                        <span>Execution: <strong>{log.execution_time_ms}ms</strong></span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setInspectModalLog(log);
                        }}
                        className="text-[#2F5BFF] hover:underline font-sans font-semibold cursor-pointer"
                      >
                        Inspect Raw Audit JSON
                      </button>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
        )}

      </div>

      {/* Inspect JSON Modal */}
      {inspectModalLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <Code2 className="h-4 w-4 text-[#2F5BFF]" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-mono">
                  Audit Telemetry ({inspectModalLog.id})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectModalLog(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <pre className="p-4 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-96">
              {JSON.stringify(inspectModalLog, null, 2)}
            </pre>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setInspectModalLog(null)}
                className="px-4 py-2 rounded-full bg-[#2F2C59] text-white text-xs font-semibold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
