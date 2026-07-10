import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Ultra-High-Tech Custom Materials
    const neonBlue = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x0088ff, emissiveIntensity: 2, transparent: true, opacity: 0.8, wireframe: true });
    const plasmaPurple = new THREE.MeshStandardMaterial({ color: 0x9900ff, emissive: 0x9900ff, emissiveIntensity: 3, wireframe: true });
    const glowingGreen = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00aa00, emissiveIntensity: 1.5 });
    const glowingRed = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xcc0000, emissiveIntensity: 2 });
    const liquidMaterial = new THREE.MeshPhysicalMaterial({ color: 0x00ffcc, transmission: 0.9, opacity: 1, metalness: 0, roughness: 0.1, ior: 1.33, emissive: 0x003322, emissiveIntensity: 0.5 });
    const energyField = new THREE.MeshStandardMaterial({ color: 0x00aaff, emissive: 0x00aaff, emissiveIntensity: 1, transparent: true, opacity: 0.4, wireframe: true });
    const goldContacts = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 1, roughness: 0.2 });

    // 1. Micro-Fusion Core (Heart of the nanobot)
    const coreGeo = new THREE.TorusKnotGeometry(1.2, 0.4, 128, 32);
    const coreMesh = new THREE.Mesh(coreGeo, plasmaPurple);
    coreMesh.position.set(0, 0, 0);
    group.add(coreMesh);
    meshes.core = coreMesh;
    parts.push({
        name: "Micro-Fusion Core",
        description: "A nanoscale toroidal plasma reactor providing immense power for intracellular navigation and membrane penetration.",
        material: "Plasma Purple (Custom)",
        function: "Energy Generation",
        assemblyOrder: 1,
        connections: ["Magnetic Containment Field", "Ion Propulsion Array"],
        failureEffect: "Complete loss of propulsion, rendering the nanobot adrift in the bloodstream.",
        cascadeFailures: ["Sensors offline", "Payload delivery stalled"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -5, y: 5, z: 0 }
    });

    // 2. Magnetic Containment Field
    const fieldGeo = new THREE.SphereGeometry(2.2, 32, 32);
    const fieldMesh = new THREE.Mesh(fieldGeo, neonBlue);
    group.add(fieldMesh);
    meshes.field = fieldMesh;
    parts.push({
        name: "Magnetic Containment Field",
        description: "An electromagnetic lattice that stabilizes the plasma core and shields biological tissue from thermal and radiation damage.",
        material: "Neon Blue Energy",
        function: "Radiation / Thermal Shielding",
        assemblyOrder: 2,
        connections: ["Micro-Fusion Core"],
        failureEffect: "Thermal cascade destroying surrounding red blood cells.",
        cascadeFailures: ["Hull breach", "Payload denatured"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -5, y: -5, z: 0 }
    });

    // 3. Main Titanium-Carbon Hull
    const hullGeo = new THREE.CylinderGeometry(2.5, 2.5, 5, 32, 1, true);
    const hullMesh = new THREE.Mesh(hullGeo, chrome);
    hullMesh.rotation.x = Math.PI / 2;
    group.add(hullMesh);
    meshes.hull = hullMesh;
    parts.push({
        name: "Titanium-Carbon Hull",
        description: "The primary structural chassis. Built from advanced biocompatible metamaterials to evade detection by the host's immune system.",
        material: "Titanium-Carbon (Chrome)",
        function: "Structural Support / Stealth",
        assemblyOrder: 3,
        connections: ["Micro-Fusion Core", "Payload Chamber", "Sensor Array"],
        failureEffect: "Exposure of internal machinery to macrophages.",
        cascadeFailures: ["Complete system consumption by white blood cells"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 8, z: 0 }
    });

    // 4. Payload Chamber
    const chamberGroup = new THREE.Group();
    chamberGroup.position.set(0, 0, 4);
    const chamberGeo = new THREE.CylinderGeometry(2, 2, 3, 32);
    const chamberMesh = new THREE.Mesh(chamberGeo, glass);
    chamberMesh.rotation.x = Math.PI / 2;
    chamberGroup.add(chamberMesh);
    
    // Internal Medicine/Serum
    const medGeo = new THREE.CylinderGeometry(1.8, 1.8, 2.8, 32);
    const medMesh = new THREE.Mesh(medGeo, liquidMaterial);
    medMesh.rotation.x = Math.PI / 2;
    chamberGroup.add(medMesh);
    meshes.medicine = medMesh;

    // Glowing DNA strands inside the medicine
    const dnaGroup = new THREE.Group();
    for(let i=0; i<10; i++) {
        const nodeGeo = new THREE.SphereGeometry(0.15, 8, 8);
        const node1 = new THREE.Mesh(nodeGeo, glowingGreen);
        const node2 = new THREE.Mesh(nodeGeo, glowingRed);
        node1.position.set(Math.cos(i*0.6)*1, Math.sin(i*0.6)*1, (i*0.25) - 1.2);
        node2.position.set(Math.cos(i*0.6 + Math.PI)*1, Math.sin(i*0.6 + Math.PI)*1, (i*0.25) - 1.2);
        dnaGroup.add(node1);
        dnaGroup.add(node2);
    }
    chamberGroup.add(dnaGroup);
    meshes.dna = dnaGroup;

    group.add(chamberGroup);
    meshes.chamber = chamberGroup;
    parts.push({
        name: "Payload Chamber & Genetic Serum",
        description: "Stores the synthetic mRNA or specialized medication in a cryo-stasis suspension until intracellular injection.",
        material: "Reinforced Glass & Liquid Substrate",
        function: "Medicine Storage",
        assemblyOrder: 4,
        connections: ["Titanium-Carbon Hull", "Injector Syringe"],
        failureEffect: "Premature release of payload into the bloodstream.",
        cascadeFailures: ["Ineffective treatment", "Toxicity response"],
        originalPosition: { x: 0, y: 0, z: 4 },
        explodedPosition: { x: 5, y: 5, z: 4 }
    });

    // 5. Injector Syringe
    const syringeGroup = new THREE.Group();
    syringeGroup.position.set(0, 0, 6.5);
    
    const baseGeo = new THREE.CylinderGeometry(1.5, 0.5, 2, 32);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.rotation.x = Math.PI / 2;
    syringeGroup.add(baseMesh);
    
    const needleGeo = new THREE.CylinderGeometry(0.05, 0.2, 5, 16);
    const needleMesh = new THREE.Mesh(needleGeo, steel);
    needleMesh.position.set(0, 0, 3.5);
    needleMesh.rotation.x = Math.PI / 2;
    syringeGroup.add(needleMesh);
    
    group.add(syringeGroup);
    meshes.syringe = syringeGroup;
    parts.push({
        name: "Micro-Needle Injector",
        description: "A mono-molecular tipped lance designed to pierce cellular lipid bilayers without causing apoptosis.",
        material: "Surgical Steel",
        function: "Intracellular Penetration",
        assemblyOrder: 5,
        connections: ["Payload Chamber"],
        failureEffect: "Inability to breach the target cell.",
        cascadeFailures: ["Mission failure", "Target cell death if torn"],
        originalPosition: { x: 0, y: 0, z: 6.5 },
        explodedPosition: { x: 0, y: -8, z: 10 }
    });

    // 6. Navigation Sensor Array
    const sensorGroup = new THREE.Group();
    for(let i=0; i<6; i++) {
        const sGeo = new THREE.CylinderGeometry(0.2, 0.4, 0.5, 16);
        const sMesh = new THREE.Mesh(sGeo, goldContacts);
        const angle = i * (Math.PI / 3);
        sMesh.position.set(Math.cos(angle)*2.6, Math.sin(angle)*2.6, 2.5);
        sMesh.rotation.z = -angle;
        sMesh.rotation.x = Math.PI/2;
        sensorGroup.add(sMesh);

        // glowing tip
        const tipGeo = new THREE.SphereGeometry(0.25, 16, 16);
        const tipMesh = new THREE.Mesh(tipGeo, glowingGreen);
        tipMesh.position.copy(sMesh.position);
        tipMesh.position.z += 0.3;
        sensorGroup.add(tipMesh);
    }
    group.add(sensorGroup);
    meshes.sensors = sensorGroup;
    parts.push({
        name: "Biochemical Sensor Array",
        description: "Detects chemical gradients, pH levels, and specific cell surface antigens to identify target pathogens or cancerous cells.",
        material: "Gold Contacts & Photon Receptors",
        function: "Target Identification / Navigation",
        assemblyOrder: 6,
        connections: ["Titanium-Carbon Hull", "Micro-Fusion Core"],
        failureEffect: "Loss of guidance. Nanobot attacks healthy cells or drifts aimlessly.",
        cascadeFailures: ["Auto-immune triggering"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 6, y: -4, z: 2 }
    });

    // 7. Ion Propulsion Array
    const propGroup = new THREE.Group();
    propGroup.position.set(0, 0, -2.5);
    
    const propCoreGeo = new THREE.CylinderGeometry(1, 2, 4, 32);
    const propCore = new THREE.Mesh(propCoreGeo, aluminum);
    propCore.rotation.x = -Math.PI / 2;
    propCore.position.set(0, 0, -2);
    propGroup.add(propCore);

    meshes.rings = [];
    for(let i=1; i<=4; i++) {
        const pGeo = new THREE.TorusGeometry(1.8 - i*0.2, 0.1, 16, 64);
        const pMesh = new THREE.Mesh(pGeo, energyField);
        pMesh.position.set(0, 0, -2 - i*0.8);
        propGroup.add(pMesh);
        meshes.rings.push({ mesh: pMesh, offset: i });
    }
    
    group.add(propGroup);
    meshes.propulsion = propGroup;
    parts.push({
        name: "Magneto-Hydrodynamic Thruster",
        description: "Propels the nanobot through thick blood plasma by accelerating ionized particles along a magnetic gradient.",
        material: "Aluminum & Energy Fields",
        function: "Locomotion",
        assemblyOrder: 7,
        connections: ["Micro-Fusion Core", "Titanium-Carbon Hull"],
        failureEffect: "Complete loss of forward momentum.",
        cascadeFailures: ["Flushed out by kidneys", "Trapped in capillary"],
        originalPosition: { x: 0, y: 0, z: -2.5 },
        explodedPosition: { x: 0, y: 0, z: -10 }
    });

    // 8. Membrane Grapples
    const clampGroup = new THREE.Group();
    meshes.clamps = [];
    for(let i=0; i<3; i++) {
        const cBaseGroup = new THREE.Group();
        
        const armGeo = new THREE.BoxGeometry(0.4, 3, 0.4);
        const arm = new THREE.Mesh(armGeo, darkSteel);
        arm.position.y = 1.5;
        
        const hookGeo = new THREE.ConeGeometry(0.3, 1, 16);
        const hook = new THREE.Mesh(hookGeo, steel);
        hook.position.y = 3;
        hook.rotation.x = Math.PI / 2;
        hook.position.z = 0.5;

        cBaseGroup.add(arm);
        cBaseGroup.add(hook);
        
        const angle = i * (Math.PI * 2 / 3);
        cBaseGroup.rotation.z = angle;
        cBaseGroup.position.set(
            Math.cos(angle) * 2.5,
            Math.sin(angle) * 2.5,
            4.5
        );
        
        clampGroup.add(cBaseGroup);
        meshes.clamps.push({ group: cBaseGroup, angle: angle });
    }
    group.add(clampGroup);
    parts.push({
        name: "Membrane Grapples",
        description: "Micro-hooks that latch onto the cellular membrane, stabilizing the nanobot against the rushing current of the bloodstream during injection.",
        material: "Dark Steel",
        function: "Anchoring / Stabilization",
        assemblyOrder: 8,
        connections: ["Payload Chamber", "Injector Syringe"],
        failureEffect: "Nanobot detaches mid-injection.",
        cascadeFailures: ["Cell membrane rupture", "Payload spilled into bloodstream"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -6, y: -6, z: 6 }
    });

    const description = "The Nanobot Medical Injector is an experimental, microscopic intracellular delivery vehicle. Powered by a micro-fusion core and shielded by a magnetic containment field, it navigates the human bloodstream to deliver targeted genetic payloads or extreme-precision medication directly into the nucleus of diseased cells.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Magnetic Containment Field in the nanobot?",
            options: [
                "To cut through the cellular membrane.",
                "To stabilize the micro-fusion core and shield surrounding biological tissue from radiation.",
                "To attract red blood cells for oxygen harvesting.",
                "To transmit radio signals back to the medical operator."
            ],
            correct: 1,
            explanation: "The micro-fusion core generates immense energy and radiation. The magnetic containment field prevents this from causing a thermal cascade that would destroy surrounding healthy cells.",
            difficulty: "Medium"
        },
        {
            question: "Why is a Titanium-Carbon alloy chosen for the primary hull?",
            options: [
                "It dissolves easily once the mission is complete.",
                "It generates electric fields when in contact with blood plasma.",
                "High tensile strength and extreme biocompatibility to evade the immune system.",
                "It is the cheapest material to manufacture at the nanoscale."
            ],
            correct: 2,
            explanation: "Biocompatibility is critical. If the host's immune system detects the nanobot, white blood cells (macrophages) will attack and destroy it before it can deliver its payload.",
            difficulty: "Easy"
        },
        {
            question: "What happens if the Membrane Grapples fail during an injection sequence?",
            options: [
                "The nanobot loses its anchor, potentially injecting payload into the extracellular matrix or tearing the cell membrane.",
                "The micro-fusion core detonates instantly.",
                "The propulsion system reverses polarity.",
                "The payload becomes highly toxic."
            ],
            correct: 0,
            explanation: "Blood flow creates immense shear forces. The grapples anchor the nanobot to the cell. Without them, the nanobot could be ripped away while the needle is inserted, tearing the cell and spilling the medicine.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, activeMeshes) {
        // Spin the fusion core rapidly
        if (activeMeshes.core) {
            activeMeshes.core.rotation.x += 0.05 * speed;
            activeMeshes.core.rotation.y += 0.07 * speed;
            activeMeshes.core.rotation.z += 0.03 * speed;
        }

        // Pulse the containment field
        if (activeMeshes.field) {
            activeMeshes.field.rotation.z -= 0.02 * speed;
            activeMeshes.field.rotation.y += 0.01 * speed;
            const scale = 1 + 0.03 * Math.sin(time * 5 * speed);
            activeMeshes.field.scale.set(scale, scale, scale);
        }

        // Animate DNA spinning and glowing
        if (activeMeshes.dna) {
            activeMeshes.dna.rotation.z += 0.02 * speed;
            activeMeshes.dna.position.z = Math.sin(time * 2 * speed) * 0.2;
        }

        // Sensor array scanning
        if (activeMeshes.sensors) {
            activeMeshes.sensors.rotation.z = Math.sin(time * speed) * 0.5;
        }

        // Injector syringe pumping motion
        if (activeMeshes.syringe) {
            activeMeshes.syringe.position.z = 6.5 + Math.sin(time * 3 * speed) * 0.5;
        }

        // Thruster rings pulsing and rotating
        if (activeMeshes.rings) {
            activeMeshes.rings.forEach((r, idx) => {
                r.mesh.rotation.z += (idx % 2 === 0 ? 0.1 : -0.1) * speed;
                const rScale = 1 + 0.1 * Math.sin(time * 8 * speed + r.offset);
                r.mesh.scale.set(rScale, rScale, rScale);
            });
        }

        // Grapples opening and closing
        if (activeMeshes.clamps) {
            activeMeshes.clamps.forEach(clamp => {
                // Hinge at the base by rotating around X/Y relative to Z
                clamp.group.rotation.x = Math.sin(time * 2 * speed) * 0.1;
            });
        }
        
        // Fluid pulsing in medicine
        if (activeMeshes.medicine) {
            activeMeshes.medicine.scale.y = 1 + 0.02 * Math.sin(time * 4 * speed);
            activeMeshes.medicine.scale.x = 1 + 0.02 * Math.cos(time * 4 * speed);
        }
    }

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate,
        meshes
    };
}
