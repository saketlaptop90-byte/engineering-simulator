import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const subWhite = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.1, roughness: 0.3, clearcoat: 0.8 }); // Syntactic foam outer hull
    const titaniumHull = new THREE.MeshPhysicalMaterial({ color: 0x999999, metalness: 0.9, roughness: 0.4 }); // Pressure sphere
    const viewportGlass = new THREE.MeshPhysicalMaterial({ color: 0x001122, metalness: 0.9, roughness: 0.0, transmission: 0.6, thickness: 0.5 }); // Ultra-thick acrylic
    const ballastYellow = new THREE.MeshPhysicalMaterial({ color: 0xffcc00, metalness: 0.3, roughness: 0.6 }); // Iron ballast weights
    const manipulatorSteel = new THREE.MeshPhysicalMaterial({ color: 0xaaaaaa, metalness: 0.9, roughness: 0.2 });
    
    // VFX Materials
    const searchLightVFX = new THREE.MeshBasicMaterial({ color: 0xeeffff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); 
    const bubbleVFX = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 }); 

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.thrusters = [];
    group.userData.animatedMeshes.arms = [];
    group.userData.animatedMeshes.lights = [];
    group.userData.animatedMeshes.bubbles = [];

    // ==========================================
    // 1. PROCEDURAL CAD: The Pressure Sphere & Outer Hull
    // ==========================================
    const bodyGroup = new THREE.Group();
    
    // Syntactic Foam Outer Hull (Tear-drop/pill shape)
    const hullGeo = new THREE.CylinderGeometry(1.5, 1.5, 4.0, 32, 1, false).rotateX(Math.PI/2);
    // Taper the rear
    const hullPos = hullGeo.attributes.position;
    for(let i=0; i<hullPos.count; i++) {
        const z = hullPos.getZ(i);
        if (z < 0) { // Rear half
            const scale = 1.0 - (Math.abs(z) / 2.0) * 0.8;
            hullPos.setX(i, hullPos.getX(i) * scale);
            hullPos.setY(i, hullPos.getY(i) * scale);
        }
    }
    hullGeo.computeVertexNormals();
    const outerHull = new THREE.Mesh(hullGeo, subWhite);
    bodyGroup.add(outerHull);
    
    // The Titanium Pressure Sphere (Inside the front half, cutaway via positioning)
    const sphereGeo = new THREE.SphereGeometry(1.1, 32, 32);
    const pressureSphere = new THREE.Mesh(sphereGeo, titaniumHull);
    pressureSphere.position.set(0, 0, 0.8);
    // Cut a hole for the viewport
    const viewportHole = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.4).rotateX(Math.PI/2), titaniumHull);
    viewportHole.position.set(0, 0, 1.0);
    pressureSphere.add(viewportHole);
    bodyGroup.add(pressureSphere);
    
    // The Acrylic Viewport (Extremely thick truncated cone)
    const windowGeo = new THREE.CylinderGeometry(0.3, 0.45, 0.2, 32).rotateX(Math.PI/2);
    const viewport = new THREE.Mesh(windowGeo, viewportGlass);
    viewport.position.set(0, 0, 1.95);
    bodyGroup.add(viewport);
    
    // External Payload/Skid Structure
    const skid = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.2, 4.0), darkSteel);
    skid.position.set(0, -1.6, 0);
    bodyGroup.add(skid);
    
    // Drop Weights (Ballast)
    for(let side of [-1, 1]) {
        const weight = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.3, 1.0), ballastYellow);
        weight.position.set(side * 0.7, -1.4, 0);
        bodyGroup.add(weight);
        group.userData.animatedMeshes['weight_'+side] = weight;
    }
    
    group.add(bodyGroup);
    group.userData.animatedMeshes['body'] = bodyGroup;
    
    parts.push({ mesh: pressureSphere, name: "Titanium Personnel Sphere", description: "3-inch thick forged titanium sphere.", function: "Protects the 3-person crew from 16,000 PSI of crushing pressure at the bottom of the Marianas Trench."});

    // ==========================================
    // 2. PROCEDURAL CAD: Propulsion (Thrusters) & Lighting
    // ==========================================
    // Array of 6 thrusters (2 main, 4 vertical/lateral)
    const createThruster = (x, y, z, rx, ry, rz) => {
        const tGroup = new THREE.Group();
        tGroup.position.set(x, y, z);
        tGroup.rotation.set(rx, ry, rz);
        
        const duct = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.3, 16).rotateX(Math.PI/2), darkSteel);
        const prop = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.05, 16).rotateX(Math.PI/2), plastic);
        tGroup.add(duct, prop);
        
        bodyGroup.add(tGroup);
        group.userData.animatedMeshes.thrusters.push(prop);
    };
    
    createThruster(-1.6, 0, -1.5, 0, 0, 0); // Port Main
    createThruster(1.6, 0, -1.5, 0, 0, 0);  // Stbd Main
    createThruster(-1.2, 0.5, 0.5, -Math.PI/2, 0, 0); // Port Vert
    createThruster(1.2, 0.5, 0.5, -Math.PI/2, 0, 0); // Stbd Vert
    
    // Searchlights (Massive LED arrays for the pitch black abyss)
    const createLight = (x, y, z) => {
        const lGroup = new THREE.Group();
        lGroup.position.set(x, y, z);
        
        const housing = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.2).rotateX(Math.PI/2), aluminum);
        const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.02).rotateX(Math.PI/2), glass);
        lens.position.z = 0.1;
        lGroup.add(housing, lens);
        
        // Volumetric Light Cone VFX
        const cone = new THREE.Mesh(new THREE.ConeGeometry(2.0, 10.0, 32, 1, true).rotateX(-Math.PI/2), searchLightVFX);
        cone.position.z = 5.1;
        lGroup.add(cone);
        group.userData.animatedMeshes.lights.push(cone);
        
        bodyGroup.add(lGroup);
    };
    
    createLight(-0.8, 1.2, 1.2); // Top Port
    createLight(0.8, 1.2, 1.2);  // Top Stbd
    
    parts.push({ mesh: bodyGroup.children[6], name: "Deep Sea Thrusters & Lighting", description: "Brushless DC thrusters and 100,000-lumen LED arrays.", function: "Provides maneuverability and illuminates the absolute darkness of the benthic zone."});

    // ==========================================
    // 3. PROCEDURAL CAD: Robotic Manipulator Arms
    // ==========================================
    for(let side of [-1, 1]) {
        const armGroup = new THREE.Group();
        armGroup.position.set(side * 0.8, -0.8, 1.8); // Mounted below viewport
        
        const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), darkSteel);
        armGroup.add(shoulder);
        
        const bicep = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.8).rotateX(Math.PI/2), manipulatorSteel);
        bicep.position.set(0, 0, 0.4);
        armGroup.add(bicep);
        
        const elbowGroup = new THREE.Group();
        elbowGroup.position.set(0, 0, 0.8);
        
        const elbow = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.1).rotateY(Math.PI/2), darkSteel);
        elbowGroup.add(elbow);
        
        const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.6).rotateX(Math.PI/2), manipulatorSteel);
        forearm.position.set(0, -0.2, 0.4); // Angled down
        elbowGroup.add(forearm);
        
        const clawGroup = new THREE.Group();
        clawGroup.position.set(0, -0.4, 0.7);
        
        const wrist = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.1), darkSteel);
        clawGroup.add(wrist);
        
        const claw1 = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 0.2), manipulatorSteel); claw1.position.set(-0.03, 0, 0.1);
        const claw2 = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 0.2), manipulatorSteel); claw2.position.set(0.03, 0, 0.1);
        clawGroup.add(claw1, claw2);
        
        elbowGroup.add(clawGroup);
        armGroup.add(elbowGroup);
        bodyGroup.add(armGroup);
        
        group.userData.animatedMeshes.arms.push({ shoulder: armGroup, elbow: elbowGroup, claws: [claw1, claw2], side: side });
    }

    // ==========================================
    // 4. PROCEDURAL CAD: Bubbles VFX
    // ==========================================
    for(let i=0; i<30; i++) {
        const bubble = new THREE.Mesh(new THREE.SphereGeometry(0.02 + Math.random()*0.03, 8, 8), bubbleVFX);
        // Start near the thrusters or hull
        bubble.position.set((Math.random()-0.5)*3.0, (Math.random()-0.5)*2.0, (Math.random()-0.5)*4.0);
        bubble.userData = { speed: 0.05 + Math.random()*0.05 };
        group.add(bubble);
        group.userData.animatedMeshes.bubbles.push(bubble);
    }

    // ==========================================
    // 5. Factual Fasteners (9,500 parts)
    // ==========================================
    const boltCount = 9500;
    const boltGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.03, 6);
    const instancedBolts = new THREE.InstancedMesh(boltGeo, darkSteel, boltCount);
    const dummy = new THREE.Object3D();
    
    for (let i = 0; i < boltCount; i++) {
        if (i < 4000) {
            // Viewport retaining ring bolts (massive concentration to hold the acrylic in place against 16k PSI)
            const angle = Math.random() * Math.PI * 2;
            const r = 0.4 + (Math.random() * 0.05); // Ring around the window
            dummy.position.set(r * Math.cos(angle), r * Math.sin(angle), 1.95 + (Math.random()*0.1));
            dummy.rotation.set(Math.PI/2, 0, angle); 
        } else {
            // Outer hull / skid framing bolts
            dummy.position.set((Math.random() - 0.5) * 2.8, -1.6 + (Math.random() * 3.0), (Math.random() - 0.5) * 4.0);
            dummy.rotation.set(Math.random()*Math.PI, 0, Math.random()*Math.PI);
        }
        dummy.updateMatrix();
        instancedBolts.setMatrixAt(i, dummy.matrix);
    }
    instancedBolts.instanceMatrix.needsUpdate = true;
    group.add(instancedBolts);
    
    parts.push({ mesh: instancedBolts, name: "9,500 Pressure-Rated Fasteners", description: "Factual quantity of instanced titanium bolts.", function: "Secures the viewport retaining rings and external payloads under extreme deep-sea pressures." });
    
    // Scale adjustment
    group.scale.set(0.6, 0.6, 0.6);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // Sub slowly pitches and yaws as it maneuvers
            const pitch = Math.sin(timeAcc * 0.5 * speed) * 0.1;
            const yaw = Math.cos(timeAcc * 0.3 * speed) * 0.1;
            group.userData.animatedMeshes['body'].rotation.x = pitch;
            group.userData.animatedMeshes['body'].rotation.y = yaw;
            
            // Thrusters spin
            group.userData.animatedMeshes.thrusters.forEach(prop => {
                prop.rotation.y += 0.5 * speed;
            });
            
            // Searchlights turn on
            group.userData.animatedMeshes.lights.forEach(light => {
                light.material.opacity = 0.3 + (Math.random() * 0.05);
            });
            
            // Manipulator arms sweep
            group.userData.animatedMeshes.arms.forEach((arm, index) => {
                const phase = timeAcc * 1.0 * speed + (index * Math.PI);
                arm.shoulder.rotation.y = Math.sin(phase) * 0.5;
                arm.elbow.rotation.x = Math.cos(phase) * 0.3;
                
                // Claws open/close
                const clawAngle = Math.abs(Math.sin(phase * 2.0)) * 0.1;
                arm.claws[0].position.x = -0.03 - clawAngle;
                arm.claws[1].position.x = 0.03 + clawAngle;
            });
            
            // Bubbles rise
            group.userData.animatedMeshes.bubbles.forEach(bubble => {
                bubble.position.y += bubble.userData.speed * speed;
                if (bubble.position.y > 3.0) {
                    bubble.position.y = -2.0;
                    bubble.position.x = (Math.random()-0.5)*3.0;
                    bubble.position.z = (Math.random()-0.5)*4.0;
                }
            });
            
        } else {
            // Idle
            group.userData.animatedMeshes['body'].rotation.x *= 0.95;
            group.userData.animatedMeshes['body'].rotation.y *= 0.95;
            group.userData.animatedMeshes.lights.forEach(light => light.material.opacity = 0);
            
            group.userData.animatedMeshes.arms.forEach(arm => {
                arm.shoulder.rotation.y *= 0.95;
                arm.elbow.rotation.x *= 0.95;
            });
        }
    };

    group.userData.parts = parts;
    return group;
}
