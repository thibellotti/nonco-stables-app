"use client";

import { useEffect, useRef } from "react";

interface ParticleGlobeProps {
  size?: number;
  particleCount?: number;
  opacity?: number;
  className?: string;
}

export function ParticleGlobe({
  size = 320,
  particleCount = 1200,
  opacity = 0.12,
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
    const radius = size * 0.38;

    // Generate points on a sphere using fibonacci distribution
    const phi = (1 + Math.sqrt(5)) / 2; // golden ratio
    const points: { theta: number; phi: number; r: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      const y = 1 - (i / (particleCount - 1)) * 2; // -1 to 1
      const radiusAtY = Math.sqrt(1 - y * y);
      const angle = ((2 * Math.PI * i) / phi) % (2 * Math.PI);

      points.push({
        theta: angle,
        phi: Math.acos(y),
        r: radius,
      });
    }

    let rotationY = 0;

    const animate = (time: number) => {
      rafRef.current = requestAnimationFrame(animate);

      ctx.clearRect(0, 0, size, size);

      const t = time / 1000;
      rotationY = t * 0.15; // slow auto-rotation

      // Sort by z-depth for proper layering
      const projected: { x: number; y: number; z: number; depth: number }[] = [];

      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const sinPhi = Math.sin(p.phi);
        const cosPhi = Math.cos(p.phi);
        const sinTheta = Math.sin(p.theta + rotationY);
        const cosTheta = Math.cos(p.theta + rotationY);

        // Sphere coordinates
        let x3d = p.r * sinPhi * cosTheta;
        let y3d = p.r * cosPhi;
        let z3d = p.r * sinPhi * sinTheta;

        // Ripple wave deformation (Nonco Stables signature)
        const dist = Math.sqrt(x3d * x3d + y3d * y3d);
        const wave = Math.sin(dist * 0.04 - t * 1.5) * 8;
        y3d += wave;

        // Project to 2D
        const perspective = 600;
        const scale = perspective / (perspective + z3d);
        const x2d = cx + x3d * scale;
        const y2d = cy + y3d * scale;

        // Depth-based properties
        const normalizedZ = (z3d + p.r) / (p.r * 2); // 0 (back) to 1 (front)

        projected.push({ x: x2d, y: y2d, z: z3d, depth: normalizedZ });
      }

      // Sort back to front
      projected.sort((a, b) => a.z - b.z);

      // Draw particles as squares (Nonco particleShape: 'square')
      for (const p of projected) {
        const particleSize = 1 + p.depth * 1.2;
        const alpha = 0.05 + p.depth * 0.35;

        // Color: mix of cyan and white/gray based on depth
        if (p.depth > 0.6) {
          // Front particles: cyan
          ctx.fillStyle = `rgba(5, 224, 248, ${alpha})`;
        } else if (p.depth > 0.3) {
          // Mid particles: lighter gray
          ctx.fillStyle = `rgba(180, 200, 210, ${alpha * 0.6})`;
        } else {
          // Back particles: dim gray
          ctx.fillStyle = `rgba(120, 130, 140, ${alpha * 0.3})`;
        }

        // Square particles (Nonco signature)
        ctx.fillRect(
          p.x - particleSize / 2,
          p.y - particleSize / 2,
          particleSize,
          particleSize
        );
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafRef.current);
  }, [size, particleCount]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
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
