import { transactions } from "@/lib/mock-data";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Tab = "pending" | "completed";
export type TermFilter = "all" | "T+1" | "T+2" | "T+10";

export interface PendingSettlement {
  id: string;
  pair: string;
  amount: number;
  dueDate: string;
  dueDateShort: string;
  status: "processing" | "awaiting";
  counterparty: string;
  settlement: string;
  progress: number;
  daysRemaining: number;
}

// ---------------------------------------------------------------------------
// Mock data — expanded for richer display
// ---------------------------------------------------------------------------

export const pendingSettlements: PendingSettlement[] = [
  {
    id: "stl-p1",
    pair: "USDT/MXN",
    amount: 500_000,
    dueDate: "Mar 25, 2026",
    dueDateShort: "Mar 25",
    status: "processing",
    counterparty: "Banorte S.A.",
    settlement: "T+1",
    progress: 72,
    daysRemaining: 0,
  },
  {
    id: "stl-p2",
    pair: "EUR/USDT",
    amount: 108_000,
    dueDate: "Mar 26, 2026",
    dueDateShort: "Mar 26",
    status: "processing",
    counterparty: "Deutsche Bank AG",
    settlement: "T+2",
    progress: 48,
    daysRemaining: 0,
  },
  {
    id: "stl-p4",
    pair: "GBP/USDC",
    amount: 245_000,
    dueDate: "Mar 28, 2026",
    dueDateShort: "Mar 28",
    status: "processing",
    counterparty: "Barclays PLC",
    settlement: "T+2",
    progress: 58,
    daysRemaining: 2,
  },
  {
    id: "stl-p5",
    pair: "USD/USDT",
    amount: 2_150_000,
    dueDate: "Mar 31, 2026",
    dueDateShort: "Mar 31",
    status: "awaiting",
    counterparty: "JP Morgan Chase",
    settlement: "T+1",
    progress: 12,
    daysRemaining: 5,
  },
  {
    id: "stl-p3",
    pair: "USDC/BRL",
    amount: 1_030_000,
    dueDate: "Apr 3, 2026",
    dueDateShort: "Apr 3",
    status: "awaiting",
    counterparty: "Banco Itau S.A.",
    settlement: "T+10",
    progress: 8,
    daysRemaining: 8,
  },
  {
    id: "stl-p6",
    pair: "USDT/MXN",
    amount: 780_000,
    dueDate: "Apr 7, 2026",
    dueDateShort: "Apr 7",
    status: "awaiting",
    counterparty: "BBVA Mexico",
    settlement: "T+2",
    progress: 5,
    daysRemaining: 12,
  },
];

export const completedSettlements = transactions.filter(
  (t) => t.type === "settlement",
);

// ---------------------------------------------------------------------------
// Derived analytics
// ---------------------------------------------------------------------------

export const totalPendingAmount = pendingSettlements.reduce(
  (sum, s) => sum + s.amount,
  0,
);

export const processingCount = pendingSettlements.filter(
  (s) => s.status === "processing",
).length;

export const awaitingCount = pendingSettlements.filter(
  (s) => s.status === "awaiting",
).length;

export const processingAmount = pendingSettlements
  .filter((s) => s.status === "processing")
  .reduce((sum, s) => sum + s.amount, 0);

export const awaitingAmount = pendingSettlements
  .filter((s) => s.status === "awaiting")
  .reduce((sum, s) => sum + s.amount, 0);

export const avgProgress = Math.round(
  pendingSettlements.reduce((sum, s) => sum + s.progress, 0) /
    pendingSettlements.length,
);

// Volume by settlement terms
export const volumeByTerms = pendingSettlements.reduce(
  (acc, s) => {
    acc[s.settlement] = (acc[s.settlement] || 0) + s.amount;
    return acc;
  },
  {} as Record<string, number>,
);

export const sortedTerms = Object.entries(volumeByTerms).sort(
  ([, a], [, b]) => b - a,
);

export const maxTermVolume = sortedTerms[0]?.[1] || 1;

// Counterparty exposure
export const exposureByCounterparty = pendingSettlements.reduce(
  (acc, s) => {
    const name = s.counterparty.split(" ")[0];
    acc[name] = (acc[name] || 0) + s.amount;
    return acc;
  },
  {} as Record<string, number>,
);

export const sortedExposure = Object.entries(exposureByCounterparty).sort(
  ([, a], [, b]) => b - a,
);

export const nextDue = pendingSettlements[0];

// Per-term breakdown — used by the Overview rings so the numbers actually
// reconcile with the rest of the page (each ring shows that term's volume share).
export interface TermBreakdown {
  term: string;
  amount: number;
  share: number; // % of totalPendingAmount
  count: number;
  avgProgress: number;
  nextDueShort: string | null;
}

export const termBreakdowns: TermBreakdown[] = (["T+1", "T+2", "T+10"] as const).map((term) => {
  const items = pendingSettlements.filter((s) => s.settlement === term);
  const amount = items.reduce((sum, s) => sum + s.amount, 0);
  const avgProgress = items.length
    ? Math.round(items.reduce((sum, s) => sum + s.progress, 0) / items.length)
    : 0;
  const next = items.sort((a, b) => a.daysRemaining - b.daysRemaining)[0];
  return {
    term,
    amount,
    share: totalPendingAmount > 0 ? Math.round((amount / totalPendingAmount) * 100) : 0,
    count: items.length,
    avgProgress,
    nextDueShort: next?.dueDateShort ?? null,
  };
});

