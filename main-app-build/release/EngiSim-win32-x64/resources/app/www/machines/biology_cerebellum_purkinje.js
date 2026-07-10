import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const somaMaterial = new THREE.MeshStandardMaterial({
        color: 0x8a2be2, // Blueviolet
        emissive: 0x4a0e78,
        roughness: 0.2,
        metalness: 0.1,
        transparent: true,
        opacity: 0.9,
    });

    const dendriteMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff, // Cyan
        emissive: 0x008888,
        roughness: 0.4,
        metalness: 0.5,
    });

    const spineMaterial = new THREE.MeshStandardMaterial({
        color: 0xff00ff, // Magenta
        emissive: 0x880088,
        roughness: 0.3,
        metalness: 0.8,
    });

    const axonMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd700, // Gold
        emissive: 0xaa8800,
        roughness: 0.1,
        metalness: 0.7,
    });

    const myelinMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.1,
        metalness: 0.1,
        transmission: 0.9,
        thickness: 0.5,
        clearcoat: 1.0,
    });

    const nucleusMaterial = new THREE.MeshStandardMaterial({
        color: 0xff4500, // OrangeRed
        emissive: 0xff0000,
        roughness: 0.5,
        metalness: 0.2,
    });

    const signalMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.8,
    });

    // 1. Soma (Cell Body)
    const somaGeometry = new THREE.SphereGeometry(2, 64, 64);
    // slightly deform it to look organic
    const pos = somaGeometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        pos.setXYZ(i, pos.getX(i) * (1 + Math.random() * 0.1), pos.getY(i) * (1 + Math.random() * 0.1), pos.getZ(i) * (1 + Math.random() * 0.1));
    }
    somaGeometry.computeVertexNormals();
    const soma = new THREE.Mesh(somaGeometry, somaMaterial);
    group.add(soma);
    parts.push({
        name: "Soma (Cell Body)",
        description: "The bulbous end of a neuron, containing the cell nucleus. Integrates incoming signals.",
        material: somaMaterial,
        function: "Integration of incoming synaptic signals and metabolic maintenance of the cell.",
        assemblyOrder: 1,
        connections: ["Nucleus", "Axon Hillock", "Primary Dendrites"],
        failureEffect: "Cell death or failure to generate action potentials.",
        cascadeFailures: ["Complete Neural Circuit Failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 },
        mesh: soma
    });

    // 2. Nucleus
    const nucleusGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
    soma.add(nucleus);
    parts.push({
        name: "Nucleus",
        description: "Contains the genetic material of the cell.",
        material: nucleusMaterial,
        function: "Gene expression, protein synthesis regulation.",
        assemblyOrder: 2,
        connections: ["Soma"],
        failureEffect: "Inability to repair or produce necessary proteins.",
        cascadeFailures: ["Soma Degeneration"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 5 },
        mesh: nucleus
    });

    // 3. Dendritic Arbor (Massive Tree)
    // Purkinje cells have a flat, highly branched dendritic tree.
    const treeGroup = new THREE.Group();
    treeGroup.position.set(0, 2, 0);
    
    function createBranch(radius, length, segments, level) {
        if (level > 4) return null;
        
        const branchGroup = new THREE.Group();
        
        const geo = new THREE.CylinderGeometry(radius * 0.7, radius, length, 8);
        geo.translate(0, length / 2, 0);
        const mesh = new THREE.Mesh(geo, dendriteMaterial);
        branchGroup.add(mesh);

        // Add spines at higher levels
        if (level > 2) {
            for (let i = 0; i < 5; i++) {
                const spineGeo = new THREE.SphereGeometry(0.1, 8, 8);
                const spine = new THREE.Mesh(spineGeo, spineMaterial);
                spine.position.set((Math.random() - 0.5) * radius * 3, Math.random() * length, (Math.random() - 0.5) * radius * 3);
                branchGroup.add(spine);
            }
        }

        const numBranches = level === 1 ? 3 : 2;
        for (let i = 0; i < numBranches; i++) {
            const child = createBranch(radius * 0.6, length * 0.8, segments, level + 1);
            if (child) {
                child.position.y = length;
                const angleZ = (Math.random() - 0.5) * Math.PI / 1.5;
                const angleX = (Math.random() - 0.5) * Math.PI / 6; // Keep it somewhat flat
                child.rotation.set(angleX, 0, angleZ);
                branchGroup.add(child);
            }
        }
        
        return branchGroup;
    }

    const dendrites = createBranch(0.5, 3, 8, 1);
    treeGroup.add(dendrites);
    group.add(treeGroup);
    
    parts.push({
        name: "Dendritic Arbor",
        description: "An incredibly dense, highly branched structure receiving hundreds of thousands of synaptic inputs.",
        material: dendriteMaterial,
        function: "Receives excitatory inputs from parallel fibers and climbing fibers.",
        assemblyOrder: 3,
        connections: ["Soma", "Parallel Fibers", "Climbing Fibers"],
        failureEffect: "Loss of input integration; ataxia.",
        cascadeFailures: ["Motor Coordination Failure"],
        originalPosition: { x: 0, y: 2, z: 0 },
        explodedPosition: { x: 0, y: 10, z: 0 },
        mesh: dendrites
    });

    // 4. Axon
    const axonGroup = new THREE.Group();
    const axonGeo = new THREE.CylinderGeometry(0.2, 0.4, 10, 16);
    axonGeo.translate(0, -5, 0);
    const axon = new THREE.Mesh(axonGeo, axonMaterial);
    axonGroup.add(axon);
    axonGroup.position.set(0, -2, 0);
    group.add(axonGroup);

    parts.push({
        name: "Axon",
        description: "The long projection carrying output signals away from the soma.",
        material: axonMaterial,
        function: "Transmits action potentials to deep cerebellar nuclei.",
        assemblyOrder: 4,
        connections: ["Soma", "Axon Terminals"],
        failureEffect: "Inability to send output signals.",
        cascadeFailures: ["Downstream Target Inactivation"],
        originalPosition: { x: 0, y: -2, z: 0 },
        explodedPosition: { x: 0, y: -8, z: 0 },
        mesh: axon
    });

    // 5. Myelin Sheath
    const myelinGroup = new THREE.Group();
    for (let i = 0; i < 4; i++) {
        const myelinPiece = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 1.8, 16), myelinMaterial);
        myelinPiece.position.set(0, -3 - i * 2.2, 0);
        myelinGroup.add(myelinPiece);
    }
    axonGroup.add(myelinGroup);

    parts.push({
        name: "Myelin Sheath",
        description: "Insulating layer formed by oligodendrocytes around the axon.",
        material: myelinMaterial,
        function: "Increases the speed of action potential propagation via saltatory conduction.",
        assemblyOrder: 5,
        connections: ["Axon"],
        failureEffect: "Slowed or blocked signal transmission.",
        cascadeFailures: ["Neurological Deficits"],
        originalPosition: { x: 0, y: -2, z: 0 },
        explodedPosition: { x: 0, y: -8, z: -5 },
        mesh: myelinGroup
    });
    
    // Signals (Animated particles)
    const signals = new THREE.Group();
    for (let i = 0; i < 20; i++) {
        const signal = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), signalMaterial);
        signal.position.set(0, 0, 0);
        signal.userData = { progress: Math.random(), speed: 0.01 + Math.random() * 0.02 };
        signals.add(signal);
    }
    group.add(signals);

    const description = "The Purkinje cell is a highly complex, beautifully branched neuron found in the cerebellum. It is characterized by its massive dendritic arbor which allows it to receive massive amounts of synaptic inputs, playing a crucial role in motor coordination and learning.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Purkinje cell's massive dendritic arbor?",
            options: [
                "To send signals to other regions of the brain.",
                "To receive and integrate vast numbers of synaptic inputs.",
                "To produce myelin for the axon.",
                "To store genetic material."
            ],
            correct: 1,
            explanation: "The highly branched dendritic arbor allows a single Purkinje cell to receive up to 200,000 synaptic inputs from parallel fibers.",
            difficulty: "Medium"
        },
        {
            question: "Where are Purkinje cells primarily located?",
            options: [
                "Cerebral Cortex",
                "Spinal Cord",
                "Cerebellum",
                "Hippocampus"
            ],
            correct: 2,
            explanation: "Purkinje cells form a distinct layer in the cerebellar cortex.",
            difficulty: "Easy"
        },
        {
            question: "What role does the myelin sheath play on the axon?",
            options: [
                "It slows down action potentials to allow for better processing.",
                "It insulates the axon and speeds up signal transmission.",
                "It generates new signals when the soma fails.",
                "It creates connections with neighboring dendrites."
            ],
            correct: 1,
            explanation: "Myelin acts as an electrical insulator, allowing action potentials to jump quickly between nodes of Ranvier (saltatory conduction).",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Pulsate soma emissive intensity
        const pulse = (Math.sin(time * 2 * speed) + 1) / 2;
        somaMaterial.emissiveIntensity = 0.5 + pulse * 0.5;
        dendriteMaterial.emissiveIntensity = 0.3 + pulse * 0.4;
        
        // Rotate tree slightly to look alive
        treeGroup.rotation.y = Math.sin(time * 0.5 * speed) * 0.1;
        
        // Move signals down the axon
        signals.children.forEach(signal => {
            signal.userData.progress += signal.userData.speed * speed;
            if (signal.userData.progress > 1) {
                signal.userData.progress = 0;
            }
            // Start from soma (y=0) to end of axon (y=-12)
            signal.position.y = -signal.userData.progress * 12;
            
            // Brighten signals
            const p = signal.userData.progress;
            signal.scale.setScalar(1 + Math.sin(p * Math.PI * 10) * 0.5);
        });
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createCerebellumPurkinje() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
