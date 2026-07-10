import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const neonGreen = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 0.8 });
    const neonBlue = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 0.8 });
    const aiCoreGlow = new THREE.MeshStandardMaterial({ color: 0xff00ff, emissive: 0xff00ff, emissiveIntensity: 1.0 });

    // Helper function to create parts
    function createPart(name, geometry, material, position, explodedOffset, metadata) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(position);
        mesh.userData = { ...metadata, originalPosition: position.clone(), explodedPosition: position.clone().add(explodedOffset) };
        group.add(mesh);
        
        parts.push({
            name,
            ...metadata,
            mesh
        });
        
        return mesh;
    }

    // 1. Main Chassis (Dark Steel)
    const chassisGeo = new THREE.BoxGeometry(4, 2, 8);
    const chassisPos = new THREE.Vector3(0, 2, 0);
    const chassisExp = new THREE.Vector3(0, 0, 0);
    createPart('Main Chassis', chassisGeo, darkSteel, chassisPos, chassisExp, {
        description: 'The central structural frame of the robotic combine harvester.',
        material: 'Dark Steel / Composite',
        function: 'Supports all internal modules and external attachments.',
        assemblyOrder: 1,
        connections: ['Drivetrain', 'Reaper Header', 'Grain Tank', 'AI Core'],
        failureEffect: 'Structural collapse leading to total system failure.',
        cascadeFailures: ['Drivetrain', 'Reaper Header']
    });

    // 2. Wheels (Rubber & Steel) - Front Left, Front Right, Rear Left, Rear Right
    const wheelGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.8, 32);
    wheelGeo.rotateZ(Math.PI / 2);
    
    const wheelPositions = [
        new THREE.Vector3(2.5, 1.2, 3), // FL
        new THREE.Vector3(-2.5, 1.2, 3), // FR
        new THREE.Vector3(2.5, 1.2, -3), // RL
        new THREE.Vector3(-2.5, 1.2, -3), // RR
    ];
    
    wheelPositions.forEach((pos, index) => {
        createPart(`Omni-Wheel ${index + 1}`, wheelGeo, rubber, pos, pos.clone().multiplyScalar(0.5), {
            description: 'Independent omni-directional drive wheels for precise field navigation.',
            material: 'Reinforced Rubber',
            function: 'Provides mobility and soil compaction reduction.',
            assemblyOrder: 2,
            connections: ['Chassis', 'Suspension'],
            failureEffect: 'Loss of mobility or reduced traction.',
            cascadeFailures: ['Navigation System']
        });
    });

    // 3. Reaper Header (Aluminum & Chrome)
    const headerGeo = new THREE.BoxGeometry(7, 1, 1.5);
    const headerPos = new THREE.Vector3(0, 1.5, 5);
    const headerExp = new THREE.Vector3(0, -1, 3);
    const headerMesh = createPart('Reaper Header', headerGeo, chrome, headerPos, headerExp, {
        description: 'Advanced cutting and gathering mechanism for various crops.',
        material: 'Chrome / Aluminum',
        function: 'Cuts and channels crops into the threshing drum.',
        assemblyOrder: 3,
        connections: ['Chassis', 'Feeder House'],
        failureEffect: 'Inability to harvest crops.',
        cascadeFailures: ['Thresher']
    });

    // Header Auger (Rotating part)
    const augerGeo = new THREE.CylinderGeometry(0.3, 0.3, 6.5, 16);
    augerGeo.rotateZ(Math.PI / 2);
    const augerMesh = createPart('Header Auger', augerGeo, steel, new THREE.Vector3(0, 1.5, 5.2), new THREE.Vector3(0, -1.5, 4), {
        description: 'Spiraled auger to draw cut crops into the center.',
        material: 'Steel',
        function: 'Moves crops to the feeder house.',
        assemblyOrder: 4,
        connections: ['Reaper Header'],
        failureEffect: 'Crop jamming at the header.',
        cascadeFailures: ['Reaper Header']
    });

    // 4. Threshing Drum (Steel)
    const thresherGeo = new THREE.CylinderGeometry(0.8, 0.8, 3, 32);
    thresherGeo.rotateZ(Math.PI / 2);
    const thresherMesh = createPart('Threshing Drum', thresherGeo, steel, new THREE.Vector3(0, 2, 2), new THREE.Vector3(0, 2, 0), {
        description: 'High-speed rotary drum for separating grain from stalks.',
        material: 'High-Carbon Steel',
        function: 'Mechanical separation of crop components.',
        assemblyOrder: 5,
        connections: ['Chassis', 'Grain Elevator'],
        failureEffect: 'Poor grain separation or grain damage.',
        cascadeFailures: ['Cleaning Shoe']
    });

    // 5. Grain Tank (Glass & Plastic)
    const tankGeo = new THREE.BoxGeometry(3, 2, 4);
    const tankMesh = createPart('Smart Grain Tank', tankGeo, tinted, new THREE.Vector3(0, 4, 0), new THREE.Vector3(0, 3, 0), {
        description: 'Large capacity holding tank with moisture and quality sensors.',
        material: 'Polycarbonate Glass',
        function: 'Stores clean grain until offloading.',
        assemblyOrder: 6,
        connections: ['Chassis', 'Unloading Auger'],
        failureEffect: 'Grain spillage or inaccurate capacity sensing.',
        cascadeFailures: []
    });

    // 6. Unloading Auger (Aluminum)
    const unloadGeo = new THREE.CylinderGeometry(0.2, 0.2, 6, 16);
    unloadGeo.rotateX(Math.PI / 2);
    const unloadMesh = createPart('Unloading Auger', unloadGeo, aluminum, new THREE.Vector3(1.5, 4.5, 0), new THREE.Vector3(3, 3, 0), {
        description: 'Extendable tube for transferring grain to transport vehicles on the go.',
        material: 'Aluminum',
        function: 'Rapid offloading of harvested grain.',
        assemblyOrder: 7,
        connections: ['Grain Tank'],
        failureEffect: 'Inability to offload, halting harvest operations.',
        cascadeFailures: []
    });
    // Set pivot for auger
    unloadMesh.geometry.translate(0, 0, 3);
    unloadMesh.position.set(1.5, 4.5, -3);

    // 7. AI Core & Sensors (Glowing)
    const coreGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const coreMesh = createPart('AI Processor Node', coreGeo, aiCoreGlow, new THREE.Vector3(0, 3.5, -2), new THREE.Vector3(0, 4, -4), {
        description: 'Quantum-inspired neural processor for autonomous field operations.',
        material: 'Silicon / Photonic Core',
        function: 'Pathfinding, crop health analysis, and system optimization.',
        assemblyOrder: 8,
        connections: ['Chassis', 'Power Plant', 'LIDAR'],
        failureEffect: 'Complete loss of autonomous function; emergency stop.',
        cascadeFailures: ['Navigation System', 'Harvest Optimization']
    });

    // 8. LIDAR Array (Neon Blue)
    const lidarGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.4, 16);
    const lidarMesh = createPart('LIDAR Array', lidarGeo, neonBlue, new THREE.Vector3(0, 5.2, 3), new THREE.Vector3(0, 6, 3), {
        description: '360-degree laser scanning system for environmental mapping.',
        material: 'Sensor Optics',
        function: 'Obstacle detection and precise row following.',
        assemblyOrder: 9,
        connections: ['Chassis', 'AI Core'],
        failureEffect: 'Blindness to obstacles.',
        cascadeFailures: ['AI Core']
    });

    // 9. Power Plant / Battery Pack (Copper & Dark Steel)
    const powerGeo = new THREE.BoxGeometry(2, 1, 3);
    createPart('Solid-State Battery Pack', powerGeo, copper, new THREE.Vector3(0, 1, -2), new THREE.Vector3(0, -2, -3), {
        description: 'High-density energy storage for extended autonomous operation.',
        material: 'Graphene / Copper',
        function: 'Provides electrical power to all drivetrains and systems.',
        assemblyOrder: 10,
        connections: ['Chassis', 'Drivetrain', 'AI Core'],
        failureEffect: 'Complete loss of power.',
        cascadeFailures: ['All Systems']
    });

    const description = "The Fully Autonomous Agri Robotic Combine Harvester represents the pinnacle of modern precision agriculture. Utilizing an AI Processor Node, it navigates fields with millimeter accuracy using its 360-degree LIDAR array. It optimizes harvesting parameters on the fly, separates grain efficiently via its high-speed threshing drum, and offloads on-the-move to autonomous transport vehicles, all while minimizing soil compaction through independent omni-wheels.";

    const quizQuestions = [
        {
            question: "What is the primary function of the LIDAR Array on the autonomous harvester?",
            options: [
                "To measure the moisture content of the grain.",
                "To provide 360-degree environmental mapping and obstacle detection.",
                "To power the high-speed threshing drum.",
                "To communicate with offloading transport vehicles."
            ],
            correct: 1,
            explanation: "The LIDAR (Light Detection and Ranging) array continuously scans the environment, allowing the AI to map the field, detect obstacles, and follow crop rows precisely.",
            difficulty: "Easy"
        },
        {
            question: "How does the 'Smart Grain Tank' differ from traditional combine storage?",
            options: [
                "It uses aerodynamic properties to dry the grain.",
                "It automatically sorts grain by size using gravity.",
                "It incorporates moisture and quality sensors to monitor crop conditions in real-time.",
                "It converts excess grain into biofuels."
            ],
            correct: 2,
            explanation: "Smart Grain Tanks are equipped with internal sensors that analyze the harvest's quality, yield, and moisture levels in real-time, feeding this data back to the AI Core.",
            difficulty: "Medium"
        },
        {
            question: "Which component failure would cause an immediate 'emergency stop' due to loss of autonomous control?",
            options: [
                "Reaper Header",
                "Unloading Auger",
                "Threshing Drum",
                "AI Processor Node"
            ],
            correct: 3,
            explanation: "The AI Processor Node is the 'brain' of the machine. Its failure results in a complete loss of autonomous function, triggering safety protocols like an emergency stop to prevent accidents.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Rotate wheels
        const wheelMeshes = meshes.filter(m => m.name.includes('Omni-Wheel'));
        wheelMeshes.forEach(mesh => {
            mesh.rotation.x += 0.05 * speed;
        });

        // Rotate header auger
        const auger = meshes.find(m => m.name === 'Header Auger');
        if (auger) auger.rotation.x += 0.1 * speed;

        // Rotate threshing drum
        const thresher = meshes.find(m => m.name === 'Threshing Drum');
        if (thresher) thresher.rotation.x += 0.2 * speed;

        // Swing unloading auger slightly
        const unloader = meshes.find(m => m.name === 'Unloading Auger');
        if (unloader) {
            unloader.rotation.y = Math.sin(time * 0.5) * 0.5 - 0.5; // Swing out and in
        }

        // Pulse AI Core
        const core = meshes.find(m => m.name === 'AI Processor Node');
        if (core) {
            core.material.emissiveIntensity = 0.5 + Math.sin(time * 3) * 0.5;
            core.rotation.y += 0.02 * speed;
        }

        // Spin LIDAR array
        const lidar = meshes.find(m => m.name === 'LIDAR Array');
        if (lidar) lidar.rotation.y += 0.5 * speed;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createRoboticCombineHarvester() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
