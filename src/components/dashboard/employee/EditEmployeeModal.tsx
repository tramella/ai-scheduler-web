"use client";

import React, { useState, useEffect } from "react";
import { Edit2, X, Plus, Trash2, CheckCircle2, ShieldCheck, Clock, MapPin, Mail, Phone, Briefcase } from "lucide-react";
import { EmployeeProfile, EmploymentType, EmployeeStatus } from "./types";

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
      role,
      department,
      employmentType,
      location,
      locationId: location.includes("District 1") ? "LOC_01" : "LOC_02",
      email: email.trim() || employee.email,
      phone: phone.trim() || employee.phone,
      targetHours: Number(targetHours),
      scheduledHours: Number(scheduledHours),
      status,
      skills,
    };

    onSave(updatedEmployee);
  };

  const initial = name.trim().charAt(0) || "E";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl max-h-[92vh] flex flex-col rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2F2C59] dark:bg-indigo-600 text-white font-extrabold text-sm shadow-2xs">
              {initial}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  Edit Employee
                </h3>
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
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
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          
          {/* Section 1: Basic Information */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Basic Identification
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter employee full name"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-3 py-2 text-xs text-slate-900 dark:text-white focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#2F5BFF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Operational Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as EmployeeStatus)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-3 py-2 text-xs text-slate-900 dark:text-white focus:bg-white focus:outline-hidden cursor-pointer"
                >
                  <option value="Active">Active (Ready for shifts)</option>
                  <option value="On Leave">On Leave (Temporarily unavailable)</option>
                  <option value="Off Duty">Off Duty (Inactive)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Work Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@orbitweave.io"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-3 py-2 text-xs text-slate-900 dark:text-white focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#2F5BFF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0901 xxx xxx"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-3 py-2 text-xs text-slate-900 dark:text-white focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#2F5BFF]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Role & Deployment */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Role &amp; Deployment
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Certified Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-3 py-2 text-xs text-slate-900 dark:text-white focus:bg-white focus:outline-hidden cursor-pointer"
                >
                  {AVAILABLE_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-3 py-2 text-xs text-slate-900 dark:text-white focus:bg-white focus:outline-hidden cursor-pointer"
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
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Branch Location
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-3 py-2 text-xs text-slate-900 dark:text-white focus:bg-white focus:outline-hidden cursor-pointer"
              >
                <option value="Flagship Store (District 1)">Flagship Store (District 1)</option>
                <option value="Express Branch (District 3)">Express Branch (District 3)</option>
              </select>
            </div>
          </div>

          {/* Section 3: Contract & Hours */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Contract &amp; Capacity
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Contract Type
                </label>
                <select
                  value={employmentType}
                  onChange={(e) => {
                    const val = e.target.value as EmploymentType;
                    setEmploymentType(val);
                    if (val === "Full-time") setTargetHours(40);
                    else if (val === "Part-time") setTargetHours(20);
                  }}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-3 py-2 text-xs text-slate-900 dark:text-white focus:bg-white focus:outline-hidden cursor-pointer"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Hours/Wk
                </label>
                <input
                  type="number"
                  min={10}
                  max={60}
                  value={targetHours}
                  onChange={(e) => setTargetHours(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-3 py-2 text-xs text-slate-900 dark:text-white focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Scheduled Hours
                </label>
                <input
                  type="number"
                  min={0}
                  max={60}
                  value={scheduledHours}
                  onChange={(e) => setScheduledHours(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-3 py-2 text-xs text-slate-900 dark:text-white focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Skills & Credentials */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Certifications &amp; Skills
            </h4>

            {/* Current skill tags */}
            <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
              {skills.length > 0 ? (
                skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs"
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
                <span className="text-[11px] text-slate-400 italic">No skills registered yet.</span>
              )}
            </div>

            {/* Add skill input */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={handleKeyDownSkill}
                placeholder="Type skill and press Add (e.g. Latte Art, Cash Audit)..."
                className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-3 py-2 text-xs text-slate-900 dark:text-white focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#2F5BFF]"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition cursor-pointer"
              >
                Add Skill
              </button>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#2F2C59] hover:bg-[#1E1B3A] dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition active:scale-[0.99] cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
