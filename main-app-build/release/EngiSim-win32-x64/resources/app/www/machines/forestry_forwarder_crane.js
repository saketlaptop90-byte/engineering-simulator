import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    function createGlowingMaterial(color, intensity) {
        return new THREE.MeshStandardMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: intensity,
            roughness: 0.2,
            metalness: 0.8
        });
    }

    const neonBlue = createGlowingMaterial(0x00ffff, 2.0);
    const neonOrange = createGlowingMaterial(0xff6600, 2.0);
    const neonRed = createGlowingMaterial(0xff0000, 2.0);

    // 1. FRONT CHASSIS
    const frontChassisGroup = new THREE.Group();
    frontChassisGroup.position.set(2, 1.5, 0);
    group.add(frontChassisGroup);
    meshes.frontChassis = frontChassisGroup;

    const chassisShape = new THREE.Shape();
    chassisShape.moveTo(0, 0);
    chassisShape.lineTo(4, 0);
    chassisShape.lineTo(4, 1.5);
    chassisShape.lineTo(3.5, 2.0);
    chassisShape.lineTo(0, 2.0);
    chassisShape.lineTo(0, 0);

    const extrudeSettings = { depth: 2, bevelEnabled: true, bevelSegments: 3, steps: 2, bevelSize: 0.05, bevelThickness: 0.05 };
    const chassisGeo = new THREE.ExtrudeGeometry(chassisShape, extrudeSettings);
    const chassisMesh = new THREE.Mesh(chassisGeo, darkSteel);
    chassisMesh.position.set(-2, -0.5, -1);
    frontChassisGroup.add(chassisMesh);
    
    for(let i=0; i<10; i++) {
        const grilleGeo = new THREE.BoxGeometry(0.1, 1.2, 0.05);
        const grilleMesh = new THREE.Mesh(grilleGeo, chrome);
        grilleMesh.position.set(2.05, 0.5, -0.7 + (i * 0.15));
        frontChassisGroup.add(grilleMesh);
    }
    
    const engineBlockGeo = new THREE.BoxGeometry(1.5, 1.0, 1.2);
    const engineBlock = new THREE.Mesh(engineBlockGeo, steel);
    engineBlock.position.set(1.0, 1.0, 0);
    frontChassisGroup.add(engineBlock);

    const exhaustPath = new THREE.CatmullRomCurve3([
        new THREE.Vector3(1.5, 1.5, 0.8),
        new THREE.Vector3(1.5, 2.5, 0.8),
        new THREE.Vector3(1.7, 3.0, 0.8)
    ]);
    const exhaustGeo = new THREE.TubeGeometry(exhaustPath, 20, 0.1, 8, false);
    const exhaustMesh = new THREE.Mesh(exhaustGeo, chrome);
    frontChassisGroup.add(exhaustMesh);

    parts.push({
        name: "Front Engine Chassis",
        description: "Houses the high-torque diesel engine, hydrostatic transmission, and massive cooling systems required for heavy timber extraction.",
        material: "Dark Steel / Chrome",
        function: "Provides motive power, hydraulic pressure, and structural base for the operator cabin.",
        assemblyOrder: 1,
        connections: ["Cabin", "Front Bogie", "Articulated Joint"],
        failureEffect: "Complete loss of propulsion and hydraulic pressure; machine becomes immovable.",
        cascadeFailures: ["Hydraulic Crane", "Steering", "Brakes"],
        originalPosition: { x: 2, y: 1.5, z: 0 },
        explodedPosition: { x: 6, y: 1.5, z: 0 }
    });

    // 2. CABIN
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(-0.5, 2.0, 0);
    frontChassisGroup.add(cabinGroup);

    const cabinShape = new THREE.Shape();
    cabinShape.moveTo(0, 0);
    cabinShape.lineTo(2, 0);
    cabinShape.lineTo(1.8, 2);
    cabinShape.lineTo(0.2, 2);
    cabinShape.lineTo(0, 0);
    
    const cabinGeo = new THREE.ExtrudeGeometry(cabinShape, { depth: 1.6, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05 });
    const cabinMesh = new THREE.Mesh(cabinGeo, steel);
    cabinMesh.position.set(-1, 0, -0.8);
    cabinGroup.add(cabinMesh);

    const windowGeo = new THREE.BoxGeometry(1.6, 1.2, 1.65);
    const windowMesh = new THREE.Mesh(windowGeo, tinted);
    windowMesh.position.set(0, 0.8, 0);
    cabinGroup.add(windowMesh);

    const steeringPivot = new THREE.Group();
    steeringPivot.position.set(0.5, 0.5, 0);
    cabinGroup.add(steeringPivot);
    const steeringGeo = new THREE.TorusGeometry(0.2, 0.03, 16, 32);
    const steeringMesh = new THREE.Mesh(steeringGeo, plastic);
    steeringMesh.rotation.x = Math.PI / 4;
    steeringMesh.rotation.y = Math.PI / 2;
    steeringPivot.add(steeringMesh);
    meshes.steeringWheel = steeringPivot;

    const screenGeo = new THREE.PlaneGeometry(0.4, 0.3);
    const screenMesh = new THREE.Mesh(screenGeo, neonBlue);
    screenMesh.position.set(0.7, 0.7, 0.4);
    screenMesh.rotation.y = -Math.PI / 6;
    cabinGroup.add(screenMesh);
    
    const screenMesh2 = new THREE.Mesh(screenGeo, neonOrange);
    screenMesh2.position.set(0.7, 0.7, -0.4);
    screenMesh2.rotation.y = Math.PI / 6;
    cabinGroup.add(screenMesh2);

    parts.push({
        name: "Operator Cabin",
        description: "ROPS/FOPS certified hyper-ergonomic cabin. Features advanced digital displays, bio-feedback joysticks, and 360-degree LiDAR overlay.",
        material: "Steel / Tinted Glass",
        function: "Protects operator and provides interface for driving and crane operations.",
        assemblyOrder: 2,
        connections: ["Front Engine Chassis", "Control Systems"],
        failureEffect: "Machine operational but uncontrollable by human operator; relies on autonomous fallback.",
        cascadeFailures: ["Manual Override", "Precision Loading"],
        originalPosition: { x: -0.5, y: 3.5, z: 0 },
        explodedPosition: { x: 0, y: 7, z: 0 }
    });

    // 3. TIRES AND BOGIES
    function createComplexTire() {
        const tireGroup = new THREE.Group();
        const baseTireGeo = new THREE.TorusGeometry(0.7, 0.35, 32, 64);
        const baseTireMesh = new THREE.Mesh(baseTireGeo, rubber);
        tireGroup.add(baseTireMesh);

        const numLugs = 40;
        const lugGeo = new THREE.BoxGeometry(0.15, 0.8, 0.15);
        for(let i=0; i<numLugs; i++) {
            const angle = (i / numLugs) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeo, rubber);
            lug.position.x = Math.cos(angle) * 1.0;
            lug.position.y = Math.sin(angle) * 1.0;
            lug.rotation.z = angle + Math.PI/4; 
            lug.rotation.y = i % 2 === 0 ? Math.PI/8 : -Math.PI/8;
            tireGroup.add(lug);
        }

        const rimGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.4, 32);
        const rimMesh = new THREE.Mesh(rimGeo, chrome);
        rimMesh.rotation.x = Math.PI/2;
        tireGroup.add(rimMesh);

        const spokeGeo = new THREE.BoxGeometry(1.0, 0.1, 0.1);
        for(let i=0; i<6; i++) {
            const spoke = new THREE.Mesh(spokeGeo, darkSteel);
            spoke.rotation.z = (i / 6) * Math.PI;
            spoke.position.z = 0.15;
            tireGroup.add(spoke);
        }
        return tireGroup;
    }

    function createBogie(isFront) {
        const bogieGroup = new THREE.Group();
        const beamGeo = new THREE.BoxGeometry(2.4, 0.4, 0.3);
        const beamMesh = new THREE.Mesh(beamGeo, darkSteel);
        bogieGroup.add(beamMesh);
        
        const pivotGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.5, 16);
        const pivotMesh = new THREE.Mesh(pivotGeo, chrome);
        pivotMesh.rotation.x = Math.PI/2;
        bogieGroup.add(pivotMesh);

        const w1 = createComplexTire();
        w1.position.set(-1.2, 0, 0.4);
        bogieGroup.add(w1);
        
        const w2 = createComplexTire();
        w2.position.set(1.2, 0, 0.4);
        bogieGroup.add(w2);

        return { group: bogieGroup, w1, w2 };
    }

    const fbL = createBogie(true);
    fbL.group.position.set(0, -1, 1.2);
    frontChassisGroup.add(fbL.group);
    
    const fbR = createBogie(true);
    fbR.group.position.set(0, -1, -1.2);
    fbR.group.rotation.y = Math.PI;
    frontChassisGroup.add(fbR.group);
    
    meshes.wheels = [fbL.w1, fbL.w2, fbR.w1, fbR.w2];
    meshes.frontBogies = [fbL.group, fbR.group];

    parts.push({
        name: "Front Bogie Axles & Deep-Tread Tires",
        description: "Balanced tandem bogies with planetary gear reduction. Tires feature aggressive multi-lug tread for minimal ground disturbance and max traction.",
        material: "Dark Steel / Heavy Rubber",
        function: "Distributes front weight, provides terrain adaptability, and translates torque to traction.",
        assemblyOrder: 3,
        connections: ["Front Engine Chassis", "Hydrostatic Motors"],
        failureEffect: "Severe loss of mobility and terrain climbing capabilities.",
        cascadeFailures: ["Drive Train", "Ground Compaction Management"],
        originalPosition: { x: 2, y: 0.5, z: 1.2 },
        explodedPosition: { x: 2, y: -2, z: 4 }
    });

    // 4. ARTICULATED JOINT
    const jointGroup = new THREE.Group();
    jointGroup.position.set(0, 1.0, 0);
    group.add(jointGroup);
    meshes.articulatedJoint = jointGroup;

    const jointPinGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.5, 32);
    const jointPin = new THREE.Mesh(jointPinGeo, chrome);
    jointGroup.add(jointPin);

    const steerCyl1Geo = new THREE.CylinderGeometry(0.15, 0.15, 1.0, 16);
    const steerCyl1 = new THREE.Mesh(steerCyl1Geo, steel);
    steerCyl1.position.set(0, 0, 0.6);
    steerCyl1.rotation.z = Math.PI/2;
    jointGroup.add(steerCyl1);
    
    const steerCyl2 = new THREE.Mesh(steerCyl1Geo, steel);
    steerCyl2.position.set(0, 0, -0.6);
    steerCyl2.rotation.z = Math.PI/2;
    jointGroup.add(steerCyl2);

    parts.push({
        name: "Articulated Frame Joint & Steering Cylinders",
        description: "Massive central pivot point allowing 45-degree articulation and frame oscillation. Driven by twin high-pressure hydraulic steering cylinders.",
        material: "Chrome / Steel",
        function: "Provides steering and keeps all 8 wheels on the ground over rough terrain.",
        assemblyOrder: 4,
        connections: ["Front Engine Chassis", "Rear Wagon Frame"],
        failureEffect: "Machine loses steering entirely; frame may collapse under torsional stress.",
        cascadeFailures: ["Hydraulic Lines", "Driveline Shafts"],
        originalPosition: { x: 0, y: 1.0, z: 0 },
        explodedPosition: { x: 0, y: 4, z: -3 }
    });

    // 5. REAR WAGON FRAME
    const rearChassisGroup = new THREE.Group();
    jointGroup.add(rearChassisGroup);
    
    const wagonShape = new THREE.Shape();
    wagonShape.moveTo(0, -0.5);
    wagonShape.lineTo(-6, -0.5);
    wagonShape.lineTo(-6, 0.5);
    wagonShape.lineTo(0, 0.5);
    wagonShape.lineTo(0, -0.5);
    
    const wagonGeo = new THREE.ExtrudeGeometry(wagonShape, { depth: 1.4, bevelEnabled: true, bevelSize: 0.1, bevelThickness: 0.1 });
    const wagonMesh = new THREE.Mesh(wagonGeo, darkSteel);
    wagonMesh.position.set(0, 0, -0.7);
    rearChassisGroup.add(wagonMesh);

    const bunkGeo = new THREE.TorusGeometry(1.2, 0.15, 16, 32, Math.PI);
    for(let i=1; i<=4; i++) {
        const bunk = new THREE.Mesh(bunkGeo, steel);
        bunk.rotation.y = Math.PI/2;
        bunk.rotation.x = -Math.PI/2;
        bunk.position.set(-1.2 * i, 0.5, 0);
        rearChassisGroup.add(bunk);
        
        const stanchionGeo = new THREE.CylinderGeometry(0.1, 0.1, 2.0, 16);
        const s1 = new THREE.Mesh(stanchionGeo, steel);
        s1.position.set(-1.2 * i, 1.5, 1.2);
        rearChassisGroup.add(s1);
        
        const s2 = new THREE.Mesh(stanchionGeo, steel);
        s2.position.set(-1.2 * i, 1.5, -1.2);
        rearChassisGroup.add(s2);

        const marker = new THREE.Mesh(new THREE.SphereGeometry(0.05), neonRed);
        marker.position.set(-1.2 * i, 2.5, 1.25);
        rearChassisGroup.add(marker);
        
        const marker2 = new THREE.Mesh(new THREE.SphereGeometry(0.05), neonRed);
        marker2.position.set(-1.2 * i, 2.5, -1.25);
        rearChassisGroup.add(marker2);
    }

    parts.push({
        name: "Rear Load Space (Log Bunks)",
        description: "Heavy-duty extruded frame with reinforced stanchions and bunks for carrying up to 20 tons of harvested timber.",
        material: "Dark Steel",
        function: "Supports and secures the payload during transit.",
        assemblyOrder: 5,
        connections: ["Articulated Joint", "Rear Bogies", "Crane Base"],
        failureEffect: "Inability to load or transport logs; potential load spill causing catastrophic damage.",
        cascadeFailures: ["Stanchions", "Frame Integrity"],
        originalPosition: { x: -3, y: 1.0, z: 0 },
        explodedPosition: { x: -8, y: 1.0, z: 0 }
    });

    const rbL = createBogie(false);
    rbL.group.position.set(-3.5, -0.5, 1.2);
    rearChassisGroup.add(rbL.group);
    
    const rbR = createBogie(false);
    rbR.group.position.set(-3.5, -0.5, -1.2);
    rbR.group.rotation.y = Math.PI;
    rearChassisGroup.add(rbR.group);

    meshes.wheels.push(rbL.w1, rbL.w2, rbR.w1, rbR.w2);
    meshes.rearBogies = [rbL.group, rbR.group];

    parts.push({
        name: "Rear Bogie Axles",
        description: "Supports the massive weight of the loaded timber wagon. Independently oscillates to maintain ground contact.",
        material: "Heavy Rubber / Dark Steel",
        function: "Weight distribution and secondary tractive effort.",
        assemblyOrder: 6,
        connections: ["Rear Wagon Frame", "Drive Shaft"],
        failureEffect: "Machine bogs down when loaded; immense stress transferred to front axles.",
        cascadeFailures: ["Tires", "Hub Motors"],
        originalPosition: { x: -3.5, y: 0.5, z: 1.2 },
        explodedPosition: { x: -3.5, y: -2, z: 4 }
    });

    // 6. HYDRAULIC KNUCKLEBOOM CRANE
    const craneGroup = new THREE.Group();
    craneGroup.position.set(-0.5, 1.0, 0); 
    rearChassisGroup.add(craneGroup);

    const craneBaseGroup = new THREE.Group();
    craneGroup.add(craneBaseGroup);
    meshes.craneBase = craneBaseGroup;

    const baseGeo = new THREE.CylinderGeometry(0.6, 0.8, 1.0, 32);
    const baseMesh = new THREE.Mesh(baseGeo, steel);
    baseMesh.position.y = 0.5;
    craneBaseGroup.add(baseMesh);

    const gearGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.2, 32);
    const gearMesh = new THREE.Mesh(gearGeo, chrome);
    gearMesh.position.y = 0.1;
    craneBaseGroup.add(gearMesh);
    
    const ringGeo = new THREE.TorusGeometry(0.86, 0.05, 16, 64);
    const ringMesh = new THREE.Mesh(ringGeo, neonBlue);
    ringMesh.position.y = 0.3;
    ringMesh.rotation.x = Math.PI/2;
    craneBaseGroup.add(ringMesh);

    parts.push({
        name: "Crane Slew Base",
        description: "Heavy-duty slewing ring with dual swing motors providing continuous 380-degree rotation of the boom.",
        material: "Steel / Chrome",
        function: "Allows lateral positioning of the crane arm.",
        assemblyOrder: 7,
        connections: ["Rear Wagon Frame", "Main Boom"],
        failureEffect: "Crane cannot rotate laterally, rendering it largely useless.",
        cascadeFailures: ["Hydraulic Swivel", "Swing Gearbox"],
        originalPosition: { x: -0.5, y: 2.0, z: 0 },
        explodedPosition: { x: -2, y: 5, z: 3 }
    });

    const mainBoomPivot = new THREE.Group();
    mainBoomPivot.position.set(0, 1.0, 0);
    craneBaseGroup.add(mainBoomPivot);
    meshes.mainBoom = mainBoomPivot;

    const mainBoomShape = new THREE.Shape();
    mainBoomShape.moveTo(0, 0);
    mainBoomShape.lineTo(0.5, 0.5);
    mainBoomShape.lineTo(0.3, 3.0);
    mainBoomShape.lineTo(-0.3, 3.0);
    mainBoomShape.lineTo(-0.5, 0.5);
    mainBoomShape.lineTo(0, 0);
    const boomGeo = new THREE.ExtrudeGeometry(mainBoomShape, { depth: 0.4, bevelEnabled: true });
    const boomMesh = new THREE.Mesh(boomGeo, darkSteel);
    boomMesh.position.set(0, 0, -0.2);
    boomMesh.rotation.z = -Math.PI/6;
    mainBoomPivot.add(boomMesh);

    const mainLiftCylGroup = new THREE.Group();
    mainLiftCylGroup.position.set(0.2, 0.2, 0);
    craneBaseGroup.add(mainLiftCylGroup);
    
    const liftOuterGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.5, 16);
    const liftOuter = new THREE.Mesh(liftOuterGeo, steel);
    liftOuter.position.y = 0.75;
    mainLiftCylGroup.add(liftOuter);

    const liftInnerGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.5, 16);
    const liftInner = new THREE.Mesh(liftInnerGeo, chrome);
    liftInner.position.y = 1.5; 
    mainLiftCylGroup.add(liftInner);
    meshes.mainLiftInner = liftInner; 
    meshes.mainLiftGroup = mainLiftCylGroup;

    parts.push({
        name: "Main Lift Boom & Hydraulic Cylinder",
        description: "Primary lifting arm made of high-tensile steel box-section. Powered by a massive lift cylinder rated for 300 bar pressure.",
        material: "Dark Steel / Chrome",
        function: "Provides the primary vertical lifting arc for logs.",
        assemblyOrder: 8,
        connections: ["Crane Slew Base", "Outer Stick Boom"],
        failureEffect: "Inability to lift loads; boom drops.",
        cascadeFailures: ["Hydraulic Lines", "Safety Valves"],
        originalPosition: { x: -0.5, y: 3.5, z: 0 },
        explodedPosition: { x: -2, y: 7, z: 0 }
    });

    const dx = 3 * Math.cos(Math.PI/2 - Math.PI/6);
    const dy = 3 * Math.sin(Math.PI/2 - Math.PI/6);
    
    const stickBoomPivot = new THREE.Group();
    stickBoomPivot.position.set(dx, dy, 0);
    mainBoomPivot.add(stickBoomPivot);
    meshes.stickBoom = stickBoomPivot;

    const stickShape = new THREE.Shape();
    stickShape.moveTo(0, 0);
    stickShape.lineTo(0.3, -0.3);
    stickShape.lineTo(0.1, -4.0);
    stickShape.lineTo(-0.1, -4.0);
    stickShape.lineTo(-0.3, -0.3);
    stickShape.lineTo(0, 0);
    const stickGeo = new THREE.ExtrudeGeometry(stickShape, { depth: 0.3, bevelEnabled: true });
    const stickMesh = new THREE.Mesh(stickGeo, steel);
    stickMesh.position.set(0, 0, -0.15);
    stickBoomPivot.add(stickMesh);

    const telescopeGroup = new THREE.Group();
    telescopeGroup.position.set(0, -4.0, 0);
    stickBoomPivot.add(telescopeGroup);
    meshes.telescope = telescopeGroup;

    const telGeo = new THREE.BoxGeometry(0.15, 2.0, 0.2);
    const telMesh = new THREE.Mesh(telGeo, chrome);
    telMesh.position.y = -1.0;
    telescopeGroup.add(telMesh);

    parts.push({
        name: "Outer Knuckle Boom & Telescopic Extension",
        description: "Secondary articulating arm with a built-in telescopic extension for maximum reach. Includes complex internal hose routing.",
        material: "Steel / Chrome",
        function: "Reaches out to grab logs far from the machine's path.",
        assemblyOrder: 9,
        connections: ["Main Boom", "Rotator", "Grapple"],
        failureEffect: "Reduced reach and lifting geometry limitation.",
        cascadeFailures: ["Telescopic Chain", "Internal Hoses"],
        originalPosition: { x: dx, y: dy+3, z: 0 },
        explodedPosition: { x: -2, y: 9, z: -3 }
    });

    const knuckleCylGroup = new THREE.Group();
    knuckleCylGroup.position.set(0.5, 1.5, 0);
    mainBoomPivot.add(knuckleCylGroup);
    
    const kcOuter = new THREE.Mesh(liftOuterGeo, steel);
    kcOuter.position.y = 0.75;
    knuckleCylGroup.add(kcOuter);
    
    const kcInner = new THREE.Mesh(liftInnerGeo, chrome);
    kcInner.position.y = 1.5;
    knuckleCylGroup.add(kcInner);
    meshes.knuckleLiftInner = kcInner;
    meshes.knuckleCylGroup = knuckleCylGroup;

    const rotatorGroup = new THREE.Group();
    rotatorGroup.position.set(0, -2.0, 0); 
    telescopeGroup.add(rotatorGroup);
    meshes.rotator = rotatorGroup;

    const rotatorGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.4, 16);
    const rotatorMesh = new THREE.Mesh(rotatorGeo, darkSteel);
    rotatorGroup.add(rotatorMesh);

    const grappleGroup = new THREE.Group();
    grappleGroup.position.set(0, -0.2, 0);
    rotatorGroup.add(grappleGroup);

    const gBaseGeo = new THREE.BoxGeometry(0.6, 0.2, 0.3);
    const gBaseMesh = new THREE.Mesh(gBaseGeo, steel);
    grappleGroup.add(gBaseMesh);

    const jawShape = new THREE.Shape();
    jawShape.moveTo(0, 0);
    jawShape.lineTo(0.6, -0.5);
    jawShape.lineTo(0.8, -1.2);
    jawShape.lineTo(0.6, -1.5);
    jawShape.lineTo(0.2, -1.0);
    jawShape.lineTo(0, -0.2);
    
    const jawGeo = new THREE.ExtrudeGeometry(jawShape, { depth: 0.1, bevelEnabled: true });
    
    const jawLGroup = new THREE.Group();
    jawLGroup.position.set(-0.2, 0, 0);
    grappleGroup.add(jawLGroup);
    const jawLMesh = new THREE.Mesh(jawGeo, steel);
    jawLMesh.position.set(0, 0, -0.05);
    jawLMesh.rotation.y = Math.PI; 
    jawLGroup.add(jawLMesh);
    meshes.jawL = jawLGroup;
    
    const jawRGroup = new THREE.Group();
    jawRGroup.position.set(0.2, 0, 0);
    grappleGroup.add(jawRGroup);
    const jawRMesh = new THREE.Mesh(jawGeo, steel);
    jawRMesh.position.set(0, 0, -0.05);
    jawRGroup.add(jawRMesh);
    meshes.jawR = jawRGroup;

    parts.push({
        name: "Continuous Rotator & Bypass Grapple",
        description: "Heavy-duty hydraulic rotator (360 continuous) coupled with a reinforced bypass grapple for secure timber handling. Features synchronized jaw geometry.",
        material: "Steel / Dark Steel",
        function: "Rotates, grabs, and securely holds logs.",
        assemblyOrder: 10,
        connections: ["Telescopic Extension"],
        failureEffect: "Inability to grasp logs, dropping loads, or impossible alignment.",
        cascadeFailures: ["Rotator Motor", "Jaw Cylinders"],
        originalPosition: { x: dx, y: dy-2, z: 0 },
        explodedPosition: { x: dx, y: dy-4, z: 0 }
    });

    const hoseMaterial = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9, metalness: 0.1 });
    
    const h1Path = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.5, 0.2),
        new THREE.Vector3(0.5, 1.5, 0.3),
        new THREE.Vector3(0.1, 2.5, 0.2)
    ]);
    const h1Geo = new THREE.TubeGeometry(h1Path, 12, 0.03, 8, false);
    const h1Mesh = new THREE.Mesh(h1Geo, hoseMaterial);
    craneBaseGroup.add(h1Mesh);

    const h2Path = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.1, 2.5, 0.2),
        new THREE.Vector3(dx/2, dy/2, 0.2),
        new THREE.Vector3(dx, dy-0.5, 0.2)
    ]);
    const h2Geo = new THREE.TubeGeometry(h2Path, 12, 0.03, 8, false);
    const h2Mesh = new THREE.Mesh(h2Geo, hoseMaterial);
    mainBoomPivot.add(h2Mesh);

    parts.push({
        name: "High-Pressure Hydraulic Hoses",
        description: "Multi-layered steel-braided hoses handling up to 350 bar of pressure. Routed securely to prevent snags in dense forests.",
        material: "Synthetic Rubber / Steel Mesh",
        function: "Transmits hydraulic fluid power to all actuators.",
        assemblyOrder: 11,
        connections: ["Pumps", "Cylinders", "Rotator"],
        failureEffect: "Fluid leak, immediate loss of hydraulic pressure, severe environmental hazard.",
        cascadeFailures: ["Pump Cavitation", "Valve Block Lockup"],
        originalPosition: { x: 0, y: 4, z: 0.5 },
        explodedPosition: { x: 3, y: 5, z: 3 }
    });

    for(let i=0; i<4; i++) {
        const hLight = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.15, 0.1), chrome);
        hLight.position.set(4.0, 1.5, -0.6 + i*0.4);
        frontChassisGroup.add(hLight);
        
        const hLens = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 0.13), neonBlue);
        hLens.position.set(4.1, 1.5, -0.6 + i*0.4);
        hLens.rotation.y = Math.PI/2;
        frontChassisGroup.add(hLens);
    }

    parts.push({
        name: "LED Work Light Array",
        description: "Intense LED work lights producing 10,000 lumens each, essential for 24-hour operation in dark boreal forests.",
        material: "Plastic / Chrome / LED",
        function: "Illuminates the work area, boom path, and driving path.",
        assemblyOrder: 12,
        connections: ["Cabin Roof", "Engine Grille", "Electrical System"],
        failureEffect: "Reduced visibility, prohibiting safe night operations.",
        cascadeFailures: ["Alternator Overload (Short circuit)"],
        originalPosition: { x: 4.1, y: 1.5, z: 0 },
        explodedPosition: { x: 6, y: 3, z: 0 }
    });

    const fanGroup = new THREE.Group();
    fanGroup.position.set(3.5, 0.5, 0);
    frontChassisGroup.add(fanGroup);
    meshes.coolingFan = fanGroup;
    
    for(let i=0; i<6; i++) {
        const bladeGeo = new THREE.PlaneGeometry(0.8, 0.2);
        const blade = new THREE.Mesh(bladeGeo, darkSteel);
        blade.rotation.x = Math.PI/4;
        blade.rotation.z = (i / 6) * Math.PI * 2;
        fanGroup.add(blade);
    }

    parts.push({
        name: "High-Capacity Cooling Fan & Radiator",
        description: "Reversible hydraulic fan automatically purges debris from the massive multi-core radiator assembly.",
        material: "Steel / Plastic",
        function: "Dissipates immense heat generated by the diesel engine and hydraulic systems.",
        assemblyOrder: 13,
        connections: ["Engine Block", "Hydraulic Cooler"],
        failureEffect: "Engine and hydraulics quickly overheat, triggering emergency shutdown.",
        cascadeFailures: ["Engine Seals", "Hydraulic Fluid Degradation"],
        originalPosition: { x: 3.5, y: 1.5, z: 0 },
        explodedPosition: { x: 7, y: 1.5, z: 0 }
    });

    const transGeo = new THREE.CylinderGeometry(0.3, 0.4, 1.2, 16);
    const transMesh = new THREE.Mesh(transGeo, copper);
    transMesh.position.set(0, -0.2, 0);
    transMesh.rotation.z = Math.PI/2;
    frontChassisGroup.add(transMesh);

    parts.push({
        name: "Hydrostatic Transmission Pump",
        description: "Variable displacement axial piston pump driving hydraulic hub motors in all 8 wheels.",
        material: "Copper / Steel",
        function: "Converts mechanical engine power into high-pressure hydraulic flow for drive systems.",
        assemblyOrder: 14,
        connections: ["Engine Flywheel", "Drive Motors", "Hydraulic Hoses"],
        failureEffect: "Complete loss of drive propulsion.",
        cascadeFailures: ["Braking System (Dynamic)"],
        originalPosition: { x: 0, y: -0.2, z: 0 },
        explodedPosition: { x: 0, y: -2, z: -2 }
    });

    const valveGeo = new THREE.BoxGeometry(0.4, 0.6, 0.3);
    const valveMesh = new THREE.Mesh(valveGeo, chrome);
    valveMesh.position.set(-0.5, 0.3, 0.3);
    craneBaseGroup.add(valveMesh);
    
    for(let i=0; i<4; i++) {
        const spool = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.5, 8), copper);
        spool.position.set(0, 0.3, -0.1 + i*0.06);
        valveMesh.add(spool);
    }

    parts.push({
        name: "Proportional Valve Block",
        description: "Brain of the hydraulic system, featuring electro-hydraulic proportional valves for millimeter-precise crane control.",
        material: "Chrome / Copper",
        function: "Meters hydraulic flow to individual crane cylinders based on joystick inputs.",
        assemblyOrder: 15,
        connections: ["Crane Base", "Hydraulic Hoses", "CAN-bus Network"],
        failureEffect: "Erratic or completely dead crane movements.",
        cascadeFailures: ["Cylinder Over-pressure"],
        originalPosition: { x: -0.5, y: 2.3, z: 0.3 },
        explodedPosition: { x: -3, y: 4, z: 2 }
    });

    const dpfGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.8, 16);
    const dpfMesh = new THREE.Mesh(dpfGeo, darkSteel);
    dpfMesh.position.set(1.5, 1.5, 0.8);
    dpfMesh.rotation.x = Math.PI/2;
    frontChassisGroup.add(dpfMesh);

    parts.push({
        name: "Diesel Particulate Filter (DPF)",
        description: "Stage V emissions compliant exhaust treatment system utilizing active regeneration.",
        material: "Dark Steel / Ceramic",
        function: "Scrubs soot and particulates from the exhaust stream.",
        assemblyOrder: 16,
        connections: ["Engine Exhaust Manifold", "Exhaust Stack"],
        failureEffect: "Engine derates power and eventually shuts down to protect itself.",
        cascadeFailures: ["Turbocharger Backpressure"],
        originalPosition: { x: 1.5, y: 1.5, z: 0.8 },
        explodedPosition: { x: 1.5, y: 3, z: 2 }
    });

    const description = "The Forestry Forwarder is an ultra high-tech, massive 8-wheel machine designed to transport felled logs from the stump to a roadside landing. Featuring an articulated frame, hydrostatic 8-wheel drive, and a hyper-complex hydraulic knuckleboom crane, this machine effortlessly traverses hostile terrain while moving immense weight. The intricately animated crane geometry, telescoping extensions, and aggressive bogie tires demonstrate advanced mechanical engineering.";

    const quizQuestions = [
        {
            question: "What is the primary function of the tandem bogie axles on this forwarder?",
            options: [
                "To increase top speed on paved roads.",
                "To independently oscillate, keeping wheels on ground over rough terrain and reducing soil compaction.",
                "To steer the vehicle independently of the front chassis.",
                "To act as counterweights for the heavy crane."
            ],
            correctAnswer: 1,
            explanation: "Tandem bogies pivot in the center, allowing the two wheels to walk over stumps and rocks while maintaining contact, which drastically improves traction and lowers ground pressure."
        },
        {
            question: "How does this machine steer?",
            options: [
                "Front-wheel Ackerman steering like a car.",
                "Skid steering by braking one side.",
                "Articulated steering using hydraulic cylinders to bend the frame at the central joint.",
                "Crab steering via independent hydraulic motors."
            ],
            correctAnswer: 2,
            explanation: "Forwarders use a massive central articulated joint powered by hydraulic cylinders. This ensures the rear wheels track exactly in the path of the front wheels, vital for navigating tight forests."
        },
        {
            question: "What purpose does the telescopic extension on the outer stick boom serve?",
            options: [
                "It extends the reach of the crane to grab logs further away without moving the machine.",
                "It pumps additional hydraulic fluid to the rotator.",
                "It acts as a shock absorber when driving.",
                "It allows the boom to fold into the cabin for transport."
            ],
            correctAnswer: 0,
            explanation: "The telescopic boom slides out to increase the crane's reach, allowing the operator to load logs across a wide radius without having to constantly reposition the massive machine."
        },
        {
            question: "Why does the grapple require a 'rotator' mechanism?",
            options: [
                "To spin logs like a drill to remove bark.",
                "To continuously rotate 360 degrees, allowing precise alignment of the logs into the wagon's bunks.",
                "To unscrew the grapple for maintenance.",
                "To generate electricity via kinetic energy."
            ],
            correctAnswer: 1,
            explanation: "A continuous rotator allows the operator to twist the suspended logs to perfectly align them with the bunks in the wagon, maximizing load capacity and balance."
        },
        {
            question: "What happens if a high-pressure hydraulic hose on the main lift cylinder fails?",
            options: [
                "The engine immediately shuts down.",
                "The boom will lose lift capability and drop, and pressurized hydraulic fluid will spray out.",
                "The steering joint will lock up.",
                "The cabin will automatically eject."
            ],
            correctAnswer: 1,
            explanation: "The cylinders rely on immense fluid pressure. A burst hose removes that pressure, causing a loss of control, gravity pulling the boom down, and creating an environmental hazard."
        }
    ];

    function animate(time, speed, activeMeshes) {
        const wheelRot = time * speed * 2;
        if(activeMeshes.wheels) {
            activeMeshes.wheels.forEach(w => w.rotation.z = -wheelRot); 
        }
        
        const terrainPhase = time * speed;
        if(activeMeshes.frontBogies) {
            activeMeshes.frontBogies[0].rotation.z = Math.sin(terrainPhase * 2) * 0.1;
            activeMeshes.frontBogies[1].rotation.z = Math.sin(terrainPhase * 2 + Math.PI) * 0.1;
        }
        if(activeMeshes.rearBogies) {
            activeMeshes.rearBogies[0].rotation.z = Math.sin(terrainPhase * 2.2) * 0.12;
            activeMeshes.rearBogies[1].rotation.z = Math.sin(terrainPhase * 2.2 + Math.PI) * 0.12;
        }
        
        const steerAngle = Math.sin(time * speed * 0.5) * 0.4;
        if(activeMeshes.articulatedJoint) {
            activeMeshes.articulatedJoint.rotation.y = steerAngle;
        }
        if(activeMeshes.steeringWheel) {
            activeMeshes.steeringWheel.rotation.z = steerAngle * 4; 
        }
        
        const craneSwing = Math.sin(time * speed * 0.8) * 1.5;
        if(activeMeshes.craneBase) {
            activeMeshes.craneBase.rotation.y = craneSwing;
        }
        
        const mainLifting = (Math.sin(time * speed * 1.2) + 1) / 2; 
        const mainBoomRot = -mainLifting * 0.8;
        if(activeMeshes.mainBoom) {
            activeMeshes.mainBoom.rotation.z = mainBoomRot;
        }
        
        const stickLifting = (Math.cos(time * speed * 1.2) + 1) / 2;
        const stickBoomRot = stickLifting * 1.0;
        if(activeMeshes.stickBoom) {
            activeMeshes.stickBoom.rotation.z = stickBoomRot;
        }
        
        if(activeMeshes.telescope) {
            activeMeshes.telescope.position.y = -4.0 - (stickLifting * 1.5);
        }
        
        if(activeMeshes.rotator) {
            activeMeshes.rotator.rotation.y = time * speed * 3;
        }
        
        const jawAngle = mainLifting < 0.2 ? 0.8 : (mainLifting > 0.8 ? 0 : 0.8 * (1 - ((mainLifting-0.2)/0.6)));
        if(activeMeshes.jawL && activeMeshes.jawR) {
            activeMeshes.jawL.rotation.z = jawAngle;
            activeMeshes.jawR.rotation.z = -jawAngle;
        }
        
        if(activeMeshes.mainLiftInner) {
            activeMeshes.mainLiftInner.position.y = 1.5 + (mainLifting * 0.5);
        }
        if(activeMeshes.knuckleLiftInner) {
            activeMeshes.knuckleLiftInner.position.y = 1.5 + (stickLifting * 0.6);
        }
        
        if(activeMeshes.mainLiftGroup) {
            activeMeshes.mainLiftGroup.rotation.z = mainBoomRot * 0.3;
        }
        if(activeMeshes.knuckleCylGroup) {
            activeMeshes.knuckleCylGroup.rotation.z = stickBoomRot * 0.4;
        }
        
        if(activeMeshes.coolingFan) {
            activeMeshes.coolingFan.rotation.x = time * speed * 10;
        }
    }

    return { group, parts, description, quizQuestions, animate: (t, s) => animate(t, s, meshes) };
}

// Auto-generated missing stub
export function createForwarderCrane() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
