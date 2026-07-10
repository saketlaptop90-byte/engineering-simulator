import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const grilleMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x888888,
        metalness: 0.9,
        roughness: 0.2,
        wireframe: true, // Simulate mesh
        clearcoat: 0.5,
    });
    
    const diaphragmMaterial = new THREE.MeshStandardMaterial({
        color: 0xe0e0e0,
        metalness: 0.1,
        roughness: 0.8,
    });
    
    const glowingBlue = new THREE.MeshStandardMaterial({
        color: 0x00aaff,
        emissive: 0x0055ff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8
    });
    
    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        metalness: 0.6,
        roughness: 0.4
    });

    // 1. Grille
    const grilleGeo = new THREE.SphereGeometry(1.5, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const grilleMesh = new THREE.Mesh(grilleGeo, grilleMaterial);
    grilleMesh.position.set(0, 3, 0);
    group.add(grilleMesh);
    parts.push({
        name: "Protective Grille",
        mesh: grilleMesh,
        description: "A metal mesh that protects the delicate internal capsule while allowing sound waves to pass through.",
        material: "Steel Mesh",
        function: "Physical protection and pop filtering.",
        assemblyOrder: 9,
        connections: ["Microphone Body", "Internal Windscreen"],
        failureEffect: "Capsule becomes vulnerable to physical damage and plosive sounds.",
        cascadeFailures: ["Diaphragm damage"],
        originalPosition: {x: 0, y: 3, z: 0},
        explodedPosition: {x: 0, y: 6, z: 0}
    });

    // 2. Internal Windscreen
    const windscreenGeo = new THREE.SphereGeometry(1.3, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const windscreenMesh = new THREE.Mesh(windscreenGeo, rubber);
    windscreenMesh.position.set(0, 3, 0);
    group.add(windscreenMesh);
    parts.push({
        name: "Windscreen Foam",
        mesh: windscreenMesh,
        description: "An acoustic foam layer inside the grille to reduce wind noise and vocal plosives.",
        material: "Acoustic Foam",
        function: "Acoustic filtering of harsh low-frequency air blasts.",
        assemblyOrder: 8,
        connections: ["Protective Grille"],
        failureEffect: "Increased susceptibility to wind noise and popping sounds.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 3, z: 0},
        explodedPosition: {x: 0, y: 5.5, z: 0}
    });

    // 3. Diaphragm Capsule
    const diaphragmGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.1, 32);
    const diaphragmMesh = new THREE.Mesh(diaphragmGeo, diaphragmMaterial);
    diaphragmMesh.position.set(0, 2.5, 0);
    group.add(diaphragmMesh);
    parts.push({
        name: "Diaphragm",
        mesh: diaphragmMesh,
        description: "A very thin membrane that vibrates in response to sound waves.",
        material: "Mylar / Gold-sputtered film",
        function: "Converts acoustic energy (sound waves) into mechanical energy (vibration).",
        assemblyOrder: 7,
        connections: ["Voice Coil", "Capsule Housing"],
        failureEffect: "Microphone stops picking up sound completely or sounds highly distorted.",
        cascadeFailures: ["Voice coil unseated"],
        originalPosition: {x: 0, y: 2.5, z: 0},
        explodedPosition: {x: 0, y: 4, z: 0}
    });

    // 4. Voice Coil
    const coilGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.6, 32, 1, true);
    const coilMaterial = new THREE.MeshStandardMaterial({
        color: 0xc87b3e,
        metalness: 0.8,
        roughness: 0.4,
        side: THREE.DoubleSide
    });
    const coilMesh = new THREE.Mesh(coilGeo, coilMaterial);
    coilMesh.position.set(0, 2.2, 0);
    group.add(coilMesh);
    parts.push({
        name: "Voice Coil",
        mesh: coilMesh,
        description: "A coil of fine wire attached to the diaphragm, suspended within a magnetic field.",
        material: "Copper Wire",
        function: "Moves within the magnetic field to generate an electrical signal via electromagnetic induction.",
        assemblyOrder: 6,
        connections: ["Diaphragm", "Magnet Assembly"],
        failureEffect: "No electrical signal generated.",
        cascadeFailures: ["Loss of audio output"],
        originalPosition: {x: 0, y: 2.2, z: 0},
        explodedPosition: {x: 0, y: 3.5, z: 0}
    });

    // 5. Magnet Assembly
    const ringMagnetGeo = new THREE.TorusGeometry(0.6, 0.15, 16, 32);
    const magnetMesh = new THREE.Mesh(ringMagnetGeo, darkSteel);
    magnetMesh.rotation.x = Math.PI / 2;
    magnetMesh.position.set(0, 2.2, 0);
    group.add(magnetMesh);
    parts.push({
        name: "Magnet",
        mesh: magnetMesh,
        description: "A permanent magnet creating a concentrated magnetic field around the voice coil.",
        material: "Neodymium / Alnico",
        function: "Provides the constant magnetic field necessary for electromagnetic induction.",
        assemblyOrder: 5,
        connections: ["Capsule Housing"],
        failureEffect: "Drastic drop in output level or complete failure.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 2.2, z: 0},
        explodedPosition: {x: 0, y: 2.5, z: 0}
    });

    // 6. Preamp Circuit / Transformer
    const circuitGeo = new THREE.BoxGeometry(0.6, 1.5, 0.1);
    const circuitMesh = new THREE.Mesh(circuitGeo, glowingBlue);
    circuitMesh.position.set(0, 0.5, 0);
    group.add(circuitMesh);
    parts.push({
        name: "Internal Circuitry & Transformer",
        mesh: circuitMesh,
        description: "Electronic components that condition the signal, match impedance, and sometimes amplify it.",
        material: "PCB & Electronic Components",
        function: "Optimizes the weak electrical signal from the voice coil for transmission over a cable.",
        assemblyOrder: 4,
        connections: ["Voice Coil", "XLR Connector"],
        failureEffect: "Distortion, noise, or no output.",
        cascadeFailures: ["Signal grounding issues"],
        originalPosition: {x: 0, y: 0.5, z: 0},
        explodedPosition: {x: -2, y: 0.5, z: 0}
    });

    // 7. Microphone Body
    const bodyGeo = new THREE.CylinderGeometry(1.0, 0.8, 4, 32);
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMaterial);
    bodyMesh.position.set(0, 0.5, 0);
    group.add(bodyMesh);
    parts.push({
        name: "Microphone Body",
        mesh: bodyMesh,
        description: "The main structural housing of the microphone that the user holds.",
        material: "Die-cast Zinc / Aluminum",
        function: "Houses internal components, provides structural integrity, and acts as a Faraday cage to block RF interference.",
        assemblyOrder: 3,
        connections: ["Capsule Housing", "XLR Connector"],
        failureEffect: "Internal components exposed, increased RF noise.",
        cascadeFailures: ["Physical damage to internals"],
        originalPosition: {x: 0, y: 0.5, z: 0},
        explodedPosition: {x: 3, y: 0.5, z: 0}
    });

    // 8. XLR Connector
    const xlrGroup = new THREE.Group();
    const xlrBaseGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.5, 32);
    const xlrBaseMesh = new THREE.Mesh(xlrBaseGeo, plastic);
    xlrBaseMesh.position.set(0, -1.75, 0);
    xlrGroup.add(xlrBaseMesh);
    
    const pinGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.4, 16);
    for (let i = 0; i < 3; i++) {
        const pinMesh = new THREE.Mesh(pinGeo, chrome);
        const angle = (i / 3) * Math.PI * 2;
        pinMesh.position.set(Math.cos(angle) * 0.3, -2.0, Math.sin(angle) * 0.3);
        xlrGroup.add(pinMesh);
    }
    group.add(xlrGroup);
    parts.push({
        name: "XLR Connector",
        mesh: xlrGroup,
        description: "A 3-pin connector used for balanced audio signals.",
        material: "Plastic & Gold-plated pins",
        function: "Provides a reliable, locking electrical connection to transmit the balanced audio signal to a mixer or interface.",
        assemblyOrder: 2,
        connections: ["Microphone Body", "Internal Circuitry"],
        failureEffect: "Intermittent audio, crackling, or complete loss of signal.",
        cascadeFailures: ["Short circuiting"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -2, z: 0}
    });

    const description = "A high-fidelity dynamic microphone that converts acoustic sound waves into electrical signals through electromagnetic induction. Sound waves hit the diaphragm, which moves a voice coil suspended in a magnetic field, generating an audio signal.";

    const quizQuestions = [
        {
            question: "What physical principle allows a dynamic microphone to convert sound into an electrical signal?",
            options: [
                "Piezoelectric effect",
                "Electromagnetic induction",
                "Capacitance variation",
                "Photoelectric effect"
            ],
            correct: 1,
            explanation: "Dynamic microphones use electromagnetic induction: sound waves move a diaphragm attached to a voice coil, which moves within a magnetic field to induce an electrical current.",
            difficulty: "Medium"
        },
        {
            question: "Which component is primarily responsible for blocking wind noise and harsh 'P' and 'B' consonant sounds?",
            options: [
                "Voice Coil",
                "XLR Connector",
                "Magnet",
                "Internal Windscreen & Grille"
            ],
            correct: 3,
            explanation: "The grille and internal foam windscreen diffuse the blast of air associated with plosives and wind, preventing them from violently striking the diaphragm.",
            difficulty: "Easy"
        },
        {
            question: "What is the function of the Magnet in a dynamic microphone?",
            options: [
                "To attract the microphone stand",
                "To provide the constant magnetic field for the voice coil",
                "To amplify the audio signal",
                "To filter out high frequencies"
            ],
            correct: 1,
            explanation: "The permanent magnet creates a concentrated, steady magnetic field. Without this field, the movement of the voice coil would not induce any electrical current.",
            difficulty: "Medium"
        },
        {
            question: "Why do most professional microphones use an XLR connector instead of a standard headphone jack?",
            options: [
                "It looks cooler",
                "It is completely waterproof",
                "It carries a balanced signal which rejects electromagnetic noise",
                "It transmits data wirelessly"
            ],
            correct: 2,
            explanation: "XLR connectors carry balanced audio signals, utilizing two signal wires with reversed polarity to cancel out noise and interference picked up along the cable run.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Animation logic based on sound wave hitting the diaphragm
        const audioFrequency = time * 10 * speed;
        
        // Diaphragm and voice coil vibrate
        const vibration = Math.sin(audioFrequency) * 0.05;
        
        const diaphragm = parts.find(p => p.name === "Diaphragm");
        const voiceCoil = parts.find(p => p.name === "Voice Coil");
        const circuit = parts.find(p => p.name === "Internal Circuitry & Transformer");
        
        if (diaphragm && voiceCoil) {
            // Only apply vibration if in assembled state
            if (diaphragm.mesh.position.x === diaphragm.originalPosition.x) {
                diaphragm.mesh.position.y = diaphragm.originalPosition.y + vibration;
            }
            if (voiceCoil.mesh.position.x === voiceCoil.originalPosition.x) {
                voiceCoil.mesh.position.y = voiceCoil.originalPosition.y + vibration;
            }
        }

        // Circuit glow pulsates
        if (circuit && circuit.mesh.material.emissiveIntensity !== undefined) {
            const glowIntensity = (Math.sin(audioFrequency) + 1.0) * 0.75;
            circuit.mesh.material.emissiveIntensity = glowIntensity;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createMicrophone() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
