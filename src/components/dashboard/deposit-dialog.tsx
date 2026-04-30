"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CRYPTO_CURRENCIES, loadRecent, pushRecent, type Currency, type Network } from "./deposit-dialog/data";
import { CurrencyList } from "./deposit-dialog/currency-list";
import { NetworkList } from "./deposit-dialog/network-list";
import { QRStep } from "./deposit-dialog/qr-step";
import { BankDetails } from "./deposit-dialog/bank-details";

export interface DepositDialogProps {
  open: boolean;
  onClose: () => void;
}

type Tab = "fiat" | "crypto";
type CryptoStep = "currency" | "network" | "qr";

const SLIDE_TRANSITION = { duration: 0.2, ease: [0.16, 1, 0.3, 1] as const };

export function DepositDialog({ open, onClose }: DepositDialogProps) {
  const [tab, setTab] = useState<Tab>("crypto");
  const [step, setStep] = useState<CryptoStep>("currency");
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
  // `recentVersion` bumps whenever we mutate recent — drives the memo without
  // needing an effect-driven setState (banned by react-hooks rules).
  const [recentVersion, setRecentVersion] = useState(0);
  const recent = useMemo(() => {
    // recentVersion read here intentionally to invalidate the memo on bump.
    void recentVersion;
    return open ? loadRecent() : [];
  }, [open, recentVersion]);

  // Reset internal state when the dialog closes so reopening is fresh
  useEffect(() => {
    if (!open) {
      // Wait for exit animation before clearing state — small delay matches
      // the dialog exit transition (~240ms). This avoids a visible flash of
      // the step-1 view as the dialog fades out.
      const t = setTimeout(() => {
        setStep("currency");
        setSelectedCurrency(null);
        setSelectedNetwork(null);
      }, 260);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Esc to close (or back-step within the crypto flow)
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      if (tab === "crypto" && step === "qr") {
        setStep("network");
      } else if (tab === "crypto" && step === "network") {
        setStep("currency");
      } else {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, tab, step, onClose]);

  const handleSelectCurrency = useCallback((symbol: string) => {
    const currency = CRYPTO_CURRENCIES.find((c) => c.symbol === symbol);
    if (!currency) return;
    setSelectedCurrency(currency);
    pushRecent(symbol);
    setRecentVersion((v) => v + 1);
    // Auto-skip the network picker for single-network currencies
    if (currency.networks.length === 1) {
      setSelectedNetwork(currency.networks[0]);
      setStep("qr");
    } else {
      setStep("network");
    }
  }, []);

  const handleSelectNetwork = useCallback((network: Network) => {
    setSelectedNetwork(network);
    setStep("qr");
  }, []);

  const handleBack = useCallback(() => {
    if (step === "qr") setStep("network");
    else if (step === "network") setStep("currency");
  }, [step]);

  // Header title and back button visibility per step
  const cryptoTitle =
    step === "currency"
      ? "Select currency"
      : step === "network"
        ? "Select network"
        : `Deposit ${selectedCurrency?.symbol ?? ""}`;

  const showBack = tab === "crypto" && step !== "currency";

  return (
    <AnimatePresence>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Deposit funds"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[480px] sm:max-w-[520px] max-h-[90vh] bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex flex-col"
          >
            {/* Header */}
            <div className="px-6 pt-4 pb-3 border-b border-[var(--border)]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 min-w-0">
                  {showBack && (
                    <button
                      type="button"
                      onClick={handleBack}
                      aria-label="Back"
                      className="-ml-1 p-1 text-[var(--text-3)] hover:text-[var(--text)] transition-colors cursor-pointer"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M10 4l-4 4 4 4" />
                      </svg>
                    </button>
                  )}
                  <h2 className="text-[13px] font-sans text-[var(--text)] truncate">
                    {tab === "fiat" ? "Bank transfer" : cryptoTitle}
                  </h2>
                  {tab === "crypto" && step === "qr" && selectedNetwork && (
                    <span className="text-[10px] font-mono text-[var(--text-3)] px-1.5 py-0.5 rounded bg-[var(--bg-elevated)] border border-[var(--border)]">
                      {selectedNetwork.abbr}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="-mr-2 p-1 text-[var(--text-4)] hover:text-[var(--text)] transition-colors cursor-pointer"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  >
                    <path d="M3 3l10 10M13 3L3 13" />
                  </svg>
                </button>
              </div>

              {/* Top-level tabs (only visible at root step of each flow) */}
              {(tab === "fiat" || step === "currency") && (
                <div
                  role="tablist"
                  aria-label="Deposit method"
                  className="inline-flex w-full gap-0.5 p-0.5 rounded-md bg-[var(--bg-elevated)] border border-[var(--border)]"
                >
                  <button
                    role="tab"
                    aria-selected={tab === "crypto"}
                    onClick={() => {
                      setTab("crypto");
                      setStep("currency");
                    }}
                    className={
                      "flex-1 px-3 py-1.5 rounded text-[10px] font-sans uppercase tracking-[.12em] transition-colors cursor-pointer " +
                      (tab === "crypto"
                        ? "bg-[var(--bg-card)] text-[var(--text)]"
                        : "text-[var(--text-3)] hover:text-[var(--text-2)]")
                    }
                  >
                    Crypto wallet
                  </button>
                  <button
                    role="tab"
                    aria-selected={tab === "fiat"}
                    onClick={() => setTab("fiat")}
                    className={
                      "flex-1 px-3 py-1.5 rounded text-[10px] font-sans uppercase tracking-[.12em] transition-colors cursor-pointer " +
                      (tab === "fiat"
                        ? "bg-[var(--bg-card)] text-[var(--text)]"
                        : "text-[var(--text-3)] hover:text-[var(--text-2)]")
                    }
                  >
                    Bank transfer
                  </button>
                </div>
              )}
            </div>

            {/* Body — animated step transitions */}
            <div className="flex-1 overflow-y-auto relative">
              <AnimatePresence mode="wait" initial={false}>
                {tab === "fiat" ? (
                  <motion.div
                    key="fiat"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={SLIDE_TRANSITION}
                  >
                    <BankDetails />
                  </motion.div>
                ) : step === "currency" ? (
                  <motion.div
                    key="currency"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={SLIDE_TRANSITION}
                  >
                    <CurrencyList recent={recent} onSelect={handleSelectCurrency} />
                  </motion.div>
                ) : step === "network" && selectedCurrency ? (
                  <motion.div
                    key="network"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={SLIDE_TRANSITION}
                  >
                    <NetworkList currency={selectedCurrency} onSelect={handleSelectNetwork} />
                  </motion.div>
                ) : step === "qr" && selectedCurrency && selectedNetwork ? (
                  <motion.div
                    key="qr"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={SLIDE_TRANSITION}
                  >
                    <QRStep currency={selectedCurrency} network={selectedNetwork} />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
