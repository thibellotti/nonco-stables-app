"use client";

import { motion } from "framer-motion";
import { SectionLabel } from "@/components/ui/section-label";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { balances } from "@/lib/mock-data";
import { formatMoney } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Currency metadata — full names and mock wallet addresses
// ---------------------------------------------------------------------------

const currencyMeta: Record<string, { name: string; address: string }> = {
  USD: { name: "US Dollar", address: "0x7a3b...4f2e" },
  EUR: { name: "Euro", address: "0x9c1d...8e7a" },
  MXN: { name: "Mexican Peso", address: "0x2f8e...b31c" },
  USDT: { name: "Tether USD", address: "0x4d6a...c92f" },
  USDC: { name: "USD Coin", address: "0x1b5f...d74e" },
};

// ---------------------------------------------------------------------------
// Currency icon — colored monogram in tinted circle
// ---------------------------------------------------------------------------

function CurrencyIcon({ currency }: { currency: string }) {
  const colors: Record<string, string> = {
    USD: "var(--cyan)",
    EUR: "var(--purple)",
    MXN: "var(--green)",
    USDT: "var(--cyan)",
    USDC: "var(--amber)",
  };
  const bgs: Record<string, string> = {
    USD: "rgba(5,224,248,0.1)",
    EUR: "rgba(168,85,247,0.1)",
    MXN: "rgba(34,197,94,0.1)",
    USDT: "rgba(5,224,248,0.1)",
    USDC: "rgba(245,158,11,0.1)",
  };

  return (
    <div
      className="flex items-center justify-center w-10 h-10 rounded-full shrink-0"
      style={{ backgroundColor: bgs[currency] ?? "rgba(255,255,255,0.04)" }}
    >
      <span
        className="font-mono text-xs font-bold"
        style={{ color: colors[currency] ?? "var(--text-3)" }}
      >
        {currency}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Balance card
// ---------------------------------------------------------------------------

// Currency top-border colors
const borderColors: Record<string, string> = {
  USD: "var(--cyan)",
  EUR: "#38bdf8",
  MXN: "var(--green)",
  USDT: "#34d399",
  USDC: "#818cf8",
};

function BalanceCard({ balance }: { balance: (typeof balances)[number] }) {
  const meta = currencyMeta[balance.currency] ?? {
    name: balance.currency,
    address: "0x0000...0000",
  };

  const topColor = borderColors[balance.currency] ?? "var(--cyan)";

  return (
    <Card className="relative flex flex-col gap-4 group overflow-hidden">
      {/* Colored top border */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: topColor }}
      />

      {/* Subtle gradient overlay on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: `linear-gradient(180deg, ${topColor}06 0%, transparent 40%)` }}
      />

      {/* Header: icon + name */}
      <div className="relative flex items-center gap-3">
        <CurrencyIcon currency={balance.currency} />
        <div>
          <p className="text-sm font-medium text-[var(--text)]">
            {balance.currency}
          </p>
          <p className="text-xs text-[var(--text-4)]">{meta.name}</p>
        </div>
      </div>

      {/* Available amount */}
      <div className="relative">
        <p className="font-mono text-[10px] font-medium uppercase tracking-[.08em] text-[var(--text-4)]">
          Available
        </p>
        <p className="font-mono text-[24px] lg:text-[28px] font-bold tracking-tight text-[var(--text)] mt-1">
          {balance.symbol}
          {formatMoney(balance.available)}
        </p>
      </div>

      {/* Pending + USD equivalent */}
      <div className="relative flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] font-medium uppercase tracking-[.08em] text-[var(--text-4)]">
            Pending
          </p>
          <p
            className={`font-mono text-sm font-medium tabular-nums mt-0.5 ${
              balance.pending > 0
                ? "text-[var(--amber)]"
                : "text-[var(--text-3)]"
            }`}
          >
            {balance.symbol}
            {formatMoney(balance.pending)}
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-[10px] font-medium uppercase tracking-[.08em] text-[var(--text-4)]">
            USD Value
          </p>
          <p className="font-mono text-sm text-[var(--text-3)] tabular-nums mt-0.5">
            ~${formatMoney(balance.available + balance.pending)}
          </p>
        </div>
      </div>

      {/* Actions + address */}
      <div className="relative flex items-center justify-between pt-3 border-t border-[var(--border)]">
        <div className="flex gap-2">
          <Button variant="cyan" size="sm">
            Deposit
          </Button>
          <Button variant="ghost" size="sm">
            Withdraw
          </Button>
        </div>
        <span className="font-mono text-[11px] text-[var(--text-4)] tabular-nums">
          {meta.address}
        </span>
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Wallet page
// ---------------------------------------------------------------------------

export default function WalletPage() {
  const totalValue = balances.reduce(
    (sum, b) => sum + b.available + b.pending,
    0
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="p-6 lg:px-10 lg:py-8 space-y-6"
    >
      <div>
        <SectionLabel className="mb-4">Wallet</SectionLabel>
        <div className="flex items-baseline gap-3">
          <p className="font-mono text-[32px] lg:text-[40px] font-bold tracking-tight leading-none text-[var(--text)]">
            ${formatMoney(totalValue)}
          </p>
          <span className="font-mono text-xs text-[var(--text-4)]">
            {balances.length} currencies
          </span>
        </div>
      </div>

      {/* Balance cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {balances.map((balance) => (
          <BalanceCard key={balance.currency} balance={balance} />
        ))}
      </div>
    </motion.div>
  );
}
