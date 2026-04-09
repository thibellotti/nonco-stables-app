"use client";

import { Button } from "@/components/ui/button";
import type { Tab, TermFilter } from "./settlements-data";
import { pendingSettlements } from "./settlements-data";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SettlementsTabBarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  termFilter: TermFilter;
  onTermFilterChange: (filter: TermFilter) => void;
}

// ---------------------------------------------------------------------------
// Settlements Tab Bar — tab toggle + term filters + export button
// ---------------------------------------------------------------------------

export function SettlementsTabBar({
  activeTab,
  onTabChange,
  termFilter,
  onTermFilterChange,
}: SettlementsTabBarProps) {
  return (
    <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 sm:gap-4">
      {/* Tabs */}
      <div
        role="tablist"
        className="flex items-center gap-1 bg-[var(--bg-elevated)] rounded-lg p-1"
      >
        <button
          role="tab"
          aria-selected={activeTab === "pending"}
          onClick={() => onTabChange("pending")}
          className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "pending"
              ? "bg-[var(--bg-card)] text-white"
              : "text-[var(--text-4)] hover:text-[var(--text-3)]"
          }`}
        >
          Pending{" "}
          <span className="ml-1 text-[var(--cyan)]">
            {pendingSettlements.length}
          </span>
        </button>
        <button
          role="tab"
          aria-selected={activeTab === "completed"}
          onClick={() => onTabChange("completed")}
          className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "completed"
              ? "bg-[var(--bg-card)] text-white"
              : "text-[var(--text-4)] hover:text-[var(--text-3)]"
          }`}
        >
          Completed
        </button>
      </div>

      {/* Settlement terms filter — pending only */}
      {activeTab === "pending" && (
        <div className="flex gap-1 bg-[var(--bg-elevated)] rounded-lg p-1">
          {(["all", "T+1", "T+2", "T+10"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => onTermFilterChange(value)}
              className={`px-4 py-1.5 rounded-md text-xs uppercase tracking-wider transition-all cursor-pointer ${
                termFilter === value
                  ? "bg-[var(--bg-card)] text-white font-bold"
                  : "text-[var(--text-4)] hover:text-[var(--text-3)]"
              }`}
            >
              {value === "all" ? "All Terms" : value}
            </button>
          ))}
        </div>
      )}

      {/* Export — pushed right */}
      {activeTab === "pending" && (
        <Button variant="ghost" size="sm" className="sm:ml-auto">
          <svg
            width="12"
            height="12"
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
          <span className="font-sans text-[11px] font-medium uppercase tracking-[.1em]">
            Export CSV
          </span>
        </Button>
      )}
    </div>
  );
}
