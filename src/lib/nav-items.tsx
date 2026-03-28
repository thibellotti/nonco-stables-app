import type { ReactNode } from "react";

export interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
  badge?: number;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

// Grouped navigation matching the full platform
export const navGroups: NavGroup[] = [
  {
    label: "Main",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="2" y="2" width="5.5" height="5.5" rx="1.5" />
            <rect x="10.5" y="2" width="5.5" height="5.5" rx="1.5" />
            <rect x="2" y="10.5" width="5.5" height="5.5" rx="1.5" />
            <rect x="10.5" y="10.5" width="5.5" height="5.5" rx="1.5" />
          </svg>
        ),
      },
      {
        label: "Wallet",
        href: "/wallet",
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="2" y="4" width="14" height="10" rx="2" />
            <path d="M2 8h14" />
            <circle cx="13" cy="11" r="1" fill="currentColor" />
          </svg>
        ),
      },
    ],
  },
  {
    label: "Trading",
    items: [
      {
        label: "FX Stables",
        href: "/fx",
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2 11L5.5 8L8.5 9.5L16 4" />
            <path d="M13 4h3v3" />
          </svg>
        ),
      },
      {
        label: "Trades",
        href: "/trades",
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 6h12M12 3l3 3-3 3" />
            <path d="M15 12H3M6 9l-3 3 3 3" />
          </svg>
        ),
      },
    ],
  },
  {
    label: "DeFi & Onchain",
    items: [
      {
        label: "FX Onchain",
        href: "/onchain",
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="9" cy="9" r="3.5" />
            <path d="M9 2v3.5M9 12.5V16M2 9h3.5M12.5 9H16" />
          </svg>
        ),
      },
      {
        label: "Bridge",
        href: "/bridge",
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2 11C2 11 4.5 6.5 9 6.5C13.5 6.5 16 11 16 11" />
            <line x1="2" y1="11" x2="16" y2="11" />
            <line x1="4.5" y1="11" x2="4.5" y2="14" />
            <line x1="13.5" y1="11" x2="13.5" y2="14" />
          </svg>
        ),
      },
      {
        label: "Yield Vault",
        href: "/yield",
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2 13L5.5 9L8.5 10.5L15 6" />
            <circle cx="5.5" cy="9" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="8.5" cy="10.5" r="1.5" fill="currentColor" stroke="none" />
          </svg>
        ),
      },
    ],
  },
  {
    label: "Payments",
    items: [
      {
        label: "Payments",
        href: "/payments",
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 15V3M5.5 7L9 3l3.5 4" />
          </svg>
        ),
      },
      {
        label: "Settlements",
        href: "/settlements",
        badge: 2,
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="2.5" y="2.5" width="13" height="13" rx="2.5" />
            <path d="M6 9l2 2 4-4" />
          </svg>
        ),
      },
      {
        label: "Third Party",
        href: "/third-party",
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="7" cy="5.5" r="2.5" />
            <path d="M2 14c0-2 2-3.5 5-3.5" />
            <circle cx="13" cy="10" r="2.5" />
            <path d="M10 15.5c0-1.5 1.5-2.5 3-2.5s3 1 3 2.5" />
          </svg>
        ),
      },
    ],
  },
  {
    label: "Settings",
    items: [
      {
        label: "Reports",
        href: "/reports",
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="10" width="2.5" height="5" rx="0.5" fill="currentColor" stroke="none" />
            <rect x="7.75" y="6" width="2.5" height="9" rx="0.5" fill="currentColor" stroke="none" />
            <rect x="12.5" y="3" width="2.5" height="12" rx="0.5" fill="currentColor" stroke="none" />
          </svg>
        ),
      },
      {
        label: "API Keys",
        href: "/api-keys",
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="6.5" cy="11" r="3.5" />
            <path d="M9 8.5L15 3" />
            <path d="M13 3h2v2" />
          </svg>
        ),
      },
    ],
  },
];

// Flat list for bottom tabs (mobile) — only show the 5 most important
export const mobileTabItems: NavItem[] = [
  navGroups[0].items[0], // Dashboard
  navGroups[1].items[0], // FX Stables
  navGroups[0].items[1], // Wallet
  navGroups[1].items[1], // Trades
  navGroups[3].items[1], // Settlements
];

// Flat list of all nav items (for search, etc.)
export const allNavItems: NavItem[] = navGroups.flatMap((g) => g.items);
