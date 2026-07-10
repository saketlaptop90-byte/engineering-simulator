import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Custom Materials
    const glowingAcid = new THREE.MeshStandardMaterial({
        color: 0x33ff33,
        emissive: 0x22aa22,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8,
        roughness: 0.1,
        metalness: 0.2
    });

    const boneMaterial = new THREE.MeshStandardMaterial({
        color: 0xddddcc,
        roughness: 0.9,
        metalness: 0.05
    });

    const bioMembrane = new THREE.MeshPhysicalMaterial({
        color: 0xff44aa,
        transmission: 0.5,
        opacity: 0.9,
        transparent: true,
        roughness: 0.2,
        metalness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const nucleusMaterial = new THREE.MeshStandardMaterial({
        color: 0x8800ff,
        emissive: 0x4400aa,
        emissiveIntensity: 0.5,
        roughness: 0.4
    });

    const ruffledBorderMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0044,
        emissive: 0x880022,
        emissiveIntensity: 0.8,
        wireframe: true
    });

    const lysosomesMaterial = new THREE.MeshStandardMaterial({
        color: 0xffff00,
        emissive: 0xaaaa00,
        emissiveIntensity: 1.0
    });

    // 1. Bone Surface (Substrate)
    const boneGeom = new THREE.BoxGeometry(20, 2, 10);
    const boneMesh = new THREE.Mesh(boneGeom, boneMaterial);
    boneMesh.position.set(0, -1, 0);
    group.add(boneMesh);
    parts.push({
        name: 'Bone Matrix Substrate',
        description: 'The mineralized bone tissue that the osteoclast attaches to and resorbs.',
        material: 'Bone',
        function: 'Target of resorption',
        assemblyOrder: 1,
        connections: ['Sealing Zone'],
        failureEffect: 'No substrate to resorb.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: -1, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 },
        mesh: boneMesh
    });

    // 2. Cell Body (Main membrane)
    const cellGeom = new THREE.CapsuleGeometry(3, 8, 32, 32);
    const cellMesh = new THREE.Mesh(cellGeom, bioMembrane);
    cellMesh.rotation.z = Math.PI / 2;
    cellMesh.position.set(0, 3, 0);
    group.add(cellMesh);
    parts.push({
        name: 'Osteoclast Cell Membrane',
        description: 'A large, multi-nucleated cell responsible for bone resorption.',
        material: 'Lipid Bilayer (Synthetic)',
        function: 'Contains organelles and maintains cellular integrity.',
        assemblyOrder: 2,
        connections: ['Nuclei', 'Ruffled Border'],
        failureEffect: 'Cell lysis and death.',
        cascadeFailures: ['All internal organelles'],
        originalPosition: { x: 0, y: 3, z: 0 },
        explodedPosition: { x: 0, y: 8, z: 0 },
        mesh: cellMesh
    });

    // 3. Multi-Nuclei
    const nucleiMeshes = [];
    const nucleiOffsets = [
        { x: -3, y: 4, z: 0 },
        { x: 0, y: 4.5, z: -1 },
        { x: 3, y: 4, z: 1 }
    ];
    
    nucleiOffsets.forEach((pos, i) => {
        const nucGeom = new THREE.SphereGeometry(1.2, 16, 16);
        const nucMesh = new THREE.Mesh(nucGeom, nucleusMaterial);
        nucMesh.position.set(pos.x, pos.y, pos.z);
        group.add(nucMesh);
        nucleiMeshes.push(nucMesh);
        parts.push({
            name: `Nucleus ${i+1}`,
            description: 'One of several nuclei in this syncytial cell.',
            material: 'Nucleoplasm',
            function: 'Stores genetic material for high-volume protein synthesis.',
            assemblyOrder: 3 + i,
            connections: ['Cell Membrane'],
            failureEffect: 'Reduced protein synthesis.',
            cascadeFailures: ['Lysosome production'],
            originalPosition: { x: pos.x, y: pos.y, z: pos.z },
            explodedPosition: { x: pos.x * 2, y: pos.y + 5, z: pos.z * 2 },
            mesh: nucMesh
        });
    });

    // 4. Ruffled Border
    const ruffledGeom = new THREE.TorusKnotGeometry(2.5, 0.5, 100, 16);
    const ruffledMesh = new THREE.Mesh(ruffledGeom, ruffledBorderMaterial);
    ruffledMesh.rotation.x = Math.PI / 2;
    ruffledMesh.position.set(0, 1, 0);
    group.add(ruffledMesh);
    parts.push({
        name: 'Ruffled Border',
        description: 'Highly folded cell membrane at the bone interface.',
        material: 'Membrane Extensions',
        function: 'Increases surface area for secretion of acids and enzymes.',
        assemblyOrder: 6,
        connections: ['Cell Membrane', 'Bone Matrix Substrate'],
        failureEffect: 'Inability to resorb bone effectively.',
        cascadeFailures: ['Acid secretion', 'Enzyme delivery'],
        originalPosition: { x: 0, y: 1, z: 0 },
        explodedPosition: { x: 0, y: 3, z: 0 },
        mesh: ruffledMesh
    });

    // 5. Acid / Resorption Pit (Howship\'s Lacuna)
    const acidGeom = new THREE.CylinderGeometry(2.5, 2.0, 1, 32);
    const acidMesh = new THREE.Mesh(acidGeom, glowingAcid);
    acidMesh.position.set(0, 0.5, 0);
    group.add(acidMesh);
    parts.push({
        name: 'Resorption Pit (Howship\'s Lacuna)',
        description: 'The sealed microenvironment where bone is degraded.',
        material: 'Hydrochloric Acid & Enzymes',
        function: 'Dissolves hydroxyapatite crystals and digests collagen.',
        assemblyOrder: 7,
        connections: ['Ruffled Border', 'Bone Matrix Substrate'],
        failureEffect: 'No bone dissolution.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0.5, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 },
        mesh: acidMesh
    });

    // 6. Lysosomes / Secretory Vesicles
    const lysosomeMeshes = [];
    for(let i=0; i<8; i++) {
        const lysGeom = new THREE.SphereGeometry(0.3, 8, 8);
        const lysMesh = new THREE.Mesh(lysGeom, lysosomesMaterial);
        
        // Randomly scatter inside cell above ruffled border
        const theta = Math.random() * Math.PI * 2;
        const r = Math.random() * 2;
        const h = 2 + Math.random() * 2;
        
        const px = Math.cos(theta) * r;
        const pz = Math.sin(theta) * r;
        
        lysMesh.position.set(px, h, pz);
        group.add(lysMesh);
        lysosomeMeshes.push({ mesh: lysMesh, baseHeight: h, phase: Math.random() * Math.PI * 2 });
        
        if(i === 0) {
            parts.push({
                name: 'Secretory Vesicles (Lysosomes)',
                description: 'Vesicles containing Cathepsin K and other enzymes.',
                material: 'Lipid Vesicle',
                function: 'Transports enzymes to the ruffled border for exocytosis.',
                assemblyOrder: 8,
                connections: ['Cell Membrane'],
                failureEffect: 'No organic matrix degradation.',
                cascadeFailures: [],
                originalPosition: { x: px, y: h, z: pz },
                explodedPosition: { x: px * 3, y: h + 3, z: pz * 3 },
                mesh: lysMesh
            });
        }
    }

    const description = "The Osteoclast is a specialized, multi-nucleated cell responsible for bone resorption. It attaches to the bone surface, forms a sealing zone, and develops a ruffled border. It then secretes hydrochloric acid to dissolve bone minerals and enzymes like Cathepsin K to degrade the organic collagen matrix, creating a resorption pit known as Howship\'s Lacuna.";

    const quizQuestions = [
        {
            question: "What is the primary function of the ruffled border in an osteoclast?",
            options: [
                "To move the cell across the bone surface",
                "To increase surface area for secretion of acids and enzymes",
                "To absorb nutrients from the bloodstream",
                "To undergo cell division"
            ],
            correct: 1,
            explanation: "The ruffled border highly folds the cell membrane, vastly increasing the surface area for secreting hydrogen ions and enzymes into the resorption pit.",
            difficulty: "Medium"
        },
        {
            question: "Which of the following is secreted by osteoclasts to dissolve the mineral component of bone (hydroxyapatite)?",
            options: [
                "Calcium carbonate",
                "Alkaline phosphatase",
                "Hydrochloric acid (H+ and Cl-)",
                "Osteocalcin"
            ],
            correct: 2,
            explanation: "Osteoclasts pump hydrogen ions (H+) and chloride ions (Cl-) into the sealed space to form hydrochloric acid, which dissolves the inorganic minerals of bone.",
            difficulty: "Hard"
        },
        {
            question: "Why do osteoclasts have multiple nuclei?",
            options: [
                "They are formed by the fusion of multiple mononuclear precursor cells (macrophages)",
                "They need multiple nuclei to move faster",
                "They are constantly dividing",
                "It is a sign of cellular damage"
            ],
            correct: 0,
            explanation: "Osteoclasts are syncytia formed by the fusion of cells from the monocyte/macrophage lineage, resulting in a single large cell with many nuclei.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Animate ruffled border spinning/undulating
        if (ruffledMesh) {
            ruffledMesh.rotation.z = time * speed * 0.5;
            ruffledMesh.scale.setScalar(1 + Math.sin(time * speed * 2) * 0.05);
        }

        // Animate acid pit glowing/pulsing
        if (acidMesh) {
            const pulse = (Math.sin(time * speed * 3) + 1) / 2;
            acidMesh.material.opacity = 0.5 + pulse * 0.4;
            acidMesh.scale.x = 1 + pulse * 0.02;
            acidMesh.scale.z = 1 + pulse * 0.02;
        }

        // Animate cell membrane breathing
        if (cellMesh) {
            cellMesh.scale.y = 1 + Math.sin(time * speed) * 0.02;
            cellMesh.scale.x = 1 + Math.cos(time * speed * 0.8) * 0.02;
            cellMesh.scale.z = 1 + Math.cos(time * speed * 0.8) * 0.02;
        }

        // Animate secretory vesicles moving towards the ruffled border
        lysosomeMeshes.forEach((lys, index) => {
            const { mesh, baseHeight, phase } = lys;
            // Move down towards y=1, then reset
            let newY = baseHeight - (time * speed * 2 + phase) % (baseHeight - 1);
            mesh.position.y = newY;
            mesh.material.emissiveIntensity = 0.5 + (baseHeight - newY) * 0.5; 
        });

        // Floating nuclei
        nucleiMeshes.forEach((nuc, i) => {
            nuc.position.y = nucleiOffsets[i].y + Math.sin(time * speed * 1.5 + i) * 0.2;
        });
    }

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createOsteoclastResorption() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
