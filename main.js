// COSMOS EXPLORER - Professional Shader Solar System
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const PLANETS = {
    sun: { name: 'THE SUN', type: 'G-TYPE MAIN SEQUENCE STAR', radius: 5, distance: 0, orbitSpeed: 0, rotationSpeed: 0.0003, colors: [0xffaa00, 0xff6600, 0xff3300], planetType: -1, atmosphere: 0, diameter: '1,392,700 km', distanceFromSun: 'Center', period: 'N/A', temp: '5,500°C', moons: '8 Planets', gravity: '274 m/s²', fact: 'The Sun contains 99.86% of all mass in our solar system.' },
    mercury: { name: 'MERCURY', type: 'TERRESTRIAL', radius: 0.4, distance: 10, orbitSpeed: 0.04, rotationSpeed: 0.004, colors: [0x8c7853, 0x6b5a47, 0x544739], planetType: 0, atmosphere: 0, diameter: '4,879 km', distanceFromSun: '57.9M km', period: '88 Days', temp: '-180 to 430°C', moons: '0', gravity: '3.7 m/s²', fact: 'Mercury has the most extreme temperature variation.' },
    venus: { name: 'VENUS', type: 'TERRESTRIAL', radius: 0.9, distance: 14, orbitSpeed: 0.015, rotationSpeed: -0.002, colors: [0xe8c76a, 0xd4a84a, 0xc49632], planetType: 1, atmosphere: 0.7, diameter: '12,104 km', distanceFromSun: '108.2M km', period: '225 Days', temp: '465°C', moons: '0', gravity: '8.87 m/s²', fact: 'A day on Venus is longer than its year.' },
    earth: { name: 'EARTH', type: 'TERRESTRIAL', radius: 1.0, distance: 18, orbitSpeed: 0.01, rotationSpeed: 0.01, colors: [0x4a90d9, 0x2d6a27, 0x3d8b3d], planetType: 2, atmosphere: 0.5, hasMoon: true, diameter: '12,742 km', distanceFromSun: '149.6M km', period: '365.25 Days', temp: '-88 to 58°C', moons: '1', gravity: '9.81 m/s²', fact: 'Earth is the only planet known to harbor life.' },
    mars: { name: 'MARS', type: 'TERRESTRIAL', radius: 0.55, distance: 24, orbitSpeed: 0.008, rotationSpeed: 0.009, colors: [0xcd5c5c, 0xb84c4c, 0x8b3232], planetType: 3, atmosphere: 0.25, diameter: '6,779 km', distanceFromSun: '227.9M km', period: '687 Days', temp: '-87 to -5°C', moons: '2', gravity: '3.71 m/s²', fact: 'Mars has the largest volcano in the solar system.' },
    jupiter: { name: 'JUPITER', type: 'GAS GIANT', radius: 2.8, distance: 38, orbitSpeed: 0.002, rotationSpeed: 0.02, colors: [0xd4a574, 0xc49464, 0xe8c8a8], planetType: 4, atmosphere: 0.4, diameter: '139,820 km', distanceFromSun: '778.5M km', period: '11.9 Years', temp: '-110°C', moons: '95', gravity: '24.79 m/s²', fact: 'Jupiter\'s Great Red Spot is a storm larger than Earth.' },
    saturn: { name: 'SATURN', type: 'GAS GIANT', radius: 2.4, distance: 52, orbitSpeed: 0.0008, rotationSpeed: 0.018, colors: [0xead6a6, 0xd4c090, 0xc4b080], planetType: 5, atmosphere: 0.35, hasRings: true, diameter: '116,460 km', distanceFromSun: '1.4B km', period: '29.4 Years', temp: '-140°C', moons: '146', gravity: '10.44 m/s²', fact: 'Saturn\'s rings are only about 10 meters thick.' },
    uranus: { name: 'URANUS', type: 'ICE GIANT', radius: 1.6, distance: 68, orbitSpeed: 0.0003, rotationSpeed: -0.012, colors: [0x7ec8e3, 0x9ed8ea, 0xaee8f0], planetType: 6, atmosphere: 0.6, diameter: '50,724 km', distanceFromSun: '2.9B km', period: '84 Years', temp: '-224°C', moons: '28', gravity: '8.69 m/s²', fact: 'Uranus rotates on its side with a 98° tilt.' },
    neptune: { name: 'NEPTUNE', type: 'ICE GIANT', radius: 1.5, distance: 82, orbitSpeed: 0.0001, rotationSpeed: 0.015, colors: [0x4169e1, 0x5a7fe8, 0x7090f0], planetType: 7, atmosphere: 0.6, diameter: '49,244 km', distanceFromSun: '4.5B km', period: '165 Years', temp: '-214°C', moons: '16', gravity: '11.15 m/s²', fact: 'Neptune has the strongest winds at 2,100 km/h.' }
};

const noise4D = `
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
float mod289(float x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
vec4 grad4(float j,vec4 ip){const vec4 ones=vec4(1.,1.,1.,-1.);vec4 p,s;p.xyz=floor(fract(vec3(j)*ip.xyz)*7.)*ip.z-1.;p.w=1.5-dot(abs(p.xyz),ones.xyz);s=vec4(lessThan(p,vec4(0.)));p.xyz=p.xyz+(s.xyz*2.-1.)*s.www;return p;}
float snoise4(vec4 v){const vec4 C=vec4(.138196601125011,.276393202250021,.414589803375032,-.447213595499958);vec4 i=floor(v+dot(v,vec4(.309016994374947451)));vec4 x0=v-i+dot(i,C.xxxx);vec4 i0;vec3 isX=step(x0.yzw,x0.xxx);vec3 isYZ=step(x0.zww,x0.yyz);i0.x=isX.x+isX.y+isX.z;i0.yzw=1.-isX;i0.y+=isYZ.x+isYZ.y;i0.zw+=1.-isYZ.xy;i0.z+=isYZ.z;i0.w+=1.-isYZ.z;vec4 i3=clamp(i0,0.,1.);vec4 i2=clamp(i0-1.,0.,1.);vec4 i1=clamp(i0-2.,0.,1.);vec4 x1=x0-i1+C.xxxx;vec4 x2=x0-i2+C.yyyy;vec4 x3=x0-i3+C.zzzz;vec4 x4=x0+C.wwww;i=mod289(i);float j0=permute(permute(permute(permute(i.w)+i.z)+i.y)+i.x);vec4 j1=permute(permute(permute(permute(i.w+vec4(i1.w,i2.w,i3.w,1.))+i.z+vec4(i1.z,i2.z,i3.z,1.))+i.y+vec4(i1.y,i2.y,i3.y,1.))+i.x+vec4(i1.x,i2.x,i3.x,1.));vec4 ip=vec4(1./294.,1./49.,1./7.,0.);vec4 p0=grad4(j0,ip);vec4 p1=grad4(j1.x,ip);vec4 p2=grad4(j1.y,ip);vec4 p3=grad4(j1.z,ip);vec4 p4=grad4(j1.w,ip);vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;p4*=taylorInvSqrt(dot(p4,p4));vec3 m0=max(.6-vec3(dot(x0,x0),dot(x1,x1),dot(x2,x2)),0.);vec2 m1=max(.6-vec2(dot(x3,x3),dot(x4,x4)),0.);m0=m0*m0;m1=m1*m1;return 49.*(dot(m0*m0,vec3(dot(p0,x0),dot(p1,x1),dot(p2,x2)))+dot(m1*m1,vec2(dot(p3,x3),dot(p4,x4))));}`;

const noise3D = `
vec3 mod289_3(vec3 x){return x-floor(x*(1./289.))*289.;}vec4 mod289_4(vec4 x){return x-floor(x*(1./289.))*289.;}vec4 permute_4(vec4 x){return mod289_4(((x*34.)+1.)*x);}vec4 taylorInvSqrt_4(vec4 r){return 1.79284291400159-.85373472095314*r;}
float snoise3(vec3 v){const vec2 C=vec2(1./6.,1./3.);vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-.5;i=mod289_3(i);vec4 p=permute_4(permute_4(permute_4(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));vec4 j=p-49.*floor(p*(1./49.));vec4 x_=floor(j*(1./7.));vec4 y_=floor(j-7.*x_);vec4 x=x_*(2./7.)+.5/7.-1.;vec4 y=y_*(2./7.)+.5/7.-1.;vec4 h=1.-abs(x)-abs(y);vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);vec4 norm=taylorInvSqrt_4(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));}
float fbm3(vec3 p,int oct){float v=0.,a=.5;for(int i=0;i<6;i++){if(i>=oct)break;v+=a*snoise3(p);p*=2.;a*=.5;}return v;}`;

const sunVS = `varying vec3 vNormal,vPosition,vL0,vL1,vL2;uniform float uTime;mat2 rot(float a){float s=sin(a),c=cos(a);return mat2(c,-s,s,c);}void main(){vNormal=normalize(normalMatrix*normal);vPosition=position;float t=uTime*.08;vec3 p=normalize(position);vec3 p1=p;p1.yz=rot(t)*p1.yz;vL0=p1;p1=p;p1.zx=rot(t+2.094)*p1.zx;vL1=p1;p1=p;p1.xy=rot(t-4.188)*p1.xy;vL2=p1;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const sunFS = `precision highp float;${noise4D}varying vec3 vNormal,vPosition,vL0,vL1,vL2;uniform float uTime,uBrightness;float fbm4(vec4 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*snoise4(p);p*=2.;a*=.5;}return v;}vec3 b2c(float b){b*=.25;return vec3(b,b*b,b*b*b*b)/.25*uBrightness;}void main(){float t=uTime*.04;float n0=fbm4(vec4(vL0*3.,t));float n1=fbm4(vec4(vL1*3.,t+10.));float n2=fbm4(vec4(vL2*3.,t+20.));float brightness=(n0+n1+n2)/3.*.5+.5;float fresnel=pow(1.-abs(dot(vNormal,vec3(0.,0.,1.))),2.);brightness+=fresnel*.6;float spots=smoothstep(.35,.55,fbm4(vec4(vPosition*2.5,t*.3)));brightness=mix(brightness,brightness*.25,spots*.5);vec3 color=b2c(brightness*4.5+1.2);gl_FragColor=vec4(clamp(color,0.,1.),1.);}`;
const glowVS = `varying vec3 vNormal,vViewPosition;void main(){vNormal=normalize(normalMatrix*normal);vec4 mvPosition=modelViewMatrix*vec4(position,1.);vViewPosition=-mvPosition.xyz;gl_Position=projectionMatrix*mvPosition;}`;
const glowFS = `precision highp float;uniform vec3 uColor;uniform float uIntensity,uPower;varying vec3 vNormal,vViewPosition;void main(){vec3 viewDir=normalize(vViewPosition);float intensity=pow(uIntensity-dot(vNormal,viewDir),uPower);gl_FragColor=vec4(uColor*intensity,intensity);}`;
const planetVS = `varying vec2 vUv;varying vec3 vNormal,vPosition,vWorldPosition;void main(){vUv=uv;vNormal=normalize(normalMatrix*normal);vPosition=position;vWorldPosition=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const planetFS = `precision highp float;${noise3D}uniform vec3 uColor1,uColor2,uColor3,uSunPosition;uniform float uTime,uAtmosphere;uniform int uType;varying vec2 vUv;varying vec3 vNormal,vPosition,vWorldPosition;void main(){vec3 pos=vPosition*4.;float t=uTime*.02;vec3 lightDir=normalize(uSunPosition-vWorldPosition);float diff=max(dot(vNormal,lightDir),0.);float light=.12+diff*.88;vec3 color;if(uType==0){float n=fbm3(pos*3.,5);color=mix(uColor1,uColor2,n*.5+.5);float craters=smoothstep(.3,.5,fbm3(pos*8.,4));color=mix(color,uColor1*.5,craters);}else if(uType==1){float swirl=fbm3(pos+vec3(t,0.,t*.5),5);color=mix(uColor1,uColor2,swirl*.5+.5);float clouds=fbm3(pos*2.-t,4);color=mix(color,uColor3,clouds*.3);}else if(uType==2){float continents=fbm3(pos*2.,5);float isLand=step(.05,continents);vec3 ocean=uColor1;vec3 land=mix(uColor2,uColor3,fbm3(pos*5.,3)*.5+.5);color=mix(ocean,land,isLand);float lat=abs(vUv.y-.5)*2.;color=mix(color,vec3(1.),smoothstep(.85,.95,lat));}else if(uType==3){float terrain=fbm3(pos*2.5,5);color=mix(uColor1,uColor2,terrain*.5+.5);float dark=smoothstep(.2,.5,fbm3(pos*1.5,4));color=mix(color,uColor3,dark*.5);float lat=abs(vUv.y-.5)*2.;color=mix(color,vec3(1.,.98,.95),smoothstep(.9,.98,lat));}else if(uType==4){float bands=sin(vUv.y*25.+fbm3(pos,3)*2.5)*.5+.5;color=mix(uColor1,uColor2,bands);float storms=fbm3(pos*3.+t,4);color=mix(color,uColor3,storms*.25);vec2 spotC=vec2(.65,.58);float spotD=length((vUv-spotC)*vec2(2.,3.));color=mix(color,vec3(.85,.35,.25),1.-smoothstep(.05,.12,spotD));}else if(uType==5){float bands=sin(vUv.y*18.+fbm3(pos,2)*1.2)*.5+.5;color=mix(uColor1,uColor2,bands);float detail=fbm3(pos*3.,3);color=mix(color,uColor3,detail*.15);}else if(uType==6){float features=fbm3(pos*1.5,4);color=mix(uColor1,uColor2,features*.25+.5);}else if(uType==7){float storms=fbm3(pos*2.5+t*.5,5);color=mix(uColor1,uColor2,storms*.35+.5);float bright=fbm3(pos*4.-t,3);color=mix(color,uColor3,bright*.2);}else{color=uColor1;}color*=light;if(uAtmosphere>0.){float fresnel=pow(1.-abs(dot(vNormal,vec3(0.,0.,1.))),3.);color=mix(color,uColor2*1.5,fresnel*uAtmosphere*.4);}gl_FragColor=vec4(color,1.);}`;

let scene, camera, renderer, controls, clock = new THREE.Clock();
let planets = {}, labels = {}, orbits = [], galaxy;
let raycaster, mouse;
const state = { playing: true, speed: 1, showOrbits: true, showLabels: true, soundEnabled: false, selectedPlanet: null, followTarget: null };

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000008);
    camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 3000);
    camera.position.set(35, 25, 55);
    renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    document.getElementById('canvas-container').appendChild(renderer.domElement);
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 8;
    controls.maxDistance = 250;
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    loadScene();
    setupEvents();
    animate();
}

function loadScene() {
    updateLoad('Stars...', 15); createStarfield();
    updateLoad('Galaxy...', 30); createGalaxy();
    updateLoad('Lighting...', 45);
    scene.add(new THREE.AmbientLight(0x111122, 0.15));
    scene.add(new THREE.PointLight(0xfff5e0, 2.5, 500, 1.5));
    updateLoad('Sun...', 60); createSun();
    updateLoad('Planets...', 75); Object.entries(PLANETS).forEach(([k, d]) => k !== 'sun' && createPlanet(k, d));
    updateLoad('Orbits...', 90);
    Object.entries(PLANETS).forEach(([k, d]) => { if (k !== 'sun' && d.distance) { const pts = []; for (let i = 0; i <= 128; i++) { const a = (i / 128) * Math.PI * 2; pts.push(new THREE.Vector3(Math.cos(a) * d.distance, 0, Math.sin(a) * d.distance)); } const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.15 })); scene.add(line); orbits.push(line); } });
    updateLoad('Done!', 100);
    setTimeout(() => document.getElementById('loading').classList.add('hidden'), 600);
}

function updateLoad(s, p) { const st = document.getElementById('load-status'), pr = document.getElementById('load-progress'); if (st) st.textContent = s; if (pr) pr.style.width = p + '%'; }

function createStarfield() {
    [[15000, 0.4, 400, 1000], [6000, 0.9, 250, 600], [1500, 1.6, 150, 400]].forEach(([c, sz, mn, mx]) => {
        const g = new THREE.BufferGeometry(), pos = new Float32Array(c * 3), col = new Float32Array(c * 3);
        for (let i = 0; i < c; i++) { const i3 = i * 3, r = mn + Math.random() * (mx - mn), th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1); pos[i3] = r * Math.sin(ph) * Math.cos(th); pos[i3 + 1] = r * Math.sin(ph) * Math.sin(th); pos[i3 + 2] = r * Math.cos(ph); const t = Math.random(); col[i3] = 0.8 + t * 0.2; col[i3 + 1] = 0.8 + (t > 0.5 ? 0.2 : -0.1); col[i3 + 2] = 0.9 + (t < 0.5 ? 0.1 : -0.2); }
        g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        g.setAttribute('color', new THREE.BufferAttribute(col, 3));
        scene.add(new THREE.Points(g, new THREE.PointsMaterial({ size: sz, vertexColors: true, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending })));
    });
}

function createGalaxy() {
    const c = 60000, g = new THREE.BufferGeometry(), pos = new Float32Array(c * 3), col = new Float32Array(c * 3), clrs = [new THREE.Color(0xff6b35), new THREE.Color(0xf4c430), new THREE.Color(0x5b8dee), new THREE.Color(0xa855f7)];
    for (let i = 0; i < c; i++) { const i3 = i * 3, arm = i % 4, r = Math.random() * 700 + 150, spin = r * 0.002, branch = (arm / 4) * Math.PI * 2, rand = Math.pow(Math.random(), 3) * 60; pos[i3] = Math.cos(branch + spin) * r + (Math.random() - 0.5) * rand; pos[i3 + 1] = (Math.random() - 0.5) * rand * 0.2 - 300; pos[i3 + 2] = Math.sin(branch + spin) * r + (Math.random() - 0.5) * rand - 500; const cl = clrs[arm], b = 0.4 + (1 - r / 900) * 0.6; col[i3] = cl.r * b; col[i3 + 1] = cl.g * b; col[i3 + 2] = cl.b * b; }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    galaxy = new THREE.Points(g, new THREE.PointsMaterial({ size: 1.5, vertexColors: true, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false }));
    scene.add(galaxy);
}

function createSun() {
    const d = PLANETS.sun, gr = new THREE.Group();
    gr.userData = { name: 'sun', data: d };
    const geo = new THREE.SphereGeometry(d.radius, 128, 128);
    const mat = new THREE.ShaderMaterial({ uniforms: { uTime: { value: 0 }, uBrightness: { value: 0.7 } }, vertexShader: sunVS, fragmentShader: sunFS });
    const sun = new THREE.Mesh(geo, mat);
    sun.userData = { name: 'sun', data: d, clickable: true };
    gr.add(sun);
    [[d.radius * 1.3, 0xffaa00, 0.65, 2.0], [d.radius * 1.7, 0xff7700, 0.4, 2.5], [d.radius * 2.3, 0xff5500, 0.2, 3.0], [d.radius * 3.2, 0xff3300, 0.1, 4.0]].forEach(([sz, cl, int, pw]) => {
        const gm = new THREE.ShaderMaterial({ uniforms: { uColor: { value: new THREE.Color(cl) }, uIntensity: { value: int }, uPower: { value: pw } }, vertexShader: glowVS, fragmentShader: glowFS, side: THREE.BackSide, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false });
        gr.add(new THREE.Mesh(new THREE.SphereGeometry(sz, 32, 32), gm));
    });
    scene.add(gr);
    planets.sun = { mesh: sun, group: gr, data: d, angle: 0, mat };
    createLabel('sun', d);
}

function createPlanet(key, data) {
    const gr = new THREE.Group();
    gr.userData = { name: key, data };
    const geo = new THREE.SphereGeometry(data.radius, 64, 64);
    const mat = new THREE.ShaderMaterial({ uniforms: { uColor1: { value: new THREE.Color(data.colors[0]) }, uColor2: { value: new THREE.Color(data.colors[1]) }, uColor3: { value: new THREE.Color(data.colors[2]) }, uTime: { value: 0 }, uType: { value: data.planetType }, uSunPosition: { value: new THREE.Vector3(0, 0, 0) }, uAtmosphere: { value: data.atmosphere } }, vertexShader: planetVS, fragmentShader: planetFS });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.x = data.distance;
    mesh.userData = { name: key, data, clickable: true };
    gr.add(mesh);
    if (data.atmosphere > 0) { const ag = new THREE.SphereGeometry(data.radius * 1.12, 32, 32), am = new THREE.MeshBasicMaterial({ color: data.colors[1], transparent: true, opacity: data.atmosphere * 0.2, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false }), atmo = new THREE.Mesh(ag, am); atmo.position.copy(mesh.position); gr.add(atmo); mesh.userData.atmosphere = atmo; }
    if (data.hasMoon) { const moon = new THREE.Mesh(new THREE.SphereGeometry(0.25, 32, 32), new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.9 })); moon.position.set(2, 0, 0); mesh.add(moon); mesh.userData.moon = moon; }
    if (data.hasRings) { const rg = new THREE.RingGeometry(3.0, 5.5, 128), rt = createRingTexture(), rm = new THREE.MeshBasicMaterial({ map: rt, side: THREE.DoubleSide, transparent: true, opacity: 0.85, depthWrite: false }), ring = new THREE.Mesh(rg, rm); ring.rotation.x = Math.PI / 2.2; ring.position.copy(mesh.position); gr.add(ring); mesh.userData.ring = ring; }
    scene.add(gr);
    planets[key] = { mesh, group: gr, data, angle: Math.random() * Math.PI * 2, mat };
    createLabel(key, data);
}

function createRingTexture() { const cv = document.createElement('canvas'); cv.width = 1024; cv.height = 64; const ctx = cv.getContext('2d'); [[0, 0.08, 0.2, [160, 140, 120]], [0.12, 0.4, 0.9, [200, 180, 160]], [0.4, 0.45, 0.3, [150, 130, 110]], [0.45, 0.65, 0.85, [210, 190, 170]], [0.7, 0.85, 0.6, [180, 160, 140]], [0.85, 1, 0.15, [130, 110, 90]]].forEach(([s, e, o, c]) => { ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${o})`; ctx.fillRect(s * 1024, 0, (e - s) * 1024, 64); }); return new THREE.CanvasTexture(cv); }

function createLabel(key, data) { const div = document.createElement('div'); div.className = 'planet-label'; div.textContent = data.name; document.body.appendChild(div); labels[key] = div; }

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta(), time = clock.getElapsedTime();
    document.getElementById('fps').textContent = Math.min(Math.round(1 / Math.max(delta, 0.001)), 999);
    if (state.playing) {
        const m = Math.floor(time / 60) % 60, s = Math.floor(time) % 60;
        document.getElementById('time').textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        if (planets.sun?.mat) planets.sun.mat.uniforms.uTime.value = time;
        planets.sun?.mesh.rotation.y += PLANETS.sun.rotationSpeed * state.speed;
        Object.entries(planets).forEach(([k, p]) => { if (k === 'sun') return; p.angle += p.data.orbitSpeed * state.speed; const x = Math.cos(p.angle) * p.data.distance, z = Math.sin(p.angle) * p.data.distance; p.mesh.position.set(x, 0, z); if (p.mat) p.mat.uniforms.uTime.value = time; p.mesh.rotation.y += p.data.rotationSpeed * state.speed; if (p.mesh.userData.atmosphere) p.mesh.userData.atmosphere.position.set(x, 0, z); if (p.mesh.userData.ring) p.mesh.userData.ring.position.set(x, 0, z); if (p.mesh.userData.moon) { const ma = time * 0.3; p.mesh.userData.moon.position.set(Math.cos(ma) * 2, 0, Math.sin(ma) * 2); } });
        if (galaxy) galaxy.rotation.y += 0.00003 * state.speed;
    }
    if (state.followTarget && planets[state.followTarget]) { const pos = new THREE.Vector3(); planets[state.followTarget].mesh.getWorldPosition(pos); controls.target.lerp(pos, 0.05); }
    updateLabels();
    controls.update();
    renderer.render(scene, camera);
}

function updateLabels() { if (!state.showLabels) { Object.values(labels).forEach(l => l.style.display = 'none'); return; } Object.entries(labels).forEach(([k, l]) => { const p = planets[k]; if (!p) return; const pos = new THREE.Vector3(); p.mesh.getWorldPosition(pos); pos.y += p.data.radius * 1.8; const scr = pos.clone().project(camera); if (scr.z > 1) { l.style.display = 'none'; } else { l.style.display = 'block'; l.style.left = (scr.x * 0.5 + 0.5) * innerWidth + 'px'; l.style.top = (-scr.y * 0.5 + 0.5) * innerHeight + 'px'; } }); }

function setupEvents() {
    addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); });
    addEventListener('mousemove', e => { mouse.x = (e.clientX / innerWidth) * 2 - 1; mouse.y = -(e.clientY / innerHeight) * 2 + 1; raycaster.setFromCamera(mouse, camera); const hits = raycaster.intersectObjects(Object.values(planets).map(p => p.mesh)), tooltip = document.getElementById('tooltip'); if (hits.length > 0 && hits[0].object.userData.clickable) { document.body.classList.add('clickable'); tooltip.classList.remove('hidden'); tooltip.textContent = hits[0].object.userData.data.name; tooltip.style.left = e.clientX + 'px'; tooltip.style.top = e.clientY + 'px'; } else { document.body.classList.remove('clickable'); tooltip.classList.add('hidden'); } });
    addEventListener('click', e => { if (e.target.closest('#controls,#planet-popup,#header')) return; raycaster.setFromCamera(mouse, camera); const hits = raycaster.intersectObjects(Object.values(planets).map(p => p.mesh)); if (hits.length > 0 && hits[0].object.userData.clickable) { const nm = hits[0].object.userData.name; if (nm && PLANETS[nm]) showPopup(nm, PLANETS[nm]); } });
    addEventListener('keydown', e => { if (e.target.tagName === 'INPUT') return; switch (e.key.toLowerCase()) { case ' ': e.preventDefault(); togglePlay(); break; case 'r': resetCamera(); break; case 'o': toggleOrbits(); break; case 'l': toggleLabels(); break; case 'm': toggleSound(); break; case 'escape': closePopup(); state.followTarget = null; break; case '0': case '1': case '2': case '3': case '4': case '5': case '6': case '7': case '8': const names = ['sun', 'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune']; const nm = names[parseInt(e.key)]; if (PLANETS[nm]) showPopup(nm, PLANETS[nm]); break; } });
    document.getElementById('btn-play').addEventListener('click', togglePlay);
    document.getElementById('btn-reset').addEventListener('click', resetCamera);
    document.getElementById('btn-orbits').addEventListener('click', toggleOrbits);
    document.getElementById('btn-labels').addEventListener('click', toggleLabels);
    document.getElementById('btn-sound').addEventListener('click', toggleSound);
    document.getElementById('speed').addEventListener('input', e => { state.speed = parseFloat(e.target.value); document.getElementById('speed-val').textContent = state.speed.toFixed(1) + 'x'; });
    document.getElementById('popup-close').addEventListener('click', closePopup);
    document.getElementById('popup-speak').addEventListener('click', speakInfo);
    document.getElementById('popup-focus').addEventListener('click', () => state.selectedPlanet && focusOn(state.selectedPlanet));
    document.getElementById('popup-follow').addEventListener('click', () => { if (state.selectedPlanet) { state.followTarget = state.selectedPlanet; closePopup(); } });
}

function showPopup(nm, d) { state.selectedPlanet = nm; document.getElementById('popup-name').textContent = d.name; document.getElementById('popup-type').textContent = d.type; document.getElementById('popup-diameter').textContent = d.diameter; document.getElementById('popup-distance').textContent = d.distanceFromSun; document.getElementById('popup-period').textContent = d.period; document.getElementById('popup-temp').textContent = d.temp; document.getElementById('popup-moons').textContent = d.moons; document.getElementById('popup-gravity').textContent = d.gravity; document.getElementById('popup-fact').textContent = d.fact; const c1 = d.colors[0].toString(16).padStart(6, '0'), c2 = d.colors[1].toString(16).padStart(6, '0'); document.getElementById('popup-visual').style.background = `linear-gradient(135deg, #${c1}, #${c2})`; document.getElementById('planet-popup').classList.remove('hidden'); if (state.soundEnabled) speakInfo(); }
function closePopup() { document.getElementById('planet-popup').classList.add('hidden'); if (speechSynthesis.speaking) speechSynthesis.cancel(); }
function speakInfo() { if (speechSynthesis.speaking) speechSynthesis.cancel(); if (!state.selectedPlanet || !PLANETS[state.selectedPlanet]) return; const d = PLANETS[state.selectedPlanet], txt = `${d.name}. ${d.type}. Diameter: ${d.diameter}. Distance: ${d.distanceFromSun}. Period: ${d.period}. Temperature: ${d.temp}. Moons: ${d.moons}. ${d.fact}`, utt = new SpeechSynthesisUtterance(txt); utt.rate = 0.9; speechSynthesis.speak(utt); document.getElementById('popup-speak').classList.add('active'); utt.onend = () => document.getElementById('popup-speak').classList.remove('active'); }
function focusOn(nm) { const p = planets[nm]; if (!p) return; const pos = new THREE.Vector3(); p.mesh.getWorldPosition(pos); const off = p.data.radius * 5 + 10; animateCamera(new THREE.Vector3(pos.x + off * 0.5, pos.y + off * 0.3, pos.z + off), pos); closePopup(); }
function animateCamera(tgt, look) { const sPos = camera.position.clone(), sTgt = controls.target.clone(), st = Date.now(); (function upd() { const t = Math.min((Date.now() - st) / 1000, 1), e = 1 - Math.pow(1 - t, 3); camera.position.lerpVectors(sPos, tgt, e); controls.target.lerpVectors(sTgt, look, e); controls.update(); if (t < 1) requestAnimationFrame(upd); })(); }
function togglePlay() { state.playing = !state.playing; document.getElementById('icon-pause').style.display = state.playing ? 'block' : 'none'; document.getElementById('icon-play').style.display = state.playing ? 'none' : 'block'; document.getElementById('btn-play').classList.toggle('active', state.playing); }
function resetCamera() { state.followTarget = null; animateCamera(new THREE.Vector3(35, 25, 55), new THREE.Vector3(0, 0, 0)); }
function toggleOrbits() { state.showOrbits = !state.showOrbits; orbits.forEach(o => o.visible = state.showOrbits); document.getElementById('btn-orbits').classList.toggle('active', state.showOrbits); }
function toggleLabels() { state.showLabels = !state.showLabels; document.getElementById('btn-labels').classList.toggle('active', state.showLabels); }
function toggleSound() { state.soundEnabled = !state.soundEnabled; document.getElementById('btn-sound').classList.toggle('active', state.soundEnabled); if (!state.soundEnabled && speechSynthesis.speaking) speechSynthesis.cancel(); }

init();
