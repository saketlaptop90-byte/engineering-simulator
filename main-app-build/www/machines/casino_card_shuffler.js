import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const glowingNeonGreen = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.9,
    });
    
    const glowingNeonBlue = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 1.5,
    });

    const transparentAcrylic = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.9,
        opacity: 1,
        metalness: 0,
        roughness: 0.1,
        ior: 1.5,
        thickness: 0.5,
    });

    const deckMaterial = new THREE.MeshStandardMaterial({
        color: 0xeeeeee,
        roughness: 0.8,
        metalness: 0.1
    });

    // 1. Transparent Housing
    const housingGeom = new THREE.BoxGeometry(4, 3, 2.5);
    const housing = new THREE.Mesh(housingGeom, transparentAcrylic);
    housing.position.set(0, 1.5, 0);
    group.add(housing);
    parts.push({
        name: "Transparent Acrylic Housing",
        description: "A clear protective casing that prevents tampering while allowing observation of the shuffling mechanism.",
        material: "transparentAcrylic",
        function: "Protect internal components and ensure fair play visibility.",
        assemblyOrder: 5,
        connections: ["Base Plate", "Roller Mechanism"],
        failureEffect: "Exposure of internal parts to dust and potential tampering.",
        cascadeFailures: ["Optical Sensors"],
        originalPosition: { x: 0, y: 1.5, z: 0 },
        explodedPosition: { x: 0, y: 4, z: 0 },
        mesh: housing
    });

    // 2. Base Plate
    const baseGeom = new THREE.BoxGeometry(4.2, 0.2, 2.7);
    const base = new THREE.Mesh(baseGeom, darkSteel);
    base.position.set(0, 0.1, 0);
    group.add(base);
    parts.push({
        name: "Heavy-Duty Base Plate",
        description: "A weighted metal base providing stability during high-speed operations.",
        material: "darkSteel",
        function: "Structural support and vibration dampening.",
        assemblyOrder: 1,
        connections: ["Housing", "Motors"],
        failureEffect: "Excessive vibration leading to card jams.",
        cascadeFailures: ["Roller Mechanism", "Drive Belt"],
        originalPosition: { x: 0, y: 0.1, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 },
        mesh: base
    });

    // 3. Left Card Hopper (Input)
    const hopperGeom = new THREE.BoxGeometry(1.2, 1.5, 1.8);
    const hopperLeft = new THREE.Mesh(hopperGeom, chrome);
    hopperLeft.position.set(-1.2, 1.5, 0);
    group.add(hopperLeft);
    parts.push({
        name: "Input Hopper",
        description: "Receives the unshuffled deck and aligns cards for the feed rollers.",
        material: "chrome",
        function: "Card alignment and feeding.",
        assemblyOrder: 2,
        connections: ["Base Plate", "Feed Roller Left"],
        failureEffect: "Cards fail to feed properly.",
        cascadeFailures: ["Card Jams"],
        originalPosition: { x: -1.2, y: 1.5, z: 0 },
        explodedPosition: { x: -3, y: 1.5, z: 0 },
        mesh: hopperLeft
    });

    // 4. Right Card Hopper (Output)
    const hopperRight = new THREE.Mesh(hopperGeom, chrome);
    hopperRight.position.set(1.2, 1.5, 0);
    group.add(hopperRight);
    parts.push({
        name: "Output Hopper",
        description: "Collects and neatly stacks the newly shuffled deck.",
        material: "chrome",
        function: "Card collection.",
        assemblyOrder: 3,
        connections: ["Base Plate", "Ejection Roller"],
        failureEffect: "Scattered or misaligned shuffled cards.",
        cascadeFailures: ["Dealer Delay"],
        originalPosition: { x: 1.2, y: 1.5, z: 0 },
        explodedPosition: { x: 3, y: 1.5, z: 0 },
        mesh: hopperRight
    });

    // 5. Central High-Speed Motor
    const motorGeom = new THREE.CylinderGeometry(0.4, 0.4, 1.2, 32);
    const motor = new THREE.Mesh(motorGeom, copper);
    motor.rotation.x = Math.PI / 2;
    motor.position.set(0, 0.6, 0);
    group.add(motor);
    parts.push({
        name: "Brushless DC Motor",
        description: "Provides high-speed, precise rotational torque to the roller mechanism.",
        material: "copper",
        function: "Power generation for shuffling.",
        assemblyOrder: 4,
        connections: ["Base Plate", "Drive Belt"],
        failureEffect: "Machine fails to operate.",
        cascadeFailures: ["All moving parts"],
        originalPosition: { x: 0, y: 0.6, z: 0 },
        explodedPosition: { x: 0, y: 0.6, z: -3 },
        mesh: motor
    });

    // 6. Glowing Rollers (Left and Right)
    const rollerGeom = new THREE.CylinderGeometry(0.2, 0.2, 1.6, 16);
    const leftRoller = new THREE.Mesh(rollerGeom, glowingNeonBlue);
    leftRoller.rotation.x = Math.PI / 2;
    leftRoller.position.set(-0.5, 1.2, 0);
    group.add(leftRoller);
    parts.push({
        name: "Feed Roller",
        description: "High-friction, glowing silicone roller that pulls cards individually.",
        material: "glowingNeonBlue",
        function: "Card extraction.",
        assemblyOrder: 6,
        connections: ["Motor", "Input Hopper"],
        failureEffect: "Pulls multiple cards at once.",
        cascadeFailures: ["Card Jam"],
        originalPosition: { x: -0.5, y: 1.2, z: 0 },
        explodedPosition: { x: -0.5, y: 1.2, z: 3 },
        mesh: leftRoller
    });

    const rightRoller = new THREE.Mesh(rollerGeom, glowingNeonGreen);
    rightRoller.rotation.x = Math.PI / 2;
    rightRoller.position.set(0.5, 1.2, 0);
    group.add(rightRoller);
    parts.push({
        name: "Ejection Roller",
        description: "High-speed roller that shoots cards into the output hopper.",
        material: "glowingNeonGreen",
        function: "Card insertion.",
        assemblyOrder: 7,
        connections: ["Motor", "Output Hopper"],
        failureEffect: "Cards get stuck in the central chamber.",
        cascadeFailures: ["Card Jam"],
        originalPosition: { x: 0.5, y: 1.2, z: 0 },
        explodedPosition: { x: 0.5, y: 1.2, z: 3 },
        mesh: rightRoller
    });

    // 7. Cards in motion
    const cards = [];
    for(let i=0; i<5; i++) {
        const cardGeom = new THREE.BoxGeometry(0.8, 0.02, 1.2);
        const card = new THREE.Mesh(cardGeom, deckMaterial);
        card.position.set(0, 1.2 + (i*0.1), 0);
        group.add(card);
        cards.push(card);
    }

    const description = "A Casino Automatic Card Shuffler ensures fair play by utilizing high-speed rollers, optical sensors, and precision motors to randomize a deck of cards far faster and more securely than a human dealer. This model features a transparent acrylic housing to reveal the mesmerizing high-tech neon rollers inside.";

    const quizQuestions = [
        {
            question: "Why do high-end casino shufflers often use transparent housings?",
            options: ["To reduce manufacturing costs", "To prevent tampering and ensure players can verify no hidden cards", "To improve aerodynamics", "To keep the motor cool"],
            correct: 1,
            explanation: "Transparent housings allow both the players and the pit boss to visually verify that no cards are trapped, hidden, or manipulated inside the machine, ensuring fair play.",
            difficulty: "easy"
        },
        {
            question: "What is the primary function of the high-friction rollers?",
            options: ["To apply ink to the cards", "To pull precisely one card at a time from the input hopper", "To scan the card faces", "To cool the motor"],
            correct: 1,
            explanation: "The feed rollers rely on highly precise friction tolerances to grip and pull exactly one card off the top or bottom of the deck. If they wear out, they might pull two cards, causing a jam.",
            difficulty: "medium"
        },
        {
            question: "Which component is most likely to cause a catastrophic jam if it fails?",
            options: ["The output hopper tray", "The acrylic housing", "The feed rollers", "The base plate"],
            correct: 2,
            explanation: "If a feed roller fails to separate cards correctly and pulls multiples, the cards will jam in the central mechanism.",
            difficulty: "medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Rotate the motor
        motor.rotation.y = time * speed * 5;
        
        // Rotate rollers in opposite directions
        leftRoller.rotation.y = -time * speed * 8;
        rightRoller.rotation.y = time * speed * 8;

        // Animate cards flying from left to right
        cards.forEach((card, index) => {
            const offset = index * 0.5;
            const cycle = ((time * speed * 2) + offset) % 2;
            
            // Parametric flight path
            if (cycle < 1) {
                // Moving from left hopper to center
                card.position.x = -1.2 + (cycle * 1.2);
                card.position.y = 1.8 - (cycle * 0.6);
                card.rotation.z = cycle * Math.PI / 4;
            } else {
                // Moving from center to right hopper
                const t = cycle - 1;
                card.position.x = 0 + (t * 1.2);
                card.position.y = 1.2 + (t * 0.6);
                card.rotation.z = (Math.PI / 4) - (t * Math.PI / 4);
            }
        });
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createCardShuffler() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
