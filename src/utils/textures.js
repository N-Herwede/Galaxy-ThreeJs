import * as THREE from 'three';

export function createGlowTexture(c1, c2) {
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

export function createPlanetTexture(key, data) {
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

export function createCloudTexture() {
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

export function createRingTexture() {
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

export function createNebulaTexture(baseColor) {
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

export function createProminenceTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const grad = ctx.createLinearGradient(0, canvas.height, 0, 0);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(0.2, 'rgba(255,160,70,0.25)');
    grad.addColorStop(0.55, 'rgba(255,120,40,0.6)');
    grad.addColorStop(1, 'rgba(255,220,150,0.85)');
    ctx.fillStyle = grad;

    ctx.beginPath();
    ctx.moveTo(64, 256);
    ctx.quadraticCurveTo(18, 190, 40, 40);
    ctx.quadraticCurveTo(64, 10, 88, 40);
    ctx.quadraticCurveTo(110, 190, 64, 256);
    ctx.closePath();
    ctx.fill();

    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.moveTo(64, 256);
    ctx.quadraticCurveTo(30, 200, 54, 70);
    ctx.quadraticCurveTo(64, 45, 74, 70);
    ctx.quadraticCurveTo(98, 200, 64, 256);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;

    return new THREE.CanvasTexture(canvas);
}

export function createNoiseTexture() {
    const size = 256;
    const data = new Uint8Array(size * size * 4);

    for (let i = 0; i < size * size * 4; i++) {
        data[i] = Math.random() * 255;
    }

    const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.needsUpdate = true;
    return tex;
}
