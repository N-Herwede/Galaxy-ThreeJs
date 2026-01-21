/**
 * COSMOS EXPLORER - Ultimate Solar System
 * FWD-style shaders for Sun + multi-layer planet textures
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const PLANETS = {
    sun: { name: 'THE SUN', type: 'G-TYPE MAIN SEQUENCE STAR', radius: 5, distance: 0, orbitSpeed: 0, rotationSpeed: 0.001, colors: [0xffdd44, 0xff8800, 0xff4400], diameter: '1,392,700 km', distanceFromSun: 'Center', period: 'N/A', temp: '5,500°C', moons: '8 Planets', gravity: '274 m/s²', fact: 'The Sun contains 99.86% of all mass in our solar system.' },
    mercury: { name: 'MERCURY', type: 'TERRESTRIAL', radius: 0.38, distance: 10, orbitSpeed: 0.047, rotationSpeed: 0.005, colors: [0x9a8a7a, 0x7a6a5a, 0x5a4a3a], diameter: '4,879 km', distanceFromSun: '57.9M km', period: '88 Days', temp: '-180 to 430°C', moons: '0', gravity: '3.7 m/s²', fact: 'Mercury has extreme temperature swings of over 600°C.' },
    venus: { name: 'VENUS', type: 'TERRESTRIAL', radius: 0.95, distance: 14, orbitSpeed: 0.035, rotationSpeed: -0.002, colors: [0xe8c080, 0xd4a060, 0xc08040], diameter: '12,104 km', distanceFromSun: '108.2M km', period: '225 Days', temp: '465°C', moons: '0', gravity: '8.87 m/s²', fact: 'A day on Venus is longer than its year.' },
    earth: { name: 'EARTH', type: 'TERRESTRIAL', radius: 1.0, distance: 18, orbitSpeed: 0.029, rotationSpeed: 0.01, colors: [0x2255aa, 0x228844, 0x44aa55], hasMoon: true, diameter: '12,742 km', distanceFromSun: '149.6M km', period: '365.25 Days', temp: '-88 to 58°C', moons: '1', gravity: '9.81 m/s²', fact: 'Earth is the only planet known to harbor life.' },
    mars: { name: 'MARS', type: 'TERRESTRIAL', radius: 0.53, distance: 24, orbitSpeed: 0.024, rotationSpeed: 0.009, colors: [0xcc6644, 0xaa4422, 0x882211], diameter: '6,779 km', distanceFromSun: '227.9M km', period: '687 Days', temp: '-87 to -5°C', moons: '2', gravity: '3.71 m/s²', fact: 'Mars has the largest volcano in the solar system.' },
    jupiter: { name: 'JUPITER', type: 'GAS GIANT', radius: 2.5, distance: 42, orbitSpeed: 0.013, rotationSpeed: 0.04, colors: [0xd4a574, 0xc49464, 0xa47444], diameter: '139,820 km', distanceFromSun: '778.5M km', period: '11.9 Years', temp: '-110°C', moons: '95', gravity: '24.79 m/s²', fact: "Jupiter's Great Red Spot has raged for over 400 years." },
    saturn: { name: 'SATURN', type: 'GAS GIANT', radius: 2.1, distance: 58, orbitSpeed: 0.009, rotationSpeed: 0.035, colors: [0xead6a6, 0xd4c090, 0xc4b080], hasRings: true, diameter: '116,460 km', distanceFromSun: '1.4B km', period: '29.4 Years', temp: '-140°C', moons: '146', gravity: '10.44 m/s²', fact: "Saturn's rings are only about 10 meters thick." },
    uranus: { name: 'URANUS', type: 'ICE GIANT', radius: 1.5, distance: 74, orbitSpeed: 0.006, rotationSpeed: -0.02, colors: [0x88ccdd, 0x77bbcc, 0x66aabb], diameter: '50,724 km', distanceFromSun: '2.9B km', period: '84 Years', temp: '-224°C', moons: '28', gravity: '8.69 m/s²', fact: 'Uranus rotates on its side with a 98° tilt.' },
    neptune: { name: 'NEPTUNE', type: 'ICE GIANT', radius: 1.45, distance: 90, orbitSpeed: 0.005, rotationSpeed: 0.02, colors: [0x4477dd, 0x3366cc, 0x2255bb], diameter: '49,244 km', distanceFromSun: '4.5B km', period: '165 Years', temp: '-214°C', moons: '16', gravity: '11.15 m/s²', fact: 'Neptune has the strongest winds at 2,100 km/h.' }
};

// SIMPLEX 4D NOISE
const simplex4D = `
vec4 mod289(vec4 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
float mod289(float x){ return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 permute(vec4 x){ return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
vec4 grad4(float j, vec4 ip) {
    const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
    vec4 p, s;
    p.xyz = floor(fract(vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
    p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
    s = vec4(lessThan(p, vec4(0.0)));
    p.xyz = p.xyz + (s.xyz * 2.0 - 1.0) * s.www;
    return p;
}
float snoise(vec4 v) {
    const vec4 C = vec4(0.138196601125011, 0.276393202250021, 0.414589803375032, -0.447213595499958);
    vec4 i = floor(v + dot(v, vec4(0.309016994374947451)));
    vec4 x0 = v - i + dot(i, C.xxxx);
    vec4 i0; vec3 isX = step(x0.yzw, x0.xxx); vec3 isYZ = step(x0.zww, x0.yyz);
    i0.x = isX.x + isX.y + isX.z; i0.yzw = 1.0 - isX;
    i0.y += isYZ.x + isYZ.y; i0.zw += 1.0 - isYZ.xy; i0.z += isYZ.z; i0.w += 1.0 - isYZ.z;
    vec4 i3 = clamp(i0, 0.0, 1.0); vec4 i2 = clamp(i0-1.0, 0.0, 1.0); vec4 i1 = clamp(i0-2.0, 0.0, 1.0);
    vec4 x1 = x0 - i1 + C.xxxx; vec4 x2 = x0 - i2 + C.yyyy; vec4 x3 = x0 - i3 + C.zzzz; vec4 x4 = x0 + C.wwww;
    i = mod289(i);
    float j0 = permute(permute(permute(permute(i.w) + i.z) + i.y) + i.x);
    vec4 j1 = permute(permute(permute(permute(i.w + vec4(i1.w, i2.w, i3.w, 1.0)) + i.z + vec4(i1.z, i2.z, i3.z, 1.0)) + i.y + vec4(i1.y, i2.y, i3.y, 1.0)) + i.x + vec4(i1.x, i2.x, i3.x, 1.0));
    vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0);
    vec4 p0 = grad4(j0, ip); vec4 p1 = grad4(j1.x, ip); vec4 p2 = grad4(j1.y, ip); vec4 p3 = grad4(j1.z, ip); vec4 p4 = grad4(j1.w, ip);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w; p4 *= taylorInvSqrt(dot(p4, p4));
    vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
    vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)), 0.0);
    m0 = m0 * m0; m1 = m1 * m1;
    return 49.0 * (dot(m0*m0, vec3(dot(p0, x0), dot(p1, x1), dot(p2, x2))) + dot(m1*m1, vec2(dot(p3, x3), dot(p4, x4))));
}`;

// PERLIN CUBEMAP SHADER
const perlinVS = `varying vec3 vWorld; void main() { vec4 world = modelMatrix * vec4(position, 1.0); vWorld = world.xyz; gl_Position = projectionMatrix * viewMatrix * world; }`;
const perlinFS = `precision highp float; ${simplex4D} varying vec3 vWorld; uniform float uTime; uniform float uFreq; uniform float uContrast;
vec2 fbm(vec4 p){ float a=1.0, f=1.0; vec2 sum=vec2(0.0); for(int i=0;i<5;i++){ sum.x+=snoise(p*f)*a; p.w+=100.0; sum.y+=snoise(p*f)*a; a*=0.6; f*=2.0; } return sum; }
void main(){ vec3 w=normalize(vWorld)+12.45; vec4 p=vec4(w*uFreq,uTime*0.1); vec2 f=fbm(p)*uContrast+0.5; gl_FragColor=vec4(f.x,f.y,f.y,f.x); }`;

// SUN SPHERE SHADER (FWD style)
const sunSphereVS = `varying vec3 vWorld, vNormalView, vNormalWorld, vLayer0, vLayer1, vLayer2; uniform float uTime;
mat2 rot(float a){ float s=sin(a),c=cos(a); return mat2(c,-s,s,c); }
void main(){ vec4 world=modelMatrix*vec4(position,1.0); vWorld=world.xyz; vNormalView=normalize(normalMatrix*normal); vNormalWorld=normalize((modelMatrix*vec4(normal,0.0)).xyz);
float t=uTime; vec3 p=normalize(normal); vec3 p1=p; p1.yz=rot(t)*p1.yz; vLayer0=p1; p1=p; p1.zx=rot(t+2.094)*p1.zx; vLayer1=p1; p1=p; p1.xy=rot(t-4.188)*p1.xy; vLayer2=p1;
gl_Position=projectionMatrix*viewMatrix*world; }`;

const sunSphereFS = `precision highp float; varying vec3 vWorld,vNormalView,vNormalWorld,vLayer0,vLayer1,vLayer2; uniform samplerCube uPerlinCube; uniform float uBrightness,uTint,uBase,uOffset,uFresnelPow,uFresnelInf;
vec3 b2c(float b){ b*=uTint; return (vec3(b,b*b,b*b*b*b)/uTint)*uBrightness; }
float ocean(){ return (textureCube(uPerlinCube,vLayer0).r+textureCube(uPerlinCube,vLayer1).r+textureCube(uPerlinCube,vLayer2).r)*0.333; }
void main(){ vec3 vd=normalize(cameraPosition-vWorld); float ndv=dot(vNormalWorld,vd); float fresnel=pow(1.0-clamp(ndv,0.0,1.0),uFresnelPow)*uFresnelInf;
float bright=ocean()*uBase+uOffset+fresnel; gl_FragColor=vec4(clamp(b2c(bright),0.0,1.0),1.0); }`;

// PLANET SHADER (multi-layer)
const planetVS = `varying vec3 vNormal,vWorldPos,vLocalPos,vLayer0,vLayer1,vLayer2; varying vec2 vUv; uniform float uRotation;
mat2 rot(float a){ float s=sin(a),c=cos(a); return mat2(c,-s,s,c); }
void main(){ vUv=uv; vNormal=normalize(normalMatrix*normal); vLocalPos=position; vWorldPos=(modelMatrix*vec4(position,1.0)).xyz;
vec3 d=normalize(position); vec3 p1=d; p1.xz=rot(uRotation)*p1.xz; vLayer0=p1; p1=d; p1.xy=rot(uRotation*0.7+1.0)*p1.xy; vLayer1=p1; p1=d; p1.yz=rot(uRotation*0.5-0.5)*p1.yz; vLayer2=p1;
gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`;

const planetFS = `precision highp float; ${simplex4D} varying vec3 vNormal,vWorldPos,vLocalPos,vLayer0,vLayer1,vLayer2; varying vec2 vUv;
uniform vec3 uColor1,uColor2,uColor3,uSunPos; uniform float uTime,uAtmo,uDetail; uniform int uType; uniform samplerCube uNoiseCube;
float fbm3(vec3 p,int o){ float s=0.0,a=0.5; for(int i=0;i<6;i++){ if(i>=o)break; s+=a*snoise(vec4(p,0.0)); p*=2.0; a*=0.5; } return s; }
void main(){ vec3 ld=normalize(uSunPos-vWorldPos); float nl=max(dot(vNormal,ld),0.0); float light=0.06+nl*0.94;
float n0=textureCube(uNoiseCube,vLayer0).r, n1=textureCube(uNoiseCube,vLayer1).g, n2=textureCube(uNoiseCube,vLayer2).r;
int det=int(uDetail); vec3 col;
if(uType==0){ float t=n0*0.5+n1*0.3+n2*0.2; col=mix(uColor1,uColor2,t); float cr=fbm3(vLocalPos*12.0,det); col=mix(col,uColor3,smoothstep(0.2,0.5,cr)*0.6); }
else if(uType==1){ float sw=n0*0.4+fbm3(vLayer0*3.0+uTime*0.01,det)*0.6; float bands=sin(vUv.y*20.0+sw*5.0)*0.5+0.5; col=mix(uColor1,uColor2,bands*0.6+n1*0.4); col=mix(col,uColor3,fbm3(vLayer1*5.0-uTime*0.02,det)*0.4); }
else if(uType==2){ float cont=fbm3(vLocalPos*2.0,det); float land=smoothstep(-0.1,0.15,cont); vec3 oc=uColor1*(0.7+n0*0.3); vec3 ln=mix(uColor2,uColor3,fbm3(vLocalPos*8.0,3)*0.5+0.5); col=mix(oc,ln,land); float lat=abs(vUv.y-0.5)*2.0; col=mix(col,vec3(0.95,0.97,1.0),smoothstep(0.7,0.95,lat)); float cl=fbm3(vLayer0*4.0+uTime*0.015,4); col=mix(col,vec3(1.0),smoothstep(0.1,0.5,cl)*0.35); }
else if(uType==3){ float t=n0*0.4+n1*0.3+n2*0.3; col=mix(uColor1,uColor2,t); float dk=fbm3(vLocalPos*3.0,det); col=mix(col,uColor3,smoothstep(0.2,0.6,dk)*0.5); float lat=abs(vUv.y-0.5)*2.0; col=mix(col,vec3(1.0,0.98,0.95),smoothstep(0.85,0.98,lat)); }
else if(uType==4){ float bn=n0*0.3+fbm3(vLocalPos*vec3(1.0,0.15,1.0)*2.0,det)*0.7; float bands=sin(vUv.y*35.0+bn*6.0)*0.5+0.5; col=mix(uColor1,uColor2,bands); col=mix(col,uColor3,fbm3(vLayer0*4.0+uTime*0.008,det)*0.25); vec2 sc=vec2(0.65,0.58); float sd=length((vUv-sc)*vec2(2.5,4.0)); col=mix(col,vec3(0.9,0.45,0.35),(1.0-smoothstep(0.03,0.1,sd))*0.85); }
else if(uType==5){ float bn=n0*0.2+fbm3(vLocalPos*vec3(1.0,0.2,1.0),det)*0.8; float bands=sin(vUv.y*25.0+bn*3.0)*0.5+0.5; col=mix(uColor1,uColor2,bands*0.5+0.25); col=mix(col,uColor3,fbm3(vLayer1*3.0,3)*0.15); }
else if(uType==6){ float f=n0*0.3+n1*0.3+0.4; col=mix(uColor1,uColor2,f); col=mix(col,uColor3,fbm3(vLayer0*2.0+uTime*0.003,3)*0.2); }
else if(uType==7){ float st=n0*0.35+fbm3(vLayer0*3.0+uTime*0.01,det)*0.65; col=mix(uColor1,uColor2,st*0.5+0.25); float br=fbm3(vLocalPos*6.0+uTime*0.015,det); col=mix(col,uColor3,smoothstep(0.3,0.7,br)*0.4); }
else{ col=uColor1; }
col*=light;
if(uAtmo>0.0){ vec3 vd=normalize(cameraPosition-vWorldPos); float fr=pow(1.0-max(dot(vNormal,vd),0.0),3.0); col=mix(col,mix(uColor2,vec3(0.6,0.8,1.0),0.3)*1.2,fr*uAtmo*0.5); }
gl_FragColor=vec4(col,1.0); }`;

// GLOW SHADER
const glowVS = `varying vec3 vNormal,vWorldPos; void main(){ vNormal=normalize(normalMatrix*normal); vWorldPos=(modelMatrix*vec4(position,1.0)).xyz; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`;
const glowFS = `precision highp float; uniform vec3 uColor; uniform float uInt,uFall; varying vec3 vNormal,vWorldPos;
void main(){ vec3 vd=normalize(cameraPosition-vWorldPos); float rim=1.0-max(dot(vNormal,vd),0.0); float i=pow(rim,uFall)*uInt; gl_FragColor=vec4(uColor*i,i); }`;

// GLOBALS
let scene, camera, renderer, controls, clock = new THREE.Clock();
let planets = {}, labels = {}, orbits = [], asteroids;
let raycaster, mouse;
let perlinCubeRT, perlinCubeCam, perlinScene, perlinMat;
let time = 0;

const settings = { sunBrightness: 0.7, sunCorona: 1.0, sunSpeed: 1.0, planetDetail: 3, planetAtmo: 1.0, galaxyBrightness: 1.0, starDensity: 1.0, camAutoRotate: false, camRotSpeed: 0.5, showAsteroids: true };
const state = { playing: true, speed: 1, showOrbits: true, showLabels: true, soundEnabled: false, selectedPlanet: null, followTarget: null, cinematic: false };

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000008);
    camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 5000);
    camera.position.set(50, 35, 70);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    document.getElementById('canvas-container').appendChild(renderer.domElement);
    
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 8;
    controls.maxDistance = 500;
    controls.maxPolarAngle = Math.PI * 0.9;
    controls.target.set(0, 0, 0);
    
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    
    buildScene();
    setupEvents();
    setupSettings();
    animate();
}

function buildScene() {
    updateLoad('Stars...', 10); createStars();
    updateLoad('Galaxy...', 25); createGalaxy();
    updateLoad('Lights...', 35); scene.add(new THREE.AmbientLight(0x111118, 0.1)); scene.add(new THREE.PointLight(0xffffee, 2.5, 500, 1.5));
    updateLoad('Noise map...', 45); createPerlinCube();
    updateLoad('Sun...', 60); createSun();
    updateLoad('Planets...', 75); createPlanets();
    updateLoad('Asteroids...', 88); createAsteroids();
    updateLoad('Orbits...', 95); createOrbits();
    updateLoad('Ready!', 100);
    setTimeout(() => document.getElementById('loading').classList.add('hidden'), 500);
}

function updateLoad(s, p) { const el = document.getElementById('load-status'), pr = document.getElementById('load-progress'); if (el) el.textContent = s; if (pr) pr.style.width = p + '%'; }

function createStars() {
    [[25000, 0.3, 600, 2000], [8000, 0.6, 400, 1000], [2000, 1.2, 250, 600]].forEach(([c, sz, mn, mx]) => {
        const g = new THREE.BufferGeometry(), pos = new Float32Array(c * 3), col = new Float32Array(c * 3);
        for (let i = 0; i < c; i++) {
            const i3 = i * 3, r = mn + Math.random() * (mx - mn), th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
            pos[i3] = r * Math.sin(ph) * Math.cos(th); pos[i3 + 1] = r * Math.sin(ph) * Math.sin(th); pos[i3 + 2] = r * Math.cos(ph);
            const t = Math.random(); col[i3] = t > 0.85 ? 1.0 : (t > 0.7 ? 0.7 : 1.0); col[i3+1] = t > 0.85 ? 0.7 : (t > 0.7 ? 0.85 : 1.0); col[i3+2] = t > 0.85 ? 0.5 : (t > 0.7 ? 1.0 : 1.0);
        }
        g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        g.setAttribute('color', new THREE.BufferAttribute(col, 3));
        scene.add(new THREE.Points(g, new THREE.PointsMaterial({ size: sz, vertexColors: true, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false })));
    });
}

function createGalaxy() {
    const count = 120000, arms = 2, radius = 1000;
    const g = new THREE.BufferGeometry(), pos = new Float32Array(count * 3), col = new Float32Array(count * 3);
    const core = new THREE.Color(0xfff8e8), inner = new THREE.Color(0xffcc88), mid = new THREE.Color(0x8899ff), outer = new THREE.Color(0x4455aa);
    
    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const t = Math.pow(Math.random(), 0.6), r = t * radius;
        const armIdx = Math.floor(Math.random() * arms);
        const armOff = (armIdx / arms) * Math.PI * 2;
        const spiral = armOff + Math.log(r / 10 + 1) * 2;
        const spread = (Math.random() - 0.5) * 0.4 * r * 0.3;
        const spreadAng = spiral + Math.PI / 2;
        const scatter = Math.pow(Math.random(), 2) * r * 0.1;
        
        pos[i3] = Math.cos(spiral) * r + Math.cos(spreadAng) * spread + (Math.random() - 0.5) * scatter;
        pos[i3 + 1] = (Math.random() - 0.5) * 15 * Math.exp(-r / (radius * 0.3)) - 500;
        pos[i3 + 2] = Math.sin(spiral) * r + Math.sin(spreadAng) * spread + (Math.random() - 0.5) * scatter - 800;
        
        let c; if (t < 0.05) c = core.clone(); else if (t < 0.2) c = core.clone().lerp(inner, (t - 0.05) / 0.15); else if (t < 0.5) c = inner.clone().lerp(mid, (t - 0.2) / 0.3); else c = mid.clone().lerp(outer, (t - 0.5) / 0.5);
        const b = (0.4 + Math.random() * 0.6) * settings.galaxyBrightness;
        col[i3] = c.r * b; col[i3+1] = c.g * b; col[i3+2] = c.b * b;
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const galaxy = new THREE.Points(g, new THREE.PointsMaterial({ size: 1.5, vertexColors: true, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false }));
    galaxy.rotation.x = Math.PI * 0.15;
    scene.add(galaxy);
    scene.userData.galaxy = galaxy;
}

function createPerlinCube() {
    perlinScene = new THREE.Scene();
    perlinCubeRT = new THREE.WebGLCubeRenderTarget(512, { format: THREE.RGBAFormat, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter });
    perlinCubeCam = new THREE.CubeCamera(0.1, 10, perlinCubeRT);
    perlinMat = new THREE.ShaderMaterial({ vertexShader: perlinVS, fragmentShader: perlinFS, side: THREE.BackSide, uniforms: { uTime: { value: 0 }, uFreq: { value: 6.0 }, uContrast: { value: 0.35 } } });
    perlinScene.add(new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), perlinMat));
}

function renderPerlin() { if (!perlinCubeCam) return; perlinMat.uniforms.uTime.value = time * settings.sunSpeed * 0.1; perlinCubeCam.update(renderer, perlinScene); }

function createSun() {
    const d = PLANETS.sun, grp = new THREE.Group();
    grp.userData = { name: 'sun', data: d };
    const mat = new THREE.ShaderMaterial({ vertexShader: sunSphereVS, fragmentShader: sunSphereFS, uniforms: { uTime: { value: 0 }, uPerlinCube: { value: perlinCubeRT.texture }, uBrightness: { value: settings.sunBrightness }, uTint: { value: 0.22 }, uBase: { value: 3.5 }, uOffset: { value: 0.8 }, uFresnelPow: { value: 2.0 }, uFresnelInf: { value: 0.5 } } });
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(d.radius, 64, 64), mat);
    mesh.userData = { name: 'sun', data: d, clickable: true };
    grp.add(mesh);
    [[1.15, 0xffdd66, 0.5, 2.5], [1.35, 0xffaa44, 0.35, 3.0], [1.6, 0xff8833, 0.2, 3.5], [2.0, 0xff6622, 0.1, 4.0]].forEach(([s, c, i, f]) => {
        const gm = new THREE.ShaderMaterial({ vertexShader: glowVS, fragmentShader: glowFS, uniforms: { uColor: { value: new THREE.Color(c) }, uInt: { value: i }, uFall: { value: f } }, side: THREE.BackSide, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
        grp.add(new THREE.Mesh(new THREE.SphereGeometry(d.radius * s * settings.sunCorona, 32, 32), gm));
    });
    scene.add(grp);
    planets.sun = { mesh, group: grp, data: d, material: mat };
    createLabel('sun', d);
}

function createPlanets() {
    const types = { mercury: 0, venus: 1, earth: 2, mars: 3, jupiter: 4, saturn: 5, uranus: 6, neptune: 7 };
    const atmos = { mercury: 0, venus: 0.7, earth: 0.5, mars: 0.15, jupiter: 0.25, saturn: 0.2, uranus: 0.5, neptune: 0.5 };
    
    Object.entries(PLANETS).forEach(([key, d]) => {
        if (key === 'sun') return;
        const grp = new THREE.Group();
        grp.userData = { name: key, data: d };
        const mat = new THREE.ShaderMaterial({ vertexShader: planetVS, fragmentShader: planetFS, uniforms: { uColor1: { value: new THREE.Color(d.colors[0]) }, uColor2: { value: new THREE.Color(d.colors[1]) }, uColor3: { value: new THREE.Color(d.colors[2]) }, uSunPos: { value: new THREE.Vector3(0,0,0) }, uTime: { value: 0 }, uRotation: { value: 0 }, uType: { value: types[key] }, uAtmo: { value: atmos[key] * settings.planetAtmo }, uDetail: { value: settings.planetDetail }, uNoiseCube: { value: perlinCubeRT.texture } } });
        const mesh = new THREE.Mesh(new THREE.SphereGeometry(d.radius, 64, 64), mat);
        mesh.position.x = d.distance;
        mesh.userData = { name: key, data: d, clickable: true };
        grp.add(mesh);
        
        if (atmos[key] > 0) {
            const am = new THREE.MeshBasicMaterial({ color: d.colors[1], transparent: true, opacity: atmos[key] * 0.12, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false });
            const atmo = new THREE.Mesh(new THREE.SphereGeometry(d.radius * 1.06, 32, 32), am);
            atmo.position.copy(mesh.position);
            grp.add(atmo);
            mesh.userData.atmo = atmo;
        }
        if (d.hasMoon) { const moon = new THREE.Mesh(new THREE.SphereGeometry(0.27, 32, 32), new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.9 })); moon.position.set(2.5, 0, 0); mesh.add(moon); mesh.userData.moon = moon; }
        if (d.hasRings) {
            const rg = new THREE.RingGeometry(d.radius * 1.3, d.radius * 2.4, 128);
            const rt = createRingTex();
            const rm = new THREE.MeshBasicMaterial({ map: rt, side: THREE.DoubleSide, transparent: true, opacity: 0.9, depthWrite: false });
            const ring = new THREE.Mesh(rg, rm);
            ring.rotation.x = Math.PI / 2 * 0.92;
            ring.position.copy(mesh.position);
            grp.add(ring);
            mesh.userData.ring = ring;
        }
        scene.add(grp);
        planets[key] = { mesh, group: grp, data: d, material: mat, angle: Math.random() * Math.PI * 2, rotation: 0 };
        createLabel(key, d);
    });
}

function createRingTex() {
    const cv = document.createElement('canvas'); cv.width = 2048; cv.height = 64;
    const ctx = cv.getContext('2d');
    [[0, 0.05, 0.1, [120,100,80]], [0.08, 0.15, 0.4, [180,160,140]], [0.15, 0.35, 0.85, [220,200,175]], [0.35, 0.42, 0.05, [50,45,40]], [0.42, 0.75, 0.7, [200,180,160]], [0.75, 0.78, 0.15, [100,90,80]], [0.78, 0.88, 0.5, [180,160,140]], [0.88, 0.92, 0.2, [140,125,110]], [0.92, 1, 0.08, [100,90,80]]].forEach(([s, e, o, c]) => {
        const gr = ctx.createLinearGradient(s * 2048, 0, e * 2048, 0);
        gr.addColorStop(0, `rgba(${c[0]},${c[1]},${c[2]},${o * 0.8})`);
        gr.addColorStop(0.5, `rgba(${c[0]},${c[1]},${c[2]},${o})`);
        gr.addColorStop(1, `rgba(${c[0]},${c[1]},${c[2]},${o * 0.8})`);
        ctx.fillStyle = gr;
        ctx.fillRect(s * 2048, 0, (e - s) * 2048, 64);
    });
    const tex = new THREE.CanvasTexture(cv);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    return tex;
}

function createAsteroids() {
    const count = 8000, inner = 28, outer = 36;
    const g = new THREE.BufferGeometry(), pos = new Float32Array(count * 3), col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const r = inner + Math.pow(Math.random(), 0.8) * (outer - inner);
        const a = Math.random() * Math.PI * 2;
        pos[i3] = Math.cos(a) * r * (0.95 + Math.random() * 0.1);
        pos[i3 + 1] = (Math.random() - 0.5) * 1.5;
        pos[i3 + 2] = Math.sin(a) * r;
        const b = 0.3 + Math.random() * 0.4;
        col[i3] = b * (0.7 + Math.random() * 0.3); col[i3+1] = b * (0.6 + Math.random() * 0.3); col[i3+2] = b * (0.5 + Math.random() * 0.3);
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    asteroids = new THREE.Points(g, new THREE.PointsMaterial({ size: 0.15, vertexColors: true, transparent: true, opacity: 0.8, sizeAttenuation: true }));
    asteroids.visible = settings.showAsteroids;
    scene.add(asteroids);
}

function createOrbits() {
    Object.entries(PLANETS).forEach(([k, d]) => {
        if (k === 'sun' || !d.distance) return;
        const pts = [], cols = [];
        for (let i = 0; i <= 256; i++) {
            const a = (i / 256) * Math.PI * 2;
            pts.push(new THREE.Vector3(Math.cos(a) * d.distance, 0, Math.sin(a) * d.distance));
            const t = i / 256, b = 0.3 + Math.sin(t * Math.PI * 2) * 0.15;
            cols.push(0, b * 0.8, b);
        }
        const g = new THREE.BufferGeometry().setFromPoints(pts);
        g.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
        const orbit = new THREE.Line(g, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.25, blending: THREE.AdditiveBlending }));
        scene.add(orbit);
        orbits.push(orbit);
    });
}

function createLabel(key, d) { const div = document.createElement('div'); div.className = 'planet-label'; div.textContent = d.name; document.body.appendChild(div); labels[key] = div; }

function updateLabels() {
    if (!state.showLabels) { Object.values(labels).forEach(l => l.style.display = 'none'); return; }
    Object.entries(labels).forEach(([k, l]) => {
        const p = planets[k]; if (!p) return;
        const pos = new THREE.Vector3(); p.mesh.getWorldPosition(pos); pos.y += p.data.radius * 2;
        const scr = pos.clone().project(camera);
        if (scr.z > 1) l.style.display = 'none';
        else { l.style.display = 'block'; l.style.left = (scr.x * 0.5 + 0.5) * innerWidth + 'px'; l.style.top = (-scr.y * 0.5 + 0.5) * innerHeight + 'px'; }
    });
}

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    document.getElementById('fps').textContent = Math.min(Math.round(1 / Math.max(delta, 0.001)), 999);
    
    if (state.playing) {
        time += delta * state.speed;
        const m = Math.floor(time / 60) % 60, s = Math.floor(time) % 60;
        document.getElementById('time').textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        
        renderPerlin();
        if (planets.sun?.material) { planets.sun.material.uniforms.uTime.value = time * settings.sunSpeed * 0.04; planets.sun.material.uniforms.uBrightness.value = settings.sunBrightness; }
        
        Object.entries(planets).forEach(([k, p]) => {
            if (k === 'sun') return;
            p.angle += p.data.orbitSpeed * state.speed * delta * 10;
            const x = Math.cos(p.angle) * p.data.distance, z = Math.sin(p.angle) * p.data.distance;
            p.mesh.position.set(x, 0, z);
            p.rotation += p.data.rotationSpeed * state.speed * delta * 10;
            if (p.material) { p.material.uniforms.uTime.value = time; p.material.uniforms.uRotation.value = p.rotation; p.material.uniforms.uDetail.value = settings.planetDetail; }
            if (p.mesh.userData.atmo) p.mesh.userData.atmo.position.set(x, 0, z);
            if (p.mesh.userData.ring) { p.mesh.userData.ring.position.set(x, 0, z); p.mesh.userData.ring.rotation.z = time * 0.01; }
            if (p.mesh.userData.moon) { const ma = time * 0.5; p.mesh.userData.moon.position.set(Math.cos(ma) * 2.5, 0, Math.sin(ma) * 2.5); }
        });
        
        if (asteroids) asteroids.rotation.y += 0.0001 * state.speed;
        if (scene.userData.galaxy) scene.userData.galaxy.rotation.y += 0.00003 * state.speed;
    }
    
    if (state.followTarget && planets[state.followTarget]) { const tp = new THREE.Vector3(); planets[state.followTarget].mesh.getWorldPosition(tp); controls.target.lerp(tp, 0.05); }
    if (settings.camAutoRotate && !state.followTarget) { controls.autoRotate = true; controls.autoRotateSpeed = settings.camRotSpeed; } else { controls.autoRotate = false; }
    if (state.cinematic) { const t = time * 0.1, r = 80 + Math.sin(t * 0.2) * 30; camera.position.set(Math.cos(t) * r, 20 + Math.sin(t * 0.5) * 15, Math.sin(t) * r); controls.target.set(0, 0, 0); }
    
    updateLabels();
    controls.update();
    renderer.render(scene, camera);
}

function setupEvents() {
    addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); });
    addEventListener('mousemove', (e) => {
        mouse.x = (e.clientX / innerWidth) * 2 - 1; mouse.y = -(e.clientY / innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const hits = raycaster.intersectObjects(Object.values(planets).map(p => p.mesh));
        const tt = document.getElementById('tooltip');
        if (hits.length > 0 && hits[0].object.userData.clickable) { document.body.classList.add('clickable'); tt.classList.remove('hidden'); tt.textContent = hits[0].object.userData.data.name; tt.style.left = e.clientX + 'px'; tt.style.top = e.clientY + 'px'; }
        else { document.body.classList.remove('clickable'); tt.classList.add('hidden'); }
    });
    addEventListener('click', (e) => {
        if (e.target.closest('#controls,#planet-popup,#header,#settings-panel,#btn-settings')) return;
        raycaster.setFromCamera(mouse, camera);
        const hits = raycaster.intersectObjects(Object.values(planets).map(p => p.mesh));
        if (hits.length > 0 && hits[0].object.userData.clickable) { const n = hits[0].object.userData.name; if (PLANETS[n]) showPopup(n, PLANETS[n]); }
    });
    addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT') return;
        switch(e.key.toLowerCase()) {
            case ' ': e.preventDefault(); togglePlay(); break;
            case 'r': resetCamera(); break;
            case 'o': toggleOrbits(); break;
            case 'l': toggleLabels(); break;
            case 'm': toggleSound(); break;
            case 's': toggleSettings(); break;
            case 'escape': closePopup(); state.followTarget = null; state.cinematic = false; break;
            case '0': case '1': case '2': case '3': case '4': case '5': case '6': case '7': case '8':
                const names = ['sun','mercury','venus','earth','mars','jupiter','saturn','uranus','neptune'];
                if (PLANETS[names[parseInt(e.key)]]) showPopup(names[parseInt(e.key)], PLANETS[names[parseInt(e.key)]]);
                break;
        }
    });
    document.getElementById('btn-play').addEventListener('click', togglePlay);
    document.getElementById('btn-reset').addEventListener('click', resetCamera);
    document.getElementById('btn-orbits').addEventListener('click', toggleOrbits);
    document.getElementById('btn-labels').addEventListener('click', toggleLabels);
    document.getElementById('btn-sound').addEventListener('click', toggleSound);
    document.getElementById('speed').addEventListener('input', (e) => { state.speed = parseFloat(e.target.value); document.getElementById('speed-val').textContent = state.speed.toFixed(1) + 'x'; });
    document.getElementById('popup-close').addEventListener('click', closePopup);
    document.getElementById('popup-speak').addEventListener('click', speakInfo);
    document.getElementById('popup-focus').addEventListener('click', () => state.selectedPlanet && focusOn(state.selectedPlanet));
    document.getElementById('popup-follow').addEventListener('click', () => { if (state.selectedPlanet) { state.followTarget = state.selectedPlanet; closePopup(); } });
    document.getElementById('btn-settings').addEventListener('click', toggleSettings);
}

function setupSettings() {
    document.getElementById('settings-close').addEventListener('click', toggleSettings);
    const setupSlider = (id, key) => { const sl = document.getElementById(id), vl = document.getElementById(id + '-val'); if(sl) sl.addEventListener('input', (e) => { settings[key] = parseFloat(e.target.value); if(vl) vl.textContent = settings[key].toFixed(1); }); };
    setupSlider('sun-brightness', 'sunBrightness');
    setupSlider('sun-corona', 'sunCorona');
    setupSlider('sun-speed', 'sunSpeed');
    setupSlider('planet-detail', 'planetDetail');
    setupSlider('planet-atmo', 'planetAtmo');
    setupSlider('galaxy-brightness', 'galaxyBrightness');
    setupSlider('star-density', 'starDensity');
    setupSlider('cam-rotspeed', 'camRotSpeed');
    document.getElementById('cam-autorotate')?.addEventListener('change', (e) => { settings.camAutoRotate = e.target.checked; });
    document.getElementById('show-asteroids')?.addEventListener('change', (e) => { settings.showAsteroids = e.target.checked; if (asteroids) asteroids.visible = settings.showAsteroids; });
    document.getElementById('btn-top-view')?.addEventListener('click', () => { state.cinematic = false; animateCamera(new THREE.Vector3(0, 150, 0), new THREE.Vector3(0, 0, 0)); });
    document.getElementById('btn-side-view')?.addEventListener('click', () => { state.cinematic = false; animateCamera(new THREE.Vector3(150, 10, 0), new THREE.Vector3(0, 0, 0)); });
    document.getElementById('btn-cinematic')?.addEventListener('click', () => { state.cinematic = !state.cinematic; state.followTarget = null; });
}

function toggleSettings() { document.getElementById('settings-panel').classList.toggle('visible'); }
function showPopup(n, d) { state.selectedPlanet = n; document.getElementById('popup-name').textContent = d.name; document.getElementById('popup-type').textContent = d.type; document.getElementById('popup-diameter').textContent = d.diameter; document.getElementById('popup-distance').textContent = d.distanceFromSun; document.getElementById('popup-period').textContent = d.period; document.getElementById('popup-temp').textContent = d.temp; document.getElementById('popup-moons').textContent = d.moons; document.getElementById('popup-gravity').textContent = d.gravity; document.getElementById('popup-fact').textContent = d.fact; const c1 = d.colors[0].toString(16).padStart(6, '0'), c2 = d.colors[1].toString(16).padStart(6, '0'); document.getElementById('popup-visual').style.background = `linear-gradient(135deg, #${c1}, #${c2})`; document.getElementById('planet-popup').classList.remove('hidden'); if (state.soundEnabled) speakInfo(); }
function closePopup() { document.getElementById('planet-popup').classList.add('hidden'); if (speechSynthesis.speaking) speechSynthesis.cancel(); }
function speakInfo() { if (speechSynthesis.speaking) speechSynthesis.cancel(); if (!state.selectedPlanet || !PLANETS[state.selectedPlanet]) return; const d = PLANETS[state.selectedPlanet]; const txt = `${d.name}. ${d.type}. Diameter: ${d.diameter}. Distance: ${d.distanceFromSun}. Period: ${d.period}. Temperature: ${d.temp}. Moons: ${d.moons}. ${d.fact}`; const u = new SpeechSynthesisUtterance(txt); u.rate = 0.9; speechSynthesis.speak(u); document.getElementById('popup-speak').classList.add('active'); u.onend = () => document.getElementById('popup-speak').classList.remove('active'); }
function focusOn(n) { const p = planets[n]; if (!p) return; state.cinematic = false; const tp = new THREE.Vector3(); p.mesh.getWorldPosition(tp); const off = p.data.radius * 5 + 12; animateCamera(new THREE.Vector3(tp.x + off * 0.6, tp.y + off * 0.4, tp.z + off), tp); closePopup(); }
function animateCamera(tgt, look) { const sp = camera.position.clone(), st = controls.target.clone(), start = Date.now(), dur = 1500; (function upd() { const t = Math.min((Date.now() - start) / dur, 1), e = 1 - Math.pow(1 - t, 3); camera.position.lerpVectors(sp, tgt, e); controls.target.lerpVectors(st, look, e); controls.update(); if (t < 1) requestAnimationFrame(upd); })(); }
function togglePlay() { state.playing = !state.playing; document.getElementById('icon-pause').style.display = state.playing ? 'block' : 'none'; document.getElementById('icon-play').style.display = state.playing ? 'none' : 'block'; document.getElementById('btn-play').classList.toggle('active', state.playing); }
function resetCamera() { state.followTarget = null; state.cinematic = false; animateCamera(new THREE.Vector3(50, 35, 70), new THREE.Vector3(0, 0, 0)); }
function toggleOrbits() { state.showOrbits = !state.showOrbits; orbits.forEach(o => o.visible = state.showOrbits); document.getElementById('btn-orbits').classList.toggle('active', state.showOrbits); }
function toggleLabels() { state.showLabels = !state.showLabels; document.getElementById('btn-labels').classList.toggle('active', state.showLabels); }
function toggleSound() { state.soundEnabled = !state.soundEnabled; document.getElementById('btn-sound').classList.toggle('active', state.soundEnabled); if (!state.soundEnabled && speechSynthesis.speaking) speechSynthesis.cancel(); }

init();
