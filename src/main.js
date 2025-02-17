import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import vertex from "../shaders/vertex.glsl";
import fragment from "../shaders/fragment.glsl";
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';


const scene = new THREE.Scene();
// const cameraDistance = 5;
// const fov = 2 * Math.atan((window.innerHeight / 2) / cameraDistance) * (180 / Math.PI);
const camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000
);
camera.position.z = 3;
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

const controls = new OrbitControls(camera, renderer.domElement);

// Load HDRI environment map
const rgbeLoader = new RGBELoader();
rgbeLoader.load('/hdri/peppermint_powerplant_1k.hdr', (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
});


const geometry = new THREE.IcosahedronGeometry(1 , 108, 108);
const material = new CustomShaderMaterial({
    baseMaterial: THREE.MeshPhysicalMaterial,
    vertexShader: vertex,
    // fragmentShader: fragment,
    color: "red",
    roughness: 0.1,
    metalness: 1,
    // wireframe: true
});

const mergedGeometry = mergeVertices(geometry);
mergedGeometry.computeTangents()
console.log(mergedGeometry)

const blob = new THREE.Mesh(mergedGeometry, material);
scene.add(blob);

const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta(); // seconds.
    // blob.rotation.x += delta;
    // blob.rotation.y += delta;
    controls.update();
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

animate();
