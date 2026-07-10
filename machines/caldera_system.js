import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    const crustMaterial = new THREE.MeshStandardMaterial({
        color: 0x8B5A2B,
        roughness: 0.9,
        metalness: 0.1,
        transparent: true,
        opacity: 0.8 // Translucent cross-section
    });

    const magmaMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xFF3300,
        emissive: 0xFF2200,
        emissiveIntensity: 2.0,
        roughness: 0.2,
        metalness: 0.1,
        transmission: 0.2,
        thickness: 1.0,
        clearcoat: 1.0
    });
    
    const conduitMaterial = new THREE.MeshStandardMaterial({
        color: 0xaa2200,
        emissive: 0x551100,
        roughness: 0.7,
        metalness: 0.1
    });

    const ashMaterial = new THREE.PointsMaterial({
        color: 0x444444,
        size: 0.2,
        transparent: true,
        opacity: 0.6
    });

    // 1. Crust / Caldera Rim
    const crustGeo = new THREE.CylinderGeometry(15, 20, 10, 32);
    const crustMesh = new THREE.Mesh(crustGeo, crustMaterial);
    crustMesh.position.set(0, 0, 0);
    group.add(crustMesh);
    meshes.crust = crustMesh;
    parts.push({
        name: "Lithosphere / Surface Crust",
        description: "The outermost shell of the Earth, featuring the collapsed caldera rim.",
        material: "Rock/Soil",
        function: "Contains the pressure from below and forms the caldera structure after previous eruptions.",
        assemblyOrder: 1,
        connections: ["Magma Chamber", "Vent Conduit"],
        failureEffect: "Ground deformation, earthquakes, and eventual rupture.",
        cascadeFailures: ["Eruption Initiation"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 15, z: 0}
    });

    // 2. Magma Chamber
    const magmaGeo = new THREE.SphereGeometry(6, 32, 32);
    const magmaMesh = new THREE.Mesh(magmaGeo, magmaMaterial);
    magmaMesh.position.set(0, -12, 0);
    magmaMesh.scale.set(1.5, 0.8, 1.2);
    group.add(magmaMesh);
    meshes.magmaChamber = magmaMesh;
    parts.push({
        name: "Magma Chamber",
        description: "A large underground pool of liquid rock found beneath the surface of the Earth.",
        material: "Molten Rock (Silicic Magma)",
        function: "Stores magma, builds up immense pressure and volatile gases over millennia.",
        assemblyOrder: 2,
        connections: ["Vent Conduit", "Lithosphere / Surface Crust"],
        failureEffect: "Chamber roof collapse leading to catastrophic supereruption.",
        cascadeFailures: ["Caldera Collapse", "Global Ash Fall"],
        originalPosition: {x: 0, y: -12, z: 0},
        explodedPosition: {x: 0, y: -30, z: 0}
    });

    // 3. Central Conduit
    const conduitGeo = new THREE.CylinderGeometry(2, 3, 12, 16);
    const conduitMesh = new THREE.Mesh(conduitGeo, conduitMaterial);
    conduitMesh.position.set(0, -6, 0);
    group.add(conduitMesh);
    meshes.conduit = conduitMesh;
    parts.push({
        name: "Main Vent Conduit",
        description: "The primary channel through which magma travels to the surface.",
        material: "Solidified/Molten Rock",
        function: "Transports magma and volcanic gases to the caldera surface.",
        assemblyOrder: 3,
        connections: ["Magma Chamber", "Lithosphere / Surface Crust"],
        failureEffect: "Blockage leads to explosive lateral blasts or increased chamber pressure.",
        cascadeFailures: ["Flank Eruption"],
        originalPosition: {x: 0, y: -6, z: 0},
        explodedPosition: {x: 25, y: -6, z: 0}
    });

    // 4. Geysers / Hydrothermal System
    const hydroGeo = new THREE.TorusGeometry(8, 0.5, 16, 32);
    const hydroMat = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x0055ff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8
    });
    const hydroMesh = new THREE.Mesh(hydroGeo, hydroMat);
    hydroMesh.rotation.x = Math.PI / 2;
    hydroMesh.position.set(0, 4, 0);
    group.add(hydroMesh);
    meshes.hydrothermal = hydroMesh;
    parts.push({
        name: "Hydrothermal System",
        description: "A network of heated groundwater creating geysers and hot springs at the surface.",
        material: "Superheated Water / Steam",
        function: "Releases heat and pressure from the magma chamber below.",
        assemblyOrder: 4,
        connections: ["Lithosphere / Surface Crust", "Magma Chamber"],
        failureEffect: "Phreatic explosions, sudden violent steam eruptions.",
        cascadeFailures: ["Crater Formation", "Localized Destruction"],
        originalPosition: {x: 0, y: 4, z: 0},
        explodedPosition: {x: 0, y: 30, z: 0}
    });

    // 5. Ash / Gas Plume (Particles)
    const plumeGeo = new THREE.BufferGeometry();
    const plumeCount = 1000;
    const posArray = new Float32Array(plumeCount * 3);
    for(let i=0; i<plumeCount*3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10;
    }
    plumeGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const plumeMesh = new THREE.Points(plumeGeo, ashMaterial);
    plumeMesh.position.set(0, 10, 0);
    group.add(plumeMesh);
    meshes.plume = plumeMesh;
    parts.push({
        name: "Ash and Gas Plume",
        description: "Volatile gases and fragmented rock expelled during an eruption.",
        material: "Ash, SO2, CO2, H2O",
        function: "Disperses volcanic material into the atmosphere, causing climatic effects.",
        assemblyOrder: 5,
        connections: ["Main Vent Conduit"],
        failureEffect: "Global cooling (volcanic winter), aviation hazard.",
        cascadeFailures: ["Crop Failure", "Temperature Drop"],
        originalPosition: {x: 0, y: 10, z: 0},
        explodedPosition: {x: -25, y: 25, z: 0}
    });

    const description = "A geological supervolcano simulation detailing a massive magma chamber, hydrothermal systems, and caldera crust dynamics. It visualizes the internal pressures and structures leading to a supereruption.";

    const quizQuestions = [
        {
            question: "What is the primary cause of a caldera collapse?",
            options: [
                "Tectonic plates colliding",
                "Emptying of the underlying magma chamber",
                "Meteorite impact",
                "Glacial erosion"
            ],
            correct: 1,
            explanation: "When a massive eruption empties the magma chamber, the overlying rock loses support and collapses inward, forming a caldera.",
            difficulty: "Medium"
        },
        {
            question: "Which gas is most responsible for building explosive pressure in a magma chamber?",
            options: [
                "Nitrogen",
                "Oxygen",
                "Water Vapor (H2O)",
                "Helium"
            ],
            correct: 2,
            explanation: "Dissolved water vapor (and carbon dioxide) exsolves as pressure changes, expanding massively and driving explosive eruptions.",
            difficulty: "Hard"
        },
        {
            question: "What indicates an active hydrothermal system above a magma chamber?",
            options: [
                "Geysers and fumaroles",
                "Magnetic anomalies",
                "Fossils",
                "Sand dunes"
            ],
            correct: 0,
            explanation: "Geysers, hot springs, and fumaroles are surface expressions of groundwater heated by magma below.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, activeMeshes) {
        // Pulsate magma chamber
        const pulse = Math.sin(time * speed * 2) * 0.05;
        if(activeMeshes.magmaChamber) {
            activeMeshes.magmaChamber.scale.set(1.5 + pulse, 0.8 + pulse, 1.2 + pulse);
            activeMeshes.magmaChamber.material.emissiveIntensity = 2.0 + Math.sin(time * speed * 4);
        }

        // Animate hydrothermal system glowing rings
        if(activeMeshes.hydrothermal) {
            activeMeshes.hydrothermal.scale.set(1 + pulse*0.5, 1 + pulse*0.5, 1 + pulse*0.5);
            activeMeshes.hydrothermal.material.opacity = 0.6 + 0.2 * Math.sin(time * speed * 5);
        }

        // Animate Ash plume moving upwards
        if(activeMeshes.plume) {
            const positions = activeMeshes.plume.geometry.attributes.position.array;
            for(let i=1; i<positions.length; i+=3) {
                positions[i] += 0.1 * speed;
                if(positions[i] > 20) {
                    positions[i] = 0; // reset to bottom
                }
                positions[i-1] += (Math.random() - 0.5) * 0.1; // x drift
                positions[i+1] += (Math.random() - 0.5) * 0.1; // z drift
            }
            activeMeshes.plume.geometry.attributes.position.needsUpdate = true;
        }
    }

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate: (time, speed) => animate(time, speed, meshes)
    };
}

// Auto-generated missing stub
export function createCalderaSystem() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
