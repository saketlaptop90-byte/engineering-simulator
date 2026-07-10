import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom Materials
    const sludgeMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x3d2817,
        metalness: 0.1,
        roughness: 0.9,
        transmission: 0.2,
        opacity: 0.9,
        transparent: true
    });

    const biogasGlowMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ff88,
        emissive: 0x00ff88,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8
    });

    const neonAccentMaterial = new THREE.MeshStandardMaterial({
        color: 0x00bfff,
        emissive: 0x00bfff,
        emissiveIntensity: 2.0
    });

    const structuralConcrete = new THREE.MeshStandardMaterial({
        color: 0x888888,
        roughness: 0.8,
        metalness: 0.2
    });

    // 1. Digester Base Tank
    const baseGeo = new THREE.CylinderGeometry(5, 5, 6, 32);
    const baseMesh = new THREE.Mesh(baseGeo, structuralConcrete);
    baseMesh.position.set(0, 3, 0);
    group.add(baseMesh);
    meshes.base = baseMesh;
    parts.push({
        name: "Digester Base Tank",
        description: "Primary holding chamber for organic waste undergoing anaerobic digestion.",
        material: "structuralConcrete",
        function: "Maintains optimal temperature and anaerobic conditions for methanogenic bacteria.",
        assemblyOrder: 1,
        connections: ["Feed Inlet", "Biomass Sludge", "Heating Coils"],
        failureEffect: "Loss of anaerobic environment, stopping methane production.",
        cascadeFailures: ["Bacterial Die-off", "Biogas Depletion"],
        originalPosition: {x: 0, y: 3, z: 0},
        explodedPosition: {x: 0, y: -5, z: 0}
    });

    // 2. Dome / Gas Holder
    const domeGeo = new THREE.SphereGeometry(5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    // Make it look like a cross section or transparent dome
    const domeMesh = new THREE.Mesh(domeGeo, tinted);
    domeMesh.position.set(0, 6, 0);
    group.add(domeMesh);
    meshes.dome = domeMesh;
    parts.push({
        name: "Gas Collection Dome",
        description: "Expandable or fixed dome where produced biogas is collected and pressurized.",
        material: "tinted glass / steel framework",
        function: "Captures and stores CH4 and CO2 before it is routed to the purification system.",
        assemblyOrder: 2,
        connections: ["Digester Base Tank", "Gas Outlet Pipe"],
        failureEffect: "Gas leakage and depressurization of the system.",
        cascadeFailures: ["Environmental Hazard", "Generator Fuel Starvation"],
        originalPosition: {x: 0, y: 6, z: 0},
        explodedPosition: {x: 0, y: 15, z: 0}
    });

    // 3. Biomass Sludge (Inside Tank)
    const sludgeGeo = new THREE.CylinderGeometry(4.8, 4.8, 4, 32);
    const sludgeMesh = new THREE.Mesh(sludgeGeo, sludgeMaterial);
    sludgeMesh.position.set(0, 2.5, 0);
    group.add(sludgeMesh);
    meshes.sludge = sludgeMesh;
    parts.push({
        name: "Biomass Sludge",
        description: "The active slurry of organic matter and anaerobic bacteria.",
        material: "sludgeMaterial",
        function: "Serves as the substrate for methanogenesis.",
        assemblyOrder: 3,
        connections: ["Digester Base Tank", "Agitator"],
        failureEffect: "Acidification and toxicity killing bacteria.",
        cascadeFailures: ["Total System Halt"],
        originalPosition: {x: 0, y: 2.5, z: 0},
        explodedPosition: {x: 0, y: 2.5, z: 10}
    });

    // 4. Central Agitator
    const agitatorShaftGeo = new THREE.CylinderGeometry(0.2, 0.2, 8, 16);
    const agitatorShaftMesh = new THREE.Mesh(agitatorShaftGeo, chrome);
    agitatorShaftMesh.position.set(0, 4, 0);
    
    const bladeGeo = new THREE.BoxGeometry(3, 0.2, 0.5);
    const blade1 = new THREE.Mesh(bladeGeo, darkSteel);
    blade1.position.set(0, -2, 0);
    const blade2 = new THREE.Mesh(bladeGeo, darkSteel);
    blade2.position.set(0, 0, 0);
    blade2.rotation.y = Math.PI / 2;
    
    agitatorShaftMesh.add(blade1);
    agitatorShaftMesh.add(blade2);
    group.add(agitatorShaftMesh);
    meshes.agitator = agitatorShaftMesh;
    
    parts.push({
        name: "Central Agitator",
        description: "Mechanical stirring mechanism inside the digester.",
        material: "chrome / darkSteel",
        function: "Prevents scum formation and maintains uniform temperature and bacterial distribution.",
        assemblyOrder: 4,
        connections: ["Agitator Motor", "Biomass Sludge"],
        failureEffect: "Stratification of sludge and dead zones.",
        cascadeFailures: ["Reduced Biogas Yield", "Crust Formation"],
        originalPosition: {x: 0, y: 4, z: 0},
        explodedPosition: {x: 0, y: 4, z: -10}
    });

    // 5. Agitator Motor
    const motorGeo = new THREE.CylinderGeometry(0.8, 0.8, 1.5, 16);
    const motorMesh = new THREE.Mesh(motorGeo, aluminum);
    motorMesh.position.set(0, 8.5, 0);
    group.add(motorMesh);
    meshes.motor = motorMesh;
    parts.push({
        name: "Agitator Motor",
        description: "Electric drive motor for the central agitator.",
        material: "aluminum",
        function: "Provides torque to rotate the agitator blades.",
        assemblyOrder: 5,
        connections: ["Central Agitator"],
        failureEffect: "Agitator stops rotating.",
        cascadeFailures: ["Central Agitator Failure"],
        originalPosition: {x: 0, y: 8.5, z: 0},
        explodedPosition: {x: 0, y: 20, z: 0}
    });

    // 6. Heating Coils
    const coilCurve = new THREE.CatmullRomCurve3(
        Array.from({ length: 50 }, (_, i) => {
            const angle = i * 0.5;
            const y = (i / 50) * 4;
            return new THREE.Vector3(Math.cos(angle) * 4.5, y, Math.sin(angle) * 4.5);
        })
    );
    const coilGeo = new THREE.TubeGeometry(coilCurve, 100, 0.1, 8, false);
    const coilMesh = new THREE.Mesh(coilGeo, copper);
    coilMesh.position.set(0, 0.5, 0);
    group.add(coilMesh);
    meshes.coils = coilMesh;
    parts.push({
        name: "Heating Coils",
        description: "Heat exchange tubing circulating hot water.",
        material: "copper",
        function: "Maintains mesophilic (35°C) or thermophilic (55°C) conditions for bacteria.",
        assemblyOrder: 6,
        connections: ["Digester Base Tank", "Heat Exchanger"],
        failureEffect: "Temperature drop, halting bacterial metabolism.",
        cascadeFailures: ["Biogas Production Stop"],
        originalPosition: {x: 0, y: 0.5, z: 0},
        explodedPosition: {x: 10, y: 0.5, z: 0}
    });

    // 7. Feed Inlet Pipe
    const inletGeo = new THREE.CylinderGeometry(0.5, 0.5, 6, 16);
    const inletMesh = new THREE.Mesh(inletGeo, plastic);
    inletMesh.rotation.z = Math.PI / 4;
    inletMesh.position.set(-5, 4, 0);
    group.add(inletMesh);
    meshes.inlet = inletMesh;
    parts.push({
        name: "Feed Inlet Pipe",
        description: "Input channel for raw organic waste.",
        material: "plastic",
        function: "Delivers feedstock into the base of the digester without introducing oxygen.",
        assemblyOrder: 7,
        connections: ["Digester Base Tank"],
        failureEffect: "Blockage preventing new feedstock entry.",
        cascadeFailures: ["System Starvation"],
        originalPosition: {x: -5, y: 4, z: 0},
        explodedPosition: {x: -12, y: 8, z: 0}
    });

    // 8. Gas Outlet Pipe with Neon Ring
    const outletGeo = new THREE.CylinderGeometry(0.3, 0.3, 4, 16);
    const outletMesh = new THREE.Mesh(outletGeo, steel);
    outletMesh.position.set(2, 8, 0);
    outletMesh.rotation.z = -Math.PI / 4;
    group.add(outletMesh);
    
    const neonRingGeo = new THREE.TorusGeometry(0.4, 0.05, 16, 32);
    const neonRing = new THREE.Mesh(neonRingGeo, neonAccentMaterial);
    neonRing.position.set(0, 1, 0);
    neonRing.rotation.x = Math.PI / 2;
    outletMesh.add(neonRing);
    
    meshes.outlet = outletMesh;
    parts.push({
        name: "Gas Outlet Pipe",
        description: "High-pressure output valve for extracted biogas.",
        material: "steel / neon ring",
        function: "Transfers raw biogas from the dome to the scrubber system.",
        assemblyOrder: 8,
        connections: ["Gas Collection Dome"],
        failureEffect: "Pipe rupture or valve jam.",
        cascadeFailures: ["Overpressure in Dome"],
        originalPosition: {x: 2, y: 8, z: 0},
        explodedPosition: {x: 8, y: 14, z: 0}
    });

    // 9. Glowing Biogas Bubbles
    const bubbleGeo = new THREE.SphereGeometry(0.15, 8, 8);
    const bubbles = new THREE.Group();
    const bubbleData = [];
    for (let i = 0; i < 20; i++) {
        const bubble = new THREE.Mesh(bubbleGeo, biogasGlowMaterial);
        const x = (Math.random() - 0.5) * 8;
        const z = (Math.random() - 0.5) * 8;
        const y = Math.random() * 4 + 1;
        bubble.position.set(x, y, z);
        bubbles.add(bubble);
        bubbleData.push({ mesh: bubble, speed: Math.random() * 0.05 + 0.02, x: x, z: z });
    }
    group.add(bubbles);
    meshes.bubbleData = bubbleData;
    parts.push({
        name: "Biogas Bubbles",
        description: "Visible representation of methane and CO2 being produced.",
        material: "glowing neon",
        function: "Visualizes the active methanogenesis process.",
        assemblyOrder: 9,
        connections: ["Biomass Sludge"],
        failureEffect: "No bubbles indicate process death.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 3, z: 0},
        explodedPosition: {x: 0, y: 3, z: 0}
    });

    const description = "The Anaerobic Biomass Reactor (Methane Digester) breaks down organic waste in the absence of oxygen to produce biogas (primarily methane). It features a reinforced concrete base tank, a pressurized gas collection dome, central agitation, and heating coils to maintain optimal bacterial conditions.";

    const quizQuestions = [
        {
            question: "Why is the Digester Base Tank kept completely sealed from the outside environment?",
            options: [
                "To prevent the sludge from evaporating.",
                "Methanogenic bacteria are strict anaerobes and oxygen is toxic to them.",
                "To keep the agitator motor cool.",
                "To prevent the heating coils from rusting."
            ],
            correct: 1,
            explanation: "Anaerobic digestion relies on bacteria that only thrive in the absence of oxygen. Exposure to oxygen halts methane production.",
            difficulty: "Medium"
        },
        {
            question: "What is the primary function of the Heating Coils?",
            options: [
                "To boil the biomass.",
                "To ignite the biogas in the dome.",
                "To maintain mesophilic (35°C) or thermophilic (55°C) conditions for optimal bacterial metabolism.",
                "To melt plastics in the waste feed."
            ],
            correct: 2,
            explanation: "Bacteria require specific temperature ranges to efficiently break down organic matter and produce biogas.",
            difficulty: "Easy"
        },
        {
            question: "What happens if the Central Agitator fails?",
            options: [
                "Biogas production increases significantly.",
                "The system switches to aerobic digestion.",
                "A crust forms on the surface and dead zones develop, reducing biogas yield.",
                "The dome explodes."
            ],
            correct: 2,
            explanation: "Agitation is necessary to prevent stratification, ensure uniform temperature distribution, and release trapped gas bubbles.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, explodedRatio) {
        // Rotate Agitator
        if (meshes.agitator) {
            meshes.agitator.rotation.y = time * speed * 2;
        }
        
        // Animate Bubbles
        if (meshes.bubbleData) {
            meshes.bubbleData.forEach(data => {
                data.mesh.position.y += data.speed * speed * 50;
                // Wobble
                data.mesh.position.x = data.x + Math.sin(time * 5 + data.mesh.position.y) * 0.2;
                data.mesh.position.z = data.z + Math.cos(time * 4 + data.mesh.position.x) * 0.2;
                if (data.mesh.position.y > 6.5) {
                    data.mesh.position.y = 1.0;
                }
            });
        }
        
        // Pulse neon ring
        if (meshes.outlet) {
            const ring = meshes.outlet.children[0];
            if (ring) {
                const intensity = 1.5 + Math.sin(time * 3) * 0.5;
                ring.material.emissiveIntensity = intensity;
            }
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createBioMethaneDigester() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
