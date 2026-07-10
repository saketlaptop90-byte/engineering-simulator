export function createGenerativeAdversarialNetwork(THREE) {
    const group = new THREE.Group();
    group.name = "Generative Adversarial Network";

    // 1. Random Noise Generator
    const randomNoiseGenerator = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 1.2, 1.2),
        new THREE.MeshStandardMaterial({ color: 0xaaaaaa, emissive: 0x333333, wireframe: true })
    );
    randomNoiseGenerator.position.set(-5, 0, 0);

    // 2. Generator Network (expanding cylinder from left to right)
    const generatorNetwork = new THREE.Mesh(
        new THREE.CylinderGeometry(1, 0.2, 2, 8),
        new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x003300, flatShading: true })
    );
    generatorNetwork.rotation.z = -Math.PI / 2;
    generatorNetwork.position.set(-2.5, 0, 0);

    // 3. Fake Image Output
    const fakeImageOutput = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 1.5, 0.1),
        new THREE.MeshStandardMaterial({ color: 0x88ff88, emissive: 0x113311 })
    );
    fakeImageOutput.position.set(-0.5, 1.2, 0);

    // 4. Real Image Dataset
    const realImageDataset = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 1.5, 0.5),
        new THREE.MeshStandardMaterial({ color: 0x0000ff, emissive: 0x000033 })
    );
    realImageDataset.position.set(-0.5, -1.2, 0);

    // 5. Discriminator Network (contracting cylinder from left to right)
    const discriminatorNetwork = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 1, 2, 8),
        new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0x330000, flatShading: true })
    );
    discriminatorNetwork.rotation.z = -Math.PI / 2;
    discriminatorNetwork.position.set(2.5, 0, 0);

    // 6. Probability Output
    const probabilityOutput = new THREE.Mesh(
        new THREE.SphereGeometry(0.6, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0xffff00, emissive: 0x444400 })
    );
    probabilityOutput.position.set(4.5, 0, 0);

    // 7. Generator Loss
    const generatorLoss = new THREE.Mesh(
        new THREE.TorusGeometry(3.5, 0.05, 8, 32, Math.PI),
        new THREE.MeshBasicMaterial({ color: 0xff00ff })
    );
    // Arches over the top from x=4.5 to x=-2.5
    generatorLoss.position.set(1, 0, 0);

    // 8. Discriminator Loss
    const discriminatorLoss = new THREE.Mesh(
        new THREE.TorusGeometry(1.0, 0.05, 8, 32, Math.PI),
        new THREE.MeshBasicMaterial({ color: 0x00ffff })
    );
    // Arches under the bottom from x=4.5 to x=2.5
    discriminatorLoss.position.set(3.5, 0, 0);
    discriminatorLoss.rotation.x = Math.PI;

    // 9. Backpropagation Link (Animated Particles)
    const backpropagationLink = new THREE.Group();
    const particleGeo = new THREE.SphereGeometry(0.15, 8, 8);
    const particleMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    for (let i = 0; i < 8; i++) {
        backpropagationLink.add(new THREE.Mesh(particleGeo, particleMat));
    }

    // 10. Adversarial Loop
    const adversarialLoop = new THREE.Mesh(
        new THREE.TorusGeometry(6, 0.05, 16, 64),
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 })
    );
    adversarialLoop.position.set(0, 0, 0);
    adversarialLoop.rotation.x = Math.PI / 4;

    // Add exactly 10 parts
    group.add(
        randomNoiseGenerator,
        generatorNetwork,
        fakeImageOutput,
        realImageDataset,
        discriminatorNetwork,
        probabilityOutput,
        generatorLoss,
        discriminatorLoss,
        backpropagationLink,
        adversarialLoop
    );

    // Animation function attached to userData
    group.userData.animate = function(time) {
        randomNoiseGenerator.rotation.x = time * 0.5;
        randomNoiseGenerator.rotation.y = time * 0.7;
        
        const pulse = 1 + 0.05 * Math.sin(time * 3);
        generatorNetwork.scale.set(pulse, pulse, pulse);
        discriminatorNetwork.scale.set(pulse, pulse, pulse);

        // Color pulses between red (fake) and green (real)
        const colorMix = (Math.sin(time * 2) + 1) / 2;
        probabilityOutput.material.color.setRGB(colorMix, 1 - colorMix, 0);
        
        adversarialLoop.rotation.z = time * 0.2;

        // Animate particles flowing backward (backpropagation)
        backpropagationLink.children.forEach((p, index) => {
            if (index < 5) {
                // Flow along Generator Loss path
                const offset = (index / 5) * Math.PI;
                const theta = (time * 1.5 + offset) % Math.PI;
                p.position.set(1 + 3.5 * Math.cos(theta), 3.5 * Math.sin(theta), 0);
            } else {
                // Flow along Discriminator Loss path
                const offset = ((index - 5) / 3) * Math.PI;
                const theta = (time * 1.5 + offset) % Math.PI;
                p.position.set(3.5 + 1.0 * Math.cos(theta), -1.0 * Math.sin(theta), 0);
            }
        });
    };

    // Quiz Questions
    group.userData.quiz = [
        {
            question: "What is the primary role of the Generator in a GAN?",
            options: [
                "To classify images as real or fake",
                "To generate synthetic data that resembles real data",
                "To compress data into a latent space",
                "To optimize the learning rate"
            ],
            correctAnswer: 1
        },
        {
            question: "What is the primary role of the Discriminator in a GAN?",
            options: [
                "To generate random noise",
                "To distinguish between real data and fake data produced by the Generator",
                "To upscale low-resolution images",
                "To cluster data points into categories"
            ],
            correctAnswer: 1
        },
        {
            question: "What is the input to the Generator network?",
            options: [
                "Real images from the dataset",
                "A random noise vector (latent space)",
                "The output of the Discriminator",
                "A labeled target variable"
            ],
            correctAnswer: 1
        },
        {
            question: "In GAN training, what does the 'Adversarial' part refer to?",
            options: [
                "The Generator and Discriminator competing against each other",
                "The use of adversary networks to hack databases",
                "The random noise trying to corrupt the generated image",
                "The loss function being constantly modified"
            ],
            correctAnswer: 0
        },
        {
            question: "What happens when a GAN reaches Nash Equilibrium?",
            options: [
                "The Generator perfectly recreates real data, and the Discriminator guesses at 50% accuracy",
                "The Discriminator achieves 100% accuracy",
                "The Generator produces completely random noise",
                "Both networks stop learning and outputs become zero"
            ],
            correctAnswer: 0
        },
        {
            question: "How is the Generator updated during training?",
            options: [
                "By directly comparing its output to the real images",
                "Using backpropagation based on how successfully it fooled the Discriminator",
                "By randomly mutating its weights until accuracy improves",
                "By copying the Discriminator's weights"
            ],
            correctAnswer: 1
        }
    ];

    return group;
}
