import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const particleTexture = textureLoader.load('/textures/particles/2.png')

/**
 * Particles
 */
// Geometry
const particlesGeometry = new THREE.BufferGeometry()
const count = 20000

const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)

for (let i = 0; i < count; i++) {
    positions[i] = (Math.random() - .5) * 10
    colors[i] = Math.random()
}

particlesGeometry.setAttribute(
    'position', 
    new THREE.BufferAttribute(positions, 3)
)
particlesGeometry.setAttribute(
    'color', 
    new THREE.BufferAttribute(colors, 3)
)

// Material
const particlesMaterial = new THREE.PointsMaterial()
particlesMaterial.vertexColors = true // pras cores randomizadas
particlesMaterial.size = .1
particlesMaterial.sizeAttenuation = true
// particlesMaterial.color = new THREE.Color('#FF88CC') 
particlesMaterial.transparent = true
particlesMaterial.alphaMap = particleTexture
// particlesMaterial.alphaTest = .001
// particlesMaterial.depthTest = false
particlesMaterial.depthWrite = false
particlesMaterial.blending = THREE.AdditiveBlending

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)

console.log(particles)
scene.add(particles)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // update particles
    // particles.rotation.y = elapsedTime * .3
    // particles.rotation.x = elapsedTime * .1

    particlesGeometry.attributes.position.needsUpdate = true
    for (let i = 0; i < count; i++) {
        const i3 = i * 3
        const x = particlesGeometry.attributes.position.array[i3 + 0]
        const y = particlesGeometry.attributes.position.array[i3 + 1]
        const z = particlesGeometry.attributes.position.array[i3 + 2]
        particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
        // particlesGeometry.attributes.position.array[i3 + 1]
        // particlesGeometry.attributes.position.array[i3 + 2]
    }


    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()