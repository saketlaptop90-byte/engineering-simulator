import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const spaceGold = new THREE.MeshPhysicalMaterial({ color: 0xffd700, metalness: 1.0, roughness: 0.2, clearcoat: 0.5 }); // Kapton multi-layer insulation
    const solarBlue = new THREE.MeshPhysicalMaterial({ color: 0x001144, metalness: 0.8, roughness: 0.1, clearcoat: 1.0 }); // Photovoltaic cells
    const antennaWhite = new THREE.MeshPhysicalMaterial({ color: 0xeeeeee, metalness: 0.1, roughness: 0.8 }); 
    const trussAluminum = new THREE.MeshPhysicalMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.5 });
    const thrusterMetal = new THREE.MeshPhysicalMaterial({ color: 0x333333, metalness: 1.0, roughness: 0.6 });

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};

    // ==========================================
    // 1. PROCEDURAL CAD: The Satellite Bus
    // ==========================================
    // Central hexagonal prism body covered in Kapton foil
    const busGeo = new THREE.CylinderGeometry(1.0, 1.0, 2.5, 6);
    const bus = new THREE.Mesh(busGeo, spaceGold);
    bus.position.set(0, 0, 0);
    group.add(bus);
    
    // Star trackers and sensors mounted on the bus
    const sensorGeo = new THREE.CylinderGeometry(0.1, 0.15, 0.3, 16);
    const sensor1 = new THREE.Mesh(sensorGeo, trussAluminum);
    sensor1.position.set(0.8, 1.0, 0.5);
    sensor1.rotation.z = Math.PI / 4;
    const sensor2 = new THREE.Mesh(sensorGeo, trussAluminum);
    sensor2.position.set(-0.8, 1.0, 0.5);
    sensor2.rotation.z = -Math.PI / 4;
    bus.add(sensor1, sensor2);
    
    parts.push({ mesh: bus, name: "Satellite Bus (Kapton Insulated)", description: "Central hexagonal spacecraft bus.", function: "Houses the payload, computers, and reaction wheels while regulating thermal extremes."});

    // ==========================================
    // 2. PROCEDURAL CAD: Unfolding Solar Panel Arrays
    // ==========================================
    const solarGroupLeft = new THREE.Group();
    const solarGroupRight = new THREE.Group();
    group.userData.animatedMeshes.panelsL = [];
    group.userData.animatedMeshes.panelsR = [];
    
    // Build a multi-panel array
    const panelGeo = new THREE.BoxGeometry(1.5, 0.05, 1.0);
    
    // Left array (3 segments)
    for (let i = 0; i < 3; i++) {
        const panel = new THREE.Mesh(panelGeo, solarBlue);
        // Add metallic framing to the panel
        const frame = new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.02, 1.02), trussAluminum);
        panel.add(frame);
        
        // Setup hierarchical folding pivots
        const pivot = new THREE.Group();
        pivot.position.set(-1.5, 0, 0); // Hinge point
        panel.position.set(-0.75, 0, 0); // Offset to hinge
        pivot.add(panel);
        
        if (i === 0) {
            solarGroupLeft.add(pivot);
            pivot.position.set(-1.0, 0, 0); // Attach to bus
        } else {
            group.userData.animatedMeshes.panelsL[i-1].panel.add(pivot); // Attach to previous panel's far edge
        }
        group.userData.animatedMeshes.panelsL.push({ pivot, panel });
    }
    
    // Right array (3 segments)
    for (let i = 0; i < 3; i++) {
        const panel = new THREE.Mesh(panelGeo, solarBlue);
        const frame = new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.02, 1.02), trussAluminum);
        panel.add(frame);
        
        const pivot = new THREE.Group();
        pivot.position.set(1.5, 0, 0); 
        panel.position.set(0.75, 0, 0);
        pivot.add(panel);
        
        if (i === 0) {
            solarGroupRight.add(pivot);
            pivot.position.set(1.0, 0, 0); 
        } else {
            group.userData.animatedMeshes.panelsR[i-1].panel.add(pivot);
        }
        group.userData.animatedMeshes.panelsR.push({ pivot, panel });
    }
    
    group.add(solarGroupLeft, solarGroupRight);
    parts.push({ mesh: solarGroupLeft, name: "Photovoltaic Solar Arrays", description: "Deployable silicon cell arrays with aluminum frames.", function: "Generates electrical power from the sun."});

    // ==========================================
    // 3. PROCEDURAL CAD: Parabolic High-Gain Antenna
    // ==========================================
    const dishGroup = new THREE.Group();
    
    // Lathed parabolic dish
    const dishPoints = [];
    for (let i = 0; i <= 20; i++) {
        const r = (i / 20) * 1.2;
        const y = 0.3 * (r * r); // Parabola curve
        dishPoints.push(new THREE.Vector2(r, y));
    }
    const dishGeo = new THREE.LatheGeometry(dishPoints, 32);
    const dish = new THREE.Mesh(dishGeo, antennaWhite);
    
    // Sub-reflector and supports
    const subReflector = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.05, 16), trussAluminum);
    subReflector.position.y = 0.8;
    const supportGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.8, 8);
    for (let i = 0; i < 3; i++) {
        const support = new THREE.Mesh(supportGeo, trussAluminum);
        const angle = (i * Math.PI * 2) / 3;
        support.position.set(Math.cos(angle)*0.5, 0.4, Math.sin(angle)*0.5);
        support.rotation.x = Math.PI/6 * Math.sin(angle);
        support.rotation.z = -Math.PI/6 * Math.cos(angle);
        dish.add(support);
    }
    dish.add(subReflector);
    
    dishGroup.add(dish);
    dishGroup.position.set(0, 1.8, 0);
    // Angle it slightly
    dishGroup.rotation.x = Math.PI / 6;
    
    group.add(dishGroup);
    group.userData.animatedMeshes['dish'] = dishGroup;
    parts.push({ mesh: dish, name: "Parabolic High-Gain Antenna", description: "Lathed carbon-composite reflector.", function: "Transmits huge volumes of telemetry and payload data back to Earth."});

    // ==========================================
    // 4. PROCEDURAL CAD: Ion Thruster
    // ==========================================
    const thrusterGeo = new THREE.CylinderGeometry(0.3, 0.4, 0.6, 32);
    const thruster = new THREE.Mesh(thrusterGeo, thrusterMetal);
    thruster.position.set(0, -1.5, 0);
    group.add(thruster);
    
    // Exhaust plume (visual effect)
    const plumeGeo = new THREE.CylinderGeometry(0.2, 0.4, 1.5, 16);
    const plumeMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.0 }); // Starts invisible
    const plume = new THREE.Mesh(plumeGeo, plumeMat);
    plume.position.set(0, -1.0, 0);
    thruster.add(plume);
    
    group.userData.animatedMeshes['plume'] = plumeMat;
    parts.push({ mesh: thruster, name: "Hall-Effect Ion Thruster", description: "Electrostatic xenon propulsion engine.", function: "Provides highly efficient, low-thrust propulsion for station keeping."});

    // ==========================================
    // 5. Factual Fasteners (15,000 parts)
    // ==========================================
    const boltCount = 15000;
    const boltGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.02, 6);
    const aerospaceTitanium = new THREE.MeshPhysicalMaterial({ color: 0x999999, metalness: 0.9, roughness: 0.5 });
    const instancedBolts = new THREE.InstancedMesh(boltGeo, aerospaceTitanium, boltCount);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < boltCount; i++) {
        // Distribute over the bus and solar panel frames
        dummy.position.set((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 2);
        dummy.rotation.set(Math.random()*Math.PI, 0, 0);
        dummy.updateMatrix();
        instancedBolts.setMatrixAt(i, dummy.matrix);
    }
    instancedBolts.instanceMatrix.needsUpdate = true;
    group.add(instancedBolts);
    parts.push({ mesh: instancedBolts, name: "15,000 Aerospace Fasteners", description: "Factual quantity of instanced titanium bolts.", function: "Secures the satellite to withstand launch vibrations." });
    
    // Scale adjustment
    group.scale.set(0.6, 0.6, 0.6);
    
    // Initial folded state
    group.userData.animatedMeshes.panelsL.forEach((p, idx) => { p.pivot.rotation.y = (idx === 0) ? -Math.PI/2 : Math.PI; });
    group.userData.animatedMeshes.panelsR.forEach((p, idx) => { p.pivot.rotation.y = (idx === 0) ? Math.PI/2 : -Math.PI; });
    
    // Dynamic Animation Loop
    group.userData.animate = function(time) {
        const state = group.userData.state;
        
        // Simulating deployment sequence and orbital mechanics
        if (state.throttle > 0.0) {
            // Unfold solar panels
            const targetRotL = [0, 0, 0]; 
            const targetRotR = [0, 0, 0];
            
            group.userData.animatedMeshes.panelsL.forEach((p, idx) => {
                p.pivot.rotation.y += (targetRotL[idx] - p.pivot.rotation.y) * 0.02;
            });
            group.userData.animatedMeshes.panelsR.forEach((p, idx) => {
                p.pivot.rotation.y += (targetRotR[idx] - p.pivot.rotation.y) * 0.02;
            });
            
            // Activate ion thruster (blue glow)
            group.userData.animatedMeshes['plume'].opacity = state.throttle * 0.6;
            
            // Satellite slowly rotates to maintain sun-pointing
            group.rotation.y = time * 0.0002;
            
            // Antenna tracks a target (Earth)
            group.userData.animatedMeshes['dish'].rotation.y = Math.sin(time * 0.001) * 0.5;
            group.userData.animatedMeshes['dish'].rotation.z = Math.cos(time * 0.0005) * 0.2;
        } else {
            // Refold
            const foldL = [-Math.PI/2, Math.PI, Math.PI];
            const foldR = [Math.PI/2, -Math.PI, -Math.PI];
            group.userData.animatedMeshes.panelsL.forEach((p, idx) => {
                p.pivot.rotation.y += (foldL[idx] - p.pivot.rotation.y) * 0.05;
            });
            group.userData.animatedMeshes.panelsR.forEach((p, idx) => {
                p.pivot.rotation.y += (foldR[idx] - p.pivot.rotation.y) * 0.05;
            });
            group.userData.animatedMeshes['plume'].opacity = 0;
            group.rotation.y = 0;
        }
    };

    group.userData.parts = parts;
    return group;
}
