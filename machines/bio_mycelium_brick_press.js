import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const myceliumGlow = new THREE.MeshStandardMaterial({ 
        color: 0x88ff88, 
        emissive: 0x22ff22, 
        emissiveIntensity: 2.0, 
        transparent: true, 
        opacity: 0.8 
    });

    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00aaff,
        emissive: 0x0055ff,
        emissiveIntensity: 1.5
    });

    // 1. Main Frame
    const frameGeo = new THREE.BoxGeometry(4, 8, 4);
    const frameMesh = new THREE.Mesh(frameGeo, steel);
    frameMesh.position.set(0, 0, 0);
    group.add(frameMesh);
    parts.push({
        name: "Main Chassis",
        description: "Heavy-duty structural framework supporting the immense pressures of the hydraulic compaction.",
        material: "steel",
        function: "Structural support",
        assemblyOrder: 1,
        connections: ["Hydraulic Ram", "Mold Base"],
        failureEffect: "Machine collapse or catastrophic misalignment during pressing.",
        cascadeFailures: ["Hydraulic Ram", "Mold Base", "Mycelium Injector"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -5 }
    });

    // 2. Mold Base
    const baseGeo = new THREE.BoxGeometry(3, 1, 3);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.position.set(0, -3.5, 0);
    group.add(baseMesh);
    parts.push({
        name: "Mold Chamber Base",
        description: "The reinforced containment area where agricultural waste and mycelial spores are initially mixed and compacted.",
        material: "darkSteel",
        function: "Containment and forming of the brick shape.",
        assemblyOrder: 2,
        connections: ["Main Chassis", "Hydraulic Ram"],
        failureEffect: "Deformed bricks or explosive decompression of the substrate.",
        cascadeFailures: ["Substrate Hopper"],
        originalPosition: { x: 0, y: -3.5, z: 0 },
        explodedPosition: { x: 0, y: -8, z: 0 }
    });

    // 3. Hydraulic Ram
    const ramGeo = new THREE.CylinderGeometry(0.5, 0.5, 3, 32);
    const ramMesh = new THREE.Mesh(ramGeo, chrome);
    ramMesh.position.set(0, 2, 0);
    group.add(ramMesh);
    parts.push({
        name: "Hydraulic Compaction Ram",
        description: "Delivers multi-ton pressure to compress the agricultural substrate into a dense, solid brick form.",
        material: "chrome",
        function: "Substrate compression",
        assemblyOrder: 3,
        connections: ["Main Chassis", "Press Head"],
        failureEffect: "Incomplete compaction, resulting in structurally weak bricks.",
        cascadeFailures: ["Press Head"],
        originalPosition: { x: 0, y: 2, z: 0 },
        explodedPosition: { x: 0, y: 6, z: 0 }
    });

    // 4. Press Head
    const headGeo = new THREE.BoxGeometry(2.8, 0.5, 2.8);
    const headMesh = new THREE.Mesh(headGeo, darkSteel);
    headMesh.position.set(0, 0.25, 0);
    group.add(headMesh);
    parts.push({
        name: "Press Head Platen",
        description: "The flat, heavy plate that directly interfaces with the substrate material during compression.",
        material: "darkSteel",
        function: "Even pressure distribution",
        assemblyOrder: 4,
        connections: ["Hydraulic Ram"],
        failureEffect: "Uneven bricks, local density variations.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0.25, z: 0 },
        explodedPosition: { x: 0, y: 4, z: 5 }
    });

    // 5. Mycelium Injector Network
    const injectorGeo = new THREE.TorusGeometry(1.6, 0.1, 16, 50);
    const injectorMesh = new THREE.Mesh(injectorGeo, myceliumGlow);
    injectorMesh.position.set(0, -2.5, 0);
    injectorMesh.rotation.x = Math.PI / 2;
    group.add(injectorMesh);
    parts.push({
        name: "Mycelial Spore Injector Ring",
        description: "A high-precision delivery matrix that evenly distributes bioluminescent mycelium spores into the compressed substrate, accelerating the binding process.",
        material: "myceliumGlow",
        function: "Biological binding agent delivery",
        assemblyOrder: 5,
        connections: ["Mold Chamber Base", "Nutrient Lines"],
        failureEffect: "Bricks will not bind, resulting in loose substrate instead of solid biomaterial.",
        cascadeFailures: ["Nutrient Lines"],
        originalPosition: { x: 0, y: -2.5, z: 0 },
        explodedPosition: { x: 5, y: -2.5, z: 0 }
    });

    // 6. Nutrient Lines
    const tubeGeo = new THREE.CylinderGeometry(0.1, 0.1, 4, 16);
    const tubeMesh1 = new THREE.Mesh(tubeGeo, copper);
    tubeMesh1.position.set(1.5, 0, 0);
    const tubeMesh2 = new THREE.Mesh(tubeGeo, copper);
    tubeMesh2.position.set(-1.5, 0, 0);
    group.add(tubeMesh1);
    group.add(tubeMesh2);
    parts.push({
        name: "Nutrient Supply Lines",
        description: "Delivers essential sugars and water to rapid-growth mycelium strains.",
        material: "copper",
        function: "Growth acceleration",
        assemblyOrder: 6,
        connections: ["Mycelial Spore Injector Ring"],
        failureEffect: "Slow growth, extended production times.",
        cascadeFailures: [],
        originalPosition: { x: 1.5, y: 0, z: 0 },
        explodedPosition: { x: 6, y: 0, z: -2 }
    });
    
    // 7. Substrate Hopper
    const hopperGeo = new THREE.ConeGeometry(2, 3, 4);
    const hopperMesh = new THREE.Mesh(hopperGeo, aluminum);
    hopperMesh.position.set(0, 5.5, 0);
    hopperMesh.rotation.y = Math.PI / 4;
    hopperMesh.rotation.z = Math.PI;
    group.add(hopperMesh);
    parts.push({
        name: "Agricultural Waste Hopper",
        description: "Stores and feeds the raw material (hemp hurds, sawdust, agricultural byproducts) into the mold.",
        material: "aluminum",
        function: "Material feeding",
        assemblyOrder: 7,
        connections: ["Main Chassis"],
        failureEffect: "Jamming, material starvation.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 5.5, z: 0 },
        explodedPosition: { x: -5, y: 8, z: 0 }
    });

    // 8. Control Panel
    const panelGeo = new THREE.BoxGeometry(1, 1.5, 0.2);
    const panelMesh = new THREE.Mesh(panelGeo, neonBlue);
    panelMesh.position.set(0, 1, 2.1);
    group.add(panelMesh);
    parts.push({
        name: "Holographic Interface Panel",
        description: "Monitors pressure levels, temperature, and mycelial growth metrics in real-time.",
        material: "neonBlue",
        function: "System monitoring and control",
        assemblyOrder: 8,
        connections: ["Main Chassis"],
        failureEffect: "Loss of precision control.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 1, z: 2.1 },
        explodedPosition: { x: 0, y: 1, z: 8 }
    });

    const description = "The Bio-Mycelium Brick Press is a next-generation manufacturing unit that combines heavy industrial hydraulics with advanced biotechnology. It compresses agricultural waste into forms while simultaneously injecting specialized, rapid-growing mycelium (fungal threads). The mycelium acts as a biological binder, digesting the waste and knitting it into a solid, fire-resistant, and highly insulating brick. This machine represents the forefront of sustainable construction material production.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Mycelial Spore Injector Ring?",
            options: [
                "To add color to the bricks.",
                "To deliver biological binding agents into the compressed substrate.",
                "To heat the substrate to melting point.",
                "To cut the bricks to size."
            ],
            correct: 1,
            explanation: "The injector ring distributes mycelium spores, which grow and act as a biological glue, binding the agricultural waste together.",
            difficulty: "Medium"
        },
        {
            question: "Why is heavy hydraulic compaction necessary before mycelial growth?",
            options: [
                "To kill any bacteria in the waste.",
                "To squeeze the water out.",
                "To create a dense initial form for the mycelium to bind, ensuring structural strength.",
                "To make the bricks shiny."
            ],
            correct: 2,
            explanation: "Compaction creates a dense, shaped substrate. The mycelium then binds this dense material, resulting in a strong final product.",
            difficulty: "Hard"
        },
        {
            question: "What happens if the Nutrient Supply Lines fail?",
            options: [
                "The machine explodes.",
                "The bricks become too strong.",
                "Mycelium growth slows down, extending production times.",
                "The bricks turn into plastic."
            ],
            correct: 2,
            explanation: "The nutrient lines provide sugars and water necessary for rapid fungal growth; without them, the process stalls.",
            difficulty: "Medium"
        }
    ];

    const animate = (time, speed, meshes) => {
        // meshes[2] is Ram, meshes[3] is Press Head
        // Animate the press moving up and down
        const pressCycle = Math.sin(time * speed);
        
        // Ram moves down to compress, up to release
        const pressY = 2 + (pressCycle * -1.5); 
        if (meshes[2]) meshes[2].position.y = pressY;
        
        // Head moves with the ram
        const headY = 0.25 + (pressCycle * -1.5);
        if (meshes[3]) meshes[3].position.y = headY;

        // meshes[4] is Injector Ring
        if (meshes[4]) {
            // Pulse the emissive intensity of the mycelium ring when press is down
            if (pressCycle > 0.8) {
                meshes[4].material.emissiveIntensity = 2.0 + Math.sin(time * speed * 10) * 1.5;
                meshes[4].scale.setScalar(1 + Math.sin(time * speed * 10) * 0.05);
            } else {
                meshes[4].material.emissiveIntensity = 1.0;
                meshes[4].scale.setScalar(1);
            }
            meshes[4].rotation.z += 0.01 * speed; // Slowly rotate injector
        }

        // meshes[7] is Control Panel
        if (meshes[7]) {
             meshes[7].material.emissiveIntensity = 1.0 + Math.sin(time * speed * 5) * 0.5;
        }
    };

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createMyceliumPress() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
