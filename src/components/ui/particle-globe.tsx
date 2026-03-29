"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

THREE.ColorManagement.enabled = true;

const BRAND_CYAN = "#05e0f8";

// Fibonacci sphere — uniform point distribution
function fibonacciSphere(n: number, radius: number): Float32Array {
  const positions = new Float32Array(n * 3);
  const gr = (1 + Math.sqrt(5)) / 2;
  for (let i = 0; i < n; i++) {
    const theta = (2 * Math.PI * i) / gr;
    const phi = Math.acos(1 - 2 * (i + 0.5) / n);
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
  }
  return positions;
}

// The central particle globe
function Globe() {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(fibonacciSphere(2000, 90), 3));
    return g;
  }, []);

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.08;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        color={BRAND_CYAN}
        size={1.8}
        sizeAttenuation
        transparent
        opacity={0.75}
        depthWrite={false}
      />
    </points>
  );
}

// Ambient particles spread wide
function AmbientParticles() {
  const ref = useRef<THREE.Points>(null);
  const { positions, sizes } = useMemo(() => {
    const count = 800;
    const pos = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 150 + Math.random() * 500;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      siz[i] = 1.5 + Math.random() * 3.5;
    }
    return { positions: pos, sizes: siz };
  }, []);

  const colorVec = useMemo(() => new THREE.Vector3(0.02, 0.878, 0.973), []);

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
        uniforms={{ uColor: { value: colorVec } }}
        vertexShader={`
          attribute float size;
          void main() {
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (200.0 / -mv.z);
            gl_Position = projectionMatrix * mv;
          }
        `}
        fragmentShader={`
          uniform vec3 uColor;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            if (d > 0.5) discard;
            gl_FragColor = vec4(uColor, 0.7);
          }
        `}
      />
    </points>
  );
}

// Camera auto-rotation
function CameraRig() {
  const { camera } = useThree();
  const angle = useRef(0);

  useFrame((_, dt) => {
    angle.current += dt * 0.02;
    const dist = 280;
    camera.position.x += (Math.sin(angle.current) * dist - camera.position.x) * 0.04;
    camera.position.z += (Math.cos(angle.current) * dist - camera.position.z) * 0.04;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// Exported component
interface ParticleGlobeProps {
  size?: number;
  opacity?: number;
  className?: string;
}

export function ParticleGlobe({
  size = 500,
  opacity = 0.35,
  className,
}: ParticleGlobeProps) {
  return (
    <div
      className={className}
      style={{ width: size, height: size, opacity, pointerEvents: "none" }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 280], fov: 50, near: 1, far: 1500 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        style={{ background: "transparent" }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <fog attach="fog" args={["#000000", 80, 600]} />
        <CameraRig />
        <Globe />
        <AmbientParticles />
      </Canvas>
    </div>
  );
}
