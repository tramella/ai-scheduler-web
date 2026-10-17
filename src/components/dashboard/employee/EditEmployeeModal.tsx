"use client";

import React, { useState, useEffect } from "react";
import { X, Plus, Image as ImageIcon } from "lucide-react";
import { EmployeeProfile, EmploymentType, EmployeeStatus } from "./types";
import { UserAvatar } from "@/components/ui/UserAvatar";

interface EditEmployeeModalProps {
  employee: EmployeeProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedEmployee: EmployeeProfile) => void;
}

const AVAILABLE_ROLES = [
  "Shift Supervisor",
  "Senior Barista",
  "Barista",
  "Cashier",
  "Kitchen Assistant",
  "Security & Closing Lead",
  "Store Lead",
  "Maintenance / Stock",
  "All-Round Staff",
];

const AVAILABLE_DEPARTMENTS = [
  "Store Operations",
  "Bar & Beverage",
  "Front of House",
  "Food Prep",
  "Operations & Safety",
  "Logistics",
  "Management",
];

export function EditEmployeeModal({
  employee,
  isOpen,
  onClose,
  onSave,
}: EditEmployeeModalProps) {
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [role, setRole] = useState("Barista");
  const [department, setDepartment] = useState("Store Operations");
  const [employmentType, setEmploymentType] = useState<EmploymentType>("Full-time");
  const [targetHours, setTargetHours] = useState(40);
  const [scheduledHours, setScheduledHours] = useState(40);
  const [location, setLocation] = useState("Flagship Store (District 1)");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<EmployeeStatus>("Active");
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState("");

  useEffect(() => {
    if (employee) {
      setName(employee.name);
      setAvatarUrl(employee.avatar_url || "");
      setRole(employee.role);
      setDepartment(employee.department);
      setEmploymentType(employee.employmentType);
      setTargetHours(employee.targetHours);
      setScheduledHours(employee.scheduledHours);
      setLocation(employee.location);
      setEmail(employee.email);
      setPhone(employee.phone);
      setStatus(employee.status);
      setSkills(employee.skills || []);
      setNewSkillInput("");
    }
  }, [employee, isOpen]);

  if (!isOpen || !employee) return null;

  const handleAddSkill = () => {
    const trimmed = newSkillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setNewSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleKeyDownSkill = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const updatedEmployee: EmployeeProfile = {
      ...employee,
      name: name.trim(),
      avatar_url: avatarUrl.trim() || undefined,
      role,
      department,
      employmentType,
      targetHours: Number(targetHours),
      scheduledHours: Number(scheduledHours),
      location,
      email: email.trim() || employee.email,
      phone: phone.trim() || employee.phone,
      status,
      skills,
    };

    onSave(updatedEmployee);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl max-h-[92vh] flex flex-col rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center space-x-3">
            <UserAvatar
              src={avatarUrl}
              name={name || employee.name}
              size="md"
              shape="rounded"
              className="shrink-0"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white">
                  Edit employee
                </h3>
                <span className="tabular-nums text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {employee.id}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Update operational details, credentials, and schedule constraints
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full transition cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#2F5BFF]/50"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          
          {/* Section 1: Basic Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Basic identification
            </h4>

            {/* Avatar URL & Live Preview */}
            <div className="flex items-center space-x-3.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <UserAvatar
                src={avatarUrl}
                name={name || employee.name}
                size="lg"
                shape="rounded"
                className="shrink-0 ring-2 ring-[#2F5BFF]/20"
              />
              <div className="flex-1 min-w-0">
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Avatar Photo URL (Optional)
                </label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full rounded-xl border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-850 p-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5BFF]/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Full name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter employee full name"
                  className="w-full rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5BFF]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Operational status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as EmployeeStatus)}
                  className="w-full rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5BFF]/50 cursor-pointer"
                >
                  <option value="Active">Active</option>
                  <option value="On Leave">On leave</option>
                  <option value="Off Duty">Off duty</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Work email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@store.io"
                  className="w-full rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5BFF]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Phone number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0901 xxx xxx"
                  className="w-full rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5BFF]/50"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Role & Deployment */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Role &amp; deployment
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Certified role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5BFF]/50 cursor-pointer"
                >
                  {AVAILABLE_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5BFF]/50 cursor-pointer"
                >
                  {AVAILABLE_DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Primary branch
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5BFF]/50 cursor-pointer"
              >
                <option value="Flagship Store (District 1)">Flagship Store (District 1)</option>
                <option value="Express Branch (District 3)">Express Branch (District 3)</option>
              </select>
            </div>
          </div>

          {/* Section 3: Hours & Contract */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Hours &amp; contract
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Contract
                </label>
                <select
                  value={employmentType}
                  onChange={(e) => {
                    const val = e.target.value as EmploymentType;
                    setEmploymentType(val);
                    if (val === "Full-time") setTargetHours(40);
                    else if (val === "Part-time") setTargetHours(20);
                  }}
                  className="w-full rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5BFF]/50 cursor-pointer"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>

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
                  Scheduled hours
                </label>
                <input
                  type="number"
                  min={0}
                  max={60}
                  value={scheduledHours}
                  onChange={(e) => setScheduledHours(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs tabular-nums text-slate-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5BFF]/50"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Skills & Credentials */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Certifications &amp; skills
            </h4>

            {/* Current skill tags */}
            <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
              {skills.length > 0 ? (
                skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-slate-400 hover:text-rose-500 cursor-pointer ml-1"
                      aria-label={`Remove skill ${skill}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">No skills registered yet.</span>
              )}
            </div>

            {/* Add skill input */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={handleKeyDownSkill}
                placeholder="Type skill and press add..."
                className="flex-1 rounded-full border border-slate-200/80 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5BFF]/50"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="rounded-full border border-slate-200/80 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 transition cursor-pointer"
              >
                Add skill
              </button>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
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
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
