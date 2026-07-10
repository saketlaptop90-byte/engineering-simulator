import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // --- HELPER FUNCTIONS ---
    function createTireWithTreads(radius, tube, radialSegments, tubularSegments, treadCount, treadWidth, treadHeight, treadDepth) {
        const tireGroup = new THREE.Group();
        const torusGeom = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments);
        const tireMesh = new THREE.Mesh(torusGeom, rubber);
        tireGroup.add(tireMesh);

        const lugGeom = new THREE.BoxGeometry(treadWidth, treadHeight, treadDepth);
        for(let i=0; i<treadCount; i++) {
            const angle = (i / treadCount) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeom, rubber);
            const r = radius + tube - (treadHeight * 0.1);
            lug.position.set(r * Math.cos(angle), r * Math.sin(angle), 0);
            lug.rotation.z = angle;
            // Chevron pattern
            if (i % 2 === 0) {
                lug.rotation.x = Math.PI/6;
                lug.position.z = tube * 0.4;
            } else {
                lug.rotation.x = -Math.PI/6;
                lug.position.z = -tube * 0.4;
            }
            tireGroup.add(lug);
        }
        return tireGroup;
    }

    function createRim(radius, depth, spokeCount) {
        const rimGroup = new THREE.Group();
        const outerGeom = new THREE.CylinderGeometry(radius, radius, depth, 32, 1, true);
        const outer = new THREE.Mesh(outerGeom, darkSteel);
        outer.rotation.x = Math.PI / 2;
        rimGroup.add(outer);

        const innerGeom = new THREE.CylinderGeometry(radius*0.2, radius*0.2, depth*1.1, 16);
        const inner = new THREE.Mesh(innerGeom, chrome);
        inner.rotation.x = Math.PI / 2;
        rimGroup.add(inner);

        const hubGeom = new THREE.CylinderGeometry(radius*0.3, radius*0.3, depth*1.05, 16);
        const hub = new THREE.Mesh(hubGeom, steel);
        hub.rotation.x = Math.PI/2;
        rimGroup.add(hub);

        const spokeGeom = new THREE.BoxGeometry(radius*0.9, depth*0.5, radius*0.1);
        for(let i=0; i<spokeCount; i++) {
            const angle = (i / spokeCount) * Math.PI * 2;
            const spoke = new THREE.Mesh(spokeGeom, steel);
            spoke.position.set((radius*0.45) * Math.cos(angle), (radius*0.45) * Math.sin(angle), 0);
            spoke.rotation.z = angle;
            rimGroup.add(spoke);
        }
        
        // Add lug nuts
        const nutGeom = new THREE.CylinderGeometry(radius*0.03, radius*0.03, depth*1.15, 6);
        for(let i=0; i<8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const nut = new THREE.Mesh(nutGeom, chrome);
            nut.position.set((radius*0.25) * Math.cos(angle), (radius*0.25) * Math.sin(angle), 0);
            nut.rotation.x = Math.PI/2;
            rimGroup.add(nut);
        }

        return rimGroup;
    }

    function createHydraulicCylinder(length, outerRadius, innerRadius, strokeOffset) {
        const cylGroup = new THREE.Group();
        const barrelGeom = new THREE.CylinderGeometry(outerRadius, outerRadius, length, 16);
        const barrel = new THREE.Mesh(barrelGeom, steel);
        barrel.position.y = length/2;
        cylGroup.add(barrel);

        const capGeom = new THREE.CylinderGeometry(outerRadius*1.2, outerRadius*1.2, length*0.1, 16);
        const cap = new THREE.Mesh(capGeom, darkSteel);
        cap.position.y = length;
        cylGroup.add(cap);
        
        const baseGeom = new THREE.CylinderGeometry(outerRadius*1.2, outerRadius*1.2, length*0.1, 16);
        const base = new THREE.Mesh(baseGeom, darkSteel);
        base.position.y = 0;
        cylGroup.add(base);

        const rodGeom = new THREE.CylinderGeometry(innerRadius, innerRadius, length*1.2, 16);
        const rod = new THREE.Mesh(rodGeom, chrome);
        rod.position.y = length + strokeOffset;
        
        const eyeGeom = new THREE.CylinderGeometry(innerRadius*1.5, innerRadius*1.5, innerRadius*2, 16);
        const eye = new THREE.Mesh(eyeGeom, steel);
        eye.rotation.z = Math.PI/2;
        eye.position.y = length*0.6;
        rod.add(eye);
        
        cylGroup.add(rod);
        return { group: cylGroup, rod: rod, baseLength: length };
    }

    // --- 1. CHASSIS ---
    const chassisShape = new THREE.Shape();
    chassisShape.moveTo(-2.5, -0.6);
    chassisShape.lineTo(2.2, -0.6);
    chassisShape.lineTo(2.8, 0.2);
    chassisShape.lineTo(2.2, 0.8);
    chassisShape.lineTo(-2.0, 0.8);
    chassisShape.lineTo(-2.8, -0.2);
    chassisShape.lineTo(-2.5, -0.6);
    
    const extrudeSettings = { depth: 1.4, bevelEnabled: true, bevelSegments: 3, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 };
    const chassisGeom = new THREE.ExtrudeGeometry(chassisShape, extrudeSettings);
    chassisGeom.center();
    const chassis = new THREE.Mesh(chassisGeom, steel);
    chassis.position.y = 1.0;
    group.add(chassis);

    // Fuel Tank
    const tankGeom = new THREE.BoxGeometry(1.2, 0.8, 1.6);
    const tank = new THREE.Mesh(tankGeom, darkSteel);
    tank.position.set(0, 0.2, 0);
    chassis.add(tank);
    
    const stepGeom = new THREE.BoxGeometry(0.8, 0.05, 0.3);
    const step1 = new THREE.Mesh(stepGeom, aluminum);
    step1.position.set(0, -0.3, 0.9);
    chassis.add(step1);
    
    const step2 = new THREE.Mesh(stepGeom, aluminum);
    step2.position.set(0, -0.6, 1.0);
    chassis.add(step2);

    parts.push({
        name: "Main Heavy-Duty Chassis",
        description: "Laser-cut, robot-welded structural backbone of the loader.",
        material: "steel",
        function: "Supports all massive dynamic loads during digging and driving.",
        assemblyOrder: 1,
        connections: ["Engine Block", "Axles", "Cabin", "Kingpost"],
        failureEffect: "Total machine failure and structural collapse.",
        cascadeFailures: ["Rupture of internal hydraulic lines"],
        originalPosition: {x: 0, y: 1.0, z: 0},
        explodedPosition: {x: 0, y: 3.0, z: 0}
    });

    // --- 2. ENGINE BLOCK & GRILLE ---
    const engineGroup = new THREE.Group();
    engineGroup.position.set(1.4, 1.6, 0);
    group.add(engineGroup);

    const engineGeom = new THREE.BoxGeometry(1.6, 1.2, 1.2);
    const engine = new THREE.Mesh(engineGeom, darkSteel);
    engineGroup.add(engine);

    // Grille
    const grilleGeom = new THREE.PlaneGeometry(1.1, 1.1);
    const grille = new THREE.Mesh(grilleGeom, chrome);
    grille.position.set(0.81, 0, 0);
    grille.rotation.y = Math.PI/2;
    engineGroup.add(grille);
    
    // Exhaust
    const exhaustGeom = new THREE.CylinderGeometry(0.1, 0.1, 1.8, 16);
    const exhaust = new THREE.Mesh(exhaustGeom, chrome);
    exhaust.position.set(0.5, 1.0, 0.4);
    engineGroup.add(exhaust);
    const flapGeom = new THREE.CylinderGeometry(0.12, 0.12, 0.02, 16);
    const exhaustFlap = new THREE.Mesh(flapGeom, darkSteel);
    exhaustFlap.position.set(0, 0.9, 0);
    exhaustFlap.rotation.x = 0.2;
    exhaust.add(exhaustFlap);

    parts.push({
        name: "Turbocharged Diesel Engine",
        description: "High-torque, low-emissions powerplant generating immense mechanical energy.",
        material: "darkSteel, chrome",
        function: "Drives the transmission and main hydraulic pump.",
        assemblyOrder: 2,
        connections: ["Chassis", "Transmission", "Exhaust"],
        failureEffect: "Engine stall.",
        cascadeFailures: ["Total loss of hydraulic pressure and motive force"],
        originalPosition: {x: 1.4, y: 1.6, z: 0},
        explodedPosition: {x: 1.4, y: 6.0, z: 0}
    });

    // --- 3. CABIN ---
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(-0.6, 2.8, 0);
    group.add(cabinGroup);

    const postGeom = new THREE.BoxGeometry(0.15, 2.2, 0.15);
    const p1 = new THREE.Mesh(postGeom, steel); p1.position.set(0.9, 0, 0.75); p1.rotation.z = -0.05;
    const p2 = new THREE.Mesh(postGeom, steel); p2.position.set(-0.9, 0, 0.75); p2.rotation.z = 0.05;
    const p3 = new THREE.Mesh(postGeom, steel); p3.position.set(0.9, 0, -0.75); p3.rotation.z = -0.05;
    const p4 = new THREE.Mesh(postGeom, steel); p4.position.set(-0.9, 0, -0.75); p4.rotation.z = 0.05;
    
    const roofGeom = new THREE.BoxGeometry(2.0, 0.2, 1.8);
    const roof = new THREE.Mesh(roofGeom, plastic);
    roof.position.set(0, 1.1, 0);
    
    const glassGeomF = new THREE.PlaneGeometry(1.5, 2.0);
    const glassF = new THREE.Mesh(glassGeomF, tinted);
    glassF.position.set(0.85, 0, 0);
    glassF.rotation.y = Math.PI/2;
    glassF.rotation.x = 0.05;

    const glassGeomB = new THREE.PlaneGeometry(1.5, 2.0);
    const glassB = new THREE.Mesh(glassGeomB, tinted);
    glassB.position.set(-0.85, 0, 0);
    glassB.rotation.y = -Math.PI/2;
    glassB.rotation.x = -0.05;

    cabinGroup.add(p1, p2, p3, p4, roof, glassF, glassB);

    parts.push({
        name: "Operator ROPS/FOPS Cabin",
        description: "Reinforced safety enclosure with tinted panoramic glass and climate control.",
        material: "steel, plastic, tinted",
        function: "Protects operator from rollovers and falling objects while providing 360-degree visibility.",
        assemblyOrder: 3,
        connections: ["Chassis", "Interior Controls"],
        failureEffect: "Operator hazard.",
        cascadeFailures: ["Loss of operation"],
        originalPosition: {x: -0.6, y: 2.8, z: 0},
        explodedPosition: {x: -0.6, y: 8.0, z: 0}
    });

    // --- 18. CABIN INTERIOR ---
    const seatGeom = new THREE.BoxGeometry(0.6, 0.8, 0.6);
    const seat = new THREE.Mesh(seatGeom, plastic);
    seat.position.set(0, -0.5, 0);
    cabinGroup.add(seat);

    const steeringColGeom = new THREE.CylinderGeometry(0.05, 0.05, 0.6);
    const steeringCol = new THREE.Mesh(steeringColGeom, plastic);
    steeringCol.position.set(0.6, -0.3, 0);
    steeringCol.rotation.z = -Math.PI/4;
    cabinGroup.add(steeringCol);

    const steeringWheelGeom = new THREE.TorusGeometry(0.2, 0.03, 16, 32);
    const steeringWheel = new THREE.Mesh(steeringWheelGeom, rubber);
    steeringWheel.position.set(0.8, -0.1, 0);
    steeringWheel.rotation.y = Math.PI/2;
    steeringWheel.rotation.x = -Math.PI/4;
    cabinGroup.add(steeringWheel);

    parts.push({
        name: "Command Interface & Controls",
        description: "Ergonomic joysticks, steering console, and digital dashboard.",
        material: "plastic, rubber",
        function: "Translates operator intent into hydraulic and mechanical actions.",
        assemblyOrder: 4,
        connections: ["Cabin", "Hydraulic Valves", "Steering Column"],
        failureEffect: "Loss of control.",
        cascadeFailures: ["Uncontrolled machine movements"],
        originalPosition: {x: 0, y: -0.5, z: 0},
        explodedPosition: {x: 0, y: 10.0, z: 0}
    });

    // --- WHEELS ---
    const fwRadius = 0.65;
    const fwGroupL = new THREE.Group();
    fwGroupL.position.set(1.8, 0.65, 1.3);
    const fwTireL = createTireWithTreads(fwRadius, 0.25, 24, 64, 40, 0.15, 0.12, 0.45);
    const fwRimL = createRim(fwRadius*0.85, 0.5, 8);
    fwGroupL.add(fwTireL, fwRimL);
    group.add(fwGroupL);
    
    const fwGroupR = new THREE.Group();
    fwGroupR.position.set(1.8, 0.65, -1.3);
    const fwTireR = createTireWithTreads(fwRadius, 0.25, 24, 64, 40, 0.15, 0.12, 0.45);
    const fwRimR = createRim(fwRadius*0.85, 0.5, 8);
    fwGroupR.add(fwTireR, fwRimR);
    group.add(fwGroupR);

    parts.push({
        name: "Front Articulated Steering Axle",
        description: "Heavy-duty 4WD front axle with planetary reduction hubs and deep-tread pneumatic tires.",
        material: "rubber, steel",
        function: "Steers the machine and provides 4WD traction.",
        assemblyOrder: 5,
        connections: ["Chassis", "Steering Cylinders"],
        failureEffect: "Loss of directional control.",
        cascadeFailures: [],
        originalPosition: {x: 1.8, y: 0.65, z: 0},
        explodedPosition: {x: 4.0, y: 0.65, z: 5.0}
    });

    const rwRadius = 1.1;
    const rwGroupL = new THREE.Group();
    rwGroupL.position.set(-1.6, 1.1, 1.4);
    const rwTireL = createTireWithTreads(rwRadius, 0.35, 32, 80, 50, 0.25, 0.15, 0.65);
    const rwRimL = createRim(rwRadius*0.85, 0.7, 10);
    rwGroupL.add(rwTireL, rwRimL);
    group.add(rwGroupL);

    const rwGroupR = new THREE.Group();
    rwGroupR.position.set(-1.6, 1.1, -1.4);
    const rwTireR = createTireWithTreads(rwRadius, 0.35, 32, 80, 50, 0.25, 0.15, 0.65);
    const rwRimR = createRim(rwRadius*0.85, 0.7, 10);
    rwGroupR.add(rwTireR, rwRimR);
    group.add(rwGroupR);

    parts.push({
        name: "Rear Heavy-Traction Drive Axle",
        description: "Massive rear tires on rigid drive axle with differential lock and wet brakes.",
        material: "rubber, steel",
        function: "Bears the primary weight during rear digging and provides massive forward thrust.",
        assemblyOrder: 6,
        connections: ["Chassis", "Transmission"],
        failureEffect: "Immobilization.",
        cascadeFailures: [],
        originalPosition: {x: -1.6, y: 1.1, z: 0},
        explodedPosition: {x: -4.0, y: 1.1, z: -5.0}
    });

    // --- FRONT LOADER ---
    const loaderArmGroup = new THREE.Group();
    loaderArmGroup.position.set(0.5, 2.0, 0); // Pivot
    group.add(loaderArmGroup);

    const armShape = new THREE.Shape();
    armShape.moveTo(0, 0);
    armShape.lineTo(2.5, -0.6);
    armShape.lineTo(3.2, -1.8);
    armShape.lineTo(2.8, -2.0);
    armShape.lineTo(2.1, -0.4);
    armShape.lineTo(-0.3, 0.4);
    armShape.lineTo(0, 0);

    const armExt = { depth: 0.25, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 3 };
    const armGeomL = new THREE.ExtrudeGeometry(armShape, armExt);
    const armL = new THREE.Mesh(armGeomL, steel);
    armL.position.set(0, 0, 1.0);
    loaderArmGroup.add(armL);

    const armGeomR = new THREE.ExtrudeGeometry(armShape, armExt);
    const armR = new THREE.Mesh(armGeomR, steel);
    armR.position.set(0, 0, -1.25);
    loaderArmGroup.add(armR);

    const braceGeom = new THREE.CylinderGeometry(0.2, 0.2, 2.2, 16);
    const brace = new THREE.Mesh(braceGeom, darkSteel);
    brace.rotation.x = Math.PI/2;
    brace.position.set(1.5, -0.3, 0);
    loaderArmGroup.add(brace);

    parts.push({
        name: "Front Loader Lift Arms",
        description: "Parallel-lift geometric steel arms reinforced for maximal breakout force.",
        material: "steel",
        function: "Raises and lowers the heavy front loader attachments.",
        assemblyOrder: 7,
        connections: ["Chassis", "Lift Cylinders", "Front Bucket"],
        failureEffect: "Arm buckling under extreme load.",
        cascadeFailures: ["Dropped load hazard"],
        originalPosition: {x: 0.5, y: 2.0, z: 0},
        explodedPosition: {x: 0.5, y: 7.0, z: 0}
    });

    // Front Bucket
    const frontBucketGroup = new THREE.Group();
    frontBucketGroup.position.set(3.0, -1.8, 0); // Attached to arm ends
    loaderArmGroup.add(frontBucketGroup);

    const bucketShape = new THREE.Shape();
    bucketShape.moveTo(0, 0);
    bucketShape.lineTo(0.6, -1.0);
    bucketShape.lineTo(1.4, -1.0);
    bucketShape.lineTo(1.2, 0.5);
    bucketShape.lineTo(0.2, 0.5);
    bucketShape.lineTo(0, 0);

    const bucketExt = { depth: 2.8, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03 };
    const bucketGeom = new THREE.ExtrudeGeometry(bucketShape, bucketExt);
    bucketGeom.center();
    const frontBucket = new THREE.Mesh(bucketGeom, darkSteel);
    frontBucketGroup.add(frontBucket);
    
    const toothGeom = new THREE.ConeGeometry(0.1, 0.35, 6);
    for(let i=-1.3; i<=1.3; i+=0.3) {
        const tooth = new THREE.Mesh(toothGeom, chrome);
        tooth.position.set(1.4, -0.8, i);
        tooth.rotation.z = -Math.PI/2;
        frontBucketGroup.add(tooth);
    }

    parts.push({
        name: "6-in-1 Front Loader Bucket",
        description: "Versatile clamshell bucket with forged cutting edge and hardened rock teeth.",
        material: "darkSteel, chrome",
        function: "Dozing, grading, grabbing, loading, and digging operations.",
        assemblyOrder: 8,
        connections: ["Lift Arms", "Tilt Cylinders"],
        failureEffect: "Inability to retain scooped material.",
        cascadeFailures: [],
        originalPosition: {x: 3.5, y: 0.2, z: 0},
        explodedPosition: {x: 8.0, y: 0.2, z: 0}
    });

    // Front Cylinders
    const liftCylL = createHydraulicCylinder(1.6, 0.15, 0.08, 0.6);
    liftCylL.group.position.set(0.3, 1.0, 1.1);
    liftCylL.group.rotation.z = -1.2;
    group.add(liftCylL.group);
    
    const liftCylR = createHydraulicCylinder(1.6, 0.15, 0.08, 0.6);
    liftCylR.group.position.set(0.3, 1.0, -1.1);
    liftCylR.group.rotation.z = -1.2;
    group.add(liftCylR.group);

    parts.push({
        name: "High-Pressure Lift Cylinders",
        description: "Dual 3000 PSI hydraulic cylinders powering the main lift arms.",
        material: "steel, chrome",
        function: "Converts fluid power to linear force for lifting loads up to 4 tons.",
        assemblyOrder: 9,
        connections: ["Chassis", "Lift Arms", "Hydraulic Harness"],
        failureEffect: "Sudden drop of the front bucket.",
        cascadeFailures: ["Rupture of fluid lines"],
        originalPosition: {x: 0.3, y: 1.0, z: 0},
        explodedPosition: {x: 0.3, y: -3.0, z: 0}
    });

    // --- REAR EXCAVATOR ---
    const kingpostGroup = new THREE.Group();
    kingpostGroup.position.set(-2.8, 1.0, 0);
    group.add(kingpostGroup);

    const railsGeom = new THREE.BoxGeometry(0.2, 1.2, 2.4);
    const rails = new THREE.Mesh(railsGeom, darkSteel);
    kingpostGroup.add(rails);

    const kingpostGeom = new THREE.CylinderGeometry(0.35, 0.35, 1.4, 32);
    const kingpost = new THREE.Mesh(kingpostGeom, steel);
    kingpostGroup.add(kingpost);

    parts.push({
        name: "Sideshift Kingpost Assembly",
        description: "Heavy cast-iron carriage sliding on rear rails, enabling 180-degree excavator swing.",
        material: "steel, darkSteel",
        function: "Anchors the entire rear excavator and permits lateral offset digging.",
        assemblyOrder: 10,
        connections: ["Chassis", "Swing Cylinders", "Excavator Boom"],
        failureEffect: "Excavator arm detaches or jams.",
        cascadeFailures: ["Loss of rear functionality"],
        originalPosition: {x: -2.8, y: 1.0, z: 0},
        explodedPosition: {x: -6.0, y: 1.0, z: 0}
    });

    const boomGroup = new THREE.Group();
    boomGroup.position.set(0, 0.5, 0);
    kingpostGroup.add(boomGroup);
    
    const boomShape = new THREE.Shape();
    boomShape.moveTo(0, 0);
    boomShape.lineTo(-1.2, 2.2);
    boomShape.lineTo(-1.8, 2.5);
    boomShape.lineTo(-2.2, 2.0);
    boomShape.lineTo(-0.6, -0.4);
    boomShape.lineTo(0, 0);
    
    const boomExt = { depth: 0.5, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05 };
    const boomGeom = new THREE.ExtrudeGeometry(boomShape, boomExt);
    boomGeom.center();
    const boom = new THREE.Mesh(boomGeom, steel);
    boom.position.set(-1.0, 1.2, 0);
    boomGroup.add(boom);

    parts.push({
        name: "Curved 'Banana' Boom",
        description: "Engineered curve allows loading over high-sided trucks without snagging.",
        material: "steel",
        function: "Main lifting structure for rear excavation.",
        assemblyOrder: 11,
        connections: ["Kingpost", "Boom Cylinder", "Dipper Arm"],
        failureEffect: "Structural fatigue and snapping under stress.",
        cascadeFailures: [],
        originalPosition: {x: -3.8, y: 2.2, z: 0},
        explodedPosition: {x: -3.8, y: 8.0, z: 0}
    });

    const dipperGroup = new THREE.Group();
    dipperGroup.position.set(-1.8, 2.2, 0); 
    boomGroup.add(dipperGroup);

    const dipperShape = new THREE.Shape();
    dipperShape.moveTo(0, 0);
    dipperShape.lineTo(-0.3, -3.0);
    dipperShape.lineTo(-0.7, -3.0);
    dipperShape.lineTo(-0.4, 0.3);
    dipperShape.lineTo(0, 0);

    const dipperExt = { depth: 0.4, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03 };
    const dipperGeom = new THREE.ExtrudeGeometry(dipperShape, dipperExt);
    dipperGeom.center();
    const dipper = new THREE.Mesh(dipperGeom, steel);
    dipper.position.set(-0.3, -1.4, 0);
    dipperGroup.add(dipper);

    // Telescopic inner dipper
    const innerDipperGeom = new THREE.BoxGeometry(0.3, 2.0, 0.3);
    const innerDipper = new THREE.Mesh(innerDipperGeom, chrome);
    innerDipper.position.set(-0.5, -2.5, 0);
    dipperGroup.add(innerDipper);

    parts.push({
        name: "Telescopic Extradig Dipper",
        description: "Extending stick arm to drastically increase reach and digging depth.",
        material: "steel, chrome",
        function: "Provides secondary articulation and telescopic extension.",
        assemblyOrder: 12,
        connections: ["Boom", "Dipper Cylinder", "Bucket Linkage"],
        failureEffect: "Inability to reach target depth.",
        cascadeFailures: [],
        originalPosition: {x: -5.6, y: 2.2, z: 0},
        explodedPosition: {x: -9.0, y: 2.2, z: 0}
    });

    const rearBucketGroup = new THREE.Group();
    rearBucketGroup.position.set(-0.5, -3.5, 0); // attached to inner dipper
    dipperGroup.add(rearBucketGroup);

    const rBucketShape = new THREE.Shape();
    rBucketShape.moveTo(0, 0);
    rBucketShape.lineTo(-0.5, 0.3);
    rBucketShape.lineTo(-1.0, -0.4);
    rBucketShape.lineTo(-0.8, -1.0);
    rBucketShape.lineTo(0.3, -0.6);
    rBucketShape.lineTo(0, 0);

    const rBucketExt = { depth: 0.7, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02 };
    const rBucketGeom = new THREE.ExtrudeGeometry(rBucketShape, rBucketExt);
    rBucketGeom.center();
    const rBucket = new THREE.Mesh(rBucketGeom, darkSteel);
    rearBucketGroup.add(rBucket);

    const rToothGeom = new THREE.ConeGeometry(0.06, 0.25, 4);
    for(let i=-0.25; i<=0.25; i+=0.125) {
        const rTooth = new THREE.Mesh(rToothGeom, chrome);
        rTooth.position.set(-0.9, -0.8, i);
        rTooth.rotation.z = Math.PI/4;
        rearBucketGroup.add(rTooth);
    }

    parts.push({
        name: "Deep Trenching Bucket",
        description: "Narrow, high-capacity bucket equipped with tungsten-carbide teeth.",
        material: "darkSteel, chrome",
        function: "Slices through hard soil and rock to excavate trenches.",
        assemblyOrder: 13,
        connections: ["Extradig Dipper", "Bucket Cylinder"],
        failureEffect: "Teeth break or bucket crushes.",
        cascadeFailures: [],
        originalPosition: {x: -6.1, y: -1.3, z: 0},
        explodedPosition: {x: -12.0, y: -1.3, z: 0}
    });

    // Rear Hydraulics
    const boomCyl = createHydraulicCylinder(1.4, 0.12, 0.06, 0.3);
    boomCyl.group.position.set(-0.6, -0.6, 0);
    boomCyl.group.rotation.z = Math.PI/2 + 0.1;
    boomGroup.add(boomCyl.group);

    const dipperCyl = createHydraulicCylinder(1.6, 0.1, 0.05, 0.4);
    dipperCyl.group.position.set(-0.2, 1.4, 0);
    dipperCyl.group.rotation.z = Math.PI/2 - 0.2;
    boomGroup.add(dipperCyl.group);

    const bucketCyl = createHydraulicCylinder(1.2, 0.08, 0.04, 0.3);
    bucketCyl.group.position.set(-0.2, -1.0, 0);
    bucketCyl.group.rotation.z = -0.1;
    dipperGroup.add(bucketCyl.group);

    // --- STABILIZERS ---
    const stabLGroup = new THREE.Group();
    stabLGroup.position.set(-2.2, 0.6, 1.3);
    group.add(stabLGroup);

    const stabArmGeom = new THREE.BoxGeometry(0.35, 1.8, 0.25);
    const stabArmL = new THREE.Mesh(stabArmGeom, steel);
    stabArmL.position.set(0, -0.8, 0.3);
    stabArmL.rotation.x = -0.6;
    stabLGroup.add(stabArmL);
    
    const padGeom = new THREE.BoxGeometry(0.7, 0.15, 0.5);
    const padL = new THREE.Mesh(padGeom, darkSteel);
    padL.position.set(0, -1.7, 0.8);
    stabLGroup.add(padL);

    const stabRGroup = new THREE.Group();
    stabRGroup.position.set(-2.2, 0.6, -1.3);
    group.add(stabRGroup);
    
    const stabArmR = new THREE.Mesh(stabArmGeom, steel);
    stabArmR.position.set(0, -0.8, -0.3);
    stabArmR.rotation.x = 0.6;
    stabRGroup.add(stabArmR);

    const padR = new THREE.Mesh(padGeom, darkSteel);
    padR.position.set(0, -1.7, -0.8);
    stabRGroup.add(padR);

    parts.push({
        name: "Hydraulic Outrigger Legs",
        description: "Independently operated heavy A-frame stabilizers with reversible pads.",
        material: "steel, darkSteel",
        function: "Levels the machine and provides absolute stability during violent rear digging.",
        assemblyOrder: 14,
        connections: ["Chassis", "Stabilizer Cylinders"],
        failureEffect: "Machine tips or rolls over during operation.",
        cascadeFailures: ["Catastrophic damage to machine and surroundings"],
        originalPosition: {x: -2.2, y: 0.6, z: 0},
        explodedPosition: {x: -2.2, y: 0.6, z: 6.0}
    });

    // --- HYDRAULIC LINES (High detail) ---
    const hosePath1 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-2.8, 1.6, 0.2),
        new THREE.Vector3(-3.0, 1.9, 0.4),
        new THREE.Vector3(-3.4, 2.8, 0.2),
        new THREE.Vector3(-3.6, 3.4, 0)
    ]);
    const hoseGeom = new THREE.TubeGeometry(hosePath1, 32, 0.03, 12, false);
    const hoseMat = new THREE.MeshStandardMaterial({color: 0x151515, roughness: 0.9});
    const hose = new THREE.Mesh(hoseGeom, hoseMat);
    group.add(hose);

    const hosePath2 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-2.8, 1.6, -0.2),
        new THREE.Vector3(-3.0, 1.9, -0.4),
        new THREE.Vector3(-3.4, 2.8, -0.2),
        new THREE.Vector3(-3.6, 3.4, 0)
    ]);
    const hoseGeom2 = new THREE.TubeGeometry(hosePath2, 32, 0.03, 12, false);
    const hose2 = new THREE.Mesh(hoseGeom2, hoseMat);
    group.add(hose2);

    parts.push({
        name: "High-Pressure Hydraulic Harness",
        description: "Dense network of braided steel lines operating at 3300+ PSI.",
        material: "rubber, braided steel",
        function: "Routes pressurized hydraulic fluid from the main pump to all actuators.",
        assemblyOrder: 15,
        connections: ["Hydraulic Pump", "Valves", "All Cylinders"],
        failureEffect: "Explosive release of scalding fluid.",
        cascadeFailures: ["Total system paralysis"],
        originalPosition: {x: -3.2, y: 2.5, z: 0},
        explodedPosition: {x: -3.2, y: 5.0, z: -4.0}
    });

    // --- HYPER TECH LIGHTING ---
    const neonMat = new THREE.MeshStandardMaterial({
        color: 0x00ffcc,
        emissive: 0x00ffcc,
        emissiveIntensity: 2.5,
        roughness: 0.1
    });
    
    const ledStripGeom = new THREE.BoxGeometry(1.8, 0.05, 0.05);
    const roofLedF = new THREE.Mesh(ledStripGeom, neonMat);
    roofLedF.position.set(0, 1.25, 0.9);
    cabinGroup.add(roofLedF);

    const roofLedR = new THREE.Mesh(ledStripGeom, neonMat);
    roofLedR.position.set(0, 1.25, -0.9);
    cabinGroup.add(roofLedR);

    // Beacons
    const beaconGeom = new THREE.CylinderGeometry(0.08, 0.08, 0.15, 16);
    const beaconMat = new THREE.MeshStandardMaterial({color: 0xffaa00, emissive: 0xffaa00, emissiveIntensity: 3.0});
    const beacon = new THREE.Mesh(beaconGeom, beaconMat);
    beacon.position.set(0, 1.3, 0);
    cabinGroup.add(beacon);

    // --- METADATA ---
    const description = "The JCB 3CX Backhoe Loader is an incredibly advanced, heavy-duty earthmoving machine. By bridging the gap between a front-end loader and a rear excavator, it delivers unmatched versatility. Its structural framework is built from laser-cut steel, reinforced to withstand immense breakout forces. Powered by a high-torque turbocharged diesel engine, it utilizes a massive multi-stage hydraulic system pumping fluid at over 3000 PSI through dense braided steel harnesses. It features heavy-tread pneumatic tires, a FOPS/ROPS cabin with glowing digital telemetry interfaces, articulated joints, and complex telescoping geometries. The model is rendered in stunning detail, highlighting its complex mechanics and high-tech flair.";

    const quizQuestions = [
        {
            question: "What is the primary function of the 'Sideshift Kingpost Assembly'?",
            options: [
                "To steer the front wheels",
                "To provide a pivoting base and lateral sliding track for the rear excavator",
                "To lift the front bucket",
                "To cool the engine block"
            ],
            correctAnswer: 1,
            explanation: "The kingpost assembly connects the excavator to the rails on the rear chassis, allowing it to slide left or right (sideshift) and swing 180 degrees to dig alongside walls or trenches."
        },
        {
            question: "Why does the rear excavator utilize a curved 'Banana' Boom?",
            options: [
                "It requires less metal to manufacture",
                "It allows the boom to clear obstacles, like high truck sides, while maintaining structural strength",
                "It acts as a suspension spring for the machine",
                "It reduces hydraulic pressure requirements"
            ],
            correctAnswer: 1,
            explanation: "The signature curved 'banana' boom allows the machine to dig deep and lift high without the boom snagging on the edges of trucks or deep trenches, providing excellent clearance."
        },
        {
            question: "Which component is deployed to completely level and stabilize the machine during violent rear digging?",
            options: [
                "Front Loader Lift Arms",
                "Telescopic Extradig Dipper",
                "Hydraulic Outrigger Legs",
                "Differential Lock"
            ],
            correctAnswer: 2,
            explanation: "The hydraulic outrigger legs (stabilizers) lift the rear wheels off the ground, widening the footprint to absorb lateral torque and prevent the machine from tipping over."
        },
        {
            question: "What provides secondary articulation and drastic extension for deep trenching on the rear excavator?",
            options: [
                "The 6-in-1 Front Bucket",
                "The High-Pressure Lift Cylinders",
                "The Telescopic Extradig Dipper",
                "The Operator ROPS Cabin"
            ],
            correctAnswer: 2,
            explanation: "The 'Extradig' dipper is a telescopic stick arm that extends out hydraulically, massively increasing the maximum digging depth and reach of the rear bucket without moving the machine."
        },
        {
            question: "What would happen if the 'High-Pressure Hydraulic Harness' ruptured?",
            options: [
                "The engine would over-rev",
                "Explosive release of scalding fluid and total paralysis of all implements",
                "Immediate tire blowout",
                "The cabin would depressurize"
            ],
            correctAnswer: 1,
            explanation: "Hydraulic lines contain fluid at immense pressures. A rupture causes an explosive leak, creating a severe burn hazard and instantaneously rendering the boom, dipper, and loader completely immobile."
        }
    ];

    // --- ANIMATION ---
    function animate(time, speed, meshes) {
        // Locomotive Wheel Rotation
        fwGroupL.rotation.z = -time * speed * 2;
        fwGroupR.rotation.z = -time * speed * 2;
        rwGroupL.rotation.z = -time * speed * 2 * (fwRadius/rwRadius);
        rwGroupR.rotation.z = -time * speed * 2 * (fwRadius/rwRadius);

        // Warning Beacon Spin/Pulse
        beacon.rotation.y = time * speed * 10;
        beaconMat.emissiveIntensity = 2.0 + Math.sin(time * speed * 15) * 1.5;
        neonMat.emissiveIntensity = 1.5 + Math.sin(time * speed * 3) * 1.0;

        // Front Loader Lift & Curl
        const loaderLift = (Math.sin(time * speed * 0.8) + 1) / 2; // 0 to 1
        loaderArmGroup.rotation.z = loaderLift * 0.7; 
        frontBucketGroup.rotation.z = -loaderLift * 0.6; // Keep level

        // Lift Cylinder Extension
        liftCylL.rod.position.y = liftCylL.baseLength + (loaderLift * 0.5);
        liftCylR.rod.position.y = liftCylR.baseLength + (loaderLift * 0.5);

        // Rear Excavator Swing & Dig Cycle
        const swing = Math.sin(time * speed * 0.4) * 0.8;
        kingpostGroup.rotation.y = swing;

        const boomLift = Math.sin(time * speed * 1.1) * 0.5;
        boomGroup.rotation.z = boomLift;
        boomCyl.rod.position.y = boomCyl.baseLength + (boomLift * 0.4);

        const dipperCurl = Math.sin(time * speed * 1.3) * 0.6;
        dipperGroup.rotation.z = dipperCurl;
        dipperCyl.rod.position.y = dipperCyl.baseLength + (dipperCurl * 0.3);

        const bucketCurl = Math.sin(time * speed * 1.6) * 0.9;
        rearBucketGroup.rotation.z = bucketCurl;
        bucketCyl.rod.position.y = bucketCyl.baseLength + (bucketCurl * 0.2);

        // Telescope the Extradig Dipper slightly
        const extradigExt = (Math.sin(time * speed * 0.9) + 1) / 2;
        innerDipper.position.y = -2.5 - (extradigExt * 0.8);
        rearBucketGroup.position.y = -3.5 - (extradigExt * 0.8);

        // Exhaust Flap jitter
        exhaustFlap.rotation.x = 0.2 + Math.abs(Math.sin(time * speed * 20)) * 0.3;
    }

    return { group, parts, description, quizQuestions, animate };
}
