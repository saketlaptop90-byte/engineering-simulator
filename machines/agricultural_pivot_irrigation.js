import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom high-tech materials
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        roughness: 0.2,
        metalness: 0.8
    });
    
    const neonGreen = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00aa00,
        emissiveIntensity: 0.6,
        roughness: 0.3,
        metalness: 0.5
    });
    
    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 0.9,
        roughness: 0.1,
        metalness: 0.9
    });

    const meshes = {};

    // Base pivot mechanism
    const baseGeometry = new THREE.CylinderGeometry(2, 2.5, 3, 32);
    const base = new THREE.Mesh(baseGeometry, darkSteel);
    base.position.set(0, 1.5, 0);
    group.add(base);
    meshes.base = base;

    parts.push({
        name: "Central Pivot Base",
        description: "Anchors the entire system and supplies water from the source.",
        material: "Dark Steel",
        function: "Main support and water inlet",
        assemblyOrder: 1,
        connections: ["Main Supply Pipe", "Control Panel"],
        failureEffect: "Complete system collapse and loss of water supply",
        cascadeFailures: ["Water Pump", "Drive Motors"],
        originalPosition: { x: 0, y: 1.5, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 }
    });

    // Control Panel
    const panelGeometry = new THREE.BoxGeometry(1.5, 2, 1);
    const panel = new THREE.Mesh(panelGeometry, aluminum);
    panel.position.set(1.5, 2.5, 0);
    base.add(panel);
    meshes.panel = panel;

    const screenGeometry = new THREE.PlaneGeometry(1.2, 1);
    const screen = new THREE.Mesh(screenGeometry, neonBlue);
    screen.position.set(0.76, 0.2, 0);
    screen.rotation.y = Math.PI / 2;
    panel.add(screen);
    meshes.screen = screen;

    parts.push({
        name: "High-Tech Control Unit",
        description: "AI-driven control interface with holographic display.",
        material: "Aluminum & Neon Glass",
        function: "System monitoring and automated scheduling",
        assemblyOrder: 2,
        connections: ["Central Pivot Base"],
        failureEffect: "Loss of system control and automation",
        cascadeFailures: ["Water Pressure Sensors"],
        originalPosition: { x: 1.5, y: 2.5, z: 0 },
        explodedPosition: { x: 5, y: 2.5, z: 5 }
    });

    // Main Pipe & Trusses
    const pipeGeometry = new THREE.CylinderGeometry(0.3, 0.3, 30, 16);
    const mainPipe = new THREE.Mesh(pipeGeometry, chrome);
    mainPipe.rotation.z = Math.PI / 2;
    mainPipe.position.set(15, 6, 0);
    group.add(mainPipe);
    meshes.mainPipe = mainPipe;

    parts.push({
        name: "Main Water Distribution Pipe",
        description: "Pressurized chrome pipe delivering water to sprinklers.",
        material: "Chrome",
        function: "Water transport",
        assemblyOrder: 3,
        connections: ["Central Pivot Base", "Truss Support", "Sprinkler Heads"],
        failureEffect: "Massive water leak and loss of crop irrigation",
        cascadeFailures: ["Sprinklers", "Booster Pumps"],
        originalPosition: { x: 15, y: 6, z: 0 },
        explodedPosition: { x: 15, y: 12, z: 0 }
    });

    // Sprinklers
    const sprinklerArray = [];
    for(let i=0; i<5; i++) {
        const sGeometry = new THREE.CylinderGeometry(0.1, 0.2, 1.5, 8);
        const sprinkler = new THREE.Mesh(sGeometry, steel);
        const xPos = 5 + i*5;
        sprinkler.position.set(xPos, 5, 0);
        group.add(sprinkler);
        sprinklerArray.push(sprinkler);

        // Water effect placeholder
        const waterGeo = new THREE.SphereGeometry(0.3, 8, 8);
        const water = new THREE.Mesh(waterGeo, neonBlue);
        water.position.set(0, -0.8, 0);
        sprinkler.add(water);
    }
    meshes.sprinklers = sprinklerArray;

    parts.push({
        name: "Precision Sprinkler Heads",
        description: "Variable-rate water emitters with smart pressure adjustment.",
        material: "Steel",
        function: "Irrigate crops evenly",
        assemblyOrder: 4,
        connections: ["Main Water Distribution Pipe"],
        failureEffect: "Uneven watering leading to crop damage",
        cascadeFailures: ["Soil Moisture Sensors"],
        originalPosition: { x: 15, y: 5, z: 0 },
        explodedPosition: { x: 15, y: -2, z: 0 }
    });

    // Drive Towers
    const towerGeometry = new THREE.CylinderGeometry(0.2, 0.2, 5, 8);
    const leftLeg = new THREE.Mesh(towerGeometry, darkSteel);
    leftLeg.position.set(28, 2.5, 1.5);
    leftLeg.rotation.x = -Math.PI / 8;
    group.add(leftLeg);
    
    const rightLeg = new THREE.Mesh(towerGeometry, darkSteel);
    rightLeg.position.set(28, 2.5, -1.5);
    rightLeg.rotation.x = Math.PI / 8;
    group.add(rightLeg);

    const wheelGeo = new THREE.TorusGeometry(1, 0.4, 16, 32);
    const wheel1 = new THREE.Mesh(wheelGeo, rubber);
    wheel1.position.set(28, 1, 2.5);
    wheel1.rotation.y = Math.PI / 2;
    group.add(wheel1);
    
    const wheel2 = new THREE.Mesh(wheelGeo, rubber);
    wheel2.position.set(28, 1, -2.5);
    wheel2.rotation.y = Math.PI / 2;
    group.add(wheel2);
    
    const axleGeo = new THREE.CylinderGeometry(0.2, 0.2, 6, 8);
    const axle = new THREE.Mesh(axleGeo, steel);
    axle.position.set(28, 1, 0);
    axle.rotation.x = Math.PI / 2;
    group.add(axle);
    
    // Motor
    const motorGeo = new THREE.BoxGeometry(1, 1, 1);
    const motor = new THREE.Mesh(motorGeo, neonRed);
    motor.position.set(28, 1.5, 0);
    group.add(motor);

    meshes.wheels = [wheel1, wheel2];
    meshes.tower = group; // to rotate entire assembly around base

    parts.push({
        name: "Drive Tower & Motor Unit",
        description: "Propels the massive structure in a circular motion.",
        material: "Steel, Rubber, and Neon Emitters",
        function: "Mobility",
        assemblyOrder: 5,
        connections: ["Main Water Distribution Pipe", "Wheels"],
        failureEffect: "Machine gets stuck, flooding one area.",
        cascadeFailures: ["Gearbox", "Drive Shaft"],
        originalPosition: { x: 28, y: 2.5, z: 0 },
        explodedPosition: { x: 40, y: 2.5, z: 10 }
    });

    const description = "The Agricultural Pivot Irrigation Tower is a highly advanced automated farming system. It uses a central pivot point to rotate a massive water distribution pipe equipped with precision sprinklers, ensuring optimal crop hydration.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Drive Tower?",
            options: [
                "To pump water from the ground",
                "To propel the system in a circular path",
                "To filter impurities from the water",
                "To measure soil moisture levels"
            ],
            correct: 1,
            explanation: "The Drive Tower contains motors and wheels that move the entire irrigation structure around the central pivot.",
            difficulty: "Easy"
        },
        {
            question: "What consequence does a sprinkler head failure have?",
            options: [
                "The entire system stops moving",
                "Uneven watering and potential crop damage",
                "The central pivot disconnects",
                "Increased water pressure at the source"
            ],
            correct: 1,
            explanation: "Failed sprinklers cause uneven water distribution, leading to overwatered or dry patches in the crops.",
            difficulty: "Medium"
        },
        {
            question: "Why is an AI-driven Control Unit critical for this modern system?",
            options: [
                "It physically moves the water.",
                "It generates power for the motors.",
                "It enables automated scheduling and precise water management.",
                "It replaces the need for a water source."
            ],
            correct: 2,
            explanation: "The AI Control Unit processes sensor data to optimize watering schedules, saving resources.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshesObj) {
        if (!meshesObj) return;
        
        // Rotate the entire group around the origin (central pivot)
        if (meshesObj.tower) {
            meshesObj.tower.rotation.y = -(time * 0.1 * speed);
        }

        // Spin the wheels based on movement
        if (meshesObj.wheels) {
            meshesObj.wheels.forEach(wheel => {
                wheel.rotation.z = -(time * 1.5 * speed);
            });
        }
        
        // Pulsate screen
        if (meshesObj.screen) {
            meshesObj.screen.material.emissiveIntensity = 0.5 + Math.sin(time * 5) * 0.3;
        }
        
        // Water effect pulsing
        if (meshesObj.sprinklers) {
            meshesObj.sprinklers.forEach((sprinkler, i) => {
                const water = sprinkler.children[0];
                if (water) {
                    const scale = 1 + Math.sin(time * 10 + i) * 0.3;
                    water.scale.set(scale, scale, scale);
                }
            });
        }
    }

    return { group, parts, description, quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createPivotIrrigationSystem() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
