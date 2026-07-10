import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const lidarGlow = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8
    });

    const scannerGlow = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.7
    });

    const statusLight = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 1.0
    });

    // 1. Chassis
    const chassisGeometry = new THREE.BoxGeometry(4, 1.5, 6);
    const chassisMesh = new THREE.Mesh(chassisGeometry, darkSteel);
    chassisMesh.position.set(0, 1.5, 0);
    group.add(chassisMesh);
    
    parts.push({
        name: "Main Chassis",
        description: "The primary structural frame of the robotic seeder, housing the seed hoppers, batteries, and control units.",
        material: "Dark Steel",
        function: "Structural support and component housing.",
        assemblyOrder: 1,
        connections: ["Drive System", "Seed Hoppers", "Robotic Arms", "Sensor Array"],
        failureEffect: "Structural integrity compromised, rendering the machine immobile.",
        cascadeFailures: ["Sensor Array", "Drive System"],
        originalPosition: { x: 0, y: 1.5, z: 0 },
        explodedPosition: { x: 0, y: 4, z: 0 }
    });

    // 2. Wheels
    const wheels = [];
    const wheelGeometry = new THREE.CylinderGeometry(1, 1, 0.8, 32);
    const wheelPositions = [
        [-2.2, 1, -2.5], [2.2, 1, -2.5],
        [-2.2, 1, 2.5], [2.2, 1, 2.5]
    ];
    
    wheelPositions.forEach((pos, idx) => {
        const wheel = new THREE.Mesh(wheelGeometry, rubber);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(...pos);
        group.add(wheel);
        wheels.push(wheel);
        
        parts.push({
            name: `Omni-Wheel ${idx + 1}`,
            description: "High-traction autonomous driving wheels allowing movement in challenging agricultural terrain.",
            material: "Rubber / Steel",
            function: "Mobility and navigation.",
            assemblyOrder: 2,
            connections: ["Main Chassis", "Drive Motors"],
            failureEffect: "Loss of mobility or steering capability.",
            cascadeFailures: ["Navigation System"],
            originalPosition: { x: pos[0], y: pos[1], z: pos[2] },
            explodedPosition: { x: pos[0] * 2, y: pos[1], z: pos[2] * 2 }
        });
    });

    // 3. Seed Hopper
    const hopperGeometry = new THREE.ConeGeometry(1.5, 2, 4);
    const hopperMesh = new THREE.Mesh(hopperGeometry, aluminum);
    hopperMesh.rotation.y = Math.PI / 4;
    hopperMesh.position.set(0, 3.25, -1);
    group.add(hopperMesh);

    parts.push({
        name: "Seed Storage Hopper",
        description: "A climate-controlled chamber storing seeds and keeping them at optimal humidity.",
        material: "Aluminum",
        function: "Seed storage and preservation.",
        assemblyOrder: 3,
        connections: ["Main Chassis", "Seed Dispenser"],
        failureEffect: "Seed flow stops, halting the planting operation.",
        cascadeFailures: ["Seed Dispenser"],
        originalPosition: { x: 0, y: 3.25, z: -1 },
        explodedPosition: { x: 0, y: 7, z: -1 }
    });

    // 4. Robotic Planting Arms
    const arms = [];
    const armBaseGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1.5);
    const armTipGeometry = new THREE.ConeGeometry(0.1, 0.5, 8);
    
    for(let i=0; i<3; i++) {
        const armGroup = new THREE.Group();
        
        const armBase = new THREE.Mesh(armBaseGeometry, chrome);
        armBase.position.set(0, -0.75, 0);
        
        const armTip = new THREE.Mesh(armTipGeometry, steel);
        armTip.position.set(0, -1.75, 0);
        armTip.rotation.x = Math.PI;

        armGroup.add(armBase);
        armGroup.add(armTip);
        
        armGroup.position.set(-1 + i*1, 0.75, 2.5);
        group.add(armGroup);
        arms.push(armGroup);
        
        parts.push({
            name: `Planting Arm ${i + 1}`,
            description: "Precision robotic arm capable of injecting seeds at the perfect depth into the soil.",
            material: "Chrome / Steel",
            function: "Seed injection into soil.",
            assemblyOrder: 4,
            connections: ["Main Chassis", "Seed Dispenser"],
            failureEffect: "Inconsistent seed placement or skipped rows.",
            cascadeFailures: [],
            originalPosition: { x: -1 + i*1, y: 0.75, z: 2.5 },
            explodedPosition: { x: -1 + i*1, y: -2, z: 4 }
        });
    }

    // 5. LIDAR Array
    const lidarGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.5, 16);
    const lidarMesh = new THREE.Mesh(lidarGeometry, lidarGlow);
    lidarMesh.position.set(0, 4.5, 2);
    group.add(lidarMesh);
    
    parts.push({
        name: "LIDAR Sensor Array",
        description: "A 360-degree high-frequency LIDAR scanner used for spatial mapping and obstacle avoidance.",
        material: "Glowing Cyan Tech",
        function: "Environment scanning and navigation.",
        assemblyOrder: 5,
        connections: ["Main Chassis", "AI Processing Unit"],
        failureEffect: "Loss of autonomous navigation, potential for collision.",
        cascadeFailures: ["AI Processing Unit", "Drive System"],
        originalPosition: { x: 0, y: 4.5, z: 2 },
        explodedPosition: { x: 0, y: 8, z: 2 }
    });

    // 6. Soil Scanners
    const soilScanners = [];
    const scannerGeometry = new THREE.BoxGeometry(0.8, 0.3, 0.8);
    const scannerPositions = [[-1.5, 0.5, 3], [1.5, 0.5, 3]];
    
    scannerPositions.forEach((pos, idx) => {
        const scanner = new THREE.Mesh(scannerGeometry, scannerGlow);
        scanner.position.set(...pos);
        group.add(scanner);
        soilScanners.push(scanner);
        
        parts.push({
            name: `Soil Scanner ${idx + 1}`,
            description: "Deep-penetrating multi-spectral scanner evaluating soil moisture, nutrients, and density in real-time.",
            material: "Glowing Green Tech",
            function: "Soil analysis.",
            assemblyOrder: 6,
            connections: ["Main Chassis", "AI Processing Unit"],
            failureEffect: "Suboptimal planting locations chosen, reducing crop yield.",
            cascadeFailures: [],
            originalPosition: { x: pos[0], y: pos[1], z: pos[2] },
            explodedPosition: { x: pos[0]*1.5, y: -1, z: pos[2]*1.5 }
        });
    });

    const description = "The Agricultural Automated Robotic Seeder is a state-of-the-art farming vehicle. It uses advanced LIDAR for navigation, deep-soil scanners for assessing terrain quality, and precision robotic arms to inject seeds exactly at optimal depth and spacing. Designed to operate completely autonomously 24/7, it maximizes crop yield and minimizes resource waste.";

    const quizQuestions = [
        {
            question: "What is the primary function of the LIDAR Sensor Array on the seeder?",
            options: ["Assessing soil moisture", "Planting seeds", "Spatial mapping and obstacle avoidance", "Recharging the battery"],
            correct: 2,
            explanation: "LIDAR uses light pulses to measure ranges, creating a 3D map of the environment used for autonomous navigation and avoiding obstacles.",
            difficulty: "Medium"
        },
        {
            question: "Which component is directly responsible for evaluating soil nutrients and moisture?",
            options: ["Omni-Wheels", "Soil Scanners", "Seed Hopper", "Robotic Planting Arms"],
            correct: 1,
            explanation: "The deep-penetrating Soil Scanners analyze the ground in real-time to determine if the location is optimal for planting.",
            difficulty: "Easy"
        },
        {
            question: "What is the potential consequence of a Seed Hopper failure?",
            options: ["The machine will drive faster", "Seed flow stops, halting the planting operation", "Soil scanners will shut down", "LIDAR accuracy will decrease"],
            correct: 1,
            explanation: "The Seed Hopper stores the seeds. If it fails, seeds cannot be dispensed, bringing the primary planting operation to a halt.",
            difficulty: "Medium"
        },
        {
            question: "Why might a failure in the Omni-Wheels cause a cascade failure in the Navigation System?",
            options: ["Wheels generate the LIDAR signals", "Loss of mobility prevents the navigation system from executing planned routes", "Navigation requires wheels to process soil data", "Wheels store the battery power for navigation"],
            correct: 1,
            explanation: "The navigation system computes routes and issues movement commands; without functional wheels, these commands cannot be executed, rendering the navigation system ineffective.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Rotate LIDAR fast
        lidarMesh.rotation.y += 0.1 * speed;
        
        // Rotate wheels slowly based on speed
        wheels.forEach(wheel => {
            wheel.rotation.x += 0.05 * speed;
        });
        
        // Animate arms (stamping motion)
        arms.forEach((arm, index) => {
            const offset = index * Math.PI / 1.5;
            arm.position.y = 0.75 + Math.sin(time * 0.005 * speed + offset) * 0.5;
        });

        // Pulse soil scanners
        const pulse = (Math.sin(time * 0.005 * speed) + 1) / 2;
        scannerGlow.emissiveIntensity = 1.0 + pulse * 2.0;
    }

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createAutomatedRoboticSeeder() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
