import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

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
renderer.setPixelRatio(window.devicePixelRatio); // Set pixel ratio for better quality

const controls = new OrbitControls(camera, renderer.domElement); // Initialize OrbitControls

const geometry = new THREE.BoxGeometry(1 , 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
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
