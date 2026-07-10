import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const dataBusMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.8
    });

    const activeCpuMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        roughness: 0.1,
        metalness: 0.9
    });

    const memoryGlowingMaterial = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 0.4,
        roughness: 0.3,
        metalness: 0.7
    });

    // 1. Enclosure Base
    const baseGeo = new THREE.BoxGeometry(4, 0.5, 4);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    group.add(baseMesh);
    parts.push({
        name: "Main Chassis Base",
        description: "Ruggedized lower enclosure housing the backplane and power distribution rails.",
        material: "darkSteel",
        function: "Structural support, electromagnetic shielding, and thermal dissipation.",
        assemblyOrder: 1,
        connections: ["Backplane", "Power Supply", "Chassis Cover"],
        failureEffect: "Loss of physical integrity, exposure to EMI.",
        cascadeFailures: ["Signal corruption across all buses"],
        originalPosition: { x: 0, y: -0.25, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 },
        mesh: baseMesh
    });

    // 2. High-Speed Backplane
    const backplaneGeo = new THREE.BoxGeometry(3.6, 0.1, 3.6);
    const backplaneMesh = new THREE.Mesh(backplaneGeo, plastic); // Represents PCB
    backplaneMesh.position.set(0, 0.05, 0);
    group.add(backplaneMesh);
    parts.push({
        name: "VMEbus Backplane",
        description: "Multi-layer printed circuit board enabling high-speed communication between modules.",
        material: "plastic",
        function: "Routes data, address, and control signals between the CPU, memory, and I/O modules.",
        assemblyOrder: 2,
        connections: ["CPU Module", "Memory Module", "I/O Interface", "Chassis Base"],
        failureEffect: "Complete system halt; no communication between components.",
        cascadeFailures: ["CPU timeout", "Sensor data loss"],
        originalPosition: { x: 0, y: 0.05, z: 0 },
        explodedPosition: { x: 0, y: -1, z: 0 },
        mesh: backplaneMesh
    });

    // 3. CPU Module
    const cpuModuleGroup = new THREE.Group();
    cpuModuleGroup.position.set(-1, 0.6, 0);
    
    const cpuBoardGeo = new THREE.BoxGeometry(1.2, 1, 3);
    const cpuBoardMesh = new THREE.Mesh(cpuBoardGeo, aluminum); // Heatsink look
    cpuModuleGroup.add(cpuBoardMesh);

    const cpuChipGeo = new THREE.BoxGeometry(0.6, 0.2, 0.6);
    const cpuChipMesh = new THREE.Mesh(cpuChipGeo, activeCpuMaterial);
    cpuChipMesh.position.set(0, 0.6, 0);
    cpuModuleGroup.add(cpuChipMesh);

    group.add(cpuModuleGroup);
    parts.push({
        name: "Processing Unit (CPU)",
        description: "Triple-modular redundant microprocessor complex.",
        material: "aluminum / activeCpuMaterial",
        function: "Executes flight control laws, navigation algorithms, and system management.",
        assemblyOrder: 3,
        connections: ["Backplane", "Memory Module"],
        failureEffect: "Loss of computational ability.",
        cascadeFailures: ["Actuator freeze", "Navigation failure"],
        originalPosition: { x: -1, y: 0.6, z: 0 },
        explodedPosition: { x: -3, y: 1.5, z: 0 },
        mesh: cpuModuleGroup,
        chipMesh: cpuChipMesh // For animation
    });

    // 4. Memory Module
    const memoryModuleGroup = new THREE.Group();
    memoryModuleGroup.position.set(0.5, 0.6, 0);
    
    const memBoardGeo = new THREE.BoxGeometry(1, 1, 3);
    const memBoardMesh = new THREE.Mesh(memBoardGeo, plastic);
    memoryModuleGroup.add(memBoardMesh);

    // Add memory chips
    const chips = [];
    for(let i=0; i<4; i++) {
        const memChipGeo = new THREE.BoxGeometry(0.8, 0.1, 0.4);
        const memChipMesh = new THREE.Mesh(memChipGeo, memoryGlowingMaterial);
        memChipMesh.position.set(0, 0.55, -1 + i*0.66);
        memoryModuleGroup.add(memChipMesh);
        chips.push(memChipMesh);
    }

    group.add(memoryModuleGroup);
    parts.push({
        name: "ECC Memory Module",
        description: "Error-correcting code RAM banks.",
        material: "plastic / memoryGlowingMaterial",
        function: "Stores active program code, flight plans, and sensor history.",
        assemblyOrder: 4,
        connections: ["Backplane", "CPU Module"],
        failureEffect: "Uncorrectable bit errors leading to system crash.",
        cascadeFailures: ["Watchdog timer trip", "Automatic failover"],
        originalPosition: { x: 0.5, y: 0.6, z: 0 },
        explodedPosition: { x: 1.5, y: 1.5, z: 0 },
        mesh: memoryModuleGroup,
        chipMeshes: chips // For animation
    });

    // 5. I/O Interface
    const ioGroup = new THREE.Group();
    ioGroup.position.set(1.5, 0.6, 0);
    const ioBoardGeo = new THREE.BoxGeometry(0.8, 1, 3);
    const ioBoardMesh = new THREE.Mesh(ioBoardGeo, copper);
    ioGroup.add(ioBoardMesh);

    // Connectors
    for(let i=0; i<3; i++) {
        const connGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.4);
        connGeo.rotateX(Math.PI/2);
        const connMesh = new THREE.Mesh(connGeo, chrome);
        connMesh.position.set(0.4, 0, -1 + i);
        ioGroup.add(connMesh);
    }

    group.add(ioGroup);
    parts.push({
        name: "ARINC 429 I/O Interface",
        description: "Aviation standard data bus interface controller.",
        material: "copper / chrome",
        function: "Handles incoming sensor data and outgoing actuator commands.",
        assemblyOrder: 5,
        connections: ["Backplane", "External Sensors", "Actuators"],
        failureEffect: "Inability to read sensors or command surfaces.",
        cascadeFailures: ["Loss of control", "Sensor invalidation"],
        originalPosition: { x: 1.5, y: 0.6, z: 0 },
        explodedPosition: { x: 3, y: 1.5, z: 0 },
        mesh: ioGroup
    });

    // 6. Data Bus Traces
    const busGeo = new THREE.BoxGeometry(2.5, 0.02, 0.2);
    const busMesh1 = new THREE.Mesh(busGeo, dataBusMaterial);
    busMesh1.position.set(0, 0.15, 0.5);
    group.add(busMesh1);
    
    const busMesh2 = new THREE.Mesh(busGeo, dataBusMaterial);
    busMesh2.position.set(0, 0.15, -0.5);
    group.add(busMesh2);

    parts.push({
        name: "High-Speed Data Traces",
        description: "Fiber-optic and copper pathways for parallel data transfer.",
        material: "dataBusMaterial",
        function: "Facilitates instantaneous communication across modules.",
        assemblyOrder: 6,
        connections: ["CPU", "Memory", "I/O"],
        failureEffect: "Data bottlenecks or complete communication failure.",
        cascadeFailures: ["Timing desynchronization"],
        originalPosition: { x: 0, y: 0.15, z: 0 }, // generalized
        explodedPosition: { x: 0, y: 0.5, z: 2 },
        mesh: busMesh1,
        mesh2: busMesh2 // for animation
    });

    // 7. Chassis Cover
    const coverGeo = new THREE.BoxGeometry(4.2, 1.5, 4.2);
    const coverMat = new THREE.MeshStandardMaterial({
        color: 0x333333,
        transparent: true,
        opacity: 0.3,
        roughness: 0.5,
        metalness: 0.8
    });
    const coverMesh = new THREE.Mesh(coverGeo, coverMat);
    coverMesh.position.set(0, 0.75, 0);
    group.add(coverMesh);
    parts.push({
        name: "Transparent Chassis Cover",
        description: "Upper protective shell (rendered transparent for visibility).",
        material: "tinted / glass",
        function: "Protects internal components from dust, moisture, and debris.",
        assemblyOrder: 7,
        connections: ["Chassis Base"],
        failureEffect: "Exposure of sensitive electronics to environment.",
        cascadeFailures: ["Short circuits", "Corrosion"],
        originalPosition: { x: 0, y: 0.75, z: 0 },
        explodedPosition: { x: 0, y: 4, z: 0 },
        mesh: coverMesh
    });

    const description = "The Avionics Flight Computer (AFC) is the central nervous system of modern aircraft. It utilizes triple-modular redundancy to process navigation algorithms, flight control laws, and system management protocols in real-time, ensuring extreme fault tolerance.";

    const quizQuestions = [
        {
            question: "Why does the CPU module use a triple-modular redundant (TMR) architecture?",
            options: [
                "To increase raw processing speed by 3x",
                "To allow three different operating systems to run simultaneously",
                "To provide fault tolerance by voting on outputs, mitigating single-point failures",
                "To reduce the power consumption of the overall system"
            ],
            correct: 2,
            explanation: "TMR uses three identical processors performing the same operations. If one produces a different output due to a glitch or cosmic ray strike, the other two 'outvote' it, ensuring continuous safe operation.",
            difficulty: "Medium"
        },
        {
            question: "What is the primary function of the ARINC 429 I/O interface?",
            options: [
                "It serves as the main power supply for the computer",
                "It cools the CPU during high load",
                "It provides error-correcting memory storage",
                "It handles standardized communication between the computer and external sensors/actuators"
            ],
            correct: 3,
            explanation: "ARINC 429 is a widely used technical standard for the predominant avionics data bus used on most higher-end commercial and transport aircraft, managing I/O.",
            difficulty: "Hard"
        },
        {
            question: "What happens if the High-Speed Backplane fails?",
            options: [
                "Only the memory module goes offline",
                "The system switches to a wireless backup",
                "Complete system halt due to loss of communication between all modules",
                "The CPU processes data slower"
            ],
            correct: 2,
            explanation: "The backplane is the physical and electrical spine of the system. Without it, the CPU, Memory, and I/O modules cannot exchange data, causing a critical failure.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Find specific parts for animation
        const cpuPart = parts.find(p => p.name === "Processing Unit (CPU)");
        const memPart = parts.find(p => p.name === "ECC Memory Module");
        const busPart = parts.find(p => p.name === "High-Speed Data Traces");

        // Pulsate CPU intensity
        if(cpuPart && cpuPart.chipMesh) {
            cpuPart.chipMesh.material.emissiveIntensity = 0.5 + Math.sin(time * 5 * speed) * 0.4;
        }

        // Sequential memory flashing
        if(memPart && memPart.chipMeshes) {
            memPart.chipMeshes.forEach((chip, idx) => {
                const offset = idx * Math.PI / 2;
                chip.material.emissiveIntensity = 0.2 + Math.max(0, Math.sin(time * 8 * speed + offset)) * 0.6;
            });
        }

        // Data bus flowing effect
        if(busPart && busPart.mesh && busPart.mesh2) {
            // Simulated flowing by pulsating emissive
            busPart.mesh.material.emissiveIntensity = 0.2 + Math.sin(time * 10 * speed) * 0.5;
            busPart.mesh2.material.emissiveIntensity = 0.2 + Math.sin(time * 10 * speed + Math.PI) * 0.5;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createAvionicsFlightComputer() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
