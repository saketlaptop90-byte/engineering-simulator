import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const neonGreen = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 0.8,
        roughness: 0.2,
        metalness: 0.8
    });
    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 0.8,
        roughness: 0.2,
        metalness: 0.8
    });
    const neonYellow = new THREE.MeshStandardMaterial({
        color: 0xffff00,
        emissive: 0xffff00,
        emissiveIntensity: 0.5,
        roughness: 0.4,
        metalness: 0.5
    });

    // 1. Base Plate
    const baseGeo = new THREE.BoxGeometry(10, 0.5, 6);
    const base = new THREE.Mesh(baseGeo, darkSteel);
    base.position.set(0, -0.25, 0);
    group.add(base);
    parts.push({
        name: 'Base Plate',
        description: 'Heavy steel base anchoring the switch mechanism to the ground.',
        material: 'darkSteel',
        function: 'Structural support',
        assemblyOrder: 1,
        connections: ['Fixed Rails', 'Drive Motor'],
        failureEffect: 'Misalignment of entire switch mechanism',
        cascadeFailures: ['Train derailment'],
        originalPosition: { x: 0, y: -0.25, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 }
    });

    // 2. Fixed Rails (Main Line)
    const fixedRailGeo = new THREE.BoxGeometry(10, 0.4, 0.2);
    const fixedRailL = new THREE.Mesh(fixedRailGeo, steel);
    fixedRailL.position.set(0, 0.2, -1.5);
    const fixedRailR = new THREE.Mesh(fixedRailGeo, steel);
    fixedRailR.position.set(0, 0.2, 1.5);
    group.add(fixedRailL);
    group.add(fixedRailR);
    parts.push({
        name: 'Fixed Rails',
        description: 'Stationary rails of the main line.',
        material: 'steel',
        function: 'Guide train wheels continuously on the main path.',
        assemblyOrder: 2,
        connections: ['Base Plate', 'Switch Blades'],
        failureEffect: 'Disruption of main line traffic',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0.2, z: 0 },
        explodedPosition: { x: 0, y: 0.5, z: -3 }
    });

    // 3. Switch Blades (Movable Rails)
    // Create a sub-group for the moving parts
    const switchBladesGroup = new THREE.Group();
    const bladeGeo = new THREE.BoxGeometry(4, 0.4, 0.15);
    
    // Left blade
    const bladeL = new THREE.Mesh(bladeGeo, chrome);
    bladeL.position.set(0, 0.2, -1.35); // Close to left rail
    // Right blade
    const bladeR = new THREE.Mesh(bladeGeo, chrome);
    bladeR.position.set(0, 0.2, 1.35); // Close to right rail
    
    switchBladesGroup.add(bladeL);
    switchBladesGroup.add(bladeR);
    group.add(switchBladesGroup);

    parts.push({
        name: 'Switch Blades',
        description: 'Tapered movable rails that guide wheels onto the diverging track.',
        material: 'chrome',
        function: 'Shift laterally to change the train routing.',
        assemblyOrder: 3,
        connections: ['Fixed Rails', 'Throwbar'],
        failureEffect: 'Incomplete track switch',
        cascadeFailures: ['Derailment', 'Mechanism jamming'],
        originalPosition: { x: 0, y: 0.2, z: 0 },
        explodedPosition: { x: 0, y: 1.5, z: 0 },
        meshRef: switchBladesGroup
    });

    // 4. Throwbar (Tie rod)
    const throwbarGeo = new THREE.BoxGeometry(0.2, 0.1, 3);
    const throwbar = new THREE.Mesh(throwbarGeo, aluminum);
    throwbar.position.set(-1.5, 0.05, 0);
    switchBladesGroup.add(throwbar); // Moves with the blades
    parts.push({
        name: 'Throwbar',
        description: 'Rod connecting both switch blades to ensure they move together.',
        material: 'aluminum',
        function: 'Maintains fixed gauge between movable blades.',
        assemblyOrder: 4,
        connections: ['Switch Blades', 'Switch Motor Rod'],
        failureEffect: 'Blades move independently',
        cascadeFailures: ['Gauge widening derailment'],
        originalPosition: { x: -1.5, y: 0.05, z: 0 },
        explodedPosition: { x: -1.5, y: 2, z: 0 }
    });

    // 5. Electric Switch Motor Housing
    const motorHousingGeo = new THREE.BoxGeometry(1.5, 1, 1.5);
    const motorHousing = new THREE.Mesh(motorHousingGeo, darkSteel);
    motorHousing.position.set(-1.5, 0.5, 2.5);
    group.add(motorHousing);
    parts.push({
        name: 'Switch Motor Housing',
        description: 'Protective casing for the electric actuator and locking mechanism.',
        material: 'darkSteel',
        function: 'Protects internal electronics from weather and debris.',
        assemblyOrder: 5,
        connections: ['Base Plate', 'Throwbar', 'Control Cable'],
        failureEffect: 'Exposure to elements',
        cascadeFailures: ['Motor short circuit', 'Jammed gears'],
        originalPosition: { x: -1.5, y: 0.5, z: 2.5 },
        explodedPosition: { x: -3, y: 1, z: 4 }
    });

    // 6. Signal Indicator (Glowing)
    const signalMastGeo = new THREE.CylinderGeometry(0.1, 0.1, 2);
    const signalMast = new THREE.Mesh(signalMastGeo, steel);
    signalMast.position.set(2, 1, 2.5);
    group.add(signalMast);

    const signalLightGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const signalLight = new THREE.Mesh(signalLightGeo, neonGreen);
    signalLight.position.set(2, 2.2, 2.5);
    group.add(signalLight);

    parts.push({
        name: 'Signal Indicator',
        description: 'Visual confirmation of the track switch status.',
        material: 'neon',
        function: 'Displays green for straight line, yellow/red for diverging.',
        assemblyOrder: 6,
        connections: ['Switch Motor'],
        failureEffect: 'Lack of visual status for engineers',
        cascadeFailures: ['Operator error'],
        originalPosition: { x: 2, y: 1, z: 2.5 },
        explodedPosition: { x: 4, y: 3, z: 4 },
        meshRef: signalLight,
        extraData: { greenMat: neonGreen, yellowMat: neonYellow }
    });

    const description = "An automated railway track switch (turnout) mechanism featuring movable switch blades, an electric switch motor, and a glowing signal indicator. It demonstrates the lateral shifting required to divert trains to a different track.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Throwbar?",
            options: [
                "To power the switch motor",
                "To connect both switch blades ensuring they move synchronously",
                "To lock the train to the tracks",
                "To provide visual signals to the train operator"
            ],
            correct: 1,
            explanation: "The throwbar is a tie rod that connects the two movable switch blades, keeping them at a precise distance (gauge) from each other so they shift together.",
            difficulty: "Medium"
        },
        {
            question: "If the Switch Motor Housing is severely damaged, what is the most likely cascading failure?",
            options: [
                "The fixed rails will warp",
                "The base plate will sink into the ballast",
                "The internal electronics and gears are exposed, leading to a short circuit or jamming",
                "The signal light will immediately turn blue"
            ],
            correct: 2,
            explanation: "The housing protects the sensitive electro-mechanical components. Damage exposes them to weather and debris.",
            difficulty: "Easy"
        },
        {
            question: "Why must the Switch Blades be tapered at the ends?",
            options: [
                "To look aerodynamic",
                "To reduce the weight of the track",
                "To fit snugly against the fixed rails, providing a smooth transition for train wheel flanges",
                "To allow thermal expansion during summer"
            ],
            correct: 2,
            explanation: "Tapered blades lie flush against the stock (fixed) rail, preventing the train's wheel flange from striking a blunt edge and causing a derailment.",
            difficulty: "Hard"
        }
    ];

    let bladeOffset = 0;

    const animate = (time, speed, meshes) => {
        // Find the switch blades group and signal light in meshes
        let switchBlades = null;
        let signal = null;

        for (const p of parts) {
            if (p.name === 'Switch Blades') {
                switchBlades = p.meshRef;
            }
            if (p.name === 'Signal Indicator') {
                signal = p;
            }
        }

        if (switchBlades) {
            // Animate blades moving side to side
            const cycle = (time * speed * 0.001) % (Math.PI * 2);
            // shift between -0.15 and +0.15
            bladeOffset = Math.sin(cycle) * 0.15;
            switchBlades.position.z = bladeOffset;

            // Change signal color based on position
            if (signal && signal.meshRef) {
                if (bladeOffset > 0.05) {
                    signal.meshRef.material = signal.extraData.yellowMat;
                } else if (bladeOffset < -0.05) {
                    signal.meshRef.material = signal.extraData.greenMat;
                } else {
                    signal.meshRef.material = signal.extraData.yellowMat;
                }
            }
        }
    };

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createTrackSwitch() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
