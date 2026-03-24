// Shared currency color config — single source of truth for all currency visualizations

export const currencyColors: Record<string, { bg: string; text: string; border: string }> = {
  USD: { bg: "rgba(5,224,248,0.1)", text: "var(--cyan)", border: "#05E0F8" },
  EUR: { bg: "rgba(56,189,248,0.1)", text: "#38bdf8", border: "#38bdf8" },
  MXN: { bg: "rgba(34,197,94,0.1)", text: "var(--green)", border: "#22c55e" },
  USDT: { bg: "rgba(168,85,247,0.1)", text: "var(--purple)", border: "#a855f7" },
  USDC: { bg: "rgba(99,102,241,0.1)", text: "#6366f1", border: "#6366f1" },
  GBP: { bg: "rgba(245,158,11,0.1)", text: "var(--amber)", border: "#f59e0b" },
  BRL: { bg: "rgba(236,72,153,0.1)", text: "#ec4899", border: "#ec4899" },
};
