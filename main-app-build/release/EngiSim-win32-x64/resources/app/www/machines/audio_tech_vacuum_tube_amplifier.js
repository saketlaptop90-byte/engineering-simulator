import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const glowOrange = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0xff4400,
        emissiveIntensity: 2,
        transparent: true,
        opacity: 0.9,
    });

    const glowBlue = new THREE.MeshStandardMaterial({
        color: 0x00aaff,
        emissive: 0x0044ff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8,
    });
    
    // Base Chassis
    const chassisGeo = new THREE.BoxGeometry(10, 2, 8);
    const chassisMesh = new THREE.Mesh(chassisGeo, darkSteel);
    chassisMesh.position.set(0, 1, 0);
    group.add(chassisMesh);
    parts.push({
        name: "Chassis",
        description: "The main structural body of the amplifier.",
        material: "darkSteel",
        function: "Provides structural support, grounding, and shielding for the sensitive internal components.",
        assemblyOrder: 1,
        connections: ["Transformers", "TubeSockets", "Capacitors"],
        failureEffect: "Loss of grounding leading to excessive hum.",
        cascadeFailures: ["Signal distortion"],
        originalPosition: { x: 0, y: 1, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 }
    });

    // Power Transformer
    const powerTransGeo = new THREE.BoxGeometry(2.5, 3, 2.5);
    const powerTransMesh = new THREE.Mesh(powerTransGeo, steel);
    powerTransMesh.position.set(-3, 3.5, -2);
    group.add(powerTransMesh);
    parts.push({
        name: "Power Transformer",
        description: "Step-up and step-down transformer for mains voltage.",
        material: "steel",
        function: "Converts wall AC voltage into high voltage for tube plates and low voltage for filament heaters.",
        assemblyOrder: 2,
        connections: ["Chassis", "Rectifier Tube"],
        failureEffect: "Complete loss of power.",
        cascadeFailures: ["No operation"],
        originalPosition: { x: -3, y: 3.5, z: -2 },
        explodedPosition: { x: -5, y: 6, z: -4 }
    });

    // Output Transformers
    const outputTransGeo = new THREE.BoxGeometry(2, 2.5, 2);
    const outTransLMesh = new THREE.Mesh(outputTransGeo, steel);
    outTransLMesh.position.set(2, 3.25, -2.5);
    group.add(outTransLMesh);
    parts.push({
        name: "Output Transformer (Left)",
        description: "Impedance matching transformer for the left channel.",
        material: "steel",
        function: "Matches the high impedance of the power tubes to the low impedance of the speaker.",
        assemblyOrder: 3,
        connections: ["Chassis", "Power Tubes L", "Speaker L"],
        failureEffect: "No sound from left speaker.",
        cascadeFailures: ["Power tube L overheating if unloaded"],
        originalPosition: { x: 2, y: 3.25, z: -2.5 },
        explodedPosition: { x: 4, y: 6, z: -5 }
    });

    const outTransRMesh = new THREE.Mesh(outputTransGeo, steel);
    outTransRMesh.position.set(4.5, 3.25, -2.5);
    group.add(outTransRMesh);
    parts.push({
        name: "Output Transformer (Right)",
        description: "Impedance matching transformer for the right channel.",
        material: "steel",
        function: "Matches the high impedance of the power tubes to the low impedance of the speaker.",
        assemblyOrder: 4,
        connections: ["Chassis", "Power Tubes R", "Speaker R"],
        failureEffect: "No sound from right speaker.",
        cascadeFailures: ["Power tube R overheating if unloaded"],
        originalPosition: { x: 4.5, y: 3.25, z: -2.5 },
        explodedPosition: { x: 7, y: 6, z: -5 }
    });

    // Vacuum Tubes (Preamp - 12AX7)
    const preampTubeGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.5, 16);
    const preampHeaterGeo = new THREE.CylinderGeometry(0.05, 0.05, 1, 8);
    const preampLMesh = new THREE.Mesh(preampTubeGeo, glass);
    preampLMesh.position.set(1.5, 2.75, 1.5);
    const preampHeaterL = new THREE.Mesh(preampHeaterGeo, glowOrange);
    preampHeaterL.name = "PreampHeaterL";
    preampLMesh.add(preampHeaterL);
    group.add(preampLMesh);
    parts.push({
        name: "Preamp Tube (Left)",
        description: "Dual triode vacuum tube (12AX7) for left channel.",
        material: "glass",
        function: "Provides initial voltage amplification for the incoming audio signal.",
        assemblyOrder: 5,
        connections: ["Chassis", "Input L", "Power Tube L"],
        failureEffect: "Weak or no signal, high distortion on left channel.",
        cascadeFailures: [],
        originalPosition: { x: 1.5, y: 2.75, z: 1.5 },
        explodedPosition: { x: 1.5, y: 5, z: 3 }
    });

    const preampRMesh = new THREE.Mesh(preampTubeGeo, glass);
    preampRMesh.position.set(3, 2.75, 1.5);
    const preampHeaterR = new THREE.Mesh(preampHeaterGeo, glowOrange);
    preampHeaterR.name = "PreampHeaterR";
    preampRMesh.add(preampHeaterR);
    group.add(preampRMesh);
    parts.push({
        name: "Preamp Tube (Right)",
        description: "Dual triode vacuum tube (12AX7) for right channel.",
        material: "glass",
        function: "Provides initial voltage amplification for the incoming audio signal.",
        assemblyOrder: 6,
        connections: ["Chassis", "Input R", "Power Tube R"],
        failureEffect: "Weak or no signal, high distortion on right channel.",
        cascadeFailures: [],
        originalPosition: { x: 3, y: 2.75, z: 1.5 },
        explodedPosition: { x: 3, y: 5, z: 3 }
    });

    // Vacuum Tubes (Power - EL34 / KT88)
    const powerTubeGeo = new THREE.CylinderGeometry(0.6, 0.5, 2.5, 16);
    const powerTubeHeaterGeo = new THREE.CylinderGeometry(0.1, 0.1, 2, 8);
    
    for (let i = 0; i < 4; i++) {
        const pTubeMesh = new THREE.Mesh(powerTubeGeo, glass);
        const pHeater = new THREE.Mesh(powerTubeHeaterGeo, glowBlue);
        pHeater.name = `PowerHeater${i}`;
        pTubeMesh.add(pHeater);
        
        const xPos = -2 + (i * 1.5);
        pTubeMesh.position.set(xPos, 3.25, 0);
        group.add(pTubeMesh);
        
        parts.push({
            name: `Power Tube V${i+1}`,
            description: "Power pentode vacuum tube for output stage.",
            material: "glass",
            function: "Amplifies the signal current to drive the output transformer.",
            assemblyOrder: 7 + i,
            connections: ["Chassis", "Preamp Tube", "Output Transformer"],
            failureEffect: "Distortion, loss of volume, blowing main fuse.",
            cascadeFailures: ["Output transformer damage if shorted"],
            originalPosition: { x: xPos, y: 3.25, z: 0 },
            explodedPosition: { x: xPos, y: 7, z: 0 }
        });
    }

    // Filter Capacitors
    const capGeo = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 16);
    for (let i = 0; i < 2; i++) {
        const capMesh = new THREE.Mesh(capGeo, aluminum);
        const xPos = -3 + (i * 1.5);
        capMesh.position.set(xPos, 2.75, 2);
        group.add(capMesh);
        
        parts.push({
            name: `Filter Capacitor C${i+1}`,
            description: "High voltage electrolytic capacitor.",
            material: "aluminum",
            function: "Smooths the rectified DC voltage to prevent 60Hz hum.",
            assemblyOrder: 11 + i,
            connections: ["Chassis", "Rectifier", "Power Rails"],
            failureEffect: "Loud 60Hz or 120Hz hum in audio output.",
            cascadeFailures: ["Rectifier tube overload"],
            originalPosition: { x: xPos, y: 2.75, z: 2 },
            explodedPosition: { x: xPos, y: 5, z: 5 }
        });
    }

    // Volume Knob
    const knobGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.5, 16);
    knobGeo.rotateX(Math.PI / 2);
    const knobMesh = new THREE.Mesh(knobGeo, chrome);
    knobMesh.position.set(3, 1, 4.25);
    group.add(knobMesh);
    parts.push({
        name: "Volume Knob (Potentiometer)",
        description: "Variable resistor for volume control.",
        material: "chrome",
        function: "Attenuates the incoming audio signal before it reaches the preamp tubes.",
        assemblyOrder: 13,
        connections: ["Chassis", "Input Jacks", "Preamp Tubes"],
        failureEffect: "Scratchy sound when adjusting volume, channel imbalance.",
        cascadeFailures: [],
        originalPosition: { x: 3, y: 1, z: 4.25 },
        explodedPosition: { x: 3, y: 1, z: 6 }
    });

    // Power Switch
    const switchGeo = new THREE.BoxGeometry(0.3, 0.6, 0.4);
    const switchMesh = new THREE.Mesh(switchGeo, chrome);
    switchMesh.position.set(-4, 1, 4.2);
    group.add(switchMesh);
    parts.push({
        name: "Power Switch",
        description: "Main AC toggle switch.",
        material: "chrome",
        function: "Connects or disconnects the amplifier from wall AC power.",
        assemblyOrder: 14,
        connections: ["Chassis", "AC Input", "Power Transformer"],
        failureEffect: "Amplifier won't turn on.",
        cascadeFailures: [],
        originalPosition: { x: -4, y: 1, z: 4.2 },
        explodedPosition: { x: -4, y: 1, z: 6 }
    });

    const description = "A high-fidelity vacuum tube audio amplifier. Utilizing thermionic emission in glass vacuum envelopes to amplify delicate audio signals. Known for a 'warm' sound profile, it consists of power transformers, output transformers matching the high tube impedance to low impedance speakers, sensitive preamp tubes, and heavy-duty power tubes. Glowing filaments inside the tubes provide the necessary heat for electron emission.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Output Transformer?",
            options: [
                "To supply AC power to the filaments.",
                "To match the high impedance of the tubes to the low impedance of the speakers.",
                "To filter out the 60Hz mains hum.",
                "To provide the initial voltage amplification."
            ],
            correct: 1,
            explanation: "Vacuum tubes operate at high voltages and high impedance. Speakers operate at low voltages and low impedance (typically 4 or 8 ohms). The output transformer bridges this gap.",
            difficulty: "Medium"
        },
        {
            question: "Why do vacuum tubes glow when powered on?",
            options: [
                "It is a decorative feature added by manufacturers.",
                "Due to the ionization of gas inside the tube.",
                "The heater filament must be heated to high temperatures to cause thermionic electron emission from the cathode.",
                "It is a byproduct of the audio signal clipping."
            ],
            correct: 2,
            explanation: "Tubes require a heated cathode (or a separate filament) to 'boil' off electrons into the vacuum (thermionic emission), allowing current to flow to the anode.",
            difficulty: "Easy"
        },
        {
            question: "What failure symptom would a dried-out electrolytic filter capacitor typically cause?",
            options: [
                "A low-frequency hum (60Hz or 120Hz) heard through the speakers.",
                "The tubes completely fail to light up.",
                "A sudden increase in treble frequencies.",
                "The volume knob becomes physically stuck."
            ],
            correct: 0,
            explanation: "Filter capacitors smooth out the rectified AC power into pure DC. If they fail, the AC ripple (hum) remains in the power supply and gets amplified, causing an audible hum.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Find all the heaters and gently pulse their emissive intensity
        meshes.forEach(mesh => {
            if (mesh.name.includes("Heater")) {
                const baseIntensity = mesh.name.includes("Power") ? 1.5 : 2.0;
                // Add a gentle flicker based on a combination of sine waves
                const flicker = Math.sin(time * speed * 2) * 0.1 + Math.sin(time * speed * 5.3) * 0.05;
                mesh.material.emissiveIntensity = baseIntensity + flicker;
            }
        });
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createVacuumTubeAmplifier() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
