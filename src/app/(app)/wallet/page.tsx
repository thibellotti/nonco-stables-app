"use client";

import { motion } from "framer-motion";
import { SectionLabel } from "@/components/ui/section-label";
import { Button } from "@/components/ui/button";
import { balances } from "@/lib/mock-data";
import { formatMoney, timeAgo } from "@/lib/utils";
import { currencyColors } from "@/lib/currency-colors";

// ---------------------------------------------------------------------------
// Currency metadata — full names, mock wallet addresses, and short IDs
// ---------------------------------------------------------------------------

const currencyMeta: Record<
  string,
  { name: string; address: string; id: string }
> = {
  USD: { name: "US Dollar", address: "0x7a3b...4f2e", id: "USD-NY-01" },
  EUR: { name: "Euro", address: "0x9c1d...8e7a", id: "EUR-FR-01" },
  MXN: { name: "Mexican Peso", address: "0x2f8e...b31c", id: "MXN-MX-01" },
  USDT: { name: "Tether USD", address: "0x4d6a...c92f", id: "USDT-ETH-01" },
  USDC: { name: "USD Coin", address: "0x1b5f...d74e", id: "USDC-ETH-01" },
};

// ---------------------------------------------------------------------------
// Mock recent settlements
// ---------------------------------------------------------------------------

const recentSettlements = [
  { id: "stl-001", currency: "USD", amount: 250000, counterparty: "Citibank N.A.", status: "Settled", timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000) },
  { id: "stl-002", currency: "MXN", amount: 875000, counterparty: "Banorte S.A.", status: "Pending", timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000) },
  { id: "stl-003", currency: "USDT", amount: 108350, counterparty: "Deutsche Bank AG", status: "Settled", timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  { id: "stl-004", currency: "USDC", amount: 150000, counterparty: "Circle Internet Financial", status: "Settled", timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000) },
];

// ---------------------------------------------------------------------------
// Currency icon — colored monogram in tinted circle
// ---------------------------------------------------------------------------

function CurrencyIcon({ currency, size = 48 }: { currency: string; size?: number }) {
  const colors = currencyColors[currency];

  return (
    <div
      className="flex items-center justify-center rounded-full shrink-0"
      style={{
        width: size,
        height: size,
        backgroundColor: colors?.bg ?? "rgba(255,255,255,0.04)",
      }}
    >
      <span
        className="font-mono text-xs font-bold"
        style={{ color: colors?.text ?? "var(--text-3)" }}
      >
        {currency}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Balance card
// ---------------------------------------------------------------------------

function BalanceCard({ balance }: { balance: (typeof balances)[number] }) {
  const meta = currencyMeta[balance.currency] ?? {
    name: balance.currency,
    address: "0x0000...0000",
    id: balance.currency,
  };

  const colors = currencyColors[balance.currency];
  const topColor = colors?.border ?? "var(--cyan)";

  return (
    <div className="bg-[#141414] border border-[#333] rounded-lg overflow-hidden group relative">
      {/* Hover color overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300 pointer-events-none"
        style={{ backgroundColor: topColor }}
      />

      {/* 2px colored top border */}
      <div
        className="h-[2px] w-full"
        style={{ background: topColor }}
      />

      {/* Content */}
      <div className="p-8 flex flex-col gap-5">
        {/* Header: icon + name + wallet address */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <CurrencyIcon currency={balance.currency} size={48} />
            <div>
              <p className="text-lg font-bold text-white tracking-tight">
                {meta.name}
              </p>
              <p className="text-xs text-[#737373] mt-0.5">{balance.currency}</p>
            </div>
          </div>
          <span className="text-[10px] text-[#737373] font-mono">
            {meta.address}
          </span>
        </div>

        {/* Amount */}
        <div>
          <p className="text-3xl font-mono font-bold text-white tabular-nums tracking-tight">
            {balance.symbol}{formatMoney(balance.available)}
          </p>
          <p className="text-sm text-[#525252] font-mono mt-1 tabular-nums">
            ~${formatMoney(balance.available + balance.pending)} USD
          </p>
        </div>

        {/* Pending */}
        {balance.pending > 0 && (
          <p className="text-xs text-[var(--amber)] font-mono tabular-nums">
            {balance.symbol}{formatMoney(balance.pending)} pending
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2 border-t border-[rgba(255,255,255,0.05)]">
          <button
            className="flex-1 py-2 text-xs font-bold uppercase tracking-wider bg-[rgba(255,255,255,0.05)] rounded text-[#737373] transition-colors duration-200 cursor-pointer"
            style={{
              // Use CSS custom properties for hover
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${topColor}15`;
              e.currentTarget.style.color = topColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
              e.currentTarget.style.color = "#737373";
            }}
          >
            Receive
          </button>
          <button
            className="flex-1 py-2 text-xs font-bold uppercase tracking-wider bg-[rgba(255,255,255,0.05)] rounded text-[#737373] transition-colors duration-200 cursor-pointer"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${topColor}15`;
              e.currentTarget.style.color = topColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
              e.currentTarget.style.color = "#737373";
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
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
      className="px-6 md:px-8 w-full space-y-8"
    >
      {/* Hero */}
      <div className="space-y-4">
        <SectionLabel>Wallet</SectionLabel>

        <p className="text-[36px] font-mono font-bold text-white tabular-nums leading-none tracking-tight">
          ${formatMoney(totalValue)}
        </p>

        <p className="text-sm text-[#737373]">
          Managing assets across <span className="text-white font-bold">{balances.length} currencies</span>
        </p>

        <div className="flex gap-3 pt-1">
          <Button variant="cyan" size="sm">
            Deposit
          </Button>
          <Button variant="ghost" size="sm">
            Withdraw
          </Button>
        </div>
      </div>

      {/* Currency Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {balances.map((balance) => (
          <BalanceCard key={balance.currency} balance={balance} />
        ))}

        {/* Request New Currency */}
        <div className="border-2 border-dashed border-[#333] rounded-lg flex flex-col items-center justify-center p-8 hover:border-[var(--cyan)] hover:bg-[rgba(5,224,248,0.05)] cursor-pointer group transition-all duration-300">
          <svg
            className="w-10 h-10 text-[#333] group-hover:text-[var(--cyan)] transition-colors duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <circle cx="12" cy="12" r="10" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8M8 12h8" />
          </svg>
          <p className="mt-3 text-sm font-medium text-[#333] group-hover:text-[var(--cyan)] transition-colors duration-300">
            Request New Currency
          </p>
          <p className="mt-1 text-[10px] text-[#333] font-mono">
            Add a new asset to your wallet
          </p>
        </div>
      </div>

      {/* Recent Settlements */}
      <div>
        <SectionLabel>Recent Settlements</SectionLabel>
        <div className="bg-[#141414] border border-[#333] rounded-lg overflow-hidden mt-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.05)]">
                <th className="px-8 py-5 text-left text-[10px] uppercase tracking-[.15em] font-mono text-[var(--text-3)] font-medium">
                  Currency
                </th>
                <th className="px-8 py-5 text-left text-[10px] uppercase tracking-[.15em] font-mono text-[var(--text-3)] font-medium hidden sm:table-cell">
                  Counterparty
                </th>
                <th className="px-8 py-5 text-right text-[10px] uppercase tracking-[.15em] font-mono text-[var(--text-3)] font-medium">
                  Amount
                </th>
                <th className="px-8 py-5 text-right text-[10px] uppercase tracking-[.15em] font-mono text-[var(--text-3)] font-medium hidden md:table-cell">
                  Status
                </th>
                <th className="px-8 py-5 text-right text-[10px] uppercase tracking-[.15em] font-mono text-[var(--text-3)] font-medium">
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              {recentSettlements.map((s, i) => {
                const colors = currencyColors[s.currency];
                return (
                  <tr key={s.id} className={`border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.03)] transition-colors duration-150 ${i % 2 === 1 ? "bg-[rgba(255,255,255,0.02)]" : ""}`}>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <CurrencyIcon currency={s.currency} size={28} />
                        <span className="text-sm text-white font-medium">{s.currency}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 hidden sm:table-cell">
                      <span className="text-xs text-[#737373]">{s.counterparty}</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className="font-mono text-sm font-bold text-white tabular-nums">
                        ${formatMoney(s.amount)}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right hidden md:table-cell">
                      <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${s.status === "Settled" ? "text-[var(--green)]" : "text-[var(--amber)]"}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className="text-[10px] text-[#525252] font-mono tabular-nums">
                        {timeAgo(s.timestamp)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
