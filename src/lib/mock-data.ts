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

// FX Board instrument with live pricing data
export interface BoardInstrument {
  id: string;
  pair: string;
  baseCurrency: string;
  quoteCurrency: string;
  sell: number;
  buy: number;
  sellQty: number;
  buyQty: number;
  change24h: number;
  prevClose: number;
  section: "latam" | "brl" | "eur" | "gbp";
}

export interface BoardSection {
  id: string;
  label: string;
  color: string;
}

// Yield vault
export interface YieldVault {
  id: string;
  name: string;
  currency: string;
  flag: string;
  institution: string;
  apy: number;
  balance: number;
  balanceLabel: string;
  earnedMTD: number;
  color: string;
  status: "active" | "coming-soon";
}

// Payment
export interface Payment {
  id: string;
  payee: string;
  reference: string;
  corridor: string;
  amount: number;
  status: "completed" | "processing" | "failed";
  date: Date;
}

// Third-party payee
export interface ThirdPartyPayee {
  id: string;
  name: string;
  reference: string;
  type: "vendor" | "contractor" | "payroll";
  corridor: string;
  amount: number;
  status: "settled" | "processing";
  date: string;
}

// API key
export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  environment: "live" | "sandbox";
  createdAt: string;
  lastUsed: string;
}

// Ticker item
export interface TickerItem {
  pair: string;
  rate: string;
  change: number;
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
export const BASE_RATES: Record<string, number> = {
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
  { currency: "USDT", available: 310_000, pending: 48_000, symbol: "$" },
  { currency: "USDC", available: 280_000, pending: 51_500, symbol: "$" },
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

// ---------------------------------------------------------------------------
// Board Sections
// ---------------------------------------------------------------------------

export const boardSections: Record<string, BoardSection> = {
  latam: { id: "latam", label: "LATAM — MXN, COP, CLP", color: "#05E0F8" },
  brl: { id: "brl", label: "Brazil — BRL", color: "var(--purple)" },
  eur: { id: "eur", label: "Europe — EUR", color: "#38bdf8" },
  gbp: { id: "gbp", label: "UK — GBP", color: "var(--amber)" },
};

// ---------------------------------------------------------------------------
// FX Board Instruments (14)
// ---------------------------------------------------------------------------

export const boardInstruments: BoardInstrument[] = [
  { id: "mxn-usdt", pair: "MXN/USDT", baseCurrency: "MXN", quoteCurrency: "USDT", sell: 17.4480, buy: 17.4560, sellQty: 1000, buyQty: 1000, change24h: 0.12, prevClose: 17.3981, section: "latam" },
  { id: "mxn-usdc", pair: "MXN/USDC", baseCurrency: "MXN", quoteCurrency: "USDC", sell: 17.4475, buy: 17.4555, sellQty: 1000, buyQty: 1000, change24h: 0.11, prevClose: 17.3961, section: "latam" },
  { id: "mxn-ausd", pair: "MXN/AUSD", baseCurrency: "MXN", quoteCurrency: "AUSD", sell: 17.4460, buy: 17.4540, sellQty: 500, buyQty: 500, change24h: 0.10, prevClose: 17.3948, section: "latam" },
  { id: "mxn-usd1", pair: "MXN/USD1", baseCurrency: "MXN", quoteCurrency: "USD1", sell: 17.4462, buy: 17.4542, sellQty: 500, buyQty: 500, change24h: 0.11, prevClose: 17.3950, section: "latam" },
  { id: "mxn-usd", pair: "MXN/USD", baseCurrency: "MXN", quoteCurrency: "USD", sell: 17.4478, buy: 17.4558, sellQty: 2000, buyQty: 2000, change24h: 0.12, prevClose: 17.3980, section: "latam" },
  { id: "cop-usdt", pair: "COP/USDT", baseCurrency: "COP", quoteCurrency: "USDT", sell: 4116.20, buy: 4119.80, sellQty: 500, buyQty: 500, change24h: 0.21, prevClose: 4109.58, section: "latam" },
  { id: "clp-usdt", pair: "CLP/USDT", baseCurrency: "CLP", quoteCurrency: "USDT", sell: 941.80, buy: 943.20, sellQty: 500, buyQty: 500, change24h: -0.15, prevClose: 944.30, section: "latam" },
  { id: "brl-usdc", pair: "BRL/USDC", baseCurrency: "BRL", quoteCurrency: "USDC", sell: 5.1440, buy: 5.1530, sellQty: 1000, buyQty: 1000, change24h: 0.31, prevClose: 5.1333, section: "brl" },
  { id: "brl-usdt", pair: "BRL/USDT", baseCurrency: "BRL", quoteCurrency: "USDT", sell: 5.1438, buy: 5.1528, sellQty: 1000, buyQty: 1000, change24h: 0.30, prevClose: 5.1338, section: "brl" },
  { id: "eur-usdt", pair: "EUR/USDT", baseCurrency: "EUR", quoteCurrency: "USDT", sell: 1.0831, buy: 1.0839, sellQty: 2000, buyQty: 2000, change24h: -0.04, prevClose: 1.0843, section: "eur" },
  { id: "eur-usdc", pair: "EUR/USDC", baseCurrency: "EUR", quoteCurrency: "USDC", sell: 1.0830, buy: 1.0838, sellQty: 2000, buyQty: 2000, change24h: -0.04, prevClose: 1.0842, section: "eur" },
  { id: "gbp-usdc", pair: "GBP/USDC", baseCurrency: "GBP", quoteCurrency: "USDC", sell: 1.2646, buy: 1.2654, sellQty: 1000, buyQty: 1000, change24h: -0.08, prevClose: 1.2665, section: "gbp" },
  { id: "gbp-usdt", pair: "GBP/USDT", baseCurrency: "GBP", quoteCurrency: "USDT", sell: 1.2645, buy: 1.2653, sellQty: 1000, buyQty: 1000, change24h: -0.08, prevClose: 1.2663, section: "gbp" },
];

// ---------------------------------------------------------------------------
// Ticker Items
// ---------------------------------------------------------------------------

export const tickerItems: TickerItem[] = [
  { pair: "MXN/USDT", rate: "17.4520", change: 0.12 },
  { pair: "BRL/USDC", rate: "5.1485", change: 0.31 },
  { pair: "EUR/USDT", rate: "1.0835", change: -0.04 },
  { pair: "GBP/USDC", rate: "1.2650", change: -0.08 },
  { pair: "COP/USDT", rate: "4118.00", change: 0.21 },
  { pair: "CLP/USDT", rate: "942.50", change: -0.15 },
  { pair: "USD/USDC", rate: "1.0001", change: 0.00 },
  { pair: "USD/USDT", rate: "1.0002", change: 0.00 },
];

// ---------------------------------------------------------------------------
// Yield Vaults (4)
// ---------------------------------------------------------------------------

export const yieldVaults: YieldVault[] = [
  { id: "vault-mxn", name: "MXN vault", currency: "MXN", flag: "🇲🇽", institution: "CETES · Banco de México", apy: 10.82, balance: 3_500_000, balanceLabel: "MX$3.5M", earnedMTD: 4810, color: "#05E0F8", status: "active" },
  { id: "vault-brl", name: "BRL vault", currency: "BRL", flag: "🇧🇷", institution: "Selic · Banco Central", apy: 10.50, balance: 462_000, balanceLabel: "BRL 462K", earnedMTD: 1840, color: "var(--purple)", status: "active" },
  { id: "vault-eur", name: "EUR vault", currency: "EUR", flag: "🇪🇺", institution: "ECB deposit rate", apy: 2.65, balance: 182_000, balanceLabel: "EUR 182K", earnedMTD: 590, color: "#38bdf8", status: "active" },
  { id: "vault-gbp", name: "GBP vault", currency: "GBP", flag: "🇬🇧", institution: "BoE base rate", apy: 4.50, balance: 0, balanceLabel: "—", earnedMTD: 0, color: "var(--amber)", status: "coming-soon" },
];

// ---------------------------------------------------------------------------
// Payments (4)
// ---------------------------------------------------------------------------

export const payments: Payment[] = [
  { id: "PAY-382", payee: "Grupo Bursátil Mexicano", reference: "INV-382", corridor: "→ MXN", amount: 240_000, status: "completed", date: new Date(Date.now() - days(1)) },
  { id: "PAY-041", payee: "DolarApp", reference: "REF-041", corridor: "→ EUR", amount: 88_500, status: "completed", date: new Date(Date.now() - days(2)) },
  { id: "PAY-039", payee: "Remitly BR", reference: "REF-039", corridor: "→ BRL", amount: 52_000, status: "processing", date: new Date(Date.now() - days(3)) },
  { id: "PAY-038", payee: "Wirex EU", reference: "REF-038", corridor: "→ GBP", amount: 31_200, status: "completed", date: new Date(Date.now() - days(4)) },
];

// ---------------------------------------------------------------------------
// Third-party Payees (4)
// ---------------------------------------------------------------------------

export const thirdPartyPayees: ThirdPartyPayee[] = [
  { id: "3P-441", name: "Pinheiro Neto Advogados", reference: "PAY-441", type: "vendor", corridor: "→ BRL", amount: 18_000, status: "settled", date: "Mar 22" },
  { id: "3P-440", name: "Cora Salinas", reference: "PAY-440", type: "contractor", corridor: "→ MXN", amount: 4_200, status: "settled", date: "Mar 21" },
  { id: "3P-439", name: "RSM UK LLP", reference: "PAY-439", type: "vendor", corridor: "→ GBP", amount: 12_500, status: "settled", date: "Mar 20" },
  { id: "3P-438", name: "LatAm BD team", reference: "PAY-438", type: "payroll", corridor: "→ MXN", amount: 9_800, status: "processing", date: "Mar 24" },
];

// ---------------------------------------------------------------------------
// API Keys (2)
// ---------------------------------------------------------------------------

export const apiKeys: ApiKey[] = [
  { id: "key-1", name: "Production", prefix: "sk_live_••••••••7f2a", environment: "live", createdAt: "Jan 12, 2025", lastUsed: "3 min ago" },
  { id: "key-2", name: "Sandbox", prefix: "sk_test_••••••••3c8e", environment: "sandbox", createdAt: "Jan 12, 2025", lastUsed: "1h ago" },
];

// ---------------------------------------------------------------------------
// Reports Data
// ---------------------------------------------------------------------------

export const reportCorridors = [
  { corridor: "USD → MXN", trades: 168, volume: 11_200_000, share: 60.9, avgSize: 66_700 },
  { corridor: "USD → BRL", trades: 74, volume: 3_800_000, share: 20.7, avgSize: 51_400 },
  { corridor: "USD → EUR", trades: 42, volume: 2_400_000, share: 13.0, avgSize: 57_100 },
  { corridor: "USD → GBP", trades: 28, volume: 1_000_000, share: 5.4, avgSize: 35_700 },
];
