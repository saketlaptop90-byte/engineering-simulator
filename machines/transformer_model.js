export function createTransformerArchitecture(THREE) {
    const group = new THREE.Group();

    // 1. Input Embeddings
    const inputGeom = new THREE.BoxGeometry(4, 0.5, 1);
    const inputMat = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    const inputEmbeddings = new THREE.Mesh(inputGeom, inputMat);
    inputEmbeddings.position.set(-5, -4, 0);
    inputEmbeddings.name = "Input Embeddings";
    group.add(inputEmbeddings);

    // 2. Positional Encoding
    const posGeom = new THREE.CylinderGeometry(0.5, 0.5, 4, 16);
    posGeom.rotateZ(Math.PI / 2);
    const posMat = new THREE.MeshStandardMaterial({ color: 0x00ffff });
    const positionalEncoding = new THREE.Mesh(posGeom, posMat);
    positionalEncoding.position.set(-5, -3, 0);
    positionalEncoding.name = "Positional Encoding";
    group.add(positionalEncoding);

    // 3. Multi-Head Attention
    const mhaGeom = new THREE.TorusKnotGeometry(0.8, 0.2, 64, 16);
    const mhaMat = new THREE.MeshStandardMaterial({ color: 0xff00ff });
    const multiHeadAttention = new THREE.Mesh(mhaGeom, mhaMat);
    multiHeadAttention.position.set(-5, 0, 0);
    multiHeadAttention.name = "Multi-Head Attention";
    group.add(multiHeadAttention);

    // 4. Add & Norm
    const normGeom = new THREE.TorusGeometry(1.5, 0.2, 16, 50);
    const normMat = new THREE.MeshStandardMaterial({ color: 0xffff00 });
    const addNorm = new THREE.Mesh(normGeom, normMat);
    addNorm.position.set(-5, 2, 0);
    addNorm.rotateX(Math.PI / 2);
    addNorm.name = "Add & Norm";
    group.add(addNorm);

    // 5. Feed Forward Network
    const ffnGeom = new THREE.BoxGeometry(3, 1, 1.5);
    const ffnMat = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const feedForwardNetwork = new THREE.Mesh(ffnGeom, ffnMat);
    feedForwardNetwork.position.set(-5, 4, 0);
    feedForwardNetwork.name = "Feed Forward Network";
    group.add(feedForwardNetwork);

    // 6. Encoder Block
    const encoderGeom = new THREE.BoxGeometry(6, 9, 3);
    const encoderMat = new THREE.MeshStandardMaterial({ color: 0x888888, transparent: true, opacity: 0.2, wireframe: true });
    const encoderBlock = new THREE.Mesh(encoderGeom, encoderMat);
    encoderBlock.position.set(-5, 2, 0);
    encoderBlock.name = "Encoder Block";
    group.add(encoderBlock);

    // 7. Masked Attention
    const maskedGeom = new THREE.TorusKnotGeometry(0.8, 0.2, 64, 16, 3, 4);
    const maskedMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const maskedAttention = new THREE.Mesh(maskedGeom, maskedMat);
    maskedAttention.position.set(5, -1, 0);
    maskedAttention.name = "Masked Attention";
    group.add(maskedAttention);

    // 8. Decoder Block
    const decoderGeom = new THREE.BoxGeometry(6, 11, 3);
    const decoderMat = new THREE.MeshStandardMaterial({ color: 0x444444, transparent: true, opacity: 0.2, wireframe: true });
    const decoderBlock = new THREE.Mesh(decoderGeom, decoderMat);
    decoderBlock.position.set(5, 2, 0);
    decoderBlock.name = "Decoder Block";
    group.add(decoderBlock);

    // 9. Sequence Generator
    const linearGeom = new THREE.CylinderGeometry(1, 2, 2, 16);
    const linearMat = new THREE.MeshStandardMaterial({ color: 0x800080 });
    const sequenceGenerator = new THREE.Mesh(linearGeom, linearMat);
    sequenceGenerator.position.set(5, 8.5, 0);
    sequenceGenerator.name = "Sequence Generator";
    group.add(sequenceGenerator);

    // 10. Output Probabilities
    const softmaxGeom = new THREE.ConeGeometry(2, 2, 32);
    const softmaxMat = new THREE.MeshStandardMaterial({ color: 0xffa500 });
    const outputProbabilities = new THREE.Mesh(softmaxGeom, softmaxMat);
    outputProbabilities.position.set(5, 11, 0);
    outputProbabilities.name = "Output Probabilities";
    group.add(outputProbabilities);

    // Animation function
    group.userData.animate = function(time) {
        multiHeadAttention.rotation.y = time * 0.001;
        multiHeadAttention.rotation.z = time * 0.0005;

        maskedAttention.rotation.y = -time * 0.001;
        maskedAttention.rotation.x = time * 0.0005;

        addNorm.rotation.z = time * 0.002;

        positionalEncoding.position.x = -5 + Math.sin(time * 0.003) * 0.5;

        outputProbabilities.rotation.y = time * 0.002;
        sequenceGenerator.rotation.y = -time * 0.0015;
    };

    // Quiz questions
    group.userData.quiz = [
        {
            question: "What is the primary mechanism that allows Transformers to process input sequences in parallel?",
            options: ["Recurrent Connections", "Convolutional Filters", "Self-Attention", "Long Short-Term Memory"],
            correctAnswer: 2
        },
        {
            question: "Why is Positional Encoding necessary in a Transformer?",
            options: ["To compress the input data", "To retain information about the order of sequence elements", "To reduce the dimensionality of embeddings", "To mask future tokens"],
            correctAnswer: 1
        },
        {
            question: "In the Multi-Head Attention mechanism, what are the three learned vectors for each input?",
            options: ["Key, Value, Query", "Encoder, Decoder, Context", "Input, Hidden, Output", "Mean, Variance, Standard Deviation"],
            correctAnswer: 0
        },
        {
            question: "What does the Masked Multi-Head Attention in the Decoder prevent?",
            options: ["Overfitting on small datasets", "Looking at future tokens in the target sequence", "Gradient vanishing", "Excessive memory consumption"],
            correctAnswer: 1
        },
        {
            question: "What function is typically applied at the very end of the Transformer to generate Output Probabilities?",
            options: ["ReLU", "Sigmoid", "Softmax", "Tanh"],
            correctAnswer: 2
        },
        {
            question: "What operation is performed in the 'Add & Norm' layers?",
            options: ["Addition of recurrent states and normalization", "Residual connection addition followed by layer normalization", "Vector addition followed by batch normalization", "Matrix multiplication and L2 normalization"],
            correctAnswer: 1
        }
    ];

    return group;
}
