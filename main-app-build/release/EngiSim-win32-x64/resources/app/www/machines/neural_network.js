export function createDeepNeuralNetwork(THREE) {
    const group = new THREE.Group();

    // Materials
    const nodeMaterial = new THREE.MeshStandardMaterial({ color: 0x3498db, roughness: 0.4, metalness: 0.1 });
    const hiddenNodeMaterial = new THREE.MeshStandardMaterial({ color: 0x9b59b6, roughness: 0.4, metalness: 0.1 });
    const outputNodeMaterial = new THREE.MeshStandardMaterial({ color: 0x2ecc71, roughness: 0.4, metalness: 0.1 });
    const connectionMaterial = new THREE.LineBasicMaterial({ color: 0xbdc3c7, transparent: true, opacity: 0.3 });
    const activationMaterial = new THREE.MeshBasicMaterial({ color: 0xf1c40f, wireframe: true });
    const biasMaterial = new THREE.MeshStandardMaterial({ color: 0xe74c3c });
    const lossMaterial = new THREE.LineBasicMaterial({ color: 0xe74c3c });
    const optimizerMaterial = new THREE.MeshStandardMaterial({ color: 0xf39c12, metalness: 0.8, roughness: 0.2 });
    const pulseMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

    const createLayer = (count, x, material, name) => {
        const layerGroup = new THREE.Group();
        layerGroup.name = name;
        const spacing = 1.5;
        const startY = -((count - 1) * spacing) / 2;
        
        for (let i = 0; i < count; i++) {
            const geometry = new THREE.SphereGeometry(0.4, 32, 32);
            const node = new THREE.Mesh(geometry, material);
            node.position.set(x, startY + i * spacing, 0);
            layerGroup.add(node);
        }
        return layerGroup;
    };

    // 1. Input Layer
    const inputLayer = createLayer(4, -6, nodeMaterial, "InputLayer");
    group.add(inputLayer);

    // 2. Hidden Layer 1
    const hiddenLayer1 = createLayer(5, -2, hiddenNodeMaterial, "HiddenLayer1");
    group.add(hiddenLayer1);

    // 3. Hidden Layer 2
    const hiddenLayer2 = createLayer(5, 2, hiddenNodeMaterial, "HiddenLayer2");
    group.add(hiddenLayer2);

    // 4. Output Layer
    const outputLayer = createLayer(3, 6, outputNodeMaterial, "OutputLayer");
    group.add(outputLayer);

    // 5. Synaptic Connections
    const connectionsGroup = new THREE.Group();
    connectionsGroup.name = "SynapticConnections";
    const layers = [inputLayer, hiddenLayer1, hiddenLayer2, outputLayer];
    
    for (let l = 0; l < layers.length - 1; l++) {
        const currentLayer = layers[l];
        const nextLayer = layers[l + 1];
        
        currentLayer.children.forEach(node1 => {
            nextLayer.children.forEach(node2 => {
                const points = [];
                points.push(node1.position);
                points.push(node2.position);
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(geometry, connectionMaterial);
                connectionsGroup.add(line);
            });
        });
    }
    group.add(connectionsGroup);

    // 6. Activation Functions (Rings around hidden/output nodes)
    const activationGroup = new THREE.Group();
    activationGroup.name = "ActivationFunctions";
    const actGeometry = new THREE.TorusGeometry(0.5, 0.05, 16, 32);
    [hiddenLayer1, hiddenLayer2, outputLayer].forEach(layer => {
        layer.children.forEach(node => {
            const actMesh = new THREE.Mesh(actGeometry, activationMaterial);
            actMesh.position.copy(node.position);
            actMesh.rotation.x = Math.PI / 2;
            activationGroup.add(actMesh);
        });
    });
    group.add(activationGroup);

    // 7. Bias Nodes
    const biasGroup = new THREE.Group();
    biasGroup.name = "BiasNodes";
    const biasGeom = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    [-2, 2, 6].forEach((x, index) => {
        const biasNode = new THREE.Mesh(biasGeom, biasMaterial);
        biasNode.position.set(x - 0.5, 4, 0);
        biasGroup.add(biasNode);
    });
    group.add(biasGroup);

    // 8. Loss Function Visualizer
    const lossGroup = new THREE.Group();
    lossGroup.name = "LossFunctionVisualizer";
    const lossPoints = [];
    for(let i = 0; i <= 20; i++) {
        const lx = i * 0.15;
        const ly = Math.exp(-lx) * 2; // Decaying curve
        lossPoints.push(new THREE.Vector3(lx, ly, 0));
    }
    const lossGeom = new THREE.BufferGeometry().setFromPoints(lossPoints);
    const lossLine = new THREE.Line(lossGeom, lossMaterial);
    lossLine.position.set(5.5, -4, 0);
    lossGroup.add(lossLine);
    
    // Add a small board for the loss function
    const boardGeom = new THREE.PlaneGeometry(4, 3);
    const boardMat = new THREE.MeshBasicMaterial({color: 0x222222, side: THREE.DoubleSide});
    const board = new THREE.Mesh(boardGeom, boardMat);
    board.position.set(7, -3, -0.1);
    lossGroup.add(board);
    group.add(lossGroup);

    // 9. Optimizer Module
    const optimizerModule = new THREE.Mesh(new THREE.TorusKnotGeometry(0.6, 0.2, 64, 16), optimizerMaterial);
    optimizerModule.name = "OptimizerModule";
    optimizerModule.position.set(-6, -4, 0);
    group.add(optimizerModule);

    // 10. Forward Pass Animator (Data pulses)
    const forwardPassGroup = new THREE.Group();
    forwardPassGroup.name = "ForwardPassAnimator";
    const pulseGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const pulses = [];
    
    for(let i = 0; i < 20; i++) {
        const pulse = new THREE.Mesh(pulseGeometry, pulseMaterial);
        forwardPassGroup.add(pulse);
        pulses.push({
            mesh: pulse,
            layerIndex: Math.floor(Math.random() * 3),
            progress: Math.random(),
            startNode: 0,
            endNode: 0,
            speed: 0.01 + Math.random() * 0.01
        });
    }
    
    pulses.forEach(p => {
        const layer1 = layers[p.layerIndex];
        const layer2 = layers[p.layerIndex + 1];
        p.startNode = Math.floor(Math.random() * layer1.children.length);
        p.endNode = Math.floor(Math.random() * layer2.children.length);
    });

    group.add(forwardPassGroup);

    // Animation function
    group.userData.animate = function(time) {
        activationGroup.children.forEach((ring, i) => {
            ring.rotation.x += 0.02 * (i % 2 === 0 ? 1 : -1);
            ring.rotation.y += 0.01;
        });

        optimizerModule.rotation.x += 0.01;
        optimizerModule.rotation.y += 0.02;

        pulses.forEach(p => {
            p.progress += p.speed;
            if (p.progress >= 1.0) {
                p.progress = 0;
                p.layerIndex = (p.layerIndex + 1) % 3;
                const layer1 = layers[p.layerIndex];
                const layer2 = layers[p.layerIndex + 1];
                p.startNode = Math.floor(Math.random() * layer1.children.length);
                p.endNode = Math.floor(Math.random() * layer2.children.length);
            }
            
            const layer1 = layers[p.layerIndex];
            const layer2 = layers[p.layerIndex + 1];
            const startPos = layer1.children[p.startNode].position;
            const endPos = layer2.children[p.endNode].position;
            
            p.mesh.position.lerpVectors(startPos, endPos, p.progress);
        });

        biasGroup.children.forEach((bias, i) => {
            bias.position.y = 4 + Math.sin(time * 0.003 + i) * 0.2;
            bias.rotation.y = time * 0.001;
        });
    };

    // Quiz Questions
    group.userData.quiz = [
        {
            question: "What is the primary function of an activation function in a neural network?",
            options: [
                "To initialize weights",
                "To introduce non-linearity into the network",
                "To calculate the loss",
                "To update biases"
            ],
            correctAnswer: 1
        },
        {
            question: "Which algorithm is commonly used to train deep neural networks by updating weights?",
            options: [
                "Forward Propagation",
                "K-Means Clustering",
                "Backpropagation",
                "Principal Component Analysis"
            ],
            correctAnswer: 2
        },
        {
            question: "What does the loss function measure in a neural network?",
            options: [
                "The speed of the network",
                "The number of hidden layers",
                "The difference between the predicted output and the actual target",
                "The size of the input data"
            ],
            correctAnswer: 2
        },
        {
            question: "What is the purpose of adding a bias node to a layer?",
            options: [
                "To prevent overfitting",
                "To shift the activation function horizontally, allowing it to fit the data better",
                "To increase the learning rate",
                "To reduce the number of parameters"
            ],
            correctAnswer: 1
        },
        {
            question: "Which part of the neural network receives the initial data?",
            options: [
                "Hidden Layer",
                "Output Layer",
                "Optimizer",
                "Input Layer"
            ],
            correctAnswer: 3
        },
        {
            question: "What role does the optimizer play during training?",
            options: [
                "It defines the architecture of the network",
                "It adjusts the model's weights and biases to minimize the loss",
                "It normalizes the input data",
                "It generates the activation functions"
            ],
            correctAnswer: 1
        }
    ];

    return group;
};
