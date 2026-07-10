import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const somaMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x3a0088,
        emissive: 0x1a0044,
        roughness: 0.2,
        metalness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        transparent: true,
        opacity: 0.9,
    });

    const dendriteMaterial = new THREE.MeshStandardMaterial({
        color: 0x4B0082,
        emissive: 0x220044,
        roughness: 0.5,
        metalness: 0.1,
    });

    const axonMaterial = new THREE.MeshStandardMaterial({
        color: 0x8A2BE2,
        emissive: 0x3c1464,
        roughness: 0.4,
        metalness: 0.2,
    });

    const myelinMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xFFFDD0,
        roughness: 0.1,
        metalness: 0.05,
        clearcoat: 0.8,
        clearcoatRoughness: 0.2,
        transparent: true,
        opacity: 0.8,
    });

    const terminalMaterial = new THREE.MeshStandardMaterial({
        color: 0xFF1493,
        emissive: 0x660033,
        roughness: 0.3,
        metalness: 0.1,
    });

    const neurotransmitterMaterial = new THREE.MeshBasicMaterial({
        color: 0x00FFFF,
    });

    // 1. Soma (Cell Body)
    const somaGeometry = new THREE.SphereGeometry(2, 32, 32);
    // Deform soma slightly
    const somaPositions = somaGeometry.attributes.position;
    for (let i = 0; i < somaPositions.count; i++) {
        const x = somaPositions.getX(i);
        const y = somaPositions.getY(i);
        const z = somaPositions.getZ(i);
        somaPositions.setXYZ(i, 
            x * (1 + Math.random() * 0.1), 
            y * (1 + Math.random() * 0.1), 
            z * (1 + Math.random() * 0.1)
        );
    }
    somaGeometry.computeVertexNormals();

    const soma = new THREE.Mesh(somaGeometry, somaMaterial);
    soma.position.set(0, 0, 0);
    group.add(soma);
    
    // Core (Nucleus)
    const nucleusGeometry = new THREE.SphereGeometry(0.8, 16, 16);
    const nucleusMaterial = new THREE.MeshStandardMaterial({ color: 0xffaaaa, emissive: 0x550000 });
    const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
    soma.add(nucleus);

    parts.push({
        name: "Soma (Cell Body)",
        description: "The core section of the neuron containing the nucleus, where signals are integrated and metabolic functions are maintained.",
        material: "Soma Glowing Biomaterial",
        function: "Maintains cellular functions and integrates incoming signals from dendrites.",
        assemblyOrder: 1,
        connections: ["Dendrites", "Axon Hillock"],
        failureEffect: "Cell death and total failure of signal transmission.",
        cascadeFailures: ["Complete network disconnection"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 }
    });

    // 2. Dendrites
    const dendriteGroup = new THREE.Group();
    for(let i=0; i<8; i++) {
        const length = 3 + Math.random() * 3;
        const radius = 0.2 + Math.random() * 0.2;
        const dendriteGeo = new THREE.CylinderGeometry(0.05, radius, length, 8);
        dendriteGeo.translate(0, length / 2, 0);
        const dendrite = new THREE.Mesh(dendriteGeo, dendriteMaterial);
        
        // Random orientation
        dendrite.rotation.x = Math.random() * Math.PI * 2;
        dendrite.rotation.y = Math.random() * Math.PI * 2;
        dendrite.rotation.z = Math.random() * Math.PI * 2;
        
        // Position on surface of soma
        const dir = new THREE.Vector3(0, 1, 0).applyEuler(dendrite.rotation).normalize();
        dendrite.position.copy(dir).multiplyScalar(1.8);
        
        dendriteGroup.add(dendrite);
    }
    group.add(dendriteGroup);

    parts.push({
        name: "Dendrites",
        description: "Branch-like extensions from the soma that receive signals from other neurons.",
        material: "Dendritic Membrane",
        function: "Collects incoming chemical signals (neurotransmitters) and converts them to electrical signals.",
        assemblyOrder: 2,
        connections: ["Soma", "Synaptic Clefts (Incoming)"],
        failureEffect: "Inability to receive signals, resulting in an unresponsive neuron.",
        cascadeFailures: ["Loss of learning capability", "Memory degradation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -5, y: 5, z: -5 }
    });

    // 3. Axon
    const axonLength = 15;
    const axonGeometry = new THREE.CylinderGeometry(0.3, 0.5, axonLength, 16);
    axonGeometry.translate(0, axonLength / 2, 0);
    const axon = new THREE.Mesh(axonGeometry, axonMaterial);
    axon.rotation.z = -Math.PI / 2; // Point right
    axon.position.set(1.5, 0, 0);
    group.add(axon);

    parts.push({
        name: "Axon",
        description: "A long projection that carries electrical action potentials away from the cell body.",
        material: "Axonal Membrane",
        function: "Transmits electrical signals rapidly to the presynaptic terminals.",
        assemblyOrder: 3,
        connections: ["Soma", "Myelin Sheath", "Axon Terminals"],
        failureEffect: "Signals cannot reach target neurons.",
        cascadeFailures: ["Paralysis or loss of specific brain functions"],
        originalPosition: { x: 1.5, y: 0, z: 0 },
        explodedPosition: { x: 8, y: 0, z: 0 }
    });

    // 4. Myelin Sheath
    const myelinGroup = new THREE.Group();
    axon.add(myelinGroup); // attach to axon space
    const numSheaths = 5;
    const sheathLength = axonLength / (numSheaths + 1);
    const gap = sheathLength * 0.2;

    for (let i = 0; i < numSheaths; i++) {
        const sheathGeo = new THREE.CylinderGeometry(0.6, 0.6, sheathLength - gap, 16);
        sheathGeo.translate(0, (i + 1) * (sheathLength) + gap/2, 0);
        const sheath = new THREE.Mesh(sheathGeo, myelinMaterial);
        myelinGroup.add(sheath);
    }

    parts.push({
        name: "Myelin Sheath",
        description: "Fatty insulating layer wrapping the axon, formed by glial cells.",
        material: "Lipid-rich Myelin",
        function: "Increases the speed of electrical transmission via saltatory conduction.",
        assemblyOrder: 4,
        connections: ["Axon"],
        failureEffect: "Slow or short-circuited signal transmission (e.g., Multiple Sclerosis).",
        cascadeFailures: ["Motor control loss", "Sensory deficits"],
        originalPosition: { x: 1.5, y: 0, z: 0 },
        explodedPosition: { x: 8, y: -5, z: 0 }
    });

    // 5. Axon Terminals
    const terminalGroup = new THREE.Group();
    const numTerminals = 4;
    for (let i = 0; i < numTerminals; i++) {
        const branchGeo = new THREE.CylinderGeometry(0.05, 0.2, 2, 8);
        branchGeo.translate(0, 1, 0);
        const branch = new THREE.Mesh(branchGeo, axonMaterial);
        
        branch.rotation.x = (Math.random() - 0.5) * Math.PI;
        branch.rotation.z = (Math.random() - 0.5) * Math.PI * 0.5;
        
        branch.position.set(0, axonLength, 0); // At the end of the axon
        
        const knobGeo = new THREE.SphereGeometry(0.4, 16, 16);
        const knob = new THREE.Mesh(knobGeo, terminalMaterial);
        knob.position.set(0, 2, 0);
        branch.add(knob);
        
        terminalGroup.add(branch);
    }
    axon.add(terminalGroup);

    parts.push({
        name: "Synaptic Terminals",
        description: "The branched endings of the axon that connect to other cells.",
        material: "Terminal Bouton Membrane",
        function: "Releases neurotransmitters into the synaptic cleft upon receiving an electrical signal.",
        assemblyOrder: 5,
        connections: ["Axon", "Synaptic Cleft"],
        failureEffect: "Inability to release neurotransmitters.",
        cascadeFailures: ["Chemical signaling failure"],
        originalPosition: { x: axonLength + 1.5, y: 0, z: 0 },
        explodedPosition: { x: axonLength + 5, y: 5, z: 0 }
    });

    // 6. Neurotransmitters (particles)
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 200;
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 5;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.1,
        color: 0x00FFFF,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    const neurotransmitters = new THREE.Points(particleGeometry, particleMaterial);
    neurotransmitters.position.set(axonLength + 2, 0, 0); // Roughly near terminals
    group.add(neurotransmitters);

    parts.push({
        name: "Neurotransmitters",
        description: "Chemical messengers packed in vesicles, released across the synaptic cleft.",
        material: "Glowing Chemical Particles",
        function: "Binds to receptors on the target neuron's dendrites to propagate the signal.",
        assemblyOrder: 6,
        connections: ["Synaptic Terminals", "Receptors"],
        failureEffect: "Signal cannot cross the gap to the next neuron.",
        cascadeFailures: ["Depression, anxiety, or movement disorders (e.g., Parkinson's)"],
        originalPosition: { x: axonLength + 2, y: 0, z: 0 },
        explodedPosition: { x: axonLength + 8, y: 0, z: 0 }
    });

    const description = "An ultra high-tech, microscopic representation of a biological neural network, featuring a detailed neuron with its soma, dendrites, myelin-sheathed axon, and glowing neurotransmitter particles crossing the synaptic cleft.";

    const quizQuestions = [
        {
            question: "What is the function of the Myelin Sheath?",
            options: [
                "To produce neurotransmitters",
                "To insulate the axon and speed up electrical transmission",
                "To receive signals from other neurons",
                "To act as the cell's nucleus"
            ],
            correct: 1,
            explanation: "The myelin sheath acts as a biological insulator, allowing action potentials to 'jump' along the axon (saltatory conduction), significantly increasing transmission speed.",
            difficulty: "Medium"
        },
        {
            question: "Where are incoming signals primarily received by the neuron?",
            options: [
                "Axon terminals",
                "Myelin sheath",
                "Dendrites",
                "Synaptic cleft"
            ],
            correct: 2,
            explanation: "Dendrites are the branched structures extending from the soma that are specialized to receive chemical signals from the axon terminals of other neurons.",
            difficulty: "Easy"
        },
        {
            question: "What happens at the synaptic cleft?",
            options: [
                "Electrical signals jump physically across the gap",
                "Neurotransmitters are released to carry the signal chemically",
                "The axon fuses directly with the dendrite",
                "Myelin is synthesized"
            ],
            correct: 1,
            explanation: "At the synaptic cleft, the electrical signal triggers the release of chemical neurotransmitters, which diffuse across the gap and bind to receptors on the next cell.",
            difficulty: "Medium"
        }
    ];

    let timeOffset = Math.random() * 10;

    function animate(time, speed, meshes) {
        const t = time * speed + timeOffset;
        
        // Pulsate soma
        const scale = 1 + Math.sin(t * 2) * 0.05;
        soma.scale.set(scale, scale, scale);

        // Animate neurotransmitters
        const positions = neurotransmitters.geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            let idx = i * 3;
            positions[idx] += Math.sin(t * 3 + i) * 0.02 * speed;
            positions[idx+1] += Math.cos(t * 2 + i) * 0.02 * speed;
            positions[idx+2] += Math.sin(t * 4 + i) * 0.02 * speed;

            // Keep within a sphere
            let dist = Math.sqrt(
                positions[idx]*positions[idx] + 
                positions[idx+1]*positions[idx+1] + 
                positions[idx+2]*positions[idx+2]
            );
            if (dist > 3) {
                positions[idx] *= 0.9;
                positions[idx+1] *= 0.9;
                positions[idx+2] *= 0.9;
            }
        }
        neurotransmitters.geometry.attributes.position.needsUpdate = true;

        // Action potential visual (pulse along axon)
        const pulse = (t % 2) / 2; // 0 to 1
        axonMaterial.emissiveIntensity = Math.max(0, 1 - Math.abs(pulse - 0.5) * 2);
        
        // Spin the whole group slightly for effect
        group.rotation.y = Math.sin(t * 0.5) * 0.1;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createBrainAndNeurons() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
