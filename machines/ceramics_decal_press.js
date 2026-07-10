import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Glowing Materials
    const neonOrange = new THREE.MeshStandardMaterial({
        color: 0xff5500,
        emissive: 0xff5500,
        emissiveIntensity: 0.8,
        metalness: 0.2,
        roughness: 0.2
    });

    const neonCyan = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        metalness: 0.1,
        roughness: 0.3
    });

    const heaterGlow = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0xff2200,
        emissiveIntensity: 1.5,
        metalness: 0.5,
        roughness: 0.5
    });

    // 1. Base Frame
    const baseGeo = new THREE.BoxGeometry(4, 0.5, 3);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.position.set(0, 0.25, 0);
    group.add(baseMesh);
    parts.push({
        name: "Main Frame Base",
        description: "Heavy-duty cast iron base providing stability against high-pressure pneumatic forces.",
        material: "darkSteel",
        function: "Structural support",
        assemblyOrder: 1,
        connections: ["Conveyor Belt", "Support Pillars"],
        failureEffect: "Machine vibration, misalignment of decals.",
        cascadeFailures: ["Decal Applicator", "Thermal Press Head"],
        originalPosition: { x: 0, y: 0.25, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 },
        mesh: baseMesh
    });

    // 2. Conveyor Belt
    const conveyorGeo = new THREE.BoxGeometry(5, 0.1, 1.5);
    const conveyorMesh = new THREE.Mesh(conveyorGeo, rubber);
    conveyorMesh.position.set(0, 0.55, 0);
    group.add(conveyorMesh);
    parts.push({
        name: "Ceramic Conveyor System",
        description: "Heat-resistant rubberized track for transporting ceramic plates into the pressing zone.",
        material: "rubber",
        function: "Transport",
        assemblyOrder: 2,
        connections: ["Main Frame Base", "Drive Motor"],
        failureEffect: "Plates jam or move inconsistently.",
        cascadeFailures: ["Drive Motor", "Plates"],
        originalPosition: { x: 0, y: 0.55, z: 0 },
        explodedPosition: { x: -3, y: 0.55, z: 0 },
        mesh: conveyorMesh
    });

    // 3. Support Pillars
    const pillarGeo = new THREE.CylinderGeometry(0.15, 0.15, 3, 16);
    const pillarPositions = [
        [-1.5, 2, -1],
        [1.5, 2, -1],
        [-1.5, 2, 1],
        [1.5, 2, 1]
    ];
    
    const pillarsMesh = new THREE.Group();
    pillarPositions.forEach(pos => {
        const pillar = new THREE.Mesh(pillarGeo, chrome);
        pillar.position.set(pos[0], pos[1], pos[2]);
        pillarsMesh.add(pillar);
    });
    group.add(pillarsMesh);
    parts.push({
        name: "Pneumatic Support Pillars",
        description: "Chromed steel pillars that guide the vertical motion of the thermal press head.",
        material: "chrome",
        function: "Guidance & Support",
        assemblyOrder: 3,
        connections: ["Main Frame Base", "Thermal Press Head"],
        failureEffect: "Press head tilts, uneven decal application.",
        cascadeFailures: ["Thermal Press Head"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 2, z: -3 },
        mesh: pillarsMesh
    });

    // 4. Decal Spool
    const spoolGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.2, 32);
    spoolGeo.rotateX(Math.PI / 2);
    const spoolMesh = new THREE.Mesh(spoolGeo, aluminum);
    spoolMesh.position.set(-1.5, 3, 0);
    group.add(spoolMesh);
    parts.push({
        name: "Decal Film Spool",
        description: "Holds the roll of heat-transfer decals, feeding them into the applicator mechanism.",
        material: "aluminum",
        function: "Material Supply",
        assemblyOrder: 4,
        connections: ["Support Pillars", "Tension Rollers"],
        failureEffect: "Decal film snaps or feeds loosely.",
        cascadeFailures: ["Decal Applicator"],
        originalPosition: { x: -1.5, y: 3, z: 0 },
        explodedPosition: { x: -4, y: 4, z: 0 },
        mesh: spoolMesh
    });

    // Glowing Decal Material on Spool
    const decalFilmGeo = new THREE.CylinderGeometry(0.42, 0.42, 1.1, 32);
    decalFilmGeo.rotateX(Math.PI / 2);
    const decalFilmMesh = new THREE.Mesh(decalFilmGeo, neonCyan);
    decalFilmMesh.position.set(-1.5, 3, 0);
    group.add(decalFilmMesh);

    // 5. Thermal Press Head
    const pressGeo = new THREE.BoxGeometry(1.5, 0.5, 1.5);
    const pressMesh = new THREE.Mesh(pressGeo, steel);
    pressMesh.position.set(0, 2.5, 0);
    group.add(pressMesh);
    parts.push({
        name: "Thermal Press Head",
        description: "High-temperature steel plate that applies heat and pressure to transfer the decal onto the ceramic.",
        material: "steel",
        function: "Heat Transfer",
        assemblyOrder: 5,
        connections: ["Support Pillars", "Heating Elements", "Pneumatic Actuator"],
        failureEffect: "Fails to reach operating temperature, weak transfer.",
        cascadeFailures: ["Heating Elements"],
        originalPosition: { x: 0, y: 2.5, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 },
        mesh: pressMesh
    });

    // Glowing Heating Element inside Press Head
    const heaterPlaneGeo = new THREE.PlaneGeometry(1.4, 1.4);
    heaterPlaneGeo.rotateX(-Math.PI / 2);
    const heaterPlaneMesh = new THREE.Mesh(heaterPlaneGeo, heaterGlow);
    heaterPlaneMesh.position.set(0, 2.24, 0);
    group.add(heaterPlaneMesh);

    // 6. Pneumatic Actuator
    const actuatorGeo = new THREE.CylinderGeometry(0.3, 0.3, 1, 16);
    const actuatorMesh = new THREE.Mesh(actuatorGeo, copper);
    actuatorMesh.position.set(0, 3.25, 0);
    group.add(actuatorMesh);
    parts.push({
        name: "Pneumatic Actuator",
        description: "Drives the thermal press head downward with high precision and force.",
        material: "copper",
        function: "Actuation",
        assemblyOrder: 6,
        connections: ["Thermal Press Head", "Air Compressor Line"],
        failureEffect: "Insufficient pressure, decals do not stick.",
        cascadeFailures: ["Thermal Press Head"],
        originalPosition: { x: 0, y: 3.25, z: 0 },
        explodedPosition: { x: 0, y: 6, z: 0 },
        mesh: actuatorMesh
    });

    // 7. Control Interface (Glass Panel)
    const panelGeo = new THREE.BoxGeometry(0.8, 0.5, 0.1);
    const panelMesh = new THREE.Mesh(panelGeo, tinted);
    panelMesh.position.set(1.5, 2.8, 1);
    panelMesh.rotation.x = -Math.PI / 6;
    group.add(panelMesh);
    
    const screenGeo = new THREE.PlaneGeometry(0.7, 0.4);
    const screenMesh = new THREE.Mesh(screenGeo, neonOrange);
    screenMesh.position.set(1.5, 2.8, 1.06);
    screenMesh.rotation.x = -Math.PI / 6;
    group.add(screenMesh);
    
    parts.push({
        name: "HMI Control Panel",
        description: "Holographic touch interface for setting temperature, pressure, and timing parameters.",
        material: "tinted",
        function: "Operator Interface",
        assemblyOrder: 7,
        connections: ["Main Frame Base", "Logic Controller"],
        failureEffect: "Inability to change parameters, display errors.",
        cascadeFailures: [],
        originalPosition: { x: 1.5, y: 2.8, z: 1 },
        explodedPosition: { x: 4, y: 3, z: 3 },
        mesh: panelMesh
    });

    // 8. Ceramic Plate (Target)
    const plateGeo = new THREE.CylinderGeometry(0.5, 0.4, 0.05, 32);
    const plateMesh = new THREE.Mesh(plateGeo, plastic); // Using plastic for white shiny look
    plateMesh.position.set(0, 0.625, 0);
    group.add(plateMesh);
    parts.push({
        name: "Ceramic Plate",
        description: "The product being manufactured. Spins slightly to align perfectly with the incoming decal.",
        material: "plastic",
        function: "Target Product",
        assemblyOrder: 8,
        connections: ["Conveyor Belt"],
        failureEffect: "Misaligned product.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0.625, z: 0 },
        explodedPosition: { x: 0, y: 0.625, z: 4 },
        mesh: plateMesh
    });

    const description = "The Ceramics Decal Press is a high-heat transfer printing system used to apply complex graphics onto ceramic wares. It utilizes a precision pneumatic actuator to lower a high-temperature steel thermal press head onto the target. The heat activates special adhesives on a continuous film spool (glowing cyan), permanently bonding the decal to the ceramic surface.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Thermal Press Head in this machine?",
            options: [
                "To cool the ceramic plate before application.",
                "To apply heat and pressure to transfer the decal.",
                "To rotate the spool of decal film.",
                "To cut the ceramic plate into shape."
            ],
            correct: 1,
            explanation: "The Thermal Press Head heats up and presses down firmly to activate the adhesive on the decal film, ensuring it bonds permanently to the ceramic.",
            difficulty: "easy"
        },
        {
            question: "Why does the machine utilize a Pneumatic Actuator rather than a simple motorized screw?",
            options: [
                "Because pneumatics are quieter than motors.",
                "To provide rapid, uniform, and controllable high-pressure application.",
                "Because pneumatics do not require electricity.",
                "To save weight in the machine's overall construction."
            ],
            correct: 1,
            explanation: "Pneumatic actuators allow for very rapid deployment while maintaining a consistent, evenly distributed force over the pressing surface, which is critical for decal application.",
            difficulty: "medium"
        },
        {
            question: "If the Decal Film Spool tension mechanism fails, what is the most likely cascading failure?",
            options: [
                "The Thermal Press Head will overheat.",
                "The Conveyor Belt will stop moving.",
                "The decal film will feed loosely, causing misaligned or wrinkled application.",
                "The HMI Control Panel will short circuit."
            ],
            correct: 2,
            explanation: "Improper tension on the film spool directly affects the presentation of the decal under the press head, leading to wrinkles, folds, or misalignment on the final ceramic plate.",
            difficulty: "hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Animation logic
        // Spool rotates continuously
        spoolMesh.rotation.x = time * speed;
        decalFilmMesh.rotation.x = time * speed;

        // Plate spins slowly to align
        plateMesh.rotation.y = time * speed * 0.5;
        
        // Pneumatic press goes up and down periodically
        const pressCycle = Math.sin(time * speed * 2);
        // Map sine from [-1, 1] to [0.65, 2.5]
        const pressY = 2.5 - Math.max(0, pressCycle * 1.85); // Press goes down when sin > 0
        pressMesh.position.y = pressY;
        heaterPlaneMesh.position.y = pressY - 0.26;
        
        // Actuator rod stretches/moves
        // To simplify, we just move the actuator or scale it
        actuatorMesh.scale.y = 1 + Math.max(0, pressCycle * 1.85);
        actuatorMesh.position.y = 3.25 - (Math.max(0, pressCycle * 1.85) / 2);
        
        // Screen flicker effect
        screenMesh.material.emissiveIntensity = 0.8 + Math.sin(time * 10) * 0.2;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createDecalPress() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
