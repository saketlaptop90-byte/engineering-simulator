import * as THREE from 'three';

export function createMachine(scene) {
    const group = new THREE.Group();
    

    // Apparatus Chamber
    const chamberMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.7, roughness: 0.3, transparent: true, opacity: 0.2, depthWrite: false });
    
    // Ionization Chamber
    const ionizer = new THREE.Mesh(new THREE.BoxGeometry(3, 4, 3), chamberMat);
    ionizer.position.set(-8, 0, 0);
    group.add(ionizer);
    
    // Accelerator (Plates)
    const plateGeom = new THREE.BoxGeometry(0.2, 3, 2);
    const plateMat1 = new THREE.MeshStandardMaterial({ color: 0xff4444 }); // Positive
    const plateMat2 = new THREE.MeshStandardMaterial({ color: 0x4444ff }); // Negative
    
    const p1 = new THREE.Mesh(plateGeom, plateMat1);
    p1.position.set(-6, 0, 0);
    group.add(p1);
    
    const p2 = new THREE.Mesh(plateGeom, plateMat2);
    p2.position.set(-4, 0, 0);
    group.add(p2);

    // Magnetic Sector (Curve)
    const magMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8 });
    const magnetTop = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 0.5, 32, 1, false, 0, Math.PI), magMat);
    magnetTop.position.set(0, 2, 0);
    group.add(magnetTop);
    
    const magnetBot = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 0.5, 32, 1, false, 0, Math.PI), magMat);
    magnetBot.position.set(0, -2, 0);
    group.add(magnetBot);

    // Detector Array
    const detGeom = new THREE.BoxGeometry(1, 6, 4);
    const detMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const detector = new THREE.Mesh(detGeom, detMat);
    detector.position.set(4, -4, 0);
    detector.rotation.z = Math.PI / 4;
    group.add(detector);

    // Screen
    const createScreen = (text, pos, color) => {
        const canvas = document.createElement('canvas');
        canvas.width = 256; canvas.height = 128;
        const ctx = canvas.getContext('2d');
        const tex = new THREE.CanvasTexture(canvas);
        const plane = new THREE.Mesh(new THREE.PlaneGeometry(4, 2), new THREE.MeshBasicMaterial({ map: tex }));
        plane.position.copy(pos);
        group.add(plane);
        
        return { canvas, ctx, tex };
    };

    const graph = createScreen("Mass Spectrum", new THREE.Vector3(8, 4, 0));
    
    // Graph Data
    const bins = { light: 0, medium: 0, heavy: 0 };
    
    const updateGraph = () => {
        graph.ctx.fillStyle = '#111';
        graph.ctx.fillRect(0,0,256,128);
        graph.ctx.strokeStyle = '#555';
        graph.ctx.lineWidth = 2;
        graph.ctx.strokeRect(0,0,256,128);
        
        graph.ctx.fillStyle = '#0f0';
        graph.ctx.font = '16px monospace';
        graph.ctx.fillText("Mass Spectrum", 10, 20);
        
        // Draw bars
        const max = Math.max(1, bins.light, bins.medium, bins.heavy);
        
        graph.ctx.fillStyle = 'red';
        graph.ctx.fillRect(40, 110 - (bins.heavy/max)*80, 30, (bins.heavy/max)*80);
        
        graph.ctx.fillStyle = 'green';
        graph.ctx.fillRect(110, 110 - (bins.medium/max)*80, 30, (bins.medium/max)*80);
        
        graph.ctx.fillStyle = 'cyan';
        graph.ctx.fillRect(180, 110 - (bins.light/max)*80, 30, (bins.light/max)*80);
        
        graph.ctx.fillStyle = 'white';
        graph.ctx.fillText("Heavy", 35, 125);
        graph.ctx.fillText("Med", 110, 125);
        graph.ctx.fillText("Light", 180, 125);
        
        graph.tex.needsUpdate = true;
    };
    updateGraph();

    // Particles
    const particles = [];
    const pGroup = new THREE.Group();
    group.add(pGroup);
    
    const pGeom = new THREE.SphereGeometry(0.15, 8, 8);
    const pMatLight = new THREE.MeshBasicMaterial({ color: 0x00ffff });
    const pMatMed = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const pMatHeavy = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    let emitTimer = 0;

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

    createLabel("Ionization Chamber", new THREE.Vector3(-8, 3, 0), "white");
    createLabel("Acceleration Grid", new THREE.Vector3(-5, -2, 0), "cyan");
    createLabel("Magnetic Field (B)", new THREE.Vector3(0, 3, 0), "orange");
    createLabel("Detector", new THREE.Vector3(4, -6, 0), "lightgreen");

    group.userData.animate = (delta) => {
        emitTimer += delta;
        if(emitTimer > 0.3) {
            emitTimer = 0;
            // Emit a particle (random mass)
            const typeRand = Math.random();
            let pMat, mass, typeStr;
            if (typeRand < 0.33) { pMat = pMatLight; mass = 1; typeStr = 'light'; }
            else if (typeRand < 0.66) { pMat = pMatMed; mass = 2; typeStr = 'medium'; }
            else { pMat = pMatHeavy; mass = 3; typeStr = 'heavy'; }
            
            const p = new THREE.Mesh(pGeom, pMat);
            // Start at ionizer
            p.position.set(-8, (Math.random()-0.5)*1, (Math.random()-0.5)*1);
            p.userData = { vel: new THREE.Vector3(2, 0, 0), mass: mass, type: typeStr };
            pGroup.add(p);
            particles.push(p);
        }
        
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            
            // Physics logic
            if (p.position.x > -6 && p.position.x < -4) {
                // Acceleration
                p.userData.vel.x += delta * 15; 
            } else if (p.position.x > -2 && p.position.x < 3 && p.position.y > -3) {
                // Magnetic Field (deflects downwards, proportional to 1/m)
                // Lorentz force logic: curve downwards
                const forceMag = 15;
                const acceleration = forceMag / p.userData.mass;
                
                // Curve by rotating velocity vector
                const angle = -acceleration * delta;
                p.userData.vel.applyAxisAngle(new THREE.Vector3(0,0,1), angle);
            }
            
            p.position.addScaledVector(p.userData.vel, delta);
            
            // Detect hit on detector
            // Detector is rotated, rough bounding box check
            if (p.position.y < -2 && p.position.x > 1 && p.position.x < 7) {
                bins[p.userData.type]++;
                updateGraph();
                pGroup.remove(p);
                particles.splice(i, 1);
            } else if (p.position.x > 10 || p.position.y < -10) {
                pGroup.remove(p);
                particles.splice(i, 1);
            }
        }
    };

    return group;
}
