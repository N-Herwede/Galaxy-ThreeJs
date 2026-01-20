// ============================================
// COSMOS EXPLORER - Ultimate Solar System
// Advanced Three.js Implementation
// ============================================

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ============================================
// COMPREHENSIVE PLANET DATA
// ============================================

const PLANET_DATA = {
    sun: {
        name: 'Sun',
        type: 'G-type Main Sequence Star',
        radius: 6,
        color: 0xffdd00,
        distance: 0,
        orbitSpeed: 0,
        rotationSpeed: 0.001,
        distanceFromSun: '0 km (Center)',
        orbitalPeriod: 'N/A',
        surfaceTemp: '5,500°C',
        gravity: '274 m/s²',
        moons: '8 planets',
        diameter: '1,392,700 km',
        composition: [
            { name: 'Hydrogen', value: 73, color: '#ff6b6b' },
            { name: 'Helium', value: 25, color: '#ffd93d' },
            { name: 'Other', value: 2, color: '#6bcb77' }
        ],
        fact: 'The Sun contains 99.86% of all mass in our solar system. Every second, it converts about 600 million tons of hydrogen into helium through nuclear fusion.'
    },
    mercury: {
        name: 'Mercury',
        type: 'Terrestrial Planet',
        radius: 0.38,
        distance: 12,
        orbitSpeed: 0.04,
        rotationSpeed: 0.003,
        color: 0x8c7853,
        distanceFromSun: '57.9 million km',
        orbitalPeriod: '88 Earth days',
        surfaceTemp: '-180 to 430°C',
        gravity: '3.7 m/s²',
        moons: '0',
        diameter: '4,879 km',
        composition: [
            { name: 'Iron Core', value: 70, color: '#cd7f32' },
            { name: 'Silicate', value: 30, color: '#a0522d' }
        ],
        fact: 'Mercury has the most extreme temperature swings of any planet, ranging from -180°C at night to 430°C during the day.'
    },
    venus: {
        name: 'Venus',
        type: 'Terrestrial Planet',
        radius: 0.95,
        distance: 17,
        orbitSpeed: 0.015,
        rotationSpeed: -0.001,
        color: 0xe6c87a,
        atmosphere: { color: 0xffd699, opacity: 0.4, scale: 1.12 },
        distanceFromSun: '108.2 million km',
        orbitalPeriod: '225 Earth days',
        surfaceTemp: '465°C',
        gravity: '8.87 m/s²',
        moons: '0',
        diameter: '12,104 km',
        composition: [
            { name: 'CO₂', value: 96, color: '#daa520' },
            { name: 'Nitrogen', value: 3, color: '#87ceeb' },
            { name: 'Other', value: 1, color: '#90ee90' }
        ],
        fact: 'Venus rotates backwards and so slowly that a day on Venus (243 Earth days) is longer than its year (225 Earth days).'
    },
    earth: {
        name: 'Earth',
        type: 'Terrestrial Planet',
        radius: 1,
        distance: 22,
        orbitSpeed: 0.01,
        rotationSpeed: 0.015,
        color: 0x6b93d6,
        atmosphere: { color: 0x87ceeb, opacity: 0.3, scale: 1.08 },
        hasMoon: true,
        hasCloud: true,
        distanceFromSun: '149.6 million km',
        orbitalPeriod: '365.25 days',
        surfaceTemp: '-88 to 58°C',
        gravity: '9.81 m/s²',
        moons: '1',
        diameter: '12,742 km',
        composition: [
            { name: 'Iron', value: 32, color: '#cd853f' },
            { name: 'Oxygen', value: 30, color: '#87ceeb' },
            { name: 'Silicon', value: 15, color: '#deb887' },
            { name: 'Magnesium', value: 14, color: '#98fb98' },
            { name: 'Other', value: 9, color: '#dda0dd' }
        ],
        fact: 'Earth is the only planet not named after a god. It\'s also the densest planet in our solar system.'
    },
    mars: {
        name: 'Mars',
        type: 'Terrestrial Planet',
        radius: 0.53,
        distance: 28,
        orbitSpeed: 0.008,
        rotationSpeed: 0.014,
        color: 0xc1440e,
        atmosphere: { color: 0xd4a574, opacity: 0.15, scale: 1.04 },
        distanceFromSun: '227.9 million km',
        orbitalPeriod: '687 Earth days',
        surfaceTemp: '-87 to -5°C',
        gravity: '3.71 m/s²',
        moons: '2',
        diameter: '6,779 km',
        composition: [
            { name: 'Iron Oxide', value: 45, color: '#b22222' },
            { name: 'Basalt', value: 35, color: '#696969' },
            { name: 'Other', value: 20, color: '#d2691e' }
        ],
        fact: 'Mars has the largest volcano (Olympus Mons) and longest canyon (Valles Marineris) in the solar system.'
    },
    jupiter: {
        name: 'Jupiter',
        type: 'Gas Giant',
        radius: 3.5,
        distance: 42,
        orbitSpeed: 0.002,
        rotationSpeed: 0.035,
        color: 0xd8ca9d,
        atmosphere: { color: 0xe0d5b8, opacity: 0.25, scale: 1.02 },
        distanceFromSun: '778.5 million km',
        orbitalPeriod: '11.9 Earth years',
        surfaceTemp: '-110°C',
        gravity: '24.79 m/s²',
        moons: '95',
        diameter: '139,820 km',
        composition: [
            { name: 'Hydrogen', value: 90, color: '#ff6b6b' },
            { name: 'Helium', value: 10, color: '#ffd93d' }
        ],
        fact: 'Jupiter\'s Great Red Spot is a storm that has been raging for at least 400 years and is larger than Earth.'
    },
    saturn: {
        name: 'Saturn',
        type: 'Gas Giant',
        radius: 2.9,
        distance: 55,
        orbitSpeed: 0.0009,
        rotationSpeed: 0.032,
        color: 0xead6b8,
        atmosphere: { color: 0xf5e6d0, opacity: 0.2, scale: 1.03 },
        hasRings: true,
        ringInnerRadius: 3.8,
        ringOuterRadius: 7,
        distanceFromSun: '1.4 billion km',
        orbitalPeriod: '29.4 Earth years',
        surfaceTemp: '-140°C',
        gravity: '10.44 m/s²',
        moons: '146',
        diameter: '116,460 km',
        composition: [
            { name: 'Hydrogen', value: 96, color: '#ff6b6b' },
            { name: 'Helium', value: 3, color: '#ffd93d' },
            { name: 'Other', value: 1, color: '#87ceeb' }
        ],
        fact: 'Saturn\'s rings extend 282,000 km but are only about 10 meters thick.'
    },
    uranus: {
        name: 'Uranus',
        type: 'Ice Giant',
        radius: 2,
        distance: 70,
        orbitSpeed: 0.0004,
        rotationSpeed: -0.022,
        color: 0xc9e9f0,
        atmosphere: { color: 0xadd8e6, opacity: 0.35, scale: 1.05 },
        distanceFromSun: '2.9 billion km',
        orbitalPeriod: '84 Earth years',
        surfaceTemp: '-224°C',
        gravity: '8.69 m/s²',
        moons: '28',
        diameter: '50,724 km',
        composition: [
            { name: 'Hydrogen', value: 83, color: '#ff6b6b' },
            { name: 'Helium', value: 15, color: '#ffd93d' },
            { name: 'Methane', value: 2, color: '#00bfff' }
        ],
        fact: 'Uranus rotates on its side with an axial tilt of 98°.'
    },
    neptune: {
        name: 'Neptune',
        type: 'Ice Giant',
        radius: 1.9,
        distance: 85,
        orbitSpeed: 0.0001,
        rotationSpeed: 0.028,
        color: 0x4b70dd,
        atmosphere: { color: 0x6495ed, opacity: 0.35, scale: 1.06 },
        distanceFromSun: '4.5 billion km',
        orbitalPeriod: '165 Earth years',
        surfaceTemp: '-214°C',
        gravity: '11.15 m/s²',
        moons: '16',
        diameter: '49,244 km',
        composition: [
            { name: 'Hydrogen', value: 80, color: '#ff6b6b' },
            { name: 'Helium', value: 19, color: '#ffd93d' },
            { name: 'Methane', value: 1, color: '#00bfff' }
        ],
        fact: 'Neptune has the strongest winds in the solar system, reaching 2,100 km/h.'
    }
};

// ============================================
// GLOBAL STATE
// ============================================

let scene, camera, renderer, controls;
let sun, sunLight, sunFlares = [];
let planets = {}, planetLabels = {};
let orbitLines = [], asteroidBelt, kuiperBelt;
let galaxy, nebulae = [], dustClouds = [];
let raycaster, mouse;
let clock = new THREE.Clock();

const state = {
    isPlaying: true,
    timeSpeed: 1,
    reverseTime: false,
    selectedObject: null,
    followTarget: null,
    showOrbits: true,
    showLabels: true,
    showAsteroids: true,
    showKuiper: true,
    showStars: true,
    showGalaxy: true,
    showNebulae: true,
    coronaIntensity: 1,
    flareIntensity: 1,
    sunLightIntensity: 2.5,
    showProminences: true,
    planetScale: 1,
    orbitScale: 1,
    atmosphereIntensity: 1,
    fps: 60,
    objectCount: 0,
    simTime: 0
};

const DOM = {};

// ============================================
// INITIALIZATION
// ============================================

function init() {
    cacheDOMElements();
    setupScene();
    setupCamera();
    setupRenderer();
    setupControls();
    setupRaycaster();
    createSceneElements();
    setupEventListeners();
    setupKeyboardShortcuts();
    animate();
}

function cacheDOMElements() {
    DOM.container = document.getElementById('canvas-container');
    DOM.loading = document.getElementById('loading');
    DOM.loadingProgress = document.getElementById('loading-progress');
    DOM.loadingStatus = document.getElementById('loading-status');
    DOM.infoPanel = document.getElementById('info-panel');
    DOM.controlPanel = document.getElementById('control-panel');
    DOM.panelToggle = document.getElementById('panel-toggle');
    DOM.tooltip = document.getElementById('tooltip');
    DOM.tooltipText = document.getElementById('tooltip-text');
    DOM.shortcutsHelp = document.getElementById('shortcuts-help');
    DOM.fpsCounter = document.getElementById('fps-counter');
    DOM.simTime = document.getElementById('sim-time');
    DOM.objectCount = document.getElementById('object-count');
}

function setupScene() {
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000510, 0.0008);
}

function setupCamera() {
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 3000);
    camera.position.set(60, 45, 90);
}

function setupRenderer() {
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        preserveDrawingBuffer: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    DOM.container.appendChild(renderer.domElement);
}

function setupControls() {
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 10;
    controls.maxDistance = 500;
    controls.maxPolarAngle = Math.PI * 0.9;
    controls.rotateSpeed = 0.5;
    controls.zoomSpeed = 1.2;
}

function setupRaycaster() {
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
}

// ============================================
// SCENE CREATION
// ============================================

async function createSceneElements() {
    updateLoading('Creating galaxy...', 10);
    createGalaxy();
    
    updateLoading('Generating nebulae...', 20);
    createNebulae();
    
    updateLoading('Placing stars...', 30);
    createStarfield();
    
    updateLoading('Setting up lighting...', 50);
    createLighting();
    
    updateLoading('Generating Sun...', 60);
    createSun();
    
    updateLoading('Creating planets...', 70);
    createAllPlanets();
    
    updateLoading('Drawing orbits...', 80);
    createOrbitLines();
    
    updateLoading('Generating asteroids...', 90);
    createAsteroidBelt();
    createKuiperBelt();
    
    updateLoading('Finalizing...', 100);
    
    state.objectCount = countObjects();
    DOM.objectCount.textContent = state.objectCount;
    
    setTimeout(() => DOM.loading.classList.add('hidden'), 500);
}

function updateLoading(status, progress) {
    if (DOM.loadingStatus) DOM.loadingStatus.textContent = status;
    if (DOM.loadingProgress) DOM.loadingProgress.style.width = progress + '%';
}

function countObjects() {
    let count = 0;
    scene.traverse(() => count++);
    return count;
}

// ============================================
// GALAXY & STARS
// ============================================

function createGalaxy() {
    const count = 60000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    const palette = [
        new THREE.Color(0xff6b35), new THREE.Color(0xf7c59f),
        new THREE.Color(0x2e86ab), new THREE.Color(0xa23b72)
    ];

    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const arm = i % 4;
        const radius = Math.random() * 700 + 150;
        const spin = radius * 0.003;
        const branch = (arm / 4) * Math.PI * 2;
        const rand = Math.pow(Math.random(), 3) * 60;
        
        positions[i3] = Math.cos(branch + spin) * radius + (Math.random() - 0.5) * rand;
        positions[i3 + 1] = (Math.random() - 0.5) * rand * 0.3 - 250;
        positions[i3 + 2] = Math.sin(branch + spin) * radius + (Math.random() - 0.5) * rand - 400;
        
        const color = palette[Math.floor(Math.random() * palette.length)];
        const bright = 0.5 + (1 - radius / 900) * 0.5;
        colors[i3] = color.r * bright;
        colors[i3 + 1] = color.g * bright;
        colors[i3 + 2] = color.b * bright;
    }
    
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const mat = new THREE.PointsMaterial({
        size: 1.5, vertexColors: true, transparent: true,
        opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false
    });
    
    galaxy = new THREE.Points(geom, mat);
    galaxy.rotation.x = Math.PI * 0.15;
    scene.add(galaxy);
}

function createNebulae() {
    const configs = [
        { color: 0x6b3fa0, pos: [-400, 150, -600], scale: 500, op: 0.3 },
        { color: 0x3a7ca5, pos: [500, -100, -550], scale: 450, op: 0.25 },
        { color: 0xc44569, pos: [300, 200, -700], scale: 550, op: 0.2 },
        { color: 0x2d5a3d, pos: [-300, -150, -450], scale: 400, op: 0.25 }
    ];
    
    configs.forEach(cfg => {
        const tex = createNebulaTexture(cfg.color);
        const mat = new THREE.SpriteMaterial({
            map: tex, transparent: true, opacity: cfg.op,
            blending: THREE.AdditiveBlending, depthWrite: false
        });
        const sprite = new THREE.Sprite(mat);
        sprite.position.set(...cfg.pos);
        sprite.scale.set(cfg.scale, cfg.scale, 1);
        nebulae.push(sprite);
        scene.add(sprite);
    });
}

function createNebulaTexture(baseColor) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const c = new THREE.Color(baseColor);
    
    for (let i = 0; i < 6; i++) {
        const x = 256 + (Math.random() - 0.5) * 150;
        const y = 256 + (Math.random() - 0.5) * 150;
        const r = 100 + Math.random() * 150;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        grad.addColorStop(0, `rgba(${c.r*255|0},${c.g*255|0},${c.b*255|0},0.4)`);
        grad.addColorStop(0.5, `rgba(${c.r*200|0},${c.g*200|0},${c.b*200|0},0.15)`);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 512, 512);
    }
    return new THREE.CanvasTexture(canvas);
}

function createStarfield() {
    const layers = [
        { count: 15000, size: 0.3, minR: 400, maxR: 900, op: 0.5 },
        { count: 5000, size: 0.8, minR: 250, maxR: 500, op: 0.7 },
        { count: 1500, size: 1.5, minR: 150, maxR: 350, op: 0.9 }
    ];
    
    const starColors = [
        new THREE.Color(0xffffff), new THREE.Color(0xffeedd),
        new THREE.Color(0xaaccff), new THREE.Color(0xffddaa)
    ];
    
    layers.forEach(layer => {
        const positions = new Float32Array(layer.count * 3);
        const colors = new Float32Array(layer.count * 3);
        
        for (let i = 0; i < layer.count; i++) {
            const i3 = i * 3;
            const r = layer.minR + Math.random() * (layer.maxR - layer.minR);
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            positions[i3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = r * Math.cos(phi);
            
            const col = starColors[Math.floor(Math.random() * starColors.length)];
            const b = 0.6 + Math.random() * 0.4;
            colors[i3] = col.r * b;
            colors[i3 + 1] = col.g * b;
            colors[i3 + 2] = col.b * b;
        }
        
        const geom = new THREE.BufferGeometry();
        geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const mat = new THREE.PointsMaterial({
            size: layer.size, vertexColors: true, transparent: true,
            opacity: layer.op, blending: THREE.AdditiveBlending
        });
        
        const stars = new THREE.Points(geom, mat);
        stars.userData.isStarfield = true;
        scene.add(stars);
    });
}

// ============================================
// LIGHTING
// ============================================

function createLighting() {
    scene.add(new THREE.AmbientLight(0x0a0a15, 0.1));
    
    sunLight = new THREE.PointLight(0xfff5e0, state.sunLightIntensity, 500, 1.2);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.set(2048, 2048);
    scene.add(sunLight);
    
    scene.add(new THREE.PointLight(0xffaa55, 0.4, 200));
    
    const rim = new THREE.DirectionalLight(0x4488ff, 0.08);
    rim.position.set(0, 80, -150);
    scene.add(rim);
}

// ============================================
// SUN
// ============================================

function createSun() {
    const sunGroup = new THREE.Group();
    sunGroup.userData = { name: 'sun', ...PLANET_DATA.sun };
    
    const sunGeom = new THREE.SphereGeometry(PLANET_DATA.sun.radius, 128, 128);
    const sunTex = createSunTexture();
    const sunMat = new THREE.MeshBasicMaterial({ map: sunTex });
    sun = new THREE.Mesh(sunGeom, sunMat);
    sunGroup.add(sun);
    
    // Glow layers
    const glows = [
        { size: 18, op: 0.9, color1: 0xffffaa, color2: 0xffcc00 },
        { size: 30, op: 0.5, color1: 0xffaa44, color2: 0xff6600 },
        { size: 45, op: 0.3, color1: 0xff6600, color2: 0xff3300 }
    ];
    
    glows.forEach((g, i) => {
        const tex = createGlowTexture(g.color1, g.color2);
        const mat = new THREE.SpriteMaterial({
            map: tex, transparent: true, opacity: g.op,
            blending: THREE.AdditiveBlending, depthWrite: false
        });
        const sprite = new THREE.Sprite(mat);
        sprite.scale.set(g.size, g.size, 1);
        sprite.userData = { type: 'corona', baseScale: g.size, index: i };
        sunGroup.add(sprite);
    });
    
    // Flares
    for (let i = 0; i < 4; i++) {
        const tex = createGlowTexture(0xffcc00, 0xff6600);
        const mat = new THREE.SpriteMaterial({
            map: tex, transparent: true, opacity: 0.25,
            blending: THREE.AdditiveBlending, depthWrite: false
        });
        const flare = new THREE.Sprite(mat);
        const dist = 12 + i * 6;
        flare.scale.set(4, 4, 1);
        flare.position.set(dist, 0, 0);
        flare.userData = { type: 'lensFlare', baseDist: dist, baseOp: 0.25 };
        sunFlares.push(flare);
        sunGroup.add(flare);
    }
    
    scene.add(sunGroup);
    planets.sun = { mesh: sunGroup, group: sunGroup, data: PLANET_DATA.sun, angle: 0 };
}

function createSunTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 2048; canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    const grad = ctx.createLinearGradient(0, 0, 0, 1024);
    grad.addColorStop(0, '#fff5c0');
    grad.addColorStop(0.3, '#ffdd40');
    grad.addColorStop(0.5, '#ffaa00');
    grad.addColorStop(0.7, '#ff8800');
    grad.addColorStop(1, '#ff6600');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 2048, 1024);
    
    // Granulation
    for (let i = 0; i < 10000; i++) {
        const x = Math.random() * 2048, y = Math.random() * 1024;
        const b = Math.random();
        ctx.fillStyle = b > 0.5 ? `rgba(255,255,200,${b*0.3})` : `rgba(200,100,0,${(1-b)*0.2})`;
        ctx.beginPath();
        ctx.arc(x, y, 2 + Math.random() * 6, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Sunspots
    for (let i = 0; i < 10; i++) {
        const x = 200 + Math.random() * 1648;
        const y = 150 + Math.random() * 724;
        const r = 15 + Math.random() * 35;
        ctx.fillStyle = 'rgba(50,25,0,0.7)';
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    }
    
    return new THREE.CanvasTexture(canvas);
}

function createGlowTexture(c1, c2) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 256;
    const ctx = canvas.getContext('2d');
    const col1 = new THREE.Color(c1), col2 = new THREE.Color(c2);
    
    const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, `rgba(${col1.r*255|0},${col1.g*255|0},${col1.b*255|0},1)`);
    grad.addColorStop(0.3, `rgba(${col1.r*255|0},${col1.g*255|0},${col1.b*255|0},0.5)`);
    grad.addColorStop(0.6, `rgba(${col2.r*255|0},${col2.g*255|0},${col2.b*255|0},0.2)`);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
    
    return new THREE.CanvasTexture(canvas);
}

// ============================================
// PLANETS
// ============================================

function createAllPlanets() {
    Object.keys(PLANET_DATA).forEach(key => {
        if (key !== 'sun') createPlanet(key, PLANET_DATA[key]);
    });
}

function createPlanet(key, data) {
    const group = new THREE.Group();
    group.userData = { name: key, ...data };
    
    const geom = new THREE.SphereGeometry(data.radius * state.planetScale, 64, 64);
    const tex = createPlanetTexture(key, data);
    const mat = new THREE.MeshStandardMaterial({
        map: tex, roughness: 0.85, metalness: 0.1
    });
    
    const planet = new THREE.Mesh(geom, mat);
    planet.castShadow = true;
    planet.receiveShadow = true;
    planet.position.x = data.distance * state.orbitScale;
    planet.userData = { name: key, ...data };
    group.add(planet);
    
    // Atmosphere
    if (data.atmosphere) {
        const atmoGeom = new THREE.SphereGeometry(
            data.radius * state.planetScale * data.atmosphere.scale, 48, 48
        );
        const atmoMat = new THREE.MeshBasicMaterial({
            color: data.atmosphere.color,
            transparent: true,
            opacity: data.atmosphere.opacity * state.atmosphereIntensity,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const atmo = new THREE.Mesh(atmoGeom, atmoMat);
        atmo.position.copy(planet.position);
        group.add(atmo);
        planet.userData.atmosphere = atmo;
    }
    
    // Clouds for Earth
    if (data.hasCloud) {
        const cloudGeom = new THREE.SphereGeometry(data.radius * state.planetScale * 1.02, 48, 48);
        const cloudTex = createCloudTexture();
        const cloudMat = new THREE.MeshStandardMaterial({
            map: cloudTex, transparent: true, opacity: 0.5, depthWrite: false
        });
        const clouds = new THREE.Mesh(cloudGeom, cloudMat);
        clouds.position.copy(planet.position);
        group.add(clouds);
        planet.userData.clouds = clouds;
    }
    
    // Moon
    if (data.hasMoon) {
        const moonGeom = new THREE.SphereGeometry(0.27 * state.planetScale, 32, 32);
        const moonMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.95 });
        const moon = new THREE.Mesh(moonGeom, moonMat);
        moon.position.set(2.5 * state.planetScale, 0, 0);
        planet.add(moon);
        planet.userData.moon = moon;
    }
    
    // Rings
    if (data.hasRings) {
        const ringGeom = new THREE.RingGeometry(
            data.ringInnerRadius * state.planetScale,
            data.ringOuterRadius * state.planetScale, 128
        );
        const ringTex = createRingTexture();
        const ringMat = new THREE.MeshBasicMaterial({
            map: ringTex, side: THREE.DoubleSide,
            transparent: true, opacity: 0.9, depthWrite: false
        });
        const ring = new THREE.Mesh(ringGeom, ringMat);
        ring.rotation.x = Math.PI / 2.1;
        ring.position.copy(planet.position);
        group.add(ring);
        planet.userData.ring = ring;
    }
    
    scene.add(group);
    createLabel(key, data, planet);
    planets[key] = { mesh: planet, group, data, angle: Math.random() * Math.PI * 2 };
}

function createPlanetTexture(key, data) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const c = new THREE.Color(data.color);
    
    ctx.fillStyle = `rgb(${c.r*255|0},${c.g*255|0},${c.b*255|0})`;
    ctx.fillRect(0, 0, 1024, 512);
    
    // Add variation
    for (let i = 0; i < 2000; i++) {
        const x = Math.random() * 1024, y = Math.random() * 512;
        const v = (Math.random() - 0.5) * 0.3;
        ctx.fillStyle = `rgba(${Math.min(255, c.r*255+v*80)|0},${Math.min(255, c.g*255+v*80)|0},${Math.min(255, c.b*255+v*80)|0},0.5)`;
        ctx.fillRect(x, y, 3 + Math.random() * 5, 3 + Math.random() * 5);
    }
    
    // Planet-specific features
    if (key === 'earth') {
        ctx.fillStyle = '#3d6b3d';
        ctx.fillRect(100, 150, 150, 180); // Americas
        ctx.fillRect(400, 130, 200, 160); // Africa/Eurasia
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.fillRect(0, 0, 1024, 30); // Ice caps
        ctx.fillRect(0, 482, 1024, 30);
    }
    
    if (key === 'jupiter') {
        const bands = ['#e8d5b7', '#c9a97a', '#dfc9a8', '#b8956e'];
        for (let i = 0; i < 12; i++) {
            ctx.fillStyle = bands[i % 4];
            ctx.globalAlpha = 0.4;
            ctx.fillRect(0, i * 42, 1024, 42);
        }
        ctx.globalAlpha = 1;
        // Great Red Spot
        ctx.fillStyle = '#c44d3c';
        ctx.beginPath();
        ctx.ellipse(650, 280, 50, 30, 0, 0, Math.PI * 2);
        ctx.fill();
    }
    
    if (key === 'mars') {
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.fillRect(0, 0, 1024, 20);
        ctx.fillRect(0, 492, 1024, 20);
    }
    
    return new THREE.CanvasTexture(canvas);
}

function createCloudTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 1024, 512);
    
    for (let i = 0; i < 150; i++) {
        const x = Math.random() * 1024, y = Math.random() * 512;
        const size = 20 + Math.random() * 50;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, size);
        grad.addColorStop(0, 'rgba(255,255,255,0.6)');
        grad.addColorStop(0.5, 'rgba(255,255,255,0.3)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(x, y, size, size * 0.4, Math.random() * Math.PI, 0, Math.PI * 2);
        ctx.fill();
    }
    return new THREE.CanvasTexture(canvas);
}

function createRingTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    const grad = ctx.createLinearGradient(0, 0, 1024, 0);
    grad.addColorStop(0, 'rgba(180,160,140,0)');
    grad.addColorStop(0.1, 'rgba(200,180,160,0.9)');
    grad.addColorStop(0.2, 'rgba(180,160,140,0.3)');
    grad.addColorStop(0.3, 'rgba(210,190,170,0.95)');
    grad.addColorStop(0.5, 'rgba(220,200,180,0.9)');
    grad.addColorStop(0.7, 'rgba(200,180,160,0.8)');
    grad.addColorStop(0.9, 'rgba(180,160,140,0.6)');
    grad.addColorStop(1, 'rgba(150,130,110,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 64);
    
    return new THREE.CanvasTexture(canvas);
}

function createLabel(key, data, planet) {
    const div = document.createElement('div');
    div.className = 'planet-label';
    div.textContent = data.name;
    div.style.cssText = `
        position: absolute; color: white; font-family: 'Rajdhani', sans-serif;
        font-size: 12px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase;
        pointer-events: none; text-shadow: 0 0 10px rgba(0,212,255,0.8), 0 2px 4px rgba(0,0,0,0.8);
        opacity: 0.8; white-space: nowrap; transform: translate(-50%, -100%);
        padding: 4px 8px; background: rgba(0,20,40,0.5); border-radius: 4px;
        border: 1px solid rgba(0,212,255,0.3);
    `;
    document.body.appendChild(div);
    planetLabels[key] = { element: div, planet };
}

// ============================================
// ORBITS & ASTEROIDS
// ============================================

function createOrbitLines() {
    Object.entries(PLANET_DATA).forEach(([key, data], i) => {
        if (key === 'sun' || !data.distance) return;
        
        const points = [];
        for (let j = 0; j <= 256; j++) {
            const a = (j / 256) * Math.PI * 2;
            points.push(new THREE.Vector3(
                Math.cos(a) * data.distance * state.orbitScale, 0,
                Math.sin(a) * data.distance * state.orbitScale
            ));
        }
        
        const geom = new THREE.BufferGeometry().setFromPoints(points);
        const mat = new THREE.LineBasicMaterial({
            color: new THREE.Color().setHSL(0.55 + i * 0.04, 0.6, 0.4),
            transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending
        });
        
        const line = new THREE.Line(geom, mat);
        scene.add(line);
        orbitLines.push(line);
    });
}

function createAsteroidBelt() {
    const count = 800;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const r = 30 + Math.random() * 8;
        const a = Math.random() * Math.PI * 2;
        positions[i3] = Math.cos(a) * r;
        positions[i3 + 1] = (Math.random() - 0.5) * 3;
        positions[i3 + 2] = Math.sin(a) * r;
        
        const b = 0.4 + Math.random() * 0.3;
        colors[i3] = b * 0.8;
        colors[i3 + 1] = b * 0.7;
        colors[i3 + 2] = b * 0.6;
    }
    
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const mat = new THREE.PointsMaterial({
        size: 0.3, vertexColors: true, transparent: true, opacity: 0.9
    });
    
    asteroidBelt = new THREE.Points(geom, mat);
    scene.add(asteroidBelt);
}

function createKuiperBelt() {
    const count = 1200;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const r = 90 + Math.random() * 40;
        const a = Math.random() * Math.PI * 2;
        positions[i3] = Math.cos(a) * r;
        positions[i3 + 1] = (Math.random() - 0.5) * 8;
        positions[i3 + 2] = Math.sin(a) * r;
        
        const b = 0.3 + Math.random() * 0.2;
        colors[i3] = b * 0.7;
        colors[i3 + 1] = b * 0.8;
        colors[i3 + 2] = b * 0.9;
    }
    
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const mat = new THREE.PointsMaterial({
        size: 0.4, vertexColors: true, transparent: true, opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    kuiperBelt = new THREE.Points(geom, mat);
    scene.add(kuiperBelt);
}

// ============================================
// ANIMATION
// ============================================

function animate() {
    requestAnimationFrame(animate);
    
    const delta = clock.getDelta();
    const time = clock.getElapsedTime();
    
    state.fps = Math.round(1 / delta);
    if (DOM.fpsCounter) DOM.fpsCounter.textContent = state.fps;
    
    if (state.isPlaying) {
        state.simTime += delta * state.timeSpeed * (state.reverseTime ? -1 : 1);
        updateSimTime();
        animateSun(time);
        animatePlanets(time);
        animateAsteroids();
        animateBackground();
    }
    
    if (state.followTarget && planets[state.followTarget]) {
        const pos = new THREE.Vector3();
        planets[state.followTarget].mesh.getWorldPosition(pos);
        controls.target.lerp(pos, 0.05);
    }
    
    updateLabels();
    controls.update();
    renderer.render(scene, camera);
}

function updateSimTime() {
    const h = Math.floor(Math.abs(state.simTime) / 3600) % 24;
    const m = Math.floor(Math.abs(state.simTime) / 60) % 60;
    const s = Math.floor(Math.abs(state.simTime)) % 60;
    if (DOM.simTime) DOM.simTime.textContent = 
        `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
}

function animateSun(time) {
    if (!planets.sun) return;
    const group = planets.sun.group;
    group.children[0].rotation.y += 0.001 * state.timeSpeed;
    
    group.children.forEach(child => {
        if (child.userData.type === 'corona') {
            const pulse = 1 + Math.sin(time * 2 + child.userData.index) * 0.08;
            const scale = child.userData.baseScale * pulse * state.coronaIntensity;
            child.scale.set(scale, scale, 1);
        }
        if (child.userData.type === 'lensFlare') {
            child.material.opacity = child.userData.baseOp * state.flareIntensity * 
                (0.8 + Math.sin(time * 3) * 0.2);
        }
    });
    
    if (sunLight) sunLight.intensity = state.sunLightIntensity;
}

function animatePlanets(time) {
    const dir = state.reverseTime ? -1 : 1;
    
    Object.entries(planets).forEach(([key, p]) => {
        if (key === 'sun') return;
        
        p.angle += p.data.orbitSpeed * state.timeSpeed * dir;
        const dist = p.data.distance * state.orbitScale;
        const x = Math.cos(p.angle) * dist;
        const z = Math.sin(p.angle) * dist;
        
        p.mesh.position.set(x, 0, z);
        
        if (p.mesh.userData.atmosphere) {
            p.mesh.userData.atmosphere.position.set(x, 0, z);
        }
        if (p.mesh.userData.clouds) {
            p.mesh.userData.clouds.position.set(x, 0, z);
            p.mesh.userData.clouds.rotation.y += 0.002 * state.timeSpeed * dir;
        }
        if (p.mesh.userData.ring) {
            p.mesh.userData.ring.position.set(x, 0, z);
        }
        
        p.mesh.rotation.y += p.data.rotationSpeed * state.timeSpeed * dir;
        
        if (p.mesh.userData.moon) {
            const ma = time * 0.5 * dir;
            p.mesh.userData.moon.position.set(
                Math.cos(ma) * 2.5 * state.planetScale,
                0,
                Math.sin(ma) * 2.5 * state.planetScale
            );
        }
    });
}

function animateAsteroids() {
    if (asteroidBelt) asteroidBelt.rotation.y += 0.0002 * state.timeSpeed;
    if (kuiperBelt) kuiperBelt.rotation.y += 0.00005 * state.timeSpeed;
}

function animateBackground() {
    if (galaxy) galaxy.rotation.y += 0.00005 * state.timeSpeed;
}

function updateLabels() {
    if (!state.showLabels) {
        Object.values(planetLabels).forEach(l => l.element.style.display = 'none');
        return;
    }
    
    Object.entries(planetLabels).forEach(([key, label]) => {
        const p = planets[key];
        if (!p) return;
        
        const pos = new THREE.Vector3();
        p.mesh.getWorldPosition(pos);
        pos.y += p.data.radius * state.planetScale * 1.5;
        
        const screen = pos.project(camera);
        if (screen.z > 1) {
            label.element.style.display = 'none';
        } else {
            label.element.style.display = 'block';
            label.element.style.left = (screen.x * 0.5 + 0.5) * window.innerWidth + 'px';
            label.element.style.top = (-screen.y * 0.5 + 0.5) * window.innerHeight + 'px';
        }
    });
}

// ============================================
// EVENT HANDLERS
// ============================================

function setupEventListeners() {
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onMouseClick);
    
    DOM.panelToggle?.addEventListener('click', () => DOM.controlPanel?.classList.toggle('collapsed'));
    document.getElementById('panel-close')?.addEventListener('click', () => 
        DOM.controlPanel?.classList.add('collapsed'));
    
    // Quick buttons
    document.getElementById('btn-reset-camera')?.addEventListener('click', resetCamera);
    document.getElementById('btn-toggle-orbits')?.addEventListener('click', toggleOrbits);
    document.getElementById('btn-toggle-labels')?.addEventListener('click', toggleLabels);
    document.getElementById('btn-toggle-asteroids')?.addEventListener('click', toggleAsteroids);
    document.getElementById('btn-screenshot')?.addEventListener('click', takeScreenshot);
    document.getElementById('btn-play-pause')?.addEventListener('click', togglePlayPause);
    
    document.getElementById('close-panel')?.addEventListener('click', closeInfoPanel);
    document.getElementById('btn-focus-planet')?.addEventListener('click', () => 
        state.selectedObject && focusOnObject(state.selectedObject));
    document.getElementById('btn-follow-planet')?.addEventListener('click', () => {
        if (state.selectedObject) {
            state.followTarget = state.selectedObject;
            const sel = document.getElementById('camera-target');
            if (sel) sel.value = state.selectedObject;
        }
    });
    
    setupControlPanelListeners();
}

function setupControlPanelListeners() {
    // Speed
    const speedSlider = document.getElementById('speed-slider');
    const speedValue = document.getElementById('speed-value');
    speedSlider?.addEventListener('input', () => {
        state.timeSpeed = parseFloat(speedSlider.value);
        if (speedValue) speedValue.textContent = state.timeSpeed.toFixed(1) + 'x';
    });
    
    document.querySelectorAll('.preset-btn[data-speed]').forEach(btn => {
        btn.addEventListener('click', () => {
            const speed = parseFloat(btn.dataset.speed);
            state.timeSpeed = speed;
            if (speedSlider) speedSlider.value = speed;
            if (speedValue) speedValue.textContent = speed.toFixed(1) + 'x';
            document.querySelectorAll('.preset-btn[data-speed]').forEach(b => 
                b.classList.toggle('active', parseFloat(b.dataset.speed) === speed));
        });
    });
    
    // Toggles
    const toggles = [
        ['reverse-time', v => state.reverseTime = v],
        ['auto-rotate', v => controls.autoRotate = v],
        ['show-orbits', v => { state.showOrbits = v; orbitLines.forEach(l => l.visible = v); }],
        ['show-labels', v => state.showLabels = v],
        ['show-asteroids', v => { state.showAsteroids = v; if (asteroidBelt) asteroidBelt.visible = v; }],
        ['show-kuiper', v => { state.showKuiper = v; if (kuiperBelt) kuiperBelt.visible = v; }],
        ['show-galaxy', v => { state.showGalaxy = v; if (galaxy) galaxy.visible = v; }],
        ['show-nebulae', v => { state.showNebulae = v; nebulae.forEach(n => n.visible = v); }]
    ];
    
    toggles.forEach(([id, cb]) => {
        const el = document.getElementById(id);
        el?.addEventListener('change', () => cb(el.checked));
    });
    
    // Sliders
    const sliders = [
        ['corona-intensity', 'corona-value', v => state.coronaIntensity = v],
        ['flare-intensity', 'flare-value', v => state.flareIntensity = v],
        ['sun-light', 'light-value', v => state.sunLightIntensity = v],
        ['atmosphere-intensity', 'atmo-value', v => { 
            state.atmosphereIntensity = v;
            Object.values(planets).forEach(p => {
                if (p.mesh.userData.atmosphere && p.data.atmosphere) {
                    p.mesh.userData.atmosphere.material.opacity = p.data.atmosphere.opacity * v;
                }
            });
        }],
        ['exposure', 'exposure-value', v => { state.exposure = v; renderer.toneMappingExposure = v; }]
    ];
    
    sliders.forEach(([sid, vid, cb]) => {
        const slider = document.getElementById(sid);
        const val = document.getElementById(vid);
        slider?.addEventListener('input', () => {
            const v = parseFloat(slider.value);
            cb(v);
            if (val) val.textContent = v.toFixed(1);
        });
    });
    
    // Camera target
    document.getElementById('camera-target')?.addEventListener('change', e => {
        const t = e.target.value;
        if (t === 'free') state.followTarget = null;
        else { focusOnObject(t); state.followTarget = t; }
    });
}

function onMouseMove(e) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const meshes = Object.values(planets).map(p => p.mesh);
    const intersects = raycaster.intersectObjects(meshes, true);
    
    if (intersects.length > 0) {
        document.body.classList.add('hovering-planet');
        let target = intersects[0].object;
        while (target.parent && !target.userData.name) target = target.parent;
        if (target.userData.name) showTooltip(e.clientX, e.clientY, PLANET_DATA[target.userData.name]?.name);
    } else {
        document.body.classList.remove('hovering-planet');
        hideTooltip();
    }
}

function onMouseClick(e) {
    if (e.target.closest('#control-panel, #info-panel, #quick-actions, .panel-toggle, #main-header')) return;
    
    raycaster.setFromCamera(mouse, camera);
    const meshes = Object.values(planets).map(p => p.mesh);
    const intersects = raycaster.intersectObjects(meshes, true);
    
    if (intersects.length > 0) {
        let target = intersects[0].object;
        while (target.parent && !target.userData.name) target = target.parent;
        if (target.userData.name) selectObject(target.userData.name);
    }
}

function showTooltip(x, y, text) {
    if (!DOM.tooltip || !DOM.tooltipText) return;
    DOM.tooltip.classList.remove('hidden');
    DOM.tooltipText.textContent = text || '';
    DOM.tooltip.style.left = x + 'px';
    DOM.tooltip.style.top = y + 'px';
}

function hideTooltip() {
    DOM.tooltip?.classList.add('hidden');
}

function selectObject(name) {
    state.selectedObject = name;
    const data = PLANET_DATA[name];
    if (!data) return;
    
    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setEl('planet-name', data.name);
    setEl('planet-type', data.type);
    setEl('planet-distance', data.distanceFromSun);
    setEl('planet-period', data.orbitalPeriod);
    setEl('planet-temp', data.surfaceTemp);
    setEl('planet-gravity', data.gravity);
    setEl('planet-moons', data.moons);
    setEl('planet-diameter', data.diameter);
    setEl('planet-fact', data.fact);
    
    const compBars = document.getElementById('composition-bars');
    if (compBars && data.composition) {
        compBars.innerHTML = data.composition.map(c => `
            <div class="composition-bar">
                <span class="bar-label">${c.name}</span>
                <div class="bar-track"><div class="bar-fill" style="width:${c.value}%;background:${c.color}"></div></div>
                <span class="bar-value">${c.value}%</span>
            </div>
        `).join('');
    }
    
    const icon = document.getElementById('planet-icon');
    if (icon) icon.style.background = `linear-gradient(135deg, #${data.color?.toString(16).padStart(6,'0')||'4fc3f7'}, #${(data.atmosphere?.color||data.color)?.toString(16).padStart(6,'0')||'b388ff'})`;
    
    DOM.infoPanel?.classList.remove('hidden');
    focusOnObject(name);
}

function focusOnObject(name) {
    const p = planets[name];
    if (!p) return;
    
    const pos = new THREE.Vector3();
    p.mesh.getWorldPosition(pos);
    const offset = p.data.radius * state.planetScale * 6 + 15;
    
    animateCamera(
        new THREE.Vector3(pos.x + offset * 0.5, pos.y + offset * 0.4, pos.z + offset),
        pos
    );
}

function animateCamera(targetPos, lookAt) {
    const startPos = camera.position.clone();
    const startTarget = controls.target.clone();
    const start = Date.now();
    const duration = 1200;
    
    function update() {
        const t = Math.min((Date.now() - start) / duration, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        camera.position.lerpVectors(startPos, targetPos, ease);
        controls.target.lerpVectors(startTarget, lookAt, ease);
        controls.update();
        if (t < 1) requestAnimationFrame(update);
    }
    update();
}

// UI Actions
function togglePlayPause() {
    state.isPlaying = !state.isPlaying;
    const pause = document.getElementById('icon-pause');
    const play = document.getElementById('icon-play');
    const btn = document.getElementById('btn-play-pause');
    if (pause) pause.style.display = state.isPlaying ? 'block' : 'none';
    if (play) play.style.display = state.isPlaying ? 'none' : 'block';
    btn?.classList.toggle('active', state.isPlaying);
}

function resetCamera() {
    state.followTarget = null;
    const sel = document.getElementById('camera-target');
    if (sel) sel.value = 'free';
    animateCamera(new THREE.Vector3(60, 45, 90), new THREE.Vector3(0, 0, 0));
}

function toggleOrbits() {
    state.showOrbits = !state.showOrbits;
    const el = document.getElementById('show-orbits');
    if (el) el.checked = state.showOrbits;
    orbitLines.forEach(l => l.visible = state.showOrbits);
}

function toggleLabels() {
    state.showLabels = !state.showLabels;
    const el = document.getElementById('show-labels');
    if (el) el.checked = state.showLabels;
}

function toggleAsteroids() {
    state.showAsteroids = !state.showAsteroids;
    const el = document.getElementById('show-asteroids');
    if (el) el.checked = state.showAsteroids;
    if (asteroidBelt) asteroidBelt.visible = state.showAsteroids;
}

function takeScreenshot() {
    const link = document.createElement('a');
    link.download = `cosmos-${Date.now()}.png`;
    link.href = renderer.domElement.toDataURL('image/png');
    link.click();
}

function closeInfoPanel() {
    DOM.infoPanel?.classList.add('hidden');
    state.selectedObject = null;
}

// Keyboard
function setupKeyboardShortcuts() {
    window.addEventListener('keydown', e => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
        
        switch (e.key.toLowerCase()) {
            case ' ': e.preventDefault(); togglePlayPause(); break;
            case 'r': resetCamera(); break;
            case 'o': toggleOrbits(); break;
            case 'l': toggleLabels(); break;
            case 'a': toggleAsteroids(); break;
            case 'g':
                state.showGalaxy = !state.showGalaxy;
                if (galaxy) galaxy.visible = state.showGalaxy;
                break;
            case 'f':
                document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
                break;
            case 's': if (!e.ctrlKey) takeScreenshot(); break;
            case 'escape': state.followTarget = null; closeInfoPanel(); break;
            case '?': DOM.shortcutsHelp?.classList.toggle('hidden'); break;
            case '0': selectObject('sun'); break;
            case '1': selectObject('mercury'); break;
            case '2': selectObject('venus'); break;
            case '3': selectObject('earth'); break;
            case '4': selectObject('mars'); break;
            case '5': selectObject('jupiter'); break;
            case '6': selectObject('saturn'); break;
            case '7': selectObject('uranus'); break;
            case '8': selectObject('neptune'); break;
        }
    });
}

// Start
init();
