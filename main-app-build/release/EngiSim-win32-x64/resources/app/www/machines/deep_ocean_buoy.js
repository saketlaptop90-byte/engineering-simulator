import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Glowing / High-Tech Materials
    const neonBlue = new THREE.MeshStandardMaterial({ color: 0x0011ff, emissive: 0x0044ff, emissiveIntensity: 1.5, roughness: 0.2, metalness: 0.8 });
    const neonRed = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 2.0, roughness: 0.1 });
    const neonGreen = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 1.5, roughness: 0.2 });
    const solarMaterial = new THREE.MeshStandardMaterial({ color: 0x0a1a3a, roughness: 0.1, metalness: 0.9, flatShading: true });
    const silverWireframe = new THREE.MeshStandardMaterial({ color: 0xcccccc, wireframe: true });

    const animatedObjects = {
        anemometerCups: [],
        warningBeacon: null,
        stabilizers: [],
        solarTracker: null,
        dataScreens: [],
        radarScanner: null
    };

    function addPart(name, mesh, description, materialName, func, assemblyOrder, connections, failureEffect, cascadeFailures, origPos, explPos) {
        mesh.name = name;
        group.add(mesh);
        parts.push({
            name,
            description,
            material: materialName,
            function: func,
            assemblyOrder,
            connections,
            failureEffect,
            cascadeFailures,
            originalPosition: origPos,
            explodedPosition: explPos
        });
    }

    // --- 1. Central Hull ---
    // A highly detailed, lathed central cylindrical structure containing primary electronics and ballast
    const hullPoints = [];
    for (let i = 0; i <= 40; i++) {
        const t = i / 40;
        let radius = 2.0;
        if (t < 0.2) radius = 1.0 + t * 5; // Tapering bottom
        else if (t > 0.8) radius = 2.0 - (t - 0.8) * 5; // Tapering top
        radius += Math.sin(t * Math.PI * 4) * 0.05; // Slight ribbing
        hullPoints.push(new THREE.Vector2(radius, t * 10 - 5));
    }
    const hullGeo = new THREE.LatheGeometry(hullPoints, 64);
    const centralHull = new THREE.Mesh(hullGeo, darkSteel);
    
    // Add intricate panel lines by adding thin toruses
    for (let i = -4.5; i < 4.5; i += 0.4) {
        const ringGeo = new THREE.TorusGeometry(2.1, 0.03, 16, 64);
        const ring = new THREE.Mesh(ringGeo, steel);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = i;
        centralHull.add(ring);
    }
    addPart('CentralHull', centralHull, 'Primary buoyant core housing mission-critical electronics and deep-cycle battery banks.', 'darkSteel', 'Provides primary structure and houses internal components.', 1, ['FloatationCollar', 'SensorMastBase', 'BallastWeight'], 'Catastrophic flooding and complete systems failure.', ['DataAcquisitionSystem', 'BatteryEnclosure'], {x:0, y:0, z:0}, {x:0, y:0, z:0});

    // --- 2. Floatation Collar ---
    // Massive torus with detailed gripping treads and reinforcement ribs
    const collarGroup = new THREE.Group();
    const collarGeo = new THREE.TorusGeometry(3.8, 1.4, 64, 128);
    const collarMesh = new THREE.Mesh(collarGeo, rubber);
    collarMesh.rotation.x = Math.PI / 2;
    collarGroup.add(collarMesh);
    
    // Add hundreds of small grip lugs/rivets
    const lugGeo = new THREE.BoxGeometry(0.4, 0.15, 0.4);
    for (let i = 0; i < 180; i++) {
        const angle = (i / 180) * Math.PI * 2;
        const lug = new THREE.Mesh(lugGeo, steel);
        lug.position.set(Math.cos(angle) * 3.8, Math.sin(angle) * 3.8, 1.4);
        lug.rotation.z = angle;
        collarMesh.add(lug);
    }
    collarGroup.position.y = 1.0;
    addPart('FloatationCollar', collarGroup, 'High-density foam-filled hypalon exterior collar providing immense reserve buoyancy.', 'rubber', 'Keeps the buoy upright and stable in extreme sea states.', 2, ['CentralHull', 'HydraulicStabilizer'], 'Loss of buoyancy reserve, extreme list angle.', ['SensorMastBase', 'TelemetryAntenna'], {x:0, y:1.0, z:0}, {x:0, y:6, z:0});

    // --- 3. Sensor Mast Base & Structure ---
    const mastBaseGroup = new THREE.Group();
    const mastBaseGeo = new THREE.CylinderGeometry(1.5, 2.0, 1.0, 32);
    const mastBase = new THREE.Mesh(mastBaseGeo, steel);
    mastBase.position.y = 5.5;
    mastBaseGroup.add(mastBase);
    
    // Main mast truss (complex intersecting cylinders)
    for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        const strutGeo = new THREE.CylinderGeometry(0.12, 0.12, 8, 16);
        const strut = new THREE.Mesh(strutGeo, aluminum);
        strut.position.set(Math.cos(angle) * 1.0, 9.5, Math.sin(angle) * 1.0);
        mastBaseGroup.add(strut);
    }
    // Cross bracing
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 6; j++) {
            const angle1 = (i / 4) * Math.PI * 2;
            const angle2 = (((i + 1) % 4) / 4) * Math.PI * 2;
            const braceGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.8, 8);
            const brace = new THREE.Mesh(braceGeo, steel);
            const height = 6.0 + j * 1.2;
            brace.position.set(
                (Math.cos(angle1) + Math.cos(angle2)) * 0.5,
                height,
                (Math.sin(angle1) + Math.sin(angle2)) * 0.5
            );
            brace.lookAt(Math.cos(angle2), height + 0.6, Math.sin(angle2));
            mastBaseGroup.add(brace);
        }
    }
    addPart('SensorMastBase', mastBaseGroup, 'Robust titanium lattice structure supporting all above-water meteorological sensors.', 'aluminum', 'Provides high-elevation hardpoints for environmental sensors.', 3, ['CentralHull', 'Anemometer', 'TelemetryAntenna'], 'Structural collapse of aerial sensors.', ['Anemometer', 'TelemetryAntenna', 'WarningLightBeacon'], {x:0, y:0, z:0}, {x:0, y:15, z:0});

    // --- 4. Anemometer (Wind Speed Sensor) ---
    const anemometerGroup = new THREE.Group();
    anemometerGroup.position.set(0, 14, 0);
    const centralShaftGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.8, 16);
    const centralShaft = new THREE.Mesh(centralShaftGeo, chrome);
    anemometerGroup.add(centralShaft);

    const rotorGroup = new THREE.Group();
    rotorGroup.position.y = 0.4;
    for (let i = 0; i < 3; i++) {
        const angle = (i / 3) * Math.PI * 2;
        const armGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.8, 8);
        const arm = new THREE.Mesh(armGeo, aluminum);
        arm.position.set(Math.cos(angle) * 0.4, 0, Math.sin(angle) * 0.4);
        arm.rotation.y = -angle;
        arm.rotation.z = Math.PI / 2;
        rotorGroup.add(arm);
        
        // Cup (half sphere via lathe)
        const cupGeo = new THREE.SphereGeometry(0.12, 16, 16, 0, Math.PI);
        const cup = new THREE.Mesh(cupGeo, plastic);
        cup.position.set(Math.cos(angle) * 0.8, 0, Math.sin(angle) * 0.8);
        cup.rotation.y = -angle;
        rotorGroup.add(cup);
    }
    anemometerGroup.add(rotorGroup);
    animatedObjects.anemometerCups.push(rotorGroup);
    addPart('Anemometer', anemometerGroup, 'Ultrasonic and mechanical wind speed and direction sensor suite.', 'chrome', 'Measures high-resolution wind velocity vectors.', 4, ['SensorMastBase'], 'Loss of meteorological wind data.', [], {x:0, y:0, z:0}, {x:0, y:20, z:0});

    // --- 5. Solar Panel Array ---
    const solarTracker = new THREE.Group();
    solarTracker.position.set(0, 8, 0);
    
    // Create 4 massive arrays
    for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        const panelGroup = new THREE.Group();
        
        const mountGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 16);
        const mount = new THREE.Mesh(mountGeo, steel);
        mount.rotation.z = Math.PI / 2;
        panelGroup.add(mount);

        const panelGeo = new THREE.BoxGeometry(2.0, 0.05, 1.5);
        const panel = new THREE.Mesh(panelGeo, solarMaterial);
        panel.position.set(1.2, 0.5, 0);
        panel.rotation.z = Math.PI / 6; // Angled to sky
        
        // Add panel grid lines
        const gridGeo = new THREE.BoxGeometry(1.9, 0.06, 1.4);
        const grid = new THREE.Mesh(gridGeo, silverWireframe);
        panel.add(grid);

        panelGroup.add(panel);
        panelGroup.position.set(Math.cos(angle) * 1.5, 0, Math.sin(angle) * 1.5);
        panelGroup.rotation.y = -angle;
        solarTracker.add(panelGroup);
    }
    animatedObjects.solarTracker = solarTracker;
    addPart('SolarPanelArray', solarTracker, 'High-efficiency monocrystalline PV arrays with automated sun-tracking gimbals.', 'solarMaterial', 'Generates primary electrical power.', 5, ['SensorMastBase', 'BatteryEnclosure'], 'Loss of power generation.', ['TelemetryAntenna', 'DataAcquisitionSystem'], {x:0, y:0, z:0}, {x:12, y:12, z:0});

    // --- 6. Warning Light Beacon ---
    const beaconGroup = new THREE.Group();
    beaconGroup.position.set(0, 14.8, 0);
    
    const beaconBaseGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.3, 32);
    const beaconBase = new THREE.Mesh(beaconBaseGeo, darkSteel);
    beaconGroup.add(beaconBase);
    
    const domeGeo = new THREE.SphereGeometry(0.3, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const dome = new THREE.Mesh(domeGeo, tinted);
    dome.position.y = 0.15;
    beaconGroup.add(dome);

    const lightGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.25, 16);
    const light = new THREE.Mesh(lightGeo, neonRed);
    light.position.y = 0.25;
    beaconGroup.add(light);
    animatedObjects.warningBeacon = light;

    addPart('WarningLightBeacon', beaconGroup, 'USCG compliant LED navigational warning beacon with Fresnel lens.', 'tinted', 'Prevents vessel collisions in low visibility.', 6, ['SensorMastBase'], 'Increased collision risk.', [], {x:0, y:0, z:0}, {x:0, y:22, z:0});

    // --- 7. Telemetry Antenna ---
    const antennaGroup = new THREE.Group();
    antennaGroup.position.set(1.0, 13, 1.0);
    const antDomeGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.0, 16);
    const antDome = new THREE.Mesh(antDomeGeo, plastic);
    antennaGroup.add(antDome);
    // Rings
    for (let i = 0; i < 8; i++) {
        const rGeo = new THREE.TorusGeometry(0.2, 0.02, 8, 16);
        const r = new THREE.Mesh(rGeo, copper);
        r.position.y = -0.8 + i * 0.2;
        r.rotation.x = Math.PI / 2;
        antennaGroup.add(r);
    }
    addPart('TelemetryAntenna', antennaGroup, 'Iridium satellite and UHF radio telemetry communications mast.', 'plastic', 'Transmits scientific data and system diagnostics to shore.', 7, ['SensorMastBase', 'DataAcquisitionSystem'], 'Total loss of remote communication.', [], {x:0, y:0, z:0}, {x:8, y:18, z:8});

    // --- 8. Hydraulic Stabilizers ---
    const stabilGroup = new THREE.Group();
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const cylinderGeo = new THREE.CylinderGeometry(0.2, 0.2, 2.5, 32);
        const cylinder = new THREE.Mesh(cylinderGeo, darkSteel);
        cylinder.position.set(Math.cos(angle) * 2.5, 0.5, Math.sin(angle) * 2.5);
        cylinder.rotation.x = Math.PI / 4;
        cylinder.rotation.y = -angle;

        const pistonGeo = new THREE.CylinderGeometry(0.12, 0.12, 2.5, 32);
        const piston = new THREE.Mesh(pistonGeo, chrome);
        piston.position.y = 1.25;
        cylinder.add(piston);
        animatedObjects.stabilizers.push({ cylinder, piston, phase: i });

        stabilGroup.add(cylinder);
    }
    addPart('HydraulicStabilizer', stabilGroup, 'Active heave-compensation hydraulic rams dampening wave-induced motion.', 'chrome', 'Reduces sensor noise and stabilizes platform.', 8, ['CentralHull', 'FloatationCollar'], 'Increased sensor noise and erratic buoy motion.', [], {x:0, y:0, z:0}, {x:-10, y:0, z:-10});

    // --- 9. Radar Reflector ---
    const radarGroup = new THREE.Group();
    radarGroup.position.set(-1.0, 12, -1.0);
    const planeGeo = new THREE.PlaneGeometry(1.5, 1.5);
    const p1 = new THREE.Mesh(planeGeo, aluminum);
    const p2 = new THREE.Mesh(planeGeo, aluminum);
    p2.rotation.y = Math.PI / 2;
    const p3 = new THREE.Mesh(planeGeo, aluminum);
    p3.rotation.x = Math.PI / 2;
    radarGroup.add(p1, p2, p3);
    addPart('RadarReflector', radarGroup, 'Passive octahedral radar cross-section enhancer for marine traffic detection.', 'aluminum', 'Makes the buoy highly visible to shipboard radar.', 9, ['SensorMastBase'], 'Invisible to marine radar, collision risk.', [], {x:0, y:0, z:0}, {x:-8, y:15, z:-8});

    // --- 10. Water Quality Sensor Pack ---
    const wqGroup = new THREE.Group();
    wqGroup.position.set(0, -5.5, 0);
    const wqBaseGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.8, 64);
    const wqBase = new THREE.Mesh(wqBaseGeo, steel);
    wqGroup.add(wqBase);

    // Multiple sensor probes hanging down
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const probeGeo = new THREE.CylinderGeometry(0.1, 0.05, 2.0, 16);
        const probe = new THREE.Mesh(probeGeo, copper);
        probe.position.set(Math.cos(angle) * 0.8, -1.2, Math.sin(angle) * 0.8);
        wqGroup.add(probe);
        
        // Sensor glowing tip
        const tipGeo = new THREE.SphereGeometry(0.08, 16, 16);
        const tip = new THREE.Mesh(tipGeo, neonBlue);
        tip.position.y = -1.0;
        probe.add(tip);
    }
    addPart('WaterQualitySensorPack', wqGroup, 'Multiparameter sonde measuring salinity, pH, dissolved oxygen, and turbidity.', 'copper', 'Collects subsurface biogeochemical data.', 10, ['CentralHull'], 'Loss of oceanographic data.', [], {x:0, y:0, z:0}, {x:0, y:-12, z:0});

    // --- 11. Mooring Attachment Point ---
    const mooringGroup = new THREE.Group();
    mooringGroup.position.set(0, -6.5, 0);
    const hookBaseGeo = new THREE.CylinderGeometry(0.6, 1.0, 1.2, 32);
    const hookBase = new THREE.Mesh(hookBaseGeo, darkSteel);
    mooringGroup.add(hookBase);

    const shackleGeo = new THREE.TorusGeometry(0.5, 0.2, 16, 64);
    const shackle = new THREE.Mesh(shackleGeo, steel);
    shackle.position.y = -0.8;
    shackle.rotation.x = Math.PI / 2;
    mooringGroup.add(shackle);
    addPart('MooringAttachmentPoint', mooringGroup, 'Heavy-duty titanium shackle and swivel assembly rated for 50-ton loads.', 'steel', 'Secures the buoy to the seafloor anchor system.', 11, ['CentralHull', 'MooringLine'], 'Buoy breaks free and drifts.', ['MooringLine'], {x:0, y:0, z:0}, {x:0, y:-15, z:0});

    // --- 12. Mooring Line & Chains ---
    const lineGroup = new THREE.Group();
    lineGroup.position.set(0, -7.5, 0);
    
    // Massive chains
    for (let i = 0; i < 25; i++) {
        const linkGeo = new THREE.TorusGeometry(0.3, 0.12, 16, 32);
        const link = new THREE.Mesh(linkGeo, darkSteel);
        link.position.y = -i * 0.6;
        link.rotation.x = Math.PI / 2;
        link.rotation.y = (i % 2 === 0) ? 0 : Math.PI / 2;
        lineGroup.add(link);
    }
    const cableGeo = new THREE.CylinderGeometry(0.15, 0.15, 30, 16);
    const cable = new THREE.Mesh(cableGeo, rubber);
    cable.position.y = -29.5;
    lineGroup.add(cable);
    addPart('MooringLine', lineGroup, 'Nilspin wire rope and heavy chain catenary system extending to the seabed.', 'rubber', 'Keeps the buoy on station.', 12, ['MooringAttachmentPoint'], 'Buoy becomes adrift.', [], {x:0, y:0, z:0}, {x:0, y:-25, z:0});

    // --- 13. Data Acquisition System (DAS) ---
    const dasGroup = new THREE.Group();
    dasGroup.position.set(0, 4.5, 0);
    const rackGeo = new THREE.BoxGeometry(2.2, 1.8, 2.2);
    const rack = new THREE.Mesh(rackGeo, aluminum);
    dasGroup.add(rack);

    // Glowing screens and LEDs on the rack
    for (let i = 0; i < 4; i++) {
        const screenGeo = new THREE.PlaneGeometry(0.8, 0.5);
        const screen = new THREE.Mesh(screenGeo, neonGreen);
        screen.position.set(-0.6 + (i % 2) * 1.2, 0.3 - Math.floor(i / 2) * 0.7, 1.11);
        dasGroup.add(screen);
        animatedObjects.dataScreens.push(screen);
    }
    
    addPart('DataAcquisitionSystem', dasGroup, 'Hardened edge-computing node for real-time sensor processing and logging.', 'aluminum', 'Brain of the buoy, processes all telemetry.', 13, ['CentralHull', 'SensorMastBase', 'BatteryEnclosure'], 'Total data loss and telemetry failure.', ['TelemetryAntenna'], {x:0, y:0, z:0}, {x:7, y:7, z:7});

    // --- 14. Battery Enclosure ---
    const batteryGroup = new THREE.Group();
    batteryGroup.position.set(0, 2, 0);
    const batGeo = new THREE.CylinderGeometry(1.9, 1.9, 1.8, 64);
    const bat = new THREE.Mesh(batGeo, darkSteel);
    batteryGroup.add(bat);

    // Complex Cooling fins on batteries
    for (let i = 0; i < 32; i++) {
        const finGeo = new THREE.BoxGeometry(0.15, 1.6, 0.4);
        const fin = new THREE.Mesh(finGeo, aluminum);
        const angle = (i / 32) * Math.PI * 2;
        fin.position.set(Math.cos(angle) * 1.95, 0, Math.sin(angle) * 1.95);
        fin.rotation.y = -angle;
        batteryGroup.add(fin);
    }
    addPart('BatteryEnclosure', batteryGroup, 'Sealed AGM deep-cycle battery banks with thermal management systems.', 'darkSteel', 'Stores solar energy for nighttime and winter operations.', 14, ['CentralHull', 'SolarPanelArray'], 'Power failure at night.', ['DataAcquisitionSystem', 'SensorMastBase'], {x:0, y:0, z:0}, {x:-8, y:4, z:8});

    // --- 15. Maintenance Ladder ---
    const ladderGroup = new THREE.Group();
    const railGeo = new THREE.CylinderGeometry(0.06, 0.06, 8, 16);
    const rail1 = new THREE.Mesh(railGeo, steel);
    rail1.position.set(2.2, 1, 0.4);
    const rail2 = new THREE.Mesh(railGeo, steel);
    rail2.position.set(2.2, 1, -0.4);
    ladderGroup.add(rail1, rail2);

    for (let i = -3.5; i <= 3.5; i += 0.5) {
        const rungGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.8, 16);
        const rung = new THREE.Mesh(rungGeo, steel);
        rung.position.set(2.2, 1 + i, 0);
        rung.rotation.x = Math.PI / 2;
        ladderGroup.add(rung);
    }
    addPart('MaintenanceLadder', ladderGroup, 'Corrosion-resistant boarding ladder for offshore technician access.', 'steel', 'Allows human access for servicing.', 15, ['CentralHull'], 'Inability to safely board buoy.', [], {x:0, y:0, z:0}, {x:10, y:0, z:0});

    // --- 16. Subsurface Hydrophones ---
    const hydroGroup = new THREE.Group();
    hydroGroup.position.set(0, -3.5, 0);
    const hydroRingGeo = new THREE.TorusGeometry(1.8, 0.15, 32, 64);
    const hydroRing = new THREE.Mesh(hydroRingGeo, darkSteel);
    hydroRing.rotation.x = Math.PI / 2;
    hydroGroup.add(hydroRing);

    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const micGeo = new THREE.SphereGeometry(0.25, 32, 32);
        const mic = new THREE.Mesh(micGeo, rubber);
        mic.position.set(Math.cos(angle) * 1.8, -0.3, Math.sin(angle) * 1.8);
        hydroGroup.add(mic);
    }
    addPart('SubsurfaceHydrophones', hydroGroup, 'Omnidirectional acoustic arrays for marine mammal and seismic monitoring.', 'rubber', 'Listens to underwater acoustics.', 16, ['CentralHull'], 'Loss of acoustic data.', [], {x:0, y:0, z:0}, {x:-7, y:-7, z:-7});

    // --- 17. Acoustic Release Transponder ---
    const acousticRelGroup = new THREE.Group();
    acousticRelGroup.position.set(0.8, -8, 0);
    const arGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 32);
    const ar = new THREE.Mesh(arGeo, aluminum);
    acousticRelGroup.add(ar);
    const arDome = new THREE.SphereGeometry(0.2, 32, 32);
    const ard = new THREE.Mesh(arDome, plastic);
    ard.position.y = 0.75;
    acousticRelGroup.add(ard);
    addPart('AcousticReleaseTransponder', acousticRelGroup, 'Failsafe release mechanism triggered by encrypted acoustic surface command.', 'aluminum', 'Allows recovery of the mooring line independently of the buoy.', 17, ['MooringLine'], 'Inability to recover deep mooring chain.', [], {x:0, y:0, z:0}, {x:6, y:-12, z:-6});

    // --- 18. Exhaust & Purge Vents ---
    const ventGroup = new THREE.Group();
    ventGroup.position.set(-2.0, 5.5, 0);
    const ventGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.6, 32);
    const vent = new THREE.Mesh(ventGeo, chrome);
    vent.rotation.z = Math.PI / 2;
    ventGroup.add(vent);
    
    const flapGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.1, 32);
    const flap = new THREE.Mesh(flapGeo, darkSteel);
    flap.position.x = -0.3;
    flap.rotation.z = Math.PI / 2;
    ventGroup.add(flap);

    addPart('PurgeVents', ventGroup, 'Pressure equalization and hydrogen off-gassing vents for the battery compartment.', 'chrome', 'Prevents explosive gas buildup.', 18, ['BatteryEnclosure', 'CentralHull'], 'Catastrophic explosion risk.', ['BatteryEnclosure'], {x:0, y:0, z:0}, {x:-8, y:8, z:0});

    // --- 19. Meteorological Sensors (Temp/Humidity) ---
    const metGroup = new THREE.Group();
    metGroup.position.set(0, 11, 1.5);
    const shieldGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.6, 32);
    const shield = new THREE.Mesh(shieldGeo, plastic);
    metGroup.add(shield);
    for (let i = 0; i < 8; i++) {
        const plateGeo = new THREE.TorusGeometry(0.25, 0.03, 16, 32);
        const plate = new THREE.Mesh(plateGeo, plastic);
        plate.rotation.x = Math.PI / 2;
        plate.position.y = -0.2 + i * 0.06;
        metGroup.add(plate);
    }
    addPart('MeteorologicalSensors', metGroup, 'Radiation-shielded ambient air temperature and relative humidity probes.', 'plastic', 'Records high-accuracy atmospheric conditions.', 19, ['SensorMastBase'], 'Inaccurate weather models.', [], {x:0, y:0, z:0}, {x:4, y:14, z:8});

    // --- 20. Ballast Weight ---
    const ballastGroup = new THREE.Group();
    ballastGroup.position.set(0, -4.5, 0);
    const balGeo = new THREE.SphereGeometry(2.2, 64, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    const bal = new THREE.Mesh(balGeo, steel);
    ballastGroup.add(bal);
    addPart('BallastWeight', ballastGroup, 'Massive cast-iron counterweight ensuring high metacentric height.', 'steel', 'Lowers center of gravity to prevent capsize.', 20, ['CentralHull'], 'Buoy flips upside down.', ['All Above Water Systems'], {x:0, y:0, z:0}, {x:0, y:-10, z:0});

    // --- 21. External Wiring Harness ---
    const cablingGroup = new THREE.Group();
    // A spiraling massive umbilical cable running up the mast
    const curvePoints = [];
    for (let i = 0; i <= 100; i++) {
        const t = i / 100;
        const y = t * 15 - 3;
        const radius = 1.6 - t * 0.6;
        const angle = t * Math.PI * 15;
        curvePoints.push(new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius));
    }
    const cableCurve = new THREE.CatmullRomCurve3(curvePoints);
    const cableGeoMast = new THREE.TubeGeometry(cableCurve, 100, 0.08, 16, false);
    const mainCable = new THREE.Mesh(cableGeoMast, rubber);
    cablingGroup.add(mainCable);
    
    // Additional hydraulic lines
    for (let i = 0; i < 6; i++) {
        const p = [];
        for (let j = 0; j <= 20; j++) {
            p.push(new THREE.Vector3(
                Math.sin(j * 0.4) * 0.8 + Math.cos(i) * 2.0,
                j * 0.4 - 3,
                Math.cos(j * 0.4) * 0.8 + Math.sin(i) * 2.0
            ));
        }
        const c3 = new THREE.CatmullRomCurve3(p);
        const tg = new THREE.TubeGeometry(c3, 30, 0.04, 8, false);
        const tm = new THREE.Mesh(tg, plastic);
        cablingGroup.add(tm);
    }
    addPart('ExternalWiringHarness', cablingGroup, 'Heavy armored umbilical cables routing multi-gigabit data and primary power.', 'rubber', 'Transmits electrical power and signals.', 21, ['CentralHull', 'SensorMastBase', 'DataAcquisitionSystem'], 'Short circuit and loss of sensor data.', [], {x:0, y:0, z:0}, {x:6, y:0, z:6});

    const description = "Ultra-complex Deep Ocean Oceanographic Buoy. Features massive environmental sensor suites, active hydraulic stabilization, and hardened satellite telemetry systems engineered to survive the most violent oceanic hurricanes.";

    const quizQuestions = [
        {
            question: "Which component is critical for preventing the buoy from capsizing in extreme sea states?",
            options: ["Anemometer", "BallastWeight", "TelemetryAntenna", "RadarReflector"],
            correctAnswer: "BallastWeight",
            explanation: "The BallastWeight drastically lowers the center of gravity, maintaining a high metacentric height for immense stability."
        },
        {
            question: "What is the primary function of the HydraulicStabilizers?",
            options: ["Provide power", "Act as active heave-compensation to dampen wave motion", "Measure water pressure", "Generate acoustic pings"],
            correctAnswer: "Act as active heave-compensation to dampen wave motion",
            explanation: "Hydraulic rams connect the collar to the hull, actively dampening wave-induced heave to reduce sensor noise."
        },
        {
            question: "Why does the BatteryEnclosure require PurgeVents?",
            options: ["To release heat", "To prevent explosive hydrogen gas buildup from charging", "To intake fresh air", "To measure atmospheric pressure"],
            correctAnswer: "To prevent explosive hydrogen gas buildup from charging",
            explanation: "Deep-cycle batteries can off-gas hydrogen during heavy solar charging, requiring venting to prevent devastating internal explosions."
        },
        {
            question: "Which system processes all raw telemetry and acts as the 'brain'?",
            options: ["WaterQualitySensorPack", "AcousticReleaseTransponder", "DataAcquisitionSystem", "WarningLightBeacon"],
            correctAnswer: "DataAcquisitionSystem",
            explanation: "The DAS handles all edge-computing, aggregating data from all sensors before satellite transmission."
        },
        {
            question: "How is the mooring line detached remotely if the surface buoy cannot be recovered?",
            options: ["By pulling it hard", "Cutting it with ROV", "Triggering the AcousticReleaseTransponder", "It rusts away"],
            correctAnswer: "Triggering the AcousticReleaseTransponder",
            explanation: "An encrypted acoustic signal from a surface vessel can trigger a mechanical release on the transponder, dropping the anchor and freeing the line."
        }
    ];

    function animate(time, speed, meshes) {
        // Spin anemometer cups rapidly based on wind speed simulation
        animatedObjects.anemometerCups.forEach(cup => {
            cup.rotation.y -= 0.15 * speed;
        });

        // Flash warning beacon (simulating strobe)
        if (animatedObjects.warningBeacon) {
            const flash = Math.sin(time * 8 * speed) > 0.85;
            animatedObjects.warningBeacon.material.emissiveIntensity = flash ? 4.0 : 0.1;
        }

        // Move hydraulic stabilizers up and down in a complex wave pattern
        animatedObjects.stabilizers.forEach(stab => {
            const offset = Math.sin(time * 2.5 * speed + stab.phase) * 0.6;
            stab.piston.position.y = 1.25 + offset;
            stab.cylinder.rotation.x = Math.PI / 4 + offset * 0.08;
        });

        // Track sun with massive solar array
        if (animatedObjects.solarTracker) {
            animatedObjects.solarTracker.rotation.y = Math.sin(time * 0.2 * speed) * 0.6;
        }

        // Pulse and flicker data screens
        animatedObjects.dataScreens.forEach((screen, i) => {
            screen.material.emissiveIntensity = 1.0 + Math.sin(time * 12 * speed + i * 2) * 0.8;
        });
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createDeepOceanBuoy() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
