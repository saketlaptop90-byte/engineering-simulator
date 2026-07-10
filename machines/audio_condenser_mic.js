import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const goldPlated = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 1.0,
        roughness: 0.2,
    });

    const glowingDiaphragm = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 0.8,
        roughness: 0.2,
        emissive: 0xffaa00,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.9,
    });

    const activeCapacitor = new THREE.MeshStandardMaterial({
        color: 0x00ffcc,
        metalness: 0.8,
        roughness: 0.2,
        emissive: 0x00ffaa,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.8,
    });

    const neonWire = new THREE.MeshStandardMaterial({
        color: 0xff0055,
        metalness: 0.5,
        roughness: 0.5,
        emissive: 0xff0055,
        emissiveIntensity: 1.5,
    });

    // 1. Microphone Body / Casing
    const casingGeo = new THREE.CylinderGeometry(1.5, 1.5, 8, 32);
    const casingMesh = new THREE.Mesh(casingGeo, darkSteel);
    group.add(casingMesh);
    parts.push({
        name: 'Microphone Housing',
        description: 'The robust outer casing that protects internal components and provides electromagnetic shielding.',
        material: 'darkSteel',
        function: 'Electromagnetic shielding and physical protection.',
        assemblyOrder: 1,
        connections: ['XLR Connector', 'Grille', 'Circuit Board'],
        failureEffect: 'Increased susceptibility to RF interference and physical damage to internal parts.',
        cascadeFailures: ['Circuit Board short-circuit'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -5, y: 0, z: 0 },
        mesh: casingMesh
    });

    // 2. Grille
    const grilleGeo = new THREE.SphereGeometry(1.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const grilleMesh = new THREE.Mesh(grilleGeo, chrome);
    grilleMesh.position.y = 4;
    group.add(grilleMesh);
    parts.push({
        name: 'Wire Mesh Grille',
        description: 'A durable metallic mesh acting as a pop filter and physical barrier.',
        material: 'chrome',
        function: 'Diffuses plosives and protects the delicate capsule from moisture and impacts.',
        assemblyOrder: 2,
        connections: ['Microphone Housing', 'Capsule Assembly'],
        failureEffect: 'Plosive distortion and capsule contamination.',
        cascadeFailures: ['Diaphragm degradation'],
        originalPosition: { x: 0, y: 4, z: 0 },
        explodedPosition: { x: 0, y: 8, z: 0 },
        mesh: grilleMesh
    });

    // 3. Capsule - Backplate
    const backplateGeo = new THREE.CylinderGeometry(1.0, 1.0, 0.2, 32);
    const backplateMesh = new THREE.Mesh(backplateGeo, goldPlated);
    backplateMesh.position.y = 4.2;
    group.add(backplateMesh);
    parts.push({
        name: 'Fixed Backplate',
        description: 'A rigid, gold-sputtered brass plate forming one half of the capacitor.',
        material: 'goldPlated',
        function: 'Maintains a fixed charge against the movable diaphragm to create capacitance.',
        assemblyOrder: 3,
        connections: ['Capsule Mount', 'Circuit Board'],
        failureEffect: 'Loss of capacitance, resulting in low or no output signal.',
        cascadeFailures: ['Signal drop'],
        originalPosition: { x: 0, y: 4.2, z: 0 },
        explodedPosition: { x: 5, y: 5, z: 0 },
        mesh: backplateMesh
    });

    // 4. Capsule - Diaphragm
    const diaphragmGeo = new THREE.CylinderGeometry(1.0, 1.0, 0.05, 32);
    const diaphragmMesh = new THREE.Mesh(diaphragmGeo, glowingDiaphragm);
    diaphragmMesh.position.y = 4.4;
    group.add(diaphragmMesh);
    parts.push({
        name: 'Gold-Sputtered Diaphragm',
        description: 'An ultra-thin (usually Mylar) membrane coated in gold to be conductive.',
        material: 'glowingDiaphragm',
        function: 'Vibrates in response to sound waves, changing the distance to the backplate and altering capacitance.',
        assemblyOrder: 4,
        connections: ['Fixed Backplate', 'Capsule Mount'],
        failureEffect: 'Muffled sound, loss of high frequencies, or total failure.',
        cascadeFailures: ['Distorted output'],
        originalPosition: { x: 0, y: 4.4, z: 0 },
        explodedPosition: { x: 5, y: 7, z: 0 },
        mesh: diaphragmMesh
    });

    // 5. Active Circuit Board (Preamp)
    const pcbGeo = new THREE.BoxGeometry(0.5, 4, 1.5);
    const pcbMesh = new THREE.Mesh(pcbGeo, activeCapacitor);
    pcbMesh.position.y = 0;
    group.add(pcbMesh);
    parts.push({
        name: 'Internal Preamp (PCB)',
        description: 'Houses the impedance converter (JFET) and output transformer or active balanced circuit.',
        material: 'activeCapacitor',
        function: 'Converts the ultra-high impedance of the capsule to a usable low-impedance audio signal.',
        assemblyOrder: 5,
        connections: ['Capsule Assembly', 'XLR Connector'],
        failureEffect: 'No output, high noise floor, or severe distortion.',
        cascadeFailures: ['Complete system failure'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 5 },
        mesh: pcbMesh
    });

    // 6. XLR Connector Base
    const xlrGeo = new THREE.CylinderGeometry(1.4, 1.4, 1, 32);
    const xlrMesh = new THREE.Mesh(xlrGeo, steel);
    xlrMesh.position.y = -3.5;
    group.add(xlrMesh);
    parts.push({
        name: 'XLR Output Connector',
        description: 'Standard 3-pin audio connector for balanced audio and 48V phantom power delivery.',
        material: 'steel',
        function: 'Outputs the audio signal and inputs phantom power for the capsule and preamp.',
        assemblyOrder: 6,
        connections: ['Internal Preamp (PCB)', 'Microphone Housing'],
        failureEffect: 'Intermittent connection, loss of phantom power, or missing signal.',
        cascadeFailures: ['No audio transmission'],
        originalPosition: { x: 0, y: -3.5, z: 0 },
        explodedPosition: { x: 0, y: -6, z: 0 },
        mesh: xlrMesh
    });

    // 7. Internal Wiring
    const wireGeo = new THREE.CylinderGeometry(0.05, 0.05, 3, 8);
    const wireMesh = new THREE.Mesh(wireGeo, neonWire);
    wireMesh.position.y = 2;
    wireMesh.position.x = 0.5;
    group.add(wireMesh);
    parts.push({
        name: 'Signal Wiring',
        description: 'High-quality copper wiring carrying signal and voltage between components.',
        material: 'neonWire',
        function: 'Transfers phantom power to the capsule and audio signal to the output.',
        assemblyOrder: 7,
        connections: ['Capsule Assembly', 'Internal Preamp (PCB)'],
        failureEffect: 'Loss of signal or increased noise.',
        cascadeFailures: [],
        originalPosition: { x: 0.5, y: 2, z: 0 },
        explodedPosition: { x: 3, y: 2, z: 2 },
        mesh: wireMesh
    });


    const description = "An Audio Condenser Microphone uses electrostatic technology. A thin, conductive diaphragm is placed close to a solid metal backplate, forming a capacitor. Sound waves cause the diaphragm to vibrate, changing the distance between the plates and varying the capacitance. This variation is converted into an electrical audio signal by an internal preamp, powered by 48V phantom power.";

    const quizQuestions = [
        {
            question: "What is the primary function of the 48V phantom power in a condenser microphone?",
            options: [
                "To power the LED lights",
                "To charge the capacitor (diaphragm and backplate) and power the internal preamp",
                "To cool down the internal transformer",
                "To convert analog signals to digital"
            ],
            correct: 1,
            explanation: "Phantom power provides the polarization voltage needed for the capacitor capsule (if not electret) and supplies power to the active internal impedance-matching preamplifier.",
            difficulty: "Medium"
        },
        {
            question: "How does a condenser capsule translate sound waves into electrical signals?",
            options: [
                "By moving a coil of wire over a magnet",
                "By vibrating a piezoelectric crystal",
                "By changing the capacitance as the diaphragm moves closer to and further from the backplate",
                "By measuring the temperature changes in the air"
            ],
            correct: 2,
            explanation: "The diaphragm and backplate act as a capacitor. Sound waves move the diaphragm, changing the distance between them, which alters the capacitance and generates a voltage change.",
            difficulty: "Medium"
        },
        {
            question: "What component is necessary in a condenser mic to match the ultra-high impedance of the capsule to standard audio equipment?",
            options: [
                "The wire mesh grille",
                "The internal preamp (often a JFET)",
                "The XLR connector pins",
                "The gold-sputtered coating"
            ],
            correct: 1,
            explanation: "The capsule has an extremely high output impedance. The internal preamp acts as an impedance converter, stepping it down so the signal can travel down an XLR cable without massive signal loss.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Animate the diaphragm to simulate sound waves
        const diaphragm = parts.find(p => p.name === 'Gold-Sputtered Diaphragm');
        if (diaphragm && diaphragm.mesh) {
            diaphragm.mesh.scale.y = 1 + Math.sin(time * speed * 10) * 0.1;
            diaphragm.mesh.material.emissiveIntensity = 0.5 + Math.sin(time * speed * 10) * 0.3;
        }

        // Animate the preamp circuit to show signal processing
        const pcb = parts.find(p => p.name === 'Internal Preamp (PCB)');
        if (pcb && pcb.mesh) {
            pcb.mesh.material.emissiveIntensity = 0.5 + Math.sin(time * speed * 5 + Math.PI) * 0.5;
        }

        // Flowing energy in the wires
        const wire = parts.find(p => p.name === 'Signal Wiring');
        if (wire && wire.mesh) {
             wire.mesh.material.emissiveIntensity = 0.5 + Math.sin(time * speed * 15) * 1.5;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createCondenserMic() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
