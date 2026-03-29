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
  particleCount = 2500,
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

    // Grid-based ripple formation — matches nonco.com/stables Three.js
    const gridSize = Math.ceil(Math.sqrt(particleCount));
    const gridSpread = size * 0.8;
    const spacing = gridSpread / gridSize;
    const offset = gridSpread / 2;

    // Wave params from Nonco preset: waveAmplitude 73, waveFrequency 3.0, waveSpeed 0.1
    const waveAmplitude = size * 0.08;
    const waveFrequency = 3.0;

    // Pre-compute grid positions
    const particles: { gx: number; gy: number }[] = [];
    for (let i = 0; i < gridSize * gridSize && particles.length < particleCount; i++) {
      const ix = i % gridSize;
      const iy = Math.floor(i / gridSize);
      particles.push({
        gx: ix * spacing - offset,
        gy: iy * spacing - offset,
      });
    }

    const animate = (time: number) => {
      rafRef.current = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, size, size);

      const t = time / 1000;

      // Auto-rotation — matches autoRotate: 20 from Nonco preset
      const rotY = t * 0.3;
      const cosR = Math.cos(rotY);
      const sinR = Math.sin(rotY);

      const projected: { sx: number; sy: number; z: number; norm: number }[] = [];
      const fov = size * 1.2;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Grid X/Z plane positions
        const x = p.gx;
        const z = p.gy;

        // Ripple wave: height based on distance from center
        const centerDx = (i % gridSize) - gridSize / 2;
        const centerDy = Math.floor(i / gridSize) - gridSize / 2;
        const dist = Math.sqrt(centerDx * centerDx + centerDy * centerDy);
        const y = Math.sin(dist * waveFrequency * 0.15 - t * 2) * waveAmplitude;

        // Rotate around Y axis (the main spin)
        const rx = x * cosR - z * sinR;
        const rz = x * sinR + z * cosR;

        // Perspective projection
        const scale = fov / (fov + rz);
        const sx = cx + rx * scale;
        const sy = cy + y * scale;

        // Depth normalization: -offset..+offset → 0..1
        const norm = (rz + offset) / (offset * 2);

        projected.push({ sx, sy, z: rz, norm });
      }

      // Sort back to front
      projected.sort((a, b) => a.z - b.z);

      // Draw
      for (const p of projected) {
        const sz = 0.6 + p.norm * 1.8;
        const alpha = 0.02 + p.norm * 0.4;

        if (p.norm > 0.55) {
          ctx.fillStyle = `rgba(5, 224, 248, ${alpha})`;
        } else if (p.norm > 0.3) {
          ctx.fillStyle = `rgba(150, 200, 220, ${alpha * 0.4})`;
        } else {
          ctx.fillStyle = `rgba(80, 110, 130, ${alpha * 0.15})`;
        }

        // Square particles — Nonco particleShape: 'square'
        ctx.fillRect(p.sx - sz / 2, p.sy - sz / 2, sz, sz);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [size, particleCount]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: size, height: size, opacity, pointerEvents: "none" }}
      aria-hidden="true"
    />
  );
}
