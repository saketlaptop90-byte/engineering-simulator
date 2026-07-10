import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom materials for glowing/neon visual flair
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x0088ff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
        metalness: 0.8,
        roughness: 0.2
    });

    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff0055,
        emissive: 0xcc0033,
        emissiveIntensity: 0.8,
        metalness: 0.5,
        roughness: 0.3
    });
    
    const airStreamMat = new THREE.MeshStandardMaterial({
        color: 0x88ccff,
        emissive: 0x4488ff,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide
    });

    // 1. Base / Stand
    const baseGeo = new THREE.CylinderGeometry(5, 5, 0.5, 32);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.position.set(0, -5, 0);
    group.add(baseMesh);
    meshes.base = baseMesh;
    parts.push({
        name: "Test Stand Base",
        description: "A heavy, vibration-dampening base that stabilizes the entire wind tunnel demonstrator setup.",
        material: "Dark Steel",
        function: "Provides structural integrity and houses the power supply.",
        assemblyOrder: 1,
        connections: ["Support Pillar"],
        failureEffect: "Machine tips over during high-speed tests.",
        cascadeFailures: ["Complete systemic collapse", "Shattered wind tunnel"],
        originalPosition: { x: 0, y: -5, z: 0 },
        explodedPosition: { x: 0, y: -15, z: 0 }
    });

    // 2. Support Pillar
    const pillarGeo = new THREE.CylinderGeometry(0.8, 1.2, 10, 16);
    const pillarMesh = new THREE.Mesh(pillarGeo, steel);
    pillarMesh.position.set(0, 0, 0);
    group.add(pillarMesh);
    meshes.pillar = pillarMesh;
    parts.push({
        name: "Support Pillar",
        description: "Vertical strut holding the Magnus effect cylinder and wind delivery system.",
        material: "Steel",
        function: "Elevates the cylinder into the path of the simulated airstream.",
        assemblyOrder: 2,
        connections: ["Test Stand Base", "Cylinder Mount"],
        failureEffect: "Loss of elevation control.",
        cascadeFailures: ["Inaccurate aerodynamic readings"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 10 }
    });

    // 3. Cylinder Mount / Bearings
    const mountGeo = new THREE.BoxGeometry(3, 1, 2);
    const mountMesh = new THREE.Mesh(mountGeo, aluminum);
    mountMesh.position.set(0, 5, 0);
    group.add(mountMesh);
    meshes.mount = mountMesh;
    parts.push({
        name: "High-Speed Bearing Mount",
        description: "Low-friction magnetic bearings securing the rotating cylinder.",
        material: "Aluminum",
        function: "Allows the cylinder to spin freely at thousands of RPM without overheating.",
        assemblyOrder: 3,
        connections: ["Support Pillar", "Spinning Cylinder"],
        failureEffect: "Friction increases dramatically, causing overheating and seizure.",
        cascadeFailures: ["Motor burnout", "Cylinder structural failure"],
        originalPosition: { x: 0, y: 5, z: 0 },
        explodedPosition: { x: 0, y: 10, z: 0 }
    });

    // 4. Spinning Cylinder (The Magnus object)
    const cylinderGeo = new THREE.CylinderGeometry(1.5, 1.5, 8, 32);
    cylinderGeo.rotateZ(Math.PI / 2);
    const spinningCylinder = new THREE.Mesh(cylinderGeo, neonBlue);
    spinningCylinder.position.set(0, 5, 0);
    group.add(spinningCylinder);
    meshes.cylinder = spinningCylinder;
    
    // Add visual markers on cylinder to easily observe rotation
    const markerGeo = new THREE.BoxGeometry(8.1, 0.2, 3.1);
    const markerMesh = new THREE.Mesh(markerGeo, darkSteel);
    spinningCylinder.add(markerMesh);

    parts.push({
        name: "Aerodynamic Cylinder",
        description: "A precision-machined rotor that spins rapidly in the oncoming air flow.",
        material: "Neon Polymer",
        function: "Generates a pressure differential (Magnus Effect) due to its rotation in the fluid stream.",
        assemblyOrder: 4,
        connections: ["High-Speed Bearing Mount"],
        failureEffect: "Loss of lift generation.",
        cascadeFailures: ["Zero Magnus force detected"],
        originalPosition: { x: 0, y: 5, z: 0 },
        explodedPosition: { x: -10, y: 5, z: 0 }
    });

    // 5. Airflow Emitters (Neon rings)
    const emitterGeo = new THREE.TorusGeometry(3, 0.2, 16, 32);
    const emitterMesh = new THREE.Mesh(emitterGeo, chrome);
    emitterMesh.position.set(-10, 5, 0);
    emitterMesh.rotation.y = Math.PI / 2;
    group.add(emitterMesh);
    meshes.emitter = emitterMesh;
    parts.push({
        name: "Laminar Flow Nozzle",
        description: "Directs a smooth, uniform stream of air towards the cylinder.",
        material: "Chrome",
        function: "Provides the moving fluid environment necessary to observe aerodynamic forces.",
        assemblyOrder: 5,
        connections: [],
        failureEffect: "Turbulent or completely halted air flow.",
        cascadeFailures: ["Invalid aerodynamic simulation"],
        originalPosition: { x: -10, y: 5, z: 0 },
        explodedPosition: { x: -20, y: 5, z: 0 }
    });

    // Airflow Visualization Particles (Lines representing wind)
    const arrowGroup = new THREE.Group();
    arrowGroup.position.set(-10, 5, 0);
    const arrows = [];
    for(let i=0; i<30; i++) {
        const lineGeo = new THREE.CylinderGeometry(0.05, 0.05, 2);
        lineGeo.rotateZ(Math.PI/2);
        const line = new THREE.Mesh(lineGeo, airStreamMat);
        line.position.set(Math.random() * 8, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6);
        arrowGroup.add(line);
        arrows.push({
            mesh: line,
            startY: line.position.y,
            offset: Math.random() * Math.PI * 2
        });
    }
    group.add(arrowGroup);
    meshes.arrowGroup = arrowGroup;
    meshes.arrows = arrows;

    // Force Vector Indicator (Lift force arrow pointing up/down depending on spin)
    const forceGeo = new THREE.CylinderGeometry(0.2, 0.2, 4);
    forceGeo.translate(0, 2, 0);
    const forceMesh = new THREE.Mesh(forceGeo, neonRed);
    forceMesh.position.set(0, 5, 0);
    
    const coneGeo = new THREE.ConeGeometry(0.6, 1);
    coneGeo.translate(0, 4.5, 0);
    const coneMesh = new THREE.Mesh(coneGeo, neonRed);
    forceMesh.add(coneMesh);
    
    group.add(forceMesh);
    meshes.forceVector = forceMesh;


    const description = "The Magnus Effect Demonstrator showcases the aerodynamic phenomenon where a spinning object dragged through a fluid creates a whirlpool of fluid around itself, and experiences a force perpendicular to the line of motion. This high-tech apparatus simulates the fluid dynamics visually, calculating lift vectors dynamically based on cylinder RPM.";

    const quizQuestions = [
        {
            question: "What primary force is generated by the Magnus effect on a horizontal cylinder spinning with top surface moving in direction of airflow?",
            options: ["Downward Force", "Upward Lift", "Drag only", "Lateral drift"],
            correct: 0,
            explanation: "If the top surface is moving in the direction of the airflow, the air velocity at the top decreases relative to the cylinder surface, increasing pressure. The bottom surface moves against the airflow, decreasing pressure. This creates a net downward force.",
            difficulty: "Hard"
        },
        {
            question: "Which real-world application heavily relies on the Magnus effect?",
            options: ["Jet engine turbines", "Rotor ships (Flettner rotors)", "Hot air balloons", "Submarine ballast tanks"],
            correct: 1,
            explanation: "Flettner rotors on ships use large spinning cylinders to generate thrust from the wind via the Magnus effect.",
            difficulty: "Medium"
        },
        {
            question: "According to Bernoulli's principle, how does the spinning cylinder create a pressure differential?",
            options: [
                "By heating the air on one side.",
                "By accelerating air on one side and slowing it on the other.",
                "By ionizing the air particles.",
                "By creating a perfect vacuum."
            ],
            correct: 1,
            explanation: "The rotation of the cylinder drags air along with it, accelerating the airflow on one side (lowering pressure) and decelerating it on the other side (increasing pressure), creating a net force.",
            difficulty: "Medium"
        }
    ];

    const animate = (time, speed, meshes) => {
        // Spin the cylinder based on input speed
        const rpm = speed * 10;
        meshes.cylinder.rotation.x -= 0.05 * rpm;

        // Animate air flow (wind)
        meshes.arrowGroup.position.x += 0.2 * Math.max(1, speed * 2);
        if (meshes.arrowGroup.position.x > 5) {
            meshes.arrowGroup.position.x = -15;
        }

        // Deflect air flow based on Magnus effect
        const liftScale = speed * 1.5;
        meshes.arrows.forEach(a => {
            if (meshes.arrowGroup.position.x > -5 && meshes.arrowGroup.position.x < 5) {
                // Parabolic deflection
                let deflection = Math.sin((meshes.arrowGroup.position.x + 5) * Math.PI / 10);
                a.mesh.position.y = a.startY + deflection * liftScale * Math.sign(rpm + 0.001);
            } else {
                a.mesh.position.y += (a.startY - a.mesh.position.y) * 0.1; // reset path
            }
        });

        // Update force vector scale and visibility based on lift
        if (speed < 0.1) {
            meshes.forceVector.scale.set(0.001, 0.001, 0.001); // Hide when still
        } else {
            meshes.forceVector.scale.set(1, liftScale * 1.2, 1);
        }
    };

    return { group, parts, description, quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createMagnusEffect() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
