"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";

const ParticleGlobe = dynamic(
  () => import("@/components/ui/particle-globe").then((m) => ({ default: m.ParticleGlobe })),
  { ssr: false }
);

export function GlobeBackground() {
  const ref = useRef<HTMLDivElement>(null);

  // Scroll-based fade — exactly like nonco.com/stables
  useEffect(() => {
    let raf: number;
    const onScroll = () => {
      raf = requestAnimationFrame(() => {
        if (!ref.current) return;
        const y = window.scrollY;
        const fadeStart = window.innerHeight * 0.1;
        const fadeEnd = window.innerHeight * 0.8;
        const o = Math.max(0, Math.min(1, 1 - (y - fadeStart) / (fadeEnd - fadeStart)));
        ref.current.style.opacity = String(o);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none hidden lg:block"
      style={{ width: "120vw", height: "120vh", zIndex: 1 }}
    >
      <ParticleGlobe opacity={0.4} />
    </div>
  );
}
