import * as THREE from 'three';

export function createMachine(scene) {
    const group = new THREE.Group();
    

    // Laser Source
    const laserGeom = new THREE.CylinderGeometry(0.2, 0.2, 1, 16);
    laserGeom.rotateZ(Math.PI / 2);
    const laser = new THREE.Mesh(laserGeom, new THREE.MeshStandardMaterial({ color: 0x222222 }));
    laser.position.set(-6, 0, 0);
    group.add(laser);

    // Slit Barrier
    const barrierMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    
    // Top, Middle, Bottom parts of the barrier to create two slits
    const bTop = new THREE.Mesh(new THREE.BoxGeometry(0.1, 3, 2), barrierMat);
    bTop.position.set(0, 2, 0);
    group.add(bTop);
    
    const bMid = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.5, 2), barrierMat);
    bMid.position.set(0, 0, 0);
    group.add(bMid);
    
    const bBot = new THREE.Mesh(new THREE.BoxGeometry(0.1, 3, 2), barrierMat);
    bBot.position.set(0, -2, 0);
    group.add(bBot);

    // Screen
    const screenGeom = new THREE.PlaneGeometry(6, 4);
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
    const screen = new THREE.Mesh(screenGeom, screenMat);
    screen.rotation.y = -Math.PI / 2;
    screen.position.set(6, 0, 0);
    group.add(screen);

    // Dynamic texture for interference pattern
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    const tex = new THREE.CanvasTexture(canvas);
    screen.material.map = tex;

    // Incoming waves (from laser to slits)
    const waveGroup = new THREE.Group();
    group.add(waveGroup);
    
    const waveMat = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.3 });
    const waveGeom = new THREE.PlaneGeometry(0.1, 4);
    waveGeom.rotateY(Math.PI / 2);

    const waves = [];
    let emitTimer = 0;
    const waveSpeed = 2;
    const frequency = 0.5;

    // Draw interference pattern on the screen
    const drawInterference = (time) => {
        const imgData = ctx.createImageData(512, 256);
        const slit1Y = 0.75 * (256/4); // approx pos on screen coords
        const slit2Y = -0.75 * (256/4);
        
        for (let y = 0; y < 256; y++) {
            const dy1 = y - (128 - slit1Y);
            const dy2 = y - (128 - slit2Y);
            
            // Path length difference calculation
            const d = 6; // distance to screen
            const l1 = Math.sqrt(d*d + (dy1/10)*(dy1/10));
            const l2 = Math.sqrt(d*d + (dy2/10)*(dy2/10));
            
            // Wavelength
            const lambda = 0.5;
            const phase1 = (l1 / lambda) * Math.PI * 2 - (time * 10);
            const phase2 = (l2 / lambda) * Math.PI * 2 - (time * 10);
            
            // Superposition
            const amp = Math.cos(phase1) + Math.cos(phase2);
            const intensity = (amp * amp) * 32; // Square of amplitude
            
            for (let x = 0; x < 512; x++) {
                const idx = (y * 512 + x) * 4;
                imgData.data[idx] = Math.min(255, intensity); // R
                imgData.data[idx+1] = 0; // G
                imgData.data[idx+2] = 0; // B
                imgData.data[idx+3] = 255; // A
            }
        }
        ctx.putImageData(imgData, 0, 0);
        tex.needsUpdate = true;
    };

    // Labels
    const createLabel = (text, pos, color) => {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = color;
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(text, 128, 40);
        
        const tex = new THREE.CanvasTexture(canvas);
        const spriteMat = new THREE.SpriteMaterial({ map: tex, transparent: true });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.position.copy(pos);
        sprite.scale.set(2, 0.5, 1);
        group.add(sprite);
    };

    createLabel("Laser Source", new THREE.Vector3(-6, 2, 0), "white");
    createLabel("Double Slit Barrier", new THREE.Vector3(0, 4, 0), "white");
    createLabel("Interference Screen", new THREE.Vector3(6, 3, 0), "white");

    let totalTime = 0;

    group.userData.animate = (delta) => {
        totalTime += delta;
        
        // Emit planar waves
        emitTimer += delta;
        if (emitTimer > frequency) {
            emitTimer = 0;
            const wave = new THREE.Mesh(waveGeom, waveMat);
            wave.position.set(-6, 0, 0);
            waveGroup.add(wave);
            waves.push(wave);
        }

        // Move planar waves
        for (let i = waves.length - 1; i >= 0; i--) {
            const w = waves[i];
            w.position.x += waveSpeed * delta;
            
            // Fade as they hit the barrier
            if (w.position.x > -1) {
                w.material.opacity -= delta;
            }

            if (w.position.x > 0) {
                waveGroup.remove(w);
                waves.splice(i, 1);
            }
        }

        // Draw interference on screen
        drawInterference(totalTime);
    };

    return group;
}
