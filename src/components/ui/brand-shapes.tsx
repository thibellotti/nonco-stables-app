"use client";

import { motion } from "framer-motion";

// Nonco official shape vocabulary: circles, squares, diamonds, lines
export function BrandShapes({ className }: { className?: string }) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className ?? ""}`} aria-hidden="true">
      {/* Diamond — top right */}
      <motion.svg
        width="24" height="24" viewBox="0 0 24 24"
        className="absolute top-[15%] right-[12%] opacity-[0.06]"
        animate={{ rotate: [0, 90, 0], y: [0, -8, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      >
        <rect x="12" y="0" width="16.97" height="16.97" rx="2" transform="rotate(45 12 12)" fill="none" stroke="#05E0F8" strokeWidth="1" />
      </motion.svg>

      {/* Circle outline — center right */}
      <motion.svg
        width="40" height="40" viewBox="0 0 40 40"
        className="absolute top-[40%] right-[8%] opacity-[0.04]"
        animate={{ scale: [1, 1.1, 1], opacity: [0.04, 0.07, 0.04] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      >
        <circle cx="20" cy="20" r="16" fill="none" stroke="#05E0F8" strokeWidth="0.8" />
        <circle cx="20" cy="20" r="8" fill="none" stroke="#05E0F8" strokeWidth="0.5" strokeDasharray="3 3" />
      </motion.svg>

      {/* Small filled diamond — bottom right */}
      <motion.svg
        width="12" height="12" viewBox="0 0 12 12"
        className="absolute bottom-[20%] right-[18%] opacity-[0.08]"
        animate={{ y: [0, -6, 0], rotate: [0, 180, 360] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      >
        <rect x="6" y="0" width="8.49" height="8.49" rx="1" transform="rotate(45 6 6)" fill="#05E0F8" />
      </motion.svg>

      {/* Square outline — far right */}
      <motion.svg
        width="20" height="20" viewBox="0 0 20 20"
        className="absolute top-[65%] right-[5%] opacity-[0.04]"
        animate={{ rotate: [0, 45, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      >
        <rect x="2" y="2" width="16" height="16" rx="2" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
      </motion.svg>

      {/* Corner bracket — top left area */}
      <motion.svg
        width="16" height="16" viewBox="0 0 16 16"
        className="absolute top-[25%] right-[25%] opacity-[0.05]"
        animate={{ opacity: [0.05, 0.08, 0.05] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M2 6V2h4" fill="none" stroke="#05E0F8" strokeWidth="1" strokeLinecap="round" />
        <path d="M14 10v4h-4" fill="none" stroke="#05E0F8" strokeWidth="1" strokeLinecap="round" />
      </motion.svg>
    </div>
  );
}
