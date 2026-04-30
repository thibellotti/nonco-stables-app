// Shared favorites store — single source of truth for favorited pair IDs.
//
// Pair IDs are the human-readable instrument string used across the app
// (e.g. "MXN/USDT", "EUR/USDC"). Any component that needs to read or
// mutate the favorited set should use this store via the selector hooks
// at the bottom of the file — never destructure the whole store.
//
// Persisted to localStorage under "nonco-stables-favorites" so the user's
// selection survives reloads and feeds the dashboard Market Watch widget.

"use client";

import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FavoritesState {
  /** Array of favorited pair IDs, e.g. ["MXN/USDT", "EUR/USDC"]. */
  favorites: string[];

  /** Toggle a pair — adds if missing, removes if present. */
  toggle: (pair: string) => void;
  /** Add a pair (no-op if already favorited). */
  add: (pair: string) => void;
  /** Remove a pair (no-op if not favorited). */
  remove: (pair: string) => void;
  /** Returns true if `pair` is currently favorited. */
  isFavorite: (pair: string) => boolean;
  /** Clear all favorites. */
  clear: () => void;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

const STORAGE_KEY = "nonco-stables-favorites";

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      toggle: (pair) =>
        set((state) =>
          state.favorites.includes(pair)
            ? { favorites: state.favorites.filter((p) => p !== pair) }
            : { favorites: [...state.favorites, pair] },
        ),

      add: (pair) =>
        set((state) =>
          state.favorites.includes(pair)
            ? state
            : { favorites: [...state.favorites, pair] },
        ),

      remove: (pair) =>
        set((state) => ({
          favorites: state.favorites.filter((p) => p !== pair),
        })),

      isFavorite: (pair) => get().favorites.includes(pair),

      clear: () => set({ favorites: [] }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      // Only persist the actual data, not the action functions.
      partialize: (state) => ({ favorites: state.favorites }),
      version: 1,
      // SSR fix: skip auto-rehydration so server render and first client
      // render both see the empty default. Hydration of localStorage is
      // triggered manually inside `useFavorites` AFTER mount via useEffect.
      // Without this, SSR rendered N cards (empty favorites), client read
      // localStorage synchronously and rendered M cards, causing React
      // hydration error #418 and orphan DOM nodes leaking to <body>.
      skipHydration: true,
    },
  ),
);

// ---------------------------------------------------------------------------
// Selector hooks
// ---------------------------------------------------------------------------
// Always select narrowly — never `useFavoritesStore()` without a selector,
// or every component re-renders on any change.

// Module-level flag — ensures rehydrate() runs only once across all hooks.
let _rehydrationStarted = false;

/**
 * Triggers the manual rehydration after mount. Used by every reactive hook
 * below so the persisted localStorage value flows in AFTER React's first
 * client render finishes (and therefore matches the SSR markup).
 */
function useHydratedFavorites(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    if (!_rehydrationStarted) {
      _rehydrationStarted = true;
      // Returns a Promise; we don't need to await — the store will publish
      // its new state on completion and any subscribed selector re-renders.
      void useFavoritesStore.persist.rehydrate();
    }
    setHydrated(true);
  }, []);
  return hydrated;
}

/** Returns `true` if `pair` is currently favorited. Reactive. */
export function useIsFavorite(pair: string): boolean {
  const hydrated = useHydratedFavorites();
  const isFav = useFavoritesStore((s) => s.favorites.includes(pair));
  return hydrated ? isFav : false;
}

/** Returns the favorites array. Reactive. */
export function useFavorites(): string[] {
  const hydrated = useHydratedFavorites();
  const favorites = useFavoritesStore((s) => s.favorites);
  // Pre-hydration: return empty array (matches SSR) so React reconciliation
  // sees identical first-client-render and doesn't throw error #418.
  return hydrated ? favorites : [];
}

/**
 * Returns the action functions only (stable identities — no re-renders
 * triggered by data changes). Use this in components that mutate but
 * don't need to read the favorites list.
 */
export function useFavoritesActions(): {
  toggle: (pair: string) => void;
  add: (pair: string) => void;
  remove: (pair: string) => void;
  clear: () => void;
} {
  return useFavoritesStore(
    useShallow((s) => ({
      toggle: s.toggle,
      add: s.add,
      remove: s.remove,
      clear: s.clear,
    })),
  );
}
