import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const medicalTitanium = new THREE.MeshPhysicalMaterial({
        color: 0xe0e5e5,
        metalness: 0.9,
        roughness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
    });
    
    const glowingBioMatrix = new THREE.MeshStandardMaterial({
        color: 0x00ffcc,
        emissive: 0x00ffcc,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.8
    });

    const threadMaterial = new THREE.MeshStandardMaterial({
        color: 0x33bbee,
        emissive: 0x1177aa,
        emissiveIntensity: 0.8,
        metalness: 0.8,
        roughness: 0.1
    });

    const holographicBone = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        emissive: 0x224455,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.3,
        transmission: 0.9,
        ior: 1.5
    });

    const cortexMaterial = new THREE.MeshStandardMaterial({
        color: 0xffddaa,
        emissive: 0xaa5500,
        emissiveIntensity: 0.2,
        wireframe: true,
        transparent: true,
        opacity: 0.15
    });

    // 1. Screw Head (Hex Socket)
    const headGeom = new THREE.CylinderGeometry(0.8, 0.8, 1.2, 32);
    const headMesh = new THREE.Mesh(headGeom, medicalTitanium);
    headMesh.position.set(0, 5, 0);
    headMesh.castShadow = true;
    headMesh.receiveShadow = true;
    group.add(headMesh);

    // Inner hex socket
    const hexGeom = new THREE.CylinderGeometry(0.4, 0.4, 1.3, 6);
    const hexMesh = new THREE.Mesh(hexGeom, threadMaterial);
    hexMesh.position.set(0, 5, 0);
    group.add(hexMesh);

    parts.push({
        name: "Hex Socket Head",
        description: "Precision-machined titanium head with a hexagonal socket for driver engagement.",
        material: "Medical Grade Titanium",
        function: "Interfaces with the surgical driver to transmit torque during insertion.",
        assemblyOrder: 1,
        connections: ["Screw Shaft", "Locking Interface"],
        failureEffect: "Stripped socket prevents insertion or removal of the implant.",
        cascadeFailures: ["Implant cannot be secured", "Surgical delay"],
        originalPosition: { x: 0, y: 5, z: 0 },
        explodedPosition: { x: 0, y: 10, z: 0 }
    });

    // 2. Screw Shaft (Core)
    const shaftGeom = new THREE.CylinderGeometry(0.4, 0.3, 8, 32);
    const shaftMesh = new THREE.Mesh(shaftGeom, medicalTitanium);
    shaftMesh.position.set(0, 0.4, 0);
    group.add(shaftMesh);

    parts.push({
        name: "Tapered Shaft",
        description: "Tapered titanium core providing structural integrity.",
        material: "Medical Grade Titanium",
        function: "Bears the load and distributes stress along the length of the screw.",
        assemblyOrder: 2,
        connections: ["Hex Socket Head", "Cortical Threads", "Cancellous Threads"],
        failureEffect: "Fracture under load.",
        cascadeFailures: ["Loss of fixation", "Bone malunion"],
        originalPosition: { x: 0, y: 0.4, z: 0 },
        explodedPosition: { x: 5, y: 0.4, z: 0 }
    });

    // 3. Threads (Helical Geometry using TorusKnot or custom math)
    const threadsGroup = new THREE.Group();
    const numThreads = 15;
    for (let i = 0; i < numThreads; i++) {
        const threadGeom = new THREE.TorusGeometry(0.55 - (i * 0.015), 0.15, 8, 32);
        const threadPart = new THREE.Mesh(threadGeom, threadMaterial);
        threadPart.rotation.x = Math.PI / 2;
        threadPart.rotation.y = 0.1; // pitch angle
        threadPart.position.set(0, 4 - (i * 0.5), 0);
        threadsGroup.add(threadPart);
    }
    group.add(threadsGroup);

    parts.push({
        name: "Cortical/Cancellous Threads",
        description: "Dynamic self-tapping thread profile with dual-pitch design.",
        material: "Titanium Alloy with Glowing Bioceramic Coating",
        function: "Engages bone tissue to provide pull-out resistance and compression.",
        assemblyOrder: 3,
        connections: ["Tapered Shaft", "Surrounding Bone Matrix"],
        failureEffect: "Thread stripping within the bone.",
        cascadeFailures: ["Implant loosening", "Infection risk"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -5, y: 0, z: 0 }
    });

    // 4. Cutting Flute (Self-tapping tip)
    const tipGeom = new THREE.ConeGeometry(0.3, 1.5, 16);
    const tipMesh = new THREE.Mesh(tipGeom, medicalTitanium);
    tipMesh.rotation.z = Math.PI;
    tipMesh.position.set(0, -4.3, 0);
    group.add(tipMesh);

    parts.push({
        name: "Self-Tapping Tip",
        description: "Sharp conical tip with cutting flutes for bone penetration.",
        material: "Hardened Medical Titanium",
        function: "Cuts a thread path into the bone without prior tapping.",
        assemblyOrder: 4,
        connections: ["Tapered Shaft"],
        failureEffect: "Tip blunting or breakage.",
        cascadeFailures: ["Excessive torque required", "Bone thermal necrosis"],
        originalPosition: { x: 0, y: -4.3, z: 0 },
        explodedPosition: { x: 0, y: -8, z: 0 }
    });

    // 5. Holographic Bone Matrix (Visual Flair)
    const boneGeom = new THREE.CylinderGeometry(2, 2, 8, 32);
    const boneMesh = new THREE.Mesh(boneGeom, holographicBone);
    boneMesh.position.set(0, 0, 0);
    group.add(boneMesh);

    // Cortex shell
    const cortexGeom = new THREE.CylinderGeometry(2.1, 2.1, 8.2, 16);
    const cortexMesh = new THREE.Mesh(cortexGeom, cortexMaterial);
    cortexMesh.position.set(0, 0, 0);
    group.add(cortexMesh);

    parts.push({
        name: "Holographic Bone Matrix",
        description: "Simulated cancellous and cortical bone structure.",
        material: "Holographic Projection",
        function: "Visualizes the osseointegration environment and stress distribution.",
        assemblyOrder: 5,
        connections: ["Cortical/Cancellous Threads"],
        failureEffect: "Osteoporosis or poor bone quality.",
        cascadeFailures: ["Fixation failure", "Screw pull-out"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 8 }
    });

    // 6. Bio-Active Coating (Energy Aura)
    const coatingGeom = new THREE.CylinderGeometry(0.6, 0.5, 7.5, 32);
    const coatingMesh = new THREE.Mesh(coatingGeom, glowingBioMatrix);
    coatingMesh.position.set(0, 0.5, 0);
    group.add(coatingMesh);
    
    parts.push({
        name: "Bio-Active Hydroxyapatite Coating",
        description: "Electromagnetic stimulated coating to promote bone growth.",
        material: "Glowing Bioceramic",
        function: "Accelerates osseointegration and reduces rejection rates.",
        assemblyOrder: 6,
        connections: ["Tapered Shaft", "Holographic Bone Matrix"],
        failureEffect: "Coating delamination.",
        cascadeFailures: ["Poor integration", "Fibrous tissue formation"],
        originalPosition: { x: 0, y: 0.5, z: 0 },
        explodedPosition: { x: 0, y: 0.5, z: -8 }
    });

    const description = "The Orthopedic Bone Screw Implant represents the pinnacle of biomedical engineering for surgical fixation. Constructed from medical-grade titanium and enhanced with a glowing bio-active hydroxyapatite coating, this self-tapping screw ensures maximum torque transmission via its precision hex socket head while optimizing pull-out resistance with a dual-pitch thread design. The holographic bone matrix provides real-time feedback on osseointegration and stress distribution.";

    const quizQuestions = [
        {
            question: "What is the primary function of the self-tapping tip?",
            options: ["To connect to the driver head", "To cut a thread path without prior tapping", "To deliver bio-active chemicals", "To hold the bone fragments externally"],
            correct: 1,
            explanation: "The self-tapping tip features cutting flutes that allow the screw to cut its own path into the bone, eliminating the need to tap a thread beforehand and reducing surgical time.",
            difficulty: "Medium"
        },
        {
            question: "Why is a dual-pitch thread design often used in bone screws?",
            options: ["To increase the weight of the screw", "To make it easier to manufacture", "To provide different compression rates in cortical vs. cancellous bone", "To prevent osseointegration"],
            correct: 2,
            explanation: "Different thread pitches engage differently with hard cortical bone and softer cancellous bone, optimizing compression and pull-out resistance.",
            difficulty: "Hard"
        },
        {
            question: "What does the bio-active hydroxyapatite coating promote?",
            options: ["Corrosion", "Infection", "Osseointegration (bone growth onto the implant)", "Thermal necrosis"],
            correct: 2,
            explanation: "Hydroxyapatite is a naturally occurring mineral form of calcium apatite, which is a major component of normal bone. Coating implants with it encourages the bone to grow and integrate with the implant.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Let's assume meshes are available in group.children based on the order added
        const head = group.children[0];
        const hex = group.children[1];
        const shaft = group.children[2];
        const threads = group.children[3]; // The threads group
        const tip = group.children[4];
        const bone = group.children[5];
        const cortex = group.children[6];
        const coating = group.children[7];

        const rotationSpeed = time * speed * 0.5;
        
        // Rotate the screw components together
        head.rotation.y = rotationSpeed;
        hex.rotation.y = rotationSpeed;
        shaft.rotation.y = rotationSpeed;
        threads.rotation.y = rotationSpeed;
        tip.rotation.y = rotationSpeed;
        coating.rotation.y = rotationSpeed;

        // Pulse the bio-active coating
        const pulse = (Math.sin(time * speed * 3) + 1) / 2; // 0 to 1
        glowingBioMatrix.emissiveIntensity = 0.3 + (pulse * 0.7);
        
        // Thread material color cycle for high-tech effect
        threadMaterial.emissive.setHSL((time * speed * 0.1) % 1.0, 0.8, 0.5);

        // Holographic bone scanning effect
        cortexMaterial.opacity = 0.1 + (Math.sin(time * speed * 2) * 0.05);
        cortex.position.y = Math.sin(time * speed * 0.5) * 0.2;
        bone.position.y = Math.sin(time * speed * 0.5) * 0.2;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createOrthopedicBoneScrewImplant() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
