"use client";

import React, { useState, useMemo, useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import {
  ConstraintRule,
  INITIAL_CONSTRAINTS,
  ConstraintHeader,
  ConstraintToolbar,
  ConstraintTable,
  ConstraintCards,
  AddConstraintModal,
  EditConstraintModal,
} from "@/components/dashboard/constraints";
import { Pagination } from "@/components/ui/Pagination";

export default function ConstraintsPage() {
  const [constraints, setEmployees] = useState<ConstraintRule[]>(INITIAL_CONSTRAINTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // Modal State & Toast
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingConstraint, setEditingConstraint] = useState<ConstraintRule | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered constraints
  const filteredConstraints = useMemo(() => {
    return constraints.filter((rule) => {
      const matchesSearch =
        rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rule.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rule.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rule.scope.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = selectedType === "all" || rule.type === selectedType;
      const matchesCategory = selectedCategory === "all" || rule.category === selectedCategory;
      const matchesStatus = selectedStatus === "all" || rule.status === selectedStatus;

      return matchesSearch && matchesType && matchesCategory && matchesStatus;
    });
  }, [constraints, searchTerm, selectedType, selectedCategory, selectedStatus]);

  // Summary Metrics
  const metrics = useMemo(() => {
    const hardCount = constraints.filter((c) => c.type === "hard").length;
    const softCount = constraints.filter((c) => c.type === "soft").length;
    const totalActive = constraints.filter((c) => c.status === "Active").length;
    return { hardCount, softCount, totalActive };
  }, [constraints]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedType, selectedCategory, selectedStatus]);

  const totalPages = Math.max(1, Math.ceil(filteredConstraints.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedConstraints = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredConstraints.slice(start, start + pageSize);
  }, [filteredConstraints, safePage, pageSize]);

  const handleToggleStatus = (id: string) => {
    setEmployees((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextStatus = c.status === "Active" ? "Paused" : "Active";
          showToast(`Rule ${c.code} (${c.name}) is now ${nextStatus}.`);
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  const handleAddConstraint = (newRuleData: Omit<ConstraintRule, "id" | "updatedAt">) => {
    const nextIdNum = constraints.length + 1;
    const nextId = `CST${String(nextIdNum).padStart(3, "0")}`;

    const newRule: ConstraintRule = {
      ...newRuleData,
      id: nextId,
      updatedAt: "Just now",
    };

    setEmployees((prev) => [newRule, ...prev]);
    setIsAddModalOpen(false);
    showToast(`Added constraint ${newRule.code}: ${newRule.name}.`);
  };

  const handleSaveConstraint = (updatedRule: ConstraintRule) => {
    setEmployees((prev) => prev.map((c) => (c.id === updatedRule.id ? updatedRule : c)));
    setEditingConstraint(null);
    showToast(`Updated constraint ${updatedRule.code}: ${updatedRule.name}.`);
  };

  const handleDeleteConstraint = (id: string) => {
    const target = constraints.find((c) => c.id === id);
    if (!target) return;
    if (confirm(`Delete constraint ${target.code} (${target.name})?`)) {
      setEmployees((prev) => prev.filter((c) => c.id !== id));
      showToast(`Removed rule ${target.code} from constraints.`);
    }
  };

  const paginationElement = (
    <Pagination
      currentPage={safePage}
      totalPages={totalPages}
      totalItems={filteredConstraints.length}
      pageSize={pageSize}
      itemLabel="constraints"
      pageSizeOptions={[6, 8, 12, 20]}
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
          <div className="fixed top-20 right-6 z-50 rounded-full bg-[#2F2C59] dark:bg-indigo-600 text-white px-4 py-2 text-xs font-semibold shadow-lg animate-in fade-in slide-in-from-top-2 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span className="flex-1">{toastMessage}</span>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="text-white/70 hover:text-white ml-1 p-0.5 cursor-pointer"
              aria-label="Dismiss toast"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}

        {/* 1. Header */}
        <ConstraintHeader
          hardCount={metrics.hardCount}
          softCount={metrics.softCount}
          totalActive={metrics.totalActive}
          onAddConstraint={() => setIsAddModalOpen(true)}
        />

        {/* 2. Toolbar & Filters */}
        <ConstraintToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          hardCount={metrics.hardCount}
          softCount={metrics.softCount}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          onResetFilters={() => {
            setSearchTerm("");
            setSelectedType("all");
            setSelectedCategory("all");
            setSelectedStatus("all");
          }}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* 3. Data View (Table or Cards) with Pagination */}
        {viewMode === "table" ? (
          <>
            <div className="hidden md:block">
              <ConstraintTable
                constraints={paginatedConstraints}
                searchTerm={searchTerm}
                onToggleStatus={handleToggleStatus}
                onEditConstraint={setEditingConstraint}
                onDeleteConstraint={handleDeleteConstraint}
                pagination={paginationElement}
              />
            </div>
            <div className="block md:hidden">
              <ConstraintCards
                constraints={paginatedConstraints}
                searchTerm={searchTerm}
                onToggleStatus={handleToggleStatus}
                onEditConstraint={setEditingConstraint}
                onDeleteConstraint={handleDeleteConstraint}
                pagination={paginationElement}
              />
            </div>
          </>
        ) : (
          <ConstraintCards
            constraints={paginatedConstraints}
            searchTerm={searchTerm}
            onToggleStatus={handleToggleStatus}
            onEditConstraint={setEditingConstraint}
            onDeleteConstraint={handleDeleteConstraint}
            pagination={paginationElement}
          />
        )}

        {/* 4. Add Constraint Modal */}
        <AddConstraintModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddConstraint}
        />

        {/* 5. Edit Constraint Modal */}
        <EditConstraintModal
          constraint={editingConstraint}
          isOpen={Boolean(editingConstraint)}
          onClose={() => setEditingConstraint(null)}
          onSave={handleSaveConstraint}
        />
      </div>
    </DashboardLayout>
  );
}
