import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom Materials
    const waterMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.6,
        transmission: 0.9,
        ior: 1.33,
        roughness: 0.1,
        metalness: 0.1,
        emissive: 0x0044ff,
        emissiveIntensity: 0.5
    });

    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 2.0,
        roughness: 0.2,
        metalness: 0.8
    });

    const glowingGreen = new THREE.MeshStandardMaterial({
        color: 0x33ff33,
        emissive: 0x33ff33,
        emissiveIntensity: 1.5,
        roughness: 0.4
    });

    // 1. Center Pivot Point (The base where water enters)
    const centerBaseGeo = new THREE.CylinderGeometry(2, 2.5, 4, 32);
    const centerBase = new THREE.Mesh(centerBaseGeo, darkSteel);
    centerBase.position.set(0, 2, 0);
    group.add(centerBase);
    meshes.centerBase = centerBase;
    parts.push({
        name: "Center Pivot Structure",
        description: "The anchor point of the entire system. It connects to the water supply and provides the central rotation axis.",
        material: "Dark Steel",
        function: "Water intake and structural anchor",
        assemblyOrder: 1,
        connections: ["Water Pipe", "Control Panel", "First Span"],
        failureEffect: "System cannot rotate or receive water.",
        cascadeFailures: ["Complete Irrigation Failure"],
        originalPosition: {x: 0, y: 2, z: 0},
        explodedPosition: {x: 0, y: 5, z: 0}
    });

    // Control Panel
    const panelGeo = new THREE.BoxGeometry(1.5, 2, 1);
    const controlPanel = new THREE.Mesh(panelGeo, chrome);
    controlPanel.position.set(2.5, 3, 0);
    centerBase.add(controlPanel);
    
    const screenGeo = new THREE.PlaneGeometry(1, 1.2);
    const screen = new THREE.Mesh(screenGeo, neonBlue);
    screen.position.set(0.76, 0.2, 0);
    screen.rotation.y = Math.PI / 2;
    controlPanel.add(screen);

    meshes.controlPanel = controlPanel;
    parts.push({
        name: "Main Control Panel",
        description: "Contains the PLCs (Programmable Logic Controllers) and telemetry systems to control speed, water pressure, and direction.",
        material: "Chrome / Neon Blue (Screen)",
        function: "System monitoring and control",
        assemblyOrder: 2,
        connections: ["Center Pivot Structure", "Power Grid"],
        failureEffect: "Loss of control; system stops or behaves erratically.",
        cascadeFailures: ["Uneven water distribution", "Motor burnout"],
        originalPosition: {x: 2.5, y: 3, z: 0},
        explodedPosition: {x: 10, y: 3, z: 0}
    });

    // The Span (Long pipe with sprinklers)
    const spanGroup = new THREE.Group();
    spanGroup.position.set(0, 4, 0);
    group.add(spanGroup);
    meshes.spanGroup = spanGroup;

    // Main Pipe
    const pipeLength = 80;
    const pipeGeo = new THREE.CylinderGeometry(0.4, 0.4, pipeLength, 16);
    const mainPipe = new THREE.Mesh(pipeGeo, aluminum);
    mainPipe.rotation.x = Math.PI / 2;
    mainPipe.position.set(0, 0, pipeLength / 2);
    spanGroup.add(mainPipe);
    meshes.mainPipe = mainPipe;

    parts.push({
        name: "Main Distribution Pipe",
        description: "Carries water from the center pivot outwards to the sprinklers along the spans.",
        material: "Aluminum",
        function: "Water transport",
        assemblyOrder: 3,
        connections: ["Center Pivot Structure", "Sprinklers", "A-Frame Towers"],
        failureEffect: "Massive water leak; pressure drop.",
        cascadeFailures: ["Crop loss", "Soil erosion"],
        originalPosition: {x: 0, y: 4, z: pipeLength / 2},
        explodedPosition: {x: 0, y: 15, z: pipeLength / 2}
    });

    // Drive Towers (A-Frames with wheels)
    const towerCount = 4;
    const towerSpacing = pipeLength / towerCount;

    meshes.wheels = [];
    meshes.sprinklers = [];
    meshes.waterSprays = [];

    for (let i = 1; i <= towerCount; i++) {
        const towerGroup = new THREE.Group();
        const zPos = i * towerSpacing - (towerSpacing / 2);
        towerGroup.position.set(0, -2, zPos);

        // A-Frame Legs
        const legGeo = new THREE.CylinderGeometry(0.1, 0.1, 4.5);
        const leg1 = new THREE.Mesh(legGeo, steel);
        leg1.rotation.z = Math.PI / 6;
        leg1.position.set(1.1, 0, 0);
        
        const leg2 = new THREE.Mesh(legGeo, steel);
        leg2.rotation.z = -Math.PI / 6;
        leg2.position.set(-1.1, 0, 0);
        
        towerGroup.add(leg1);
        towerGroup.add(leg2);

        // Base axle
        const axleGeo = new THREE.CylinderGeometry(0.15, 0.15, 3.5);
        const axle = new THREE.Mesh(axleGeo, darkSteel);
        axle.rotation.z = Math.PI / 2;
        axle.position.set(0, -2, 0);
        towerGroup.add(axle);

        // Wheels
        const wheelGeo = new THREE.TorusGeometry(0.8, 0.3, 16, 32);
        const wheel1 = new THREE.Mesh(wheelGeo, rubber);
        wheel1.rotation.y = Math.PI / 2;
        wheel1.position.set(1.8, -2, 0);
        
        const wheel2 = new THREE.Mesh(wheelGeo, rubber);
        wheel2.rotation.y = Math.PI / 2;
        wheel2.position.set(-1.8, -2, 0);

        // Neon Wheel Hubs
        const hubGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.4, 16);
        const hub1 = new THREE.Mesh(hubGeo, neonBlue);
        hub1.rotation.x = Math.PI / 2;
        wheel1.add(hub1);
        const hub2 = new THREE.Mesh(hubGeo, neonBlue);
        hub2.rotation.x = Math.PI / 2;
        wheel2.add(hub2);

        towerGroup.add(wheel1);
        towerGroup.add(wheel2);
        meshes.wheels.push({ w1: wheel1, w2: wheel2, radius: zPos });

        spanGroup.add(towerGroup);

        parts.push({
            name: `Drive Tower ${i}`,
            description: `A motorized A-frame structure that supports the pipe and moves the system in a circle. It houses the electric drive motor for the wheels.`,
            material: "Steel / Rubber / Neon",
            function: "Structural support and locomotion",
            assemblyOrder: 3 + i,
            connections: ["Main Distribution Pipe", `Wheels ${i}`],
            failureEffect: "Tower gets stuck, causing the pipe to bend or break.",
            cascadeFailures: ["Structural collapse of spans"],
            originalPosition: {x: 0, y: 2, z: zPos},
            explodedPosition: {x: -15, y: 2, z: zPos}
        });
    }

    // Sprinklers and Water spray
    const sprinklerCount = 20;
    const sprinklerSpacing = pipeLength / sprinklerCount;

    for (let i = 1; i < sprinklerCount; i++) {
        const zPos = i * sprinklerSpacing;
        
        // Drop pipe
        const dropGeo = new THREE.CylinderGeometry(0.05, 0.05, 2);
        const drop = new THREE.Mesh(dropGeo, plastic);
        drop.position.set(0, -1, zPos);
        spanGroup.add(drop);

        // Sprinkler Head
        const headGeo = new THREE.SphereGeometry(0.2, 16, 16);
        const head = new THREE.Mesh(headGeo, chrome);
        head.position.set(0, -2, zPos);
        spanGroup.add(head);

        // Water Spray (Cone)
        const sprayGeo = new THREE.ConeGeometry(2, 4, 16);
        const spray = new THREE.Mesh(sprayGeo, waterMaterial);
        spray.position.set(0, -4, zPos);
        spanGroup.add(spray);
        meshes.waterSprays.push(spray);

        meshes.sprinklers.push(head);
    }

    parts.push({
        name: "Drop Pipes & Sprinkler Heads",
        description: "Low-pressure sprinkler heads hanging close to the crop canopy to minimize evaporation and wind drift.",
        material: "Plastic / Chrome / Water",
        function: "Water distribution",
        assemblyOrder: 10,
        connections: ["Main Distribution Pipe"],
        failureEffect: "Dry spots in the field or excessive localized flooding.",
        cascadeFailures: ["Yield loss in affected area"],
        originalPosition: {x: 0, y: 2, z: pipeLength / 2},
        explodedPosition: {x: 10, y: -5, z: pipeLength / 2}
    });

    const description = "The Agricultural Center Pivot Irrigation System is a marvel of modern farming. It consists of a central pivot point and a long lateral pipe supported by motorized towers. As it slowly rotates, drop sprinklers deliver precise amounts of water to circular crop fields. This model features neon drive hubs and transparent water cones to illustrate the flow and mechanical action.";

    const quizQuestions = [
        {
            question: "What is the primary advantage of using drop pipes to lower the sprinkler heads close to the crops?",
            options: [
                "It makes the system spin faster.",
                "It reduces water loss due to wind drift and evaporation.",
                "It increases the water pressure in the main pipe.",
                "It prevents the towers from getting stuck in mud."
            ],
            correct: 1,
            explanation: "Bringing sprinklers closer to the crop canopy minimizes the time water is in the air, drastically reducing evaporation and wind drift, thereby increasing efficiency.",
            difficulty: "Medium"
        },
        {
            question: "Why must the outermost drive tower move faster than the innermost tower?",
            options: [
                "Because it has larger wheels.",
                "To maintain water pressure at the end of the line.",
                "Because it has to cover a larger circumference in the same amount of time to keep the pipe straight.",
                "It doesn't; all towers move at the same speed."
            ],
            correct: 2,
            explanation: "In a rotating radial system, points further from the center travel a larger distance per revolution. To keep the pipe in a straight line, outer towers must move faster.",
            difficulty: "Hard"
        },
        {
            question: "What is the function of the main control panel at the center pivot?",
            options: [
                "To store excess water.",
                "To house the programmable logic controllers (PLCs) that dictate speed, direction, and water application rates.",
                "To generate electricity for the system.",
                "To filter debris out of the water."
            ],
            correct: 1,
            explanation: "The control panel is the 'brain' of the system, using PLCs and telemetry to control operational parameters like rotation speed and pump pressure.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshes) {
        // Rotate the entire span around the center pivot
        // The time multiplier controls the rotation speed
        const rotationSpeed = time * speed * 0.1;
        meshes.spanGroup.rotation.y = rotationSpeed;

        // Animate the wheels based on their distance from the center (radius)
        // Velocity = angular_velocity * radius. 
        meshes.wheels.forEach(wheelPair => {
            const wheelSpeed = rotationSpeed * wheelPair.radius * 0.5;
            wheelPair.w1.rotation.x = -wheelSpeed;
            wheelPair.w2.rotation.x = -wheelSpeed;
        });

        // Pulsate water spray opacity to simulate water pulsing
        const pulse = (Math.sin(time * speed * 5) + 1) / 2; // 0 to 1
        meshes.waterSprays.forEach(spray => {
            spray.material.opacity = 0.3 + (pulse * 0.4);
            spray.scale.set(1 + pulse * 0.1, 1 + pulse * 0.2, 1 + pulse * 0.1);
        });

        // Blink neon control panel
        if (meshes.controlPanel) {
            const screen = meshes.controlPanel.children[0];
            if (screen) {
                 screen.material.emissiveIntensity = 1.0 + Math.random() * 1.5;
            }
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createCenterPivotIrrigationSystem() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
