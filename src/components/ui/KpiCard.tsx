import React from "react";
import { Card } from "./Card";
import { StatusChip, StatusChipVariant } from "./StatusChip";

export type KpiIconVariant = "blue" | "orange" | "indigo" | "emerald" | "slate";

export interface KpiCardProps {
  label: string;
  value: string | number;
  chip?: string;
  chipVariant?: StatusChipVariant;
  chipClass?: string;
  note: string;
  icon: React.ElementType;
  iconVariant?: KpiIconVariant;
  iconClass?: string;
  valueClass?: string;
  children?: React.ReactNode;
  className?: string;
}

const ICON_VARIANTS: Record<KpiIconVariant, string> = {
  blue: "bg-blue-50 text-[#2F5BFF] dark:bg-blue-950/50",
  orange: "bg-orange-50 text-[#FF7A59] dark:bg-orange-950/50",
  indigo: "bg-indigo-50 text-[#2F2C59] dark:bg-indigo-950/50 dark:text-indigo-300",
  emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
  slate: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

export function KpiCard({
  label,
  value,
  chip,
  chipVariant = "neutral",
  chipClass,
  note,
  icon: Icon,
  iconVariant = "indigo",
  iconClass,
  valueClass,
  children,
  className = "",
}: KpiCardProps) {
  const resolvedIconClass = iconClass || ICON_VARIANTS[iconVariant];

  return (
    <Card interactive padding="md" className={className}>
      <div className="flex items-start justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-2xl ${resolvedIconClass}`}
        >
          <Icon className="h-[18px] w-[18px]" />
        </div>
        {chip && (
          chipClass ? (
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${chipClass}`}>
              {chip}
            </span>
          ) : (
            <StatusChip variant={chipVariant}>{chip}</StatusChip>
          )
        )}
      </div>

      <p className="mt-4 text-[13px] font-medium text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p
        className={`mt-0.5 text-[28px] font-semibold leading-tight tracking-tight tabular-nums ${
          valueClass ?? "text-slate-900 dark:text-white"
        }`}
      >
        {value}
      </p>

      {children && <div className="mt-3">{children}</div>}
      <p className="mt-2 truncate text-xs text-slate-500 dark:text-slate-400">
        {note}
      </p>
    </Card>
  );
}
