import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    group.name = "ConcretePumpTruck";

    const parts = [];
    let partIdCounter = 1;

    // Helper functions for hyper-realistic geometries
    function createDetailedTire() {
        const tireGroup = new THREE.Group();
        
        // Main tire body
        const torusGeom = new THREE.TorusGeometry(3.5, 1.2, 32, 64);
        const tireTorus = new THREE.Mesh(torusGeom, rubber);
        tireGroup.add(tireTorus);

        // Aggressive off-road treads
        const treadCount = 48;
        for (let i = 0; i < treadCount; i++) {
            const angle = (i / treadCount) * Math.PI * 2;
            const lugGeom = new THREE.BoxGeometry(2.6, 0.4, 0.6);
            const lug = new THREE.Mesh(lugGeom, rubber);
            lug.position.set(Math.cos(angle) * 4.4, Math.sin(angle) * 4.4, 0);
            lug.rotation.z = angle;
            lug.rotation.y = (i % 2 === 0) ? 0.2 : -0.2; // V-tread pattern
            tireGroup.add(lug);
        }

        // Rim
        const rimGeom = new THREE.CylinderGeometry(2.4, 2.4, 1.6, 32);
        const rim = new THREE.Mesh(rimGeom, aluminum);
        rim.rotation.x = Math.PI / 2;
        tireGroup.add(rim);

        // Rim Spokes
        const spokeCount = 10;
        for (let i = 0; i < spokeCount; i++) {
            const angle = (i / spokeCount) * Math.PI * 2;
            const spokeGeom = new THREE.CylinderGeometry(0.15, 0.15, 2.2, 16);
            const spoke = new THREE.Mesh(spokeGeom, chrome);
            spoke.position.set(Math.cos(angle) * 1.2, Math.sin(angle) * 1.2, 0);
            spoke.rotation.z = angle;
            spoke.rotation.x = Math.PI / 2;
            tireGroup.add(spoke);
        }

        // Center Hub
        const hubGeom = new THREE.CylinderGeometry(0.8, 0.8, 1.8, 32);
        const hub = new THREE.Mesh(hubGeom, darkSteel);
        hub.rotation.x = Math.PI / 2;
        tireGroup.add(hub);

        // Hub bolts
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const boltGeom = new THREE.CylinderGeometry(0.1, 0.1, 1.9, 8);
            const bolt = new THREE.Mesh(boltGeom, chrome);
            bolt.position.set(Math.cos(angle) * 0.5, Math.sin(angle) * 0.5, 0);
            bolt.rotation.x = Math.PI / 2;
            tireGroup.add(bolt);
        }

        return tireGroup;
    }

    function createPiston(length, radius) {
        const pistonGroup = new THREE.Group();
        
        // Outer sleeve (cylinder)
        const sleeveGeom = new THREE.CylinderGeometry(radius, radius, length * 0.6, 32);
        const sleeve = new THREE.Mesh(sleeveGeom, steel);
        sleeve.position.y = length * 0.3;
        
        // Outer sleeve detailing (hydraulic ports)
        const portGeom = new THREE.CylinderGeometry(radius * 0.3, radius * 0.3, radius * 2.2, 16);
        const port1 = new THREE.Mesh(portGeom, darkSteel);
        port1.rotation.z = Math.PI / 2;
        port1.position.set(0, length * 0.1, 0);
        const port2 = new THREE.Mesh(portGeom, darkSteel);
        port2.rotation.z = Math.PI / 2;
        port2.position.set(0, length * 0.5, 0);
        
        sleeve.add(port1);
        sleeve.add(port2);
        pistonGroup.add(sleeve);

        // Inner rod (chrome)
        const rodGeom = new THREE.CylinderGeometry(radius * 0.6, radius * 0.6, length * 0.8, 32);
        const rod = new THREE.Mesh(rodGeom, chrome);
        rod.position.y = length * 0.7; // Initial extended position
        rod.name = "InnerRod";

        // Rod eyelet
        const eyeletGeom = new THREE.TorusGeometry(radius * 0.8, radius * 0.3, 16, 32);
        const eyelet = new THREE.Mesh(eyeletGeom, darkSteel);
        eyelet.position.y = length * 0.4;
        eyelet.rotation.x = Math.PI / 2;
        rod.add(eyelet);

        pistonGroup.add(rod);
        return pistonGroup;
    }

    function createBoomTruss(length, width, height) {
        const shape = new THREE.Shape();
        shape.moveTo(-width/2, -height/2);
        shape.lineTo(width/2, -height/2);
        shape.lineTo(width*0.3, height/2);
        shape.lineTo(-width*0.3, height/2);
        shape.lineTo(-width/2, -height/2);

        const extrudeSettings = {
            steps: 4,
            depth: length,
            bevelEnabled: true,
            bevelThickness: 0.2,
            bevelSize: 0.1,
            bevelSegments: 3
        };

        const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        geom.center(); // Center the geometry

        // Create the hollow inner truss pattern visually by overlaying elements
        const trussGroup = new THREE.Group();
        const mainBeam = new THREE.Mesh(geom, steel);
        
        // Hinge pins on ends
        const pinGeom = new THREE.CylinderGeometry(height * 0.4, height * 0.4, width * 1.5, 32);
        const pin1 = new THREE.Mesh(pinGeom, darkSteel);
        pin1.rotation.z = Math.PI / 2;
        pin1.position.z = -length / 2;
        
        const pin2 = new THREE.Mesh(pinGeom, darkSteel);
        pin2.rotation.z = Math.PI / 2;
        pin2.position.z = length / 2;

        trussGroup.add(mainBeam);
        trussGroup.add(pin1);
        trussGroup.add(pin2);
        
        return trussGroup;
    }

    // 1. Chassis
    const chassisShape = new THREE.Shape();
    chassisShape.moveTo(0, 0);
    chassisShape.lineTo(28, 0);
    chassisShape.lineTo(28, 1.5);
    chassisShape.lineTo(26, 2);
    chassisShape.lineTo(4, 2);
    chassisShape.lineTo(0, 1.5);
    chassisShape.lineTo(0, 0);

    const chassisExtrude = { depth: 5, bevelEnabled: true, bevelThickness: 0.2, bevelSize: 0.1, bevelSegments: 2 };
    const chassisGeom = new THREE.ExtrudeGeometry(chassisShape, chassisExtrude);
    const chassis = new THREE.Mesh(chassisGeom, darkSteel);
    chassis.position.set(-14, 2, -2.5);

    // Chassis cross-members and rivets
    for(let i = 2; i < 26; i+=4) {
        const cross = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.5, 5.2), steel);
        cross.position.set(i, 1, 2.5);
        chassis.add(cross);
    }
    group.add(chassis);
    parts.push({
        name: "Main Chassis Frame",
        description: "Heavy-duty dual H-beam steel chassis designed to support the immense torque of the pumping unit and articulated boom.",
        material: "High-Tensile Steel",
        function: "Structural foundation and load distribution.",
        assemblyOrder: 1,
        connections: ["Wheels", "Cabin", "Outriggers", "Turret", "Pumping Unit"],
        failureEffect: "Structural collapse under load, compromising entire machine.",
        cascadeFailures: ["Boom catastrophic failure", "Outrigger detachment"],
        originalPosition: {x: -14, y: 2, z: -2.5},
        explodedPosition: {x: 0, y: -10, z: 0}
    });

    // 2. Wheels
    const wheels = [];
    const wheelPositions = [
        {x: 8, y: 3.5, z: 3.2}, {x: 8, y: 3.5, z: -3.2}, // Front Axle 1
        {x: 14, y: 3.5, z: 3.2}, {x: 14, y: 3.5, z: -3.2}, // Front Axle 2
        {x: -6, y: 3.5, z: 3.2}, {x: -6, y: 3.5, z: -3.2}, // Rear Axle 1
        {x: -12, y: 3.5, z: 3.2}, {x: -12, y: 3.5, z: -3.2} // Rear Axle 2
    ];

    wheelPositions.forEach((pos, index) => {
        const wheel = createDetailedTire();
        wheel.position.set(pos.x, pos.y, pos.z);
        group.add(wheel);
        wheels.push(wheel);

        if(index % 2 === 0) { // Add part entry for axles
            parts.push({
                name: `Drive Axle Assembly ${Math.floor(index/2) + 1}`,
                description: "Multi-wheel drive axle with planetary gear reduction and independent suspension hydraulics.",
                material: "Rubber/Steel/Chrome",
                function: "Mobility, vibration dampening, and ground contact.",
                assemblyOrder: 2 + Math.floor(index/2),
                connections: ["Chassis Frame", "Driveshaft"],
                failureEffect: "Immobility, chassis imbalance.",
                cascadeFailures: ["Suspension bottom-out", "Drive shaft snap"],
                originalPosition: pos,
                explodedPosition: {x: pos.x, y: -5, z: pos.z * 3}
            });
        }
    });

    // 3. Operator Cabin
    const cabinShape = new THREE.Shape();
    cabinShape.moveTo(0, 0);
    cabinShape.lineTo(6, 0);
    cabinShape.lineTo(6, 4);
    cabinShape.lineTo(4, 6);
    cabinShape.lineTo(0.5, 6);
    cabinShape.lineTo(0, 4);
    cabinShape.lineTo(0, 0);

    const cabinGeom = new THREE.ExtrudeGeometry(cabinShape, {depth: 4.8, bevelEnabled: true, bevelThickness: 0.3});
    const cabin = new THREE.Mesh(cabinGeom, steel);
    cabin.position.set(16, 4, -2.4);

    // Windshield (Tinted glass)
    const glassShape = new THREE.Shape();
    glassShape.moveTo(4.1, 4.1);
    glassShape.lineTo(5.9, 4.1);
    glassShape.lineTo(5.9, 1.1);
    glassShape.lineTo(4.1, 1.1);
    const glassGeom = new THREE.ExtrudeGeometry(glassShape, {depth: 4.9, bevelEnabled: false});
    const windshield = new THREE.Mesh(glassGeom, tinted);
    windshield.position.set(0, 0, -0.05);
    cabin.add(windshield);

    // Side mirrors
    const mirrorGeom = new THREE.BoxGeometry(0.3, 1, 0.5);
    const mirrorL = new THREE.Mesh(mirrorGeom, chrome);
    mirrorL.position.set(4, 3, 5);
    const mirrorR = mirrorL.clone();
    mirrorR.position.set(4, 3, -0.2);
    cabin.add(mirrorL);
    cabin.add(mirrorR);

    // Exhaust Stacks
    const stackGeom = new THREE.CylinderGeometry(0.4, 0.4, 6, 16);
    const stack = new THREE.Mesh(stackGeom, chrome);
    stack.position.set(0, 3, 5.2);
    const stackCap = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.5, 16, 1, true, 0, Math.PI), chrome);
    stackCap.rotation.z = Math.PI / 2;
    stackCap.position.set(0, 3, 0);
    stack.add(stackCap);
    cabin.add(stack);

    group.add(cabin);
    parts.push({
        name: "Operator Cabin & Engine Housing",
        description: "Advanced ergonomic command center equipped with tinted blast-resistant glass, digital readouts, and air-ride seats.",
        material: "Steel / Tinted Glass / Chrome",
        function: "Operator protection and vehicle control.",
        assemblyOrder: 6,
        connections: ["Chassis Frame", "Steering Column", "Engine Block"],
        failureEffect: "Loss of vehicle driving capabilities.",
        cascadeFailures: ["System override failure"],
        originalPosition: {x: 16, y: 4, z: -2.4},
        explodedPosition: {x: 25, y: 15, z: 0}
    });

    // 4. Outriggers (X-Type Front, Swing Rear)
    const outriggers = [];
    const createOutrigger = (isFront, isLeft) => {
        const outriggerGroup = new THREE.Group();
        
        // Telescopic arm
        const armGeom = new THREE.BoxGeometry(2, 1.5, 8);
        const arm = new THREE.Mesh(armGeom, steel);
        
        // Inner extension
        const extGeom = new THREE.BoxGeometry(1.5, 1.2, 6);
        const ext = new THREE.Mesh(extGeom, chrome);
        ext.position.z = isLeft ? 5 : -5;
        ext.name = "Extension";

        // Vertical Hydraulic Jack
        const jackGeom = new THREE.CylinderGeometry(0.6, 0.6, 4, 32);
        const jack = new THREE.Mesh(jackGeom, darkSteel);
        jack.position.set(0, -1, isLeft ? 2 : -2);
        
        // Jack pad
        const padGeom = new THREE.CylinderGeometry(1.5, 1.5, 0.4, 32);
        const pad = new THREE.Mesh(padGeom, steel);
        pad.position.y = -2;
        jack.add(pad);

        ext.add(jack);
        arm.add(ext);
        outriggerGroup.add(arm);

        outriggerGroup.position.set(isFront ? 10 : -8, 3.5, isLeft ? 2.5 : -2.5);
        if(isFront) {
            outriggerGroup.rotation.y = isLeft ? Math.PI/6 : -Math.PI/6;
        } else {
            outriggerGroup.rotation.y = isLeft ? Math.PI/3 : -Math.PI/3;
        }
        
        // Store for animation
        outriggerGroup.userData = { isLeft, ext, jack };
        return outriggerGroup;
    };

    const outriggerFL = createOutrigger(true, true);
    const outriggerFR = createOutrigger(true, false);
    const outriggerRL = createOutrigger(false, true);
    const outriggerRR = createOutrigger(false, false);
    
    group.add(outriggerFL, outriggerFR, outriggerRL, outriggerRR);
    outriggers.push(outriggerFL, outriggerFR, outriggerRL, outriggerRR);

    parts.push({
        name: "X-Style Telescopic Outriggers",
        description: "Hydraulically extended stabilizing legs that dramatically increase the vehicle's footprint to counter boom leverage.",
        material: "Reinforced Steel / Hydraulics",
        function: "Prevents tipping during boom operation by shifting center of gravity.",
        assemblyOrder: 7,
        connections: ["Chassis Main Tube", "Hydraulic Manifold"],
        failureEffect: "Immediate roll-over hazard during pumping.",
        cascadeFailures: ["Chassis twist", "Turret bearing failure"],
        originalPosition: {x: 0, y: 3.5, z: 0},
        explodedPosition: {x: 0, y: 0, z: 20}
    });

    // 5. Pumping Unit & Hopper (Rear)
    const hopperGroup = new THREE.Group();
    hopperGroup.position.set(-16, 3, 0);

    // Hopper body (Lathe)
    const hopperPts = [];
    for(let i=0; i<=10; i++) {
        hopperPts.push(new THREE.Vector2(Math.sin(i*0.15)*3 + 1, (i*0.4) - 2));
    }
    const hopperGeom = new THREE.LatheGeometry(hopperPts, 32, 0, Math.PI);
    const hopper = new THREE.Mesh(hopperGeom, steel);
    hopper.rotation.x = -Math.PI / 2;
    hopper.rotation.z = Math.PI / 2;
    hopperGroup.add(hopper);

    // Twin S-Valve Cylinders
    const pumpCylGeom = new THREE.CylinderGeometry(0.8, 0.8, 4, 32);
    const pumpCyl1 = new THREE.Mesh(pumpCylGeom, darkSteel);
    pumpCyl1.rotation.x = Math.PI / 2;
    pumpCyl1.position.set(2, -1, 1);
    const pumpCyl2 = new THREE.Mesh(pumpCylGeom, darkSteel);
    pumpCyl2.rotation.x = Math.PI / 2;
    pumpCyl2.position.set(2, -1, -1);
    
    hopperGroup.add(pumpCyl1);
    hopperGroup.add(pumpCyl2);

    // Agitator shaft
    const agitatorGeom = new THREE.CylinderGeometry(0.2, 0.2, 6, 16);
    const agitator = new THREE.Mesh(agitatorGeom, chrome);
    agitator.rotation.x = Math.PI / 2;
    agitator.position.set(0, 0, 0);
    hopperGroup.add(agitator);

    group.add(hopperGroup);
    parts.push({
        name: "High-Pressure Concrete Hopper & S-Valve",
        description: "Twin-cylinder hydraulic concrete pump featuring an oscillating S-tube valve to direct flow from cylinders to the delivery line.",
        material: "Abrasion-Resistant Carbide Steel",
        function: "Mixing concrete and generating massive hydraulic pressure for vertical pumping.",
        assemblyOrder: 8,
        connections: ["Chassis Rear", "Delivery Pipe", "Hydraulic PTO"],
        failureEffect: "Blockage or burst lines, stopping concrete delivery.",
        cascadeFailures: ["Concrete hardening in pipes", "Hydraulic seal blowout"],
        originalPosition: {x: -16, y: 3, z: 0},
        explodedPosition: {x: -30, y: 5, z: 0}
    });

    // 6. Turret (Boom Base)
    const turretGroup = new THREE.Group();
    turretGroup.position.set(-2, 5, 0);

    // Slewing ring gear
    const gearGeom = new THREE.CylinderGeometry(3.5, 3.5, 0.8, 64);
    const gear = new THREE.Mesh(gearGeom, darkSteel);
    
    // Gear teeth
    for(let i=0; i<60; i++) {
        const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.8, 0.4), darkSteel);
        const angle = (i/60) * Math.PI * 2;
        tooth.position.set(Math.cos(angle)*3.6, 0, Math.sin(angle)*3.6);
        tooth.rotation.y = -angle;
        gear.add(tooth);
    }
    turretGroup.add(gear);

    // Turret Mast
    const mastGeom = new THREE.CylinderGeometry(2, 2.5, 3, 32);
    const mast = new THREE.Mesh(mastGeom, steel);
    mast.position.y = 1.9;
    turretGroup.add(mast);

    // Hydraulic Manifold box on turret
    const boxGeom = new THREE.BoxGeometry(1.5, 2, 2);
    const manifoldBox = new THREE.Mesh(boxGeom, darkSteel);
    manifoldBox.position.set(1.5, 2, 0);
    
    // Glowing control screen on manifold
    const screenGeom = new THREE.PlaneGeometry(1, 1.2);
    const screenMat = new THREE.MeshStandardMaterial({color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 2});
    const screen = new THREE.Mesh(screenGeom, screenMat);
    screen.position.set(0.76, 0, 0);
    screen.rotation.y = Math.PI / 2;
    manifoldBox.add(screen);
    turretGroup.add(manifoldBox);

    group.add(turretGroup);
    parts.push({
        name: "Slewing Turret & Mast",
        description: "Heavy-duty 360-degree rotating base powered by dual planetary gearboxes. Carries the entire weight of the boom.",
        material: "Cast Steel / Bronze Bearings",
        function: "Rotational positioning of the articulating boom arm.",
        assemblyOrder: 9,
        connections: ["Chassis Pedestal", "Boom Section 1", "Slew Motors"],
        failureEffect: "Loss of rotational control; boom swing hazards.",
        cascadeFailures: ["Ring gear strip", "Hydraulic manifold shear"],
        originalPosition: {x: -2, y: 5, z: 0},
        explodedPosition: {x: -2, y: 20, z: 0}
    });

    // 7. Boom Sections (Z-Fold Articulation)
    const booms = [];
    const pistons = [];
    const boomLengths = [12, 10, 8, 8];

    // Build hierarchical boom
    const boom1 = new THREE.Group();
    boom1.position.set(0, 3, 0); // Relative to turret mast
    turretGroup.add(boom1);

    const b1Truss = createBoomTruss(boomLengths[0], 1.2, 1.6);
    b1Truss.position.z = boomLengths[0]/2; // Shift origin to hinge
    b1Truss.rotation.y = -Math.PI / 2;
    boom1.add(b1Truss);
    booms.push(boom1);

    const boom2 = new THREE.Group();
    boom2.position.set(0, 0, boomLengths[0]);
    boom1.add(boom2);
    
    const b2Truss = createBoomTruss(boomLengths[1], 1.0, 1.4);
    b2Truss.position.z = boomLengths[1]/2;
    b2Truss.rotation.y = -Math.PI / 2;
    boom2.add(b2Truss);
    booms.push(boom2);

    const boom3 = new THREE.Group();
    boom3.position.set(0, 0, boomLengths[1]);
    boom2.add(boom3);

    const b3Truss = createBoomTruss(boomLengths[2], 0.8, 1.2);
    b3Truss.position.z = boomLengths[2]/2;
    b3Truss.rotation.y = -Math.PI / 2;
    boom3.add(b3Truss);
    booms.push(boom3);

    const boom4 = new THREE.Group();
    boom4.position.set(0, 0, boomLengths[2]);
    boom3.add(boom4);

    const b4Truss = createBoomTruss(boomLengths[3], 0.6, 1.0);
    b4Truss.position.z = boomLengths[3]/2;
    b4Truss.rotation.y = -Math.PI / 2;
    boom4.add(b4Truss);
    booms.push(boom4);

    // Delivery hose at the end
    const hoseGeom = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
            new THREE.Vector3(0,0,boomLengths[3]),
            new THREE.Vector3(0,-2,boomLengths[3]+1),
            new THREE.Vector3(0,-4,boomLengths[3]+1)
        ]), 16, 0.25, 16, false
    );
    const hose = new THREE.Mesh(hoseGeom, rubber);
    boom4.add(hose);

    // Boom Parts Meta
    parts.push({
        name: "Articulated Boom (4-Section Z-Fold)",
        description: "Lightweight, ultra-strong box-welded steel truss arms capable of precise Z-fold unfurling up to 40 meters.",
        material: "Hardox / Weldox High-Yield Steel",
        function: "Ariel delivery of high-pressure concrete to hard-to-reach pour sites.",
        assemblyOrder: 10,
        connections: ["Turret Mast", "Hydraulic Cylinders", "Delivery Pipe"],
        failureEffect: "Catastrophic collapse or structural snapping under concrete load.",
        cascadeFailures: ["Whip effect", "Cylinder blowout", "Turret overload"],
        originalPosition: {x: 0, y: 8, z: 0},
        explodedPosition: {x: 0, y: 35, z: 0}
    });

    // Add Hydraulic Cylinders connecting the booms
    // This requires complex grouping for IK simulation in animate loop
    const setupCylinder = (parentGroup, childGroup, length, radius, offsetParent, offsetChild) => {
        const cyl = createPiston(length, radius);
        cyl.position.copy(offsetParent);
        parentGroup.add(cyl);
        pistons.push({
            mesh: cyl,
            targetGroup: childGroup,
            targetOffset: offsetChild,
            baseLength: length
        });
    };

    // Piston 1: Mast to Boom1
    setupCylinder(turretGroup, boom1, 5, 0.4, new THREE.Vector3(0, 1, 1), new THREE.Vector3(0, 0, 4));
    // Piston 2: Boom1 to Boom2
    setupCylinder(boom1, boom2, 4, 0.35, new THREE.Vector3(0, 0.8, boomLengths[0]-2), new THREE.Vector3(0, 0.8, 2));
    // Piston 3: Boom2 to Boom3
    setupCylinder(boom2, boom3, 3, 0.3, new THREE.Vector3(0, -0.6, boomLengths[1]-1.5), new THREE.Vector3(0, -0.6, 1.5));
    // Piston 4: Boom3 to Boom4
    setupCylinder(boom3, boom4, 2.5, 0.25, new THREE.Vector3(0, 0.5, boomLengths[2]-1), new THREE.Vector3(0, 0.5, 1));

    parts.push({
        name: "High-Pressure Hydraulic Cylinders",
        description: "Heavy-duty lifting cylinders with multi-stage chrome rods and integrated counterbalance valves.",
        material: "Carbon Steel / Hard Chrome / Neoprene Seals",
        function: "Provide the massive force required to articulate and hold the boom sections against gravity and concrete weight.",
        assemblyOrder: 11,
        connections: ["Boom Truss Joints", "Hydraulic Lines", "Manifold Block"],
        failureEffect: "Freefall of boom sections.",
        cascadeFailures: ["Hose rupture", "Structural impact"],
        originalPosition: {x: 0, y: 12, z: 2},
        explodedPosition: {x: 0, y: 25, z: -15}
    });

    // 8. Delivery Pipe system
    // We add static pipes along the boom segments
    const createPipe = (length) => {
        const pipeGeom = new THREE.CylinderGeometry(0.2, 0.2, length, 16);
        const pipe = new THREE.Mesh(pipeGeom, chrome);
        pipe.rotation.x = Math.PI/2;
        pipe.position.set(0.6, 0.8, length/2); // offset to side
        return pipe;
    }
    boom1.add(createPipe(boomLengths[0]));
    boom2.add(createPipe(boomLengths[1]));
    boom3.add(createPipe(boomLengths[2]));
    boom4.add(createPipe(boomLengths[3]));

    parts.push({
        name: "Concrete Delivery Pipeline",
        description: "Twin-wall hardened seamless steel piping designed to withstand immense abrasive forces of aggregate under pressure.",
        material: "Induction-Hardened Steel",
        function: "Transporting pumped concrete from the hopper to the end hose.",
        assemblyOrder: 12,
        connections: ["S-Valve", "Boom Truss Side", "Rubber Delivery Hose"],
        failureEffect: "High-pressure concrete spray and pipeline explosion.",
        cascadeFailures: ["Whip damage to boom", "Operator injury"],
        originalPosition: {x: 0, y: 10, z: 0},
        explodedPosition: {x: 10, y: 30, z: 10}
    });

    // Additional Detail: Control Panel glowing lights and fluid lines
    const panelGeom = new THREE.BoxGeometry(2, 3, 0.5);
    const panel = new THREE.Mesh(panelGeom, steel);
    panel.position.set(-16, 2, -3); // side of hopper
    
    for(let i=0; i<8; i++) {
        const btnGeom = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 16);
        const mat = new THREE.MeshStandardMaterial({color: (i%2===0)?0xff0000:0x00ff00, emissive: (i%2===0)?0xff0000:0x00ff00, emissiveIntensity: 1.5});
        const btn = new THREE.Mesh(btnGeom, mat);
        btn.rotation.x = Math.PI/2;
        btn.position.set(-0.6 + (i%4)*0.4, 0.8 - Math.floor(i/4)*0.5, -0.25);
        panel.add(btn);
    }
    group.add(panel);

    // Initial Rest Pose
    boom1.rotation.x = Math.PI / 2; // Flat backward
    boom2.rotation.x = -Math.PI;    // Folded over boom1
    boom3.rotation.x = Math.PI;     // Folded back
    boom4.rotation.x = -Math.PI;    // Z-fold completely closed

    const description = "Ultra High-Tech Modern Concrete Pump Truck featuring a sophisticated 4-section Z-fold articulating boom, heavy-duty S-valve dual-piston pump, independent planetary drive chassis, and integrated intelligent hydraulic outriggers. This massive, extremely complex machine simulates real-world kinematics, hydraulic pressures, and precision fluid delivery for advanced construction operations.";

    const quizQuestions = [
        {
            question: "Why does the boom employ a 'Z-fold' articulation pattern?",
            options: ["To fit underneath power lines easier", "To allow unfolding in highly confined spaces with lower unfolding height clearance", "To increase the maximum pumping pressure", "To reduce the amount of hydraulic fluid required"],
            answer: 1,
            explanation: "Z-fold booms unfold in an accordion-like manner, allowing the machine to deploy the boom in tight spaces with restricted overhead clearance without having to unfold entirely upward first."
        },
        {
            question: "What is the primary function of the S-Valve inside the rear hopper?",
            options: ["To filter out large rocks from the concrete", "To shift back and forth, connecting the active pushing cylinder to the delivery line while the other pulls concrete from the hopper", "To add water and chemical admixtures into the mix", "To act as a structural counterweight during pumping"],
            answer: 1,
            explanation: "The S-Valve rapidly oscillates between the two material cylinders. As one pushes concrete into the pipe, the other retracts to suck in fresh concrete from the hopper."
        },
        {
            question: "Why must the outriggers be fully deployed before boom operation?",
            options: ["To prevent the tires from exploding under pressure", "To elevate the truck so the hopper can receive concrete", "To significantly widen the fulcrum point and center of gravity, preventing the massive leverage of the extended boom from tipping the truck", "To lock the suspension so the truck doesn't bounce"],
            answer: 2,
            explanation: "The massive weight and leverage of an extended boom, especially when filled with dense concrete, would instantly tip the truck over if the footprint wasn't massively widened by the outriggers."
        },
        {
            question: "What occurs if a hydraulic cylinder counterbalance valve fails while the boom is extended?",
            options: ["The pump runs in reverse", "The hydraulic fluid catches fire", "The affected boom section will abruptly freefall due to gravity, as the load holding pressure is lost", "The concrete instantly hardens in the pipe"],
            answer: 2,
            explanation: "Counterbalance (or load-holding) valves lock the hydraulic fluid in the cylinder to hold the load against gravity. If one fails, the fluid escapes and the boom section drops uncontrollably."
        },
        {
            question: "Why are twin-wall seamless pipes used on the boom instead of standard PVC or single-wall steel?",
            options: ["Because concrete is highly abrasive under high pressure (up to 85 bar), which would quickly wear through normal pipes, especially at bends", "To keep the concrete warm in winter", "They are lighter than PVC", "To allow the boom to bend without hinges"],
            answer: 0,
            explanation: "Concrete contains hard aggregates (stone/sand) that act like sandpaper when pumped at high velocities and pressures. Twin-wall induction-hardened pipes resist this extreme abrasion."
        }
    ];

    // ANIMATION
    const animate = (time, speed, meshes) => {
        // 1. Driving animation (Wheels rotation)
        const driveSpeed = speed * time * 2;
        wheels.forEach(wheel => {
            wheel.rotation.z = -driveSpeed;
        });

        // 2. Outriggers deployment ( Sine wave pacing )
        // Phase 1: slide out (ext), Phase 2: push down (jack)
        const outriggerCycle = (Math.sin(time * speed * 0.5) + 1) / 2; // 0 to 1
        outriggers.forEach(og => {
            const ext = og.userData.ext;
            const jack = og.userData.jack;
            
            // Extension slides out first (0 to 0.5)
            const extAmt = Math.min(outriggerCycle * 2, 1);
            ext.position.x = extAmt * (og.userData.isLeft ? 3 : -3);
            
            // Jack goes down next (0.5 to 1.0)
            const jackAmt = Math.max((outriggerCycle - 0.5) * 2, 0);
            jack.scale.y = 1 + jackAmt * 1.5;
            jack.position.y = -1 - (jackAmt * 1.5 * 2); // Shift down as it scales
        });

        // 3. Turret Rotation
        // Only rotate when outriggers are mostly deployed
        let turretRot = 0;
        if (outriggerCycle > 0.8) {
            turretRot = Math.sin((time * speed * 0.5) - Math.PI/2) * Math.PI/4;
        }
        turretGroup.rotation.y = turretRot;

        // 4. Boom Z-Fold Unfurling
        // Using smooth step functions triggered by outrigger cycle
        let unfold = Math.max((outriggerCycle - 0.8) * 5, 0); // 0 to 1 rapidly when outriggers down
        
        // Target angles for fully extended boom
        const targets = [Math.PI/6, Math.PI/8, -Math.PI/8, Math.PI/8]; // Arc shape
        // Start angles (folded)
        const starts = [Math.PI/2, -Math.PI, Math.PI, -Math.PI];

        boom1.rotation.x = THREE.MathUtils.lerp(starts[0], targets[0], unfold);
        boom2.rotation.x = THREE.MathUtils.lerp(starts[1], targets[1], unfold);
        boom3.rotation.x = THREE.MathUtils.lerp(starts[2], targets[2], unfold);
        boom4.rotation.x = THREE.MathUtils.lerp(starts[3], targets[3], unfold);

        // 5. Hydraulic Pistons LookAt and Scale
        // IK simulation: The outer sleeve needs to point at the child attachment point.
        // The inner rod needs to extend to reach the child attachment point.
        pistons.forEach(pData => {
            const { mesh, targetGroup, targetOffset, baseLength } = pData;
            
            // Get world position of the target attachment point
            const targetWorld = new THREE.Vector3();
            targetWorld.copy(targetOffset);
            targetWorld.applyMatrix4(targetGroup.matrixWorld);

            // Convert world target back to the piston's local space
            const targetLocal = targetWorld.clone();
            mesh.parent.worldToLocal(targetLocal);

            // Point piston towards target
            mesh.lookAt(targetWorld);
            // Three.js lookAt aligns Z-axis. Our cylinder is Y-axis aligned, so rotate it:
            mesh.rotateX(Math.PI / 2);

            // Calculate distance to target to adjust inner rod scale/position
            const dist = mesh.position.distanceTo(targetLocal);
            const extension = dist - (baseLength * 0.6); // subtract outer sleeve length
            
            // Find the inner rod mesh
            const rod = mesh.children.find(c => c.name === "InnerRod");
            if (rod) {
                // Adjust rod position to stick out the exact amount
                // cylinder origin is center, so shifting Y moves it along its length
                rod.position.y = (baseLength * 0.3) + (extension / 2);
                rod.scale.y = extension / (baseLength * 0.8);
            }
        });

        // 6. Concrete pumping pulse effect (simulating pressure surges)
        if (unfold > 0.9) {
            const pulse = (Math.sin(time * speed * 20) + 1) / 2;
            hose.scale.set(1 + pulse*0.1, 1, 1 + pulse*0.1);
            
            // Hopper agitator spin
            agitator.rotation.y = time * speed * 10;
        } else {
            hose.scale.set(1, 1, 1);
        }
    };

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}
