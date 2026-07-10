import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const carbonFiberMat = new THREE.MeshPhysicalMaterial({ color: 0x1a1a1a, metalness: 0.8, roughness: 0.6, clearcoat: 0.9, clearcoatRoughness: 0.2 });
    const anodizedRed = new THREE.MeshPhysicalMaterial({ color: 0x990000, metalness: 0.8, roughness: 0.3, clearcoat: 0.5 });
    const lensMat = new THREE.MeshPhysicalMaterial({ color: 0x00aaff, metalness: 0.9, roughness: 0.1, transmission: 0.8, transparent: true });

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.rotors = [];

    // ==========================================
    // 1. PROCEDURAL CAD: Airfoil Rotor Blades
    // ==========================================
    // Mathematically define a NACA airfoil shape for the drone propellers
    const airfoilShape = new THREE.Shape();
    // Simplified teardrop airfoil profile
    airfoilShape.moveTo(0, 0);
    airfoilShape.quadraticCurveTo(0.1, 0.05, 0.3, 0);
    airfoilShape.quadraticCurveTo(0.1, -0.02, 0, 0);
    
    const bladeExtrude = { depth: 1.5, bevelEnabled: true, bevelSize: 0.01, bevelThickness: 0.01, steps: 1 };
    const bladeGeo = new THREE.ExtrudeGeometry(airfoilShape, bladeExtrude);
    
    // Create 4 Rotor Hubs
    for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2 + Math.PI/4;
        const radius = 2.0;
        
        const rotorGroup = new THREE.Group();
        
        // Motor bell (Lathed)
        const bellPoints = [
            new THREE.Vector2(0, 0.2), new THREE.Vector2(0.2, 0.2),
            new THREE.Vector2(0.2, 0), new THREE.Vector2(0, 0)
        ];
        const bellMesh = new THREE.Mesh(new THREE.LatheGeometry(bellPoints, 32), anodizedRed);
        rotorGroup.add(bellMesh);

        // Add 2 airfoil blades per rotor
        for (let b = 0; b < 2; b++) {
            const blade = new THREE.Mesh(bladeGeo, carbonFiberMat);
            blade.rotation.z = (b * Math.PI); // opposite sides
            blade.rotation.y = Math.PI/2; // pitch angle
            // position so extrusion center is at hub
            blade.position.set(0, 0.1, 0); 
            if(b===1) blade.rotation.y = -Math.PI/2;
            rotorGroup.add(blade);
        }
        
        rotorGroup.position.set(Math.cos(angle)*radius, 0.5, Math.sin(angle)*radius);
        group.add(rotorGroup);
        group.userData.animatedMeshes.rotors.push(rotorGroup);
        parts.push({ mesh: rotorGroup, name: `Brushless Motor & Airfoil Rotor ${i+1}`, description: "Mathematical NACA airfoil blades extruded in carbon fiber.", function: "Provides lift and thrust."});
    }

    // ==========================================
    // 2. PROCEDURAL CAD: Spinning LiDAR Puck
    // ==========================================
    // A complex optical sensor array
    const lidarPoints = [
        new THREE.Vector2(0, 0.3), new THREE.Vector2(0.2, 0.3),
        new THREE.Vector2(0.25, 0.2), new THREE.Vector2(0.25, -0.2),
        new THREE.Vector2(0.2, -0.3), new THREE.Vector2(0, -0.3)
    ];
    const lidarGeo = new THREE.LatheGeometry(lidarPoints, 64);
    const lidarPuck = new THREE.Mesh(lidarGeo, carbonFiberMat);
    
    // Add glowing lens arrays
    for(let i=0; i<4; i++) {
        const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.05, 16), lensMat);
        lens.rotation.z = Math.PI/2;
        lens.position.set(Math.cos(i*Math.PI/2)*0.25, 0, Math.sin(i*Math.PI/2)*0.25);
        lidarPuck.add(lens);
    }
    
    lidarPuck.position.set(0, -0.5, 0); // Mounted underneath
    group.add(lidarPuck);
    group.userData.animatedMeshes['lidar'] = lidarPuck;
    parts.push({ mesh: lidarPuck, name: "LiDAR Optical Array", description: "Lathed carbon fiber puck with 4 transmission lenses.", function: "Scans crop health and identifies harvest targets."});

    // ==========================================
    // 3. 11200 Instanced Fasteners
    // ==========================================
    const boltGeo = new THREE.CylinderGeometry(0.005, 0.005, 0.01, 6);
    const instancedBolts = new THREE.InstancedMesh(boltGeo, aluminum, 11200);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < 11200; i++) {
        // Distribute tightly around the drone body
        dummy.position.set((Math.random() - 0.5) * 4, (Math.random() - 0.5) * 1 + 0.5, (Math.random() - 0.5) * 4);
        dummy.updateMatrix();
        instancedBolts.setMatrixAt(i, dummy.matrix);
    }
    instancedBolts.instanceMatrix.needsUpdate = true;
    group.add(instancedBolts);

    // Chassis body
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.4, 1.5), carbonFiberMat);
    body.position.set(0, 0.2, 0);
    group.add(body);
    
    // Dynamic Animation Loop
    group.userData.animate = function(time) {
        const state = group.userData.state;
        state.throttle = (Math.sin(time * 0.0005) + 1.0) / 2.0; 
        
        // Ultra-high speed rotor animation
        const rotorSpeed = 0.5 + (state.throttle * 1.5);
        group.userData.animatedMeshes.rotors.forEach((rotor, idx) => {
            // Counter-rotating pairs
            rotor.rotation.y += (idx % 2 === 0 ? rotorSpeed : -rotorSpeed);
        });

        // Fast LiDAR scan spin
        group.userData.animatedMeshes['lidar'].rotation.y -= 0.1;
    };

    group.userData.parts = parts;
    return group;
}

