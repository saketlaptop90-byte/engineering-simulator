import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // ==========================================
    // HELPER FUNCTIONS FOR SHAPE GENERATION
    // ==========================================
    function createCylinder(rT, rB, h, rSeg, mat, pos, rot) {
        const geo = new THREE.CylinderGeometry(rT, rB, h, rSeg);
        const mesh = new THREE.Mesh(geo, mat);
        if (pos) mesh.position.set(pos[0], pos[1], pos[2]);
        if (rot) mesh.rotation.set(rot[0], rot[1], rot[2]);
        return mesh;
    }

    function createBox(w, h, d, mat, pos, rot) {
        const geo = new THREE.BoxGeometry(w, h, d);
        const mesh = new THREE.Mesh(geo, mat);
        if (pos) mesh.position.set(pos[0], pos[1], pos[2]);
        if (rot) mesh.rotation.set(rot[0], rot[1], rot[2]);
        return mesh;
    }

    function createExtrudedShape(shapeOpts, extrudeOpts, mat, pos, rot) {
        const shape = new THREE.Shape();
        shape.moveTo(shapeOpts[0][0], shapeOpts[0][1]);
        for(let i=1; i<shapeOpts.length; i++) {
            if(shapeOpts[i].length === 2) {
                shape.lineTo(shapeOpts[i][0], shapeOpts[i][1]);
            } else if(shapeOpts[i].length === 4) {
                shape.quadraticCurveTo(shapeOpts[i][0], shapeOpts[i][1], shapeOpts[i][2], shapeOpts[i][3]);
            }
        }
        const geo = new THREE.ExtrudeGeometry(shape, extrudeOpts);
        const mesh = new THREE.Mesh(geo, mat);
        if (pos) mesh.position.set(pos[0], pos[1], pos[2]);
        if (rot) mesh.rotation.set(rot[0], rot[1], rot[2]);
        return mesh;
    }

    // ==========================================
    // CUSTOM ADVANCED MATERIALS
    // ==========================================
    const glowingNeon = new THREE.MeshStandardMaterial({
        color: 0x00ffcc, emissive: 0x00ffcc, emissiveIntensity: 2, roughness: 0.2, metalness: 0.8
    });
    
    const blinkingNeon = new THREE.MeshStandardMaterial({
        color: 0x00ffcc, emissive: 0x00ffcc, emissiveIntensity: 2, roughness: 0.2, metalness: 0.8
    });

    const blinkingRed = new THREE.MeshStandardMaterial({
        color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 2, roughness: 0.2, metalness: 0.8
    });

    const skidderYellow = new THREE.MeshStandardMaterial({
        color: 0xffaa00, roughness: 0.5, metalness: 0.6, clearcoat: 0.5
    });

    const heavyBlackMetal = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a, roughness: 0.8, metalness: 0.7
    });

    const scratchedSteel = new THREE.MeshStandardMaterial({
        color: 0x888888, roughness: 0.6, metalness: 0.9
    });

    const hydraulicFluid = new THREE.MeshPhysicalMaterial({
        color: 0xff2200, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1, ior: 1.5
    });

    // ==========================================
    // COMPLEX FORESTRY TIRE GENERATOR
    // ==========================================
    function createForestryTire() {
        const wheelGroup = new THREE.Group();
        
        // Main tire carcass
        const tireGeo = new THREE.TorusGeometry( 4.5, 2.2, 64, 128 );
        const tire = new THREE.Mesh( tireGeo, rubber );
        wheelGroup.add(tire);
        
        // Aggressive V-Tread Forestry Pattern
        const lugGeo = new THREE.BoxGeometry( 5.5, 0.8, 1.4 );
        for(let i=0; i<90; i++) {
            const lug = new THREE.Mesh(lugGeo, rubber);
            const angle = (i / 90) * Math.PI * 2;
            lug.position.set( Math.cos(angle) * 4.6, Math.sin(angle) * 4.6, 0 );
            lug.rotation.z = angle;
            
            // Alternate left and right for V pattern (Chevron)
            if (i % 2 === 0) {
                lug.position.z = 1.2;
                lug.rotation.x = 0.45;
                lug.rotation.y = 0.35;
            } else {
                lug.position.z = -1.2;
                lug.rotation.x = -0.45;
                lug.rotation.y = -0.35;
            }
            // Bevel the lug edges manually by adding smaller boxes
            const lugBevel = new THREE.Mesh( new THREE.BoxGeometry(5.0, 0.4, 1.0), rubber );
            lugBevel.position.set(0, 0.6, 0);
            lug.add(lugBevel);
            
            wheelGroup.add(lug);
        }
        
        // Deep Hub / Rim
        const rimGeo = new THREE.CylinderGeometry( 3.2, 2.8, 4.8, 64 );
        const rim = new THREE.Mesh( rimGeo, heavyBlackMetal );
        rim.rotation.x = Math.PI / 2;
        wheelGroup.add(rim);

        // Planetary Gear Cover
        const hubCapGeo = new THREE.CylinderGeometry( 1.8, 1.4, 5.2, 32 );
        const hubCap = new THREE.Mesh( hubCapGeo, skidderYellow );
        hubCap.rotation.x = Math.PI / 2;
        wheelGroup.add(hubCap);

        // Lug Nuts
        for(let i=0; i<24; i++) {
            const nutGeo = new THREE.CylinderGeometry( 0.15, 0.15, 0.4, 6 );
            const nut = new THREE.Mesh( nutGeo, steel );
            const angle = (i / 24) * Math.PI * 2;
            nut.position.set( Math.cos(angle)*2.4, Math.sin(angle)*2.4, 2.45 );
            nut.rotation.x = Math.PI / 2;
            wheelGroup.add(nut);
        }

        // Valve stem
        const valve = createCylinder( 0.05, 0.05, 0.3, 8, copper, [0, 2.8, 2.3], [Math.PI/4, 0, 0] );
        wheelGroup.add(valve);

        return wheelGroup;
    }

    // Assign massive wheels
    const wheelFrontLeft = createForestryTire();
    wheelFrontLeft.position.set( 7, 6.7, 6.5 );
    const wheelFrontRight = createForestryTire();
    wheelFrontRight.position.set( 7, 6.7, -6.5 );
    const wheelRearLeft = createForestryTire();
    wheelRearLeft.position.set( -9, 6.7, 6.5 );
    const wheelRearRight = createForestryTire();
    wheelRearRight.position.set( -9, 6.7, -6.5 );

    // ==========================================
    // MASTER CHASSIS GROUPS
    // ==========================================
    const frontChassisGroup = new THREE.Group();
    const rearChassisGroup = new THREE.Group();
    const articulationJoint = new THREE.Group();

    // ==========================================
    // FRONT CHASSIS & ENGINE BAY
    // ==========================================
    const engineShapeOpts = [
        [0, 0], [9, 0], [9, 5], [7, 6], [0, 6], [0, 0]
    ];
    const engineExtrudeOpts = { depth: 6, bevelEnabled: true, bevelSegments: 4, steps: 4, bevelSize: 0.3, bevelThickness: 0.3 };
    const engineMesh = createExtrudedShape(engineShapeOpts, engineExtrudeOpts, skidderYellow, [2, 6, -3], null);
    frontChassisGroup.add(engineMesh);

    // Front Grille & Radiator
    const grilleBase = createBox( 0.6, 5.5, 5.5, heavyBlackMetal, [11.3, 8.8, 0] );
    frontChassisGroup.add(grilleBase);
    for(let i=0; i<20; i++) {
        const slat = createBox( 0.8, 0.15, 5.0, chrome, [11.4, 6.5 + i*0.25, 0] );
        frontChassisGroup.add(slat);
    }
    const radiatorMesh = createBox( 0.2, 5.0, 5.0, darkSteel, [11.1, 8.8, 0] );
    frontChassisGroup.add(radiatorMesh);

    // Headlights (Quad LED Array)
    const hlPos = [[11.5, 10.5, 2.0], [11.5, 10.5, -2.0], [11.5, 9.5, 2.0], [11.5, 9.5, -2.0]];
    hlPos.forEach(pos => {
        const hL = createCylinder( 0.35, 0.35, 0.2, 32, glowingNeon, pos, [0,0,Math.PI/2] );
        const hLHousing = createBox( 0.3, 0.9, 0.9, heavyBlackMetal, [pos[0]-0.1, pos[1], pos[2]] );
        frontChassisGroup.add(hL, hLHousing);
    });

    // Engine Exhaust & Intake
    const exhaustBase = createCylinder( 0.5, 0.6, 2.5, 32, heavyBlackMetal, [7, 13, 2.5] );
    const exhaustPipe = createCylinder( 0.4, 0.4, 4, 32, chrome, [7, 15, 2.5] );
    const exhaustFlap = createCylinder( 0.45, 0.45, 0.05, 16, heavyBlackMetal, [7, 17.05, 2.5], [Math.PI/8, 0, 0] );
    const intakeFilter = createCylinder( 0.7, 0.7, 2.5, 32, darkSteel, [7, 13, -2.5] );
    const intakeCap = createCylinder( 0.9, 0.9, 0.2, 32, skidderYellow, [7, 14.3, -2.5] );
    frontChassisGroup.add(exhaustBase, exhaustPipe, exhaustFlap, intakeFilter, intakeCap);

    // Engine block details visible underneath
    const engineBlock = createBox( 4, 3, 4, darkSteel, [6, 4.5, 0] );
    const oilPan = createBox( 3, 1, 3, heavyBlackMetal, [6, 3, 0] );
    frontChassisGroup.add(engineBlock, oilPan);

    // ==========================================
    // DOZER BLADE ASSEMBLY
    // ==========================================
    const bladeGroup = new THREE.Group();
    bladeGroup.position.set( 12, 4, 0 );
    
    const bladeShapeOpts = [
        [0,0], [-2, 2, -1, 5], [1, 5], [-1, 2, 1.5, 0], [0,0]
    ];
    const bladeGeoOpts = { depth: 12, bevelEnabled: true, bevelThickness: 0.15, bevelSize: 0.15, curveSegments: 32 };
    const blade = createExtrudedShape(bladeShapeOpts, bladeGeoOpts, skidderYellow, [0, -1, -6], null);
    
    // Blade cutting edge (Hardened Steel)
    const cuttingEdge = createBox( 1.6, 0.4, 12.2, scratchedSteel, [0.8, -0.8, 0], [0, 0, -Math.PI/6] );
    bladeGroup.add(blade, cuttingEdge);

    // Blade Push Arms
    const pushArmL = createBox( 5, 0.8, 0.8, heavyBlackMetal, [-2.5, 1, 4.5] );
    const pushArmR = createBox( 5, 0.8, 0.8, heavyBlackMetal, [-2.5, 1, -4.5] );
    bladeGroup.add(pushArmL, pushArmR);
    
    // Blade Lift Hydraulic Cylinders
    const bladeCylL_base = createCylinder( 0.5, 0.5, 3.5, 32, skidderYellow, [10, 7.5, 3.5], [0,0,-Math.PI/4] );
    const bladeCylL_rod = createCylinder( 0.25, 0.25, 4, 32, chrome, [11, 5.5, 3.5], [0,0,-Math.PI/4] );
    const bladeCylR_base = createCylinder( 0.5, 0.5, 3.5, 32, skidderYellow, [10, 7.5, -3.5], [0,0,-Math.PI/4] );
    const bladeCylR_rod = createCylinder( 0.25, 0.25, 4, 32, chrome, [11, 5.5, -3.5], [0,0,-Math.PI/4] );
    frontChassisGroup.add(bladeCylL_base, bladeCylL_rod, bladeCylR_base, bladeCylR_rod, bladeGroup);

    // ==========================================
    // OPERATOR CABIN (ROPS/FOPS)
    // ==========================================
    const cabGroup = new THREE.Group();
    cabGroup.position.set( 0.5, 12.5, 0 );
    
    // Cab Base Mount
    const cabBase = createBox( 6, 1.5, 7.5, heavyBlackMetal, [0.5, 11.5, 0] );
    frontChassisGroup.add(cabBase);

    // Heavy duty ROPS pillars
    const cabPosts = [
        createBox(0.6, 7.5, 0.6, skidderYellow, [-2.5, 3.5, -3.5]),
        createBox(0.6, 7.5, 0.6, skidderYellow, [-2.5, 3.5, 3.5]),
        createBox(0.6, 7.5, 0.6, skidderYellow, [2.5, 3.5, -3.5]),
        createBox(0.6, 7.5, 0.6, skidderYellow, [2.5, 3.5, 3.5])
    ];
    cabGroup.add(...cabPosts);

    // Cab Roof (Thick FOPS plate)
    const cabRoof = createBox( 5.8, 0.6, 7.8, skidderYellow, [0, 7.5, 0] );
    cabGroup.add(cabRoof);

    // Roof Beacons and Work Lights
    const cabRoofLights = [
        createBox(0.8, 0.4, 0.6, blinkingNeon, [2.9, 7.9, 2.5]),
        createBox(0.8, 0.4, 0.6, blinkingNeon, [2.9, 7.9, -2.5]),
        createBox(0.8, 0.4, 0.6, blinkingRed, [-2.9, 7.9, 2.5]),
        createBox(0.8, 0.4, 0.6, blinkingRed, [-2.9, 7.9, -2.5])
    ];
    // Strobe Beacon
    const strobeBase = createCylinder( 0.4, 0.4, 0.2, 16, heavyBlackMetal, [0, 7.9, 0] );
    const strobeLight = createCylinder( 0.3, 0.3, 0.5, 16, blinkingNeon, [0, 8.2, 0] );
    cabGroup.add(...cabRoofLights, strobeBase, strobeLight);

    // Tinted Armored Glass
    const windshield = createBox( 0.1, 7.0, 6.8, tinted, [2.4, 3.5, 0] );
    const backWindow = createBox( 0.1, 7.0, 6.8, tinted, [-2.4, 3.5, 0] );
    const sideWindowL = createBox( 4.8, 7.0, 0.1, tinted, [0, 3.5, 3.4] );
    const sideWindowR = createBox( 4.8, 7.0, 0.1, tinted, [0, 3.5, -3.4] );
    
    // Steel wire mesh over windows (Forestry spec)
    for(let i=0; i<15; i++) {
        const meshWireL = createCylinder( 0.02, 0.02, 4.8, 8, steel, [0, 0.5 + i*0.45, 3.5], [0, 0, Math.PI/2] );
        const meshWireR = createCylinder( 0.02, 0.02, 4.8, 8, steel, [0, 0.5 + i*0.45, -3.5], [0, 0, Math.PI/2] );
        cabGroup.add(meshWireL, meshWireR);
    }
    cabGroup.add(windshield, backWindow, sideWindowL, sideWindowR);

    // Interior - Seat & Controls
    const seatSuspension = createCylinder( 0.3, 0.3, 1.5, 16, darkSteel, [-0.5, 0.75, 0] );
    const seatBase = createBox( 1.8, 0.8, 1.8, darkSteel, [-0.5, 1.5, 0] );
    const seatCushion = createBox( 1.9, 0.4, 1.9, rubber, [-0.5, 2.1, 0] );
    const seatBack = createBox( 0.5, 2.5, 1.9, rubber, [-1.2, 3.5, 0] );
    const armRestL = createBox( 1.5, 0.3, 0.4, rubber, [-0.5, 2.8, 1.1] );
    const armRestR = createBox( 1.5, 0.3, 0.4, rubber, [-0.5, 2.8, -1.1] );
    cabGroup.add(seatSuspension, seatBase, seatCushion, seatBack, armRestL, armRestR);

    // Steering Console & Wheel
    const consoleBox = createBox( 1.2, 2.5, 2.5, heavyBlackMetal, [1.2, 1.8, 0] );
    const steerColumn = createCylinder( 0.15, 0.15, 1.2, 16, darkSteel, [1.0, 3.2, 0], [0,0,Math.PI/4] );
    const steerWheelGeo = new THREE.TorusGeometry( 0.7, 0.12, 16, 32 );
    const steerWheel = new THREE.Mesh( steerWheelGeo, rubber );
    steerWheel.position.set( 0.5, 3.7, 0 );
    steerWheel.rotation.set( 0, Math.PI/2, Math.PI/4 );
    cabGroup.add(consoleBox, steerColumn, steerWheel);

    // Advanced Joysticks on armrests
    const joyL_base = createCylinder( 0.15, 0.25, 0.6, 16, rubber, [-0.2, 3.2, 1.1] );
    const joyL_stick = createCylinder( 0.08, 0.08, 1.0, 16, chrome, [-0.2, 3.8, 1.1] );
    const joyL_button = createCylinder( 0.1, 0.1, 0.1, 8, glowingRed, [-0.2, 4.3, 1.1] );
    const joyR_base = createCylinder( 0.15, 0.25, 0.6, 16, rubber, [-0.2, 3.2, -1.1] );
    const joyR_stick = createCylinder( 0.08, 0.08, 1.0, 16, chrome, [-0.2, 3.8, -1.1] );
    const joyR_button = createCylinder( 0.1, 0.1, 0.1, 8, glowingNeon, [-0.2, 4.3, -1.1] );
    cabGroup.add(joyL_base, joyL_stick, joyL_button, joyR_base, joyR_stick, joyR_button);

    // Dashboard Telemetry Screens
    const screenMat = new THREE.MeshStandardMaterial({color: 0x000000, emissive: 0x00aaff, emissiveIntensity: 1.5});
    const dashScreen1 = createBox( 0.1, 1.2, 1.6, screenMat, [1.6, 3.2, 0.9], [0, -Math.PI/8, 0] );
    const dashScreen2 = createBox( 0.1, 1.2, 1.6, screenMat, [1.6, 3.2, -0.9], [0, Math.PI/8, 0] );
    cabGroup.add(dashScreen1, dashScreen2);

    frontChassisGroup.add(cabGroup);
    
    // Front Axle Housing
    const frontAxleHous = createCylinder( 1.5, 1.5, 12, 64, heavyBlackMetal, [7, 6.7, 0], [Math.PI/2, 0, 0] );
    const frontDiff = new THREE.Mesh( new THREE.SphereGeometry( 2.5, 32, 32 ), heavyBlackMetal );
    frontDiff.position.set(7, 6.7, 0);
    frontDiff.scale.set(1.2, 1, 0.9);
    frontChassisGroup.add(frontAxleHous, frontDiff);

    // Side Steps and Handrails
    const stepGroup = new THREE.Group();
    stepGroup.position.set( 1, 4, 3.8 );
    const step1 = createBox(1.5, 0.1, 1.5, scratchedSteel, [0, 0, 0]);
    const step2 = createBox(1.5, 0.1, 1.5, scratchedSteel, [-1.2, -1.5, 0]);
    const step3 = createBox(1.5, 0.1, 1.5, scratchedSteel, [-2.4, -3.0, 0]);
    const handrailGeo = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
            new THREE.Vector3(-2.4, -1, 0.5), new THREE.Vector3(-1.2, 1.5, 0.5), new THREE.Vector3(0, 4, 0.5)
        ]), 20, 0.08, 8, false
    );
    const handrail = new THREE.Mesh(handrailGeo, skidderYellow);
    stepGroup.add(step1, step2, step3, handrail);
    frontChassisGroup.add(stepGroup);

    // ==========================================
    // ARTICULATION JOINT (Heavy Duty Pivot)
    // ==========================================
    articulationJoint.position.set( -2, 6.7, 0 );
    
    const jointPinBase = createCylinder( 1.2, 1.2, 6, 32, skidderYellow, [0,0,0] );
    const jointPin = createCylinder( 0.9, 0.9, 7, 32, chrome, [0,0,0] );
    articulationJoint.add(jointPinBase, jointPin);
    
    // Massive Joint Plates (Front side attached to front chassis)
    const plateF_top = createBox( 4.5, 0.8, 2.5, heavyBlackMetal, [2.2, 3, 0] );
    const plateF_bot = createBox( 4.5, 0.8, 2.5, heavyBlackMetal, [2.2, -3, 0] );
    articulationJoint.add(plateF_top, plateF_bot);

    // Steering Cylinders (Articulation actuation)
    const steerCyl_L_base = createCylinder( 0.6, 0.6, 4.5, 32, skidderYellow, [2.5, 0, 2.0], [0, Math.PI/2, Math.PI/2] );
    const steerCyl_L_rod = createCylinder( 0.3, 0.3, 4.5, 32, chrome, [-0.5, 0, 2.0], [0, Math.PI/2, Math.PI/2] );
    articulationJoint.add(steerCyl_L_base, steerCyl_L_rod);
    
    const steerCyl_R_base = createCylinder( 0.6, 0.6, 4.5, 32, skidderYellow, [2.5, 0, -2.0], [0, Math.PI/2, Math.PI/2] );
    const steerCyl_R_rod = createCylinder( 0.3, 0.3, 4.5, 32, chrome, [-0.5, 0, -2.0], [0, Math.PI/2, Math.PI/2] );
    articulationJoint.add(steerCyl_R_base, steerCyl_R_rod);

    // Universal Joint & Drive Shaft crossing the pivot
    const uJoint = new THREE.Mesh( new THREE.SphereGeometry( 0.6, 16, 16 ), chrome );
    uJoint.position.set( 0, -1.5, 0 );
    articulationJoint.add(uJoint);
    const driveShaftFront = createCylinder( 0.4, 0.4, 7, 16, heavyBlackMetal, [3.5, 5.2, 0], [0, 0, Math.PI/2] );
    frontChassisGroup.add(driveShaftFront);
    const driveShaftRear = createCylinder( 0.4, 0.4, 7, 16, heavyBlackMetal, [-3.5, -1.5, 0], [0, 0, Math.PI/2] );
    rearChassisGroup.add(driveShaftRear);


    // ==========================================
    // REAR CHASSIS
    // ==========================================
    rearChassisGroup.position.set( -2, 0, 0 ); // Relative to articulation joint
    
    // Rear Main Frame
    const rearFrameShapeOpts = [
        [0, -2], [-14, -2], [-14, 4], [0, 3], [0, -2]
    ];
    const rearFrameGeoOpts = { depth: 5, bevelEnabled: true, bevelThickness: 0.25, bevelSize: 0.25 };
    const rearFrame = createExtrudedShape(rearFrameShapeOpts, rearFrameGeoOpts, skidderYellow, [0, -1, -2.5], null);
    rearChassisGroup.add(rearFrame);

    // Rear Axle Housing
    const rearAxleHous = createCylinder( 1.5, 1.5, 12, 64, heavyBlackMetal, [-7, 0, 0], [Math.PI/2, 0, 0] );
    const rearDiff = new THREE.Mesh( new THREE.SphereGeometry( 2.5, 32, 32 ), heavyBlackMetal );
    rearDiff.position.set(-7, 0, 0);
    rearDiff.scale.set(1.2, 1, 0.9);
    rearChassisGroup.add(rearAxleHous, rearDiff);

    // Massive Rear Fenders
    const fenderShapeOpts = [
        [-5, 0], [0, 5], [5, 0], [5, 1], [0, 6], [-5, 1], [-5, 0]
    ];
    const fenderGeoOpts = {depth: 3.5, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.1, curveSegments: 32};
    const fenderL = createExtrudedShape(fenderShapeOpts, fenderGeoOpts, heavyBlackMetal, [-7, 3.5, 3], null);
    const fenderR = createExtrudedShape(fenderShapeOpts, fenderGeoOpts, heavyBlackMetal, [-7, 3.5, -6.5], null);
    rearChassisGroup.add(fenderL, fenderR);

    // Tanks: Fuel and Hydraulic
    const fuelTank = createBox( 4.5, 3.5, 2.5, darkSteel, [-3.5, 1.5, 3.75] );
    const fuelCap = createCylinder( 0.3, 0.3, 0.2, 16, skidderYellow, [-3.5, 3.3, 3.75] );
    const hydTank = createBox( 4.5, 3.5, 2.5, darkSteel, [-3.5, 1.5, -3.75] );
    const hydCap = createCylinder( 0.3, 0.3, 0.2, 16, skidderYellow, [-3.5, 3.3, -3.75] );
    rearChassisGroup.add(fuelTank, fuelCap, hydTank, hydCap);

    // Fire Suppression System (Red Tanks)
    const fireTank1 = createCylinder( 0.4, 0.4, 2, 16, blinkingRed, [-1.5, 4, 3.5] );
    const fireTank2 = createCylinder( 0.4, 0.4, 2, 16, blinkingRed, [-1.5, 4, -3.5] );
    rearChassisGroup.add(fireTank1, fireTank2);

    // Winch Assembly
    const winchGroup = new THREE.Group();
    winchGroup.position.set( -3, 3.5, 0 );
    const winchBase = createBox( 2.5, 1.5, 4, heavyBlackMetal, [0, 0, 0] );
    const winchDrum = createCylinder( 1.4, 1.4, 2.8, 32, darkSteel, [0, 1.2, 0], [Math.PI/2, 0, 0] );
    const winchCable = createCylinder( 1.3, 1.3, 2.7, 32, chrome, [0, 1.2, 0], [Math.PI/2, 0, 0] );
    const winchMotor = createCylinder( 0.8, 0.8, 1.2, 16, skidderYellow, [0, 1.2, 1.8], [Math.PI/2, 0, 0] );
    winchGroup.add(winchBase, winchDrum, winchCable, winchMotor);
    rearChassisGroup.add(winchGroup);


    // ==========================================
    // GRAPPLE ARCH & BOOM ASSEMBLY
    // ==========================================
    const archGroup = new THREE.Group();
    archGroup.position.set( -10, 2, 0 );
    
    // Arch Base Mounts (Massive pivots)
    const archMount = createBox( 5, 2.5, 5, heavyBlackMetal, [0, 0, 0] );
    archGroup.add(archMount);

    // Dual Boom Arms (Main Arch - Box beams, not simple cylinders)
    const archArmL = createBox( 1.5, 10, 2, skidderYellow, [-3, 5, 2], [0, 0, -Math.PI/7] );
    const archArmR = createBox( 1.5, 10, 2, skidderYellow, [-3, 5, -2], [0, 0, -Math.PI/7] );
    archGroup.add(archArmL, archArmR);
    
    // Arch Cross Tie / Fairlead Roller
    const crossTie = createBox( 1.5, 2, 4, skidderYellow, [-5, 9, 0], [0, 0, -Math.PI/7] );
    const fairleadRoller = createCylinder( 0.4, 0.4, 3, 16, chrome, [-6, 9.5, 0], [Math.PI/2, 0, 0] );
    archGroup.add(crossTie, fairleadRoller);

    // Grapple Boom (Moving reach arm)
    const boomGroup = new THREE.Group();
    boomGroup.position.set( -5.5, 9.5, 0 );
    
    const boomMainGeo = new THREE.BoxGeometry( 10, 2.5, 2.5 );
    const boomMain = new THREE.Mesh( boomMainGeo, skidderYellow );
    boomMain.position.set( -4, 0, 0 );
    boomGroup.add(boomMain);

    // Boom Lift Cylinders (Arch base to Boom)
    const boomCylBaseL = createCylinder( 0.7, 0.7, 5, 32, darkSteel, [2, -4, 1.5], [0, 0, Math.PI/3.5] );
    const boomCylRodL = createCylinder( 0.35, 0.35, 5, 32, chrome, [-0.5, -2, 1.5], [0, 0, Math.PI/3.5] );
    const boomCylBaseR = createCylinder( 0.7, 0.7, 5, 32, darkSteel, [2, -4, -1.5], [0, 0, Math.PI/3.5] );
    const boomCylRodR = createCylinder( 0.35, 0.35, 5, 32, chrome, [-0.5, -2, -1.5], [0, 0, Math.PI/3.5] );
    boomGroup.add(boomCylBaseL, boomCylRodL, boomCylBaseR, boomCylRodR);
    
    // Grapple Rotator (360 Degree Motor)
    const rotatorGroup = new THREE.Group();
    rotatorGroup.position.set( -8.5, -1.25, 0 );
    
    const rotatorLink = createBox( 1.5, 1.5, 1.5, heavyBlackMetal, [0, 0.75, 0] );
    const rotatorMotor = createCylinder( 1.1, 1.1, 1.8, 64, skidderYellow, [0, -0.5, 0] );
    const rotatorPin = createCylinder( 0.4, 0.4, 1.5, 32, chrome, [0, -1.8, 0] );
    rotatorGroup.add(rotatorLink, rotatorMotor, rotatorPin);

    // Grapple Tongs Assembly
    const tongsGroup = new THREE.Group();
    tongsGroup.position.set( 0, -2.5, 0 );
    
    const tongShapeOpts = [
        [0,0], [-2.5, -1.5, -4, -5], [-3.5, -6], [-2, -2, 0, -1.5], [0,0]
    ];
    const tongGeoOpts = { depth: 1.2, bevelEnabled: true, bevelThickness: 0.15, bevelSize: 0.15, curveSegments: 64 };
    
    // Tong Left
    const tongL = createExtrudedShape(tongShapeOpts, tongGeoOpts, skidderYellow, [0, 0, 0.2], null);
    
    // Tong Right (Mirrored by rotation)
    const tongR = createExtrudedShape(tongShapeOpts, tongGeoOpts, skidderYellow, [0, 0, -0.2], [Math.PI, 0, 0]);

    // Tong Synchronization Cylinders
    const tongCylBase = createCylinder( 0.4, 0.4, 2.5, 32, darkSteel, [-1.5, 0, 0], [0, 0, Math.PI/2] );
    const tongCylRod = createCylinder( 0.2, 0.2, 3.5, 32, chrome, [-1.5, 0, 0], [0, 0, Math.PI/2] );
    tongsGroup.add(tongL, tongR, tongCylBase, tongCylRod);

    rotatorGroup.add(tongsGroup);
    boomGroup.add(rotatorGroup);
    archGroup.add(boomGroup);
    rearChassisGroup.add(archGroup);


    // ==========================================
    // HYDRAULIC HOSES (Dynamic Tube Geometry)
    // ==========================================
    class HoseCurve extends THREE.Curve {
        constructor(p1, p2, p3, p4) {
            super();
            this.p1 = p1; this.p2 = p2; this.p3 = p3; this.p4 = p4;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const tx = 1 - t;
            const b0 = tx * tx * tx;
            const b1 = 3 * tx * tx * t;
            const b2 = 3 * tx * t * t;
            const b3 = t * t * t;
            optionalTarget.set(
                b0*this.p1.x + b1*this.p2.x + b2*this.p3.x + b3*this.p4.x,
                b0*this.p1.y + b1*this.p2.y + b2*this.p3.y + b3*this.p4.y,
                b0*this.p1.z + b1*this.p2.z + b2*this.p3.z + b3*this.p4.z
            );
            return optionalTarget;
        }
    }
    
    // Hoses crossing the articulation joint
    const hosePath1 = new HoseCurve(
        new THREE.Vector3(2, 2, 1.5), new THREE.Vector3(-1, 4, 3), new THREE.Vector3(-1, 4, 3), new THREE.Vector3(-4, 2, 1.5)
    );
    const hoseGeo1 = new THREE.TubeGeometry( hosePath1, 32, 0.15, 12, false );
    const hose1 = new THREE.Mesh( hoseGeo1, rubber );
    articulationJoint.add(hose1);
    
    const hosePath2 = new HoseCurve(
        new THREE.Vector3(2, 2, -1.5), new THREE.Vector3(-1, 4, -3), new THREE.Vector3(-1, 4, -3), new THREE.Vector3(-4, 2, -1.5)
    );
    const hoseGeo2 = new THREE.TubeGeometry( hosePath2, 32, 0.15, 12, false );
    const hose2 = new THREE.Mesh( hoseGeo2, rubber );
    articulationJoint.add(hose2);

    // Hoses running up the boom
    const hosePath3 = new HoseCurve(
        new THREE.Vector3(0, 0, 1), new THREE.Vector3(-2, 3, 1), new THREE.Vector3(-4, 3, 1), new THREE.Vector3(-7, 0, 1)
    );
    const hoseGeo3 = new THREE.TubeGeometry( hosePath3, 32, 0.1, 8, false );
    const hose3 = new THREE.Mesh( hoseGeo3, rubber );
    boomGroup.add(hose3);


    // ==========================================
    // SCENE GRAPH ASSEMBLY
    // ==========================================
    group.add(wheelFrontLeft);
    group.add(wheelFrontRight);
    group.add(frontChassisGroup);
    
    articulationJoint.add(wheelRearLeft);
    articulationJoint.add(wheelRearRight);
    articulationJoint.add(rearChassisGroup);
    group.add(articulationJoint);

    // Align complete model so tires rest on origin (Y=0)
    group.position.y = -2.2; 


    // ==========================================
    // PARTS METADATA ARRAY
    // ==========================================
    parts.push({
        name: "Articulated Pivot Joint",
        description: "Massive center pivot allowing the front and rear chassis to articulate independently. Crucial for extreme maneuverability and maintaining 4-wheel ground contact.",
        material: chrome,
        function: "Enables steering by pivoting the entire machine in the middle.",
        assemblyOrder: 1,
        connections: ["Front Chassis", "Rear Chassis", "Steering Cylinders", "Driveshaft"],
        failureEffect: "Machine cannot steer, total loss of mobility.",
        cascadeFailures: ["Hydraulic Hose Rupture", "Driveshaft Shear"],
        originalPosition: {x: -2, y: 6.7, z: 0},
        explodedPosition: {x: -2, y: 18, z: 0}
    });

    parts.push({
        name: "Aggressive Forestry Tires",
        description: "Heavy-duty puncture-resistant rubber with immense aggressive V-treads (chevron) for muddy and rough terrain.",
        material: rubber,
        function: "Provides immense traction, self-cleans mud, and prevents sinking in soft soil.",
        assemblyOrder: 2,
        connections: ["Front Axle", "Rear Axle", "Planetary Gears"],
        failureEffect: "Loss of traction, machine bogging down in mud.",
        cascadeFailures: ["Axle Over-torque"],
        originalPosition: {x: 7, y: 6.7, z: 6.5},
        explodedPosition: {x: 20, y: 6.7, z: 20}
    });

    parts.push({
        name: "Front Dozer Blade",
        description: "Heavy steel blade for pushing obstacles, stacking logs, and stabilizing the machine during winch or grapple operations.",
        material: skidderYellow,
        function: "Clears path, decks logs, anchors machine.",
        assemblyOrder: 3,
        connections: ["Front Chassis", "Blade Lift Cylinders"],
        failureEffect: "Inability to clear paths or stack logs.",
        cascadeFailures: ["Front Chassis Bending"],
        originalPosition: {x: 12, y: 4, z: 0},
        explodedPosition: {x: 30, y: 4, z: 0}
    });

    parts.push({
        name: "Armored Operator Cabin (ROPS/FOPS)",
        description: "Enclosed, highly reinforced cage (Roll-Over/Falling-Object Protective Structure) with tinted armor glass and wire mesh.",
        material: skidderYellow,
        function: "Protects operator from falling trees, snapped winch cables, and roll-overs.",
        assemblyOrder: 4,
        connections: ["Front Chassis", "Controls", "HVAC"],
        failureEffect: "Fatal danger to operator, machine unsafe to run.",
        cascadeFailures: ["Console Crushing", "Glass Shatter"],
        originalPosition: {x: 0.5, y: 12.5, z: 0},
        explodedPosition: {x: 0.5, y: 30, z: 0}
    });

    parts.push({
        name: "Grapple Arch",
        description: "Towering rear steel arch providing a high lift angle for the boom.",
        material: skidderYellow,
        function: "Raises the leading ends of logs off the ground to drastically reduce drag during skidding.",
        assemblyOrder: 5,
        connections: ["Rear Chassis", "Grapple Boom", "Winch Fairlead"],
        failureEffect: "Cannot lift logs, excessive soil damage and drag.",
        cascadeFailures: ["Rear Axle Overload", "Transmission Overheat"],
        originalPosition: {x: -10, y: 8.7, z: 0},
        explodedPosition: {x: -15, y: 25, z: 0}
    });

    parts.push({
        name: "Grapple Boom & Lift Cylinders",
        description: "Extending structural arm driven by massive dual hydraulic lift rams.",
        material: skidderYellow,
        function: "Reaches and lifts logs with extreme force.",
        assemblyOrder: 6,
        connections: ["Grapple Arch", "Rotator"],
        failureEffect: "Boom drops, dropping logs.",
        cascadeFailures: ["Hydraulic Fluid Dump", "Structural Fracture"],
        originalPosition: {x: -15.5, y: 16.2, z: 0},
        explodedPosition: {x: -25, y: 35, z: 0}
    });

    parts.push({
        name: "360-Degree Hydraulic Rotator",
        description: "High-torque continuous hydraulic motor unit that spins the grapple tongs infinitely.",
        material: heavyBlackMetal,
        function: "Allows precise alignment of tongs with randomly oriented logs on the ground.",
        assemblyOrder: 7,
        connections: ["Grapple Boom", "Grapple Tongs", "Rotator Lines"],
        failureEffect: "Tongs cannot rotate, making log pickup nearly impossible.",
        cascadeFailures: ["Hose Tangle", "Motor Burnout"],
        originalPosition: {x: -24, y: 14.95, z: 0},
        explodedPosition: {x: -35, y: 28, z: 0}
    });

    parts.push({
        name: "Grapple Tongs",
        description: "Massive curved steel pincers actuated by a high-pressure synchronization cylinder to clamp multiple heavy logs simultaneously.",
        material: skidderYellow,
        function: "Securely grips and holds the payload.",
        assemblyOrder: 8,
        connections: ["Rotator", "Tong Cylinder"],
        failureEffect: "Logs slip out during transport.",
        cascadeFailures: ["Load Drop", "Tong Bending"],
        originalPosition: {x: -24, y: 12.45, z: 0},
        explodedPosition: {x: -45, y: 20, z: 0}
    });

    parts.push({
        name: "Turbo Diesel Engine Block",
        description: "High-displacement, massive torque 6-cylinder engine block providing mechanical and hydraulic power.",
        material: darkSteel,
        function: "Primary power generation for all kinetic and hydraulic systems.",
        assemblyOrder: 9,
        connections: ["Front Chassis", "Hydraulic Pumps", "Transmission", "Exhaust"],
        failureEffect: "Total machine shutdown.",
        cascadeFailures: ["Battery Drain", "Hydraulic Lock"],
        originalPosition: {x: 2, y: 6, z: 0},
        explodedPosition: {x: 2, y: 15, z: 12}
    });

    parts.push({
        name: "Hydraulic Reservoir & Gear Pumps",
        description: "Massive fluid reservoir and multi-stage gear pumps driving the articulation, boom, and blade at 4000+ PSI.",
        material: darkSteel,
        function: "Stores, cools, and pressurizes hydraulic fluid.",
        assemblyOrder: 10,
        connections: ["Engine", "Valve Banks", "Hoses"],
        failureEffect: "Loss of all implement and steering control.",
        cascadeFailures: ["Pump Cavitation", "System Overheat"],
        originalPosition: {x: -5.5, y: 6.7, z: -3.75},
        explodedPosition: {x: -15, y: 15, z: -18}
    });

    parts.push({
        name: "Planetary Reduction Axles",
        description: "Heavy cast-iron housings containing extreme-reduction planetary gearsets in the wheel hubs.",
        material: heavyBlackMetal,
        function: "Multiplies torque directly at the wheel hub to prevent driveshaft snapping under heavy loads.",
        assemblyOrder: 11,
        connections: ["Wheels", "Driveshaft", "Chassis", "Differentials"],
        failureEffect: "Wheels will not turn.",
        cascadeFailures: ["Axle Shaft Snap", "Diff Explosion"],
        originalPosition: {x: 7, y: 6.7, z: 0},
        explodedPosition: {x: 7, y: -8, z: 0}
    });

    parts.push({
        name: "High-Pressure Hydraulic Hoses",
        description: "Steel-braided rubber lines transferring extreme pressure fluid across the dynamic articulation joint.",
        material: rubber,
        function: "Transmits power from pumps to cylinders while flexing.",
        assemblyOrder: 12,
        connections: ["Pumps", "Cylinders", "Valve Bank"],
        failureEffect: "Fluid leak, immediate loss of system pressure.",
        cascadeFailures: ["Environmental Contamination", "Fire Hazard"],
        originalPosition: {x: -2, y: 8.7, z: 0},
        explodedPosition: {x: -2, y: 12, z: -12}
    });

    parts.push({
        name: "Exhaust Stack & Rain Flap",
        description: "Large diameter chrome pipe venting exhaust gasses above the cabin, featuring a mechanical rain flap.",
        material: chrome,
        function: "Removes hazardous fumes away from operator and prevents water entering the turbo.",
        assemblyOrder: 13,
        connections: ["Engine", "Turbocharger"],
        failureEffect: "Cabin fills with smoke, engine chokes or hydrolocks.",
        cascadeFailures: ["Fire", "Turbo Failure", "Hydrolock"],
        originalPosition: {x: 7, y: 15, z: 2.5},
        explodedPosition: {x: 7, y: 30, z: 8}
    });

    parts.push({
        name: "Digital Dashboard & Control Joysticks",
        description: "Advanced telemetry screens and ergonomic dual joysticks for operating driving and grapple functions simultaneously.",
        material: glowingNeon,
        function: "Human-machine interface for precision control.",
        assemblyOrder: 14,
        connections: ["Cabin", "ECU", "Valve Bank"],
        failureEffect: "Erratic or unresponsive machine behavior.",
        cascadeFailures: ["Accidental Implement Drop"],
        originalPosition: {x: 1.6, y: 15.7, z: 0},
        explodedPosition: {x: 1.6, y: 22, z: 10}
    });

    parts.push({
        name: "Heavy Duty Winch Assembly",
        description: "Hydraulically driven drum with a massive steel cable for pulling logs from inaccessible ravines.",
        material: darkSteel,
        function: "Retrieves logs that the skidder cannot drive to directly.",
        assemblyOrder: 15,
        connections: ["Rear Chassis", "Hydraulic Motor", "Fairlead Roller"],
        failureEffect: "Cable snaps or drum jams.",
        cascadeFailures: ["Whiplash Damage", "Motor Stall"],
        originalPosition: {x: -5, y: 10.2, z: 0},
        explodedPosition: {x: -10, y: 20, z: 15}
    });


    // ==========================================
    // QUIZ QUESTIONS
    // ==========================================
    const quizQuestions = [
        {
            question: "Why is an articulated chassis used instead of a rigid frame with steering wheels?",
            options: [
                "It looks cooler and is cheaper to build.",
                "It allows the massive tires to remain fixed while the entire machine bends, providing unmatched maneuverability and traction in dense forests.",
                "It prevents the engine from overheating.",
                "It increases the top speed on paved roads."
            ],
            correctAnswer: 1,
            explanation: "Articulated steering bends the machine in the middle. This allows the rear wheels to track exactly in the path of the front wheels, avoiding obstacles and maintaining maximum traction in rugged forest environments."
        },
        {
            question: "What is the primary function of the Grapple Arch?",
            options: [
                "To protect the operator from falling branches.",
                "To serve as an exhaust vent for the engine.",
                "To lift the leading ends of logs off the ground, reducing friction and drag while skidding.",
                "To cut down trees before transporting them."
            ],
            correctAnswer: 2,
            explanation: "The high arch structure lifts the leading ends of the logs. This reduces the surface area dragging on the dirt, saving immense amounts of fuel and preventing the machine from bogging down."
        },
        {
            question: "What does ROPS/FOPS stand for in relation to the Operator Cabin?",
            options: [
                "Rapid Operations & Precision Steering / Fast Open Path System",
                "Roll-Over Protective Structure / Falling-Object Protective Structure",
                "Rotary Output Power System / Fluid Over Pressure Sensor",
                "Rear Operator Position Seat / Front Output Power Shaft"
            ],
            correctAnswer: 1,
            explanation: "Forestry is extremely dangerous. The cabin is an armored cage designed to withstand the machine rolling down a hill (ROPS) and massive trees falling directly on the roof (FOPS)."
        },
        {
            question: "Why do the tires have such a deep, aggressive V-tread (chevron) pattern?",
            options: [
                "To dig through deep mud, eject debris outwardly, and grip the hard soil underneath.",
                "To provide a smooth ride on paved highways.",
                "To reduce the overall weight of the tire.",
                "To increase the braking distance on ice."
            ],
            correctAnswer: 0,
            explanation: "The V-tread acts like a series of paddles in mud. As the tire spins, the V shape channels mud outward, self-cleaning the tire so the lugs can continue to bite into fresh soil rather than turning into slick mud slicks."
        },
        {
            question: "What is the purpose of the planetary reduction gears in the wheel hubs?",
            options: [
                "To make the tires spin faster.",
                "To multiply torque directly at the wheel, preventing the driveshaft from snapping under immense loads.",
                "To control the air pressure inside the tires.",
                "To allow the tires to steer left and right."
            ],
            correctAnswer: 1,
            explanation: "By reducing the gear ratio right at the wheel hub, the driveshaft and axles can spin faster with less stress. The massive torque required to pull heavy logs is generated at the final point of contact, protecting the driveline."
        }
    ];

    // ==========================================
    // ANIMATION & SYNCHRONIZATION LOGIC
    // ==========================================
    let animTime = 0;
    function animate(time, speed, meshes) {
        animTime += 0.02 * speed;
        
        // 1. Driving / Wheels turning
        const wheelRotSpeed = 0.06 * speed;
        wheelFrontLeft.rotation.z -= wheelRotSpeed;
        wheelFrontRight.rotation.z -= wheelRotSpeed;
        wheelRearLeft.rotation.z -= wheelRotSpeed;
        wheelRearRight.rotation.z -= wheelRotSpeed;
        
        // Drive shafts spinning fast
        driveShaftFront.rotation.y += wheelRotSpeed * 3;
        driveShaftRear.rotation.y += wheelRotSpeed * 3;

        // 2. Articulated Steering (Snake motion through the forest)
        const steerAngle = Math.sin(animTime * 0.4) * 0.45;
        articulationJoint.rotation.y = steerAngle;
        
        // Steering cylinders dynamic sync
        steerCyl_L_rod.position.y = Math.sin(animTime * 0.4) * 1.2;
        steerCyl_R_rod.position.y = -Math.sin(animTime * 0.4) * 1.2;

        // 3. Boom & Arch Movement
        const boomAngle = (Math.sin(animTime * 0.7) * 0.25) - 0.15;
        boomGroup.rotation.z = boomAngle;

        // Boom Lift Cylinders sync
        boomCylRodL.position.y = Math.sin(animTime * 0.7) * 0.7;
        boomCylRodR.position.y = Math.sin(animTime * 0.7) * 0.7;

        // 4. Grapple Rotator (Spinning to align logs)
        rotatorGroup.rotation.y = animTime * 0.5;

        // 5. Tongs Opening/Closing
        const tongAnim = (Math.sin(animTime * 1.2) + 1) / 2; // Range 0 to 1
        tongL.rotation.z = tongAnim * 0.6;
        tongR.rotation.x = tongAnim * 0.6; // Mirrored
        tongCylRod.position.x = tongAnim * -0.8;

        // 6. Blade Lifting (Front Dozer)
        const bladeLift = (Math.sin(animTime * 0.3) + 1) / 2;
        bladeGroup.rotation.z = bladeLift * 0.4;
        bladeCylL_rod.position.y = bladeLift * 1.1;
        bladeCylR_rod.position.y = bladeLift * 1.1;

        // 7. Engine / Exhaust subtle vibration
        const engineVibe = Math.sin(animTime * 25) * 0.03;
        engineMesh.position.y = 6 + engineVibe;
        exhaustPipe.position.y = 15 + engineVibe;
        
        // Exhaust flap bouncing
        exhaustFlap.rotation.x = Math.PI/8 + (Math.sin(animTime * 15) * 0.2);

        // 8. Flashing Cab Beacons
        const flash1 = (Math.sin(animTime * 8) > 0) ? 2 : 0;
        const flash2 = (Math.cos(animTime * 8) > 0) ? 2 : 0;
        cabRoofLights[0].material.emissiveIntensity = flash1;
        cabRoofLights[1].material.emissiveIntensity = flash1;
        cabRoofLights[2].material.emissiveIntensity = flash2;
        cabRoofLights[3].material.emissiveIntensity = flash2;
        strobeLight.material.emissiveIntensity = (Math.sin(animTime * 20) > 0) ? 3 : 0;
        
        // 9. Winch drum subtle rotation
        winchDrum.rotation.y = animTime * 0.2;
    }

    return { group, parts, description: "Massive Articulated Forestry Skidder", quizQuestions, animate };
}
