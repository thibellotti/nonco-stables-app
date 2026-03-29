"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/page-transition";
import { balances, usdRates } from "@/lib/mock-data";
import { formatMoney, formatCompact, cn } from "@/lib/utils";
import { currencyColors } from "@/lib/currency-colors";
import { BrandShapes } from "@/components/ui/brand-shapes";
import { CornerBrackets } from "@/components/ui/corner-brackets";
import { ParticleGlobe } from "@/components/ui/particle-globe";

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
// Hero action pills
// ---------------------------------------------------------------------------

const heroActions: { label: string; href?: string; path: string }[] = [
  { label: "Send", path: "M7 17L17 7M17 7H10M17 7v7" },
  { label: "Receive", path: "M17 7L7 17M7 17h7M7 17V10" },
  { label: "Convert", href: "/fx", path: "M5 9h14M19 9l-3-3M19 15H5M5 15l3 3" },
  { label: "Earn", href: "/yield", path: "M3 17l4-5 4 2.5L19 7M15 7h4v4" },
  { label: "Deposit", path: "M12 5v14M12 19l-4-4M12 19l4-4" },
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
// Wallet page — Mercury/Revolut Business-style portfolio view
// ---------------------------------------------------------------------------

export default function WalletPage() {
  // Compute total portfolio value
  const totalValue = balances.reduce(
    (sum, b) => sum + (b.available + b.pending) * (usdRates[b.currency] ?? 1),
    0
  );

  // Allocation segments for the thin bar + legend
  const allocations = balances.map((b) => {
    const value = (b.available + b.pending) * (usdRates[b.currency] ?? 1);
    const pct = totalValue > 0 ? (value / totalValue) * 100 : 0;
    const color = currencyColors[b.currency]?.border ?? "#ffffff";
    return { currency: b.currency, value, pct, color };
  });

  return (
    <PageTransition className="px-4 sm:px-6 md:px-8 w-full space-y-6">
      {/* --------------------------------------------------------------- */}
      {/* HERO — Total balance + allocation bar + action pills            */}
      {/* --------------------------------------------------------------- */}
      <div className="relative overflow-hidden rounded-xl bg-[var(--bg-card)] border border-[var(--border)] p-6 sm:p-8">
        {/* Stables gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none rounded-xl"
          style={{ background: 'linear-gradient(135deg, rgba(5,224,248,0.06), transparent 60%)' }}
        />

        {/* Nonco brand geometric shapes */}
        <BrandShapes />

        {/* Corner brackets — geometric identity */}
        <CornerBrackets size={18} color="rgba(255,255,255,0.08)" corners={["tl", "tr"]} />

        {/* Particle globe — large, atmospheric */}
        <div className="absolute -right-[180px] -top-[180px] -bottom-[180px] pointer-events-none hidden lg:flex items-center justify-center">
          <ParticleGlobe size={800} opacity={0.2} />
        </div>

        {/* Subtle radial glow */}
        <div
          className="pointer-events-none absolute -top-20 -right-20 w-60 h-60 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.03), transparent)",
          }}
        />

        <div className="relative">
          {/* Label */}
          <div className="text-[11px] uppercase tracking-[.15em] text-[var(--text-4)] font-sans">
            Total Balance
          </div>

          {/* Balance + change */}
          <div className="flex items-baseline gap-4 mt-2">
            <span className="text-4xl sm:text-5xl font-mono font-extrabold text-white tabular-nums tracking-tighter">
              ${formatMoney(totalValue)}
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm font-mono text-[var(--status-positive)]">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
                <path d="M5 2L8 6H2Z" />
              </svg>
              0.77%
            </span>
          </div>

          {/* Allocation bar — thin, elegant */}
          <div className="flex h-1.5 rounded-full overflow-hidden mt-5 gap-0.5">
            {allocations.map((a) => (
              <div
                key={a.currency}
                className="h-full rounded-full first:rounded-l-full last:rounded-r-full"
                style={{
                  width: `${a.pct}%`,
                  backgroundColor: a.color,
                  opacity: 0.85,
                }}
              />
            ))}
          </div>

          {/* Inline legend */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
            {allocations.map((a) => (
              <span
                key={a.currency}
                className="inline-flex items-center gap-1.5 text-[11px] text-[var(--text-4)] font-sans"
              >
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: a.color }} />
                {a.currency} {Math.round(a.pct)}%
              </span>
            ))}
          </div>

          {/* Action pills row — monochrome, quiet */}
          <div className="flex gap-2 mt-6 overflow-x-auto scrollbar-none pb-0.5">
            {heroActions.map((action) => {
              const inner = (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="opacity-40">
                    <path d={action.path} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-[11px] sm:text-xs font-sans font-medium whitespace-nowrap">{action.label}</span>
                </>
              );
              const cls = "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)] text-[var(--text-3)] hover:text-[var(--text)] transition-all duration-150 shrink-0 cursor-pointer";
              if (action.href) return <Link key={action.label} href={action.href} className={cls}>{inner}</Link>;
              return <button key={action.label} type="button" className={cls}>{inner}</button>;
            })}
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------------- */}
      {/* HOLDINGS TABLE — clean, spacious                                */}
      {/* --------------------------------------------------------------- */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden"
      >
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="px-6 py-3 text-[11px] tracking-[0.15em] uppercase font-sans font-medium text-[var(--text-4)]">
                Currency
              </th>
              <th className="px-6 py-3 text-[11px] tracking-[0.15em] uppercase font-sans font-medium text-[var(--text-4)] text-right">
                Balance
              </th>
              <th className="px-6 py-3 text-[11px] tracking-[0.15em] uppercase font-sans font-medium text-[var(--text-4)] text-right hidden sm:table-cell">
                Value
              </th>
              <th className="px-6 py-3 text-[11px] tracking-[0.15em] uppercase font-sans font-medium text-[var(--text-4)] text-right hidden lg:table-cell">
                24h
              </th>
              <th className="px-6 py-3 text-[11px] tracking-[0.15em] uppercase font-sans font-medium text-[var(--text-4)] text-right">
                <span className="sr-only">Action</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {balances.map((b) => {
              const colors = currencyColors[b.currency];
              const meta = currencyMeta[b.currency];
              const variation = variations[b.currency];
              const usdValue = (b.available + b.pending) * (usdRates[b.currency] ?? 1);
              const swapStable =
                b.currency === "EUR" || b.currency === "GBP" ? "USDC" : "USDT";

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
                        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold tracking-tight transition-[filter] duration-150 group-hover:brightness-125"
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
                          "font-mono text-xs font-semibold tabular-nums inline-flex items-center gap-1 px-2 py-0.5 rounded-full",
                          variation.positive
                            ? "text-[var(--status-positive)] bg-[rgba(34,197,94,0.08)]"
                            : "text-[var(--status-negative)] bg-[rgba(239,68,68,0.08)]"
                        )}
                      >
                        <svg
                          width="8"
                          height="8"
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

                  {/* Swap action */}
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/rfq?pair=${b.currency}/${swapStable}`}
                      className="text-[11px] uppercase tracking-wider font-bold text-white hover:opacity-70 transition-colors"
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

      {/* --------------------------------------------------------------- */}
      {/* RECENT ACTIVITY — compact, 4 items                              */}
      {/* --------------------------------------------------------------- */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden">
        <div className="px-6 py-3 border-b border-[var(--border)] flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-[0.15em] font-sans text-[var(--text-3)]">
            Recent Activity
          </span>
          <Link
            href="/bank"
            className="text-[11px] font-sans text-white hover:opacity-70 transition-colors"
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
                  tx.positive ? "bg-[rgba(255,255,255,0.06)]" : "bg-[rgba(255,255,255,0.04)]"
                )}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  {tx.positive ? (
                    <path d="M10 4L4 10M4 10h4M4 10V6" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
                  tx.positive ? "text-[var(--status-positive)]" : "text-[var(--text-3)]"
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
