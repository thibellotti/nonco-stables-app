import { cn } from "@/lib/utils";

interface SectionLabelProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
}

export function SectionLabel({ children, color, className }: SectionLabelProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className="w-[2px] h-4 rounded-full"
        style={{ background: color || "var(--cyan)" }}
      />
      <span className="font-sans text-[11px] font-medium uppercase tracking-[.15em] text-[var(--text-3)]">
        {children}
      </span>
    </div>
  );
}
