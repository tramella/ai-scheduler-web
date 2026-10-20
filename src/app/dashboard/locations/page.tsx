"use client";

import React, { useState, useMemo } from "react";
import {
  MapPin,
  Plus,
  Search,
  Building2,
  Clock,
  Users,
  Check,
  X,
  Edit2,
  Store,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { KpiCard } from "@/components/ui/KpiCard";
import { Card } from "@/components/ui/Card";
import { PillButton } from "@/components/ui/PillButton";
import { StatusChip } from "@/components/ui/StatusChip";
import { fetchLocationsApi, createLocationApi } from "@/lib/api-clients/locations/locationsApi";

export interface LocationItem {
  id: string;
  code: string;
  name: string;
  address: string;
  timezone: string;
  open_days: string[];
  working_hours: {
    open: string;
    close: string;
  };
  max_capacity: number;
  current_staff_count: number;
  status: "Active" | "Inactive";
  manager_name: string;
}

export default function LocationsPage() {
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "Active" | "Inactive">("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<LocationItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  React.useEffect(() => {
    async function loadLocations() {
      try {
        const res = await fetchLocationsApi();
        if (res.data && res.data.length > 0) {
          const mapped: LocationItem[] = res.data.map((l: any) => ({
            id: l._id || l.id,
            code: l.code || "LOC_STORE",
            name: l.name,
            address: l.address || "Ho Chi Minh City",
            timezone: l.timezone || "Asia/Ho_Chi_Minh",
            open_days: l.open_days || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            working_hours: l.working_hours || { open: "07:00", close: "22:30" },
            max_capacity: 16,
            current_staff_count: 5,
            status: "Active",
            manager_name: "Store Manager"
          }));
          setLocations(mapped);
        }
      } catch (e) {
        console.warn("Backend locations fallback:", e);
      }
    }
    loadLocations();
  }, []);

  // Form State
  const [formCode, setFormCode] = useState("");
  const [formName, setFormName] = useState("");
  const [formAddress, setFormAddress] = useState("");
  const [formOpenTime, setFormOpenTime] = useState("07:00");
  const [formCloseTime, setFormCloseTime] = useState("22:30");
  const [formCapacity, setFormCapacity] = useState<number>(16);
  const [formManager, setFormManager] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // KPIs
  const metrics = useMemo(() => {
    const total = locations.length;
    const active = locations.filter((l) => l.status === "Active").length;
    const totalCapacity = locations.reduce((sum, l) => sum + l.max_capacity, 0);
    const assignedStaff = locations.reduce((sum, l) => sum + l.current_staff_count, 0);
    return { total, active, totalCapacity, assignedStaff };
  }, [locations]);

  // Filtered List
  const filteredLocations = useMemo(() => {
    return locations.filter((loc) => {
      const matchesSearch =
        loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loc.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loc.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loc.manager_name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "ALL" || loc.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [locations, searchTerm, statusFilter]);

  const handleOpenModal = (location?: LocationItem) => {
    if (location) {
      setEditingLocation(location);
      setFormCode(location.code);
      setFormName(location.name);
      setFormAddress(location.address);
      setFormOpenTime(location.working_hours.open);
      setFormCloseTime(location.working_hours.close);
      setFormCapacity(location.max_capacity);
      setFormManager(location.manager_name);
    } else {
      setEditingLocation(null);
      setFormCode(`LOC-D${locations.length + 1}-STORE`);
      setFormName("");
      setFormAddress("");
      setFormOpenTime("07:00");
      setFormCloseTime("22:30");
      setFormCapacity(16);
      setFormManager("");
    }
    setIsModalOpen(true);
  };

  const handleSaveLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName) return;

    if (editingLocation) {
      setLocations((prev) =>
        prev.map((l) =>
          l.id === editingLocation.id
            ? {
                ...l,
                code: formCode,
                name: formName,
                address: formAddress,
                working_hours: { open: formOpenTime, close: formCloseTime },
                max_capacity: formCapacity,
                manager_name: formManager || l.manager_name,
              }
            : l
        )
      );
      showToast(`Location "${formName}" updated.`);
    } else {
      const newLoc: LocationItem = {
        id: `LOC-${locations.length + 1}`,
        code: formCode || `LOC-NEW-${locations.length + 1}`,
        name: formName,
        address: formAddress || "District 1, Ho Chi Minh City",
        timezone: "Asia/Ho_Chi_Minh",
        open_days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        working_hours: { open: formOpenTime, close: formCloseTime },
        max_capacity: formCapacity,
        current_staff_count: 0,
        status: "Active",
        manager_name: formManager || "Lead Supervisor",
      };

      createLocationApi({
        code: newLoc.code,
        name: newLoc.name,
        address: newLoc.address,
        timezone: newLoc.timezone,
        open_days: newLoc.open_days,
        working_hours: newLoc.working_hours
      }).catch(err => console.warn("Location sync:", err));

      setLocations([newLoc, ...locations]);
      showToast(`New location "${formName}" added successfully.`);
    }

    setIsModalOpen(false);
  };

  const handleToggleStatus = (id: string) => {
    setLocations((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, status: l.status === "Active" ? "Inactive" : "Active" } : l
      )
    );
    showToast(`Store status toggled.`);
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* Toast */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 rounded-full bg-[#2F2C59] text-white px-5 py-2.5 shadow-lg border border-indigo-400/40 text-xs font-semibold flex items-center space-x-2 animate-in fade-in slide-in-from-top-2">
            <Check className="h-4 w-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Page Header */}
        <PageHeader
          eyebrow="Multi-Store Architecture"
          title="Store Locations"
          description="Configure physical stores, branch operating hours, staffing capacities, and station layouts."
          actions={
            <PillButton variant="primary" onClick={() => handleOpenModal()}>
              <Plus className="h-4 w-4" />
              <span>Add Location</span>
            </PillButton>
          }
        />

        {/* 4 Summary KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Active Locations"
            value={metrics.active}
            note={`of ${metrics.total} total`}
            icon={Store}
            iconVariant="emerald"
            valueClass="text-emerald-600 dark:text-emerald-400"
          />
          <KpiCard
            label="Total Capacity"
            value={metrics.totalCapacity}
            note="max staff slots"
            icon={Users}
            iconVariant="blue"
          />
          <KpiCard
            label="Frontline Staff"
            value={metrics.assignedStaff}
            note={`${metrics.totalCapacity > 0 ? Math.round((metrics.assignedStaff / metrics.totalCapacity) * 100) : 0}% filled`}
            icon={Building2}
            iconVariant="indigo"
          />
          <KpiCard
            label="Primary Timezone"
            value="GMT+7 (ICT)"
            note="Asia/Ho_Chi_Minh"
            icon={Clock}
            iconVariant="orange"
            valueClass="text-base font-bold font-mono"
          />
        </div>

        {/* Toolbar */}
        <Card padding="md" className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700">
            {(["ALL", "Active", "Inactive"] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                  statusFilter === st
                    ? "bg-[#2F2C59] text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {st === "ALL" && `All Stores (${locations.length})`}
                {st === "Active" && `Active (${metrics.active})`}
                {st === "Inactive" && `Inactive (${metrics.total - metrics.active})`}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search store name, code, address..."
              className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-full border border-slate-200/80 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2F5BFF]/30"
            />
          </div>
        </Card>

        {/* Location Cards Grid */}
        {filteredLocations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredLocations.map((loc) => {
              const capacityRatio = Math.round((loc.current_staff_count / loc.max_capacity) * 100);

              return (
                <Card
                  key={loc.id}
                  padding="lg"
                  className="flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition"
                >
                  <div>
                    {/* Card Top: Code & Status */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-[#2F5BFF] bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-200/60 dark:border-blue-900">
                          {loc.code}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs font-medium text-slate-500">Mgr: {loc.manager_name}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleStatus(loc.id)}
                        className="cursor-pointer transition active:scale-95"
                      >
                        <StatusChip variant={loc.status === "Active" ? "success" : "neutral"}>
                          {loc.status}
                        </StatusChip>
                      </button>
                    </div>

                    {/* Title & Address */}
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-3.5">
                      {loc.name}
                    </h3>
                    <div className="flex items-start text-xs text-slate-500 dark:text-slate-400 mt-1 space-x-1.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="truncate">{loc.address}</span>
                    </div>

                    {/* Operational Hours */}
                    <div className="mt-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-[#FF7A59]" />
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {loc.working_hours.open} – {loc.working_hours.close}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {loc.open_days.length === 7 ? "Open 7 Days / Week" : `${loc.open_days.length} Days / Week`}
                      </span>
                    </div>

                    {/* Capacity Bar */}
                    <div className="mt-4 space-y-1.5">
                      <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 font-medium">
                        <span>Staffing Capacity</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">
                          {loc.current_staff_count} / {loc.max_capacity} staff ({capacityRatio}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#2F2C59] dark:bg-indigo-500 transition-all"
                          style={{ width: `${Math.min(100, capacityRatio)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-400">
                      ID: {loc.id}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handleOpenModal(loc)}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition cursor-pointer flex items-center space-x-1"
                      >
                        <Edit2 className="h-3 w-3" />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center text-xs text-slate-400">
            {searchTerm ? `No locations found matching "${searchTerm}".` : "No locations registered yet. Click 'Add Location' to create one."}
          </div>
        )}
      </div>

      {/* Add / Edit Location Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-[#2F2C59] dark:text-indigo-300 flex items-center justify-center">
                  <Store className="h-4 w-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {editingLocation ? "Edit Store Location" : "Add New Location"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveLocation} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Store Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    placeholder="LOC-D1-FLAGSHIP"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-slate-900 dark:text-white uppercase"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Max Staff Capacity *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={formCapacity}
                    onChange={(e) => setFormCapacity(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Location / Store Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Downtown Flagship Roastery"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  placeholder="e.g. 128 Dong Khoi, District 1, HCMC"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Opening Time
                  </label>
                  <input
                    type="time"
                    value={formOpenTime}
                    onChange={(e) => setFormOpenTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Closing Time
                  </label>
                  <input
                    type="time"
                    value={formCloseTime}
                    onChange={(e) => setFormCloseTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Assigned Store Manager
                </label>
                <input
                  type="text"
                  value={formManager}
                  onChange={(e) => setFormManager(e.target.value)}
                  placeholder="e.g. Anna Vance"
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
                  Save Store Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
