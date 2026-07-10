import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Custom High-Tech Materials
    const glowingBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
        roughness: 0.1,
        metalness: 0.8
    });

    const glowingRed = new THREE.MeshStandardMaterial({
        color: 0xff0033,
        emissive: 0xff0033,
        emissiveIntensity: 0.8,
        roughness: 0.2,
        metalness: 0.5
    });

    const carbonFiber = new THREE.MeshStandardMaterial({
        color: 0x222222,
        roughness: 0.6,
        metalness: 0.4
    });

    // 1. Mounting Base
    const baseGeo = new THREE.CylinderGeometry(1.5, 1.8, 0.5, 32);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.position.set(0, 0.25, 0);
    group.add(baseMesh);
    parts.push({
        name: "Mounting Base",
        description: "Heavy steel base for securing the anemometer to a stable structure.",
        material: "Dark Steel",
        function: "Provides a stable foundation and houses the primary data transmission lines.",
        assemblyOrder: 1,
        connections: ["Main Shaft"],
        failureEffect: "Complete structural failure leading to equipment loss.",
        cascadeFailures: ["Main Shaft", "Rotor Assembly"],
        originalPosition: {x: 0, y: 0.25, z: 0},
        explodedPosition: {x: 0, y: -2, z: 0}
    });

    // 2. Main Shaft
    const shaftGeo = new THREE.CylinderGeometry(0.3, 0.4, 4, 32);
    const shaftMesh = new THREE.Mesh(shaftGeo, carbonFiber);
    shaftMesh.position.set(0, 2.5, 0);
    group.add(shaftMesh);
    parts.push({
        name: "Main Shaft",
        description: "Aerodynamic vertical support column made of carbon fiber.",
        material: "Carbon Fiber",
        function: "Supports the rotor assembly and houses wiring.",
        assemblyOrder: 2,
        connections: ["Mounting Base", "Telemetry Ring", "Rotor Hub"],
        failureEffect: "Loss of support for sensing instruments.",
        cascadeFailures: ["Rotor Hub", "Cup Arms"],
        originalPosition: {x: 0, y: 2.5, z: 0},
        explodedPosition: {x: 0, y: 2.5, z: -3}
    });
    
    // 3. Telemetry Ring
    const transmitterGeo = new THREE.TorusGeometry(0.5, 0.1, 16, 32);
    const transmitterMesh = new THREE.Mesh(transmitterGeo, glowingBlue);
    transmitterMesh.position.set(0, 2.0, 0);
    transmitterMesh.rotation.x = Math.PI / 2;
    group.add(transmitterMesh);
    parts.push({
        name: "Telemetry Ring",
        description: "Glowing optical transmitter ring.",
        material: "Glowing Blue",
        function: "Transmits real-time wind speed data to weather stations.",
        assemblyOrder: 3,
        connections: ["Main Shaft"],
        failureEffect: "Loss of data transmission.",
        cascadeFailures: ["Weather Station Array"],
        originalPosition: {x: 0, y: 2.0, z: 0},
        explodedPosition: {x: 0, y: 2.0, z: 3}
    });

    // 4. Rotor Hub
    const hubGeo = new THREE.SphereGeometry(0.6, 32, 32);
    const hubMesh = new THREE.Mesh(hubGeo, chrome);
    hubMesh.position.set(0, 4.5, 0);
    group.add(hubMesh);
    parts.push({
        name: "Rotor Hub",
        description: "Central rotating component with frictionless magnetic bearings.",
        material: "Chrome",
        function: "Connects cup arms and transfers rotational energy to the optical encoder.",
        assemblyOrder: 4,
        connections: ["Main Shaft", "Cup Assembly"],
        failureEffect: "Rotation seizes, preventing wind speed measurement.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 4.5, z: 0},
        explodedPosition: {x: 0, y: 7, z: 0}
    });

    // 5. Cup Assembly (Arms + Cups grouped)
    const cupGroup = new THREE.Group();
    cupGroup.position.set(0, 4.5, 0);
    
    const armGeo = new THREE.CylinderGeometry(0.05, 0.05, 2.5, 16);
    const cupGeo = new THREE.SphereGeometry(0.5, 32, 32, 0, Math.PI); // Half sphere
    
    const numArms = 3;
    for (let i = 0; i < numArms; i++) {
        const angle = (i / numArms) * Math.PI * 2;
        
        // Arm
        const armMesh = new THREE.Mesh(armGeo, steel);
        armMesh.rotation.z = Math.PI / 2;
        armMesh.rotation.y = angle;
        armMesh.position.set(Math.cos(angle) * 1.25, 0, Math.sin(angle) * 1.25);
        cupGroup.add(armMesh);
        
        // Cup
        const cupMesh = new THREE.Mesh(cupGeo, glowingRed);
        cupMesh.position.set(Math.cos(angle) * 2.5, 0, Math.sin(angle) * 2.5);
        cupMesh.rotation.y = angle + Math.PI / 2;
        cupGroup.add(cupMesh);
    }
    group.add(cupGroup);
    
    parts.push({
        name: "Cup Assembly",
        description: "Three hemispherical cups attached to radial arms.",
        material: "Steel & Glowing Red Composite",
        function: "Catches the wind to induce rotation proportional to wind speed.",
        assemblyOrder: 5,
        connections: ["Rotor Hub"],
        failureEffect: "Underestimation of wind speed or unbalanced rotation.",
        cascadeFailures: ["Rotor Hub bearing wear"],
        originalPosition: {x: 0, y: 4.5, z: 0},
        explodedPosition: {x: 3, y: 4.5, z: 0}
    });

    const description = "A high-precision Atmospheric Anemometer used for accurately measuring wind speed in harsh environments. Features a frictionless magnetic bearing system and glowing optical telemetry for high-tech data transmission.";

    const quizQuestions = [
        {
            question: "Why do most modern anemometers use three cups instead of four?",
            options: [
                "To reduce manufacturing costs",
                "Three cups provide a more constant torque throughout the rotation",
                "Four cups would create too much aerodynamic drag",
                "It is purely an aesthetic choice"
            ],
            correct: 1,
            explanation: "A three-cup design ensures that one cup is always catching the wind optimally, resulting in a more constant and smooth torque compared to a four-cup design, which can have dead spots.",
            difficulty: "Medium"
        },
        {
            question: "What is the primary function of the telemetry ring in this model?",
            options: [
                "To illuminate the anemometer at night",
                "To heat the shaft and prevent icing",
                "To transmit real-time wind speed data to weather stations",
                "To provide structural support to the main shaft"
            ],
            correct: 2,
            explanation: "The telemetry ring handles the wireless optical transmission of the rotation data.",
            difficulty: "Easy"
        },
        {
            question: "How does the cup assembly measure wind speed?",
            options: [
                "By measuring the temperature change of the cups",
                "By rotating at a speed proportional to the wind speed",
                "By measuring the air pressure inside the cups",
                "By changing the color of the cups based on wind intensity"
            ],
            correct: 1,
            explanation: "The cups catch the wind, causing the assembly to rotate. The rate of rotation is directly proportional to the wind speed.",
            difficulty: "Easy"
        }
    ];

    const animate = (time, speed, meshes) => {
        // meshes contains the root group at [0] if parsed, but typically the meshes are passed directly or retrieved via group.children
        // In this architecture, it's safer to access via group.children
        const ring = group.children[2];
        const hub = group.children[3];
        const cupGrp = group.children[4];
        
        // Base rotation on wind speed
        const rotationSpeed = speed * 0.1;
        
        if (cupGrp) {
            cupGrp.rotation.y -= rotationSpeed;
        }
        if (hub) {
            hub.rotation.y -= rotationSpeed;
        }
        if (ring) {
            // Pulse effect for the telemetry ring
            const glowIntensity = Math.sin(time * 3) * 0.3 + 0.7;
            if (ring.material && ring.material.emissiveIntensity !== undefined) {
                ring.material.emissiveIntensity = glowIntensity;
            }
        }
    };

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createAnemometerArray() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
