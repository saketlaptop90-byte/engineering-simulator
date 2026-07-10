import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Custom High-Tech Materials
    const neonCyan = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8,
        roughness: 0.1,
        metalness: 0.9,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const neonMagenta = new THREE.MeshPhysicalMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 1.2,
        transparent: true,
        opacity: 0.7,
        roughness: 0.2,
        metalness: 0.8
    });

    const nanoMeshMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xaaaaaa,
        emissive: 0x00aaff,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.6,
        wireframe: true,
        roughness: 0.4,
        metalness: 1.0
    });

    const bioGelMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ff88,
        emissive: 0x00ff88,
        emissiveIntensity: 0.2,
        transparent: true,
        opacity: 0.4,
        roughness: 0.0,
        transmission: 0.9,
        thickness: 0.5
    });

    const goldPlated = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 1.0,
        roughness: 0.1
    });

    // 1. Central Processor Hub (Cortex Node)
    const hubGeometry = new THREE.IcosahedronGeometry(0.8, 2);
    const hub = new THREE.Mesh(hubGeometry, chrome);
    hub.position.set(0, 2, 0);
    group.add(hub);
    parts.push({
        name: "Cortex Hub",
        description: "The primary cognitive processor, interfacing directly with the frontal lobe.",
        material: "Chrome/Quantum Core",
        function: "Aggregates sensory input and neural spikes.",
        assemblyOrder: 1,
        connections: ["Neural Mesh", "Data Stream Nodes"],
        failureEffect: "Complete sensory dissociation and cognitive reboot.",
        cascadeFailures: ["Synaptic Relays"],
        originalPosition: { x: 0, y: 2, z: 0 },
        explodedPosition: { x: 0, y: 4, z: 0 },
        mesh: hub
    });

    // 2. Hub Energy Core
    const coreGeometry = new THREE.SphereGeometry(0.6, 32, 32);
    const core = new THREE.Mesh(coreGeometry, neonCyan);
    hub.add(core); // child of hub
    parts.push({
        name: "Quantum Energy Core",
        description: "Provides localized quantum-entangled power to the neural lace.",
        material: "Neon Cyan Plasma",
        function: "Power generation and distribution.",
        assemblyOrder: 2,
        connections: ["Cortex Hub"],
        failureEffect: "Total system blackout.",
        cascadeFailures: ["All systems"],
        originalPosition: { x: 0, y: 0, z: 0 }, // relative to hub
        explodedPosition: { x: 0, y: 0, z: 2 },
        mesh: core
    });

    // 3. Neural Mesh Network (Hemisphere Wraps)
    const meshGeometry = new THREE.SphereGeometry(2.5, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const neuralMesh = new THREE.Mesh(meshGeometry, nanoMeshMaterial);
    neuralMesh.position.set(0, 0, 0);
    group.add(neuralMesh);
    parts.push({
        name: "Nano-Fiber Mesh",
        description: "A microscopic web of conductive fibers that drapes over the cerebral cortex.",
        material: "Nano-structured Carbon/Gold",
        function: "Reads and writes synaptic activity non-invasively.",
        assemblyOrder: 3,
        connections: ["Cortex Hub", "Synaptic Probes"],
        failureEffect: "Localized paralysis or memory corruption.",
        cascadeFailures: ["Motor Control Nodes"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 },
        mesh: neuralMesh
    });

    // 4. Synaptic Nodes
    const nodeGeometry = new THREE.OctahedronGeometry(0.15, 1);
    const nodes = new THREE.Group();
    for (let i = 0; i < 20; i++) {
        const phi = Math.acos(-1 + (2 * i) / 20);
        const theta = Math.sqrt(20 * Math.PI) * phi;
        const r = 2.6;
        
        const node = new THREE.Mesh(nodeGeometry, goldPlated);
        node.position.set(
            r * Math.cos(theta) * Math.sin(phi),
            Math.max(0.5, r * Math.sin(theta) * Math.sin(phi)), // keep top hemisphere
            r * Math.cos(phi)
        );
        node.lookAt(0,0,0);
        nodes.add(node);
    }
    group.add(nodes);
    parts.push({
        name: "Synaptic Interceptors",
        description: "Gold-plated nodes scattered across the mesh to amplify specific signals.",
        material: "Gold Plated Silicon",
        function: "Signal amplification and noise reduction.",
        assemblyOrder: 4,
        connections: ["Nano-Fiber Mesh"],
        failureEffect: "Degraded signal-to-noise ratio in motor output.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -3 },
        mesh: nodes
    });

    // 5. Data Stream Rings
    const ringGeometry = new THREE.TorusGeometry(3, 0.05, 16, 100);
    const ring1 = new THREE.Mesh(ringGeometry, neonMagenta);
    ring1.rotation.x = Math.PI / 2;
    const ring2 = new THREE.Mesh(ringGeometry, neonCyan);
    ring2.rotation.y = Math.PI / 2;
    const rings = new THREE.Group();
    rings.add(ring1);
    rings.add(ring2);
    group.add(rings);
    parts.push({
        name: "Data Stream Halos",
        description: "High-bandwidth optical data rings for external device communication.",
        material: "Photonic Glass/Plasma",
        function: "Wireless I/O interface.",
        assemblyOrder: 5,
        connections: ["Cortex Hub"],
        failureEffect: "Inability to connect to external networks.",
        cascadeFailures: ["Cloud Sync"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -4, z: 0 },
        mesh: rings
    });

    // 6. Bio-Gel Cooling Reservoir
    const reservoirGeo = new THREE.CylinderGeometry(0.8, 1.2, 0.5, 32);
    const reservoir = new THREE.Mesh(reservoirGeo, bioGelMaterial);
    reservoir.position.set(0, 1.2, 0);
    group.add(reservoir);
    parts.push({
        name: "Bio-Gel Reservoir",
        description: "Thermal regulation fluid to prevent cortical overheating during heavy processing.",
        material: "Synthetic Bio-Gel",
        function: "Heat dissipation.",
        assemblyOrder: 6,
        connections: ["Cortex Hub"],
        failureEffect: "Thermal throttling and minor tissue damage.",
        cascadeFailures: ["Cortex Hub"],
        originalPosition: { x: 0, y: 1.2, z: 0 },
        explodedPosition: { x: 0, y: 2.5, z: 2 },
        mesh: reservoir
    });

    // 7. Base Implantation Ring
    const baseGeo = new THREE.TorusGeometry(2.5, 0.2, 16, 64);
    const baseRing = new THREE.Mesh(baseGeo, darkSteel);
    baseRing.rotation.x = Math.PI / 2;
    baseRing.position.y = 0;
    group.add(baseRing);
    parts.push({
        name: "Cranial Anchor Ring",
        description: "Surgical steel ring anchoring the mesh to the skull.",
        material: "Dark Steel",
        function: "Structural support.",
        assemblyOrder: 7,
        connections: ["Nano-Fiber Mesh"],
        failureEffect: "Mesh misalignment and severe headaches.",
        cascadeFailures: ["Synaptic Interceptors"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -1, z: 0 },
        mesh: baseRing
    });

    // Animations
    const animate = (time, speed, exploded) => {
        const t = time * speed;
        
        // Hub rotation
        hub.rotation.y = t * 0.5;
        hub.rotation.z = t * 0.2;
        
        // Core pulsating
        const scale = 1 + Math.sin(t * 3) * 0.1;
        core.scale.set(scale, scale, scale);
        
        // Mesh breathing
        const meshScale = 1 + Math.sin(t * 1.5) * 0.02;
        neuralMesh.scale.set(meshScale, meshScale, meshScale);
        
        // Nodes twinking
        nodes.children.forEach((node, i) => {
            node.rotation.x = t + i;
            node.rotation.y = t * 1.2 + i;
            const s = 1 + Math.sin(t * 5 + i) * 0.2;
            node.scale.set(s, s, s);
        });

        // Rings rotation
        ring1.rotation.x = Math.PI / 2 + Math.sin(t * 0.5) * 0.2;
        ring1.rotation.z = t;
        ring2.rotation.y = Math.PI / 2 + Math.cos(t * 0.6) * 0.2;
        ring2.rotation.z = -t * 1.2;

        // Exploded view animation
        parts.forEach(part => {
            if (part.mesh) {
                const target = exploded ? part.explodedPosition : part.originalPosition;
                part.mesh.position.lerp(new THREE.Vector3(target.x, target.y, target.z), 0.05);
            }
        });
    };

    const description = "The Neural Lace is a highly advanced Brain-Machine Interface (BMI). It consists of a microscopic nano-fiber mesh that drapes across the cerebral cortex, reading and writing synaptic data without invasive penetrating electrodes. Powered by a quantum energy core, it offers unprecedented cognitive enhancement and direct sensory data streaming.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Bio-Gel Reservoir?",
            options: [
                "Data storage",
                "Thermal regulation and heat dissipation",
                "Power generation",
                "Signal amplification"
            ],
            correct: 1,
            explanation: "High computational loads in the Cortex Hub generate significant heat; the Bio-Gel Reservoir prevents localized cortical overheating.",
            difficulty: "Medium"
        },
        {
            question: "How does the Neural Lace read synaptic activity?",
            options: [
                "Through deep penetrating electrodes",
                "Via external magnetic fields only",
                "Using a non-invasive Nano-Fiber Mesh draped over the cortex",
                "By tapping into the spinal cord"
            ],
            correct: 2,
            explanation: "The Nano-Fiber Mesh sits on the surface of the cortex, intercepting and stimulating neurons non-invasively compared to older neural link designs.",
            difficulty: "Easy"
        },
        {
            question: "What happens if the Quantum Energy Core fails?",
            options: [
                "Memory corruption",
                "Minor headaches",
                "Degraded motor output",
                "Total system blackout"
            ],
            correct: 3,
            explanation: "The Quantum Energy Core is the sole localized power source. Its failure results in an immediate and total system blackout.",
            difficulty: "Medium"
        },
        {
            question: "Which component is responsible for high-bandwidth external communication?",
            options: [
                "Synaptic Interceptors",
                "Cranial Anchor Ring",
                "Data Stream Halos",
                "Bio-Gel Reservoir"
            ],
            correct: 2,
            explanation: "The Data Stream Halos utilize optical and photonic technologies to interface wirelessly with external networks and devices.",
            difficulty: "Hard"
        }
    ];

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createNeuralLace() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
