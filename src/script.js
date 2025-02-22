import * as THREE from 'three'
import GUI from 'lil-gui'

import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import { Text } from 'troika-three-text'

import CustomShaderMaterial from 'three-custom-shader-material/vanilla'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

import blobVertex from '../shaders/vertex.glsl'
import textVertex from '../shaders/textVertex.glsl'

import gsap from 'gsap'

// const blobs = [
//     {
//         name: 'Color Fusion',
//         background: '#9D73F7',
//         config: { "positionFrequency": 1, "strength": 0.3, "wrappedPositionFrequency": 0.5, "wrappedStrength": 0.7, "roughness": 1, "metalness": 0, "envMapIntensity": 0.5, "clearcoat": 0, "clearcoatRoughness": 0, "transmission": 0, "flatShading": false, "wireframe": false, "map": "cosmicFusion" },
//     },
//     {
//         name: 'Purple Mirror',
//         background: '#5300B1',
//         config: { "positionFrequency": 0.584, "strength": 0.276, "wrappedPositionFrequency": 0.899, "wrappedStrength": 1.266, "roughness": 0, "metalness": 1, "envMapIntensity": 2, "clearcoat": 0, "clearcoatRoughness": 0, "transmission": 0, "flatShading": false, "wireframe": false, "map": "purpleRain" },
//     },
//     {
//         name: 'Alien Goo',
//         background: '#45ACD8',
//         config: { "positionFrequency": 1.022, "strength": 0.99, "wrappedPositionFrequency": 0.378, "wrappedStrength": 0.341, "roughness": 0.292, "metalness": 0.73, "envMapIntensity": 0.86, "clearcoat": 1, "clearcoatRoughness": 0, "transmission": 0, "flatShading": false, "wireframe": false, "map": "luckyDay" },
//     },
// ]

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
            "map": "cosmic-fusion" 
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
            "map": "purple-rain" 
        },
    },
    {
        name: 'Alien Goo',
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
            "map": "lucky-day" 
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
];

const DEBUG = false
const debugObject = { copyConfig }

let currentBlob = 0
let isAnimating = false

let activeGradient = blobs[0].config.map
const activeBackground = new THREE.Color('#141518')

let loadingProgress = 0
const loadingManager = new THREE.LoadingManager()

const clock = new THREE.Clock()

const scene = new THREE.Scene()
scene.background = activeBackground
scene.visible = false

const camera = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, 0.1, 1000)
camera.position.set(0, 0, 5)
scene.add(camera)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, manager: loadingManager })
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1
renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
document.body.appendChild(renderer.domElement)

const textureLoader = new THREE.TextureLoader(loadingManager)

const gradients = {
    cd: textureLoader.load('./gradient/cd.png'),
    cosmicFusion: textureLoader.load('./gradient/cosmic-fusion.png'),
    deepOcean: textureLoader.load('./gradient/deep-ocean.png'),
    foil: textureLoader.load('./gradient/foil.png'),
    halloween: textureLoader.load('./gradient/halloween.png'),
    hologram: textureLoader.load('./gradient/hologram.png'),
    imaginarium: textureLoader.load('./gradient/imaginarium.png'),
    iridescent: textureLoader.load('./gradient/iridescent.png'),
    luckyDay: textureLoader.load('./gradient/lucky-day.png'),
    passion: textureLoader.load('./gradient/passion.png'),
    pinkFloyd: textureLoader.load('./gradient/pink-floyd.png'),
    purpleRain: textureLoader.load('./gradient/purple-rain.png'),
    rainbow: textureLoader.load('./gradient/rainbow.png'),
    sirens: textureLoader.load('./gradient/sirens.png'),
    sunsetVibes: textureLoader.load('./gradient/sunset-vibes.png'),
    synthwave: textureLoader.load('./gradient/synthwave.png'),
    white: textureLoader.load('./gradient/white.png'),
}

const uniforms = {
    uTime: { value: 0 },
    uPositionFrequency: { value: 1 },
    uTimeFrequency: { value: 0.4 },
    uStrength: { value: 0.3 },
    uWrappedPositionFrequency: { value: 0.5 },
    uWrappedTimeFrequency: { value: 0.12 },
    uWrappedStrength: { value: 0.7 },
}

const blobMaterial = new CustomShaderMaterial({
    baseMaterial: THREE.MeshPhysicalMaterial,
    vertexShader: blobVertex,
    uniforms,
    manager: loadingManager,
    color: new THREE.Color('black'),
    metalness: 1
})

const geometry = mergeVertices(new THREE.IcosahedronGeometry(1, 128))
geometry.computeTangents()

const blob = new THREE.Mesh(geometry, blobMaterial)
blob.scale.set(0, 0, 0)
scene.add(blob)

const textMaterial = new THREE.ShaderMaterial({
    fragmentShader: 'void main(){gl_FragColor = vec4(1.0);}',
    vertexShader: textVertex,
    transparent: true,
    side: THREE.DoubleSide,
    uniforms: {
        direction: { value: 1 },
        progress: { value: 0.0 },
        color: { value: new THREE.Color(0xffffff) },
        opacity: { value: 1.0 }
    },
})

const textObjects = blobs.map((blob, index) => {
    const myText = new Text()
    myText.text = blob.name
    myText.font = './font/aften_screen.woff'
    myText.anchorX = "center"
    myText.anchorY = "middle"
    myText.color = "white"
    myText.fontSize = innerWidth / 3000
    myText.letterSpacing = -0.06
    myText.position.set(0, 0, 2)
    if (index !== 0) myText.scale.set(0, 0, 0)
    myText.material = textMaterial
    myText.glyphGeometryDetail = 20
    scene.add(myText)
    return myText
})

window.addEventListener('resize', () => {
    textObjects.forEach(text => {
        text.fontSize = innerWidth / 3000
    })
    camera.aspect = innerWidth / innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(innerWidth, innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

loaderSetup()
addLights()
setupGUI()
tick()
wheelMove()

function loaderSetup() {
    const loader = document.getElementById('loader')
    loadingManager.onProgress = (_, loaded, total) => loadingProgress = (loaded / total) * 100
    loadingManager.onLoad = () => {
        gsap.to(loader, { opacity: 0, scale: 0, ease: 'expo.inOut', duration: 1, onComplete: () => loader.remove() })
        gsap.to(blob.scale, { x: 1, y: 1, z: 1, duration: 1.4 })
        gsap.to(blobMaterial.color, { r: 1, g: 1, b: 1, duration: 1.4, ease: 'power4.in' })

        const background = new THREE.Color(blobs[currentBlob].background)
        gsap.to(scene.background, { r: background.r, g: background.g, b: background.b, duration: 1.4, ease: 'expo.inOut' })

        updateBlob(blobs[currentBlob].config)
        scene.visible = true
    }
}

function addLights() {
    new RGBELoader(loadingManager).load('/hdri/peppermint_powerplants_1k.hdr', environmentMap => {
        environmentMap.mapping = THREE.EquirectangularReflectionMapping;
        blobMaterial.envMap = environmentMap;
        blobMaterial.envMapIntensity = 0.5;
    });

    createSpotLight('#0000FF', 5.00, 20, 0.22, new THREE.Vector3(1.33, -0.27, 7.13))
    createSpotLight('#FFFF00', 0.70, 9.53, 0.31, new THREE.Vector3(-2.80, -6.67, 5.73))
    createSpotLight('#7600FF', 5.00, 8.20, 1.57, new THREE.Vector3(1.33, -0.27, 7.13))
}

function createSpotLight(color, intensity, distance, angle, position, helper = false) {
    const spotLight = new THREE.SpotLight(color, intensity, distance, angle, 1, 0)
    spotLight.position.copy(position)
    scene.add(spotLight)
    if (helper) scene.add(new THREE.SpotLightHelper(spotLight, color))
    return spotLight
}

function setupGUI() {
    const gui = new GUI({ width: 325 })
    !DEBUG && gui.hide()

    gui.add(debugObject, 'copyConfig').name('Copy Config')

    const wobbleFolder = gui.addFolder('Wobble').close()
    wobbleFolder.add(uniforms.uPositionFrequency, 'value', 0, 2, 0.001).name('Position Frequency')
    wobbleFolder.add(uniforms.uTimeFrequency, 'value', 0, 2, 0.001).name('Time Frequency')
    wobbleFolder.add(uniforms.uStrength, 'value', 0, 2, 0.001).name('Strength')

    const wrappedWobbleFolder = gui.addFolder('Wrapped Wobble').close()
    wrappedWobbleFolder.add(uniforms.uWrappedPositionFrequency, 'value', 0, 2, 0.001).name('Wrapped Position Frequency')
    wrappedWobbleFolder.add(uniforms.uWrappedTimeFrequency, 'value', 0, 2, 0.001).name('Wrapped Time Frequency')
    wrappedWobbleFolder.add(uniforms.uWrappedStrength, 'value', 0, 2, 0.001).name('Wrapped Strength')

    const materialFolder = gui.addFolder('Material').close()
    materialFolder.add({ map: 'white' }, 'map', Object.keys(gradients)).name('Texture').onChange(value => {
        blobMaterial.map = gradients[value]
        activeGradient = value
        blobMaterial.needsUpdate = true
    })
    materialFolder.add(blobMaterial, 'roughness', 0, 1, 0.001).name('Roughness')
    materialFolder.add(blobMaterial, 'metalness', 0, 1, 0.001).name('Metalness')
    materialFolder.add(blobMaterial, 'envMapIntensity', 0, 2, 0.001).name('Env Map')
    materialFolder.add(blobMaterial, 'clearcoat', 0, 1, 0.001).name('Clearcoat')
    materialFolder.add(blobMaterial, 'clearcoatRoughness', 0, 1, 0.001).name('Clearcoat Roughness')
    materialFolder.add(blobMaterial, 'transmission', 0, 1, 0.001).name('Transmission')
    materialFolder.add(blobMaterial, 'flatShading').name('Flat Shading')
    materialFolder.add(blobMaterial, 'wireframe').name('Wireframe')
}

function wheelMove() {
    window.addEventListener('wheel', (event) => {
        if (isAnimating) return
        isAnimating = true
        const direction = Math.sign(event.deltaY)
        const next = (currentBlob + direction + textObjects.length) % textObjects.length

        const updateTextUniforms = (text, dir, progress) => {
            text.material.uniforms.progress.value = progress
            text.material.uniforms.direction.value = dir
        }

        const animateText = (text, xPosition, progressValue, duration) => {
            gsap.to(text.material.uniforms.progress, { value: progressValue, duration })
            gsap.to(text.position, { x: xPosition, duration })
        }

        const nextText = textObjects[next]
        const currentText = textObjects[currentBlob]

        updateTextUniforms(nextText, direction, 0)
        nextText.position.x = direction * 3.5
        nextText.scale.set(1, 1, 1)

        updateTextUniforms(currentText, direction, 0)

        animateText(currentText, -direction * 3.5, 0.5, 1)
        animateText(nextText, 0, 0.5, 1)

        gsap.to(currentText.material.uniforms.progress, {
            value: 0.5,
            duration: 1,
            onComplete: () => isAnimating = false
        })

        gsap.to(blob.rotation, {
            y: blob.rotation.y + Math.PI * 4 * -direction,
            ease: 'expo',
            duration: 1,
        })

        gsap.to(scene.background, {
            r: new THREE.Color(blobs[next].background).r,
            g: new THREE.Color(blobs[next].background).g,
            b: new THREE.Color(blobs[next].background).b,
            duration: 1,
        })

        currentBlob = next
        updateBlob(blobs[next].config)
    })
}

function updateBlob(config) {
    const progressBar = document.querySelector('.progress-bar .progress')
    if (currentBlob === 0) gsap.fromTo(progressBar, { scaleX: 0 }, { scaleX: (currentBlob + 1) / textObjects.length, duration: 1 })
    else gsap.to(progressBar, { scaleX: (currentBlob + 1) / textObjects.length, duration: 1 })

    if (config.positionFrequency !== undefined) gsap.to(blobMaterial.uniforms.uPositionFrequency, { value: config.positionFrequency, duration: 1 })
    if (config.timeFrequency !== undefined) gsap.to(blobMaterial.uniforms.uTimeFrequency, { value: config.timeFrequency, duration: 1 })
    if (config.strength !== undefined) gsap.to(blobMaterial.uniforms.uStrength, { value: config.strength, duration: 1 })
    if (config.wrappedPositionFrequency !== undefined) gsap.to(blobMaterial.uniforms.uWrappedPositionFrequency, { value: config.wrappedPositionFrequency, duration: 1 })
    if (config.wrappedTimeFrequency !== undefined) gsap.to(blobMaterial.uniforms.uWrappedTimeFrequency, { value: config.wrappedTimeFrequency, duration: 1 })
    if (config.wrappedStrength !== undefined) gsap.to(blobMaterial.uniforms.uWrappedStrength, { value: config.wrappedStrength, duration: 1 })

    if (config.roughness !== undefined) gsap.to(blobMaterial, { roughness: config.roughness, duration: 1 })
    if (config.metalness !== undefined) gsap.to(blobMaterial, { metalness: config.metalness, duration: 1 })
    if (config.envMapIntensity !== undefined) gsap.to(blobMaterial, { envMapIntensity: config.envMapIntensity, duration: 1 })
    if (config.clearcoat !== undefined) gsap.to(blobMaterial, { clearcoat: config.clearcoat, duration: 1 })
    if (config.clearcoatRoughness !== undefined) gsap.to(blobMaterial, { clearcoatRoughness: config.clearcoatRoughness, duration: 1 })
    if (config.transmission !== undefined) gsap.to(blobMaterial, { transmission: config.transmission, duration: 1 })

    setTimeout(() => {
        if (config.flatShading !== undefined) blobMaterial.flatShading = config.flatShading
        if (config.wireframe !== undefined) blobMaterial.wireframe = config.wireframe
        if (config.map !== undefined) {
            blobMaterial.map = gradients[config.map]
            activeGradient = config.map
            blobMaterial.needsUpdate = true
        }
    }, 0.4)
}

function copyConfig() {
    const config = {
        positionFrequency: blobMaterial.uniforms.uPositionFrequency.value,
        timeFrequency: blobMaterial.uniforms.uTimeFrequency.value,
        strength: blobMaterial.uniforms.uStrength.value,
        wrappedPositionFrequency: blobMaterial.uniforms.uWrappedPositionFrequency.value,
        wrappedTimeFrequency: blobMaterial.uniforms.uWrappedTimeFrequency.value,
        wrappedStrength: blobMaterial.uniforms.uWrappedStrength.value,

        roughness: blobMaterial.roughness,
        metalness: blobMaterial.metalness,
        envMapIntensity: blobMaterial.envMapIntensity,
        clearcoat: blobMaterial.clearcoat,
        clearcoatRoughness: blobMaterial.clearcoatRoughness,
        transmission: blobMaterial.transmission,
        flatShading: blobMaterial.flatShading,
        wireframe: blobMaterial.wireframe,
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
