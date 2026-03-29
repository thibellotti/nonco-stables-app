"use client";

import { useEffect, useRef } from "react";

interface ParticleGlobeProps {
  size?: number;
  particleCount?: number;
  opacity?: number;
  className?: string;
}

export function ParticleGlobe({
  size = 500,
  particleCount = 2000,
  opacity = 0.35,
  className,
}: ParticleGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const radius = size * 0.42;

    // Fibonacci sphere distribution — uniform point spread
    const phi = (1 + Math.sqrt(5)) / 2;
    const points: { theta: number; phi: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      const y = 1 - (i / (particleCount - 1)) * 2;
      const angle = ((2 * Math.PI * i) / phi) % (2 * Math.PI);
      points.push({ theta: angle, phi: Math.acos(y) });
    }

    const animate = (time: number) => {
      rafRef.current = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, size, size);

      const t = time / 1000;
      const rotY = t * 0.12;   // slow Y rotation
      const rotX = t * 0.04;   // very slow X tilt — adds 3D depth

      const cosRY = Math.cos(rotY);
      const sinRY = Math.sin(rotY);
      const cosRX = Math.cos(rotX * 0.3); // subtle tilt
      const sinRX = Math.sin(rotX * 0.3);

      const projected: { x: number; y: number; z: number; norm: number }[] = [];

      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const sp = Math.sin(p.phi);
        const cp = Math.cos(p.phi);
        const st = Math.sin(p.theta);
        const ct = Math.cos(p.theta);

        // Base sphere position
        let x = radius * sp * ct;
        let y = radius * cp;
        let z = radius * sp * st;

        // Ripple wave deformation — Nonco Stables signature
        const dist = Math.sqrt(x * x + z * z);
        y += Math.sin(dist * 0.035 - t * 1.2) * 12;

        // Rotation Y (main spin)
        const x1 = x * cosRY - z * sinRY;
        const z1 = x * sinRY + z * cosRY;

        // Rotation X (subtle tilt for depth)
        const y1 = y * cosRX - z1 * sinRX;
        const z2 = y * sinRX + z1 * cosRX;

        // Perspective projection
        const fov = 500;
        const scale = fov / (fov + z2);
        const sx = cx + x1 * scale;
        const sy = cy + y1 * scale;
        const norm = (z2 + radius) / (radius * 2); // 0=back, 1=front

        projected.push({ x: sx, y: sy, z: z2, norm });
      }

      // Sort back-to-front
      projected.sort((a, b) => a.z - b.z);

      for (const p of projected) {
        // Size: back=1px, front=2.8px
        const sz = 0.8 + p.norm * 2;
        // Alpha: back=0.04, front=0.5
        const alpha = 0.04 + p.norm * 0.46;

        // Color layers: cyan front, blue-gray mid, dim back
        if (p.norm > 0.55) {
          ctx.fillStyle = `rgba(5, 224, 248, ${alpha})`;
        } else if (p.norm > 0.25) {
          ctx.fillStyle = `rgba(140, 190, 210, ${alpha * 0.5})`;
        } else {
          ctx.fillStyle = `rgba(80, 100, 120, ${alpha * 0.2})`;
        }

        // Square particles — Nonco signature
        ctx.fillRect(p.x - sz / 2, p.y - sz / 2, sz, sz);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [size, particleCount]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        width: size,
        height: size,
        opacity,
        pointerEvents: "none",
      }}
      aria-hidden="true"
    />
  );
}
