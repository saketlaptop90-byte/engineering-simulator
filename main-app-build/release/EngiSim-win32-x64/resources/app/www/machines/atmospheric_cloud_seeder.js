import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
        roughness: 0.1,
        metalness: 0.5
    });

    const neonPurple = new THREE.MeshStandardMaterial({
        color: 0xaa00ff,
        emissive: 0xaa00ff,
        emissiveIntensity: 0.6,
        transparent: true,
        opacity: 0.9,
        roughness: 0.2,
        metalness: 0.3
    });

    const coreEnergyMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x00ffff,
        emissiveIntensity: 2.0,
        wireframe: true
    });

    // Helper to add parts
    const addPart = (mesh, name, description, functionDesc, assemblyOrder, connections, failureEffect, cascadeFailures, originalPos, explodedPos) => {
        mesh.position.copy(originalPos);
        group.add(mesh);
        parts.push({
            name,
            description,
            material: mesh.material,
            function: functionDesc,
            assemblyOrder,
            connections,
            failureEffect,
            cascadeFailures,
            originalPosition: { ...originalPos },
            explodedPosition: { ...explodedPos },
            mesh
        });
    };

    // 1. Base Platform
    const baseGeo = new THREE.CylinderGeometry(4, 4.5, 0.5, 32);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    addPart(
        baseMesh,
        "Stabilization Base",
        "Heavy platform grounding the system.",
        "Provides stability and power routing.",
        1,
        ["Power Core", "Housing"],
        "Vibrations cause system instability.",
        ["Power Core"],
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, -5, 0)
    );

    // 2. Power Core
    const coreGeo = new THREE.IcosahedronGeometry(1.5, 2);
    const coreMesh = new THREE.Mesh(coreGeo, coreEnergyMat);
    addPart(
        coreMesh,
        "Ionization Core",
        "Generates charged particles.",
        "Powers the seeding process by ionizing chemical compounds.",
        2,
        ["Stabilization Base", "Chemical Tanks", "Accelerator Tube"],
        "Loss of ionization power, seeding halts.",
        ["Accelerator Tube", "Dispersion Ring"],
        new THREE.Vector3(0, 1.5, 0),
        new THREE.Vector3(0, 1.5, -5)
    );

    // 3. Chemical Tanks
    const tankGeo = new THREE.CapsuleGeometry(0.8, 2, 16, 16);
    const tank1 = new THREE.Mesh(tankGeo, glass);
    const tank2 = new THREE.Mesh(tankGeo, tinted);
    
    // Add glowing inner fluid
    const fluidGeo = new THREE.CapsuleGeometry(0.7, 1.9, 16, 16);
    const fluid1 = new THREE.Mesh(fluidGeo, neonBlue);
    tank1.add(fluid1);
    const fluid2 = new THREE.Mesh(fluidGeo, neonPurple);
    tank2.add(fluid2);

    addPart(
        tank1,
        "Silver Iodide Tank",
        "Holds the primary seeding compound.",
        "Supplies AgI for ice crystal nucleation.",
        3,
        ["Power Core", "Mixing Chamber"],
        "No primary compound supplied.",
        ["Mixing Chamber"],
        new THREE.Vector3(-2.5, 2, 0),
        new THREE.Vector3(-6, 2, 0)
    );
    addPart(
        tank2,
        "Catalyst Tank",
        "Holds secondary catalyst.",
        "Enhances the reaction rate of the seeding compound.",
        4,
        ["Power Core", "Mixing Chamber"],
        "Reaction rate drops, seeding efficiency decreases.",
        ["Mixing Chamber"],
        new THREE.Vector3(2.5, 2, 0),
        new THREE.Vector3(6, 2, 0)
    );

    // 4. Mixing Chamber
    const mixGeo = new THREE.TorusGeometry(1.2, 0.4, 16, 32);
    const mixMesh = new THREE.Mesh(mixGeo, chrome);
    addPart(
        mixMesh,
        "Plasma Mixing Chamber",
        "Combines and heats compounds.",
        "Prepares the mixture before acceleration.",
        5,
        ["Silver Iodide Tank", "Catalyst Tank", "Accelerator Tube"],
        "Compounds don't mix, raw materials ejected.",
        ["Accelerator Tube"],
        new THREE.Vector3(0, 4, 0),
        new THREE.Vector3(0, 6, -3)
    );
    mixMesh.rotation.x = Math.PI / 2;

    // 5. Accelerator Tube
    const tubeGeo = new THREE.CylinderGeometry(0.5, 0.5, 4, 16);
    const tubeMesh = new THREE.Mesh(tubeGeo, copper);
    addPart(
        tubeMesh,
        "Electromagnetic Accelerator",
        "Accelerates the ionized mixture.",
        "Propels the compound upward at high velocities.",
        6,
        ["Mixing Chamber", "Dispersion Ring"],
        "Mixture gets stuck or loses velocity.",
        ["Dispersion Ring"],
        new THREE.Vector3(0, 6.5, 0),
        new THREE.Vector3(0, 10, 0)
    );

    // 6. Dispersion Ring
    const ringGeo = new THREE.TorusGeometry(3, 0.2, 16, 64);
    const ringMesh = new THREE.Mesh(ringGeo, aluminum);
    
    // Add nodes to ring
    for(let i=0; i<8; i++) {
        const nodeGeo = new THREE.SphereGeometry(0.4, 16, 16);
        const nodeMesh = new THREE.Mesh(nodeGeo, neonBlue);
        nodeMesh.position.set(Math.cos(i * Math.PI/4) * 3, 0, Math.sin(i * Math.PI/4) * 3);
        ringMesh.add(nodeMesh);
    }

    addPart(
        ringMesh,
        "Atmospheric Dispersion Ring",
        "Projects the compound into the atmosphere.",
        "Distributes the accelerated mixture over a wide area.",
        7,
        ["Accelerator Tube"],
        "Uneven or highly localized dispersion.",
        [],
        new THREE.Vector3(0, 9, 0),
        new THREE.Vector3(0, 14, 0)
    );
    ringMesh.rotation.x = Math.PI / 2;

    // 7. Antenna Array
    const antennaGeo = new THREE.CylinderGeometry(0.1, 0.1, 3, 8);
    const antennaMesh = new THREE.Mesh(antennaGeo, steel);
    const tipGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const tipMesh = new THREE.Mesh(tipGeo, neonPurple);
    tipMesh.position.y = 1.5;
    antennaMesh.add(tipMesh);
    
    addPart(
        antennaMesh,
        "Telemetry Antenna",
        "Communicates with weather satellites.",
        "Receives targeting data and transmits system status.",
        8,
        ["Stabilization Base"],
        "Loss of targeting data.",
        ["Atmospheric Dispersion Ring"],
        new THREE.Vector3(3.5, 2, 3.5),
        new THREE.Vector3(6, 2, 6)
    );


    const description = "The Atmospheric Cloud Seeder is an advanced piece of geoengineering technology designed to induce precipitation. It uses electromagnetic acceleration to propel ionized silver iodide and catalysts into the upper atmosphere, nucleating ice crystals and forcing rain.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Ionization Core?",
            options: [
                "To store the silver iodide.",
                "To generate charged particles and power the seeding process.",
                "To communicate with satellites.",
                "To cool the machine down."
            ],
            correct: 1,
            explanation: "The Ionization Core generates the charged particles required to ionize the chemical compounds and provides power.",
            difficulty: "Medium"
        },
        {
            question: "Why is the Electromagnetic Accelerator necessary?",
            options: [
                "It mixes the chemicals together.",
                "It propels the ionized mixture upward into the atmosphere at high velocities.",
                "It prevents the machine from tipping over.",
                "It gathers moisture from the surrounding air."
            ],
            correct: 1,
            explanation: "The accelerator is needed to give the compound enough velocity to reach the target altitude in the atmosphere.",
            difficulty: "Easy"
        },
        {
            question: "If the Plasma Mixing Chamber fails, what is the most likely consequence?",
            options: [
                "The machine will explode.",
                "Raw, unmixed materials will be ejected.",
                "The antenna will lose connection.",
                "The base will vibrate heavily."
            ],
            correct: 1,
            explanation: "The Mixing Chamber combines and heats the compounds. Without it, the materials remain raw and unmixed before acceleration.",
            difficulty: "Hard"
        }
    ];

    const animate = (time, speed, activeMeshes) => {
        activeMeshes.forEach(part => {
            const mesh = part.mesh;
            
            if (part.name === "Ionization Core") {
                mesh.rotation.y += 0.05 * speed;
                mesh.rotation.x += 0.03 * speed;
                mesh.scale.setScalar(1 + Math.sin(time * 5) * 0.05);
                if (mesh.material.emissiveIntensity !== undefined) {
                    mesh.material.emissiveIntensity = 2.0 + Math.sin(time * 10) * 0.5;
                }
            }

            if (part.name === "Plasma Mixing Chamber") {
                mesh.rotation.z += 0.02 * speed;
            }

            if (part.name === "Atmospheric Dispersion Ring") {
                mesh.rotation.z -= 0.01 * speed; // remember it is rotated 90deg on x
                // pulse the nodes
                mesh.children.forEach((node, i) => {
                    node.scale.setScalar(1 + Math.sin(time * 8 + i) * 0.3);
                });
            }
            
            if (part.name === "Silver Iodide Tank" || part.name === "Catalyst Tank") {
                if (mesh.children.length > 0) {
                    const fluid = mesh.children[0];
                    fluid.position.y = Math.sin(time * 2 + (part.name === "Silver Iodide Tank" ? 0 : Math.PI)) * 0.1;
                }
            }

            if (part.name === "Telemetry Antenna") {
                if (mesh.children.length > 0) {
                    const tip = mesh.children[0];
                    tip.material.emissiveIntensity = 0.6 + Math.sin(time * 15) * 0.4;
                }
            }
        });
    };

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createCloudSeeder() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
