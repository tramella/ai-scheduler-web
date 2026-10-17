import React from "react";
import Link from "next/link";

export type PillButtonVariant = "primary" | "secondary" | "info";

export interface PillButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: PillButtonVariant;
  href?: string;
  className?: string;
}

const VARIANT_CLASSES: Record<PillButtonVariant, string> = {
  primary:
    "btn-primary !px-4 !py-2 text-xs",
  secondary:
    "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700",
  info:
    "border border-slate-200/80 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60",
};

export function PillButton({
  children,
  variant = "primary",
  href,
  className = "",
  ...props
}: PillButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition outline-none focus-visible:ring-2 focus-visible:ring-[#2F5BFF]/50";
  const combined = `${baseClasses} ${VARIANT_CLASSES[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combined}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={combined} {...props}>
      {children}
    </button>
  );
}
