import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const camoGreen = new THREE.MeshPhysicalMaterial({ color: 0x4B5320, metalness: 0.2, roughness: 0.9, clearcoat: 0.1 });
    const gunMetal = new THREE.MeshPhysicalMaterial({ color: 0x222222, metalness: 0.9, roughness: 0.5 });
    const trackSteel = new THREE.MeshPhysicalMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.7 });
    const eraArmor = new THREE.MeshPhysicalMaterial({ color: 0x556B2F, metalness: 0.3, roughness: 0.8 });

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};

    // ==========================================
    // 1. PROCEDURAL CAD: The Lower Hull & Tracks
    // ==========================================
    // Extruded angled glacis plate and hull
    const hullShape = new THREE.Shape();
    hullShape.moveTo(-1.5, 0);
    hullShape.lineTo(2.0, 0);
    hullShape.lineTo(2.5, 0.8);
    hullShape.lineTo(2.0, 1.2);
    hullShape.lineTo(-1.8, 1.2);
    hullShape.lineTo(-1.5, 0);
    
    const hullGeo = new THREE.ExtrudeGeometry(hullShape, { depth: 3.0, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05 });
    const hull = new THREE.Mesh(hullGeo, camoGreen);
    hull.position.set(0, 0.5, -1.5);
    group.add(hull);
    parts.push({ mesh: hull, name: "CAD Composite Hull", description: "Extruded angled steel and composite armor glacis.", function: "Provides the main armored chassis."});

    // Track system (Road wheels and continuous track simulation)
    const trackGroup = new THREE.Group();
    const roadWheelGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.4, 32).rotateX(Math.PI/2);
    
    group.userData.animatedMeshes.wheels = [];
    
    for (let side = -1; side <= 1; side += 2) {
        // 6 road wheels per side
        for (let i = 0; i < 6; i++) {
            const wheel = new THREE.Mesh(roadWheelGeo, trackSteel);
            wheel.position.set(-1.0 + (i * 0.6), 0.35, side * 1.6);
            trackGroup.add(wheel);
            group.userData.animatedMeshes.wheels.push(wheel);
        }
        
        // Drive sprocket (rear)
        const sprocket = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.4, 16).rotateX(Math.PI/2), trackSteel);
        sprocket.position.set(-1.6, 0.5, side * 1.6);
        trackGroup.add(sprocket);
        group.userData.animatedMeshes.wheels.push(sprocket);
        
        // Idler wheel (front)
        const idler = new THREE.Mesh(roadWheelGeo, trackSteel);
        idler.position.set(2.2, 0.5, side * 1.6);
        trackGroup.add(idler);
        group.userData.animatedMeshes.wheels.push(idler);
    }
    group.add(trackGroup);
    parts.push({ mesh: trackGroup, name: "Torsion Bar Suspension & Wheels", description: "14 individual steel road wheels.", function: "Distributes the 60-ton weight of the tank."});

    // ==========================================
    // 2. PROCEDURAL CAD: The Rotating Turret & Gun
    // ==========================================
    const turretGroup = new THREE.Group();
    
    // Angled turret geometry
    const turretShape = new THREE.Shape();
    turretShape.moveTo(-1.0, -1.2);
    turretShape.lineTo(1.2, -1.0);
    turretShape.lineTo(1.5, 0);
    turretShape.lineTo(1.2, 1.0);
    turretShape.lineTo(-1.0, 1.2);
    turretShape.lineTo(-1.5, 0);
    
    const turretGeo = new THREE.ExtrudeGeometry(turretShape, { depth: 0.8, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05 });
    const turretBody = new THREE.Mesh(turretGeo, camoGreen);
    turretBody.rotation.x = Math.PI / 2; // Flat on top
    turretBody.position.set(0, 0, 0.4); // Offset extrusion depth
    turretGroup.add(turretBody);
    
    // The 120mm Smoothbore Main Gun
    const gunGroup = new THREE.Group();
    // Gun barrel (lathed with bore evacuator)
    const barrelPoints = [
        new THREE.Vector2(0, 0), new THREE.Vector2(0.12, 0),
        new THREE.Vector2(0.12, 1.0), new THREE.Vector2(0.18, 1.1),
        new THREE.Vector2(0.18, 2.0), new THREE.Vector2(0.12, 2.1), // Bore evacuator
        new THREE.Vector2(0.12, 4.0), new THREE.Vector2(0.1, 4.0),
        new THREE.Vector2(0.1, 4.2), new THREE.Vector2(0.14, 4.2), // Muzzle reference sensor
        new THREE.Vector2(0.14, 4.3), new THREE.Vector2(0, 4.3)
    ];
    const barrelGeo = new THREE.LatheGeometry(barrelPoints, 32);
    const mainGun = new THREE.Mesh(barrelGeo, gunMetal);
    mainGun.rotation.z = -Math.PI / 2; // Point forward
    mainGun.position.set(0, 0, 0);
    
    gunGroup.add(mainGun);
    gunGroup.position.set(1.5, 0.3, 0);
    
    turretGroup.add(gunGroup);
    turretGroup.position.set(0.2, 1.7, 0); // Mounted on chassis
    group.add(turretGroup);
    
    group.userData.animatedMeshes['turret'] = turretGroup;
    group.userData.animatedMeshes['gun'] = mainGun;
    
    parts.push({ mesh: turretBody, name: "CAD Angled Turret", description: "Heavy sloped composite armor.", function: "Houses the crew, autoloader, and primary optics."});
    parts.push({ mesh: mainGun, name: "120mm Smoothbore Cannon", description: "Lathed high-pressure steel barrel with bore evacuator.", function: "Fires APFSDS and HEAT rounds with massive kinetic energy."});

    // ==========================================
    // 3. Factual Fasteners (10,500 parts)
    // ==========================================
    const boltCount = 10500;
    const boltGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.03, 6);
    const instancedBolts = new THREE.InstancedMesh(boltGeo, gunMetal, boltCount);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < boltCount; i++) {
        // Distribute over the chassis and turret
        dummy.position.set((Math.random() - 0.5) * 4, Math.random() * 2 + 0.5, (Math.random() - 0.5) * 3);
        dummy.rotation.set(Math.random()*Math.PI, 0, 0);
        dummy.updateMatrix();
        instancedBolts.setMatrixAt(i, dummy.matrix);
    }
    instancedBolts.instanceMatrix.needsUpdate = true;
    group.add(instancedBolts);
    parts.push({ mesh: instancedBolts, name: "10,500 Armor Fasteners", description: "Factual quantity of instanced bolts.", function: "Secures reactive armor blocks and chassis plating." });
    
    // Scale adjustment
    group.scale.set(0.8, 0.8, 0.8);
    
    // Dynamic Animation Loop
    let recoilTimer = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        
        // Simulating driving tracks
        if (state.throttle > 0.0) {
            const speed = state.throttle * 0.05;
            group.userData.animatedMeshes.wheels.forEach(w => {
                w.rotation.x += speed;
            });
            
            // Turret tracks the target (slewing)
            group.userData.animatedMeshes['turret'].rotation.y = Math.sin(time * 0.001) * 0.5 * state.throttle;
            
            // Simulating main gun recoil firing sequence every ~3 seconds
            recoilTimer += state.throttle;
            if (recoilTimer > 180) {
                recoilTimer = 0; // FIRE!
            }
            
            if (recoilTimer < 10) {
                // Intense rearward recoil
                group.userData.animatedMeshes['gun'].position.x = -(recoilTimer / 10) * 0.6;
            } else if (recoilTimer < 60) {
                // Hydraulic return to battery
                const returnCycle = (recoilTimer - 10) / 50;
                group.userData.animatedMeshes['gun'].position.x = -0.6 + (returnCycle * 0.6);
            } else {
                group.userData.animatedMeshes['gun'].position.x = 0;
            }
        }
    };

    group.userData.parts = parts;
    return group;
}
