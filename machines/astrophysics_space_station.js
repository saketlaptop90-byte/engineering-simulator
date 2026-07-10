import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom glowing materials
    const neonBlue = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8,
        metalness: 0.5,
        roughness: 0.1
    });

    const glowingOrange = new THREE.MeshPhysicalMaterial({
        color: 0xff6600,
        emissive: 0xff4400,
        emissiveIntensity: 2.0,
        metalness: 0.8,
        roughness: 0.2
    });

    // 1. Central Hub
    const hubGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    const hub = new THREE.Mesh(hubGeometry, chrome);
    meshes.hub = hub;
    group.add(hub);
    parts.push({
        name: "Central Command Hub",
        description: "The core command and control center of the space station.",
        material: "chrome",
        function: "Houses the main supercomputer, life support routing, and primary communications array.",
        assemblyOrder: 1,
        connections: ["Habitat Ring", "Solar Arrays", "Docking Bays"],
        failureEffect: "Complete loss of station control and telemetry.",
        cascadeFailures: ["Life Support", "Attitude Control"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 }
    });

    // 2. Rotating Habitat Ring
    const ringGeometry = new THREE.TorusGeometry(6, 0.8, 16, 100);
    const ring = new THREE.Mesh(ringGeometry, aluminum);
    // Rotate ring so it is horizontal if needed, or vertical. Let's make it vertical along z axis by default, 
    // wait, torus by default is in XY plane. We will rotate it to lie in XZ plane:
    ring.rotation.x = Math.PI / 2;
    meshes.habitatRing = ring;
    group.add(ring);
    parts.push({
        name: "Habitat Ring",
        description: "Massive rotating ring structure providing artificial gravity.",
        material: "aluminum",
        function: "Accommodates crew quarters, hydroponics, and laboratories under 1g conditions.",
        assemblyOrder: 2,
        connections: ["Central Hub", "Spokes"],
        failureEffect: "Loss of artificial gravity, severe impact on crew health over time.",
        cascadeFailures: ["Hydroponics System"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 10 }
    });

    // 3. Ring Spokes (connecting hub to ring)
    const spokeGeometry = new THREE.CylinderGeometry(0.2, 0.2, 12, 16);
    const spoke1 = new THREE.Mesh(spokeGeometry, darkSteel);
    spoke1.rotation.z = Math.PI / 2; // lies along X axis
    const spoke2 = new THREE.Mesh(spokeGeometry, darkSteel);
    spoke2.rotation.x = Math.PI / 2; // lies along Z axis
    const spokes = new THREE.Group();
    spokes.add(spoke1);
    spokes.add(spoke2);
    meshes.spokes = spokes;
    group.add(spokes);
    parts.push({
        name: "Structural Spokes",
        description: "Four massive structural beams connecting the central hub to the habitat ring.",
        material: "darkSteel",
        function: "Transfers resources, power, and personnel between the hub and the habitat ring.",
        assemblyOrder: 3,
        connections: ["Central Hub", "Habitat Ring"],
        failureEffect: "Structural integrity compromised, potential catastrophic failure of ring.",
        cascadeFailures: ["Habitat Ring", "Resource Transit"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 5, y: 5, z: 5 }
    });

    // 4. Solar Arrays
    const solarGroup = new THREE.Group();
    const panelGeom = new THREE.BoxGeometry(10, 0.1, 3);
    const panel1 = new THREE.Mesh(panelGeom, tinted);
    panel1.position.set(8, 0, 0);
    const panel2 = new THREE.Mesh(panelGeom, tinted);
    panel2.position.set(-8, 0, 0);
    
    // truss connecting panels
    const trussGeom = new THREE.CylinderGeometry(0.3, 0.3, 16, 8);
    const truss = new THREE.Mesh(trussGeom, steel);
    truss.rotation.z = Math.PI / 2;
    
    solarGroup.add(panel1);
    solarGroup.add(panel2);
    solarGroup.add(truss);
    meshes.solarArrays = solarGroup;
    group.add(solarGroup);
    parts.push({
        name: "Photovoltaic Solar Arrays",
        description: "Massive high-efficiency solar panels deployed on either side of the station.",
        material: "tinted",
        function: "Generates the primary electrical power required for all station systems.",
        assemblyOrder: 4,
        connections: ["Central Hub"],
        failureEffect: "Loss of primary power, forcing station to run on auxiliary batteries.",
        cascadeFailures: ["Life Support", "Thermal Control"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -8, z: 0 }
    });

    // 5. Glowing Docking Bay
    const bayGeometry = new THREE.CylinderGeometry(1.2, 1.2, 3, 16);
    const dockingBay = new THREE.Mesh(bayGeometry, glowingOrange);
    dockingBay.position.set(0, 3, 0);
    meshes.dockingBay = dockingBay;
    group.add(dockingBay);
    parts.push({
        name: "Docking Bay",
        description: "Electromagnetically sealed docking port for incoming spacecraft.",
        material: "glowingOrange",
        function: "Allows safe docking and pressurized transfer of cargo and personnel.",
        assemblyOrder: 5,
        connections: ["Central Hub"],
        failureEffect: "Inability to receive supplies or evacuate crew.",
        cascadeFailures: ["Logistics"],
        originalPosition: { x: 0, y: 3, z: 0 },
        explodedPosition: { x: 0, y: 8, z: 0 }
    });

    // 6. Sensor Array / Antenna
    const antennaGeom = new THREE.CylinderGeometry(0.05, 0.05, 4, 8);
    const antenna = new THREE.Mesh(antennaGeom, steel);
    antenna.position.set(0, -3.5, 0);
    const dishGeom = new THREE.SphereGeometry(1, 16, 16, 0, Math.PI);
    const dish = new THREE.Mesh(dishGeom, neonBlue);
    dish.position.set(0, -5, 0);
    dish.rotation.x = -Math.PI / 2;
    const sensorGroup = new THREE.Group();
    sensorGroup.add(antenna);
    sensorGroup.add(dish);
    meshes.sensorArray = sensorGroup;
    group.add(sensorGroup);
    parts.push({
        name: "Deep Space Sensor Array",
        description: "High-gain antenna and multi-spectral sensor dish.",
        material: "steel and neonBlue",
        function: "Maintains high-bandwidth telemetry with Earth and scans for deep space anomalies.",
        assemblyOrder: 6,
        connections: ["Central Hub"],
        failureEffect: "Loss of communication and telemetry data.",
        cascadeFailures: ["Navigation", "Early Warning System"],
        originalPosition: { x: 0, y: -3.5, z: 0 },
        explodedPosition: { x: 0, y: -10, z: 0 }
    });

    const description = "A state-of-the-art Astrophysics Space Station featuring a massive rotating habitat ring for artificial gravity, extensive solar arrays for power, and a deep space sensor suite for scientific research.";

    const quizQuestions = [
        {
            question: "What is the primary function of the rotating Habitat Ring?",
            options: [
                "To generate electrical power",
                "To provide artificial gravity for the crew",
                "To deflect micrometeoroids",
                "To steer the station"
            ],
            correct: 1,
            explanation: "The rotating Habitat Ring generates centrifugal force, which simulates gravity and prevents muscle atrophy and bone density loss in the crew during long-duration missions.",
            difficulty: "easy"
        },
        {
            question: "Why does the failure of the Photovoltaic Solar Arrays cascade to Life Support and Thermal Control?",
            options: [
                "They share the same fluid loops",
                "Solar panels block radiation that damages life support",
                "Those systems require massive amounts of electrical power to function",
                "The solar arrays physically hold the life support systems in place"
            ],
            correct: 2,
            explanation: "Life support (oxygen generation, CO2 scrubbing) and thermal control (active cooling) are highly power-intensive. Without the main solar arrays, auxiliary batteries will quickly deplete, causing these systems to fail.",
            difficulty: "medium"
        },
        {
            question: "What geometric shape is primarily used for the high-gain telemetry dish?",
            options: [
                "A parabolic or hemispherical dish",
                "A flat rectangle",
                "A perfect cube",
                "A torus"
            ],
            correct: 0,
            explanation: "High-gain antennas use parabolic or hemispherical shapes to focus radio waves into a tight beam, allowing for long-distance communication with Earth.",
            difficulty: "medium"
        }
    ];

    function animate(time, speed, activeMeshes) {
        const m = activeMeshes || meshes;
        
        // Rotating the habitat ring and its spokes for artificial gravity (rotates around Y axis)
        if (m.habitatRing) m.habitatRing.rotation.z = time * speed * 0.5; // Since we rotated X by PI/2, Z is now the vertical spin
        if (m.spokes) m.spokes.rotation.y = time * speed * 0.5;
        
        // Slowly rotating the central hub
        if (m.hub) m.hub.rotation.y = time * speed * 0.1;
        
        // Pulsing the docking bay
        if (m.dockingBay) m.dockingBay.material.emissiveIntensity = 1.5 + Math.sin(time * speed * 2) * 0.5;
        
        // Orienting the solar arrays towards the sun (rotating slowly)
        if (m.solarArrays) {
            m.solarArrays.rotation.x = Math.sin(time * speed * 0.2) * 0.5;
        }

        // Sensor dish scanning movement
        if (m.sensorArray) {
            m.sensorArray.rotation.y = Math.sin(time * speed) * Math.PI / 4;
            m.sensorArray.children[1].material.emissiveIntensity = 1.0 + Math.abs(Math.sin(time * speed * 5)) * 0.5; // flickering neon
        }
    }

    return { group, parts, description, quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createSpaceStation() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
