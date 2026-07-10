import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing/neon materials
    const hologramGlow = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 2,
        transparent: true,
        opacity: 0.7,
        roughness: 0.1,
        metalness: 0.8
    });

    const dataStreamGlow = new THREE.MeshPhysicalMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8
    });
    
    const coolingGlow = new THREE.MeshPhysicalMaterial({
        color: 0x0033ff,
        emissive: 0x0033ff,
        emissiveIntensity: 1,
        transparent: true,
        opacity: 0.9
    });

    // 1. Central Quantum Core
    const coreGeo = new THREE.CylinderGeometry(1, 1, 3, 32);
    const coreMesh = new THREE.Mesh(coreGeo, darkSteel);
    group.add(coreMesh);
    parts.push({
        name: "Quantum Processing Core",
        description: "The main processing unit that computes infinite folding possibilities simultaneously.",
        material: "darkSteel",
        function: "Calculates molecular dynamics at sub-atomic resolution.",
        assemblyOrder: 1,
        connections: ["Cryogenic Cooling Loop", "Genomic Data Bank Alpha", "Genomic Data Bank Beta", "Holographic Projection Matrix"],
        failureEffect: "Protein folding computations freeze, molecular simulations become unstable.",
        cascadeFailures: ["Holographic Projection Matrix", "Protein Hologram"],
        originalPosition: {x: 0, y: 1.5, z: 0},
        explodedPosition: {x: 0, y: 3, z: 0},
        mesh: coreMesh
    });

    // 2. Liquid Cooling System
    const coolingGeo = new THREE.TorusGeometry(1.5, 0.2, 16, 100);
    const coolingMesh = new THREE.Mesh(coolingGeo, coolingGlow);
    coolingMesh.position.y = 1.5;
    coolingMesh.rotation.x = Math.PI / 2;
    group.add(coolingMesh);
    parts.push({
        name: "Cryogenic Cooling Loop",
        description: "Circulates super-cooled liquid helium to prevent core meltdown.",
        material: "coolingGlow",
        function: "Maintains absolute zero temperatures for quantum coherence.",
        assemblyOrder: 2,
        connections: ["Quantum Processing Core"],
        failureEffect: "Core overheats instantly, initiating emergency shutdown.",
        cascadeFailures: ["Quantum Processing Core"],
        originalPosition: {x: 0, y: 1.5, z: 0},
        explodedPosition: {x: 0, y: -2, z: 0},
        mesh: coolingMesh
    });

    // 3. Server Racks (Data Banks)
    const rackGeo = new THREE.BoxGeometry(1.5, 4, 1);
    const rack1 = new THREE.Mesh(rackGeo, steel);
    rack1.position.set(-3, 2, 0);
    group.add(rack1);
    
    const lightsGeo = new THREE.PlaneGeometry(1.3, 3.8);
    const lightsMesh1 = new THREE.Mesh(lightsGeo, dataStreamGlow);
    lightsMesh1.position.set(0, 0, 0.51);
    rack1.add(lightsMesh1);

    parts.push({
        name: "Genomic Data Bank Alpha",
        description: "Stores petabytes of sequenced genomic data.",
        material: "steel",
        function: "Provides the sequence data necessary for folding algorithms.",
        assemblyOrder: 3,
        connections: ["Quantum Processing Core"],
        failureEffect: "Input data streams are interrupted, causing folding errors.",
        cascadeFailures: [],
        originalPosition: {x: -3, y: 2, z: 0},
        explodedPosition: {x: -6, y: 2, z: 0},
        mesh: rack1
    });

    const rack2 = new THREE.Mesh(rackGeo, steel);
    rack2.position.set(3, 2, 0);
    group.add(rack2);
    
    const lightsMesh2 = new THREE.Mesh(lightsGeo, dataStreamGlow);
    lightsMesh2.position.set(0, 0, 0.51);
    rack2.add(lightsMesh2);

    parts.push({
        name: "Genomic Data Bank Beta",
        description: "Mirrors Bank Alpha and handles secondary computation offloading.",
        material: "steel",
        function: "Provides redundancy and extra bandwidth for sequence data.",
        assemblyOrder: 4,
        connections: ["Quantum Processing Core"],
        failureEffect: "Decreased processing speed, no cascade failure.",
        cascadeFailures: [],
        originalPosition: {x: 3, y: 2, z: 0},
        explodedPosition: {x: 6, y: 2, z: 0},
        mesh: rack2
    });

    // 4. Holographic Projector Base
    const projBaseGeo = new THREE.CylinderGeometry(1.5, 2, 0.5, 32);
    const projBase = new THREE.Mesh(projBaseGeo, chrome);
    projBase.position.set(0, 3.25, 0);
    group.add(projBase);
    parts.push({
        name: "Holographic Projection Matrix",
        description: "Projects the real-time 3D folding sequence.",
        material: "chrome",
        function: "Visualizes the molecular dynamics for researcher observation.",
        assemblyOrder: 5,
        connections: ["Quantum Processing Core"],
        failureEffect: "Visualization goes dark, but computations continue blindly.",
        cascadeFailures: ["Protein Hologram"],
        originalPosition: {x: 0, y: 3.25, z: 0},
        explodedPosition: {x: 0, y: 6, z: 0},
        mesh: projBase
    });

    // 5. Protein Hologram (Dynamic)
    const proteinGeo = new THREE.TorusKnotGeometry(0.8, 0.2, 100, 16);
    const proteinMesh = new THREE.Mesh(proteinGeo, hologramGlow);
    proteinMesh.position.set(0, 5, 0);
    group.add(proteinMesh);
    parts.push({
        name: "Protein Hologram",
        description: "The visualized output of the folding process.",
        material: "hologramGlow",
        function: "Displays the structural conformation of the target protein.",
        assemblyOrder: 6,
        connections: ["Holographic Projection Matrix"],
        failureEffect: "Visual artifacting, resolution drops.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 5, z: 0},
        explodedPosition: {x: 0, y: 8, z: 0},
        mesh: proteinMesh
    });

    const description = "The Bioinformatics Protein Folding Supercomputer leverages quantum processing to simulate molecular dynamics. It accurately predicts 3D protein structures from amino acid sequences, aiding in drug discovery and understanding genetic diseases. Key components include the cryogenic cooling loop to maintain quantum states, and a massive holographic matrix for real-time observation of the folding process.";

    const quizQuestions = [
        {
            question: "Why is a cryogenic cooling loop essential in this folding supercomputer?",
            options: [
                "To freeze the proteins in place for observation.",
                "To maintain absolute zero temperatures required for quantum coherence in the core.",
                "To cool down the holographic projector.",
                "To speed up the network connection to the data banks."
            ],
            correct: 1,
            explanation: "Quantum processors operate efficiently only at extremely low temperatures, often near absolute zero, to maintain quantum coherence and minimize environmental noise.",
            difficulty: "Medium"
        },
        {
            question: "What is the primary function of the Genomic Data Banks?",
            options: [
                "Storing petabytes of sequenced genomic data to feed the folding algorithms.",
                "Projecting the 3D hologram.",
                "Cooling the system.",
                "Generating electrical power for the supercomputer."
            ],
            correct: 0,
            explanation: "The data banks hold the immense amount of raw amino acid sequence data and genomic information necessary to compute possible folding pathways.",
            difficulty: "Easy"
        },
        {
            question: "In the context of protein folding simulations, what does the holographic projection visualize?",
            options: [
                "The binary code of the algorithm.",
                "The physical hardware of the supercomputer.",
                "The real-time structural conformation of the target protein.",
                "The network traffic between data centers."
            ],
            correct: 2,
            explanation: "The hologram visualizes the dynamic, 3D structure of the protein as it folds, allowing researchers to observe molecular interactions and final conformations.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Animate the protein hologram folding/rotating
        if (meshes['Protein Hologram']) {
            meshes['Protein Hologram'].rotation.x = time * speed * 0.5;
            meshes['Protein Hologram'].rotation.y = time * speed * 0.7;
            // Pulsate the hologram
            meshes['Protein Hologram'].scale.setScalar(1 + Math.sin(time * speed * 2) * 0.05);
        }

        // Rotate the cooling loop
        if (meshes['Cryogenic Cooling Loop']) {
            meshes['Cryogenic Cooling Loop'].rotation.z = time * speed;
        }

        // Pulse the server rack lights
        if (meshes['Genomic Data Bank Alpha'] && meshes['Genomic Data Bank Alpha'].children[0]) {
            meshes['Genomic Data Bank Alpha'].children[0].material.opacity = 0.5 + Math.abs(Math.sin(time * speed * 5)) * 0.5;
        }
        if (meshes['Genomic Data Bank Beta'] && meshes['Genomic Data Bank Beta'].children[0]) {
            meshes['Genomic Data Bank Beta'].children[0].material.opacity = 0.5 + Math.abs(Math.cos(time * speed * 5)) * 0.5;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createProteinFolder() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
