import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    group.name = "God Tier Quintessence Harvester";
    
    const parts = [];
    const meshesToAnimate = [];
    const wheels = [];
    const tendrils = [];
    const pistons = [];
    const rings = [];
    const plasmaNodes = [];
    const gears = [];
    const ambientNodes = [];
    
    let timeInternal = 0;

    // ==========================================
    // HYPER-ADVANCED EMISSIVE & TECH MATERIALS
    // ==========================================
    
    const qCoreMat = new THREE.MeshPhysicalMaterial({
        color: 0x8a2be2,
        emissive: 0x4b0082,
        emissiveIntensity: 4.0,
        transparent: true,
        opacity: 0.9,
        roughness: 0.05,
        metalness: 1.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        ior: 2.5,
        thickness: 5.0,
        transmission: 0.5
    });

    const plasmaMat = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 3.5,
        wireframe: true,
        transparent: true,
        opacity: 0.9,
        roughness: 0.2,
        metalness: 0.8
    });

    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 5.0,
        transparent: true,
        opacity: 0.95
    });

    const neonGreen = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 4.0,
        transparent: true,
        opacity: 0.95
    });

    const neonOrange = new THREE.MeshStandardMaterial({
        color: 0xff8800,
        emissive: 0xff8800,
        emissiveIntensity: 3.5,
        roughness: 0.1
    });

    const darkAlloy = new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.8,
        metalness: 0.9,
        flatShading: true
    });

    const forceFieldMat = new THREE.MeshPhongMaterial({
        color: 0xaa00ff,
        emissive: 0x330088,
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide,
        depthWrite: false,
        shininess: 100
    });

    // ==========================================
    // 1. BASE CHASSIS (MASSIVE LATHE GEOMETRY)
    // ==========================================
    
    const chassisPoints = [];
    chassisPoints.push(new THREE.Vector2(0, 0));
    chassisPoints.push(new THREE.Vector2(10, 0));
    chassisPoints.push(new THREE.Vector2(12, 1));
    chassisPoints.push(new THREE.Vector2(15, 1));
    chassisPoints.push(new THREE.Vector2(18, 3));
    chassisPoints.push(new THREE.Vector2(22, 3));
    chassisPoints.push(new THREE.Vector2(25, 6));
    chassisPoints.push(new THREE.Vector2(30, 6));
    chassisPoints.push(new THREE.Vector2(32, 10));
    chassisPoints.push(new THREE.Vector2(30, 12));
    chassisPoints.push(new THREE.Vector2(28, 12));
    chassisPoints.push(new THREE.Vector2(25, 15));
    chassisPoints.push(new THREE.Vector2(20, 15));
    chassisPoints.push(new THREE.Vector2(18, 18));
    chassisPoints.push(new THREE.Vector2(15, 18));
    chassisPoints.push(new THREE.Vector2(12, 22));
    chassisPoints.push(new THREE.Vector2(8, 22));
    chassisPoints.push(new THREE.Vector2(5, 25));
    chassisPoints.push(new THREE.Vector2(0, 25));

    // Refine chassis profile to be extremely detailed
    for(let i=0; i<40; i++) {
        chassisPoints.push(new THREE.Vector2(Math.abs(Math.sin(i*0.2)) * 2, 25 + i * 0.5));
    }
    chassisPoints.push(new THREE.Vector2(0, 45));

    const chassisGeo = new THREE.LatheGeometry(chassisPoints, 128);
    const chassis = new THREE.Mesh(chassisGeo, darkSteel);
    chassis.position.y = 8;
    group.add(chassis);

    parts.push({
        name: "Omni-Directional Lathed Chassis Base",
        description: "Primary support structure forged from dark steel alloy. Features a complex gravimetric wave-diffusing profile capable of withstanding local spacetime ruptures.",
        material: "Dark Steel Alloy, Grav-Plating",
        function: "Structural integrity and spatial wave diffusion",
        assemblyOrder: 1,
        connections: ["Wheel Assemblies", "Gravimetric Stabilizers", "Core Vessel Support"],
        failureEffect: "Catastrophic structural collapse resulting in localized black hole formation",
        cascadeFailures: ["Core breach", "Tendril decoupling", "Complete vaporization"],
        originalPosition: { x: 0, y: 8, z: 0 },
        explodedPosition: { x: 0, y: -40, z: 0 }
    });

    // ==========================================
    // 2. SUPER-HEAVY WHEEL ASSEMBLIES (OFF-ROAD TREADS)
    // ==========================================
    
    const wheelPositions = [
        new THREE.Vector3(35, 12, 35),
        new THREE.Vector3(-35, 12, 35),
        new THREE.Vector3(35, 12, -35),
        new THREE.Vector3(-35, 12, -35),
        new THREE.Vector3(50, 12, 0),
        new THREE.Vector3(-50, 12, 0),
        new THREE.Vector3(0, 12, 50),
        new THREE.Vector3(0, 12, -50)
    ];

    const wheelGeo = new THREE.TorusGeometry(12, 4, 64, 128);
    const rimGeo = new THREE.CylinderGeometry(11, 11, 8, 64);
    const lugGeo = new THREE.BoxGeometry(5, 2, 3);
    const spokeGeo = new THREE.CylinderGeometry(0.8, 1.5, 11, 32);
    const hubGeo = new THREE.CylinderGeometry(4, 4, 10, 32);

    wheelPositions.forEach((pos, i) => {
        const wheelGroup = new THREE.Group();
        wheelGroup.position.copy(pos);
        const angle = Math.atan2(pos.z, pos.x);
        wheelGroup.rotation.y = angle;

        const actualTire = new THREE.Mesh(wheelGeo, rubber);
        
        // Massive aggressive treads (hundreds of lugs total across 8 wheels)
        for (let j = 0; j < 90; j++) {
            const lugAngle = (j * Math.PI * 2) / 90;
            const lug = new THREE.Mesh(lugGeo, rubber);
            lug.position.x = Math.cos(lugAngle) * 15;
            lug.position.y = Math.sin(lugAngle) * 15;
            lug.rotation.z = lugAngle;
            actualTire.add(lug);
        }

        const rim = new THREE.Mesh(rimGeo, chrome);
        rim.rotation.x = Math.PI / 2;
        actualTire.add(rim);

        const hub = new THREE.Mesh(hubGeo, copper);
        hub.rotation.x = Math.PI / 2;
        actualTire.add(hub);

        // Complex spoke arrays
        for (let s = 0; s < 18; s++) {
            const spokeAngle = (s * Math.PI * 2) / 18;
            const spoke = new THREE.Mesh(spokeGeo, darkSteel);
            spoke.position.x = Math.cos(spokeAngle) * 6;
            spoke.position.y = Math.sin(spokeAngle) * 6;
            spoke.rotation.set(0, 0, spokeAngle - Math.PI / 2);
            actualTire.add(spoke);
        }

        wheelGroup.add(actualTire);
        wheels.push({ mesh: actualTire, rollSpeed: (i % 2 === 0 ? 1 : -1) });
        group.add(wheelGroup);

        parts.push({
            name: `Super-Heavy Off-Road Traction Unit ${i+1}`,
            description: `A titanic off-road wheel capable of supporting the Harvester's unimaginable mass. Designed for extreme extraterrestrial terrain and vacuum environments.`,
            material: "Hyper-Vulcanized Rubber, Chrome, Dark Steel",
            function: "Mobility and chassis support on shifting tectonic plates",
            assemblyOrder: 2 + i,
            connections: ["Suspension Array", "Grav-Drive Motor Axle"],
            failureEffect: "Asymmetric immobility and tipping",
            cascadeFailures: ["Drive motor burnout", "Axle shear", "Harvester overturning"],
            originalPosition: { x: pos.x, y: pos.y, z: pos.z },
            explodedPosition: { x: pos.x * 3, y: pos.y - 10, z: pos.z * 3 }
        });
    });

    // ==========================================
    // 3. GRAVIMETRIC SYNC GEARS (EXTRUDE GEOMETRY)
    // ==========================================
    
    const gearShape = new THREE.Shape();
    gearShape.moveTo(0, 10);
    for(let i=1; i<=64; i++) {
        const a1 = (i * Math.PI * 2) / 64;
        const a2 = ((i+0.5) * Math.PI * 2) / 64;
        const r1 = (i % 2 === 0) ? 10 : 12;
        const r2 = (i % 2 === 0) ? 12 : 10;
        gearShape.lineTo(Math.cos(a1)*r1, Math.sin(a1)*r1);
        gearShape.lineTo(Math.cos(a2)*r2, Math.sin(a2)*r2);
    }
    
    // Internal Cutouts
    const centerHole = new THREE.Path();
    centerHole.absarc(0, 0, 5, 0, Math.PI * 2, false);
    gearShape.holes.push(centerHole);
    
    for(let i=0; i<8; i++) {
        const hp = new THREE.Path();
        hp.absarc(Math.cos(i*Math.PI/4)*7.5, Math.sin(i*Math.PI/4)*7.5, 1.5, 0, Math.PI * 2, false);
        gearShape.holes.push(hp);
    }

    const exSet = { 
        depth: 2.5, 
        bevelEnabled: true, 
        bevelSegments: 5, 
        steps: 3, 
        bevelSize: 0.3, 
        bevelThickness: 0.3 
    };
    
    const gearGeo = new THREE.ExtrudeGeometry(gearShape, exSet);
    
    for(let g=0; g<12; g++) {
        const gear = new THREE.Mesh(gearGeo, copper);
        const gx = Math.cos((g*Math.PI*2)/12) * 22;
        const gz = Math.sin((g*Math.PI*2)/12) * 22;
        gear.position.set(gx, 50, gz);
        gear.rotation.x = Math.PI / 2;
        group.add(gear);
        gears.push({ mesh: gear, speed: (g%2===0?2:-2) });
        
        parts.push({
            name: `Gravimetric Synchronization Gear ${g+1}`,
            description: `Massive copper extrusion gear synchronizing the rotation of the inner core components to prevent temporal desync.`,
            material: "Superconducting Copper",
            function: "Mechanical and temporal synchronization",
            assemblyOrder: 20 + g,
            connections: ["Core Shaft", "Ring Motors", "Main Drive"],
            failureEffect: "Temporal desync of resonance rings",
            cascadeFailures: ["Vessel fracture", "Plasma leak", "Time dilation anomaly"],
            originalPosition: { x: gx, y: 50, z: gz },
            explodedPosition: { x: gx*2.5, y: 50, z: gz*2.5 }
        });
    }

    // ==========================================
    // 4. CONTAINMENT CORE (MULTI-LAYERED)
    // ==========================================
    
    const coreGroup = new THREE.Group();
    coreGroup.position.set(0, 75, 0);
    group.add(coreGroup);

    const crystalGeo = new THREE.IcosahedronGeometry(15, 3);
    const crystal = new THREE.Mesh(crystalGeo, qCoreMat);
    coreGroup.add(crystal);
    meshesToAnimate.push({ mesh: crystal, type: 'core_crystal' });

    const plasmaSphereGeo = new THREE.SphereGeometry(18, 64, 64);
    const plasmaSphere = new THREE.Mesh(plasmaSphereGeo, plasmaMat);
    coreGroup.add(plasmaSphere);
    meshesToAnimate.push({ mesh: plasmaSphere, type: 'core_plasma' });

    const shellGeo = new THREE.IcosahedronGeometry(21, 5);
    const shellWireframe = new THREE.Mesh(shellGeo, new THREE.MeshStandardMaterial({ 
        color: 0x333333, 
        wireframe: true,
        roughness: 0.1,
        metalness: 1.0
    }));
    coreGroup.add(shellWireframe);
    meshesToAnimate.push({ mesh: shellWireframe, type: 'core_shell' });

    // Inner rotating bands
    for(let b=0; b<3; b++) {
        const bandGeo = new THREE.TorusGeometry(23, 0.5, 16, 100);
        const band = new THREE.Mesh(bandGeo, neonOrange);
        band.rotation.x = b * Math.PI/3;
        coreGroup.add(band);
        meshesToAnimate.push({ mesh: band, type: `core_band_${b}` });
    }

    parts.push({
        name: "God-Tier Quintessence Containment Core",
        description: "The absolute heart of the machine. Houses an artificial singularity bound by a quantum plasma lattice. Modulates dark energy down to usable states.",
        material: "Quantum Glass, Plasma Grid, Dark Alloy, Neon Emitters",
        function: "Storing and stabilizing harvested dark energy",
        assemblyOrder: 40,
        connections: ["Chassis Top Plate", "Cooling Towers", "Energy Rings", "Sync Gears"],
        failureEffect: "Uncontrolled dark energy release",
        cascadeFailures: ["Spacetime localized rupture", "Total vaporization of harvester and surrounding continent"],
        originalPosition: { x: 0, y: 75, z: 0 },
        explodedPosition: { x: 0, y: 200, z: 0 }
    });

    // ==========================================
    // 5. RELATIVISTIC RESONANCE RINGS
    // ==========================================
    
    const ringRadii = [30, 36, 42, 48, 54, 60, 66, 72];
    ringRadii.forEach((r, i) => {
        const ringGroup = new THREE.Group();
        const rGeo = new THREE.TorusGeometry(r, 1.5, 32, 256);
        const ring = new THREE.Mesh(rGeo, chrome);
        
        // Emitters on each ring
        for(let e=0; e<32; e++) {
            const eGeo = new THREE.CylinderGeometry(1.0, 2.5, 6, 32);
            const emitter = new THREE.Mesh(eGeo, neonRed);
            const a = (e * Math.PI * 2) / 32;
            emitter.position.x = Math.cos(a) * r;
            emitter.position.y = Math.sin(a) * r;
            emitter.rotation.z = a + Math.PI/2;
            ring.add(emitter);
            plasmaNodes.push(emitter);
        }

        ringGroup.add(ring);
        coreGroup.add(ringGroup);
        rings.push({ group: ringGroup, speed: (i % 2 === 0 ? 0.015 : -0.01) * (i + 1), axis: (i % 3) });
        
        parts.push({
            name: `Hyper-Resonance Confinement Ring Mk-${i+1}`,
            description: `Gigantic superconducting ring rotating at relativistic speeds to electromagnetically bottle the core plasma. Radius: ${r} meters.`,
            material: "Chromium, YBCO Superconductors",
            function: "Core stabilization and singularity confinement",
            assemblyOrder: 100 + i,
            connections: ["Magnetic Axis", "Power Grid", "Core Housing"],
            failureEffect: "Magnetic field topology collapse",
            cascadeFailures: ["Plasma leakage", "Vessel fracture", "Subatomic shearing"],
            originalPosition: { x: 0, y: 75, z: 0 },
            explodedPosition: { x: 0, y: 250 + i*25, z: 0 }
        });
    });

    // ==========================================
    // 6. VACUUM ENERGY SIPHONING TENDRILS
    // ==========================================
    
    const tendrilCount = 24;
    const segmentsPerTendril = 20;
    
    for(let t=0; t<tendrilCount; t++) {
        const tGroup = new THREE.Group();
        const startAngle = (t * Math.PI * 2) / tendrilCount;
        
        const baseX = Math.cos(startAngle) * 28;
        const baseZ = Math.sin(startAngle) * 28;
        tGroup.position.set(baseX, 55, baseZ);
        
        const mountGeo = new THREE.CylinderGeometry(2.5, 5, 8, 32);
        const mount = new THREE.Mesh(mountGeo, steel);
        tGroup.add(mount);

        let parent = tGroup;
        const tendrilBones = [];

        for(let s=0; s<segmentsPerTendril; s++) {
            const segGroup = new THREE.Group();
            segGroup.position.y = (s === 0) ? 4 : 12;
            
            const segGeo = new THREE.CylinderGeometry(2.5 - s*0.1, 2.5 - s*0.1, 12, 32);
            const segment = new THREE.Mesh(segGeo, darkAlloy);
            segment.position.y = 6;
            
            const jointGeo = new THREE.SphereGeometry(2.8 - s*0.1, 32, 32);
            const joint = new THREE.Mesh(jointGeo, copper);
            
            const veinGeo = new THREE.CylinderGeometry(2.6 - s*0.1, 2.6 - s*0.1, 11, 16, 1, true);
            const vein = new THREE.Mesh(veinGeo, qCoreMat);
            vein.position.y = 6;

            segGroup.add(joint);
            segGroup.add(segment);
            segGroup.add(vein);
            
            parent.add(segGroup);
            tendrilBones.push(segGroup);
            parent = segGroup;
        }

        // Complex Dish at tip
        const dishPoints = [];
        for(let d=0; d<20; d++) {
            dishPoints.push(new THREE.Vector2(d * 0.7, Math.pow(d*0.35, 2)));
        }
        const dishGeo = new THREE.LatheGeometry(dishPoints, 64);
        const dish = new THREE.Mesh(dishGeo, chrome);
        dish.position.y = 12;
        dish.rotation.x = Math.PI;
        parent.add(dish);
        
        const tipCoreGeo = new THREE.SphereGeometry(2.5, 32, 32);
        const tipCore = new THREE.Mesh(tipCoreGeo, neonGreen);
        tipCore.position.y = 10;
        parent.add(tipCore);
        plasmaNodes.push(tipCore);

        group.add(tGroup);
        tendrils.push({ bones: tendrilBones, phaseOffset: t * 0.5 });
        
        parts.push({
            name: `Vacuum Siphoning Tendril Alpha-${t+1}`,
            description: `Hyper-articulated robotic tendril extending into the vacuum to siphon latent dark energy. Features 20 independent micro-joints for sweeping the quantum foam.`,
            material: "Dark Alloy, Copper, Quantum Glass",
            function: "Active energy harvesting from the zero-point field",
            assemblyOrder: 150 + t,
            connections: ["Core Mount", "Hydraulic Manifold", "Coolant Pipes"],
            failureEffect: "Loss of harvesting capacity in spatial sector",
            cascadeFailures: ["Overcompensation by adjacent tendrils", "Power grid imbalance"],
            originalPosition: { x: baseX, y: 55, z: baseZ },
            explodedPosition: { x: baseX * 6, y: 150, z: baseZ * 6 }
        });
    }

    // ==========================================
    // 7. MASSIVE HYDRAULIC ACTUATORS
    // ==========================================
    
    for(let h=0; h<24; h++) {
        const hydGroup = new THREE.Group();
        const angle = (h * Math.PI * 2) / 24 + Math.PI/24;
        const start = new THREE.Vector3(Math.cos(angle)*20, 60, Math.sin(angle)*20);
        hydGroup.position.copy(start);
        
        // Aim at the tendril base it supports
        hydGroup.lookAt(new THREE.Vector3(Math.cos(angle)*30, 55, Math.sin(angle)*30));

        const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 25, 32), steel);
        cylinder.rotation.x = Math.PI / 2;
        cylinder.position.z = 12.5;
        hydGroup.add(cylinder);

        const piston = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 25, 32), chrome);
        piston.rotation.x = Math.PI / 2;
        piston.position.z = 30;
        hydGroup.add(piston);
        pistons.push({ mesh: piston, baseZ: 30, phase: h });

        group.add(hydGroup);
        
        parts.push({
            name: `Heavy-Duty Hydraulic Actuator Unit ${h+1}`,
            description: `Extreme pressure hydraulic strut managing the mechanical load of the god-tier tendrils. Operates at 50,000 PSI.`,
            material: "Forged Steel, Chromium Plating",
            function: "Mechanical articulation and load bearing",
            assemblyOrder: 180 + h,
            connections: ["Chassis Bracket", "Tendril Base Joint"],
            failureEffect: "Tendril droop and misalignment",
            cascadeFailures: ["Physical collision of tendrils", "Loss of harvest alignment"],
            originalPosition: { x: start.x, y: start.y, z: start.z },
            explodedPosition: { x: start.x * 2.5, y: start.y + 20, z: start.z * 2.5 }
        });
    }

    // ==========================================
    // 8. COOLANT MANIFOLDS (COMPLEX CURVES)
    // ==========================================
    
    for(let i=0; i<16; i++) {
        const pipePoints = [];
        for(let p=0; p<=15; p++) {
            pipePoints.push(new THREE.Vector3(
                Math.cos((p/15)*Math.PI*2 + i) * (18 + p*2.5),
                25 + p*6 + Math.sin(p*1.5) * 8,
                Math.sin((p/15)*Math.PI*2 + i) * (18 + p*2.5)
            ));
        }
        
        const pipeCurve = new THREE.CatmullRomCurve3(pipePoints);
        const pipeGeo = new THREE.TubeGeometry(pipeCurve, 128, 2, 32, false);
        const pipeMesh = new THREE.Mesh(pipeGeo, copper);
        group.add(pipeMesh);
        
        parts.push({
            name: `Superconducting Coolant Manifold ${i+1}`,
            description: `High-capacity coolant transit line flowing liquid helium to superconducting ring nodes. Follows non-Euclidean routing.`,
            material: "Beryllium-Copper Alloy",
            function: "Thermal regulation and heat dissipation",
            assemblyOrder: 210 + i,
            connections: ["Core Exchanger", "Ring Heat Sinks", "Base Radiator"],
            failureEffect: "Localized thermal spike in ring segment",
            cascadeFailures: ["Superconductor quench", "Ring shattering"],
            originalPosition: { x: 0, y: 30, z: 0 },
            explodedPosition: { x: (i%4)*20 - 30, y: -30, z: Math.floor(i/4)*20 - 30 }
        });
    }

    // ==========================================
    // 9. NEXUS OPERATOR COMMAND POD
    // ==========================================
    
    const podGroup = new THREE.Group();
    podGroup.position.set(0, 200, 60);
    
    const podBodyGeo = new THREE.CylinderGeometry(20, 15, 25, 64);
    const podBody = new THREE.Mesh(podBodyGeo, aluminum);
    podBody.rotation.x = Math.PI / 2;
    podGroup.add(podBody);

    const podWindowGeo = new THREE.SphereGeometry(16, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2.2);
    const podWindow = new THREE.Mesh(podWindowGeo, tinted);
    podWindow.rotation.x = Math.PI / 2;
    podWindow.position.z = 12;
    podGroup.add(podWindow);

    // Antennas
    for(let a=0; a<8; a++) {
        const antGeo = new THREE.CylinderGeometry(0.3, 0.6, 35, 16);
        const antenna = new THREE.Mesh(antGeo, steel);
        antenna.position.set(Math.cos(a)*14, 20, Math.sin(a)*14 - 5);
        antenna.rotation.z = (Math.random() - 0.5) * 1.5;
        podGroup.add(antenna);
    }

    // Support Struts
    const strutGeo = new THREE.CylinderGeometry(3, 3, 130, 32);
    const strut1 = new THREE.Mesh(strutGeo, darkSteel);
    strut1.position.set(-15, -60, -25);
    strut1.rotation.x = Math.PI / 4;
    podGroup.add(strut1);

    const strut2 = new THREE.Mesh(strutGeo, darkSteel);
    strut2.position.set(15, -60, -25);
    strut2.rotation.x = Math.PI / 4;
    podGroup.add(strut2);

    group.add(podGroup);
    
    parts.push({
        name: "God-Tier Nexus Operator Command Pod",
        description: "Massive suspended command center wrapped in multi-layered rad-shielding. Accommodates 12 specialized operators monitoring the vacuum decay rates.",
        material: "Aluminum, Tinted Rad-Glass, Steel, Lead Lining",
        function: "Command, Control, and Life Support",
        assemblyOrder: 230,
        connections: ["Main Support Struts", "Telemetry Databus"],
        failureEffect: "Operator casualty due to radiation or vacuum exposure",
        cascadeFailures: ["Loss of manual override", "Automated system lock"],
        originalPosition: { x: 0, y: 200, z: 60 },
        explodedPosition: { x: 0, y: 350, z: 150 }
    });

    // ==========================================
    // 10. VACUUM PERMITTIVITY SENSORS
    // ==========================================
    
    for(let i=0; i<64; i++) {
        const sGroup = new THREE.Group();
        const angle = (i * Math.PI * 2) / 64;
        const rad = 50 + (i%2)*10;
        const yPos = 30 + (i%3)*15;
        
        sGroup.position.set(Math.cos(angle)*rad, yPos, Math.sin(angle)*rad);
        
        const sGeo = new THREE.BoxGeometry(2, 4, 2);
        const sMesh = new THREE.Mesh(sGeo, darkAlloy);
        
        const sLightGeo = new THREE.SphereGeometry(1.2, 16, 16);
        const sLight = new THREE.Mesh(sLightGeo, neonRed);
        sLight.position.y = 2.5;
        
        sGroup.add(sMesh);
        sGroup.add(sLight);
        ambientNodes.push(sLight);
        group.add(sGroup);
        
        parts.push({
            name: `Vacuum Permittivity Sensor Node ${i+1}`,
            description: "Precision chronal-distortion and vacuum permittivity sensor mapping localized spacetime topology variations in real-time.",
            material: "Dark Alloy, Quantum Glass",
            function: "Telemetry and spatial mapping",
            assemblyOrder: 240 + i,
            connections: ["Telemetry Bus", "Chassis Mounting"],
            failureEffect: "Blindspot in spacetime mapping",
            cascadeFailures: ["Inaccurate tendril sweep vectors"],
            originalPosition: { x: Math.cos(angle)*rad, y: yPos, z: Math.sin(angle)*rad },
            explodedPosition: { x: Math.cos(angle)*rad*2, y: yPos*1.5, z: Math.sin(angle)*rad*2 }
        });
    }

    // ==========================================
    // 11. AMBIENT QUINTESSENCE VORTEX (PARTICLES)
    // ==========================================
    
    const particleCount = 10000;
    const particleGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    for(let i=0; i<particleCount; i++) {
        posArray[i*3] = (Math.random() - 0.5) * 400;
        posArray[i*3+1] = (Math.random() - 0.5) * 400 + 150;
        posArray[i*3+2] = (Math.random() - 0.5) * 400;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particleMat = new THREE.PointsMaterial({
        size: 1.2,
        color: 0xcc00ff,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    group.add(particleSystem);

    parts.push({
        name: "Ambient Quintessence Vortex Field",
        description: "Visual manifestation of the extreme vacuum energy densities being harvested by the machine. Formed by localized topological defects.",
        material: "Raw Dark Energy Field",
        function: "Byproduct of harvesting, acts as a buffer field",
        assemblyOrder: 350,
        connections: ["Vacuum Space"],
        failureEffect: "Visual occlusion of harvesting area",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 150, z: 0 },
        explodedPosition: { x: 0, y: 150, z: 0 }
    });

    // ==========================================
    // QUIZ QUESTIONS
    // ==========================================
    
    const quizQuestions = [
        {
            question: "In the context of the Quintessence Harvester, how does the equation of state parameter (w) for quintessence differ from that of a cosmological constant?",
            options: [
                "w is exactly -1 for quintessence, while the cosmological constant varies dynamically.",
                "w is dynamically changing over time (often > -1) for quintessence, whereas for a cosmological constant w = -1 exactly.",
                "w must be positive for both to drive accelerated expansion.",
                "w = 0 for quintessence, acting like standard dark matter."
            ],
            correctAnswer: 1,
            explanation: "Quintessence is a dynamic, time-evolving scalar field where its equation of state parameter w is typically a function of time (often w > -1), unlike the cosmological constant where w is strictly -1."
        },
        {
            question: "Why must the resonance confinement rings rotate on orthogonal axes to stabilize the harvested quintessence plasma?",
            options: [
                "To simulate gravity for the operators in the pod.",
                "To create a topological magnetic bottle that prevents non-perturbative vacuum decay anomalies.",
                "To cool down the plasma through atmospheric friction.",
                "Orthogonal rotation cancels out the mass of the machine."
            ],
            correctAnswer: 1,
            explanation: "In theoretical physics involving high-energy scalar fields, containing them requires complex topological bounding. Orthogonal rotating magnetic fields form a 'bottle' that mitigates vacuum decay and spatial anomalies."
        },
        {
            question: "Which mechanism allows the Antimatter Injectors to catalyze dark energy synthesis without violating baryon number conservation globally?",
            options: [
                "They use CP-violation buffers to symmetrically inject baryons and anti-baryons into a localized sphaleron transition.",
                "Antimatter acts as a thermal sink and absorbs excess baryons.",
                "Baryon number is completely ignored in classical mechanics.",
                "The towers only inject electrons, which are not baryons."
            ],
            correctAnswer: 0,
            explanation: "Sphaleron transitions can violate baryon number conservation at extreme energies. By utilizing CP-violation buffers, the injectors carefully manage the baryon/anti-baryon asymmetry necessary to interact with the scalar field."
        },
        {
            question: "The energy siphoning tendrils are articulated using complex kinetic manifolds. In physical cosmology, what mathematical structure do these tendrils map to when tracking dark energy filaments?",
            options: [
                "The Friedmann-Lemaître-Robertson-Walker (FLRW) metric.",
                "The large-scale cosmic web structure defined by the Vlasov-Poisson equations.",
                "Geodesics of a Schwarzschild black hole.",
                "The chaotic attractor of a double pendulum."
            ],
            correctAnswer: 1,
            explanation: "Tendrils navigate along the gradient of the local scalar field, which maps closely to the cosmic web filaments of dark matter and energy, governed by the Vlasov-Poisson equations in large-scale structure formation."
        },
        {
            question: "If the Primary Containment Vessel experiences a 'Phantom Energy' shift (w < -1), what is the immediate risk to the Harvester's structural integrity?",
            options: [
                "The harvester will shrink into a micro black hole.",
                "The surrounding spacetime will experience a localized 'Big Rip', tearing the atomic structure of the machine apart.",
                "The machine will freeze to absolute zero.",
                "The tires will deflate due to lack of atmospheric pressure."
            ],
            correctAnswer: 1,
            explanation: "Phantom energy (w < -1) leads to an accelerating expansion rate that grows to infinity in finite time, causing a 'Big Rip' where even atomic and subatomic bounds are torn apart by the expansion of spacetime."
        }
    ];

    // ==========================================
    // ANIMATION LOOP
    // ==========================================
    
    function animate(time, speed, meshes) {
        timeInternal += speed * 0.01;
        
        // 1. Core Pulsing and Band Rotation
        meshesToAnimate.forEach(item => {
            if (item.type === 'core_crystal') {
                item.mesh.rotation.y = timeInternal * 2;
                item.mesh.rotation.x = timeInternal * 1.5;
                const scale = 1.0 + Math.sin(timeInternal * 6) * 0.2;
                item.mesh.scale.set(scale, scale, scale);
            }
            if (item.type === 'core_plasma') {
                item.mesh.rotation.z = -timeInternal * 1.2;
                const scale = 1.0 + Math.cos(timeInternal * 4) * 0.1;
                item.mesh.scale.set(scale, scale, scale);
                // Cycle HSL colors representing energy states
                item.mesh.material.color.setHSL((Math.sin(timeInternal*0.5)+1)/2, 1, 0.6);
                item.mesh.material.emissive.setHSL((Math.sin(timeInternal*0.5)+1)/2, 1, 0.6);
            }
            if (item.type === 'core_shell') {
                item.mesh.rotation.y = timeInternal * 0.8;
                item.mesh.rotation.x = timeInternal * 0.4;
            }
            if (item.type.startsWith('core_band')) {
                item.mesh.rotation.y = timeInternal * 3;
                item.mesh.rotation.z = timeInternal * 2;
            }
        });

        // 2. Rings Relativistic Rotation
        rings.forEach(ring => {
            if(ring.axis === 0) ring.group.rotation.x = timeInternal * ring.speed * 70;
            if(ring.axis === 1) ring.group.rotation.y = timeInternal * ring.speed * 70;
            if(ring.axis === 2) ring.group.rotation.z = timeInternal * ring.speed * 70;
        });

        // 3. Wheels Rolling
        wheels.forEach(w => {
            w.mesh.rotation.z += speed * w.rollSpeed * 0.1;
        });

        // 4. Synchronization Gears Spinning
        gears.forEach(g => {
            g.mesh.rotation.z = timeInternal * g.speed * 1.5;
        });

        // 5. Tendril Sweeping Kinematics
        tendrils.forEach(t => {
            const phase = timeInternal * 2.5 + t.phaseOffset;
            t.bones.forEach((bone, index) => {
                const localPhase = phase - index * 0.4;
                bone.rotation.x = Math.sin(localPhase) * 0.22;
                bone.rotation.z = Math.cos(localPhase) * 0.22;
                
                // Vein pulsing
                const vein = bone.children[2];
                if(vein) {
                    const intense = (Math.sin(localPhase * 5) + 1) / 2;
                    vein.material.emissiveIntensity = 2.0 + intense * 4;
                }
            });
        });

        // 6. Hydraulic Pistons Actuating
        pistons.forEach(p => {
            p.mesh.position.z = p.baseZ + Math.sin(timeInternal * 5 + p.phase) * 5;
        });

        // 7. Node Flickering
        plasmaNodes.forEach((node, i) => {
            const flicker = Math.random() > 0.8 ? 6.0 : 2.0;
            node.material.emissiveIntensity = flicker + Math.sin(timeInternal*10 + i)*2;
        });
        
        ambientNodes.forEach((node, i) => {
            node.material.emissiveIntensity = 1.0 + Math.abs(Math.sin(timeInternal*2 + i)*3);
        });

        // 8. Particle System Vortex Dynamics
        particleSystem.rotation.y = timeInternal * 0.4;
        
        const positions = particleSystem.geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            let y = positions[i * 3 + 1];
            y -= speed * 1.5;
            
            // Vortex swirling effect
            const x = positions[i * 3];
            const z = positions[i * 3 + 2];
            const radius = Math.sqrt(x*x + z*z);
            const angle = Math.atan2(z, x) + 0.02 * speed;
            
            positions[i * 3] = Math.cos(angle) * radius;
            positions[i * 3 + 2] = Math.sin(angle) * radius;

            if (y < -100) {
                y = 400;
            }
            positions[i * 3 + 1] = y;
        }
        particleSystem.geometry.attributes.position.needsUpdate = true;
    }

    return { 
        group, 
        parts, 
        description: "The God-Tier Quintessence Harvester is an incomprehensibly complex, multi-layered machine designed to siphon dark energy directly from the vacuum of space. It utilizes hyper-articulated tendrils, relativistic resonance rings, and a quantum plasma lattice to stabilize a captive singularity. Operation requires Level 9 Void-Shielding and a comprehensive understanding of non-perturbative topological field theories.", 
        quizQuestions, 
        animate 
    };
}
