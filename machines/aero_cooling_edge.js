import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const hotSteel = new THREE.MeshStandardMaterial({
        color: 0xff4400,
        emissive: 0x881100,
        emissiveIntensity: 0.5,
        metalness: 0.8,
        roughness: 0.2
    });

    const coolingAir = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x0088ff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.4,
        roughness: 0.1,
        metalness: 0.1,
        clearcoat: 1.0,
    });

    const glowingBlue = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.8
    });

    // 1. Blade Root (Fir-tree root)
    const rootGeom = new THREE.BoxGeometry(2, 2, 2);
    const rootMesh = new THREE.Mesh(rootGeom, darkSteel);
    rootMesh.position.set(0, -1, 0);
    group.add(rootMesh);
    
    parts.push({
        name: "Blade Root (Fir-Tree)",
        description: "The attachment point securing the blade to the turbine disk. Uses a fir-tree shape to distribute massive centrifugal loads.",
        material: "Dark Steel",
        function: "Secures the blade against extreme centrifugal forces while allowing some thermal expansion.",
        assemblyOrder: 1,
        connections: ["Turbine Disk", "Blade Platform"],
        failureEffect: "Catastrophic blade detachment leading to severe engine damage.",
        cascadeFailures: ["Turbine Disk failure", "Casing containment breach"],
        originalPosition: { x: 0, y: -1, z: 0 },
        explodedPosition: { x: 0, y: -4, z: 0 },
        mesh: rootMesh
    });

    // 2. Blade Platform
    const platformGeom = new THREE.BoxGeometry(2.5, 0.4, 3);
    const platformMesh = new THREE.Mesh(platformGeom, steel);
    platformMesh.position.set(0, 0.2, 0);
    group.add(platformMesh);

    parts.push({
        name: "Blade Platform",
        description: "Forms the inner flow path wall for the hot gas expanding through the turbine.",
        material: "Steel",
        function: "Separates the hot gas path from the blade root and turbine disk.",
        assemblyOrder: 2,
        connections: ["Blade Root", "Airfoil"],
        failureEffect: "Hot gas ingestion into the root area, leading to overheating.",
        cascadeFailures: ["Root overheating", "Disk failure"],
        originalPosition: { x: 0, y: 0.2, z: 0 },
        explodedPosition: { x: 0, y: -1, z: 0 },
        mesh: platformMesh
    });

    // 3. Airfoil (The hot section)
    const airfoilShape = new THREE.Shape();
    airfoilShape.moveTo(0, 1.5);
    airfoilShape.quadraticCurveTo(1.5, 1.5, 2, -1);
    airfoilShape.quadraticCurveTo(0, -0.5, -1, -1);
    airfoilShape.quadraticCurveTo(-1.5, 1.5, 0, 1.5);

    const extrudeSettings = { depth: 5, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 };
    const airfoilGeom = new THREE.ExtrudeGeometry(airfoilShape, extrudeSettings);
    const airfoilMesh = new THREE.Mesh(airfoilGeom, hotSteel);
    // Rotate to stand upright
    airfoilMesh.rotation.x = -Math.PI / 2;
    airfoilMesh.position.set(0, 0.4, 1);
    group.add(airfoilMesh);

    parts.push({
        name: "Airfoil Section",
        description: "The aerodynamic shape that extracts energy from the high-temperature, high-pressure gas flow.",
        material: "Hot Steel (Superalloy)",
        function: "Converts thermal and kinetic energy of the gas into mechanical rotation.",
        assemblyOrder: 3,
        connections: ["Blade Platform", "Cooling Channels"],
        failureEffect: "Loss of engine power, imbalance.",
        cascadeFailures: ["Compressor stall", "Bearing failure due to imbalance"],
        originalPosition: { x: 0, y: 0.4, z: 1 },
        explodedPosition: { x: 0, y: 3, z: 1 },
        mesh: airfoilMesh
    });

    // 4. Internal Serpentine Cooling Channels
    const channelGeom = new THREE.CylinderGeometry(0.2, 0.2, 4.5, 8);
    const channel1 = new THREE.Mesh(channelGeom, glowingBlue);
    channel1.position.set(0.5, 2.8, -0.2);
    
    const channel2 = new THREE.Mesh(channelGeom, glowingBlue);
    channel2.position.set(-0.2, 2.8, 0.2);

    const channelGroup = new THREE.Group();
    channelGroup.add(channel1);
    channelGroup.add(channel2);
    group.add(channelGroup);

    parts.push({
        name: "Internal Serpentine Channels",
        description: "Intricate internal passages directing compressor bleed air to cool the blade from the inside out via convection.",
        material: "Glowing Blue Air",
        function: "Removes heat from the blade metal, allowing operation above the metal's melting point.",
        assemblyOrder: 4,
        connections: ["Airfoil", "Film Holes"],
        failureEffect: "Blade melts or oxidizes rapidly.",
        cascadeFailures: ["Airfoil failure", "Turbine section destruction"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 3, y: 3, z: 0 },
        mesh: channelGroup
    });

    // 5. Film Cooling Holes & Flow
    const filmGeom = new THREE.SphereGeometry(0.1, 8, 8);
    const filmInstanced = new THREE.InstancedMesh(filmGeom, coolingAir, 50);
    const dummy = new THREE.Object3D();
    
    for (let i = 0; i < 50; i++) {
        // Distribute along the leading edge approximately
        const y = 0.5 + Math.random() * 4.5;
        const x = -0.8 + Math.random() * 0.2;
        const z = -0.5 + Math.random() * 0.5;
        dummy.position.set(x, y, z);
        dummy.updateMatrix();
        filmInstanced.setMatrixAt(i, dummy.matrix);
    }
    filmInstanced.instanceMatrix.needsUpdate = true;
    group.add(filmInstanced);

    parts.push({
        name: "Film Cooling Air Jets",
        description: "Tiny holes that bleed cooling air onto the exterior surface, forming a protective boundary layer.",
        material: "Cyan Cooling Air",
        function: "Insulates the blade surface directly from the extremely hot main gas path.",
        assemblyOrder: 5,
        connections: ["Internal Channels"],
        failureEffect: "Localized hot spots on the blade surface leading to cracking or melting.",
        cascadeFailures: ["Blade fracture", "Loss of aerodynamic efficiency"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -3, y: 3, z: 0 },
        mesh: filmInstanced
    });

    const description = "The Aero Cooling Edge model illustrates the advanced thermal management required in modern gas turbine engines. To operate efficiently, turbine gas temperatures exceed the melting point of the blade material (superalloys). This is achieved through sophisticated internal serpentine convection channels and external film cooling, where cooler air bled from the compressor is forced through microscopic holes to form a protective boundary layer of cold air over the blade surface.";

    const quizQuestions = [
        {
            question: "Why do modern gas turbines require film cooling on their blades?",
            options: [
                "To reduce the weight of the turbine blades.",
                "To prevent the fuel from freezing.",
                "Because the surrounding gas temperature exceeds the melting point of the blade material.",
                "To increase the friction of the gas flow."
            ],
            correct: 2,
            explanation: "Modern turbine efficiency relies on extreme temperatures. The gas in the high-pressure turbine is often hotter than the melting point of the superalloys used, necessitating an insulating boundary layer of cooler air.",
            difficulty: "Medium"
        },
        {
            question: "Where does the cooling air used for turbine blade film cooling come from?",
            options: [
                "An external liquid nitrogen tank.",
                "Ram air scooped from outside the engine.",
                "Bleed air extracted from the compressor section.",
                "The exhaust stream after it has cooled down."
            ],
            correct: 2,
            explanation: "Air is bled from the high-pressure compressor. Although this air is hot (often 600°C+), it is significantly cooler than the turbine gas path (which can exceed 1500°C), making it effective for cooling.",
            difficulty: "Medium"
        },
        {
            question: "What is the primary function of the fir-tree root design?",
            options: [
                "To provide aerodynamic lift.",
                "To securely hold the blade against massive centrifugal forces.",
                "To mix fuel and air efficiently.",
                "To create the film cooling holes."
            ],
            correct: 1,
            explanation: "The fir-tree shape distributes the immense centrifugal stress across multiple contact faces as the turbine spins at thousands of RPM, keeping the blade firmly attached to the disk.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Animate the hot steel pulsating slightly with heat
        if (airfoilMesh && airfoilMesh.material) {
            airfoilMesh.material.emissiveIntensity = 0.5 + Math.sin(time * 2 * speed) * 0.2;
        }

        // Animate cooling air particles flowing over the blade
        if (filmInstanced) {
            for (let i = 0; i < 50; i++) {
                filmInstanced.getMatrixAt(i, dummy.matrix);
                dummy.position.setFromMatrixPosition(dummy.matrix);
                
                // Flow backwards and slightly outwards
                dummy.position.x += 0.05 * speed;
                dummy.position.z += 0.02 * Math.sin(time * 10 + i) * speed;

                // Reset position when they flow too far back
                if (dummy.position.x > 2) {
                    dummy.position.x = -0.8 + Math.random() * 0.2;
                    dummy.position.y = 0.5 + Math.random() * 4.5;
                    dummy.position.z = -0.5 + Math.random() * 0.5;
                }
                
                dummy.updateMatrix();
                filmInstanced.setMatrixAt(i, dummy.matrix);
            }
            filmInstanced.instanceMatrix.needsUpdate = true;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createActiveCoolingEdge() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
