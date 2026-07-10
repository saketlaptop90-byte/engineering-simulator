import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const ledOff = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.1, roughness: 0.8 });
    const ledGreen = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 2, metalness: 0.2, roughness: 0.2 });
    const ledYellow = new THREE.MeshStandardMaterial({ color: 0xffff00, emissive: 0xffff00, emissiveIntensity: 2, metalness: 0.2, roughness: 0.2 });
    const ledRed = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 2, metalness: 0.2, roughness: 0.2 });
    const glowingBlue = new THREE.MeshStandardMaterial({ color: 0x0088ff, emissive: 0x0088ff, emissiveIntensity: 1.5, metalness: 0.5, roughness: 0.2 });

    // 1. Chassis
    const chassisGeo = new THREE.BoxGeometry(20, 2, 14);
    const chassisMesh = new THREE.Mesh(chassisGeo, darkSteel);
    chassisMesh.position.set(0, 1, 0);
    group.add(chassisMesh);
    parts.push({
        name: "Main Chassis",
        description: "Heavy-duty dark steel casing that houses all the internal circuitry and provides the structural foundation for the audio mixer.",
        material: "darkSteel",
        function: "Structural support and electromagnetic shielding.",
        assemblyOrder: 1,
        connections: ["Motherboard", "Fader Rails", "Knobs"],
        failureEffect: "Physical instability, exposure of internal components.",
        cascadeFailures: ["Signal interference due to lost shielding"],
        originalPosition: {x: 0, y: 1, z: 0},
        explodedPosition: {x: 0, y: -5, z: 0}
    });

    // 2. Channel Strips (Faders and EQ Knobs)
    const numChannels = 8;
    const faderMeshes = [];
    const knobMeshes = [];

    for (let i = 0; i < numChannels; i++) {
        const xPos = -8 + i * 2;
        
        // Fader Rail
        const railGeo = new THREE.BoxGeometry(0.2, 0.1, 4);
        const railMesh = new THREE.Mesh(railGeo, steel);
        railMesh.position.set(xPos, 2.05, 4);
        group.add(railMesh);

        // Fader Knob
        const faderGeo = new THREE.BoxGeometry(0.8, 0.6, 1);
        const faderMesh = new THREE.Mesh(faderGeo, plastic);
        faderMesh.position.set(xPos, 2.3, 4 + Math.sin(i * 0.5) * 1.5); // Initial random-looking positions
        group.add(faderMesh);
        faderMeshes.push({ mesh: faderMesh, channel: i });
        parts.push({
            name: `Channel ${i+1} Fader`,
            description: `Linear potentiometer for controlling the volume of channel ${i+1}.`,
            material: "plastic",
            function: "Attenuates or boosts the audio signal level for the specific channel.",
            assemblyOrder: 2 + i,
            connections: ["Fader Rail", `Channel ${i+1} VCA`],
            failureEffect: "Unable to control volume for this channel.",
            cascadeFailures: ["Audio dropout or clipping on this channel"],
            originalPosition: {x: xPos, y: 2.3, z: faderMesh.position.z},
            explodedPosition: {x: xPos, y: 8 + Math.random()*2, z: 8}
        });

        // EQ Knobs (High, Mid, Low)
        for (let j = 0; j < 3; j++) {
            const zPos = -1 - j * 1.5;
            const knobGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.4, 16);
            const knobMesh = new THREE.Mesh(knobGeo, rubber);
            knobMesh.position.set(xPos, 2.2, zPos);
            group.add(knobMesh);
            knobMeshes.push({ mesh: knobMesh, channel: i, eqBand: j });
        }
    }

    // 3. Master Fader
    const masterRailGeo = new THREE.BoxGeometry(0.4, 0.1, 5);
    const masterRailMesh = new THREE.Mesh(masterRailGeo, chrome);
    masterRailMesh.position.set(8, 2.05, 3.5);
    group.add(masterRailMesh);

    const masterFaderGeo = new THREE.BoxGeometry(1.2, 0.8, 1.5);
    const masterFaderMesh = new THREE.Mesh(masterFaderGeo, plastic);
    masterFaderMesh.position.set(8, 2.4, 4);
    group.add(masterFaderMesh);
    parts.push({
        name: "Master Fader",
        description: "Large precision fader controlling the final stereo output mix.",
        material: "plastic, chrome",
        function: "Controls the overall output level before it hits the main speakers.",
        assemblyOrder: 20,
        connections: ["Master Bus", "Output Stage"],
        failureEffect: "Complete loss of audio output or inability to control overall volume.",
        cascadeFailures: ["Speaker blowout if volume spikes"],
        originalPosition: {x: 8, y: 2.4, z: 4},
        explodedPosition: {x: 12, y: 10, z: 4}
    });

    // 4. LED VU Meters
    const ledMeshes = [];
    const numLeds = 12;
    for (let i = 0; i < 2; i++) { // Left and Right channels
        const xPos = 7.5 + i * 1;
        for (let j = 0; j < numLeds; j++) {
            const zPos = -4 + j * 0.4;
            const ledGeo = new THREE.BoxGeometry(0.6, 0.2, 0.2);
            let material = ledGreen;
            if (j > 7) material = ledYellow;
            if (j > 10) material = ledRed;
            
            const ledMesh = new THREE.Mesh(ledGeo, material);
            ledMesh.position.set(xPos, 2.1, zPos);
            group.add(ledMesh);
            ledMeshes.push({ mesh: ledMesh, index: j, channel: i, baseMaterial: material });
        }
    }
    parts.push({
        name: "LED VU Meters",
        description: "Array of LEDs representing the audio level of the master output.",
        material: "glass, glowing materials",
        function: "Visual feedback of audio signal strength to prevent clipping.",
        assemblyOrder: 25,
        connections: ["Master Output Circuit"],
        failureEffect: "No visual feedback of audio levels.",
        cascadeFailures: ["Unnoticed signal clipping and distortion"],
        originalPosition: {x: 8, y: 2.1, z: -2},
        explodedPosition: {x: 8, y: 12, z: -8}
    });

    const description = "A high-end analog audio mixing console featuring 8 channel strips with 3-band EQ, linear faders, and a dynamic LED VU meter for master output monitoring.";

    const quizQuestions = [
        {
            question: "What is the primary function of a linear fader on an audio mixer?",
            options: [
                "To change the pitch of the audio",
                "To attenuate or boost the signal level",
                "To add echo effects",
                "To power the microphone"
            ],
            correct: 1,
            explanation: "Faders are variable resistors (potentiometers) used to smoothly increase or decrease the volume (signal level) of an audio channel.",
            difficulty: "easy"
        },
        {
            question: "Why do VU meters change color from green to yellow to red?",
            options: [
                "For aesthetic purposes only",
                "To indicate the temperature of the mixer",
                "To warn the engineer that the audio signal is approaching distortion (clipping)",
                "To show which channel is currently soloed"
            ],
            correct: 2,
            explanation: "Green indicates safe levels, yellow warns of high levels, and red indicates the signal is too loud and will likely distort or 'clip'.",
            difficulty: "medium"
        },
        {
            question: "In a 3-band EQ, what frequency range does the middle knob typically control?",
            options: [
                "Sub-bass frequencies (20Hz - 60Hz)",
                "Treble frequencies (4kHz - 20kHz)",
                "Midrange frequencies (300Hz - 4kHz)",
                "Radio frequencies"
            ],
            correct: 2,
            explanation: "A standard 3-band EQ controls Low (bass), Mid (midrange), and High (treble) frequencies. The midrange contains critical audio information like vocals.",
            difficulty: "medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Animate faders moving automatically (like a motorized flying fader console)
        faderMeshes.forEach(f => {
            const offset = f.channel * 0.5;
            f.mesh.position.z = 4 + Math.sin(time * speed * 2 + offset) * 1.5;
        });

        // Animate Master fader
        masterFaderMesh.position.z = 4 + Math.sin(time * speed) * 0.5;

        // Animate EQ Knobs rotating
        knobMeshes.forEach(k => {
            const offset = k.channel + k.eqBand;
            k.mesh.rotation.y = Math.sin(time * speed * 3 + offset) * Math.PI / 4;
        });

        // Animate LED VU Meters (simulating audio levels)
        const audioLevelL = (Math.sin(time * speed * 8) * 0.5 + 0.5) * numLeds;
        const audioLevelR = (Math.sin(time * speed * 8.5) * 0.5 + 0.5) * numLeds;
        
        ledMeshes.forEach(led => {
            const level = led.channel === 0 ? audioLevelL : audioLevelR;
            if (led.index < level) {
                led.mesh.material = led.baseMaterial;
            } else {
                led.mesh.material = ledOff;
            }
        });
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createMixer() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
