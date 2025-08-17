"use client";

import React from "react";

export default function Logo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Anacreon"
    >
      <g fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        {/* Stylized A */}
        <path d="M16 52 L32 12 L48 52" />
        <path d="M22 40 H42" />
      </g>
      {/* Analytics bars inside A */}
      <g fill="currentColor">
        <rect x="22" y="42" width="4" height="8" rx="1" />
        <rect x="30" y="38" width="4" height="12" rx="1" />
        <rect x="38" y="44" width="4" height="6" rx="1" />
      </g>
    </svg>
  );
}


