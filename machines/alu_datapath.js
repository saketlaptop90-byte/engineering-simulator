import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Glowing Materials
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
    });

    const neonOrange = new THREE.MeshStandardMaterial({
        color: 0xff6600,
        emissive: 0xff6600,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
    });
    
    const neonGreen = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
    });
    
    const siliconMaterial = new THREE.MeshStandardMaterial({
        color: 0x2a2a2a,
        roughness: 0.8,
        metalness: 0.4
    });

    // 1. Motherboard / Base Substrate
    const baseGeo = new THREE.BoxGeometry(10, 0.2, 8);
    const baseMesh = new THREE.Mesh(baseGeo, siliconMaterial);
    group.add(baseMesh);
    parts.push({
        name: "Silicon Substrate",
        description: "The main PCB or silicon base for the datapath components.",
        material: siliconMaterial,
        function: "Provides structural support and routing area for data buses.",
        assemblyOrder: 1,
        connections: ["Input Registers", "ALU Core", "Output Register"],
        failureEffect: "Total system failure.",
        cascadeFailures: ["All components"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 },
        mesh: baseMesh
    });

    // 2. ALU Core
    const aluShape = new THREE.Shape();
    aluShape.moveTo(-1, 1);
    aluShape.lineTo(1, 1);
    aluShape.lineTo(1.5, 0);
    aluShape.lineTo(0.5, -1);
    aluShape.lineTo(0, -0.2); // inner V
    aluShape.lineTo(-0.5, -1);
    aluShape.lineTo(-1.5, 0);
    aluShape.lineTo(-1, 1);
    
    const extrudeSettings = { depth: 0.5, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.05, bevelThickness: 0.05 };
    const aluGeo = new THREE.ExtrudeGeometry(aluShape, extrudeSettings);
    const aluMesh = new THREE.Mesh(aluGeo, chrome);
    aluMesh.rotation.x = -Math.PI / 2;
    aluMesh.position.set(0, 0.3, 0);
    group.add(aluMesh);
    parts.push({
        name: "ALU Core",
        description: "Arithmetic Logic Unit responsible for math and bitwise operations.",
        material: chrome,
        function: "Executes ADD, SUB, AND, OR, XOR operations.",
        assemblyOrder: 5,
        connections: ["Input A", "Input B", "Control Unit", "Output Register"],
        failureEffect: "Incorrect calculations, erroneous output.",
        cascadeFailures: ["Output Register"],
        originalPosition: { x: 0, y: 0.3, z: 0 },
        explodedPosition: { x: 0, y: 2, z: 0 },
        mesh: aluMesh
    });

    // 3. Input Register A
    const regGeo = new THREE.BoxGeometry(1.5, 0.4, 1);
    const regAMesh = new THREE.Mesh(regGeo, steel);
    regAMesh.position.set(-2, 0.3, -2);
    group.add(regAMesh);
    parts.push({
        name: "Register A",
        description: "Holds the first operand for the ALU.",
        material: steel,
        function: "Stores data temporarily before processing.",
        assemblyOrder: 2,
        connections: ["ALU Core", "Bus A"],
        failureEffect: "Corrupted operand A.",
        cascadeFailures: ["ALU Core"],
        originalPosition: { x: -2, y: 0.3, z: -2 },
        explodedPosition: { x: -3, y: 1, z: -3 },
        mesh: regAMesh
    });

    // 4. Input Register B
    const regBMesh = new THREE.Mesh(regGeo, steel);
    regBMesh.position.set(2, 0.3, -2);
    group.add(regBMesh);
    parts.push({
        name: "Register B",
        description: "Holds the second operand for the ALU.",
        material: steel,
        function: "Stores data temporarily before processing.",
        assemblyOrder: 3,
        connections: ["ALU Core", "Bus B"],
        failureEffect: "Corrupted operand B.",
        cascadeFailures: ["ALU Core"],
        originalPosition: { x: 2, y: 0.3, z: -2 },
        explodedPosition: { x: 3, y: 1, z: -3 },
        mesh: regBMesh
    });

    // 5. Output Register
    const outRegMesh = new THREE.Mesh(regGeo, steel);
    outRegMesh.position.set(0, 0.3, 2.5);
    group.add(outRegMesh);
    parts.push({
        name: "Output Register",
        description: "Captures the result from the ALU.",
        material: steel,
        function: "Holds the computed result until the next clock cycle.",
        assemblyOrder: 4,
        connections: ["ALU Core", "Main Bus"],
        failureEffect: "Data cannot be saved or read back.",
        cascadeFailures: ["Memory", "CPU Registers"],
        originalPosition: { x: 0, y: 0.3, z: 2.5 },
        explodedPosition: { x: 0, y: 1, z: 4 },
        mesh: outRegMesh
    });

    // 6. Data Buses (Glowing pathways)
    const busLinesGeo = new THREE.BoxGeometry(0.1, 0.1, 2);
    
    // Bus A
    const busAMesh = new THREE.Mesh(busLinesGeo, neonBlue);
    busAMesh.position.set(-1, 0.15, -1);
    busAMesh.rotation.y = -Math.PI / 4;
    group.add(busAMesh);
    parts.push({
        name: "Data Bus A",
        description: "High-speed conductive trace.",
        material: neonBlue,
        function: "Transmits Operand A to ALU.",
        assemblyOrder: 6,
        connections: ["Register A", "ALU Core"],
        failureEffect: "Data loss during transmission.",
        cascadeFailures: ["ALU Core"],
        originalPosition: { x: -1, y: 0.15, z: -1 },
        explodedPosition: { x: -1.5, y: 0.5, z: -1.5 },
        mesh: busAMesh
    });

    // Bus B
    const busBMesh = new THREE.Mesh(busLinesGeo, neonOrange);
    busBMesh.position.set(1, 0.15, -1);
    busBMesh.rotation.y = Math.PI / 4;
    group.add(busBMesh);
    parts.push({
        name: "Data Bus B",
        description: "High-speed conductive trace.",
        material: neonOrange,
        function: "Transmits Operand B to ALU.",
        assemblyOrder: 7,
        connections: ["Register B", "ALU Core"],
        failureEffect: "Data loss during transmission.",
        cascadeFailures: ["ALU Core"],
        originalPosition: { x: 1, y: 0.15, z: -1 },
        explodedPosition: { x: 1.5, y: 0.5, z: -1.5 },
        mesh: busBMesh
    });

    // Output Bus
    const outBusGeo = new THREE.BoxGeometry(0.1, 0.1, 1.5);
    const outBusMesh = new THREE.Mesh(outBusGeo, neonGreen);
    outBusMesh.position.set(0, 0.15, 1.3);
    group.add(outBusMesh);
    parts.push({
        name: "Output Bus",
        description: "Result transmission line.",
        material: neonGreen,
        function: "Transmits computed result to Output Register.",
        assemblyOrder: 8,
        connections: ["ALU Core", "Output Register"],
        failureEffect: "Results cannot reach destination.",
        cascadeFailures: ["Output Register"],
        originalPosition: { x: 0, y: 0.15, z: 1.3 },
        explodedPosition: { x: 0, y: 0.5, z: 2 },
        mesh: outBusMesh
    });
    
    // Status Flags
    const flagsGroup = new THREE.Group();
    const flagGeo = new THREE.SphereGeometry(0.15, 16, 16);
    const flagZero = new THREE.Mesh(flagGeo, glass);
    flagZero.position.set(-1, 0, 0);
    const flagCarry = new THREE.Mesh(flagGeo, glass);
    flagCarry.position.set(-0.33, 0, 0);
    const flagNeg = new THREE.Mesh(flagGeo, glass);
    flagNeg.position.set(0.33, 0, 0);
    const flagOvf = new THREE.Mesh(flagGeo, glass);
    flagOvf.position.set(1, 0, 0);
    
    flagsGroup.add(flagZero, flagCarry, flagNeg, flagOvf);
    flagsGroup.position.set(0, 0.5, 0);
    group.add(flagsGroup);
    
    parts.push({
        name: "Status Flags Register",
        description: "LED indicators for Zero, Carry, Negative, and Overflow.",
        material: glass,
        function: "Stores the status of the last ALU operation for conditional branching.",
        assemblyOrder: 9,
        connections: ["ALU Core", "Control Unit"],
        failureEffect: "Branching logic fails.",
        cascadeFailures: ["Program Counter"],
        originalPosition: { x: 0, y: 0.5, z: 0 },
        explodedPosition: { x: 0, y: 3, z: 0 },
        mesh: flagsGroup
    });

    const description = "The ALU (Arithmetic Logic Unit) Datapath is the core computational heart of a CPU. It retrieves operands from input registers, performs mathematical or logical operations as directed by the control unit, and outputs the result along with status flags.";

    const quizQuestions = [
        {
            question: "What is the primary function of the ALU?",
            options: [
                "Storing program instructions",
                "Performing arithmetic and bitwise logical operations",
                "Providing power to the CPU",
                "Cooling the processor"
            ],
            correct: 1,
            explanation: "The Arithmetic Logic Unit (ALU) is responsible for executing all mathematical (add, subtract) and logical (AND, OR, XOR) operations.",
            difficulty: "Beginner"
        },
        {
            question: "What happens if Data Bus A fails?",
            options: [
                "The ALU operates twice as fast",
                "Operand A becomes corrupted or unavailable, causing erroneous output",
                "The Output Register stores previous data",
                "Register B handles both operands"
            ],
            correct: 1,
            explanation: "Data Bus A is the physical pathway for Operand A. If it fails, the ALU won't receive the correct data.",
            difficulty: "Intermediate"
        },
        {
            question: "Which component stores the condition codes like Zero, Carry, and Overflow?",
            options: [
                "Register A",
                "Output Register",
                "Status Flags Register",
                "Data Bus B"
            ],
            correct: 2,
            explanation: "The Status Flags Register captures conditions resulting from the ALU operation, which are essential for conditional jump instructions.",
            difficulty: "Advanced"
        }
    ];

    function animate(time, speed, meshes) {
        // Pulsing glowing buses to simulate data flow
        const pulseBusA = (Math.sin(time * speed * 4) + 1) / 2;
        busAMesh.material.emissiveIntensity = 0.2 + pulseBusA * 0.8;
        
        const pulseBusB = (Math.sin(time * speed * 4 + Math.PI/2) + 1) / 2;
        busBMesh.material.emissiveIntensity = 0.2 + pulseBusB * 0.8;
        
        const pulseOut = (Math.sin(time * speed * 4 + Math.PI) + 1) / 2;
        outBusMesh.material.emissiveIntensity = 0.2 + pulseOut * 0.8;
        
        // Randomly blink status flags to simulate processing
        if (Math.random() > 0.95) flagZero.material = Math.random() > 0.5 ? neonBlue : glass;
        if (Math.random() > 0.95) flagCarry.material = Math.random() > 0.5 ? neonOrange : glass;
        if (Math.random() > 0.95) flagNeg.material = Math.random() > 0.5 ? neonGreen : glass;
        if (Math.random() > 0.95) flagOvf.material = Math.random() > 0.5 ? neonOrange : glass;
        
        // Slight hover effect for ALU core to look high-tech
        aluMesh.position.y = 0.3 + Math.sin(time * speed * 2) * 0.02;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createAluDatapath() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
