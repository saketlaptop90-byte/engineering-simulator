import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // ==========================================
    // CUSTOM MATERIALS
    // ==========================================
    const neonRed = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 2.5, roughness: 0.1, metalness: 0.8 });
    const neonGreen = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 2.5, roughness: 0.1, metalness: 0.8 });
    const neonBlue = new THREE.MeshStandardMaterial({ color: 0x0088ff, emissive: 0x0088ff, emissiveIntensity: 2.0, roughness: 0.2, metalness: 0.8 });
    const fluidMat = new THREE.MeshPhysicalMaterial({ color: 0xddaa00, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.0, ior: 1.5, thickness: 1.0 });
    const waterMat = new THREE.MeshPhysicalMaterial({ color: 0x00ffee, transmission: 0.95, opacity: 1, transparent: true, roughness: 0.05, ior: 1.33, thickness: 0.8 });
    const displayMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.2, metalness: 0.9 });
    const wireMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8, metalness: 0.1 });

    // ==========================================
    // HELPER FUNCTIONS
    // ==========================================
    function createBolt() {
        const geom = new THREE.CylinderGeometry(0.06, 0.06, 0.08, 6);
        const mesh = new THREE.Mesh(geom, chrome);
        mesh.rotation.x = Math.PI / 2;
        return mesh;
    }

    function createMesh(geom, mat, x=0, y=0, z=0, rx=0, ry=0, rz=0) {
        const mesh = new THREE.Mesh(geom, mat);
        mesh.position.set(x, y, z);
        mesh.rotation.set(rx, ry, rz);
        return mesh;
    }

    // ==========================================
    // 1. TITANIUM CHASSIS & MOBILE BASE
    // ==========================================
    const chassisGroup = new THREE.Group();
    
    // Main Chassis Body (Complex Extrude)
    const chassisShape = new THREE.Shape();
    const w = 5, d = 10;
    chassisShape.moveTo(-w/2, -d/2);
    chassisShape.lineTo(w/2, -d/2);
    chassisShape.lineTo(w/2, d/2);
    chassisShape.lineTo(-w/2, d/2);
    chassisShape.lineTo(-w/2, -d/2);
    const chassisExtrude = { depth: 1.5, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.2, bevelThickness: 0.2 };
    const chassisGeom = new THREE.ExtrudeGeometry(chassisShape, chassisExtrude);
    chassisGeom.rotateX(Math.PI / 2);
    const chassis = createMesh(chassisGeom, darkSteel, 0, 2.5, 0);
    chassisGroup.add(chassis);

    // Front Grille
    const grilleGroup = new THREE.Group();
    for(let i=0; i<15; i++) {
        const barGeom = new THREE.CylinderGeometry(0.08, 0.08, 4);
        const bar = createMesh(barGeom, chrome, 0, 1.2 + i*0.12, 5.1, 0, 0, Math.PI/2);
        grilleGroup.add(bar);
    }
    chassisGroup.add(grilleGroup);

    // Rivets along chassis
    for(let i=0; i<20; i++) {
        const rivetL = createBolt();
        rivetL.position.set(-2.6, 2.0, -4.5 + i*0.48);
        rivetL.rotation.y = -Math.PI / 2;
        chassisGroup.add(rivetL);

        const rivetR = createBolt();
        rivetR.position.set(2.6, 2.0, -4.5 + i*0.48);
        rivetR.rotation.y = Math.PI / 2;
        chassisGroup.add(rivetR);
    }

    parts.push({
        name: "TitaniumChassis",
        description: "Massive titanium-reinforced industrial crawler chassis designed to absorb extreme seismic disturbances and provide a completely stable platform for rheological measurements.",
        material: "Dark Steel / Titanium",
        function: "Structural foundation",
        assemblyOrder: 1,
        connections: ["OffRoadTreadArray", "HydraulicLiftBoom", "OperatorCabin"],
        failureEffect: "Chassis flex would misalign the boom arm gyroscopes, causing the viscometer tube to deviate from vertical.",
        cascadeFailures: ["Measurement Inaccuracy", "Structural Collapse"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 }
    });
    group.add(chassisGroup);

    // ==========================================
    // 2. OFF-ROAD TIRES & AXLES
    // ==========================================
    const tiresGroup = new THREE.Group();
    const tirePositions = [
        [-3.8, 1.6, -3.5], [3.8, 1.6, -3.5],
        [-3.8, 1.6, 3.5], [3.8, 1.6, 3.5]
    ];
    meshes.wheels = [];

    tirePositions.forEach((pos, index) => {
        const wheel = new THREE.Group();
        
        // Main Torus
        const tireGeom = new THREE.TorusGeometry(1.6, 0.65, 32, 64);
        const tire = createMesh(tireGeom, rubber, 0,0,0, 0, Math.PI/2, 0);
        wheel.add(tire);
        
        // Hundreds of tiny extruded BoxGeometry lugs
        const lugsGroup = new THREE.Group();
        const lugCount = 72;
        for(let i=0; i<lugCount; i++) {
            const angle = (i / lugCount) * Math.PI * 2;
            const lugGeom = new THREE.BoxGeometry(1.5, 0.25, 0.35);
            const lug = createMesh(lugGeom, rubber, 0, Math.sin(angle)*1.95, Math.cos(angle)*1.95, -angle, 0, 0);
            
            // Add chevron pattern offset
            if (i % 2 === 0) {
                lug.rotation.y = 0.2;
            } else {
                lug.rotation.y = -0.2;
            }
            lugsGroup.add(lug);
        }
        wheel.add(lugsGroup);

        // Complex Rims with Spoke Array
        const rimGeom = new THREE.CylinderGeometry(1.0, 1.0, 1.2, 32);
        const rim = createMesh(rimGeom, chrome, 0,0,0, 0,0, Math.PI/2);
        wheel.add(rim);

        const hubGeom = new THREE.CylinderGeometry(0.4, 0.4, 1.4, 16);
        const hub = createMesh(hubGeom, steel, 0,0,0, 0,0, Math.PI/2);
        wheel.add(hub);

        for(let i=0; i<12; i++) {
            const spokeGeom = new THREE.CylinderGeometry(0.1, 0.1, 2.0);
            const spoke = createMesh(spokeGeom, darkSteel, 0,0,0, 0,0, 0);
            spoke.rotation.x = (i / 12) * Math.PI * 2;
            spoke.rotation.z = Math.PI/2;
            wheel.add(spoke);
        }

        // Add bolts to hub
        for(let i=0; i<8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const bolt = createBolt();
            const sign = pos[0] > 0 ? 1 : -1;
            bolt.position.set(sign * 0.72, Math.cos(angle)*0.25, Math.sin(angle)*0.25);
            bolt.rotation.z = Math.PI / 2;
            wheel.add(bolt);
        }

        wheel.position.set(...pos);
        tiresGroup.add(wheel);
        meshes.wheels.push(wheel);

        // Axles connecting to chassis
        const axleGeom = new THREE.CylinderGeometry(0.3, 0.3, 2.0);
        const axle = createMesh(axleGeom, darkSteel, pos[0] > 0 ? pos[0]-1 : pos[0]+1, pos[1], pos[2], 0,0, Math.PI/2);
        tiresGroup.add(axle);
    });

    parts.push({
        name: "OffRoadTreadArray",
        description: "Colossal multi-lug vulcanized rubber tires featuring hundreds of chevron cleats, mounted on complex chromed spoke rims. Enables viscometer deployment in rugged terrain.",
        material: "Rubber / Chrome / Steel",
        function: "All-terrain locomotion and vibration dampening",
        assemblyOrder: 2,
        connections: ["TitaniumChassis"],
        failureEffect: "Tire deflation leads to catastrophic chassis tilt, instantly voiding all gravity-dependent viscometric timing data.",
        cascadeFailures: ["Immobilization", "Measurement Failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 8 }
    });
    group.add(tiresGroup);

    // ==========================================
    // 3. OPERATOR CABIN & CONTROLS
    // ==========================================
    const cabinGroup = new THREE.Group();
    
    // Cabin Shell
    const cabinShape = new THREE.Shape();
    cabinShape.moveTo(-2, 0);
    cabinShape.lineTo(2, 0);
    cabinShape.lineTo(2, 2.5);
    cabinShape.lineTo(1.5, 4.0);
    cabinShape.lineTo(-1.5, 4.0);
    cabinShape.lineTo(-2, 2.5);
    cabinShape.lineTo(-2, 0);
    const cabinExtrude = { depth: 3.5, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.1, bevelThickness: 0.1 };
    const cabinGeom = new THREE.ExtrudeGeometry(cabinShape, cabinExtrude);
    const cabin = createMesh(cabinGeom, plastic, 0, 2.5, 1.5);
    cabinGroup.add(cabin);

    // Tinted Glass Windows
    const frontWindow = createMesh(new THREE.PlaneGeometry(2.8, 1.4), tinted, 0, 5.0, 5.05, -0.2, 0, 0);
    cabinGroup.add(frontWindow);
    const sideWindowL = createMesh(new THREE.PlaneGeometry(3.0, 1.4), tinted, -2.05, 5.0, 3.25, 0, -Math.PI/2, 0);
    sideWindowL.rotation.x = -0.15;
    cabinGroup.add(sideWindowL);
    const sideWindowR = createMesh(new THREE.PlaneGeometry(3.0, 1.4), tinted, 2.05, 5.0, 3.25, 0, Math.PI/2, 0);
    sideWindowR.rotation.x = -0.15;
    cabinGroup.add(sideWindowR);

    // Interior: Steering Wheel & Joysticks (Visible through glass)
    const steeringCol = createMesh(new THREE.CylinderGeometry(0.1, 0.1, 0.8), plastic, 0, 4.2, 4.3, Math.PI/4, 0, 0);
    cabinGroup.add(steeringCol);
    const wheelGeom = new THREE.TorusGeometry(0.4, 0.06, 16, 32);
    const steeringWheel = createMesh(wheelGeom, darkSteel, 0, 4.5, 4.6, -Math.PI/4, 0, 0);
    for(let i=0; i<3; i++) {
        const swSpoke = createMesh(new THREE.CylinderGeometry(0.04, 0.04, 0.8), darkSteel, 0,0,0, 0,0, (i/3)*Math.PI);
        steeringWheel.add(swSpoke);
    }
    cabinGroup.add(steeringWheel);

    const joystickBaseL = createMesh(new THREE.CylinderGeometry(0.2, 0.2, 0.3), darkSteel, -0.8, 4.0, 4.0);
    const stickL = createMesh(new THREE.CylinderGeometry(0.05, 0.05, 0.6), chrome, 0, 0.3, 0);
    const knobL = createMesh(new THREE.SphereGeometry(0.12), neonRed, 0, 0.6, 0);
    joystickBaseL.add(stickL); joystickBaseL.add(knobL);
    cabinGroup.add(joystickBaseL);

    const joystickBaseR = createMesh(new THREE.CylinderGeometry(0.2, 0.2, 0.3), darkSteel, 0.8, 4.0, 4.0);
    const stickR = createMesh(new THREE.CylinderGeometry(0.05, 0.05, 0.6), chrome, 0, 0.3, 0);
    const knobR = createMesh(new THREE.SphereGeometry(0.12), neonGreen, 0, 0.6, 0);
    joystickBaseR.add(stickR); joystickBaseR.add(knobR);
    cabinGroup.add(joystickBaseR);

    // Interior: Glowing Control Screens
    const dashPanel = createMesh(new THREE.PlaneGeometry(2.0, 0.8), displayMat, 0, 4.4, 4.8, -0.6, 0, 0);
    meshes.dashLines = [];
    for(let i=0; i<8; i++) {
        const dLine = createMesh(new THREE.PlaneGeometry(0.15, 0.05), neonBlue, -0.8 + i*0.22, 0, 0.02);
        dashPanel.add(dLine);
        meshes.dashLines.push(dLine);
    }
    cabinGroup.add(dashPanel);

    // Side Mirrors
    const mirrorLGrp = new THREE.Group();
    const mArmL = createMesh(new THREE.CylinderGeometry(0.05, 0.05, 0.8), darkSteel, -2.4, 4.8, 4.5, 0, 0, Math.PI/2);
    const mBoxL = createMesh(new THREE.BoxGeometry(0.2, 0.8, 0.5), plastic, -2.8, 4.8, 4.5);
    const mGlassL = createMesh(new THREE.PlaneGeometry(0.18, 0.75), chrome, -2.7, 4.8, 4.5, 0, Math.PI/2, 0);
    mirrorLGrp.add(mArmL, mBoxL, mGlassL);
    cabinGroup.add(mirrorLGrp);

    const mirrorRGrp = new THREE.Group();
    const mArmR = createMesh(new THREE.CylinderGeometry(0.05, 0.05, 0.8), darkSteel, 2.4, 4.8, 4.5, 0, 0, Math.PI/2);
    const mBoxR = createMesh(new THREE.BoxGeometry(0.2, 0.8, 0.5), plastic, 2.8, 4.8, 4.5);
    const mGlassR = createMesh(new THREE.PlaneGeometry(0.18, 0.75), chrome, 2.7, 4.8, 4.5, 0, -Math.PI/2, 0);
    mirrorRGrp.add(mArmR, mBoxR, mGlassR);
    cabinGroup.add(mirrorRGrp);

    // Cabin Ladders
    const ladderGroup = new THREE.Group();
    const lRail1 = createMesh(new THREE.CylinderGeometry(0.06, 0.06, 3.5), steel, -2.2, 2.5, 2.0);
    const lRail2 = createMesh(new THREE.CylinderGeometry(0.06, 0.06, 3.5), steel, -2.2, 2.5, 1.2);
    ladderGroup.add(lRail1, lRail2);
    for(let i=0; i<8; i++) {
        const rung = createMesh(new THREE.CylinderGeometry(0.04, 0.04, 0.8), steel, -2.2, 1.0 + i*0.4, 1.6, Math.PI/2, 0, 0);
        ladderGroup.add(rung);
    }
    cabinGroup.add(ladderGroup);

    parts.push({
        name: "OperatorCabin",
        description: "Heavily armored, climate-controlled operator command center with tinted anti-glare glass, complex joystick arrays, and glowing telemetry dashboard.",
        material: "Plastic / Tinted Glass / Electronics",
        function: "Operation and data monitoring",
        assemblyOrder: 3,
        connections: ["TitaniumChassis", "SteeringAndJoysticks"],
        failureEffect: "Cabin breach exposes the operator to toxic test fluid vapors and blinding 532nm laser radiation.",
        cascadeFailures: ["Operator Incapacitation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 8, z: 5 }
    });
    group.add(cabinGroup);

    // ==========================================
    // 4. EXHAUST & ENGINE SYSTEM
    // ==========================================
    const engineGroup = new THREE.Group();
    const engineBlock = createMesh(new THREE.BoxGeometry(3, 2, 4), darkSteel, 0, 3.5, -2);
    engineGroup.add(engineBlock);

    // Engine details (cylinders)
    for(let i=0; i<6; i++) {
        const head = createMesh(new THREE.CylinderGeometry(0.3, 0.3, 0.4, 16), aluminum, -0.8 + (i%2)*1.6, 4.6, -3.2 + Math.floor(i/2)*1.2);
        engineGroup.add(head);
    }

    // Exhaust Stacks
    for(let i=-1; i<=1; i+=2) {
        const stackBase = createMesh(new THREE.CylinderGeometry(0.3, 0.3, 2), darkSteel, i*2.2, 4.5, -3);
        const stackMid = createMesh(new THREE.CylinderGeometry(0.2, 0.2, 3), chrome, i*2.2, 6.5, -3);
        const stackTip = createMesh(new THREE.CylinderGeometry(0.2, 0.2, 0.8), chrome, i*2.2, 8.2, -3.2, Math.PI/6, 0, 0);
        engineGroup.add(stackBase, stackMid, stackTip);
        
        // Heat shields
        const shieldGeom = new THREE.CylinderGeometry(0.35, 0.35, 1.5, 16, 1, true, 0, Math.PI);
        const shield = createMesh(shieldGeom, aluminum, i*2.2, 6.0, -3, 0, i>0 ? Math.PI/2 : -Math.PI/2, 0);
        engineGroup.add(shield);
    }

    parts.push({
        name: "ExhaustSystem",
        description: "Twin chromed exhaust stacks venting emissions from the massive diesel-electric powerplant required to drive the hydraulics and viscometer thermal systems.",
        material: "Chrome / Dark Steel",
        function: "Exhaust ventilation",
        assemblyOrder: 4,
        connections: ["TitaniumChassis"],
        failureEffect: "Backpressure stalls the primary engine, cutting power to the thermostat and hydraulic stabilizers.",
        cascadeFailures: ["Thermal Regulation Failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -8, y: 0, z: -4 }
    });
    group.add(engineGroup);

    // ==========================================
    // 5. HYDRAULIC LIFT BOOM & PISTONS
    // ==========================================
    const boomGroup = new THREE.Group();
    
    // Main Boom Arm Pivot Base
    const boomPivotBase = createMesh(new THREE.CylinderGeometry(0.8, 0.8, 3, 32), darkSteel, 0, 4.5, -4, 0, 0, Math.PI/2);
    group.add(boomPivotBase);

    // The Boom Arm itself
    const boomArmShape = new THREE.Shape();
    boomArmShape.moveTo(-0.6, -0.6);
    boomArmShape.lineTo(0.6, -0.6);
    boomArmShape.lineTo(0.3, 8.0);
    boomArmShape.lineTo(-0.3, 8.0);
    boomArmShape.lineTo(-0.6, -0.6);
    const boomArmGeom = new THREE.ExtrudeGeometry(boomArmShape, { depth: 1.2, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.1, bevelThickness: 0.1 });
    const boomArmMesh = createMesh(boomArmGeom, aluminum, 0,0,0, 0, -Math.PI/2, 0);
    boomArmMesh.position.set(-0.6, 0, 0); // Center the extrude
    
    // Attach boom arm to a pivot group
    const boomPivotNode = new THREE.Group();
    boomPivotNode.position.set(0, 4.5, -4);
    boomPivotNode.add(boomArmMesh);
    group.add(boomPivotNode);
    meshes.boomPivot = boomPivotNode;

    // Attach Point on Boom for Pistons
    const boomPistonAttach = new THREE.Group();
    boomPistonAttach.position.set(0, 3.5, 0);
    boomPivotNode.add(boomPistonAttach);
    meshes.boomPistonAttach = boomPistonAttach;

    // Hydraulic Pistons
    const pistonOuterBase = new THREE.Group();
    pistonOuterBase.position.set(0, 3.0, -2.5);
    group.add(pistonOuterBase);
    meshes.pistonOuterBase = pistonOuterBase;

    const pistonOuter = createMesh(new THREE.CylinderGeometry(0.4, 0.4, 1.0, 32), steel, 0, 0, 0.5, Math.PI/2, 0, 0);
    pistonOuterBase.add(pistonOuter);

    const pistonInner = createMesh(new THREE.CylinderGeometry(0.2, 0.2, 1.0, 32), chrome, 0, 0, 0.5, Math.PI/2, 0, 0);
    pistonOuterBase.add(pistonInner);
    meshes.pistonInner = pistonInner;

    // Hydraulic Lines (TubeGeometry) wrapping the boom
    const lineCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.8, -0.5, 0.2),
        new THREE.Vector3(0.9, 2.0, 0.3),
        new THREE.Vector3(0.6, 5.0, 0.1),
        new THREE.Vector3(0.7, 7.5, 0.2)
    ]);
    const lineGeom1 = new THREE.TubeGeometry(lineCurve, 64, 0.08, 8, false);
    const lineMesh1 = createMesh(lineGeom1, rubber);
    boomPivotNode.add(lineMesh1);
    
    const lineCurve2 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.8, -0.5, 0.2),
        new THREE.Vector3(-0.9, 2.0, -0.3),
        new THREE.Vector3(-0.6, 5.0, -0.1),
        new THREE.Vector3(-0.7, 7.5, 0.2)
    ]);
    const lineGeom2 = new THREE.TubeGeometry(lineCurve2, 64, 0.08, 8, false);
    const lineMesh2 = createMesh(lineGeom2, rubber);
    boomPivotNode.add(lineMesh2);

    parts.push({
        name: "HydraulicLiftBoom",
        description: "Massive articulated aluminum boom arm driven by dual high-pressure pistons, deploying the viscometer payload away from the chassis vibrations.",
        material: "Aluminum / Steel / Rubber",
        function: "Payload articulation",
        assemblyOrder: 5,
        connections: ["TitaniumChassis", "ViscometerPayload"],
        failureEffect: "Hydraulic failure drops the multi-ton payload, instantly shattering the delicate glass capillary tubes.",
        cascadeFailures: ["Catastrophic Payload Destruction"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 12, z: -5 }
    });

    // ==========================================
    // 6. VISCOMETER PAYLOAD (The actual instrument)
    // ==========================================
    const payloadGroup = new THREE.Group();
    // Payload attaches to the end of the boom (y=8 in boom space)
    // We will mount it on a gyroscopic pivot so it always stays vertical
    const payloadPivot = new THREE.Group();
    payloadPivot.position.set(0, 8, 0);
    boomPivotNode.add(payloadPivot);
    meshes.payloadPivot = payloadPivot;
    payloadPivot.add(payloadGroup); // Add payload to pivot

    // Payload Frame Bracket
    const bracketGeom = new THREE.BoxGeometry(2, 0.4, 2);
    const bracketTop = createMesh(bracketGeom, darkSteel, 0, 4.5, 0);
    const bracketBot = createMesh(bracketGeom, darkSteel, 0, -4.5, 0);
    payloadGroup.add(bracketTop, bracketBot);

    // Support Rods
    for(let i=0; i<4; i++) {
        const x = (i%2===0) ? 0.8 : -0.8;
        const z = (i<2) ? 0.8 : -0.8;
        const rod = createMesh(new THREE.CylinderGeometry(0.1, 0.1, 9), steel, x, 0, z);
        payloadGroup.add(rod);
    }

    // Outer Water Jacket
    const jacketGeom = new THREE.CylinderGeometry(0.9, 0.9, 8.5, 32, 1, true);
    const jacketMesh = createMesh(jacketGeom, glass, 0, 0, 0);
    payloadGroup.add(jacketMesh);

    // Circulating Water inside jacket
    const waterMesh = createMesh(new THREE.CylinderGeometry(0.88, 0.88, 8.4, 32), waterMat, 0, 0, 0);
    payloadGroup.add(waterMesh);
    meshes.water = waterMesh;

    // Inner Capillary Tube
    const innerTubeGeom = new THREE.CylinderGeometry(0.4, 0.4, 8.8, 32, 1, true);
    const innerTubeMesh = createMesh(innerTubeGeom, glass, 0, 0, 0);
    payloadGroup.add(innerTubeMesh);

    // Viscous Test Fluid
    const fluidMesh = createMesh(new THREE.CylinderGeometry(0.38, 0.38, 8.6, 32), fluidMat, 0, 0, 0);
    payloadGroup.add(fluidMesh);

    // The Falling Steel Ball
    const ballGeom = new THREE.SphereGeometry(0.3, 32, 32);
    const ballMesh = createMesh(ballGeom, steel, 0, 3.8, 0);
    payloadGroup.add(ballMesh);
    meshes.ball = ballMesh;

    // Laser Timing Gates Array (5 Gates)
    const laserCount = 5;
    const gateSpacing = 1.6;
    meshes.lasers = [];
    meshes.laserBeams = [];

    for(let i=0; i<laserCount; i++) {
        const gateGrp = new THREE.Group();
        const gateY = 3.0 - i * gateSpacing;

        // Torus Ring
        const ring = createMesh(new THREE.TorusGeometry(1.2, 0.1, 16, 64), aluminum, 0,0,0, Math.PI/2, 0, 0);
        gateGrp.add(ring);

        // Emitter/Receiver Boxes
        const emitter = createMesh(new THREE.BoxGeometry(0.3, 0.3, 0.4), plastic, 0, 0, 1.1);
        const receiver = createMesh(new THREE.BoxGeometry(0.3, 0.3, 0.4), plastic, 0, 0, -1.1);
        gateGrp.add(emitter, receiver);

        // Glowing Laser Beam
        const beam = createMesh(new THREE.CylinderGeometry(0.02, 0.02, 2.0, 16), neonGreen, 0,0,0, Math.PI/2, 0, 0);
        gateGrp.add(beam);
        meshes.laserBeams.push(beam);

        gateGrp.position.set(0, gateY, 0);
        payloadGroup.add(gateGrp);
        meshes.lasers.push({ y: gateY, mesh: gateGrp });
    }

    parts.push({
        name: "GyroscopicViscometerPayload",
        description: "Self-leveling gyroscopic containment array holding the glass capillary, test fluid, thermostatic jacket, and 532nm laser timing gates.",
        material: "Borosilicate Glass / Aluminum / Optics",
        function: "Kinematic viscosity measurement",
        assemblyOrder: 6,
        connections: ["HydraulicLiftBoom", "PneumaticReturnSystem"],
        failureEffect: "Gyroscopic drift causes the tube to tilt off-axis, introducing friction between the ball and tube wall.",
        cascadeFailures: ["Stokes Law Violation", "Friction Artifacts"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 10, y: 5, z: -10 }
    });

    // Pneumatic Ball Return System
    // Helical tube wrapping around the outside of the water jacket
    class ReturnHelicalCurve extends THREE.Curve {
        constructor(scale = 1) { super(); this.scale = scale; }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const y = -4.0 + t * 8.0; // from bottom to top
            const r = 1.4;
            const theta = t * Math.PI * 6; // 3 turns
            const x = Math.cos(theta) * r;
            const z = Math.sin(theta) * r;
            return optionalTarget.set(x, y, z).multiplyScalar(this.scale);
        }
    }
    const helicalCurve = new ReturnHelicalCurve();
    const returnGeom = new THREE.TubeGeometry(helicalCurve, 200, 0.35, 16, false);
    const returnMesh = createMesh(returnGeom, glass, 0,0,0);
    payloadGroup.add(returnMesh);
    
    // Add pneumatic pressure rings along the tube
    for(let i=0; i<=20; i++) {
        const t = i/20;
        const pt = helicalCurve.getPoint(t);
        const ring = createMesh(new THREE.TorusGeometry(0.4, 0.08, 16, 32), chrome, pt.x, pt.y, pt.z);
        ring.lookAt(helicalCurve.getPoint(Math.min(1, t+0.01)));
        payloadGroup.add(ring);
    }

    parts.push({
        name: "PneumaticReturnSystem",
        description: "Helical high-pressure bypass manifold automatically retrieving the tungsten-steel sphere from the bottom catchment and firing it back to the launch hopper.",
        material: "Glass / Chrome",
        function: "Automated ball retrieval",
        assemblyOrder: 7,
        connections: ["GyroscopicViscometerPayload"],
        failureEffect: "Loss of pneumatic pressure strands the ball in the catchment basin, stopping continuous sampling.",
        cascadeFailures: ["Operational Halt"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 15, y: 5, z: -10 }
    });

    // ==========================================
    // METADATA & QUIZ
    // ==========================================
    const description = "The HMRU (Heavy Mobile Rheology Unit) - Falling Ball Viscometer is a colossal, industrial-scale mobile laboratory. It combines a highly precise Newtonian viscosity measurement payload—featuring thermostatic glass jackets, 532nm laser timing gates, and pneumatic ball retrieval—with a rugged, drivable crawler chassis. This allows for in-situ rheological profiling of extremely hazardous or remote geological fluids without sample transport. Its boom-mounted payload uses active gyroscopic leveling to ensure perfectly vertical alignment, adhering strictly to Stokes' Law calculations despite treacherous terrain.";

    const quizQuestions = [
        {
            question: "Why is the viscometer payload mounted on an actively leveling gyroscopic pivot at the end of the hydraulic boom?",
            options: ["To look impressive", "To ensure perfectly vertical alignment regardless of chassis tilt", "To spin the fluid during testing", "To cool down the lasers"],
            correctAnswer: 1,
            explanation: "Falling ball viscometry relies entirely on gravity pulling the ball straight down through the fluid. Any tilt causes the ball to drag against the glass wall, introducing mechanical friction and completely invalidating Stokes' Law."
        },
        {
            question: "What is the primary function of the aggressive chevron-lug Torus tires on this instrument?",
            options: ["Aesthetic design", "Racing", "All-terrain locomotion and massive vibration dampening", "Generating electricity"],
            correctAnswer: 2,
            explanation: "The massive vulcanized rubber lugs provide both the ability to reach remote hazardous sites and critically dampen seismic vibrations that would otherwise create turbulent eddies in the delicate viscometer test fluid."
        },
        {
            question: "What cascade failure occurs if the 532nm laser timing gates become misaligned?",
            options: ["The glass tube shatters instantly", "The fluid boils", "The ball gets permanently stuck", "Failure to detect ball transit, resulting in timing data loss"],
            correctAnswer: 3,
            explanation: "The laser gates provide the nanosecond-precise transit timing required to calculate terminal velocity. Without them breaking properly, the digital logic board cannot compute the fluid's kinematic viscosity."
        },
        {
            question: "How does the machine perform continuous multi-sample testing without manual intervention?",
            options: ["By using multiple tubes", "Via the helical pneumatic return system", "By dissolving the ball", "Using magnetic levitation"],
            correctAnswer: 1,
            explanation: "The helical pneumatic return tube utilizes high pressure to catch the ball at the bottom of the tube and shoot it back up into the launch hopper for the next test cycle."
        },
        {
            question: "Why does the thermostatic water jacket circulate fluid constantly?",
            options: ["To clean the glass", "To maintain perfectly isothermal conditions preventing convection currents", "To create a beautiful glowing effect", "To dilute the test fluid"],
            correctAnswer: 1,
            explanation: "Viscosity is incredibly sensitive to temperature changes. The thermostatic jacket ensures the test fluid remains at a constant temperature, preventing thermal gradients that cause internal convection currents and alter drag."
        }
    ];

    // ==========================================
    // ANIMATION LOOP
    // ==========================================
    let ballState = "falling"; 
    let ballParams = { y: 3.8, velocity: 0, returnT: 0 };

    function animate(time, speed, meshesObj) {
        // 1. Drive the mobile base forward slowly
        meshes.wheels.forEach(w => {
            w.rotation.z -= 0.05 * speed;
        });

        // 2. Animate the Dashboard telemetry
        meshes.dashLines.forEach((line, idx) => {
            const h = 0.05 + (Math.sin(time * 5 + idx * 0.8) + 1.0) * 0.1;
            line.scale.y = h / 0.05;
            line.position.y = h / 2;
        });

        // 3. Boom Arm Articulation (Sine Wave)
        // Angle goes from 0.4 to 1.0 radians
        const boomAngle = Math.sin(time * 0.5 * speed) * 0.3 + 0.7;
        meshes.boomPivot.rotation.x = boomAngle;

        // 4. Counter-rotate the payload to remain perfectly vertical
        meshes.payloadPivot.rotation.x = -boomAngle;

        // 5. Synchronize Hydraulic Pistons
        const attachPt = new THREE.Vector3();
        meshes.boomPistonAttach.getWorldPosition(attachPt);
        const basePt = new THREE.Vector3();
        meshes.pistonOuterBase.getWorldPosition(basePt);
        
        // Point outer piston at the attachment point
        meshes.pistonOuterBase.lookAt(attachPt);
        
        // Scale inner piston to bridge the gap
        const dist = basePt.distanceTo(attachPt);
        // The outer piston is 1.0 long. We adjust inner piston position and scale
        meshes.pistonInner.position.z = dist * 0.5;
        meshes.pistonInner.scale.z = dist; 

        // 6. Swirl the water jacket
        meshes.water.rotation.y = time * 0.2 * speed;

        // 7. Viscometer Ball Logic
        if(ballState === "falling") {
            // Apply drag simulation (Terminal velocity approach)
            ballParams.velocity = Math.min(ballParams.velocity + 0.005 * speed, 0.08 * speed); 
            ballParams.y -= ballParams.velocity;
            
            meshes.ball.position.set(0, ballParams.y, 0);

            if(ballParams.y <= -3.8) {
                ballState = "returning";
                ballParams.returnT = 0;
            }

            // Laser Gate Triggers
            meshes.lasers.forEach((gate, idx) => {
                if(Math.abs(ballParams.y - gate.y) < 0.25) {
                    meshes.laserBeams[idx].material = neonRed;
                    meshes.laserBeams[idx].scale.set(2.5, 1.0, 2.5);
                } else {
                    meshes.laserBeams[idx].material = neonGreen;
                    meshes.laserBeams[idx].scale.set(1.0, 1.0, 1.0);
                }
            });

        } else if(ballState === "returning") {
            ballParams.returnT += 0.01 * speed;
            if(ballParams.returnT >= 1.0) {
                ballState = "falling";
                ballParams.y = 3.8;
                ballParams.velocity = 0;
            } else {
                // Follow the helical curve
                const pt = helicalCurve.getPoint(ballParams.returnT);
                meshes.ball.position.copy(pt);
            }
            
            // Reset lasers to green
            meshes.laserBeams.forEach(beam => {
                beam.material = neonGreen;
                beam.scale.set(1.0, 1.0, 1.0);
            });
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createFallingBallViscometer() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
