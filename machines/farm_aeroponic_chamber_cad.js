import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const pvcWhite = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.0, roughness: 0.2, clearcoat: 1.0 });
    const brassNozzle = new THREE.MeshPhysicalMaterial({ color: 0xb5a642, metalness: 0.8, roughness: 0.3 });
    const nutrientWater = new THREE.MeshPhysicalMaterial({ color: 0x00ffcc, metalness: 0.1, roughness: 0.0, transmission: 0.9, opacity: 0.7, transparent: true });

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.mist = [];

    // ==========================================
    // 1. PROCEDURAL CAD: The PVC Root Chamber
    // ==========================================
    // Extruded main growing chamber with a hollow interior
    const chamberShape = new THREE.Shape();
    chamberShape.moveTo(-2.0, 1.0);
    chamberShape.lineTo(2.0, 1.0);
    chamberShape.lineTo(1.5, -1.0);
    chamberShape.lineTo(-1.5, -1.0);
    chamberShape.lineTo(-2.0, 1.0);
    
    // Hollow it out
    const innerChamber = new THREE.Path();
    innerChamber.moveTo(-1.9, 0.9);
    innerChamber.lineTo(-1.4, -0.9);
    innerChamber.lineTo(1.4, -0.9);
    innerChamber.lineTo(1.9, 0.9);
    innerChamber.lineTo(-1.9, 0.9);
    chamberShape.holes.push(innerChamber);

    const chamberGeo = new THREE.ExtrudeGeometry(chamberShape, { depth: 6.0, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02 });
    const chamber = new THREE.Mesh(chamberGeo, pvcWhite);
    chamber.position.set(0, 2.0, -3.0);
    group.add(chamber);
    parts.push({ mesh: chamber, name: "CAD Root Chamber", description: "Hollow extruded PVC trough.", function: "Provides an enclosed environment for suspended root systems."});

    // ==========================================
    // 2. PROCEDURAL CAD: Misting Nozzle Array
    // ==========================================
    // 60 Brass high-pressure atomization nozzles lathed to exact specifications
    const nozzlePoints = [
        new THREE.Vector2(0, 0), new THREE.Vector2(0.02, 0),
        new THREE.Vector2(0.02, 0.03), new THREE.Vector2(0.04, 0.04),
        new THREE.Vector2(0.04, 0.08), new THREE.Vector2(0.01, 0.08),
        new THREE.Vector2(0, 0.09) // Tiny orifice
    ];
    const nozzleGeo = new THREE.LatheGeometry(nozzlePoints, 16);
    
    // Misting particle geometry
    const mistGeo = new THREE.SphereGeometry(0.1, 8, 8);
    
    const nozzleGroup = new THREE.Group();
    let mistIndex = 0;
    for(let z = -2.5; z <= 2.5; z += 0.5) {
        for(let x = -1.0; x <= 1.0; x += 0.5) {
            const nozzle = new THREE.Mesh(nozzleGeo, brassNozzle);
            nozzle.position.set(x, 1.2, z); // Bottom of the chamber facing up
            nozzleGroup.add(nozzle);
            
            // Add a mist particle emitter for each nozzle
            const mist = new THREE.Mesh(mistGeo, nutrientWater);
            mist.position.set(x, 1.3, z);
            mist.scale.set(0.1, 0.1, 0.1);
            nozzleGroup.add(mist);
            group.userData.animatedMeshes.mist.push(mist);
            mistIndex++;
        }
    }
    group.add(nozzleGroup);
    parts.push({ mesh: nozzleGroup, name: "60 Brass Atomizers", description: "Lathed brass nozzles.", function: "Sprays atomized 50-micron nutrient mist onto roots."});

    // ==========================================
    // 3. PROCEDURAL CAD: High-Pressure Pump & Plumbing
    // ==========================================
    const pumpBody = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.8, 32).rotateZ(Math.PI/2), aluminum);
    pumpBody.position.set(-1.0, 0.5, 3.5);
    
    // Pipe connecting pump to chamber
    const pipePath = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-1.0, 0.5, 3.5),
        new THREE.Vector3(-1.0, 1.0, 2.0),
        new THREE.Vector3(0, 1.0, 0)
    );
    const pipeGeo = new THREE.TubeGeometry(pipePath, 32, 0.05, 8, false);
    const pipe = new THREE.Mesh(pipeGeo, pvcWhite);
    
    group.add(pumpBody, pipe);
    parts.push({ mesh: pumpBody, name: "Pneumatic Fluid Pump", description: "Lathed aluminum pressure pump.", function: "Generates 120 PSI required for mist atomization."});

    // ==========================================
    // 4. Factual Fasteners (2,100 parts)
    // ==========================================
    const boltCount = 2100;
    const boltGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.02, 6);
    const instancedBolts = new THREE.InstancedMesh(boltGeo, aluminum, boltCount);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < boltCount; i++) {
        dummy.position.set((Math.random() - 0.5) * 4, Math.random() * 2 + 1.0, (Math.random() - 0.5) * 6);
        dummy.rotation.set(Math.random()*Math.PI, 0, 0);
        dummy.updateMatrix();
        instancedBolts.setMatrixAt(i, dummy.matrix);
    }
    instancedBolts.instanceMatrix.needsUpdate = true;
    group.add(instancedBolts);
    
    // Scale adjustment
    group.scale.set(1.2, 1.2, 1.2);
    
    // Dynamic Animation Loop
    group.userData.animate = function(time) {
        const state = group.userData.state;
        state.throttle = (Math.sin(time * 0.0005) + 1.0) / 2.0; 
        
        // Simulating the misting cycle
        if (state.throttle > 0.1) {
            group.userData.animatedMeshes.mist.forEach((m, idx) => {
                // Expanding mist spheres that reset
                const cycle = ((time * 0.002) + (idx * 0.1)) % 1.0;
                const scaleVal = cycle * 3.0; // Mist expands up to 3x size
                m.scale.set(scaleVal, scaleVal, scaleVal);
                m.position.y = 1.3 + (cycle * 1.5); // Mist rises up into the chamber
                // Fake opacity by scaling down towards the end of the cycle
                if (cycle > 0.8) {
                    const fade = (1.0 - cycle) * 5.0;
                    m.scale.set(scaleVal * fade, scaleVal * fade, scaleVal * fade);
                }
            });
        } else {
             // Reset mist if throttle is low
             group.userData.animatedMeshes.mist.forEach((m) => {
                 m.scale.set(0.01, 0.01, 0.01);
             });
        }
    };

    group.userData.parts = parts;
    return group;
}
