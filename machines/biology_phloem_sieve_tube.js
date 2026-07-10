import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const glowingSapMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffcc,
        emissive: 0x00ffcc,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.8
    });

    const glowingCellMembrane = new THREE.MeshStandardMaterial({
        color: 0x33aa33,
        emissive: 0x114411,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
    });

    const glowingPlasmodesmata = new THREE.MeshStandardMaterial({
        color: 0xffff00,
        emissive: 0xaa8800,
        emissiveIntensity: 0.8
    });
    
    const companionCellMaterial = new THREE.MeshStandardMaterial({
        color: 0x228822,
        roughness: 0.6,
        metalness: 0.1
    });

    const sievePlateMaterial = new THREE.MeshStandardMaterial({
        color: 0xaaffaa,
        roughness: 0.4,
        metalness: 0.2,
        transparent: true,
        opacity: 0.7
    });

    // 1. Top Sieve Tube Element
    const tubeGeometry1 = new THREE.CylinderGeometry( 2, 2, 6, 32 );
    const tubeMesh1 = new THREE.Mesh( tubeGeometry1, glowingCellMembrane );
    tubeMesh1.position.set(0, 3, 0);
    group.add(tubeMesh1);
    parts.push({
        name: "Upper Sieve Tube Element",
        description: "A living, elongated cell that forms part of the phloem network, mostly devoid of organelles to allow sap flow.",
        material: "glowingCellMembrane",
        function: "Transports photosynthates (sugars) through the plant.",
        assemblyOrder: 1,
        connections: ["Sieve Plate", "Upper Companion Cell"],
        failureEffect: "Blockage of sap flow.",
        cascadeFailures: ["Reduced root growth", "Plant starvation"],
        originalPosition: { x: 0, y: 3, z: 0 },
        explodedPosition: { x: 0, y: 6, z: 0 }
    });

    // 2. Bottom Sieve Tube Element
    const tubeGeometry2 = new THREE.CylinderGeometry( 2, 2, 6, 32 );
    const tubeMesh2 = new THREE.Mesh( tubeGeometry2, glowingCellMembrane );
    tubeMesh2.position.set(0, -3, 0);
    group.add(tubeMesh2);
    parts.push({
        name: "Lower Sieve Tube Element",
        description: "Connects vertically with the upper element to form a continuous tube.",
        material: "glowingCellMembrane",
        function: "Continues the transport pathway for organic nutrients.",
        assemblyOrder: 2,
        connections: ["Sieve Plate", "Lower Companion Cell"],
        failureEffect: "Loss of nutrient transport to lower tissues.",
        cascadeFailures: ["Tissue death below blockage"],
        originalPosition: { x: 0, y: -3, z: 0 },
        explodedPosition: { x: 0, y: -6, z: 0 }
    });

    // 3. Sieve Plate
    const plateGeometry = new THREE.CylinderGeometry( 2, 2, 0.2, 32 );
    const plateMesh = new THREE.Mesh( plateGeometry, sievePlateMaterial );
    plateMesh.position.set(0, 0, 0);
    group.add(plateMesh);
    parts.push({
        name: "Sieve Plate",
        description: "A porous end wall between sieve tube elements.",
        material: "sievePlateMaterial",
        function: "Allows sap to flow smoothly between cells while preventing total loss in case of injury.",
        assemblyOrder: 3,
        connections: ["Upper Sieve Tube Element", "Lower Sieve Tube Element"],
        failureEffect: "Callose buildup blocks pores, stopping sap flow.",
        cascadeFailures: ["Phloem transport cessation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -5 }
    });
    
    // Add pores to sieve plate
    for(let i=0; i<12; i++) {
        const poreGeom = new THREE.CylinderGeometry(0.2, 0.2, 0.25, 8);
        const poreMesh = new THREE.Mesh(poreGeom, new THREE.MeshBasicMaterial({color: 0x000000}));
        const angle = (i / 12) * Math.PI * 2;
        poreMesh.position.set(Math.cos(angle)*1.2, 0, Math.sin(angle)*1.2);
        plateMesh.add(poreMesh);
    }

    // 4. Companion Cell Top
    const companionGeom = new THREE.CapsuleGeometry( 1.5, 4, 16, 16 );
    const companionMesh1 = new THREE.Mesh( companionGeom, companionCellMaterial );
    companionMesh1.position.set(3, 3, 0);
    group.add(companionMesh1);
    parts.push({
        name: "Upper Companion Cell",
        description: "A nucleated cell intimately associated with the sieve tube element.",
        material: "companionCellMaterial",
        function: "Provides metabolic support and ATP for the sieve tube, loads sugars into the phloem.",
        assemblyOrder: 4,
        connections: ["Upper Sieve Tube Element", "Upper Plasmodesmata"],
        failureEffect: "Sieve tube element dies due to lack of metabolic support.",
        cascadeFailures: ["Phloem failure in the segment"],
        originalPosition: { x: 3, y: 3, z: 0 },
        explodedPosition: { x: 6, y: 3, z: 0 }
    });

    // 5. Companion Cell Bottom
    const companionMesh2 = new THREE.Mesh( companionGeom, companionCellMaterial );
    companionMesh2.position.set(3, -3, 0);
    group.add(companionMesh2);
    parts.push({
        name: "Lower Companion Cell",
        description: "Associated with the lower sieve tube element.",
        material: "companionCellMaterial",
        function: "Unloads sugars or provides energy.",
        assemblyOrder: 5,
        connections: ["Lower Sieve Tube Element", "Lower Plasmodesmata"],
        failureEffect: "Inability to maintain lower sieve tube.",
        cascadeFailures: ["Phloem dysfunction"],
        originalPosition: { x: 3, y: -3, z: 0 },
        explodedPosition: { x: 6, y: -3, z: 0 }
    });

    // 6. Plasmodesmata Top
    const plasmoGeom = new THREE.CylinderGeometry( 0.3, 0.3, 1.5, 16 );
    plasmoGeom.rotateZ(Math.PI / 2);
    const plasmo1 = new THREE.Mesh(plasmoGeom, glowingPlasmodesmata);
    plasmo1.position.set(1.5, 3, 0);
    group.add(plasmo1);
    parts.push({
        name: "Upper Plasmodesmata",
        description: "Microscopic channels traversing cell walls.",
        material: "glowingPlasmodesmata",
        function: "Enable transport and communication between the companion cell and sieve tube.",
        assemblyOrder: 6,
        connections: ["Upper Sieve Tube Element", "Upper Companion Cell"],
        failureEffect: "No transfer of ATP or sugars.",
        cascadeFailures: ["Starvation of sieve tube element"],
        originalPosition: { x: 1.5, y: 3, z: 0 },
        explodedPosition: { x: 3, y: 3, z: 3 }
    });

    // 7. Plasmodesmata Bottom
    const plasmo2 = new THREE.Mesh(plasmoGeom, glowingPlasmodesmata);
    plasmo2.position.set(1.5, -3, 0);
    group.add(plasmo2);
    parts.push({
        name: "Lower Plasmodesmata",
        description: "Connections between lower cells.",
        material: "glowingPlasmodesmata",
        function: "Facilitate metabolite exchange.",
        assemblyOrder: 7,
        connections: ["Lower Sieve Tube Element", "Lower Companion Cell"],
        failureEffect: "Isolation of sieve tube element.",
        cascadeFailures: ["Localized transport failure"],
        originalPosition: { x: 1.5, y: -3, z: 0 },
        explodedPosition: { x: 3, y: -3, z: 3 }
    });

    // Sap particles for animation
    const sapParticles = new THREE.Group();
    const particleGeo = new THREE.SphereGeometry(0.2, 8, 8);
    for(let i=0; i<30; i++) {
        const particle = new THREE.Mesh(particleGeo, glowingSapMaterial);
        particle.position.set(
            (Math.random() - 0.5) * 2.5,
            Math.random() * 12 - 6,
            (Math.random() - 0.5) * 2.5
        );
        sapParticles.add(particle);
    }
    group.add(sapParticles);

    // Map meshes to names for animation
    const meshes = {
        upperTube: tubeMesh1,
        lowerTube: tubeMesh2,
        sievePlate: plateMesh,
        companion1: companionMesh1,
        companion2: companionMesh2,
        plasmo1: plasmo1,
        plasmo2: plasmo2,
        sapParticles: sapParticles
    };

    const description = "A high-tech visualization of a Phloem Sieve Tube and its Companion Cells. Phloem is responsible for the transport of sugars and other metabolic products downwards from the leaves to the roots (and occasionally upwards). Sieve tube elements are highly specialized cells lacking a nucleus, relying entirely on adjacent companion cells for metabolic support via plasmodesmata.";

    const quizQuestions = [
        {
            question: "Why do sieve tube elements lack a nucleus and most organelles?",
            options: [
                "To save energy",
                "To make space for the efficient flow of sap",
                "Because they are dead cells at maturity",
                "To prevent viral infections"
            ],
            correct: 1,
            explanation: "Sieve tube elements lose their nucleus and most organelles during development to maximize the internal volume available for bulk flow of sap.",
            difficulty: "Medium"
        },
        {
            question: "What is the primary function of the companion cell?",
            options: [
                "To transport water upwards",
                "To provide structural support to the stem",
                "To supply ATP and metabolic support to the sieve tube element",
                "To store excess starch"
            ],
            correct: 2,
            explanation: "Since sieve tube elements lack many organelles, companion cells act as their 'life support', producing ATP and proteins, and assisting in loading/unloading sugars.",
            difficulty: "Medium"
        },
        {
            question: "What connects the companion cell cytoplasm directly to the sieve tube element?",
            options: [
                "Sieve pores",
                "Xylem vessels",
                "Plasmodesmata",
                "Casparian strips"
            ],
            correct: 2,
            explanation: "Plasmodesmata are channels that traverse the cell walls of plant cells and some algal cells, enabling transport and communication between them.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Animate sap particles flowing downwards
        meshes.sapParticles.children.forEach(particle => {
            particle.position.y -= speed * 0.05;
            if (particle.position.y < -6) {
                particle.position.y = 6;
                particle.position.x = (Math.random() - 0.5) * 2.5;
                particle.position.z = (Math.random() - 0.5) * 2.5;
            }
        });

        // Pulsate plasmodesmata and companion cells
        const pulse = (Math.sin(time * speed * 2) + 1) / 2;
        meshes.plasmo1.material.emissiveIntensity = 0.5 + pulse * 0.5;
        meshes.plasmo2.material.emissiveIntensity = 0.5 + pulse * 0.5;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createPhloemSieveTube() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
