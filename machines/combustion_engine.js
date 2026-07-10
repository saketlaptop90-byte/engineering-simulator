import * as THREE from 'three';

export function createMachine() {
    const group = new THREE.Group();

    // --- 1. Engine Block (Cutaway) ---
    const cylinderGeo = new THREE.CylinderGeometry(1.5, 1.5, 4, 32, 1, true, 0, Math.PI); // Half cylinder
    const blockMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.7, roughness: 0.5, side: THREE.DoubleSide });
    const block = new THREE.Mesh(cylinderGeo, blockMat);
    block.rotation.y = Math.PI / 2;
    block.userData = { id: 'cylinder_block', name: 'Engine Cylinder', description: 'The chamber where fuel is compressed and ignited.' };
    group.add(block);

    // --- 2. Piston & Crankshaft ---
    const pistonGroup = new THREE.Group();
    group.add(pistonGroup);

    const pistonGeo = new THREE.CylinderGeometry(1.48, 1.48, 1.5, 32);
    const pistonMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.4 });
    const piston = new THREE.Mesh(pistonGeo, pistonMat);
    pistonGroup.add(piston);
    piston.userData = { id: 'piston', name: 'Piston', description: 'Moves up and down, compressing the air-fuel mixture and transferring force to the crankshaft.' };

    const rodGeo = new THREE.CylinderGeometry(0.2, 0.2, 3, 16);
    const rod = new THREE.Mesh(rodGeo, blockMat);
    rod.position.y = -2;
    pistonGroup.add(rod);

    // --- 3. Valves (Intake and Exhaust) ---
    const valveGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 16);
    const stemGeo = new THREE.CylinderGeometry(0.05, 0.05, 1, 8);
    const valveMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8 });

    const intakeValve = new THREE.Group();
    const ivHead = new THREE.Mesh(valveGeo, valveMat);
    const ivStem = new THREE.Mesh(stemGeo, valveMat);
    ivStem.position.y = 0.5;
    intakeValve.add(ivHead);
    intakeValve.add(ivStem);
    intakeValve.position.set(-0.8, 2, 0);
    intakeValve.userData = { id: 'intake_valve', name: 'Intake Valve', description: 'Opens to let air and fuel into the cylinder.' };
    group.add(intakeValve);

    const exhaustValve = new THREE.Group();
    const evHead = new THREE.Mesh(valveGeo, valveMat);
    const evStem = new THREE.Mesh(stemGeo, valveMat);
    evStem.position.y = 0.5;
    exhaustValve.add(evHead);
    exhaustValve.add(evStem);
    exhaustValve.position.set(0.8, 2, 0);
    exhaustValve.userData = { id: 'exhaust_valve', name: 'Exhaust Valve', description: 'Opens to let burned gases escape.' };
    group.add(exhaustValve);

    // Spark Plug
    const sparkPlugGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.6, 8);
    const sparkPlugMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const sparkPlug = new THREE.Mesh(sparkPlugGeo, sparkPlugMat);
    sparkPlug.position.set(0, 2.3, 0);
    group.add(sparkPlug);

    // --- 4. Particles (Fuel/Air and Exhaust) ---
    const particleCount = 200;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    const pColor = new Float32Array(particleCount * 3);
    const pActive = new Float32Array(particleCount); // 0: off, 1: intake(blue/white), 2: combust(orange), 3: exhaust(grey)

    for(let i=0; i<particleCount; i++){
        pPos[i*3] = (Math.random()-0.5) * 2.8;
        pPos[i*3+1] = 0; // will be dynamic
        pPos[i*3+2] = (Math.random()-0.5) * 1.5;
        pActive[i] = 0;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pColor, 3));
    pGeo.setAttribute('activeStatus', new THREE.BufferAttribute(pActive, 1));

    const pMat = new THREE.PointsMaterial({ size: 0.15, vertexColors: true, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
    const particles = new THREE.Points(pGeo, pMat);
    group.add(particles);

    // --- 5. Animation (4-Stroke Cycle) ---
    // Stroke 0: Intake (Down), 1: Compression (Up), 2: Power (Down), 3: Exhaust (Up)
    let crankAngle = 0; 
    let stroke = 0;

    group.userData.animate = function(delta) {
        // Fast rotation
        const rpm = 120; // 2 revs per second
        const rps = rpm / 60;
        const angularVelocity = rps * Math.PI * 2;
        
        crankAngle += angularVelocity * delta;
        if (crankAngle >= Math.PI * 2) {
            crankAngle -= Math.PI * 2;
            stroke = (stroke + 1) % 4;
        }

        // Piston movement (simple harmonic motion for crank)
        const pistonY = Math.cos(crankAngle) * 1.5; // Ranges from 1.5 (Top Dead Center) to -1.5 (Bottom)
        pistonGroup.position.y = pistonY;

        // Valve Logic
        if (stroke === 0) { // Intake
            intakeValve.position.y = 1.6; // Open
            exhaustValve.position.y = 2.0; // Closed
        } else if (stroke === 3) { // Exhaust
            intakeValve.position.y = 2.0; // Closed
            exhaustValve.position.y = 1.6; // Open
        } else { // Compression and Power
            intakeValve.position.y = 2.0;
            exhaustValve.position.y = 2.0;
        }

        // Particle Logic
        const pos = particles.geometry.attributes.position.array;
        const col = particles.geometry.attributes.color.array;
        
        for(let i=0; i<particleCount; i++){
            // Bounding box for particles: Y between pistonY + 0.75 and 2.0
            const bottomY = pistonY + 0.8;
            const topY = 2.0;
            const height = topY - bottomY;

            if (stroke === 0) {
                // Intake: Mix of Fuel (blueish) and Air (white)
                col[i*3] = 0.5; col[i*3+1] = 0.8; col[i*3+2] = 1.0;
                // Swirl down
                pos[i*3+1] = topY - (Math.random() * height);
            } else if (stroke === 1) {
                // Compression: Same color, just squished
                pos[i*3+1] = bottomY + (Math.random() * height);
            } else if (stroke === 2) {
                // Power (Combustion)
                if (crankAngle < 0.2) {
                    // Flash white/yellow right at TDC
                    col[i*3] = 1.0; col[i*3+1] = 1.0; col[i*3+2] = 0.8;
                } else {
                    // Fire! (Orange/Red)
                    col[i*3] = 1.0; col[i*3+1] = 0.4 + (Math.random()*0.2); col[i*3+2] = 0.0;
                }
                pos[i*3+1] = bottomY + (Math.random() * height);
                // Expand outwards
                pos[i*3] *= 1.01;
                pos[i*3+2] *= 1.01;
            } else if (stroke === 3) {
                // Exhaust: Dark grey
                col[i*3] = 0.3; col[i*3+1] = 0.3; col[i*3+2] = 0.3;
                pos[i*3+1] = bottomY + (Math.random() * height);
                // Move towards exhaust valve on right (X > 0)
                if (pos[i*3] < 0.8) pos[i*3] += delta * 2;
                if (pos[i*3+1] > 1.6) pos[i*3+1] += delta * 2; // Escape out valve
            }
            
            // Constrain to cylinder radius
            const dist = Math.sqrt(pos[i*3]*pos[i*3] + pos[i*3+2]*pos[i*3+2]);
            if (dist > 1.4) {
                const angle = Math.atan2(pos[i*3+2], pos[i*3]);
                pos[i*3] = Math.cos(angle) * 1.4;
                pos[i*3+2] = Math.sin(angle) * 1.4;
            }
        }
        particles.geometry.attributes.position.needsUpdate = true;
        particles.geometry.attributes.color.needsUpdate = true;
    };

    return group;
}

// Auto-generated missing stub
export function createCombustionEngine() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
