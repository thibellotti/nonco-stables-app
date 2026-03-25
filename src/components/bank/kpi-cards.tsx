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
          <div className="text-[11px] uppercase tracking-[.15em] font-sans text-[var(--text-4)] mb-2">
            Inflows
          </div>
          <p className="text-2xl font-mono font-bold text-[var(--cyan)] tabular-nums">
            {formatCompact(totalDeposits)}
          </p>
          <div className="mt-3 h-2.5 rounded-full bg-[rgba(255,255,255,0.03)] overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${depositPct}%`,
                background: "linear-gradient(90deg, rgba(5,224,248,0.25), rgba(5,224,248,0.9))",
              }}
            />
          </div>
          <p className="text-[11px] text-[var(--text-4)] font-sans mt-2">
            <span className="font-mono">{depositCount}</span> {depositCount === 1 ? "deposit" : "deposits"}
          </p>
        </div>

        {/* Outflows */}
        <div>
          <div className="text-[11px] uppercase tracking-[.15em] font-sans text-[var(--text-4)] mb-2">
            Outflows
          </div>
          <p className="text-2xl font-mono font-bold text-[var(--purple)] tabular-nums">
            {formatCompact(totalWithdrawals)}
          </p>
          <div className="mt-3 h-2.5 rounded-full bg-[rgba(255,255,255,0.03)] overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${withdrawalPct}%`,
                background: "linear-gradient(90deg, rgba(161,36,248,0.25), rgba(161,36,248,0.9))",
              }}
            />
          </div>
          <p className="text-[11px] text-[var(--text-4)] font-sans mt-2">
            <span className="font-mono">{withdrawalCount}</span>{" "}
            {withdrawalCount === 1 ? "withdrawal" : "withdrawals"}
          </p>
        </div>
      </div>

      {/* Net flow */}
      <div className="mt-5 pt-4 border-t border-[var(--border)] flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-[.15em] font-sans text-[var(--text-4)]">
          Net Flow
        </span>
        <span
          className={`text-lg font-mono font-bold tabular-nums ${
            netPositive ? "text-[var(--green)]" : "text-[var(--red)]"
          }`}
        >
          {netPositive ? "+" : "-"}
          {formatCompact(Math.abs(netFlow))}
        </span>
      </div>
    </div>
  );
}
