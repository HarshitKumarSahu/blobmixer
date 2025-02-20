import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import vertex from "../shaders/vertex.glsl";
import fragment from "../shaders/fragment.glsl";
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {Text} from 'troika-three-text';
import { GUI } from 'lil-gui'; // Import lil-gui

const loadingManager = new THREE.LoadingManager();
const rgbeLoader = new RGBELoader(loadingManager);
const textureLoader = new THREE.TextureLoader(loadingManager);

loadingManager.onStart = function (url, itemsLoaded, itemsTotal) {
    console.log(`Started loading: ${url}. Loaded ${itemsLoaded} of ${itemsTotal} files.`);
};
loadingManager.onProgress = function (url, itemsLoaded, itemsTotal) {
    console.log(`Loading: ${url}. Loaded ${itemsLoaded} of ${itemsTotal} files.`);
};
loadingManager.onError = function (url) {
    console.error(`There was an error loading ${url}`);
};

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
    // alpha:true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputEncoding = THREE.sRGBEncoding;

// const controls = new OrbitControls(camera, renderer.domElement);

// Load HDRI environment map

rgbeLoader.load('/hdri/peppermint_powerplant_1k.hdr', (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
});
// rgbeLoader.load('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_08_1k.hdr', (texture) => {
//     texture.mapping = THREE.EquirectangularReflectionMapping;
//     scene.environment = texture;
// });

const uniforms = {
    uTime: { value: 0.0 },
    uPositionFrequency: { value: 1.0 },
    uPositionStrength: { value: 1.0 },
    uTimeFrequency: { value: 1.0 },
    uSmallWavePositionFrequency: { value: 1.0 },
    uSmallWavePositionStrength: { value: 1.0 },
    uSmallWaveTimeFrequency: { value: 1.0 },
    roughness: { value: 0.1 }, // Added roughness uniform
    metalness: { value: 1.0 }   // Added metalness uniform
};

// Create GUI
const gui = new GUI();
gui.add(uniforms.uPositionFrequency, 'value', 0, 5).name('Position Frequency');
gui.add(uniforms.uPositionStrength, 'value', 0, 5).name('Position Strength');
gui.add(uniforms.uTimeFrequency, 'value', 0, 5).name('Time Frequency');
gui.add(uniforms.uSmallWavePositionFrequency, 'value', 0, 5).name('SWPositionFrequency');
gui.add(uniforms.uSmallWavePositionStrength, 'value', 0, 5).name('SWPositionStrength');
gui.add(uniforms.uSmallWaveTimeFrequency, 'value', 0, 5).name('SWTimeFrequency');
gui.add(uniforms.roughness, 'value', 0, 1).name('Roughness'); // GUI for roughness
gui.add(uniforms.metalness, 'value', 0, 1).name('Metalness'); // GUI for metalness

const texture = textureLoader.load("./gradient/14.png");
texture.minFilter = THREE.LinearMipMapLinearFilter; 
texture.magFilter = THREE.LinearFilter;
texture.colorSpace = THREE.SRGBColorSpace;

const geometry = new THREE.IcosahedronGeometry(1 , 108);
const material = new CustomShaderMaterial({
    baseMaterial: THREE.MeshPhysicalMaterial,
    vertexShader: vertex,
    uniforms,
    map :texture,
    roughness: uniforms.roughness.value, // Use uniform value for roughness
    metalness: uniforms.metalness.value ,   // Use uniform value for metalness
});

const mergedGeometry = mergeVertices(geometry);
mergedGeometry.computeTangents();

const blob = new THREE.Mesh(mergedGeometry, material);
scene.add(blob);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const clock = new THREE.Clock();

loadingManager.onLoad = function () {
    function animate() {
        requestAnimationFrame(animate);
        uniforms.uTime.value = clock.getElapsedTime();
        // controls.update();
        material.roughness = uniforms.roughness.value; // Update material roughness
        material.metalness = uniforms.metalness.value; // Update material metalness
        renderer.render(scene, camera);
    }
    animate();
    console.log('Loading complete!');
};