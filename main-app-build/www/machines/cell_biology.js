import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom Materials
    const membraneMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x44aaff,
        transparent: true,
        opacity: 0.15,
        roughness: 0.1,
        transmission: 0.9,
        thickness: 0.5,
        emissive: 0x002244,
        emissiveIntensity: 0.2
    });

    const nucleusMaterial = new THREE.MeshStandardMaterial({
        color: 0x8a2be2,
        roughness: 0.3,
        metalness: 0.1,
        emissive: 0x4b0082,
        emissiveIntensity: 0.5
    });

    const nucleolusMaterial = new THREE.MeshStandardMaterial({
        color: 0xff1493,
        emissive: 0xff1493,
        emissiveIntensity: 0.8
    });

    const mitochondriaMaterial = new THREE.MeshStandardMaterial({
        color: 0xff4500,
        emissive: 0xff4500,
        emissiveIntensity: 0.6
    });

    const erMaterial = new THREE.MeshStandardMaterial({
        color: 0x20b2aa,
        emissive: 0x20b2aa,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.8
    });

    const golgiMaterial = new THREE.MeshStandardMaterial({
        color: 0x9370db,
        emissive: 0x9370db,
        emissiveIntensity: 0.4
    });
    
    const lysosomeMaterial = new THREE.MeshStandardMaterial({
        color: 0x32cd32,
        emissive: 0x32cd32,
        emissiveIntensity: 0.5
    });

    // 1. Cell Membrane
    const membraneGeom = new THREE.SphereGeometry(10, 64, 64);
    const membraneMesh = new THREE.Mesh(membraneGeom, membraneMaterial);
    group.add(membraneMesh);
    meshes.membrane = membraneMesh;
    parts.push({
        name: "Cell Membrane",
        description: "The semipermeable membrane surrounding the cytoplasm of a cell.",
        material: "Translucent Lipid Bilayer",
        function: "Regulates what enters and exits the cell, providing protection and structural support.",
        assemblyOrder: 10,
        connections: ["Cytoplasm"],
        failureEffect: "Cell lysis or unregulated influx of toxins.",
        cascadeFailures: ["Entire cell death"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });

    // 2. Nucleus
    const nucleusGeom = new THREE.SphereGeometry(3, 32, 32);
    const nucleusMesh = new THREE.Mesh(nucleusGeom, nucleusMaterial);
    nucleusMesh.position.set(0, 0, 0);
    group.add(nucleusMesh);
    meshes.nucleus = nucleusMesh;
    parts.push({
        name: "Nucleus",
        description: "The control center of the cell containing genetic material.",
        material: "Nuclear Envelope",
        function: "Stores DNA and coordinates cell activities like growth and reproduction.",
        assemblyOrder: 1,
        connections: ["Endoplasmic Reticulum"],
        failureEffect: "Loss of genetic regulation.",
        cascadeFailures: ["Protein synthesis failure", "Cell division halt"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 0 }
    });

    // 3. Nucleolus
    const nucleolusGeom = new THREE.SphereGeometry(1, 16, 16);
    const nucleolusMesh = new THREE.Mesh(nucleolusGeom, nucleolusMaterial);
    nucleolusMesh.position.set(0.5, 0.5, 0.5);
    nucleusMesh.add(nucleolusMesh);
    meshes.nucleolus = nucleolusMesh;
    parts.push({
        name: "Nucleolus",
        description: "A dense structure inside the nucleus.",
        material: "RNA and Proteins",
        function: "Synthesizes ribosomal RNA (rRNA) and assembles ribosomes.",
        assemblyOrder: 2,
        connections: ["Nucleus"],
        failureEffect: "Inability to produce ribosomes.",
        cascadeFailures: ["Protein synthesis failure"],
        originalPosition: { x: 0.5, y: 0.5, z: 0.5 },
        explodedPosition: { x: 0, y: 20, z: 0 }
    });

    // 4. Mitochondria
    meshes.mitochondria = [];
    const mitoGeom = new THREE.CapsuleGeometry(0.8, 1.5, 16, 16);
    const mitoPositions = [
        { x: 4, y: 2, z: -3, rot: [0.5, 0.2, 0] },
        { x: -5, y: -1, z: 2, rot: [0, 0.8, 0.5] },
        { x: 2, y: -4, z: 4, rot: [1.2, 0, 0.3] },
        { x: -3, y: 4, z: 0, rot: [0.2, 1.5, 0] }
    ];
    
    mitoPositions.forEach((pos, idx) => {
        const mitoMesh = new THREE.Mesh(mitoGeom, mitochondriaMaterial);
        mitoMesh.position.set(pos.x, pos.y, pos.z);
        mitoMesh.rotation.set(pos.rot[0], pos.rot[1], pos.rot[2]);
        group.add(mitoMesh);
        meshes.mitochondria.push(mitoMesh);
        if (idx === 0) {
            parts.push({
                name: "Mitochondria",
                description: "The powerhouse of the cell.",
                material: "Double Membrane",
                function: "Generates most of the chemical energy needed to power the cell's biochemical reactions (ATP).",
                assemblyOrder: 3,
                connections: ["Cytoplasm"],
                failureEffect: "Energy depletion.",
                cascadeFailures: ["Metabolic collapse", "Cell death"],
                originalPosition: { x: pos.x, y: pos.y, z: pos.z },
                explodedPosition: { x: pos.x * 3, y: pos.y * 3, z: pos.z * 3 }
            });
        }
    });

    // 5. Endoplasmic Reticulum (Rough/Smooth)
    const erGeom = new THREE.TorusGeometry(4.5, 0.5, 16, 64);
    const erGroup = new THREE.Group();
    for(let i=0; i<3; i++) {
        const erRing = new THREE.Mesh(erGeom, erMaterial);
        erRing.rotation.x = Math.PI/2 + (i * 0.2);
        erRing.rotation.y = i * 0.5;
        erRing.scale.set(1 + i*0.1, 1 + i*0.1, 1);
        erGroup.add(erRing);
    }
    group.add(erGroup);
    meshes.er = erGroup;
    parts.push({
        name: "Endoplasmic Reticulum",
        description: "A network of membranous tubules and sacs.",
        material: "Lipid Membrane",
        function: "Synthesizes, folds, modifies, and transports proteins (Rough ER) and lipids (Smooth ER).",
        assemblyOrder: 4,
        connections: ["Nucleus", "Golgi Apparatus"],
        failureEffect: "Misfolded proteins and lipid shortage.",
        cascadeFailures: ["Cellular stress", "Apoptosis"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -15, y: 0, z: 0 }
    });

    // 6. Golgi Apparatus
    const golgiGeom = new THREE.CylinderGeometry(2, 2, 0.2, 32);
    const golgiGroup = new THREE.Group();
    for(let i=0; i<4; i++) {
        const golgiSaccule = new THREE.Mesh(golgiGeom, golgiMaterial);
        golgiSaccule.position.y = i * 0.4;
        golgiSaccule.scale.set(1 - i*0.1, 1, 1 - i*0.1);
        golgiGroup.add(golgiSaccule);
    }
    golgiGroup.position.set(5, 0, 5);
    golgiGroup.rotation.x = 0.5;
    group.add(golgiGroup);
    meshes.golgi = golgiGroup;
    parts.push({
        name: "Golgi Apparatus",
        description: "A stack of small flat sacs formed by membranes inside the cell's cytoplasm.",
        material: "Membrane Sacs",
        function: "Modifies, sorts, and packages proteins and lipids for delivery to targeted destinations.",
        assemblyOrder: 5,
        connections: ["Endoplasmic Reticulum", "Vesicles"],
        failureEffect: "Proteins fail to reach their destinations.",
        cascadeFailures: ["Membrane degradation", "Enzyme deficiency"],
        originalPosition: { x: 5, y: 0, z: 5 },
        explodedPosition: { x: 15, y: 0, z: 15 }
    });

    // 7. Lysosomes
    meshes.lysosomes = [];
    const lysosomeGeom = new THREE.SphereGeometry(0.5, 16, 16);
    const lysoPositions = [
        { x: -6, y: 3, z: -2 },
        { x: 3, y: -5, z: -4 },
        { x: 1, y: 6, z: 2 }
    ];
    lysoPositions.forEach((pos, idx) => {
        const lysoMesh = new THREE.Mesh(lysosomeGeom, lysosomeMaterial);
        lysoMesh.position.set(pos.x, pos.y, pos.z);
        group.add(lysoMesh);
        meshes.lysosomes.push(lysoMesh);
        if (idx === 0) {
            parts.push({
                name: "Lysosomes",
                description: "Organelles containing digestive enzymes.",
                material: "Lipid Bilayer and Enzymes",
                function: "Breaks down excess or worn-out cell parts, destroying invading viruses and bacteria.",
                assemblyOrder: 6,
                connections: ["Golgi Apparatus"],
                failureEffect: "Accumulation of toxic cellular waste.",
                cascadeFailures: ["Cellular toxicity", "Lysosomal storage diseases"],
                originalPosition: { x: pos.x, y: pos.y, z: pos.z },
                explodedPosition: { x: pos.x * 2, y: pos.y * 2 + 10, z: pos.z * 2 }
            });
        }
    });

    const description = "An ultra high-tech, highly detailed representation of a Eukaryotic Cell. This interactive model highlights the complex anatomy and crucial organelles that function together to sustain cellular life, using state-of-the-art glowing neon visualizations to illustrate metabolic activity.";

    const quizQuestions = [
        {
            question: "Which organelle is primarily responsible for generating the chemical energy (ATP) needed by the cell?",
            options: ["Nucleus", "Mitochondria", "Golgi Apparatus", "Lysosome"],
            correct: 1,
            explanation: "Mitochondria are known as the powerhouses of the cell because they generate most of the cell's supply of ATP.",
            difficulty: "Easy"
        },
        {
            question: "What is the primary function of the Golgi Apparatus?",
            options: ["Synthesizing DNA", "Breaking down cellular waste", "Modifying, sorting, and packaging proteins", "Producing ribosomes"],
            correct: 2,
            explanation: "The Golgi Apparatus acts as a cellular post office, modifying, sorting, and packaging proteins and lipids for transport.",
            difficulty: "Medium"
        },
        {
            question: "Which organelle acts as the cell's waste disposal system by breaking down cellular debris and foreign particles?",
            options: ["Endoplasmic Reticulum", "Lysosome", "Nucleolus", "Cell Membrane"],
            correct: 1,
            explanation: "Lysosomes contain digestive enzymes that break down excess or worn-out cell parts and invading viruses/bacteria.",
            difficulty: "Medium"
        },
        {
            question: "Where are ribosomes primarily assembled within the cell?",
            options: ["Smooth Endoplasmic Reticulum", "Mitochondria", "Nucleolus", "Golgi Apparatus"],
            correct: 2,
            explanation: "The nucleolus, located within the nucleus, is the site of ribosomal RNA (rRNA) transcription and processing, and ribosome assembly.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshesObj) {
        // Subtle floating and rotation animations
        const t = time * speed;

        if (meshesObj.nucleus) {
            meshesObj.nucleus.rotation.y = t * 0.2;
        }

        if (meshesObj.membrane) {
            meshesObj.membrane.rotation.y = t * 0.05;
            meshesObj.membrane.rotation.x = t * 0.02;
            meshesObj.membrane.scale.setScalar(1 + Math.sin(t * 0.5) * 0.02);
        }

        if (meshesObj.er) {
            meshesObj.er.rotation.z = t * 0.1;
        }

        if (meshesObj.golgi) {
            meshesObj.golgi.position.y = Math.sin(t * 1.5) * 0.2;
            meshesObj.golgi.rotation.y = t * 0.3;
        }

        if (meshesObj.mitochondria) {
            meshesObj.mitochondria.forEach((mito, i) => {
                mito.rotation.x += 0.01 * speed;
                mito.rotation.y += 0.02 * speed;
                mito.position.y += Math.sin(t * 2 + i) * 0.01 * speed;
            });
        }

        if (meshesObj.lysosomes) {
            meshesObj.lysosomes.forEach((lyso, i) => {
                lyso.position.x += Math.sin(t + i) * 0.02 * speed;
                lyso.position.z += Math.cos(t + i) * 0.02 * speed;
            });
        }
    }

    return { group, parts, description, quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createCell() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
