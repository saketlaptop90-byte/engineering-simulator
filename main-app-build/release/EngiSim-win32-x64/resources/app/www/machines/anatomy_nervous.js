import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const impulseGlow = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.8,
        transmission: 0.9,
        ior: 1.5,
        roughness: 0.1,
        metalness: 0.5
    });

    const brainMatter = new THREE.MeshPhysicalMaterial({
        color: 0xddddff,
        emissive: 0x222244,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.9,
        roughness: 0.4,
        metalness: 0.1,
        transmission: 0.5
    });

    const nerveGlow = new THREE.MeshStandardMaterial({
        color: 0x4488ff,
        emissive: 0x1133aa,
        emissiveIntensity: 0.8,
        wireframe: true
    });

    const synapseGlow = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 1.5
    });


    // Brain (Cerebrum & Cerebellum)
    const brainGeo = new THREE.SphereGeometry(2.5, 64, 64);
    brainGeo.scale(1, 0.8, 1.2);
    const brainMesh = new THREE.Mesh(brainGeo, brainMatter);
    brainMesh.position.set(0, 8, 0);
    group.add(brainMesh);

    parts.push({
        name: "Cerebrum",
        description: "The largest part of the brain, responsible for voluntary actions, intelligence, learning, and judgment.",
        material: "brainMatter",
        function: "Information processing and executive control",
        assemblyOrder: 1,
        connections: ["Brainstem", "Thalamus"],
        failureEffect: "Loss of cognitive function and motor control",
        cascadeFailures: ["Complete system paralysis"],
        originalPosition: { x: 0, y: 8, z: 0 },
        explodedPosition: { x: 0, y: 12, z: 0 }
    });


    // Brainstem
    const stemGeo = new THREE.CylinderGeometry(0.5, 0.4, 2, 32);
    const stemMesh = new THREE.Mesh(stemGeo, darkSteel);
    stemMesh.position.set(0, 6, -0.5);
    stemMesh.rotation.x = Math.PI / 8;
    group.add(stemMesh);

    parts.push({
        name: "Brainstem",
        description: "Controls basic body functions such as breathing, swallowing, heart rate, blood pressure, consciousness, and whether one is awake or sleepy.",
        material: "darkSteel",
        function: "Autonomic function regulation",
        assemblyOrder: 2,
        connections: ["Cerebrum", "Spinal Cord"],
        failureEffect: "Loss of autonomic functions",
        cascadeFailures: ["Respiratory failure", "Cardiac arrest"],
        originalPosition: { x: 0, y: 6, z: -0.5 },
        explodedPosition: { x: 0, y: 6, z: -3 }
    });

    // Spinal Cord
    const spinalGeo = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 5, -0.7),
            new THREE.Vector3(0, 2, -1.0),
            new THREE.Vector3(0, -2, -1.0),
            new THREE.Vector3(0, -6, -0.5)
        ]),
        64,
        0.3,
        16,
        false
    );
    const spinalMesh = new THREE.Mesh(spinalGeo, chrome);
    group.add(spinalMesh);

    parts.push({
        name: "Spinal Cord",
        description: "A long, fragile tubelike structure that begins at the end of the brain stem and continues down almost to the bottom of the spine.",
        material: "chrome",
        function: "Signal transmission between brain and body",
        assemblyOrder: 3,
        connections: ["Brainstem", "Peripheral Nerves"],
        failureEffect: "Paralysis below the point of failure",
        cascadeFailures: ["Loss of sensory input", "Motor control failure"],
        originalPosition: { x: 0, y: 0, z: -0.8 },
        explodedPosition: { x: 0, y: 0, z: -5 }
    });


    // Peripheral Nerves
    const nerveSystem = new THREE.Group();
    const nervePositions = [
        { y: 4, z: -0.8, l: 3 },
        { y: 2, z: -1.0, l: 3.5 },
        { y: 0, z: -1.0, l: 4 },
        { y: -2, z: -1.0, l: 3.8 },
        { y: -4, z: -0.8, l: 4.5 }
    ];

    nervePositions.forEach((pos, idx) => {
        // Left nerve
        const nerveLGeo = new THREE.CylinderGeometry(0.05, 0.02, pos.l, 8);
        nerveLGeo.translate(0, pos.l/2, 0);
        const nerveLMesh = new THREE.Mesh(nerveLGeo, nerveGlow);
        nerveLMesh.position.set(0, pos.y, pos.z);
        nerveLMesh.rotation.z = Math.PI / 2 + 0.2;
        nerveLMesh.rotation.x = 0.2;
        nerveSystem.add(nerveLMesh);

        // Right nerve
        const nerveRGeo = new THREE.CylinderGeometry(0.05, 0.02, pos.l, 8);
        nerveRGeo.translate(0, pos.l/2, 0);
        const nerveRMesh = new THREE.Mesh(nerveRGeo, nerveGlow);
        nerveRMesh.position.set(0, pos.y, pos.z);
        nerveRMesh.rotation.z = -Math.PI / 2 - 0.2;
        nerveRMesh.rotation.x = 0.2;
        nerveSystem.add(nerveRMesh);
    });
    group.add(nerveSystem);

    parts.push({
        name: "Peripheral Nerves",
        description: "The network of nerves outside the brain and spinal cord.",
        material: "nerveGlow",
        function: "Connects the central nervous system to limbs and organs",
        assemblyOrder: 4,
        connections: ["Spinal Cord", "Sensory Organs", "Muscles"],
        failureEffect: "Numbness, tingling, or weakness in affected areas",
        cascadeFailures: ["Loss of limb control", "Sensory deprivation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 5 }
    });

    // Impulses (Particles)
    const impulseCount = 50;
    const impulseGeo = new THREE.SphereGeometry(0.1, 8, 8);
    const impulseInstanced = new THREE.InstancedMesh(impulseGeo, impulseGlow, impulseCount);
    const dummy = new THREE.Object3D();
    
    // Store impulse data for animation
    const impulseData = [];
    for (let i = 0; i < impulseCount; i++) {
        impulseData.push({
            progress: Math.random(),
            speed: 0.5 + Math.random() * 1.5,
            route: Math.floor(Math.random() * nervePositions.length),
            side: Math.random() > 0.5 ? 1 : -1
        });
        dummy.position.set(0, 0, 0);
        dummy.updateMatrix();
        impulseInstanced.setMatrixAt(i, dummy.matrix);
    }
    group.add(impulseInstanced);

    // Quiz Questions
    const quizQuestions = [
        {
            question: "Which part of the brain is primarily responsible for basic life functions like breathing and heart rate?",
            options: ["Cerebrum", "Cerebellum", "Brainstem", "Thalamus"],
            correct: 2,
            explanation: "The brainstem controls autonomic (involuntary) functions essential for life, such as heart rate, breathing, and blood pressure.",
            difficulty: "Medium"
        },
        {
            question: "What acts as the main highway for electrical impulses traveling between the brain and the rest of the body?",
            options: ["Peripheral Nerves", "Spinal Cord", "Axons", "Dendrites"],
            correct: 1,
            explanation: "The spinal cord connects the brain to the peripheral nervous system, acting as the main pathway for nerve impulses.",
            difficulty: "Easy"
        },
        {
            question: "Which division of the nervous system connects the brain and spinal cord to the limbs and organs?",
            options: ["Central Nervous System", "Autonomic Nervous System", "Peripheral Nervous System", "Enteric Nervous System"],
            correct: 2,
            explanation: "The Peripheral Nervous System (PNS) consists of all the nerves outside the brain and spinal cord, connecting them to the rest of the body.",
            difficulty: "Medium"
        }
    ];

    const description = "The human nervous system is an intricate, high-speed communication network that coordinates all body functions. The Central Nervous System (brain and spinal cord) processes information, while the Peripheral Nervous System relays signals between the CNS and the rest of the body via electrochemical impulses.";

    function animate(time, speed, meshes) {
        if (!meshes || meshes.length === 0) return;
        
        // Pulsating brain
        if (brainMesh) {
            brainMesh.scale.x = 1 + Math.sin(time * 2) * 0.02;
            brainMesh.scale.z = 1.2 + Math.cos(time * 2.1) * 0.02;
            brainMatter.emissiveIntensity = 0.5 + Math.sin(time * 4) * 0.2;
        }

        // Nerve glow
        nerveGlow.emissiveIntensity = 0.5 + Math.sin(time * 8) * 0.4;

        // Animate impulses
        for (let i = 0; i < impulseCount; i++) {
            const data = impulseData[i];
            data.progress += speed * data.speed * 0.01;
            if (data.progress > 1) {
                data.progress = 0;
                data.route = Math.floor(Math.random() * nervePositions.length);
                data.side = Math.random() > 0.5 ? 1 : -1;
            }

            // Path: from brain down spinal cord, then out to peripheral nerves
            let px = 0, py = 0, pz = 0;
            const t = data.progress;

            if (t < 0.4) {
                // Brain to spinal cord
                const st = t / 0.4;
                py = 8 - st * (8 - nervePositions[data.route].y);
                pz = -0.5 - st * (0.5);
            } else {
                // Out through peripheral nerve
                const nt = (t - 0.4) / 0.6;
                const np = nervePositions[data.route];
                py = np.y;
                pz = np.z;
                
                // Angle of nerve
                const angle = data.side === 1 ? (Math.PI / 2 + 0.2) : (-Math.PI / 2 - 0.2);
                px = Math.cos(Math.PI/2 - angle) * nt * np.l * data.side;
                py -= Math.sin(Math.PI/2 - angle) * nt * np.l;
            }

            dummy.position.set(px, py, pz);
            dummy.scale.setScalar(1 + Math.sin(time * 20 + i) * 0.5);
            dummy.updateMatrix();
            impulseInstanced.setMatrixAt(i, dummy.matrix);
        }
        impulseInstanced.instanceMatrix.needsUpdate = true;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createNervous() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
