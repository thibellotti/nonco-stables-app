"use client";

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
// Flow visualization — single card with inflows vs outflows + net flow
// ---------------------------------------------------------------------------

export function BankKpiCards({
  totalDeposits,
  totalWithdrawals,
  netFlow,
  depositCount,
  withdrawalCount,
}: BankKpiCardsProps) {
  const maxFlow = Math.max(totalDeposits, totalWithdrawals);
  const depositPct = maxFlow > 0 ? (totalDeposits / maxFlow) * 100 : 0;
  const withdrawalPct = maxFlow > 0 ? (totalWithdrawals / maxFlow) * 100 : 0;
  const netPositive = netFlow >= 0;

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-6">
      <div className="grid grid-cols-2 gap-8">
        {/* Inflows */}
        <div>
          <div className="text-[10px] uppercase tracking-[.15em] font-mono text-[var(--text-4)] mb-2">
            Inflows
          </div>
          <p className="text-2xl font-mono font-bold text-[var(--cyan)] tabular-nums">
            {formatCompact(totalDeposits)}
          </p>
          <div className="mt-3 h-2 rounded-full bg-[var(--bg-highest)] overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--cyan)]"
              style={{ width: `${depositPct}%` }}
            />
          </div>
          <p className="text-[10px] text-[var(--text-4)] font-mono mt-2">
            {depositCount} {depositCount === 1 ? "deposit" : "deposits"}
          </p>
        </div>

        {/* Outflows */}
        <div>
          <div className="text-[10px] uppercase tracking-[.15em] font-mono text-[var(--text-4)] mb-2">
            Outflows
          </div>
          <p className="text-2xl font-mono font-bold text-[var(--purple)] tabular-nums">
            {formatCompact(totalWithdrawals)}
          </p>
          <div className="mt-3 h-2 rounded-full bg-[var(--bg-highest)] overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--purple)]"
              style={{ width: `${withdrawalPct}%` }}
            />
          </div>
          <p className="text-[10px] text-[var(--text-4)] font-mono mt-2">
            {withdrawalCount}{" "}
            {withdrawalCount === 1 ? "withdrawal" : "withdrawals"}
          </p>
        </div>
      </div>

      {/* Net flow */}
      <div className="mt-5 pt-4 border-t border-[var(--border)] flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-[.15em] font-mono text-[var(--text-4)]">
          Net Flow
        </span>
        <span
          className={`text-lg font-mono font-bold tabular-nums ${
            netPositive ? "text-[var(--green)]" : "text-red-400"
          }`}
        >
          {netPositive ? "+" : "-"}
          {formatCompact(Math.abs(netFlow))}
        </span>
      </div>
    </div>
  );
}
