import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom materials
    const plasmaMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x0088ff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.8,
        transmission: 0.9,
        clearcoat: 1.0,
    });

    const gridMaterial = new THREE.MeshStandardMaterial({
        color: 0x222222,
        metalness: 0.8,
        roughness: 0.2,
        wireframe: true
    });

    // 1. Thruster Housing
    const housingGeom = new THREE.CylinderGeometry(2, 2.5, 4, 32);
    const housingMesh = new THREE.Mesh(housingGeom, darkSteel);
    housingMesh.rotation.x = Math.PI / 2;
    housingMesh.position.set(0, 0, -1);
    group.add(housingMesh);
    parts.push({
        name: "Outer Housing",
        description: "The main structural casing of the ion thruster.",
        material: "Dark Steel",
        function: "Protects internal components and provides structural integrity.",
        assemblyOrder: 1,
        connections: ["Discharge Chamber", "Mounting Ring"],
        failureEffect: "Structural weakness, potential misalignment of optics.",
        cascadeFailures: ["Grid Misalignment"],
        originalPosition: { x: 0, y: 0, z: -1 },
        explodedPosition: { x: 0, y: 5, z: -1 },
        mesh: housingMesh
    });

    // 2. Discharge Chamber
    const chamberGeom = new THREE.CylinderGeometry(1.8, 2.3, 3.8, 32);
    const chamberMesh = new THREE.Mesh(chamberGeom, aluminum);
    chamberMesh.rotation.x = Math.PI / 2;
    chamberMesh.position.set(0, 0, -1);
    group.add(chamberMesh);
    parts.push({
        name: "Discharge Chamber",
        description: "Where xenon gas is ionized by electron bombardment.",
        material: "Aluminum",
        function: "Contains the plasma and provides a magnetic field environment.",
        assemblyOrder: 2,
        connections: ["Hollow Cathode", "Screen Grid", "Outer Housing"],
        failureEffect: "Loss of plasma containment, reduced ionization efficiency.",
        cascadeFailures: ["Thrust Loss", "Overheating"],
        originalPosition: { x: 0, y: 0, z: -1 },
        explodedPosition: { x: -5, y: 0, z: -1 },
        mesh: chamberMesh
    });

    // 3. Hollow Cathode (Electron Emitter)
    const cathodeGeom = new THREE.CylinderGeometry(0.2, 0.2, 1, 16);
    const cathodeMesh = new THREE.Mesh(cathodeGeom, copper);
    cathodeMesh.rotation.x = Math.PI / 2;
    cathodeMesh.position.set(0, 0, -2.5);
    group.add(cathodeMesh);
    parts.push({
        name: "Hollow Cathode Emitter",
        description: "Emits electrons into the discharge chamber to ionize the propellant.",
        material: "Copper/Tungsten",
        function: "Generates the primary electrons for the ionization process.",
        assemblyOrder: 3,
        connections: ["Discharge Chamber", "Gas Feed"],
        failureEffect: "Failure to ionize propellant.",
        cascadeFailures: ["Total Thrust Loss"],
        originalPosition: { x: 0, y: 0, z: -2.5 },
        explodedPosition: { x: 0, y: 0, z: -6 },
        mesh: cathodeMesh
    });

    // 4. Screen Grid
    const screenGeom = new THREE.CylinderGeometry(2.3, 2.3, 0.1, 32);
    const screenMesh = new THREE.Mesh(screenGeom, gridMaterial);
    screenMesh.rotation.x = Math.PI / 2;
    screenMesh.position.set(0, 0, 1);
    group.add(screenMesh);
    parts.push({
        name: "Screen Grid",
        description: "The first grid in the ion optics system, at high positive potential.",
        material: "Molybdenum",
        function: "Extracts ions from the discharge plasma.",
        assemblyOrder: 4,
        connections: ["Discharge Chamber", "Accelerator Grid"],
        failureEffect: "Poor ion extraction, plasma erosion.",
        cascadeFailures: ["Grid Shorting"],
        originalPosition: { x: 0, y: 0, z: 1 },
        explodedPosition: { x: 0, y: 0, z: 3 },
        mesh: screenMesh
    });

    // 5. Accelerator Grid
    const accelGeom = new THREE.CylinderGeometry(2.3, 2.3, 0.1, 32);
    const accelMesh = new THREE.Mesh(accelGeom, gridMaterial);
    accelMesh.rotation.x = Math.PI / 2;
    accelMesh.position.set(0, 0, 1.2);
    group.add(accelMesh);
    parts.push({
        name: "Accelerator Grid",
        description: "The second grid, at negative potential, accelerates the ions.",
        material: "Molybdenum",
        function: "Accelerates extracted ions to high exhaust velocities.",
        assemblyOrder: 5,
        connections: ["Screen Grid", "Decelerator Grid"],
        failureEffect: "Direct ion impingement, severe erosion.",
        cascadeFailures: ["Grid Failure", "Arcing"],
        originalPosition: { x: 0, y: 0, z: 1.2 },
        explodedPosition: { x: 0, y: 0, z: 4.5 },
        mesh: accelMesh
    });

    // 6. Neutralizer
    const neutralizerGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.8, 16);
    const neutralizerMesh = new THREE.Mesh(neutralizerGeom, steel);
    neutralizerMesh.rotation.x = Math.PI / 2;
    neutralizerMesh.position.set(2.6, 0, 1.5);
    neutralizerMesh.rotation.y = -Math.PI / 6;
    group.add(neutralizerMesh);
    parts.push({
        name: "Neutralizer Cathode",
        description: "Emits electrons into the ion beam after it exits the thruster.",
        material: "Steel/Tungsten",
        function: "Neutralizes the ion beam to prevent the spacecraft from charging negatively.",
        assemblyOrder: 6,
        connections: ["Outer Housing"],
        failureEffect: "Spacecraft charging, ion beam stalling (returning to spacecraft).",
        cascadeFailures: ["Thrust Cancellation", "Electrical Arc Damage"],
        originalPosition: { x: 2.6, y: 0, z: 1.5 },
        explodedPosition: { x: 5, y: 0, z: 1.5 },
        mesh: neutralizerMesh
    });

    // 7. Ion Beam (Plasma Plume)
    const beamGeom = new THREE.CylinderGeometry(2.2, 3.5, 6, 32, 1, true);
    const beamMesh = new THREE.Mesh(beamGeom, plasmaMaterial);
    beamMesh.rotation.x = Math.PI / 2;
    beamMesh.position.set(0, 0, 4.3);
    group.add(beamMesh);
    parts.push({
        name: "Xenon Plasma Beam",
        description: "The high-velocity exhaust of neutralized xenon atoms.",
        material: "Xenon Plasma",
        function: "Provides the reaction mass that produces thrust via momentum conservation.",
        assemblyOrder: 7,
        connections: ["Accelerator Grid", "Neutralizer Cathode"],
        failureEffect: "N/A",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 4.3 },
        explodedPosition: { x: 0, y: 0, z: 8 },
        mesh: beamMesh
    });

    const description = "The Aerospace Ion Thruster uses electron bombardment to ionize a propellant (typically Xenon). A high-voltage electrostatic grid system extracts and accelerates these ions to extremely high velocities (often >30 km/s). Finally, a neutralizer injects electrons into the exhaust plume to prevent spacecraft charging. While the thrust is very low compared to chemical rockets, the specific impulse (efficiency) is magnitudes higher, making it ideal for deep space missions.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Neutralizer Cathode in an ion thruster?",
            options: [
                "To ionize the xenon gas inside the discharge chamber.",
                "To inject electrons into the exhaust beam to prevent spacecraft charging.",
                "To accelerate the ions to high exhaust velocities.",
                "To cool down the accelerator grid."
            ],
            correct: 1,
            explanation: "The neutralizer cathode emits electrons into the exiting positive ion beam. Without it, the spacecraft would build up a severe negative charge, causing the ions to be pulled back to the ship, negating any thrust.",
            difficulty: "Medium"
        },
        {
            question: "Which component is responsible for accelerating the extracted ions?",
            options: [
                "Hollow Cathode Emitter",
                "Screen Grid",
                "Accelerator Grid",
                "Discharge Chamber"
            ],
            correct: 2,
            explanation: "The Accelerator Grid is held at a high negative potential relative to the plasma, which powerfully attracts and accelerates the positive ions out of the thruster.",
            difficulty: "Easy"
        },
        {
            question: "Why is Xenon commonly used as a propellant in ion thrusters?",
            options: [
                "It is the most abundant gas in space.",
                "It has a very low atomic mass, allowing for higher velocities.",
                "It is highly reactive and burns efficiently.",
                "It is a heavy noble gas, which is easy to ionize and non-reactive."
            ],
            correct: 3,
            explanation: "Xenon is a noble gas, so it doesn't chemically degrade the thruster components. Its high atomic mass provides good momentum transfer, and it has a relatively low ionization energy.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Find the beam mesh
        const beam = parts.find(p => p.name === "Xenon Plasma Beam").mesh;
        if (beam) {
            // Pulse the emissive intensity of the plasma beam
            const pulse = Math.sin(time * 10 * speed) * 0.5 + 2.0;
            beam.material.emissiveIntensity = pulse;
            // Slightly scale the beam to simulate flickering
            const scale = 1.0 + Math.sin(time * 20 * speed) * 0.02;
            beam.scale.set(scale, 1, scale);
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
