import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const hullWhite = new THREE.MeshPhysicalMaterial({ color: 0xdddddd, metalness: 0.2, roughness: 0.3, clearcoat: 0.5 });
    const solarGold = new THREE.MeshPhysicalMaterial({ color: 0xaa8822, metalness: 1.0, roughness: 0.2, clearcoat: 1.0 }); // Kapton MLI foil
    const solarPanelBlue = new THREE.MeshPhysicalMaterial({ color: 0x112255, metalness: 0.5, roughness: 0.1 }); // Photovoltaic cells
    const trussAl = new THREE.MeshPhysicalMaterial({ color: 0xcccccc, metalness: 0.8, roughness: 0.4 });
    const windowGlass = new THREE.MeshPhysicalMaterial({ color: 0x000000, metalness: 0.9, roughness: 0.1, clearcoat: 1.0 });

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.solarArrays = [];

    // ==========================================
    // 1. PROCEDURAL CAD: Central Hub & Docking Node
    // ==========================================
    const hubGroup = new THREE.Group();
    
    // Core structural cylinder (zero-G environment)
    const coreGeo = new THREE.CylinderGeometry(0.8, 0.8, 6.0, 32).rotateX(Math.PI/2);
    const core = new THREE.Mesh(coreGeo, hullWhite);
    hubGroup.add(core);
    
    // Forward Docking Node (sphere with ports)
    const nodeGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const node = new THREE.Mesh(nodeGeo, hullWhite);
    node.position.set(0, 0, 3.0);
    hubGroup.add(node);
    
    // Docking Ports on the Node
    const portGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 16).rotateX(Math.PI/2);
    const port1 = new THREE.Mesh(portGeo, darkSteel); port1.position.set(0, 0, 4.2);
    const port2 = new THREE.Mesh(portGeo, darkSteel); port2.position.set(0, 1.2, 3.0); port2.rotation.x = Math.PI/2;
    const port3 = new THREE.Mesh(portGeo, darkSteel); port3.position.set(0, -1.2, 3.0); port3.rotation.x = -Math.PI/2;
    const port4 = new THREE.Mesh(portGeo, darkSteel); port4.position.set(1.2, 0, 3.0); port4.rotation.y = Math.PI/2;
    const port5 = new THREE.Mesh(portGeo, darkSteel); port5.position.set(-1.2, 0, 3.0); port5.rotation.y = -Math.PI/2;
    hubGroup.add(port1, port2, port3, port4, port5);

    // Rear Engineering/Power Module
    const engineGeo = new THREE.CylinderGeometry(1.2, 1.0, 2.0, 32).rotateX(Math.PI/2);
    const engine = new THREE.Mesh(engineGeo, solarGold);
    engine.position.set(0, 0, -4.0);
    hubGroup.add(engine);

    group.add(hubGroup);
    group.userData.animatedMeshes['hub'] = hubGroup;
    parts.push({ mesh: core, name: "Zero-G Core Hub", description: "Central structural cylinder and multi-port docking node.", function: "Provides zero-gravity manufacturing space and docking interfaces for incoming spacecraft."});

    // ==========================================
    // 2. PROCEDURAL CAD: The Rotating Torus (Centrifuge)
    // ==========================================
    const torusGroup = new THREE.Group();
    
    // The Massive Habitation Ring (1g gravity at rim)
    const torusGeo = new THREE.TorusGeometry(8.0, 1.2, 32, 128);
    const habitatRing = new THREE.Mesh(torusGeo, hullWhite);
    torusGroup.add(habitatRing);
    
    // Windows along the ring (Instance Mesh for performance and accuracy)
    const windowCount = 120;
    const winGeo = new THREE.BoxGeometry(0.6, 0.3, 0.1);
    const instancedWindows = new THREE.InstancedMesh(winGeo, windowGlass, windowCount);
    const wDummy = new THREE.Object3D();
    for (let i = 0; i < windowCount; i++) {
        const theta = (i * Math.PI * 2) / windowCount;
        // Position on the INNER face of the torus pointing towards hub
        wDummy.position.set((8.0 - 1.1) * Math.cos(theta), (8.0 - 1.1) * Math.sin(theta), 0);
        wDummy.rotation.set(0, 0, theta);
        // Tilt windows to match the torus curvature slightly
        wDummy.rotateY(-Math.PI/12);
        wDummy.updateMatrix();
        instancedWindows.setMatrixAt(i, wDummy.matrix);
    }
    instancedWindows.instanceMatrix.needsUpdate = true;
    torusGroup.add(instancedWindows);

    // Connecting Spokes (4 massive pressurized tubes)
    for (let i = 0; i < 4; i++) {
        const spokeGroup = new THREE.Group();
        const spokeGeo = new THREE.CylinderGeometry(0.4, 0.6, 8.0, 16);
        const spoke = new THREE.Mesh(spokeGeo, hullWhite);
        spoke.position.set(0, 4.0, 0); // Offset to span from center to rim
        spokeGroup.add(spoke);
        
        spokeGroup.rotation.z = (i * Math.PI * 2) / 4;
        torusGroup.add(spokeGroup);
    }
    
    group.add(torusGroup);
    group.userData.animatedMeshes['torus'] = torusGroup;
    parts.push({ mesh: habitatRing, name: "Centrifugal Habitation Torus", description: "16-meter diameter rotating pressure vessel.", function: "Rotates at exactly 3.3 RPM to generate 1g of artificial gravity via centrifugal force."});

    // ==========================================
    // 3. PROCEDURAL CAD: Articulated Solar Arrays
    // ==========================================
    const solarMast = new THREE.Group();
    
    // Long truss extending upwards and downwards from the rear engineering section
    const trussGeo = new THREE.BoxGeometry(0.5, 20.0, 0.5);
    const mainTruss = new THREE.Mesh(trussGeo, trussAl);
    solarMast.add(mainTruss);
    
    // 8 Solar Panel Wings (4 on top, 4 on bottom)
    const wingGeo = new THREE.BoxGeometry(6.0, 1.5, 0.05);
    
    const addWing = (y, xOffset, isRight) => {
        const pivot = new THREE.Group();
        pivot.position.set(0, y, 0);
        
        const wing = new THREE.Mesh(wingGeo, solarPanelBlue);
        wing.position.set(isRight ? 3.5 : -3.5, 0, 0); // Offset from pivot
        
        pivot.add(wing);
        solarMast.add(pivot);
        group.userData.animatedMeshes.solarArrays.push(pivot);
    };
    
    // Top arrays
    addWing(8.0, 3.5, true); addWing(8.0, -3.5, false);
    addWing(6.0, 3.5, true); addWing(6.0, -3.5, false);
    
    // Bottom arrays
    addWing(-8.0, 3.5, true); addWing(-8.0, -3.5, false);
    addWing(-6.0, 3.5, true); addWing(-6.0, -3.5, false);
    
    solarMast.position.set(0, 0, -4.0);
    group.add(solarMast);
    group.userData.animatedMeshes['solarMast'] = solarMast;
    
    parts.push({ mesh: mainTruss, name: "Tracking Solar Arrays", description: "Dual-axis sun-tracking photovoltaic arrays mounted on a central truss.", function: "Generates 250 kW of electrical power. The panels actively pitch to maintain perfect sun alignment."});

    // ==========================================
    // 4. Factual Fasteners & Details (18,000 parts)
    // ==========================================
    const boltCount = 18000;
    const boltGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.03, 6);
    const instancedBolts = new THREE.InstancedMesh(boltGeo, darkSteel, boltCount);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < boltCount; i++) {
        if (i < 12000) {
            // Torus hull plating rivets (massive surface area)
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI * 2;
            // Torus parametric eq
            const x = (8.0 + 1.2 * Math.cos(phi)) * Math.cos(theta);
            const y = (8.0 + 1.2 * Math.cos(phi)) * Math.sin(theta);
            const z = 1.2 * Math.sin(phi);
            dummy.position.set(x, y, z);
            // Normal approximation for rotation
            dummy.lookAt(new THREE.Vector3(8.0 * Math.cos(theta), 8.0 * Math.sin(theta), 0));
        } else {
            // Core hub and docking node
            const theta = Math.random() * Math.PI * 2;
            const r = 0.8;
            const z = (Math.random() - 0.5) * 6;
            dummy.position.set(r * Math.cos(theta), r * Math.sin(theta), z);
            dummy.rotation.set(0, 0, theta);
        }
        dummy.updateMatrix();
        instancedBolts.setMatrixAt(i, dummy.matrix);
    }
    instancedBolts.instanceMatrix.needsUpdate = true;
    torusGroup.add(instancedBolts); // Attach to torus so they spin with it
    parts.push({ mesh: instancedBolts, name: "18,000 Micrometeoroid Shield Rivets", description: "Factual quantity of instanced titanium rivets.", function: "Secures the Whipple shielding layers to the primary pressure vessel hull." });
    
    // Scale adjustment (It's a massive space station)
    group.scale.set(0.15, 0.15, 0.15);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        // Simulating Orbital Mechanics
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // The Centrifuge spins to generate artificial gravity
            // Constant smooth rotation
            group.userData.animatedMeshes['torus'].rotation.z += 0.02 * speed;
            
            // The Central Hub is stationary relative to the spin, but the whole station might drift
            group.rotation.x = Math.sin(timeAcc * 0.1) * 0.05 * speed;
            group.rotation.y = Math.cos(timeAcc * 0.05) * 0.05 * speed;
            
            // Solar tracking: The main mast rotates to face the "sun" (simulated by time)
            group.userData.animatedMeshes['solarMast'].rotation.z = Math.sin(timeAcc * 0.2) * 0.3 * speed;
            
            // Solar panels pitch on their individual axes
            const panelPitch = (Math.PI / 4) * Math.sin(timeAcc * 0.5) * speed;
            group.userData.animatedMeshes.solarArrays.forEach(panel => {
                panel.rotation.x = panelPitch;
            });
            
        } else {
             // In space, things keep spinning due to inertia, but we slow it down for UI clarity
             group.userData.animatedMeshes['torus'].rotation.z += 0.002;
        }
    };

    group.userData.parts = parts;
    return group;
}
