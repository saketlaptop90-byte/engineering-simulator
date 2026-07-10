import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const laserMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffcc, transparent: true, opacity: 0.8 });
    const solarPanelMaterial = new THREE.MeshStandardMaterial({ color: 0x0a1e3f, roughness: 0.2, metalness: 0.9, wireframe: true });
    const goldFoilMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.4, metalness: 0.8 });

    // 1. Central Core Spacecraft (Main bus)
    const coreGeometry = new THREE.CylinderGeometry(2, 2, 1.5, 6); // hexagonal
    const coreMesh = new THREE.Mesh(coreGeometry, goldFoilMaterial);
    coreMesh.rotation.x = Math.PI / 2;
    group.add(coreMesh);
    
    parts.push({
        name: "Main Bus (Sciencecraft)",
        description: "The central hexagonal bus housing the payload and propulsion.",
        material: "Gold Foil",
        function: "Houses critical subsystems, thermal control, and communications.",
        assemblyOrder: 1,
        connections: ["Telescope Assemblies", "Solar Array", "Communication Antenna"],
        failureEffect: "Complete loss of mission; inability to maintain thermal stability or communicate.",
        cascadeFailures: ["Telescope Assembly", "Laser System", "Micro-thrusters"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -5 },
        mesh: coreMesh
    });

    // 2. Solar Panel Hat
    const solarGeometry = new THREE.CylinderGeometry(2.2, 2.2, 0.1, 32);
    const solarMesh = new THREE.Mesh(solarGeometry, solarPanelMaterial);
    solarMesh.position.set(0, 0, 0.8);
    coreMesh.add(solarMesh);

    parts.push({
        name: "Solar Array Shield",
        description: "Top-mounted solar array providing power and thermal shielding.",
        material: "Photovoltaic cells / Carbon Fiber",
        function: "Generates power and shades the highly sensitive payload from direct sunlight.",
        assemblyOrder: 2,
        connections: ["Main Bus"],
        failureEffect: "Loss of power or thermal gradient disruption causing optical misalignment.",
        cascadeFailures: ["Main Bus", "Laser System"],
        originalPosition: { x: 0, y: 0, z: 0.8 },
        explodedPosition: { x: 0, y: 0, z: 4 },
        mesh: solarMesh
    });

    // 3. Y-Tube Payload Structure (Inside the bus, simplified representation)
    const yTubeMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.6, roughness: 0.3 });
    const yTubeGroup = new THREE.Group();
    
    const tube1Geom = new THREE.CylinderGeometry(0.4, 0.4, 3, 16);
    const tube1 = new THREE.Mesh(tube1Geom, yTubeMaterial);
    tube1.rotation.z = Math.PI / 3;
    yTubeGroup.add(tube1);

    const tube2Geom = new THREE.CylinderGeometry(0.4, 0.4, 3, 16);
    const tube2 = new THREE.Mesh(tube2Geom, yTubeMaterial);
    tube2.rotation.z = -Math.PI / 3;
    yTubeGroup.add(tube2);

    coreMesh.add(yTubeGroup);

    parts.push({
        name: "Y-Tube Payload Assembly",
        description: "The ultra-stable optical bench structure.",
        material: "Silicon Carbide (SiC)",
        function: "Houses the telescopes and optical benches at the required 60-degree angle.",
        assemblyOrder: 3,
        connections: ["Main Bus", "Telescope Assembly 1", "Telescope Assembly 2"],
        failureEffect: "Optical misalignment, breaking the laser link.",
        cascadeFailures: ["Interferometer measurement"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 4, z: 0 },
        mesh: yTubeGroup
    });

    // 4. Test Mass Cages (Gravitational Reference Sensors)
    const gsrGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    
    const gsr1 = new THREE.Mesh(gsrGeometry, steel);
    gsr1.position.set(0.8, 1.2, 0);
    yTubeGroup.add(gsr1);

    const testMass1 = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 0.15), new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 1, roughness: 0.1 }));
    gsr1.add(testMass1);

    const gsr2 = new THREE.Mesh(gsrGeometry, steel);
    gsr2.position.set(-0.8, 1.2, 0);
    yTubeGroup.add(gsr2);

    const testMass2 = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 0.15), new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 1, roughness: 0.1 }));
    gsr2.add(testMass2);

    parts.push({
        name: "Gravitational Reference Sensors (GRS)",
        description: "Houses the free-falling Gold-Platinum test masses.",
        material: "Gold-Platinum alloy / Ceramic",
        function: "Provides a perfect free-fall reference by shielding the test mass from all non-gravitational forces.",
        assemblyOrder: 4,
        connections: ["Y-Tube Payload Assembly", "Optical Bench"],
        failureEffect: "Test mass disturbed by spacecraft jitter; inability to detect gravitational waves.",
        cascadeFailures: ["Drag-free Control System"],
        originalPosition: { x: 0, y: 1.2, z: 0 },
        explodedPosition: { x: 0, y: 6, z: 0 },
        mesh: gsr1 // binding to one for explosion
    });

    // 5. Laser Links (Beams shooting out)
    const laserBeam1Geom = new THREE.CylinderGeometry(0.02, 0.05, 10, 8);
    const laserBeam1 = new THREE.Mesh(laserBeam1Geom, laserMaterial);
    laserBeam1.position.set(3, 4, 0);
    laserBeam1.rotation.z = -Math.PI / 6;
    yTubeGroup.add(laserBeam1);

    const laserBeam2Geom = new THREE.CylinderGeometry(0.02, 0.05, 10, 8);
    const laserBeam2 = new THREE.Mesh(laserBeam2Geom, laserMaterial);
    laserBeam2.position.set(-3, 4, 0);
    laserBeam2.rotation.z = Math.PI / 6;
    yTubeGroup.add(laserBeam2);

    parts.push({
        name: "Inter-spacecraft Laser Link",
        description: "The 2.5 million kilometer long laser beam connecting spacecraft.",
        material: "Photons",
        function: "Measures picometer-scale distance changes between free-falling test masses.",
        assemblyOrder: 5,
        connections: ["Optical Bench"],
        failureEffect: "Loss of interferometer arm, reducing detector sensitivity or completely breaking the array.",
        cascadeFailures: [],
        originalPosition: { x: 3, y: 4, z: 0 },
        explodedPosition: { x: 8, y: 8, z: 0 },
        mesh: laserBeam1
    });

    const quizQuestions = [
        {
            question: "Why does LISA form a triangular constellation in space rather than using a single straight line?",
            options: [
                "To reduce fuel consumption",
                "To provide two independent interferometer arms and determine wave polarization",
                "To prevent the spacecraft from drifting into the Sun",
                "To make the laser beams visible from Earth"
            ],
            correct: 1,
            explanation: "The triangular shape provides three 2.5-million-kilometer arms, effectively creating two independent interferometers. This allows LISA to measure both polarizations of incoming gravitational waves.",
            difficulty: "Medium"
        },
        {
            question: "What is the primary purpose of the 'drag-free control' system on the LISA spacecraft?",
            options: [
                "To eliminate atmospheric drag in Low Earth Orbit",
                "To counteract the solar wind using massive sails",
                "To shield the test masses from all non-gravitational forces, effectively flying the spacecraft around the test mass",
                "To brake the spacecraft when arriving at its final orbit"
            ],
            correct: 2,
            explanation: "The drag-free system uses ultra-precise micro-thrusters to constantly adjust the spacecraft's position so it doesn't touch the free-falling test mass inside, shielding it from solar radiation pressure and other non-gravitational forces.",
            difficulty: "Hard"
        },
        {
            question: "What material are the free-falling test masses inside the Gravitational Reference Sensors made of?",
            options: [
                "Pure Titanium",
                "Silicon Carbide",
                "Carbon Nanotubes",
                "A Gold-Platinum alloy"
            ],
            correct: 3,
            explanation: "The test masses are 46mm cubes made of a gold-platinum alloy. This specific mixture minimizes magnetic susceptibility while maintaining a high density, which is crucial to minimize disturbances from magnetic fields and cosmic rays.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Slowly rotate the entire spacecraft to simulate orbit stabilization
        group.rotation.y = time * 0.05 * speed;

        // Pulsate the laser beams
        const pulse = (Math.sin(time * 5 * speed) + 1) / 2; // 0 to 1
        laserMaterial.opacity = 0.4 + pulse * 0.6;
        
        // Slightly vibrate the test masses to simulate tiny perturbations (exaggerated)
        testMass1.position.x = Math.sin(time * 20 * speed) * 0.005;
        testMass2.position.x = Math.cos(time * 23 * speed) * 0.005;
    }

    return {
        group,
        parts,
        description: "Space-based Gravitational Wave Interferometer (LISA) Arm.",
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createInterferometerArm() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
