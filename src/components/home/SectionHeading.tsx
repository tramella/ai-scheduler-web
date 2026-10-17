import React from "react";

interface SectionHeadingProps {
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  description,
  align = "left",
  className = "",
}) => (
  <div className={`max-w-2xl space-y-4 ${align === "center" ? "mx-auto text-center" : ""} ${className}`}>
    <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-display font-extrabold tracking-tight leading-[1.1] text-slate-950 dark:text-white">
      {title}
    </h2>
    {description && (
      <p className="text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-400 max-w-xl">
        {description}
      </p>
    )}
  </div>
);