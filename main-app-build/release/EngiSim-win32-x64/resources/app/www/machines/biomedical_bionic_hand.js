import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const neonCyan = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        metalness: 0.1,
        roughness: 0.2
    });

    const neonPink = new THREE.MeshStandardMaterial({
        color: 0xff007f,
        emissive: 0xff007f,
        emissiveIntensity: 0.8,
        metalness: 0.2,
        roughness: 0.2
    });

    const sensorMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 0.6,
        wireframe: true
    });

    // Parts generation

    // 1. Wrist Base (Socket)
    const wristGeo = new THREE.CylinderGeometry(0.8, 1, 1.5, 32);
    const wristBase = new THREE.Mesh(wristGeo, darkSteel);
    wristBase.position.set(0, -0.75, 0);
    group.add(wristBase);

    parts.push({
        name: "Myoelectric Wrist Socket",
        description: "Interfaces with the residual limb, containing EMG sensors to read muscle signals.",
        material: "Dark Steel / Titanium",
        function: "Structural support and signal acquisition.",
        assemblyOrder: 1,
        connections: ["Palm Chassis", "Nervous System (Simulated)"],
        failureEffect: "Loss of control signals; hand becomes unresponsive.",
        cascadeFailures: ["Motors", "Microcontroller"],
        originalPosition: {x: 0, y: -0.75, z: 0},
        explodedPosition: {x: 0, y: -3, z: 0},
        mesh: wristBase
    });

    // 2. EMG Sensor Rings (glowing)
    const sensorGeo = new THREE.TorusGeometry(0.85, 0.05, 16, 32);
    const sensorRing1 = new THREE.Mesh(sensorGeo, neonCyan);
    sensorRing1.rotation.x = Math.PI / 2;
    sensorRing1.position.set(0, -0.4, 0);
    wristBase.add(sensorRing1);

    const sensorRing2 = new THREE.Mesh(sensorGeo, neonCyan);
    sensorRing2.rotation.x = Math.PI / 2;
    sensorRing2.position.set(0, -1.1, 0);
    wristBase.add(sensorRing2);

    parts.push({
        name: "EMG Sensor Array",
        description: "High-density electromyography sensors glowing cyan when active.",
        material: "Neon Cyan / Conductive Polymer",
        function: "Reads electrical impulses from muscles.",
        assemblyOrder: 2,
        connections: ["Wrist Socket", "Microcontroller"],
        failureEffect: "Erratic hand movements.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: -0.75, z: 0},
        explodedPosition: {x: 0, y: -3, z: 2},
        mesh: sensorRing1
    });

    // 3. Palm Chassis
    const palmGeo = new THREE.BoxGeometry(2, 2.2, 0.6);
    const palmChassis = new THREE.Mesh(palmGeo, chrome);
    palmChassis.position.set(0, 1.1, 0);
    group.add(palmChassis);

    parts.push({
        name: "Central Palm Chassis",
        description: "Houses the main microcontroller, battery pack, and base motors for the fingers.",
        material: "Chrome / Aluminum",
        function: "Central processing and power distribution.",
        assemblyOrder: 3,
        connections: ["Wrist Socket", "Fingers", "Thumb Base"],
        failureEffect: "Complete system shutdown.",
        cascadeFailures: ["All Fingers", "Thumb"],
        originalPosition: {x: 0, y: 1.1, z: 0},
        explodedPosition: {x: 0, y: 1.1, z: -2},
        mesh: palmChassis
    });

    // 4. Microcontroller Board
    const boardGeo = new THREE.PlaneGeometry(1.5, 1.5);
    const board = new THREE.Mesh(boardGeo, sensorMaterial);
    board.position.set(0, 0, 0.31);
    palmChassis.add(board);

    // Fingers Helper Function
    function createFinger(name, xPos, lengthScale, explodedDir, orderBase) {
        const fingerGroup = new THREE.Group();
        fingerGroup.position.set(xPos, 2.2, 0);
        group.add(fingerGroup);

        const proxGeo = new THREE.CylinderGeometry(0.15, 0.2, 0.8 * lengthScale, 16);
        const proximal = new THREE.Mesh(proxGeo, steel);
        proximal.position.set(0, 0.4 * lengthScale, 0);
        fingerGroup.add(proximal);

        const midGeo = new THREE.CylinderGeometry(0.12, 0.15, 0.6 * lengthScale, 16);
        const middle = new THREE.Mesh(midGeo, darkSteel);
        
        const midJoint = new THREE.Group();
        midJoint.position.set(0, 0.8 * lengthScale, 0);
        midJoint.add(middle);
        middle.position.set(0, 0.3 * lengthScale, 0);
        fingerGroup.add(midJoint);

        const distGeo = new THREE.CylinderGeometry(0.1, 0.12, 0.4 * lengthScale, 16);
        const distal = new THREE.Mesh(distGeo, aluminum);
        
        const distJoint = new THREE.Group();
        distJoint.position.set(0, 0.6 * lengthScale, 0);
        distJoint.add(distal);
        distal.position.set(0, 0.2 * lengthScale, 0);
        midJoint.add(distJoint);

        // Neon joint accents
        const jointGeo = new THREE.SphereGeometry(0.18, 16, 16);
        const joint1 = new THREE.Mesh(jointGeo, neonPink);
        fingerGroup.add(joint1);

        const joint2 = new THREE.Mesh(jointGeo, neonPink);
        midJoint.add(joint2);

        const joint3 = new THREE.Mesh(jointGeo, neonPink);
        distJoint.add(joint3);

        parts.push({
            name: `${name} Proximal Phalanx`,
            description: `Base segment of the ${name.toLowerCase()} finger, driven by linear actuators.`,
            material: "Steel / Titanium",
            function: "Primary flexion.",
            assemblyOrder: orderBase,
            connections: ["Palm Chassis", `${name} Middle Phalanx`],
            failureEffect: `Inability to close the ${name.toLowerCase()} finger fully.`,
            cascadeFailures: [`${name} Distal`],
            originalPosition: {x: xPos, y: 2.2, z: 0},
            explodedPosition: {x: xPos + explodedDir.x, y: 2.2 + explodedDir.y, z: explodedDir.z},
            mesh: fingerGroup
        });

        return { root: fingerGroup, mid: midJoint, dist: distJoint };
    }

    // Create Fingers
    const index = createFinger("Index", -0.75, 1.0, {x: -2, y: 2, z: 0}, 4);
    const middleFinger = createFinger("Middle", -0.25, 1.1, {x: -1, y: 3, z: 0}, 5);
    const ring = createFinger("Ring", 0.25, 1.0, {x: 1, y: 3, z: 0}, 6);
    const pinky = createFinger("Pinky", 0.75, 0.8, {x: 2, y: 2, z: 0}, 7);

    // Create Thumb
    const thumbGroup = new THREE.Group();
    thumbGroup.position.set(-1.2, 0.5, 0);
    thumbGroup.rotation.z = Math.PI / 4;
    thumbGroup.rotation.y = -Math.PI / 6;
    group.add(thumbGroup);

    const thumbProxGeo = new THREE.CylinderGeometry(0.2, 0.25, 0.7, 16);
    const thumbProx = new THREE.Mesh(thumbProxGeo, steel);
    thumbProx.position.set(0, 0.35, 0);
    thumbGroup.add(thumbProx);

    const thumbDistJoint = new THREE.Group();
    thumbDistJoint.position.set(0, 0.7, 0);
    thumbGroup.add(thumbDistJoint);

    const thumbDistGeo = new THREE.CylinderGeometry(0.15, 0.2, 0.6, 16);
    const thumbDist = new THREE.Mesh(thumbDistGeo, aluminum);
    thumbDist.position.set(0, 0.3, 0);
    thumbDistJoint.add(thumbDist);

    const thumbJointGeo = new THREE.SphereGeometry(0.22, 16, 16);
    const tJoint1 = new THREE.Mesh(thumbJointGeo, neonPink);
    thumbGroup.add(tJoint1);
    
    const tJoint2 = new THREE.Mesh(thumbJointGeo, neonPink);
    thumbDistJoint.add(tJoint2);

    parts.push({
        name: "Thumb Assembly",
        description: "Opposable thumb mechanism with multi-axis rotation for various grip patterns.",
        material: "Steel / Aluminum",
        function: "Provides opposition for grasping objects.",
        assemblyOrder: 8,
        connections: ["Palm Chassis"],
        failureEffect: "Loss of precision grip.",
        cascadeFailures: [],
        originalPosition: {x: -1.2, y: 0.5, z: 0},
        explodedPosition: {x: -3, y: 0.5, z: 2},
        mesh: thumbGroup
    });

    const description = "The Biomedical Bionic Hand is a state-of-the-art myoelectric prosthesis. It uses high-density electromyography (EMG) sensors located in the wrist socket to interpret muscle signals from the user's residual limb. These signals are processed by a central microcontroller in the palm, which dictates the movement of individual linear actuators in each finger, allowing for complex, multi-articulated grip patterns like power grasp, pinch, and key grip. Glowing neon accents provide real-time visual feedback on grip strength and sensor activation.";

    const quizQuestions = [
        {
            question: "What is the primary function of the EMG sensors in the wrist socket?",
            options: [
                "To measure the temperature of the residual limb.",
                "To interpret electrical impulses from muscles to control the hand.",
                "To power the central microcontroller.",
                "To provide haptic feedback to the user."
            ],
            correct: 1,
            explanation: "Electromyography (EMG) sensors detect the electrical potential generated by muscle cells, which the bionic hand translates into motor commands.",
            difficulty: "Medium"
        },
        {
            question: "Why does the failure of the Palm Chassis lead to a complete system shutdown?",
            options: [
                "It is the only part that contains metal.",
                "It connects directly to the user's nervous system.",
                "It houses the main microcontroller and power distribution.",
                "It is the heaviest part of the hand."
            ],
            correct: 2,
            explanation: "The Palm Chassis contains the central processing unit and battery; without it, sensors cannot process signals and motors cannot receive power.",
            difficulty: "Easy"
        },
        {
            question: "Which feature allows the bionic thumb to enable multiple grip patterns?",
            options: [
                "Its neon glowing joints.",
                "Its multi-axis rotation and opposition capabilities.",
                "Its connection to the pinky finger.",
                "Its solid titanium construction."
            ],
            correct: 1,
            explanation: "Multi-axis rotation allows the thumb to oppose different fingers, enabling precision pinches, key grips, and power grasps.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Animate glowing sensors
        sensorRing1.material.emissiveIntensity = 0.5 + Math.sin(time * 5 * speed) * 0.4;
        sensorRing2.material.emissiveIntensity = 0.5 + Math.cos(time * 5 * speed) * 0.4;

        // Grip animation
        const gripCycle = Math.sin(time * speed * 2) * 0.5 + 0.5;

        [index, middleFinger, ring, pinky].forEach((finger, i) => {
            const offset = i * 0.2; // slight delay per finger
            const individualBend = Math.max(0, Math.sin(time * speed * 2 - offset) * 0.5 + 0.5) * Math.PI / 2.2;
            
            finger.root.rotation.x = individualBend;
            finger.mid.rotation.x = individualBend * 1.2;
            finger.dist.rotation.x = individualBend * 0.8;
        });

        // Move thumb
        thumbGroup.rotation.y = -Math.PI / 6 - (gripCycle * Math.PI / 4);
        thumbDistJoint.rotation.z = -gripCycle * Math.PI / 4;
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
export function createBionicProstheticHand() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
