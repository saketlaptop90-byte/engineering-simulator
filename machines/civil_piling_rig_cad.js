import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const heavySteel = new THREE.MeshPhysicalMaterial({ color: 0x555555, metalness: 0.9, roughness: 0.4 });
    const rigYellow = new THREE.MeshPhysicalMaterial({ color: 0xFDB813, metalness: 0.3, roughness: 0.5, clearcoat: 0.8 });
    const chromeMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 1.0, roughness: 0.0, clearcoat: 1.0 });

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};

    // ==========================================
    // 1. PROCEDURAL CAD: The Vertical Leader
    // ==========================================
    // The tall mast that guides the hammer
    const leaderShape = new THREE.Shape();
    leaderShape.moveTo(-0.5, -0.5);
    leaderShape.lineTo(0.5, -0.5);
    leaderShape.lineTo(0.3, 0.5);
    leaderShape.lineTo(-0.3, 0.5);
    leaderShape.lineTo(-0.5, -0.5);
    
    // Hollow track for hammer
    const trackHole = new THREE.Path();
    trackHole.moveTo(-0.2, -0.4);
    trackHole.lineTo(0.2, -0.4);
    trackHole.lineTo(0.1, 0.3);
    trackHole.lineTo(-0.1, 0.3);
    trackHole.lineTo(-0.2, -0.4);
    leaderShape.holes.push(trackHole);

    const leaderGeo = new THREE.ExtrudeGeometry(leaderShape, { depth: 15.0, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05 });
    const leader = new THREE.Mesh(leaderGeo, heavySteel);
    
    leader.rotation.x = -Math.PI / 2; // Stand vertically
    leader.position.set(0, 2.0, 3.0); // Front of rig
    
    group.add(leader);
    parts.push({ mesh: leader, name: "CAD Vertical Leader", description: "Extruded steel mast with internal track.", function: "Guides the diesel hammer perfectly vertical."});

    // ==========================================
    // 2. PROCEDURAL CAD: The Diesel Hammer
    // ==========================================
    // Massive lathed impact hammer
    const hammerPoints = [
        new THREE.Vector2(0, 0), new THREE.Vector2(0.4, 0),
        new THREE.Vector2(0.4, 0.5), new THREE.Vector2(0.6, 0.6),
        new THREE.Vector2(0.6, 2.0), new THREE.Vector2(0.4, 2.1),
        new THREE.Vector2(0.4, 3.0), new THREE.Vector2(0, 3.0)
    ];
    const hammerGeo = new THREE.LatheGeometry(hammerPoints, 32);
    const dieselHammer = new THREE.Mesh(hammerGeo, chromeMat);
    
    dieselHammer.position.set(0, 8.0, 3.0); // Starts midway up the leader
    
    group.add(dieselHammer);
    group.userData.animatedMeshes['hammer'] = dieselHammer;
    parts.push({ mesh: dieselHammer, name: "Lathed Diesel Hammer", description: "Heavy cylindrical mass.", function: "Impacts the pile into the earth via explosive diesel combustion."});

    // ==========================================
    // 3. Factual Fasteners (11,000 parts)
    // ==========================================
    const boltCount = 11000;
    const boltGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.04, 6);
    const instancedBolts = new THREE.InstancedMesh(boltGeo, machinedSteel, boltCount);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < boltCount; i++) {
        dummy.position.set((Math.random() - 0.5) * 4, Math.random() * 15, (Math.random() - 0.5) * 6);
        dummy.rotation.set(Math.random()*Math.PI, 0, 0);
        dummy.updateMatrix();
        instancedBolts.setMatrixAt(i, dummy.matrix);
    }
    instancedBolts.instanceMatrix.needsUpdate = true;
    group.add(instancedBolts);
    parts.push({ mesh: instancedBolts, name: "11,000 Assembly Fasteners", description: "Factual quantity of instanced bolts.", function: "Structural rigidity." });

    // Chassis body and tracks
    const body = new THREE.Mesh(new THREE.BoxGeometry(3.0, 2.0, 5.0), rigYellow);
    body.position.set(0, 1.5, 0);
    group.add(body);
    
    // Scale adjustment for visibility
    group.scale.set(0.4, 0.4, 0.4);
    
    // Dynamic Animation Loop
    group.userData.animate = function(time) {
        const state = group.userData.state;
        state.throttle = (Math.sin(time * 0.0005) + 1.0) / 2.0; 
        
        // Simulating the drop hammer mechanics
        if (state.throttle > 0.1) {
            // Sawtooth wave for lifting and suddenly dropping
            const cycle = (time * 0.002 * state.throttle) % 1.0; 
            if (cycle < 0.9) {
                // Lifting slowly
                group.userData.animatedMeshes['hammer'].position.y = 8.0 + (cycle * 5.0);
            } else {
                // Dropping instantly (impact)
                group.userData.animatedMeshes['hammer'].position.y = 8.0;
            }
        }
    };

    group.userData.parts = parts;
    return group;
}
