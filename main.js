// ============================================
// COSMOS EXPLORER - Ultimate Solar System
// Ultra-Realistic Sun & Complete Planets
// ============================================

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ============================================
// PLANET DATA
// ============================================

const PLANET_DATA = {
    sun: {
        name: 'Sun',
        type: 'G-type Main Sequence Star',
        radius: 5,
        color: 0xffaa00,
        distance: 0,
        orbitSpeed: 0,
        rotationSpeed: 0.0005,
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
        fact: 'The Sun contains 99.86% of all mass in our solar system and converts 600 million tons of hydrogen into helium every second.'
    },
    mercury: {
        name: 'Mercury',
        type: 'Terrestrial Planet',
        radius: 0.35,
        distance: 10,
        orbitSpeed: 0.035,
        rotationSpeed: 0.005,
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
        fact: 'Mercury has the most extreme temperature swings of any planet.'
    },
    venus: {
        name: 'Venus',
        type: 'Terrestrial Planet',
        radius: 0.85,
        distance: 14,
        orbitSpeed: 0.012,
        rotationSpeed: -0.002,
        color: 0xe8b84a,
        atmosphere: { color: 0xffd699, opacity: 0.5, scale: 1.15 },
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
        fact: 'A day on Venus is longer than its year.'
    },
    earth: {
        name: 'Earth',
        type: 'Terrestrial Planet',
        radius: 0.9,
        distance: 18,
        orbitSpeed: 0.01,
        rotationSpeed: 0.01,
        color: 0x4a90d9,
        atmosphere: { color: 0x87ceeb, opacity: 0.35, scale: 1.1 },
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
        fact: 'Earth is the only planet known to harbor life.'
    },
    mars: {
        name: 'Mars',
        type: 'Terrestrial Planet',
        radius: 0.5,
        distance: 24,
        orbitSpeed: 0.008,
        rotationSpeed: 0.009,
        color: 0xcd5c5c,
        atmosphere: { color: 0xd4a574, opacity: 0.2, scale: 1.06 },
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
        fact: 'Mars has the largest volcano in the solar system - Olympus Mons.'
    },
    jupiter: {
        name: 'Jupiter',
        type: 'Gas Giant',
        radius: 2.8,
        distance: 38,
        orbitSpeed: 0.002,
        rotationSpeed: 0.025,
        color: 0xd4a574,
        atmosphere: { color: 0xe0d5b8, opacity: 0.3, scale: 1.03 },
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
        fact: 'Jupiter\'s Great Red Spot is a storm larger than Earth.'
    },
    saturn: {
        name: 'Saturn',
        type: 'Gas Giant',
        radius: 2.4,
        distance: 52,
        orbitSpeed: 0.0008,
        rotationSpeed: 0.022,
        color: 0xead6a6,
        atmosphere: { color: 0xf5e6d0, opacity: 0.25, scale: 1.04 },
        hasRings: true,
        ringInnerRadius: 3.0,
        ringOuterRadius: 5.5,
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
        fact: 'Saturn\'s rings are only about 10 meters thick.'
    },
    uranus: {
        name: 'Uranus',
        type: 'Ice Giant',
        radius: 1.6,
        distance: 68,
        orbitSpeed: 0.0003,
        rotationSpeed: -0.015,
        color: 0x7ec8e3,
        atmosphere: { color: 0xadd8e6, opacity: 0.4, scale: 1.07 },
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
        fact: 'Uranus rotates on its side with a 98° axial tilt.'
    },
    neptune: {
        name: 'Neptune',
        type: 'Ice Giant',
        radius: 1.5,
        distance: 82,
        orbitSpeed: 0.0001,
        rotationSpeed: 0.018,
        color: 0x4169e1,
        atmosphere: { color: 0x6495ed, opacity: 0.4, scale: 1.08 },
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
        fact: 'Neptune has the strongest winds - up to 2,100 km/h.'
    }
};

// ============================================
// GLOBAL STATE
// ============================================

let scene, camera, renderer, controls;
let sun, sunLight;
let planets = {}, planetLabels = {};
let orbitLines = [], asteroidBelt, kuiperBelt;
let galaxy, nebulae = [];
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
    scene.background = new THREE.Color(0x000005);
}

function setupCamera() {
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 5000);
    camera.position.set(45, 35, 70);
}

function setupRenderer() {
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: 'high-performance',
        preserveDrawingBuffer: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    DOM.container.appendChild(renderer.domElement);
}

function setupControls() {
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 8;
    controls.maxDistance = 400;
    controls.maxPolarAngle = Math.PI * 0.95;
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

function createSceneElements() {
    updateLoading('Creating galaxy...', 10);
    createGalaxy();
    
    updateLoading('Generating nebulae...', 20);
    createNebulae();
    
    updateLoading('Placing stars...', 30);
    createStarfield();
    
    updateLoading('Setting up lighting...', 40);
    createLighting();
    
    updateLoading('Generating realistic Sun...', 50);
    createRealisticSun();
    
    updateLoading('Creating planets...', 60);
    createAllPlanets();
    
    updateLoading('Drawing orbits...', 75);
    createOrbitLines();
    
    updateLoading('Generating asteroids...', 85);
    createAsteroidBelt();
    createKuiperBelt();
    
    updateLoading('Finalizing...', 100);
    
    state.objectCount = countObjects();
    if (DOM.objectCount) DOM.objectCount.textContent = state.objectCount;
    
    setTimeout(() => DOM.loading?.classList.add('hidden'), 800);
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
    const count = 80000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    const palette = [
        new THREE.Color(0xff6b35), new THREE.Color(0xf7c59f),
        new THREE.Color(0x2e86ab), new THREE.Color(0xa23b72),
        new THREE.Color(0xf4d35e)
    ];

    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const arm = i % 5;
        const radius = Math.random() * 900 + 200;
        const spin = radius * 0.002;
        const branch = (arm / 5) * Math.PI * 2;
        const rand = Math.pow(Math.random(), 3) * 80;
        
        positions[i3] = Math.cos(branch + spin) * radius + (Math.random() - 0.5) * rand;
        positions[i3 + 1] = (Math.random() - 0.5) * rand * 0.25 - 350;
        positions[i3 + 2] = Math.sin(branch + spin) * radius + (Math.random() - 0.5) * rand - 600;
        
        const color = palette[Math.floor(Math.random() * palette.length)];
        const bright = 0.4 + (1 - radius / 1100) * 0.6;
        colors[i3] = color.r * bright;
        colors[i3 + 1] = color.g * bright;
        colors[i3 + 2] = color.b * bright;
    }
    
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const mat = new THREE.PointsMaterial({
        size: 2, vertexColors: true, transparent: true,
        opacity: 0.65, blending: THREE.AdditiveBlending, depthWrite: false
    });
    
    galaxy = new THREE.Points(geom, mat);
    galaxy.rotation.x = Math.PI * 0.1;
    scene.add(galaxy);
}

function createNebulae() {
    const configs = [
        { color: 0x8b3fa0, pos: [-500, 200, -800], scale: 600, op: 0.25 },
        { color: 0x3a8ca5, pos: [600, -150, -700], scale: 550, op: 0.2 },
        { color: 0xc44569, pos: [350, 250, -900], scale: 650, op: 0.18 },
        { color: 0x2d6a4f, pos: [-400, -200, -600], scale: 500, op: 0.22 }
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
    
    for (let i = 0; i < 8; i++) {
        const x = 256 + (Math.random() - 0.5) * 180;
        const y = 256 + (Math.random() - 0.5) * 180;
        const r = 80 + Math.random() * 180;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        grad.addColorStop(0, `rgba(${c.r*255|0},${c.g*255|0},${c.b*255|0},0.5)`);
        grad.addColorStop(0.4, `rgba(${c.r*200|0},${c.g*200|0},${c.b*200|0},0.2)`);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 512, 512);
    }
    return new THREE.CanvasTexture(canvas);
}

function createStarfield() {
    const layers = [
        { count: 20000, size: 0.4, minR: 500, maxR: 1200, op: 0.5 },
        { count: 8000, size: 1.0, minR: 300, maxR: 700, op: 0.7 },
        { count: 2000, size: 1.8, minR: 150, maxR: 450, op: 0.9 }
    ];
    
    const starColors = [
        new THREE.Color(0xffffff), new THREE.Color(0xffeedd),
        new THREE.Color(0xaaccff), new THREE.Color(0xffddaa),
        new THREE.Color(0xccddff)
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
            const b = 0.5 + Math.random() * 0.5;
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
    // Very dim ambient for deep space
    scene.add(new THREE.AmbientLight(0x0a0a15, 0.08));
    
    // Main sun light - intense point light
    sunLight = new THREE.PointLight(0xfff0dd, state.sunLightIntensity, 600, 1.5);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);
    
    // Secondary warm fill
    const fillLight = new THREE.PointLight(0xffaa44, 0.3, 300);
    fillLight.position.set(0, 0, 0);
    scene.add(fillLight);
}

// ============================================
// ULTRA-REALISTIC SUN
// ============================================

function createRealisticSun() {
    const sunGroup = new THREE.Group();
    sunGroup.userData = { name: 'sun', ...PLANET_DATA.sun };
    
    // Main sun sphere with detailed texture
    const sunGeom = new THREE.SphereGeometry(PLANET_DATA.sun.radius, 128, 128);
    const sunTexture = createRealisticSunTexture();
    const sunMat = new THREE.MeshBasicMaterial({ map: sunTexture });
    sun = new THREE.Mesh(sunGeom, sunMat);
    sunGroup.add(sun);
    
    // Chromosphere (thin orange-red layer)
    const chromoGeom = new THREE.SphereGeometry(PLANET_DATA.sun.radius * 1.01, 64, 64);
    const chromoMat = new THREE.MeshBasicMaterial({
        color: 0xff6600,
        transparent: true,
        opacity: 0.15,
        side: THREE.FrontSide
    });
    const chromosphere = new THREE.Mesh(chromoGeom, chromoMat);
    sunGroup.add(chromosphere);
    
    // Inner corona glow
    addSunGlow(sunGroup, 12, 0xffee88, 0xffaa00, 0.85);
    addSunGlow(sunGroup, 18, 0xffcc44, 0xff7700, 0.5);
    addSunGlow(sunGroup, 28, 0xff8833, 0xff4400, 0.3);
    addSunGlow(sunGroup, 40, 0xff5522, 0xff2200, 0.15);
    
    // Solar prominences / Flares around the edge
    createSolarProminences(sunGroup);
    
    // Corona rays
    createCoronaRays(sunGroup);
    
    scene.add(sunGroup);
    planets.sun = { mesh: sun, group: sunGroup, data: PLANET_DATA.sun, angle: 0 };
}

function createRealisticSunTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    // Base gradient - yellow/orange with hot spots
    const baseGrad = ctx.createRadialGradient(1024, 512, 0, 1024, 512, 1024);
    baseGrad.addColorStop(0, '#fff8e0');
    baseGrad.addColorStop(0.2, '#ffe066');
    baseGrad.addColorStop(0.4, '#ffbb33');
    baseGrad.addColorStop(0.6, '#ff9922');
    baseGrad.addColorStop(0.8, '#ff7711');
    baseGrad.addColorStop(1, '#ff5500');
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, 2048, 1024);
    
    // Granulation pattern (convection cells)
    for (let i = 0; i < 25000; i++) {
        const x = Math.random() * 2048;
        const y = Math.random() * 1024;
        const size = 1 + Math.random() * 6;
        const bright = Math.random();
        
        if (bright > 0.6) {
            // Bright granule centers
            ctx.fillStyle = `rgba(255, 255, ${180 + Math.random() * 75}, ${bright * 0.4})`;
        } else if (bright < 0.3) {
            // Dark intergranular lanes
            ctx.fillStyle = `rgba(${180 + Math.random() * 40}, ${80 + Math.random() * 40}, 0, ${(1 - bright) * 0.25})`;
        } else {
            // Medium orange
            ctx.fillStyle = `rgba(255, ${150 + Math.random() * 60}, ${50 + Math.random() * 50}, 0.2)`;
        }
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Sunspots (dark, cool regions)
    const sunspotCount = 6 + Math.floor(Math.random() * 8);
    for (let i = 0; i < sunspotCount; i++) {
        const x = 150 + Math.random() * 1748;
        const y = 100 + Math.random() * 824;
        const outerR = 20 + Math.random() * 50;
        const innerR = outerR * 0.5;
        
        // Penumbra (outer, lighter)
        const penumbra = ctx.createRadialGradient(x, y, innerR, x, y, outerR);
        penumbra.addColorStop(0, 'rgba(80, 40, 10, 0.9)');
        penumbra.addColorStop(0.7, 'rgba(120, 60, 20, 0.5)');
        penumbra.addColorStop(1, 'rgba(180, 90, 30, 0)');
        ctx.fillStyle = penumbra;
        ctx.beginPath();
        ctx.arc(x, y, outerR, 0, Math.PI * 2);
        ctx.fill();
        
        // Umbra (inner, darkest)
        const umbra = ctx.createRadialGradient(x, y, 0, x, y, innerR);
        umbra.addColorStop(0, 'rgba(20, 10, 5, 0.95)');
        umbra.addColorStop(0.8, 'rgba(50, 25, 10, 0.8)');
        umbra.addColorStop(1, 'rgba(80, 40, 10, 0.6)');
        ctx.fillStyle = umbra;
        ctx.beginPath();
        ctx.arc(x, y, innerR, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Faculae (bright active regions)
    for (let i = 0; i < 30; i++) {
        const x = Math.random() * 2048;
        const y = Math.random() * 1024;
        const r = 25 + Math.random() * 50;
        
        const fac = ctx.createRadialGradient(x, y, 0, x, y, r);
        fac.addColorStop(0, 'rgba(255, 255, 220, 0.5)');
        fac.addColorStop(0.5, 'rgba(255, 240, 180, 0.25)');
        fac.addColorStop(1, 'rgba(255, 220, 150, 0)');
        ctx.fillStyle = fac;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Limb darkening (darker at edges)
    const limb = ctx.createRadialGradient(1024, 512, 300, 1024, 512, 512);
    limb.addColorStop(0, 'rgba(0, 0, 0, 0)');
    limb.addColorStop(0.7, 'rgba(0, 0, 0, 0)');
    limb.addColorStop(1, 'rgba(120, 40, 0, 0.4)');
    ctx.fillStyle = limb;
    ctx.fillRect(0, 0, 2048, 1024);
    
    return new THREE.CanvasTexture(canvas);
}

function addSunGlow(group, size, color1, color2, opacity) {
    const tex = createGlowTexture(color1, color2);
    const mat = new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        opacity: opacity * state.coronaIntensity,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(size, size, 1);
    sprite.userData = { type: 'glow', baseScale: size, baseOpacity: opacity };
    group.add(sprite);
}

function createGlowTexture(c1, c2) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 256;
    const ctx = canvas.getContext('2d');
    const col1 = new THREE.Color(c1);
    const col2 = new THREE.Color(c2);
    
    const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, `rgba(${col1.r*255|0},${col1.g*255|0},${col1.b*255|0},1)`);
    grad.addColorStop(0.2, `rgba(${col1.r*255|0},${col1.g*255|0},${col1.b*255|0},0.7)`);
    grad.addColorStop(0.5, `rgba(${col2.r*255|0},${col2.g*255|0},${col2.b*255|0},0.3)`);
    grad.addColorStop(0.8, `rgba(${col2.r*255|0},${col2.g*255|0},${col2.b*255|0},0.1)`);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
    
    return new THREE.CanvasTexture(canvas);
}

function createSolarProminences(group) {
    // Create multiple prominences around the sun edge
    const prominenceCount = 12;
    
    for (let i = 0; i < prominenceCount; i++) {
        const angle = (i / prominenceCount) * Math.PI * 2 + Math.random() * 0.3;
        const height = 1.5 + Math.random() * 3;
        const width = 0.3 + Math.random() * 0.5;
        
        // Create prominence using a curved shape
        const tex = createProminenceTexture();
        const mat = new THREE.SpriteMaterial({
            map: tex,
            transparent: true,
            opacity: 0.6 + Math.random() * 0.3,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            rotation: angle + Math.PI / 2
        });
        
        const sprite = new THREE.Sprite(mat);
        const dist = PLANET_DATA.sun.radius * 1.1;
        sprite.position.set(
            Math.cos(angle) * dist,
            Math.sin(angle) * dist,
            (Math.random() - 0.5) * 2
        );
        sprite.scale.set(width * 2, height * 2, 1);
        sprite.userData = {
            type: 'prominence',
            baseAngle: angle,
            speed: 0.2 + Math.random() * 0.5,
            phase: Math.random() * Math.PI * 2
        };
        
        group.add(sprite);
    }
}

function createProminenceTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    // Create a flame-like prominence shape
    const grad = ctx.createLinearGradient(64, 256, 64, 0);
    grad.addColorStop(0, 'rgba(255, 100, 50, 0.9)');
    grad.addColorStop(0.3, 'rgba(255, 150, 80, 0.7)');
    grad.addColorStop(0.6, 'rgba(255, 200, 100, 0.4)');
    grad.addColorStop(1, 'rgba(255, 220, 150, 0)');
    
    ctx.fillStyle = grad;
    
    // Draw wispy flame shape
    ctx.beginPath();
    ctx.moveTo(64, 256);
    ctx.bezierCurveTo(30, 200, 20, 150, 40, 80);
    ctx.bezierCurveTo(50, 40, 60, 20, 64, 0);
    ctx.bezierCurveTo(68, 20, 78, 40, 88, 80);
    ctx.bezierCurveTo(108, 150, 98, 200, 64, 256);
    ctx.fill();
    
    // Add some internal structure
    ctx.fillStyle = 'rgba(255, 200, 100, 0.4)';
    ctx.beginPath();
    ctx.moveTo(64, 240);
    ctx.bezierCurveTo(45, 180, 40, 120, 55, 60);
    ctx.bezierCurveTo(60, 30, 64, 20, 64, 40);
    ctx.bezierCurveTo(64, 20, 68, 30, 73, 60);
    ctx.bezierCurveTo(88, 120, 83, 180, 64, 240);
    ctx.fill();
    
    return new THREE.CanvasTexture(canvas);
}

function createCoronaRays(group) {
    // Create streaky corona rays emanating from the sun
    const rayCount = 24;
    
    for (let i = 0; i < rayCount; i++) {
        const angle = (i / rayCount) * Math.PI * 2;
        const length = 6 + Math.random() * 8;
        const width = 0.5 + Math.random() * 1;
        
        const tex = createCoronaRayTexture();
        const mat = new THREE.SpriteMaterial({
            map: tex,
            transparent: true,
            opacity: 0.15 + Math.random() * 0.15,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            rotation: angle + Math.PI / 2
        });
        
        const sprite = new THREE.Sprite(mat);
        const dist = PLANET_DATA.sun.radius + length / 2;
        sprite.position.set(
            Math.cos(angle) * dist,
            Math.sin(angle) * dist,
            0
        );
        sprite.scale.set(width, length, 1);
        sprite.userData = { type: 'coronaRay', baseOpacity: mat.opacity };
        
        group.add(sprite);
    }
}

function createCoronaRayTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    const grad = ctx.createLinearGradient(32, 256, 32, 0);
    grad.addColorStop(0, 'rgba(255, 200, 100, 0.8)');
    grad.addColorStop(0.3, 'rgba(255, 150, 80, 0.4)');
    grad.addColorStop(0.6, 'rgba(255, 100, 50, 0.15)');
    grad.addColorStop(1, 'rgba(255, 80, 30, 0)');
    
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 256);
    
    // Fade edges
    const edgeGrad = ctx.createLinearGradient(0, 128, 64, 128);
    edgeGrad.addColorStop(0, 'rgba(0, 0, 0, 1)');
    edgeGrad.addColorStop(0.3, 'rgba(0, 0, 0, 0)');
    edgeGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0)');
    edgeGrad.addColorStop(1, 'rgba(0, 0, 0, 1)');
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = edgeGrad;
    ctx.fillRect(0, 0, 64, 256);
    
    return new THREE.CanvasTexture(canvas);
}

// ============================================
// PLANETS
// ============================================

function createAllPlanets() {
    Object.keys(PLANET_DATA).forEach(key => {
        if (key !== 'sun') {
            createPlanet(key, PLANET_DATA[key]);
        }
    });
}

function createPlanet(key, data) {
    const group = new THREE.Group();
    group.userData = { name: key, ...data };
    
    // Main planet sphere
    const geom = new THREE.SphereGeometry(data.radius * state.planetScale, 64, 64);
    const tex = createPlanetTexture(key, data);
    const mat = new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 0.8,
        metalness: 0.1
    });
    
    const planet = new THREE.Mesh(geom, mat);
    planet.position.x = data.distance * state.orbitScale;
    planet.userData = { name: key, ...data };
    group.add(planet);
    
    // Atmosphere glow
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
    
    // Cloud layer for Earth
    if (data.hasCloud) {
        const cloudGeom = new THREE.SphereGeometry(data.radius * state.planetScale * 1.015, 48, 48);
        const cloudTex = createCloudTexture();
        const cloudMat = new THREE.MeshStandardMaterial({
            map: cloudTex,
            transparent: true,
            opacity: 0.6,
            depthWrite: false
        });
        const clouds = new THREE.Mesh(cloudGeom, cloudMat);
        clouds.position.copy(planet.position);
        group.add(clouds);
        planet.userData.clouds = clouds;
    }
    
    // Moon for Earth
    if (data.hasMoon) {
        const moonGeom = new THREE.SphereGeometry(0.22 * state.planetScale, 32, 32);
        const moonTex = createMoonTexture();
        const moonMat = new THREE.MeshStandardMaterial({ map: moonTex, roughness: 0.95 });
        const moon = new THREE.Mesh(moonGeom, moonMat);
        moon.position.set(2.2 * state.planetScale, 0, 0);
        planet.add(moon);
        planet.userData.moon = moon;
    }
    
    // Rings for Saturn
    if (data.hasRings) {
        const ringGeom = new THREE.RingGeometry(
            data.ringInnerRadius * state.planetScale,
            data.ringOuterRadius * state.planetScale,
            128
        );
        const ringTex = createRingTexture();
        const ringMat = new THREE.MeshBasicMaterial({
            map: ringTex,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.85,
            depthWrite: false
        });
        const ring = new THREE.Mesh(ringGeom, ringMat);
        ring.rotation.x = Math.PI / 2.2;
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
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const c = new THREE.Color(data.color);
    
    // Base color
    ctx.fillStyle = `rgb(${c.r*255|0},${c.g*255|0},${c.b*255|0})`;
    ctx.fillRect(0, 0, 1024, 512);
    
    // Add surface variation
    for (let i = 0; i < 3000; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 512;
        const v = (Math.random() - 0.5) * 0.35;
        ctx.fillStyle = `rgba(${Math.min(255, Math.max(0, c.r*255+v*100))|0},${Math.min(255, Math.max(0, c.g*255+v*100))|0},${Math.min(255, Math.max(0, c.b*255+v*100))|0},0.5)`;
        ctx.fillRect(x, y, 2 + Math.random() * 6, 2 + Math.random() * 6);
    }
    
    // Planet-specific features
    if (key === 'earth') {
        // Oceans are base, add land
        ctx.fillStyle = '#2d5a27';
        // Americas
        ctx.beginPath();
        ctx.ellipse(180, 200, 70, 120, 0.2, 0, Math.PI * 2);
        ctx.fill();
        // Africa/Europe
        ctx.beginPath();
        ctx.ellipse(520, 180, 90, 130, -0.1, 0, Math.PI * 2);
        ctx.fill();
        // Asia
        ctx.beginPath();
        ctx.ellipse(720, 150, 120, 100, 0.1, 0, Math.PI * 2);
        ctx.fill();
        // Australia
        ctx.beginPath();
        ctx.ellipse(820, 330, 50, 40, 0, 0, Math.PI * 2);
        ctx.fill();
        // Ice caps
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.fillRect(0, 0, 1024, 25);
        ctx.fillRect(0, 487, 1024, 25);
    }
    
    if (key === 'jupiter') {
        const bands = ['#e8d5b7', '#d4a574', '#c9a97a', '#e0c9a0', '#b8956e', '#dfc9a8'];
        for (let i = 0; i < 14; i++) {
            const y = i * 36;
            ctx.fillStyle = bands[i % bands.length];
            ctx.globalAlpha = 0.5;
            ctx.fillRect(0, y, 1024, 36);
        }
        ctx.globalAlpha = 1;
        // Great Red Spot
        ctx.fillStyle = '#b34432';
        ctx.beginPath();
        ctx.ellipse(700, 260, 55, 35, 0.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#c44d3c';
        ctx.beginPath();
        ctx.ellipse(700, 260, 40, 25, 0.1, 0, Math.PI * 2);
        ctx.fill();
    }
    
    if (key === 'saturn') {
        const bands = ['#f5e6d0', '#ead6b8', '#e0c9a0', '#d6bc88'];
        for (let i = 0; i < 10; i++) {
            ctx.fillStyle = bands[i % bands.length];
            ctx.globalAlpha = 0.4;
            ctx.fillRect(0, i * 51, 1024, 51);
        }
        ctx.globalAlpha = 1;
    }
    
    if (key === 'mars') {
        // Polar ice caps
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.fillRect(0, 0, 1024, 22);
        ctx.fillRect(0, 490, 1024, 22);
        // Dark regions
        ctx.fillStyle = 'rgba(100, 50, 30, 0.4)';
        ctx.beginPath();
        ctx.ellipse(400, 256, 150, 80, 0, 0, Math.PI * 2);
        ctx.fill();
    }
    
    if (key === 'venus') {
        // Swirling clouds
        for (let i = 0; i < 40; i++) {
            const x = Math.random() * 1024;
            const y = Math.random() * 512;
            ctx.fillStyle = `rgba(255, 220, 180, ${0.2 + Math.random() * 0.2})`;
            ctx.beginPath();
            ctx.ellipse(x, y, 50 + Math.random() * 80, 20 + Math.random() * 30, Math.random() * Math.PI, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    if (key === 'mercury') {
        // Craters
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * 1024;
            const y = Math.random() * 512;
            const r = 3 + Math.random() * 15;
            ctx.fillStyle = `rgba(60, 50, 45, ${0.3 + Math.random() * 0.4})`;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    return new THREE.CanvasTexture(canvas);
}

function createCloudTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 1024, 512);
    
    for (let i = 0; i < 200; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 512;
        const size = 15 + Math.random() * 50;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, size);
        grad.addColorStop(0, 'rgba(255,255,255,0.7)');
        grad.addColorStop(0.5, 'rgba(255,255,255,0.35)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(x, y, size, size * 0.4, Math.random() * Math.PI, 0, Math.PI * 2);
        ctx.fill();
    }
    return new THREE.CanvasTexture(canvas);
}

function createMoonTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#8a8a8a';
    ctx.fillRect(0, 0, 512, 256);
    
    // Craters
    for (let i = 0; i < 200; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 256;
        const r = 2 + Math.random() * 12;
        const grad = ctx.createRadialGradient(x - r*0.3, y - r*0.3, 0, x, y, r);
        grad.addColorStop(0, '#aaa');
        grad.addColorStop(0.6, '#666');
        grad.addColorStop(1, '#888');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Maria (dark plains)
    ctx.fillStyle = 'rgba(60, 60, 70, 0.5)';
    ctx.beginPath();
    ctx.ellipse(180, 100, 70, 50, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(350, 160, 55, 40, -0.1, 0, Math.PI * 2);
    ctx.fill();
    
    return new THREE.CanvasTexture(canvas);
}

function createRingTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    // Multiple ring bands with gaps
    const bands = [
        { start: 0, end: 0.07, op: 0.25, col: [170, 150, 130] },
        { start: 0.07, end: 0.12, op: 0 }, // Cassini Division
        { start: 0.12, end: 0.35, op: 0.85, col: [200, 180, 160] },
        { start: 0.35, end: 0.38, op: 0.35, col: [160, 140, 120] },
        { start: 0.38, end: 0.58, op: 0.9, col: [220, 200, 175] },
        { start: 0.58, end: 0.62, op: 0.2, col: [140, 120, 100] },
        { start: 0.62, end: 0.78, op: 0.7, col: [190, 170, 150] },
        { start: 0.78, end: 0.88, op: 0.45, col: [165, 145, 125] },
        { start: 0.88, end: 1, op: 0.2, col: [140, 120, 100] }
    ];
    
    bands.forEach(band => {
        if (band.op === 0) return;
        const sx = band.start * 1024;
        const w = (band.end - band.start) * 1024;
        ctx.fillStyle = `rgba(${band.col[0]}, ${band.col[1]}, ${band.col[2]}, ${band.op})`;
        ctx.fillRect(sx, 0, w, 64);
        
        // Add texture
        for (let x = sx; x < sx + w; x += 3) {
            const b = 0.8 + Math.random() * 0.4;
            ctx.fillStyle = `rgba(${band.col[0]*b|0}, ${band.col[1]*b|0}, ${band.col[2]*b|0}, ${band.op * 0.6})`;
            ctx.fillRect(x, 0, 3, 64);
        }
    });
    
    return new THREE.CanvasTexture(canvas);
}

function createLabel(key, data, planet) {
    const div = document.createElement('div');
    div.className = 'planet-label';
    div.textContent = data.name.toUpperCase();
    div.style.cssText = `
        position: absolute; color: #fff; font-family: 'Orbitron', sans-serif;
        font-size: 11px; font-weight: 600; letter-spacing: 3px;
        pointer-events: none; text-shadow: 0 0 12px rgba(0,212,255,0.9), 0 0 4px rgba(0,0,0,0.9);
        opacity: 0.85; white-space: nowrap; transform: translate(-50%, -100%);
        padding: 5px 10px; background: rgba(0,20,40,0.6); border-radius: 4px;
        border: 1px solid rgba(0,212,255,0.4);
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
            color: new THREE.Color().setHSL(0.55 + i * 0.035, 0.7, 0.45),
            transparent: true,
            opacity: 0.25
        });
        
        const line = new THREE.Line(geom, mat);
        scene.add(line);
        orbitLines.push(line);
    });
}

function createAsteroidBelt() {
    const count = 1000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const r = 30 + Math.random() * 6;
        const a = Math.random() * Math.PI * 2;
        positions[i3] = Math.cos(a) * r;
        positions[i3 + 1] = (Math.random() - 0.5) * 2;
        positions[i3 + 2] = Math.sin(a) * r;
        
        const b = 0.35 + Math.random() * 0.3;
        colors[i3] = b * 0.85;
        colors[i3 + 1] = b * 0.75;
        colors[i3 + 2] = b * 0.65;
    }
    
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    asteroidBelt = new THREE.Points(geom, new THREE.PointsMaterial({
        size: 0.25, vertexColors: true, transparent: true, opacity: 0.9
    }));
    scene.add(asteroidBelt);
}

function createKuiperBelt() {
    const count = 1500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const r = 95 + Math.random() * 45;
        const a = Math.random() * Math.PI * 2;
        positions[i3] = Math.cos(a) * r;
        positions[i3 + 1] = (Math.random() - 0.5) * 10;
        positions[i3 + 2] = Math.sin(a) * r;
        
        const b = 0.25 + Math.random() * 0.2;
        colors[i3] = b * 0.7;
        colors[i3 + 1] = b * 0.8;
        colors[i3 + 2] = b * 0.95;
    }
    
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    kuiperBelt = new THREE.Points(geom, new THREE.PointsMaterial({
        size: 0.35, vertexColors: true, transparent: true, opacity: 0.6,
        blending: THREE.AdditiveBlending
    }));
    scene.add(kuiperBelt);
}

// ============================================
// ANIMATION
// ============================================

function animate() {
    requestAnimationFrame(animate);
    
    const delta = clock.getDelta();
    const time = clock.getElapsedTime();
    
    state.fps = Math.round(1 / Math.max(delta, 0.001));
    if (DOM.fpsCounter) DOM.fpsCounter.textContent = Math.min(state.fps, 999);
    
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
    const h = Math.floor(Math.abs(state.simTime) / 3600) % 100;
    const m = Math.floor(Math.abs(state.simTime) / 60) % 60;
    const s = Math.floor(Math.abs(state.simTime)) % 60;
    if (DOM.simTime) DOM.simTime.textContent = 
        `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
}

function animateSun(time) {
    if (!planets.sun) return;
    const group = planets.sun.group;
    
    // Rotate sun surface
    group.children[0].rotation.y += PLANET_DATA.sun.rotationSpeed * state.timeSpeed;
    
    // Animate glows and prominences
    group.children.forEach(child => {
        if (child.userData.type === 'glow') {
            const pulse = 1 + Math.sin(time * 1.5 + child.userData.baseScale * 0.1) * 0.06;
            const scale = child.userData.baseScale * pulse * state.coronaIntensity;
            child.scale.set(scale, scale, 1);
            child.material.opacity = child.userData.baseOpacity * state.coronaIntensity;
        }
        if (child.userData.type === 'prominence') {
            const wave = Math.sin(time * child.userData.speed + child.userData.phase);
            child.material.opacity = (0.5 + wave * 0.3) * state.flareIntensity;
            const s = child.scale.y * (1 + wave * 0.1);
            child.scale.y = Math.max(1, s);
        }
        if (child.userData.type === 'coronaRay') {
            child.material.opacity = child.userData.baseOpacity * (0.8 + Math.sin(time * 2) * 0.2) * state.coronaIntensity;
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
            p.mesh.userData.clouds.rotation.y += 0.0015 * state.timeSpeed * dir;
        }
        if (p.mesh.userData.ring) {
            p.mesh.userData.ring.position.set(x, 0, z);
        }
        
        p.mesh.rotation.y += p.data.rotationSpeed * state.timeSpeed * dir;
        
        if (p.mesh.userData.moon) {
            const ma = time * 0.4 * dir;
            p.mesh.userData.moon.position.set(
                Math.cos(ma) * 2.2 * state.planetScale, 0,
                Math.sin(ma) * 2.2 * state.planetScale
            );
            p.mesh.userData.moon.rotation.y += 0.005 * state.timeSpeed * dir;
        }
    });
}

function animateAsteroids() {
    if (asteroidBelt) asteroidBelt.rotation.y += 0.00015 * state.timeSpeed;
    if (kuiperBelt) kuiperBelt.rotation.y += 0.00004 * state.timeSpeed;
}

function animateBackground() {
    if (galaxy) galaxy.rotation.y += 0.00003 * state.timeSpeed;
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
        pos.y += p.data.radius * state.planetScale * 1.8;
        
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
        ['exposure', 'exposure-value', v => { renderer.toneMappingExposure = v; }]
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
    const offset = p.data.radius * state.planetScale * 5 + 12;
    
    animateCamera(
        new THREE.Vector3(pos.x + offset * 0.5, pos.y + offset * 0.35, pos.z + offset),
        pos
    );
}

function animateCamera(targetPos, lookAt) {
    const startPos = camera.position.clone();
    const startTarget = controls.target.clone();
    const start = Date.now();
    const duration = 1000;
    
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
    animateCamera(new THREE.Vector3(45, 35, 70), new THREE.Vector3(0, 0, 0));
}

function toggleOrbits() {
    state.showOrbits = !state.showOrbits;
    const el = document.getElementById('show-orbits');
    if (el) el.checked = state.showOrbits;
    orbitLines.forEach(l => l.visible = state.showOrbits);
    document.getElementById('btn-toggle-orbits')?.classList.toggle('active', state.showOrbits);
}

function toggleLabels() {
    state.showLabels = !state.showLabels;
    const el = document.getElementById('show-labels');
    if (el) el.checked = state.showLabels;
    document.getElementById('btn-toggle-labels')?.classList.toggle('active', state.showLabels);
}

function toggleAsteroids() {
    state.showAsteroids = !state.showAsteroids;
    const el = document.getElementById('show-asteroids');
    if (el) el.checked = state.showAsteroids;
    if (asteroidBelt) asteroidBelt.visible = state.showAsteroids;
    document.getElementById('btn-toggle-asteroids')?.classList.toggle('active', state.showAsteroids);
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

// ============================================
// START
// ============================================

init();
