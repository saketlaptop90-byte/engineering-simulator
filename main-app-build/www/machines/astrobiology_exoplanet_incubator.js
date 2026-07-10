import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const description = "Astrometric Exoplanet Incubator Class IX. An ultra-advanced, heavily shielded, and hyper-regulated hermetic chamber designed for the synthesis, cultivation, and analysis of alien flora under extreme exoplanetary conditions. Features include multi-phase atmospheric injection, isotopic radiation filtering, high-pressure hydraulic containment, and fully automated spectroscopic nutrient delivery systems.";

    // Custom Materials
    const uvLightMat = new THREE.MeshStandardMaterial({
        color: 0xaa00ff,
        emissive: 0xaa00ff,
        emissiveIntensity: 3.5,
        roughness: 0.1,
        metalness: 0.1
    });

    const neonGreenMat = new THREE.MeshStandardMaterial({
        color: 0x00ff44,
        emissive: 0x00ff44,
        emissiveIntensity: 2.0,
        roughness: 0.2,
        metalness: 0.5
    });

    const alienBioluminescenceMat = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00aaff,
        emissiveIntensity: 4.0,
        wireframe: true,
        transparent: true,
        opacity: 0.8
    });

    const glowingBlueFluid = new THREE.MeshStandardMaterial({
        color: 0x0055ff,
        emissive: 0x0022cc,
        emissiveIntensity: 1.2,
        transparent: true,
        opacity: 0.9,
        roughness: 0.1
    });

    const glowingRedFluid = new THREE.MeshStandardMaterial({
        color: 0xff0022,
        emissive: 0xaa0011,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.85,
        roughness: 0.1
    });

    const screenMat = new THREE.MeshStandardMaterial({
        color: 0x000000,
        emissive: 0x0088ff,
        emissiveIntensity: 1.5,
        roughness: 0.5
    });

    // Helper: Create a complex flanged pipe
    function createFlangedPipe(pathCoords, radius, tubeSegments, radialSegments, material) {
        const pipeGroup = new THREE.Group();
        const curve = new THREE.CatmullRomCurve3(pathCoords.map(c => new THREE.Vector3(...c)));
        const tubeGeom = new THREE.TubeGeometry(curve, tubeSegments, radius, radialSegments, false);
        const tubeMesh = new THREE.Mesh(tubeGeom, material);
        pipeGroup.add(tubeMesh);

        // Add flanges at intervals
        const flangeCount = Math.floor(tubeSegments / 4);
        const flangeGeom = new THREE.CylinderGeometry(radius * 1.5, radius * 1.5, radius * 0.4, radialSegments);
        for (let i = 1; i < flangeCount; i++) {
            const t = i / flangeCount;
            const pt = curve.getPointAt(t);
            const tangent = curve.getTangentAt(t);
            const flange = new THREE.Mesh(flangeGeom, darkSteel);
            flange.position.copy(pt);
            
            const axis = new THREE.Vector3(0, 1, 0);
            flange.quaternion.setFromUnitVectors(axis, tangent);
            pipeGroup.add(flange);
        }
        return pipeGroup;
    }

    // 1. Base Platform - Highly detailed octagonal shape
    const baseShape = new THREE.Shape();
    const size = 10;
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * size;
        const y = Math.sin(angle) * size;
        if (i === 0) baseShape.moveTo(x, y);
        else baseShape.lineTo(x, y);
    }
    const extrudeSettings = { depth: 2, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.5, bevelThickness: 0.5 };
    const baseGeom = new THREE.ExtrudeGeometry(baseShape, extrudeSettings);
    baseGeom.rotateX(-Math.PI / 2);
    const basePlatform = new THREE.Mesh(baseGeom, darkSteel);
    basePlatform.position.y = -2;
    group.add(basePlatform);

    // Platform Grating and details
    for(let i = 0; i < 8; i++) {
        const angle = (i/8) * Math.PI * 2;
        const supportGeom = new THREE.CylinderGeometry(0.8, 1.2, 4, 16);
        const support = new THREE.Mesh(supportGeom, steel);
        support.position.set(Math.cos(angle) * 9, -2, Math.sin(angle) * 9);
        group.add(support);
    }

    parts.push({
        name: "Omni-directional Seismic Isolation Platform",
        description: "Massive durasteel octagonal base providing critical vibrational dampening and foundational integrity for the extreme pressurized environment.",
        material: "Dark Steel / Durasteel",
        function: "Structural Base & Seismic Dampening",
        assemblyOrder: 1,
        connections: ["Incubator Main Chamber", "Atmospheric Control Pipes", "Hydraulic Lifts"],
        failureEffect: "Catastrophic misalignment causing containment breach",
        cascadeFailures: ["Incubator Main Chamber", "Fluid Reservoirs"],
        originalPosition: { x: 0, y: -2, z: 0 },
        explodedPosition: { x: 0, y: -15, z: 0 }
    });

    // 2. Main Incubator Chamber (Sealed Environmental Chamber)
    const chamberGroup = new THREE.Group();
    chamberGroup.position.y = 1;
    
    // Outer Glass Dome
    const domeGeom = new THREE.CylinderGeometry(6, 6, 12, 64, 1, false);
    const dome = new THREE.Mesh(domeGeom, glass);
    chamberGroup.add(dome);

    // Inner containment field (Emissive thin cylinder)
    const fieldGeom = new THREE.CylinderGeometry(5.8, 5.8, 11.5, 64, 1, true);
    const fieldMaterial = new THREE.MeshStandardMaterial({
        color: 0xaa88ff,
        emissive: 0xaa88ff,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.1,
        side: THREE.DoubleSide
    });
    const containmentField = new THREE.Mesh(fieldGeom, fieldMaterial);
    chamberGroup.add(containmentField);

    // Structural Ribs for Dome
    for(let i=0; i<12; i++) {
        const ribGeom = new THREE.BoxGeometry(0.4, 12.5, 0.4);
        const rib = new THREE.Mesh(ribGeom, chrome);
        const angle = (i/12) * Math.PI * 2;
        rib.position.set(Math.cos(angle)*6.1, 0, Math.sin(angle)*6.1);
        chamberGroup.add(rib);
    }

    // Top Dome Cap
    const capGeom = new THREE.SphereGeometry(6.1, 64, 32, 0, Math.PI*2, 0, Math.PI/2);
    const cap = new THREE.Mesh(capGeom, steel);
    cap.position.y = 6;
    chamberGroup.add(cap);

    group.add(chamberGroup);

    parts.push({
        name: "Hyper-Baric Borosilicate Containment Vessel",
        description: "The primary sealed chamber constructed from transparent aerospace-grade borosilicate and reinforced with chrome structural ribs.",
        material: "Reinforced Glass & Chrome",
        function: "Hermetic seal & extreme pressure management",
        assemblyOrder: 5,
        connections: ["Omni-directional Seismic Isolation Platform", "Top Dome Cap"],
        failureEffect: "Instant decompression and atmospheric contamination",
        cascadeFailures: ["Alien Flora Terrarium Core", "UV Grow Light Rings"],
        originalPosition: { x: 0, y: 1, z: 0 },
        explodedPosition: { x: 0, y: 25, z: 0 }
    });

    // 3. Terrarium Core (Alien Terrain)
    const terrainGroup = new THREE.Group();
    terrainGroup.position.y = -4;

    const terrainGeom = new THREE.CylinderGeometry(5.9, 5.9, 2, 64);
    const terrainMat = new THREE.MeshStandardMaterial({ color: 0x331122, roughness: 1.0, bumpScale: 0.5 });
    const terrain = new THREE.Mesh(terrainGeom, terrainMat);
    terrainGroup.add(terrain);

    // Terrarium soil details (extruded random shapes)
    for(let i=0; i<30; i++) {
        const rockGeom = new THREE.DodecahedronGeometry(Math.random() * 0.8 + 0.2);
        const rockMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9 });
        const rock = new THREE.Mesh(rockGeom, rockMat);
        const r = Math.random() * 5;
        const theta = Math.random() * Math.PI * 2;
        rock.position.set(Math.cos(theta) * r, 1, Math.sin(theta) * r);
        rock.rotation.set(Math.random(), Math.random(), Math.random());
        terrainGroup.add(rock);
    }
    
    group.add(terrainGroup);

    parts.push({
        name: "Synthetic Exoplanetary Soil Matrix",
        description: "A highly engineered bed of synthetic regolith, precisely calibrated with alien isotopic signatures and rare-earth nutrients.",
        material: "Synthetic Regolith Matrix",
        function: "Rooting base and primary nutrient source for extraterrestrial flora",
        assemblyOrder: 2,
        connections: ["Omni-directional Seismic Isolation Platform", "Nutrient Injector Array"],
        failureEffect: "Flora malnutrition and widespread necrosis",
        cascadeFailures: ["Bioluminescent Flora Specimens"],
        originalPosition: { x: 0, y: -4, z: 0 },
        explodedPosition: { x: 0, y: -8, z: 0 }
    });

    // 4. Alien Flora
    const floraGroup = new THREE.Group();
    floraGroup.position.y = -3;
    const animateFlora = [];

    // Specimen A: Twisted Vines
    const vineGeom = new THREE.TorusKnotGeometry(2, 0.3, 128, 16, 3, 5);
    const vine = new THREE.Mesh(vineGeom, neonGreenMat);
    vine.position.set(0, 3, 0);
    floraGroup.add(vine);
    animateFlora.push({ mesh: vine, type: 'rotate' });

    // Specimen B: Bioluminescent Spores
    for(let i=0; i<15; i++) {
        const sporeGeom = new THREE.SphereGeometry(Math.random()*0.4 + 0.2, 32, 32);
        const spore = new THREE.Mesh(sporeGeom, alienBioluminescenceMat);
        const r = Math.random() * 4.5;
        const theta = Math.random() * Math.PI * 2;
        spore.position.set(Math.cos(theta)*r, Math.random()*6 + 1, Math.sin(theta)*r);
        floraGroup.add(spore);
        animateFlora.push({ mesh: spore, type: 'pulse', phase: Math.random()*Math.PI*2 });
    }

    // Specimen C: Pulsing Core Bulb
    const bulbGeom = new THREE.LatheGeometry([
        new THREE.Vector2(0, 0),
        new THREE.Vector2(1, 1),
        new THREE.Vector2(1.5, 3),
        new THREE.Vector2(0.5, 5),
        new THREE.Vector2(0, 6)
    ], 32);
    const bulb = new THREE.Mesh(bulbGeom, new THREE.MeshStandardMaterial({ color: 0xff0055, emissive: 0xff0022, transparent: true, opacity: 0.8 }));
    bulb.position.set(2, 0, 2);
    floraGroup.add(bulb);
    animateFlora.push({ mesh: bulb, type: 'breathe' });

    group.add(floraGroup);

    parts.push({
        name: "Class-7 Bioluminescent Flora Specimens",
        description: "Genetically stabilized extraterrestrial flora requiring highly specific light wavelengths and atmospheric gas ratios to survive.",
        material: "Organic Matter / Bioluminescent Cells",
        function: "Biological subject of study and exotic enzyme production",
        assemblyOrder: 6,
        connections: ["Synthetic Exoplanetary Soil Matrix", "UV Spectrum Grow Rings"],
        failureEffect: "Complete specimen expiration",
        cascadeFailures: [],
        originalPosition: { x: 0, y: -3, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 15 }
    });

    // 5. UV Grow Lights
    const lightGroup = new THREE.Group();
    const rings = [];
    for(let i=0; i<3; i++) {
        const ringGeom = new THREE.TorusGeometry(4.5 - i*0.5, 0.15, 16, 64);
        const ring = new THREE.Mesh(ringGeom, uvLightMat);
        ring.position.y = 2 + i*2;
        ring.rotation.x = Math.PI / 2;
        
        // Add structural spokes to rings
        for(let j=0; j<4; j++) {
            const spokeGeom = new THREE.CylinderGeometry(0.05, 0.05, 4.5 - i*0.5, 8);
            const spoke = new THREE.Mesh(spokeGeom, steel);
            spoke.rotation.z = Math.PI / 2;
            spoke.rotation.y = (j/4) * Math.PI;
            ring.add(spoke);
        }

        lightGroup.add(ring);
        rings.push(ring);
    }
    group.add(lightGroup);

    parts.push({
        name: "Tri-Band UV Spectrum Grow Rings",
        description: "Three highly energized, rotating rings emitting precise wavelengths of ultraviolet and ionizing radiation to simulate alien star-light.",
        material: "Superconductive Alloy & Neon Emissive Tubing",
        function: "Photosynthetic stimulation and radiometric shielding",
        assemblyOrder: 7,
        connections: ["Hyper-Baric Borosilicate Containment Vessel"],
        failureEffect: "Rapid necrosis of flora due to light-starvation",
        cascadeFailures: ["Class-7 Bioluminescent Flora Specimens"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 0 }
    });

    // 6. Atmospheric Control Pipes
    const pipeGroup = new THREE.Group();
    
    // Main feed pipe
    const path1 = [[7, -1, 0], [7, 8, 0], [0, 8, 0], [0, 6, 0]];
    const pipe1 = createFlangedPipe(path1, 0.4, 64, 16, copper);
    pipeGroup.add(pipe1);

    // Return pipe
    const path2 = [[-7, -1, 0], [-7, 5, 0], [-6.1, 5, 0]];
    const pipe2 = createFlangedPipe(path2, 0.5, 64, 16, aluminum);
    pipeGroup.add(pipe2);
    
    // Complex winding pipes around base
    for(let i=0; i<4; i++) {
        const angle = (i/4)*Math.PI*2;
        const x1 = Math.cos(angle)*7.5;
        const z1 = Math.sin(angle)*7.5;
        const x2 = Math.cos(angle + 0.5)*6.1;
        const z2 = Math.sin(angle + 0.5)*6.1;
        
        const path = [
            [x1, -2, z1],
            [x1, 0, z1],
            [x2, 2, z2],
            [x2, -3, z2]
        ];
        const winding = createFlangedPipe(path, 0.2, 32, 12, steel);
        pipeGroup.add(winding);
    }
    group.add(pipeGroup);

    parts.push({
        name: "Atmospheric Recirculation and Scrubbing Conduit",
        description: "An intricate network of copper and aluminum pipes that meticulously filter, heat, and inject exotic gas mixtures into the chamber.",
        material: "Copper, Aluminum, Steel",
        function: "Gas exchange, temperature regulation, and exhaust",
        assemblyOrder: 8,
        connections: ["Fluid & Gas Reservoirs", "Hyper-Baric Borosilicate Containment Vessel"],
        failureEffect: "Toxic gas buildup and chamber overpressurization",
        cascadeFailures: ["Hyper-Baric Borosilicate Containment Vessel"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 20, y: 0, z: 0 }
    });

    // 7. Hydraulic Containment Locks
    const hydraulicGroup = new THREE.Group();
    const pistons = [];
    for(let i=0; i<4; i++) {
        const angle = (i/4)*Math.PI*2 + Math.PI/4;
        const x = Math.cos(angle)*7;
        const z = Math.sin(angle)*7;

        const hydr = new THREE.Group();
        hydr.position.set(x, -2, z);

        const base = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), darkSteel);
        base.position.y = 1;
        hydr.add(base);

        const outerCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 6, 32), chrome);
        outerCyl.position.y = 5;
        hydr.add(outerCyl);

        const innerCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 6, 32), steel);
        innerCyl.position.y = 8;
        hydr.add(innerCyl);
        pistons.push(innerCyl);

        // Attachment joint to dome
        const joint = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32), darkSteel);
        joint.position.y = 11;
        hydr.add(joint);

        const link = new THREE.Mesh(new THREE.BoxGeometry(3, 0.5, 0.5), steel);
        link.position.set(-Math.cos(angle)*1.5, 11, -Math.sin(angle)*1.5);
        link.rotation.y = -angle;
        hydr.add(link);

        hydraulicGroup.add(hydr);
    }
    group.add(hydraulicGroup);

    parts.push({
        name: "Quaternary Hydraulic Containment Locks",
        description: "Four massive, high-torque hydraulic pistons designed to securely clamp the dome shut against internal pressures exceeding 400 atmospheres.",
        material: "Chrome and Dark Steel",
        function: "Dome securing and emergency lockdown",
        assemblyOrder: 4,
        connections: ["Omni-directional Seismic Isolation Platform", "Hyper-Baric Borosilicate Containment Vessel"],
        failureEffect: "Lid separation leading to explosive decompression",
        cascadeFailures: ["Hyper-Baric Borosilicate Containment Vessel"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -20, y: 0, z: -20 }
    });

    // 8. Control Desk and Interface
    const consoleGroup = new THREE.Group();
    consoleGroup.position.set(0, -1, 9);
    consoleGroup.rotation.x = -Math.PI / 12;

    const deskGeom = new THREE.BoxGeometry(6, 1.5, 3);
    const desk = new THREE.Mesh(deskGeom, steel);
    consoleGroup.add(desk);

    // Screens
    const screen1 = new THREE.Mesh(new THREE.PlaneGeometry(2, 1.2), screenMat);
    screen1.position.set(-1.2, 0.8, -0.5);
    screen1.rotation.x = -Math.PI/6;
    consoleGroup.add(screen1);

    const screen2 = new THREE.Mesh(new THREE.PlaneGeometry(2, 1.2), screenMat);
    screen2.position.set(1.2, 0.8, -0.5);
    screen2.rotation.x = -Math.PI/6;
    consoleGroup.add(screen2);

    // Glowing Buttons
    for(let i=0; i<20; i++) {
        const btnMat = new THREE.MeshStandardMaterial({ color: Math.random()>0.5 ? 0xff0000 : 0x00ff00, emissive: Math.random()>0.5 ? 0xaa0000 : 0x00aa00 });
        const btn = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.1, 0.2), btnMat);
        btn.position.set((Math.random()-0.5)*5, 0.8, (Math.random()-0.5)*1.5 + 0.5);
        consoleGroup.add(btn);
    }

    // Keyboard / Dial
    const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.2, 16), aluminum);
    dial.position.set(0, 0.8, 1);
    consoleGroup.add(dial);

    group.add(consoleGroup);

    parts.push({
        name: "Holographic Telemetry & Operations Console",
        description: "The primary user interface for Astrobiologists, featuring dual multi-spectral diagnostic screens and haptic feedback dials.",
        material: "Steel, Glass, Emissive Displays",
        function: "Manual override and sensor monitoring",
        assemblyOrder: 12,
        connections: ["Omni-directional Seismic Isolation Platform", "Environmental Sensor Array"],
        failureEffect: "Loss of manual control and blind operation",
        cascadeFailures: [],
        originalPosition: { x: 0, y: -1, z: 9 },
        explodedPosition: { x: 0, y: 5, z: 25 }
    });

    // 9. Fluid Reservoirs
    const reservoirGroup = new THREE.Group();
    reservoirGroup.position.set(-8, 2, 0);
    const fluids = [];

    const tankMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.2, metalness: 0.8, transparent: true, opacity: 0.4 });
    
    for(let i=0; i<2; i++) {
        const tank = new THREE.Group();
        tank.position.z = (i - 0.5) * 4;
        
        const shell = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 8, 32), tankMat);
        tank.add(shell);

        const caps = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.5, 32), darkSteel);
        caps.position.y = 4;
        tank.add(caps);
        const capsBottom = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.5, 32), darkSteel);
        capsBottom.position.y = -4;
        tank.add(capsBottom);

        const fluid = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 7.5, 32), i===0 ? glowingBlueFluid : glowingRedFluid);
        tank.add(fluid);
        fluids.push(fluid);

        reservoirGroup.add(tank);
    }
    group.add(reservoirGroup);

    parts.push({
        name: "Dual-Isotope Nutrient and Solvent Reservoirs",
        description: "Twin armored glass tanks holding ultra-dense liquid nutrients and atmospheric solvents essential for alien flora metabolism.",
        material: "Reinforced Glass, Dark Steel, Reactive Fluids",
        function: "Storage and conditioning of biological fuel",
        assemblyOrder: 9,
        connections: ["Atmospheric Recirculation and Scrubbing Conduit", "Nutrient Injector Array"],
        failureEffect: "Nutrient starvation and chemical imbalance",
        cascadeFailures: ["Class-7 Bioluminescent Flora Specimens"],
        originalPosition: { x: -8, y: 2, z: 0 },
        explodedPosition: { x: -25, y: 2, z: 0 }
    });

    // 10. High-Pressure Pumps & Valves
    const pumpGroup = new THREE.Group();
    pumpGroup.position.set(-8, -3, 0);

    const pumpMain = new THREE.Mesh(new THREE.SphereGeometry(2, 32, 32), copper);
    pumpGroup.add(pumpMain);

    for(let i=0; i<6; i++) {
        const valve = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.2, 16, 32), steel);
        valve.rotation.x = Math.PI / 2;
        valve.position.set(Math.cos(i)*2.2, 0, Math.sin(i)*2.2);
        pumpGroup.add(valve);
    }
    
    group.add(pumpGroup);

    parts.push({
        name: "Centrifugal Multi-Stage Injection Pumps",
        description: "Copper-clad industrial pumps capable of overcoming the extreme internal pressure of the incubator to inject fluids.",
        material: "Copper and Steel",
        function: "Pressurized fluid transfer",
        assemblyOrder: 10,
        connections: ["Dual-Isotope Nutrient and Solvent Reservoirs", "Atmospheric Recirculation and Scrubbing Conduit"],
        failureEffect: "Inability to inject nutrients",
        cascadeFailures: ["Class-7 Bioluminescent Flora Specimens"],
        originalPosition: { x: -8, y: -3, z: 0 },
        explodedPosition: { x: -25, y: -10, z: 0 }
    });

    // 11. Environmental Sensor Array (Antennas & Radar)
    const sensorGroup = new THREE.Group();
    sensorGroup.position.set(0, 12, 0);
    
    const dishGeom = new THREE.LatheGeometry([
        new THREE.Vector2(0, 0),
        new THREE.Vector2(1, 0.2),
        new THREE.Vector2(2, 0.8),
        new THREE.Vector2(3, 1.5)
    ], 32);
    const dish = new THREE.Mesh(dishGeom, aluminum);
    dish.position.y = 1;
    dish.rotation.x = -Math.PI / 6;
    sensorGroup.add(dish);
    const animateDish = dish;

    const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 4, 8), darkSteel);
    antenna.position.set(1.5, 2, -1.5);
    sensorGroup.add(antenna);

    group.add(sensorGroup);

    parts.push({
        name: "Spectroscopic & Gravimetric Sensor Array",
        description: "Rotating dish and phased antennas to constantly monitor the micro-gravitational and radiologic environment inside and outside the dome.",
        material: "Aluminum and Dark Steel",
        function: "Environmental monitoring and data transmission",
        assemblyOrder: 15,
        connections: ["Top Dome Cap", "Holographic Telemetry & Operations Console"],
        failureEffect: "Loss of automated regulation routines",
        cascadeFailures: ["Tri-Band UV Spectrum Grow Rings"],
        originalPosition: { x: 0, y: 12, z: 0 },
        explodedPosition: { x: 0, y: 30, z: 0 }
    });

    // 12. Heavy Structural Support Frame
    const frameGroup = new THREE.Group();
    const strutGeom = new THREE.BoxGeometry(0.8, 14, 0.8);
    for(let i=0; i<6; i++) {
        const angle = (i/6)*Math.PI*2;
        const strut = new THREE.Mesh(strutGeom, darkSteel);
        strut.position.set(Math.cos(angle)*8.5, 4, Math.sin(angle)*8.5);
        strut.rotation.x = Math.PI/12 * Math.cos(angle);
        strut.rotation.z = Math.PI/12 * Math.sin(angle);
        frameGroup.add(strut);

        // Cross braces
        const brace = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 9, 16), steel);
        brace.position.set(Math.cos(angle+Math.PI/6)*8, 4, Math.sin(angle+Math.PI/6)*8);
        brace.rotation.y = -(angle + Math.PI/6);
        brace.rotation.z = Math.PI / 2;
        frameGroup.add(brace);
    }
    group.add(frameGroup);

    parts.push({
        name: "Titanium Exoskeletal Reinforcement Frame",
        description: "Massive dark steel struts and cross-braces providing rigid external support to prevent catastrophic outward explosion of the dome.",
        material: "Titanium / Dark Steel",
        function: "Structural integrity enforcement",
        assemblyOrder: 3,
        connections: ["Omni-directional Seismic Isolation Platform"],
        failureEffect: "Vibrational stress tearing the glass dome",
        cascadeFailures: ["Hyper-Baric Borosilicate Containment Vessel"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 } // Exoskeleton explodes outward via children typically, handled generically
    });

    // 13. Access Hatch (Airlock)
    const hatchGroup = new THREE.Group();
    hatchGroup.position.set(0, 0, -6.1);
    
    const doorRing = new THREE.Mesh(new THREE.TorusGeometry(2.5, 0.4, 32, 64), steel);
    hatchGroup.add(doorRing);

    const door = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 0.5, 64), darkSteel);
    door.rotation.x = Math.PI / 2;
    hatchGroup.add(door);

    // Locking wheel
    const wheel = new THREE.Mesh(new THREE.TorusGeometry(1, 0.2, 16, 32), chrome);
    wheel.position.z = -0.4;
    hatchGroup.add(wheel);
    const animateWheel = wheel;

    // Rivets
    for(let i=0; i<12; i++) {
        const rivet = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), chrome);
        const a = (i/12)*Math.PI*2;
        rivet.position.set(Math.cos(a)*2.1, Math.sin(a)*2.1, -0.3);
        hatchGroup.add(rivet);
    }

    group.add(hatchGroup);

    parts.push({
        name: "Decontamination Airlock Hatch",
        description: "A heavy, multi-lock bulkhead providing physical access to the chamber interior for robotic or bio-suited maintenance.",
        material: "Dark Steel and Chrome",
        function: "Physical access and pressure sealing",
        assemblyOrder: 11,
        connections: ["Hyper-Baric Borosilicate Containment Vessel"],
        failureEffect: "Leakage of toxic alien spores into the lab",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: -6.1 },
        explodedPosition: { x: 0, y: 0, z: -20 }
    });

    // 14. Nutrient Injector Array
    const injectorGroup = new THREE.Group();
    injectorGroup.position.set(0, -3.5, 0);

    for(let i=0; i<8; i++) {
        const angle = (i/8)*Math.PI*2;
        const r = 4;
        const inj = new THREE.Group();
        inj.position.set(Math.cos(angle)*r, 0, Math.sin(angle)*r);
        
        const needle = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.02, 2, 16), chrome);
        needle.position.y = 1;
        inj.add(needle);

        const hub = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.6), steel);
        inj.add(hub);

        injectorGroup.add(inj);
    }
    group.add(injectorGroup);

    parts.push({
        name: "Sub-soil Micro-Nutrient Injector Array",
        description: "Precision chrome needles penetrating the regolith to deliver targeted doses of synthesized alien nutrients directly to the root systems.",
        material: "Chrome and Steel",
        function: "Direct root nutrient delivery",
        assemblyOrder: 13,
        connections: ["Synthetic Exoplanetary Soil Matrix", "Centrifugal Multi-Stage Injection Pumps"],
        failureEffect: "Root rot or localized starvation",
        cascadeFailures: [],
        originalPosition: { x: 0, y: -3.5, z: 0 },
        explodedPosition: { x: 0, y: -12, z: 0 }
    });

    // 15. Active Cooling Fins
    const coolingGroup = new THREE.Group();
    for(let i=0; i<24; i++) {
        const finGeom = new THREE.BoxGeometry(1.5, 8, 0.1);
        const fin = new THREE.Mesh(finGeom, aluminum);
        const angle = (i/24)*Math.PI*2;
        fin.position.set(Math.cos(angle)*6.8, 3, Math.sin(angle)*6.8);
        fin.rotation.y = -angle;
        coolingGroup.add(fin);
    }
    group.add(coolingGroup);

    parts.push({
        name: "Cryogenic Thermal Radiator Fins",
        description: "An array of densely packed aluminum fins dissipating the immense heat generated by the UV rings and high-pressure pumps.",
        material: "Aluminum",
        function: "Thermal regulation and heat dissipation",
        assemblyOrder: 14,
        connections: ["Hyper-Baric Borosilicate Containment Vessel"],
        failureEffect: "Internal temperature spike and spontaneous combustion of flora",
        cascadeFailures: ["Hyper-Baric Borosilicate Containment Vessel", "Tri-Band UV Spectrum Grow Rings"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 20, z: 0 }
    });

    // 16. Plasma Exhaust Vents
    const exhaustGroup = new THREE.Group();
    exhaustGroup.position.set(8, -1, 0);

    const ventGeom = new THREE.CylinderGeometry(1.5, 2, 3, 32);
    const vent = new THREE.Mesh(ventGeom, darkSteel);
    vent.rotation.z = -Math.PI / 2;
    exhaustGroup.add(vent);

    const grilleGeom = new THREE.TorusGeometry(1.2, 0.1, 8, 16);
    for(let i=0; i<4; i++) {
        const grille = new THREE.Mesh(grilleGeom, steel);
        grille.rotation.y = Math.PI / 2;
        grille.position.x = 1.6 + i*0.2;
        exhaustGroup.add(grille);
    }
    group.add(exhaustGroup);

    parts.push({
        name: "Emergency Plasma Over-pressure Exhaust",
        description: "A heavily shielded directional vent meant to safely expel excess atmospheric pressure or plasma buildup in case of catastrophic failure.",
        material: "Dark Steel and Thermal shielding",
        function: "Emergency pressure relief",
        assemblyOrder: 16,
        connections: ["Omni-directional Seismic Isolation Platform", "Atmospheric Recirculation and Scrubbing Conduit"],
        failureEffect: "Explosion of the entire incubator facility",
        cascadeFailures: ["Titanium Exoskeletal Reinforcement Frame", "Hyper-Baric Borosilicate Containment Vessel"],
        originalPosition: { x: 8, y: -1, z: 0 },
        explodedPosition: { x: 25, y: -1, z: 0 }
    });

    const quizQuestions = [
        {
            question: "Which component prevents catastrophic outward explosion of the glass dome?",
            options: ["Cryogenic Thermal Radiator Fins", "Titanium Exoskeletal Reinforcement Frame", "Omni-directional Seismic Isolation Platform", "Centrifugal Multi-Stage Injection Pumps"],
            correct: 1,
            explanation: "The Titanium Exoskeletal Reinforcement Frame provides rigid external support to counteract the massive internal pressures."
        },
        {
            question: "What is the primary function of the Tri-Band UV Spectrum Grow Rings?",
            options: ["To heat the soil matrix", "To sterilize the chamber", "To provide precise wavelengths for alien photosynthetic stimulation", "To power the holographic console"],
            correct: 2,
            explanation: "They emit precise wavelengths of ultraviolet and ionizing radiation to simulate alien star-light for the flora."
        },
        {
            question: "If the Centrifugal Multi-Stage Injection Pumps fail, what immediate cascade failure occurs?",
            options: ["Dome shattering", "Class-7 Bioluminescent Flora Specimens starve", "Telemetry console goes dark", "Cooling fins melt"],
            correct: 1,
            explanation: "Without the pumps, nutrients and solvents from the reservoirs cannot be injected, leading to flora starvation."
        },
        {
            question: "How is extreme heat generated by the UV rings dissipated?",
            options: ["Through the Plasma Exhaust Vents", "By the Cryogenic Thermal Radiator Fins", "Absorbed by the Soil Matrix", "Vented through the Decontamination Hatch"],
            correct: 1,
            explanation: "The Cryogenic Thermal Radiator Fins are specifically designed to dissipate the immense heat generated by the internal systems."
        },
        {
            question: "What secures the dome lid tightly against pressures exceeding 400 atmospheres?",
            options: ["The Access Hatch Rivets", "Quaternary Hydraulic Containment Locks", "The Exoskeletal Cross-braces", "The Omni-directional base plate"],
            correct: 1,
            explanation: "Four massive high-torque hydraulic pistons (Locks) clamp the dome shut to maintain the hermetic seal."
        }
    ];

    function animate(time, speed, meshes) {
        // Rotate UV rings in alternating directions
        rings.forEach((ring, index) => {
            const dir = index % 2 === 0 ? 1 : -1;
            ring.rotation.z += 0.02 * speed * dir;
        });

        // Flora animations
        animateFlora.forEach(item => {
            if (item.type === 'rotate') {
                item.mesh.rotation.y += 0.01 * speed;
                item.mesh.rotation.x = Math.sin(time * 0.001 * speed) * 0.1;
            } else if (item.type === 'pulse') {
                // Pulse emissive intensity
                const pulse = (Math.sin(time * 0.003 * speed + item.phase) + 1) / 2;
                item.mesh.material.emissiveIntensity = 2.0 + pulse * 4.0;
                item.mesh.scale.setScalar(1 + pulse * 0.1);
            } else if (item.type === 'breathe') {
                const breath = Math.sin(time * 0.002 * speed);
                item.mesh.scale.set(1 + breath*0.05, 1 + breath*0.1, 1 + breath*0.05);
                item.mesh.material.emissiveIntensity = 1.0 + Math.max(0, breath) * 3.0;
            }
        });

        // Fluid levels oscillating
        fluids.forEach((fluid, index) => {
            const offset = index * Math.PI;
            const level = (Math.sin(time * 0.001 * speed + offset) + 1) / 2; // 0 to 1
            fluid.scale.y = 0.8 + level * 0.2;
            fluid.position.y = (fluid.scale.y - 1.0) * 3.75; 
        });

        // Rotate Sensor Dish
        animateDish.rotation.y += 0.03 * speed;
        animateDish.rotation.x = -Math.PI / 6 + Math.sin(time * 0.002 * speed) * 0.2;

        // Turn airlock wheel slowly
        animateWheel.rotation.z -= 0.01 * speed;

        // Vibrate pump
        pumpGroup.position.x = -8 + Math.sin(time * 0.05 * speed) * 0.02;
        pumpGroup.position.z = Math.cos(time * 0.07 * speed) * 0.02;

        // Inner containment field texture shift (simulated via opacity/scale oscillation)
        containmentField.material.opacity = 0.1 + Math.random() * 0.05 * speed;
        containmentField.scale.setScalar(1 + Math.sin(time * 0.01 * speed)*0.002);
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createExoplanetIncubator() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
