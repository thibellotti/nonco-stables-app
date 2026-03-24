"use client";

import { cn } from "@/lib/utils";

const actions = [
  {
    label: "Send",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M7 17L17 7M17 7H9.5M17 7v7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Receive",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M17 7L7 17M7 17h7.5M7 17V9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Convert",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 9h14M19 9l-3-3M19 15H5M5 15l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Deposit",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
] as const;

export function QuickActions() {
  return (
    <div className="flex justify-center gap-6 sm:gap-8 md:gap-10">
      {actions.map((action) => (
        <button
          key={action.label}
          className="group flex flex-col items-center gap-2 cursor-pointer"
        >
          <div
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center",
              "bg-[var(--bg-elevated)] border border-[var(--border)]",
              "text-[var(--text-4)]",
              "transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
              "group-hover:bg-[var(--bg-highest)] group-hover:border-[rgba(5,224,248,0.5)] group-hover:shadow-[0_0_15px_rgba(5,224,248,0.2)] group-hover:text-[var(--cyan)]"
            )}
          >
            {action.icon}
          </div>
          <span
            className={cn(
              "text-[10px] font-mono uppercase tracking-widest text-[var(--text-4)]",
              "transition-colors duration-200",
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
