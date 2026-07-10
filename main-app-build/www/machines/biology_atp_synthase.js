import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials for protons and ATP
    const glowingProtonMat = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.9,
    });

    const glowingATPMat = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 1.5,
    });
    
    // Create materials for the complex
    const cRingMat = chrome; // Rotor
    const aSubunitMat = steel; // Stator piece
    const stalkMat = copper; // Gamma stalk
    const f1HexamerMat = plastic; // Alpha-beta hexamer

    // 1. F0 c-ring (Rotor)
    const cRingGroup = new THREE.Group();
    const cRings = 10;
    const radius = 2;
    for (let i = 0; i < cRings; i++) {
        const theta = (i / cRings) * Math.PI * 2;
        const geom = new THREE.CylinderGeometry(0.5, 0.5, 3, 16);
        const mesh = new THREE.Mesh(geom, cRingMat);
        mesh.position.set(Math.cos(theta) * radius, 0, Math.sin(theta) * radius);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        cRingGroup.add(mesh);
    }
    cRingGroup.position.set(0, 0, 0);
    group.add(cRingGroup);

    parts.push({
        name: "F0 c-ring Rotor",
        description: "A ring of protein subunits embedded in the membrane that rotates as protons pass through.",
        material: "chrome",
        function: "Converts the electrochemical proton gradient into mechanical rotational energy.",
        assemblyOrder: 1,
        connections: ["a-subunit", "Gamma Stalk"],
        failureEffect: "Rotation stops, halting ATP synthesis completely.",
        cascadeFailures: ["Gamma Stalk", "F1 Hexamer"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -5, z: 0},
        mesh: cRingGroup
    });

    // 2. F0 a-subunit (Stator)
    const aSubGeom = new THREE.BoxGeometry(2, 4, 2);
    const aSubMesh = new THREE.Mesh(aSubGeom, aSubunitMat);
    aSubMesh.position.set(radius + 1.5, 0, 0);
    group.add(aSubMesh);

    parts.push({
        name: "F0 a-subunit Stator",
        description: "The stationary part of the F0 motor containing half-channels for protons.",
        material: "steel",
        function: "Guides protons into and out of the c-ring, driving its rotation.",
        assemblyOrder: 2,
        connections: ["c-ring Rotor", "Peripheral Stalk"],
        failureEffect: "Protons cannot flow across the membrane, stopping the motor.",
        cascadeFailures: ["c-ring Rotor"],
        originalPosition: {x: radius + 1.5, y: 0, z: 0},
        explodedPosition: {x: 10, y: 0, z: 0},
        mesh: aSubMesh
    });

    // 3. Central Gamma Stalk
    const stalkGeom = new THREE.CylinderGeometry(0.8, 0.8, 8, 16);
    const stalkMesh = new THREE.Mesh(stalkGeom, stalkMat);
    // Attach the stalk to the rotor for animation so it spins
    cRingGroup.add(stalkMesh);
    stalkMesh.position.set(0, 4, 0);

    parts.push({
        name: "Gamma Stalk",
        description: "An asymmetrical camshaft that connects the F0 motor to the F1 catalytic head.",
        material: "copper",
        function: "Transmits rotary motion from the c-ring to the F1 hexamer, causing conformational changes.",
        assemblyOrder: 3,
        connections: ["c-ring Rotor", "F1 Hexamer"],
        failureEffect: "Loss of mechanical coupling; rotor spins without producing ATP.",
        cascadeFailures: ["F1 Hexamer"],
        originalPosition: {x: 0, y: 4, z: 0},
        explodedPosition: {x: 0, y: 8, z: 0},
        mesh: stalkMesh
    });

    // 4. F1 Alpha-Beta Hexamer (Catalytic Head)
    const hexGroup = new THREE.Group();
    const hexRadii = 2.8;
    for (let i = 0; i < 6; i++) {
        const theta = (i / 6) * Math.PI * 2;
        const geom = new THREE.SphereGeometry(1.6, 32, 32);
        // Alternating materials to distinguish alpha and beta subunits visually
        const mat = (i % 2 === 0) ? f1HexamerMat : new THREE.MeshStandardMaterial({color: 0xdddddd, roughness: 0.5});
        const mesh = new THREE.Mesh(geom, mat);
        mesh.position.set(Math.cos(theta) * hexRadii, 7.5, Math.sin(theta) * hexRadii);
        hexGroup.add(mesh);
    }
    group.add(hexGroup);

    parts.push({
        name: "F1 Alpha-Beta Hexamer",
        description: "The stationary catalytic head containing three active sites for ATP synthesis.",
        material: "plastic",
        function: "Synthesizes ATP from ADP and inorganic phosphate as the gamma stalk rotates inside it.",
        assemblyOrder: 4,
        connections: ["Gamma Stalk", "Peripheral Stalk"],
        failureEffect: "Inability to catalyze the formation of ATP.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 15, z: 0},
        mesh: hexGroup
    });

    // 5. Peripheral Stalk (b-subunit)
    const pStalkGeom = new THREE.CylinderGeometry(0.5, 0.5, 12, 16);
    const pStalkMesh = new THREE.Mesh(pStalkGeom, aluminum);
    pStalkMesh.position.set(radius + 1.5, 5, 0);
    group.add(pStalkMesh);

    parts.push({
        name: "Peripheral Stalk",
        description: "A static connector holding the F1 head stationary against the rotating gamma stalk.",
        material: "aluminum",
        function: "Prevents the F1 hexamer from spinning along with the central stalk.",
        assemblyOrder: 5,
        connections: ["a-subunit", "F1 Hexamer"],
        failureEffect: "F1 head spins freely with the stalk; no ATP is synthesized.",
        cascadeFailures: ["F1 Hexamer"],
        originalPosition: {x: radius + 1.5, y: 5, z: 0},
        explodedPosition: {x: 12, y: 5, z: 0},
        mesh: pStalkMesh
    });

    // 6. Glowing Protons (Driving the motor)
    const protonGroup = new THREE.Group();
    const protons = [];
    for (let i = 0; i < 5; i++) {
        const pMesh = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), glowingProtonMat);
        protonGroup.add(pMesh);
        protons.push({
            mesh: pMesh,
            offset: i * (Math.PI * 2 / 5)
        });
    }
    group.add(protonGroup);

    // 7. Ejected ATP Molecules
    const atpGroup = new THREE.Group();
    const atps = [];
    for (let i = 0; i < 3; i++) {
        const atpMesh = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), glowingATPMat);
        atpGroup.add(atpMesh);
        atps.push({
            mesh: atpMesh,
            phase: i * (Math.PI * 2 / 3)
        });
    }
    group.add(atpGroup);

    // Context for animations
    group.userData = {
        cRing: cRingGroup,
        hexGroup: hexGroup,
        protons: protons,
        atps: atps,
        radius: radius,
        hexRadii: hexRadii
    };

    const description = "ATP Synthase is an ultra-high-tech molecular rotary motor. Powered by a transmembrane proton gradient, the F0 c-ring rotor spins continuously. It drives a central asymmetric stalk that turns inside the stationary F1 hexamer. These complex rotational kinematics force conformational changes in the F1 head, efficiently catalyzing the synthesis of ATP—the universal energy currency of cells.";

    const quizQuestions = [
        {
            question: "What powers the rotation of the ATP Synthase F0 motor?",
            options: ["Hydrolysis of ATP", "Electrochemical proton gradient", "Direct electron transport", "Thermal fluctuations"],
            correct: 1,
            explanation: "The motor is mechanically driven by protons flowing down their electrochemical gradient across the membrane through the stationary a-subunit.",
            difficulty: "Medium"
        },
        {
            question: "Which structural component acts as the stator, anchoring the F1 head?",
            options: ["Gamma stalk", "c-ring rotor", "Peripheral stalk", "Epsilon subunit"],
            correct: 2,
            explanation: "The peripheral stalk structurally connects the membrane-bound a-subunit to the F1 head, holding it stationary while the central stalk rotates.",
            difficulty: "Medium"
        },
        {
            question: "Where is the actual site of ATP synthesis located within this complex?",
            options: ["Inside the membrane c-ring", "Within the stationary a-subunit", "Attached to the rotating gamma stalk", "In the F1 Alpha-Beta Hexamer"],
            correct: 3,
            explanation: "The catalytic sites are nestled between the alpha and beta subunits of the F1 hexamer, where conformational changes forcibly synthesize ATP.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshes) {
        if (!group.userData) return;
        
        const { cRing, hexGroup, protons, atps, radius, hexRadii } = group.userData;
        const rotSpeed = speed * 2.0;
        
        // 1. Complex Rotational Kinematics of the c-ring and gamma stalk
        cRing.rotation.y = time * rotSpeed;

        // 2. Animate protons flowing through the motor
        protons.forEach((p) => {
            const t = (time * speed + p.offset) % (Math.PI * 2);
            // Simulating flow: top -> into stator -> out bottom
            const y = Math.cos(t) * 3; 
            const x = radius + 1.5 + Math.sin(t) * 1.5;
            const z = Math.cos(t * 2);
            p.mesh.position.set(x, y, z);
        });

        // 3. Animate ATP molecules being synthesized and ejected from F1
        atps.forEach((atp) => {
            const phase = (time * rotSpeed + atp.phase) % (Math.PI * 2);
            if (phase < Math.PI) {
                // Ejection phase
                const outward = (Math.PI - phase) * 1.5;
                const angle = atp.phase;
                atp.mesh.position.set(Math.cos(angle) * (hexRadii + outward), 7.5, Math.sin(angle) * (hexRadii + outward));
                atp.mesh.scale.setScalar(1);
                atp.mesh.visible = true;
                
                // Add a little spin to the ATP box as it floats out
                atp.mesh.rotation.x = time * 3;
                atp.mesh.rotation.y = time * 3;
            } else {
                // Synthesis phase inside the complex
                atp.mesh.visible = false;
            }
        });

        // 4. Subtle pulsing breathing effect on the F1 head to simulate conformational shifts
        const pulse = Math.sin(time * rotSpeed * 3) * 0.03 + 1;
        hexGroup.scale.set(pulse, pulse, pulse);
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createATPSynthase() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
