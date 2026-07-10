import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const hotSteel = new THREE.MeshStandardMaterial({
        color: 0x555555,
        emissive: 0xff3300,
        emissiveIntensity: 0.8,
        metalness: 0.8,
        roughness: 0.4
    });

    const castIron = new THREE.MeshStandardMaterial({
        color: 0x333333,
        metalness: 0.6,
        roughness: 0.8
    });

    const neonGlow = new THREE.MeshBasicMaterial({
        color: 0xffaa00,
        transparent: true,
        opacity: 0.5
    });

    // 1. Engine Flange
    const flangeGeometry = new THREE.BoxGeometry(10, 1.5, 0.5);
    const flange = new THREE.Mesh(flangeGeometry, darkSteel);
    flange.position.set(0, 0, 0);
    group.add(flange);
    
    parts.push({
        name: "Engine Flange",
        description: "Connects the manifold securely to the engine cylinder head.",
        material: "darkSteel",
        function: "Seals the exhaust ports to prevent gas leaks and directs exhaust into the runners.",
        assemblyOrder: 1,
        connections: ["Cylinder Head", "Runners"],
        failureEffect: "Exhaust leaks leading to poor performance and loud noises.",
        cascadeFailures: ["Oxygen sensor false readings", "Catalytic converter damage"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -3 }
    });

    // 2. Runners
    const runnerGeo = new THREE.CylinderGeometry(0.6, 0.6, 3, 16);
    const runnerPositions = [-3.5, -1.2, 1.2, 3.5];
    const runnersGroup = new THREE.Group();
    
    runnerPositions.forEach((x, index) => {
        const runner = new THREE.Mesh(runnerGeo, hotSteel);
        runner.rotation.x = Math.PI / 2;
        runner.position.set(x, 0, 1.5);
        runnersGroup.add(runner);
        
        // Neon inner glow for visual flair
        const glow = new THREE.Mesh(runnerGeo, neonGlow);
        glow.scale.set(1.05, 1.05, 1.05);
        runner.add(glow);
    });
    group.add(runnersGroup);

    parts.push({
        name: "Exhaust Runners",
        description: "Pipes that channel exhaust gases from individual cylinders.",
        material: "hotSteel",
        function: "Maintains exhaust gas velocity and prevents backpressure.",
        assemblyOrder: 2,
        connections: ["Engine Flange", "Collector"],
        failureEffect: "Increased backpressure and reduced engine efficiency.",
        cascadeFailures: ["Engine overheating", "Valve damage"],
        originalPosition: { x: 0, y: 0, z: 1.5 },
        explodedPosition: { x: 0, y: 2, z: 3 }
    });

    // 3. Collector
    const collectorGeo = new THREE.CylinderGeometry(0.8, 1.5, 8, 16);
    const collector = new THREE.Mesh(collectorGeo, castIron);
    collector.rotation.z = Math.PI / 2;
    collector.position.set(0, 0, 3.5);
    group.add(collector);

    parts.push({
        name: "Collector",
        description: "Merges the individual runners into a single exit pipe.",
        material: "castIron",
        function: "Smoothly combines exhaust pulses to improve scavenging.",
        assemblyOrder: 3,
        connections: ["Runners", "Exhaust Pipe"],
        failureEffect: "Turbulence and loss of scavenging effect.",
        cascadeFailures: ["Loss of torque", "Uneven exhaust flow"],
        originalPosition: { x: 0, y: 0, z: 3.5 },
        explodedPosition: { x: 0, y: -2, z: 6 }
    });

    // 4. Heat Shield
    const shieldGeo = new THREE.CylinderGeometry(1.8, 1.8, 7.5, 16, 1, true, 0, Math.PI);
    const shield = new THREE.Mesh(shieldGeo, chrome);
    shield.rotation.z = Math.PI / 2;
    shield.position.set(0, 0.5, 3.5);
    group.add(shield);

    parts.push({
        name: "Heat Shield",
        description: "Reflective covering over the manifold.",
        material: "chrome",
        function: "Protects surrounding engine components from extreme heat.",
        assemblyOrder: 4,
        connections: ["Collector"],
        failureEffect: "Overheating of adjacent components.",
        cascadeFailures: ["Melted wiring", "Vapor lock in fuel lines"],
        originalPosition: { x: 0, y: 0.5, z: 3.5 },
        explodedPosition: { x: 0, y: 4, z: 5 }
    });

    const quizQuestions = [
        {
            question: "What is the primary function of an exhaust manifold?",
            options: [
                "To cool the engine coolant",
                "To mix fuel and air",
                "To collect exhaust gases from cylinders into one pipe",
                "To muffle engine noise"
            ],
            correct: 2,
            explanation: "The exhaust manifold collects the exhaust gases from multiple cylinders and channels them into the exhaust system.",
            difficulty: "easy"
        },
        {
            question: "Why do high-performance headers (a type of manifold) use equal-length runners?",
            options: [
                "To look better aesthetically",
                "To ensure exhaust pulses arrive at the collector spaced out evenly, improving scavenging",
                "To reduce the amount of metal used",
                "To fit into smaller engine bays"
            ],
            correct: 1,
            explanation: "Equal-length runners ensure that the exhaust pulses are spaced evenly, creating a vacuum that helps pull exhaust from the next cylinder (scavenging).",
            difficulty: "medium"
        },
        {
            question: "What is a common consequence of an exhaust manifold leak?",
            options: [
                "Improved fuel economy",
                "False lean readings from the oxygen sensor",
                "Lower engine temperatures",
                "Increased oil pressure"
            ],
            correct: 1,
            explanation: "A leak allows fresh air into the exhaust, which the oxygen sensor misreads as a lean condition, causing the ECU to add excess fuel.",
            difficulty: "hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Pulsate the emissive intensity to simulate heat pulses
        const heatIntensity = 0.5 + Math.sin(time * speed * 5) * 0.3;
        hotSteel.emissiveIntensity = heatIntensity;
        neonGlow.opacity = 0.3 + Math.sin(time * speed * 10) * 0.2;
    }

    return { group, parts, description: "A high-tech exhaust manifold that collects engine exhaust gases.", quizQuestions, animate };
}

// Auto-generated missing stub
export function createExhaustManifold() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
