"use client";

import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/page-transition";
import { SectionLabel } from "@/components/ui/section-label";
import { Badge } from "@/components/ui/badge";
import { yieldVaults } from "@/lib/mock-data";
import { MiniAreaChart } from "@/components/viz/mini-area-chart";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Vault accrual data (7 data points, trending up)
// ---------------------------------------------------------------------------

const vaultAccrualData: Record<string, number[]> = {
  MXN: [3200, 3280, 3320, 3380, 3410, 3460, 3500],
  BRL: [420, 428, 435, 442, 448, 455, 462],
  EUR: [175, 177, 178, 179, 180, 181, 182],
};

// ---------------------------------------------------------------------------
// Metric cards data
// ---------------------------------------------------------------------------

type Trend = "up" | "down" | "neutral";

interface Metric {
  label: string;
  value: string;
  sub: string;
  trend: Trend;
  color: string;
}

const metrics: Metric[] = [
  {
    label: "Total Deployed",
    value: "$1.84M",
    sub: "3 vaults active",
    trend: "up",
    color: "var(--cyan)",
  },
  {
    label: "Earned MTD",
    value: "$7,240",
    sub: "+21% vs Feb",
    trend: "up",
    color: "#38bdf8",
  },
  {
    label: "Earned YTD",
    value: "$18,410",
    sub: "Jan \u2013 Mar",
    trend: "neutral",
    color: "var(--purple)",
  },
  {
    label: "Blended APY",
    value: "5.14%",
    sub: "Weighted avg",
    trend: "up",
    color: "var(--amber)",
  },
];

// ---------------------------------------------------------------------------
// Yield history data
// ---------------------------------------------------------------------------

const yieldHistory = [
  {
    period: "Mar 2026",
    vault: "MXN vault",
    balance: "MX$3.5M",
    apy: "10.82%",
    earned: "$4,810",
    status: "accruing" as const,
    color: "var(--cyan)",
  },
  {
    period: "Mar 2026",
    vault: "BRL vault",
    balance: "BRL 462K",
    apy: "10.50%",
    earned: "$1,840",
    status: "accruing" as const,
    color: "var(--purple)",
  },
  {
    period: "Mar 2026",
    vault: "EUR vault",
    balance: "EUR 182K",
    apy: "2.65%",
    earned: "$590",
    status: "accruing" as const,
    color: "#38bdf8",
  },
  {
    period: "Feb 2026",
    vault: "MXN vault",
    balance: "MX$3.2M",
    apy: "10.75%",
    earned: "$4,320",
    status: "paid" as const,
    color: "var(--cyan)",
  },
];

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const },
  },
};

// ---------------------------------------------------------------------------
// Trend arrow SVG
// ---------------------------------------------------------------------------

function TrendArrow({ trend }: { trend: "up" | "down" | "neutral" }) {
  if (trend === "neutral") {
    return (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
        <path d="M2 5h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      aria-hidden="true"
      className={trend === "down" ? "rotate-180" : ""}
    >
      <path d="M5 2L8 6H2L5 2Z" fill="currentColor" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Yield page
// ---------------------------------------------------------------------------

export default function YieldPage() {
  return (
    <PageTransition className="px-6 md:px-8 w-full space-y-6">
      {/* Page header */}
      <SectionLabel>Yield Vaults</SectionLabel>

      {/* ── Metrics strip ── */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="flex flex-col md:flex-row gap-[1px] bg-[var(--bg-highest)] rounded-xl overflow-hidden"
      >
        {metrics.map((m) => (
          <motion.div
            key={m.label}
            variants={fadeUp}
            className="bg-[var(--bg-card)] p-5 flex-1"
          >
            <div className="text-[11px] uppercase tracking-[.15em] font-sans text-[var(--text-4)]">
              {m.label}
            </div>
            <p className={cn(
              "font-mono font-bold text-white tabular-nums mt-2 tracking-tight",
              m.label === "Total Deployed" ? "text-3xl" : "text-2xl"
            )}>
              {m.value}
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              <span
                className={cn(
                  "inline-flex items-center gap-1 text-[11px] font-sans font-medium",
                  m.trend === "up" && "text-[var(--status-positive)]",
                  m.trend === "down" && "text-[var(--status-negative)]",
                  m.trend === "neutral" && "text-[var(--text-4)]"
                )}
              >
                <TrendArrow trend={m.trend} />
                {m.sub}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Vault cards ── */}
      <div>
        <SectionLabel className="mb-4">Active Vaults</SectionLabel>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {yieldVaults.filter((v) => v.status !== "coming-soon").map((vault) => (
              <motion.div
                key={vault.id}
                variants={fadeUp}
                className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden flex flex-col transition-all duration-200 hover:border-[var(--border-outline)] hover:translate-y-[-1px]"
              >
                {/* Top color bar */}
                <div className="h-[3px] w-full" style={{ background: vault.color }} />

                <div className="p-5 flex flex-col flex-1">
                  {/* Flag + name */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl leading-none">{vault.flag}</span>
                      <div>
                        <span className="text-sm font-bold text-white block leading-tight">
                          {vault.name}
                        </span>
                        <span className="text-[10px] text-[var(--text-4)] block mt-0.5">
                          {vault.institution}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* APY */}
                  <div className="mt-5">
                    <p
                      className="text-[28px] font-mono font-bold tabular-nums tracking-tight leading-none"
                      style={{ color: vault.color }}
                    >
                      {vault.apy.toFixed(2)}%
                    </p>
                    <span className="text-[10px] text-[var(--text-4)] font-sans mt-1 block">
                      APY in {vault.currency} terms
                    </span>
                  </div>

                  {/* Yield accrual chart */}
                  {vaultAccrualData[vault.currency] && (
                    <MiniAreaChart
                      data={vaultAccrualData[vault.currency]}
                      color={vault.color}
                      height={28}
                      className="mt-2 mb-3"
                    />
                  )}

                  {/* Stats rows */}
                  <div className="mt-5 space-y-3 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-sans text-[var(--text-4)]">Balance</span>
                      <span className="text-sm font-mono font-medium text-white tabular-nums">
                        {vault.balanceLabel}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-sans text-[var(--text-4)]">Earned MTD</span>
                      <span
                        className="text-sm font-mono font-bold tabular-nums"
                        style={{ color: vault.color }}
                      >
                        {vault.earnedMTD > 0
                          ? `$${vault.earnedMTD.toLocaleString("en-US")}`
                          : "\u2014"}
                      </span>
                    </div>
                  </div>

                  {/* Manage button */}
                  <button
                    className={cn(
                      "mt-5 w-full py-2.5 rounded-full text-xs font-bold font-sans uppercase tracking-wider transition-all duration-200 active:scale-95",
                      "border focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
                      "cursor-pointer hover:brightness-110"
                    )}
                    style={{
                      borderColor: vault.color,
                      color: vault.color,
                    }}
                  >
                    Manage
                  </button>
                </div>
              </motion.div>
            ))}
        </motion.div>

        {/* Coming-soon vault banner */}
        {yieldVaults.filter((v) => v.status === "coming-soon").map((vault) => (
          <div key={vault.id} className="flex items-center gap-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-4 opacity-60 mt-4">
            <span className="text-xl">{vault.flag}</span>
            <div className="flex-1">
              <span className="text-sm font-medium text-[var(--text)]">{vault.name}</span>
              <span className="text-[11px] text-[var(--text-4)] ml-2">{vault.institution}</span>
            </div>
            <Badge variant="amber">Coming soon</Badge>
          </div>
        ))}
      </div>

      {/* ── Yield history table ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-[var(--border)]">
          <span className="text-[11px] uppercase tracking-[.15em] font-sans text-[var(--text-3)]">
            Yield History
          </span>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="px-6 py-3 text-[11px] tracking-[.15em] uppercase font-sans font-medium text-[var(--text-4)]">
                Period
              </th>
              <th className="px-6 py-3 text-[11px] tracking-[.15em] uppercase font-sans font-medium text-[var(--text-4)]">
                Vault
              </th>
              <th className="px-6 py-3 text-[11px] tracking-[.15em] uppercase font-sans font-medium text-[var(--text-4)] text-right hidden sm:table-cell">
                Balance
              </th>
              <th className="px-6 py-3 text-[11px] tracking-[.15em] uppercase font-sans font-medium text-[var(--text-4)] text-right">
                APY
              </th>
              <th className="px-6 py-3 text-[11px] tracking-[.15em] uppercase font-sans font-medium text-[var(--text-4)] text-right hidden md:table-cell">
                Earned
              </th>
              <th className="px-6 py-3 text-[11px] tracking-[.15em] uppercase font-sans font-medium text-[var(--text-4)] text-right">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {yieldHistory.map((row, i) => (
              <motion.tr
                key={`${row.period}-${row.vault}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 + i * 0.05, duration: 0.4 }}
                className="border-b border-[var(--border-row)] hover:bg-[rgba(255,255,255,0.03)] transition-colors duration-150"
              >
                <td className="px-6 py-4 text-sm font-sans text-[var(--text-3)]">
                  {row.period}
                </td>
                <td className="px-6 py-4 text-sm font-sans font-medium text-white">
                  {row.vault}
                </td>
                <td className="px-6 py-4 text-right hidden sm:table-cell">
                  <span className="font-mono text-sm text-[var(--text-3)] tabular-nums">
                    {row.balance}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span
                    className="font-mono text-sm font-bold tabular-nums"
                    style={{ color: row.color }}
                  >
                    {row.apy}
                  </span>
                </td>
                <td className="px-6 py-4 text-right hidden md:table-cell">
                  <span
                    className="font-mono text-sm font-bold tabular-nums"
                    style={{ color: row.color }}
                  >
                    {row.earned}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Badge variant={row.status === "accruing" ? "amber" : "green"}>
                    {row.status === "accruing" ? "Accruing" : "Paid"}
                  </Badge>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[var(--border)] flex items-center justify-between">
          <span className="text-[11px] text-[var(--text-4)] font-sans">
            <span className="font-mono">{yieldHistory.length}</span> records
          </span>
          <span className="text-[11px] text-[var(--text-4)] font-sans">
            Total earned{" "}
            <span className="font-mono font-bold text-white">$11,560</span>
          </span>
        </div>
      </motion.div>
    </PageTransition>
  );
}
