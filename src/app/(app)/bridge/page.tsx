"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { PageTransition } from "@/components/ui/page-transition";
import { Button } from "@/components/ui/button";
import { AnimatedIllustration } from "@/components/ui/animated-illustration";
import { formatMoney } from "@/lib/utils";

const chains = [
  { id: "ethereum", name: "Ethereum", icon: "ETH" },
  { id: "base", name: "Base", icon: "BA" },
  { id: "polygon", name: "Polygon", icon: "PO" },
  { id: "solana", name: "Solana", icon: "SO" },
  { id: "tron", name: "Tron", icon: "TR" },
  { id: "arbitrum", name: "Arbitrum", icon: "AR" },
];

const tokens = ["USDT", "USDC", "DAI", "WETH"];

export default function BridgePage() {
  const shouldReduceMotion = useReducedMotion();
  const [fromChain, setFromChain] = useState("ethereum");
  const [toChain, setToChain] = useState("base");
  const [token, setToken] = useState("USDT");
  const [amount, setAmount] = useState("50000");

  const numericAmount = parseFloat(amount) || 0;
  const bridgeFee = 0.8;
  const youReceive = numericAmount > bridgeFee ? numericAmount - bridgeFee : 0;

  function swapChains() {
    setFromChain(toChain);
    setToChain(fromChain);
  }

  return (
    <PageTransition className="px-4 sm:px-6 md:px-8 w-full">
      <h1 className="sr-only">Bridge</h1>
      <div className="space-y-6">
      {/* Page context header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[rgba(5,224,248,0.08)] border border-[rgba(5,224,248,0.12)] flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" className="text-[var(--cyan)]">
            <path d="M3 7h12M15 7l-3-3M15 11H3M3 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <div className="text-sm font-medium text-white">Cross-chain Bridge</div>
          <div className="text-[11px] text-[var(--text-4)]">Move stablecoins between 6 chains</div>
        </div>
      </div>

      {/* Bridge form card — full-width, two zones */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden"
      >
        {/* Right-side illustration zone — visible behind content on lg */}
        <div className="absolute top-0 bottom-0 hidden lg:flex items-center justify-center pointer-events-none overflow-hidden" style={{ right: '-8%', width: '45%' }} aria-hidden="true">
          <AnimatedIllustration
            src="/illustrations/nonco-illustrationspack-2026-89-05.svg"
            style={{ width: '100%', minWidth: 500, opacity: 0.5 }}
          />
        </div>

        {/* Content — constrained to left on lg */}
        <div className="relative z-10 lg:max-w-[60%] p-6 space-y-5">
          {/* From chain */}
          <div className="space-y-1.5">
            <label htmlFor="bridge-from-chain" className="text-[11px] font-sans font-medium uppercase tracking-[.1em] text-[var(--text-4)]">
              From chain
            </label>
            <select
              id="bridge-from-chain"
              value={fromChain}
              onChange={(e) => setFromChain(e.target.value)}
              className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm font-sans text-[var(--text)] outline-none focus:border-white transition-colors"
            >
              {chains.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Swap direction button */}
          <div className="flex justify-center lg:justify-start lg:pl-8">
            <button
              onClick={swapChains}
              className="w-10 h-10 rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center hover:border-white transition-colors cursor-pointer"
              aria-label="Swap chains"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M4 6l4-4 4 4M4 10l4 4 4-4" stroke="var(--text-3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* To chain */}
          <div className="space-y-1.5">
            <label htmlFor="bridge-to-chain" className="text-[11px] font-sans font-medium uppercase tracking-[.1em] text-[var(--text-4)]">
              To chain
            </label>
            <select
              id="bridge-to-chain"
              value={toChain}
              onChange={(e) => setToChain(e.target.value)}
              className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm font-sans text-[var(--text)] outline-none focus:border-white transition-colors"
            >
              {chains.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Token + Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="bridge-token" className="text-[11px] font-sans font-medium uppercase tracking-[.1em] text-[var(--text-4)]">
                Token
              </label>
              <select
                id="bridge-token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm font-sans text-[var(--text)] outline-none focus:border-white transition-colors"
              >
                {tokens.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="bridge-amount" className="text-[11px] font-sans font-medium uppercase tracking-[.1em] text-[var(--text-4)]">
                Amount
              </label>
              <input
                id="bridge-amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm font-mono text-[var(--text)] outline-none focus:border-white transition-colors placeholder:text-[var(--text-4)]"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Fee summary */}
          <div className="bg-[var(--bg-elevated)] rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-sans text-[var(--text-4)]">Bridge fee</span>
              <span className="text-xs font-mono text-[var(--text-3)] tabular-nums">~$0.80</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-sans text-[var(--text-4)]">Est. time</span>
              <span className="text-xs font-sans text-[var(--text-3)]">~45 sec</span>
            </div>
            <div className="border-t border-[var(--border)] pt-3 flex items-center justify-between">
              <span className="text-[11px] font-sans text-[var(--text-4)]">You receive</span>
              <span className="text-lg font-mono font-bold text-white tabular-nums">
                ${formatMoney(youReceive)}
              </span>
            </div>
          </div>

          {/* Connect wallet */}
          <Button variant="cyan" size="lg" className="w-full">
            Connect wallet to bridge
          </Button>
        </div>
      </motion.div>

      {/* Stat cards */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-3">
          <div className="text-[9px] text-[var(--text-4)] uppercase tracking-[0.1em]">Avg Time</div>
          <div className="text-lg font-mono font-bold text-white mt-1">~45s</div>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-3">
          <div className="text-[9px] text-[var(--text-4)] uppercase tracking-[0.1em]">Chains</div>
          <div className="text-lg font-mono font-bold text-white mt-1">6</div>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-3">
          <div className="text-[9px] text-[var(--text-4)] uppercase tracking-[0.1em]">Fee</div>
          <div className="text-lg font-mono font-bold text-white mt-1">~$0.80</div>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-3">
          <div className="text-[9px] text-[var(--text-4)] uppercase tracking-[0.1em]">Volume</div>
          <div className="text-lg font-mono font-bold text-white mt-1">$2.4M</div>
        </div>
      </motion.div>
      </div>
    </PageTransition>
  );
}
