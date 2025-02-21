import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import vertex from "../shaders/vertex.glsl";
import fragment from "../shaders/fragment.glsl";
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {Text} from 'troika-three-text';
import textVertex from "../shaders/textVertex.glsl";
import gsap from 'gsap';

const loadingManager = new THREE.LoadingManager();
const rgbeLoader = new RGBELoader(loadingManager);
const textureLoader = new THREE.TextureLoader(loadingManager);

let isAnimating = false;
let currentIndex = 0;

const blobs = [
    {
        name: 'Color Fusion',
        background: '#9D73F7',
        config: { "uPositionFrequency": 1, "uPositionStrength": 0.3, "uSmallWavePositionFrequency": 0.5, "uSmallWavePositionStrength": 0.7, "roughness": 1, "metalness": 0, "envMapIntensity": 0.5, "clearcoat": 0, "clearcoatRoughness": 0, "transmission": 0, "flatShading": false, "wireframe": false, "map": "cosmic-fusion" },
    },
    {
        name: 'Purple Mirror',
        background: '#5300B1',
        config: { "uPositionFrequency": 0.584, "uPositionStrength": 0.276, "uSmallWavePositionFrequency": 0.899, "uSmallWavePositionStrength": 1.266, "roughness": 0, "metalness": 1, "envMapIntensity": 2, "clearcoat": 0, "clearcoatRoughness": 0, "transmission": 0, "flatShading": false, "wireframe": false, "map": "purple-rain" },
    },
    {
        name: 'Alien Goo',
        background: '#45ACD8',
        config: { "uPositionFrequency": 1.022, "uPositionStrength": 0.99, "uSmallWavePositionFrequency": 0.378, "uSmallWavePositionStrength": 0.341, "roughness": 0.292, "metalness": 0.73, "envMapIntensity": 0.86, "clearcoat": 1, "clearcoatRoughness": 0, "transmission": 0, "flatShading": false, "wireframe": false, "map": "lucky-day" },
    },
    {
        name: 'Liquidity',
        background: '#FDB38A',
        config: { 
            "uPositionFrequency": 1, 
            "uPositionStrength": 1, 
            "uSmallWavePositionFrequency": 2.275, 
            "uSmallWavePositionStrength": 0.06, 
            "roughness": 0.58, 
            "metalness": 1, 
            "envMapIntensity": 1, 
            "clearcoat": 0, 
            "clearcoatRoughness": 1, 
            "transmission": 1, 
            "flatShading": false, 
            "wireframe": false, 
            "map": "imaginarium" 
        },
    },
    {
        name: 'Discobrain',
        background: '#7601F0',
        config: { 
            "uPositionFrequency": 0.5, 
            "uPositionStrength": 0.575, 
            "uSmallWavePositionFrequency": 3.5, 
            "uSmallWavePositionStrength": 0.15, 
            "roughness": 0.0, 
            "metalness": 0.1, 
            "envMapIntensity": 0, 
            "clearcoat": 0.4, 
            "clearcoatRoughness": 0.5, 
            "transmission": 0.0, 
            "flatShading": false, 
            "wireframe": false, 
            "map": "rainbow" 
        },
    },
    {
    name: 'Fire Fly',
    background: '#380B16',
    config: { 
        "uPositionFrequency": 1, 
        "uPositionStrength": 1.5, 
        "uSmallWavePositionFrequency": 1, 
        "uSmallWavePositionStrength": 0.5, 
        "roughness": 1, 
        "metalness": 1, 
        "envMapIntensity": 0, 
        "clearcoat": 1, 
        "clearcoatRoughness": 0, 
        "transmission": 0, 
        "flatShading": true, 
        "wireframe": false, 
        "map": "passion" 
    },
},
    {
        name: 'Back Bloosom',
        background: '#667174',
        config: { 
            "uPositionFrequency": 0, 
            "uPositionStrength": 0, 
            "uSmallWavePositionFrequency": 1.5, 
            "uSmallWavePositionStrength": 0.7, 
            "roughness": 1, 
            "metalness": 0.0, 
            "envMapIntensity": 3, 
            "clearcoat": 1, 
            "clearcoatRoughness": 1, 
            "transmission": 1, 
            "flatShading": true, 
            "wireframe": false, 
            "map": "blackbloom"
        },
    },

]

const scene = new THREE.Scene();
scene.background = new THREE.Color("#222");
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

// rgbeLoader.load('/hdri/peppermint_powerplant_1k.hdr', (texture) => {
//     texture.mapping = THREE.EquirectangularReflectionMapping;
//     scene.environment = texture;
// });

rgbeLoader.load('/hdri/studio1k.hdr', (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
});



const uniforms = {
    uTime: { value: 1 },
    uPositionFrequency: { value: blobs[currentIndex].config.uPositionFrequency },
    uPositionStrength: { value: blobs[currentIndex].config.uPositionStrength },
    uTimeFrequency: { value: 0.3 },
    uSmallWavePositionFrequency: { value: blobs[currentIndex].config.uSmallWavePositionFrequency },
    uSmallWavePositionStrength: { value: blobs[currentIndex].config.uSmallWavePositionStrength },
    uSmallWaveTimeFrequency: { value: 0.3 },
    roughness: { value: blobs[currentIndex].config.roughness }, // Updated roughness uniform
    metalness: { value: blobs[currentIndex].config.metalness },   // Updated metalness uniform
    envMapIntensity: {value : blobs[currentIndex].config.envMapIntensity},
    clearcoat: {value : blobs[currentIndex].config.clearcoat},
    clearcoatRoughness: {value : blobs[currentIndex].config.clearcoatRoughness},
    transmission: {value : blobs[currentIndex].config.transmission},
    flatShading: {value : blobs[currentIndex].config.flatShading},
    wireframe: {value : blobs[currentIndex].config.wireframe},
};

// const gui = new GUI();
// gui.add(uniforms.uPositionFrequency, 'value', 0, 5).name('Position Frequency');
// gui.add(uniforms.uPositionStrength, 'value', 0, 5).name('Position Strength');
// gui.add(uniforms.uTimeFrequency, 'value', 0, 5).name('Time Frequency');
// gui.add(uniforms.uSmallWavePositionFrequency, 'value', 0, 5).name('SWPositionFrequency');
// gui.add(uniforms.uSmallWavePositionStrength, 'value', 0, 5).name('SWPositionStrength');
// gui.add(uniforms.uSmallWaveTimeFrequency, 'value', 0, 5).name('SWTimeFrequency');
// gui.add(uniforms.roughness, 'value', 0, 1).name('Roughness'); // GUI for roughness
// gui.add(uniforms.metalness, 'value', 0, 1).name('Metalness'); // GUI for metalness

const texture = textureLoader.load(`./gradient/${blobs[currentIndex].config.map}.png`);
texture.minFilter = THREE.LinearMipMapLinearFilter; 
texture.magFilter = THREE.LinearFilter;
texture.colorSpace = THREE.SRGBColorSpace;

const geometry = new THREE.IcosahedronGeometry(1 , 108);
const material = new CustomShaderMaterial({
    baseMaterial: THREE.MeshPhysicalMaterial,
    vertexShader: vertex,
    uniforms,
    map :texture,
    metalness: blobs[currentIndex].config.metalness,
    roughness: blobs[currentIndex].config.roughness,
    envMapIntensity: blobs[currentIndex].config.envMapIntensity,
    clearcoat: blobs[currentIndex].config.clearcoat,
    clearcoatRoughness: blobs[currentIndex].config.clearcoatRoughness,
    transmission: blobs[currentIndex].config.transmission,
    flatShading: blobs[currentIndex].config.flatShading,
    wireframe: blobs[currentIndex].config.wireframe,
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

const textureMaterial = new THREE.ShaderMaterial({
    vertexShader: textVertex,
    fragmentShader: `void main() { gl_FragColor = vec4(0.9725, 0.9725, 0.9725, 1.0); }`,
    side : THREE.DoubleSide,
    uniforms : {
        progress : { value : 0.0 },
        direction : { value : 1 }
    }
})

const texts = blobs.map((blob, index)=> {
    const myText = new Text();
    myText.text = blob.name;
    myText.font = `./font/aften_screen.woff`;
    myText.anchorX = "center";
    myText.anchorY = "middle";
    myText.material = textureMaterial;
    myText.position.set(0,0,2);
    if (index !== 0) myText.scale.set(0,0,0); 
    myText.letterSpacing = -0.07;
    myText.fontSize = window.innerWidth / 4000;
    myText.glyphGeometryDetail = 50;
    myText.sync();
    scene.add(myText);
    return myText;
})



window.addEventListener("wheel", (e) => {
    if(isAnimating) return;
    isAnimating = true;

    let direction = Math.sign(e.deltaY);
    let next = (currentIndex + direction + blobs.length) % blobs.length;

    texts[next].scale.set(1,1,1);
    texts[next].position.x = direction * 3.5;

    gsap.to(textureMaterial.uniforms.progress, {
        value : 0.5,
        duration : 1.5,
        ease : "linear",
        onComplete: ()=>{
            currentIndex = next;
            isAnimating = false;
            textureMaterial.uniforms.progress.value = 0;
        }
    })

    gsap.to(texts[currentIndex].position, {
        x : -direction * 3,
        duration : 1.5,
        ease : "power2.inOut"
    })

    gsap.to(texts[next].position, {
        x : 0,
        duration : 1.5,
        ease : "power2.inOut"
    })


    gsap.to(blob.rotation, {
        y : blob.rotation.y + Math.PI * 4 * -direction,
        duration : 1.5,
        ease : "power2.inOut"
    })

    const bg = new THREE.Color(blobs[next].background);
    gsap.to(scene.background, {
        r : bg.r,
        g : bg.g,
        b : bg.b,
        duration : 1,
        ease : "linear"
    })

    updateBlob(blobs[next].config);

    // setTimeout(() => {
    //     isAnimating = false;
    // }, 2000);
})

function updateBlob(config) {
    if (config.uPositionFrequency !== undefined) gsap.to(material.uniforms.uPositionFrequency, { value: config.uPositionFrequency, duration: 1, ease: 'power2.inOut' });
    if (config.uPositionStrength !== undefined) gsap.to(material.uniforms.uPositionStrength, { value: config.uPositionStrength, duration: 1, ease: 'power2.inOut' });
    if (config.uSmallWavePositionFrequency !== undefined) gsap.to(material.uniforms.uSmallWavePositionFrequency, { value: config.uSmallWavePositionFrequency, duration: 1, ease: 'power2.inOut' });
    if (config.uSmallWavePositionStrength !== undefined) gsap.to(material.uniforms.uSmallWavePositionStrength, { value: config.uSmallWavePositionStrength, duration: 1, ease: 'power2.inOut' });
    if (config.uSmallWaveTimeFrequency !== undefined) gsap.to(material.uniforms.uSmallWaveTimeFrequency, { value: config.uSmallWaveTimeFrequency, duration: 1, ease: 'power2.inOut' });
    if (config.map !== undefined) {
      setTimeout(() => {
        // material.map = textureLoader.load(`./gradient/${config.map}.png`);
        const newTexture = textureLoader.load(`./gradient/${config.map}.png`);
        newTexture.minFilter = THREE.LinearMipMapLinearFilter;
        newTexture.magFilter = THREE.LinearFilter;
        newTexture.colorSpace = THREE.SRGBColorSpace;
        material.map = newTexture;
      }, 400);
    }
    if (config.roughness !== undefined) gsap.to(material, { roughness: config.roughness, duration: 1, ease: 'power2.inOut' });
    if (config.metalness !== undefined) gsap.to(material, { metalness: config.metalness, duration: 1, ease: 'power2.inOut' });
    if (config.envMapIntensity !== undefined) gsap.to(material, { envMapIntensity: config.envMapIntensity, duration: 1, ease: 'power2.inOut' });
    if (config.clearcoat !== undefined) gsap.to(material, { clearcoat: config.clearcoat, duration: 1, ease: 'power2.inOut' });
    if (config.clearcoatRoughness !== undefined) gsap.to(material, { clearcoatRoughness: config.clearcoatRoughness, duration: 1, ease: 'power2.inOut' });
    if (config.transmission !== undefined) gsap.to(material, { transmission: config.transmission, duration: 1, ease: 'power2.inOut' });
    if (config.flatShading !== undefined) gsap.to(material, { flatShading: config.flatShading, duration: 1, ease: 'power2.inOut' });
    if (config.wireframe !== undefined) gsap.to(material, { wireframe: config.wireframe, duration: 1, ease: 'power2.inOut' });
  }

loadingManager.onLoad = function () {
    function animate() {
        requestAnimationFrame(animate);
        uniforms.uTime.value = clock.getElapsedTime();
        // controls.update();
        // material.roughness = uniforms.roughness.value; // Update material roughness
        // material.metalness = uniforms.metalness.value; // Update material metalness
        renderer.render(scene, camera);
    }
    const bg = new THREE.Color(blobs[currentIndex].background);
    gsap.to(scene.background, {
        r : bg.r,
        g : bg.g,
        b : bg.b,
        duration : 1,
        ease : "linear"
    })

    animate();
    console.log('Loading complete!');
};
loadingManager.onStart = function (url, itemsLoaded, itemsTotal) {
    console.log(`Started loading: ${url}. Loaded ${itemsLoaded} of ${itemsTotal} files.`);
};
loadingManager.onProgress = function (url, itemsLoaded, itemsTotal) {
    console.log(`Loading: ${url}. Loaded ${itemsLoaded} of ${itemsTotal} files.`);
};
loadingManager.onError = function (url) {
    console.error(`There was an error loading ${url}`);
};
