import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom Materials
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
    });

    const neonPurple = new THREE.MeshStandardMaterial({
        color: 0x8a2be2,
        emissive: 0x8a2be2,
        emissiveIntensity: 0.6,
    });

    const energyCoreMat = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 1.0,
        wireframe: true,
    });
    
    // 1. Base Pedestal
    const baseGeo = new THREE.CylinderGeometry(5, 6, 2, 32);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.position.y = 1;
    group.add(baseMesh);
    meshes.base = baseMesh;
    parts.push({
        name: "Base Pedestal",
        description: "Heavy reinforced foundation absorbing micro-seismic vibrations.",
        material: "Dark Steel",
        function: "Provides absolute stability required for nanosecond precision timing.",
        assemblyOrder: 1,
        connections: ["Azimuth Drive"],
        failureEffect: "Dish swaying, complete loss of targeting.",
        cascadeFailures: ["Signal Processor", "Cryogenic Receiver"],
        originalPosition: {x: 0, y: 1, z: 0},
        explodedPosition: {x: 0, y: -2, z: 0}
    });

    // 2. Azimuth Drive
    const azimuthGeo = new THREE.CylinderGeometry(4, 4, 1.5, 32);
    const azimuthMesh = new THREE.Mesh(azimuthGeo, chrome);
    azimuthMesh.position.y = 2.75;
    group.add(azimuthMesh);
    meshes.azimuth = azimuthMesh;
    parts.push({
        name: "Azimuth Drive",
        description: "Superconducting magnetic levitation rotational drive.",
        material: "Chrome",
        function: "Rotates the dish horizontally with zero friction.",
        assemblyOrder: 2,
        connections: ["Base Pedestal", "Elevation Trunnion"],
        failureEffect: "Inability to track pulsars across the sky.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 2.75, z: 0},
        explodedPosition: {x: 0, y: 1, z: 5}
    });

    // 3. Elevation Trunnion
    const trunnionGeo = new THREE.BoxGeometry(3, 4, 3);
    const trunnionMesh = new THREE.Mesh(trunnionGeo, steel);
    trunnionMesh.position.y = 5.5;
    azimuthMesh.add(trunnionMesh); // Hierarchical
    meshes.trunnion = trunnionMesh;
    parts.push({
        name: "Elevation Trunnion",
        description: "Motorized pivot supporting the main reflector.",
        material: "Steel",
        function: "Adjusts the vertical altitude angle of the dish.",
        assemblyOrder: 3,
        connections: ["Azimuth Drive", "Main Reflector"],
        failureEffect: "Dish stuck at a fixed altitude.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 5.5, z: 0},
        explodedPosition: {x: 5, y: 5.5, z: 0}
    });

    // 4. Main Reflector (Dish)
    // We use a sphere segment for a parabolic look
    const dishGeo = new THREE.SphereGeometry(15, 64, 16, 0, Math.PI * 2, 0, Math.PI * 0.25);
    const dishMesh = new THREE.Mesh(dishGeo, aluminum);
    dishMesh.material.side = THREE.DoubleSide;
    dishMesh.rotation.x = -Math.PI / 2; // Point up
    dishMesh.position.y = 2; // Relative to trunnion
    trunnionMesh.add(dishMesh);
    meshes.dish = dishMesh;
    parts.push({
        name: "Main Reflector",
        description: "Massive parabolic surface composed of thousands of active aluminum panels.",
        material: "Aluminum",
        function: "Collects and focuses faint pulsar radio emissions.",
        assemblyOrder: 4,
        connections: ["Elevation Trunnion", "Support Struts"],
        failureEffect: "Drastic drop in signal-to-noise ratio.",
        cascadeFailures: ["Cryogenic Receiver"],
        originalPosition: {x: 0, y: 7.5, z: 0}, // World approx
        explodedPosition: {x: 0, y: 20, z: 0}
    });
    
    // Neon Ring on dish rim
    const ringGeo = new THREE.TorusGeometry(10.6, 0.2, 16, 64);
    const ringMesh = new THREE.Mesh(ringGeo, neonBlue);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = 15 * (1 - Math.cos(Math.PI * 0.25)); // Position at the rim
    dishMesh.add(ringMesh);

    // 5. Support Struts (Quadripod)
    const strutGeo = new THREE.CylinderGeometry(0.2, 0.2, 18);
    const strutsGroup = new THREE.Group();
    for(let i=0; i<4; i++) {
        const strut = new THREE.Mesh(strutGeo, steel);
        const angle = (i * Math.PI) / 2;
        const radius = 9;
        strut.position.set(Math.cos(angle)*radius, 5, Math.sin(angle)*radius);
        strut.lookAt(0, 14, 0); // Point towards receiver
        strut.rotateX(Math.PI/2);
        strutsGroup.add(strut);
    }
    dishMesh.add(strutsGroup);
    parts.push({
        name: "Quadripod Struts",
        description: "Rigid composite support legs.",
        material: "Steel",
        function: "Holds the secondary receiver precisely at the focal point.",
        assemblyOrder: 5,
        connections: ["Main Reflector", "Cryogenic Receiver"],
        failureEffect: "Receiver misalignment.",
        cascadeFailures: ["Cryogenic Receiver"],
        originalPosition: {x: 0, y: 12, z: 0},
        explodedPosition: {x: -10, y: 12, z: 0}
    });

    // 6. Cryogenic Receiver
    const receiverGeo = new THREE.CylinderGeometry(1, 1, 3, 16);
    const receiverMesh = new THREE.Mesh(receiverGeo, copper);
    receiverMesh.position.y = -10; // Focal point
    dishMesh.add(receiverMesh);
    meshes.receiver = receiverMesh;
    parts.push({
        name: "Cryogenic Receiver",
        description: "Ultra-low noise amplifier cooled to 4 Kelvin.",
        material: "Copper",
        function: "Amplifies collected radio waves while eliminating thermal noise.",
        assemblyOrder: 6,
        connections: ["Quadripod Struts", "Signal Processor"],
        failureEffect: "Total signal loss due to thermal noise drowning.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 17.5, z: 0},
        explodedPosition: {x: 0, y: 25, z: 0}
    });
    
    // Core inside receiver
    const coreGeo = new THREE.SphereGeometry(0.8, 16, 16);
    const coreMesh = new THREE.Mesh(coreGeo, energyCoreMat);
    receiverMesh.add(coreMesh);
    meshes.core = coreMesh;

    // 7. Atomic Clock Array
    const clockGeo = new THREE.BoxGeometry(2, 2, 2);
    const clockMesh = new THREE.Mesh(clockGeo, chrome);
    clockMesh.position.set(0, 0, 4);
    baseMesh.add(clockMesh);
    meshes.clock = clockMesh;
    
    const clockLightGeo = new THREE.BoxGeometry(1.8, 1.8, 2.1);
    const clockLightMesh = new THREE.Mesh(clockLightGeo, neonPurple);
    clockMesh.add(clockLightMesh);

    parts.push({
        name: "Hydrogen Maser Clock",
        description: "State-of-the-art atomic clock.",
        material: "Chrome / Neon Purple",
        function: "Time-stamps incoming pulsar pulses with nanosecond accuracy.",
        assemblyOrder: 7,
        connections: ["Base Pedestal", "Signal Processor"],
        failureEffect: "Inability to measure timing residuals.",
        cascadeFailures: ["Data Uplink"],
        originalPosition: {x: 0, y: 1, z: 4},
        explodedPosition: {x: 0, y: 1, z: 10}
    });

    const description = "The Pulsar Timing Array Dish is an ultra-sensitive radio telescope designed to monitor millisecond pulsars. By tracking the precise arrival times of pulsar signals, it acts as a galactic-scale gravitational wave detector.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Cryogenic Receiver?",
            options: [
                "To freeze water in the atmosphere.",
                "To amplify signals while eliminating thermal noise.",
                "To cool the massive motors of the Azimuth Drive.",
                "To generate magnetic levitation."
            ],
            correct: 1,
            explanation: "The receiver is cooled to 4 Kelvin to reduce thermal noise, allowing it to amplify extremely faint pulsar signals.",
            difficulty: "Medium"
        },
        {
            question: "Why is a Hydrogen Maser Clock essential for a Pulsar Timing Array?",
            options: [
                "It powers the dish.",
                "It is needed for nanosecond precision time-stamping of pulses.",
                "It calculates the gravitational wave signatures.",
                "It controls the rotation of the elevation trunnion."
            ],
            correct: 1,
            explanation: "Detecting gravitational waves via pulsars requires tracking their pulses with extreme timing precision, necessitating an atomic clock.",
            difficulty: "Hard"
        },
        {
            question: "What does the Main Reflector do?",
            options: [
                "Emits radio waves to pulsars.",
                "Collects and focuses faint pulsar radio emissions.",
                "Deflects space debris.",
                "Provides structural support to the base."
            ],
            correct: 1,
            explanation: "The parabolic dish acts as a giant bucket, collecting faint radio waves and focusing them onto the receiver.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, exploded) {
        if (!exploded) {
            // Normal operation animation
            
            // Dish slowly tracks the sky
            meshes.azimuth.rotation.y = time * 0.1 * speed;
            
            // Elevation slowly oscillates to simulate tracking
            meshes.trunnion.rotation.z = Math.sin(time * 0.05 * speed) * 0.2 + 0.1;
            
            // Receiver core pulses
            meshes.core.scale.setScalar(1 + Math.sin(time * 5 * speed) * 0.1);
            meshes.core.rotation.y = time * 2 * speed;
            meshes.core.rotation.x = time * 1.5 * speed;
            
            // Clock pulsing
            meshes.clock.scale.setScalar(1 + Math.sin(time * 10 * speed) * 0.02);
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createPulsarTimingArrayDish() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
