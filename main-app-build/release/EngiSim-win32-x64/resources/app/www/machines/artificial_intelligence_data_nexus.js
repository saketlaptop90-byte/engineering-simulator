import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing/neon materials
    const neonCyan = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.9,
    });

    const neonMagenta = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 1.5,
    });

    const dataStreamMat = new THREE.MeshStandardMaterial({
        color: 0x00ffcc,
        emissive: 0x00ffcc,
        emissiveIntensity: 3.0,
        transparent: true,
        opacity: 0.7,
        wireframe: true,
    });

    const coreCrystalMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        emissive: 0x0088ff,
        emissiveIntensity: 1.5,
        transmission: 0.9,
        opacity: 1,
        metalness: 0.2,
        roughness: 0.1,
        ior: 1.5,
        thickness: 0.5,
    });

    // 1. Central Core Sphere (Data Nexus)
    const coreGeom = new THREE.IcosahedronGeometry(2, 2);
    const coreMesh = new THREE.Mesh(coreGeom, coreCrystalMat);
    group.add(coreMesh);
    parts.push({
        name: "Quantum Data Core",
        description: "The central processing and routing hub where billions of neural pathways converge.",
        material: "Core Crystal",
        function: "Processes and routes petabytes of data simultaneously using quantum superposition.",
        assemblyOrder: 1,
        connections: ["Neural Ring Alpha", "Neural Ring Beta", "Data Streams"],
        failureEffect: "Total system collapse, data corruption, and routing failure.",
        cascadeFailures: ["All Neural Rings", "Data Streams", "Cooling System"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 },
        mesh: coreMesh
    });

    // 2. Neural Ring Alpha (Outer horizontal)
    const ringAlphaGeom = new THREE.TorusGeometry(3.5, 0.2, 16, 100);
    const ringAlphaMesh = new THREE.Mesh(ringAlphaGeom, chrome);
    ringAlphaMesh.rotation.x = Math.PI / 2;
    group.add(ringAlphaMesh);
    parts.push({
        name: "Neural Ring Alpha",
        description: "Primary distribution ring stabilizing the quantum core.",
        material: "Chrome",
        function: "Maintains magnetic containment and routes primary data streams.",
        assemblyOrder: 2,
        connections: ["Quantum Data Core", "Heat Sinks"],
        failureEffect: "Core destabilization and 50% data throughput loss.",
        cascadeFailures: ["Quantum Data Core"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 },
        mesh: ringAlphaMesh
    });

    // 3. Neural Ring Beta (Vertical)
    const ringBetaGeom = new THREE.TorusGeometry(4.5, 0.15, 16, 100);
    const ringBetaMesh = new THREE.Mesh(ringBetaGeom, neonCyan);
    group.add(ringBetaMesh);
    parts.push({
        name: "Neural Ring Beta",
        description: "Secondary high-speed data bus for auxiliary nodes.",
        material: "Neon Cyan",
        function: "Provides redundancy and secondary routing protocols.",
        assemblyOrder: 3,
        connections: ["Quantum Data Core"],
        failureEffect: "Loss of auxiliary nodes and reduced processing speed.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -8 },
        mesh: ringBetaMesh
    });

    // 4. Data Streams (Orbiting particles/shapes)
    const streamGroup = new THREE.Group();
    for (let i = 0; i < 8; i++) {
        const streamGeom = new THREE.BoxGeometry(0.3, 0.3, 1.5);
        const streamMesh = new THREE.Mesh(streamGeom, dataStreamMat);
        const angle = (i / 8) * Math.PI * 2;
        streamMesh.position.set(Math.cos(angle) * 2.5, Math.sin(angle) * 2.5, 0);
        streamMesh.lookAt(0, 0, 0);
        streamGroup.add(streamMesh);
    }
    group.add(streamGroup);
    parts.push({
        name: "Data Streams",
        description: "Physical manifestation of high-density information packets.",
        material: "Data Stream (Energy)",
        function: "Transmits raw data between the core and external networks.",
        assemblyOrder: 4,
        connections: ["Quantum Data Core", "External Nodes"],
        failureEffect: "Data packet loss and network latency.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 8, y: 0, z: 0 },
        mesh: streamGroup
    });

    // 5. Heat Sinks / Stabilizers
    for (let i = 0; i < 4; i++) {
        const sinkGeom = new THREE.CylinderGeometry(0.5, 0.5, 3, 16);
        const sinkMesh = new THREE.Mesh(sinkGeom, darkSteel);
        const angle = (i / 4) * Math.PI * 2;
        sinkMesh.position.set(Math.cos(angle) * 5, -2, Math.sin(angle) * 5);
        group.add(sinkMesh);
        parts.push({
            name: `Thermal Stabilizer ${i + 1}`,
            description: "Advanced heatsink drawing thermal energy from the core.",
            material: "Dark Steel",
            function: "Prevents quantum decoherence due to overheating.",
            assemblyOrder: 5 + i,
            connections: ["Neural Ring Alpha"],
            failureEffect: "Localized overheating.",
            cascadeFailures: ["Neural Ring Alpha", "Quantum Data Core"],
            originalPosition: { x: Math.cos(angle) * 5, y: -2, z: Math.sin(angle) * 5 },
            explodedPosition: { x: Math.cos(angle) * 10, y: -8, z: Math.sin(angle) * 10 },
            mesh: sinkMesh
        });
    }

    const description = "The AI Data Nexus is the central hub of an artificial intelligence network, routing petabytes of data through quantum pathways. It consists of a supercooled quantum core surrounded by magnetic containment rings and thermal stabilizers.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Thermal Stabilizers in the AI Data Nexus?",
            options: [
                "To generate power for the core",
                "To prevent quantum decoherence due to overheating",
                "To route data to external nodes",
                "To provide physical support for the rings"
            ],
            correct: 1,
            explanation: "Thermal Stabilizers draw heat away from the core, which is critical because overheating can cause quantum decoherence, leading to system failure.",
            difficulty: "Medium"
        },
        {
            question: "Which component is responsible for primary data stabilization and magnetic containment?",
            options: [
                "Neural Ring Alpha",
                "Data Streams",
                "Quantum Data Core",
                "Neural Ring Beta"
            ],
            correct: 0,
            explanation: "Neural Ring Alpha is the primary distribution ring that maintains magnetic containment and routes primary data streams.",
            difficulty: "Easy"
        },
        {
            question: "What happens if the Quantum Data Core fails?",
            options: [
                "Only the Data Streams fail",
                "The system switches to auxiliary power",
                "Total system collapse and data corruption",
                "The rings rotate faster to compensate"
            ],
            correct: 2,
            explanation: "The Quantum Data Core is the central hub; its failure leads to total system collapse, data corruption, and routing failure.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        const corePart = parts.find(p => p.name === "Quantum Data Core");
        const core = corePart ? corePart.mesh : null;
        
        const ringAlphaPart = parts.find(p => p.name === "Neural Ring Alpha");
        const ringAlpha = ringAlphaPart ? ringAlphaPart.mesh : null;
        
        const ringBetaPart = parts.find(p => p.name === "Neural Ring Beta");
        const ringBeta = ringBetaPart ? ringBetaPart.mesh : null;
        
        const streamsPart = parts.find(p => p.name === "Data Streams");
        const streams = streamsPart ? streamsPart.mesh : null;

        if (core) {
            core.rotation.y = time * 0.5 * speed;
            core.rotation.x = time * 0.2 * speed;
            if (core.material && core.material.emissiveIntensity !== undefined) {
                core.material.emissiveIntensity = 1.5 + Math.sin(time * speed * 2) * 0.5;
            }
        }

        if (ringAlpha) {
            ringAlpha.rotation.z = time * 0.3 * speed;
        }

        if (ringBeta) {
            ringBeta.rotation.y = time * 0.4 * speed;
            ringBeta.rotation.x = time * 0.1 * speed;
        }

        if (streams) {
            streams.rotation.z = -time * 1.5 * speed;
            streams.children.forEach((child, index) => {
                child.position.z = Math.sin(time * speed * 5 + index) * 0.5;
            });
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createDataNexus() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
