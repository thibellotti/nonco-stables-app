"use client";

import dynamic from "next/dynamic";

// Client-only render: /fx consumes localStorage-backed selection state via
// useWidgetSelection + useIsDesktop and has multiple hydration-sensitive
// surfaces (favorites store, view-mode persist, density, etc). Rendering
// purely client-side eliminates React error #418 + DOM orphans leaking to
// <body> on navigation. Same pattern applied to /dashboard's MarketWatch.
const FxClient = dynamic(
  () => import("./fx-client").then((m) => ({ default: m.default })),
  {
    ssr: false,
    loading: () => (
      <div className="px-4 sm:px-6 lg:px-8 xl:px-12 w-full pt-4">
        <div className="h-[400px] rounded-lg bg-[var(--bg-card)] border border-[var(--border)]" />
      </div>
    ),
  },
);

export default function FxPage() {
  return <FxClient />;
}
