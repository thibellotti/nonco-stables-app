"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

THREE.ColorManagement.enabled = true;

const CYAN = "#05e0f8";

// ─── Config matching nonco.com/stables ───
const CONFIG = {
  cam: { dist: 220, rotateSpeed: 0.02, scrollInfluence: 0.8 },
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
const texCache = new Map<string, THREE.CanvasTexture>();

function logoTexture(text: string, sz = 512): THREE.CanvasTexture {
  const key = `logo-${text}-v2`;
  if (texCache.has(key)) return texCache.get(key)!;
  const c = document.createElement("canvas");
  c.width = sz; c.height = sz;
  const ctx = c.getContext("2d")!;
  const cx = sz / 2;
  const r = cx * 0.82;

  // Solid circle fill — matching nonco.com badge style
  ctx.beginPath();
  ctx.arc(cx, cx, r, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(5, 224, 248, 0.15)";
  ctx.fill();

  // Thick circle border
  ctx.beginPath();
  ctx.arc(cx, cx, r, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(5, 224, 248, 0.6)";
  ctx.lineWidth = sz * 0.035;
  ctx.stroke();

  // Inner circle highlight
  ctx.beginPath();
  ctx.arc(cx, cx, r * 0.75, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(5, 224, 248, 0.1)";
  ctx.lineWidth = sz * 0.01;
  ctx.stroke();

  // Symbol inside — bold, centered
  ctx.fillStyle = CYAN;
  const symbols: Record<string, string> = {
    USDC: "$", USDT: "₮", DAI: "◆", TUSD: "T", GUSD: "G", PAX: "P", BUSD: "B", FRAX: "F",
  };
  const sym = symbols[text] ?? text[0];
  ctx.font = `800 ${sz * 0.4}px -apple-system, "Space Grotesk", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(sym, cx, cx);

  const tex = new THREE.CanvasTexture(c);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  texCache.set(key, tex);
  return tex;
}

// ─── Fiat currency text: large bold symbol ───
function currencyTexture(text: string, sz = 512): THREE.CanvasTexture {
  const key = `fiat-${text}`;
  if (texCache.has(key)) return texCache.get(key)!;
  const c = document.createElement("canvas");
  c.width = sz; c.height = sz;
  const ctx = c.getContext("2d")!;
  ctx.clearRect(0, 0, sz, sz);
  ctx.fillStyle = CYAN;
  const fs = text.length > 2 ? sz * 0.32 : text.length > 1 ? sz * 0.45 : sz * 0.6;
  ctx.font = `700 ${fs}px -apple-system, "Space Grotesk", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, sz / 2, sz / 2);
  const tex = new THREE.CanvasTexture(c);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  texCache.set(key, tex);
  return tex;
}

// ─── Central globe ───
function Globe() {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(fibSphere(CONFIG.globe.particles, CONFIG.globe.radius), 3));
    return g;
  }, []);

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * CONFIG.globe.rotSpeed;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial color={CYAN} size={1.0} sizeAttenuation transparent opacity={0.7} depthWrite={false} />
    </points>
  );
}

// ─── Orbital ring with currency sprites ───
function OrbitalRing({
  items, radius, speed, tiltX, tiltZ, size, scrollProgress, isLogo,
}: {
  items: string[]; radius: number; speed: number; tiltX: number; tiltZ: number; size: number; scrollProgress: number; isLogo?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const baseRot = useRef(0);
  const smoothScroll = useRef(0);

  const positions = useMemo(
    () => items.map((_, i) => {
      const a = (i / items.length) * Math.PI * 2;
      return [Math.cos(a) * radius, 0, Math.sin(a) * radius] as [number, number, number];
    }),
    [items, radius]
  );

  const textures = useMemo(() => items.map((t) => isLogo ? logoTexture(t) : currencyTexture(t)), [items, isLogo]);

  useFrame((_, dt) => {
    if (!groupRef.current) return;
    baseRot.current += dt * speed;
    smoothScroll.current += (scrollProgress - smoothScroll.current) * 0.03;
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
function AmbientParticles() {
  const ref = useRef<THREE.Points>(null);
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

  const uColor = useMemo(() => new THREE.Vector3(0.02, 0.878, 0.973), []);

  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.y += dt * 0.04;
      ref.current.rotation.x += dt * 0.012;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
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
function CameraRig({ scrollProgress }: { scrollProgress: number }) {
  const { camera } = useThree();
  const angle = useRef(0);
  const smoothScroll = useRef(0);

  useFrame((_, dt) => {
    angle.current += dt * CONFIG.cam.rotateSpeed;
    smoothScroll.current += (scrollProgress - smoothScroll.current) * 0.06;

    const scrollAngle = smoothScroll.current * Math.PI * CONFIG.cam.scrollInfluence;
    const combined = angle.current + scrollAngle;
    const scrollY = Math.sin(smoothScroll.current * Math.PI * 0.5) * 60;

    const tx = Math.sin(combined) * CONFIG.cam.dist;
    const tz = Math.cos(combined) * CONFIG.cam.dist;

    camera.position.x += (tx - camera.position.x) * 0.04;
    camera.position.y += (scrollY - camera.position.y) * 0.04;
    camera.position.z += (tz - camera.position.z) * 0.04;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ─── Scene ───
function Scene({ scrollProgress }: { scrollProgress: number }) {
  return (
    <>
      <CameraRig scrollProgress={scrollProgress} />
      <Globe />
      {CONFIG.rings.map((ring, i) => (
        <OrbitalRing key={i} {...ring} scrollProgress={scrollProgress} isLogo={i === 0} />
      ))}
      <AmbientParticles />
    </>
  );
}

// ─── Exported component ───
interface ParticleGlobeProps {
  size?: number;
  opacity?: number;
  offset?: number; // shift globe to the right in 3D space
  className?: string;
}

export function ParticleGlobe({ size, opacity = 0.35, offset = 0, className }: ParticleGlobeProps) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrollProgress(Math.min(window.scrollY / window.innerHeight, 1));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={className}
      style={{
        width: size ?? "100%",
        height: size ?? "100%",
        opacity,
        pointerEvents: "none",
      }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, CONFIG.cam.dist], fov: 50, near: 1, far: 1500 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance", outputColorSpace: THREE.SRGBColorSpace }}
        style={{ background: "transparent" }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <fog attach="fog" args={["#000000", 100, 700]} />
        <Scene scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}
