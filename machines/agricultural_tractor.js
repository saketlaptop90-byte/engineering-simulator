import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom Materials
    const jdGreen = new THREE.MeshStandardMaterial({ color: 0x367C2B, metalness: 0.5, roughness: 0.3 });
    const jdYellow = new THREE.MeshStandardMaterial({ color: 0xFFDE00, metalness: 0.3, roughness: 0.5 });
    const emissionScreen = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 0.8 });
    const ledRed = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 1.5 });
    const ledWhite = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 2.0 });
    const interiorPlastic = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9, metalness: 0.1 });
    const castIron = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.8, metalness: 0.7 });

    // Utility Geometries
    function createCylinder(rT, rB, h, radS, mat) {
        const g = new THREE.CylinderGeometry(rT, rB, h, radS);
        const m = new THREE.Mesh(g, mat);
        m.castShadow = true; m.receiveShadow = true;
        return m;
    }
    function createBox(w, h, d, mat) {
        const g = new THREE.BoxGeometry(w, h, d);
        const m = new THREE.Mesh(g, mat);
        m.castShadow = true; m.receiveShadow = true;
        return m;
    }

    // 1. Chassis
    const chassisGroup = new THREE.Group();
    const chassisExtrude = new THREE.Shape();
    chassisExtrude.moveTo(-3.5, -0.5);
    chassisExtrude.lineTo(2.5, -0.5);
    chassisExtrude.lineTo(3.5, 0.2);
    chassisExtrude.lineTo(3.5, 1.2);
    chassisExtrude.lineTo(-1.0, 1.2);
    chassisExtrude.lineTo(-1.5, 0.8);
    chassisExtrude.lineTo(-3.5, 0.8);
    chassisExtrude.lineTo(-3.5, -0.5);

    const chassisSettings = { depth: 1.4, bevelEnabled: true, bevelSegments: 3, steps: 2, bevelSize: 0.05, bevelThickness: 0.05 };
    const chassisGeo = new THREE.ExtrudeGeometry(chassisExtrude, chassisSettings);
    const chassisMesh = new THREE.Mesh(chassisGeo, castIron);
    chassisMesh.position.set(0, 1.5, -0.7);
    chassisMesh.castShadow = true;
    chassisMesh.receiveShadow = true;
    chassisGroup.add(chassisMesh);

    // Chassis details (rivets, side panels)
    for (let i = 0; i < 10; i++) {
        let rivet1 = createCylinder(0.04, 0.04, 1.5, 8, chrome);
        rivet1.rotation.x = Math.PI / 2;
        rivet1.position.set(-2 + (i * 0.5), 2.2, 0);
        chassisGroup.add(rivet1);
    }
    
    group.add(chassisGroup);
    meshes.chassis = chassisGroup;
    parts.push({
        name: "Main Cast Iron Chassis",
        description: "Massive reinforced cast iron backbone of the tractor, integrating the transmission housing.",
        material: "castIron",
        function: "Structural integrity and mounting point for all components.",
        assemblyOrder: 1,
        connections: ["EngineBlock", "FrontAxle", "RearAxle", "Cabin"],
        failureEffect: "Complete mechanical collapse.",
        cascadeFailures: ["Transmission", "Drivetrain"],
        originalPosition: { x: 0, y: 1.5, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 }
    });

    // 2. Engine Block (High-Detail)
    const engineGroup = new THREE.Group();
    const engineCore = createBox(2.2, 1.2, 1.0, aluminum);
    engineCore.position.set(0, 0, 0);
    engineGroup.add(engineCore);

    // Pistons & Cylinders (Inline 6)
    for (let i = 0; i < 6; i++) {
        const cyl = createCylinder(0.18, 0.18, 1.4, 16, darkSteel);
        cyl.position.set(-0.8 + (i * 0.32), 0.7, 0);
        engineGroup.add(cyl);

        const valve = createCylinder(0.1, 0.1, 1.6, 16, copper);
        valve.position.set(-0.8 + (i * 0.32), 0.8, 0);
        engineGroup.add(valve);
        
        // Injectors
        const inj = createBox(0.05, 0.4, 0.05, steel);
        inj.position.set(-0.8 + (i * 0.32), 1.2, 0.1);
        engineGroup.add(inj);
    }

    // Cooling Fan
    const fanGroup = new THREE.Group();
    const fanHub = createCylinder(0.1, 0.1, 0.2, 16, darkSteel);
    fanHub.rotation.z = Math.PI / 2;
    fanGroup.add(fanHub);
    for (let i = 0; i < 8; i++) {
        const blade = createBox(0.8, 0.05, 0.2, plastic);
        blade.position.x = Math.cos((i / 8) * Math.PI * 2) * 0.4;
        blade.position.y = Math.sin((i / 8) * Math.PI * 2) * 0.4;
        blade.rotation.z = (i / 8) * Math.PI * 2;
        blade.rotation.x = Math.PI / 6;
        fanGroup.add(blade);
    }
    fanGroup.position.set(1.2, 0.3, 0);
    engineGroup.add(fanGroup);
    meshes.coolingFan = fanGroup;

    // Turbocharger
    const turbo = new THREE.Group();
    const turboHousing = createTorus(0.15, 0.1, 16, 32, castIron);
    turboHousing.rotation.x = Math.PI / 2;
    turbo.add(turboHousing);
    const turboIntake = createCylinder(0.1, 0.1, 0.5, 16, steel);
    turboIntake.position.set(0, 0.25, 0);
    turbo.add(turboIntake);
    turbo.position.set(-0.5, 0.8, 0.6);
    engineGroup.add(turbo);

    engineGroup.position.set(2.0, 2.5, 0);
    group.add(engineGroup);
    meshes.engine = engineGroup;
    parts.push({
        name: "9.0L 6-Cylinder Turbo Diesel Engine",
        description: "High-pressure common rail diesel engine delivering 400 HP for immense pulling power.",
        material: "aluminum / castIron",
        function: "Generates primary kinetic power for drivetrain and PTO.",
        assemblyOrder: 2,
        connections: ["Chassis", "Turbocharger", "CoolingSystem"],
        failureEffect: "Total loss of locomotive and implement power.",
        cascadeFailures: ["HydraulicPump", "Alternator"],
        originalPosition: { x: 2.0, y: 2.5, z: 0 },
        explodedPosition: { x: 2.0, y: 5, z: 0 }
    });

    // 3. Hood & Grille
    const hoodGroup = new THREE.Group();
    const hoodShape = new THREE.Shape();
    hoodShape.moveTo(0, 0);
    hoodShape.lineTo(2.8, 0);
    hoodShape.lineTo(2.8, -0.6);
    hoodShape.lineTo(0.2, -0.8);
    hoodShape.lineTo(0, 0);
    
    const hoodGeo = new THREE.ExtrudeGeometry(hoodShape, { depth: 1.2, bevelEnabled: true, bevelSize: 0.1 });
    const hood = new THREE.Mesh(hoodGeo, jdGreen);
    hood.position.set(0.5, 3.8, -0.6);
    hoodGroup.add(hood);
    
    // Front Grille
    const grille = createBox(0.2, 1.1, 1.0, darkSteel);
    grille.position.set(3.4, 3.2, 0);
    hoodGroup.add(grille);
    
    // Headlights
    const hl1 = createCylinder(0.15, 0.15, 0.1, 16, ledWhite);
    hl1.rotation.z = Math.PI / 2;
    hl1.position.set(3.45, 3.4, 0.3);
    hoodGroup.add(hl1);
    const hl2 = createCylinder(0.15, 0.15, 0.1, 16, ledWhite);
    hl2.rotation.z = Math.PI / 2;
    hl2.position.set(3.45, 3.4, -0.3);
    hoodGroup.add(hl2);

    group.add(hoodGroup);
    meshes.hood = hoodGroup;
    parts.push({
        name: "Aerodynamic Composite Hood",
        description: "Protective shell covering the engine bay, designed with optimal airflow grilles for cooling.",
        material: "Composite / jdGreen",
        function: "Aerodynamics and debris protection for engine bay.",
        assemblyOrder: 3,
        connections: ["Chassis", "EngineBlock"],
        failureEffect: "Engine exposed to elements and debris.",
        cascadeFailures: ["CoolingFan", "AirFilter"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 6, z: 0 }
    });

    // 4. Exhaust Stack
    const exhaustGroup = new THREE.Group();
    const exhaustPipe = createCylinder(0.12, 0.12, 2.5, 16, chrome);
    exhaustPipe.position.set(1.2, 4.5, 0.7);
    exhaustGroup.add(exhaustPipe);
    
    const exhaustFlap = createBox(0.28, 0.02, 0.28, darkSteel);
    exhaustFlap.position.set(1.2, 5.75, 0.7);
    exhaustFlap.rotation.z = -Math.PI / 6;
    exhaustGroup.add(exhaustFlap);
    meshes.exhaustFlap = exhaustFlap;
    
    group.add(exhaustGroup);
    meshes.exhaust = exhaustGroup;
    parts.push({
        name: "Chrome Vertical Exhaust Stack",
        description: "Directs exhaust gases above the cabin. Features a dynamic rain flap.",
        material: "chrome",
        function: "Emissions venting.",
        assemblyOrder: 4,
        connections: ["EngineBlock", "Turbocharger"],
        failureEffect: "Exhaust vents into cabin or engine bay.",
        cascadeFailures: ["CabinAirFilter"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 1.2, y: 8, z: 0 }
    });

    // 5. Operator Cabin (Highly Detailed)
    const cabinGroup = new THREE.Group();
    // Cab Frame
    const frameMat = darkSteel;
    const p1 = createBox(0.1, 2.5, 0.1, frameMat); p1.position.set(-2.5, 4, 0.8); cabinGroup.add(p1);
    const p2 = createBox(0.1, 2.5, 0.1, frameMat); p2.position.set(-0.5, 4, 0.8); cabinGroup.add(p2);
    const p3 = createBox(0.1, 2.5, 0.1, frameMat); p3.position.set(-2.5, 4, -0.8); cabinGroup.add(p3);
    const p4 = createBox(0.1, 2.5, 0.1, frameMat); p4.position.set(-0.5, 4, -0.8); cabinGroup.add(p4);
    
    const roof = createBox(2.4, 0.2, 1.8, jdGreen);
    roof.position.set(-1.5, 5.3, 0);
    cabinGroup.add(roof);

    // Glass Windows
    const fWindow = createBox(0.05, 2.3, 1.5, tinted); fWindow.position.set(-0.5, 4, 0); cabinGroup.add(fWindow);
    const bWindow = createBox(0.05, 2.3, 1.5, tinted); bWindow.position.set(-2.5, 4, 0); cabinGroup.add(bWindow);
    const lWindow = createBox(1.9, 2.3, 0.05, tinted); lWindow.position.set(-1.5, 4, 0.8); cabinGroup.add(lWindow);
    const rWindow = createBox(1.9, 2.3, 0.05, tinted); rWindow.position.set(-1.5, 4, -0.8); cabinGroup.add(rWindow);

    // Interior
    const seatBase = createBox(0.6, 0.4, 0.6, interiorPlastic);
    seatBase.position.set(-1.8, 3.0, 0);
    cabinGroup.add(seatBase);
    const seatCushion = createBox(0.5, 0.2, 0.5, rubber);
    seatCushion.position.set(-1.8, 3.3, 0);
    cabinGroup.add(seatCushion);
    const seatBack = createBox(0.1, 0.8, 0.5, rubber);
    seatBack.position.set(-2.0, 3.7, 0);
    cabinGroup.add(seatBack);
    
    // Steering & Controls
    const steeringCol = createCylinder(0.08, 0.08, 0.8, 16, darkSteel);
    steeringCol.rotation.z = -Math.PI / 4;
    steeringCol.position.set(-1.1, 3.4, 0);
    cabinGroup.add(steeringCol);
    const steeringWheel = createTorus(0.25, 0.04, 16, 32, plastic);
    steeringWheel.rotation.y = Math.PI / 2;
    steeringWheel.rotation.x = Math.PI / 4;
    steeringWheel.position.set(-0.85, 3.7, 0);
    cabinGroup.add(steeringWheel);
    meshes.steeringWheel = steeringWheel;

    // Glowing Monitors
    const monitor1 = createBox(0.05, 0.4, 0.6, interiorPlastic);
    monitor1.position.set(-0.7, 3.8, -0.5);
    monitor1.rotation.y = Math.PI / 6;
    cabinGroup.add(monitor1);
    const screen1 = createBox(0.06, 0.35, 0.55, emissionScreen);
    screen1.position.set(-0.69, 3.8, -0.5);
    screen1.rotation.y = Math.PI / 6;
    cabinGroup.add(screen1);
    
    // Joystick Armrest Console
    const armrest = createBox(0.6, 0.2, 0.3, interiorPlastic);
    armrest.position.set(-1.6, 3.4, 0.4);
    cabinGroup.add(armrest);
    const joystickBase = createCylinder(0.05, 0.05, 0.1, 16, rubber);
    joystickBase.position.set(-1.4, 3.5, 0.4);
    cabinGroup.add(joystickBase);
    const joystickHandle = createCylinder(0.03, 0.03, 0.2, 16, plastic);
    joystickHandle.position.set(-1.4, 3.65, 0.4);
    cabinGroup.add(joystickHandle);
    meshes.joystick = joystickHandle;

    group.add(cabinGroup);
    meshes.cabin = cabinGroup;
    parts.push({
        name: "CommandView Cab",
        description: "Ergonomic operator environment with tinted safety glass, dual touchscreens, and joystick controls.",
        material: "steel/glass/plastic",
        function: "Operator comfort and machine interface.",
        assemblyOrder: 5,
        connections: ["Chassis", "ElectricalSystem"],
        failureEffect: "Operator exposure to noise, vibration, and elements.",
        cascadeFailures: ["Controls"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -4, y: 7, z: 0 }
    });

    // 6. Tires & Axles Construction
    function createTractorTire(radius, tube, lugCount, lugWidth, lugHeight, lugDepth, rimRadius) {
        const tireGroup = new THREE.Group();
        
        // Torus Tire Base
        const tireGeo = new THREE.TorusGeometry(radius, tube, 32, 128);
        const tire = new THREE.Mesh(tireGeo, rubber);
        tire.rotation.x = Math.PI / 2;
        tireGroup.add(tire);
        
        // Complex Tread Lugs
        for (let i = 0; i < lugCount; i++) {
            const angle = (i / lugCount) * Math.PI * 2;
            const dist = radius + tube * 0.85;
            
            // Left chevron
            const lugL = createBox(lugDepth, lugHeight, lugWidth, rubber);
            lugL.position.set(Math.cos(angle) * dist, Math.sin(angle) * dist, tube * 0.4);
            lugL.rotation.z = angle;
            lugL.rotation.y = Math.PI / 6;
            lugL.rotation.x = Math.PI / 2;
            tireGroup.add(lugL);

            // Right chevron
            const angleR = angle + (Math.PI / lugCount);
            const lugR = createBox(lugDepth, lugHeight, lugWidth, rubber);
            lugR.position.set(Math.cos(angleR) * dist, Math.sin(angleR) * dist, -tube * 0.4);
            lugR.rotation.z = angleR;
            lugR.rotation.y = -Math.PI / 6;
            lugR.rotation.x = Math.PI / 2;
            tireGroup.add(lugR);
        }
        
        // Rim structure
        const rimGeo = new THREE.CylinderGeometry(rimRadius, rimRadius, tube * 1.5, 32);
        const rim = new THREE.Mesh(rimGeo, jdYellow);
        rim.rotation.x = Math.PI / 2;
        tireGroup.add(rim);
        
        const rimInner = new THREE.CylinderGeometry(rimRadius * 0.8, rimRadius * 0.8, tube * 1.6, 32);
        const rimIMesh = new THREE.Mesh(rimInner, jdGreen);
        rimIMesh.rotation.x = Math.PI / 2;
        tireGroup.add(rimIMesh);
        
        // Wheel Hub and Axle Connector
        const hub = createCylinder(rimRadius * 0.3, rimRadius * 0.3, tube * 1.8, 16, castIron);
        hub.rotation.x = Math.PI / 2;
        tireGroup.add(hub);
        
        // Lug Nuts
        for(let i=0; i<12; i++) {
            const lnA = (i/12) * Math.PI * 2;
            const ln = createCylinder(0.04, 0.04, tube * 1.9, 8, chrome);
            ln.rotation.x = Math.PI / 2;
            ln.position.set(Math.cos(lnA) * rimRadius * 0.4, Math.sin(lnA) * rimRadius * 0.4, 0);
            tireGroup.add(ln);
        }
        return tireGroup;
    }

    // Rear Axle
    const rearAxle = createCylinder(0.2, 0.2, 3.0, 16, castIron);
    rearAxle.rotation.x = Math.PI / 2;
    rearAxle.position.set(-2.0, 1.8, 0);
    group.add(rearAxle);

    // Massive Rear Tires
    const rearWheelL = createTractorTire(1.6, 0.6, 40, 0.8, 0.15, 0.15, 1.0);
    rearWheelL.position.set(-2.0, 1.8, 1.8);
    group.add(rearWheelL);
    meshes.rearWheelL = rearWheelL;
    
    const rearWheelR = createTractorTire(1.6, 0.6, 40, 0.8, 0.15, 0.15, 1.0);
    rearWheelR.position.set(-2.0, 1.8, -1.8);
    group.add(rearWheelR);
    meshes.rearWheelR = rearWheelR;

    parts.push({
        name: "Massive Dual Rear Drive Tires",
        description: "R-1W radial agricultural tires with deep aggressive chevron treads for maximum soil traction.",
        material: "rubber / castIron",
        function: "Transfers transmission torque to the ground.",
        assemblyOrder: 6,
        connections: ["RearAxle"],
        failureEffect: "Complete loss of traction and mobility.",
        cascadeFailures: ["AxleBearings"],
        originalPosition: { x: -2.0, y: 1.8, z: 1.8 },
        explodedPosition: { x: -2.0, y: 1.8, z: 4.5 }
    });

    // Front Axle
    const frontAxleBase = createBox(0.4, 0.4, 2.2, castIron);
    frontAxleBase.position.set(2.5, 1.2, 0);
    group.add(frontAxleBase);
    
    const frontWheelL = createTractorTire(0.9, 0.35, 30, 0.5, 0.1, 0.1, 0.6);
    frontWheelL.position.set(2.5, 1.2, 1.3);
    group.add(frontWheelL);
    meshes.frontWheelL = frontWheelL;
    
    const frontWheelR = createTractorTire(0.9, 0.35, 30, 0.5, 0.1, 0.1, 0.6);
    frontWheelR.position.set(2.5, 1.2, -1.3);
    group.add(frontWheelR);
    meshes.frontWheelR = frontWheelR;

    parts.push({
        name: "MFWD Front Axle & Tires",
        description: "Mechanical Front Wheel Drive axle offering active steering and secondary traction.",
        material: "castIron/rubber",
        function: "Directional steering and front pulling power.",
        assemblyOrder: 7,
        connections: ["Chassis", "SteeringCylinders"],
        failureEffect: "Loss of steering control.",
        cascadeFailures: ["HydraulicLines"],
        originalPosition: { x: 2.5, y: 1.2, z: 1.3 },
        explodedPosition: { x: 2.5, y: 1.2, z: 3.5 }
    });

    // 7. PTO Shaft (Power Take-Off)
    const ptoGroup = new THREE.Group();
    const ptoHousing = createBox(0.6, 0.6, 0.6, castIron);
    ptoGroup.add(ptoHousing);
    
    const ptoShaft = createCylinder(0.08, 0.08, 0.8, 16, chrome);
    ptoShaft.rotation.z = Math.PI / 2;
    ptoShaft.position.set(-0.4, 0, 0);
    ptoGroup.add(ptoShaft);
    meshes.ptoShaft = ptoShaft;
    
    // Splines on PTO
    for(let i=0; i<6; i++) {
        const spline = createBox(0.8, 0.02, 0.02, steel);
        spline.position.set(-0.4, Math.cos((i/6)*Math.PI*2)*0.08, Math.sin((i/6)*Math.PI*2)*0.08);
        ptoGroup.add(spline);
        meshes[`ptoSpline_${i}`] = spline;
    }
    
    ptoGroup.position.set(-3.5, 1.5, 0);
    group.add(ptoGroup);
    meshes.ptoGroup = ptoGroup;

    parts.push({
        name: "1000 RPM PTO Shaft",
        description: "Rear 1-3/4 inch 20-spline Power Take-Off transferring engine power to attached implements.",
        material: "chrome / steel",
        function: "Drives mechanical attachments like balers and mowers.",
        assemblyOrder: 8,
        connections: ["Transmission", "Implements"],
        failureEffect: "Unable to operate mechanized implements.",
        cascadeFailures: ["ImplementDriveline"],
        originalPosition: { x: -3.5, y: 1.5, z: 0 },
        explodedPosition: { x: -6, y: 1.5, z: 0 }
    });

    // 8. 3-Point Hitch System (Hydraulic)
    const hitchGroup = new THREE.Group();
    
    // Top Link
    const topLink = createCylinder(0.06, 0.06, 1.2, 16, darkSteel);
    topLink.rotation.z = Math.PI / 2;
    topLink.position.set(-0.6, 0.8, 0);
    hitchGroup.add(topLink);
    
    // Lower Lift Arms
    const leftArm = createBox(1.5, 0.15, 0.05, jdGreen);
    leftArm.position.set(-0.75, 0, 0.5);
    leftArm.rotation.z = -Math.PI / 12;
    hitchGroup.add(leftArm);
    
    const rightArm = createBox(1.5, 0.15, 0.05, jdGreen);
    rightArm.position.set(-0.75, 0, -0.5);
    rightArm.rotation.z = -Math.PI / 12;
    hitchGroup.add(rightArm);
    
    // Hydraulic Lift Cylinders for the arms
    const liftCylL = createCylinder(0.1, 0.1, 0.8, 16, steel);
    liftCylL.position.set(-0.3, 0.5, 0.4);
    liftCylL.rotation.z = -Math.PI / 6;
    hitchGroup.add(liftCylL);
    
    const liftPistonL = createCylinder(0.05, 0.05, 0.8, 16, chrome);
    liftPistonL.position.set(-0.5, 0.2, 0.45);
    liftPistonL.rotation.z = -Math.PI / 6;
    hitchGroup.add(liftPistonL);
    meshes.liftPistonL = liftPistonL;

    const liftCylR = createCylinder(0.1, 0.1, 0.8, 16, steel);
    liftCylR.position.set(-0.3, 0.5, -0.4);
    liftCylR.rotation.z = -Math.PI / 6;
    hitchGroup.add(liftCylR);
    
    const liftPistonR = createCylinder(0.05, 0.05, 0.8, 16, chrome);
    liftPistonR.position.set(-0.5, 0.2, -0.45);
    liftPistonR.rotation.z = -Math.PI / 6;
    hitchGroup.add(liftPistonR);
    meshes.liftPistonR = liftPistonR;

    hitchGroup.position.set(-3.5, 1.2, 0);
    group.add(hitchGroup);
    meshes.hitchGroup = hitchGroup;

    parts.push({
        name: "Hydraulic 3-Point Hitch",
        description: "Category 4N/3 rear hitch with enormous lifting capacity, controlled by dual hydraulic cylinders.",
        material: "steel / jdGreen",
        function: "Raises, lowers, and stabilizes heavy ground-engaging implements.",
        assemblyOrder: 9,
        connections: ["Chassis", "HydraulicPump", "Implement"],
        failureEffect: "Implement drops to ground; unable to lift or control depth.",
        cascadeFailures: ["HydraulicLines", "TopLink"],
        originalPosition: { x: -3.5, y: 1.2, z: 0 },
        explodedPosition: { x: -5.5, y: 0.5, z: 0 }
    });

    // 9. Hydraulic Remote Valves & Lines
    const hydraulics = new THREE.Group();
    for(let i=0; i<4; i++) {
        // SCV (Selective Control Valve) ports
        const port = createCylinder(0.05, 0.05, 0.2, 16, aluminum);
        port.rotation.z = Math.PI / 2;
        port.position.set(0, (i*0.15), 0.3);
        hydraulics.add(port);
        const portCap = createCylinder(0.06, 0.06, 0.05, 16, plastic); // Colored caps
        portCap.rotation.z = Math.PI / 2;
        portCap.position.set(-0.1, (i*0.15), 0.3);
        portCap.material = new THREE.MeshStandardMaterial({color: (i%2===0)?0xff0000:0x00ff00});
        hydraulics.add(portCap);

        // Tubes running from pump to valves
        const tubePath = new THREE.CatmullRomCurve3([
            new THREE.Vector3(2.0, -0.5, 0.2), // From engine pump
            new THREE.Vector3(1.0, -0.5, 0.2 + (i*0.05)),
            new THREE.Vector3(0.5, 0.5, 0.3 + (i*0.05)),
            new THREE.Vector3(0, (i*0.15), 0.3)
        ]);
        const tubeGeo = new THREE.TubeGeometry(tubePath, 20, 0.02, 8, false);
        const tubeMesh = new THREE.Mesh(tubeGeo, rubber);
        hydraulics.add(tubeMesh);
    }
    hydraulics.position.set(-3.5, 2.0, 0.4);
    group.add(hydraulics);

    parts.push({
        name: "Hydraulic SCV Block & Lines",
        description: "Four rear Selective Control Valves (SCV) powered by a 60 GPM axial flow hydraulic pump.",
        material: "aluminum / rubber",
        function: "Supplies high-pressure hydraulic fluid to implement cylinders.",
        assemblyOrder: 10,
        connections: ["HydraulicPump", "ImplementHoses"],
        failureEffect: "Loss of implement hydraulic functions.",
        cascadeFailures: ["PumpOverheating"],
        originalPosition: { x: -3.5, y: 2.0, z: 0.4 },
        explodedPosition: { x: -4.5, y: 3.5, z: 1.5 }
    });

    // 10. Front Weight Bracket
    const weightGroup = new THREE.Group();
    const bracket = createBox(0.5, 0.6, 1.2, castIron);
    weightGroup.add(bracket);
    // Individual suitcase weights
    for(let i=0; i<14; i++) {
        const weight = createBox(0.4, 0.5, 0.08, jdGreen);
        weight.position.set(0.1, 0.1, -0.65 + (i*0.1));
        weightGroup.add(weight);
    }
    weightGroup.position.set(4.0, 1.2, 0);
    group.add(weightGroup);

    parts.push({
        name: "Front Suitcase Weights",
        description: "1000kg of modular front ballast weights to counter-balance heavy rear implements.",
        material: "castIron",
        function: "Maintains steering traction and prevents front-end lift.",
        assemblyOrder: 11,
        connections: ["Chassis"],
        failureEffect: "Loss of front traction; steering failure under heavy draft loads.",
        cascadeFailures: ["FrontAxleSlip"],
        originalPosition: { x: 4.0, y: 1.2, z: 0 },
        explodedPosition: { x: 6.0, y: 1.2, z: 0 }
    });

    // Detailed Work Lights / Beacons
    const beacon = createCylinder(0.08, 0.08, 0.15, 16, new THREE.MeshStandardMaterial({color: 0xffaa00, emissive: 0xffaa00, emissiveIntensity: 2, transparent: true, opacity: 0.8}));
    beacon.position.set(-1.5, 5.5, 0.9);
    cabinGroup.add(beacon);
    meshes.beacon = beacon;

    // Quiz Questions
    const quizQuestions = [
        {
            question: "What geometry technique is used to model the complex aggressive lugs on the massive rear tractor tires?",
            options: [
                "Only standard BoxGeometry",
                "TorusGeometry base with radially arrayed BoxGeometry chevrons",
                "ExtrudeGeometry across the whole wheel",
                "LatheGeometry with noise"
            ],
            correctAnswer: 1,
            explanation: "The tires combine a TorusGeometry for the inner inflated tube structure and dozens of precisely calculated BoxGeometry lugs rotated around the circumference to form the V-shaped chevron treads."
        },
        {
            question: "What is the primary function of the 3-Point Hitch modeled at the rear?",
            options: [
                "To steer the tractor",
                "To raise, lower, and stabilize heavy ground-engaging implements",
                "To vent exhaust gases",
                "To provide front ballast"
            ],
            correctAnswer: 1,
            explanation: "The 3-point hitch connects implements to the tractor and uses hydraulic lift cylinders to precisely control their height and depth in the soil."
        },
        {
            question: "Why are suitcase weights mounted to the front bracket of the chassis?",
            options: [
                "For aesthetic purposes",
                "To cool the engine",
                "To counter-balance heavy rear implements and maintain front tire traction",
                "To protect the headlights"
            ],
            correctAnswer: 2,
            explanation: "When heavy implements are lifted on the rear hitch, the tractor can tip backward. Front weights keep the nose down to ensure the steering tires have grip."
        },
        {
            question: "Which component rotates at 1000 RPM to mechanically power attached equipment like balers?",
            options: [
                "The turbocharger",
                "The cooling fan",
                "The PTO (Power Take-Off) Shaft",
                "The steering column"
            ],
            correctAnswer: 2,
            explanation: "The PTO shaft protrudes from the rear and transfers engine power directly to the driveline of mechanized implements."
        },
        {
            question: "How do the Selective Control Valves (SCV) function in the hydraulic system?",
            options: [
                "They control the flow of diesel to the engine",
                "They route high-pressure hydraulic fluid to operate external cylinders on implements",
                "They filter the cabin air",
                "They manage the electrical battery voltage"
            ],
            correctAnswer: 1,
            explanation: "The SCVs act as directional valves, taking pressurized fluid from the tractor's main pump and sending it through hoses to expand or retract cylinders on an attached plow or planter."
        }
    ];

    // Animation function
    function animate(time, speed, meshesObj) {
        // Move forward by rotating wheels
        const wheelRotSpeed = speed * 2;
        if (meshesObj.rearWheelL) meshesObj.rearWheelL.rotation.y -= wheelRotSpeed * 0.05;
        if (meshesObj.rearWheelR) meshesObj.rearWheelR.rotation.y -= wheelRotSpeed * 0.05;
        // Front wheels rotate faster due to smaller diameter
        if (meshesObj.frontWheelL) meshesObj.frontWheelL.rotation.y -= wheelRotSpeed * 0.088;
        if (meshesObj.frontWheelR) meshesObj.frontWheelR.rotation.y -= wheelRotSpeed * 0.088;
        
        // Engine cooling fan spin
        if (meshesObj.coolingFan) meshesObj.coolingFan.rotation.x += speed * 0.5;

        // PTO Shaft high-speed spin
        if (meshesObj.ptoShaft) meshesObj.ptoShaft.rotation.x += speed * 0.8;
        for(let i=0; i<6; i++) {
            if (meshesObj[`ptoSpline_${i}`]) {
                meshesObj[`ptoSpline_${i}`].rotation.x += speed * 0.8;
            }
        }

        // Exhaust flap bounce
        if (meshesObj.exhaustFlap) {
            meshesObj.exhaustFlap.rotation.z = -Math.PI/6 + Math.sin(time * 20) * 0.1;
        }

        // Rotating Beacon light
        if (meshesObj.beacon) {
            meshesObj.beacon.material.emissiveIntensity = 1.5 + Math.sin(time * 15) * 1.5;
        }

        // Hydraulic 3-point hitch slight vertical bounce (simulating draft load compensation)
        if (meshesObj.hitchGroup) {
            meshesObj.hitchGroup.rotation.z = Math.sin(time * 2) * 0.02;
            // Piston extension simulation
            if (meshesObj.liftPistonL) meshesObj.liftPistonL.position.x = -0.5 - Math.sin(time * 2) * 0.05;
            if (meshesObj.liftPistonR) meshesObj.liftPistonR.position.x = -0.5 - Math.sin(time * 2) * 0.05;
        }
        
        // Joystick micro movements
        if (meshesObj.joystick) {
            meshesObj.joystick.rotation.x = Math.sin(time * 5) * 0.1;
            meshesObj.joystick.rotation.z = Math.cos(time * 4) * 0.1;
        }
    }

    return {
        group,
        parts,
        description: "An incredibly advanced, high-horsepower Modern Agricultural Tractor. Features massive dual rear tires, an intricate inline-6 turbo diesel engine, functional PTO, hydraulic SCV ports, and a fully modeled ergonomic cabin.",
        quizQuestions,
        animate,
        meshes
    };
}

// Auto-generated missing stub
export function createAgriculturalTractor() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
