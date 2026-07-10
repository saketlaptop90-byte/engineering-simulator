import * as THREE from 'three';

export function createMachine() {
    const group = new THREE.Group();

    // --- 1. Engine Casing (Cross-section) ---
    // Outer Nacelle Top
    const nacelleShape = new THREE.Shape();
    nacelleShape.moveTo(-5, 2.5);
    nacelleShape.lineTo(-4, 3.2);
    nacelleShape.lineTo(4, 2.8);
    nacelleShape.lineTo(5, 2.5);
    nacelleShape.lineTo(4, 2.2);
    nacelleShape.lineTo(-4, 2.2);
    nacelleShape.lineTo(-5, 2.5);
    const extrudeSettings = { depth: 1, bevelEnabled: false };
    const nacelleTop = new THREE.Mesh(new THREE.ExtrudeGeometry(nacelleShape, extrudeSettings), new THREE.MeshStandardMaterial({color: 0xcccccc, metalness: 0.6}));
    nacelleTop.position.z = -0.5;
    group.add(nacelleTop);

    // Outer Nacelle Bottom
    const nacelleBot = new THREE.Mesh(new THREE.ExtrudeGeometry(nacelleShape, extrudeSettings), new THREE.MeshStandardMaterial({color: 0xcccccc, metalness: 0.6}));
    nacelleBot.position.z = -0.5;
    nacelleBot.rotation.x = Math.PI; // flip
    group.add(nacelleBot);

    // Inner Core Casing (Top & Bottom)
    const coreShape = new THREE.Shape();
    coreShape.moveTo(-2, 1.2);
    coreShape.lineTo(2, 0.8);
    coreShape.lineTo(4, 0.5);
    coreShape.lineTo(5, 0.8);
    coreShape.lineTo(4, 1.5);
    coreShape.lineTo(-2, 1.5);
    coreShape.lineTo(-2, 1.2);
    const coreTop = new THREE.Mesh(new THREE.ExtrudeGeometry(coreShape, extrudeSettings), new THREE.MeshStandardMaterial({color: 0x888888, metalness: 0.8}));
    coreTop.position.z = -0.5;
    group.add(coreTop);
    
    const coreBot = new THREE.Mesh(new THREE.ExtrudeGeometry(coreShape, extrudeSettings), new THREE.MeshStandardMaterial({color: 0x888888, metalness: 0.8}));
    coreBot.position.z = -0.5;
    coreBot.rotation.x = Math.PI;
    group.add(coreBot);

    // --- 2. Central Shaft ---
    const shaftGeo = new THREE.CylinderGeometry(0.2, 0.2, 10, 16);
    const shaftMat = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.9 });
    const shaft = new THREE.Mesh(shaftGeo, shaftMat);
    shaft.rotation.z = Math.PI / 2;
    group.add(shaft);

    // --- 3. Fan and Compressor Stages ---
    const fanGroup = new THREE.Group();
    group.add(fanGroup);

    // Main Intake Fan
    const mainFanGeo = new THREE.CylinderGeometry(2.1, 2.1, 0.2, 16);
    const mainFan = new THREE.Mesh(mainFanGeo, new THREE.MeshStandardMaterial({color: 0x222222, metalness: 0.8}));
    mainFan.rotation.z = Math.PI / 2;
    mainFan.position.x = -4.5;
    fanGroup.add(mainFan);
    mainFan.userData = { id: 'intake_fan', name: 'Bypass Fan', description: 'Sucks in massive amounts of air. Most of it bypasses the core to provide thrust.' };

    // Compressor Stages (getting smaller)
    for(let i=0; i<4; i++){
        const radius = 1.1 - (i*0.1);
        const compStage = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 0.1, 16), new THREE.MeshStandardMaterial({color: 0x666666}));
        compStage.rotation.z = Math.PI / 2;
        compStage.position.x = -1.5 + (i*0.6);
        fanGroup.add(compStage);
    }

    // --- 4. Combustion Chamber ---
    const combChamberGeo = new THREE.CylinderGeometry(0.8, 0.8, 1.5, 32, 1, true, 0, Math.PI);
    const combMat = new THREE.MeshStandardMaterial({ color: 0x441111, side: THREE.DoubleSide, metalness: 0.5 });
    const combChamber = new THREE.Mesh(combChamberGeo, combMat);
    combChamber.rotation.z = Math.PI / 2;
    combChamber.position.x = 2;
    group.add(combChamber);
    
    const combChamberBot = new THREE.Mesh(combChamberGeo, combMat);
    combChamberBot.rotation.z = Math.PI / 2;
    combChamberBot.rotation.y = Math.PI;
    combChamberBot.position.x = 2;
    group.add(combChamberBot);
    combChamber.userData = { id: 'combustion_chamber', name: 'Combustion Chamber', description: 'Fuel is injected and ignited with highly compressed air, creating a massive continuous explosion.' };

    // --- 5. Turbine Stages ---
    for(let i=0; i<3; i++){
        const radius = 0.6 + (i*0.15);
        const turbStage = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 0.1, 16), new THREE.MeshStandardMaterial({color: 0xaa5533, metalness: 0.9}));
        turbStage.rotation.z = Math.PI / 2;
        turbStage.position.x = 3.5 + (i*0.5);
        fanGroup.add(turbStage);
    }
    fanGroup.userData = { id: 'turbines', name: 'Turbine Stages', description: 'The expanding exhaust gases spin these turbines, which drive the central shaft to power the front fan.' };

    // --- 6. Particles (Airflow and Combustion) ---
    const airCount = 400;
    const airGeo = new THREE.BufferGeometry();
    const airPos = new Float32Array(airCount * 3);
    const airColor = new Float32Array(airCount * 3);
    const airType = new Float32Array(airCount); // 0: bypass (blue/white), 1: core (heats up)

    for(let i=0; i<airCount; i++){
        airPos[i*3] = -6 + Math.random()*12; // Spread along X
        
        // Random radius and angle
        const r = 0.3 + Math.random() * 1.8;
        const theta = Math.random() * Math.PI * 2;
        airPos[i*3+1] = Math.cos(theta) * r;
        airPos[i*3+2] = Math.sin(theta) * r;

        // Bypass vs Core
        if (r > 1.2) {
            airType[i] = 0; // Bypass
            airColor[i*3] = 0.8; airColor[i*3+1] = 0.9; airColor[i*3+2] = 1.0;
        } else {
            airType[i] = 1; // Core
            airColor[i*3] = 1.0; airColor[i*3+1] = 1.0; airColor[i*3+2] = 1.0;
        }
    }
    
    airGeo.setAttribute('position', new THREE.BufferAttribute(airPos, 3));
    airGeo.setAttribute('color', new THREE.BufferAttribute(airColor, 3));
    const airMat = new THREE.PointsMaterial({ size: 0.15, vertexColors: true, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending });
    const airParticles = new THREE.Points(airGeo, airMat);
    group.add(airParticles);

    // --- 7. Animation ---
    group.userData.animate = function(delta) {
        // Spin fan and shaft
        const rpm = 300;
        fanGroup.rotation.x -= (rpm / 60) * Math.PI * 2 * delta;
        shaft.rotation.x -= (rpm / 60) * Math.PI * 2 * delta;

        // Animate particles flowing from left to right (-X to +X)
        const pos = airParticles.geometry.attributes.position.array;
        const col = airParticles.geometry.attributes.color.array;

        for(let i=0; i<airCount; i++){
            let speed = delta * 8; // base speed
            let x = pos[i*3];
            let y = pos[i*3+1];
            let z = pos[i*3+2];
            const type = airType[i];

            if (type === 0) {
                // Bypass air just flows straight and fast
                x += speed * 1.5;
            } else {
                // Core air
                x += speed;
                
                // Compression phase (X from -2 to 1) -> Squeeze radius
                if (x > -2 && x < 1) {
                    const r = Math.sqrt(y*y + z*z);
                    if (r > 0.8) {
                        const squeeze = delta * 2;
                        y -= (y/r) * squeeze;
                        z -= (z/r) * squeeze;
                    }
                    // Color shifts to warm (compression heat)
                    col[i*3] = 1.0; col[i*3+1] = 0.8; col[i*3+2] = 0.4;
                }
                
                // Combustion phase (X from 1 to 3) -> Explode / Heat up
                if (x >= 1 && x < 3) {
                    x += speed * 2; // accelerate due to expansion
                    // Ignite!
                    col[i*3] = 1.0; col[i*3+1] = 0.3 + Math.random()*0.4; col[i*3+2] = 0.0;
                    
                    // Add turbulence
                    y += (Math.random()-0.5)*0.2;
                    z += (Math.random()-0.5)*0.2;
                }

                // Exhaust phase (X > 3) -> Expand slightly
                if (x >= 3) {
                    x += speed * 3; // extremely fast out the back
                    // Fade to orange/grey
                    col[i*3] = 0.8; col[i*3+1] = 0.4; col[i*3+2] = 0.2;
                    const r = Math.sqrt(y*y + z*z);
                    if (r < 1.0) {
                        const exp = delta;
                        y += (y/r) * exp;
                        z += (z/r) * exp;
                    }
                }
            }

            // Reset at front of engine
            if (x > 6) {
                x = -6;
                const r = 0.3 + Math.random() * 1.8;
                const theta = Math.random() * Math.PI * 2;
                y = Math.cos(theta) * r;
                z = Math.sin(theta) * r;
                
                if (r > 1.2) {
                    airType[i] = 0;
                    col[i*3] = 0.8; col[i*3+1] = 0.9; col[i*3+2] = 1.0;
                } else {
                    airType[i] = 1;
                    col[i*3] = 1.0; col[i*3+1] = 1.0; col[i*3+2] = 1.0;
                }
            }

            pos[i*3] = x;
            pos[i*3+1] = y;
            pos[i*3+2] = z;
        }

        airParticles.geometry.attributes.position.needsUpdate = true;
        airParticles.geometry.attributes.color.needsUpdate = true;
    };

    return group;
}

// Auto-generated missing stub
export function createJetEngine() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
