import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const meshes = {};

    // --- MAIN GROUPS ---
    const mainVehicleGroup = new THREE.Group();
    const asperityTerrainGroup = new THREE.Group();
    
    // --- ASPERITY TERRAIN (Microscopic Substrate) ---
    const asperityList = [];
    const terrainWidth = 500;
    const terrainDepth = 120;

    // Base plate with extruded geometric details
    const baseShape = new THREE.Shape();
    baseShape.moveTo(-terrainWidth/2, -terrainDepth/2);
    baseShape.lineTo(terrainWidth/2, -terrainDepth/2);
    baseShape.lineTo(terrainWidth/2 - 10, terrainDepth/2);
    baseShape.lineTo(-terrainWidth/2 + 10, terrainDepth/2);
    baseShape.lineTo(-terrainWidth/2, -terrainDepth/2);
    
    const baseGeo = new THREE.ExtrudeGeometry(baseShape, { depth: 20, bevelEnabled: true, bevelThickness: 5, bevelSize: 5 });
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.rotation.x = Math.PI / 2;
    baseMesh.position.y = -10;
    asperityTerrainGroup.add(baseMesh);

    // Primary Asperity Spikes (Lathe + Cones)
    for(let i=0; i<180; i++) {
        const aspGroup = new THREE.Group();
        const height = 15 + Math.random() * 35;
        const radius = 6 + Math.random() * 12;
        
        // Core Lathed Spike
        const points = [];
        for (let j = 0; j <= 10; j++) {
            points.push(new THREE.Vector2(Math.sin(j * 0.3) * (radius - j*0.5) + 0.1, j * (height / 10)));
        }
        const latheGeo = new THREE.LatheGeometry(points, 16);
        const latheMesh = new THREE.Mesh(latheGeo, steel);
        aspGroup.add(latheMesh);
        
        // Secondary jagged shards (Tetrahedrons)
        const numShards = 4 + Math.floor(Math.random() * 6);
        for(let j=0; j<numShards; j++) {
            const shard = new THREE.Mesh(new THREE.TetrahedronGeometry(radius * 0.6), chrome);
            shard.position.set(
                (Math.random() - 0.5) * radius * 1.5,
                height * 0.4 + Math.random() * height * 0.4,
                (Math.random() - 0.5) * radius * 1.5
            );
            shard.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
            // Non-uniform scaling to make them sharp
            shard.scale.set(0.5, 2.5, 0.5);
            aspGroup.add(shard);
        }
        
        // Deformation Ring
        const ring = new THREE.Mesh(new THREE.TorusGeometry(radius * 1.1, 1.5, 8, 24), darkSteel);
        ring.rotation.x = Math.PI / 2;
        aspGroup.add(ring);
        
        aspGroup.position.set((Math.random() - 0.5) * (terrainWidth - 40), 0, (Math.random() - 0.5) * (terrainDepth - 30));
        
        // Store data for plastic deformation animation
        aspGroup.userData = { originalScaleY: 1.0, isDeformed: false, maxH: height };
        
        asperityTerrainGroup.add(aspGroup);
        asperityList.push(aspGroup);
    }
    meshes.asperityList = asperityList;

    // Secondary Asperity Craters
    for(let i=0; i<40; i++) {
        const craterGrp = new THREE.Group();
        const craterTorus = new THREE.Mesh(new THREE.TorusGeometry(10, 3, 16, 32), steel);
        craterTorus.rotation.x = Math.PI / 2;
        craterGrp.add(craterTorus);
        
        for(let j=0; j<12; j++) {
            const angle = (j / 12) * Math.PI * 2;
            const tooth = new THREE.Mesh(new THREE.ConeGeometry(1.5, 6, 4), darkSteel);
            tooth.position.set(Math.cos(angle)*8, 2, Math.sin(angle)*8);
            tooth.rotation.x = -Math.sin(angle)*0.8;
            tooth.rotation.z = Math.cos(angle)*0.8;
            craterGrp.add(tooth);
        }
        craterGrp.position.set((Math.random() - 0.5) * (terrainWidth - 50), -2, (Math.random() - 0.5) * (terrainDepth - 50));
        asperityTerrainGroup.add(craterGrp);
    }

    // Wear Debris Generation (Scattered Particles)
    const debrisList = [];
    const debrisGeo = new THREE.IcosahedronGeometry(2, 0);
    const p = debrisGeo.attributes.position;
    for(let i=0; i<p.count; i++) {
        p.setX(i, p.getX(i) * (0.6 + Math.random() * 0.8));
        p.setY(i, p.getY(i) * (0.6 + Math.random() * 0.8));
        p.setZ(i, p.getZ(i) * (0.6 + Math.random() * 0.8));
    }
    debrisGeo.computeVertexNormals();

    for(let i=0; i<150; i++) {
        const debris = new THREE.Mesh(debrisGeo, Math.random() > 0.5 ? steel : chrome);
        debris.position.set(
            (Math.random() - 0.5) * terrainWidth * 0.9,
            Math.random() * 8,
            (Math.random() - 0.5) * terrainDepth * 0.9
        );
        debris.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
        debris.userData = { settled: true, startPos: debris.position.clone() };
        asperityTerrainGroup.add(debris);
        debrisList.push(debris);
    }
    meshes.debrisList = debrisList;

    // --- TRIBOLOGY TEST VEHICLE ---
    
    // Chassis
    const chassisGroup = new THREE.Group();
    const chassisShape = new THREE.Shape();
    chassisShape.moveTo(-80, 0);
    chassisShape.lineTo(80, 0);
    chassisShape.lineTo(95, 25);
    chassisShape.lineTo(60, 50);
    chassisShape.lineTo(-60, 50);
    chassisShape.lineTo(-95, 25);
    chassisShape.lineTo(-80, 0);

    const chassisGeo = new THREE.ExtrudeGeometry(chassisShape, { depth: 50, bevelEnabled: true, bevelThickness: 3, bevelSize: 2, bevelSegments: 6 });
    const chassisMesh = new THREE.Mesh(chassisGeo, darkSteel);
    chassisMesh.position.set(0, 40, -25);
    chassisGroup.add(chassisMesh);

    // Chassis Grilles
    const grilleGroup = new THREE.Group();
    for(let i=0; i<40; i++) {
        const slat = new THREE.Mesh(new THREE.BoxGeometry(110, 1.5, 3), chrome);
        slat.position.set(0, i * 1.5 - 20, 26);
        slat.rotation.x = 0.3;
        grilleGroup.add(slat);
    }
    grilleGroup.position.set(0, 65, 0);
    chassisGroup.add(grilleGroup);

    // Micro-Rivets across Chassis
    const rivetGeo = new THREE.SphereGeometry(0.7, 8, 8);
    for(let i=-60; i<=60; i+=12) {
        for(let j=5; j<=45; j+=10) {
            const r1 = new THREE.Mesh(rivetGeo, chrome);
            r1.position.set(i, 40 + j, 28);
            chassisGroup.add(r1);
            const r2 = new THREE.Mesh(rivetGeo, chrome);
            r2.position.set(i, 40 + j, -28);
            chassisGroup.add(r2);
        }
    }

    // Operator Cabin
    const cabinGroup = new THREE.Group();
    const cabinBase = new THREE.Mesh(new THREE.BoxGeometry(50, 6, 40), steel);
    cabinGroup.add(cabinBase);
    const cabinRoof = new THREE.Mesh(new THREE.BoxGeometry(48, 3, 38), steel);
    cabinRoof.position.y = 35;
    cabinGroup.add(cabinRoof);

    // Tinted Glass Windows
    const frontGlass = new THREE.Mesh(new THREE.BoxGeometry(46, 29, 2), tinted);
    frontGlass.position.set(0, 17.5, 18);
    cabinGroup.add(frontGlass);
    const backGlass = new THREE.Mesh(new THREE.BoxGeometry(46, 29, 2), tinted);
    backGlass.position.set(0, 17.5, -18);
    cabinGroup.add(backGlass);
    const leftGlass = new THREE.Mesh(new THREE.BoxGeometry(2, 29, 34), tinted);
    leftGlass.position.set(-23, 17.5, 0);
    cabinGroup.add(leftGlass);
    const rightGlass = new THREE.Mesh(new THREE.BoxGeometry(2, 29, 34), tinted);
    rightGlass.position.set(23, 17.5, 0);
    cabinGroup.add(rightGlass);

    // Cabin Interior
    const seatCushion = new THREE.Mesh(new THREE.BoxGeometry(12, 5, 14), rubber);
    seatCushion.position.set(0, 5.5, -6);
    const seatBack = new THREE.Mesh(new THREE.BoxGeometry(12, 20, 5), rubber);
    seatBack.position.set(0, 18, -11);
    seatBack.rotation.x = -0.15;
    cabinGroup.add(seatCushion, seatBack);

    const steeringColumn = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 12, 16), darkSteel);
    steeringColumn.position.set(0, 10, 8);
    steeringColumn.rotation.x = Math.PI / 4;
    cabinGroup.add(steeringColumn);

    const steeringWheel = new THREE.Mesh(new THREE.TorusGeometry(5, 1, 16, 32), plastic);
    steeringWheel.position.set(0, 14, 12);
    steeringWheel.rotation.x = -Math.PI / 4;
    cabinGroup.add(steeringWheel);

    const screenGeo = new THREE.PlaneGeometry(10, 6);
    const screenMat1 = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x0088ff, emissiveIntensity: 1.0, side: THREE.DoubleSide });
    const screen1 = new THREE.Mesh(screenGeo, screenMat1);
    screen1.position.set(-8, 18, 16);
    screen1.rotation.y = Math.PI / 6;
    cabinGroup.add(screen1);
    meshes.screenMat1 = screenMat1;

    const screenMat2 = new THREE.MeshStandardMaterial({ color: 0xff00ff, emissive: 0xaa00aa, emissiveIntensity: 0.8, side: THREE.DoubleSide });
    const screen2 = new THREE.Mesh(screenGeo, screenMat2);
    screen2.position.set(8, 18, 16);
    screen2.rotation.y = -Math.PI / 6;
    cabinGroup.add(screen2);
    meshes.screenMat2 = screenMat2;

    cabinGroup.position.set(-35, 90, -20);
    chassisGroup.add(cabinGroup);

    // Exhaust System & Smoke
    const exhaustGroup = new THREE.Group();
    const stackGeo = new THREE.CylinderGeometry(5, 5, 40, 32);
    const stack1 = new THREE.Mesh(stackGeo, chrome);
    stack1.position.set(-25, 20, 35);
    const stack2 = new THREE.Mesh(stackGeo, chrome);
    stack2.position.set(25, 20, 35);
    
    const bendGeo = new THREE.TorusGeometry(10, 5, 16, 32, Math.PI / 2);
    const bend1 = new THREE.Mesh(bendGeo, chrome);
    bend1.position.set(-35, 40, 35);
    bend1.rotation.y = -Math.PI / 2;
    const bend2 = new THREE.Mesh(bendGeo, chrome);
    bend2.position.set(35, 40, 35);
    // Orient correctly
    bend2.rotation.y = Math.PI / 2;
    bend2.rotation.x = Math.PI;

    exhaustGroup.add(stack1, stack2, bend1, bend2);
    exhaustGroup.position.set(45, 90, -30);
    chassisGroup.add(exhaustGroup);

    const smokeParticles = [];
    const smokeGeo = new THREE.SphereGeometry(4, 8, 8);
    const smokeMat = new THREE.MeshStandardMaterial({ color: 0x333333, transparent: true, opacity: 0.8, depthWrite: false });
    
    for(let i=0; i<60; i++) {
        const smoke = new THREE.Mesh(smokeGeo, smokeMat.clone());
        const isLeft = i % 2 === 0;
        smoke.userData = { 
            baseOffset: new THREE.Vector3(isLeft ? 10 : 80, 130, 5),
            startPos: new THREE.Vector3()
        };
        smokeParticles.push(smoke);
        group.add(smoke); // Add directly to main group to decouple from vehicle rotation
    }
    meshes.smokeParticles = smokeParticles;

    // Hydraulic Boom Arm
    const boomGroup = new THREE.Group();
    const boomShape = new THREE.Shape();
    boomShape.moveTo(0, -15);
    boomShape.lineTo(60, 25);
    boomShape.lineTo(150, -15);
    boomShape.lineTo(150, -30);
    boomShape.lineTo(60, -5);
    boomShape.lineTo(0, -40);

    const boomGeo = new THREE.ExtrudeGeometry(boomShape, { depth: 20, bevelEnabled: true, bevelThickness: 2, bevelSize: 2 });
    const boomMesh = new THREE.Mesh(boomGeo, steel);
    boomMesh.position.set(0, 0, -10);
    boomGroup.add(boomMesh);

    const hingeGeo = new THREE.CylinderGeometry(15, 15, 30, 32);
    const hingeMain = new THREE.Mesh(hingeGeo, chrome);
    hingeMain.rotation.x = Math.PI / 2;
    hingeMain.position.set(0, -25, 0);
    boomGroup.add(hingeMain);

    boomGroup.position.set(30, 70, 0);
    chassisGroup.add(boomGroup);
    meshes.boomGroup = boomGroup;

    // Main Actuator Piston
    const pistonGroup = new THREE.Group();
    const outerPiston = new THREE.Mesh(new THREE.CylinderGeometry(8, 8, 50, 32), darkSteel);
    pistonGroup.add(outerPiston);
    const innerPiston = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 60, 32), chrome);
    innerPiston.position.y = -30;
    pistonGroup.add(innerPiston);
    meshes.innerPiston = innerPiston;
    pistonGroup.position.set(70, 45, 0);
    pistonGroup.rotation.z = -Math.PI / 5;
    chassisGroup.add(pistonGroup);

    // Complex Hydraulic Lines Network
    const hydroLinesGroup = new THREE.Group();
    const createLine = (points) => {
        const curve = new THREE.CatmullRomCurve3(points);
        const geo = new THREE.TubeGeometry(curve, 64, 1.5, 12, false);
        return new THREE.Mesh(geo, rubber);
    };

    hydroLinesGroup.add(createLine([
        new THREE.Vector3(70, 45, 10), new THREE.Vector3(60, 60, 20), new THREE.Vector3(40, 75, 15), new THREE.Vector3(20, 80, 5)
    ]));
    hydroLinesGroup.add(createLine([
        new THREE.Vector3(70, 45, -10), new THREE.Vector3(60, 60, -20), new THREE.Vector3(40, 75, -15), new THREE.Vector3(20, 80, -5)
    ]));
    hydroLinesGroup.add(createLine([
        new THREE.Vector3(140, 65, 8), new THREE.Vector3(120, 75, 15), new THREE.Vector3(90, 85, 10), new THREE.Vector3(50, 95, 0)
    ]));

    // Copper Fittings for lines
    hydroLinesGroup.children.forEach(line => {
        const path = line.geometry.parameters.path;
        const f1 = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 5, 16), copper);
        f1.position.copy(path.getPoint(0));
        f1.lookAt(path.getPoint(0.1));
        hydroLinesGroup.add(f1);
        const f2 = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 5, 16), copper);
        f2.position.copy(path.getPoint(1));
        f2.lookAt(path.getPoint(0.9));
        hydroLinesGroup.add(f2);
    });
    chassisGroup.add(hydroLinesGroup);

    // --- TRIBOLOGY TIRE ASSEMBLY (The main experimental probe) ---
    const tireAssembly = new THREE.Group();
    
    // Fork
    const forkGeo = new THREE.CylinderGeometry(4, 4, 40, 32);
    const forkLeft = new THREE.Mesh(forkGeo, darkSteel);
    forkLeft.position.set(0, 20, -18);
    const forkRight = new THREE.Mesh(forkGeo, darkSteel);
    forkRight.position.set(0, 20, 18);
    tireAssembly.add(forkLeft, forkRight);
    const forkTop = new THREE.Mesh(new THREE.BoxGeometry(10, 8, 44), darkSteel);
    forkTop.position.set(0, 40, 0);
    tireAssembly.add(forkTop);

    // Axle
    const axle = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.5, 50, 32), chrome);
    axle.rotation.x = Math.PI / 2;
    tireAssembly.add(axle);

    // Tire Group (Rolls independently)
    const tireGroup = new THREE.Group();
    const tireRadius = 32;
    const tireTube = 12;
    
    // Base Torus
    const tireMesh = new THREE.Mesh(new THREE.TorusGeometry(tireRadius, tireTube, 64, 128), rubber);
    tireGroup.add(tireMesh);

    // Extreme Off-Road Lugs (Hundreds of deformed boxes)
    const numLugs = 200;
    const lugGeo = new THREE.BoxGeometry(4, 5, 6);
    const lugPos = lugGeo.attributes.position;
    for(let i=0; i<lugPos.count; i++) {
        if(lugPos.getY(i) > 0) {
            lugPos.setX(i, lugPos.getX(i) * 0.4);
            lugPos.setZ(i, lugPos.getZ(i) * 0.4);
        }
    }
    lugGeo.computeVertexNormals();

    for(let i=0; i<numLugs; i++) {
        const angle = (i / numLugs) * Math.PI * 2 * 2; // Spread across 2 full wraps
        const zOffset = Math.sin(angle * 15) * (tireTube * 0.6);
        const lug = new THREE.Mesh(lugGeo, rubber);
        lug.position.set(
            Math.cos(angle) * (tireRadius + tireTube * 0.9),
            Math.sin(angle) * (tireRadius + tireTube * 0.9),
            zOffset
        );
        lug.rotation.z = angle + Math.PI/2;
        lug.rotation.x = zOffset > 0 ? 0.4 : -0.4;
        tireGroup.add(lug);
    }

    // Side Biters (Cones)
    for(let i=0; i<120; i++) {
        const angle = (i / 120) * Math.PI * 2;
        const sideLug = new THREE.Mesh(new THREE.ConeGeometry(2, 5, 5), rubber);
        const isLeft = i % 2 === 0;
        sideLug.position.set(
            Math.cos(angle) * (tireRadius + tireTube * 0.7),
            Math.sin(angle) * (tireRadius + tireTube * 0.7),
            isLeft ? tireTube * 0.8 : -tireTube * 0.8
        );
        sideLug.rotation.z = angle + Math.PI/2;
        sideLug.rotation.x = isLeft ? Math.PI / 2 : -Math.PI / 2;
        tireGroup.add(sideLug);
    }

    // Complex Rim
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(22, 22, tireTube * 2.1, 64, 1, true), chrome);
    rim.rotation.x = Math.PI / 2;
    tireGroup.add(rim);

    // Rim Spokes
    for(let i=0; i<16; i++) {
        const angle = (i / 16) * Math.PI * 2;
        const spokeGrp = new THREE.Group();
        const mainSpoke = new THREE.Mesh(new THREE.CylinderGeometry(2, 1.2, 22, 16), steel);
        mainSpoke.position.y = 11;
        spokeGrp.add(mainSpoke);
        const web = new THREE.Mesh(new THREE.PlaneGeometry(6, 18), darkSteel);
        web.position.y = 11;
        web.position.z = 1.5;
        spokeGrp.add(web);
        spokeGrp.rotation.z = angle;
        tireGroup.add(spokeGrp);
    }

    const hub = new THREE.Mesh(new THREE.CylinderGeometry(6, 6, tireTube * 2.5, 32), darkSteel);
    hub.rotation.x = Math.PI / 2;
    tireGroup.add(hub);

    const rollGroup = new THREE.Group();
    rollGroup.add(tireGroup);
    tireAssembly.add(rollGroup);
    meshes.rollGroup = rollGroup;

    // Acoustic Emission Sensor mounted on fork
    const aeSensor = new THREE.Mesh(new THREE.CylinderGeometry(3, 4, 12, 32), aluminum);
    aeSensor.position.set(10, 30, 0);
    aeSensor.rotation.z = -Math.PI / 4;
    tireAssembly.add(aeSensor);
    const aeWire = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
        new THREE.Vector3(10, 35, 0), new THREE.Vector3(-5, 45, 5), new THREE.Vector3(-10, 60, 0)
    ]), 32, 0.8, 8, false), copper);
    tireAssembly.add(aeWire);

    tireAssembly.position.set(150, -25, 0);
    boomGroup.add(tireAssembly);
    
    // Thermal/Laser Array looking at contact patch
    const sensorArray = new THREE.Group();
    const sensorBase = new THREE.Mesh(new THREE.BoxGeometry(12, 12, 18), steel);
    sensorArray.add(sensorBase);
    const lens = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 10, 32), glass);
    lens.rotation.x = Math.PI / 2;
    lens.position.set(0, 0, 12);
    sensorArray.add(lens);
    const laser = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 80, 16), new THREE.MeshBasicMaterial({color: 0xff0000, transparent: true, opacity: 0.6}));
    laser.rotation.x = Math.PI / 2;
    laser.position.set(0, 0, 50);
    sensorArray.add(laser);
    
    sensorArray.position.set(100, 10, 35);
    sensorArray.rotation.y = -Math.PI / 5;
    sensorArray.rotation.x = -Math.PI / 8;
    boomGroup.add(sensorArray);

    mainVehicleGroup.add(chassisGroup);
    meshes.mainVehicleGroup = mainVehicleGroup;

    group.add(asperityTerrainGroup);
    group.add(mainVehicleGroup);

    // --- DEFINITIONS ---
    const parts = [
        { 
            name: "Asperity_Substrate", 
            description: "Microscopic jagged metallic substrate causing intense frictional wear. Designed with complex lathes and extrusions to mimic real rough surfaces.", 
            material: "Dark Steel / Chrome", 
            function: "Provide extreme tribological testing terrain.", 
            assemblyOrder: 1, 
            connections: ["Ground"], 
            failureEffect: "Complete loss of traction.", 
            cascadeFailures: ["Tire_Shredding", "Overheating"], 
            originalPosition: {x: 0, y: -10, z: 0}, 
            explodedPosition: {x: 0, y: -80, z: 0} 
        },
        { 
            name: "Tribo_Tire_Assembly", 
            description: "Hyper-advanced analytical rubber tire with hundreds of aggressive off-road lugs.", 
            material: "Rubber / Chrome", 
            function: "Interact with asperities to measure wear and friction.", 
            assemblyOrder: 2, 
            connections: ["Axle", "Hydraulic_Boom"], 
            failureEffect: "Catastrophic blowout and debris scatter.", 
            cascadeFailures: ["Loss of test data", "Suspension collapse"], 
            originalPosition: {x: 150, y: -25, z: 0}, 
            explodedPosition: {x: 300, y: -20, z: 100} 
        },
        { 
            name: "Hydraulic_Boom_Arm", 
            description: "Heavy-duty articulated boom exerting precise normal load onto the microscopic surface.", 
            material: "Steel", 
            function: "Control the contact pressure between tire and asperities.", 
            assemblyOrder: 3, 
            connections: ["Chassis", "Tribo_Tire_Assembly"], 
            failureEffect: "Loss of normal load control.", 
            cascadeFailures: ["Data corruption", "Vehicle instability"], 
            originalPosition: {x: 30, y: 70, z: 0}, 
            explodedPosition: {x: 60, y: 150, z: -100} 
        },
        { 
            name: "Main_Actuator_Piston", 
            description: "High-pressure hydraulic piston reacting to terrain height variations.", 
            material: "Chrome / Dark Steel", 
            function: "Drive the boom arm vertically based on topological feedback.", 
            assemblyOrder: 4, 
            connections: ["Hydraulic_Boom_Arm", "Chassis"], 
            failureEffect: "Hydraulic fluid leak.", 
            cascadeFailures: ["Pressure loss"], 
            originalPosition: {x: 70, y: 45, z: 0}, 
            explodedPosition: {x: 100, y: 100, z: -50} 
        },
        { 
            name: "Hydraulic_Line_Network", 
            description: "Complex web of tubes with copper fittings delivering fluid to actuators.", 
            material: "Rubber / Copper", 
            function: "Transmit hydraulic power across the chassis.", 
            assemblyOrder: 5, 
            connections: ["Main_Actuator_Piston", "Boom_Arm"], 
            failureEffect: "Burst line.", 
            cascadeFailures: ["Actuator failure", "Total system shutdown"], 
            originalPosition: {x: 50, y: 70, z: 0}, 
            explodedPosition: {x: 80, y: 120, z: 80} 
        },
        { 
            name: "Operator_Cabin", 
            description: "Highly detailed control room with tinted glass viewing ports and internal controls.", 
            material: "Steel / Tinted Glass", 
            function: "House operators and telemetry interfaces.", 
            assemblyOrder: 6, 
            connections: ["Chassis"], 
            failureEffect: "Environmental seal breach.", 
            cascadeFailures: ["Operator hazard"], 
            originalPosition: {x: -35, y: 90, z: -20}, 
            explodedPosition: {x: -100, y: 200, z: -80} 
        },
        { 
            name: "Glowing_Control_Panel", 
            description: "Holographic dashboard for monitoring real-time tribological friction data.", 
            material: "Emissive Plastic", 
            function: "Display dynamic friction coefficients and local wear rates.", 
            assemblyOrder: 7, 
            connections: ["Operator_Cabin"], 
            failureEffect: "Loss of telemetry.", 
            cascadeFailures: ["Blind operation"], 
            originalPosition: {x: -43, y: 108, z: -4}, 
            explodedPosition: {x: -120, y: 220, z: -40} 
        },
        { 
            name: "Exhaust_Stack_Array", 
            description: "Massive twin chrome exhaust pipes emitting particle-based simulation smoke.", 
            material: "Chrome", 
            function: "Vent high-temperature gases from the drive generator.", 
            assemblyOrder: 8, 
            connections: ["Chassis"], 
            failureEffect: "Engine overheating.", 
            cascadeFailures: ["Thermal shutdown", "Power loss"], 
            originalPosition: {x: 45, y: 90, z: -30}, 
            explodedPosition: {x: 120, y: 250, z: -120} 
        },
        { 
            name: "Wear_Debris_Particles", 
            description: "Scattered icosahedron elements generated from intense asperity collisions.", 
            material: "Steel / Chrome", 
            function: "Simulate third-body abrasive wear mechanics.", 
            assemblyOrder: 9, 
            connections: ["Asperity_Substrate"], 
            failureEffect: "Particle agglomeration.", 
            cascadeFailures: ["Seizure of moving parts"], 
            originalPosition: {x: 0, y: 0, z: 0}, 
            explodedPosition: {x: 0, y: 50, z: 200} 
        },
        { 
            name: "Acoustic_Emission_Sensor", 
            description: "Aluminum housing with copper wiring detecting high-frequency micro-fractures.", 
            material: "Aluminum / Copper", 
            function: "Record acoustic signatures of asperity fracture.", 
            assemblyOrder: 10, 
            connections: ["Tribo_Tire_Assembly"], 
            failureEffect: "Signal noise.", 
            cascadeFailures: ["False positive detection"], 
            originalPosition: {x: 160, y: 5, z: 0}, 
            explodedPosition: {x: 250, y: 80, z: 50} 
        },
        { 
            name: "Laser_Thermal_Scanner", 
            description: "Targeting laser and lens array mapping temperature flashes at contact points.", 
            material: "Steel / Glass", 
            function: "Provide real-time topographical and thermal data.", 
            assemblyOrder: 11, 
            connections: ["Hydraulic_Boom_Arm"], 
            failureEffect: "Lens scratch.", 
            cascadeFailures: ["Blind thermal mapping"], 
            originalPosition: {x: 130, y: 80, z: 35}, 
            explodedPosition: {x: 200, y: 160, z: 120} 
        },
        { 
            name: "Chassis_Grille", 
            description: "Heavy multi-slat chrome grille for engine cooling.", 
            material: "Chrome", 
            function: "Protect internal components from large flying debris.", 
            assemblyOrder: 12, 
            connections: ["Chassis"], 
            failureEffect: "Impact fracture.", 
            cascadeFailures: ["Radiator puncture"], 
            originalPosition: {x: 0, y: 105, z: -25}, 
            explodedPosition: {x: 0, y: 180, z: -150} 
        },
        { 
            name: "Micro_Rivet_Matrix", 
            description: "Hundreds of spherical rivets binding the extreme duty chassis plates.", 
            material: "Chrome", 
            function: "Ensure structural integrity under intense vibrational loads.", 
            assemblyOrder: 13, 
            connections: ["Chassis"], 
            failureEffect: "Shear failure.", 
            cascadeFailures: ["Panel separation", "Catastrophic disassembly"], 
            originalPosition: {x: 0, y: 65, z: -25}, 
            explodedPosition: {x: -50, y: 100, z: -200} 
        },
        { 
            name: "Steering_Console", 
            description: "Complex column and torus wheel for navigating the rugged topography.", 
            material: "Dark Steel / Plastic", 
            function: "Control the lateral tracking of the test tire.", 
            assemblyOrder: 14, 
            connections: ["Operator_Cabin"], 
            failureEffect: "Loss of steering control.", 
            cascadeFailures: ["Test track deviation"], 
            originalPosition: {x: -35, y: 104, z: -12}, 
            explodedPosition: {x: -80, y: 180, z: -50} 
        },
        { 
            name: "Secondary_Asperity_Craters", 
            description: "Deformed torus and cone structures simulating localized pitting and spalling.", 
            material: "Steel / Dark Steel", 
            function: "Introduce non-linear shock loads to the suspension system.", 
            assemblyOrder: 15, 
            connections: ["Asperity_Substrate"], 
            failureEffect: "Structural collapse.", 
            cascadeFailures: ["Loss of terrain data"], 
            originalPosition: {x: 0, y: -2, z: 0}, 
            explodedPosition: {x: 0, y: -60, z: 150} 
        }
    ];

    const quizQuestions = [
        {
            question: "What primary mechanism of wear results from the intense microscopic collision of asperities simulated in this model?",
            options: ["Adhesive wear", "Abrasive wear", "Cavitation erosion", "Fretting fatigue"],
            answer: "Abrasive wear",
            explanation: "As the hard asperities of the terrain collide with the dynamic tire surface, intense abrasive wear occurs, characterized by the plowing of microscopic peaks and the generation of wear debris."
        },
        {
            question: "How does the hydraulic boom arm compensate for the extreme topographical landscape of the asperity field?",
            options: ["By adjusting pneumatic tire pressure", "Through dynamic articulation and piston extension maintaining normal load", "By increasing rotational RPM", "By dispensing a boundary lubricant layer"],
            answer: "Through dynamic articulation and piston extension maintaining normal load",
            explanation: "The articulated boom arm dynamically adjusts its Z-axis rotation while extending the inner piston to ride over the jagged peaks, ensuring constant contact pressure."
        },
        {
            question: "In tribology, what does the irreversible flattening (scale.y reduction) of the metallic spikes simulate?",
            options: ["Elastic deformation", "Plastic deformation", "Thermal expansion", "Work hardening"],
            answer: "Plastic deformation",
            explanation: "The permanent reduction in height represents plastic deformation, occurring when the yield strength of the material is exceeded by extreme contact pressures."
        },
        {
            question: "What role do the scattered Icosahedron particles play in the system?",
            options: ["Boundary lubricant molecules", "Rolling bearings reducing friction", "Wear debris or third-body abrasive particles", "Thermal energy nodes dissipating heat"],
            answer: "Wear debris or third-body abrasive particles",
            explanation: "Fractured asperities form wear debris (third-body particles) which can become trapped in the contact zone, drastically altering friction coefficients and accelerating further wear."
        },
        {
            question: "Why is an aggressive off-road lug pattern utilized on the analytical tire instead of a smooth conformal surface?",
            options: ["To maximize aerodynamic efficiency", "To generate distinct high-pressure contact nodes against the jagged terrain", "To prevent overheating of the rubber matrix", "To absorb acoustic emissions"],
            answer: "To generate distinct high-pressure contact nodes against the jagged terrain",
            explanation: "The extruded lugs create concentrated micro-contact areas. When these collide with the metallic asperities, they create extreme localized pressure and shear gradients, perfect for studying accelerated wear."
        }
    ];

    function animate(time, speed, passedMeshes) {
        const m = passedMeshes || meshes;
        const t = time * speed * 0.001;
        
        // Drive vehicle over terrain
        const travel = Math.sin(t * 0.3) * 160; 
        m.mainVehicleGroup.position.x = travel;
        
        // Tire rotation based on travel (Circumference approx 200)
        m.rollGroup.rotation.z = -travel / 32; 
        
        // Boom arm articulation & Asperity deformation
        const tireWorldX = travel + 150 + 30; // Chassis offset + Boom offset + Fork offset
        let maxHeight = 0;
        
        m.asperityList.forEach(asp => {
            const dx = Math.abs(asp.position.x - tireWorldX);
            const dz = Math.abs(asp.position.z);
            if(dx < 35 && dz < 25) { 
                const h = asp.scale.y * asp.userData.maxH;
                if(h > maxHeight) maxHeight = h;
                
                // Plastic crush
                if(dx < 15) {
                    asp.scale.y = THREE.MathUtils.lerp(asp.scale.y, 0.2, 0.15);
                    asp.userData.isDeformed = true;
                }
            } else if (asp.userData.isDeformed) {
                 // Slow pseudo-elastic recovery for visual looping purposes
                 asp.scale.y = THREE.MathUtils.lerp(asp.scale.y, asp.userData.originalScaleY * 0.5, 0.002);
            }
        });
        
        // Adjust boom angle based on highest asperity under the wheel
        const targetBoomRot = 0.05 + (maxHeight * 0.012);
        m.boomGroup.rotation.z = THREE.MathUtils.lerp(m.boomGroup.rotation.z, targetBoomRot, 0.1);
        
        // Sync inner hydraulic piston
        m.innerPiston.position.y = -30 + (m.boomGroup.rotation.z * 60);
        
        // Dynamic wear debris scattering
        m.debrisList.forEach((debris) => {
            const dx = Math.abs(debris.position.x - tireWorldX);
            if (dx < 40 && debris.userData.settled) {
                // Kick up particles
                debris.userData.settled = false;
            }
            if (!debris.userData.settled) {
                debris.position.x += (Math.random() - 0.5) * 4;
                debris.position.y += Math.random() * 4;
                debris.position.z += (Math.random() - 0.5) * 4;
                debris.rotation.x += 0.3;
                debris.rotation.y += 0.3;
                if (debris.position.y > 30) debris.userData.settled = true;
            } else {
                if(debris.position.y > 0) debris.position.y -= 1.5;
            }
        });
        
        // Smoke exhaust
        m.smokeParticles.forEach((particle, i) => {
            particle.position.y += 1.0 + Math.random() * 1.5;
            particle.position.x -= 0.5 + Math.random(); 
            particle.scale.setScalar(particle.scale.x * 1.04);
            particle.material.opacity -= 0.02;
            
            if (particle.material.opacity <= 0) {
                // Respawn synced with vehicle movement
                particle.position.copy(particle.userData.baseOffset);
                particle.position.x += travel; // match vehicle
                particle.scale.setScalar(1);
                particle.material.opacity = 0.8;
            }
        });
        
        // Pulse telemetry screens
        m.screenMat1.emissiveIntensity = 0.6 + Math.abs(Math.sin(t * 12)) * 0.4;
        m.screenMat2.emissiveIntensity = 0.6 + Math.abs(Math.cos(t * 8)) * 0.4;
    }

    return {
        group,
        parts,
        description: "A hyper-advanced Tribological Simulator mapping microscopic surface asperities and severe abrasive wear dynamics via a heavy-duty analytical test rig.",
        quizQuestions,
        animate,
        meshes
    };
}

// Auto-generated missing stub
export function createSurfaceAsperities() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
