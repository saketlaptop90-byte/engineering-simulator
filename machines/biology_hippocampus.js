import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const synapseGlowMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.8,
        wireframe: true,
        roughness: 0.1,
        metalness: 0.9,
    });

    const neuronCoreMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xff00ff,
        emissive: 0xff00aa,
        emissiveIntensity: 1.5,
        transmission: 0.9,
        opacity: 1,
        roughness: 0,
        ior: 1.5,
        thickness: 0.5,
    });

    const myelinSheathMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.4,
        metalness: 0.1,
        transparent: true,
        opacity: 0.6
    });

    const seahorseBaseMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x111133,
        emissive: 0x0a0a2a,
        roughness: 0.5,
        metalness: 0.8,
        wireframe: true
    });

    // Hippocampus Base (Seahorse shape)
    const baseCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -3, 0),
        new THREE.Vector3(2, -1, 0),
        new THREE.Vector3(2.5, 1, 0),
        new THREE.Vector3(1, 3, 0),
        new THREE.Vector3(-1, 3.5, 0),
        new THREE.Vector3(-2, 2, 0),
        new THREE.Vector3(-1.5, 0, 0),
        new THREE.Vector3(0, -1.5, 0)
    ]);
    const baseGeometry = new THREE.TubeGeometry(baseCurve, 64, 0.8, 16, false);
    const baseMesh = new THREE.Mesh(baseGeometry, seahorseBaseMaterial);
    group.add(baseMesh);

    parts.push({
        name: "Cornu Ammonis (CA) Base",
        description: "The main seahorse-shaped body of the hippocampus, housing primary pyramidal neurons.",
        material: "seahorseBaseMaterial",
        function: "Structural framework and primary processing region.",
        assemblyOrder: 1,
        connections: ["Dentate Gyrus", "Subiculum"],
        failureEffect: "Inability to form new memories (anterograde amnesia).",
        cascadeFailures: ["Memory consolidation collapse", "Spatial navigation failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 5 },
        mesh: baseMesh
    });

    // Dentate Gyrus
    const dgGeometry = new THREE.TorusGeometry(1.5, 0.4, 16, 100, Math.PI);
    const dgMesh = new THREE.Mesh(dgGeometry, neuronCoreMaterial);
    dgMesh.position.set(0.5, 2, 0);
    dgMesh.rotation.z = -Math.PI / 4;
    group.add(dgMesh);

    parts.push({
        name: "Dentate Gyrus",
        description: "The primary input gateway to the hippocampus, rich in neurogenesis.",
        material: "neuronCoreMaterial",
        function: "Pattern separation and preliminary memory encoding.",
        assemblyOrder: 2,
        connections: ["Entorhinal Cortex", "CA3"],
        failureEffect: "Pattern separation deficits, memory overlap.",
        cascadeFailures: ["Overgeneralization", "False memory formation"],
        originalPosition: { x: 0.5, y: 2, z: 0 },
        explodedPosition: { x: 2, y: 5, z: -3 },
        mesh: dgMesh
    });

    // Neural Synapses (Glowing Nodes)
    const synapses = [];
    for (let i = 0; i < 20; i++) {
        const synGeo = new THREE.SphereGeometry(0.15, 16, 16);
        const synMesh = new THREE.Mesh(synGeo, synapseGlowMaterial);
        
        // Distribute along the base curve
        const t = i / 20;
        const pos = baseCurve.getPoint(t);
        
        // Add some random offset
        synMesh.position.set(
            pos.x + (Math.random() - 0.5) * 1.5,
            pos.y + (Math.random() - 0.5) * 1.5,
            pos.z + (Math.random() - 0.5) * 1.5
        );
        
        group.add(synMesh);
        synapses.push(synMesh);
    }

    parts.push({
        name: "Synaptic Network (LTP Nodes)",
        description: "Network of synapses demonstrating Long-Term Potentiation.",
        material: "synapseGlowMaterial",
        function: "Strengthening of synaptic connections for memory consolidation.",
        assemblyOrder: 3,
        connections: ["CA3", "CA1", "Dentate Gyrus"],
        failureEffect: "Synaptic plasticity failure.",
        cascadeFailures: ["Learning impairment", "Cognitive decline"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -3, y: 0, z: -5 },
        mesh: synapses[0]
    });

    // Subiculum
    const subGeometry = new THREE.CylinderGeometry(0.3, 0.6, 2, 32);
    const subMesh = new THREE.Mesh(subGeometry, chrome);
    subMesh.position.set(0, -3.5, 0);
    subMesh.rotation.z = Math.PI / 8;
    group.add(subMesh);

    parts.push({
        name: "Subiculum",
        description: "The main output region of the hippocampal formation.",
        material: "chrome",
        function: "Relays processed memory signals to the cortex.",
        assemblyOrder: 4,
        connections: ["CA1", "Entorhinal Cortex"],
        failureEffect: "Output blockage.",
        cascadeFailures: ["Memory retrieval failure"],
        originalPosition: { x: 0, y: -3.5, z: 0 },
        explodedPosition: { x: 0, y: -6, z: 3 },
        mesh: subMesh
    });

    const description = "The Hippocampus: A highly detailed, cybernetic representation of the brain's memory formation and spatial navigation center. This model features Long-Term Potentiation (LTP) synaptic glowing events and structural regions.";

    const quizQuestions = [
        {
            question: "Which sub-region of the hippocampus acts as the primary input gateway and is known for adult neurogenesis?",
            options: ["Cornu Ammonis 1 (CA1)", "Dentate Gyrus", "Subiculum", "Amygdala"],
            correct: 1,
            explanation: "The Dentate Gyrus receives primary inputs from the entorhinal cortex and is one of the few brain regions where neurogenesis occurs in adults.",
            difficulty: "Medium"
        },
        {
            question: "What phenomenon is represented by the glowing network nodes in this model?",
            options: ["Apoptosis", "Long-Term Potentiation (LTP)", "Myelination", "Hemodynamic response"],
            correct: 1,
            explanation: "Long-Term Potentiation (LTP) is the persistent strengthening of synapses based on recent patterns of activity, widely considered one of the major cellular mechanisms that underlies learning and memory.",
            difficulty: "Hard"
        },
        {
            question: "Damage to the hippocampus primarily results in what condition?",
            options: ["Motor paralysis", "Anterograde amnesia", "Cortical blindness", "Aphasia"],
            correct: 1,
            explanation: "Damage to the hippocampus typically results in anterograde amnesia, the inability to form new declarative memories.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshes) {
        // Rotate the entire group slowly
        group.rotation.y = time * 0.2 * speed;

        // Pulse the dentate gyrus
        const dgPulse = (Math.sin(time * 2 * speed) + 1) / 2;
        neuronCoreMaterial.emissiveIntensity = 1.0 + dgPulse * 2.0;

        // Animate the synapses (LTP firing)
        synapses.forEach((syn, index) => {
            const fire = Math.sin(time * 5 * speed + index);
            if (fire > 0.8) {
                syn.scale.setScalar(1.5);
                syn.material.emissiveIntensity = 5.0;
            } else {
                syn.scale.setScalar(1.0);
                syn.material.emissiveIntensity = 1.0;
            }
        });
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createHippocampus() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
