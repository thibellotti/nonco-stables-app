import type { ReactNode } from "react";

export interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
  badge?: number;
  comingSoon?: boolean;
}

export interface NavSubGroup {
  label: string;
  items: NavItem[];
}

export interface NavGroup {
  label: string;
  items?: NavItem[];
  subGroups?: NavSubGroup[];
}

// ═══════════════════════════════════════════════════════════════════════════
// NAV VERSION SWITCH
// ═══════════════════════════════════════════════════════════════════════════
// Flip this single flag to swap the entire sidebar/nav between versions.
//
//   "launch" → V1 (current launch scope per client feedback, slide 3):
//              Dashboard · Trade · Settlements only.
//   "full"   → V2 (post-launch, full platform):
//              All trading, DeFi, swap & send, and settings groups visible.
//
// Both configurations are defined below — switching is a single-character edit
// and requires no other changes anywhere in the codebase.
const NAV_VERSION: "launch" | "full" = "launch";
// ═══════════════════════════════════════════════════════════════════════════

// ── Icons ─────────────────────────────────────────────────────────────────
const DashboardIcon = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="5.5" height="5.5" rx="1.5" />
    <rect x="10.5" y="2" width="5.5" height="5.5" rx="1.5" />
    <rect x="2" y="10.5" width="5.5" height="5.5" rx="1.5" />
    <rect x="10.5" y="10.5" width="5.5" height="5.5" rx="1.5" />
  </svg>
);
const PricingIcon = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 11L5.5 8L8.5 9.5L16 4" />
    <path d="M13 4h3v3" />
  </svg>
);
const SettlementsIcon = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2.5" y="2.5" width="13" height="13" rx="2.5" />
    <path d="M6 9l2 2 4-4" />
  </svg>
);
const RecentActivityIcon = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 6h12M12 3l3 3-3 3" />
    <path d="M15 12H3M6 9l-3 3 3 3" />
  </svg>
);
const OnchainIcon = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="9" cy="9" r="3.5" />
    <path d="M9 2v3.5M9 12.5V16M2 9h3.5M12.5 9H16" />
  </svg>
);
const BridgeIcon = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 11C2 11 4.5 6.5 9 6.5C13.5 6.5 16 11 16 11" />
    <line x1="2" y1="11" x2="16" y2="11" />
    <line x1="4.5" y1="11" x2="4.5" y2="14" />
    <line x1="13.5" y1="11" x2="13.5" y2="14" />
  </svg>
);
const YieldIcon = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 13L5.5 9L8.5 10.5L15 6" />
    <circle cx="5.5" cy="9" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="8.5" cy="10.5" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);
const ClockIcon = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="9" cy="9" r="6" />
    <path d="M9 6v3l2 2" />
  </svg>
);
const ThirdPartyIcon = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="7" cy="5.5" r="2.5" />
    <path d="M2 14c0-2 2-3.5 5-3.5" />
    <circle cx="13" cy="10" r="2.5" />
    <path d="M10 15.5c0-1.5 1.5-2.5 3-2.5s3 1 3 2.5" />
  </svg>
);
const ReportsIcon = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="10" width="2.5" height="5" rx="0.5" fill="currentColor" stroke="none" />
    <rect x="7.75" y="6" width="2.5" height="9" rx="0.5" fill="currentColor" stroke="none" />
    <rect x="12.5" y="3" width="2.5" height="12" rx="0.5" fill="currentColor" stroke="none" />
  </svg>
);
const ApiKeysIcon = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="6.5" cy="11" r="3.5" />
    <path d="M9 8.5L15 3" />
    <path d="M13 3h2v2" />
  </svg>
);
// ── V1: Launch nav (client spec, slide 3) ─────────────────────────────────
export const launchNavGroups: NavGroup[] = [
  {
    label: "Main",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: DashboardIcon },
      { label: "Trade", href: "/fx", icon: PricingIcon },
      { label: "Settlements", href: "/settlements", badge: 2, icon: SettlementsIcon },
    ],
  },
];

// ── V2: Full nav (post-launch — every shipped page) ───────────────────────
export const fullNavGroups: NavGroup[] = [
  {
    label: "Main",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: DashboardIcon },
    ],
  },
  {
    label: "Products",
    subGroups: [
      {
        label: "Trading",
        items: [
          { label: "Trade", href: "/fx", icon: PricingIcon },
          { label: "Recent Activity", href: "/trades", icon: RecentActivityIcon },
        ],
      },
      {
        label: "DeFi & On-Chain",
        items: [
          { label: "FX Onchain", href: "/onchain", icon: OnchainIcon },
          { label: "Bridge", href: "/bridge", icon: BridgeIcon },
          { label: "Yield", href: "/yield", icon: YieldIcon },
          { label: "Recent Activity", href: "/onchain-activity", icon: ClockIcon },
        ],
      },
    ],
  },
  {
    label: "Swap & Send",
    items: [
      { label: "Third Party", href: "/third-party", icon: ThirdPartyIcon },
    ],
  },
  {
    label: "Settlements",
    items: [
      { label: "Settlements", href: "/settlements", badge: 2, icon: SettlementsIcon },
    ],
  },
  {
    label: "Settings",
    items: [
      { label: "Reports", href: "/reports", icon: ReportsIcon },
      { label: "API Keys", href: "/api-keys", icon: ApiKeysIcon },
    ],
  },
];

// ── Active export — driven by the NAV_VERSION switch above ────────────────
export const navGroups: NavGroup[] = NAV_VERSION === "launch" ? launchNavGroups : fullNavGroups;

// Mobile bottom tabs — always launch items (mobile chrome is too tight)
const ProfileTabIcon = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="9" cy="6" r="3" />
    <path d="M3 16c0-3 2.5-5 6-5s6 2 6 5" />
  </svg>
);

export const mobileTabItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: DashboardIcon },
  { label: "Trade", href: "/fx", icon: PricingIcon },
  { label: "Settlements", href: "/settlements", badge: 2, icon: SettlementsIcon },
  { label: "Profile", href: "/profile", icon: ProfileTabIcon },
];

export const allNavItems: NavItem[] = navGroups.flatMap((g) => {
  const direct = g.items ?? [];
  const sub = (g.subGroups ?? []).flatMap((sg) => sg.items);
  return [...direct, ...sub];
});
