import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Glowing Materials
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x0088ff,
        emissiveIntensity: 1.5,
        metalness: 0.8,
        roughness: 0.2
    });

    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 2.0,
        metalness: 0.5,
        roughness: 0.2
    });

    // 1. Main Wing Section (Static)
    const wingGeo = new THREE.BoxGeometry(10, 2, 20);
    const wingMesh = new THREE.Mesh(wingGeo, aluminum);
    wingMesh.position.set(0, 0, 0);
    group.add(wingMesh);

    parts.push({
        name: "Main Wing Section",
        description: "The primary load-bearing structure of the wing trailing edge.",
        material: "Aluminum",
        function: "Provides support for the flap track mechanism.",
        assemblyOrder: 1,
        connections: ["Flap Track Fairing", "Main Track Beam"],
        failureEffect: "Catastrophic loss of structural integrity.",
        cascadeFailures: ["Flap Track Mechanism", "Hydraulic Actuators"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 10, z: 0 },
        mesh: wingMesh
    });

    // 2. Flap Track Fairing
    const fairingGeo = new THREE.CylinderGeometry(1, 1.5, 8, 32);
    fairingGeo.rotateX(Math.PI / 2);
    const fairingMesh = new THREE.Mesh(fairingGeo, plastic);
    fairingMesh.position.set(-2, -2, -4);
    group.add(fairingMesh);

    parts.push({
        name: "Flap Track Fairing",
        description: "Aerodynamic cover for the flap extension mechanism.",
        material: "Composite Plastic",
        function: "Reduces parasitic drag caused by the exposed flap track.",
        assemblyOrder: 2,
        connections: ["Main Wing Section", "Main Track Beam"],
        failureEffect: "Increased drag and fuel consumption.",
        cascadeFailures: [],
        originalPosition: { x: -2, y: -2, z: -4 },
        explodedPosition: { x: -2, y: -10, z: -4 },
        mesh: fairingMesh
    });

    // 3. Main Track Beam
    const trackBeamGeo = new THREE.BoxGeometry(1, 0.5, 6);
    const trackBeamMesh = new THREE.Mesh(trackBeamGeo, steel);
    trackBeamMesh.position.set(-2, -1, -5);
    group.add(trackBeamMesh);

    parts.push({
        name: "Main Track Beam",
        description: "Curved steel beam guiding the flap extension.",
        material: "Steel",
        function: "Guides the flap carriage during deployment.",
        assemblyOrder: 3,
        connections: ["Main Wing Section", "Flap Carriage"],
        failureEffect: "Inability to deploy or retract flaps.",
        cascadeFailures: ["Flap Carriage", "Actuator"],
        originalPosition: { x: -2, y: -1, z: -5 },
        explodedPosition: { x: -5, y: -1, z: -5 },
        mesh: trackBeamMesh
    });

    // 4. Flap Carriage (Moves along track)
    const carriageGeo = new THREE.BoxGeometry(1.2, 0.8, 1.5);
    const carriageMesh = new THREE.Mesh(carriageGeo, darkSteel);
    carriageMesh.position.set(-2, -1, -3);
    group.add(carriageMesh);

    parts.push({
        name: "Flap Carriage",
        description: "Rolls along the track beam to translate the flap.",
        material: "Dark Steel",
        function: "Transmits actuator force to move the flap along the track.",
        assemblyOrder: 4,
        connections: ["Main Track Beam", "Fowler Flap", "Actuator Linkage"],
        failureEffect: "Asymmetric flap deployment (split flap).",
        cascadeFailures: ["Fowler Flap Surface", "Aircraft Control Loss"],
        originalPosition: { x: -2, y: -1, z: -3 },
        explodedPosition: { x: -2, y: -1, z: -8 },
        mesh: carriageMesh
    });

    // 5. Fowler Flap Surface
    const flapGeo = new THREE.BoxGeometry(4, 0.5, 8);
    const flapMesh = new THREE.Mesh(flapGeo, aluminum);
    flapMesh.position.set(-2, -1.2, -3); // Initial retracted position
    group.add(flapMesh);

    parts.push({
        name: "Fowler Flap Surface",
        description: "Aft-moving and downward-deflecting high-lift device.",
        material: "Aluminum",
        function: "Increases wing surface area and camber for low-speed flight.",
        assemblyOrder: 5,
        connections: ["Flap Carriage"],
        failureEffect: "Loss of lift, higher stall speed.",
        cascadeFailures: [],
        originalPosition: { x: -2, y: -1.2, z: -3 },
        explodedPosition: { x: -2, y: -5, z: 0 },
        mesh: flapMesh
    });

    // 6. Hydraulic Actuator Linkage
    const linkageGeo = new THREE.CylinderGeometry(0.2, 0.2, 4);
    linkageGeo.rotateX(Math.PI / 2);
    const linkageMesh = new THREE.Mesh(linkageGeo, chrome);
    linkageMesh.position.set(-2, -0.5, -2);
    group.add(linkageMesh);

    parts.push({
        name: "Hydraulic Actuator Linkage",
        description: "Piston connecting hydraulic power to the flap carriage.",
        material: "Chrome/Steel",
        function: "Provides the mechanical force to move the carriage.",
        assemblyOrder: 6,
        connections: ["Flap Carriage", "Hydraulic System"],
        failureEffect: "Flaps stuck in current position.",
        cascadeFailures: [],
        originalPosition: { x: -2, y: -0.5, z: -2 },
        explodedPosition: { x: -2, y: 5, z: -2 },
        mesh: linkageMesh
    });

    // 7. Limit Sensors (Glowing)
    const sensorGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const sensorMesh1 = new THREE.Mesh(sensorGeo, neonBlue);
    sensorMesh1.position.set(-2, -0.7, -2);
    group.add(sensorMesh1);
    
    const sensorMesh2 = new THREE.Mesh(sensorGeo, neonRed);
    sensorMesh2.position.set(-2, -0.7, -7);
    group.add(sensorMesh2);

    parts.push({
        name: "Deployment Sensors",
        description: "Electronic sensors detecting flap position limits.",
        material: "Neon Indicator",
        function: "Feeds back flap position to the flight control computers.",
        assemblyOrder: 7,
        connections: ["Main Track Beam", "Avionics"],
        failureEffect: "Flap asymmetry warning or over-extension.",
        cascadeFailures: ["Flight Control System Logic"],
        originalPosition: { x: -2, y: -0.7, z: -4.5 }, // approximate mid
        explodedPosition: { x: -8, y: -0.7, z: -4.5 },
        mesh: sensorMesh1 // bind to one for explode logic
    });

    const description = "The Aero Flap Track Mechanism is a critical flight control system used to deploy Fowler flaps. By translating aft and deflecting downward, it increases both wing area and camber, providing substantial lift augmentation for takeoff and landing phases.";

    const quizQuestions = [
        {
            question: "What is the primary function of a Fowler flap mechanism?",
            options: [
                "To increase only the angle of attack",
                "To increase only the wing camber",
                "To increase both wing surface area and camber",
                "To act as an airbrake during cruise"
            ],
            correct: 2,
            explanation: "Fowler flaps move aft (increasing area) and deflect downwards (increasing camber), making them highly effective high-lift devices.",
            difficulty: "Medium"
        },
        {
            question: "What aerodynamic purpose does the Flap Track Fairing serve?",
            options: [
                "It houses extra fuel",
                "It reduces parasitic drag from the track mechanism",
                "It generates additional lift",
                "It cools the hydraulic actuators"
            ],
            correct: 1,
            explanation: "The fairings (often called 'canoes') streamline the bulky flap track mechanisms to minimize aerodynamic drag.",
            difficulty: "Easy"
        },
        {
            question: "If the flap carriage jams on one wing but not the other, what critical condition occurs?",
            options: [
                "Symmetric stall",
                "Split flap (Asymmetric deployment)",
                "Mach tuck",
                "Dutch roll"
            ],
            correct: 1,
            explanation: "A 'split flap' condition causes severe asymmetric lift, leading to uncontrolled rolling moments that can be catastrophic.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // time goes from 0 upwards.
        // We will cycle flap deployment using a sine wave.
        const cycle = (Math.sin(time * speed * 2) + 1) / 2; // 0 to 1

        // Maximum extension values
        const maxZ = -4; // moves aft
        const maxRotX = -Math.PI / 6; // rotates down (30 degrees)

        // Find relevant meshes (indexes based on parts push order)
        // 3: Carriage, 4: Flap, 5: Linkage
        if (meshes[3] && meshes[4] && meshes[5]) {
            // Carriage moves aft along Z, and slightly down along Y (simulating curved track)
            meshes[3].position.z = -3 - (cycle * maxZ);
            meshes[3].position.y = -1 - (cycle * 0.5);
            meshes[3].rotation.x = cycle * maxRotX * 0.5;

            // Flap moves with carriage and rotates further
            meshes[4].position.z = -3 - (cycle * maxZ * 1.1);
            meshes[4].position.y = -1.2 - (cycle * 0.8);
            meshes[4].rotation.x = cycle * maxRotX;

            // Linkage piston extends (scale Z and translate)
            meshes[5].scale.z = 1 + (cycle * 1.5);
            meshes[5].position.z = -2 - (cycle * maxZ * 0.5);
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createAirplaneFlapTrack() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
