import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Glowing Materials
    const neonCyan = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 2.5, transparent: true, opacity: 0.9 });
    const neonRed = new THREE.MeshStandardMaterial({ color: 0xff0033, emissive: 0xff0033, emissiveIntensity: 2.0, transparent: true, opacity: 0.8 });
    const neonPurple = new THREE.MeshStandardMaterial({ color: 0x9900ff, emissive: 0x9900ff, emissiveIntensity: 1.5 });
    const plasmaBlue = new THREE.MeshStandardMaterial({ color: 0x0088ff, emissive: 0x0044ff, emissiveIntensity: 3.0, wireframe: true });

    // 1. Base Mount
    const baseGeo = new THREE.CylinderGeometry(2.5, 3, 1, 32);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.position.set(0, -3, 0);
    group.add(baseMesh);
    parts.push({
        name: "Titanium Base Mount",
        description: "The primary structural anchor connecting the actuator to the user's skeletal frame.",
        material: "Dark Steel / Titanium",
        function: "Absorbs mechanical shock and provides a stable foundation for the joint.",
        assemblyOrder: 1,
        connections: ["Neural Casing", "Actuator Pistons"],
        failureEffect: "Structural instability leading to catastrophic joint dislocation.",
        cascadeFailures: ["Actuator Pistons", "Energy Conduits"],
        originalPosition: { x: 0, y: -3, z: 0 },
        explodedPosition: { x: 0, y: -8, z: 0 },
        mesh: baseMesh
    });

    // 2. Rotor Assembly
    const rotorGeo = new THREE.TorusGeometry(1.8, 0.4, 16, 64);
    const rotorMesh = new THREE.Mesh(rotorGeo, chrome);
    rotorMesh.rotation.x = Math.PI / 2;
    rotorMesh.position.set(0, -1, 0);
    group.add(rotorMesh);
    parts.push({
        name: "Primary Rotor Assembly",
        description: "A high-torque rotating magnetic assembly that converts neural impulses into physical movement.",
        material: "Chrome / Neodymium",
        function: "Drives the main rotational movement of the exoskeleton joint.",
        assemblyOrder: 2,
        connections: ["Titanium Base Mount", "Neuromuscular Plasma Core"],
        failureEffect: "Loss of rotational mobility and joint lock-up.",
        cascadeFailures: ["Synthetic Muscle Fibers", "Cooling Fans"],
        originalPosition: { x: 0, y: -1, z: 0 },
        explodedPosition: { x: 0, y: -4, z: 0 },
        mesh: rotorMesh
    });

    // 3. Neuromuscular Plasma Core
    const coreGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const coreMesh = new THREE.Mesh(coreGeo, neonCyan);
    coreMesh.position.set(0, 0, 0);
    group.add(coreMesh);
    parts.push({
        name: "Neuromuscular Plasma Core",
        description: "The heart of the actuator, utilizing ionized plasma to amplify bio-electric signals.",
        material: "Plasma / Glass",
        function: "Provides the immense power required for superhuman strength amplification.",
        assemblyOrder: 3,
        connections: ["Primary Rotor Assembly", "Neural Interface Nodes"],
        failureEffect: "Complete loss of power and severe burns from plasma leakage.",
        cascadeFailures: ["All systems"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 5 },
        mesh: coreMesh
    });

    // 4. Synthetic Muscle Fibers
    const muscleGeo = new THREE.CylinderGeometry(0.2, 0.2, 4, 16);
    const fibersGroup = new THREE.Group();
    for (let i = 0; i < 6; i++) {
        const fiber = new THREE.Mesh(muscleGeo, neonRed);
        const angle = (i / 6) * Math.PI * 2;
        fiber.position.set(Math.cos(angle) * 1.5, 0, Math.sin(angle) * 1.5);
        fibersGroup.add(fiber);
    }
    group.add(fibersGroup);
    parts.push({
        name: "Electro-Reactive Synthetic Muscle",
        description: "Artificial muscle fibers that contract and expand in response to electrical stimuli.",
        material: "Electro-Reactive Polymer",
        function: "Mimics human muscle movement with 10x the tensile strength.",
        assemblyOrder: 4,
        connections: ["Neuromuscular Plasma Core", "Upper Carbon Casing"],
        failureEffect: "Sluggish movement and significant loss of strength.",
        cascadeFailures: ["Actuator Pistons"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 5, y: 0, z: 0 },
        mesh: fibersGroup
    });

    // 5. Actuator Pistons
    const pistonGeo = new THREE.CylinderGeometry(0.3, 0.3, 3, 16);
    const pistonsGroup = new THREE.Group();
    for (let i = 0; i < 4; i++) {
        const piston = new THREE.Mesh(pistonGeo, steel);
        const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
        piston.position.set(Math.cos(angle) * 2, 1.5, Math.sin(angle) * 2);
        piston.rotation.x = Math.PI / 8;
        piston.userData = { initialY: piston.position.y };
        pistonsGroup.add(piston);
    }
    group.add(pistonsGroup);
    parts.push({
        name: "Hydraulic Support Pistons",
        description: "Heavy-duty steel pistons providing secondary load-bearing support.",
        material: "High-Carbon Steel",
        function: "Assists the synthetic muscles in lifting extreme weights.",
        assemblyOrder: 5,
        connections: ["Titanium Base Mount", "Upper Carbon Casing"],
        failureEffect: "Inability to hold heavy loads, potential structural collapse.",
        cascadeFailures: ["Titanium Base Mount"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -5, y: 2, z: 0 },
        mesh: pistonsGroup
    });

    // 6. Neural Interface Nodes
    const nodeGeo = new THREE.DodecahedronGeometry(0.4, 0);
    const nodesGroup = new THREE.Group();
    for (let i = 0; i < 8; i++) {
        const node = new THREE.Mesh(nodeGeo, plasmaBlue);
        const angle = (i / 8) * Math.PI * 2;
        node.position.set(Math.cos(angle) * 2.5, 0, Math.sin(angle) * 2.5);
        nodesGroup.add(node);
    }
    group.add(nodesGroup);
    parts.push({
        name: "Neural Interface Nodes",
        description: "Direct link between the user's nervous system and the exoskeleton.",
        material: "Crystalline Superconductor",
        function: "Reads bio-electric signals for zero-latency movement execution.",
        assemblyOrder: 6,
        connections: ["Neuromuscular Plasma Core", "Energy Conduits"],
        failureEffect: "Input lag or spontaneous, uncontrolled movements.",
        cascadeFailures: ["Primary Rotor Assembly"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -5 },
        mesh: nodesGroup
    });

    // 7. Upper Carbon Casing
    const casingGeo = new THREE.CylinderGeometry(2.2, 2.5, 2, 32);
    const casingMesh = new THREE.Mesh(casingGeo, darkSteel);
    casingMesh.position.set(0, 3, 0);
    group.add(casingMesh);
    parts.push({
        name: "Upper Carbon Casing",
        description: "Impact-resistant armored shell protecting the delicate internal components.",
        material: "Carbon-Nanotube Matrix",
        function: "Deflects kinetic impacts and shields against electromagnetic interference.",
        assemblyOrder: 7,
        connections: ["Synthetic Muscle Fibers", "Hydraulic Support Pistons"],
        failureEffect: "Exposure of sensitive internals to environmental damage.",
        cascadeFailures: ["Neuromuscular Plasma Core", "Neural Interface Nodes"],
        originalPosition: { x: 0, y: 3, z: 0 },
        explodedPosition: { x: 0, y: 8, z: 0 },
        mesh: casingMesh
    });

    // 8. Magnetic Field Rings
    const ringGeo = new THREE.TorusGeometry(3.0, 0.1, 16, 100);
    const ringsGroup = new THREE.Group();
    for(let i=0; i<3; i++) {
        const ring = new THREE.Mesh(ringGeo, neonPurple);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = -1.5 + i * 1.5;
        ringsGroup.add(ring);
    }
    group.add(ringsGroup);
    parts.push({
        name: "Containment Field Rings",
        description: "Generates a localized magnetic field to stabilize the plasma core.",
        material: "Superconducting Electromagnets",
        function: "Prevents the plasma from expanding and melting the actuator.",
        assemblyOrder: 8,
        connections: ["Neuromuscular Plasma Core"],
        failureEffect: "Core meltdown and catastrophic explosion.",
        cascadeFailures: ["Everything"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 5 },
        mesh: ringsGroup
    });

    const description = "The Bionic Exoskeleton Joint (Neuromuscular Actuator) is a cutting-edge cybernetic enhancement designed to seamlessly integrate with human neurology. It amplifies strength by orders of magnitude using a localized plasma core, electro-reactive synthetic muscles, and high-torque magnetic rotors. It responds with zero latency, reading bio-electric signals directly via crystalline superconducting nodes.";

    const quizQuestions = [
        {
            question: "Which component is responsible for zero-latency movement execution?",
            options: ["Titanium Base Mount", "Neural Interface Nodes", "Hydraulic Support Pistons", "Containment Field Rings"],
            correct: 1,
            explanation: "The Neural Interface Nodes read bio-electric signals directly from the user's nervous system, allowing for instantaneous, zero-latency movement.",
            difficulty: "Medium"
        },
        {
            question: "What stabilizes the Neuromuscular Plasma Core to prevent a meltdown?",
            options: ["Upper Carbon Casing", "Synthetic Muscle Fibers", "Containment Field Rings", "Cooling Fans"],
            correct: 2,
            explanation: "The Containment Field Rings generate a strong magnetic field that confines the highly energetic plasma, preventing it from melting the surrounding components.",
            difficulty: "Easy"
        },
        {
            question: "What occurs if the Primary Rotor Assembly fails?",
            options: ["The user gains faster reflexes", "Loss of rotational mobility and joint lock-up", "The plasma core immediately explodes", "The system switches to manual override"],
            correct: 1,
            explanation: "Failure of the Primary Rotor Assembly leads to a loss of rotational mobility, causing the entire joint to lock up and become immobile.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Rotate the main rotor
        const rotor = parts.find(p => p.name === "Primary Rotor Assembly")?.mesh;
        if (rotor) rotor.rotation.z = time * speed * 2;

        // Pulse the plasma core
        const core = parts.find(p => p.name === "Neuromuscular Plasma Core")?.mesh;
        if (core) {
            core.scale.setScalar(1 + Math.sin(time * speed * 5) * 0.05);
            core.material.emissiveIntensity = 2.0 + Math.sin(time * speed * 5) * 1.5;
            core.rotation.y = time * speed;
            core.rotation.x = time * speed * 0.5;
        }

        // Flex the synthetic muscle fibers
        const muscles = parts.find(p => p.name === "Electro-Reactive Synthetic Muscle")?.mesh;
        if (muscles) {
            muscles.children.forEach((fiber, i) => {
                fiber.scale.y = 1 + Math.sin(time * speed * 3 + i) * 0.2;
                fiber.scale.x = 1 - Math.sin(time * speed * 3 + i) * 0.1;
                fiber.scale.z = 1 - Math.sin(time * speed * 3 + i) * 0.1;
            });
        }

        // Pump the hydraulic pistons
        const pistons = parts.find(p => p.name === "Hydraulic Support Pistons")?.mesh;
        if (pistons) {
            pistons.children.forEach((piston, i) => {
                piston.position.y = piston.userData.initialY + Math.sin(time * speed * 2 + i * Math.PI / 2) * 0.5;
            });
        }

        // Spin and pulsate the Neural Interface Nodes
        const nodes = parts.find(p => p.name === "Neural Interface Nodes")?.mesh;
        if (nodes) {
            nodes.rotation.y = -time * speed * 1.5;
            nodes.children.forEach((node, i) => {
                node.rotation.x = time * speed * 2 + i;
                node.rotation.y = time * speed * 2 + i;
                node.material.emissiveIntensity = 1.0 + Math.sin(time * speed * 10 + i) * 2.0;
            });
        }

        // Counter-rotate the Containment Field Rings
        const rings = parts.find(p => p.name === "Containment Field Rings")?.mesh;
        if (rings) {
            rings.children.forEach((ring, i) => {
                ring.rotation.z = time * speed * (i % 2 === 0 ? 1 : -1) * (1 + i * 0.5);
                ring.scale.setScalar(1 + Math.sin(time * speed * 4 + i) * 0.02);
            });
        }
    }

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}
