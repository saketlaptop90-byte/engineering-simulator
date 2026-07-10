import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
        roughness: 0.2,
        metalness: 0.8
    });

    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff0055,
        emissive: 0xff0055,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9
    });

    const silicon = new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.8,
        metalness: 0.5
    });

    const translucentPlastic = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.8,
        opacity: 1,
        metalness: 0.1,
        roughness: 0.2,
        ior: 1.5,
        thickness: 0.5,
        transparent: true
    });

    function addPart(name, mesh, data) {
        mesh.name = name;
        mesh.position.copy(data.originalPosition);
        mesh.userData = { ...data, mesh };
        group.add(mesh);
        parts.push(data);
    }

    const baseGeo = new THREE.CylinderGeometry(2, 2.5, 0.5, 32);
    addPart('BaseStand', new THREE.Mesh(baseGeo, darkSteel), {
        name: 'Base Stand',
        description: 'Heavy base providing stability to the ANC dummy head setup.',
        material: 'darkSteel',
        function: 'Structural support and vibration isolation from the floor.',
        assemblyOrder: 1,
        connections: ['NeckColumn'],
        failureEffect: 'Mechanical instability and vibration artifacts in acoustic measurements.',
        cascadeFailures: ['NeckColumn', 'HeadShell'],
        originalPosition: new THREE.Vector3(0, -3, 0),
        explodedPosition: new THREE.Vector3(0, -5, 0)
    });

    const neckGeo = new THREE.CylinderGeometry(0.5, 0.6, 2, 32);
    addPart('NeckColumn', new THREE.Mesh(neckGeo, aluminum), {
        name: 'Neck Column',
        description: 'Adjustable neck column supporting the dummy head.',
        material: 'aluminum',
        function: 'Positions the head at correct height and houses primary data cables.',
        assemblyOrder: 2,
        connections: ['BaseStand', 'HeadShell', 'DataBus'],
        failureEffect: 'Misalignment of the dummy head affecting spatial acoustic data.',
        cascadeFailures: ['DataBus'],
        originalPosition: new THREE.Vector3(0, -1.75, 0),
        explodedPosition: new THREE.Vector3(0, -2.5, 0)
    });

    const headGeo = new THREE.SphereGeometry(1.8, 32, 32);
    headGeo.scale(1, 1.2, 1.1);
    addPart('HeadShell', new THREE.Mesh(headGeo, translucentPlastic), {
        name: 'Acoustic Head Shell',
        description: 'Anatomically accurate dummy head for simulating human acoustic shadowing.',
        material: 'translucentPlastic',
        function: 'Simulates the acoustic diffraction and absorption of a human head (HRTF).',
        assemblyOrder: 3,
        connections: ['NeckColumn', 'LeftEar', 'RightEar', 'DSPChip'],
        failureEffect: 'Inaccurate spatial audio simulation and HRTF calculation errors.',
        cascadeFailures: ['ErrorMicL', 'ErrorMicR'],
        originalPosition: new THREE.Vector3(0, 0.5, 0),
        explodedPosition: new THREE.Vector3(0, 3, 0)
    });

    const earGeo = new THREE.BoxGeometry(0.4, 0.8, 0.6);
    
    addPart('LeftEar', new THREE.Mesh(earGeo, rubber), {
        name: 'Left Ear Simulator',
        description: 'Rubber pinna simulator matching human ear canal impedance.',
        material: 'rubber',
        function: 'Shapes incoming sound waves identically to a human outer ear.',
        assemblyOrder: 4,
        connections: ['HeadShell', 'ErrorMicL', 'AntiNoiseSpeakerL'],
        failureEffect: 'Loss of high-frequency spatial cues in the left channel.',
        cascadeFailures: ['ErrorMicL'],
        originalPosition: new THREE.Vector3(-1.9, 0.5, 0),
        explodedPosition: new THREE.Vector3(-4, 0.5, 0)
    });

    addPart('RightEar', new THREE.Mesh(earGeo, rubber), {
        name: 'Right Ear Simulator',
        description: 'Rubber pinna simulator matching human ear canal impedance.',
        material: 'rubber',
        function: 'Shapes incoming sound waves identically to a human outer ear.',
        assemblyOrder: 5,
        connections: ['HeadShell', 'ErrorMicR', 'AntiNoiseSpeakerR'],
        failureEffect: 'Loss of high-frequency spatial cues in the right channel.',
        cascadeFailures: ['ErrorMicR'],
        originalPosition: new THREE.Vector3(1.9, 0.5, 0),
        explodedPosition: new THREE.Vector3(4, 0.5, 0)
    });

    const micGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.3, 16);
    micGeo.rotateZ(Math.PI / 2);

    addPart('RefMicL', new THREE.Mesh(micGeo, chrome), {
        name: 'Left Reference Microphone',
        description: 'High-precision omnidirectional mic picking up external ambient noise.',
        material: 'chrome',
        function: 'Captures the noise source before it reaches the ear (Feedforward ANC).',
        assemblyOrder: 6,
        connections: ['HeadShell', 'DSPChip'],
        failureEffect: 'Feedforward ANC fails; cannot predict incoming noise.',
        cascadeFailures: ['DSPChip'],
        originalPosition: new THREE.Vector3(-2.2, 0.5, 0.5),
        explodedPosition: new THREE.Vector3(-5, 0.5, 1)
    });

    addPart('RefMicR', new THREE.Mesh(micGeo, chrome), {
        name: 'Right Reference Microphone',
        description: 'High-precision omnidirectional mic picking up external ambient noise.',
        material: 'chrome',
        function: 'Captures the noise source before it reaches the ear (Feedforward ANC).',
        assemblyOrder: 7,
        connections: ['HeadShell', 'DSPChip'],
        failureEffect: 'Feedforward ANC fails; cannot predict incoming noise.',
        cascadeFailures: ['DSPChip'],
        originalPosition: new THREE.Vector3(2.2, 0.5, 0.5),
        explodedPosition: new THREE.Vector3(5, 0.5, 1)
    });

    const errorMicGeo = new THREE.SphereGeometry(0.08, 16, 16);

    addPart('ErrorMicL', new THREE.Mesh(errorMicGeo, neonRed), {
        name: 'Left Error Microphone',
        description: 'Mic placed inside the ear canal to measure residual noise.',
        material: 'neonRed',
        function: 'Provides feedback to the DSP about how much noise remains (Feedback ANC).',
        assemblyOrder: 8,
        connections: ['LeftEar', 'DSPChip'],
        failureEffect: 'Feedback ANC loop breaks; system might cause high-frequency squealing.',
        cascadeFailures: ['AntiNoiseSpeakerL'],
        originalPosition: new THREE.Vector3(-1.6, 0.5, 0),
        explodedPosition: new THREE.Vector3(-3.5, 0.5, -1)
    });

    addPart('ErrorMicR', new THREE.Mesh(errorMicGeo, neonRed), {
        name: 'Right Error Microphone',
        description: 'Mic placed inside the ear canal to measure residual noise.',
        material: 'neonRed',
        function: 'Provides feedback to the DSP about how much noise remains (Feedback ANC).',
        assemblyOrder: 9,
        connections: ['RightEar', 'DSPChip'],
        failureEffect: 'Feedback ANC loop breaks; system might cause high-frequency squealing.',
        cascadeFailures: ['AntiNoiseSpeakerR'],
        originalPosition: new THREE.Vector3(1.6, 0.5, 0),
        explodedPosition: new THREE.Vector3(3.5, 0.5, -1)
    });

    const dspGeo = new THREE.BoxGeometry(0.8, 0.8, 0.2);
    addPart('DSPChip', new THREE.Mesh(dspGeo, silicon), {
        name: 'ANC DSP Processor',
        description: 'Ultra-low latency Digital Signal Processor calculating anti-noise.',
        material: 'silicon',
        function: 'Inverts phase of incoming noise and applies adaptive filtering (LMS algorithm).',
        assemblyOrder: 10,
        connections: ['RefMicL', 'RefMicR', 'ErrorMicL', 'ErrorMicR', 'AntiNoiseSpeakerL', 'AntiNoiseSpeakerR'],
        failureEffect: 'Total ANC failure. No anti-noise generated.',
        cascadeFailures: ['AntiNoiseSpeakerL', 'AntiNoiseSpeakerR'],
        originalPosition: new THREE.Vector3(0, 0.5, -0.5),
        explodedPosition: new THREE.Vector3(0, 0.5, -3)
    });

    const dspCircuitGeo = new THREE.PlaneGeometry(0.7, 0.7);
    const dspCircuit = new THREE.Mesh(dspCircuitGeo, neonBlue);
    dspCircuit.position.set(0, 0, 0.11);
    group.children.find(c => c.name === 'DSPChip').add(dspCircuit);
    
    const speakerGeo = new THREE.CylinderGeometry(0.3, 0.4, 0.2, 32);
    speakerGeo.rotateZ(Math.PI / 2);

    addPart('AntiNoiseSpeakerL', new THREE.Mesh(speakerGeo, copper), {
        name: 'Left Anti-Noise Driver',
        description: 'High-speed electrodynamic speaker driver.',
        material: 'copper',
        function: 'Plays the phase-inverted sound waves to cancel out incoming noise.',
        assemblyOrder: 11,
        connections: ['LeftEar', 'DSPChip'],
        failureEffect: 'No cancellation in the left ear; acts as an expensive earmuff.',
        cascadeFailures: [],
        originalPosition: new THREE.Vector3(-1.2, 0.5, 0),
        explodedPosition: new THREE.Vector3(-2.5, 2, 0)
    });

    addPart('AntiNoiseSpeakerR', new THREE.Mesh(speakerGeo, copper), {
        name: 'Right Anti-Noise Driver',
        description: 'High-speed electrodynamic speaker driver.',
        material: 'copper',
        function: 'Plays the phase-inverted sound waves to cancel out incoming noise.',
        assemblyOrder: 12,
        connections: ['RightEar', 'DSPChip'],
        failureEffect: 'No cancellation in the right ear; acts as an expensive earmuff.',
        cascadeFailures: [],
        originalPosition: new THREE.Vector3(1.2, 0.5, 0),
        explodedPosition: new THREE.Vector3(2.5, 2, 0)
    });

    const waveGeo = new THREE.TorusGeometry(0.5, 0.02, 16, 64);
    const noiseWaveL = new THREE.Mesh(waveGeo, neonRed);
    noiseWaveL.name = "NoiseWaveL";
    noiseWaveL.position.set(-3, 0.5, 0.5);
    noiseWaveL.rotation.y = Math.PI / 2;
    group.add(noiseWaveL);

    const antiWaveL = new THREE.Mesh(waveGeo, neonBlue);
    antiWaveL.name = "AntiWaveL";
    antiWaveL.position.set(-1.2, 0.5, 0);
    antiWaveL.rotation.y = Math.PI / 2;
    group.add(antiWaveL);

    const description = "The Acoustics ANC Head is a highly specialized engineering testbed designed to simulate, measure, and refine Active Noise Cancellation (ANC) algorithms. It features reference microphones to capture ambient noise, error microphones inside ear canal simulators to measure residual noise, and ultra-low latency DSPs that calculate and emit phase-inverted anti-noise through internal drivers. The combination of feedforward and feedback systems allows for robust broadband noise cancellation testing.";

    const quizQuestions = [
        {
            question: "What is the primary role of the Reference Microphones in a feedforward ANC system?",
            options: [
                "To measure the residual noise inside the ear canal.",
                "To pick up external ambient noise before it reaches the ear.",
                "To play the anti-noise signal.",
                "To cool down the DSP chip."
            ],
            correct: 1,
            explanation: "Reference microphones are placed on the outside to capture ambient noise early, allowing the DSP time to generate the anti-noise before the sound reaches the eardrum.",
            difficulty: "Medium"
        },
        {
            question: "Why are Error Microphones placed inside the ear simulators?",
            options: [
                "To provide feedback on how much noise was successfully cancelled.",
                "To capture the user's voice for phone calls.",
                "To block physical sound waves from entering the ear.",
                "To increase the weight of the dummy head."
            ],
            correct: 0,
            explanation: "Error microphones measure the residual noise (what's left after cancellation) inside the ear canal, creating a feedback loop for the DSP to adapt and improve cancellation.",
            difficulty: "Medium"
        },
        {
            question: "How does the Anti-Noise Driver cancel incoming sound?",
            options: [
                "By absorbing the sound waves with a sponge-like material.",
                "By emitting a louder sound to drown out the noise.",
                "By emitting sound waves that are exactly 180 degrees out of phase with the incoming noise.",
                "By creating a vacuum around the ear."
            ],
            correct: 2,
            explanation: "Active Noise Cancellation works on the principle of destructive interference. The speaker plays a sound wave exactly 180 degrees out of phase (inverted) to the incoming noise, cancelling it out.",
            difficulty: "Hard"
        },
        {
            question: "What happens if the DSP's latency is too high?",
            options: [
                "The anti-noise will arrive too late, potentially amplifying the noise instead of cancelling it.",
                "The battery life will increase dramatically.",
                "The reference microphones will shut down.",
                "The head shell will vibrate violently."
            ],
            correct: 0,
            explanation: "Low latency is critical. If the DSP is too slow, the anti-noise wave will be out of sync with the noise wave when they meet, leading to constructive interference (louder noise) rather than cancellation.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        const dsp = meshes.find(m => m.name === 'DSPChip');
        const noiseWave = group.getObjectByName('NoiseWaveL');
        const antiWave = group.getObjectByName('AntiWaveL');

        if (dsp) {
            const circuit = dsp.children[0];
            if (circuit) {
                const pulse = (Math.sin(time * speed * 5) + 1) / 2;
                circuit.material.emissiveIntensity = 0.5 + pulse * 1.5;
            }
        }

        if (noiseWave) {
            let scale = (time * speed * 2) % 3;
            noiseWave.scale.set(scale + 0.1, scale + 0.1, scale + 0.1);
            noiseWave.position.x = -3 + (scale * 0.5);
            noiseWave.material.opacity = Math.max(0, 1 - (scale / 3));
        }

        if (antiWave) {
            let scale = ((time * speed * 2) - 0.5) % 3; 
            if (scale < 0) scale += 3;
            antiWave.scale.set(scale + 0.1, scale + 0.1, scale + 0.1);
            antiWave.position.x = -1.2 - (scale * 0.2);
            antiWave.material.opacity = Math.max(0, 1 - (scale / 2));
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createANCHead() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
