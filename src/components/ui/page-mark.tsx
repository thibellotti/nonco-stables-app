import type { JSX } from "react";

interface PageMarkProps {
  page: string;
  className?: string;
}

const marks: Record<string, JSX.Element> = {
  dashboard: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="5" cy="7" r="4" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" />
      <rect x="10" y="5" width="4" height="4" fill="rgba(255,255,255,0.2)" />
    </svg>
  ),
  wallet: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="5.5" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" />
      <circle cx="7" cy="7" r="2" fill="rgba(255,255,255,0.2)" />
    </svg>
  ),
  fx: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <line x1="1" y1="5" x2="13" y2="5" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" />
      <line x1="1" y1="9" x2="13" y2="9" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" />
    </svg>
  ),
  trades: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3 9L7 3" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M11 5L7 11" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  yield: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="5.5" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2" />
      <path d="M7 1.5A5.5 5.5 0 0 1 12.5 7" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  settlements: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="10" height="10" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" strokeDasharray="2.5 2.5" />
    </svg>
  ),
  payments: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <line x1="2" y1="7" x2="9" y2="7" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" strokeLinecap="round" />
      <rect x="10" y="5" width="4" height="4" fill="rgba(255,255,255,0.2)" />
    </svg>
  ),
  reports: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="2" y="8" width="2.5" height="4" fill="rgba(255,255,255,0.15)" />
      <rect x="5.75" y="5" width="2.5" height="7" fill="rgba(255,255,255,0.2)" />
      <rect x="9.5" y="2" width="2.5" height="10" fill="rgba(255,255,255,0.25)" />
    </svg>
  ),
  "api-keys": (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="8" height="8" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" />
      <circle cx="7" cy="7" r="1.5" fill="rgba(255,255,255,0.2)" />
    </svg>
  ),
};

export function PageMark({ page, className }: PageMarkProps) {
  const mark = marks[page];
  if (!mark) return null;
  return <span className={className}>{mark}</span>;
}
