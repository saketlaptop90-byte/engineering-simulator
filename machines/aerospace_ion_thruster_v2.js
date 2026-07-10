import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x0088ff,
        emissiveIntensity: 1.5,
        roughness: 0.1,
        metalness: 0.8
    });

    const plasmaGlow = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.8
    });

    const magneticCoilMat = new THREE.MeshStandardMaterial({
        color: 0xb87333,
        roughness: 0.4,
        metalness: 0.9,
        wireframe: true
    });

    // Parts definitions
    // 1. Discharge Chamber
    const chamberGeo = new THREE.CylinderGeometry(2, 2.5, 4, 32);
    const chamberMesh = new THREE.Mesh(chamberGeo, darkSteel);
    chamberMesh.rotation.x = Math.PI / 2;
    chamberMesh.position.set(0, 0, 0);
    group.add(chamberMesh);
    parts.push({
        name: "Discharge Chamber",
        description: "The primary cavity where propellant ionization occurs.",
        material: "Dark Steel",
        function: "Contains the plasma and provides a path for electrons to ionize the propellant.",
        assemblyOrder: 1,
        connections: ["Magnetic Coils", "Anode Base"],
        failureEffect: "Plasma leakage, severe thrust reduction.",
        cascadeFailures: ["Grid Erosion", "Thermal Runaway"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -5 },
        mesh: chamberMesh
    });

    // 2. Magnetic Coils
    const coilGeo = new THREE.TorusGeometry(2.6, 0.2, 16, 64);
    const coilMesh = new THREE.Mesh(coilGeo, magneticCoilMat);
    coilMesh.position.set(0, 0, 0);
    group.add(coilMesh);
    parts.push({
        name: "Electromagnetic Coils",
        description: "Creates a strong radial magnetic field to trap electrons.",
        material: "Copper/Magnetic",
        function: "Increases electron residence time, enhancing ionization efficiency.",
        assemblyOrder: 2,
        connections: ["Discharge Chamber", "Power Supply"],
        failureEffect: "Loss of magnetic field, propellant goes un-ionized.",
        cascadeFailures: ["Power Surge", "Thrust Termination"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 },
        mesh: coilMesh
    });

    // 3. Accelerator Grid
    const gridGeo = new THREE.CylinderGeometry(2.5, 2.5, 0.1, 32);
    const gridMesh = new THREE.Mesh(gridGeo, chrome);
    gridMesh.rotation.x = Math.PI / 2;
    gridMesh.position.set(0, 0, 2);
    group.add(gridMesh);
    parts.push({
        name: "Accelerator Grid",
        description: "A highly charged grid that accelerates ions out of the chamber.",
        material: "Chrome/Molybdenum",
        function: "Provides the electrostatic field necessary to accelerate ions to high exhaust velocities.",
        assemblyOrder: 3,
        connections: ["Discharge Chamber", "Screen Grid"],
        failureEffect: "Ion impingement, short-circuiting.",
        cascadeFailures: ["Grid Structural Failure", "Engine Short"],
        originalPosition: { x: 0, y: 0, z: 2 },
        explodedPosition: { x: 0, y: 0, z: 8 },
        mesh: gridMesh
    });

    // 4. Plasma Plume
    const plumeGeo = new THREE.ConeGeometry(1.5, 8, 32);
    const plumeMesh = new THREE.Mesh(plumeGeo, neonBlue);
    plumeMesh.rotation.x = -Math.PI / 2;
    plumeMesh.position.set(0, 0, 6);
    group.add(plumeMesh);
    parts.push({
        name: "Ion Plume",
        description: "The accelerated ion exhaust producing thrust.",
        material: "Plasma",
        function: "Propels the spacecraft via Newton's third law.",
        assemblyOrder: 4,
        connections: ["Accelerator Grid", "Neutralizer"],
        failureEffect: "Plume divergence, loss of specific impulse.",
        cascadeFailures: ["Spacecraft Charging", "Sensor Interference"],
        originalPosition: { x: 0, y: 0, z: 6 },
        explodedPosition: { x: 0, y: 0, z: 15 },
        mesh: plumeMesh
    });

    // 5. Neutralizer Cathode
    const neutralizerGeo = new THREE.BoxGeometry(0.5, 0.5, 2);
    const neutralizerMesh = new THREE.Mesh(neutralizerGeo, aluminum);
    neutralizerMesh.position.set(2.8, 0, 2.5);
    group.add(neutralizerMesh);
    parts.push({
        name: "Neutralizer Cathode",
        description: "Emits electrons into the ion plume to neutralize it.",
        material: "Aluminum",
        function: "Prevents the spacecraft from acquiring a negative charge which would pull ions back.",
        assemblyOrder: 5,
        connections: ["Main Bus", "Ion Plume"],
        failureEffect: "Spacecraft charging, thrust nullification.",
        cascadeFailures: ["Arcing", "Electrical System Overload"],
        originalPosition: { x: 2.8, y: 0, z: 2.5 },
        explodedPosition: { x: 6, y: 0, z: 2.5 },
        mesh: neutralizerMesh
    });

    const description = "The Aerospace Ion Thruster V2 is a highly efficient Hall-Effect thruster utilizing electromagnetic fields to ionize and accelerate heavy noble gases like Xenon, providing unparalleled specific impulse for deep space missions.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Electromagnetic Coils in a Hall-Effect thruster?",
            options: [
                "To cool the discharge chamber",
                "To trap electrons and increase ionization efficiency",
                "To accelerate the ions directly",
                "To provide structural support"
            ],
            correct: 1,
            explanation: "The coils create a radial magnetic field that traps electrons, causing them to spiral and collide with propellant atoms, ionizing them efficiently.",
            difficulty: "Medium"
        },
        {
            question: "Why is the Neutralizer Cathode critical for continuous thrust?",
            options: [
                "It ignites the propellant",
                "It adds extra mass to the exhaust",
                "It prevents the spacecraft from accumulating a negative charge",
                "It cools the accelerator grid"
            ],
            correct: 2,
            explanation: "Without the neutralizer, the spacecraft would become highly negatively charged, pulling the positively charged ions back and negating any thrust.",
            difficulty: "Hard"
        },
        {
            question: "Which material is best suited for the Accelerator Grid due to its resistance to ion sputtering?",
            options: [
                "Rubber",
                "Molybdenum or Chrome",
                "Plastic",
                "Copper"
            ],
            correct: 1,
            explanation: "The grid must withstand constant bombardment by high-energy ions (sputtering), requiring highly durable materials like Molybdenum.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Animate the plasma plume
        if (meshes[3]) {
            meshes[3].scale.set(
                1 + Math.sin(time * speed * 10) * 0.05,
                1 + Math.random() * 0.1,
                1 + Math.sin(time * speed * 10) * 0.05
            );
            meshes[3].material.emissiveIntensity = 1.5 + Math.sin(time * speed * 20) * 0.5;
        }

        // Animate the coils rotation to simulate magnetic field dynamics
        if (meshes[1]) {
            meshes[1].rotation.z = time * speed * 2;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createIonThruster() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
