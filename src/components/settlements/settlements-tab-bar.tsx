"use client";

import { Button } from "@/components/ui/button";
import type { Tab, TermFilter } from "./settlements-data";
import { pendingSettlements } from "./settlements-data";

interface SettlementsTabBarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  termFilter: TermFilter;
  onTermFilterChange: (filter: TermFilter) => void;
  search?: string;
  onSearchChange?: (value: string) => void;
}

export function SettlementsTabBar({
  activeTab,
  onTabChange,
  termFilter,
  onTermFilterChange,
  search = "",
  onSearchChange,
}: SettlementsTabBarProps) {
  return (
    <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3">
      {/* Tabs */}
      <div role="tablist" className="inline-flex items-center gap-0.5 border border-[var(--border)] rounded-md">
        <button
          role="tab"
          aria-selected={activeTab === "pending"}
          onClick={() => onTabChange("pending")}
          className={
            "px-3.5 py-1.5 rounded-[5px] text-[10px] uppercase tracking-[.12em] font-sans transition-colors cursor-pointer " +
            (activeTab === "pending"
              ? "bg-[var(--bg-elevated)] text-[var(--text)]"
              : "text-[var(--text-4)] hover:text-[var(--text-2)]")
          }
        >
          Pending
          <span className="ml-1.5 text-[var(--cyan)] font-mono">
            {pendingSettlements.length}
          </span>
        </button>
        <button
          role="tab"
          aria-selected={activeTab === "completed"}
          onClick={() => onTabChange("completed")}
          className={
            "px-3.5 py-1.5 rounded-[5px] text-[10px] uppercase tracking-[.12em] font-sans transition-colors cursor-pointer " +
            (activeTab === "completed"
              ? "bg-[var(--bg-elevated)] text-[var(--text)]"
              : "text-[var(--text-4)] hover:text-[var(--text-2)]")
          }
        >
          Completed
        </button>
      </div>

      {/* Term filter — pending only */}
      {activeTab === "pending" && (
        <div className="inline-flex items-center gap-0.5 border border-[var(--border)] rounded-md">
          {(["all", "T+1", "T+2", "T+10"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => onTermFilterChange(value)}
              className={
                "px-3 py-1.5 rounded-[5px] text-[10px] uppercase tracking-[.12em] font-sans transition-colors cursor-pointer " +
                (termFilter === value
                  ? "bg-[var(--bg-elevated)] text-[var(--text)]"
                  : "text-[var(--text-4)] hover:text-[var(--text-2)]")
              }
            >
              {value === "all" ? "All terms" : value}
            </button>
          ))}
        </div>
      )}

      {/* Search bar — pending only */}
      {activeTab === "pending" && onSearchChange && (
        <div className="relative w-full sm:w-[260px] sm:ml-auto">
          <svg
            width="12"
            height="12"
            viewBox="0 0 14 14"
            fill="none"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-4)]"
            aria-hidden="true"
          >
            <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by pair (e.g. MXN, EUR)…"
            aria-label="Search settlements"
            className="w-full bg-transparent border border-[var(--border)] rounded-md pl-8 pr-3 py-1.5 text-xs font-sans text-[var(--text)] outline-none focus:border-[var(--border-outline)] transition-colors duration-150 placeholder:text-[var(--text-4)]"
          />
        </div>
      )}

      {/* Export — pending only, when no search field is shown push it auto-right */}
      {activeTab === "pending" && (
        <Button variant="ghost" size="sm" className={onSearchChange ? "" : "sm:ml-auto"}>
          <svg
            width="11"
            height="11"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M6 1v7M6 8L3.5 5.5M6 8l2.5-2.5M1 10h10" />
          </svg>
          <span className="font-sans text-[11px] uppercase tracking-[.12em]">
            Export
          </span>
        </Button>
      )}
    </div>
  );
}
