import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Advanced Emissive and Custom Materials
    const neonRed = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 2, metalness: 0.5, roughness: 0.2 });
    const neonBlue = new THREE.MeshStandardMaterial({ color: 0x0088ff, emissive: 0x0088ff, emissiveIntensity: 1, metalness: 0.2, roughness: 0.1 });
    const neonGreen = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 1.5, metalness: 0.3, roughness: 0.2 });
    const neonAmber = new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xff8800, emissiveIntensity: 2, metalness: 0.3, roughness: 0.2 });
    const hotCopper = new THREE.MeshStandardMaterial({ color: 0xff5500, emissive: 0xcc2200, emissiveIntensity: 0.8, metalness: 0.8, roughness: 0.4 });
    const meltMaterial = new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xff8800, emissiveIntensity: 0.5, roughness: 0.1, transparent: true, opacity: 0.95 });

    // ==========================================
    // 1. Base Frame & Heavy Chassis
    // ==========================================
    const frameGroup = new THREE.Group();
    
    // Extruded Main Columns
    const chassisShape = new THREE.Shape();
    chassisShape.moveTo(-3, 0);
    chassisShape.lineTo(3, 0);
    chassisShape.lineTo(3, 2);
    chassisShape.lineTo(1.5, 4);
    chassisShape.lineTo(1.5, 18);
    chassisShape.lineTo(-1.5, 18);
    chassisShape.lineTo(-1.5, 4);
    chassisShape.lineTo(-3, 2);
    chassisShape.lineTo(-3, 0);
    
    const extrudeSettings = { depth: 5, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.15, bevelThickness: 0.15 };
    const chassisGeom = new THREE.ExtrudeGeometry(chassisShape, extrudeSettings);
    const mainChassis = new THREE.Mesh(chassisGeom, darkSteel);
    mainChassis.position.set(0, 2, -2.5);
    frameGroup.add(mainChassis);
    
    // Rivets and Panel Lines on Frame
    for (let i = 0; i < 15; i++) {
        const rivetLeft = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), chrome);
        rivetLeft.position.set(-2.8, 1 + i, 2.55);
        mainChassis.add(rivetLeft);
        
        const rivetRight = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), chrome);
        rivetRight.position.set(2.8, 1 + i, 2.55);
        mainChassis.add(rivetRight);
    }
    
    group.add(frameGroup);
    parts.push({
        name: "Main Monolithic Chassis",
        description: "Heavy-duty extruded steel backbone. Provides ultimate rigidity against the 100 kN downforce of the extrusion ram.",
        material: "Dark Steel Alloy",
        function: "Supports all high-pressure components and absorbs machine vibration.",
        assemblyOrder: 1,
        connections: ["Mobility Casters", "Heating Barrel", "Drive Screws"],
        failureEffect: "Micro-deflections during extrusion, completely invalidating rheological viscosity curves.",
        cascadeFailures: ["Piston Binding", "Catastrophic Frame Fracture"],
        originalPosition: {x: 0, y: 2, z: 0},
        explodedPosition: {x: 0, y: 0, z: -15}
    });

    // ==========================================
    // 2. Heavy-Duty Caster Wheels & Treads
    // ==========================================
    const wheelGroup = new THREE.Group();
    const wheelPositions = [
        [-3.2, 1.2, 2], [3.2, 1.2, 2],
        [-3.2, 1.2, -2.5], [3.2, 1.2, -2.5]
    ];
    
    meshes.wheels = [];
    wheelPositions.forEach((pos) => {
        const caster = new THREE.Group();
        
        // Complex Tire (Torus + Lugs)
        const tireGeom = new THREE.TorusGeometry(0.9, 0.4, 24, 64);
        const tire = new THREE.Mesh(tireGeom, rubber);
        tire.rotation.y = Math.PI / 2;
        caster.add(tire);
        
        // Aggressive Treads
        const treadGeom = new THREE.BoxGeometry(0.9, 0.15, 0.25);
        for(let t = 0; t < 72; t++) {
            const angle = (t / 72) * Math.PI * 2;
            const tread = new THREE.Mesh(treadGeom, rubber);
            tread.position.set(0, Math.cos(angle) * 1.25, Math.sin(angle) * 1.25);
            tread.rotation.x = -angle;
            caster.add(tread);
        }
        
        // Spoked Rim
        const rimGeom = new THREE.CylinderGeometry(0.7, 0.7, 0.5, 32);
        const rim = new THREE.Mesh(rimGeom, aluminum);
        rim.rotation.z = Math.PI / 2;
        caster.add(rim);
        
        const spokeGeom = new THREE.CylinderGeometry(0.08, 0.08, 1.4, 16);
        for(let s = 0; s < 12; s++) {
            const spoke = new THREE.Mesh(spokeGeom, chrome);
            spoke.rotation.x = (s / 12) * Math.PI;
            caster.add(spoke);
        }
        
        // Caster Fork
        const forkGeom = new THREE.BoxGeometry(0.3, 2, 0.3);
        const forkLeft = new THREE.Mesh(forkGeom, steel);
        forkLeft.position.set(0.4, 0.8, 0);
        caster.add(forkLeft);
        
        const forkRight = new THREE.Mesh(forkGeom, steel);
        forkRight.position.set(-0.4, 0.8, 0);
        caster.add(forkRight);
        
        const forkBridge = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.3, 0.5), steel);
        forkBridge.position.set(0, 1.8, 0);
        caster.add(forkBridge);
        
        caster.position.set(...pos);
        wheelGroup.add(caster);
        meshes.wheels.push(caster);
    });
    
    group.add(wheelGroup);
    parts.push({
        name: "All-Terrain Mobility Casters",
        description: "Oversized, aggressive treaded tires with complex spoked aluminum rims.",
        material: "Vulcanized Rubber & Aluminum",
        function: "Enables repositioning of the multi-ton rheometer unit across uneven industrial laboratory floors.",
        assemblyOrder: 2,
        connections: ["Main Monolithic Chassis"],
        failureEffect: "Machine becomes permanently stranded and susceptible to floor vibrations.",
        cascadeFailures: ["Leveling Calibration Loss"],
        originalPosition: {x: 0, y: 1.2, z: 0},
        explodedPosition: {x: 0, y: -6, z: 0}
    });

    // ==========================================
    // 3. Isothermal Heating Barrel
    // ==========================================
    const barrelGroup = new THREE.Group();
    
    // Highly detailed Lathe geometry for the exterior of the barrel
    const barrelPoints = [];
    for (let i = 0; i <= 30; i++) {
        const y = 5 + (i * 0.3);
        let r = 1.4;
        if (i % 5 === 0) r = 1.6; // Cooling fins / ridges
        barrelPoints.push(new THREE.Vector2(r, y));
    }
    const barrelGeom = new THREE.LatheGeometry(barrelPoints, 64);
    const barrel = new THREE.Mesh(barrelGeom, steel);
    barrelGroup.add(barrel);
    
    // Internal bore capillary guide
    const boreGeom = new THREE.CylinderGeometry(0.3, 0.3, 9, 32);
    const bore = new THREE.Mesh(boreGeom, chrome);
    bore.position.set(0, 9.5, 0);
    barrelGroup.add(bore);
    
    group.add(barrelGroup);
    parts.push({
        name: "Multi-Zone Isothermal Barrel",
        description: "Precision-honed steel alloy cylinder designed to withstand 2,500 bar of internal pressure at 400°C.",
        material: "Hardened Tool Steel",
        function: "Contains the polymer melt and ensures uniform thermal distribution.",
        assemblyOrder: 3,
        connections: ["Induction Heating Coils", "Main Monolithic Chassis", "Tungsten Capillary Die"],
        failureEffect: "Micro-fissures in the barrel wall leading to catastrophic explosive decompression of molten polymer.",
        cascadeFailures: ["Total Machine Loss", "Lethal Shrapnel Emission"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 5, z: 10}
    });

    // ==========================================
    // 4. Induction Heating Coils
    // ==========================================
    const coilGroup = new THREE.Group();
    class SpiralCurve extends THREE.Curve {
        constructor(radius, height, turns, startY) {
            super();
            this.radius = radius;
            this.height = height;
            this.turns = turns;
            this.startY = startY;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const angle = 2 * Math.PI * this.turns * t;
            const x = Math.cos(angle) * this.radius;
            const z = Math.sin(angle) * this.radius;
            const y = this.startY + (this.height * t);
            return optionalTarget.set(x, y, z);
        }
    }
    
    meshes.heatingCoils = [];
    const zones = [{start: 5.2, h: 3, turns: 12}, {start: 8.5, h: 3, turns: 12}, {start: 11.8, h: 2, turns: 8}];
    
    zones.forEach(zone => {
        const spiral = new SpiralCurve(1.65, zone.h, zone.turns, zone.start);
        const coilGeom = new THREE.TubeGeometry(spiral, 200, 0.08, 16, false);
        const coil = new THREE.Mesh(coilGeom, hotCopper);
        coilGroup.add(coil);
        meshes.heatingCoils.push(coil);
    });

    group.add(coilGroup);
    parts.push({
        name: "High-Frequency Induction Coils",
        description: "Three independent zones of copper tubing for ultra-fast, gradient-free heating.",
        material: "High-Purity Copper",
        function: "Melts the polymer granules and maintains precise isothermal testing conditions.",
        assemblyOrder: 4,
        connections: ["Multi-Zone Isothermal Barrel", "Power Supply Manifold"],
        failureEffect: "Thermal gradients causing uneven melt viscosity and completely flawed rheological data.",
        cascadeFailures: ["Melt Fracture", "Die Blockage"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -8, y: 0, z: 10}
    });

    // ==========================================
    // 5. Twin Ball-Screw Drive & Servos
    // ==========================================
    const driveGroup = new THREE.Group();
    meshes.driveScrews = [];
    meshes.motorFins = [];
    
    for(let sign of [-1, 1]) {
        // Massive Drive Screw
        const screwGeom = new THREE.CylinderGeometry(0.4, 0.4, 22, 32);
        const screw = new THREE.Mesh(screwGeom, steel);
        screw.position.set(sign * 2.5, 18, 0);
        
        // Detailed Threads
        const threadCurve = new SpiralCurve(0.42, 22, 60, -11);
        const threadGeom = new THREE.TubeGeometry(threadCurve, 500, 0.05, 8, false);
        const thread = new THREE.Mesh(threadGeom, chrome);
        screw.add(thread);
        
        driveGroup.add(screw);
        meshes.driveScrews.push(screw);
        
        // Heavy Servomotors
        const motorGeom = new THREE.CylinderGeometry(1.2, 1.2, 3, 32);
        const motor = new THREE.Mesh(motorGeom, darkSteel);
        motor.position.set(sign * 2.5, 30.5, 0);
        
        // Motor Cooling Fins
        for(let f = 0; f < 12; f++) {
            const finGeom = new THREE.TorusGeometry(1.25, 0.1, 8, 32);
            const fin = new THREE.Mesh(finGeom, aluminum);
            fin.position.set(0, -1.2 + (f * 0.2), 0);
            fin.rotation.x = Math.PI / 2;
            motor.add(fin);
            meshes.motorFins.push(fin);
        }
        
        driveGroup.add(motor);
    }
    
    // Top Synchronization Bridge
    const bridgeGeom = new THREE.BoxGeometry(7, 1.5, 2.5);
    const bridge = new THREE.Mesh(bridgeGeom, darkSteel);
    bridge.position.set(0, 32.5, 0);
    driveGroup.add(bridge);
    
    group.add(driveGroup);
    parts.push({
        name: "Synchronized Twin Servomotor Drive",
        description: "Zero-backlash twin ball screws paired with high-torque brushless servomotors.",
        material: "Hardened Steel & Aluminum",
        function: "Forces the crosshead carriage downwards at infinitely variable, precise microscopic speeds.",
        assemblyOrder: 5,
        connections: ["Crosshead Carriage", "Main Monolithic Chassis", "Top Bridge"],
        failureEffect: "Asymmetric loading causing the crosshead to bind and shatter the ceramic insulators.",
        cascadeFailures: ["Motor Burnout", "Screw Thread Stripping"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 25, z: 12}
    });

    // ==========================================
    // 6. Extrusion Ram, Load Cell & Carriage
    // ==========================================
    const pistonGroup = new THREE.Group();
    
    // Crosshead Carriage
    const carriageShape = new THREE.Shape();
    carriageShape.moveTo(-3, -1);
    carriageShape.lineTo(3, -1);
    carriageShape.lineTo(4, 1);
    carriageShape.lineTo(-4, 1);
    carriageShape.lineTo(-3, -1);
    
    const carriageGeom = new THREE.ExtrudeGeometry(carriageShape, {depth: 2, bevelEnabled: true});
    const carriage = new THREE.Mesh(carriageGeom, darkSteel);
    carriage.position.set(0, 26, -1);
    pistonGroup.add(carriage);
    
    // Precision Load Cell
    const loadCellGeom = new THREE.CylinderGeometry(0.8, 0.8, 1.5, 32);
    const loadCell = new THREE.Mesh(loadCellGeom, aluminum);
    loadCell.position.set(0, 24.5, 0);
    
    const loadCellLight = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), neonRed);
    loadCellLight.position.set(0.7, 0, 0);
    loadCell.add(loadCellLight);
    meshes.loadCellLight = loadCellLight;
    pistonGroup.add(loadCell);
    
    // High-Pressure Piston Rod
    const rodGeom = new THREE.CylinderGeometry(0.29, 0.29, 14, 32);
    const rod = new THREE.Mesh(rodGeom, chrome);
    rod.position.set(0, 16.5, 0);
    pistonGroup.add(rod);
    
    // Piston Head (Teflon/Bronze seal visualization)
    const headGeom = new THREE.CylinderGeometry(0.3, 0.3, 0.5, 32);
    const head = new THREE.Mesh(headGeom, hotCopper);
    head.position.set(0, 9.25, 0);
    pistonGroup.add(head);

    group.add(pistonGroup);
    meshes.pistonGroup = pistonGroup;
    parts.push({
        name: "100kN Extrusion Ram & Load Cell",
        description: "Chrome-plated ram shaft equipped with a piezoelectric force transducer.",
        material: "Chrome Steel & Electronics",
        function: "Pushes the polymer melt through the die while measuring the exact axial force for shear stress calculation.",
        assemblyOrder: 6,
        connections: ["Crosshead Carriage", "Isothermal Barrel"],
        failureEffect: "Polymer leakage past the ram seals, destroying volumetric flow accuracy.",
        cascadeFailures: ["Sensor Overload", "Data Corruption"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 15, z: -10}
    });

    // ==========================================
    // 7. Capillary Die & Pressure Sensors
    // ==========================================
    const dieGroup = new THREE.Group();
    
    // Heavy Retaining Nut
    const nutGeom = new THREE.CylinderGeometry(1.8, 1.8, 1.2, 6);
    const nut = new THREE.Mesh(nutGeom, darkSteel);
    nut.position.set(0, 4.4, 0);
    dieGroup.add(nut);
    
    // Tungsten Die Insert
    const dieInsertGeom = new THREE.CylinderGeometry(0.6, 0.4, 2, 32);
    const dieInsert = new THREE.Mesh(dieInsertGeom, chrome);
    dieInsert.position.set(0, 3.5, 0);
    dieGroup.add(dieInsert);
    
    // Die Orifice
    const holeGeom = new THREE.CircleGeometry(0.08, 16);
    const hole = new THREE.Mesh(holeGeom, new THREE.MeshBasicMaterial({color: 0x000000}));
    hole.rotation.x = Math.PI / 2;
    hole.position.set(0, 2.49, 0);
    dieGroup.add(hole);
    
    // Flush-Mounted Melt Pressure Transducer
    const portGeom = new THREE.CylinderGeometry(0.15, 0.15, 1.5, 16);
    const port = new THREE.Mesh(portGeom, chrome);
    port.rotation.z = Math.PI / 2;
    port.position.set(1.5, 5, 0);
    dieGroup.add(port);
    
    const transducerGeom = new THREE.BoxGeometry(0.6, 0.6, 1);
    const transducer = new THREE.Mesh(transducerGeom, steel);
    transducer.position.set(2.4, 5, 0);
    dieGroup.add(transducer);
    
    // Transducer Cable
    const wireCurve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(2.7, 5, 0),
        new THREE.Vector3(4, 5, 0),
        new THREE.Vector3(4, 10, -2),
        new THREE.Vector3(2, 18, -2)
    );
    const wireGeom = new THREE.TubeGeometry(wireCurve, 30, 0.08, 8, false);
    const wire = new THREE.Mesh(wireGeom, rubber);
    dieGroup.add(wire);

    group.add(dieGroup);
    parts.push({
        name: "Tungsten Carbide Capillary Die",
        description: "Interchangeable micro-machined orifice (L/D 20:1) with zero-wear characteristics.",
        material: "Tungsten Carbide",
        function: "Creates the geometric restriction required to generate severe shear flow in the melt.",
        assemblyOrder: 7,
        connections: ["Isothermal Barrel", "Retaining Nut"],
        failureEffect: "Scored die walls leading to premature melt fracture and rough extrudate surface.",
        cascadeFailures: ["Invalid Viscosity Curves"],
        originalPosition: {x: 0, y: 4, z: 0},
        explodedPosition: {x: 0, y: -4, z: 8}
    });

    // ==========================================
    // 8. Hydraulic & Cooling Pipe Networks
    // ==========================================
    const pipeGroup = new THREE.Group();
    for (let p = 0; p < 6; p++) {
        const angle = (p / 6) * Math.PI * 2;
        const pipeCurve = new THREE.CubicBezierCurve3(
            new THREE.Vector3(Math.cos(angle)*1.7, 4.5, Math.sin(angle)*1.7),
            new THREE.Vector3(Math.cos(angle)*3.5, 8, Math.sin(angle)*3.5),
            new THREE.Vector3(Math.cos(angle)*2.5, 14, Math.sin(angle)*2.5),
            new THREE.Vector3(Math.cos(angle)*1.7, 17, Math.sin(angle)*1.7)
        );
        const pipeGeom = new THREE.TubeGeometry(pipeCurve, 50, 0.12, 12, false);
        const pipe = new THREE.Mesh(pipeGeom, copper);
        pipeGroup.add(pipe);
    }
    group.add(pipeGroup);
    parts.push({
        name: "Forced-Air Cooling Manifold",
        description: "Complex network of copper pipes delivering high-velocity air directly to the barrel.",
        material: "Copper",
        function: "Provides rapid thermal cycling and cooldowns between tests to increase lab throughput.",
        assemblyOrder: 8,
        connections: ["Isothermal Barrel", "Chassis Base"],
        failureEffect: "Thermal runaway or inability to cool down safely.",
        cascadeFailures: ["Overheating Fault"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -10, y: 5, z: 0}
    });

    // ==========================================
    // 9. Operator Cabin & HMI Console
    // ==========================================
    const cabinGroup = new THREE.Group();
    
    // Platform
    const platformGeom = new THREE.BoxGeometry(5, 0.6, 5);
    const platform = new THREE.Mesh(platformGeom, darkSteel);
    platform.position.set(6, 0.3, 4);
    cabinGroup.add(platform);
    
    // Operator Seat
    const seatBase = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.2, 16), steel);
    seatBase.position.set(6, 1, 4);
    cabinGroup.add(seatBase);
    
    const cushion = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.2, 1.2), rubber);
    cushion.position.set(6, 1.7, 4);
    cabinGroup.add(cushion);
    
    const backrest = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.5, 0.2), rubber);
    backrest.position.set(6, 2.5, 4.5);
    cabinGroup.add(backrest);
    
    // HMI Console Tower
    const consoleTower = new THREE.Mesh(new THREE.BoxGeometry(2, 4, 1.5), darkSteel);
    consoleTower.position.set(6, 2, 2);
    cabinGroup.add(consoleTower);
    
    // Glowing Touchscreens
    const mainScreen = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.2), neonBlue);
    mainScreen.position.set(6, 3.2, 1.24);
    mainScreen.rotation.x = -Math.PI / 6;
    cabinGroup.add(mainScreen);
    meshes.mainScreen = mainScreen;
    
    const secondaryScreen = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.8), neonAmber);
    secondaryScreen.position.set(6, 2.1, 1.24);
    cabinGroup.add(secondaryScreen);
    
    // Precision Steering Wheel (Carriage positioning)
    const steerTorus = new THREE.TorusGeometry(0.5, 0.06, 16, 32);
    const steerWheel = new THREE.Mesh(steerTorus, rubber);
    steerWheel.position.set(6, 2.8, 0.8);
    steerWheel.rotation.x = Math.PI / 3;
    cabinGroup.add(steerWheel);
    meshes.steerWheel = steerWheel;
    
    // Joysticks
    for(let j of [-1, 1]) {
        const joyBase = new THREE.Mesh(new THREE.SphereGeometry(0.15), rubber);
        joyBase.position.set(6 + (j*1.2), 2.5, 2);
        
        const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.05, 0.6), steel);
        stick.position.set(0, 0.3, 0);
        
        const knob = new THREE.Mesh(new THREE.SphereGeometry(0.1), neonRed);
        knob.position.set(0, 0.6, 0);
        
        joyBase.add(stick);
        joyBase.add(knob);
        cabinGroup.add(joyBase);
        
        if (j === -1) meshes.joyLeft = joyBase;
        else meshes.joyRight = joyBase;
    }
    
    // Protective Cabin Cage
    const cageGeom = new THREE.CylinderGeometry(2.5, 2.5, 5, 8, 1, true, 0, Math.PI * 1.5);
    const cage = new THREE.Mesh(cageGeom, tinted);
    cage.position.set(6, 3.5, 4);
    cage.rotation.y = Math.PI / 4;
    cabinGroup.add(cage);
    
    const cageWireGeom = new THREE.EdgesGeometry(cageGeom);
    const cageWire = new THREE.LineSegments(cageWireGeom, new THREE.LineBasicMaterial({color: 0x111111}));
    cageWire.position.set(6, 3.5, 4);
    cageWire.rotation.y = Math.PI / 4;
    cabinGroup.add(cageWire);

    group.add(cabinGroup);
    parts.push({
        name: "Operator Control Cabin & HMI",
        description: "Enclosed workstation with dual viscoelastic plotting screens and precision joysticks.",
        material: "Dark Steel & Tinted Lexan",
        function: "Safely houses the operator and provides fine manual control over the 100kN carriage.",
        assemblyOrder: 9,
        connections: ["Main Chassis", "Data Acquisition Network"],
        failureEffect: "Operator is exposed to 400°C radiant heat and high-pressure blowouts.",
        cascadeFailures: ["Human Error", "Safety Lockout"],
        originalPosition: {x: 6, y: 0, z: 4},
        explodedPosition: {x: 15, y: 0, z: 10}
    });

    // ==========================================
    // 10. Exhaust Stacks & Status Beacons
    // ==========================================
    const exhaustGroup = new THREE.Group();
    meshes.flaps = [];
    
    for (let e of [-1, 1]) {
        const stackGeom = new THREE.CylinderGeometry(0.4, 0.5, 8, 32);
        const stack = new THREE.Mesh(stackGeom, chrome);
        stack.position.set(e * 3.5, 12, -3);
        
        // Flapper valve
        const flap = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.05, 32), darkSteel);
        flap.position.set(0, 4, 0);
        stack.add(flap);
        meshes.flaps.push(flap);
        
        exhaustGroup.add(stack);
    }
    
    // Massive Status Beacon Array
    const beaconArray = new THREE.Group();
    const beaconBase = new THREE.Mesh(new THREE.BoxGeometry(3, 0.5, 1), darkSteel);
    beaconArray.add(beaconBase);
    
    const colors = [neonRed, neonAmber, neonGreen];
    meshes.beacons = [];
    colors.forEach((col, idx) => {
        const bulb = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.8, 16), col);
        bulb.position.set(-1 + idx, 0.65, 0);
        beaconArray.add(bulb);
        meshes.beacons.push(bulb);
    });
    beaconArray.position.set(0, 34, 0);
    exhaustGroup.add(beaconArray);

    group.add(exhaustGroup);
    parts.push({
        name: "VOC Exhaust Stacks & Beacon Array",
        description: "High-volume ventilation stacks and tricolor status tower.",
        material: "Chrome & Polycarbonate",
        function: "Evacuates toxic polymer fumes and alerts the laboratory to machine state.",
        assemblyOrder: 10,
        connections: ["Main Chassis", "Top Bridge"],
        failureEffect: "Hazardous fumes accumulate, triggering lab-wide evacuation.",
        cascadeFailures: ["Asphyxiation Hazard"],
        originalPosition: {x: 0, y: 12, z: -3},
        explodedPosition: {x: 0, y: 20, z: -10}
    });

    // ==========================================
    // 11. Laser Micrometer (Die Swell Sensor)
    // ==========================================
    const laserGroup = new THREE.Group();
    const emitterGeom = new THREE.BoxGeometry(0.8, 0.5, 0.5);
    const laserEmitter = new THREE.Mesh(emitterGeom, darkSteel);
    laserEmitter.position.set(-2, 1.5, 0);
    laserGroup.add(laserEmitter);
    
    const laserReceiver = new THREE.Mesh(emitterGeom, darkSteel);
    laserReceiver.position.set(2, 1.5, 0);
    laserGroup.add(laserReceiver);
    
    // Laser beam visualization
    const beamGeom = new THREE.CylinderGeometry(0.03, 0.03, 4, 16);
    const beamMat = new THREE.MeshBasicMaterial({color: 0xff0000, transparent: true, opacity: 0.6});
    const beam = new THREE.Mesh(beamGeom, beamMat);
    beam.rotation.z = Math.PI / 2;
    beam.position.set(0, 1.5, 0);
    laserGroup.add(beam);
    meshes.laserBeam = beam;
    
    group.add(laserGroup);
    parts.push({
        name: "Laser Extensometer / Micrometer",
        description: "High-speed 10kHz laser scanner positioned exactly below the die orifice.",
        material: "Electronics & Optics",
        function: "Quantifies Die Swell (extrudate elasticity) in real-time as the polymer exits the die.",
        assemblyOrder: 11,
        connections: ["Chassis Base", "Data Acquisition Network"],
        failureEffect: "Loss of extrudate expansion data.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 1.5, z: 0},
        explodedPosition: {x: 0, y: 1.5, z: 6}
    });

    // ==========================================
    // 12. Gravimetric Balance & Collection Bin
    // ==========================================
    const binGroup = new THREE.Group();
    const balance = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.4, 2.5), aluminum);
    balance.position.set(0, 0.2, 0);
    binGroup.add(balance);
    
    const scaleScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.4), neonGreen);
    scaleScreen.position.set(0, 0.25, 1.26);
    scaleScreen.rotation.x = -Math.PI / 4;
    balance.add(scaleScreen);
    meshes.scaleScreen = scaleScreen;
    
    // Heated Glass Beaker
    const beakerGeom = new THREE.CylinderGeometry(1, 0.8, 2, 32, 1, true);
    const beaker = new THREE.Mesh(beakerGeom, glass);
    beaker.position.set(0, 1.4, 0);
    const beakerBase = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.1, 32), glass);
    beakerBase.position.set(0, 0.45, 0);
    binGroup.add(beaker);
    binGroup.add(beakerBase);

    group.add(binGroup);
    parts.push({
        name: "Integrated Gravimetric Balance",
        description: "Sub-milligram precision analytical scale with a heated borosilicate collection bin.",
        material: "Aluminum & Glass",
        function: "Verifies the exact mass flow rate to correlate with volumetric displacement.",
        assemblyOrder: 12,
        connections: ["Chassis Base"],
        failureEffect: "Cannot determine melt density accurately.",
        cascadeFailures: ["Mass-Volumetric Discrepancy"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: 8}
    });

    // ==========================================
    // 13. Polymer Melt Extrudate (Animated Flow)
    // ==========================================
    const extrudateGroup = new THREE.Group();
    
    // Main Strand
    const strandGeom = new THREE.CylinderGeometry(0.12, 0.12, 4, 32);
    strandGeom.translate(0, -2, 0); // Origin at top for scaling down
    const strand = new THREE.Mesh(strandGeom, meltMaterial);
    strand.position.set(0, 2.45, 0);
    strand.scale.y = 0.01;
    extrudateGroup.add(strand);
    meshes.strand = strand;
    
    // Die Swell Bulge
    const swellGeom = new THREE.SphereGeometry(0.18, 32, 32);
    const swell = new THREE.Mesh(swellGeom, meltMaterial);
    swell.position.set(0, 2.3, 0);
    swell.scale.setScalar(0.01);
    extrudateGroup.add(swell);
    meshes.swell = swell;
    
    // Droplets
    meshes.droplets = [];
    for(let i = 0; i < 8; i++) {
        const drop = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), meltMaterial);
        drop.position.set(0, -10, 0);
        drop.userData = { phase: i * 0.125 };
        extrudateGroup.add(drop);
        meshes.droplets.push(drop);
    }
    
    // Smoke/VOC Particles
    meshes.smoke = [];
    const smokeGeom = new THREE.SphereGeometry(0.2, 8, 8);
    const smokeMat = new THREE.MeshBasicMaterial({color: 0xcccccc, transparent: true, opacity: 0.3});
    for(let s = 0; s < 15; s++) {
        const p = new THREE.Mesh(smokeGeom, smokeMat);
        p.position.set(0, -10, 0);
        p.userData = { offset: Math.random() * Math.PI * 2, speed: 0.5 + Math.random() };
        extrudateGroup.add(p);
        meshes.smoke.push(p);
    }

    group.add(extrudateGroup);
    parts.push({
        name: "Viscoelastic Polymer Melt",
        description: "The non-Newtonian thermoplastic material being characterized under extreme stress.",
        material: "Molten Polymer",
        function: "Flows out of the die, exhibiting complex behaviors like die swell and melt fracture.",
        assemblyOrder: 13,
        connections: ["Tungsten Capillary Die"],
        failureEffect: "Melt fracture ruins the smooth surface finish of the extrudate.",
        cascadeFailures: ["Sharkskin Defect"],
        originalPosition: {x: 0, y: 1.5, z: 0},
        explodedPosition: {x: 0, y: -2, z: 0}
    });

    const description = "The Ultra-High Pressure Capillary Rheometer is a colossal industrial apparatus engineered to characterize the flow and viscoelastic properties of complex non-Newtonian polymer melts under extreme conditions (up to 2,500 bar / 400°C). It utilizes a massive 100kN twin ball-screw servo-hydraulic carriage to force polymer through a precision tungsten carbide capillary die. Equipped with multi-zone induction heaters, flush-mounted pressure transducers, a laser micrometer for die swell measurement, and a shielded operator cabin, this machine provides the ultimate rheological data required for advanced plastic extrusion simulation and mold design.";

    const quizQuestions = [
        {
            question: "What is the primary function of the tungsten carbide capillary die?",
            options: [
                "To rapidly cool the polymer.",
                "To provide a precise geometric restriction of known length and diameter to generate shear flow.",
                "To mix additives into the polymer matrix.",
                "To filter out unmelted particles."
            ],
            correctAnswer: 1,
            explanation: "The capillary die creates a controlled restriction. By forcing the melt through it at a known volumetric rate and measuring the pressure drop, fundamental rheological properties like shear stress and shear rate are calculated."
        },
        {
            question: "Why does the machine require a massive frame and twin ball-screws capable of 100kN downforce?",
            options: [
                "To prevent the machine from tipping over.",
                "To withstand the immense back-pressure generated by pushing highly viscous polymer melts through a tiny micro-orifice at high speeds.",
                "To compress solid metal ingots.",
                "To ensure the heating coils do not vibrate."
            ],
            correctAnswer: 1,
            explanation: "Polymer melts have extremely high viscosity. Simulating injection molding shear rates requires pushing them through a tiny hole very quickly, which demands massive force. Any frame deflection corrupts the volumetric flow calculation."
        },
        {
            question: "What does the flush-mounted pressure transducer measure?",
            options: [
                "Hydraulic oil pressure in the servomotors.",
                "Ambient laboratory pressure.",
                "The actual driving pressure of the melt just before it enters the die, used for Bagley corrections.",
                "The clamping force of the safety shield."
            ],
            correctAnswer: 2,
            explanation: "The transducer measures the driving pressure directly above the die. This allows researchers to apply the Bagley correction, which isolates the true pressure drop across the die land by factoring out entrance/exit pressure losses."
        },
        {
            question: "What phenomenon is the high-speed Laser Micrometer designed to measure?",
            options: [
                "Die Swell (extrudate swelling due to elastic recovery).",
                "The descent speed of the crosshead carriage.",
                "The surface temperature of the extrudate.",
                "The opacity of the polymer melt."
            ],
            correctAnswer: 0,
            explanation: "Die swell occurs because polymer chains are stretched and aligned inside the die, and they elastically recoil (swell) upon exiting. Measuring the diameter increase provides crucial data on the melt's elasticity."
        },
        {
            question: "Why is an analytical gravimetric balance integrated under the extrusion die?",
            options: [
                "To catch drips to keep the lab clean.",
                "To calibrate the main 100kN load cell.",
                "To precisely measure mass flow rate and cross-reference it with volumetric flow to determine melt density and detect leaks.",
                "To weigh the final product for shipping."
            ],
            correctAnswer: 2,
            explanation: "While the piston gives a volumetric flow rate, knowing the exact mass extruded over time allows researchers to calculate the polymer's density at melt temperatures and verify that no polymer is leaking past the piston seals."
        }
    ];

    let testPhase = 0;
    
    function animate(time, speed, activeMeshes) {
        const t = time * speed;
        
        // 1. Heating Coils Pulsing (Thermal energy simulation)
        const heatPulse = (Math.sin(t * 3) + 1) / 2;
        if (activeMeshes.heatingCoils) {
            activeMeshes.heatingCoils.forEach(coil => {
                coil.material.emissiveIntensity = 0.6 + (heatPulse * 0.4);
            });
        }
        
        // 2. Status Beacons
        if (activeMeshes.beacons) {
            // Sequence: Red, Amber, Green flashing
            activeMeshes.beacons[0].material.emissiveIntensity = (Math.sin(t * 4) > 0) ? 2 : 0; // Red
            activeMeshes.beacons[1].material.emissiveIntensity = (Math.cos(t * 2) > 0) ? 1.5 : 0.5; // Amber
            activeMeshes.beacons[2].material.emissiveIntensity = 1; // Green solid
        }
        
        // 3. Exhaust Flaps
        if (activeMeshes.flaps) {
            activeMeshes.flaps.forEach(flap => {
                flap.rotation.x = -Math.PI/8 + (Math.sin(t * 10) * 0.1); // Fluttering under exhaust pressure
            });
        }
        
        // 4. Operator Cabin animations
        if (activeMeshes.steerWheel) {
            activeMeshes.steerWheel.rotation.z = Math.sin(t * 2) * 0.5;
        }
        if (activeMeshes.joyLeft && activeMeshes.joyRight) {
            activeMeshes.joyLeft.rotation.x = Math.sin(t * 4) * 0.2;
            activeMeshes.joyRight.rotation.z = Math.cos(t * 3) * 0.2;
        }
        if (activeMeshes.mainScreen) {
            // Simulate plotting graph on screen via emissive flicker
            activeMeshes.mainScreen.material.emissiveIntensity = 0.8 + Math.random() * 0.4;
        }

        // 5. Piston Stroke Cycle (Extrude down, then quick retract)
        testPhase = (t * 0.15) % 2; 
        
        let strokeY = 0;
        let screwRot = 0;
        
        if (testPhase < 1) {
            // Extruding stroke
            strokeY = THREE.MathUtils.lerp(0, -9, testPhase); // Ram moves down 9 units
            screwRot = t * 12;
            
            // Polymer Extrudate grows
            if (activeMeshes.strand) {
                const extrudateLength = testPhase * 2;
                activeMeshes.strand.scale.y = Math.max(0.01, extrudateLength);
                
                // Die swell effect expands as material exits
                const swellAmount = 1 + (testPhase * 0.8);
                activeMeshes.swell.scale.set(swellAmount, swellAmount, swellAmount);
            }
            
            // Polymer Droplets falling into beaker
            if (testPhase > 0.15 && activeMeshes.droplets) {
                activeMeshes.droplets.forEach((drop) => {
                    const dropT = (t * 2 + drop.userData.phase) % 1;
                    const dropStart = 2.45 - (activeMeshes.strand.scale.y * 4);
                    drop.position.y = dropStart - (dropT * 2.5);
                    drop.scale.setScalar(1 - dropT*0.5); // shrink as it falls
                });
            }
            
            // VOC Smoke emission
            if (activeMeshes.smoke) {
                activeMeshes.smoke.forEach((p) => {
                    const pT = (t * p.userData.speed + p.userData.offset) % 1;
                    p.position.y = 2.4 + (pT * 4);
                    p.position.x = Math.sin(pT * 5 + p.userData.offset) * pT;
                    p.position.z = Math.cos(pT * 5 + p.userData.offset) * pT;
                    p.scale.setScalar(pT * 3);
                    p.material.opacity = (1 - pT) * 0.3;
                });
            }
            
            // Laser Micrometer rapid scanning flicker
            if (activeMeshes.laserBeam) {
                activeMeshes.laserBeam.material.opacity = 0.3 + (Math.random() * 0.7);
            }
            
            // Load cell triggers under extreme stress
            if (activeMeshes.loadCellLight) {
                activeMeshes.loadCellLight.material.emissiveIntensity = Math.random() > 0.3 ? 3 : 0;
            }
            
            // Frame vibration under heavy load
            const vib = Math.sin(t * 60) * 0.02;
            if (activeMeshes.wheels) {
                activeMeshes.wheels.forEach(wheel => wheel.position.y = 1.2 + vib);
            }
            
        } else {
            // Retract stroke (resetting for next test)
            const retractPhase = testPhase - 1;
            strokeY = THREE.MathUtils.lerp(-9, 0, retractPhase);
            screwRot = -t * 25; // Fast reverse
            
            if (activeMeshes.strand) {
                activeMeshes.strand.scale.y = 0.01;
                activeMeshes.swell.scale.setScalar(0.01);
            }
            if (activeMeshes.droplets) {
                activeMeshes.droplets.forEach(drop => drop.position.y = -10);
            }
            if (activeMeshes.smoke) {
                activeMeshes.smoke.forEach(p => p.position.y = -10);
            }
            if (activeMeshes.laserBeam) activeMeshes.laserBeam.material.opacity = 0.1;
            if (activeMeshes.loadCellLight) activeMeshes.loadCellLight.material.emissiveIntensity = 0;
        }
        
        // Apply Carriage & Ram displacement
        if (activeMeshes.pistonGroup) {
            activeMeshes.pistonGroup.position.y = strokeY;
        }
        
        // Spin twin drive screws and motor cooling fins
        if (activeMeshes.driveScrews) {
            activeMeshes.driveScrews.forEach((screw, idx) => {
                screw.rotation.y = screwRot * (idx === 0 ? 1 : -1); // Counter-rotating
            });
        }
        if (activeMeshes.motorFins) {
            activeMeshes.motorFins.forEach(fin => fin.rotation.z = screwRot * 0.5);
        }
        
        // Scale Screen update effect
        if (activeMeshes.scaleScreen) {
            activeMeshes.scaleScreen.material.emissiveIntensity = 1 + (Math.random() * 0.5);
        }
    }

    return { group, parts, description, quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createCapillaryRheometer() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
