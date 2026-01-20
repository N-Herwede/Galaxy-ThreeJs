// ============================================
// Interactive 3D Solar System with Three.js
// Enhanced Version with Galaxy, Textures & Volumetric Lighting
// ============================================

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ============================================
// Planet Data with Enhanced Visuals
// ============================================

const planetData = {
    mercury: {
        name: 'Mercury',
        radius: 0.4,
        distance: 10,
        orbitSpeed: 0.04,
        rotationSpeed: 0.004,
        color: 0x9a8478,
        atmosphere: null,
        distanceFromSun: '57.9 million km',
        orbitalPeriod: '88 Earth days',
        fact: 'Mercury is the smallest planet in our solar system and the closest to the Sun. A year on Mercury is just 88 Earth days.'
    },
    venus: {
        name: 'Venus',
        radius: 0.9,
        distance: 15,
        orbitSpeed: 0.015,
        rotationSpeed: -0.002,
        color: 0xe8cda0,
        atmosphere: { color: 0xffd699, opacity: 0.3, scale: 1.08 },
        distanceFromSun: '108.2 million km',
        orbitalPeriod: '225 Earth days',
        fact: 'Venus rotates backwards compared to most planets, meaning the Sun rises in the west and sets in the east.'
    },
    earth: {
        name: 'Earth',
        radius: 1,
        distance: 20,
        orbitSpeed: 0.01,
        rotationSpeed: 0.02,
        color: 0x6b93d6,
        atmosphere: { color: 0x93cfef, opacity: 0.25, scale: 1.1 },
        hasMoon: true,
        distanceFromSun: '149.6 million km',
        orbitalPeriod: '365.25 days',
        fact: 'Earth is the only known planet with liquid water on its surface and the only place we know of that harbors life.'
    },
    mars: {
        name: 'Mars',
        radius: 0.5,
        distance: 25,
        orbitSpeed: 0.008,
        rotationSpeed: 0.018,
        color: 0xc1440e,
        atmosphere: { color: 0xd4a574, opacity: 0.15, scale: 1.05 },
        distanceFromSun: '227.9 million km',
        orbitalPeriod: '687 Earth days',
        fact: 'Mars has the largest volcano in the solar system, Olympus Mons, which is about three times the height of Mount Everest.'
    },
    jupiter: {
        name: 'Jupiter',
        radius: 3,
        distance: 35,
        orbitSpeed: 0.002,
        rotationSpeed: 0.04,
        color: 0xd8ca9d,
        atmosphere: { color: 0xe0d5b8, opacity: 0.2, scale: 1.03 },
        hasBands: true,
        distanceFromSun: '778.5 million km',
        orbitalPeriod: '11.9 Earth years',
        fact: 'Jupiter is so massive that it could fit all other planets inside it. Its Great Red Spot is a storm larger than Earth.'
    },
    saturn: {
        name: 'Saturn',
        radius: 2.5,
        distance: 45,
        orbitSpeed: 0.0009,
        rotationSpeed: 0.038,
        color: 0xead6b8,
        atmosphere: { color: 0xf0e6d2, opacity: 0.15, scale: 1.04 },
        hasRings: true,
        ringInnerRadius: 3.2,
        ringOuterRadius: 5.5,
        distanceFromSun: '1.4 billion km',
        orbitalPeriod: '29.4 Earth years',
        fact: 'Saturn\'s rings are made mostly of ice particles with some rocky debris. The rings span up to 282,000 km but are only about 10 meters thick.'
    },
    uranus: {
        name: 'Uranus',
        radius: 1.8,
        distance: 55,
        orbitSpeed: 0.0004,
        rotationSpeed: -0.03,
        color: 0xc9e9f0,
        atmosphere: { color: 0xadd8e6, opacity: 0.25, scale: 1.06 },
        distanceFromSun: '2.9 billion km',
        orbitalPeriod: '84 Earth years',
        fact: 'Uranus rotates on its side with an axial tilt of 98 degrees, possibly due to a collision with an Earth-sized object long ago.'
    },
    neptune: {
        name: 'Neptune',
        radius: 1.7,
        distance: 65,
        orbitSpeed: 0.0001,
        rotationSpeed: 0.032,
        color: 0x5b7fda,
        atmosphere: { color: 0x6495ed, opacity: 0.3, scale: 1.07 },
        distanceFromSun: '4.5 billion km',
        orbitalPeriod: '165 Earth years',
        fact: 'Neptune has the strongest winds in the solar system, with speeds reaching up to 2,100 km/h (1,300 mph).'
    }
};

// ============================================
// Global Variables
// ============================================

let scene, camera, renderer, controls;
let sun, sunGlow, sunCorona, planets = {}, orbitLines = [];
let galaxy, nebula, dustClouds = [];
let raycaster, mouse;
let isPlaying = true;
let timeSpeed = 1;
let selectedPlanet = null;
let clock = new THREE.Clock();
let composer;

// DOM Elements
const container = document.getElementById('canvas-container');
const loadingScreen = document.getElementById('loading');
const infoPanel = document.getElementById('info-panel');
const playPauseBtn = document.getElementById('play-pause-btn');
const btnIcon = document.getElementById('btn-icon');
const btnText = document.getElementById('btn-text');
const speedSlider = document.getElementById('speed-slider');
const speedValue = document.getElementById('speed-value');
const closePanel = document.getElementById('close-panel');

// ============================================
// Initialization
// ============================================

function init() {
    // Scene
    scene = new THREE.Scene();
    
    // Camera
    camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        2000
    );
    camera.position.set(50, 40, 80);

    // Renderer with enhanced settings
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 15;
    controls.maxDistance = 200;
    controls.enablePan = false;
    controls.autoRotate = false;
    controls.autoRotateSpeed = 0.3;

    // Raycaster for interaction
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Create scene elements in order
    createGalaxyBackground();
    createNebulae();
    createStarfield();
    createDustClouds();
    createLighting();
    createSun();
    createPlanets();
    createOrbitLines();

    // Event listeners
    setupEventListeners();

    // Hide loading screen
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
    }, 1500);

    // Start animation
    animate();
}

// ============================================
// Galaxy Background
// ============================================

function createGalaxyBackground() {
    // Create a massive galaxy spiral in the background
    const galaxyGeometry = new THREE.BufferGeometry();
    const galaxyCount = 50000;
    const positions = new Float32Array(galaxyCount * 3);
    const colors = new Float32Array(galaxyCount * 3);
    const sizes = new Float32Array(galaxyCount);

    const colorInside = new THREE.Color(0xff6030);
    const colorOutside = new THREE.Color(0x1b3984);

    for (let i = 0; i < galaxyCount; i++) {
        const i3 = i * 3;
        
        // Spiral galaxy distribution
        const radius = Math.random() * 500 + 100;
        const spinAngle = radius * 0.002;
        const branchAngle = ((i % 3) / 3) * Math.PI * 2;
        
        const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 50;
        const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 20;
        const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 50;

        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
        positions[i3 + 1] = randomY - 200; // Place below the solar system
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ - 300;

        // Color gradient from center to edge
        const mixedColor = colorInside.clone();
        mixedColor.lerp(colorOutside, radius / 600);
        
        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;

        sizes[i] = Math.random() * 2 + 0.5;
    }

    galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    galaxyGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const galaxyMaterial = new THREE.PointsMaterial({
        size: 1.5,
        sizeAttenuation: true,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    galaxy = new THREE.Points(galaxyGeometry, galaxyMaterial);
    galaxy.rotation.x = Math.PI * 0.1;
    scene.add(galaxy);
}

// ============================================
// Nebulae (Colorful gas clouds)
// ============================================

function createNebulae() {
    const nebulaColors = [
        { color: 0x6b3fa0, position: new THREE.Vector3(-300, 100, -400) },
        { color: 0x3a7ca5, position: new THREE.Vector3(400, -50, -350) },
        { color: 0x8b4557, position: new THREE.Vector3(200, 150, -500) },
        { color: 0x2d5a3d, position: new THREE.Vector3(-200, -100, -300) }
    ];

    nebulaColors.forEach(({ color, position }) => {
        const nebulaTexture = createNebulaTexture(color);
        const nebulaMaterial = new THREE.SpriteMaterial({
            map: nebulaTexture,
            transparent: true,
            opacity: 0.4,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        const nebulaSprite = new THREE.Sprite(nebulaMaterial);
        nebulaSprite.position.copy(position);
        nebulaSprite.scale.set(400, 400, 1);
        scene.add(nebulaSprite);
    });
}

function createNebulaTexture(baseColor) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    const color = new THREE.Color(baseColor);
    
    // Create multiple overlapping gradients for cloud effect
    for (let i = 0; i < 5; i++) {
        const x = 256 + (Math.random() - 0.5) * 100;
        const y = 256 + (Math.random() - 0.5) * 100;
        const radius = 150 + Math.random() * 100;
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, `rgba(${Math.floor(color.r * 255)}, ${Math.floor(color.g * 255)}, ${Math.floor(color.b * 255)}, 0.3)`);
        gradient.addColorStop(0.4, `rgba(${Math.floor(color.r * 200)}, ${Math.floor(color.g * 200)}, ${Math.floor(color.b * 200)}, 0.1)`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 512, 512);
    }

    return new THREE.CanvasTexture(canvas);
}

// ============================================
// Enhanced Starfield
// ============================================

function createStarfield() {
    // Layer 1: Distant tiny stars
    createStarLayer(15000, 0.3, 400, 800, 0.6);
    
    // Layer 2: Medium stars
    createStarLayer(5000, 0.8, 200, 500, 0.8);
    
    // Layer 3: Bright closer stars
    createStarLayer(1000, 1.5, 100, 300, 1.0);
    
    // Layer 4: Sparkling stars (animated)
    createSparklingStars(200, 150, 400);
}

function createStarLayer(count, size, minRadius, maxRadius, opacity) {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const starColors = [
        new THREE.Color(0xffffff),
        new THREE.Color(0xffeedd),
        new THREE.Color(0xaaccff),
        new THREE.Color(0xffddaa),
        new THREE.Color(0xddddff)
    ];

    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const radius = minRadius + Math.random() * (maxRadius - minRadius);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi);

        const color = starColors[Math.floor(Math.random() * starColors.length)];
        const brightness = 0.7 + Math.random() * 0.3;
        colors[i3] = color.r * brightness;
        colors[i3 + 1] = color.g * brightness;
        colors[i3 + 2] = color.b * brightness;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: size,
        vertexColors: true,
        transparent: true,
        opacity: opacity,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending
    });

    const stars = new THREE.Points(geometry, material);
    scene.add(stars);
}

function createSparklingStars(count, minRadius, maxRadius) {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const radius = minRadius + Math.random() * (maxRadius - minRadius);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi);
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Create star texture with glow
    const starTexture = createStarTexture();
    
    const material = new THREE.PointsMaterial({
        size: 4,
        map: starTexture,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const sparklingStars = new THREE.Points(geometry, material);
    sparklingStars.userData.isSparkle = true;
    scene.add(sparklingStars);
}

function createStarTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.1, 'rgba(255, 250, 240, 0.8)');
    gradient.addColorStop(0.3, 'rgba(200, 220, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    // Add cross flare
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(32, 10);
    ctx.lineTo(32, 54);
    ctx.moveTo(10, 32);
    ctx.lineTo(54, 32);
    ctx.stroke();

    return new THREE.CanvasTexture(canvas);
}

// ============================================
// Dust Clouds (Subtle volumetric effect)
// ============================================

function createDustClouds() {
    for (let i = 0; i < 8; i++) {
        const dustTexture = createDustTexture();
        const dustMaterial = new THREE.SpriteMaterial({
            map: dustTexture,
            transparent: true,
            opacity: 0.03,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        const dust = new THREE.Sprite(dustMaterial);
        const angle = (i / 8) * Math.PI * 2;
        const radius = 80 + Math.random() * 40;
        
        dust.position.set(
            Math.cos(angle) * radius,
            (Math.random() - 0.5) * 30,
            Math.sin(angle) * radius
        );
        dust.scale.set(100, 100, 1);
        dust.userData.angle = angle;
        dust.userData.radius = radius;
        
        dustClouds.push(dust);
        scene.add(dust);
    }
}

function createDustTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, 'rgba(255, 200, 150, 0.5)');
    gradient.addColorStop(0.5, 'rgba(200, 180, 160, 0.2)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);

    return new THREE.CanvasTexture(canvas);
}

// ============================================
// Enhanced Lighting
// ============================================

function createLighting() {
    // Very subtle ambient for deep space feel
    const ambientLight = new THREE.AmbientLight(0x111122, 0.15);
    scene.add(ambientLight);

    // Main sun light - warm and bright
    const sunLight = new THREE.PointLight(0xfff5e0, 2.5, 300, 1.5);
    sunLight.position.set(0, 0, 0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 1;
    sunLight.shadow.camera.far = 100;
    scene.add(sunLight);

    // Secondary warm fill light
    const fillLight = new THREE.PointLight(0xffaa55, 0.5, 150);
    fillLight.position.set(0, 0, 0);
    scene.add(fillLight);

    // Rim light for dramatic effect (cool blue from behind)
    const rimLight = new THREE.DirectionalLight(0x4488ff, 0.1);
    rimLight.position.set(0, 50, -100);
    scene.add(rimLight);
}

// ============================================
// Enhanced Sun with Corona and Flares
// ============================================

function createSun() {
    // Sun core with custom shader for surface detail
    const sunGeometry = new THREE.SphereGeometry(5, 64, 64);
    
    // Create procedural sun texture
    const sunTexture = createSunTexture();
    
    const sunMaterial = new THREE.MeshBasicMaterial({
        map: sunTexture,
        emissive: 0xffaa00,
        emissiveIntensity: 0.5
    });
    
    sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // Inner glow
    const innerGlowTexture = createGlowTexture(0xffdd44, 0xffaa00);
    const innerGlowMaterial = new THREE.SpriteMaterial({
        map: innerGlowTexture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        opacity: 0.8,
        depthWrite: false
    });
    const innerGlow = new THREE.Sprite(innerGlowMaterial);
    innerGlow.scale.set(18, 18, 1);
    sun.add(innerGlow);

    // Outer corona
    const coronaTexture = createGlowTexture(0xff6600, 0xff3300);
    const coronaMaterial = new THREE.SpriteMaterial({
        map: coronaTexture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        opacity: 0.4,
        depthWrite: false
    });
    sunCorona = new THREE.Sprite(coronaMaterial);
    sunCorona.scale.set(35, 35, 1);
    sun.add(sunCorona);

    // Outermost glow (very subtle)
    const outerGlowTexture = createGlowTexture(0xff4400, 0xff0000);
    const outerGlowMaterial = new THREE.SpriteMaterial({
        map: outerGlowTexture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        opacity: 0.2,
        depthWrite: false
    });
    const outerGlow = new THREE.Sprite(outerGlowMaterial);
    outerGlow.scale.set(50, 50, 1);
    sun.add(outerGlow);

    // Solar flares (smaller glows offset from center)
    for (let i = 0; i < 4; i++) {
        const flareTexture = createGlowTexture(0xffcc00, 0xff6600);
        const flareMaterial = new THREE.SpriteMaterial({
            map: flareTexture,
            transparent: true,
            blending: THREE.AdditiveBlending,
            opacity: 0.3,
            depthWrite: false
        });
        const flare = new THREE.Sprite(flareMaterial);
        const angle = (i / 4) * Math.PI * 2 + Math.random() * 0.5;
        const dist = 2 + Math.random() * 2;
        flare.position.set(
            Math.cos(angle) * dist,
            Math.sin(angle) * dist,
            0
        );
        flare.scale.set(8 + Math.random() * 4, 8 + Math.random() * 4, 1);
        flare.userData.angle = angle;
        flare.userData.baseScale = flare.scale.x;
        sun.add(flare);
    }
}

function createSunTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Base orange gradient
    const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
    gradient.addColorStop(0, '#ffff80');
    gradient.addColorStop(0.3, '#ffcc00');
    gradient.addColorStop(0.6, '#ff9900');
    gradient.addColorStop(1, '#ff6600');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);

    // Add noise/granulation
    for (let i = 0; i < 5000; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const dist = Math.sqrt((x - 256) ** 2 + (y - 256) ** 2);
        if (dist < 256) {
            const brightness = Math.random() * 0.3;
            ctx.fillStyle = `rgba(255, ${200 + Math.random() * 55}, 0, ${brightness})`;
            ctx.fillRect(x, y, 2, 2);
        }
    }

    // Add some darker spots (sunspots)
    for (let i = 0; i < 8; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 150;
        const x = 256 + Math.cos(angle) * dist;
        const y = 256 + Math.sin(angle) * dist;
        const radius = 5 + Math.random() * 15;
        
        const spotGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        spotGradient.addColorStop(0, 'rgba(100, 50, 0, 0.5)');
        spotGradient.addColorStop(1, 'rgba(200, 100, 0, 0)');
        ctx.fillStyle = spotGradient;
        ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    }

    return new THREE.CanvasTexture(canvas);
}

function createGlowTexture(centerColor, edgeColor) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    const center = new THREE.Color(centerColor);
    const edge = new THREE.Color(edgeColor);

    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, `rgba(${Math.floor(center.r * 255)}, ${Math.floor(center.g * 255)}, ${Math.floor(center.b * 255)}, 1)`);
    gradient.addColorStop(0.2, `rgba(${Math.floor(center.r * 255)}, ${Math.floor(center.g * 255)}, ${Math.floor(center.b * 255)}, 0.6)`);
    gradient.addColorStop(0.5, `rgba(${Math.floor(edge.r * 255)}, ${Math.floor(edge.g * 255)}, ${Math.floor(edge.b * 255)}, 0.2)`);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);

    return new THREE.CanvasTexture(canvas);
}

// ============================================
// Enhanced Planets with Textures & Atmospheres
// ============================================

function createPlanets() {
    Object.keys(planetData).forEach((key) => {
        const data = planetData[key];
        
        const planetGroup = new THREE.Group();
        scene.add(planetGroup);

        // Create procedural planet texture
        const planetTexture = createPlanetTexture(data);
        
        const geometry = new THREE.SphereGeometry(data.radius, 64, 64);
        const material = new THREE.MeshStandardMaterial({
            map: planetTexture,
            roughness: 0.8,
            metalness: 0.1,
            bumpScale: 0.02
        });
        
        const planet = new THREE.Mesh(geometry, material);
        planet.castShadow = true;
        planet.receiveShadow = true;
        planet.position.x = data.distance;
        planet.userData = { name: key, ...data };
        planetGroup.add(planet);

        // Add atmosphere if defined
        if (data.atmosphere) {
            const atmosphereGeometry = new THREE.SphereGeometry(
                data.radius * data.atmosphere.scale,
                32, 32
            );
            const atmosphereMaterial = new THREE.MeshBasicMaterial({
                color: data.atmosphere.color,
                transparent: true,
                opacity: data.atmosphere.opacity,
                side: THREE.BackSide,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });
            const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
            atmosphere.position.copy(planet.position);
            planetGroup.add(atmosphere);
            planet.userData.atmosphere = atmosphere;
        }

        // Add moon to Earth
        if (data.hasMoon) {
            const moonGeometry = new THREE.SphereGeometry(0.27, 32, 32);
            const moonTexture = createMoonTexture();
            const moonMaterial = new THREE.MeshStandardMaterial({
                map: moonTexture,
                roughness: 0.9,
                metalness: 0
            });
            const moon = new THREE.Mesh(moonGeometry, moonMaterial);
            moon.position.set(2.5, 0, 0);
            planet.add(moon);
            planet.userData.moon = moon;
        }

        // Saturn's rings with enhanced texture
        if (data.hasRings) {
            const ringGeometry = new THREE.RingGeometry(
                data.ringInnerRadius,
                data.ringOuterRadius,
                128
            );
            
            // Fix ring UVs for proper texture mapping
            const pos = ringGeometry.attributes.position;
            const uv = ringGeometry.attributes.uv;
            for (let i = 0; i < pos.count; i++) {
                const x = pos.getX(i);
                const y = pos.getY(i);
                const dist = Math.sqrt(x * x + y * y);
                const normalizedDist = (dist - data.ringInnerRadius) / (data.ringOuterRadius - data.ringInnerRadius);
                uv.setXY(i, normalizedDist, 1);
            }
            
            const ringTexture = createRingTexture();
            const ringMaterial = new THREE.MeshBasicMaterial({
                map: ringTexture,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.85,
                depthWrite: false
            });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = Math.PI / 2.2;
            ring.position.copy(planet.position);
            planetGroup.add(ring);
            planet.userData.ring = ring;
        }

        // Store reference
        planets[key] = {
            mesh: planet,
            group: planetGroup,
            data: data,
            angle: Math.random() * Math.PI * 2
        };
    });
}

function createPlanetTexture(data) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    const baseColor = new THREE.Color(data.color);
    
    // Base color
    ctx.fillStyle = `rgb(${Math.floor(baseColor.r * 255)}, ${Math.floor(baseColor.g * 255)}, ${Math.floor(baseColor.b * 255)})`;
    ctx.fillRect(0, 0, 512, 256);

    // Add surface variation
    for (let i = 0; i < 2000; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 256;
        const variation = (Math.random() - 0.5) * 0.3;
        const r = Math.min(255, Math.max(0, baseColor.r * 255 + variation * 100));
        const g = Math.min(255, Math.max(0, baseColor.g * 255 + variation * 100));
        const b = Math.min(255, Math.max(0, baseColor.b * 255 + variation * 100));
        const size = 1 + Math.random() * 4;
        
        ctx.fillStyle = `rgba(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)}, 0.5)`;
        ctx.fillRect(x, y, size, size);
    }

    // Jupiter's bands
    if (data.hasBands) {
        const bandColors = ['#d4b896', '#c9a97a', '#e8d5b7', '#b8956e', '#dfc9a8'];
        for (let i = 0; i < 12; i++) {
            const y = (i / 12) * 256;
            const height = 15 + Math.random() * 15;
            ctx.fillStyle = bandColors[i % bandColors.length];
            ctx.globalAlpha = 0.4;
            ctx.fillRect(0, y, 512, height);
        }
        ctx.globalAlpha = 1;
        
        // Great Red Spot
        ctx.fillStyle = '#c0664a';
        ctx.beginPath();
        ctx.ellipse(350, 140, 30, 20, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    // Earth's continents (simplified)
    if (data.name === 'Earth') {
        ctx.fillStyle = '#4a7c4e';
        // Simple continent shapes
        ctx.beginPath();
        ctx.ellipse(120, 100, 40, 60, 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(200, 130, 50, 40, -0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(380, 90, 30, 50, 0.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(400, 180, 35, 25, 0, 0, Math.PI * 2);
        ctx.fill();

        // Ice caps
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 512, 20);
        ctx.fillRect(0, 236, 512, 20);
    }

    // Mars features
    if (data.name === 'Mars') {
        // Polar ice caps
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fillRect(0, 0, 512, 15);
        ctx.fillRect(0, 241, 512, 15);
        
        // Dark regions
        ctx.fillStyle = 'rgba(80, 30, 10, 0.4)';
        ctx.beginPath();
        ctx.ellipse(200, 128, 80, 40, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    return new THREE.CanvasTexture(canvas);
}

function createMoonTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    // Gray base
    ctx.fillStyle = '#888888';
    ctx.fillRect(0, 0, 256, 128);

    // Craters
    for (let i = 0; i < 50; i++) {
        const x = Math.random() * 256;
        const y = Math.random() * 128;
        const radius = 2 + Math.random() * 8;
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, '#666666');
        gradient.addColorStop(0.5, '#777777');
        gradient.addColorStop(1, '#888888');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }

    // Maria (dark areas)
    ctx.fillStyle = 'rgba(60, 60, 70, 0.4)';
    ctx.beginPath();
    ctx.ellipse(100, 64, 40, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(180, 80, 25, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    return new THREE.CanvasTexture(canvas);
}

function createRingTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    // Create ring bands
    const gradient = ctx.createLinearGradient(0, 0, 512, 0);
    gradient.addColorStop(0, 'rgba(180, 160, 140, 0)');
    gradient.addColorStop(0.1, 'rgba(200, 180, 160, 0.9)');
    gradient.addColorStop(0.2, 'rgba(180, 160, 140, 0.3)');
    gradient.addColorStop(0.3, 'rgba(210, 190, 170, 0.95)');
    gradient.addColorStop(0.35, 'rgba(150, 130, 110, 0.2)');
    gradient.addColorStop(0.4, 'rgba(190, 170, 150, 0.85)');
    gradient.addColorStop(0.5, 'rgba(220, 200, 180, 0.9)');
    gradient.addColorStop(0.6, 'rgba(170, 150, 130, 0.5)');
    gradient.addColorStop(0.7, 'rgba(200, 180, 160, 0.8)');
    gradient.addColorStop(0.8, 'rgba(160, 140, 120, 0.4)');
    gradient.addColorStop(0.9, 'rgba(180, 160, 140, 0.6)');
    gradient.addColorStop(1, 'rgba(150, 130, 110, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 64);

    // Add some noise
    for (let i = 0; i < 2000; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 64;
        const brightness = 150 + Math.random() * 50;
        ctx.fillStyle = `rgba(${brightness}, ${brightness - 20}, ${brightness - 40}, 0.3)`;
        ctx.fillRect(x, y, 1, 1);
    }

    return new THREE.CanvasTexture(canvas);
}

// ============================================
// Enhanced Orbit Lines
// ============================================

function createOrbitLines() {
    Object.keys(planetData).forEach((key, index) => {
        const data = planetData[key];
        const segments = 256;
        const points = [];

        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            points.push(new THREE.Vector3(
                Math.cos(angle) * data.distance,
                0,
                Math.sin(angle) * data.distance
            ));
        }

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        
        // Gradient colors for orbits
        const colors = [];
        const orbitColor = new THREE.Color().setHSL(0.6 + index * 0.03, 0.5, 0.3);
        
        for (let i = 0; i <= segments; i++) {
            colors.push(orbitColor.r, orbitColor.g, orbitColor.b);
        }
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const material = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.25,
            blending: THREE.AdditiveBlending
        });
        
        const orbitLine = new THREE.Line(geometry, material);
        scene.add(orbitLine);
        orbitLines.push(orbitLine);
    });
}

// ============================================
// Animation Loop
// ============================================

function animate() {
    requestAnimationFrame(animate);

    const time = clock.getElapsedTime();

    if (isPlaying) {
        // Animate sun
        sun.rotation.y += 0.002 * timeSpeed;
        
        // Pulse sun corona
        if (sunCorona) {
            const pulse = 1 + Math.sin(time * 2) * 0.05;
            sunCorona.scale.set(35 * pulse, 35 * pulse, 1);
        }

        // Animate solar flares
        sun.children.forEach((child, index) => {
            if (child.userData.angle !== undefined) {
                child.userData.angle += 0.001 * timeSpeed;
                const scale = child.userData.baseScale * (1 + Math.sin(time * 3 + index) * 0.2);
                child.scale.set(scale, scale, 1);
            }
        });

        // Orbit and rotate planets
        Object.keys(planets).forEach((key) => {
            const planet = planets[key];
            
            planet.angle += planet.data.orbitSpeed * timeSpeed;
            
            const x = Math.cos(planet.angle) * planet.data.distance;
            const z = Math.sin(planet.angle) * planet.data.distance;
            
            planet.mesh.position.x = x;
            planet.mesh.position.z = z;
            
            // Update atmosphere position
            if (planet.mesh.userData.atmosphere) {
                planet.mesh.userData.atmosphere.position.x = x;
                planet.mesh.userData.atmosphere.position.z = z;
            }
            
            // Update ring position
            if (planet.mesh.userData.ring) {
                planet.mesh.userData.ring.position.x = x;
                planet.mesh.userData.ring.position.z = z;
            }
            
            // Axial rotation
            planet.mesh.rotation.y += planet.data.rotationSpeed * timeSpeed;
            
            // Moon orbit
            if (planet.mesh.userData.moon) {
                planet.mesh.userData.moon.position.x = Math.cos(time * 0.5) * 2.5;
                planet.mesh.userData.moon.position.z = Math.sin(time * 0.5) * 2.5;
            }
        });

        // Slowly rotate galaxy
        if (galaxy) {
            galaxy.rotation.y += 0.0001 * timeSpeed;
        }

        // Animate dust clouds
        dustClouds.forEach((dust, i) => {
            dust.userData.angle += 0.0002 * timeSpeed;
            dust.position.x = Math.cos(dust.userData.angle) * dust.userData.radius;
            dust.position.z = Math.sin(dust.userData.angle) * dust.userData.radius;
            dust.material.opacity = 0.03 + Math.sin(time * 0.5 + i) * 0.01;
        });
    }

    controls.update();
    renderer.render(scene, camera);
}

// ============================================
// Event Handlers
// ============================================

function setupEventListeners() {
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onMouseClick);
    playPauseBtn.addEventListener('click', togglePlayPause);
    speedSlider.addEventListener('input', updateSpeed);
    closePanel.addEventListener('click', closeInfoPanel);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const planetMeshes = Object.values(planets).map(p => p.mesh);
    const intersects = raycaster.intersectObjects(planetMeshes);

    if (intersects.length > 0) {
        document.body.classList.add('hovering-planet');
        const hoveredPlanet = intersects[0].object;
        planetMeshes.forEach(mesh => {
            if (mesh === hoveredPlanet) {
                mesh.material.emissiveIntensity = 0.3;
                mesh.material.emissive = new THREE.Color(0x4488ff);
            } else {
                mesh.material.emissiveIntensity = 0;
                mesh.material.emissive = new THREE.Color(0x000000);
            }
        });
    } else {
        document.body.classList.remove('hovering-planet');
        planetMeshes.forEach(mesh => {
            mesh.material.emissiveIntensity = 0;
            mesh.material.emissive = new THREE.Color(0x000000);
        });
    }
}

function onMouseClick(event) {
    if (event.target.closest('#ui-overlay') || event.target.closest('#info-panel')) {
        return;
    }

    raycaster.setFromCamera(mouse, camera);
    const planetMeshes = Object.values(planets).map(p => p.mesh);
    const intersects = raycaster.intersectObjects(planetMeshes);

    if (intersects.length > 0) {
        const clickedPlanet = intersects[0].object;
        selectPlanet(clickedPlanet);
    }
}

function selectPlanet(planetMesh) {
    selectedPlanet = planetMesh;
    const data = planetMesh.userData;

    document.getElementById('planet-name').textContent = data.name;
    document.getElementById('planet-distance').textContent = data.distanceFromSun;
    document.getElementById('planet-period').textContent = data.orbitalPeriod;
    document.getElementById('planet-fact').textContent = data.fact;

    infoPanel.classList.remove('hidden');
    focusOnPlanet(planetMesh);
}

function focusOnPlanet(planetMesh) {
    const targetPosition = new THREE.Vector3();
    planetMesh.getWorldPosition(targetPosition);

    const offset = planetMesh.userData.radius * 8 + 10;
    const cameraTarget = new THREE.Vector3(
        targetPosition.x + offset * 0.5,
        targetPosition.y + offset * 0.5,
        targetPosition.z + offset
    );

    animateCamera(cameraTarget, targetPosition);
}

function animateCamera(targetPosition, lookAtTarget) {
    const startPosition = camera.position.clone();
    const startTarget = controls.target.clone();
    const duration = 1500;
    const startTime = Date.now();

    function updateCamera() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        camera.position.lerpVectors(startPosition, targetPosition, eased);
        controls.target.lerpVectors(startTarget, lookAtTarget, eased);
        controls.update();

        if (progress < 1) {
            requestAnimationFrame(updateCamera);
        }
    }

    updateCamera();
}

function togglePlayPause() {
    isPlaying = !isPlaying;
    btnIcon.textContent = isPlaying ? '⏸' : '▶';
    btnText.textContent = isPlaying ? 'Pause' : 'Play';
}

function updateSpeed() {
    timeSpeed = parseFloat(speedSlider.value);
    speedValue.textContent = timeSpeed.toFixed(1) + 'x';
}

function closeInfoPanel() {
    infoPanel.classList.add('hidden');
    selectedPlanet = null;
}

// ============================================
// Start Application
// ============================================

init();
