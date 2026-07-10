import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom Materials
    const goldFoil = new THREE.MeshPhysicalMaterial({
        color: 0xffd700,
        metalness: 1.0,
        roughness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const glowingBlue = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.8
    });

    const glowingRed = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 2.0
    });
    
    const glowingGreen = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 1.5
    });

    const solarPanelMat = new THREE.MeshPhysicalMaterial({
        color: 0x0a1b2a,
        metalness: 0.8,
        roughness: 0.1,
        clearcoat: 1.0,
        emissive: 0x001133,
        emissiveIntensity: 0.2
    });

    // 1. Central Bus (Main Body)
    const busGeo = new THREE.BoxGeometry(2, 2.5, 2);
    const bus = new THREE.Mesh(busGeo, goldFoil);
    group.add(bus);
    meshes.bus = bus;
    parts.push({
        name: "Main Satellite Bus",
        description: "The primary structure housing the satellite's power, computing, and life-support subsystems.",
        material: "goldFoil",
        function: "Structural integrity and thermal protection",
        assemblyOrder: 1,
        connections: ["Solar Arrays", "Communication Dish", "Sensor Array"],
        failureEffect: "Total system failure due to exposure to extreme space environment.",
        cascadeFailures: ["Power Systems", "Data Transmission"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });

    // 2. Solar Arrays (Left and Right)
    const panelGeo = new THREE.BoxGeometry(6, 1.5, 0.1);
    
    const leftArray = new THREE.Group();
    leftArray.position.set(-4.5, 0, 0);
    const leftPanel = new THREE.Mesh(panelGeo, solarPanelMat);
    leftArray.add(leftPanel);
    const leftSupport = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.5), darkSteel);
    leftSupport.rotation.z = Math.PI / 2;
    leftSupport.position.set(2.5, 0, 0);
    leftArray.add(leftSupport);
    group.add(leftArray);
    meshes.leftArray = leftArray;

    const rightArray = new THREE.Group();
    rightArray.position.set(4.5, 0, 0);
    const rightPanel = new THREE.Mesh(panelGeo, solarPanelMat);
    rightArray.add(rightPanel);
    const rightSupport = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.5), darkSteel);
    rightSupport.rotation.z = Math.PI / 2;
    rightSupport.position.set(-2.5, 0, 0);
    rightArray.add(rightSupport);
    group.add(rightArray);
    meshes.rightArray = rightArray;

    parts.push({
        name: "Photovoltaic Solar Arrays",
        description: "High-efficiency multi-junction solar panels to capture solar radiation and convert it into electrical power.",
        material: "solarPanelMat",
        function: "Power generation",
        assemblyOrder: 2,
        connections: ["Main Satellite Bus"],
        failureEffect: "Loss of power over time as batteries drain.",
        cascadeFailures: ["Telemetry", "Sensors", "Propulsion"],
        originalPosition: { x: -4.5, y: 0, z: 0 }, // Using left as rep
        explodedPosition: { x: -8, y: 0, z: 0 }
    });

    // 3. High-Gain Communication Dish
    const dishGroup = new THREE.Group();
    dishGroup.position.set(0, 1.25, 0);
    
    const dishGeo = new THREE.SphereGeometry(1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 3);
    const dish = new THREE.Mesh(dishGeo, aluminum);
    dish.rotation.x = Math.PI;
    dish.position.set(0, 1, 0);
    dishGroup.add(dish);

    const antennaGeo = new THREE.CylinderGeometry(0.02, 0.05, 1);
    const antenna = new THREE.Mesh(antennaGeo, darkSteel);
    antenna.position.set(0, 1.5, 0);
    dishGroup.add(antenna);
    
    const transmitterOrbGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const transmitterOrb = new THREE.Mesh(transmitterOrbGeo, glowingBlue);
    transmitterOrb.position.set(0, 2, 0);
    dishGroup.add(transmitterOrb);

    group.add(dishGroup);
    meshes.dishGroup = dishGroup;
    meshes.transmitterOrb = transmitterOrb;

    parts.push({
        name: "High-Gain Antenna",
        description: "Parabolic dish used to transmit vast amounts of scientific data back to Earth stations.",
        material: "aluminum",
        function: "Long-range data transmission",
        assemblyOrder: 3,
        connections: ["Main Satellite Bus"],
        failureEffect: "Inability to send research data or receive command updates.",
        cascadeFailures: ["Mission Abort"],
        originalPosition: { x: 0, y: 2.25, z: 0 },
        explodedPosition: { x: 0, y: 6, z: 0 }
    });

    // 4. Astrophysics Sensor Array
    const sensorGroup = new THREE.Group();
    sensorGroup.position.set(0, -1.25, 1);
    
    const tubeGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.5, 32);
    const tube = new THREE.Mesh(tubeGeo, chrome);
    tube.rotation.x = Math.PI / 2;
    tube.position.set(0, 0, 0.75);
    sensorGroup.add(tube);
    
    const lensGeo = new THREE.SphereGeometry(0.35, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const lens = new THREE.Mesh(lensGeo, tinted);
    lens.position.set(0, 0, 1.5);
    sensorGroup.add(lens);

    const scanningLaserGeo = new THREE.CylinderGeometry(0.02, 0.02, 5);
    const scanningLaser = new THREE.Mesh(scanningLaserGeo, glowingRed);
    scanningLaser.rotation.x = Math.PI / 2;
    scanningLaser.position.set(0, 0, 4);
    sensorGroup.add(scanningLaser);
    meshes.scanningLaser = scanningLaser;

    group.add(sensorGroup);
    meshes.sensorGroup = sensorGroup;

    parts.push({
        name: "Deep Space Sensor Array",
        description: "Advanced optical and infrared telescope for capturing high-resolution images of distant galaxies and nebulae.",
        material: "chrome",
        function: "Scientific observation",
        assemblyOrder: 4,
        connections: ["Main Satellite Bus"],
        failureEffect: "Loss of primary mission objectives. No scientific data gathered.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: -1.25, z: 1 },
        explodedPosition: { x: 0, y: -3, z: 4 }
    });

    // 5. Thruster Module (Propulsion)
    const thrusterGroup = new THREE.Group();
    thrusterGroup.position.set(0, -1.25, -1);
    
    const engineBellGeo = new THREE.CylinderGeometry(0.5, 0.2, 0.8, 16);
    const engineBell = new THREE.Mesh(engineBellGeo, darkSteel);
    engineBell.rotation.x = -Math.PI / 2;
    engineBell.position.set(0, 0, -0.4);
    thrusterGroup.add(engineBell);

    const engineGlowGeo = new THREE.CylinderGeometry(0.4, 0.0, 1.5, 16);
    const engineGlow = new THREE.Mesh(engineGlowGeo, glowingBlue);
    engineGlow.rotation.x = -Math.PI / 2;
    engineGlow.position.set(0, 0, -1.3);
    thrusterGroup.add(engineGlow);
    meshes.engineGlow = engineGlow;

    group.add(thrusterGroup);
    meshes.thrusterGroup = thrusterGroup;

    parts.push({
        name: "Ion Propulsion Thruster",
        description: "Highly efficient electrical propulsion system used for orbital corrections and deep space maneuvers.",
        material: "darkSteel",
        function: "Orbital maneuvering",
        assemblyOrder: 5,
        connections: ["Main Satellite Bus"],
        failureEffect: "Inability to maintain orbit or alter trajectory.",
        cascadeFailures: ["Orbital Decay"],
        originalPosition: { x: 0, y: -1.25, z: -1 },
        explodedPosition: { x: 0, y: -4, z: -4 }
    });

    // 6. Navigation Star Trackers
    const trackerGeo = new THREE.BoxGeometry(0.4, 0.4, 0.6);
    const tracker = new THREE.Mesh(trackerGeo, aluminum);
    tracker.position.set(1.2, 1, 1.2);
    tracker.lookAt(2, 2, 2);
    
    const trackerLensGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.1);
    const trackerLens = new THREE.Mesh(trackerLensGeo, glowingGreen);
    trackerLens.rotation.x = Math.PI / 2;
    trackerLens.position.set(0, 0, 0.3);
    tracker.add(trackerLens);

    group.add(tracker);
    meshes.tracker = tracker;

    parts.push({
        name: "Star Tracker Navigation",
        description: "Optical sensors that measure the positions of stars to calculate the satellite's precise orientation in space.",
        material: "aluminum",
        function: "Attitude determination",
        assemblyOrder: 6,
        connections: ["Main Satellite Bus"],
        failureEffect: "Satellite loses orientation, unable to point solar panels or sensors correctly.",
        cascadeFailures: ["Power Systems", "Data Transmission"],
        originalPosition: { x: 1.2, y: 1, z: 1.2 },
        explodedPosition: { x: 3, y: 3, z: 3 }
    });

    const description = "The Astrophysics Orbital Satellite is a cutting-edge deep space observatory designed to analyze cosmic phenomena, capture high-resolution imagery of distant galaxies, and stream immense volumes of data back to Earth using high-gain telemetry. It features deployable multi-junction solar arrays and an ion propulsion system for precise orbital adjustments.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Ion Propulsion Thruster on this satellite?",
            options: [
                "To launch the satellite from Earth's surface",
                "To generate electrical power",
                "For highly efficient orbital maneuvering and corrections",
                "To cool the sensor arrays"
            ],
            correct: 2,
            explanation: "Ion propulsion systems are highly efficient electrical engines used in the vacuum of space for continuous, low-thrust orbital maneuvering.",
            difficulty: "Medium"
        },
        {
            question: "Why does the satellite use Star Trackers?",
            options: [
                "To map alien civilizations",
                "To calculate precise orientation (attitude) by comparing visible stars to an internal catalog",
                "To measure the speed of light",
                "To communicate with other satellites"
            ],
            correct: 1,
            explanation: "Star trackers are vital navigational tools that determine a spacecraft's orientation by analyzing the star field around it.",
            difficulty: "Hard"
        },
        {
            question: "What is the consequence of a total failure of the High-Gain Antenna?",
            options: [
                "The satellite will explode",
                "The satellite will lose its orbit immediately",
                "It will be unable to send scientific data or receive commands, effectively ending the mission",
                "The solar panels will stop generating power"
            ],
            correct: 2,
            explanation: "The high-gain antenna is the primary conduit for data. Without it, the satellite is isolated, and no data can be retrieved.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, exploded) {
        // Subtle floating motion for the whole satellite
        group.position.y = Math.sin(time * 0.5 * speed) * 0.2;
        group.rotation.y += 0.005 * speed;

        // Rotate the high-gain antenna dish slowly to "track" Earth
        if (meshes.dishGroup && !exploded) {
            meshes.dishGroup.rotation.y = Math.sin(time * 0.3 * speed) * 0.5;
            meshes.dishGroup.rotation.x = Math.sin(time * 0.2 * speed) * 0.2;
        }

        // Pulse the transmitter orb
        if (meshes.transmitterOrb) {
            const scale = 1 + Math.sin(time * 5 * speed) * 0.2;
            meshes.transmitterOrb.scale.set(scale, scale, scale);
            meshes.transmitterOrb.material.emissiveIntensity = 1.5 + Math.sin(time * 10 * speed) * 0.5;
        }

        // Engine glow pulsing
        if (meshes.engineGlow) {
            const engineScale = 1 + Math.random() * 0.1 * speed;
            meshes.engineGlow.scale.set(1, engineScale, 1);
            meshes.engineGlow.material.opacity = 0.6 + Math.random() * 0.4;
        }

        // Rotate solar arrays to face the "sun"
        if (meshes.leftArray && meshes.rightArray && !exploded) {
            const targetRotation = Math.sin(time * 0.1 * speed) * 0.5;
            meshes.leftArray.rotation.x = targetRotation;
            meshes.rightArray.rotation.x = targetRotation;
        }

        // Sensor Array Scanning Laser Sweep
        if (meshes.scanningLaser && !exploded) {
            meshes.scanningLaser.rotation.z = Math.sin(time * 2 * speed) * 0.3;
            meshes.scanningLaser.material.opacity = (Math.sin(time * 10 * speed) > 0.8) ? 1 : 0.2;
        }
    }

    return { group, parts, description, quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createOrbitalSatellite() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
