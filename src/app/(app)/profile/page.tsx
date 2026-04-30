"use client";

import { PageTransition } from "@/components/ui/page-transition";
import {
  AccountCard,
  PreferencesCard,
  WhitelistedAddressesCard,
  SupportCard,
  SignOutCard,
} from "@/components/profile";

// ---------------------------------------------------------------------------
// /profile — Claude-aesthetic redesign.
// Layout:
//   - Top row: Account | Preferences (2-col at lg+)
//   - Middle:  Whitelisted addresses (full width — list density needs room)
//   - Bottom:  Support | Sign-out (2-col at lg+)
// Mobile collapses to a single column. The (app) layout wraps this with the
// sidebar + global header.
// ---------------------------------------------------------------------------

export default function ProfilePage() {
  return (
    <PageTransition className="px-4 sm:px-6 lg:px-8 xl:px-12 w-full">
      <h1 className="sr-only">Profile</h1>

      <div className="flex flex-col gap-5 lg:gap-6">
        {/* Page intro — small subtitle since the h1 is sr-only */}
        <header className="px-1">
          <p className="text-[11px] font-sans font-medium uppercase tracking-[.15em] text-[var(--text-4)]">
            Profile
          </p>
          <p className="mt-1.5 text-sm font-sans text-[var(--text-3)]">
            Manage your account, preferences, and approved addresses.
          </p>
        </header>

        {/* Row 1 — Account (left) | Preferences (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 items-stretch">
          <AccountCard />
          <PreferencesCard />
        </div>

        {/* Row 2 — Whitelisted addresses (full-width — long list, needs room) */}
        <WhitelistedAddressesCard />

        {/* Row 3 — Support | Sign-out */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 items-stretch">
          <SupportCard />
          <SignOutCard />
        </div>
      </div>
    </PageTransition>
  );
}
