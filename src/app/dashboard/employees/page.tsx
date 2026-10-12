"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Filter,
  Plus,
  ArrowRight,
  Building2,
  Mail,
  Phone,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Calendar,
  Sparkles,
  Edit2,
  Trash2,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

export interface EmployeeProfile {
  id: string;
  name: string;
  role: string;
  department: string;
  employmentType: "Full-time" | "Part-time" | "Contract";
  location: string;
  locationId: string;
  email: string;
  phone: string;
  targetHours: number;
  scheduledHours: number;
  status: "Active" | "On Leave" | "Off Duty";
  skills: string[];
  joinDate: string;
}

const INITIAL_EMPLOYEES: EmployeeProfile[] = [
  {
    id: "NV001",
    name: "Nguyễn Văn An",
    role: "Shift Supervisor",
    department: "Store Operations",
    employmentType: "Full-time",
    location: "Flagship Store (District 1)",
    locationId: "LOC_01",
    email: "an.nguyen@orbitweave.io",
    phone: "0901 234 501",
    targetHours: 40,
    scheduledHours: 40,
    status: "Active",
    skills: ["Team Leadership", "Cash Audit", "Food Safety"],
    joinDate: "Jan 15, 2024",
  },
  {
    id: "NV002",
    name: "Trần Thị Bích",
    role: "Senior Barista",
    department: "Bar & Beverage",
    employmentType: "Full-time",
    location: "Flagship Store (District 1)",
    locationId: "LOC_01",
    email: "bich.tran@orbitweave.io",
    phone: "0901 234 502",
    targetHours: 40,
    scheduledHours: 38,
    status: "Active",
    skills: ["Espresso Calibration", "Latte Art", "Inventory"],
    joinDate: "Mar 10, 2024",
  },
  {
    id: "NV003",
    name: "Lê Hoàng Cường",
    role: "Cashier",
    department: "Front of House",
    employmentType: "Full-time",
    location: "Flagship Store (District 1)",
    locationId: "LOC_01",
    email: "cuong.le@orbitweave.io",
    phone: "0901 234 503",
    targetHours: 40,
    scheduledHours: 40,
    status: "Active",
    skills: ["POS Mastery", "Customer Service", "Fast Reconciliation"],
    joinDate: "May 02, 2024",
  },
  {
    id: "NV004",
    name: "Phạm Minh Đức",
    role: "Barista",
    department: "Bar & Beverage",
    employmentType: "Part-time",
    location: "Flagship Store (District 1)",
    locationId: "LOC_01",
    email: "duc.pham@orbitweave.io",
    phone: "0901 234 504",
    targetHours: 24,
    scheduledHours: 24,
    status: "Active",
    skills: ["Coffee Brewing", "Equipment Maintenance"],
    joinDate: "Jul 18, 2024",
  },
  {
    id: "NV005",
    name: "Hoàng Mai Hương",
    role: "Cashier",
    department: "Front of House",
    employmentType: "Part-time",
    location: "Flagship Store (District 1)",
    locationId: "LOC_01",
    email: "huong.hoang@orbitweave.io",
    phone: "0901 234 505",
    targetHours: 20,
    scheduledHours: 20,
    status: "Active",
    skills: ["Cash Handling", "Loyalty Program Support"],
    joinDate: "Aug 12, 2024",
  },
  {
    id: "NV006",
    name: "Đỗ Gia Huy",
    role: "Kitchen Assistant",
    department: "Food Prep",
    employmentType: "Full-time",
    location: "Flagship Store (District 1)",
    locationId: "LOC_01",
    email: "huy.do@orbitweave.io",
    phone: "0901 234 506",
    targetHours: 40,
    scheduledHours: 36,
    status: "Active",
    skills: ["Prep Work", "Hygiene Standards", "Stock FIFO"],
    joinDate: "Feb 20, 2024",
  },
  {
    id: "NV007",
    name: "Vũ Tuấn Kiệt",
    role: "Security & Closing Lead",
    department: "Operations & Safety",
    employmentType: "Full-time",
    location: "Flagship Store (District 1)",
    locationId: "LOC_01",
    email: "kiet.vu@orbitweave.io",
    phone: "0901 234 507",
    targetHours: 44,
    scheduledHours: 44,
    status: "Active",
    skills: ["Premises Security", "Closing Checklists", "Emergency First Aid"],
    joinDate: "Dec 01, 2023",
  },
  {
    id: "NV008",
    name: "Bùi Ngọc Linh",
    role: "Maintenance / Stock",
    department: "Logistics",
    employmentType: "Full-time",
    location: "Flagship Store (District 1)",
    locationId: "LOC_01",
    email: "linh.bui@orbitweave.io",
    phone: "0901 234 508",
    targetHours: 40,
    scheduledHours: 0,
    status: "On Leave",
    skills: ["Machine Repair", "Warehouse Storage", "Heavy Lifting"],
    joinDate: "Nov 15, 2023",
  },
  {
    id: "NV009",
    name: "Lý Khánh Nam",
    role: "Store Lead",
    department: "Management",
    employmentType: "Full-time",
    location: "Flagship Store (District 1)",
    locationId: "LOC_01",
    email: "nam.ly@orbitweave.io",
    phone: "0901 234 509",
    targetHours: 44,
    scheduledHours: 44,
    status: "Active",
    skills: ["P&L Oversight", "Staff Scheduling", "Compliance Audit"],
    joinDate: "Oct 10, 2023",
  },
  {
    id: "NV010",
    name: "Trịnh Thảo Nhi",
    role: "All-Round Staff",
    department: "Front of House",
    employmentType: "Part-time",
    location: "Flagship Store (District 1)",
    locationId: "LOC_01",
    email: "nhi.trinh@orbitweave.io",
    phone: "0901 234 510",
    targetHours: 24,
    scheduledHours: 24,
    status: "Active",
    skills: ["Beverage Service", "Table Turnover", "Speed of Service"],
    joinDate: "Sep 05, 2024",
  },
  {
    id: "NV011",
    name: "Đặng Quốc Bảo",
    role: "Barista",
    department: "Bar & Beverage",
    employmentType: "Part-time",
    location: "Express Branch (District 3)",
    locationId: "LOC_02",
    email: "bao.dang@orbitweave.io",
    phone: "0901 234 511",
    targetHours: 20,
    scheduledHours: 20,
    status: "Active",
    skills: ["Cold Brew Production", "Grinder Maintenance"],
    joinDate: "Oct 01, 2024",
  },
  {
    id: "NV012",
    name: "Phan Thu Hà",
    role: "Cashier",
    department: "Front of House",
    employmentType: "Part-time",
    location: "Express Branch (District 3)",
    locationId: "LOC_02",
    email: "ha.phan@orbitweave.io",
    phone: "0901 234 512",
    targetHours: 20,
    scheduledHours: 0,
    status: "Off Duty",
    skills: ["Customer Care", "Multilingual Support"],
    joinDate: "Oct 05, 2024",
  },
];

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<EmployeeProfile[]>(INITIAL_EMPLOYEES);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State for New Employee
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("Barista");
  const [newType, setNewType] = useState<"Full-time" | "Part-time">("Full-time");
  const [newTargetHours, setNewTargetHours] = useState(40);
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newLocation, setNewLocation] = useState("Flagship Store (District 1)");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Roles list
  const roles = useMemo(() => {
    const set = new Set<string>();
    employees.forEach((e) => set.add(e.role));
    return Array.from(set);
  }, [employees]);

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.phone.includes(searchTerm);

      const matchesRole = selectedRole === "all" || emp.role === selectedRole;
      const matchesType = selectedType === "all" || emp.employmentType === selectedType;
      const matchesLocation = selectedLocation === "all" || emp.location.includes(selectedLocation);
      const matchesStatus = selectedStatus === "all" || emp.status === selectedStatus;

      return matchesSearch && matchesRole && matchesType && matchesLocation && matchesStatus;
    });
  }, [employees, searchTerm, selectedRole, selectedType, selectedLocation, selectedStatus]);

  // Summary Metrics
  const metrics = useMemo(() => {
    const total = employees.length;
    const active = employees.filter((e) => e.status === "Active").length;
    const fullTime = employees.filter((e) => e.employmentType === "Full-time").length;
    const partTime = employees.filter((e) => e.employmentType === "Part-time").length;
    return { total, active, fullTime, partTime };
  }, [employees]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedRole, selectedType, selectedLocation, selectedStatus]);

  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedEmployees = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredEmployees.slice(start, start + pageSize);
  }, [filteredEmployees, safePage, pageSize]);

  const renderPagination = () => {
    if (filteredEmployees.length === 0) return null;

    const startItem = (safePage - 1) * pageSize + 1;
    const endItem = Math.min(safePage * pageSize, filteredEmployees.length);

    // Generate page numbers
    const pageNumbers: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      pageNumbers.push(1);
      if (safePage > 3) pageNumbers.push("...");
      const start = Math.max(2, safePage - 1);
      const end = Math.min(totalPages - 1, safePage + 1);
      for (let i = start; i <= end; i++) pageNumbers.push(i);
      if (safePage < totalPages - 2) pageNumbers.push("...");
      pageNumbers.push(totalPages);
    }

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400 py-3.5 px-4 sm:px-6">
        <div className="flex items-center space-x-3 text-xs">
          <span>
            Showing <strong className="text-slate-900 dark:text-white font-mono font-semibold">{startItem}</strong> to{" "}
            <strong className="text-slate-900 dark:text-white font-mono font-semibold">{endItem}</strong> of{" "}
            <strong className="text-slate-900 dark:text-white font-mono font-semibold">{filteredEmployees.length}</strong> personnel
          </span>

          <div className="hidden sm:flex items-center space-x-1 pl-3 border-l border-slate-200 dark:border-slate-800">
            <span className="text-[11px] text-slate-400">Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-0.5 text-[11px] font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden cursor-pointer"
            >
              <option value={6}>6</option>
              <option value={8}>8</option>
              <option value={12}>12</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center space-x-1">
            {pageNumbers.map((p, idx) => {
              if (p === "...") {
                return (
                  <span key={`dots-${idx}`} className="px-1 text-slate-400 select-none">
                    &hellip;
                  </span>
                );
              }
              const isCurrent = p === safePage;
              return (
                <button
                  key={`page-${p}`}
                  type="button"
                  onClick={() => setCurrentPage(Number(p))}
                  className={`min-w-[28px] h-7 px-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    isCurrent
                      ? "bg-[#2F2C59] dark:bg-indigo-600 text-white shadow-2xs font-bold"
                      : "border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const nextIdNum = employees.length + 1;
    const nextId = `NV${String(nextIdNum).padStart(3, "0")}`;

    const newEmp: EmployeeProfile = {
      id: nextId,
      name: newName.trim(),
      role: newRole,
      department: newRole.includes("Barista") ? "Bar & Beverage" : newRole.includes("Cashier") ? "Front of House" : "Store Operations",
      employmentType: newType,
      location: newLocation,
      locationId: newLocation.includes("District 1") ? "LOC_01" : "LOC_02",
      email: newEmail.trim() || `${newName.toLowerCase().replace(/\s+/g, ".")}@orbitweave.io`,
      phone: newPhone.trim() || `0901 234 ${String(500 + nextIdNum)}`,
      targetHours: Number(newTargetHours),
      scheduledHours: Number(newTargetHours),
      status: "Active",
      skills: ["Customer Service", "Standard Operations"],
      joinDate: "Oct 2026",
    };

    setEmployees((prev) => [newEmp, ...prev]);
    setIsAddModalOpen(false);
    showToast(`Added ${newEmp.name} (${newEmp.id}) to employee directory.`);

    // Reset Form
    setNewName("");
    setNewEmail("");
    setNewPhone("");
    setNewRole("Barista");
    setNewType("Full-time");
    setNewTargetHours(40);
  };

  const handleToggleStatus = (id: string) => {
    setEmployees((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          const nextStatus = e.status === "Active" ? "On Leave" : "Active";
          showToast(`Updated ${e.name} status to ${nextStatus}.`);
          return { ...e, status: nextStatus };
        }
        return e;
      })
    );
  };

  const handleDeleteEmployee = (id: string) => {
    const target = employees.find((e) => e.id === id);
    if (!target) return;
    if (confirm(`Remove ${target.name} (${target.id}) from directory?`)) {
      setEmployees((prev) => prev.filter((e) => e.id !== id));
      showToast(`Removed ${target.name} from directory.`);
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-2.5 text-xs font-semibold shadow-lg animate-in fade-in slide-in-from-top-2 flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 dark:text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* ================= 1. PAGE HEADER ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3.5 pb-4 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Staff Directory
              </span>
              <span>&bull;</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                {metrics.active}/{metrics.total} Active Personnel
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              Employees &amp; Roles
            </h1>
          </div>

          <div className="flex items-center space-x-2.5">
            <Link
              href="/dashboard/ai-studio"
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs transition active:scale-[0.99] cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
              <span>AI Scheduler</span>
            </Link>

            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#2F2C59] hover:bg-[#1E1B3A] dark:bg-indigo-600 dark:hover:bg-indigo-700 rounded-xl transition shadow-2xs active:scale-[0.99] cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Employee</span>
            </button>
          </div>
        </div>

        {/* ================= 2. FILTER & SEARCH CONTROL TOOLBAR ================= */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-2xs space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            
            {/* Left: Search Input & Dropdown Filters */}
            <div className="flex flex-wrap items-center gap-2.5 flex-1">
              
              {/* Search Bar */}
              <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
                <Search className="pointer-events-none absolute inset-y-0 left-0 h-3.5 w-3.5 my-auto ml-3 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search staff, ID, phone..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 py-1.5 pl-8.5 pr-8 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-1 focus:ring-[#2F5BFF] transition"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>

              {/* Role Dropdown */}
              <div className="relative">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="appearance-none rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 py-1.5 pl-3 pr-8 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-1 focus:ring-[#2F5BFF] transition cursor-pointer"
                >
                  <option value="all">All Roles ({employees.length})</option>
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
              </div>

              {/* Contract Type Dropdown */}
              <div className="relative">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="appearance-none rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 py-1.5 pl-3 pr-8 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-1 focus:ring-[#2F5BFF] transition cursor-pointer"
                >
                  <option value="all">All Contracts</option>
                  <option value="Full-time">Full-time ({metrics.fullTime})</option>
                  <option value="Part-time">Part-time ({metrics.partTime})</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
              </div>

              {/* Status Dropdown */}
              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="appearance-none rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 py-1.5 pl-3 pr-8 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-1 focus:ring-[#2F5BFF] transition cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Off Duty">Off Duty</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
              </div>

              {/* Reset Filters */}
              {(searchTerm || selectedRole !== "all" || selectedType !== "all" || selectedStatus !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedRole("all");
                    setSelectedType("all");
                    setSelectedStatus("all");
                  }}
                  className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <X className="h-3 w-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Right: View Mode Switcher */}
            <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-end md:self-auto shrink-0">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  viewMode === "table"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
                title="Table view"
              >
                <List className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("cards")}
                className={`p-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  viewMode === "cards"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
                title="Card grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>

          </div>
        </div>

        {/* ================= 4. EMPLOYEES DATA DISPLAY ================= */}
        {viewMode === "table" ? (
          <div className="rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                    <th className="py-3 px-4">Employee</th>
                    <th className="py-3 px-3">Role &amp; Skills</th>
                    <th className="py-3 px-3">Contract</th>
                    <th className="py-3 px-3">Weekly Target</th>
                    <th className="py-3 px-3">Store Location</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                  {filteredEmployees.length > 0 ? (
                    paginatedEmployees.map((emp) => {
                      const initial = emp.name.charAt(0);
                      const isFull = emp.scheduledHours >= emp.targetHours;

                      return (
                        <tr
                          key={emp.id}
                          className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition group"
                        >
                          {/* Col 1: Employee Identity */}
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#2F2C59] dark:bg-indigo-600 text-white font-extrabold text-xs shadow-2xs shrink-0">
                                {initial}
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                  {emp.name}
                                </div>
                                <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 mt-0.5">
                                  <span className="font-mono text-[9px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded font-bold text-slate-600 dark:text-slate-300">
                                    {emp.id}
                                  </span>
                                  <span className="truncate">{emp.email}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Col 2: Role & Skills */}
                          <td className="py-3 px-3">
                            <div>
                              <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                                {emp.role}
                              </span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {emp.skills.slice(0, 2).map((skill, sIdx) => (
                                  <span
                                    key={sIdx}
                                    className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                                  >
                                    {skill}
                                  </span>
                                ))}
                                {emp.skills.length > 2 && (
                                  <span className="text-[9px] text-slate-400 self-center">
                                    +{emp.skills.length - 2}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Col 3: Contract */}
                          <td className="py-3 px-3">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                                emp.employmentType === "Full-time"
                                  ? "bg-indigo-50 dark:bg-indigo-950/60 text-[#2F2C59] dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50"
                                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                              }`}
                            >
                              {emp.employmentType}
                            </span>
                          </td>

                          {/* Col 4: Weekly Target Hours & Progress */}
                          <td className="py-3 px-3">
                            <div className="w-28 space-y-1">
                              <div className="flex items-center justify-between text-[11px] font-mono">
                                <span className="font-bold text-slate-800 dark:text-slate-200">
                                  {emp.scheduledHours}h
                                </span>
                                <span className="text-slate-400">/{emp.targetHours}h</span>
                              </div>
                              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-300 ${
                                    isFull ? "bg-emerald-500 w-full" : "bg-indigo-500 w-3/4"
                                  }`}
                                />
                              </div>
                            </div>
                          </td>

                          {/* Col 5: Location */}
                          <td className="py-3 px-3">
                            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 truncate block max-w-[160px]">
                              {emp.location.split(" (")[0]}
                            </span>
                          </td>

                          {/* Col 6: Status */}
                          <td className="py-3 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(emp.id)}
                              className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold cursor-pointer transition ${
                                emp.status === "Active"
                                  ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60"
                                  : emp.status === "On Leave"
                                  ? "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60"
                                  : "bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200/60 dark:border-slate-700/60"
                              }`}
                              title="Click to toggle status"
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  emp.status === "Active"
                                    ? "bg-emerald-500"
                                    : emp.status === "On Leave"
                                    ? "bg-amber-500"
                                    : "bg-slate-400"
                                }`}
                              />
                              <span>{emp.status}</span>
                            </button>
                          </td>

                          {/* Col 7: Actions */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end space-x-1.5">
                              <button
                                type="button"
                                onClick={() => handleToggleStatus(emp.id)}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                                title="Toggle status"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteEmployee(emp.id)}
                                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                                title="Delete employee"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-xs text-slate-400">
                        No employees found matching &ldquo;{searchTerm}&rdquo;.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination for Table */}
            {filteredEmployees.length > 0 && (
              <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                {renderPagination()}
              </div>
            )}
          </div>
        ) : (
          /* ================= GRID CARDS VIEW ================= */
          <div className="space-y-4">
            {paginatedEmployees.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedEmployees.map((emp) => {
                  const initial = emp.name.charAt(0);

                  return (
                    <div
                      key={emp.id}
                      className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs hover:shadow-xs transition space-y-3.5"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2F2C59] dark:bg-indigo-600 text-white font-extrabold text-sm shadow-2xs">
                            {initial}
                          </div>
                          <div>
                            <h3 className="font-bold text-xs text-slate-900 dark:text-white">
                              {emp.name}
                            </h3>
                            <span className="font-mono text-[10px] text-slate-400">{emp.id} &bull; {emp.employmentType}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleToggleStatus(emp.id)}
                          className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold cursor-pointer ${
                            emp.status === "Active"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                              : "bg-amber-50 text-amber-700 border border-amber-200/60"
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${emp.status === "Active" ? "bg-emerald-500" : "bg-amber-500"}`} />
                          <span>{emp.status}</span>
                        </button>
                      </div>

                      <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                        <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                          <span className="text-[11px]">Primary Role:</span>
                          <strong className="text-slate-800 dark:text-slate-200">{emp.role}</strong>
                        </div>

                        <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                          <span className="text-[11px]">Weekly Target:</span>
                          <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                            {emp.scheduledHours}h / {emp.targetHours}h
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                          <span className="text-[11px]">Branch:</span>
                          <span className="text-[11px] truncate max-w-[150px]">{emp.location.split(" (")[0]}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {emp.skills.slice(0, 2).map((s, idx) => (
                            <span key={idx} className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                              {s}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center space-x-1">
                          <button
                            type="button"
                            onClick={() => handleDeleteEmployee(emp.id)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 py-12 text-center text-xs text-slate-400 shadow-2xs">
                No employees found matching &ldquo;{searchTerm}&rdquo;.
              </div>
            )}

            {/* Pagination for Cards */}
            {filteredEmployees.length > 0 && (
              <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
                {renderPagination()}
              </div>
            )}
          </div>
        )}

        {/* ================= 5. ADD EMPLOYEE MODAL ================= */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
              onClick={() => setIsAddModalOpen(false)}
            />

            <div className="relative w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-[#2F2C59] dark:text-indigo-400">
                    <Plus className="h-4 w-4" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Add New Employee
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleAddEmployee} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Nguyễn Văn Hùng"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 p-2 text-xs text-slate-900 dark:text-white focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#2F5BFF]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Certified Role
                    </label>
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 p-2 text-xs text-slate-900 dark:text-white focus:bg-white focus:outline-hidden cursor-pointer"
                    >
                      <option value="Shift Supervisor">Shift Supervisor</option>
                      <option value="Senior Barista">Senior Barista</option>
                      <option value="Barista">Barista</option>
                      <option value="Cashier">Cashier</option>
                      <option value="Kitchen Assistant">Kitchen Assistant</option>
                      <option value="Security & Closing Lead">Security Lead</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Employment Type
                    </label>
                    <select
                      value={newType}
                      onChange={(e) => {
                        const val = e.target.value as "Full-time" | "Part-time";
                        setNewType(val);
                        setNewTargetHours(val === "Full-time" ? 40 : 20);
                      }}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 p-2 text-xs text-slate-900 dark:text-white focus:bg-white focus:outline-hidden cursor-pointer"
                    >
                      <option value="Full-time">Full-time (40h)</option>
                      <option value="Part-time">Part-time (20h)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Target Hours / Wk
                    </label>
                    <input
                      type="number"
                      min={10}
                      max={60}
                      value={newTargetHours}
                      onChange={(e) => setNewTargetHours(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 p-2 text-xs text-slate-900 dark:text-white focus:bg-white focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Home Location
                    </label>
                    <select
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 p-2 text-xs text-slate-900 dark:text-white focus:bg-white focus:outline-hidden cursor-pointer"
                    >
                      <option value="Flagship Store (District 1)">Flagship Store (D1)</option>
                      <option value="Express Branch (District 3)">Express Branch (D3)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#2F2C59] hover:bg-[#1E1B3A] dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
                  >
                    Save Employee
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
