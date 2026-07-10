import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom Glowing Materials
    const laserGlow = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.8
    });

    const plasmaCoreGlow = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.9
    });
    
    const glowingOre = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0xffaa00,
        emissiveIntensity: 1.0,
        roughness: 0.2,
        metalness: 0.8
    });

    // Part 1: Main Chassis (Dark Steel)
    const chassisGeo = new THREE.BoxGeometry(4, 2, 6);
    const chassis = new THREE.Mesh(chassisGeo, darkSteel);
    group.add(chassis);
    meshes.chassis = chassis;
    parts.push({
        name: "Main Hull Chassis",
        description: "Heavily armored core structure housing the primary systems and protecting them from micro-meteorite impacts.",
        material: "Dark Steel",
        function: "Structural integrity and housing",
        assemblyOrder: 1,
        connections: ["Plasma Reactor Core", "Drill Arm Assembly", "Command Bridge"],
        failureEffect: "Structural breach leading to depressurization and system exposure.",
        cascadeFailures: ["Complete system shutdown"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 5, z: 0}
    });

    // Part 2: Plasma Reactor Core (Plasma Core Glow)
    const reactorGeo = new THREE.CylinderGeometry(0.8, 0.8, 2, 32);
    const reactor = new THREE.Mesh(reactorGeo, plasmaCoreGlow);
    reactor.position.set(0, 0, -1);
    reactor.rotation.x = Math.PI / 2;
    group.add(reactor);
    meshes.reactor = reactor;
    parts.push({
        name: "Plasma Reactor Core",
        description: "High-yield fusion reactor providing power for propulsion and deep-space mining operations.",
        material: "Plasma Core Glow",
        function: "Power generation",
        assemblyOrder: 2,
        connections: ["Main Hull Chassis", "Power Conduits"],
        failureEffect: "Loss of power.",
        cascadeFailures: ["Life support failure", "Drill shutdown"],
        originalPosition: {x: 0, y: 0, z: -1},
        explodedPosition: {x: 0, y: 0, z: -8}
    });

    // Part 3: Command Bridge (Glass / Chrome)
    const bridgeGeo = new THREE.SphereGeometry(1.2, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const bridge = new THREE.Mesh(bridgeGeo, tinted);
    bridge.position.set(0, 1, 1.5);
    group.add(bridge);
    meshes.bridge = bridge;
    parts.push({
        name: "Command Bridge",
        description: "Pressurized cockpit where the mining crew oversees drilling operations.",
        material: "Tinted Glass",
        function: "Crew housing and command center",
        assemblyOrder: 3,
        connections: ["Main Hull Chassis"],
        failureEffect: "Loss of manual control.",
        cascadeFailures: ["Autopilot engagement", "Potential drill misalignment"],
        originalPosition: {x: 0, y: 1, z: 1.5},
        explodedPosition: {x: 0, y: 8, z: 2}
    });

    // Part 4: Drill Arm Assembly (Steel)
    const armGeo = new THREE.CylinderGeometry(0.3, 0.3, 4, 16);
    const arm = new THREE.Mesh(armGeo, steel);
    arm.position.set(0, -0.5, 4);
    arm.rotation.x = Math.PI / 2;
    group.add(arm);
    meshes.arm = arm;
    parts.push({
        name: "Drill Arm Assembly",
        description: "Articulated boom extending the drill bit to the asteroid surface.",
        material: "Steel",
        function: "Positioning the drill bit",
        assemblyOrder: 4,
        connections: ["Main Hull Chassis", "Primary Drill Bit"],
        failureEffect: "Inability to reach the asteroid surface.",
        cascadeFailures: ["Loss of mining capability"],
        originalPosition: {x: 0, y: -0.5, z: 4},
        explodedPosition: {x: 0, y: -5, z: 4}
    });

    // Part 5: Primary Drill Bit (Chrome / Laser Glow)
    const drillGroup = new THREE.Group();
    const drillGeo = new THREE.ConeGeometry(1, 2, 16);
    const drillBit = new THREE.Mesh(drillGeo, chrome);
    drillBit.position.set(0, 1, 0);
    
    // Laser cutters on drill
    const laserCutterGeo = new THREE.CylinderGeometry(0.1, 0.1, 2.2, 8);
    const laserCutter = new THREE.Mesh(laserCutterGeo, laserGlow);
    laserCutter.position.set(0, 1, 0);

    drillGroup.add(drillBit);
    drillGroup.add(laserCutter);

    drillGroup.position.set(0, -0.5, 6.5);
    drillGroup.rotation.x = -Math.PI / 2;
    group.add(drillGroup);
    meshes.drillGroup = drillGroup;
    meshes.laserCutter = laserCutter;
    
    parts.push({
        name: "Laser-Enhanced Drill Bit",
        description: "Heavy-duty rotating cone drill fitted with high-intensity plasma lasers to melt through rock.",
        material: "Chrome / Laser Glow",
        function: "Asteroid surface penetration and ore extraction",
        assemblyOrder: 5,
        connections: ["Drill Arm Assembly"],
        failureEffect: "Inability to extract ore.",
        cascadeFailures: ["Mission failure"],
        originalPosition: {x: 0, y: -0.5, z: 6.5},
        explodedPosition: {x: 0, y: -5, z: 10}
    });

    // Part 6: Ore Extraction Pipes (Copper)
    const pipeGeo = new THREE.CylinderGeometry(0.2, 0.2, 3, 16);
    const pipeLeft = new THREE.Mesh(pipeGeo, copper);
    pipeLeft.position.set(1.5, -0.5, 3.5);
    pipeLeft.rotation.x = Math.PI / 2;
    
    const pipeRight = new THREE.Mesh(pipeGeo, copper);
    pipeRight.position.set(-1.5, -0.5, 3.5);
    pipeRight.rotation.x = Math.PI / 2;

    group.add(pipeLeft);
    group.add(pipeRight);
    parts.push({
        name: "Ore Extraction Pipes",
        description: "Pneumatic transport tubes for moving pulverized ore into the cargo hold.",
        material: "Copper",
        function: "Ore transport",
        assemblyOrder: 6,
        connections: ["Drill Arm Assembly", "Cargo Hold"],
        failureEffect: "Ore clogs or venting into space.",
        cascadeFailures: ["Loss of profit"],
        originalPosition: {x: 1.5, y: -0.5, z: 3.5},
        explodedPosition: {x: 5, y: -2, z: 3.5}
    });
    
    // Part 7: Hover Thrusters (Aluminum / Glowing)
    const thrusterGeo = new THREE.CylinderGeometry(0.5, 0.4, 0.8, 16);
    const thrusterFL = new THREE.Mesh(thrusterGeo, aluminum);
    thrusterFL.position.set(2.2, -1, 2);
    const thrusterFR = new THREE.Mesh(thrusterGeo, aluminum);
    thrusterFR.position.set(-2.2, -1, 2);
    const thrusterBL = new THREE.Mesh(thrusterGeo, aluminum);
    thrusterBL.position.set(2.2, -1, -2);
    const thrusterBR = new THREE.Mesh(thrusterGeo, aluminum);
    thrusterBR.position.set(-2.2, -1, -2);

    group.add(thrusterFL);
    group.add(thrusterFR);
    group.add(thrusterBL);
    group.add(thrusterBR);
    
    parts.push({
        name: "Maneuvering Thrusters",
        description: "Omni-directional propulsion units used for aligning the rig with the asteroid.",
        material: "Aluminum",
        function: "Spatial positioning",
        assemblyOrder: 7,
        connections: ["Main Hull Chassis"],
        failureEffect: "Loss of control.",
        cascadeFailures: ["Collision with asteroid"],
        originalPosition: {x: 2.2, y: -1, z: 2},
        explodedPosition: {x: 8, y: -4, z: 2}
    });

    const description = "The Deep Space Asteroid Mining Rig is an advanced piece of orbital engineering designed to latch onto celestial bodies, drill into their crusts using plasma-assisted mechanics, and extract precious zero-g minerals. It features a heavy-duty chassis, a state-of-the-art fusion reactor, and glowing laser cutters.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Plasma Reactor Core in the mining rig?",
            options: ["To cut through the asteroid crust", "To store the extracted ore", "To provide high-yield power for propulsion and drilling", "To maintain structural integrity"],
            correct: 2,
            explanation: "The Plasma Reactor Core is the central power source of the rig, supplying the necessary energy for both deep-space propulsion and the high-demand laser drilling operations.",
            difficulty: "easy"
        },
        {
            question: "Why does the rig employ 'Maneuvering Thrusters' in a zero-g environment?",
            options: ["To increase drilling speed", "For precise spatial positioning and alignment with the asteroid", "To keep the crew warm", "To process raw materials into refined ingots"],
            correct: 1,
            explanation: "In the vacuum of space, aerodynamic control surfaces do not work. Maneuvering Thrusters are required to adjust the rig's orientation and secure it safely to the asteroid's surface.",
            difficulty: "medium"
        },
        {
            question: "If a structural breach occurs in the Main Hull Chassis, what is the most immediate cascade failure?",
            options: ["The drill bit overheats", "Complete system shutdown due to depressurization and exposure", "The ore extraction pipes clog", "The lasers become brighter"],
            correct: 1,
            explanation: "The Main Hull Chassis protects all internal systems. A breach leads to depressurization, exposing sensitive electronics and crew to the harsh vacuum, causing a complete shutdown.",
            difficulty: "hard"
        }
    ];

    function animate(time, speed, activeMeshes) {
        // Rotate the drill bit continuously
        if (activeMeshes.drillGroup) {
            activeMeshes.drillGroup.rotation.y = time * speed * 5;
        }
        
        // Pulse the reactor core and lasers
        if (activeMeshes.reactor) {
            const pulse = (Math.sin(time * speed * 2) + 1) / 2; // 0 to 1
            activeMeshes.reactor.material.emissiveIntensity = 1.0 + pulse * 1.5;
        }

        if (activeMeshes.laserCutter) {
            const laserPulse = (Math.sin(time * speed * 10) + 1) / 2;
            activeMeshes.laserCutter.material.emissiveIntensity = 1.0 + laserPulse * 2.0;
        }
        
        // Small hover effect for the entire chassis to simulate stabilizing thrusters in zero-g
        if (activeMeshes.chassis) {
            activeMeshes.chassis.parent.position.y = Math.sin(time * speed) * 0.1;
        }
    }

    return { group, parts, description, quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createAsteroidMiningRig() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
