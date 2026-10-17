import React from "react";

export type StatusChipVariant = "success" | "neutral" | "info" | "warning" | "danger";

export interface StatusChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: StatusChipVariant;
  pulse?: boolean;
  className?: string;
}

const VARIANT_CLASSES: Record<StatusChipVariant, string> = {
  success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
  neutral: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  info: "bg-blue-50 text-[#2F5BFF] dark:bg-blue-950/50 dark:text-blue-300",
  warning: "bg-orange-50 text-[#FF7A59] dark:bg-orange-950/40 dark:text-orange-300",
  danger: "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300",
};

const PULSE_CLASSES: Record<StatusChipVariant, string> = {
  success: "bg-emerald-500",
  neutral: "bg-slate-400",
  info: "bg-[#2F5BFF]",
  warning: "bg-[#FF7A59]",
  danger: "bg-rose-500",
};

export function StatusChip({
  children,
  variant = "neutral",
  pulse = false,
  className = "",
  ...props
}: StatusChipProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    >
      {pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 motion-reduce:animate-none ${PULSE_CLASSES[variant]}`}
          />
          <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${PULSE_CLASSES[variant]}`} />
        </span>
      )}
      {children}
    </span>
  );
}
