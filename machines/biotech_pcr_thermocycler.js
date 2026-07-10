import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const peltierGlow = new THREE.MeshPhysicalMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 2.0,
        roughness: 0.2,
        metalness: 0.8,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const dnaGlow = new THREE.MeshStandardMaterial({
        color: 0x00ffcc,
        emissive: 0x00ffcc,
        emissiveIntensity: 3.0,
        transparent: true,
        opacity: 0.8
    });
    
    const displayGlow = new THREE.MeshStandardMaterial({
        color: 0x00aaff,
        emissive: 0x00aaff,
        emissiveIntensity: 1.5,
    });

    // 1. Base Housing (plastic)
    const baseGeo = new THREE.BoxGeometry(10, 4, 12);
    const baseMesh = new THREE.Mesh(baseGeo, plastic);
    baseMesh.position.set(0, 2, 0);
    group.add(baseMesh);
    parts.push({
        name: "Base Housing",
        description: "Main chassis containing power supply, logic boards, and cooling fans.",
        material: "plastic",
        function: "Structural support and protection for internal electronics.",
        assemblyOrder: 1,
        connections: ["Power Supply", "Motherboard", "Thermal Block"],
        failureEffect: "Exposure of internal components.",
        cascadeFailures: ["Dust accumulation leading to overheating"],
        originalPosition: { x: 0, y: 2, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 },
        mesh: baseMesh
    });

    // 2. Motherboard/Controller (darkSteel)
    const boardGeo = new THREE.BoxGeometry(8, 0.2, 8);
    const boardMesh = new THREE.Mesh(boardGeo, darkSteel);
    boardMesh.position.set(0, 3, 0);
    group.add(boardMesh);
    parts.push({
        name: "Logic Controller",
        description: "Microcontroller regulating temperature cycles and user interface.",
        material: "darkSteel",
        function: "Executes PCR temperature profiles precisely.",
        assemblyOrder: 2,
        connections: ["Base Housing", "Peltier Element", "Display"],
        failureEffect: "Complete system halt.",
        cascadeFailures: ["Incorrect temperature cycling ruining samples"],
        originalPosition: { x: 0, y: 3, z: 0 },
        explodedPosition: { x: 0, y: -2, z: -10 },
        mesh: boardMesh
    });

    // 3. Heat Sink (aluminum)
    const sinkGeo = new THREE.BoxGeometry(6, 2, 6);
    const sinkMesh = new THREE.Mesh(sinkGeo, aluminum);
    sinkMesh.position.set(0, 4, 0);
    group.add(sinkMesh);
    parts.push({
        name: "Heat Sink",
        description: "Large aluminum fins to dissipate excess heat rapidly.",
        material: "aluminum",
        function: "Removes heat from Peltier during cooling phase.",
        assemblyOrder: 3,
        connections: ["Peltier Element", "Cooling Fan"],
        failureEffect: "Inability to cool quickly.",
        cascadeFailures: ["Peltier burnout", "Denaturation of enzymes"],
        originalPosition: { x: 0, y: 4, z: 0 },
        explodedPosition: { x: -8, y: 4, z: 0 },
        mesh: sinkMesh
    });

    // 4. Peltier Thermoelectric Element (peltierGlow)
    const peltierGeo = new THREE.BoxGeometry(5, 0.5, 5);
    const peltierMesh = new THREE.Mesh(peltierGeo, peltierGlow);
    peltierMesh.position.set(0, 5.25, 0);
    group.add(peltierMesh);
    parts.push({
        name: "Peltier Element",
        description: "Thermoelectric cooler/heater driving the rapid temperature changes.",
        material: "custom glowing",
        function: "Pumps heat in or out of the thermal block.",
        assemblyOrder: 4,
        connections: ["Heat Sink", "Thermal Block", "Logic Controller"],
        failureEffect: "Loss of temperature control.",
        cascadeFailures: ["Sample destruction"],
        originalPosition: { x: 0, y: 5.25, z: 0 },
        explodedPosition: { x: 0, y: 5.25, z: 10 },
        mesh: peltierMesh
    });

    // 5. Thermal Block (chrome/aluminum)
    const blockGeo = new THREE.BoxGeometry(5, 1, 5);
    const blockMesh = new THREE.Mesh(blockGeo, chrome);
    blockMesh.position.set(0, 6, 0);
    group.add(blockMesh);
    parts.push({
        name: "Thermal Block",
        description: "Conductive metal block holding the PCR tubes.",
        material: "chrome",
        function: "Transfers heat uniformly to reaction tubes.",
        assemblyOrder: 5,
        connections: ["Peltier Element", "PCR Tubes"],
        failureEffect: "Uneven heating.",
        cascadeFailures: ["Inconsistent amplification across wells"],
        originalPosition: { x: 0, y: 6, z: 0 },
        explodedPosition: { x: 8, y: 6, z: 0 },
        mesh: blockMesh
    });

    // 6. PCR Tubes and DNA (glass & dnaGlow)
    const tubesGroup = new THREE.Group();
    tubesGroup.position.set(0, 6.5, 0);
    for(let i = -1; i <= 1; i++) {
        for(let j = -1; j <= 1; j++) {
            const tubeGeo = new THREE.CylinderGeometry(0.3, 0.1, 1.5, 16);
            const tubeMesh = new THREE.Mesh(tubeGeo, glass);
            tubeMesh.position.set(i*1.5, 0, j*1.5);
            
            // Inner DNA glow
            const dnaGeo = new THREE.SphereGeometry(0.15, 8, 8);
            const dna = new THREE.Mesh(dnaGeo, dnaGlow);
            dna.position.set(0, -0.4, 0);
            dna.userData.isDNA = true;
            tubeMesh.add(dna);
            
            tubesGroup.add(tubeMesh);
        }
    }
    group.add(tubesGroup);
    parts.push({
        name: "PCR Tubes & Reaction Mix",
        description: "Thin-walled tubes containing DNA, primers, dNTPs, and Taq polymerase.",
        material: "glass/custom",
        function: "Houses the biochemical reaction.",
        assemblyOrder: 6,
        connections: ["Thermal Block", "Heated Lid"],
        failureEffect: "Sample evaporation or leakage.",
        cascadeFailures: ["Contamination of thermal block"],
        originalPosition: { x: 0, y: 6.5, z: 0 },
        explodedPosition: { x: 0, y: 12, z: 0 },
        mesh: tubesGroup
    });

    // 7. Heated Lid (darkSteel / rubber)
    const lidGeo = new THREE.BoxGeometry(8, 1, 10);
    const lidMesh = new THREE.Mesh(lidGeo, darkSteel);
    lidMesh.position.set(0, 8, 1);
    group.add(lidMesh);
    parts.push({
        name: "Heated Lid",
        description: "Lid heated to ~105°C to prevent condensation on tube caps.",
        material: "darkSteel",
        function: "Prevents sample volume loss through condensation.",
        assemblyOrder: 7,
        connections: ["Base Housing", "PCR Tubes"],
        failureEffect: "Condensation on tube caps.",
        cascadeFailures: ["Altered reactant concentrations, failed PCR"],
        originalPosition: { x: 0, y: 8, z: 1 },
        explodedPosition: { x: 0, y: 15, z: 5 },
        mesh: lidMesh
    });

    // 8. LCD Touch Display (tinted/displayGlow)
    const displayGeo = new THREE.BoxGeometry(6, 2, 0.5);
    const displayMesh = new THREE.Mesh(displayGeo, tinted);
    displayMesh.position.set(0, 4.5, 6);
    displayMesh.rotation.x = -Math.PI / 6;
    
    const screenGeo = new THREE.PlaneGeometry(5.5, 1.5);
    const screenMesh = new THREE.Mesh(screenGeo, displayGlow);
    screenMesh.position.set(0, 0, 0.26);
    displayMesh.add(screenMesh);
    
    group.add(displayMesh);
    parts.push({
        name: "Touch Interface",
        description: "LCD screen for programming temperature steps and cycles.",
        material: "glass",
        function: "User interaction and status monitoring.",
        assemblyOrder: 8,
        connections: ["Logic Controller", "Base Housing"],
        failureEffect: "Loss of user control.",
        cascadeFailures: ["Inability to start or stop protocols"],
        originalPosition: { x: 0, y: 4.5, z: 6 },
        explodedPosition: { x: 0, y: 4.5, z: 12 },
        mesh: displayMesh
    });

    const description = "A high-tech PCR (Polymerase Chain Reaction) Thermocycler used in molecular biology to amplify specific DNA segments. It rapidly cycles through temperatures for denaturation (94°C), annealing (50-65°C), and extension (72°C) phases.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Peltier Element in a thermocycler?",
            options: [
                "To synthesize DNA directly",
                "To rapidly heat and cool the thermal block via thermoelectric effect",
                "To store the PCR protocols in memory",
                "To prevent condensation on the tube caps"
            ],
            correct: 1,
            explanation: "Peltier elements act as solid-state heat pumps, capable of rapidly heating or cooling when DC current is applied, which is essential for rapid PCR thermal cycling.",
            difficulty: "Medium"
        },
        {
            question: "Why is a heated lid necessary in a PCR machine?",
            options: [
                "To sterilize the tubes",
                "To increase the reaction speed",
                "To prevent water from the sample from condensing at the top of the tube",
                "To denature the DNA faster"
            ],
            correct: 2,
            explanation: "Without a heated lid, the high temperatures of the block would cause the water in the reaction mix to evaporate and condense on the cooler lid of the tube, altering concentrations and causing the PCR to fail.",
            difficulty: "Easy"
        },
        {
            question: "Which phase of PCR typically requires the highest temperature (e.g., 94-98°C)?",
            options: [
                "Annealing",
                "Extension",
                "Denaturation",
                "Ligation"
            ],
            correct: 2,
            explanation: "The denaturation phase requires high temperatures to break the hydrogen bonds between double-stranded DNA, separating them into single strands.",
            difficulty: "Medium"
        }
    ];

    let cyclePhase = 0; // 0: Denature(Heat), 1: Anneal(Cool), 2: Extend(Warm)
    let cycleTimer = 0;

    function animate(time, speed, meshes) {
        // Cycle duration relative to speed
        cycleTimer += 0.05 * speed;
        
        if (cycleTimer > 3) {
            cycleTimer = 0;
            cyclePhase = (cyclePhase + 1) % 3;
        }

        // 1. Peltier Color Animation (Red = Heat, Blue = Cool, Green = Extend)
        const peltier = parts.find(p => p.name === "Peltier Element");
        if (peltier && peltier.mesh) {
            const mat = peltier.mesh.material;
            let targetR = 0, targetG = 0, targetB = 0;
            if (cyclePhase === 0) {
                targetR = 1; targetG = 0.1; targetB = 0.1; // Denature (Hot)
            } else if (cyclePhase === 1) {
                targetR = 0.1; targetG = 0.1; targetB = 1; // Anneal (Cool)
            } else {
                targetR = 0.1; targetG = 0.8; targetB = 0.1; // Extend (Warm)
            }
            
            mat.color.r += (targetR - mat.color.r) * 0.1 * speed;
            mat.color.g += (targetG - mat.color.g) * 0.1 * speed;
            mat.color.b += (targetB - mat.color.b) * 0.1 * speed;
            mat.emissive.copy(mat.color);
        }

        // 2. DNA Glow and "Replication" effect (pulse size based on cycle)
        const tubes = parts.find(p => p.name === "PCR Tubes & Reaction Mix");
        if (tubes && tubes.mesh) {
            tubes.mesh.children.forEach(tube => {
                tube.children.forEach(child => {
                    if (child.userData.isDNA) {
                        if (cyclePhase === 2) {
                            // Growing during extension
                            const scale = 1 + (cycleTimer / 3) * 1.5;
                            child.scale.set(scale, scale, scale);
                            child.material.emissiveIntensity = 3.0 + Math.sin(time * 10 * speed) * 2;
                        } else if (cyclePhase === 0) {
                            // Splitting / shrinking slightly during denature
                            child.scale.set(1.5, 0.5, 1.5);
                            child.material.emissiveIntensity = 1.0;
                        } else {
                            // Stable during anneal
                            child.scale.set(1, 1, 1);
                            child.material.emissiveIntensity = 2.0;
                        }
                    }
                });
            });
        }
        
        // 3. Screen Pulse
        const screen = parts.find(p => p.name === "Touch Interface");
        if (screen && screen.mesh) {
            const screenMat = screen.mesh.children[0].material;
            screenMat.emissiveIntensity = 1.5 + Math.sin(time * 2) * 0.5;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createPCRThermocycler() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
