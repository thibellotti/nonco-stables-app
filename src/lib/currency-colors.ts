// Nonco brand currency colors — muted palette, no neon

export const currencyColors: Record<string, { bg: string; text: string; border: string }> = {
  USD: { bg: "rgba(5,224,248,0.08)", text: "#05E0F8", border: "#05E0F8" },
  EUR: { bg: "rgba(56,189,248,0.1)", text: "#38bdf8", border: "#38bdf8" },
  MXN: { bg: "rgba(74,222,128,0.1)", text: "#4ade80", border: "#4ade80" },
  USDT: { bg: "rgba(161,36,248,0.1)", text: "#a124f8", border: "#a124f8" },
  USDC: { bg: "rgba(99,102,241,0.1)", text: "#6366f1", border: "#6366f1" },
  GBP: { bg: "rgba(251,191,36,0.1)", text: "#fbbf24", border: "#fbbf24" },
  BRL: { bg: "rgba(236,72,153,0.1)", text: "#ec4899", border: "#ec4899" },
  COP: { bg: "rgba(74,222,128,0.1)", text: "#4ade80", border: "#4ade80" },
  CLP: { bg: "rgba(74,222,128,0.1)", text: "#4ade80", border: "#4ade80" },
  AUSD: { bg: "rgba(161,36,248,0.08)", text: "#c084fc", border: "#c084fc" },
  USD1: { bg: "rgba(5,224,248,0.08)", text: "#05E0F8", border: "#05E0F8" },
};

// Stablecoins — used by `displayCurrency` to pick the non-stable (identity) side of a pair
const STABLECOINS = new Set(["USDT", "USDC", "AUSD", "USD1"]);

/**
 * Returns the visually-meaningful currency of a pair (the non-stablecoin side).
 * Example: "USDT/MXN" → "MXN"; "EUR/USDT" → "EUR"; "USD/USDT" → "USD".
 * Used for card accent colors so identity follows the exotic currency regardless
 * of which side of the pair it sits on.
 */
export function displayCurrency(pair: string): string {
  const [base, quote] = pair.split("/");
  if (STABLECOINS.has(base) && !STABLECOINS.has(quote)) return quote;
  return base;
}
