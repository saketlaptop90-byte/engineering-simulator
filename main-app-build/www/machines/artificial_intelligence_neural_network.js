import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    const description = "Artificial Intelligence Neural Network:\nA visualization of a deep learning neural network. It features multiple layers of artificial neurons (nodes) connected by synapses (edges). The model demonstrates forward propagation of data and backpropagation of errors through glowing data pulses.";

    // Custom Glowing Materials
    const nodeMaterialInput = new THREE.MeshPhysicalMaterial({ color: 0x00ccff, emissive: 0x00ccff, emissiveIntensity: 2, transparent: true, opacity: 0.9, roughness: 0.1, metalness: 0.8 });
    const nodeMaterialHidden1 = new THREE.MeshPhysicalMaterial({ color: 0x9900ff, emissive: 0x9900ff, emissiveIntensity: 2, transparent: true, opacity: 0.9, roughness: 0.1, metalness: 0.8 });
    const nodeMaterialHidden2 = new THREE.MeshPhysicalMaterial({ color: 0xff00cc, emissive: 0xff00cc, emissiveIntensity: 2, transparent: true, opacity: 0.9, roughness: 0.1, metalness: 0.8 });
    const nodeMaterialOutput = new THREE.MeshPhysicalMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 2, transparent: true, opacity: 0.9, roughness: 0.1, metalness: 0.8 });
    
    const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x444444, transparent: true, opacity: 0.3 });
    const pulseMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

    const layers = [
        { count: 8, z: -6, mat: nodeMaterialInput, name: 'InputLayer' },
        { count: 12, z: -2, mat: nodeMaterialHidden1, name: 'HiddenLayer1' },
        { count: 12, z: 2, mat: nodeMaterialHidden2, name: 'HiddenLayer2' },
        { count: 4, z: 6, mat: nodeMaterialOutput, name: 'OutputLayer' }
    ];

    const nodesData = [];
    const edgesData = [];
    const pulses = [];

    // Base Plate
    const baseGeometry = new THREE.CylinderGeometry(12, 14, 1, 64);
    const baseMesh = new THREE.Mesh(baseGeometry, darkSteel);
    baseMesh.position.set(0, -5, 0);
    group.add(baseMesh);
    meshes['base'] = baseMesh;

    parts.push({
        name: "Main Frame / Base",
        description: "The computing cluster chassis that houses the neural processing units.",
        material: "darkSteel",
        function: "Provides structural support and cooling for the quantum neural cores.",
        assemblyOrder: 1,
        connections: ["Neural Nodes"],
        failureEffect: "System overheating and structural collapse.",
        cascadeFailures: ["Thermal Throttling", "Core Meltdown"],
        originalPosition: { x: 0, y: -5, z: 0 },
        explodedPosition: { x: 0, y: -15, z: 0 }
    });

    // Create Nodes
    const nodeGeometry = new THREE.SphereGeometry(0.4, 32, 32);
    
    let partIndex = 2;

    layers.forEach((layer, layerIndex) => {
        const layerNodes = [];
        const yOffset = -((layer.count - 1) * 1.5) / 2;
        
        for (let i = 0; i < layer.count; i++) {
            const x = (Math.random() - 0.5) * 2; // slight stagger
            const y = yOffset + i * 1.5;
            const z = layer.z;

            const nodeMesh = new THREE.Mesh(nodeGeometry, layer.mat);
            nodeMesh.position.set(x, y, z);
            group.add(nodeMesh);
            
            meshes[`node_${layerIndex}_${i}`] = nodeMesh;
            layerNodes.push({ mesh: nodeMesh, pos: new THREE.Vector3(x, y, z) });

            parts.push({
                name: `${layer.name} Node ${i+1}`,
                description: `Artificial neuron in the ${layer.name}.`,
                material: "glowMaterial",
                function: "Applies activation function to weighted sum of inputs.",
                assemblyOrder: partIndex++,
                connections: ["Synaptic Edges"],
                failureEffect: "Loss of specific feature detection capabilities.",
                cascadeFailures: ["Gradient Vanishing", "Accuracy Drop"],
                originalPosition: { x, y, z },
                explodedPosition: { x: x * 2, y: y * 2, z: z * 2 }
            });
        }
        nodesData.push(layerNodes);
    });

    // Create Edges
    const edgesGroup = new THREE.Group();
    for (let i = 0; i < nodesData.length - 1; i++) {
        const currentLayer = nodesData[i];
        const nextLayer = nodesData[i + 1];

        currentLayer.forEach(node1 => {
            nextLayer.forEach(node2 => {
                const points = [node1.pos, node2.pos];
                const edgeGeo = new THREE.BufferGeometry().setFromPoints(points);
                const edgeLine = new THREE.Line(edgeGeo, edgeMaterial);
                edgesGroup.add(edgeLine);
                edgesData.push({ start: node1.pos, end: node2.pos, line: edgeLine });
            });
        });
    }
    group.add(edgesGroup);
    meshes['edges'] = edgesGroup;

    parts.push({
        name: "Synaptic Connections",
        description: "The weighted pathways transmitting signals between neurons.",
        material: "edgeMaterial",
        function: "Carries data forward and propagates error backward during training.",
        assemblyOrder: partIndex++,
        connections: ["All Nodes"],
        failureEffect: "Network disconnection, catastrophic forgetting.",
        cascadeFailures: ["Information Bottleneck", "Total Network Failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 10, z: 0 }
    });

    // Create Pulses
    const pulseGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const pulseGroup = new THREE.Group();
    for (let i = 0; i < 150; i++) {
        const pulseMesh = new THREE.Mesh(pulseGeo, pulseMaterial);
        pulseMesh.visible = false;
        pulseGroup.add(pulseMesh);
        pulses.push({ mesh: pulseMesh, active: false, progress: 0, startPos: null, endPos: null, speed: 0 });
    }
    group.add(pulseGroup);
    meshes['pulses'] = pulses;

    const quizQuestions = [
        {
            question: "What is the primary function of the connections (edges) between nodes in an Artificial Neural Network?",
            options: [
                "To store data permanently.",
                "To transmit signals multiplied by a specific weight.",
                "To generate new nodes.",
                "To cool down the network processor."
            ],
            correct: 1,
            explanation: "Connections represent weights that scale the input signals as they pass from one node to the next, determining the strength of the influence one neuron has on another.",
            difficulty: "Medium"
        },
        {
            question: "Which process is typically represented by data flowing backward from the output layer to the input layer?",
            options: [
                "Forward Propagation",
                "Data Augmentation",
                "Backpropagation",
                "Hyperparameter Tuning"
            ],
            correct: 2,
            explanation: "Backpropagation is the algorithm used to calculate the gradient of the loss function with respect to the weights, propagating the error backward to update the network.",
            difficulty: "Hard"
        },
        {
            question: "What does an individual 'node' or 'neuron' compute before passing its output to the next layer?",
            options: [
                "A random number generation.",
                "A weighted sum of inputs followed by an activation function.",
                "The derivative of the loss function.",
                "A sorting algorithm."
            ],
            correct: 1,
            explanation: "A node calculates the weighted sum of its inputs, adds a bias, and then applies an activation function (like ReLU or Sigmoid) to determine its final output.",
            difficulty: "Medium"
        }
    ];

    let pulseTimer = 0;
    function animate(time, speed, currentMeshes) {
        const dt = speed * 0.05;
        pulseTimer += dt;
        
        // Rotate the entire network slowly
        group.rotation.y = Math.sin(time * 0.5 * speed) * 0.3;
        group.rotation.x = Math.sin(time * 0.3 * speed) * 0.1;

        // Pulse logic
        if (pulseTimer > 0.1) {
            pulseTimer = 0;
            // spawn a new pulse
            const inactivePulse = pulses.find(p => !p.active);
            if (inactivePulse && edgesData.length > 0) {
                const randomEdge = edgesData[Math.floor(Math.random() * edgesData.length)];
                inactivePulse.active = true;
                inactivePulse.progress = 0;
                
                // 80% forward propagation, 20% backpropagation
                if (Math.random() > 0.2) {
                    inactivePulse.startPos = randomEdge.start;
                    inactivePulse.endPos = randomEdge.end;
                    inactivePulse.mesh.material.color.setHex(0xffffff); // Forward data
                } else {
                    inactivePulse.startPos = randomEdge.end;
                    inactivePulse.endPos = randomEdge.start;
                    inactivePulse.mesh.material.color.setHex(0xff0000); // Error backprop
                }
                
                inactivePulse.speed = 0.02 + Math.random() * 0.03;
                inactivePulse.mesh.position.copy(inactivePulse.startPos);
                inactivePulse.mesh.visible = true;
            }
        }

        pulses.forEach(pulse => {
            if (pulse.active) {
                pulse.progress += pulse.speed * speed;
                if (pulse.progress >= 1) {
                    pulse.active = false;
                    pulse.mesh.visible = false;
                } else {
                    pulse.mesh.position.lerpVectors(pulse.startPos, pulse.endPos, pulse.progress);
                }
            }
        });

        // Pulsate nodes
        layers.forEach((layer, layerIndex) => {
            const intensity = 1.5 + Math.sin(time * speed * 2 + layerIndex) * 0.5;
            layer.mat.emissiveIntensity = intensity;
        });
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createNeuralNetwork() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
