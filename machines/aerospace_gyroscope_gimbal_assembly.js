import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const glowBlue = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 0.8,
        metalness: 0.2,
        roughness: 0.2
    });

    const glowRed = new THREE.MeshStandardMaterial({
        color: 0xff0033,
        emissive: 0xff0033,
        emissiveIntensity: 0.8,
        metalness: 0.2,
        roughness: 0.2
    });

    const glowGreen = new THREE.MeshStandardMaterial({
        color: 0x00ff44,
        emissive: 0x00ff44,
        emissiveIntensity: 0.8,
        metalness: 0.2,
        roughness: 0.2
    });

    const ultraChrome = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 1.0,
        roughness: 0.05,
        envMapIntensity: 2.0
    });

    // 1. Base / Pedestal
    const baseGeo = new THREE.CylinderGeometry(3, 3.5, 1, 32);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.position.y = 0.5;
    group.add(baseMesh);

    parts.push({
        name: "Mounting Base",
        description: "Secures the entire gyroscope assembly to the spacecraft or aircraft chassis, dampening initial vibrations.",
        material: "Dark Steel",
        function: "Structural support and vibration isolation.",
        assemblyOrder: 1,
        connections: ["Outer Gimbal Frame"],
        failureEffect: "Complete loss of structural integrity.",
        cascadeFailures: ["Outer Gimbal Frame", "Sensor Misalignment"],
        originalPosition: { x: 0, y: 0.5, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 },
        mesh: baseMesh
    });

    // Outer Support Pillars
    const pillarGeo = new THREE.CylinderGeometry(0.3, 0.3, 4, 16);
    const pillar1 = new THREE.Mesh(pillarGeo, steel);
    pillar1.position.set(-2.5, 3, 0);
    group.add(pillar1);
    
    const pillar2 = new THREE.Mesh(pillarGeo, steel);
    pillar2.position.set(2.5, 3, 0);
    group.add(pillar2);

    // 2. Outer Gimbal Frame (Yaw)
    const outerGimbalGroup = new THREE.Group();
    outerGimbalGroup.position.set(0, 5, 0);
    
    const outerGeo = new THREE.TorusGeometry(3.2, 0.2, 16, 64);
    const outerMesh = new THREE.Mesh(outerGeo, ultraChrome);
    outerGimbalGroup.add(outerMesh);
    group.add(outerGimbalGroup);

    // Outer Pivot Pins
    const outerPinGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.8, 16);
    outerPinGeo.rotateZ(Math.PI / 2);
    const outerPin1 = new THREE.Mesh(outerPinGeo, glowBlue);
    outerPin1.position.set(-3.2, 0, 0);
    outerGimbalGroup.add(outerPin1);
    
    const outerPin2 = new THREE.Mesh(outerPinGeo, glowBlue);
    outerPin2.position.set(3.2, 0, 0);
    outerGimbalGroup.add(outerPin2);

    parts.push({
        name: "Outer Gimbal (Yaw Axis)",
        description: "Provides the first degree of rotational freedom, allowing the system to isolate the rotor from external yaw movements.",
        material: "Ultra Chrome",
        function: "First axis of isolation.",
        assemblyOrder: 2,
        connections: ["Mounting Base", "Middle Gimbal Frame"],
        failureEffect: "Loss of yaw isolation.",
        cascadeFailures: ["Navigation Drift", "Middle Gimbal Binding"],
        originalPosition: { x: 0, y: 5, z: 0 },
        explodedPosition: { x: 0, y: 12, z: 0 },
        mesh: outerMesh,
        parentGroup: outerGimbalGroup
    });

    // 3. Middle Gimbal Frame (Pitch)
    const middleGimbalGroup = new THREE.Group();
    outerGimbalGroup.add(middleGimbalGroup);

    const middleGeo = new THREE.TorusGeometry(2.6, 0.18, 16, 64);
    const middleMesh = new THREE.Mesh(middleGeo, aluminum);
    middleMesh.rotation.y = Math.PI / 2; // Perpendicular to outer
    middleGimbalGroup.add(middleMesh);

    // Middle Pivot Pins
    const middlePinGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.6, 16);
    middlePinGeo.rotateX(Math.PI / 2);
    const middlePin1 = new THREE.Mesh(middlePinGeo, glowRed);
    middlePin1.position.set(0, 2.6, 0);
    middleGimbalGroup.add(middlePin1);

    const middlePin2 = new THREE.Mesh(middlePinGeo, glowRed);
    middlePin2.position.set(0, -2.6, 0);
    middleGimbalGroup.add(middlePin2);

    parts.push({
        name: "Middle Gimbal (Pitch Axis)",
        description: "Provides the second degree of rotational freedom, isolating pitch movements. Perpendicular to the outer gimbal.",
        material: "Aerospace Aluminum",
        function: "Second axis of isolation.",
        assemblyOrder: 3,
        connections: ["Outer Gimbal Frame", "Inner Gimbal Frame"],
        failureEffect: "Loss of pitch isolation.",
        cascadeFailures: ["Gimbal Lock", "Rotor Instability"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 10, y: 0, z: 0 },
        mesh: middleMesh,
        parentGroup: middleGimbalGroup
    });

    // 4. Inner Gimbal Frame (Roll)
    const innerGimbalGroup = new THREE.Group();
    middleGimbalGroup.add(innerGimbalGroup);

    const innerGeo = new THREE.TorusGeometry(2.0, 0.15, 16, 64);
    const innerMesh = new THREE.Mesh(innerGeo, chrome);
    innerMesh.rotation.x = Math.PI / 2;
    innerGimbalGroup.add(innerMesh);

    // Inner Pivot Pins
    const innerPinGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 16);
    innerPinGeo.rotateZ(Math.PI / 2);
    const innerPin1 = new THREE.Mesh(innerPinGeo, glowGreen);
    innerPin1.position.set(0, 0, 2.0);
    innerGimbalGroup.add(innerPin1);

    const innerPin2 = new THREE.Mesh(innerPinGeo, glowGreen);
    innerPin2.position.set(0, 0, -2.0);
    innerGimbalGroup.add(innerPin2);

    parts.push({
        name: "Inner Gimbal (Roll Axis)",
        description: "The final gimbal layer providing roll isolation. Holds the high-speed rotor assembly.",
        material: "Chrome",
        function: "Third axis of isolation, housing the rotor.",
        assemblyOrder: 4,
        connections: ["Middle Gimbal Frame", "Central Rotor"],
        failureEffect: "Direct transfer of roll forces to rotor.",
        cascadeFailures: ["Rotor Bearing Failure", "Total Navigational Failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -10, y: 0, z: 0 },
        mesh: innerMesh,
        parentGroup: innerGimbalGroup
    });

    // 5. Central High-Speed Rotor
    const rotorGroup = new THREE.Group();
    innerGimbalGroup.add(rotorGroup);

    const rotorCoreGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.8, 32);
    const rotorCoreMesh = new THREE.Mesh(rotorCoreGeo, copper);
    rotorGroup.add(rotorCoreMesh);

    const rotorRingGeo = new THREE.TorusGeometry(1.4, 0.3, 16, 64);
    const rotorRingMesh = new THREE.Mesh(rotorRingGeo, darkSteel);
    rotorRingMesh.rotation.x = Math.PI / 2;
    rotorGroup.add(rotorRingMesh);

    parts.push({
        name: "Gyroscopic Rotor",
        description: "A heavy, high-speed spinning mass that maintains its orientation in space due to conservation of angular momentum.",
        material: "Copper/Steel Composite",
        function: "Provides the inertial reference frame.",
        assemblyOrder: 5,
        connections: ["Inner Gimbal Frame", "Rotor Bearings"],
        failureEffect: "Loss of gyroscopic rigidity.",
        cascadeFailures: ["Complete System Failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 10 },
        mesh: rotorCoreMesh, // Using core as primary representative mesh
        parentGroup: rotorGroup
    });

    const description = "An aerospace-grade, three-axis mechanical gyroscope gimbal assembly. This intricate device uses nested gimbals to isolate a high-speed spinning rotor from external rotations. The rotor's angular momentum keeps it rigidly oriented in space, while pick-off sensors on the gimbals measure the vehicle's pitch, roll, and yaw relative to this stable reference frame. Essential for inertial navigation systems in spacecraft, submarines, and aircraft.";

    const quizQuestions = [
        {
            question: "What physical principle allows the central rotor to maintain its orientation in space?",
            options: [
                "Conservation of energy",
                "Conservation of angular momentum",
                "Bernoulli's principle",
                "Magnetic levitation"
            ],
            correct: 1,
            explanation: "The conservation of angular momentum causes a spinning mass to resist changes to its axis of rotation, providing gyroscopic rigidity.",
            difficulty: "Medium"
        },
        {
            question: "What is 'Gimbal Lock' in a 3-axis system?",
            options: [
                "When the bearings seize up due to lack of lubrication",
                "When two gimbal axes align, losing one degree of rotational freedom",
                "A physical locking mechanism used during transport",
                "When the rotor spins too fast and causes a structural failure"
            ],
            correct: 1,
            explanation: "Gimbal lock occurs when the axes of two of the three gimbals are driven into a parallel configuration, resulting in a loss of one degree of freedom (the system can only rotate in two dimensions instead of three).",
            difficulty: "Hard"
        },
        {
            question: "Why are aerospace gimbals often mounted with three distinct frames (Outer, Middle, Inner)?",
            options: [
                "To increase the overall weight of the vehicle",
                "To provide cooling channels for the rotor",
                "To isolate the rotor from pitch, roll, and yaw movements independently",
                "To generate electricity through magnetic induction"
            ],
            correct: 2,
            explanation: "A three-axis gimbal system allows the vehicle to rotate freely in all three dimensions (pitch, roll, and yaw) without transferring that rotation to the inner central rotor.",
            difficulty: "Medium"
        }
    ];

    const animate = (time, speed, meshes) => {
        // Rotor spins extremely fast
        rotorGroup.rotation.y += 0.5 * speed;

        // Outer gimbal rotates slowly (simulating yaw)
        outerGimbalGroup.rotation.y = Math.sin(time * 0.5) * (Math.PI / 4) * speed;

        // Middle gimbal rotates (simulating pitch)
        middleGimbalGroup.rotation.x = Math.sin(time * 0.7) * (Math.PI / 3) * speed;

        // Inner gimbal rotates (simulating roll)
        innerGimbalGroup.rotation.z = Math.cos(time * 0.9) * (Math.PI / 6) * speed;
    };

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createGyroscopeGimbalAssembly() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
