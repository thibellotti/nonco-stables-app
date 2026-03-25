"use client";

import { cn } from "@/lib/utils";
import { SectionLabel } from "@/components/ui/section-label";

export function QuickActions() {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-5 h-full flex flex-col">
      <SectionLabel className="mb-5">Quick Actions</SectionLabel>

      {/* Primary actions */}
      <div className="flex flex-col gap-2.5 flex-1">
        {/* Send Funds */}
        <button
          className={cn(
            "flex items-center gap-3 w-full px-4 py-3.5 rounded-lg",
            "bg-transparent border border-[var(--border)]",
            "hover:border-[rgba(5,224,248,0.3)] hover:bg-[rgba(5,224,248,0.04)]",
            "hover:shadow-[0_0_20px_rgba(5,224,248,0.08)]",
            "active:scale-[0.98]",
            "transition-all duration-200 cursor-pointer group"
          )}
        >
          <div className="w-9 h-9 rounded-lg bg-[var(--cyan-dim)] flex items-center justify-center shrink-0 group-hover:bg-[rgba(5,224,248,0.12)] transition-colors">
            <svg
              className="w-[18px] h-[18px] text-[var(--cyan)]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M7 17L17 7M17 7H10M17 7v7" />
            </svg>
          </div>
          <div className="text-left">
            <span className="text-sm font-medium text-[var(--text)] block leading-none">
              Send Funds
            </span>
            <span className="text-[11px] text-[var(--text-4)] mt-1 block">
              Transfer to any account
            </span>
          </div>
          <svg
            className="w-4 h-4 text-[var(--text-4)] ml-auto group-hover:text-[var(--cyan)] transition-colors"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        {/* Convert */}
        <button
          className={cn(
            "flex items-center gap-3 w-full px-4 py-3.5 rounded-lg",
            "bg-transparent border border-[var(--border)]",
            "hover:border-[rgba(5,224,248,0.3)] hover:bg-[rgba(5,224,248,0.04)]",
            "hover:shadow-[0_0_20px_rgba(5,224,248,0.08)]",
            "active:scale-[0.98]",
            "transition-all duration-200 cursor-pointer group"
          )}
        >
          <div className="w-9 h-9 rounded-lg bg-[var(--cyan-dim)] flex items-center justify-center shrink-0 group-hover:bg-[rgba(5,224,248,0.12)] transition-colors">
            <svg
              className="w-[18px] h-[18px] text-[var(--cyan)]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 9h14M19 9l-3-3M19 15H5M5 15l3 3" />
            </svg>
          </div>
          <div className="text-left">
            <span className="text-sm font-medium text-[var(--text)] block leading-none">
              Convert
            </span>
            <span className="text-[11px] text-[var(--text-4)] mt-1 block">
              Swap between currencies
            </span>
          </div>
          <svg
            className="w-4 h-4 text-[var(--text-4)] ml-auto group-hover:text-[var(--cyan)] transition-colors"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Secondary links */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[var(--border)]">
        <button className="text-[11px] font-sans font-medium uppercase tracking-[.1em] text-[var(--text-4)] hover:text-[var(--cyan)] transition-colors cursor-pointer flex items-center gap-1.5">
          <svg
            className="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Deposit
        </button>
        <div className="w-px h-3 bg-[var(--border)]" />
        <button className="text-[11px] font-sans font-medium uppercase tracking-[.1em] text-[var(--text-4)] hover:text-[var(--cyan)] transition-colors cursor-pointer flex items-center gap-1.5">
          <svg
            className="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M17 7L7 17M7 17h7M7 17v-7" />
          </svg>
          Receive
        </button>
      </div>
    </div>
  );
}
