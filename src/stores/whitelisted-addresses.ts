// Whitelisted addresses store — single source of truth for the operator's
// pre-approved outgoing wallet addresses (the "address book").
//
// Outgoing transfers in production will be restricted to addresses in this
// list — the same security model used by Codex.io and other institutional
// custody platforms. For the launch scope, the data lives entirely in
// localStorage; the persistence key is "nonco-stables-whitelisted-addresses"
// so it gets cleared by the SignOutButton along with the rest of the
// "nonco-stables-" prefixed app state.
//
// Use the selector hooks at the bottom — never destructure the whole store.

"use client";

import { useShallow } from "zustand/react/shallow";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Network identifiers for whitelisted addresses. Mirror the deposit dialog
 *  network abbreviations where possible (TRC20, ERC20-style codes). */
export type WhitelistedNetwork =
  | "ETH"
  | "TRC20"
  | "BSC"
  | "SOL"
  | "BASE"
  | "POLYGON"
  | "ARB";

export interface WhitelistedAddress {
  /** Stable client-side id. Use crypto.randomUUID() with a Date.now()+random fallback. */
  id: string;
  /** Human label, max 32 chars. Must be unique per the validation layer. */
  nickname: string;
  /** Network the address lives on. */
  network: WhitelistedNetwork;
  /** Full destination address (validated lightly per network). */
  address: string;
  /** Optional free-form note, max 200 chars. */
  notes?: string;
  /** ISO timestamp captured at creation time. */
  createdAt: string;
}

interface WhitelistedAddressesState {
  /** Hydration flag — flips true after the persist middleware rehydrates from
   *  localStorage. The card uses this to defer mock-seeding until the real
   *  saved state has loaded, otherwise we'd seed on top of existing data. */
  hasHydrated: boolean;
  /** Persisted address list. */
  addresses: WhitelistedAddress[];

  /** Add a new address. The caller is responsible for upstream validation. */
  add: (addr: Omit<WhitelistedAddress, "id" | "createdAt">) => WhitelistedAddress;
  /** Patch an existing address by id. No-op if id is unknown. */
  update: (id: string, patch: Partial<Omit<WhitelistedAddress, "id" | "createdAt">>) => void;
  /** Remove an address by id. No-op if id is unknown. */
  remove: (id: string) => void;
  /** Wipe the list. */
  clear: () => void;
  /** Replace the full list (used by the seed pass on first hydration). */
  setAll: (next: WhitelistedAddress[]) => void;
  /** Internal — flip the hydration flag. */
  _setHasHydrated: (next: boolean) => void;
}

// ---------------------------------------------------------------------------
// ID helper — robust against older browsers and non-secure contexts.
// ---------------------------------------------------------------------------

function makeId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    try {
      return crypto.randomUUID();
    } catch {
      /* fall through */
    }
  }
  return `wl_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

const STORAGE_KEY = "nonco-stables-whitelisted-addresses";

export const useWhitelistedAddressesStore = create<WhitelistedAddressesState>()(
  persist(
    (set) => ({
      hasHydrated: false,
      addresses: [],

      add: (addr) => {
        const next: WhitelistedAddress = {
          id: makeId(),
          createdAt: new Date().toISOString(),
          ...addr,
        };
        set((state) => ({ addresses: [next, ...state.addresses] }));
        return next;
      },

      update: (id, patch) =>
        set((state) => ({
          addresses: state.addresses.map((a) =>
            a.id === id ? { ...a, ...patch } : a,
          ),
        })),

      remove: (id) =>
        set((state) => ({
          addresses: state.addresses.filter((a) => a.id !== id),
        })),

      clear: () => set({ addresses: [] }),

      setAll: (next) => set({ addresses: next }),

      _setHasHydrated: (next) => set({ hasHydrated: next }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      // Persist only the data — actions are recreated on every hydration.
      partialize: (state) => ({ addresses: state.addresses }),
      version: 1,
      onRehydrateStorage: () => (state) => {
        // Flip the flag after rehydration so consumers know the localStorage
        // pass has finished. The seeding logic in the card relies on this.
        state?._setHasHydrated(true);
      },
    },
  ),
);

// ---------------------------------------------------------------------------
// Selector hooks — keep selections narrow to avoid wasted re-renders.
// ---------------------------------------------------------------------------

/** Reactive list of addresses. */
export function useWhitelistedAddresses(): WhitelistedAddress[] {
  return useWhitelistedAddressesStore((s) => s.addresses);
}

/** Reactive hydration flag. */
export function useWhitelistedAddressesHydrated(): boolean {
  return useWhitelistedAddressesStore((s) => s.hasHydrated);
}

/** Stable action functions only — no re-renders triggered by data changes. */
export function useWhitelistedAddressActions(): {
  add: WhitelistedAddressesState["add"];
  update: WhitelistedAddressesState["update"];
  remove: WhitelistedAddressesState["remove"];
  clear: WhitelistedAddressesState["clear"];
  setAll: WhitelistedAddressesState["setAll"];
} {
  return useWhitelistedAddressesStore(
    useShallow((s) => ({
      add: s.add,
      update: s.update,
      remove: s.remove,
      clear: s.clear,
      setAll: s.setAll,
    })),
  );
}

// ---------------------------------------------------------------------------
// Network metadata + light validation
// ---------------------------------------------------------------------------

/** UI metadata per network — label shown in selects + chip text. */
export const NETWORK_META: Record<
  WhitelistedNetwork,
  { label: string; chip: string; placeholder: string }
> = {
  ETH: {
    label: "Ethereum (ERC20)",
    chip: "ETH",
    placeholder: "0x…",
  },
  TRC20: {
    label: "Tron (TRC20)",
    chip: "TRC20",
    placeholder: "T…",
  },
  BSC: {
    label: "BNB Smart Chain (BEP20)",
    chip: "BSC",
    placeholder: "0x…",
  },
  SOL: {
    label: "Solana",
    chip: "SOL",
    placeholder: "Base58 address",
  },
  BASE: {
    label: "Base",
    chip: "BASE",
    placeholder: "0x…",
  },
  POLYGON: {
    label: "Polygon",
    chip: "POLY",
    placeholder: "0x…",
  },
  ARB: {
    label: "Arbitrum",
    chip: "ARB",
    placeholder: "0x…",
  },
};

/** Pragmatic per-network validation. Not exhaustive — production should call
 *  the chain's own RPC for a real address-shape check. */
export function validateAddressShape(
  network: WhitelistedNetwork,
  address: string,
): true | string {
  const trimmed = address.trim();
  if (!trimmed) return "Address is required.";

  // EVM-style chains — 0x + 40 hex chars
  if (
    network === "ETH" ||
    network === "BSC" ||
    network === "BASE" ||
    network === "POLYGON" ||
    network === "ARB"
  ) {
    if (!/^0x[a-fA-F0-9]{40}$/.test(trimmed)) {
      return "Expected an EVM address: 0x + 40 hex characters.";
    }
    return true;
  }

  // Tron — T-prefix base58, 34 chars total
  if (network === "TRC20") {
    if (!/^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(trimmed)) {
      return "Expected a Tron address: starts with T, 34 base58 chars.";
    }
    return true;
  }

  // Solana — base58, 32-44 chars
  if (network === "SOL") {
    if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(trimmed)) {
      return "Expected a Solana base58 address (32–44 chars).";
    }
    return true;
  }

  return true;
}

/** Truncate an address as `0x123456…abcd5678` (first 6 + ellipsis + last 8).
 *  Falls back to the raw value when it's too short to truncate meaningfully. */
export function truncateAddress(address: string): string {
  if (address.length <= 16) return address;
  return `${address.slice(0, 6)}…${address.slice(-8)}`;
}
