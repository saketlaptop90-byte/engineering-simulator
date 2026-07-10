import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Glowing Materials
    const synapseGlowMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00aaff,
        emissiveIntensity: 2.5,
        transparent: true,
        opacity: 0.8
    });
    
    const neuronBodyMaterial = new THREE.MeshStandardMaterial({
        color: 0x2222ff,
        emissive: 0x1111aa,
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.8,
        transparent: true,
        opacity: 0.9
    });

    const axonMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffcc,
        emissive: 0x0088aa,
        emissiveIntensity: 1.5,
        wireframe: true
    });

    // Cerebral Hemisphere Base
    const hemisphereGeometry = new THREE.SphereGeometry( 5, 64, 64, 0, Math.PI * 2, 0, Math.PI / 2 );
    hemisphereGeometry.scale(1, 0.7, 1.2);
    const leftHemisphere = new THREE.Mesh(hemisphereGeometry, plastic);
    leftHemisphere.position.set(-2.5, 0, 0);
    group.add(leftHemisphere);
    
    parts.push({
        name: "Left Hemisphere",
        description: "Controls the right side of the body, and performs tasks that have to do with logic, such as in science and mathematics.",
        material: "plastic",
        function: "Logic, language, and analytical processing.",
        assemblyOrder: 1,
        connections: ["Corpus Callosum", "Right Hemisphere"],
        failureEffect: "Loss of speech, right-side paralysis.",
        cascadeFailures: ["Cognitive decline"],
        originalPosition: { x: -2.5, y: 0, z: 0 },
        explodedPosition: { x: -6.0, y: 0, z: 0 }
    });

    const rightHemisphere = new THREE.Mesh(hemisphereGeometry, plastic);
    rightHemisphere.position.set(2.5, 0, 0);
    group.add(rightHemisphere);

    parts.push({
        name: "Right Hemisphere",
        description: "Coordinates the left side of the body, and performs tasks that have do with creativity and the arts.",
        material: "plastic",
        function: "Spatial abilities, face recognition, visual imagery, music.",
        assemblyOrder: 2,
        connections: ["Corpus Callosum", "Left Hemisphere"],
        failureEffect: "Left-side paralysis, loss of spatial awareness.",
        cascadeFailures: ["Proprioceptive loss"],
        originalPosition: { x: 2.5, y: 0, z: 0 },
        explodedPosition: { x: 6.0, y: 0, z: 0 }
    });

    // Corpus Callosum
    const corpusCallosumGeometry = new THREE.CylinderGeometry(0.5, 0.5, 4, 32);
    corpusCallosumGeometry.rotateZ(Math.PI / 2);
    const corpusCallosum = new THREE.Mesh(corpusCallosumGeometry, axonMaterial);
    corpusCallosum.position.set(0, 0, 0);
    group.add(corpusCallosum);

    parts.push({
        name: "Corpus Callosum",
        description: "A thick band of nerve fibers that divides the cerebral cortex lobes into left and right hemispheres.",
        material: "axonMaterial",
        function: "Connects the left and right hemispheres, allowing for communication between both hemispheres.",
        assemblyOrder: 3,
        connections: ["Left Hemisphere", "Right Hemisphere"],
        failureEffect: "Split-brain syndrome, lack of interhemispheric communication.",
        cascadeFailures: ["Hemisphere isolation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 2.0, z: 0 }
    });

    // Neural Network / Synapses (Visual effect)
    const synapseMeshes = [];
    const neuronCount = 100;
    
    for(let i=0; i<neuronCount; i++) {
        const neuronGeom = new THREE.SphereGeometry(0.1, 8, 8);
        const neuron = new THREE.Mesh(neuronGeom, synapseGlowMaterial);
        
        // Random positions on the surface or near the hemispheres
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const r = 5.2; // Slightly outside the hemisphere
        
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta) * 0.7; // scale factor
        const z = r * Math.cos(phi) * 1.2; // scale factor
        
        neuron.position.set(x, Math.abs(y), z);
        group.add(neuron);
        synapseMeshes.push(neuron);
    }

    parts.push({
        name: "Neural Network",
        description: "Billions of neurons and trillions of synapses forming the processing core.",
        material: "synapseGlowMaterial",
        function: "Information processing, memory storage, and signal transmission.",
        assemblyOrder: 4,
        connections: ["Entire Cortex"],
        failureEffect: "Memory loss, inability to process stimuli.",
        cascadeFailures: ["System-wide collapse"],
        originalPosition: { x: 0, y: 3, z: 0 },
        explodedPosition: { x: 0, y: 6, z: 0 }
    });

    const description = "The Cerebral Cortex is the outer layer of the brain's cerebral hemispheres, acting as the advanced information processing center. This highly-detailed simulation features thousands of glowing neural pathways, representing active thought processes and interhemispheric communication.";

    const quizQuestions = [
        {
            question: "Which structure connects the left and right hemispheres of the cerebral cortex?",
            options: ["Cerebellum", "Corpus Callosum", "Brainstem", "Thalamus"],
            correct: 1,
            explanation: "The Corpus Callosum is a massive tract of nerve fibers connecting the two hemispheres, enabling them to communicate.",
            difficulty: "easy"
        },
        {
            question: "The left hemisphere of the brain is generally responsible for which functions?",
            options: ["Creativity and music", "Spatial abilities", "Logic, language, and analytical processing", "Regulating heartbeat"],
            correct: 2,
            explanation: "The left hemisphere typically handles analytical, logical, and linguistic tasks.",
            difficulty: "medium"
        },
        {
            question: "What is the primary function of synapses in a neural network?",
            options: ["To provide structural support", "To generate blood cells", "To transmit signals between neurons", "To store physical nutrients"],
            correct: 2,
            explanation: "Synapses are the specialized junctions where signals are transmitted from one neuron to another.",
            difficulty: "medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Animate synapses glowing and pulsing
        synapseMeshes.forEach((mesh, index) => {
            const offset = index * 0.1;
            mesh.scale.setScalar(1 + Math.sin(time * speed * 2 + offset) * 0.5);
            mesh.material.emissiveIntensity = 1 + Math.sin(time * speed * 5 + offset) * 2;
        });
        
        // Gentle rotation of the entire group
        group.rotation.y = time * speed * 0.1;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createCerebralCortex() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
