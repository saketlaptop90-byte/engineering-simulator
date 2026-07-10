import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const neonOrange = new THREE.MeshStandardMaterial({
        color: 0xff6600,
        emissive: 0xff6600,
        emissiveIntensity: 0.8,
        metalness: 0.2,
        roughness: 0.2
    });

    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00ccff,
        emissive: 0x00ccff,
        emissiveIntensity: 0.5,
        metalness: 0.3,
        roughness: 0.1
    });

    const glowingGreen = new THREE.MeshStandardMaterial({
        color: 0x33ff33,
        emissive: 0x33ff33,
        emissiveIntensity: 0.6,
        metalness: 0.1,
        roughness: 0.3
    });

    // 1. Frame Base
    const frameBaseGeo = new THREE.BoxGeometry(10, 0.5, 3);
    const frameBase = new THREE.Mesh(frameBaseGeo, darkSteel);
    frameBase.position.set(0, 0, 0);
    group.add(frameBase);
    parts.push({
        name: "Main Support Frame",
        description: "Heavy-duty structural base holding the conveyor system.",
        material: "Dark Steel",
        function: "Provides structural integrity and vibration dampening.",
        assemblyOrder: 1,
        connections: ["Drive Motor", "Idler Pulleys"],
        failureEffect: "Complete system collapse or severe misalignment.",
        cascadeFailures: ["Belt Tear", "Motor Burnout"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -5, z: 0},
        mesh: frameBase
    });

    // 2. Drive Motor
    const motorGeo = new THREE.CylinderGeometry(0.8, 0.8, 1.5, 32);
    const motor = new THREE.Mesh(motorGeo, copper);
    motor.rotation.x = Math.PI / 2;
    motor.position.set(4, 1, 1.5);
    group.add(motor);
    parts.push({
        name: "High-Torque Drive Motor",
        description: "Industrial electric motor that powers the conveyor belt.",
        material: "Copper/Steel",
        function: "Converts electrical energy into mechanical rotation to drive the belt.",
        assemblyOrder: 2,
        connections: ["Main Support Frame", "Drive Pulley", "Power Supply"],
        failureEffect: "Belt stops moving immediately.",
        cascadeFailures: ["Grain Backup", "Electrical Overload"],
        originalPosition: {x: 4, y: 1, z: 1.5},
        explodedPosition: {x: 8, y: 3, z: 4},
        mesh: motor
    });

    // 3. Drive Pulley
    const drivePulleyGeo = new THREE.CylinderGeometry(0.6, 0.6, 2.5, 32);
    const drivePulley = new THREE.Mesh(drivePulleyGeo, chrome);
    drivePulley.rotation.x = Math.PI / 2;
    drivePulley.position.set(4, 1, 0);
    group.add(drivePulley);
    parts.push({
        name: "Drive Pulley",
        description: "Primary rotating cylinder coupled to the motor.",
        material: "Chrome",
        function: "Grips and pulls the conveyor belt using friction.",
        assemblyOrder: 3,
        connections: ["Drive Motor", "Conveyor Belt"],
        failureEffect: "Loss of belt traction.",
        cascadeFailures: ["Belt Slippage", "Friction Fire"],
        originalPosition: {x: 4, y: 1, z: 0},
        explodedPosition: {x: 4, y: 5, z: 0},
        mesh: drivePulley
    });

    // 4. Tail Pulley (Idler)
    const tailPulleyGeo = new THREE.CylinderGeometry(0.6, 0.6, 2.5, 32);
    const tailPulley = new THREE.Mesh(tailPulleyGeo, steel);
    tailPulley.rotation.x = Math.PI / 2;
    tailPulley.position.set(-4, 1, 0);
    group.add(tailPulley);
    parts.push({
        name: "Tail Pulley",
        description: "Free-spinning cylinder at the loading end.",
        material: "Steel",
        function: "Maintains belt tension and guides the return path.",
        assemblyOrder: 4,
        connections: ["Main Support Frame", "Conveyor Belt", "Tensioner"],
        failureEffect: "Belt goes slack and loses tracking.",
        cascadeFailures: ["Grain Spillage", "Belt Damage"],
        originalPosition: {x: -4, y: 1, z: 0},
        explodedPosition: {x: -8, y: 2, z: 0},
        mesh: tailPulley
    });

    // 5. Conveyor Belt
    const beltPath = new THREE.Shape();
    beltPath.moveTo(-4, 1.6);
    beltPath.lineTo(4, 1.6);
    beltPath.absarc(4, 1, 0.6, Math.PI/2, -Math.PI/2, true);
    beltPath.lineTo(-4, 0.4);
    beltPath.absarc(-4, 1, 0.6, -Math.PI/2, Math.PI/2, true);
    
    const extrudeSettings = { depth: 2.4, bevelEnabled: false };
    const beltGeo = new THREE.ExtrudeGeometry(beltPath, extrudeSettings);
    beltGeo.translate(0, 0, -1.2);
    const belt = new THREE.Mesh(beltGeo, rubber);
    group.add(belt);
    parts.push({
        name: "Heavy-Duty Rubber Belt",
        description: "Continuous loop of reinforced rubber.",
        material: "Rubber",
        function: "Carries the grain from the loading zone to the discharge chute.",
        assemblyOrder: 5,
        connections: ["Drive Pulley", "Tail Pulley", "Rollers"],
        failureEffect: "Material transport ceases entirely.",
        cascadeFailures: ["Motor Freewheeling", "Process Halting"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 6, z: 0},
        mesh: belt
    });

    // 6. Loading Hopper
    const hopperGeo = new THREE.CylinderGeometry(2, 1, 2, 4);
    const hopper = new THREE.Mesh(hopperGeo, aluminum);
    hopper.position.set(-3.5, 3, 0);
    hopper.rotation.y = Math.PI / 4;
    group.add(hopper);
    parts.push({
        name: "Loading Hopper",
        description: "Funnel-shaped receptacle for receiving grain.",
        material: "Aluminum",
        function: "Directs raw grain cleanly onto the moving belt.",
        assemblyOrder: 6,
        connections: ["Main Support Frame"],
        failureEffect: "Grain spills outside the system.",
        cascadeFailures: ["Waste", "Equipment Jamming"],
        originalPosition: {x: -3.5, y: 3, z: 0},
        explodedPosition: {x: -4, y: 8, z: 2},
        mesh: hopper
    });

    // 7. Sensors (Neon)
    const sensorGeo = new THREE.BoxGeometry(0.2, 0.5, 0.2);
    const sensor1 = new THREE.Mesh(sensorGeo, neonBlue);
    sensor1.position.set(-2, 1.8, 1.3);
    const sensor2 = new THREE.Mesh(sensorGeo, neonOrange);
    sensor2.position.set(2, 1.8, 1.3);
    group.add(sensor1);
    group.add(sensor2);
    parts.push({
        name: "Optical Flow Sensors",
        description: "High-tech laser sensors monitoring grain throughput.",
        material: "Glowing Electronics",
        function: "Measures volume and speed, triggering emergency stops if jammed.",
        assemblyOrder: 7,
        connections: ["Control Unit"],
        failureEffect: "Loss of automated oversight.",
        cascadeFailures: ["Overloading", "Unnoticed Jams"],
        originalPosition: {x: -2, y: 1.8, z: 1.3},
        explodedPosition: {x: -2, y: 4, z: 5},
        mesh: sensor1
    });

    // Rollers (Idlers) along the belt
    const rollerGeo = new THREE.CylinderGeometry(0.2, 0.2, 2.5, 16);
    const rollers = [];
    for(let i = -2.5; i <= 2.5; i += 1.25) {
        const roller = new THREE.Mesh(rollerGeo, steel);
        roller.rotation.x = Math.PI/2;
        roller.position.set(i, 1.4, 0);
        group.add(roller);
        rollers.push(roller);
    }
    parts.push({
        name: "Support Rollers",
        description: "Series of small cylinders under the top belt.",
        material: "Steel",
        function: "Prevents belt sag under the weight of the grain.",
        assemblyOrder: 8,
        connections: ["Main Support Frame", "Conveyor Belt"],
        failureEffect: "Belt sags and rubs against frame.",
        cascadeFailures: ["Increased Motor Load", "Belt Wear"],
        originalPosition: {x: 0, y: 1.4, z: 0},
        explodedPosition: {x: 0, y: 3, z: -4},
        mesh: rollers[0]
    });

    const description = "The Agricultural Grain Conveyor Belt System is a highly efficient industrial machine designed to transport large volumes of harvested grain. It utilizes a high-torque electric motor to drive a heavy-duty rubber belt over a series of frictionless rollers. Integrated optical sensors provide real-time throughput data and safety monitoring.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Tail Pulley in the conveyor system?",
            options: [
                "To provide rotational power to the belt.",
                "To maintain belt tension and guide the return path.",
                "To measure the volume of grain.",
                "To filter out large debris."
            ],
            correct: 1,
            explanation: "The tail pulley is a free-spinning idler that helps keep the belt tight and properly aligned as it returns to the loading zone.",
            difficulty: "Medium"
        },
        {
            question: "If the Drive Motor fails, what is the immediate consequence?",
            options: [
                "The belt speeds up out of control.",
                "The sensors glow bright red.",
                "The belt stops moving entirely.",
                "The hopper overflows instantly."
            ],
            correct: 2,
            explanation: "The drive motor provides the mechanical force required to move the belt. Without it, the system immediately halts.",
            difficulty: "Easy"
        },
        {
            question: "Why are Support Rollers placed closely together under the top section of the belt?",
            options: [
                "To prevent the belt from sagging under the weight of the grain.",
                "To generate static electricity for the sensors.",
                "To clean the bottom of the belt.",
                "To steer the grain into the hopper."
            ],
            correct: 0,
            explanation: "Support rollers distribute the load and keep the loaded belt flat and elevated, preventing friction against the main frame.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Rotate drive and tail pulleys
        const rotationSpeed = speed * 0.05;
        drivePulley.rotation.y -= rotationSpeed;
        tailPulley.rotation.y -= rotationSpeed;

        // Rotate motor
        motor.rotation.y -= rotationSpeed * 2;

        // Rotate support rollers
        rollers.forEach(r => r.rotation.y -= rotationSpeed);

        // Pulse glowing sensors
        const pulse = (Math.sin(time * 0.005) + 1) / 2;
        neonBlue.emissiveIntensity = 0.3 + pulse * 0.7;
        neonOrange.emissiveIntensity = 0.3 + (1 - pulse) * 0.7;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createGrainConveyorBelt() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
