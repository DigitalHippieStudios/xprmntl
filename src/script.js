import './style.css'
import * as THREE from 'three'
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

//texture loader
const loader = new THREE.TextureLoader();
const star = loader.load('./one-star-alpha-white.png');
const normalTexture = loader.load('./textures/terrain/NormalMap.png');

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
//const geometry = new THREE.TorusGeometry(.7, .2, 16, 100);
const geometry = new THREE.SphereBufferGeometry(.5, 64, 64);

const particlesGeo = new THREE.BufferGeometry;
const particlesCnt = 5000; //no. of particles

const posArray = new Float32Array(particlesCnt * 3);

//set random position
for (let x = 0; x < particlesCnt * 3; x++) {
    posArray[x] = (Math.random() - 0.5) * 8;
}



particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// Materials

// const material = new THREE.PointsMaterial({  
//     size:0.0005,

// })

const material = new THREE.MeshStandardMaterial({
    metalness: 0.7,
    roughness: 0.2,
    color: '#24242a',
    normalMap: normalTexture,
})

//stars
const partMaterial = new THREE.PointsMaterial({
    size: 0.08,
    map: star,
    transparent: true
})

//material.color = new THREE.Color(0xff0000)

// Mesh with points
const sphere = new THREE.Mesh(geometry, material);
const partMesh = new THREE.Points(particlesGeo, partMaterial)
scene.add(sphere, partMesh)

// Lights
//backlight
const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
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
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    //alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(new THREE.Color('#21282a'), 1);

//mouse

document.addEventListener('mousemove', animateParticles);

let mouseY = 100;
let mouseX = 100;

function animateParticles(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
}


/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () => {

    const elapsedTime = clock.getElapsedTime();


    // Update objects
    sphere.rotation.y = elapsedTime * 0.318;
    partMesh.rotation.y = -0.01;

    partMesh.rotation.x = mouseY * (elapsedTime * 0.0002);
    partMesh.rotation.y = mouseX * (elapsedTime * -0.0005);



    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()