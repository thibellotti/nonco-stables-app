"use client";

import { cn } from "@/lib/utils";

const actions = [
  {
    label: "Send",
    sublabel: "Transfer out",
    color: "var(--cyan)",
    bg: "rgba(5,224,248,0.08)",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M7 17L17 7M17 7H10M17 7v7" />
      </svg>
    ),
  },
  {
    label: "Receive",
    sublabel: "Deposit funds",
    color: "var(--green)",
    bg: "rgba(199,255,16,0.08)",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17 7L7 17M7 17h7M7 17v-7" />
      </svg>
    ),
  },
  {
    label: "Convert",
    sublabel: "Swap currencies",
    color: "var(--purple)",
    bg: "rgba(161,36,248,0.08)",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 9h14M19 9l-3-3M19 15H5M5 15l3 3" />
      </svg>
    ),
  },
  {
    label: "Deposit",
    sublabel: "Add funds",
    color: "var(--amber)",
    bg: "rgba(249,226,32,0.08)",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 5v14M5 12h14" />
      </svg>
    ),
  },
] as const;

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-2 h-full">
      {actions.map((action) => (
        <button
          key={action.label}
          className={cn(
            "flex flex-col items-center justify-center gap-2.5 py-5 rounded-lg",
            "bg-[var(--bg-card)] border border-[var(--border)]",
            "hover:border-[var(--border-outline)]",
            "active:scale-[0.97]",
            "transition-all duration-200 cursor-pointer group"
          )}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-110"
            style={{
              backgroundColor: action.bg,
              color: action.color,
              boxShadow: `0 0 0 0 ${action.bg}`,
            }}
          >
            {action.icon}
          </div>
          <div className="text-center">
            <span className="text-xs font-medium text-[var(--text)] block leading-none">
              {action.label}
            </span>
            <span className="text-[10px] text-[var(--text-4)] mt-0.5 block">
              {action.sublabel}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
