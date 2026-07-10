import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const machinedSteel = new THREE.MeshPhysicalMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.2, clearcoat: 0.5 });
    const catYellow = new THREE.MeshPhysicalMaterial({ color: 0xFDB813, metalness: 0.3, roughness: 0.5, clearcoat: 0.8 });
    const darkMetal = new THREE.MeshPhysicalMaterial({ color: 0x222222, metalness: 0.8, roughness: 0.7 });

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};

    // ==========================================
    // 1. PROCEDURAL CAD: Exact Hydraulic Cylinder
    // ==========================================
    // We use LatheGeometry to create a perfect outer barrel and an inner polished chrome rod
    const barrelPoints = [
        new THREE.Vector2(0, 1.0), new THREE.Vector2(0.2, 1.0),
        new THREE.Vector2(0.25, 0.95), new THREE.Vector2(0.25, -0.95),
        new THREE.Vector2(0.2, -1.0), new THREE.Vector2(0.1, -1.0),
        new THREE.Vector2(0.1, 1.0) // Hollow center for rod
    ];
    const barrelGeo = new THREE.LatheGeometry(barrelPoints, 32);
    const barrel = new THREE.Mesh(barrelGeo, catYellow);
    
    // Chrome Rod
    const rodGeo = new THREE.CylinderGeometry(0.09, 0.09, 2.0, 32);
    const chromeMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 1.0, roughness: 0.0, clearcoat: 1.0 });
    const rod = new THREE.Mesh(rodGeo, chromeMat);
    // Move rod up to simulate extension
    rod.position.y = 0.5;
    
    const hydraulicGroup = new THREE.Group();
    hydraulicGroup.add(barrel, rod);
    hydraulicGroup.position.set(0, 1.5, 2.0);
    // Angle it like a dozer lift cylinder
    hydraulicGroup.rotation.x = -Math.PI / 4;
    group.add(hydraulicGroup);
    
    group.userData.animatedMeshes['hydraulic_rod'] = rod;
    parts.push({ mesh: hydraulicGroup, name: "CAD Hydraulic Lift Cylinder", description: "Lathed hollow barrel with polished chrome inner rod.", function: "Actuates the main dozer blade." });

    // ==========================================
    // 2. PROCEDURAL CAD: Interlocking Track Links
    // ==========================================
    // Extrude Geometry for an exact track shoe with a grouser bar
    const shoeShape = new THREE.Shape();
    shoeShape.moveTo(-0.2, 0);
    shoeShape.lineTo(0.2, 0);
    shoeShape.lineTo(0.2, 0.05);
    // Grouser bar
    shoeShape.lineTo(0.05, 0.05);
    shoeShape.lineTo(0.05, 0.15);
    shoeShape.lineTo(-0.05, 0.15);
    shoeShape.lineTo(-0.05, 0.05);
    shoeShape.lineTo(-0.2, 0.05);
    
    const shoeSettings = { depth: 0.8, bevelEnabled: true, bevelSize: 0.01, bevelThickness: 0.01 };
    const shoeGeo = new THREE.ExtrudeGeometry(shoeShape, shoeSettings);
    
    const trackGroup = new THREE.Group();
    const numShoes = 40;
    const trackRadius = 1.0;
    for(let i=0; i<numShoes; i++) {
        const angle = (i / numShoes) * Math.PI * 2;
        const shoe = new THREE.Mesh(shoeGeo, darkMetal);
        shoe.position.set(0, Math.sin(angle)*trackRadius, Math.cos(angle)*trackRadius);
        shoe.rotation.x = angle;
        // Center the extrusion depth
        shoe.position.x = -0.4;
        trackGroup.add(shoe);
    }
    
    trackGroup.position.set(1.5, 1.0, 0);
    const leftTrack = trackGroup.clone();
    leftTrack.position.set(-1.5, 1.0, 0);
    
    group.add(trackGroup, leftTrack);
    group.userData.animatedMeshes['tracks'] = [trackGroup, leftTrack];
    parts.push({ mesh: trackGroup, name: "Continuous Track Assembly", description: "Mathematically extruded grouser shoes arrayed along a path.", function: "Provides massive traction and low ground pressure."});

    // ==========================================
    // 3. 11700 Instanced Fasteners
    // ==========================================
    const boltGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.02, 6);
    const instancedBolts = new THREE.InstancedMesh(boltGeo, darkMetal, 11700);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < 11700; i++) {
        dummy.position.set((Math.random() - 0.5) * 4, Math.random() * 3, (Math.random() - 0.5) * 4);
        dummy.updateMatrix();
        instancedBolts.setMatrixAt(i, dummy.matrix);
    }
    instancedBolts.instanceMatrix.needsUpdate = true;
    group.add(instancedBolts);

    // Dynamic Animation Loop
    group.userData.animate = function(time) {
        const state = group.userData.state;
        state.throttle = (Math.sin(time * 0.0005) + 1.0) / 2.0; 
        
        // Accurate Track Rotation
        const trackSpeed = state.throttle * 0.02;
        group.userData.animatedMeshes['tracks'][0].rotation.x -= trackSpeed;
        group.userData.animatedMeshes['tracks'][1].rotation.x -= trackSpeed;
        
        // Animate Hydraulic Cylinder Extending/Retracting based on time
        const extension = (Math.sin(time * 0.001) + 1.0) / 2.0; // 0 to 1
        // Rod length is 2.0, so move Y from 0 to 1.0
        group.userData.animatedMeshes['hydraulic_rod'].position.y = extension;
    };

    group.userData.parts = parts;
    return group;
}

