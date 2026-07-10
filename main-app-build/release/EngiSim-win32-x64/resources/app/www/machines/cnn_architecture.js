export function createConvolutionalNeuralNetwork(THREE) {
    const group = new THREE.Group();

    // 1. Input Image Matrix
    const inputGeometry = new THREE.BoxGeometry(4, 4, 0.5);
    const inputMaterial = new THREE.MeshStandardMaterial({ color: 0x88ccff, wireframe: true });
    const inputLayer = new THREE.Mesh(inputGeometry, inputMaterial);
    inputLayer.position.set(-15, 0, 0);
    group.add(inputLayer);

    // 2. Padding Block
    const paddingGeometry = new THREE.BoxGeometry(4.5, 4.5, 0.4);
    const paddingMaterial = new THREE.MeshStandardMaterial({ color: 0x555555, transparent: true, opacity: 0.3 });
    const paddingLayer = new THREE.Mesh(paddingGeometry, paddingMaterial);
    paddingLayer.position.set(-15, 0, -0.1);
    group.add(paddingLayer);

    // 3. Convolutional Filter
    const filterGeometry = new THREE.BoxGeometry(1, 1, 0.6);
    const filterMaterial = new THREE.MeshStandardMaterial({ color: 0xff4444 });
    const convFilter = new THREE.Mesh(filterGeometry, filterMaterial);
    convFilter.position.set(-15, 1.5, 0.2);
    group.add(convFilter);

    // 4. Stride Mechanism (Path/Arrow)
    const strideGeometry = new THREE.CylinderGeometry(0.05, 0.05, 4);
    const strideMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const strideLine = new THREE.Mesh(strideGeometry, strideMaterial);
    strideLine.rotation.z = Math.PI / 2;
    strideLine.position.set(-15, 2.5, 0);
    group.add(strideLine);

    // 5. Feature Map
    const featureMapGeometry = new THREE.BoxGeometry(3.5, 3.5, 1);
    const featureMapMaterial = new THREE.MeshStandardMaterial({ color: 0x44ff44, wireframe: true });
    const featureMap = new THREE.Mesh(featureMapGeometry, featureMapMaterial);
    featureMap.position.set(-10, 0, 0);
    group.add(featureMap);

    // 6. ReLU Activation
    const reluGeometry = new THREE.BoxGeometry(3.5, 3.5, 0.2);
    const reluMaterial = new THREE.MeshStandardMaterial({ color: 0xffaa00, transparent: true, opacity: 0.7 });
    const reluLayer = new THREE.Mesh(reluGeometry, reluMaterial);
    reluLayer.position.set(-8, 0, 0);
    group.add(reluLayer);

    // 7. Max Pooling Layer
    const poolGeometry = new THREE.BoxGeometry(2, 2, 1);
    const poolMaterial = new THREE.MeshStandardMaterial({ color: 0xcc44ff, wireframe: true });
    const poolLayer = new THREE.Mesh(poolGeometry, poolMaterial);
    poolLayer.position.set(-4, 0, 0);
    group.add(poolLayer);

    // 8. Flattening Operation
    const flatGeometry = new THREE.BoxGeometry(0.5, 8, 0.5);
    const flatMaterial = new THREE.MeshStandardMaterial({ color: 0x44ccff });
    const flatLayer = new THREE.Mesh(flatGeometry, flatMaterial);
    flatLayer.position.set(0, 0, 0);
    group.add(flatLayer);

    // 9. Fully Connected Layer
    const fcGeometry = new THREE.BoxGeometry(1, 6, 1);
    const fcMaterial = new THREE.MeshStandardMaterial({ color: 0xff88cc });
    const fcLayer = new THREE.Mesh(fcGeometry, fcMaterial);
    fcLayer.position.set(5, 0, 0);
    group.add(fcLayer);

    // 10. Softmax Layer
    const softmaxGeometry = new THREE.BoxGeometry(0.5, 3, 0.5);
    const softmaxMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const softmaxLayer = new THREE.Mesh(softmaxGeometry, softmaxMaterial);
    softmaxLayer.position.set(10, 0, 0);
    group.add(softmaxLayer);

    // Animation
    group.userData.animate = function(time) {
        // Simple back and forth movement for the filter
        convFilter.position.x = -15 + Math.sin(time * 0.003) * 1.5;
        convFilter.position.y = Math.cos(time * 0.003 * 2.0) * 1.5;

        // Pulse the feature map
        const scale = 1 + Math.sin(time * 0.005) * 0.05;
        featureMap.scale.set(scale, scale, scale);

        // Rotate the pooling layer slightly
        poolLayer.rotation.y = Math.sin(time * 0.002) * 0.2;
        
        // Blink ReLU
        reluLayer.material.opacity = 0.5 + Math.sin(time * 0.01) * 0.3;
    };

    // Quiz Questions
    group.userData.quiz = [
        {
            question: "What is the primary purpose of a Convolutional Layer?",
            options: ["To reduce dimensionality", "To extract features from the input image", "To output the final class probabilities", "To flatten the matrix into a vector"],
            correctAnswer: 1
        },
        {
            question: "What does the Max Pooling operation do?",
            options: ["Increases the number of parameters", "Adds padding to the image", "Reduces the spatial dimensions of the feature map", "Applies an activation function"],
            correctAnswer: 2
        },
        {
            question: "What is the role of the ReLU activation function?",
            options: ["To introduce non-linearity into the network", "To normalize the input data", "To compute the loss", "To downsample the input"],
            correctAnswer: 0
        },
        {
            question: "Why is padding often used in CNNs?",
            options: ["To increase training speed", "To preserve the spatial dimensions of the input volume after convolution", "To reduce overfitting", "To flatten the output"],
            correctAnswer: 1
        },
        {
            question: "What does the 'Stride' parameter define?",
            options: ["The number of filters used", "The size of the convolution filter", "The amount by which the filter shifts across the input image", "The learning rate of the network"],
            correctAnswer: 2
        },
        {
            question: "What is the function of the Softmax Layer?",
            options: ["To convert the final raw scores into probabilities that sum to 1", "To extract edge features", "To pool the maximum values", "To drop out random neurons to prevent overfitting"],
            correctAnswer: 0
        }
    ];

    return group;
}
