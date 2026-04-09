import { PageTransition } from "@/components/ui/page-transition";
import Link from "next/link";

export default function OnchainActivityPage() {
  return (
    <PageTransition className="px-4 sm:px-6 md:px-8 w-full space-y-6">
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg">
        <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true" className="mb-4">
            <circle cx="32" cy="32" r="20" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
            <circle cx="32" cy="32" r="8" stroke="rgba(5,224,248,0.2)" strokeWidth="1.5" />
            <path d="M32 12v8M32 44v8M12 32h8M44 32h8" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          </svg>
          <p className="text-sm font-medium text-[var(--text-3)] mb-1">
            DeFi & On-Chain Activity
          </p>
          <p className="text-xs text-[var(--text-4)]">
            Bridge, swap, and yield transaction history coming soon
          </p>
          <Link
            href="/onchain"
            className="mt-4 inline-flex items-center gap-1 text-[11px] font-sans font-medium text-white hover:opacity-70 transition-colors"
          >
            Go to FX Onchain <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </PageTransition>
  );
}
