"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

// ---------------------------------------------------------------------------
// Types & mock data
// ---------------------------------------------------------------------------

type NotificationType = "settlement" | "deposit" | "price" | "withdrawal";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  time: string;
  unread: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: "n1",
    type: "settlement",
    title: "Settlement due tomorrow",
    body: "EUR/USDT T+1, $108K",
    time: "12m ago",
    unread: true,
  },
  {
    id: "n2",
    type: "deposit",
    title: "Deposit confirmed",
    body: "$250K USD from Citibank",
    time: "34m ago",
    unread: true,
  },
  {
    id: "n3",
    type: "price",
    title: "Price alert",
    body: "MXN/USDT crossed 17.45",
    time: "1h ago",
    unread: true,
  },
  {
    id: "n4",
    type: "withdrawal",
    title: "Withdrawal pending",
    body: "875K MXN to Banorte",
    time: "3h ago",
    unread: false,
  },
];

// Color mapping for notification dot indicators
const dotColors: Record<NotificationType, string> = {
  settlement: "var(--amber)",
  deposit: "var(--status-positive)",
  price: "var(--green)",
  withdrawal: "var(--purple)",
};

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const dropdownVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.95 },
};

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

// ---------------------------------------------------------------------------
// NotificationCenter
// ---------------------------------------------------------------------------

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const containerRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleMarkAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }, []);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <div className="relative" ref={containerRef}>
      {/* Bell button */}
      <button
        className="relative text-[var(--text-4)] hover:text-[var(--text)] transition-colors duration-150"
        aria-label="Notifications"
        aria-expanded={isOpen}
        onClick={handleToggle}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M13.73 13a2 2 0 01-1.46.63H5.73A2 2 0 014.27 13 6.27 6.27 0 013 9V7.5a6 6 0 0112 0V9a6.27 6.27 0 01-1.27 4z" />
          <path d="M7 14a2 2 0 004 0" />
        </svg>

        {/* Unread count badge — red */}
        {unreadCount > 0 && (
          <span className="min-w-4 h-4 text-[10px] font-bold bg-[var(--red)] text-white rounded-full flex items-center justify-center absolute -top-1.5 -right-2 px-1">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 top-[calc(100%+8px)] w-[calc(100vw-2rem)] max-w-[380px] bg-[#141414] border border-[var(--border)] rounded-xl shadow-2xl overflow-hidden z-50"
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.15, ease: easeOutExpo }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
              <span className="text-sm font-medium text-[var(--text)] font-sans">Notifications</span>
              {unreadCount > 0 && (
                <span className="text-[11px] font-mono text-[var(--text-4)] bg-[rgba(255,255,255,0.06)] rounded-full px-2 py-0.5">
                  {unreadCount} new
                </span>
              )}
            </div>

            {/* Notification list */}
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.map((notification, index) => {
                const dotColor = dotColors[notification.type];

                return (
                  <div
                    key={notification.id}
                    className={`flex gap-3 px-4 py-3 transition-colors duration-150 hover:bg-[rgba(255,255,255,0.03)] ${
                      notification.unread ? "bg-[rgba(255,255,255,0.02)]" : ""
                    } ${index < notifications.length - 1 ? "border-b border-[var(--border)]" : ""}`}
                  >
                    {/* Colored dot indicator */}
                    <div className="shrink-0 mt-1.5">
                      <span
                        className="block w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: dotColor,
                          boxShadow: notification.unread
                            ? `0 0 6px ${dotColor}`
                            : "none",
                          opacity: notification.unread ? 1 : 0.4,
                        }}
                      />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-sans truncate ${notification.unread ? "font-medium text-[var(--text)]" : "text-[var(--text-3)]"}`}>
                          {notification.title}
                        </p>
                        {notification.unread && (
                          <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <p className="text-xs text-[var(--text-4)] font-sans mt-0.5">
                        {notification.body}
                      </p>
                      <span className="text-[11px] font-mono text-[var(--text-4)] mt-1 block" style={{ fontVariantNumeric: "tabular-nums" }}>
                        {notification.time}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer — Mark all read */}
            <div className="px-4 py-3 border-t border-[var(--border)] flex items-center justify-between">
              {unreadCount > 0 ? (
                <button
                  className="text-xs text-white hover:text-[var(--text)] transition-colors duration-150 font-sans"
                  onClick={handleMarkAllRead}
                >
                  Mark all read
                </button>
              ) : (
                <span className="text-xs text-[var(--text-4)] font-sans">All caught up</span>
              )}
              <button className="text-xs text-[var(--text-4)] hover:text-[var(--text)] transition-colors duration-150 font-sans">
                View all
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
