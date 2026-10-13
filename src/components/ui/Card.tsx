import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
  interactive?: boolean;
  as?: "div" | "section" | "article";
  className?: string;
}

export const CARD_BASE_CLASSES =
  "rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_1px_2px_rgba(15,23,42,0.04)]";

export function Card({
  children,
  padding = "md",
  interactive = false,
  as: Component = "div",
  className = "",
  ...props
}: CardProps) {
  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-5",
    lg: "p-6",
  }[padding];

  const interactiveClasses = interactive
    ? "transition hover:border-slate-300 dark:hover:border-slate-700"
    : "";

  return (
    <Component
      className={`${CARD_BASE_CLASSES} ${paddingClasses} ${interactiveClasses} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
