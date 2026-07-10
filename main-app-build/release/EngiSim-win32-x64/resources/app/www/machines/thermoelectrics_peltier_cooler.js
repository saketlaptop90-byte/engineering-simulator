import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Emissive Materials
    const hotMat = new THREE.MeshStandardMaterial({
        color: 0xff2200,
        emissive: 0xff1100,
        emissiveIntensity: 0.8,
        metalness: 0.3,
        roughness: 0.7
    });

    const coldMat = new THREE.MeshStandardMaterial({
        color: 0x0055ff,
        emissive: 0x0022ff,
        emissiveIntensity: 0.8,
        metalness: 0.3,
        roughness: 0.7
    });

    const screenMat = new THREE.MeshStandardMaterial({
        color: 0x00ffaa,
        emissive: 0x00ffaa,
        emissiveIntensity: 1.0,
        transparent: true,
        opacity: 0.9
    });

    const pTypeMaterial = new THREE.MeshStandardMaterial({
        color: 0xaa2255,
        emissive: 0x440011,
        emissiveIntensity: 0.4,
        metalness: 0.6,
        roughness: 0.4
    });

    const nTypeMaterial = new THREE.MeshStandardMaterial({
        color: 0x22aacc,
        emissive: 0x002233,
        emissiveIntensity: 0.4,
        metalness: 0.6,
        roughness: 0.4
    });

    const solderMaterial = new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        metalness: 0.9,
        roughness: 0.2
    });

    // Helper: Chamfered Box for Substrates
    function createChamferedBox(width, height, depth, radius) {
        const shape = new THREE.Shape();
        shape.moveTo(-width/2 + radius, -height/2);
        shape.lineTo(width/2 - radius, -height/2);
        shape.quadraticCurveTo(width/2, -height/2, width/2, -height/2 + radius);
        shape.lineTo(width/2, height/2 - radius);
        shape.quadraticCurveTo(width/2, height/2, width/2 - radius, height/2);
        shape.lineTo(-width/2 + radius, height/2);
        shape.quadraticCurveTo(-width/2, height/2, -width/2, height/2 - radius);
        shape.lineTo(-width/2, -height/2 + radius);
        shape.quadraticCurveTo(-width/2, -height/2, -width/2 + radius, -height/2);
        
        const extrudeSettings = { depth: depth, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: radius/2, bevelThickness: radius/2 };
        return new THREE.ExtrudeGeometry(shape, extrudeSettings);
    }

    // ==========================================
    // 1. INDUSTRIAL BASE & PLATFORM
    // ==========================================
    const baseGroup = new THREE.Group();
    group.add(baseGroup);

    const platform = new THREE.Mesh(new THREE.BoxGeometry(100, 2, 100), steel);
    platform.position.y = 1;
    baseGroup.add(platform);

    parts.push({
        name: "Industrial Base Platform",
        description: "Heavy steel foundation supporting the entire thermoelectric testing rig.",
        material: "Reinforced Steel",
        function: "Provides structural stability and vibration damping.",
        assemblyOrder: 1,
        connections: ["Operator Cabin", "Pivot Gear"],
        failureEffect: "Structural collapse under extreme load.",
        cascadeFailures: ["Total system destruction"],
        originalPosition: {x: 0, y: 1, z: 0},
        explodedPosition: {x: 0, y: -20, z: 0}
    });

    // Heavy Grilles
    for (let i = 0; i < 12; i++) {
        const bar = new THREE.Mesh(new THREE.BoxGeometry(80, 0.5, 2), darkSteel);
        bar.position.set(0, 2.25, -40 + i * 7.5);
        baseGroup.add(bar);
    }

    // Access Ladder
    const ladder = new THREE.Group();
    const rail1 = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 25, 8), steel);
    rail1.position.set(-4, 12.5, 50);
    const rail2 = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 25, 8), steel);
    rail2.position.set(4, 12.5, 50);
    ladder.add(rail1);
    ladder.add(rail2);
    for (let i = 0; i < 12; i++) {
        const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 8, 8), steel);
        rung.rotation.z = Math.PI / 2;
        rung.position.set(0, 2 + i * 2, 50);
        ladder.add(rung);
    }
    baseGroup.add(ladder);

    // Operator Cabin
    const cabin = new THREE.Group();
    const cabBody = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20), steel);
    cabBody.position.set(30, 12, 30);
    cabin.add(cabBody);

    const cabGlass = new THREE.Mesh(new THREE.BoxGeometry(18, 10, 21), tinted);
    cabGlass.position.set(30, 15, 30);
    cabin.add(cabGlass);

    const panel = new THREE.Mesh(new THREE.BoxGeometry(16, 2, 5), darkSteel);
    panel.position.set(30, 12, 22);
    panel.rotation.x = Math.PI / 4;
    cabin.add(panel);

    const screen1 = new THREE.Mesh(new THREE.BoxGeometry(7, 5, 0.5), screenMat);
    screen1.position.set(26, 14, 20);
    screen1.rotation.x = Math.PI / 6;
    cabin.add(screen1);

    const screen2 = new THREE.Mesh(new THREE.BoxGeometry(7, 5, 0.5), screenMat);
    screen2.position.set(34, 14, 20);
    screen2.rotation.x = Math.PI / 6;
    cabin.add(screen2);

    const joystick1 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.4, 3), rubber);
    joystick1.position.set(25, 13.5, 23);
    joystick1.rotation.x = -Math.PI / 6;
    cabin.add(joystick1);

    const joystick2 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.4, 3), rubber);
    joystick2.position.set(35, 13.5, 23);
    joystick2.rotation.x = -Math.PI / 6;
    cabin.add(joystick2);

    // Side Mirrors
    const mirrorStem = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 3), darkSteel);
    mirrorStem.rotation.z = Math.PI / 3;
    mirrorStem.position.set(41, 16, 32);
    cabin.add(mirrorStem);
    const mirrorHousing = new THREE.Mesh(new THREE.BoxGeometry(0.5, 4, 2.5), plastic);
    mirrorHousing.position.set(42.5, 17, 32);
    cabin.add(mirrorHousing);
    const mirrorGlass = new THREE.Mesh(new THREE.BoxGeometry(0.1, 3.8, 2.3), chrome);
    mirrorGlass.position.set(42.8, 17, 32);
    cabin.add(mirrorGlass);

    baseGroup.add(cabin);

    parts.push({
        name: "Operator Control Cabin",
        description: "Enclosed, tinted glass cabin containing diagnostic screens and joysticks for the TEC array.",
        material: "Steel / Tinted Glass",
        function: "Allows operator to monitor thermal runaway and control current flow safely.",
        assemblyOrder: 2,
        connections: ["Industrial Base Platform"],
        failureEffect: "Loss of manual override capabilities.",
        cascadeFailures: ["Unmonitored thermal event"],
        originalPosition: {x: 30, y: 12, z: 30},
        explodedPosition: {x: 60, y: 12, z: 60}
    });

    // Exhaust Stack
    const exhaustGroup = new THREE.Group();
    const stackPipe = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 25, 16), darkSteel);
    stackPipe.position.y = 12.5;
    exhaustGroup.add(stackPipe);
    const stackFlap = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.2, 16), steel);
    stackFlap.position.y = 25.2;
    stackFlap.rotation.x = Math.PI / 4;
    exhaustGroup.add(stackFlap);
    exhaustGroup.position.set(-30, 2, 30);
    baseGroup.add(exhaustGroup);

    // ==========================================
    // 2. ARTICULATED BOOM & PISTONS
    // ==========================================
    const pivotGear = new THREE.Mesh(new THREE.CylinderGeometry(12, 12, 3, 32), chrome);
    pivotGear.position.set(0, 3.5, -15);
    baseGroup.add(pivotGear);

    for(let i=0; i<24; i++) {
        let bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 4, 6), darkSteel);
        let angle = (i / 24) * Math.PI * 2;
        bolt.position.set(Math.cos(angle) * 10, 3.5, -15 + Math.sin(angle) * 10);
        baseGroup.add(bolt);
    }

    const boomSystem = new THREE.Group();
    boomSystem.position.set(0, 5, -15);
    group.add(boomSystem);

    const pivotStand = new THREE.Mesh(new THREE.BoxGeometry(14, 20, 14), darkSteel);
    pivotStand.position.y = 10;
    boomSystem.add(pivotStand);

    const boomArm = new THREE.Group();
    boomArm.position.y = 20;
    boomSystem.add(boomArm);

    const armMesh = new THREE.Mesh(new THREE.BoxGeometry(10, 70, 10), steel);
    armMesh.position.y = 35;
    boomArm.add(armMesh);

    parts.push({
        name: "Articulated Boom Arm",
        description: "Heavy mechanical arm maneuvering the Peltier module into position.",
        material: "High-Tensile Steel",
        function: "Provides structural reach and applies pressing force for thermal coupling.",
        assemblyOrder: 3,
        connections: ["Pivot Gear", "Hydraulic Pistons", "Peltier Assembly"],
        failureEffect: "Loss of thermal contact pressure.",
        cascadeFailures: ["Inefficient cooling", "Payload damage"],
        originalPosition: {x: 0, y: 25, z: -15},
        explodedPosition: {x: -30, y: 50, z: -30}
    });

    const pistonOuter = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 35, 16), darkSteel);
    pistonOuter.position.set(0, 15, 10);
    pistonOuter.rotation.x = -Math.PI / 8;
    boomSystem.add(pistonOuter);

    const pistonInner = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 40, 16), chrome);
    pistonInner.position.set(0, 30, 16);
    pistonInner.rotation.x = -Math.PI / 8;
    boomSystem.add(pistonInner);

    parts.push({
        name: "Hydraulic Piston System",
        description: "Dual-cylinder hydraulic actuator adjusting boom angle.",
        material: "Chrome / Dark Steel",
        function: "Translates fluid pressure into extreme linear force.",
        assemblyOrder: 4,
        connections: ["Articulated Boom Arm"],
        failureEffect: "Hydraulic leak causing boom collapse.",
        cascadeFailures: ["Crushing of test payload"],
        originalPosition: {x: 0, y: 25, z: -5},
        explodedPosition: {x: 20, y: 35, z: 20}
    });

    // ==========================================
    // 3. THE PELTIER COOLER ASSEMBLY
    // ==========================================
    const peltier = new THREE.Group();
    peltier.position.set(0, 75, 5);
    peltier.rotation.x = Math.PI / 2;
    boomArm.add(peltier);

    // Ceramic Plates
    const hotPlateGeo = createChamferedBox(40, 40, 2, 1);
    const hotPlate = new THREE.Mesh(hotPlateGeo, aluminum);
    hotPlate.rotation.x = Math.PI / 2;
    hotPlate.position.y = -1;
    peltier.add(hotPlate);

    parts.push({
        name: "Peltier Ceramic Hot Plate",
        description: "Alumina (Al2O3) ceramic substrate on the heat-rejecting side.",
        material: "Alumina Ceramic",
        function: "Electrically isolates the matrix while conducting intense heat into the sink.",
        assemblyOrder: 5,
        connections: ["Heat Sink", "Copper Interconnects"],
        failureEffect: "Thermal fracturing causing electrical short.",
        cascadeFailures: ["Array burnout"],
        originalPosition: {x: 0, y: -1, z: 0},
        explodedPosition: {x: 0, y: -25, z: 0}
    });

    const coldPlateGeo = createChamferedBox(40, 40, 2, 1);
    const coldPlate = new THREE.Mesh(coldPlateGeo, aluminum);
    coldPlate.rotation.x = Math.PI / 2;
    coldPlate.position.y = 8;
    peltier.add(coldPlate);

    parts.push({
        name: "Peltier Ceramic Cold Plate",
        description: "Alumina substrate on the heat-absorbing side.",
        material: "Alumina Ceramic",
        function: "Conducts heat from the payload into the semiconductor pillars.",
        assemblyOrder: 6,
        connections: ["Water Block", "Copper Interconnects"],
        failureEffect: "Thermal fracturing.",
        cascadeFailures: ["Loss of cooling"],
        originalPosition: {x: 0, y: 8, z: 0},
        explodedPosition: {x: 0, y: 35, z: 0}
    });

    // 6x6 Matrix Math
    const pathPoints = [];
    for (let i = 0; i < 36; i++) {
        let r = Math.floor(i / 6);
        let c = r % 2 === 0 ? i % 6 : 5 - (i % 6);
        let px = (c - 2.5) * 6;
        let pz = (r - 2.5) * 6;
        
        if (i % 2 === 0) { // Current flows UP
            pathPoints.push(new THREE.Vector3(px, 0.5, pz));
            pathPoints.push(new THREE.Vector3(px, 6.5, pz));
        } else { // Current flows DOWN
            pathPoints.push(new THREE.Vector3(px, 6.5, pz));
            pathPoints.push(new THREE.Vector3(px, 0.5, pz));
        }
    }

    // P and N Type Pillars
    const pTypeGeo = new THREE.LatheGeometry([
        new THREE.Vector2(0, 0),
        new THREE.Vector2(1.2, 0),
        new THREE.Vector2(1.2, 0.5),
        new THREE.Vector2(0.9, 1.5),
        new THREE.Vector2(0.9, 4.5),
        new THREE.Vector2(1.2, 5.5),
        new THREE.Vector2(1.2, 6.0),
        new THREE.Vector2(0, 6.0)
    ], 32);
    const nTypeGeo = pTypeGeo.clone();

    const pillars = new THREE.Group();
    for (let i = 0; i < 36; i++) {
        let r = Math.floor(i / 6);
        let c = i % 6;
        let px = (c - 2.5) * 6;
        let pz = (r - 2.5) * 6;
        let isP = (i % 2 === 0);
        let mesh = new THREE.Mesh(isP ? pTypeGeo : nTypeGeo, isP ? pTypeMaterial : nTypeMaterial);
        mesh.position.set(px, 0.5, pz);
        pillars.add(mesh);
    }
    peltier.add(pillars);

    parts.push({
        name: "Bismuth Telluride P-Type Matrix",
        description: "Hole-doped semiconductor pillars.",
        material: "Bismuth Telluride (Bi2Te3)",
        function: "Carries heat alongside electrical current via positive charge carriers.",
        assemblyOrder: 7,
        connections: ["Copper Interconnects", "Solder Joints"],
        failureEffect: "Semiconductor degradation, increasing internal resistance.",
        cascadeFailures: ["Joule heating overpowering cooling effect"],
        originalPosition: {x: 0, y: 3.5, z: 0},
        explodedPosition: {x: -20, y: 3.5, z: 0}
    });

    parts.push({
        name: "Bismuth Telluride N-Type Matrix",
        description: "Electron-doped semiconductor pillars.",
        material: "Bismuth Telluride (Bi2Te3)",
        function: "Carries heat against electrical current via negative charge carriers.",
        assemblyOrder: 8,
        connections: ["Copper Interconnects", "Solder Joints"],
        failureEffect: "Semiconductor degradation.",
        cascadeFailures: ["Joule heating overpowering cooling effect"],
        originalPosition: {x: 0, y: 3.5, z: 0},
        explodedPosition: {x: 20, y: 3.5, z: 0}
    });

    // Solder Joints & Interconnects
    const hotInterconnects = new THREE.Group();
    const coldInterconnects = new THREE.Group();
    const solderJoints = new THREE.Group();

    for (let i = 0; i < 72; i++) {
        let pt = pathPoints[i];
        let solder = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.5, 16, 32), solderMaterial);
        solder.rotation.x = Math.PI / 2;
        solder.position.copy(pt);
        solderJoints.add(solder);
    }
    peltier.add(solderJoints);

    for (let i = 0; i < 35; i++) {
        let p1Index, p2Index;
        if (i % 2 === 0) {
            p1Index = i * 2 + 1;
            p2Index = (i + 1) * 2;
        } else {
            p1Index = i * 2 + 1;
            p2Index = (i + 1) * 2;
        }
        
        let p1 = pathPoints[p1Index];
        let p2 = pathPoints[p2Index];
        let dist = p1.distanceTo(p2);
        
        let bridge = new THREE.Group();
        let bar = new THREE.Mesh(new THREE.BoxGeometry(dist + 2.8, 0.8, 3.2), copper);
        bridge.add(bar);
        
        // Add rivet details to interconnects
        let rivet1 = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1, 16), darkSteel);
        rivet1.position.set(-dist/2, 0, 0);
        let rivet2 = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1, 16), darkSteel);
        rivet2.position.set(dist/2, 0, 0);
        bridge.add(rivet1);
        bridge.add(rivet2);

        bridge.position.copy(p1).lerp(p2, 0.5);
        if (Math.abs(p1.z - p2.z) > 0.1) {
            bridge.rotation.y = Math.PI / 2;
        }
        
        if (i % 2 === 0) {
            coldInterconnects.add(bridge);
        } else {
            hotInterconnects.add(bridge);
        }
    }
    peltier.add(hotInterconnects);
    peltier.add(coldInterconnects);

    parts.push({
        name: "Cold Side Copper Interconnects",
        description: "Thick OFHC copper straps connecting the tops of the pillars in series.",
        material: "OFHC Copper",
        function: "Routes high amperage current while absorbing heat.",
        assemblyOrder: 9,
        connections: ["Pillars", "Cold Plate"],
        failureEffect: "Thermal fatigue fracturing the solder joint.",
        cascadeFailures: ["Complete electrical open circuit"],
        originalPosition: {x: 0, y: 6.5, z: 0},
        explodedPosition: {x: 0, y: 15, z: 0}
    });

    parts.push({
        name: "Hot Side Copper Interconnects",
        description: "Thick OFHC copper straps connecting the bottoms of the pillars in series.",
        material: "OFHC Copper",
        function: "Routes high amperage current while dumping heat.",
        assemblyOrder: 10,
        connections: ["Pillars", "Hot Plate"],
        failureEffect: "Thermal fatigue fracturing the solder joint.",
        cascadeFailures: ["Complete electrical open circuit"],
        originalPosition: {x: 0, y: 0.5, z: 0},
        explodedPosition: {x: 0, y: -10, z: 0}
    });

    // Heat Sink (Hot Side)
    const sinkGroup = new THREE.Group();
    const sinkBase = new THREE.Mesh(new THREE.BoxGeometry(42, 2, 42), aluminum);
    sinkBase.position.y = -3;
    sinkGroup.add(sinkBase);

    for (let i = 0; i < 41; i++) {
        const fin = new THREE.Mesh(new THREE.BoxGeometry(0.3, 12, 40), aluminum);
        fin.position.set(-18 + i * 0.9, -10, 0);
        sinkGroup.add(fin);
    }

    // Heat Pipes
    for (let i = 0; i < 4; i++) {
        const pipeGeo = new THREE.CylinderGeometry(1.2, 1.2, 42, 16);
        const pipe = new THREE.Mesh(pipeGeo, copper);
        pipe.rotation.z = Math.PI / 2;
        pipe.position.set(0, -8 - i * 1.5, 12);
        sinkGroup.add(pipe);
        const pipe2 = new THREE.Mesh(pipeGeo, copper);
        pipe2.rotation.z = Math.PI / 2;
        pipe2.position.set(0, -8 - i * 1.5, -12);
        sinkGroup.add(pipe2);
    }
    peltier.add(sinkGroup);

    parts.push({
        name: "Aluminum Fin Heat Sink",
        description: "Massive block of aluminum fins intertwined with copper heat pipes.",
        material: "Aluminum / Copper",
        function: "Dissipates waste heat into the surrounding air.",
        assemblyOrder: 11,
        connections: ["Hot Plate", "Active Cooling Fan"],
        failureEffect: "Fouling from dust.",
        cascadeFailures: ["Thermal runaway"],
        originalPosition: {x: 0, y: -9, z: 0},
        explodedPosition: {x: 0, y: -35, z: 0}
    });

    // Active Cooling Fan
    const fanSystem = new THREE.Group();
    const shroudGeo = new THREE.TorusGeometry(18, 2, 16, 64);
    const shroud = new THREE.Mesh(shroudGeo, darkSteel);
    shroud.rotation.x = Math.PI / 2;
    shroud.position.y = -18;
    fanSystem.add(shroud);

    const fanBlades = new THREE.Group();
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 3, 32), plastic);
    fanBlades.add(hub);

    const bladeShape = new THREE.Shape();
    bladeShape.moveTo(0,0);
    bladeShape.quadraticCurveTo(8, 4, 16, 0);
    bladeShape.quadraticCurveTo(12, -6, 0, -3);
    bladeShape.lineTo(0,0);
    const extrudeSettings = { depth: 0.5, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.2, bevelThickness: 0.2 };
    const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, extrudeSettings);

    for(let i = 0; i < 9; i++){
        const blade = new THREE.Mesh(bladeGeo, plastic);
        blade.rotation.y = (i * Math.PI * 2) / 9;
        blade.rotation.x = 0.4;
        fanBlades.add(blade);
    }
    fanBlades.position.y = -18;
    fanSystem.add(fanBlades);
    peltier.add(fanSystem);

    parts.push({
        name: "Active Cooling Fan Array",
        description: "High-velocity 9-blade axial fan mounted within a steel shroud.",
        material: "Industrial Plastic / Steel",
        function: "Forces high volumes of air across the heat sink fins.",
        assemblyOrder: 12,
        connections: ["Aluminum Fin Heat Sink"],
        failureEffect: "Motor burnout.",
        cascadeFailures: ["Rapid thermal saturation", "Module destruction"],
        originalPosition: {x: 0, y: -18, z: 0},
        explodedPosition: {x: 0, y: -50, z: 0}
    });

    // Water Cooling Block (Cold Side)
    const waterBlock = new THREE.Group();
    const wbBase = new THREE.Mesh(new THREE.BoxGeometry(38, 4, 38), aluminum);
    wbBase.position.y = 11;
    waterBlock.add(wbBase);

    const wbGlass = new THREE.Mesh(new THREE.BoxGeometry(38, 1, 38), tinted);
    wbGlass.position.y = 13.5;
    waterBlock.add(wbGlass);

    // Serpentine Channels
    const channelGroup = new THREE.Group();
    for(let i=0; i<6; i++) {
        let straight = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 28, 16), coldMat);
        straight.rotation.z = Math.PI / 2;
        straight.position.set(0, 12, -12.5 + i * 5);
        channelGroup.add(straight);
        
        if (i < 5) {
            let uTurn = new THREE.Mesh(new THREE.TorusGeometry(2.5, 1.2, 16, 32, Math.PI), coldMat);
            uTurn.rotation.x = Math.PI / 2;
            let side = (i % 2 === 0) ? 14 : -14;
            uTurn.position.set(side, 12, -10 + i * 5);
            if (i % 2 !== 0) uTurn.rotation.y = Math.PI;
            channelGroup.add(uTurn);
        }
    }
    waterBlock.add(channelGroup);

    const fittingGeo = new THREE.CylinderGeometry(2, 2.5, 5, 16);
    const fitting1 = new THREE.Mesh(fittingGeo, chrome);
    fitting1.position.set(-10, 16, -10);
    waterBlock.add(fitting1);
    const fitting2 = new THREE.Mesh(fittingGeo, chrome);
    fitting2.position.set(-10, 16, 10);
    waterBlock.add(fitting2);

    peltier.add(waterBlock);

    parts.push({
        name: "Cold Side Water Block",
        description: "Liquid cooling plate with internal serpentine channels and a tinted glass top.",
        material: "Aluminum / Glass",
        function: "Transfers cold thermal energy into a circulating fluid for remote cooling.",
        assemblyOrder: 13,
        connections: ["Peltier Ceramic Cold Plate", "Coolant Hoses"],
        failureEffect: "Coolant leak.",
        cascadeFailures: ["Electrical short circuit", "Pump cavitation"],
        originalPosition: {x: 0, y: 12, z: 0},
        explodedPosition: {x: 0, y: 45, z: 0}
    });

    // Terminal Block
    const termBlock = new THREE.Group();
    const tbBase = new THREE.Mesh(new THREE.BoxGeometry(10, 4, 6), plastic);
    tbBase.position.set(0, 0, 23);
    termBlock.add(tbBase);
    
    const screwA = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 5, 16), chrome);
    screwA.position.set(-3, 0, 23);
    termBlock.add(screwA);
    
    const screwB = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 5, 16), chrome);
    screwB.position.set(3, 0, 23);
    termBlock.add(screwB);

    peltier.add(termBlock);

    parts.push({
        name: "Electrical Power Terminal",
        description: "Heavy-duty binding posts providing massive DC current to the array.",
        material: "Plastic / Chrome / Copper",
        function: "Interfaces the internal series circuit with external power supplies.",
        assemblyOrder: 14,
        connections: ["Hot Side Copper Interconnects"],
        failureEffect: "Arcing due to loose connection.",
        cascadeFailures: ["Fire", "Complete power loss"],
        originalPosition: {x: 0, y: 0, z: 23},
        explodedPosition: {x: 0, y: 0, z: 40}
    });

    // Electron Particles
    const totalElectrons = 200;
    const electrons = new THREE.InstancedMesh(new THREE.SphereGeometry(0.4, 8, 8), screenMat, totalElectrons);
    peltier.add(electrons);

    // ==========================================
    // 4. ANIMATION & QUIZ
    // ==========================================
    let timeElapsed = 0;
    const animate = (time, speed, meshes) => {
        timeElapsed += 0.016 * speed;

        // Boom and Arm Animation
        boomSystem.rotation.y = Math.sin(timeElapsed * 0.3) * 0.6;
        boomArm.rotation.x = Math.sin(timeElapsed * 0.5) * 0.15;
        
        // Piston compensation
        pistonInner.position.y = 30 + Math.sin(timeElapsed * 0.5) * 6;
        
        // Fan Spin
        fanBlades.rotation.y += 0.8 * speed;

        // Electron Flow Animation
        const electronSpeed = 2.0;
        for (let i = 0; i < totalElectrons; i++) {
            let offset = i / totalElectrons;
            let t = (timeElapsed * electronSpeed + offset) % 1.0;
            let scaled = t * 71;
            let index = Math.floor(scaled);
            let frac = scaled - index;

            if (index >= 71) {
                index = 70;
                frac = 1.0;
            }

            let pos = new THREE.Vector3();
            let p1 = pathPoints[index];
            let p2 = pathPoints[index+1];
            pos.copy(p1).lerp(p2, frac);

            let matrix = new THREE.Matrix4();
            matrix.setPosition(pos);
            electrons.setMatrixAt(i, matrix);
        }
        electrons.instanceMatrix.needsUpdate = true;

        // Pulsing glow effects
        hotMat.emissiveIntensity = 0.6 + Math.sin(timeElapsed * 6) * 0.3;
        coldMat.emissiveIntensity = 0.6 + Math.cos(timeElapsed * 6) * 0.3;
        screenMat.emissiveIntensity = 0.8 + Math.sin(timeElapsed * 10) * 0.2;
    };

    const description = "A massive industrial Thermoelectric (Peltier) Cooler rig. Features a 36-element Bi2Te3 matrix, articulated hydraulic placement arm, extreme active heat sinking, and cold-side fluid circulation.";

    const quizQuestions = [
        {
            question: "Which phenomenon describes the cooling effect generated when electrical current is passed through a junction of two dissimilar conductors?",
            options: [
                "The Peltier Effect",
                "The Seebeck Effect",
                "The Thomson Effect",
                "The Joule Effect"
            ],
            answer: 0,
            explanation: "The Peltier Effect states that passing a current through a thermocouple circuit composed of dissimilar conductors produces heating or cooling at the junction."
        },
        {
            question: "Why are Bismuth Telluride (Bi2Te3) semiconductors commonly used in standard Peltier coolers?",
            options: [
                "They possess high electrical conductivity and low thermal conductivity.",
                "They are completely superconducting at room temperature.",
                "They have the highest thermal conductivity of any metal.",
                "They generate electricity without external heat."
            ],
            answer: 0,
            explanation: "A high figure of merit (zT) requires good electrical conductivity (to reduce Joule heating) and low thermal conductivity (to prevent heat leaking back to the cold side). Bi2Te3 fits this perfectly."
        },
        {
            question: "In a multi-stage (cascaded) Peltier cooler, what is the primary purpose of stacking modules?",
            options: [
                "To achieve a much lower minimum temperature difference (higher delta-T).",
                "To increase the total heat pumping capacity (Qmax).",
                "To reduce the total electrical power consumed.",
                "To reverse the polarity of the cooling side."
            ],
            answer: 0,
            explanation: "Stacking modules allows the cold side of one module to cool the hot side of the next, achieving much lower absolute temperatures (higher delta-T) than a single stage, though with lower overall Qmax."
        },
        {
            question: "What happens if the hot side heat sink of a Peltier module fails to dissipate heat efficiently?",
            options: [
                "Thermal runaway occurs, heat flows back to the cold side, and the module may melt.",
                "The cold side gets proportionally colder.",
                "The module acts as an infinite battery.",
                "The electrical current stops automatically."
            ],
            answer: 0,
            explanation: "If heat isn't removed from the hot side, Joule heating and pumped heat build up, eventually exceeding the solder melting point, destroying the module."
        },
        {
            question: "In the alternating P-N pillar matrix, how are the semiconductors electrically and thermally connected?",
            options: [
                "Electrically in series, thermally in parallel.",
                "Electrically in parallel, thermally in series.",
                "Both electrically and thermally in parallel.",
                "Both electrically and thermally in series."
            ],
            answer: 0,
            explanation: "Connecting them electrically in series allows for a high-voltage, low-current power supply, while placing them thermally in parallel maximizes the heat transfer area between the hot and cold plates."
        }
    ];

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createPeltierCooler() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
