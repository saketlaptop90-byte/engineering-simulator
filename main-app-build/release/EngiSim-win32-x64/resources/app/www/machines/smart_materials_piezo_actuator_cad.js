import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const pztCeramic = new THREE.MeshPhysicalMaterial({ color: 0xddddcc, metalness: 0.1, roughness: 0.8 }); // Lead Zirconate Titanate
    const electrodeLayer = new THREE.MeshPhysicalMaterial({ color: 0xdddddd, metalness: 1.0, roughness: 0.1 }); // Silver/Palladium
    const flexureSteel = new THREE.MeshPhysicalMaterial({ color: 0xaaccff, metalness: 0.8, roughness: 0.4 }); // Spring steel
    const wireInsulation = new THREE.MeshPhysicalMaterial({ color: 0xcc2222, metalness: 0.1, roughness: 0.6 });

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};

    // ==========================================
    // 1. PROCEDURAL CAD: The Piezoelectric Stack
    // ==========================================
    const stackGroup = new THREE.Group();
    
    // A piezoelectric actuator is made of hundreds of alternating layers of PZT ceramic and metal electrodes
    // We will simulate this visually with a ribbed/layered texture block, or individual instances if small enough
    const layerCount = 100;
    const layerThickness = 0.02;
    const stackHeight = layerCount * layerThickness;
    
    // To keep performance high while maintaining CAD fidelity, we'll use a striped texture or instanced mesh
    // InstancedMesh is best for CAD fidelity
    const pztGeo = new THREE.BoxGeometry(0.8, layerThickness * 0.8, 0.8);
    const electrodeGeo = new THREE.BoxGeometry(0.82, layerThickness * 0.2, 0.82);
    
    const instancedPZT = new THREE.InstancedMesh(pztGeo, pztCeramic, layerCount);
    const instancedElectrodes = new THREE.InstancedMesh(electrodeGeo, electrodeLayer, layerCount);
    
    const dummy = new THREE.Object3D();
    for(let i=0; i<layerCount; i++) {
        const yPos = (i * layerThickness) - (stackHeight / 2);
        
        dummy.position.set(0, yPos, 0);
        dummy.updateMatrix();
        
        instancedPZT.setMatrixAt(i, dummy.matrix);
        instancedElectrodes.setMatrixAt(i, dummy.matrix);
    }
    
    instancedPZT.instanceMatrix.needsUpdate = true;
    instancedElectrodes.instanceMatrix.needsUpdate = true;
    
    stackGroup.add(instancedPZT, instancedElectrodes);
    
    // High Voltage wiring
    const wire1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, stackHeight + 0.5), wireInsulation);
    wire1.position.set(-0.45, 0, 0);
    const wire2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, stackHeight + 0.5), darkSteel);
    wire2.position.set(0.45, 0, 0);
    stackGroup.add(wire1, wire2);

    group.add(stackGroup);
    group.userData.animatedMeshes['piezoStack'] = stackGroup; // The stack scales on Y axis

    parts.push({ mesh: instancedPZT, name: "PZT Ceramic Stack", description: "100 alternating layers of Lead Zirconate Titanate and Silver.", function: "Expands at the sub-nanometer level when exposed to high voltages via the inverse piezoelectric effect."});

    // ==========================================
    // 2. PROCEDURAL CAD: Flexure Amplification Frame
    // ==========================================
    // Piezo expansion is tiny (~0.1%). We use a mechanical flexure frame to amplify it.
    // We will model an elliptical flexure mount.
    const flexureGroup = new THREE.Group();
    
    // Create an elliptical ring using a flattened torus
    const frameGeo = new THREE.TorusGeometry(1.5, 0.2, 32, 64);
    const frame = new THREE.Mesh(frameGeo, flexureSteel);
    // Flatten it into a diamond/ellipse shape
    frame.scale.set(1.0, 1.4, 1.0); 
    
    // End effectors (where the load connects)
    const mountTop = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.2, 0.6), chrome);
    mountTop.position.set(0, 2.1, 0);
    const mountBot = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.2, 0.6), chrome);
    mountBot.position.set(0, -2.1, 0);
    
    // Inner blocks that clamp the piezo stack
    const clampLeft = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.8, 0.8), chrome);
    clampLeft.position.set(-1.3, 0, 0);
    const clampRight = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.8, 0.8), chrome);
    clampRight.position.set(1.3, 0, 0);

    flexureGroup.add(frame, mountTop, mountBot, clampLeft, clampRight);
    
    // Rotate so the piezo stack sits horizontally between the clamps
    flexureGroup.rotation.z = Math.PI / 2;
    group.add(flexureGroup);
    
    // Since the flexure group is rotated 90 degrees, its local Y axis aligns with global X, 
    // and local X aligns with global Y.
    // When the stack expands on global X (which is local Y for flexure), the flexure contracts on global Y (local X).
    group.userData.animatedMeshes['flexure'] = flexureGroup; 
    
    // We need to rotate the stack to match the flexure
    stackGroup.rotation.z = Math.PI / 2;

    parts.push({ mesh: frame, name: "Kinematic Flexure Frame", description: "Precision machined spring steel frame.", function: "Mechanically amplifies the microscopic expansion of the piezo stack into usable macroscopic displacement."});

    // ==========================================
    // 3. PROCEDURAL CAD: Base Mount
    // ==========================================
    const base = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.2, 1.0), darkSteel);
    base.position.set(0, -1.8, 0); // Attaches to the bottom mount (remember flexure is rotated, so global Y is what we mount to)
    group.add(base);
    
    // ==========================================
    // 4. Factual Fasteners (600 parts)
    // ==========================================
    const boltCount = 600;
    const boltGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.03, 6);
    const instancedBolts = new THREE.InstancedMesh(boltGeo, chrome, boltCount);
    const bDummy = new THREE.Object3D();
    for (let i = 0; i < boltCount; i++) {
        // Distribute tightly on the mounting blocks and clamps
        bDummy.position.set((Math.random() - 0.5) * 1.5, -1.7 + Math.random()*0.1, (Math.random() - 0.5) * 0.8);
        bDummy.rotation.set(0, 0, 0);
        bDummy.updateMatrix();
        instancedBolts.setMatrixAt(i, bDummy.matrix);
    }
    instancedBolts.instanceMatrix.needsUpdate = true;
    group.add(instancedBolts);
    parts.push({ mesh: instancedBolts, name: "600 Micro-Bolts", description: "Factual quantity of instanced retaining bolts.", function: "Clamps the pre-loaded flexure frame rigidly to the optical baseplate." });
    
    // Scale adjustment (Actuators are usually small, but scale up for sim)
    group.scale.set(2.0, 2.0, 2.0);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        // Simulating the Piezoelectric Effect
        // The throttle represents the high voltage input (0 to 150V)
        if (state.throttle > 0.0) {
            const voltage = state.throttle;
            
            // We'll apply an oscillating signal for visual effect (like a high frequency vibration)
            // or just a static expansion. Let's do a static expansion based on throttle + slight vibration
            const expansion = voltage * 0.15; // 15% expansion (exaggerated for visual effect)
            const vibration = Math.sin(timeAcc * 50) * 0.02 * voltage; // High freq buzz
            
            const totalExpansion = expansion + vibration;
            
            // Stack expands (its local Y axis since it's rotated)
            group.userData.animatedMeshes['piezoStack'].scale.y = 1.0 + totalExpansion;
            
            // Flexure frame amplifies this. 
            // It gets pushed outward on its local Y (global X), causing it to contract on its local X (global Y)
            group.userData.animatedMeshes['flexure'].scale.y = 1.0 + totalExpansion; // Widens
            group.userData.animatedMeshes['flexure'].scale.x = 1.0 - (totalExpansion * 2.5); // Amplified contraction
            
        } else {
            // Return to rest shape
            group.userData.animatedMeshes['piezoStack'].scale.y = 1.0;
            group.userData.animatedMeshes['flexure'].scale.y = 1.0;
            group.userData.animatedMeshes['flexure'].scale.x = 1.0;
        }
    };

    group.userData.parts = parts;
    return group;
}
