import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom glowing materials
    const neonRed = new THREE.MeshPhysicalMaterial({
        color: 0xff0033,
        emissive: 0xff0000,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.8,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const neonInfrared = new THREE.MeshPhysicalMaterial({
        color: 0xff2255,
        emissive: 0xcc0033,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.6,
        transmission: 0.9,
    });

    const detectorGlow = new THREE.MeshPhysicalMaterial({
        color: 0x00aaff,
        emissive: 0x0055ff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.8
    });

    const neuroPlastic = new THREE.MeshPhysicalMaterial({
        color: 0x1a1a1a,
        roughness: 0.4,
        metalness: 0.1,
        clearcoat: 0.5
    });

    const softSilicone = new THREE.MeshPhysicalMaterial({
        color: 0x2c2c2c,
        roughness: 0.9,
        metalness: 0.0,
        transparent: true,
        opacity: 0.95
    });

    const goldConnector = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 1.0,
        roughness: 0.2
    });

    // 1. Headpiece / Cap (Main structure)
    const capGeometry = new THREE.SphereGeometry(4, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2 + 0.2);
    const cap = new THREE.Mesh(capGeometry, softSilicone);
    cap.position.set(0, 0, 0);
    group.add(cap);
    meshes.cap = cap;
    parts.push({
        name: "Cap Structure",
        description: "Flexible, breathable silicone cap that conforms to the scalp.",
        material: "Silicone",
        function: "Holds the optodes (sources and detectors) securely against the scalp to ensure optimal signal quality.",
        assemblyOrder: 1,
        connections: ["Optodes", "Control Module"],
        failureEffect: "Optode slippage, resulting in motion artifacts and signal loss.",
        cascadeFailures: ["Signal Processing Failure", "Data Inaccuracy"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 3, z: 0 }
    });

    // 2. Control Module / Amplifier (Back of head)
    const controlGeom = new THREE.BoxGeometry(2, 1, 0.8);
    const controlModule = new THREE.Mesh(controlGeom, darkSteel);
    controlModule.position.set(0, -1, -4);
    controlModule.rotation.x = -0.2;
    group.add(controlModule);
    meshes.controlModule = controlModule;
    parts.push({
        name: "Amplifier & Control Module",
        description: "Miniaturized electronics housing the ADCs, laser drivers, and wireless transmission.",
        material: "Dark Steel / Aluminum",
        function: "Drives the laser diodes, amplifies detector signals, and transmits data to the processing unit.",
        assemblyOrder: 2,
        connections: ["Cap Structure", "Battery", "Fiber Optics"],
        failureEffect: "Complete system shutdown or severe data corruption.",
        cascadeFailures: ["Loss of Communication", "Sensor Blanking"],
        originalPosition: { x: 0, y: -1, z: -4 },
        explodedPosition: { x: 0, y: -3, z: -8 }
    });

    // 3. Optodes (Sources and Detectors)
    const optodesGroup = new THREE.Group();
    const lightPathsGroup = new THREE.Group();
    meshes.sources = [];
    meshes.detectors = [];
    meshes.lightPaths = [];

    const numPairs = 8;
    for(let i=0; i<numPairs; i++) {
        const angle = (i / numPairs) * Math.PI * 2;
        const radius = 4;
        const y = 1;
        
        // Source
        const sX = Math.cos(angle) * radius * 0.9;
        const sZ = Math.sin(angle) * radius * 0.9;
        const srcGeom = new THREE.CylinderGeometry(0.2, 0.2, 0.8, 16);
        srcGeom.rotateX(Math.PI/2);
        const source = new THREE.Mesh(srcGeom, neonRed);
        source.position.set(sX, y, sZ);
        source.lookAt(0, y, 0);
        optodesGroup.add(source);
        meshes.sources.push(source);

        // Detector
        const dAngle = angle + (Math.PI / 8);
        const dX = Math.cos(dAngle) * radius * 0.9;
        const dZ = Math.sin(dAngle) * radius * 0.9;
        const detGeom = new THREE.CylinderGeometry(0.25, 0.25, 0.6, 16);
        detGeom.rotateX(Math.PI/2);
        const detector = new THREE.Mesh(detGeom, detectorGlow);
        detector.position.set(dX, y, dZ);
        detector.lookAt(0, y, 0);
        optodesGroup.add(detector);
        meshes.detectors.push(detector);

        // Banana-shaped light path
        const curve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(sX, y, sZ),
            new THREE.Vector3((sX+dX)/2 * 0.7, y - 1.5, (sZ+dZ)/2 * 0.7), // penetrate inward
            new THREE.Vector3(dX, y, dZ)
        );
        const tubeGeom = new THREE.TubeGeometry(curve, 20, 0.05, 8, false);
        const path = new THREE.Mesh(tubeGeom, neonInfrared);
        lightPathsGroup.add(path);
        meshes.lightPaths.push(path);
    }
    group.add(optodesGroup);
    group.add(lightPathsGroup);

    parts.push({
        name: "NIR Sources",
        description: "Laser diodes emitting at specific near-infrared wavelengths (e.g., 760nm and 850nm).",
        material: "Semiconductor / Glass",
        function: "Emits light that penetrates the scalp and skull to reach cortical tissue.",
        assemblyOrder: 3,
        connections: ["Control Module", "Scalp"],
        failureEffect: "No light emitted, resulting in zero signal from detectors.",
        cascadeFailures: ["Failed Oxygenation Measurement"],
        originalPosition: { x: 0, y: 1, z: 0 },
        explodedPosition: { x: -3, y: 1, z: 0 }
    });

    parts.push({
        name: "Avalanche Photodiode Detectors",
        description: "Highly sensitive light detectors optimized for near-infrared wavelengths.",
        material: "Silicon / Chrome",
        function: "Detects back-scattered light after it has traveled through brain tissue, measuring attenuation due to HbO and HbR.",
        assemblyOrder: 4,
        connections: ["Control Module", "Scalp"],
        failureEffect: "Inability to measure returning light.",
        cascadeFailures: ["Signal Loss", "False Positive Activation"],
        originalPosition: { x: 0, y: 1, z: 0 },
        explodedPosition: { x: 3, y: 1, z: 0 }
    });

    parts.push({
        name: "Photon Trajectories (Banana Paths)",
        description: "The path light takes through the head, scattering back to the surface.",
        material: "Infrared Energy",
        function: "Interacts with oxygenated and deoxygenated hemoglobin to reveal hemodynamic response.",
        assemblyOrder: 5,
        connections: ["NIR Sources", "Detectors"],
        failureEffect: "Scattering disruption from hair or dark skin tones.",
        cascadeFailures: ["Poor Signal-to-Noise Ratio"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 }
    });

    // Wires/Fibers
    const fibersGroup = new THREE.Group();
    meshes.fibers = [];
    for(let i=0; i<numPairs; i++) {
        // Source wire
        const sx = meshes.sources[i].position.x;
        const sz = meshes.sources[i].position.z;
        const scurve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(sx * 1.1, 1, sz * 1.1),
            new THREE.Vector3(sx * 1.2, 0, sz * 1.2),
            new THREE.Vector3(0, -1, -4) // to control module
        );
        const stube = new THREE.Mesh(new THREE.TubeGeometry(scurve, 20, 0.03, 8, false), plastic);
        fibersGroup.add(stube);
        meshes.fibers.push(stube);
    }
    group.add(fibersGroup);
    parts.push({
        name: "Fiber Optic / Wire Harness",
        description: "Bundle of cables connecting optodes to the control module.",
        material: "Copper / Optical Fiber",
        function: "Transmits power, control signals, and analog sensor data.",
        assemblyOrder: 6,
        connections: ["Optodes", "Control Module"],
        failureEffect: "Intermittent connection, noise, or complete channel failure.",
        cascadeFailures: ["Data Dropouts"],
        originalPosition: { x: 0, y: 0, z: -2 },
        explodedPosition: { x: 0, y: 2, z: -6 }
    });

    const description = "The Functional Near-Infrared Spectroscopy (fNIRS) array is a non-invasive brain-computer interface. It measures hemodynamic responses (changes in blood oxygenation) by emitting near-infrared light into the scalp and detecting the back-scattered photons. Highly oxygenated blood absorbs light differently than deoxygenated blood, allowing the system to infer neural activity.";

    const quizQuestions = [
        {
            question: "What does an fNIRS system actually measure to infer brain activity?",
            options: [
                "Electrical action potentials from neurons",
                "Magnetic fields generated by the brain",
                "Changes in blood oxygenation (hemodynamic response)",
                "Glucose metabolism rates"
            ],
            correct: 2,
            explanation: "fNIRS measures the absorption of near-infrared light, which changes depending on the concentration of oxygenated and deoxygenated hemoglobin, known as the hemodynamic response.",
            difficulty: "Medium"
        },
        {
            question: "Why is the path of light between a source and detector in fNIRS often described as 'banana-shaped'?",
            options: [
                "Because photons travel in straight lines and bounce once",
                "Due to the scattering of light in biological tissue causing a curved probability path",
                "Because the sensors are physically curved",
                "It is a metaphor for the brain's shape"
            ],
            correct: 1,
            explanation: "Light highly scatters in tissue. The most probable path for a photon to travel from source to detector forms a crescent or 'banana' shape through the cortex.",
            difficulty: "Hard"
        },
        {
            question: "Which of these is a common advantage of fNIRS over fMRI?",
            options: [
                "It has higher spatial resolution",
                "It can measure deep brain structures like the amygdala",
                "It is portable and allows for movement",
                "It directly measures neuronal firing"
            ],
            correct: 2,
            explanation: "fNIRS is portable, relatively cheap, and tolerant of participant movement compared to fMRI, which requires a large, restrictive magnetic tube.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshes) {
        // Pulse the light sources
        const pulse = (Math.sin(time * speed * 5) + 1) / 2;
        meshes.sources.forEach(src => {
            src.material.emissiveIntensity = 0.5 + pulse * 2.5;
        });

        // Flow effect in the banana paths
        meshes.lightPaths.forEach((path, index) => {
            const offset = index * 0.1;
            path.material.opacity = 0.3 + ((Math.sin(time * speed * 3 + offset) + 1) / 2) * 0.6;
        });

        // Detector reception blinks slightly delayed
        meshes.detectors.forEach((det, index) => {
            const offset = index * 0.1 + Math.PI / 4;
            det.material.emissiveIntensity = 0.5 + ((Math.sin(time * speed * 5 + offset) + 1) / 2) * 1.5;
        });
        
        // Control module processing lights
        meshes.controlModule.rotation.z = Math.sin(time * speed) * 0.05;
    }

    return { group, parts, description, quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createNIRSArray() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
