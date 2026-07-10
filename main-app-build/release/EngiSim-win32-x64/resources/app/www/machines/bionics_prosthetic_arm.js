import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const carbonFiber = new THREE.MeshStandardMaterial({ 
        color: 0x111111, 
        roughness: 0.8, 
        metalness: 0.2, 
        bumpScale: 0.02 
    });
    
    const glowingBlue = new THREE.MeshStandardMaterial({
        color: 0x00aaff,
        emissive: 0x00aaff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.9
    });

    const glowingRed = new THREE.MeshStandardMaterial({
        color: 0xff3300,
        emissive: 0xff1100,
        emissiveIntensity: 1.2
    });

    const softSilicone = new THREE.MeshStandardMaterial({
        color: 0xe8c39e, // skin tone approx or sleek gray
        roughness: 0.9,
        metalness: 0.1
    });

    // 1. Socket Interface (Attachment to residual limb)
    const socketGeo = new THREE.CylinderGeometry(0.8, 0.6, 2, 32);
    const socket = new THREE.Mesh(socketGeo, carbonFiber);
    socket.position.set(0, 4, 0);
    group.add(socket);
    
    parts.push({
        name: "Socket Interface",
        description: "Custom-molded carbon fiber socket that interfaces with the user's residual limb.",
        material: "Carbon Fiber",
        function: "Provides structural support and houses myoelectric sensors.",
        assemblyOrder: 1,
        connections: ["Myoelectric Sensors", "Elbow Joint"],
        failureEffect: "Disconnection from user, rendering arm unusable.",
        cascadeFailures: ["Entire System"],
        originalPosition: { x: 0, y: 4, z: 0 },
        explodedPosition: { x: 0, y: 6, z: 0 },
        mesh: socket
    });

    // 2. Myoelectric Sensor Array (Glowing ring)
    const sensorGeo = new THREE.TorusGeometry(0.82, 0.05, 16, 32);
    const sensorRing = new THREE.Mesh(sensorGeo, glowingBlue);
    sensorRing.position.set(0, 3.5, 0);
    sensorRing.rotation.x = Math.PI / 2;
    group.add(sensorRing);

    parts.push({
        name: "Myoelectric Sensor Array",
        description: "Array of surface electrodes that detect muscle action potentials.",
        material: "Conductive Polymer & Neon Accent",
        function: "Translates muscle signals into electrical control inputs.",
        assemblyOrder: 2,
        connections: ["Socket Interface", "Microcontroller"],
        failureEffect: "Loss of user control input.",
        cascadeFailures: ["Actuator Response"],
        originalPosition: { x: 0, y: 3.5, z: 0 },
        explodedPosition: { x: 0, y: 5.5, z: 0 },
        mesh: sensorRing
    });

    // 3. Elbow Joint Actuator
    const elbowGeo = new THREE.SphereGeometry(0.7, 32, 32);
    const elbow = new THREE.Mesh(elbowGeo, darkSteel);
    elbow.position.set(0, 2.5, 0);
    group.add(elbow);

    parts.push({
        name: "Elbow Joint Actuator",
        description: "High-torque motorized hinge joint.",
        material: "Dark Steel",
        function: "Provides flexion and extension of the forearm.",
        assemblyOrder: 3,
        connections: ["Socket Interface", "Forearm Chassis"],
        failureEffect: "Inability to bend the arm.",
        cascadeFailures: ["Lifting Capacity"],
        originalPosition: { x: 0, y: 2.5, z: 0 },
        explodedPosition: { x: -2, y: 2.5, z: 0 },
        mesh: elbow
    });

    // 4. Forearm Chassis
    const forearmGeo = new THREE.CylinderGeometry(0.5, 0.4, 2.5, 32);
    const forearm = new THREE.Mesh(forearmGeo, chrome);
    forearm.position.set(0, 0.8, 0);
    group.add(forearm);
    
    parts.push({
        name: "Forearm Chassis",
        description: "Titanium-reinforced casing housing the battery pack and microcontrollers.",
        material: "Chrome/Titanium",
        function: "Structural link between elbow and wrist, houses electronics.",
        assemblyOrder: 4,
        connections: ["Elbow Joint", "Wrist Rotator"],
        failureEffect: "Structural collapse or exposure of electronics.",
        cascadeFailures: ["Microcontroller", "Battery"],
        originalPosition: { x: 0, y: 0.8, z: 0 },
        explodedPosition: { x: 0, y: 0.8, z: 2 },
        mesh: forearm
    });

    // 5. Battery & Processing Core (Inside Forearm, visible glowing parts)
    const coreGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 16);
    const core = new THREE.Mesh(coreGeo, glowingRed);
    core.position.set(0, 0.8, 0);
    group.add(core);

    parts.push({
        name: "Processing Core & Battery",
        description: "High-density lithium-ion battery and AI-assisted processing unit.",
        material: "Energy Emissive",
        function: "Powers actuators and processes myoelectric signals into movement commands.",
        assemblyOrder: 5,
        connections: ["Forearm Chassis", "All Actuators"],
        failureEffect: "Complete system shutdown.",
        cascadeFailures: ["All Functions"],
        originalPosition: { x: 0, y: 0.8, z: 0 },
        explodedPosition: { x: 0, y: 0.8, z: -2 },
        mesh: core
    });

    // 6. Wrist Rotator
    const wristGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.4, 32);
    const wrist = new THREE.Mesh(wristGeo, aluminum);
    wrist.position.set(0, -0.6, 0);
    group.add(wrist);

    parts.push({
        name: "Wrist Rotator",
        description: "Continuous 360-degree rotation actuator.",
        material: "Aluminum",
        function: "Allows pronation and supination of the terminal device.",
        assemblyOrder: 6,
        connections: ["Forearm Chassis", "Terminal Gripper"],
        failureEffect: "Loss of rotational orientation capability.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: -0.6, z: 0 },
        explodedPosition: { x: 2, y: -0.6, z: 0 },
        mesh: wrist
    });

    // 7. Terminal Device (Multi-articulated Gripper Base)
    const handBaseGeo = new THREE.BoxGeometry(0.8, 0.5, 0.4);
    const handBase = new THREE.Mesh(handBaseGeo, darkSteel);
    handBase.position.set(0, -1.05, 0);
    group.add(handBase);

    parts.push({
        name: "Terminal Gripper Base",
        description: "Main hub for the digits, containing localized micro-actuators.",
        material: "Dark Steel",
        function: "Anchors fingers and distributes power to individual digit motors.",
        assemblyOrder: 7,
        connections: ["Wrist Rotator", "Fingers"],
        failureEffect: "Loss of grip capability.",
        cascadeFailures: ["Object Manipulation"],
        originalPosition: { x: 0, y: -1.05, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 },
        mesh: handBase
    });

    // 8. Digits (Fingers)
    const fingersGroup = new THREE.Group();
    fingersGroup.position.set(0, -1.3, 0);
    group.add(fingersGroup);
    
    const fingerPositions = [
        { x: -0.3, z: 0.1 }, // Index
        { x: -0.1, z: 0.1 }, // Middle
        { x: 0.1, z: 0.1 },  // Ring
        { x: 0.3, z: 0.1 },  // Pinky
        { x: -0.4, z: -0.1, isThumb: true } // Thumb
    ];

    const fingerMeshes = [];

    fingerPositions.forEach((pos, idx) => {
        const fingerGeo = new THREE.CylinderGeometry(0.08, 0.05, 0.6, 16);
        const finger = new THREE.Mesh(fingerGeo, chrome);
        finger.position.set(pos.x, -0.3, pos.z);
        if (pos.isThumb) {
            finger.rotation.z = Math.PI / 4;
            finger.position.set(pos.x - 0.1, -0.2, pos.z);
        }
        fingersGroup.add(finger);
        fingerMeshes.push(finger);
    });

    parts.push({
        name: "Articulated Digits",
        description: "Individually motorized fingers with tactile feedback sensors.",
        material: "Chrome and Silicone",
        function: "Fine motor control and object manipulation.",
        assemblyOrder: 8,
        connections: ["Terminal Gripper Base"],
        failureEffect: "Reduced grip strength or loss of fine manipulation.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: -1.3, z: 0 },
        explodedPosition: { x: 0, y: -3, z: 0 },
        mesh: fingersGroup
    });
    
    // Store animated components
    const animatedParts = {
        sensorRing,
        core,
        wrist,
        fingers: fingerMeshes,
        fingersGroup
    };

    const description = "The Advanced Bionic Prosthetic Arm represents the pinnacle of neural-integrated mechanical replacement. By combining high-density energy storage, AI-assisted myoelectric signal processing, and high-torque miniaturized actuators, this limb restores and even augments human capability. Key features include 360-degree wrist rotation and individually articulated digits for precision grips.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Myoelectric Sensor Array in this prosthetic arm?",
            options: [
                "To power the main battery core",
                "To detect muscle action potentials and translate them into commands",
                "To provide structural support to the socket",
                "To rotate the wrist joint 360 degrees"
            ],
            correct: 1,
            explanation: "Myoelectric sensors are placed on the skin over residual muscles. When the user flexes these muscles, the sensors detect the electrical signals (action potentials) and the processing core translates them into movement.",
            difficulty: "Medium"
        },
        {
            question: "Which component houses the primary battery and the processing core?",
            options: [
                "Terminal Gripper Base",
                "Elbow Joint Actuator",
                "Forearm Chassis",
                "Socket Interface"
            ],
            correct: 2,
            explanation: "The Forearm Chassis acts as a protective casing for the most critical electronics, including the battery pack and the microcontrollers that process signals.",
            difficulty: "Easy"
        },
        {
            question: "What is the cascading failure effect if the Socket Interface fails?",
            options: [
                "Loss of fine manipulation only",
                "Inability to bend the elbow",
                "Disconnection from the user, rendering the entire system unusable",
                "Loss of rotational orientation"
            ],
            correct: 2,
            explanation: "The Socket Interface is the structural anchor. If it fails, the entire prosthetic arm disconnects from the user's residual limb, causing a total system cascade failure.",
            difficulty: "Medium"
        },
        {
            question: "Why might a bionic wrist feature a continuous 360-degree rotation actuator?",
            options: [
                "Because human wrists can also rotate 360 degrees naturally",
                "To compensate for the lack of shoulder mobility in some amputees and offer augmented functionality",
                "It is a byproduct of cheap manufacturing",
                "To generate kinetic energy to recharge the battery"
            ],
            correct: 1,
            explanation: "While biological wrists cannot rotate 360 degrees, mechanical prosthetics can. This augmented capability helps compensate for other lost mobility and allows for novel manipulation techniques.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Pulsing neon lights on sensors and core
        const pulse = (Math.sin(time * speed * 3) + 1) / 2;
        animatedParts.sensorRing.material.emissiveIntensity = 0.5 + pulse * 1.5;
        animatedParts.core.material.emissiveIntensity = 0.8 + pulse * 1.2;
        
        // Idle rotation of the wrist
        animatedParts.wrist.rotation.y = Math.sin(time * speed) * 0.5;
        animatedParts.fingersGroup.rotation.y = animatedParts.wrist.rotation.y;
        
        // Gentle finger twitching/idle animation to simulate active feedback processing
        animatedParts.fingers.forEach((finger, index) => {
            finger.rotation.x = Math.sin(time * speed * 2 + index) * 0.1;
        });
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createProstheticArm() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
