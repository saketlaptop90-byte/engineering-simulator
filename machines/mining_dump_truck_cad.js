import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const truckYellow = new THREE.MeshPhysicalMaterial({ color: 0xFDB813, metalness: 0.3, roughness: 0.5, clearcoat: 0.8 });
    const machinedSteel = new THREE.MeshPhysicalMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.2 });
    const chromeMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 1.0, roughness: 0.0, clearcoat: 1.0 });

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};

    // ==========================================
    // 1. PROCEDURAL CAD: The Massive Dump Bed
    // ==========================================
    // Mining trucks have a very distinct V-shaped dump bed designed to deflect rocks.
    const bedShape = new THREE.Shape();
    bedShape.moveTo(-3.0, 3.0);
    bedShape.lineTo(-2.5, 0.0);
    bedShape.lineTo(-1.0, -1.0); // V-bottom
    bedShape.lineTo(1.0, -1.0);
    bedShape.lineTo(2.5, 0.0);
    bedShape.lineTo(3.0, 3.0);
    
    // Hollow it out
    const innerBed = new THREE.Path();
    innerBed.moveTo(-2.7, 3.0);
    innerBed.lineTo(-2.2, 0.2);
    innerBed.lineTo(-0.8, -0.8);
    innerBed.lineTo(0.8, -0.8);
    innerBed.lineTo(2.2, 0.2);
    innerBed.lineTo(2.7, 3.0);
    innerBed.lineTo(-2.7, 3.0);
    bedShape.holes.push(innerBed);

    const bedSettings = { depth: 7.0, bevelEnabled: true, bevelSize: 0.1, bevelThickness: 0.1 };
    const bedGeo = new THREE.ExtrudeGeometry(bedShape, bedSettings);
    
    const dumpBed = new THREE.Mesh(bedGeo, truckYellow);
    dumpBed.position.set(0, 3.0, -3.5);
    
    // Set the pivot point to the rear of the bed
    const bedPivot = new THREE.Group();
    bedPivot.position.set(0, 2.0, -3.5);
    dumpBed.position.set(0, 1.0, 3.5); // Offset relative to pivot
    bedPivot.add(dumpBed);
    
    group.add(bedPivot);
    group.userData.animatedMeshes['bed_pivot'] = bedPivot;
    parts.push({ mesh: dumpBed, name: "CAD Dump Bed", description: "Mathematically extruded V-hull dump bed for rock deflection.", function: "Carries 400 tons of payload."});

    // ==========================================
    // 2. PROCEDURAL CAD: Multi-Stage Hydraulic Hoist
    // ==========================================
    // Giant lathed hydraulic cylinder
    const barrelPoints = [
        new THREE.Vector2(0, 1.5), new THREE.Vector2(0.3, 1.5),
        new THREE.Vector2(0.35, 1.4), new THREE.Vector2(0.35, -1.4),
        new THREE.Vector2(0.3, -1.5), new THREE.Vector2(0, -1.5)
    ];
    const barrel = new THREE.Mesh(new THREE.LatheGeometry(barrelPoints, 32), truckYellow);
    
    // Stage 1 Chrome Rod
    const rodGeo = new THREE.CylinderGeometry(0.25, 0.25, 3.0, 32);
    const rod = new THREE.Mesh(rodGeo, chromeMat);
    rod.position.y = 1.0;
    
    const hoistGroup = new THREE.Group();
    hoistGroup.add(barrel, rod);
    hoistGroup.position.set(0, 1.0, 0); // Middle of chassis
    hoistGroup.rotation.x = -Math.PI / 8; // Angled back towards bed
    group.add(hoistGroup);
    
    group.userData.animatedMeshes['hydraulic_rod'] = rod;
    group.userData.animatedMeshes['hoist'] = hoistGroup;
    parts.push({ mesh: hoistGroup, name: "Massive Hoist Cylinder", description: "Lathed hollow barrel with polished chrome inner rod.", function: "Lifts the 400-ton loaded bed." });

    // ==========================================
    // 3. Factual Fasteners (14,000 parts)
    // ==========================================
    const boltCount = 14000;
    const boltGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.08, 6); // Bigger bolts for a mining truck
    const instancedBolts = new THREE.InstancedMesh(boltGeo, machinedSteel, boltCount);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < boltCount; i++) {
        dummy.position.set((Math.random() - 0.5) * 6, Math.random() * 5, (Math.random() - 0.5) * 8);
        dummy.rotation.set(Math.random()*Math.PI, 0, 0);
        dummy.updateMatrix();
        instancedBolts.setMatrixAt(i, dummy.matrix);
    }
    instancedBolts.instanceMatrix.needsUpdate = true;
    group.add(instancedBolts);

    // Chassis body
    const body = new THREE.Mesh(new THREE.BoxGeometry(4.0, 1.5, 8.0), truckYellow);
    body.position.set(0, 1.5, 0);
    group.add(body);
    
    // Scale adjustment to ensure full visibility of this massive truck
    group.scale.set(0.6, 0.6, 0.6);
    
    // Dynamic Animation Loop
    group.userData.animate = function(time) {
        const state = group.userData.state;
        state.throttle = (Math.sin(time * 0.0005) + 1.0) / 2.0; 
        
        // Hoist the bed based on throttle
        const liftAngle = state.throttle * (Math.PI / 3); // 60 degrees max
        group.userData.animatedMeshes['bed_pivot'].rotation.x = liftAngle;
        
        // Extend the hydraulic rod to match the bed lift visually
        group.userData.animatedMeshes['hydraulic_rod'].position.y = 1.0 + (state.throttle * 2.0);
        
        // Pivot the entire hydraulic cylinder to track the bed connection point
        group.userData.animatedMeshes['hoist'].rotation.x = (-Math.PI / 8) + (state.throttle * 0.3);
    };

    group.userData.parts = parts;
    return group;
}
