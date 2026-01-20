// COSMOS EXPLORER - Professional Sun Shaders from FWD Reference
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ============ PLANET DATA ============
const PLANETS = {
    sun: { name: 'THE SUN', type: 'G-TYPE MAIN SEQUENCE STAR', radius: 5, distance: 0, orbitSpeed: 0, rotationSpeed: 0.0003, colors: [0xffaa00, 0xff6600, 0xff3300], planetType: -1, atmosphere: 0, diameter: '1,392,700 km', distanceFromSun: 'Center', period: 'N/A', temp: '5,500°C', moons: '8 Planets', gravity: '274 m/s²', fact: 'The Sun contains 99.86% of all mass in our solar system.' },
    mercury: { name: 'MERCURY', type: 'TERRESTRIAL', radius: 0.4, distance: 10, orbitSpeed: 0.04, rotationSpeed: 0.004, colors: [0x8c7853, 0x6b5a47, 0x544739], planetType: 0, atmosphere: 0, diameter: '4,879 km', distanceFromSun: '57.9M km', period: '88 Days', temp: '-180 to 430°C', moons: '0', gravity: '3.7 m/s²', fact: 'Mercury has extreme temperature swings of over 600°C.' },
    venus: { name: 'VENUS', type: 'TERRESTRIAL', radius: 0.9, distance: 14, orbitSpeed: 0.015, rotationSpeed: -0.002, colors: [0xe8c76a, 0xd4a84a, 0xc49632], planetType: 1, atmosphere: 0.7, diameter: '12,104 km', distanceFromSun: '108.2M km', period: '225 Days', temp: '465°C', moons: '0', gravity: '8.87 m/s²', fact: 'A day on Venus is longer than its year.' },
    earth: { name: 'EARTH', type: 'TERRESTRIAL', radius: 1.0, distance: 18, orbitSpeed: 0.01, rotationSpeed: 0.01, colors: [0x4a90d9, 0x2d6a27, 0x3d8b3d], planetType: 2, atmosphere: 0.5, hasMoon: true, diameter: '12,742 km', distanceFromSun: '149.6M km', period: '365.25 Days', temp: '-88 to 58°C', moons: '1', gravity: '9.81 m/s²', fact: 'Earth is the only planet known to harbor life.' },
    mars: { name: 'MARS', type: 'TERRESTRIAL', radius: 0.55, distance: 24, orbitSpeed: 0.008, rotationSpeed: 0.009, colors: [0xcd5c5c, 0xb84c4c, 0x8b3232], planetType: 3, atmosphere: 0.25, diameter: '6,779 km', distanceFromSun: '227.9M km', period: '687 Days', temp: '-87 to -5°C', moons: '2', gravity: '3.71 m/s²', fact: 'Mars has the largest volcano in the solar system.' },
    jupiter: { name: 'JUPITER', type: 'GAS GIANT', radius: 2.8, distance: 38, orbitSpeed: 0.002, rotationSpeed: 0.02, colors: [0xd4a574, 0xc49464, 0xe8c8a8], planetType: 4, atmosphere: 0.4, diameter: '139,820 km', distanceFromSun: '778.5M km', period: '11.9 Years', temp: '-110°C', moons: '95', gravity: '24.79 m/s²', fact: 'Jupiter\'s Great Red Spot is a storm larger than Earth.' },
    saturn: { name: 'SATURN', type: 'GAS GIANT', radius: 2.4, distance: 52, orbitSpeed: 0.0008, rotationSpeed: 0.018, colors: [0xead6a6, 0xd4c090, 0xc4b080], planetType: 5, atmosphere: 0.35, hasRings: true, diameter: '116,460 km', distanceFromSun: '1.4B km', period: '29.4 Years', temp: '-140°C', moons: '146', gravity: '10.44 m/s²', fact: 'Saturn\'s rings are only about 10 meters thick.' },
    uranus: { name: 'URANUS', type: 'ICE GIANT', radius: 1.6, distance: 68, orbitSpeed: 0.0003, rotationSpeed: -0.012, colors: [0x7ec8e3, 0x9ed8ea, 0xaee8f0], planetType: 6, atmosphere: 0.6, diameter: '50,724 km', distanceFromSun: '2.9B km', period: '84 Years', temp: '-224°C', moons: '28', gravity: '8.69 m/s²', fact: 'Uranus rotates on its side with a 98° tilt.' },
    neptune: { name: 'NEPTUNE', type: 'ICE GIANT', radius: 1.5, distance: 82, orbitSpeed: 0.0001, rotationSpeed: 0.015, colors: [0x4169e1, 0x5a7fe8, 0x7090f0], planetType: 7, atmosphere: 0.6, diameter: '49,244 km', distanceFromSun: '4.5B km', period: '165 Years', temp: '-214°C', moons: '16', gravity: '11.15 m/s²', fact: 'Neptune has the strongest winds at 2,100 km/h.' }
};

// ============ SIMPLEX 4D NOISE ============
const simplex4D = `
vec4 mod289(vec4 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
float mod289(float x){ return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 permute(vec4 x){ return mod289(((x * 34.0) + 1.0) * x); }
float permute(float x){ return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
float taylorInvSqrt(float r){ return 1.79284291400159 - 0.85373472095314 * r; }

vec4 grad4(float j, vec4 ip) {
  const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
  vec4 p, s;
  p.xyz = floor(fract(vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
  p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
  s = vec4(lessThan(p, vec4(0.0)));
  p.xyz = p.xyz + (s.xyz * 2.0 - 1.0) * s.www;
  return p;
}

#define F4 0.309016994374947451

float snoise(vec4 v) {
  const vec4 C = vec4(0.138196601125011, 0.276393202250021, 0.414589803375032, -0.447213595499958);
  vec4 i = floor(v + dot(v, vec4(F4)));
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
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w; p4 *= taylorInvSqrt(dot(p4,p4));
  vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
  vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)), 0.0);
  m0 = m0 * m0; m1 = m1 * m1;
  return 49.0 * (dot(m0*m0, vec3(dot(p0, x0), dot(p1, x1), dot(p2, x2))) + dot(m1*m1, vec2(dot(p3, x3), dot(p4, x4))));
}
`;

// ============ PERLIN CUBEMAP SHADERS ============
const perlinVS = `
varying vec3 vWorld;
void main() {
  vec4 world = modelMatrix * vec4(position, 1.0);
  vWorld = world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}`;

const perlinFS = `
precision highp float;
varying vec3 vWorld;
uniform float uTime;
uniform float uSpatialFrequency;
uniform float uTemporalFrequency;
uniform float uH;
uniform float uContrast;
uniform float uFlatten;
#define OCTAVES 5
${simplex4D}

vec2 fbm(vec4 p){
  float a = 1.0, f = 1.0;
  vec2 sum = vec2(0.0);
  for (int i = 0; i < OCTAVES; i++){
    sum.x += snoise(p * f) * a;
    p.w += 100.0;
    sum.y += snoise(p * f) * a;
    a *= uH;
    f *= 2.0;
  }
  return sum;
}

void main(){
  vec3 world = normalize(vWorld) + 12.45;
  vec4 p = vec4(world * uSpatialFrequency, uTime * uTemporalFrequency);
  vec2 f = fbm(p) * uContrast + 0.5;
  vec4 p2 = vec4(world * 2.0, uTime * uTemporalFrequency);
  float modulate = max(snoise(p2), 0.0);
  float x = mix(f.x, f.x * modulate, uFlatten);
  gl_FragColor = vec4(x, f.y, f.y, x);
}`;

// ============ SUN SPHERE SHADERS ============
const sunSphereVS = `
varying vec3 vWorld;
varying vec3 vNormalView;
varying vec3 vNormalWorld;
varying vec3 vLayer0;
varying vec3 vLayer1;
varying vec3 vLayer2;
uniform float uTime;

mat2 rot(float a){ float s=sin(a), c=cos(a); return mat2(c,-s,s,c); }

void setLayers(vec3 p){
  float t = uTime;
  vec3 p1 = p; p1.yz = rot(t) * p1.yz; vLayer0 = p1;
  p1 = p; p1.zx = rot(t + 2.094) * p1.zx; vLayer1 = p1;
  p1 = p; p1.xy = rot(t - 4.188) * p1.xy; vLayer2 = p1;
}

void main(){
  vec4 world = modelMatrix * vec4(position, 1.0);
  vWorld = world.xyz;
  vNormalView = normalize(normalMatrix * normal);
  vNormalWorld = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
  setLayers(normalize(normal));
  gl_Position = projectionMatrix * viewMatrix * world;
}`;

const sunSphereFS = `
precision highp float;
varying vec3 vWorld;
varying vec3 vNormalView;
varying vec3 vNormalWorld;
varying vec3 vLayer0;
varying vec3 vLayer1;
varying vec3 vLayer2;
uniform samplerCube uPerlinCube;
uniform float uFresnelPower;
uniform float uFresnelInfluence;
uniform float uTint;
uniform float uBase;
uniform float uBrightnessOffset;
uniform float uBrightness;
uniform float uVisibility;
uniform float uDirection;
uniform vec3 uLightView;

float getAlpha(vec3 n){
  float nDotL = dot(n, uLightView) * uDirection;
  return smoothstep(1.0, 1.5, nDotL + uVisibility * 2.5);
}

vec3 brightnessToColor(float b){
  b *= uTint;
  return (vec3(b, b*b, b*b*b*b) / uTint) * uBrightness;
}

float ocean(){
  float s = 0.0;
  s += textureCube(uPerlinCube, vLayer0).r;
  s += textureCube(uPerlinCube, vLayer1).r;
  s += textureCube(uPerlinCube, vLayer2).r;
  return s * 0.3333333;
}

void main(){
  vec3 Vview = normalize((viewMatrix * vec4(vWorld - cameraPosition, 0.0)).xyz);
  float nDotV = dot(vNormalView, -Vview);
  float fresnel = pow(1.0 - nDotV, uFresnelPower) * uFresnelInfluence;
  float brightness = ocean() * uBase + uBrightnessOffset + fresnel;
  vec3 col = clamp(brightnessToColor(brightness), 0.0, 1.0);
  float a = getAlpha(normalize(vNormalWorld));
  gl_FragColor = vec4(col, a);
}`;

// ============ GLOW SHADER ============
const glowVS = `
attribute vec3 aPos;
varying float vRadial;
varying vec3 vWorld;
uniform mat4 uViewProjection;
uniform float uRadius;
uniform vec3 uCamUp;
uniform vec3 uCamPos;

void main(void){
  vRadial = aPos.z;
  vec3 side = normalize(cross(normalize(-uCamPos), uCamUp));
  vec3 p = aPos.x * side + aPos.y * uCamUp;
  p *= 1.0 + aPos.z * uRadius;
  vec4 world = vec4(p, 1.0);
  vWorld = world.xyz;
  gl_Position = uViewProjection * world;
}`;

const glowFS = `
precision highp float;
varying float vRadial;
varying vec3 vWorld;
uniform float uTint;
uniform float uBrightness;
uniform float uFalloffColor;
uniform float uVisibility;
uniform float uDirection;
uniform vec3 uLightView;

float getAlpha(vec3 n){
  float nDotL = dot(n, uLightView) * uDirection;
  return smoothstep(1.0, 1.5, nDotL + uVisibility * 2.5);
}

vec3 brightnessToColor(float b){
  b *= uTint;
  return (vec3(b, b*b, b*b*b*b) / uTint) * uBrightness;
}

void main(void){
  float alpha = (1.0 - vRadial);
  alpha *= alpha;
  float brightness = 1.0 + alpha * uFalloffColor;
  alpha *= getAlpha(normalize(vWorld));
  gl_FragColor.xyz = brightnessToColor(brightness) * alpha;
  gl_FragColor.w = alpha;
}`;

// ============ SUN RAYS SHADER ============
const sunRaysVS = `
attribute vec3 aPos;
attribute vec3 aPos0;
attribute vec4 aWireRandom;
varying float vUVY;
varying float vOpacity;
varying vec3 vColor;
varying vec3 vNormal;
uniform float uHueSpread;
uniform float uHue;
uniform float uLength;
uniform float uWidth;
uniform float uTime;
uniform float uNoiseFrequency;
uniform float uNoiseAmplitude;
uniform vec3 uCamPos;
uniform mat4 uViewProjection;
uniform float uOpacity;

#define m4 mat4(0.00,0.80,0.60,-0.4,-0.80,0.36,-0.48,-0.5,-0.60,-0.48,0.64,0.2,0.40,0.30,0.20,0.4)

vec4 twistedSineNoise(vec4 q, float falloff){
  float a = 1., f = 1.;
  vec4 sum = vec4(0);
  for(int i = 0; i < 4; i++){
    q = m4 * q;
    vec4 s = sin(q.ywxz * f) * a;
    q += s; sum += s;
    a *= falloff; f /= falloff;
  }
  return sum;
}

vec3 getPos(float phase, float animPhase){
  float size = aWireRandom.z + 0.2;
  float d = phase * uLength * size;
  vec3 p = aPos0 + aPos0 * d;
  p += twistedSineNoise(vec4(p * uNoiseFrequency, uTime), 0.707).xyz * (d * uNoiseAmplitude);
  return p;
}

vec3 spectrum(float d){
  return smoothstep(0.25, 0., abs(d + vec3(-0.375, -0.5, -0.625)));
}

void main(void){
  vUVY = aPos.z;
  float animPhase = fract(uTime * 0.3 * (aWireRandom.y * 0.5) + aWireRandom.x);
  vec3 p = getPos(aPos.x, animPhase);
  vec3 p1 = getPos(aPos.x + 0.01, animPhase);
  vec3 p0w = (modelMatrix * vec4(p, 1.0)).xyz;
  vec3 p1w = (modelMatrix * vec4(p1, 1.0)).xyz;
  vec3 dirW = normalize(p1w - p0w);
  vec3 vW = normalize(p0w - uCamPos);
  vec3 sideW = normalize(cross(vW, dirW));
  if(length(sideW) < 1e-6){
    vec3 up = (abs(dirW.y) < 0.99) ? vec3(0.,1.,0.) : vec3(1.,0.,0.);
    sideW = normalize(cross(up, dirW));
  }
  float width = uWidth * aPos.z * (1.0 - aPos.x);
  vec3 pWorld = p0w + sideW * width;
  vNormal = normalize(pWorld);
  vOpacity = uOpacity * (0.5 + aWireRandom.w);
  vColor = spectrum(aWireRandom.w * uHueSpread + uHue);
  gl_Position = uViewProjection * vec4(pWorld, 1.0);
}`;

const sunRaysFS = `
precision highp float;
varying float vUVY;
varying float vOpacity;
varying vec3 vColor;
varying vec3 vNormal;
uniform float uAlphaBlended;
uniform float uVisibility;
uniform float uDirection;
uniform vec3 uLightView;

float getAlpha(vec3 n){
  float nDotL = dot(n, uLightView) * uDirection;
  return smoothstep(1.0, 1.5, nDotL + uVisibility * 2.5);
}

void main(void){
  float alpha = 1.0 - smoothstep(0.0, 1.0, abs(vUVY));
  alpha *= alpha;
  alpha *= vOpacity;
  alpha *= getAlpha(vNormal);
  gl_FragColor = vec4(vColor * alpha, alpha);
}`;

// ============ PLANET SHADERS ============
const noise3D = `
vec3 mod289_3(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289_4(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute_4(vec4 x){return mod289_4(((x*34.)+1.)*x);}
vec4 taylorInvSqrt_4(vec4 r){return 1.79284291400159-.85373472095314*r;}
float snoise3(vec3 v){const vec2 C=vec2(1./6.,1./3.);vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-.5;i=mod289_3(i);vec4 p=permute_4(permute_4(permute_4(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));vec4 j=p-49.*floor(p*(1./49.));vec4 x_=floor(j*(1./7.));vec4 y_=floor(j-7.*x_);vec4 x=x_*(2./7.)+.5/7.-1.;vec4 y=y_*(2./7.)+.5/7.-1.;vec4 h=1.-abs(x)-abs(y);vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);vec4 norm=taylorInvSqrt_4(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));}
float fbm3(vec3 p,int oct){float v=0.,a=.5;for(int i=0;i<6;i++){if(i>=oct)break;v+=a*snoise3(p);p*=2.;a*=.5;}return v;}`;

const planetVS = `varying vec2 vUv;varying vec3 vNormal,vPosition,vWorldPosition;void main(){vUv=uv;vNormal=normalize(normalMatrix*normal);vPosition=position;vWorldPosition=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;

const planetFS = `precision highp float;${noise3D}uniform vec3 uColor1,uColor2,uColor3,uSunPosition;uniform float uTime,uAtmosphere;uniform int uType;varying vec2 vUv;varying vec3 vNormal,vPosition,vWorldPosition;void main(){vec3 pos=vPosition*4.;float t=uTime*.02;vec3 lightDir=normalize(uSunPosition-vWorldPosition);float diff=max(dot(vNormal,lightDir),0.);float light=.12+diff*.88;vec3 color;if(uType==0){float n=fbm3(pos*3.,5);color=mix(uColor1,uColor2,n*.5+.5);float craters=smoothstep(.3,.5,fbm3(pos*8.,4));color=mix(color,uColor1*.5,craters);}else if(uType==1){float swirl=fbm3(pos+vec3(t,0.,t*.5),5);color=mix(uColor1,uColor2,swirl*.5+.5);float clouds=fbm3(pos*2.-t,4);color=mix(color,uColor3,clouds*.3);}else if(uType==2){float continents=fbm3(pos*2.,5);float isLand=step(.05,continents);vec3 ocean=uColor1;vec3 land=mix(uColor2,uColor3,fbm3(pos*5.,3)*.5+.5);color=mix(ocean,land,isLand);float lat=abs(vUv.y-.5)*2.;color=mix(color,vec3(1.),smoothstep(.85,.95,lat));}else if(uType==3){float terrain=fbm3(pos*2.5,5);color=mix(uColor1,uColor2,terrain*.5+.5);float dark=smoothstep(.2,.5,fbm3(pos*1.5,4));color=mix(color,uColor3,dark*.5);float lat=abs(vUv.y-.5)*2.;color=mix(color,vec3(1.,.98,.95),smoothstep(.9,.98,lat));}else if(uType==4){float bands=sin(vUv.y*25.+fbm3(pos,3)*2.5)*.5+.5;color=mix(uColor1,uColor2,bands);float storms=fbm3(pos*3.+t,4);color=mix(color,uColor3,storms*.25);vec2 spotC=vec2(.65,.58);float spotD=length((vUv-spotC)*vec2(2.,3.));color=mix(color,vec3(.85,.35,.25),1.-smoothstep(.05,.12,spotD));}else if(uType==5){float bands=sin(vUv.y*18.+fbm3(pos,2)*1.2)*.5+.5;color=mix(uColor1,uColor2,bands);float detail=fbm3(pos*3.,3);color=mix(color,uColor3,detail*.15);}else if(uType==6){float features=fbm3(pos*1.5,4);color=mix(uColor1,uColor2,features*.25+.5);}else if(uType==7){float storms=fbm3(pos*2.5+t*.5,5);color=mix(uColor1,uColor2,storms*.35+.5);float bright=fbm3(pos*4.-t,3);color=mix(color,uColor3,bright*.2);}else{color=uColor1;}color*=light;if(uAtmosphere>0.){float fresnel=pow(1.-abs(dot(vNormal,vec3(0.,0.,1.))),3.);color=mix(color,uColor2*1.5,fresnel*uAtmosphere*.4);}gl_FragColor=vec4(color,1.);}`;

// ============ GLOBAL STATE ============
let scene, camera, renderer, controls, clock = new THREE.Clock();
let planets = {}, labels = {}, orbits = [], galaxy;
let raycaster, mouse;
let perlinScene, perlinMat, cubeCam, cubeRT;
let sunGroup, sunMaterial, glowMaterial, sunRaysMaterial;
let lightDirWorld;
let time = 0;

const state = { playing: true, speed: 1, showOrbits: true, showLabels: true, soundEnabled: false, selectedPlanet: null, followTarget: null };

// ============ INIT ============
function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000005);
    
    camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 3000);
    camera.position.set(30, 20, 45);
    
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, premultipliedAlpha: true });
    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setClearColor(0x000005, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    document.getElementById('canvas-container').appendChild(renderer.domElement);
    
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 8;
    controls.maxDistance = 250;
    
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    
    lightDirWorld = new THREE.Vector3(1, 1, 1).normalize();
    
    loadScene();
    setupEvents();
    animate();
}

function loadScene() {
    updateLoad('Stars...', 10); createStarfield();
    updateLoad('Galaxy...', 25); createGalaxy();
    updateLoad('Lighting...', 40); createLighting();
    updateLoad('Perlin Cubemap...', 55); createPerlinCubemap();
    updateLoad('Sun...', 70); createSun();
    updateLoad('Planets...', 85); Object.entries(PLANETS).forEach(([k, d]) => k !== 'sun' && createPlanet(k, d));
    updateLoad('Orbits...', 95); createOrbits();
    updateLoad('Ready!', 100);
    setTimeout(() => document.getElementById('loading').classList.add('hidden'), 500);
}

function updateLoad(s, p) {
    const st = document.getElementById('load-status'), pr = document.getElementById('load-progress');
    if (st) st.textContent = s;
    if (pr) pr.style.width = p + '%';
}

function createStarfield() {
    [[15000, 0.4, 400, 1000], [5000, 0.9, 250, 600], [1500, 1.6, 150, 400]].forEach(([c, sz, mn, mx]) => {
        const g = new THREE.BufferGeometry(), pos = new Float32Array(c * 3), col = new Float32Array(c * 3);
        for (let i = 0; i < c; i++) {
            const i3 = i * 3, r = mn + Math.random() * (mx - mn), th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
            pos[i3] = r * Math.sin(ph) * Math.cos(th);
            pos[i3 + 1] = r * Math.sin(ph) * Math.sin(th);
            pos[i3 + 2] = r * Math.cos(ph);
            const t = Math.random();
            col[i3] = 0.8 + t * 0.2;
            col[i3 + 1] = 0.85;
            col[i3 + 2] = 0.9 + (1 - t) * 0.1;
        }
        g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        g.setAttribute('color', new THREE.BufferAttribute(col, 3));
        scene.add(new THREE.Points(g, new THREE.PointsMaterial({ size: sz, vertexColors: true, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending })));
    });
}

function createGalaxy() {
    const c = 50000, g = new THREE.BufferGeometry(), pos = new Float32Array(c * 3), col = new Float32Array(c * 3);
    const clrs = [new THREE.Color(0xff6b35), new THREE.Color(0xf4c430), new THREE.Color(0x5b8dee), new THREE.Color(0xa855f7)];
    for (let i = 0; i < c; i++) {
        const i3 = i * 3, arm = i % 4, r = Math.random() * 600 + 150, spin = r * 0.002, branch = (arm / 4) * Math.PI * 2, rand = Math.pow(Math.random(), 3) * 50;
        pos[i3] = Math.cos(branch + spin) * r + (Math.random() - 0.5) * rand;
        pos[i3 + 1] = (Math.random() - 0.5) * rand * 0.15 - 250;
        pos[i3 + 2] = Math.sin(branch + spin) * r + (Math.random() - 0.5) * rand - 400;
        const cl = clrs[arm], b = 0.4 + (1 - r / 800) * 0.6;
        col[i3] = cl.r * b; col[i3 + 1] = cl.g * b; col[i3 + 2] = cl.b * b;
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    galaxy = new THREE.Points(g, new THREE.PointsMaterial({ size: 1.5, vertexColors: true, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false }));
    scene.add(galaxy);
}

function createLighting() {
    scene.add(new THREE.AmbientLight(0x111122, 0.1));
    const sunLight = new THREE.PointLight(0xfff5e0, 2.5, 500, 1.5);
    scene.add(sunLight);
}

// ============ PERLIN CUBEMAP ============
function createPerlinCubemap() {
    perlinScene = new THREE.Scene();
    cubeRT = new THREE.WebGLCubeRenderTarget(512, { format: THREE.RGBAFormat, type: THREE.UnsignedByteType, generateMipmaps: false });
    cubeCam = new THREE.CubeCamera(0.1, 100, cubeRT);
    
    perlinMat = new THREE.ShaderMaterial({
        vertexShader: perlinVS,
        fragmentShader: perlinFS,
        depthWrite: false,
        side: THREE.BackSide,
        uniforms: {
            uTime: { value: 0 },
            uSpatialFrequency: { value: 6 },
            uTemporalFrequency: { value: 0.1 },
            uH: { value: 1 },
            uContrast: { value: 0.25 },
            uFlatten: { value: 0.72 }
        }
    });
    
    const perlinBox = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), perlinMat);
    perlinScene.add(perlinBox);
}

function renderPerlinCubemap() {
    if (!cubeCam || !perlinScene) return;
    perlinMat.uniforms.uTime.value = time * 0.1;
    cubeCam.update(renderer, perlinScene);
}

// ============ SUN ============
function createSun() {
    const d = PLANETS.sun;
    const sunRadius = d.radius;
    
    sunGroup = new THREE.Group();
    sunGroup.userData = { name: 'sun', data: d };
    
    // Sun sphere
    const sunGeo = new THREE.SphereGeometry(sunRadius, 64, 64);
    sunMaterial = new THREE.ShaderMaterial({
        vertexShader: sunSphereVS,
        fragmentShader: sunSphereFS,
        transparent: true,
        premultipliedAlpha: true,
        blending: THREE.NormalBlending,
        depthWrite: true,
        uniforms: {
            uTime: { value: 0 },
            uPerlinCube: { value: cubeRT.texture },
            uFresnelPower: { value: 1.0 },
            uFresnelInfluence: { value: 0.8 },
            uTint: { value: 0.2 },
            uBase: { value: 4.0 },
            uBrightnessOffset: { value: 1 },
            uBrightness: { value: 0.6 },
            uVisibility: { value: 1 },
            uDirection: { value: 1.0 },
            uLightView: { value: lightDirWorld.clone() }
        }
    });
    
    const sunMesh = new THREE.Mesh(sunGeo, sunMaterial);
    sunMesh.userData = { name: 'sun', data: d, clickable: true };
    sunGroup.add(sunMesh);
    
    // Glow
    createGlow(sunRadius);
    
    // Sun rays
    createSunRays(sunRadius);
    
    scene.add(sunGroup);
    planets.sun = { mesh: sunMesh, group: sunGroup, data: d, angle: 0 };
    createLabel('sun', d);
}

function createGlow(sunRadius) {
    const segments = 128;
    const rSphere = sunRadius * 0.99;
    const positions = new Float32Array(3 * (2 * segments));
    let r = 0;
    for (let a = 0; a < segments; a++) {
        const s = (a / segments) * Math.PI * 2.0;
        const sx = Math.sin(s) * rSphere;
        const sy = Math.cos(s) * rSphere;
        positions[r++] = sx; positions[r++] = sy; positions[r++] = 0.0;
        positions[r++] = sx; positions[r++] = sy; positions[r++] = 1.0;
    }
    const indices = new Uint16Array(2 * segments * 3);
    let o = 0;
    for (let a = 0; a < segments; a++) {
        const i0 = 2 * a, i1 = 2 * a + 1, i2 = 2 * ((a + 1) % segments), i3 = i2 + 1;
        indices[o++] = i0; indices[o++] = i1; indices[o++] = i2;
        indices[o++] = i2; indices[o++] = i1; indices[o++] = i3;
    }
    const glowGeo = new THREE.BufferGeometry();
    glowGeo.setAttribute('aPos', new THREE.Float32BufferAttribute(positions, 3));
    glowGeo.setIndex(new THREE.BufferAttribute(indices, 1));
    
    glowMaterial = new THREE.ShaderMaterial({
        vertexShader: glowVS,
        fragmentShader: glowFS,
        transparent: true,
        premultipliedAlpha: true,
        depthWrite: false,
        depthTest: false,
        blending: THREE.NormalBlending,
        side: THREE.DoubleSide,
        uniforms: {
            uViewProjection: { value: new THREE.Matrix4() },
            uRadius: { value: 0.5 },
            uTint: { value: 0.4 },
            uBrightness: { value: 1.06 },
            uFalloffColor: { value: 0.5 },
            uCamUp: { value: new THREE.Vector3(0, 1, 0) },
            uCamPos: { value: new THREE.Vector3() },
            uVisibility: { value: 1 },
            uDirection: { value: 1.0 },
            uLightView: { value: lightDirWorld.clone() }
        }
    });
    
    const glowMesh = new THREE.Mesh(glowGeo, glowMaterial);
    glowMesh.frustumCulled = false;
    glowMesh.renderOrder = 2;
    sunGroup.add(glowMesh);
}

function createSunRays(sunRadius) {
    const lineCount = 2048, lineLength = 8;
    const vertsPerSegment = 2;
    const totalVerts = lineCount * lineLength * vertsPerSegment;
    
    const aPos = new Float32Array(totalVerts * 3);
    const aPos0 = new Float32Array(totalVerts * 3);
    const aWireRand = new Float32Array(totalVerts * 4);
    const indices = new Uint16Array(lineCount * (lineLength - 1) * 2 * 3);
    
    const base = new THREE.Vector3(), jitter = new THREE.Vector3(), held = new THREE.Vector3();
    let ip = 0, i0 = 0, ir = 0, ii = 0;
    
    const randomUnit = (v) => {
        const z = Math.random() * 2 - 1, t = Math.random() * Math.PI * 2, r = Math.sqrt(1 - z * z);
        v.set(r * Math.cos(t), r * Math.sin(t), z);
        return v;
    };
    
    let d = 0, p = 0;
    for (let v = 0; v < lineCount; v++) {
        if (Math.random() < 0.1 || v === 0) {
            randomUnit(held).normalize();
            d = Math.random();
            p = Math.random();
        }
        base.copy(held);
        randomUnit(jitter).multiplyScalar(0.025);
        base.add(jitter).normalize();
        
        const rands = [d, p, Math.random(), Math.random()];
        
        for (let m = 0; m < lineLength; m++) {
            const vertBase = 2 * (v * lineLength + m);
            for (let y = 0; y <= 1; y++) {
                aPos[ip++] = (m + 0.5) / lineLength;
                aPos[ip++] = (v + 0.5) / lineCount;
                aPos[ip++] = 2 * y - 1;
                for (let t = 0; t < 4; t++) aWireRand[ir++] = rands[t];
                aPos0[i0++] = base.x * sunRadius;
                aPos0[i0++] = base.y * sunRadius;
                aPos0[i0++] = base.z * sunRadius;
            }
            if (m < lineLength - 1) {
                const a = vertBase, b = vertBase + 1, c = vertBase + 2, dd = vertBase + 3;
                indices[ii++] = a; indices[ii++] = b; indices[ii++] = c;
                indices[ii++] = c; indices[ii++] = b; indices[ii++] = dd;
            }
        }
    }
    
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('aPos', new THREE.BufferAttribute(aPos, 3));
    geo.setAttribute('aPos0', new THREE.BufferAttribute(aPos0, 3));
    geo.setAttribute('aWireRandom', new THREE.BufferAttribute(aWireRand, 4));
    geo.setIndex(new THREE.BufferAttribute(indices, 1));
    
    sunRaysMaterial = new THREE.ShaderMaterial({
        vertexShader: sunRaysVS,
        fragmentShader: sunRaysFS,
        transparent: true,
        premultipliedAlpha: true,
        depthWrite: false,
        depthTest: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        uniforms: {
            uViewProjection: { value: new THREE.Matrix4() },
            uCamPos: { value: new THREE.Vector3() },
            uTime: { value: 0 },
            uVisibility: { value: 1 },
            uDirection: { value: 1.0 },
            uLightView: { value: lightDirWorld.clone() },
            uWidth: { value: 0.03 },
            uLength: { value: 0.45 },
            uOpacity: { value: 0.03 },
            uNoiseFrequency: { value: 8.0 },
            uNoiseAmplitude: { value: 0.4 },
            uAlphaBlended: { value: 0.3 },
            uHueSpread: { value: 0.2 },
            uHue: { value: 0.2 }
        }
    });
    
    const sunRaysMesh = new THREE.Mesh(geo, sunRaysMaterial);
    sunRaysMesh.frustumCulled = false;
    sunRaysMesh.renderOrder = 3;
    sunGroup.add(sunRaysMesh);
}

// ============ PLANETS ============
function createPlanet(key, data) {
    const gr = new THREE.Group();
    gr.userData = { name: key, data };
    
    const geo = new THREE.SphereGeometry(data.radius, 64, 64);
    const mat = new THREE.ShaderMaterial({
        uniforms: {
            uColor1: { value: new THREE.Color(data.colors[0]) },
            uColor2: { value: new THREE.Color(data.colors[1]) },
            uColor3: { value: new THREE.Color(data.colors[2]) },
            uTime: { value: 0 },
            uType: { value: data.planetType },
            uSunPosition: { value: new THREE.Vector3(0, 0, 0) },
            uAtmosphere: { value: data.atmosphere }
        },
        vertexShader: planetVS,
        fragmentShader: planetFS
    });
    
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.x = data.distance;
    mesh.userData = { name: key, data, clickable: true };
    gr.add(mesh);
    
    if (data.atmosphere > 0) {
        const ag = new THREE.SphereGeometry(data.radius * 1.1, 32, 32);
        const am = new THREE.MeshBasicMaterial({ color: data.colors[1], transparent: true, opacity: data.atmosphere * 0.2, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false });
        const atmo = new THREE.Mesh(ag, am);
        atmo.position.copy(mesh.position);
        gr.add(atmo);
        mesh.userData.atmosphere = atmo;
    }
    
    if (data.hasMoon) {
        const moon = new THREE.Mesh(new THREE.SphereGeometry(0.25, 32, 32), new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.9 }));
        moon.position.set(2, 0, 0);
        mesh.add(moon);
        mesh.userData.moon = moon;
    }
    
    if (data.hasRings) {
        const rg = new THREE.RingGeometry(3.0, 5.5, 128), rt = createRingTexture();
        const rm = new THREE.MeshBasicMaterial({ map: rt, side: THREE.DoubleSide, transparent: true, opacity: 0.85, depthWrite: false });
        const ring = new THREE.Mesh(rg, rm);
        ring.rotation.x = Math.PI / 2.2;
        ring.position.copy(mesh.position);
        gr.add(ring);
        mesh.userData.ring = ring;
    }
    
    scene.add(gr);
    planets[key] = { mesh, group: gr, data, angle: Math.random() * Math.PI * 2, mat };
    createLabel(key, data);
}

function createRingTexture() {
    const cv = document.createElement('canvas');
    cv.width = 1024; cv.height = 64;
    const ctx = cv.getContext('2d');
    [[0, 0.08, 0.2, [160, 140, 120]], [0.12, 0.4, 0.9, [200, 180, 160]], [0.4, 0.45, 0.3, [150, 130, 110]], [0.45, 0.65, 0.85, [210, 190, 170]], [0.7, 0.85, 0.6, [180, 160, 140]], [0.85, 1, 0.15, [130, 110, 90]]].forEach(([s, e, o, c]) => {
        ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${o})`;
        ctx.fillRect(s * 1024, 0, (e - s) * 1024, 64);
    });
    return new THREE.CanvasTexture(cv);
}

function createLabel(key, data) {
    const div = document.createElement('div');
    div.className = 'planet-label';
    div.textContent = data.name;
    document.body.appendChild(div);
    labels[key] = div;
}

function createOrbits() {
    Object.entries(PLANETS).forEach(([k, d]) => {
        if (k !== 'sun' && d.distance) {
            const pts = [];
            for (let i = 0; i <= 128; i++) {
                const a = (i / 128) * Math.PI * 2;
                pts.push(new THREE.Vector3(Math.cos(a) * d.distance, 0, Math.sin(a) * d.distance));
            }
            const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.15 }));
            scene.add(line);
            orbits.push(line);
        }
    });
}

// ============ ANIMATION ============
function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    
    document.getElementById('fps').textContent = Math.min(Math.round(1 / Math.max(delta, 0.001)), 999);
    
    if (state.playing) {
        time += delta * state.speed;
        
        const m = Math.floor(time / 60) % 60, s = Math.floor(time) % 60;
        document.getElementById('time').textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        
        renderPerlinCubemap();
        updateSun();
        updatePlanets();
        
        if (galaxy) galaxy.rotation.y += 0.00002 * state.speed;
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

function updateSun() {
    if (!sunMaterial) return;
    
    sunMaterial.uniforms.uTime.value = time * 0.04;
    sunMaterial.uniforms.uLightView.value.copy(lightDirWorld);
    
    // Update glow
    if (glowMaterial) {
        camera.updateMatrixWorld(true);
        camera.updateProjectionMatrix();
        const view = new THREE.Matrix4().copy(camera.matrixWorld).invert();
        const vp = new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, view);
        glowMaterial.uniforms.uViewProjection.value.copy(vp);
        const camUp = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion).normalize();
        glowMaterial.uniforms.uCamUp.value.copy(camUp);
        const camPos = new THREE.Vector3();
        camera.getWorldPosition(camPos);
        glowMaterial.uniforms.uCamPos.value.copy(camPos);
        glowMaterial.uniforms.uLightView.value.copy(lightDirWorld);
    }
    
    // Update rays
    if (sunRaysMaterial) {
        camera.updateMatrixWorld(true);
        const view = new THREE.Matrix4().copy(camera.matrixWorld).invert();
        const vp = new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, view);
        sunRaysMaterial.uniforms.uViewProjection.value.copy(vp);
        const camPos = new THREE.Vector3();
        camera.getWorldPosition(camPos);
        sunRaysMaterial.uniforms.uCamPos.value.copy(camPos);
        sunRaysMaterial.uniforms.uTime.value = time;
        sunRaysMaterial.uniforms.uLightView.value.copy(lightDirWorld);
    }
}

function updatePlanets() {
    Object.entries(planets).forEach(([k, p]) => {
        if (k === 'sun') return;
        p.angle += p.data.orbitSpeed * state.speed;
        const x = Math.cos(p.angle) * p.data.distance, z = Math.sin(p.angle) * p.data.distance;
        p.mesh.position.set(x, 0, z);
        if (p.mat) p.mat.uniforms.uTime.value = time;
        p.mesh.rotation.y += p.data.rotationSpeed * state.speed;
        if (p.mesh.userData.atmosphere) p.mesh.userData.atmosphere.position.set(x, 0, z);
        if (p.mesh.userData.ring) p.mesh.userData.ring.position.set(x, 0, z);
        if (p.mesh.userData.moon) {
            const ma = time * 0.3;
            p.mesh.userData.moon.position.set(Math.cos(ma) * 2, 0, Math.sin(ma) * 2);
        }
    });
}

function updateLabels() {
    if (!state.showLabels) { Object.values(labels).forEach(l => l.style.display = 'none'); return; }
    Object.entries(labels).forEach(([k, l]) => {
        const p = planets[k];
        if (!p) return;
        const pos = new THREE.Vector3();
        p.mesh.getWorldPosition(pos);
        pos.y += p.data.radius * 1.8;
        const scr = pos.clone().project(camera);
        if (scr.z > 1) l.style.display = 'none';
        else { l.style.display = 'block'; l.style.left = (scr.x * 0.5 + 0.5) * innerWidth + 'px'; l.style.top = (-scr.y * 0.5 + 0.5) * innerHeight + 'px'; }
    });
}

// ============ EVENTS ============
function setupEvents() {
    addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); });
    addEventListener('mousemove', e => {
        mouse.x = (e.clientX / innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const hits = raycaster.intersectObjects(Object.values(planets).map(p => p.mesh));
        const tooltip = document.getElementById('tooltip');
        if (hits.length > 0 && hits[0].object.userData.clickable) {
            document.body.classList.add('clickable');
            tooltip.classList.remove('hidden');
            tooltip.textContent = hits[0].object.userData.data.name;
            tooltip.style.left = e.clientX + 'px';
            tooltip.style.top = e.clientY + 'px';
        } else { document.body.classList.remove('clickable'); tooltip.classList.add('hidden'); }
    });
    addEventListener('click', e => {
        if (e.target.closest('#controls,#planet-popup,#header')) return;
        raycaster.setFromCamera(mouse, camera);
        const hits = raycaster.intersectObjects(Object.values(planets).map(p => p.mesh));
        if (hits.length > 0 && hits[0].object.userData.clickable) {
            const nm = hits[0].object.userData.name;
            if (nm && PLANETS[nm]) showPopup(nm, PLANETS[nm]);
        }
    });
    addEventListener('keydown', e => {
        if (e.target.tagName === 'INPUT') return;
        switch (e.key.toLowerCase()) {
            case ' ': e.preventDefault(); togglePlay(); break;
            case 'r': resetCamera(); break;
            case 'o': toggleOrbits(); break;
            case 'l': toggleLabels(); break;
            case 'm': toggleSound(); break;
            case 'escape': closePopup(); state.followTarget = null; break;
            case '0': case '1': case '2': case '3': case '4': case '5': case '6': case '7': case '8':
                const names = ['sun', 'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];
                const nm = names[parseInt(e.key)];
                if (PLANETS[nm]) showPopup(nm, PLANETS[nm]);
                break;
        }
    });
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

function showPopup(nm, d) {
    state.selectedPlanet = nm;
    document.getElementById('popup-name').textContent = d.name;
    document.getElementById('popup-type').textContent = d.type;
    document.getElementById('popup-diameter').textContent = d.diameter;
    document.getElementById('popup-distance').textContent = d.distanceFromSun;
    document.getElementById('popup-period').textContent = d.period;
    document.getElementById('popup-temp').textContent = d.temp;
    document.getElementById('popup-moons').textContent = d.moons;
    document.getElementById('popup-gravity').textContent = d.gravity;
    document.getElementById('popup-fact').textContent = d.fact;
    const c1 = d.colors[0].toString(16).padStart(6, '0'), c2 = d.colors[1].toString(16).padStart(6, '0');
    document.getElementById('popup-visual').style.background = `linear-gradient(135deg, #${c1}, #${c2})`;
    document.getElementById('planet-popup').classList.remove('hidden');
    if (state.soundEnabled) speakInfo();
}

function closePopup() { document.getElementById('planet-popup').classList.add('hidden'); if (speechSynthesis.speaking) speechSynthesis.cancel(); }

function speakInfo() {
    if (speechSynthesis.speaking) speechSynthesis.cancel();
    if (!state.selectedPlanet || !PLANETS[state.selectedPlanet]) return;
    const d = PLANETS[state.selectedPlanet];
    const txt = `${d.name}. ${d.type}. Diameter: ${d.diameter}. Distance: ${d.distanceFromSun}. Period: ${d.period}. Temperature: ${d.temp}. Moons: ${d.moons}. ${d.fact}`;
    const utt = new SpeechSynthesisUtterance(txt);
    utt.rate = 0.9;
    speechSynthesis.speak(utt);
    document.getElementById('popup-speak').classList.add('active');
    utt.onend = () => document.getElementById('popup-speak').classList.remove('active');
}

function focusOn(nm) {
    const p = planets[nm];
    if (!p) return;
    const pos = new THREE.Vector3();
    p.mesh.getWorldPosition(pos);
    const off = p.data.radius * 5 + 10;
    animateCamera(new THREE.Vector3(pos.x + off * 0.5, pos.y + off * 0.3, pos.z + off), pos);
    closePopup();
}

function animateCamera(tgt, look) {
    const sPos = camera.position.clone(), sTgt = controls.target.clone(), st = Date.now();
    (function upd() {
        const t = Math.min((Date.now() - st) / 1000, 1), e = 1 - Math.pow(1 - t, 3);
        camera.position.lerpVectors(sPos, tgt, e);
        controls.target.lerpVectors(sTgt, look, e);
        controls.update();
        if (t < 1) requestAnimationFrame(upd);
    })();
}

function togglePlay() { state.playing = !state.playing; document.getElementById('icon-pause').style.display = state.playing ? 'block' : 'none'; document.getElementById('icon-play').style.display = state.playing ? 'none' : 'block'; document.getElementById('btn-play').classList.toggle('active', state.playing); }
function resetCamera() { state.followTarget = null; animateCamera(new THREE.Vector3(30, 20, 45), new THREE.Vector3(0, 0, 0)); }
function toggleOrbits() { state.showOrbits = !state.showOrbits; orbits.forEach(o => o.visible = state.showOrbits); document.getElementById('btn-orbits').classList.toggle('active', state.showOrbits); }
function toggleLabels() { state.showLabels = !state.showLabels; document.getElementById('btn-labels').classList.toggle('active', state.showLabels); }
function toggleSound() { state.soundEnabled = !state.soundEnabled; document.getElementById('btn-sound').classList.toggle('active', state.soundEnabled); if (!state.soundEnabled && speechSynthesis.speaking) speechSynthesis.cancel(); }

init();
