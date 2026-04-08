"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/page-transition";
import { Button } from "@/components/ui/button";
import { CornerBrackets } from "@/components/ui/corner-brackets";

// ---------------------------------------------------------------------------
// Wallet options
// ---------------------------------------------------------------------------

const wallets = [
  {
    id: "metamask",
    name: "MetaMask",
    subtitle: "Browser extension",
    color: "#F6851B",
    disabled: false,
  },
  {
    id: "walletconnect",
    name: "WalletConnect",
    subtitle: "Mobile & desktop",
    color: "#3B99FC",
    disabled: false,
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    subtitle: "Coming soon",
    color: "#0052FF",
    disabled: true,
  },
];

// ---------------------------------------------------------------------------
// FX Onchain page
// ---------------------------------------------------------------------------

export default function OnchainPage() {
  const [address, setAddress] = useState("");
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

  return (
    <PageTransition className="px-4 sm:px-6 md:px-8 w-full space-y-6">
      {/* Page context header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M9 2v14M2 9h14" stroke="var(--text-3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="9" cy="9" r="6" stroke="var(--text-3)" strokeWidth="1.2" opacity="0.4" />
          </svg>
        </div>
        <div>
          <div className="text-sm font-medium text-white">FX Onchain</div>
          <div className="text-[11px] text-[var(--text-4)]">Non-custodial FX trading from your wallet</div>
        </div>
      </div>

      {/* Wallet cards */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-6"
      >
        <CornerBrackets size={14} color="rgba(255,255,255,0.06)" corners={["tr","bl"]} />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {wallets.map((w) => (
          <button
            key={w.id}
            disabled={w.disabled}
            onClick={() => !w.disabled && setSelectedWallet(w.id)}
            className={`relative flex flex-col items-center gap-3 p-6 rounded-lg border transition-all duration-200 cursor-pointer ${
              w.disabled
                ? "bg-[var(--bg-card)] border-[var(--border)] opacity-50 cursor-not-allowed"
                : selectedWallet === w.id
                  ? "bg-[var(--bg-card)] border-[var(--border-outline)]"
                  : "bg-[var(--bg-card)] border-[var(--border)] hover:border-[var(--border-outline)]"
            }`}
          >
            {/* Icon circle */}
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold"
              style={{
                backgroundColor: `${w.color}15`,
                color: w.color,
                border: `1px solid ${w.color}30`,
              }}
            >
              {w.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="text-center">
              <span className="text-sm font-sans font-medium text-white block">{w.name}</span>
              <span className="text-[10px] font-sans text-[var(--text-4)] block mt-0.5">
                {w.subtitle}
              </span>
            </div>
            {w.disabled && (
              <span className="absolute top-3 right-3 text-[9px] font-sans font-medium uppercase tracking-wider text-[var(--text-4)] bg-[rgba(255,255,255,0.04)] px-2 py-0.5 rounded-full">
                Soon
              </span>
            )}
          </button>
        ))}
        </div>
      </motion.div>

      {/* Divider */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-4 w-full"
      >
        <div className="flex-1 h-px bg-[var(--border)]" />
        <span className="text-[11px] font-sans text-[var(--text-4)] uppercase tracking-wider">
          or paste wallet address
        </span>
        <div className="flex-1 h-px bg-[var(--border)]" />
      </motion.div>

      {/* Address input — full-width */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="flex gap-3 w-full"
      >
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="0x..."
          className="flex-1 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm font-mono text-[var(--text)] outline-none focus:border-white transition-colors placeholder:text-[var(--text-4)]"
        />
        <Button variant="cyan" size="md">
          Connect
        </Button>
      </motion.div>

      {/* Stat cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-3">
          <div className="text-[9px] text-[var(--text-4)] uppercase tracking-[0.1em]">Settlement</div>
          <div className="text-lg font-sans font-bold text-white mt-1">Instant</div>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-3">
          <div className="text-[9px] text-[var(--text-4)] uppercase tracking-[0.1em]">Custody</div>
          <div className="text-lg font-sans font-bold text-white mt-1">Self</div>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-3">
          <div className="text-[9px] text-[var(--text-4)] uppercase tracking-[0.1em]">Chains</div>
          <div className="text-lg font-sans font-bold text-white mt-1">Multi</div>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-3">
          <div className="text-[9px] text-[var(--text-4)] uppercase tracking-[0.1em]">Spreads</div>
          <div className="text-lg font-mono font-bold text-white mt-1">0.05%</div>
        </div>
      </motion.div>
    </PageTransition>
  );
}
