import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const goldPlated = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 1.0,
        roughness: 0.2,
        envMapIntensity: 1.0
    });

    const quantumCoreMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x0088ff,
        emissiveIntensity: 2,
        transparent: true,
        opacity: 0.8,
        transmission: 0.9,
        ior: 1.5,
        clearcoat: 1.0
    });

    const cryogenicMistMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.1,
        depthWrite: false
    });

    const neonPulseMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffcc,
        emissive: 0x00ffcc,
        emissiveIntensity: 1.5
    });

    const superconductorMaterial = new THREE.MeshStandardMaterial({
        color: 0x8888ff,
        metalness: 0.9,
        roughness: 0.1
    });

    // 1. Quantum Chandelier Base (Dilution Refrigerator Outer Shell)
    const shellGeometry = new THREE.CylinderGeometry(4, 4, 12, 32);
    const shellMesh = new THREE.Mesh(shellGeometry, darkSteel);
    shellMesh.position.set(0, 6, 0);
    // Make shell semi-transparent for visibility? No, let's keep it solid but maybe open it slightly or just be the base top.
    // Actually, usually the outer vacuum can is removed to see the chandelier. Let's make the outer can invisible or just build the chandelier.
    // Let's build the chandelier stages.

    // Base Plate (300K)
    const basePlateGeom = new THREE.CylinderGeometry(5, 5, 0.5, 32);
    const basePlateMesh = new THREE.Mesh(basePlateGeom, steel);
    basePlateMesh.position.set(0, 10, 0);
    group.add(basePlateMesh);
    parts.push({
        name: "300K Base Plate",
        description: "Room temperature mounting plate, interfacing with standard external computing hardware.",
        material: "steel",
        function: "Structural support and thermal isolation interface.",
        assemblyOrder: 1,
        connections: ["Thermal Isolators", "Input/Output Cabling"],
        failureEffect: "Structural collapse",
        cascadeFailures: ["Complete thermal breach"],
        originalPosition: {x: 0, y: 10, z: 0},
        explodedPosition: {x: 0, y: 15, z: 0}
    });

    // Thermal Isolators & Cooling Stages
    const stageYPositions = [8, 6, 4, 2];
    const stageRadii = [4.5, 4, 3.5, 3];
    const stageTemps = ["50K", "4K", "1K", "10mK"];
    
    stageYPositions.forEach((yPos, index) => {
        const stageGeom = new THREE.CylinderGeometry(stageRadii[index], stageRadii[index], 0.2, 32);
        const stageMesh = new THREE.Mesh(stageGeom, goldPlated);
        stageMesh.position.set(0, yPos, 0);
        group.add(stageMesh);

        // Support pillars between stages
        const pillarGeom = new THREE.CylinderGeometry(0.1, 0.1, 2, 8);
        for(let p = 0; p < 4; p++) {
            const pillar = new THREE.Mesh(pillarGeom, copper);
            const angle = (p / 4) * Math.PI * 2;
            pillar.position.set(
                Math.cos(angle) * (stageRadii[index] - 0.5),
                yPos + 1,
                Math.sin(angle) * (stageRadii[index] - 0.5)
            );
            group.add(pillar);
        }

        parts.push({
            name: `${stageTemps[index]} Cooling Stage`,
            description: `Thermal isolation plate operating at ${stageTemps[index]}.`,
            material: "goldPlated",
            function: "Progressive thermal step-down to protect the qubits.",
            assemblyOrder: 2 + index,
            connections: ["Support Pillars", "Thermal Straps"],
            failureEffect: "Thermal leakage",
            cascadeFailures: ["Qubit decoherence"],
            originalPosition: {x: 0, y: yPos, z: 0},
            explodedPosition: {x: 0, y: yPos + (4-index)*2, z: 0}
        });
    });

    // Cabling / Microwave lines
    const cableMeshes = [];
    const cableGeom = new THREE.TubeGeometry(new THREE.LineCurve3(new THREE.Vector3(0, 10, 0), new THREE.Vector3(0, 2, 0)), 20, 0.05, 8, false);
    for(let c = 0; c < 12; c++) {
        const cable = new THREE.Mesh(cableGeom, superconductorMaterial);
        const angle = (c / 12) * Math.PI * 2;
        cable.position.set(
            Math.cos(angle) * 1.5,
            0,
            Math.sin(angle) * 1.5
        );
        group.add(cable);
        cableMeshes.push(cable);
    }
    parts.push({
        name: "Superconducting Coaxial Cables",
        description: "Microwave lines delivering control pulses to the qubit array.",
        material: "superconductor",
        function: "High-fidelity signal transmission with minimal thermal noise.",
        assemblyOrder: 6,
        connections: ["Base Plate", "Qubit Array"],
        failureEffect: "Signal attenuation",
        cascadeFailures: ["Loss of control fidelity", "Gate errors"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: 5}
    });

    // Qubit Array (Bottom Stage)
    const arrayGroup = new THREE.Group();
    arrayGroup.position.set(0, 1, 0);
    
    const arrayHousingGeom = new THREE.BoxGeometry(2, 0.5, 2);
    const arrayHousing = new THREE.Mesh(arrayHousingGeom, darkSteel);
    arrayGroup.add(arrayHousing);

    const qubitMeshes = [];
    for(let qx = -0.6; qx <= 0.6; qx += 0.4) {
        for(let qz = -0.6; qz <= 0.6; qz += 0.4) {
            const qubitGeom = new THREE.OctahedronGeometry(0.15);
            const qubit = new THREE.Mesh(qubitGeom, quantumCoreMaterial);
            qubit.position.set(qx, 0.4, qz);
            arrayGroup.add(qubit);
            qubitMeshes.push(qubit);
        }
    }
    
    group.add(arrayGroup);
    parts.push({
        name: "Cryogenic Qubit Array",
        description: "The processing core containing 16 highly-coherent superconducting qubits.",
        material: "quantumCore",
        function: "Executes quantum logic gates and maintains entangled states.",
        assemblyOrder: 7,
        connections: ["10mK Cooling Stage", "Coaxial Cables"],
        failureEffect: "Total computation failure",
        cascadeFailures: ["Quantum state collapse"],
        originalPosition: {x: 0, y: 1, z: 0},
        explodedPosition: {x: 0, y: -2, z: 0}
    });

    // Neon Halo (AI Core Interface)
    const haloGeom = new THREE.TorusGeometry(3, 0.1, 16, 64);
    const halo = new THREE.Mesh(haloGeom, neonPulseMaterial);
    halo.position.set(0, 5, 0);
    halo.rotation.x = Math.PI / 2;
    group.add(halo);
    parts.push({
        name: "AI Interface Ring",
        description: "Optical data bridge between the classical AI subsystem and quantum core.",
        material: "neonPulse",
        function: "Real-time error correction and quantum algorithm compilation.",
        assemblyOrder: 8,
        connections: ["Classical Network", "Base Plate"],
        failureEffect: "Data bottleneck",
        cascadeFailures: ["Error correction failure"],
        originalPosition: {x: 0, y: 5, z: 0},
        explodedPosition: {x: 0, y: 5, z: -5}
    });

    const description = "The AI Quantum Processor represents the pinnacle of hybrid computing. " +
    "A classical AI neural network compiles and optimizes quantum circuits in real-time, executing them on a " +
    "cryogenic superconducting qubit array suspended in a dilution refrigerator chandelier structure. " +
    "This machine operates at near absolute zero to maintain delicate quantum coherence.";

    const quizQuestions = [
        {
            question: "Why must the quantum array be kept at cryogenic temperatures (e.g., 10mK)?",
            options: [
                "To prevent the processor from melting under heavy load",
                "To minimize thermal noise that causes qubit decoherence",
                "To increase the resistance of the cables",
                "To slow down the speed of light for easier measurement"
            ],
            correct: 1,
            explanation: "Thermal noise can excite qubits out of their ground state, destroying the delicate quantum states (decoherence). Ultra-low temperatures are required to preserve coherence.",
            difficulty: "Medium"
        },
        {
            question: "What is the primary function of the gold-plated cooling stages?",
            options: [
                "Aesthetic appeal for investors",
                "Progressive thermal step-down and isolation",
                "Electrical grounding",
                "Microwave shielding"
            ],
            correct: 1,
            explanation: "The stages progressively lower the temperature from 300K (room temp) down to 10mK, providing thermal isolation at each step.",
            difficulty: "Easy"
        },
        {
            question: "In this hybrid architecture, what is the classical AI primarily used for?",
            options: [
                "Cooling the refrigerator",
                "Generating the power supply",
                "Real-time error correction and circuit optimization",
                "Storing the final quantum results on a hard drive"
            ],
            correct: 2,
            explanation: "The classical AI handles real-time error correction and optimizes the compilation of quantum circuits before sending them to the qubit array.",
            difficulty: "Medium"
        }
    ];

    const animate = (time, speed, meshes) => {
        // Rotate the AI Interface Ring
        if (halo) {
            halo.rotation.z += 0.02 * speed;
            const pulse = (Math.sin(time * 0.003 * speed) + 1) / 2;
            neonPulseMaterial.emissiveIntensity = 0.5 + pulse * 2.0;
        }

        // Bobbing and rotating qubits
        qubitMeshes.forEach((q, i) => {
            q.rotation.x += 0.01 * speed * (i % 2 === 0 ? 1 : -1);
            q.rotation.y += 0.02 * speed;
            q.position.y = 0.4 + Math.sin(time * 0.002 * speed + i) * 0.05;
            
            // Pulse the emission
            quantumCoreMaterial.emissiveIntensity = 1.0 + Math.sin(time * 0.005 * speed) * 1.5;
        });
    };

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createQuantumProcessor() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
