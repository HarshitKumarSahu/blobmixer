import * as THREE from 'three';
import vertex from "../shaders/vertex.glsl";
import fragment from "../shaders/fragment.glsl";
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { Text } from 'troika-three-text';
import textVertex from "../shaders/textVertex.glsl";
import gsap from 'gsap';

const blobs = [
    {
        name: 'Color Fusion',
        background: '#9D73F7',
        config: { 
            "uPositionFrequency": 1, 
            "uPositionStrength": 0.3, 
            "uSmallWavePositionFrequency": 0.5, 
            "uSmallWavePositionStrength": 0.7, 
            "roughness": 1, 
            "metalness": 0, 
            "envMapIntensity": 0.5, 
            "clearcoat": 0, 
            "clearcoatRoughness": 0, 
            "transmission": 0, 
            "flatShading": false, 
            "wireframe": false, 
            "map": "cosmicFusion" 
        },
    },
    {
        name: 'Purple Mirror',
        background: '#5300B1',
        config: { 
            "uPositionFrequency": 0.584, 
            "uPositionStrength": 0.276, 
            "uSmallWavePositionFrequency": 0.899, 
            "uSmallWavePositionStrength": 1.266, 
            "roughness": 0, 
            "metalness": 1, 
            "envMapIntensity": 2, 
            "clearcoat": 0, 
            "clearcoatRoughness": 0, 
            "transmission": 0, 
            "flatShading": false, 
            "wireframe": false, 
            "map": "purpleRain" 
        },
    },
    {
        name: 'Nebula Gooey',
        background: '#45ACD8',
        config: { 
            "uPositionFrequency": 1.022, 
            "uPositionStrength": 0.99, 
            "uSmallWavePositionFrequency": 0.378, 
            "uSmallWavePositionStrength": 0.341, 
            "roughness": 0.292, 
            "metalness": 0.73, 
            "envMapIntensity": 0.86, 
            "clearcoat": 1, 
            "clearcoatRoughness": 0, 
            "transmission": 0, 
            "flatShading": false, 
            "wireframe": false, 
            "map": "luckyDay" 
        },
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
            "clearcoat": 1, 
            "clearcoatRoughness": 0.5, 
            "transmission": 0, 
            "flatShading": true, 
            "wireframe": false, 
            "map": "rainBow" 
        },
    },
    {
        name: 'Plasma Matrix',
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
            "map": "blackBloom"
        },
    },
];

const loadingManager = new THREE.LoadingManager();
const rgbeLoader = new RGBELoader(loadingManager);
const textureLoader = new THREE.TextureLoader(loadingManager);

const DEBUG = false
const debugObject = { copyConfig }

let isAnimating = false;
let currentIndex = 0;

let activeGradient = blobs[0].config.map
const activeBackground = new THREE.Color('#222')

let loadingProgress = 0


const scene = new THREE.Scene();
scene.background = activeBackground
scene.visible = false

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
    manager: loadingManager
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputEncoding = THREE.sRGBEncoding;

const gradients = {
    cosmicFusion: textureLoader.load('./gradient/cosmicFusion.png'),
    imaginarium: textureLoader.load('./gradient/imaginarium.png'),
    luckyDay: textureLoader.load('./gradient/luckyDay.png'),
    passion: textureLoader.load('./gradient/passion.png'),
    purpleRain: textureLoader.load('./gradient/purpleRain.png'),
    rainBow: textureLoader.load('./gradient/rainBow.png'),
    blackBloom: textureLoader.load('./gradient/blackBloom.png')
}

const uniforms = {
    uTime: { value: 1 },
    uPositionFrequency: { value: blobs[currentIndex].config.uPositionFrequency },
    uPositionStrength: { value: blobs[currentIndex].config.uPositionStrength },
    uTimeFrequency: { value: 0.3 },
    uSmallWavePositionFrequency: { value: blobs[currentIndex].config.uSmallWavePositionFrequency },
    uSmallWavePositionStrength: { value: blobs[currentIndex].config.uSmallWavePositionStrength },
    uSmallWaveTimeFrequency: { value: 0.3 },
    roughness: { value: blobs[currentIndex].config.roughness },
    metalness: { value: blobs[currentIndex].config.metalness },
    envMapIntensity: { value: blobs[currentIndex].config.envMapIntensity },
    clearcoat: { value: blobs[currentIndex].config.clearcoat },
    clearcoatRoughness: { value: blobs[currentIndex].config.clearcoatRoughness },
    transmission: { value: blobs[currentIndex].config.transmission },
    flatShading: { value: blobs[currentIndex].config.flatShading },
    wireframe: { value: blobs[currentIndex].config.wireframe },
};

const texture = textureLoader.load(`./gradient/${blobs[currentIndex].config.map}.png`);
texture.minFilter = THREE.LinearMipMapLinearFilter; 
texture.magFilter = THREE.LinearFilter;
texture.colorSpace = THREE.SRGBColorSpace;

// const geometry = new THREE.IcosahedronGeometry(1.07, 108);

const geometry = new THREE.IcosahedronGeometry(window.innerWidth < 600 ? 0.7 : 1.07, 108);
const material = new CustomShaderMaterial({
    baseMaterial: THREE.MeshPhysicalMaterial,
    vertexShader: vertex,
    uniforms,
    map: texture,
    metalness: blobs[currentIndex].config.metalness,
    roughness: blobs[currentIndex].config.roughness,
    envMapIntensity: blobs[currentIndex].config.envMapIntensity,
    clearcoat: blobs[currentIndex].config.clearcoat,
    clearcoatRoughness: blobs[currentIndex].config.clearcoatRoughness,
    transmission: blobs[currentIndex].config.transmission,
    flatShading: blobs[currentIndex].config.flatShading,
    wireframe: blobs[currentIndex].config.wireframe
});

const mergedGeometry = mergeVertices(geometry);
mergedGeometry.computeTangents();

const blob = new THREE.Mesh(mergedGeometry, material);
blob.scale.set(0, 0, 0);

if (window.innerWidth < 600) {
    blob.position.set(0, -0.35, 0);
} else {
    blob.position.set(0, 0, 0); // Default position
}
// blob.position.set(0,0,0)
scene.add(blob);

const clock = new THREE.Clock();

const textMaterial = new THREE.ShaderMaterial({
    vertexShader: textVertex,
    fragmentShader: `void main() { gl_FragColor = vec4(1.0); }`,
    side: THREE.DoubleSide,
    uniforms: {
        direction: { value: 1 },
        progress: { value: 0.0 },
        color: { value: new THREE.Color(0xffffff) },
        opacity: { value: 1.0 }
    }
});

const texts = blobs.map((blob, index) => {
    const myText = new Text();
    myText.text = blob.name;
    myText.font = `./font/aften_screen.woff`;
    myText.anchorX = "center";
    myText.anchorY = "middle";
    myText.material = textMaterial;
    myText.position.set(0, window.innerWidth < 600 ? 0.35 : 0, 2);
    // myText.position.set(0, 0, 2);
    if (index !== 0) myText.scale.set(0, 0, 0); 
    myText.letterSpacing = -0.06;
    myText.fontSize = window.innerWidth / 4000;
    myText.fontWeight = 'bold';
    myText.glyphGeometryDetail = 30;

    gsap.delayedCall(1, () => {
        myText.sync();
    });

    scene.add(myText);
    return myText;
});

window.addEventListener('resize', () => {
    texts.forEach(text => {
        text.fontSize = innerWidth / 3000
    })
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

loaderSetup()
addLights()
tick()
wheelMove()

function loaderSetup() {
    const loader = document.getElementById('loader')
    loadingManager.onProgress = (_, loaded, total) => loadingProgress = (loaded / total) * 100
    loadingManager.onLoad = () => {
        gsap.to(loader, { opacity: 0, scale: 0, ease: 'expo.inOut', duration: 1, onComplete: () => loader.remove() })
        gsap.to(blob.scale, { x: 1, y: 1, z: 1, duration: 2 })
        gsap.to(material.color, { r: 1, g: 1, b: 1, duration: 2, ease: 'power4.in' })

        const background = new THREE.Color(blobs[currentIndex].background)
        gsap.to(scene.background, { r: background.r, g: background.g, b: background.b, duration: 2, ease: 'expo.inOut' })

        updateBlob(blobs[currentIndex].config)
        scene.visible = true
    }
}

function addLights() {
    new RGBELoader(loadingManager).load('/hdri/peppermint_powerplants_1k.hdr', environmentMap => {
        environmentMap.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = environmentMap;
        
    });
}



// function wheelMove() {
//     window.addEventListener('wheel', (event) => {
//         if (isAnimating) return
//         isAnimating = true
//         const direction = Math.sign(event.deltaY)
//         const next = (currentIndex + direction + texts.length) % texts.length

//         const updateTextUniforms = (text, dir, progress) => {
//             text.material.uniforms.progress.value = progress
//             text.material.uniforms.direction.value = dir
//         }

//         const animateText = (text, xPosition, progressValue, duration) => {
//             gsap.to(text.material.uniforms.progress, { value: progressValue, duration })
//             gsap.to(text.position, { x: xPosition, duration })
//         }

//         const nextText = texts[next]
//         const currentText = texts[currentIndex]

//         updateTextUniforms(nextText, direction, 0)
//         nextText.position.x = direction * 3.5
//         nextText.scale.set(1, 1, 1)

//         updateTextUniforms(currentText, direction, 0)

//         animateText(currentText, -direction * 3.5, 0.5, 1)
//         animateText(nextText, 0, 0.5, 1)

//         gsap.to(textMaterial.uniforms.progress, {
//             value: 0.5,
//             duration: 1,
//             onComplete: () => isAnimating = false
//         })

//         gsap.to(blob.rotation, {
//             y: blob.rotation.y + Math.PI * 4 * -direction,
//             ease: 'expo',
//             duration: 1,
//         })
//         gsap.to(scene.background, {
//             r: new THREE.Color(blobs[next].background).r,
//             g: new THREE.Color(blobs[next].background).g,
//             b: new THREE.Color(blobs[next].background).b,
//             duration: 1,
//         })

//         currentIndex = next
//         updateBlob(blobs[next].config)
//     })
// }

function wheelMove() {
    let touchStartY = 0;
    let touchEndY = 0;

    function handleWheel(event) {
        if (isAnimating) return;
        isAnimating = true;

        const direction = Math.sign(event.deltaY);
        animateScene(direction);
    }

    function handleTouchStart(event) {
        touchStartY = event.touches[0].clientY;
    }

    function handleTouchMove(event) {
        if (isAnimating) return;

        touchEndY = event.touches[0].clientY;
        const deltaY = touchStartY - touchEndY;

        if (Math.abs(deltaY) > 50) { // Sensitivity threshold
            const direction = Math.sign(deltaY);
            isAnimating = true;
            animateScene(direction);
            touchStartY = touchEndY; // Reset touch position
        }
    }

    function animateScene(direction) {
        const next = (currentIndex + direction + texts.length) % texts.length;

        const updateTextUniforms = (text, dir, progress) => {
            text.material.uniforms.progress.value = progress;
            text.material.uniforms.direction.value = dir;
        };

        const animateText = (text, xPosition, progressValue, duration) => {
            gsap.to(text.material.uniforms.progress, { value: progressValue, duration });
            gsap.to(text.position, { x: xPosition, duration });
        };

        const nextText = texts[next];
        const currentText = texts[currentIndex];

        updateTextUniforms(nextText, direction, 0);
        nextText.position.x = direction * 3.5;
        nextText.scale.set(1, 1, 1);

        updateTextUniforms(currentText, direction, 0);

        animateText(currentText, -direction * 3.5, 0.5, 1);
        animateText(nextText, 0, 0.5, 1);

        gsap.to(textMaterial.uniforms.progress, {
            value: 0.5,
            duration: 1,
            onComplete: () => isAnimating = false
        });

        gsap.to(blob.rotation, {
            y: blob.rotation.y + Math.PI * 4 * -direction,
            ease: 'expo',
            duration: 1,
        });

        gsap.to(scene.background, {
            r: new THREE.Color(blobs[next].background).r,
            g: new THREE.Color(blobs[next].background).g,
            b: new THREE.Color(blobs[next].background).b,
            duration: 1,
        });

        currentIndex = next;
        updateBlob(blobs[next].config);
    }

    // Event listeners for desktop and mobile
    window.addEventListener('wheel', handleWheel);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
}

function updateBlob(config) {
    const progressBar = document.querySelector('.progress-bar .progress')
    if (currentIndex === 0) gsap.fromTo(progressBar, { scaleX: 0 }, { scaleX: (currentIndex + 1) / texts.length, duration: 1 })
    else gsap.to(progressBar, { scaleX: (currentIndex + 1) / texts.length, duration: 1 })

    if (config.uPositionFrequency !== undefined) gsap.to(material.uniforms.uPositionFrequency, { value: config.uPositionFrequency, duration: 1, ease: 'power2.inOut' });
    if (config.uPositionStrength !== undefined) gsap.to(material.uniforms.uPositionStrength, { value: config.uPositionStrength, duration: 1, ease: 'power2.inOut' });
    if (config.uSmallWavePositionFrequency !== undefined) gsap.to(material.uniforms.uSmallWavePositionFrequency, { value: config.uSmallWavePositionFrequency, duration: 1, ease: 'power2.inOut' });
    if (config.uSmallWavePositionStrength !== undefined) gsap.to(material.uniforms.uSmallWavePositionStrength, { value: config.uSmallWavePositionStrength, duration: 1, ease: 'power2.inOut' });
    if (config.uSmallWaveTimeFrequency !== undefined) gsap.to(material.uniforms.uSmallWaveTimeFrequency, { value: config.uSmallWaveTimeFrequency, duration: 1, ease: 'power2.inOut' });
    if (config.roughness !== undefined) gsap.to(material, { roughness: config.roughness, duration: 1, ease: 'power2.inOut' });
    if (config.metalness !== undefined) gsap.to(material, { metalness: config.metalness, duration: 1, ease: 'power2.inOut' });
    if (config.envMapIntensity !== undefined) gsap.to(material, { envMapIntensity: config.envMapIntensity, duration: 1, ease: 'power2.inOut' });
    if (config.clearcoat !== undefined) gsap.to(material, { clearcoat: config.clearcoat, duration: 1, ease: 'power2.inOut' });
    if (config.clearcoatRoughness !== undefined) gsap.to(material, { clearcoatRoughness: config.clearcoatRoughness, duration: 1, ease: 'power2.inOut' });
    if (config.transmission !== undefined) gsap.to(material, { transmission: config.transmission, duration: 1, ease: 'power2.inOut' });
    if (config.flatShading !== undefined) gsap.to(material, { flatShading: config.flatShading, duration: 1, ease: 'power2.inOut' });
    if (config.wireframe !== undefined) gsap.to(material, { wireframe: config.wireframe, duration: 1, ease: 'power2.inOut' });

    setTimeout(() => {
        // if (config.flatShading !== undefined) material.flatShading = config.flatShading
        // if (config.wireframe !== undefined) material.wireframe = config.wireframe
        if (config.map !== undefined) {
            material.map = gradients[config.map]
            activeGradient = config.map
            material.needsUpdate = true
        }
    }, 0.4)
}
function copyConfig() {
    const config = {
        positionFrequency: material.uniforms.uPositionFrequency.value,
        timeFrequency: material.uniforms.uTimeFrequency.value,
        strength: material.uniforms.uPositionStrength.value,
        wrappedPositionFrequency: material.uniforms.uSmallWavePositionFrequency.value,
        wrappedTimeFrequency: material.uniforms.uSmallWaveTimeFrequency.value,
        wrappedStrength: material.uniforms.uSmallWavePositionStrength.value,

        roughness: material.roughness,
        metalness: material.metalness,
        envMapIntensity: material.envMapIntensity,
        clearcoat: material.clearcoat,
        clearcoatRoughness: material.clearcoatRoughness,
        transmission: material.transmission,
        flatShading: material.flatShading,
        wireframe: material.wireframe,
        map: activeGradient,
    }

    navigator.clipboard.writeText(JSON.stringify(config))
}

function tick() {
    uniforms.uTime.value += clock.getDelta()
    renderer.render(scene, camera)

    const loader = document.querySelector('#loader p')
    if (loader) loader.innerText = `Loading: ${Math.round(loadingProgress)}%`

    window.requestAnimationFrame(tick)
}