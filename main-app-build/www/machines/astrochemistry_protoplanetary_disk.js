import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Custom glowing/neon materials
    const emissiveStar = new THREE.MeshStandardMaterial({ 
        color: 0xffdd88, 
        emissive: 0xffaa00, 
        emissiveIntensity: 3, 
        wireframe: false 
    });
    const emissiveGas = new THREE.MeshStandardMaterial({ 
        color: 0xff5500, 
        emissive: 0xff3300, 
        emissiveIntensity: 1.5, 
        transparent: true, 
        opacity: 0.7 
    });
    const emissiveScreen = new THREE.MeshStandardMaterial({ 
        color: 0x00ffff, 
        emissive: 0x00ffff, 
        emissiveIntensity: 2 
    });
    const emissiveJet = new THREE.MeshStandardMaterial({ 
        color: 0x0088ff, 
        emissive: 0x0044ff, 
        emissiveIntensity: 2.5,
        transparent: true,
        opacity: 0.6
    });

    // ------------------------------------------------------------------------
    // 1. MAIN CHASSIS (Complex ExtrudeGeometry, NO SIMPLE CUBES)
    // ------------------------------------------------------------------------
    const chassisShape = new THREE.Shape();
    chassisShape.moveTo(-80, -50);
    chassisShape.lineTo(80, -50);
    chassisShape.lineTo(110, -20);
    chassisShape.lineTo(110, 20);
    chassisShape.lineTo(80, 50);
    chassisShape.lineTo(-80, 50);
    chassisShape.lineTo(-110, 20);
    chassisShape.lineTo(-110, -20);
    chassisShape.lineTo(-80, -50);
    
    // Central hole for the stellar containment core
    const centralHole = new THREE.Path();
    centralHole.absarc(0, 0, 40, 0, Math.PI * 2, false);
    chassisShape.holes.push(centralHole);

    const extrudeSettings = { 
        depth: 12, 
        bevelEnabled: true, 
        bevelSegments: 6, 
        steps: 4, 
        bevelSize: 2, 
        bevelThickness: 2 
    };
    
    const chassisGeom = new THREE.ExtrudeGeometry(chassisShape, extrudeSettings);
    const chassis = new THREE.Mesh(chassisGeom, darkSteel);
    chassis.rotation.x = Math.PI / 2;
    chassis.position.y = 20; // Elevated
    chassis.name = "chassisBase";
    group.add(chassis);

    parts.push({
        name: "Hexagonal Containment Chassis",
        description: "A massive forged dark-steel chassis utilizing extruded structural geometry. It houses the magnetic containment array that suspends the protoplanetary system.",
        material: "darkSteel",
        function: "Structural foundation and magnetic shielding.",
        assemblyOrder: 1,
        connections: ["Suspension_Hydraulics", "Operator_Cabin", "Tire_Arrays"],
        failureEffect: "Total structural collapse, releasing uncontrolled stellar radiation.",
        cascadeFailures: ["Stellar_Core", "Magnetic_Arches"],
        originalPosition: { x: 0, y: 20, z: 0 },
        explodedPosition: { x: 0, y: 50, z: 0 }
    });

    // --- Panel Lines & Rivets on Chassis ---
    function addRivetLine(startX, startZ, endX, endZ, count) {
        for (let i = 0; i <= count; i++) {
            const t = i / count;
            const rx = startX + (endX - startX) * t;
            const rz = startZ + (endZ - startZ) * t;
            const rivet = new THREE.Mesh(new THREE.SphereGeometry(0.4, 8, 8), steel);
            rivet.position.set(rx, 26, rz);
            rivet.scale.y = 0.5;
            group.add(rivet);
        }
    }
    addRivetLine(-70, -45, 70, -45, 30);
    addRivetLine(-70, 45, 70, 45, 30);
    addRivetLine(-105, -15, -105, 15, 15);
    addRivetLine(105, -15, 105, 15, 15);

    // ------------------------------------------------------------------------
    // 2. EXTREMELY DETAILED TIRES
    // ------------------------------------------------------------------------
    function createTireSystem(px, py, pz, nameStr) {
        const tireGroup = new THREE.Group();
        tireGroup.position.set(px, py, pz);
        tireGroup.name = "wheelGroup";

        // Main Torus for tire base
        const tireBase = new THREE.Mesh(new THREE.TorusGeometry(12, 5, 32, 100), rubber);
        tireBase.rotation.y = Math.PI / 2;
        tireGroup.add(tireBase);

        // Hundreds of tiny extruded BoxGeometry lugs for tread
        const numLugs = 120;
        for (let i = 0; i < numLugs; i++) {
            const angle = (i / numLugs) * Math.PI * 2;
            const lugGeom = new THREE.BoxGeometry(10.5, 1.5, 3);
            const lug = new THREE.Mesh(lugGeom, rubber);
            // Position radially
            lug.position.set(0, Math.sin(angle) * 16.5, Math.cos(angle) * 16.5);
            lug.rotation.x = -angle;
            // Angle them for aggressive V-tread pattern
            if (i % 2 === 0) {
                lug.rotation.y = Math.PI / 8;
                lug.position.x = 2.5;
                lug.scale.set(0.5, 1, 1);
            } else {
                lug.rotation.y = -Math.PI / 8;
                lug.position.x = -2.5;
                lug.scale.set(0.5, 1, 1);
            }
            tireGroup.add(lug);
        }

        // Rim - Cylinder with complex spoke array
        const rim = new THREE.Mesh(new THREE.CylinderGeometry(9, 9, 11, 32), chrome);
        rim.rotation.z = Math.PI / 2;
        tireGroup.add(rim);

        const hub = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 12, 16), steel);
        hub.rotation.z = Math.PI / 2;
        tireGroup.add(hub);

        for (let i = 0; i < 8; i++) {
            const spokeAngle = (i / 8) * Math.PI * 2;
            const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.2, 18, 12), steel);
            spoke.position.set(0, Math.sin(spokeAngle) * 4.5, Math.cos(spokeAngle) * 4.5);
            spoke.rotation.x = -spokeAngle;
            tireGroup.add(spoke);
        }

        group.add(tireGroup);
        return tireGroup;
    }

    const tFL = createTireSystem(-90, 16, -60, "Front_Left_Tire");
    const tFR = createTireSystem(90, 16, -60, "Front_Right_Tire");
    const tRL = createTireSystem(-90, 16, 60, "Rear_Left_Tire");
    const tRR = createTireSystem(90, 16, 60, "Rear_Right_Tire");

    parts.push({
        name: "Omni-Traction Stellar Treads",
        description: "Four massive wheel arrays featuring aggressive box-extruded lugs over a heavy torus base. Built to navigate the rocky debris fields of planetary nurseries.",
        material: "rubber, chrome",
        function: "Locomotion across high-gravity, unstable terrains.",
        assemblyOrder: 2,
        connections: ["Chassis_Base", "Hydraulic_Pistons"],
        failureEffect: "Immobilization in hazardous accretion zones.",
        cascadeFailures: ["Exhaust_Overheating"],
        originalPosition: { x: -90, y: 16, z: -60 },
        explodedPosition: { x: -150, y: 16, z: -100 }
    });

    // ------------------------------------------------------------------------
    // 3. HYDRAULIC SYSTEMS (Cylinder in Cylinder)
    // ------------------------------------------------------------------------
    function createHydraulicSupport(px, py, pz, rx, ry, rz) {
        const hydGroup = new THREE.Group();
        hydGroup.position.set(px, py, pz);
        hydGroup.rotation.set(rx, ry, rz);

        // Outer Cylinder
        const outer = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 16, 16), darkSteel);
        outer.position.y = 8;
        hydGroup.add(outer);

        // Inner Piston (animated)
        const inner = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 16, 16), chrome);
        inner.position.y = 16; 
        inner.name = "pistonInner";
        hydGroup.add(inner);

        // Joint
        const joint = new THREE.Mesh(new THREE.SphereGeometry(2.5, 16, 16), steel);
        joint.position.y = 24;
        inner.add(joint); // attach to inner so it moves with the piston

        group.add(hydGroup);
    }

    createHydraulicSupport(-90, 20, -40, 0, 0, Math.PI/6);
    createHydraulicSupport(90, 20, -40, 0, 0, -Math.PI/6);
    createHydraulicSupport(-90, 20, 40, 0, 0, Math.PI/6);
    createHydraulicSupport(90, 20, 40, 0, 0, -Math.PI/6);

    parts.push({
        name: "Adaptive Hydraulic Suspension",
        description: "Heavy-duty cylinders housing chrome inner pistons. They adapt in real-time to gravitational anomalies caused by the contained stellar mass.",
        material: "darkSteel, chrome",
        function: "Vibration dampening and chassis leveling.",
        assemblyOrder: 3,
        connections: ["Chassis_Base", "Tire_Arrays"],
        failureEffect: "Chassis tilt, disrupting the magnetic containment field.",
        cascadeFailures: ["Containment_Breach"],
        originalPosition: { x: -90, y: 20, z: -40 },
        explodedPosition: { x: -120, y: 40, z: -60 }
    });

    // ------------------------------------------------------------------------
    // 4. DETAILED OPERATOR CABIN
    // ------------------------------------------------------------------------
    const cabGroup = new THREE.Group();
    cabGroup.position.set(0, 26, 65);

    // Main Cab Body (Extruded)
    const cabShape = new THREE.Shape();
    cabShape.moveTo(-15, -10);
    cabShape.lineTo(15, -10);
    cabShape.lineTo(15, 10);
    cabShape.lineTo(10, 15);
    cabShape.lineTo(-10, 15);
    cabShape.lineTo(-15, 10);
    cabShape.lineTo(-15, -10);
    
    const cabGeom = new THREE.ExtrudeGeometry(cabShape, { depth: 20, bevelEnabled: true });
    const cabBody = new THREE.Mesh(cabGeom, aluminum);
    cabBody.rotation.x = -Math.PI/2;
    cabBody.position.z = -10;
    cabGroup.add(cabBody);

    // Tinted Glass Front
    const glassGeom = new THREE.BoxGeometry(26, 14, 2);
    const cabGlass = new THREE.Mesh(glassGeom, tinted);
    cabGlass.position.set(0, 8, -10);
    cabGlass.rotation.x = -Math.PI/12;
    cabGroup.add(cabGlass);

    // Side Mirrors
    const mirrorGeom = new THREE.BoxGeometry(1, 4, 3);
    const mirrorL = new THREE.Mesh(mirrorGeom, plastic);
    mirrorL.position.set(-16, 8, -5);
    cabGroup.add(mirrorL);
    const mirrorR = new THREE.Mesh(mirrorGeom, plastic);
    mirrorR.position.set(16, 8, -5);
    cabGroup.add(mirrorR);

    // Internal Controls
    const controlPanel = new THREE.Mesh(new THREE.BoxGeometry(20, 4, 4), plastic);
    controlPanel.position.set(0, 3, -6);
    controlPanel.rotation.x = Math.PI/6;
    cabGroup.add(controlPanel);

    // Glowing Screens
    for(let i=0; i<3; i++) {
        const screen = new THREE.Mesh(new THREE.PlaneGeometry(5, 3), emissiveScreen);
        screen.position.set(-6 + (i*6), 4.5, -4.8);
        screen.rotation.x = -Math.PI/12;
        cabGroup.add(screen);
    }

    // Steering Wheel
    const steeringColumn = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 3), plastic);
    steeringColumn.position.set(0, 3, -2);
    steeringColumn.rotation.x = Math.PI/4;
    cabGroup.add(steeringColumn);
    const steeringWheel = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.3, 16, 32), rubber);
    steeringWheel.position.set(0, 4.5, -0.5);
    steeringWheel.rotation.x = Math.PI/4;
    cabGroup.add(steeringWheel);

    // Joysticks
    const stickGeom = new THREE.CylinderGeometry(0.2, 0.4, 2);
    const stickL = new THREE.Mesh(stickGeom, darkSteel);
    stickL.position.set(-8, 4, -2);
    cabGroup.add(stickL);
    const ballL = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), emissiveScreen);
    ballL.position.set(-8, 5, -2);
    cabGroup.add(ballL);
    
    const stickR = new THREE.Mesh(stickGeom, darkSteel);
    stickR.position.set(8, 4, -2);
    cabGroup.add(stickR);
    const ballR = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), emissiveStar);
    ballR.position.set(8, 5, -2);
    cabGroup.add(ballR);

    // Ladders to Cab
    const ladderGroup = new THREE.Group();
    ladderGroup.position.set(-12, -10, 5);
    for(let i=0; i<5; i++) {
        const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 4), steel);
        rung.rotation.z = Math.PI/2;
        rung.position.set(0, i * -2, 0);
        ladderGroup.add(rung);
    }
    const rail1 = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 10), steel);
    rail1.position.set(-2, -4, 0);
    ladderGroup.add(rail1);
    const rail2 = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 10), steel);
    rail2.position.set(2, -4, 0);
    ladderGroup.add(rail2);
    cabGroup.add(ladderGroup);

    group.add(cabGroup);

    parts.push({
        name: "Observation Cabin & Control Deck",
        description: "Heavily shielded operator cabin with tinted radiation-proof glass. Equipped with glowing telemetry screens, dual joystick manipulators, and a central steering yoke.",
        material: "aluminum, tinted, plastic",
        function: "Safely houses the pilot managing the stellar harvesting process.",
        assemblyOrder: 4,
        connections: ["Chassis_Base"],
        failureEffect: "Pilot exposed to extreme radiation and vacuum.",
        cascadeFailures: ["Loss of Manual Control"],
        originalPosition: { x: 0, y: 26, z: 65 },
        explodedPosition: { x: 0, y: 60, z: 100 }
    });

    // ------------------------------------------------------------------------
    // 5. EXTENSIVE HYDRAULIC LINES & TUBES
    // ------------------------------------------------------------------------
    function createComplexTube(pointsArray, thickness, material) {
        const curve = new THREE.CatmullRomCurve3(pointsArray.map(p => new THREE.Vector3(p[0], p[1], p[2])));
        const tubeGeom = new THREE.TubeGeometry(curve, 64, thickness, 16, false);
        const tube = new THREE.Mesh(tubeGeom, material);
        group.add(tube);
        return tube;
    }

    // Coolant Pipe A
    createComplexTube([
        [-30, 26, -50],
        [-40, 28, -20],
        [-35, 35, 0],
        [-10, 30, 20],
        [0, 25, 40]
    ], 1.2, copper);

    // Coolant Pipe B
    createComplexTube([
        [30, 26, -50],
        [40, 32, -20],
        [30, 38, 0],
        [15, 30, 20],
        [0, 24, 42]
    ], 1.2, copper);

    // High Pressure Hydraulic Lines
    for(let i=0; i<4; i++) {
        const offsetX = i % 2 === 0 ? -15 : 15;
        const offsetZ = i < 2 ? -30 : 30;
        createComplexTube([
            [offsetX, 20, offsetZ],
            [offsetX * 1.5, 15, offsetZ * 1.2],
            [offsetX * 2.5, 18, offsetZ * 1.5]
        ], 0.6, rubber);
    }

    parts.push({
        name: "Coolant & Hydraulic Piping Network",
        description: "Extensive network of copper coolant pipes and rubberized hydraulic lines transferring cryo-fluids to the containment ring.",
        material: "copper, rubber",
        function: "Thermal regulation and fluid power transmission.",
        assemblyOrder: 5,
        connections: ["Chassis_Base", "Hydraulic_Pistons", "Containment_Ring"],
        failureEffect: "Overheating of the main chassis.",
        cascadeFailures: ["Containment_Breach", "Sensor_Melt"],
        originalPosition: { x: 0, y: 28, z: 0 },
        explodedPosition: { x: 0, y: 80, z: 0 }
    });

    // ------------------------------------------------------------------------
    // 6. EXHAUST STACKS & GRILLES
    // ------------------------------------------------------------------------
    function createExhaust(px, py, pz, rx, rz) {
        const stackGroup = new THREE.Group();
        stackGroup.position.set(px, py, pz);
        stackGroup.rotation.set(rx, 0, rz);
        
        const pipe = new THREE.Mesh(new THREE.CylinderGeometry(2, 2.5, 20, 16), darkSteel);
        pipe.position.y = 10;
        stackGroup.add(pipe);

        const cap = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.4, 16, 32), chrome);
        cap.position.y = 20;
        cap.rotation.x = Math.PI/2;
        stackGroup.add(cap);

        // Glowing vent inside
        const vent = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 1), emissiveGas);
        vent.position.y = 19.5;
        stackGroup.add(vent);

        group.add(stackGroup);
    }

    createExhaust(-70, 26, -50, -Math.PI/12, Math.PI/12);
    createExhaust(-60, 26, -50, -Math.PI/12, Math.PI/12);
    createExhaust(70, 26, -50, -Math.PI/12, -Math.PI/12);
    createExhaust(60, 26, -50, -Math.PI/12, -Math.PI/12);

    // Central Heat Grille
    const grilleGroup = new THREE.Group();
    grilleGroup.position.set(0, 26, -60);
    const grilleBase = new THREE.Mesh(new THREE.BoxGeometry(40, 2, 10), steel);
    grilleGroup.add(grilleBase);
    for(let i=0; i<15; i++) {
        const slat = new THREE.Mesh(new THREE.BoxGeometry(38, 1, 0.2), darkSteel);
        slat.position.set(0, 1.5, -4.5 + (i * 0.6));
        slat.rotation.x = Math.PI/4;
        grilleGroup.add(slat);
    }
    group.add(grilleGroup);

    parts.push({
        name: "Plasma Exhaust Stacks & Thermal Grille",
        description: "Massive dark-steel exhaust pipes with chrome caps venting ionized gases from the containment process. Protected by a heavy slatted grille.",
        material: "darkSteel, chrome",
        function: "Vents excess plasma and heat from the stellar core.",
        assemblyOrder: 6,
        connections: ["Chassis_Base"],
        failureEffect: "Thermal runaway and catastrophic core explosion.",
        cascadeFailures: ["Complete System Annihilation"],
        originalPosition: { x: -65, y: 26, z: -50 },
        explodedPosition: { x: -65, y: 70, z: -80 }
    });

    // ------------------------------------------------------------------------
    // 7. ASTROCHEMISTRY CORE: STAR & PROTOPLANETARY DISK
    // ------------------------------------------------------------------------
    const coreGroup = new THREE.Group();
    coreGroup.position.set(0, 30, 0);
    
    // Containment Ring
    const containmentGeom = new THREE.TorusGeometry(38, 2, 32, 64);
    const containmentRing = new THREE.Mesh(containmentGeom, chrome);
    containmentRing.rotation.x = Math.PI/2;
    coreGroup.add(containmentRing);

    // Magnetic Emitters
    for(let i=0; i<6; i++) {
        const angle = (i/6) * Math.PI*2;
        const emitter = new THREE.Mesh(new THREE.BoxGeometry(4, 6, 6), steel);
        emitter.position.set(Math.cos(angle)*38, 0, Math.sin(angle)*38);
        emitter.rotation.y = -angle;
        
        // Inner glowing node
        const node = new THREE.Mesh(new THREE.SphereGeometry(1.5, 16, 16), emissiveScreen);
        node.position.set(-2, 0, 0);
        emitter.add(node);
        
        coreGroup.add(emitter);
    }

    // Central Young Star
    const starGeom = new THREE.IcosahedronGeometry(8, 3);
    const star = new THREE.Mesh(starGeom, emissiveStar);
    star.name = "stellarCore";
    coreGroup.add(star);

    // Corona (Transparent Additive)
    const coronaGeom = new THREE.SphereGeometry(9, 32, 32);
    const coronaMat = new THREE.MeshStandardMaterial({
        color: 0xffdd88,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending
    });
    const corona = new THREE.Mesh(coronaGeom, coronaMat);
    star.add(corona);

    // Bipolar Jets (Radiation Pressure)
    const jetGeom = new THREE.ConeGeometry(3, 40, 32, 1, true);
    const jetN = new THREE.Mesh(jetGeom, emissiveJet);
    jetN.position.y = 20;
    jetN.name = "polarJet";
    coreGroup.add(jetN);
    const jetS = new THREE.Mesh(jetGeom, emissiveJet);
    jetS.position.y = -20;
    jetS.rotation.x = Math.PI;
    jetS.name = "polarJet";
    coreGroup.add(jetS);

    // Accretion Disk - Complex layered rings
    const diskGroup = new THREE.Group();
    diskGroup.name = "accretionDisk";
    
    // Inner gas disk (Hot, emissive)
    for (let r = 10; r < 18; r += 0.8) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.4, 8, 100), emissiveGas);
        ring.rotation.x = Math.PI/2;
        // slightly offset y to create thickness/turbulence
        ring.position.y = (Math.random() - 0.5) * 0.5; 
        diskGroup.add(ring);
    }

    // Gap for forming planet at r=20
    const planet1 = new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 32), emissiveStar);
    planet1.userData = { orbitRadius: 20, orbitSpeed: 0.8 };
    planet1.name = "protoPlanet";
    coreGroup.add(planet1);

    // Mid dust disk (Cooler, rocky)
    const dustMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 1, metalness: 0.2 });
    for (let r = 22; r < 28; r += 0.5) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.3, 8, 120), dustMat);
        ring.rotation.x = Math.PI/2;
        ring.position.y = (Math.random() - 0.5) * 1.2;
        diskGroup.add(ring);
    }

    // Gap for outer planet at r=31
    const planet2 = new THREE.Mesh(new THREE.SphereGeometry(2.5, 32, 32), emissiveGas);
    // Circumplanetary disk for giant
    const cpDisk = new THREE.Mesh(new THREE.RingGeometry(3, 4.5, 32), new THREE.MeshBasicMaterial({color: 0xaaaaaa, side: THREE.DoubleSide}));
    cpDisk.rotation.x = Math.PI/2;
    planet2.add(cpDisk);
    planet2.userData = { orbitRadius: 31, orbitSpeed: 0.4 };
    planet2.name = "protoPlanet";
    coreGroup.add(planet2);

    // Outer ice/dust disk
    const iceMat = new THREE.MeshStandardMaterial({ color: 0x88ccff, transparent: true, opacity: 0.8 });
    for (let r = 34; r < 37; r += 0.4) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.2, 8, 150), iceMat);
        ring.rotation.x = Math.PI/2;
        ring.position.y = (Math.random() - 0.5) * 0.8;
        diskGroup.add(ring);
    }

    coreGroup.add(diskGroup);
    group.add(coreGroup);

    parts.push({
        name: "Central Protostar & Corona",
        description: "A highly emissive artificial protostar generating intense stellar winds and radiation pressure, mimicking a T-Tauri phase star.",
        material: "emissiveStar",
        function: "Provides the gravity and radiation driving the astrochemistry of the disk.",
        assemblyOrder: 7,
        connections: ["Magnetic_Containment_Field"],
        failureEffect: "Supernova-scale blast inside the containment rig.",
        cascadeFailures: ["Everything"],
        originalPosition: { x: 0, y: 30, z: 0 },
        explodedPosition: { x: 0, y: 150, z: 0 }
    });

    parts.push({
        name: "Swirling Accretion Disks (Gas & Dust)",
        description: "Complex layered toroids representing the protoplanetary disk. The inner disk is hot ionized gas, mid is silicate dust, and outer is icy debris.",
        material: "emissiveGas, dustMat, iceMat",
        function: "Material reservoir for planet formation and chemical synthesis.",
        assemblyOrder: 8,
        connections: ["Stellar_Core_Gravity"],
        failureEffect: "Disk dissipation via photoevaporation, halting planet formation.",
        cascadeFailures: ["Proto_Planets"],
        originalPosition: { x: 0, y: 30, z: 0 },
        explodedPosition: { x: 0, y: 30, z: 0 } // Rotates and scales during explosion
    });

    parts.push({
        name: "Protoplanets & Gaps",
        description: "Forming planetary bodies clearing gaps in the accretion disk. Includes a massive gas giant with its own circumplanetary disk.",
        material: "emissiveStar, emissiveGas",
        function: "Accretes material from the disk, clearing orbital pathways.",
        assemblyOrder: 9,
        connections: ["Accretion_Disk"],
        failureEffect: "Orbital migration into the central star.",
        cascadeFailures: ["Disk_Disruption"],
        originalPosition: { x: 20, y: 30, z: 0 },
        explodedPosition: { x: 100, y: 30, z: 100 }
    });

    parts.push({
        name: "Polar Bipolar Jets",
        description: "High-velocity outflows of ionized gas ejected from the star's poles due to magnetic field interactions with the inner disk.",
        material: "emissiveJet",
        function: "Sheds excess angular momentum from the accreting star.",
        assemblyOrder: 10,
        connections: ["Stellar_Core"],
        failureEffect: "Stellar spin-up reaching critical breakup velocity.",
        cascadeFailures: ["Core_Fragmentation"],
        originalPosition: { x: 0, y: 50, z: 0 },
        explodedPosition: { x: 0, y: 200, z: 0 }
    });

    // ------------------------------------------------------------------------
    // QUIZ QUESTIONS
    // ------------------------------------------------------------------------
    const quizQuestions = [
        {
            question: "In the context of the modeled system, what causes the distinct gaps observed within the swirling accretion disk?",
            options: [
                "Intense solar flares incinerating localized dust.",
                "Gravitational clearing by forming protoplanets.",
                "Magnetic field lines repelling the gas.",
                "Photoevaporation from the bipolar jets."
            ],
            correctAnswer: 1,
            explanation: "As protoplanets gain mass, their gravity sweeps up or ejects material in their orbital path, creating distinct, cleared gaps in the otherwise continuous accretion disk."
        },
        {
            question: "Why are the innermost rings of the disk rendered as glowing hot (emissiveGas) compared to the outer rings?",
            options: [
                "Friction and gravitational potential energy convert to heat closer to the star.",
                "The outer rings are composed of dark matter.",
                "The central star's magnetic field only reaches the inner disk.",
                "The machine's hydraulic pipes leak coolant onto the outer rings."
            ],
            correctAnswer: 0,
            explanation: "In an accretion disk, material spirals inward. The loss of gravitational potential energy and internal friction (viscosity) heats the inner gas to thousands of degrees, causing it to glow, while the outer regions remain cool enough for dust and ice to survive."
        },
        {
            question: "What is the primary astronomical function of the Bipolar Jets (the glowing cones extending vertically from the core)?",
            options: [
                "To refuel the machine's exhaust stacks.",
                "To carry away excess angular momentum from the accreting star.",
                "To pull new asteroids into the disk.",
                "To stabilize the hydraulic suspension."
            ],
            correctAnswer: 1,
            explanation: "As material falls onto the star, it spins faster. Bipolar jets, driven by magnetic fields, eject a portion of this material at high speeds along the poles, removing excess angular momentum and preventing the star from spinning itself apart."
        },
        {
            question: "Looking at the heavy-duty hydraulic suspension and massive tire arrays, what engineering challenge is this machine designed to overcome?",
            options: [
                "Navigating smooth, frictionless ice planes.",
                "Managing extreme gravitational anomalies and rough terrain near stellar nurseries.",
                "Flying through the vacuum of space.",
                "Submarine exploration of liquid methane oceans."
            ],
            correctAnswer: 1,
            explanation: "The combination of aggressive off-road lugs, heavy-duty pistons, and a massive chassis indicates it is built to traverse extreme, unstable, high-gravity rocky terrains found in violent planetary nurseries, adapting its level to maintain core containment."
        },
        {
            question: "The larger protoplanet (gas giant) possesses its own small ring system. What is the astrochemistry term for this structure?",
            options: [
                "A Circumplanetary Disk.",
                "An Oort Cloud.",
                "A Roche Limit.",
                "A Dyson Sphere."
            ],
            correctAnswer: 0,
            explanation: "Gas giants often form their own miniature accretion disks as they gather gas from the primary disk. This is called a circumplanetary disk, which is where their moons ultimately form."
        }
    ];

    // ------------------------------------------------------------------------
    // ANIMATION FUNCTION
    // ------------------------------------------------------------------------
    function animate(time, speed, meshes) {
        const t = time * speed;
        
        // Use recursive traversal to find named parts
        group.traverse((child) => {
            if (child.name === "wheelGroup") {
                // Rotate the entire wheel group to simulate driving
                child.children.forEach(part => {
                    if(part.geometry.type === "TorusGeometry" || part.geometry.type === "BoxGeometry" || part.geometry.type === "CylinderGeometry") {
                        if (part.geometry.type !== "CylinderGeometry" || part.scale.y !== 18) {
                             // simplistic spin for visual effect
                             part.rotation.x += 0.02 * speed;
                        }
                    }
                });
            }

            if (child.name === "pistonInner") {
                // Hydraulic pumping motion based on sine wave
                child.position.y = 16 + Math.sin(t * 2 + child.parent.position.x) * 2;
            }

            if (child.name === "stellarCore") {
                // Pulsing star
                const scale = 1 + Math.sin(t * 5) * 0.03;
                child.scale.set(scale, scale, scale);
                child.rotation.y += 0.01 * speed;
            }

            if (child.name === "polarJet") {
                // Pulsing jets
                const scale = 1 + Math.sin(t * 10) * 0.1;
                child.scale.set(1, scale, 1);
                // Twisting jets
                child.rotation.y += 0.1 * speed;
            }

            if (child.name === "accretionDisk") {
                // Different layers rotate at different speeds natively, but we spin the whole group slowly
                child.rotation.y += 0.005 * speed;
                
                // Add internal turbulence to individual rings
                child.children.forEach((ring, index) => {
                    ring.rotation.z = Math.sin(t + index) * 0.05;
                });
            }

            if (child.name === "protoPlanet") {
                // Orbital mechanics
                const radius = child.userData.orbitRadius;
                const orbitSpeed = child.userData.orbitSpeed;
                child.position.x = Math.cos(t * orbitSpeed) * radius;
                child.position.z = Math.sin(t * orbitSpeed) * radius;
                // Planet self-rotation
                child.rotation.y += 0.05 * speed;
            }
        });
    }

    return { group, parts, description: "Astrochemistry Protoplanetary Disk Harvester & Simulator", quizQuestions, animate };
}

// Auto-generated missing stub
export function createProtoplanetaryDisk() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
