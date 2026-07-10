import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom High-Tech Glowing Materials
    const neonCyan = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.6,
        wireframe: true
    });

    const neonOrange = new THREE.MeshStandardMaterial({
        color: 0xff8800,
        emissive: 0xff8800,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.6,
        wireframe: true
    });

    const neonPurple = new THREE.MeshStandardMaterial({
        color: 0x8800ff,
        emissive: 0xaa00ff,
        emissiveIntensity: 1.0,
        transparent: true,
        opacity: 0.9,
        roughness: 0.2,
        metalness: 0.8
    });

    // 1. Bio-Mechanical Cranium (Body)
    const bodyGeo = new THREE.CylinderGeometry(0.5, 1, 2, 8);
    const bodyMesh = new THREE.Mesh(bodyGeo, darkSteel);
    bodyMesh.rotation.x = Math.PI / 2;
    bodyMesh.position.set(0, 0, 0);
    group.add(bodyMesh);
    meshes.body = bodyMesh;

    parts.push({
        name: "Bio-Mechanical Cranium",
        description: "The primary structural chassis housing the complex bio-acoustic systems.",
        material: "darkSteel",
        function: "Provides structural integrity and houses the neural auditory cortex.",
        assemblyOrder: 1,
        connections: ["Larynx", "Auditory Cortex", "Ears"],
        failureEffect: "Structural collapse.",
        cascadeFailures: ["All systems offline"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 3, z: -2 }
    });

    // 2. Larynx (Vocal Source)
    const larynxGeo = new THREE.BoxGeometry(0.6, 0.6, 0.8);
    const larynxMesh = new THREE.Mesh(larynxGeo, copper);
    larynxMesh.position.set(0, -0.3, 1);
    group.add(larynxMesh);
    meshes.larynx = larynxMesh;

    parts.push({
        name: "Hyper-Frequency Larynx",
        description: "Generates ultra-high-frequency acoustic pulses (FM and CF signals).",
        material: "copper",
        function: "Acts as the signal transmitter, creating the powerful bio-sonar chirp.",
        assemblyOrder: 2,
        connections: ["Bio-Mechanical Cranium", "Emitter Cone"],
        failureEffect: "No sound emitted.",
        cascadeFailures: ["No echoes received", "Tracking failure", "Navigation offline"],
        originalPosition: { x: 0, y: -0.3, z: 1 },
        explodedPosition: { x: 0, y: -2, z: 1.5 }
    });

    // 3. Emitter Cone (Noseleaf)
    const coneGeo = new THREE.ConeGeometry(0.8, 1.5, 16);
    const coneMesh = new THREE.Mesh(coneGeo, chrome);
    coneMesh.rotation.x = Math.PI / 2;
    coneMesh.position.set(0, -0.3, 2);
    group.add(coneMesh);
    meshes.emitter = coneMesh;

    parts.push({
        name: "Directional Emitter Noseleaf",
        description: "A specialized biological structure that focuses the ultrasonic pulses.",
        material: "chrome",
        function: "Shapes and directs the acoustic beam for precise targeting and ranging.",
        assemblyOrder: 3,
        connections: ["Hyper-Frequency Larynx"],
        failureEffect: "Signal dispersion.",
        cascadeFailures: ["Reduced detection range", "Loss of target resolution"],
        originalPosition: { x: 0, y: -0.3, z: 2 },
        explodedPosition: { x: 0, y: -3, z: 4 }
    });

    // 4. Left Ear (Parabolic Receiver)
    const earGeo = new THREE.SphereGeometry(0.8, 16, 16, 0, Math.PI, 0, Math.PI / 2);
    const leftEar = new THREE.Mesh(earGeo, aluminum);
    leftEar.rotation.set(-Math.PI / 2, Math.PI / 4, 0);
    leftEar.position.set(-1.2, 0.8, 0.5);
    leftEar.material.side = THREE.DoubleSide;
    group.add(leftEar);
    meshes.leftEar = leftEar;

    parts.push({
        name: "Left Parabolic Receiver (Ear)",
        description: "Highly sensitive acoustic receiver featuring a specialized tragus.",
        material: "aluminum",
        function: "Captures returning echoes and determines vertical/horizontal target elevation.",
        assemblyOrder: 4,
        connections: ["Bio-Mechanical Cranium", "Neural Auditory Cortex"],
        failureEffect: "Deafness on the port side.",
        cascadeFailures: ["Loss of spatial triangulation"],
        originalPosition: { x: -1.2, y: 0.8, z: 0.5 },
        explodedPosition: { x: -3.5, y: 2, z: 1 }
    });

    // 5. Right Ear (Parabolic Receiver)
    const rightEar = new THREE.Mesh(earGeo, aluminum);
    rightEar.rotation.set(-Math.PI / 2, -Math.PI / 4, 0);
    rightEar.position.set(1.2, 0.8, 0.5);
    rightEar.material.side = THREE.DoubleSide;
    group.add(rightEar);
    meshes.rightEar = rightEar;

    parts.push({
        name: "Right Parabolic Receiver (Ear)",
        description: "Highly sensitive acoustic receiver featuring a specialized tragus.",
        material: "aluminum",
        function: "Captures returning echoes and determines vertical/horizontal target elevation.",
        assemblyOrder: 5,
        connections: ["Bio-Mechanical Cranium", "Neural Auditory Cortex"],
        failureEffect: "Deafness on the starboard side.",
        cascadeFailures: ["Loss of spatial triangulation"],
        originalPosition: { x: 1.2, y: 0.8, z: 0.5 },
        explodedPosition: { x: 3.5, y: 2, z: 1 }
    });

    // 6. Neural Auditory Cortex (Processor)
    const cortexGeo = new THREE.IcosahedronGeometry(0.6, 1);
    const cortexMesh = new THREE.Mesh(cortexGeo, neonPurple);
    cortexMesh.position.set(0, 0.6, -0.5);
    group.add(cortexMesh);
    meshes.cortex = cortexMesh;

    parts.push({
        name: "Neural Auditory Cortex",
        description: "Advanced biological signal processor analyzing Doppler shifts and micro-time delays.",
        material: "neonPurple",
        function: "Computes the exact distance, velocity, and size of the target from returning echoes.",
        assemblyOrder: 6,
        connections: ["Left Parabolic Receiver (Ear)", "Right Parabolic Receiver (Ear)"],
        failureEffect: "Inability to process echoes.",
        cascadeFailures: ["Total system blindness", "Flight control disorientation"],
        originalPosition: { x: 0, y: 0.6, z: -0.5 },
        explodedPosition: { x: 0, y: 4, z: -1.5 }
    });

    // Visual FX: Emitted Soundwaves (Ring Array)
    meshes.waves = [];
    for (let i = 0; i < 3; i++) {
        const waveGeo = new THREE.TorusGeometry(0.5, 0.05, 8, 32);
        const wave = new THREE.Mesh(waveGeo, neonCyan);
        wave.position.set(0, -0.3, 2);
        wave.visible = false;
        group.add(wave);
        meshes.waves.push(wave);
    }

    // Visual FX: Target (Moth/Prey)
    const targetGeo = new THREE.OctahedronGeometry(0.3);
    const targetMesh = new THREE.Mesh(targetGeo, glass);
    targetMesh.position.set(2, 1, 8);
    group.add(targetMesh);
    meshes.target = targetMesh;

    // Visual FX: Return Echoes
    meshes.echoes = [];
    for (let i = 0; i < 2; i++) {
        const echoGeo = new THREE.SphereGeometry(0.4, 16, 16);
        const echo = new THREE.Mesh(echoGeo, neonOrange);
        echo.position.set(2, 1, 8);
        echo.scale.set(0.1, 0.1, 0.1);
        echo.visible = false;
        group.add(echo);
        meshes.echoes.push(echo);
    }

    const description = "The Bat Echolocation Sonar system models the complex bio-acoustic mechanism used by Microchiroptera to navigate and hunt in total darkness. It emits high-frequency ultrasonic chirps, which bounce off objects. The precise timing, intensity, and frequency shift (Doppler effect) of the returning echoes are processed by the auditory cortex to form a high-resolution 3D spatial map.";

    const quizQuestions = [
        {
            question: "What function does the biological 'noseleaf' or emitter cone serve in bat echolocation?",
            options: [
                "It absorbs returning echoes to prevent interference.",
                "It shapes and focuses the emitted ultrasonic beam.",
                "It detects the temperature of the target.",
                "It lowers the frequency of the sound for better penetration."
            ],
            correct: 1,
            explanation: "The noseleaf acts like a megaphone or radar dish, focusing the ultrasonic soundwaves emitted by the larynx into a directional beam, increasing range and accuracy.",
            difficulty: "Medium"
        },
        {
            question: "How does the bat's auditory cortex determine the relative velocity (speed) of a flying insect?",
            options: [
                "By measuring the absolute loudness of the echo.",
                "By calculating the time delay between emission and reception.",
                "By analyzing the Doppler shift (change in frequency) of the returning echo.",
                "By using visual cues combined with sound."
            ],
            correct: 2,
            explanation: "The Doppler shift causes the frequency of the echo to increase if the target is approaching, and decrease if it is moving away, allowing the bat to precisely calculate velocity.",
            difficulty: "Hard"
        },
        {
            question: "What is the primary role of the highly specialized ear structures (like the tragus) in echolocating bats?",
            options: [
                "To filter out the bat's own loud emitted chirps.",
                "To determine the vertical elevation of a target through complex interference patterns.",
                "To emit secondary low-frequency sounds.",
                "To cool the bat during sustained flight."
            ],
            correct: 1,
            explanation: "Structures like the tragus create complex interference patterns in the incoming sound waves depending on their angle of arrival, allowing the bat to precisely determine the target's vertical elevation.",
            difficulty: "Hard"
        }
    ];

    let phase = 0;

    function animate(time, speed, extMeshes) {
        const m = extMeshes || meshes;

        // Pulse the auditory cortex
        m.cortex.scale.setScalar(1 + 0.1 * Math.sin(time * 5 * speed));
        m.cortex.rotation.y = time * speed;
        m.cortex.rotation.z = time * speed * 0.5;

        // Target (Prey) erratic flight movement
        m.target.position.x = 2 * Math.sin(time * speed * 0.5);
        m.target.position.y = 1 + 0.5 * Math.cos(time * speed * 0.7);
        m.target.position.z = 8 + 2 * Math.sin(time * speed * 0.3);
        m.target.rotation.x = time * speed;
        m.target.rotation.y = time * speed * 2;

        // Ear movement (scanning radar-like motion)
        m.leftEar.rotation.y = Math.PI / 4 + 0.2 * Math.sin(time * speed * 2);
        m.rightEar.rotation.y = -Math.PI / 4 - 0.2 * Math.sin(time * speed * 2 + Math.PI);

        // Wave and Echo animation loop (Emission -> Hit -> Echo -> Receive)
        phase = (time * speed * 1.5) % 4; // 0 to 4 cycle

        const emitPhase = phase;

        // Emitted Waves expanding towards target
        m.waves.forEach((wave, idx) => {
            let wPhase = emitPhase - (idx * 0.2);
            if (wPhase > 0 && wPhase < 1.5) {
                wave.visible = true;
                // Lerp towards target
                const startWave = new THREE.Vector3(0, -0.3, 2);
                wave.position.copy(startWave).lerp(m.target.position, wPhase / 1.5);
                wave.scale.setScalar(1 + wPhase * 5); // Expand radially
                wave.material.opacity = 1 - (wPhase / 1.5); // Fade out as it travels
                wave.lookAt(m.target.position);
            } else {
                wave.visible = false;
            }
        });

        // Returning Echoes bouncing back to the ears
        m.echoes.forEach((echo, idx) => {
            let ePhase = phase - 1.5 - (idx * 0.3); // Starts after waves reach target
            if (ePhase > 0 && ePhase < 1.5) {
                echo.visible = true;
                // Move from target back to bat's head
                const startPos = m.target.position;
                const endPos = new THREE.Vector3(0, 0.6, 0); // Head/Ears

                echo.position.copy(startPos).lerp(endPos, ePhase / 1.5);
                echo.scale.setScalar(1 + ePhase * 3); // Expand as it gets closer
                echo.material.opacity = 1 - (ePhase / 1.5);
            } else {
                echo.visible = false;
            }
        });
    }

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createBatEcholocation() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
