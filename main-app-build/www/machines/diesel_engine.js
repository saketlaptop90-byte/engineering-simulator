import * as THREE from 'three';

export function createMachine() {
    const group = new THREE.Group();

    // --- 1. Engine Block (Cutaway) ---
    // Diesel engines are heavier and thicker to withstand higher compression ratios
    const cylinderGeo = new THREE.CylinderGeometry(1.5, 1.5, 4, 32, 1, true, 0, Math.PI); 
    const blockMat = new THREE.MeshStandardMaterial({ color: 0x666666, metalness: 0.8, roughness: 0.4, side: THREE.DoubleSide });
    const block = new THREE.Mesh(cylinderGeo, blockMat);
    block.rotation.y = Math.PI / 2;
    group.add(block);

    // --- 2. Piston & Crankshaft ---
    const pistonGroup = new THREE.Group();
    group.add(pistonGroup);

    // Flat-topped piston typical of diesel
    const pistonGeo = new THREE.CylinderGeometry(1.48, 1.48, 1.5, 32);
    const pistonMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.9, roughness: 0.3 });
    const piston = new THREE.Mesh(pistonGeo, pistonMat);
    pistonGroup.add(piston);

    const rodGeo = new THREE.CylinderGeometry(0.3, 0.3, 3, 16);
    const rod = new THREE.Mesh(rodGeo, blockMat);
    rod.position.y = -2;
    pistonGroup.add(rod);

    // --- 3. Valves & Injector ---
    const valveGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 16);
    const stemGeo = new THREE.CylinderGeometry(0.05, 0.05, 1, 8);
    const valveMat = new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.8 });

    const intakeValve = new THREE.Group();
    const ivHead = new THREE.Mesh(valveGeo, valveMat);
    const ivStem = new THREE.Mesh(stemGeo, valveMat);
    ivStem.position.y = 0.5;
    intakeValve.add(ivHead);
    intakeValve.add(ivStem);
    intakeValve.position.set(-0.8, 2, 0);
    group.add(intakeValve);

    const exhaustValve = new THREE.Group();
    const evHead = new THREE.Mesh(valveGeo, valveMat);
    const evStem = new THREE.Mesh(stemGeo, valveMat);
    evStem.position.y = 0.5;
    exhaustValve.add(evHead);
    exhaustValve.add(evStem);
    exhaustValve.position.set(0.8, 2, 0);
    group.add(exhaustValve);

    // Fuel Injector (replaces spark plug)
    const injectorGeo = new THREE.CylinderGeometry(0.15, 0.05, 0.8, 16);
    const injectorMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const injector = new THREE.Mesh(injectorGeo, injectorMat);
    injector.position.set(0, 2.3, 0);
    injector.userData = { id: 'fuel_injector', name: 'Direct Fuel Injector', description: 'Sprays atomized diesel fuel directly into the highly compressed, superheated air, causing instant spontaneous combustion without a spark.' };
    group.add(injector);

    // --- 4. Particles (Air, Fuel, Exhaust) ---
    const particleCount = 250;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    const pColor = new Float32Array(particleCount * 3);
    const pType = new Float32Array(particleCount); // 0: off, 1: air, 2: combusting, 3: exhaust, 4: injected fuel

    for(let i=0; i<particleCount; i++){
        pPos[i*3] = (Math.random()-0.5) * 2.8;
        pPos[i*3+1] = 0; 
        pPos[i*3+2] = (Math.random()-0.5) * 1.5;
        pType[i] = 1; // start as air
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pColor, 3));
    pGeo.setAttribute('pType', new THREE.BufferAttribute(pType, 1));

    const pMat = new THREE.PointsMaterial({ size: 0.15, vertexColors: true, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
    const particles = new THREE.Points(pGeo, pMat);
    group.add(particles);

    // --- 5. Animation (Diesel Cycle) ---
    let crankAngle = 0; 
    let stroke = 0; // 0: Intake, 1: Compression, 2: Power, 3: Exhaust

    group.userData.animate = function(delta) {
        // Slow RPM (diesels rev lower)
        const rpm = 90; 
        const angularVelocity = (rpm / 60) * Math.PI * 2;
        
        crankAngle += angularVelocity * delta;
        if (crankAngle >= Math.PI * 2) {
            crankAngle -= Math.PI * 2;
            stroke = (stroke + 1) % 4;
        }

        // High Compression Ratio (piston goes higher)
        // Range: 1.8 (TDC) to -1.2 (BDC)
        const pistonY = 0.3 + Math.cos(crankAngle) * 1.5; 
        pistonGroup.position.y = pistonY;

        // Valve Logic
        if (stroke === 0) { // Intake (AIR ONLY)
            intakeValve.position.y = 1.6; 
            exhaustValve.position.y = 2.0; 
        } else if (stroke === 3) { // Exhaust
            intakeValve.position.y = 2.0; 
            exhaustValve.position.y = 1.6; 
        } else { // Compression and Power
            intakeValve.position.y = 2.0;
            exhaustValve.position.y = 2.0;
        }

        // Particle Logic
        const pos = particles.geometry.attributes.position.array;
        const col = particles.geometry.attributes.color.array;
        const type = particles.geometry.attributes.pType.array;
        
        for(let i=0; i<particleCount; i++){
            const bottomY = pistonY + 0.8;
            const topY = 2.0;
            const height = topY - bottomY;

            if (stroke === 0) {
                // Intake: PURE AIR ONLY (White)
                type[i] = 1;
                col[i*3] = 0.9; col[i*3+1] = 0.9; col[i*3+2] = 1.0;
                pos[i*3+1] = topY - (Math.random() * height);
            } 
            else if (stroke === 1) {
                // Compression: Air heats up tremendously (turns orange/red)
                const tempColor = 1.0 - (crankAngle / (Math.PI)); // fades to red
                col[i*3] = 1.0; col[i*3+1] = tempColor; col[i*3+2] = tempColor * 0.5;
                pos[i*3+1] = bottomY + (Math.random() * height);
            } 
            else if (stroke === 2) {
                // Power (Combustion)
                if (crankAngle < 0.3) {
                    // Injecting fuel (Greenish/yellow spray from top center)
                    if (i % 5 === 0) { // subset are fuel
                        type[i] = 4;
                        col[i*3] = 0.8; col[i*3+1] = 1.0; col[i*3+2] = 0.2;
                        pos[i*3] = (Math.random()-0.5) * 0.5; // narrow cone
                        pos[i*3+1] = topY - (Math.random() * 0.5); 
                        pos[i*3+2] = (Math.random()-0.5) * 0.5;
                    } else {
                        // Exploding
                        col[i*3] = 1.0; col[i*3+1] = 0.2 + (Math.random()*0.4); col[i*3+2] = 0.0;
                        pos[i*3+1] = bottomY + (Math.random() * height);
                    }
                } else {
                    // Full explosion expanding
                    col[i*3] = 1.0; col[i*3+1] = 0.4 + (Math.random()*0.2); col[i*3+2] = 0.0;
                    pos[i*3+1] = bottomY + (Math.random() * height);
                    // Expand outwards
                    pos[i*3] *= 1.02;
                    pos[i*3+2] *= 1.02;
                }
            } 
            else if (stroke === 3) {
                // Exhaust: Very dark grey (soot)
                col[i*3] = 0.1; col[i*3+1] = 0.1; col[i*3+2] = 0.1;
                pos[i*3+1] = bottomY + (Math.random() * height);
                // Move towards exhaust valve on right (X > 0)
                if (pos[i*3] < 0.8) pos[i*3] += delta * 2;
                if (pos[i*3+1] > 1.6) pos[i*3+1] += delta * 2; // Escape out valve
            }
            
            // Constrain to cylinder radius
            const dist = Math.sqrt(pos[i*3]*pos[i*3] + pos[i*3+2]*pos[i*3+2]);
            if (dist > 1.4) {
                const a = Math.atan2(pos[i*3+2], pos[i*3]);
                pos[i*3] = Math.cos(a) * 1.4;
                pos[i*3+2] = Math.sin(a) * 1.4;
            }
        }
        particles.geometry.attributes.position.needsUpdate = true;
        particles.geometry.attributes.color.needsUpdate = true;
    };

    return group;
}
