import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import vertex from "../shaders/vertex.glsl";
import fragment from "../shaders/fragment.glsl";
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { GUI } from 'lil-gui'; // Import lil-gui


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

const renderer = new THREE.WebGLRenderer({ 
    canvas: document.querySelector('.canvas'),
    antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputEncoding = THREE.sRGBEncoding;

const controls = new OrbitControls(camera, renderer.domElement);

// Load HDRI environment map
const rgbeLoader = new RGBELoader();
rgbeLoader.load('/hdri/peppermint_powerplant_1k.hdr', (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
});

const uniforms = {
    uTime: { value: 0.0 },
    uPositionFrequency: { value: 1.0 },
    uPositionStrength: { value: 1.0 },
    uTimeFrequency: { value: 1.0 },
    uSmallWavePositionFrequency: { value: 1.0 },
    uSmallWavePositionStrength: { value: 1.0 },
    uSmallWaveTimeFrequency: { value: 1.0 },
};

// Create GUI
// const gui = new GUI();
const gui = new GUI();
// gui.add(uniforms.uTime, 'value', 0, 10).name('Time'); 
gui.add(uniforms.uPositionFrequency, 'value', 0, 5).name('Position Frequency');
gui.add(uniforms.uPositionStrength, 'value', 0, 5).name('Position Strength');
gui.add(uniforms.uTimeFrequency, 'value', 0, 5).name('Time Frequency');
gui.add(uniforms.uSmallWavePositionFrequency, 'value', 0, 5).name('Small Wave Position Frequency');
gui.add(uniforms.uSmallWavePositionStrength, 'value', 0, 5).name('Small Wave Position Strength');
gui.add(uniforms.uSmallWaveTimeFrequency, 'value', 0, 5).name('Small Wave Time Frequency');

const geometry = new THREE.IcosahedronGeometry(1 , 108, 108);
const material = new CustomShaderMaterial({
    baseMaterial: THREE.MeshPhysicalMaterial,
    vertexShader: vertex,
    uniforms,
    color: "red",
    roughness: 0.1,
    metalness: 1,
});

const mergedGeometry = mergeVertices(geometry);
mergedGeometry.computeTangents();
// console.log(mergedGeometry);

const blob = new THREE.Mesh(mergedGeometry, material);
scene.add(blob);

const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    uniforms.uTime.value = clock.getElapsedTime();
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
