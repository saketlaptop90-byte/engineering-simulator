import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom glowing materials
    const hotGlowMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xff4400,
        emissive: 0xff2200,
        emissiveIntensity: 2.0,
        metalness: 0.8,
        roughness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const coolAirMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x0088ff,
        emissive: 0x0044aa,
        emissiveIntensity: 1.5,
        metalness: 0.3,
        roughness: 0.1,
        transparent: true,
        opacity: 0.8
    });

    const neonBlueMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff });
    const neonOrangeMaterial = new THREE.MeshBasicMaterial({ color: 0xff8800 });

    // 1. Shaft (Connects Turbine and Compressor)
    const shaftGeometry = new THREE.CylinderGeometry(0.2, 0.2, 5, 32);
    const shaftMesh = new THREE.Mesh(shaftGeometry, chrome);
    shaftMesh.rotation.z = Math.PI / 2;
    group.add(shaftMesh);
    meshes.shaft = shaftMesh;

    parts.push({
        name: 'Connecting Shaft',
        description: 'A high-speed precision balanced shaft connecting the exhaust turbine to the intake compressor.',
        material: 'Chrome / Hardened Steel',
        function: 'Transmits rotational energy from the turbine to the compressor.',
        assemblyOrder: 1,
        connections: ['Exhaust Turbine', 'Compressor Impeller', 'Center Bearings'],
        failureEffect: 'Loss of boost, potential catastrophic housing failure due to unbalance.',
        cascadeFailures: ['Bearing destruction', 'Compressor wheel shattering'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 2, z: 0 }
    });

    // 2. Exhaust Turbine (Hot Side)
    const turbineGroup = new THREE.Group();
    turbineGroup.position.set(-2, 0, 0);
    
    // Core hub
    const turbineHubGeometry = new THREE.CylinderGeometry(0.1, 0.8, 1, 32);
    const turbineHubMesh = new THREE.Mesh(turbineHubGeometry, hotGlowMaterial);
    turbineHubMesh.rotation.z = Math.PI / 2;
    turbineGroup.add(turbineHubMesh);

    // Blades
    const turbineBladeGeometry = new THREE.BoxGeometry(0.1, 1.5, 0.4);
    for (let i = 0; i < 12; i++) {
        const blade = new THREE.Mesh(turbineBladeGeometry, darkSteel);
        const angle = (i / 12) * Math.PI * 2;
        blade.position.y = Math.cos(angle) * 0.5;
        blade.position.z = Math.sin(angle) * 0.5;
        blade.rotation.x = angle;
        blade.rotation.y = Math.PI / 6; // Pitch angle
        turbineGroup.add(blade);
    }
    group.add(turbineGroup);
    meshes.turbine = turbineGroup;

    parts.push({
        name: 'Exhaust Turbine',
        description: 'Constructed from Inconel or advanced ceramics to withstand extreme exhaust gas temperatures.',
        material: 'Inconel / High-Temp Alloy',
        function: 'Converts thermal and kinetic energy of exhaust gases into mechanical rotational energy.',
        assemblyOrder: 2,
        connections: ['Connecting Shaft', 'Turbine Housing'],
        failureEffect: 'Turbine wheel melt or shatter, immediate loss of engine power.',
        cascadeFailures: ['Exhaust blockage', 'Shaft snap'],
        originalPosition: { x: -2, y: 0, z: 0 },
        explodedPosition: { x: -5, y: 0, z: 0 }
    });

    // 3. Compressor Impeller (Cold Side)
    const compressorGroup = new THREE.Group();
    compressorGroup.position.set(2, 0, 0);

    const compressorHubGeometry = new THREE.CylinderGeometry(0.8, 0.1, 1.2, 32);
    const compressorHubMesh = new THREE.Mesh(compressorHubGeometry, aluminum);
    compressorHubMesh.rotation.z = Math.PI / 2;
    compressorGroup.add(compressorHubMesh);

    // Blades (Splitter and Main)
    const compBladeGeometry = new THREE.BoxGeometry(0.05, 1.8, 0.5);
    for (let i = 0; i < 14; i++) {
        const blade = new THREE.Mesh(compBladeGeometry, aluminum);
        const angle = (i / 14) * Math.PI * 2;
        blade.position.y = Math.cos(angle) * 0.6;
        blade.position.z = Math.sin(angle) * 0.6;
        blade.rotation.x = angle;
        blade.rotation.y = -Math.PI / 6; // Reverse pitch angle relative to turbine
        compressorGroup.add(blade);
    }
    
    // Intake glowing effect
    const intakeGlowGeo = new THREE.TorusGeometry(1, 0.05, 16, 64);
    const intakeGlowMesh = new THREE.Mesh(intakeGlowGeo, neonBlueMaterial);
    intakeGlowMesh.rotation.y = Math.PI / 2;
    intakeGlowMesh.position.x = 0.6;
    compressorGroup.add(intakeGlowMesh);

    group.add(compressorGroup);
    meshes.compressor = compressorGroup;

    parts.push({
        name: 'Compressor Impeller',
        description: 'A milled billet aluminum wheel designed to draw in and compress ambient air.',
        material: 'Billet Aluminum',
        function: 'Compresses intake air to increase the oxygen density entering the engine cylinders.',
        assemblyOrder: 3,
        connections: ['Connecting Shaft', 'Compressor Housing'],
        failureEffect: 'Foreign object damage (FOD), loss of boost, engine ingestion of metal fragments.',
        cascadeFailures: ['Engine cylinder damage', 'Intercooler clog'],
        originalPosition: { x: 2, y: 0, z: 0 },
        explodedPosition: { x: 5, y: 0, z: 0 }
    });

    // 4. Center Housing Rotating Assembly (CHRA) Bearings
    const bearingGroup = new THREE.Group();
    const bearingGeo = new THREE.TorusGeometry(0.4, 0.1, 16, 32);
    const bearing1 = new THREE.Mesh(bearingGeo, copper);
    bearing1.position.x = -1;
    bearing1.rotation.y = Math.PI / 2;
    const bearing2 = new THREE.Mesh(bearingGeo, copper);
    bearing2.position.x = 1;
    bearing2.rotation.y = Math.PI / 2;
    bearingGroup.add(bearing1, bearing2);
    group.add(bearingGroup);

    parts.push({
        name: 'Journal Bearings (CHRA)',
        description: 'Hydrodynamic oil bearings that float the shaft on a thin film of pressurized oil.',
        material: 'Brass / Copper Alloy',
        function: 'Supports the extreme rotational speeds (up to 200,000+ RPM) with minimal friction.',
        assemblyOrder: 4,
        connections: ['Connecting Shaft', 'Center Housing'],
        failureEffect: 'Shaft play, housing rub, oil seal failure resulting in blue smoke from exhaust.',
        cascadeFailures: ['Complete turbo seizure', 'Engine oil starvation'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 }
    });

    // Volute/Housing representation using abstract wireframes
    const voluteGeo = new THREE.TorusGeometry(1.5, 0.6, 16, 50, Math.PI * 1.5);
    const voluteWireMaterial = new THREE.MeshBasicMaterial({ color: 0xffaa00, wireframe: true, transparent: true, opacity: 0.3 });
    const turbineVolute = new THREE.Mesh(voluteGeo, voluteWireMaterial);
    turbineVolute.position.x = -2.2;
    turbineVolute.rotation.y = Math.PI / 2;
    group.add(turbineVolute);

    const compVoluteGeo = new THREE.TorusGeometry(1.6, 0.7, 16, 50, Math.PI * 1.5);
    const compVoluteWireMaterial = new THREE.MeshBasicMaterial({ color: 0x00aaff, wireframe: true, transparent: true, opacity: 0.3 });
    const compVolute = new THREE.Mesh(compVoluteGeo, compVoluteWireMaterial);
    compVolute.position.x = 2.2;
    compVolute.rotation.y = Math.PI / 2;
    compVolute.rotation.z = Math.PI; // Flipped
    group.add(compVolute);


    const description = `The **Automotive Turbocharger Impeller** system is a forced induction device that improves engine efficiency and power output by forcing extra compressed air into the combustion chamber. 
    It operates on a single shaft: hot exhaust gases drive the turbine, which synchronously spins the compressor impeller at speeds exceeding 200,000 RPM. This intricate dance of thermodynamics and fluid dynamics is represented here with neon-tinged flows indicating hot exhaust (orange/red) and compressed cool intake air (blue).`;

    const quizQuestions = [
        {
            question: "What is the primary function of the exhaust turbine in a turbocharger?",
            options: [
                "To compress intake air.",
                "To extract kinetic and thermal energy from exhaust gases to drive the compressor.",
                "To cool down the engine.",
                "To act as a secondary exhaust muffler."
            ],
            correct: 1,
            explanation: "The exhaust turbine harnesses the wasted heat and velocity of exiting exhaust gases, converting it into rotational energy to spin the compressor wheel.",
            difficulty: "Medium"
        },
        {
            question: "Why are turbocharger journal bearings often hydrodynamic?",
            options: [
                "They use water to stay cool.",
                "They rely on a thin film of pressurized oil so the shaft 'floats' to handle extreme RPMs.",
                "They are made of low-friction plastics.",
                "They are magnetic."
            ],
            correct: 1,
            explanation: "At over 100,000 RPM, traditional ball bearings can fail. Hydrodynamic bearings use pressurized engine oil to create a frictionless fluid boundary layer.",
            difficulty: "Hard"
        },
        {
            question: "What material is commonly used for the exhaust turbine due to its high heat resistance?",
            options: [
                "Billet Aluminum",
                "Carbon Fiber",
                "Inconel",
                "Standard Mild Steel"
            ],
            correct: 2,
            explanation: "Inconel is a superalloy specifically engineered to withstand the extreme temperatures (often exceeding 900°C) found in exhaust gas streams without warping or melting.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshesArray) {
        // High speed rotation based on input speed
        const rotationSpeed = time * speed * 20; // Fast rotation

        if (meshes.shaft) meshes.shaft.rotation.x = rotationSpeed;
        if (meshes.turbine) meshes.turbine.rotation.x = rotationSpeed;
        if (meshes.compressor) meshes.compressor.rotation.x = rotationSpeed;

        // Animate glowing effects
        const pulse = (Math.sin(time * 5) + 1) / 2;
        hotGlowMaterial.emissiveIntensity = 1.0 + pulse * 2.0;
        
        // We defined intakeGlowMesh locally, let's grab it or we can just access it through compressorGroup
        // Actually, let's just rotate the wireframes for some cool airflow effect
        turbineVolute.rotation.z = -time * speed;
        compVolute.rotation.z = time * speed;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createTurbochargerImpeller() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
