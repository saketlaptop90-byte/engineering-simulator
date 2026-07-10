import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const thermalSheathingMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xff3300,
        emissive: 0xff4400,
        emissiveIntensity: 0.8,
        metalness: 0.5,
        roughness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        transparent: true,
        opacity: 0.7
    });

    const scramjetCoreMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ccff,
        emissive: 0x0088ff,
        emissiveIntensity: 2.0,
        metalness: 0.9,
        roughness: 0.1
    });

    const ablativeShieldMaterial = new THREE.MeshStandardMaterial({
        color: 0x222222,
        metalness: 0.1,
        roughness: 0.9
    });

    // 1. Waverider Hull (Lifting Body)
    const hullGeometry = new THREE.ConeGeometry( 2, 10, 4 );
    hullGeometry.rotateX(Math.PI / 2);
    hullGeometry.scale(1, 0.2, 1);
    const hullMesh = new THREE.Mesh(hullGeometry, darkSteel);
    hullMesh.position.set(0, 0, 0);
    group.add(hullMesh);

    parts.push({
        name: "Lifting Body Hull",
        description: "Primary waverider hull designed to ride its own shockwave to generate lift at hypersonic speeds.",
        material: "Dark Steel Composite",
        function: "Aerodynamic lift and structural integrity.",
        assemblyOrder: 1,
        connections: ["Ablative Shielding", "Scramjet Engines"],
        failureEffect: "Loss of lift and catastrophic aerodynamic breakup.",
        cascadeFailures: ["Scramjet Engines", "Thermal Shield"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 5, z: 0}
    });

    // 2. Ablative Thermal Shield
    const shieldGeometry = new THREE.ConeGeometry( 2.05, 10.05, 4 );
    shieldGeometry.rotateX(Math.PI / 2);
    shieldGeometry.scale(1, 0.2, 1);
    const shieldMesh = new THREE.Mesh(shieldGeometry, ablativeShieldMaterial);
    shieldMesh.position.set(0, -0.05, 0.1);
    group.add(shieldMesh);
    
    parts.push({
        name: "Ablative Thermal Shield",
        description: "High-temperature resistant tiles covering the leading edges and underbelly.",
        material: "Ablative Ceramic",
        function: "Protects the vehicle from extreme aerodynamic heating during hypersonic flight.",
        assemblyOrder: 2,
        connections: ["Lifting Body Hull"],
        failureEffect: "Structural melting and immediate vehicle loss.",
        cascadeFailures: ["Lifting Body Hull", "Avionics"],
        originalPosition: {x: 0, y: -0.05, z: 0.1},
        explodedPosition: {x: 0, y: -5, z: 0.1}
    });

    // 3. Thermal Plasma Sheathing (Visual Flair)
    const plasmaGeometry = new THREE.ConeGeometry( 2.15, 10.15, 4 );
    plasmaGeometry.rotateX(Math.PI / 2);
    plasmaGeometry.scale(1, 0.2, 1);
    const plasmaMesh = new THREE.Mesh(plasmaGeometry, thermalSheathingMaterial);
    plasmaMesh.position.set(0, -0.05, 0.2); 
    group.add(plasmaMesh);

    parts.push({
        name: "Plasma Sheath",
        description: "Superheated ionized gas layer forming around the vehicle at Mach 5+.",
        material: "Ionized Plasma",
        function: "Byproduct of hypersonic compression.",
        assemblyOrder: 3,
        connections: ["Ablative Thermal Shield"],
        failureEffect: "Radio blackout and thermal anomalies.",
        cascadeFailures: ["Communications"],
        originalPosition: {x: 0, y: -0.05, z: 0.2},
        explodedPosition: {x: 0, y: -8, z: 2}
    });

    // 4. Scramjet Engine Modules
    const engineGeometry = new THREE.BoxGeometry(1.5, 0.3, 3);
    const engineMesh = new THREE.Mesh(engineGeometry, steel);
    engineMesh.position.set(0, -0.4, 2);
    group.add(engineMesh);

    parts.push({
        name: "Scramjet Engine Block",
        description: "Supersonic combustion ramjet for high-speed propulsion.",
        material: "Titanium Alloy",
        function: "Provides thrust using supersonic airflow and hydrogen fuel.",
        assemblyOrder: 4,
        connections: ["Lifting Body Hull", "Scramjet Core"],
        failureEffect: "Loss of thrust and altitude.",
        cascadeFailures: ["Flight Control"],
        originalPosition: {x: 0, y: -0.4, z: 2},
        explodedPosition: {x: 0, y: -2, z: 5}
    });

    // 5. Scramjet Combustion Core
    const coreGeometry = new THREE.CylinderGeometry(0.2, 0.3, 2.5, 16);
    coreGeometry.rotateX(Math.PI / 2);
    const coreMesh = new THREE.Mesh(coreGeometry, scramjetCoreMaterial);
    coreMesh.position.set(0, -0.4, 2.2);
    group.add(coreMesh);

    parts.push({
        name: "Scramjet Core",
        description: "The active combustion chamber where supersonic mixing and ignition occurs.",
        material: "Plasma-infused Steel",
        function: "Maintains continuous detonation and generates forward momentum.",
        assemblyOrder: 5,
        connections: ["Scramjet Engine Block"],
        failureEffect: "Flameout.",
        cascadeFailures: ["Scramjet Engine Block"],
        originalPosition: {x: 0, y: -0.4, z: 2.2},
        explodedPosition: {x: 0, y: -3, z: 6}
    });

    // 6. Cockpit / Avionics Bay
    const canopyGeometry = new THREE.CapsuleGeometry(0.3, 1, 4, 8);
    canopyGeometry.rotateX(Math.PI / 2);
    const canopyMesh = new THREE.Mesh(canopyGeometry, tinted);
    canopyMesh.position.set(0, 0.3, -1.5);
    group.add(canopyMesh);

    parts.push({
        name: "Avionics Bay Canopy",
        description: "Aerodynamic enclosure for autonomous guidance systems and sensors.",
        material: "Tinted Transparent Composite",
        function: "Houses critical flight computers and navigation.",
        assemblyOrder: 6,
        connections: ["Lifting Body Hull"],
        failureEffect: "Loss of autonomous control.",
        cascadeFailures: ["Flight Control"],
        originalPosition: {x: 0, y: 0.3, z: -1.5},
        explodedPosition: {x: 0, y: 3, z: -1.5}
    });

    // 7. Aft Control Surfaces (Fins)
    const finGeometry = new THREE.BoxGeometry(0.1, 1, 1);
    
    const leftFin = new THREE.Mesh(finGeometry, aluminum);
    leftFin.position.set(-1.5, 0.5, 4);
    leftFin.rotation.z = Math.PI / 6;
    group.add(leftFin);

    const rightFin = new THREE.Mesh(finGeometry, aluminum);
    rightFin.position.set(1.5, 0.5, 4);
    rightFin.rotation.z = -Math.PI / 6;
    group.add(rightFin);

    parts.push({
        name: "Aft Control Fins",
        description: "Vertical and horizontal stabilizers for high-speed maneuvering.",
        material: "Aerospace Aluminum",
        function: "Provides yaw and roll control at hypersonic speeds.",
        assemblyOrder: 7,
        connections: ["Lifting Body Hull"],
        failureEffect: "Uncontrolled spin.",
        cascadeFailures: ["Lifting Body Hull"],
        originalPosition: {x: 0, y: 0.5, z: 4},
        explodedPosition: {x: -3, y: 2, z: 4}
    });

    const description = "The Aerospace Hypersonic Waverider Airframe is a cutting-edge experimental vehicle designed to travel at Mach 5+. It utilizes a unique lifting-body design to ride the shockwaves it generates, minimizing drag and maximizing aerodynamic efficiency. Powered by advanced scramjet engines, it features ablative thermal shielding and plasma-sheath dynamics to survive extreme atmospheric heating.";

    const quizQuestions = [
        {
            question: "What is the primary function of a 'waverider' lifting body design?",
            options: [
                "To generate thrust using shockwaves",
                "To ride its own shockwave to generate lift",
                "To absorb radar waves for stealth",
                "To cool the engine core"
            ],
            correct: 1,
            explanation: "A waverider is designed to use the shockwave created by its own flight as a lifting surface, greatly improving its lift-to-drag ratio at hypersonic speeds.",
            difficulty: "Medium"
        },
        {
            question: "Why does the waverider require an ablative thermal shield?",
            options: [
                "To protect against micrometeorites",
                "To reflect solar radiation",
                "To survive extreme aerodynamic heating caused by atmospheric compression at Mach 5+",
                "To contain engine plasma"
            ],
            correct: 2,
            explanation: "At hypersonic speeds, compressing the air in front of the vehicle generates immense heat (often exceeding 2000°C), requiring ablative or advanced ceramic shielding.",
            difficulty: "Easy"
        },
        {
            question: "What is a major operational requirement for a Scramjet engine to function?",
            options: [
                "It requires a heavy turbine compressor",
                "It operates best at subsonic speeds",
                "It must already be moving at supersonic speeds to compress incoming air",
                "It uses solid fuel instead of liquid fuel"
            ],
            correct: 2,
            explanation: "Scramjets (Supersonic Combustion Ramjets) lack mechanical compressors; they rely on the vehicle's high forward speed to compress incoming air before combustion.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        if (!meshes || meshes.length < 8) return;
        
        const [hull, shield, plasma, engine, core, canopy, leftFin, rightFin] = meshes;

        // Animate plasma sheath (pulsing opacity and scale)
        const pulse = Math.sin(time * speed * 10) * 0.05 + 1.0;
        plasma.scale.set(1.0, 1.0, pulse);
        plasma.material.opacity = 0.5 + Math.sin(time * speed * 20) * 0.2;

        // Animate scramjet core (flickering emissive)
        core.material.emissiveIntensity = 2.0 + Math.random() * 1.5;

        // Minor vibration of the entire hull to simulate hypersonic stress
        const vibration = Math.sin(time * speed * 50) * 0.005;
        hull.position.y = vibration;
        canopy.position.y = 0.3 + vibration;

        // Slight adjustment of control fins based on time
        leftFin.rotation.x = Math.sin(time * speed * 2) * 0.05;
        rightFin.rotation.x = Math.cos(time * speed * 2) * 0.05;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createHypersonicWaveriderAirframe() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
