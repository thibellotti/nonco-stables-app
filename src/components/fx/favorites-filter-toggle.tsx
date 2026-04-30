"use client";

// Compact pressable toggle that lets the user filter the FX board down to
// their favorited pairs only. Visual style mirrors the surrounding top-bar
// controls (search input + view toggle) — same height, same border treatment,
// cyan tint when active. State is owned by the parent so it can be persisted
// to localStorage at "nonco-stables-fx-favorites-only".

import { cn } from "@/lib/utils";

interface FavoritesFilterToggleProps {
  active: boolean;
  onToggle: () => void;
}

export function FavoritesFilterToggle({
  active,
  onToggle,
}: FavoritesFilterToggleProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? "Show all pairs" : "Show favorites only"}
      onClick={onToggle}
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-2 rounded-md border transition-colors duration-150 cursor-pointer",
        active
          ? "bg-[var(--cyan-dim)] border-[rgba(5,224,248,0.3)] text-[var(--cyan)]"
          : "bg-transparent border-[var(--border)] text-[var(--text-4)] hover:text-[var(--text-2)]",
      )}
    >
      <svg
        width="11"
        height="11"
        viewBox="0 0 16 16"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M8 1.8l1.9 3.9 4.3.6-3.1 3 .7 4.3L8 11.6l-3.9 2 .7-4.3-3.1-3 4.3-.6z" />
      </svg>
      <span className="text-[10px] uppercase tracking-[.12em] font-sans font-medium">
        Favorites only
      </span>
    </button>
  );
}
