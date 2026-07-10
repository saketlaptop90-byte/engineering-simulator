import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials for heat and electric current visualization
    const heatGlowMaterial = new THREE.MeshStandardMaterial({
        color: 0xff3300,
        emissive: 0xff0000,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.8,
        wireframe: true
    });
    
    const currentGlowMaterial = new THREE.MeshStandardMaterial({
        color: 0x00aaff,
        emissive: 0x0055ff,
        emissiveIntensity: 3.0,
        transparent: true,
        opacity: 0.9
    });
    
    const coldGlowMaterial = new THREE.MeshStandardMaterial({
        color: 0x0033ff,
        emissive: 0x0011cc,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.7,
        wireframe: true
    });
    
    const screenMaterial = new THREE.MeshStandardMaterial({
        color: 0x111111,
        emissive: 0x00ff00,
        emissiveIntensity: 0.5
    });

    // 1. Base Platform - highly detailed Extrude geometry
    const baseShape = new THREE.Shape();
    baseShape.moveTo(-15, -10);
    baseShape.lineTo(15, -10);
    baseShape.lineTo(18, -7);
    baseShape.lineTo(18, 7);
    baseShape.lineTo(15, 10);
    baseShape.lineTo(-15, 10);
    baseShape.lineTo(-18, 7);
    baseShape.lineTo(-18, -7);
    baseShape.lineTo(-15, -10);

    const baseExtrudeSettings = { depth: 2, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.5, bevelThickness: 0.5 };
    const baseGeometry = new THREE.ExtrudeGeometry(baseShape, baseExtrudeSettings);
    const baseMesh = new THREE.Mesh(baseGeometry, darkSteel);
    baseMesh.rotation.x = Math.PI / 2;
    baseMesh.position.y = -5;
    group.add(baseMesh);

    // Enhanced Base details (rivets)
    const rivetGeo = new THREE.SphereGeometry(0.2, 8, 8);
    for (let x = -14; x <= 14; x += 2) {
        const rivet1 = new THREE.Mesh(rivetGeo, chrome);
        rivet1.position.set(x, -4.8, 9);
        group.add(rivet1);
        
        const rivet2 = new THREE.Mesh(rivetGeo, chrome);
        rivet2.position.set(x, -4.8, -9);
        group.add(rivet2);
    }

    parts.push({
        name: "Heavy-Duty Stabilization Platform",
        description: "Massive base platform providing vibration isolation for the sensitive Thomson effect measurements.",
        material: "Dark Steel",
        function: "Structural support and grounding.",
        assemblyOrder: 1,
        connections: ["LeftPowerTerminal", "RightPowerTerminal", "VacuumPumpSystem"],
        failureEffect: "Vibration introduces noise into thermal gradient sensors.",
        cascadeFailures: ["Sensor misalignment", "Containment breach"],
        originalPosition: { x: 0, y: -5, z: 0 },
        explodedPosition: { x: 0, y: -20, z: 0 }
    });

    // 2. Main Thomson Conductor Rod - intricate Lathe with heat visualization zones
    const rodPoints = [];
    for (let i = 0; i <= 20; i++) {
        const x = (i / 20) * 20 - 10;
        const radius = 0.8 + Math.sin(i * Math.PI / 10) * 0.1; // slight rippling for high-tech look
        rodPoints.push(new THREE.Vector2(x, radius));
    }
    const rodGeometry = new THREE.LatheGeometry(rodPoints, 64);
    const rodMesh = new THREE.Mesh(rodGeometry, copper);
    rodMesh.rotation.z = Math.PI / 2;
    rodMesh.position.set(0, 5, 0);
    group.add(rodMesh);

    // Heat overlay meshes for the rod
    const heatOverlayGeo = new THREE.CylinderGeometry(0.9, 0.9, 8, 32, 1, true);
    const leftHeatMesh = new THREE.Mesh(heatOverlayGeo, coldGlowMaterial);
    leftHeatMesh.position.set(-6, 5, 0);
    leftHeatMesh.rotation.z = Math.PI / 2;
    group.add(leftHeatMesh);
    
    const rightHeatMesh = new THREE.Mesh(heatOverlayGeo, heatGlowMaterial);
    rightHeatMesh.position.set(6, 5, 0);
    rightHeatMesh.rotation.z = Math.PI / 2;
    group.add(rightHeatMesh);

    parts.push({
        name: "Bismuth-Antimony Conductor Rod",
        description: "The primary specimen where the Thomson effect occurs. Subjected to a massive thermal gradient and high DC current.",
        material: "Copper/Bismuth Alloy",
        function: "Exhibits heat absorption/evolution based on current direction along a thermal gradient.",
        assemblyOrder: 5,
        connections: ["LeftPowerTerminal", "RightPowerTerminal", "CentralHeatingCoil"],
        failureEffect: "Melt down or fracture due to thermal stress.",
        cascadeFailures: ["Power arc discharge", "Coolant vaporization"],
        originalPosition: { x: 0, y: 5, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 0 }
    });

    // 3. Central Heating Coil - Inductive Torus array
    const coilGroup = new THREE.Group();
    for (let i = 0; i < 5; i++) {
        const torusGeo = new THREE.TorusGeometry(1.5, 0.2, 16, 64);
        const torusMesh = new THREE.Mesh(torusGeo, heatGlowMaterial);
        torusMesh.position.x = -2 + i;
        torusMesh.rotation.y = Math.PI / 2;
        coilGroup.add(torusMesh);
    }
    coilGroup.position.set(0, 5, 0);
    group.add(coilGroup);

    parts.push({
        name: "Inductive Central Heater",
        description: "Generates the peak of the thermal gradient in the center of the conductor rod using high-frequency magnetic induction.",
        material: "Tungsten and Plasma",
        function: "Establishes the temperature gradient delta T required for Thomson effect observation.",
        assemblyOrder: 6,
        connections: ["Bismuth-Antimony Conductor Rod", "PowerSupplyUnit"],
        failureEffect: "Loss of thermal gradient, nullifying the Thomson effect.",
        cascadeFailures: ["Telemetry data anomaly"],
        originalPosition: { x: 0, y: 5, z: 0 },
        explodedPosition: { x: 0, y: 25, z: 10 }
    });

    // 4 & 5. Left and Right Power Terminals (Massive conductive mounts)
    const terminalShape = new THREE.Shape();
    terminalShape.moveTo(-2, 0);
    terminalShape.lineTo(2, 0);
    terminalShape.lineTo(2, 8);
    terminalShape.lineTo(1, 10);
    terminalShape.lineTo(-1, 10);
    terminalShape.lineTo(-2, 8);
    terminalShape.lineTo(-2, 0);

    const termExtrudeSettings = { depth: 3, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.2, bevelThickness: 0.2 };
    const terminalGeo = new THREE.ExtrudeGeometry(terminalShape, termExtrudeSettings);
    
    const leftTerminal = new THREE.Mesh(terminalGeo, aluminum);
    leftTerminal.position.set(-11.5, -4, -1.5);
    group.add(leftTerminal);
    
    const rightTerminal = new THREE.Mesh(terminalGeo, aluminum);
    rightTerminal.position.set(9.5, -4, -1.5);
    group.add(rightTerminal);

    parts.push({
        name: "Left Power & Cooling Terminal",
        description: "Secures the rod, injects high current, and provides cryogenic cooling to one end.",
        material: "Anodized Aluminum",
        function: "Current injection and heat sinking.",
        assemblyOrder: 2,
        connections: ["BasePlatform", "Bismuth-Antimony Conductor Rod"],
        failureEffect: "High resistance joint causing localized melting.",
        cascadeFailures: ["Rod detachment", "Terminal fire"],
        originalPosition: { x: -11.5, y: -4, z: -1.5 },
        explodedPosition: { x: -25, y: -4, z: -1.5 }
    });
    
    parts.push({
        name: "Right Power & Cooling Terminal",
        description: "Symmetrical terminal for completing the circuit and sinking heat from the opposite end.",
        material: "Anodized Aluminum",
        function: "Current return and heat sinking.",
        assemblyOrder: 3,
        connections: ["BasePlatform", "Bismuth-Antimony Conductor Rod"],
        failureEffect: "Circuit breakage, stopping Thomson effect.",
        cascadeFailures: ["Arc flash hazard"],
        originalPosition: { x: 9.5, y: -4, z: -1.5 },
        explodedPosition: { x: 25, y: -4, z: -1.5 }
    });

    // 6 & 7. Left and Right Cooling Jackets (Complex cylindrical fins)
    const jacketGroupL = new THREE.Group();
    const jacketGroupR = new THREE.Group();
    const finGeo = new THREE.CylinderGeometry(1.8, 1.8, 0.1, 32);
    for(let i=0; i<10; i++) {
        const finL = new THREE.Mesh(finGeo, chrome);
        finL.rotation.z = Math.PI / 2;
        finL.position.x = -8 - i*0.3;
        jacketGroupL.add(finL);
        
        const finR = new THREE.Mesh(finGeo, chrome);
        finR.rotation.z = Math.PI / 2;
        finR.position.x = 8 + i*0.3;
        jacketGroupR.add(finR);
    }
    jacketGroupL.position.y = 5;
    jacketGroupR.position.y = 5;
    group.add(jacketGroupL);
    group.add(jacketGroupR);

    parts.push({
        name: "Cryo-Cooling Jacket Array (Left)",
        description: "Liquid nitrogen cooled fin array to maintain T1 temperature.",
        material: "Chrome",
        function: "Heat dissipation.",
        assemblyOrder: 7,
        connections: ["Left Power & Cooling Terminal"],
        failureEffect: "Thermal runaway on left node.",
        cascadeFailures: ["Rod liquefaction"],
        originalPosition: { x: 0, y: 5, z: 0 },
        explodedPosition: { x: -15, y: 20, z: -10 }
    });
    
    parts.push({
        name: "Cryo-Cooling Jacket Array (Right)",
        description: "Liquid nitrogen cooled fin array to maintain T2 temperature.",
        material: "Chrome",
        function: "Heat dissipation.",
        assemblyOrder: 8,
        connections: ["Right Power & Cooling Terminal"],
        failureEffect: "Thermal runaway on right node.",
        cascadeFailures: ["Rod liquefaction"],
        originalPosition: { x: 0, y: 5, z: 0 },
        explodedPosition: { x: 15, y: 20, z: -10 }
    });

    // 8. Power Supply Unit
    const psuGeo = new THREE.BoxGeometry(10, 6, 8);
    const psuMesh = new THREE.Mesh(psuGeo, steel);
    psuMesh.position.set(0, -1, 6);
    group.add(psuMesh);
    
    // PSU details
    const psuScreen = new THREE.Mesh(new THREE.PlaneGeometry(8, 4), screenMaterial);
    psuScreen.position.set(0, -1, 10.01);
    group.add(psuScreen);

    parts.push({
        name: "Ultra-High Amperage DC PSU",
        description: "Provides thousands of amps of DC current necessary to make the Thomson effect measurable on a macroscopic scale.",
        material: "Steel / Silicon",
        function: "Power generation and regulation.",
        assemblyOrder: 4,
        connections: ["CurrentInjectionCables", "BasePlatform"],
        failureEffect: "Current ripple disrupts measurements.",
        cascadeFailures: ["Sensor burnout"],
        originalPosition: { x: 0, y: -1, z: 6 },
        explodedPosition: { x: 0, y: 0, z: 25 }
    });

    // 9. Current Injection Cables (Thick hydraulic-like tubes)
    class CustomCurve extends THREE.Curve {
        constructor(start, end) {
            super();
            this.start = start;
            this.end = end;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const tx = THREE.MathUtils.lerp(this.start.x, this.end.x, t);
            const ty = Math.sin(t * Math.PI) * 4 + THREE.MathUtils.lerp(this.start.y, this.end.y, t);
            const tz = THREE.MathUtils.lerp(this.start.z, this.end.z, t) + (t * (1 - t) * 10);
            return optionalTarget.set(tx, ty, tz);
        }
    }
    const pathL = new CustomCurve(new THREE.Vector3(-10, -1, 6), new THREE.Vector3(-11, 2, 0));
    const tubeGeoL = new THREE.TubeGeometry(pathL, 64, 0.6, 16, false);
    const cableL = new THREE.Mesh(tubeGeoL, rubber);
    group.add(cableL);

    const pathR = new CustomCurve(new THREE.Vector3(10, -1, 6), new THREE.Vector3(11, 2, 0));
    const tubeGeoR = new THREE.TubeGeometry(pathR, 64, 0.6, 16, false);
    const cableR = new THREE.Mesh(tubeGeoR, rubber);
    group.add(cableR);

    parts.push({
        name: "Superconducting Injection Cables",
        description: "Heavily insulated, cryo-cooled cables connecting the PSU to the terminals.",
        material: "Rubber over YBCO Superconductor",
        function: "Current transport.",
        assemblyOrder: 9,
        connections: ["Ultra-High Amperage DC PSU", "Left/Right Terminals"],
        failureEffect: "Cable jacket rupture and cryogen leak.",
        cascadeFailures: ["Short circuit", "Explosion"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -10, z: 15 }
    });

    // 10 & 11. Hydraulic Cooling Pumps and Coolant Piping
    const pumpGeo = new THREE.CylinderGeometry(1.5, 1.5, 4, 32);
    const pumpL = new THREE.Mesh(pumpGeo, chrome);
    pumpL.position.set(-14, -2, -6);
    group.add(pumpL);
    
    const pumpR = new THREE.Mesh(pumpGeo, chrome);
    pumpR.position.set(14, -2, -6);
    group.add(pumpR);

    parts.push({
        name: "Cryogen Recirculation Pumps",
        description: "Industrial pumps circulating liquid coolant to the cooling jackets.",
        material: "Chrome/Steel",
        function: "Coolant flow management.",
        assemblyOrder: 10,
        connections: ["Cryo-Cooling Jacket Array"],
        failureEffect: "Coolant stagnation.",
        cascadeFailures: ["Terminal overheating", "Boil-off event"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -15, z: -15 }
    });

    // 12. Thermal Sensor Array
    const sensorGroup = new THREE.Group();
    for (let i = 0; i < 15; i++) {
        const sensorArm = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3, 0.2), steel);
        const xPos = -7 + i;
        if(xPos === 0) continue; // skip center heater
        sensorArm.position.set(xPos, 8, 0);
        
        const sensorHead = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), glass);
        sensorHead.position.set(xPos, 6.5, 0);
        
        sensorGroup.add(sensorArm);
        sensorGroup.add(sensorHead);
    }
    group.add(sensorGroup);

    parts.push({
        name: "Interferometric Thermal Sensor Array",
        description: "High-precision laser sensors measuring the micro-fluctuations in heat caused by the Thomson effect.",
        material: "Steel / Glass",
        function: "Temperature gradient logging.",
        assemblyOrder: 11,
        connections: ["DataTelemetryModule"],
        failureEffect: "Loss of experimental data.",
        cascadeFailures: ["Calibration failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 0 }
    });

    // 13. Data Telemetry Module
    const telemetryGeo = new THREE.BoxGeometry(4, 2, 2);
    const telemetryMesh = new THREE.Mesh(telemetryGeo, plastic);
    telemetryMesh.position.set(0, 10, 0);
    group.add(telemetryMesh);

    parts.push({
        name: "Data Telemetry Module",
        description: "Processes thermal readouts and coordinates with the main control systems.",
        material: "Plastic/Silicon",
        function: "Data processing.",
        assemblyOrder: 12,
        connections: ["Interferometric Thermal Sensor Array"],
        failureEffect: "Data corruption.",
        cascadeFailures: ["Misinterpreted Thomson coefficient"],
        originalPosition: { x: 0, y: 10, z: 0 },
        explodedPosition: { x: 0, y: 25, z: 0 }
    });

    // 14. Glass Containment Chamber
    const chamberGeo = new THREE.CylinderGeometry(4, 4, 24, 32, 1, false, 0, Math.PI);
    const chamberMesh = new THREE.Mesh(chamberGeo, tinted);
    chamberMesh.rotation.z = Math.PI / 2;
    chamberMesh.rotation.x = -Math.PI / 2;
    chamberMesh.position.set(0, 5, 0);
    group.add(chamberMesh);

    // Hydraulic Pistons for containment dome lifting mechanism
    const pistonBaseGeo = new THREE.CylinderGeometry(0.4, 0.4, 4, 16);
    const pistonRodGeo = new THREE.CylinderGeometry(0.2, 0.2, 4, 16);
    for(let pos of [-8, 8]) {
        const pBaseFront = new THREE.Mesh(pistonBaseGeo, darkSteel);
        pBaseFront.position.set(pos, 0, 4);
        group.add(pBaseFront);
        
        const pRodFront = new THREE.Mesh(pistonRodGeo, chrome);
        pRodFront.position.set(pos, 2, 4);
        group.add(pRodFront);
        
        const pBaseBack = new THREE.Mesh(pistonBaseGeo, darkSteel);
        pBaseBack.position.set(pos, 0, -4);
        group.add(pBaseBack);
        
        const pRodBack = new THREE.Mesh(pistonRodGeo, chrome);
        pRodBack.position.set(pos, 2, -4);
        group.add(pRodBack);
    }

    parts.push({
        name: "Vacuum Containment Dome",
        description: "Protects the experiment from ambient air currents and allows for a high-vacuum environment.",
        material: "Tinted Borosilicate Glass",
        function: "Environmental isolation.",
        assemblyOrder: 13,
        connections: ["BasePlatform", "VacuumPumpSystem"],
        failureEffect: "Convective heat loss ruins the thermal gradient.",
        cascadeFailures: ["Experiment invalidation"],
        originalPosition: { x: 0, y: 5, z: 0 },
        explodedPosition: { x: 0, y: 10, z: 20 }
    });

    // 15. Neon Status Indicators
    const neonGroup = new THREE.Group();
    const neonGeo = new THREE.TubeGeometry(new CustomCurve(new THREE.Vector3(-12, 1, 3), new THREE.Vector3(12, 1, 3)), 64, 0.1, 8, false);
    const neonMesh = new THREE.Mesh(neonGeo, currentGlowMaterial);
    neonGroup.add(neonMesh);
    group.add(neonGroup);

    parts.push({
        name: "Photon-Plasma Current Indicator",
        description: "A strip that pulses visually to indicate the direction and magnitude of the electric current.",
        material: "Plasma in Glass Tube",
        function: "Visual feedback of current flow.",
        assemblyOrder: 14,
        connections: ["PowerSupplyUnit"],
        failureEffect: "Visual readout fails.",
        cascadeFailures: ["Operator confusion"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 15 }
    });

    // 16. Vacuum Pump System
    const vacPumpGeo = new THREE.BoxGeometry(6, 4, 6);
    const vacPumpMesh = new THREE.Mesh(vacPumpGeo, darkSteel);
    vacPumpMesh.position.set(0, -3, -6);
    group.add(vacPumpMesh);

    parts.push({
        name: "Turbomolecular Vacuum Pump",
        description: "Extracts atmosphere from the containment chamber to prevent convective cooling.",
        material: "Dark Steel",
        function: "Vacuum generation.",
        assemblyOrder: 15,
        connections: ["Vacuum Containment Dome", "BasePlatform"],
        failureEffect: "Loss of vacuum.",
        cascadeFailures: ["Thermal sensor drift"],
        originalPosition: { x: 0, y: -3, z: -6 },
        explodedPosition: { x: 0, y: -15, z: -25 }
    });
    
    // 17. Diagnostic Control Panel
    const panelGeo = new THREE.BoxGeometry(12, 5, 2);
    const panelMesh = new THREE.Mesh(panelGeo, plastic);
    panelMesh.position.set(0, -6, 11);
    panelMesh.rotation.x = -Math.PI / 6;
    group.add(panelMesh);
    
    const screenGeo1 = new THREE.PlaneGeometry(3, 2);
    const screenMesh1 = new THREE.Mesh(screenGeo1, screenMaterial);
    screenMesh1.position.set(-3, -5.5, 12.01);
    screenMesh1.rotation.x = -Math.PI / 6;
    group.add(screenMesh1);
    
    const screenGeo2 = new THREE.PlaneGeometry(3, 2);
    const screenMesh2 = new THREE.Mesh(screenGeo2, screenMaterial);
    screenMesh2.position.set(3, -5.5, 12.01);
    screenMesh2.rotation.x = -Math.PI / 6;
    group.add(screenMesh2);

    // Dials and buttons on panel
    const dialGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
    for(let i=0; i<4; i++) {
        const dial = new THREE.Mesh(dialGeo, chrome);
        dial.position.set(-1 + i, -6.5, 12.5);
        dial.rotation.x = -Math.PI / 6;
        dial.rotation.z = Math.PI / 2;
        group.add(dial);
    }

    parts.push({
        name: "Diagnostic Control Panel",
        description: "Advanced multi-screen interface for monitoring thermal gradients, current flow, and vacuum levels.",
        material: "Reinforced Plastic / Glass",
        function: "User interface and system control.",
        assemblyOrder: 16,
        connections: ["DataTelemetryModule", "PowerSupplyUnit"],
        failureEffect: "Loss of manual control.",
        cascadeFailures: ["Inability to SCRAM the system"],
        originalPosition: { x: 0, y: -6, z: 11 },
        explodedPosition: { x: 0, y: -15, z: 30 }
    });

    // Particles for heat flow / current visualization
    const particleCount = 200;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);
    
    for(let i=0; i<particleCount; i++) {
        particlePositions[i*3] = (Math.random() - 0.5) * 18; // x
        particlePositions[i*3+1] = 5 + (Math.random() - 0.5) * 1.5; // y
        particlePositions[i*3+2] = (Math.random() - 0.5) * 1.5; // z
        particleSpeeds[i] = Math.random() * 0.1 + 0.05;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
        color: 0x00ffff,
        size: 0.2,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    group.add(particleSystem);

    const description = "The Thomson Effect Demonstration Apparatus is a hyper-advanced, industrial-grade rig designed to visualize the Thomson effect: the evolution or absorption of heat when an electric current passes through a circuit of a single material that has a temperature gradient along its length. Featuring massive cryo-cooled terminals, high-vacuum containment, interferometric thermal sensors, and thousands of amps of DC current.";

    const quizQuestions = [
        {
            question: "What does the Thomson effect describe?",
            options: [
                "Heat absorption or evolution when current flows through a material with a temperature gradient.",
                "Voltage generated by joining two different metals.",
                "Cooling effect when current flows across a junction of two metals.",
                "Resistance increase with temperature."
            ],
            correctAnswer: 0,
            explanation: "The Thomson effect is the heating or cooling of a current-carrying conductor with a temperature gradient."
        },
        {
            question: "Why is the central heating coil necessary in this apparatus?",
            options: [
                "To melt the conductor.",
                "To establish the required temperature gradient (Delta T).",
                "To increase electrical resistance to infinity.",
                "To generate the electric current."
            ],
            correctAnswer: 1,
            explanation: "The Thomson effect requires both an electric current and a temperature gradient to occur."
        },
        {
            question: "What is the purpose of the vacuum containment dome?",
            options: [
                "To prevent the electric current from arcing to the room.",
                "To prevent convective heat loss which would ruin the delicate thermal gradient.",
                "To compress the Bismuth-Antimony rod.",
                "To look cool."
            ],
            correctAnswer: 1,
            explanation: "Convection from ambient air would cause unpredictable cooling, ruining the precise measurement of heat absorption/evolution."
        },
        {
            question: "If current flows from the cold end to the hot end in a material with a positive Thomson coefficient, what happens?",
            options: [
                "Heat is absorbed (cooling).",
                "Heat is evolved (heating).",
                "The material becomes superconducting.",
                "No thermal change occurs."
            ],
            correctAnswer: 1,
            explanation: "In materials with a positive Thomson coefficient (like copper), current flowing against the thermal gradient (cold to hot) results in heat evolution."
        },
        {
            question: "Which component prevents the terminals from melting under extreme temperatures and high current?",
            options: [
                "The Data Telemetry Module.",
                "The Cryo-Cooling Jacket Array and Recirculation Pumps.",
                "The Vacuum Dome.",
                "The Interferometric Sensors."
            ],
            correctAnswer: 1,
            explanation: "The Cryo-Cooling Jackets extract excess heat from the terminals using liquid coolant to maintain the cold ends of the gradient."
        }
    ];

    // Animation variables
    let currentFlowDirection = 1; // 1 or -1
    let pulseTime = 0;

    function animate(time, speed, meshes) {
        // Rotate cooling jacket fins slowly
        jacketGroupL.rotation.x = time * 2 * speed;
        jacketGroupR.rotation.x = time * 2 * speed;
        
        // Pulse heating coils
        const heatIntensity = (Math.sin(time * 5 * speed) * 0.5 + 0.5);
        heatGlowMaterial.emissiveIntensity = 2.0 + heatIntensity;
        
        // Neon indicator pulsing
        pulseTime += speed * 0.1;
        currentGlowMaterial.emissiveIntensity = (Math.sin(pulseTime * 20) * 0.5 + 0.5) * 3.0;
        
        // Animate particles (representing electrons / current)
        const positions = particleSystem.geometry.attributes.position.array;
        for(let i=0; i<particleCount; i++) {
            positions[i*3] += particleSpeeds[i] * speed * currentFlowDirection * 10;
            
            // Wrap around
            if (currentFlowDirection > 0 && positions[i*3] > 9) {
                positions[i*3] = -9;
            } else if (currentFlowDirection < 0 && positions[i*3] < -9) {
                positions[i*3] = 9;
            }
            
            // Alter particle color based on position (cold to hot to cold)
            // Hot is center (x=0), Cold is edges (x = -9, x = 9)
            const xPos = positions[i*3];
            const distFromCenter = Math.abs(xPos);
            // We can't easily change individual particle colors without a color attribute, 
            // but we can adjust Y position to create a 'swirl' based on heat.
            positions[i*3+1] = 5 + Math.sin(time * 10 + i) * (1 - distFromCenter/10); 
        }
        particleSystem.geometry.attributes.position.needsUpdate = true;

        // Animate data telemetry screens
        screenMaterial.emissiveIntensity = Math.random() * 0.5 + 0.2;
        screenMesh1.material.emissiveIntensity = Math.random() * 0.5 + 0.2;
        screenMesh2.material.emissiveIntensity = Math.random() * 0.5 + 0.2;
        
        // Animate thermal sensor heads scanning
        sensorGroup.children.forEach((child, index) => {
            if (child.geometry.type === "SphereGeometry") {
                child.position.y = 6.5 + Math.sin(time * 3 * speed + index) * 0.2;
            }
        });
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createThomsonEffectDemo() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
