import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const heavySteel = new THREE.MeshPhysicalMaterial({ color: 0x555555, metalness: 0.9, roughness: 0.4 });
    const catYellow = new THREE.MeshPhysicalMaterial({ color: 0xFDB813, metalness: 0.3, roughness: 0.5, clearcoat: 0.8 });
    const chromeMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 1.0, roughness: 0.0, clearcoat: 1.0 });

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};

    // ==========================================
    // 1. PROCEDURAL CAD: The Massive Slewing Ring Bearing
    // ==========================================
    // A heavy mining excavator relies on a massive slewing ring bearing to rotate the house.
    const bearingPoints = [
        new THREE.Vector2(1.2, 0.2), new THREE.Vector2(1.4, 0.2),
        new THREE.Vector2(1.4, 0.1), new THREE.Vector2(1.3, 0.1),
        new THREE.Vector2(1.3, -0.1), new THREE.Vector2(1.4, -0.1),
        new THREE.Vector2(1.4, -0.2), new THREE.Vector2(1.2, -0.2),
        new THREE.Vector2(1.2, -0.1), new THREE.Vector2(1.1, -0.1),
        new THREE.Vector2(1.1, 0.1), new THREE.Vector2(1.2, 0.1)
    ];
    const bearingGeo = new THREE.LatheGeometry(bearingPoints, 64);
    const slewingRing = new THREE.Mesh(bearingGeo, heavySteel);
    slewingRing.position.set(0, 1.0, 0);
    group.add(slewingRing);
    
    // Add the rotating house on top of the bearing
    const houseGroup = new THREE.Group();
    houseGroup.position.set(0, 1.2, 0);
    
    const houseBody = new THREE.Mesh(new THREE.BoxGeometry(3.0, 2.0, 4.0), catYellow);
    houseBody.position.set(0, 1.0, -1.0);
    houseGroup.add(houseBody);

    group.add(houseGroup);
    group.userData.animatedMeshes['house'] = houseGroup;
    parts.push({ mesh: slewingRing, name: "CAD Slewing Ring Bearing", description: "Lathed inner and outer races forming the main rotation joint.", function: "Allows 360-degree rotation of the upper structure."});

    // ==========================================
    // 2. PROCEDURAL CAD: Extruded Boom Linkages
    // ==========================================
    // Creating the complex geometric boom arm using ExtrudeGeometry
    const boomShape = new THREE.Shape();
    boomShape.moveTo(0, 0);
    boomShape.lineTo(0, 1.5);
    boomShape.lineTo(4.0, 3.0); // The "gooseneck" bend
    boomShape.lineTo(4.5, 2.5);
    boomShape.lineTo(1.0, 0.5);
    boomShape.lineTo(1.0, 0);
    
    // Cut out weight-saving holes in the boom plates
    const hole1 = new THREE.Path();
    hole1.absarc(1.5, 1.5, 0.3, 0, Math.PI * 2, false);
    const hole2 = new THREE.Path();
    hole2.absarc(3.0, 2.2, 0.3, 0, Math.PI * 2, false);
    boomShape.holes.push(hole1, hole2);

    const boomSettings = { depth: 0.6, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02 };
    const boomGeo = new THREE.ExtrudeGeometry(boomShape, boomSettings);
    
    const boomMesh = new THREE.Mesh(boomGeo, catYellow);
    // Center the extrusion
    boomMesh.position.set(0, 1.0, -0.3); 
    
    // Attach the boom to the house so it rotates with it
    houseGroup.add(boomMesh);
    group.userData.animatedMeshes['boom'] = boomMesh;
    parts.push({ mesh: boomMesh, name: "Gooseneck Excavator Boom", description: "Mathematically extruded steel plate with weight-saving cutouts.", function: "Provides heavy lifting leverage."});

    // ==========================================
    // 3. 10800 Instanced Fasteners
    // ==========================================
    const boltGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.03, 6);
    const instancedBolts = new THREE.InstancedMesh(boltGeo, heavySteel, 10800);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < 10800; i++) {
        dummy.position.set((Math.random() - 0.5) * 4, Math.random() * 4, (Math.random() - 0.5) * 6);
        dummy.rotation.set(Math.random()*Math.PI, 0, 0);
        dummy.updateMatrix();
        instancedBolts.setMatrixAt(i, dummy.matrix);
    }
    instancedBolts.instanceMatrix.needsUpdate = true;
    houseGroup.add(instancedBolts); // Attach bolts to house so they move

    // Basic Undercarriage tracks
    const track = new THREE.Mesh(new THREE.BoxGeometry(4.0, 1.0, 6.0), heavySteel);
    track.position.set(0, 0.5, 0);
    group.add(track);
    
    // Dynamic Animation Loop
    group.userData.animate = function(time) {
        const state = group.userData.state;
        state.throttle = (Math.sin(time * 0.0005) + 1.0) / 2.0; 
        
        // Slew the house around the bearing
        group.userData.animatedMeshes['house'].rotation.y += state.throttle * 0.05;
        
        // Pivot the boom up and down slightly
        group.userData.animatedMeshes['boom'].rotation.z = Math.sin(time * 0.001) * 0.2 + 0.2;
    };

    group.userData.parts = parts;
    return group;
}

