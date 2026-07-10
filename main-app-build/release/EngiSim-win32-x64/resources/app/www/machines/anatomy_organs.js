import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Glowing Materials
    const lungMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xff6666,
        emissive: 0xff3333,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.8,
        roughness: 0.3,
        metalness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.2
    });

    const heartMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xff0000,
        emissive: 0x880000,
        emissiveIntensity: 0.8,
        roughness: 0.2,
        metalness: 0.4,
        clearcoat: 1.0
    });

    const liverMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x8b0000,
        emissive: 0x4a0000,
        emissiveIntensity: 0.4,
        roughness: 0.5,
        metalness: 0.2
    });

    const brainMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xaaaaaa,
        emissive: 0x4444ff,
        emissiveIntensity: 0.6,
        roughness: 0.4,
        metalness: 0.3,
        transparent: true,
        opacity: 0.9,
        wireframe: true // Holographic brain vibe
    });

    const stomachMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xe6b800,
        emissive: 0x664d00,
        emissiveIntensity: 0.3,
        roughness: 0.6,
        metalness: 0.1,
        transparent: true,
        opacity: 0.7
    });

    // Helper to add part
    function addPart(mesh, info) {
        mesh.position.copy(info.originalPosition);
        mesh.userData = { ...info, mesh };
        group.add(mesh);
        parts.push(info);
    }

    // 1. Brain (Holographic/Wireframe Sphere)
    const brainGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    const brainMesh = new THREE.Mesh(brainGeometry, brainMaterial);
    addPart(brainMesh, {
        name: "Brain",
        description: "The control center of the nervous system.",
        material: "Holographic Neural Tissue",
        function: "Processes sensory information, coordinates physical functions, and supports cognition.",
        assemblyOrder: 1,
        connections: ["Spinal Cord"],
        failureEffect: "Loss of consciousness and motor control.",
        cascadeFailures: ["Heart", "Lungs"],
        originalPosition: new THREE.Vector3(0, 8, 0),
        explodedPosition: new THREE.Vector3(0, 12, 0)
    });

    // 2. Heart (Pulsing Icosahedron/Sphere)
    const heartGeometry = new THREE.SphereGeometry(1, 16, 16);
    // scale to look a bit like a heart
    heartGeometry.scale(1, 1.2, 0.8);
    const heartMesh = new THREE.Mesh(heartGeometry, heartMaterial);
    addPart(heartMesh, {
        name: "Heart",
        description: "The primary pump for the circulatory system.",
        material: "Bio-Synthetic Muscle",
        function: "Pumps oxygenated blood through the body and returns deoxygenated blood to the lungs.",
        assemblyOrder: 2,
        connections: ["Lungs", "Brain", "Liver"],
        failureEffect: "Immediate cessation of blood flow.",
        cascadeFailures: ["Brain", "Lungs", "Liver"],
        originalPosition: new THREE.Vector3(0, 3, 0.5),
        explodedPosition: new THREE.Vector3(0, 4, 3)
    });

    // 3. Lungs (Expanding/Contracting Capsules)
    const lungGeometry = new THREE.CapsuleGeometry(1.2, 2, 16, 16);
    
    const leftLungMesh = new THREE.Mesh(lungGeometry, lungMaterial);
    addPart(leftLungMesh, {
        name: "Left Lung",
        description: "Primary respiratory organ.",
        material: "Porous Alveolar Matrix",
        function: "Facilitates gas exchange, introducing oxygen into the bloodstream.",
        assemblyOrder: 3,
        connections: ["Heart", "Trachea"],
        failureEffect: "Hypoxia.",
        cascadeFailures: ["Brain", "Heart"],
        originalPosition: new THREE.Vector3(-1.8, 3, 0),
        explodedPosition: new THREE.Vector3(-4, 4, 0)
    });

    const rightLungMesh = new THREE.Mesh(lungGeometry, lungMaterial);
    addPart(rightLungMesh, {
        name: "Right Lung",
        description: "Primary respiratory organ.",
        material: "Porous Alveolar Matrix",
        function: "Facilitates gas exchange, removing carbon dioxide.",
        assemblyOrder: 4,
        connections: ["Heart", "Trachea"],
        failureEffect: "Hypoxia.",
        cascadeFailures: ["Brain", "Heart"],
        originalPosition: new THREE.Vector3(1.8, 3, 0),
        explodedPosition: new THREE.Vector3(4, 4, 0)
    });

    // 4. Liver (Dark pulsing mass)
    const liverGeometry = new THREE.CylinderGeometry(2, 1.5, 1, 16);
    liverGeometry.rotateZ(Math.PI / 8);
    const liverMesh = new THREE.Mesh(liverGeometry, liverMaterial);
    addPart(liverMesh, {
        name: "Liver",
        description: "Metabolic powerhouse.",
        material: "Hepatic Lobules",
        function: "Detoxifies blood, synthesizes proteins, and produces biochemicals necessary for digestion.",
        assemblyOrder: 5,
        connections: ["Heart", "Stomach"],
        failureEffect: "Toxin buildup in the bloodstream.",
        cascadeFailures: ["Brain"],
        originalPosition: new THREE.Vector3(1, 0.5, 0),
        explodedPosition: new THREE.Vector3(3, 0, 2)
    });

    // 5. Stomach (Translucent capsule)
    const stomachGeometry = new THREE.SphereGeometry(1.2, 16, 16);
    stomachGeometry.scale(1.2, 0.8, 0.8);
    const stomachMesh = new THREE.Mesh(stomachGeometry, stomachMaterial);
    addPart(stomachMesh, {
        name: "Stomach",
        description: "Digestive processor.",
        material: "Gastric Mucosa",
        function: "Secretes acid and enzymes that digest food.",
        assemblyOrder: 6,
        connections: ["Liver", "Intestines"],
        failureEffect: "Inability to digest food effectively.",
        cascadeFailures: ["Liver"],
        originalPosition: new THREE.Vector3(-1, 0, 0),
        explodedPosition: new THREE.Vector3(-3, -1, 2)
    });

    const description = "A high-tech, cybernetic visualization of human internal anatomy. Features glowing, pulsing organs representing key biological functions: central control (Brain), circulation (Heart), respiration (Lungs), metabolism (Liver), and digestion (Stomach).";

    const quizQuestions = [
        {
            question: "Which organ is considered the primary metabolic powerhouse, detoxifying the blood?",
            options: ["Heart", "Lungs", "Liver", "Stomach"],
            correct: 2,
            explanation: "The liver detoxifies chemicals and secretes bile that ends up back in the intestines.",
            difficulty: "Medium"
        },
        {
            question: "What is the primary function of the lungs in this high-tech anatomy model?",
            options: ["Pumping blood", "Gas exchange", "Digesting food", "Information processing"],
            correct: 1,
            explanation: "Lungs facilitate the exchange of oxygen and carbon dioxide.",
            difficulty: "Easy"
        },
        {
            question: "In the event of heart failure, which systems undergo cascade failure first?",
            options: ["Stomach and Liver", "Brain, Lungs, Liver", "Lungs and Stomach", "Only the Brain"],
            correct: 1,
            explanation: "Heart failure stops blood flow, causing immediate hypoxia in the Brain, Lungs, and Liver.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        if (!meshes) return;
        
        const brain = meshes.find(m => m.userData.name === "Brain");
        if (brain) {
            brain.mesh.rotation.y = time * 0.5 * speed;
            brain.mesh.material.emissiveIntensity = 0.6 + Math.sin(time * 3 * speed) * 0.2;
        }

        const heart = meshes.find(m => m.userData.name === "Heart");
        if (heart) {
            // Heartbeat effect
            const beat = Math.pow(Math.sin(time * 5 * speed), 20); // Sharp pulse
            const scale = 1 + beat * 0.15;
            heart.mesh.scale.set(scale, scale * 1.2, scale * 0.8);
            heart.mesh.material.emissiveIntensity = 0.8 + beat * 0.5;
        }

        const leftLung = meshes.find(m => m.userData.name === "Left Lung");
        const rightLung = meshes.find(m => m.userData.name === "Right Lung");
        if (leftLung && rightLung) {
            // Breathing effect
            const breath = Math.sin(time * 2 * speed);
            const scaleX = 1 + breath * 0.1;
            const scaleY = 1 + breath * 0.15;
            
            leftLung.mesh.scale.set(scaleX, scaleY, scaleX);
            leftLung.mesh.material.emissiveIntensity = 0.5 + breath * 0.2;
            
            rightLung.mesh.scale.set(scaleX, scaleY, scaleX);
            rightLung.mesh.material.emissiveIntensity = 0.5 + breath * 0.2;
        }

        const liver = meshes.find(m => m.userData.name === "Liver");
        if (liver) {
            liver.mesh.position.y = liver.userData.originalPosition.y + Math.sin(time * 1.5 * speed) * 0.05;
        }
        
        const stomach = meshes.find(m => m.userData.name === "Stomach");
        if (stomach) {
            // Digestion churning
            stomach.mesh.scale.x = 1.2 + Math.sin(time * 1 * speed) * 0.05;
            stomach.mesh.scale.y = 0.8 + Math.cos(time * 1.2 * speed) * 0.05;
            stomach.mesh.scale.z = 0.8 + Math.sin(time * 1.4 * speed) * 0.05;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createOrgans() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
