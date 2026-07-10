import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const ramAirMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x00aaff,
        emissiveIntensity: 2,
        transparent: true,
        opacity: 0.6,
        roughness: 0.1,
        metalness: 0.1,
        transmission: 0.9,
    });

    const heaterGlowMaterial = new THREE.MeshBasicMaterial({
        color: 0xff5500,
        transparent: true,
        opacity: 0.8,
    });

    // Meshes for animation
    const meshes = {};

    // 1. Mounting Bracket
    const bracketGeo = new THREE.BoxGeometry(0.5, 2, 1);
    const bracket = new THREE.Mesh(bracketGeo, darkSteel);
    bracket.position.set(-2, 0, 0);
    group.add(bracket);
    parts.push({
        name: "Mounting Bracket",
        description: "Secures the pitot tube to the aircraft fuselage.",
        material: "Dark Steel",
        function: "Structural support and alignment.",
        assemblyOrder: 1,
        connections: ["Aircraft Fuselage", "Probe Body"],
        failureEffect: "Misalignment, erroneous airspeed readings.",
        cascadeFailures: ["Autopilot disconnect", "Stall warning malfunction"],
        originalPosition: { x: -2, y: 0, z: 0 },
        explodedPosition: { x: -4, y: 0, z: 0 }
    });

    // 2. Main Probe Body (Outer Tube)
    const bodyGeo = new THREE.CylinderGeometry(0.2, 0.3, 4, 32);
    bodyGeo.rotateZ(Math.PI / 2);
    const body = new THREE.Mesh(bodyGeo, chrome);
    body.position.set(0, 0, 0);
    group.add(body);
    parts.push({
        name: "Probe Body",
        description: "Aerodynamic outer casing containing internal components.",
        material: "Chrome/Steel",
        function: "Houses static ports and protects inner tubes.",
        assemblyOrder: 2,
        connections: ["Mounting Bracket", "Inner Ram Tube"],
        failureEffect: "Structural failure or blockage.",
        cascadeFailures: ["Loss of static pressure data", "Altimeter failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 2, z: 0 }
    });

    // 3. Inner Ram Air Tube
    const innerTubeGeo = new THREE.CylinderGeometry(0.08, 0.08, 4.1, 16);
    innerTubeGeo.rotateZ(Math.PI / 2);
    const innerTube = new THREE.Mesh(innerTubeGeo, copper);
    innerTube.position.set(0.05, 0, 0);
    group.add(innerTube);
    parts.push({
        name: "Ram Air Tube",
        description: "Central tube capturing direct airflow.",
        material: "Copper/Aluminum",
        function: "Measures stagnation (total) pressure.",
        assemblyOrder: 3,
        connections: ["Probe Body", "Pressure Transducer"],
        failureEffect: "Zero airspeed indication if blocked.",
        cascadeFailures: ["Airspeed indicator drops to zero", "Auto-throttle failure"],
        originalPosition: { x: 0.05, y: 0, z: 0 },
        explodedPosition: { x: 0.05, y: -2, z: 0 }
    });

    // 4. Heater Coils
    const heaterGeo = new THREE.TorusGeometry(0.15, 0.02, 16, 100, Math.PI * 2 * 10);
    const heater = new THREE.Mesh(heaterGeo, heaterGlowMaterial);
    heater.position.set(0, 0, 0);
    heater.scale.set(1, 1, 0.2); // stretch it out along the tube
    // Using a group to rotate
    const heaterGroup = new THREE.Group();
    heaterGroup.add(heater);
    heaterGroup.rotation.y = Math.PI / 2;
    heaterGroup.position.set(0, 0, 0);
    // Scale X of the group to stretch the coils
    heaterGroup.scale.set(1, 1, 15);
    group.add(heaterGroup);
    meshes.heater = heater;

    parts.push({
        name: "Heater Elements",
        description: "Electrical resistance heating coils.",
        material: "Nichrome Wire",
        function: "Prevents ice accumulation inside and outside the tube.",
        assemblyOrder: 4,
        connections: ["Probe Body", "Electrical System"],
        failureEffect: "Ice blockage in freezing conditions.",
        cascadeFailures: ["Erroneous overspeed/underspeed warnings", "Flight control degradation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 2 }
    });

    // 5. Ram Air Flow Visualization (Glowing)
    const ramAirGeo = new THREE.CylinderGeometry(0.05, 0.05, 1, 16);
    ramAirGeo.rotateZ(Math.PI / 2);
    const ramAir = new THREE.Mesh(ramAirGeo, ramAirMaterial);
    ramAir.position.set(1.5, 0, 0);
    group.add(ramAir);
    meshes.ramAir = ramAir;

    // 6. Static Ports (Visual holes representation)
    const portGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8);
    const port1 = new THREE.Mesh(portGeo, rubber);
    port1.position.set(-0.5, 0.2, 0);
    const port2 = new THREE.Mesh(portGeo, rubber);
    port2.position.set(-0.5, -0.2, 0);
    group.add(port1);
    group.add(port2);
    parts.push({
        name: "Static Ports",
        description: "Small holes on the side of the probe.",
        material: "Machined Steel",
        function: "Measures ambient atmospheric pressure (static pressure).",
        assemblyOrder: 5,
        connections: ["Probe Body", "Static Pressure Lines"],
        failureEffect: "Incorrect altitude and vertical speed readings.",
        cascadeFailures: ["Altimeter freezes", "VSI reads zero"],
        originalPosition: { x: -0.5, y: 0, z: 0 },
        explodedPosition: { x: -0.5, y: 0, z: -2 }
    });

    const description = "The Aero Pitot Tube is a critical avionics sensor that measures airspeed by comparing stagnation (ram) pressure with static pressure. It features internal heating elements to prevent ice formation at high altitudes.";

    const quizQuestions = [
        {
            question: "What does the central Ram Air Tube measure?",
            options: ["Static Pressure", "Stagnation (Total) Pressure", "Temperature", "Humidity"],
            correct: 1,
            explanation: "The ram air tube directly faces the airflow to measure the total or stagnation pressure of the moving aircraft.",
            difficulty: "Medium"
        },
        {
            question: "What is the primary function of the heater elements in a pitot tube?",
            options: ["Keep the electronics warm", "Pre-heat the air for the engines", "Prevent ice accumulation", "Increase airspeed accuracy at high temps"],
            correct: 2,
            explanation: "Heater elements prevent ice from forming and blocking the pitot tube, which could lead to catastrophic loss of airspeed data.",
            difficulty: "Easy"
        },
        {
            question: "A blockage in the static ports will primarily affect which instruments?",
            options: ["Engine RPM and EGT", "Altimeter and Vertical Speed Indicator", "Magnetic Compass", "Fuel Quantity"],
            correct: 1,
            explanation: "Static pressure is required for the altimeter, VSI, and airspeed indicator. A blockage primarily causes altitude and VSI errors, and airspeed errors during climbs/descents.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, m = meshes) {
        // Animate Ram Air Flow
        if (m.ramAir) {
            // Pulse the emissive intensity based on speed
            m.ramAir.material.emissiveIntensity = 2 + Math.sin(time * 5 * speed);
            // Move the flow along the tube
            m.ramAir.position.x = 1.5 - ((time * speed * 2) % 3);
            m.ramAir.scale.set(1 + Math.sin(time*10)*0.1, 1, 1);
        }
        
        // Animate Heater Glow
        if (m.heater) {
            // Flicker effect
            m.heater.material.opacity = 0.6 + Math.random() * 0.4;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createAircraftPitotTube() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
