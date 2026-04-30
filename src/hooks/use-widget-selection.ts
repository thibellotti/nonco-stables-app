"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { boardInstruments, type BoardInstrument } from "@/lib/mock-data";
import { useFavorites, useFavoritesActions } from "@/stores/favorites";

const STORAGE_KEY = "nonco-fx-widget-selection";
// Legacy key used by older builds before favorites moved to the shared store.
// We migrate any pre-existing favorites once on mount, then clear the entry.
const LEGACY_FAVORITES_KEY = "nonco-fx-widget-favorites";

// User pair-usage rank — drives default selection.
// Mock for now; in production this comes from the user's trading history.
// Keep in sync with USAGE_RANK in fx/page.tsx (same data source after seed).
const USAGE_RANK: Record<string, number> = {
  "USDT/MXN": 100,
  "USDC/MXN": 92,
  "USDT/BRL": 81,
  "USDC/BRL": 74,
  "EUR/USDT": 65,
  "EUR/USDC": 58,
  "GBP/USDC": 42,
  "GBP/USDT": 38,
  "USD/MXN": 30,
  "USD1/MXN": 22,
  "AUSD/MXN": 18,
  "USDT/COP": 14,
  "USDT/CLP": 9,
};

/**
 * Return the initial set of instrument IDs shown to a fresh user (empty localStorage).
 *
 * DECISION: How many and which instruments should a new user see by default?
 * Trade-offs to consider:
 *   - Too few (< 4): user sees an empty-looking dashboard, doesn't realize it's customizable.
 *   - Too many (> 10): overwhelming; defeats the purpose of curation.
 *   - Top by USAGE_RANK: safe, mirrors what a power user would pick — but all LATAM
 *     pairs dominate and a new client from EMEA sees only MXN/BRL cards.
 *   - Balanced by section (2 LATAM + 1 BRL + 1 EUR + 1 GBP): geographic diversity,
 *     better for a sales demo, but less personalized to actual trading flow.
 *   - One from each `boardSections` section: structurally clean, but may include
 *     pairs the user has never traded.
 *
 * Constraint: must return an array of IDs that exist in `boardInstruments`.
 *
 * TODO (Thiago): implement the seed heuristic. Current placeholder returns
 * top 6 by USAGE_RANK — replace with the strategy that fits Nonco's onboarding.
 */
function seedInitialSelection(instruments: BoardInstrument[]): string[] {
  return [...instruments]
    .sort((a, b) => (USAGE_RANK[b.pair] ?? 0) - (USAGE_RANK[a.pair] ?? 0))
    .slice(0, 6)
    .map((i) => i.id);
}

function readFromStorage(key: string): Set<string> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return new Set(parsed.filter((v): v is string => typeof v === "string"));
  } catch {
    return null;
  }
}

function writeToStorage(key: string, set: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify([...set]));
  } catch {
    /* private mode / quota — degrade silently */
  }
}

export function useWidgetSelection() {
  // Start with the seed so SSR and first client paint match.
  // After mount, localStorage overrides if the user has a saved selection.
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => new Set(seedInitialSelection(boardInstruments)),
  );
  const [hydrated, setHydrated] = useState(false);

  // Favorites are now owned by the shared `useFavoritesStore` (keyed by `pair`).
  // We expose a `Set<inst.id>` derived from those `pair` strings so existing
  // consumers (FX page, dashboard market-watch widget) keep working unchanged.
  const favoritePairs = useFavorites();
  const { toggle: togglePairFavorite, add: addPairFavorite } =
    useFavoritesActions();

  const favoriteIds = useMemo<Set<string>>(() => {
    const pairs = new Set(favoritePairs);
    return new Set(
      boardInstruments.filter((i) => pairs.has(i.pair)).map((i) => i.id),
    );
  }, [favoritePairs]);

  useEffect(() => {
    const storedSelection = readFromStorage(STORAGE_KEY);
    if (storedSelection) setSelectedIds(storedSelection);

    // One-time migration: any favorites stored under the legacy
    // `nonco-fx-widget-favorites` key (instrument IDs) are folded into the
    // shared store as their pair strings, then the legacy key is dropped.
    const legacy = readFromStorage(LEGACY_FAVORITES_KEY);
    if (legacy && legacy.size > 0) {
      for (const id of legacy) {
        const inst = boardInstruments.find((i) => i.id === id);
        if (inst) addPairFavorite(inst.pair);
      }
      try {
        localStorage.removeItem(LEGACY_FAVORITES_KEY);
      } catch {
        /* private mode — best-effort cleanup */
      }
    }

    setHydrated(true);
  }, [addPairFavorite]);

  const persist = useCallback((key: string, next: Set<string>) => {
    writeToStorage(key, next);
  }, []);

  const add = useCallback(
    (id: string) => {
      setSelectedIds((prev) => {
        if (prev.has(id)) return prev;
        const next = new Set(prev);
        next.add(id);
        persist(STORAGE_KEY, next);
        return next;
      });
    },
    [persist],
  );

  const remove = useCallback(
    (id: string) => {
      setSelectedIds((prev) => {
        if (!prev.has(id)) return prev;
        const next = new Set(prev);
        next.delete(id);
        persist(STORAGE_KEY, next);
        return next;
      });
    },
    [persist],
  );

  const toggle = useCallback(
    (id: string) => {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        persist(STORAGE_KEY, next);
        return next;
      });
    },
    [persist],
  );

  const toggleFavorite = useCallback(
    (id: string) => {
      const inst = boardInstruments.find((i) => i.id === id);
      if (!inst) return;
      togglePairFavorite(inst.pair);
    },
    [togglePairFavorite],
  );

  const isFavorite = useCallback(
    (id: string) => favoriteIds.has(id),
    [favoriteIds],
  );

  const isSelected = useCallback(
    (id: string) => selectedIds.has(id),
    [selectedIds],
  );

  return {
    selectedIds,
    favoriteIds,
    hydrated,
    add,
    remove,
    toggle,
    toggleFavorite,
    isSelected,
    isFavorite,
  };
}
