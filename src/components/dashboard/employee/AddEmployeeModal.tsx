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
      <div className="relative w-full max-w-md rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="h-10 w-10 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-[#2F5BFF] flex items-center justify-center shrink-0">
              <Plus className="h-[18px] w-[18px]" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                Add employee
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Create new employee profile
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#2F5BFF]/50"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Full name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Nguyễn Văn Hùng"
              className="w-full rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5BFF]/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5BFF]/50 cursor-pointer"
              >
                <option value="Shift Supervisor">Shift Supervisor</option>
                <option value="Senior Barista">Senior Barista</option>
                <option value="Barista">Barista</option>
                <option value="Cashier">Cashier</option>
                <option value="Kitchen Assistant">Kitchen Assistant</option>
                <option value="Security & Closing Lead">Security & Closing Lead</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Employment type
              </label>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
                className="w-full rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5BFF]/50 cursor-pointer"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@store.io"
                className="w-full rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5BFF]/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0901 234 567"
                className="w-full rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5BFF]/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Target hours / week
              </label>
              <input
                type="number"
                min={10}
                max={60}
                value={targetHours}
                onChange={(e) => setTargetHours(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs tabular-nums text-slate-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5BFF]/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Home location
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5BFF]/50 cursor-pointer"
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
              className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-[#2F2C59] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#1E1B3A] dark:bg-indigo-600 dark:hover:bg-indigo-700 cursor-pointer"
            >
              Save employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
