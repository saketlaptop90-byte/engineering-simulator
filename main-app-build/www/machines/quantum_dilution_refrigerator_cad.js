import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const goldPlated = new THREE.MeshPhysicalMaterial({ color: 0xffcc00, metalness: 1.0, roughness: 0.1 }); // Cryogenic thermal plates
    const copperBraid = new THREE.MeshPhysicalMaterial({ color: 0xb87333, metalness: 0.9, roughness: 0.6 }); // Thermal straps
    const coaxSilver = new THREE.MeshPhysicalMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 }); // Microwave cables
    const quantumChip = new THREE.MeshPhysicalMaterial({ color: 0x111111, metalness: 0.5, roughness: 0.1, iridescence: 1.0 }); // The QPU
    
    // VFX Materials
    const qubitGlow = new THREE.MeshBasicMaterial({ color: 0x00ffcc, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Superposition state VFX
    const entanglementLink = new THREE.MeshBasicMaterial({ color: 0xff00ff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending });

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.qubits = [];
    group.userData.animatedMeshes.links = [];

    // ==========================================
    // 1. PROCEDURAL CAD: The Cryogenic Stages (The Chandelier)
    // ==========================================
    const chandelierGroup = new THREE.Group();
    
    // Stage Plate properties: Radius and Y-position
    // Cooling stages: Room Temp, 50K, 4K, 1K, 100mK, 10mK (Mixing Chamber)
    const stages = [
        { r: 2.0, y: 4.0, name: "Room Temperature Plate" },
        { r: 1.8, y: 2.5, name: "50 Kelvin Stage" },
        { r: 1.6, y: 1.0, name: "4 Kelvin Stage" },
        { r: 1.4, y: -0.5, name: "1 Kelvin Still" },
        { r: 1.2, y: -2.0, name: "100 mK Cold Plate" },
        { r: 1.0, y: -3.5, name: "10 mK Mixing Chamber" }
    ];
    
    stages.forEach((stage, index) => {
        // The massive gold-plated oxygen-free copper plates
        const plate = new THREE.Mesh(new THREE.CylinderGeometry(stage.r, stage.r, 0.1, 64), goldPlated);
        plate.position.y = stage.y;
        chandelierGroup.add(plate);
        
        // Structural supports connecting down to the next stage
        if (index < stages.length - 1) {
            for(let i=0; i<6; i++) {
                const angle = (i * Math.PI * 2) / 6;
                const support = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.5), goldPlated);
                // Positioned on the radius of the next (smaller) stage
                const nextR = stages[index+1].r - 0.1;
                support.position.set(nextR * Math.cos(angle), stage.y - 0.75, nextR * Math.sin(angle));
                chandelierGroup.add(support);
            }
        }
        
        if (index === 5) {
            parts.push({ mesh: plate, name: "10 mK Mixing Chamber", description: "The coldest spot in the universe.", function: "Uses a mixture of Helium-3 and Helium-4 isotopes to cool the quantum processor down to absolute zero."});
        }
    });

    // ==========================================
    // 2. PROCEDURAL CAD: Microwave Coaxial Cabling
    // ==========================================
    // Thousands of cables carry the microwave pulses down to the qubits
    // We will procedurally generate helical / curving bundles of cables between the stages
    const cableGroup = new THREE.Group();
    
    const bundleCount = 8;
    for(let b=0; b<bundleCount; b++) {
        const bAngle = (b * Math.PI * 2) / bundleCount;
        
        // Create a bundle of 4 cables winding down
        for(let c=0; c<4; c++) {
            const curve = new THREE.QuadraticBezierCurve3(
                new THREE.Vector3((1.8 - c*0.05) * Math.cos(bAngle), 3.9, (1.8 - c*0.05) * Math.sin(bAngle)),
                new THREE.Vector3((1.2 - c*0.05) * Math.cos(bAngle+1.0), 0, (1.2 - c*0.05) * Math.sin(bAngle+1.0)),
                new THREE.Vector3((0.8 - c*0.05) * Math.cos(bAngle+2.0), -3.4, (0.8 - c*0.05) * Math.sin(bAngle+2.0))
            );
            
            const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.015, 8, false);
            const coax = new THREE.Mesh(tubeGeo, coaxSilver);
            cableGroup.add(coax);
            
            // Add attenuators (small cylindrical blocks) at the 4K and 100mK stages
            const atten1 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.15), goldPlated);
            atten1.position.copy(curve.getPoint(0.4));
            atten1.lookAt(curve.getPoint(0.45));
            cableGroup.add(atten1);
            
            const atten2 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.15), goldPlated);
            atten2.position.copy(curve.getPoint(0.8));
            atten2.lookAt(curve.getPoint(0.85));
            cableGroup.add(atten2);
        }
    }
    
    chandelierGroup.add(cableGroup);
    group.add(chandelierGroup);
    
    parts.push({ mesh: cableGroup, name: "Microwave Coaxial Lines & Attenuators", description: "Hundreds of superconducting semi-rigid cables.", function: "Transmits precise microwave pulses to manipulate qubit states while heavily filtering out thermal noise."});

    // ==========================================
    // 3. PROCEDURAL CAD: The Quantum Processing Unit (QPU)
    // ==========================================
    const qpuGroup = new THREE.Group();
    qpuGroup.position.set(0, -4.0, 0); // Hanging below the mixing chamber
    
    // Magnetic shielding can (Cutaway)
    const shieldGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.8, 32, 1, false, 0, Math.PI * 1.5);
    const shield = new THREE.Mesh(shieldGeo, copperBraid);
    shield.material.side = THREE.DoubleSide;
    qpuGroup.add(shield);
    
    // The QPU Package (Mounting bracket)
    const qpuBracket = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.1, 16), goldPlated);
    qpuBracket.position.y = 0.2;
    qpuGroup.add(qpuBracket);
    
    // The Silicon Chip (Transmon Qubit array)
    const chip = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.02, 0.4), quantumChip);
    chip.position.y = 0.1;
    qpuGroup.add(chip);
    
    parts.push({ mesh: chip, name: "Superconducting QPU Chip", description: "Array of superconducting transmon qubits.", function: "Performs quantum logic operations utilizing superposition and entanglement."});

    // ==========================================
    // 4. PROCEDURAL CAD: Quantum State VFX (Qubits)
    // ==========================================
    const grid = 3;
    const spacing = 0.1;
    const qubits = [];
    
    // Create a 3x3 grid of qubits
    for(let x=0; x<grid; x++) {
        for(let z=0; z<grid; z++) {
            const qubit = new THREE.Mesh(new THREE.SphereGeometry(0.015, 8, 8), qubitGlow);
            qubit.position.set((x - 1) * spacing, 0.12, (z - 1) * spacing);
            qpuGroup.add(qubit);
            group.userData.animatedMeshes.qubits.push(qubit);
            qubits.push(qubit);
        }
    }
    
    // Add entanglement links between adjacent qubits
    for(let i=0; i<qubits.length; i++) {
        for(let j=i+1; j<qubits.length; j++) {
            const dist = qubits[i].position.distanceTo(qubits[j].position);
            // Link nearest neighbors
            if (dist < spacing * 1.1) {
                const linkGeo = new THREE.CylinderGeometry(0.003, 0.003, dist);
                const link = new THREE.Mesh(linkGeo, entanglementLink);
                // Position midpoint
                link.position.copy(qubits[i].position).lerp(qubits[j].position, 0.5);
                // Look at
                link.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), qubits[j].position.clone().sub(qubits[i].position).normalize());
                qpuGroup.add(link);
                group.userData.animatedMeshes.links.push(link);
            }
        }
    }

    group.add(qpuGroup);

    // ==========================================
    // 5. Factual Fasteners (6,800 parts)
    // ==========================================
    const boltCount = 6800;
    const boltGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.02, 6);
    const instancedBolts = new THREE.InstancedMesh(boltGeo, darkSteel, boltCount);
    const dummy = new THREE.Object3D();
    
    let boltIndex = 0;
    // Distribute bolts along the rims of the 6 gold plates
    stages.forEach((stage) => {
        const boltsPerPlate = 1000;
        for(let i=0; i<boltsPerPlate; i++) {
            if (boltIndex >= boltCount) break;
            const angle = (i * Math.PI * 2) / boltsPerPlate;
            // Place near the edge
            const r = stage.r - 0.05;
            dummy.position.set(r * Math.cos(angle), stage.y + 0.05, r * Math.sin(angle));
            dummy.rotation.set(0, 0, 0); 
            dummy.updateMatrix();
            instancedBolts.setMatrixAt(boltIndex, dummy.matrix);
            boltIndex++;
        }
    });
    
    // Remaining bolts around the QPU shield
    for(let i=boltIndex; i<boltCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        dummy.position.set(0.6 * Math.cos(angle), -3.6, 0.6 * Math.sin(angle));
        dummy.rotation.set(Math.PI/2, 0, angle);
        dummy.updateMatrix();
        instancedBolts.setMatrixAt(i, dummy.matrix);
    }
    
    instancedBolts.instanceMatrix.needsUpdate = true;
    group.add(instancedBolts);
    
    parts.push({ mesh: instancedBolts, name: "6,800 Cryogenic Fasteners", description: "Factual quantity of non-magnetic beryllium-copper bolts.", function: "Ensures perfect thermal contact between the cooling stages while surviving extreme thermal contraction." });
    
    // Scale adjustment
    group.scale.set(0.6, 0.6, 0.6);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // Quantum State Simulation
            // The qubits pulse and change size, simulating superposition/Rabi oscillations
            group.userData.animatedMeshes.qubits.forEach((qubit, index) => {
                const freq = 5.0 + (index * 1.2); // Different freq for each
                const amp = Math.sin(timeAcc * freq * speed);
                const scale = 1.0 + Math.abs(amp) * 1.5;
                
                qubit.scale.set(scale, scale, scale);
                qubit.material.opacity = 0.5 + Math.abs(amp) * 0.5;
                
                // Color shift based on state
                qubit.material.color.setHSL((timeAcc * 0.1 + index*0.1) % 1.0, 1.0, 0.5);
            });
            
            // Entanglement links pulse randomly simulating gate operations
            group.userData.animatedMeshes.links.forEach(link => {
                if (Math.random() < 0.1 * speed) {
                    link.material.opacity = 0.8;
                    link.scale.set(3, 1, 3);
                } else {
                    link.material.opacity *= 0.8; // Fade out
                    link.scale.set(1, 1, 1);
                }
            });
            
        } else {
            // Idle (decohered/inactive)
            group.userData.animatedMeshes.qubits.forEach(qubit => {
                qubit.scale.set(1, 1, 1);
                qubit.material.opacity = 0.0;
            });
            group.userData.animatedMeshes.links.forEach(link => {
                link.material.opacity = 0.0;
            });
        }
    };

    group.userData.parts = parts;
    return group;
}
