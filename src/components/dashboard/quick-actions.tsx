"use client";

import { cn } from "@/lib/utils";

const actions = [
  {
    label: "Send",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <path
          d="M6 16L16 6M16 6H8.5M16 6v7.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Receive",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <path
          d="M16 6L6 16M6 16h7.5M6 16V8.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Convert",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <path
          d="M5 8h12M17 8l-3-3M17 14H5M5 14l3 3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Deposit",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <path
          d="M11 5v12M5 11h12"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
] as const;

export function QuickActions() {
  return (
    <div className="flex items-center gap-6">
      {actions.map((action) => (
        <button
          key={action.label}
          className={cn(
            "group flex flex-col items-center gap-2 cursor-pointer",
            "transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]"
          )}
        >
          <div
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center",
              "bg-[var(--bg-elevated)] border border-[var(--border)]",
              "text-[var(--text-2)]",
              "transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
              "group-hover:bg-[var(--cyan-dim)] group-hover:border-[var(--cyan)] group-hover:text-[var(--cyan)]",
              "group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(5,224,248,0.12)]",
              "group-active:scale-95"
            )}
          >
            {action.icon}
          </div>
          <span
            className={cn(
              "text-[11px] font-medium text-[var(--text-3)]",
              "transition-colors duration-200",
              "group-hover:text-[var(--text)]"
            )}
          >
            {action.label}
          </span>
        </button>
      ))}
    </div>
  );
}
