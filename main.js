// ============================================
// COSMOS EXPLORER - Ultimate Solar System
// Advanced Three.js Implementation with Shader Sun
// ============================================

import * as THREE from 'three';
import { SUN_VERTEX_SHADER, SUN_FRAGMENT_SHADER } from './src/shaders/sunShaders.js';
import { SUN_SURFACE_VERTEX_SHADER, SUN_SURFACE_FRAGMENT_SHADER } from './src/shaders/sunSurfaceShaders.js';
import { MOON_SURFACE_VERTEX_SHADER, MOON_SURFACE_FRAGMENT_SHADER } from './src/shaders/moonSurfaceShaders.js';
import { MOON_VERTEX_SHADER, MOON_FRAGMENT_SHADER } from './src/shaders/moonShaders.js';
import { PLANET_DATA } from './src/data/planetData.js';
import { createPlanetTexture, createCloudTexture, createRingTexture, createGlowTexture, createNebulaTexture, createProminenceTexture, createNoiseTexture } from './src/utils/textures.js';
import { setupCameraSystem, updateSmoothZoom, updateKeyboardPan, resetZoomState } from './src/utils/cameraSystem.js';

// ============================================
// SHADERS & DATA (defined in modules)
// ============================================

// ============================================
// GLOBAL STATE
// ============================================

let scene, camera, renderer, controls;
let sun, sunLight, sunFlares = [], sunProminences = [];
const sunFreqs = new THREE.Vector4();
const sunWorldPos = new THREE.Vector3();
const moonWorldPos = new THREE.Vector3();
const moonLightDir = new THREE.Vector3();
const moonWorldQuat = new THREE.Quaternion();
let planets = {}, planetLabels = {};
let orbitLines = [], asteroidBelt, kuiperBelt;
let galaxy, nebulae = [], dustClouds = [], starLayers = [];
let raycaster, mouse;
let clock = new THREE.Clock();
let sunSurfaceView = null;
let moonSurfaceView = null;

const state = {
    isPlaying: true,
    timeSpeed: 0.3,
    reverseTime: false,
    selectedObject: null,
    followTarget: null,
    showOrbits: true,
    showLabels: true,
    showAsteroids: true,
    animateAsteroids: true,
    showKuiper: true,
    showStars: true,
    showGalaxy: true,
    showNebulae: true,
    coronaIntensity: 1,
    flareIntensity: 1,
    sunLightIntensity: 2.5,
    showProminences: false,
    planetScale: 1,
    orbitScale: 1,
    asteroidDensity: 1200,
    asteroidSize: 0.4,
    atmosphereIntensity: 1,
    fps: 60,
    isCameraAnimating: false,
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
    setupRenderer();
    ({ camera, controls } = setupCameraSystem(renderer, state));
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
    DOM.shortcutsHelp = document.getElementById('shortcuts-help');
    DOM.fpsCounter = document.getElementById('fps-counter');
    DOM.simTime = document.getElementById('sim-time');
    DOM.objectCount = document.getElementById('object-count');
}

function setupScene() {
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000510, 0.0008);
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

function createSunSurfaceNoiseTexture(size) {
    const data = new Uint8Array(size * size * 4);
    for (let i = 0; i < size * size * 4; i++) {
        data[i] = Math.random() * 255;
    }
    const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearMipMapLinearFilter;
    texture.generateMipmaps = true;
    texture.needsUpdate = true;
    return texture;
}

// Smooth zoom state
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
    const count = 35000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const palette = [
        new THREE.Color(0x6a4fb4), new THREE.Color(0x3b6db1),
        new THREE.Color(0xa85fd0), new THREE.Color(0x5fc2ff)
    ];

    const armCount = 3;

    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const arm = i % armCount;
        const radius = Math.random() * 900 + 200;
        const spin = radius * 0.0026;
        const branch = (arm / armCount) * Math.PI * 2;
        const scatter = Math.pow(Math.random(), 2.2) * 140;

        positions[i3] = Math.cos(branch + spin) * radius + (Math.random() - 0.5) * scatter;
        positions[i3 + 1] = (Math.random() - 0.5) * scatter * 0.08 - 260;
        positions[i3 + 2] = Math.sin(branch + spin) * radius + (Math.random() - 0.5) * scatter - 600;

        const color = palette[Math.floor(Math.random() * palette.length)];
        const bright = 0.15 + (1 - radius / 1100) * 0.35;
        colors[i3] = color.r * bright;
        colors[i3 + 1] = color.g * bright;
        colors[i3 + 2] = color.b * bright;
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
        size: 1.0, vertexColors: true, transparent: true,
        opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false
    });

    galaxy = new THREE.Points(geom, mat);
    galaxy.rotation.x = Math.PI * 0.12;
    scene.add(galaxy);

    const dustTex = createNebulaTexture(0x6d4dbb);
    const dustMat = new THREE.SpriteMaterial({
        map: dustTex, transparent: true, opacity: 0.18,
        blending: THREE.NormalBlending, depthWrite: false
    });
    const dust = new THREE.Sprite(dustMat);
    dust.position.set(0, -220, -700);
    dust.scale.set(1600, 800, 1);
    scene.add(dust);

    const coreTex = createGlowTexture(0xceb7ff, 0x5b9bdc);
    const coreMat = new THREE.SpriteMaterial({
        map: coreTex, transparent: true, opacity: 0.12,
        blending: THREE.AdditiveBlending, depthWrite: false
    });
    const core = new THREE.Sprite(coreMat);
    core.position.set(0, -220, -700);
    core.scale.set(700, 700, 1);
    scene.add(core);
}

function createNebulae() {
    const configs = [
        { color: 0x5637a3, pos: [-520, 120, -900], scale: 950, op: 0.16 },
        { color: 0x3b6fb1, pos: [540, -160, -880], scale: 900, op: 0.15 },
        { color: 0xb054c7, pos: [180, 240, -820], scale: 1050, op: 0.14 },
        { color: 0x2f87bf, pos: [-260, -220, -700], scale: 780, op: 0.16 }
    ];

    configs.forEach(cfg => {
        const tex = createNebulaTexture(cfg.color);
        const mat = new THREE.SpriteMaterial({
            map: tex, transparent: true, opacity: cfg.op,
            blending: THREE.NormalBlending, depthWrite: false
        });
        const sprite = new THREE.Sprite(mat);
        sprite.position.set(...cfg.pos);
        sprite.scale.set(cfg.scale, cfg.scale, 1);
        sprite.rotation.z = Math.random() * Math.PI * 2;
        nebulae.push(sprite);
        scene.add(sprite);
    });
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
        stars.visible = state.showStars;
        scene.add(stars);
        starLayers.push(stars);
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
    sunGroup.userData = { ...PLANET_DATA.sun, key: 'sun' };
    sunProminences = [];

    // Shader-based animated Sun
    // High segment count for better vertex displacement
    const sunSize = PLANET_DATA.sun.radius * 2.6;
    const sunGeom = new THREE.PlaneGeometry(sunSize, sunSize, 1, 1);

    const sunMat = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uFreqs: { value: sunFreqs },
            uNoiseTex: { value: createNoiseTexture() }
        },
        vertexShader: SUN_VERTEX_SHADER,
        fragmentShader: SUN_FRAGMENT_SHADER,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide
    });

    sun = new THREE.Mesh(sunGeom, sunMat);
    sunGroup.add(sun);

    // Glow layers (Sprites)
    const glows = [
        { size: 16, op: 0.65, color1: 0xfff2b0, color2: 0xffb347 },
        { size: 24, op: 0.4, color1: 0xffd27a, color2: 0xff8a33 },
        { size: 34, op: 0.25, color1: 0xffa34a, color2: 0xff5c1a },
        { size: 48, op: 0.12, color1: 0xff7a2a, color2: 0xff2d00 }
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

    // Prominences / filaments
    const prominenceTex = createProminenceTexture();
    const prominenceCount = 10;
    for (let i = 0; i < prominenceCount; i++) {
        const mat = new THREE.SpriteMaterial({
            map: prominenceTex, transparent: true,
            opacity: 0.12 + Math.random() * 0.12,
            blending: THREE.AdditiveBlending, depthWrite: false
        });
        const sprite = new THREE.Sprite(mat);
        const angle = (i / prominenceCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
        const radius = PLANET_DATA.sun.radius * 1.01;
        sprite.position.set(
            Math.cos(angle) * radius,
            (Math.random() - 0.5) * 0.35,
            Math.sin(angle) * radius
        );
        const width = 1.2 + Math.random() * 0.8;
        const height = 2.5 + Math.random() * 2.5;
        sprite.scale.set(width, height, 1);
        mat.rotation = Math.random() * Math.PI;
        sprite.userData = {
            type: 'prominence',
            baseScaleX: width,
            baseScaleY: height,
            baseOpacity: mat.opacity,
            index: i
        };
        sprite.visible = state.showProminences;
        sunProminences.push(sprite);
        sunGroup.add(sprite);
    }

    // Flares
    for (let i = 0; i < 4; i++) {
        const tex = createGlowTexture(0xffcc00, 0xff6600);
        const mat = new THREE.SpriteMaterial({
            map: tex, transparent: true, opacity: 0.18,
            blending: THREE.AdditiveBlending, depthWrite: false
        });
        const flare = new THREE.Sprite(mat);
        const dist = 12 + i * 6;
        flare.scale.set(3.5, 3.5, 1);
        flare.position.set(dist, 0, 0);
        flare.userData = { type: 'lensFlare', baseDist: dist, baseOp: 0.18 };
        sunFlares.push(flare);
        sunGroup.add(flare);
    }

    scene.add(sunGroup);
    planets.sun = { mesh: sunGroup, group: sunGroup, data: PLANET_DATA.sun, angle: 0 };
}

// ============================================
// PLANETS
// ============================================

function createAllPlanets() {
    Object.keys(PLANET_DATA).forEach(key => {
        if (key !== 'sun' && !PLANET_DATA[key].isSatellite) createPlanet(key, PLANET_DATA[key]);
    });
}

function createPlanet(key, data) {
    const group = new THREE.Group();
    group.userData = { ...data, key };

    const geom = new THREE.SphereGeometry(data.radius * state.planetScale, 64, 64);
    const tex = createPlanetTexture(key, data);
    const mat = new THREE.MeshStandardMaterial({
        map: tex, roughness: 0.85, metalness: 0.1
    });

    const planet = new THREE.Mesh(geom, mat);
    planet.castShadow = true;
    planet.receiveShadow = true;
    planet.position.x = data.distance * state.orbitScale;
    planet.userData = { ...data, key };
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
        const moonData = PLANET_DATA.moon;
        const moonRadius = moonData?.radius ?? 0.27;
        const moonGeom = new THREE.SphereGeometry(moonRadius * state.planetScale, 128, 128);
        const moonMat = moonData
            ? new THREE.ShaderMaterial({
                vertexShader: MOON_VERTEX_SHADER,
                fragmentShader: MOON_FRAGMENT_SHADER,
                uniforms: {
                    sunPosition: { value: new THREE.Vector3(10, 5, 10) }
                }
            })
            : new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.95 });
        const moon = new THREE.Mesh(moonGeom, moonMat);
        moon.position.set(2.5 * state.planetScale, 0, 0);
        if (moonData) {
            moon.userData = { ...moonData, key: 'moon' };
        } else {
            moon.userData = { key: 'moon', name: 'moon' };
        }
        planet.add(moon);
        planet.userData.moon = moon;
        if (moonData) {
            planets.moon = { mesh: moon, group: moon, data: moonData, angle: 0 };
            createLabel('moon', moonData, moon);
        }
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

function disposeMesh(mesh) {
    if (!mesh) return;
    mesh.geometry?.dispose();
    if (Array.isArray(mesh.material)) mesh.material.forEach(m => m.dispose());
    else mesh.material?.dispose();
}

function createAsteroidBeltMesh(count, size) {
    const geom = new THREE.IcosahedronGeometry(0.45, 0);
    const mat = new THREE.MeshStandardMaterial({
        color: 0xb29987,
        roughness: 0.95,
        metalness: 0.02,
        emissive: 0x1d120a,
        emissiveIntensity: 0.45,
        flatShading: true,
        vertexColors: true
    });

    const mesh = new THREE.InstancedMesh(geom, mat, count);
    const dummy = new THREE.Object3D();
    const baseSize = Math.max(0.15, size);

    for (let i = 0; i < count; i++) {
        const r = 30 + Math.random() * 10 + (Math.random() - 0.5) * 2.5;
        const a = Math.random() * Math.PI * 2;
        const y = (Math.random() - 0.5) * 4;
        const s = baseSize * (0.5 + Math.random() * 1.4);
        const sx = s * (0.6 + Math.random() * 0.9);
        const sy = s * (0.35 + Math.random() * 1.1);
        const sz = s * (0.6 + Math.random() * 0.9);

        dummy.position.set(Math.cos(a) * r, y, Math.sin(a) * r);
        dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        dummy.scale.set(sx, sy, sz);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);

        const tint = 0.5 + Math.random() * 0.5;
        const warmth = 0.04 + Math.random() * 0.12;
        mesh.setColorAt(i, new THREE.Color(0.55 * tint + warmth, 0.5 * tint, 0.45 * tint));
    }

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.frustumCulled = false;
    mesh.castShadow = false;
    mesh.receiveShadow = false;
    return mesh;
}

function rebuildAsteroidBelt() {
    const prevRotation = asteroidBelt ? asteroidBelt.rotation.y : 0;
    if (asteroidBelt) {
        scene.remove(asteroidBelt);
        disposeMesh(asteroidBelt);
    }

    asteroidBelt = createAsteroidBeltMesh(state.asteroidDensity, state.asteroidSize);
    asteroidBelt.visible = state.showAsteroids;
    asteroidBelt.rotation.y = prevRotation;
    asteroidBelt.scale.set(state.orbitScale, 1, state.orbitScale);
    scene.add(asteroidBelt);
}

function createAsteroidBelt() {
    rebuildAsteroidBelt();
}

function createKuiperBelt() {
    const count = 1200;
    const geom = new THREE.IcosahedronGeometry(0.18, 0);
    const mat = new THREE.MeshStandardMaterial({
        color: 0xa9bdd2,
        roughness: 0.9,
        metalness: 0.02,
        emissive: 0x0f1722,
        emissiveIntensity: 0.25,
        vertexColors: true
    });

    const mesh = new THREE.InstancedMesh(geom, mat, count);
    const dummy = new THREE.Object3D();

    for (let i = 0; i < count; i++) {
        const r = 90 + Math.random() * 40;
        const a = Math.random() * Math.PI * 2;
        const y = (Math.random() - 0.5) * 8;
        const s = 0.14 * (0.6 + Math.random() * 0.8);

        dummy.position.set(Math.cos(a) * r, y, Math.sin(a) * r);
        dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        dummy.scale.set(s, s * (0.6 + Math.random() * 0.8), s);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);

        const tint = 0.6 + Math.random() * 0.35;
        mesh.setColorAt(i, new THREE.Color(0.65 * tint, 0.75 * tint, 0.9 * tint));
    }

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.frustumCulled = false;
    mesh.visible = state.showKuiper;
    mesh.castShadow = false;
    mesh.receiveShadow = false;

    kuiperBelt = mesh;
    scene.add(kuiperBelt);
}

function applyPlanetScale(newScale) {
    if (!newScale || newScale === state.planetScale) return;
    const factor = newScale / state.planetScale;

    Object.values(planets).forEach(p => {
        if (!p?.mesh) return;
        if (p.data?.isSatellite) return;
        p.mesh.scale.multiplyScalar(factor);
        const atmo = p.mesh.userData?.atmosphere;
        if (atmo) atmo.scale.multiplyScalar(factor);
        const clouds = p.mesh.userData?.clouds;
        if (clouds) clouds.scale.multiplyScalar(factor);
        const ring = p.mesh.userData?.ring;
        if (ring) ring.scale.multiplyScalar(factor);
    });

    state.planetScale = newScale;
}

function applyOrbitScale(newScale) {
    if (!newScale || newScale === state.orbitScale) return;
    const factor = newScale / state.orbitScale;

    orbitLines.forEach(line => {
        line.scale.x *= factor;
        line.scale.z *= factor;
    });
    if (asteroidBelt) {
        asteroidBelt.scale.x *= factor;
        asteroidBelt.scale.z *= factor;
    }
    if (kuiperBelt) {
        kuiperBelt.scale.x *= factor;
        kuiperBelt.scale.z *= factor;
    }

    state.orbitScale = newScale;
}

// ============================================
// ANIMATION
// ============================================

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const time = clock.getElapsedTime();

    // Update FPS counter
    state.fps = Math.round(1 / delta);
    if (DOM.fpsCounter) DOM.fpsCounter.textContent = state.fps;

    // 1. Update Simulation (Planets orbiting, Sun glowing)
    if (state.isPlaying) {
        state.simTime += delta * state.timeSpeed * (state.reverseTime ? -1 : 1);
        updateSimTime();
        animatePlanets(time);
        animateAsteroids();
        animateBackground();
    }

    animateSun(time);

    // 2. Camera Follow Logic (The Fix)
    // This moves the camera perfectly with the planet while allowing you to zoom
    if (state.followTarget && planets[state.followTarget] && !state.isCameraAnimating) {
        const targetMesh = planets[state.followTarget].mesh;

        // A. Get the planet's current position
        const currentTargetPos = new THREE.Vector3();
        targetMesh.getWorldPosition(currentTargetPos);

        // B. Calculate how much the planet moved since the last frame
        // We compare the planet's position to where the camera is currently looking (controls.target)
        const moveDelta = currentTargetPos.clone().sub(controls.target);

        // C. Move BOTH the camera and the "look at" point by that exact amount
        controls.target.add(moveDelta);
        camera.position.add(moveDelta);
    }

    // 3. Update smooth zoom, keyboard pan, labels, and render
    updateSmoothZoom();
    updateKeyboardPan(state);
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

    // UPDATE: Feed the time to the shader
    // The mesh is the first child (index 0) of the sunGroup
    if (sun?.material?.uniforms) {
        sun.material.uniforms.uTime.value = time;
        sunFreqs.set(
            0.12 + 0.08 * Math.sin(time * 0.7),
            0.18 + 0.1 * Math.sin(time * 0.4 + 1.2),
            0.2 + 0.12 * Math.sin(time * 0.5 + 2.6),
            0.16 + 0.08 * Math.sin(time * 0.6 + 3.8)
        );
    }

    if (sun) {
        sun.lookAt(camera.position);
    }

    group.children.forEach(child => {
        if (child.userData.type === 'corona') {
            const pulse = 1 + Math.sin(time * 2 + child.userData.index) * 0.08;
            const scale = child.userData.baseScale * pulse * state.coronaIntensity;
            child.scale.set(scale, scale, 1);
        }
        if (child.userData.type === 'lensFlare') {
            child.material.opacity = child.userData.baseOp * state.flareIntensity * (0.8 + Math.sin(time * 3) * 0.2);
        }
        if (child.userData.type === 'prominence') {
            const flutter = 0.85 + Math.sin(time * 2.6 + child.userData.index) * 0.15;
            child.scale.set(
                child.userData.baseScaleX * (0.9 + Math.sin(time * 1.6 + child.userData.index) * 0.1),
                child.userData.baseScaleY * flutter,
                1
            );
            child.material.opacity = child.userData.baseOpacity * (0.75 + Math.sin(time * 1.8 + child.userData.index) * 0.15);
        }
    });

    if (sunLight) sunLight.intensity = state.sunLightIntensity;
}

function animatePlanets(time) {
    const dir = state.reverseTime ? -1 : 1;
    if (planets.sun?.group) planets.sun.group.getWorldPosition(sunWorldPos);

    Object.entries(planets).forEach(([key, p]) => {
        if (key === 'sun' || p.data?.isSatellite) return;

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
            const moonMesh = p.mesh.userData.moon;
            moonMesh.position.set(
                Math.cos(ma) * 2.5 * state.planetScale,
                0,
                Math.sin(ma) * 2.5 * state.planetScale
            );
            moonMesh.rotation.y += 0.01 * state.timeSpeed * dir;

            const moonMat = moonMesh.material;
            if (moonMat?.uniforms?.sunPosition) {
                moonMesh.getWorldPosition(moonWorldPos);
                moonLightDir.copy(sunWorldPos).sub(moonWorldPos).normalize();
                moonMesh.getWorldQuaternion(moonWorldQuat).invert();
                moonLightDir.applyQuaternion(moonWorldQuat);
                moonMat.uniforms.sunPosition.value.copy(moonLightDir);
            }
        }
    });
}

function animateAsteroids() {
    if (!state.animateAsteroids) return;
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

function initSunSurfaceView() {
    if (sunSurfaceView) return;
    const modal = document.getElementById('sun-surface-modal');
    const host = document.getElementById('sun-surface-canvas');
    if (!modal || !host) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    host.appendChild(renderer.domElement);

    const material = new THREE.ShaderMaterial({
        vertexShader: SUN_SURFACE_VERTEX_SHADER,
        fragmentShader: SUN_SURFACE_FRAGMENT_SHADER,
        uniforms: {
            iTime: { value: 0 },
            iResolution: { value: new THREE.Vector2(1, 1) },
            iMouse: { value: new THREE.Vector2(0, 0) },
            iChannel0: { value: createSunSurfaceNoiseTexture(256) }
        }
    });

    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(quad);

    const mouse = new THREE.Vector2(0, 0);

    const updateSize = () => {
        const rect = host.getBoundingClientRect();
        const w = Math.max(1, rect.width);
        const h = Math.max(1, rect.height);
        renderer.setSize(w, h, true);
        material.uniforms.iResolution.value.set(w, h);
        mouse.set(w * 0.5, h * 0.5);
    };

    updateSize();

    host.addEventListener('pointermove', (e) => {
        const rect = host.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = rect.height - (e.clientY - rect.top);
        mouse.set(x, y);
    });

    host.addEventListener('touchmove', (e) => {
        if (!e.touches || !e.touches.length) return;
        const rect = host.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        const y = rect.height - (e.touches[0].clientY - rect.top);
        mouse.set(x, y);
    }, { passive: true });

    sunSurfaceView = {
        modal,
        host,
        scene,
        camera,
        renderer,
        material,
        mouse,
        raf: null,
        active: false,
        updateSize
    };
}

function initMoonSurfaceView() {
    if (moonSurfaceView) return;
    const modal = document.getElementById('moon-surface-modal');
    const host = document.getElementById('moon-surface-canvas');
    if (!modal || !host) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    host.appendChild(renderer.domElement);

    const material = new THREE.ShaderMaterial({
        vertexShader: MOON_SURFACE_VERTEX_SHADER,
        fragmentShader: MOON_SURFACE_FRAGMENT_SHADER,
        uniforms: {
            iTime: { value: 0 },
            iResolution: { value: new THREE.Vector2(1, 1) }
        },
        transparent: true
    });

    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(quad);

    const updateSize = () => {
        const rect = host.getBoundingClientRect();
        const w = Math.max(1, rect.width);
        const h = Math.max(1, rect.height);
        renderer.setSize(w, h, true);
        material.uniforms.iResolution.value.set(w, h);
    };

    updateSize();

    moonSurfaceView = {
        modal,
        host,
        scene,
        camera,
        renderer,
        material,
        raf: null,
        active: false,
        updateSize
    };
}

function openSunSurfaceView() {
    initSunSurfaceView();
    if (!sunSurfaceView || sunSurfaceView.active) return;
    sunSurfaceView.active = true;
    sunSurfaceView.modal.classList.remove('hidden');
    sunSurfaceView.updateSize();

    const tick = () => {
        if (!sunSurfaceView || !sunSurfaceView.active) return;
        sunSurfaceView.raf = requestAnimationFrame(tick);
        sunSurfaceView.material.uniforms.iTime.value = performance.now() * 0.001;
        sunSurfaceView.material.uniforms.iMouse.value.copy(sunSurfaceView.mouse);
        sunSurfaceView.renderer.render(sunSurfaceView.scene, sunSurfaceView.camera);
    };
    tick();
}

function closeSunSurfaceView() {
    if (!sunSurfaceView || !sunSurfaceView.active) return;
    sunSurfaceView.active = false;
    sunSurfaceView.modal.classList.add('hidden');
    if (sunSurfaceView.raf) {
        cancelAnimationFrame(sunSurfaceView.raf);
        sunSurfaceView.raf = null;
    }
}

function openMoonSurfaceView() {
    initMoonSurfaceView();
    if (!moonSurfaceView || moonSurfaceView.active) return;
    moonSurfaceView.active = true;
    moonSurfaceView.modal.classList.remove('hidden');
    moonSurfaceView.updateSize();

    const tick = () => {
        if (!moonSurfaceView || !moonSurfaceView.active) return;
        moonSurfaceView.raf = requestAnimationFrame(tick);
        moonSurfaceView.material.uniforms.iTime.value = performance.now() * 0.001;
        moonSurfaceView.renderer.render(moonSurfaceView.scene, moonSurfaceView.camera);
    };
    tick();
}

function closeMoonSurfaceView() {
    if (!moonSurfaceView || !moonSurfaceView.active) return;
    moonSurfaceView.active = false;
    moonSurfaceView.modal.classList.add('hidden');
    if (moonSurfaceView.raf) {
        cancelAnimationFrame(moonSurfaceView.raf);
        moonSurfaceView.raf = null;
    }
}

// ============================================
// EVENT HANDLERS
// ============================================

function setupEventListeners() {
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        if (sunSurfaceView?.active) sunSurfaceView.updateSize();
        if (moonSurfaceView?.active) moonSurfaceView.updateSize();
    });

    window.addEventListener('mousemove', onMouseMove);

    let pointerDownPos = null;
    let pointerDownTime = 0;

    window.addEventListener('pointerdown', (e) => {
        if (e.button !== 0) return;
        if (isUIInteraction(e.target)) return;
        pointerDownPos = { x: e.clientX, y: e.clientY };
        pointerDownTime = e.timeStamp;
    });

    window.addEventListener('pointerup', (e) => {
        if (!pointerDownPos) return;
        const dx = e.clientX - pointerDownPos.x;
        const dy = e.clientY - pointerDownPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const duration = e.timeStamp - pointerDownTime;
        pointerDownPos = null;

        if (distance > 20 || duration > 400) return;
        if (isUIInteraction(e.target)) return;
        handleSceneClick(e.clientX, e.clientY);
    });

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

    const sunSurfaceBtn = document.getElementById('btn-sun-surface');
    if (sunSurfaceBtn) {
        sunSurfaceBtn.style.display = 'none';
        sunSurfaceBtn.addEventListener('click', () => openSunSurfaceView());
    }
    const moonSurfaceBtn = document.getElementById('btn-moon-surface');
    if (moonSurfaceBtn) {
        moonSurfaceBtn.style.display = 'none';
        moonSurfaceBtn.addEventListener('click', () => openMoonSurfaceView());
    }
    document.getElementById('sun-surface-close')?.addEventListener('click', closeSunSurfaceView);
    document.getElementById('sun-surface-modal')?.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'sun-surface-modal') closeSunSurfaceView();
    });
    document.getElementById('moon-surface-close')?.addEventListener('click', closeMoonSurfaceView);
    document.getElementById('moon-surface-modal')?.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'moon-surface-modal') closeMoonSurfaceView();
    });

    setupControlPanelListeners();
}

function setupControlPanelListeners() {
    // Speed
    const speedSlider = document.getElementById('speed-slider');
    const speedValue = document.getElementById('speed-value');
    if (speedSlider) {
        const applySpeed = () => {
            state.timeSpeed = parseFloat(speedSlider.value);
            if (speedValue) speedValue.textContent = state.timeSpeed.toFixed(1) + 'x';
            document.querySelectorAll('.preset-btn[data-speed]').forEach(b =>
                b.classList.toggle('active', parseFloat(b.dataset.speed) === state.timeSpeed));
        };
        speedSlider.addEventListener('input', applySpeed);
        applySpeed();
    }

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

    // Camera sliders
    const rotationSlider = document.getElementById('rotation-speed');
    const rotationValue = document.getElementById('rotation-value');
    if (rotationSlider) {
        const applyRotationSpeed = () => {
            const v = parseFloat(rotationSlider.value);
            controls.autoRotateSpeed = v;
            controls.rotateSpeed = v;
            if (rotationValue) rotationValue.textContent = v.toFixed(1);
        };
        rotationSlider.addEventListener('input', applyRotationSpeed);
        applyRotationSpeed();
    }

    const fovSlider = document.getElementById('fov-slider');
    const fovValue = document.getElementById('fov-value');
    if (fovSlider) {
        const applyFov = () => {
            const v = parseFloat(fovSlider.value);
            camera.fov = v;
            camera.updateProjectionMatrix();
            if (fovValue) fovValue.textContent = `${v} deg`;
        };
        fovSlider.addEventListener('input', applyFov);
        applyFov();
    }

    // Toggles
    const toggles = [
        ['reverse-time', v => state.reverseTime = v],
        ['auto-rotate', v => controls.autoRotate = v],
        ['show-orbits', v => { state.showOrbits = v; orbitLines.forEach(l => l.visible = v); }],
        ['show-labels', v => state.showLabels = v],
        ['show-asteroids', v => { state.showAsteroids = v; if (asteroidBelt) asteroidBelt.visible = v; }],
        ['show-kuiper', v => { state.showKuiper = v; if (kuiperBelt) kuiperBelt.visible = v; }],
        ['show-stars', v => { state.showStars = v; starLayers.forEach(layer => layer.visible = v); }],
        ['show-galaxy', v => { state.showGalaxy = v; if (galaxy) galaxy.visible = v; }],
        ['show-nebulae', v => { state.showNebulae = v; nebulae.forEach(n => n.visible = v); }],
        ['show-prominences', v => {
            state.showProminences = v;
            sunProminences.forEach(p => p.visible = v);
        }]
    ];

    toggles.forEach(([id, cb]) => {
        const el = document.getElementById(id);
        el?.addEventListener('change', () => cb(el.checked));
    });

    const animateAsteroidsToggle = document.getElementById('animate-asteroids');
    if (animateAsteroidsToggle) {
        state.animateAsteroids = animateAsteroidsToggle.checked;
        animateAsteroidsToggle.addEventListener('change', () => {
            state.animateAsteroids = animateAsteroidsToggle.checked;
        });
    }

    const densitySlider = document.getElementById('asteroid-density');
    const densityValue = document.getElementById('density-value');
    if (densitySlider) {
        const applyDensity = () => {
            const v = parseInt(densitySlider.value, 10);
            state.asteroidDensity = v;
            if (densityValue) densityValue.textContent = String(v);
            rebuildAsteroidBelt();
        };
        densitySlider.addEventListener('input', () => {
            if (densityValue) densityValue.textContent = densitySlider.value;
        });
        densitySlider.addEventListener('change', applyDensity);
        applyDensity();
    }

    const sizeSlider = document.getElementById('asteroid-size');
    const sizeValue = document.getElementById('ast-size-value');
    if (sizeSlider) {
        const applySize = () => {
            const v = parseFloat(sizeSlider.value);
            state.asteroidSize = v;
            if (sizeValue) sizeValue.textContent = v.toFixed(1);
            rebuildAsteroidBelt();
        };
        sizeSlider.addEventListener('input', () => {
            if (sizeValue) sizeValue.textContent = parseFloat(sizeSlider.value).toFixed(1);
        });
        sizeSlider.addEventListener('change', applySize);
        applySize();
    }

    const effectToggles = [
        ['film-grain', 'fx-grain'],
        ['vignette', 'fx-vignette'],
        ['chromatic', 'fx-chromatic']
    ];
    effectToggles.forEach(([id, className]) => {
        const el = document.getElementById(id);
        if (!el) return;
        const apply = () => document.body.classList.toggle(className, el.checked);
        el.addEventListener('change', apply);
        apply();
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

    const planetScaleSlider = document.getElementById('planet-scale');
    if (planetScaleSlider) {
        const apply = () => applyPlanetScale(parseFloat(planetScaleSlider.value));
        planetScaleSlider.addEventListener('input', apply);
        apply();
    }

    const orbitScaleSlider = document.getElementById('orbit-scale');
    const orbitScaleValue = document.getElementById('orbit-scale-value');
    if (orbitScaleSlider) {
        const apply = () => {
            const v = parseFloat(orbitScaleSlider.value);
            applyOrbitScale(v);
            if (orbitScaleValue) orbitScaleValue.textContent = v.toFixed(1) + 'x';
        };
        orbitScaleSlider.addEventListener('input', apply);
        apply();
    }

    const realisticToggle = document.getElementById('realistic-scale');
    let savedScale = null;
    if (realisticToggle) {
        const apply = () => {
            if (realisticToggle.checked) {
                savedScale = {
                    planet: planetScaleSlider ? parseFloat(planetScaleSlider.value) : state.planetScale,
                    orbit: orbitScaleSlider ? parseFloat(orbitScaleSlider.value) : state.orbitScale
                };
                if (planetScaleSlider) {
                    planetScaleSlider.value = '1';
                    planetScaleSlider.disabled = true;
                }
                if (orbitScaleSlider) {
                    orbitScaleSlider.value = '1';
                    orbitScaleSlider.disabled = true;
                }
                applyPlanetScale(1);
                applyOrbitScale(1);
                if (orbitScaleValue) orbitScaleValue.textContent = '1.0x';
            } else {
                if (planetScaleSlider) planetScaleSlider.disabled = false;
                if (orbitScaleSlider) orbitScaleSlider.disabled = false;
                if (savedScale) {
                    if (planetScaleSlider) planetScaleSlider.value = String(savedScale.planet);
                    if (orbitScaleSlider) orbitScaleSlider.value = String(savedScale.orbit);
                    applyPlanetScale(savedScale.planet);
                    applyOrbitScale(savedScale.orbit);
                    if (orbitScaleValue) orbitScaleValue.textContent = savedScale.orbit.toFixed(1) + 'x';
                    savedScale = null;
                }
            }
        };
        realisticToggle.addEventListener('change', apply);
        apply();
    }

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

    const hoverTargets = Object.values(planets)
        .map(p => p.group || p.mesh)
        .filter(Boolean);
    const intersects = raycaster.intersectObjects(hoverTargets, true);

    if (intersects.length > 0) {
        document.body.classList.add('hovering-planet');
    } else {
        document.body.classList.remove('hovering-planet');
    }
}

function handleSceneClick(clientX, clientY) {
    mouse.x = (clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const clickTargets = Object.values(planets)
        .map(p => p.group || p.mesh)
        .filter(Boolean);
    const intersects = raycaster.intersectObjects(clickTargets, true);

    let sunHit = null;
    for (const hit of intersects) {
        const name = getPlanetNameFromObject(hit.object);
        if (!name) continue;
        if (name === 'sun') {
            if (!sunHit) sunHit = name;
            continue;
        }
        selectObject(name);
        return;
    }

    if (sunHit) selectObject(sunHit);
}

function getPlanetNameFromObject(object) {
    let current = object;
    while (current) {
        if (current.userData) {
            if (current.userData.key) return current.userData.key;
            if (current.userData.name) {
                if (PLANET_DATA[current.userData.name]) return current.userData.name;
                const lower = current.userData.name.toLowerCase();
                if (PLANET_DATA[lower]) return lower;
            }
        }
        current = current.parent;
    }
    return null;
}

function isUIInteraction(target) {
    if (!target) return false;
    return !!target.closest(
        '#control-panel, #quick-actions, #panel-toggle, #info-panel, #main-header, #loading, #shortcuts-help, #sun-surface-modal, #moon-surface-modal, button, input, select, textarea, .quick-btn, .action-btn, .preset-btn, .toggle-switch, .panel-toggle, .control-section'
    );
}

function showPlanetInfoPanel() {
    DOM.infoPanel?.classList.remove('hidden');
}

function selectObject(name) {
    state.selectedObject = name;
    const data = PLANET_DATA[name];
    if (!data) return false;

    showPlanetInfoPanel();

    const sunSurfaceBtn = document.getElementById('btn-sun-surface');
    if (sunSurfaceBtn) {
        sunSurfaceBtn.style.display = name === 'sun' ? 'inline-flex' : 'none';
    }
    const moonSurfaceBtn = document.getElementById('btn-moon-surface');
    if (moonSurfaceBtn) {
        moonSurfaceBtn.style.display = name === 'moon' ? 'inline-flex' : 'none';
    }
    if (name !== 'sun') closeSunSurfaceView();
    if (name !== 'moon') closeMoonSurfaceView();

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

    // Focus on the object and start following it
    focusOnObject(name);
    state.followTarget = name;
    const sel = document.getElementById('camera-target');
    if (sel) sel.value = name;

    // Reset zoom state to sync with new camera position
    resetZoomState();

    return true;
}

function focusOnObject(name) {
    const p = planets[name];
    if (!p) return;

    const pos = new THREE.Vector3();
    p.mesh.getWorldPosition(pos);

    // Calculate offset based on object size, with min/max bounds to prevent extreme jumps
    let offset;
    if (name === 'sun') {
        offset = 25; // Distance for Sun viewing (sun radius is 6, so 25 keeps us safely outside)
    } else {
        // Base offset on radius but clamp to reasonable values (min 15 to match controls.minDistance)
        offset = Math.min(Math.max(p.data.radius * state.planetScale * 4 + 10, 15), 35);
    }

    animateCamera(
        new THREE.Vector3(pos.x + offset * 0.6, pos.y + offset * 0.3, pos.z + offset * 0.8),
        pos
    );
}

function animateCamera(targetPos, lookAt) {
    const startPos = camera.position.clone();
    const startTarget = controls.target.clone();
    const start = Date.now();
    const duration = 1200;

    state.isCameraAnimating = true;

    function update() {
        const t = Math.min((Date.now() - start) / duration, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        camera.position.lerpVectors(startPos, targetPos, ease);
        controls.target.lerpVectors(startTarget, lookAt, ease);
        controls.update();
        if (t < 1) {
            requestAnimationFrame(update);
        } else {
            state.isCameraAnimating = false;
        }
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
    closeSunSurfaceView();
    closeMoonSurfaceView();
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

init();
