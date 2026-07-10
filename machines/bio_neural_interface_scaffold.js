import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    const description = "Neural Interface Scaffold: A high-tech, flexible polymer mesh integrating smoothly with glowing biological neurons to translate synaptic activity into electrical signals.";

    // Custom Materials
    const polymerMeshMat = new THREE.MeshPhysicalMaterial({
        color: 0x111111,
        metalness: 0.8,
        roughness: 0.4,
        clearcoat: 1.0,
        wireframe: true,
        emissive: 0x001133,
        emissiveIntensity: 0.2
    });

    const neuronBodyMat = new THREE.MeshPhongMaterial({
        color: 0x00ffff,
        emissive: 0x00aaff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
        shininess: 100
    });

    const dendriteMat = new THREE.MeshPhongMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.7
    });

    const electrodeMat = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 1.0,
        roughness: 0.2
    });

    const signalPulseMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.8
    });

    const processorMat = new THREE.MeshStandardMaterial({
        color: 0x222222,
        metalness: 0.9,
        roughness: 0.1,
        emissive: 0x110000,
        emissiveIntensity: 0.5
    });
    
    // 1. Scaffold Base
    const scaffoldGeo = new THREE.CylinderGeometry(4, 4, 0.5, 64, 4, true);
    const scaffoldMesh = new THREE.Mesh(scaffoldGeo, polymerMeshMat);
    scaffoldMesh.position.set(0, 0, 0);
    group.add(scaffoldMesh);
    meshes.scaffold = scaffoldMesh;
    parts.push({
        name: "Polymer Scaffold",
        description: "Flexible, biocompatible mesh structure that conforms to brain tissue.",
        material: polymerMeshMat,
        function: "Provides structural support and aligns electrodes with target neural regions.",
        assemblyOrder: 1,
        connections: ["Micro-Electrodes", "Signal Processor"],
        failureEffect: "Scaffold deformation leads to electrode displacement and signal loss.",
        cascadeFailures: ["Signal Processor"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 }
    });

    // 2. Neurons
    meshes.neurons = [];
    meshes.dendrites = [];
    meshes.signals = [];
    const numNeuronalClusters = 5;
    for (let i = 0; i < numNeuronalClusters; i++) {
        const angle = (i / numNeuronalClusters) * Math.PI * 2;
        const radius = 2.5;
        const nx = Math.cos(angle) * radius;
        const nz = Math.sin(angle) * radius;
        const ny = 0.5 + Math.random() * 1.5;

        const neuronGeo = new THREE.SphereGeometry(0.4, 16, 16);
        const neuronMesh = new THREE.Mesh(neuronGeo, neuronBodyMat);
        neuronMesh.position.set(nx, ny, nz);
        group.add(neuronMesh);
        meshes.neurons.push(neuronMesh);
        
        // Dendrites
        const dendriteGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 8);
        const d1 = new THREE.Mesh(dendriteGeo, dendriteMat);
        d1.position.set(nx, ny - 0.75, nz);
        group.add(d1);
        meshes.dendrites.push(d1);

        // Signal pulses
        const pulseGeo = new THREE.SphereGeometry(0.1, 8, 8);
        const pulse = new THREE.Mesh(pulseGeo, signalPulseMat);
        pulse.position.set(nx, ny, nz);
        group.add(pulse);
        meshes.signals.push({ mesh: pulse, startY: ny, endY: ny - 1.5 });
    }

    parts.push({
        name: "Biological Neurons",
        description: "Living brain cells interacting with the artificial scaffold.",
        material: neuronBodyMat,
        function: "Generates action potentials (synaptic activity) to be translated.",
        assemblyOrder: 2,
        connections: ["Micro-Electrodes"],
        failureEffect: "Tissue scarring or cell death causes total loss of interface capability.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 1.5, z: 0 },
        explodedPosition: { x: 0, y: 4, z: 0 }
    });

    // 3. Micro-Electrodes
    meshes.electrodes = [];
    for (let i = 0; i < numNeuronalClusters; i++) {
        const angle = (i / numNeuronalClusters) * Math.PI * 2;
        const radius = 2.5;
        const nx = Math.cos(angle) * radius;
        const nz = Math.sin(angle) * radius;
        const ny = 0.5;

        const electrodeGeo = new THREE.CylinderGeometry(0.1, 0.02, 1, 16);
        const electrodeMesh = new THREE.Mesh(electrodeGeo, electrodeMat);
        electrodeMesh.position.set(nx, ny - 0.5, nz);
        group.add(electrodeMesh);
        meshes.electrodes.push(electrodeMesh);
    }
    
    parts.push({
        name: "Micro-Electrodes",
        description: "Gold-plated nanoscale probes that penetrate tissue slightly.",
        material: electrodeMat,
        function: "Picks up microvolt electrical signals from nearby neurons.",
        assemblyOrder: 3,
        connections: ["Polymer Scaffold", "Biological Neurons"],
        failureEffect: "Signal noise increases, decoding accuracy drops rapidly.",
        cascadeFailures: ["Signal Processor"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 1.5, z: 0 }
    });

    // 4. Signal Processor Array
    const processorGeo = new THREE.BoxGeometry(2, 0.5, 2);
    const processorMesh = new THREE.Mesh(processorGeo, processorMat);
    processorMesh.position.set(0, -1, 0);
    group.add(processorMesh);
    meshes.processor = processorMesh;
    
    parts.push({
        name: "Signal Processor Core",
        description: "On-board ASIC for amplification, multiplexing, and spike sorting.",
        material: processorMat,
        function: "Digitizes neural signals before transmitting them out of the cranium.",
        assemblyOrder: 4,
        connections: ["Polymer Scaffold", "Data Bus"],
        failureEffect: "Total data loss, potential heating damage to surrounding tissue.",
        cascadeFailures: ["Data Bus"],
        originalPosition: { x: 0, y: -1, z: 0 },
        explodedPosition: { x: 0, y: -4, z: 0 }
    });

    // 5. Data Bus lines
    meshes.buses = [];
    const busGeo = new THREE.CylinderGeometry(0.05, 0.05, 3, 8);
    for (let i = 0; i < 4; i++) {
        const bus = new THREE.Mesh(busGeo, copper);
        bus.position.set(Math.cos(i * Math.PI / 2), -2.5, Math.sin(i * Math.PI / 2));
        group.add(bus);
        meshes.buses.push(bus);
    }

    parts.push({
        name: "Telemetry Data Bus",
        description: "Copper micro-wire bundles leading to the external transceiver.",
        material: copper,
        function: "High-bandwidth data transmission to external decoders.",
        assemblyOrder: 5,
        connections: ["Signal Processor Core"],
        failureEffect: "Intermittent connection, packet loss in neural streams.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: -2.5, z: 0 },
        explodedPosition: { x: 0, y: -6, z: 0 }
    });

    const quizQuestions = [
        {
            question: "What is the primary function of the Polymer Scaffold?",
            options: [
                "To generate action potentials",
                "To amplify the neural signals directly",
                "To provide structural support and conform to brain tissue",
                "To transmit data outside the cranium"
            ],
            correct: 2,
            explanation: "The flexible polymer scaffold supports the electrodes and conforms to the complex topology of the brain.",
            difficulty: "Medium"
        },
        {
            question: "Why are the Micro-Electrodes gold-plated?",
            options: [
                "Gold is the cheapest material",
                "Gold has high biocompatibility and excellent electrical conductivity",
                "Gold prevents the scaffold from melting",
                "Gold is magnetic and helps align neurons"
            ],
            correct: 1,
            explanation: "Gold is highly biocompatible (reduces immune response) and is an excellent conductor for picking up faint microvolt signals.",
            difficulty: "Hard"
        },
        {
            question: "What happens if the Signal Processor Core fails?",
            options: [
                "The neurons stop firing",
                "The scaffold dissolves",
                "Electrodes turn into liquid",
                "Total data loss and potential heating damage to tissue"
            ],
            correct: 3,
            explanation: "Processor failure means signals aren't digitized or transmitted, causing data loss. Excess heat from a failing chip can damage delicate brain tissue.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, m) {
        // Scaffold rotation
        m.scaffold.rotation.y = time * 0.1 * speed;
        
        // Processor glow pulse
        m.processor.material.emissiveIntensity = 0.5 + Math.sin(time * 3 * speed) * 0.3;

        // Neurons pulsing
        m.neurons.forEach((n, i) => {
            const offset = i * 1.5;
            const pulse = Math.sin(time * 5 * speed + offset);
            n.material.emissiveIntensity = 0.5 + 0.5 * pulse;
            n.scale.setScalar(1 + 0.1 * pulse);
        });

        // Firing signals along dendrites
        m.signals.forEach((s, i) => {
            const offset = i * 2.3;
            let progress = ((time * speed * 2 + offset) % 2) / 2; // 0 to 1
            s.mesh.position.y = s.startY - (s.startY - s.endY) * progress;
            s.mesh.material.opacity = 1 - progress; // fade out as it reaches electrode
            
            // rotate around scaffold along with it
            const angle = (i / m.signals.length) * Math.PI * 2 + m.scaffold.rotation.y;
            const radius = 2.5;
            s.mesh.position.x = Math.cos(angle) * radius;
            s.mesh.position.z = Math.sin(angle) * radius;
        });
        
        // Electrodes rotate with scaffold
        m.electrodes.forEach((e, i) => {
            const angle = (i / m.electrodes.length) * Math.PI * 2 + m.scaffold.rotation.y;
            const radius = 2.5;
            e.position.x = Math.cos(angle) * radius;
            e.position.z = Math.sin(angle) * radius;
        });

        // Neurons rotate with scaffold
        m.neurons.forEach((n, i) => {
            const angle = (i / m.neurons.length) * Math.PI * 2 + m.scaffold.rotation.y;
            const radius = 2.5;
            n.position.x = Math.cos(angle) * radius;
            n.position.z = Math.sin(angle) * radius;
        });

        m.dendrites.forEach((d, i) => {
            const angle = (i / m.dendrites.length) * Math.PI * 2 + m.scaffold.rotation.y;
            const radius = 2.5;
            d.position.x = Math.cos(angle) * radius;
            d.position.z = Math.sin(angle) * radius;
        });
    }

    return { group, parts, description, quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createNeuralInterfaceScaffold() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
