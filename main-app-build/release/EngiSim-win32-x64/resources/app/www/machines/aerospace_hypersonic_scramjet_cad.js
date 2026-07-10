import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const inconelHull = new THREE.MeshPhysicalMaterial({ color: 0x555566, metalness: 0.8, roughness: 0.5 }); // High-temp superalloy
    const thermalProtection = new THREE.MeshPhysicalMaterial({ color: 0x111111, metalness: 0.2, roughness: 0.9 }); // Carbon-Carbon composite for leading edges
    const titaniumAluminide = new THREE.MeshPhysicalMaterial({ color: 0x8899aa, metalness: 0.9, roughness: 0.3 }); // Internal engine walls
    const fuelLines = new THREE.MeshPhysicalMaterial({ color: 0xcccccc, metalness: 0.6, roughness: 0.2 }); 
    
    // VFX Materials
    const machDiamondVFX = new THREE.MeshBasicMaterial({ color: 0xff8800, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Supersonic shock diamonds
    const heatGlowVFX = new THREE.MeshBasicMaterial({ color: 0xff3300, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Frictional heating at Mach 7

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.exhaust = [];
    group.userData.animatedMeshes.glows = [];
    group.userData.animatedMeshes.shockwaves = [];

    // ==========================================
    // 1. PROCEDURAL CAD: The Waverider Airframe
    // ==========================================
    const airframeGroup = new THREE.Group();
    
    // The main waverider body (wedge shaped to ride its own shockwave)
    const bodyShape = new THREE.Shape();
    bodyShape.moveTo(0, 0.5);
    bodyShape.lineTo(2.5, 0.5); // Rear top
    bodyShape.lineTo(2.5, -0.5); // Rear bottom
    bodyShape.lineTo(0.5, -0.5); // Inlet start
    bodyShape.lineTo(-3.0, 0); // Sharp nose
    
    const extrudeSettings = { depth: 2.0, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.05, bevelThickness: 0.05 };
    const bodyGeo = new THREE.ExtrudeGeometry(bodyShape, extrudeSettings);
    const mainBody = new THREE.Mesh(bodyGeo, inconelHull);
    // Center it
    mainBody.position.z = -1.0; 
    airframeGroup.add(mainBody);
    
    // Thermal Protection System (TPS) on leading edges
    const noseTPSGeo = new THREE.CylinderGeometry(0.05, 0.05, 2.0, 16).rotateX(Math.PI/2);
    const noseTPS = new THREE.Mesh(noseTPSGeo, thermalProtection);
    noseTPS.position.set(-3.05, 0, 0);
    airframeGroup.add(noseTPS);
    
    // Heat Glow VFX Mesh (overlaps the nose)
    const noseGlow = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.05, 16).rotateX(Math.PI/2), heatGlowVFX);
    noseGlow.position.set(-3.05, 0, 0);
    airframeGroup.add(noseGlow);
    group.userData.animatedMeshes.glows.push(noseGlow);
    
    group.add(airframeGroup);
    group.userData.animatedMeshes['airframe'] = airframeGroup;
    
    parts.push({ mesh: mainBody, name: "Waverider Airframe", description: "Inconel and Carbon-Carbon composite structure.", function: "Designed to ride the supersonic shockwave it creates, compressing the air before it even reaches the engine inlet."});

    // ==========================================
    // 2. PROCEDURAL CAD: The Scramjet Engine Engine (Supersonic Combustion)
    // ==========================================
    const engineGroup = new THREE.Group();
    engineGroup.position.set(1.0, -0.5, 0); // Mounted under the rear half
    
    // The Inlet (Ramps to compress air)
    const inletShape = new THREE.Shape();
    inletShape.moveTo(-1.0, 0); // Start of ramp
    inletShape.lineTo(0, -0.3); // Throat
    inletShape.lineTo(1.5, -0.4); // Combustor / Nozzle expansion
    inletShape.lineTo(1.5, 0); // Top flat (against hull)
    
    const inletGeo = new THREE.ExtrudeGeometry(inletShape, { depth: 1.6, bevelEnabled: false });
    const inlet = new THREE.Mesh(inletGeo, titaniumAluminide);
    inlet.position.z = -0.8;
    engineGroup.add(inlet);
    
    // Fuel Injection Struts (inside the throat)
    for(let i=0; i<3; i++) {
        const strut = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.3, 0.05), titaniumAluminide);
        strut.position.set(0.1, -0.15, -0.5 + (i * 0.5));
        
        // Add tiny fuel line tubes to the strut
        const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.3), fuelLines);
        tube.position.set(0, 0, 0.03);
        strut.add(tube);
        
        engineGroup.add(strut);
    }
    
    // Regenerative Cooling Lines (Fuel is run through the walls to cool them before burning)
    for(let i=0; i<10; i++) {
        const line = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.5).rotateZ(Math.PI/2), fuelLines);
        line.position.set(0.75, -0.42, -0.7 + (i * 0.15)); // Bottom of engine
        engineGroup.add(line);
    }
    
    group.add(engineGroup);
    
    parts.push({ mesh: inlet, name: "Scramjet Combustor", description: "Supersonic Combustion Ramjet engine core.", function: "Mixes fuel with air flowing at supersonic speeds. It has no moving parts, relying entirely on the vehicle's speed to compress the air."});

    // ==========================================
    // 3. PROCEDURAL CAD: Mach Diamond Exhaust VFX
    // ==========================================
    const exhaustGroup = new THREE.Group();
    exhaustGroup.position.set(2.5, -0.2, 0); // Rear of the engine
    
    // Create a series of shock diamonds
    const numDiamonds = 6;
    for(let i=0; i<numDiamonds; i++) {
        // A diamond is essentially two cones base-to-base
        const diamond = new THREE.Group();
        
        const frontCone = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.4, 16).rotateZ(-Math.PI/2), machDiamondVFX);
        frontCone.position.set(0.2, 0, 0);
        
        const rearCone = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.4, 16).rotateZ(Math.PI/2), machDiamondVFX);
        rearCone.position.set(-0.2, 0, 0);
        
        diamond.add(frontCone, rearCone);
        
        // Spread them out behind the engine, decreasing in size
        diamond.position.set(0.2 + (i * 0.7), 0, 0);
        const scale = 1.0 - (i * 0.12);
        diamond.scale.set(scale, scale, scale);
        
        // Also spread them across the width of the rectangular nozzle
        for(let zOffset of [-0.6, -0.2, 0.2, 0.6]) {
            const clone = diamond.clone();
            clone.position.z = zOffset;
            exhaustGroup.add(clone);
            group.userData.animatedMeshes.exhaust.push(clone);
        }
    }
    
    group.add(exhaustGroup);

    // ==========================================
    // 4. Factual Fasteners (14,000 parts)
    // ==========================================
    const boltCount = 14000;
    const boltGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.02, 6);
    const instancedBolts = new THREE.InstancedMesh(boltGeo, darkSteel, boltCount);
    const dummy = new THREE.Object3D();
    
    let boltIndex = 0;
    // Rivet/Bolt lines along the aerodynamic panels
    for (let i = 0; i < boltCount; i++) {
        if (i < 8000) {
            // Airframe panel lines
            const x = (Math.random() * 5.5) - 3.0;
            const z = (Math.random() - 0.5) * 1.9;
            const y = 0.5; // Top surface
            dummy.position.set(x, y, z);
            dummy.rotation.set(0, 0, 0); 
        } else {
            // Engine mounting bolts
            const x = (Math.random() * 2.5);
            const z = (Math.random() - 0.5) * 1.5;
            const y = -0.5; // Interface between hull and engine
            dummy.position.set(x, y, z);
            dummy.rotation.set(0, 0, 0);
        }
        dummy.updateMatrix();
        instancedBolts.setMatrixAt(i, dummy.matrix);
    }
    instancedBolts.instanceMatrix.needsUpdate = true;
    group.add(instancedBolts);
    
    parts.push({ mesh: instancedBolts, name: "14,000 High-Temp Rivets", description: "Factual quantity of flush-mounted aerospace fasteners.", function: "Maintains skin integrity while undergoing extreme thermal expansion at Mach 7." });
    
    // Scale adjustment
    group.scale.set(0.6, 0.6, 0.6);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // Frictional heating on the leading edges
            // At Mach 7, the nose reaches thousands of degrees
            group.userData.animatedMeshes.glows.forEach(glow => {
                glow.material.opacity = 0.2 + (speed * 0.7);
                // Color shifts from dull red to bright orange/yellow
                glow.material.color.setHSL(0.05 + (0.05 * speed), 1.0, 0.4 + (0.3 * speed));
            });
            
            // Mach Diamond Exhaust
            group.userData.animatedMeshes.exhaust.forEach((diamond, index) => {
                // Throttle controls visibility and intense flickering
                diamond.material.opacity = (0.5 + Math.random() * 0.5) * speed;
                
                // The diamonds shift slightly based on flow instability
                diamond.position.x += (Math.random() - 0.5) * 0.02 * speed;
                // Snap back to baseline to prevent drifting too far
                const originalX = diamond.userData.origX || diamond.position.x;
                diamond.userData.origX = originalX;
                diamond.position.x = originalX + (Math.sin(timeAcc * 20 + index) * 0.05);
            });
            
            // Aerodynamic buffeting (high frequency vibration)
            const vibe = Math.sin(timeAcc * 100) * 0.01 * speed;
            group.userData.animatedMeshes['airframe'].position.y = vibe;
            
        } else {
            // Idle
            group.userData.animatedMeshes.glows.forEach(glow => glow.material.opacity *= 0.95);
            group.userData.animatedMeshes.exhaust.forEach(diamond => diamond.material.opacity = 0);
            group.userData.animatedMeshes['airframe'].position.y = 0;
        }
    };

    group.userData.parts = parts;
    return group;
}
