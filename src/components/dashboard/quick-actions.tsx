"use client";

import { cn } from "@/lib/utils";

const actions = [
  {
    label: "Send",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M7 17L17 7M17 7H9.5M17 7v7.5" />
      </svg>
    ),
  },
  {
    label: "Receive",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17 7L7 17M7 17h7.5M7 17V9.5" />
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
    <div>
      <h3 className="text-[10px] uppercase tracking-[.15em] font-mono text-[var(--text-3)] mb-3">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-2">
        {actions.map((action) => (
          <button
            key={action.label}
            className={cn(
              "flex items-center gap-3 px-4 py-3.5 rounded-lg",
              "bg-[var(--bg-card)] border border-[var(--border)]",
              "text-[var(--text-3)]",
              "hover:border-[var(--cyan)] hover:text-[var(--cyan)]",
              "active:scale-[0.98]",
              "transition-all duration-200 cursor-pointer"
            )}
          >
            {action.icon}
            <span className="text-xs font-medium font-sans uppercase tracking-wider">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
