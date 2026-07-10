import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Custom materials
    const goldFoil = new THREE.MeshStandardMaterial({ color: 0xffcc00, metalness: 0.6, roughness: 0.4 });
    const thrusterGlow = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.8 });
    const whiteHull = new THREE.MeshStandardMaterial({ color: 0xeeeeee, metalness: 0.2, roughness: 0.8 });
    
    // 1. Descent Stage
    const descentGeometry = new THREE.CylinderGeometry(2, 2.2, 1.5, 8);
    const descentMesh = new THREE.Mesh(descentGeometry, goldFoil);
    descentMesh.position.set(0, 0, 0);
    group.add(descentMesh);
    parts.push({
        name: "Descent Stage",
        description: "The unmanned lower part of the lunar lander, containing the descent engine and propellant.",
        material: "Gold Foil / Aluminum",
        function: "Provides propulsion for lunar landing and serves as a launch platform for the ascent stage.",
        assemblyOrder: 1,
        connections: ["Landing Legs", "Ascent Stage", "Descent Engine"],
        failureEffect: "Inability to land softly or abort descent safely.",
        cascadeFailures: ["Ascent Stage Stranded", "Mission Failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 }
    });

    // 2. Ascent Stage
    const ascentGeometry = new THREE.CylinderGeometry(1.5, 1.5, 1.2, 16);
    const ascentMesh = new THREE.Mesh(ascentGeometry, whiteHull);
    ascentMesh.position.set(0, 1.35, 0);
    group.add(ascentMesh);
    parts.push({
        name: "Ascent Stage",
        description: "The crewed upper part of the lunar lander.",
        material: "Aluminum Alloy",
        function: "Houses the crew, controls, and ascent engine for returning to lunar orbit.",
        assemblyOrder: 2,
        connections: ["Descent Stage", "Antenna", "RCS Thrusters"],
        failureEffect: "Loss of life support or inability to return to orbit.",
        cascadeFailures: ["Crew Loss", "Complete Mission Loss"],
        originalPosition: { x: 0, y: 1.35, z: 0 },
        explodedPosition: { x: 0, y: 4, z: 0 }
    });

    // 3. Landing Legs
    for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2 + Math.PI / 4;
        const legGroup = new THREE.Group();
        
        const strutGeo = new THREE.CylinderGeometry(0.1, 0.1, 2.5);
        const strut = new THREE.Mesh(strutGeo, darkSteel);
        strut.rotation.x = Math.PI / 4;
        strut.position.set(0, -1, 1.5);
        
        const padGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.1, 16);
        const pad = new THREE.Mesh(padGeo, goldFoil);
        pad.position.set(0, -2, 2.2);
        
        legGroup.add(strut);
        legGroup.add(pad);
        legGroup.rotation.y = angle;
        group.add(legGroup);

        parts.push({
            name: `Landing Leg ${i+1}`,
            description: "Shock-absorbing leg with footpad for lunar surface touchdown.",
            material: "Aluminum / Honeycomb Crush Core",
            function: "Absorbs landing impact and stabilizes the module on uneven terrain.",
            assemblyOrder: 3 + i,
            connections: ["Descent Stage"],
            failureEffect: "Module tips over upon landing.",
            cascadeFailures: ["Ascent Engine Blocked", "Antenna Damaged"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: Math.sin(angle)*4, y: -2, z: Math.cos(angle)*4 }
        });
    }

    // 4. Descent Engine Nozzle
    const engineGeo = new THREE.CylinderGeometry(0.8, 0.2, 1, 16);
    const engineMesh = new THREE.Mesh(engineGeo, darkSteel);
    engineMesh.position.set(0, -1.25, 0);
    group.add(engineMesh);
    parts.push({
        name: "Descent Engine",
        description: "Throttleable rocket engine.",
        material: "Titanium / Steel",
        function: "Slows the module's descent to the lunar surface.",
        assemblyOrder: 7,
        connections: ["Descent Stage"],
        failureEffect: "Crash landing.",
        cascadeFailures: ["Module Destruction"],
        originalPosition: { x: 0, y: -1.25, z: 0 },
        explodedPosition: { x: 0, y: -4, z: 0 }
    });

    // 5. Thruster Plume
    const plumeGeo = new THREE.ConeGeometry(0.7, 2, 16);
    const plumeMesh = new THREE.Mesh(plumeGeo, thrusterGlow);
    plumeMesh.position.set(0, -2.5, 0);
    plumeMesh.rotation.x = Math.PI;
    plumeMesh.visible = false;
    group.add(plumeMesh);

    // 6. Dish Antenna
    const dishGeo = new THREE.SphereGeometry(0.5, 16, 16, 0, Math.PI * 2, 0, Math.PI / 3);
    const dishMesh = new THREE.Mesh(dishGeo, steel);
    dishMesh.position.set(1.2, 2.5, 0);
    dishMesh.rotation.z = -Math.PI / 4;
    group.add(dishMesh);
    parts.push({
        name: "High-Gain Antenna",
        description: "Steerable parabolic dish.",
        material: "Steel / Mesh",
        function: "Provides S-band communication with Earth.",
        assemblyOrder: 8,
        connections: ["Ascent Stage"],
        failureEffect: "Loss of high-rate telemetry and video.",
        cascadeFailures: ["Mission Control Blind", "Navigational Errors"],
        originalPosition: { x: 1.2, y: 2.5, z: 0 },
        explodedPosition: { x: 3, y: 5, z: 0 }
    });

    const quizQuestions = [
        {
            question: "What is the primary function of the Descent Stage?",
            options: [
                "To house the crew during the entire mission",
                "To provide propulsion for a soft lunar landing",
                "To return the crew to Earth",
                "To communicate with satellites"
            ],
            correct: 1,
            explanation: "The descent stage contains the descent engine and propellants necessary to slow the spacecraft and perform a soft touchdown on the moon.",
            difficulty: "easy"
        },
        {
            question: "Why is gold foil (Kapton) extensively used on the Lunar Module?",
            options: [
                "For aerodynamic streamlining",
                "To reflect sunlight and provide thermal insulation",
                "To increase structural rigidity",
                "For aesthetic purposes"
            ],
            correct: 1,
            explanation: "Kapton foil is highly reflective and lightweight, providing excellent thermal insulation against the extreme temperatures of space.",
            difficulty: "medium"
        },
        {
            question: "What happens to the Descent Stage when the Lunar Module leaves the moon?",
            options: [
                "It ascends with the crew back to orbit",
                "It is remotely piloted back to Earth",
                "It serves as the launch pad for the Ascent Stage and is left behind",
                "It explodes to propel the Ascent Stage"
            ],
            correct: 2,
            explanation: "The descent stage serves as a launch platform for the ascent stage and remains on the lunar surface permanently.",
            difficulty: "easy"
        }
    ];

    const description = "A highly detailed, visually stunning THREE.js model of an Aerospace Lunar Lander Module. Features separate ascent and descent stages, shock-absorbing landing legs, high-gain antenna, and dynamic engine exhaust.";

    function animate(time, speed, meshes) {
        // Subtle hover effect
        group.position.y = Math.sin(time * speed) * 0.1;
        
        // Thruster flickering
        if (Math.sin(time * speed * 5) > 0) {
            plumeMesh.visible = true;
            plumeMesh.scale.set(1 + Math.random()*0.2, 1 + Math.random()*0.5, 1 + Math.random()*0.2);
            plumeMesh.material.opacity = 0.5 + Math.random() * 0.5;
        } else {
            plumeMesh.visible = false;
        }

        // Antenna tracking slowly
        dishMesh.rotation.y = time * speed * 0.2;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createLunarLanderModule() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
