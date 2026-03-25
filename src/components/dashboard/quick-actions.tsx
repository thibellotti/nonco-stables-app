"use client";

import { cn } from "@/lib/utils";

const actions = [
  {
    label: "Send",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M7 17L17 7M17 7H10M17 7v7" />
      </svg>
    ),
  },
  {
    label: "Receive",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17 7L7 17M7 17h7M7 17v-7" />
      </svg>
    ),
  },
  {
    label: "Convert",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 9h14M19 9l-3-3M19 15H5M5 15l3 3" />
      </svg>
    ),
  },
  {
    label: "Deposit",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
            "flex flex-col items-center justify-center gap-3 py-6 rounded-lg",
            "bg-[var(--bg-elevated)] border border-[var(--border)]",
            "hover:border-[var(--cyan)] hover:shadow-[0_0_20px_rgba(5,224,248,0.08)]",
            "active:scale-[0.97]",
            "transition-all duration-200 cursor-pointer group"
          )}
        >
          <div className="w-11 h-11 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--text-3)] group-hover:border-[var(--cyan)] group-hover:text-[var(--cyan)] group-hover:shadow-[0_0_12px_rgba(5,224,248,0.15)] transition-all">
            {action.icon}
          </div>
          <span className="text-xs font-sans font-medium text-[var(--text-3)] group-hover:text-[var(--text)] transition-colors">
            {action.label}
          </span>
        </button>
      ))}
    </div>
  );
}
