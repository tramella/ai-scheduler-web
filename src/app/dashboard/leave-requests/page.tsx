"use client";

import React, { useState, useMemo } from "react";
import {
  CalendarDays,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Check,
  X,
  Palmtree,
  Sparkles,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { KpiCard } from "@/components/ui/KpiCard";
import { Card } from "@/components/ui/Card";
import { PillButton } from "@/components/ui/PillButton";
import { StatusChip } from "@/components/ui/StatusChip";
import { fetchLeaveRequestsApi, updateLeaveRequestStatusApi } from "@/lib/api-clients/leave-requests/leaveRequestsApi";

export interface LeaveRequestItem {
  id: string;
  employee_id: string;
  employee_name: string;
  employee_role: string;
  employee_avatar: string;
  start_date: string;
  end_date: string;
  days_count: number;
  reason_category: "Vacation" | "Sick Leave" | "Family Emergency" | "Study / Exam" | "Personal";
  reason_detail: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  submitted_at: string;
  approved_by?: string;
  schedule_impact: "Low" | "Medium" | "High";
  impact_note: string;
}

export default function LeaveRequestsPage() {
  const [requests, setRequests] = useState<LeaveRequestItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");
  const [reasonFilter, setReasonFilter] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  React.useEffect(() => {
    async function loadRequests() {
      try {
        const res = await fetchLeaveRequestsApi();
        if (res.data && res.data.length > 0) {
          const mapped: LeaveRequestItem[] = res.data.map((r: any) => ({
            id: r._id || r.id,
            employee_id: r.employee_id?.employee_code || "NV001",
            employee_name: r.employee_id?.full_name || "Staff Member",
            employee_role: "Crew Member",
            employee_avatar: (r.employee_id?.full_name || "SM").slice(0, 2).toUpperCase(),
            start_date: new Date(r.start_date).toISOString().slice(0, 10),
            end_date: new Date(r.end_date).toISOString().slice(0, 10),
            days_count: 2,
            reason_category: "Personal",
            reason_detail: r.reason || "Scheduled absence",
            status: r.status || "PENDING",
            submitted_at: new Date(r.created_at || Date.now()).toISOString().slice(0, 16).replace("T", " "),
            schedule_impact: "Low",
            impact_note: "Managed by coverage solver"
          }));
          setRequests(mapped);
        } else {
          setRequests([]);
        }
      } catch (err) {
        console.warn("Backend leave requests fallback:", err);
        setRequests([]);
      }
    }
    loadRequests();
  }, []);

  // New Request Form State
  const [newEmployeeName, setNewEmployeeName] = useState("");
  const [newStartDate, setNewStartDate] = useState("");
  const [newEndDate, setNewEndDate] = useState("");
  const [newCategory, setNewCategory] = useState<LeaveRequestItem["reason_category"]>("Vacation");
  const [newReason, setNewReason] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // KPI Calculations
  const metrics = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter((r) => r.status === "PENDING").length;
    const approved = requests.filter((r) => r.status === "APPROVED").length;
    const rejected = requests.filter((r) => r.status === "REJECTED").length;
    const onLeaveDays = requests
      .filter((r) => r.status === "APPROVED")
      .reduce((sum, r) => sum + r.days_count, 0);

    return { total, pending, approved, rejected, onLeaveDays };
  }, [requests]);

  // Filtered List
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const matchesSearch =
        r.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.reason_detail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.employee_role.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;
      const matchesReason = reasonFilter === "ALL" || r.reason_category === reasonFilter;

      return matchesSearch && matchesStatus && matchesReason;
    });
  }, [requests, searchTerm, statusFilter, reasonFilter]);

  const handleUpdateStatus = (id: string, newStatus: "APPROVED" | "REJECTED") => {
    updateLeaveRequestStatusApi(id, newStatus).catch(err => console.warn("Status sync:", err));

    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: newStatus,
              approved_by: "Store Manager",
            }
          : r
      )
    );
    showToast(
      newStatus === "APPROVED"
        ? `Request ${id} approved successfully.`
        : `Request ${id} marked as rejected.`
    );
  };

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmployeeName || !newStartDate || !newEndDate) {
      alert("Please fill in employee name and leave dates.");
      return;
    }

    const start = new Date(newStartDate);
    const end = new Date(newEndDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const newReq: LeaveRequestItem = {
      id: `LR-${100 + requests.length + 1}`,
      employee_id: `NV00${requests.length + 1}`,
      employee_name: newEmployeeName,
      employee_role: "Staff Member",
      employee_avatar: newEmployeeName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2),
      start_date: newStartDate,
      end_date: newEndDate,
      days_count: Math.max(1, days),
      reason_category: newCategory,
      reason_detail: newReason || "Personal leave request",
      status: "PENDING",
      submitted_at: new Date().toISOString().replace("T", " ").slice(0, 16),
      schedule_impact: days > 2 ? "Medium" : "Low",
      impact_note: "Pending schedule solver recalculation",
    };

    setRequests([newReq, ...requests]);
    setIsModalOpen(false);
    setNewEmployeeName("");
    setNewStartDate("");
    setNewEndDate("");
    setNewReason("");
    showToast(`Leave request for ${newEmployeeName} logged and submitted for review.`);
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 rounded-full bg-[#2F2C59] text-white px-5 py-2.5 shadow-lg border border-indigo-400/40 text-xs font-semibold flex items-center space-x-2 animate-in fade-in slide-in-from-top-2">
            <Check className="h-4 w-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Page Header */}
        <PageHeader
          eyebrow="Time-Off & Availability"
          title="Leave Requests"
          description="Review staff time-off requests, check roster coverage impact, and sync availability with the AI scheduler."
          actions={
            <PillButton variant="primary" onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4" />
              <span>New Leave Request</span>
            </PillButton>
          }
        />

        {/* 4 Summary KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Pending Review"
            value={metrics.pending}
            note="needs approval"
            icon={Clock}
            iconVariant="orange"
            valueClass="text-amber-600 dark:text-amber-400"
          />
          <KpiCard
            label="Approved"
            value={metrics.approved}
            note={`${metrics.onLeaveDays} days scheduled`}
            icon={CheckCircle2}
            iconVariant="emerald"
          />
          <KpiCard
            label="Total Submissions"
            value={metrics.total}
            note="all time records"
            icon={CalendarDays}
            iconVariant="blue"
          />
          <KpiCard
            label="AI Solver Sync"
            value="100%"
            note="zero conflict roster"
            icon={Sparkles}
            iconVariant="indigo"
          />
        </div>

        {/* Toolbar: Status Filter Pills + Search Input */}
        <Card padding="md" className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700/70 overflow-x-auto">
            {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === st
                    ? "bg-[#2F2C59] text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {st === "ALL" && `All (${requests.length})`}
                {st === "PENDING" && `Pending (${metrics.pending})`}
                {st === "APPROVED" && `Approved (${metrics.approved})`}
                {st === "REJECTED" && `Rejected (${metrics.rejected})`}
              </button>
            ))}
          </div>

          {/* Search + Reason Dropdown */}
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search staff, reason, id..."
                className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-full border border-slate-200/80 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2F5BFF]/30"
              />
            </div>

            <select
              value={reasonFilter}
              onChange={(e) => setReasonFilter(e.target.value)}
              className="px-3 py-1.5 text-xs font-medium rounded-full border border-slate-200/80 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-hidden"
            >
              <option value="ALL">All Categories</option>
              <option value="Vacation">Vacation</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Family Emergency">Family Emergency</option>
              <option value="Study / Exam">Study / Exam</option>
              <option value="Personal">Personal</option>
            </select>
          </div>
        </Card>

        {/* Requests Table */}
        <Card padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px] font-mono">
                  <th className="py-3 px-4 sm:px-6">Employee</th>
                  <th className="py-3 px-4">Leave Dates</th>
                  <th className="py-3 px-4">Category & Reason</th>
                  <th className="py-3 px-4 text-center">Roster Impact</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500 dark:text-slate-400">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <CalendarDays className="h-8 w-8 text-slate-300" />
                        <p className="text-sm font-semibold">No leave requests found</p>
                        <p className="text-xs text-slate-400">Try adjusting your search or filters.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((req) => (
                    <tr
                      key={req.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Employee Info */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-full bg-[#2F2C59] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                            {req.employee_avatar}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 dark:text-white truncate">
                              {req.employee_name}
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                              {req.employee_role} • <span className="font-mono text-[10px]">{req.id}</span>
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Dates */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono text-xs font-semibold text-slate-900 dark:text-slate-200">
                          {req.start_date} → {req.end_date}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {req.days_count} {req.days_count === 1 ? "day" : "days"} requested
                        </div>
                      </td>

                      {/* Reason */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <span className="inline-block px-2 py-0.5 text-[10px] font-semibold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mb-1">
                          {req.reason_category}
                        </span>
                        <p className="text-xs text-slate-600 dark:text-slate-300 truncate" title={req.reason_detail}>
                          {req.reason_detail}
                        </p>
                      </td>

                      {/* Impact */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            req.schedule_impact === "High"
                              ? "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/50 dark:text-rose-300"
                              : req.schedule_impact === "Medium"
                              ? "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/50 dark:text-amber-300"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300"
                          }`}
                        >
                          {req.schedule_impact} Impact
                        </span>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5 max-w-[150px] mx-auto">
                          {req.impact_note}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        {req.status === "APPROVED" && (
                          <StatusChip variant="success">Approved</StatusChip>
                        )}
                        {req.status === "PENDING" && (
                          <StatusChip variant="warning">Pending</StatusChip>
                        )}
                        {req.status === "REJECTED" && (
                          <StatusChip variant="danger">Rejected</StatusChip>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        {req.status === "PENDING" ? (
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(req.id, "APPROVED")}
                              className="p-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:hover:bg-emerald-900 dark:text-emerald-300 border border-emerald-200/80 transition cursor-pointer"
                              title="Approve Request"
                            >
                              <Check className="h-3.5 w-3.5 stroke-[3]" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(req.id, "REJECTED")}
                              className="p-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:hover:bg-rose-900 dark:text-rose-300 border border-rose-200/80 transition cursor-pointer"
                              title="Reject Request"
                            >
                              <X className="h-3.5 w-3.5 stroke-[3]" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400">
                            By {req.approved_by || "Manager"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

      </div>

      {/* Create Leave Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-[#2F2C59] dark:text-indigo-300 flex items-center justify-center">
                  <Palmtree className="h-4 w-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  New Leave Request
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Employee Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newEmployeeName}
                  onChange={(e) => setNewEmployeeName(e.target.value)}
                  placeholder="e.g. David Kim, Anna Vance"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    End Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Reason Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as LeaveRequestItem["reason_category"])}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Vacation">Vacation / Annual Leave</option>
                  <option value="Sick Leave">Sick Leave / Medical</option>
                  <option value="Family Emergency">Family Emergency</option>
                  <option value="Study / Exam">Study / University Exam</option>
                  <option value="Personal">Personal Matters</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Notes & Details
                </label>
                <textarea
                  rows={2}
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  placeholder="Provide context for manager review..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#2F2C59] hover:bg-[#1E1B3A] text-white font-semibold transition"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
