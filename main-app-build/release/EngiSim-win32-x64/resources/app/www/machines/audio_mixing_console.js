import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00aaff,
        emissive: 0x00aaff,
        emissiveIntensity: 1.5,
        metalness: 0.2,
        roughness: 0.1
    });

    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff0033,
        emissive: 0xff0033,
        emissiveIntensity: 1.5,
        metalness: 0.2,
        roughness: 0.1
    });

    const neonGreen = new THREE.MeshStandardMaterial({
        color: 0x33ff33,
        emissive: 0x33ff33,
        emissiveIntensity: 1.2,
        metalness: 0.2,
        roughness: 0.2
    });

    const neonAmber = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0xffaa00,
        emissiveIntensity: 1.2,
        metalness: 0.2,
        roughness: 0.2
    });

    const panelMaterial = new THREE.MeshStandardMaterial({
        color: 0x111111,
        metalness: 0.5,
        roughness: 0.6
    });

    // 1. Main Chassis
    const chassisGeometry = new THREE.BoxGeometry(60, 2, 30);
    const chassis = new THREE.Mesh(chassisGeometry, panelMaterial);
    chassis.position.set(0, 0, 0);
    group.add(chassis);
    parts.push({
        name: "Main Chassis",
        description: "Heavy-duty steel frame housing the entire mixing console structure.",
        material: "Dark Steel / Aluminum",
        function: "Provides structural integrity and grounding for electronic components.",
        assemblyOrder: 1,
        connections: ["Channel Strips", "Master Section", "Meter Bridge"],
        failureEffect: "Physical instability, grounding issues",
        cascadeFailures: ["Signal noise", "Module dislodgment"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 }
    });
    
    // 2. Meter Bridge
    const bridgeGeometry = new THREE.BoxGeometry(60, 4, 3);
    const bridge = new THREE.Mesh(bridgeGeometry, aluminum);
    bridge.position.set(0, 3, -13.5);
    bridge.rotation.x = Math.PI / 12;
    group.add(bridge);
    parts.push({
        name: "Meter Bridge",
        description: "Elevated rear section containing VU meters for monitoring signal levels.",
        material: "Aluminum / Glass",
        function: "Displays visual feedback for audio levels across all channels.",
        assemblyOrder: 2,
        connections: ["Main Chassis", "VU Meters"],
        failureEffect: "Loss of visual monitoring",
        cascadeFailures: ["Signal clipping undetected"],
        originalPosition: { x: 0, y: 3, z: -13.5 },
        explodedPosition: { x: 0, y: 10, z: -15 }
    });

    // 3. Channel Strips (Faders, Knobs, Buttons)
    // 48 channels
    const numChannels = 48;
    const channelWidth = 60 / numChannels;

    const faderMeshes = [];
    const ledMeshes = [];
    const knobMeshes = [];

    for (let i = 0; i < numChannels; i++) {
        const xOffset = -30 + (i + 0.5) * channelWidth;
        
        // Fader track
        const trackGeo = new THREE.BoxGeometry(0.2, 0.1, 8);
        const track = new THREE.Mesh(trackGeo, darkSteel);
        track.position.set(xOffset, 1.05, 10);
        group.add(track);

        // Fader cap
        const faderCapGeo = new THREE.BoxGeometry(0.6, 0.8, 1.2);
        const faderCap = new THREE.Mesh(faderCapGeo, plastic);
        const faderY = 1.4;
        const faderZ = 10; 
        faderCap.position.set(xOffset, faderY, faderZ);
        group.add(faderCap);
        faderMeshes.push({ mesh: faderCap, baseX: xOffset, baseZ: 10, offset: Math.random() * Math.PI * 2 });

        // Knobs (EQ, Aux)
        for (let j = 0; j < 8; j++) {
            const knobGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.5, 16);
            const knob = new THREE.Mesh(knobGeo, j % 2 === 0 ? plastic : chrome);
            const knobZ = -5 + j * 1.5;
            knob.position.set(xOffset, 1.2, knobZ);
            group.add(knob);
            knobMeshes.push({ mesh: knob, speed: (Math.random() - 0.5) * 2 });
        }

        // Buttons (Mute, Solo)
        const muteBtnGeo = new THREE.BoxGeometry(0.4, 0.2, 0.4);
        const muteBtn = new THREE.Mesh(muteBtnGeo, neonRed);
        muteBtn.position.set(xOffset, 1.1, 5);
        group.add(muteBtn);
        ledMeshes.push({ mesh: muteBtn, blinkRate: Math.random() > 0.8 ? Math.random() * 5 + 1 : 0 });

        const soloBtnGeo = new THREE.BoxGeometry(0.4, 0.2, 0.4);
        const soloBtn = new THREE.Mesh(soloBtnGeo, neonAmber);
        soloBtn.position.set(xOffset, 1.1, 4.2);
        group.add(soloBtn);
        ledMeshes.push({ mesh: soloBtn, blinkRate: Math.random() > 0.9 ? Math.random() * 3 + 1 : 0 });

        // Meter LEDs on bridge
        const meterGeo = new THREE.BoxGeometry(0.4, 2, 0.1);
        const meter = new THREE.Mesh(meterGeo, neonGreen);
        meter.position.set(xOffset, 3, -12.5);
        meter.rotation.x = Math.PI / 12;
        group.add(meter);
        ledMeshes.push({ mesh: meter, type: 'meter', baseY: 3, index: i });
    }

    parts.push({
        name: "Channel Strips",
        description: "Individual modules for processing incoming audio signals (EQ, dynamics, routing).",
        material: "PCB / Plastic / Chrome",
        function: "Controls the volume, tone, and routing of individual audio sources.",
        assemblyOrder: 3,
        connections: ["Main Chassis", "Audio Inputs", "Mix Buses"],
        failureEffect: "Loss of signal on specific channel",
        cascadeFailures: ["Imbalanced mix", "Routing errors"],
        originalPosition: { x: 0, y: 1.5, z: 2 },
        explodedPosition: { x: 0, y: 5, z: 5 }
    });

    parts.push({
        name: "Motorized Faders",
        description: "Automated volume sliders driven by internal servo motors.",
        material: "Plastic / Copper / Steel",
        function: "Allows precise, repeatable volume control and automation recall.",
        assemblyOrder: 4,
        connections: ["Channel Strips", "Automation Computer"],
        failureEffect: "Fader stuck, manual control only",
        cascadeFailures: ["Automation mix errors"],
        originalPosition: { x: 0, y: 1.4, z: 10 },
        explodedPosition: { x: 0, y: 12, z: 15 }
    });

    // Master Section
    const masterSecGeo = new THREE.BoxGeometry(8, 0.5, 26);
    const masterSec = new THREE.Mesh(masterSecGeo, darkSteel);
    masterSec.position.set(0, 1.25, 1);
    group.add(masterSec);

    // Master Faders
    for(let k = -1; k <= 1; k+=2) {
        const mFaderGeo = new THREE.BoxGeometry(0.8, 1, 1.5);
        const mFader = new THREE.Mesh(mFaderGeo, chrome);
        mFader.position.set(k * 1.5, 1.5, 10);
        group.add(mFader);
        faderMeshes.push({ mesh: mFader, baseX: k * 1.5, baseZ: 10, offset: Math.random() * Math.PI * 2, isMaster: true });
    }

    parts.push({
        name: "Master Section",
        description: "Central control hub for stereo bus, control room monitoring, and talkback.",
        material: "Dark Steel / Chrome",
        function: "Controls the final stereo output and monitoring environments.",
        assemblyOrder: 5,
        connections: ["Mix Buses", "Monitor Outputs", "Main Out"],
        failureEffect: "Complete loss of output",
        cascadeFailures: ["No monitoring", "Recording silence"],
        originalPosition: { x: 0, y: 1.25, z: 1 },
        explodedPosition: { x: 0, y: 8, z: 0 }
    });

    const description = "A large-format analog/digital hybrid studio mixing console. It features motorized faders for automation, extensive channel strips with parametric EQ, and a glowing VU meter bridge. A central hub for high-end audio production.";

    const quizQuestions = [
        {
            question: "What is the primary function of the motorized faders on a large format console?",
            options: [
                "To increase analog warmth",
                "To automatically balance EQ",
                "To recall and play back volume automation",
                "To cool the internal power supply"
            ],
            correct: 2,
            explanation: "Motorized faders recall the exact volume positions and movements recorded during automation passes, allowing complex mixes to be repeated automatically.",
            difficulty: "Medium"
        },
        {
            question: "Which section of the console combines all individual channel signals into the final stereo mix?",
            options: [
                "The Meter Bridge",
                "The Channel Strip",
                "The Preamp",
                "The Master Section"
            ],
            correct: 3,
            explanation: "The Master Section contains the mix bus where all routed signals sum together before heading to the master output or recording medium.",
            difficulty: "Easy"
        },
        {
            question: "What is a cascading failure of a broken Master Section?",
            options: [
                "Only Channel 1 fails",
                "Complete loss of output and monitoring",
                "Faders move too fast",
                "The meter bridge lights turn blue"
            ],
            correct: 1,
            explanation: "Since all signals route through the Master Section for final output and monitoring, a failure here compromises the entire mix output.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Animate motorized faders
        faderMeshes.forEach(fData => {
            const range = fData.isMaster ? 2 : 3.5;
            fData.mesh.position.z = fData.baseZ + Math.sin((time * speed * 0.5) + fData.offset) * range;
        });

        // Animate LED blinks and Meters
        ledMeshes.forEach(led => {
            if (led.type === 'meter') {
                const level = (Math.sin(time * speed * 2 + led.index * 0.2) + 1) * 0.5; // 0 to 1
                led.mesh.scale.y = Math.max(0.1, level * 2);
                led.mesh.position.y = led.baseY + (led.mesh.scale.y - 1) * 1.0;
                
                if (level > 0.8) {
                    led.mesh.material = neonRed;
                } else if (level > 0.5) {
                    led.mesh.material = neonAmber;
                } else {
                    led.mesh.material = neonGreen;
                }
            } else if (led.blinkRate > 0) {
                led.mesh.material.emissiveIntensity = Math.sin(time * speed * led.blinkRate) > 0 ? 2 : 0;
            }
        });

        // Rotate some endless encoders slowly
        knobMeshes.forEach(kData => {
            kData.mesh.rotation.y += kData.speed * 0.05 * speed;
        });
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createMixingConsole() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
