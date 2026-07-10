import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Glowing Materials
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        metalness: 0.1,
        roughness: 0.1
    });

    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 0.5,
        metalness: 0.1,
        roughness: 0.1
    });

    // 1. Mount Base
    const baseGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.5, 32);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.position.set(0, 0.25, 0);
    group.add(baseMesh);
    parts.push({
        name: "Mounting Base",
        description: "Primary interface plate attaching the star tracker to the spacecraft bus.",
        material: "darkSteel",
        function: "Structural support and thermal conduction to the spacecraft body.",
        assemblyOrder: 1,
        connections: ["Main Housing", "Spacecraft Bus"],
        failureEffect: "Misalignment of the tracker, causing attitude control errors.",
        cascadeFailures: ["Complete loss of spacecraft attitude knowledge"],
        originalPosition: {x: 0, y: 0.25, z: 0},
        explodedPosition: {x: 0, y: -2, z: 0},
        mesh: baseMesh
    });

    // 2. Main Housing
    const housingGeo = new THREE.BoxGeometry(2, 2.5, 2);
    const housingMesh = new THREE.Mesh(housingGeo, aluminum);
    housingMesh.position.set(0, 1.75, 0);
    group.add(housingMesh);
    parts.push({
        name: "Main Housing",
        description: "Enclosure for the sensor and processing electronics.",
        material: "aluminum",
        function: "Protects delicate electronics from radiation, micrometeoroids, and thermal extremes.",
        assemblyOrder: 2,
        connections: ["Mounting Base", "Processing Unit", "Optical Baffle"],
        failureEffect: "Exposure of internal components to space environment.",
        cascadeFailures: ["Radiation damage to CPU", "Thermal runaway"],
        originalPosition: {x: 0, y: 1.75, z: 0},
        explodedPosition: {x: 0, y: 1.75, z: 3},
        mesh: housingMesh
    });

    // 3. Processing Unit
    const cpuGeo = new THREE.BoxGeometry(1.5, 1.5, 0.5);
    const cpuMesh = new THREE.Mesh(cpuGeo, copper);
    cpuMesh.position.set(0, 1.75, -0.75);
    group.add(cpuMesh);
    parts.push({
        name: "Data Processing Unit (DPU)",
        description: "High-performance compute module for star pattern recognition.",
        material: "copper",
        function: "Processes image data, matches star patterns against onboard catalog, outputs attitude quaternions.",
        assemblyOrder: 3,
        connections: ["Main Housing", "Sensor Array"],
        failureEffect: "Inability to identify stars from images.",
        cascadeFailures: ["Attitude control system fallback to less accurate sensors (e.g., sun sensors)"],
        originalPosition: {x: 0, y: 1.75, z: -0.75},
        explodedPosition: {x: 0, y: 1.75, z: -4},
        mesh: cpuMesh
    });

    // 4. Heat Sink
    const heatSinkGeo = new THREE.BoxGeometry(1.8, 2, 0.3);
    const heatSinkMesh = new THREE.Mesh(heatSinkGeo, steel);
    heatSinkMesh.position.set(0, 1.75, -1.15);
    group.add(heatSinkMesh);
    // Add fins to heat sink
    for (let i = -0.7; i <= 0.7; i += 0.2) {
        const finGeo = new THREE.BoxGeometry(0.05, 2, 0.3);
        const finMesh = new THREE.Mesh(finGeo, steel);
        finMesh.position.set(i, 0, -0.2);
        heatSinkMesh.add(finMesh);
    }
    parts.push({
        name: "Thermal Radiator",
        description: "Passive cooling system for the processing electronics and sensor.",
        material: "steel",
        function: "Dissipates waste heat into deep space to maintain optimal sensor temperature.",
        assemblyOrder: 4,
        connections: ["Processing Unit"],
        failureEffect: "Overheating of the DPU and sensor array.",
        cascadeFailures: ["Increased thermal noise in images", "DPU shutdown"],
        originalPosition: {x: 0, y: 1.75, z: -1.15},
        explodedPosition: {x: 0, y: 1.75, z: -6},
        mesh: heatSinkMesh
    });

    // 5. Sensor Array
    const sensorGeo = new THREE.PlaneGeometry(1, 1);
    const sensorMesh = new THREE.Mesh(sensorGeo, neonBlue);
    sensorMesh.rotation.x = -Math.PI / 2;
    sensorMesh.position.set(0, 3.01, 0);
    group.add(sensorMesh);
    parts.push({
        name: "CMOS Active Pixel Sensor",
        description: "High-sensitivity imaging array.",
        material: "neonBlue",
        function: "Captures photons from distant stars and converts them to digital signals.",
        assemblyOrder: 5,
        connections: ["Processing Unit", "Lens Assembly"],
        failureEffect: "No image generation; dead pixels or high dark current.",
        cascadeFailures: ["Loss of star tracking capability"],
        originalPosition: {x: 0, y: 3.01, z: 0},
        explodedPosition: {x: -3, y: 3.01, z: 0},
        mesh: sensorMesh
    });

    // 6. Optical Lens Assembly
    const lensHousingGeo = new THREE.CylinderGeometry(0.8, 1.2, 1.5, 32);
    const lensHousingMesh = new THREE.Mesh(lensHousingGeo, chrome);
    lensHousingMesh.position.set(0, 3.75, 0);
    group.add(lensHousingMesh);
    
    const lensGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.1, 32);
    const lensMesh = new THREE.Mesh(lensGeo, tinted);
    lensMesh.position.set(0, 4.5, 0);
    group.add(lensMesh);
    
    parts.push({
        name: "Optical Lens System",
        description: "Multi-element lens system.",
        material: "chrome / tinted glass",
        function: "Focuses starlight onto the CMOS sensor while minimizing aberrations.",
        assemblyOrder: 6,
        connections: ["Sensor Array", "Optical Baffle"],
        failureEffect: "Defocused images, inability to resolve individual stars.",
        cascadeFailures: ["Star pattern recognition failure"],
        originalPosition: {x: 0, y: 3.75, z: 0},
        explodedPosition: {x: 3, y: 3.75, z: 0},
        mesh: lensHousingMesh // representing the whole lens group
    });

    // 7. Optical Baffle
    const baffleGeo = new THREE.CylinderGeometry(1.2, 0.8, 3, 32, 1, true);
    const baffleMesh = new THREE.Mesh(baffleGeo, darkSteel);
    baffleMesh.position.set(0, 6.0, 0);
    // double-sided material for baffle
    baffleMesh.material.side = THREE.DoubleSide;
    group.add(baffleMesh);
    
    // Add rings inside baffle
    for(let y = 4.8; y < 7.2; y += 0.4) {
        const radius = 0.8 + (1.2 - 0.8) * ((y - 4.5) / 3);
        const ringGeo = new THREE.TorusGeometry(radius - 0.05, 0.05, 8, 32);
        const ringMesh = new THREE.Mesh(ringGeo, rubber);
        ringMesh.position.set(0, y, 0);
        ringMesh.rotation.x = Math.PI/2;
        group.add(ringMesh);
    }
    
    parts.push({
        name: "Stray Light Baffle",
        description: "Conical light shield with internal vanes.",
        material: "darkSteel",
        function: "Prevents off-axis stray light (from the Sun, Earth, or Moon) from entering the lens and blinding the sensor.",
        assemblyOrder: 7,
        connections: ["Main Housing", "Optical Lens System"],
        failureEffect: "Sensor blinded by sunlight or albedo.",
        cascadeFailures: ["Tracker outage during specific orbital phases"],
        originalPosition: {x: 0, y: 6.0, z: 0},
        explodedPosition: {x: 0, y: 9.0, z: 0},
        mesh: baffleMesh
    });
    
    // 8. Status Indicators
    const indicatorGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const indicatorMesh1 = new THREE.Mesh(indicatorGeo, neonBlue);
    indicatorMesh1.position.set(0.5, 2.5, 1.05);
    group.add(indicatorMesh1);

    const indicatorMesh2 = new THREE.Mesh(indicatorGeo, neonRed);
    indicatorMesh2.position.set(-0.5, 2.5, 1.05);
    group.add(indicatorMesh2);
    
    parts.push({
        name: "Telemetry Indicators",
        description: "Diagnostic LEDs (conceptual, for visualization).",
        material: "neon",
        function: "Indicates power status and tracking lock state.",
        assemblyOrder: 8,
        connections: ["Main Housing", "Processing Unit"],
        failureEffect: "Loss of visual diagnostic capability.",
        cascadeFailures: ["None"],
        originalPosition: {x: 0, y: 2.5, z: 1.05},
        explodedPosition: {x: 0, y: 2.5, z: 5},
        mesh: indicatorMesh1
    });

    const description = "The Space Star Tracker is a critical attitude determination instrument used on spacecraft. It functions effectively as a celestial compass, taking images of the starfield, identifying star patterns by comparing them to an onboard catalog, and calculating the spacecraft's precise orientation (attitude) in space. High-tech optical baffles prevent stray light from blinding the sensitive CMOS array, while a robust processing unit performs complex pattern recognition algorithms in real-time.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Stray Light Baffle?",
            options: [
                "To focus starlight onto the sensor",
                "To cool the processing unit",
                "To prevent off-axis light from blinding the sensor",
                "To protect the tracker from micrometeoroids"
            ],
            correct: 2,
            explanation: "The baffle uses a conical shape and internal vanes to block stray light from the Sun, Earth, or Moon, which would otherwise wash out the faint starlight.",
            difficulty: "Medium"
        },
        {
            question: "How does a star tracker determine the spacecraft's attitude?",
            options: [
                "By measuring the magnetic field of the Earth",
                "By tracking the position of the Sun",
                "By matching captured star images against an onboard catalog",
                "By measuring inertial forces during maneuvers"
            ],
            correct: 2,
            explanation: "Star trackers take pictures of the sky and use pattern recognition algorithms to match the observed stars with a known star catalog, yielding highly accurate orientation data.",
            difficulty: "Easy"
        },
        {
            question: "Why is a Thermal Radiator crucial for the star tracker?",
            options: [
                "To keep the lenses from freezing",
                "To dissipate heat and minimize thermal noise on the CMOS sensor",
                "To generate power for the DPU",
                "To provide structural rigidity"
            ],
            correct: 1,
            explanation: "CMOS and CCD sensors are highly sensitive to heat, which causes 'dark current' or thermal noise. The radiator dumps excess heat into space to keep the sensor cool.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Pulsate the blue indicator LED to simulate "tracking lock"
        indicatorMesh1.material.emissiveIntensity = 0.5 + 0.5 * Math.sin(time * speed * 5);
        
        // Scan the sensor color slightly to simulate processing
        sensorMesh.material.emissiveIntensity = 0.6 + 0.4 * Math.random();
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createStarTracker() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
