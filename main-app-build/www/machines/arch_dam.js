import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom high-tech glowing/neon materials
    const glowingWaterMat = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x0088ff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8,
        roughness: 0.1,
        metalness: 0.1,
        clearcoat: 1.0,
    });
    
    const glowingNeonMat = new THREE.MeshStandardMaterial({
        color: 0x00ffcc,
        emissive: 0x00ffcc,
        emissiveIntensity: 2.0,
        wireframe: true
    });

    const holographicMat = new THREE.MeshBasicMaterial({
        color: 0x00aaff,
        transparent: true,
        opacity: 0.3,
        wireframe: true,
        side: THREE.DoubleSide
    });

    // 1. Dam Wall (Arch shape)
    // A curved concrete-steel structure
    const wallGeo = new THREE.CylinderGeometry(50, 45, 60, 32, 4, false, Math.PI * 1.25, Math.PI * 0.5);
    const wall = new THREE.Mesh(wallGeo, steel);
    wall.position.set(0, 30, 0);
    group.add(wall);
    parts.push({
        name: "Main Arch Wall",
        description: "Curved concrete-steel composite structure that distributes hydrostatic pressure to the canyon walls.",
        material: "Steel/Concrete",
        function: "Withstands immense water pressure and creates the reservoir.",
        assemblyOrder: 1,
        connections: ["Bedrock", "Spillway", "Penstocks"],
        failureEffect: "Catastrophic failure leading to massive downstream flooding.",
        cascadeFailures: ["Complete plant destruction", "Reservoir drainage"],
        originalPosition: { x: 0, y: 30, z: 0 },
        explodedPosition: { x: 0, y: 50, z: -30 }
    });

    // Hydrostatic pressure map overlay (Holographic representation)
    const pressureGeo = new THREE.CylinderGeometry(49.8, 44.8, 59.8, 32, 4, false, Math.PI * 1.25, Math.PI * 0.5);
    const pressureMesh = new THREE.Mesh(pressureGeo, holographicMat);
    pressureMesh.position.set(0, 30, 0);
    group.add(pressureMesh);

    // 2. Penstocks
    const penstockGeo = new THREE.CylinderGeometry(2, 2, 40, 16);
    const penstock1 = new THREE.Mesh(penstockGeo, darkSteel);
    penstock1.rotation.x = Math.PI / 4;
    penstock1.position.set(-15, 15, 10);
    group.add(penstock1);
    
    const penstock2 = new THREE.Mesh(penstockGeo, darkSteel);
    penstock2.rotation.x = Math.PI / 4;
    penstock2.position.set(15, 15, 10);
    group.add(penstock2);
    
    parts.push({
        name: "Penstocks",
        description: "High-pressure conduits directing water from the reservoir to the turbines.",
        material: "Dark Steel",
        function: "Accelerate water to high velocities to maximize kinetic energy before it hits the turbine blades.",
        assemblyOrder: 2,
        connections: ["Main Arch Wall", "Turbines"],
        failureEffect: "Loss of water pressure to turbines.",
        cascadeFailures: ["Turbine shutdown", "Localized structural damage due to water jet erosion"],
        originalPosition: { x: 0, y: 15, z: 10 },
        explodedPosition: { x: 0, y: 15, z: 40 }
    });

    // 3. Turbines
    const turbineGeo = new THREE.TorusKnotGeometry(3, 1, 64, 8);
    const turbine1 = new THREE.Mesh(turbineGeo, chrome);
    turbine1.position.set(-15, -5, 25);
    turbine1.rotation.x = Math.PI / 2;
    group.add(turbine1);
    
    const turbine2 = new THREE.Mesh(turbineGeo, chrome);
    turbine2.position.set(15, -5, 25);
    turbine2.rotation.x = Math.PI / 2;
    group.add(turbine2);
    
    parts.push({
        name: "Francis Turbines",
        description: "High-efficiency reaction turbines designed for medium to high head dams.",
        material: "Chrome Alloy",
        function: "Converts kinetic and potential energy of water into rotational mechanical energy.",
        assemblyOrder: 3,
        connections: ["Penstocks", "Generators"],
        failureEffect: "Loss of mechanical energy generation.",
        cascadeFailures: ["Generator shutdown", "Power grid frequency drop"],
        originalPosition: { x: 0, y: -5, z: 25 },
        explodedPosition: { x: 0, y: -20, z: 25 }
    });

    // 4. Generators
    const genGeo = new THREE.CylinderGeometry(4, 4, 8, 32);
    const gen1 = new THREE.Mesh(genGeo, copper);
    gen1.position.set(-15, 3, 25);
    group.add(gen1);
    
    const gen2 = new THREE.Mesh(genGeo, copper);
    gen2.position.set(15, 3, 25);
    group.add(gen2);
    
    parts.push({
        name: "Synchronous Generators",
        description: "Electromagnetic devices with copper stators and rotors.",
        material: "Copper/Steel",
        function: "Converts mechanical rotation from the turbines into electrical energy.",
        assemblyOrder: 4,
        connections: ["Turbines", "Transformers"],
        failureEffect: "Complete loss of electrical output.",
        cascadeFailures: ["Grid blackout", "Turbine overspeed if load is rejected improperly"],
        originalPosition: { x: 0, y: 3, z: 25 },
        explodedPosition: { x: 0, y: 30, z: 25 }
    });

    // 5. Flowing Water (Glowing visual flair inside penstocks)
    const waterGeo = new THREE.CylinderGeometry(1.8, 1.8, 40, 16);
    const waterFlow1 = new THREE.Mesh(waterGeo, glowingWaterMat);
    waterFlow1.rotation.x = Math.PI / 4;
    waterFlow1.position.set(-15, 15, 10);
    group.add(waterFlow1);
    
    const waterFlow2 = new THREE.Mesh(waterGeo, glowingWaterMat);
    waterFlow2.rotation.x = Math.PI / 4;
    waterFlow2.position.set(15, 15, 10);
    group.add(waterFlow2);

    // 6. Energy output effects
    const energyGeo = new THREE.TorusGeometry(5, 0.2, 16, 64);
    const energyRing1 = new THREE.Mesh(energyGeo, glowingNeonMat);
    energyRing1.position.set(-15, 8, 25);
    energyRing1.rotation.x = Math.PI / 2;
    group.add(energyRing1);
    
    const energyRing2 = new THREE.Mesh(energyGeo, glowingNeonMat);
    energyRing2.position.set(15, 8, 25);
    energyRing2.rotation.x = Math.PI / 2;
    group.add(energyRing2);

    const description = "An Arch Dam is a massive concrete structure that curves upstream, relying on its arch shape to direct hydrostatic water pressure into the canyon walls. It houses a complex high-tech hydroelectric generation system.";
    
    const quizQuestions = [
        {
            question: "Why does an arch dam curve upstream?",
            options: [
                "For purely aesthetic purposes",
                "To compress the concrete and transfer water pressure into the canyon walls",
                "To increase the total volume of the reservoir",
                "To reduce the amount of concrete needed by 90%"
            ],
            correct: 1,
            explanation: "The curve of the arch directs the hydrostatic pressure of the water outward into the rock walls of the canyon, utilizing the high compressive strength of concrete.",
            difficulty: "Medium"
        },
        {
            question: "What is the primary function of a penstock in a hydroelectric facility?",
            options: [
                "To safely release excess water during floods",
                "To generate electricity directly from water pressure",
                "To carry pressurized water from the reservoir down to the turbines",
                "To filter out sediment and debris before it reaches the dam"
            ],
            correct: 2,
            explanation: "Penstocks are large, strong pipes or tunnels that carry high-pressure water from the reservoir directly to the turbines, maximizing kinetic energy.",
            difficulty: "Easy"
        },
        {
            question: "What cascade failure is most likely if a turbine suddenly drops its electrical load but water flow remains constant?",
            options: [
                "The reservoir will overflow immediately",
                "The main dam wall will crack under pressure",
                "The turbine will suffer from rapid overspeed and potentially destroy itself mechanically",
                "The penstock will implode due to cavitation"
            ],
            correct: 2,
            explanation: "Without an electrical load to provide electromagnetic resistance, the mechanical energy from the water can cause the turbine to spin out of control (overspeed), leading to severe mechanical and structural damage.",
            difficulty: "Hard"
        }
    ];

    const animate = (time, speed, meshes) => {
        // Rotate turbines to simulate energy generation
        turbine1.rotation.z -= 0.1 * speed;
        turbine2.rotation.z -= 0.1 * speed;
        
        // Pulse holographic pressure map and water flow intensity
        const pulse = Math.sin(time * 5 * speed) * 0.2 + 0.8;
        glowingWaterMat.emissiveIntensity = pulse;
        holographicMat.opacity = 0.2 + Math.sin(time * 2 * speed) * 0.1;
        
        // Energy rings floating and spinning above the generators
        energyRing1.position.y = 8 + Math.sin(time * 3 * speed) * 2;
        energyRing1.rotation.z += 0.05 * speed;
        energyRing1.scale.setScalar(1 + Math.sin(time * 10 * speed) * 0.1);
        
        energyRing2.position.y = 8 + Math.cos(time * 3 * speed) * 2;
        energyRing2.rotation.z -= 0.05 * speed;
        energyRing2.scale.setScalar(1 + Math.cos(time * 10 * speed) * 0.1);
    };

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createArchDam() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
