"use client";

import { Button } from "@/components/ui/button";

/**
 * Static login page — no auth logic.
 * Lives outside the (app) route group so the sidebar/shell is not rendered.
 */
export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-dvh bg-[var(--bg)]">
      <div className="w-full max-w-sm px-6 flex flex-col items-center text-center">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="font-mono text-2xl tracking-tight">
            <span className="font-bold text-[var(--text)]">NONCO</span>{" "}
            <span className="font-light text-[var(--text-3)]">STABLES</span>
          </h1>
          <p className="text-[var(--text-4)] text-xs mt-2 tracking-wide uppercase">
            Institutional stablecoin payments
          </p>
        </div>

        {/* Email / Password form */}
        <form className="w-full space-y-3" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="Email address"
            autoComplete="email"
            className="w-full rounded-full bg-[var(--bg-card)] border border-[var(--border)] px-5 py-3 text-sm text-[var(--text)] placeholder:text-[var(--text-4)] outline-none focus:border-[var(--cyan)] transition-colors duration-200"
          />
          <input
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            className="w-full rounded-full bg-[var(--bg-card)] border border-[var(--border)] px-5 py-3 text-sm text-[var(--text)] placeholder:text-[var(--text-4)] outline-none focus:border-[var(--cyan)] transition-colors duration-200"
          />
          <Button variant="cyan" size="lg" className="w-full" type="submit">
            Sign In
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 w-full my-5">
          <div className="flex-1 h-px bg-[var(--border)]" />
          <span className="text-[var(--text-4)] text-xs">or continue with</span>
          <div className="flex-1 h-px bg-[var(--border)]" />
        </div>

        {/* OAuth buttons */}
        <div className="w-full space-y-3">
          <Button variant="white" size="lg" className="w-full">
            <svg width="18" height="18" viewBox="0 0 24 24" className="shrink-0">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 001 12c0 1.94.46 3.77 1.18 5.41l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </Button>

          <Button variant="ghost" size="lg" className="w-full">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <rect x="2" y="6" width="20" height="14" rx="2" />
              <path d="M2 10h20" />
              <circle cx="16" cy="16" r="1.5" />
            </svg>
            Connect Wallet
          </Button>
        </div>

        {/* Footer */}
        <p className="text-[var(--text-4)] text-[10px] mt-8 leading-relaxed">
          By continuing, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}
