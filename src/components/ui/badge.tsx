import { cn } from "@/lib/utils";

type BadgeVariant = "cyan" | "green" | "amber" | "purple" | "default";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  cyan: "bg-[var(--cyan-dim)] text-[var(--cyan)]",
  green: "bg-[rgba(34,197,94,0.08)] text-[var(--green)]",
  amber: "bg-[rgba(245,158,11,0.08)] text-[var(--amber)]",
  purple: "bg-[rgba(168,85,247,0.08)] text-[var(--purple)]",
  default: "bg-[rgba(255,255,255,0.04)] text-[var(--text-3)]",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
