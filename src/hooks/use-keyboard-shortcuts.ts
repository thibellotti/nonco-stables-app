"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const SHORTCUTS: Record<string, string> = {
  d: "/dashboard",
  r: "/rfq",
  b: "/bank",
  t: "/trades",
  s: "/settlements",
  p: "/payments",
};

export function useKeyboardShortcuts() {
  const router = useRouter();

  useEffect(() => {
    let gPressed = false;
    let gTimer: ReturnType<typeof setTimeout>;

    function handleKeyDown(e: KeyboardEvent) {
      // Don't trigger when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      )
        return;

      if (e.key === "g") {
        gPressed = true;
        clearTimeout(gTimer);
        gTimer = setTimeout(() => {
          gPressed = false;
        }, 500);
        return;
      }

      if (gPressed && SHORTCUTS[e.key]) {
        e.preventDefault();
        router.push(SHORTCUTS[e.key]);
        gPressed = false;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(gTimer);
    };
  }, [router]);
}
