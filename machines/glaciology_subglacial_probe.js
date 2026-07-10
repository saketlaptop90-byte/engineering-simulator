import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Helper functions for geometry generation
    function createLathedGeometry(points, segments) {
        const vectorPoints = points.map(p => new THREE.Vector2(p[0], p[1]));
        return new THREE.LatheGeometry(vectorPoints, segments);
    }

    function createRibbedCylinder(radius, length, ribs, ribRadius, radialSegments) {
        const geom = new THREE.CylinderGeometry(radius, radius, length, radialSegments, ribs * 2);
        const positions = geom.attributes.position;
        for (let i = 0; i < positions.count; i++) {
            const y = positions.getY(i);
            const index = Math.floor((y + length / 2) / (length / ribs));
            if (index % 2 === 0) {
                positions.setX(i, positions.getX(i) * (1 + ribRadius));
                positions.setZ(i, positions.getZ(i) * (1 + ribRadius));
            }
        }
        geom.computeVertexNormals();
        return geom;
    }

    // Material Definitions (Enhanced with glowing effects)
    const hotGlowMaterial = new THREE.MeshStandardMaterial({
        color: 0xff4400,
        emissive: 0xff2200,
        emissiveIntensity: 5.0,
        metalness: 0.8,
        roughness: 0.2,
    });

    const warmGlowMaterial = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0xff6600,
        emissiveIntensity: 2.0,
        metalness: 0.5,
        roughness: 0.5,
    });

    const neonBlueMaterial = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0044ff,
        emissiveIntensity: 3.0,
        metalness: 0.3,
        roughness: 0.1,
    });

    const sensorGlow = new THREE.MeshStandardMaterial({
        color: 0x00ffaa,
        emissive: 0x00ffaa,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8
    });

    const reinforcedTitanium = new THREE.MeshStandardMaterial({
        color: 0x88929e,
        metalness: 0.9,
        roughness: 0.3,
        clearcoat: 0.2
    });

    const darkCeramic = new THREE.MeshStandardMaterial({
        color: 0x222222,
        metalness: 0.2,
        roughness: 0.8
    });

    const copperCoilMat = copper.clone();
    copperCoilMat.roughness = 0.4;
    copperCoilMat.metalness = 1.0;

    // --- SECTION 1: HEATED NOSE CONE ---
    const noseGroup = new THREE.Group();
    noseGroup.position.set(0, -15, 0);

    // 1. Nose Tip (Melt Head)
    const nosePoints = [];
    for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        const r = 1.5 * Math.pow(t, 0.5);
        const y = 3 * t;
        nosePoints.push([r, y]);
    }
    const noseTipGeom = createLathedGeometry(nosePoints, 64);
    const noseTip = new THREE.Mesh(noseTipGeom, hotGlowMaterial);
    noseTip.rotation.x = Math.PI;
    noseTip.position.y = -3;
    noseGroup.add(noseTip);
    meshes.noseTip = noseTip;

    parts.push({
        name: "Thermal Penetration Head",
        description: "The primary melt-head of the subglacial probe. It uses a high-output radioisotope thermal generator to produce extreme heat, melting through miles of glacial ice.",
        material: "Thermal Super-Alloy",
        function: "Ice Melting",
        assemblyOrder: 1,
        connections: ["Heat Sink Rings", "Forward Hull"],
        failureEffect: "Probe gets stuck in the ice as melting stops.",
        cascadeFailures: ["Mission Abort", "Cryogenic Freezing of Internals"],
        originalPosition: { x: 0, y: -18, z: 0 },
        explodedPosition: { x: 0, y: -25, z: 0 }
    });

    // 2. Heat Sink Rings
    const heatSinkGeom = new THREE.CylinderGeometry(1.5, 1.8, 3, 32, 12);
    const heatSink = new THREE.Mesh(heatSinkGeom, darkCeramic);
    for (let i = 0; i < 12; i++) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.1, 16, 64), hotGlowMaterial);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = -1.3 + (i * 0.25);
        heatSink.add(ring);
    }
    heatSink.position.y = -1.5;
    noseGroup.add(heatSink);
    meshes.heatSink = heatSink;

    parts.push({
        name: "Radial Heat Sink Rings",
        description: "A series of ceramic and tungsten rings designed to distribute heat radially outward, widening the melt-hole to accommodate the probe's body.",
        material: "Tungsten/Ceramic Matrix",
        function: "Radial Melting & Heat Distribution",
        assemblyOrder: 2,
        connections: ["Thermal Penetration Head", "Forward Hull"],
        failureEffect: "Melt hole is too narrow; probe becomes wedged in the ice.",
        cascadeFailures: ["Hull Crushing", "Propulsion Stall"],
        originalPosition: { x: 0, y: -16.5, z: 0 },
        explodedPosition: { x: 0, y: -20, z: 5 }
    });

    // 3. Acoustic Sonar Array (Forward looking)
    const sonarGeom = new THREE.SphereGeometry(1.4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const sonar = new THREE.Mesh(sonarGeom, chrome);
    sonar.position.y = 0;
    noseGroup.add(sonar);
    
    const sonarPing = new THREE.Mesh(new THREE.RingGeometry(1.41, 1.45, 32), neonBlueMaterial);
    sonarPing.rotation.x = Math.PI / 2;
    sonarPing.position.y = -0.5;
    noseGroup.add(sonarPing);
    meshes.sonarPing = sonarPing;

    parts.push({
        name: "Forward Acoustic Sonar",
        description: "High-frequency acoustic array used to map the ice ahead, detecting liquid water pockets, boulders, or bedrock.",
        material: "Chrome/Piezoelectric Crystals",
        function: "Subglacial Navigation",
        assemblyOrder: 3,
        connections: ["Forward Hull", "Navigation Computer"],
        failureEffect: "Probe navigates blindly, risking collision with bedrock.",
        cascadeFailures: ["Impact Damage", "Deviation from Trajectory"],
        originalPosition: { x: 0, y: -15, z: 0 },
        explodedPosition: { x: 5, y: -15, z: 0 }
    });

    group.add(noseGroup);

    // --- SECTION 2: FORWARD HULL & SCIENTIFIC INSTRUMENT BAY ---
    const forwardHullGroup = new THREE.Group();
    forwardHullGroup.position.set(0, -7.5, 0);

    // 4. Forward Hull Casing
    const hullGeom = new THREE.CylinderGeometry(1.8, 1.8, 12, 64);
    const hull = new THREE.Mesh(hullGeom, reinforcedTitanium);
    forwardHullGroup.add(hull);

    parts.push({
        name: "Primary Titanium Pressure Hull",
        description: "The main pressure vessel protecting internal components from extreme hydrostatic pressure deep beneath the ice sheet.",
        material: "Reinforced Titanium",
        function: "Structural Integrity",
        assemblyOrder: 4,
        connections: ["Heat Sink Rings", "Mid Hull", "Instrument Bay"],
        failureEffect: "Catastrophic implosion of the probe.",
        cascadeFailures: ["Total System Loss"],
        originalPosition: { x: 0, y: -7.5, z: 0 },
        explodedPosition: { x: -8, y: -7.5, z: 0 }
    });

    // 5. Instrument Windows & Sensor Bays
    const windowGeom = new THREE.CylinderGeometry(1.7, 1.85, 2, 32, 1, false, 0, Math.PI / 2);
    const glassWindow = new THREE.Mesh(windowGeom, tinted);
    
    const instrumentCoreGeom = new THREE.CylinderGeometry(1.0, 1.0, 10, 16);
    const instrumentCore = new THREE.Mesh(instrumentCoreGeom, steel);
    forwardHullGroup.add(instrumentCore);
    meshes.instrumentCore = instrumentCore;

    for (let i = 0; i < 4; i++) {
        const win = glassWindow.clone();
        win.rotation.y = (Math.PI / 2) * i;
        win.position.y = 2;
        forwardHullGroup.add(win);
        
        const win2 = glassWindow.clone();
        win2.rotation.y = (Math.PI / 2) * i + (Math.PI / 4);
        win2.position.y = -3;
        forwardHullGroup.add(win2);

        // Internal sensors behind windows
        const sensorPackage = new THREE.Group();
        const sBox = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.5, 0.8), darkSteel);
        const sLens = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.9, 16), sensorGlow);
        sLens.rotation.x = Math.PI / 2;
        sLens.position.z = 0.4;
        sensorPackage.add(sBox);
        sensorPackage.add(sLens);
        sensorPackage.position.set(0, 2, 1.2);
        
        const pivot = new THREE.Group();
        pivot.rotation.y = (Math.PI / 2) * i + (Math.PI / 4);
        pivot.add(sensorPackage);
        forwardHullGroup.add(pivot);

        if(!meshes.sensorPackages) meshes.sensorPackages = [];
        meshes.sensorPackages.push(sensorPackage);
    }

    parts.push({
        name: "Spectroscopic & Bio-signature Sensors",
        description: "A suite of highly sensitive instruments observing the meltwater for chemical signatures, microbial life, and ancient atmospheric gases.",
        material: "Glass/Dark Steel/Silica",
        function: "Scientific Data Collection",
        assemblyOrder: 5,
        connections: ["Instrument Core", "Primary Hull"],
        failureEffect: "Loss of primary scientific data.",
        cascadeFailures: ["Mission Objectives Failed"],
        originalPosition: { x: 0, y: -5.5, z: 1.2 },
        explodedPosition: { x: 0, y: -5.5, z: 8 }
    });

    group.add(forwardHullGroup);

    // --- SECTION 3: MID HULL (REACTOR & POWER) ---
    const midHullGroup = new THREE.Group();
    midHullGroup.position.set(0, 3.5, 0);

    // 6. Reactor Shielding
    const reactorGeom = new THREE.CylinderGeometry(1.8, 1.8, 10, 32);
    const reactor = new THREE.Mesh(reactorGeom, darkSteel);
    midHullGroup.add(reactor);

    // 7. Glowing Reactor Core Lines
    const coreLineGeom = new THREE.BoxGeometry(0.2, 9, 0.2);
    for(let i=0; i<8; i++) {
        const line = new THREE.Mesh(coreLineGeom, neonBlueMaterial);
        const angle = (Math.PI / 4) * i;
        line.position.set(Math.cos(angle) * 1.75, 0, Math.sin(angle) * 1.75);
        line.rotation.y = -angle;
        midHullGroup.add(line);
        if(!meshes.reactorLines) meshes.reactorLines = [];
        meshes.reactorLines.push(line);
    }

    parts.push({
        name: "Micro-Fission Reactor Core",
        description: "Provides immense continuous electrical power and waste heat necessary for the melt systems and instrumentation.",
        material: "Lead-Lined Steel/Uranium",
        function: "Power Generation",
        assemblyOrder: 6,
        connections: ["Mid Hull", "Power Distribution Grid", "Heat Sink Rings"],
        failureEffect: "Total power loss. Probe permanently entombed in ice.",
        cascadeFailures: ["Thermal Shutdown", "Communications Loss"],
        originalPosition: { x: 0, y: 3.5, z: 0 },
        explodedPosition: { x: 10, y: 3.5, z: 0 }
    });

    // 8. Hydraulic Fluid Lines (Tubes looping around)
    const tubePath = new THREE.CatmullRomCurve3([
        new THREE.Vector3(1.8, -4, 0),
        new THREE.Vector3(2.0, -2, 0.5),
        new THREE.Vector3(1.9, 0, 1.0),
        new THREE.Vector3(2.1, 2, 0.5),
        new THREE.Vector3(1.8, 4, 0)
    ]);
    const tubeGeom = new THREE.TubeGeometry(tubePath, 20, 0.1, 8, false);
    for(let i=0; i<4; i++) {
        const tube = new THREE.Mesh(tubeGeom, rubber);
        tube.rotation.y = (Math.PI / 2) * i;
        midHullGroup.add(tube);
    }

    parts.push({
        name: "External Hydraulic Pressure Lines",
        description: "Routing for high-pressure hydraulic fluid to articulate external control surfaces and the unspooler mechanism.",
        material: "Braided Kevlar/Rubber",
        function: "Actuation Power",
        assemblyOrder: 7,
        connections: ["Reactor Casing", "Aft Control Surfaces"],
        failureEffect: "Loss of steering capabilities.",
        cascadeFailures: ["Navigation Failure"],
        originalPosition: { x: 2, y: 3.5, z: 0 },
        explodedPosition: { x: 6, y: 3.5, z: -6 }
    });

    group.add(midHullGroup);

    // --- SECTION 4: AFT HULL & PROPULSION ---
    const aftHullGroup = new THREE.Group();
    aftHullGroup.position.set(0, 11, 0);

    // 9. Aft Tapering Hull
    const aftGeom = new THREE.CylinderGeometry(1.2, 1.8, 5, 32);
    const aft = new THREE.Mesh(aftGeom, reinforcedTitanium);
    aftHullGroup.add(aft);

    parts.push({
        name: "Aft Tapering Section",
        description: "Streamlines the probe for movement through melt-water and houses the hydro-jet pumps.",
        material: "Titanium",
        function: "Hydrodynamic Profiling",
        assemblyOrder: 8,
        connections: ["Mid Hull", "Hydro-Jet Nozzles"],
        failureEffect: "Increased drag, slowing descent.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 11, z: 0 },
        explodedPosition: { x: -8, y: 11, z: 5 }
    });

    // 10. Hydro-Jet Nozzles and Impellers
    const nozzlesGroup = new THREE.Group();
    const nozzleGeom = new THREE.CylinderGeometry(0.3, 0.5, 2, 16);
    nozzleGeom.translate(0, 1, 0);
    const impellerGeom = new THREE.BoxGeometry(0.5, 0.1, 0.5);

    meshes.impellers = [];
    meshes.nozzles = [];

    for (let i = 0; i < 4; i++) {
        const p = new THREE.Group();
        const nozzle = new THREE.Mesh(nozzleGeom, steel);
        const impeller = new THREE.Mesh(impellerGeom, chrome);
        impeller.position.y = 1.8;
        
        // Thrust vectoring flap
        const flap = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 0.05), darkCeramic);
        flap.position.y = 2.5;
        flap.position.z = 0.3;
        
        nozzle.add(impeller);
        nozzle.add(flap);
        
        meshes.impellers.push(impeller);
        meshes.nozzles.push(flap);

        p.add(nozzle);
        p.position.set(0, 1.5, 0);
        p.rotation.z = Math.PI / 12; // angle slightly outward
        
        const wrapper = new THREE.Group();
        wrapper.add(p);
        wrapper.rotation.y = (Math.PI / 2) * i;
        wrapper.position.set(Math.cos(wrapper.rotation.y) * 1.0, 0, Math.sin(wrapper.rotation.y) * 1.0);
        
        nozzlesGroup.add(wrapper);
    }
    nozzlesGroup.position.y = -1;
    aftHullGroup.add(nozzlesGroup);

    parts.push({
        name: "Hydro-Jet Propulsion Array",
        description: "Four powerful water jets that suck in melt-water and expel it upwards, providing downward thrust to force the probe against the ice.",
        material: "Steel/Chrome Impellers",
        function: "Active Descent Propulsion",
        assemblyOrder: 9,
        connections: ["Aft Hull", "Reactor Power Grid"],
        failureEffect: "Probe relies solely on gravity to descend, drastically increasing descent time.",
        cascadeFailures: ["Mission Time Exceeded"],
        originalPosition: { x: 0, y: 11, z: 0 },
        explodedPosition: { x: 0, y: 11, z: -8 }
    });

    group.add(aftHullGroup);

    // --- SECTION 5: UMBILICAL SPOOL ASSEMBLY ---
    const spoolGroup = new THREE.Group();
    spoolGroup.position.set(0, 16, 0);

    // 11. Spool Support Struts
    const strutGeom = new THREE.BoxGeometry(0.3, 6, 0.5);
    const strut1 = new THREE.Mesh(strutGeom, steel);
    strut1.position.set(1.2, 3, 0);
    const strut2 = new THREE.Mesh(strutGeom, steel);
    strut2.position.set(-1.2, 3, 0);
    spoolGroup.add(strut1);
    spoolGroup.add(strut2);

    parts.push({
        name: "Spool Support Struts",
        description: "Heavy duty steel beams supporting the massive umbilical cable spool.",
        material: "Steel",
        function: "Structural Support",
        assemblyOrder: 10,
        connections: ["Aft Hull", "Spool Drum Axle"],
        failureEffect: "Spool drum detaches, breaking the umbilical cable.",
        cascadeFailures: ["Loss of Surface Communication"],
        originalPosition: { x: 0, y: 19, z: 0 },
        explodedPosition: { x: -5, y: 19, z: 0 }
    });

    // 12. The Spool Drum
    const drumGeom = new THREE.CylinderGeometry(0.5, 0.5, 2.2, 32);
    const drum = new THREE.Mesh(drumGeom, darkSteel);
    drum.rotation.z = Math.PI / 2;
    drum.position.y = 4;
    spoolGroup.add(drum);
    meshes.spoolDrum = drum;

    // 13. Coiled Cable on Drum
    const coilGeom = new THREE.TorusGeometry(0.8, 0.2, 16, 64);
    for(let i=0; i<10; i++) {
        const coil = new THREE.Mesh(coilGeom, copperCoilMat);
        coil.rotation.y = Math.PI / 2;
        coil.position.x = -0.9 + (i * 0.2);
        drum.add(coil);
    }
    
    // Drum Flanges
    const flangeGeom = new THREE.CylinderGeometry(1.5, 1.5, 0.1, 32);
    const flange1 = new THREE.Mesh(flangeGeom, aluminum);
    flange1.position.y = 1.1;
    drum.add(flange1);
    const flange2 = new THREE.Mesh(flangeGeom, aluminum);
    flange2.position.y = -1.1;
    drum.add(flange2);

    parts.push({
        name: "Umbilical Spool Drum",
        description: "A motorized winch containing miles of high-tensile fiber optic and power cable linking the probe to the surface station.",
        material: "Aluminum/Copper/Fiber Optics",
        function: "Cable Management",
        assemblyOrder: 11,
        connections: ["Support Struts", "Umbilical Cable"],
        failureEffect: "Cable jams or snaps.",
        cascadeFailures: ["Communication Severed", "Data Loss"],
        originalPosition: { x: 0, y: 20, z: 0 },
        explodedPosition: { x: 0, y: 20, z: 6 }
    });

    // 14. Extending Umbilical Cable
    const cableCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 4, -0.8), // leaves bottom of spool
        new THREE.Vector3(0, 7, -0.5),
        new THREE.Vector3(0, 10, 0),
        new THREE.Vector3(0, 20, 0)
    ]);
    const cableGeom = new THREE.TubeGeometry(cableCurve, 32, 0.15, 8, false);
    const cable = new THREE.Mesh(cableGeom, rubber);
    spoolGroup.add(cable);

    parts.push({
        name: "Umbilical Surface Cable",
        description: "Carries high-bandwidth telemetry and backup power between the descending probe and the surface basecamp.",
        material: "Armored Rubber/Kevlar",
        function: "Telemetry Link",
        assemblyOrder: 12,
        connections: ["Spool Drum", "Surface Station"],
        failureEffect: "No real-time data to surface.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 26, z: 0 },
        explodedPosition: { x: 0, y: 35, z: 0 }
    });

    // 15. Tensioner Arm (Complex animated part)
    const tensionerArmGeom = new THREE.BoxGeometry(0.2, 2, 0.2);
    const tensionerArm = new THREE.Mesh(tensionerArmGeom, steel);
    tensionerArm.position.set(0, 5.5, -0.6);
    tensionerArm.rotation.x = Math.PI / 4;
    
    const tensionWheelGeom = new THREE.CylinderGeometry(0.3, 0.3, 0.4, 16);
    const tensionWheel = new THREE.Mesh(tensionWheelGeom, chrome);
    tensionWheel.rotation.z = Math.PI / 2;
    tensionWheel.position.y = 1;
    tensionerArm.add(tensionWheel);

    spoolGroup.add(tensionerArm);
    meshes.tensionerArm = tensionerArm;
    meshes.tensionWheel = tensionWheel;

    parts.push({
        name: "Cable Tensioner Mechanism",
        description: "Ensures the umbilical cable unwinds smoothly without slacking or snagging on the rough ice bore-hole walls.",
        material: "Steel/Chrome",
        function: "Spool Regulation",
        assemblyOrder: 13,
        connections: ["Spool Struts", "Umbilical Cable"],
        failureEffect: "Cable tangles and jams the spool.",
        cascadeFailures: ["Winch Motor Burnout"],
        originalPosition: { x: 0, y: 21.5, z: -0.6 },
        explodedPosition: { x: 4, y: 21.5, z: -3 }
    });

    group.add(spoolGroup);

    // --- SECTION 6: HYDRAULIC WALL STABILIZERS ---
    const stabilizerGroup = new THREE.Group();
    stabilizerGroup.position.set(0, 0, 0); // Spanning mid to forward hull

    meshes.stabilizerLegs = [];
    for (let i = 0; i < 3; i++) {
        const legGroup = new THREE.Group();
        legGroup.rotation.y = (Math.PI * 2 / 3) * i;

        // Main housing attached to hull
        const housing = new THREE.Mesh(new THREE.BoxGeometry(1.0, 3, 1.0), darkSteel);
        housing.position.set(1.6, 0, 0);
        legGroup.add(housing);

        // Extending Piston Arm
        const pistonArm = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2, 16), chrome);
        pistonArm.rotation.z = Math.PI / 2;
        pistonArm.position.set(2.5, 0, 0); // Will animate outward
        
        // Ice Gripper Pad
        const pad = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.5, 0.8), steel);
        pad.position.set(1, 0, 0);
        
        // Spikes on pad
        for(let s=0; s<4; s++) {
            const spike = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.4, 4), darkSteel);
            spike.rotation.z = -Math.PI/2;
            spike.position.set(0.2, -0.5 + (s * 0.33), 0);
            pad.add(spike);
        }

        pistonArm.add(pad);
        legGroup.add(pistonArm);
        
        meshes.stabilizerLegs.push({ piston: pistonArm, pad: pad, angleOffset: i });
        stabilizerGroup.add(legGroup);
    }
    
    parts.push({
        name: "Hydraulic Wall Grippers",
        description: "Three powerful pneumatic pistons with spiked pads that extend to grip the ice bore-hole. Used to lock the probe in place during delicate scientific drilling or seismic readings.",
        material: "Chrome Pistons / Steel Pads",
        function: "Bore-hole Anchoring",
        assemblyOrder: 14,
        connections: ["Mid Hull", "Hydraulic Lines"],
        failureEffect: "Probe cannot lock in place, ruining sensitive seismic measurements.",
        cascadeFailures: ["Data Inaccuracy"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 12 }
    });

    parts.push({
        name: "Main Compute & Navigation Hub",
        description: "Heavily shielded central AI hub processing sonar, thermal, and spectroscopic data to autonomously navigate the probe.",
        material: "Silicon/Gold/Titanium Shielding",
        function: "Autonomous Control",
        assemblyOrder: 15,
        connections: ["All Sensors", "Propulsion", "Reactor"],
        failureEffect: "Probe loses all autonomy.",
        cascadeFailures: ["Complete Mission Loss"],
        originalPosition: { x: 0, y: -2, z: 0 },
        explodedPosition: { x: -6, y: -2, z: -6 }
    });

    group.add(stabilizerGroup);

    // --- LIGHTING ---
    const pointLight = new THREE.PointLight(0xff4400, 3, 20);
    pointLight.position.set(0, -18, 0);
    group.add(pointLight);
    meshes.meltLight = pointLight;

    const topLight = new THREE.PointLight(0x0088ff, 2, 15);
    topLight.position.set(0, 16, 0);
    group.add(topLight);


    // --- QUIZ QUESTIONS ---
    const quizQuestions = [
        {
            question: "What is the primary function of the Thermal Penetration Head?",
            options: [
                "To drill through solid rock.",
                "To use a radioisotope thermal generator to melt through miles of ice.",
                "To cool the internal reactor.",
                "To measure the temperature of the ice."
            ],
            correctAnswer: 1,
            explanation: "The thermal head emits extreme heat to continuously melt the glacial ice ahead, allowing the probe to sink."
        },
        {
            question: "Why are the Radial Heat Sink Rings necessary?",
            options: [
                "They distribute heat radially to widen the melt-hole for the hull.",
                "They act as a backup communication antenna.",
                "They store extra hydraulic fluid.",
                "They provide buoyancy in the water."
            ],
            correctAnswer: 0,
            explanation: "Distributing heat outward ensures the hole is wide enough so the probe's main body does not get wedged."
        },
        {
            question: "What is the purpose of the Umbilical Surface Cable?",
            options: [
                "To haul the probe back to the surface.",
                "To supply the probe with oxygen.",
                "To carry high-bandwidth telemetry and backup power to the surface.",
                "To act as a tether in case of a fall."
            ],
            correctAnswer: 2,
            explanation: "The cable transmits vast amounts of scientific data back to the surface station in real-time."
        },
        {
            question: "How do the Hydro-Jet Propulsion nozzles assist the descent?",
            options: [
                "By melting the ice faster with lasers.",
                "By pulling in melt-water and expelling it upwards to create downward thrust.",
                "By creating an air bubble around the probe.",
                "By freezing the water behind the probe."
            ],
            correctAnswer: 1,
            explanation: "Gravity alone may be too slow; expelling water upwards actively forces the probe down against the ice face."
        },
        {
            question: "Why does the probe have Hydraulic Wall Grippers?",
            options: [
                "To climb back up the ice hole.",
                "To crush large rocks encountered in the ice.",
                "To lock the probe in place for delicate scientific readings.",
                "To push away aggressive marine life."
            ],
            correctAnswer: 2,
            explanation: "Locking into the ice walls prevents vibration and sinking, allowing for pristine seismic and spectroscopic measurements."
        }
    ];

    // --- ANIMATION LOGIC ---
    function animate(time, speed, meshesObj) {
        if (!meshesObj) return;

        // 1. Spool rotation (unwinding cable)
        if (meshesObj.spoolDrum) {
            meshesObj.spoolDrum.rotation.x = time * speed * 2;
        }

        // 2. Tensioner wheel rotation and arm bounce
        if (meshesObj.tensionWheel) {
            meshesObj.tensionWheel.rotation.x = time * speed * 4;
        }
        if (meshesObj.tensionerArm) {
            meshesObj.tensionerArm.rotation.x = (Math.PI / 4) + Math.sin(time * speed * 5) * 0.1;
        }

        // 3. Hydro-jet impellers spinning rapidly
        if (meshesObj.impellers) {
            meshesObj.impellers.forEach(impeller => {
                impeller.rotation.y = time * speed * 15;
            });
        }
        
        // 4. Vectoring nozzles twitching slightly
        if (meshesObj.nozzles) {
            meshesObj.nozzles.forEach((flap, idx) => {
                flap.rotation.x = Math.sin(time * speed * 3 + idx) * 0.2;
            });
        }

        // 5. Reactor glowing lines pulsing
        if (meshesObj.reactorLines) {
            const pulse = (Math.sin(time * speed * 2) * 0.5) + 0.5; // 0 to 1
            meshesObj.reactorLines.forEach(line => {
                line.material.emissiveIntensity = 1 + (pulse * 4);
            });
        }

        // 6. Sonar ping scaling and fading
        if (meshesObj.sonarPing) {
            let scale = (time * speed) % 2; // 0 to 2
            meshesObj.sonarPing.scale.set(1 + scale * 2, 1 + scale * 2, 1);
            meshesObj.sonarPing.material.opacity = Math.max(0, 1 - (scale / 2));
            meshesObj.sonarPing.material.transparent = true;
        }

        // 7. Sensor packages scanning (rotating back and forth)
        if (meshesObj.sensorPackages) {
            meshesObj.sensorPackages.forEach((pkg, idx) => {
                pkg.rotation.y = Math.sin(time * speed * 1.5 + idx) * 0.5;
            });
        }

        // 8. Hydraulic Stabilizers extending and retracting rhythmically
        if (meshesObj.stabilizerLegs) {
            // Extend out, hold, retract
            let cycle = (time * speed * 0.5) % (Math.PI * 2);
            let ext = Math.max(0, Math.sin(cycle));
            meshesObj.stabilizerLegs.forEach(leg => {
                // Piston base x is 2.5, moves out to 4.5
                leg.piston.position.x = 2.5 + (ext * 2.0);
            });
        }
        
        // 9. Melt light flickering slightly like extreme heat
        if (meshesObj.meltLight) {
            meshesObj.meltLight.intensity = 3 + Math.random() * 0.5;
        }
    }

    return {
        group,
        parts,
        description: "The Deep-Ice Subglacial Probe is an advanced autonomous robotic vehicle designed to melt through miles of glacial ice to reach isolated subglacial lakes. It features a radioisotope thermal melt-head, an onboard micro-fission reactor, hydro-jet descent thrusters, and a highly complex instrument bay for astrobiological research.",
        quizQuestions,
        animate,
        meshes
    };
}

// Auto-generated missing stub
export function createSubglacialProbe() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
