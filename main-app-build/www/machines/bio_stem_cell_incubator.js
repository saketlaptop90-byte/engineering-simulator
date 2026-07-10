import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom glowing materials
    const bioGlow1 = new THREE.MeshStandardMaterial({
        color: 0x00ff88,
        emissive: 0x00ff88,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.8,
        roughness: 0.1,
        metalness: 0.1
    });

    const bioGlow2 = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 0.6,
        transparent: true,
        opacity: 0.8,
        roughness: 0.2,
        metalness: 0.1
    });
    
    const neonPink = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 0.5,
        roughness: 0.4,
        metalness: 0.2
    });

    // 1. Base Structure (Incubator Chassis)
    const chassisGeo = new THREE.CylinderGeometry(3, 3, 2, 32);
    const chassisMesh = new THREE.Mesh(chassisGeo, darkSteel);
    chassisMesh.position.set(0, -1, 0);
    group.add(chassisMesh);
    meshes.chassis = chassisMesh;

    parts.push({
        name: "Incubator Chassis",
        description: "The main structural base housing life-support systems and temperature regulation coils.",
        material: "Dark Steel",
        function: "Provides structural integrity and thermal mass for temperature stability.",
        assemblyOrder: 1,
        connections: ["Thermal Coils", "Nutrient Pump", "Incubation Chamber"],
        failureEffect: "Structural compromise leads to environmental contamination.",
        cascadeFailures: ["Incubation Chamber", "Thermal Coils"],
        originalPosition: { x: 0, y: -1, z: 0 },
        explodedPosition: { x: 0, y: -4, z: 0 }
    });

    // 2. Incubation Chamber (Glass Dome)
    const domeGeo = new THREE.SphereGeometry(2.8, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMesh = new THREE.Mesh(domeGeo, glass);
    domeMesh.position.set(0, 0, 0);
    group.add(domeMesh);
    meshes.dome = domeMesh;

    parts.push({
        name: "Sterile Incubation Chamber",
        description: "A hermetically sealed dome providing a sterile, controlled environment for cell growth.",
        material: "Tempered Glass",
        function: "Maintains sterility and specific atmospheric conditions (CO2/O2).",
        assemblyOrder: 2,
        connections: ["Incubator Chassis", "Gas Sensors"],
        failureEffect: "Rapid contamination and cell death due to exposure.",
        cascadeFailures: ["Stem Cell Clusters"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 }
    });

    // 3. Central Bioreactor Core
    const coreGeo = new THREE.CylinderGeometry(0.5, 0.5, 3, 16);
    const coreMesh = new THREE.Mesh(coreGeo, chrome);
    coreMesh.position.set(0, 1.5, 0);
    group.add(coreMesh);
    meshes.core = coreMesh;

    parts.push({
        name: "Central Bioreactor Core",
        description: "The primary perfusion core delivering nutrients and oxygen directly to the cell clusters.",
        material: "Chrome",
        function: "Circulates the growth medium and provides structural support for the scaffold.",
        assemblyOrder: 3,
        connections: ["Incubator Chassis", "Nutrient Feeders", "Stem Cell Clusters"],
        failureEffect: "Nutrient starvation and hypoxia in the core cell clusters.",
        cascadeFailures: ["Stem Cell Clusters", "Waste Extractors"],
        originalPosition: { x: 0, y: 1.5, z: 0 },
        explodedPosition: { x: 0, y: 2, z: -5 }
    });

    // 4. Stem Cell Clusters
    const clusterGroup = new THREE.Group();
    for(let i=0; i<6; i++) {
        const cellGeo = new THREE.IcosahedronGeometry(0.3, 1);
        const cellMesh = new THREE.Mesh(cellGeo, bioGlow1);
        const angle = (i / 6) * Math.PI * 2;
        cellMesh.position.set(Math.cos(angle) * 1.2, 1.5 + (Math.random()*0.5 - 0.25), Math.sin(angle) * 1.2);
        clusterGroup.add(cellMesh);
    }
    group.add(clusterGroup);
    meshes.clusters = clusterGroup;

    parts.push({
        name: "Pluripotent Stem Cell Clusters",
        description: "Aggregates of undifferentiated cells multiplying on a 3D bio-scaffold.",
        material: "Organic/Bioluminescent",
        function: "Differentiate into specific tissue types under controlled stimuli.",
        assemblyOrder: 4,
        connections: ["Central Bioreactor Core"],
        failureEffect: "Apoptosis or unwanted differentiation.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 1.5, z: 5 }
    });

    // 5. Robotic Nutrient Feeders
    const feeders = new THREE.Group();
    for(let i=0; i<3; i++) {
        const armGeo = new THREE.BoxGeometry(0.1, 1.5, 0.1);
        const armMesh = new THREE.Mesh(armGeo, aluminum);
        const angle = (i / 3) * Math.PI * 2;
        armMesh.position.set(Math.cos(angle) * 2, 1.5, Math.sin(angle) * 2);
        armMesh.rotation.z = Math.PI / 6 * (Math.cos(angle));
        armMesh.rotation.x = Math.PI / 6 * (Math.sin(angle));
        feeders.add(armMesh);
    }
    group.add(feeders);
    meshes.feeders = feeders;

    parts.push({
        name: "Robotic Nutrient Feeders",
        description: "Micro-manipulator arms that precisely inject growth factors and adjust local pH.",
        material: "Aluminum",
        function: "Maintains optimal localized microenvironments for differentiation.",
        assemblyOrder: 5,
        connections: ["Incubator Chassis", "Stem Cell Clusters"],
        failureEffect: "Uneven growth and potential necrosis in specific regions.",
        cascadeFailures: ["Stem Cell Clusters"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 4, y: 1.5, z: 0 }
    });

    // 6. Thermal Regulation Coils
    const coilGeo = new THREE.TorusGeometry(1.5, 0.1, 16, 64);
    const coilMesh1 = new THREE.Mesh(coilGeo, copper);
    coilMesh1.rotation.x = Math.PI / 2;
    coilMesh1.position.y = 0.5;
    const coilMesh2 = new THREE.Mesh(coilGeo, neonPink);
    coilMesh2.rotation.x = Math.PI / 2;
    coilMesh2.position.y = 2.5;
    
    group.add(coilMesh1);
    group.add(coilMesh2);
    meshes.coil1 = coilMesh1;
    meshes.coil2 = coilMesh2;

    parts.push({
        name: "Thermal Regulation Coils",
        description: "Precision heating and cooling elements surrounding the bio-core.",
        material: "Copper / Neon Alloy",
        function: "Maintains core temperature exactly at 37.0°C.",
        assemblyOrder: 6,
        connections: ["Incubator Chassis", "Incubation Chamber"],
        failureEffect: "Temperature fluctuations causing heat shock or stalled metabolism.",
        cascadeFailures: ["Stem Cell Clusters"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -4, y: 1.5, z: 0 }
    });

    const description = "The Bio Stem Cell Incubator is a cutting-edge regenerative medicine device. It provides an ultra-sterile, precisely controlled environment for cultivating pluripotent stem cells. Through advanced micro-robotics and continuous perfusion, it guides cellular differentiation to create viable tissue grafts and organs.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Central Bioreactor Core?",
            options: [
                "To generate electricity for the incubator.",
                "To provide structural support and circulate growth medium/oxygen.",
                "To sterilize the glass dome.",
                "To measure the ambient room temperature."
            ],
            correct: 1,
            explanation: "The core acts as a scaffold and the main circulatory system, delivering nutrients directly to the cell clusters.",
            difficulty: "medium"
        },
        {
            question: "Why is maintaining exact temperature via the Thermal Regulation Coils critical?",
            options: [
                "It prevents the glass dome from cracking.",
                "It keeps the nutrient fluid from boiling.",
                "Mammalian cells require ~37°C; fluctuations cause heat shock or metabolic failure.",
                "It powers the bioluminescence of the cells."
            ],
            correct: 2,
            explanation: "Stem cells are extremely sensitive to temperature variations, which can trigger apoptosis (cell death) or stress responses.",
            difficulty: "easy"
        },
        {
            question: "What happens if the Robotic Nutrient Feeders fail?",
            options: [
                "The incubator explodes.",
                "Cells experience uneven growth, nutrient starvation, and localized necrosis.",
                "The cells automatically revert to a dormant state.",
                "The glass dome becomes opaque."
            ],
            correct: 1,
            explanation: "The feeders maintain local microenvironments; their failure leads to starvation and death of cell clusters.",
            difficulty: "hard"
        }
    ];

    function animate(time, speed, meshesObj) {
        if (!meshesObj) return;
        
        // Rotate the core slowly
        if (meshesObj.core) meshesObj.core.rotation.y = time * speed * 0.2;
        
        // Pulsate the glowing cells
        if (meshesObj.clusters) {
            meshesObj.clusters.rotation.y = -time * speed * 0.1;
            meshesObj.clusters.children.forEach((cell, i) => {
                const scale = 1 + Math.sin(time * speed * 2 + i) * 0.15;
                cell.scale.set(scale, scale, scale);
                cell.position.y = 1.5 + Math.sin(time * speed + i * 2) * 0.2;
            });
        }
        
        // Move the robotic arms
        if (meshesObj.feeders) {
            meshesObj.feeders.children.forEach((arm, i) => {
                arm.rotation.x = (Math.sin(time * speed * 1.5 + i) * Math.PI / 12) + (Math.PI / 6);
            });
        }

        // Spin the thermal coils
        if (meshesObj.coil1) meshesObj.coil1.rotation.z = time * speed * 0.5;
        if (meshesObj.coil2) meshesObj.coil2.rotation.z = -time * speed * 0.5;
    }

    return { group, parts, description, quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createStemCellIncubator() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
