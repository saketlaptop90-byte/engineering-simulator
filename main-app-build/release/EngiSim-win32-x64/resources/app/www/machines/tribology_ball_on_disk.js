import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Material setup for custom glow
    const neonBlue = new THREE.MeshStandardMaterial({ color: 0x0088ff, emissive: 0x0088ff, emissiveIntensity: 2.0, roughness: 0.2 });
    const neonRed = new THREE.MeshStandardMaterial({ color: 0xff0044, emissive: 0xff0044, emissiveIntensity: 2.0, roughness: 0.2 });
    const laserGreen = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 4.0, transparent: true, opacity: 0.8 });
    const panelScreen = new THREE.MeshStandardMaterial({ color: 0x111111, emissive: 0x00aaff, emissiveIntensity: 0.5 });
    
    // Helper function to create cylinder
    function makeCyl(rTop, rBot, height, radSeg, mat) {
        const geo = new THREE.CylinderGeometry(rTop, rBot, height, radSeg);
        return new THREE.Mesh(geo, mat);
    }

    // 1. Massive Base Structure
    const baseGroup = new THREE.Group();
    const baseShape = new THREE.Shape();
    baseShape.moveTo(-15, -15);
    baseShape.lineTo(15, -15);
    baseShape.lineTo(20, -5);
    baseShape.lineTo(20, 15);
    baseShape.lineTo(10, 20);
    baseShape.lineTo(-10, 20);
    baseShape.lineTo(-20, 15);
    baseShape.lineTo(-20, -5);
    baseShape.lineTo(-15, -15);

    const extrudeSettings = { depth: 5, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.5, bevelThickness: 0.5 };
    const baseGeo = new THREE.ExtrudeGeometry(baseShape, extrudeSettings);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.rotation.x = Math.PI / 2;
    baseMesh.position.y = -5;
    baseGroup.add(baseMesh);

    // Vibration isolation feet
    for(let i=0; i<4; i++) {
        const foot = makeCyl(1.5, 2, 2, 32, rubber);
        foot.position.set(i<2 ? 15 : -15, -7, i%2===0 ? 10 : -10);
        baseGroup.add(foot);
    }
    
    group.add(baseGroup);
    meshes.base = baseGroup;

    parts.push({
        name: "Vibration-Isolated Base Frame",
        description: "Massive extruded steel base with heavy-duty elastomeric vibration dampeners to ensure zero external noise during nano-scale friction measurements.",
        material: "darkSteel, rubber",
        function: "Provides an ultra-rigid foundation for the tribometer.",
        assemblyOrder: 1,
        connections: ["Spindle Motor", "Enclosure"],
        failureEffect: "Vibration interference causes massive noise in friction data.",
        cascadeFailures: ["Friction Sensor", "Load Cell"],
        originalPosition: {x: 0, y: -5, z: 0},
        explodedPosition: {x: 0, y: -25, z: 0}
    });

    // 2. High-Torque Spindle Motor
    const spindleGroup = new THREE.Group();
    spindleGroup.position.set(0, 0, 0);
    
    // Motor Body
    const motorBody = makeCyl(6, 6, 8, 64, aluminum);
    motorBody.position.y = 4;
    spindleGroup.add(motorBody);
    
    // Cooling fins (Lathe geometry for extreme detail)
    const points = [];
    for ( let i = 0; i < 20; i ++ ) {
        points.push( new THREE.Vector2( i%2===0 ? 6 : 7.5, i * 0.35 ) );
    }
    const finsGeo = new THREE.LatheGeometry( points, 64 );
    const fins = new THREE.Mesh( finsGeo, darkSteel );
    fins.position.y = 0.5;
    spindleGroup.add(fins);
    
    // Stator coils (visible through gaps)
    for(let i=0; i<12; i++) {
        const coil = makeCyl(0.5, 0.5, 6, 16, copper);
        coil.position.set(Math.sin(i*Math.PI/6)*4, 4, Math.cos(i*Math.PI/6)*4);
        spindleGroup.add(coil);
    }
    
    // Spindle Shaft
    const spindleShaft = makeCyl(1, 1, 4, 32, chrome);
    spindleShaft.position.y = 9;
    spindleGroup.add(spindleShaft);
    
    group.add(spindleGroup);
    meshes.spindleMotor = spindleGroup;

    parts.push({
        name: "High-Torque Direct-Drive Spindle",
        description: "Ultra-precision brushless DC motor with liquid-cooled fins and copper stator arrays for flawless rotation control.",
        material: "aluminum, copper, darkSteel",
        function: "Spins the test disk at highly controlled variable RPMs.",
        assemblyOrder: 2,
        connections: ["Base Frame", "Test Disk Base"],
        failureEffect: "Irregular RPMs cause inaccurate Stribeck curve generation.",
        cascadeFailures: ["Test Disk"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -10, z: 20}
    });

    // 3. Test Disk and Holder
    const diskGroup = new THREE.Group();
    diskGroup.position.set(0, 11.5, 0);
    
    const diskHolder = makeCyl(4, 4, 1, 64, steel);
    diskGroup.add(diskHolder);
    
    const testDisk = makeCyl(3.5, 3.5, 0.5, 64, steel);
    testDisk.position.y = 0.75;
    diskGroup.add(testDisk);
    
    // Wear track (Torus) - slightly raised to simulate wear interaction zone
    const wearTrackGeo = new THREE.TorusGeometry(2, 0.1, 16, 64);
    const wearTrack = new THREE.Mesh(wearTrackGeo, new THREE.MeshStandardMaterial({color: 0x555555, roughness: 0.8, metalness: 0.5}));
    wearTrack.rotation.x = Math.PI / 2;
    wearTrack.position.y = 1.02;
    diskGroup.add(wearTrack);
    meshes.wearTrack = wearTrack;
    
    // Clamping bolts
    for(let i=0; i<6; i++) {
        const bolt = makeCyl(0.2, 0.2, 0.5, 12, chrome);
        bolt.position.set(Math.sin(i*Math.PI/3)*3, 0.75, Math.cos(i*Math.PI/3)*3);
        diskGroup.add(bolt);
    }
    
    group.add(diskGroup);
    meshes.diskGroup = diskGroup;

    parts.push({
        name: "Test Specimen Disk & Chuck",
        description: "Interchangeable tribological test surface with quick-release pneumatic bolts. A circular wear track forms dynamically during testing.",
        material: "steel, chrome",
        function: "Acts as the counter-face for the friction test.",
        assemblyOrder: 3,
        connections: ["Spindle Shaft", "Ball Bearing"],
        failureEffect: "Specimen slipping off chuck destroys the machine.",
        cascadeFailures: ["Friction Sensor", "Spindle Shaft"],
        originalPosition: {x: 0, y: 11.5, z: 0},
        explodedPosition: {x: 0, y: 15, z: -20}
    });

    // 4. Heavy Duty Arm Support Pillar
    const pillarGroup = new THREE.Group();
    pillarGroup.position.set(-10, 0, 0);
    
    const pillarBase = makeCyl(3, 4, 3, 32, darkSteel);
    pillarBase.position.y = 1.5;
    pillarGroup.add(pillarBase);
    
    const pillarMain = makeCyl(2, 2, 20, 32, steel);
    pillarMain.position.y = 13;
    pillarGroup.add(pillarMain);
    
    // Linear guide rail on pillar
    const railGeo = new THREE.BoxGeometry(1, 18, 1);
    const rail = new THREE.Mesh(railGeo, chrome);
    rail.position.set(1.5, 13, 0);
    pillarGroup.add(rail);
    
    group.add(pillarGroup);
    
    parts.push({
        name: "Cantilever Support Pillar",
        description: "Massive vertical column with linear guide rails for precise z-axis positioning of the load arm.",
        material: "steel, darkSteel",
        function: "Supports the entire loading and sensor assembly.",
        assemblyOrder: 4,
        connections: ["Base Frame", "Vertical Actuator"],
        failureEffect: "Bending of the pillar ruins normal force calibration.",
        cascadeFailures: ["Load Arm"],
        originalPosition: {x: -10, y: 0, z: 0},
        explodedPosition: {x: -30, y: 0, z: 0}
    });

    // 5. Vertical Actuator & Carriage
    const carriageGroup = new THREE.Group();
    carriageGroup.position.set(-8.5, 15, 0); // attached to rail
    
    const carriageBody = new THREE.Mesh(new THREE.BoxGeometry(3, 4, 4), aluminum);
    carriageGroup.add(carriageBody);
    
    // Hydraulic lift cylinder
    const liftCyl = makeCyl(0.8, 0.8, 8, 16, darkSteel);
    liftCyl.position.set(-1.5, -6, 0);
    carriageGroup.add(liftCyl);
    const liftPiston = makeCyl(0.4, 0.4, 8, 16, chrome);
    liftPiston.position.set(-1.5, -2, 0);
    carriageGroup.add(liftPiston);
    
    group.add(carriageGroup);
    meshes.carriage = carriageGroup;

    parts.push({
        name: "Z-Axis Carriage & Hydraulic Lift",
        description: "Precision motorized carriage integrated with a high-pressure hydraulic piston for smooth vertical engagement of the ball.",
        material: "aluminum, chrome",
        function: "Moves the load arm up and down.",
        assemblyOrder: 5,
        connections: ["Support Pillar", "Load Arm"],
        failureEffect: "Carriage jamming prevents test initiation or crushes the sample.",
        cascadeFailures: ["Ball Specimen", "Test Disk"],
        originalPosition: {x: -8.5, y: 15, z: 0},
        explodedPosition: {x: -25, y: 30, z: 0}
    });

    // 6. Load Arm & Pivot Mechanism
    const armGroup = new THREE.Group();
    armGroup.position.set(-7, 15, 0); // Origin at carriage pivot
    
    const pivot = makeCyl(1.5, 1.5, 5, 32, darkSteel);
    pivot.rotation.x = Math.PI/2;
    armGroup.add(pivot);
    
    const mainArm = new THREE.Mesh(new THREE.BoxGeometry(10, 1.5, 2), aluminum);
    mainArm.position.set(5, 0, 0);
    armGroup.add(mainArm);
    
    // Arm wiring / tubes
    const tubePath = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 1, 0.5),
        new THREE.Vector3(3, 1.5, 1.5),
        new THREE.Vector3(7, 1, 0.5)
    ]);
    const tubeGeo = new THREE.TubeGeometry(tubePath, 20, 0.15, 8, false);
    const armTube = new THREE.Mesh(tubeGeo, plastic);
    armGroup.add(armTube);

    group.add(armGroup);
    meshes.loadArm = armGroup;

    parts.push({
        name: "Friction Load Arm",
        description: "Aerospace-grade aluminum cantilever equipped with internal routing for sensor cables and pneumatic lines.",
        material: "aluminum, darkSteel",
        function: "Transmits normal load to the ball and holds the friction sensors.",
        assemblyOrder: 6,
        connections: ["Carriage", "Force Sensor Base"],
        failureEffect: "Arm resonance completely invalidates high-speed tribology data.",
        cascadeFailures: ["Friction Data Stream"],
        originalPosition: {x: -7, y: 15, z: 0},
        explodedPosition: {x: -15, y: 25, z: -15}
    });

    // 7. Normal Force Application (Deadweights & Hydraulics)
    const loadSystemGroup = new THREE.Group();
    loadSystemGroup.position.set(0, 2, 0); // relative to arm
    armGroup.add(loadSystemGroup); // Add to arm so it pivots with it
    
    const weightPan = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 0.2, 32), steel);
    weightPan.position.set(8, 0, 0);
    loadSystemGroup.add(weightPan);
    
    const weight1 = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 1, 32), darkSteel);
    weight1.position.set(8, 0.6, 0);
    loadSystemGroup.add(weight1);
    
    const weight2 = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 1, 32), darkSteel);
    weight2.position.set(8, 1.6, 0);
    loadSystemGroup.add(weight2);
    
    // Active hydraulic press for dynamic loading
    const activePress = makeCyl(0.6, 0.6, 3, 16, chrome);
    activePress.position.set(8, 3.5, 0);
    loadSystemGroup.add(activePress);

    parts.push({
        name: "Normal Force Weights & Active Press",
        description: "Hybrid loading system utilizing precision deadweights combined with an active piezoelectric-hydraulic press for static and dynamic loading protocols.",
        material: "darkSteel, chrome",
        function: "Applies a precisely known perpendicular force to the friction interface.",
        assemblyOrder: 7,
        connections: ["Load Arm"],
        failureEffect: "Uneven load causes gouging of the test disk.",
        cascadeFailures: ["Test Disk", "Ball Specimen"],
        originalPosition: {x: -7, y: 17, z: 0},
        explodedPosition: {x: 10, y: 35, z: 0}
    });

    // 8. 2D Load Cell (Friction Sensor)
    const sensorGroup = new THREE.Group();
    sensorGroup.position.set(7, -1, 0); // End of arm, pointing down
    armGroup.add(sensorGroup);
    
    const sensorBody = new THREE.Mesh(new THREE.BoxGeometry(2, 3, 2), steel);
    sensorBody.position.y = -1.5;
    sensorGroup.add(sensorBody);
    
    // Glowing sensor indicator
    const sensorLight = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), neonBlue);
    sensorLight.position.set(1.1, -1.5, 0);
    sensorGroup.add(sensorLight);
    meshes.sensorLight = sensorLight;
    
    // Strain gauges (tiny patches)
    for(let i=0; i<4; i++) {
        const patch = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.8), copper);
        patch.position.set(i<2 ? -1.01 : 1.01, -1.5, i%2===0 ? 0.5 : -0.5);
        patch.rotation.y = i<2 ? -Math.PI/2 : Math.PI/2;
        sensorGroup.add(patch);
    }

    parts.push({
        name: "Multi-Axis Strain Gauge Load Cell",
        description: "Extremely sensitive block with micro-copper strain gauges to detect minuscule lateral friction forces and normal load variations simultaneously.",
        material: "steel, copper",
        function: "Measures the friction force generated at the contact point.",
        assemblyOrder: 8,
        connections: ["Load Arm", "Ball Chuck"],
        failureEffect: "Drift in sensor calibration outputs negative friction values.",
        cascadeFailures: ["Data Acquisition System"],
        originalPosition: {x: 0, y: 14, z: 0},
        explodedPosition: {x: 10, y: 20, z: 15}
    });

    // 9. Ball Chuck & Ball Specimen
    const ballGroup = new THREE.Group();
    ballGroup.position.set(0, -3, 0); // Below sensor
    sensorGroup.add(ballGroup);
    
    const chuck = makeCyl(0.8, 0.4, 1.5, 32, chrome);
    chuck.position.y = -0.75;
    ballGroup.add(chuck);
    
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), chrome);
    ball.position.y = -1.6;
    ballGroup.add(ball);
    meshes.ball = ball;
    
    // Micro drip lubrication nozzle targeting the ball
    const lubeNozzle = makeCyl(0.05, 0.1, 1, 16, copper);
    lubeNozzle.position.set(0.5, -1, 0.5);
    lubeNozzle.rotation.z = Math.PI/4;
    lubeNozzle.rotation.x = -Math.PI/4;
    ballGroup.add(lubeNozzle);

    parts.push({
        name: "Ball Specimen & Micro-Chuck",
        description: "Hardened bearing steel sphere (52100) locked in a rigid chuck, paired with a micro-capillary lubrication nozzle for wet testing.",
        material: "chrome, copper",
        function: "Provides the point-contact for sliding friction against the disk.",
        assemblyOrder: 9,
        connections: ["Load Cell", "Test Disk"],
        failureEffect: "Ball fracture showers the enclosure in hyper-velocity shrapnel.",
        cascadeFailures: ["Enclosure Glass", "Test Disk"],
        originalPosition: {x: 0, y: 11, z: 0},
        explodedPosition: {x: 0, y: 5, z: 20}
    });

    // 10. Lubrication Reservoir & Pump Station
    const pumpGroup = new THREE.Group();
    pumpGroup.position.set(12, 0, -12);
    
    const tankGeo = new THREE.CylinderGeometry(2, 2, 8, 32);
    const tank = new THREE.Mesh(tankGeo, glass);
    tank.position.y = 4;
    pumpGroup.add(tank);
    
    // Fluid inside tank
    const fluidGeo = new THREE.CylinderGeometry(1.9, 1.9, 6, 32);
    const fluidMat = new THREE.MeshPhysicalMaterial({color: 0xaa9900, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1});
    const fluid = new THREE.Mesh(fluidGeo, fluidMat);
    fluid.position.y = 3;
    pumpGroup.add(fluid);
    
    const pumpMotor = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), darkSteel);
    pumpMotor.position.set(0, 1.5, 3);
    pumpGroup.add(pumpMotor);
    
    // Tubing to arm
    const lubeTubePath = new THREE.CatmullRomCurve3([
        new THREE.Vector3(12, 3, -9),
        new THREE.Vector3(5, 18, -5),
        new THREE.Vector3(-6, 17, 2)
    ]);
    const lubeTubeGeo = new THREE.TubeGeometry(lubeTubePath, 32, 0.2, 8, false);
    const lubeTube = new THREE.Mesh(lubeTubeGeo, plastic);
    group.add(lubeTube);
    
    group.add(pumpGroup);

    parts.push({
        name: "Peristaltic Lubrication System",
        description: "Heated oil reservoir with high-pressure peristaltic pump and Teflon tubing for continuous fluid supply to the contact interface.",
        material: "glass, darkSteel, plastic",
        function: "Maintains a specific fluid film regime (boundary, mixed, or hydrodynamic).",
        assemblyOrder: 10,
        connections: ["Base Frame", "Micro-Chuck"],
        failureEffect: "Oil starvation leads to instant severe adhesive wear and catastrophic seizure.",
        cascadeFailures: ["Ball Specimen", "Spindle Motor"],
        originalPosition: {x: 12, y: 0, z: -12},
        explodedPosition: {x: 25, y: 0, z: -25}
    });

    // 11. Laser Profilometer System (Real-time wear tracking)
    const laserGroup = new THREE.Group();
    laserGroup.position.set(-3, 13, 8);
    
    const laserBase = new THREE.Mesh(new THREE.BoxGeometry(2, 4, 2), aluminum);
    laserGroup.add(laserBase);
    
    const laserLens = makeCyl(0.5, 0.5, 1, 16, chrome);
    laserLens.rotation.x = Math.PI/2;
    laserLens.position.set(0, -1, -1.5);
    laserGroup.add(laserLens);
    
    // Laser beam
    const beamGeo = new THREE.CylinderGeometry(0.05, 0.05, 10, 16);
    const beam = new THREE.Mesh(beamGeo, laserGreen);
    beam.rotation.x = Math.PI/2;
    beam.position.set(0, -1, -6);
    laserGroup.add(beam);
    meshes.laserBeam = beam;
    
    group.add(laserGroup);

    parts.push({
        name: "In-Situ Laser Profilometer",
        description: "High-frequency confocal laser displacement sensor for real-time nanometer measurement of wear track depth.",
        material: "aluminum, chrome, glass",
        function: "Measures wear volume dynamically without stopping the test.",
        assemblyOrder: 11,
        connections: ["Base Frame", "Data Unit"],
        failureEffect: "Laser misalignment causes false wear rate data.",
        cascadeFailures: ["None"],
        originalPosition: {x: -3, y: 13, z: 8},
        explodedPosition: {x: -10, y: 20, z: 25}
    });

    // 12. Main Control Console
    const consoleGroup = new THREE.Group();
    consoleGroup.position.set(16, 0, 10);
    consoleGroup.rotation.y = -Math.PI/6;
    
    const consoleStand = makeCyl(1.5, 2.5, 12, 16, darkSteel);
    consoleStand.position.y = 6;
    consoleGroup.add(consoleStand);
    
    const screenGeo = new THREE.BoxGeometry(6, 4, 0.5);
    const screenPanel = new THREE.Mesh(screenGeo, plastic);
    screenPanel.position.set(0, 13, 0);
    screenPanel.rotation.x = -Math.PI/8;
    consoleGroup.add(screenPanel);
    
    const screenGlow = new THREE.Mesh(new THREE.PlaneGeometry(5.5, 3.5), panelScreen);
    screenGlow.position.set(0, 13, 0.26);
    screenGlow.rotation.x = -Math.PI/8;
    consoleGroup.add(screenGlow);
    
    // Buttons on a lower panel
    const buttonPanel = new THREE.Mesh(new THREE.BoxGeometry(6, 2, 2), aluminum);
    buttonPanel.position.set(0, 10.5, 1);
    buttonPanel.rotation.x = -Math.PI/4;
    consoleGroup.add(buttonPanel);
    
    for(let i=0; i<3; i++) {
        const btn = makeCyl(0.3, 0.3, 0.2, 16, i===0? neonRed : neonBlue);
        btn.position.set(-2 + i*2, 11, 1.8);
        btn.rotation.x = Math.PI/4;
        consoleGroup.add(btn);
    }
    
    group.add(consoleGroup);

    parts.push({
        name: "Command & Telemetry Console",
        description: "Touchscreen interface with live streaming of friction coefficient (COF), temperature, and acoustic emission graphs.",
        material: "plastic, darkSteel, aluminum",
        function: "Operator interface for programming test protocols.",
        assemblyOrder: 12,
        connections: ["Base Frame"],
        failureEffect: "Console crash requires emergency manual abort of the spindle.",
        cascadeFailures: ["Spindle Motor"],
        originalPosition: {x: 16, y: 0, z: 10},
        explodedPosition: {x: 35, y: 5, z: 25}
    });

    // 13. High-Voltage Power Supply
    const powerGroup = new THREE.Group();
    powerGroup.position.set(-15, 0, -10);
    
    const psuBody = new THREE.Mesh(new THREE.BoxGeometry(6, 8, 6), darkSteel);
    psuBody.position.y = 4;
    powerGroup.add(psuBody);
    
    const coolingFan = makeCyl(2, 2, 0.5, 16, chrome);
    coolingFan.position.set(0, 4, 3.1);
    coolingFan.rotation.x = Math.PI/2;
    powerGroup.add(coolingFan);
    meshes.coolingFan = coolingFan;
    
    // Cables bundle
    const cableGeo = new THREE.CylinderGeometry(0.5, 0.5, 15, 16);
    const cables = new THREE.Mesh(cableGeo, rubber);
    cables.rotation.x = Math.PI/2;
    cables.rotation.z = Math.PI/4;
    cables.position.set(5, 1, 5);
    powerGroup.add(cables);
    
    group.add(powerGroup);

    parts.push({
        name: "10kW High-Voltage Power Plant",
        description: "Dedicated power supply unit regulating clean energy for the spindle, heaters, and sensitive electronics.",
        material: "darkSteel, chrome, rubber",
        function: "Provides isolated power to prevent electrical noise in load cells.",
        assemblyOrder: 13,
        connections: ["Base Frame", "Console", "Spindle"],
        failureEffect: "Power surge destroys micro-strain gauges.",
        cascadeFailures: ["Friction Sensor", "Laser Profilometer"],
        originalPosition: {x: -15, y: 0, z: -10},
        explodedPosition: {x: -35, y: 0, z: -30}
    });

    // 14. Acoustic Emission Sensor (AES)
    const aesGroup = new THREE.Group();
    aesGroup.position.set(0, 11, -5);
    
    const aesBody = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 1.5), copper);
    aesGroup.add(aesBody);
    
    const aesProbe = makeCyl(0.2, 0.2, 3, 16, chrome);
    aesProbe.position.set(0, 0, 2);
    aesProbe.rotation.x = Math.PI/2;
    aesGroup.add(aesProbe);
    
    group.add(aesGroup);

    parts.push({
        name: "Acoustic Emission Microphone",
        description: "Ultra-high frequency piezo-microphone clamped near the contact zone to record atomic-level fracture sounds during wear.",
        material: "copper, chrome",
        function: "Detects the exact moment of coating failure or severe wear transition.",
        assemblyOrder: 14,
        connections: ["Test Disk Base"],
        failureEffect: "Missed detection of coating failure ruins the experiment.",
        cascadeFailures: ["None"],
        originalPosition: {x: 0, y: 11, z: -5},
        explodedPosition: {x: 0, y: 25, z: -15}
    });

    // 15. Environmental Chamber Enclosure
    const enclosureGroup = new THREE.Group();
    
    // Frame
    const frameGeo = new THREE.BoxGeometry(42, 30, 32);
    const frameEdges = new THREE.EdgesGeometry(frameGeo);
    const frameMesh = new THREE.LineSegments(frameEdges, new THREE.LineBasicMaterial({color: 0xffffff, linewidth: 2}));
    frameMesh.position.y = 10;
    enclosureGroup.add(frameMesh);
    
    // Tinted Glass panels
    const glassMat = new THREE.MeshPhysicalMaterial({color: 0x111111, transmission: 0.8, opacity: 1, transparent: true, roughness: 0.1, metalness: 0.3});
    
    const backPanel = new THREE.Mesh(new THREE.PlaneGeometry(42, 30), glassMat);
    backPanel.position.set(0, 10, -16);
    enclosureGroup.add(backPanel);
    
    const leftPanel = new THREE.Mesh(new THREE.PlaneGeometry(32, 30), glassMat);
    leftPanel.position.set(-21, 10, 0);
    leftPanel.rotation.y = Math.PI/2;
    enclosureGroup.add(leftPanel);
    
    const rightPanel = new THREE.Mesh(new THREE.PlaneGeometry(32, 30), glassMat);
    rightPanel.position.set(21, 10, 0);
    rightPanel.rotation.y = -Math.PI/2;
    enclosureGroup.add(rightPanel);
    
    // Front Sliding Doors
    const doorGeo = new THREE.PlaneGeometry(20, 30);
    const doorL = new THREE.Mesh(doorGeo, glassMat);
    doorL.position.set(-10, 10, 16);
    enclosureGroup.add(doorL);
    
    const doorR = new THREE.Mesh(doorGeo, glassMat);
    doorR.position.set(10, 10, 16);
    enclosureGroup.add(doorR);
    meshes.doorL = doorL;
    meshes.doorR = doorR;
    
    group.add(enclosureGroup);

    parts.push({
        name: "Controlled Environment Chamber",
        description: "Sealed enclosure with tinted polycarbonate shielding, capable of pumping in argon gas or controlling humidity for exotic tribo-testing.",
        material: "tinted, aluminum",
        function: "Isolates the experiment from atmospheric interference and protects operators.",
        assemblyOrder: 15,
        connections: ["Base Frame"],
        failureEffect: "Chamber breach alters humidity, drastically changing tribo-chemical wear rates.",
        cascadeFailures: ["Test Validity"],
        originalPosition: {x: 0, y: 10, z: 0},
        explodedPosition: {x: 0, y: 50, z: 0}
    });

    const description = "The Ball-on-Disk Tribometer is a massive, hyper-realistic analytical instrument designed to measure friction and wear at the microscopic scale. By rotating a test disk against a stationary loaded ball bearing, it generates complex Stribeck curves and wear track profiles. The machine features high-torque direct drive spindles, hydraulic normal force application, multi-axis strain gauges, in-situ laser profilometry, and acoustic emission sensing, all housed in a sealed environmental chamber.";

    const quizQuestions = [
        {
            question: "What is the function of the Multi-Axis Strain Gauge Load Cell?",
            options: [
                "To cool the spindle motor.",
                "To measure lateral friction forces and normal load variations.",
                "To rotate the test disk.",
                "To pump lubrication fluid."
            ],
            correctAnswer: 1,
            explanation: "The load cell is packed with micro-copper strain gauges to accurately measure the friction forces generated at the ball-disk contact point."
        },
        {
            question: "Why does the machine utilize an Environmental Chamber Enclosure?",
            options: [
                "To make the machine look aesthetically pleasing.",
                "To store extra test specimens.",
                "To isolate the experiment from atmospheric interference (humidity/gases) and protect operators.",
                "To amplify the acoustic emission sounds."
            ],
            correctAnswer: 2,
            explanation: "Tribological phenomena are highly sensitive to humidity and atmospheric gases. The chamber allows for a controlled environment."
        },
        {
            question: "What component is responsible for dynamically measuring the depth of the wear track during testing?",
            options: [
                "Acoustic Emission Microphone",
                "Peristaltic Pump",
                "In-Situ Laser Profilometer",
                "Command Console"
            ],
            correctAnswer: 2,
            explanation: "The laser profilometer uses a high-frequency confocal laser to measure the wear volume dynamically without stopping the test."
        },
        {
            question: "How does the machine apply a precise normal force to the friction interface?",
            options: [
                "By speeding up the spindle motor.",
                "Using a hybrid system of deadweights and an active piezoelectric-hydraulic press.",
                "By tightening the clamping bolts.",
                "Through magnetic repulsion."
            ],
            correctAnswer: 1,
            explanation: "The normal force is critical for friction tests, and is applied via a cantilever arm utilizing both precise deadweights and active hydraulic pressing."
        },
        {
            question: "What happens if the Peristaltic Lubrication System fails?",
            options: [
                "The wear track becomes perfectly smooth.",
                "The test continues normally as a dry test.",
                "Oil starvation leads to instant severe adhesive wear and catastrophic seizure.",
                "The laser profilometer shuts down."
            ],
            correctAnswer: 2,
            explanation: "If a wet test suddenly loses its lubrication film, the metal surfaces will adhere to each other, causing massive friction spikes and destructive galling."
        }
    ];

    let animationPhase = 0;
    function animate(time, speed, meshes) {
        // Disk rotation
        if (meshes.diskGroup) {
            meshes.diskGroup.rotation.y = time * 5 * speed; // High speed rotation
        }
        
        // Spindle internals rotation
        if (meshes.spindleMotor) {
            meshes.spindleMotor.children[2].rotation.y = time * 5 * speed; // Shaft
        }

        // Fan rotation
        if (meshes.coolingFan) {
            meshes.coolingFan.rotation.y = time * 10 * speed;
        }
        
        // Load arm vibrations (high frequency, small amplitude) to simulate sliding friction noise
        if (meshes.loadArm) {
            meshes.loadArm.rotation.z = Math.sin(time * 50 * speed) * 0.002;
            meshes.loadArm.rotation.x = Math.cos(time * 40 * speed) * 0.001;
        }

        // Ball rolling (if not fully locked, or just visual vibration)
        if (meshes.ball) {
            meshes.ball.rotation.x = time * -5 * speed; // Spinning against track
        }
        
        // Wear track dynamic formation (simulate deepening/widening)
        animationPhase += 0.01 * speed;
        if (meshes.wearTrack) {
            let scale = 1.0 + Math.sin(animationPhase * 0.5) * 0.1;
            meshes.wearTrack.scale.set(scale, 1, scale);
            meshes.wearTrack.material.color.setHSL(0, 0, 0.3 - Math.sin(animationPhase*0.5)*0.2);
        }

        // Sensor light pulsing based on "friction intensity"
        if (meshes.sensorLight) {
            meshes.sensorLight.material.emissiveIntensity = 2.0 + Math.sin(time * 15 * speed) * 1.5;
        }

        // Laser beam scanning animation (back and forth slightly)
        if (meshes.laserBeam) {
            meshes.laserBeam.position.x = Math.sin(time * 2 * speed) * 0.5;
            meshes.laserBeam.material.emissiveIntensity = 4.0 + Math.random() * 2.0; // Flickering laser
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createBallOnDisk() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
