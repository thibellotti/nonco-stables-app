"use client";

import { motion } from "framer-motion";
import { formatMoney, formatCompact } from "@/lib/utils";
import { currencyColors } from "@/lib/currency-colors";
import type { PendingSettlement } from "./settlements-data";
import {
  pendingSettlements,
  totalPendingAmount,
  sortedExposure,
  nextDue,
} from "./settlements-data";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SettlementsSidebarProps {
  filteredSettlements: PendingSettlement[];
}

// ---------------------------------------------------------------------------
// Settlements Sidebar — Next Due, Counterparty Exposure, Schedule
// ---------------------------------------------------------------------------

export function SettlementsSidebar({
  filteredSettlements,
}: SettlementsSidebarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="space-y-4"
    >
      {/* Card: Next Settlement Due */}
      <NextDueCard filteredSettlements={filteredSettlements} />

      {/* Card: Counterparty Exposure */}
      <CounterpartyExposureCard />

      {/* Card: Upcoming Schedule */}
      <ScheduleCard />
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Next Due Card
// ---------------------------------------------------------------------------

function NextDueCard({
  filteredSettlements,
}: {
  filteredSettlements: PendingSettlement[];
}) {
  const next = filteredSettlements[0] ?? nextDue;
  const isProcessing = next.status === "processing";
  const baseCurrency = next.pair.split("/")[0];
  const baseColor =
    currencyColors[baseCurrency]?.border ?? "#ffffff";
  const progressGradient = isProcessing
    ? "linear-gradient(90deg, rgba(5,224,248,0.4), rgba(5,224,248,0.8))"
    : "linear-gradient(90deg, #04b0c4, var(--cyan))";

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] border-t-2 border-t-[var(--cyan)] rounded-lg p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] uppercase tracking-[.12em] font-sans font-medium text-[var(--text-4)]">
          Next Due
        </span>
        {next.daysRemaining === 0 ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[rgba(255,255,255,0.06)] text-[10px] font-sans font-bold text-white uppercase tracking-[.1em]">
            Due Today
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[rgba(255,255,255,0.06)] text-[10px] font-mono font-bold text-[var(--text-3)]">
            {next.daysRemaining}d
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
          style={{
            backgroundColor: `${baseColor}15`,
            borderColor: `${baseColor}30`,
            borderWidth: 1,
          }}
        >
          <span
            className="font-mono text-[11px] font-bold"
            style={{ color: baseColor }}
          >
            {baseCurrency.slice(0, 2)}
          </span>
        </div>
        <div>
          <p className="font-mono text-sm font-bold text-white">
            {next.pair}
          </p>
          <p className="font-mono text-[11px] text-[var(--text-4)] tabular-nums">
            {next.dueDate}
          </p>
        </div>
      </div>

      <p className="mt-4 font-mono text-xl font-bold text-white tabular-nums">
        {formatCompact(next.amount)}
        <span className="text-sm text-[var(--text-4)] ml-1.5">
          {baseCurrency}
        </span>
      </p>

      {/* Progress bar */}
      <div className="mt-3 flex items-center gap-3">
        <div className="flex-1 h-2 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${next.progress}%` }}
            transition={{
              delay: 0.3,
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="h-full rounded-full"
            style={{ background: progressGradient }}
          />
        </div>
        <span className="text-[11px] font-mono text-[var(--text-4)] tabular-nums">
          {next.progress}%
        </span>
      </div>

      <div className="mt-3">
        {isProcessing ? (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold font-sans uppercase tracking-[.1em] text-white">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
            </span>
            Processing
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold font-sans uppercase tracking-[.1em] text-[var(--cyan)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--cyan)]" />
            Awaiting
          </span>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Counterparty Exposure Card
// ---------------------------------------------------------------------------

function CounterpartyExposureCard() {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-5">
      <span className="text-[11px] uppercase tracking-[.12em] font-sans font-medium text-[var(--text-4)]">
        Counterparty Exposure
      </span>

      <div className="mt-3 space-y-3">
        {sortedExposure.map(([name, amount], index) => {
          const proportion = amount / totalPendingAmount;
          const opacity =
            [1, 0.8, 0.6, 0.4, 0.27, 0.2][index] ?? 0.2;
          return (
            <div key={name}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-sans text-[var(--text-3)]">
                  {name}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-[var(--text-4)] tabular-nums">
                    {(proportion * 100).toFixed(0)}%
                  </span>
                  <span className="font-mono text-xs font-bold text-white tabular-nums">
                    {formatCompact(amount)}
                  </span>
                </div>
              </div>
              <div className="h-1.5 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.round(proportion * 100)}%`,
                  }}
                  transition={{
                    delay: 0.3 + index * 0.08,
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, rgba(5,224,248,0.15), rgba(5,224,248,${opacity}))`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-[.1em] font-sans font-medium text-[var(--text-4)]">
          Total
        </span>
        <span className="font-mono text-sm font-bold text-white tabular-nums">
          ${formatMoney(totalPendingAmount)}
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Schedule Card
// ---------------------------------------------------------------------------

function ScheduleCard() {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-5">
      <span className="text-[11px] uppercase tracking-[.12em] font-sans font-medium text-[var(--text-4)]">
        Schedule
      </span>

      <div className="mt-3 space-y-0">
        {pendingSettlements.map((s, i) => {
          const isProcessing = s.status === "processing";
          const isLast = i === pendingSettlements.length - 1;
          return (
            <div key={s.id} className="flex gap-3">
              {/* Timeline connector */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${
                    isProcessing
                      ? "bg-[var(--cyan)]"
                      : "bg-[var(--bg-bright)]"
                  }`}
                />
                {!isLast && (
                  <div className="w-px flex-1 bg-[var(--border)]" />
                )}
              </div>
              {/* Content */}
              <div
                className={`flex-1 flex items-center justify-between pb-3 ${
                  !isLast
                    ? "border-b border-[var(--border-row)]"
                    : ""
                } mb-1`}
              >
                <div>
                  <p
                    className={`font-mono text-xs font-bold ${
                      isProcessing
                        ? "text-white"
                        : "text-[var(--text-3)]"
                    }`}
                  >
                    {s.pair}
                  </p>
                  <p className="text-[10px] font-sans text-[var(--text-4)]">
                    {s.counterparty.split(" ")[0]}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-xs font-bold text-white tabular-nums">
                    {formatCompact(s.amount)}
                  </p>
                  <p className="text-[10px] font-mono text-[var(--text-4)] tabular-nums">
                    {s.dueDateShort}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
