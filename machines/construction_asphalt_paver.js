import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const meshes = {};
    const parts = [];

    // Helper to add parts
    function registerPart(name, mesh, description, material, func, connections, failEffect, cascade, ox, oy, oz, ex, ey, ez) {
        mesh.name = name;
        meshes[name] = mesh;
        parts.push({
            name,
            description,
            material,
            function: func,
            assemblyOrder: parts.length + 1,
            connections,
            failureEffect: failEffect,
            cascadeFailures: cascade,
            originalPosition: { x: ox, y: oy, z: oz },
            explodedPosition: { x: ex, y: ey, z: ez }
        });
        group.add(mesh);
    }

    const neonOrange = new THREE.MeshStandardMaterial({ color: 0xff5500, emissive: 0xff5500, emissiveIntensity: 2, roughness: 0.2 });
    const neonBlue = new THREE.MeshStandardMaterial({ color: 0x0055ff, emissive: 0x0055ff, emissiveIntensity: 2, roughness: 0.2 });
    const screenMaterial = new THREE.MeshStandardMaterial({ color: 0x003311, emissive: 0x00ff44, emissiveIntensity: 1.5, wireframe: true });
    const hotMetal = new THREE.MeshStandardMaterial({ color: 0xff3300, emissive: 0xff1100, emissiveIntensity: 2.5, metalness: 0.8, roughness: 0.4 });

    // 1. Chassis Core
    const chassisGroup = new THREE.Group();
    const chassisShape = new THREE.Shape();
    chassisShape.moveTo(-3, 0);
    chassisShape.lineTo(4, 0);
    chassisShape.lineTo(4.5, 1);
    chassisShape.lineTo(5, 1);
    chassisShape.lineTo(5, 2.5);
    chassisShape.lineTo(2, 2.5);
    chassisShape.lineTo(1, 3);
    chassisShape.lineTo(-3, 3);
    chassisShape.lineTo(-3, 0);
    
    const extrudeSettings = { depth: 2.6, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.05, bevelThickness: 0.05 };
    const chassisGeo = new THREE.ExtrudeGeometry(chassisShape, extrudeSettings);
    chassisGeo.center();
    const chassisMesh = new THREE.Mesh(chassisGeo, darkSteel);
    chassisMesh.position.set(0, 1.5, 0);
    chassisGroup.add(chassisMesh);

    // Chassis Details (Rivets, grilles)
    for(let i=0; i<40; i++) {
        const rivet = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), chrome);
        rivet.position.set(-2 + (i%10)*0.5, 1.2 + Math.floor(i/10)*0.4, 1.35);
        chassisGroup.add(rivet);
        const rivet2 = rivet.clone();
        rivet2.position.z = -1.35;
        chassisGroup.add(rivet2);
    }

    registerPart('MainChassis', chassisGroup, 'Core structural frame of the asphalt paver housing engine and transmission.', 'darkSteel', 'Provides structural integrity.', ['Engine', 'Hopper', 'Wheels'], 'Complete structural collapse.', ['All Systems'], 0, 0, 0, 0, 5, 0);

    // 2. Receiving Hopper
    const hopperGroup = new THREE.Group();
    // Left Wing
    const wingGeo = new THREE.BoxGeometry(2, 1.5, 0.2);
    const leftWing = new THREE.Mesh(wingGeo, steel);
    leftWing.position.set(3, 1.5, 1.5);
    leftWing.rotation.x = -Math.PI / 4;
    hopperGroup.add(leftWing);
    // Right Wing
    const rightWing = new THREE.Mesh(wingGeo, steel);
    rightWing.position.set(3, 1.5, -1.5);
    rightWing.rotation.x = Math.PI / 4;
    hopperGroup.add(rightWing);
    // Front lip
    const lipGeo = new THREE.CylinderGeometry(0.1, 0.1, 2, 16);
    const lip = new THREE.Mesh(lipGeo, rubber);
    lip.rotation.x = Math.PI/2;
    lip.position.set(4, 0.8, 0);
    hopperGroup.add(lip);

    // Hopper bed
    const bedGeo = new THREE.BoxGeometry(2.5, 0.2, 2.5);
    const bed = new THREE.Mesh(bedGeo, steel);
    bed.position.set(3, 0.9, 0);
    hopperGroup.add(bed);

    registerPart('ReceivingHopper', hopperGroup, 'Hydraulically folding hopper wings that receive asphalt from dump trucks.', 'steel', 'Stores and funnels asphalt mix to conveyors.', ['Chassis', 'Conveyor'], 'Asphalt spillage.', ['Conveyor Starvation'], 0, 0, 0, 4, 2, 5);

    // 3. Conveyor System
    const conveyorGroup = new THREE.Group();
    for (let i = 0; i < 20; i++) {
        const slatGeo = new THREE.BoxGeometry(0.2, 0.05, 1.2);
        const slatLeft = new THREE.Mesh(slatGeo, steel);
        slatLeft.position.set(3 - i*0.25, 0.95, 0.6);
        conveyorGroup.add(slatLeft);
        
        const slatRight = new THREE.Mesh(slatGeo, steel);
        slatRight.position.set(3 - i*0.25, 0.95, -0.6);
        conveyorGroup.add(slatRight);
    }
    // Conveyor Drives
    const driveGeo = new THREE.CylinderGeometry(0.15, 0.15, 2.6, 16);
    const driveMotor = new THREE.Mesh(driveGeo, darkSteel);
    driveMotor.rotation.x = Math.PI/2;
    driveMotor.position.set(-2, 0.95, 0);
    conveyorGroup.add(driveMotor);

    registerPart('DragConveyor', conveyorGroup, 'Dual slat conveyors moving asphalt from hopper to rear augers.', 'steel', 'Transports material continuously.', ['Hopper', 'Auger', 'HydraulicMotors'], 'Material flow stops.', ['Auger Empty', 'Screed Empty'], 0, 0, 0, -2, -2, 4);

    // 4. Rear Distribution Augers
    const augerGroup = new THREE.Group();
    const augerShaftGeo = new THREE.CylinderGeometry(0.1, 0.1, 4, 32);
    const augerShaft = new THREE.Mesh(augerShaftGeo, steel);
    augerShaft.rotation.x = Math.PI/2;
    augerShaft.position.set(-3.2, 0.5, 0);
    augerGroup.add(augerShaft);

    // Complex Auger Flights
    const flightPoints = [];
    for(let i=0; i<=100; i++) {
        const angle = i * 0.5;
        const radius = 0.35;
        flightPoints.push(new THREE.Vector3(0, Math.cos(angle)*radius, Math.sin(angle)*radius));
    }
    const flightPath = new THREE.CatmullRomCurve3(flightPoints);
    const flightGeo = new THREE.TubeGeometry(flightPath, 100, 0.05, 8, false);
    const flightLeft = new THREE.Mesh(flightGeo, steel);
    flightLeft.rotation.y = Math.PI/2;
    flightLeft.position.set(-3.2, 0.5, 1);
    augerGroup.add(flightLeft);
    
    const flightRight = new THREE.Mesh(flightGeo, steel);
    flightRight.rotation.y = Math.PI/2;
    flightRight.position.set(-3.2, 0.5, -1);
    // Mirror the right side flight for spreading outward
    flightRight.scale.set(1, 1, -1);
    augerGroup.add(flightRight);
    
    // Auger Motors
    const augerMotorL = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.4, 16), copper);
    augerMotorL.rotation.x = Math.PI/2;
    augerMotorL.position.set(-3.2, 0.5, 2.2);
    augerGroup.add(augerMotorL);
    
    const augerMotorR = augerMotorL.clone();
    augerMotorR.position.set(-3.2, 0.5, -2.2);
    augerGroup.add(augerMotorR);

    registerPart('DistributionAuger', augerGroup, 'Left and right helical augers that spread asphalt laterally in front of the screed.', 'steel', 'Evenly distributes material across paving width.', ['Conveyor', 'Screed'], 'Uneven paving mat.', ['Screed Defect'], 0, 0, 0, -4, 0, 5);

    // 5. Screed Assembly
    const screedGroup = new THREE.Group();
    const screedMainGeo = new THREE.BoxGeometry(1.5, 0.8, 4.5);
    const screedMain = new THREE.Mesh(screedMainGeo, darkSteel);
    screedMain.position.set(-4.5, 0.4, 0);
    screedGroup.add(screedMain);
    
    // Screed Heaters (glowing)
    const heaterGeo = new THREE.BoxGeometry(1.2, 0.1, 4.2);
    const heater = new THREE.Mesh(heaterGeo, hotMetal);
    heater.position.set(-4.5, 0.05, 0);
    screedGroup.add(heater);
    
    // Screed Extensions (Hydraulic)
    const extLeftGeo = new THREE.BoxGeometry(1.2, 0.6, 1.5);
    const extLeft = new THREE.Mesh(extLeftGeo, steel);
    extLeft.position.set(-4.5, 0.5, 2.8);
    screedGroup.add(extLeft);
    
    const extRight = new THREE.Mesh(extLeftGeo, steel);
    extRight.position.set(-4.5, 0.5, -2.8);
    screedGroup.add(extRight);
    
    // Screed control panels
    const screedPanelGeo = new THREE.BoxGeometry(0.3, 0.5, 0.6);
    const screedPanelL = new THREE.Mesh(screedPanelGeo, plastic);
    screedPanelL.position.set(-4, 1.2, 1.8);
    screedGroup.add(screedPanelL);
    
    const screedScreenL = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.4), screenMaterial);
    screedScreenL.rotation.y = Math.PI/2;
    screedScreenL.position.set(-3.84, 1.2, 1.8);
    screedGroup.add(screedScreenL);

    registerPart('HeatedScreed', screedGroup, 'Heavy, heated floating screed that levels and pre-compacts the asphalt mat.', 'darkSteel', 'Achieves final grade and compaction.', ['Auger', 'ChassisTowingArms'], 'Poor road finish.', ['Paving Failure'], 0, 0, 0, -6, 2, -3);

    // 6. Towing Arms (Hydraulic)
    const towArmGroup = new THREE.Group();
    const armGeo = new THREE.BoxGeometry(3.5, 0.2, 0.2);
    const armL = new THREE.Mesh(armGeo, steel);
    armL.position.set(-2.5, 0.8, 2.3);
    towArmGroup.add(armL);
    
    const armR = new THREE.Mesh(armGeo, steel);
    armR.position.set(-2.5, 0.8, -2.3);
    towArmGroup.add(armR);

    // Tow Cylinders
    const towCylGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 16);
    const towCylL = new THREE.Mesh(towCylGeo, chrome);
    towCylL.rotation.z = Math.PI/4;
    towCylL.position.set(-1.5, 1.2, 2.3);
    towArmGroup.add(towCylL);

    registerPart('TowArms', towArmGroup, 'Massive structural arms connecting screed to chassis. Hydraulically controlled to adjust angle of attack.', 'steel', 'Pulls screed and sets thickness.', ['Screed', 'Chassis', 'Hydraulics'], 'Loss of thickness control.', ['Mat Depth Error'], 0, 0, 0, -3, 3, 4);

    // 7. Rear Drive Wheels (High detail Torus + Lugs)
    const rearWheelsGroup = new THREE.Group();
    function createDriveWheel(zPos) {
        const wheelGrp = new THREE.Group();
        const tireGeo = new THREE.TorusGeometry(0.8, 0.35, 32, 64);
        const tire = new THREE.Mesh(tireGeo, rubber);
        tire.rotation.x = Math.PI/2;
        wheelGrp.add(tire);
        
        // Rim
        const rimGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.6, 32);
        const rim = new THREE.Mesh(rimGeo, chrome);
        rim.rotation.x = Math.PI/2;
        wheelGrp.add(rim);
        
        // Lugs
        const lugGeo = new THREE.BoxGeometry(0.1, 0.85, 0.15);
        for(let i=0; i<36; i++) {
            const angle = (i/36) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeo, rubber);
            lug.position.set(Math.cos(angle)*1.0, Math.sin(angle)*1.0, 0);
            lug.rotation.z = angle;
            wheelGrp.add(lug);
        }
        
        wheelGrp.position.set(-1.5, 1.15, zPos);
        return wheelGrp;
    }
    
    const rearWheelL = createDriveWheel(1.8);
    const rearWheelR = createDriveWheel(-1.8);
    rearWheelsGroup.add(rearWheelL);
    rearWheelsGroup.add(rearWheelR);

    registerPart('DriveWheels', rearWheelsGroup, 'Large hydrostatic drive wheels with high-traction treads.', 'rubber', 'Provides main propulsive force.', ['Chassis', 'Transmission'], 'Loss of mobility.', ['Paving Stops'], 0, 0, 0, 0, -3, 6);

    // 8. Front Bogie Wheels (Multi-wheel steering)
    const frontBogiesGroup = new THREE.Group();
    function createBogieWheel(xPos, zPos) {
        const wheelGrp = new THREE.Group();
        const tire = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.15, 16, 32), rubber);
        tire.rotation.x = Math.PI/2;
        wheelGrp.add(tire);
        const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.25, 16), steel);
        rim.rotation.x = Math.PI/2;
        wheelGrp.add(rim);
        
        // Bogie arm
        const arm = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.5, 0.1), darkSteel);
        arm.position.set(0, 0.3, 0);
        wheelGrp.add(arm);
        
        wheelGrp.position.set(xPos, 0.55, zPos);
        return wheelGrp;
    }
    
    const bogie1L = createBogieWheel(1.5, 1.5);
    const bogie2L = createBogieWheel(2.5, 1.5);
    const bogie1R = createBogieWheel(1.5, -1.5);
    const bogie2R = createBogieWheel(2.5, -1.5);
    
    frontBogiesGroup.add(bogie1L, bogie2L, bogie1R, bogie2R);

    registerPart('BogieSteering', frontBogiesGroup, 'Tandem solid rubber front bogie wheels for precise steering.', 'rubber', 'Steers paver smoothly.', ['Chassis', 'SteeringCylinders'], 'Loss of steering.', ['Directional Error'], 0, 0, 0, 4, -2, -5);

    // 9. Operator Station (Dual seats, sliding console)
    const opStationGroup = new THREE.Group();
    // Deck
    const deckGeo = new THREE.BoxGeometry(2, 0.1, 2.8);
    const deck = new THREE.Mesh(deckGeo, darkSteel);
    deck.position.set(-1.5, 2.5, 0);
    opStationGroup.add(deck);
    
    // Seats
    function createSeat(zPos) {
        const seatGrp = new THREE.Group();
        const bottom = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.1, 0.5), plastic);
        bottom.position.set(0, 0.3, 0);
        seatGrp.add(bottom);
        const back = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.6, 0.5), plastic);
        back.position.set(-0.25, 0.6, 0);
        seatGrp.add(back);
        const armL = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.05, 0.05), plastic);
        armL.position.set(0, 0.5, 0.25);
        seatGrp.add(armL);
        const armR = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.05, 0.05), plastic);
        armR.position.set(0, 0.5, -0.25);
        seatGrp.add(armR);
        seatGrp.position.set(-1.8, 2.5, zPos);
        return seatGrp;
    }
    opStationGroup.add(createSeat(1));
    opStationGroup.add(createSeat(-1));
    
    // Sliding Console
    const consoleGeo = new THREE.BoxGeometry(0.6, 0.8, 0.8);
    const mainConsole = new THREE.Mesh(consoleGeo, plastic);
    mainConsole.position.set(-1.2, 2.9, 0);
    opStationGroup.add(mainConsole);
    
    // Screens on console
    const opScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.3), screenMaterial);
    opScreen.rotation.y = Math.PI/4;
    opScreen.position.set(-0.95, 3.2, 0);
    opStationGroup.add(opScreen);
    
    // Steering Wheel
    const steerWheel = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.02, 8, 16), plastic);
    steerWheel.rotation.y = Math.PI/4;
    steerWheel.position.set(-0.9, 3.0, 0.2);
    opStationGroup.add(steerWheel);
    
    // Joysticks
    const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.02, 0.2, 8), chrome);
    stick.position.set(-1.1, 3.4, -0.2);
    opStationGroup.add(stick);

    registerPart('OperatorStation', opStationGroup, 'High-visibility command center with sliding dual seats and digital displays.', 'plastic', 'Human-machine interface.', ['Chassis', 'Electronics'], 'Loss of machine control.', ['Total Failure'], 0, 0, 0, -2, 6, 0);

    // 10. Canopy & ROPS
    const canopyGroup = new THREE.Group();
    // Posts
    const postGeo = new THREE.CylinderGeometry(0.05, 0.05, 2.5, 8);
    const p1 = new THREE.Mesh(postGeo, steel); p1.position.set(-0.6, 3.75, 1.3); canopyGroup.add(p1);
    const p2 = new THREE.Mesh(postGeo, steel); p2.position.set(-0.6, 3.75, -1.3); canopyGroup.add(p2);
    const p3 = new THREE.Mesh(postGeo, steel); p3.position.set(-2.4, 3.75, 1.3); canopyGroup.add(p3);
    const p4 = new THREE.Mesh(postGeo, steel); p4.position.set(-2.4, 3.75, -1.3); canopyGroup.add(p4);
    
    // Roof
    const roofGeo = new THREE.BoxGeometry(2.2, 0.1, 3.0);
    const roof = new THREE.Mesh(roofGeo, plastic);
    roof.position.set(-1.5, 5.0, 0);
    canopyGroup.add(roof);
    
    // Tinted Glass windshields (partial)
    const glassGeo = new THREE.BoxGeometry(0.02, 0.8, 2.8);
    const windshield = new THREE.Mesh(glassGeo, tinted);
    windshield.position.set(-0.6, 4.5, 0);
    canopyGroup.add(windshield);

    // Strobe lights
    const strobe = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.2, 16), neonOrange);
    strobe.position.set(-1.5, 5.15, 0);
    canopyGroup.add(strobe);

    registerPart('ROPSCanopy', canopyGroup, 'Roll-Over Protective Structure with composite roof, tinted glass, and strobe lights.', 'glass', 'Protects operators from elements and hazards.', ['Chassis', 'OperatorStation'], 'Safety hazard.', ['Warning Triggered'], 0, 0, 0, 0, 8, 0);

    // 11. Engine Compartment
    const engineGroup = new THREE.Group();
    const hoodGeo = new THREE.BoxGeometry(2.5, 1.2, 2.6);
    const hood = new THREE.Mesh(hoodGeo, darkSteel);
    hood.position.set(0.5, 2.1, 0);
    engineGroup.add(hood);
    
    // Cooling Vents
    const ventGeo = new THREE.BoxGeometry(1.5, 0.8, 0.05);
    for(let i=0; i<8; i++) {
        const louvre = new THREE.Mesh(ventGeo, steel);
        louvre.rotation.x = Math.PI/8;
        louvre.position.set(0.5, 2.1 - 0.3 + i*0.1, 1.32);
        engineGroup.add(louvre);
        const louvreR = louvre.clone();
        louvreR.position.z = -1.32;
        louvreR.rotation.x = -Math.PI/8;
        engineGroup.add(louvreR);
    }
    
    // Exhaust Stack
    const exhaustBase = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.5, 16), darkSteel);
    exhaustBase.position.set(1.2, 2.8, 0.8);
    engineGroup.add(exhaustBase);
    const exhaustPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.5, 16), chrome);
    exhaustPipe.position.set(1.2, 3.6, 0.8);
    engineGroup.add(exhaustPipe);
    // Flapper valve
    const flap = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.02, 16), chrome);
    flap.rotation.x = Math.PI/4;
    flap.position.set(1.2, 4.38, 0.85);
    engineGroup.add(flap);

    registerPart('EngineCompartment', engineGroup, 'Houses a high-torque turbo-diesel engine, cooling packages, and exhaust aftertreatment.', 'darkSteel', 'Provides power to all hydraulic systems.', ['Chassis', 'HydraulicPumps'], 'Engine stalls.', ['Total Machine Shutdown'], 0, 0, 0, 2, 5, 2);

    // 12. Hydraulic Pumps & Valve Bank
    const hydroGroup = new THREE.Group();
    const pumpBody = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 1.2), steel);
    pumpBody.position.set(0, 1.5, 0);
    hydroGroup.add(pumpBody);
    
    // Accumulators
    const accGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.5, 16);
    const acc1 = new THREE.Mesh(accGeo, neonBlue);
    acc1.position.set(0.2, 1.9, 0.4);
    hydroGroup.add(acc1);
    const acc2 = new THREE.Mesh(accGeo, neonBlue);
    acc2.position.set(0.2, 1.9, -0.4);
    hydroGroup.add(acc2);

    registerPart('HydraulicPumps', hydroGroup, 'Tandem axial piston pumps providing flow for drive and vibration circuits.', 'steel', 'Generates hydraulic pressure.', ['Engine', 'HydraulicLines'], 'Loss of pressure.', ['Immobilization', 'No Auger'], 0, 0, 0, 2, 0, -4);

    // 13. Hydraulic Lines (Complex TubeGeometry)
    const hLinesGroup = new THREE.Group();
    function createHose(points) {
        const path = new THREE.CatmullRomCurve3(points);
        const hoseGeo = new THREE.TubeGeometry(path, 20, 0.03, 8, false);
        return new THREE.Mesh(hoseGeo, rubber);
    }
    
    const hose1 = createHose([
        new THREE.Vector3(0, 1.7, 0.4),
        new THREE.Vector3(-1, 1.5, 1),
        new THREE.Vector3(-3, 0.8, 1.5),
        new THREE.Vector3(-4, 0.6, 2)
    ]);
    hLinesGroup.add(hose1);
    
    const hose2 = createHose([
        new THREE.Vector3(0, 1.7, -0.4),
        new THREE.Vector3(-1, 1.5, -1),
        new THREE.Vector3(-3, 0.8, -1.5),
        new THREE.Vector3(-4, 0.6, -2)
    ]);
    hLinesGroup.add(hose2);

    for(let i=0; i<5; i++) {
        const h = createHose([
            new THREE.Vector3(0.5, 1.5, 0),
            new THREE.Vector3(1, 1.2, -0.5 + i*0.2),
            new THREE.Vector3(2, 1.0, -0.5 + i*0.2)
        ]);
        hLinesGroup.add(h);
    }

    registerPart('HydraulicLines', hLinesGroup, 'High-pressure multi-layer steel reinforced rubber hoses routing fluid.', 'rubber', 'Transmits hydraulic power.', ['HydraulicPumps', 'Cylinders', 'Motors'], 'Major fluid leak.', ['Loss of specific function', 'Fire hazard'], 0, 0, 0, 0, -2, -3);

    // 14. Washdown System
    const washGroup = new THREE.Group();
    const tankGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.2, 16);
    const washTank = new THREE.Mesh(tankGeo, plastic);
    washTank.rotation.x = Math.PI/2;
    washTank.position.set(-1, 1.8, 1.3);
    washGroup.add(washTank);
    
    // Hose reel
    const reelGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.3, 16);
    const reel = new THREE.Mesh(reelGeo, steel);
    reel.rotation.z = Math.PI/2;
    reel.position.set(-1, 2.2, 1.3);
    washGroup.add(reel);
    
    // Coiled hose
    const coilGeo = new THREE.TorusGeometry(0.18, 0.05, 16, 32);
    const coil = new THREE.Mesh(coilGeo, rubber);
    coil.rotation.y = Math.PI/2;
    coil.position.set(-1, 2.2, 1.3);
    washGroup.add(coil);

    registerPart('WashdownSystem', washGroup, 'Environmental solvent tank and hose reel for cleaning asphalt off components.', 'plastic', 'Maintains machine cleanliness.', ['Chassis'], 'Asphalt hardening on parts.', ['Maintenance Nightmare'], 0, 0, 0, -3, 3, 5);

    // 15. Sonic Grade Sensors
    const sensorGroup = new THREE.Group();
    const sensorBoomGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.5, 8);
    const sBoomL = new THREE.Mesh(sensorBoomGeo, aluminum);
    sBoomL.rotation.x = Math.PI/2;
    sBoomL.position.set(-4.5, 0.8, 3.5);
    sensorGroup.add(sBoomL);
    
    const sensorHead = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.1, 0.15), plastic);
    sensorHead.position.set(-4.5, 0.7, 4.2);
    sensorGroup.add(sensorHead);
    
    const sBoomR = new THREE.Mesh(sensorBoomGeo, aluminum);
    sBoomR.rotation.x = Math.PI/2;
    sBoomR.position.set(-4.5, 0.8, -3.5);
    sensorGroup.add(sBoomR);
    
    const sensorHeadR = sensorHead.clone();
    sensorHeadR.position.set(-4.5, 0.7, -4.2);
    sensorGroup.add(sensorHeadR);
    
    // Glowing sensor beams (visual aid)
    const beamGeo = new THREE.CylinderGeometry(0.01, 0.05, 0.7, 16);
    const beamL = new THREE.Mesh(beamGeo, neonBlue);
    beamL.position.set(-4.5, 0.35, 4.2);
    beamL.material.transparent = true;
    beamL.material.opacity = 0.5;
    sensorGroup.add(beamL);
    
    const beamR = beamL.clone();
    beamR.position.set(-4.5, 0.35, -4.2);
    sensorGroup.add(beamR);

    registerPart('SonicSensors', sensorGroup, 'Non-contact ultra-sonic averaging skis used for multiplex grade control.', 'aluminum', 'Reads ground elevation to automatically adjust screed tow point.', ['Electronics', 'TowArms'], 'Wavy paving surface.', ['Ride Quality Failure'], 0, 0, 0, -5, -2, 6);


    const quizQuestions = [
        {
            question: "What is the primary function of the Heated Screed?",
            options: ["To steer the machine", "To receive asphalt from the truck", "To achieve final grade and pre-compaction of the mat", "To wash the machine"],
            correctAnswer: 2,
            explanation: "The screed floats on the asphalt mix, heating and compressing it to the desired width and depth before the rollers arrive."
        },
        {
            question: "How is asphalt transported from the front Hopper to the rear Auger?",
            options: ["Gravity feed", "Drag Conveyor system", "Pneumatic tubes", "Hydraulic pressure"],
            correctAnswer: 1,
            explanation: "Dual drag slat conveyors run underneath the paver deck to move the asphalt mix steadily to the rear augers."
        },
        {
            question: "What failure cascade occurs if the Distribution Augers fail?",
            options: ["The engine overheats", "The screed gets an uneven flow of material, causing paving defects", "The hopper immediately overflows", "The machine loses steering"],
            correctAnswer: 1,
            explanation: "Augers are critical for spreading the mix evenly across the width of the screed. If they fail, material piles in the center."
        },
        {
            question: "What role do the Sonic Grade Sensors play?",
            options: ["Detecting nearby traffic", "Measuring the temperature of the asphalt", "Non-contact measurement of ground elevation to automate screed tow point adjustment", "Monitoring hydraulic fluid levels"],
            correctAnswer: 2,
            explanation: "Sonic sensors bounce sound waves off a reference (stringline or ground) to continuously adjust the screed angle for a perfectly smooth road."
        },
        {
            question: "Why are the Towing Arms crucial to the paving process?",
            options: ["They tow broken down trucks", "They attach the heavy screed to the chassis and determine the angle of attack for mat thickness", "They fold the hopper wings", "They steer the front bogies"],
            correctAnswer: 1,
            explanation: "By raising or lowering the tow point of the arms, the screed's angle of attack changes, which thickens or thins the laid asphalt mat."
        }
    ];

    function animate(time, speed, meshes) {
        // Rotating tires and bogies
        if (meshes['DriveWheels']) {
            meshes['DriveWheels'].children[0].rotation.z = time * speed * 2;
            meshes['DriveWheels'].children[1].rotation.z = time * speed * 2;
        }
        if (meshes['BogieSteering']) {
            meshes['BogieSteering'].children.forEach(bogie => {
                bogie.children[0].rotation.z = time * speed * 4;
                bogie.children[1].rotation.z = time * speed * 4;
            });
            // Slight steering oscillation
            const steerAngle = Math.sin(time * speed * 0.5) * 0.2;
            meshes['BogieSteering'].children.forEach(bogie => {
                bogie.rotation.y = steerAngle;
            });
        }
        
        // Auger rotation
        if (meshes['DistributionAuger']) {
            meshes['DistributionAuger'].children[0].rotation.z = time * speed * 5; // Shaft
            meshes['DistributionAuger'].children[1].rotation.z = time * speed * 5; // Flight L
            meshes['DistributionAuger'].children[2].rotation.z = time * speed * 5; // Flight R
        }

        // Conveyor visual movement (simulated by pulsing or sliding UVs if textured, here we can slighty vibrate)
        if (meshes['DragConveyor']) {
            const offset = (time * speed * 2) % 0.25;
            for(let i=0; i<20; i++) {
                // Moving slats backwards
                const basePos = 3 - i*0.25;
                let newPos = basePos - offset;
                if (newPos < -2) newPos += 5; 
                meshes['DragConveyor'].children[i*2].position.x = newPos;
                meshes['DragConveyor'].children[i*2 + 1].position.x = newPos;
            }
        }

        // Exhaust Flapper
        if (meshes['EngineCompartment']) {
            const flapper = meshes['EngineCompartment'].children[meshes['EngineCompartment'].children.length-1];
            // random flutter based on time
            flapper.rotation.z = Math.PI/4 + Math.sin(time * speed * 20) * 0.2;
        }

        // Strobe light rotation
        if (meshes['ROPSCanopy']) {
            const strobe = meshes['ROPSCanopy'].children[meshes['ROPSCanopy'].children.length-1];
            strobe.rotation.y = time * speed * 15;
            strobe.material.emissiveIntensity = 2 + Math.sin(time * speed * 15) * 1.5;
        }

        // Sonic sensor pulses
        if (meshes['SonicSensors']) {
            const beamL = meshes['SonicSensors'].children[4];
            const beamR = meshes['SonicSensors'].children[5];
            const pulse = 0.3 + (Math.sin(time * speed * 10) + 1) * 0.3;
            beamL.material.opacity = pulse;
            beamR.material.opacity = pulse;
            beamL.scale.set(1, 1 + pulse*0.5, 1);
            beamR.scale.set(1, 1 + pulse*0.5, 1);
            beamL.position.y = 0.35 - (pulse*0.5*0.35); // keep base at top
            beamR.position.y = 0.35 - (pulse*0.5*0.35);
        }

        // Hopper wings slight movement occasionally
        if (meshes['ReceivingHopper']) {
            const wingAngle = Math.max(0, Math.sin(time * speed * 0.2)) * (Math.PI/6);
            meshes['ReceivingHopper'].children[0].rotation.x = -Math.PI/4 + wingAngle;
            meshes['ReceivingHopper'].children[1].rotation.x = Math.PI/4 - wingAngle;
        }
    }

    return {
        group,
        parts,
        description: "Modern high-capacity Highway Class Asphalt Paver. Equipped with a hydraulic screed, dual drag conveyors, massive distribution augers, multiplex sonic grade control, and heavy crawler/tire traction systems for flawless asphalt mat placement.",
        quizQuestions,
        animate
    };
}
