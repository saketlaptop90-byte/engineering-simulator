import * as THREE from 'three';

export function createMachine() {
    const group = new THREE.Group();

    // --- 1. Stator (Permanent Magnets) ---
    const magnetGeo = new THREE.BoxGeometry(1, 4, 3);
    
    // North Pole (Red)
    const northMat = new THREE.MeshStandardMaterial({ color: 0xff2222, metalness: 0.5, roughness: 0.5 });
    const northPole = new THREE.Mesh(magnetGeo, northMat);
    northPole.position.set(-3, 0, 0);
    northPole.userData = { id: 'stator_north', name: 'Stator (North Pole)', description: 'Stationary permanent magnet providing a constant magnetic field.' };
    group.add(northPole);

    // South Pole (Blue)
    const southMat = new THREE.MeshStandardMaterial({ color: 0x2222ff, metalness: 0.5, roughness: 0.5 });
    const southPole = new THREE.Mesh(magnetGeo, southMat);
    southPole.position.set(3, 0, 0);
    southPole.userData = { id: 'stator_south', name: 'Stator (South Pole)', description: 'Stationary permanent magnet.' };
    group.add(southPole);

    // --- 2. Magnetic Field Lines (Visualized) ---
    const bFieldCount = 100;
    const bFieldGeo = new THREE.BufferGeometry();
    const bFieldPos = new Float32Array(bFieldCount * 3);
    for(let i=0; i<bFieldCount; i++){
        bFieldPos[i*3] = -2.5 + Math.random()*5; // X (between poles)
        bFieldPos[i*3+1] = (Math.random()-0.5)*3.5; // Y
        bFieldPos[i*3+2] = (Math.random()-0.5)*2.5; // Z
    }
    bFieldGeo.setAttribute('position', new THREE.BufferAttribute(bFieldPos, 3));
    const bFieldMat = new THREE.PointsMaterial({ color: 0x88ff88, size: 0.05, transparent: true, opacity: 0.3 });
    const bField = new THREE.Points(bFieldGeo, bFieldMat);
    group.add(bField);

    // --- 3. The Rotor (Armature) ---
    const rotorGroup = new THREE.Group();
    group.add(rotorGroup);

    // Central Shaft
    const shaftGeo = new THREE.CylinderGeometry(0.2, 0.2, 6, 16);
    const shaftMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.9 });
    const shaft = new THREE.Mesh(shaftGeo, shaftMat);
    shaft.rotation.x = Math.PI / 2;
    rotorGroup.add(shaft);
    shaft.userData = { id: 'rotor_shaft', name: 'Drive Shaft', description: 'Outputs the mechanical rotation.' };

    // Wire Loop (The Armature coil)
    const loopMat = new THREE.MeshStandardMaterial({ color: 0xcc8822, metalness: 0.8 }); // Copper
    const loopThickness = 0.15;
    
    // Left/Right bars of the loop (parallel to shaft)
    const barGeo = new THREE.CylinderGeometry(loopThickness, loopThickness, 3, 16);
    const bar1 = new THREE.Mesh(barGeo, loopMat);
    bar1.position.set(1.5, 0, 0);
    bar1.rotation.x = Math.PI / 2;
    rotorGroup.add(bar1);

    const bar2 = new THREE.Mesh(barGeo, loopMat);
    bar2.position.set(-1.5, 0, 0);
    bar2.rotation.x = Math.PI / 2;
    rotorGroup.add(bar2);

    // Top/Bottom connectors
    const connGeo = new THREE.CylinderGeometry(loopThickness, loopThickness, 3, 16);
    const conn1 = new THREE.Mesh(connGeo, loopMat);
    conn1.position.set(0, 0, 1.5);
    conn1.rotation.z = Math.PI / 2;
    rotorGroup.add(conn1);
    
    const conn2 = new THREE.Mesh(connGeo, loopMat);
    conn2.position.set(0, 0, -1.5);
    conn2.rotation.z = Math.PI / 2;
    rotorGroup.add(conn2);

    // --- 4. Commutator & Brushes ---
    // Commutator (Split ring on shaft)
    const commGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.6, 16, 1, false, 0.1, Math.PI - 0.2); // Half ring
    
    const comm1 = new THREE.Mesh(commGeo, new THREE.MeshStandardMaterial({color: 0xaaaa00, metalness: 0.8}));
    comm1.position.set(0, 0, 2);
    comm1.rotation.x = Math.PI / 2;
    rotorGroup.add(comm1);

    const comm2 = new THREE.Mesh(commGeo, new THREE.MeshStandardMaterial({color: 0xaaaa00, metalness: 0.8}));
    comm2.position.set(0, 0, 2);
    comm2.rotation.x = Math.PI / 2;
    comm2.rotation.y = Math.PI; // Opposite side
    rotorGroup.add(comm2);

    // Brushes (Stationary)
    const brushGeo = new THREE.BoxGeometry(0.3, 0.8, 0.4);
    const brushMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9 }); // Carbon
    
    const brush1 = new THREE.Mesh(brushGeo, brushMat);
    brush1.position.set(0.55, 0, 2);
    group.add(brush1);

    const brush2 = new THREE.Mesh(brushGeo, brushMat);
    brush2.position.set(-0.55, 0, 2);
    group.add(brush2);

    // Power Wires connected to brushes
    const wireGeo = new THREE.CylinderGeometry(0.05, 0.05, 2, 8);
    const wireRed = new THREE.Mesh(wireGeo, new THREE.MeshStandardMaterial({color: 0xff0000}));
    wireRed.position.set(1, 0, 2);
    wireRed.rotation.z = Math.PI / 2;
    group.add(wireRed);

    const wireBlack = new THREE.Mesh(wireGeo, new THREE.MeshStandardMaterial({color: 0x000000}));
    wireBlack.position.set(-1, 0, 2);
    wireBlack.rotation.z = Math.PI / 2;
    group.add(wireBlack);

    // Battery
    const batGeo = new THREE.BoxGeometry(1.5, 1, 1);
    const battery = new THREE.Mesh(batGeo, new THREE.MeshStandardMaterial({color: 0x111111}));
    battery.position.set(0, -2, 2);
    group.add(battery);

    const batWireGeo = new THREE.CylinderGeometry(0.05, 0.05, 2.5, 8);
    const bw1 = new THREE.Mesh(batWireGeo, new THREE.MeshStandardMaterial({color: 0xff0000}));
    bw1.position.set(1.5, -1, 2);
    group.add(bw1);
    
    const bw2 = new THREE.Mesh(batWireGeo, new THREE.MeshStandardMaterial({color: 0x000000}));
    bw2.position.set(-1.5, -1, 2);
    group.add(bw2);

    // --- 5. Electrons (Current Flow) ---
    const eCount = 60;
    const eGeo = new THREE.BufferGeometry();
    const ePos = new Float32Array(eCount * 3);
    const eProg = new Float32Array(eCount);
    for(let i=0; i<eCount; i++){
        eProg[i] = Math.random() * 4; // Loop around the circuit phases
    }
    eGeo.setAttribute('position', new THREE.BufferAttribute(ePos, 3));
    eGeo.setAttribute('progress', new THREE.BufferAttribute(eProg, 1));
    const eMat = new THREE.PointsMaterial({ color: 0x00ffff, size: 0.15, blending: THREE.AdditiveBlending });
    const electrons = new THREE.Points(eGeo, eMat);
    group.add(electrons);

    // --- 6. Animation ---
    let time = 0;
    let angle = 0;

    group.userData.animate = function(delta) {
        time += delta;
        
        // Spin the rotor
        const rpm = 60; 
        const angularVelocity = (rpm / 60) * Math.PI * 2;
        angle += angularVelocity * delta;
        rotorGroup.rotation.z = angle;

        // Animate B-Field Lines (Left to Right)
        const bPos = bField.geometry.attributes.position.array;
        for(let i=0; i<bFieldCount; i++){
            bPos[i*3] += delta * 2; // Move X
            if(bPos[i*3] > 2.5) {
                bPos[i*3] = -2.5; // Reset to North pole
            }
        }
        bField.geometry.attributes.position.needsUpdate = true;

        // Animate Electrons around the circuit
        const pos = electrons.geometry.attributes.position.array;
        const prog = electrons.geometry.attributes.progress.array;
        
        for(let i=0; i<eCount; i++){
            prog[i] += delta * 2; // speed
            let p = prog[i] % 8; // Total phases of circuit

            let x, y, z;

            // Simple hardcoded path for visual flow (Battery -> Red Wire -> Brush -> Coil -> Brush -> Black Wire -> Battery)
            // Phase 0: Up Red Wire (Right)
            if (p < 1) {
                x = 1.5; y = -2 + (p * 2); z = 2;
            } 
            // Phase 1: Left across to brush
            else if (p < 2) {
                let pp = p - 1;
                x = 1.5 - (pp * 1.0); y = 0; z = 2;
            }
            // Phase 2: Up the commutator & front connector of rotor
            else if (p < 3) {
                let pp = p - 2;
                // Follow the rotation!
                let localX = 0 + (pp * 1.5); // Move right along connector
                let localY = 0;
                let localZ = 1.5 - (pp * 1.5); // Move from front to middle
                
                // Apply rotation
                x = localX * Math.cos(angle) - localY * Math.sin(angle);
                y = localX * Math.sin(angle) + localY * Math.cos(angle);
                z = localZ;
            }
            // Phase 3: Down the right bar
            else if (p < 4) {
                let pp = p - 3;
                let localX = 1.5; 
                let localY = 0;
                let localZ = 0 - (pp * 1.5); // Move to back
                
                x = localX * Math.cos(angle) - localY * Math.sin(angle);
                y = localX * Math.sin(angle) + localY * Math.cos(angle);
                z = localZ;
            }
            // Phase 4: Left across back connector
            else if (p < 5) {
                let pp = p - 4;
                let localX = 1.5 - (pp * 3.0); // Move left
                let localY = 0;
                let localZ = -1.5;
                
                x = localX * Math.cos(angle) - localY * Math.sin(angle);
                y = localX * Math.sin(angle) + localY * Math.cos(angle);
                z = localZ;
            }
            // Phase 5: Up the left bar
            else if (p < 6) {
                let pp = p - 5;
                let localX = -1.5;
                let localY = 0;
                let localZ = -1.5 + (pp * 3.5); // Move to front commutator
                
                x = localX * Math.cos(angle) - localY * Math.sin(angle);
                y = localX * Math.sin(angle) + localY * Math.cos(angle);
                z = localZ;
            }
            // Phase 6: Left across wire to black wire
            else if (p < 7) {
                let pp = p - 6;
                x = -0.5 - (pp * 1.0); y = 0; z = 2;
            }
            // Phase 7: Down Black Wire to battery
            else {
                let pp = p - 7;
                x = -1.5; y = 0 - (pp * 2); z = 2;
            }

            pos[i*3] = x;
            pos[i*3+1] = y;
            pos[i*3+2] = z;
        }
        electrons.geometry.attributes.position.needsUpdate = true;
        electrons.geometry.attributes.progress.needsUpdate = true;
    };

    return group;
}

// Auto-generated missing stub
export function createElectricMotor() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
