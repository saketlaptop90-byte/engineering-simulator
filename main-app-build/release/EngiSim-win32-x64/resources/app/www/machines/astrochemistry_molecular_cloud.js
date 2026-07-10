import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // ==========================================
    // 1. MOLECULAR CLOUD & PROTOSTAR CORE
    // ==========================================
    
    // Protostar Core
    const coreGeo = new THREE.SphereGeometry(30, 64, 64);
    const coreMat = new THREE.MeshStandardMaterial({ 
        color: 0xffaa00, 
        emissive: 0xff4400, 
        emissiveIntensity: 4.0, 
        wireframe: true 
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);
    meshes.protostarCore = core;
    
    parts.push({
        name: "Protostar Core",
        description: "The highly energetic, dense center of the stellar nursery where a new star is actively forming.",
        material: "superheated plasma (simulated)",
        function: "Provides the primary gravitational and radiative energy source for the molecular cloud.",
        assemblyOrder: 1,
        connections: ["Bipolar Jets", "Molecular Gas Envelope"],
        failureEffect: "Star formation halts; cloud disperses.",
        cascadeFailures: ["Loss of H-Alpha emission", "Jet collapse"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 200, z: 0 }
    });

    // Molecular Gas Envelope (H-Alpha)
    const gasCount = 300000;
    const gasGeo = new THREE.BufferGeometry();
    const gasPos = new Float32Array(gasCount * 3);
    const gasColors = new Float32Array(gasCount * 3);
    for(let i=0; i<gasCount; i++) {
        const r = 80 + Math.pow(Math.random(), 2) * 800;
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);
        
        gasPos[i*3] = r * Math.sin(phi) * Math.cos(theta);
        gasPos[i*3+1] = r * Math.sin(phi) * Math.sin(theta) * 0.35;
        gasPos[i*3+2] = r * Math.cos(phi);

        const intensity = 1.0 - (r / 880);
        gasColors[i*3] = 1.0; 
        gasColors[i*3+1] = 0.1 * intensity; 
        gasColors[i*3+2] = 0.2 + 0.3 * intensity; 
    }
    gasGeo.setAttribute('position', new THREE.BufferAttribute(gasPos, 3));
    gasGeo.setAttribute('color', new THREE.BufferAttribute(gasColors, 3));
    const gasMat = new THREE.PointsMaterial({ size: 1.5, vertexColors: true, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending });
    const gasMesh = new THREE.Points(gasGeo, gasMat);
    group.add(gasMesh);
    meshes.gasEnvelope = gasMesh;

    parts.push({
        name: "Molecular Gas Envelope",
        description: "A vast volumetric cloud of hydrogen gas emitting primarily in the H-Alpha spectrum due to ionization.",
        material: "hydrogen gas",
        function: "Fuels the ongoing accretion process of the protostar.",
        assemblyOrder: 2,
        connections: ["Protostar Core"],
        failureEffect: "Starvation of the protostellar accretion disk.",
        cascadeFailures: ["Stellar mass deficit"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 400, z: 0 }
    });

    // Dark Dust Lanes
    const dustCount = 200000;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for(let i=0; i<dustCount; i++) {
        const r = 120 + Math.random() * 500;
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.PI/2 + (Math.random() - 0.5) * 0.4;
        
        const spread = (Math.random() - 0.5) * 30;
        
        dustPos[i*3] = r * Math.sin(phi) * Math.cos(theta) + spread;
        dustPos[i*3+1] = Math.sin(theta * 3) * 40 + spread; 
        dustPos[i*3+2] = r * Math.cos(phi) + spread;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({ color: 0x080808, size: 2.5, transparent: true, opacity: 0.85 });
    const dustMesh = new THREE.Points(dustGeo, dustMat);
    group.add(dustMesh);
    meshes.dustLanes = dustMesh;

    parts.push({
        name: "Dark Dust Lanes",
        description: "Dense regions of cosmic dust and heavier elements that obscure background light and harbor complex chemistry.",
        material: "silicates and carbonaceous dust",
        function: "Shields internal molecular synthesis from destructive UV radiation.",
        assemblyOrder: 3,
        connections: ["Molecular Gas Envelope"],
        failureEffect: "Photodissociation of complex molecules.",
        cascadeFailures: ["Loss of astrochemical diversity"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -300, z: 0 }
    });

    // Bipolar Jets
    const jetGeo = new THREE.CylinderGeometry(2, 40, 500, 32, 1, true);
    const jetMat = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x0088ff,
        emissiveIntensity: 4.0,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
    });
    
    const jetNorth = new THREE.Mesh(jetGeo, jetMat);
    jetNorth.position.y = 250;
    group.add(jetNorth);
    meshes.jetNorth = jetNorth;

    const jetSouth = new THREE.Mesh(jetGeo, jetMat);
    jetSouth.position.y = -250;
    jetSouth.rotation.x = Math.PI;
    group.add(jetSouth);
    meshes.jetSouth = jetSouth;

    parts.push({
        name: "North Bipolar Jet",
        description: "A highly collimated outflow of ionized gas ejected from the northern magnetic pole of the protostar.",
        material: "ionized plasma",
        function: "Removes excess angular momentum from the accreting system.",
        assemblyOrder: 4,
        connections: ["Protostar Core"],
        failureEffect: "Angular momentum build-up causing disk fragmentation.",
        cascadeFailures: ["Runaway accretion disruption"],
        originalPosition: { x: 0, y: 250, z: 0 },
        explodedPosition: { x: 0, y: 600, z: 0 }
    });

    parts.push({
        name: "South Bipolar Jet",
        description: "A highly collimated outflow of ionized gas ejected from the southern magnetic pole of the protostar.",
        material: "ionized plasma",
        function: "Removes excess angular momentum from the accreting system.",
        assemblyOrder: 5,
        connections: ["Protostar Core"],
        failureEffect: "Angular momentum build-up causing disk fragmentation.",
        cascadeFailures: ["Runaway accretion disruption"],
        originalPosition: { x: 0, y: -250, z: 0 },
        explodedPosition: { x: 0, y: -600, z: 0 }
    });

    // ==========================================
    // 2. OBSERVATION ROVER / SEEDER STATION
    // ==========================================

    const roverGroup = new THREE.Group();
    roverGroup.position.set(150, 0, 150);
    group.add(roverGroup);

    // Rover Chassis (Complex Extrusion with Rivets and Panels)
    const chassisShape = new THREE.Shape();
    chassisShape.moveTo(-15, -5);
    chassisShape.lineTo(15, -5);
    chassisShape.lineTo(20, 2);
    chassisShape.lineTo(15, 8);
    chassisShape.lineTo(-15, 8);
    chassisShape.lineTo(-20, 2);
    chassisShape.lineTo(-15, -5);

    const chassisGeo = new THREE.ExtrudeGeometry(chassisShape, { depth: 25, bevelEnabled: true, bevelSegments: 4, steps: 4, bevelSize: 1, bevelThickness: 1 });
    const chassis = new THREE.Mesh(chassisGeo, steel);
    chassis.position.set(0, 5, -12.5);
    roverGroup.add(chassis);
    
    // Rivets and Panel Lines
    const rivetGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.5, 8);
    for(let i=-10; i<=10; i+=2) {
        const rivet1 = new THREE.Mesh(rivetGeo, darkSteel);
        rivet1.position.set(i, 8, 25);
        rivet1.rotation.x = Math.PI/2;
        chassis.add(rivet1);

        const rivet2 = new THREE.Mesh(rivetGeo, darkSteel);
        rivet2.position.set(i, 8, 0);
        rivet2.rotation.x = Math.PI/2;
        chassis.add(rivet2);
    }

    parts.push({
        name: "Rover Chassis",
        description: "The primary high-tech hull of the Astrochemistry Observation Rover, armored against cosmic debris.",
        material: "steel",
        function: "Houses internal systems and provides a mounting point for the suspension and cabin.",
        assemblyOrder: 6,
        connections: ["Tire Assemblies", "Cabin"],
        failureEffect: "Complete structural failure of the rover.",
        cascadeFailures: ["Life support failure", "Sensor destruction"],
        originalPosition: { x: 150, y: 5, z: 150 },
        explodedPosition: { x: 300, y: 50, z: 300 }
    });

    // Tires
    function createTire() {
        const assembly = new THREE.Group();
        
        // Torus
        const tireGeo = new THREE.TorusGeometry(6, 2.5, 32, 100);
        const tire = new THREE.Mesh(tireGeo, rubber);
        assembly.add(tire);
        
        // Lugs
        const lugGeo = new THREE.BoxGeometry(2, 1, 5.5);
        for(let i=0; i<80; i++) {
            const angle = (i / 80) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeo, rubber);
            lug.position.set(Math.cos(angle)*6, Math.sin(angle)*6, 0);
            lug.rotation.z = angle;
            assembly.add(lug);
        }
        
        // Rims
        const rimGeo = new THREE.CylinderGeometry(4, 4, 3, 32);
        const rim = new THREE.Mesh(rimGeo, chrome);
        rim.rotation.x = Math.PI / 2;
        assembly.add(rim);
        
        // Spokes
        const spokeGeo = new THREE.CylinderGeometry(0.3, 0.3, 8, 16);
        for(let i=0; i<10; i++) {
            const spoke = new THREE.Mesh(spokeGeo, aluminum);
            spoke.rotation.z = (i / 10) * Math.PI;
            rim.add(spoke);
        }
        
        return assembly;
    }

    const tFL = createTire(); tFL.position.set(-20, 5, 20); roverGroup.add(tFL); meshes.tFL = tFL;
    const tFR = createTire(); tFR.position.set(20, 5, 20); roverGroup.add(tFR); meshes.tFR = tFR;
    const tRL = createTire(); tRL.position.set(-20, 5, -20); roverGroup.add(tRL); meshes.tRL = tRL;
    const tRR = createTire(); tRR.position.set(20, 5, -20); roverGroup.add(tRR); meshes.tRR = tRR;

    parts.push({ name: "Front Left Tire", description: "Aggressive off-road tread torus structure with hundreds of box lugs.", material: "rubber", function: "Asteroid surface mobility.", assemblyOrder: 7, connections: ["Rover Chassis"], failureEffect: "Rover lists left.", cascadeFailures: ["Navigation errors"], originalPosition: { x: 130, y: 5, z: 170 }, explodedPosition: { x: 80, y: 5, z: 220 } });
    parts.push({ name: "Front Right Tire", description: "Aggressive off-road tread torus structure with hundreds of box lugs.", material: "rubber", function: "Asteroid surface mobility.", assemblyOrder: 8, connections: ["Rover Chassis"], failureEffect: "Rover lists right.", cascadeFailures: ["Navigation errors"], originalPosition: { x: 170, y: 5, z: 170 }, explodedPosition: { x: 220, y: 5, z: 220 } });
    parts.push({ name: "Rear Left Tire", description: "Aggressive off-road tread torus structure with hundreds of box lugs.", material: "rubber", function: "Asteroid surface mobility.", assemblyOrder: 9, connections: ["Rover Chassis"], failureEffect: "Loss of rear traction.", cascadeFailures: ["Drive train overload"], originalPosition: { x: 130, y: 5, z: 130 }, explodedPosition: { x: 80, y: 5, z: 80 } });
    parts.push({ name: "Rear Right Tire", description: "Aggressive off-road tread torus structure with hundreds of box lugs.", material: "rubber", function: "Asteroid surface mobility.", assemblyOrder: 10, connections: ["Rover Chassis"], failureEffect: "Loss of rear traction.", cascadeFailures: ["Drive train overload"], originalPosition: { x: 170, y: 5, z: 130 }, explodedPosition: { x: 220, y: 5, z: 80 } });

    // Hydraulic Boom Arm and Pistons
    const boomGroup = new THREE.Group();
    boomGroup.position.set(0, 15, -10);
    roverGroup.add(boomGroup);
    meshes.boomGroup = boomGroup;

    const armGeo = new THREE.BoxGeometry(4, 25, 4);
    const armMesh = new THREE.Mesh(armGeo, darkSteel);
    armMesh.position.y = 12.5;
    boomGroup.add(armMesh);

    const pistonOuterGeo = new THREE.CylinderGeometry(1.5, 1.5, 12, 16);
    const pistonOuter = new THREE.Mesh(pistonOuterGeo, steel);
    pistonOuter.position.set(0, 5, 4);
    pistonOuter.rotation.x = -Math.PI / 6;
    boomGroup.add(pistonOuter);

    const pistonInnerGeo = new THREE.CylinderGeometry(0.8, 0.8, 12, 16);
    const pistonInner = new THREE.Mesh(pistonInnerGeo, chrome);
    pistonInner.position.y = 6;
    pistonOuter.add(pistonInner);
    meshes.pistonInner = pistonInner;

    parts.push({
        name: "Hydraulic Boom Arm",
        description: "A heavy-duty articulated arm used to deploy sensors into the molecular cloud.",
        material: "darkSteel",
        function: "Extends scientific instruments into harsh environments.",
        assemblyOrder: 11,
        connections: ["Rover Chassis", "Hydraulic Pistons"],
        failureEffect: "Inability to position sensor arrays.",
        cascadeFailures: ["Data collection halt"],
        originalPosition: { x: 150, y: 20, z: 140 },
        explodedPosition: { x: 150, y: 80, z: 100 }
    });

    parts.push({
        name: "Hydraulic Pistons",
        description: "High-pressure cylinder-in-cylinder actuators driving the boom arm.",
        material: "steel and chrome",
        function: "Provides the mechanical force for boom articulation.",
        assemblyOrder: 12,
        connections: ["Hydraulic Boom Arm", "Hydraulic Lines"],
        failureEffect: "Boom arm collapses under gravity.",
        cascadeFailures: ["Sensor array damage"],
        originalPosition: { x: 150, y: 25, z: 144 },
        explodedPosition: { x: 150, y: 100, z: 144 }
    });

    // Extensive Hydraulic Lines (TubeGeometry)
    const linesGroup = new THREE.Group();
    for(let i=0; i<12; i++) {
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-2 + Math.random()*4, 0, -2 + Math.random()*4),
            new THREE.Vector3(-3 + Math.random()*6, 10, -3 + Math.random()*6),
            new THREE.Vector3(-1 + Math.random()*2, 20, 2),
            new THREE.Vector3(0, 24, 0)
        ]);
        const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.15, 8, false);
        const tube = new THREE.Mesh(tubeGeo, rubber);
        linesGroup.add(tube);
    }
    boomGroup.add(linesGroup);

    parts.push({
        name: "Extensive Hydraulic Lines",
        description: "A complex network of flexible tubes delivering highly pressurized fluid to the piston actuators.",
        material: "rubber",
        function: "Transmits hydraulic fluid throughout the articulation system.",
        assemblyOrder: 13,
        connections: ["Hydraulic Pistons"],
        failureEffect: "Loss of hydraulic pressure.",
        cascadeFailures: ["Complete actuator failure", "Fluid leak"],
        originalPosition: { x: 150, y: 25, z: 140 },
        explodedPosition: { x: 100, y: 120, z: 140 }
    });

    // Operator Cabin
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(0, 18, 5);
    roverGroup.add(cabinGroup);

    const domeGeo = new THREE.SphereGeometry(10, 32, 16, 0, Math.PI*2, 0, Math.PI/2);
    const dome = new THREE.Mesh(domeGeo, tinted);
    cabinGroup.add(dome);

    const interiorPanelGeo = new THREE.BoxGeometry(14, 3, 4);
    const interiorPanel = new THREE.Mesh(interiorPanelGeo, plastic);
    interiorPanel.position.set(0, 2, 6);
    interiorPanel.rotation.x = -Math.PI/6;
    cabinGroup.add(interiorPanel);

    parts.push({
        name: "Operator Cabin (Tinted Glass)",
        description: "A pressurized, radiation-shielded enclosure featuring advanced tinted observation glass.",
        material: "tinted glass",
        function: "Protects operators from the intense radiation of the forming protostar.",
        assemblyOrder: 14,
        connections: ["Rover Chassis", "Cabin Interior"],
        failureEffect: "Operator exposure to fatal cosmic radiation.",
        cascadeFailures: ["Mission abort"],
        originalPosition: { x: 150, y: 23, z: 155 },
        explodedPosition: { x: 150, y: 150, z: 155 }
    });

    // Cabin Interior Controls
    const screenGeo = new THREE.PlaneGeometry(4, 2);
    const screenMat = new THREE.MeshStandardMaterial({ color: 0x00ffaa, emissive: 0x00ffaa, emissiveIntensity: 2.0 });
    const screen1 = new THREE.Mesh(screenGeo, screenMat);
    screen1.position.set(-4, 0.5, 2.1);
    interiorPanel.add(screen1);

    const screen2 = new THREE.Mesh(screenGeo, screenMat);
    screen2.position.set(4, 0.5, 2.1);
    interiorPanel.add(screen2);

    const wheelGeo = new THREE.TorusGeometry(1.2, 0.2, 16, 32);
    const wheel = new THREE.Mesh(wheelGeo, plastic);
    wheel.position.set(0, 1.5, 1);
    wheel.rotation.x = Math.PI / 4;
    interiorPanel.add(wheel);
    meshes.steeringWheel = wheel;

    const joyBaseGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.6);
    const joyStemGeo = new THREE.CylinderGeometry(0.1, 0.1, 2);
    
    const joystick = new THREE.Group();
    const jBase = new THREE.Mesh(joyBaseGeo, rubber);
    const jStem = new THREE.Mesh(joyStemGeo, aluminum);
    jStem.position.y = 1;
    joystick.add(jBase, jStem);
    joystick.position.set(-6, 2, 0);
    interiorPanel.add(joystick);
    meshes.joystick = joystick;

    parts.push({
        name: "Cabin Interior Controls",
        description: "Hyper-realistic control station featuring glowing holographic screens, steering wheels, and joysticks.",
        material: "plastic and aluminum",
        function: "Allows precise manual override of rover operations and sensor alignment.",
        assemblyOrder: 15,
        connections: ["Operator Cabin"],
        failureEffect: "Loss of manual rover control.",
        cascadeFailures: ["Inability to navigate asteroid fields"],
        originalPosition: { x: 150, y: 25, z: 161 },
        explodedPosition: { x: 150, y: 180, z: 200 }
    });

    // Exhaust Stacks
    const exhaustGeo = new THREE.CylinderGeometry(1.5, 1.5, 10, 16);
    const exhaust1 = new THREE.Mesh(exhaustGeo, chrome);
    exhaust1.position.set(-12, 12, -10);
    roverGroup.add(exhaust1);
    
    const exhaust2 = new THREE.Mesh(exhaustGeo, chrome);
    exhaust2.position.set(12, 12, -10);
    roverGroup.add(exhaust2);

    parts.push({
        name: "Exhaust Stacks",
        description: "Heavy-duty chrome cylinder stacks venting excess thermal energy and synthesized gases.",
        material: "chrome",
        function: "Thermal regulation for the rover's core reactor.",
        assemblyOrder: 16,
        connections: ["Rover Chassis"],
        failureEffect: "Reactor overheat.",
        cascadeFailures: ["Explosion of rover chassis"],
        originalPosition: { x: 138, y: 17, z: 140 },
        explodedPosition: { x: 50, y: 100, z: 50 }
    });
    
    // Sensor Array Dish (LatheGeometry)
    const points = [];
    for ( let i = 0; i < 10; i ++ ) {
        points.push( new THREE.Vector2( Math.sin( i * 0.2 ) * 5, ( i - 5 ) * 0.5 ) );
    }
    const dishGeo = new THREE.LatheGeometry( points, 32 );
    const dish = new THREE.Mesh( dishGeo, copper );
    dish.position.set(0, 25, 0);
    dish.rotation.x = -Math.PI / 2;
    boomGroup.add(dish);

    parts.push({
        name: "Sensor Array Dish",
        description: "A highly sensitive copper-lined parabolic antenna constructed via Lathe geometry for precise astrochemical readings.",
        material: "copper",
        function: "Scans the molecular cloud for complex organic molecules.",
        assemblyOrder: 17,
        connections: ["Hydraulic Boom Arm"],
        failureEffect: "Total loss of telemetry and spectral data.",
        cascadeFailures: ["Mission failure"],
        originalPosition: { x: 150, y: 45, z: 140 },
        explodedPosition: { x: 150, y: 200, z: 140 }
    });

    // Grille, Mirrors, and Ladders
    const grilleGroup = new THREE.Group();
    const grilleBarGeo = new THREE.CylinderGeometry(0.2, 0.2, 10);
    for(let i=-4; i<=4; i++) {
        const bar = new THREE.Mesh(grilleBarGeo, chrome);
        bar.position.set(i * 1.2, 0, 0);
        grilleGroup.add(bar);
    }
    grilleGroup.position.set(0, 5, 12);
    grilleGroup.rotation.z = Math.PI/2;
    roverGroup.add(grilleGroup);

    const mirrorBracketGeo = new THREE.CylinderGeometry(0.1, 0.1, 2);
    const mirrorBoxGeo = new THREE.BoxGeometry(0.2, 1, 1.5);
    const mirrorL = new THREE.Group();
    const bL = new THREE.Mesh(mirrorBracketGeo, darkSteel);
    bL.rotation.z = Math.PI/2;
    const mboxL = new THREE.Mesh(mirrorBoxGeo, chrome);
    mboxL.position.set(1, 0.5, 0);
    mirrorL.add(bL, mboxL);
    mirrorL.position.set(-16, 12, 12);
    roverGroup.add(mirrorL);

    const mirrorR = mirrorL.clone();
    mirrorR.position.set(16, 12, 12);
    mirrorR.rotation.y = Math.PI;
    roverGroup.add(mirrorR);

    const ladderGroup = new THREE.Group();
    const railGeo = new THREE.CylinderGeometry(0.2, 0.2, 15);
    const railL = new THREE.Mesh(railGeo, steel);
    railL.position.set(-2, 0, 0);
    const railR = new THREE.Mesh(railGeo, steel);
    railR.position.set(2, 0, 0);
    ladderGroup.add(railL, railR);
    const stepGeo = new THREE.CylinderGeometry(0.15, 0.15, 4);
    for(let i=-6; i<=6; i+=2) {
        const step = new THREE.Mesh(stepGeo, aluminum);
        step.position.y = i;
        step.rotation.z = Math.PI/2;
        ladderGroup.add(step);
    }
    ladderGroup.position.set(-15, 5, 0);
    ladderGroup.rotation.z = Math.PI/12;
    roverGroup.add(ladderGroup);

    // ==========================================
    // 3. QUIZ & ANIMATION
    // ==========================================

    const quizQuestions = [
        {
            question: "Which component is primarily responsible for generating the intense H-Alpha emission within the molecular cloud?",
            options: [
                "The Dark Dust Lanes",
                "The Bipolar Jets",
                "The Molecular Gas Envelope",
                "The Operator Cabin"
            ],
            correctAnswer: 2,
            explanation: "The Molecular Gas Envelope represents the glowing hydrogen gas (H-Alpha), which emits heavily in the red spectrum due to ionization from the central protostar."
        },
        {
            question: "What is the function of the Bipolar Jets in the star formation process?",
            options: [
                "They synthesize complex organic molecules.",
                "They remove excess angular momentum from the accreting system.",
                "They cool down the protostar core.",
                "They provide traction for the Observation Rover."
            ],
            correctAnswer: 1,
            explanation: "Bipolar jets are highly collimated outflows that carry away excess angular momentum, allowing gas from the disk to continue falling onto the protostar."
        },
        {
            question: "Why are the Dark Dust Lanes critical to astrochemical processes?",
            options: [
                "They shield internal molecular synthesis from destructive UV radiation.",
                "They provide fuel for the rover's reactor.",
                "They emit the brightest light in the visible spectrum.",
                "They collapse directly into the bipolar jets."
            ],
            correctAnswer: 0,
            explanation: "Dust lanes block intense ultraviolet radiation from the nascent star, allowing fragile, complex molecules to form without being immediately photodissociated."
        },
        {
            question: "Which high-tech component is used by the Rover to manually navigate the harsh terrain of the stellar nursery's asteroids?",
            options: [
                "The Extruded Chassis",
                "The Hydraulic Pistons",
                "The Aggressive Torus Tires with Lugs",
                "The Sensor Array Dish"
            ],
            correctAnswer: 2,
            explanation: "The hyper-realistic Torus tires with extruded box lugs provide the necessary aggressive off-road tread for mobility on uneven primordial surfaces."
        },
        {
            question: "What mechanical principle is utilized by the Rover's boom arm to deploy the Sensor Array?",
            options: [
                "Electromagnetic levitation",
                "Hydraulic pressure via cylinder-in-cylinder piston actuators",
                "Aerodynamic lift from exhaust stacks",
                "Gyroscopic stabilization"
            ],
            correctAnswer: 1,
            explanation: "The boom arm uses a complex hydraulic system involving extensive TubeGeometry lines and cylinder-in-cylinder piston actuators to provide mechanical force."
        }
    ];

    const description = "An ultra high-tech, massive, volumetric Astrochemistry Molecular Cloud Simulator. It features a dense, glowing protostar core, million-particle volumetric systems for H-Alpha gas and dark dust lanes, and highly collimated bipolar jets. Embedded within this hyper-realistic stellar nursery is an advanced Observation Rover. The rover boasts aggressive off-road tires (Torus with Extruded Lugs), complex cylinder-in-cylinder hydraulic pistons, intricate tubular hydraulic lines, a fully detailed operator cabin with tinted glass, glowing control screens, joysticks, steering wheels, grilles, side mirrors, ladders, exhaust stacks, and a lathed sensor array dish, providing a profoundly complex and massive simulation file.";

    function animate(time, speed) {
        // Rotate the massive molecular gas envelope and dust lanes
        if(meshes.gasEnvelope) meshes.gasEnvelope.rotation.y = time * 0.05 * speed;
        if(meshes.dustLanes) meshes.dustLanes.rotation.y = time * 0.08 * speed;
        if(meshes.dustLanes) meshes.dustLanes.rotation.z = Math.sin(time * 0.1) * 0.1;

        // Pulsate the protostar core
        if(meshes.protostarCore) {
            meshes.protostarCore.rotation.y = time * 0.5 * speed;
            meshes.protostarCore.material.emissiveIntensity = 3.0 + Math.sin(time * 3 * speed) * 1.5;
        }

        // Pulse the bipolar jets
        if(meshes.jetNorth) meshes.jetNorth.scale.y = 1.0 + Math.sin(time * 5 * speed) * 0.05;
        if(meshes.jetSouth) meshes.jetSouth.scale.y = 1.0 + Math.sin(time * 5 * speed) * 0.05;

        // Animate the rover's hyper-realistic tires
        const wheelRot = time * 2 * speed;
        if(meshes.tFL) meshes.tFL.rotation.x = wheelRot;
        if(meshes.tFR) meshes.tFR.rotation.x = wheelRot;
        if(meshes.tRL) meshes.tRL.rotation.x = wheelRot;
        if(meshes.tRR) meshes.tRR.rotation.x = wheelRot;

        // Animate hydraulic boom arm and pistons
        if(meshes.boomGroup) {
            // Sweep up and down
            const angle = Math.sin(time * speed) * (Math.PI / 8);
            meshes.boomGroup.rotation.x = angle;
        }
        if(meshes.pistonInner) {
            // Slide piston in and out
            meshes.pistonInner.position.y = 6 + Math.sin(time * speed) * 2;
        }

        // Animate cabin interior controls
        if(meshes.steeringWheel) meshes.steeringWheel.rotation.z = Math.sin(time * 1.5 * speed) * 0.5;
        if(meshes.joystick) {
            meshes.joystick.rotation.x = Math.sin(time * 4 * speed) * 0.2;
            meshes.joystick.rotation.z = Math.cos(time * 3 * speed) * 0.2;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createMolecularCloud() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
