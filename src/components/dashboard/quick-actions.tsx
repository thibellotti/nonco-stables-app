"use client";

import { cn } from "@/lib/utils";

const actions = [
  {
    label: "Send",
    desc: "Transfer funds",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M7 17L17 7M17 7H9.5M17 7v7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Receive",
    desc: "Incoming payment",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M17 7L7 17M7 17h7.5M7 17V9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Convert",
    desc: "FX exchange",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 9h14M19 9l-3-3M19 15H5M5 15l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Deposit",
    desc: "Add funds",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
] as const;

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {actions.map((action) => (
        <button
          key={action.label}
          className={cn(
            "group flex items-center gap-3 p-4 rounded-lg cursor-pointer",
            "bg-[var(--bg-card)] border border-[var(--border)]",
            "transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
            "hover:border-[rgba(5,224,248,0.2)] hover:bg-[var(--bg-elevated)]",
            "hover:shadow-[0_0_24px_rgba(5,224,248,0.04)]",
            "active:scale-[0.98]"
          )}
        >
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
              "bg-[var(--bg-elevated)] border border-[var(--border)]",
              "text-[var(--text-3)]",
              "transition-all duration-200",
              "group-hover:bg-[var(--cyan-dim)] group-hover:border-[var(--cyan)] group-hover:text-[var(--cyan)]"
            )}
          >
            {action.icon}
          </div>
          <div className="text-left">
            <div
              className={cn(
                "text-sm font-medium text-[var(--text-2)]",
                "transition-colors duration-200",
                "group-hover:text-[var(--text)]"
              )}
            >
              {action.label}
            </div>
            <div className="text-[10px] text-[var(--text-4)] font-mono">
              {action.desc}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
