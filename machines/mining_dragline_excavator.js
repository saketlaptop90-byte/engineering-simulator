import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // --- MATERIALS WITH NEON/GLOW ---
    const neonBlue = new THREE.MeshStandardMaterial({ color: 0x00aaff, emissive: 0x00aaff, emissiveIntensity: 2.0, roughness: 0.1, metalness: 0.8 });
    const neonRed = new THREE.MeshStandardMaterial({ color: 0xff0044, emissive: 0xff0044, emissiveIntensity: 2.0, roughness: 0.2, metalness: 0.5 });
    const safetyYellow = new THREE.MeshStandardMaterial({ color: 0xffcc00, roughness: 0.4, metalness: 0.2 });

    // --- UTILITY FUNCTIONS ---
    function createHydraulicPiston(length, radius) {
        const pGroup = new THREE.Group();
        const cylinderGeo = new THREE.CylinderGeometry(radius, radius, length, 32);
        cylinderGeo.translate(0, length / 2, 0);
        const cylinder = new THREE.Mesh(cylinderGeo, darkSteel);
        
        const rodGeo = new THREE.CylinderGeometry(radius * 0.6, radius * 0.6, length * 1.2, 32);
        rodGeo.translate(0, (length * 1.2) / 2, 0);
        const rod = new THREE.Mesh(rodGeo, chrome);
        rod.position.y = length * 0.5; // default extension

        pGroup.add(cylinder, rod);
        return { group: pGroup, rod: rod, cylinder: cylinder, length: length };
    }

    function createHyperRealisticTire(radius, tube, rimRadius) {
        const tireGroup = new THREE.Group();
        const tireGeo = new THREE.TorusGeometry(radius, tube, 32, 100);
        const tireMesh = new THREE.Mesh(tireGeo, rubber);
        tireGroup.add(tireMesh);

        // Aggressive off-road lugs
        const lugGeo = new THREE.BoxGeometry(tube * 1.2, tube * 0.4, tube * 2.5);
        const lugCount = 80;
        for(let i=0; i<lugCount; i++) {
            const angle = (i / lugCount) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeo, rubber);
            lug.position.set(Math.cos(angle) * (radius + tube * 0.8), Math.sin(angle) * (radius + tube * 0.8), 0);
            lug.rotation.z = angle;
            lug.rotation.y = (i % 2 === 0) ? Math.PI/6 : -Math.PI/6;
            tireGroup.add(lug);
        }

        // Complex rim with spokes
        const rimGeo = new THREE.CylinderGeometry(rimRadius, rimRadius, tube * 2.2, 64);
        const rim = new THREE.Mesh(rimGeo, chrome);
        rim.rotation.x = Math.PI / 2;
        tireGroup.add(rim);

        const spokeGeo = new THREE.CylinderGeometry(tube*0.15, tube*0.2, rimRadius * 1.9, 32);
        for(let i=0; i<12; i++) {
            const spoke = new THREE.Mesh(spokeGeo, darkSteel);
            spoke.rotation.x = Math.PI / 2;
            spoke.rotation.z = (i / 12) * Math.PI * 2;
            tireGroup.add(spoke);
        }
        
        // Hubcap
        const hubGeo = new THREE.CylinderGeometry(rimRadius * 0.3, rimRadius * 0.4, tube * 2.4, 32);
        const hub = new THREE.Mesh(hubGeo, copper);
        hub.rotation.x = Math.PI / 2;
        tireGroup.add(hub);

        return tireGroup;
    }

    function createHydraulicLine(points, radius) {
        const curve = new THREE.CatmullRomCurve3(points);
        const tubeGeo = new THREE.TubeGeometry(curve, 64, radius, 12, false);
        return new THREE.Mesh(tubeGeo, rubber);
    }

    // =======================================================
    // 1. BASE TUB & ROLLER CIRCLE
    // =======================================================
    const baseGroup = new THREE.Group();
    
    // Complex LatheGeometry for tub
    const tubPoints = [];
    tubPoints.push(new THREE.Vector2(0, 0));
    tubPoints.push(new THREE.Vector2(25, 0));
    tubPoints.push(new THREE.Vector2(25, 2));
    tubPoints.push(new THREE.Vector2(23, 4));
    tubPoints.push(new THREE.Vector2(22, 5));
    tubPoints.push(new THREE.Vector2(0, 5));
    const tubGeo = new THREE.LatheGeometry(tubPoints, 128);
    const tubMesh = new THREE.Mesh(tubGeo, darkSteel);
    baseGroup.add(tubMesh);

    // Roller Circle Ring
    const ringGeo = new THREE.TorusGeometry(20, 0.8, 32, 128);
    const ringMesh = new THREE.Mesh(ringGeo, steel);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = 5.4;
    baseGroup.add(ringMesh);

    // Rollers
    for(let i=0; i<60; i++) {
        const roller = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 1.6, 16), chrome);
        const angle = (i/60) * Math.PI * 2;
        roller.position.set(Math.cos(angle) * 20, 6, Math.sin(angle) * 20);
        roller.rotation.x = Math.PI / 2;
        roller.rotation.z = -angle;
        baseGroup.add(roller);
    }

    group.add(baseGroup);
    parts.push({
        name: 'Massive Base Tub & Roller Bearings',
        description: 'The immense stationary foundation. Features a complex lathe-machined tub and 60 massive chromium roller bearings.',
        material: 'darkSteel, chrome',
        function: 'Provides anchoring and 360-degree slew capability.',
        assemblyOrder: 1,
        connections: ['Revolving Frame', 'Transport Wheels'],
        failureEffect: 'Inability to swing or catastrophic structural collapse.',
        cascadeFailures: ['Revolving Frame', 'Boom'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -30, z: 0 }
    });

    // =======================================================
    // 2. AUXILIARY TRANSPORT WHEELS (MANDATE)
    // =======================================================
    const wheelsGroup = new THREE.Group();
    const wheelPositions = [
        {x: 28, z: 28}, {x: -28, z: 28}, {x: 28, z: -28}, {x: -28, z: -28}
    ];
    wheelPositions.forEach((pos) => {
        const bogie = new THREE.Group();
        bogie.position.set(pos.x, 3, pos.z);
        
        const mount = new THREE.Mesh(new THREE.BoxGeometry(6, 6, 6), darkSteel);
        bogie.add(mount);

        const tire1 = createHyperRealisticTire(3, 1.2, 2.2);
        tire1.position.set(4, 0, 0);
        tire1.rotation.y = Math.PI / 2;
        
        const tire2 = createHyperRealisticTire(3, 1.2, 2.2);
        tire2.position.set(-4, 0, 0);
        tire2.rotation.y = Math.PI / 2;

        bogie.add(tire1, tire2);
        
        // Massive Hydraulic pistons for wheels
        const hoistPiston = createHydraulicPiston(4, 1);
        hoistPiston.group.position.set(0, 3, 0);
        bogie.add(hoistPiston.group);
        
        wheelsGroup.add(bogie);
    });
    baseGroup.add(wheelsGroup);

    parts.push({
        name: 'Auxiliary Transport Bogies',
        description: 'Four multi-wheeled, hydraulically articulated bogies featuring aggressive hyper-realistic tires for emergency relocation.',
        material: 'rubber, chrome, darkSteel',
        function: 'Allows limited transport rolling without walking mechanisms.',
        assemblyOrder: 2,
        connections: ['Base Tub'],
        failureEffect: 'Cannot roll in emergency mode.',
        cascadeFailures: [],
        originalPosition: { x: 28, y: 3, z: 28 },
        explodedPosition: { x: 60, y: 0, z: 60 }
    });

    // =======================================================
    // 3. REVOLVING FRAME
    // =======================================================
    const rotatingGroup = new THREE.Group();
    rotatingGroup.position.y = 6.6; // sit on rollers
    group.add(rotatingGroup);

    // Extruded frame base
    const frameShape = new THREE.Shape();
    frameShape.moveTo(-22, -25);
    frameShape.lineTo(22, -25);
    frameShape.lineTo(22, 20);
    frameShape.lineTo(12, 35);
    frameShape.lineTo(-12, 35);
    frameShape.lineTo(-22, 20);
    frameShape.lineTo(-22, -25);
    const frameExtrude = { depth: 4, bevelEnabled: true, bevelThickness: 0.5, bevelSize: 0.5, bevelSegments: 3 };
    const frameGeo = new THREE.ExtrudeGeometry(frameShape, frameExtrude);
    const frameMesh = new THREE.Mesh(frameGeo, darkSteel);
    frameMesh.rotation.x = Math.PI / 2;
    frameMesh.position.y = 4;
    rotatingGroup.add(frameMesh);

    parts.push({
        name: 'Slew Frame Deck',
        description: 'Extruded high-strength steel deck supporting all dynamic loads from the boom and machinery.',
        material: 'darkSteel',
        function: 'Rotates on the roller circle and carries the entire upper superstructure.',
        assemblyOrder: 3,
        connections: ['Base Tub', 'Machinery House', 'Walking Cams', 'Boom'],
        failureEffect: 'Deformation leading to machinery misalignment.',
        cascadeFailures: ['Winches', 'Walking Mechanisms'],
        originalPosition: { x: 0, y: 10, z: 0 },
        explodedPosition: { x: 0, y: 20, z: -50 }
    });

    // =======================================================
    // 4. MACHINERY HOUSE & EXTERIOR DETAILS
    // =======================================================
    const houseGroup = new THREE.Group();
    houseGroup.position.set(0, 4, -5);
    rotatingGroup.add(houseGroup);

    // Main housing Extrusion
    const houseShape = new THREE.Shape();
    houseShape.moveTo(-20, -20);
    houseShape.lineTo(20, -20);
    houseShape.lineTo(20, 15);
    houseShape.lineTo(10, 20);
    houseShape.lineTo(-10, 20);
    houseShape.lineTo(-20, 15);
    houseShape.lineTo(-20, -20);
    const houseExt = { depth: 25, bevelEnabled: true, bevelSize: 0.5 };
    const houseMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(houseShape, houseExt), steel);
    houseGroup.add(houseMesh);

    // Glowing Neon trim
    const trimGeo = new THREE.BoxGeometry(41, 1, 26);
    const trimMesh = new THREE.Mesh(trimGeo, neonBlue);
    trimMesh.position.set(0, 12, 12.5);
    houseGroup.add(trimMesh);

    // Ventilation Louvers
    const louverMat = new THREE.MeshStandardMaterial({color: 0x222222, metalness: 0.9});
    for(let i=0; i<15; i++) {
        const louver = new THREE.Mesh(new THREE.BoxGeometry(10, 0.4, 1), louverMat);
        louver.position.set(-15, 5 + (i * 0.8), 25.5);
        louver.rotation.x = Math.PI / 8;
        houseGroup.add(louver);
        
        const louver2 = new THREE.Mesh(new THREE.BoxGeometry(10, 0.4, 1), louverMat);
        louver2.position.set(15, 5 + (i * 0.8), 25.5);
        louver2.rotation.x = Math.PI / 8;
        houseGroup.add(louver2);
    }

    // Exhaust Stacks array
    for(let i=0; i<6; i++) {
        const stackGeo = new THREE.CylinderGeometry(1.2, 1.5, 10, 32);
        const stack = new THREE.Mesh(stackGeo, darkSteel);
        stack.position.set(-12 + (i*4.8), 30, 5);
        houseGroup.add(stack);
        
        // Emissive interior ring
        const glowGeo = new THREE.TorusGeometry(1, 0.2, 16, 32);
        const glow = new THREE.Mesh(glowGeo, neonRed);
        glow.rotation.x = Math.PI/2;
        glow.position.set(-12 + (i*4.8), 35.1, 5);
        houseGroup.add(glow);
    }

    parts.push({
        name: 'Machinery House & Powerplant',
        description: 'Armored structure housing massive diesel-electric generators. Features active ventilation and dual neon-lit sensor trims.',
        material: 'steel, neonBlue',
        function: 'Protects the prime movers and electrical switchgear.',
        assemblyOrder: 4,
        connections: ['Slew Frame Deck', 'Winches'],
        failureEffect: 'Environmental damage to internal electronics and winches.',
        cascadeFailures: ['All Systems'],
        originalPosition: { x: 0, y: 16, z: 7.5 },
        explodedPosition: { x: 0, y: 60, z: 0 }
    });

    // =======================================================
    // 5. HYPER-DETAILED WALKING MECHANISM
    // =======================================================
    const walkAnims = [];
    function buildWalker(isPort) {
        const sideGroup = new THREE.Group();
        const mult = isPort ? 1 : -1;
        sideGroup.position.set(24 * mult, 6, 0);

        // Eccentric Cam
        const camGroup = new THREE.Group();
        const camGeo = new THREE.CylinderGeometry(8, 8, 3, 64);
        const cam = new THREE.Mesh(camGeo, chrome);
        cam.rotation.x = Math.PI/2;
        
        // Off-center pivot mount
        const camPivot = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 4, 32), darkSteel);
        camPivot.rotation.x = Math.PI/2;
        camPivot.position.set(0, 3, 0); // eccentric offset
        camGroup.add(cam);
        camGroup.add(camPivot);
        sideGroup.add(camGroup);

        // Leg Frame (Extrude)
        const legShape = new THREE.Shape();
        legShape.moveTo(-3, -15);
        legShape.lineTo(3, -15);
        legShape.lineTo(5, 10);
        legShape.lineTo(-5, 10);
        const legGeo = new THREE.ExtrudeGeometry(legShape, {depth: 2, bevelEnabled: true});
        const leg = new THREE.Mesh(legGeo, steel);
        leg.position.z = -1;
        
        const legPivotWrapper = new THREE.Group();
        legPivotWrapper.add(leg);
        sideGroup.add(legPivotWrapper);

        // Hydraulic lift piston for leg articulation
        const articulationPiston = createHydraulicPiston(8, 1.5);
        articulationPiston.group.position.set(mult * -3, -5, 0);
        articulationPiston.group.rotation.z = mult * Math.PI/8;
        sideGroup.add(articulationPiston.group);

        // Walking Shoe (Pontoon)
        const shoeShape = new THREE.Shape();
        shoeShape.moveTo(-5, -20);
        shoeShape.lineTo(5, -20);
        shoeShape.lineTo(7, 20);
        shoeShape.lineTo(-7, 20);
        const shoeGeo = new THREE.ExtrudeGeometry(shoeShape, {depth: 3, bevelEnabled: true});
        const shoe = new THREE.Mesh(shoeGeo, darkSteel);
        shoe.rotation.x = Math.PI/2;
        shoe.position.set(0, -18, 0);
        sideGroup.add(shoe);

        rotatingGroup.add(sideGroup);
        
        walkAnims.push({ camGroup, legPivotWrapper, shoe, articulationPiston, mult });
        
        return sideGroup;
    }

    buildWalker(true);
    buildWalker(false);

    parts.push({
        name: 'Eccentric Cam Walking Mechanism',
        description: 'Gigantic steel pontoon shoes coupled to eccentric cams and articulation pistons, enabling the million-pound dragline to step forward.',
        material: 'steel, chrome',
        function: 'Locomotion across rough, yielding mine terrain.',
        assemblyOrder: 5,
        connections: ['Slew Frame Deck'],
        failureEffect: 'Machine is stranded in place.',
        cascadeFailures: ['Articulation Pistons'],
        originalPosition: { x: 24, y: 16, z: 0 },
        explodedPosition: { x: 80, y: 10, z: 0 }
    });

    // =======================================================
    // 6. OPERATOR CABIN (HIGH TECH)
    // =======================================================
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(18, 14, 30);
    
    // Sleek geometric cabin
    const cabShape = new THREE.Shape();
    cabShape.moveTo(-4, -4);
    cabShape.lineTo(4, -4);
    cabShape.lineTo(5, 5);
    cabShape.lineTo(-5, 5);
    const cabGeo = new THREE.ExtrudeGeometry(cabShape, {depth: 8, bevelEnabled: true});
    const cabMesh = new THREE.Mesh(cabGeo, steel);
    cabMesh.rotation.y = Math.PI/2;
    cabinGroup.add(cabMesh);

    // Tinted faceted glass
    const glassGeo = new THREE.ConeGeometry(5, 6, 4);
    const glassMesh = new THREE.Mesh(glassGeo, tinted);
    glassMesh.rotation.x = Math.PI/2;
    glassMesh.rotation.y = Math.PI/4;
    glassMesh.position.set(0, 1, 6);
    cabinGroup.add(glassMesh);

    // Interior console screens
    for(let i=0; i<3; i++) {
        const screen = new THREE.Mesh(new THREE.PlaneGeometry(2, 1.5), neonBlue);
        screen.position.set(-2 + i*2, 0, 4);
        screen.rotation.x = -Math.PI/6;
        cabinGroup.add(screen);
    }
    
    // Joysticks
    const stickL = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1), chrome);
    stickL.position.set(-1, -1, 3);
    stickL.rotation.x = Math.PI/4;
    const stickR = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1), chrome);
    stickR.position.set(1, -1, 3);
    stickR.rotation.x = Math.PI/4;
    cabinGroup.add(stickL, stickR);

    rotatingGroup.add(cabinGroup);

    parts.push({
        name: 'Advanced Operator Cabin',
        description: 'Cantilevered command center featuring tinted ballistic glass, holographic control interfaces, and dual-joystick hydraulic linkages.',
        material: 'steel, tinted glass, neonBlue',
        function: 'Provides the human interface for complex digging cycles.',
        assemblyOrder: 6,
        connections: ['Slew Frame Deck'],
        failureEffect: 'Total loss of operator control.',
        cascadeFailures: [],
        originalPosition: { x: 18, y: 20, z: 30 },
        explodedPosition: { x: 50, y: 30, z: 80 }
    });

    // =======================================================
    // 7. A-FRAME / GANTRY (LATTICE STRUCTURE)
    // =======================================================
    const gantryGroup = new THREE.Group();
    gantryGroup.position.set(0, 24, -10);

    const legPoints = [
        {x: -12, z: 10, rx: -0.3, rz: -0.2},
        {x: 12, z: 10, rx: -0.3, rz: 0.2},
        {x: -18, z: -15, rx: 0.4, rz: -0.3},
        {x: 18, z: -15, rx: 0.4, rz: 0.3}
    ];
    
    const gantryLegGeo = new THREE.CylinderGeometry(1.5, 2, 45, 16);
    legPoints.forEach(lp => {
        const leg = new THREE.Mesh(gantryLegGeo, darkSteel);
        leg.position.set(lp.x, 15, lp.z);
        leg.rotation.x = lp.rx;
        leg.rotation.z = lp.rz;
        gantryGroup.add(leg);
        
        // Add climbing ladders to each leg
        for(let i=0; i<15; i++) {
            const rung = new THREE.Mesh(new THREE.BoxGeometry(2, 0.2, 0.2), safetyYellow);
            rung.position.set(0, -20 + i*2.5, 2);
            leg.add(rung);
        }
    });

    // Heavy apex block
    const apexGeo = new THREE.BoxGeometry(10, 6, 8);
    const apexMesh = new THREE.Mesh(apexGeo, steel);
    apexMesh.position.set(0, 35, 0);
    gantryGroup.add(apexMesh);
    
    // Warning lights on apex
    const warnLight = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 16), neonRed);
    warnLight.position.set(0, 39, 0);
    gantryGroup.add(warnLight);

    rotatingGroup.add(gantryGroup);

    parts.push({
        name: 'Main A-Frame Gantry',
        description: 'Towering four-legged structural apex heavily braced to carry the massive tension from boom suspension cables.',
        material: 'darkSteel, safetyYellow',
        function: 'Anchors the boom suspension cables.',
        assemblyOrder: 7,
        connections: ['Slew Frame Deck', 'Suspension Cables'],
        failureEffect: 'Immediate catastrophic collapse of the boom structure.',
        cascadeFailures: ['Boom', 'Cables', 'Bucket'],
        originalPosition: { x: 0, y: 59, z: -10 },
        explodedPosition: { x: 0, y: 120, z: -40 }
    });

    // =======================================================
    // 8. MASSIVE LATTICE BOOM
    // =======================================================
    const boomGroup = new THREE.Group();
    boomGroup.position.set(0, 6, 32); // Pivot point at front
    const boomLength = 150;
    const boomSections = 20; // Massive detail
    const sectionLength = boomLength / boomSections;

    // Chords (4 main corner pipes) tapering towards the end
    const chordGeo = new THREE.CylinderGeometry(1.5, 2.5, boomLength, 16);
    chordGeo.translate(0, boomLength/2, 0);
    
    const chords = [];
    const chordOffsets = [
        {x: -6, z: -6, sx: -1, sz: -1},
        {x: 6, z: -6, sx: 1, sz: -1},
        {x: -6, z: 6, sx: -1, sz: 1},
        {x: 6, z: 6, sx: 1, sz: 1}
    ];

    chordOffsets.forEach(co => {
        const chord = new THREE.Mesh(chordGeo, darkSteel);
        // Taper effect achieved by rotating slightly inwards
        chord.position.set(co.x, 0, co.z);
        chord.rotation.x = co.sz * 0.02;
        chord.rotation.z = co.sx * -0.02;
        boomGroup.add(chord);
        chords.push(chord);
    });

    // Detailed Lacing Network
    const lacingRadius = 0.5;
    for(let i=0; i<boomSections; i++) {
        const yStart = i * sectionLength;
        const yEnd = (i+1) * sectionLength;
        // Tapered widths
        const wStart = 12 - (i * (8/boomSections));
        const wEnd = 12 - ((i+1) * (8/boomSections));
        const hwS = wStart/2;
        const hwE = wEnd/2;

        const faces = [
            [{x1: -hwS, z1: -hwS}, {x2: hwE, z2: -hwE}], // Front diag
            [{x1: hwS, z1: -hwS}, {x2: -hwE, z2: -hwE}],
            [{x1: hwS, z1: -hwS}, {x2: hwE, z2: hwE}], // Right diag
            [{x1: hwS, z1: hwS}, {x2: hwE, z2: -hwE}],
            [{x1: hwS, z1: hwS}, {x2: -hwE, z2: hwE}], // Back diag
            [{x1: -hwS, z1: hwS}, {x2: hwE, z2: hwE}],
            [{x1: -hwS, z1: hwS}, {x2: -hwE, z2: -hwE}], // Left diag
            [{x1: -hwS, z1: -hwS}, {x2: -hwE, z2: hwE}]
        ];

        faces.forEach(f => {
            const p1 = new THREE.Vector3(f.x1, yStart, f.z1);
            const p2 = new THREE.Vector3(f.x2, yEnd, f.z2);
            const dist = p1.distanceTo(p2);
            const lacing = new THREE.Mesh(new THREE.CylinderGeometry(lacingRadius, lacingRadius, dist, 8), steel);
            const mid = p1.clone().lerp(p2, 0.5);
            lacing.position.copy(mid);
            const dir = p2.clone().sub(p1).normalize();
            lacing.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), dir);
            boomGroup.add(lacing);
        });

        // Horizontal braces
        const hFaces = [
            {x1: -hwE, z1: -hwE, x2: hwE, z2: -hwE},
            {x1: hwE, z1: -hwE, x2: hwE, z2: hwE},
            {x1: hwE, z1: hwE, x2: -hwE, z2: hwE},
            {x1: -hwE, z1: hwE, x2: -hwE, z2: -hwE}
        ];
        hFaces.forEach(hf => {
            const dist = wEnd;
            const brace = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, dist, 8), steel);
            brace.position.set((hf.x1+hf.x2)/2, yEnd, (hf.z1+hf.z2)/2);
            const dir = new THREE.Vector3(hf.x2-hf.x1, 0, hf.z2-hf.z1).normalize();
            brace.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), dir);
            boomGroup.add(brace);
        });
    }

    // Boom point massive sheaves
    const boomPointGroup = new THREE.Group();
    boomPointGroup.position.set(0, boomLength, 0);
    const sheaveRadius = 4;
    const boomSheave1 = new THREE.Mesh(new THREE.CylinderGeometry(sheaveRadius, sheaveRadius, 1.5, 32), chrome);
    boomSheave1.rotation.z = Math.PI/2;
    boomSheave1.position.set(-3, 0, 0);
    const boomSheave2 = new THREE.Mesh(new THREE.CylinderGeometry(sheaveRadius, sheaveRadius, 1.5, 32), chrome);
    boomSheave2.rotation.z = Math.PI/2;
    boomSheave2.position.set(3, 0, 0);
    boomPointGroup.add(boomSheave1, boomSheave2);
    
    // Hydraulic lines running up the boom
    const linePoints = [];
    for(let i=0; i<=boomSections; i++) {
        linePoints.push(new THREE.Vector3(-4, i*sectionLength, 4));
    }
    const boomHydraulics = createHydraulicLine(linePoints, 0.3);
    boomGroup.add(boomHydraulics);

    boomGroup.add(boomPointGroup);
    const defaultBoomAngle = Math.PI / 4.5;
    boomGroup.rotation.x = defaultBoomAngle;
    rotatingGroup.add(boomGroup);

    parts.push({
        name: 'Colossal Lattice Boom',
        description: 'Over 150 meters of complex, dynamically tapered tubular lattice, featuring thousands of welded joints and integrated hydraulic routing.',
        material: 'darkSteel, steel',
        function: 'Provides extreme reach and clearance for dumping operations.',
        assemblyOrder: 8,
        connections: ['Slew Frame Deck', 'Suspension Cables', 'Hoist Ropes'],
        failureEffect: 'Total structural buckling, lethal drop of payload.',
        cascadeFailures: ['Hoist Ropes', 'Suspension Cables'],
        originalPosition: { x: 0, y: 70, z: 80 },
        explodedPosition: { x: 0, y: 150, z: 180 }
    });

    // =======================================================
    // 9. SUSPENSION CABLES
    // =======================================================
    const suspGroup = new THREE.Group();
    rotatingGroup.add(suspGroup);
    
    const suspCableL = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1, 16), darkSteel);
    const suspCableR = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1, 16), darkSteel);
    // Add massive tensioners (turnbuckles)
    const turnbuckleGeo = new THREE.CylinderGeometry(1.5, 1.5, 8, 16);
    const tbL = new THREE.Mesh(turnbuckleGeo, chrome);
    const tbR = new THREE.Mesh(turnbuckleGeo, chrome);
    suspGroup.add(suspCableL, suspCableR, tbL, tbR);

    function updateSuspension() {
        const apexPos = new THREE.Vector3(0, 59, -10); // World relative to rotating
        const pointPos = new THREE.Vector3(0, boomLength, 0).applyEuler(new THREE.Euler(defaultBoomAngle,0,0)).add(boomGroup.position);
        
        const dist = apexPos.distanceTo(pointPos);
        const dir = new THREE.Vector3().subVectors(pointPos, apexPos).normalize();
        
        suspCableL.scale.set(1, dist, 1);
        suspCableL.position.copy(apexPos).add(pointPos).multiplyScalar(0.5);
        suspCableL.position.x = -5;
        suspCableL.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), dir);
        
        tbL.position.copy(apexPos).add(dir.clone().multiplyScalar(dist * 0.2));
        tbL.position.x = -5;
        tbL.quaternion.copy(suspCableL.quaternion);

        suspCableR.scale.set(1, dist, 1);
        suspCableR.position.copy(apexPos).add(pointPos).multiplyScalar(0.5);
        suspCableR.position.x = 5;
        suspCableR.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), dir);

        tbR.position.copy(apexPos).add(dir.clone().multiplyScalar(dist * 0.2));
        tbR.position.x = 5;
        tbR.quaternion.copy(suspCableR.quaternion);
    }
    updateSuspension();

    parts.push({
        name: 'Boom Suspension & Tensioners',
        description: 'Multi-strand heavy steel wire ropes fitted with massive chromium turnbuckles to precisely tune boom geometry.',
        material: 'darkSteel, chrome',
        function: 'Counteracts the bending moment of the massive boom.',
        assemblyOrder: 9,
        connections: ['Gantry', 'Lattice Boom'],
        failureEffect: 'Boom drops.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 80, z: 40 },
        explodedPosition: { x: 0, y: 180, z: 50 }
    });

    // =======================================================
    // 10. MASSIVE DRAG BUCKET WITH TORUS CHAINS
    // =======================================================
    const bucketGroup = new THREE.Group();
    
    // Extrude massive bucket profile
    const bucketShape = new THREE.Shape();
    bucketShape.moveTo(0, 0);
    bucketShape.lineTo(15, 0);
    bucketShape.lineTo(20, 10);
    bucketShape.lineTo(18, 16);
    bucketShape.lineTo(-2, 16);
    bucketShape.lineTo(-5, 8);
    bucketShape.lineTo(0, 0);
    const bExt = { depth: 18, bevelEnabled: true, bevelThickness: 1, bevelSize: 1 };
    const bucketBody = new THREE.Mesh(new THREE.ExtrudeGeometry(bucketShape, bExt), darkSteel);
    bucketBody.position.set(-9, -8, -5);
    bucketBody.rotation.y = Math.PI/2;
    bucketGroup.add(bucketBody);

    // Hardened teeth
    for(let i=0; i<6; i++) {
        const tooth = new THREE.Mesh(new THREE.ConeGeometry(1.5, 6, 8), chrome);
        tooth.position.set(-7.5 + i*3, -8, 10);
        tooth.rotation.x = Math.PI/2;
        bucketGroup.add(tooth);
    }

    // Arch for hoist chain attachment
    const archGeo = new THREE.TorusGeometry(8, 1.2, 16, 32, Math.PI);
    const arch = new THREE.Mesh(archGeo, steel);
    arch.position.set(0, 8, 2);
    arch.rotation.y = Math.PI/2;
    bucketGroup.add(arch);

    // Realistic Torus Chains for Drag
    function createChain(linkCount, length, radius) {
        const chainGrp = new THREE.Group();
        const linkSpacing = length / linkCount;
        for(let i=0; i<linkCount; i++) {
            const link = new THREE.Mesh(new THREE.TorusGeometry(radius, radius*0.3, 16, 32), steel);
            link.position.y = i * linkSpacing;
            link.scale.set(1, 1.5, 1);
            if(i % 2 !== 0) link.rotation.y = Math.PI/2;
            chainGrp.add(link);
        }
        return chainGrp;
    }
    
    const dragChainL = createChain(12, 15, 1.2);
    dragChainL.position.set(-8, -5, 12);
    dragChainL.rotation.x = Math.PI/2;
    dragChainL.rotation.z = Math.PI/8;
    const dragChainR = createChain(12, 15, 1.2);
    dragChainR.position.set(8, -5, 12);
    dragChainR.rotation.x = Math.PI/2;
    dragChainR.rotation.z = -Math.PI/8;
    bucketGroup.add(dragChainL, dragChainR);

    // Glowing payload sensor in bucket
    const sensor = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 16), neonRed);
    sensor.position.set(0, 0, -2);
    bucketGroup.add(sensor);

    rotatingGroup.add(bucketGroup);

    parts.push({
        name: 'High-Capacity Drag Bucket',
        description: 'A 100-cubic-yard scoop featuring hardened chromium teeth, massive structural arches, and realistic interlocking torus drag chains.',
        material: 'darkSteel, chrome',
        function: 'Excavates and transports payload.',
        assemblyOrder: 10,
        connections: ['Hoist Ropes', 'Drag Ropes'],
        failureEffect: 'Inability to dig, catastrophic production halt.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: -20, z: 120 },
        explodedPosition: { x: 0, y: -60, z: 180 }
    });

    // =======================================================
    // 11. WINCHES & WIRE ROPES
    // =======================================================
    const winchDrumGeo = new THREE.CylinderGeometry(5, 5, 12, 64);
    
    const hoistWinchGrp = new THREE.Group();
    hoistWinchGrp.position.set(0, 16, -10);
    const hoistDrum = new THREE.Mesh(winchDrumGeo, steel);
    hoistDrum.rotation.z = Math.PI/2;
    // Spooled cable texture effect
    for(let i=0; i<20; i++) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(5.05, 0.2, 8, 32), darkSteel);
        ring.position.x = -5 + i*0.5;
        ring.rotation.y = Math.PI/2;
        hoistWinchGrp.add(ring);
    }
    hoistWinchGrp.add(hoistDrum);

    const dragWinchGrp = new THREE.Group();
    dragWinchGrp.position.set(0, 16, 10);
    const dragDrum = new THREE.Mesh(winchDrumGeo, steel);
    dragDrum.rotation.z = Math.PI/2;
    for(let i=0; i<20; i++) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(5.05, 0.2, 8, 32), darkSteel);
        ring.position.x = -5 + i*0.5;
        ring.rotation.y = Math.PI/2;
        dragWinchGrp.add(ring);
    }
    dragWinchGrp.add(dragDrum);

    rotatingGroup.add(hoistWinchGrp, dragWinchGrp);

    // Fairlead (Swiveling guide for drag rope)
    const fairleadGrp = new THREE.Group();
    fairleadGrp.position.set(0, 10, 32);
    const flHousing = new THREE.Mesh(new THREE.BoxGeometry(8, 8, 6), darkSteel);
    const flSheave = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 2, 32), chrome);
    flSheave.rotation.z = Math.PI/2;
    flSheave.position.set(0, 0, 3);
    fairleadGrp.add(flHousing, flSheave);
    rotatingGroup.add(fairleadGrp);

    // Active Ropes
    const ropeGeo = new THREE.CylinderGeometry(0.4, 0.4, 1, 16);
    const hoistRope = new THREE.Mesh(ropeGeo, steel);
    const dragRope = new THREE.Mesh(ropeGeo, steel);
    rotatingGroup.add(hoistRope, dragRope);

    parts.push({
        name: 'Dual Drum Winches & Active Rigging',
        description: 'Immense motorized winch drums guiding multi-layer spooled wire ropes through precision fairleads and boom point sheaves.',
        material: 'steel, darkSteel',
        function: 'Transmits hauling and lifting force to the bucket.',
        assemblyOrder: 11,
        connections: ['Machinery House', 'Bucket'],
        failureEffect: 'Bucket drops or gets stuck in earth.',
        cascadeFailures: ['Bucket'],
        originalPosition: { x: 0, y: 16, z: 0 },
        explodedPosition: { x: 0, y: 40, z: -20 }
    });

    const description = "The Massive Dragline Excavator is a hyper-realistic, highly complex titan of surface mining. Weighing millions of pounds, it utilizes a towering A-Frame and a 150-meter lattice boom woven from intricate tubular arrays. Driven by eccentric walking cams and massive hydraulic pistons, the machine steps across terrain, deploying its interlocking torus-chain drag bucket. Animated winches dynamically sync with lifting, dragging, swinging, and dumping cycles, all controlled from a cantilevered, neon-lit advanced cabin.";

    const quizQuestions = [
        {
            question: "What specific mechanism provides locomotion for this titan?",
            options: [
                "Only crawler tracks",
                "Eccentric walking cams with articulating pontoons",
                "High-speed rubber tires",
                "Magnetic levitation rails"
            ],
            correctAnswer: 1,
            explanation: "Draglines rely on massive eccentric walking cams and pontoon shoes to literally lift and step the enormous weight forward incrementally."
        },
        {
            question: "Why does the main boom feature a tapered, multi-tubular lattice design?",
            options: [
                "Aesthetic appeal",
                "To reduce radar cross-section",
                "To maximize rigidity and reach while dramatically minimizing weight and wind loads",
                "To house operators inside the tubes"
            ],
            correctAnswer: 2,
            explanation: "Lattice designs provide immense structural strength against bending moments while keeping the massive 150-meter boom light enough to be hoisted and minimizing wind resistance."
        },
        {
            question: "What is the function of the Fairlead assembly located at the front deck?",
            options: [
                "It serves as a counterweight",
                "It actively swivels to guide the drag rope cleanly onto the winch drum, preventing chafing",
                "It cools the diesel generators",
                "It locks the rotation of the tub"
            ],
            correctAnswer: 1,
            explanation: "The fairlead ensures that the drag rope is fed at optimal angles to the drag winch, preventing devastating wear to both the cable and the structural frame."
        },
        {
            question: "How are the enormous tension loads of the boom supported?",
            options: [
                "By hydraulic pistons underneath the boom",
                "By rigid steel beams welded to the tub",
                "By heavy steel wire ropes running from the A-Frame Gantry to the boom point",
                "By magnetic fields"
            ],
            correctAnswer: 2,
            explanation: "The A-Frame Gantry acts as a high anchor point, using massive suspension cables and tensioners to hold the boom in position."
        },
        {
            question: "During the digging phase, which winch does the vast majority of the work?",
            options: [
                "The Hoist Winch",
                "The Boom Suspension Winch",
                "The Drag Winch",
                "The Walking Winch"
            ],
            correctAnswer: 2,
            explanation: "The Drag Winch hauls the bucket powerfully towards the machine, scraping earth and filling the bucket, bearing the most extreme loads of the entire cycle."
        }
    ];

    let digTime = 0;
    
    function animate(time, speed, meshes) {
        if(!meshes) return;

        digTime += (0.0015 * speed);
        const cycle = digTime % 1.0;

        let swingAngle = 0;
        let bY = 0;
        let bZ = 0;
        let bPitch = 0;

        // Kinematic target points
        const pointAbs = new THREE.Vector3(0, boomLength, 0).applyEuler(new THREE.Euler(defaultBoomAngle,0,0)).add(boomGroup.position);
        const fairleadAbs = fairleadGrp.position.clone();

        // 5-Phase Dig Cycle
        if(cycle < 0.2) {
            // 1. Lowering bucket far out
            const t = cycle / 0.2;
            bZ = 60 + t * (pointAbs.z - 70);
            bY = pointAbs.y - (pointAbs.y - 5) * t;
            bPitch = Math.PI/6 * t;
        } else if(cycle < 0.4) {
            // 2. Dragging / Digging
            const t = (cycle - 0.2) / 0.2;
            bZ = pointAbs.z - 10 - t * 60; // drag inward
            bY = 5 - Math.sin(t * Math.PI) * 4; // dip into ground
            bPitch = Math.PI/6 - t * (Math.PI/4); // tilt back to hold load
        } else if(cycle < 0.6) {
            // 3. Hoisting up
            const t = (cycle - 0.4) / 0.2;
            bZ = (pointAbs.z - 70) + t * 20;
            bY = 5 + t * (pointAbs.y - 40);
            bPitch = -Math.PI/12; 
        } else if(cycle < 0.8) {
            // 4. Swing and Dump
            const t = (cycle - 0.6) / 0.2;
            const ease = (1 - Math.cos(t * Math.PI)) / 2;
            swingAngle = ease * (Math.PI * 0.7); // Swing 126 degrees
            
            bZ = (pointAbs.z - 50);
            bY = pointAbs.y - 35;
            
            if(t > 0.4) { // Dump payload
                const dumpT = (t - 0.4) / 0.6;
                bPitch = -Math.PI/12 - (Math.PI/2 * dumpT);
            }
        } else {
            // 5. Swing return
            const t = (cycle - 0.8) / 0.2;
            const ease = (1 - Math.cos(t * Math.PI)) / 2;
            swingAngle = (1 - ease) * (Math.PI * 0.7);
            
            bZ = (pointAbs.z - 50) - ease * (pointAbs.z - 110);
            bY = pointAbs.y - 35 - ease * (pointAbs.y - 40);
            bPitch = -Math.PI/12 - (Math.PI/2 * (1 - ease));
        }

        rotatingGroup.rotation.y = swingAngle;
        bucketGroup.position.set(0, bY, bZ);
        bucketGroup.rotation.x = bPitch;

        // Dynamic Rope updates
        const bHoistAttach = new THREE.Vector3(0, 16, 2).applyEuler(new THREE.Euler(bPitch,0,0)).add(bucketGroup.position);
        const hDist = pointAbs.distanceTo(bHoistAttach);
        const hDir = new THREE.Vector3().subVectors(bHoistAttach, pointAbs).normalize();
        hoistRope.scale.set(1, hDist, 1);
        hoistRope.position.copy(pointAbs).add(bHoistAttach).multiplyScalar(0.5);
        hoistRope.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), hDir);

        const bDragAttach = new THREE.Vector3(0, 0, 20).applyEuler(new THREE.Euler(bPitch,0,0)).add(bucketGroup.position);
        const dDist = fairleadAbs.distanceTo(bDragAttach);
        const dDir = new THREE.Vector3().subVectors(bDragAttach, fairleadAbs).normalize();
        dragRope.scale.set(1, dDist, 1);
        dragRope.position.copy(fairleadAbs).add(bDragAttach).multiplyScalar(0.5);
        dragRope.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), dDir);

        // Winch drums rotation mapping
        hoistWinchGrp.rotation.x = hDist * 0.2;
        dragWinchGrp.rotation.x = dDist * 0.2;

        // Walking mechanism animation
        const walkSpeed = time * 0.8 * speed;
        walkAnims.forEach(wa => {
            wa.camGroup.rotation.z = walkSpeed;
            // Linkage kinematics
            const s = Math.sin(walkSpeed);
            const c = Math.cos(walkSpeed);
            wa.legPivotWrapper.rotation.x = s * 0.15;
            wa.shoe.position.y = -18 + Math.max(0, c * 4);
            wa.shoe.position.z = s * 6;
            
            // Piston extension
            const pistonLen = wa.articulationPiston.length;
            wa.articulationPiston.rod.position.y = pistonLen * 0.5 + Math.abs(c)*2;
        });

        // Rotate boom sheaves
        boomSheave1.rotation.y = hDist * 0.5;
        boomSheave2.rotation.y = hDist * 0.5;
        flSheave.rotation.y = dDist * 0.5;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createDragline() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
