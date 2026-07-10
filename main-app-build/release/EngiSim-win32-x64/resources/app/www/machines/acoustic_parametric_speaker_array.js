import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Glowing Materials
    const neonBlue = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8,
        metalness: 0.1,
        roughness: 0.2
    });

    const neonPurple = new THREE.MeshPhysicalMaterial({
        color: 0xaa00ff,
        emissive: 0xaa00ff,
        emissiveIntensity: 1.2,
        transparent: true,
        opacity: 0.8,
        metalness: 0.1,
        roughness: 0.2
    });

    const ultrasonicWaveMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.1,
        side: THREE.DoubleSide
    });

    // 1. Base Structure (Aluminum casing)
    const baseGeometry = new THREE.BoxGeometry(4, 0.5, 2);
    const baseMesh = new THREE.Mesh(baseGeometry, aluminum);
    baseMesh.position.set(0, -0.25, 0);
    group.add(baseMesh);
    parts.push({
        name: "Main Housing Chassis",
        description: "Heavy-duty aluminum chassis providing structural integrity and heat dissipation.",
        material: "aluminum",
        function: "Supports the transducer array and houses the internal electronics.",
        assemblyOrder: 1,
        connections: ["Transducer Array Plate", "Power Supply Unit", "Signal Processing Board"],
        failureEffect: "Structural misalignment affecting directional accuracy.",
        cascadeFailures: ["Transducer Array Plate"],
        originalPosition: { x: 0, y: -0.25, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 }
    });

    // 2. Transducer Array Plate
    const arrayGeometry = new THREE.BoxGeometry(3.8, 0.2, 1.8);
    const arrayMesh = new THREE.Mesh(arrayGeometry, darkSteel);
    arrayMesh.position.set(0, 0.1, 0);
    group.add(arrayMesh);
    parts.push({
        name: "Transducer Array Plate",
        description: "Mounting plate containing the grid array of ultrasonic transducers.",
        material: "darkSteel",
        function: "Arranges transducers in a phased array for acoustic beamforming.",
        assemblyOrder: 2,
        connections: ["Main Housing Chassis", "Ultrasonic Transducers"],
        failureEffect: "Loss of acoustic emission capability.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0.1, z: 0 },
        explodedPosition: { x: 0, y: 1, z: 0 }
    });

    // 3. Ultrasonic Transducers (Grid)
    const transducerMeshes = [];
    const rows = 12;
    const cols = 24;
    const startX = -1.75;
    const startZ = -0.75;
    const stepX = 3.5 / (cols - 1);
    const stepZ = 1.5 / (rows - 1);

    const transducerGeom = new THREE.CylinderGeometry(0.06, 0.06, 0.1, 16);
    
    // Group transducers as one logical part for the simulation
    const transducerGroup = new THREE.Group();
    transducerGroup.position.set(0, 0.25, 0);

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const tr = new THREE.Mesh(transducerGeom, chrome);
            tr.position.set(startX + c * stepX, 0, startZ + r * stepZ);
            transducerGroup.add(tr);
            transducerMeshes.push(tr);
        }
    }
    group.add(transducerGroup);

    parts.push({
        name: "Ultrasonic Piezo Transducers",
        description: "Array of high-frequency piezoelectric emitters.",
        material: "chrome",
        function: "Generates ultrasonic carrier waves modulated with the audio signal.",
        assemblyOrder: 3,
        connections: ["Transducer Array Plate", "Amplifier Circuitry"],
        failureEffect: "Reduced beam intensity or distortion.",
        cascadeFailures: ["Acoustic Beam"],
        originalPosition: { x: 0, y: 0.25, z: 0 },
        explodedPosition: { x: 0, y: 2.5, z: 0 }
    });

    // 4. Signal Processing Unit (Glowing chip)
    const dspGeometry = new THREE.BoxGeometry(0.8, 0.1, 0.8);
    const dspMesh = new THREE.Mesh(dspGeometry, neonBlue);
    dspMesh.position.set(0, 0.35, 0); // Placed slightly above center, conceptually internal but visible for tech look
    group.add(dspMesh);
    parts.push({
        name: "DSP Modulator Core",
        description: "Digital Signal Processor handling amplitude modulation.",
        material: "neonBlue",
        function: "Modulates the incoming audible audio signal onto the ultrasonic carrier wave.",
        assemblyOrder: 4,
        connections: ["Signal Input", "Amplifier Circuitry"],
        failureEffect: "Total loss of audio decoding, emitting only high-frequency noise.",
        cascadeFailures: ["Ultrasonic Piezo Transducers"],
        originalPosition: { x: 0, y: 0.35, z: 0 },
        explodedPosition: { x: -2, y: 3, z: 0 }
    });

    // 5. High-Voltage Amplifier Board
    const ampGeometry = new THREE.BoxGeometry(1.2, 0.1, 1.2);
    const ampMesh = new THREE.Mesh(ampGeometry, copper);
    ampMesh.position.set(1.2, 0.35, 0);
    group.add(ampMesh);
    parts.push({
        name: "High-Voltage Amplifier Board",
        description: "Power amplification circuit driving the piezo array.",
        material: "copper",
        function: "Boosts the modulated signal to the high voltages required by piezoelectric transducers.",
        assemblyOrder: 5,
        connections: ["DSP Modulator Core", "Power Supply Unit", "Ultrasonic Piezo Transducers"],
        failureEffect: "Weak or no signal emitted.",
        cascadeFailures: [],
        originalPosition: { x: 1.2, y: 0.35, z: 0 },
        explodedPosition: { x: 2, y: 3, z: 0 }
    });

    // 6. Acoustic Waveform Visualizer (Animated)
    const waveGeom = new THREE.ConeGeometry(1, 4, 32, 1, true);
    // Rotate to point forward (along Z or Y)
    waveGeom.rotateX(Math.PI / 2);
    waveGeom.translate(0, 0, 2); // Shift forward
    
    const waveMesh = new THREE.Mesh(waveGeom, neonPurple);
    waveMesh.position.set(0, 0.25, 0);
    group.add(waveMesh);
    parts.push({
        name: "Directional Acoustic Beam",
        description: "Visual representation of the focused highly-directional sound wave.",
        material: "neonPurple",
        function: "Propagates the modulated ultrasound which demodulates into audible sound in the air.",
        assemblyOrder: 6,
        connections: ["Ultrasonic Piezo Transducers"],
        failureEffect: "Beam spread or dissipation.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0.25, z: 0 },
        explodedPosition: { x: 0, y: 0.25, z: 5 }
    });


    const description = "An Acoustic Parametric Speaker Array uses the non-linear properties of air to create highly directional beams of audible sound. It achieves this by modulating an audible audio signal onto an ultrasonic carrier wave. As this high-intensity ultrasonic beam travels through the air, the air itself acts as a demodulator, reproducing the original audible sound only along the narrow path of the beam.";

    const quizQuestions = [
        {
            question: "What physical medium acts as the 'demodulator' in a parametric speaker?",
            options: ["The piezoelectric transducers", "The DSP core", "The human ear drum", "The air itself"],
            correct: 3,
            explanation: "Parametric speakers rely on the non-linear acoustic properties of the air itself to demodulate the high-frequency ultrasonic carrier wave back into audible frequencies.",
            difficulty: "Medium"
        },
        {
            question: "Why does a parametric speaker use ultrasonic waves instead of normal audible waves?",
            options: ["To save electricity", "Ultrasonic waves are highly directional due to their short wavelength", "Ultrasonic waves travel faster", "It prevents interference with radio waves"],
            correct: 1,
            explanation: "Ultrasonic waves have very high frequencies and short wavelengths, allowing them to be formed into a tight, highly directional beam using an array of transducers.",
            difficulty: "Hard"
        },
        {
            question: "What component is responsible for combining the audible signal with the ultrasonic carrier?",
            options: ["High-Voltage Amplifier", "DSP Modulator Core", "Main Housing Chassis", "Piezoelectric Transducers"],
            correct: 1,
            explanation: "The Digital Signal Processor (DSP) Modulator Core modulates the audible sound signal onto the ultrasonic carrier frequency before amplification.",
            difficulty: "Easy"
        }
    ];

    const animate = (time, speed, meshes) => {
        // DSP Pulsing
        const dsp = meshes[3]; // DSP Modulator Core
        if (dsp) {
            dsp.material.emissiveIntensity = 1.2 + Math.sin(time * 5 * speed) * 0.5;
        }

        // Transducer rippling effect
        const transducerGrp = meshes[2];
        if (transducerGrp) {
            transducerGrp.children.forEach((tr, index) => {
                const x = tr.position.x;
                const z = tr.position.z;
                const dist = Math.sqrt(x*x + z*z);
                tr.position.y = Math.sin(dist * 5 - time * 10 * speed) * 0.05;
            });
        }

        // Acoustic Waveform Pulsing & Expanding
        const wave = meshes[5]; // Directional Acoustic Beam
        if (wave) {
            const scale = 1 + (time * speed * 2) % 1;
            wave.scale.set(scale, scale, scale);
            wave.material.opacity = 0.8 * (1 - (time * speed * 2) % 1);
        }
    };

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createParametricSpeakerArray() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
