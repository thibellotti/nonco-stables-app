"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div className="relative flex min-h-dvh items-center justify-center bg-black">
      {/* Top decorative glow */}
      <div
        className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px]"
        style={{
          background: "rgba(5,224,248,0.05)",
          filter: "blur(120px)",
        }}
      />

      {/* Centered form container */}
      <div className="w-full max-w-[400px] px-6">
        {/* Header */}
        <div className="flex flex-col items-center mb-12">
          {/* Official Nonco Stables wordmark */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/nonco-stables-logo.svg"
            alt="Nonco Stables"
            className="h-7 w-auto"
          />
          <div className="w-12 h-[2px] bg-[var(--cyan)] mt-5" />
          <p className="text-lg font-light text-[var(--text-3)] mt-5">
            Institutional payments & settlement
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleLogin}>
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-[10px] uppercase font-mono tracking-[.15em] text-[var(--text-4)] mb-1.5 ml-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="name@institution.com"
              autoComplete="email"
              className="w-full bg-[var(--bg-card)] border-0 ring-1 ring-[var(--border-outline)] focus:ring-2 focus:ring-[var(--cyan)] rounded-lg px-4 py-3.5 font-mono text-sm text-white placeholder:text-[var(--text-4)] outline-none transition-shadow duration-200"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5 ml-1">
              <label htmlFor="password" className="text-[10px] uppercase font-mono tracking-[.15em] text-[var(--text-4)]">
                Password
              </label>
              <button
                type="button"
                className="text-[10px] font-mono tracking-[.1em] text-[var(--text-4)] hover:text-[var(--cyan)] transition-colors cursor-pointer py-1 px-2 -mr-2"
              >
                Forgot?
              </button>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter password"
                autoComplete="current-password"
                className="w-full bg-[var(--bg-card)] border-0 ring-1 ring-[var(--border-outline)] focus:ring-2 focus:ring-[var(--cyan)] rounded-lg px-4 py-3.5 pr-12 font-mono text-sm text-white placeholder:text-[var(--text-4)] outline-none transition-shadow duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-4)] hover:text-white transition-colors cursor-pointer p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Sign In */}
          <button
            type="submit"
            className="w-full bg-[var(--cyan)] hover:shadow-[0_0_25px_rgba(5,224,248,0.3)] text-black font-bold py-4 rounded-full active:scale-[0.98] transition-all duration-200 cursor-pointer text-sm tracking-wide"
          >
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-8">
          <div className="flex-1 h-px bg-[var(--border-outline)]" />
          <span className="text-[11px] text-[var(--text-4)] font-mono whitespace-nowrap">
            or
          </span>
          <div className="flex-1 h-px bg-[var(--border-outline)]" />
        </div>

        {/* Social buttons */}
        <div className="space-y-3">
          {/* Google */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2.5 bg-white text-black rounded-full py-3 font-medium text-sm hover:bg-white/90 active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" className="shrink-0">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 001 12c0 1.94.46 3.77 1.18 5.41l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          {/* Wallet */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2.5 border border-[var(--border-outline)] text-white rounded-full py-3 font-medium text-sm hover:bg-[var(--bg-card)] active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <rect x="2" y="6" width="20" height="14" rx="2" />
              <path d="M2 10h20" />
              <circle cx="16" cy="16" r="1.5" />
            </svg>
            Connect Wallet
          </button>
        </div>

        {/* Terms footer */}
        <p className="text-[11px] text-[var(--text-4)] text-center mt-8 leading-relaxed">
          By continuing, you agree to our{" "}
          <a href="#" className="text-[var(--text-3)] hover:text-[var(--cyan)] transition-colors underline underline-offset-4 decoration-[var(--border)]">Terms of Service</a>
          {" "}and{" "}
          <a href="#" className="text-[var(--text-3)] hover:text-[var(--cyan)] transition-colors underline underline-offset-4 decoration-[var(--border)]">Privacy Policy</a>.
        </p>
      </div>

    </div>
  );
}
