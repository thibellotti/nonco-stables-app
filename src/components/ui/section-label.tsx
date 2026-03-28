import { cn } from "@/lib/utils";

interface SectionLabelProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
}

export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <span className={cn("font-sans text-[11px] font-medium uppercase tracking-[.15em] text-[var(--text-3)]", className)}>
      {children}
    </span>
  );
}
