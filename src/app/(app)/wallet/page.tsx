"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/page-transition";
import { DonutChart } from "@/components/viz/donut-chart";
import { Sparkline } from "@/components/ui/sparkline";
import { balances, usdRates } from "@/lib/mock-data";
import { formatMoney, formatCompact, cn } from "@/lib/utils";
import { currencyColors } from "@/lib/currency-colors";

// ---------------------------------------------------------------------------
// Currency metadata
// ---------------------------------------------------------------------------

const currencyMeta: Record<string, { name: string }> = {
  USD: { name: "US Dollar" },
  EUR: { name: "Euro" },
  MXN: { name: "Mexican Peso" },
  USDT: { name: "Tether USD" },
  USDC: { name: "USD Coin" },
};

// ---------------------------------------------------------------------------
// 24h variations
// ---------------------------------------------------------------------------

const variations: Record<string, { pct: string; positive: boolean }> = {
  USD: { pct: "+0.81%", positive: true },
  EUR: { pct: "-0.32%", positive: false },
  MXN: { pct: "+2.14%", positive: true },
  USDT: { pct: "+0.01%", positive: true },
  USDC: { pct: "-0.05%", positive: false },
};

// ---------------------------------------------------------------------------
// Sparkline mock data per currency (7-point, ~1 week)
// ---------------------------------------------------------------------------

const sparklineData: Record<string, number[]> = {
  USD: [420, 425, 422, 428, 424, 426, 425],
  EUR: [198, 194, 197, 200, 196, 199, 196],
  MXN: [198, 202, 200, 205, 199, 203, 200],
  USDT: [308, 312, 310, 315, 311, 309, 310],
  USDC: [280, 275, 285, 278, 282, 280, 280],
};

// ---------------------------------------------------------------------------
// Hero action pills
// ---------------------------------------------------------------------------

const heroActions: {
  label: string;
  href?: string;
  icon: React.ReactNode;
  iconBg: string;
}[] = [
  {
    label: "Receive",
    iconBg: "bg-[rgba(34,197,94,0.08)]",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M7 3v8M7 11l-3-3M7 11l3-3" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Send",
    iconBg: "bg-[rgba(249,226,32,0.08)]",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M7 11V3M7 3L4 6M7 3l3 3" stroke="var(--amber)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Convert",
    href: "/fx",
    iconBg: "bg-[var(--cyan-dim)]",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M3 5h8M11 5l-2-2M11 9H3M3 9l2 2" stroke="var(--cyan)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Earn",
    href: "/yield",
    iconBg: "bg-[rgba(161,36,248,0.08)]",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M2 11l3-4 2.5 2L11 3" stroke="var(--purple)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Deposit",
    iconBg: "bg-[rgba(255,255,255,0.04)]",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M7 3v8M3 7h8" stroke="var(--text-3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const },
  },
};

// ---------------------------------------------------------------------------
// Wallet page — portfolio overview
// ---------------------------------------------------------------------------

export default function WalletPage() {
  const totalValue = balances.reduce(
    (sum, b) => sum + (b.available + b.pending) * (usdRates[b.currency] ?? 1),
    0
  );

  // Donut segments from balances
  const donutSegments = balances.map((b) => ({
    value: (b.available + b.pending) * (usdRates[b.currency] ?? 1),
    color: currencyColors[b.currency]?.border ?? "#05E0F8",
    label: b.currency,
  }));

  return (
    <PageTransition className="px-6 md:px-8 w-full space-y-6">
      {/* ----------------------------------------------------------------- */}
      {/* HERO — Donut + Total Balance + Action Pills                       */}
      {/* ----------------------------------------------------------------- */}
      <div className="relative bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-8 overflow-hidden">
        {/* Radial glow */}
        <div
          className="pointer-events-none absolute"
          style={{
            top: -60,
            right: -60,
            width: 240,
            height: 240,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(5,224,248,0.05), transparent)",
          }}
        />

        {/* Dot-grid pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-100"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(5,224,248,0.04) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Content */}
        <div className="relative flex flex-col md:flex-row items-start md:items-center gap-8">
          {/* LEFT — Donut chart */}
          <div className="shrink-0">
            <DonutChart
              segments={donutSegments}
              size={140}
              strokeWidth={12}
              centerLabel={formatCompact(totalValue)}
              centerSub="TOTAL"
            />
          </div>

          {/* RIGHT — Balance info + pills */}
          <div className="flex-1 min-w-0">
            <div className="text-[10px] uppercase tracking-[0.15em] font-sans text-[var(--text-4)]">
              Total Balance
            </div>
            <p className="text-4xl md:text-5xl font-mono font-extrabold text-white tabular-nums mt-2 tracking-tighter">
              ${formatMoney(totalValue)}
            </p>
            <p className="text-sm font-sans mt-1.5 flex items-center gap-1.5">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                <path d="M5 2L8 6H2L5 2Z" fill="var(--status-positive)" />
              </svg>
              <span className="text-[var(--cyan)] font-mono tabular-nums">+0.77%</span>
              <span className="text-[var(--text-4)]">· updated just now</span>
            </p>

            {/* Action pills */}
            <div className="flex flex-wrap gap-2 mt-6">
              {heroActions.map((action) => {
                const inner = (
                  <div className="flex flex-col items-center gap-2">
                    <div className={cn("w-7 h-7 rounded-full flex items-center justify-center", action.iconBg)}>
                      {action.icon}
                    </div>
                    <span className="text-[9px] uppercase tracking-[0.1em] font-sans text-[var(--text-4)]">
                      {action.label}
                    </span>
                  </div>
                );

                const cls =
                  "flex flex-col items-center gap-2 px-4 py-3 rounded-lg border border-[var(--border-subtle)] bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(5,224,248,0.05)] hover:border-[rgba(5,224,248,0.15)] transition-all duration-150";

                if (action.href) {
                  return (
                    <Link key={action.label} href={action.href} className={cls}>
                      {inner}
                    </Link>
                  );
                }

                return (
                  <button key={action.label} type="button" className={cls}>
                    {inner}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* HOLDINGS TABLE — with sparklines                                  */}
      {/* ----------------------------------------------------------------- */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden"
      >
        <div className="px-6 py-3 border-b border-[var(--border)]">
          <span className="text-[11px] uppercase tracking-[0.15em] font-sans text-[var(--text-3)]">
            Holdings
          </span>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="px-6 py-3 text-[11px] tracking-[0.15em] uppercase font-sans font-medium text-[var(--text-4)]">
                Currency
              </th>
              <th className="px-6 py-3 text-[11px] tracking-[0.15em] uppercase font-sans font-medium text-[var(--text-4)] hidden md:table-cell">
                <span className="sr-only">Trend</span>
              </th>
              <th className="px-6 py-3 text-[11px] tracking-[0.15em] uppercase font-sans font-medium text-[var(--text-4)] text-right">
                Balance
              </th>
              <th className="px-6 py-3 text-[11px] tracking-[0.15em] uppercase font-sans font-medium text-[var(--text-4)] text-right hidden sm:table-cell">
                USD Value
              </th>
              <th className="px-6 py-3 text-[11px] tracking-[0.15em] uppercase font-sans font-medium text-[var(--text-4)] text-right hidden lg:table-cell">
                24h Change
              </th>
              <th className="px-6 py-3 text-[11px] tracking-[0.15em] uppercase font-sans font-medium text-[var(--text-4)] text-right hidden lg:table-cell">
                Pending
              </th>
              <th className="px-6 py-3 text-[11px] tracking-[0.15em] uppercase font-sans font-medium text-[var(--text-4)] text-right">
                <span className="sr-only">Action</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {balances.map((b, i) => {
              const colors = currencyColors[b.currency];
              const meta = currencyMeta[b.currency];
              const variation = variations[b.currency];
              const usdValue = b.available * (usdRates[b.currency] ?? 1);
              const swapStable =
                b.currency === "EUR" || b.currency === "GBP" ? "USDC" : "USDT";
              const sparkData = sparklineData[b.currency];

              return (
                <motion.tr
                  key={b.currency}
                  variants={fadeUp}
                  className="group border-b border-[var(--border-row)] hover:bg-[rgba(255,255,255,0.03)] transition-colors duration-150"
                >
                  {/* Currency — colored circle + full name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold tracking-tight transition-[filter] duration-150 group-hover:brightness-125"
                        style={{
                          backgroundColor: `${colors?.border}15`,
                          color: colors?.border,
                          border: `1px solid ${colors?.border}30`,
                        }}
                      >
                        {b.currency.slice(0, 2)}
                      </div>
                      <div>
                        <span className="text-sm font-bold text-[var(--text)] block leading-none">
                          {b.currency}
                        </span>
                        <span className="text-[10px] text-[var(--text-4)] block mt-0.5">
                          {meta?.name}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Sparkline */}
                  <td className="py-4 pr-2 hidden md:table-cell">
                    {sparkData && (
                      <div className="w-16 h-7">
                        <Sparkline
                          data={sparkData}
                          color={colors?.border ?? "var(--cyan)"}
                          showArea={true}
                          strokeWidth={1.5}
                        />
                      </div>
                    )}
                  </td>

                  {/* Balance in native currency */}
                  <td className="px-6 py-4 text-right">
                    <span className="font-mono text-sm font-bold text-white tabular-nums block">
                      {b.symbol}
                      {formatMoney(b.available)}
                    </span>
                    {/* Mobile: approximate USD below */}
                    <span className="font-mono text-[11px] text-[var(--text-4)] tabular-nums block mt-0.5 sm:hidden">
                      &asymp; ${formatCompact(usdValue)}
                    </span>
                  </td>

                  {/* USD Value */}
                  <td className="px-6 py-4 text-right hidden sm:table-cell">
                    <span className="font-mono text-sm text-[var(--text-3)] tabular-nums">
                      ${formatMoney(usdValue)}
                    </span>
                  </td>

                  {/* 24h Change */}
                  <td className="px-6 py-4 text-right hidden lg:table-cell">
                    {variation && (
                      <span
                        className={cn(
                          "font-mono text-sm font-bold tabular-nums inline-flex items-center gap-1",
                          variation.positive
                            ? "text-[var(--status-positive)]"
                            : "text-[var(--status-negative)]"
                        )}
                      >
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 10 10"
                          fill="none"
                          aria-hidden="true"
                          className={variation.positive ? "" : "rotate-180"}
                        >
                          <path d="M5 2L8 6H2L5 2Z" fill="currentColor" />
                        </svg>
                        {variation.pct}
                      </span>
                    )}
                  </td>

                  {/* Pending */}
                  <td className="px-6 py-4 text-right hidden lg:table-cell">
                    {b.pending > 0 ? (
                      <span className="font-mono text-[11px] text-[var(--amber)] tabular-nums">
                        +{b.symbol}
                        {formatMoney(b.pending)}
                      </span>
                    ) : (
                      <span className="text-[11px] text-[var(--text-4)]">&mdash;</span>
                    )}
                  </td>

                  {/* Swap action */}
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/rfq?pair=${b.currency}/${swapStable}`}
                      className="text-[11px] uppercase tracking-wider font-bold text-[var(--cyan)] hover:text-white transition-colors"
                    >
                      Swap
                    </Link>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[var(--border)] flex items-center justify-between">
          <span className="text-[11px] text-[var(--text-4)] font-sans">
            <span className="font-mono">{balances.length}</span> currencies
          </span>
          <span className="text-[11px] text-[var(--text-4)] font-sans">
            Total{" "}
            <span className="font-mono font-bold text-white">
              ${formatMoney(totalValue)}
            </span>
          </span>
        </div>
      </motion.div>

      {/* ----------------------------------------------------------------- */}
      {/* RECENT ACTIVITY                                                   */}
      {/* ----------------------------------------------------------------- */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden">
        <div className="px-6 py-3 border-b border-[var(--border)] flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-[0.15em] font-sans text-[var(--text-3)]">
            Recent Activity
          </span>
          <Link
            href="/bank"
            className="text-[11px] font-sans text-[var(--cyan)] hover:text-white transition-colors"
          >
            All activity &rarr;
          </Link>
        </div>
        <div className="divide-y divide-[var(--border-row)]">
          {[
            { desc: "Deposit — Citibank wire", amount: "+$250,000", currency: "USD", time: "3h ago", positive: true },
            { desc: "Convert — EUR to USDC", amount: "-\u20AC54,000", currency: "EUR", time: "1d ago", positive: false },
            { desc: "Deposit — Tether Treasury", amount: "+$500,000", currency: "USDT", time: "1d ago", positive: true },
            { desc: "Withdrawal — Banorte S.A.", amount: "-MX$875,000", currency: "MXN", time: "2d ago", positive: false },
          ].map((tx, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-6 py-3.5 hover:bg-[rgba(255,255,255,0.03)] transition-colors"
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                  tx.positive ? "bg-[rgba(5,224,248,0.08)]" : "bg-[rgba(255,255,255,0.04)]"
                )}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  {tx.positive ? (
                    <path d="M10 4L4 10M4 10h4M4 10V6" stroke="var(--cyan)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  ) : (
                    <path d="M4 10L10 4M10 4H6M10 4v4" stroke="var(--text-4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  )}
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-sans text-[var(--text)] truncate block">{tx.desc}</span>
              </div>
              <span
                className={cn(
                  "font-mono text-sm font-semibold tabular-nums",
                  tx.positive ? "text-[var(--cyan)]" : "text-[var(--text-3)]"
                )}
              >
                {tx.amount}
              </span>
              <span className="text-[11px] font-mono text-[var(--text-4)] tabular-nums w-12 text-right">
                {tx.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
