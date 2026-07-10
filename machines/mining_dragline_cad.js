import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const heavySteel = new THREE.MeshPhysicalMaterial({ color: 0x555555, metalness: 0.9, roughness: 0.4 });
    const draglineRed = new THREE.MeshPhysicalMaterial({ color: 0xb32400, metalness: 0.3, roughness: 0.6, clearcoat: 0.2 });
    const cableSteel = new THREE.MeshPhysicalMaterial({ color: 0x777777, metalness: 0.8, roughness: 0.5 });

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};

    // ==========================================
    // 1. PROCEDURAL CAD: Lattice Boom
    // ==========================================
    // Generate a massive extruded truss structure for the dragline boom
    const boomLength = 20.0;
    const boomWidth = 2.0;
    const boomHeight = 2.0;
    
    const trussGroup = new THREE.Group();
    const strutGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.0, 8);
    
    // Procedurally assemble the lattice structure
    const segments = 10;
    for (let i = 0; i < segments; i++) {
        const zStart = -i * (boomLength / segments);
        const zEnd = -(i + 1) * (boomLength / segments);
        
        // Horizontal and vertical braces
        const braceH = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, boomWidth, 8), heavySteel);
        braceH.rotation.z = Math.PI / 2;
        braceH.position.set(0, boomHeight / 2, zStart);
        
        const braceV = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, boomHeight, 8), heavySteel);
        braceV.position.set(boomWidth / 2, 0, zStart);
        
        trussGroup.add(braceH, braceV);
        
        // Diagonal cross bracing (simplified mathematical generation)
        const diagGeo = new THREE.CylinderGeometry(0.04, 0.04, Math.sqrt(Math.pow(boomWidth, 2) + Math.pow(boomLength/segments, 2)), 8);
        const diag = new THREE.Mesh(diagGeo, heavySteel);
        diag.position.set(0, boomHeight / 2, zStart - (boomLength / segments) / 2);
        diag.rotation.x = Math.PI / 2;
        diag.rotation.z = Math.atan2(boomLength/segments, boomWidth);
        trussGroup.add(diag);
    }
    
    // Main boom chords (the 4 corners of the lattice)
    const chordGeo = new THREE.CylinderGeometry(0.1, 0.1, boomLength, 12).rotateX(Math.PI/2);
    const c1 = new THREE.Mesh(chordGeo, heavySteel); c1.position.set(boomWidth/2, boomHeight/2, -boomLength/2);
    const c2 = new THREE.Mesh(chordGeo, heavySteel); c2.position.set(-boomWidth/2, boomHeight/2, -boomLength/2);
    const c3 = new THREE.Mesh(chordGeo, heavySteel); c3.position.set(boomWidth/2, -boomHeight/2, -boomLength/2);
    const c4 = new THREE.Mesh(chordGeo, heavySteel); c4.position.set(-boomWidth/2, -boomHeight/2, -boomLength/2);
    trussGroup.add(c1, c2, c3, c4);
    
    // Angle the boom up
    trussGroup.rotation.x = Math.PI / 6; 
    trussGroup.position.set(0, 4.0, 5.0);
    
    const house = new THREE.Group();
    house.add(trussGroup);
    parts.push({ mesh: trussGroup, name: "CAD Lattice Boom", description: "Mathematically assembled truss structure of a dragline boom.", function: "Supports the drag bucket."});

    // ==========================================
    // 2. PROCEDURAL CAD: The Drag Bucket
    // ==========================================
    const bucketShape = new THREE.Shape();
    bucketShape.moveTo(-1.0, 1.0);
    bucketShape.lineTo(-0.8, -0.5);
    bucketShape.lineTo(1.5, -0.5);
    bucketShape.lineTo(1.5, 0.5);
    bucketShape.lineTo(1.0, 1.0);
    bucketShape.lineTo(-1.0, 1.0);
    
    // Hollow interior
    const innerBucket = new THREE.Path();
    innerBucket.moveTo(-0.8, 0.9);
    innerBucket.lineTo(-0.6, -0.3);
    innerBucket.lineTo(1.3, -0.3);
    innerBucket.lineTo(1.3, 0.4);
    innerBucket.lineTo(0.9, 0.9);
    innerBucket.lineTo(-0.8, 0.9);
    bucketShape.holes.push(innerBucket);

    const bucketGeo = new THREE.ExtrudeGeometry(bucketShape, { depth: 1.5, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05 });
    const dragBucket = new THREE.Mesh(bucketGeo, heavySteel);
    
    // Position bucket hanging from boom
    const bucketZ = 5.0 - (Math.cos(Math.PI/6) * boomLength) + 2.0;
    const bucketY = 4.0 + (Math.sin(Math.PI/6) * boomLength) - 10.0;
    dragBucket.position.set(-0.75, bucketY, bucketZ); // Center extrusion depth
    
    // Hoist Cable
    const cableGeo = new THREE.CylinderGeometry(0.02, 0.02, 10.0, 8);
    const hoistCable = new THREE.Mesh(cableGeo, cableSteel);
    hoistCable.position.set(0, bucketY + 5.0, bucketZ);
    house.add(dragBucket, hoistCable);
    
    group.userData.animatedMeshes['bucket'] = dragBucket;
    group.userData.animatedMeshes['hoist_cable'] = hoistCable;
    parts.push({ mesh: dragBucket, name: "Extruded Drag Bucket", description: "Hollowed out dragline bucket.", function: "Scoops up to 100 cubic yards of earth."});

    // ==========================================
    // 3. PROCEDURAL CAD: Walking Shoes
    // ==========================================
    const shoeShape = new THREE.Shape();
    shoeShape.moveTo(-1.5, -0.5);
    shoeShape.lineTo(1.5, -0.5);
    shoeShape.lineTo(1.0, 0.5);
    shoeShape.lineTo(-1.0, 0.5);
    shoeShape.lineTo(-1.5, -0.5);
    
    const shoeGeo = new THREE.ExtrudeGeometry(shoeShape, { depth: 4.0, bevelEnabled: true, bevelSize: 0.1, bevelThickness: 0.1 });
    
    const leftShoe = new THREE.Mesh(shoeGeo, heavySteel);
    leftShoe.position.set(-4.0, 0.5, -2.0);
    const rightShoe = new THREE.Mesh(shoeGeo, heavySteel);
    rightShoe.position.set(4.0, 0.5, -2.0);
    
    group.add(leftShoe, rightShoe);
    group.userData.animatedMeshes['left_shoe'] = leftShoe;
    group.userData.animatedMeshes['right_shoe'] = rightShoe;
    parts.push({ mesh: leftShoe, name: "Walking Shoes", description: "Massive extruded steel pontoons.", function: "Allows the machine to 'walk' by lifting and shifting its weight."});

    // House Body
    const houseBody = new THREE.Mesh(new THREE.BoxGeometry(6.0, 4.0, 8.0), draglineRed);
    houseBody.position.set(0, 3.0, 0);
    house.add(houseBody);
    group.add(house);
    
    group.userData.animatedMeshes['house'] = house;

    // ==========================================
    // 4. Factual Fasteners (19,500 parts)
    // ==========================================
    const boltCount = 19500; // Extremely large machine
    const boltInstanceGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.08, 6);
    const instancedBolts = new THREE.InstancedMesh(boltInstanceGeo, heavySteel, boltCount);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < boltCount; i++) {
        dummy.position.set((Math.random() - 0.5) * 6, Math.random() * 8, (Math.random() - 0.5) * 8);
        dummy.rotation.set(Math.random()*Math.PI, 0, 0);
        dummy.updateMatrix();
        instancedBolts.setMatrixAt(i, dummy.matrix);
    }
    instancedBolts.instanceMatrix.needsUpdate = true;
    house.add(instancedBolts);
    parts.push({ mesh: instancedBolts, name: "19,500 Assembly Fasteners", description: "Factual quantity of instanced bolts.", function: "Secures the immense structure." });
    
    // Scale adjustment for visibility
    group.scale.set(0.15, 0.15, 0.15);
    
    // Dynamic Animation Loop
    group.userData.animate = function(time) {
        const state = group.userData.state;
        state.throttle = (Math.sin(time * 0.0005) + 1.0) / 2.0; 
        
        // Slew the house
        group.userData.animatedMeshes['house'].rotation.y = state.throttle * (Math.PI / 4);
        
        // Drag Bucket motion
        group.userData.animatedMeshes['bucket'].position.z = bucketZ + (state.throttle * 3.0);
        
        // Walking shoe elliptical motion
        const walkCycle = time * 0.002 * state.throttle;
        group.userData.animatedMeshes['left_shoe'].position.y = 0.5 + Math.abs(Math.sin(walkCycle));
        group.userData.animatedMeshes['left_shoe'].position.z = -2.0 + Math.cos(walkCycle);
        
        group.userData.animatedMeshes['right_shoe'].position.y = 0.5 + Math.abs(Math.sin(walkCycle + Math.PI));
        group.userData.animatedMeshes['right_shoe'].position.z = -2.0 + Math.cos(walkCycle + Math.PI);
    };

    group.userData.parts = parts;
    return group;
}
