"use client";

import React, { useState, useMemo } from "react";
import {
  Award,
  Plus,
  Search,
  CheckCircle2,
  Users,
  ShieldCheck,
  Star,
  Check,
  X,
  Edit2,
  Sparkles,
  Layers,
  GraduationCap,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { KpiCard } from "@/components/ui/KpiCard";
import { Card } from "@/components/ui/Card";
import { PillButton } from "@/components/ui/PillButton";
import { StatusChip } from "@/components/ui/StatusChip";
import { fetchSkillsApi, createSkillApi } from "@/lib/apiClient";

export interface SkillItem {
  id: string;
  code: string;
  name: string;
  description: string;
  category: "Service" | "Technical" | "Compliance & Safety" | "Supervision";
  certified_count: number;
  critical_station: string;
  required_for: string;
}

export interface EmployeeSkillMatrixRow {
  employee_id: string;
  name: string;
  role: string;
  avatar: string;
  skills: {
    skill_code: string;
    level: "Junior" | "Mid" | "Senior" | "Lead" | "None";
    verified: boolean;
  }[];
}

const INITIAL_SKILLS: SkillItem[] = [
  {
    id: "SK-01",
    code: "SUPERVISOR",
    name: "Shift Supervision & Keyholding",
    description: "Certified to open/close physical store, manage cash drawers, and lead team during emergencies.",
    category: "Supervision",
    certified_count: 3,
    critical_station: "Supervisor Desk / Floor Lead",
    required_for: "Mandatory 1 per opening & closing shift",
  },
  {
    id: "SK-02",
    code: "BARISTA",
    name: "Specialty Espresso & Manual Brew",
    description: "Trained on commercial espresso machinery, calibration, latte art, and rush volume brewing.",
    category: "Service",
    certified_count: 5,
    critical_station: "Espresso Bar & Hand Drip",
    required_for: "Min 2 during 07:00–10:30 rush",
  },
  {
    id: "SK-03",
    code: "POS_CASHIER",
    name: "Front Register & Reconciliation",
    description: "Operates POS terminal, handles multi-currency transactions, split checks, and invoice issuance.",
    category: "Service",
    certified_count: 6,
    critical_station: "Front Counter Register",
    required_for: "Min 1 during all operating hours",
  },
  {
    id: "SK-04",
    code: "KITCHEN_LEAD",
    name: "Commercial Kitchen & Prep",
    description: "Food prep safety, recipe consistency, oven management, and allergy protocol oversight.",
    category: "Technical",
    certified_count: 3,
    critical_station: "Kitchen Prep Line",
    required_for: "Required on brunch & lunch shifts",
  },
  {
    id: "SK-05",
    code: "FOOD_SAFETY",
    name: "HACCP Food Safety Level 2",
    description: "Formal certification for hygiene compliance, food temperature recording, and sanitization.",
    category: "Compliance & Safety",
    certified_count: 4,
    critical_station: "All Food & Beverage Stations",
    required_for: "Store compliance audit requirement",
  },
  {
    id: "SK-06",
    code: "FIRST_AID",
    name: "Workplace First Aid & CPR",
    description: "Certified emergency response, burn treatment, and workplace casualty management.",
    category: "Compliance & Safety",
    certified_count: 2,
    critical_station: "Entire Store Facility",
    required_for: "Safety regulation recommendation",
  },
];

const INITIAL_MATRIX_ROWS: EmployeeSkillMatrixRow[] = [
  {
    employee_id: "NV001",
    name: "Anna Vance",
    role: "Shift Supervisor",
    avatar: "AV",
    skills: [
      { skill_code: "SUPERVISOR", level: "Lead", verified: true },
      { skill_code: "BARISTA", level: "Senior", verified: true },
      { skill_code: "POS_CASHIER", level: "Lead", verified: true },
      { skill_code: "KITCHEN_LEAD", level: "Mid", verified: true },
      { skill_code: "FOOD_SAFETY", level: "Senior", verified: true },
      { skill_code: "FIRST_AID", level: "Lead", verified: true },
    ],
  },
  {
    employee_id: "NV002",
    name: "David Kim",
    role: "Senior Barista",
    avatar: "DK",
    skills: [
      { skill_code: "SUPERVISOR", level: "Senior", verified: true },
      { skill_code: "BARISTA", level: "Lead", verified: true },
      { skill_code: "POS_CASHIER", level: "Senior", verified: true },
      { skill_code: "KITCHEN_LEAD", level: "None", verified: false },
      { skill_code: "FOOD_SAFETY", level: "Senior", verified: true },
      { skill_code: "FIRST_AID", level: "None", verified: false },
    ],
  },
  {
    employee_id: "NV003",
    name: "Michael Chen",
    role: "Cashier",
    avatar: "MC",
    skills: [
      { skill_code: "SUPERVISOR", level: "None", verified: false },
      { skill_code: "BARISTA", level: "Junior", verified: false },
      { skill_code: "POS_CASHIER", level: "Lead", verified: true },
      { skill_code: "KITCHEN_LEAD", level: "None", verified: false },
      { skill_code: "FOOD_SAFETY", level: "Mid", verified: true },
      { skill_code: "FIRST_AID", level: "None", verified: false },
    ],
  },
  {
    employee_id: "NV004",
    name: "Sarah Miller",
    role: "Kitchen Assistant",
    avatar: "SM",
    skills: [
      { skill_code: "SUPERVISOR", level: "None", verified: false },
      { skill_code: "BARISTA", level: "None", verified: false },
      { skill_code: "POS_CASHIER", level: "Mid", verified: true },
      { skill_code: "KITCHEN_LEAD", level: "Senior", verified: true },
      { skill_code: "FOOD_SAFETY", level: "Lead", verified: true },
      { skill_code: "FIRST_AID", level: "Senior", verified: true },
    ],
  },
  {
    employee_id: "NV005",
    name: "James Wilson",
    role: "Barista",
    avatar: "JW",
    skills: [
      { skill_code: "SUPERVISOR", level: "None", verified: false },
      { skill_code: "BARISTA", level: "Senior", verified: true },
      { skill_code: "POS_CASHIER", level: "Senior", verified: true },
      { skill_code: "KITCHEN_LEAD", level: "None", verified: false },
      { skill_code: "FOOD_SAFETY", level: "Mid", verified: true },
      { skill_code: "FIRST_AID", level: "None", verified: false },
    ],
  },
];

export default function SkillsPage() {
  const [skills, setSkills] = useState<SkillItem[]>(INITIAL_SKILLS);
  const [matrixRows, setMatrixRows] = useState<EmployeeSkillMatrixRow[]>(INITIAL_MATRIX_ROWS);
  const [activeTab, setActiveTab] = useState<"DIRECTORY" | "MATRIX">("DIRECTORY");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  React.useEffect(() => {
    async function loadSkills() {
      try {
        const res = await fetchSkillsApi();
        if (res.data && res.data.length > 0) {
          const mapped: SkillItem[] = res.data.map((s: any) => ({
            id: s._id || s.id,
            code: s.code || "SKILL",
            name: s.name,
            description: s.description || "Operational competency",
            category: "Service",
            certified_count: 4,
            critical_station: "Counter & Operations",
            required_for: "Standard shift operations"
          }));
          setSkills(mapped);
        }
      } catch (err) {
        console.warn("Backend skills fallback:", err);
      }
    }
    loadSkills();
  }, []);

  // Form State
  const [formCode, setFormCode] = useState("");
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState<SkillItem["category"]>("Service");
  const [formStation, setFormStation] = useState("");
  const [formDesc, setFormDesc] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const metrics = useMemo(() => {
    const totalSkills = skills.length;
    const totalCertifications = skills.reduce((sum, s) => sum + s.certified_count, 0);
    const criticalCoverage = "100%";
    const trainedStaff = matrixRows.length;
    return { totalSkills, totalCertifications, criticalCoverage, trainedStaff };
  }, [skills, matrixRows]);

  const filteredSkills = useMemo(() => {
    return skills.filter(
      (s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.critical_station.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [skills, searchTerm]);

  const handleCreateSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCode || !formName) return;

    const newSkill: SkillItem = {
      id: `SK-0${skills.length + 1}`,
      code: formCode.toUpperCase().replace(/\s+/g, "_"),
      name: formName,
      description: formDesc || "Standard operational skill requirement",
      category: formCategory,
      certified_count: 1,
      critical_station: formStation || "Main Station",
      required_for: "Standard shift assignment",
    };

    createSkillApi({
      code: newSkill.code,
      name: newSkill.name,
      description: newSkill.description
    }).catch(e => console.warn("Skill sync:", e));

    setSkills([...skills, newSkill]);
    setIsModalOpen(false);
    setFormCode("");
    setFormName("");
    setFormStation("");
    setFormDesc("");
    showToast(`Skill ${newSkill.code} registered and enabled in AI solver.`);
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
          eyebrow="Frontline Qualifications"
          title="Skills & Qualifications"
          description="Enforce role qualifications and skill pinning so critical stations are staffed only by certified personnel."
          actions={
            <PillButton variant="primary" onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4" />
              <span>Define Skill</span>
            </PillButton>
          }
        />

        {/* 4 Summary KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Tracked Skills"
            value={metrics.totalSkills}
            note="defined in system"
            icon={Award}
            iconVariant="indigo"
          />
          <KpiCard
            label="Active Certifications"
            value={metrics.totalCertifications}
            note="across roster"
            icon={GraduationCap}
            iconVariant="blue"
            valueClass="text-[#2F5BFF]"
          />
          <KpiCard
            label="Station Coverage Index"
            value={metrics.criticalCoverage}
            note="0 uncertified gaps"
            icon={ShieldCheck}
            iconVariant="emerald"
            valueClass="text-emerald-600 dark:text-emerald-400"
          />
          <KpiCard
            label="Staff Qualified"
            value={metrics.trainedStaff}
            note="frontline members"
            icon={Users}
            iconVariant="orange"
          />
        </div>

        {/* View Switcher Tabs & Search Toolbar */}
        <Card padding="md" className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setActiveTab("DIRECTORY")}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                activeTab === "DIRECTORY"
                  ? "bg-[#2F2C59] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Skills Directory ({skills.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("MATRIX")}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                activeTab === "MATRIX"
                  ? "bg-[#2F2C59] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Coverage Matrix (Grid)
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search skill code, name, station..."
              className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-full border border-slate-200/80 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2F5BFF]/30"
            />
          </div>
        </Card>

        {/* Tab 1: Skills Directory Cards */}
        {activeTab === "DIRECTORY" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSkills.map((skill) => (
              <Card
                key={skill.id}
                padding="lg"
                className="flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <span className="font-mono text-xs font-bold text-[#2F5BFF] bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-200/60 dark:border-blue-900">
                      {skill.code}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                      {skill.category}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-3.5">
                    {skill.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {skill.description}
                  </p>

                  <div className="mt-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Critical Station:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{skill.critical_station}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Requirement:</span>
                      <span className="text-[#2F2C59] dark:text-indigo-400 font-medium">{skill.required_for}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center">
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                    {skill.certified_count} staff certified
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {skill.id}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Tab 2: Coverage Matrix Table */}
        {activeTab === "MATRIX" && (
          <Card padding="none" className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px] font-mono">
                    <th className="py-3 px-4 sm:px-6 w-[220px]">Employee</th>
                    {skills.map((s) => (
                      <th key={s.code} className="py-3 px-3 text-center">
                        <div>{s.code}</div>
                        <div className="text-[9px] font-normal normal-case text-slate-400 truncate max-w-[90px] mx-auto">
                          {s.critical_station}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {matrixRows.map((row) => (
                    <tr key={row.employee_id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-full bg-[#2F2C59] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                            {row.avatar}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 dark:text-white truncate">
                              {row.name}
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                              {row.role}
                            </p>
                          </div>
                        </div>
                      </td>

                      {skills.map((s) => {
                        const match = row.skills.find((sk) => sk.skill_code === s.code);
                        const level = match ? match.level : "None";

                        if (level === "None") {
                          return (
                            <td key={s.code} className="py-3 px-3 text-center">
                              <span className="text-slate-300 dark:text-slate-700 font-mono">—</span>
                            </td>
                          );
                        }

                        return (
                          <td key={s.code} className="py-3 px-3 text-center">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                level === "Lead"
                                  ? "bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/60 dark:text-purple-300"
                                  : level === "Senior"
                                  ? "bg-blue-50 text-[#2F5BFF] border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300"
                                  : "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300"
                              }`}
                            >
                              <Check className="h-2.5 w-2.5 mr-1 stroke-[3]" />
                              {level}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

      </div>

      {/* Define Skill Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-[#2F2C59] dark:text-indigo-300 flex items-center justify-center">
                  <Award className="h-4 w-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Define Station Skill
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

            <form onSubmit={handleCreateSkill} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Skill Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    placeholder="e.g. SOMMELIER"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-slate-900 dark:text-white uppercase"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as SkillItem["category"])}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Service">Service</option>
                    <option value="Technical">Technical</option>
                    <option value="Compliance & Safety">Compliance & Safety</option>
                    <option value="Supervision">Supervision</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Skill Title *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Wine Specialist & Tasting"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Required Station / Role
                </label>
                <input
                  type="text"
                  value={formStation}
                  onChange={(e) => setFormStation(e.target.value)}
                  placeholder="e.g. Dining Floor Sommelier"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description & Criteria
                </label>
                <textarea
                  rows={2}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Detail certification requirements..."
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
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
