// C:\Users\Saket\OneDrive\Desktop\engineering-simulator\machines\cytology_mitochondrion.js
import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    group.name = "Bio-Mechanical Mitochondrion Mobile Reactor";

    const parts = [];
    const updatables = [];

    // --- CUSTOM MATERIALS ---
    // Create glowing neon and energy materials for the hyper-realistic bio-tech look
    const energyMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 1.5, 
        transparent: true, opacity: 0.8, wireframe: true 
    });
    const matrixMaterial = new THREE.MeshStandardMaterial({
        color: 0xff00ff, emissive: 0xff00ff, emissiveIntensity: 0.5,
        transparent: true, opacity: 0.3, roughness: 0.1, metalness: 0.9
    });
    const cristaeMaterial = new THREE.MeshStandardMaterial({
        color: 0x111122, metalness: 0.8, roughness: 0.4, clearcoat: 1.0
    });
    const dnaMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 2.0, wireframe: true
    });
    const pumpGlowMat = new THREE.MeshStandardMaterial({
        color: 0xff5500, emissive: 0xff5500, emissiveIntensity: 1.2
    });

    // =========================================================================
    // PART 0: ALL-TERRAIN MOBILITY CHASSIS & TIRES
    // =========================================================================
    const chassisGroup = new THREE.Group();
    
    // Main Chassis Frame
    const frameGeom = new THREE.BoxGeometry(34, 2, 14);
    const frame = new THREE.Mesh(frameGeom, darkSteel);
    frame.position.set(0, -14, 0); 
    chassisGroup.add(frame);

    parts.push({
        name: "Mobile All-Terrain Chassis",
        description: "Heavy-duty dark steel girder framework supporting the massive bio-reactor core, allowing rapid cellular mobility.",
        material: "Dark Steel",
        function: "Structural foundation and shock absorption.",
        assemblyOrder: 1,
        connections: ["Heavy-Duty Traction Tires", "Reactor Core Stabilizers"],
        failureEffect: "Reactor collapse and total structural failure.",
        cascadeFailures: ["Core breach", "Turbine misalignment"],
        originalPosition: { x: 0, y: -14, z: 0 },
        explodedPosition: { x: 0, y: -30, z: 0 }
    });

    // Tires and Rims
    const tirePositions = [
        { x: -14, y: -14, z: 10, name: "Front-Left Tire" },
        { x: 14, y: -14, z: 10, name: "Rear-Left Tire" },
        { x: -14, y: -14, z: -10, name: "Front-Right Tire" },
        { x: 14, y: -14, z: -10, name: "Rear-Right Tire" }
    ];
    
    tirePositions.forEach((pos, idx) => {
        const wheelGroup = new THREE.Group();
        wheelGroup.position.set(pos.x, pos.y, pos.z);
        
        // Rim
        const rimGeom = new THREE.CylinderGeometry(3.5, 3.5, 2.5, 32);
        const rim = new THREE.Mesh(rimGeom, aluminum);
        rim.rotation.x = Math.PI / 2; // Orient axis to Z
        wheelGroup.add(rim);
        
        // Complex Spokes
        for(let s = 0; s < 10; s++) {
            const spokeGeom = new THREE.CylinderGeometry(0.25, 0.5, 7, 8);
            const spoke = new THREE.Mesh(spokeGeom, chrome);
            spoke.rotation.z = (s / 10) * Math.PI * 2; // Radiate in XY plane
            wheelGroup.add(spoke);
        }
        
        // Tire (Torus combined with BoxGeometry lugs for treads)
        const tireGeom = new THREE.TorusGeometry(5.0, 2.0, 24, 64);
        const tire = new THREE.Mesh(tireGeom, rubber);
        wheelGroup.add(tire);
        
        // Tread Lugs (hundreds of extruded boxes for hyper-realistic off-road treads)
        const lugCount = 90;
        for (let l = 0; l < lugCount; l++) {
            const angle = (l / lugCount) * Math.PI * 2;
            const lugGeom = new THREE.BoxGeometry(1.0, 0.6, 4.2);
            const lug = new THREE.Mesh(lugGeom, rubber);
            const treadRadius = 5.0 + 1.8; 
            lug.position.set(treadRadius * Math.cos(angle), treadRadius * Math.sin(angle), 0);
            lug.rotation.z = angle;
            
            // Offset alternate lugs slightly for aggressive V-pattern
            if (l % 2 === 0) {
                lug.rotation.y = 0.25;
                lug.position.z += 0.3;
            } else {
                lug.rotation.y = -0.25;
                lug.position.z -= 0.3;
            }
            wheelGroup.add(lug);
        }
        
        // Axle connector
        const axleGeom = new THREE.CylinderGeometry(0.8, 0.8, 5, 16);
        const axle = new THREE.Mesh(axleGeom, steel);
        axle.rotation.x = Math.PI / 2;
        axle.position.z = Math.sign(pos.z) * -2.5;
        wheelGroup.add(axle);
        
        chassisGroup.add(wheelGroup);
        updatables.push({ type: 'wheel', mesh: wheelGroup });
    });

    parts.push({
        name: "Heavy-Duty Traction Tires",
        description: "Massive all-terrain tires utilizing TorusGeometry and hundreds of BoxGeometry lugs. Allows the mitochondrion to navigate rugged cytoplasmic terrain.",
        material: "Vulcanized Rubber / Aluminum Rims",
        function: "Locomotion and vibration dampening.",
        assemblyOrder: 2,
        connections: ["Mobile All-Terrain Chassis"],
        failureEffect: "Immobilization of the reactor unit.",
        cascadeFailures: ["Inability to reach high-energy demand zones"],
        originalPosition: { x: -14, y: -14, z: 10 },
        explodedPosition: { x: -30, y: -14, z: 30 }
    });

    group.add(chassisGroup);

    // =========================================================================
    // PART 1: OUTER REACTOR CASING (Outer Membrane)
    // =========================================================================
    // Capsule shape to simulate the pill-like structure of a mitochondrion.
    const casingGeom = new THREE.CapsuleGeometry(12, 24, 64, 64);
    const casingMesh = new THREE.Mesh(casingGeom, tinted); 
    casingMesh.rotation.z = Math.PI / 2;
    casingMesh.material.transparent = true;
    casingMesh.material.opacity = 0.25; 
    casingMesh.material.depthWrite = false;
    casingMesh.material.side = THREE.DoubleSide;
    group.add(casingMesh);

    parts.push({
        name: "Outer Reactor Casing (Outer Membrane)",
        description: "Hyper-durable tinted glass-steel composite shielding. Freely permeable to ions via porins, offering containment for the intermembrane space.",
        material: "Tinted Glass Composite",
        function: "Containment and initial filtering of metabolites.",
        assemblyOrder: 3,
        connections: ["Porin Coolant Vents", "Mobile All-Terrain Chassis"],
        failureEffect: "Loss of intermembrane pressure and immediate proton gradient dissipation.",
        cascadeFailures: ["Total reactor shutdown", "Apoptosis initiation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 35, z: 0 }
    });

    // =========================================================================
    // PART 2: COOLANT PORES (Porins)
    // =========================================================================
    const porinGroup = new THREE.Group();
    const porinGeom = new THREE.TorusGeometry(0.8, 0.2, 16, 32);
    const porinCount = 250;
    
    for (let i = 0; i < porinCount; i++) {
        const phi = Math.acos(-1 + (2 * i) / porinCount);
        const theta = Math.sqrt(porinCount * Math.PI) * phi;
        
        const mesh = new THREE.Mesh(porinGeom, chrome);
        
        const r = 12; 
        const yBase = 12 * Math.cos(phi); 
        let yOffset = yBase;
        if (yBase > 0) yOffset += 12;
        else yOffset -= 12;

        const xBase = r * Math.sin(phi) * Math.cos(theta);
        const zBase = r * Math.sin(phi) * Math.sin(theta);
        
        mesh.position.set(xBase, yOffset, zBase);
        
        const normal = new THREE.Vector3(xBase, yBase, zBase).normalize();
        const lookPos = mesh.position.clone().add(normal);
        mesh.lookAt(lookPos);
        
        porinGroup.add(mesh);
    }
    porinGroup.rotation.z = Math.PI / 2;
    group.add(porinGroup);

    parts.push({
        name: "Porin Coolant Vents",
        description: "Voltage-dependent anion channels arrayed across the outer casing. Regulates the flow of massive molecular coolant.",
        material: "Chrome / Nanotubes",
        function: "Thermal regulation and metabolite import.",
        assemblyOrder: 4,
        connections: ["Outer Reactor Casing (Outer Membrane)"],
        failureEffect: "Reactor overheating and metabolite starvation.",
        cascadeFailures: ["Glycolysis decoupling"],
        originalPosition: { x: 0, y: 12, z: 0 },
        explodedPosition: { x: 0, y: 45, z: 0 }
    });

    // =========================================================================
    // PART 3: BAFFLE PLATES (Cristae - Inner Membrane)
    // =========================================================================
    const cristaeGroup = new THREE.Group();
    const baffleSpacing = 2.5;
    const baffleCount = 16;
    
    for (let i = 0; i < baffleCount; i++) {
        const xPos = (i - baffleCount / 2 + 0.5) * baffleSpacing;
        const maxDist = 24; 
        const ratio = Math.abs(xPos) / maxDist;
        const baseRadius = 11.2 * Math.sqrt(1 - ratio * ratio); 

        const shape = new THREE.Shape();
        const segments = 64;
        for (let j = 0; j <= segments; j++) {
            const angle = (j / segments) * Math.PI * 2;
            let r = baseRadius;
            
            // Highly folded cristae geometry
            const foldFrequency = 8;
            const foldDepth = 0.35;
            r -= baseRadius * foldDepth * Math.pow(Math.sin(angle * foldFrequency), 2);
            
            if (j === 0) shape.moveTo(r * Math.cos(angle), r * Math.sin(angle));
            else shape.lineTo(r * Math.cos(angle), r * Math.sin(angle));
        }
        
        // Complex internal holes for matrix continuity
        const holePath = new THREE.Path();
        holePath.absarc(baseRadius * 0.3, baseRadius * 0.2, baseRadius * 0.2, 0, Math.PI * 2, false);
        shape.holes.push(holePath);

        const extrudeSettings = { depth: 0.6, bevelEnabled: true, bevelSegments: 4, steps: 1, bevelSize: 0.15, bevelThickness: 0.2 };
        const baffleGeom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const baffle = new THREE.Mesh(baffleGeom, cristaeMaterial);
        baffle.position.x = xPos;
        baffle.rotation.y = Math.PI / 2;
        cristaeGroup.add(baffle);

        // --- ADD ATP SYNTHASE TURBINES (F1/F0) ---
        for (let k = 0; k < 25; k++) {
            const angle = (k / 25) * Math.PI * 2;
            const rBase = baseRadius * 0.65; 
            const zP = rBase * Math.cos(angle);
            const yP = rBase * Math.sin(angle);
            
            const atpGroup = new THREE.Group();
            const zOffset = (k % 2 === 0) ? 0.7 : -0.1;
            atpGroup.position.set(xPos + zOffset, yP, zP);
            
            // F0 Base Unit
            const f0Geom = new THREE.CylinderGeometry(0.4, 0.5, 0.5, 16);
            const f0 = new THREE.Mesh(f0Geom, copper);
            f0.rotation.x = Math.PI / 2; 
            atpGroup.rotation.z = (k % 2 === 0) ? -Math.PI / 2 : Math.PI / 2;
            atpGroup.add(f0);
            
            // Peripheral Stator Arm
            const statorGeom = new THREE.CylinderGeometry(0.08, 0.08, 1.4, 8);
            const stator = new THREE.Mesh(statorGeom, steel);
            stator.position.set(0.45, 0.7, 0);
            atpGroup.add(stator);
            
            // Central Axle (Rotor stem)
            const axleGeom = new THREE.CylinderGeometry(0.12, 0.12, 1.2, 16);
            const axle = new THREE.Mesh(axleGeom, chrome);
            axle.position.set(0, 0.6, 0);
            atpGroup.add(axle);
            
            // F1 Turbine Head
            const f1Group = new THREE.Group();
            f1Group.position.set(0, 1.3, 0);
            
            const f1Geom = new THREE.TorusGeometry(0.45, 0.18, 16, 24);
            const f1 = new THREE.Mesh(f1Geom, aluminum);
            f1.rotation.x = Math.PI / 2;
            f1Group.add(f1);
            
            const f1CapGeom = new THREE.SphereGeometry(0.25, 16, 16);
            const f1Cap = new THREE.Mesh(f1CapGeom, rubber);
            f1Group.add(f1Cap);
            
            // Glowing Energy Core inside Turbine
            const glowGeom = new THREE.SphereGeometry(0.15, 8, 8);
            const glowMat = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 1.5 });
            const glow = new THREE.Mesh(glowGeom, glowMat);
            glow.position.set(0, 0.35, 0);
            f1Group.add(glow);
            
            atpGroup.add(f1Group);
            cristaeGroup.add(atpGroup);
            
            updatables.push({ type: 'atp_rotor', mesh: axle });
            updatables.push({ type: 'atp_rotor', mesh: f1Group });
            updatables.push({ type: 'atp_glow', mat: glowMat, offset: Math.random() * 20 });
        }

        // --- ADD PROTON PUMPS (Complex I, III, IV) ---
        for(let p = 0; p < 8; p++) {
            const angle = (p / 8) * Math.PI * 2 + (i % 2 === 0 ? 0.2 : 0.6);
            const rBase = baseRadius * 0.85;
            const zP = rBase * Math.cos(angle);
            const yP = rBase * Math.sin(angle);
            
            const pumpGroup = new THREE.Group();
            pumpGroup.position.set(xPos + 0.3, yP, zP);
            
            if (p % 3 === 0) {
                // Complex I: L-Shaped mechanical arm
                const baseM = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.5, 0.8), darkSteel);
                pumpGroup.add(baseM);
                const armM = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.5, 16), steel);
                armM.position.set(0, 1.0, 0);
                pumpGroup.add(armM);
                const jointM = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), copper);
                jointM.position.set(0, 1.75, 0);
                pumpGroup.add(jointM);
                updatables.push({ type: 'complex_arm', mesh: armM, baseY: 1.0, offset: p + i });
            } else if (p % 3 === 1) {
                // Complex III: Twin piston towers
                const baseM = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.4, 0.6), chrome);
                pumpGroup.add(baseM);
                for(let t = -1; t <= 1; t+=2) {
                    const piston = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 1.0, 16), aluminum);
                    piston.position.set(t * 0.35, 0.7, 0);
                    pumpGroup.add(piston);
                    updatables.push({ type: 'piston', mesh: piston, baseY: 0.7, offset: p * t });
                }
            } else {
                // Complex IV: Dome shaped exhaust with glowing center
                const baseM = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.4, 16), steel);
                pumpGroup.add(baseM);
                const domeM = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16, 0, Math.PI*2, 0, Math.PI/2), rubber);
                domeM.position.set(0, 0.2, 0);
                pumpGroup.add(domeM);
                const glowM = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), pumpGlowMat);
                glowM.position.set(0, 0.3, 0);
                pumpGroup.add(glowM);
                updatables.push({ type: 'pump_glow', mat: pumpGlowMat, offset: p });
            }
            
            pumpGroup.lookAt(xPos + 0.3, yP * 2, zP * 2);
            cristaeGroup.add(pumpGroup);
        }
    }
    group.add(cristaeGroup);

    parts.push({
        name: "Cristae Baffle Plates",
        description: "Highly folded inner membrane structures extending into the matrix. Maximizes surface area for bio-reactor components.",
        material: "Dark Steel / Lipid Bilayer",
        function: "Structural housing for Electron Transport Chain.",
        assemblyOrder: 5,
        connections: ["ATP Synthase Turbines", "Proton Pump Motors"],
        failureEffect: "Loss of surface area leading to massive drop in ATP output.",
        cascadeFailures: ["Metabolic collapse"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 25, y: 0, z: 0 }
    });

    parts.push({
        name: "ATP Synthase Turbines (F1/F0)",
        description: "Hyper-complex rotary motors that use the proton motive force to mechanically forge ATP molecules. Spinning continuously at high RPM.",
        material: "Copper/Chrome/Aluminum",
        function: "Mechanical energy conversion to chemical ATP.",
        assemblyOrder: 6,
        connections: ["Cristae Baffle Plates", "Matrix Energy Gel"],
        failureEffect: "Zero ATP production. Total energy grid failure.",
        cascadeFailures: ["Necrosis"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 15 }
    });

    parts.push({
        name: "Electron Transport Pumps (Complex I-IV)",
        description: "Heavy machinery embedded in the cristae. Mechanical pistons and arms pump protons against their gradient to fuel the synthases.",
        material: "Steel/Chrome/Rubber",
        function: "Establishment of the proton motive force.",
        assemblyOrder: 7,
        connections: ["Cristae Baffle Plates", "Cytochrome C Nanobots"],
        failureEffect: "Proton gradient dissipation.",
        cascadeFailures: ["ATP Synthase stall"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -15, y: 15, z: -15 }
    });

    // =========================================================================
    // PART 4: mtDNA FIBER OPTIC LOOPS
    // =========================================================================
    const dnaGroup = new THREE.Group();
    for (let i = 0; i < 8; i++) {
        const dnaGeom = new THREE.TorusKnotGeometry(2.0, 0.08, 128, 16, 2, 5);
        const dna = new THREE.Mesh(dnaGeom, dnaMaterial);
        
        const dx = (Math.random() - 0.5) * 30;
        const dy = (Math.random() - 0.5) * 12;
        const dz = (Math.random() - 0.5) * 12;
        
        dna.position.set(dx, dy, dz);
        dna.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
        dnaGroup.add(dna);
        
        updatables.push({ type: 'dna', mesh: dna, offset: Math.random() * 10 });
    }
    group.add(dnaGroup);

    parts.push({
        name: "mtDNA Fiber Optic Loops",
        description: "Circular plasmids of mitochondrial DNA acting as data storage rings. Glows with intense genetic information.",
        material: "Bioluminescent Fiber Optics",
        function: "Local genetic blueprint storage for rapid component fabrication.",
        assemblyOrder: 8,
        connections: ["Matrix Energy Gel", "Ribosome Fabricators"],
        failureEffect: "Inability to repair oxidative damage to reactor components.",
        cascadeFailures: ["Long-term reactor degradation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 25 }
    });

    // =========================================================================
    // PART 5: CYTOCHROME C NANOBOTS (Electron Carriers)
    // =========================================================================
    const droneGroup = new THREE.Group();
    const droneGeom = new THREE.TetrahedronGeometry(0.35, 1);
    const droneMat = new THREE.MeshStandardMaterial({ color: 0xff0055, emissive: 0xff0055, emissiveIntensity: 2.0 });
    for (let i = 0; i < 60; i++) {
        const drone = new THREE.Mesh(droneGeom, droneMat);
        const x = (Math.random() - 0.5) * 40;
        const y = (Math.random() - 0.5) * 18;
        const z = (Math.random() - 0.5) * 18;
        drone.position.set(x, y, z);
        droneGroup.add(drone);
        updatables.push({ type: 'drone', mesh: drone, baseY: y, baseX: x, baseZ: z, offset: Math.random() * 100 });
    }
    group.add(droneGroup);

    parts.push({
        name: "Cytochrome C Nanobots",
        description: "Swarm of highly mobile electron carrier drones traversing the intermembrane space between complexes.",
        material: "Neon Tetrahedrons",
        function: "Electron transport shuttles.",
        assemblyOrder: 9,
        connections: ["Electron Transport Pumps (Complex I-IV)"],
        failureEffect: "Blockage of the electron transport chain.",
        cascadeFailures: ["Oxygen reduction failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -25, z: -25 }
    });

    // =========================================================================
    // PART 6: RIBOSOME FABRICATORS
    // =========================================================================
    const riboGroup = new THREE.Group();
    const riboGeom = new THREE.DodecahedronGeometry(0.25, 0);
    const riboMat = new THREE.MeshStandardMaterial({ color: 0xffff00, roughness: 0.8 });
    for(let i=0; i < 80; i++) {
        const ribo = new THREE.Mesh(riboGeom, riboMat);
        ribo.position.set((Math.random()-0.5)*35, (Math.random()-0.5)*14, (Math.random()-0.5)*14);
        riboGroup.add(ribo);
        updatables.push({ type: 'ribosome', mesh: ribo, offset: Math.random() * 10 });
    }
    group.add(riboGroup);

    parts.push({
        name: "Mitochondrial Ribosome Fabricators",
        description: "Granular 55S manufacturing units scattered throughout the matrix. Responsible for constructing new pump pistons and turbines on the fly.",
        material: "Yellow Polymer",
        function: "In-situ protein synthesis.",
        assemblyOrder: 10,
        connections: ["mtDNA Fiber Optic Loops", "Matrix Energy Gel"],
        failureEffect: "Loss of replacement parts leading to mechanical breakdown over time.",
        cascadeFailures: ["Gradual efficiency loss"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 15, y: 20, z: 15 }
    });

    // =========================================================================
    // PART 7: HYDRAULIC PRESSURE CONDUITS (Intermembrane Space)
    // =========================================================================
    const conduitGroup = new THREE.Group();
    for (let i = 0; i < 6; i++) {
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-22, Math.random()*16 - 8, Math.random()*16 - 8),
            new THREE.Vector3(-10, Math.random()*20 - 10, Math.random()*20 - 10),
            new THREE.Vector3(10, Math.random()*20 - 10, Math.random()*20 - 10),
            new THREE.Vector3(22, Math.random()*16 - 8, Math.random()*16 - 8)
        ]);
        const tubeGeom = new THREE.TubeGeometry(curve, 100, 0.4, 16, false);
        const tube = new THREE.Mesh(tubeGeom, plastic);
        conduitGroup.add(tube);
        
        const ringGeom = new THREE.TorusGeometry(0.5, 0.08, 8, 16);
        for (let j = 0; j < 15; j++) {
            const t = j / 15;
            const pt = curve.getPointAt(t);
            const tangent = curve.getTangentAt(t);
            const ring = new THREE.Mesh(ringGeom, energyMaterial);
            ring.position.copy(pt);
            
            const axis = new THREE.Vector3(0, 0, 1);
            ring.quaternion.setFromUnitVectors(axis, tangent);
            conduitGroup.add(ring);
            
            updatables.push({ type: 'conduit_ring', mesh: ring, curve: curve, t: t });
        }
    }
    group.add(conduitGroup);

    parts.push({
        name: "Hydraulic Pressure Conduits",
        description: "Extensive tubing network managing extreme osmotic and protonic pressures within the intermembrane space.",
        material: "Reinforced Plastic / Energy Rings",
        function: "Pressure equalization and specialized transport.",
        assemblyOrder: 11,
        connections: ["Cristae Baffle Plates", "Outer Reactor Casing (Outer Membrane)"],
        failureEffect: "Catastrophic pressure vessel rupture.",
        cascadeFailures: ["Complete systemic explosion"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -25, z: 0 }
    });

    // =========================================================================
    // PART 8: OXYGEN REDUCTION VALVES
    // =========================================================================
    const valveGroup = new THREE.Group();
    const valveGeom = new THREE.CylinderGeometry(1.5, 1.5, 0.5, 8);
    for(let i=0; i<4; i++) {
        const valve = new THREE.Mesh(valveGeom, steel);
        valve.position.set((i - 1.5) * 10, 12, 0); 
        valve.rotation.x = Math.PI / 2;
        
        const wheelGeom = new THREE.TorusGeometry(1.0, 0.1, 8, 16);
        const wheel = new THREE.Mesh(wheelGeom, chrome);
        wheel.position.set(0, 0.3, 0);
        wheel.rotation.x = Math.PI / 2;
        valve.add(wheel);
        
        valveGroup.add(valve);
        updatables.push({ type: 'valve', mesh: wheel, offset: i });
    }
    valveGroup.rotation.z = Math.PI / 2; 
    group.add(valveGroup);

    parts.push({
        name: "Oxygen Reduction Valves",
        description: "Massive intake valves drawing in molecular oxygen to serve as the final electron acceptor in the chain.",
        material: "Steel / Chrome Wheels",
        function: "Oxygen intake and metabolic water exhaust.",
        assemblyOrder: 12,
        connections: ["Electron Transport Pumps (Complex I-IV)"],
        failureEffect: "Electron traffic jam, causing radical oxygen species buildup.",
        cascadeFailures: ["Oxidative stress meltdown"],
        originalPosition: { x: 0, y: 12, z: 0 },
        explodedPosition: { x: 25, y: 25, z: 0 }
    });

    // =========================================================================
    // PART 9: MATRIX ENERGY GEL (Core)
    // =========================================================================
    const coreGeom = new THREE.CapsuleGeometry(9, 20, 32, 32);
    const coreMesh = new THREE.Mesh(coreGeom, matrixMaterial);
    coreMesh.rotation.z = Math.PI / 2;
    group.add(coreMesh);

    parts.push({
        name: "Matrix Energy Gel",
        description: "Highly concentrated, viscous core fluid containing TCA cycle enzymes and raw metabolic substrates.",
        material: "Radiant Plasma",
        function: "Medium for biochemical reactions and substrate suspension.",
        assemblyOrder: 13,
        connections: ["Cristae Baffle Plates", "mtDNA Fiber Optic Loops"],
        failureEffect: "Cessation of the Krebs cycle.",
        cascadeFailures: ["Starvation of the electron transport chain"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -35 }
    });

    parts.push({
        name: "ATP Export Channels",
        description: "Heavy mechanical blast doors that eject newly forged ATP units into the wider cellular cytoplasm.",
        material: "Titanium Alloy",
        function: "Energy distribution.",
        assemblyOrder: 14,
        connections: ["Outer Reactor Casing (Outer Membrane)"],
        failureEffect: "ATP buildup inside the reactor causing negative feedback inhibition.",
        cascadeFailures: ["Complete cessation of metabolism"],
        originalPosition: { x: 0, y: -12, z: 0 },
        explodedPosition: { x: -25, y: -25, z: 0 }
    });

    parts.push({
        name: "Reactor Core Stabilizers",
        description: "Shock absorbers connecting the internal bio-matrix to the heavy-duty chassis, ensuring smooth operations during rapid movement.",
        material: "Industrial Rubber / Steel Springs",
        function: "Vibration dampening for delicate DNA loops and turbines.",
        assemblyOrder: 15,
        connections: ["Mobile All-Terrain Chassis", "Outer Reactor Casing (Outer Membrane)"],
        failureEffect: "Excessive vibration leading to shattered cristae baffles.",
        cascadeFailures: ["Turbine decapitation", "Short circuits"],
        originalPosition: { x: 0, y: -13, z: 0 },
        explodedPosition: { x: 20, y: -30, z: -20 }
    });

    const description = "The Bio-Mechanical Mitochondrion is a hyper-realistic, ultra high-tech interpretation of the cellular powerhouse. Re-imagined as a colossal, mobile energy reactor mounted on aggressive all-terrain tires, it features highly complex, folded cristae baffles, hundreds of mechanical ATP Synthase turbines, functioning hydraulic proton pumps, and glowing fiber-optic mtDNA loops. This model is exceptionally detailed, consisting of thousands of synchronized moving parts representing the pinnacle of cellular engineering.";

    const quizQuestions = [
        {
            question: "In this bio-mechanical model, what do the rapidly spinning mechanical turbines represent?",
            options: [
                "Proton pumps creating the gradient",
                "F1/F0 ATP Synthase complexes converting ADP to ATP",
                "Ribosomes synthesizing proteins",
                "Cytochrome c carriers transporting electrons"
            ],
            correctAnswer: 1,
            explanation: "The spinning turbines represent the F1/F0 ATP Synthase complexes, which act as true molecular motors driven by proton flow to mechanically generate ATP."
        },
        {
            question: "Why are the Cristae Baffle Plates highly folded?",
            options: [
                "To increase surface area for the massive array of turbines and pumps",
                "To slow down the movement of the matrix gel",
                "To prevent the mtDNA from tangling",
                "To provide structural support against the chassis"
            ],
            correctAnswer: 0,
            explanation: "The folds of the cristae drastically increase the surface area of the inner membrane, allowing for a much larger number of Electron Transport Chain proteins and ATP Synthases."
        },
        {
            question: "What is the function of the Cytochrome C Nanobot drones flying through the intermembrane space?",
            options: [
                "To carry protons to the ATP synthase",
                "To repair damaged cristae",
                "To act as highly mobile electron shuttles between Complex III and Complex IV",
                "To export ATP out of the mitochondrion"
            ],
            correctAnswer: 2,
            explanation: "Cytochrome C is a small, highly mobile protein that shuttles electrons between the large, stationary Complex III and Complex IV pumps."
        },
        {
            question: "What unique bio-mechanical addition allows this specific reactor model to navigate the cytoplasm?",
            options: [
                "Flagellar propellers",
                "Cilia tracks",
                "Heavy-Duty Traction Tires and a Mobile Chassis",
                "Hydraulic pressure thrusters"
            ],
            correctAnswer: 2,
            explanation: "This specific hyper-realistic simulator model features a heavily armored chassis and Torus-geometry traction tires to act as a mobile energy generator."
        },
        {
            question: "What do the glowing fiber-optic Torus Knot rings suspended in the core represent?",
            options: [
                "Circular mitochondrial DNA (mtDNA) storing genetic blueprints",
                "Stored units of ATP energy",
                "Waste products ready for export",
                "The core temperature regulators"
            ],
            correctAnswer: 0,
            explanation: "Mitochondria contain their own circular DNA (mtDNA), independent of the cell nucleus, which is represented here as luminous data storage loops."
        }
    ];

    function animate(time, speed) {
        updatables.forEach(obj => {
            if (obj.type === 'atp_rotor') {
                obj.mesh.rotation.y = time * speed * 5.0;
            } else if (obj.type === 'dna') {
                obj.mesh.rotation.x = time * speed * 0.4 + obj.offset;
                obj.mesh.rotation.y = time * speed * 0.6 + obj.offset;
            } else if (obj.type === 'drone') {
                obj.mesh.position.y = obj.baseY + Math.sin(time * speed * 6 + obj.offset) * 2.0;
                obj.mesh.position.x = obj.baseX + Math.cos(time * speed * 3 + obj.offset) * 1.5;
                obj.mesh.rotation.x = time * speed * 2.0 + obj.offset;
                obj.mesh.rotation.y = time * speed * 3.0 + obj.offset;
            } else if (obj.type === 'piston') {
                obj.mesh.position.y = obj.baseY + Math.sin(time * speed * 12 + obj.offset) * 0.25;
            } else if (obj.type === 'complex_arm') {
                obj.mesh.rotation.z = Math.sin(time * speed * 8 + obj.offset) * 0.15;
            } else if (obj.type === 'pump_glow' || obj.type === 'atp_glow') {
                obj.mat.emissiveIntensity = 0.5 + Math.sin(time * speed * 15 + obj.offset) * 0.8;
            } else if (obj.type === 'valve') {
                obj.mesh.rotation.y = time * speed * -1.5;
            } else if (obj.type === 'ribosome') {
                obj.mesh.rotation.x = Math.sin(time * speed * 20 + obj.offset) * 0.2;
                obj.mesh.rotation.z = Math.cos(time * speed * 25 + obj.offset) * 0.2;
            } else if (obj.type === 'wheel') {
                obj.mesh.rotation.z = time * speed * -2.0;
            } else if (obj.type === 'conduit_ring') {
                obj.t += speed * 0.005;
                if(obj.t > 1.0) obj.t = 0;
                const pt = obj.curve.getPointAt(obj.t);
                const tangent = obj.curve.getTangentAt(obj.t);
                obj.mesh.position.copy(pt);
                const axis = new THREE.Vector3(0, 0, 1);
                obj.mesh.quaternion.setFromUnitVectors(axis, tangent);
            }
        });
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createMitochondrion() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
