"use client";

import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";

// Guard against browser extension / Google Translate DOM mutations that break React reconciliation
// (Prevents: NotFoundError: Failed to execute 'removeChild' on 'Node')
if (typeof window !== "undefined") {
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(child: T): T {
    if (child.parentNode !== this) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("Safely prevented removeChild error on detached/reparented node:", child);
      }
      return child;
    }
    return originalRemoveChild.call(this, child) as T;
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(newNode: T, referenceNode: Node | null): T {
    if (referenceNode && referenceNode.parentNode !== this) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("Safely prevented insertBefore error on detached/reparented node:", referenceNode);
      }
      return newNode;
    }
    return originalInsertBefore.call(this, newNode, referenceNode) as T;
  };
}

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
