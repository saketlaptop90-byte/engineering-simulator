import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {}; // store by part name
    
    // Custom glowing materials
    const glowingNeon = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x0088ff,
        emissiveIntensity: 2.0,
        metalness: 0.8,
        roughness: 0.2,
        clearcoat: 1.0,
        transparent: true,
        opacity: 0.9
    });

    const oscilloscopeBeam = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    const glowingRed = new THREE.MeshPhysicalMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 1.5,
        metalness: 0.5,
        roughness: 0.1
    });

    // 1. Base / Chassis
    const chassisGeo = new THREE.BoxGeometry(10, 2, 8);
    const chassisMesh = new THREE.Mesh(chassisGeo, darkSteel);
    chassisMesh.position.set(0, 0, 0);
    group.add(chassisMesh);
    meshes['chassis'] = chassisMesh;
    parts.push({
        name: 'chassis',
        description: 'Main enclosure protecting sensitive analog circuitry.',
        material: 'darkSteel',
        function: 'Structural support, shielding against EM interference.',
        assemblyOrder: 1,
        connections: ['circuit_board', 'knobs', 'patch_bay'],
        failureEffect: 'Vulnerability to interference, potential short circuits.',
        cascadeFailures: ['oscillator_drift', 'signal_noise'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -5, z: 0}
    });

    // 2. Circuit Board (PCB)
    const pcbGeo = new THREE.BoxGeometry(8, 0.2, 6);
    const pcbMesh = new THREE.Mesh(pcbGeo, new THREE.MeshStandardMaterial({color: 0x004400, roughness: 0.6, metalness: 0.2}));
    pcbMesh.position.set(0, 1.1, 0);
    group.add(pcbMesh);
    meshes['pcb'] = pcbMesh;
    parts.push({
        name: 'pcb',
        description: 'Main printed circuit board with analog components.',
        material: 'copper/fiberglass',
        function: 'Houses resistors, capacitors, and op-amps that generate the waveform.',
        assemblyOrder: 2,
        connections: ['chassis', 'ic_chip', 'capacitors'],
        failureEffect: 'Complete failure to generate sound.',
        cascadeFailures: ['all_components'],
        originalPosition: {x: 0, y: 1.1, z: 0},
        explodedPosition: {x: 0, y: 5, z: 0}
    });

    // 3. Core Oscillator IC (Voltage Controlled Oscillator Chip)
    const icGeo = new THREE.BoxGeometry(1.5, 0.5, 2.5);
    const icMesh = new THREE.Mesh(icGeo, plastic);
    icMesh.position.set(-2, 1.4, 0);
    group.add(icMesh);
    meshes['ic_chip'] = icMesh;
    
    // Add little pins
    for(let i=0; i<6; i++) {
        const pinGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.5);
        const pinMesh1 = new THREE.Mesh(pinGeo, chrome);
        pinMesh1.position.set(-2.8, 1.25, -1 + i*0.4);
        group.add(pinMesh1);
        const pinMesh2 = new THREE.Mesh(pinGeo, chrome);
        pinMesh2.position.set(-1.2, 1.25, -1 + i*0.4);
        group.add(pinMesh2);
    }
    
    parts.push({
        name: 'ic_chip',
        description: 'Voltage Controlled Oscillator (VCO) Integrated Circuit.',
        material: 'plastic/silicon',
        function: 'Generates the core repeating electrical signal (sawtooth, square, triangle).',
        assemblyOrder: 3,
        connections: ['pcb'],
        failureEffect: 'Loss of waveform generation.',
        cascadeFailures: ['signal_output'],
        originalPosition: {x: -2, y: 1.4, z: 0},
        explodedPosition: {x: -5, y: 8, z: 0}
    });

    // 4. Large Capacitors
    const capGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.2);
    const capMesh1 = new THREE.Mesh(capGeo, aluminum);
    capMesh1.position.set(1, 1.8, -2);
    const capMesh2 = new THREE.Mesh(capGeo, aluminum);
    capMesh2.position.set(2, 1.8, -2);
    group.add(capMesh1, capMesh2);
    meshes['capacitors'] = [capMesh1, capMesh2];
    parts.push({
        name: 'capacitors',
        description: 'Electrolytic timing capacitors.',
        material: 'aluminum',
        function: 'Determines the charge/discharge rate, establishing the core frequency/pitch of the oscillator.',
        assemblyOrder: 4,
        connections: ['pcb'],
        failureEffect: 'Pitch instability or extreme frequency shift.',
        cascadeFailures: ['tuning_calibration'],
        originalPosition: {x: 1.5, y: 1.8, z: -2},
        explodedPosition: {x: 3, y: 10, z: -4}
    });

    // 5. Tuning Coils / Inductors (Copper wound)
    const coilGeo = new THREE.TorusGeometry(0.3, 0.1, 16, 50);
    const coilGroup = new THREE.Group();
    for(let i=0; i<5; i++) {
        const coilRing = new THREE.Mesh(coilGeo, copper);
        coilRing.position.set(0, i*0.15, 0);
        coilRing.rotation.x = Math.PI/2;
        coilGroup.add(coilRing);
    }
    coilGroup.position.set(2, 1.5, 1);
    group.add(coilGroup);
    meshes['tuning_coil'] = coilGroup;
    parts.push({
        name: 'tuning_coil',
        description: 'Precision copper inductor coil.',
        material: 'copper',
        function: 'Fine-tunes the oscillator circuit stability at high frequencies.',
        assemblyOrder: 5,
        connections: ['pcb'],
        failureEffect: 'High-frequency jitter and thermal drift.',
        cascadeFailures: ['phase_sync'],
        originalPosition: {x: 2, y: 1.5, z: 1},
        explodedPosition: {x: 5, y: 8, z: 2}
    });

    // 6. Front Panel
    const panelGeo = new THREE.BoxGeometry(10.2, 4, 0.2);
    const panelMesh = new THREE.Mesh(panelGeo, aluminum);
    panelMesh.position.set(0, 3, 4.1);
    group.add(panelMesh);
    meshes['front_panel'] = panelMesh;
    parts.push({
        name: 'front_panel',
        description: 'Brushed aluminum front interface.',
        material: 'aluminum',
        function: 'Houses controls and displays for user interaction.',
        assemblyOrder: 6,
        connections: ['chassis', 'knobs', 'display'],
        failureEffect: 'Loss of structural integrity for controls.',
        cascadeFailures: ['knob_alignment'],
        originalPosition: {x: 0, y: 3, z: 4.1},
        explodedPosition: {x: 0, y: 3, z: 8}
    });

    // 7. Pitch and Waveform Knobs
    const knobGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.5, 32);
    const knobGroup = new THREE.Group();
    
    const knob1 = new THREE.Mesh(knobGeo, plastic);
    knob1.rotation.x = Math.PI/2;
    knob1.position.set(-3, 3, 4.4);
    
    const knob2 = new THREE.Mesh(knobGeo, plastic);
    knob2.rotation.x = Math.PI/2;
    knob2.position.set(-1, 3, 4.4);
    
    const knob3 = new THREE.Mesh(knobGeo, plastic);
    knob3.rotation.x = Math.PI/2;
    knob3.position.set(1, 3, 4.4);
    
    knobGroup.add(knob1, knob2, knob3);
    group.add(knobGroup);
    meshes['knobs'] = [knob1, knob2, knob3]; // array of knobs
    parts.push({
        name: 'knobs',
        description: 'Potentiometers for Coarse/Fine Tune and Pulse Width.',
        material: 'plastic/chrome',
        function: 'Allows user adjustment of control voltages feeding into the VCO.',
        assemblyOrder: 7,
        connections: ['front_panel', 'pcb'],
        failureEffect: 'Inability to change parameters.',
        cascadeFailures: ['user_control'],
        originalPosition: {x: -1, y: 3, z: 4.4},
        explodedPosition: {x: -2, y: 3, z: 12}
    });

    // 8. 3D Oscilloscope Display (Glowing Waveform)
    const displayBaseGeo = new THREE.BoxGeometry(3, 2.5, 0.3);
    const displayBase = new THREE.Mesh(displayBaseGeo, glass);
    displayBase.position.set(3, 3, 4.2);
    group.add(displayBase);
    
    // Create the glowing wave line
    const wavePoints = [];
    for(let i=0; i<50; i++) {
        wavePoints.push(new THREE.Vector3((i/50)*2.6 - 1.3, 0, 0.2));
    }
    const waveGeo = new THREE.BufferGeometry().setFromPoints(wavePoints);
    const waveLine = new THREE.Line(waveGeo, oscilloscopeBeam);
    waveLine.position.set(3, 3, 4.2);
    group.add(waveLine);
    meshes['oscilloscope'] = waveLine;
    
    parts.push({
        name: 'oscilloscope',
        description: 'Miniature CRT-style waveform display.',
        material: 'glass/neon',
        function: 'Visualizes the current electrical waveform output (sawtooth/square) in real-time.',
        assemblyOrder: 8,
        connections: ['front_panel', 'pcb'],
        failureEffect: 'Loss of visual feedback.',
        cascadeFailures: [],
        originalPosition: {x: 3, y: 3, z: 4.2},
        explodedPosition: {x: 6, y: 3, z: 10}
    });

    // 9. Patch Bay (CV Inputs/Outputs)
    const patchGeo = new THREE.TorusGeometry(0.2, 0.05, 16, 32);
    const patchGroup = new THREE.Group();
    for(let i=0; i<3; i++) {
        const patch = new THREE.Mesh(patchGeo, chrome);
        patch.position.set(-3.5 + i*1.2, 1.5, 4.25);
        patchGroup.add(patch);
    }
    group.add(patchGroup);
    parts.push({
        name: 'patch_bay',
        description: '1V/Octave and PWM control voltage inputs.',
        material: 'chrome',
        function: 'Receives external voltages to modulate pitch and pulse width.',
        assemblyOrder: 9,
        connections: ['front_panel', 'pcb'],
        failureEffect: 'Inability to receive external sequences.',
        cascadeFailures: ['modular_integration'],
        originalPosition: {x: -2.3, y: 1.5, z: 4.25},
        explodedPosition: {x: -6, y: 0, z: 9}
    });

    // 10. Glowing Vacuum Tube (for analog warmth)
    const tubeGeo = new THREE.CylinderGeometry(0.4, 0.4, 2, 32);
    const tubeMesh = new THREE.Mesh(tubeGeo, glass);
    tubeMesh.position.set(0, 2.5, 1);
    
    const tubeFilamentGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.5);
    const tubeFilament = new THREE.Mesh(tubeFilamentGeo, glowingNeon);
    tubeFilament.position.set(0, 2.5, 1);
    
    group.add(tubeMesh, tubeFilament);
    meshes['tube_filament'] = tubeFilament;
    
    parts.push({
        name: 'vacuum_tube',
        description: 'Subminiature vacuum tube for wavefolder circuit.',
        material: 'glass/tungsten',
        function: 'Adds harmonic distortion and "analog warmth" to the raw waveform.',
        assemblyOrder: 10,
        connections: ['pcb'],
        failureEffect: 'Loss of volume and harmonic richness.',
        cascadeFailures: ['output_stage'],
        originalPosition: {x: 0, y: 2.5, z: 1},
        explodedPosition: {x: 0, y: 12, z: 1}
    });

    const description = "An ultra high-tech Analog Synthesizer Voltage Controlled Oscillator (VCO). It generates continuous repeating electrical waveforms (sawtooth, square, triangle) whose frequency is dictated by an input control voltage. Key components include timing capacitors, precision inductor coils, a core IC, and a vacuum tube for harmonic overdrive, complete with a real-time glowing oscilloscope display.";

    const quizQuestions = [
        {
            question: "What is the primary function of the timing capacitors in this oscillator?",
            options: [
                "To power the glowing oscilloscope.",
                "To determine the charge/discharge rate establishing the core frequency.",
                "To cool down the vacuum tube.",
                "To add harmonic distortion to the audio."
            ],
            correct: 1,
            explanation: "In an analog VCO, capacitors charge and discharge at rates controlled by the input voltage. This cyclic charging forms the basis of the repeating waveform, directly determining the pitch.",
            difficulty: "medium"
        },
        {
            question: "Why is a 1V/Octave standard important for the patch bay inputs?",
            options: [
                "It ensures the volume doesn't get too loud.",
                "It standardizes how much voltage increase is needed to double the frequency (pitch up one octave).",
                "It protects the circuit from shorting out.",
                "It converts analog signals to digital."
            ],
            correct: 1,
            explanation: "The 1V/Oct standard means an increase of 1 Volt precisely doubles the frequency of the oscillator, resulting in an exact musical octave change, allowing keyboards to control the synth accurately.",
            difficulty: "hard"
        },
        {
            question: "What does the vacuum tube add to the oscillator's output?",
            options: [
                "Perfect digital precision.",
                "Harmonic distortion and 'analog warmth'.",
                "Radio frequency interference.",
                "Cooling capabilities."
            ],
            correct: 1,
            explanation: "Vacuum tubes operate non-linearly when pushed, introducing pleasing harmonic distortion often described as 'warmth' or 'fatness' to the raw synthetic waveforms.",
            difficulty: "easy"
        }
    ];

    function animate(time, speed, activeMeshes = meshes) {
        // Pulse the vacuum tube glowing filament
        if (activeMeshes['tube_filament']) {
            const glowIntensity = 1.5 + Math.sin(time * speed * 5) * 0.5;
            activeMeshes['tube_filament'].material.emissiveIntensity = glowIntensity;
        }

        // Animate the oscilloscope wave (Sawtooth or Sine morph)
        if (activeMeshes['oscilloscope']) {
            const wave = activeMeshes['oscilloscope'];
            const positions = wave.geometry.attributes.position.array;
            
            // Frequency based on speed, simulate a waveform scrolling
            for(let i=0; i<50; i++) {
                // simple sawtoothish/sine hybrid math
                const x = positions[i*3];
                const phase = (x + (time * speed)) * 5;
                const y = Math.sin(phase) * 0.5 + Math.sin(phase*2)*0.2; 
                positions[i*3 + 1] = y;
            }
            wave.geometry.attributes.position.needsUpdate = true;
        }

        // Rotate the tuning knobs slightly back and forth
        if (activeMeshes['knobs']) {
            activeMeshes['knobs'][0].rotation.z = Math.sin(time * speed * 0.5) * 0.5;
            activeMeshes['knobs'][1].rotation.z = Math.cos(time * speed * 0.3) * 0.8;
            activeMeshes['knobs'][2].rotation.z = Math.sin(time * speed * 0.8) * 0.3;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createSynthOscillator() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
