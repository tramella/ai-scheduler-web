"use client";

import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";

export function AppLayoutShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  if (isDashboard) {
    // Dedicated enterprise dashboard layout (custom header & sidebar, no public footer)
    return <>{children}</>;
  }

  // Public marketing & standard web layout
  return (
    <>
      <PublicHeader />
      <div className="flex-1 flex flex-col">{children}</div>
      <PublicFooter />
    </>
  );
}
