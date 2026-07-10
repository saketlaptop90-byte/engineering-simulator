import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    const glowCyan = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        roughness: 0.2,
        metalness: 0.8
    });

    const glowRed = new THREE.MeshStandardMaterial({
        color: 0xff3333,
        emissive: 0xff0000,
        emissiveIntensity: 0.9,
        roughness: 0.1,
        metalness: 0.5
    });

    // Helper to add parts
    const addPart = (id, mesh, partData) => {
        mesh.position.set(partData.originalPosition.x, partData.originalPosition.y, partData.originalPosition.z);
        group.add(mesh);
        meshes[id] = mesh;
        parts.push({
            id: id,
            ...partData
        });
    };

    // Wrist Base
    const wristGeom = new THREE.CylinderGeometry(1.2, 1.5, 2, 32);
    const wrist = new THREE.Mesh(wristGeom, darkSteel);
    addPart('wrist', wrist, {
        name: 'Titanium Wrist Actuator',
        description: 'Multi-axis rotational base providing primary orientation for the bionic hand.',
        material: 'Dark Steel / Titanium Alloy',
        function: 'Controls pitch and yaw of the entire hand assembly.',
        assemblyOrder: 1,
        connections: ['palm_base'],
        failureEffect: 'Loss of hand orientation capabilities.',
        cascadeFailures: ['Complete operational failure of grasping tasks.'],
        originalPosition: { x: 0, y: -1, z: 0 },
        explodedPosition: { x: 0, y: -4, z: 0 }
    });

    // Palm
    const palmGeom = new THREE.BoxGeometry(3.5, 4, 1.2);
    const palm = new THREE.Mesh(palmGeom, aluminum);
    addPart('palm', palm, {
        name: 'Central Processing Palm',
        description: 'Main structural housing containing micro-controllers and primary tendon routers.',
        material: 'Aluminum',
        function: 'Houses internal electronics and provides structural support for the digits.',
        assemblyOrder: 2,
        connections: ['wrist', 'thumb_base', 'index_base', 'middle_base', 'ring_base', 'pinky_base', 'motor_core'],
        failureEffect: 'Structural compromise.',
        cascadeFailures: ['Loss of signal to all fingers.', 'Tendon routing failure.'],
        originalPosition: { x: 0, y: 2, z: 0 },
        explodedPosition: { x: 0, y: 2, z: -3 }
    });

    // Motor Core (Glowing)
    const motorGeom = new THREE.CylinderGeometry(0.8, 0.8, 1.4, 32);
    motorGeom.rotateZ(Math.PI / 2);
    const motor = new THREE.Mesh(motorGeom, glowCyan);
    addPart('motor_core', motor, {
        name: 'Brushless Micro-Torque Motor Core',
        description: 'High-density power unit generating pulling force for synthetic tendons.',
        material: 'Copper / Neon Polycarbonate',
        function: 'Drives the flexion of all digits simultaneously for grip strength.',
        assemblyOrder: 3,
        connections: ['palm'],
        failureEffect: 'Loss of grip strength.',
        cascadeFailures: ['Inability to lift objects.'],
        originalPosition: { x: 0, y: 1.5, z: 0 },
        explodedPosition: { x: 0, y: 1.5, z: 4 }
    });

    // Function to create a finger
    const createFinger = (fingerPrefix, namePrefix, baseX, baseY, baseZ, lengthScale, explodedDir) => {
        // Base Joint
        const baseGeom = new THREE.CylinderGeometry(0.3, 0.3, 0.8, 16);
        baseGeom.rotateX(Math.PI / 2);
        const baseJoint = new THREE.Mesh(baseGeom, chrome);
        addPart(`${fingerPrefix}_base`, baseJoint, {
            name: `${namePrefix} Base Joint`,
            description: `Metacarpophalangeal joint of the ${namePrefix.toLowerCase()}.`,
            material: 'Chrome',
            function: 'Provides proximal articulation.',
            assemblyOrder: 4,
            connections: ['palm', `${fingerPrefix}_mid`],
            failureEffect: `Immobilization of the ${namePrefix.toLowerCase()} base.`,
            cascadeFailures: ['Reduced grip dexterity.'],
            originalPosition: { x: baseX, y: baseY, z: baseZ },
            explodedPosition: { x: baseX + explodedDir.x*2, y: baseY + explodedDir.y*2, z: baseZ + explodedDir.z*2 }
        });

        // Proximal Phalanx (Mid segment)
        const midGeom = new THREE.BoxGeometry(0.5, 1.5 * lengthScale, 0.5);
        const mid = new THREE.Mesh(midGeom, plastic);
        addPart(`${fingerPrefix}_mid`, mid, {
            name: `${namePrefix} Proximal Phalanx`,
            description: `Primary structural segment of the ${namePrefix.toLowerCase()}.`,
            material: 'Carbon Fiber Reinforced Plastic',
            function: 'Extends reach and transfers force to the distal segment.',
            assemblyOrder: 5,
            connections: [`${fingerPrefix}_base`, `${fingerPrefix}_tip`],
            failureEffect: `Loss of ${namePrefix.toLowerCase()} articulation.`,
            cascadeFailures: [],
            originalPosition: { x: baseX, y: baseY + 0.75 * lengthScale + 0.3, z: baseZ },
            explodedPosition: { x: baseX + explodedDir.x*3, y: baseY + 1 + explodedDir.y*3, z: baseZ + explodedDir.z*3 }
        });

        // Tip (Distal)
        const tipGeom = new THREE.CylinderGeometry(0.2, 0.25, 1.2 * lengthScale, 16);
        const tip = new THREE.Mesh(tipGeom, rubber);
        addPart(`${fingerPrefix}_tip`, tip, {
            name: `${namePrefix} Distal Sensor Tip`,
            description: 'Silicone-coated fingertip embedded with haptic sensors.',
            material: 'Medical Grade Rubber',
            function: 'Provides friction for gripping and tactile feedback.',
            assemblyOrder: 6,
            connections: [`${fingerPrefix}_mid`],
            failureEffect: 'Loss of tactile sensation.',
            cascadeFailures: ['Crushing fragile objects due to lack of feedback.'],
            originalPosition: { x: baseX, y: baseY + 1.5 * lengthScale + 0.6 * lengthScale + 0.3, z: baseZ },
            explodedPosition: { x: baseX + explodedDir.x*4, y: baseY + 2 + explodedDir.y*4, z: baseZ + explodedDir.z*4 }
        });

        // Sensor
        const sensorGeom = new THREE.SphereGeometry(0.15, 16, 16);
        const sensor = new THREE.Mesh(sensorGeom, glowRed);
        addPart(`${fingerPrefix}_sensor`, sensor, {
            name: `${namePrefix} Haptic Sensor`,
            description: 'High-fidelity pressure sensor.',
            material: 'Silicon / Neon Emitter',
            function: 'Detects micro-variations in pressure.',
            assemblyOrder: 7,
            connections: [`${fingerPrefix}_tip`],
            failureEffect: 'Blind grasping.',
            cascadeFailures: [],
            originalPosition: { x: baseX, y: baseY + 1.5 * lengthScale + 1.2 * lengthScale, z: baseZ + 0.2 },
            explodedPosition: { x: baseX + explodedDir.x*5, y: baseY + 2.5 + explodedDir.y*5, z: baseZ + 2 + explodedDir.z*5 }
        });
    };

    // Index
    createFinger('index', 'Index Finger', -1.2, 4, 0, 1.1, {x: -1, y: 1, z: 0});
    // Middle
    createFinger('middle', 'Middle Finger', -0.4, 4.2, 0, 1.2, {x: -0.3, y: 1.2, z: 0});
    // Ring
    createFinger('ring', 'Ring Finger', 0.4, 4.0, 0, 1.05, {x: 0.3, y: 1, z: 0});
    // Pinky
    createFinger('pinky', 'Pinky Finger', 1.2, 3.6, 0, 0.8, {x: 1, y: 0.8, z: 0});

    // Thumb requires special orientation
    const thumbBaseGeom = new THREE.CylinderGeometry(0.3, 0.3, 0.8, 16);
    const thumbBase = new THREE.Mesh(thumbBaseGeom, chrome);
    thumbBase.rotation.set(0, 0, Math.PI/4);
    addPart('thumb_base', thumbBase, {
        name: 'Thumb CMC Joint',
        description: 'Carpometacarpal joint allowing opposition.',
        material: 'Chrome',
        function: 'Enables complex grasping patterns by opposing the fingers.',
        assemblyOrder: 4,
        connections: ['palm', 'thumb_mid'],
        failureEffect: 'Loss of pinch grip.',
        cascadeFailures: ['Inability to manipulate small tools.'],
        originalPosition: { x: -2.2, y: 1.5, z: 0.5 },
        explodedPosition: { x: -4, y: 1, z: 2 }
    });

    const thumbMidGeom = new THREE.BoxGeometry(0.5, 1.4, 0.5);
    const thumbMid = new THREE.Mesh(thumbMidGeom, plastic);
    thumbMid.rotation.set(0, 0, Math.PI/4);
    addPart('thumb_mid', thumbMid, {
        name: 'Thumb Proximal Phalanx',
        description: 'Primary thumb structure.',
        material: 'Carbon Fiber',
        function: 'Reaches across the palm.',
        assemblyOrder: 5,
        connections: ['thumb_base', 'thumb_tip'],
        failureEffect: 'Thumb immobilization.',
        cascadeFailures: [],
        originalPosition: { x: -2.8, y: 2.1, z: 0.5 },
        explodedPosition: { x: -5, y: 1.5, z: 3 }
    });

    const thumbTipGeom = new THREE.CylinderGeometry(0.2, 0.25, 1.0, 16);
    const thumbTip = new THREE.Mesh(thumbTipGeom, rubber);
    thumbTip.rotation.set(0, 0, Math.PI/4);
    addPart('thumb_tip', thumbTip, {
        name: 'Thumb Distal Sensor Tip',
        description: 'Tactile thumb tip.',
        material: 'Medical Grade Rubber',
        function: 'Provides opposing friction force.',
        assemblyOrder: 6,
        connections: ['thumb_mid'],
        failureEffect: 'Slippage during pinch grip.',
        cascadeFailures: [],
        originalPosition: { x: -3.4, y: 2.7, z: 0.5 },
        explodedPosition: { x: -6, y: 2, z: 4 }
    });


    const description = "The Mark VII Bionic Robotic Hand is an advanced cybernetic prosthetic designed for high-dexterity industrial environments. It features carbon-fiber reinforced phalanges, titanium alloy joints, and integrated glowing haptic sensors for micro-pressure feedback. Driven by a brushless micro-torque motor core, it can crush steel or gently hold a fragile egg.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Brushless Micro-Torque Motor Core?",
            options: [
                "Providing haptic feedback",
                "Generating pulling force for synthetic tendons",
                "Cooling the palm chassis",
                "Wireless data transmission"
            ],
            correct: 1,
            explanation: "The motor core drives the flexion of all digits by pulling the synthetic tendons.",
            difficulty: "Medium"
        },
        {
            question: "Which material is used for the Distal Sensor Tips to provide grip friction?",
            options: [
                "Titanium",
                "Carbon Fiber",
                "Medical Grade Rubber",
                "Glass"
            ],
            correct: 2,
            explanation: "Medical grade rubber provides the necessary friction and elasticity for secure gripping.",
            difficulty: "Easy"
        },
        {
            question: "A failure in the Thumb CMC Joint leads to what specific loss of function?",
            options: [
                "Loss of wrist rotation",
                "Loss of pinch grip and opposition",
                "Overheating of the central palm",
                "Inability to sense temperature"
            ],
            correct: 1,
            explanation: "The CMC joint allows the thumb to oppose the other fingers, which is critical for pinch grips.",
            difficulty: "Hard"
        }
    ];

    const animate = (time, speed, activeMeshes) => {
        const pulse = (Math.sin(time * speed * 5) + 1) / 2;
        
        if (activeMeshes['wrist']) {
            activeMeshes['wrist'].rotation.y = Math.sin(time * speed) * 0.2;
        }

        if (activeMeshes['motor_core']) {
            activeMeshes['motor_core'].rotation.x = time * speed * 2;
            if (activeMeshes['motor_core'].material) {
                activeMeshes['motor_core'].material.emissiveIntensity = 0.5 + pulse * 0.5;
            }
        }

        ['index', 'middle', 'ring', 'pinky'].forEach((finger, i) => {
            const offset = i * 0.5;
            if (activeMeshes[`${finger}_sensor`] && activeMeshes[`${finger}_sensor`].material) {
                activeMeshes[`${finger}_sensor`].material.emissiveIntensity = 0.2 + pulse * 0.8;
            }
            if (activeMeshes[`${finger}_mid`]) {
                const curl = Math.sin(time * speed * 2 + offset) * 0.1;
                activeMeshes[`${finger}_mid`].position.z = curl;
            }
            if (activeMeshes[`${finger}_tip`]) {
                const curl = Math.sin(time * speed * 2 + offset) * 0.1;
                activeMeshes[`${finger}_tip`].position.z = curl * 1.5;
                if (activeMeshes[`${finger}_sensor`]) {
                    activeMeshes[`${finger}_sensor`].position.z = activeMeshes[`${finger}_tip`].position.z + 0.2;
                }
            }
        });
        
        if (activeMeshes['thumb_mid']) {
            activeMeshes['thumb_mid'].position.x = -2.8 + Math.sin(time * speed * 1.5) * 0.05;
        }
    };

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createRoboticHand() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
