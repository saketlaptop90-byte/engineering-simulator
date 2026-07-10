import * as THREE from 'three';

export function createMachine(scene) {
    const group = new THREE.Group();
    

    // Common materials
    const silverMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9, roughness: 0.1 });
    const glassMat = new THREE.MeshPhysicalMaterial({ color: 0x88ccff, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1, ior: 1.5 });
    const beamMat = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending });
    const screenMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.9 });

    // Components
    // 1. Light Source (Laser)
    const laserGeom = new THREE.CylinderGeometry(0.2, 0.2, 1, 16);
    laserGeom.rotateZ(Math.PI / 2);
    const laser = new THREE.Mesh(laserGeom, new THREE.MeshStandardMaterial({ color: 0x222222 }));
    laser.position.set(-4, 0, 0);
    group.add(laser);

    // 2. Beam Splitter (Half-silvered mirror)
    const splitterGeom = new THREE.BoxGeometry(0.1, 1.5, 1.5);
    const splitter = new THREE.Mesh(splitterGeom, glassMat);
    splitter.rotation.y = Math.PI / 4;
    group.add(splitter);

    // 3. Mirror 1 (Fixed, top)
    const mirror1Geom = new THREE.BoxGeometry(1.5, 0.1, 1.5);
    const mirror1 = new THREE.Mesh(mirror1Geom, silverMat);
    mirror1.position.set(0, 3, 0);
    group.add(mirror1);

    // 4. Mirror 2 (Movable, right)
    const mirror2Geom = new THREE.BoxGeometry(0.1, 1.5, 1.5);
    const mirror2 = new THREE.Mesh(mirror2Geom, silverMat);
    mirror2.position.set(3, 0, 0);
    group.add(mirror2);

    // 5. Detector Screen (bottom)
    const screenGeometry = new THREE.PlaneGeometry(2, 2);
    const detector = new THREE.Mesh(screenGeometry, screenMat);
    detector.rotation.x = -Math.PI / 2;
    detector.position.set(0, -3, 0);
    group.add(detector);

    // Beams (cylinders to represent lasers)
    const beams = new THREE.Group();
    group.add(beams);

    const createBeam = (l, pos, rot) => {
        const geom = new THREE.CylinderGeometry(0.05, 0.05, l, 8);
        const mesh = new THREE.Mesh(geom, beamMat);
        mesh.position.copy(pos);
        if (rot) mesh.rotation.copy(rot);
        beams.add(mesh);
        return mesh;
    };

    // Source to Splitter
    createBeam(4, new THREE.Vector3(-2, 0, 0), new THREE.Euler(0, 0, Math.PI / 2));
    
    // Splitter to Mirror 1 (and back)
    createBeam(3, new THREE.Vector3(0, 1.5, 0), new THREE.Euler(0, 0, 0));
    
    // Splitter to Mirror 2 (and back)
    const m2Beam = createBeam(3, new THREE.Vector3(1.5, 0, 0), new THREE.Euler(0, 0, Math.PI / 2));
    
    // Splitter to Detector
    createBeam(3, new THREE.Vector3(0, -1.5, 0), new THREE.Euler(0, 0, 0));

    // Interference Pattern on screen
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    const tex = new THREE.CanvasTexture(canvas);
    detector.material.map = tex;
    detector.material.needsUpdate = true;

    // We will attach an input to change this value
    let mirrorOffset = 0;
    
    const drawInterference = (phaseOffset) => {
        const cx = 128, cy = 128;
        const imgData = ctx.createImageData(256, 256);
        
        for (let y = 0; y < 256; y++) {
            for (let x = 0; x < 256; x++) {
                const dx = x - cx;
                const dy = y - cy;
                const r = Math.sqrt(dx*dx + dy*dy);
                
                // Constructive / destructive based on phase and radius
                const intensity = (Math.cos(r * 0.2 - phaseOffset) + 1) * 127.5;
                
                const idx = (y * 256 + x) * 4;
                imgData.data[idx] = intensity; // R
                imgData.data[idx+1] = 0; // G
                imgData.data[idx+2] = 0; // B
                imgData.data[idx+3] = 255; // A
            }
        }
        ctx.putImageData(imgData, 0, 0);
        tex.needsUpdate = true;
    };

    drawInterference(0);

    // Text labels
    const createLabel = (text, pos) => {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
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

    createLabel("Laser Source", new THREE.Vector3(-4, 1, 0));
    createLabel("Beam Splitter", new THREE.Vector3(-1.5, 1.5, 0));
    createLabel("Fixed Mirror", new THREE.Vector3(0, 3.5, 0));
    createLabel("Movable Mirror", new THREE.Vector3(3, 1, 0));
    createLabel("Detector Screen", new THREE.Vector3(0, -3.5, 0));

    let time = 0;
    let targetPhase = 0;
    let currentPhase = 0;

    // Simulate time passing to shift interference organically
    group.userData.animate = (delta) => {
        time += delta;
        
        // Pulse the beam opacity slightly
        beamMat.opacity = 0.5 + Math.sin(time * 10) * 0.1;

        // Auto-shift the phase slowly if we want, or just let time drive it
        targetPhase = time * 2; 
        currentPhase += (targetPhase - currentPhase) * 0.1;
        
        drawInterference(currentPhase);
    };

    return group;
}

// Auto-generated missing stub
export function createMichelsonInterferometer() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
