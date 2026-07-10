import * as THREE from 'three';

export function createMachine(scene) {
    const group = new THREE.Group();
    

    // Iron Core (Laminated square loop)
    const coreMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.6, roughness: 0.6 });
    
    // Left leg
    const leftLeg = new THREE.Mesh(new THREE.BoxGeometry(2, 8, 2), coreMat);
    leftLeg.position.set(-4, 0, 0);
    group.add(leftLeg);
    
    // Right leg
    const rightLeg = new THREE.Mesh(new THREE.BoxGeometry(2, 8, 2), coreMat);
    rightLeg.position.set(4, 0, 0);
    group.add(rightLeg);
    
    // Top yoke
    const topYoke = new THREE.Mesh(new THREE.BoxGeometry(10, 2, 2), coreMat);
    topYoke.position.set(0, 3, 0);
    group.add(topYoke);
    
    // Bottom yoke
    const botYoke = new THREE.Mesh(new THREE.BoxGeometry(10, 2, 2), coreMat);
    botYoke.position.set(0, -3, 0);
    group.add(botYoke);

    // Copper Wire Material
    const wireMat = new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.8, roughness: 0.3 });

    // Primary Coil (N1) - Fewer turns
    const pTurns = 10;
    for(let i=0; i<pTurns; i++) {
        const torusGeom = new THREE.TorusGeometry(1.6, 0.2, 16, 32);
        torusGeom.rotateX(Math.PI/2);
        const loop = new THREE.Mesh(torusGeom, wireMat);
        loop.position.set(-4, -2.5 + (i * 0.5), 0);
        group.add(loop);
    }
    
    // Secondary Coil (N2) - More turns (Step-up transformer)
    const sTurns = 20;
    for(let i=0; i<sTurns; i++) {
        const torusGeom = new THREE.TorusGeometry(1.6, 0.15, 16, 32);
        torusGeom.rotateX(Math.PI/2);
        const loop = new THREE.Mesh(torusGeom, wireMat);
        loop.position.set(4, -2.5 + (i * 0.25), 0);
        group.add(loop);
    }

    // Magnetic Flux Visualization
    const fluxPoints = [];
    // Rectangle path through the core
    fluxPoints.push(new THREE.Vector3(-4, -3, 0));
    fluxPoints.push(new THREE.Vector3(-4, 3, 0));
    fluxPoints.push(new THREE.Vector3(4, 3, 0));
    fluxPoints.push(new THREE.Vector3(4, -3, 0));
    fluxPoints.push(new THREE.Vector3(-4, -3, 0)); // close loop
    
    const fluxCurve = new THREE.CatmullRomCurve3(fluxPoints, true, 'catmullrom', 0);
    
    const fluxParticles = new THREE.Group();
    group.add(fluxParticles);
    
    const fGeom = new THREE.SphereGeometry(0.2, 8, 8);
    const fMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.6 });
    
    const fluxArray = [];
    for(let i=0; i<30; i++) {
        const f = new THREE.Mesh(fGeom, fMat);
        fluxParticles.add(f);
        fluxArray.push({ mesh: f, progress: i/30 });
    }

    // Meters Display
    const createMeter = (text, valText, pos) => {
        const canvas = document.createElement('canvas');
        canvas.width = 256; canvas.height = 128;
        const ctx = canvas.getContext('2d');
        const tex = new THREE.CanvasTexture(canvas);
        const plane = new THREE.Mesh(new THREE.PlaneGeometry(3, 1.5), new THREE.MeshBasicMaterial({ map: tex }));
        plane.position.copy(pos);
        group.add(plane);
        
        return { canvas, ctx, tex };
    };

    const meter1 = createMeter("Primary (Input)", "120 V", new THREE.Vector3(-8, 0, 0));
    const meter2 = createMeter("Secondary (Output)", "240 V", new THREE.Vector3(8, 0, 0));

    const updateMeter = (meter, title, val) => {
        meter.ctx.fillStyle = '#222';
        meter.ctx.fillRect(0,0,256,128);
        meter.ctx.strokeStyle = '#555';
        meter.ctx.lineWidth = 4;
        meter.ctx.strokeRect(0,0,256,128);
        
        meter.ctx.fillStyle = 'white';
        meter.ctx.font = '24px Arial';
        meter.ctx.textAlign = 'center';
        meter.ctx.fillText(title, 128, 30);
        
        meter.ctx.fillStyle = '#00ff00';
        meter.ctx.font = 'bold 48px monospace';
        meter.ctx.fillText(val, 128, 90);
        
        meter.tex.needsUpdate = true;
    };

    let time = 0;

    // Labels
    const createLabel = (text, pos, color) => {
        const lcan = document.createElement('canvas');
        lcan.width = 256; lcan.height = 64;
        const lctx = lcan.getContext('2d');
        lctx.fillStyle = color;
        lctx.font = 'bold 24px Arial';
        lctx.textAlign = 'center';
        lctx.fillText(text, 128, 40);
        const tex = new THREE.CanvasTexture(lcan);
        const spriteMat = new THREE.SpriteMaterial({ map: tex, transparent: true });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.position.copy(pos);
        sprite.scale.set(3, 0.75, 1);
        group.add(sprite);
    };

    createLabel("Iron Core", new THREE.Vector3(0, 5, 0), "white");
    createLabel("Primary Coil (N=10)", new THREE.Vector3(-4, -4, 0), "orange");
    createLabel("Secondary Coil (N=20)", new THREE.Vector3(4, -4, 0), "orange");
    createLabel("Magnetic Flux", new THREE.Vector3(0, 0, 1), "lightgreen");

    group.userData.animate = (delta) => {
        time += delta;
        
        // AC frequency
        const freq = 2; // Hz
        const phase = time * Math.PI * 2 * freq;
        
        // Voltage
        const vIn = 120 * Math.sin(phase);
        const vOut = 240 * Math.sin(phase); // Step-up 1:2 ratio
        
        updateMeter(meter1, "Primary (N=10)", Math.abs(Math.round(vIn)) + " V");
        updateMeter(meter2, "Secondary (N=20)", Math.abs(Math.round(vOut)) + " V");
        
        // Flux direction oscillates
        const fluxSpeed = Math.cos(phase) * 1.5; 
        
        fluxArray.forEach(f => {
            f.progress += delta * fluxSpeed;
            if(f.progress > 1) f.progress -= 1;
            if(f.progress < 0) f.progress += 1;
            
            const pt = fluxCurve.getPointAt(f.progress);
            f.mesh.position.copy(pt);
            
            // Pulse opacity based on strength
            f.mesh.material.opacity = 0.2 + 0.8 * Math.abs(Math.cos(phase));
        });
    };

    return group;
}
