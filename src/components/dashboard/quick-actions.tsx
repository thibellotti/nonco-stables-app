"use client";

import { cn } from "@/lib/utils";

const actions = [
  {
    label: "Send",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M7 17L17 7M17 7H10M17 7v7" />
      </svg>
    ),
  },
  {
    label: "Receive",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17 7L7 17M7 17h7M7 17v-7" />
      </svg>
    ),
  },
  {
    label: "Convert",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 9h14M19 9l-3-3M19 15H5M5 15l3 3" />
      </svg>
    ),
  },
  {
    label: "Deposit",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 5v14M5 12h14" />
      </svg>
    ),
  },
] as const;

export function QuickActions() {
  return (
    <div className="flex justify-between gap-2">
      {actions.map((action) => (
        <button
          key={action.label}
          className={cn(
            "flex flex-col items-center gap-2 py-3 flex-1 rounded-lg",
            "hover:bg-[var(--bg-elevated)]",
            "active:scale-[0.97]",
            "transition-all duration-200 cursor-pointer group"
          )}
        >
          <div className="w-10 h-10 rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center text-[var(--text-3)] group-hover:border-[var(--cyan)] group-hover:text-[var(--cyan)] transition-all">
            {action.icon}
          </div>
          <span className="text-[11px] font-sans text-[var(--text-4)] group-hover:text-[var(--text)] transition-colors">
            {action.label}
          </span>
        </button>
      ))}
    </div>
  );
}
