import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function About3DMissionSphere() {
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
    camera.position.z = 5.5

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(renderer.domElement)

    // Particle Sphere Geometry
    const particleCount = 280
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    const colorBlue = new THREE.Color('#2563EB')
    const colorOrange = new THREE.Color('#FF6B2C')

    for (let i = 0; i < particleCount; i++) {
      // Golden spiral distribution on sphere surface
      const phi = Math.acos(-1 + (2 * i) / particleCount)
      const theta = Math.sqrt(particleCount * Math.PI) * phi
      const radius = 2.2 + (Math.random() - 0.5) * 0.3

      const x = radius * Math.cos(theta) * Math.sin(phi)
      const y = radius * Math.sin(theta) * Math.sin(phi)
      const z = radius * Math.cos(phi)

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      const mixedColor = i % 2 === 0 ? colorBlue : colorOrange
      colors[i * 3] = mixedColor.r
      colors[i * 3 + 1] = mixedColor.g
      colors[i * 3 + 2] = mixedColor.b
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    // Particle Material
    const material = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    })

    const pointCloud = new THREE.Points(geometry, material)
    scene.add(pointCloud)

    // Inner wireframe sphere
    const wireGeo = new THREE.IcosahedronGeometry(1.8, 2)
    const wireMat = new THREE.MeshBasicMaterial({
      color: '#60A5FA',
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    })
    const wireMesh = new THREE.Mesh(wireGeo, wireMat)
    scene.add(wireMesh)

    // Lighting
    const ambientLight = new THREE.AmbientLight('#ffffff', 1.5)
    scene.add(ambientLight)

    const clock = new THREE.Clock()
    let animationId: number

    function animate() {
      animationId = requestAnimationFrame(animate)
      const time = clock.getElapsedTime()

      pointCloud.rotation.y = time * 0.15
      pointCloud.rotation.x = Math.sin(time * 0.2) * 0.1
      pointCloud.position.y = Math.sin(time * 0.8) * 0.15

      wireMesh.rotation.y = -time * 0.1
      wireMesh.rotation.z = time * 0.08
      wireMesh.position.y = pointCloud.position.y

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
      geometry.dispose()
      material.dispose()
      wireGeo.dispose()
      wireMat.dispose()
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
      className="absolute inset-0 pointer-events-none z-0 opacity-45 overflow-hidden"
    />
  )
}
