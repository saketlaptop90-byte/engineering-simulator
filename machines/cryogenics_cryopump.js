import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom Materials
    const frostMaterial = new THREE.MeshStandardMaterial({
        color: 0xe0ffff,
        roughness: 0.8,
        metalness: 0.1,
        transparent: true,
        opacity: 0.8,
        name: 'Frost'
    });
    
    const glowingBlue = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 0.8,
        roughness: 0.2,
        metalness: 0.8,
        name: 'GlowingBlue'
    });
    
    const glowingRed = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 0.5,
        roughness: 0.3,
        metalness: 0.6,
        name: 'GlowingRed'
    });

    // We will build the Cryopump bottom-to-top.
    
    // 1. Main Vacuum Vessel (Outer Housing)
    const vesselGroup = new THREE.Group();
    // Lathe geometry for complex flange and vessel shape
    const vesselPoints = [];
    vesselPoints.push(new THREE.Vector2(0, -5));
    vesselPoints.push(new THREE.Vector2(4.5, -5));
    vesselPoints.push(new THREE.Vector2(4.5, -4.5));
    vesselPoints.push(new THREE.Vector2(3.5, -4.5));
    vesselPoints.push(new THREE.Vector2(3.5, 4));
    vesselPoints.push(new THREE.Vector2(4.5, 4));
    vesselPoints.push(new THREE.Vector2(5, 4.2));
    vesselPoints.push(new THREE.Vector2(5, 4.8));
    vesselPoints.push(new THREE.Vector2(4.5, 5));
    vesselPoints.push(new THREE.Vector2(3.5, 5));
    vesselPoints.push(new THREE.Vector2(3.5, 6));
    vesselPoints.push(new THREE.Vector2(0, 6));
    
    const vesselGeo = new THREE.LatheGeometry(vesselPoints, 64);
    const vesselMesh = new THREE.Mesh(vesselGeo, darkSteel);
    vesselGroup.add(vesselMesh);

    // Flange bolts
    for(let i=0; i<24; i++) {
        const angle = (i / 24) * Math.PI * 2;
        const boltGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.5, 16);
        const boltMesh = new THREE.Mesh(boltGeo, chrome);
        boltMesh.position.set(Math.cos(angle) * 4.7, 4.5, Math.sin(angle) * 4.7);
        vesselGroup.add(boltMesh);
        
        const lowerBoltMesh = new THREE.Mesh(boltGeo, chrome);
        lowerBoltMesh.position.set(Math.cos(angle) * 4.2, -4.75, Math.sin(angle) * 4.2);
        vesselGroup.add(lowerBoltMesh);
    }
    
    group.add(vesselGroup);
    meshes.vessel = vesselGroup;

    parts.push({
        name: 'Vacuum Vessel',
        description: 'Outer stainless steel housing of the cryopump maintaining ultra-high vacuum environment.',
        material: 'darkSteel',
        function: 'Houses internal cryogenic components and provides structural integrity under extreme pressure differentials.',
        assemblyOrder: 1,
        connections: ['Mounting Flange', 'First Stage Array'],
        failureEffect: 'Vacuum leak, thermal load increase, cryopump regeneration failure.',
        cascadeFailures: ['Loss of cooling', 'Contamination of process chamber'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -10, z: 0}
    });

    // 2. Radiation Shield (80K Stage)
    const shieldGroup = new THREE.Group();
    const shieldGeo = new THREE.CylinderGeometry(3.3, 3.3, 8.5, 64, 1, true);
    const shieldMesh = new THREE.Mesh(shieldGeo, copper);
    shieldMesh.position.y = 0;
    shieldGroup.add(shieldMesh);
    
    const shieldBottomGeo = new THREE.CylinderGeometry(3.3, 3.3, 0.2, 64);
    const shieldBottom = new THREE.Mesh(shieldBottomGeo, copper);
    shieldBottom.position.y = -4.25;
    shieldGroup.add(shieldBottom);

    group.add(shieldGroup);
    meshes.radiationShield = shieldGroup;

    parts.push({
        name: 'Radiation Shield',
        description: 'Copper cylinder surrounding the second stage, cooled to ~80K.',
        material: 'copper',
        function: 'Absorbs radiant heat from the room-temperature vacuum vessel to protect the 15K second stage array.',
        assemblyOrder: 2,
        connections: ['Vacuum Vessel', 'First Stage Cold Head'],
        failureEffect: 'Excessive radiant heat load on second stage, failure to reach 15K.',
        cascadeFailures: ['Helium compressor overload', 'Pump rapid warming'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: -15}
    });

    // 3. Frontal Chevron Baffles (80K Stage Array)
    const baffleGroup = new THREE.Group();
    baffleGroup.position.y = 4.25;
    
    for(let i=0; i<12; i++) {
        // Create an angled chevron ring
        const radius = 3.2 - (i * 0.25);
        if (radius <= 0) break;
        const chevronGeo = new THREE.TorusGeometry(radius, 0.1, 8, 64);
        const chevronMesh = new THREE.Mesh(chevronGeo, copper);
        // Tilt the torus sections to act as optically opaque baffles
        chevronMesh.rotation.x = Math.PI / 4;
        chevronMesh.position.y = (i * 0.1);
        baffleGroup.add(chevronMesh);
    }
    
    // Add frost to baffles
    const baffleFrostGeo = new THREE.CylinderGeometry(3.2, 0.1, 1.2, 64);
    const baffleFrost = new THREE.Mesh(baffleFrostGeo, frostMaterial);
    baffleFrost.position.y = 0.5;
    baffleGroup.add(baffleFrost);

    group.add(baffleGroup);
    meshes.baffles = baffleGroup;

    parts.push({
        name: 'Chevron Baffles',
        description: 'Optically dense array at the inlet of the pump, cooled to ~80K.',
        material: 'copper/frost',
        function: 'Condenses water vapor and prevents room-temperature radiant heat from reaching the second stage array while allowing gas molecules to pass.',
        assemblyOrder: 3,
        connections: ['Radiation Shield', 'Cryopanels'],
        failureEffect: 'High water vapor partial pressure, thermal overload of second stage.',
        cascadeFailures: ['Loss of pumping speed', 'Pump stalling'],
        originalPosition: {x: 0, y: 4.25, z: 0},
        explodedPosition: {x: 0, y: 15, z: 0}
    });

    // 4. Second Stage Cryopanel Array (15K Stage)
    const cryoPanelGroup = new THREE.Group();
    // Inner structure arrays with charcoal adsorbent
    for(let i=0; i<5; i++) {
        const panelGeo = new THREE.CylinderGeometry(2.0, 2.0, 1.5, 32, 1, true);
        const panelMesh = new THREE.Mesh(panelGeo, steel);
        panelMesh.position.y = -2 + (i * 1.6);
        
        // Inner charcoal coating (using dark steel/rough)
        const charcoalGeo = new THREE.CylinderGeometry(1.95, 1.95, 1.5, 32, 1, true);
        const charcoalMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 1.0, metalness: 0.0 });
        const charcoalMesh = new THREE.Mesh(charcoalGeo, charcoalMat);
        charcoalMesh.position.copy(panelMesh.position);
        
        // Add frost layer to the panels
        const frostMesh = new THREE.Mesh(panelGeo.clone(), frostMaterial);
        frostMesh.scale.set(1.02, 1.02, 1.02);
        frostMesh.position.copy(panelMesh.position);

        cryoPanelGroup.add(panelMesh);
        cryoPanelGroup.add(charcoalMesh);
        cryoPanelGroup.add(frostMesh);
        
        // Support struts
        for(let j=0; j<4; j++) {
            const strutGeo = new THREE.BoxGeometry(0.2, 1.6, 0.2);
            const strutMesh = new THREE.Mesh(strutGeo, chrome);
            const angle = (j / 4) * Math.PI * 2;
            strutMesh.position.set(Math.cos(angle)*1.5, panelMesh.position.y, Math.sin(angle)*1.5);
            cryoPanelGroup.add(strutMesh);
        }
    }
    group.add(cryoPanelGroup);
    meshes.cryoPanels = cryoPanelGroup;

    parts.push({
        name: 'Second Stage Cryopanels',
        description: 'Inner array coated with activated charcoal, cooled to ~10-15K.',
        material: 'steel/charcoal/frost',
        function: 'Cryocondenses nitrogen, oxygen, and argon; cryosorbs helium, hydrogen, and neon via charcoal pores.',
        assemblyOrder: 4,
        connections: ['Second Stage Cold Head', 'Chevron Baffles'],
        failureEffect: 'Inability to pump non-condensable gases (H2, He).',
        cascadeFailures: ['Base pressure rises', 'Process chamber contamination'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 15, y: 0, z: 0}
    });

    // 5. Cold Head (Gifford-McMahon Refrigerator)
    const coldHeadGroup = new THREE.Group();
    // Cold head base
    const chBaseGeo = new THREE.BoxGeometry(3, 4, 3);
    const chBase = new THREE.Mesh(chBaseGeo, steel);
    chBase.position.set(0, -7, 0);
    coldHeadGroup.add(chBase);
    
    // First stage expansion cylinder
    const exp1Geo = new THREE.CylinderGeometry(1, 1, 3, 32);
    const exp1 = new THREE.Mesh(exp1Geo, chrome);
    exp1.position.set(0, -3.5, 0);
    coldHeadGroup.add(exp1);
    
    // Second stage expansion cylinder
    const exp2Geo = new THREE.CylinderGeometry(0.5, 0.5, 3, 32);
    const exp2 = new THREE.Mesh(exp2Geo, chrome);
    exp2.position.set(0, -0.5, 0);
    coldHeadGroup.add(exp2);
    
    // Thermal linkages
    const link1Geo = new THREE.CylinderGeometry(1.5, 1.5, 0.4, 32);
    const link1 = new THREE.Mesh(link1Geo, copper);
    link1.position.set(0, -2, 0);
    coldHeadGroup.add(link1);
    
    const link2Geo = new THREE.CylinderGeometry(0.8, 0.8, 0.4, 32);
    const link2 = new THREE.Mesh(link2Geo, copper);
    link2.position.set(0, 1, 0);
    coldHeadGroup.add(link2);

    group.add(coldHeadGroup);
    meshes.coldHead = coldHeadGroup;

    parts.push({
        name: 'GM Cold Head Refrigerator',
        description: 'Gifford-McMahon closed-cycle helium refrigerator unit.',
        material: 'steel/chrome',
        function: 'Provides two-stage cryogenic cooling using expansion of high-pressure helium gas to extract heat.',
        assemblyOrder: 5,
        connections: ['Helium Compressor Lines', 'Radiation Shield', 'Cryopanels'],
        failureEffect: 'Loss of cooling power, pump warmup.',
        cascadeFailures: ['Release of trapped gases', 'System overpressure'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -20, z: 0}
    });

    // 6. Compressor Lines (Helium Supply and Return)
    const linesGroup = new THREE.Group();
    
    const supplyCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(1.5, -7.5, 0),
        new THREE.Vector3(4, -8, 2),
        new THREE.Vector3(6, -10, 4),
        new THREE.Vector3(8, -12, 6)
    ]);
    const supplyGeo = new THREE.TubeGeometry(supplyCurve, 64, 0.3, 16, false);
    const supplyMesh = new THREE.Mesh(supplyGeo, rubber);
    linesGroup.add(supplyMesh);
    
    const returnCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(1.5, -6.5, 0),
        new THREE.Vector3(4, -7, -2),
        new THREE.Vector3(6, -9, -4),
        new THREE.Vector3(8, -11, -6)
    ]);
    const returnGeo = new THREE.TubeGeometry(returnCurve, 64, 0.4, 16, false);
    const returnMesh = new THREE.Mesh(returnGeo, rubber);
    linesGroup.add(returnMesh);

    // Hose couplings
    const coupling1 = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.8, 32), chrome);
    coupling1.position.set(1.5, -7.5, 0);
    coupling1.rotation.z = Math.PI / 2;
    linesGroup.add(coupling1);
    
    const coupling2 = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.8, 32), chrome);
    coupling2.position.set(1.5, -6.5, 0);
    coupling2.rotation.z = Math.PI / 2;
    linesGroup.add(coupling2);

    group.add(linesGroup);
    meshes.heliumLines = linesGroup;

    parts.push({
        name: 'Helium Compressor Lines',
        description: 'Flexible stainless steel hoses coated in rubber, carrying ultra-high purity helium gas.',
        material: 'rubber/chrome',
        function: 'Supplies high-pressure helium to the cold head and returns low-pressure helium to the external compressor.',
        assemblyOrder: 6,
        connections: ['GM Cold Head Refrigerator', 'External Compressor'],
        failureEffect: 'Loss of helium pressure, cold head stops operating.',
        cascadeFailures: ['Compressor shutdown', 'Pump warmup'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 20, y: -10, z: 10}
    });

    // 7. Valve Drive Motor and Displacer Mechanism
    const motorGroup = new THREE.Group();
    const motorBodyGeo = new THREE.CylinderGeometry(1.2, 1.2, 2.5, 32);
    const motorBody = new THREE.Mesh(motorBodyGeo, darkSteel);
    motorBody.position.set(-2.5, -7, 0);
    motorBody.rotation.z = Math.PI / 2;
    motorGroup.add(motorBody);
    
    const motorCap = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 0.5, 32), plastic);
    motorCap.position.set(-3.8, -7, 0);
    motorCap.rotation.z = Math.PI / 2;
    motorGroup.add(motorCap);

    const driveShaftGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.5, 16);
    const driveShaft = new THREE.Mesh(driveShaftGeo, chrome);
    driveShaft.position.set(-1.3, -7, 0);
    driveShaft.rotation.z = Math.PI / 2;
    motorGroup.add(driveShaft);

    // Glowing status ring on motor
    const statusRingGeo = new THREE.TorusGeometry(1.25, 0.1, 16, 64);
    const statusRing = new THREE.Mesh(statusRingGeo, glowingBlue);
    statusRing.position.set(-3.6, -7, 0);
    statusRing.rotation.y = Math.PI / 2;
    motorGroup.add(statusRing);

    group.add(motorGroup);
    meshes.motor = motorGroup;
    meshes.statusRing = statusRing;

    parts.push({
        name: 'Rotary Valve Motor',
        description: 'Synchronous electric motor operating the rotary valve.',
        material: 'darkSteel/plastic',
        function: 'Spins the rotary valve to alternate high and low helium pressure, driving the displacer pistons in the cold head.',
        assemblyOrder: 7,
        connections: ['GM Cold Head Refrigerator', 'Power Supply'],
        failureEffect: 'Displacers stall, cooling cycle stops immediately.',
        cascadeFailures: ['Rapid warmup', 'Pressure spike'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -15, y: -7, z: 0}
    });

    // 8. Silicon Diode Temperature Sensors
    const sensorGroup = new THREE.Group();
    const s1Box = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), plastic);
    s1Box.position.set(0, -2, 1.6);
    sensorGroup.add(s1Box);
    
    const wire1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 6, 16), copper);
    wire1.position.set(0, -5, 1.6);
    sensorGroup.add(wire1);
    
    const s2Box = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), plastic);
    s2Box.position.set(0, 1, 0.9);
    sensorGroup.add(s2Box);
    
    const wire2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 9, 16), copper);
    wire2.position.set(0, -3.5, 0.9);
    sensorGroup.add(wire2);

    group.add(sensorGroup);
    meshes.sensors = sensorGroup;

    parts.push({
        name: 'Cryogenic Temperature Sensors',
        description: 'Silicon diode sensors mounted on the first and second stages.',
        material: 'plastic/copper',
        function: 'Monitors the exact temperature of the 80K and 15K stages to ensure optimal pumping speed and detect regeneration needs.',
        assemblyOrder: 8,
        connections: ['Cold Head stages', 'Instrumentation Feedthrough'],
        failureEffect: 'Loss of temperature telemetry.',
        cascadeFailures: ['Inability to automate regeneration cycle'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: 10}
    });

    // 9. Regeneration Heater Array
    const heaterGroup = new THREE.Group();
    for(let i=0; i<4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        const heaterGeo = new THREE.CylinderGeometry(0.1, 0.1, 2.5, 16);
        const heaterMesh = new THREE.Mesh(heaterGeo, copper);
        heaterMesh.position.set(Math.cos(angle)*1.2, -0.5, Math.sin(angle)*1.2);
        
        const heaterGlowGeo = new THREE.CylinderGeometry(0.15, 0.15, 2.3, 16);
        const heaterGlow = new THREE.Mesh(heaterGlowGeo, glowingRed);
        heaterGlow.position.copy(heaterMesh.position);
        heaterGlow.visible = false; // Turned off normally
        
        heaterGroup.add(heaterMesh);
        heaterGroup.add(heaterGlow);
        
        if(!meshes.heaterGlows) meshes.heaterGlows = [];
        meshes.heaterGlows.push(heaterGlow);
    }
    group.add(heaterGroup);
    meshes.heaters = heaterGroup;

    parts.push({
        name: 'Regeneration Heaters',
        description: 'Resistive heating elements embedded in the cold stages.',
        material: 'copper',
        function: 'Rapidly warms the pump during the regeneration cycle to sublimate captured gases and clean the cryopanels.',
        assemblyOrder: 9,
        connections: ['Cold Head stages', 'Heater Control Unit'],
        failureEffect: 'Inability to actively regenerate the pump, relying solely on natural warmup.',
        cascadeFailures: ['Extended downtime during maintenance'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -10, y: 0, z: 10}
    });

    // 10. Purge Gas Manifold
    const purgeGroup = new THREE.Group();
    const manifoldGeo = new THREE.BoxGeometry(0.8, 2, 0.8);
    const manifoldMesh = new THREE.Mesh(manifoldGeo, steel);
    manifoldMesh.position.set(3, -6, -2);
    purgeGroup.add(manifoldMesh);
    
    const purgeValveGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.5, 16);
    const purgeValve = new THREE.Mesh(purgeValveGeo, chrome);
    purgeValve.position.set(3, -5, -2);
    purgeGroup.add(purgeValve);
    
    const purgeTube = new THREE.Mesh(new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
            new THREE.Vector3(3, -4.75, -2),
            new THREE.Vector3(2.5, -3, -1),
            new THREE.Vector3(0, -2, 0)
        ]), 32, 0.1, 8, false
    ), copper);
    purgeGroup.add(purgeTube);
    
    group.add(purgeGroup);
    meshes.purge = purgeGroup;

    parts.push({
        name: 'Heated N2 Purge Manifold',
        description: 'Gas inlet system for introducing heated dry nitrogen.',
        material: 'steel/copper',
        function: 'Speeds up regeneration by diluting hazardous gases (like H2) and transferring heat to the cryopanels via convection.',
        assemblyOrder: 10,
        connections: ['Vacuum Vessel', 'Facility N2 Supply'],
        failureEffect: 'Slower regeneration, higher risk of combustible gas buildup.',
        cascadeFailures: ['Potential explosion hazard if pumping H2/O2 mixtures'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 10, y: -6, z: -10}
    });

    // 11. Overpressure Relief Valve
    const reliefGroup = new THREE.Group();
    const rvBody = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 1.2, 32), chrome);
    rvBody.position.set(-3, -4, 2);
    rvBody.rotation.x = Math.PI / 2;
    reliefGroup.add(rvBody);
    
    const rvCap = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.3, 32), plastic);
    rvCap.position.set(-3, -4, 2.7);
    rvCap.rotation.x = Math.PI / 2;
    reliefGroup.add(rvCap);
    
    const springGeo = new THREE.TorusGeometry(0.4, 0.05, 16, 64);
    const springMesh = new THREE.Mesh(springGeo, darkSteel);
    springMesh.position.set(-3, -4, 2.3);
    reliefGroup.add(springMesh);
    
    group.add(reliefGroup);
    meshes.reliefValve = reliefGroup;

    parts.push({
        name: 'Overpressure Relief Valve',
        description: 'Spring-loaded mechanical safety valve.',
        material: 'chrome/plastic',
        function: 'Vents expanded gases during warmup/regeneration to prevent the vacuum vessel from pressurizing above 1 atm and exploding.',
        assemblyOrder: 11,
        connections: ['Vacuum Vessel', 'Exhaust Line'],
        failureEffect: 'Catastrophic rupture of the vacuum vessel during regeneration.',
        cascadeFailures: ['Total system destruction', 'Safety hazard'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -10, y: -4, z: 15}
    });

    // 12. Roughing Valve Port
    const roughingGroup = new THREE.Group();
    const roughPipe = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 1.5, 32), steel);
    roughPipe.position.set(0, -6, 3);
    roughPipe.rotation.x = Math.PI / 2;
    roughingGroup.add(roughPipe);
    
    const roughFlange = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.2, 32), chrome);
    roughFlange.position.set(0, -6, 3.8);
    roughFlange.rotation.x = Math.PI / 2;
    roughingGroup.add(roughFlange);
    
    group.add(roughingGroup);
    meshes.roughingPort = roughingGroup;

    parts.push({
        name: 'Roughing Vacuum Port',
        description: 'KF or ISO flanged port connected to a mechanical roughing pump.',
        material: 'steel/chrome',
        function: 'Used to pump the housing down to ~10^-2 Torr before the cold head is turned on, as cryopumps cannot start at atmospheric pressure.',
        assemblyOrder: 12,
        connections: ['Vacuum Vessel', 'Roughing Pump Line'],
        failureEffect: 'Inability to achieve starting crossover pressure.',
        cascadeFailures: ['Cryopump cannot be engaged'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -6, z: 20}
    });

    // 13. Instrumentation Feedthrough
    const feedGroup = new THREE.Group();
    const feedBody = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1, 32), steel);
    feedBody.position.set(2.5, -4, 2.5);
    feedBody.rotation.x = Math.PI / 4;
    feedBody.rotation.z = -Math.PI / 4;
    feedGroup.add(feedBody);
    
    for(let i=0; i<6; i++) {
        const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.5, 16), copper);
        const angle = (i / 6) * Math.PI * 2;
        pin.position.set(
            2.5 + Math.cos(angle)*0.2,
            -4 + Math.sin(angle)*0.2,
            2.5
        );
        pin.rotation.copy(feedBody.rotation);
        feedGroup.add(pin);
    }
    group.add(feedGroup);
    meshes.feedthrough = feedGroup;

    parts.push({
        name: 'Electrical Feedthrough',
        description: 'Ceramic-to-metal sealed electrical connector.',
        material: 'steel/copper/glass',
        function: 'Passes electrical signals for temperature sensors and power for heaters through the vacuum wall without leaking.',
        assemblyOrder: 13,
        connections: ['Vacuum Vessel', 'Internal Sensors', 'Heaters'],
        failureEffect: 'Loss of vacuum integrity, electrical short.',
        cascadeFailures: ['Loss of sensor data', 'System shutdown'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 10, y: -4, z: 10}
    });

    // 14. Gate Valve Interface
    const gateGroup = new THREE.Group();
    const gateBody = new THREE.Mesh(new THREE.BoxGeometry(6, 1.5, 6), darkSteel);
    gateBody.position.set(0, 6.75, 0);
    gateGroup.add(gateBody);
    
    const gateActuator = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 4, 32), chrome);
    gateActuator.position.set(4, 6.75, 0);
    gateActuator.rotation.z = Math.PI / 2;
    gateGroup.add(gateActuator);
    
    const actuatorAirLine = new THREE.Mesh(new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
            new THREE.Vector3(6, 6.75, 0),
            new THREE.Vector3(7, 5, 0),
            new THREE.Vector3(7, 0, 0)
        ]), 16, 0.1, 8, false
    ), rubber);
    gateGroup.add(actuatorAirLine);
    
    group.add(gateGroup);
    meshes.gateValve = gateGroup;

    parts.push({
        name: 'Pneumatic Isolation Gate Valve',
        description: 'Massive high-vacuum valve sitting atop the pump.',
        material: 'darkSteel/chrome',
        function: 'Isolates the cryopump from the main process chamber during regeneration or maintenance, maintaining chamber vacuum.',
        assemblyOrder: 14,
        connections: ['Vacuum Vessel Flange', 'Process Chamber'],
        failureEffect: 'Inability to isolate pump, forcing venting of the entire process chamber.',
        cascadeFailures: ['Massive downtime for chamber pump-down'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 20, z: 0}
    });

    // 15. Controller Display Unit (Mounted on Side)
    const displayGroup = new THREE.Group();
    const dispBox = new THREE.Mesh(new THREE.BoxGeometry(2, 2.5, 0.5), plastic);
    dispBox.position.set(-3.5, -1, 0);
    dispBox.rotation.y = -Math.PI / 2;
    displayGroup.add(dispBox);
    
    const screenGeo = new THREE.PlaneGeometry(1.6, 1.2);
    const screenMesh = new THREE.Mesh(screenGeo, glowingBlue);
    screenMesh.position.set(-3.76, -0.5, 0);
    screenMesh.rotation.y = -Math.PI / 2;
    displayGroup.add(screenMesh);
    meshes.screen = screenMesh;
    
    const btn1 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.2, 16), glowingRed);
    btn1.position.set(-3.76, -1.5, 0.5);
    btn1.rotation.z = Math.PI / 2;
    displayGroup.add(btn1);

    const btn2 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.2, 16), chrome);
    btn2.position.set(-3.76, -1.5, -0.5);
    btn2.rotation.z = Math.PI / 2;
    displayGroup.add(btn2);

    group.add(displayGroup);
    meshes.display = displayGroup;

    parts.push({
        name: 'Onboard Diagnostics Controller',
        description: 'Microprocessor unit with LCD display mounted to the pump body.',
        material: 'plastic/glass',
        function: 'Provides local readout of stage temperatures, regeneration status, and fault codes. Interfaces with facility PLC.',
        assemblyOrder: 15,
        connections: ['Feedthroughs', 'Motor', 'Facility Network'],
        failureEffect: 'Loss of local diagnostics and automated control routines.',
        cascadeFailures: ['Manual operation required', 'Potential for operator error during regen'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -15, y: -1, z: 0}
    });

    // 16. Fast Regeneration System (Hydraulic Actuators)
    const fastRegenGroup = new THREE.Group();
    const hydrBody = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 3, 32), steel);
    hydrBody.position.set(-2, -5, -2.5);
    hydrBody.rotation.x = Math.PI / 4;
    fastRegenGroup.add(hydrBody);

    const hydrPiston = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 3, 32), chrome);
    hydrPiston.position.set(-2, -3.5, -1);
    hydrPiston.rotation.x = Math.PI / 4;
    fastRegenGroup.add(hydrPiston);
    meshes.hydrPiston = hydrPiston; // For animation

    group.add(fastRegenGroup);
    meshes.fastRegen = fastRegenGroup;

    parts.push({
        name: 'Fast Regeneration Hydraulic Actuator',
        description: 'Hydraulic mechanical linkage for specialized rapid internal valve operation.',
        material: 'steel/chrome',
        function: 'Quickly redirects hot exhaust gases into the cold head for accelerated sublimation during emergency regens.',
        assemblyOrder: 16,
        connections: ['Cold Head', 'Purge Manifold'],
        failureEffect: 'Standard regeneration times apply (slower).',
        cascadeFailures: ['None'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -10, y: -5, z: -15}
    });


    // Description
    const description = "Ultra-High Vacuum Cryopump. Utilizes a Gifford-McMahon closed-cycle helium refrigerator to cool internal arrays to 15 Kelvin and 80 Kelvin. Gases are trapped via cryocondensation (freezing) and cryosorption (trapping in activated charcoal pores). Characterized by extreme pumping speeds for water vapor and complete absence of hydrocarbon contamination, making it essential for semiconductor manufacturing and space simulation chambers.";

    // Quiz Questions
    const quizQuestions = [
        {
            question: "Why does the second stage cryopanel feature an activated charcoal coating?",
            options: [
                "To visually distinguish it from the first stage.",
                "To absorb radiation from the room temperature vessel.",
                "To trap light non-condensable gases like Helium and Hydrogen via cryosorption.",
                "To act as a thermal insulator for the cold head."
            ],
            correctAnswer: 2,
            explanation: "Gases like Hydrogen, Helium, and Neon do not freeze at 15K under vacuum. They must be trapped inside the microscopic pores of the activated charcoal via cryosorption."
        },
        {
            question: "What is the primary function of the Chevron Baffles (80K Stage)?",
            options: [
                "To pump water vapor and block radiant heat from reaching the 15K stage.",
                "To compress helium gas before it enters the cold head.",
                "To physically filter out dust and particulates from the vacuum chamber.",
                "To act as a structural support for the inner arrays."
            ],
            correctAnswer: 0,
            explanation: "The 80K chevron baffles condense water vapor (which makes up most of the gas load) and are optically dense to block room-temperature thermal radiation from hitting the much colder 15K stage."
        },
        {
            question: "Why must a cryopump be 'regenerated' periodically?",
            options: [
                "The helium compressor runs out of gas.",
                "The mechanical bearings in the cold head wear out.",
                "The captured frozen gases build up, reducing pumping speed and creating a thermal bridge.",
                "The activated charcoal dissolves."
            ],
            correctAnswer: 2,
            explanation: "Cryopumps trap gases rather than exhausting them. Eventually, the ice buildup reduces efficiency and capacity, requiring the pump to be warmed up to release the trapped gases (regeneration)."
        },
        {
            question: "What happens if the Overpressure Relief Valve fails to open during a rapid warmup?",
            options: [
                "The pump becomes slightly less efficient.",
                "The trapped gases expand immensely as they transition from solid to gas, potentially causing the vacuum vessel to explode.",
                "The helium compressor will stall.",
                "The cryopanels will melt."
            ],
            correctAnswer: 1,
            explanation: "As frozen gases (especially Argon and Nitrogen) sublimate and warm to room temperature, their volume expands massively. If trapped, they will easily burst the steel vessel."
        },
        {
            question: "Why is a Roughing Pump required before starting the Cryopump?",
            options: [
                "To lubricate the cold head.",
                "Because cryopumps cannot begin pumping at atmospheric pressure due to massive thermal load.",
                "To provide back-pressure for the helium lines.",
                "To spin the rotary valve motor."
            ],
            correctAnswer: 1,
            explanation: "Cryopumps capture gas by freezing it. At atmospheric pressure, the heat load from the immense amount of gas molecules would completely overwhelm the cold head, preventing it from ever reaching cryogenic temperatures. The chamber must first be roughed down to a moderate vacuum."
        }
    ];

    // Animation Function
    function animate(time, speed, exploded) {
        // Rotary valve motor spin
        if(meshes.motor) {
            meshes.motor.children[2].rotation.x = time * speed * 5; // Drive shaft
        }

        // Pulse the glowing status ring and screen
        if(meshes.statusRing) {
            meshes.statusRing.material.emissiveIntensity = 0.5 + Math.sin(time * speed * 10) * 0.5;
        }
        if(meshes.screen) {
            // Flicker effect on screen
            meshes.screen.material.emissiveIntensity = 0.8 + Math.random() * 0.2;
        }

        // Helium supply and return lines subtly pulsing due to high pressure compressor strokes
        if(meshes.heliumLines) {
            meshes.heliumLines.children[0].scale.setScalar(1 + Math.sin(time * speed * 20) * 0.02); // Supply swells
            meshes.heliumLines.children[1].scale.setScalar(1 + Math.cos(time * speed * 20) * 0.01); // Return pulses slightly different
        }

        // If not exploded, simulate the internal GM cycle displacer movement (slight vibration/shift)
        if(!exploded && meshes.coldHead) {
            const vibration = Math.sin(time * speed * 50) * 0.01;
            meshes.coldHead.position.y = vibration;
        } else if (meshes.coldHead) {
            meshes.coldHead.position.y = 0; // reset
        }
        
        // Hydraulic piston animation (simulate fast regen actuator slowly pulsing)
        if(meshes.hydrPiston && !exploded) {
            meshes.hydrPiston.position.y = -3.5 + Math.sin(time * speed * 2) * 0.5;
        }
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
export function createCryopump() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
