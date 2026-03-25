import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface BankFilterBarProps {
  filter: string;
  onFilterChange: (filter: string) => void;
  search: string;
  onSearchChange: (search: string) => void;
}

// ---------------------------------------------------------------------------
// Filter tabs
// ---------------------------------------------------------------------------

const tabs = [
  { key: "all", label: "All" },
  { key: "deposit", label: "Deposits" },
  { key: "withdrawal", label: "Withdrawals" },
] as const;

// ---------------------------------------------------------------------------
// Bank Filter Bar
// ---------------------------------------------------------------------------

export function BankFilterBar({
  filter,
  onFilterChange,
  search,
  onSearchChange,
}: BankFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-3 border-b border-[var(--border)]">
      {/* Pill toggle */}
      <div role="tablist" className="flex gap-1 bg-[var(--bg-elevated)] rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={filter === tab.key}
            onClick={() => onFilterChange(tab.key)}
            className={cn(
              "px-4 py-1.5 min-h-[44px] rounded-md text-xs uppercase tracking-wider transition-all cursor-pointer",
              filter === tab.key
                ? "bg-[var(--bg-card)] text-white font-bold"
                : "text-[var(--text-4)] hover:text-[var(--text-3)]"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-64">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-4)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search transactions..."
          aria-label="Search transactions"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-black rounded-lg pl-10 pr-4 py-2 text-xs font-mono text-white placeholder:text-[var(--text-4)] border border-[var(--border)] focus:border-[var(--cyan)] focus:outline-none transition-colors w-full"
        />
      </div>
    </div>
  );
}
