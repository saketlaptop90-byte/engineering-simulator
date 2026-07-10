import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // --------------------------------------------------------
    // Helper to add parts
    // --------------------------------------------------------
    function addPart(name, mesh, description, functionDesc, materialDesc, connections, assemblyOrder, failureEffect, cascadeFailures) {
        mesh.name = name;
        group.add(mesh);
        meshes[name] = mesh;
        
        parts.push({
            name,
            description,
            material: materialDesc,
            function: functionDesc,
            assemblyOrder,
            connections,
            failureEffect,
            cascadeFailures,
            originalPosition: { x: mesh.position.x, y: mesh.position.y, z: mesh.position.z },
            explodedPosition: { 
                x: mesh.position.x * 1.5 + (Math.random() * 2 - 1), 
                y: mesh.position.y * 1.5 + (Math.random() * 2 - 1), 
                z: mesh.position.z * 1.5 + (Math.random() * 2 - 1) 
            }
        });
    }

    // --------------------------------------------------------
    // Custom High-Tech Materials
    // --------------------------------------------------------
    const heatGlowMaterial = new THREE.MeshStandardMaterial({
        color: 0xff3300,
        emissive: 0xff1100,
        emissiveIntensity: 0.0,
        metalness: 0.8,
        roughness: 0.2
    });

    const screenMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000,
        emissive: 0x00aaff,
        emissiveIntensity: 0.8,
        metalness: 0.9,
        roughness: 0.1
    });

    const indicatorRed = new THREE.MeshStandardMaterial({
        color: 0x000000,
        emissive: 0xff0000,
        emissiveIntensity: 1.0,
        metalness: 0.5,
        roughness: 0.2
    });
    
    const indicatorGreen = new THREE.MeshStandardMaterial({
        color: 0x000000,
        emissive: 0x00ff00,
        emissiveIntensity: 1.0,
        metalness: 0.5,
        roughness: 0.2
    });

    // --------------------------------------------------------
    // 1. Base Frame (Complex Extrusion & Beveling)
    // --------------------------------------------------------
    const baseShape = new THREE.Shape();
    baseShape.moveTo(-5, -5);
    baseShape.lineTo(5, -5);
    baseShape.lineTo(6, -3);
    baseShape.lineTo(6, 3);
    baseShape.lineTo(5, 5);
    baseShape.lineTo(-5, 5);
    baseShape.lineTo(-6, 3);
    baseShape.lineTo(-6, -3);
    baseShape.lineTo(-5, -5);

    const baseExtrudeSettings = {
        depth: 1.5,
        bevelEnabled: true,
        bevelSegments: 5,
        steps: 2,
        bevelSize: 0.2,
        bevelThickness: 0.2
    };

    const baseGeometry = new THREE.ExtrudeGeometry(baseShape, baseExtrudeSettings);
    const baseMesh = new THREE.Mesh(baseGeometry, darkSteel);
    baseMesh.rotation.x = -Math.PI / 2;
    baseMesh.position.set(0, -1.5, 0);
    
    // Add intricate details to base
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const padGeo = new THREE.CylinderGeometry(0.5, 0.6, 0.5, 32);
        const pad = new THREE.Mesh(padGeo, rubber);
        pad.position.set(Math.cos(angle) * 4, -0.2, Math.sin(angle) * 4);
        baseMesh.add(pad);
    }

    addPart(
        "Base_Frame", baseMesh, 
        "Heavy duty cast iron vibration-dampening base.", 
        "Provides absolute stability for micro-precision friction measurements.",
        "Dark Steel / Vibration Dampening Rubber", 
        ["Support_Pillars", "Hydraulic_Piston_Housing"], 
        1, 
        "Excessive vibration, inaccurate wear measurements.", 
        ["Load_Cell_Sensor"]
    );

    // --------------------------------------------------------
    // 2. Support Pillars
    // --------------------------------------------------------
    const pillarsGroup = new THREE.Group();
    const pillarGeo = new THREE.CylinderGeometry(0.4, 0.4, 10, 32);
    const flangeGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.2, 32);
    
    const pillarPositions = [
        {x: -4, z: -4}, {x: 4, z: -4}, {x: -4, z: 4}, {x: 4, z: 4}
    ];

    pillarPositions.forEach(pos => {
        const p = new THREE.Mesh(pillarGeo, chrome);
        p.position.set(pos.x, 5, pos.z);
        const f1 = new THREE.Mesh(flangeGeo, steel);
        f1.position.set(0, -4.9, 0);
        p.add(f1);
        const f2 = new THREE.Mesh(flangeGeo, steel);
        f2.position.set(0, 4.9, 0);
        p.add(f2);
        pillarsGroup.add(p);
    });
    
    addPart(
        "Support_Pillars", pillarsGroup,
        "Four high-rigidity chrome-plated support columns.",
        "Maintains exact alignment between the motor spindle and the stationary ball cup under heavy hydraulic load.",
        "Chrome Plated Steel",
        ["Base_Frame", "Upper_Motor_Mount"],
        2,
        "Structural misalignment, uneven ball wear.",
        ["Spindle_Shaft", "Hydraulic_Piston"]
    );

    // --------------------------------------------------------
    // 3. Hydraulic Piston Housing
    // --------------------------------------------------------
    const housingPoints = [];
    for (let i = 0; i < 20; i++) {
        housingPoints.push(new THREE.Vector2(Math.sin(i * 0.2) * 0.2 + 1.5, i * 0.2));
    }
    const housingGeo = new THREE.LatheGeometry(housingPoints, 64);
    const housingMesh = new THREE.Mesh(housingGeo, darkSteel);
    housingMesh.position.set(0, 0, 0);
    
    // Add heavy bolting detail
    for (let i=0; i<12; i++) {
        const boltGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.4, 16);
        const bolt = new THREE.Mesh(boltGeo, chrome);
        const angle = (i / 12) * Math.PI * 2;
        bolt.position.set(Math.cos(angle) * 2, 0.2, Math.sin(angle) * 2);
        housingMesh.add(bolt);
    }

    addPart(
        "Hydraulic_Piston_Housing", housingMesh,
        "Thick-walled containment vessel for the primary hydraulic ram.",
        "Contains the ultra-high pressure hydraulic fluid required to generate the 10,000 N contact force.",
        "Forged Steel",
        ["Base_Frame", "Hydraulic_Piston"],
        3,
        "Catastrophic fluid leak, loss of loading pressure.",
        ["Hydraulic_High_Pressure_Lines", "Stationary_Ball_Cup"]
    );

    // --------------------------------------------------------
    // 4. Hydraulic Piston
    // --------------------------------------------------------
    const pistonGeo = new THREE.CylinderGeometry(1.2, 1.2, 3, 64);
    const pistonMesh = new THREE.Mesh(pistonGeo, chrome);
    pistonMesh.position.set(0, 2.5, 0);

    // Add piston rings
    for (let i=0; i<3; i++) {
        const ringGeo = new THREE.TorusGeometry(1.21, 0.05, 16, 64);
        const ring = new THREE.Mesh(ringGeo, rubber);
        ring.rotation.x = Math.PI / 2;
        ring.position.set(0, 0.5 - i * 0.4, 0);
        pistonMesh.add(ring);
    }

    addPart(
        "Hydraulic_Piston", pistonMesh,
        "Precision machined chrome hydraulic ram.",
        "Applies the upward force pushing the stationary balls into the rotating ball.",
        "Chrome Steel / Teflon Seals",
        ["Hydraulic_Piston_Housing", "Load_Cell_Sensor"],
        4,
        "Stuck ram, inability to apply force.",
        ["Load_Cell_Sensor"]
    );

    // --------------------------------------------------------
    // 5. Load Cell Sensor
    // --------------------------------------------------------
    const loadCellGeo = new THREE.CylinderGeometry(1.3, 1.3, 0.6, 64);
    const loadCellMesh = new THREE.Mesh(loadCellGeo, aluminum);
    loadCellMesh.position.set(0, 4.3, 0);
    
    // Add sensor wiring connector
    const connGeo = new THREE.BoxGeometry(0.4, 0.3, 0.6);
    const connMesh = new THREE.Mesh(connGeo, plastic);
    connMesh.position.set(1.3, 0, 0);
    loadCellMesh.add(connMesh);

    addPart(
        "Load_Cell_Sensor", loadCellMesh,
        "Piezoelectric multi-axis force transducer.",
        "Measures normal load and calculates frictional torque dynamically.",
        "Aircraft Aluminum / Piezo Crystals",
        ["Hydraulic_Piston", "Stationary_Ball_Cup"],
        5,
        "Erroneous friction readings, software panic.",
        ["Control_Panel_System"]
    );

    // --------------------------------------------------------
    // 6. Stationary Ball Cup
    // --------------------------------------------------------
    const cupPoints = [];
    cupPoints.push(new THREE.Vector2(0.1, 0));
    cupPoints.push(new THREE.Vector2(1.5, 0));
    cupPoints.push(new THREE.Vector2(1.8, 1));
    cupPoints.push(new THREE.Vector2(1.8, 1.5));
    cupPoints.push(new THREE.Vector2(1.4, 1.5));
    cupPoints.push(new THREE.Vector2(1.4, 0.5));
    cupPoints.push(new THREE.Vector2(0.1, 0.5));
    
    const cupGeo = new THREE.LatheGeometry(cupPoints, 64);
    const cupMesh = new THREE.Mesh(cupGeo, steel);
    cupMesh.position.set(0, 4.6, 0);

    // Lubricant inside the cup
    const lubeGeo = new THREE.CylinderGeometry(1.3, 1.3, 0.4, 64);
    const lubeMesh = new THREE.Mesh(lubeGeo, tinted);
    lubeMesh.position.set(0, 0.7, 0);
    cupMesh.add(lubeMesh);

    addPart(
        "Stationary_Ball_Cup", cupMesh,
        "Machined cup holding the lubricant and the three stationary balls.",
        "Maintains tight clamping of the lower balls and contains the test lubricant bath.",
        "Hardened Steel",
        ["Load_Cell_Sensor", "Stationary_Balls"],
        6,
        "Balls spin freely, voiding the test.",
        ["Stationary_Balls"]
    );

    // --------------------------------------------------------
    // 7. Stationary Balls (3x)
    // --------------------------------------------------------
    const ballsGroup = new THREE.Group();
    const ballGeo = new THREE.SphereGeometry(0.3, 64, 64);
    const r = 0.35; // Distance from center
    
    const ball1 = new THREE.Mesh(ballGeo, chrome);
    ball1.position.set(0, 1.0, r);
    const ball2 = new THREE.Mesh(ballGeo, chrome);
    ball2.position.set(r * 0.866, 1.0, -r * 0.5);
    const ball3 = new THREE.Mesh(ballGeo, chrome);
    ball3.position.set(-r * 0.866, 1.0, -r * 0.5);
    
    ballsGroup.add(ball1);
    ballsGroup.add(ball2);
    ballsGroup.add(ball3);
    
    ballsGroup.position.set(0, 4.6, 0);

    // Add friction glow mesh on the balls
    const glowGeo = new THREE.SphereGeometry(0.31, 32, 32);
    const glow1 = new THREE.Mesh(glowGeo, heatGlowMaterial);
    const glow2 = new THREE.Mesh(glowGeo, heatGlowMaterial);
    const glow3 = new THREE.Mesh(glowGeo, heatGlowMaterial);
    ball1.add(glow1);
    ball2.add(glow2);
    ball3.add(glow3);
    
    meshes.frictionGlows = [glow1, glow2, glow3];

    addPart(
        "Stationary_Balls", ballsGroup,
        "Three standard 12.7mm (1/2 inch) hardened steel test balls.",
        "Act as the stationary friction surfaces where wear scars are generated and measured.",
        "AISI 52100 Chrome Alloy Steel",
        ["Stationary_Ball_Cup", "Rotating_Ball"],
        7,
        "Extreme wear scar, welding to the rotating ball.",
        ["Rotating_Ball", "Spindle_Shaft"]
    );

    // --------------------------------------------------------
    // 8. Rotating Ball
    // --------------------------------------------------------
    const topBallGeo = new THREE.SphereGeometry(0.3, 64, 64);
    const topBallMesh = new THREE.Mesh(topBallGeo, chrome);
    // Positioned exactly touching the 3 lower balls
    // sqrt(0.6^2 - 0.35^2) = 0.487
    topBallMesh.position.set(0, 5.6 + 0.487, 0);

    const topGlow = new THREE.Mesh(new THREE.SphereGeometry(0.31, 32, 32), heatGlowMaterial);
    topBallMesh.add(topGlow);
    meshes.frictionGlows.push(topGlow);

    addPart(
        "Rotating_Ball", topBallMesh,
        "The upper 12.7mm ball held in the motorized collet.",
        "Spins at up to 10,000 RPM against the stationary balls to simulate extreme boundary lubrication conditions.",
        "AISI 52100 Chrome Alloy Steel",
        ["Stationary_Balls", "Spindle_Chuck"],
        8,
        "Shattering under extreme pressure, destroying the collet.",
        ["Spindle_Chuck"]
    );

    // --------------------------------------------------------
    // 9. Spindle Chuck / Collet
    // --------------------------------------------------------
    const chuckPoints = [];
    chuckPoints.push(new THREE.Vector2(0.3, 0));
    chuckPoints.push(new THREE.Vector2(0.6, 0.5));
    chuckPoints.push(new THREE.Vector2(0.8, 1.5));
    chuckPoints.push(new THREE.Vector2(0.2, 1.5));
    const chuckGeo = new THREE.LatheGeometry(chuckPoints, 32);
    const chuckMesh = new THREE.Mesh(chuckGeo, steel);
    chuckMesh.position.set(0, 6.087, 0);
    chuckMesh.rotation.x = Math.PI; // point downwards

    // Add slits for collet
    for (let i = 0; i < 4; i++) {
        const slitGeo = new THREE.BoxGeometry(0.05, 1.5, 1.8);
        const slit = new THREE.Mesh(slitGeo, darkSteel);
        slit.rotation.y = (i / 4) * Math.PI;
        slit.position.y = 0.75;
        chuckMesh.add(slit);
    }

    addPart(
        "Spindle_Chuck", chuckMesh,
        "High-speed precision collet mechanism.",
        "Grips the rotating upper ball firmly to ensure zero runout during high-speed rotation.",
        "Tool Steel",
        ["Rotating_Ball", "Spindle_Shaft"],
        9,
        "Ball slips, catastrophic high-speed ejection.",
        ["Rotating_Ball"]
    );

    // --------------------------------------------------------
    // 10. Spindle Shaft
    // --------------------------------------------------------
    const shaftGeo = new THREE.CylinderGeometry(0.4, 0.4, 3, 32);
    const shaftMesh = new THREE.Mesh(shaftGeo, chrome);
    shaftMesh.position.set(0, 7.6, 0);

    addPart(
        "Spindle_Shaft", shaftMesh,
        "Balanced high-speed drive shaft connecting the motor to the chuck.",
        "Transmits high torque and rotational velocity without inducing harmonics.",
        "Forged Chrome-Moly Steel",
        ["Spindle_Chuck", "Drive_Motor"],
        10,
        "Shaft warping, severe vibration.",
        ["Drive_Motor", "Support_Pillars"]
    );

    // --------------------------------------------------------
    // 11. Drive Motor
    // --------------------------------------------------------
    const motorGroup = new THREE.Group();
    motorGroup.position.set(0, 10.5, 0);

    const motorBodyGeo = new THREE.CylinderGeometry(2.5, 2.5, 4, 64);
    const motorBody = new THREE.Mesh(motorBodyGeo, steel);
    motorBody.rotation.x = Math.PI / 2;
    motorGroup.add(motorBody);
    
    // Add massive heat sinks around the motor
    for (let i = 0; i < 36; i++) {
        const finGeo = new THREE.BoxGeometry(0.2, 5.5, 0.8);
        const fin = new THREE.Mesh(finGeo, aluminum);
        const angle = (i / 36) * Math.PI * 2;
        fin.position.set(Math.cos(angle) * 2.7, 0, Math.sin(angle) * 2.7);
        fin.lookAt(0, 0, 0);
        motorGroup.add(fin);
    }
    
    // End caps
    const endCapGeo = new THREE.CylinderGeometry(2.6, 2.6, 0.5, 64);
    const frontCap = new THREE.Mesh(endCapGeo, darkSteel);
    frontCap.rotation.x = Math.PI / 2;
    frontCap.position.set(0, -2.2, 0);
    motorGroup.add(frontCap);
    
    const rearCap = new THREE.Mesh(endCapGeo, darkSteel);
    rearCap.rotation.x = Math.PI / 2;
    rearCap.position.set(0, 2.2, 0);
    motorGroup.add(rearCap);

    addPart(
        "Drive_Motor", motorGroup,
        "30 kW Brushless Servo AC Motor.",
        "Drives the spindle shaft at precise RPMs while overcoming extreme frictional torque.",
        "Steel / Copper Windings / Neodymium Magnets",
        ["Spindle_Shaft", "Upper_Motor_Mount", "Motor_Power_Cables"],
        11,
        "Motor burnout, complete test failure.",
        ["Spindle_Shaft"]
    );

    // --------------------------------------------------------
    // 12. Upper Motor Mount
    // --------------------------------------------------------
    const upperMountGeo = new THREE.BoxGeometry(9, 1.5, 9);
    const upperMountMesh = new THREE.Mesh(upperMountGeo, darkSteel);
    upperMountMesh.position.set(0, 9.5, 0);
    
    // Create holes for the pillars
    pillarPositions.forEach(pos => {
        const holeGeo = new THREE.CylinderGeometry(0.45, 0.45, 1.6, 32);
        const hole = new THREE.Mesh(holeGeo, rubber);
        hole.position.set(pos.x, 0, pos.z);
        upperMountMesh.add(hole);
    });

    addPart(
        "Upper_Motor_Mount", upperMountMesh,
        "Massive vibration-isolated crossbeam.",
        "Holds the heavy drive motor and anchors the top of the support pillars.",
        "Cast Iron",
        ["Drive_Motor", "Support_Pillars"],
        12,
        "Mount fracture, motor falls.",
        ["Drive_Motor", "Spindle_Shaft"]
    );

    // --------------------------------------------------------
    // 13. Hydraulic Fluid Reservoir
    // --------------------------------------------------------
    const tankGeo = new THREE.CylinderGeometry(1.5, 1.5, 4, 32);
    const tankMesh = new THREE.Mesh(tankGeo, copper);
    tankMesh.position.set(6, 2, 0);
    
    // Add glass fluid level indicator
    const glassGeo = new THREE.BoxGeometry(0.2, 3, 0.4);
    const glassMesh = new THREE.Mesh(glassGeo, glass);
    glassMesh.position.set(-1.45, 0, 0);
    tankMesh.add(glassMesh);

    // Add glowing fluid inside glass
    const fluidGeo = new THREE.BoxGeometry(0.1, 2.5, 0.3);
    const fluidMat = new THREE.MeshStandardMaterial({color: 0xffaa00, emissive: 0xaa5500, transparent: true, opacity: 0.8});
    const fluidMesh = new THREE.Mesh(fluidGeo, fluidMat);
    fluidMesh.position.set(0, -0.2, 0);
    glassMesh.add(fluidMesh);

    addPart(
        "Hydraulic_Fluid_Reservoir", tankMesh,
        "High-capacity pressurized oil tank.",
        "Stores and cools the hydraulic fluid used by the main ram.",
        "Copper / Glass / Steel",
        ["Hydraulic_High_Pressure_Lines", "Base_Frame"],
        13,
        "Fluid boiling, cavitation in the pump.",
        ["Hydraulic_Piston"]
    );

    // --------------------------------------------------------
    // 14. Hydraulic High Pressure Lines
    // --------------------------------------------------------
    const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(6, 0.5, 0),
        new THREE.Vector3(4, 0.5, -2),
        new THREE.Vector3(2, 0.2, -1.5),
        new THREE.Vector3(1, 0.5, 0),
        new THREE.Vector3(0, 1.0, 0)
    ]);
    const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.15, 16, false);
    const tubeMesh = new THREE.Mesh(tubeGeo, rubber);
    
    // Add ribbed protective casing to the tube
    for(let i=0; i<100; i+=2) {
        const p = curve.getPointAt(i/100);
        const t = curve.getTangentAt(i/100);
        const rib = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.04, 16, 16), steel);
        rib.position.copy(p);
        rib.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1), t);
        tubeMesh.add(rib);
    }

    addPart(
        "Hydraulic_High_Pressure_Lines", tubeMesh,
        "Steel-braided hydraulic hoses rated for 15,000 PSI.",
        "Delivers high-pressure fluid from the pump/reservoir to the piston housing.",
        "Synthetic Rubber / Kevlar / Steel Braid",
        ["Hydraulic_Fluid_Reservoir", "Hydraulic_Piston_Housing"],
        14,
        "Hose rupture, lethal high-pressure fluid injection.",
        ["Hydraulic_Piston"]
    );

    // --------------------------------------------------------
    // 15. Control Panel Box
    // --------------------------------------------------------
    const panelGroup = new THREE.Group();
    panelGroup.position.set(-6, 5, 2);
    panelGroup.rotation.y = Math.PI / 6;

    const boxGeo = new THREE.BoxGeometry(1, 4, 3);
    const boxMesh = new THREE.Mesh(boxGeo, plastic);
    panelGroup.add(boxMesh);

    // Arm connecting it to the machine
    const armGeo = new THREE.CylinderGeometry(0.2, 0.2, 3, 16);
    const armMesh = new THREE.Mesh(armGeo, steel);
    armMesh.rotation.z = Math.PI / 2;
    armMesh.position.set(2, -1, -2);
    panelGroup.add(armMesh);

    addPart(
        "Control_Panel_Box", panelGroup,
        "Ergonomic operator station housing the HMI (Human Machine Interface).",
        "Allows the operator to set RPM, normal load, test duration, and monitor real-time frictional torque.",
        "ABS Plastic / Steel Arm",
        ["Support_Pillars"],
        15,
        "Loss of user control, automatic E-Stop engaged.",
        ["Control_Screen", "Drive_Motor"]
    );

    // --------------------------------------------------------
    // 16. Control Screen
    // --------------------------------------------------------
    const screenGeo = new THREE.PlaneGeometry(2.5, 1.8);
    const screenMesh = new THREE.Mesh(screenGeo, screenMaterial);
    screenMesh.rotation.y = Math.PI / 2;
    screenMesh.position.set(0.51, 0.5, 0);

    addPart(
        "Control_Screen", screenMesh,
        "High-resolution OLED telemetry display.",
        "Displays real-time graphs of coefficient of friction, load force, and lubricant temperature.",
        "Glass / OLED Panel",
        ["Control_Panel_Box"],
        16,
        "Display burnout, blind operation.",
        []
    );

    // --------------------------------------------------------
    // 17. Control Buttons (E-Stop and Start)
    // --------------------------------------------------------
    const btnGroup = new THREE.Group();
    
    // E-Stop (Big red button)
    const estopGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 32);
    const estop = new THREE.Mesh(estopGeo, indicatorRed);
    estop.rotation.z = Math.PI / 2;
    estop.position.set(0.51, -1.0, 0.8);
    btnGroup.add(estop);

    // Start (Green button)
    const startGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 32);
    const start = new THREE.Mesh(startGeo, indicatorGreen);
    start.rotation.z = Math.PI / 2;
    start.position.set(0.51, -1.0, 0.0);
    btnGroup.add(start);

    // Dial
    const dialGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.15, 32);
    const dial = new THREE.Mesh(dialGeo, aluminum);
    dial.rotation.z = Math.PI / 2;
    dial.position.set(0.51, -1.0, -0.8);
    btnGroup.add(dial);

    meshes.Control_Panel_Box.add(btnGroup);

    addPart(
        "Control_Buttons", btnGroup,
        "Tactile hardware switches including a master Emergency Stop.",
        "Provides immediate physical overrides independent of the software HMI.",
        "Plastic / Aluminum / Gold Contacts",
        ["Control_Panel_Box"],
        17,
        "Switch failure, inability to abort test in emergency.",
        ["Drive_Motor"]
    );

    // --------------------------------------------------------
    // 18. Motor Power Cables
    // --------------------------------------------------------
    const cableCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 11, 2.5),
        new THREE.Vector3(1, 11.5, 4),
        new THREE.Vector3(3, 10, 5),
        new THREE.Vector3(4, 5, 5),
        new THREE.Vector3(4, 0, 4)
    ]);
    const cableGeo = new THREE.TubeGeometry(cableCurve, 64, 0.2, 16, false);
    const cableMesh = new THREE.Mesh(cableGeo, rubber);

    addPart(
        "Motor_Power_Cables", cableMesh,
        "Heavy gauge shielded 3-phase power conduits.",
        "Delivers hundreds of amps to the servo motor while shielding sensitive sensors from EMI.",
        "Copper Core / Silicon Insulation / Braided Shield",
        ["Drive_Motor", "Base_Frame"],
        18,
        "Insulation breakdown, massive short circuit.",
        ["Drive_Motor", "Load_Cell_Sensor"]
    );

    // --------------------------------------------------------
    // Animation Logic
    // --------------------------------------------------------
    const animate = (time, speed, meshes) => {
        // High speed rotation of the spindle, chuck, and top ball
        const rotationSpeed = time * speed * 20.0; // Very fast
        meshes.Spindle_Shaft.rotation.y = rotationSpeed;
        meshes.Spindle_Chuck.rotation.y = rotationSpeed;
        meshes.Rotating_Ball.rotation.y = rotationSpeed;
        
        // Hydraulic Piston slow oscillation (applying variable pressure)
        const pistonOffset = Math.sin(time * speed * 2) * 0.1;
        meshes.Hydraulic_Piston.position.y = 2.5 + pistonOffset;
        meshes.Load_Cell_Sensor.position.y = 4.3 + pistonOffset;
        meshes.Stationary_Ball_Cup.position.y = 4.6 + pistonOffset;
        meshes.Stationary_Balls.position.y = 4.6 + pistonOffset;

        // Friction glowing effect - pulse based on speed and contact pressure
        const intensity = 0.5 + Math.sin(time * speed * 5) * 0.5; // pulses 0 to 1
        meshes.frictionGlows.forEach(glow => {
            // Emissive intensity scales with pressure
            glow.material.emissiveIntensity = intensity * 3.0; 
            // Scale up slightly to simulate heat expansion/plasma
            const scale = 1.0 + (intensity * 0.05);
            glow.scale.set(scale, scale, scale);
        });

        // Control Panel Screen blinking data
        if (Math.floor(time * speed * 10) % 2 === 0) {
            meshes.Control_Screen.material.emissiveIntensity = 0.8 + Math.random() * 0.4;
        }
    };

    // --------------------------------------------------------
    // Description & Quiz
    // --------------------------------------------------------
    const description = "The Extreme Pressure Four-Ball Tester is a highly advanced tribology instrument used to evaluate the wear preventive, extreme pressure, and friction properties of lubricants. By rotating one steel ball against three stationary steel balls immersed in the test lubricant under massive hydraulic loads, engineers can determine the exact point of lubrication failure and cold welding. This machine features a 30kW servo drive, an ultra-precise piezoelectric load cell, and a 10,000 N hydraulic ram, making it capable of simulating the most severe mechanical environments found in aerospace and heavy industry.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Hydraulic Piston in the Four-Ball Tester?",
            options: [
                "To rotate the upper ball at high speeds.",
                "To cool the lubricant during the test.",
                "To apply massive upward force pressing the stationary balls into the rotating ball.",
                "To dampen vibrations from the drive motor."
            ],
            correctOption: 2
        },
        {
            question: "Why does the machine utilize three stationary balls instead of a flat surface?",
            options: [
                "To save money on test materials.",
                "To create a geometrically stable 3-point contact that centers the rotating ball perfectly.",
                "Because a flat surface cannot hold lubricant.",
                "To increase the overall mass of the machine."
            ],
            correctOption: 1
        },
        {
            question: "What is the purpose of the Load Cell Sensor located below the ball cup?",
            options: [
                "To measure the rotational RPM of the motor.",
                "To precisely measure the normal force and calculate frictional torque.",
                "To measure the temperature of the lubricant bath.",
                "To detect acoustic emissions from the bearings."
            ],
            correctOption: 1
        },
        {
            question: "What failure is likely to occur if the Extreme Pressure (EP) additives in the lubricant completely fail during testing?",
            options: [
                "The motor will spin faster due to lack of resistance.",
                "The stationary balls will begin to rotate.",
                "The balls will experience severe adhesive wear and weld together.",
                "The hydraulic fluid will boil."
            ],
            correctOption: 2
        },
        {
            question: "Why is the Spindle Chuck/Collet mechanism critical to the validity of the test?",
            options: [
                "It holds the upper ball securely with near-zero runout to prevent wobble and uneven wear scars.",
                "It pumps hydraulic fluid to the upper bearings.",
                "It electronically transmits torque data to the control panel.",
                "It acts as a heat sink for the upper rotating ball."
            ],
            correctOption: 0
        }
    ];

    return { group, parts, description, quizQuestions, animate };
}
// Auto-generated missing stub
export function createFourBallTester() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
