import { Canvas, useFrame } from "@react-three/fiber"
import { Float, Environment } from "@react-three/drei"
import * as THREE from "three"
import { useRef, useMemo } from "react"

function CrystalCore() {
  const outerMesh = useRef<THREE.Mesh>(null)
  const innerMesh = useRef<THREE.Mesh>(null)
  const ringMesh = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (outerMesh.current) {
      outerMesh.current.rotation.x = t * 0.15
      outerMesh.current.rotation.y = t * 0.22
      outerMesh.current.position.y = Math.sin(t * 0.9) * 0.12
    }
    if (innerMesh.current) {
      innerMesh.current.rotation.x = -t * 0.3
      innerMesh.current.rotation.z = t * 0.25
      innerMesh.current.position.y = Math.sin(t * 0.9) * 0.12
    }
    if (ringMesh.current) {
      ringMesh.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.5) * 0.2
      ringMesh.current.rotation.y = t * 0.4
    }
  })

  return (
    <group>
      {/* Outer Frosted Glass Gem */}
      <mesh ref={outerMesh}>
        <octahedronGeometry args={[1.35, 0]} />
        <meshPhysicalMaterial
          color="#3B82F6"
          roughness={0.1}
          metalness={0.1}
          transmission={0.88}
          thickness={1.5}
          ior={1.45}
          transparent
          opacity={0.85}
          reflectivity={0.9}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
        />
      </mesh>

      {/* Inner Glowing Cosmic Orange Core */}
      <mesh ref={innerMesh}>
        <icosahedronGeometry args={[0.65, 0]} />
        <meshStandardMaterial
          color="#FF6B2C"
          emissive="#FF6B2C"
          emissiveIntensity={1.8}
          roughness={0.2}
          wireframe
        />
      </mesh>

      {/* Orbiting Orbital Ring */}
      <mesh ref={ringMesh}>
        <torusGeometry args={[2.0, 0.02, 16, 100]} />
        <meshStandardMaterial
          color="#60A5FA"
          emissive="#3B82F6"
          emissiveIntensity={1.2}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  )
}

function FloatingBeacon({
  position,
  color,
  scale = 0.22,
  speed = 1.8,
}: {
  position: [number, number, number]
  color: string
  scale?: number
  speed?: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.getElapsedTime()
    meshRef.current.rotation.y = t * 0.8
  })

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={0.9}>
      <mesh ref={meshRef} position={position}>
        <dodecahedronGeometry args={[scale, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.5}
          roughness={0.15}
          metalness={0.3}
        />
      </mesh>
    </Float>
  )
}

function EnergyStreams() {
  const geometry = useMemo(() => {
    const points = [
      new THREE.Vector3(-2.6, 1.2, 0.4),
      new THREE.Vector3(-1.0, 0.4, -0.2),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(1.0, -0.4, 0.2),
      new THREE.Vector3(2.6, -1.2, -0.4),
    ]
    const curve = new THREE.CatmullRomCurve3(points)
    return new THREE.TubeGeometry(curve, 100, 0.02, 8, false)
  }, [])

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color="#93C5FD"
        emissive="#60A5FA"
        emissiveIntensity={1.2}
        transparent
        opacity={0.6}
      />
    </mesh>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={1.8} />
      <directionalLight position={[4, 6, 5]} intensity={2.5} color="#ffffff" />
      <pointLight position={[-4, 2, 4]} intensity={25} color="#2563EB" distance={20} />
      <pointLight position={[4, -2, 3]} intensity={20} color="#FF6B2C" distance={20} />
      <pointLight position={[0, 4, -2]} intensity={15} color="#818CF8" distance={15} />

      <Float speed={1.4} floatIntensity={0.7}>
        <CrystalCore />
      </Float>

      <EnergyStreams />

      {/* Orbiting Patient Nodes (Cosmic Orange) */}
      <FloatingBeacon position={[-2.6, 1.2, 0.4]} color="#FF6B2C" scale={0.25} speed={1.6} />
      <FloatingBeacon position={[1.8, 1.4, -0.5]} color="#FF8A4C" scale={0.18} speed={2.2} />
      <FloatingBeacon position={[0, -2.1, 0.3]} color="#FF6B2C" scale={0.16} speed={1.9} />

      {/* Orbiting Hospital & Doctor Nodes (Sapphire Blue) */}
      <FloatingBeacon position={[2.6, -1.2, -0.4]} color="#0080E6" scale={0.28} speed={1.4} />
      <FloatingBeacon position={[-1.9, -1.3, 0.2]} color="#2563EB" scale={0.2} speed={1.7} />
      <FloatingBeacon position={[0, 2.2, -0.3]} color="#3B82F6" scale={0.16} speed={2.0} />

      <Environment preset="city" />
    </>
  )
}

export default function HealthcareScene() {
  return (
    <div className="w-full h-full min-h-[460px] pointer-events-none">
      <Canvas
        camera={{
          position: [0, 0, 6.2],
          fov: 46,
        }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
