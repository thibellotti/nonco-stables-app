"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export type CardAction =
  | "edit"
  | "favorite"
  | "deep-dive"
  | "multileg"
  | "delete";

interface CardContextMenuProps {
  open: boolean;
  anchor: { x: number; y: number } | null;
  isFavorite: boolean;
  onAction: (action: CardAction) => void;
  onClose: () => void;
}

const MENU_WIDTH = 220;
const MENU_ITEM_HEIGHT = 40;
const MENU_ITEMS = 5;
const MENU_HEIGHT = MENU_ITEM_HEIGHT * MENU_ITEMS + 16;

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <circle cx="8" cy="8" r="2.2" />
      <path d="M13.5 8a5.5 5.5 0 00-.1-1.1l1.2-.9-.9-1.6-1.4.5a5.5 5.5 0 00-1.9-1.1L10 2h-2l-.4 1.8c-.7.2-1.3.6-1.9 1.1l-1.4-.5-.9 1.6 1.2.9A5.5 5.5 0 004.5 8c0 .4 0 .7.1 1.1l-1.2.9.9 1.6 1.4-.5c.6.5 1.2.9 1.9 1.1L8 14h2l.4-1.8c.7-.2 1.3-.6 1.9-1.1l1.4.5.9-1.6-1.2-.9c.1-.4.1-.7.1-1.1z" />
    </svg>
  );
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 1.8l1.9 3.9 4.3.6-3.1 3 .7 4.3L8 11.6l-3.9 2 .7-4.3-3.1-3 4.3-.6z" />
    </svg>
  );
}

function DeepDiveIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
      <circle cx="7" cy="7" r="4" />
      <path d="M10.2 10.2L13.5 13.5" />
    </svg>
  );
}

function MultilegIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
      <path d="M2 4h12M2 8h8M2 12h12" />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
      <path d="M3 4h10M6 4V2.5h4V4M4.5 4l.5 9.5h6l.5-9.5" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <path d="M3.5 2.5L6.5 5L3.5 7.5" />
    </svg>
  );
}

export function CardContextMenu({
  open,
  anchor,
  isFavorite,
  onAction,
  onClose,
}: CardContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click / escape
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose]);

  if (!anchor) return null;

  // Flip menu so it stays in viewport
  const viewportW = typeof window !== "undefined" ? window.innerWidth : 1200;
  const viewportH = typeof window !== "undefined" ? window.innerHeight : 800;
  const x = Math.min(anchor.x, viewportW - MENU_WIDTH - 8);
  const y = Math.min(anchor.y, viewportH - MENU_HEIGHT - 8);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, scale: 0.96, y: -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -4 }}
          transition={{ duration: 0.12, ease: [0.16, 1, 0.3, 1] }}
          role="menu"
          aria-label="Card actions"
          className="fixed z-50 bg-[var(--bg-elevated,#1e1e1e)] border border-[var(--border-outline)] rounded-lg shadow-[0_20px_60px_rgba(0,0,0,0.6)] py-2"
          style={{ left: x, top: y, width: MENU_WIDTH }}
        >
          <MenuItem icon={<EditIcon />} onClick={() => onAction("edit")}>
            Edit card
          </MenuItem>
          <MenuItem
            icon={<StarIcon filled={isFavorite} />}
            onClick={() => onAction("favorite")}
          >
            {isFavorite ? "Unfavorite symbol" : "Favorite symbol"}
          </MenuItem>
          <MenuItem icon={<DeepDiveIcon />} onClick={() => onAction("deep-dive")}>
            Open DeepDive
          </MenuItem>
          <MenuItem
            icon={<MultilegIcon />}
            trailing={<ChevronRightIcon />}
            onClick={() => onAction("multileg")}
          >
            Create new multileg
          </MenuItem>
          <div className="my-1 mx-2 h-px bg-[var(--border)]" />
          <MenuItem
            icon={<DeleteIcon />}
            onClick={() => onAction("delete")}
            danger
          >
            Delete card
          </MenuItem>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MenuItem({
  icon,
  children,
  onClick,
  trailing,
  danger = false,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick: () => void;
  trailing?: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <button
      role="menuitem"
      type="button"
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2 text-left text-[13px] font-sans transition-colors cursor-pointer",
        danger
          ? "text-[var(--red,#f87171)] hover:bg-[rgba(248,113,113,0.08)]"
          : "text-[var(--text-2)] hover:bg-[rgba(255,255,255,0.04)] hover:text-white",
      )}
    >
      <span className="shrink-0 opacity-80">{icon}</span>
      <span className="flex-1">{children}</span>
      {trailing && <span className="opacity-60">{trailing}</span>}
    </button>
  );
}
