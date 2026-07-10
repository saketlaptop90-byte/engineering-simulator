import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom Glowing Materials
    const cellMembraneMat = new THREE.MeshPhysicalMaterial({
        color: 0x88ccff,
        transparent: true,
        opacity: 0.6,
        roughness: 0.2,
        transmission: 0.9,
        thickness: 0.5,
        emissive: 0x224488,
        emissiveIntensity: 0.5
    });

    const nucleusMat = new THREE.MeshStandardMaterial({
        color: 0xaa22ff,
        roughness: 0.4,
        emissive: 0x4400aa,
        emissiveIntensity: 0.8
    });

    const lysosomeMat = new THREE.MeshStandardMaterial({
        color: 0x22ff44,
        roughness: 0.3,
        emissive: 0x00aa22,
        emissiveIntensity: 1.0
    });

    const pathogenMat = new THREE.MeshStandardMaterial({
        color: 0xff2222,
        roughness: 0.5,
        emissive: 0xff0000,
        emissiveIntensity: 1.5,
        wireframe: true
    });

    const pseudopodiumMat = cellMembraneMat.clone();

    // 1. Cell Body (Main membrane)
    const bodyGeometry = new THREE.SphereGeometry(3, 64, 64);
    const cellBody = new THREE.Mesh(bodyGeometry, cellMembraneMat);
    group.add(cellBody);
    meshes.cellBody = cellBody;

    parts.push({
        name: 'Cell Membrane',
        description: 'The flexible outer boundary of the macrophage, capable of changing shape to engulf pathogens.',
        material: 'cellMembraneMat',
        function: 'Encloses the cell and controls the movement of substances in and out; extends to form pseudopodia.',
        assemblyOrder: 1,
        connections: ['Nucleus', 'Pseudopodia'],
        failureEffect: 'Cell lysis and death; inability to maintain internal environment.',
        cascadeFailures: ['Complete cellular failure'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 }
    });

    // 2. Nucleus
    const nucleusGeometry = new THREE.SphereGeometry(1.2, 32, 32);
    const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMat);
    nucleus.position.set(-0.5, 0.5, -0.5);
    group.add(nucleus);
    meshes.nucleus = nucleus;

    parts.push({
        name: 'Nucleus',
        description: 'The command center of the cell, containing genetic material.',
        material: 'nucleusMat',
        function: 'Regulates gene expression and controls the cellular responses, including cytokine production.',
        assemblyOrder: 2,
        connections: ['Cell Membrane'],
        failureEffect: 'Inability to synthesize proteins or respond to immune signals.',
        cascadeFailures: ['Cytokine release failure'],
        originalPosition: { x: -0.5, y: 0.5, z: -0.5 },
        explodedPosition: { x: -3, y: 8, z: -3 }
    });

    // 3. Lysosomes
    const lysosomeGeo = new THREE.SphereGeometry(0.4, 16, 16);
    meshes.lysosomes = [];
    const lysosomePositions = [
        { x: 1.5, y: -1, z: 1 },
        { x: -1.5, y: -1, z: 1.5 },
        { x: 1, y: 1.5, z: -1.5 },
        { x: 0, y: -2, z: -0.5 }
    ];

    lysosomePositions.forEach((pos) => {
        const lysosome = new THREE.Mesh(lysosomeGeo, lysosomeMat);
        lysosome.position.set(pos.x, pos.y, pos.z);
        group.add(lysosome);
        meshes.lysosomes.push(lysosome);
    });

    parts.push({
        name: 'Lysosomes',
        description: 'Vesicles containing digestive enzymes.',
        material: 'lysosomeMat',
        function: 'Fuses with the phagosome to break down and digest engulfed pathogens.',
        assemblyOrder: 3,
        connections: ['Phagosome'],
        failureEffect: 'Pathogen remains undigested inside the macrophage, potentially leading to chronic infection.',
        cascadeFailures: ['Intracellular pathogen replication'],
        originalPosition: { x: 1.5, y: -1, z: 1 },
        explodedPosition: { x: 5, y: -5, z: 5 }
    });

    // 4. Pseudopodia (Engulfing arms)
    const pseudoGeo = new THREE.CylinderGeometry(0.8, 2, 4, 32);
    pseudoGeo.rotateZ(-Math.PI / 4);
    pseudoGeo.translate(2.5, 1.5, 0);
    const pseudopodium1 = new THREE.Mesh(pseudoGeo, pseudopodiumMat);
    group.add(pseudopodium1);
    meshes.pseudopodium1 = pseudopodium1;

    const pseudoGeo2 = new THREE.CylinderGeometry(0.8, 2, 4, 32);
    pseudoGeo2.rotateZ(Math.PI / 4);
    pseudoGeo2.rotateY(Math.PI / 2);
    pseudoGeo2.translate(2.5, -1.5, 0);
    const pseudopodium2 = new THREE.Mesh(pseudoGeo2, pseudopodiumMat);
    group.add(pseudopodium2);
    meshes.pseudopodium2 = pseudopodium2;

    parts.push({
        name: 'Pseudopodia',
        description: 'Temporary arm-like projections of the cell membrane.',
        material: 'pseudopodiumMat',
        function: 'Used for motility and to surround and engulf large particles like bacteria.',
        assemblyOrder: 4,
        connections: ['Cell Membrane'],
        failureEffect: 'Inability to move towards or engulf pathogens (phagocytosis fails).',
        cascadeFailures: ['Infection spread'],
        originalPosition: { x: 2.5, y: 1.5, z: 0 },
        explodedPosition: { x: 8, y: 5, z: 0 }
    });

    // 5. Target Pathogen (Bacteria)
    const pathogenGeo = new THREE.CapsuleGeometry(0.5, 1, 16, 16);
    const pathogen = new THREE.Mesh(pathogenGeo, pathogenMat);
    pathogen.position.set(5, 2, 0);
    pathogen.rotation.z = Math.PI / 4;
    group.add(pathogen);
    meshes.pathogen = pathogen;

    parts.push({
        name: 'Pathogen (Target)',
        description: 'A harmful microorganism, such as a bacterium, targeted for destruction.',
        material: 'pathogenMat',
        function: 'Invades the host; triggers the immune response of the macrophage.',
        assemblyOrder: 5,
        connections: ['Pseudopodia'],
        failureEffect: 'N/A (Destruction is intended).',
        cascadeFailures: [],
        originalPosition: { x: 5, y: 2, z: 0 },
        explodedPosition: { x: 10, y: 8, z: 0 }
    });

    const description = "The Macrophage is a specialized white blood cell of the immune system that engulfs and digests cellular debris, foreign substances, microbes, cancer cells, and anything else that does not have the types of proteins specific to healthy body cells on its surface in a process called phagocytosis.";

    const quizQuestions = [
        {
            question: "What is the primary function of the macrophage's lysosomes?",
            options: [
                "To store genetic information",
                "To produce energy for the cell",
                "To release enzymes that digest engulfed pathogens",
                "To recognize self-proteins"
            ],
            correct: 2,
            explanation: "Lysosomes contain hydrolytic enzymes that break down pathogens after they are enclosed in a phagosome.",
            difficulty: "Medium"
        },
        {
            question: "What is the process by which a macrophage engulfs a pathogen called?",
            options: [
                "Pinocytosis",
                "Phagocytosis",
                "Exocytosis",
                "Apoptosis"
            ],
            correct: 1,
            explanation: "Phagocytosis is the process of engulfing large particles, such as bacteria, into vesicles.",
            difficulty: "Easy"
        },
        {
            question: "Which cellular structures allow the macrophage to move and wrap around a pathogen?",
            options: [
                "Cilia",
                "Flagella",
                "Pseudopodia",
                "Ribosomes"
            ],
            correct: 2,
            explanation: "Pseudopodia ('false feet') are actin-rich extensions of the cell membrane used for movement and engulfment.",
            difficulty: "Medium"
        }
    ];

    // Store original vertices for amoeboid animation
    const originalBodyVertices = bodyGeometry.attributes.position.array.slice();

    function animate(time, speed, activeMeshes = meshes) {
        const t = time * speed;

        // Pathogen pulsing and wiggling
        if (activeMeshes.pathogen) {
            activeMeshes.pathogen.rotation.x = t * 2;
            activeMeshes.pathogen.rotation.y = t * 1.5;
            const scale = 1 + Math.sin(t * 8) * 0.1;
            activeMeshes.pathogen.scale.set(scale, scale, scale);
            
            // Move pathogen towards pseudopodia (simulating engulfing over a loop)
            const cycle = (t * 0.5) % (Math.PI * 2);
            if (cycle < Math.PI) {
                activeMeshes.pathogen.position.x = 5 - Math.sin(cycle/2) * 3; // Moves from 5 to 2
            } else {
                activeMeshes.pathogen.position.x = 5; // Reset
            }
        }

        // Nucleus slow breathing
        if (activeMeshes.nucleus) {
            const nScale = 1 + Math.sin(t * 2) * 0.05;
            activeMeshes.nucleus.scale.set(nScale, nScale, nScale);
        }

        // Lysosomes swirling
        if (activeMeshes.lysosomes) {
            activeMeshes.lysosomes.forEach((lysosome, idx) => {
                const angle = t * (1 + idx * 0.5);
                lysosome.position.y += Math.sin(angle) * 0.01;
                lysosome.position.x += Math.cos(angle * 1.2) * 0.01;
            });
        }

        // Cell body amoeboid movement (vertex displacement)
        if (activeMeshes.cellBody) {
            const positionAttribute = activeMeshes.cellBody.geometry.attributes.position;
            const vertexArray = positionAttribute.array;
            
            for (let i = 0; i < vertexArray.length; i += 3) {
                const ox = originalBodyVertices[i];
                const oy = originalBodyVertices[i+1];
                const oz = originalBodyVertices[i+2];
                
                // Calculate distance from center
                const dist = Math.sqrt(ox*ox + oy*oy + oz*oz);
                if (dist === 0) continue;
                
                const noise = Math.sin(ox * 2 + t * 3) * Math.cos(oy * 2 + t * 2) * Math.sin(oz * 2 + t * 2.5);
                
                const factor = 1 + noise * 0.15;
                
                vertexArray[i] = ox * factor;
                vertexArray[i+1] = oy * factor;
                vertexArray[i+2] = oz * factor;
            }
            positionAttribute.needsUpdate = true;
            activeMeshes.cellBody.geometry.computeVertexNormals();
        }

        // Pseudopodia stretching
        if (activeMeshes.pseudopodium1) {
            const stretch = 1 + Math.sin(t * 3) * 0.2;
            activeMeshes.pseudopodium1.scale.y = stretch;
        }
        if (activeMeshes.pseudopodium2) {
            const stretch = 1 + Math.cos(t * 3) * 0.2;
            activeMeshes.pseudopodium2.scale.y = stretch;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createMacrophage() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
