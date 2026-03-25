"use client";

import { cn } from "@/lib/utils";

const actions = [
  {
    label: "Send",
    color: "var(--cyan)",
    bgTint: "rgba(5,224,248,0.12)",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M7 17L17 7M17 7H9.5M17 7v7.5" />
      </svg>
    ),
  },
  {
    label: "Receive",
    color: "var(--green)",
    bgTint: "rgba(199,255,16,0.12)",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17 7L7 17M7 17h7.5M7 17V9.5" />
      </svg>
    ),
  },
  {
    label: "Convert",
    color: "var(--purple)",
    bgTint: "rgba(161,36,248,0.12)",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 9h14M19 9l-3-3M19 15H5M5 15l3 3" />
      </svg>
    ),
  },
  {
    label: "Deposit",
    color: "var(--amber)",
    bgTint: "rgba(249,226,32,0.12)",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 5v14M5 12h14" />
      </svg>
    ),
  },
] as const;

export function QuickActions() {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-5">
      <h3 className="text-sm font-bold text-white mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <button
            key={action.label}
            className={cn(
              "flex flex-col items-center justify-center gap-2.5 p-4 rounded-lg aspect-square",
              "bg-[var(--bg-elevated)] border border-[var(--border)]",
              "hover:border-[var(--border-outline)] hover:bg-[var(--bg-highest)]",
              "transition-all duration-200 cursor-pointer group"
            )}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: action.bgTint, color: action.color }}
            >
              {action.icon}
            </div>
            <span className="text-[11px] font-medium font-sans text-[var(--text-3)] group-hover:text-white transition-colors uppercase tracking-wider">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
