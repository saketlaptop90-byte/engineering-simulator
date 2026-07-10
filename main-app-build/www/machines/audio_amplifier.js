import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const glowOrange = new THREE.MeshStandardMaterial({
        color: 0xff6600,
        emissive: 0xff3300,
        emissiveIntensity: 2.0,
        roughness: 0.1,
        transparent: true,
        opacity: 0.9
    });

    const glowBlue = new THREE.MeshStandardMaterial({
        color: 0x00ccff,
        emissive: 0x0088ff,
        emissiveIntensity: 1.5,
        roughness: 0.2
    });

    const circuitGreen = new THREE.MeshStandardMaterial({
        color: 0x004400,
        roughness: 0.8
    });

    // 1. Chassis
    const chassisGeo = new THREE.BoxGeometry(10, 2, 8);
    const chassisMesh = new THREE.Mesh(chassisGeo, darkSteel);
    chassisMesh.position.set(0, 1, 0);
    group.add(chassisMesh);
    parts.push({
        name: "Main Chassis",
        description: "The sturdy metal frame housing all internal components.",
        material: darkSteel,
        function: "Structural support and electrical grounding.",
        assemblyOrder: 1,
        connections: ["Transformer", "Tubes", "Capacitors"],
        failureEffect: "Structural weakness, poor grounding leading to hum.",
        cascadeFailures: ["Signal Interference"],
        originalPosition: { x: 0, y: 1, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 },
        mesh: chassisMesh
    });

    // 2. Power Transformer
    const pTransGeo = new THREE.BoxGeometry(2.5, 3, 2.5);
    const pTransMesh = new THREE.Mesh(pTransGeo, steel);
    pTransMesh.position.set(-3, 3.5, -2);
    group.add(pTransMesh);
    parts.push({
        name: "Power Transformer",
        description: "Steps down wall AC voltage and isolates the circuit.",
        material: steel,
        function: "Provides various necessary voltages for tube heaters and high-voltage plates.",
        assemblyOrder: 2,
        connections: ["Chassis", "Rectifier Tube"],
        failureEffect: "Total power loss or severe humming.",
        cascadeFailures: ["Fuse Blow", "Tube Damage"],
        originalPosition: { x: -3, y: 3.5, z: -2 },
        explodedPosition: { x: -5, y: 5, z: -4 },
        mesh: pTransMesh
    });

    // 3. Output Transformers
    for(let i=0; i<2; i++) {
        const oTransGeo = new THREE.BoxGeometry(2, 2.5, 2);
        const oTransMesh = new THREE.Mesh(oTransGeo, steel);
        const xPos = 3;
        const zPos = i === 0 ? -2 : 2;
        oTransMesh.position.set(xPos, 3.25, zPos);
        group.add(oTransMesh);
        parts.push({
            name: `Output Transformer ${i === 0 ? 'Left' : 'Right'}`,
            description: "Matches the high impedance of the tubes to low impedance speakers.",
            material: steel,
            function: "Transfers audio signal to speakers efficiently.",
            assemblyOrder: 3,
            connections: ["Power Tubes", "Speaker Terminals"],
            failureEffect: "Loss of audio output on one channel.",
            cascadeFailures: ["Power Tube Overheating"],
            originalPosition: { x: xPos, y: 3.25, z: zPos },
            explodedPosition: { x: xPos + 2, y: 6, z: zPos * 2 },
            mesh: oTransMesh
        });
    }

    // 4. Vacuum Tubes
    // Power Tubes
    for(let i=0; i<4; i++) {
        const tubeGroup = new THREE.Group();
        
        const tubeGeo = new THREE.CylinderGeometry(0.5, 0.5, 2.5, 16);
        const tubeMesh = new THREE.Mesh(tubeGeo, glass);
        
        const filamentGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 8);
        const filamentMesh = new THREE.Mesh(filamentGeo, glowOrange);
        filamentMesh.userData.isFilament = true;
        
        tubeGroup.add(tubeMesh);
        tubeGroup.add(filamentMesh);
        
        const xPos = -1 + (i % 2) * 2;
        const zPos = i < 2 ? -1 : 1;
        
        tubeGroup.position.set(xPos, 3.25, zPos);
        group.add(tubeGroup);
        
        parts.push({
            name: `KT88 Power Tube ${i+1}`,
            description: "Thermionic valve for power amplification.",
            material: glass,
            function: "Amplifies the audio signal to drive the output transformer.",
            assemblyOrder: 4,
            connections: ["Output Transformer", "Phase Inverter"],
            failureEffect: "Distortion, loss of volume, or blown fuse.",
            cascadeFailures: ["Output Transformer Damage"],
            originalPosition: { x: xPos, y: 3.25, z: zPos },
            explodedPosition: { x: xPos, y: 8, z: zPos },
            mesh: tubeGroup
        });
    }

    // Preamp Tubes
    for(let i=0; i<3; i++) {
        const tubeGroup = new THREE.Group();
        
        const tubeGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.5, 16);
        const tubeMesh = new THREE.Mesh(tubeGeo, glass);
        
        const filamentGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.8, 8);
        const filamentMesh = new THREE.Mesh(filamentGeo, glowOrange);
        filamentMesh.userData.isFilament = true;
        
        tubeGroup.add(tubeMesh);
        tubeGroup.add(filamentMesh);
        
        const xPos = -3;
        const zPos = 1 + (i * 1.2);
        
        tubeGroup.position.set(xPos, 2.75, zPos);
        group.add(tubeGroup);
        
        parts.push({
            name: `12AX7 Preamp Tube ${i+1}`,
            description: "Small thermionic valve for voltage amplification.",
            material: glass,
            function: "Amplifies the weak incoming line-level signal.",
            assemblyOrder: 5,
            connections: ["Input Jacks", "Power Tubes"],
            failureEffect: "Noisy, weak, or completely dead audio signal.",
            cascadeFailures: [],
            originalPosition: { x: xPos, y: 2.75, z: zPos },
            explodedPosition: { x: -6, y: 7, z: zPos * 1.5 },
            mesh: tubeGroup
        });
    }

    // 5. Capacitors
    for(let i=0; i<2; i++) {
        const capGeo = new THREE.CylinderGeometry(0.6, 0.6, 2, 16);
        const capMesh = new THREE.Mesh(capGeo, aluminum);
        const xPos = -1 + (i * 2);
        const zPos = 3;
        capMesh.position.set(xPos, 3, zPos);
        group.add(capMesh);
        
        parts.push({
            name: `Filter Capacitor ${i+1}`,
            description: "Large electrolytic capacitor.",
            material: aluminum,
            function: "Smooths the rectified DC voltage from the power supply.",
            assemblyOrder: 6,
            connections: ["Rectifier", "Power Tubes"],
            failureEffect: "Loud 60Hz or 120Hz hum in audio.",
            cascadeFailures: ["Rectifier Failure"],
            originalPosition: { x: xPos, y: 3, z: zPos },
            explodedPosition: { x: xPos, y: 5, z: 6 },
            mesh: capMesh
        });
    }

    // 6. Volume Knob
    const knobGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.5, 16);
    const knobMesh = new THREE.Mesh(knobGeo, chrome);
    knobMesh.rotation.x = Math.PI / 2;
    knobMesh.position.set(4, 1.5, 4.25);
    group.add(knobMesh);
    parts.push({
        name: "Volume Knob",
        description: "Potentiometer control.",
        material: chrome,
        function: "Adjusts the amplitude of the input signal.",
        assemblyOrder: 7,
        connections: ["Preamp Tubes"],
        failureEffect: "Scratchy sound when turning, or volume drops completely.",
        cascadeFailures: [],
        originalPosition: { x: 4, y: 1.5, z: 4.25 },
        explodedPosition: { x: 6, y: 1.5, z: 8 },
        mesh: knobMesh
    });

    const description = "A high-fidelity vacuum tube audio amplifier. Known for its 'warm' analog sound characteristics and aesthetic glowing tubes, it uses thermionic emission to amplify low-power audio signals to a level suitable for driving loudspeakers.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Output Transformer in a tube amplifier?",
            options: [
                "To power the tube heaters",
                "To match the high impedance of the tubes to the low impedance speakers",
                "To convert AC wall voltage to DC",
                "To add distortion to the audio signal"
            ],
            correct: 1,
            explanation: "Vacuum tubes operate at high voltages and low currents (high impedance), while speakers require low voltages and high currents (low impedance). The output transformer bridges this gap.",
            difficulty: "Medium"
        },
        {
            question: "Why might a tube amplifier produce a loud, continuous humming sound?",
            options: [
                "The tubes are too cold",
                "Failing filter capacitors",
                "Volume is set too low",
                "The output transformer is disconnected"
            ],
            correct: 1,
            explanation: "Filter capacitors smooth out the AC ripple after rectification. If they fail, that ripple (usually 60Hz or 120Hz) enters the audio path as hum.",
            difficulty: "Hard"
        },
        {
            question: "What does the glowing filament inside a vacuum tube do?",
            options: [
                "Indicates the tube is broken",
                "Emits photons for visual appeal",
                "Heats the cathode to emit electrons",
                "Cools down the grid"
            ],
            correct: 2,
            explanation: "The filament heats up the cathode, which causes it to release electrons via thermionic emission, allowing current to flow through the tube.",
            difficulty: "Medium"
        }
    ];

    const animate = (time, speed, meshes) => {
        // Pulsate tube filaments slightly based on "music" (simulated by noise/sine waves)
        const musicPulse = (Math.sin(time * speed * 10) * 0.1) + 
                           (Math.sin(time * speed * 25) * 0.05) + 
                           0.85;

        meshes.forEach(mesh => {
            // Find filaments inside tube groups
            if (mesh.type === 'Group') {
                mesh.children.forEach(child => {
                    if (child.userData.isFilament) {
                        child.material.emissiveIntensity = musicPulse * 2.0;
                    }
                });
            }
        });
    };

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createAmplifier() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
