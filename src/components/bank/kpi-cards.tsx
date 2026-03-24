import { formatCompact } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface BankKpiCardsProps {
  totalDeposits: number;
  totalWithdrawals: number;
  netFlow: number;
  depositCount: number;
  withdrawalCount: number;
}

// ---------------------------------------------------------------------------
// Bank KPI Cards
// ---------------------------------------------------------------------------

export function BankKpiCards({
  totalDeposits,
  totalWithdrawals,
  netFlow,
  depositCount,
  withdrawalCount,
}: BankKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {/* Deposits */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-5 sm:p-8 border-t-2 border-t-[var(--cyan)] relative overflow-hidden group">
        <span className="text-[10px] uppercase tracking-[.15em] font-mono text-[var(--text-3)]">
          Total Deposits (30d)
        </span>
        <div className="flex items-baseline gap-3 mt-3">
          <p className="text-3xl sm:text-5xl font-bold font-mono text-[var(--cyan)] tabular-nums">
            +{formatCompact(totalDeposits)}
          </p>
          <span className="px-2 py-0.5 rounded-full bg-[rgba(5,224,248,0.1)] text-[var(--cyan)] text-[10px] font-bold font-mono">
            +12.4%
          </span>
        </div>
        <p className="text-[var(--text-3)] text-xs mt-2 font-mono">
          {depositCount} transactions
        </p>
        {/* Watermark icon */}
        <svg className="absolute -right-4 -bottom-4 w-16 h-16 opacity-[0.06] group-hover:opacity-[0.1] transition-opacity duration-300" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M23 6l-9.5 9.5-5-5L1 18" />
          <path d="M17 6h6v6" />
        </svg>
      </div>

      {/* Withdrawals */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-5 sm:p-8 border-t-2 border-t-[var(--purple)] relative overflow-hidden group">
        <span className="text-[10px] uppercase tracking-[.15em] font-mono text-[var(--text-3)]">
          Total Withdrawals (30d)
        </span>
        <div className="flex items-baseline gap-3 mt-3">
          <p className="text-3xl sm:text-5xl font-bold font-mono text-[var(--purple)] tabular-nums">
            -{formatCompact(totalWithdrawals)}
          </p>
        </div>
        <p className="text-[var(--text-3)] text-xs mt-2 font-mono">
          {withdrawalCount} transactions
        </p>
        {/* Watermark icon */}
        <svg className="absolute -right-4 -bottom-4 w-16 h-16 opacity-[0.06] group-hover:opacity-[0.1] transition-opacity duration-300" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M23 18l-9.5-9.5-5 5L1 6" />
          <path d="M17 18h6v-6" />
        </svg>
      </div>

      {/* Net Flow */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-5 sm:p-8 border-t-2 border-t-[var(--green)] relative overflow-hidden group">
        <span className="text-[10px] uppercase tracking-[.15em] font-mono text-[var(--text-3)]">
          Net Flow (30d)
        </span>
        <div className="flex items-baseline gap-3 mt-3">
          <p className="text-3xl sm:text-5xl font-bold font-mono text-[var(--green)] tabular-nums">
            {netFlow >= 0 ? "+" : ""}{formatCompact(netFlow)}
          </p>
        </div>
        <p className="text-[var(--text-3)] text-xs mt-2 font-mono">
          This month
        </p>
        {/* Watermark icon */}
        <svg className="absolute -right-4 -bottom-4 w-16 h-16 opacity-[0.06] group-hover:opacity-[0.1] transition-opacity duration-300" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
        </svg>
      </div>
    </div>
  );
}
