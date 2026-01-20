// ============================================
// COSMOS EXPLORER - Shader-Based Solar System
// ============================================

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ============================================
// PLANET DATA
// ============================================

const PLANETS = {
    sun: {
        name: 'THE SUN',
        type: 'G-TYPE MAIN SEQUENCE STAR',
        radius: 5,
        distance: 0,
        orbitSpeed: 0,
        rotationSpeed: 0.0003,
        colors: [0xffaa00, 0xff6600, 0xff3300],
        planetType: -1,
        atmosphere: 0,
        diameter: '1,392,700 km',
        distanceFromSun: 'Center of Solar System',
        period: 'N/A',
        temp: '5,500°C surface / 15 million°C core',
        moons: '8 Planets Orbit',
        gravity: '274 m/s² (28x Earth)',
        fact: 'The Sun contains 99.86% of all mass in our solar system. It fuses 600 million tons of hydrogen into helium every second, producing the energy that sustains all life on Earth.'
    },
    mercury: {
        name: 'MERCURY',
        type: 'TERRESTRIAL PLANET',
        radius: 0.4,
        distance: 10,
        orbitSpeed: 0.04,
        rotationSpeed: 0.004,
        colors: [0x8c7853, 0x6b5a47, 0x544739],
        planetType: 0,
        atmosphere: 0,
        diameter: '4,879 km',
        distanceFromSun: '57.9 million km',
        period: '88 Earth Days',
        temp: '-180°C to 430°C',
        moons: '0',
        gravity: '3.7 m/s²',
        fact: 'Mercury has the most extreme temperature variation of any planet, swinging over 600°C between day and night. Despite being closest to the Sun, it\'s not the hottest planet.'
    },
    venus: {
        name: 'VENUS',
        type: 'TERRESTRIAL PLANET',
        radius: 0.9,
        distance: 14,
        orbitSpeed: 0.015,
        rotationSpeed: -0.002,
        colors: [0xe8c76a, 0xd4a84a, 0xc49632],
        planetType: 1,
        atmosphere: 0.8,
        diameter: '12,104 km',
        distanceFromSun: '108.2 million km',
        period: '225 Earth Days',
        temp: '465°C (hottest planet)',
        moons: '0',
        gravity: '8.87 m/s²',
        fact: 'Venus rotates backwards compared to most planets, and so slowly that a day on Venus (243 Earth days) is longer than its year (225 Earth days). It\'s the hottest planet due to runaway greenhouse effect.'
    },
    earth: {
        name: 'EARTH',
        type: 'TERRESTRIAL PLANET',
        radius: 1.0,
        distance: 18,
        orbitSpeed: 0.01,
        rotationSpeed: 0.01,
        colors: [0x4a90d9, 0x2d6a27, 0x3d8b3d],
        planetType: 2,
        atmosphere: 0.6,
        hasMoon: true,
        hasCloud: true,
        diameter: '12,742 km',
        distanceFromSun: '149.6 million km (1 AU)',
        period: '365.25 Days',
        temp: '-88°C to 58°C',
        moons: '1 (The Moon)',
        gravity: '9.81 m/s²',
        fact: 'Earth is the only planet known to harbor life. It\'s also the densest planet in our solar system and the largest of the four terrestrial planets. Our Moon is unusually large relative to Earth.'
    },
    mars: {
        name: 'MARS',
        type: 'TERRESTRIAL PLANET',
        radius: 0.55,
        distance: 24,
        orbitSpeed: 0.008,
        rotationSpeed: 0.009,
        colors: [0xcd5c5c, 0xb84c4c, 0x8b3232],
        planetType: 3,
        atmosphere: 0.3,
        diameter: '6,779 km',
        distanceFromSun: '227.9 million km',
        period: '687 Earth Days',
        temp: '-87°C to -5°C',
        moons: '2 (Phobos & Deimos)',
        gravity: '3.71 m/s²',
        fact: 'Mars has the largest volcano in the solar system, Olympus Mons, standing 22 km high. It also has the longest canyon, Valles Marineris, stretching 4,000 km across the planet.'
    },
    jupiter: {
        name: 'JUPITER',
        type: 'GAS GIANT',
        radius: 2.8,
        distance: 38,
        orbitSpeed: 0.002,
        rotationSpeed: 0.02,
        colors: [0xd4a574, 0xc49464, 0xe8c8a8],
        planetType: 4,
        atmosphere: 0.5,
        diameter: '139,820 km',
        distanceFromSun: '778.5 million km',
        period: '11.9 Earth Years',
        temp: '-110°C (cloud tops)',
        moons: '95 Known Moons',
        gravity: '24.79 m/s²',
        fact: 'Jupiter\'s Great Red Spot is a storm that has been raging for at least 400 years and is so large that Earth could fit inside it. Jupiter has the strongest magnetic field of any planet.'
    },
    saturn: {
        name: 'SATURN',
        type: 'GAS GIANT',
        radius: 2.4,
        distance: 52,
        orbitSpeed: 0.0008,
        rotationSpeed: 0.018,
        colors: [0xead6a6, 0xd4c090, 0xc4b080],
        planetType: 5,
        atmosphere: 0.4,
        hasRings: true,
        diameter: '116,460 km',
        distanceFromSun: '1.4 billion km',
        period: '29.4 Earth Years',
        temp: '-140°C (cloud tops)',
        moons: '146 Known Moons',
        gravity: '10.44 m/s²',
        fact: 'Saturn\'s magnificent rings are made of billions of ice and rock particles ranging from tiny grains to house-sized chunks. The rings extend 282,000 km from the planet but are only about 10 meters thick.'
    },
    uranus: {
        name: 'URANUS',
        type: 'ICE GIANT',
        radius: 1.6,
        distance: 68,
        orbitSpeed: 0.0003,
        rotationSpeed: -0.012,
        colors: [0x7ec8e3, 0x9ed8ea, 0xaee8f0],
        planetType: 6,
        atmosphere: 0.7,
        diameter: '50,724 km',
        distanceFromSun: '2.9 billion km',
        period: '84 Earth Years',
        temp: '-224°C',
        moons: '28 Known Moons',
        gravity: '8.69 m/s²',
        fact: 'Uranus rotates on its side with an axial tilt of 98°, likely due to a collision with an Earth-sized object billions of years ago. This means its poles take turns pointing directly at the Sun.'
    },
    neptune: {
        name: 'NEPTUNE',
        type: 'ICE GIANT',
        radius: 1.5,
        distance: 82,
        orbitSpeed: 0.0001,
        rotationSpeed: 0.015,
        colors: [0x4169e1, 0x5a7fe8, 0x7090f0],
        planetType: 7,
        atmosphere: 0.7,
        diameter: '49,244 km',
        distanceFromSun: '4.5 billion km',
        period: '165 Earth Years',
        temp: '-214°C',
        moons: '16 Known Moons',
        gravity: '11.15 m/s²',
        fact: 'Neptune has the strongest winds in the solar system, reaching speeds of 2,100 km/h. It was the first planet to be discovered through mathematical predictions rather than observation.'
    }
};

// ============================================
// GLOBAL STATE
// ============================================

let scene, camera, renderer, controls;
let planets = {}, labels = {};
let orbits = [], starfield, galaxy;
let raycaster, mouse;
let clock = new THREE.Clock();
let speechSynth = window.speechSynthesis;
let currentUtterance = null;

const state = {
    playing: true,
    speed: 1,
    showOrbits: true,
    showLabels: true,
    soundEnabled: false,
    selectedPlanet: null,
    followTarget: null,
    fps: 60,
    time: 0
};

// ============================================
// INIT
// ============================================

function init() {
    setupScene();
    setupCamera();
    setupRenderer();
    setupControls();
    setupRaycaster();
    
    loadScene();
    setupEvents();
    animate();
}

function setupScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000005);
}

function setupCamera() {
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 3000);
    camera.position.set(40, 30, 60);
}

function setupRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    document.getElementById('canvas-container').appendChild(renderer.domElement);
}

function setupControls() {
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 8;
    controls.maxDistance = 300;
}

function setupRaycaster() {
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
}

// ============================================
// SCENE CREATION
// ============================================

async function loadScene() {
    updateLoad('Creating starfield...', 10);
    createStarfield();
    
    updateLoad('Generating galaxy...', 25);
    createGalaxy();
    
    updateLoad('Setting up lighting...', 40);
    createLighting();
    
    updateLoad('Creating the Sun...', 55);
    createSun();
    
    updateLoad('Creating planets...', 70);
    createPlanets();
    
    updateLoad('Drawing orbits...', 85);
    createOrbits();
    
    updateLoad('Finalizing...', 100);
    
    setTimeout(() => {
        document.getElementById('loading').classList.add('hidden');
    }, 600);
}

function updateLoad(status, progress) {
    const s = document.getElementById('load-status');
    const p = document.getElementById('load-progress');
    if (s) s.textContent = status;
    if (p) p.style.width = progress + '%';
}

// ============================================
// STARFIELD & GALAXY
// ============================================

function createStarfield() {
    const layers = [
        { count: 15000, size: 0.4, range: [400, 1000] },
        { count: 6000, size: 0.9, range: [250, 600] },
        { count: 1500, size: 1.6, range: [150, 400] }
    ];
    
    layers.forEach(layer => {
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(layer.count * 3);
        const col = new Float32Array(layer.count * 3);
        
        for (let i = 0; i < layer.count; i++) {
            const i3 = i * 3;
            const r = layer.range[0] + Math.random() * (layer.range[1] - layer.range[0]);
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            pos[i3] = r * Math.sin(phi) * Math.cos(theta);
            pos[i3+1] = r * Math.sin(phi) * Math.sin(theta);
            pos[i3+2] = r * Math.cos(phi);
            
            const temp = Math.random();
            col[i3] = 0.8 + temp * 0.2;
            col[i3+1] = 0.8 + (temp > 0.5 ? 0.2 : -0.1);
            col[i3+2] = 0.9 + (temp < 0.5 ? 0.1 : -0.2);
        }
        
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
        
        const mat = new THREE.PointsMaterial({
            size: layer.size,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        scene.add(new THREE.Points(geo, mat));
    });
}

function createGalaxy() {
    const count = 60000;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    
    const colors = [
        new THREE.Color(0xff6b35),
        new THREE.Color(0xf4c430),
        new THREE.Color(0x5b8dee),
        new THREE.Color(0xa855f7)
    ];
    
    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const arm = i % 4;
        const r = Math.random() * 700 + 150;
        const spin = r * 0.002;
        const branch = (arm / 4) * Math.PI * 2;
        const rand = Math.pow(Math.random(), 3) * 60;
        
        pos[i3] = Math.cos(branch + spin) * r + (Math.random() - 0.5) * rand;
        pos[i3+1] = (Math.random() - 0.5) * rand * 0.2 - 300;
        pos[i3+2] = Math.sin(branch + spin) * r + (Math.random() - 0.5) * rand - 500;
        
        const c = colors[arm];
        const b = 0.4 + (1 - r / 900) * 0.6;
        col[i3] = c.r * b;
        col[i3+1] = c.g * b;
        col[i3+2] = c.b * b;
    }
    
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    
    galaxy = new THREE.Points(geo, new THREE.PointsMaterial({
        size: 1.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    }));
    
    scene.add(galaxy);
}

// ============================================
// LIGHTING
// ============================================

function createLighting() {
    scene.add(new THREE.AmbientLight(0x111122, 0.15));
    
    const sunLight = new THREE.PointLight(0xfff5e0, 2.5, 500, 1.5);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);
}

// ============================================
// SUN WITH SHADER
// ============================================

function createSun() {
    const data = PLANETS.sun;
    const group = new THREE.Group();
    group.userData = { name: 'sun', data };
    
    // Main sun with shader
    const geo = new THREE.SphereGeometry(data.radius, 128, 128);
    
    const vertexShader = document.getElementById('sun-vertex').textContent;
    const fragmentShader = document.getElementById('sun-fragment').textContent;
    
    const mat = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uIntensity: { value: 1.2 }
        },
        vertexShader,
        fragmentShader
    });
    
    const sun = new THREE.Mesh(geo, mat);
    sun.userData = { name: 'sun', data };
    group.add(sun);
    
    // Glow layers
    createGlow(group, data.radius * 1.3, 0xffaa00, 0.6, 2.0);
    createGlow(group, data.radius * 1.8, 0xff6600, 0.35, 2.5);
    createGlow(group, data.radius * 2.5, 0xff4400, 0.15, 3.0);
    createGlow(group, data.radius * 3.5, 0xff2200, 0.08, 4.0);
    
    scene.add(group);
    planets.sun = { mesh: sun, group, data, angle: 0, mat };
    
    createLabel('sun', data);
}

function createGlow(parent, size, color, opacity, power) {
    const vertexShader = document.getElementById('glow-vertex').textContent;
    const fragmentShader = document.getElementById('glow-fragment').textContent;
    
    const geo = new THREE.SphereGeometry(size, 32, 32);
    const mat = new THREE.ShaderMaterial({
        uniforms: {
            uColor: { value: new THREE.Color(color) },
            uIntensity: { value: 0.8 },
            uPower: { value: power }
        },
        vertexShader,
        fragmentShader,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false
    });
    
    parent.add(new THREE.Mesh(geo, mat));
}

// ============================================
// PLANETS WITH SHADERS
// ============================================

function createPlanets() {
    Object.entries(PLANETS).forEach(([key, data]) => {
        if (key === 'sun') return;
        createPlanet(key, data);
    });
}

function createPlanet(key, data) {
    const group = new THREE.Group();
    group.userData = { name: key, data };
    
    const geo = new THREE.SphereGeometry(data.radius, 64, 64);
    
    const vertexShader = document.getElementById('planet-vertex').textContent;
    const fragmentShader = document.getElementById('planet-fragment').textContent;
    
    const mat = new THREE.ShaderMaterial({
        uniforms: {
            uColor1: { value: new THREE.Color(data.colors[0]) },
            uColor2: { value: new THREE.Color(data.colors[1]) },
            uColor3: { value: new THREE.Color(data.colors[2]) },
            uTime: { value: 0 },
            uPlanetType: { value: data.planetType },
            uSunPosition: { value: new THREE.Vector3(0, 0, 0) },
            uAtmosphere: { value: data.atmosphere }
        },
        vertexShader,
        fragmentShader
    });
    
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.x = data.distance;
    mesh.userData = { name: key, data };
    group.add(mesh);
    
    // Atmosphere glow
    if (data.atmosphere > 0) {
        const atmoGeo = new THREE.SphereGeometry(data.radius * 1.12, 32, 32);
        const atmoMat = new THREE.MeshBasicMaterial({
            color: data.colors[1],
            transparent: true,
            opacity: data.atmosphere * 0.2,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const atmo = new THREE.Mesh(atmoGeo, atmoMat);
        atmo.position.copy(mesh.position);
        group.add(atmo);
        mesh.userData.atmosphere = atmo;
    }
    
    // Earth's moon
    if (data.hasMoon) {
        const moonGeo = new THREE.SphereGeometry(0.25, 32, 32);
        const moonMat = new THREE.MeshStandardMaterial({ 
            color: 0x888888, 
            roughness: 0.9 
        });
        const moon = new THREE.Mesh(moonGeo, moonMat);
        moon.position.set(2, 0, 0);
        mesh.add(moon);
        mesh.userData.moon = moon;
    }
    
    // Saturn's rings
    if (data.hasRings) {
        const ringGeo = new THREE.RingGeometry(3.0, 5.5, 128);
        const ringTex = createRingTexture();
        const ringMat = new THREE.MeshBasicMaterial({
            map: ringTex,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.85,
            depthWrite: false
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2.2;
        ring.position.copy(mesh.position);
        group.add(ring);
        mesh.userData.ring = ring;
    }
    
    scene.add(group);
    planets[key] = { mesh, group, data, angle: Math.random() * Math.PI * 2, mat };
    
    createLabel(key, data);
}

function createRingTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    const bands = [
        { s: 0, e: 0.08, o: 0.2, c: [160,140,120] },
        { s: 0.08, e: 0.12, o: 0 },
        { s: 0.12, e: 0.4, o: 0.9, c: [200,180,160] },
        { s: 0.4, e: 0.45, o: 0.3, c: [150,130,110] },
        { s: 0.45, e: 0.65, o: 0.85, c: [210,190,170] },
        { s: 0.65, e: 0.7, o: 0.2, c: [140,120,100] },
        { s: 0.7, e: 0.85, o: 0.6, c: [180,160,140] },
        { s: 0.85, e: 1, o: 0.15, c: [130,110,90] }
    ];
    
    bands.forEach(b => {
        if (!b.o) return;
        ctx.fillStyle = `rgba(${b.c[0]},${b.c[1]},${b.c[2]},${b.o})`;
        ctx.fillRect(b.s * 1024, 0, (b.e - b.s) * 1024, 64);
    });
    
    return new THREE.CanvasTexture(canvas);
}

// ============================================
// LABELS
// ============================================

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
        const p = planets[key];
        if (!p) return;
        
        const pos = new THREE.Vector3();
        p.mesh.getWorldPosition(pos);
        pos.y += p.data.radius * 1.8;
        
        const screen = pos.clone().project(camera);
        
        if (screen.z > 1) {
            label.style.display = 'none';
        } else {
            label.style.display = 'block';
            label.style.left = (screen.x * 0.5 + 0.5) * window.innerWidth + 'px';
            label.style.top = (-screen.y * 0.5 + 0.5) * window.innerHeight + 'px';
        }
    });
}

// ============================================
// ORBITS
// ============================================

function createOrbits() {
    Object.entries(PLANETS).forEach(([key, data]) => {
        if (key === 'sun' || !data.distance) return;
        
        const points = [];
        for (let i = 0; i <= 128; i++) {
            const a = (i / 128) * Math.PI * 2;
            points.push(new THREE.Vector3(
                Math.cos(a) * data.distance, 0,
                Math.sin(a) * data.distance
            ));
        }
        
        const geo = new THREE.BufferGeometry().setFromPoints(points);
        const mat = new THREE.LineBasicMaterial({
            color: 0x00d4ff,
            transparent: true,
            opacity: 0.15
        });
        
        const line = new THREE.Line(geo, mat);
        scene.add(line);
        orbits.push(line);
    });
}

// ============================================
// ANIMATION
// ============================================

function animate() {
    requestAnimationFrame(animate);
    
    const delta = clock.getDelta();
    const time = clock.getElapsedTime();
    
    state.fps = Math.round(1 / Math.max(delta, 0.001));
    document.getElementById('fps').textContent = Math.min(state.fps, 999);
    
    if (state.playing) {
        state.time += delta * state.speed;
        updateTime();
        animateSun(time);
        animatePlanets(time);
        animateGalaxy();
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

function updateTime() {
    const m = Math.floor(state.time / 60) % 60;
    const s = Math.floor(state.time) % 60;
    document.getElementById('time').textContent = 
        `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function animateSun(time) {
    if (!planets.sun) return;
    
    // Update sun shader
    if (planets.sun.mat) {
        planets.sun.mat.uniforms.uTime.value = time;
    }
    
    // Rotate sun
    planets.sun.mesh.rotation.y += PLANETS.sun.rotationSpeed * state.speed;
}

function animatePlanets(time) {
    Object.entries(planets).forEach(([key, p]) => {
        if (key === 'sun') return;
        
        // Orbit
        p.angle += p.data.orbitSpeed * state.speed;
        const x = Math.cos(p.angle) * p.data.distance;
        const z = Math.sin(p.angle) * p.data.distance;
        
        p.mesh.position.set(x, 0, z);
        
        // Update shader time
        if (p.mat) {
            p.mat.uniforms.uTime.value = time;
        }
        
        // Rotation
        p.mesh.rotation.y += p.data.rotationSpeed * state.speed;
        
        // Atmosphere
        if (p.mesh.userData.atmosphere) {
            p.mesh.userData.atmosphere.position.set(x, 0, z);
        }
        
        // Ring
        if (p.mesh.userData.ring) {
            p.mesh.userData.ring.position.set(x, 0, z);
        }
        
        // Moon
        if (p.mesh.userData.moon) {
            const ma = time * 0.3;
            p.mesh.userData.moon.position.set(Math.cos(ma) * 2, 0, Math.sin(ma) * 2);
        }
    });
}

function animateGalaxy() {
    if (galaxy) {
        galaxy.rotation.y += 0.00003 * state.speed;
    }
}

// ============================================
// INTERACTIONS
// ============================================

function setupEvents() {
    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick);
    window.addEventListener('keydown', onKeyDown);
    
    // Control buttons
    document.getElementById('btn-play').addEventListener('click', togglePlay);
    document.getElementById('btn-reset').addEventListener('click', resetCamera);
    document.getElementById('btn-orbits').addEventListener('click', toggleOrbits);
    document.getElementById('btn-labels').addEventListener('click', toggleLabels);
    document.getElementById('btn-sound').addEventListener('click', toggleSound);
    
    // Speed slider
    document.getElementById('speed').addEventListener('input', e => {
        state.speed = parseFloat(e.target.value);
        document.getElementById('speed-val').textContent = state.speed.toFixed(1) + 'x';
    });
    
    // Popup
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

function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(e) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    
    const meshes = Object.values(planets).map(p => p.mesh);
    const hits = raycaster.intersectObjects(meshes);
    
    const tooltip = document.getElementById('tooltip');
    
    if (hits.length > 0) {
        document.body.classList.add('clickable');
        
        const obj = hits[0].object;
        const data = obj.userData.data || PLANETS[obj.userData.name];
        
        if (data) {
            tooltip.classList.remove('hidden');
            tooltip.textContent = data.name;
            tooltip.style.left = e.clientX + 'px';
            tooltip.style.top = e.clientY + 'px';
        }
    } else {
        document.body.classList.remove('clickable');
        tooltip.classList.add('hidden');
    }
}

function onClick(e) {
    // Ignore clicks on UI
    if (e.target.closest('#controls') || 
        e.target.closest('#planet-popup') || 
        e.target.closest('#header')) return;
    
    raycaster.setFromCamera(mouse, camera);
    
    const meshes = Object.values(planets).map(p => p.mesh);
    const hits = raycaster.intersectObjects(meshes);
    
    if (hits.length > 0) {
        const obj = hits[0].object;
        const name = obj.userData.name;
        
        if (name && PLANETS[name]) {
            showPopup(name, PLANETS[name]);
        }
    }
}

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
    
    // Update planet visual color
    const visual = document.getElementById('popup-visual');
    const c1 = data.colors[0].toString(16).padStart(6, '0');
    const c2 = data.colors[1].toString(16).padStart(6, '0');
    visual.style.background = `linear-gradient(135deg, #${c1}, #${c2})`;
    
    document.getElementById('planet-popup').classList.remove('hidden');
    
    // Auto-speak if sound enabled
    if (state.soundEnabled) {
        speakInfo();
    }
}

function closePopup() {
    document.getElementById('planet-popup').classList.add('hidden');
    stopSpeaking();
}

function speakInfo() {
    stopSpeaking();
    
    if (!state.selectedPlanet || !PLANETS[state.selectedPlanet]) return;
    
    const data = PLANETS[state.selectedPlanet];
    const text = `${data.name}. ${data.type}. 
        Diameter: ${data.diameter}. 
        Distance from Sun: ${data.distanceFromSun}. 
        Orbital period: ${data.period}. 
        Temperature: ${data.temp}. 
        Moons: ${data.moons}. 
        ${data.fact}`;
    
    currentUtterance = new SpeechSynthesisUtterance(text);
    currentUtterance.rate = 0.9;
    currentUtterance.pitch = 1;
    
    speechSynth.speak(currentUtterance);
    document.getElementById('popup-speak').classList.add('active');
    
    currentUtterance.onend = () => {
        document.getElementById('popup-speak').classList.remove('active');
    };
}

function stopSpeaking() {
    if (speechSynth.speaking) {
        speechSynth.cancel();
    }
    document.getElementById('popup-speak').classList.remove('active');
}

function focusOn(name) {
    const p = planets[name];
    if (!p) return;
    
    const pos = new THREE.Vector3();
    p.mesh.getWorldPosition(pos);
    
    const offset = p.data.radius * 5 + 10;
    const target = new THREE.Vector3(
        pos.x + offset * 0.5,
        pos.y + offset * 0.3,
        pos.z + offset
    );
    
    animateCamera(target, pos);
    closePopup();
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

// ============================================
// CONTROLS
// ============================================

function togglePlay() {
    state.playing = !state.playing;
    const btn = document.getElementById('btn-play');
    const pause = document.getElementById('icon-pause');
    const play = document.getElementById('icon-play');
    
    pause.style.display = state.playing ? 'block' : 'none';
    play.style.display = state.playing ? 'none' : 'block';
    btn.classList.toggle('active', state.playing);
}

function resetCamera() {
    state.followTarget = null;
    animateCamera(new THREE.Vector3(40, 30, 60), new THREE.Vector3(0, 0, 0));
}

function toggleOrbits() {
    state.showOrbits = !state.showOrbits;
    orbits.forEach(o => o.visible = state.showOrbits);
    document.getElementById('btn-orbits').classList.toggle('active', state.showOrbits);
}

function toggleLabels() {
    state.showLabels = !state.showLabels;
    document.getElementById('btn-labels').classList.toggle('active', state.showLabels);
}

function toggleSound() {
    state.soundEnabled = !state.soundEnabled;
    document.getElementById('btn-sound').classList.toggle('active', state.soundEnabled);
    if (!state.soundEnabled) stopSpeaking();
}

function onKeyDown(e) {
    if (e.target.tagName === 'INPUT') return;
    
    switch(e.key.toLowerCase()) {
        case ' ': e.preventDefault(); togglePlay(); break;
        case 'r': resetCamera(); break;
        case 'o': toggleOrbits(); break;
        case 'l': toggleLabels(); break;
        case 'm': toggleSound(); break;
        case 'escape': closePopup(); state.followTarget = null; break;
        case '0': showPopup('sun', PLANETS.sun); break;
        case '1': showPopup('mercury', PLANETS.mercury); break;
        case '2': showPopup('venus', PLANETS.venus); break;
        case '3': showPopup('earth', PLANETS.earth); break;
        case '4': showPopup('mars', PLANETS.mars); break;
        case '5': showPopup('jupiter', PLANETS.jupiter); break;
        case '6': showPopup('saturn', PLANETS.saturn); break;
        case '7': showPopup('uranus', PLANETS.uranus); break;
        case '8': showPopup('neptune', PLANETS.neptune); break;
    }
}

// ============================================
// START
// ============================================

init();
