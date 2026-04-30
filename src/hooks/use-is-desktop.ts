"use client";

import { useEffect, useState } from "react";

/**
 * Returns true when the viewport matches the Tailwind `lg` breakpoint
 * (>= 1024px). Defaults to `false` during SSR + first paint to avoid
 * hydration mismatches; flips to the real value on mount.
 *
 * Used by /fx to switch between the inline trade panel (desktop) and
 * the modal RFS dialog (tablet/mobile) — there's no horizontal room
 * to squeeze a 420px panel beside the cards on smaller screens.
 */
export function useIsDesktop(query: string = "(min-width: 1024px)"): boolean {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mql = window.matchMedia(query);
    const update = () => setIsDesktop(mql.matches);

    update();

    // Modern browsers: addEventListener; Safari < 14 used addListener.
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", update);
      return () => mql.removeEventListener("change", update);
    }
    // Legacy fallback for older Safari
    const legacy = mql as MediaQueryList & {
      addListener: (l: (e: MediaQueryListEvent) => void) => void;
      removeListener: (l: (e: MediaQueryListEvent) => void) => void;
    };
    legacy.addListener(update);
    return () => legacy.removeListener(update);
  }, [query]);

  return isDesktop;
}
