import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const pdmsMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3,
        roughness: 0.1,
        transmission: 0.9,
        thickness: 0.5,
        clearcoat: 1.0
    });

    const reagentRedMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.8
    });

    const reagentBlueMaterial = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.8
    });

    const mixturePurpleMaterial = new THREE.MeshStandardMaterial({
        color: 0xaa00aa,
        emissive: 0xaa00aa,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.8
    });

    const goldContactMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 1.0,
        roughness: 0.2
    });

    // 1. Glass Substrate
    const substrateGeom = new THREE.BoxGeometry(10, 0.2, 5);
    const substrate = new THREE.Mesh(substrateGeom, glass);
    substrate.position.set(0, 0, 0);
    group.add(substrate);
    parts.push({
        name: 'Glass Substrate',
        description: 'Provides a rigid, transparent foundation for the microfluidic chip.',
        material: 'Borosilicate Glass',
        function: 'Structural Support and Optical Transparency',
        assemblyOrder: 1,
        connections: ['PDMS Layer', 'Microelectrodes'],
        failureEffect: 'Cracking disrupts flow and visualization.',
        cascadeFailures: ['Complete device failure'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -2, z: 0}
    });

    // 2. PDMS Layer (Microfluidic channels block)
    const pdmsGeom = new THREE.BoxGeometry(9.8, 1.0, 4.8);
    const pdms = new THREE.Mesh(pdmsGeom, pdmsMaterial);
    pdms.position.set(0, 0.6, 0);
    group.add(pdms);
    parts.push({
        name: 'PDMS Microchannel Layer',
        description: 'Polydimethylsiloxane layer patterned with microscopic channels for fluid flow.',
        material: 'PDMS (Silicone)',
        function: 'Fluid routing and mixing',
        assemblyOrder: 2,
        connections: ['Glass Substrate', 'Inlets', 'Outlets'],
        failureEffect: 'Delamination causes fluid leakage.',
        cascadeFailures: ['Contamination', 'Pressure loss'],
        originalPosition: {x: 0, y: 0.6, z: 0},
        explodedPosition: {x: 0, y: 2, z: 0}
    });

    // 3. Channels & Fluid representation
    // Left channel (Red)
    const channel1Geom = new THREE.CylinderGeometry(0.1, 0.1, 4);
    channel1Geom.rotateZ(Math.PI / 2);
    const channel1 = new THREE.Mesh(channel1Geom, reagentRedMaterial);
    channel1.position.set(-2.5, 0.6, 1);
    group.add(channel1);

    // Right channel (Blue)
    const channel2Geom = new THREE.CylinderGeometry(0.1, 0.1, 4);
    channel2Geom.rotateZ(Math.PI / 2);
    const channel2 = new THREE.Mesh(channel2Geom, reagentBlueMaterial);
    channel2.position.set(-2.5, 0.6, -1);
    group.add(channel2);

    // Mixer section (Serpentine or combined)
    const mixerGeom = new THREE.TorusKnotGeometry(0.5, 0.1, 64, 8);
    mixerGeom.rotateX(Math.PI / 2);
    const mixer = new THREE.Mesh(mixerGeom, mixturePurpleMaterial);
    mixer.position.set(1, 0.6, 0);
    group.add(mixer);
    parts.push({
        name: 'Serpentine Micromixer',
        description: 'Complex channel geometry that induces chaotic advection to mix laminar fluid flows rapidly.',
        material: 'Aqueous Reagents',
        function: 'Rapid biochemical mixing',
        assemblyOrder: 3,
        connections: ['Input Channels', 'Reaction Chamber'],
        failureEffect: 'Incomplete mixing leads to failed reactions.',
        cascadeFailures: ['False negative test results'],
        originalPosition: {x: 1, y: 0.6, z: 0},
        explodedPosition: {x: 1, y: 3, z: 0}
    });

    // 4. Inlets (Ports)
    const portGeom = new THREE.CylinderGeometry(0.3, 0.3, 0.5);
    const inlet1 = new THREE.Mesh(portGeom, plastic);
    inlet1.position.set(-4.5, 1.35, 1);
    group.add(inlet1);
    const inlet2 = new THREE.Mesh(portGeom, plastic);
    inlet2.position.set(-4.5, 1.35, -1);
    group.add(inlet2);
    parts.push({
        name: 'Fluid Inlets',
        description: 'Ports where external pumps interface with the micro-scale channels.',
        material: 'Teflon/Plastic',
        function: 'Sample and reagent introduction',
        assemblyOrder: 4,
        connections: ['PDMS Layer', 'Syringe Pumps'],
        failureEffect: 'Blockage prevents fluid entry.',
        cascadeFailures: ['Pump overload', 'Channel dry-out'],
        originalPosition: {x: -4.5, y: 1.35, z: 0},
        explodedPosition: {x: -4.5, y: 4, z: 0}
    });

    // 5. Outlet
    const outlet = new THREE.Mesh(portGeom, plastic);
    outlet.position.set(4.5, 1.35, 0);
    group.add(outlet);
    parts.push({
        name: 'Waste Outlet',
        description: 'Exit port for analyzed fluids and waste products.',
        material: 'Teflon/Plastic',
        function: 'Fluid extraction',
        assemblyOrder: 5,
        connections: ['PDMS Layer', 'Waste Reservoir'],
        failureEffect: 'Blockage causes back-pressure.',
        cascadeFailures: ['Chip rupture'],
        originalPosition: {x: 4.5, y: 1.35, z: 0},
        explodedPosition: {x: 4.5, y: 4, z: 0}
    });

    // 6. Microelectrodes (Biosensors)
    const electrodeGeom = new THREE.PlaneGeometry(0.8, 0.8);
    const electrode1 = new THREE.Mesh(electrodeGeom, goldContactMaterial);
    electrode1.rotation.x = -Math.PI / 2;
    electrode1.position.set(3, 0.11, 0);
    group.add(electrode1);
    parts.push({
        name: 'Gold Microelectrodes',
        description: 'Patterned gold contacts for electrochemical detection of target analytes.',
        material: 'Gold (Au)',
        function: 'Electrochemical Sensing',
        assemblyOrder: 6,
        connections: ['Glass Substrate', 'External Analyzer'],
        failureEffect: 'Electrode fouling reduces signal.',
        cascadeFailures: ['Loss of measurement data'],
        originalPosition: {x: 3, y: 0.11, z: 0},
        explodedPosition: {x: 3, y: -1, z: 0}
    });

    const description = "A high-tech Microfluidic Lab-on-a-Chip. It utilizes microscale channels in a PDMS matrix bonded to a glass substrate to precisely control and manipulate tiny volumes of fluids. It features rapid serpentine mixers, integrated biosensor electrodes, and automated fluid handling for biological assays and chemical synthesis.";

    const quizQuestions = [
        {
            question: "Why is fluid flow in microfluidic channels typically laminar rather than turbulent?",
            options: ["High fluid velocity", "Low Reynolds number due to small channel dimensions", "High temperature gradients", "Magnetic interference"],
            correct: 1,
            explanation: "Due to the microscopic dimensions of the channels, the Reynolds number is very low (typically Re < 100), meaning viscous forces dominate over inertial forces, resulting in smooth, parallel, laminar flow.",
            difficulty: "Medium"
        },
        {
            question: "What is the primary purpose of the serpentine or herringbone structures often found in these chips?",
            options: ["To slow down the fluid", "To filter out large particles", "To induce chaotic advection and facilitate rapid mixing", "To measure fluid pressure"],
            correct: 2,
            explanation: "Because flow is laminar, fluids typically only mix by slow diffusion. Serpentine channels or herringbone ridges fold and stretch the fluid layers (chaotic advection) to drastically speed up mixing.",
            difficulty: "Hard"
        },
        {
            question: "Why is PDMS (Polydimethylsiloxane) a preferred material for fabricating microfluidic chips?",
            options: ["It is highly electrically conductive", "It is optically transparent, biocompatible, and easy to mold at the micron scale", "It dissolves easily in water", "It is ferromagnetic"],
            correct: 1,
            explanation: "PDMS is widely used in soft lithography because it is transparent (allowing for optical microscopy), permeable to gases (good for cell culture), biocompatible, and molds perfectly over micron-sized features.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Find meshes for fluid animation
        const mixerMesh = group.children.find(c => c.geometry && c.geometry.type === 'TorusKnotGeometry');
        const redChan = group.children.find(c => c.material && c.material.color && c.material.color.getHex() === 0xff0000);
        const blueChan = group.children.find(c => c.material && c.material.color && c.material.color.getHex() === 0x0088ff);

        if (mixerMesh) {
            mixerMesh.rotation.z = time * speed * 2;
            mixerMesh.material.emissiveIntensity = 0.5 + Math.sin(time * speed * 5) * 0.3;
        }

        if (redChan) {
            redChan.material.opacity = 0.6 + Math.sin(time * speed * 3) * 0.2;
        }

        if (blueChan) {
            blueChan.material.opacity = 0.6 + Math.cos(time * speed * 3) * 0.2;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createMicrofluidicChip() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
