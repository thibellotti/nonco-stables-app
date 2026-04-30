// Reference data for the deposit dialog. Mock values — wired to real
// treasury API in production. Keep all addresses/IBAN/CLABE clearly placeholder.

export type CurrencyKind = "fiat" | "crypto";

export interface Network {
  id: string;
  name: string; // "Tron" / "Ethereum"
  abbr: string; // "TRC20" / "ERC20"
  address: string;
  confirmations: number;
  minDeposit: string;
  arrival: string; // human readable
}

export interface Currency {
  symbol: string;
  name: string;
  kind: CurrencyKind;
  networks: Network[];
}

// On-chain currencies (crypto wallet flow)
export const CRYPTO_CURRENCIES: Currency[] = [
  {
    symbol: "USDC",
    name: "USD Coin",
    kind: "crypto",
    networks: [
      {
        id: "usdc-eth",
        name: "Ethereum",
        abbr: "ERC20",
        address: "0x4f2a8b9c3e1d5a7c8b9d0e1f2a3b4c5d6e7f8a9b",
        confirmations: 12,
        minDeposit: "0.01 USDC",
        arrival: "~3 min",
      },
      {
        id: "usdc-sol",
        name: "Solana",
        abbr: "SOL",
        address: "8xR4mPnQwK7vH3LzN9bC2dF6yT1sA5gE0jU8oV",
        confirmations: 1,
        minDeposit: "0.01 USDC",
        arrival: "~30 sec",
      },
      {
        id: "usdc-base",
        name: "Base",
        abbr: "BASE",
        address: "0x9b8a7f6e5d4c3b2a1f0e9d8c7b6a5d4c3b2a1f0e",
        confirmations: 6,
        minDeposit: "0.01 USDC",
        arrival: "~1 min",
      },
      {
        id: "usdc-poly",
        name: "Polygon",
        abbr: "POLY",
        address: "0x2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b",
        confirmations: 128,
        minDeposit: "0.01 USDC",
        arrival: "~5 min",
      },
      {
        id: "usdc-arb",
        name: "Arbitrum",
        abbr: "ARB",
        address: "0x7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d",
        confirmations: 12,
        minDeposit: "0.01 USDC",
        arrival: "~2 min",
      },
    ],
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    kind: "crypto",
    networks: [
      {
        id: "usdt-tron",
        name: "Tron",
        abbr: "TRC20",
        address: "TTYVmo6iYmSCsv1GppEhkJKpxv92eokGGe",
        confirmations: 1,
        minDeposit: "0.01 USDT",
        arrival: "~1 min",
      },
      {
        id: "usdt-eth",
        name: "Ethereum",
        abbr: "ERC20",
        address: "0x5e4d3c2b1a0f9e8d7c6b5a4d3c2b1a0f9e8d7c6b",
        confirmations: 12,
        minDeposit: "0.01 USDT",
        arrival: "~3 min",
      },
      {
        id: "usdt-bsc",
        name: "BNB Smart Chain",
        abbr: "BEP20",
        address: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
        confirmations: 15,
        minDeposit: "0.01 USDT",
        arrival: "~1 min",
      },
      {
        id: "usdt-sol",
        name: "Solana",
        abbr: "SOL",
        address: "9qP2nMxLkR8vF4cT6yE3bA1sD7gH0jU5wV8oX",
        confirmations: 1,
        minDeposit: "0.01 USDT",
        arrival: "~30 sec",
      },
      {
        id: "usdt-poly",
        name: "Polygon",
        abbr: "POLY",
        address: "0x6f5e4d3c2b1a0f9e8d7c6b5a4d3c2b1a0f9e8d7c",
        confirmations: 128,
        minDeposit: "0.01 USDT",
        arrival: "~5 min",
      },
    ],
  },
];

// Fiat rails — wire/SEPA/SPEI/PIX bank details for the bank-transfer flow.
export interface FiatRail {
  symbol: string; // USD / EUR / MXN / BRL
  name: string;
  rail: string; // "Wire" / "SEPA" / "SPEI" / "PIX"
  fields: { label: string; value: string; mono?: boolean }[];
}

export const FIAT_RAILS: FiatRail[] = [
  {
    symbol: "USD",
    name: "US Dollar",
    rail: "Wire transfer",
    fields: [
      { label: "Beneficiary", value: "Treasury 01 — Nonco Stables" },
      { label: "Bank name", value: "Citibank N.A." },
      { label: "SWIFT / BIC", value: "CITIUS33", mono: true },
      { label: "ABA / Routing", value: "021000089", mono: true },
      { label: "Account", value: "30421876342", mono: true },
      { label: "Reference", value: "NSC-USD-001", mono: true },
    ],
  },
  {
    symbol: "EUR",
    name: "Euro",
    rail: "SEPA",
    fields: [
      { label: "Beneficiary", value: "Treasury 01 — Nonco Stables" },
      { label: "Bank name", value: "Deutsche Bank AG" },
      { label: "IBAN", value: "DE89 3704 0044 0532 0130 00", mono: true },
      { label: "SWIFT / BIC", value: "DEUTDEFF", mono: true },
      { label: "Reference", value: "NSC-EUR-001", mono: true },
    ],
  },
  {
    symbol: "MXN",
    name: "Mexican Peso",
    rail: "SPEI",
    fields: [
      { label: "Beneficiary", value: "Treasury 01 — Nonco Stables" },
      { label: "Bank name", value: "BBVA México" },
      { label: "CLABE", value: "012180001234567890", mono: true },
      { label: "Reference", value: "NSC-MXN-001", mono: true },
    ],
  },
  {
    symbol: "BRL",
    name: "Brazilian Real",
    rail: "PIX / TED",
    fields: [
      { label: "Beneficiary", value: "Treasury 01 — Nonco Stables" },
      { label: "Bank name", value: "Itaú Unibanco" },
      { label: "Agência", value: "0123", mono: true },
      { label: "Conta", value: "98765-4", mono: true },
      { label: "PIX key", value: "treasury@nonco.app", mono: true },
      { label: "Reference", value: "NSC-BRL-001", mono: true },
    ],
  },
];

// Recent currencies — localStorage key
export const RECENT_KEY = "nonco-stables-deposit-recent";
export const RECENT_MAX = 4;

export function loadRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(0, RECENT_MAX) : [];
  } catch {
    return [];
  }
}

export function pushRecent(symbol: string): string[] {
  if (typeof window === "undefined") return [];
  const current = loadRecent().filter((s) => s !== symbol);
  const next = [symbol, ...current].slice(0, RECENT_MAX);
  try {
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    /* quota / privacy mode — ignore */
  }
  return next;
}
