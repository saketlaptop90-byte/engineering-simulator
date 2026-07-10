import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Glowing/Neon Materials
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00d4ff,
        emissive: 0x00d4ff,
        emissiveIntensity: 0.8,
        roughness: 0.2,
        metalness: 0.8
    });

    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff003c,
        emissive: 0xff003c,
        emissiveIntensity: 0.8,
        roughness: 0.2,
        metalness: 0.8
    });

    // 1. Microphone Body (Handle)
    const bodyGeometry = new THREE.CylinderGeometry(0.8, 1.2, 8, 32);
    const bodyMesh = new THREE.Mesh(bodyGeometry, darkSteel);
    bodyMesh.position.set(0, -2, 0);
    group.add(bodyMesh);

    parts.push({
        name: "Microphone Body",
        description: "The main handle and casing of the microphone, housing the internal components and providing a grip.",
        material: "Dark Steel",
        function: "Structural support and electromagnetic shielding.",
        assemblyOrder: 1,
        connections: ["XLR Connector", "Magnet System", "Switch"],
        failureEffect: "Exposure of internal components, potential signal interference.",
        cascadeFailures: ["Signal Degradation", "Physical Damage to Coil"],
        originalPosition: { x: 0, y: -2, z: 0 },
        explodedPosition: { x: 0, y: -8, z: 0 },
        mesh: bodyMesh
    });

    // 2. Grille (Windscreen)
    const grilleGeometry = new THREE.SphereGeometry(2, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const grilleMaterial = new THREE.MeshStandardMaterial({
        color: 0x888888,
        wireframe: true,
        roughness: 0.4,
        metalness: 0.9
    });
    const grilleMesh = new THREE.Mesh(grilleGeometry, grilleMaterial);
    grilleMesh.position.set(0, 2, 0);
    group.add(grilleMesh);

    const grilleRingGeometry = new THREE.TorusGeometry(2, 0.1, 16, 32);
    const grilleRingMesh = new THREE.Mesh(grilleRingGeometry, chrome);
    grilleRingMesh.rotation.x = Math.PI / 2;
    grilleRingMesh.position.set(0, 2, 0);
    group.add(grilleRingMesh);
    
    const grilleGroup = new THREE.Group();
    grilleGroup.add(grilleMesh);
    grilleGroup.add(grilleRingMesh);

    parts.push({
        name: "Mesh Grille",
        description: "A wire mesh protecting the delicate diaphragm and coil from physical damage and plosive sounds.",
        material: "Chrome Wire",
        function: "Acoustic filtering and physical protection.",
        assemblyOrder: 5,
        connections: ["Microphone Body", "Acoustic Foam"],
        failureEffect: "Increased popping sounds, potential damage to the diaphragm.",
        cascadeFailures: ["Diaphragm Rupture"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 8, z: 0 },
        mesh: grilleGroup
    });

    // 3. Diaphragm
    const diaphragmGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.05, 32);
    const diaphragmMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.6,
        roughness: 0.8
    });
    const diaphragmMesh = new THREE.Mesh(diaphragmGeometry, diaphragmMaterial);
    diaphragmMesh.position.set(0, 1.8, 0);
    group.add(diaphragmMesh);

    parts.push({
        name: "Diaphragm",
        description: "A thin membrane that vibrates in response to sound waves.",
        material: "Mylar / Plastic",
        function: "Converts acoustic energy into mechanical energy.",
        assemblyOrder: 4,
        connections: ["Voice Coil"],
        failureEffect: "Complete loss of audio signal or severe distortion.",
        cascadeFailures: ["Voice Coil Misalignment"],
        originalPosition: { x: 0, y: 1.8, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 },
        mesh: diaphragmMesh
    });

    // 4. Voice Coil
    const coilGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.5, 32);
    const coilMaterial = new THREE.MeshStandardMaterial({
        color: 0xb87333,
        roughness: 0.6,
        metalness: 1.0,
        map: null // Would ideally have a wound wire texture
    });
    const coilMesh = new THREE.Mesh(coilGeometry, copper);
    coilMesh.position.set(0, 1.5, 0);
    group.add(coilMesh);

    parts.push({
        name: "Voice Coil",
        description: "A coil of fine wire attached to the diaphragm, suspended within a magnetic field.",
        material: "Copper",
        function: "Moves within the magnetic field to generate an electrical signal via electromagnetic induction.",
        assemblyOrder: 3,
        connections: ["Diaphragm", "Magnet System", "Wiring"],
        failureEffect: "No electrical signal generated.",
        cascadeFailures: ["Open Circuit"],
        originalPosition: { x: 0, y: 1.5, z: 0 },
        explodedPosition: { x: 0, y: 3, z: 0 },
        mesh: coilMesh
    });

    // 5. Magnet System
    const magnetGeometry = new THREE.CylinderGeometry(1.2, 1.2, 1.5, 32);
    const magnetMesh = new THREE.Mesh(magnetGeometry, steel);
    magnetMesh.position.set(0, 0.5, 0);
    group.add(magnetMesh);
    
    // Core of magnet
    const coreGeometry = new THREE.CylinderGeometry(0.6, 0.6, 1.6, 32);
    const coreMesh = new THREE.Mesh(coreGeometry, darkSteel);
    coreMesh.position.set(0, 0.5, 0);
    group.add(coreMesh);
    
    const magnetGroup = new THREE.Group();
    magnetGroup.add(magnetMesh);
    magnetGroup.add(coreMesh);

    parts.push({
        name: "Magnet System",
        description: "A strong permanent magnet (often Neodymium) that creates a concentrated magnetic field.",
        material: "Steel / Neodymium",
        function: "Provides the magnetic field necessary for electromagnetic induction.",
        assemblyOrder: 2,
        connections: ["Voice Coil", "Microphone Body"],
        failureEffect: "Weak or no signal generation.",
        cascadeFailures: ["Demagnetization (rare)"],
        originalPosition: { x: 0, y: 0.5, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 },
        mesh: magnetGroup
    });

    // 6. XLR Connector
    const xlrGroup = new THREE.Group();
    const xlrBodyGeometry = new THREE.CylinderGeometry(0.8, 0.8, 1, 32);
    const xlrBodyMesh = new THREE.Mesh(xlrBodyGeometry, chrome);
    xlrBodyMesh.position.set(0, -6.5, 0);
    xlrGroup.add(xlrBodyMesh);

    for (let i = 0; i < 3; i++) {
        const pinGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.4, 16);
        const pinMesh = new THREE.Mesh(pinGeometry, copper);
        const angle = (i * Math.PI * 2) / 3;
        pinMesh.position.set(Math.cos(angle) * 0.3, -7, Math.sin(angle) * 0.3);
        xlrGroup.add(pinMesh);
    }
    group.add(xlrGroup);

    parts.push({
        name: "XLR Connector",
        description: "A three-pin connector for outputting the balanced audio signal.",
        material: "Chrome / Copper",
        function: "Provides a secure, balanced electrical connection to a preamp or mixer.",
        assemblyOrder: 0,
        connections: ["Microphone Body", "Internal Wiring"],
        failureEffect: "Intermittent or dropped audio signal, ground loops.",
        cascadeFailures: ["Signal Loss"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -12, z: 0 },
        mesh: xlrGroup
    });

    // 7. On/Off Switch (with Neon Glow)
    const switchGeometry = new THREE.BoxGeometry(0.6, 1.2, 0.2);
    const switchMesh = new THREE.Mesh(switchGeometry, plastic);
    switchMesh.position.set(0, -3, 1.1);
    
    const switchIndicatorGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.25);
    const switchIndicatorMesh = new THREE.Mesh(switchIndicatorGeometry, neonBlue);
    switchIndicatorMesh.position.set(0, -2.7, 1.1);
    
    const switchGroup = new THREE.Group();
    switchGroup.add(switchMesh);
    switchGroup.add(switchIndicatorMesh);
    group.add(switchGroup);

    parts.push({
        name: "Power/Mute Switch",
        description: "A physical toggle switch to mute the microphone's output.",
        material: "Plastic / Neon",
        function: "Shorts the audio signal to ground to mute output.",
        assemblyOrder: 1,
        connections: ["Microphone Body", "Internal Wiring"],
        failureEffect: "Inability to mute, or permanent mute.",
        cascadeFailures: ["Switch Contact Oxidation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -4, z: 4 },
        mesh: switchGroup
    });

    const description = "A Dynamic Microphone uses electromagnetic induction to convert sound waves into electrical signals. It consists of a diaphragm attached to a small coil of wire (voice coil) suspended in the magnetic field of a permanent magnet. Sound waves hitting the diaphragm cause the coil to move, inducing a current.";

    const quizQuestions = [
        {
            question: "What physical principle does a dynamic microphone use to generate an electrical signal?",
            options: [
                "Piezoelectric effect",
                "Capacitance variation",
                "Electromagnetic induction",
                "Optical interference"
            ],
            correct: 2,
            explanation: "Dynamic microphones generate a signal through electromagnetic induction, where the movement of the voice coil within a magnetic field induces an electrical current.",
            difficulty: "Medium"
        },
        {
            question: "Which component of the dynamic microphone vibrates directly in response to sound waves?",
            options: [
                "The Voice Coil",
                "The Diaphragm",
                "The Magnet",
                "The XLR Connector"
            ],
            correct: 1,
            explanation: "The diaphragm is a thin membrane that catches acoustic energy (sound waves) and vibrates, subsequently moving the attached voice coil.",
            difficulty: "Easy"
        },
        {
            question: "Why do dynamic microphones typically not require phantom power (+48V)?",
            options: [
                "They use internal batteries.",
                "They are passive devices that generate their own current.",
                "They draw power directly from the acoustic energy.",
                "They use optical cables."
            ],
            correct: 1,
            explanation: "Dynamic microphones are passive transducers; the movement of the coil in the magnetic field generates enough electrical current to produce a signal without needing external power.",
            difficulty: "Medium"
        },
        {
             question: "What is the function of the mesh grille?",
             options: [
                 "To amplify the sound",
                 "To provide a magnetic field",
                 "To protect internal components and act as a pop filter",
                 "To connect to the XLR cable"
             ],
             correct: 2,
             explanation: "The grille protects the delicate diaphragm and coil from physical damage and helps diffuse plosive sounds (like 'P' and 'B' consonants).",
             difficulty: "Easy"
        }
    ];

    // Animation state
    let timeOffset = 0;

    function animate(time, speed, meshes) {
        timeOffset += speed * 0.05;

        // Simulate sound waves hitting diaphragm and coil moving
        const amplitude = 0.05 * Math.sin(timeOffset * 10);
        
        const diaphragmPart = parts.find(p => p.name === "Diaphragm");
        const coilPart = parts.find(p => p.name === "Voice Coil");
        
        if (diaphragmPart && diaphragmPart.mesh && diaphragmPart.mesh.position.y === diaphragmPart.originalPosition.y) {
            diaphragmPart.mesh.position.y = diaphragmPart.originalPosition.y + amplitude;
        }
        
        if (coilPart && coilPart.mesh && coilPart.mesh.position.y === coilPart.originalPosition.y) {
            coilPart.mesh.position.y = coilPart.originalPosition.y + amplitude;
        }
        
        // Pulse the neon switch based on speed
        if (switchIndicatorMesh) {
             const pulse = Math.sin(timeOffset * 5) * 0.5 + 0.5;
             switchIndicatorMesh.material.emissiveIntensity = 0.5 + pulse * 0.8 * speed;
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

// Auto-generated missing stub
export function createDynamicMicrophone() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
