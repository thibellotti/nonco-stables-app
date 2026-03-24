// Mock data for Nonco Stables — institutional stablecoin settlement platform

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TransactionType = "deposit" | "withdrawal" | "trade" | "settlement";
export type TransactionStatus = "completed" | "pending" | "failed";

export interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  amount: number;
  currency: string;
  timestamp: Date;
  status: TransactionStatus;
  counterparty?: string;
}

export interface Instrument {
  pair: string;
  baseCurrency: string;
  quoteCurrency: string;
}

export interface Favorite {
  id: string;
  instrument: Instrument;
  defaultQuantity: number;
}

export interface Quote {
  instrument: Instrument;
  bid: number;
  ask: number;
  spotBid: number;
  spotAsk: number;
  t1Bid: number;
  t1Ask: number;
  t2Bid: number;
  t2Ask: number;
  t10Bid: number;
  t10Ask: number;
  expiresAt: number;
}

export interface Balance {
  currency: string;
  available: number;
  pending: number;
  symbol: string;
}

export interface RecentTrade {
  id: string;
  pair: string;
  side: "buy" | "sell";
  quantity: number;
  price: number;
  settlement: string;
  timestamp: Date;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const hours = (h: number) => h * 60 * 60 * 1000;
const days = (d: number) => d * 24 * 60 * 60 * 1000;

// Base mid-market rates (quote currency per 1 base unit)
const BASE_RATES: Record<string, number> = {
  "MXN/USDT": 17.45,
  "EUR/USDT": 1.0835,
  "BRL/USDC": 5.15,
  "USD/USDT": 1.0002,
  "GBP/USDC": 1.265,
  "EUR/USDC": 1.084,
  "MXN/USDC": 17.42,
  "BRL/USDT": 5.16,
};

/**
 * Generate a realistic quote for a given instrument.
 * Spot spread is tight (~2-5 bps). Forward tenors carry a small premium
 * that widens with time to settlement.
 */
export function generateQuote(instrument: Instrument): Quote {
  const mid = BASE_RATES[instrument.pair] ?? 1;

  // Spread half-width scales with price magnitude
  const halfSpread = mid * 0.00015; // ~3 bps round-trip

  const spotBid = +(mid - halfSpread).toFixed(4);
  const spotAsk = +(mid + halfSpread).toFixed(4);

  // Forward premiums (annualised ~2-4 % implied, scaled to tenor)
  const t1Factor = 1 + 0.03 / 365;
  const t2Factor = 1 + 0.032 / 365 * 2;
  const t10Factor = 1 + 0.038 / 365 * 10;

  const t1Bid = +(spotBid * t1Factor).toFixed(4);
  const t1Ask = +(spotAsk * t1Factor).toFixed(4);
  const t2Bid = +(spotBid * t2Factor).toFixed(4);
  const t2Ask = +(spotAsk * t2Factor).toFixed(4);
  const t10Bid = +(spotBid * t10Factor).toFixed(4);
  const t10Ask = +(spotAsk * t10Factor).toFixed(4);

  return {
    instrument,
    bid: spotBid,
    ask: spotAsk,
    spotBid,
    spotAsk,
    t1Bid,
    t1Ask,
    t2Bid,
    t2Ask,
    t10Bid,
    t10Ask,
    expiresAt: Date.now() + 15_000, // 15 s validity
  };
}

// ---------------------------------------------------------------------------
// Instruments
// ---------------------------------------------------------------------------

export const instruments: Instrument[] = [
  { pair: "MXN/USDT", baseCurrency: "MXN", quoteCurrency: "USDT" },
  { pair: "EUR/USDT", baseCurrency: "EUR", quoteCurrency: "USDT" },
  { pair: "BRL/USDC", baseCurrency: "BRL", quoteCurrency: "USDC" },
  { pair: "USD/USDT", baseCurrency: "USD", quoteCurrency: "USDT" },
  { pair: "GBP/USDC", baseCurrency: "GBP", quoteCurrency: "USDC" },
  { pair: "EUR/USDC", baseCurrency: "EUR", quoteCurrency: "USDC" },
  { pair: "MXN/USDC", baseCurrency: "MXN", quoteCurrency: "USDC" },
  { pair: "BRL/USDT", baseCurrency: "BRL", quoteCurrency: "USDT" },
];

// ---------------------------------------------------------------------------
// Favorites
// ---------------------------------------------------------------------------

export const favorites: Favorite[] = [
  { id: "fav-1", instrument: instruments[0], defaultQuantity: 100_000 },
  { id: "fav-2", instrument: instruments[1], defaultQuantity: 50_000 },
  { id: "fav-3", instrument: instruments[2], defaultQuantity: 200_000 },
  { id: "fav-4", instrument: instruments[3], defaultQuantity: 500_000 },
];

// ---------------------------------------------------------------------------
// Balances — total available ~$1.247M, pending ~$147K
// ---------------------------------------------------------------------------

export const balances: Balance[] = [
  { currency: "USD", available: 425_000, pending: 35_000, symbol: "$" },
  { currency: "EUR", available: 182_000, pending: 12_500, symbol: "\u20AC" },
  { currency: "MXN", available: 3_450_000, pending: 875_000, symbol: "MX$" },
  { currency: "USDT", available: 310_000, pending: 48_000, symbol: "\u20AE" },
  { currency: "USDC", available: 280_000, pending: 51_500, symbol: "\u20B3" },
];

// ---------------------------------------------------------------------------
// Transactions (18) — last 7 days
// ---------------------------------------------------------------------------

export const transactions: Transaction[] = [
  {
    id: "txn-001",
    type: "deposit",
    description: "Wire deposit — Citibank",
    amount: 250_000,
    currency: "USD",
    timestamp: new Date(Date.now() - hours(3)),
    status: "completed",
    counterparty: "Citibank N.A.",
  },
  {
    id: "txn-002",
    type: "trade",
    description: "Buy MXN/USDT — Spot",
    amount: 1_745_000,
    currency: "MXN",
    timestamp: new Date(Date.now() - hours(6)),
    status: "completed",
    counterparty: "Nonco Liquidity",
  },
  {
    id: "txn-003",
    type: "settlement",
    description: "T+1 settlement — EUR/USDT",
    amount: 108_350,
    currency: "USDT",
    timestamp: new Date(Date.now() - hours(14)),
    status: "pending",
    counterparty: "Deutsche Bank AG",
  },
  {
    id: "txn-004",
    type: "withdrawal",
    description: "USDC redemption to bank",
    amount: 150_000,
    currency: "USDC",
    timestamp: new Date(Date.now() - days(1)),
    status: "completed",
    counterparty: "Circle Internet Financial",
  },
  {
    id: "txn-005",
    type: "trade",
    description: "Sell EUR/USDC — Spot",
    amount: 54_200,
    currency: "EUR",
    timestamp: new Date(Date.now() - days(1) - hours(4)),
    status: "completed",
    counterparty: "Nonco Liquidity",
  },
  {
    id: "txn-006",
    type: "deposit",
    description: "USDT deposit — Tether Treasury",
    amount: 500_000,
    currency: "USDT",
    timestamp: new Date(Date.now() - days(1) - hours(9)),
    status: "completed",
    counterparty: "Tether Operations",
  },
  {
    id: "txn-007",
    type: "trade",
    description: "Buy BRL/USDC — T+1",
    amount: 515_000,
    currency: "BRL",
    timestamp: new Date(Date.now() - days(2)),
    status: "completed",
    counterparty: "Nonco Liquidity",
  },
  {
    id: "txn-008",
    type: "settlement",
    description: "T+2 settlement — GBP/USDC",
    amount: 63_250,
    currency: "USDC",
    timestamp: new Date(Date.now() - days(2) - hours(6)),
    status: "completed",
    counterparty: "Barclays PLC",
  },
  {
    id: "txn-009",
    type: "withdrawal",
    description: "MXN wire to Banorte",
    amount: 875_000,
    currency: "MXN",
    timestamp: new Date(Date.now() - days(2) - hours(12)),
    status: "pending",
    counterparty: "Banorte S.A.",
  },
  {
    id: "txn-010",
    type: "trade",
    description: "Buy USD/USDT — Spot",
    amount: 500_000,
    currency: "USD",
    timestamp: new Date(Date.now() - days(3)),
    status: "completed",
    counterparty: "Nonco Liquidity",
  },
  {
    id: "txn-011",
    type: "deposit",
    description: "EUR SEPA deposit",
    amount: 200_000,
    currency: "EUR",
    timestamp: new Date(Date.now() - days(3) - hours(5)),
    status: "completed",
    counterparty: "BNP Paribas",
  },
  {
    id: "txn-012",
    type: "trade",
    description: "Sell MXN/USDC — T+2",
    amount: 2_614_500,
    currency: "MXN",
    timestamp: new Date(Date.now() - days(4)),
    status: "completed",
    counterparty: "Nonco Liquidity",
  },
  {
    id: "txn-013",
    type: "settlement",
    description: "Spot settlement — BRL/USDT",
    amount: 103_200,
    currency: "USDT",
    timestamp: new Date(Date.now() - days(4) - hours(8)),
    status: "completed",
    counterparty: "Banco Itau S.A.",
  },
  {
    id: "txn-014",
    type: "withdrawal",
    description: "USDT withdrawal to wallet",
    amount: 75_000,
    currency: "USDT",
    timestamp: new Date(Date.now() - days(5)),
    status: "completed",
    counterparty: "External Wallet",
  },
  {
    id: "txn-015",
    type: "trade",
    description: "Buy EUR/USDT — T+1",
    amount: 162_525,
    currency: "EUR",
    timestamp: new Date(Date.now() - days(5) - hours(3)),
    status: "completed",
    counterparty: "Nonco Liquidity",
  },
  {
    id: "txn-016",
    type: "deposit",
    description: "USDC mint — Circle",
    amount: 300_000,
    currency: "USDC",
    timestamp: new Date(Date.now() - days(5) - hours(10)),
    status: "completed",
    counterparty: "Circle Internet Financial",
  },
  {
    id: "txn-017",
    type: "trade",
    description: "Buy GBP/USDC — Spot",
    amount: 126_500,
    currency: "GBP",
    timestamp: new Date(Date.now() - days(6)),
    status: "failed",
    counterparty: "Nonco Liquidity",
  },
  {
    id: "txn-018",
    type: "settlement",
    description: "T+1 settlement — MXN/USDT",
    amount: 87_250,
    currency: "USDT",
    timestamp: new Date(Date.now() - days(6) - hours(7)),
    status: "pending",
    counterparty: "BBVA Mexico",
  },
];

// ---------------------------------------------------------------------------
// Recent Trades (8)
// ---------------------------------------------------------------------------

export const recentTrades: RecentTrade[] = [
  {
    id: "trade-001",
    pair: "MXN/USDT",
    side: "buy",
    quantity: 100_000,
    price: 17.452,
    settlement: "Spot",
    timestamp: new Date(Date.now() - hours(6)),
  },
  {
    id: "trade-002",
    pair: "EUR/USDT",
    side: "sell",
    quantity: 50_000,
    price: 1.0838,
    settlement: "T+1",
    timestamp: new Date(Date.now() - hours(14)),
  },
  {
    id: "trade-003",
    pair: "BRL/USDC",
    side: "buy",
    quantity: 200_000,
    price: 5.1485,
    settlement: "T+1",
    timestamp: new Date(Date.now() - days(1) - hours(2)),
  },
  {
    id: "trade-004",
    pair: "USD/USDT",
    side: "buy",
    quantity: 500_000,
    price: 1.0002,
    settlement: "Spot",
    timestamp: new Date(Date.now() - days(2)),
  },
  {
    id: "trade-005",
    pair: "EUR/USDC",
    side: "sell",
    quantity: 75_000,
    price: 1.0842,
    settlement: "Spot",
    timestamp: new Date(Date.now() - days(2) - hours(8)),
  },
  {
    id: "trade-006",
    pair: "MXN/USDC",
    side: "buy",
    quantity: 150_000,
    price: 17.418,
    settlement: "T+2",
    timestamp: new Date(Date.now() - days(3) - hours(5)),
  },
  {
    id: "trade-007",
    pair: "GBP/USDC",
    side: "sell",
    quantity: 50_000,
    price: 1.2648,
    settlement: "Spot",
    timestamp: new Date(Date.now() - days(4)),
  },
  {
    id: "trade-008",
    pair: "BRL/USDT",
    side: "buy",
    quantity: 300_000,
    price: 5.162,
    settlement: "T+1",
    timestamp: new Date(Date.now() - days(5) - hours(3)),
  },
];

// ---------------------------------------------------------------------------
// USD Exchange Rates
// ---------------------------------------------------------------------------

// Approximate USD exchange rates for portfolio valuation
export const usdRates: Record<string, number> = {
  USD: 1,
  EUR: 1.08,
  MXN: 0.058,
  USDT: 1,
  USDC: 1,
  GBP: 1.27,
  BRL: 0.195,
};
