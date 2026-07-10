import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Glowing Materials
    const hologramBlue = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.6,
        roughness: 0.1,
        transmission: 0.9,
        thickness: 0.5
    });

    const hologramPurple = new THREE.MeshPhysicalMaterial({
        color: 0x8a2be2,
        emissive: 0x8a2be2,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.7,
        roughness: 0.2
    });
    
    const coreEnergyMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.9,
    });

    const goldenCircuits = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 1.0,
        roughness: 0.2
    });

    // 1. Central Processor Node (The Core)
    const coreGeo = new THREE.IcosahedronGeometry(2, 2);
    const coreMesh = new THREE.Mesh(coreGeo, coreEnergyMaterial);
    group.add(coreMesh);
    parts.push({
        name: "Central Quantum Processor",
        description: "The primary computational matrix where multi-dimensional algorithms are processed.",
        material: "Core Energy",
        function: "Executes trillions of operations per nanosecond using quantum superposition.",
        assemblyOrder: 1,
        connections: ["Holographic Projection Rings", "Data Intake Conduits"],
        failureEffect: "Total system shutdown. Complete loss of logical coherence.",
        cascadeFailures: ["Holographic Projection Rings", "Thermal Regulators"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 },
        mesh: coreMesh
    });

    // 2. Inner Holographic Ring
    const innerRingGeo = new THREE.TorusGeometry(3.5, 0.2, 16, 100);
    const innerRingMesh = new THREE.Mesh(innerRingGeo, hologramBlue);
    group.add(innerRingMesh);
    parts.push({
        name: "Inner Data Matrix Ring",
        description: "High-speed data bus transmitting instantaneous calculations.",
        material: "Hologram Blue",
        function: "Channels quantum data streams to the projection matrices.",
        assemblyOrder: 2,
        connections: ["Central Quantum Processor", "Outer Holographic Ring"],
        failureEffect: "Data throughput drops by 80%. AI response times become sluggish.",
        cascadeFailures: ["Outer Holographic Ring"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 },
        mesh: innerRingMesh
    });

    // 3. Outer Holographic Ring
    const outerRingGeo = new THREE.TorusGeometry(5, 0.3, 16, 100);
    const outerRingMesh = new THREE.Mesh(outerRingGeo, hologramPurple);
    outerRingMesh.rotation.x = Math.PI / 2;
    group.add(outerRingMesh);
    parts.push({
        name: "Outer Neural Net Stabilizer",
        description: "Maintains the stability of the artificial neural pathways in 3D space.",
        material: "Hologram Purple",
        function: "Projects the AI's cognitive state into visual representations.",
        assemblyOrder: 3,
        connections: ["Inner Data Matrix Ring"],
        failureEffect: "Visual representation of the AI becomes distorted and chaotic.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 },
        mesh: outerRingMesh
    });

    // 4. Power Intake Conduits (Top and Bottom)
    const conduitGeo = new THREE.CylinderGeometry(0.5, 1.5, 4, 32);
    const topConduitMesh = new THREE.Mesh(conduitGeo, darkSteel);
    topConduitMesh.position.y = 4;
    group.add(topConduitMesh);
    parts.push({
        name: "Upper Antimatter Power Conduit",
        description: "Feeds raw antimatter energy into the central core.",
        material: "Dark Steel",
        function: "Regulates and filters the immense power required for quantum processing.",
        assemblyOrder: 4,
        connections: ["Central Quantum Processor"],
        failureEffect: "Core starvation, risking processor collapse.",
        cascadeFailures: ["Central Quantum Processor"],
        originalPosition: { x: 0, y: 4, z: 0 },
        explodedPosition: { x: 0, y: 10, z: 0 },
        mesh: topConduitMesh
    });

    const bottomConduitMesh = new THREE.Mesh(conduitGeo, darkSteel);
    bottomConduitMesh.position.y = -4;
    bottomConduitMesh.rotation.x = Math.PI;
    group.add(bottomConduitMesh);
    parts.push({
        name: "Lower Data Exhaust Conduit",
        description: "Vents excess computational heat and fragmented data packets.",
        material: "Dark Steel",
        function: "Prevents data overflow and thermal meltdown.",
        assemblyOrder: 5,
        connections: ["Central Quantum Processor"],
        failureEffect: "Thermal buildup leading to immediate core throttling.",
        cascadeFailures: ["Thermal Regulators"],
        originalPosition: { x: 0, y: -4, z: 0 },
        explodedPosition: { x: 0, y: -10, z: 0 },
        mesh: bottomConduitMesh
    });

    // 5. Memory Banks (Orbiting nodes)
    const memoryMeshes = [];
    for (let i = 0; i < 4; i++) {
        const memGeo = new THREE.BoxGeometry(1, 2, 1);
        const memMesh = new THREE.Mesh(memGeo, chrome);
        const angle = (i / 4) * Math.PI * 2;
        const radius = 7;
        memMesh.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
        group.add(memMesh);
        memoryMeshes.push(memMesh);
        
        parts.push({
            name: `Petabyte Memory Bank Alpha-${i+1}`,
            description: "High-density crystal memory storage for long-term AI learning.",
            material: "Chrome",
            function: "Stores vast amounts of experiential and factual data.",
            assemblyOrder: 6 + i,
            connections: ["Outer Holographic Ring"],
            failureEffect: "Memory fragmentation. The AI may forget recent events or skills.",
            cascadeFailures: [],
            originalPosition: { x: Math.cos(angle) * radius, y: 0, z: Math.sin(angle) * radius },
            explodedPosition: { x: Math.cos(angle) * radius * 2, y: 0, z: Math.sin(angle) * radius * 2 },
            mesh: memMesh
        });
    }

    // 6. Neural Network Connectors (Glowing lines between memory and core)
    const connectorGeo = new THREE.CylinderGeometry(0.05, 0.05, 7, 8);
    const connectors = new THREE.Group();
    for(let i=0; i<4; i++) {
        const connMesh = new THREE.Mesh(connectorGeo, goldenCircuits);
        const angle = (i / 4) * Math.PI * 2;
        connMesh.position.set(Math.cos(angle) * 3.5, 0, Math.sin(angle) * 3.5);
        connMesh.lookAt(0,0,0);
        connMesh.rotateX(Math.PI/2);
        connectors.add(connMesh);
    }
    group.add(connectors);
    parts.push({
        name: "Neural Pathways",
        description: "Physical connections facilitating data transfer between memory and processor.",
        material: "Golden Circuits",
        function: "Ensures low-latency data retrieval.",
        assemblyOrder: 10,
        connections: ["Central Quantum Processor", "Petabyte Memory Bank"],
        failureEffect: "Severe latency in AI reasoning.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 10 },
        mesh: connectors
    });


    const description = "The Artificial Intelligence Holographic Core is the central brain of a futuristic starship or planetary defense grid. It utilizes quantum superposition to perform calculations across multiple dimensions simultaneously. The visual representation of the core is not merely aesthetic; the glowing holographic rings act as a physical neural net, stabilizing the vast amounts of data processing required for true sentience. It requires massive power intakes and sophisticated cooling to prevent catastrophic meltdowns.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Inner Data Matrix Ring?",
            options: ["To store long-term memories", "To act as a high-speed data bus for instantaneous calculations", "To cool the central processor", "To provide physical defense against EMPs"],
            correct: 1,
            explanation: "The Inner Data Matrix Ring channels quantum data streams from the processor to the projection matrices, acting as a high-speed data bus.",
            difficulty: "Medium"
        },
        {
            question: "What happens if the Lower Data Exhaust Conduit fails?",
            options: ["The AI gains immediate self-awareness", "The hologram turns red", "Thermal buildup leads to immediate core throttling", "Memory banks become corrupted"],
            correct: 2,
            explanation: "The Lower Data Exhaust Conduit vents excess heat. Its failure causes thermal buildup, forcing the system to throttle the processor to prevent a meltdown.",
            difficulty: "Medium"
        },
        {
            question: "How does the AI process information so rapidly?",
            options: ["Using standard binary circuits", "Through chemical reactions", "Using quantum superposition in the Central Quantum Processor", "By outsourcing calculations to the cloud"],
            correct: 2,
            explanation: "The Central Quantum Processor executes operations using quantum superposition, allowing for calculations across multiple dimensions simultaneously.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Find meshes by part name or index
        const core = parts[0].mesh;
        const innerRing = parts[1].mesh;
        const outerRing = parts[2].mesh;
        
        // Spin the rings on different axes
        innerRing.rotation.y = time * 2.0 * speed;
        innerRing.rotation.x = Math.sin(time * 0.5) * 0.5;

        outerRing.rotation.z = -time * 1.5 * speed;
        outerRing.rotation.y = Math.cos(time * 0.3) * 0.5;

        // Core pulsing effect
        const scale = 1 + Math.sin(time * 5.0) * 0.05;
        core.scale.set(scale, scale, scale);
        
        // Make the core material color throb slightly
        if(core.material && core.material.color) {
             const hue = (time * 0.1) % 1;
             core.material.color.setHSL(hue, 1, 0.8);
        }

        // Bob memory banks
        memoryMeshes.forEach((mesh, index) => {
            mesh.position.y = Math.sin(time * 2.0 + index) * 0.5;
            mesh.rotation.y = time * speed;
            mesh.rotation.x = time * speed * 0.5;
        });
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createHolographicCore() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
