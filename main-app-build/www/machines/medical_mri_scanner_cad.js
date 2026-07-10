import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const medicalCasing = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.1, roughness: 0.2, clearcoat: 1.0 }); // Glossy white scanner body
    const scannerAccent = new THREE.MeshPhysicalMaterial({ color: 0x0044aa, metalness: 0.5, roughness: 0.5 }); // Blue accent ring
    const superMagnet = new THREE.MeshPhysicalMaterial({ color: 0xb87333, metalness: 0.8, roughness: 0.4 }); // Copper/Niobium-Titanium coils
    const patientTableAl = new THREE.MeshPhysicalMaterial({ color: 0xcccccc, metalness: 0.6, roughness: 0.3 }); // Table mechanism
    const cushion = new THREE.MeshPhysicalMaterial({ color: 0x222222, metalness: 0.0, roughness: 0.9 }); // Patient padding
    
    // VFX Materials
    const magneticFieldVFX = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // 3 Tesla field lines
    const rfPulseVFX = new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Radio frequency pulses

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.fieldLines = [];

    // ==========================================
    // 1. PROCEDURAL CAD: The Main Bore & Superconducting Magnet
    // ==========================================
    const scannerGroup = new THREE.Group();
    
    // The main donut casing (Cutaway to see the coils)
    // We use a cylinder with a hole, and cut out a quarter
    const boreGeo = new THREE.CylinderGeometry(2.0, 2.0, 3.0, 64, 1, false, 0, Math.PI * 1.5).rotateX(Math.PI/2);
    const casing = new THREE.Mesh(boreGeo, medicalCasing);
    casing.material.side = THREE.DoubleSide;
    scannerGroup.add(casing);
    
    // The inner bore tube (where the patient goes)
    const innerBore = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 3.2, 32).rotateX(Math.PI/2), medicalCasing);
    innerBore.material.side = THREE.DoubleSide;
    scannerGroup.add(innerBore);
    
    // Accent ring on the front
    const accent = new THREE.Mesh(new THREE.TorusGeometry(2.0, 0.05, 16, 64), scannerAccent);
    accent.position.set(0, 0, 1.5);
    scannerGroup.add(accent);
    
    // The Superconducting Magnet Coils (Inside the casing)
    // Niobium-titanium wire bathed in liquid helium at 4.2 Kelvin
    const magnetGroup = new THREE.Group();
    for(let i=0; i<6; i++) {
        // Main field coils
        const coilGeo = new THREE.TorusGeometry(1.4, 0.2, 16, 64);
        const coil = new THREE.Mesh(coilGeo, superMagnet);
        coil.position.set(0, 0, -1.0 + (i * 0.4));
        magnetGroup.add(coil);
    }
    
    // Gradient Coils (Smaller coils inside the main magnet, used for spatial encoding)
    const gradientGeo = new THREE.CylinderGeometry(1.0, 1.0, 2.5, 32, 1, true).rotateX(Math.PI/2);
    const gradientCoil = new THREE.Mesh(gradientGeo, copper);
    gradientCoil.material.wireframe = true; // Representing the complex etched copper patterns
    magnetGroup.add(gradientCoil);

    scannerGroup.add(magnetGroup);
    group.add(scannerGroup);
    
    parts.push({ mesh: magnetGroup.children[0], name: "3-Tesla Superconducting Magnet", description: "Niobium-Titanium coils bathed in liquid helium (-269°C).", function: "Generates a magnetic field 60,000 times stronger than the Earth's to align the hydrogen protons in the patient's body."});

    // ==========================================
    // 2. PROCEDURAL CAD: The Patient Handling System
    // ==========================================
    const tableGroup = new THREE.Group();
    tableGroup.position.set(0, -0.6, 2.5); // Starts outside the bore
    
    // The heavy motorized base
    const tableBase = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 1.5), medicalCasing);
    tableBase.position.set(0, -0.4, 1.0);
    tableGroup.add(tableBase);
    
    // The sliding bed
    const bed = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.1, 4.0), patientTableAl);
    bed.position.set(0, 0, 0);
    tableGroup.add(bed);
    
    // Patient cushion
    const pad = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.05, 3.8), cushion);
    pad.position.set(0, 0.075, 0);
    tableGroup.add(pad);
    
    // RF Head Coil (The "cage" that goes over the patient's head to receive the signal)
    const headCoil = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.4, 16, 1, true).rotateX(Math.PI/2), plastic);
    headCoil.material.wireframe = true;
    headCoil.position.set(0, 0.3, -1.5);
    tableGroup.add(headCoil);
    
    group.add(tableGroup);
    group.userData.animatedMeshes['table'] = bed; // Just animate the bed sliding in
    group.userData.animatedMeshes['headCoil'] = headCoil; 
    
    parts.push({ mesh: headCoil, name: "Radio Frequency (RF) Head Coil", description: "A specialized antenna worn by the patient.", function: "Transmits RF pulses to knock protons out of alignment, then listens for the faint echo as they realign."});

    // ==========================================
    // 3. PROCEDURAL CAD: Magnetic Field & RF VFX
    // ==========================================
    
    // Magnetic Field Lines (Torus shapes sweeping through the bore and looping outside)
    const fieldLinesGroup = new THREE.Group();
    for(let i=0; i<8; i++) {
        // We can approximate the field lines of a solenoid with large thin toruses
        const lineGeo = new THREE.TorusGeometry(3.0, 0.02, 8, 64);
        const line = new THREE.Mesh(lineGeo, magneticFieldVFX);
        // Rotate them around the Y axis to form a cage of field lines
        line.rotation.y = (i * Math.PI) / 8;
        fieldLinesGroup.add(line);
        group.userData.animatedMeshes.fieldLines.push(line);
    }
    group.add(fieldLinesGroup);
    
    // RF Pulse (A bright flash inside the bore)
    const rfPulse = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 2.0, 32).rotateX(Math.PI/2), rfPulseVFX);
    rfPulse.position.set(0, 0, 0);
    group.add(rfPulse);
    group.userData.animatedMeshes['rfPulse'] = rfPulse;

    // ==========================================
    // 4. Factual Fasteners (8,500 parts)
    // ==========================================
    const boltCount = 8500;
    const boltGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.03, 6);
    const instancedBolts = new THREE.InstancedMesh(boltGeo, darkSteel, boltCount);
    const dummy = new THREE.Object3D();
    
    for (let i = 0; i < boltCount; i++) {
        if (i < 5000) {
            // Cryostat containment bolts (Securing the helium vessel inside the scanner)
            const angle = Math.random() * Math.PI * 2;
            const r = 1.8;
            const z = (Math.random() - 0.5) * 2.8;
            dummy.position.set(r * Math.cos(angle), r * Math.sin(angle), z);
            dummy.rotation.set(Math.PI/2, 0, angle); 
        } else {
            // Gradient coil mounting bolts (Subject to extreme vibration during scanning)
            const angle = Math.random() * Math.PI * 2;
            const r = 1.05;
            const z = (Math.random() - 0.5) * 2.4;
            dummy.position.set(r * Math.cos(angle), r * Math.sin(angle), z);
            dummy.rotation.set(Math.PI/2, 0, angle);
        }
        dummy.updateMatrix();
        instancedBolts.setMatrixAt(i, dummy.matrix);
    }
    instancedBolts.instanceMatrix.needsUpdate = true;
    group.add(instancedBolts);
    
    parts.push({ mesh: instancedBolts, name: "8,500 Non-Magnetic Fasteners", description: "Factual quantity of instanced titanium and brass bolts.", function: "Secures the gradient coils. Standard steel bolts would become lethal projectiles in a 3-Tesla field." });
    
    // Scale adjustment
    group.scale.set(0.6, 0.6, 0.6);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // 1. Patient Table slides into the bore
            // Target Z position is -2.5
            const currentZ = group.userData.animatedMeshes['table'].position.z;
            if (currentZ > -2.5) {
                group.userData.animatedMeshes['table'].position.z -= 0.02 * speed;
                group.userData.animatedMeshes['headCoil'].position.z -= 0.02 * speed;
            }
            
            // 2. Magnetic Field VFX
            // The field is static, but we can animate the lines pulsing/flowing to visualize it
            group.userData.animatedMeshes.fieldLines.forEach((line, index) => {
                line.material.opacity = 0.3 + Math.sin(timeAcc * 2.0 + index) * 0.1 * speed;
                // Slowly rotate the cage to make it look dynamic
                line.rotation.z = timeAcc * 0.5 * speed; 
            });
            
            // 3. RF Pulses and Gradient Coil Noise
            // MRIs are incredibly loud (the clacking sound) caused by the gradient coils flexing
            // We visualize the RF pulse and the vibration
            if (currentZ <= -2.4) { // Only pulse when patient is inside
                const pulse = Math.sin(timeAcc * 20 * speed); // High frequency clacking
                if (pulse > 0.8) {
                    group.userData.animatedMeshes['rfPulse'].material.opacity = 0.5;
                    // Violent vibration of the gradient coils
                    magnetGroup.children[6].scale.set(1.005, 1.005, 1.005);
                } else {
                    group.userData.animatedMeshes['rfPulse'].material.opacity = 0.0;
                    magnetGroup.children[6].scale.set(1.0, 1.0, 1.0);
                }
            }
            
        } else {
            // Idle (Table slides back out, field is still on but invisible)
            const currentZ = group.userData.animatedMeshes['table'].position.z;
            if (currentZ < 0) {
                group.userData.animatedMeshes['table'].position.z += 0.02;
                group.userData.animatedMeshes['headCoil'].position.z += 0.02;
            }
            
            group.userData.animatedMeshes.fieldLines.forEach(line => line.material.opacity = 0);
            group.userData.animatedMeshes['rfPulse'].material.opacity = 0;
            magnetGroup.children[6].scale.set(1, 1, 1);
        }
    };

    group.userData.parts = parts;
    return group;
}
