// ============================================
// Interactive 3D Solar System with Three.js
// ============================================

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ============================================
// Planet Data
// ============================================

const planetData = {
    mercury: {
        name: 'Mercury',
        radius: 0.4,
        distance: 10,
        orbitSpeed: 0.04,
        rotationSpeed: 0.004,
        color: 0xa0a0a0,
        emissive: 0x222222,
        distanceFromSun: '57.9 million km',
        orbitalPeriod: '88 Earth days',
        fact: 'Mercury is the smallest planet in our solar system and the closest to the Sun. A year on Mercury is just 88 Earth days.'
    },
    venus: {
        name: 'Venus',
        radius: 0.9,
        distance: 15,
        orbitSpeed: 0.015,
        rotationSpeed: -0.002, // Retrograde rotation
        color: 0xe6c87a,
        emissive: 0x332200,
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
        emissive: 0x112244,
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
        emissive: 0x331100,
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
        emissive: 0x332211,
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
        emissive: 0x222211,
        hasRings: true,
        ringInnerRadius: 3,
        ringOuterRadius: 5,
        distanceFromSun: '1.4 billion km',
        orbitalPeriod: '29.4 Earth years',
        fact: 'Saturn\'s rings are made mostly of ice particles with some rocky debris. The rings span up to 282,000 km but are only about 10 meters thick.'
    },
    uranus: {
        name: 'Uranus',
        radius: 1.8,
        distance: 55,
        orbitSpeed: 0.0004,
        rotationSpeed: -0.03, // Retrograde rotation
        color: 0xc9e9f0,
        emissive: 0x112233,
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
        emissive: 0x111144,
        distanceFromSun: '4.5 billion km',
        orbitalPeriod: '165 Earth years',
        fact: 'Neptune has the strongest winds in the solar system, with speeds reaching up to 2,100 km/h (1,300 mph).'
    }
};

// ============================================
// Global Variables
// ============================================

let scene, camera, renderer, controls;
let sun, planets = {}, orbitLines = [];
let raycaster, mouse;
let isPlaying = true;
let timeSpeed = 1;
let selectedPlanet = null;
let clock = new THREE.Clock();

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
    scene.background = new THREE.Color(0x000510);

    // Camera
    camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(50, 40, 80);

    // Renderer
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 20;
    controls.maxDistance = 150;
    controls.enablePan = false;

    // Raycaster for interaction
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Create scene elements
    createStarfield();
    createLighting();
    createSun();
    createPlanets();
    createOrbitLines();

    // Event listeners
    setupEventListeners();

    // Hide loading screen
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
    }, 1000);

    // Start animation
    animate();
}

// ============================================
// Starfield
// ============================================

function createStarfield() {
    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 5000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
        const i3 = i * 3;
        // Distribute stars in a sphere
        const radius = 300 + Math.random() * 200;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi);

        // Slight color variation
        const brightness = 0.5 + Math.random() * 0.5;
        colors[i3] = brightness;
        colors[i3 + 1] = brightness;
        colors[i3 + 2] = brightness + Math.random() * 0.2;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starsMaterial = new THREE.PointsMaterial({
        size: 0.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
    });

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
}

// ============================================
// Lighting
// ============================================

function createLighting() {
    // Ambient light for base visibility
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);

    // Point light at sun position
    const sunLight = new THREE.PointLight(0xffffff, 2, 200);
    sunLight.position.set(0, 0, 0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);
}

// ============================================
// Sun
// ============================================

function createSun() {
    // Sun geometry and material
    const sunGeometry = new THREE.SphereGeometry(5, 64, 64);
    const sunMaterial = new THREE.MeshBasicMaterial({
        color: 0xffdd00,
        emissive: 0xffaa00,
        emissiveIntensity: 1
    });
    sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // Sun glow effect using sprite
    const glowTexture = createGlowTexture();
    const glowMaterial = new THREE.SpriteMaterial({
        map: glowTexture,
        color: 0xffaa33,
        transparent: true,
        blending: THREE.AdditiveBlending,
        opacity: 0.6
    });
    const sunGlow = new THREE.Sprite(glowMaterial);
    sunGlow.scale.set(25, 25, 1);
    sun.add(sunGlow);

    // Secondary smaller glow
    const innerGlowMaterial = new THREE.SpriteMaterial({
        map: glowTexture,
        color: 0xffdd66,
        transparent: true,
        blending: THREE.AdditiveBlending,
        opacity: 0.4
    });
    const innerGlow = new THREE.Sprite(innerGlowMaterial);
    innerGlow.scale.set(15, 15, 1);
    sun.add(innerGlow);
}

// Create glow texture programmatically
function createGlowTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 220, 100, 0.8)');
    gradient.addColorStop(0.5, 'rgba(255, 150, 50, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 100, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
}

// ============================================
// Planets
// ============================================

function createPlanets() {
    Object.keys(planetData).forEach((key) => {
        const data = planetData[key];
        
        // Planet group (for orbit)
        const planetGroup = new THREE.Group();
        scene.add(planetGroup);

        // Planet mesh
        const geometry = new THREE.SphereGeometry(data.radius, 32, 32);
        const material = new THREE.MeshStandardMaterial({
            color: data.color,
            emissive: data.emissive,
            emissiveIntensity: 0.2,
            roughness: 0.8,
            metalness: 0.2
        });
        const planet = new THREE.Mesh(geometry, material);
        planet.castShadow = true;
        planet.receiveShadow = true;
        planet.position.x = data.distance;
        planet.userData = { name: key, ...data };
        planetGroup.add(planet);

        // Saturn's rings
        if (data.hasRings) {
            const ringGeometry = new THREE.RingGeometry(
                data.ringInnerRadius,
                data.ringOuterRadius,
                64
            );
            const ringMaterial = new THREE.MeshBasicMaterial({
                color: 0xc8b89a,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.7
            });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = Math.PI / 2;
            ring.position.copy(planet.position);
            planetGroup.add(ring);
            planet.userData.ring = ring;
        }

        // Store reference
        planets[key] = {
            mesh: planet,
            group: planetGroup,
            data: data,
            angle: Math.random() * Math.PI * 2 // Random starting position
        };
    });
}

// ============================================
// Orbit Lines
// ============================================

function createOrbitLines() {
    Object.keys(planetData).forEach((key) => {
        const data = planetData[key];
        const segments = 128;
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
        const material = new THREE.LineBasicMaterial({
            color: 0x444466,
            transparent: true,
            opacity: 0.3
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

    const delta = clock.getDelta();

    if (isPlaying) {
        // Rotate sun
        sun.rotation.y += 0.002 * timeSpeed;

        // Orbit and rotate planets
        Object.keys(planets).forEach((key) => {
            const planet = planets[key];
            
            // Update orbit angle
            planet.angle += planet.data.orbitSpeed * timeSpeed;
            
            // Calculate new position
            const x = Math.cos(planet.angle) * planet.data.distance;
            const z = Math.sin(planet.angle) * planet.data.distance;
            
            planet.mesh.position.x = x;
            planet.mesh.position.z = z;
            
            // Update ring position if exists
            if (planet.mesh.userData.ring) {
                planet.mesh.userData.ring.position.x = x;
                planet.mesh.userData.ring.position.z = z;
            }
            
            // Axial rotation
            planet.mesh.rotation.y += planet.data.rotationSpeed * timeSpeed;
        });
    }

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);
}

// ============================================
// Event Handlers
// ============================================

function setupEventListeners() {
    // Window resize
    window.addEventListener('resize', onWindowResize);

    // Mouse move for hover
    window.addEventListener('mousemove', onMouseMove);

    // Click for selection
    window.addEventListener('click', onMouseClick);

    // Play/Pause button
    playPauseBtn.addEventListener('click', togglePlayPause);

    // Speed slider
    speedSlider.addEventListener('input', updateSpeed);

    // Close panel
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

    // Raycast
    raycaster.setFromCamera(mouse, camera);
    const planetMeshes = Object.values(planets).map(p => p.mesh);
    const intersects = raycaster.intersectObjects(planetMeshes);

    if (intersects.length > 0) {
        document.body.classList.add('hovering-planet');
        // Highlight effect
        const hoveredPlanet = intersects[0].object;
        planetMeshes.forEach(mesh => {
            mesh.material.emissiveIntensity = mesh === hoveredPlanet ? 0.5 : 0.2;
        });
    } else {
        document.body.classList.remove('hovering-planet');
        planetMeshes.forEach(mesh => {
            mesh.material.emissiveIntensity = 0.2;
        });
    }
}

function onMouseClick(event) {
    // Prevent click when interacting with UI
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

    // Update info panel
    document.getElementById('planet-name').textContent = data.name;
    document.getElementById('planet-distance').textContent = data.distanceFromSun;
    document.getElementById('planet-period').textContent = data.orbitalPeriod;
    document.getElementById('planet-fact').textContent = data.fact;

    // Show panel
    infoPanel.classList.remove('hidden');

    // Smooth camera focus
    focusOnPlanet(planetMesh);
}

function focusOnPlanet(planetMesh) {
    const targetPosition = new THREE.Vector3();
    planetMesh.getWorldPosition(targetPosition);

    // Calculate camera offset based on planet size
    const offset = planetMesh.userData.radius * 8 + 10;
    const cameraTarget = new THREE.Vector3(
        targetPosition.x + offset * 0.5,
        targetPosition.y + offset * 0.5,
        targetPosition.z + offset
    );

    // Animate camera
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
        
        // Easing function
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
