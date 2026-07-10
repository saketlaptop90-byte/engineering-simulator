import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const neonClayMaterial = new THREE.MeshStandardMaterial({
        color: 0xff3300,
        emissive: 0xff5500,
        emissiveIntensity: 1.5,
        roughness: 0.2,
        metalness: 0.1
    });

    const glowingCoreMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffcc,
        emissive: 0x00ffcc,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.8
    });

    // 1. Base / Frame
    const frameGeo = new THREE.BoxGeometry(6, 1, 3);
    const frameMesh = new THREE.Mesh(frameGeo, darkSteel);
    frameMesh.position.set(0, -0.5, 0);
    group.add(frameMesh);
    parts.push({
        name: "Heavy Duty Frame",
        description: "Provides a stable foundation to dampen the violent vibrations of the extrusion process.",
        material: "darkSteel",
        function: "Structural support",
        assemblyOrder: 1,
        connections: ["Motor Housing", "Extrusion Barrel"],
        failureEffect: "Excessive vibration leading to misalignment of internal components.",
        cascadeFailures: ["Motor bearings", "Auger shaft seal"],
        originalPosition: { x: 0, y: -0.5, z: 0 },
        explodedPosition: { x: 0, y: -3, z: 0 },
        mesh: frameMesh
    });

    // 2. Motor Housing
    const motorGeo = new THREE.CylinderGeometry(1, 1, 2.5, 32);
    const motorMesh = new THREE.Mesh(motorGeo, chrome);
    motorMesh.rotation.z = Math.PI / 2;
    motorMesh.position.set(-2, 1, 0);
    group.add(motorMesh);
    parts.push({
        name: "High-Torque Drive Motor",
        description: "A powerful electric motor that drives the auger, churning the clay with immense force.",
        material: "chrome",
        function: "Provides rotational power to the auger.",
        assemblyOrder: 2,
        connections: ["Heavy Duty Frame", "Gearbox"],
        failureEffect: "Complete halt of the extrusion process.",
        cascadeFailures: ["Overheating of power supply"],
        originalPosition: { x: -2, y: 1, z: 0 },
        explodedPosition: { x: -5, y: 2, z: 0 },
        mesh: motorMesh
    });

    // 3. Gearbox / Transmission
    const gearboxGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const gearboxMesh = new THREE.Mesh(gearboxGeo, steel);
    gearboxMesh.position.set(-0.25, 1, 0);
    group.add(gearboxMesh);
    parts.push({
        name: "Planetary Gearbox",
        description: "Reduces motor speed while massively multiplying torque for thick clay extrusion.",
        material: "steel",
        function: "Speed reduction and torque multiplication.",
        assemblyOrder: 3,
        connections: ["Drive Motor", "Auger"],
        failureEffect: "Loud grinding noises, inability to push dense clay.",
        cascadeFailures: ["Motor stall", "Drive shaft shear"],
        originalPosition: { x: -0.25, y: 1, z: 0 },
        explodedPosition: { x: -2, y: 4, z: 0 },
        mesh: gearboxMesh
    });

    // 4. Extrusion Barrel (Transparent to see inside)
    const barrelGeo = new THREE.CylinderGeometry(0.8, 0.8, 4, 32);
    const barrelMesh = new THREE.Mesh(barrelGeo, tinted); // using tinted or glass
    barrelMesh.rotation.z = Math.PI / 2;
    barrelMesh.position.set(2.5, 1, 0);
    group.add(barrelMesh);
    parts.push({
        name: "Reinforced Vacuum Barrel",
        description: "Houses the auger and maintains a vacuum to de-air the clay mixture.",
        material: "tinted glass",
        function: "Containment and de-airing environment.",
        assemblyOrder: 4,
        connections: ["Gearbox", "Extrusion Die"],
        failureEffect: "Air bubbles in extruded clay, weak structural integrity of final product.",
        cascadeFailures: ["Vacuum pump overload"],
        originalPosition: { x: 2.5, y: 1, z: 0 },
        explodedPosition: { x: 2.5, y: 5, z: 0 },
        mesh: barrelMesh
    });

    // 5. The Auger
    const augerGeo = new THREE.CylinderGeometry(0.6, 0.6, 3.8, 16, 20); // simplified representation
    const augerMesh = new THREE.Mesh(augerGeo, glowingCoreMaterial);
    augerMesh.rotation.z = Math.PI / 2;
    augerMesh.position.set(2.5, 1, 0);
    group.add(augerMesh);
    parts.push({
        name: "Hyper-Alloy Auger",
        description: "Violently churns, mixes, and pushes the neon-clay mixture forward.",
        material: "glowingCore",
        function: "Transport and compression of clay.",
        assemblyOrder: 5,
        connections: ["Gearbox", "Extrusion Barrel"],
        failureEffect: "Clogging and backpressure buildup.",
        cascadeFailures: ["Barrel rupture", "Gearbox fracture"],
        originalPosition: { x: 2.5, y: 1, z: 0 },
        explodedPosition: { x: 2.5, y: 1, z: 3 },
        mesh: augerMesh
    });

    // 6. Hopper
    const hopperGeo = new THREE.CylinderGeometry(1.2, 0.5, 1.5, 4);
    const hopperMesh = new THREE.Mesh(hopperGeo, aluminum);
    hopperMesh.rotation.y = Math.PI / 4;
    hopperMesh.position.set(1.5, 2.5, 0);
    group.add(hopperMesh);
    parts.push({
        name: "Feed Hopper",
        description: "Entry point for raw materials. Funnels clay down into the auger path.",
        material: "aluminum",
        function: "Material intake.",
        assemblyOrder: 6,
        connections: ["Extrusion Barrel"],
        failureEffect: "Material starvation, inconsistent extrusion.",
        cascadeFailures: ["Auger dry-running", "Overheating"],
        originalPosition: { x: 1.5, y: 2.5, z: 0 },
        explodedPosition: { x: 1.5, y: 6, z: 0 },
        mesh: hopperMesh
    });

    // 7. Extrusion Die
    const dieGeo = new THREE.CylinderGeometry(0.5, 0.8, 0.5, 32);
    const dieMesh = new THREE.Mesh(dieGeo, steel);
    dieMesh.rotation.z = Math.PI / 2;
    dieMesh.position.set(4.75, 1, 0);
    group.add(dieMesh);
    parts.push({
        name: "Shaping Die",
        description: "Forces the pressurized clay into a specific continuous profile.",
        material: "steel",
        function: "Final shaping of the extrusion.",
        assemblyOrder: 7,
        connections: ["Extrusion Barrel"],
        failureEffect: "Deformed output, ragged edges on clay.",
        cascadeFailures: ["Downstream processing errors"],
        originalPosition: { x: 4.75, y: 1, z: 0 },
        explodedPosition: { x: 7, y: 1, z: 0 },
        mesh: dieMesh
    });

    // 8. Extruded Clay (Neon)
    const clayGeo = new THREE.CylinderGeometry(0.3, 0.3, 3, 32);
    const clayMesh = new THREE.Mesh(clayGeo, neonClayMaterial);
    clayMesh.rotation.z = Math.PI / 2;
    clayMesh.position.set(6.5, 1, 0);
    group.add(clayMesh);
    parts.push({
        name: "Neon-Clay Extrudate",
        description: "The final product: a violently glowing hot mixture shaped perfectly by the die.",
        material: "neonClay",
        function: "Output material.",
        assemblyOrder: 8,
        connections: ["Shaping Die"],
        failureEffect: "Breaks or crumbles if moisture/vacuum is incorrect.",
        cascadeFailures: [],
        originalPosition: { x: 6.5, y: 1, z: 0 },
        explodedPosition: { x: 10, y: 1, z: 0 },
        mesh: clayMesh
    });

    const description = "The Ceramics Extruder (Clay Pug Mill) is an ultra high-tech industrial machine that mixes, de-airs, and pressurizes raw clay. A high-torque motor and gearbox drive a glowing hyper-alloy auger, which violently churns and pushes the material through a shaping die to create a continuous profile of glowing neon-clay.";

    const quizQuestions = [
        {
            question: "What is the primary function of the planetary gearbox in the ceramics extruder?",
            options: [
                "To increase the motor's speed",
                "To reduce speed and multiply torque",
                "To heat the clay to melting point",
                "To add color to the clay mixture"
            ],
            correct: 1,
            explanation: "The gearbox reduces the high-speed rotation of the motor while massively multiplying the torque required to push thick, dense clay through the barrel.",
            difficulty: "Medium"
        },
        {
            question: "Why is a vacuum typically maintained in the extrusion barrel (pug mill)?",
            options: [
                "To cool the auger",
                "To make the machine lighter",
                "To remove air bubbles from the clay (de-airing)",
                "To speed up the motor"
            ],
            correct: 2,
            explanation: "De-airing the clay removes trapped air bubbles, which improves the structural integrity and workability of the extruded material.",
            difficulty: "Hard"
        },
        {
            question: "What happens if the feed hopper fails to supply material continuously?",
            options: [
                "The extruded clay becomes stronger",
                "The machine produces a perfectly uniform extrusion",
                "Material starvation leads to inconsistent extrusion and potential auger dry-running",
                "The die automatically resizes itself"
            ],
            correct: 2,
            explanation: "Without a continuous supply of material, the auger runs dry, leading to gaps in the extrusion and potential overheating from friction.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Rotate the auger
        const auger = meshes.find(m => m.name === "Hyper-Alloy Auger")?.mesh;
        if (auger) {
            auger.rotation.y = time * speed * 2;
        }

        // Animate the extruded clay moving forward and pulsing
        const clay = meshes.find(m => m.name === "Neon-Clay Extrudate")?.mesh;
        if (clay) {
            clay.position.x = 6.5 + (Math.sin(time * speed) * 0.2); // slight pulsing forward
            if(clay.material && clay.material.emissiveIntensity !== undefined) {
                 clay.material.emissiveIntensity = 1.5 + Math.sin(time * speed * 5) * 0.5; // pulsing glow
            }
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createCeramicExtruder() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
