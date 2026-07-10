import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const photonMaterial = new THREE.MeshStandardMaterial({
        color: 0xffff00,
        emissive: 0xffff00,
        emissiveIntensity: 2,
        transparent: true,
        opacity: 0.8
    });

    const atpMaterial = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.9
    });

    const nadphMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.9
    });
    
    const membraneMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x11aa22,
        emissive: 0x052205,
        emissiveIntensity: 0.2,
        metalness: 0.3,
        roughness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        transparent: true,
        opacity: 0.85
    });

    const innerLumenMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x004411,
        metalness: 0.1,
        roughness: 0.5,
        transparent: true,
        opacity: 0.5
    });

    // 1. Thylakoid Membrane Discs (Granum Stack)
    const granumStackMesh = new THREE.Group();
    const numDiscs = 6;
    for(let i=0; i<numDiscs; i++) {
        const discGeom = new THREE.CylinderGeometry(2, 2, 0.4, 32);
        const discMesh = new THREE.Mesh(discGeom, membraneMaterial);
        discMesh.position.y = (i - numDiscs/2) * 0.6;
        
        // Add lumen core to each disc
        const lumenGeom = new THREE.CylinderGeometry(1.8, 1.8, 0.38, 32);
        const lumenMesh = new THREE.Mesh(lumenGeom, innerLumenMaterial);
        lumenMesh.position.copy(discMesh.position);
        
        granumStackMesh.add(discMesh);
        granumStackMesh.add(lumenMesh);
    }
    
    parts.push({
        name: "Granum Stack",
        description: "A stack of thylakoid discs where the light-dependent reactions of photosynthesis occur.",
        material: "Chloroplast Membrane / Lumen",
        function: "Maximizes surface area for photosystems to capture light and generate ATP/NADPH.",
        assemblyOrder: 1,
        connections: ["Photosystem II", "Cytochrome b6f", "Photosystem I", "ATP Synthase"],
        failureEffect: "Complete failure of the light-dependent reactions, ceasing plant energy production.",
        cascadeFailures: ["Stroma", "Calvin Cycle"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 5, z: 0}
    });

    granumStackMesh.userData = { partName: "Granum Stack" };
    group.add(granumStackMesh);

    // 2. Photosystem II (PSII)
    const ps2Geom = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const ps2Mesh = new THREE.Mesh(ps2Geom, copper);
    ps2Mesh.position.set(1.6, 0, 0);
    granumStackMesh.add(ps2Mesh);
    
    parts.push({
        name: "Photosystem II",
        description: "The first protein complex in the light-dependent reactions.",
        material: "Protein / Copper",
        function: "Absorbs photons and uses the energy to extract electrons from water, releasing oxygen.",
        assemblyOrder: 2,
        connections: ["Granum Stack", "Plastoquinone", "Oxygen Evolving Complex"],
        failureEffect: "Inability to split water, leading to lack of electrons and oxygen production.",
        cascadeFailures: ["Electron Transport Chain", "ATP Synthase"],
        originalPosition: {x: 1.6, y: 0, z: 0},
        explodedPosition: {x: 4, y: 2, z: 0}
    });

    // 3. Photosystem I (PSI)
    const ps1Geom = new THREE.SphereGeometry(0.5, 16, 16);
    const ps1Mesh = new THREE.Mesh(ps1Geom, aluminum);
    ps1Mesh.position.set(-1.6, 0, 0);
    granumStackMesh.add(ps1Mesh);

    parts.push({
        name: "Photosystem I",
        description: "The second photosystem in the photosynthetic electron transport chain.",
        material: "Protein / Aluminum",
        function: "Re-energizes electrons using light energy to eventually reduce NADP+ to NADPH.",
        assemblyOrder: 3,
        connections: ["Granum Stack", "Plastocyanin", "Ferredoxin"],
        failureEffect: "Inability to reduce NADP+, leading to no NADPH production for the Calvin cycle.",
        cascadeFailures: ["Calvin Cycle", "Carbon Fixation"],
        originalPosition: {x: -1.6, y: 0, z: 0},
        explodedPosition: {x: -4, y: 2, z: 0}
    });

    // 4. ATP Synthase Complex
    const atpSynthaseGroup = new THREE.Group();
    
    const foGeom = new THREE.CylinderGeometry(0.3, 0.3, 1, 16);
    const foMesh = new THREE.Mesh(foGeom, steel);
    
    const f1Geom = new THREE.SphereGeometry(0.6, 16, 16);
    const f1Mesh = new THREE.Mesh(f1Geom, chrome);
    f1Mesh.position.y = 0.8;
    
    atpSynthaseGroup.add(foMesh);
    atpSynthaseGroup.add(f1Mesh);
    atpSynthaseGroup.position.set(0, 2, 1.2);
    atpSynthaseGroup.rotation.x = Math.PI / 4;
    group.add(atpSynthaseGroup);

    parts.push({
        name: "ATP Synthase Complex",
        description: "A molecular machine that synthesizes ATP from ADP and inorganic phosphate.",
        material: "Protein / Steel / Chrome",
        function: "Uses the proton gradient created by the electron transport chain to power ATP production via mechanical rotation.",
        assemblyOrder: 4,
        connections: ["Granum Stack", "Stroma"],
        failureEffect: "Proton gradient dissipates without producing ATP, starving the plant of energy.",
        cascadeFailures: ["Calvin Cycle"],
        originalPosition: {x: 0, y: 2, z: 1.2},
        explodedPosition: {x: 0, y: 6, z: 4}
    });

    // 5. Photon Particles (Incoming Light)
    const photonGroup = new THREE.Group();
    const numPhotons = 5;
    for(let i=0; i<numPhotons; i++) {
        const pGeom = new THREE.SphereGeometry(0.15, 8, 8);
        const pMesh = new THREE.Mesh(pGeom, photonMaterial);
        pMesh.position.set(Math.random() * 4 - 2, 4 + Math.random() * 2, Math.random() * 4 - 2);
        photonGroup.add(pMesh);
    }
    group.add(photonGroup);
    
    parts.push({
        name: "Incoming Photons",
        description: "Light energy particles from the sun.",
        material: "Glowing Energy",
        function: "Excites electrons in the photosystems.",
        assemblyOrder: 5,
        connections: ["Photosystem II", "Photosystem I"],
        failureEffect: "Without light, photosynthesis stops completely.",
        cascadeFailures: ["Entire Photosystem"],
        originalPosition: {x: 0, y: 5, z: 0},
        explodedPosition: {x: 0, y: 10, z: 0}
    });

    // 6. ATP and NADPH Energy Carriers (Outputs)
    const energyCarrierGroup = new THREE.Group();
    
    // ATP
    for(let i=0; i<3; i++) {
        const atpGeom = new THREE.DodecahedronGeometry(0.2);
        const atpMesh = new THREE.Mesh(atpGeom, atpMaterial);
        atpMesh.position.set(1 + Math.random(), 2 + Math.random(), 1 + Math.random());
        energyCarrierGroup.add(atpMesh);
        atpMesh.userData = { type: 'atp' };
    }
    
    // NADPH
    for(let i=0; i<3; i++) {
        const nadphGeom = new THREE.OctahedronGeometry(0.2);
        const nadphMesh = new THREE.Mesh(nadphGeom, nadphMaterial);
        nadphMesh.position.set(-1 - Math.random(), 2 + Math.random(), 1 + Math.random());
        energyCarrierGroup.add(nadphMesh);
        nadphMesh.userData = { type: 'nadph' };
    }
    
    group.add(energyCarrierGroup);
    
    parts.push({
        name: "Energy Carriers (ATP/NADPH)",
        description: "High-energy molecules produced by the light-dependent reactions.",
        material: "Neon Energy",
        function: "Provide the energy and reducing power for the Calvin cycle to fix carbon into sugars.",
        assemblyOrder: 6,
        connections: ["ATP Synthase", "Photosystem I", "Calvin Cycle"],
        failureEffect: "No energy delivered to the Calvin cycle, halting sugar synthesis.",
        cascadeFailures: ["Plant Growth"],
        originalPosition: {x: 0, y: 2.5, z: 1.5},
        explodedPosition: {x: 0, y: 8, z: 5}
    });

    const description = "The Thylakoid Stack (Granum) is the core biological machine of photosynthesis. It houses the light-dependent reactions, converting solar energy into chemical energy (ATP and NADPH) through an intricate electron transport chain and a spinning ATP Synthase motor.";

    const quizQuestions = [
        {
            question: "Which complex is responsible for splitting water molecules to release oxygen?",
            options: ["Photosystem I", "ATP Synthase", "Photosystem II", "Cytochrome b6f"],
            correct: 2,
            explanation: "Photosystem II contains the oxygen-evolving complex that splits water to extract electrons, releasing oxygen as a byproduct.",
            difficulty: "Medium"
        },
        {
            question: "What powers the mechanical rotation of ATP Synthase?",
            options: ["A gradient of protons (H+)", "Absorption of light photons", "Hydrolysis of ATP", "Electron transport directly"],
            correct: 0,
            explanation: "The electron transport chain pumps protons into the thylakoid lumen, creating a gradient. As protons flow back out through ATP Synthase, they turn its rotor, driving ATP production.",
            difficulty: "Hard"
        },
        {
            question: "What are the two primary high-energy products of the thylakoid light-dependent reactions?",
            options: ["Glucose and Oxygen", "ATP and NADPH", "ADP and NADP+", "Water and Carbon Dioxide"],
            correct: 1,
            explanation: "The light reactions produce ATP (energy) and NADPH (reducing power), which are then used in the stroma by the Calvin cycle to synthesize sugars.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshes) {
        // Rotate the ATP Synthase rotor (F1 head)
        if (atpSynthaseGroup.children[1]) {
            atpSynthaseGroup.children[1].rotation.y = time * speed * 2;
        }

        // Animate incoming photons raining down
        photonGroup.children.forEach((photon, idx) => {
            photon.position.y -= speed * 0.1 * (idx + 1);
            photon.rotation.x += speed * 0.05;
            photon.rotation.y += speed * 0.05;
            // Reset position if it hits the granum
            if (photon.position.y < 0) {
                photon.position.y = 5 + Math.random() * 2;
                photon.position.x = Math.random() * 4 - 2;
                photon.position.z = Math.random() * 4 - 2;
            }
        });

        // Float and pulse the energy carriers
        energyCarrierGroup.children.forEach((carrier, idx) => {
            carrier.position.y += Math.sin(time * speed + idx) * 0.01;
            carrier.rotation.x += speed * 0.02;
            carrier.rotation.y += speed * 0.03;
            
            // Pulse emissive intensity
            const pulse = 1.0 + Math.sin(time * speed * 3 + idx) * 0.5;
            if(carrier.material) {
                carrier.material.emissiveIntensity = carrier.userData.type === 'atp' ? 1.5 * pulse : 1.5 * pulse;
            }
        });
        
        // Gentle hover of the entire stack
        group.position.y = Math.sin(time * speed * 0.5) * 0.1;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createThylakoidStack() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
