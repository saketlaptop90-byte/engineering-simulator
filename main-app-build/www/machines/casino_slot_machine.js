import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom materials
    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 2,
        roughness: 0.1,
        metalness: 0.8
    });

    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 2,
        roughness: 0.1,
        metalness: 0.8
    });

    const neonYellow = new THREE.MeshStandardMaterial({
        color: 0xffff00,
        emissive: 0xffff00,
        emissiveIntensity: 2,
        roughness: 0.1,
        metalness: 0.8
    });

    // --- Geometries ---

    // Cabinet
    const cabinetGeom = new THREE.BoxGeometry(20, 40, 15);
    const cabinetMesh = new THREE.Mesh(cabinetGeom, darkSteel);
    cabinetMesh.position.set(0, 20, 0);
    group.add(cabinetMesh);
    parts.push({
        name: 'Cabinet Frame',
        description: 'The main structural housing of the slot machine, supporting all internal components and external interfaces.',
        material: 'darkSteel',
        function: 'Structural support and protection of internal electromechanical mechanisms.',
        assemblyOrder: 1,
        connections: ['Motherboard', 'Reel Assembly', 'Coin Hopper', 'Lever Assembly'],
        failureEffect: 'Structural integrity compromised; possible misalignment of internal components.',
        cascadeFailures: ['Reel Jamming', 'Lever Malfunction'],
        originalPosition: { x: 0, y: 20, z: 0 },
        explodedPosition: { x: 0, y: 20, z: -20 },
        mesh: cabinetMesh
    });

    // Glass Screen
    const screenGeom = new THREE.BoxGeometry(18, 12, 1);
    const screenMesh = new THREE.Mesh(screenGeom, tinted);
    screenMesh.position.set(0, 25, 7.6);
    group.add(screenMesh);
    parts.push({
        name: 'Display Glass',
        description: 'Tinted glass protecting the electromechanical spinning reels.',
        material: 'tinted',
        function: 'Protects the reels while allowing visibility of the game outcome.',
        assemblyOrder: 5,
        connections: ['Cabinet Frame'],
        failureEffect: 'Vulnerability of reels to tampering and physical damage.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 25, z: 7.6 },
        explodedPosition: { x: 0, y: 25, z: 20 },
        mesh: screenMesh
    });

    // Reels (3 reels)
    const reelGeom = new THREE.CylinderGeometry(4, 4, 3, 32);
    const reels = [];
    const reelSpacing = 4.5;
    for (let i = 0; i < 3; i++) {
        const reelMesh = new THREE.Mesh(reelGeom, aluminum);
        reelMesh.rotation.z = Math.PI / 2;
        reelMesh.position.set((i - 1) * reelSpacing, 25, 5);
        group.add(reelMesh);
        reels.push(reelMesh);
        parts.push({
            name: `Stepper Reel ${i + 1}`,
            description: `Electromechanical reel ${i + 1} with symbols. Driven by a high-precision stepper motor.`,
            material: 'aluminum',
            function: 'Displays the randomly generated outcome of the spin.',
            assemblyOrder: 3,
            connections: ['Reel Motor Axis', 'Optical Sensor'],
            failureEffect: 'Reel fails to spin or stops at an incorrect position.',
            cascadeFailures: ['Payout Error', 'Game Lockup'],
            originalPosition: { x: (i - 1) * reelSpacing, y: 25, z: 5 },
            explodedPosition: { x: (i - 1) * reelSpacing, y: 25 + (i * 2), z: 25 + (i * 2) },
            mesh: reelMesh
        });
    }

    // Lever Assembly
    // Base
    const leverBaseGeom = new THREE.CylinderGeometry(1.5, 1.5, 2, 16);
    const leverBaseMesh = new THREE.Mesh(leverBaseGeom, chrome);
    leverBaseMesh.rotation.z = Math.PI / 2;
    leverBaseMesh.position.set(10.5, 20, 2);
    group.add(leverBaseMesh);
    
    // Arm
    const leverArmGeom = new THREE.CylinderGeometry(0.5, 0.5, 10, 16);
    const leverArmMesh = new THREE.Mesh(leverArmGeom, chrome);
    leverArmMesh.position.set(0, 5, 0); // Relative to base
    
    // Knob
    const knobGeom = new THREE.SphereGeometry(1.5, 32, 32);
    const knobMesh = new THREE.Mesh(knobGeom, neonRed);
    knobMesh.position.set(0, 5, 0); // Relative to arm
    leverArmMesh.add(knobMesh);
    
    leverBaseMesh.add(leverArmMesh); // Arm rotates around base
    
    parts.push({
        name: 'Pull Lever Assembly',
        description: 'The iconic heavy pull-lever used to initiate the spin mechanism.',
        material: 'chrome',
        function: 'Acts as a mechanical input to start the game, triggering the internal optical switch.',
        assemblyOrder: 4,
        connections: ['Cabinet Frame', 'Lever Spring Mechanism', 'Start Switch'],
        failureEffect: 'Inability to start the game manually.',
        cascadeFailures: [],
        originalPosition: { x: 10.5, y: 20, z: 2 },
        explodedPosition: { x: 25, y: 20, z: 2 },
        mesh: leverBaseMesh
    });

    // Coin Tray
    const trayGeom = new THREE.BoxGeometry(18, 4, 6);
    const trayMesh = new THREE.Mesh(trayGeom, steel);
    trayMesh.position.set(0, 2, 10);
    group.add(trayMesh);
    parts.push({
        name: 'Coin Payout Tray',
        description: 'Receptacle where coins are dispensed upon a winning combination.',
        material: 'steel',
        function: 'Collects and holds dispensed coins for the player.',
        assemblyOrder: 2,
        connections: ['Cabinet Frame', 'Coin Hopper Chute'],
        failureEffect: 'Coins may spill or fail to dispense correctly.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 2, z: 10 },
        explodedPosition: { x: 0, y: 2, z: 30 },
        mesh: trayMesh
    });

    // Jackpot Lights
    const lightGeom = new THREE.SphereGeometry(2, 32, 32);
    const lightMesh1 = new THREE.Mesh(lightGeom, neonBlue);
    const lightMesh2 = new THREE.Mesh(lightGeom, neonYellow);
    lightMesh1.position.set(-6, 42, 0);
    lightMesh2.position.set(6, 42, 0);
    group.add(lightMesh1);
    group.add(lightMesh2);
    
    parts.push({
        name: 'Jackpot Light L',
        description: 'High-intensity neon indicator light for jackpot signaling.',
        material: 'glass',
        function: 'Provides visual feedback for large payouts or errors.',
        assemblyOrder: 6,
        connections: ['Cabinet Frame', 'Motherboard Light Controller'],
        failureEffect: 'Loss of visual notification on jackpot.',
        cascadeFailures: [],
        originalPosition: { x: -6, y: 42, z: 0 },
        explodedPosition: { x: -15, y: 50, z: 0 },
        mesh: lightMesh1
    });

    parts.push({
        name: 'Jackpot Light R',
        description: 'High-intensity neon indicator light for jackpot signaling.',
        material: 'glass',
        function: 'Provides visual feedback for large payouts or errors.',
        assemblyOrder: 6,
        connections: ['Cabinet Frame', 'Motherboard Light Controller'],
        failureEffect: 'Loss of visual notification on jackpot.',
        cascadeFailures: [],
        originalPosition: { x: 6, y: 42, z: 0 },
        explodedPosition: { x: 15, y: 50, z: 0 },
        mesh: lightMesh2
    });


    // Coin Slot
    const slotGeom = new THREE.BoxGeometry(1, 3, 1);
    const slotMesh = new THREE.Mesh(slotGeom, chrome);
    slotMesh.position.set(8, 18, 7.6);
    group.add(slotMesh);
    parts.push({
        name: 'Coin Acceptor',
        description: 'Optical and mechanical validator for inserted coins or tokens.',
        material: 'chrome',
        function: 'Validates coin authenticity and denomination before crediting the player.',
        assemblyOrder: 4,
        connections: ['Cabinet Frame', 'Motherboard', 'Internal Coin Drop'],
        failureEffect: 'Rejects all coins or accepts invalid tokens.',
        cascadeFailures: ['Revenue Loss'],
        originalPosition: { x: 8, y: 18, z: 7.6 },
        explodedPosition: { x: 15, y: 18, z: 20 },
        mesh: slotMesh
    });

    const description = "A modern electromechanical casino slot machine. It combines classic physical spinning reels with modern stepper motor precision, governed by a central microprocessor. Features include an iconic mechanical pull-lever with internal spring and switch, optical coin validation, and high-visibility neon jackpot indicators.";

    const quizQuestions = [
        {
            question: "What is the primary function of the stepper motors in a modern electromechanical slot machine?",
            options: [
                "To process the RNG (Random Number Generation) algorithm.",
                "To precisely control the stopping position of the physical reels.",
                "To validate the authenticity of inserted coins.",
                "To illuminate the jackpot indicators."
            ],
            correct: 1,
            explanation: "Stepper motors are used because they can move in precise increments (steps), allowing the internal computer to stop the physical reels at the exact symbols determined by the Random Number Generator.",
            difficulty: "Medium"
        },
        {
            question: "In a modern slot machine, what happens mechanically when the player pulls the heavy lever?",
            options: [
                "It physically spins the reels using gear ratios.",
                "It manually triggers the coin hopper to dispense.",
                "It compresses a spring and triggers an electronic start switch, signaling the computer to spin the reels.",
                "It directly winds the stepper motors."
            ],
            correct: 2,
            explanation: "While the lever feels heavy to simulate classic machines, it is mostly a large electronic switch. Pulling it triggers a sensor that tells the computer to initiate the spin cycle.",
            difficulty: "Easy"
        },
        {
            question: "How does the Coin Acceptor prevent fraudulent tokens from crediting the machine?",
            options: [
                "By only checking the weight of the coin.",
                "By using optical sensors, magnetic signatures, and size validation to verify authenticity.",
                "By taking a photograph of every coin.",
                "By melting down the coin internally."
            ],
            correct: 1,
            explanation: "Modern coin acceptors use a combination of optical, physical size, and electromagnetic signatures to ensure only valid currency or specific casino tokens are accepted.",
            difficulty: "Hard"
        }
    ];

    // Animation state
    let isSpinning = false;
    let leverPulled = false;
    let leverAngle = 0;
    let spinTime = 0;
    let lightPulse = 0;

    function animate(time, speed, meshes) {
        // Lever animation cycle (simulate a pull every few seconds if not manually controlled)
        const cycle = (time * speed) % 10;
        
        if (cycle < 1 && !leverPulled) {
            leverAngle = THREE.MathUtils.lerp(leverAngle, Math.PI / 3, 0.1);
            if (leverAngle > (Math.PI / 3) - 0.05) {
                leverPulled = true;
                isSpinning = true;
                spinTime = 0;
            }
        } else {
            leverAngle = THREE.MathUtils.lerp(leverAngle, 0, 0.2);
            if (leverAngle < 0.05 && cycle > 5) {
                leverPulled = false;
            }
        }
        
        // Apply lever rotation
        const leverMesh = parts.find(p => p.name === 'Pull Lever Assembly')?.mesh;
        if (leverMesh && leverMesh.children[0]) {
            leverMesh.children[0].rotation.x = leverAngle; // Rotate arm around local X
        }

        // Reel spinning
        if (isSpinning) {
            spinTime += 0.05 * speed;
            reels.forEach((reel, index) => {
                // Stagger stopping time
                if (spinTime < 5 + (index * 2)) {
                    // Fast spin
                    reel.rotation.x -= 0.5 * speed;
                } else {
                    // Snap to nearest position (simulate stepper)
                    const snapAngle = Math.round(reel.rotation.x / (Math.PI / 4)) * (Math.PI / 4);
                    reel.rotation.x = THREE.MathUtils.lerp(reel.rotation.x, snapAngle, 0.2);
                }
            });
            
            if (spinTime >= 10) {
                isSpinning = false;
            }
        }

        // Light pulsing
        lightPulse += 0.1 * speed;
        const pulseVal = (Math.sin(lightPulse) + 1) / 2 + 1; // 1 to 2
        
        const lightMesh1 = parts.find(p => p.name === 'Jackpot Light L')?.mesh;
        const lightMesh2 = parts.find(p => p.name === 'Jackpot Light R')?.mesh;
        
        if (lightMesh1 && lightMesh1.material.emissiveIntensity !== undefined) {
            lightMesh1.material.emissiveIntensity = pulseVal * 2;
        }
        if (lightMesh2 && lightMesh2.material.emissiveIntensity !== undefined) {
            lightMesh2.material.emissiveIntensity = (2 - pulseVal) * 2; // Alternate pulse
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createSlotMachine() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
