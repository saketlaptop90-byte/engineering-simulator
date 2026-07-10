import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Utility to create parts and register them
    function createPart(name, description, material, meshGroup, origPos, explPos, failure, parent = group) {
        meshGroup.name = name;
        meshGroup.position.copy(origPos);
        parent.add(meshGroup);
        parts.push({
            name,
            description,
            material: material ? (material.name || 'Composite') : 'Composite',
            function: description,
            assemblyOrder: parts.length + 1,
            connections: [],
            failureEffect: failure || 'Machine efficiency decreases.',
            cascadeFailures: [],
            originalPosition: { x: origPos.x, y: origPos.y, z: origPos.z },
            explodedPosition: { x: explPos.x, y: explPos.y, z: explPos.z }
        });
        return meshGroup;
    }

    // 1. CHASSIS FRAME
    {
        const chassisGroup = new THREE.Group();
        const beamGeo = new THREE.BoxGeometry(1.5, 2.5, 32);
        const beamL = new THREE.Mesh(beamGeo, darkSteel);
        beamL.position.set(-2.5, 0, 0);
        chassisGroup.add(beamL);
        const beamR = new THREE.Mesh(beamGeo, darkSteel);
        beamR.position.set(2.5, 0, 0);
        chassisGroup.add(beamR);
        
        for(let i = -14; i <= 14; i += 4) {
            const cross = new THREE.Mesh(new THREE.BoxGeometry(5, 2, 1.2), darkSteel);
            cross.position.set(0, 0, i);
            chassisGroup.add(cross);
        }
        
        const fAxle = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 14), steel);
        fAxle.rotation.z = Math.PI / 2;
        fAxle.position.set(0, -0.5, 10);
        chassisGroup.add(fAxle);
        
        const rAxle = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 17), steel);
        rAxle.rotation.z = Math.PI / 2;
        rAxle.position.set(0, -0.5, -9);
        chassisGroup.add(rAxle);

        createPart("Chassis_Frame", "Massive structural backbone of the haul truck.", darkSteel, chassisGroup, new THREE.Vector3(0, 4.3, 0), new THREE.Vector3(0, 4.3, 0), "Total structural collapse.");
    }

    // WHEEL GENERATOR
    function createWheel(name, origPos, explPos, isLeft) {
        const wheelGroup = new THREE.Group();
        
        const tireGeo = new THREE.TorusGeometry(3.2, 1.5, 32, 100);
        tireGeo.rotateY(Math.PI / 2);
        const tire = new THREE.Mesh(tireGeo, rubber);
        wheelGroup.add(tire);
        
        const lugGeo = new THREE.BoxGeometry(1.6, 0.4, 0.6);
        for(let i = 0; i < 70; i++) {
            const angle = (i / 70) * Math.PI * 2;
            const pivot = new THREE.Group();
            pivot.rotation.x = angle;
            
            const m1 = new THREE.Mesh(lugGeo, rubber);
            m1.position.set(-0.8, 4.5, 0);
            m1.rotation.y = Math.PI / 6;
            pivot.add(m1);
            
            const m2 = new THREE.Mesh(lugGeo, rubber);
            m2.position.set(0.8, 4.5, 0);
            m2.rotation.y = -Math.PI / 6;
            pivot.add(m2);
            
            wheelGroup.add(pivot);
        }
        
        const rimGeo = new THREE.CylinderGeometry(2.2, 2.2, 2.8, 32);
        rimGeo.rotateZ(Math.PI / 2);
        const rim = new THREE.Mesh(rimGeo, darkSteel);
        wheelGroup.add(rim);
        
        const hubGeo = new THREE.CylinderGeometry(1.0, 1.0, 3.2, 16);
        hubGeo.rotateZ(Math.PI / 2);
        const hub = new THREE.Mesh(hubGeo, chrome);
        wheelGroup.add(hub);
        
        for(let i = 0; i < 16; i++) {
            const spokeGeo = new THREE.CylinderGeometry(0.2, 0.2, 2.2);
            spokeGeo.rotateZ(Math.PI / 2);
            const pivot = new THREE.Group();
            pivot.rotation.x = (i / 16) * Math.PI * 2;
            
            const spoke = new THREE.Mesh(spokeGeo, steel);
            spoke.position.set(0, 1.6, 0);
            pivot.add(spoke);
            wheelGroup.add(pivot);
        }
        
        createPart(name, "Massive high-traction earthmover tire.", rubber, wheelGroup, origPos, explPos, "Loss of mobility.");
        return wheelGroup;
    }

    const wheels = [];
    wheels.push(createWheel("Front_Left_Wheel", new THREE.Vector3(-6.5, 3.8, 10), new THREE.Vector3(-15, 3.8, 10), true));
    wheels.push(createWheel("Front_Right_Wheel", new THREE.Vector3(6.5, 3.8, 10), new THREE.Vector3(15, 3.8, 10), false));
    wheels.push(createWheel("Rear_Left_Outer_Wheel", new THREE.Vector3(-8.2, 3.8, -9), new THREE.Vector3(-25, 3.8, -9), true));
    wheels.push(createWheel("Rear_Left_Inner_Wheel", new THREE.Vector3(-4.8, 3.8, -9), new THREE.Vector3(-15, 3.8, -9), true));
    wheels.push(createWheel("Rear_Right_Outer_Wheel", new THREE.Vector3(8.2, 3.8, -9), new THREE.Vector3(25, 3.8, -9), false));
    wheels.push(createWheel("Rear_Right_Inner_Wheel", new THREE.Vector3(4.8, 3.8, -9), new THREE.Vector3(15, 3.8, -9), false));

    // ENGINE BLOCK
    {
        const engineGroup = new THREE.Group();
        const block = new THREE.Mesh(new THREE.BoxGeometry(4.5, 6, 10), darkSteel);
        engineGroup.add(block);
        
        for(let i = 0; i < 10; i++) {
            const cylL = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 2.5), chrome);
            cylL.position.set(-1.8, 3, -4.5 + i * 1.0);
            cylL.rotation.z = Math.PI / 6;
            engineGroup.add(cylL);
            
            const cylR = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 2.5), chrome);
            cylR.position.set(1.8, 3, -4.5 + i * 1.0);
            cylR.rotation.z = -Math.PI / 6;
            engineGroup.add(cylR);
        }
        
        const intakePoints = [];
        for ( let i = 0; i <= 10; i ++ ) {
            intakePoints.push( new THREE.Vector2( Math.sin( i * 0.2 ) * 0.6 + 0.8, ( i - 5 ) * 0.5 ) );
        }
        const latheGeo = new THREE.LatheGeometry( intakePoints, 32 );
        const filterL = new THREE.Mesh(latheGeo, plastic);
        filterL.rotation.x = Math.PI / 2;
        filterL.position.set(-1.5, 5, 3);
        engineGroup.add(filterL);
        
        const filterR = new THREE.Mesh(latheGeo, plastic);
        filterR.rotation.x = Math.PI / 2;
        filterR.position.set(1.5, 5, 3);
        engineGroup.add(filterR);
        
        createPart("Engine_Block", "Colossal V20 Diesel Engine.", darkSteel, engineGroup, new THREE.Vector3(0, 7.5, 5), new THREE.Vector3(0, 15, 25), "Complete loss of power.");
    }

    // RADIATOR GRILLE
    {
        const grilleGroup = new THREE.Group();
        const frame = new THREE.Mesh(new THREE.BoxGeometry(8, 7, 1), darkSteel);
        grilleGroup.add(frame);
        
        for(let i = -3; i <= 3; i += 0.5) {
            const bar = new THREE.Mesh(new THREE.BoxGeometry(7.5, 0.2, 1.2), chrome);
            bar.position.set(0, i, 0);
            grilleGroup.add(bar);
        }
        
        const hlGeo = new THREE.BoxGeometry(1.5, 1.5, 0.5);
        const hlMat = new THREE.MeshStandardMaterial({color: 0xffffff, emissive: 0xddddff, emissiveIntensity: 2});
        const hlL = new THREE.Mesh(hlGeo, hlMat);
        hlL.position.set(-4.5, 0, 0.2);
        grilleGroup.add(hlL);
        const hlR = hlL.clone();
        hlR.position.set(4.5, 0, 0.2);
        grilleGroup.add(hlR);

        createPart("Radiator_Grille", "Massive front cooling array and headlights.", chrome, grilleGroup, new THREE.Vector3(0, 8, 14.5), new THREE.Vector3(0, 8, 30), "Engine overheating.");
    }

    // CABIN
    let beaconMat;
    {
        const cabinGroup = new THREE.Group();
        const shellGeo = new THREE.BoxGeometry(6, 6, 7);
        const shell = new THREE.Mesh(shellGeo, plastic);
        shell.position.set(0, 3, 0);
        cabinGroup.add(shell);
        
        const roof = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.5, 7.4), darkSteel);
        roof.position.set(0, 6.25, 0);
        cabinGroup.add(roof);
        
        const windGeo = new THREE.PlaneGeometry(5.8, 4);
        const wind = new THREE.Mesh(windGeo, tinted);
        wind.position.set(0, 3.5, 3.51);
        wind.rotation.x = -Math.PI / 12;
        cabinGroup.add(wind);
        
        const sideWindGeo = new THREE.PlaneGeometry(4, 4);
        const sideWindL = new THREE.Mesh(sideWindGeo, tinted);
        sideWindL.position.set(-3.01, 3.5, 0);
        sideWindL.rotation.y = -Math.PI / 2;
        cabinGroup.add(sideWindL);
        
        const sideWindR = new THREE.Mesh(sideWindGeo, tinted);
        sideWindR.position.set(3.01, 3.5, 0);
        sideWindR.rotation.y = Math.PI / 2;
        cabinGroup.add(sideWindR);
        
        beaconMat = new THREE.MeshStandardMaterial({color: 0xff8800, emissive: 0xff8800, emissiveIntensity: 2});
        const beacon = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.6), beaconMat);
        beacon.position.set(-2, 6.8, 0);
        cabinGroup.add(beacon);

        // Steering wheel and interior glow
        const steer = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.1, 16, 32), darkSteel);
        steer.position.set(-1.5, 2.5, 2.5);
        steer.rotation.x = -Math.PI / 4;
        cabinGroup.add(steer);
        
        const screenGeo = new THREE.PlaneGeometry(1.5, 1);
        const screenMat = new THREE.MeshStandardMaterial({color: 0x00ffcc, emissive: 0x00ffcc, emissiveIntensity: 1});
        const screen = new THREE.Mesh(screenGeo, screenMat);
        screen.position.set(1, 2.5, 3.4);
        screen.rotation.x = -Math.PI / 8;
        cabinGroup.add(screen);

        createPart("Cabin_Assembly", "Asymmetric operator cabin with high visibility.", plastic, cabinGroup, new THREE.Vector3(-4, 11, 9), new THREE.Vector3(-15, 20, 20), "Operator cannot control the vehicle.");
    }

    // FUEL TANKS
    {
        const tankGroupL = new THREE.Group();
        const tankGeo = new THREE.CylinderGeometry(2.5, 2.5, 8, 32);
        tankGeo.rotateX(Math.PI / 2);
        const tank = new THREE.Mesh(tankGeo, darkSteel);
        tankGroupL.add(tank);
        
        const strapGeo = new THREE.TorusGeometry(2.55, 0.15, 16, 64);
        strapGeo.rotateY(Math.PI / 2);
        const strap1 = new THREE.Mesh(strapGeo, chrome);
        strap1.position.z = -2.5;
        tankGroupL.add(strap1);
        const strap2 = new THREE.Mesh(strapGeo, chrome);
        strap2.position.z = 2.5;
        tankGroupL.add(strap2);

        createPart("Left_Fuel_Tank", "Holds thousands of gallons of diesel fuel.", darkSteel, tankGroupL, new THREE.Vector3(-6, 4.5, 1), new THREE.Vector3(-20, 4.5, 1), "Engine fuel starvation.");
        
        const tankGroupR = tankGroupL.clone();
        createPart("Right_Fuel_Tank", "Secondary high-capacity fuel storage.", darkSteel, tankGroupR, new THREE.Vector3(6, 4.5, 1), new THREE.Vector3(20, 4.5, 1), "Engine fuel starvation.");
    }

    // EXHAUST SYSTEM
    {
        const exhaustGroup = new THREE.Group();
        const ex1 = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 5), chrome);
        ex1.position.set(0, 2.5, 0);
        exhaustGroup.add(ex1);
        
        const ex2 = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 4), chrome);
        ex2.rotation.x = Math.PI / 4;
        ex2.position.set(0, 6.4, 1.4);
        exhaustGroup.add(ex2);
        
        const ex3 = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 6), chrome);
        ex3.position.set(0, 10.5, 2.8);
        exhaustGroup.add(ex3);
        
        const exCap = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.9, 0.8), darkSteel);
        exCap.position.set(0, 13.9, 2.8);
        exhaustGroup.add(exCap);

        createPart("Left_Exhaust_Stack", "Vertical emission filtering pipes.", chrome, exhaustGroup, new THREE.Vector3(-3.5, 7, 5), new THREE.Vector3(-10, 25, 5), "Engine choking.");
        const exhaustR = exhaustGroup.clone();
        createPart("Right_Exhaust_Stack", "Vertical emission filtering pipes.", chrome, exhaustR, new THREE.Vector3(3.5, 7, 5), new THREE.Vector3(10, 25, 5), "Engine choking.");
    }

    // BED PIVOT & DUMP BED
    const bedPivot = new THREE.Group();
    bedPivot.name = "BedPivot";
    bedPivot.position.set(0, 7.5, -9); 
    group.add(bedPivot);

    {
        const bedGroup = new THREE.Group();
        
        const floor = new THREE.Mesh(new THREE.BoxGeometry(16, 0.8, 20), steel);
        floor.position.set(0, 0.4, 9);
        bedGroup.add(floor);
        
        const frontWall = new THREE.Mesh(new THREE.BoxGeometry(16, 0.8, 7), steel);
        frontWall.position.set(0, 3.4, 20.5);
        frontWall.rotation.x = -Math.PI / 3;
        bedGroup.add(frontWall);
        
        const canopy = new THREE.Mesh(new THREE.BoxGeometry(16, 0.8, 7), steel);
        canopy.position.set(0, 6.5, 23.5);
        bedGroup.add(canopy);
        
        const sideShape = new THREE.Shape();
        sideShape.moveTo(-1, 0); 
        sideShape.lineTo(19, 0); 
        sideShape.lineTo(23, 6.1); 
        sideShape.lineTo(27, 6.1); 
        sideShape.lineTo(27, 7.3);
        sideShape.lineTo(22, 7.3);
        sideShape.lineTo(17, 7.8);
        sideShape.lineTo(-1, 7.8);
        sideShape.lineTo(-1, 0);

        const sideGeo = new THREE.ExtrudeGeometry(sideShape, { depth: 0.8, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 });
        sideGeo.rotateY(-Math.PI / 2);

        const leftWall = new THREE.Mesh(sideGeo, steel);
        leftWall.position.set(-7.6, 0, 0);
        bedGroup.add(leftWall);

        const rightWall = new THREE.Mesh(sideGeo, steel);
        rightWall.position.set(8.4, 0, 0); 
        bedGroup.add(rightWall);

        createPart("Dump_Bed_Base", "Main body capable of hauling over 400 tons of earth.", steel, bedGroup, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 20, -10), "Inability to carry load.", bedPivot);
    }

    {
        const ribsGroup = new THREE.Group();
        for(let i = 0; i <= 18; i += 3) {
            const ribL = new THREE.Mesh(new THREE.BoxGeometry(0.5, 7.8, 0.6), darkSteel);
            ribL.position.set(-8.25, 3.9, i);
            ribsGroup.add(ribL);
            
            const ribR = new THREE.Mesh(new THREE.BoxGeometry(0.5, 7.8, 0.6), darkSteel);
            ribR.position.set(8.25, 3.9, i);
            ribsGroup.add(ribR);
        }
        const hRibL = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 20), darkSteel);
        hRibL.position.set(-8.3, 4, 9);
        ribsGroup.add(hRibL);
        const hRibR = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 20), darkSteel);
        hRibR.position.set(8.3, 4, 9);
        ribsGroup.add(hRibR);

        createPart("Dump_Bed_Ribs", "Thick structural reinforcements for the bed walls.", darkSteel, ribsGroup, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 30, -15), "Bed side walls burst under pressure.", bedPivot);
    }

    // HYDRAULICS
    const leftHydBaseGroup = new THREE.Group();
    const rightHydBaseGroup = new THREE.Group();
    const leftHydPistGroup = new THREE.Group();
    const rightHydPistGroup = new THREE.Group();
    {
        const lhBaseMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 8), darkSteel);
        lhBaseMesh.rotation.x = Math.PI / 2;
        lhBaseMesh.position.z = 4;
        leftHydBaseGroup.add(lhBaseMesh);
        createPart("Left_Hydraulic_Cylinder", "Outer casing of the lifting ram.", darkSteel, leftHydBaseGroup, new THREE.Vector3(-4, 4, 2), new THREE.Vector3(-15, 4, 2), "Inability to raise bed.");

        const lhPistMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 8), chrome);
        lhPistMesh.rotation.x = Math.PI / 2;
        lhPistMesh.position.z = 4;
        leftHydPistGroup.add(lhPistMesh);
        createPart("Left_Hydraulic_Piston", "Inner extending ram.", chrome, leftHydPistGroup, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 8), "Piston jam.", leftHydBaseGroup);

        const rhBaseMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 8), darkSteel);
        rhBaseMesh.rotation.x = Math.PI / 2;
        rhBaseMesh.position.z = 4;
        rightHydBaseGroup.add(rhBaseMesh);
        createPart("Right_Hydraulic_Cylinder", "Outer casing of the lifting ram.", darkSteel, rightHydBaseGroup, new THREE.Vector3(4, 4, 2), new THREE.Vector3(15, 4, 2), "Inability to raise bed.");

        const rhPistMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 8), chrome);
        rhPistMesh.rotation.x = Math.PI / 2;
        rhPistMesh.position.z = 4;
        rightHydPistGroup.add(rhPistMesh);
        createPart("Right_Hydraulic_Piston", "Inner extending ram.", chrome, rightHydPistGroup, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 8), "Piston jam.", rightHydBaseGroup);
    }

    // LADDERS AND PLATFORMS
    {
        const laddersGroup = new THREE.Group();
        for(let i = 0; i < 20; i++) {
            const step = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.5), steel);
            step.rotation.z = Math.PI / 2;
            step.position.set(0, i * 0.5, i * 0.4);
            laddersGroup.add(step);
        }
        
        const railGeo = new THREE.CylinderGeometry(0.1, 0.1, 15);
        railGeo.rotateX(-Math.atan2(0.4, 0.5)); 
        const rail1 = new THREE.Mesh(railGeo, plastic);
        rail1.position.set(-1.25, 4.8, 3.8);
        laddersGroup.add(rail1);
        
        const rail2 = new THREE.Mesh(railGeo, plastic);
        rail2.position.set(1.25, 4.8, 3.8);
        laddersGroup.add(rail2);

        createPart("Front_Diagonal_Stairs", "Allows operator access to the high platform.", plastic, laddersGroup, new THREE.Vector3(-4.5, 2, 15), new THREE.Vector3(-15, 2, 25), "Operator cannot board safely.");
    }

    const quizQuestions = [
        {
            question: "What is the primary function of the massive Torus-shaped tires on this heavy mining truck?",
            options: ["To maximize speed on paved roads", "To distribute the enormous weight and provide traction on rough mining terrain", "To improve aerodynamics", "To reduce fuel consumption"],
            answer: 1
        },
        {
            question: "How do the immense hydraulic cylinders raise the heavily loaded dump bed?",
            options: ["By using electric motors directly", "Through pressurized fluid extending the inner chrome pistons", "By using a counterweight system", "Using a pneumatic air suspension"],
            answer: 1
        },
        {
            question: "Why is the cabin positioned asymmetrically on the left side of the chassis?",
            options: ["To counterbalance the fuel tanks", "To give the operator better visibility of the haul road center line and incoming traffic", "To make room for the exhaust system", "It's a manufacturing defect"],
            answer: 1
        },
        {
            question: "What is the purpose of the extremely thick structural ribs along the outside of the dump bed?",
            options: ["Decorative styling", "To reinforce the walls against the impact of hundreds of tons of falling rock", "To catch spilling water", "To act as ladders for maintenance"],
            answer: 1
        },
        {
            question: "What function does the prominent front radiator grille serve?",
            options: ["It protects the windshield", "It provides massive airflow to cool the immense V20 diesel engine during heavy load operations", "It stores excess hydraulic fluid", "It improves the vehicle's turning radius"],
            answer: 1
        }
    ];

    const animate = (time, speed, meshes) => {
        // Rotate all massive wheels
        wheels.forEach(w => w.rotation.x -= speed * 0.05);

        // Flash beacon light
        if (beaconMat) {
            beaconMat.emissiveIntensity = (Math.sin(time * 12) + 1.2);
        }

        // Calculate Dump Bed tilt cycle
        const tilt = (Math.sin(time * 0.8) + 1) / 2 * (Math.PI / 2.3); 
        bedPivot.rotation.x = -tilt;
        bedPivot.updateMatrixWorld();

        // Track hydraulics
        const leftTargetLocal = new THREE.Vector3(-4, -2, 15);
        const rightTargetLocal = new THREE.Vector3(4, -2, 15);

        const worldTargetL = new THREE.Vector3();
        bedPivot.localToWorld(worldTargetL.copy(leftTargetLocal));
        const worldTargetR = new THREE.Vector3();
        bedPivot.localToWorld(worldTargetR.copy(rightTargetLocal));

        // Group's worldToLocal logic to align correctly within the scene's hierarchy
        // The group itself might be rotated, so we lookAt world targets.
        leftHydBaseGroup.lookAt(worldTargetL);
        rightHydBaseGroup.lookAt(worldTargetR);

        const baseWorldL = new THREE.Vector3();
        leftHydBaseGroup.getWorldPosition(baseWorldL);
        const distL = baseWorldL.distanceTo(worldTargetL);
        leftHydPistGroup.position.z = distL - 7; 

        const baseWorldR = new THREE.Vector3();
        rightHydBaseGroup.getWorldPosition(baseWorldR);
        const distR = baseWorldR.distanceTo(worldTargetR);
        rightHydPistGroup.position.z = distR - 7;
    };

    return { group, parts, description: "A colossal, hyper-realistic, multi-function Heavy Machinery Mining Dump Truck capable of hauling hundreds of tons.", quizQuestions, animate };
}

// Auto-generated missing stub
export function createDumpTruck() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
