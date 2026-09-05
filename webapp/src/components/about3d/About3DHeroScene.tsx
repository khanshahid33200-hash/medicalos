import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function About3DHeroScene() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return
    const container = mountRef.current

    // Scene & Camera
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    )
    camera.position.z = 6.5
    camera.position.y = 0.2

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    container.appendChild(renderer.domElement)

    // Central Floating Glass Core Cube (MedTech Brand Center)
    const coreGeometry = new THREE.BoxGeometry(1.6, 1.6, 1.6)
    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: '#2563EB',
      metalness: 0.15,
      roughness: 0.15,
      transmission: 0.7,
      thickness: 1.2,
      transparent: true,
      opacity: 0.85,
      reflectivity: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    })
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial)
    scene.add(coreMesh)

    // Inner glowing diamond
    const innerGeometry = new THREE.OctahedronGeometry(0.8)
    const innerMaterial = new THREE.MeshStandardMaterial({
      color: '#FF6B2C',
      emissive: '#FF6B2C',
      emissiveIntensity: 0.8,
      roughness: 0.2,
      wireframe: true,
    })
    const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial)
    scene.add(innerMesh)

    // Orbiting Orange Nodes (Patients) & Blue Nodes (Hospitals/Doctors)
    const nodeCount = 8
    const nodes: THREE.Mesh[] = []
    const nodeGroup = new THREE.Group()

    for (let i = 0; i < nodeCount; i++) {
      const isPatient = i % 2 === 0
      const color = isPatient ? '#FF6B2C' : '#0080E6'
      const nodeGeo = new THREE.SphereGeometry(isPatient ? 0.22 : 0.28, 24, 24)
      const nodeMat = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.9,
        roughness: 0.3,
      })
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat)

      const angle = (i / nodeCount) * Math.PI * 2
      const radius = 3.2 + (i % 3) * 0.4
      nodeMesh.position.set(
        Math.cos(angle) * radius,
        (Math.sin(angle * 2) * 1.2),
        Math.sin(angle) * radius * 0.8
      )
      nodeMesh.userData = { angle, radius, speed: 0.4 + (i % 3) * 0.15, yOffset: nodeMesh.position.y }
      nodes.push(nodeMesh)
      nodeGroup.add(nodeMesh)
    }
    scene.add(nodeGroup)

    // Animated Connection Lines between core and orbiting nodes
    const lineMaterial = new THREE.LineBasicMaterial({
      color: '#60A5FA',
      transparent: true,
      opacity: 0.4,
    })
    const lineGeometries: THREE.BufferGeometry[] = []
    const lineMeshes: THREE.Line[] = []

    nodes.forEach(node => {
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        node.position,
      ])
      const lineMesh = new THREE.Line(lineGeo, lineMaterial)
      lineGeometries.push(lineGeo)
      lineMeshes.push(lineMesh)
      scene.add(lineMesh)
    })

    // Lighting
    const ambientLight = new THREE.AmbientLight('#ffffff', 1.8)
    scene.add(ambientLight)

    const blueLight = new THREE.PointLight('#2563EB', 25, 25)
    blueLight.position.set(-4, 3, 4)
    scene.add(blueLight)

    const orangeLight = new THREE.PointLight('#FF6B2C', 20, 25)
    orangeLight.position.set(4, -3, 3)
    scene.add(orangeLight)

    const topWhiteLight = new THREE.DirectionalLight('#ffffff', 2)
    topWhiteLight.position.set(0, 8, 6)
    scene.add(topWhiteLight)

    // Mouse Interaction
    let mouseX = 0
    let mouseY = 0
    let targetX = 0
    let targetY = 0

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    // Animation Loop
    const clock = new THREE.Clock()
    let animationId: number

    function animate() {
      animationId = requestAnimationFrame(animate)
      const time = clock.getElapsedTime()

      // Smooth mouse follow
      targetX += (mouseX - targetX) * 0.04
      targetY += (mouseY - targetY) * 0.04

      // Central core rotations & floating physics
      coreMesh.rotation.x = time * 0.2 + targetY * 0.4
      coreMesh.rotation.y = time * 0.3 + targetX * 0.5
      coreMesh.position.y = Math.sin(time * 0.9) * 0.25

      innerMesh.rotation.x = -time * 0.4
      innerMesh.rotation.y = time * 0.5
      innerMesh.position.y = coreMesh.position.y

      // Orbiting nodes position updates
      nodes.forEach((node, idx) => {
        const { angle, radius, speed, yOffset } = node.userData
        const currentAngle = angle + time * speed * 0.3
        const x = Math.cos(currentAngle) * radius
        const z = Math.sin(currentAngle) * radius * 0.7
        const y = yOffset + Math.sin(time * 1.5 + idx) * 0.4
        node.position.set(x, y, z)

        // Update connection line
        const positions = lineGeometries[idx].attributes.position as THREE.BufferAttribute
        positions.setXYZ(0, coreMesh.position.x, coreMesh.position.y, coreMesh.position.z)
        positions.setXYZ(1, x, y, z)
        positions.needsUpdate = true
      })

      // Parallax scene tilt
      scene.rotation.y = targetX * 0.15
      scene.rotation.x = targetY * 0.1

      renderer.render(scene, camera)
    }

    animate()

    // Resize Handler
    const handleResize = () => {
      if (!mountRef.current) return
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)

      coreGeometry.dispose()
      coreMaterial.dispose()
      innerGeometry.dispose()
      innerMaterial.dispose()
      lineMaterial.dispose()
      lineGeometries.forEach(g => g.dispose())
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
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
    />
  )
}
