import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "cyan" | "ghost" | "white";
  size?: "sm" | "md" | "lg";
}

export function Button({ variant = "cyan", size = "md", className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 active:scale-95",
        // variants
        variant === "cyan" && "bg-[var(--cyan)] text-black hover:brightness-110",
        variant === "ghost" && "bg-transparent text-[var(--text-3)] border border-[var(--border-subtle)] hover:border-[var(--text-4)] hover:text-[var(--text-2)]",
        variant === "white" && "bg-white text-black hover:bg-white/90",
        // sizes
        size === "sm" && "px-3 py-1.5 text-xs",
        size === "md" && "px-5 py-2.5 text-sm",
        size === "lg" && "px-6 py-3 text-base",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
