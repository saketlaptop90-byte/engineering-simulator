import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const animatables = {
        wheels: [],
        spins: [],
        electrons: [],
        microwaves: [],
        pistons: [],
        booms: [],
        gears: [],
        screens: []
    };

    // Custom Glowing Materials
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 2.5,
        transparent: true,
        opacity: 0.8,
        roughness: 0.1,
        metalness: 0.8
    });

    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff2200,
        emissive: 0xff2200,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.9,
        roughness: 0.2
    });

    const neonGreen = new THREE.MeshStandardMaterial({
        color: 0x00ff44,
        emissive: 0x00ff44,
        emissiveIntensity: 1.5,
        wireframe: true
    });

    // ==========================================
    // 1. MOBILE CHASSIS (Advanced Rig Base)
    // ==========================================
    const chassisGroup = new THREE.Group();
    
    // Complex Extruded Chassis Base
    const chassisShape = new THREE.Shape();
    chassisShape.moveTo(-15, -8);
    chassisShape.lineTo(15, -8);
    chassisShape.lineTo(20, -3);
    chassisShape.lineTo(20, 3);
    chassisShape.lineTo(15, 8);
    chassisShape.lineTo(-15, 8);
    chassisShape.lineTo(-20, 3);
    chassisShape.lineTo(-20, -3);
    chassisShape.lineTo(-15, -8);

    const extrudeSettings = { depth: 4, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.5, bevelThickness: 0.5 };
    const chassisGeom = new THREE.ExtrudeGeometry(chassisShape, extrudeSettings);
    const chassis = new THREE.Mesh(chassisGeom, darkSteel);
    chassis.rotation.x = Math.PI / 2;
    chassis.position.y = -4;
    chassisGroup.add(chassis);

    // Chassis Details (Grilles, Rivets, Panels)
    for(let i = -12; i <= 12; i += 4) {
        const grilleGeom = new THREE.BoxGeometry(2, 0.2, 6);
        const grille = new THREE.Mesh(grilleGeom, chrome);
        grille.position.set(i, -3.9, 0);
        chassisGroup.add(grille);
        
        // Add rivets around grilles
        for(let j = -2.5; j <= 2.5; j += 5) {
            const rivetGeom = new THREE.SphereGeometry(0.15, 8, 8);
            const rivet = new THREE.Mesh(rivetGeom, steel);
            rivet.position.set(i + 1, -3.8, j);
            chassisGroup.add(rivet);
            const rivet2 = new THREE.Mesh(rivetGeom, steel);
            rivet2.position.set(i - 1, -3.8, j);
            chassisGroup.add(rivet2);
        }
    }

    parts.push({
        name: "Vibranium-Reinforced Mobile Chassis",
        description: "Heavy-duty base platform providing seismic isolation for the nanoscale oscillator core.",
        material: "Dark Steel / Chrome",
        function: "Structural support and housing for locomotion and cooling lines.",
        assemblyOrder: 1,
        connections: ["Traction Wheels", "Cooling Array", "Main Oscillator Pillar"],
        failureEffect: "Structural collapse, completely misaligning the quantum sensors.",
        cascadeFailures: ["Cooling Liquid N2 Lines", "Quantum State Analyzer Array"],
        originalPosition: { x: 0, y: -4, z: 0 },
        explodedPosition: { x: 0, y: -20, z: 0 }
    });

    // ==========================================
    // 2. OFF-ROAD TREADED TIRES & WHEEL ASSEMBLIES
    // ==========================================
    const wheelPositions = [
        { x: -16, z: 9 }, { x: 16, z: 9 },
        { x: -16, z: -9 }, { x: 16, z: -9 },
        { x: 0, z: 10 }, { x: 0, z: -10 } // 6-wheel drive
    ];

    wheelPositions.forEach((pos, index) => {
        const wheelAssembly = new THREE.Group();
        
        // Main Torus Tire
        const tireGeom = new THREE.TorusGeometry(3.5, 1.8, 32, 64);
        const tire = new THREE.Mesh(tireGeom, rubber);
        tire.rotation.y = Math.PI / 2;
        wheelAssembly.add(tire);

        // Aggressive Treads (Hundreds of tiny extruded lugs)
        const lugCount = 80;
        for (let i = 0; i < lugCount; i++) {
            const angle = (i / lugCount) * Math.PI * 2;
            const lugGeom = new THREE.BoxGeometry(3.8, 0.4, 0.8);
            const lug = new THREE.Mesh(lugGeom, rubber);
            // Position on the outer surface of the torus
            const radius = 5.3;
            lug.position.set(0, Math.cos(angle) * radius, Math.sin(angle) * radius);
            lug.rotation.x = -angle;
            // Angle the treads like a V-shape for off-road
            lug.rotation.y = (i % 2 === 0) ? 0.2 : -0.2;
            wheelAssembly.add(lug);
        }

        // Rims (Cylinder with complex spoke arrays)
        const rimGeom = new THREE.CylinderGeometry(2.8, 2.8, 1.2, 32);
        const rim = new THREE.Mesh(rimGeom, aluminum);
        rim.rotation.z = Math.PI / 2;
        wheelAssembly.add(rim);

        // Complex Spokes
        const spokeGeom = new THREE.BoxGeometry(5.6, 0.4, 0.4);
        for(let s = 0; s < 6; s++) {
            const spoke = new THREE.Mesh(spokeGeom, steel);
            spoke.rotation.x = (s / 6) * Math.PI;
            rim.add(spoke);
            // Add decorative bolts
            const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.4, 8), darkSteel);
            bolt.rotation.z = Math.PI / 2;
            bolt.position.set(0, Math.cos(spoke.rotation.x)*2, Math.sin(spoke.rotation.x)*2);
            rim.add(bolt);
        }

        wheelAssembly.position.set(pos.x, -4, pos.z);
        chassisGroup.add(wheelAssembly);
        animatables.wheels.push(wheelAssembly);

        if (index === 0) {
            parts.push({
                name: "All-Terrain Traction Wheels",
                description: "Massive Torus-based wheels with hundreds of extruded BoxGeometry lugs for extreme grip.",
                material: "Rubber / Aluminum",
                function: "Transports the highly sensitive oscillator equipment across rough laboratory or field terrain.",
                assemblyOrder: 2,
                connections: ["Vibranium-Reinforced Mobile Chassis"],
                failureEffect: "Immobility of the STO rig.",
                cascadeFailures: [],
                originalPosition: { x: pos.x, y: -4, z: pos.z },
                explodedPosition: { x: pos.x * 2, y: -4, z: pos.z * 2 }
            });
        }
    });

    group.add(chassisGroup);

    // ==========================================
    // 3. HYDRAULIC BOOMS & PISTONS
    // ==========================================
    const boomGroup = new THREE.Group();
    boomGroup.position.set(0, 0, -5);
    
    // Main Boom Base
    const boomBaseGeom = new THREE.CylinderGeometry(3, 4, 2, 32);
    const boomBase = new THREE.Mesh(boomBaseGeom, darkSteel);
    boomBase.position.y = 1;
    boomGroup.add(boomBase);

    // Main Articulated Arm
    const armGeom = new THREE.BoxGeometry(2, 15, 2);
    const mainArm = new THREE.Mesh(armGeom, steel);
    mainArm.position.y = 7.5;
    boomBase.add(mainArm);

    // Joint
    const jointGeom = new THREE.SphereGeometry(1.8, 32, 32);
    const joint1 = new THREE.Mesh(jointGeom, chrome);
    joint1.position.y = 15;
    mainArm.add(joint1);

    // Secondary Stick
    const stickGeom = new THREE.BoxGeometry(1.5, 12, 1.5);
    const stick = new THREE.Mesh(stickGeom, steel);
    stick.position.set(0, 6, 4); // Angled out
    stick.rotation.x = Math.PI / 4;
    joint1.add(stick);

    // Microwave Probe Head
    const probeHeadGeom = new THREE.CylinderGeometry(1.5, 1.5, 3, 16);
    const probeHead = new THREE.Mesh(probeHeadGeom, aluminum);
    probeHead.position.y = 6;
    probeHead.rotation.x = -Math.PI / 4; // Pointing down at STO
    stick.add(probeHead);

    const probeNeedle = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 6, 16), copper);
    probeNeedle.position.y = -3;
    probeHead.add(probeNeedle);

    // Hydraulics (Cylinder within Cylinder)
    const hydraulicOuterGeom = new THREE.CylinderGeometry(0.6, 0.6, 8, 16);
    const hydraulicOuter = new THREE.Mesh(hydraulicOuterGeom, darkSteel);
    hydraulicOuter.position.set(0, 5, 2.5);
    hydraulicOuter.rotation.x = -0.2;
    boomBase.add(hydraulicOuter);

    const hydraulicInnerGeom = new THREE.CylinderGeometry(0.3, 0.3, 8, 16);
    const hydraulicInner = new THREE.Mesh(hydraulicInnerGeom, chrome);
    hydraulicInner.position.set(0, 4, 0);
    hydraulicOuter.add(hydraulicInner);
    
    animatables.pistons.push({ inner: hydraulicInner, arm: mainArm });

    group.add(boomGroup);

    parts.push({
        name: "Hydraulic Elevation Boom",
        description: "Articulated dual-arm system operated by high-pressure fluid pistons.",
        material: "Steel / Dark Steel / Chrome",
        function: "Precisely positions the Microwave Pick-up Probe over the nanoscale oscillator.",
        assemblyOrder: 3,
        connections: ["Microwave Frequency Pick-up Probe", "Vibranium-Reinforced Mobile Chassis"],
        failureEffect: "Probe misalignment, preventing signal reading.",
        cascadeFailures: ["Quantum State Analyzer Array"],
        originalPosition: { x: 0, y: 0, z: -5 },
        explodedPosition: { x: 0, y: 15, z: -20 }
    });

    parts.push({
        name: "Microwave Frequency Pick-up Probe",
        description: "Highly sensitive copper-tungsten needle assembly for capturing high-frequency RF signals.",
        material: "Aluminum / Copper",
        function: "Detects the oscillating voltage generated by the magnetoresistance effect in the STO.",
        assemblyOrder: 4,
        connections: ["Hydraulic Elevation Boom", "Top Contact Electrode"],
        failureEffect: "Loss of microwave signal.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 16.5, z: -5 },
        explodedPosition: { x: 0, y: 30, z: -10 }
    });


    // ==========================================
    // 4. SPIN TORQUE OSCILLATOR CORE (The Giant Nano-Pillar)
    // ==========================================
    const stoGroup = new THREE.Group();
    stoGroup.position.set(0, 4, 5);

    // Massive Support Pedestal
    const pedestalGeom = new THREE.LatheGeometry([
        new THREE.Vector2(8, 0),
        new THREE.Vector2(7.5, 1),
        new THREE.Vector2(6, 2),
        new THREE.Vector2(5, 4),
        new THREE.Vector2(5, 5)
    ], 64);
    const pedestal = new THREE.Mesh(pedestalGeom, chrome);
    stoGroup.add(pedestal);

    // Bottom Electrode (Thick Copper)
    const bottomElecGeom = new THREE.CylinderGeometry(4.8, 5, 2, 64);
    const bottomElec = new THREE.Mesh(bottomElecGeom, copper);
    bottomElec.position.y = 6;
    stoGroup.add(bottomElec);

    // Pinned Layer (Synthetic Antiferromagnet - SAF)
    const pinnedLayerGeom = new THREE.CylinderGeometry(4.5, 4.8, 3, 64);
    const pinnedLayer = new THREE.Mesh(pinnedLayerGeom, darkSteel);
    pinnedLayer.position.y = 8.5;
    stoGroup.add(pinnedLayer);

    // Pinned Layer Static Spins (Arrows)
    for(let i=0; i<12; i++) {
        for(let j=0; j<3; j++) {
            const arrowGroup = new THREE.Group();
            const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1), neonRed);
            const head = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.6), neonRed);
            head.position.y = 0.8;
            arrowGroup.add(shaft);
            arrowGroup.add(head);
            
            const radius = 1 + j * 1.2;
            const angle = (i / 12) * Math.PI * 2;
            arrowGroup.position.set(Math.cos(angle)*radius, 0, Math.sin(angle)*radius);
            arrowGroup.rotation.z = Math.PI / 2; // Fixed pointing right
            pinnedLayer.add(arrowGroup);
        }
    }

    parts.push({
        name: "Synthetic Antiferromagnet Pinned Layer",
        description: "Thick magnetic layer with a fixed magnetization vector, unaffected by external fields.",
        material: "Dark Steel / Cobalt-Iron-Boron",
        function: "Spin-polarizes the incoming electron current.",
        assemblyOrder: 5,
        connections: ["Bottom Contact Electrode", "Non-Magnetic Cu Spacer"],
        failureEffect: "Loss of spin polarization, killing the oscillator effect.",
        cascadeFailures: ["Precessing Free Layer"],
        originalPosition: { x: 0, y: 12.5, z: 5 },
        explodedPosition: { x: 0, y: 25, z: 5 }
    });

    // Spacer (Non-magnetic MgO or Cu)
    const spacerGeom = new THREE.CylinderGeometry(4.5, 4.5, 0.8, 64);
    const spacer = new THREE.Mesh(spacerGeom, glass);
    spacer.position.y = 10.4;
    stoGroup.add(spacer);

    parts.push({
        name: "Non-Magnetic Spacer",
        description: "Ultra-thin insulating (MgO) or metallic (Cu) barrier.",
        material: "Glass / Dielectric",
        function: "Decouples the magnetic layers while allowing spin-polarized electrons to tunnel or pass through.",
        assemblyOrder: 6,
        connections: ["Synthetic Antiferromagnet Pinned Layer", "Precessing Free Layer"],
        failureEffect: "Short circuit between magnetic layers, stopping the GMR/TMR effect.",
        cascadeFailures: ["Microwave Frequency Pick-up Probe"],
        originalPosition: { x: 0, y: 14.4, z: 5 },
        explodedPosition: { x: 0, y: 35, z: 5 }
    });

    // Free Layer (Precessing Magnetization)
    const freeLayerGeom = new THREE.CylinderGeometry(4.5, 4.5, 2, 64);
    const freeLayer = new THREE.Mesh(freeLayerGeom, steel);
    freeLayer.position.y = 11.8;
    stoGroup.add(freeLayer);

    const freeLayerSpins = new THREE.Group();
    for(let i=0; i<12; i++) {
        for(let j=0; j<3; j++) {
            const arrowGroup = new THREE.Group();
            const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.2), neonBlue);
            const head = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.6), neonBlue);
            head.position.y = 0.9;
            arrowGroup.add(shaft);
            arrowGroup.add(head);
            
            const radius = 1 + j * 1.2;
            const angle = (i / 12) * Math.PI * 2;
            arrowGroup.position.set(Math.cos(angle)*radius, 0, Math.sin(angle)*radius);
            freeLayerSpins.add(arrowGroup);
        }
    }
    freeLayer.add(freeLayerSpins);
    animatables.spins.push(freeLayerSpins); // We will animate precession here

    parts.push({
        name: "Precessing Free Layer",
        description: "Thin magnetic layer whose magnetization vector is free to rotate.",
        material: "Steel / Permalloy",
        function: "Absorbs spin angular momentum from the current, entering a steady state of microwave frequency precession.",
        assemblyOrder: 7,
        connections: ["Non-Magnetic Spacer", "Top Contact Electrode"],
        failureEffect: "Magnetization pins to a static direction, halting microwave emission.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 15.8, z: 5 },
        explodedPosition: { x: 0, y: 45, z: 5 }
    });

    // Top Electrode (Thick Copper)
    const topElecGeom = new THREE.CylinderGeometry(4.0, 4.5, 1.5, 64);
    const topElec = new THREE.Mesh(topElecGeom, copper);
    topElec.position.y = 13.55;
    stoGroup.add(topElec);

    // Microwave Emissions (Expanding Toruses)
    for(let i=0; i<3; i++) {
        const mwGeom = new THREE.TorusGeometry(5, 0.2, 16, 64);
        const mw = new THREE.Mesh(mwGeom, neonGreen);
        mw.position.y = 11.8; // Centered on free layer
        mw.rotation.x = Math.PI / 2;
        stoGroup.add(mw);
        animatables.microwaves.push({ mesh: mw, offset: i * 2.0 });
    }

    // Electron Flow (Spin-polarized current)
    const electronGroup = new THREE.Group();
    for(let i=0; i<30; i++) {
        const electron = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), neonBlue);
        electron.userData = { 
            radius: Math.random() * 4, 
            angle: Math.random() * Math.PI * 2,
            speed: 5 + Math.random() * 5,
            heightOffset: Math.random() * 10
        };
        electronGroup.add(electron);
        animatables.electrons.push(electron);
    }
    stoGroup.add(electronGroup);

    group.add(stoGroup);

    parts.push({
        name: "Top Contact Electrode",
        description: "Conductive cap for current extraction.",
        material: "Copper",
        function: "Completes the electrical circuit and provides a contact pad for the microwave probe.",
        assemblyOrder: 8,
        connections: ["Precessing Free Layer", "Microwave Frequency Pick-up Probe"],
        failureEffect: "Open circuit, preventing spin-polarized current injection.",
        cascadeFailures: ["Precessing Free Layer", "Synthetic Antiferromagnet Pinned Layer"],
        originalPosition: { x: 0, y: 17.55, z: 5 },
        explodedPosition: { x: 0, y: 55, z: 5 }
    });


    // ==========================================
    // 5. SUPERCONDUCTING ELECTROMAGNET COILS
    // ==========================================
    const magnetGroup = new THREE.Group();
    magnetGroup.position.set(0, 15.8, 5); // Aligned with free layer
    
    const coilRadius = 9;
    const coreGeom = new THREE.TorusGeometry(coilRadius, 1.5, 32, 64);
    const core = new THREE.Mesh(coreGeom, darkSteel);
    core.rotation.x = Math.PI / 2;
    magnetGroup.add(core);

    // Procedural Copper Windings
    const wrapCount = 150;
    for(let i=0; i<wrapCount; i++) {
        const wrapAngle = (i / wrapCount) * Math.PI * 2;
        const wrapGeom = new THREE.TorusGeometry(1.6, 0.15, 8, 16);
        const wrap = new THREE.Mesh(wrapGeom, copper);
        wrap.position.set(Math.cos(wrapAngle)*coilRadius, 0, Math.sin(wrapAngle)*coilRadius);
        wrap.rotation.y = -wrapAngle;
        wrap.rotation.x = Math.PI / 2;
        core.add(wrap);
    }

    // Support Struts for Magnet
    for(let i=0; i<4; i++) {
        const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 12, 16), steel);
        const angle = (i / 4) * Math.PI * 2 + Math.PI/4;
        strut.position.set(Math.cos(angle)*8, -6, Math.sin(angle)*8);
        magnetGroup.add(strut);
    }

    group.add(magnetGroup);

    parts.push({
        name: "Superconducting Electromagnet Coils",
        description: "Massive torus completely wrapped in procedural copper windings.",
        material: "Dark Steel / Copper",
        function: "Applies an external static magnetic field (Oersted field) to tune the oscillator's base frequency.",
        assemblyOrder: 9,
        connections: ["Vibranium-Reinforced Mobile Chassis", "Precessing Free Layer"],
        failureEffect: "Loss of tuning field, causing chaotic/unstable precession.",
        cascadeFailures: ["Quantum State Analyzer Array"],
        originalPosition: { x: 0, y: 15.8, z: 5 },
        explodedPosition: { x: 0, y: 15.8, z: 25 }
    });

    // ==========================================
    // 6. COOLING LIQUID N2 LINES (Complex Tubes)
    // ==========================================
    const tubePath1 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-10, -3, 0),
        new THREE.Vector3(-12, 2, 2),
        new THREE.Vector3(-9, 10, 5),
        new THREE.Vector3(-6, 15, 6),
        new THREE.Vector3(0, 16, 9) // Connects to magnet
    ]);
    const tubePath2 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(10, -3, 0),
        new THREE.Vector3(12, 2, 2),
        new THREE.Vector3(9, 10, 5),
        new THREE.Vector3(6, 15, 6),
        new THREE.Vector3(0, 16, 9)
    ]);

    const tubeGeom1 = new THREE.TubeGeometry(tubePath1, 64, 0.6, 16, false);
    const tubeGeom2 = new THREE.TubeGeometry(tubePath2, 64, 0.6, 16, false);
    const coolingTube1 = new THREE.Mesh(tubeGeom1, plastic);
    const coolingTube2 = new THREE.Mesh(tubeGeom2, plastic);
    
    // Add pulsing emissive liquid inside tubes
    const liquidGeom1 = new THREE.TubeGeometry(tubePath1, 64, 0.4, 16, false);
    const liquidGeom2 = new THREE.TubeGeometry(tubePath2, 64, 0.4, 16, false);
    const liquid1 = new THREE.Mesh(liquidGeom1, neonBlue);
    const liquid2 = new THREE.Mesh(liquidGeom2, neonBlue);

    group.add(coolingTube1);
    group.add(coolingTube2);
    group.add(liquid1);
    group.add(liquid2);
    animatables.screens.push(liquid1); // Reuse screen emissive pulsing logic for liquid
    animatables.screens.push(liquid2);

    parts.push({
        name: "Cooling Liquid N2 Lines",
        description: "Cryogenic transport tubes constructed via TubeGeometry following CatmullRom curves.",
        material: "Plastic / Liquid Nitrogen (Emissive)",
        function: "Maintains superconducting temperatures for the electromagnet coils.",
        assemblyOrder: 10,
        connections: ["Superconducting Electromagnet Coils", "Vibranium-Reinforced Mobile Chassis"],
        failureEffect: "Magnet quench, explosive thermal expansion, system destruction.",
        cascadeFailures: ["Superconducting Electromagnet Coils"],
        originalPosition: { x: 0, y: 5, z: 5 },
        explodedPosition: { x: -20, y: 5, z: 5 }
    });

    // ==========================================
    // 7. OPERATOR CABIN & ANALYZER RACK
    // ==========================================
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(0, 2, -12);

    const cabinShape = new THREE.Shape();
    cabinShape.moveTo(-6, 0);
    cabinShape.lineTo(6, 0);
    cabinShape.lineTo(6, 10);
    cabinShape.lineTo(3, 14);
    cabinShape.lineTo(-3, 14);
    cabinShape.lineTo(-6, 10);
    cabinShape.lineTo(-6, 0);

    const cabinGeom = new THREE.ExtrudeGeometry(cabinShape, { depth: 8, bevelEnabled: true });
    const cabin = new THREE.Mesh(cabinGeom, darkSteel);
    cabinGroup.add(cabin);

    // Tinted Glass Window
    const windowGeom = new THREE.PlaneGeometry(10, 6);
    const cabinWindow = new THREE.Mesh(windowGeom, tinted);
    cabinWindow.position.set(0, 8, 8.1);
    cabinGroup.add(cabinWindow);

    // Glowing Control Screens inside cabin (visible through glass)
    const screenGeom = new THREE.BoxGeometry(4, 2, 0.2);
    const screen1 = new THREE.Mesh(screenGeom, neonGreen);
    screen1.position.set(-2, 6, 7.5);
    screen1.rotation.x = -0.2;
    cabinGroup.add(screen1);
    animatables.screens.push(screen1);

    const screen2 = new THREE.Mesh(screenGeom, neonRed);
    screen2.position.set(2, 6, 7.5);
    screen2.rotation.x = -0.2;
    cabinGroup.add(screen2);
    animatables.screens.push(screen2);

    // External Radar/Comm Dish
    const dishGeom = new THREE.LatheGeometry([
        new THREE.Vector2(0, 0),
        new THREE.Vector2(1, 0.2),
        new THREE.Vector2(3, 1),
        new THREE.Vector2(4, 2)
    ], 32);
    const dish = new THREE.Mesh(dishGeom, aluminum);
    dish.position.set(0, 15, 4);
    dish.rotation.x = Math.PI / 4;
    cabinGroup.add(dish);
    animatables.gears.push(dish); // Rotate dish

    group.add(cabinGroup);

    parts.push({
        name: "Quantum State Analyzer Rack & Cabin",
        description: "Armored control center featuring tinted blast glass, control panels, and a telemetry dish.",
        material: "Dark Steel / Tinted Glass / Neon Emissives",
        function: "Processes the GHz microwave signals and ensures safe operation of the rig.",
        assemblyOrder: 11,
        connections: ["Vibranium-Reinforced Mobile Chassis"],
        failureEffect: "Loss of telemetry and control.",
        cascadeFailures: ["Hydraulic Elevation Boom"],
        originalPosition: { x: 0, y: 2, z: -12 },
        explodedPosition: { x: 0, y: 10, z: -30 }
    });

    parts.push({
        name: "Spin-Polarized Current Injector",
        description: "Power regulation subsystem linked to the bottom electrode.",
        material: "Copper / Steel",
        function: "Supplies the DC current necessary to generate the spin transfer torque.",
        assemblyOrder: 12,
        connections: ["Bottom Contact Electrode"],
        failureEffect: "Loss of DC current, oscillator ceases.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 6, z: 5 },
        explodedPosition: { x: -15, y: -5, z: 15 }
    });


    // ==========================================
    // DATA: QUIZ QUESTIONS
    // ==========================================
    const quizQuestions = [
        {
            question: "What physical mechanism drives the steady precession of magnetization in a Spin Torque Oscillator?",
            options: [
                "Thermal fluctuations",
                "Spin-polarized current transferring angular momentum",
                "External mechanical rotation",
                "Nuclear magnetic resonance"
            ],
            correctAnswer: 1,
            explanation: "In an STO, a DC current is spin-polarized by a pinned magnetic layer. When these electrons enter the free layer, they transfer their spin angular momentum, creating a torque that counters damping and drives steady precession."
        },
        {
            question: "Which component of the STO stack acts as a reference and maintains a fixed magnetization direction?",
            options: [
                "The Free Layer",
                "The Non-Magnetic Spacer",
                "The Top Electrode",
                "The Pinned Layer (Synthetic Antiferromagnet)"
            ],
            correctAnswer: 3,
            explanation: "The pinned layer has a fixed, hard-to-change magnetization. It serves to polarize the incoming electron spins relative to its fixed axis."
        },
        {
            question: "What is the primary function of the non-magnetic spacer (e.g., MgO or Cu) in the STO?",
            options: [
                "To increase the weight of the device",
                "To decouple the magnetic layers while allowing electrons to tunnel or pass",
                "To absorb all microwave radiation",
                "To act as a heat sink"
            ],
            correctAnswer: 1,
            explanation: "The spacer prevents direct exchange coupling between the free and pinned layers, but is thin enough to allow spin-polarized current to pass through via tunneling (MgO) or standard conduction (Cu)."
        },
        {
            question: "What output frequency range is typical for a nanoscale Spin Torque Oscillator?",
            options: [
                "Audio frequencies (20 Hz - 20 kHz)",
                "Microwave frequencies (Gigahertz, GHz)",
                "Optical frequencies (Terahertz, THz)",
                "Low frequencies (Sub-Hz)"
            ],
            correctAnswer: 1,
            explanation: "STOs typically operate in the Gigahertz (GHz) range, making them excellent candidates for nanoscale microwave frequency generators in telecommunications."
        },
        {
            question: "How is the magnetic precession in the free layer converted into a readable electrical signal?",
            options: [
                "Through acoustic sound waves",
                "By measuring the physical spinning of the device",
                "Via the Magnetoresistance effect (GMR/TMR) changing electrical resistance",
                "Using a thermometer to measure heat fluctuations"
            ],
            correctAnswer: 2,
            explanation: "As the free layer's magnetization precesses relative to the pinned layer, the device's electrical resistance oscillates due to Giant (GMR) or Tunneling (TMR) Magnetoresistance. Passing a DC current through this oscillating resistance creates an oscillating AC voltage signal."
        }
    ];

    // ==========================================
    // ANIMATION FUNCTION
    // ==========================================
    function animate(time, speed, meshes) {
        // 1. Wheel Rotation (Mobile Rig)
        animatables.wheels.forEach(wheel => {
            wheel.rotation.x += 0.05 * speed;
        });

        // 2. Precessing Free Layer Spins
        // The spins should precess (cone-like rotation) due to spin torque
        animatables.spins.forEach(spinGroup => {
            // Cone angle (tilt)
            const coneAngle = Math.PI / 4;
            // Precession around the z-axis
            const precessionPhase = time * speed * 5;
            
            spinGroup.rotation.x = coneAngle * Math.cos(precessionPhase);
            spinGroup.rotation.y = coneAngle * Math.sin(precessionPhase);
        });

        // 3. Electron Flow (Spin current moving vertically)
        animatables.electrons.forEach(electron => {
            electron.userData.heightOffset += speed * electron.userData.speed * 0.05;
            if (electron.userData.heightOffset > 15) {
                electron.userData.heightOffset = 0; // Reset at bottom
            }
            
            // Swirling motion upwards through the pillar
            const yPos = 6 + electron.userData.heightOffset;
            const radius = electron.userData.radius;
            const angle = electron.userData.angle + (time * speed * 2);
            
            electron.position.set(
                Math.cos(angle) * radius,
                yPos,
                Math.sin(angle) * radius
            );
        });

        // 4. Microwave Emissions (Pulsing and Expanding)
        animatables.microwaves.forEach(mw => {
            mw.offset += speed * 0.1;
            if (mw.offset > 5) mw.offset = 0;
            
            // Expand scale and fade out
            const scale = 1 + mw.offset;
            mw.mesh.scale.set(scale, scale, scale);
            
            // Update opacity/emissive intensity based on scale
            const intensity = Math.max(0, 1 - (mw.offset / 5));
            mw.mesh.material.opacity = intensity;
        });

        // 5. Hydraulic Pistons (Pumping action)
        animatables.pistons.forEach(piston => {
            const pump = Math.sin(time * speed) * 1.5;
            piston.inner.position.y = 4 + pump;
            // Slight angle adjustment for the arm based on pump
            piston.arm.rotation.z = pump * 0.05;
        });

        // 6. Rotating Telemetry Dish
        animatables.gears.forEach(gear => {
            gear.rotation.y = time * speed * 2;
        });

        // 7. Screen Pulsing
        animatables.screens.forEach(screen => {
            const pulse = (Math.sin(time * speed * 5) + 1) / 2;
            screen.material.emissiveIntensity = 1 + pulse * 2;
        });
    }

    return { group, parts, description: "A massive, mobile macroscopic simulation rig representing a Nanoscale Spintronics Spin Torque Oscillator. Features a synthetic antiferromagnet pinned layer, precessing free layer, and microwave generation driven by spin-polarized current.", quizQuestions, animate };
}

// Auto-generated missing stub
export function createSpinTorqueOscillator() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
