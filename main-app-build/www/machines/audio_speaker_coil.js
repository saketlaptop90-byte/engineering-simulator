import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.8
    });

    const neonOrange = new THREE.MeshStandardMaterial({
        color: 0xff8c00,
        emissive: 0xff8c00,
        emissiveIntensity: 0.5
    });

    const magneticFluxMat = new THREE.MeshBasicMaterial({
        color: 0xaa00ff,
        transparent: true,
        opacity: 0.3,
        wireframe: true
    });

    // 1. Magnet Structure (Permanent Magnet + Pole Piece)
    const magnetGeo = new THREE.CylinderGeometry(4, 4, 1.5, 32);
    const magnet = new THREE.Mesh(magnetGeo, darkSteel.clone());
    magnet.position.set(0, 0, 0);
    group.add(magnet);
    parts.push({
        name: "Permanent Magnet",
        description: "Creates a strong, constant magnetic field.",
        material: "darkSteel",
        function: "Provides the static magnetic field for the voice coil to react against.",
        assemblyOrder: 1,
        connections: ["Pole Piece", "Back Plate"],
        failureEffect: "Loss of magnetic field, resulting in no sound output.",
        cascadeFailures: ["Voice Coil overheating due to lack of motion"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 },
        mesh: magnet
    });

    const polePieceGeo = new THREE.CylinderGeometry(2, 2, 2.5, 32);
    const polePiece = new THREE.Mesh(polePieceGeo, steel.clone());
    polePiece.position.set(0, 1, 0);
    group.add(polePiece);
    parts.push({
        name: "Pole Piece (T-Yoke)",
        description: "Focuses the magnetic field into the voice coil gap.",
        material: "steel",
        function: "Concentrates magnetic flux lines across the gap.",
        assemblyOrder: 2,
        connections: ["Permanent Magnet", "Voice Coil Gap"],
        failureEffect: "Weak magnetic field in the gap, leading to poor efficiency.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 1, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 },
        mesh: polePiece
    });

    // 2. Voice Coil (Former + Wire)
    const formerGeo = new THREE.CylinderGeometry(2.1, 2.1, 2, 32, 1, true);
    const former = new THREE.Mesh(formerGeo, aluminum.clone());
    former.position.set(0, 1.5, 0);
    group.add(former);
    parts.push({
        name: "Voice Coil Former",
        description: "A lightweight cylinder that holds the voice coil wire.",
        material: "aluminum",
        function: "Transfers the motion of the coil to the speaker cone while dissipating heat.",
        assemblyOrder: 3,
        connections: ["Voice Coil Wire", "Spider", "Speaker Cone"],
        failureEffect: "Deformation can cause rubbing against the pole piece.",
        cascadeFailures: ["Voice Coil Short Circuit", "Distorted Sound"],
        originalPosition: { x: 0, y: 1.5, z: 0 },
        explodedPosition: { x: 0, y: 4, z: 0 },
        mesh: former
    });

    // Voice coil wire represented as a spiral or stacked rings
    const coilGroup = new THREE.Group();
    coilGroup.position.set(0, 1.5, 0);
    const wireGeo = new THREE.TorusGeometry(2.15, 0.05, 16, 64);
    for (let i = 0; i < 15; i++) {
        const ring = new THREE.Mesh(wireGeo, copper.clone());
        ring.position.y = -0.5 + (i * 0.07);
        ring.rotation.x = Math.PI / 2;
        coilGroup.add(ring);
    }
    group.add(coilGroup);
    parts.push({
        name: "Voice Coil Wire",
        description: "Copper wire tightly wound around the former.",
        material: "copper",
        function: "Creates an alternating magnetic field when audio signals pass through it, interacting with the permanent magnet.",
        assemblyOrder: 4,
        connections: ["Voice Coil Former", "Lead Wires"],
        failureEffect: "Open circuit results in complete failure; short circuit changes impedance and alters sound.",
        cascadeFailures: ["Amplifier Damage (if shorted)", "Burnt Coil"],
        originalPosition: { x: 0, y: 1.5, z: 0 },
        explodedPosition: { x: 0, y: 6, z: 0 },
        mesh: coilGroup
    });

    // 3. Spider (Suspension)
    const spiderGeo = new THREE.RingGeometry(2.2, 5, 32);
    const spiderMat = new THREE.MeshStandardMaterial({ color: 0x8b4513, wireframe: true });
    const spider = new THREE.Mesh(spiderGeo, spiderMat);
    spider.rotation.x = -Math.PI / 2;
    spider.position.set(0, 2.5, 0);
    group.add(spider);
    parts.push({
        name: "Spider (Suspension)",
        description: "A corrugated fabric ring.",
        material: "fabric (represented as wireframe)",
        function: "Keeps the voice coil centered in the magnetic gap and provides a restoring force.",
        assemblyOrder: 5,
        connections: ["Voice Coil Former", "Speaker Frame"],
        failureEffect: "Loss of centering causes voice coil rub; loss of stiffness changes resonant frequency.",
        cascadeFailures: ["Voice Coil Damage"],
        originalPosition: { x: 0, y: 2.5, z: 0 },
        explodedPosition: { x: 0, y: 8, z: 0 },
        mesh: spider
    });

    // 4. Flux Lines (Visual effect)
    const fluxGeo = new THREE.TorusGeometry(3.5, 1, 16, 64);
    const flux = new THREE.Mesh(fluxGeo, magneticFluxMat);
    flux.rotation.x = Math.PI / 2;
    flux.position.set(0, 1, 0);
    group.add(flux);
    parts.push({
        name: "Magnetic Flux Field",
        description: "Visualization of the magnetic field in the gap.",
        material: "neonBlue",
        function: "Interacts with the voice coil's electromagnetic field to produce motion.",
        assemblyOrder: 6,
        connections: [],
        failureEffect: "N/A (Visualization)",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 1, z: 0 },
        explodedPosition: { x: 0, y: 1, z: 0 },
        mesh: flux
    });

    const description = "The Audio Speaker Voice Coil is the motor of a loudspeaker. It consists of a coil of wire (the voice coil) suspended in a strong magnetic field created by a permanent magnet. When an alternating audio current flows through the coil, it generates a changing electromagnetic field that interacts with the static magnetic field, forcing the coil—and the attached speaker cone—to move back and forth, producing sound waves.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Voice Coil in a speaker?",
            options: [
                "To store electrical energy",
                "To generate a static magnetic field",
                "To convert electrical audio signals into mechanical motion",
                "To cool down the permanent magnet"
            ],
            correct: 2,
            explanation: "The voice coil acts as an electromagnet. When the alternating audio signal passes through it, it interacts with the permanent magnet's field, causing it to move and drive the speaker cone.",
            difficulty: "easy"
        },
        {
            question: "What happens if the 'Spider' fails or loses its stiffness?",
            options: [
                "The speaker plays louder",
                "The voice coil may rub against the pole piece, causing distortion or damage",
                "The permanent magnet loses its magnetism",
                "The audio signal becomes digital"
            ],
            correct: 1,
            explanation: "The spider's job is to keep the voice coil perfectly centered in the tight magnetic gap. If it fails, the coil can scrape against the metal, damaging the wire and distorting the sound.",
            difficulty: "medium"
        },
        {
            question: "Why is the Voice Coil Former often made of aluminum or Kapton?",
            options: [
                "To increase the magnetic strength of the coil",
                "Because they are heavy and prevent unwanted vibrations",
                "To conduct electricity better than copper",
                "To provide structural rigidity while dissipating heat generated by the coil"
            ],
            correct: 3,
            explanation: "The former must be lightweight, rigid, and able to withstand and dissipate the significant heat generated by the electrical current flowing through the voice coil wire.",
            difficulty: "hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Animate Voice Coil moving up and down based on a sine wave (simulating audio signal)
        const offset = Math.sin(time * speed * 10) * 0.5;
        
        const coilMesh = meshes.find(m => m.name === "Voice Coil Wire");
        const formerMesh = meshes.find(m => m.name === "Voice Coil Former");
        const spiderMesh = meshes.find(m => m.name === "Spider (Suspension)");
        const fluxMesh = meshes.find(m => m.name === "Magnetic Flux Field");

        if (coilMesh && coilMesh.mesh) coilMesh.mesh.position.y = 1.5 + offset;
        if (formerMesh && formerMesh.mesh) formerMesh.mesh.position.y = 1.5 + offset;
        
        // Flex the spider
        if (spiderMesh && spiderMesh.mesh) {
            spiderMesh.mesh.position.y = 2.5 + offset;
            spiderMesh.mesh.scale.z = 1 + Math.abs(offset) * 0.1; 
        }

        // Pulse the flux field to make it look dynamic
        if (fluxMesh && fluxMesh.mesh) {
            fluxMesh.mesh.material.opacity = 0.3 + Math.sin(time * speed * 5) * 0.1;
            fluxMesh.mesh.rotation.z += 0.01 * speed;
        }

        // Add a neon glow effect to the coil depending on 'current' (speed of movement)
        if (coilMesh && coilMesh.mesh) {
            const children = coilMesh.mesh.children;
            const currentIntensity = Math.abs(Math.cos(time * speed * 10));
            children.forEach(child => {
                if(child.material && child.material.emissive) {
                    child.material.emissive.setHex(0xffaa00);
                    child.material.emissiveIntensity = currentIntensity * 0.5;
                }
            });
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createSpeakerCoil() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
