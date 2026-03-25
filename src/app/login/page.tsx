"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

function fadeUpTransition(i: number) {
  return {
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.08, duration: 0.5, ease: "easeOut" as const },
  };
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: fadeUpTransition,
};

const features = [
  {
    title: "Real-time FX quotes",
    description: "Stream live bid/ask prices across 8+ currency pairs with sub-second refresh",
  },
  {
    title: "T+0 to T+2 settlement",
    description: "Choose your settlement window from instant to standard institutional timelines",
  },
  {
    title: "Multi-currency treasury",
    description: "Hold, convert, and manage fiat and stablecoin balances in one unified view",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <main className="grid grid-cols-1 lg:grid-cols-2 min-h-dvh bg-black">
      {/* LEFT — Brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 xl:p-16 overflow-hidden">
        {/* Grid background */}
        <div className="pointer-events-none absolute inset-0 data-grid-bg opacity-20" />

        {/* Cyan glow — top-right */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="pointer-events-none absolute -top-32 -right-32 w-[500px] h-[500px]"
          style={{
            background: "radial-gradient(circle, rgba(5,224,248,0.08) 0%, transparent 70%)",
          }}
        />

        {/* Cyan glow — bottom-left */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.8, delay: 0.3 }}
          className="pointer-events-none absolute -bottom-48 -left-24 w-[400px] h-[400px]"
          style={{
            background: "radial-gradient(circle, rgba(5,224,248,0.05) 0%, transparent 70%)",
          }}
        />

        {/* Top — Logo */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/nonco-stables-logo.svg"
            alt="Nonco Stables"
            className="h-6 w-auto"
          />
        </motion.div>

        {/* Middle — Wordmark + tagline + features */}
        <div className="relative z-10 space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="font-sans text-4xl xl:text-5xl font-bold text-white tracking-tight leading-[1.05]">
              NONCO
              <br />
              <span className="text-[var(--cyan)]">STABLES</span>
            </h1>
            <p className="text-base xl:text-lg font-sans text-[var(--text-3)] mt-4 max-w-[400px] leading-relaxed">
              Institutional stablecoin settlement for global enterprises
            </p>
          </motion.div>

          {/* Feature bullets */}
          <div className="space-y-5">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="flex gap-3.5"
              >
                <div className="w-1 h-1 rounded-full bg-[var(--cyan)] mt-2 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-[var(--text)] leading-none">
                    {feature.title}
                  </p>
                  <p className="text-[13px] text-[var(--text-4)] mt-1.5 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom — Trust badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-px bg-[var(--border-outline)]" />
            <span className="text-[11px] font-sans uppercase tracking-[.15em] text-[var(--text-4)]">
              Trusted by 50+ institutions worldwide
            </span>
          </div>
        </motion.div>
      </div>

      {/* RIGHT — Login form */}
      <div className="relative flex items-center justify-center bg-black overflow-hidden">
        {/* Top decorative glow — mobile only */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] lg:hidden"
          style={{
            background: "rgba(5,224,248,0.05)",
            filter: "blur(120px)",
          }}
        />

        {/* Subtle grid background — mobile only */}
        <div className="pointer-events-none absolute inset-0 data-grid-bg opacity-30 lg:hidden" />

        {/* Form container */}
        <div className="w-full max-w-[400px] px-6 relative">
          {/* Header — mobile only (logo shown here on mobile) */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center mb-12"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/nonco-stables-logo.svg"
              alt="Nonco Stables"
              className="h-7 w-auto lg:hidden"
            />
            <div className="w-12 h-[2px] bg-[var(--cyan)] mt-5 lg:hidden" />

            <p className="text-lg font-light text-[var(--text-3)] mt-5 lg:mt-0 text-center lg:text-left">
              Sign in to your account
            </p>
          </motion.div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleLogin}>
            {/* Email */}
            <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
              <label htmlFor="email" className="block text-[11px] uppercase tracking-[.15em] text-[var(--text-4)] mb-1.5 ml-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="name@institution.com"
                autoComplete="email"
                className="w-full bg-[var(--bg-card)] border-0 ring-1 ring-[var(--border-outline)] focus:ring-2 focus:ring-[var(--cyan)] rounded-lg px-4 py-3.5 font-mono text-sm text-[var(--text)] placeholder:text-[var(--text-4)] outline-none transition-shadow duration-200"
              />
            </motion.div>

            {/* Password */}
            <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
              <div className="flex items-center justify-between mb-1.5 ml-1">
                <label htmlFor="password" className="text-[11px] uppercase tracking-[.15em] text-[var(--text-4)]">
                  Password
                </label>
                <button
                  type="button"
                  className="text-[11px] tracking-[.1em] text-[var(--text-4)] hover:text-[var(--cyan)] transition-colors cursor-pointer py-1 px-2 -mr-2"
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
                  className="w-full bg-[var(--bg-card)] border-0 ring-1 ring-[var(--border-outline)] focus:ring-2 focus:ring-[var(--cyan)] rounded-lg px-4 py-3.5 pr-12 font-mono text-sm text-[var(--text)] placeholder:text-[var(--text-4)] outline-none transition-shadow duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-4)] hover:text-[var(--text)] transition-colors cursor-pointer p-1"
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
            </motion.div>

            {/* Sign In */}
            <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
              <Button type="submit" variant="cyan" size="lg" className="w-full hover:shadow-[0_0_25px_rgba(5,224,248,0.3)]">
                Sign In
              </Button>
            </motion.div>
          </form>

          {/* Divider */}
          <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible" className="flex items-center gap-3 my-8">
            <div className="flex-1 h-px bg-[var(--border-outline)]" />
            <span className="text-[11px] text-[var(--text-4)] whitespace-nowrap">or</span>
            <div className="flex-1 h-px bg-[var(--border-outline)]" />
          </motion.div>

          {/* Social buttons */}
          <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible" className="space-y-3">
            {/* Google */}
            <Button type="button" variant="white" className="w-full py-3">
              <svg width="18" height="18" viewBox="0 0 24 24" className="shrink-0">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 001 12c0 1.94.46 3.77 1.18 5.41l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </Button>

            {/* Wallet */}
            <Button type="button" variant="ghost" className="w-full py-3 text-[var(--text)] border-[var(--border-outline)]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <rect x="2" y="6" width="20" height="14" rx="2" />
                <path d="M2 10h20" />
                <circle cx="16" cy="16" r="1.5" />
              </svg>
              Connect Wallet
            </Button>
          </motion.div>

          {/* Terms footer */}
          <motion.p custom={5} variants={fadeUp} initial="hidden" animate="visible" className="text-[11px] text-[var(--text-4)] text-center mt-8 leading-relaxed">
            By continuing, you agree to our{" "}
            <a href="#" className="text-[var(--text-3)] hover:text-[var(--cyan)] transition-colors underline underline-offset-4 decoration-[var(--border)]">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="text-[var(--text-3)] hover:text-[var(--cyan)] transition-colors underline underline-offset-4 decoration-[var(--border)]">Privacy Policy</a>.
          </motion.p>
        </div>
      </div>
    </main>
  );
}
