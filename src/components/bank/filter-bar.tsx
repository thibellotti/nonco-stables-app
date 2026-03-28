import { TabGroup } from "@/components/ui/tab-group";

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
// Tab definitions for TabGroup
// ---------------------------------------------------------------------------

const tabs = [
  { value: "all", label: "All" },
  { value: "deposit", label: "Deposits" },
  { value: "withdrawal", label: "Withdrawals" },
];

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
      {/* Tab group */}
      <TabGroup
        tabs={tabs}
        active={filter}
        onChange={onFilterChange}
      />

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
          className="bg-black rounded-lg pl-10 pr-4 py-2 text-xs font-mono text-white placeholder:text-[var(--text-4)] border border-[var(--border)] focus:border-white focus:outline-none transition-colors w-full"
        />
      </div>
    </div>
  );
}
