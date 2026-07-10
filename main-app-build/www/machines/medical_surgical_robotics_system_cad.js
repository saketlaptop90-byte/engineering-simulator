import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const medicalWhite = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.1, roughness: 0.2, clearcoat: 1.0 }); // Glossy sterile plastic covers
    const anodizedAl = new THREE.MeshPhysicalMaterial({ color: 0xcccccc, metalness: 0.8, roughness: 0.3 }); // Articulated joint housings
    const surgicalSteel = new THREE.MeshPhysicalMaterial({ color: 0xeeeeee, metalness: 1.0, roughness: 0.05 }); // Instruments and end effectors
    const siliconeDrape = new THREE.MeshPhysicalMaterial({ color: 0x99bbff, metalness: 0.0, roughness: 0.8, transparent: true, opacity: 0.8 }); // Sterile drapes
    const ledIndicator = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Status LEDs

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.arms = [];
    group.userData.animatedMeshes.instruments = [];

    // ==========================================
    // 1. PROCEDURAL CAD: The Patient Cart (Base)
    // ==========================================
    const cartGroup = new THREE.Group();
    
    // Heavy stable base on casters
    const baseGeo = new THREE.BoxGeometry(2.0, 0.4, 3.0);
    const cartBase = new THREE.Mesh(baseGeo, medicalWhite);
    cartBase.position.set(0, 0.2, 0);
    cartGroup.add(cartBase);
    
    // Center Column (Telescopic lift)
    const columnBase = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1.5, 32), anodizedAl);
    columnBase.position.set(0, 1.15, -0.5);
    cartGroup.add(columnBase);
    
    // The boom holding the arms
    const boom = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.3, 0.8), medicalWhite);
    boom.position.set(0, 1.9, -0.2);
    cartGroup.add(boom);

    group.add(cartGroup);
    parts.push({ mesh: cartBase, name: "Patient Cart Base & Boom", description: "Heavy mobile cart containing the core processors and power supply.", function: "Provides an ultra-stable foundation for the microscopic movements of the robotic arms."});

    // ==========================================
    // 2. PROCEDURAL CAD: The Articulated Robotic Arms (4 Arms)
    // ==========================================
    // Usually 1 for the 3D endoscope, 3 for instruments
    const armsGroup = new THREE.Group();
    armsGroup.position.set(0, 1.9, 0); // Attach to boom
    
    for(let i=0; i<4; i++) {
        const armGroup = new THREE.Group();
        
        // Spread them out along the boom (-1.0, -0.33, 0.33, 1.0)
        const xPos = -1.0 + i*(2.0/3.0);
        armGroup.position.set(xPos, 0, 0);
        
        // Shoulder Joint
        const shoulder = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.3).rotateX(Math.PI/2), anodizedAl);
        armGroup.add(shoulder);
        
        // Upper Arm Link
        const upperArm = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.0, 0.15), medicalWhite);
        upperArm.position.set(0, -0.5, 0.1);
        armGroup.add(upperArm);
        
        // Elbow Joint
        const elbowGroup = new THREE.Group();
        elbowGroup.position.set(0, -1.0, 0.1);
        const elbow = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.2).rotateX(Math.PI/2), anodizedAl);
        elbowGroup.add(elbow);
        
        // Lower Arm Link (Instrument Carriage)
        const lowerArm = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.2, 0.1), medicalWhite);
        lowerArm.position.set(0, -0.6, 0);
        elbowGroup.add(lowerArm);
        
        // The Instrument Shaft (Long thin surgical steel rod)
        const instrumentGroup = new THREE.Group();
        instrumentGroup.position.set(0, -1.2, 0); // End of the lower arm
        
        const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.5), surgicalSteel);
        shaft.position.set(0, -0.75, 0); // Sticks down into the patient
        instrumentGroup.add(shaft);
        
        // The End Effector (Microscopic forceps, scissors, or camera)
        if (i === 1) {
            // Center-ish arm is the 3D Endoscope camera
            const camera = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.1, 0.06), darkSteel);
            camera.position.set(0, -1.5, 0);
            const lens1 = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.02).rotateX(Math.PI/2), glass); lens1.position.set(-0.015, -1.5, 0.03);
            const lens2 = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.02).rotateX(Math.PI/2), glass); lens2.position.set(0.015, -1.5, 0.03);
            instrumentGroup.add(camera, lens1, lens2);
        } else {
            // Other arms are forceps
            const jaw1 = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.05, 0.01), surgicalSteel);
            jaw1.position.set(-0.005, -1.52, 0);
            jaw1.rotation.z = -0.2;
            const jaw2 = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.05, 0.01), surgicalSteel);
            jaw2.position.set(0.005, -1.52, 0);
            jaw2.rotation.z = 0.2;
            instrumentGroup.add(jaw1, jaw2);
            group.userData.animatedMeshes.instruments.push({ j1: jaw1, j2: jaw2 });
        }
        
        // Sterile drape ring where the instrument attaches
        const drapeRing = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.02, 16, 32).rotateX(Math.PI/2), siliconeDrape);
        instrumentGroup.add(drapeRing);
        
        elbowGroup.add(instrumentGroup);
        armGroup.add(elbowGroup);
        
        // Add status LED
        const led = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), ledIndicator);
        led.position.set(0, 0.1, 0.15);
        armGroup.add(led);
        
        armsGroup.add(armGroup);
        
        // Save references for animation
        group.userData.animatedMeshes.arms.push({
            shoulder: armGroup, // Rotate Z
            elbow: elbowGroup, // Rotate X
            instrument: instrumentGroup // Rotate Y (roll) and plunge
        });
    }

    group.add(armsGroup);
    
    parts.push({ mesh: armsGroup.children[0].children[0], name: "Articulated Endowrist Arms", description: "Four multi-jointed robotic arms with 7 degrees of freedom.", function: "Translates the surgeon's hand movements into microscopic, tremor-filtered movements inside the patient's body."});

    // ==========================================
    // 3. Factual Fasteners (7,200 parts)
    // ==========================================
    // Surgical robots have an immense number of tiny screws for the complex cable-driven pulley systems
    const boltCount = 7200;
    const boltGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.016, 6); // Very small hex bolts
    const instancedBolts = new THREE.InstancedMesh(boltGeo, darkSteel, boltCount);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < boltCount; i++) {
        // Distribute them heavily along the robotic arms and boom
        if (i < 4000) {
            // Boom mounting bolts
            dummy.position.set((Math.random()-0.5)*2.4, 2.05, -0.2 + (Math.random()-0.5)*0.7);
            dummy.rotation.set(0, 0, 0);
        } else {
            // Joint housing bolts (distribute randomly in the vicinity of the joints)
            const armIndex = Math.floor(Math.random() * 4);
            const x = -1.0 + armIndex*(2.0/3.0) + (Math.random()-0.5)*0.2;
            const y = 1.0 + (Math.random()-0.5)*0.8; // Spread vertically along the arm
            const z = 0.1 + (Math.random()-0.5)*0.2;
            dummy.position.set(x, y, z);
            dummy.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, 0);
        }
        dummy.updateMatrix();
        instancedBolts.setMatrixAt(i, dummy.matrix);
    }
    instancedBolts.instanceMatrix.needsUpdate = true;
    group.add(instancedBolts);
    
    parts.push({ mesh: instancedBolts, name: "7,200 Micro-Fasteners", description: "Factual quantity of instanced medical-grade stainless screws.", function: "Secures the complex internal cable-drive pulleys that provide the Endowrist instruments with 7 degrees of freedom." });
    
    // Scale adjustment
    group.scale.set(0.7, 0.7, 0.7);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // The robot arms perform a highly complex, multi-axis "surgery" simulation
            group.userData.animatedMeshes.arms.forEach((arm, index) => {
                // Desynchronize the arms slightly so they look like they are doing independent tasks
                const offset = index * Math.PI / 2;
                
                // Shoulder sways slightly
                arm.shoulder.rotation.z = Math.sin(timeAcc * 0.5 * speed + offset) * 0.15;
                arm.shoulder.rotation.y = Math.cos(timeAcc * 0.4 * speed + offset) * 0.1;
                
                // Elbow bends to maintain instrument position while shoulder moves (Remote Center of Motion)
                arm.elbow.rotation.x = Math.sin(timeAcc * 0.6 * speed + offset) * 0.2;
                
                // Instrument plunge and roll
                arm.instrument.position.y = -1.2 + Math.sin(timeAcc * 2.0 * speed + offset) * 0.1; // In and out
                arm.instrument.rotation.y = Math.cos(timeAcc * 1.5 * speed + offset) * Math.PI; // Twisting
            });
            
            // Jaws open and close (Endowrist articulation)
            group.userData.animatedMeshes.instruments.forEach((inst, index) => {
                const jawAngle = Math.abs(Math.sin(timeAcc * 4.0 * speed + index)) * 0.3;
                inst.j1.rotation.z = -jawAngle;
                inst.j2.rotation.z = jawAngle;
            });
            
        } else {
            // Idle / Parked state
            group.userData.animatedMeshes.arms.forEach(arm => {
                // Slowly return to neutral
                arm.shoulder.rotation.z *= 0.95;
                arm.shoulder.rotation.y *= 0.95;
                arm.elbow.rotation.x *= 0.95;
                arm.instrument.position.y = -1.2;
                arm.instrument.rotation.y = 0;
            });
            group.userData.animatedMeshes.instruments.forEach(inst => {
                inst.j1.rotation.z = 0;
                inst.j2.rotation.z = 0;
            });
        }
    };

    group.userData.parts = parts;
    return group;
}
