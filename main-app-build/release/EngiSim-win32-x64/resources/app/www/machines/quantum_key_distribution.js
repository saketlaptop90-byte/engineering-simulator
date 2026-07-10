export function createQuantumKeyDistribution(THREE) {
    const machineGroup = new THREE.Group();
    machineGroup.name = "Quantum Key Distribution";

    // 1. Alice's Photon Source
    const sourceGeometry = new THREE.CylinderGeometry(1, 1, 3, 32);
    const sourceMaterial = new THREE.MeshStandardMaterial({ color: 0x4444ff, metalness: 0.8, roughness: 0.2 });
    const alicesPhotonSource = new THREE.Mesh(sourceGeometry, sourceMaterial);
    alicesPhotonSource.position.set(-15, 0, 0);
    alicesPhotonSource.rotation.z = Math.PI / 2;
    alicesPhotonSource.userData = { name: "Alice's Photon Source", description: "Emits single photons, encoding information into quantum states like polarization." };
    machineGroup.add(alicesPhotonSource);

    // 2. Alice's Polarization Filter
    const aliceFilterGeometry = new THREE.BoxGeometry(0.5, 4, 4);
    const aliceFilterMaterial = new THREE.MeshStandardMaterial({ color: 0x8888ff, transparent: true, opacity: 0.7 });
    const alicesPolarizationFilter = new THREE.Mesh(aliceFilterGeometry, aliceFilterMaterial);
    alicesPolarizationFilter.position.set(-12, 0, 0);
    alicesPolarizationFilter.userData = { name: "Alice's Polarization Filter", description: "Randomly applies one of the basis (rectilinear or diagonal) to encode the photon polarization." };
    machineGroup.add(alicesPolarizationFilter);

    // 3. Quantum Channel
    const qChannelGeometry = new THREE.CylinderGeometry(0.2, 0.2, 20, 16);
    const qChannelMaterial = new THREE.MeshStandardMaterial({ color: 0x88ffff, transparent: true, opacity: 0.3, emissive: 0x228888 });
    const quantumChannel = new THREE.Mesh(qChannelGeometry, qChannelMaterial);
    quantumChannel.position.set(0, 0, 0);
    quantumChannel.rotation.z = Math.PI / 2;
    quantumChannel.userData = { name: "Quantum Channel", description: "An optical fiber or free space through which the quantum states (photons) are transmitted." };
    machineGroup.add(quantumChannel);

    // 4. Eve's Interceptor
    const eveGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    const eveMaterial = new THREE.MeshStandardMaterial({ color: 0xff4444, wireframe: true });
    const evesInterceptor = new THREE.Mesh(eveGeometry, eveMaterial);
    evesInterceptor.position.set(0, 3, 0);
    evesInterceptor.userData = { name: "Eve's Interceptor", description: "An eavesdropper trying to measure the quantum states. In doing so, Eve inherently alters the states due to the observer effect." };
    machineGroup.add(evesInterceptor);

    // 5. Bob's Polarization Filter
    const bobFilterGeometry = new THREE.BoxGeometry(0.5, 4, 4);
    const bobFilterMaterial = new THREE.MeshStandardMaterial({ color: 0xff8888, transparent: true, opacity: 0.7 });
    const bobsPolarizationFilter = new THREE.Mesh(bobFilterGeometry, bobFilterMaterial);
    bobsPolarizationFilter.position.set(12, 0, 0);
    bobsPolarizationFilter.userData = { name: "Bob's Polarization Filter", description: "Randomly chooses a basis to measure the incoming photon's polarization." };
    machineGroup.add(bobsPolarizationFilter);

    // 6. Bob's Detector
    const detectorGeometry = new THREE.CylinderGeometry(1.2, 1.2, 2, 32);
    const detectorMaterial = new THREE.MeshStandardMaterial({ color: 0xff4444, metalness: 0.8, roughness: 0.2 });
    const bobsDetector = new THREE.Mesh(detectorGeometry, detectorMaterial);
    bobsDetector.position.set(15, 0, 0);
    bobsDetector.rotation.z = Math.PI / 2;
    bobsDetector.userData = { name: "Bob's Detector", description: "Detects the polarization of the photon after it passes through Bob's filter." };
    machineGroup.add(bobsDetector);

    // 7. Classical Channel
    const cChannelGeometry = new THREE.CylinderGeometry(0.1, 0.1, 30, 16);
    const cChannelMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
    const classicalChannel = new THREE.Mesh(cChannelGeometry, cChannelMaterial);
    classicalChannel.position.set(0, -3, 0);
    classicalChannel.rotation.z = Math.PI / 2;
    classicalChannel.userData = { name: "Classical Channel", description: "An authenticated public channel used by Alice and Bob to compare bases and sift the key." };
    machineGroup.add(classicalChannel);

    // 8. Alice's Key Storage
    const aKeyGeometry = new THREE.BoxGeometry(3, 2, 2);
    const aKeyMaterial = new THREE.MeshStandardMaterial({ color: 0x2222aa });
    const alicesKeyStorage = new THREE.Mesh(aKeyGeometry, aKeyMaterial);
    alicesKeyStorage.position.set(-15, -4, 0);
    alicesKeyStorage.userData = { name: "Alice's Key Storage", description: "Stores Alice's final sifted and privacy-amplified cryptographic key." };
    machineGroup.add(alicesKeyStorage);

    // 9. Bob's Key Storage
    const bKeyGeometry = new THREE.BoxGeometry(3, 2, 2);
    const bKeyMaterial = new THREE.MeshStandardMaterial({ color: 0xaa2222 });
    const bobsKeyStorage = new THREE.Mesh(bKeyGeometry, bKeyMaterial);
    bobsKeyStorage.position.set(15, -4, 0);
    bobsKeyStorage.userData = { name: "Bob's Key Storage", description: "Stores Bob's final sifted and privacy-amplified cryptographic key." };
    machineGroup.add(bobsKeyStorage);

    // 10. Quantum Photons
    const photonCount = 5;
    const quantumPhotons = new THREE.Group();
    const photonGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    for(let i = 0; i < photonCount; i++) {
        const photonMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const photon = new THREE.Mesh(photonGeometry, photonMat);
        photon.position.set(-13 + i * 2, 0, 0);
        quantumPhotons.add(photon);
    }
    quantumPhotons.userData = { name: "Transmitting Photons", description: "Single photons traveling from Alice to Bob, carrying the quantum key information." };
    machineGroup.add(quantumPhotons);

    // Add some lights to the machineGroup itself
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    machineGroup.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1, 50);
    pointLight.position.set(0, 10, 10);
    machineGroup.add(pointLight);

    // Animation mixin
    machineGroup.tick = (delta, time) => {
        // Animate Eve interceptor hovering
        evesInterceptor.position.y = 3 + Math.sin(time * 2) * 0.5;
        evesInterceptor.rotation.y += delta;
        evesInterceptor.rotation.z += delta * 0.5;
        
        // Animate filters changing bases
        alicesPolarizationFilter.rotation.x = Math.sin(time) * Math.PI / 4;
        bobsPolarizationFilter.rotation.x = Math.cos(time * 1.3) * Math.PI / 4;

        // Animate photons traveling
        quantumPhotons.children.forEach((photon, index) => {
            let x = photon.position.x + delta * 15;
            if (x > 14) {
                x = -14;
                // Change color randomly to represent new polarization
                const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
                photon.material.color.setHex(colors[Math.floor(Math.random() * colors.length)]);
            }
            photon.position.x = x;
            
            // Wobble effect for quantum superposition
            photon.position.y = Math.sin(time * 10 + index) * 0.2;
            photon.position.z = Math.cos(time * 10 + index) * 0.2;
        });
    };

    // Quizzes
    const quizzes = [
        {
            question: "What principle ensures that eavesdropping on a Quantum Key Distribution (QKD) channel will be detected?",
            options: [
                "Heisenberg's Uncertainty Principle",
                "Newton's First Law",
                "Pauli Exclusion Principle",
                "The Photoelectric Effect"
            ],
            answer: "Heisenberg's Uncertainty Principle",
            explanation: "In quantum mechanics, measuring a quantum state generally alters it. Therefore, an eavesdropper measuring the photons will introduce detectable errors."
        },
        {
            question: "In the BB84 QKD protocol, what states are typically used to encode bits?",
            options: [
                "Photon polarization states",
                "Electron spin",
                "Neutron mass",
                "Proton charge"
            ],
            answer: "Photon polarization states",
            explanation: "BB84, the first QKD protocol, typically encodes information in the polarization states of single photons."
        },
        {
            question: "Why is a classical channel required in Quantum Key Distribution?",
            options: [
                "To compare measurement bases and sift the key",
                "To send the actual secret message",
                "To send more photons",
                "To power the detectors"
            ],
            answer: "To compare measurement bases and sift the key",
            explanation: "Alice and Bob must communicate over an authenticated classical channel to announce the bases they used, keeping only the results where they matched."
        },
        {
            question: "What happens if Eve intercepts and measures the photons in the quantum channel?",
            options: [
                "The quantum state collapses, introducing an abnormally high error rate",
                "Nothing, Eve learns the key silently",
                "The photons gain more energy",
                "The classical channel gets blocked"
            ],
            answer: "The quantum state collapses, introducing an abnormally high error rate",
            explanation: "According to quantum no-cloning and observer effect, Eve's measurements will alter the photon states, increasing the error rate between Alice and Bob."
        },
        {
            question: "What is the primary advantage of Quantum Key Distribution over classical public-key cryptography?",
            options: [
                "Unconditional security based on the laws of physics",
                "Faster data transfer rates",
                "Cheaper hardware",
                "It doesn't require electricity"
            ],
            answer: "Unconditional security based on the laws of physics",
            explanation: "QKD's security is mathematically proven based on quantum physics, whereas classical cryptography relies on unproven computational complexity assumptions."
        },
        {
            question: "What is the process called where Alice and Bob reduce the size of their shared key to minimize Eve's potential partial knowledge?",
            options: [
                "Privacy amplification",
                "Key distillation",
                "Quantum teleportation",
                "Superdense coding"
            ],
            answer: "Privacy amplification",
            explanation: "Privacy amplification is a classical post-processing step where a shorter, entirely secure key is generated from the partially secure sifted key."
        }
    ];
    machineGroup.quizzes = quizzes;

    return machineGroup;
}
