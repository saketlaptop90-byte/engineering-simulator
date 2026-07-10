import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom materials
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8,
        metalness: 0.1,
        roughness: 0.2
    });

    const neonPurple = new THREE.MeshStandardMaterial({
        color: 0x8800ff,
        emissive: 0x8800ff,
        emissiveIntensity: 1.2,
        transparent: true,
        opacity: 0.9,
        metalness: 0.2,
        roughness: 0.1
    });

    const plasmaMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.6,
        wireframe: true
    });

    // 1. Base Platform
    const baseGeometry = new THREE.CylinderGeometry(5, 5, 1, 32);
    const baseMesh = new THREE.Mesh(baseGeometry, darkSteel);
    baseMesh.position.set(0, 0, 0);
    group.add(baseMesh);
    meshes.base = baseMesh;

    parts.push({
        name: "Containment Base",
        description: "Primary foundation containing power routing and stability gyros.",
        material: "Dark Steel",
        function: "Provides structural integrity and houses the main power distribution matrix.",
        assemblyOrder: 1,
        connections: ["Lower Transducer Array", "Power Coils"],
        failureEffect: "Complete system destabilization.",
        cascadeFailures: ["Transducer Array", "Field Generators"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 }
    });

    // 2. Lower Transducer Array
    const lowerTransducerGeo = new THREE.CylinderGeometry(4, 4, 0.5, 32);
    const lowerTransducerMesh = new THREE.Mesh(lowerTransducerGeo, aluminum);
    lowerTransducerMesh.position.set(0, 0.75, 0);
    group.add(lowerTransducerMesh);
    meshes.lowerTransducer = lowerTransducerMesh;

    parts.push({
        name: "Lower Ultrasonic Transducer Array",
        description: "Emits high-frequency sound waves upwards.",
        material: "Aluminum",
        function: "Generates the primary lifting acoustic pressure wave.",
        assemblyOrder: 2,
        connections: ["Containment Base", "Levitation Cavity"],
        failureEffect: "Loss of upward acoustic pressure, causing levitated object to drop.",
        cascadeFailures: ["Standing Wave Formations"],
        originalPosition: { x: 0, y: 0.75, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 }
    });

    // 3. Emitter Nodes (Lower)
    const emitterGeo = new THREE.SphereGeometry(0.2, 16, 16);
    meshes.lowerNodes = [];
    for (let i = 0; i < 12; i++) {
        const node = new THREE.Mesh(emitterGeo, neonBlue);
        const angle = (i / 12) * Math.PI * 2;
        node.position.set(Math.cos(angle) * 3, 1, Math.sin(angle) * 3);
        group.add(node);
        meshes.lowerNodes.push(node);
    }

    parts.push({
        name: "Lower Phase Emitters",
        description: "Individual phased array emitters.",
        material: "Neon Blue Crystal",
        function: "Modulates acoustic wave phases to dynamically control the pressure nodes.",
        assemblyOrder: 3,
        connections: ["Lower Transducer Array"],
        failureEffect: "Unstable levitation field.",
        cascadeFailures: ["Levitated Object Stability"],
        originalPosition: { x: 0, y: 1, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 8 }
    });

    // 4. Chamber Glass
    const glassGeo = new THREE.CylinderGeometry(4.5, 4.5, 8, 32, 1, true);
    const glassMesh = new THREE.Mesh(glassGeo, glass);
    glassMesh.position.set(0, 5, 0);
    group.add(glassMesh);
    meshes.glass = glassMesh;

    parts.push({
        name: "Vacuum Containment Glass",
        description: "Acoustically transparent pressure vessel.",
        material: "Reinforced Glass",
        function: "Maintains environmental conditions while allowing acoustic waves to resonate.",
        assemblyOrder: 4,
        connections: ["Containment Base", "Upper Housing"],
        failureEffect: "Environmental contamination, acoustic leakage.",
        cascadeFailures: ["Resonance Efficiency"],
        originalPosition: { x: 0, y: 5, z: 0 },
        explodedPosition: { x: 10, y: 5, z: 0 }
    });

    // 5. Support Pillars
    meshes.pillars = [];
    const pillarGeo = new THREE.CylinderGeometry(0.3, 0.3, 8.5, 16);
    for (let i = 0; i < 4; i++) {
        const pillar = new THREE.Mesh(pillarGeo, chrome);
        const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
        pillar.position.set(Math.cos(angle) * 4.8, 5, Math.sin(angle) * 4.8);
        group.add(pillar);
        meshes.pillars.push(pillar);
    }

    parts.push({
        name: "Structural Resonance Pillars",
        description: "Chrome pillars that support the upper housing.",
        material: "Chrome",
        function: "Absorbs excess vibrations and structurally supports the reflector.",
        assemblyOrder: 5,
        connections: ["Containment Base", "Upper Housing"],
        failureEffect: "Structural collapse under acoustic pressure.",
        cascadeFailures: ["Upper Transducer Array", "Vacuum Containment Glass"],
        originalPosition: { x: 0, y: 5, z: 0 },
        explodedPosition: { x: -8, y: 5, z: -8 }
    });

    // 6. Upper Housing / Reflector Base
    const upperBaseGeo = new THREE.CylinderGeometry(5, 5, 1, 32);
    const upperBaseMesh = new THREE.Mesh(upperBaseGeo, darkSteel);
    upperBaseMesh.position.set(0, 9.5, 0);
    group.add(upperBaseMesh);
    meshes.upperBase = upperBaseMesh;

    parts.push({
        name: "Upper Housing",
        description: "Houses the acoustic reflector and upper array.",
        material: "Dark Steel",
        function: "Provides a rigid boundary to reflect acoustic waves and create standing waves.",
        assemblyOrder: 6,
        connections: ["Structural Resonance Pillars", "Upper Transducer Array"],
        failureEffect: "Loss of standing wave.",
        cascadeFailures: ["Levitation Field"],
        originalPosition: { x: 0, y: 9.5, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 0 }
    });

    // 7. Upper Transducer Array / Reflector
    const upperTransducerGeo = new THREE.CylinderGeometry(4, 4, 0.5, 32);
    const upperTransducerMesh = new THREE.Mesh(upperTransducerGeo, aluminum);
    upperTransducerMesh.position.set(0, 9, 0);
    group.add(upperTransducerMesh);
    meshes.upperTransducer = upperTransducerMesh;

    parts.push({
        name: "Acoustic Reflector",
        description: "Highly polished aluminum reflecting surface.",
        material: "Aluminum",
        function: "Bounces incoming acoustic waves back to form high-pressure nodes.",
        assemblyOrder: 7,
        connections: ["Upper Housing", "Levitation Cavity"],
        failureEffect: "Waves pass through or scatter, destroying levitation nodes.",
        cascadeFailures: ["Acoustic Nodes"],
        originalPosition: { x: 0, y: 9, z: 0 },
        explodedPosition: { x: 0, y: 12, z: 0 }
    });
    
    // 8. Emitter Nodes (Upper)
    meshes.upperNodes = [];
    for (let i = 0; i < 12; i++) {
        const node = new THREE.Mesh(emitterGeo, neonPurple);
        const angle = (i / 12) * Math.PI * 2;
        node.position.set(Math.cos(angle) * 3, 8.75, Math.sin(angle) * 3);
        group.add(node);
        meshes.upperNodes.push(node);
    }

    parts.push({
        name: "Upper Phase Emitters",
        description: "Secondary phased array emitters.",
        material: "Neon Purple Crystal",
        function: "Fine-tunes the reflected waves for precise spatial manipulation.",
        assemblyOrder: 8,
        connections: ["Acoustic Reflector"],
        failureEffect: "Wobble in levitated objects.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 8.75, z: 0 },
        explodedPosition: { x: 0, y: 11, z: 8 }
    });

    // 9. Levitated Object (Plasma Sphere)
    const levitatedGeo = new THREE.IcosahedronGeometry(0.8, 2);
    const levitatedMesh = new THREE.Mesh(levitatedGeo, plasmaMaterial);
    levitatedMesh.position.set(0, 5, 0);
    group.add(levitatedMesh);
    meshes.levitated = levitatedMesh;

    parts.push({
        name: "Test Subject",
        description: "A superheated plasma sphere held in acoustic stasis.",
        material: "Plasma",
        function: "Visual indicator of the acoustic node stability.",
        assemblyOrder: 9,
        connections: ["Acoustic Nodes"],
        failureEffect: "Drops and rapidly cools/dissipates.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 5, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 12 }
    });

    // 10. Acoustic Field Visualizers (Rings)
    meshes.rings = [];
    const ringGeo = new THREE.TorusGeometry(3.5, 0.05, 16, 64);
    for (let i = 0; i < 5; i++) {
        const ring = new THREE.Mesh(ringGeo, neonBlue);
        ring.position.set(0, 2 + i * 1.5, 0);
        ring.rotation.x = Math.PI / 2;
        group.add(ring);
        meshes.rings.push(ring);
    }

    parts.push({
        name: "Acoustic Pressure Nodes",
        description: "Visual representation of standing wave nodes.",
        material: "Neon Energy",
        function: "Regions of minimal acoustic pressure where objects become trapped.",
        assemblyOrder: 10,
        connections: ["Lower Transducer Array", "Acoustic Reflector"],
        failureEffect: "Rings dissipate, dropping contents.",
        cascadeFailures: ["Test Subject"],
        originalPosition: { x: 0, y: 5, z: 0 },
        explodedPosition: { x: 0, y: 5, z: -12 }
    });


    const description = "The Acoustic Levitation Chamber utilizes precisely tuned ultrasonic transducers to create standing waves. By reflecting high-frequency sound waves off a parallel surface, distinct pressure nodes form, allowing matter to be suspended in mid-air entirely via acoustic radiation pressure.";

    const quizQuestions = [
        {
            question: "What physical phenomenon is primarily responsible for holding an object in mid-air in an acoustic levitator?",
            options: [
                "Magnetic repulsion",
                "Acoustic radiation pressure from standing waves",
                "Quantum locking",
                "Aerodynamic drag"
            ],
            correct: 1,
            explanation: "Acoustic levitation relies on standing waves. The acoustic radiation pressure pushes objects toward the pressure nodes (areas of minimum pressure), trapping them in mid-air.",
            difficulty: "Medium"
        },
        {
            question: "Why are the upper and lower surfaces highly parallel in a basic acoustic levitator?",
            options: [
                "To look aesthetically pleasing.",
                "To ensure the sound waves reflect perfectly back on themselves to create a stable standing wave.",
                "To prevent the object from bouncing out sideways.",
                "To allow for better lighting inside the chamber."
            ],
            correct: 1,
            explanation: "Parallel surfaces are critical to creating a stable standing wave, as the incident and reflected waves must perfectly interfere.",
            difficulty: "Easy"
        },
        {
            question: "If the frequency of the ultrasonic transducers is increased, what happens to the distance between the levitation nodes?",
            options: [
                "The distance increases.",
                "The distance decreases.",
                "The distance remains the same.",
                "The nodes disappear."
            ],
            correct: 1,
            explanation: "Higher frequency means a shorter wavelength. Since nodes form at half-wavelength intervals, the distance between them will decrease.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, exploded) {
        if (!exploded) {
            // Hover effect for the levitated object
            meshes.levitated.position.y = 5 + Math.sin(time * speed * 2) * 0.2;
            meshes.levitated.rotation.x += 0.01 * speed;
            meshes.levitated.rotation.y += 0.02 * speed;
            
            // Pulsing effect on the emitter nodes
            const pulse = (Math.sin(time * speed * 5) + 1) / 2;
            meshes.lowerNodes.forEach(node => {
                node.material.emissiveIntensity = 0.5 + pulse * 1.5;
            });
            meshes.upperNodes.forEach(node => {
                node.material.emissiveIntensity = 0.5 + (1 - pulse) * 1.5;
            });

            // Rotating acoustic rings
            meshes.rings.forEach((ring, index) => {
                ring.scale.setScalar(1 + Math.sin(time * speed * 3 + index) * 0.05);
                ring.material.opacity = 0.4 + Math.sin(time * speed * 2 + index) * 0.4;
            });
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createAcousticLevitationChamber() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
