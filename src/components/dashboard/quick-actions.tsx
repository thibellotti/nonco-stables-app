"use client";

import { cn } from "@/lib/utils";

const actions = [
  {
    label: "Send",
    color: "var(--cyan)",
    bgTint: "rgba(5,224,248,0.15)",
    icon: (
      <svg className="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M7 17L17 7M17 7H9.5M17 7v7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Receive",
    color: "var(--green)",
    bgTint: "rgba(199,255,16,0.12)",
    icon: (
      <svg className="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M17 7L7 17M7 17h7.5M7 17V9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Convert",
    color: "var(--purple)",
    bgTint: "rgba(161,36,248,0.12)",
    icon: (
      <svg className="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 9h14M19 9l-3-3M19 15H5M5 15l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Deposit",
    color: "var(--amber)",
    bgTint: "rgba(249,226,32,0.12)",
    icon: (
      <svg className="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Request",
    color: "rgba(255,255,255,0.85)",
    bgTint: "rgba(255,255,255,0.08)",
    icon: (
      <svg className="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 13h6M9 17h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
] as const;

export function QuickActions() {
  return (
    <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
      {actions.map((action) => (
        <button
          key={action.label}
          className={cn(
            "group flex flex-col items-center gap-3 p-4 sm:p-5 rounded-xl cursor-pointer",
            "bg-[var(--bg-card)] border border-[var(--border)]",
            "hover:border-[var(--border-outline)] hover:bg-[var(--bg-elevated)]",
            "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
            "w-[calc(33.333%-8px)] sm:w-auto sm:flex-1 sm:max-w-[160px]"
          )}
        >
          <div
            className={cn(
              "w-11 h-11 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center",
              "transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
              "group-hover:scale-105"
            )}
            style={{
              backgroundColor: action.bgTint,
              color: action.color,
            }}
          >
            {action.icon}
          </div>
          <span
            className={cn(
              "text-xs font-medium font-sans text-[var(--text-3)]",
              "transition-colors duration-300",
              "group-hover:text-white"
            )}
          >
            {action.label}
          </span>
        </button>
      ))}
    </div>
  );
}
