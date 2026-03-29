"use client";

import { motion } from "framer-motion";

export function BrandShapes() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">

      {/* Shape 1: Concentric circles (from home-34) — top right */}
      <motion.svg
        viewBox="0 0 100 100"
        className="absolute -top-4 -right-8 w-[120px] h-[120px] opacity-[0.04]"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      >
        <circle cx="50" cy="50" r="44" fill="none" stroke="#05E0F8" strokeWidth="1" />
        <circle cx="50" cy="50" r="28" fill="none" stroke="#05E0F8" strokeWidth="0.5" strokeDasharray="2 4" />
        <circle cx="50" cy="50" r="6" fill="#05E0F8" />
      </motion.svg>

      {/* Shape 2: Square with corner dots (from home-39) — bottom right */}
      <motion.svg
        viewBox="0 0 100 100"
        className="absolute bottom-[10%] -right-4 w-[80px] h-[80px] opacity-[0.03]"
        animate={{ rotate: [0, 8, 0], y: [0, 4, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      >
        <rect x="20" y="20" width="60" height="60" rx="2" fill="none" stroke="#05E0F8" strokeWidth="1" />
        <rect x="16" y="16" width="8" height="8" rx="1" fill="rgba(255,255,255,0.5)" />
        <rect x="76" y="16" width="8" height="8" rx="1" fill="rgba(255,255,255,0.5)" />
        <rect x="16" y="76" width="8" height="8" rx="1" fill="rgba(255,255,255,0.5)" />
        <rect x="76" y="76" width="8" height="8" rx="1" fill="rgba(255,255,255,0.5)" />
      </motion.svg>

      {/* Shape 3: Corner brackets (from home-38) — mid right */}
      <motion.svg
        viewBox="0 0 60 60"
        className="absolute top-[45%] -right-2 w-[48px] h-[48px] opacity-[0.04]"
        animate={{ opacity: [0.04, 0.06, 0.04] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M5 20V5h15" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M55 40v15H40" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" strokeLinecap="round" />
      </motion.svg>

    </div>
  );
}
