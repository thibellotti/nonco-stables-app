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
    <div className="grid grid-cols-2 gap-2">
      {actions.map((action) => (
        <button
          key={action.label}
          className={cn(
            "flex items-center gap-3 px-5 py-4 rounded-lg",
            "bg-[var(--bg-elevated)] border border-[var(--border)]",
            "hover:border-[var(--cyan)] hover:bg-[var(--bg-highest)]",
            "active:scale-[0.98]",
            "transition-all duration-200 cursor-pointer group"
          )}
        >
          <div className="w-9 h-9 rounded-lg bg-[rgba(5,224,248,0.08)] flex items-center justify-center text-[var(--cyan)] group-hover:bg-[rgba(5,224,248,0.15)] transition-colors">
            {action.icon}
          </div>
          <span className="text-sm font-medium font-sans text-[var(--text)] group-hover:text-white transition-colors">
            {action.label}
          </span>
        </button>
      ))}
    </div>
  );
}
