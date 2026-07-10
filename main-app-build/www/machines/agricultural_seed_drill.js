import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const neonGreen = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 0.8,
        metalness: 0.2,
        roughness: 0.2
    });

    const neonCyan = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 1.0,
        metalness: 0.8,
        roughness: 0.1
    });

    const neonOrange = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0xff6600,
        emissiveIntensity: 0.6,
        metalness: 0.5,
        roughness: 0.4
    });

    // 1. Main Frame
    const frameGeo = new THREE.BoxGeometry(4, 0.4, 2);
    const frame = new THREE.Mesh(frameGeo, darkSteel);
    frame.position.set(0, 1.5, 0);
    group.add(frame);
    parts.push({
        name: 'Main Frame',
        description: 'Heavy-duty steel chassis holding all functional modules.',
        material: 'darkSteel',
        function: 'Provides structural integrity for the entire drill.',
        assemblyOrder: 1,
        connections: ['Seed Hopper', 'Drive Wheels', 'Coulters'],
        failureEffect: 'Misalignment of seeding mechanisms, total drill failure.',
        cascadeFailures: ['Seed Hopper', 'Coulters', 'Drive Wheels'],
        originalPosition: { x: 0, y: 1.5, z: 0 },
        explodedPosition: { x: 0, y: 3, z: 0 },
        mesh: frame
    });

    // 2. Seed Hopper (Container)
    const hopperGeo = new THREE.CylinderGeometry(0.8, 0.5, 1.5, 8);
    const hopper = new THREE.Mesh(hopperGeo, chrome);
    hopper.position.set(-1, 2.5, 0);
    hopper.rotation.z = Math.PI / 2;
    group.add(hopper);
    parts.push({
        name: 'Seed Hopper',
        description: 'Aero-dynamic high-capacity container for storing seeds.',
        material: 'chrome',
        function: 'Stores seeds and feeds them into the metering mechanism.',
        assemblyOrder: 2,
        connections: ['Main Frame', 'Seed Metering Unit'],
        failureEffect: 'Seed starvation, causing empty rows.',
        cascadeFailures: ['Seed Metering Unit', 'Seed Tubes'],
        originalPosition: { x: -1, y: 2.5, z: 0 },
        explodedPosition: { x: -2, y: 5, z: 0 },
        mesh: hopper
    });

    // 3. Seed Metering Unit (Glowing/High Tech)
    const meterGeo = new THREE.TorusGeometry(0.3, 0.1, 16, 32);
    const meter = new THREE.Mesh(meterGeo, neonCyan);
    meter.position.set(-1, 1.5, 0.8);
    meter.rotation.x = Math.PI / 2;
    group.add(meter);
    parts.push({
        name: 'Seed Metering Unit',
        description: 'Precision electronic seed metering disc with laser sensors.',
        material: 'neonCyan',
        function: 'Regulates the exact flow and spacing of seeds.',
        assemblyOrder: 3,
        connections: ['Seed Hopper', 'Seed Tubes', 'Main Frame'],
        failureEffect: 'Inconsistent seed spacing, overlapping or gaps.',
        cascadeFailures: ['Crop Yield'],
        originalPosition: { x: -1, y: 1.5, z: 0.8 },
        explodedPosition: { x: -1, y: 1.5, z: 3 },
        mesh: meter
    });

    // 4. Drive Wheels (Two wheels)
    const wheelGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.4, 32);
    const wheel1 = new THREE.Mesh(wheelGeo, rubber);
    wheel1.position.set(1.5, 0.8, 1.2);
    wheel1.rotation.x = Math.PI / 2;
    group.add(wheel1);
    
    const wheel2 = new THREE.Mesh(wheelGeo, rubber);
    wheel2.position.set(1.5, 0.8, -1.2);
    wheel2.rotation.x = Math.PI / 2;
    group.add(wheel2);

    const wheelsGroup = new THREE.Group();
    wheelsGroup.add(wheel1, wheel2);
    
    parts.push({
        name: 'Drive Wheels',
        description: 'High-traction rubber wheels with internal motors.',
        material: 'rubber',
        function: 'Drives the drill forward and mechanically powers the metering unit.',
        assemblyOrder: 4,
        connections: ['Main Frame', 'Transmission Shaft'],
        failureEffect: 'Loss of mobility, seeding stops entirely.',
        cascadeFailures: ['Seed Metering Unit'],
        originalPosition: { x: 1.5, y: 0.8, z: 0 },
        explodedPosition: { x: 4, y: 0.8, z: 0 },
        mesh: wheelsGroup
    });

    // 5. Coulters (Discs that cut soil)
    const coulterGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.05, 32);
    const coulter1 = new THREE.Mesh(coulterGeo, steel);
    coulter1.position.set(-1.5, 0.5, 0.5);
    coulter1.rotation.x = Math.PI / 2;
    group.add(coulter1);
    
    const coulter2 = new THREE.Mesh(coulterGeo, steel);
    coulter2.position.set(-1.5, 0.5, -0.5);
    coulter2.rotation.x = Math.PI / 2;
    group.add(coulter2);

    const coulterGroup = new THREE.Group();
    coulterGroup.add(coulter1, coulter2);

    parts.push({
        name: 'Coulter Discs',
        description: 'Razor-sharp steel discs that slice through crop residue and topsoil.',
        material: 'steel',
        function: 'Opens a trench in the soil for seed placement.',
        assemblyOrder: 5,
        connections: ['Main Frame', 'Seed Tubes'],
        failureEffect: 'Seeds placed on the surface, drastically lowering germination rate.',
        cascadeFailures: ['Press Wheels'],
        originalPosition: { x: -1.5, y: 0.5, z: 0 },
        explodedPosition: { x: -1.5, y: -2, z: 0 },
        mesh: coulterGroup
    });

    // 6. Seed Tubes (Glowing)
    const tubeGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.2, 8);
    const tube1 = new THREE.Mesh(tubeGeo, neonGreen);
    tube1.position.set(-1.5, 1.1, 0.5);
    group.add(tube1);

    const tube2 = new THREE.Mesh(tubeGeo, neonGreen);
    tube2.position.set(-1.5, 1.1, -0.5);
    group.add(tube2);

    const tubeGroup = new THREE.Group();
    tubeGroup.add(tube1, tube2);

    parts.push({
        name: 'Seed Delivery Tubes',
        description: 'Transparent tubes with neon particle tracking.',
        material: 'neonGreen',
        function: 'Guides seeds securely from the metering unit to the trench.',
        assemblyOrder: 6,
        connections: ['Seed Metering Unit', 'Coulter Discs'],
        failureEffect: 'Seed scatter and wastage outside the trench.',
        cascadeFailures: [],
        originalPosition: { x: -1.5, y: 1.1, z: 0 },
        explodedPosition: { x: -3, y: 1.1, z: 0 },
        mesh: tubeGroup
    });

    // 7. Press Wheels
    const pressWheelGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
    const pressWheel1 = new THREE.Mesh(pressWheelGeo, rubber);
    pressWheel1.position.set(-2.5, 0.3, 0.5);
    pressWheel1.rotation.x = Math.PI / 2;
    group.add(pressWheel1);

    const pressWheel2 = new THREE.Mesh(pressWheelGeo, rubber);
    pressWheel2.position.set(-2.5, 0.3, -0.5);
    pressWheel2.rotation.x = Math.PI / 2;
    group.add(pressWheel2);

    const pressWheelGroup = new THREE.Group();
    pressWheelGroup.add(pressWheel1, pressWheel2);

    parts.push({
        name: 'Press Wheels',
        description: 'Heavy rubber rollers trailing behind the seed tubes.',
        material: 'rubber',
        function: 'Closes the trench and compacts soil over the seeds for good soil-to-seed contact.',
        assemblyOrder: 7,
        connections: ['Main Frame'],
        failureEffect: 'Seeds left exposed to birds and weather, causing poor emergence.',
        cascadeFailures: [],
        originalPosition: { x: -2.5, y: 0.3, z: 0 },
        explodedPosition: { x: -5, y: 0.3, z: 0 },
        mesh: pressWheelGroup
    });

    // 8. Control Node (Neon Orange)
    const nodeGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const nodeMesh = new THREE.Mesh(nodeGeo, neonOrange);
    nodeMesh.position.set(0, 1.8, 0);
    group.add(nodeMesh);

    parts.push({
        name: 'AI Control Node',
        description: 'Central processing unit with advanced agronomic AI.',
        material: 'neonOrange',
        function: 'Monitors soil depth, seed rate, and GPS guidance.',
        assemblyOrder: 8,
        connections: ['Main Frame', 'Seed Metering Unit'],
        failureEffect: 'Loss of variable rate control and telemetry.',
        cascadeFailures: ['Seed Metering Unit'],
        originalPosition: { x: 0, y: 1.8, z: 0 },
        explodedPosition: { x: 0, y: 6, z: 0 },
        mesh: nodeMesh
    });

    const description = "The Advanced Agricultural Seed Drill represents the pinnacle of precision farming. Combining heavy-duty mechanical soil-cutting with laser-guided seed metering and AI telemetry, it maximizes crop yield while minimizing seed waste. Neon particle tubes and glowing metering systems ensure clear visibility in low-light conditions.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Coulter Discs?",
            options: [
                "To store and feed the seeds",
                "To drive the machine forward",
                "To open a trench in the soil for seed placement",
                "To compact soil over the seeds"
            ],
            correct: 2,
            explanation: "Coulter discs are sharp steel implements designed to slice through soil and crop residue, creating the precise trench into which seeds are dropped.",
            difficulty: "easy"
        },
        {
            question: "What is a direct cascade failure of the Seed Hopper failing?",
            options: [
                "Coulter disc jamming",
                "Seed starvation affecting the Seed Metering Unit and Seed Tubes",
                "The Drive Wheels stopping",
                "The AI Control Node losing power"
            ],
            correct: 1,
            explanation: "If the Seed Hopper fails to deliver seeds, the Seed Metering Unit has nothing to meter, and the Seed Tubes remain empty, starving the rows.",
            difficulty: "medium"
        },
        {
            question: "Why is the Press Wheel placed behind the Coulter Discs and Seed Delivery Tubes?",
            options: [
                "To steer the equipment",
                "To process crop residues before seeding",
                "To close the trench and compact soil around the seed",
                "To power the Seed Metering Unit"
            ],
            correct: 2,
            explanation: "After the trench is opened by the coulter and the seed is dropped by the tube, the trailing press wheel runs over it to securely bury the seed and ensure strong soil-to-seed contact.",
            difficulty: "hard"
        }
    ];

    function animate(time, speed, meshes) {
        const partsArray = Object.values(meshes || {}).length > 0 ? Object.values(meshes) : parts.map(p => p.mesh);
        
        const findMesh = (name) => parts.find(p => p.name === name)?.mesh;

        // Rotate Drive Wheels
        const driveWheels = findMesh('Drive Wheels');
        if(driveWheels) {
            driveWheels.children.forEach(wheel => {
                wheel.rotation.y += 0.05 * speed;
            });
        }

        // Rotate Coulter Discs
        const coulters = findMesh('Coulter Discs');
        if(coulters) {
            coulters.children.forEach(disc => {
                disc.rotation.y += 0.08 * speed;
            });
        }

        // Rotate Press Wheels
        const pressWheels = findMesh('Press Wheels');
        if(pressWheels) {
            pressWheels.children.forEach(wheel => {
                wheel.rotation.y += 0.05 * speed;
            });
        }

        // Spin Seed Metering Unit rapidly
        const meter = findMesh('Seed Metering Unit');
        if(meter) meter.rotation.z += 0.1 * speed;

        // Pulsate AI Node
        const aiNode = findMesh('AI Control Node');
        if(aiNode) aiNode.scale.setScalar(1 + Math.sin(time * 5) * 0.05);
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createSeedDrillPlanter() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
