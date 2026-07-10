import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Glowing / Neon Materials
    const neonBlue = new THREE.MeshStandardMaterial({ color: 0x0088ff, emissive: 0x0044ff, emissiveIntensity: 2, roughness: 0.2, metalness: 0.8 });
    const neonOrange = new THREE.MeshStandardMaterial({ color: 0xff8800, emissive: 0xcc4400, emissiveIntensity: 2, roughness: 0.2, metalness: 0.8 });
    const glowingGreen = new THREE.MeshStandardMaterial({ color: 0x00ff44, emissive: 0x00cc22, emissiveIntensity: 1.8, roughness: 0.2, metalness: 0.8 });
    const glowingRed = new THREE.MeshStandardMaterial({ color: 0xff0044, emissive: 0xcc0022, emissiveIntensity: 2.5, roughness: 0.1, metalness: 0.5 });
    const quantumGlass = new THREE.MeshPhysicalMaterial({ color: 0x88ccff, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1, ior: 1.5, thickness: 0.5 });

    const description = "Mobile Datta-Das Spintronics Transistor Rig: A heavy-duty, off-road deployed quantum physics laboratory. It houses a colossal Datta-Das spin field-effect transistor capable of filtering, precessing, and detecting electron spins at a macro scale. Built on a rugged chassis with aggressive treads and hydraulic suspension to stabilize the extremely sensitive quantum state.";

    // Track animatable meshes
    const wheels = [];
    const electrons = [];
    const gateRings = [];
    const radarDishes = [];
    
    // Main structural hierarchy
    const mainBody = new THREE.Group();
    group.add(mainBody);

    // ==========================================
    // 1. MASSIVE OFF-ROAD CHASSIS
    // ==========================================
    const chassisShape = new THREE.Shape();
    chassisShape.moveTo(-110, -30);
    chassisShape.lineTo(110, -30);
    chassisShape.lineTo(130, -10);
    chassisShape.lineTo(130, 10);
    chassisShape.lineTo(110, 20);
    chassisShape.lineTo(-110, 20);
    chassisShape.lineTo(-130, 10);
    chassisShape.lineTo(-130, -10);
    chassisShape.lineTo(-110, -30);

    const chassisExtrude = { depth: 50, bevelEnabled: true, bevelSegments: 6, steps: 4, bevelSize: 2, bevelThickness: 2 };
    const chassisGeom = new THREE.ExtrudeGeometry(chassisShape, chassisExtrude);
    chassisGeom.center();
    const chassis = new THREE.Mesh(chassisGeom, darkSteel);
    chassis.position.y = 40;
    mainBody.add(chassis);

    // Chassis Rivets (Massive detailing)
    const rivetGeom = new THREE.SphereGeometry(1.5, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    rivetGeom.rotateX(Math.PI / 2);
    for (let x = -100; x <= 100; x += 20) {
        for (let z = -23; z <= 23; z += 46) {
            const rivet = new THREE.Mesh(rivetGeom, steel);
            rivet.position.set(x, 60.5, z);
            mainBody.add(rivet);
        }
    }

    // ==========================================
    // 2. WHEELS WITH AGGRESSIVE TREADS
    // ==========================================
    const tireRadius = 26;
    const tireTube = 9;
    const lugCount = 72;
    const wheelPositions = [
        { x: -90, y: 33, z: 45 },
        { x: 90, y: 33, z: 45 },
        { x: -90, y: 33, z: -45 },
        { x: 90, y: 33, z: -45 },
    ];

    wheelPositions.forEach((pos) => {
        const wheelGroup = new THREE.Group();

        // Base Tire
        const tireGeom = new THREE.TorusGeometry(tireRadius, tireTube, 32, 100);
        const tire = new THREE.Mesh(tireGeom, rubber);
        wheelGroup.add(tire);

        // Aggressive Off-Road Lugs
        const lugGeom = new THREE.BoxGeometry(tireTube * 2.8, tireTube * 0.4, tireTube * 0.9);
        for (let i = 0; i < lugCount; i++) {
            const angle = (i / lugCount) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeom, rubber);
            lug.position.set((tireRadius + tireTube * 0.7) * Math.cos(angle), (tireRadius + tireTube * 0.7) * Math.sin(angle), 0);
            lug.rotation.z = angle;
            lug.position.z += (i % 2 === 0) ? tireTube * 0.35 : -tireTube * 0.35;
            wheelGroup.add(lug);
        }

        // Rim Array
        const rimGeom = new THREE.CylinderGeometry(tireRadius - tireTube * 0.2, tireRadius - tireTube * 0.2, tireTube * 2.4, 64);
        rimGeom.rotateX(Math.PI / 2);
        const rim = new THREE.Mesh(rimGeom, darkSteel);
        wheelGroup.add(rim);

        // Complex Spokes
        const spokeGeom = new THREE.CylinderGeometry(1.5, 1.5, tireRadius * 2, 16);
        for (let i = 0; i < 16; i++) {
            const spoke = new THREE.Mesh(spokeGeom, chrome);
            spoke.rotation.z = (i / 16) * Math.PI;
            wheelGroup.add(spoke);
        }

        // Hubcap
        const hubGeom = new THREE.SphereGeometry(7, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
        hubGeom.rotateX(Math.PI / 2);
        const hub = new THREE.Mesh(hubGeom, chrome);
        hub.position.z = tireTube * 1.3;
        if (pos.z < 0) hub.position.z = -tireTube * 1.3;
        wheelGroup.add(hub);

        wheelGroup.position.set(pos.x, pos.y, pos.z);
        group.add(wheelGroup);
        wheels.push(wheelGroup);

        // Suspension Strut (Attached to mainBody)
        const strut = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 30, 16), steel);
        strut.position.set(pos.x, 30, pos.z * 0.75);
        mainBody.add(strut);
    });

    // ==========================================
    // 3. OPERATOR CABIN
    // ==========================================
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(70, 75, 0);
    mainBody.add(cabinGroup);

    const cabinShape = new THREE.Shape();
    cabinShape.moveTo(-25, -15);
    cabinShape.lineTo(25, -15);
    cabinShape.lineTo(30, 5);
    cabinShape.lineTo(20, 25);
    cabinShape.lineTo(-15, 25);
    cabinShape.lineTo(-25, 5);
    cabinShape.lineTo(-25, -15);

    const cabinGeom = new THREE.ExtrudeGeometry(cabinShape, { depth: 40, bevelEnabled: true, bevelSize: 1, bevelThickness: 1 });
    cabinGeom.center();
    const cabinMesh = new THREE.Mesh(cabinGeom, aluminum);
    cabinGroup.add(cabinMesh);

    // Tinted Windshield
    const windowGeom = new THREE.PlaneGeometry(32, 22);
    const windshield = new THREE.Mesh(windowGeom, tinted);
    windshield.position.set(25.5, 15, 0);
    windshield.rotation.y = Math.PI / 2;
    windshield.rotation.x = -Math.PI / 7;
    cabinGroup.add(windshield);

    // Steering & Controls
    const steering = new THREE.Mesh(new THREE.TorusGeometry(3.5, 0.6, 16, 32), rubber);
    steering.position.set(16, 5, 10);
    steering.rotation.y = Math.PI / 2;
    steering.rotation.x = -Math.PI / 4;
    cabinGroup.add(steering);

    const controlPanel = new THREE.Mesh(new THREE.BoxGeometry(12, 6, 24), darkSteel);
    controlPanel.position.set(18, -5, -8);
    cabinGroup.add(controlPanel);

    const screen1 = new THREE.Mesh(new THREE.PlaneGeometry(10, 5), neonBlue);
    screen1.position.set(18, 0, -8);
    screen1.rotation.y = Math.PI / 2;
    screen1.rotation.x = -Math.PI / 6;
    cabinGroup.add(screen1);

    const screen2 = new THREE.Mesh(new THREE.PlaneGeometry(10, 5), glowingRed);
    screen2.position.set(18, 0, -18);
    screen2.rotation.y = Math.PI / 2;
    screen2.rotation.x = -Math.PI / 6;
    cabinGroup.add(screen2);

    // Side Mirrors
    const createMirror = (zPos, bracketZ) => {
        const mirrorGeom = new THREE.BoxGeometry(2, 7, 5);
        const mirror = new THREE.Mesh(mirrorGeom, chrome);
        mirror.position.set(25, 10, zPos);
        const bracket = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 12), plastic);
        bracket.rotation.x = Math.PI / 2;
        bracket.position.set(25, 10, bracketZ);
        cabinGroup.add(mirror, bracket);
    };
    createMirror(25, 20);
    createMirror(-25, -20);

    // Cabin Radar Array
    const radarGroup = new THREE.Group();
    radarGroup.position.set(5, 28, 0);
    const dish = new THREE.Mesh(new THREE.SphereGeometry(7, 24, 24, 0, Math.PI * 2, 0, Math.PI / 3), darkSteel);
    dish.rotation.x = -Math.PI / 2;
    dish.rotation.y = Math.PI / 4;
    const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 12), chrome);
    antenna.position.set(2, 6, 2);
    antenna.rotation.x = Math.PI / 4;
    radarGroup.add(dish, antenna);
    cabinGroup.add(radarGroup);
    radarDishes.push(radarGroup);

    // ==========================================
    // 4. DATTA-DAS SPINTROINCS PAYLOAD
    // ==========================================
    const ddGroup = new THREE.Group();
    ddGroup.position.set(-30, 65, 0);
    mainBody.add(ddGroup);

    // 4a. Ferromagnetic Source (Injector)
    const sourceGroup = new THREE.Group();
    sourceGroup.position.set(-65, 0, 0);
    
    const sourcePoints = [];
    sourcePoints.push(new THREE.Vector2(0, -20));
    sourcePoints.push(new THREE.Vector2(20, -20));
    sourcePoints.push(new THREE.Vector2(20, -5));
    sourcePoints.push(new THREE.Vector2(14, 2));
    sourcePoints.push(new THREE.Vector2(16, 8));
    sourcePoints.push(new THREE.Vector2(10, 20));
    sourcePoints.push(new THREE.Vector2(0, 20));
    const sourceLathe = new THREE.Mesh(new THREE.LatheGeometry(sourcePoints, 64), steel);
    sourceGroup.add(sourceLathe);

    const sourceNozzle = new THREE.Mesh(new THREE.CylinderGeometry(3, 12, 25, 32), copper);
    sourceNozzle.rotation.z = -Math.PI / 2;
    sourceNozzle.position.set(20, 5, 0);
    sourceGroup.add(sourceNozzle);

    for (let i = 0; i < 6; i++) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(18, 1.8, 16, 64), chrome);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = -15 + i * 6;
        sourceGroup.add(ring);
    }
    ddGroup.add(sourceGroup);

    // 4b. Ferromagnetic Drain (Detector)
    const drainGroup = new THREE.Group();
    drainGroup.position.set(65, 0, 0);
    const drainLathe = new THREE.Mesh(new THREE.LatheGeometry(sourcePoints, 64), darkSteel);
    drainGroup.add(drainLathe);

    const drainNozzle = new THREE.Mesh(new THREE.CylinderGeometry(12, 3, 25, 32), copper);
    drainNozzle.rotation.z = -Math.PI / 2;
    drainNozzle.position.set(-20, 5, 0);
    drainGroup.add(drainNozzle);

    for (let i = 0; i < 6; i++) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(18, 1.8, 16, 64), steel);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = -15 + i * 6;
        drainGroup.add(ring);
    }
    ddGroup.add(drainGroup);

    // 4c. Semiconductor 2DEG Channel
    const channelGroup = new THREE.Group();
    const channelOuter = new THREE.Mesh(new THREE.CylinderGeometry(8, 8, 90, 32), quantumGlass);
    channelOuter.rotation.z = Math.PI / 2;
    channelOuter.position.set(0, 5, 0);
    channelGroup.add(channelOuter);

    const channelInner = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 90, 16), neonBlue);
    channelInner.rotation.z = Math.PI / 2;
    channelInner.position.set(0, 5, 0);
    channelGroup.add(channelInner);
    ddGroup.add(channelGroup);

    // 4d. Gate Electrode (Rashba Modulator Array)
    const gateGroup = new THREE.Group();
    gateGroup.position.set(0, 5, 0);
    const gateCoilCount = 10;
    
    for (let i = 0; i < gateCoilCount; i++) {
        const coilGroup = new THREE.Group();
        const coil = new THREE.Mesh(new THREE.TorusGeometry(14, 2.5, 32, 64), copper);
        coil.rotation.y = Math.PI / 2;
        
        const innerGlow = new THREE.Mesh(new THREE.TorusGeometry(11, 1, 32, 64), neonOrange);
        innerGlow.rotation.y = Math.PI / 2;
        
        coilGroup.add(coil, innerGlow);
        coilGroup.position.x = -35 + (i * (70 / (gateCoilCount - 1)));
        gateGroup.add(coilGroup);
        gateRings.push(innerGlow);
        
        // Hydraulic actuator mount for each ring
        const mount = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 20, 16), chrome);
        mount.position.set(coilGroup.position.x, -18, 0);
        ddGroup.add(mount);
    }
    ddGroup.add(gateGroup);

    // 4e. Electron Spin Visualizers
    const electronCount = 25;
    for (let i = 0; i < electronCount; i++) {
        const electron = new THREE.Group();
        
        const core = new THREE.Mesh(new THREE.SphereGeometry(2, 16, 16), neonBlue);
        electron.add(core);
        
        const arrowGroup = new THREE.Group();
        const arrowBody = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 5), glowingGreen);
        arrowBody.position.y = 2.5;
        const arrowHead = new THREE.Mesh(new THREE.ConeGeometry(1.5, 3, 16), glowingGreen);
        arrowHead.position.y = 6.5;
        arrowGroup.add(arrowBody, arrowHead);
        electron.add(arrowGroup);
        
        electron.position.x = -45 + Math.random() * 90;
        electron.position.y = 5;
        
        electron.userData = {
            progress: Math.random(),
            spinPhase: Math.random() * Math.PI * 2,
            arrow: arrowGroup
        };
        
        ddGroup.add(electron);
        electrons.push(electron);
    }

    // ==========================================
    // 5. HYDRAULICS, PIPES & EXHAUST
    // ==========================================
    const createPipe = (points, radius, mat) => {
        const curve = new THREE.CatmullRomCurve3(points);
        return new THREE.Mesh(new THREE.TubeGeometry(curve, 64, radius, 12, false), mat);
    };

    // Cryo Manifold
    const manifold = new THREE.Mesh(new THREE.BoxGeometry(90, 25, 25), darkSteel);
    manifold.position.set(-60, 45, -35);
    mainBody.add(manifold);

    mainBody.add(createPipe([
        new THREE.Vector3(-60, 45, -22),
        new THREE.Vector3(-60, 70, -10),
        new THREE.Vector3(-95, 70, 0),
    ], 3.5, copper));

    mainBody.add(createPipe([
        new THREE.Vector3(20, 45, -22),
        new THREE.Vector3(20, 70, -10),
        new THREE.Vector3(35, 70, 0),
    ], 3.5, copper));

    // Exhaust Stacks
    const exhaustGeom = new THREE.CylinderGeometry(3, 3, 45, 16);
    const ex1 = new THREE.Mesh(exhaustGeom, chrome);
    ex1.position.set(45, 75, 25);
    const ex2 = new THREE.Mesh(exhaustGeom, chrome);
    ex2.position.set(45, 75, -25);
    mainBody.add(ex1, ex2);
    
    const exCap = new THREE.CylinderGeometry(3.2, 3.2, 12, 16);
    exCap.translate(0, 6, 0);
    exCap.rotateX(Math.PI / 4);
    const cap1 = new THREE.Mesh(exCap, chrome);
    cap1.position.set(45, 97, 25);
    const cap2 = new THREE.Mesh(exCap, chrome);
    cap2.position.set(45, 97, -25);
    mainBody.add(cap1, cap2);

    // Front Grille
    const grilleGroup = new THREE.Group();
    grilleGroup.position.set(130, 45, 0);
    const grilleFrame = new THREE.Mesh(new THREE.BoxGeometry(6, 25, 36), steel);
    grilleGroup.add(grilleFrame);
    for (let z = -14; z <= 14; z += 4) {
        const bar = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 22), chrome);
        bar.position.set(3, 0, z);
        grilleGroup.add(bar);
    }
    mainBody.add(grilleGroup);

    // Ladders
    const ladderGroup = new THREE.Group();
    ladderGroup.position.set(50, 30, 26);
    const railGeom = new THREE.CylinderGeometry(0.6, 0.6, 50, 8);
    const r1 = new THREE.Mesh(railGeom, chrome);
    r1.position.set(-4, 0, 0);
    const r2 = new THREE.Mesh(railGeom, chrome);
    r2.position.set(4, 0, 0);
    ladderGroup.add(r1, r2);
    for (let i = -22; i <= 22; i += 5) {
        const step = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 8, 8), darkSteel);
        step.rotation.z = Math.PI / 2;
        step.position.y = i;
        ladderGroup.add(step);
    }
    mainBody.add(ladderGroup);

    // ==========================================
    // 6. PARTS ARRAY REGISTRATION
    // ==========================================
    parts.push({
        name: "Ferromagnetic Spin Injector (Source)",
        description: "A highly complex magnetic lathe assembly that perfectly aligns the spins of incoming electrons prior to entering the 2DEG channel.",
        material: "Steel & Copper",
        function: "Spin Polarization Initialization",
        assemblyOrder: 10,
        connections: ["Semiconductor Channel", "Cryogenic Manifold"],
        failureEffect: "Unpolarized electron emission, leading to complete logic noise and random current flow.",
        cascadeFailures: ["Gate Electrode overload", "Detector misalignment"],
        originalPosition: { x: -65, y: 65, z: 0 },
        explodedPosition: { x: -160, y: 100, z: -50 }
    });

    parts.push({
        name: "Ferromagnetic Spin Detector (Drain)",
        description: "A finely tuned ferromagnetic receiver that only allows electrons with matching spin alignments to pass, creating the transistor's On/Off states.",
        material: "Dark Steel & Copper",
        function: "Spin Detection / Current Filtering",
        assemblyOrder: 11,
        connections: ["Semiconductor Channel"],
        failureEffect: "Transistor becomes stuck in either permanent ON or OFF state.",
        cascadeFailures: ["Logic circuit short"],
        originalPosition: { x: 65, y: 65, z: 0 },
        explodedPosition: { x: 160, y: 100, z: -50 }
    });

    parts.push({
        name: "Semiconductor 2DEG Channel (Core)",
        description: "A vacuum-sealed quantum glass tube housing a Two-Dimensional Electron Gas where ballistic electron transport occurs.",
        material: "Quantum Glass & Neon Plasma",
        function: "Electron Transport Bridge",
        assemblyOrder: 12,
        connections: ["Source Injector", "Drain Detector", "Gate Modulators"],
        failureEffect: "Decoherence of electron spin, halting all operations.",
        cascadeFailures: ["Thermal meltdown"],
        originalPosition: { x: 0, y: 70, z: 0 },
        explodedPosition: { x: 0, y: 150, z: -20 }
    });

    parts.push({
        name: "Rashba Modulator Gate Array",
        description: "Superconducting copper rings that apply a transverse electric field, inducing an effective magnetic field to precess electron spins via the Rashba effect.",
        material: "Copper & Neon Emitters",
        function: "Spin Precession Control",
        assemblyOrder: 13,
        connections: ["Semiconductor Channel", "Hydraulic Actuators"],
        failureEffect: "Inability to flip electron spins, freezing logical operations.",
        cascadeFailures: ["Signal desynchronization"],
        originalPosition: { x: 0, y: 70, z: 0 },
        explodedPosition: { x: 0, y: 150, z: 50 }
    });

    parts.push({
        name: "Heavy-Duty Off-Road Chassis",
        description: "Massive extruded steel base frame designed to absorb all seismic and environmental vibrations.",
        material: "Dark Steel",
        function: "Quantum State Stabilization",
        assemblyOrder: 1,
        connections: ["Suspension Struts", "Cabin", "Cryo Manifold"],
        failureEffect: "Micro-vibrations destroy the quantum coherence in the channel.",
        cascadeFailures: ["Complete systemic failure"],
        originalPosition: { x: 0, y: 40, z: 0 },
        explodedPosition: { x: 0, y: -20, z: 0 }
    });

    parts.push({
        name: "Cryogenic Coolant Manifold",
        description: "Massive rear-mounted cooling unit pumping liquid helium to maintain superconducting temperatures.",
        material: "Dark Steel & Copper Pipes",
        function: "Thermal Noise Suppression",
        assemblyOrder: 8,
        connections: ["Chassis", "Source Injector"],
        failureEffect: "Thermal noise increases, destroying spin polarization.",
        cascadeFailures: ["Superconductor quench", "Channel meltdown"],
        originalPosition: { x: -60, y: 85, z: -35 },
        explodedPosition: { x: -100, y: 120, z: -100 }
    });

    parts.push({
        name: "Operator Control Cabin",
        description: "Armored aluminum command center with tinted windows and neon interfaces for monitoring quantum state telemetry.",
        material: "Aluminum & Tinted Glass",
        function: "Manual Telemetry & Navigation",
        assemblyOrder: 5,
        connections: ["Chassis", "Radar Array"],
        failureEffect: "Loss of manual override and navigation capability.",
        cascadeFailures: ["Navigation error"],
        originalPosition: { x: 70, y: 75, z: 0 },
        explodedPosition: { x: 120, y: 120, z: 60 }
    });

    parts.push({
        name: "High-Traction Off-Road Treads",
        description: "Massive torus-geometry tires embedded with hundreds of box-geometry lugs to traverse hostile terrain seamlessly.",
        material: "Rubber",
        function: "Mobility",
        assemblyOrder: 2,
        connections: ["Chrome Rim Alloys"],
        failureEffect: "Loss of mobility.",
        cascadeFailures: ["Mission failure"],
        originalPosition: { x: -90, y: 33, z: 45 },
        explodedPosition: { x: -150, y: 33, z: 100 }
    });

    parts.push({
        name: "Chrome Rim Alloys",
        description: "Heavy cylindrical rims with complex intersecting spoke geometries designed for extreme load bearing.",
        material: "Chrome & Dark Steel",
        function: "Load Distribution",
        assemblyOrder: 3,
        connections: ["High-Traction Treads", "Suspension Struts"],
        failureEffect: "Wheel collapse under the immense weight of the quantum payload.",
        cascadeFailures: ["Chassis ground impact", "Decoherence event"],
        originalPosition: { x: 90, y: 33, z: 45 },
        explodedPosition: { x: 150, y: 33, z: 100 }
    });

    parts.push({
        name: "Hydraulic Suspension Struts",
        description: "Thick steel cylinders connecting the chassis to the wheels, providing hyper-smooth travel.",
        material: "Steel",
        function: "Vibration Dampening",
        assemblyOrder: 4,
        connections: ["Chassis", "Chrome Rim Alloys"],
        failureEffect: "Rigid impacts transfer to the core.",
        cascadeFailures: ["Quantum decoherence"],
        originalPosition: { x: 90, y: 30, z: 33 },
        explodedPosition: { x: 120, y: 0, z: 60 }
    });

    parts.push({
        name: "High-Pressure Exhaust Stacks",
        description: "Twin chrome exhaust chimneys venting byproducts from the massive onboard power generators.",
        material: "Chrome",
        function: "Exhaust Venting",
        assemblyOrder: 6,
        connections: ["Chassis"],
        failureEffect: "Overpressure in generator systems.",
        cascadeFailures: ["Power failure", "Loss of cooling"],
        originalPosition: { x: 45, y: 75, z: 25 },
        explodedPosition: { x: 80, y: 150, z: 80 }
    });

    parts.push({
        name: "Neodymium Radar Array",
        description: "Spinning communication dish for transmitting high-density quantum state data back to command.",
        material: "Dark Steel & Chrome",
        function: "Telemetry Uplink",
        assemblyOrder: 7,
        connections: ["Operator Control Cabin"],
        failureEffect: "Loss of remote data logging.",
        cascadeFailures: [],
        originalPosition: { x: 75, y: 103, z: 0 },
        explodedPosition: { x: 75, y: 160, z: 0 }
    });

    parts.push({
        name: "Chromed Front Grille",
        description: "Reinforced bumper and air intake array protecting the main generators.",
        material: "Steel & Chrome",
        function: "Impact Protection",
        assemblyOrder: 9,
        connections: ["Chassis"],
        failureEffect: "Frontal collision damage to internal systems.",
        cascadeFailures: ["Generator shutdown"],
        originalPosition: { x: 130, y: 45, z: 0 },
        explodedPosition: { x: 180, y: 45, z: 0 }
    });

    parts.push({
        name: "Spin Polarization Nozzle",
        description: "A highly focused copper convergence point that forces electrons into a single-file ballistic trajectory.",
        material: "Copper",
        function: "Trajectory Formatting",
        assemblyOrder: 14,
        connections: ["Source Injector", "Semiconductor Channel"],
        failureEffect: "Electron scattering, rendering the logic state unreadable.",
        cascadeFailures: ["Drain failure"],
        originalPosition: { x: -45, y: 70, z: 0 },
        explodedPosition: { x: -80, y: 70, z: 50 }
    });

    parts.push({
        name: "Gate Modulator Actuators",
        description: "Precision hydraulic lifts that rapidly adjust the distance of the superconducting rings to modulate the Rashba field strength.",
        material: "Chrome",
        function: "Dynamic Field Adjustment",
        assemblyOrder: 15,
        connections: ["Rashba Modulator Gate Array", "Chassis"],
        failureEffect: "Inability to alter the transistor logic state.",
        cascadeFailures: ["Stuck transistor"],
        originalPosition: { x: 0, y: 47, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -50 }
    });

    parts.push({
        name: "Cabin Access Ladders",
        description: "Chrome and dark steel rails allowing operators to mount the towering rig.",
        material: "Chrome & Dark Steel",
        function: "Crew Access",
        assemblyOrder: 16,
        connections: ["Chassis"],
        failureEffect: "Operators unable to perform manual maintenance.",
        cascadeFailures: ["Long-term degradation"],
        originalPosition: { x: 50, y: 30, z: 26 },
        explodedPosition: { x: 50, y: 0, z: 80 }
    });

    // ==========================================
    // 7. QUIZ QUESTIONS
    // ==========================================
    const quizQuestions = [
        {
            question: "What is the primary function of the ferromagnetic source in the Datta-Das transistor?",
            options: ["To heat the semiconductor channel", "To inject spin-polarized electrons", "To generate the Rashba effect", "To measure the final spin state"],
            correctAnswer: 1,
            explanation: "The ferromagnetic source acts as a spin filter, only allowing electrons with a specific spin orientation to enter the semiconductor channel, initializing the quantum logic state."
        },
        {
            question: "How does the gate electrode influence the electrons passing through the semiconductor channel?",
            options: ["It physically blocks their path", "It accelerates them to near light speed", "It creates an effective magnetic field causing spin precession", "It absorbs the electrons to create current"],
            correctAnswer: 2,
            explanation: "Through the Rashba effect, the transverse electric field from the gate is experienced by the moving electrons as a magnetic field in their rest frame, causing their spin vectors to precess (rotate) as they travel."
        },
        {
            question: "What determines whether current flows in a Datta-Das transistor?",
            options: ["The temperature of the cryogenic coolant", "The alignment of the electron's spin with the ferromagnetic drain", "The size of the off-road tires", "The speed of the radar rotation"],
            correctAnswer: 1,
            explanation: "If the electron's spin aligns with the ferromagnetic drain's magnetization upon arrival, it can pass through (current flows/ON state). If anti-aligned, it is blocked (no current/OFF state)."
        },
        {
            question: "Why does this mobile rig require massive cryogenic coolant manifolds?",
            options: ["To keep the operator cabin comfortable", "To prevent the tires from melting under extreme friction", "To maintain the coherent quantum states of the spin-polarized electrons", "To power the high-pressure exhaust stacks"],
            correctAnswer: 2,
            explanation: "Quantum states, like electron spin, are extremely delicate and easily destroyed by thermal noise (decoherence). Cryogenic cooling is absolutely essential for macroscopic spintronic devices to function."
        },
        {
            question: "What is the purpose of the aggressive off-road treads and hydraulic suspension on this rig?",
            options: ["To provide extreme stabilization and mobility for the sensitive quantum equipment across hostile environments", "To generate static electricity for the gate electrode", "To crush standard silicon transistors", "To cool the semiconductor channel through wind exposure"],
            correctAnswer: 0,
            explanation: "Deploying a highly sensitive nanoscale quantum device in the field as a macro-scale rig requires massive stabilization. The heavy-duty chassis and advanced suspension completely isolate the semiconductor channel from seismic and environmental vibrations."
        }
    ];

    // ==========================================
    // 8. RICH ANIMATION LOOP
    // ==========================================
    const animate = (time, speed) => {
        const scaledTime = time * speed;
        
        // 1. Wheel rolling
        wheels.forEach((w) => {
            w.rotation.z = -scaledTime * 3;
        });
        
        // 2. Radar spin
        radarDishes.forEach(r => {
            r.rotation.y = scaledTime * 1.5;
        });

        // 3. Electron Flow & Spin Precession
        electrons.forEach(el => {
            el.userData.progress += 0.005 * speed;
            if (el.userData.progress > 1) {
                el.userData.progress = 0;
            }
            // Move through the 90-unit channel (-45 to 45)
            el.position.x = -45 + el.userData.progress * 90;
            
            // Oscillating gate voltage controls the rate of spin precession
            const gateVoltage = Math.sin(scaledTime * 3) * 6; 
            el.userData.spinPhase += (0.05 + gateVoltage * 0.015) * speed;
            
            // Apply precession to the arrow
            el.userData.arrow.rotation.z = el.userData.spinPhase;
            
            // Quantum wobble
            el.position.y = 5 + Math.sin(el.userData.progress * Math.PI * 15 + scaledTime) * 0.4;
            el.position.z = Math.cos(el.userData.progress * Math.PI * 15 + scaledTime) * 0.4;
        });

        // 4. Gate Rings Pulsing
        gateRings.forEach((ring, index) => {
            ring.material.emissiveIntensity = 1.5 + Math.sin(scaledTime * 6 + index) * 1.2;
        });

        // 5. Massive Chassis Suspension Bobbing
        const bounce = Math.sin(scaledTime * 12) * 1.5;
        mainBody.position.y = bounce;
    };

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createDattaDasTransistor() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
