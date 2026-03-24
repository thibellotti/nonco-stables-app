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
    <div className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={cn(
            "shrink-0 rounded-full px-4 py-1.5 font-sans text-xs font-medium transition-colors duration-150 cursor-pointer",
            active === tab.key
              ? "bg-[var(--cyan-dim)] text-[var(--cyan)] border border-[rgba(5,224,248,0.2)]"
              : "text-[var(--text-4)] hover:text-[var(--text-3)]"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
