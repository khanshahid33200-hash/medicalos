import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function About3DStoryScene() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return
    const container = mountRef.current

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    )
    camera.position.z = 7

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(renderer.domElement)

    // 3 Floating Glass Panels
    const panels: THREE.Mesh[] = []
    const panelConfigs = [
      { color: '#FF6B2C', x: -2.4, y: 1.2, rotZ: 0.1 },
      { color: '#2563EB', x: 0, y: -0.2, rotZ: -0.05 },
      { color: '#10B981', x: 2.4, y: 1.0, rotZ: 0.08 },
    ]

    const panelGeo = new THREE.BoxGeometry(1.6, 2.2, 0.15)

    panelConfigs.forEach((cfg, idx) => {
      const mat = new THREE.MeshPhysicalMaterial({
        color: cfg.color,
        transmission: 0.6,
        opacity: 0.8,
        transparent: true,
        roughness: 0.2,
        metalness: 0.1,
        clearcoat: 1.0,
      })
      const mesh = new THREE.Mesh(panelGeo, mat)
      mesh.position.set(cfg.x, cfg.y, 0)
      mesh.rotation.set(0.1, idx * 0.2, cfg.rotZ)
      panels.push(mesh)
      scene.add(mesh)
    })

    // Connecting beam spline
    const curve = new THREE.CatmullRomCurve3([
      panels[0].position,
      panels[1].position,
      panels[2].position,
    ])
    const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.04, 8, false)
    const tubeMat = new THREE.MeshBasicMaterial({
      color: '#60A5FA',
      transparent: true,
      opacity: 0.5,
    })
    const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat)
    scene.add(tubeMesh)

    // Lights
    const ambientLight = new THREE.AmbientLight('#ffffff', 1.8)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight('#2563EB', 20, 20)
    pointLight.position.set(0, 3, 5)
    scene.add(pointLight)

    const orangeLight = new THREE.PointLight('#FF6B2C', 15, 20)
    orangeLight.position.set(-3, -2, 4)
    scene.add(orangeLight)

    const clock = new THREE.Clock()
    let animationId: number

    function animate() {
      animationId = requestAnimationFrame(animate)
      const time = clock.getElapsedTime()

      panels.forEach((p, idx) => {
        p.position.y = panelConfigs[idx].y + Math.sin(time * 1.2 + idx * 1.5) * 0.2
        p.rotation.y = Math.sin(time * 0.8 + idx) * 0.25
        p.rotation.x = Math.cos(time * 0.7 + idx) * 0.15
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
      panelGeo.dispose()
      tubeGeo.dispose()
      tubeMat.dispose()
      panels.forEach(p => (p.material as THREE.Material).dispose())
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
