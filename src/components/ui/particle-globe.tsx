"use client";

import { useRef, useMemo, useEffect, useState, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  BufferGeometry,
  BufferAttribute,
  CanvasTexture,
  ColorManagement,
  LinearFilter,
  SRGBColorSpace,
  Vector3,
} from "three";
import type { Points, Group } from "three";

ColorManagement.enabled = true;

// ─── Theme-aware accent ───────────────────────────────────────────────────
// Strategy A (chosen): the globe lives on every theme, but the accent color
// shifts to keep contrast against the surface. Dark mode uses the vivid Nonco
// cyan (#05e0f8); light mode darkens it to #007a8a (matching --cyan-dark in
// globals.css) so the particles, sprite logos, and ambient field stay
// readable against the off-white background.
//
// The exported component watches `<html data-theme>` via a MutationObserver
// and re-mounts the <Canvas> on theme flip (key={accent}). Re-mount is the
// simplest correct path: it forces texture cache purge, fresh material
// uniforms, and a new fog color. Perf cost is bounded — the canvas is
// IntersectionObserver-gated and only one or two instances are ever live.
function readThemeAccent(): { accent: string; ambientRGB: [number, number, number]; fogColor: string } {
  if (typeof document === "undefined") {
    return { accent: "#05e0f8", ambientRGB: [0.02, 0.878, 0.973], fogColor: "#000000" };
  }
  const theme = document.documentElement.dataset.theme;
  if (theme === "light") {
    return {
      accent: "#007a8a",
      ambientRGB: [0.0, 0.478, 0.541], // matches #007a8a
      fogColor: "#f7f7f5",
    };
  }
  return { accent: "#05e0f8", ambientRGB: [0.02, 0.878, 0.973], fogColor: "#000000" };
}

// ─── Config matching nonco.com/stables ───
const CONFIG = {
  cam: { dist: 160, rotateSpeed: 0.02, scrollInfluence: 0.8 },
  globe: { radius: 90, particles: 2000, rotSpeed: 0.08 },
  rings: [
    {
      // Inner ring — stablecoin symbols (matching site: 8 items, radius 150)
      items: ["USDC", "USDT", "DAI", "TUSD", "GUSD", "PAX", "BUSD", "FRAX"],
      radius: 150,
      speed: 0.12,
      tiltX: 65,
      tiltZ: 25,
      size: 22,
    },
    {
      // Outer ring — fiat symbols (matching site: 16 items, radius 200, opposite tilt)
      items: ["$", "€", "£", "¥", "₹", "₩", "MX$", "R$", "A$", "C$", "S$", "CHF", "₺", "₽", "฿", "₱"],
      radius: 200,
      speed: -0.1,
      tiltX: 65,
      tiltZ: -25,
      size: 18,
    },
  ],
  ambient: { count: 1500, spreadMin: 200, spreadMax: 800, sizeMin: 2, sizeMax: 6 },
};

// ─── Fibonacci sphere ───
function fibSphere(n: number, r: number): Float32Array {
  const pos = new Float32Array(n * 3);
  const gr = (1 + Math.sqrt(5)) / 2;
  for (let i = 0; i < n; i++) {
    const theta = (2 * Math.PI * i) / gr;
    const phi = Math.acos(1 - 2 * (i + 0.5) / n);
    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i * 3 + 2] = r * Math.cos(phi);
  }
  return pos;
}

// ─── Stablecoin logo texture: circle container + abbreviation inside ───
// Cache key includes the accent color so theme switches generate a fresh atlas.
const texCache = new Map<string, CanvasTexture>();

function logoTexture(text: string, accent: string, sz = 512): CanvasTexture {
  const key = `logo-${text}-${accent}`;
  if (texCache.has(key)) return texCache.get(key)!;
  const c = document.createElement("canvas");
  c.width = sz; c.height = sz;
  const ctx = c.getContext("2d")!;
  const cx = sz / 2;
  const r = cx * 0.82;

  // Convert hex accent to rgba helpers
  const hex = accent.replace("#", "");
  const rR = parseInt(hex.slice(0, 2), 16);
  const gR = parseInt(hex.slice(2, 4), 16);
  const bR = parseInt(hex.slice(4, 6), 16);

  // Solid circle fill — matching nonco.com badge style
  ctx.beginPath();
  ctx.arc(cx, cx, r, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(${rR}, ${gR}, ${bR}, 0.15)`;
  ctx.fill();

  // Thick circle border
  ctx.beginPath();
  ctx.arc(cx, cx, r, 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(${rR}, ${gR}, ${bR}, 0.6)`;
  ctx.lineWidth = sz * 0.035;
  ctx.stroke();

  // Inner circle highlight
  ctx.beginPath();
  ctx.arc(cx, cx, r * 0.75, 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(${rR}, ${gR}, ${bR}, 0.1)`;
  ctx.lineWidth = sz * 0.01;
  ctx.stroke();

  // Symbol inside — bold, centered
  ctx.fillStyle = accent;
  const symbols: Record<string, string> = {
    USDC: "$", USDT: "₮", DAI: "◆", TUSD: "T", GUSD: "G", PAX: "P", BUSD: "B", FRAX: "F",
  };
  const sym = symbols[text] ?? text[0];
  ctx.font = `800 ${sz * 0.4}px -apple-system, "Space Grotesk", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(sym, cx, cx);

  const tex = new CanvasTexture(c);
  tex.minFilter = LinearFilter;
  tex.magFilter = LinearFilter;
  texCache.set(key, tex);
  return tex;
}

// ─── Fiat currency text: large bold symbol ───
function currencyTexture(text: string, accent: string, sz = 512): CanvasTexture {
  const key = `fiat-${text}-${accent}`;
  if (texCache.has(key)) return texCache.get(key)!;
  const c = document.createElement("canvas");
  c.width = sz; c.height = sz;
  const ctx = c.getContext("2d")!;
  ctx.clearRect(0, 0, sz, sz);
  ctx.fillStyle = accent;
  const fs = text.length > 2 ? sz * 0.32 : text.length > 1 ? sz * 0.45 : sz * 0.6;
  ctx.font = `700 ${fs}px -apple-system, "Space Grotesk", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, sz / 2, sz / 2);
  const tex = new CanvasTexture(c);
  tex.minFilter = LinearFilter;
  tex.magFilter = LinearFilter;
  texCache.set(key, tex);
  return tex;
}

// ─── Central globe ───
function Globe({ accent }: { accent: string }) {
  const ref = useRef<Points>(null);
  const geo = useMemo(() => {
    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(fibSphere(CONFIG.globe.particles, CONFIG.globe.radius), 3));
    return g;
  }, []);

  useEffect(() => {
    return () => {
      geo.dispose();
    };
  }, [geo]);

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * CONFIG.globe.rotSpeed;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial color={accent} size={1.5} sizeAttenuation transparent opacity={0.7} depthWrite={false} />
    </points>
  );
}

// ─── Orbital ring with currency sprites ───
function OrbitalRing({
  items, radius, speed, tiltX, tiltZ, size, scrollProgressRef, isLogo, accent,
}: {
  items: string[]; radius: number; speed: number; tiltX: number; tiltZ: number; size: number; scrollProgressRef: MutableRefObject<number>; isLogo?: boolean; accent: string;
}) {
  const groupRef = useRef<Group>(null);
  const baseRot = useRef(0);
  const smoothScroll = useRef(0);

  const positions = useMemo(
    () => items.map((_, i) => {
      const a = (i / items.length) * Math.PI * 2;
      return [Math.cos(a) * radius, 0, Math.sin(a) * radius] as [number, number, number];
    }),
    [items, radius]
  );

  const textures = useMemo(() => items.map((t) => isLogo ? logoTexture(t, accent) : currencyTexture(t, accent)), [items, isLogo, accent]);

  useFrame((_, dt) => {
    if (!groupRef.current) return;
    baseRot.current += dt * speed;
    smoothScroll.current += (scrollProgressRef.current - smoothScroll.current) * 0.03;
    groupRef.current.rotation.y = baseRot.current + smoothScroll.current * Math.PI * 0.4 * Math.sign(speed);
  });

  return (
    <group rotation={[(tiltX * Math.PI) / 180, 0, (tiltZ * Math.PI) / 180]}>
      <group ref={groupRef}>
        {items.map((item, i) => (
          <sprite key={item + i} position={positions[i]} scale={[size, size, 1]}>
            <spriteMaterial map={textures[i]} transparent depthWrite={false} opacity={0.85} />
          </sprite>
        ))}
      </group>
    </group>
  );
}

// ─── Ambient particles ───
function AmbientParticles({ ambientRGB }: { ambientRGB: [number, number, number] }) {
  const ref = useRef<Points>(null);
  const geoRef = useRef<BufferGeometry>(null);

  const { positions, sizes } = useMemo(() => {
    const c = CONFIG.ambient.count;
    const p = new Float32Array(c * 3);
    const s = new Float32Array(c);
    for (let i = 0; i < c; i++) {
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      const r = CONFIG.ambient.spreadMin + Math.random() * (CONFIG.ambient.spreadMax - CONFIG.ambient.spreadMin);
      p[i * 3] = r * Math.sin(ph) * Math.cos(th);
      p[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      p[i * 3 + 2] = r * Math.cos(ph);
      s[i] = CONFIG.ambient.sizeMin + Math.random() * (CONFIG.ambient.sizeMax - CONFIG.ambient.sizeMin);
    }
    return { positions: p, sizes: s };
  }, []);

  useEffect(() => {
    return () => {
      geoRef.current?.dispose();
    };
  }, []);

  const uColor = useMemo(() => new Vector3(...ambientRGB), [ambientRGB]);

  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.y += dt * 0.04;
      ref.current.rotation.x += dt * 0.012;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry ref={geoRef}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <shaderMaterial
        transparent
        depthWrite={false}
        uniforms={{ uColor: { value: uColor } }}
        vertexShader={`
          attribute float size;
          void main() {
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (250.0 / -mv.z);
            gl_Position = projectionMatrix * mv;
          }
        `}
        fragmentShader={`
          uniform vec3 uColor;
          void main() {
            if (length(gl_PointCoord - 0.5) > 0.5) discard;
            gl_FragColor = vec4(uColor, 0.7);
          }
        `}
      />
    </points>
  );
}

// ─── Camera controller — auto-orbit + scroll-driven + offset ───
function CameraRig() {
  const { camera } = useThree();

  useFrame(() => {
    camera.position.set(0, 0, CONFIG.cam.dist);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ─── Scene ───
function Scene({
  scrollProgressRef,
  accent,
  ambientRGB,
}: {
  scrollProgressRef: MutableRefObject<number>;
  accent: string;
  ambientRGB: [number, number, number];
}) {
  return (
    <>
      <CameraRig />
      <Globe accent={accent} />
      {CONFIG.rings.map((ring, i) => (
        <OrbitalRing key={i} {...ring} scrollProgressRef={scrollProgressRef} isLogo={i === 0} accent={accent} />
      ))}
      <AmbientParticles ambientRGB={ambientRGB} />
    </>
  );
}

// ─── Exported component ───
interface ParticleGlobeProps {
  size?: number;
  opacity?: number;
  className?: string;
}

export function ParticleGlobe({ size, opacity = 0.35, className }: ParticleGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const scrollProgressRef = useRef(0);

  // Read theme on mount and react to theme changes via a MutationObserver on
  // <html data-theme>. We rebuild textures (cache-keyed by accent) and re-pass
  // the accent prop into the scene tree.
  const [{ accent, ambientRGB, fogColor }, setThemeColors] = useState(() => readThemeAccent());

  useEffect(() => {
    const html = document.documentElement;
    const update = () => setThemeColors(readThemeAccent());
    const mo = new MutationObserver(update);
    mo.observe(html, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "100px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      scrollProgressRef.current = Math.min(window.scrollY / window.innerHeight, 1);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      // Dispose all cached textures on unmount
      texCache.forEach((tex) => tex.dispose());
      texCache.clear();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: size ?? "100%",
        height: size ?? "100%",
        opacity,
        pointerEvents: "none",
      }}
      aria-hidden="true"
    >
      {visible && (
        <Canvas
          // Re-mount the canvas when the theme changes so all GL resources
          // (textures, materials, fog) regenerate with the new accent. The
          // globe is opt-in via IntersectionObserver, so this only rebuilds
          // when actually visible — perf hit is bounded.
          key={accent}
          camera={{ position: [0, 0, CONFIG.cam.dist], fov: 50, near: 1, far: 1500 }}
          dpr={typeof window !== "undefined" ? [1, Math.min(window.devicePixelRatio, 2)] : [1, 2]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance", outputColorSpace: SRGBColorSpace }}
          style={{ background: "transparent" }}
          onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
        >
          <fog attach="fog" args={[fogColor, 100, 700]} />
          <Scene scrollProgressRef={scrollProgressRef} accent={accent} ambientRGB={ambientRGB} />
        </Canvas>
      )}
    </div>
  );
}
