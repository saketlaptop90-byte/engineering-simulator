import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const glowingBlue = new THREE.MeshPhysicalMaterial({
        color: 0x0088ff, emissive: 0x0044ff, emissiveIntensity: 2,
        transparent: true, opacity: 0.8
    });

    const casingGeo = new THREE.BoxGeometry(2, 2, 2);
    const casingMesh = new THREE.Mesh(casingGeo, plastic);
    casingMesh.position.set(0, 1, 0);
    group.add(casingMesh);
    parts.push({
        name: "Plastic Housing",
        description: "Outer protective shell.",
        material: "Polycarbonate Plastic",
        function: "Insulates the user from high voltages and protects internal electronics.",
        assemblyOrder: 1,
        connections: ["Transformer", "Prongs"],
        failureEffect: "Shock hazard.",
        cascadeFailures: ["Short circuit"],
        originalPosition: {x:0, y:1, z:0},
        explodedPosition: {x:0, y:5, z:0}
    });

    const transformerGeo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const transformerMesh = new THREE.Mesh(transformerGeo, copper);
    transformerMesh.position.set(0, 1, 0);
    group.add(transformerMesh);
    parts.push({
        name: "High-Frequency Transformer",
        description: "Switch-mode power supply transformer.",
        material: "Copper Windings / Ferrite Core",
        function: "Steps down high-voltage AC to low-voltage AC at high frequencies.",
        assemblyOrder: 2,
        connections: ["Rectifier Circuit", "Housing"],
        failureEffect: "No power conversion.",
        cascadeFailures: ["Overheating", "Exploding capacitors"],
        originalPosition: {x:0, y:1, z:0},
        explodedPosition: {x:0, y:1, z:4}
    });

    const cableGeo = new THREE.CylinderGeometry(0.1, 0.1, 5, 16);
    const cableMesh = new THREE.Mesh(cableGeo, rubber);
    cableMesh.rotation.z = Math.PI / 2;
    cableMesh.position.set(3.5, 1, 0);
    group.add(cableMesh);
    parts.push({
        name: "USB Charging Cable",
        description: "Insulated copper wire delivering 5V DC.",
        material: "Rubber / Copper",
        function: "Transmits the converted DC power to the device.",
        assemblyOrder: 3,
        connections: ["Transformer"],
        failureEffect: "Frayed wire.",
        cascadeFailures: ["Intermittent charging", "Fire risk"],
        originalPosition: {x:3.5, y:1, z:0},
        explodedPosition: {x:5, y:1, z:0}
    });

    const energyGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const energyMesh = new THREE.Mesh(energyGeo, glowingBlue);
    energyMesh.position.set(2, 1, 0);
    group.add(energyMesh);
    parts.push({
        name: "DC Power Packet",
        description: "Visual representation of Direct Current energy.",
        material: "Glowing Blue Energy",
        function: "Charges the battery.",
        assemblyOrder: 4,
        connections: ["Cable"],
        failureEffect: "Voltage drop.",
        cascadeFailures: [],
        originalPosition: {x:2, y:1, z:0},
        explodedPosition: {x:2, y:1, z:0}
    });

    const description = "Switch-Mode Power Charger: A modern smartphone charger that rapidly switches AC voltage on and off at high frequencies to efficiently step it down to 5V DC using a much smaller transformer than older linear power supplies.";

    const quizQuestions = [
        {
            question: "Why are modern phone chargers so small compared to older, bulky power adapters?",
            options: ["They use Switch-Mode Power Supply (SMPS) technology to operate at high frequencies, requiring smaller transformers", "They don't use transformers anymore", "Phones require less power now", "They use wireless charging internally"],
            correct: 0,
            explanation: "By switching the AC current at tens of thousands of times per second (SMPS), the magnetic components (transformers/inductors) can be drastically smaller and lighter.",
            difficulty: "Medium"
        },
        {
            question: "What is the function of the rectifier in a charger?",
            options: ["To convert Alternating Current (AC) to Direct Current (DC)", "To step down the voltage", "To cool the device", "To act as a fuse"],
            correct: 0,
            explanation: "A rectifier circuit (usually a diode bridge) forces the alternating current to flow in only one direction, creating direct current (DC).",
            difficulty: "Easy"
        },
        {
            question: "What component smooths out the 'ripples' in the DC voltage after rectification?",
            options: ["Capacitor", "Transistor", "Resistor", "Inductor"],
            correct: 0,
            explanation: "Filter capacitors act like tiny batteries, storing energy during the voltage peaks and releasing it during the dips, creating a smooth, flat DC output.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Move energy packet along the cable
        if (meshes[3]) {
            meshes[3].position.x = 1 + ((time * speed * 4) % 5);
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createCharger() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
