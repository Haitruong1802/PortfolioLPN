"use client";

import * as React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "@/lib/theme/provider";

type Palette = {
  ico: string;
  icoEmissive: string;
  octahedron: string;
  torus: string;
  tetra: string;
  pointLight: string;
  ambient: number;
  dir1: number;
  dir2: string;
  dir2Intensity: number;
  sparkles: string;
  sparkleSize: number;
  emissiveBoost: number;
  icoRoughness: number;
  icoMetalness: number;
};

const PALETTES: Record<"dark" | "light", Palette> = {
  dark: {
    ico: "#6366f1",
    icoEmissive: "#06b6d4",
    octahedron: "#ec4899",
    torus: "#06b6d4",
    tetra: "#f59e0b",
    pointLight: "#6366f1",
    ambient: 0.4,
    dir1: 1.2,
    dir2: "#ec4899",
    dir2Intensity: 0.6,
    sparkles: "#a5b4fc",
    sparkleSize: 2.4,
    emissiveBoost: 1.4,
    icoRoughness: 0.2,
    icoMetalness: 0.85,
  },
  light: {
    ico: "#4f46e5",
    icoEmissive: "#0891b2",
    octahedron: "#db2777",
    torus: "#0891b2",
    tetra: "#d97706",
    pointLight: "#4f46e5",
    ambient: 0.65,
    dir1: 1.6,
    dir2: "#db2777",
    dir2Intensity: 0.5,
    sparkles: "#6366f1",
    sparkleSize: 1.8,
    emissiveBoost: 0.85,
    icoRoughness: 0.32,
    icoMetalness: 0.7,
  },
};

function ShapeStack({ palette }: { palette: Palette }) {
  const groupRef = React.useRef<THREE.Group>(null!);
  const lightRef = React.useRef<THREE.PointLight>(null!);

  useFrame(({ clock, mouse }) => {
    const t = clock.getElapsedTime();
    const scrollY =
      typeof window !== "undefined" ? window.scrollY : 0;
    const scrollFactor = Math.min(scrollY / 600, 1);

    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.15 + scrollFactor * 0.7;
      groupRef.current.rotation.x =
        Math.sin(t * 0.3) * 0.1 + scrollFactor * 0.25;
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        mouse.x * 0.4,
        0.04,
      );
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        mouse.y * 0.3 - scrollFactor * 0.6,
        0.04,
      );
      const targetScale = 1 - scrollFactor * 0.18;
      groupRef.current.scale.setScalar(
        THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.08),
      );
    }
    if (lightRef.current) {
      lightRef.current.intensity = 4 + Math.sin(t * 1.4) * 1.5;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.6}>
        <mesh>
          <icosahedronGeometry args={[1.4, 16]} />
          <MeshDistortMaterial
            color={palette.ico}
            roughness={palette.icoRoughness}
            metalness={palette.icoMetalness}
            distort={0.45}
            speed={1.8}
            emissive={palette.icoEmissive}
            emissiveIntensity={0.35 * palette.emissiveBoost}
          />
        </mesh>
      </Float>

      <Float speed={2.1} rotationIntensity={0.8} floatIntensity={1}>
        <mesh position={[2.4, 1.1, -1.5]} scale={0.32}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={palette.octahedron}
            emissive={palette.octahedron}
            emissiveIntensity={0.6 * palette.emissiveBoost}
            roughness={0.4}
            metalness={0.8}
          />
        </mesh>
      </Float>

      <Float speed={1.6} rotationIntensity={0.6} floatIntensity={0.8}>
        <mesh position={[-2.3, -1.2, -1]} scale={0.4}>
          <torusGeometry args={[0.8, 0.18, 16, 32]} />
          <meshStandardMaterial
            color={palette.torus}
            emissive={palette.torus}
            emissiveIntensity={0.5 * palette.emissiveBoost}
            roughness={0.35}
            metalness={0.85}
          />
        </mesh>
      </Float>

      <Float speed={1.2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh position={[1.6, -1.6, -0.8]} scale={0.22}>
          <tetrahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={palette.tetra}
            emissive={palette.tetra}
            emissiveIntensity={0.6 * palette.emissiveBoost}
            roughness={0.4}
            metalness={0.7}
          />
        </mesh>
      </Float>

      <pointLight
        ref={lightRef}
        position={[0, 0, 0]}
        color={palette.pointLight}
        intensity={4}
        distance={6}
      />
    </group>
  );
}

export function HeroScene() {
  const { theme, mounted } = useTheme();
  const palette = PALETTES[mounted ? theme : "dark"];

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 5.5], fov: 45 }}
      gl={{ alpha: true, antialias: true, preserveDrawingBuffer: false }}
      className="!absolute inset-0"
    >
      <ambientLight intensity={palette.ambient} />
      <directionalLight position={[5, 5, 5]} intensity={palette.dir1} />
      <directionalLight
        position={[-5, -3, 2]}
        intensity={palette.dir2Intensity}
        color={palette.dir2}
      />
      <ShapeStack palette={palette} />
      <Sparkles
        count={140}
        scale={9}
        size={palette.sparkleSize}
        speed={0.4}
        color={palette.sparkles}
      />
    </Canvas>
  );
}
