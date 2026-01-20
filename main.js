/**
 * COSMOS EXPLORER - Ultimate Solar System
 * FWD-style shaders for Sun AND Planets
 * Fixed camera controls, proper spiral galaxy
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ═══════════════════════════════════════════════════════════════
// PLANET DATA
// ═══════════════════════════════════════════════════════════════

const PLANETS = {
    sun: {
        name: 'THE SUN', type: 'G-TYPE MAIN SEQUENCE STAR',
        radius: 5, distance: 0, orbitSpeed: 0, rotationSpeed: 0.001,
        colors: [0xffaa00, 0xff6600, 0xff3300],
        diameter: '1,392,700 km', distanceFromSun: 'Center of Solar System',
        period: 'N/A', temp: '5,500°C surface / 15M°C core',
        moons: '8 Planets Orbit', gravity: '274 m/s²',
        fact: 'The Sun contains 99.86% of all mass in our solar system and fuses 600 million tons of hydrogen every second.'
    },
    mercury: {
        name: 'MERCURY', type: 'TERRESTRIAL PLANET',
        radius: 0.38, distance: 10, orbitSpeed: 0.047, rotationSpeed: 0.005,
        colors: [0x9a8a7a, 0x7a6a5a, 0x5a4a3a],
        diameter: '4,879 km', distanceFromSun: '57.9 million km',
        period: '88 Earth Days', temp: '-180°C to 430°C',
        moons: '0', gravity: '3.7 m/s²',
        fact: 'Mercury has the most extreme temperature swings of any planet, over 600°C between day and night.'
    },
    venus: {
        name: 'VENUS', type: 'TERRESTRIAL PLANET',
        radius: 0.95, distance: 14, orbitSpeed: 0.035, rotationSpeed: -0.002,
        colors: [0xe8b86a, 0xd4984a, 0xc47832],
        diameter: '12,104 km', distanceFromSun: '108.2 million km',
        period: '225 Earth Days', temp: '465°C (hottest planet)',
        moons: '0', gravity: '8.87 m/s²',
        fact: 'Venus rotates backwards and so slowly that a day on Venus is longer than its year.'
    },
    earth: {
        name: 'EARTH', type: 'TERRESTRIAL PLANET',
        radius: 1.0, distance: 18, orbitSpeed: 0.029, rotationSpeed: 0.01,
        colors: [0x2266aa, 0x228833, 0x44aa44],
        hasMoon: true,
        diameter: '12,742 km', distanceFromSun: '149.6 million km (1 AU)',
        period: '365.25 Days', temp: '-88°C to 58°C',
        moons: '1 (The Moon)', gravity: '9.81 m/s²',
        fact: 'Earth is the only planet known to harbor life and has the largest moon relative to its size of any rocky planet.'
    },
    mars: {
        name: 'MARS', type: 'TERRESTRIAL PLANET',
        radius: 0.53, distance: 24, orbitSpeed: 0.024, rotationSpeed: 0.009,
        colors: [0xcc6644, 0xaa4422, 0x662211],
        diameter: '6,779 km', distanceFromSun: '227.9 million km',
        period: '687 Earth Days', temp: '-87°C to -5°C',
        moons: '2 (Phobos & Deimos)', gravity: '3.71 m/s²',
        fact: 'Mars has the largest volcano (Olympus Mons) and longest canyon (Valles Marineris) in the solar system.'
    },
    jupiter: {
        name: 'JUPITER', type: 'GAS GIANT',
        radius: 2.5, distance: 34, orbitSpeed: 0.013, rotationSpeed: 0.04,
        colors: [0xd4a574, 0xc49464, 0xa47444],
        diameter: '139,820 km', distanceFromSun: '778.5 million km',
        period: '11.9 Earth Years', temp: '-110°C (cloud tops)',
        moons: '95 Known Moons', gravity: '24.79 m/s²',
        fact: "Jupiter's Great Red Spot is a storm that has raged for over 400 years and is larger than Earth."
    },
    saturn: {
        name: 'SATURN', type: 'GAS GIANT',
        radius: 2.2, distance: 44, orbitSpeed: 0.009, rotationSpeed: 0.035,
        colors: [0xead6a6, 0xd4c090, 0xc4b080],
        hasRings: true,
        diameter: '116,460 km', distanceFromSun: '1.4 billion km',
        period: '29.4 Earth Years', temp: '-140°C (cloud tops)',
        moons: '146 Known Moons', gravity: '10.44 m/s²',
        fact: "Saturn's rings extend 282,000 km from the planet but are only about 10 meters thick."
    },
    uranus: {
        name: 'URANUS', type: 'ICE GIANT',
        radius: 1.6, distance: 56, orbitSpeed: 0.006, rotationSpeed: -0.02,
        colors: [0x7ec8e3, 0x6eb8d3, 0x5ea8c3],
        diameter: '50,724 km', distanceFromSun: '2.9 billion km',
        period: '84 Earth Years', temp: '-224°C',
        moons: '28 Known Moons', gravity: '8.69 m/s²',
        fact: 'Uranus rotates on its side with an axial tilt of 98°, likely from a collision with an Earth-sized object.'
    },
    neptune: {
        name: 'NEPTUNE', type: 'ICE GIANT',
        radius: 1.5, distance: 70, orbitSpeed: 0.005, rotationSpeed: 0.02,
        colors: [0x4169e1, 0x3159d1, 0x2149c1],
        diameter: '49,244 km', distanceFromSun: '4.5 billion km',
        period: '165 Earth Years', temp: '-214°C',
        moons: '16 Known Moons', gravity: '11.15 m/s²',
        fact: 'Neptune has the strongest winds in the solar system, reaching speeds of 2,100 km/h.'
    }
};

// ═══════════════════════════════════════════════════════════════
// SHADER CODE - 4D SIMPLEX NOISE (Ashima Arts MIT)
// ═══════════════════════════════════════════════════════════════

const simplex4D = `
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
float mod289(float x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
float permute(float x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float taylorInvSqrt(float r) { return 1.79284291400159 - 0.85373472095314 * r; }

vec4 grad4(float j, vec4 ip) {
    const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
    vec4 p, s;
    p.xyz = floor(fract(vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
    p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
    s = vec4(lessThan(p, vec4(0.0)));
    p.xyz = p.xyz + (s.xyz * 2.0 - 1.0) * s.www;
    return p;
}

float snoise4(vec4 v) {
    const vec4 C = vec4(0.138196601125011, 0.276393202250021, 0.414589803375032, -0.447213595499958);
    vec4 i = floor(v + dot(v, vec4(0.309016994374947451)));
    vec4 x0 = v - i + dot(i, C.xxxx);
    vec4 i0;
    vec3 isX = step(x0.yzw, x0.xxx);
    vec3 isYZ = step(x0.zww, x0.yyz);
    i0.x = isX.x + isX.y + isX.z;
    i0.yzw = 1.0 - isX;
    i0.y += isYZ.x + isYZ.y;
    i0.zw += 1.0 - isYZ.xy;
    i0.z += isYZ.z;
    i0.w += 1.0 - isYZ.z;
    vec4 i3 = clamp(i0, 0.0, 1.0);
    vec4 i2 = clamp(i0 - 1.0, 0.0, 1.0);
    vec4 i1 = clamp(i0 - 2.0, 0.0, 1.0);
    vec4 x1 = x0 - i1 + C.xxxx;
    vec4 x2 = x0 - i2 + C.yyyy;
    vec4 x3 = x0 - i3 + C.zzzz;
    vec4 x4 = x0 + C.wwww;
    i = mod289(i);
    float j0 = permute(permute(permute(permute(i.w) + i.z) + i.y) + i.x);
    vec4 j1 = permute(permute(permute(permute(
        i.w + vec4(i1.w, i2.w, i3.w, 1.0))
        + i.z + vec4(i1.z, i2.z, i3.z, 1.0))
        + i.y + vec4(i1.y, i2.y, i3.y, 1.0))
        + i.x + vec4(i1.x, i2.x, i3.x, 1.0));
    vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0);
    vec4 p0 = grad4(j0, ip);
    vec4 p1 = grad4(j1.x, ip);
    vec4 p2 = grad4(j1.y, ip);
    vec4 p3 = grad4(j1.z, ip);
    vec4 p4 = grad4(j1.w, ip);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    p4 *= taylorInvSqrt(dot(p4, p4));
    vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
    vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)), 0.0);
    m0 = m0 * m0;
    m1 = m1 * m1;
    return 49.0 * (dot(m0*m0, vec3(dot(p0,x0), dot(p1,x1), dot(p2,x2))) + dot(m1*m1, vec2(dot(p3,x3), dot(p4,x4))));
}

float fbm4(vec4 p, int octaves) {
    float sum = 0.0;
    float amp = 0.5;
    float freq = 1.0;
    for(int i = 0; i < 6; i++) {
        if(i >= octaves) break;
        sum += amp * snoise4(p * freq);
        amp *= 0.5;
        freq *= 2.0;
    }
    return sum;
}
`;

// ═══════════════════════════════════════════════════════════════
// PERLIN CUBEMAP SHADER (for dynamic textures)
// ═══════════════════════════════════════════════════════════════

const perlinCubeVS = `
varying vec3 vWorldPos;
void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
}`;

const perlinCubeFS = `
precision highp float;
${simplex4D}

varying vec3 vWorldPos;
uniform float uTime;
uniform float uFrequency;
uniform float uContrast;

void main() {
    vec3 dir = normalize(vWorldPos);
    vec4 p = vec4(dir * uFrequency, uTime * 0.1);
    float n1 = fbm4(p, 5);
    float n2 = fbm4(p + vec4(100.0), 5);
    float brightness = n1 * uContrast + 0.5;
    gl_FragColor = vec4(brightness, n2 * uContrast + 0.5, brightness, 1.0);
}`;

// ═══════════════════════════════════════════════════════════════
// SUN SHADERS
// ═══════════════════════════════════════════════════════════════

const sunVS = `
varying vec3 vNormal;
varying vec3 vWorldPos;
varying vec3 vLayer0, vLayer1, vLayer2;
uniform float uTime;

mat2 rot2D(float a) {
    float s = sin(a), c = cos(a);
    return mat2(c, -s, s, c);
}

void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    
    // Create 3 rotating layers for noise sampling
    vec3 dir = normalize(position);
    float t = uTime * 0.05;
    
    vec3 l0 = dir;
    l0.yz = rot2D(t) * l0.yz;
    vLayer0 = l0;
    
    vec3 l1 = dir;
    l1.xz = rot2D(t * 1.3 + 2.0) * l1.xz;
    vLayer1 = l1;
    
    vec3 l2 = dir;
    l2.xy = rot2D(t * 0.7 - 1.5) * l2.xy;
    vLayer2 = l2;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const sunFS = `
precision highp float;
${simplex4D}

varying vec3 vNormal;
varying vec3 vWorldPos;
varying vec3 vLayer0, vLayer1, vLayer2;
uniform float uTime;
uniform float uBrightness;
uniform samplerCube uNoiseCube;

vec3 brightnessToColor(float b) {
    b *= 0.25;
    return vec3(b, b*b, b*b*b*b) / 0.25;
}

void main() {
    // Sample noise from cubemap at 3 different rotating angles
    float n0 = textureCube(uNoiseCube, vLayer0).r;
    float n1 = textureCube(uNoiseCube, vLayer1).r;
    float n2 = textureCube(uNoiseCube, vLayer2).r;
    
    float brightness = (n0 + n1 + n2) / 3.0;
    
    // Fresnel rim glow
    float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 1.5);
    brightness += fresnel * 0.4;
    
    // Add some variation
    float detail = fbm4(vec4(vLayer0 * 4.0, uTime * 0.02), 3) * 0.2;
    brightness += detail;
    
    vec3 color = brightnessToColor(brightness * 4.0 + 0.8) * uBrightness;
    
    gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}`;

// ═══════════════════════════════════════════════════════════════
// PLANET SHADERS (FWD-style with cubemap texturing)
// ═══════════════════════════════════════════════════════════════

const planetVS = `
varying vec3 vNormal;
varying vec3 vWorldPos;
varying vec3 vLocalPos;
varying vec2 vUv;
varying vec3 vLayer0, vLayer1;

uniform float uTime;
uniform float uRotation;

mat2 rot2D(float a) {
    float s = sin(a), c = cos(a);
    return mat2(c, -s, s, c);
}

void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vLocalPos = position;
    
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    
    // Rotating layers for texture
    vec3 dir = normalize(position);
    vLayer0 = dir;
    vLayer0.xz = rot2D(uRotation) * vLayer0.xz;
    
    vLayer1 = dir;
    vLayer1.xy = rot2D(uRotation * 0.5) * vLayer1.xy;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const planetFS = `
precision highp float;
${simplex4D}

varying vec3 vNormal;
varying vec3 vWorldPos;
varying vec3 vLocalPos;
varying vec2 vUv;
varying vec3 vLayer0, vLayer1;

uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uSunPos;
uniform float uTime;
uniform int uPlanetType;
uniform float uAtmosphere;
uniform samplerCube uNoiseCube;

void main() {
    // Lighting from sun
    vec3 lightDir = normalize(uSunPos - vWorldPos);
    float NdotL = max(dot(vNormal, lightDir), 0.0);
    float lighting = 0.08 + NdotL * 0.92;
    
    // Sample noise cubemap
    float n0 = textureCube(uNoiseCube, vLayer0).r;
    float n1 = textureCube(uNoiseCube, vLayer1).g;
    
    vec3 color;
    
    // MERCURY - Heavily cratered gray surface
    if(uPlanetType == 0) {
        float terrain = n0 * 0.6 + n1 * 0.4;
        color = mix(uColor1, uColor2, terrain);
        // Craters
        float craters = fbm4(vec4(vLocalPos * 8.0, 0.0), 4);
        float craterMask = smoothstep(0.3, 0.5, craters);
        color = mix(color, uColor3, craterMask * 0.5);
    }
    // VENUS - Thick swirling clouds
    else if(uPlanetType == 1) {
        float swirl = fbm4(vec4(vLayer0 * 3.0 + vec3(uTime * 0.02), uTime * 0.01), 5);
        float bands = sin(vUv.y * 15.0 + swirl * 3.0) * 0.5 + 0.5;
        color = mix(uColor1, uColor2, bands * 0.7 + n0 * 0.3);
        color = mix(color, uColor3, swirl * 0.3 + 0.1);
    }
    // EARTH - Continents, oceans, ice
    else if(uPlanetType == 2) {
        float continentNoise = fbm4(vec4(vLocalPos * 2.5, 0.0), 5);
        float isLand = smoothstep(-0.05, 0.1, continentNoise);
        
        vec3 ocean = uColor1 * (0.8 + n0 * 0.2);
        vec3 land = mix(uColor2, uColor3, fbm4(vec4(vLocalPos * 6.0, 0.0), 3) * 0.5 + 0.5);
        
        color = mix(ocean, land, isLand);
        
        // Ice caps
        float latitude = abs(vUv.y - 0.5) * 2.0;
        float ice = smoothstep(0.75, 0.95, latitude);
        color = mix(color, vec3(0.95, 0.97, 1.0), ice);
        
        // Clouds
        float clouds = fbm4(vec4(vLayer0 * 4.0 + vec3(uTime * 0.01), uTime * 0.02), 4);
        clouds = smoothstep(0.2, 0.6, clouds) * 0.4;
        color = mix(color, vec3(1.0), clouds);
    }
    // MARS - Rusty with dark regions and ice caps
    else if(uPlanetType == 3) {
        float terrain = n0 * 0.7 + n1 * 0.3;
        color = mix(uColor1, uColor2, terrain);
        
        // Dark volcanic regions
        float dark = fbm4(vec4(vLocalPos * 2.0, 0.0), 4);
        color = mix(color, uColor3, smoothstep(0.3, 0.6, dark) * 0.4);
        
        // Polar ice
        float latitude = abs(vUv.y - 0.5) * 2.0;
        color = mix(color, vec3(1.0, 0.98, 0.95), smoothstep(0.85, 0.98, latitude));
    }
    // JUPITER - Bands and Great Red Spot
    else if(uPlanetType == 4) {
        float bandNoise = fbm4(vec4(vLocalPos * vec3(1.0, 0.2, 1.0) * 2.0, uTime * 0.005), 3);
        float bands = sin(vUv.y * 30.0 + bandNoise * 4.0) * 0.5 + 0.5;
        color = mix(uColor1, uColor2, bands);
        
        // Storms
        float storms = fbm4(vec4(vLayer0 * 5.0, uTime * 0.01), 4);
        color = mix(color, uColor3, storms * 0.2);
        
        // Great Red Spot
        vec2 spotCenter = vec2(0.65, 0.55);
        float spotDist = length((vUv - spotCenter) * vec2(2.5, 4.0));
        float spot = 1.0 - smoothstep(0.04, 0.12, spotDist);
        color = mix(color, vec3(0.85, 0.4, 0.3), spot * 0.8);
    }
    // SATURN - Subtle bands
    else if(uPlanetType == 5) {
        float bandNoise = fbm4(vec4(vLocalPos * vec3(1.0, 0.3, 1.0), 0.0), 2);
        float bands = sin(vUv.y * 20.0 + bandNoise * 2.0) * 0.5 + 0.5;
        color = mix(uColor1, uColor2, bands * 0.6 + n0 * 0.2);
        color = mix(color, uColor3, n1 * 0.15);
    }
    // URANUS - Smooth with subtle features
    else if(uPlanetType == 6) {
        float features = n0 * 0.3 + 0.5;
        color = mix(uColor1, uColor2, features);
        float haze = fbm4(vec4(vLayer0 * 2.0, uTime * 0.005), 3);
        color = mix(color, uColor3, haze * 0.15);
    }
    // NEPTUNE - Deep blue with bright storm features
    else if(uPlanetType == 7) {
        float storms = fbm4(vec4(vLayer0 * 3.0, uTime * 0.01), 5);
        color = mix(uColor1, uColor2, n0 * 0.4 + 0.3);
        
        // Bright storm bands
        float bright = fbm4(vec4(vLocalPos * 5.0, uTime * 0.02), 3);
        color = mix(color, uColor3, smoothstep(0.4, 0.7, bright) * 0.3);
    }
    else {
        color = uColor1;
    }
    
    // Apply lighting
    color *= lighting;
    
    // Atmospheric rim glow
    if(uAtmosphere > 0.0) {
        float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);
        vec3 atmoColor = mix(uColor2, vec3(0.6, 0.8, 1.0), 0.5);
        color = mix(color, atmoColor * 1.5, fresnel * uAtmosphere * 0.5);
    }
    
    gl_FragColor = vec4(color, 1.0);
}`;

// ═══════════════════════════════════════════════════════════════
// GLOW SHADER
// ═══════════════════════════════════════════════════════════════

const glowVS = `
varying vec3 vNormal;
void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const glowFS = `
precision highp float;
uniform vec3 uColor;
uniform float uIntensity;
uniform float uPower;
varying vec3 vNormal;

void main() {
    float intensity = pow(uIntensity - dot(vNormal, vec3(0.0, 0.0, 1.0)), uPower);
    intensity = clamp(intensity, 0.0, 1.0);
    gl_FragColor = vec4(uColor * intensity, intensity);
}`;

// ═══════════════════════════════════════════════════════════════
// GLOBALS
// ═══════════════════════════════════════════════════════════════

let scene, camera, renderer, controls;
let clock = new THREE.Clock();
let planets = {};
let labels = {};
let orbits = [];
let raycaster, mouse;
let noiseCubeRT, noiseCubeCam, noiseScene, noiseMaterial;
let time = 0;

const state = {
    playing: true,
    speed: 1,
    showOrbits: true,
    showLabels: true,
    soundEnabled: false,
    selectedPlanet: null,
    followTarget: null
};

// ═══════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════

function init() {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000005);
    
    // Camera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 5000);
    camera.position.set(50, 35, 70);
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    document.getElementById('canvas-container').appendChild(renderer.domElement);
    
    // Controls - FIXED
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 10;
    controls.maxDistance = 400;
    controls.enablePan = true;
    controls.panSpeed = 0.5;
    controls.rotateSpeed = 0.5;
    controls.zoomSpeed = 1.0;
    controls.target.set(0, 0, 0);
    
    // Raycaster
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    
    // Build scene
    buildScene();
    setupEvents();
    animate();
}

async function buildScene() {
    updateLoad('Creating stars...', 10);
    createStarfield();
    
    updateLoad('Generating spiral galaxy...', 25);
    createSpiralGalaxy();
    
    updateLoad('Setting up lights...', 40);
    createLighting();
    
    updateLoad('Building noise cubemap...', 50);
    createNoiseCubemap();
    
    updateLoad('Creating the Sun...', 65);
    createSun();
    
    updateLoad('Creating planets...', 80);
    createAllPlanets();
    
    updateLoad('Drawing orbits...', 95);
    createOrbits();
    
    updateLoad('Complete!', 100);
    setTimeout(() => {
        document.getElementById('loading').classList.add('hidden');
    }, 500);
}

function updateLoad(status, progress) {
    const statusEl = document.getElementById('load-status');
    const progressEl = document.getElementById('load-progress');
    if (statusEl) statusEl.textContent = status;
    if (progressEl) progressEl.style.width = progress + '%';
}

// ═══════════════════════════════════════════════════════════════
// STARFIELD
// ═══════════════════════════════════════════════════════════════

function createStarfield() {
    const layers = [
        { count: 20000, size: 0.3, minR: 500, maxR: 1500 },
        { count: 8000, size: 0.7, minR: 300, maxR: 800 },
        { count: 2000, size: 1.5, minR: 200, maxR: 500 }
    ];
    
    layers.forEach(layer => {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(layer.count * 3);
        const colors = new Float32Array(layer.count * 3);
        
        for (let i = 0; i < layer.count; i++) {
            const i3 = i * 3;
            const radius = layer.minR + Math.random() * (layer.maxR - layer.minR);
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi);
            
            // Star colors (white to blue to orange)
            const temp = Math.random();
            if (temp > 0.8) {
                colors[i3] = 1.0; colors[i3+1] = 0.8; colors[i3+2] = 0.6; // Orange
            } else if (temp > 0.6) {
                colors[i3] = 0.8; colors[i3+1] = 0.9; colors[i3+2] = 1.0; // Blue
            } else {
                colors[i3] = 1.0; colors[i3+1] = 1.0; colors[i3+2] = 1.0; // White
            }
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: layer.size,
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        scene.add(new THREE.Points(geometry, material));
    });
}

// ═══════════════════════════════════════════════════════════════
// SPIRAL GALAXY (FIXED)
// ═══════════════════════════════════════════════════════════════

function createSpiralGalaxy() {
    const particleCount = 80000;
    const arms = 5;
    const armSpread = 0.3;
    const galaxyRadius = 800;
    
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    const coreColor = new THREE.Color(0xffeedd);
    const midColor = new THREE.Color(0x6688ff);
    const outerColor = new THREE.Color(0x4422aa);
    
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Distance from center (concentrated toward center)
        const r = Math.pow(Math.random(), 0.5) * galaxyRadius;
        
        // Spiral arm angle
        const armIndex = i % arms;
        const armAngle = (armIndex / arms) * Math.PI * 2;
        
        // Spiral twist increases with distance
        const spiralAngle = armAngle + (r / galaxyRadius) * Math.PI * 3;
        
        // Random spread perpendicular to arm
        const spread = (Math.random() - 0.5) * armSpread * r * 0.5;
        const spreadAngle = spiralAngle + Math.PI / 2;
        
        // Position
        const x = Math.cos(spiralAngle) * r + Math.cos(spreadAngle) * spread;
        const z = Math.sin(spiralAngle) * r + Math.sin(spreadAngle) * spread;
        const y = (Math.random() - 0.5) * 20 * (1 - r / galaxyRadius); // Thinner at edges
        
        // Offset galaxy position (behind and below the solar system)
        positions[i3] = x;
        positions[i3 + 1] = y - 400;
        positions[i3 + 2] = z - 600;
        
        // Color based on distance from center
        const t = r / galaxyRadius;
        let color;
        if (t < 0.3) {
            color = coreColor.clone().lerp(midColor, t / 0.3);
        } else {
            color = midColor.clone().lerp(outerColor, (t - 0.3) / 0.7);
        }
        
        // Add some variation
        const brightness = 0.5 + Math.random() * 0.5;
        colors[i3] = color.r * brightness;
        colors[i3 + 1] = color.g * brightness;
        colors[i3 + 2] = color.b * brightness;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
        size: 1.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    const galaxy = new THREE.Points(geometry, material);
    galaxy.rotation.x = Math.PI * 0.1; // Slight tilt
    scene.add(galaxy);
    
    // Store for animation
    scene.userData.galaxy = galaxy;
}

// ═══════════════════════════════════════════════════════════════
// LIGHTING
// ═══════════════════════════════════════════════════════════════

function createLighting() {
    // Ambient for minimum visibility
    scene.add(new THREE.AmbientLight(0x111122, 0.15));
    
    // Sun light
    const sunLight = new THREE.PointLight(0xffffee, 2, 500, 1.5);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);
}

// ═══════════════════════════════════════════════════════════════
// NOISE CUBEMAP (for texturing)
// ═══════════════════════════════════════════════════════════════

function createNoiseCubemap() {
    noiseScene = new THREE.Scene();
    
    noiseCubeRT = new THREE.WebGLCubeRenderTarget(512, {
        format: THREE.RGBAFormat,
        generateMipmaps: true,
        minFilter: THREE.LinearMipmapLinearFilter
    });
    
    noiseCubeCam = new THREE.CubeCamera(0.1, 10, noiseCubeRT);
    
    noiseMaterial = new THREE.ShaderMaterial({
        vertexShader: perlinCubeVS,
        fragmentShader: perlinCubeFS,
        side: THREE.BackSide,
        uniforms: {
            uTime: { value: 0 },
            uFrequency: { value: 5.0 },
            uContrast: { value: 0.5 }
        }
    });
    
    const noiseBox = new THREE.Mesh(
        new THREE.BoxGeometry(2, 2, 2),
        noiseMaterial
    );
    noiseScene.add(noiseBox);
}

function updateNoiseCubemap() {
    if (!noiseCubeCam || !noiseScene) return;
    noiseMaterial.uniforms.uTime.value = time;
    noiseCubeCam.update(renderer, noiseScene);
}

// ═══════════════════════════════════════════════════════════════
// SUN
// ═══════════════════════════════════════════════════════════════

function createSun() {
    const data = PLANETS.sun;
    const group = new THREE.Group();
    group.userData = { name: 'sun', data };
    
    // Sun sphere with shader
    const sunGeo = new THREE.SphereGeometry(data.radius, 64, 64);
    const sunMat = new THREE.ShaderMaterial({
        vertexShader: sunVS,
        fragmentShader: sunFS,
        uniforms: {
            uTime: { value: 0 },
            uBrightness: { value: 1.0 },
            uNoiseCube: { value: noiseCubeRT.texture }
        }
    });
    
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    sunMesh.userData = { name: 'sun', data, clickable: true };
    group.add(sunMesh);
    
    // Glow layers
    const glowColors = [0xffaa00, 0xff8800, 0xff6600, 0xff4400];
    const glowSizes = [1.2, 1.4, 1.7, 2.2];
    const glowIntensities = [0.6, 0.45, 0.3, 0.15];
    
    glowColors.forEach((color, i) => {
        const glowGeo = new THREE.SphereGeometry(data.radius * glowSizes[i], 32, 32);
        const glowMat = new THREE.ShaderMaterial({
            vertexShader: glowVS,
            fragmentShader: glowFS,
            uniforms: {
                uColor: { value: new THREE.Color(color) },
                uIntensity: { value: glowIntensities[i] },
                uPower: { value: 2.0 + i * 0.5 }
            },
            side: THREE.BackSide,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        group.add(new THREE.Mesh(glowGeo, glowMat));
    });
    
    scene.add(group);
    planets.sun = { mesh: sunMesh, group, data, material: sunMat };
    
    createLabel('sun', data);
}

// ═══════════════════════════════════════════════════════════════
// PLANETS
// ═══════════════════════════════════════════════════════════════

function createAllPlanets() {
    const planetTypes = {
        mercury: 0, venus: 1, earth: 2, mars: 3,
        jupiter: 4, saturn: 5, uranus: 6, neptune: 7
    };
    
    const atmospheres = {
        mercury: 0, venus: 0.8, earth: 0.5, mars: 0.2,
        jupiter: 0.3, saturn: 0.25, uranus: 0.6, neptune: 0.6
    };
    
    Object.entries(PLANETS).forEach(([key, data]) => {
        if (key === 'sun') return;
        
        const group = new THREE.Group();
        group.userData = { name: key, data };
        
        // Planet mesh with shader
        const geo = new THREE.SphereGeometry(data.radius, 64, 64);
        const mat = new THREE.ShaderMaterial({
            vertexShader: planetVS,
            fragmentShader: planetFS,
            uniforms: {
                uColor1: { value: new THREE.Color(data.colors[0]) },
                uColor2: { value: new THREE.Color(data.colors[1]) },
                uColor3: { value: new THREE.Color(data.colors[2]) },
                uSunPos: { value: new THREE.Vector3(0, 0, 0) },
                uTime: { value: 0 },
                uRotation: { value: 0 },
                uPlanetType: { value: planetTypes[key] },
                uAtmosphere: { value: atmospheres[key] },
                uNoiseCube: { value: noiseCubeRT.texture }
            }
        });
        
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.x = data.distance;
        mesh.userData = { name: key, data, clickable: true };
        group.add(mesh);
        
        // Atmosphere glow
        if (atmospheres[key] > 0) {
            const atmoGeo = new THREE.SphereGeometry(data.radius * 1.08, 32, 32);
            const atmoMat = new THREE.MeshBasicMaterial({
                color: data.colors[1],
                transparent: true,
                opacity: atmospheres[key] * 0.15,
                side: THREE.BackSide,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });
            const atmo = new THREE.Mesh(atmoGeo, atmoMat);
            atmo.position.copy(mesh.position);
            group.add(atmo);
            mesh.userData.atmo = atmo;
        }
        
        // Moon for Earth
        if (data.hasMoon) {
            const moonGeo = new THREE.SphereGeometry(0.27, 32, 32);
            const moonMat = new THREE.MeshStandardMaterial({
                color: 0x888888,
                roughness: 0.9,
                metalness: 0.1
            });
            const moon = new THREE.Mesh(moonGeo, moonMat);
            moon.position.set(2.5, 0, 0);
            mesh.add(moon);
            mesh.userData.moon = moon;
        }
        
        // Rings for Saturn
        if (data.hasRings) {
            const ringGeo = new THREE.RingGeometry(data.radius * 1.4, data.radius * 2.3, 128);
            const ringTex = createRingTexture();
            const ringMat = new THREE.MeshBasicMaterial({
                map: ringTex,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.8,
                depthWrite: false
            });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.rotation.x = Math.PI / 2 * 0.9;
            ring.position.copy(mesh.position);
            group.add(ring);
            mesh.userData.ring = ring;
        }
        
        scene.add(group);
        planets[key] = { 
            mesh, group, data, material: mat,
            angle: Math.random() * Math.PI * 2,
            rotation: 0
        };
        
        createLabel(key, data);
    });
}

function createRingTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    // Ring bands with gaps
    const bands = [
        { start: 0.0, end: 0.08, opacity: 0.3, color: [180, 160, 140] },
        { start: 0.1, end: 0.35, opacity: 0.9, color: [220, 200, 180] },
        { start: 0.35, end: 0.4, opacity: 0.1, color: [100, 90, 80] }, // Cassini Division
        { start: 0.4, end: 0.7, opacity: 0.85, color: [200, 180, 160] },
        { start: 0.72, end: 0.85, opacity: 0.5, color: [160, 140, 120] },
        { start: 0.88, end: 1.0, opacity: 0.2, color: [140, 120, 100] }
    ];
    
    bands.forEach(band => {
        ctx.fillStyle = `rgba(${band.color[0]}, ${band.color[1]}, ${band.color[2]}, ${band.opacity})`;
        ctx.fillRect(band.start * 1024, 0, (band.end - band.start) * 1024, 64);
    });
    
    return new THREE.CanvasTexture(canvas);
}

// ═══════════════════════════════════════════════════════════════
// ORBITS
// ═══════════════════════════════════════════════════════════════

function createOrbits() {
    Object.entries(PLANETS).forEach(([key, data]) => {
        if (key === 'sun' || !data.distance) return;
        
        const points = [];
        for (let i = 0; i <= 128; i++) {
            const angle = (i / 128) * Math.PI * 2;
            points.push(new THREE.Vector3(
                Math.cos(angle) * data.distance,
                0,
                Math.sin(angle) * data.distance
            ));
        }
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: 0x00aaff,
            transparent: true,
            opacity: 0.2
        });
        
        const orbit = new THREE.Line(geometry, material);
        scene.add(orbit);
        orbits.push(orbit);
    });
}

// ═══════════════════════════════════════════════════════════════
// LABELS
// ═══════════════════════════════════════════════════════════════

function createLabel(key, data) {
    const div = document.createElement('div');
    div.className = 'planet-label';
    div.textContent = data.name;
    document.body.appendChild(div);
    labels[key] = div;
}

function updateLabels() {
    if (!state.showLabels) {
        Object.values(labels).forEach(l => l.style.display = 'none');
        return;
    }
    
    Object.entries(labels).forEach(([key, label]) => {
        const planet = planets[key];
        if (!planet) return;
        
        const pos = new THREE.Vector3();
        planet.mesh.getWorldPosition(pos);
        pos.y += planet.data.radius * 2;
        
        const screenPos = pos.clone().project(camera);
        
        if (screenPos.z > 1) {
            label.style.display = 'none';
        } else {
            label.style.display = 'block';
            label.style.left = (screenPos.x * 0.5 + 0.5) * window.innerWidth + 'px';
            label.style.top = (-screenPos.y * 0.5 + 0.5) * window.innerHeight + 'px';
        }
    });
}

// ═══════════════════════════════════════════════════════════════
// ANIMATION
// ═══════════════════════════════════════════════════════════════

function animate() {
    requestAnimationFrame(animate);
    
    const delta = clock.getDelta();
    
    // FPS counter
    const fps = Math.round(1 / Math.max(delta, 0.001));
    document.getElementById('fps').textContent = Math.min(fps, 999);
    
    if (state.playing) {
        time += delta * state.speed;
        
        // Time display
        const minutes = Math.floor(time / 60) % 60;
        const seconds = Math.floor(time) % 60;
        document.getElementById('time').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Update noise cubemap
        updateNoiseCubemap();
        
        // Update sun
        if (planets.sun && planets.sun.material) {
            planets.sun.material.uniforms.uTime.value = time;
        }
        
        // Update planets
        Object.entries(planets).forEach(([key, planet]) => {
            if (key === 'sun') return;
            
            // Orbital motion
            planet.angle += planet.data.orbitSpeed * state.speed * delta * 10;
            const x = Math.cos(planet.angle) * planet.data.distance;
            const z = Math.sin(planet.angle) * planet.data.distance;
            planet.mesh.position.set(x, 0, z);
            
            // Planet rotation
            planet.rotation += planet.data.rotationSpeed * state.speed * delta * 10;
            
            // Update shader uniforms
            if (planet.material) {
                planet.material.uniforms.uTime.value = time;
                planet.material.uniforms.uRotation.value = planet.rotation;
            }
            
            // Update atmosphere position
            if (planet.mesh.userData.atmo) {
                planet.mesh.userData.atmo.position.set(x, 0, z);
            }
            
            // Update ring position
            if (planet.mesh.userData.ring) {
                planet.mesh.userData.ring.position.set(x, 0, z);
            }
            
            // Update moon
            if (planet.mesh.userData.moon) {
                const moonAngle = time * 0.5;
                planet.mesh.userData.moon.position.set(
                    Math.cos(moonAngle) * 2.5,
                    0,
                    Math.sin(moonAngle) * 2.5
                );
            }
        });
        
        // Rotate galaxy slowly
        if (scene.userData.galaxy) {
            scene.userData.galaxy.rotation.y += 0.00005 * state.speed;
        }
    }
    
    // Follow target
    if (state.followTarget && planets[state.followTarget]) {
        const targetPos = new THREE.Vector3();
        planets[state.followTarget].mesh.getWorldPosition(targetPos);
        controls.target.lerp(targetPos, 0.05);
    }
    
    updateLabels();
    controls.update();
    renderer.render(scene, camera);
}

// ═══════════════════════════════════════════════════════════════
// EVENT HANDLERS
// ═══════════════════════════════════════════════════════════════

function setupEvents() {
    // Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Mouse move for hover
    window.addEventListener('mousemove', (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        
        raycaster.setFromCamera(mouse, camera);
        const meshes = Object.values(planets).map(p => p.mesh);
        const intersects = raycaster.intersectObjects(meshes);
        
        const tooltip = document.getElementById('tooltip');
        
        if (intersects.length > 0 && intersects[0].object.userData.clickable) {
            document.body.classList.add('clickable');
            tooltip.classList.remove('hidden');
            tooltip.textContent = intersects[0].object.userData.data.name;
            tooltip.style.left = e.clientX + 'px';
            tooltip.style.top = e.clientY + 'px';
        } else {
            document.body.classList.remove('clickable');
            tooltip.classList.add('hidden');
        }
    });
    
    // Click for selection
    window.addEventListener('click', (e) => {
        if (e.target.closest('#controls, #planet-popup, #header')) return;
        
        raycaster.setFromCamera(mouse, camera);
        const meshes = Object.values(planets).map(p => p.mesh);
        const intersects = raycaster.intersectObjects(meshes);
        
        if (intersects.length > 0 && intersects[0].object.userData.clickable) {
            const name = intersects[0].object.userData.name;
            if (name && PLANETS[name]) {
                showPopup(name, PLANETS[name]);
            }
        }
    });
    
    // Keyboard shortcuts
    window.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT') return;
        
        switch(e.key.toLowerCase()) {
            case ' ': e.preventDefault(); togglePlay(); break;
            case 'r': resetCamera(); break;
            case 'o': toggleOrbits(); break;
            case 'l': toggleLabels(); break;
            case 'm': toggleSound(); break;
            case 'escape': closePopup(); state.followTarget = null; break;
            case '0': case '1': case '2': case '3': case '4': 
            case '5': case '6': case '7': case '8':
                const names = ['sun', 'mercury', 'venus', 'earth', 'mars', 
                              'jupiter', 'saturn', 'uranus', 'neptune'];
                const idx = parseInt(e.key);
                if (PLANETS[names[idx]]) showPopup(names[idx], PLANETS[names[idx]]);
                break;
        }
    });
    
    // UI Buttons
    document.getElementById('btn-play').addEventListener('click', togglePlay);
    document.getElementById('btn-reset').addEventListener('click', resetCamera);
    document.getElementById('btn-orbits').addEventListener('click', toggleOrbits);
    document.getElementById('btn-labels').addEventListener('click', toggleLabels);
    document.getElementById('btn-sound').addEventListener('click', toggleSound);
    
    document.getElementById('speed').addEventListener('input', (e) => {
        state.speed = parseFloat(e.target.value);
        document.getElementById('speed-val').textContent = state.speed.toFixed(1) + 'x';
    });
    
    document.getElementById('popup-close').addEventListener('click', closePopup);
    document.getElementById('popup-speak').addEventListener('click', speakInfo);
    document.getElementById('popup-focus').addEventListener('click', () => {
        if (state.selectedPlanet) focusOn(state.selectedPlanet);
    });
    document.getElementById('popup-follow').addEventListener('click', () => {
        if (state.selectedPlanet) {
            state.followTarget = state.selectedPlanet;
            closePopup();
        }
    });
}

// ═══════════════════════════════════════════════════════════════
// UI FUNCTIONS
// ═══════════════════════════════════════════════════════════════

function showPopup(name, data) {
    state.selectedPlanet = name;
    
    document.getElementById('popup-name').textContent = data.name;
    document.getElementById('popup-type').textContent = data.type;
    document.getElementById('popup-diameter').textContent = data.diameter;
    document.getElementById('popup-distance').textContent = data.distanceFromSun;
    document.getElementById('popup-period').textContent = data.period;
    document.getElementById('popup-temp').textContent = data.temp;
    document.getElementById('popup-moons').textContent = data.moons;
    document.getElementById('popup-gravity').textContent = data.gravity;
    document.getElementById('popup-fact').textContent = data.fact;
    
    // Color gradient for visual
    const c1 = data.colors[0].toString(16).padStart(6, '0');
    const c2 = data.colors[1].toString(16).padStart(6, '0');
    document.getElementById('popup-visual').style.background = 
        `linear-gradient(135deg, #${c1}, #${c2})`;
    
    document.getElementById('planet-popup').classList.remove('hidden');
    
    if (state.soundEnabled) speakInfo();
}

function closePopup() {
    document.getElementById('planet-popup').classList.add('hidden');
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }
}

function speakInfo() {
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }
    
    if (!state.selectedPlanet || !PLANETS[state.selectedPlanet]) return;
    
    const data = PLANETS[state.selectedPlanet];
    const text = `${data.name}. ${data.type}. 
        Diameter: ${data.diameter}. 
        Distance from Sun: ${data.distanceFromSun}. 
        Orbital period: ${data.period}. 
        Temperature: ${data.temp}. 
        Moons: ${data.moons}. 
        ${data.fact}`;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
    
    document.getElementById('popup-speak').classList.add('active');
    utterance.onend = () => {
        document.getElementById('popup-speak').classList.remove('active');
    };
}

function focusOn(name) {
    const planet = planets[name];
    if (!planet) return;
    
    const targetPos = new THREE.Vector3();
    planet.mesh.getWorldPosition(targetPos);
    
    const offset = planet.data.radius * 5 + 15;
    const cameraTarget = new THREE.Vector3(
        targetPos.x + offset * 0.6,
        targetPos.y + offset * 0.4,
        targetPos.z + offset
    );
    
    animateCamera(cameraTarget, targetPos);
    closePopup();
}

function animateCamera(targetPosition, lookAtPosition) {
    const startPosition = camera.position.clone();
    const startTarget = controls.target.clone();
    const startTime = Date.now();
    const duration = 1500;
    
    function update() {
        const elapsed = Date.now() - startTime;
        const t = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - t, 3); // Cubic ease out
        
        camera.position.lerpVectors(startPosition, targetPosition, ease);
        controls.target.lerpVectors(startTarget, lookAtPosition, ease);
        controls.update();
        
        if (t < 1) {
            requestAnimationFrame(update);
        }
    }
    
    update();
}

function togglePlay() {
    state.playing = !state.playing;
    document.getElementById('icon-pause').style.display = state.playing ? 'block' : 'none';
    document.getElementById('icon-play').style.display = state.playing ? 'none' : 'block';
    document.getElementById('btn-play').classList.toggle('active', state.playing);
}

function resetCamera() {
    state.followTarget = null;
    animateCamera(
        new THREE.Vector3(50, 35, 70),
        new THREE.Vector3(0, 0, 0)
    );
}

function toggleOrbits() {
    state.showOrbits = !state.showOrbits;
    orbits.forEach(orbit => orbit.visible = state.showOrbits);
    document.getElementById('btn-orbits').classList.toggle('active', state.showOrbits);
}

function toggleLabels() {
    state.showLabels = !state.showLabels;
    document.getElementById('btn-labels').classList.toggle('active', state.showLabels);
}

function toggleSound() {
    state.soundEnabled = !state.soundEnabled;
    document.getElementById('btn-sound').classList.toggle('active', state.soundEnabled);
    if (!state.soundEnabled && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }
}

// ═══════════════════════════════════════════════════════════════
// START
// ═══════════════════════════════════════════════════════════════

init();
