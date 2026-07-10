import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Custom materials for glowing effects
    const neonBlue = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x0088ff,
        emissiveIntensity: 2,
        transparent: true,
        opacity: 0.8,
        metalness: 0.1,
        roughness: 0.1
    });

    const neonOrange = new THREE.MeshPhysicalMaterial({
        color: 0xffaa00,
        emissive: 0xff4400,
        emissiveIntensity: 1.5,
        metalness: 0.5,
        roughness: 0.2
    });

    const waterFlowMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00aaff,
        transparent: true,
        opacity: 0.3,
        transmission: 0.9,
        ior: 1.33,
        roughness: 0.1,
        emissive: 0x0044ff,
        emissiveIntensity: 0.2
    });

    // 1. Main Strut (Mast)
    const strutGeometry = new THREE.CylinderGeometry(0.5, 0.3, 8, 32, 1, false, 0, Math.PI * 2);
    strutGeometry.scale(0.3, 1, 1); // Make it an airfoil shape
    const strutMesh = new THREE.Mesh(strutGeometry, darkSteel);
    strutMesh.position.set(0, 0, 0);
    group.add(strutMesh);
    
    parts.push({
        name: "Main Strut Mast",
        description: "The primary vertical support structure, designed with a hydrodynamic airfoil profile to minimize drag.",
        material: "Titanium Alloy / Carbon Fiber",
        function: "Supports the vessel's weight and provides vertical separation from the water surface.",
        assemblyOrder: 1,
        connections: ["Fuselage Mount", "Main Foil"],
        failureEffect: "Complete loss of vessel support resulting in violent crash into the water.",
        cascadeFailures: ["Foil separation", "Fuselage structural damage"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 2, z: 0 },
        mesh: strutMesh
    });

    // 2. Fuselage Mount (Top Flange)
    const mountGeometry = new THREE.BoxGeometry(2, 0.4, 4);
    const mountMesh = new THREE.Mesh(mountGeometry, chrome);
    mountMesh.position.set(0, 4, 0);
    group.add(mountMesh);

    parts.push({
        name: "Fuselage Mount",
        description: "Heavy-duty mounting flange securing the strut to the vessel's hull.",
        material: "Machined Aluminum",
        function: "Transmits lift forces from the foil to the hull.",
        assemblyOrder: 2,
        connections: ["Main Strut Mast"],
        failureEffect: "Strut detachment and immediate hull impact.",
        cascadeFailures: ["Vessel sinking"],
        originalPosition: { x: 0, y: 4, z: 0 },
        explodedPosition: { x: 0, y: 6, z: 0 },
        mesh: mountMesh
    });

    // 3. Main Foil (Front Wing)
    const foilGeometry = new THREE.BoxGeometry(8, 0.2, 1.5);
    // Taper the wings
    const foilPositions = foilGeometry.attributes.position;
    for (let i = 0; i < foilPositions.count; i++) {
        let x = foilPositions.getX(i);
        let z = foilPositions.getZ(i);
        if (Math.abs(x) > 2) {
            foilPositions.setZ(i, z * 0.5);
        }
    }
    foilGeometry.computeVertexNormals();
    const foilMesh = new THREE.Mesh(foilGeometry, darkSteel);
    foilMesh.position.set(0, -4, 0.5);
    group.add(foilMesh);

    parts.push({
        name: "Main Lifting Foil",
        description: "The primary lifting surface operating underwater, generating lift via Bernoulli's principle.",
        material: "Carbon Fiber Composite",
        function: "Generates the upward force necessary to lift the hull out of the water.",
        assemblyOrder: 3,
        connections: ["Fuselage Torpedo"],
        failureEffect: "Loss of lift, causing the vessel to drop.",
        cascadeFailures: ["Stall condition", "Extreme pitch downward"],
        originalPosition: { x: 0, y: -4, z: 0.5 },
        explodedPosition: { x: 0, y: -5, z: 2 },
        mesh: foilMesh
    });

    // 4. Fuselage Torpedo (Bottom joint)
    const torpedoGeometry = new THREE.CylinderGeometry(0.4, 0.4, 4, 32);
    torpedoGeometry.rotateX(Math.PI / 2);
    const torpedoMesh = new THREE.Mesh(torpedoGeometry, chrome);
    torpedoMesh.position.set(0, -4, 0);
    group.add(torpedoMesh);

    parts.push({
        name: "Torpedo Hub",
        description: "Hydrodynamic junction box connecting the strut, main foil, and rear stabilizer.",
        material: "Chrome Plated Steel",
        function: "Houses trim actuators and provides a low-drag connection point.",
        assemblyOrder: 4,
        connections: ["Main Strut Mast", "Main Foil", "Rear Stabilizer Tube"],
        failureEffect: "Structural decoupling of lifting surfaces.",
        cascadeFailures: ["Loss of control", "Catastrophic foil failure"],
        originalPosition: { x: 0, y: -4, z: 0 },
        explodedPosition: { x: 0, y: -6, z: 0 },
        mesh: torpedoMesh
    });

    // 5. Rear Stabilizer Tube
    const tubeGeometry = new THREE.CylinderGeometry(0.15, 0.15, 3, 16);
    tubeGeometry.rotateX(Math.PI / 2);
    const tubeMesh = new THREE.Mesh(tubeGeometry, steel);
    tubeMesh.position.set(0, -4, -2.5);
    group.add(tubeMesh);

    parts.push({
        name: "Tail Boom",
        description: "Extension tube holding the rear stabilizer foil.",
        material: "High-tensile Steel",
        function: "Provides a moment arm for the stabilizer to control pitch.",
        assemblyOrder: 5,
        connections: ["Torpedo Hub", "Rear Stabilizer Foil"],
        failureEffect: "Loss of pitch stability.",
        cascadeFailures: ["Porpoising", "Violent pitch oscillations"],
        originalPosition: { x: 0, y: -4, z: -2.5 },
        explodedPosition: { x: 0, y: -6, z: -4 },
        mesh: tubeMesh
    });

    // 6. Rear Stabilizer Foil
    const rearFoilGeometry = new THREE.BoxGeometry(2.5, 0.1, 0.8);
    const rearFoilMesh = new THREE.Mesh(rearFoilGeometry, darkSteel);
    rearFoilMesh.position.set(0, -4, -4);
    group.add(rearFoilMesh);

    parts.push({
        name: "Rear Stabilizer Foil",
        description: "Smaller secondary wing at the rear of the assembly.",
        material: "Carbon Composite",
        function: "Maintains pitch stability and acts as an elevator for trim control.",
        assemblyOrder: 6,
        connections: ["Tail Boom"],
        failureEffect: "Uncontrollable pitch.",
        cascadeFailures: ["Stall", "Breach"],
        originalPosition: { x: 0, y: -4, z: -4 },
        explodedPosition: { x: 0, y: -5, z: -6 },
        mesh: rearFoilMesh
    });

    // 7. Active Flaps (Left and Right on Main Foil)
    const flapGeo = new THREE.BoxGeometry(3, 0.05, 0.4);
    
    const leftFlap = new THREE.Mesh(flapGeo, neonOrange);
    leftFlap.position.set(-2, -4, 1.2);
    group.add(leftFlap);

    parts.push({
        name: "Left Active Trim Flap",
        description: "Trailing edge control surface with high-visibility thermal coating.",
        material: "Active Composite",
        function: "Adjusts lift dynamically for roll and pitch control.",
        assemblyOrder: 7,
        connections: ["Main Foil"],
        failureEffect: "Asymmetric lift.",
        cascadeFailures: ["Unintended roll", "Capsize"],
        originalPosition: { x: -2, y: -4, z: 1.2 },
        explodedPosition: { x: -3, y: -4.5, z: 2.5 },
        mesh: leftFlap
    });

    const rightFlap = new THREE.Mesh(flapGeo, neonOrange);
    rightFlap.position.set(2, -4, 1.2);
    group.add(rightFlap);

    parts.push({
        name: "Right Active Trim Flap",
        description: "Trailing edge control surface with high-visibility thermal coating.",
        material: "Active Composite",
        function: "Adjusts lift dynamically for roll and pitch control.",
        assemblyOrder: 8,
        connections: ["Main Foil"],
        failureEffect: "Asymmetric lift.",
        cascadeFailures: ["Unintended roll", "Capsize"],
        originalPosition: { x: 2, y: -4, z: 1.2 },
        explodedPosition: { x: 3, y: -4.5, z: 2.5 },
        mesh: rightFlap
    });

    // 8. Cavitation Bubbles / Water Flow Effect
    const bubbleGeo = new THREE.SphereGeometry(0.1, 8, 8);
    const bubbles = new THREE.Group();
    for(let i = 0; i < 20; i++) {
        const bubble = new THREE.Mesh(bubbleGeo, neonBlue);
        bubble.position.set(
            (Math.random() - 0.5) * 8,
            -4 + (Math.random() - 0.5) * 0.5,
            -1 - Math.random() * 4
        );
        bubble.scale.setScalar(Math.random() * 0.5 + 0.5);
        bubbles.add(bubble);
    }
    group.add(bubbles);

    parts.push({
        name: "Cavitation Flow Field",
        description: "High-speed vapor bubbles generated in low-pressure zones.",
        material: "Water Vapor / Plasma",
        function: "Visualizes the hydrodynamic flow and low-pressure vortices.",
        assemblyOrder: 9,
        connections: [],
        failureEffect: "Excessive cavitation causes vibration and lift degradation.",
        cascadeFailures: ["Surface pitting", "Lift stall"],
        originalPosition: { x: 0, y: -4, z: -2 },
        explodedPosition: { x: 0, y: -2, z: -8 },
        mesh: bubbles
    });


    const description = "The Aero/Marine Hydrofoil Strut is an advanced hydrodynamic lift system designed to elevate a vessel's hull above the water, drastically reducing drag. It features a streamlined titanium mast, carbon composite main and stabilizer foils, and active trim flaps for dynamic stabilization. High-speed operation induces cavitation, visualized here as glowing vapor trails.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Main Lifting Foil?",
            options: [
                "To provide buoyancy when stationary",
                "To generate upward force (lift) via Bernoulli's principle",
                "To cool the engine",
                "To steer the vessel left and right"
            ],
            correct: 1,
            explanation: "The main foil has an aerodynamic (hydrodynamic) shape that forces water to flow faster over the top than the bottom, creating low pressure above and generating upward lift.",
            difficulty: "Easy"
        },
        {
            question: "Why does the strut have a tapered, blade-like cross-section?",
            options: [
                "To look aesthetically pleasing",
                "To minimize hydrodynamic drag as it slices through the water",
                "To reduce the weight of the material used",
                "To allow fish to bounce off safely"
            ],
            correct: 1,
            explanation: "The streamlined 'airfoil' shape minimizes form drag and delays flow separation, allowing the vessel to achieve much higher speeds efficiently.",
            difficulty: "Medium"
        },
        {
            question: "What is a negative consequence of excessive cavitation on the foil?",
            options: [
                "It makes the water glow blue",
                "It causes structural pitting and loss of lift (stall)",
                "It increases the lift beyond safety limits",
                "It creates excess buoyancy"
            ],
            correct: 1,
            explanation: "Cavitation involves the rapid formation and collapse of vapor bubbles. The collapse causes micro-jets that pit the metal surface, while the vapor layer degrades the smooth flow necessary for lift.",
            difficulty: "Hard"
        }
    ];

    const animate = (time, speed, meshes) => {
        // Animate the flaps
        const cycle = Math.sin(time * 2 * speed);
        leftFlap.rotation.x = cycle * 0.2;
        rightFlap.rotation.x = -cycle * 0.2; // Differential roll

        // Animate cavitation bubbles
        bubbles.children.forEach((bubble, idx) => {
            bubble.position.z -= speed * (0.1 + idx * 0.01);
            bubble.scale.setScalar(0.5 + Math.sin(time * 5 + idx) * 0.3);
            if (bubble.position.z < -6) {
                bubble.position.z = -1;
                bubble.position.x = (Math.random() - 0.5) * 8;
                bubble.position.y = -4 + (Math.random() - 0.5) * 0.5;
            }
        });
    };

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createHydrofoilStrut() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
