import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const statorMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x111111,
        metalness: 0.9,
        roughness: 0.4,
        wireframe: true,
        emissive: 0x002244,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.8
    });

    const diaphragmMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        metalness: 0.1,
        roughness: 0.1,
        transparent: true,
        opacity: 0.6,
        emissive: 0x00aaff,
        emissiveIntensity: 0.8,
        side: THREE.DoubleSide
    });

    const frameMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x050505,
        metalness: 0.8,
        roughness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const transformerMaterial = new THREE.MeshStandardMaterial({
        color: 0xff6600,
        metalness: 0.7,
        roughness: 0.5,
        emissive: 0xff3300,
        emissiveIntensity: 0.2
    });

    // 1. Base / Power Supply Housing
    const baseGeo = new THREE.BoxGeometry(4, 1.5, 3);
    const baseMesh = new THREE.Mesh(baseGeo, frameMaterial);
    baseMesh.position.set(0, -5, 0);
    group.add(baseMesh);
    parts.push({
        name: "Power Supply Base",
        description: "Houses the step-up audio transformer and high-voltage bias supply.",
        material: "Frame",
        function: "Provides the polarizing voltage to the diaphragm and steps up the audio signal voltage.",
        assemblyOrder: 1,
        connections: ["Step-Up Transformer", "Panel Frame"],
        failureEffect: "No sound or very low volume.",
        cascadeFailures: ["Stators", "Diaphragm"],
        originalPosition: { x: 0, y: -5, z: 0 },
        explodedPosition: { x: 0, y: -8, z: 0 },
        mesh: baseMesh
    });

    // 2. Step-Up Transformer (inside base but modeled slightly above for visibility)
    const transformerGeo = new THREE.CylinderGeometry(0.8, 0.8, 1, 32);
    const transformerMesh = new THREE.Mesh(transformerGeo, transformerMaterial);
    transformerMesh.position.set(0, -4.25, 0);
    transformerMesh.rotation.z = Math.PI / 2;
    group.add(transformerMesh);
    parts.push({
        name: "Audio Step-Up Transformer",
        description: "Massive transformer to increase amplifier voltage.",
        material: "Copper/Steel",
        function: "Steps up standard amplifier voltage (tens of volts) to thousands of volts needed to drive the stators.",
        assemblyOrder: 2,
        connections: ["Base", "Front Stator", "Rear Stator"],
        failureEffect: "Distortion or no audio signal reaching the stators.",
        cascadeFailures: ["Stators"],
        originalPosition: { x: 0, y: -4.25, z: 0 },
        explodedPosition: { x: -3, y: -4.25, z: 0 },
        mesh: transformerMesh
    });

    // 3. Panel Frame
    const frameGeo = new THREE.BoxGeometry(4.5, 9, 0.5);
    const panelFrameMesh = new THREE.Mesh(frameGeo, frameMaterial);
    panelFrameMesh.position.set(0, 0.5, 0);
    group.add(panelFrameMesh);
    parts.push({
        name: "Panel Frame",
        description: "Rigid structure holding the stators and diaphragm under high tension.",
        material: "Aluminum",
        function: "Maintains exact spacing between stators and diaphragm.",
        assemblyOrder: 3,
        connections: ["Base", "Stators", "Diaphragm"],
        failureEffect: "Diaphragm hits stators causing arcing and catastrophic failure.",
        cascadeFailures: ["Diaphragm", "Stators"],
        originalPosition: { x: 0, y: 0.5, z: 0 },
        explodedPosition: { x: 0, y: 0.5, z: -3 },
        mesh: panelFrameMesh
    });

    // 4. Rear Stator
    const statorGeo = new THREE.BoxGeometry(3.8, 8.5, 0.1);
    const rearStatorMesh = new THREE.Mesh(statorGeo, statorMaterial);
    rearStatorMesh.position.set(0, 0.5, -0.3);
    group.add(rearStatorMesh);
    parts.push({
        name: "Rear Stator",
        description: "Perforated metal grid carrying high voltage audio signal.",
        material: "Steel Grid",
        function: "Creates an alternating electric field pushing/pulling the charged diaphragm.",
        assemblyOrder: 4,
        connections: ["Panel Frame", "Transformer"],
        failureEffect: "Asymmetrical sound or arcing.",
        cascadeFailures: ["Diaphragm"],
        originalPosition: { x: 0, y: 0.5, z: -0.3 },
        explodedPosition: { x: 0, y: 0.5, z: -1.5 },
        mesh: rearStatorMesh
    });

    // 5. Diaphragm
    const diaphragmGeo = new THREE.PlaneGeometry(3.8, 8.5, 32, 32);
    const diaphragmMesh = new THREE.Mesh(diaphragmGeo, diaphragmMaterial);
    diaphragmMesh.position.set(0, 0.5, 0);
    group.add(diaphragmMesh);
    parts.push({
        name: "Mylar Diaphragm",
        description: "Ultra-thin, low-mass conductive film under high tension.",
        material: "Mylar Film",
        function: "Moves rapidly back and forth in the changing electric field to create sound waves.",
        assemblyOrder: 5,
        connections: ["Panel Frame", "Bias Supply"],
        failureEffect: "Tearing, loss of tension, or burning due to arcing.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0.5, z: 0 },
        explodedPosition: { x: 0, y: 0.5, z: 0 },
        mesh: diaphragmMesh
    });

    // 6. Front Stator
    const frontStatorMesh = new THREE.Mesh(statorGeo, statorMaterial);
    frontStatorMesh.position.set(0, 0.5, 0.3);
    group.add(frontStatorMesh);
    parts.push({
        name: "Front Stator",
        description: "Perforated metal grid identical to the rear stator.",
        material: "Steel Grid",
        function: "Works in opposite polarity to the rear stator to push/pull the diaphragm symmetrically.",
        assemblyOrder: 6,
        connections: ["Panel Frame", "Transformer"],
        failureEffect: "Asymmetrical sound or arcing.",
        cascadeFailures: ["Diaphragm"],
        originalPosition: { x: 0, y: 0.5, z: 0.3 },
        explodedPosition: { x: 0, y: 0.5, z: 1.5 },
        mesh: frontStatorMesh
    });

    // 7. Spacers / Insulators
    const spacerGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.6, 16);
    const spacerMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00, transparent: true, opacity: 0.7, emissive: 0x004400 });
    const spacerGroup = new THREE.Group();
    const spacerPositions = [
        [-1.8, 4.5, 0], [1.8, 4.5, 0],
        [-1.8, -3.5, 0], [1.8, -3.5, 0],
        [-1.8, 0.5, 0], [1.8, 0.5, 0]
    ];
    
    spacerPositions.forEach(pos => {
        const spacer = new THREE.Mesh(spacerGeo, spacerMaterial);
        spacer.rotation.x = Math.PI / 2;
        spacer.position.set(pos[0], pos[1], pos[2]);
        spacerGroup.add(spacer);
    });
    group.add(spacerGroup);
    parts.push({
        name: "Dielectric Insulators",
        description: "High-voltage standoffs.",
        material: "Teflon/Ceramic",
        function: "Prevents high voltage arcing between the stators.",
        assemblyOrder: 7,
        connections: ["Front Stator", "Rear Stator", "Panel Frame"],
        failureEffect: "Direct short circuit and fire.",
        cascadeFailures: ["Transformer", "Amplifier"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 3, y: 0, z: 0 },
        mesh: spacerGroup
    });


    const description = "An Electrostatic Speaker creates sound by placing an ultra-thin, electrically charged diaphragm between two perforated metal stators. The stators are fed a high-voltage audio signal. As the signal fluctuates, it creates an alternating electric field that pushes and pulls the diaphragm at extreme speeds. Because the diaphragm is virtually weightless, it responds instantaneously to transients, resulting in incredibly detailed, pure sound without enclosure resonance.";

    const quizQuestions = [
        {
            question: "What is the primary function of the stators in an electrostatic speaker?",
            options: [
                "To amplify the audio signal from the amplifier.",
                "To act as a physical enclosure for the bass frequencies.",
                "To create a fluctuating electric field that moves the diaphragm.",
                "To supply a constant DC bias voltage to the diaphragm."
            ],
            correct: 2,
            explanation: "The stators carry the high-voltage AC audio signal, generating the changing electric field that pushes and pulls the charged diaphragm.",
            difficulty: "Medium"
        },
        {
            question: "Why does the diaphragm need to be electrically charged (biased)?",
            options: [
                "To prevent dust accumulation on the surface.",
                "To interact with the electric field generated by the stators.",
                "To generate the audio signal itself.",
                "To act as a crossover network for high frequencies."
            ],
            correct: 1,
            explanation: "The diaphragm requires a constant high-voltage DC bias so that it has a fixed charge, allowing the fluctuating AC fields from the stators to attract and repel it.",
            difficulty: "Hard"
        },
        {
            question: "What is the main advantage of the ultra-thin mylar diaphragm used in these speakers?",
            options: [
                "It is completely immune to electrical arcing.",
                "It has very high mass to generate powerful bass.",
                "It requires no external power supply.",
                "Its extremely low mass allows for near-instantaneous transient response."
            ],
            correct: 3,
            explanation: "The virtually weightless diaphragm can start and stop moving almost instantly, providing unmatched clarity, detail, and transient response.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Animate the diaphragm vibrating
        const diaphragm = meshes.find(m => m.name === "Mylar Diaphragm");
        if (diaphragm) {
            // High frequency vibration
            const vibration = Math.sin(time * speed * 50) * 0.05;
            diaphragm.mesh.position.z = diaphragm.originalPosition.z + vibration;
            
            // Visual pulse on the emissive material to simulate charge/sound waves
            diaphragm.mesh.material.emissiveIntensity = 0.8 + Math.sin(time * speed * 20) * 0.4;
        }

        // Animate stators glowing slightly based on the 'signal'
        const frontStator = meshes.find(m => m.name === "Front Stator");
        const rearStator = meshes.find(m => m.name === "Rear Stator");
        if (frontStator && rearStator) {
            const glowFront = 0.5 + Math.sin(time * speed * 50) * 0.3;
            const glowRear = 0.5 + Math.sin(time * speed * 50 + Math.PI) * 0.3; // Out of phase
            
            frontStator.mesh.material.emissiveIntensity = glowFront;
            rearStator.mesh.material.emissiveIntensity = glowRear;
        }

        // Transformer hum
        const transformer = meshes.find(m => m.name === "Audio Step-Up Transformer");
        if (transformer) {
            transformer.mesh.scale.set(
                1 + Math.sin(time * speed * 120) * 0.01,
                1 + Math.cos(time * speed * 120) * 0.01,
                1 + Math.sin(time * speed * 120) * 0.01
            );
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createElectrostaticSpeaker() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
