import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Emissive Materials
    const neonBlue = new THREE.MeshStandardMaterial({ color: 0x0088ff, emissive: 0x0088ff, emissiveIntensity: 2.0, metalness: 0.8, roughness: 0.2 });
    const neonRed = new THREE.MeshStandardMaterial({ color: 0xff1100, emissive: 0xff1100, emissiveIntensity: 1.5, metalness: 0.8, roughness: 0.2 });
    const neonGreen = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 1.2, metalness: 0.8, roughness: 0.2 });
    const energyGlow = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 5.0, wireframe: true });

    // --- UTILITY SHAPES ---
    const createExtrudedStar = (points, innerRadius, outerRadius, depth) => {
        const shape = new THREE.Shape();
        const angle = Math.PI / points;
        for (let i = 0; i < 2 * points; i++) {
            const r = (i % 2 === 0) ? outerRadius : innerRadius;
            const a = i * angle;
            if (i === 0) shape.moveTo(r * Math.cos(a), r * Math.sin(a));
            else shape.lineTo(r * Math.cos(a), r * Math.sin(a));
        }
        shape.closePath();
        return new THREE.ExtrudeGeometry(shape, { depth: depth, bevelEnabled: true, bevelSegments: 3, steps: 2, bevelSize: 0.5, bevelThickness: 0.5 });
    };

    const createLatheDome = (radius, height, segments) => {
        const points = [];
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            points.push(new THREE.Vector2(radius * Math.cos(t * Math.PI / 2), height * Math.sin(t * Math.PI / 2)));
        }
        return new THREE.LatheGeometry(points, 64);
    };

    // ==========================================
    // 1. EARTH BASE STATION (The Anchor)
    // ==========================================
    const baseStation = new THREE.Group();

    // Ocean Dampening Ring
    const dampRingGeo = new THREE.TorusGeometry(80, 5, 32, 128);
    const dampRing = new THREE.Mesh(dampRingGeo, darkSteel);
    dampRing.rotation.x = Math.PI / 2;
    dampRing.position.y = -10;
    baseStation.add(dampRing);

    // Base Core Platform
    const baseCoreGeo = new THREE.CylinderGeometry(70, 75, 20, 64);
    const baseCore = new THREE.Mesh(baseCoreGeo, steel);
    baseStation.add(baseCore);

    // Intricate Base Support Struts
    const strutGeo = new THREE.CylinderGeometry(1, 1.5, 40, 16);
    for(let i=0; i<32; i++) {
        const angle = (i / 32) * Math.PI * 2;
        const strut = new THREE.Mesh(strutGeo, chrome);
        strut.position.set(Math.cos(angle)*70, -10, Math.sin(angle)*70);
        strut.rotation.x = Math.PI / 4;
        strut.rotation.y = angle;
        baseStation.add(strut);
    }

    // Anchor Matrix Mechanism
    const anchorMatrixGeo = createExtrudedStar(12, 15, 30, 10);
    const anchorMatrix = new THREE.Mesh(anchorMatrixGeo, copper);
    anchorMatrix.rotation.x = Math.PI / 2;
    anchorMatrix.position.y = 5;
    baseStation.add(anchorMatrix);

    // Base Comm Arrays
    for(let i=0; i<4; i++) {
        const commMast = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 1, 15, 8), darkSteel);
        const angle = (i / 4) * Math.PI * 2;
        commMast.position.set(Math.cos(angle)*60, 15, Math.sin(angle)*60);
        const dish = new THREE.Mesh(createLatheDome(5, 2, 16), aluminum);
        dish.position.y = 8;
        dish.rotation.x = -Math.PI / 4;
        commMast.add(dish);
        baseStation.add(commMast);
    }

    group.add(baseStation);
    meshes.baseStation = baseStation;

    // ==========================================
    // 2. THE TETHER (Carbon Nanotube)
    // ==========================================
    const tetherGroup = new THREE.Group();
    const TETHER_LENGTH = 1500; // Simulated scale

    // Main Core
    const mainTetherGeo = new THREE.CylinderGeometry(4, 4, TETHER_LENGTH, 32);
    const mainTether = new THREE.Mesh(mainTetherGeo, steel); // Assuming highly polished carbon/steel look
    mainTether.position.y = TETHER_LENGTH / 2;
    tetherGroup.add(mainTether);

    // Electromagnetic Tracks
    const trackGeo = new THREE.BoxGeometry(1, TETHER_LENGTH, 1.5);
    for(let i=0; i<4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        const track = new THREE.Mesh(trackGeo, darkSteel);
        track.position.set(Math.cos(angle)*4.5, TETHER_LENGTH / 2, Math.sin(angle)*4.5);
        tetherGroup.add(track);

        // Add magnetic pulse rails
        const railGeo = new THREE.CylinderGeometry(0.2, 0.2, TETHER_LENGTH, 8);
        const rail = new THREE.Mesh(railGeo, neonBlue);
        rail.position.set(Math.cos(angle)*5.2, TETHER_LENGTH / 2, Math.sin(angle)*5.2);
        tetherGroup.add(rail);
    }

    // Structural Support Rings along tether
    for(let y=50; y<TETHER_LENGTH; y+=50) {
        const ringGeo = new THREE.TorusGeometry(8, 0.5, 16, 32);
        const ring = new THREE.Mesh(ringGeo, chrome);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = y;
        tetherGroup.add(ring);

        // Ring Warning Lights
        for(let l=0; l<4; l++) {
            const lightGeo = new THREE.BoxGeometry(1, 1, 1);
            const light = new THREE.Mesh(lightGeo, neonRed);
            const a = (l/4) * Math.PI * 2;
            light.position.set(Math.cos(a)*8, y, Math.sin(a)*8);
            tetherGroup.add(light);
            if (!meshes.warningLights) meshes.warningLights = [];
            meshes.warningLights.push(light);
        }
    }

    group.add(tetherGroup);
    meshes.tether = tetherGroup;

    // ==========================================
    // 3. THE CLIMBERS
    // ==========================================
    const createClimber = (isAlpha) => {
        const climberGroup = new THREE.Group();

        // Main Chassis (Intricate Hexagonal Extrusion)
        const chassisGeo = createExtrudedStar(6, 6, 12, 15);
        const chassis = new THREE.Mesh(chassisGeo, isAlpha ? aluminum : darkSteel);
        chassis.rotation.x = Math.PI / 2;
        chassis.position.y = -7.5; // Center it
        climberGroup.add(chassis);

        // Cockpit / Operator Cabin
        const cabinGeo = createLatheDome(5, 6, 32);
        const cabin = new THREE.Mesh(cabinGeo, tinted);
        cabin.position.y = 8;
        climberGroup.add(cabin);

        // Electromagnetic Grippers (4 sides)
        for(let i=0; i<4; i++) {
            const angle = (i / 4) * Math.PI * 2;
            const gripperGrp = new THREE.Group();

            const gripArmGeo = new THREE.BoxGeometry(4, 2, 8);
            const gripArm = new THREE.Mesh(gripArmGeo, steel);
            gripArm.position.z = -5;

            const padGeo = new THREE.CylinderGeometry(1.5, 1.5, 3, 16);
            const pad = new THREE.Mesh(padGeo, rubber);
            pad.rotation.z = Math.PI / 2;
            pad.position.set(0, 0, -9);

            gripperGrp.add(gripArm);
            gripperGrp.add(pad);

            gripperGrp.rotation.y = angle;
            gripperGrp.position.y = 0;
            climberGroup.add(gripperGrp);

            if(!meshes.grippers) meshes.grippers = [];
            meshes.grippers.push(pad);
        }

        // Robotic Manipulator Arms
        const armGroup = new THREE.Group();
        const armBase = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 2, 16), chrome);
        armBase.position.set(10, 0, 0);
        armBase.rotation.x = Math.PI / 2;
        const armSeg1 = new THREE.Mesh(new THREE.BoxGeometry(1.5, 8, 1.5), steel);
        armSeg1.position.y = 4;
        armBase.add(armSeg1);
        const elbow = new THREE.Mesh(new THREE.SphereGeometry(1.2, 16, 16), copper);
        elbow.position.y = 4;
        armSeg1.add(elbow);
        const armSeg2 = new THREE.Mesh(new THREE.BoxGeometry(1, 6, 1), aluminum);
        armSeg2.position.y = 3;
        elbow.add(armSeg2);
        const claw = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 1, 2, 8), darkSteel);
        claw.position.y = 3;
        armSeg2.add(claw);
        armGroup.add(armBase);
        climberGroup.add(armGroup);

        // Solar/Radiator Wings
        const wingGeo = new THREE.BoxGeometry(20, 0.5, 6);
        const wing1 = new THREE.Mesh(wingGeo, glass); // Simulated solar panel
        wing1.position.set(20, -2, 0);
        const wing2 = new THREE.Mesh(wingGeo, glass);
        wing2.position.set(-20, -2, 0);
        climberGroup.add(wing1);
        climberGroup.add(wing2);

        // Thrusters for stabilization
        const thrusterGeo = new THREE.CylinderGeometry(1.5, 0.5, 3, 16);
        for(let i=0; i<4; i++) {
            const angle = (i / 4) * Math.PI * 2;
            const thruster = new THREE.Mesh(thrusterGeo, darkSteel);
            thruster.position.set(Math.cos(angle + Math.PI/4)*10, -8, Math.sin(angle + Math.PI/4)*10);
            const exhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.2, 2, 16), neonBlue);
            exhaust.position.y = -1.5;
            thruster.add(exhaust);
            climberGroup.add(thruster);
        }

        return { group: climberGroup, armBase, elbow, wings: [wing1, wing2] };
    };

    const climberAlphaObj = createClimber(true);
    climberAlphaObj.group.position.y = 100;
    group.add(climberAlphaObj.group);
    meshes.climberAlpha = climberAlphaObj;

    const climberBetaObj = createClimber(false);
    climberBetaObj.group.position.y = TETHER_LENGTH - 100;
    climberBetaObj.group.rotation.y = Math.PI; // Face opposite
    group.add(climberBetaObj.group);
    meshes.climberBeta = climberBetaObj;

    // ==========================================
    // 4. GEOSTATIONARY COUNTERWEIGHT STATION
    // ==========================================
    const station = new THREE.Group();
    station.position.y = TETHER_LENGTH;

    // Core Spire
    const spireGeo = new THREE.CylinderGeometry(15, 20, 100, 64);
    const spire = new THREE.Mesh(spireGeo, steel);
    station.add(spire);

    // Massive Habitation Ring
    const habRingGeo = new THREE.TorusGeometry(120, 15, 64, 128);
    const habRing = new THREE.Mesh(habRingGeo, aluminum);
    habRing.rotation.x = Math.PI / 2;
    station.add(habRing);

    // Habitation Ring Connecting Spokes
    const spokeGeo = new THREE.CylinderGeometry(3, 3, 120, 16);
    for(let i=0; i<6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const spoke = new THREE.Mesh(spokeGeo, darkSteel);
        spoke.rotation.x = Math.PI / 2;
        spoke.rotation.z = angle;
        spoke.position.set(Math.cos(angle)*60, 0, Math.sin(angle)*60);
        habRing.add(spoke); // Attach to hab ring so they rotate together
    }
    meshes.habRing = habRing;

    // Energy/Solar Array Ring (Outer)
    const energyRingGeo = new THREE.TorusGeometry(180, 5, 32, 128);
    const energyRing = new THREE.Mesh(energyRingGeo, darkSteel);
    energyRing.rotation.x = Math.PI / 2;
    station.add(energyRing);

    // Solar Array Panels
    const panelGeo = new THREE.BoxGeometry(20, 1, 40);
    for(let i=0; i<12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const panel = new THREE.Mesh(panelGeo, glass);
        panel.position.set(Math.cos(angle)*180, 0, Math.sin(angle)*180);
        panel.rotation.y = -angle;
        energyRing.add(panel);
    }
    meshes.energyRing = energyRing;

    // Docking Bays
    for(let i=0; i<3; i++) {
        const angle = (i / 3) * Math.PI * 2;
        const bayGeo = new THREE.BoxGeometry(30, 20, 40);
        const bay = new THREE.Mesh(bayGeo, chrome);
        bay.position.set(Math.cos(angle)*30, -30, Math.sin(angle)*30);
        bay.lookAt(0, -30, 0);
        // Bay forcefields
        const fieldGeo = new THREE.PlaneGeometry(28, 18);
        const field = new THREE.Mesh(fieldGeo, energyGlow);
        field.position.z = 20.1;
        bay.add(field);
        station.add(bay);
    }

    // Upper Ion Stabilizer Thrusters (To maintain orbit)
    const upperThrusterGeo = new THREE.CylinderGeometry(8, 3, 20, 32);
    for(let i=0; i<4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        const thruster = new THREE.Mesh(upperThrusterGeo, darkSteel);
        thruster.position.set(Math.cos(angle)*40, 50, Math.sin(angle)*40);
        const exhaust = new THREE.Mesh(new THREE.CylinderGeometry(5, 1, 15, 32), neonGreen);
        exhaust.position.y = 15;
        thruster.add(exhaust);
        station.add(thruster);
    }

    group.add(station);
    meshes.station = station;

    // ==========================================
    // 5. HYDRAULIC LINES AND CONDUITS
    // ==========================================
    // Create winding tubes around the base station
    const conduitPath = new THREE.CatmullRomCurve3([
        new THREE.Vector3(40, -10, 40),
        new THREE.Vector3(20, 0, 50),
        new THREE.Vector3(10, 10, 30),
        new THREE.Vector3(5, 20, 10),
        new THREE.Vector3(5, 50, 5)
    ]);
    const conduitGeo = new THREE.TubeGeometry(conduitPath, 64, 1.5, 16, false);
    const conduit1 = new THREE.Mesh(conduitGeo, copper);
    baseStation.add(conduit1);

    const conduitPath2 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-40, -10, -40),
        new THREE.Vector3(-20, 0, -50),
        new THREE.Vector3(-10, 10, -30),
        new THREE.Vector3(-5, 20, -10),
        new THREE.Vector3(-5, 50, -5)
    ]);
    const conduitGeo2 = new THREE.TubeGeometry(conduitPath2, 64, 1.5, 16, false);
    const conduit2 = new THREE.Mesh(conduitGeo2, copper);
    baseStation.add(conduit2);


    // ==========================================
    // PARTS METADATA
    // ==========================================
    parts.push({
        name: "Ocean Dampening Ring",
        description: "Massive gyroscopic ring stabilizing the base station against ocean currents and tectonic shifts.",
        material: "Dark Steel / Heavy Alloy",
        function: "Stabilization",
        assemblyOrder: 1,
        connections: ["Base Core Platform"],
        failureEffect: "Base station sways out of alignment, increasing tether stress.",
        cascadeFailures: ["Tether Anchor Matrix", "Main Carbon Tether Core"],
        originalPosition: { x: 0, y: -10, z: 0 },
        explodedPosition: { x: 0, y: -50, z: 0 }
    });
    parts.push({
        name: "Base Core Platform",
        description: "The primary structural foundation anchored to the Earth's crust.",
        material: "Titanium-Steel Composite",
        function: "Structural Support",
        assemblyOrder: 2,
        connections: ["Ocean Dampening Ring", "Tether Anchor Matrix", "Base Support Struts"],
        failureEffect: "Catastrophic structural collapse of the entire elevator.",
        cascadeFailures: ["Tether Anchor Matrix", "Main Carbon Tether Core", "Geostationary Spire"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -20, z: 0 }
    });
    parts.push({
        name: "Base Support Struts",
        description: "32 interlocking reinforced struts distributing the extreme tensile load of the tether.",
        material: "Chrome Plated Hyper-Alloy",
        function: "Load Distribution",
        assemblyOrder: 3,
        connections: ["Base Core Platform"],
        failureEffect: "Localized stress fractures in the base core.",
        cascadeFailures: ["Base Core Platform"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 100, y: -10, z: 100 }
    });
    parts.push({
        name: "Tether Anchor Matrix",
        description: "Extruded hex-matrix mechanism that grips and secures the carbon nanotube tether to the Earth.",
        material: "Superconducting Copper Alloy",
        function: "Tether Securing",
        assemblyOrder: 4,
        connections: ["Base Core Platform", "Main Carbon Tether Core"],
        failureEffect: "Tether detaches from Earth, snapping upward due to centrifugal force.",
        cascadeFailures: ["Main Carbon Tether Core", "Geostationary Spire"],
        originalPosition: { x: 0, y: 5, z: 0 },
        explodedPosition: { x: 0, y: 30, z: 0 }
    });
    parts.push({
        name: "Main Carbon Tether Core",
        description: "100,000 km long carbon nanotube cable with extreme tensile strength.",
        material: "Carbon Nanotube Macro-weave",
        function: "Payload Transportation Pathway",
        assemblyOrder: 5,
        connections: ["Tether Anchor Matrix", "Geostationary Spire"],
        failureEffect: "Elevator destruction, falling debris hazard on Earth.",
        cascadeFailures: ["Ascension Climber Alpha", "Descension Climber Beta"],
        originalPosition: { x: 0, y: TETHER_LENGTH/2, z: 0 },
        explodedPosition: { x: 200, y: TETHER_LENGTH/2, z: 0 }
    });
    parts.push({
        name: "Electromagnetic Climbing Tracks",
        description: "Four vertical rails running along the tether, providing magnetic levitation and propulsion for climbers.",
        material: "Dark Steel & Neon Superconductors",
        function: "Climber Propulsion",
        assemblyOrder: 6,
        connections: ["Main Carbon Tether Core"],
        failureEffect: "Climbers lose propulsion and fall.",
        cascadeFailures: ["Ascension Climber Alpha", "Descension Climber Beta"],
        originalPosition: { x: 0, y: TETHER_LENGTH/2, z: 0 },
        explodedPosition: { x: -200, y: TETHER_LENGTH/2, z: 0 }
    });
    parts.push({
        name: "Ascension Climber Alpha",
        description: "Massive transport vehicle currently moving payload up to the geostationary station.",
        material: "Aluminum/Titanium Frame",
        function: "Payload Delivery",
        assemblyOrder: 7,
        connections: ["Electromagnetic Climbing Tracks"],
        failureEffect: "Payload stranded, track damage.",
        cascadeFailures: ["Electromagnetic Climbing Tracks"],
        originalPosition: { x: 0, y: 100, z: 0 },
        explodedPosition: { x: 0, y: 100, z: 150 }
    });
    parts.push({
        name: "Alpha Manipulator Arms",
        description: "Robotic arms on the climber used for tether maintenance and payload handling.",
        material: "Chrome and Copper",
        function: "Maintenance and Cargo Handling",
        assemblyOrder: 8,
        connections: ["Ascension Climber Alpha"],
        failureEffect: "Inability to perform on-the-fly repairs.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 100, z: 0 },
        explodedPosition: { x: 50, y: 100, z: 150 }
    });
    parts.push({
        name: "Alpha Solar Wings",
        description: "Deployable photovoltaic arrays gathering solar energy to power the climber.",
        material: "Glass/Photovoltaic Cells",
        function: "Power Generation",
        assemblyOrder: 9,
        connections: ["Ascension Climber Alpha"],
        failureEffect: "Climber power depletion, emergency battery activation.",
        cascadeFailures: ["Ascension Climber Alpha"],
        originalPosition: { x: 0, y: 100, z: 0 },
        explodedPosition: { x: -100, y: 100, z: 50 }
    });
    parts.push({
        name: "Descension Climber Beta",
        description: "Secondary transport vehicle returning to Earth, balancing the tether's dynamic load.",
        material: "Dark Steel Frame",
        function: "Downward Transport / Load Balancing",
        assemblyOrder: 10,
        connections: ["Electromagnetic Climbing Tracks"],
        failureEffect: "Tether harmonic oscillations increase dangerously.",
        cascadeFailures: ["Main Carbon Tether Core"],
        originalPosition: { x: 0, y: TETHER_LENGTH - 100, z: 0 },
        explodedPosition: { x: 0, y: TETHER_LENGTH - 100, z: -150 }
    });
    parts.push({
        name: "Geostationary Spire",
        description: "The core column of the orbital station, anchoring the upper end of the tether.",
        material: "High-Tensile Steel",
        function: "Tether Apex Anchor",
        assemblyOrder: 11,
        connections: ["Main Carbon Tether Core", "Counterweight Habitation Ring", "Counterweight Energy Ring"],
        failureEffect: "Station disintegration, tether release.",
        cascadeFailures: ["Main Carbon Tether Core", "Counterweight Habitation Ring"],
        originalPosition: { x: 0, y: TETHER_LENGTH, z: 0 },
        explodedPosition: { x: 0, y: TETHER_LENGTH + 200, z: 0 }
    });
    parts.push({
        name: "Counterweight Habitation Ring",
        description: "Rotating torus providing artificial gravity for station personnel.",
        material: "Aluminum Alloy",
        function: "Crew Quarters",
        assemblyOrder: 12,
        connections: ["Geostationary Spire"],
        failureEffect: "Loss of life support and gravity for crew.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: TETHER_LENGTH, z: 0 },
        explodedPosition: { x: 300, y: TETHER_LENGTH, z: 300 }
    });
    parts.push({
        name: "Counterweight Energy Ring",
        description: "Outer ring containing massive solar arrays to power the orbital station and upper tether tracks.",
        material: "Dark Steel and Photovoltaics",
        function: "Station Power Generation",
        assemblyOrder: 13,
        connections: ["Geostationary Spire"],
        failureEffect: "Complete station blackout.",
        cascadeFailures: ["Counterweight Habitation Ring", "Geostationary Spire"],
        originalPosition: { x: 0, y: TETHER_LENGTH, z: 0 },
        explodedPosition: { x: -300, y: TETHER_LENGTH, z: -300 }
    });
    parts.push({
        name: "Upper Docking Bays",
        description: "Magnetic forcefield sealed bays for incoming spacecraft.",
        material: "Chrome and Energy Shields",
        function: "Spacecraft Docking",
        assemblyOrder: 14,
        connections: ["Geostationary Spire"],
        failureEffect: "Inability to transfer deep-space cargo.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: TETHER_LENGTH, z: 0 },
        explodedPosition: { x: 0, y: TETHER_LENGTH - 100, z: 200 }
    });
    parts.push({
        name: "Ion Thruster Stabilizers",
        description: "Massive orbital thrusters that fire to maintain the counterweight's precise tension and altitude.",
        material: "Dark Steel with Neon Green Exhaust",
        function: "Orbital Station Keeping",
        assemblyOrder: 15,
        connections: ["Geostationary Spire"],
        failureEffect: "Station drifts, slackening or snapping the tether.",
        cascadeFailures: ["Main Carbon Tether Core", "Geostationary Spire"],
        originalPosition: { x: 0, y: TETHER_LENGTH, z: 0 },
        explodedPosition: { x: 0, y: TETHER_LENGTH + 150, z: -200 }
    });
    parts.push({
        name: "Tether Warning Beacon Array",
        description: "Pulsing neon-red lights distributed across the tether to warn aircraft and satellites.",
        material: "Neon Red Emitters",
        function: "Collision Avoidance",
        assemblyOrder: 16,
        connections: ["Main Carbon Tether Core"],
        failureEffect: "Increased risk of aerial or orbital collision.",
        cascadeFailures: ["Main Carbon Tether Core"],
        originalPosition: { x: 0, y: 500, z: 0 },
        explodedPosition: { x: -100, y: 500, z: -100 }
    });

    const description = "A gargantuan Space Elevator bridging Earth to a Geostationary Orbital Station. This hyper-advanced megastructure features a carbon-nanotube tether, massive electromagnetic climbers with articulating robotic manipulator arms, glowing propulsion systems, and an enormous rotating counterweight habitat. Hydraulics, magnetic rails, and ion thrusters keep this delicate titan balanced against gravity and centrifugal forces.";

    const quizQuestions = [
        {
            question: "What material is theorized as the only substance strong enough for the Space Elevator's main tether?",
            options: ["Steel Wire", "Titanium Alloy", "Carbon Nanotubes", "Graphene-infused Kevlar"],
            answer: "Carbon Nanotubes",
            explanation: "Carbon nanotubes possess the extreme tensile strength-to-weight ratio required to withstand the immense forces without snapping under their own weight."
        },
        {
            question: "Why must the counterweight station be positioned slightly beyond geostationary orbit?",
            options: ["To avoid space debris", "To keep the tether taut via outward centrifugal force", "For better solar radiation exposure", "To remain out of Earth's magnetic field"],
            answer: "To keep the tether taut via outward centrifugal force",
            explanation: "Placing the center of mass exactly at or slightly above geostationary orbit ensures the outward centrifugal force balances the downward pull of gravity, keeping the tether under tension."
        },
        {
            question: "How do the Ascension and Descension Climbers primarily traverse the tether?",
            options: ["Combustion engines", "Electromagnetic tracks/maglev", "Hydraulic winches", "Nuclear pulse propulsion"],
            answer: "Electromagnetic tracks/maglev",
            explanation: "Electromagnetic levitation and propulsion (maglev) along the outer tracks provide a frictionless, high-speed, and electrically powered ascent method."
        },
        {
            question: "What is the function of the Ion Thruster Stabilizers on the Counterweight Station?",
            options: ["To launch the station into deep space", "Orbital station keeping to maintain tether tension", "To defend against asteroids", "To power the habitation ring"],
            answer: "Orbital station keeping to maintain tether tension",
            explanation: "External forces (like the moon's gravity, solar wind, and climbers moving) alter the station's orbit. Thrusters correct this to prevent tether slack or snapping."
        },
        {
            question: "What purpose does the Ocean Dampening Ring serve at the Earth Base Station?",
            options: ["Water purification for the crew", "Generating hydroelectric power", "Stabilizing the base against ocean currents and tectonic shifts", "Cooling the tether tracks"],
            answer: "Stabilizing the base against ocean currents and tectonic shifts",
            explanation: "The massive gyroscopic ring acts as a damper, absorbing mechanical shocks and environmental forces to keep the critical tether anchor perfectly aligned."
        }
    ];

    // ==========================================
    // ANIMATION LOOP
    // ==========================================
    const animate = (time, speed, meshesObj) => {
        // Pulse warning lights on tether
        if (meshesObj.warningLights) {
            const pulse = (Math.sin(time * speed * 5) + 1) / 2;
            meshesObj.warningLights.forEach(light => {
                light.material.emissiveIntensity = 0.5 + (pulse * 2);
            });
        }

        // Animate Climber Alpha (Ascending)
        if (meshesObj.climberAlpha) {
            // Move up
            let newY = meshesObj.climberAlpha.group.position.y + (speed * 10);
            if (newY > TETHER_LENGTH - 30) newY = 30; // loop back to bottom
            meshesObj.climberAlpha.group.position.y = newY;

            // Animate Robotic Arms
            meshesObj.climberAlpha.armBase.rotation.y = Math.sin(time * speed * 2) * 1.5;
            meshesObj.climberAlpha.elbow.rotation.x = Math.sin(time * speed * 3) * 0.5;

            // Pulsate exhaust
            const exhaustPulse = 1.0 + Math.random() * 0.5;
            meshesObj.climberAlpha.group.children.forEach(child => {
                if (child.geometry && child.geometry.type === 'CylinderGeometry' && child.children.length > 0) {
                    child.children[0].material.emissiveIntensity = exhaustPulse * 2;
                }
            });
        }

        // Animate Climber Beta (Descending)
        if (meshesObj.climberBeta) {
            // Move down
            let newY = meshesObj.climberBeta.group.position.y - (speed * 8);
            if (newY < 30) newY = TETHER_LENGTH - 30; // loop back to top
            meshesObj.climberBeta.group.position.y = newY;

            // Animate Robotic Arms
            meshesObj.climberBeta.armBase.rotation.y = Math.cos(time * speed * 2.5) * 1.2;
            meshesObj.climberBeta.elbow.rotation.x = Math.cos(time * speed * 3.5) * 0.4;
        }

        // Rotate Geostationary Rings
        if (meshesObj.habRing) {
            meshesObj.habRing.rotation.z = time * speed * 0.2; // Slow majestic rotation
        }
        if (meshesObj.energyRing) {
            meshesObj.energyRing.rotation.z = -time * speed * 0.1; // Counter-rotating for stability
        }
        
        // Pulse Docking Bay Forcefields
        if (meshesObj.station) {
            meshesObj.station.children.forEach(child => {
                if (child.children.length > 0 && child.children[0].material === energyGlow) {
                    child.children[0].material.emissiveIntensity = 2.0 + Math.sin(time * speed * 10) * 1.5;
                }
            });
        }
    };

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}
