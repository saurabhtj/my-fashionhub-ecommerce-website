"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

/* ── Floating geometric shapes ── */
function FloatingShape({
  position,
  geometry,
  color,
  speed,
  rotationSpeed,
}: {
  position: [number, number, number];
  geometry: "box" | "octahedron" | "torus" | "sphere";
  color: string;
  speed: number;
  rotationSpeed: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((_state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * rotationSpeed * 0.3;
      meshRef.current.rotation.y += delta * rotationSpeed * 0.2;
    }
  });

  const geo = useMemo(() => {
    switch (geometry) {
      case "box":
        return <boxGeometry args={[0.5, 0.5, 0.5]} />;
      case "octahedron":
        return <octahedronGeometry args={[0.4]} />;
      case "torus":
        return <torusGeometry args={[0.35, 0.12, 16, 32]} />;
      case "sphere":
        return <sphereGeometry args={[0.3, 32, 32]} />;
    }
  }, [geometry]);

  return (
    <Float speed={speed} rotationIntensity={0.3} floatIntensity={0.6}>
      <mesh ref={meshRef} position={position}>
        {geo}
        <meshStandardMaterial
          color={color}
          roughness={0.6}
          metalness={0.1}
          transparent
          opacity={0.85}
        />
      </mesh>
    </Float>
  );
}

/* ── Mouse-follow camera ── */
function CameraRig() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  useFrame(() => {
    camera.position.x += (mouse.current.x * 0.5 - camera.position.x) * 0.02;
    camera.position.y += (-mouse.current.y * 0.3 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/* ── Scene ── */
function Scene() {
  const shapes = useMemo(
    () => [
      { position: [-2.5, 1.2, -1] as [number, number, number], geometry: "octahedron" as const, color: "#171717", speed: 1.5, rotationSpeed: 0.5 },
      { position: [2.8, -0.8, -2] as [number, number, number], geometry: "box" as const, color: "#d4d4d4", speed: 1.2, rotationSpeed: 0.3 },
      { position: [-1.5, -1.5, -1.5] as [number, number, number], geometry: "torus" as const, color: "#a3a3a3", speed: 2, rotationSpeed: 0.4 },
      { position: [1.8, 1.5, -2.5] as [number, number, number], geometry: "sphere" as const, color: "#525252", speed: 1.8, rotationSpeed: 0.6 },
      { position: [0, -0.5, -3] as [number, number, number], geometry: "octahedron" as const, color: "#e5e5e5", speed: 1, rotationSpeed: 0.2 },
      { position: [-3, 0, -3] as [number, number, number], geometry: "box" as const, color: "#404040", speed: 1.3, rotationSpeed: 0.35 },
      { position: [3.5, 0.5, -2] as [number, number, number], geometry: "torus" as const, color: "#f5f5f5", speed: 1.6, rotationSpeed: 0.45 },
    ],
    []
  );

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.4} />
      <pointLight position={[-3, 2, 2]} intensity={0.3} color="#ffffff" />
      <CameraRig />
      {shapes.map((s, i) => (
        <FloatingShape key={i} {...s} />
      ))}
    </>
  );
}

/* ── Canvas wrapper ── */
export default function HeroCanvas() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
