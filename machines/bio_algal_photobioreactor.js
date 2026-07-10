import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const bioGreen = new THREE.MeshPhysicalMaterial({
        color: 0x00ff44,
        emissive: 0x00cc22,
        emissiveIntensity: 0.8,
        transmission: 0.9,
        opacity: 0.9,
        transparent: true,
        roughness: 0.1,
        metalness: 0.1,
        ior: 1.33
    });

    const ledLight = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xaaaaff,
        emissiveIntensity: 2.0,
        roughness: 0.2
    });

    const screenMaterial = new THREE.MeshStandardMaterial({
        color: 0x001133,
        emissive: 0x0044ff,
        emissiveIntensity: 1.5,
        roughness: 0.4
    });

    const description = "Algal Photobioreactor (PBR): A high-tech closed system for cultivating microalgae. It optimizes light, CO2, and nutrient distribution to maximize biomass production for biofuel and carbon capture.";

    const meshes = {};

    function addPart(name, mesh, desc, material, func, assemblyOrder, connections, failure, cascade, expPos) {
        mesh.name = name;
        group.add(mesh);
        meshes[name] = mesh;
        
        parts.push({
            name: name,
            description: desc,
            material: material,
            function: func,
            assemblyOrder: assemblyOrder,
            connections: connections,
            failureEffect: failure,
            cascadeFailures: cascade,
            originalPosition: { x: mesh.position.x, y: mesh.position.y, z: mesh.position.z },
            explodedPosition: expPos
        });
    }

    // 1. Base Platform
    const baseGeo = new THREE.CylinderGeometry(5, 5, 0.5, 32);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.position.set(0, -0.25, 0);
    addPart(
        "Base Platform",
        baseMesh,
        "Heavy foundational platform housing the main plumbing and electrical conduits.",
        "Dark Steel",
        "Provides structural stability and routes utilities to vertical components.",
        1,
        ["Circulation Pumps", "Central Manifold"],
        "Vibrations cause leaks in primary piping.",
        ["Circulation Pumps", "CO2 Injector"],
        {x: 0, y: -5, z: 0}
    );

    // 2. Central Manifold
    const manifoldGeo = new THREE.CylinderGeometry(1, 1, 6, 16);
    const manifoldMesh = new THREE.Mesh(manifoldGeo, chrome);
    manifoldMesh.position.set(0, 3, 0);
    addPart(
        "Central Manifold",
        manifoldMesh,
        "Core distribution column that routes water, nutrients, and CO2.",
        "Chrome",
        "Distributes inputs evenly to all peripheral growth tubes.",
        2,
        ["Base Platform", "Growth Tubes", "CO2 Injector"],
        "Uneven nutrient distribution reduces yield.",
        ["Growth Tubes"],
        {x: 0, y: 10, z: 0}
    );

    // 3. Growth Tubes (Array of 8)
    const tubesGroup = new THREE.Group();
    tubesGroup.position.set(0,3,0);
    for (let i=0; i<8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const r = 3;
        
        // Outer glass
        const tubeGeo = new THREE.CylinderGeometry(0.4, 0.4, 5.5, 16);
        const tube = new THREE.Mesh(tubeGeo, glass);
        tube.position.set(Math.cos(angle) * r, 0, Math.sin(angle) * r);
        tubesGroup.add(tube);
        
        // Inner liquid
        const liquidGeo = new THREE.CylinderGeometry(0.35, 0.35, 5.4, 16);
        const liquid = new THREE.Mesh(liquidGeo, bioGreen);
        liquid.position.set(Math.cos(angle) * r, 0, Math.sin(angle) * r);
        liquid.userData.isLiquid = true;
        tubesGroup.add(liquid);
    }
    addPart(
        "Growth Tubes",
        tubesGroup,
        "Transparent vertical cylinders where photosynthesis occurs.",
        "Glass / Algae Culture",
        "Maximizes surface area for light exposure to dense algal cultures.",
        3,
        ["Central Manifold", "LED Panels"],
        "Culture crashes due to contamination or poor circulation.",
        ["Harvesting Centrifuge"],
        {x: 0, y: 3, z: 10}
    );

    // 4. LED Lighting Panels
    const ledGroup = new THREE.Group();
    ledGroup.position.set(0, 3, 0);
    for (let i=0; i<8; i++) {
        const angle = (i / 8) * Math.PI * 2 + (Math.PI / 8); // Offset between tubes
        const r = 3.5;
        const panelGeo = new THREE.BoxGeometry(0.1, 5, 0.5);
        const panel = new THREE.Mesh(panelGeo, aluminum);
        panel.position.set(Math.cos(angle) * r, 0, Math.sin(angle) * r);
        panel.lookAt(0, 0, 0); // Face inward

        const lightGeo = new THREE.PlaneGeometry(0.4, 4.8);
        const light = new THREE.Mesh(lightGeo, ledLight);
        light.position.set(-0.06, 0, 0);
        light.rotation.y = -Math.PI / 2;
        panel.add(light);

        ledGroup.add(panel);
    }
    addPart(
        "LED Arrays",
        ledGroup,
        "High-efficiency, tunable spectrum lighting panels facing the tubes.",
        "Aluminum / LED",
        "Provides optimal photons for maximum photosynthetic rate 24/7.",
        4,
        ["Growth Tubes"],
        "Reduced light intensity lowers biomass growth rate.",
        [],
        {x: 0, y: 3, z: -10}
    );

    // 5. Circulation Pump
    const pumpGeo = new THREE.SphereGeometry(0.8, 32, 32);
    const pumpMesh = new THREE.Mesh(pumpGeo, steel);
    pumpMesh.position.set(2, 0.5, 2);
    addPart(
        "Circulation Pump",
        pumpMesh,
        "High-flow impeller pump.",
        "Steel",
        "Maintains continuous flow to prevent settling and ensure nutrient mixing.",
        5,
        ["Base Platform", "Central Manifold"],
        "Flow stops, causing algae to settle and die off.",
        ["Growth Tubes", "Harvesting Centrifuge"],
        {x: 8, y: 0.5, z: 8}
    );

    // 6. CO2 Injection System
    const co2Geo = new THREE.CapsuleGeometry(0.5, 1.5, 16, 16);
    const co2Mesh = new THREE.Mesh(co2Geo, copper);
    co2Mesh.position.set(-2, 1.5, 2);
    addPart(
        "CO2 Injector",
        co2Mesh,
        "Pressurized gas exchange module for sparging CO2.",
        "Copper",
        "Dissolves carbon dioxide into the culture medium to feed algae.",
        6,
        ["Central Manifold"],
        "Low dissolved carbon halts photosynthesis.",
        ["Growth Tubes"],
        {x: -8, y: 1.5, z: 8}
    );

    // 7. Harvesting Centrifuge
    const centrifugeGeo = new THREE.CylinderGeometry(1.2, 1.5, 2, 32);
    const centrifugeMesh = new THREE.Mesh(centrifugeGeo, aluminum);
    centrifugeMesh.position.set(0, 1, -2.5);
    centrifugeMesh.rotation.x = Math.PI / 2;
    addPart(
        "Harvesting Centrifuge",
        centrifugeMesh,
        "High-speed separator.",
        "Aluminum",
        "Separates dense algal biomass from the liquid medium continuously.",
        7,
        ["Base Platform", "Central Manifold"],
        "Centrifuge jam halts biomass extraction.",
        ["Circulation Pump"],
        {x: 0, y: 1, z: -10}
    );

    // 8. Control Panel
    const panelGeo = new THREE.BoxGeometry(1.5, 1, 0.2);
    const panelMesh = new THREE.Mesh(panelGeo, plastic);
    panelMesh.position.set(-3, 2, -1);
    panelMesh.rotation.y = -Math.PI/4;

    const screenGeo = new THREE.PlaneGeometry(1.3, 0.8);
    const screenMesh = new THREE.Mesh(screenGeo, screenMaterial);
    screenMesh.position.set(0, 0, 0.11);
    panelMesh.add(screenMesh);

    addPart(
        "Control Panel",
        panelMesh,
        "Main computer interface with touch readouts.",
        "Plastic / Electronics",
        "Monitors pH, temperature, optical density, and regulates inputs.",
        8,
        ["Base Platform", "CO2 Injector", "Circulation Pump"],
        "Sensor drift causes incorrect chemical dosing.",
        ["Growth Tubes", "CO2 Injector"],
        {x: -6, y: 5, z: -6}
    );

    const quizQuestions = [
        {
            question: "Why is a tubular design often preferred over an open pond for algal photobioreactors?",
            options: [
                "It is cheaper to construct.",
                "It prevents contamination and allows precise control of inputs like light and CO2.",
                "It allows algae to evolve legs.",
                "Open ponds are illegal."
            ],
            correct: 1,
            explanation: "Closed systems like tubular photobioreactors prevent contamination from other species/predators, reduce evaporation, and allow precise regulation of the environment.",
            difficulty: "Medium"
        },
        {
            question: "What is the primary purpose of the CO2 injection system?",
            options: [
                "To cool down the reactor.",
                "To increase the pressure and burst the cells.",
                "To provide the carbon source necessary for photosynthesis.",
                "To clean the inside of the glass tubes."
            ],
            correct: 2,
            explanation: "Algae are photosynthetic organisms. They require carbon dioxide (CO2) along with light and water to produce biomass and oxygen.",
            difficulty: "Easy"
        },
        {
            question: "What failure would most likely result in the algae settling to the bottom and suffocating?",
            options: [
                "LED Panel Failure",
                "Harvesting Centrifuge Jam",
                "Circulation Pump Failure",
                "Control Panel Glitch"
            ],
            correct: 2,
            explanation: "The circulation pump maintains continuous flow, keeping the algae suspended in the medium so they can access light and dissolved gases.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshesObj) {
        const delta = time * speed;
        
        // Liquid pulsating/bubbling effect
        if (meshesObj["Growth Tubes"]) {
            meshesObj["Growth Tubes"].children.forEach(child => {
                if (child.userData.isLiquid) {
                    // Slight pulsing in opacity and scale to simulate bubbling/flow
                    child.scale.y = 1 + Math.sin(delta * 5 + child.position.x) * 0.02;
                    child.material.emissiveIntensity = 0.8 + Math.sin(delta * 2 + child.position.z) * 0.3;
                }
            });
        }

        // Spin the centrifuge
        if (meshesObj["Harvesting Centrifuge"]) {
            meshesObj["Harvesting Centrifuge"].rotation.y = delta * 10;
        }

        // Throb the pump
        if (meshesObj["Circulation Pump"]) {
            meshesObj["Circulation Pump"].scale.set(
                1 + Math.sin(delta * 8) * 0.05,
                1 + Math.sin(delta * 8 + Math.PI) * 0.05,
                1 + Math.sin(delta * 8) * 0.05
            );
        }

        // Blinking screen on control panel
        if (meshesObj["Control Panel"]) {
            const screen = meshesObj["Control Panel"].children[0];
            if (screen) {
                screen.material.emissiveIntensity = 1.0 + Math.random() * 1.0;
            }
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createAlgalPhotobioreactor() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
