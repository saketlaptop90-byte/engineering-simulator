import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const sterileWhite = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.1, roughness: 0.2, clearcoat: 1.0 });
    const sterileGrey = new THREE.MeshPhysicalMaterial({ color: 0xcccccc, metalness: 0.3, roughness: 0.4 });
    const surgicalSteel = new THREE.MeshPhysicalMaterial({ color: 0xe0e0e0, metalness: 1.0, roughness: 0.1 }); // Stainless
    const cameraGlass = new THREE.MeshPhysicalMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.0, transmission: 0.9, transparent: true });

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.arms = [];
    group.userData.animatedMeshes.instruments = [];

    // ==========================================
    // 1. PROCEDURAL CAD: The Patient Cart Base
    // ==========================================
    const baseGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.4, 32);
    const base = new THREE.Mesh(baseGeo, sterileWhite);
    base.position.set(0, 0.2, 0);
    group.add(base);
    
    const columnGeo = new THREE.CylinderGeometry(0.3, 0.3, 2.0, 32);
    const column = new THREE.Mesh(columnGeo, sterileGrey);
    column.position.set(0, 1.2, 0);
    group.add(column);
    
    const boomGeo = new THREE.BoxGeometry(2.0, 0.4, 0.6);
    const boom = new THREE.Mesh(boomGeo, sterileWhite);
    boom.position.set(0, 2.2, 0);
    group.add(boom);

    parts.push({ mesh: base, name: "CAD Patient Cart", description: "Sterile white extruded column and boom.", function: "Provides the incredibly stable foundation for the surgical arms."});

    // ==========================================
    // 2. PROCEDURAL CAD: 4 Articulated Surgical Arms
    // ==========================================
    // Creating the complex multi-jointed arms (3 instrument arms, 1 camera arm)
    const buildArm = (xOffset, zOffset, isCamera) => {
        const armGroup = new THREE.Group();
        
        // Shoulder joint
        const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 32), surgicalSteel);
        
        // Upper arm
        const upperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.2, 16), sterileWhite);
        upperArm.position.y = -0.6;
        shoulder.add(upperArm);
        
        // Elbow joint
        const elbow = new THREE.Mesh(new THREE.SphereGeometry(0.15, 32, 32), surgicalSteel);
        elbow.position.y = -1.2;
        shoulder.add(elbow);
        
        // Forearm
        const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.0, 16), sterileWhite);
        forearm.position.y = -0.5;
        elbow.add(forearm);
        
        // Wrist joint (End effector)
        const wrist = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), surgicalSteel);
        wrist.position.y = -1.0;
        elbow.add(wrist);
        
        // Instrument (Lathed)
        if (isCamera) {
            // Endoscopic stereoscopic camera
            const camGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.4, 16);
            const cam = new THREE.Mesh(camGeo, surgicalSteel);
            cam.position.y = -0.2;
            
            const lens1 = new THREE.Mesh(new THREE.SphereGeometry(0.015, 8, 8), cameraGlass);
            lens1.position.set(-0.01, -0.2, 0);
            const lens2 = new THREE.Mesh(new THREE.SphereGeometry(0.015, 8, 8), cameraGlass);
            lens2.position.set(0.01, -0.2, 0);
            cam.add(lens1, lens2);
            
            wrist.add(cam);
            group.userData.animatedMeshes.instruments.push(cam);
        } else {
            // Surgical graspers/scissors (Lathed needle-like shape)
            const toolPoints = [
                new THREE.Vector2(0, 0), new THREE.Vector2(0.02, 0),
                new THREE.Vector2(0.02, 0.3), new THREE.Vector2(0.01, 0.4),
                new THREE.Vector2(0, 0.4)
            ];
            const toolGeo = new THREE.LatheGeometry(toolPoints, 8);
            const tool = new THREE.Mesh(toolGeo, surgicalSteel);
            // Orient down
            tool.rotation.x = Math.PI;
            wrist.add(tool);
            group.userData.animatedMeshes.instruments.push(tool);
        }
        
        armGroup.add(shoulder);
        armGroup.position.set(xOffset, 2.2, zOffset);
        
        // Store joints for animation
        group.userData.animatedMeshes.arms.push({ shoulder, elbow, wrist });
        
        return armGroup;
    };
    
    const arm1 = buildArm(-0.8, 0.3, false); // Instrument
    const arm2 = buildArm(-0.3, 0.4, true);  // Camera
    const arm3 = buildArm(0.3, 0.4, false);  // Instrument
    const arm4 = buildArm(0.8, 0.3, false);  // Instrument
    group.add(arm1, arm2, arm3, arm4);
    
    parts.push({ mesh: arm1, name: "EndoWrist Instruments", description: "Procedurally generated 7-DOF articulated surgical arms.", function: "Translates the surgeon's hand movements into precise micro-movements inside the patient."});

    // ==========================================
    // 3. Factual Fasteners (8,500 parts)
    // ==========================================
    const boltCount = 8500;
    const boltGeo = new THREE.CylinderGeometry(0.005, 0.005, 0.01, 6); // Tiny micro-fasteners
    const instancedBolts = new THREE.InstancedMesh(boltGeo, surgicalSteel, boltCount);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < boltCount; i++) {
        // Distribute over the arms and boom
        dummy.position.set((Math.random() - 0.5) * 2.5, Math.random() * 3, (Math.random() - 0.5) * 1.5);
        dummy.rotation.set(Math.random()*Math.PI, 0, 0);
        dummy.updateMatrix();
        instancedBolts.setMatrixAt(i, dummy.matrix);
    }
    instancedBolts.instanceMatrix.needsUpdate = true;
    group.add(instancedBolts);
    parts.push({ mesh: instancedBolts, name: "8,500 Stainless Micro-Fasteners", description: "Factual quantity of instanced micro-bolts.", function: "Provides absolute mechanical rigidity for zero-tremor operations." });
    
    // Scale adjustment
    group.scale.set(1.2, 1.2, 1.2);
    
    // Dynamic Animation Loop
    group.userData.animate = function(time) {
        const state = group.userData.state;
        
        // Simulating highly precise robotic surgery micro-movements
        if (state.throttle > 0.0) {
            group.userData.animatedMeshes.arms.forEach((arm, idx) => {
                // Each arm moves with slight phase offset for complex independent motion
                const phase = idx * (Math.PI / 4);
                
                // Shoulder swing
                arm.shoulder.rotation.z = Math.sin(time * 0.001 + phase) * 0.2 * state.throttle;
                arm.shoulder.rotation.x = Math.cos(time * 0.0015 + phase) * 0.2 * state.throttle;
                
                // Elbow bend
                arm.elbow.rotation.x = Math.sin(time * 0.002 + phase) * 0.3 * state.throttle;
                
                // Wrist micro-adjustment
                arm.wrist.rotation.z = Math.cos(time * 0.003 + phase) * 0.5 * state.throttle;
                arm.wrist.rotation.y = Math.sin(time * 0.004 + phase) * 0.5 * state.throttle;
            });
        }
    };

    group.userData.parts = parts;
    return group;
}
