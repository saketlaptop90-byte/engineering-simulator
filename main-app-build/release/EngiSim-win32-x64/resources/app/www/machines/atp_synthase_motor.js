import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const description = "The ATP Synthase Molecular Motor is a stunning biological nanomotor that spans a membrane and acts like a tiny turbine. Driven by a flow of protons, its central rotor spins rapidly, driving structural changes in the catalytic head to synthesize ATP (adenosine triphosphate) - the universal energy currency of cells. It combines an electric motor (F0) with a chemical generator (F1), operating at nearly 100% efficiency.";

    // Custom Materials
    const glowProtonMat = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.8
    });

    const bioRotorMat = new THREE.MeshPhysicalMaterial({
        color: 0xff00ff,
        emissive: 0x330033,
        metalness: 0.1,
        roughness: 0.3,
        transmission: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const catalyticHeadMat = new THREE.MeshPhysicalMaterial({
        color: 0xffdd44,
        emissive: 0x111100,
        metalness: 0.2,
        roughness: 0.5,
        transmission: 0.4,
        transparent: true,
        opacity: 0.9,
        clearcoat: 0.8
    });

    const membraneMat = new THREE.MeshPhysicalMaterial({
        color: 0x113355,
        metalness: 0.8,
        roughness: 0.2,
        transparent: true,
        opacity: 0.5,
        envMapIntensity: 2.0
    });

    const statorMat = new THREE.MeshStandardMaterial({
        color: 0xaaaaaa,
        emissive: 0x111111,
        metalness: 0.9,
        roughness: 0.4
    });

    // 1. Membrane (Background structure)
    const membraneGeo = new THREE.CylinderGeometry(8, 8, 1.5, 32);
    const membraneMesh = new THREE.Mesh(membraneGeo, membraneMat);
    membraneMesh.position.set(0, -2, 0);
    group.add(membraneMesh);
    parts.push({
        name: "Lipid Bilayer Membrane",
        description: "The cellular membrane that maintains the proton gradient necessary for motor operation.",
        material: "membraneMat",
        function: "Acts as a barrier to store the potential energy of the proton gradient.",
        assemblyOrder: 1,
        connections: ["F0 Stator", "C-Ring Rotor"],
        failureEffect: "Loss of proton gradient.",
        cascadeFailures: ["Complete motor stop", "Cell death"],
        originalPosition: { x: 0, y: -2, z: 0 },
        explodedPosition: { x: 0, y: -10, z: 0 },
        mesh: membraneMesh
    });

    // 2. F0 C-Ring Rotor
    const cRingGeo = new THREE.TorusGeometry(3, 1.2, 16, 24);
    const cRingMesh = new THREE.Mesh(cRingGeo, bioRotorMat);
    cRingMesh.rotation.x = Math.PI / 2;
    cRingMesh.position.set(0, -2, 0);
    group.add(cRingMesh);
    parts.push({
        name: "F0 C-Ring Rotor",
        description: "A ring of protein subunits embedded in the membrane.",
        material: "bioRotorMat",
        function: "Rotates as protons pass through, providing mechanical torque.",
        assemblyOrder: 2,
        connections: ["Membrane", "Gamma Central Stalk"],
        failureEffect: "No torque generation.",
        cascadeFailures: ["No ATP synthesis"],
        originalPosition: { x: 0, y: -2, z: 0 },
        explodedPosition: { x: 0, y: -6, z: 0 },
        mesh: cRingMesh
    });

    // 3. F0 Stator (a-subunit)
    const statorGeo = new THREE.BoxGeometry(2, 4, 3);
    const statorMesh = new THREE.Mesh(statorGeo, statorMat);
    statorMesh.position.set(4, -1, 0);
    group.add(statorMesh);
    parts.push({
        name: "F0 a-subunit Stator",
        description: "The stationary channel component next to the C-Ring.",
        material: "statorMat",
        function: "Provides half-channels for protons to enter and exit, driving C-Ring rotation.",
        assemblyOrder: 3,
        connections: ["Membrane", "Peripheral Stalk", "C-Ring Rotor"],
        failureEffect: "Proton flow halts.",
        cascadeFailures: ["Motor freeze"],
        originalPosition: { x: 4, y: -1, z: 0 },
        explodedPosition: { x: 8, y: -1, z: 0 },
        mesh: statorMesh
    });

    // 4. Gamma Central Stalk
    const stalkGeo = new THREE.CylinderGeometry(0.5, 0.5, 6, 16);
    const stalkMesh = new THREE.Mesh(stalkGeo, chrome);
    stalkMesh.position.set(0, 1.5, 0);
    group.add(stalkMesh);
    parts.push({
        name: "Gamma Central Stalk",
        description: "An asymmetric axle connecting the F0 rotor to the F1 head.",
        material: "chrome",
        function: "Transmits rotary motion into the F1 head, inducing conformational changes.",
        assemblyOrder: 4,
        connections: ["C-Ring Rotor", "F1 Catalytic Head"],
        failureEffect: "Mechanical uncoupling.",
        cascadeFailures: ["Torque not transmitted", "Zero efficiency"],
        originalPosition: { x: 0, y: 1.5, z: 0 },
        explodedPosition: { x: 0, y: 3, z: 0 },
        mesh: stalkMesh
    });

    // 5. F1 Catalytic Head
    const headGeo = new THREE.SphereGeometry(3.5, 32, 16);
    const headMesh = new THREE.Mesh(headGeo, catalyticHeadMat);
    headMesh.scale.set(1, 0.8, 1);
    headMesh.position.set(0, 5, 0);
    group.add(headMesh);
    parts.push({
        name: "F1 Catalytic Head (Alpha/Beta subunits)",
        description: "A hexameric knob protruding from the membrane.",
        material: "catalyticHeadMat",
        function: "Synthesizes ATP from ADP and inorganic phosphate as the central stalk rotates.",
        assemblyOrder: 5,
        connections: ["Gamma Central Stalk", "Peripheral Stalk"],
        failureEffect: "Inability to bind ADP/Pi.",
        cascadeFailures: ["Energy starvation"],
        originalPosition: { x: 0, y: 5, z: 0 },
        explodedPosition: { x: 0, y: 12, z: 0 },
        mesh: headMesh
    });

    // 6. Peripheral Stalk
    const pStalkGeo = new THREE.CylinderGeometry(0.3, 0.3, 8, 8);
    const pStalkMesh = new THREE.Mesh(pStalkGeo, steel);
    pStalkMesh.position.set(4, 3, 0);
    group.add(pStalkMesh);
    parts.push({
        name: "Peripheral Stalk",
        description: "A rigid arm holding the F1 head stationary against the spinning central stalk.",
        material: "steel",
        function: "Acts as a stator, preventing the entire F1 head from spinning with the rotor.",
        assemblyOrder: 6,
        connections: ["F0 Stator", "F1 Catalytic Head"],
        failureEffect: "F1 head spins with rotor.",
        cascadeFailures: ["No relative motion", "ATP synthesis fails"],
        originalPosition: { x: 4, y: 3, z: 0 },
        explodedPosition: { x: 10, y: 3, z: 0 },
        mesh: pStalkMesh
    });

    // 7. Protons (Particles)
    const protons = new THREE.Group();
    for (let i = 0; i < 20; i++) {
        const protonGeo = new THREE.SphereGeometry(0.2, 8, 8);
        const protonMesh = new THREE.Mesh(protonGeo, glowProtonMat);
        const angle = Math.random() * Math.PI * 2;
        const radius = 3.5 + Math.random();
        protonMesh.position.set(Math.cos(angle) * radius, -4 - Math.random() * 3, Math.sin(angle) * radius);
        protonMesh.userData = { angle, radius, speed: 0.02 + Math.random() * 0.03, phase: Math.random() * Math.PI * 2 };
        protons.add(protonMesh);
    }
    group.add(protons);
    parts.push({
        name: "Proton Flux",
        description: "Hydrogen ions (H+) flowing down their electrochemical gradient.",
        material: "glowProtonMat",
        function: "Provides the electromotive force to spin the C-Ring.",
        assemblyOrder: 7,
        connections: ["F0 Stator"],
        failureEffect: "No power source.",
        cascadeFailures: ["Motor shutdown"],
        originalPosition: { x: 0, y: -4, z: 0 },
        explodedPosition: { x: 0, y: -15, z: 0 },
        mesh: protons
    });

    const quizQuestions = [
        {
            question: "What powers the rotation of the ATP Synthase C-Ring rotor?",
            options: [
                "Hydrolysis of ATP",
                "A flow of electrons",
                "A proton (H+) electrochemical gradient",
                "Thermal fluctuations alone"
            ],
            correct: 2,
            explanation: "The motor is driven by protons moving down their electrochemical gradient across the membrane.",
            difficulty: "Medium"
        },
        {
            question: "Which component prevents the F1 Catalytic Head from spinning with the central stalk?",
            options: [
                "The C-Ring",
                "The Peripheral Stalk",
                "The Membrane",
                "The a-subunit Stator"
            ],
            correct: 1,
            explanation: "The Peripheral Stalk acts as a rigid anchor connecting the membrane stator to the catalytic head, keeping it stationary.",
            difficulty: "Easy"
        },
        {
            question: "What is the primary function of the F1 Catalytic Head?",
            options: [
                "To pump protons out of the cell",
                "To synthesize ATP from ADP and Pi",
                "To synthesize DNA",
                "To generate heat"
            ],
            correct: 1,
            explanation: "The F1 Catalytic Head utilizes the mechanical energy from the central stalk to synthesize ATP.",
            difficulty: "Easy"
        },
        {
            question: "The ATP Synthase acts as an energy transducer, converting what type of energy into chemical energy?",
            options: [
                "Light energy",
                "Electrochemical and mechanical energy",
                "Nuclear energy",
                "Magnetic energy"
            ],
            correct: 1,
            explanation: "It converts the electrochemical potential of the proton gradient into mechanical rotary motion, and then into chemical bond energy (ATP).",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Spin the C-Ring and Central Stalk
        cRingMesh.rotation.z -= 0.05 * speed;
        stalkMesh.rotation.y -= 0.05 * speed;

        // F1 Head breathing/pulsing animation to simulate conformational changes
        const pulse = 1 + Math.sin(time * 5 * speed) * 0.03;
        headMesh.scale.set(pulse, 0.8 * pulse, pulse);

        // Animate protons flowing
        protons.children.forEach(proton => {
            const data = proton.userData;
            data.angle -= data.speed * speed;
            
            // Move up through the stator
            proton.position.y += 0.05 * speed;
            if (proton.position.y > 0) {
                // Reset below the membrane
                proton.position.y = -4 - Math.random() * 2;
                data.angle = Math.random() * Math.PI * 2;
            }
            
            proton.position.x = Math.cos(data.angle) * data.radius;
            proton.position.z = Math.sin(data.angle) * data.radius;
        });
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
