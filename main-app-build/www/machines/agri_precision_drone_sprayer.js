import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const neonGreen = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 0.8, transparent: true, opacity: 0.8 });
    const neonBlue = new THREE.MeshStandardMaterial({ color: 0x0088ff, emissive: 0x0088ff, emissiveIntensity: 0.8 });
    const neonRed = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 0.8 });
    const chemicalMist = new THREE.MeshStandardMaterial({ color: 0x33ff33, emissive: 0x11aa11, emissiveIntensity: 0.5, transparent: true, opacity: 0.3 });
    const carbonFiber = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.8, metalness: 0.2 });

    function addPart(mesh, name, description, materialName, func, assemblyOrder, connections, failEffect, cascade, origPos, explPos) {
        mesh.name = name;
        group.add(mesh);
        parts.push({
            name,
            description,
            material: materialName,
            function: func,
            assemblyOrder,
            connections,
            failureEffect: failEffect,
            cascadeFailures: cascade,
            originalPosition: origPos,
            explodedPosition: explPos,
            mesh: mesh
        });
    }

    // 1. Core Chassis
    const chassisGeo = new THREE.BoxGeometry(1.5, 0.4, 1.5);
    const chassis = new THREE.Mesh(chassisGeo, carbonFiber);
    chassis.position.set(0, 0, 0);
    addPart(
        chassis,
        'Core Chassis',
        'Central frame housing the main flight controller and power distribution.',
        'Carbon Fiber',
        'Provides structural integrity and mounts for all other components.',
        1,
        ['Arms', 'Battery Pack', 'Sensors'],
        'Total structural collapse, immediate crash.',
        ['All components'],
        { x: 0, y: 0, z: 0 },
        { x: 0, y: 2, z: 0 }
    );

    // 2. Flight Controller & Lidar Dome
    const domeGeo = new THREE.CylinderGeometry(0.5, 0.6, 0.3, 16);
    const dome = new THREE.Mesh(domeGeo, tinted);
    dome.position.set(0, 0.35, 0);
    const lidarGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16);
    const lidar = new THREE.Mesh(lidarGeo, neonBlue);
    lidar.position.set(0, 0.15, 0);
    dome.add(lidar);
    addPart(
        dome,
        'Flight Controller & LiDAR',
        'Brain of the drone and top-mounted spatial awareness sensor.',
        'Tinted Glass & Electronics',
        'Navigates, stabilizes flight, and maps terrain for precision spraying.',
        2,
        ['Core Chassis'],
        'Loss of autonomous navigation, erratic flight.',
        ['Rotors', 'Spray System'],
        { x: 0, y: 0.35, z: 0 },
        { x: 0, y: 3, z: 0 }
    );

    // 3. Hexacopter Arms and Rotors
    const armAngles = [0, 60, 120, 180, 240, 300];
    armAngles.forEach((angle, i) => {
        const rad = angle * Math.PI / 180;
        
        // Arm
        const armGeo = new THREE.CylinderGeometry(0.08, 0.08, 2, 8);
        const arm = new THREE.Mesh(armGeo, aluminum);
        arm.rotation.x = Math.PI / 2;
        arm.rotation.z = rad;
        
        const armDist = 1;
        const armX = Math.cos(rad) * armDist;
        const armZ = Math.sin(rad) * armDist;
        arm.position.set(armX, 0, armZ);
        
        addPart(
            arm,
            `Hex Arm ${i+1}`,
            `Lightweight extended arm supporting the motor.`,
            'Aluminum',
            'Positions the rotors at the correct leverage point for stability.',
            3 + i,
            ['Core Chassis', `Motor ${i+1}`],
            'Loss of motor position, catastrophic flight imbalance.',
            [`Rotor ${i+1}`],
            { x: armX, y: 0, z: armZ },
            { x: armX * 3, y: 0, z: armZ * 3 }
        );

        // Motor
        const motorGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.2, 16);
        const motor = new THREE.Mesh(motorGeo, copper);
        const motorX = Math.cos(rad) * 2;
        const motorZ = Math.sin(rad) * 2;
        motor.position.set(motorX, 0.1, motorZ);
        
        addPart(
            motor,
            `Brushless Motor ${i+1}`,
            `High-torque electric motor for propulsion.`,
            'Copper/Steel',
            'Drives the propeller to generate lift.',
            9 + i,
            [`Hex Arm ${i+1}`, `Propeller ${i+1}`],
            'Loss of thrust on one axis, triggering emergency compensation.',
            ['Flight Controller'],
            { x: motorX, y: 0.1, z: motorZ },
            { x: motorX * 3.5, y: 2, z: motorZ * 3.5 }
        );

        // Propeller
        const propGeo = new THREE.BoxGeometry(1.2, 0.02, 0.1);
        const prop = new THREE.Mesh(propGeo, plastic);
        prop.position.set(motorX, 0.25, motorZ);
        
        addPart(
            prop,
            `Propeller ${i+1}`,
            `Carbon-reinforced high-efficiency blade.`,
            'Plastic/Carbon',
            'Generates aerodynamic lift.',
            15 + i,
            [`Motor ${i+1}`],
            'Loss of lift, strong vibration.',
            ['Motor bearings'],
            { x: motorX, y: 0.25, z: motorZ },
            { x: motorX * 4, y: 4, z: motorZ * 4 }
        );
    });

    // 4. Smart Spray Tank
    const tankGeo = new THREE.CylinderGeometry(0.6, 0.5, 1.2, 16);
    const tank = new THREE.Mesh(tankGeo, tinted);
    tank.position.set(0, -0.8, 0);
    
    // Liquid inside
    const liquidGeo = new THREE.CylinderGeometry(0.55, 0.45, 0.8, 16);
    const liquid = new THREE.Mesh(liquidGeo, neonGreen);
    liquid.position.set(0, -0.1, 0);
    tank.add(liquid);

    addPart(
        tank,
        'Chemical Spray Tank',
        'High-capacity tank holding pesticide or fertilizer.',
        'Tinted Glass',
        'Stores agricultural payload for distribution.',
        21,
        ['Core Chassis', 'Pump System'],
        'Leakage of payload, environmental hazard.',
        ['Pump System'],
        { x: 0, y: -0.8, z: 0 },
        { x: 0, y: -2, z: 0 }
    );

    // 5. Pump & Filtration System
    const pumpGeo = new THREE.BoxGeometry(0.4, 0.3, 0.4);
    const pump = new THREE.Mesh(pumpGeo, chrome);
    pump.position.set(0, -1.55, 0);
    addPart(
        pump,
        'High-Pressure Pump',
        'Drives the fluid from the tank to the spray nozzles.',
        'Chrome',
        'Pressurizes the chemical liquid to create fine mist.',
        22,
        ['Spray Tank', 'Boom Arms'],
        'Failure to dispense liquid, mission abort.',
        ['Nozzles'],
        { x: 0, y: -1.55, z: 0 },
        { x: 0, y: -4, z: 0 }
    );

    // 6. Spray Boom Arms
    const boomGeo = new THREE.CylinderGeometry(0.04, 0.04, 4);
    const boom = new THREE.Mesh(boomGeo, darkSteel);
    boom.rotation.z = Math.PI / 2;
    boom.position.set(0, -1.7, 0);
    addPart(
        boom,
        'Spray Boom',
        'Lateral arm spanning beneath the drone.',
        'Dark Steel',
        'Extends the reach of the spray nozzles for wider coverage.',
        23,
        ['Pump System'],
        'Bent or broken arm, uneven spraying.',
        [],
        { x: 0, y: -1.7, z: 0 },
        { x: 0, y: -5, z: 0 }
    );

    // 7. Spray Nozzles & Mist
    const nozzlePositions = [-1.8, -0.9, 0, 0.9, 1.8];
    nozzlePositions.forEach((nx, i) => {
        const nozzleGeo = new THREE.ConeGeometry(0.08, 0.2, 8);
        const nozzle = new THREE.Mesh(nozzleGeo, brassMaterial()); // mock brass
        nozzle.rotation.x = Math.PI;
        nozzle.position.set(nx, -1.85, 0);
        
        // Mist cone
        const mistGeo = new THREE.ConeGeometry(0.5, 1.5, 8);
        const mist = new THREE.Mesh(mistGeo, chemicalMist);
        mist.position.set(0, -0.85, 0);
        // Initially hide mist, to be pulsed in animation or just left visible
        nozzle.add(mist);

        addPart(
            nozzle,
            `Precision Nozzle ${i+1}`,
            `Atomizing spray nozzle.`,
            'Brass/Copper',
            'Breaks pressurized liquid into fine micro-droplets.',
            24 + i,
            ['Spray Boom'],
            'Clogged nozzle, creating gaps in crop coverage.',
            ['Pump Pressure Buildup'],
            { x: nx, y: -1.85, z: 0 },
            { x: nx * 1.5, y: -6, z: 0 }
        );
    });

    // 8. Multispectral Camera & Sensors
    const camBoxGeo = new THREE.BoxGeometry(0.4, 0.3, 0.3);
    const camBox = new THREE.Mesh(camBoxGeo, plastic);
    camBox.position.set(0, -0.1, 0.9);
    
    const lensGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.1, 16);
    const lens = new THREE.Mesh(lensGeo, neonRed);
    lens.rotation.x = Math.PI / 2;
    lens.position.set(0, 0, 0.15);
    camBox.add(lens);

    addPart(
        camBox,
        'Multispectral Camera',
        'NDVI sensor for crop health monitoring.',
        'Plastic & Glass',
        'Scans crop health in real-time, adjusting spray rates dynamically.',
        30,
        ['Core Chassis'],
        'Loss of intelligent targeting, reverts to manual/blind spraying.',
        [],
        { x: 0, y: -0.1, z: 0.9 },
        { x: 0, y: -0.1, z: 3 }
    );

    // 9. Battery Pack
    const batteryGeo = new THREE.BoxGeometry(0.8, 0.3, 0.8);
    const battery = new THREE.Mesh(batteryGeo, darkSteel);
    battery.position.set(0, 0, -0.2); // Sits inside chassis roughly
    addPart(
        battery,
        'High-Density Li-Po Battery',
        'Massive power cell required for flight and pumping.',
        'Steel/Lithium',
        'Provides 48V power to all drone subsystems.',
        31,
        ['Core Chassis', 'Flight Controller'],
        'Total power loss, drone crashes immediately.',
        ['Flight Controller', 'Motors'],
        { x: 0, y: 0.1, z: -0.2 },
        { x: 0, y: 1, z: -2 }
    );

    function brassMaterial() {
        return new THREE.MeshStandardMaterial({ color: 0xb5a642, roughness: 0.3, metalness: 0.8 });
    }

    const description = "The Agri Precision Drone Sprayer represents the pinnacle of modern agriculture technology. This heavy-duty hexacopter autonomous drone maps fields using LiDAR and multispectral imaging to identify crop health and dynamically applies targeted chemical sprays—reducing waste, minimizing environmental impact, and maximizing yields.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Multispectral Camera on the drone?",
            options: [
                "Taking high-resolution promotional photos",
                "Monitoring crop health using NDVI to adjust spray rates dynamically",
                "Providing a live video feed to the operator for manual steering",
                "Detecting incoming aircraft to avoid collisions"
            ],
            correct: 1,
            explanation: "Multispectral sensors capture light across different bands (like near-infrared) to compute NDVI, allowing the drone to spot diseased or parched crops and spray precisely where needed.",
            difficulty: "Medium"
        },
        {
            question: "Why does the drone use a Hexacopter (6-rotor) configuration instead of a standard Quadcopter (4-rotor)?",
            options: [
                "It uses less battery power per motor",
                "It looks more advanced and intimidating to pests",
                "It provides redundancy; if one motor fails, it can still land safely",
                "It is a legal requirement for all agricultural drones"
            ],
            correct: 2,
            explanation: "A hexacopter offers motor redundancy. Given the heavy payload of chemical liquids, if one motor fails, the flight controller can compensate using the remaining five to prevent a catastrophic crash.",
            difficulty: "Hard"
        },
        {
            question: "What does the High-Pressure Pump do in this system?",
            options: [
                "Pumps air into the tires for landing",
                "Cools the brushless motors during intense flight",
                "Drives the agricultural fluid from the tank to the atomizing nozzles",
                "Compresses the drone's frame for easier storage"
            ],
            correct: 2,
            explanation: "The pump pulls liquid from the central payload tank and forces it under pressure through the boom arms and out the atomizing nozzles to create the desired spray pattern.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshes) {
        // Find propellers and spin them
        parts.forEach(part => {
            if (part.name.startsWith('Propeller')) {
                part.mesh.rotation.y = time * 20 * speed;
            }
            if (part.name === 'Flight Controller & LiDAR') {
                const lidar = part.mesh.children[0];
                if (lidar) lidar.rotation.y = time * 5 * speed; // Spinning lidar scanner
            }
        });

        // Add a slight bobbing motion to the whole drone to simulate hovering
        group.position.y = Math.sin(time * 2 * speed) * 0.1;
        group.rotation.y = Math.sin(time * 0.5 * speed) * 0.05;
        group.rotation.x = Math.sin(time * 0.8 * speed) * 0.02;

        // Pulsate mist and camera LEDs
        const pulse = (Math.sin(time * 10 * speed) + 1) / 2;
        chemicalMist.opacity = 0.2 + (pulse * 0.2);
        neonRed.emissiveIntensity = 0.5 + (pulse * 0.5);
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createPrecisionDroneSprayer() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
