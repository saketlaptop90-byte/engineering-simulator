import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials for visual flair
    const neonBlue = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8,
        roughness: 0.1,
        metalness: 0.9
    });

    const neonPink = new THREE.MeshPhysicalMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 1.2,
        roughness: 0.2,
        metalness: 0.5
    });

    // 1. Structural Frame
    const frameGeo = new THREE.BoxGeometry(10, 10, 1);
    const frameMesh = new THREE.Mesh(frameGeo, aluminum);
    group.add(frameMesh);
    parts.push({
        name: 'Structural Frame',
        description: 'Rigid aluminum frame holding the metamaterial unit cells.',
        material: 'aluminum',
        function: 'Structural support and vibration isolation',
        assemblyOrder: 1,
        connections: ['resonators', 'faceplate'],
        failureEffect: 'Panel loses structural integrity, causing misalignment.',
        cascadeFailures: ['membranes', 'piezoElements'],
        originalPosition: { x: 0, y: 0, z: -0.5 },
        explodedPosition: { x: 0, y: 0, z: -5 },
        mesh: frameMesh
    });

    // 2. Resonator Array
    const resGroup = new THREE.Group();
    for (let i = -4; i <= 4; i += 2) {
        for (let j = -4; j <= 4; j += 2) {
            const resGeo = new THREE.CylinderGeometry(0.8, 0.8, 1.5, 16);
            const resMesh = new THREE.Mesh(resGeo, plastic);
            resMesh.rotation.x = Math.PI / 2;
            resMesh.position.set(i, j, 0.5);
            resGroup.add(resMesh);
        }
    }
    group.add(resGroup);
    parts.push({
        name: 'Helmholtz Resonator Array',
        description: 'Grid of tuned cavities designed to absorb specific acoustic frequencies.',
        material: 'plastic',
        function: 'Absorb mid-to-high frequency sound waves via resonance.',
        assemblyOrder: 2,
        connections: ['frame', 'membranes'],
        failureEffect: 'Loss of narrow-band acoustic absorption.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 },
        mesh: resGroup
    });

    // 3. Membranes
    const memGroup = new THREE.Group();
    for (let i = -4; i <= 4; i += 2) {
        for (let j = -4; j <= 4; j += 2) {
            const memGeo = new THREE.CircleGeometry(0.7, 32);
            const memMesh = new THREE.Mesh(memGeo, rubber);
            memMesh.position.set(i, j, 1.3);
            memGroup.add(memMesh);
        }
    }
    group.add(memGroup);
    parts.push({
        name: 'Subwavelength Membranes',
        description: 'Flexible membranes that vibrate to absorb low-frequency sound energy.',
        material: 'rubber',
        function: 'Broadband low-frequency acoustic absorption.',
        assemblyOrder: 3,
        connections: ['resonators', 'piezoElements'],
        failureEffect: 'Inability to dampen low-frequency noise.',
        cascadeFailures: ['piezoElements'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 3 },
        mesh: memGroup
    });

    // 4. Piezo Elements
    const piezoGroup = new THREE.Group();
    for (let i = -4; i <= 4; i += 2) {
        for (let j = -4; j <= 4; j += 2) {
            const pGeo = new THREE.BoxGeometry(0.5, 0.5, 0.2);
            const pMesh = new THREE.Mesh(pGeo, neonBlue);
            pMesh.position.set(i, j, 1.4);
            piezoGroup.add(pMesh);
        }
    }
    group.add(piezoGroup);
    parts.push({
        name: 'Active Piezoelectric Sensors',
        description: 'Active noise cancellation elements that emit anti-phase sound waves.',
        material: 'neonBlue',
        function: 'Active suppression of variable acoustic frequencies.',
        assemblyOrder: 4,
        connections: ['membranes', 'faceplate'],
        failureEffect: 'Loss of active noise cancellation capabilities.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 6 },
        mesh: piezoGroup
    });

    // 5. Faceplate
    const faceGeo = new THREE.PlaneGeometry(10, 10);
    const faceMesh = new THREE.Mesh(faceGeo, darkSteel);
    faceMesh.position.z = 2.0;
    group.add(faceMesh);
    parts.push({
        name: 'Micro-perforated Faceplate',
        description: 'Protective outer layer with sub-millimeter perforations for acoustic impedance matching.',
        material: 'darkSteel',
        function: 'Physical protection and acoustic wave impedance matching.',
        assemblyOrder: 5,
        connections: ['frame', 'piezoElements'],
        failureEffect: 'Acoustic reflection increases, reducing overall panel efficiency.',
        cascadeFailures: ['resonators'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 9 },
        mesh: faceMesh
    });

    const description = "The Acoustics Metamaterial Panel is an advanced sound-dampening structure using artificial subwavelength structures to control, direct, and absorb acoustic waves beyond the limits of natural materials.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Helmholtz Resonator Array?",
            options: [
                "To reflect sound waves",
                "To absorb mid-to-high frequency sound waves via resonance",
                "To generate anti-phase noise",
                "To provide structural support"
            ],
            correct: 1,
            explanation: "Helmholtz resonators contain cavities that are tuned to resonate at specific frequencies, absorbing the acoustic energy.",
            difficulty: "Medium"
        },
        {
            question: "How do the Subwavelength Membranes contribute to sound dampening?",
            options: [
                "They actively cancel sound",
                "They vibrate to absorb low-frequency sound energy",
                "They reflect high-frequency sound",
                "They match acoustic impedance"
            ],
            correct: 1,
            explanation: "Subwavelength membranes vibrate in response to low-frequency sound, dissipating the acoustic energy as heat through mechanical movement.",
            difficulty: "Hard"
        },
        {
            question: "What role do the Active Piezoelectric Sensors play in the panel?",
            options: [
                "Active suppression by emitting anti-phase sound waves",
                "Physical protection of the resonators",
                "Increasing the weight of the panel",
                "Absorbing vibrations from the frame"
            ],
            correct: 0,
            explanation: "Piezoelectric elements are used for active noise cancellation, detecting incoming sound and emitting anti-phase waves to neutralize it.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Animate the active piezo elements glowing and vibrating
        const piezoPart = parts.find(p => p.name === 'Active Piezoelectric Sensors');
        if (piezoPart && piezoPart.mesh) {
            piezoPart.mesh.children.forEach((child, index) => {
                child.material.emissiveIntensity = 0.5 + Math.sin(time * 5 * speed + index) * 0.5;
                child.position.z = 1.4 + Math.sin(time * 10 * speed + index) * 0.05;
            });
        }

        // Animate the membranes vibrating
        const memPart = parts.find(p => p.name === 'Subwavelength Membranes');
        if (memPart && memPart.mesh) {
            memPart.mesh.children.forEach((child, index) => {
                child.scale.z = 1 + Math.sin(time * 8 * speed + index) * 0.2;
                child.position.z = 1.3 + Math.sin(time * 8 * speed + index) * 0.02;
            });
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createMetamaterialPanel() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
