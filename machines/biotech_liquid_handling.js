import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const neonCyan = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
    });

    const neonPurple = new THREE.MeshStandardMaterial({
        color: 0x9d00ff,
        emissive: 0x9d00ff,
        emissiveIntensity: 0.5,
    });
    
    const neonGreen = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 0.6,
    });

    const transparentGlass = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.1,
        roughness: 0.1,
        transparent: true,
        opacity: 0.3,
        transmission: 0.9,
        ior: 1.5,
    });

    const blackPlastic = new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.8,
        metalness: 0.1,
    });

    // 1. Base Platform (Deck)
    const deckGeo = new THREE.BoxGeometry(20, 1, 15);
    const deck = new THREE.Mesh(deckGeo, darkSteel);
    deck.position.set(0, 0, 0);
    group.add(deck);
    parts.push({
        name: "Deck Platform",
        description: "The main working area where microplates, tips, and reagents are placed.",
        material: "darkSteel",
        function: "Provides a stable, high-precision coordinate system for the robotic arms.",
        assemblyOrder: 1,
        connections: ["Gantry Frame", "Microplates"],
        failureEffect: "Misalignment of all components.",
        cascadeFailures: ["Pipette Crashes", "Sample Contamination"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 }
    });

    // 2. Gantry Frame (Y-axis rails)
    const railLeftGeo = new THREE.BoxGeometry(1, 2, 15);
    const railLeft = new THREE.Mesh(railLeftGeo, aluminum);
    railLeft.position.set(-9.5, 1.5, 0);
    group.add(railLeft);
    
    const railRight = new THREE.Mesh(railLeftGeo, aluminum);
    railRight.position.set(9.5, 1.5, 0);
    group.add(railRight);
    
    parts.push({
        name: "Y-Axis Gantry Rails",
        description: "Precision linear guide rails running along the depth of the deck.",
        material: "aluminum",
        function: "Supports the X-axis bridge and allows smooth forward/backward movement.",
        assemblyOrder: 2,
        connections: ["Deck Platform", "X-Axis Bridge"],
        failureEffect: "Loss of Y-axis movement.",
        cascadeFailures: ["Arm Jamming"],
        originalPosition: { x: -9.5, y: 1.5, z: 0 },
        explodedPosition: { x: -15, y: 1.5, z: 0 }
    });

    // 3. X-Axis Bridge
    const bridgeGeo = new THREE.BoxGeometry(20, 1.5, 2);
    const bridge = new THREE.Mesh(bridgeGeo, chrome);
    bridge.position.set(0, 3, 0);
    group.add(bridge);
    parts.push({
        name: "X-Axis Bridge",
        description: "The horizontal beam that spans across the Y-axis rails.",
        material: "chrome",
        function: "Carries the pipetting head left and right across the deck.",
        assemblyOrder: 3,
        connections: ["Y-Axis Gantry Rails", "Pipetting Head"],
        failureEffect: "Loss of X-axis movement.",
        cascadeFailures: ["Incomplete Pipetting"],
        originalPosition: { x: 0, y: 3, z: 0 },
        explodedPosition: { x: 0, y: 8, z: -5 }
    });
    
    // Add glowing accent to bridge
    const bridgeAccentGeo = new THREE.BoxGeometry(19, 0.2, 2.1);
    const bridgeAccent = new THREE.Mesh(bridgeAccentGeo, neonCyan);
    bridgeAccent.position.set(0, 3, 0);
    group.add(bridgeAccent);

    // 4. Pipetting Head (Z-axis)
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 3, 0);
    
    const headBodyGeo = new THREE.BoxGeometry(3, 4, 2.5);
    const headBody = new THREE.Mesh(headBodyGeo, blackPlastic);
    headGroup.add(headBody);
    
    const headDisplayGeo = new THREE.PlaneGeometry(2, 1);
    const headDisplay = new THREE.Mesh(headDisplayGeo, neonPurple);
    headDisplay.position.set(0, 0.5, 1.26);
    headGroup.add(headDisplay);

    // 5. 96-well Pipette Array
    const nozzleGroup = new THREE.Group();
    nozzleGroup.position.set(0, -2, 0);
    const nozzleGeo = new THREE.CylinderGeometry(0.05, 0.05, 1, 8);
    
    for(let i=0; i<12; i++) {
        for(let j=0; j<8; j++) {
            const nozzle = new THREE.Mesh(nozzleGeo, steel);
            nozzle.position.set(-1.65 + i*0.3, -0.5, -1.05 + j*0.3);
            nozzleGroup.add(nozzle);
            
            // Add glowing liquid tips
            const tipGeo = new THREE.ConeGeometry(0.06, 0.5, 8);
            const tip = new THREE.Mesh(tipGeo, neonCyan);
            tip.position.set(-1.65 + i*0.3, -1.25, -1.05 + j*0.3);
            nozzleGroup.add(tip);
        }
    }
    headGroup.add(nozzleGroup);
    group.add(headGroup);

    parts.push({
        name: "96-Channel Pipetting Head",
        description: "A high-throughput liquid transfer module equipped with 96 independent syringe pumps.",
        material: "blackPlastic, steel, neonCyan",
        function: "Aspirates and dispenses precise volumes of liquid simultaneously.",
        assemblyOrder: 4,
        connections: ["X-Axis Bridge"],
        failureEffect: "Inability to transfer liquids.",
        cascadeFailures: ["Experiment Failure", "Reagent Waste"],
        originalPosition: { x: 0, y: 3, z: 0 },
        explodedPosition: { x: 0, y: 12, z: 5 }
    });

    // 6. Microplates on Deck
    const plateGeo = new THREE.BoxGeometry(3.5, 0.5, 2.5);
    const plateSpacingX = 4;
    const plateSpacingZ = 3;
    
    const platesGroup = new THREE.Group();
    platesGroup.position.set(0,0,0);
    for(let i=0; i<3; i++) {
        for(let j=0; j<3; j++) {
            if(i===1 && j===1) continue; // Leave a space
            const plate = new THREE.Mesh(plateGeo, transparentGlass);
            plate.position.set(-4 + i*plateSpacingX, 0.75, -3 + j*plateSpacingZ);
            
            // Reagents inside
            const liquidGeo = new THREE.BoxGeometry(3.3, 0.4, 2.3);
            const liquidMaterial = (i+j)%2 === 0 ? neonCyan : neonGreen;
            const liquid = new THREE.Mesh(liquidGeo, liquidMaterial);
            liquid.position.set(0, 0, 0);
            plate.add(liquid);
            
            platesGroup.add(plate);
        }
    }
    group.add(platesGroup);
    
    parts.push({
        name: "Microplates & Reservoirs",
        description: "Standardized containers holding samples, reagents, or buffer solutions.",
        material: "transparentGlass, neonGreen, neonCyan",
        function: "Stores the liquids being manipulated by the robot.",
        assemblyOrder: 5,
        connections: ["Deck Platform"],
        failureEffect: "Spillage or sample loss.",
        cascadeFailures: ["Cross-contamination"],
        originalPosition: { x: 0, y: 0.75, z: 0 },
        explodedPosition: { x: 0, y: 3, z: 10 }
    });
    
    // 7. Enclosure
    const enclosureGeo = new THREE.BoxGeometry(21, 15, 16);
    const enclosureMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x222222,
        transparent: true,
        opacity: 0.1,
        transmission: 0.95,
        roughness: 0.1
    });
    const enclosure = new THREE.Mesh(enclosureGeo, enclosureMaterial);
    enclosure.position.set(0, 8, 0);
    group.add(enclosure);
    
    parts.push({
        name: "Safety Enclosure",
        description: "Transparent protective casing with HEPA filtration.",
        material: "transparentGlass",
        function: "Maintains sterility and protects the operator from moving parts.",
        assemblyOrder: 6,
        connections: ["Deck Platform"],
        failureEffect: "Loss of sterile environment.",
        cascadeFailures: ["Contamination"],
        originalPosition: { x: 0, y: 8, z: 0 },
        explodedPosition: { x: 0, y: 20, z: 0 }
    });

    const description = "The Automated Liquid Handling Robot is a pinnacle of modern high-throughput biotechnology. Using advanced 3-axis CNC gantries and high-precision syringe pumps, it can transfer microliter-scale volumes across 96 or 384-well microplates in seconds. Its robotic arm moves smoothly on X, Y, and Z axes to aspirate and dispense neon-colored reagents, facilitating rapid genomics, proteomics, and drug discovery screening with zero human error.";

    const quizQuestions = [
        {
            question: "What is the primary advantage of a 96-channel pipetting head over a single-channel head?",
            options: [
                "It uses less electricity.",
                "It allows for simultaneous transfer of 96 samples, vastly increasing throughput.",
                "It prevents liquids from evaporating.",
                "It requires less calibration."
            ],
            correct: 1,
            explanation: "High-throughput screening relies on parallel processing. A 96-channel head can fill an entire standard microplate in one motion, whereas a single channel would take 96 separate motions.",
            difficulty: "easy"
        },
        {
            question: "Why is the Z-axis movement of the pipetting head highly critical?",
            options: [
                "To adjust the brightness of the UV sterilization lamp.",
                "To avoid crashing into plates while moving, and to reach the exact liquid depth for aspiration.",
                "To control the temperature of the deck.",
                "To read barcodes on the sides of the plates."
            ],
            correct: 1,
            explanation: "The Z-axis controls the vertical height. If it goes too low, the tips crash and bend. If it aspirates from the wrong depth, it might draw air or disturb the sample pellet.",
            difficulty: "medium"
        },
        {
            question: "What purpose does the protective safety enclosure serve?",
            options: [
                "It magnifies the microplates for better viewing.",
                "It cools the motors to prevent overheating.",
                "It provides a sterile, filtered environment (like a biosafety cabinet) and prevents operator injury.",
                "It acts as an antenna for Wi-Fi connectivity."
            ],
            correct: 2,
            explanation: "In automated liquid handling, preventing contamination from airborne particles is critical for PCR or cell cultures. It also acts as a physical barrier against fast-moving robotic arms.",
            difficulty: "easy"
        }
    ];

    function animate(time, speed, meshes) {
        const t = time * speed;
        
        // Y-axis (depth) movement
        const yPos = Math.sin(t * 0.5) * 5; 
        
        bridge.position.z = yPos;
        bridgeAccent.position.z = yPos;
        
        // X-axis (left/right) movement
        const xPos = Math.cos(t * 0.8) * 6;
        
        // Z-axis (up/down) - Dip into plates smoothly
        let zPos = 3; 
        const dipCycle = (t * 0.5) % Math.PI;
        if(dipCycle < 0.5 || dipCycle > Math.PI - 0.5) {
             zPos = 3 - Math.sin(dipCycle*2) * 1.5;
        }

        headGroup.position.set(xPos, zPos, yPos);
        
        // Make the neon display and tips pulse
        const pulse = (Math.sin(t * 5) + 1) / 2;
        headDisplay.material.emissiveIntensity = 0.2 + pulse * 0.8;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createAutomatedPipette() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
