import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import vertex from "../shaders/vertex.glsl";
import fragment from "../shaders/fragment.glsl";
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'; // Import RGBELoader

const scene = new THREE.Scene();
// const cameraDistance = 5;
// const fov = 2 * Math.atan((window.innerHeight / 2) / cameraDistance) * (180 / Math.PI);
const camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000
);
camera.position.z = 5;
// camera.position.z = cameraDistance;

const renderer = new THREE.WebGLRenderer({ 
    canvas: document.querySelector('.canvas'),
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputEncoding = THREE.sRGBEncoding

const controls = new OrbitControls(camera, renderer.domElement); // Initialize OrbitControls

// Load HDRI environment map
const rgbeLoader = new RGBELoader();
rgbeLoader.load('/hdri/peppermint_powerplant_1k.hdr', (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    // scene.background = texture; // Set the background
    scene.environment = texture; // Set the environment
});

const geometry = new THREE.SphereGeometry(1 , 100, 100);
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const material = new THREE.ShaderMaterial({ 
    vertexShader: vertex,
    fragmentShader: fragment
 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Create a clock to track elapsed time
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta(); // seconds.
    cube.rotation.x += delta;
    cube.rotation.y += delta;
    controls.update(); // Update controls
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

animate();
