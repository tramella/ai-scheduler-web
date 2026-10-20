import React from "react";

/** ORBIT signature weave icon mark – utilized as decorative motif across the interface. */
export const WeaveMark: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" aria-hidden="true" className={className}>
    <rect x="6" y="30" width="88" height="40" rx="20" fill="#2F5BFF" />
    <rect x="30" y="6" width="40" height="88" rx="20" fill="#FF7A59" />
    <rect x="30" y="30" width="40" height="40" fill="#2F2C59" />
  </svg>
);