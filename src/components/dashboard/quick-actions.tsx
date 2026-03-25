"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { SectionLabel } from "@/components/ui/section-label";

const actions = [
  {
    label: "Send",
    href: "/bank",
    icon: (
      <path
        d="M7 17L17 7M17 7H10M17 7v7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    label: "Receive",
    href: "/bank",
    icon: (
      <path
        d="M17 7L7 17M7 17h7M7 17V10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    label: "Convert",
    href: "/rfq",
    icon: (
      <path
        d="M5 9h14M19 9l-3-3M19 15H5M5 15l3 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    label: "Deposit",
    href: "/bank",
    icon: (
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
];

export function QuickActions() {
  return (
    <div>
      <SectionLabel className="mb-3">Quick Actions</SectionLabel>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((a) => (
          <Link
            key={a.label}
            href={a.href}
            className={cn(
              "flex flex-col items-center justify-center gap-3 py-7 rounded-lg",
              "bg-[var(--bg-card)] border border-[var(--border)]",
              "hover:border-[rgba(5,224,248,0.25)] hover:bg-[rgba(5,224,248,0.03)]",
              "transition-all duration-200 group"
            )}
          >
            <div className="w-12 h-12 rounded-full bg-[rgba(255,255,255,0.04)] flex items-center justify-center group-hover:bg-[rgba(5,224,248,0.08)] transition-colors">
              <svg
                className="w-5 h-5 text-[var(--text-3)] group-hover:text-[var(--cyan)] transition-colors"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                {a.icon}
              </svg>
            </div>
            <span className="text-sm font-sans font-medium text-[var(--text-3)] group-hover:text-white transition-colors">
              {a.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
