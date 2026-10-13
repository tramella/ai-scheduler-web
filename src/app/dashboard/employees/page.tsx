"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  CheckCircle2,
  Users,
  UserCheck,
  Clock,
  Briefcase,
  X,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import {
  EmployeeProfile,
  INITIAL_EMPLOYEES,
  EmployeeHeader,
  EmployeeToolbar,
  EmployeeTable,
  EmployeeCards,
  AddEmployeeModal,
  EditEmployeeModal,
} from "@/components/dashboard/employee";
import { Pagination } from "@/components/ui/Pagination";
import { KpiCard } from "@/components/ui/KpiCard";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<EmployeeProfile[]>(INITIAL_EMPLOYEES);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // Modal State & Toast
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<EmployeeProfile | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
    const onLeave = employees.filter((e) => e.status === "On Leave").length;
    const fullTime = employees.filter((e) => e.employmentType === "Full-time").length;
    const partTime = employees.filter((e) => e.employmentType === "Part-time").length;
    return { total, active, onLeave, fullTime, partTime };
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

  const handleAddEmployee = (newEmployeeData: {
    name: string;
    role: string;
    employmentType: "Full-time" | "Part-time" | "Contract";
    targetHours: number;
    location: string;
    email?: string;
    phone?: string;
  }) => {
    const nextIdNum = employees.length + 1;
    const nextId = `NV${String(nextIdNum).padStart(3, "0")}`;

    const newEmp: EmployeeProfile = {
      id: nextId,
      name: newEmployeeData.name,
      role: newEmployeeData.role,
      department: newEmployeeData.role.includes("Barista")
        ? "Bar & Beverage"
        : newEmployeeData.role.includes("Cashier")
        ? "Front of House"
        : "Store Operations",
      employmentType: newEmployeeData.employmentType,
      location: newEmployeeData.location,
      locationId: newEmployeeData.location.includes("District 1") ? "LOC_01" : "LOC_02",
      email:
        newEmployeeData.email ||
        `${newEmployeeData.name.toLowerCase().replace(/\s+/g, ".")}@orbitweave.io`,
      phone: newEmployeeData.phone || `0901 234 ${String(500 + nextIdNum)}`,
      targetHours: newEmployeeData.targetHours,
      scheduledHours: newEmployeeData.targetHours,
      status: "Active",
      skills: ["Customer Service", "Standard Operations"],
      joinDate: "Oct 2026",
    };

    setEmployees((prev) => [newEmp, ...prev]);
    setIsAddModalOpen(false);
    showToast(`Added ${newEmp.name} (${newEmp.id}) to employee directory.`);
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

  const handleSaveEmployee = (updated: EmployeeProfile) => {
    setEmployees((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
    setEditingEmployee(null);
    showToast(`Updated employee details for ${updated.name} (${updated.id}).`);
  };

  const paginationElement = (
    <Pagination
      currentPage={safePage}
      totalPages={totalPages}
      totalItems={filteredEmployees.length}
      pageSize={pageSize}
      itemLabel="personnel"
      onPageChange={setCurrentPage}
      onPageSizeChange={(size) => {
        setPageSize(size);
        setCurrentPage(1);
      }}
    />
  );

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Toast Notification */}
        {toastMessage && (
          <div
            role="status"
            className="fixed top-20 right-6 z-50 rounded-xl bg-[#2F2C59] dark:bg-indigo-600 text-white px-4 py-2.5 text-xs font-semibold shadow-lg flex items-center space-x-2 animate-in fade-in slide-in-from-top-2"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-300 shrink-0" />
            <span className="flex-1">{toastMessage}</span>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="text-white/70 hover:text-white ml-1 p-0.5"
              aria-label="Dismiss toast"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}

        {/* 1. Header */}
        <EmployeeHeader
          activeCount={metrics.active}
          totalCount={metrics.total}
          onAddEmployee={() => setIsAddModalOpen(true)}
        />

        {/* 2. Four KPI Blocks */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          <KpiCard
            label="Total staff"
            value={metrics.total}
            chip="100% enrolled"
            chipVariant="neutral"
            note={`${metrics.total} total staff records`}
            icon={Users}
            iconVariant="blue"
          >
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-[#2F5BFF] w-full rounded-full" />
            </div>
          </KpiCard>

          <KpiCard
            label="Active on duty"
            value={metrics.active}
            chip={`${Math.round((metrics.active / metrics.total) * 100)}% active`}
            chipVariant="success"
            note={`${metrics.active} available for shift roster`}
            icon={UserCheck}
            iconVariant="emerald"
          >
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${(metrics.active / metrics.total) * 100}%` }}
              />
            </div>
          </KpiCard>

          <KpiCard
            label="On leave / away"
            value={metrics.onLeave}
            chip={metrics.onLeave > 0 ? "Temporary leave" : "None away"}
            chipVariant="warning"
            note={`${metrics.onLeave} personnel currently away`}
            icon={Clock}
            iconVariant="orange"
          >
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#FF7A59] rounded-full"
                style={{ width: `${(metrics.onLeave / metrics.total) * 100}%` }}
              />
            </div>
          </KpiCard>

          <KpiCard
            label="Employment mix"
            value={`${metrics.fullTime} FT`}
            chip={`${metrics.partTime} PT`}
            chipVariant="info"
            note={`${metrics.fullTime} full-time, ${metrics.partTime} part-time`}
            icon={Briefcase}
            iconVariant="indigo"
          >
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-[#2F2C59] dark:bg-indigo-400"
                style={{ width: `${(metrics.fullTime / metrics.total) * 100}%` }}
              />
              <div
                className="h-full bg-indigo-300 dark:bg-indigo-600"
                style={{ width: `${(metrics.partTime / metrics.total) * 100}%` }}
              />
            </div>
          </KpiCard>
        </div>

        {/* 3. Toolbar & Filters */}
        <EmployeeToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedRole={selectedRole}
          onRoleChange={setSelectedRole}
          roles={roles}
          totalEmployeesCount={metrics.total}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          fullTimeCount={metrics.fullTime}
          partTimeCount={metrics.partTime}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          onResetFilters={() => {
            setSearchTerm("");
            setSelectedRole("all");
            setSelectedType("all");
            setSelectedStatus("all");
            setSelectedLocation("all");
          }}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* 4. Data View (Table or Cards) with Pagination */}
        {viewMode === "table" ? (
          <>
            <div className="hidden md:block">
              <EmployeeTable
                employees={paginatedEmployees}
                searchTerm={searchTerm}
                onToggleStatus={handleToggleStatus}
                onEditEmployee={setEditingEmployee}
                onDeleteEmployee={handleDeleteEmployee}
                pagination={paginationElement}
              />
            </div>
            <div className="block md:hidden">
              <EmployeeCards
                employees={paginatedEmployees}
                searchTerm={searchTerm}
                onToggleStatus={handleToggleStatus}
                onEditEmployee={setEditingEmployee}
                onDeleteEmployee={handleDeleteEmployee}
                pagination={paginationElement}
              />
            </div>
          </>
        ) : (
          <EmployeeCards
            employees={paginatedEmployees}
            searchTerm={searchTerm}
            onToggleStatus={handleToggleStatus}
            onEditEmployee={setEditingEmployee}
            onDeleteEmployee={handleDeleteEmployee}
            pagination={paginationElement}
          />
        )}

        {/* 5. Add Employee Modal */}
        <AddEmployeeModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddEmployee}
        />

        {/* 6. Edit Employee Modal */}
        <EditEmployeeModal
          employee={editingEmployee}
          isOpen={Boolean(editingEmployee)}
          onClose={() => setEditingEmployee(null)}
          onSave={handleSaveEmployee}
        />
      </div>
    </DashboardLayout>
  );
}
