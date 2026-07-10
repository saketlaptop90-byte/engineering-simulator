import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const neonBlue = new THREE.MeshPhysicalMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 2, transparent: true, opacity: 0.8 });
    const tapeMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.6, metalness: 0.1 });
    const glowingHead = new THREE.MeshStandardMaterial({ color: 0xff3300, emissive: 0xff3300, emissiveIntensity: 1.5 });
    
    // 1. Main Deck Chassis
    const deckGeo = new THREE.BoxGeometry(10, 8, 2);
    const deck = new THREE.Mesh(deckGeo, darkSteel);
    group.add(deck);
    parts.push({
        name: "Main Deck Chassis",
        description: "The sturdy housing for all the mechanical and electronic components.",
        material: "darkSteel",
        function: "Provides structural integrity and grounding.",
        assemblyOrder: 1,
        connections: ["Supply Reel Motor", "Take-up Reel Motor", "Head Block"],
        failureEffect: "Misalignment of all components, fatal system failure.",
        cascadeFailures: ["Tape Transport", "Playback Heads"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -5 },
        mesh: deck
    });

    // 2. Supply Reel
    const reelGeo = new THREE.CylinderGeometry(2, 2, 0.2, 32);
    const supplyReel = new THREE.Mesh(reelGeo, aluminum);
    supplyReel.rotation.x = Math.PI / 2;
    supplyReel.position.set(-2.5, 1.5, 1.1);
    group.add(supplyReel);
    parts.push({
        name: "Supply Reel",
        description: "Holds the unplayed magnetic tape.",
        material: "aluminum",
        function: "Feeds the tape into the transport mechanism.",
        assemblyOrder: 2,
        connections: ["Supply Reel Motor", "Magnetic Tape"],
        failureEffect: "Tape stops feeding or unspools uncontrollably.",
        cascadeFailures: ["Tape Tension System"],
        originalPosition: { x: -2.5, y: 1.5, z: 1.1 },
        explodedPosition: { x: -6, y: 4, z: 4 },
        mesh: supplyReel
    });

    // 3. Take-up Reel
    const takeupReel = new THREE.Mesh(reelGeo, aluminum);
    takeupReel.rotation.x = Math.PI / 2;
    takeupReel.position.set(2.5, 1.5, 1.1);
    group.add(takeupReel);
    parts.push({
        name: "Take-up Reel",
        description: "Collects the magnetic tape after it has passed the heads.",
        material: "aluminum",
        function: "Maintains tension and stores played tape.",
        assemblyOrder: 3,
        connections: ["Take-up Reel Motor", "Magnetic Tape"],
        failureEffect: "Tape spills out into the machine causing a 'tape salad'.",
        cascadeFailures: ["Tape", "Capstan"],
        originalPosition: { x: 2.5, y: 1.5, z: 1.1 },
        explodedPosition: { x: 6, y: 4, z: 4 },
        mesh: takeupReel
    });

    // 4. Playback / Record Head
    const headGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const head = new THREE.Mesh(headGeo, chrome);
    head.position.set(0, -1.5, 1.2);
    group.add(head);
    parts.push({
        name: "Playback/Record Head",
        description: "Electromagnetic transducer that writes/reads magnetic flux on the tape.",
        material: "chrome",
        function: "Converts electrical signals to magnetic variations and vice versa.",
        assemblyOrder: 4,
        connections: ["Tape Transport", "Amplifier Circuit"],
        failureEffect: "Loss of audio signal or severe distortion.",
        cascadeFailures: ["Audio Output"],
        originalPosition: { x: 0, y: -1.5, z: 1.2 },
        explodedPosition: { x: 0, y: -4, z: 3 },
        mesh: head
    });

    // Glowing core for the head
    const headCoreGeo = new THREE.BoxGeometry(0.4, 0.4, 0.9);
    const headCore = new THREE.Mesh(headCoreGeo, glowingHead);
    headCore.position.set(0, -1.5, 1.25);
    group.add(headCore);

    // 5. Capstan
    const capstanGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.8, 16);
    const capstan = new THREE.Mesh(capstanGeo, steel);
    capstan.rotation.x = Math.PI / 2;
    capstan.position.set(1.5, -1.5, 1.2);
    group.add(capstan);
    parts.push({
        name: "Capstan shaft",
        description: "A rotating spindle driven by a precision motor.",
        material: "steel",
        function: "Controls the precise speed of the tape across the heads.",
        assemblyOrder: 5,
        connections: ["Pinch Roller", "Capstan Motor"],
        failureEffect: "Wow and flutter (pitch variation).",
        cascadeFailures: [],
        originalPosition: { x: 1.5, y: -1.5, z: 1.2 },
        explodedPosition: { x: 3, y: -5, z: 4 },
        mesh: capstan
    });

    // 6. Pinch Roller
    const pinchGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.6, 32);
    const pinchRoller = new THREE.Mesh(pinchGeo, rubber);
    pinchRoller.rotation.x = Math.PI / 2;
    pinchRoller.position.set(1.5, -2.1, 1.2);
    group.add(pinchRoller);
    parts.push({
        name: "Pinch Roller",
        description: "A rubber wheel that presses the tape against the capstan.",
        material: "rubber",
        function: "Ensures the tape moves at the exact speed of the capstan without slipping.",
        assemblyOrder: 6,
        connections: ["Capstan", "Tape Transport"],
        failureEffect: "Tape slippage, causing audio to slow down or stop.",
        cascadeFailures: ["Tape Tension"],
        originalPosition: { x: 1.5, y: -2.1, z: 1.2 },
        explodedPosition: { x: 3, y: -7, z: 5 },
        mesh: pinchRoller
    });

    // VU Meters
    const vuGeo = new THREE.BoxGeometry(1.2, 0.8, 0.2);
    const vuLeft = new THREE.Mesh(vuGeo, glass);
    vuLeft.position.set(-3, -3, 1.1);
    group.add(vuLeft);
    const vuRight = new THREE.Mesh(vuGeo, glass);
    vuRight.position.set(-1.5, -3, 1.1);
    group.add(vuRight);

    const vuLightGeo = new THREE.PlaneGeometry(1, 0.6);
    const vuLight1 = new THREE.Mesh(vuLightGeo, neonBlue);
    vuLight1.position.set(-3, -3, 1.21);
    group.add(vuLight1);
    const vuLight2 = new THREE.Mesh(vuLightGeo, neonBlue);
    vuLight2.position.set(-1.5, -3, 1.21);
    group.add(vuLight2);

    parts.push({
        name: "VU Meters",
        description: "Visual indicators showing the audio signal level.",
        material: "glass/neon",
        function: "Allows the user to monitor and calibrate input/output levels to avoid clipping.",
        assemblyOrder: 7,
        connections: ["Amplifier Circuit"],
        failureEffect: "Inability to accurately monitor levels.",
        cascadeFailures: [],
        originalPosition: { x: -2.25, y: -3, z: 1.1 },
        explodedPosition: { x: -4, y: -6, z: 3 },
        mesh: vuLeft
    });

    const quizQuestions = [
        {
            question: "What is the primary function of the capstan and pinch roller in a tape deck?",
            options: [
                "To erase the tape",
                "To provide a precise, constant tape speed across the heads",
                "To wind the tape onto the take-up reel quickly",
                "To amplify the audio signal"
            ],
            correct: 1,
            explanation: "The capstan dictates the speed, and the pinch roller presses the tape against it so it doesn't slip, ensuring steady playback free of wow and flutter.",
            difficulty: "Medium"
        },
        {
            question: "What material is typically used for the pinch roller?",
            options: [
                "Steel",
                "Aluminum",
                "Glass",
                "Rubber"
            ],
            correct: 3,
            explanation: "Rubber provides the necessary friction to grip the tape against the spinning metal capstan.",
            difficulty: "Easy"
        },
        {
            question: "In an analog tape deck, what does the playback head detect from the tape?",
            options: [
                "Optical reflections",
                "Microscopic grooves",
                "Variations in magnetic flux",
                "Digital binary pits"
            ],
            correct: 2,
            explanation: "The head acts as an electromagnetic transducer, reading the fluctuating magnetic field stored in the tape's iron oxide or chromium dioxide particles.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Spin the reels
        supplyReel.rotation.y -= 0.02 * speed;
        takeupReel.rotation.y -= 0.02 * speed;
        
        // Spin capstan and pinch roller (they rotate in opposite directions due to contact)
        capstan.rotation.y -= 0.05 * speed;
        pinchRoller.rotation.y += 0.05 * speed;

        // Flicker VU meters
        const vuIntensity = 0.5 + Math.random() * 0.5;
        neonBlue.opacity = vuIntensity * 0.8;
        
        // Pulse playback head
        glowingHead.emissiveIntensity = 1.0 + Math.sin(time * 0.01) * 0.5;
    }

    return { group, parts, description: "A high-fidelity reel-to-reel magnetic tape deck.", quizQuestions, animate };
}

// Auto-generated missing stub
export function createReelToReelTapeDeck() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
