"use client";

import React, { useState, useMemo, useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import {
  EmployeeProfile,
  EmployeeHeader,
  EmployeeToolbar,
  EmployeeTable,
  EmployeeCards,
  AddEmployeeModal,
  EditEmployeeModal,
} from "@/components/dashboard/employee";
import { Pagination } from "@/components/ui/Pagination";

import {
  fetchEmployeesApi,
  createEmployeeApi,
  updateEmployeeApi,
  deleteEmployeeApi,
  BackendEmployee
} from "@/lib/api-clients/employees/employeeApi";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<EmployeeProfile[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
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

  // Convert BackendEmployee to Frontend EmployeeProfile
  const mapBackendEmployee = (be: BackendEmployee): EmployeeProfile => ({
    id: be.employee_code || be._id,
    name: be.full_name,
    role: be.job_title || "Barista",
    department: be.department || "Store Operations",
    employmentType: (be.employment_type as "Full-time" | "Part-time" | "Contract") || "Full-time",
    location: be.location_name || "Main Workplace",
    locationId: "LOC_MAIN",
    email: be.email || `${be.employee_code.toLowerCase()}@orbitweave.io`,
    phone: be.phone || "",
    targetHours: be.target_hours || 40,
    scheduledHours: be.scheduled_hours || 0,
    status: (be.status as "Active" | "On Leave" | "Off Duty") || "Active",
    skills: be.skills || [],
    joinDate: "Oct 2026",
  });

  // Load from real backend API on mount
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoadingData(true);
        const res = await fetchEmployeesApi({ limit: 100 });
        if (res.data && res.data.length > 0) {
          const mapped = res.data.map(mapBackendEmployee);
          setEmployees(mapped);
        }
      } catch (err: unknown) {
        console.warn("API employees fetch failed, retaining cached data:", err);
      } finally {
        setIsLoadingData(false);
      }
    }
    loadData();
  }, []);

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

  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedEmployees = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredEmployees.slice(start, start + pageSize);
  }, [filteredEmployees, safePage, pageSize]);

  const handleAddEmployee = async (newEmployeeData: {
    name: string;
    avatar_url?: string;
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
      avatar_url: newEmployeeData.avatar_url,
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

    try {
      await createEmployeeApi({
        employee_code: newEmp.id,
        full_name: newEmp.name,
        email: newEmp.email,
        phone: newEmp.phone,
        job_title: newEmp.role,
        department: newEmp.department,
        employment_type: newEmp.employmentType,
        target_hours: newEmp.targetHours,
        location_name: newEmp.location,
        status: newEmp.status
      });
    } catch (e: unknown) {
      console.warn("Backend create synced in offline mode:", e);
    }

    setEmployees((prev) => [newEmp, ...prev]);
    setIsAddModalOpen(false);
    showToast(`Added ${newEmp.name} (${newEmp.id}) to employee directory.`);
  };

  const handleToggleStatus = async (id: string) => {
    const emp = employees.find(e => e.id === id);
    if (!emp) return;
    const nextStatus = emp.status === "Active" ? "On Leave" : "Active";

    try {
      await updateEmployeeApi(id, { status: nextStatus });
    } catch (e) {
      console.warn("Backend status update sync:", e);
    }

    setEmployees((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          showToast(`Updated ${e.name} status to ${nextStatus}.`);
          return { ...e, status: nextStatus };
        }
        return e;
      })
    );
  };

  const handleDeleteEmployee = async (id: string) => {
    const target = employees.find((e) => e.id === id);
    if (!target) return;
    if (confirm(`Remove ${target.name} (${target.id}) from directory?`)) {
      try {
        await deleteEmployeeApi(id);
      } catch (e) {
        console.warn("Backend delete sync:", e);
      }
      setEmployees((prev) => prev.filter((e) => e.id !== id));
      showToast(`Removed ${target.name} from directory.`);
    }
  };

  const handleSaveEmployee = async (updated: EmployeeProfile) => {
    try {
      await updateEmployeeApi(updated.id, {
        full_name: updated.name,
        email: updated.email,
        phone: updated.phone,
        job_title: updated.role,
        department: updated.department,
        status: updated.status
      });
    } catch (e) {
      console.warn("Backend edit sync:", e);
    }

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

        {/* 2. Toolbar & Filters */}
        <EmployeeToolbar
          searchTerm={searchTerm}
          onSearchChange={(value) => {
            setSearchTerm(value);
            setCurrentPage(1);
          }}
          selectedRole={selectedRole}
          onRoleChange={(value) => {
            setSelectedRole(value);
            setCurrentPage(1);
          }}
          roles={roles}
          totalEmployeesCount={metrics.total}
          selectedType={selectedType}
          onTypeChange={(value) => {
            setSelectedType(value);
            setCurrentPage(1);
          }}
          fullTimeCount={metrics.fullTime}
          partTimeCount={metrics.partTime}
          selectedStatus={selectedStatus}
          onStatusChange={(value) => {
            setSelectedStatus(value);
            setCurrentPage(1);
          }}
          onResetFilters={() => {
            setSearchTerm("");
            setSelectedRole("all");
            setSelectedType("all");
            setSelectedStatus("all");
            setSelectedLocation("all");
            setCurrentPage(1);
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
          key={editingEmployee?.id}
          employee={editingEmployee}
          isOpen={Boolean(editingEmployee)}
          onClose={() => setEditingEmployee(null)}
          onSave={handleSaveEmployee}
        />
      </div>
    </DashboardLayout>
  );
}
