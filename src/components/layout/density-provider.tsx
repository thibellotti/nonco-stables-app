"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";

// ---------------------------------------------------------------------------
// Density provider — applies the user's table-density preference globally
// via a `data-density` attribute on the <html> element. Tables consume the
// resulting CSS variables (see globals.css → --table-cell-py / --table-cell-px
// / --table-row-min-h / --table-header-py) so a single toggle re-paints every
// data table at once with no per-component wiring.
//
// Implementation note: uses `useSyncExternalStore` rather than the more usual
// `useState + useEffect` pair. This avoids the `react-hooks/set-state-in-effect`
// lint and gives correct hydration behaviour out of the box — the server
// renders with the default while the client snapshot reflects localStorage.
// ---------------------------------------------------------------------------

export type Density = "comfortable" | "compact";

const STORAGE_KEY = "nonco-stables-table-density";
const DEFAULT_DENSITY: Density = "comfortable";

// Custom event dispatched in addition to the native "storage" event so that
// updates inside the same tab notify listeners (the native event only fires
// across tabs, never on the tab that wrote the value).
const DENSITY_EVENT = "nonco-density-change";

interface DensityContextValue {
  density: Density;
  setDensity: (next: Density) => void;
}

const DensityContext = createContext<DensityContextValue | null>(null);

function readStoredDensity(): Density {
  if (typeof window === "undefined") return DEFAULT_DENSITY;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "comfortable" || stored === "compact") return stored;
  } catch {
    /* SSR / private mode — fall through to default */
  }
  return DEFAULT_DENSITY;
}

// Subscribe to both the native cross-tab "storage" event AND the custom
// in-tab event. Either signal triggers a re-render via useSyncExternalStore.
function subscribeDensity(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener(DENSITY_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(DENSITY_EVENT, callback);
  };
}

export function DensityProvider({ children }: { children: React.ReactNode }) {
  const density = useSyncExternalStore(
    subscribeDensity,
    readStoredDensity,
    () => DEFAULT_DENSITY,
  );

  // Mirror the current density onto <html> as a data attribute so global CSS
  // can react to it. The effect runs only when the value actually changes,
  // and writes a DOM attribute (never React state), so no cascading renders.
  useEffect(() => {
    document.documentElement.setAttribute("data-density", density);
  }, [density]);

  const setDensity = useCallback((next: Density) => {
    // Write storage first, then notify listeners. Apply the attribute
    // immediately so the next paint reflects the new density even if the
    // useSyncExternalStore subscription hasn't fired yet.
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore quota / private-mode errors */
    }
    document.documentElement.setAttribute("data-density", next);
    window.dispatchEvent(new Event(DENSITY_EVENT));
  }, []);

  return (
    <DensityContext.Provider value={{ density, setDensity }}>
      {children}
    </DensityContext.Provider>
  );
}

export function useDensity(): DensityContextValue {
  const ctx = useContext(DensityContext);
  if (!ctx) throw new Error("useDensity must be used inside DensityProvider");
  return ctx;
}
