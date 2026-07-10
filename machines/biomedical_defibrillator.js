import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const neonBlueMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00aaff,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.9,
        roughness: 0.1,
        metalness: 0.8
    });

    const neonRedMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.5
    });
    
    const displayMaterial = new THREE.MeshStandardMaterial({
        color: 0x0a0a0a,
        emissive: 0x0a2211,
        emissiveIntensity: 0.8,
        roughness: 0.1,
        metalness: 0.1
    });

    // Helper to create basic shapes
    const createPart = (geom, mat, name, desc, func, p, ep, ao, conn, fe, cf) => {
        const mesh = new THREE.Mesh(geom, mat);
        mesh.position.set(p.x, p.y, p.z);
        mesh.userData = { originalPosition: p, explodedPosition: ep };
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        group.add(mesh);

        parts.push({
            name,
            description: desc,
            material: mat.name || 'custom',
            function: func,
            assemblyOrder: ao,
            connections: conn,
            failureEffect: fe,
            cascadeFailures: cf,
            originalPosition: p,
            explodedPosition: ep,
            mesh: mesh
        });
        
        return mesh;
    };

    // 1. Main Casing (Plastic)
    createPart(
        new THREE.BoxGeometry(4, 2.5, 3),
        plastic,
        "Main Housing",
        "Durable, insulated plastic casing.",
        "Protects internal components and provides electrical insulation.",
        { x: 0, y: 1.25, z: 0 },
        { x: 0, y: 3, z: 0 },
        1,
        ["Capacitor Bank", "Power Supply", "Logic Board"],
        "Exposure of high-voltage components.",
        ["Electric Shock", "Environmental Damage"]
    );

    // 2. Main Screen/Display (Glass/Tinted)
    createPart(
        new THREE.BoxGeometry(3, 1.5, 0.2),
        displayMaterial,
        "ECG Monitor Display",
        "High-resolution LCD display.",
        "Displays heart rhythm (ECG) and charge status.",
        { x: 0, y: 1.5, z: 1.51 },
        { x: 0, y: 1.5, z: 3 },
        2,
        ["Logic Board"],
        "Loss of visual feedback.",
        ["Incorrect Shock Timing"]
    );

    // 3. Massive Internal Capacitors (Neon/Glowing)
    createPart(
        new THREE.CylinderGeometry(0.5, 0.5, 1.5, 32),
        neonBlueMaterial,
        "High-Voltage Capacitor A",
        "Stores large amounts of electrical energy.",
        "Releases stored energy rapidly for the shock.",
        { x: -1, y: 1.25, z: -0.5 },
        { x: -2, y: 1.25, z: -2 },
        3,
        ["Power Supply", "Discharge Relay"],
        "Inability to hold charge.",
        ["Failure to shock"]
    );
    
    createPart(
        new THREE.CylinderGeometry(0.5, 0.5, 1.5, 32),
        neonBlueMaterial,
        "High-Voltage Capacitor B",
        "Stores large amounts of electrical energy.",
        "Releases stored energy rapidly for the shock.",
        { x: 1, y: 1.25, z: -0.5 },
        { x: 2, y: 1.25, z: -2 },
        4,
        ["Power Supply", "Discharge Relay"],
        "Inability to hold charge.",
        ["Failure to shock"]
    );

    // 4. Power Supply / Battery (Dark Steel)
    createPart(
        new THREE.BoxGeometry(1.5, 1, 1),
        darkSteel,
        "Battery Pack",
        "High-capacity lithium-ion battery.",
        "Provides portable power for the device.",
        { x: 0, y: 0.6, z: 0 },
        { x: 0, y: -1, z: 0 },
        5,
        ["Capacitor Bank", "Logic Board"],
        "Device won't power on.",
        ["Total System Failure"]
    );

    // 5. Logic Board (Copper/Circuitry)
    createPart(
        new THREE.BoxGeometry(2, 0.1, 1.5),
        copper,
        "Control Logic Board",
        "Microprocessor and circuitry.",
        "Analyzes ECG and controls charge/discharge timing.",
        { x: 0, y: 2.2, z: 0 },
        { x: 0, y: 4, z: 0 },
        6,
        ["ECG Monitor Display", "Capacitor Bank"],
        "Erratic behavior or no operation.",
        ["Improper Shock Delivery"]
    );

    // 6. Paddles / Electrodes (Rubber and Chrome)
    createPart(
        new THREE.BoxGeometry(0.8, 0.3, 1),
        chrome,
        "Left Paddle Metal Base",
        "Conductive metal surface.",
        "Transfers electrical energy to the patient's skin.",
        { x: -2.5, y: 0.15, z: 1 },
        { x: -4, y: 0.15, z: 3 },
        7,
        ["Left Paddle Handle", "Cables"],
        "Poor electrical contact.",
        ["Skin Burns", "Ineffective Shock"]
    );

    createPart(
        new THREE.CylinderGeometry(0.2, 0.2, 1, 16),
        rubber,
        "Left Paddle Handle",
        "Insulated rubber handle.",
        "Allows safe handling by the operator.",
        { x: -2.5, y: 0.8, z: 1 },
        { x: -4, y: 2, z: 3 },
        8,
        ["Left Paddle Metal Base", "Discharge Button"],
        "Electrical shock to operator.",
        ["Operator Injury"]
    );

    createPart(
        new THREE.BoxGeometry(0.8, 0.3, 1),
        chrome,
        "Right Paddle Metal Base",
        "Conductive metal surface.",
        "Transfers electrical energy to the patient's skin.",
        { x: 2.5, y: 0.15, z: 1 },
        { x: 4, y: 0.15, z: 3 },
        9,
        ["Right Paddle Handle", "Cables"],
        "Poor electrical contact.",
        ["Skin Burns", "Ineffective Shock"]
    );

    createPart(
        new THREE.CylinderGeometry(0.2, 0.2, 1, 16),
        rubber,
        "Right Paddle Handle",
        "Insulated rubber handle.",
        "Allows safe handling by the operator.",
        { x: 2.5, y: 0.8, z: 1 },
        { x: 4, y: 2, z: 3 },
        10,
        ["Right Paddle Metal Base", "Discharge Button"],
        "Electrical shock to operator.",
        ["Operator Injury"]
    );

    // 7. Cables (Rubber)
    createPart(
        new THREE.CylinderGeometry(0.05, 0.05, 2.5, 8),
        rubber,
        "Defibrillation Cables",
        "Thickly insulated high-voltage wires.",
        "Carries current from capacitors to paddles.",
        { x: -1.25, y: 0.5, z: 1.5 },
        { x: -2, y: 0.5, z: 4 },
        11,
        ["Main Casing", "Paddles"],
        "Short circuit or open circuit.",
        ["No energy delivery", "Sparks"]
    );

    const description = "A high-tech biomedical defibrillator designed to deliver a therapeutic dose of electrical energy to the heart to treat life-threatening cardiac arrhythmias.";

    const quizQuestions = [
        {
            question: "What is the primary function of the massive internal capacitors?",
            options: ["To store and rapidly release electrical energy.", "To process the ECG signals.", "To provide continuous low-voltage power.", "To cool the internal components."],
            correct: 0,
            explanation: "Capacitors can store electrical energy and discharge it much faster than a battery, which is necessary to deliver the sudden, massive shock required for defibrillation.",
            difficulty: "Medium"
        },
        {
            question: "Why is it critical for the paddle handles to be made of an insulating material like rubber?",
            options: ["To make them lighter.", "To prevent the operator from receiving the high-voltage shock.", "To improve the grip.", "To prevent interference with the ECG signal."],
            correct: 1,
            explanation: "The handles must be insulated to ensure the high-voltage electricity is delivered only to the patient and not to the medical professional operating the device.",
            difficulty: "Easy"
        },
        {
            question: "What is the role of the Logic Board in a defibrillator?",
            options: ["It generates the electricity.", "It converts AC to DC.", "It analyzes the patient's heart rhythm and controls the exact timing and dosage of the shock.", "It physically connects the cables to the paddles."],
            correct: 2,
            explanation: "The logic board serves as the 'brain', analyzing ECG data to determine if a shock is advisable and managing the precise timing and energy level of the discharge.",
            difficulty: "Medium"
        }
    ];

    let chargeCycle = 0;

    const animate = (time, speed, meshes) => {
        // Animate the capacitors glowing/pulsing to simulate charging/discharging
        chargeCycle += speed * 0.05;
        
        // Simulating a charge-up and sudden shock discharge
        const intensity = (Math.sin(chargeCycle) * 0.5 + 0.5); 
        const isDischarging = Math.sin(chargeCycle) > 0.95;

        parts.forEach((part) => {
            if (part.name.includes("Capacitor")) {
                if (isDischarging) {
                    part.mesh.material.emissiveIntensity = 2.0;
                    part.mesh.material.emissive.setHex(0xffffff); // Flash white on shock
                } else {
                    part.mesh.material.emissiveIntensity = 0.2 + intensity * 0.8;
                    part.mesh.material.emissive.setHex(0x00aaff); // Normal charging neon blue
                }
            }
            if (part.name === "ECG Monitor Display") {
                // Flash the screen slightly during shock
                part.mesh.material.emissiveIntensity = isDischarging ? 1.5 : 0.8 + Math.random() * 0.1;
            }
        });
    };

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createPortableDefibrillator() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
