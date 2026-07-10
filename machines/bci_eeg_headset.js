import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom Glowing Materials
    const activeElectrodeMat = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.9,
        roughness: 0.1,
        metalness: 0.8
    });

    const inactiveElectrodeMat = new THREE.MeshStandardMaterial({
        color: 0x003333,
        emissive: 0x001111,
        emissiveIntensity: 0.2,
        roughness: 0.4,
        metalness: 0.6
    });

    const wireMat = new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.8,
        metalness: 0.2
    });

    const glowingDataMat = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 2.0,
        wireframe: true
    });

    // 1. Headset Frame (Band)
    const frameGeometry = new THREE.TorusGeometry(3, 0.4, 32, 100, Math.PI * 1.5);
    const frameMesh = new THREE.Mesh(frameGeometry, plastic);
    frameMesh.rotation.x = Math.PI / 2;
    frameMesh.rotation.z = Math.PI * 0.25;
    group.add(frameMesh);
    meshes.frame = frameMesh;

    parts.push({
        name: "Polymer Headband",
        description: "Adjustable, flexible headband providing structural support and securing the electrodes to the scalp.",
        material: "High-density Polymer",
        function: "Maintains optimal pressure for sensor-to-skin contact across varying head shapes.",
        assemblyOrder: 1,
        connections: ["Electrode Nodes", "Signal Amplifier"],
        failureEffect: "Loose connection to scalp, resulting in noisy or completely lost EEG signals.",
        cascadeFailures: ["Signal Processor Disconnect"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 }
    });

    // 2. Electrode Nodes
    const electrodeGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.5, 16);
    const numElectrodes = 8;
    const electrodes = new THREE.Group();
    meshes.electrodes = [];
    
    const electrodeRadius = 3;
    const startAngle = Math.PI * 0.25;
    const endAngle = Math.PI * 1.75;
    const angleStep = (endAngle - startAngle) / (numElectrodes - 1);

    for (let i = 0; i < numElectrodes; i++) {
        const angle = startAngle + i * angleStep;
        const electrode = new THREE.Mesh(electrodeGeometry, activeElectrodeMat.clone());
        electrode.position.x = Math.cos(angle) * electrodeRadius;
        electrode.position.z = Math.sin(angle) * electrodeRadius;
        electrode.position.y = 0;
        electrode.rotation.x = Math.PI / 2;
        electrode.rotation.z = angle;

        electrodes.add(electrode);
        meshes.electrodes.push(electrode);
    }
    frameMesh.add(electrodes);

    parts.push({
        name: "Dry Active Electrodes",
        description: "Gold-plated sensors arrayed across the 10-20 system positions to detect microvolt electrical potentials.",
        material: "Gold-plated Copper / Active Glowing Polymer",
        function: "Detects neural oscillatory patterns (alpha, beta, gamma waves) directly from the scalp.",
        assemblyOrder: 2,
        connections: ["Polymer Headband", "Signal Amplifier"],
        failureEffect: "Missing channels in EEG data stream.",
        cascadeFailures: ["BCI Decoding Inaccuracy"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 4 }
    });

    // 3. Signal Amplifier & Processor (Back of head)
    const processorGeometry = new THREE.BoxGeometry(2, 1.5, 1);
    const processorMesh = new THREE.Mesh(processorGeometry, aluminum);
    processorMesh.position.set(-2.5, 0, 2.5); // Placed at one end of the torus
    processorMesh.rotation.y = Math.PI / 4;
    group.add(processorMesh);
    meshes.processor = processorMesh;

    // Glowing core inside processor
    const coreGeometry = new THREE.BoxGeometry(1.8, 1.3, 0.8);
    const coreMesh = new THREE.Mesh(coreGeometry, glowingDataMat);
    processorMesh.add(coreMesh);
    meshes.core = coreMesh;

    parts.push({
        name: "Neuro-Signal Amplifier",
        description: "High-resolution analog-to-digital converter unit with built-in noise filtration.",
        material: "Anodized Aluminum & Silicon",
        function: "Amplifies microvolt EEG signals by 10,000x and digitizes them for computer processing.",
        assemblyOrder: 3,
        connections: ["Electrode Nodes", "Bluetooth Transmitter"],
        failureEffect: "Complete loss of readable brain data; output is purely electrical noise.",
        cascadeFailures: ["Bluetooth Transmitter"],
        originalPosition: { x: -2.5, y: 0, z: 2.5 },
        explodedPosition: { x: -6, y: 2, z: 6 }
    });

    // 4. Reference Ear Clip
    const earClipGeometry = new THREE.TorusGeometry(0.5, 0.1, 16, 32);
    const earClipMesh = new THREE.Mesh(earClipGeometry, steel);
    earClipMesh.position.set(4, -2, 0);
    group.add(earClipMesh);
    meshes.earClip = earClipMesh;

    parts.push({
        name: "Reference Ear Clip",
        description: "Secondary electrode attached to the earlobe, an electrically neutral area of the head.",
        material: "Stainless Steel",
        function: "Provides a baseline electrical ground reference to subtract ambient electromagnetic noise.",
        assemblyOrder: 4,
        connections: ["Signal Amplifier"],
        failureEffect: "Massive 50/60Hz AC noise contamination, making EEG data completely unusable.",
        cascadeFailures: [],
        originalPosition: { x: 4, y: -2, z: 0 },
        explodedPosition: { x: 8, y: -5, z: 0 }
    });

    // 5. Data Transmitter (Bluetooth)
    const txGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1, 16);
    const txMesh = new THREE.Mesh(txGeometry, chrome);
    txMesh.position.set(0, 1, 0);
    processorMesh.add(txMesh);
    meshes.transmitter = txMesh;

    // Antenna glow
    const antennaGlowGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const antennaGlowMesh = new THREE.Mesh(antennaGlowGeometry, glowingDataMat);
    antennaGlowMesh.position.set(0, 0.6, 0);
    txMesh.add(antennaGlowMesh);
    meshes.antennaGlow = antennaGlowMesh;

    parts.push({
        name: "Wireless Data Transmitter",
        description: "Low-latency Bluetooth 5.0 module for streaming data to the host machine.",
        material: "Chrome / Antenna Coil",
        function: "Transmits the digitized neural data stream to external interfaces without physical tethering.",
        assemblyOrder: 5,
        connections: ["Neuro-Signal Amplifier"],
        failureEffect: "Host connection drops; user loses control of the BCI software.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 1, z: 0 }, // Relative to processor
        explodedPosition: { x: 0, y: 5, z: 0 }  // Relative to processor
    });

    const description = "A high-fidelity Brain-Computer Interface (BCI) EEG Headset. It non-invasively records electrical activity of the brain via dry active electrodes. Essential for neurofeedback, cognitive research, and direct brain-to-machine control systems.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Reference Ear Clip in an EEG setup?",
            options: [
                "To detect auditory evoked potentials.",
                "To stimulate the vagus nerve.",
                "To provide an electrically neutral baseline to filter out ambient noise.",
                "To secure the headset to the user's head."
            ],
            correct: 2,
            explanation: "The earlobe has very little muscle and no brain activity, making it an excellent neutral ground to help the amplifier differentiate between real brain waves and environmental electrical noise.",
            difficulty: "Medium"
        },
        {
            question: "Why does the Neuro-Signal Amplifier need to amplify the signals by factors of 1,000x to 10,000x?",
            options: [
                "Because EEG signals must be broadcasted over long distances.",
                "Because EEG signals measured at the scalp are in the microvolt (µV) range and are very weak.",
                "To power the glowing LEDs on the headset.",
                "To overcome the resistance of the Bluetooth connection."
            ],
            correct: 1,
            explanation: "Brain electrical signals are significantly attenuated by the skull and scalp. By the time they reach the surface, they are in the microvolt range and must be massively amplified to be read by digital converters.",
            difficulty: "Easy"
        },
        {
            question: "What happens if a Dry Active Electrode loses physical contact with the scalp?",
            options: [
                "The system switches to an internal battery backup.",
                "The patient receives a mild electric shock.",
                "The impedance drops to zero, improving signal quality.",
                "The channel drops out or records extreme noise (high impedance), corrupting the data stream."
            ],
            correct: 3,
            explanation: "Good electrical contact is crucial. If an electrode lifts off the scalp, the impedance shoots up, and the amplifier will primarily pick up environmental noise instead of brainwaves.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshesObj = meshes) {
        // Pulse the electrodes to simulate neural firing
        if (meshesObj.electrodes) {
            meshesObj.electrodes.forEach((electrode, index) => {
                const phaseOffset = index * 0.5;
                const pulse = (Math.sin(time * speed * 5 + phaseOffset) + 1) / 2; // 0 to 1
                electrode.material.emissiveIntensity = 0.5 + pulse * 2.0;
                
                // Randomly flicker some to inactive state simulating signal loss or noise
                if (Math.random() > 0.98) {
                    electrode.material.color.setHex(0x003333);
                    electrode.material.emissive.setHex(0x001111);
                } else {
                    electrode.material.color.setHex(0x00ffff);
                    electrode.material.emissive.setHex(0x00ffff);
                }
            });
        }

        // Pulse the data core
        if (meshesObj.core) {
            meshesObj.core.scale.x = 1 + Math.sin(time * speed * 10) * 0.05;
            meshesObj.core.scale.y = 1 + Math.cos(time * speed * 11) * 0.05;
            meshesObj.core.scale.z = 1 + Math.sin(time * speed * 9) * 0.05;
            meshesObj.core.material.emissiveIntensity = 1 + Math.sin(time * speed * 20) * 1.0;
        }

        // Spin the antenna glow
        if (meshesObj.antennaGlow) {
            meshesObj.antennaGlow.rotation.y += 0.1 * speed;
            meshesObj.antennaGlow.material.emissiveIntensity = 1.5 + Math.sin(time * speed * 30) * 0.5;
        }
        
        // Gentle hover of the whole group
        group.position.y = Math.sin(time * speed * 2) * 0.2;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createEEGHeadset() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
