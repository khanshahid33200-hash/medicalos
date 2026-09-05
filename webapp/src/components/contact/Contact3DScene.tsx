"use client";

import { useRef, useMemo } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere, Line } from "@react-three/drei";

function FloatingParticle({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialY = position[1];
  const speed = useMemo(() => 0.8 + Math.random() * 0.8, []);
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.position.y = initialY + Math.sin(state.clock.elapsedTime * speed + offset) * 0.15;
  });

  return (
    <Sphere ref={meshRef} position={position} args={[0.04, 16, 16]}>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.6}
        roughness={0.2}
      />
    </Sphere>
  );
}

function NodeOrb({
  position,
  label,
  color,
  emissiveColor,
  size = 0.28,
}: {
  position: [number, number, number];
  label: string;
  color: string;
  emissiveColor: string;
  size?: number;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.3;
  });

  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
      <group ref={ref} position={position}>
        <Sphere args={[size, 32, 32]}>
          <meshStandardMaterial
            color={color}
            emissive={emissiveColor}
            emissiveIntensity={0.5}
            roughness={0.15}
            metalness={0.4}
          />
        </Sphere>
        {/* Halo outer glow */}
        <Sphere args={[size * 1.35, 16, 16]}>
          <meshBasicMaterial
            color={emissiveColor}
            transparent
            opacity={0.15}
            wireframe
          />
        </Sphere>
      </group>
    </Float>
  );
}

function CommunicationCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.12;
      meshRef.current.rotation.y = t * 0.18;
    }
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = -t * 0.15;
      outerRingRef.current.rotation.y = t * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.7}>
      <group>
        {/* Central Core */}
        <Sphere ref={meshRef} args={[0.75, 48, 48]}>
          <meshStandardMaterial
            color="#2563EB"
            emissive="#3B82F6"
            emissiveIntensity={0.45}
            metalness={0.3}
            roughness={0.15}
          />
        </Sphere>

        {/* Ambient Core Glow Shell */}
        <Sphere args={[0.92, 32, 32]}>
          <meshBasicMaterial
            color="#60A5FA"
            transparent
            opacity={0.18}
            wireframe
          />
        </Sphere>

        {/* Orbit Ring */}
        <group ref={outerRingRef}>
          <mesh rotation={[Math.PI / 3, 0, 0]}>
            <torusGeometry args={[1.2, 0.015, 16, 64]} />
            <meshStandardMaterial
              color="#FF6B2C"
              emissive="#FF6B2C"
              emissiveIntensity={0.8}
            />
          </mesh>
          <mesh rotation={[-Math.PI / 4, Math.PI / 4, 0]}>
            <torusGeometry args={[1.35, 0.012, 16, 64]} />
            <meshStandardMaterial
              color="#3B82F6"
              emissive="#3B82F6"
              emissiveIntensity={0.6}
            />
          </mesh>
        </group>
      </group>
    </Float>
  );
}

function ConnectedNetwork() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.12;
  });

  // Node positions surrounding the core
  const nodes: {
    pos: [number, number, number];
    label: string;
    color: string;
    emissive: string;
  }[] = useMemo(
    () => [
      { pos: [-1.8, 0.9, 0.4], label: "Hospital", color: "#2563EB", emissive: "#3B82F6" },
      { pos: [1.9, 0.8, -0.3], label: "Doctor", color: "#FF6B2C", emissive: "#FF8A4C" },
      { pos: [-1.4, -1.1, -0.2], label: "Patient", color: "#06B6D4", emissive: "#22D3EE" },
      { pos: [1.5, -1.0, 0.5], label: "AI Core", color: "#8B5CF6", emissive: "#A78BFA" },
    ],
    []
  );

  const particles: [number, number, number][] = useMemo(
    () => [
      [-0.8, 1.4, -0.5],
      [0.9, 1.5, 0.6],
      [-1.9, -0.2, 0.8],
      [1.7, 0.1, -0.8],
      [-0.6, -1.6, 0.4],
      [0.8, -1.7, -0.5],
      [2.2, 1.2, 0.3],
      [-2.1, 0.5, -0.6],
    ],
    []
  );

  return (
    <group ref={groupRef}>
      <CommunicationCore />

      {/* Outer Nodes */}
      {nodes.map((n, i) => (
        <NodeOrb
          key={i}
          position={n.pos}
          label={n.label}
          color={n.color}
          emissiveColor={n.emissive}
        />
      ))}

      {/* Connection Lines from Core to Nodes */}
      {nodes.map((n, i) => (
        <Line
          key={`line-${i}`}
          points={[[0, 0, 0], n.pos]}
          color={i % 2 === 0 ? "#60A5FA" : "#FB923C"}
          lineWidth={1.2}
          transparent
          opacity={0.35}
        />
      ))}

      {/* Cross Interconnections */}
      <Line
        points={[nodes[0].pos, nodes[1].pos]}
        color="#93C5FD"
        lineWidth={0.8}
        transparent
        opacity={0.2}
      />
      <Line
        points={[nodes[2].pos, nodes[3].pos]}
        color="#FDBA74"
        lineWidth={0.8}
        transparent
        opacity={0.2}
      />

      {/* Ambient Floating Dust */}
      {particles.map((p, i) => (
        <FloatingParticle
          key={`p-${i}`}
          position={p}
          color={i % 2 === 0 ? "#38BDF8" : "#FB923C"}
        />
      ))}
    </group>
  );
}

export default function Contact3DScene() {
  return (
    <div className="relative h-[270px] xs:h-[310px] sm:h-[400px] lg:h-[480px] w-full max-w-full overflow-hidden select-none">
      {/* Soft radial backdrop behind canvas */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-48 w-48 sm:h-72 sm:w-72 rounded-full bg-gradient-to-tr from-blue-400/20 via-orange-300/15 to-violet-400/20 blur-[60px] sm:blur-[90px]" />
      </div>

      <Canvas
        camera={{ position: [0, 0, 4.8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[4, 5, 4]} intensity={2.2} color="#FFFFFF" />
        <pointLight position={[-4, 3, 2]} intensity={8} color="#60A5FA" distance={10} />
        <pointLight position={[4, -3, 2]} intensity={8} color="#FB923C" distance={10} />
        <pointLight position={[0, -4, -2]} intensity={4} color="#A78BFA" distance={8} />

        <ConnectedNetwork />
      </Canvas>
    </div>
  );
}
