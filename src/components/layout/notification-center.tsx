"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

type NotificationType = "offer" | "settlement" | "trade" | "deposit";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  time: string;
  unread: boolean;
}

const initialNotifications: Notification[] = [
  { id: "n1", type: "offer", title: "Desk Offer: USDT at 17.42", body: "2M USDT available — limited inventory", time: "2m ago", unread: true },
  { id: "n2", type: "settlement", title: "Settlement completed", body: "EUR/USDT T+1 — $108,350 settled with Deutsche Bank", time: "14m ago", unread: true },
  { id: "n3", type: "trade", title: "Trade executed", body: "Buy MXN/USDT Spot — 100,000 @ 17.4520", time: "1h ago", unread: false },
  { id: "n4", type: "deposit", title: "Deposit received", body: "Wire deposit — $250,000 USD from Citibank N.A.", time: "3h ago", unread: false },
  { id: "n5", type: "offer", title: "Desk Offer: EUR at 1.0830", body: "500K EUR available — competitive rate", time: "5h ago", unread: false },
];

const dotColorMap: Record<NotificationType, string> = {
  offer: "var(--cyan)",
  trade: "var(--green)",
  settlement: "var(--amber)",
  deposit: "var(--purple)",
};

const dropdownVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.95 },
};

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

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

        {/* Unread badge */}
        {unreadCount > 0 && (
          <span className="min-w-4 h-4 text-[10px] font-bold bg-[var(--cyan)] text-black rounded-full flex items-center justify-center absolute -top-1.5 -right-2 px-1">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 top-[calc(100%+8px)] w-[calc(100vw-2rem)] max-w-[380px] bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-2xl overflow-hidden z-50"
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
                <button
                  className="text-xs text-[var(--cyan)] hover:text-[var(--text)] transition-colors duration-150 font-sans"
                  onClick={handleMarkAllRead}
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Notification list */}
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.map((notification, index) => (
                <div
                  key={notification.id}
                  className={`flex gap-3 px-4 py-3 ${
                    notification.unread ? "bg-[rgba(255,255,255,0.03)]" : ""
                  } ${index < notifications.length - 1 ? "border-b border-[var(--border)]" : ""}`}
                >
                  {/* Colored dot */}
                  <div className="pt-1.5 shrink-0">
                    <span
                      className="block w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: dotColorMap[notification.type],
                        opacity: notification.unread ? 1 : 0.4,
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[var(--text)] font-sans truncate">
                      {notification.title}
                    </p>
                    <p className="text-xs text-[var(--text-3)] font-sans mt-0.5 line-clamp-2">
                      {notification.body}
                    </p>
                    <span className="text-[11px] font-mono text-[var(--text-4)] mt-1 block">
                      {notification.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-[var(--border)] text-center">
              <button className="text-xs text-[var(--cyan)] hover:text-[var(--text)] transition-colors duration-150 font-sans">
                View all notifications
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
