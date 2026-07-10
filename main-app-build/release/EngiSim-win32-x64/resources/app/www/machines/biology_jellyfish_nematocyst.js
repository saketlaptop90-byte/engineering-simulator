import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const capsuleMat = new THREE.MeshPhysicalMaterial({
        color: 0x44aaff,
        transmission: 0.9,
        opacity: 1,
        metalness: 0.2,
        roughness: 0.1,
        ior: 1.5,
        thickness: 0.5,
        specularIntensity: 1.0,
        specularColor: 0xffffff,
        envMapIntensity: 1.0,
        transparent: true,
        side: THREE.DoubleSide
    });

    const threadMat = new THREE.MeshStandardMaterial({
        color: 0x00ffcc,
        emissive: 0x00ffcc,
        emissiveIntensity: 0.8,
        metalness: 0.5,
        roughness: 0.2
    });

    const barbMat = new THREE.MeshStandardMaterial({
        color: 0xff3366,
        emissive: 0xff0044,
        emissiveIntensity: 0.5,
        metalness: 0.8,
        roughness: 0.2
    });

    const operculumMat = new THREE.MeshStandardMaterial({
        color: 0x88ccff,
        metalness: 0.6,
        roughness: 0.3,
        transparent: true,
        opacity: 0.8
    });

    const cnidocilMat = new THREE.MeshStandardMaterial({
        color: 0xccff00,
        emissive: 0x66aa00,
        emissiveIntensity: 0.6,
        metalness: 0.2,
        roughness: 0.4
    });

    // 1. Capsule (Nematocyst body)
    const capsuleGeo = new THREE.CapsuleGeometry(2, 4, 16, 32);
    const capsule = new THREE.Mesh(capsuleGeo, capsuleMat);
    group.add(capsule);
    parts.push({
        name: "Capsule",
        description: "The main body of the nematocyst, containing high osmotic pressure.",
        material: "Translucent Biomaterial",
        function: "Stores the coiled thread and maintains high internal pressure for explosive discharge.",
        assemblyOrder: 1,
        connections: ["Operculum", "Thread"],
        failureEffect: "Loss of pressure, preventing firing.",
        cascadeFailures: ["Complete cell failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -5, y: 0, z: -5 },
        mesh: capsule
    });

    // 2. Operculum (Lid)
    const operculumGeo = new THREE.CylinderGeometry(1.8, 1.8, 0.2, 32);
    const operculum = new THREE.Mesh(operculumGeo, operculumMat);
    operculum.position.set(0, 3, 0);
    group.add(operculum);
    parts.push({
        name: "Operculum",
        description: "The hinged lid that seals the capsule.",
        material: "Hardened Biomaterial",
        function: "Keeps the capsule sealed until triggered by the cnidocil.",
        assemblyOrder: 2,
        connections: ["Capsule", "Cnidocil"],
        failureEffect: "Premature firing or failure to open.",
        cascadeFailures: ["Misfire"],
        originalPosition: { x: 0, y: 3, z: 0 },
        explodedPosition: { x: 5, y: 5, z: 5 },
        mesh: operculum
    });

    // 3. Cnidocil (Trigger Hair)
    const cnidocilGeo = new THREE.CylinderGeometry(0.1, 0.2, 3, 8);
    const cnidocil = new THREE.Mesh(cnidocilGeo, cnidocilMat);
    cnidocil.position.set(1.5, 4.5, 0);
    cnidocil.rotation.z = -Math.PI / 8;
    group.add(cnidocil);
    parts.push({
        name: "Cnidocil",
        description: "Mechanosensory hair-like trigger.",
        material: "Sensory Cilia",
        function: "Detects physical contact and chemical cues to trigger discharge.",
        assemblyOrder: 3,
        connections: ["Operculum"],
        failureEffect: "Inability to detect prey or predators.",
        cascadeFailures: ["Failure to fire"],
        originalPosition: { x: 1.5, y: 4.5, z: 0 },
        explodedPosition: { x: 5, y: 8, z: 0 },
        mesh: cnidocil
    });

    // 4. Coiled Thread
    const threadPath = [];
    for (let i = 0; i < 100; i++) {
        const t = i / 100;
        const angle = t * Math.PI * 10;
        const radius = 1.2 * (1 - t);
        const y = (t - 0.5) * 3;
        threadPath.push(new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius));
    }
    const threadCurve = new THREE.CatmullRomCurve3(threadPath);
    const threadGeo = new THREE.TubeGeometry(threadCurve, 100, 0.1, 8, false);
    const thread = new THREE.Mesh(threadGeo, threadMat);
    group.add(thread);
    parts.push({
        name: "Venomous Thread",
        description: "Hollow, barbed tube stored inside out within the capsule.",
        material: "Bioluminescent Tubing",
        function: "Inverts outwards to penetrate prey and deliver venom.",
        assemblyOrder: 4,
        connections: ["Capsule", "Barbs"],
        failureEffect: "Fails to reach or penetrate target.",
        cascadeFailures: ["Ineffective sting"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 10 },
        mesh: thread,
        isThread: true
    });

    // 5. Stylets/Barbs (Attached to thread base)
    const barbGroup = new THREE.Group();
    for (let i = 0; i < 3; i++) {
        const barbGeo = new THREE.ConeGeometry(0.3, 1.5, 3);
        const barb = new THREE.Mesh(barbGeo, barbMat);
        const angle = (i / 3) * Math.PI * 2;
        barb.position.set(Math.cos(angle) * 0.5, 2, Math.sin(angle) * 0.5);
        barb.rotation.x = Math.PI / 4 * Math.cos(angle);
        barb.rotation.z = -Math.PI / 4 * Math.sin(angle);
        barbGroup.add(barb);
    }
    group.add(barbGroup);
    parts.push({
        name: "Stylets (Barbs)",
        description: "Sharp spines at the base of the thread.",
        material: "Hardened Chitinous Material",
        function: "Punctures the prey's skin to allow thread entry.",
        assemblyOrder: 5,
        connections: ["Thread"],
        failureEffect: "Cannot penetrate thick skin/scales.",
        cascadeFailures: ["Venom not delivered"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -5, y: -5, z: -5 },
        mesh: barbGroup,
        isBarbs: true
    });

    const description = "The Nematocyst is a specialized subcellular organelle found in cnidarians (like jellyfish). It acts as a microscopic harpoon, utilizing incredible built-up osmotic pressure to fire a venomous thread at accelerations exceeding 5,000,000 g. It is one of the fastest mechanical processes in biology.";

    const quizQuestions = [
        {
            question: "What is the primary trigger mechanism for a nematocyst to fire?",
            options: [
                "Only light intensity changes",
                "Temperature fluctuations in the water",
                "Physical contact combined with chemical cues detected by the cnidocil",
                "Voluntary thought from the jellyfish's brain"
            ],
            correct: 2,
            explanation: "The cnidocil acts as a mechanoreceptor. When physical touch is combined with specific chemical signatures (like amino acids from prey), it triggers the firing mechanism.",
            difficulty: "Medium"
        },
        {
            question: "What physical force is primarily responsible for the explosive discharge of the thread?",
            options: [
                "Magnetic repulsion",
                "Osmotic pressure",
                "Muscle contraction",
                "Pneumatic air pressure"
            ],
            correct: 1,
            explanation: "The capsule contains a high concentration of calcium ions. When triggered, water rushes in due to osmosis, creating immense internal pressure that forces the thread out.",
            difficulty: "Hard"
        },
        {
            question: "What role do the stylets (barbs) play in the stinging process?",
            options: [
                "They produce the venom",
                "They act as a visual lure for prey",
                "They sense the prey's movement",
                "They puncture the target's skin to allow the thread to enter"
            ],
            correct: 3,
            explanation: "The stylets are sharp structures that punch a microscopic hole in the target's tissue, creating an opening for the hollow venomous thread to penetrate.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshes) {
        let operculum = null;
        let thread = null;
        let barbs = null;
        let cnidocil = null;

        for (const part of meshes) {
            if (part.name === "Operculum") operculum = part;
            if (part.name === "Venomous Thread") thread = part;
            if (part.name === "Stylets (Barbs)") barbs = part;
            if (part.name === "Cnidocil") cnidocil = part;
        }

        if (cnidocil) {
            cnidocil.rotation.x = Math.sin(time * 2 * speed) * 0.1;
        }

        const period = 5;
        const localTime = (time * speed) % period;

        if (localTime < 0.5) {
            if (operculum) {
                const targetRotX = Math.PI / 2;
                operculum.rotation.x = THREE.MathUtils.lerp(operculum.rotation.x, targetRotX, 0.2);
                operculum.position.y = THREE.MathUtils.lerp(operculum.position.y, 3.2, 0.2);
                operculum.position.z = THREE.MathUtils.lerp(operculum.position.z, 1.8, 0.2);
            }
            if (thread && barbs) {
                thread.scale.set(1, 1 + localTime * 20, 1);
                thread.position.y = localTime * 10;
                barbs.position.y = 2 + localTime * 20;
            }
        } else if (localTime < 4) {
             if (thread) thread.scale.y = 1 + 0.5 * 20;
             if (barbs) barbs.position.y = 2 + 0.5 * 20;
        } else {
            if (operculum) {
                operculum.rotation.x = THREE.MathUtils.lerp(operculum.rotation.x, 0, 0.1);
                operculum.position.y = THREE.MathUtils.lerp(operculum.position.y, 3, 0.1);
                operculum.position.z = THREE.MathUtils.lerp(operculum.position.z, 0, 0.1);
            }
            if (thread && barbs) {
                thread.scale.set(1, 1, 1);
                thread.position.y = 0;
                barbs.position.y = 0;
            }
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createJellyfishNematocyst() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
