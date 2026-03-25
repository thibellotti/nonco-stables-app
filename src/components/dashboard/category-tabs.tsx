"use client";

import { cn } from "@/lib/utils";

const tabs = [
  { key: "all", label: "All" },
  { key: "deposit", label: "Bank" },
  { key: "trade", label: "Trades" },
  { key: "settlement", label: "Settlements" },
  { key: "withdrawal", label: "Wallet" },
] as const;

interface CategoryTabsProps {
  active: string;
  onChange: (tab: string) => void;
}

export function CategoryTabs({ active, onChange }: CategoryTabsProps) {
  return (
    <div role="tablist" className="flex gap-1 bg-[var(--bg-elevated)] rounded-lg p-1 w-fit overflow-x-auto scrollbar-none">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          role="tab"
          aria-selected={active === tab.key}
          onClick={() => onChange(tab.key)}
          className={cn(
            "shrink-0 px-4 py-1.5 min-h-[44px] rounded-md text-xs font-sans uppercase tracking-wider transition-all cursor-pointer",
            active === tab.key
              ? "bg-[var(--bg-card)] text-white font-bold"
              : "text-[var(--text-4)] hover:text-[var(--text-3)]"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
