export type ConstraintType = "hard" | "soft";

export type ConstraintCategory =
  | "labor_law"
  | "rest_fatigue"
  | "role_coverage"
  | "fairness"
  | "overtime_cost";

export interface ConstraintRule {
  id: string;
  code: string;
  name: string;
  description: string;
  type: ConstraintType;
  category: ConstraintCategory;
  threshold: number;
  unit: string;
  weight: number; // 1-100 (for soft constraints; 100 for hard)
  scope: string;
  status: "Active" | "Paused";
  updatedAt: string;
}

export const CATEGORY_LABELS: Record<ConstraintCategory, string> = {
  labor_law: "Labor Law & Safety",
  rest_fatigue: "Rest & Fatigue Management",
  role_coverage: "Role Coverage & Leadership",
  fairness: "Workload Fairness & Preference",
  overtime_cost: "Cost & Overtime Efficiency",
};

export const INITIAL_CONSTRAINTS: ConstraintRule[] = [
  {
    id: "CST001",
    code: "RULE-001",
    name: "Max Daily Working Hours",
    description: "Strict statutory cap of 8 working hours per day per staff member to prevent fatigue.",
    type: "hard",
    category: "labor_law",
    threshold: 8,
    unit: "hours / day",
    weight: 100,
    scope: "All Crew Members",
    status: "Active",
    updatedAt: "Oct 10, 2026",
  },
  {
    id: "CST002",
    code: "RULE-002",
    name: "Mandatory Inter-Shift Rest",
    description: "Minimum 12 consecutive resting hours between shift end and the subsequent shift start.",
    type: "hard",
    category: "rest_fatigue",
    threshold: 12,
    unit: "hours rest",
    weight: 100,
    scope: "All Crew Members",
    status: "Active",
    updatedAt: "Oct 10, 2026",
  },
  {
    id: "CST003",
    code: "RULE-003",
    name: "Max Consecutive Work Days",
    description: "Prevent scheduling any staff for more than 6 consecutive days without a mandatory 24h rest day.",
    type: "hard",
    category: "labor_law",
    threshold: 6,
    unit: "days max",
    weight: 100,
    scope: "All Crew Members",
    status: "Active",
    updatedAt: "Oct 09, 2026",
  },
  {
    id: "CST004",
    code: "RULE-004",
    name: "Certified Shift Lead Coverage",
    description: "Every operating shift (Morning, Evening, Night) must include at least 1 certified Shift Supervisor.",
    type: "hard",
    category: "role_coverage",
    threshold: 1,
    unit: "lead / shift",
    weight: 100,
    scope: "Flagship & Express",
    status: "Active",
    updatedAt: "Oct 08, 2026",
  },
  {
    id: "CST005",
    code: "RULE-005",
    name: "Student Late Night Restriction",
    description: "Part-time student workers cannot be assigned shifts extending past 22:00 to comply with youth labor rules.",
    type: "hard",
    category: "labor_law",
    threshold: 22,
    unit: "o'clock cutoff",
    weight: 100,
    scope: "Part-Time Crew",
    status: "Active",
    updatedAt: "Oct 05, 2026",
  },
  {
    id: "CST006",
    code: "RULE-006",
    name: "Staff Shift Preference Fulfillment",
    description: "Prioritize preferred morning/evening shift time preferences submitted by full-time staff.",
    type: "soft",
    category: "fairness",
    threshold: 85,
    unit: "% satisfaction",
    weight: 85,
    scope: "Full-Time Staff",
    status: "Active",
    updatedAt: "Oct 11, 2026",
  },
  {
    id: "CST007",
    code: "RULE-007",
    name: "Weekend Shift Distribution Equity",
    description: "Equitably distribute Saturday and Sunday shifts across the team to balance social workload.",
    type: "soft",
    category: "fairness",
    threshold: 2,
    unit: "wknd shifts / month",
    weight: 80,
    scope: "All Crew Members",
    status: "Active",
    updatedAt: "Oct 11, 2026",
  },
  {
    id: "CST008",
    code: "RULE-008",
    name: "Peak Rush Senior Barista Ratio",
    description: "Deploy at least 1 Senior Barista during morning peak rush hours (07:30 - 10:30) for speed of service.",
    type: "soft",
    category: "role_coverage",
    threshold: 1,
    unit: "senior / morning",
    weight: 90,
    scope: "Flagship Store (D1)",
    status: "Active",
    updatedAt: "Oct 11, 2026",
  },
  {
    id: "CST009",
    code: "RULE-009",
    name: "Overtime Premium Minimization",
    description: "Prioritize unassigned regular part-time capacity before triggering overtime premium wages.",
    type: "soft",
    category: "overtime_cost",
    threshold: 0,
    unit: "unbudgeted OT",
    weight: 75,
    scope: "All Crew Members",
    status: "Active",
    updatedAt: "Oct 06, 2026",
  },
  {
    id: "CST010",
    code: "RULE-010",
    name: "Consecutive Clopening Avoidance",
    description: "Heavily penalize assigning an employee to a closing shift immediately followed by the next morning opening shift.",
    type: "soft",
    category: "rest_fatigue",
    threshold: 14,
    unit: "hours buffer",
    weight: 70,
    scope: "All Crew Members",
    status: "Active",
    updatedAt: "Oct 06, 2026",
  },
];
