import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 0.8,
        roughness: 0.2,
        metalness: 0.8
    });

    const neonGreen = new THREE.MeshStandardMaterial({
        color: 0x00ff88,
        emissive: 0x00ff88,
        emissiveIntensity: 0.8,
        roughness: 0.2,
        metalness: 0.8
    });

    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff3333,
        emissive: 0xff3333,
        emissiveIntensity: 0.8,
        roughness: 0.2,
        metalness: 0.8
    });

    // 1. Base Pedestal
    const baseGeom = new THREE.CylinderGeometry(0.8, 1.2, 0.5, 32);
    const baseMesh = new THREE.Mesh(baseGeom, darkSteel);
    baseMesh.position.set(0, 0.25, 0);
    group.add(baseMesh);
    
    parts.push({
        name: "Mounting Base",
        description: "Heavy steel base for structural stability.",
        material: "Dark Steel",
        function: "Anchors the station to the ground and houses power routing.",
        assemblyOrder: 1,
        connections: ["Main Mast"],
        failureEffect: "Station instability in high winds.",
        cascadeFailures: ["Main Mast"],
        originalPosition: {x: 0, y: 0.25, z: 0},
        explodedPosition: {x: 0, y: -2, z: 0},
        mesh: baseMesh
    });

    // 2. Main Mast
    const mastGeom = new THREE.CylinderGeometry(0.2, 0.2, 4, 16);
    const mastMesh = new THREE.Mesh(mastGeom, aluminum);
    mastMesh.position.set(0, 2.5, 0);
    group.add(mastMesh);

    parts.push({
        name: "Main Mast",
        description: "Central aluminum pillar.",
        material: "Aluminum",
        function: "Elevates sensors to proper sampling height.",
        assemblyOrder: 2,
        connections: ["Mounting Base", "Sensor Housing", "Anemometer"],
        failureEffect: "Sensors drop to ground level, skewing data.",
        cascadeFailures: ["All Sensors"],
        originalPosition: {x: 0, y: 2.5, z: 0},
        explodedPosition: {x: 0, y: 2.5, z: -3},
        mesh: mastMesh
    });

    // 3. Sensor Housing (Main Box)
    const housingGeom = new THREE.BoxGeometry(1.2, 1.5, 1.2);
    const housingMesh = new THREE.Mesh(housingGeom, plastic);
    housingMesh.position.set(0, 2.5, 0.3);
    group.add(housingMesh);

    parts.push({
        name: "Environment Housing",
        description: "Weatherproof enclosure for sensitive electronics.",
        material: "Polycarbonate Plastic",
        function: "Protects microcontrollers and gas sensors from rain and dust.",
        assemblyOrder: 3,
        connections: ["Main Mast", "Gas Sensors", "Particulate Matter Sensor"],
        failureEffect: "Water ingress damages internal electronics.",
        cascadeFailures: ["Gas Sensors", "Microcontroller"],
        originalPosition: {x: 0, y: 2.5, z: 0.3},
        explodedPosition: {x: 0, y: 2.5, z: 3},
        mesh: housingMesh
    });

    // 4. Gas Sensors Array
    const gasGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.2, 16);
    const gasMesh = new THREE.Mesh(gasGeom, chrome);
    gasMesh.position.set(0, 3.2, 0.9);
    gasMesh.rotation.x = Math.PI / 2;
    group.add(gasMesh);

    parts.push({
        name: "Electrochemical Gas Sensor Array",
        description: "High-precision gas detector.",
        material: "Chrome / Ceramic",
        function: "Detects NO2, SO2, CO, and Ozone concentrations in ppb.",
        assemblyOrder: 4,
        connections: ["Environment Housing", "Data Logger"],
        failureEffect: "Loss of gaseous pollutant data.",
        cascadeFailures: ["Air Quality Index calculation"],
        originalPosition: {x: 0, y: 3.2, z: 0.9},
        explodedPosition: {x: 2, y: 3.2, z: 2},
        mesh: gasMesh
    });

    // 5. Particulate Matter (PM) Laser Sensor
    const pmGeom = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    const pmMesh = new THREE.Mesh(pmGeom, steel);
    pmMesh.position.set(0.6, 2.0, 0.3);
    group.add(pmMesh);

    // PM Laser Glow
    const pmGlowGeom = new THREE.PlaneGeometry(0.3, 0.3);
    const pmGlowMesh = new THREE.Mesh(pmGlowGeom, neonBlue);
    pmGlowMesh.position.set(0.6, 2.0, 0.51);
    group.add(pmGlowMesh);

    parts.push({
        name: "Optical PM2.5/PM10 Sensor",
        description: "Laser scattering particulate sensor.",
        material: "Steel / Glass",
        function: "Measures density of fine particulate matter using laser scattering.",
        assemblyOrder: 5,
        connections: ["Environment Housing"],
        failureEffect: "Inability to detect smoke or dust.",
        cascadeFailures: [],
        originalPosition: {x: 0.6, y: 2.0, z: 0.3},
        explodedPosition: {x: 3, y: 2.0, z: 0},
        mesh: pmMesh
    });

    // 6. Anemometer (Wind Speed)
    const anemometerGroup = new THREE.Group();
    anemometerGroup.position.set(0, 4.6, 0);

    const anemoBase = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.3), aluminum);
    anemometerGroup.add(anemoBase);

    const crossArm1 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.8), aluminum);
    crossArm1.rotation.z = Math.PI / 2;
    crossArm1.position.y = 0.15;
    anemometerGroup.add(crossArm1);

    const crossArm2 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.8), aluminum);
    crossArm2.rotation.x = Math.PI / 2;
    crossArm2.position.y = 0.15;
    anemometerGroup.add(crossArm2);

    // Cups
    for(let i=0; i<4; i++) {
        const cup = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16, 0, Math.PI), plastic);
        const angle = (i * Math.PI) / 2;
        cup.position.set(Math.cos(angle)*0.4, 0.15, Math.sin(angle)*0.4);
        cup.rotation.y = angle;
        anemometerGroup.add(cup);
    }

    group.add(anemometerGroup);

    parts.push({
        name: "Cup Anemometer",
        description: "Rotary wind speed sensor.",
        material: "Plastic / Aluminum",
        function: "Measures wind velocity to contextualize pollutant dispersion.",
        assemblyOrder: 6,
        connections: ["Main Mast"],
        failureEffect: "Missing wind data for dispersion models.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 4.6, z: 0},
        explodedPosition: {x: 0, y: 6, z: 0},
        mesh: anemometerGroup
    });

    // 7. Solar Panel
    const solarGeom = new THREE.BoxGeometry(1.5, 0.05, 2);
    const solarMesh = new THREE.Mesh(solarGeom, tinted);
    solarMesh.position.set(0, 4.0, -1.0);
    solarMesh.rotation.x = Math.PI / 4;
    group.add(solarMesh);

    parts.push({
        name: "Photovoltaic Panel",
        description: "Monocrystalline solar array.",
        material: "Glass / Silicon",
        function: "Provides off-grid power to the station.",
        assemblyOrder: 7,
        connections: ["Main Mast", "Battery Pack"],
        failureEffect: "Loss of power during daylight, draining battery.",
        cascadeFailures: ["Battery Pack", "All Sensors"],
        originalPosition: {x: 0, y: 4.0, z: -1.0},
        explodedPosition: {x: 0, y: 5.0, z: -4},
        mesh: solarMesh
    });

    const description = "A high-tech environmental monitoring station equipped with laser particulate sensors, electrochemical gas detectors, and meteorological instruments to provide real-time air quality indexing.";

    const quizQuestions = [
        {
            question: "Which sensor is primarily responsible for detecting smoke and fine dust?",
            options: [
                "Cup Anemometer",
                "Electrochemical Gas Sensor",
                "Optical PM2.5/PM10 Sensor",
                "Photovoltaic Panel"
            ],
            correct: 2,
            explanation: "The Optical PM sensor uses laser scattering to count and size fine particles in the air, such as smoke (PM2.5) and dust (PM10).",
            difficulty: "Medium"
        },
        {
            question: "Why does the station include an anemometer?",
            options: [
                "To power the station with wind energy",
                "To cool down the internal electronics",
                "To measure wind speed to predict pollutant dispersion",
                "To scare away birds"
            ],
            correct: 2,
            explanation: "Wind speed and direction are critical meteorological factors that determine how air pollutants move and disperse in the environment.",
            difficulty: "Easy"
        },
        {
            question: "What is the consequence if the Environmental Housing fails?",
            options: [
                "The station will fly away",
                "Water ingress will damage internal electronics",
                "The solar panel will overcharge",
                "The anemometer will spin backwards"
            ],
            correct: 1,
            explanation: "The housing protects sensitive microcontrollers and sensors from rain, humidity, and dust. Failure leads to electronic shorts.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Spin anemometer based on wind (time)
        const anemo = parts.find(p => p.name === "Cup Anemometer")?.mesh;
        if (anemo) {
            anemo.rotation.y = time * 2 * speed;
        }

        // Pulse the PM sensor laser glow
        const glowPhase = (Math.sin(time * 5 * speed) + 1) / 2; // 0 to 1
        pmGlowMesh.material.emissiveIntensity = 0.5 + (glowPhase * 1.5);
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createAirQualityStation() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
