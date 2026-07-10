import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom glowing materials
    const glowingBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 1.5,
        metalness: 0.8,
        roughness: 0.2,
    });

    const neonPink = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 1.0,
        metalness: 0.5,
        roughness: 0.4,
    });

    // 1. Palm Base
    const palmGeo = new THREE.BoxGeometry(4, 5, 1.5);
    const palm = new THREE.Mesh(palmGeo, darkSteel);
    palm.position.set(0, 0, 0);
    group.add(palm);
    parts.push({
        name: 'Chassis Palm',
        description: 'Main housing for the bionic hand control units and battery.',
        material: 'darkSteel',
        function: 'Structural support and component housing',
        assemblyOrder: 1,
        connections: ['Wrist Connector', 'Thumb Base', 'Finger Bases'],
        failureEffect: 'Total loss of hand integrity and control',
        cascadeFailures: ['All fingers', 'Wrist'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: -5}
    });
    meshes.palm = palm;

    // 2. Wrist Connector
    const wristGeo = new THREE.CylinderGeometry(1.5, 1.5, 2, 32);
    const wrist = new THREE.Mesh(wristGeo, chrome);
    wrist.position.set(0, -3.5, 0);
    group.add(wrist);
    parts.push({
        name: 'Wrist Articulator',
        description: 'Multi-axis joint connecting the hand to the forearm.',
        material: 'chrome',
        function: 'Pitch, yaw, and roll wrist movements',
        assemblyOrder: 2,
        connections: ['Chassis Palm'],
        failureEffect: 'Inability to rotate or bend hand',
        cascadeFailures: [],
        originalPosition: {x: 0, y: -3.5, z: 0},
        explodedPosition: {x: 0, y: -7, z: 0}
    });
    meshes.wrist = wrist;
    
    // Glowing Core inside Palm
    const coreGeo = new THREE.SphereGeometry(0.8, 16, 16);
    const core = new THREE.Mesh(coreGeo, glowingBlue);
    core.position.set(0, 0.5, 0.5);
    palm.add(core); // child of palm
    parts.push({
        name: 'Neural Processing Core',
        description: 'Decodes myoelectric signals into movement commands.',
        material: 'glowingBlue',
        function: 'Signal processing and motor control',
        assemblyOrder: 3,
        connections: ['Chassis Palm'],
        failureEffect: 'Spasms and unresponsiveness',
        cascadeFailures: ['All fingers'],
        originalPosition: {x: 0, y: 0.5, z: 0.5},
        explodedPosition: {x: 0, y: 0.5, z: 5}
    });
    meshes.core = core;

    // Fingers
    const createFinger = (name, x, y, z, scale, colorMaterial) => {
        const fingerGroup = new THREE.Group();
        fingerGroup.position.set(x, y, z);
        
        // Base joint
        const baseJointGeo = new THREE.SphereGeometry(0.4*scale, 16, 16);
        const baseJoint = new THREE.Mesh(baseJointGeo, steel);
        fingerGroup.add(baseJoint);

        // Phalanx 1
        const p1Geo = new THREE.BoxGeometry(0.6*scale, 1.5*scale, 0.6*scale);
        const p1 = new THREE.Mesh(p1Geo, chrome);
        p1.position.set(0, 0.75*scale, 0);
        fingerGroup.add(p1);

        // Mid joint
        const midJointGeo = new THREE.CylinderGeometry(0.35*scale, 0.35*scale, 0.65*scale, 16);
        midJointGeo.rotateZ(Math.PI/2);
        const midJoint = new THREE.Mesh(midJointGeo, darkSteel);
        midJoint.position.set(0, 1.5*scale, 0);
        fingerGroup.add(midJoint);

        // Phalanx 2
        const p2Geo = new THREE.BoxGeometry(0.5*scale, 1.2*scale, 0.5*scale);
        const p2 = new THREE.Mesh(p2Geo, chrome);
        p2.position.set(0, 2.1*scale, 0);
        fingerGroup.add(p2);

        // Tip joint
        const tipJoint = new THREE.Mesh(midJointGeo, darkSteel);
        tipJoint.position.set(0, 2.7*scale, 0);
        fingerGroup.add(tipJoint);

        // Phalanx 3 (Tip)
        const p3Geo = new THREE.BoxGeometry(0.4*scale, 1.0*scale, 0.4*scale);
        const p3 = new THREE.Mesh(p3Geo, steel);
        p3.position.set(0, 3.2*scale, 0);
        fingerGroup.add(p3);

        // Tactile Sensor
        const sensorGeo = new THREE.SphereGeometry(0.2*scale, 16, 16);
        const sensor = new THREE.Mesh(sensorGeo, colorMaterial);
        sensor.position.set(0, 3.7*scale, 0.1*scale);
        fingerGroup.add(sensor);

        group.add(fingerGroup);
        return fingerGroup;
    };

    meshes.index = createFinger('Index Finger', -1.5, 2.5, 0, 1, glowingBlue);
    parts.push({
        name: 'Index Finger Assembly',
        description: 'Multi-articulated index digit for precision tasks.',
        material: 'chrome, steel, glowingBlue',
        function: 'Pinching, pointing, and object manipulation',
        assemblyOrder: 4,
        connections: ['Chassis Palm'],
        failureEffect: 'Loss of precision grip',
        cascadeFailures: [],
        originalPosition: {x: -1.5, y: 2.5, z: 0},
        explodedPosition: {x: -3, y: 7, z: 0}
    });

    meshes.middle = createFinger('Middle Finger', -0.5, 2.7, 0, 1.1, glowingBlue);
    parts.push({
        name: 'Middle Finger Assembly',
        description: 'Longest digit, providing central gripping force.',
        material: 'chrome, steel, glowingBlue',
        function: 'Power grip and stabilization',
        assemblyOrder: 5,
        connections: ['Chassis Palm'],
        failureEffect: 'Reduced grip strength',
        cascadeFailures: [],
        originalPosition: {x: -0.5, y: 2.7, z: 0},
        explodedPosition: {x: -1, y: 8, z: 0}
    });

    meshes.ring = createFinger('Ring Finger', 0.5, 2.5, 0, 1.0, glowingBlue);
    parts.push({
        name: 'Ring Finger Assembly',
        description: 'Supporting digit for wrap-around grips.',
        material: 'chrome, steel, glowingBlue',
        function: 'Assistive gripping',
        assemblyOrder: 6,
        connections: ['Chassis Palm'],
        failureEffect: 'Slightly impaired spherical grip',
        cascadeFailures: [],
        originalPosition: {x: 0.5, y: 2.5, z: 0},
        explodedPosition: {x: 1, y: 7, z: 0}
    });

    meshes.pinky = createFinger('Pinky Finger', 1.5, 2.0, 0, 0.8, glowingBlue);
    parts.push({
        name: 'Pinky Finger Assembly',
        description: 'Smallest digit, essential for lateral stabilization.',
        material: 'chrome, steel, glowingBlue',
        function: 'Lateral support',
        assemblyOrder: 7,
        connections: ['Chassis Palm'],
        failureEffect: 'Decreased stability when holding wide objects',
        cascadeFailures: [],
        originalPosition: {x: 1.5, y: 2.0, z: 0},
        explodedPosition: {x: 3, y: 6, z: 0}
    });

    meshes.thumb = createFinger('Thumb', -2.5, 0.5, 1, 1.2, neonPink);
    meshes.thumb.rotation.z = -Math.PI / 4;
    meshes.thumb.rotation.x = Math.PI / 4;
    parts.push({
        name: 'Opposable Thumb Assembly',
        description: 'Complex digit with unique rotational base for opposition.',
        material: 'chrome, steel, neonPink',
        function: 'Key pinches, power grips, and opposition',
        assemblyOrder: 8,
        connections: ['Chassis Palm'],
        failureEffect: 'Complete loss of grasping capability',
        cascadeFailures: [],
        originalPosition: {x: -2.5, y: 0.5, z: 1},
        explodedPosition: {x: -6, y: 1, z: 3}
    });


    const description = "The Mark V Bionic Hand is a state-of-the-art cybernetic prosthesis designed for both high-precision tasks and heavy-duty lifting. Constructed from advanced alloys with chrome finishes and integrated neural processing cores. It utilizes myoelectric sensors to decode signals directly from the user's nervous system, offering unparalleled dexterity. The glowing components represent the active neural link and tactile feedback sensors.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Neural Processing Core?",
            options: [
                "To power the hand's motors",
                "To decode myoelectric signals into movement commands",
                "To cool down the servos",
                "To provide structural support"
            ],
            correct: 1,
            explanation: "The Neural Processing Core decodes myoelectric signals from the user's nervous system to translate them into specific motor commands for the fingers and wrist.",
            difficulty: "Medium"
        },
        {
            question: "Which component is crucial for 'opposition' and key pinches?",
            options: [
                "Wrist Articulator",
                "Middle Finger Assembly",
                "Opposable Thumb Assembly",
                "Chassis Palm"
            ],
            correct: 2,
            explanation: "The Opposable Thumb is capable of rotating and touching the other fingers (opposition), which is essential for pinching and holding objects securely.",
            difficulty: "Easy"
        },
        {
            question: "What effect does a failure of the Wrist Articulator have?",
            options: [
                "Complete loss of grasping capability",
                "Total loss of hand integrity",
                "Inability to rotate or bend the hand",
                "Spasms and unresponsiveness"
            ],
            correct: 2,
            explanation: "The Wrist Articulator handles pitch, yaw, and roll. Its failure results in the inability to rotate or bend the hand relative to the forearm.",
            difficulty: "Easy"
        },
        {
            question: "What material finish is primarily used on the finger phalanxes?",
            options: [
                "Dark Steel",
                "Chrome",
                "Rubber",
                "Copper"
            ],
            correct: 1,
            explanation: "The phalanx segments of the fingers are modeled using a chrome material, providing a durable and aesthetic cybernetic finish.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, activeMeshes) {
        const meshesToAnimate = activeMeshes || meshes;
        const t = time * speed;
        
        if (meshesToAnimate.core) {
            meshesToAnimate.core.rotation.y = t * 2;
            meshesToAnimate.core.rotation.x = t * 1.5;
            meshesToAnimate.core.material.emissiveIntensity = 1.0 + Math.sin(t * 3) * 0.5;
        }

        const drumFreq = t * 2;
        if (meshesToAnimate.index) meshesToAnimate.index.rotation.x = Math.sin(drumFreq) * 0.2 + 0.1;
        if (meshesToAnimate.middle) meshesToAnimate.middle.rotation.x = Math.sin(drumFreq - 0.5) * 0.2 + 0.1;
        if (meshesToAnimate.ring) meshesToAnimate.ring.rotation.x = Math.sin(drumFreq - 1.0) * 0.2 + 0.1;
        if (meshesToAnimate.pinky) meshesToAnimate.pinky.rotation.x = Math.sin(drumFreq - 1.5) * 0.2 + 0.1;
        
        if (meshesToAnimate.thumb) meshesToAnimate.thumb.rotation.y = Math.sin(t) * 0.15;
    }

    return { group, parts, description, quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createBionicHand() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
