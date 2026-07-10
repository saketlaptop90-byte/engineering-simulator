import * as THREE from 'three';

export function createMachine(scene) {
    const group = new THREE.Group();
    

    // Materials
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x778899, metalness: 0.8, roughness: 0.2, side: THREE.DoubleSide });
    const darkMetalMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.6, roughness: 0.7 });
    const waterMat = new THREE.MeshPhysicalMaterial({ color: 0x00aaff, transmission: 0.9, transparent: true, opacity: 0.7, roughness: 0.1 });

    // Casing (Volute) - cutaway view
    const casingGeom = new THREE.CylinderGeometry(4, 4, 2, 32, 1, false, 0, Math.PI);
    const casing = new THREE.Mesh(casingGeom, metalMat);
    casing.rotation.x = Math.PI / 2;
    group.add(casing);

    // Discharge Nozzle
    const nozzleGeom = new THREE.CylinderGeometry(1, 1, 3, 16);
    nozzleGeom.translate(0, 1.5, 0);
    const nozzle = new THREE.Mesh(nozzleGeom, metalMat);
    nozzle.position.set(0, 4, 0);
    group.add(nozzle);

    // Suction Pipe (Eye of impeller)
    const suctionGeom = new THREE.CylinderGeometry(1.5, 1.5, 3, 16, 1, true, Math.PI, Math.PI);
    suctionGeom.rotateX(Math.PI / 2);
    const suction = new THREE.Mesh(suctionGeom, metalMat);
    suction.position.set(0, 0, 1.5);
    group.add(suction);

    // Impeller
    const impeller = new THREE.Group();
    group.add(impeller);
    
    const hubGeom = new THREE.CylinderGeometry(0.8, 1.2, 0.5, 16);
    hubGeom.rotateX(Math.PI / 2);
    const hub = new THREE.Mesh(hubGeom, darkMetalMat);
    impeller.add(hub);

    // Blades
    const numBlades = 6;
    for (let i = 0; i < numBlades; i++) {
        // Curve the blade backward
        const shape = new THREE.Shape();
        shape.moveTo(1, -0.1);
        shape.quadraticCurveTo(2.5, 0.5, 3.5, 0.2);
        shape.lineTo(3.5, -0.2);
        shape.quadraticCurveTo(2.5, 0.1, 1, -0.5);
        shape.lineTo(1, -0.1);

        const extrudeSettings = { depth: 1, bevelEnabled: false };
        const bladeGeom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        bladeGeom.translate(0, 0, -0.5); // Center on Z

        const blade = new THREE.Mesh(bladeGeom, darkMetalMat);
        blade.rotation.z = (i / numBlades) * Math.PI * 2;
        impeller.add(blade);
    }

    // Water Particles System
    const numParticles = 300;
    const pGeom = new THREE.BufferGeometry();
    const pPos = new Float32Array(numParticles * 3);
    const pVel = [];
    
    // Initial placement at suction
    for(let i=0; i<numParticles; i++) {
        pPos[i*3] = (Math.random() - 0.5) * 2;
        pPos[i*3+1] = (Math.random() - 0.5) * 2;
        pPos[i*3+2] = 2 + Math.random() * 2; // In suction pipe
        
        pVel.push(new THREE.Vector3(0, 0, -5)); // Moving into the eye
    }
    
    pGeom.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMaterial = new THREE.PointsMaterial({ color: 0x00ffff, size: 0.3, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
    const waterParticles = new THREE.Points(pGeom, pMaterial);
    group.add(waterParticles);

    // Labels
    const createLabel = (text, pos, color) => {
        const canvas = document.createElement('canvas');
        canvas.width = 256; canvas.height = 64;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = color;
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(text, 128, 40);
        const tex = new THREE.CanvasTexture(canvas);
        const spriteMat = new THREE.SpriteMaterial({ map: tex, transparent: true });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.position.copy(pos);
        sprite.scale.set(3, 0.75, 1);
        group.add(sprite);
    };

    createLabel("Suction (Inlet)", new THREE.Vector3(0, 2, 4), "cyan");
    createLabel("Impeller", new THREE.Vector3(4, 2, 0), "white");
    createLabel("Discharge Nozzle", new THREE.Vector3(0, 7, 0), "cyan");
    createLabel("Volute Casing", new THREE.Vector3(-4, -2, 0), "white");

    group.userData.animate = (delta) => {
        // Spin impeller (Clockwise)
        impeller.rotation.z -= delta * 10;
        
        // Fluid simulation
        const pos = waterParticles.geometry.attributes.position.array;
        
        for (let i = 0; i < numParticles; i++) {
            const ix = i * 3;
            const px = pos[ix];
            const py = pos[ix+1];
            const pz = pos[ix+2];
            
            const r = Math.sqrt(px*px + py*py);
            
            if (pz > 0) {
                // In suction pipe, move -Z
                pos[ix+2] -= delta * 5;
            } else if (r < 3.8 && py < 4) {
                // In impeller, accelerate radially and tangentially
                const angle = Math.atan2(py, px);
                // Angular velocity matches impeller, radial velocity increases with radius
                const vT = 10; 
                const vR = 5 * (r + 0.1);
                
                pos[ix] += (Math.cos(angle)*vR - Math.sin(angle)*vT) * delta;
                pos[ix+1] += (Math.sin(angle)*vR + Math.cos(angle)*vT) * delta;
                // keep flat in z
                pos[ix+2] *= 0.9;
            } else {
                // In volute/discharge, move up (+Y)
                if (px < 1 && px > -1 && py > 3) {
                    pos[ix+1] += delta * 15; // Shoot up nozzle
                } else {
                    // Guide towards nozzle
                    if (px > 0) pos[ix] -= delta * 5;
                    else pos[ix] += delta * 5;
                    pos[ix+1] += delta * 5;
                }
            }
            
            // Reset particle if it shoots out
            if (pos[ix+1] > 8) {
                pos[ix] = (Math.random() - 0.5) * 2;
                pos[ix+1] = (Math.random() - 0.5) * 2;
                pos[ix+2] = 2 + Math.random() * 2;
            }
        }
        waterParticles.geometry.attributes.position.needsUpdate = true;
    };

    return group;
}

// Auto-generated missing stub
export function createCentrifugalPump() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
