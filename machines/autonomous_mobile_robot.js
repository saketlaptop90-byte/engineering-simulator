import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom glowing materials
    const glowingBlue = new THREE.MeshStandardMaterial({ 
        color: 0x0088ff, 
        emissive: 0x0088ff, 
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.9
    });

    const glowingRed = new THREE.MeshStandardMaterial({
        color: 0xff1111,
        emissive: 0xff0000,
        emissiveIntensity: 2.0
    });

    const glowingCyan = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 1.0
    });

    // Helper to add parts
    function addPart(name, mesh, info) {
        mesh.name = name;
        group.add(mesh);
        meshes[name] = mesh;
        
        parts.push({
            name: info.name || name,
            description: info.description || 'A critical component of the AMR.',
            material: info.material || 'Standard',
            function: info.function || 'General operation.',
            assemblyOrder: info.assemblyOrder || 1,
            connections: info.connections || [],
            failureEffect: info.failureEffect || 'System malfunction.',
            cascadeFailures: info.cascadeFailures || [],
            originalPosition: { x: mesh.position.x, y: mesh.position.y, z: mesh.position.z },
            explodedPosition: info.explodedPosition || { x: mesh.position.x, y: mesh.position.y + 2, z: mesh.position.z },
            mesh: mesh
        });
    }

    // 1. Chassis (Main Body)
    const chassisGeo = new THREE.BoxGeometry(3, 0.8, 4);
    const chassisMesh = new THREE.Mesh(chassisGeo, darkSteel);
    chassisMesh.position.set(0, 0.6, 0);
    addPart('Chassis', chassisMesh, {
        name: 'Main Chassis',
        description: 'The structural framework supporting all internal and external components of the AMR.',
        material: 'Dark Steel Alloy',
        function: 'Provides rigidity, mounting points for electronics, and protects internal payloads.',
        assemblyOrder: 1,
        connections: ['BatteryPack', 'DriveMotors', 'Sensors'],
        failureEffect: 'Structural compromise, misalignment of sensors.',
        cascadeFailures: ['DriveMotors', 'LidarSensor'],
        explodedPosition: { x: 0, y: 0.6, z: 0 }
    });

    // 2. Drive Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.4, 32);
    wheelGeo.rotateZ(Math.PI / 2);
    
    const wheelPositions = [
        { name: 'WheelFrontLeft', x: -1.7, y: 0.5, z: 1.5, explX: -3 },
        { name: 'WheelFrontRight', x: 1.7, y: 0.5, z: 1.5, explX: 3 },
        { name: 'WheelRearLeft', x: -1.7, y: 0.5, z: -1.5, explX: -3 },
        { name: 'WheelRearRight', x: 1.7, y: 0.5, z: -1.5, explX: 3 }
    ];

    wheelPositions.forEach((wp, index) => {
        const wheel = new THREE.Mesh(wheelGeo, rubber);
        wheel.position.set(wp.x, wp.y, wp.z);
        // Hubcap
        const hubGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.45, 16);
        hubGeo.rotateZ(Math.PI / 2);
        const hub = new THREE.Mesh(hubGeo, aluminum);
        wheel.add(hub);
        
        addPart(wp.name, wheel, {
            name: `Drive Wheel (${wp.name.replace('Wheel', '')})`,
            description: 'High-traction omnidirectional or standard drive wheel with integrated encoder.',
            material: 'Industrial Rubber / Aluminum Core',
            function: 'Provides propulsion, braking, and precise odometry feedback.',
            assemblyOrder: 2,
            connections: ['Chassis', 'DriveMotors'],
            failureEffect: 'Loss of mobility, navigation errors.',
            cascadeFailures: ['PathfindingModule'],
            explodedPosition: { x: wp.explX, y: wp.y, z: wp.z }
        });
    });

    // 3. Central Processing Unit (Navigation & Control)
    const cpuGeo = new THREE.BoxGeometry(1.2, 0.3, 1.5);
    const cpuMesh = new THREE.Mesh(cpuGeo, aluminum);
    cpuMesh.position.set(0, 1.15, -0.5);
    // CPU details
    const chipGeo = new THREE.BoxGeometry(0.5, 0.32, 0.5);
    const chipMesh = new THREE.Mesh(chipGeo, copper);
    cpuMesh.add(chipMesh);
    addPart('CPU', cpuMesh, {
        name: 'Navigation & Control Processor',
        description: 'High-performance compute module running SLAM algorithms, path planning, and obstacle avoidance.',
        material: 'Aluminum Heatsink / Silicon',
        function: 'Processes sensor data to build maps, localize the robot, and issue motor commands.',
        assemblyOrder: 3,
        connections: ['LidarSensor', 'BatteryPack', 'DriveMotors'],
        failureEffect: 'Complete loss of autonomous function. Robot halts.',
        cascadeFailures: ['All subsystems'],
        explodedPosition: { x: 0, y: 4, z: -0.5 }
    });

    // 4. Battery Pack
    const batteryGeo = new THREE.BoxGeometry(1.5, 0.6, 2);
    const batteryMesh = new THREE.Mesh(batteryGeo, plastic);
    batteryMesh.position.set(0, 1.3, 0.8);
    // Battery indicators
    const indGeo = new THREE.PlaneGeometry(1.2, 0.2);
    const indMesh = new THREE.Mesh(indGeo, glowingCyan);
    indMesh.position.set(0, 0.31, 0);
    indMesh.rotation.x = -Math.PI / 2;
    batteryMesh.add(indMesh);
    
    addPart('BatteryPack', batteryMesh, {
        name: 'High-Capacity Li-ion Battery',
        description: 'Advanced energy storage system with integrated Battery Management System (BMS).',
        material: 'Lithium-ion Cells / Flame Retardant Plastic',
        function: 'Supplies regulated power to motors, sensors, and compute modules.',
        assemblyOrder: 3,
        connections: ['Chassis', 'CPU', 'DriveMotors'],
        failureEffect: 'Power loss, immediate shutdown.',
        cascadeFailures: ['CPU', 'LidarSensor', 'DriveMotors'],
        explodedPosition: { x: 0, y: 5.5, z: 0.8 }
    });

    // 5. 3D LIDAR Sensor
    const lidarBaseGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 32);
    const lidarBase = new THREE.Mesh(lidarBaseGeo, darkSteel);
    lidarBase.position.set(0, 1.6, -1.0);
    
    const lidarSpinGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.4, 32);
    const lidarSpin = new THREE.Mesh(lidarSpinGeo, chrome);
    lidarSpin.position.set(0, 0.35, 0);
    // Lidar Laser beam ring
    const laserRingGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.05, 32);
    const laserRing = new THREE.Mesh(laserRingGeo, glowingBlue);
    lidarSpin.add(laserRing);
    
    lidarBase.add(lidarSpin);
    
    addPart('LidarSensor', lidarBase, {
        name: '3D Spinning LIDAR',
        description: 'Light Detection and Ranging sensor mapping the environment in 360 degrees.',
        material: 'Aluminum / Glass / Optics',
        function: 'Emits laser pulses to measure distances, creating high-resolution 3D point clouds for SLAM.',
        assemblyOrder: 4,
        connections: ['CPU', 'Chassis'],
        failureEffect: 'Loss of environmental mapping. Robot becomes blind to distant obstacles.',
        cascadeFailures: ['CPU'],
        explodedPosition: { x: 0, y: 7, z: -1.0 }
    });

    // 6. Front Depth Camera / Realsense
    const camGeo = new THREE.BoxGeometry(0.8, 0.2, 0.2);
    const camMesh = new THREE.Mesh(camGeo, darkSteel);
    camMesh.position.set(0, 1.1, 2.05);
    
    const lensGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.25, 16);
    lensGeo.rotateX(Math.PI / 2);
    const lens1 = new THREE.Mesh(lensGeo, glass);
    lens1.position.set(-0.25, 0, 0);
    const lens2 = new THREE.Mesh(lensGeo, glass);
    lens2.position.set(0.25, 0, 0);
    camMesh.add(lens1);
    camMesh.add(lens2);

    addPart('DepthCamera', camMesh, {
        name: 'Stereo Depth Camera',
        description: 'High-resolution stereoscopic vision system for close-range obstacle detection.',
        material: 'Glass Lenses / Steel Casing',
        function: 'Provides RGB-D data for detecting low-lying obstacles, drop-offs, and dynamic objects.',
        assemblyOrder: 4,
        connections: ['CPU', 'Chassis'],
        failureEffect: 'Inability to detect small or low objects, risk of collision.',
        cascadeFailures: [],
        explodedPosition: { x: 0, y: 1.1, z: 4 }
    });

    // 7. Safety Bumper / LED Strip
    const bumperGeo = new THREE.BoxGeometry(3.1, 0.2, 4.1);
    const bumperMesh = new THREE.Mesh(bumperGeo, glowingCyan);
    bumperMesh.position.set(0, 0.4, 0);
    addPart('SafetyBumper', bumperMesh, {
        name: 'Tactile Safety Bumper & Status Ring',
        description: 'Physical contact sensor ring integrated with RGB status LEDs.',
        material: 'Flexible Polyurethane / LEDs',
        function: 'Acts as a final safety cutoff upon physical impact and visually communicates robot intent (e.g., turning, error).',
        assemblyOrder: 5,
        connections: ['Chassis', 'CPU'],
        failureEffect: 'Loss of physical emergency stop capabilities.',
        cascadeFailures: [],
        explodedPosition: { x: 0, y: -2, z: 0 }
    });

    // Quiz Questions
    const quizQuestions = [
        {
            question: "What is the primary role of the 3D Spinning LIDAR in an AMR?",
            options: [
                "To communicate with other robots via optical links.",
                "To map the environment and determine the robot's location (SLAM).",
                "To recharge the battery using solar energy.",
                "To measure the temperature of the warehouse floor."
            ],
            correct: 1,
            explanation: "LIDAR (Light Detection and Ranging) spins to emit laser pulses in 360 degrees, measuring distances to build a 3D map and enabling SLAM (Simultaneous Localization and Mapping).",
            difficulty: "Medium"
        },
        {
            question: "Why does the AMR use both a LIDAR and a Stereo Depth Camera?",
            options: [
                "For aesthetic purposes to look more advanced.",
                "To drain the battery faster for testing purposes.",
                "Because LIDAR cannot detect color, and cameras cannot detect distance.",
                "Sensor fusion: LIDAR provides long-range 360-mapping, while depth cameras detect low-lying or close-range obstacles LIDAR might miss."
            ],
            correct: 3,
            explanation: "Sensor fusion combines the strengths of different sensors. LIDAR is great for long-range 2D/3D mapping, but depth cameras excel at detecting near-field, complex obstacles like cables or drop-offs.",
            difficulty: "Hard"
        },
        {
            question: "If the Central Processing Unit (CPU) fails, what is the immediate effect on the AMR?",
            options: [
                "It continues moving blindly.",
                "It immediately shuts down and halts all autonomous operations.",
                "It switches to manual remote control mode automatically.",
                "The safety bumper expands to protect it."
            ],
            correct: 1,
            explanation: "The CPU acts as the brain. If it fails, path planning, obstacle avoidance, and motor control algorithms stop, triggering a fail-safe halt.",
            difficulty: "Easy"
        }
    ];

    const description = "An ultra high-tech Autonomous Mobile Robot (AMR). Used in modern warehouses and manufacturing, AMRs utilize SLAM (Simultaneous Localization and Mapping), LIDAR, and depth cameras to navigate dynamically without requiring fixed tracks or magnetic strips.";

    // Animation logic
    function animate(time, speed, meshesMap) {
        // Spin the LIDAR
        if (meshesMap['LidarSensor']) {
            // The spinning part is the first child
            const lidarSpin = meshesMap['LidarSensor'].children[0];
            if (lidarSpin) {
                lidarSpin.rotation.y += 0.1 * speed;
            }
        }

        // Pulse the safety bumper / LED strip
        if (meshesMap['SafetyBumper']) {
            const intensity = (Math.sin(time * 0.003 * speed) * 0.5) + 0.5;
            // Transition color from cyan to blue based on pulse
            meshesMap['SafetyBumper'].material.color.setHSL(0.5 + (intensity * 0.1), 1.0, 0.5);
            meshesMap['SafetyBumper'].material.emissiveIntensity = 0.5 + intensity;
        }

        // Rotate wheels slowly to simulate movement
        ['WheelFrontLeft', 'WheelFrontRight', 'WheelRearLeft', 'WheelRearRight'].forEach(name => {
            if (meshesMap[name]) {
                meshesMap[name].rotation.x += 0.05 * speed;
            }
        });
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
export function createAutonomousMobileRobot() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
