"use client";

import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { EmployeeProfile, EmploymentType } from "./types";

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newEmployeeData: {
    name: string;
    role: string;
    employmentType: EmploymentType;
    targetHours: number;
    location: string;
    email?: string;
    phone?: string;
  }) => void;
}

export function AddEmployeeModal({
  isOpen,
  onClose,
  onAdd,
}: AddEmployeeModalProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("Barista");
  const [employmentType, setEmploymentType] = useState<EmploymentType>("Full-time");
  const [targetHours, setTargetHours] = useState(40);
  const [location, setLocation] = useState("Flagship Store (District 1)");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAdd({
      name: name.trim(),
      role,
      employmentType,
      targetHours: Number(targetHours),
      location,
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
    });

    // Reset Form
    setName("");
    setRole("Barista");
    setEmploymentType("Full-time");
    setTargetHours(40);
    setLocation("Flagship Store (District 1)");
    setEmail("");
    setPhone("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
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
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
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
                value={role}
                onChange={(e) => setRole(e.target.value)}
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
                value={employmentType}
                onChange={(e) => {
                  const val = e.target.value as EmploymentType;
                  setEmploymentType(val);
                  setTargetHours(val === "Full-time" ? 40 : 20);
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
                value={targetHours}
                onChange={(e) => setTargetHours(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 p-2 text-xs text-slate-900 dark:text-white focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Home Location
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
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
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
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
  );
}
