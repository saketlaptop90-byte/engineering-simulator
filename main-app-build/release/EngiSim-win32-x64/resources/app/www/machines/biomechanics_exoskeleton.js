import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom glowing materials
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 0.8,
        metalness: 0.1,
        roughness: 0.2
    });

    const glowingRed = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 0.8,
        metalness: 0.2,
        roughness: 0.1
    });

    const carbonFiber = new THREE.MeshStandardMaterial({
        color: 0x111111,
        metalness: 0.8,
        roughness: 0.7,
        wireframe: false
    });

    // Helper to add parts
    function addPart(id, name, geometry, material, position, explodedPos, parentGroup, description, functionDesc, assemblyOrder, connections, failureEffect) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(position.x, position.y, position.z);
        parentGroup.add(mesh);
        meshes[id] = mesh;

        parts.push({
            id: id,
            name: name,
            description: description,
            material: material.name || 'High-Tech Material',
            function: functionDesc,
            assemblyOrder: assemblyOrder,
            connections: connections,
            failureEffect: failureEffect,
            cascadeFailures: [],
            originalPosition: { x: position.x, y: position.y, z: position.z },
            explodedPosition: { x: explodedPos.x, y: explodedPos.y, z: explodedPos.z }
        });
        return mesh;
    }

    // 1. Core Spine
    const spineGeo = new THREE.CylinderGeometry(0.2, 0.2, 3, 16);
    const spine = addPart('spine', 'Bionic Spine Central Core', spineGeo, darkSteel, 
        {x: 0, y: 1.5, z: -0.2}, {x: 0, y: 1.5, z: -2}, group,
        'Main structural backbone supporting the entire exoskeleton.',
        'Houses main neural pathway cables and supports the upper torso.',
        1, ['torso_frame', 'pelvic_harness', 'neural_node'], 'Complete loss of upper-lower body coordination'
    );

    // 2. Torso Armor Frame
    const torsoGeo = new THREE.BoxGeometry(2, 1.5, 0.8);
    const torso = addPart('torso_frame', 'Thoracic Armor Frame', torsoGeo, carbonFiber,
        {x: 0, y: 2.2, z: 0}, {x: 0, y: 2.2, z: 2}, group,
        'Chest and back protection structure.',
        'Distributes heavy loads across the upper body and protects vital pilot organs.',
        2, ['spine', 'shoulder_l', 'shoulder_r', 'power_pack'], 'Crushing injury risk, structural collapse under load'
    );

    // 3. Power Pack
    const powerGeo = new THREE.BoxGeometry(1.2, 1.2, 0.6);
    const powerPack = addPart('power_pack', 'Micro-Fusion Reactor', powerGeo, darkSteel,
        {x: 0, y: 2.2, z: -0.6}, {x: 0, y: 2.2, z: -3}, group,
        'High-density energy storage and generation unit.',
        'Provides constant electrical and hydraulic power to all actuators.',
        3, ['torso_frame', 'spine'], 'Immediate system shutdown, suit becomes dead weight'
    );

    // 4. Reactor Core Glow
    const reactorGlowGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.65, 16);
    reactorGlowGeo.rotateX(Math.PI / 2);
    const reactorGlow = addPart('reactor_glow', 'Reactor Plasma Core', reactorGlowGeo, neonBlue,
        {x: 0, y: 2.2, z: -0.6}, {x: 0, y: 2.2, z: -4}, group,
        'Superconducting plasma containment.',
        'Generates massive power output for heavy lifting.',
        4, ['power_pack'], 'Catastrophic plasma leak, explosive overload'
    );

    // 5. Pelvic Harness
    const pelvisGeo = new THREE.BoxGeometry(1.8, 0.6, 0.8);
    const pelvis = addPart('pelvic_harness', 'Pelvic Distribution Harness', pelvisGeo, steel,
        {x: 0, y: 0.3, z: 0}, {x: 0, y: -1, z: 0}, group,
        'Connects the spine to the leg actuators.',
        'Transfers the weight of upper payloads directly to the mechanical legs, bypassing the pilot.',
        5, ['spine', 'thigh_l', 'thigh_r'], 'Inability to stand or bear weight, severe pilot spinal compression'
    );

    // 6. Neural Interface Node
    const neuralGeo = new THREE.SphereGeometry(0.25, 16, 16);
    const neuralNode = addPart('neural_node', 'Cerebral Linkage Node', neuralGeo, neonBlue,
        {x: 0, y: 3.2, z: -0.1}, {x: 0, y: 4, z: -1}, group,
        'Direct brain-to-machine interface at the base of the skull.',
        'Translates pilot motor cortex signals into actuator commands with zero latency.',
        6, ['spine'], 'Unresponsive suit, seizure-inducing feedback loops'
    );

    // Left Arm
    const shoulderGeo = new THREE.SphereGeometry(0.4, 16, 16);
    const shoulderL = addPart('shoulder_l', 'Left Shoulder Actuator', shoulderGeo, chrome,
        {x: -1.2, y: 2.6, z: 0}, {x: -2.5, y: 3, z: 0}, group,
        'Omni-directional shoulder joint.',
        'Provides massive lifting torque for the arm.',
        7, ['torso_frame', 'bicep_l'], 'Loss of arm elevation'
    );

    const armGeo = new THREE.CylinderGeometry(0.15, 0.15, 1.2, 16);
    const bicepLGroup = new THREE.Group();
    bicepLGroup.position.set(-1.2, 2.6, 0); // attach point
    group.add(bicepLGroup);
    
    const bicepL = new THREE.Mesh(armGeo, carbonFiber);
    bicepL.position.set(0, -0.6, 0);
    bicepLGroup.add(bicepL);
    meshes['bicep_l_group'] = bicepLGroup;

    parts.push({
        id: 'bicep_l',
        name: 'Left Bicep Assembly',
        description: 'Upper arm structural housing.',
        material: 'Carbon Fiber',
        function: 'Contains linear actuators for elbow flexion.',
        assemblyOrder: 8,
        connections: ['shoulder_l', 'elbow_l'],
        failureEffect: 'Reduced arm lifting strength',
        cascadeFailures: [],
        originalPosition: { x: -1.2, y: 2.0, z: 0 },
        explodedPosition: { x: -3, y: 2.0, z: 0 }
    });

    // Left Leg
    const legGeo = new THREE.CylinderGeometry(0.25, 0.2, 1.5, 16);
    const thighLGroup = new THREE.Group();
    thighLGroup.position.set(-0.6, 0.1, 0); // attach point
    group.add(thighLGroup);

    const thighL = new THREE.Mesh(legGeo, steel);
    thighL.position.set(0, -0.75, 0);
    thighLGroup.add(thighL);
    meshes['thigh_l_group'] = thighLGroup;

    parts.push({
        id: 'thigh_l',
        name: 'Left Femoral Strut',
        description: 'Upper leg titanium reinforcement.',
        material: 'Steel/Titanium',
        function: 'Bears heavy loads and houses massive hydraulic cylinders for jumping.',
        assemblyOrder: 9,
        connections: ['pelvic_harness', 'knee_l'],
        failureEffect: 'Leg buckling under load',
        cascadeFailures: [],
        originalPosition: { x: -0.6, y: -0.65, z: 0 },
        explodedPosition: { x: -2, y: -0.65, z: 0 }
    });

    const kneeLGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.4, 16);
    kneeLGeo.rotateZ(Math.PI / 2);
    const kneeL = new THREE.Mesh(kneeLGeo, glowingRed);
    kneeL.position.set(0, -1.5, 0);
    thighLGroup.add(kneeL);
    meshes['knee_l'] = kneeL;

    parts.push({
        id: 'knee_l',
        name: 'Left Hydraulic Knee Joint',
        description: 'High-pressure fluid joint.',
        material: 'Glowing Neon/Titanium',
        function: 'Allows rapid bending and shock absorption during heavy landings.',
        assemblyOrder: 10,
        connections: ['thigh_l', 'calf_l'],
        failureEffect: 'Joint lock-up or catastrophic fluid spray',
        cascadeFailures: [],
        originalPosition: { x: -0.6, y: -1.4, z: 0 },
        explodedPosition: { x: -2.5, y: -1.4, z: 0 }
    });


    const description = "The Powered Exoskeleton (Biomechanical Augmentation) is a state-of-the-art wearable robotic system designed to drastically enhance human strength, endurance, and mobility. Utilizing a direct neural interface for zero-latency control, it features a micro-fusion reactor, carbon-fiber armor plating, and hyper-pressurized hydraulic joints. It allows operators to lift tons of weight and survive extreme impact loads, effectively bridging the gap between man and machine.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Pelvic Distribution Harness in the exoskeleton?",
            options: [
                "To power the micro-fusion reactor",
                "To connect the neural node to the brain",
                "To transfer the payload weight directly to the mechanical legs, bypassing the pilot's spine",
                "To provide hydraulic pressure to the arms"
            ],
            correct: 2,
            explanation: "The pelvic harness links the upper torso frame to the leg actuators, redirecting massive weight loads so the human spine isn't crushed.",
            difficulty: "Medium"
        },
        {
            question: "How does the Neural Linkage Node achieve zero-latency control?",
            options: [
                "By using Bluetooth 7.0 wireless signals",
                "By tapping directly into the pilot's motor cortex at the base of the skull",
                "Through physical joysticks located inside the gloves",
                "By predicting movements using an onboard AI"
            ],
            correct: 1,
            explanation: "The neural node physically interfaces with the brain stem/motor cortex to translate natural physiological movement signals instantly to the servos.",
            difficulty: "Hard"
        },
        {
            question: "What happens if the Micro-Fusion Reactor suffers a catastrophic failure?",
            options: [
                "The suit runs on backup batteries indefinitely",
                "The exoskeleton immediately shuts down and becomes unmoving dead weight",
                "The suit becomes lighter",
                "The hydraulic pressure increases"
            ],
            correct: 1,
            explanation: "Without the massive power output of the reactor, the heavy actuators freeze, trapping the pilot in a heavy, immovable frame.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshes) {
        // Breathing/Idle animation
        const breath = Math.sin(time * speed * 2) * 0.05;
        if (meshes['torso_frame']) meshes['torso_frame'].position.y = 2.2 + breath;
        if (meshes['power_pack']) meshes['power_pack'].position.y = 2.2 + breath;
        if (meshes['reactor_glow']) meshes['reactor_glow'].position.y = 2.2 + breath;

        // Neural node pulsing glow
        if (meshes['neural_node'] && meshes['neural_node'].material) {
            meshes['neural_node'].material.emissiveIntensity = 0.5 + Math.sin(time * speed * 5) * 0.5;
        }

        // Arm swing
        if (meshes['bicep_l_group']) {
            meshes['bicep_l_group'].rotation.x = Math.sin(time * speed * 3) * 0.2;
        }

        // Leg step (marching in place)
        if (meshes['thigh_l_group']) {
            meshes['thigh_l_group'].rotation.x = -Math.abs(Math.sin(time * speed * 3)) * 0.4;
        }
        
        // Knee bending during step
        if (meshes['knee_l']) {
            meshes['knee_l'].rotation.x = Math.abs(Math.sin(time * speed * 3)) * 0.4;
            if (meshes['knee_l'].material) {
                meshes['knee_l'].material.emissiveIntensity = 0.4 + Math.abs(Math.sin(time * speed * 3)) * 0.6;
            }
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createExoskeletonArm() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
