"use client";

import { formatCompact } from "@/lib/utils";

interface BankKpiCardsProps {
  totalDeposits: number;
  totalWithdrawals: number;
  netFlow: number;
  depositCount: number;
  withdrawalCount: number;
}

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
  const totalFlow = totalDeposits + totalWithdrawals;
  const depositSharePct = totalFlow > 0 ? (totalDeposits / totalFlow) * 100 : 0;
  const withdrawalSharePct = totalFlow > 0 ? (totalWithdrawals / totalFlow) * 100 : 0;

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-6">
      <div className="grid grid-cols-2 gap-8">
        {/* Inflows */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-[rgba(255,255,255,0.06)] flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M10 4L4 10M4 10h4.5M4 10V5.5" stroke="var(--text-3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="text-[11px] uppercase tracking-[.15em] text-[var(--text-4)]">
              Inflows
            </div>
          </div>
          <p className="text-2xl font-mono font-bold text-white tabular-nums">
            {formatCompact(totalDeposits)}
          </p>
          <div className="mt-3 h-2.5 rounded-full bg-[rgba(255,255,255,0.03)] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                width: `${depositPct}%`,
                background: "linear-gradient(90deg, rgba(255,255,255,0.15), rgba(255,255,255,0.5))",
              }}
            />
          </div>
          <p className="text-[11px] text-[var(--text-4)] mt-2">
            <span className="font-mono">{depositCount}</span> {depositCount === 1 ? "deposit" : "deposits"} <span className="font-mono">({depositSharePct.toFixed(0)}%)</span>
          </p>
        </div>

        {/* Outflows */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-[var(--purple-dim)] flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M4 10L10 4M10 4H5.5M10 4v4.5" stroke="var(--purple)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="text-[11px] uppercase tracking-[.15em] text-[var(--text-4)]">
              Outflows
            </div>
          </div>
          <p className="text-2xl font-mono font-bold text-[var(--purple)] tabular-nums">
            {formatCompact(totalWithdrawals)}
          </p>
          <div className="mt-3 h-2.5 rounded-full bg-[rgba(255,255,255,0.03)] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                width: `${withdrawalPct}%`,
                background: "linear-gradient(90deg, rgba(161,36,248,0.25), rgba(161,36,248,0.9))",
              }}
            />
          </div>
          <p className="text-[11px] text-[var(--text-4)] mt-2">
            <span className="font-mono">{withdrawalCount}</span>{" "}
            {withdrawalCount === 1 ? "withdrawal" : "withdrawals"} <span className="font-mono">({withdrawalSharePct.toFixed(0)}%)</span>
          </p>
        </div>
      </div>

      {/* Net flow */}
      <div className="mt-5 pt-4 border-t border-[var(--border)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${netPositive ? "bg-[var(--green-dim)]" : "bg-[var(--red-dim)]"}`}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              {netPositive ? (
                <path d="M7 10V4M7 4L4.5 6.5M7 4l2.5 2.5" stroke="var(--green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              ) : (
                <path d="M7 4v6M7 10l-2.5-2.5M7 10l2.5-2.5" stroke="var(--red)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              )}
            </svg>
          </div>
          <span className="text-[11px] uppercase tracking-[.15em] text-[var(--text-4)]">
            Net Flow
          </span>
        </div>
        <span
          className={`text-xl font-mono font-bold tabular-nums ${
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
