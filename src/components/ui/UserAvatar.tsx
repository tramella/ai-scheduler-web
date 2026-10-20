"use client";

import React, { useState } from "react";
import Image from "next/image";
import { User } from "lucide-react";

interface UserAvatarProps {
  src?: string | null;
  name?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  shape?: "circle" | "rounded";
}

const SIZE_MAP = {
  xs: { box: "h-6 w-6 text-[10px]", icon: "h-3 w-3", px: 24 },
  sm: { box: "h-8 w-8 text-xs", icon: "h-4 w-4", px: 32 },
  md: { box: "h-10 w-10 text-sm", icon: "h-5 w-5", px: 40 },
  lg: { box: "h-14 w-14 text-lg", icon: "h-7 w-7", px: 56 },
  xl: { box: "h-20 w-20 text-2xl font-bold", icon: "h-9 w-9", px: 80 },
};

/**
 * Universal UserAvatar component:
 * - If `src` exists and loads validly: renders the image.
 * - If `src` is missing or fails to load: falls back to user initials or default User placeholder icon.
 */
export function UserAvatar({
  src,
  name,
  size = "md",
  className = "",
  shape = "circle",
}: UserAvatarProps) {
  const [hasError, setHasError] = useState(false);

  const initial = name?.trim() ? name.trim().charAt(0).toUpperCase() : "";
  const sizeConfig = SIZE_MAP[size] || SIZE_MAP.md;
  const roundedClass = shape === "circle" ? "rounded-full" : "rounded-2xl";

  const showImage = Boolean(src && src.trim() && !hasError);

  if (showImage) {
    return (
      <div
        className={`relative shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700/70 ${sizeConfig.box} ${roundedClass} ${className}`}
      >
        <Image
          src={src!}
          alt={name || "User Avatar"}
          width={sizeConfig.px}
          height={sizeConfig.px}
          className="h-full w-full object-cover"
          onError={() => setHasError(true)}
          unoptimized
        />
      </div>
    );
  }

  // Placeholder with User Initials or Icon
  return (
    <div
      className={`shrink-0 flex items-center justify-center font-semibold bg-[#2F2C59] dark:bg-indigo-600 text-white shadow-xs ${sizeConfig.box} ${roundedClass} ${className}`}
      aria-label={name || "User avatar placeholder"}
    >
      {initial ? (
        <span>{initial}</span>
      ) : (
        <User className={sizeConfig.icon} />
      )}
    </div>
  );
}
