import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function About3DAICore() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return
    const container = mountRef.current

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    )
    camera.position.z = 6

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(renderer.domElement)

    // Central 3D AI Core (Torus Knot)
    const coreGeo = new THREE.TorusKnotGeometry(1.0, 0.3, 100, 16)
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: '#2563EB',
      emissive: '#1E40AF',
      emissiveIntensity: 0.4,
      metalness: 0.3,
      roughness: 0.15,
      transparent: true,
      opacity: 0.8,
      clearcoat: 1.0,
    })
    const coreMesh = new THREE.Mesh(coreGeo, coreMat)
    scene.add(coreMesh)

    // 4 Orbiting Satellites (Patient Input, Smart Processing, Doctor Guidance, Connected Workflow)
    const orbitGroup = new THREE.Group()
    const satellites: THREE.Mesh[] = []
    const satCount = 4

    for (let i = 0; i < satCount; i++) {
      const isOrange = i % 2 === 0
      const satGeo = new THREE.DodecahedronGeometry(0.25)
      const satMat = new THREE.MeshStandardMaterial({
        color: isOrange ? '#FF6B2C' : '#0080E6',
        emissive: isOrange ? '#FF6B2C' : '#0080E6',
        emissiveIntensity: 0.8,
      })
      const satMesh = new THREE.Mesh(satGeo, satMat)
      satellites.push(satMesh)
      orbitGroup.add(satMesh)
    }
    scene.add(orbitGroup)

    // Lights
    const ambientLight = new THREE.AmbientLight('#ffffff', 1.8)
    scene.add(ambientLight)

    const blueLight = new THREE.PointLight('#2563EB', 20, 20)
    blueLight.position.set(-3, 3, 4)
    scene.add(blueLight)

    const orangeLight = new THREE.PointLight('#FF6B2C', 18, 20)
    orangeLight.position.set(3, -2, 3)
    scene.add(orangeLight)

    const clock = new THREE.Clock()
    let animationId: number

    function animate() {
      animationId = requestAnimationFrame(animate)
      const time = clock.getElapsedTime()

      coreMesh.rotation.x = time * 0.3
      coreMesh.rotation.y = time * 0.4
      coreMesh.position.y = Math.sin(time * 0.8) * 0.2

      satellites.forEach((sat, i) => {
        const angle = (i / satCount) * Math.PI * 2 + time * 0.5
        const r = 2.6
        sat.position.set(Math.cos(angle) * r, Math.sin(time * 1.5 + i) * 0.4, Math.sin(angle) * r * 0.7)
        sat.rotation.x = time * 1.2
        sat.rotation.y = time * 0.8
      })

      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      if (!mountRef.current) return
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
      coreGeo.dispose()
      coreMat.dispose()
      satellites.forEach(s => {
        s.geometry.dispose()
        ;(s.material as THREE.Material).dispose()
      })
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none z-0 opacity-40 overflow-hidden"
    />
  )
}
