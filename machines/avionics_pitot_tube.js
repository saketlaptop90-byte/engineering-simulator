import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const ramAirFlowMat = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x00aaaa,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.6,
        roughness: 0.1,
        metalness: 0.1
    });

    const staticAirFlowMat = new THREE.MeshPhysicalMaterial({
        color: 0xff00ff,
        emissive: 0xaa00aa,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.6,
        roughness: 0.1,
        metalness: 0.1
    });

    const heaterGlowMat = new THREE.MeshPhysicalMaterial({
        color: 0xff4400,
        emissive: 0xff2200,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.8,
        roughness: 0.2
    });

    // 1. Main Outer Shell (Aerodynamic probe)
    const shellGeo = new THREE.CylinderGeometry(0.5, 0.8, 10, 32);
    shellGeo.rotateZ(Math.PI / 2); // horizontal
    const shell = new THREE.Mesh(shellGeo, chrome);
    shell.position.set(0, 0, 0);
    group.add(shell);
    
    // Front Cone
    const coneGeo = new THREE.ConeGeometry(0.5, 2, 32);
    coneGeo.rotateZ(-Math.PI / 2);
    const cone = new THREE.Mesh(coneGeo, chrome);
    cone.position.set(6, 0, 0);
    group.add(cone);

    parts.push({
        name: "Outer Probe Shell",
        description: "The aerodynamic external casing of the pitot-static tube, typically made of high-strength alloys to withstand high air speeds and environmental elements.",
        material: "chrome",
        function: "Houses internal components and provides aerodynamic shape to minimize turbulent airflow interference.",
        assemblyOrder: 1,
        connections: ["Mounting Bracket", "Static Ports", "Heater Coils"],
        failureEffect: "Structural damage can cause airflow disruption, leading to erroneous airspeed and altitude readings.",
        cascadeFailures: ["Complete loss of reliable airspeed data", "Autopilot disconnection"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 3, z: 0 }
    });

    // 2. Ram Air Tube (Internal)
    const ramTubeGeo = new THREE.CylinderGeometry(0.15, 0.15, 12, 16);
    ramTubeGeo.rotateZ(Math.PI / 2);
    const ramTube = new THREE.Mesh(ramTubeGeo, darkSteel);
    ramTube.position.set(1, 0, 0);
    group.add(ramTube);

    parts.push({
        name: "Ram Air Tube",
        description: "The central tube facing directly into the relative wind to measure dynamic (total) pressure.",
        material: "darkSteel",
        function: "Captures ram air pressure and transmits it to the airspeed indicator.",
        assemblyOrder: 2,
        connections: ["Outer Shell", "Pitot Line"],
        failureEffect: "Blockage (e.g., by ice or insects) causes airspeed indicator to read zero or act as an altimeter.",
        cascadeFailures: ["Stall warning failure", "Incorrect flight envelope protection"],
        originalPosition: { x: 1, y: 0, z: 0 },
        explodedPosition: { x: 1, y: 0, z: 2 }
    });

    // 3. Static Chamber
    const staticChamberGeo = new THREE.CylinderGeometry(0.4, 0.7, 8, 32, 1, true);
    staticChamberGeo.rotateZ(Math.PI / 2);
    const staticChamber = new THREE.Mesh(staticChamberGeo, aluminum);
    staticChamber.position.set(-1, 0, 0);
    group.add(staticChamber);

    parts.push({
        name: "Static Pressure Chamber",
        description: "An internal cavity connected to the small static ports on the side of the probe.",
        material: "aluminum",
        function: "Collects ambient, undisturbed static air pressure for the altimeter, vertical speed indicator, and airspeed indicator.",
        assemblyOrder: 3,
        connections: ["Static Ports", "Static Line"],
        failureEffect: "Blockage causes altimeter to freeze and airspeed to read incorrectly during climbs/descents.",
        cascadeFailures: ["Loss of altitude holding", "GPWS errors"],
        originalPosition: { x: -1, y: 0, z: 0 },
        explodedPosition: { x: -1, y: -3, z: 0 }
    });

    // 4. Heater Coils
    const heaterGeo = new THREE.TorusGeometry(0.25, 0.05, 16, 100);
    const heaterGroup = new THREE.Group();
    for(let i=0; i<8; i++) {
        const coil = new THREE.Mesh(heaterGeo, heaterGlowMat);
        coil.position.set(2 - i*0.8, 0, 0);
        coil.rotation.y = Math.PI / 2;
        heaterGroup.add(coil);
    }
    group.add(heaterGroup);

    parts.push({
        name: "Heating Elements",
        description: "Electrical resistance heating coils wrapped around the internal tubes.",
        material: "heaterGlowMat",
        function: "Prevents ice formation from blocking the ram air inlet and static ports during flight in visible moisture.",
        assemblyOrder: 4,
        connections: ["Power Supply", "Ram Air Tube"],
        failureEffect: "Allows ice to accumulate, leading to pitot tube blockage.",
        cascadeFailures: ["Unreliable airspeed indication", "Flight control computer reversion to alternate laws"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -2 }
    });

    // 5. Drain Hole
    const drainGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 16);
    const drain = new THREE.Mesh(drainGeo, darkSteel);
    drain.position.set(-2, -0.7, 0);
    group.add(drain);

    parts.push({
        name: "Moisture Drain Hole",
        description: "A small opening at the lowest point of the pitot system.",
        material: "darkSteel",
        function: "Allows condensation or ingested precipitation to drain out without blocking the pressure lines.",
        assemblyOrder: 5,
        connections: ["Ram Air Tube", "Outer Shell"],
        failureEffect: "Trapped water can freeze or block pressure readings.",
        cascadeFailures: ["Erratic airspeed readings during maneuvers"],
        originalPosition: { x: -2, y: -0.7, z: 0 },
        explodedPosition: { x: -2, y: -2, z: 0 }
    });

    // 6. Airflow visualizations (Animated)
    const ramAirPartGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const staticAirPartGeo = new THREE.SphereGeometry(0.05, 16, 16);
    
    const airParticlesGroup = new THREE.Group();
    const ramParticles = [];
    const staticParticles = [];

    for(let i=0; i<20; i++) {
        const p = new THREE.Mesh(ramAirPartGeo, ramAirFlowMat);
        p.position.set(7 + Math.random()*5, 0, 0);
        ramParticles.push(p);
        airParticlesGroup.add(p);
    }

    for(let i=0; i<30; i++) {
        const p = new THREE.Mesh(staticAirPartGeo, staticAirFlowMat);
        const theta = Math.random() * Math.PI * 2;
        p.position.set(2 + Math.random()*4, Math.cos(theta)*0.6, Math.sin(theta)*0.6);
        p.userData = { theta: theta };
        staticParticles.push(p);
        airParticlesGroup.add(p);
    }
    group.add(airParticlesGroup);

    parts.push({
        name: "Airflow (Visualization)",
        description: "Cyan represents high-velocity Ram Air, Magenta represents ambient Static Air.",
        material: "Holographic",
        function: "Visual aid showing how total pressure and static pressure enter the system.",
        assemblyOrder: 6,
        connections: [],
        failureEffect: "N/A",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 5, y: 5, z: 5 }
    });

    const quizQuestions = [
        {
            question: "What happens to the airspeed indicator if the pitot tube's ram air inlet becomes blocked, but the drain hole remains open?",
            options: [
                "It reads abnormally high",
                "It drops to zero",
                "It functions as an altimeter",
                "It freezes at the current reading"
            ],
            correct: 1,
            explanation: "If the ram air inlet is blocked and the drain hole is open, the ram air pressure leaks out of the drain hole, equalizing with static pressure. Airspeed drops to zero.",
            difficulty: "Hard"
        },
        {
            question: "Which instruments rely solely on the static port and NOT the ram air inlet?",
            options: [
                "Airspeed Indicator and Altimeter",
                "Altimeter and Vertical Speed Indicator (VSI)",
                "Turn Coordinator and Attitude Indicator",
                "Airspeed Indicator and VSI"
            ],
            correct: 1,
            explanation: "The Altimeter and Vertical Speed Indicator operate entirely on changes in static air pressure. Only the Airspeed Indicator requires ram air (total pressure).",
            difficulty: "Medium"
        },
        {
            question: "Why is the pitot tube equipped with internal heating elements?",
            options: [
                "To warm the air before it enters the instruments",
                "To prevent structural deformation at high speeds",
                "To evaporate condensation in the static lines",
                "To prevent ice accumulation from blocking the inlets"
            ],
            correct: 3,
            explanation: "Pitot heat prevents ice buildup from blocking the ram air inlet and static ports, which would lead to catastrophic loss of airspeed and altitude data.",
            difficulty: "Easy"
        }
    ];

    const description = "The Pitot-Static Tube is a critical avionics sensor probe mounted on the exterior of an aircraft. It measures both the dynamic (ram) pressure of the oncoming air and the ambient static pressure. The difference between these two pressures determines indicated airspeed. It also provides vital static pressure data to the altimeter and vertical speed indicator. A failure or blockage of this system can severely compromise flight safety.";

    function animate(time, speed, meshes) {
        // Heater pulsing effect
        const pulse = (Math.sin(time * 2 * speed) + 1) / 2;
        heaterGlowMat.emissiveIntensity = 1.0 + pulse * 1.5;

        // Animate ram air particles (Cyan) flowing into the tube
        ramParticles.forEach((p, index) => {
            p.position.x -= 0.2 * speed;
            if(p.position.x < -5) {
                p.position.x = 7 + Math.random()*5;
                p.position.y = (Math.random() - 0.5) * 0.2;
                p.position.z = (Math.random() - 0.5) * 0.2;
            }
        });

        // Animate static air particles (Magenta) flowing past and occasionally entering ports
        staticParticles.forEach((p, index) => {
            p.position.x -= 0.15 * speed;
            if(p.position.x < -4) {
                p.position.x = 2 + Math.random()*4;
                const theta = p.userData.theta;
                p.position.y = Math.cos(theta) * 0.6;
                p.position.z = Math.sin(theta) * 0.6;
            } else if (p.position.x < 1 && p.position.x > 0) {
                // Suck slightly inwards towards static ports
                p.position.y *= 0.98;
                p.position.z *= 0.98;
            }
        });
    }

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createAvionicsPitotTube() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
