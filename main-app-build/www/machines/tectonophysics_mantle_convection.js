import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Core and Geological Materials
    const innerCoreMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffddaa, emissiveIntensity: 2.0, metalness: 0.2, roughness: 0.5 });
    const outerCoreMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xaa4400, emissiveIntensity: 1.2, metalness: 0.5, roughness: 0.2, transparent: true, opacity: 0.95 });
    const lowerMantleMat = new THREE.MeshStandardMaterial({ color: 0x882200, roughness: 0.9, metalness: 0.1 });
    const asthenosphereMat = new THREE.MeshStandardMaterial({ color: 0xdd3300, emissive: 0x440000, roughness: 0.8, metalness: 0.1 });
    const lithosphereMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 1.0, metalness: 0.1 });
    const oceanicCrustMat = new THREE.MeshStandardMaterial({ color: 0x222233, roughness: 1.0, metalness: 0.1 });
    const magmaMat = new THREE.MeshStandardMaterial({ color: 0xff4400, emissive: 0xff2200, emissiveIntensity: 2.5, metalness: 0.2, roughness: 0.3 });
    const neonBlue = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 2.0 });
    const neonRed = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 1.5 });
    
    const earthCenter = new THREE.Vector3(0, 8, 0);

    // =========================================================================
    // 1. MOBILE PLATFORM CHASSIS & HYDRAULICS
    // =========================================================================
    
    // Main Chassis Base
    const chassisShape = new THREE.Shape();
    chassisShape.moveTo(-22, -15);
    chassisShape.lineTo(22, -15);
    chassisShape.lineTo(25, -5);
    chassisShape.lineTo(25, 5);
    chassisShape.lineTo(-25, 5);
    chassisShape.lineTo(-25, -5);
    chassisShape.lineTo(-22, -15);
    const chassisExtrudeSettings = { depth: 16, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.5, bevelThickness: 0.5 };
    const chassisGeo = new THREE.ExtrudeGeometry(chassisShape, chassisExtrudeSettings);
    const chassis = new THREE.Mesh(chassisGeo, darkSteel);
    chassis.position.set(0, -18, -8);
    group.add(chassis);
    parts.push({
        name: "MobileChassis",
        description: "Heavy-duty titanium-alloy crawler chassis designed to support the immense weight of the tectonic containment vessel.",
        material: "darkSteel",
        function: "Structural mobility",
        assemblyOrder: 1,
        connections: ["All-TerrainTires", "HydraulicLifts"],
        failureEffect: "Total structural collapse",
        cascadeFailures: ["ContainmentBreach", "AxleSnap"],
        originalPosition: {x: 0, y: -18, z: -8},
        explodedPosition: {x: 0, y: -40, z: -8}
    });

    // Massive Complex Tires
    const tireGroup = new THREE.Group();
    const tirePositions = [
        new THREE.Vector3(-25, -20, 12),
        new THREE.Vector3(25, -20, 12),
        new THREE.Vector3(-25, -20, -12),
        new THREE.Vector3(25, -20, -12)
    ];
    
    const wheels = [];
    tirePositions.forEach((pos, idx) => {
        const wheel = new THREE.Group();
        
        // Torus for main tire body
        const tireTorusGeo = new THREE.TorusGeometry(6, 2.5, 32, 64);
        const tireTorus = new THREE.Mesh(tireTorusGeo, rubber);
        wheel.add(tireTorus);

        // Hundreds of tiny extruded BoxGeometry lugs for aggressive tread
        const numLugs = 60;
        const treadGeo = new THREE.BoxGeometry(1.5, 0.6, 5.5);
        for(let j=0; j<numLugs; j++) {
            const angle = (j / numLugs) * Math.PI * 2;
            const lug = new THREE.Mesh(treadGeo, rubber);
            lug.position.set(Math.cos(angle) * 8.3, Math.sin(angle) * 8.3, 0);
            lug.rotation.z = angle;
            wheel.add(lug);
        }

        // Rim using Cylinder and complex spoke array
        const rimGeo = new THREE.CylinderGeometry(5, 5, 4, 32);
        const rim = new THREE.Mesh(rimGeo, chrome);
        rim.rotation.x = Math.PI / 2;
        wheel.add(rim);

        // Spokes
        for(let k=0; k<12; k++) {
            const spokeAngle = (k / 12) * Math.PI * 2;
            const spokeGeo = new THREE.CylinderGeometry(0.3, 0.5, 9, 16);
            const spoke = new THREE.Mesh(spokeGeo, steel);
            spoke.position.set(Math.cos(spokeAngle) * 2.5, Math.sin(spokeAngle) * 2.5, 0);
            spoke.rotation.z = spokeAngle + Math.PI/2;
            wheel.add(spoke);
        }

        // Axle connector
        const axleGeo = new THREE.CylinderGeometry(1, 1, 6, 16);
        const axle = new THREE.Mesh(axleGeo, darkSteel);
        axle.rotation.x = Math.PI / 2;
        axle.position.z = pos.z > 0 ? -3 : 3;
        wheel.add(axle);

        wheel.position.copy(pos);
        if (pos.z < 0) wheel.rotation.y = Math.PI; // flip left/right wheels
        tireGroup.add(wheel);
        wheels.push(wheel);
    });
    group.add(tireGroup);
    
    parts.push({
        name: "AllTerrainTires",
        description: "Massive synthetic-rubber Torus geometry tires featuring hundreds of extruded BoxGeometry lugs for ultimate off-road traction.",
        material: "rubber/chrome/steel",
        function: "Locomotion and load distribution",
        assemblyOrder: 2,
        connections: ["MobileChassis"],
        failureEffect: "Immobilization of the platform",
        cascadeFailures: ["ChassisGrounding"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -20, z: 40}
    });

    // Hydraulic Lifters connecting Chassis to the Containment Base
    const hydraulicPistons = [];
    const liftGroup = new THREE.Group();
    for (let i = 0; i < 6; i++) {
        const angle = i * (Math.PI * 2 / 6);
        const radius = 15;
        const hx = Math.cos(angle) * radius;
        const hz = Math.sin(angle) * radius;

        const sheathGeo = new THREE.CylinderGeometry(1.2, 1.2, 12, 16);
        const sheath = new THREE.Mesh(sheathGeo, steel);
        sheath.position.set(hx, -10, hz);
        liftGroup.add(sheath);
        
        const pistonGeo = new THREE.CylinderGeometry(0.8, 0.8, 12, 16);
        const piston = new THREE.Mesh(pistonGeo, chrome);
        piston.position.set(hx, -4, hz);
        liftGroup.add(piston);
        
        hydraulicPistons.push(piston);
    }
    group.add(liftGroup);
    parts.push({
        name: "HydraulicLifters",
        description: "High-pressure telescopic cylinders articulating the main earth simulation dome to isolate it from chassis vibrations.",
        material: "chrome/steel",
        function: "Vibration dampening and leveling",
        assemblyOrder: 3,
        connections: ["MobileChassis", "ContainmentBase"],
        failureEffect: "Simulation corruption via seismic interference",
        cascadeFailures: ["DomeShatter"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -10, z: -30}
    });

    // =========================================================================
    // 2. CONTAINMENT BASE & VESSEL
    // =========================================================================

    const basePts = [];
    for(let i=0; i<=30; i++) {
        basePts.push(new THREE.Vector2( 22 - i*0.4, i*0.3 ));
    }
    const baseGeo = new THREE.LatheGeometry(basePts, 64, Math.PI, Math.PI);
    const base = new THREE.Mesh(baseGeo, darkSteel);
    base.position.set(0, -2, 0);
    group.add(base);
    parts.push({
        name: "ContainmentBase",
        description: "Titanium-reinforced hemispherical base plate housing the complex mag-lev field generators.",
        material: "darkSteel",
        function: "Simulated gravity well generator",
        assemblyOrder: 4,
        connections: ["HydraulicLifters", "LowerMantle"],
        failureEffect: "Loss of artificial gravity",
        cascadeFailures: ["MantleEjection"],
        originalPosition: {x: 0, y: -2, z: 0},
        explodedPosition: {x: 0, y: -5, z: 0}
    });

    // Containment Glass Dome
    const domeGeo = new THREE.SphereGeometry(21, 64, 64, Math.PI, Math.PI, 0, Math.PI);
    const dome = new THREE.Mesh(domeGeo, tinted);
    dome.position.copy(earthCenter);
    group.add(dome);
    parts.push({
        name: "ObservationDome",
        description: "Thick tinted borosilicate glass shield protecting operators from the 6000K simulated core heat.",
        material: "tinted",
        function: "Thermal insulation & Observation",
        assemblyOrder: 17,
        connections: ["ContainmentBase"],
        failureEffect: "Catastrophic thermal leak",
        cascadeFailures: ["OperatorIncineration", "CoolantBoilOff"],
        originalPosition: {x: 0, y: 8, z: 0},
        explodedPosition: {x: 0, y: 40, z: 0}
    });

    // Coolant Pipe System around the Dome
    const pipeGroup = new THREE.Group();
    for(let i=1; i<7; i++) {
        const pipeGeo = new THREE.TorusGeometry(21.2, 0.4, 16, 64, Math.PI);
        const pipe = new THREE.Mesh(pipeGeo, copper);
        pipe.rotation.y = (Math.PI / 7) * i;
        pipe.position.copy(earthCenter);
        pipeGroup.add(pipe);
    }
    group.add(pipeGroup);
    parts.push({
        name: "CryoCoolantPipes",
        description: "Network of copper tubes flushing liquid helium to counteract extreme radiometric heat.",
        material: "copper",
        function: "Active thermal regulation",
        assemblyOrder: 18,
        connections: ["ObservationDome"],
        failureEffect: "Dome softening and rupture",
        cascadeFailures: ["TotalSystemMeltdown"],
        originalPosition: {x: 0, y: 8, z: 0},
        explodedPosition: {x: 0, y: 50, z: 0}
    });

    // Data Readout & Control Consoles
    const consoleGroup = new THREE.Group();
    for(let i=0; i<4; i++) {
        const consoleBaseGeo = new THREE.BoxGeometry(4, 3, 2);
        const consoleBase = new THREE.Mesh(consoleBaseGeo, steel);
        
        const screenGeo = new THREE.PlaneGeometry(3.5, 2);
        const screen = new THREE.Mesh(screenGeo, neonBlue);
        screen.position.set(0, 0.5, 1.05);
        screen.rotation.x = -0.2;
        consoleBase.add(screen);

        const angle = Math.PI + 0.3 + i * (Math.PI * 0.4 / 3);
        consoleBase.position.set(Math.cos(angle)*23, -1, Math.sin(angle)*23);
        consoleBase.rotation.y = -angle + Math.PI/2;
        consoleGroup.add(consoleBase);
    }
    group.add(consoleGroup);
    parts.push({
        name: "HoloConsoles",
        description: "Advanced operator interfaces projecting real-time tectonic vectors and mantle viscosity readouts.",
        material: "steel/neonBlue",
        function: "Telemetry and User Control",
        assemblyOrder: 19,
        connections: ["ContainmentBase"],
        failureEffect: "Loss of simulation telemetry",
        cascadeFailures: ["UncontrolledConvection"],
        originalPosition: {x: 0, y: -1, z: 23},
        explodedPosition: {x: 0, y: -1, z: 50}
    });

    // =========================================================================
    // 3. INTERNAL EARTH GEOLOGY & CONVECTION DYNAMICS
    // =========================================================================

    // Inner Core
    const innerCoreGeo = new THREE.SphereGeometry(3, 32, 32, Math.PI, Math.PI);
    const innerCore = new THREE.Mesh(innerCoreGeo, innerCoreMat);
    innerCore.position.copy(earthCenter);
    group.add(innerCore);
    parts.push({
        name: "InnerCoreSim",
        description: "Synthetic solid iron-nickel crystalline sphere, vibrating violently to simulate nuclear decay heating.",
        material: "innerCoreMat",
        function: "Primary heat source",
        assemblyOrder: 5,
        connections: ["OuterCoreSim"],
        failureEffect: "Thermal gradient collapse",
        cascadeFailures: ["ConvectionStall"],
        originalPosition: {x: 0, y: 8, z: 0},
        explodedPosition: {x: 0, y: 8, z: -40}
    });

    // Outer Core
    const outerCoreGeo = new THREE.SphereGeometry(6, 48, 48, Math.PI, Math.PI);
    const outerCore = new THREE.Mesh(outerCoreGeo, outerCoreMat);
    outerCore.position.copy(earthCenter);
    group.add(outerCore);
    parts.push({
        name: "OuterCoreSim",
        description: "Turbulent liquid metal alloy generating a colossal electromagnetic field via Coriolis force spinning.",
        material: "outerCoreMat",
        function: "Geodynamo and heat transfer",
        assemblyOrder: 6,
        connections: ["InnerCoreSim", "LowerMantleSim"],
        failureEffect: "Magnetic shield dissipation",
        cascadeFailures: ["SolarRadiationDamage"],
        originalPosition: {x: 0, y: 8, z: 0},
        explodedPosition: {x: 0, y: 8, z: -30}
    });

    // Lower Mantle
    const lowerMantleGeo = new THREE.SphereGeometry(14, 64, 64, Math.PI, Math.PI);
    const lowerMantle = new THREE.Mesh(lowerMantleGeo, lowerMantleMat);
    lowerMantle.position.copy(earthCenter);
    group.add(lowerMantle);
    parts.push({
        name: "LowerMantleSim",
        description: "Dense, highly pressurized silicate perovskite structure. Transfers heat upwards via slow plastic flow.",
        material: "lowerMantleMat",
        function: "Volumetric heat conduction",
        assemblyOrder: 7,
        connections: ["OuterCoreSim", "AsthenosphereSim"],
        failureEffect: "Heat pooling at core boundary",
        cascadeFailures: ["SuperplumeEruption"],
        originalPosition: {x: 0, y: 8, z: 0},
        explodedPosition: {x: 0, y: 8, z: -20}
    });

    // Asthenosphere
    const asthGeo = new THREE.SphereGeometry(17, 64, 64, Math.PI, Math.PI);
    const asthenosphere = new THREE.Mesh(asthGeo, asthenosphereMat);
    asthenosphere.position.copy(earthCenter);
    group.add(asthenosphere);
    parts.push({
        name: "AsthenosphereSim",
        description: "Semi-fluid, viscous upper mantle region where immense convection cells mechanically drive the plates.",
        material: "asthenosphereMat",
        function: "Convection engine",
        assemblyOrder: 8,
        connections: ["LowerMantleSim", "LithospherePlates"],
        failureEffect: "Tectonic stagnation",
        cascadeFailures: ["CrustalCooling"],
        originalPosition: {x: 0, y: 8, z: 0},
        explodedPosition: {x: 0, y: 8, z: -10}
    });

    // Tectonic Plates (Lithosphere)
    const platesGroup = new THREE.Group();
    platesGroup.position.copy(earthCenter);
    
    // Plate 1: Continental (Thick)
    const plate1Geo = new THREE.SphereGeometry(18.5, 64, 64, Math.PI + 0.1, 1.4, 0, Math.PI);
    const plate1 = new THREE.Mesh(plate1Geo, lithosphereMat);
    platesGroup.add(plate1);

    // Plate 2: Oceanic (Thin)
    const plate2Geo = new THREE.SphereGeometry(17.8, 64, 64, Math.PI + 1.6, 1.4, 0, Math.PI);
    const plate2 = new THREE.Mesh(plate2Geo, oceanicCrustMat);
    platesGroup.add(plate2);

    group.add(platesGroup);
    
    parts.push({
        name: "ContinentalCrust",
        description: "Massive, buoyant granitic plate that resists subduction.",
        material: "lithosphereMat",
        function: "Landmass foundation",
        assemblyOrder: 9,
        connections: ["AsthenosphereSim"],
        failureEffect: "Continental fracturing",
        cascadeFailures: ["RiftValleyFormation"],
        originalPosition: {x: 0, y: 8, z: 0},
        explodedPosition: {x: -20, y: 20, z: 0}
    });

    parts.push({
        name: "OceanicCrust",
        description: "Dense basaltic plate that continuously forms at ridges and sinks at trenches.",
        material: "oceanicCrustMat",
        function: "Seafloor spreading surface",
        assemblyOrder: 10,
        connections: ["MidOceanRidge", "SubductionZone"],
        failureEffect: "Ocean basin collapse",
        cascadeFailures: ["SeaLevelDrasticChange"],
        originalPosition: {x: 0, y: 8, z: 0},
        explodedPosition: {x: 20, y: 20, z: 0}
    });

    // Mid Ocean Ridge
    const ridgeGeo = new THREE.CylinderGeometry(0.5, 0.5, 17.5, 16);
    const ridge = new THREE.Mesh(ridgeGeo, magmaMat);
    const ridgeAngle = Math.PI + 1.55;
    ridge.position.set(Math.cos(ridgeAngle)*17.8, Math.sin(ridgeAngle)*17.8 + 8, 0);
    ridge.rotation.z = Math.PI/2 - 1.55;
    group.add(ridge);
    parts.push({
        name: "MidOceanRidge",
        description: "Divergent boundary erupting ultra-hot magma, pushing tectonic plates apart (Ridge Push).",
        material: "magmaMat",
        function: "Crustal generation",
        assemblyOrder: 11,
        connections: ["OceanicCrust", "AsthenosphereSim"],
        failureEffect: "Halting of seafloor spreading",
        cascadeFailures: ["PlateSeizure"],
        originalPosition: {x: ridge.position.x, y: ridge.position.y, z: ridge.position.z},
        explodedPosition: {x: ridge.position.x, y: ridge.position.y + 15, z: 0}
    });

    // Subduction Zone (Slab Pull)
    const slabGeo = new THREE.CylinderGeometry(0.4, 0.4, 10, 16);
    const slab = new THREE.Mesh(slabGeo, oceanicCrustMat);
    const slabAngle = Math.PI + 1.0;
    slab.position.set(Math.cos(slabAngle)*15, Math.sin(slabAngle)*15 + 8, 0);
    slab.rotation.z = Math.PI/2 - 1.0 + 0.6; // Angled steeply downward
    group.add(slab);
    parts.push({
        name: "SubductionSlab",
        description: "Cold, dense oceanic lithosphere sinking deep into the mantle, exerting massive gravitational pull on the plate.",
        material: "oceanicCrustMat",
        function: "Slab pull tectonic driver",
        assemblyOrder: 12,
        connections: ["OceanicCrust", "LowerMantleSim"],
        failureEffect: "Tectonic locking at convergent margin",
        cascadeFailures: ["MegathrustEarthquakes"],
        originalPosition: {x: slab.position.x, y: slab.position.y, z: slab.position.z},
        explodedPosition: {x: slab.position.x - 10, y: slab.position.y - 15, z: 0}
    });

    // Convection Cells (Flow lines and particles)
    const flowLinesGroup = new THREE.Group();
    flowLinesGroup.position.copy(earthCenter);
    const flowParticles = [];

    // 4 Massive Convection Cells in the mantle
    const cellCenters = [
        { angle: Math.PI + 0.5, radius: 11, width: 4.5, height: 4.5, ccw: true },
        { angle: Math.PI + 1.1, radius: 11, width: 4.5, height: 4.5, ccw: false },
        { angle: Math.PI + 1.9, radius: 11, width: 4.5, height: 4.5, ccw: true },
        { angle: Math.PI + 2.5, radius: 11, width: 4.5, height: 4.5, ccw: false }
    ];

    cellCenters.forEach((cell, idx) => {
        const cx = Math.cos(cell.angle) * cell.radius;
        const cy = Math.sin(cell.angle) * cell.radius;
        
        const path = new THREE.EllipseCurve(
            cx, cy,
            cell.width, cell.height,
            0, 2 * Math.PI,
            false,
            0
        );
        const points = path.getPoints(64);
        const path3D = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(p.x, p.y, 0)));
        const tubeGeo = new THREE.TubeGeometry(path3D, 64, 0.3, 12, true);
        const flowTube = new THREE.Mesh(tubeGeo, new THREE.MeshStandardMaterial({ color: 0xff8800, transparent: true, opacity: 0.2, emissive: 0xaa2200 }));
        flowLinesGroup.add(flowTube);

        // Magma flow particles
        for(let i=0; i<15; i++) {
            const pGeo = new THREE.SphereGeometry(0.4, 16, 16);
            const pMat = new THREE.MeshStandardMaterial({ color: 0xffff00, emissive: 0xff5500, emissiveIntensity: 3 });
            const particle = new THREE.Mesh(pGeo, pMat);
            flowLinesGroup.add(particle);
            flowParticles.push({ mesh: particle, path: path3D, progress: i/15, speed: (cell.ccw ? 1 : -1) * 0.04 });
        }
    });
    group.add(flowLinesGroup);
    parts.push({
        name: "MantleConvectionCells",
        description: "Hyper-dynamic flow currents of highly viscous rock dragging the lithosphere via basal shear stress.",
        material: "magmaMat",
        function: "Heat dispersal & Plate propulsion",
        assemblyOrder: 13,
        connections: ["AsthenosphereSim", "LowerMantleSim"],
        failureEffect: "Thermal bottleneck",
        cascadeFailures: ["MantleOverturnEvent"],
        originalPosition: {x: 0, y: 8, z: 0},
        explodedPosition: {x: 0, y: 8, z: 30}
    });

    // Deep Mantle Plume
    const plumeCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(Math.cos(Math.PI + 2.7)*6, Math.sin(Math.PI + 2.7)*6, 0),
        new THREE.Vector3(Math.cos(Math.PI + 2.8)*11, Math.sin(Math.PI + 2.8)*11, 0),
        new THREE.Vector3(Math.cos(Math.PI + 2.7)*18, Math.sin(Math.PI + 2.7)*18, 0),
    ]);
    const plumeGeo = new THREE.TubeGeometry(plumeCurve, 64, 0.8, 16, false);
    const plume = new THREE.Mesh(plumeGeo, magmaMat);
    plume.position.copy(earthCenter);
    group.add(plume);
    parts.push({
        name: "DeepMantlePlume",
        description: "An isolated column of exceptionally hot rock rising directly from the core-mantle boundary to create hotspot volcanism.",
        material: "magmaMat",
        function: "Hotspot generation",
        assemblyOrder: 14,
        connections: ["OuterCoreSim", "ContinentalCrust"],
        failureEffect: "Extinction of intraplate volcanoes",
        cascadeFailures: ["MagmaChamberSolidification"],
        originalPosition: {x: 0, y: 8, z: 0},
        explodedPosition: {x: 25, y: -10, z: 0}
    });

    // Surface Features (Mountains and Volcanoes)
    const surfaceFeatures = new THREE.Group();
    surfaceFeatures.position.copy(earthCenter);
    
    // Mountain range (Convergent boundary effect)
    for(let i=0; i<12; i++) {
        const mountGeo = new THREE.ConeGeometry(0.4, 1.5, 12);
        const mount = new THREE.Mesh(mountGeo, lithosphereMat);
        const angle = Math.PI + 0.25 + i*0.04;
        mount.position.set(Math.cos(angle)*18.8, Math.sin(angle)*18.8, 0);
        mount.rotation.z = Math.PI/2 - angle - Math.PI/2;
        surfaceFeatures.add(mount);
    }

    // Stratovolcano at subduction zone
    const volcanoGeo = new THREE.ConeGeometry(0.8, 2.5, 32);
    const volcano = new THREE.Mesh(volcanoGeo, lithosphereMat);
    const vAngle = Math.PI + 0.85;
    volcano.position.set(Math.cos(vAngle)*18.8, Math.sin(vAngle)*18.8, 0);
    volcano.rotation.z = Math.PI/2 - vAngle - Math.PI/2;
    
    const eruptionGeo = new THREE.ConeGeometry(0.3, 1.5, 16);
    const eruption = new THREE.Mesh(eruptionGeo, magmaMat);
    eruption.position.y = 1.5;
    volcano.add(eruption);
    
    const smokeGeo = new THREE.SphereGeometry(1, 16, 16);
    const smoke = new THREE.Mesh(smokeGeo, new THREE.MeshStandardMaterial({ color: 0x222222, transparent: true, opacity: 0.8 }));
    smoke.position.y = 2.5;
    volcano.add(smoke);

    surfaceFeatures.add(volcano);
    group.add(surfaceFeatures);

    parts.push({
        name: "SurfaceTopography",
        description: "Fold mountains and highly active stratovolcanoes resulting from intense crustal compression and flux melting.",
        material: "lithosphereMat",
        function: "Geological expression of tectonic forces",
        assemblyOrder: 15,
        connections: ["ContinentalCrust"],
        failureEffect: "Erosional flattening",
        cascadeFailures: ["AtmosphericDepletion"],
        originalPosition: {x: 0, y: 8, z: 0},
        explodedPosition: {x: -30, y: 25, z: 0}
    });

    // Structural Rings holding the slice together
    const ringsGroup = new THREE.Group();
    for(let i=0; i<4; i++) {
        const ringGeo = new THREE.TorusGeometry(23, 0.6, 32, 128, Math.PI);
        const ring = new THREE.Mesh(ringGeo, steel);
        ring.position.copy(earthCenter);
        ring.rotation.x = Math.PI/2;
        ring.position.y += (i * 6) - 9;
        ringsGroup.add(ring);
    }
    group.add(ringsGroup);
    parts.push({
        name: "ElectromagneticContainmentRings",
        description: "High-voltage steel torus geometries generating the immense pressure fields necessary to simulate deep earth gravity.",
        material: "steel",
        function: "Pressure containment",
        assemblyOrder: 16,
        connections: ["ContainmentBase"],
        failureEffect: "Explosive decompression of mantle material",
        cascadeFailures: ["CatastrophicFacilityLoss"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 40, z: 0}
    });


    const description = "Ultra-Complex Mobile Mantle Convection Simulator. Housed on a colossal multi-axle off-road chassis with intricately treaded tires, this machine generates a cross-sectional high-fidelity simulation of Earth's interior. It visualizes the geodynamo effect, massive asthenospheric convection cells driving tectonic plates via ridge push and slab pull, and active volcanism.";

    const quizQuestions = [
        {
            question: "What is the primary driving mechanism for plate tectonics demonstrated in the asthenosphere of this simulation?",
            options: ["Solar Radiation", "Magnetic Repulsion", "Thermal Convection Currents", "Coriolis Force"],
            correctAnswer: 2,
            explanation: "Thermal convection currents in the highly viscous asthenosphere drag the rigid lithospheric plates above them, causing continental drift."
        },
        {
            question: "Which component is responsible for generating the simulated Earth's magnetic field?",
            options: ["Inner Core", "Outer Core", "Lower Mantle", "Mid-Ocean Ridge"],
            correctAnswer: 1,
            explanation: "The turbulent swirling of the liquid iron-nickel outer core generates the geodynamo effect, creating the magnetic field."
        },
        {
            question: "At the Subduction Zone, why does the oceanic crust sink beneath the continental crust?",
            options: ["It is moving faster", "It is hotter", "It is denser", "It is strongly magnetic"],
            correctAnswer: 2,
            explanation: "Oceanic crust is primarily composed of dense basalt, making it heavier than the buoyant granitic continental crust, forcing it to subduct."
        },
        {
            question: "What forces are modeled by the Mid-Ocean Ridge and the Subduction Slab respectively?",
            options: ["Ridge Push and Slab Pull", "Slab Push and Ridge Pull", "Basal Drag and Friction", "Conduction and Radiation"],
            correctAnswer: 0,
            explanation: "Magma upwelling at the ridge pushes plates apart (Ridge Push), while dense sinking slabs pull the rest of the plate down into the mantle (Slab Pull)."
        },
        {
            question: "Why must the Observation Dome utilize a complex Cryo-Coolant pipe system?",
            options: ["To cool the hydraulic lifters", "To freeze the tectonic plates", "To offset the immense 6000K heat generated by the simulated core", "To power the HoloConsoles"],
            correctAnswer: 2,
            explanation: "The simulation generates extreme radiometric heat mirroring the Earth's core, requiring active liquid helium cooling to prevent the glass from melting."
        }
    ];

    let pulseTime = 0;
    
    function animate(time, speed, meshes) {
        pulseTime += speed * 0.05;
        const driveSpeed = speed * 0.5;

        // Animate Tires and Chassis movement
        wheels.forEach(wheel => {
            wheel.rotation.z -= driveSpeed;
        });
        
        // Slight chassis vibration due to off-road tires
        chassis.position.y = -18 + Math.sin(time * 20) * 0.05;
        
        // Hydraulic lifters compensating
        hydraulicPistons.forEach((p, i) => {
            p.position.y = -4 + Math.sin(time * 15 + i) * 0.1;
        });

        // Flow particles in convection cells
        flowParticles.forEach(fp => {
            fp.progress += fp.speed * speed;
            if(fp.progress > 1) fp.progress -= 1;
            if(fp.progress < 0) fp.progress += 1;
            
            const pt = fp.path.getPointAt(fp.progress);
            fp.mesh.position.copy(pt);
            
            // Pulsate particles representing heat intensity
            fp.mesh.scale.setScalar(1 + Math.sin(pulseTime * 8 + fp.progress * 15) * 0.4);
        });

        // Outer core spinning (Geodynamo)
        outerCore.rotation.y = time * speed * 0.3;
        outerCore.rotation.z = time * speed * 0.15;
        
        // Inner core nuclear pulsing
        innerCoreMat.emissiveIntensity = 2.0 + Math.sin(pulseTime * 5) * 0.6;
        innerCore.scale.setScalar(1 + Math.sin(pulseTime * 10) * 0.02);

        // Mantle plume rising animation
        plume.scale.x = 1 + Math.sin(pulseTime * 6) * 0.15;
        plume.scale.z = 1 + Math.sin(pulseTime * 6) * 0.15;

        // Volcanic eruption pulsing
        eruption.scale.y = 1 + Math.sin(pulseTime * 12) * 0.5;
        eruption.position.y = 1.5 + Math.sin(pulseTime * 12) * 0.2;
        smoke.scale.setScalar(1 + Math.sin(pulseTime * 4) * 0.3);
        smoke.rotation.y += speed * 0.2;

        // Tectonic Plates extremely slow drift
        plate1.rotation.z = Math.sin(time * speed * 0.05) * 0.03;
        plate2.rotation.z = -Math.sin(time * speed * 0.05) * 0.03;

        // Mid Ocean Ridge magma bubbling
        ridge.scale.x = 1 + Math.sin(pulseTime * 15) * 0.1;
        ridge.scale.z = 1 + Math.sin(pulseTime * 15) * 0.1;

        // Consoles blinking
        consoleGroup.children.forEach((c, i) => {
            const screen = c.children[0];
            if(screen) {
                screen.material.emissiveIntensity = 1.5 + Math.sin(time * speed * 8 + i * 2) * 1.0;
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
export function createMantleConvection() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
