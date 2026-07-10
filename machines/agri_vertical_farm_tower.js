import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom Materials
    const glowPink = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.9,
    });

    const glowBlue = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 1.0,
        transparent: true,
        opacity: 0.8,
    });

    const mistMaterial = new THREE.MeshStandardMaterial({
        color: 0xeeeeff,
        transparent: true,
        opacity: 0.3,
        depthWrite: false,
    });

    const plantMaterial = new THREE.MeshStandardMaterial({
        color: 0x22cc44,
        roughness: 0.8,
    });

    // 1. Base Support
    const baseGeometry = new THREE.CylinderGeometry(8, 10, 2, 32);
    const base = new THREE.Mesh(baseGeometry, steel);
    base.position.set(0, 1, 0);
    group.add(base);
    meshes.base = base;
    parts.push({
        name: "Foundation Base",
        description: "Supports the entire vertical farm tower, housing the central nutrient reservoir.",
        material: "steel",
        function: "Structural support and fluid storage.",
        assemblyOrder: 1,
        connections: ["Central Pillar", "Nutrient Pump"],
        failureEffect: "Tower collapse or massive nutrient leak.",
        cascadeFailures: ["Loss of crops", "Pump burnout"],
        originalPosition: { x: 0, y: 1, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 }
    });

    // 2. Nutrient Pump
    const pumpGeo = new THREE.BoxGeometry(3, 3, 4);
    const pump = new THREE.Mesh(pumpGeo, darkSteel);
    pump.position.set(0, 3, -5);
    group.add(pump);
    meshes.pump = pump;
    parts.push({
        name: "Aeroponic Pump",
        description: "High-pressure pump that pushes nutrient-rich water to the sprayers.",
        material: "darkSteel",
        function: "Pressurizes the nutrient solution for misting.",
        assemblyOrder: 2,
        connections: ["Foundation Base", "Central Pillar"],
        failureEffect: "Loss of misting.",
        cascadeFailures: ["Crop dehydration", "Root death"],
        originalPosition: { x: 0, y: 3, z: -5 },
        explodedPosition: { x: 0, y: 3, z: -15 }
    });

    // 3. Central Pillar
    const pillarGeo = new THREE.CylinderGeometry(2, 2, 40, 16);
    const pillar = new THREE.Mesh(pillarGeo, aluminum);
    pillar.position.set(0, 22, 0);
    group.add(pillar);
    meshes.pillar = pillar;
    parts.push({
        name: "Central Core",
        description: "The primary structural spine and conduit for plumbing and power.",
        material: "aluminum",
        function: "Supports the carousel and houses internal piping.",
        assemblyOrder: 3,
        connections: ["Foundation Base", "Carousel Track"],
        failureEffect: "Total structural failure.",
        cascadeFailures: ["Tower collapse"],
        originalPosition: { x: 0, y: 22, z: 0 },
        explodedPosition: { x: 0, y: 22, z: -10 }
    });

    // 4. Outer Glass Enclosure
    const glassGeo = new THREE.CylinderGeometry(11, 11, 42, 32, 1, true);
    const glassEnclosure = new THREE.Mesh(glassGeo, tinted);
    glassEnclosure.position.set(0, 23, 0);
    group.add(glassEnclosure);
    meshes.glassEnclosure = glassEnclosure;
    parts.push({
        name: "Environmental Glass Shell",
        description: "Transparent casing that maintains a controlled internal climate.",
        material: "tinted",
        function: "Climate control and pest protection.",
        assemblyOrder: 4,
        connections: ["Foundation Base"],
        failureEffect: "Climate destabilization.",
        cascadeFailures: ["Pest infestation", "Crop stress"],
        originalPosition: { x: 0, y: 23, z: 0 },
        explodedPosition: { x: 0, y: 40, z: 0 }
    });

    // 5. Carousel Trays (8 Trays)
    const trayGeo = new THREE.BoxGeometry(6, 1, 4);
    const plantGeo = new THREE.SphereGeometry(1.5, 8, 8); // Abstraction of plant canopy
    const ledGeo = new THREE.BoxGeometry(6, 0.2, 2);
    const mistGeo = new THREE.CylinderGeometry(1, 2, 3, 16);

    const trays = [];
    for (let i = 0; i < 8; i++) {
        const trayGroup = new THREE.Group();
        
        // Tray
        const tray = new THREE.Mesh(trayGeo, plastic);
        trayGroup.add(tray);
        
        // Plants
        const plant1 = new THREE.Mesh(plantGeo, plantMaterial);
        plant1.position.set(-1.5, 1, 0);
        trayGroup.add(plant1);
        const plant2 = new THREE.Mesh(plantGeo, plantMaterial);
        plant2.position.set(1.5, 1, 0);
        trayGroup.add(plant2);

        // LED Panel
        const led = new THREE.Mesh(ledGeo, glowPink);
        led.position.set(0, 4, 0);
        trayGroup.add(led);

        // Mist
        const mist = new THREE.Mesh(mistGeo, mistMaterial);
        mist.position.set(0, -2, 0);
        trayGroup.add(mist);

        group.add(trayGroup);
        trays.push(trayGroup);

        parts.push({
            name: `Grow Tray ${i+1}`,
            description: "Houses the crop roots in air, exposed to nutrient mist.",
            material: "plastic",
            function: "Holds plants and houses local LED/misting systems.",
            assemblyOrder: 5 + i,
            connections: ["Carousel Track"],
            failureEffect: "Loss of specific crop batch.",
            cascadeFailures: [],
            originalPosition: { x: 0, y: 22, z: 0 },
            explodedPosition: { x: Math.cos(i * Math.PI/4) * 20, y: 22, z: Math.sin(i * Math.PI/4) * 20 }
        });
    }
    meshes.trays = trays;

    const description = "The Agri Vertical Farm Tower utilizes an automated aeroponic carousel system. Plants rotate vertically around a central core, passing through optimal zones for pink/purple LED lighting and high-pressure nutrient misting. This maximizes yield per square foot while drastically reducing water usage compared to traditional agriculture.";

    const quizQuestions = [
        {
            question: "Why does the Vertical Farm Tower use an aeroponic misting system instead of soil?",
            options: [
                "It looks more high-tech",
                "To maximize root oxygenation and reduce water usage by up to 95%",
                "To increase the weight of the tower for stability",
                "Soil is too expensive"
            ],
            correct: 1,
            explanation: "Aeroponics suspends roots in air and mists them with nutrients, providing maximum oxygenation and using vastly less water than traditional soil or hydroponic farming.",
            difficulty: "Medium"
        },
        {
            question: "What is the purpose of the pink/purple LED grow lights?",
            options: [
                "Aesthetic appeal for investors",
                "They emit UV light to kill pests",
                "They target the specific red and blue wavelengths most efficient for chlorophyll absorption",
                "They generate heat to keep the plants warm"
            ],
            correct: 2,
            explanation: "Plants primarily use red and blue light for photosynthesis. By only emitting these specific wavelengths (which appear purple/pink), the farm saves massive amounts of electricity.",
            difficulty: "Hard"
        },
        {
            question: "What is the function of the rotating vertical carousel?",
            options: [
                "To evenly distribute light, airflow, and facilitate automated harvesting at the base",
                "To make the plants dizzy so they grow faster",
                "To act as a large fan to cool the room",
                "It is purely decorative"
            ],
            correct: 0,
            explanation: "Rotating the crops vertically ensures that all plants receive equal exposure to any external light/airflow, and allows a single robotic or human station at the bottom to harvest and plant everything.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, activeMeshes) {
        if (!activeMeshes.trays) return;
        
        const carouselSpeed = time * speed * 0.5;
        const radius = 6;
        const height = 18;
        const centerY = 22;

        activeMeshes.trays.forEach((tray, index) => {
            const angle = carouselSpeed + (index / 8) * Math.PI * 2;
            
            const x = Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * height;
            
            tray.position.set(x, y, 0);

            const ledIntensity = 1.5 + Math.sin(time * 5 + index) * 0.5;
            const ledMesh = tray.children[3];
            if (ledMesh && ledMesh.material.emissiveIntensity !== undefined) {
                ledMesh.material.emissiveIntensity = ledIntensity;
            }

            const mistMesh = tray.children[4];
            if (mistMesh && mistMesh.material) {
                mistMesh.material.opacity = 0.2 + Math.sin(time * 10 + index) * 0.1;
                mistMesh.position.y = -2 + (Math.sin(time * 20) * 0.2);
            }
        });
    }

    return { group, parts, description, quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createVerticalFarmTower() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
