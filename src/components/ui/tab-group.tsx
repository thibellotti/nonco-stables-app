"use client";

import { cn } from "@/lib/utils";

interface Tab<T extends string> {
  value: T;
  label: string;
  count?: number;
  countColor?: string;
}

interface TabGroupProps<T extends string> {
  tabs: Tab<T>[];
  active: T;
  onChange: (value: T) => void;
  className?: string;
  /** Optional id prefix for aria-controls linkage with a tabpanel */
  id?: string;
}

export function TabGroup<T extends string>({
  tabs,
  active,
  onChange,
  className,
  id,
}: TabGroupProps<T>) {
  return (
    <div
      role="tablist"
      className={cn(
        "flex items-center gap-1 bg-[var(--bg-elevated)] rounded-lg p-1 w-fit",
        className,
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.value}
          role="tab"
          id={id ? `${id}-tab-${tab.value}` : undefined}
          aria-selected={active === tab.value}
          aria-controls={id ? `${id}-panel-${tab.value}` : undefined}
          tabIndex={active === tab.value ? 0 : -1}
          onClick={() => onChange(tab.value)}
          className={cn(
            "px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all cursor-pointer",
            active === tab.value
              ? "bg-[var(--bg-card)] text-white"
              : "text-[var(--text-4)] hover:text-[var(--text-3)]",
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span
              className="ml-1.5"
              style={{
                color:
                  tab.countColor ??
                  (active === tab.value
                    ? "var(--text)"
                    : "var(--text-4)"),
              }}
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
