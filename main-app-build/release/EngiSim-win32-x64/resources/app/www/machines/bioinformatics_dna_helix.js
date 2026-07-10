import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials for DNA components
    const glowMaterialRed = new THREE.MeshPhysicalMaterial({ color: 0xff3333, emissive: 0xff0000, emissiveIntensity: 2, transparent: true, opacity: 0.9, roughness: 0.1, metalness: 0.8 });
    const glowMaterialBlue = new THREE.MeshPhysicalMaterial({ color: 0x3333ff, emissive: 0x0000ff, emissiveIntensity: 2, transparent: true, opacity: 0.9, roughness: 0.1, metalness: 0.8 });
    const glowMaterialGreen = new THREE.MeshPhysicalMaterial({ color: 0x33ff33, emissive: 0x00ff00, emissiveIntensity: 2, transparent: true, opacity: 0.9, roughness: 0.1, metalness: 0.8 });
    const glowMaterialYellow = new THREE.MeshPhysicalMaterial({ color: 0xffff33, emissive: 0xffff00, emissiveIntensity: 2, transparent: true, opacity: 0.9, roughness: 0.1, metalness: 0.8 });
    const backboneMaterial1 = new THREE.MeshPhysicalMaterial({ color: 0xaaaaaa, emissive: 0x444444, roughness: 0.3, metalness: 0.9, clearcoat: 1.0 });
    const backboneMaterial2 = new THREE.MeshPhysicalMaterial({ color: 0xcccccc, emissive: 0x222222, roughness: 0.4, metalness: 0.7, clearcoat: 1.0 });

    const numPairs = 20;
    const radius = 2.5;
    const heightStep = 0.8;
    const angleStep = Math.PI / 6;

    const meshes = {};

    // Base pair types: A-T (Adenine - Thymine), C-G (Cytosine - Guanine)
    const basePairs = [
        { type: 'A-T', color1: glowMaterialRed, color2: glowMaterialGreen },
        { type: 'C-G', color1: glowMaterialBlue, color2: glowMaterialYellow },
        { type: 'T-A', color1: glowMaterialGreen, color2: glowMaterialRed },
        { type: 'G-C', color1: glowMaterialYellow, color2: glowMaterialBlue }
    ];

    const backboneGeometry = new THREE.CylinderGeometry(0.3, 0.3, heightStep, 16);
    const connectorGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const baseGeometry = new THREE.CylinderGeometry(0.2, 0.2, radius, 16);
    baseGeometry.rotateZ(Math.PI / 2); // Lay flat for base pair connections

    for (let i = 0; i < numPairs; i++) {
        const y = (i - numPairs / 2) * heightStep;
        const angle = i * angleStep;

        const bpType = basePairs[i % 4];

        // Backbone 1
        const bb1Mesh = new THREE.Mesh(backboneGeometry, backboneMaterial1);
        bb1Mesh.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
        // orient along the spiral somewhat roughly
        bb1Mesh.lookAt(Math.cos(angle + angleStep) * radius, y + heightStep, Math.sin(angle + angleStep) * radius);
        bb1Mesh.rotateX(Math.PI/2);
        
        const b1Connector = new THREE.Mesh(connectorGeometry, chrome);
        b1Connector.position.copy(bb1Mesh.position);

        const partIdBB1 = `backbone_1_${i}`;
        group.add(bb1Mesh);
        group.add(b1Connector);
        meshes[partIdBB1] = bb1Mesh;

        parts.push({
            name: `Sugar-Phosphate Backbone Strand 1 Segment ${i}`,
            description: "Forms the structural framework of nucleic acids.",
            material: 'Chrome/Metal',
            function: "Provides structural support for the DNA double helix.",
            assemblyOrder: i * 3,
            connections: [i > 0 ? `backbone_1_${i-1}` : null, `base_pair_${i}`].filter(Boolean),
            failureEffect: "Strand break, potentially leading to mutations or cell death.",
            cascadeFailures: ["Replication stall"],
            originalPosition: { x: bb1Mesh.position.x, y: bb1Mesh.position.y, z: bb1Mesh.position.z },
            explodedPosition: { x: bb1Mesh.position.x * 2.5, y: bb1Mesh.position.y, z: bb1Mesh.position.z * 2.5 }
        });

        // Backbone 2
        const bb2Mesh = new THREE.Mesh(backboneGeometry, backboneMaterial2);
        bb2Mesh.position.set(Math.cos(angle + Math.PI) * radius, y, Math.sin(angle + Math.PI) * radius);
        bb2Mesh.lookAt(Math.cos(angle + Math.PI + angleStep) * radius, y + heightStep, Math.sin(angle + Math.PI + angleStep) * radius);
        bb2Mesh.rotateX(Math.PI/2);

        const b2Connector = new THREE.Mesh(connectorGeometry, chrome);
        b2Connector.position.copy(bb2Mesh.position);

        const partIdBB2 = `backbone_2_${i}`;
        group.add(bb2Mesh);
        group.add(b2Connector);
        meshes[partIdBB2] = bb2Mesh;

        parts.push({
            name: `Sugar-Phosphate Backbone Strand 2 Segment ${i}`,
            description: "The anti-parallel structural framework.",
            material: 'Dark Steel/Metal',
            function: "Provides structural support for the anti-parallel strand.",
            assemblyOrder: i * 3 + 1,
            connections: [i > 0 ? `backbone_2_${i-1}` : null, `base_pair_${i}`].filter(Boolean),
            failureEffect: "Strand break, potentially leading to mutations.",
            cascadeFailures: ["Replication stall"],
            originalPosition: { x: bb2Mesh.position.x, y: bb2Mesh.position.y, z: bb2Mesh.position.z },
            explodedPosition: { x: bb2Mesh.position.x * 2.5, y: bb2Mesh.position.y, z: bb2Mesh.position.z * 2.5 }
        });

        // Base Pairs (Half 1 and Half 2)
        const baseGroup = new THREE.Group();
        baseGroup.position.set(0, y, 0);
        baseGroup.rotation.y = -angle;

        const base1 = new THREE.Mesh(baseGeometry, bpType.color1);
        base1.position.set(radius / 2, 0, 0); // half width

        const base2 = new THREE.Mesh(baseGeometry, bpType.color2);
        base2.position.set(-radius / 2, 0, 0);

        baseGroup.add(base1);
        baseGroup.add(base2);
        group.add(baseGroup);

        const partIdBP = `base_pair_${i}`;
        meshes[partIdBP] = baseGroup;

        parts.push({
            name: `Base Pair ${bpType.type} ${i}`,
            description: `Nucleotide pair: ${bpType.type} bound by hydrogen bonds.`,
            material: 'Neon/Glowing Polymer',
            function: "Stores genetic information.",
            assemblyOrder: i * 3 + 2,
            connections: [partIdBB1, partIdBB2],
            failureEffect: "Point mutation if incorrectly paired.",
            cascadeFailures: ["Incorrect protein synthesis"],
            originalPosition: { x: baseGroup.position.x, y: baseGroup.position.y, z: baseGroup.position.z },
            explodedPosition: { x: baseGroup.position.x, y: baseGroup.position.y, z: baseGroup.position.z * 1.5 }
        });
    }


    const description = "The DNA Double Helix represents the molecular basis of heredity. This simulation models its sugar-phosphate backbone and complementary base pairing, exploring structural mechanics, unzipping during replication, and potential mutation modes.";

    const quizQuestions = [
        {
            question: "Which type of bond holds the two anti-parallel strands of the DNA double helix together across the base pairs?",
            options: ["Covalent bonds", "Ionic bonds", "Hydrogen bonds", "Metallic bonds"],
            correct: 2,
            explanation: "Hydrogen bonds occur between the complementary nitrogenous bases (A-T and C-G), providing enough strength to hold the helix together but allowing it to unzip for replication.",
            difficulty: "Medium"
        },
        {
            question: "In the context of the DNA backbone, what components make up the structural framework?",
            options: ["Deoxyribose sugars and phosphate groups", "Ribose sugars and nitrogenous bases", "Amino acids and peptide bonds", "Lipids and cholesterol"],
            correct: 0,
            explanation: "The backbone of the DNA strand is made from alternating phosphate and sugar (deoxyribose) residues.",
            difficulty: "Easy"
        },
        {
            question: "During DNA replication, the double helix must be 'unzipped'. Which enzyme is primarily responsible for this mechanical action?",
            options: ["DNA Polymerase", "Helicase", "Ligase", "Primase"],
            correct: 1,
            explanation: "Helicases are motor proteins that move directionally along a nucleic acid phosphodiester backbone, separating two annealed nucleic acid strands.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, animatedMeshes = meshes) {
        // Complex animation: twisting the entire group and slightly expanding the radius
        group.rotation.y = time * speed * 0.5;

        // Simulate local thermal vibrations or 'breathing' of the DNA
        Object.keys(animatedMeshes).forEach(key => {
            if (key.startsWith('base_pair')) {
                const mesh = animatedMeshes[key];
                // slight pulsing or twisting of the base pairs
                mesh.rotation.x = Math.sin(time * speed * 5 + mesh.position.y) * 0.05;
            }
        });
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createDNAHelix() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
