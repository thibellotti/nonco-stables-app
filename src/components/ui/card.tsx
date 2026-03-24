import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}

export function Card({ children, className, padding = true }: CardProps) {
  return (
    <div
      className={cn(
        "bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden transition-all duration-200 hover:border-[rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(5,224,248,0.02)]",
        padding && "p-5",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center justify-between px-5 py-3 border-b border-[var(--border)]", className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[10px] font-medium uppercase tracking-[.08em] text-[var(--text-4)]">
      {children}
    </span>
  );
}
