import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // --- Custom High-Tech Materials ---
    const wedgeMaterial = new THREE.MeshStandardMaterial({
        color: 0x111118,
        roughness: 1.0,
        metalness: 0.0,
        flatShading: true
    });
    
    const neonCyan = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 2,
        transparent: true,
        opacity: 0.9
    });

    const neonPink = new THREE.MeshStandardMaterial({
        color: 0xff00aa,
        emissive: 0xff00aa,
        emissiveIntensity: 2
    });

    const holoMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x0088ff,
        emissiveIntensity: 0.2,
        wireframe: true,
        transparent: true,
        opacity: 0.15
    });

    // --- 1. Outer Isolation Shell ---
    const shellGeo = new THREE.BoxGeometry(12, 12, 12);
    const shellMesh = new THREE.Mesh(shellGeo, holoMaterial);
    shellMesh.position.set(0, 0, 0);
    group.add(shellMesh);
    parts.push({
        name: "Outer Isolation Shell",
        description: "Heavy concrete and steel layered structure floating on pneumatic isolators to decouple the room from external vibrations.",
        material: "Holographic/Steel",
        function: "Prevents external noise and vibrations from contaminating acoustic measurements.",
        assemblyOrder: 1,
        connections: ["Fiberglass Acoustic Wedges"],
        failureEffect: "External noise floor rises, invalidating precision measurements.",
        cascadeFailures: ["Quantum DAQ System"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 0 },
        mesh: shellMesh
    });

    // --- 2. Acoustic Wedges ---
    const wedgesGroup = new THREE.Group();
    const wedgeGeo = new THREE.ConeGeometry(0.4, 1.5, 4);
    wedgeGeo.translate(0, 0.75, 0); // Origin at base
    
    const wallsParams = [
        { rot: [0, 0, 0], pos: [0, -5.9, 0] }, // Floor
        { rot: [Math.PI, 0, 0], pos: [0, 5.9, 0] }, // Ceiling
        { rot: [Math.PI/2, 0, 0], pos: [0, 0, -5.9] }, // Back
        { rot: [-Math.PI/2, 0, 0], pos: [0, 0, 5.9] }, // Front
        { rot: [0, 0, -Math.PI/2], pos: [-5.9, 0, 0] }, // Left
        { rot: [0, 0, Math.PI/2], pos: [5.9, 0, 0] }  // Right
    ];

    wallsParams.forEach(wall => {
        const wallGroup = new THREE.Group();
        for(let i = -5; i <= 5; i++) {
            for(let j = -5; j <= 5; j++) {
                const w = new THREE.Mesh(wedgeGeo, wedgeMaterial);
                w.position.set(i * 1.0, 0, j * 1.0);
                if (Math.random() > 0.5) w.rotation.y = Math.PI/4;
                wallGroup.add(w);
            }
        }
        wallGroup.rotation.set(...wall.rot);
        wallGroup.position.set(...wall.pos);
        wedgesGroup.add(wallGroup);
    });
    group.add(wedgesGroup);
    parts.push({
        name: "Fiberglass Acoustic Wedges",
        description: "Deep, porous wedge structures lining all six interior surfaces to absorb sound waves.",
        material: "Fiberglass Foam",
        function: "Creates a free-field environment by eliminating sound reflections.",
        assemblyOrder: 2,
        connections: ["Outer Isolation Shell"],
        failureEffect: "Standing waves and echoes distort frequency response measurements.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -15 },
        mesh: wedgesGroup
    });

    // --- 3. Suspended Grid Floor ---
    const gridFloor = new THREE.GridHelper(10, 20, 0x00ffff, 0x444444);
    gridFloor.position.y = -1.5;
    group.add(gridFloor);
    parts.push({
        name: "Tensioned Wire Grid",
        description: "A walkable surface made of interlaced steel cables.",
        material: "Steel Cable",
        function: "Provides a floor for operators and equipment while remaining acoustically transparent.",
        assemblyOrder: 3,
        connections: ["Outer Isolation Shell"],
        failureEffect: "Sagging or snapping causes safety hazards and introduces resonant rattling.",
        cascadeFailures: ["Dodecahedron Omni-Source"],
        originalPosition: { x: 0, y: -1.5, z: 0 },
        explodedPosition: { x: 0, y: -8, z: 0 },
        mesh: gridFloor
    });

    // --- 4. OmniSpeaker (Sound Source) ---
    const speakerGroup = new THREE.Group();
    const coreGeo = new THREE.IcosahedronGeometry(0.8, 2);
    const coreMesh = new THREE.Mesh(coreGeo, darkSteel);
    speakerGroup.add(coreMesh);
    
    const ringGeo = new THREE.TorusGeometry(1.2, 0.05, 16, 64);
    const ring1 = new THREE.Mesh(ringGeo, neonCyan);
    const ring2 = new THREE.Mesh(ringGeo, neonPink);
    ring1.rotation.x = Math.PI/2;
    ring2.rotation.y = Math.PI/2;
    speakerGroup.add(ring1);
    speakerGroup.add(ring2);

    speakerGroup.position.set(0, 0, 0);
    group.add(speakerGroup);
    parts.push({
        name: "Dodecahedron Omni-Source",
        description: "High-power multi-driver speaker system emitting sound uniformly in all directions.",
        material: "Aluminum & Dark Steel",
        function: "Generates test signals (pink noise, sweeps) to excite the room or test microphones.",
        assemblyOrder: 4,
        connections: ["Tensioned Wire Grid", "Quantum DAQ System"],
        failureEffect: "Uneven sound directivity or distortion.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 10 },
        mesh: speakerGroup
    });

    // --- 5. Mic Array Arc ---
    const arcGroup = new THREE.Group();
    const boomGeo = new THREE.TorusGeometry(3.5, 0.05, 8, 32, Math.PI);
    const boomMesh = new THREE.Mesh(boomGeo, chrome);
    boomMesh.rotation.z = Math.PI/2;
    arcGroup.add(boomMesh);

    const micGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.4);
    for(let i=0; i<=8; i++) {
        const angle = (i/8) * Math.PI - Math.PI/2;
        const mic = new THREE.Mesh(micGeo, neonCyan);
        mic.position.set(Math.cos(angle)*3.5, Math.sin(angle)*3.5, 0);
        mic.rotation.z = angle;
        arcGroup.add(mic);
    }

    group.add(arcGroup);
    parts.push({
        name: "Precision Mic Arc",
        description: "Automated rotating boom arm fitted with Class 1 measurement microphones.",
        material: "Chrome/Aluminum",
        function: "Captures high-resolution 3D directivity balloon data by rotating around the source.",
        assemblyOrder: 5,
        connections: ["Quantum DAQ System"],
        failureEffect: "Spatial aliasing or incorrect directivity plots.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 10, y: 0, z: 0 },
        mesh: arcGroup
    });

    // --- 6. Data Acquisition Unit (DAQ) ---
    const daqGeo = new THREE.BoxGeometry(1, 1.5, 1);
    const daqMesh = new THREE.Mesh(daqGeo, neonPink);
    daqMesh.position.set(4, -0.75, 4);
    group.add(daqMesh);
    parts.push({
        name: "Quantum DAQ System",
        description: "Ultra-low-noise multichannel analog-to-digital converter.",
        material: "Titanium/Glass",
        function: "Processes incoming microphone voltages into high-fidelity digital audio streams.",
        assemblyOrder: 6,
        connections: ["Precision Mic Arc", "Dodecahedron Omni-Source"],
        failureEffect: "Clipping, jitter, or high noise floor ruins the measurements.",
        cascadeFailures: [],
        originalPosition: { x: 4, y: -0.75, z: 4 },
        explodedPosition: { x: 8, y: -5, z: 8 },
        mesh: daqMesh
    });

    const description = "The Acoustics Anechoic Chamber is an ultra-high-tech acoustic environment designed to completely absorb reflections of sound or electromagnetic waves. Fitted with fiberglass wedges, floating structures, and precision microphone arrays, it achieves a true free-field condition for testing loudspeakers, microphones, and quiet machinery.";

    const quizQuestions = [
        {
            question: "What is the primary function of the fiberglass acoustic wedges covering the chamber walls?",
            options: [
                "To look visually impressive",
                "To absorb sound waves and prevent reflections",
                "To emit test signals",
                "To structurally support the ceiling"
            ],
            correct: 1,
            explanation: "Acoustic wedges are shaped and made of porous material to gradually match the acoustic impedance of air, highly absorbing sound waves and preventing echoes.",
            difficulty: "Easy"
        },
        {
            question: "Why is the floor of an anechoic chamber typically made of a tensioned wire grid?",
            options: [
                "It is cheaper than concrete",
                "It looks more futuristic",
                "It allows sound to pass through to the bottom wedges without reflecting",
                "It generates an acoustic resonance"
            ],
            correct: 2,
            explanation: "A solid floor would reflect sound. A tensioned wire grid is acoustically transparent, allowing waves to hit the absorptive wedges underneath.",
            difficulty: "Medium"
        },
        {
            question: "What does the outer isolation shell protect the chamber from?",
            options: [
                "External structural vibrations and ambient noise",
                "Internal acoustic reflections",
                "Laser interference",
                "Thermal radiation from the speaker"
            ],
            correct: 0,
            explanation: "To measure extremely quiet sound sources, the chamber must be completely isolated from building vibrations and outside noise, often achieved by floating the entire room on springs.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        if (speakerGroup) {
            speakerGroup.children[1].rotation.z += 0.02 * speed;
            speakerGroup.children[2].rotation.x += 0.03 * speed;
            const scale = 1 + 0.05 * Math.sin(time * 10 * speed);
            speakerGroup.children[0].scale.set(scale, scale, scale);
        }

        if (arcGroup) {
            arcGroup.rotation.y += 0.01 * speed;
        }

        if (daqMesh) {
            daqMesh.material.emissiveIntensity = 1.5 + 0.5 * Math.sin(time * 5 * speed);
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createAnechoicChamber() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
