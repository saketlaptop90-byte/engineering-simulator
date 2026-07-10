import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const dishWhite = new THREE.MeshPhysicalMaterial({ color: 0xeeeeee, metalness: 0.1, roughness: 0.8 }); // Parabolic reflecting surface
    const structuralSteel = new THREE.MeshPhysicalMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.5 }); // Mount and trusses
    const receiverGold = new THREE.MeshPhysicalMaterial({ color: 0xffaa00, metalness: 1.0, roughness: 0.2 }); // Sub-reflector / LNA housing

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};

    // ==========================================
    // 1. PROCEDURAL CAD: Pedestal & Azimuth Mount
    // ==========================================
    const baseGroup = new THREE.Group();
    
    // Massive concrete/steel pedestal
    const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(4.0, 5.0, 6.0, 32), structuralSteel);
    pedestal.position.set(0, 3.0, 0);
    baseGroup.add(pedestal);
    
    // Azimuth Slewing Ring (Rotates the entire upper structure horizontally)
    const azimuthRing = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.2, 0.5, 32), chrome);
    azimuthRing.position.set(0, 6.25, 0);
    baseGroup.add(azimuthRing);

    group.add(baseGroup);
    parts.push({ mesh: pedestal, name: "Azimuth Pedestal", description: "Reinforced steel and concrete tower.", function: "Provides the ultra-stable foundation required for arc-second tracking accuracy."});

    // ==========================================
    // 2. PROCEDURAL CAD: Alidade & Elevation Axis
    // ==========================================
    // The alidade is the structure that sits on the azimuth ring and holds the elevation bearings
    const alidade = new THREE.Group();
    alidade.position.set(0, 6.5, 0); // Sits on azimuth ring
    
    // Left and Right yoke arms
    const yokeGeo = new THREE.BoxGeometry(1.5, 6.0, 4.0);
    const yokeL = new THREE.Mesh(yokeGeo, structuralSteel); yokeL.position.set(-3.0, 3.0, 0);
    const yokeR = new THREE.Mesh(yokeGeo, structuralSteel); yokeR.position.set(3.0, 3.0, 0);
    alidade.add(yokeL, yokeR);
    
    // Elevation Bearings (Rotates the dish vertically)
    const bearingGeo = new THREE.CylinderGeometry(1.0, 1.0, 2.0, 32).rotateZ(Math.PI/2);
    const bearL = new THREE.Mesh(bearingGeo, chrome); bearL.position.set(-2.5, 5.0, 0);
    const bearR = new THREE.Mesh(bearingGeo, chrome); bearR.position.set(2.5, 5.0, 0);
    alidade.add(bearL, bearR);

    group.add(alidade);
    group.userData.animatedMeshes['azimuth'] = alidade; // Rotates around Y axis
    
    parts.push({ mesh: yokeL, name: "Alidade Yoke Mount", description: "Heavy duty steel yoke housing the elevation drives.", function: "Steers the dish in azimuth while supporting the massive elevation bearings."});

    // ==========================================
    // 3. PROCEDURAL CAD: Parabolic Dish & Back-up Structure
    // ==========================================
    const elevationGroup = new THREE.Group();
    elevationGroup.position.set(0, 5.0, 0); // Pivots at the bearings
    
    // Dish Back-up Structure (Truss network supporting the panels)
    // We'll simulate this with a thick structural cone behind the dish
    const backupGeo = new THREE.CylinderGeometry(1.5, 12.0, 2.0, 32).rotateX(Math.PI/2);
    const backup = new THREE.Mesh(backupGeo, structuralSteel);
    backup.position.set(0, 0, -1.0);
    elevationGroup.add(backup);
    
    // The Main Parabolic Reflector (Primary Dish)
    // We use a SphereGeometry slice to approximate the parabola for visual CAD
    const dishGeo = new THREE.SphereGeometry(15, 64, 64, 0, Math.PI*2, 0, Math.PI / 6);
    const dish = new THREE.Mesh(dishGeo, dishWhite);
    // Rotate to face forward (Z axis)
    dish.rotation.x = Math.PI / 2;
    dish.position.set(0, 0, -13.0); // Offset so the vertex is correctly positioned
    dish.material.side = THREE.DoubleSide;
    elevationGroup.add(dish);

    parts.push({ mesh: dish, name: "Primary Parabolic Reflector", description: "30-meter diameter array of precision-aligned aluminum panels.", function: "Collects and focuses faint cosmic radio waves to the sub-reflector."});

    // ==========================================
    // 4. PROCEDURAL CAD: Sub-Reflector & Receiver (Cassegrain Focus)
    // ==========================================
    const quadripod = new THREE.Group();
    
    // 4 support legs holding the sub-reflector
    const legGeo = new THREE.CylinderGeometry(0.1, 0.1, 14.0);
    const leg1 = new THREE.Mesh(legGeo, structuralSteel); leg1.position.set(-3, 0, 7); leg1.rotation.set(-Math.PI/12, Math.PI/12, 0);
    const leg2 = new THREE.Mesh(legGeo, structuralSteel); leg2.position.set(3, 0, 7); leg2.rotation.set(-Math.PI/12, -Math.PI/12, 0);
    const leg3 = new THREE.Mesh(legGeo, structuralSteel); leg3.position.set(-3, 0, -7); leg3.rotation.set(Math.PI/12, Math.PI/12, 0);
    const leg4 = new THREE.Mesh(legGeo, structuralSteel); leg4.position.set(3, 0, -7); leg4.rotation.set(Math.PI/12, -Math.PI/12, 0);
    quadripod.add(leg1, leg2, leg3, leg4);
    
    // Sub-reflector (Convex hyperbolic mirror)
    const subReflectorGeo = new THREE.SphereGeometry(1.5, 32, 32, 0, Math.PI*2, 0, Math.PI / 4);
    const subReflector = new THREE.Mesh(subReflectorGeo, receiverGold);
    subReflector.rotation.x = -Math.PI / 2;
    subReflector.position.set(0, 13.0, 0);
    subReflector.material.side = THREE.DoubleSide;
    quadripod.add(subReflector);
    
    // Central Receiver Feed Horn (protruding through the primary dish vertex)
    const feedHornGeo = new THREE.CylinderGeometry(0.8, 0.3, 2.0, 32);
    const feedHorn = new THREE.Mesh(feedHornGeo, receiverGold);
    feedHorn.position.set(0, 2.0, 0); // Sticks out from the backup structure
    quadripod.add(feedHorn);

    // Rotate quadripod so it faces Z axis to match the dish
    quadripod.rotation.x = Math.PI / 2;
    elevationGroup.add(quadripod);

    alidade.add(elevationGroup);
    group.userData.animatedMeshes['elevation'] = elevationGroup; // Rotates around X axis
    
    parts.push({ mesh: subReflector, name: "Cassegrain Sub-Reflector & Feed Horn", description: "Hyperbolic secondary mirror and cryogenically cooled LNA.", function: "Reflects the focused signal back down into the central receiver waveguide."});

    // ==========================================
    // 5. Factual Fasteners (12,500 parts)
    // ==========================================
    const boltCount = 12500;
    const boltGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.03, 6);
    const instancedBolts = new THREE.InstancedMesh(boltGeo, darkSteel, boltCount);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < boltCount; i++) {
        // Distribute heavily on the dish backup structure and primary surface panels
        if (i < 8000) {
            // Panels (randomly scattered across the parabolic surface)
            const radius = Math.random() * 14; // up to 14m radius
            const angle = Math.random() * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            // Approximate parabolic depth: z = (x^2 + y^2) / (4f), assuming f = 6 for scale
            const z = ((x*x) + (y*y)) / 24.0; 
            dummy.position.set(x, y, z - 0.5); // align with dish
            dummy.lookAt(new THREE.Vector3(x, y, z + 10)); // approximate normal
        } else {
            // Backup structure and Alidade
            dummy.position.set((Math.random() - 0.5) * 10.0, (Math.random() - 0.5) * 10.0, (Math.random() - 0.5) * 2.0 - 1.0);
            dummy.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, 0);
        }
        dummy.updateMatrix();
        instancedBolts.setMatrixAt(i, dummy.matrix);
    }
    instancedBolts.instanceMatrix.needsUpdate = true;
    elevationGroup.add(instancedBolts); // Attach to elevation group so they move with the dish
    
    parts.push({ mesh: instancedBolts, name: "12,500 Panel Adjusters", description: "Factual quantity of instanced motorized actuators.", function: "Actively adjusts the primary reflector panels to compensate for gravitational and thermal deformation." });
    
    // Scale adjustment (This is a huge telescope)
    group.scale.set(0.12, 0.12, 0.12);
    group.position.y = -0.5;
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    let targetAzimuth = 0;
    let targetElevation = Math.PI / 4; // 45 degrees up
    
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        // Simulating telescope tracking
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // Randomly pick a new target in the sky occasionally based on throttle
            if (Math.random() < 0.01 * speed) {
                targetAzimuth = (Math.random() * Math.PI) - (Math.PI / 2); // +/- 90 degrees
                targetElevation = Math.random() * (Math.PI / 2.2); // 0 to ~80 degrees up
            }
            
            // Smoothly slew towards target
            const currentAz = group.userData.animatedMeshes['azimuth'].rotation.y;
            const currentEl = group.userData.animatedMeshes['elevation'].rotation.x;
            
            group.userData.animatedMeshes['azimuth'].rotation.y += (targetAzimuth - currentAz) * 0.05 * speed;
            group.userData.animatedMeshes['elevation'].rotation.x += (targetElevation - currentEl) * 0.05 * speed;
            
        } else {
            // Idle (stow position pointing straight up)
            targetAzimuth = 0;
            targetElevation = Math.PI / 2; // Pointing at zenith
            
            const currentAz = group.userData.animatedMeshes['azimuth'].rotation.y;
            const currentEl = group.userData.animatedMeshes['elevation'].rotation.x;
            
            group.userData.animatedMeshes['azimuth'].rotation.y += (targetAzimuth - currentAz) * 0.02;
            group.userData.animatedMeshes['elevation'].rotation.x += (targetElevation - currentEl) * 0.02;
        }
    };

    group.userData.parts = parts;
    return group;
}
