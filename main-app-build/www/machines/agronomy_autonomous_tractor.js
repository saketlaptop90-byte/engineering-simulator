import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom high-tech emissive materials for realism
    const neonBlue = new THREE.MeshStandardMaterial({ color: 0x0088ff, emissive: 0x0088ff, emissiveIntensity: 2, roughness: 0.2 });
    const neonRed = new THREE.MeshStandardMaterial({ color: 0xff0044, emissive: 0xff0044, emissiveIntensity: 2, roughness: 0.2 });
    const screenMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 1.5 });
    const headlightMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 3 });
    const tailLightMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xaa0000, emissiveIntensity: 2 });

    // ==========================================
    // HELPER FUNCTIONS FOR COMPLEX GEOMETRIES
    // ==========================================

    // Helper: Highly detailed Wheel Generator with aggressive treads
    function createWheel(radius, width, rimRadius, treadCount) {
        const wheelGroup = new THREE.Group();
        
        // Main tire body (Torus)
        const tireGeo = new THREE.TorusGeometry(radius - width/2, width/2, 32, 64);
        const tire = new THREE.Mesh(tireGeo, rubber);
        tire.rotation.y = Math.PI / 2;
        wheelGroup.add(tire);
        
        // Aggressive off-road treads (Chevron pattern)
        const treadGeo = new THREE.BoxGeometry(width * 1.1, width/3, width/2);
        for(let i=0; i<treadCount; i++) {
            const angle = (i / treadCount) * Math.PI * 2;
            const tread = new THREE.Mesh(treadGeo, rubber);
            tread.position.set(0, Math.cos(angle) * radius, Math.sin(angle) * radius);
            tread.rotation.x = -angle;
            // Alternating angles for chevron traction pattern
            tread.rotation.z = Math.PI/8 * (i % 2 === 0 ? 1 : -1); 
            wheelGroup.add(tread);
        }

        // Detailed Rim
        const rimGeo = new THREE.CylinderGeometry(rimRadius, rimRadius, width*0.8, 32);
        const rim = new THREE.Mesh(rimGeo, chrome);
        rim.rotation.z = Math.PI / 2;
        wheelGroup.add(rim);

        // Complex Spoke Array
        const spokeGeo = new THREE.CylinderGeometry(rimRadius * 0.08, rimRadius * 0.05, rimRadius * 2, 16);
        for(let i=0; i<6; i++) {
            const spoke = new THREE.Mesh(spokeGeo, steel);
            spoke.rotation.x = (i / 6) * Math.PI;
            rim.add(spoke);
        }

        // Inner structural hub
        const hubGeo = new THREE.CylinderGeometry(rimRadius * 0.25, rimRadius * 0.25, width * 0.9, 32);
        const hub = new THREE.Mesh(hubGeo, darkSteel);
        hub.rotation.z = Math.PI / 2;
        wheelGroup.add(hub);

        // Lug nuts
        const lugGeo = new THREE.CylinderGeometry(0.04, 0.04, width * 0.95, 8);
        for(let i=0; i<8; i++) {
            const lugAngle = (i / 8) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeo, steel);
            lug.position.set(0, Math.cos(lugAngle)*rimRadius*0.4, Math.sin(lugAngle)*rimRadius*0.4);
            lug.rotation.z = Math.PI/2;
            wheelGroup.add(lug);
        }

        return wheelGroup;
    }

    // Helper: Extruded profile for custom chassis shapes
    function createExtrudedProfile(points, depth, material) {
        const shape = new THREE.Shape();
        if (points.length > 0) {
            shape.moveTo(points[0].x, points[0].y);
            for(let i=1; i<points.length; i++) {
                shape.lineTo(points[i].x, points[i].y);
            }
            shape.lineTo(points[0].x, points[0].y); // close path
        }
        const extrudeSettings = { depth: depth, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.08, bevelThickness: 0.08 };
        const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const mesh = new THREE.Mesh(geo, material);
        mesh.position.z = -depth/2; // center along z
        return mesh;
    }

    // Helper: Create Suspension Springs
    function createSpring(radius, height, coils, material) {
        class SpringCurve extends THREE.Curve {
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                const x = radius * Math.cos(t * Math.PI * 2 * coils);
                const y = height * (t - 0.5);
                const z = radius * Math.sin(t * Math.PI * 2 * coils);
                return optionalTarget.set(x, y, z);
            }
        }
        const path = new SpringCurve();
        const tubeGeo = new THREE.TubeGeometry(path, 64, 0.05, 8, false);
        return new THREE.Mesh(tubeGeo, material);
    }

    // ==========================================
    // 1. CHASSIS & ENGINE BLOCK
    // ==========================================
    const chassisGroup = new THREE.Group();
    
    // Complex polygonal main chassis
    const chassisPoints = [
        new THREE.Vector2(-4.5, -1), new THREE.Vector2(4.5, -1),
        new THREE.Vector2(5, 0.5), new THREE.Vector2(3.5, 1.5),
        new THREE.Vector2(-3.5, 1.5), new THREE.Vector2(-5, 0.5)
    ];
    const chassis = createExtrudedProfile(chassisPoints, 2.8, darkSteel);
    chassis.position.set(0, 2, 0); 
    chassisGroup.add(chassis);
    
    // High-tech Hybrid Engine Block inside chassis bay
    const engineBlockGroup = new THREE.Group();
    const engineGeo = new THREE.BoxGeometry(3.5, 1.8, 2.2);
    const engineBase = new THREE.Mesh(engineGeo, aluminum);
    engineBlockGroup.add(engineBase);
    
    // Engine Cooling Fins
    for(let i=0; i<12; i++) {
        const finGeo = new THREE.BoxGeometry(3.2, 0.05, 2.4);
        const fin = new THREE.Mesh(finGeo, steel);
        fin.position.set(0, -0.7 + i*0.12, 0);
        engineBlockGroup.add(fin);
    }

    // Cylinder heads
    const cylHeadGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.5, 16);
    for(let i=0; i<4; i++) {
        const head = new THREE.Mesh(cylHeadGeo, copper);
        head.position.set(-1 + i*0.6, 1.1, 0.5);
        engineBlockGroup.add(head);
        const head2 = new THREE.Mesh(cylHeadGeo, copper);
        head2.position.set(-1 + i*0.6, 1.1, -0.5);
        engineBlockGroup.add(head2);
    }
    
    engineBlockGroup.position.set(1.5, 2.5, 0);
    chassisGroup.add(engineBlockGroup);
    
    group.add(chassisGroup);
    meshes.chassis = chassisGroup;

    parts.push({
        name: 'Hyper-Alloy Chassis & Hybrid Engine Block',
        description: 'The core structural frame encasing a high-torque electro-diesel hybrid power plant, featuring dense cooling fins and copper induction coils.',
        material: 'Dark Steel, Aluminum, Copper',
        function: 'Provides absolute structural integrity and generates immense torque for heavy agronomic operations.',
        assemblyOrder: 1,
        connections: ['Front Axle', 'Rear Axle', 'Cabin', 'Transmission'],
        failureEffect: 'Catastrophic structural collapse or total loss of drive power.',
        cascadeFailures: ['Hydraulics', 'Electrical Grid'],
        originalPosition: { x: 0, y: 2, z: 0 },
        explodedPosition: { x: 0, y: 6, z: 0 }
    });

    // ==========================================
    // 2. WHEELS, AXLES & SUSPENSION
    // ==========================================
    const rearWheelRadius = 2.0;
    const rearWheelWidth = 1.4;
    const frontWheelRadius = 1.3;
    const frontWheelWidth = 0.9;
    
    // Rear Axle Assembly
    const rearAxleGroup = new THREE.Group();
    const rearAxleGeo = new THREE.CylinderGeometry(0.25, 0.25, 4.2, 32);
    const rearAxle = new THREE.Mesh(rearAxleGeo, steel);
    rearAxle.rotation.x = Math.PI/2;
    rearAxleGroup.add(rearAxle);

    // Differential housing
    const diffGeo = new THREE.SphereGeometry(0.5, 32, 32);
    const differential = new THREE.Mesh(diffGeo, darkSteel);
    differential.scale.set(1, 1, 0.8);
    rearAxleGroup.add(differential);

    rearAxleGroup.position.set(-2.8, 2.0, 0);
    group.add(rearAxleGroup);

    // Front Axle Assembly
    const frontAxleGroup = new THREE.Group();
    const frontAxleGeo = new THREE.CylinderGeometry(0.18, 0.18, 3.8, 32);
    const frontAxle = new THREE.Mesh(frontAxleGeo, steel);
    frontAxle.rotation.x = Math.PI/2;
    frontAxleGroup.add(frontAxle);
    
    frontAxleGroup.position.set(3.2, 1.3, 0);
    group.add(frontAxleGroup);

    // Suspension Springs
    const rLSpring = createSpring(0.2, 1.5, 6, chrome);
    rLSpring.position.set(-2.8, 2.7, 1.2);
    group.add(rLSpring);
    const rRSpring = createSpring(0.2, 1.5, 6, chrome);
    rRSpring.position.set(-2.8, 2.7, -1.2);
    group.add(rRSpring);

    // Create Wheels
    const rLWheel = createWheel(rearWheelRadius, rearWheelWidth, rearWheelRadius*0.6, 48);
    rLWheel.position.set(-2.8, 2.0, 2.1);
    group.add(rLWheel);
    meshes.rearLeftWheel = rLWheel;

    const rRWheel = createWheel(rearWheelRadius, rearWheelWidth, rearWheelRadius*0.6, 48);
    rRWheel.position.set(-2.8, 2.0, -2.1);
    group.add(rRWheel);
    meshes.rearRightWheel = rRWheel;
    
    parts.push({
        name: 'Rear Traction Drive & Differential',
        description: 'Massive chevron-treaded rear tires mounted on a heavy-duty steel axle with a centralized differential housing and chrome suspension.',
        material: 'Rubber, Chrome, Dark Steel',
        function: 'Translates engine torque into forward thrust while navigating deep mud and uneven terrain.',
        assemblyOrder: 2,
        connections: ['Chassis Base', 'Transmission Shaft'],
        failureEffect: 'Severe loss of traction, immobility, or drivetrain snapping.',
        cascadeFailures: ['Axle Bearings', 'Suspension Struts'],
        originalPosition: { x: -2.8, y: 2.0, z: 0 },
        explodedPosition: { x: -2.8, y: 2.0, z: 6 }
    });

    const fLWheel = createWheel(frontWheelRadius, frontWheelWidth, frontWheelRadius*0.6, 36);
    fLWheel.position.set(3.2, 1.3, 1.9);
    group.add(fLWheel);
    meshes.frontLeftWheel = fLWheel;

    const fRWheel = createWheel(frontWheelRadius, frontWheelWidth, frontWheelRadius*0.6, 36);
    fRWheel.position.set(3.2, 1.3, -1.9);
    group.add(fRWheel);
    meshes.frontRightWheel = fRWheel;

    parts.push({
        name: 'Front Articulated Steering Array',
        description: 'Responsive, slightly smaller front wheels attached to hydraulic steering knuckles for precision row-crop navigation.',
        material: 'Rubber & Steel',
        function: 'Provides accurate directional control and balances the forward weight distribution.',
        assemblyOrder: 3,
        connections: ['Front Axle', 'Hydraulic Steering Rack'],
        failureEffect: 'Loss of steering control, veering into crops.',
        cascadeFailures: ['Steering Linkages'],
        originalPosition: { x: 3.2, y: 1.3, z: 0 },
        explodedPosition: { x: 3.2, y: 1.3, z: -6 }
    });

    // ==========================================
    // 3. OPERATOR CABIN & AR INTERIOR
    // ==========================================
    const cabinGroup = new THREE.Group();
    
    // Complex Cabin Shell
    const cabinPoints = [
        new THREE.Vector2(-1.8, 0), new THREE.Vector2(1.8, 0),
        new THREE.Vector2(1.4, 2.8), new THREE.Vector2(-1.4, 2.8)
    ];
    const cabinShell = createExtrudedProfile(cabinPoints, 2.6, steel);
    cabinGroup.add(cabinShell);
    
    // Tinted Panoramic Windows
    const windowFrontGeo = new THREE.PlaneGeometry(2.4, 2.4);
    const windowFront = new THREE.Mesh(windowFrontGeo, tinted);
    windowFront.position.set(1.65, 1.4, 0);
    windowFront.rotation.y = Math.PI / 2;
    windowFront.rotation.x = -Math.PI / 20;
    cabinGroup.add(windowFront);
    
    const windowBack = new THREE.Mesh(windowFrontGeo, tinted);
    windowBack.position.set(-1.65, 1.4, 0);
    windowBack.rotation.y = -Math.PI / 2;
    windowBack.rotation.x = -Math.PI / 20;
    cabinGroup.add(windowBack);

    // Detailed Interior
    const seatBaseGeo = new THREE.BoxGeometry(0.8, 0.4, 0.8);
    const seatBackGeo = new THREE.BoxGeometry(0.3, 1.2, 0.8);
    const seatGroup = new THREE.Group();
    seatGroup.add(new THREE.Mesh(seatBaseGeo, plastic));
    const seatBack = new THREE.Mesh(seatBackGeo, plastic);
    seatBack.position.set(-0.25, 0.8, 0);
    seatBack.rotation.z = -Math.PI/16;
    seatGroup.add(seatBack);
    seatGroup.position.set(-0.6, 0.2, 0);
    cabinGroup.add(seatGroup);
    
    const consoleGeo = new THREE.BoxGeometry(0.8, 0.9, 1.6);
    const controlConsole = new THREE.Mesh(consoleGeo, darkSteel);
    controlConsole.position.set(1.0, 0.45, 0);
    cabinGroup.add(controlConsole);

    // Glowing AR Screens
    const mainScreenGeo = new THREE.PlaneGeometry(0.8, 0.5);
    const mainScreen = new THREE.Mesh(mainScreenGeo, screenMaterial);
    mainScreen.position.set(1.3, 1.1, 0);
    mainScreen.rotation.y = -Math.PI/3;
    mainScreen.rotation.x = -Math.PI/8;
    cabinGroup.add(mainScreen);

    const sideScreenGeo = new THREE.PlaneGeometry(0.4, 0.6);
    const sideScreen = new THREE.Mesh(sideScreenGeo, screenMaterial);
    sideScreen.position.set(1.1, 1.0, 0.6);
    sideScreen.rotation.y = -Math.PI/2;
    cabinGroup.add(sideScreen);

    // Steering & Joysticks
    const steeringWheelGeo = new THREE.TorusGeometry(0.3, 0.04, 16, 32);
    const steeringWheel = new THREE.Mesh(steeringWheelGeo, rubber);
    steeringWheel.position.set(0.6, 1.2, 0);
    steeringWheel.rotation.y = Math.PI/2;
    steeringWheel.rotation.x = -Math.PI/5;
    cabinGroup.add(steeringWheel);
    meshes.steeringWheel = steeringWheel;

    const joystickGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.3);
    const joystick = new THREE.Mesh(joystickGeo, steel);
    joystick.position.set(0.8, 1.0, -0.5);
    joystick.rotation.z = Math.PI/6;
    cabinGroup.add(joystick);

    cabinGroup.position.set(-0.5, 3.5, 0);
    group.add(cabinGroup);
    meshes.cabin = cabinGroup;

    parts.push({
        name: 'Pressurized Command Cabin',
        description: 'A heavily armored, climate-controlled operator environment with tinted panoramic glass, ergonomic seating, and holographic AR control interfaces.',
        material: 'Steel, Tinted Glass, High-Density Plastic',
        function: 'Protects the human operator from hazardous dust and chemicals while providing supreme digital oversight of the autonomous systems.',
        assemblyOrder: 4,
        connections: ['Chassis Base', 'Main Databus'],
        failureEffect: 'Loss of manual override and telemetry visualization; operator exposed to elements.',
        cascadeFailures: ['Life Support', 'UI Displays'],
        originalPosition: { x: -0.5, y: 3.5, z: 0 },
        explodedPosition: { x: -0.5, y: 9, z: 0 }
    });

    // ==========================================
    // 4. LADDERS & ACCESS
    // ==========================================
    const ladderGroup = new THREE.Group();
    const railGeo = new THREE.CylinderGeometry(0.04, 0.04, 3.5);
    const lRail = new THREE.Mesh(railGeo, darkSteel);
    lRail.position.set(-0.4, 0, 0);
    const rRail = new THREE.Mesh(railGeo, darkSteel);
    rRail.position.set(0.4, 0, 0);
    ladderGroup.add(lRail);
    ladderGroup.add(rRail);

    for(let i=0; i<6; i++) {
        const stepGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.8);
        const step = new THREE.Mesh(stepGeo, steel);
        step.rotation.z = Math.PI/2;
        step.position.set(0, -1.5 + i*0.6, 0);
        ladderGroup.add(step);
    }
    ladderGroup.position.set(-2, 2, 1.5);
    ladderGroup.rotation.x = Math.PI/6;
    ladderGroup.rotation.y = -Math.PI/12;
    group.add(ladderGroup);

    // ==========================================
    // 5. LIDAR & SENSORY ARRAY
    // ==========================================
    const lidarGroup = new THREE.Group();
    const lidarBaseGeo = new THREE.CylinderGeometry(0.35, 0.45, 0.3, 32);
    const lidarBase = new THREE.Mesh(lidarBaseGeo, darkSteel);
    
    const lidarScannerGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.5, 32);
    const lidarScanner = new THREE.Mesh(lidarScannerGeo, chrome);
    lidarScanner.position.y = 0.4;
    
    const lidarLensGeo = new THREE.BoxGeometry(0.5, 0.15, 0.25);
    const lidarLens = new THREE.Mesh(lidarLensGeo, neonBlue);
    lidarLens.position.set(0, 0, 0.15);
    lidarScanner.add(lidarLens);
    
    lidarGroup.add(lidarBase);
    lidarGroup.add(lidarScanner);
    lidarGroup.position.set(-0.5, 6.3, 0);
    group.add(lidarGroup);
    meshes.lidarScanner = lidarScanner;

    // Warning Beacons
    const beaconGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 16);
    const beacon1 = new THREE.Mesh(beaconGeo, neonRed);
    beacon1.position.set(-1.8, 6.4, 1.2);
    group.add(beacon1);
    const beacon2 = new THREE.Mesh(beaconGeo, neonRed);
    beacon2.position.set(-1.8, 6.4, -1.2);
    group.add(beacon2);
    meshes.beacons = [beacon1, beacon2];

    parts.push({
        name: 'Omni-Directional LIDAR & Warning System',
        description: 'A high-velocity spinning LIDAR drum emitting precise neon-blue laser arrays, flanked by intense red strobe beacons.',
        material: 'Chrome, Dark Steel, Emissive Glass',
        function: 'Maps the farm environment in 3D in real-time for flawless autonomous pathfinding and collision avoidance.',
        assemblyOrder: 5,
        connections: ['Cabin Roof', 'Navigation Mainframe'],
        failureEffect: 'Tractor becomes completely blind, forcing an immediate emergency halt.',
        cascadeFailures: ['Auto-Steer', 'Obstacle Avoidance'],
        originalPosition: { x: -0.5, y: 6.3, z: 0 },
        explodedPosition: { x: -0.5, y: 11, z: 0 }
    });

    // ==========================================
    // 6. EXHAUST & COOLING
    // ==========================================
    const exhaustGroup = new THREE.Group();
    const exhaustTubeGeo = new THREE.CylinderGeometry(0.2, 0.2, 3.5, 16);
    const exhaustTube = new THREE.Mesh(exhaustTubeGeo, chrome);
    exhaustTube.position.set(0, 1.75, 0);
    
    const exhaustCapGeo = new THREE.CylinderGeometry(0.22, 0.2, 0.6, 16);
    const exhaustCap = new THREE.Mesh(exhaustCapGeo, darkSteel);
    exhaustCap.position.set(0, 3.8, 0);
    
    const heatShieldGeo = new THREE.CylinderGeometry(0.3, 0.3, 2.0, 16, 1, true);
    const heatShield = new THREE.Mesh(heatShieldGeo, steel);
    heatShield.position.set(0, 1.5, 0);
    
    // Perforations in heat shield (simulated with texture in real engine, we use rings here)
    for(let i=0; i<10; i++) {
        const ringGeo = new THREE.TorusGeometry(0.3, 0.02, 8, 32);
        const ring = new THREE.Mesh(ringGeo, darkSteel);
        ring.rotation.x = Math.PI/2;
        ring.position.set(0, 0.6 + i*0.2, 0);
        exhaustGroup.add(ring);
    }

    exhaustGroup.add(exhaustTube);
    exhaustGroup.add(exhaustCap);
    exhaustGroup.add(heatShield);
    exhaustGroup.position.set(2.0, 3.5, 1.4);
    group.add(exhaustGroup);
    meshes.exhaust = exhaustGroup;

    parts.push({
        name: 'Thermal Exhaust & Heat Shielding',
        description: 'Tall chrome exhaust stack wrapped in a perforated steel thermal shield, venting high-temperature hybrid emissions.',
        material: 'Chrome & Steel',
        function: 'Safely channels exhaust gases away from the operator and prevents heat damage to internal wiring.',
        assemblyOrder: 6,
        connections: ['Engine Manifold'],
        failureEffect: 'Backpressure blowout or localized melting of adjacent parts.',
        cascadeFailures: ['Engine Block', 'Sensors'],
        originalPosition: { x: 2.0, y: 3.5, z: 1.4 },
        explodedPosition: { x: 2.0, y: 8, z: 4 }
    });

    // ==========================================
    // 7. FRONT GRILLE & LIGHTING
    // ==========================================
    const grilleGroup = new THREE.Group();
    const grilleBaseGeo = new THREE.BoxGeometry(1.2, 2.4, 2.6);
    const grilleBase = new THREE.Mesh(grilleBaseGeo, darkSteel);
    grilleGroup.add(grilleBase);

    // Horizontal heavy fins
    for(let i=0; i<10; i++) {
        const finGeo = new THREE.BoxGeometry(1.25, 0.08, 2.4);
        const fin = new THREE.Mesh(finGeo, chrome);
        fin.position.set(0, -1.0 + i*0.22, 0);
        grilleGroup.add(fin);
    }

    // High-Intensity Headlights
    const headlightGeo = new THREE.BoxGeometry(0.2, 0.5, 0.8);
    const hL = new THREE.Mesh(headlightGeo, headlightMaterial);
    hL.position.set(0.6, 0.8, 0.9);
    grilleGroup.add(hL);
    
    const hR = new THREE.Mesh(headlightGeo, headlightMaterial);
    hR.position.set(0.6, 0.8, -0.9);
    grilleGroup.add(hR);

    // Front tow hook
    const hookGeo = new THREE.TorusGeometry(0.15, 0.05, 16, 32);
    const hook = new THREE.Mesh(hookGeo, steel);
    hook.position.set(0.6, -1.0, 0);
    hook.rotation.y = Math.PI/2;
    grilleGroup.add(hook);

    grilleGroup.position.set(5.0, 2.2, 0);
    group.add(grilleGroup);

    parts.push({
        name: 'Heavy-Duty Grille & Optics Matrix',
        description: 'Imposing front radiator grille adorned with chrome fins, integrated tow hooks, and blindingly bright LED arrays.',
        material: 'Dark Steel, Chrome, Emissive Glass',
        function: 'Maximizes air intake for the cooling system and illuminates the fields during night-time autonomous operations.',
        assemblyOrder: 7,
        connections: ['Chassis Base', 'Cooling Radiator'],
        failureEffect: 'Severe overheating and total loss of forward visibility in darkness.',
        cascadeFailures: ['Engine Block'],
        originalPosition: { x: 5.0, y: 2.2, z: 0 },
        explodedPosition: { x: 9.0, y: 2.2, z: 0 }
    });

    // ==========================================
    // 8. PLOW & HYDRAULIC ATTACHMENT
    // ==========================================
    const plowGroup = new THREE.Group();
    
    // Main Rear Hitch
    const hitchGeo = new THREE.BoxGeometry(1.2, 0.8, 1.8);
    const hitch = new THREE.Mesh(hitchGeo, darkSteel);
    hitch.position.set(-5.1, 1.5, 0);
    group.add(hitch);

    // Articulating Boom Arms
    const boomGeo = new THREE.BoxGeometry(3.5, 0.4, 0.4);
    const leftBoom = new THREE.Mesh(boomGeo, steel);
    leftBoom.position.set(-1.75, 0, 0.8);
    const rightBoom = new THREE.Mesh(boomGeo, steel);
    rightBoom.position.set(-1.75, 0, -0.8);
    
    plowGroup.add(leftBoom);
    plowGroup.add(rightBoom);

    // Heavy Crossbar
    const crossbarGeo = new THREE.CylinderGeometry(0.3, 0.3, 5, 32);
    const crossbar = new THREE.Mesh(crossbarGeo, darkSteel);
    crossbar.rotation.x = Math.PI / 2;
    crossbar.position.set(-3.5, 0, 0);
    plowGroup.add(crossbar);

    // Wicked Plow Tines / Blades
    const bladeShape = new THREE.Shape();
    bladeShape.moveTo(0, 0);
    bladeShape.bezierCurveTo(-0.6, -0.6, -1.2, -1.2, -0.6, -2.5);
    bladeShape.lineTo(0.3, -2.5);
    bladeShape.bezierCurveTo(0, -1.2, 0.3, -0.6, 0.3, 0);
    
    const bladeExtrude = { depth: 0.15, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 3 };
    const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, bladeExtrude);
    
    const tines = [];
    for(let i=0; i<9; i++) {
        const blade = new THREE.Mesh(bladeGeo, steel);
        blade.position.set(-3.5, 0, -2.0 + i*0.5);
        blade.rotation.y = Math.PI; // hook backwards
        plowGroup.add(blade);
        tines.push(blade);
    }
    
    // Massive Hydraulic Rams
    const cylinderGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.8, 32);
    const pistonGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.8, 32);
    
    const leftHydraulic = new THREE.Group();
    const lCyl = new THREE.Mesh(cylinderGeo, darkSteel);
    const lPist = new THREE.Mesh(pistonGeo, chrome);
    lPist.position.y = -0.9;
    leftHydraulic.add(lCyl);
    leftHydraulic.add(lPist);
    leftHydraulic.position.set(-0.8, 1.2, 0.8);
    leftHydraulic.rotation.z = Math.PI/3;
    plowGroup.add(leftHydraulic);

    const rightHydraulic = new THREE.Group();
    const rCyl = new THREE.Mesh(cylinderGeo, darkSteel);
    const rPist = new THREE.Mesh(pistonGeo, chrome);
    rPist.position.y = -0.9;
    rightHydraulic.add(rCyl);
    rightHydraulic.add(rPist);
    rightHydraulic.position.set(-0.8, 1.2, -0.8);
    rightHydraulic.rotation.z = Math.PI/3;
    plowGroup.add(rightHydraulic);

    plowGroup.position.set(-5.1, 1.5, 0);
    group.add(plowGroup);
    meshes.plowGroup = plowGroup;
    meshes.leftPiston = lPist;
    meshes.rightPiston = rPist;

    parts.push({
        name: 'Articulating Heavy Cultivator Array',
        description: 'A devastating row of high-carbon steel tines mounted on thick steel booms, actuated by twin industrial hydraulic rams.',
        material: 'High-Carbon Steel, Chrome, Dark Steel',
        function: 'Powers through hardened earth, breaking up soil compaction and violently clearing field debris.',
        assemblyOrder: 8,
        connections: ['Rear Hitch Mechanism', 'Central Hydraulic Pump'],
        failureEffect: 'Cultivator drags lifelessly; complete failure of soil preparation capabilities.',
        cascadeFailures: ['Hydraulic Lines', 'Hitch Mounts'],
        originalPosition: { x: -5.1, y: 1.5, z: 0 },
        explodedPosition: { x: -12, y: 1.5, z: 0 }
    });

    // ==========================================
    // 9. HYDRAULIC LINES & WIRING
    // ==========================================
    const createTube = (p1, p2, p3, p4, mat) => {
        const curve = new THREE.CatmullRomCurve3([p1, p2, p3, p4]);
        const geo = new THREE.TubeGeometry(curve, 32, 0.06, 12, false);
        return new THREE.Mesh(geo, mat);
    };

    const tube1 = createTube(
        new THREE.Vector3(-5.1, 1.5, 0.2),
        new THREE.Vector3(-4.0, 2.0, 0.8),
        new THREE.Vector3(-2.0, 1.8, 1.0),
        new THREE.Vector3(-1.0, 1.0, 1.2),
        rubber
    );
    group.add(tube1);

    const tube2 = createTube(
        new THREE.Vector3(-5.1, 1.5, -0.2),
        new THREE.Vector3(-4.0, 2.0, -0.8),
        new THREE.Vector3(-2.0, 1.8, -1.0),
        new THREE.Vector3(-1.0, 1.0, -1.2),
        rubber
    );
    group.add(tube2);

    parts.push({
        name: 'High-Pressure Hydraulic Arteries',
        description: 'Thick, reinforced vulcanized rubber hoses threading violently pressurized fluid throughout the machine.',
        material: 'Vulcanized Rubber',
        function: 'Transmits extreme kinetic force from the central pump to the massive plow rams.',
        assemblyOrder: 9,
        connections: ['Plow Rams', 'Main Pump'],
        failureEffect: 'Catastrophic fluid blowout; loss of all mechanical articulation.',
        cascadeFailures: ['Attachments', 'Pump Burnout'],
        originalPosition: { x: -3.0, y: 1.5, z: 0 },
        explodedPosition: { x: -3.0, y: 5, z: 5 }
    });

    // ==========================================
    // 10. SIDE MIRRORS & ANTENNAS
    // ==========================================
    const mirrorSupportGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.8);
    const mirrorGeo = new THREE.BoxGeometry(0.15, 0.6, 0.3);

    const leftMirrorGroup = new THREE.Group();
    const lSup = new THREE.Mesh(mirrorSupportGeo, steel);
    lSup.rotation.x = Math.PI/2;
    lSup.position.set(0, 0, 0.4);
    const lMir = new THREE.Mesh(mirrorGeo, chrome);
    lMir.position.set(0, 0, 0.8);
    leftMirrorGroup.add(lSup);
    leftMirrorGroup.add(lMir);
    leftMirrorGroup.position.set(0.5, 4.0, 1.4);
    group.add(leftMirrorGroup);

    const rightMirrorGroup = new THREE.Group();
    const rSup = new THREE.Mesh(mirrorSupportGeo, steel);
    rSup.rotation.x = -Math.PI/2;
    rSup.position.set(0, 0, -0.4);
    const rMir = new THREE.Mesh(mirrorGeo, chrome);
    rMir.position.set(0, 0, -0.8);
    rightMirrorGroup.add(rSup);
    rightMirrorGroup.add(rMir);
    rightMirrorGroup.position.set(0.5, 4.0, -1.4);
    group.add(rightMirrorGroup);

    const antennaGeo = new THREE.CylinderGeometry(0.015, 0.05, 2.5);
    const antenna = new THREE.Mesh(antennaGeo, steel);
    antenna.position.set(1.0, 7.0, -1.0);
    group.add(antenna);

    parts.push({
        name: 'Telemetry Antenna & Sensor Mirrors',
        description: 'Rear-view situational optics and a towering high-gain telemetry spire linking directly to orbital satellites.',
        material: 'Steel & Chrome',
        function: 'Ensures uninterrupted global data streaming and backup visual redundancy.',
        assemblyOrder: 10,
        connections: ['Cabin Roof'],
        failureEffect: 'Disconnects from the agricultural swarm grid; reverts to isolated AI behavior.',
        cascadeFailures: ['Remote Uplink'],
        originalPosition: { x: 0.5, y: 5.5, z: 1.4 },
        explodedPosition: { x: 0.5, y: 8, z: 4 }
    });

    const description = "The Agronomy Autonomous Tractor is a colossal, hyper-realistic marvel of future agriculture. Sporting a brutalist heavy-duty chassis, extreme chevron-treaded tires, and a complex hydraulic cultivator, this mechanical beast violently dominates untamed soil. Guided by a rapidly spinning neon LIDAR array and managed within a pressurized AR cabin, it is a flawless synthesis of raw industrial power and surgical artificial intelligence.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Omni-Directional LIDAR Array situated on top of the cabin?",
            options: [
                "To cool down the hybrid engine block.",
                "To generate real-time 3D point clouds for obstacle avoidance and precise crop mapping.",
                "To deploy seeds automatically into the tilled soil.",
                "To establish an uplink with orbital farming satellites."
            ],
            correctAnswer: 1,
            explanation: "The spinning LIDAR array emits lasers to create an incredibly accurate 3D map of the environment, allowing the tractor to navigate perfectly without a driver."
        },
        {
            question: "If the High-Pressure Hydraulic Arteries were to rupture, what would be the immediate mechanical consequence?",
            options: [
                "The tractor's main electric motor would explode.",
                "The LIDAR scanner would instantly stop spinning.",
                "Loss of fluid pressure would cause the massive cultivator attachment to become completely immovable.",
                "The front steering linkage would seize."
            ],
            correctAnswer: 2,
            explanation: "The hydraulic lines transmit extreme kinetic force via pressurized fluid. A rupture instantly bleeds this pressure, disabling the articulation of the plow rams."
        },
        {
            question: "Which component is directly responsible for violently breaking up compacted soil and preparing the seedbed?",
            options: [
                "The Articulating Heavy Cultivator Array",
                "The Front Articulated Steering Array",
                "The Thermal Exhaust System",
                "The Pressurized Command Cabin"
            ],
            correctAnswer: 0,
            explanation: "The cultivator array features massive high-carbon steel tines that dig into the earth to break up soil compaction and clear debris."
        },
        {
            question: "What cascade failure is most likely if the Heavy-Duty Grille becomes entirely clogged with thick mud?",
            options: [
                "The cabin will immediately depressurize.",
                "The hydraulic rams will hyper-extend and snap.",
                "The hybrid engine block will suffer severe overheating due to a lack of intake air.",
                "The tractor will lose all satellite communications."
            ],
            correctAnswer: 2,
            explanation: "The front grille acts as the primary air intake for the cooling radiators. Clogging it cuts off airflow, leading directly to engine thermal runaway."
        },
        {
            question: "How do the front and rear wheels differ in function on this autonomous tractor?",
            options: [
                "Rear wheels are strictly for steering, front wheels provide forward thrust.",
                "Front wheels are for aesthetic balance; the rear wheels do all the steering and pulling.",
                "Massive rear wheels handle torque and heavy traction, while the smaller front wheels provide precision row-crop steering.",
                "They are perfectly identical in size and function to maintain perfect weight symmetry."
            ],
            correctAnswer: 2,
            explanation: "The brutal rear tires are designed to translate raw engine torque into thrust across mud, whereas the smaller front wheels pivot to steer the massive vehicle accurately between crop rows."
        }
    ];

    function animate(time, speed, activeMeshes) {
        // High-speed LIDAR spin
        if (activeMeshes.lidarScanner) {
            activeMeshes.lidarScanner.rotation.y += 0.2 * speed;
        }
        
        // Strobing warning beacons
        if (activeMeshes.beacons) {
            const intensity = 1 + Math.sin(time * 8) * 1.5;
            activeMeshes.beacons.forEach(b => {
                b.material.emissiveIntensity = intensity < 0 ? 0 : intensity;
            });
        }

        // Realistic Wheel Rotation matching varied diameters
        if (activeMeshes.frontLeftWheel) {
            activeMeshes.frontLeftWheel.rotation.z -= 0.06 * speed;
            activeMeshes.frontRightWheel.rotation.z -= 0.06 * speed;
        }
        if (activeMeshes.rearLeftWheel) {
            activeMeshes.rearLeftWheel.rotation.z -= 0.039 * speed; // Slower rotation for larger tires
            activeMeshes.rearRightWheel.rotation.z -= 0.039 * speed;
        }

        // Dynamic Steering Simulation (weaving gently)
        const steerAngle = Math.sin(time * 0.4) * 0.25;
        if (activeMeshes.frontLeftWheel) {
            activeMeshes.frontLeftWheel.rotation.y = steerAngle;
            activeMeshes.frontRightWheel.rotation.y = steerAngle;
            if (activeMeshes.steeringWheel) {
                activeMeshes.steeringWheel.rotation.z = -steerAngle * 2.5; // Steering wheel turns more than the tires
            }
        }

        // Heavy Cultivator Articulation and Hydraulic Sync
        if (activeMeshes.plowGroup) {
            // Plow slowly lifts and drops
            const plowLift = Math.sin(time * 0.6) * 0.25 + 0.25; // range: 0.0 to 0.5 radians
            activeMeshes.plowGroup.rotation.z = plowLift;
            
            // Hydraulic pistons push/pull exactly matching the boom rotation
            if (activeMeshes.leftPiston && activeMeshes.rightPiston) {
                // As boom lifts (rotates positive z), piston extends downwards slightly relative to its cylinder
                activeMeshes.leftPiston.position.y = -0.9 + (plowLift * 1.8);
                activeMeshes.rightPiston.position.y = -0.9 + (plowLift * 1.8);
            }
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
export function createAutonomousTractor() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
