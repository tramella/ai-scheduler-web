"use client";

import React, { useState, useMemo, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
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
          <div className="fixed top-20 right-6 z-50 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-2.5 text-xs font-semibold shadow-lg animate-in fade-in slide-in-from-top-2 flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 dark:text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 1. Header */}
        <EmployeeHeader
          activeCount={metrics.active}
          totalCount={metrics.total}
          onAddEmployee={() => setIsAddModalOpen(true)}
        />

        {/* 2. Toolbar & Filters */}
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

        {/* 3. Data View (Table or Cards) with Pagination */}
        {viewMode === "table" ? (
          <EmployeeTable
            employees={paginatedEmployees}
            searchTerm={searchTerm}
            onToggleStatus={handleToggleStatus}
            onEditEmployee={setEditingEmployee}
            onDeleteEmployee={handleDeleteEmployee}
            pagination={paginationElement}
          />
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

        {/* 4. Add Employee Modal */}
        <AddEmployeeModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddEmployee}
        />

        {/* 5. Edit Employee Modal */}
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
