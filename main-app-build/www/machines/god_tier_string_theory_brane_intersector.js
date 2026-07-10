import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();

    // ==========================================
    // MATERIALS & SHADERS SETUP
    // ==========================================
    const emissiveCyan = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 2.5, wireframe: true, transparent: true, opacity: 0.8 });
    const emissiveMagenta = new THREE.MeshStandardMaterial({ color: 0xff00ff, emissive: 0xff00ff, emissiveIntensity: 2.5, wireframe: true, transparent: true, opacity: 0.8 });
    const plasmaMat = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00aaff, emissiveIntensity: 2, transparent: true, opacity: 0.8, side: THREE.DoubleSide, wireframe: false });
    const plasmaMat2 = new THREE.MeshStandardMaterial({ color: 0xff00ff, emissive: 0xaa00ff, emissiveIntensity: 2, transparent: true, opacity: 0.8, side: THREE.DoubleSide, wireframe: false });
    const stringMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 });
    
    // ==========================================
    // ANIMATION & STATE TRACKING ARRAYS
    // ==========================================
    const rotatingGears = [];
    const pushers = [];
    const wheels = [];
    
    // ==========================================
    // HELPER FUNCTIONS FOR COMPLEX GEOMETRIES
    // ==========================================

    // Generate Calabi-Yau approximation geometry by distorting an Icosahedron
    function createCalabiYauGeom() {
        const geom = new THREE.IcosahedronGeometry(2, 4);
        const pos = geom.attributes.position;
        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const y = pos.getY(i);
            const z = pos.getZ(i);
            const r = Math.sqrt(x*x + y*y + z*z);
            const theta = Math.acos(z/r);
            const phi = Math.atan2(y, x);
            // Apply complex harmonic distortions to simulate compactified dimensions
            const nr = r * (1 + 0.35 * Math.sin(5 * theta) * Math.cos(4 * phi) + 0.15 * Math.cos(7 * phi));
            pos.setXYZ(i, nr * Math.sin(theta) * Math.cos(phi), nr * Math.sin(theta) * Math.sin(phi), nr * Math.cos(theta));
        }
        geom.computeVertexNormals();
        return geom;
    }

    // Creates realistic connecting hoses/cables
    function createHose(p1, p2, ctrl1, ctrl2, material, radius = 0.2) {
        const curve = new THREE.CubicBezierCurve3(p1, ctrl1, ctrl2, p2);
        const geom = new THREE.TubeGeometry(curve, 32, radius, 8, false);
        return new THREE.Mesh(geom, material);
    }

    // Creates straight structural beams efficiently
    function createBeam(p1, p2, mat, radius = 0.2) {
        const distance = p1.distanceTo(p2);
        const geom = new THREE.CylinderGeometry(radius, radius, distance, 8);
        const mesh = new THREE.Mesh(geom, mat);
        mesh.position.copy(p1).add(p2).multiplyScalar(0.5);
        mesh.lookAt(p2);
        mesh.rotateX(Math.PI / 2);
        return mesh;
    }

    // ==========================================
    // MASSIVE TRANSPORT CHASSIS (LOWER DECK)
    // ==========================================
    const chassisGroup = new THREE.Group();
    chassisGroup.position.y = -60; 
    group.add(chassisGroup);

    // Main structural body with panel lines simulated via multiple geometries
    const chassisBody = new THREE.Mesh(new THREE.BoxGeometry(100, 10, 140), darkSteel);
    chassisGroup.add(chassisBody);
    
    // Add thousands of rivets to the top surface
    const rivetGeom = new THREE.SphereGeometry(0.2, 4, 4);
    const rivetMesh = new THREE.InstancedMesh(rivetGeom, chrome, 1000);
    let rivetIndex = 0;
    const dummy = new THREE.Object3D();
    for (let x = -48; x <= 48; x += 4) {
        for (let z = -68; z <= 68; z += 4) {
            if (Math.random() > 0.2 && rivetIndex < 1000) {
                dummy.position.set(x, 5.1, z);
                dummy.updateMatrix();
                rivetMesh.setMatrixAt(rivetIndex, dummy.matrix);
                rivetIndex++;
            }
        }
    }
    chassisGroup.add(rivetMesh);

    // Highly detailed tires with aggressive off-road lugs
    function createDetailedTire(radius, width, lugCount, material, rimMaterial) {
        const tireGroup = new THREE.Group();
        const tireBody = new THREE.Mesh(new THREE.TorusGeometry(radius, width/2, 32, 64), material);
        tireGroup.add(tireBody);
        
        // Treads (Lugs)
        const lugGeom = new THREE.BoxGeometry(width * 1.2, width/4, width/2);
        for (let i = 0; i < lugCount; i++) {
            const theta = (i / lugCount) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeom, material);
            const lx = Math.cos(theta) * (radius + width/2 - 0.2);
            const ly = Math.sin(theta) * (radius + width/2 - 0.2);
            lug.position.set(lx, ly, 0);
            lug.rotation.z = theta;
            
            // V-tread aggressive pattern
            if (i % 2 === 0) {
                lug.position.z = width/4;
                lug.rotation.y = Math.PI / 8;
            } else {
                lug.position.z = -width/4;
                lug.rotation.y = -Math.PI / 8;
            }
            tireGroup.add(lug);
        }
        
        // Complex Spoked Rim
        const rim = new THREE.Mesh(new THREE.CylinderGeometry(radius*0.6, radius*0.6, width*1.1, 32), rimMaterial);
        rim.rotation.x = Math.PI / 2;
        tireGroup.add(rim);
        
        for(let i=0; i<8; i++) {
            const theta = (i / 8) * Math.PI * 2;
            const spoke = new THREE.Mesh(new THREE.BoxGeometry(radius*1.2, width*0.8, 2), steel);
            spoke.rotation.z = theta;
            rim.add(spoke);
            
            const innerCyl = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, width*1.15, 16), chrome);
            innerCyl.position.set(Math.cos(theta)*radius*0.3, Math.sin(theta)*radius*0.3, 0);
            innerCyl.rotation.x = Math.PI / 2;
            rim.add(innerCyl);
        }
        
        const hub = new THREE.Mesh(new THREE.CylinderGeometry(radius*0.2, radius*0.2, width*1.3, 16), darkSteel);
        hub.rotation.x = Math.PI / 2;
        tireGroup.add(hub);
        
        return tireGroup;
    }

    // Mount 6 Massive Tires
    const wheelPositions = [
        { x: 55, y: 0, z: 50 }, { x: -55, y: 0, z: 50 },
        { x: 55, y: 0, z: -50 }, { x: -55, y: 0, z: -50 },
        { x: 55, y: 0, z: 0 }, { x: -55, y: 0, z: 0 }
    ];

    wheelPositions.forEach(pos => {
        const tire = createDetailedTire(12, 8, 48, rubber, aluminum);
        tire.position.set(pos.x, pos.y, pos.z);
        tire.rotation.y = Math.PI / 2; // Orient to roll along Z
        chassisGroup.add(tire);
        wheels.push(tire);
    });

    // Detailed Operator Cabin
    const cabin = new THREE.Group();
    cabin.position.set(0, 15, 60);
    chassisGroup.add(cabin);

    const cabinFrame = new THREE.Mesh(new THREE.BoxGeometry(20, 10, 15), darkSteel);
    cabin.add(cabinFrame);

    const windowFront = new THREE.Mesh(new THREE.PlaneGeometry(18, 8), tinted);
    windowFront.position.set(0, 0, 7.6);
    cabin.add(windowFront);

    const windowSide1 = new THREE.Mesh(new THREE.PlaneGeometry(13, 8), tinted);
    windowSide1.position.set(10.1, 0, 0);
    windowSide1.rotation.y = Math.PI / 2;
    cabin.add(windowSide1);

    const windowSide2 = new THREE.Mesh(new THREE.PlaneGeometry(13, 8), tinted);
    windowSide2.position.set(-10.1, 0, 0);
    windowSide2.rotation.y = -Math.PI / 2;
    cabin.add(windowSide2);

    // Interior controls
    const interior = new THREE.Group();
    interior.position.set(0, -3, 3);
    cabin.add(interior);

    const steeringWheel = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.2, 16, 32), plastic);
    steeringWheel.rotation.x = -Math.PI / 4;
    steeringWheel.position.set(-4, 0, 0);
    interior.add(steeringWheel);
    rotatingGears.push({ mesh: steeringWheel, speed: 0, axis: 'z', steer: true });

    const joystickBase = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.8, 1, 16), darkSteel);
    joystickBase.position.set(4, -1, 0);
    interior.add(joystickBase);

    const joystickStick = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2, 8), chrome);
    joystickStick.position.set(4, 0, 0);
    interior.add(joystickStick);
    rotatingGears.push({ mesh: joystickStick, speed: 0, axis: 'x', wobble: true });

    const joystickKnob = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), plastic);
    joystickKnob.position.set(4, 1, 0);
    interior.add(joystickKnob);
    
    // Screens
    const dashScreen = new THREE.Mesh(new THREE.PlaneGeometry(4, 2), emissiveCyan);
    dashScreen.position.set(0, 1.5, 3.5);
    dashScreen.rotation.x = -Math.PI / 6;
    interior.add(dashScreen);

    // Side Mirrors
    const mirrorLeft = new THREE.Mesh(new THREE.BoxGeometry(0.5, 3, 2), chrome);
    mirrorLeft.position.set(-11, 0, 5);
    cabin.add(mirrorLeft);
    const mirrorRight = new THREE.Mesh(new THREE.BoxGeometry(0.5, 3, 2), chrome);
    mirrorRight.position.set(11, 0, 5);
    cabin.add(mirrorRight);

    // Front Grilles
    const grille = new THREE.Group();
    grille.position.set(0, -2, 71);
    for(let i=-20; i<=20; i+=2) {
        const bar = new THREE.Mesh(new THREE.BoxGeometry(1, 8, 0.5), steel);
        bar.position.set(i, 0, 0);
        grille.add(bar);
    }
    chassisGroup.add(grille);

    // Access Ladders
    const ladder = new THREE.Group();
    ladder.position.set(-20, -5, 71);
    for(let i=-5; i<=5; i+=1.5) {
        const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 3, 8), aluminum);
        rung.position.set(0, i, 0);
        rung.rotation.z = Math.PI / 2;
        ladder.add(rung);
    }
    const rail1 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 12, 8), steel);
    rail1.position.set(-1.5, 0, 0);
    const rail2 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 12, 8), steel);
    rail2.position.set(1.5, 0, 0);
    ladder.add(rail1, rail2);
    chassisGroup.add(ladder);

    // Exhaust Stacks
    const exhaustGroup = new THREE.Group();
    for(let i=0; i<4; i++) {
        const xPos = i % 2 === 0 ? 30 : -30;
        const zPos = i > 1 ? 40 : -40;
        const stack = new THREE.Group();
        stack.position.set(xPos, 15, zPos);
        
        const baseCyl = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 2, 20, 16), darkSteel);
        stack.add(baseCyl);
        
        for(let f=0; f<4; f++) {
            const fin = new THREE.Mesh(new THREE.BoxGeometry(0.5, 18, 4), copper);
            fin.rotation.y = (f / 4) * Math.PI;
            stack.add(fin);
        }
        exhaustGroup.add(stack);
    }
    chassisGroup.add(exhaustGroup);

    // ==========================================
    // UPPER BRANE INTERSECTOR APPARATUS
    // ==========================================
    const intersectorGroup = new THREE.Group();
    intersectorGroup.position.y = 50;
    group.add(intersectorGroup);

    // Base Support Ring
    const baseSupport = new THREE.Mesh(new THREE.TorusGeometry(50, 4, 32, 64), darkSteel);
    baseSupport.rotation.x = Math.PI / 2;
    intersectorGroup.add(baseSupport);

    // Extensive Hydraulic Lines connecting Chassis to Intersector
    const chassisLines = new THREE.Group();
    for (let i = 0; i < 40; i++) {
        const p1 = new THREE.Vector3((Math.random()-0.5)*80, 5, (Math.random()-0.5)*100);
        const p2 = new THREE.Vector3((Math.random()-0.5)*90, 50, (Math.random()-0.5)*90);
        const cp1 = new THREE.Vector3(p1.x, p1.y + 30, p1.z);
        const cp2 = new THREE.Vector3(p2.x, p2.y - 30, p2.z);
        
        const mat = i % 3 === 0 ? rubber : (i % 3 === 1 ? copper : steel);
        const hose = createHose(p1, p2, cp1, cp2, mat, 0.4 + Math.random()*0.5);
        chassisLines.add(hose);
    }
    chassisGroup.add(chassisLines);

    // ==========================================
    // THE P-BRANES (D3-BRANES)
    // ==========================================
    // Using incredibly dense geometries for smooth undulation
    const braneAlphaGeom = new THREE.PlaneGeometry(80, 80, 150, 150);
    const braneOmegaGeom = new THREE.PlaneGeometry(80, 80, 150, 150);
    
    braneAlphaGeom.rotateX(-Math.PI / 2);
    braneOmegaGeom.rotateX(-Math.PI / 2);

    const braneAlpha = new THREE.Mesh(braneAlphaGeom, plasmaMat);
    const braneOmega = new THREE.Mesh(braneOmegaGeom, plasmaMat2);
    
    intersectorGroup.add(braneAlpha);
    intersectorGroup.add(braneOmega);

    // ==========================================
    // HYDRAULIC BRANE PRESSES (MACRO-RAMS)
    // ==========================================
    const hydraulicGroup = new THREE.Group();
    
    // Top and Bottom pushers
    for (let side = -1; side <= 1; side += 2) {
        for (let r = 0; r < 6; r++) {
            const angle = (r / 6) * Math.PI * 2;
            const x = Math.cos(angle) * 35;
            const z = Math.sin(angle) * 35;
            
            const housing = new THREE.Group();
            housing.position.set(x, side * 35, z);
            
            // Outer Cylinder
            const outer = new THREE.Mesh(new THREE.CylinderGeometry(4, 5, 20, 16), steel);
            housing.add(outer);
            
            // Piston Rod
            const piston = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 25, 16), chrome);
            piston.position.set(0, side * -12.5, 0);
            
            // Press Head (connects to brane field)
            const head = new THREE.Mesh(new THREE.BoxGeometry(10, 2, 10), darkSteel);
            head.position.set(0, side * -12.5, 0);
            
            piston.add(head);
            housing.add(piston);
            hydraulicGroup.add(housing);
            
            // Register for animation sync
            pushers.push({ piston: piston, side: side, basePistonY: side * -12.5 });
        }
    }
    intersectorGroup.add(hydraulicGroup);

    // ==========================================
    // CALABI-YAU MANIFOLD STABILIZERS
    // ==========================================
    const pillars = new THREE.Group();
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const px = Math.cos(angle) * 60;
        const pz = Math.sin(angle) * 60;
        
        const pillarGrp = new THREE.Group();
        pillarGrp.position.set(px, 0, pz);
        
        // Main structural shaft
        const shaft = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 100, 16), darkSteel);
        pillarGrp.add(shaft);
        
        // Glowing containment rings
        for (let j = -40; j <= 40; j += 20) {
            const ring = new THREE.Mesh(new THREE.TorusGeometry(4, 0.6, 16, 32), emissiveCyan);
            ring.position.y = j;
            ring.rotation.x = Math.PI / 2;
            pillarGrp.add(ring);
            rotatingGears.push({ mesh: ring, speed: (j%40===0?2:-2), axis: 'z' });
        }
        
        // Complex folded geometry (Calabi-Yau approximation)
        const cyTop = new THREE.Mesh(createCalabiYauGeom(), emissiveMagenta);
        cyTop.position.y = 55;
        cyTop.scale.set(2, 2, 2);
        pillarGrp.add(cyTop);
        
        const cyBot = new THREE.Mesh(createCalabiYauGeom(), emissiveMagenta);
        cyBot.position.y = -55;
        cyBot.scale.set(2, 2, 2);
        pillarGrp.add(cyBot);
        
        // Connectors to core
        pillars.add(createBeam(new THREE.Vector3(px, 45, pz), new THREE.Vector3(0, 45, 0), steel, 1.0));
        pillars.add(createBeam(new THREE.Vector3(px, -45, pz), new THREE.Vector3(0, -45, 0), steel, 1.0));
        
        // Structural Bracing between pillars
        if (i > 0) {
            const prevAngle = ((i - 1) / 12) * Math.PI * 2;
            const prevPx = Math.cos(prevAngle) * 60;
            const prevPz = Math.sin(prevAngle) * 60;
            pillars.add(createBeam(new THREE.Vector3(px, 35, pz), new THREE.Vector3(prevPx, 35, prevPz), aluminum, 0.8));
            pillars.add(createBeam(new THREE.Vector3(px, -35, pz), new THREE.Vector3(prevPx, -35, prevPz), aluminum, 0.8));
            pillars.add(createBeam(new THREE.Vector3(px, 35, pz), new THREE.Vector3(prevPx, -35, prevPz), aluminum, 0.4));
            pillars.add(createBeam(new THREE.Vector3(px, -35, pz), new THREE.Vector3(prevPx, 35, prevPz), aluminum, 0.4));
        }
        
        pillars.add(pillarGrp);
        rotatingGears.push({ mesh: cyTop, speed: 1.5, axis: 'y' });
        rotatingGears.push({ mesh: cyBot, speed: -1.5, axis: 'y' });
    }
    // Close the loop
    const pPrevPx = Math.cos((11 / 12) * Math.PI * 2) * 60;
    const pPrevPz = Math.sin((11 / 12) * Math.PI * 2) * 60;
    const p0Px = Math.cos(0) * 60;
    const p0Pz = Math.sin(0) * 60;
    pillars.add(createBeam(new THREE.Vector3(p0Px, 35, p0Pz), new THREE.Vector3(pPrevPx, 35, pPrevPz), aluminum, 0.8));
    pillars.add(createBeam(new THREE.Vector3(p0Px, -35, p0Pz), new THREE.Vector3(pPrevPx, -35, pPrevPz), aluminum, 0.8));
    pillars.add(createBeam(new THREE.Vector3(p0Px, 35, p0Pz), new THREE.Vector3(pPrevPx, -35, pPrevPz), aluminum, 0.4));
    pillars.add(createBeam(new THREE.Vector3(p0Px, -35, p0Pz), new THREE.Vector3(pPrevPx, 35, pPrevPz), aluminum, 0.4));
    
    intersectorGroup.add(pillars);

    // ==========================================
    // NEVEU-SCHWARZ FLUX GENERATORS (INNER RINGS)
    // ==========================================
    const ringsGroup = new THREE.Group();
    for(let i=0; i<8; i++) {
        const radius = 25 + i * 3;
        const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 1.2, 32, 100), i % 2 === 0 ? chrome : copper);
        const pivot = new THREE.Group();
        pivot.add(ring);
        pivot.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, 0);
        ringsGroup.add(pivot);
        rotatingGears.push({ mesh: pivot, speed: (Math.random() - 0.5) * 1.5, axis: ['x','y','z'][i%3] });
    }
    intersectorGroup.add(ringsGroup);

    // ==========================================
    // PARTICLE SYSTEM: FUNDAMENTAL STRINGS
    // ==========================================
    const stringCount = 6000;
    const stringPositions = new Float32Array(stringCount * 6); // 2 vertices per string segment
    const stringVelocities = [];
    const activeStrings = new Array(stringCount).fill(false);
    
    for (let i = 0; i < stringCount; i++) {
        stringPositions[i * 6] = 0; stringPositions[i * 6 + 1] = 0; stringPositions[i * 6 + 2] = 0;
        stringPositions[i * 6 + 3] = 0; stringPositions[i * 6 + 4] = 0; stringPositions[i * 6 + 5] = 0;
        stringVelocities.push({ vx: 0, vy: 0, vz: 0, life: 0 });
    }
    
    const stringGeom = new THREE.BufferGeometry();
    stringGeom.setAttribute('position', new THREE.BufferAttribute(stringPositions, 3));
    const stringField = new THREE.LineSegments(stringGeom, stringMaterial);
    intersectorGroup.add(stringField);

    // ==========================================
    // EXPORTED MACHINE METADATA
    // ==========================================
    const parts = [
        {
            name: "P-Brane Alpha (D3-Brane)",
            description: "A three-dimensional spatial hypersurface constructed from exotic matter, serving as the upper boundary for the Ekpyrotic collision sequence.",
            material: "Hyper-excited Cyan Plasma",
            function: "Provides the interaction surface for open string attachment.",
            assemblyOrder: 1,
            connections: ["Upper Macro-Rams", "Dilaton Emitters"],
            failureEffect: "Spontaneous uncompactification of macro dimensions causing local false vacuum collapse.",
            cascadeFailures: ["Tachyon Condensation Chamber", "BPS State Preserver"],
            originalPosition: { x: 0, y: 70, z: 0 },
            explodedPosition: { x: 0, y: 150, z: 0 }
        },
        {
            name: "P-Brane Omega (Anti D3-Brane)",
            description: "The mirrored anti-brane counterpart, heavily saturated with negative Ramond-Ramond charge.",
            material: "Hyper-excited Magenta Plasma",
            function: "Collides with Brane Alpha to simulate the Big Bang scenario.",
            assemblyOrder: 2,
            connections: ["Lower Macro-Rams"],
            failureEffect: "Instantaneous tachyon runaway leading to premature annihilation.",
            cascadeFailures: ["String Coupling Tuner"],
            originalPosition: { x: 0, y: 30, z: 0 },
            explodedPosition: { x: 0, y: -50, z: 0 }
        },
        {
            name: "Calabi-Yau Manifold Stabilizers (x12)",
            description: "Intricate folding engines that maintain the 6 extra spatial dimensions in a compactified state (radius < 10^-33 cm).",
            material: "Emissive Magenta / Steel",
            function: "Prevents higher-dimensional leakage during the collision event.",
            assemblyOrder: 3,
            connections: ["Base Support Ring"],
            failureEffect: "Laws of physics alter randomly within a 5-mile radius.",
            cascadeFailures: ["Kaluza-Klein Compactifier"],
            originalPosition: { x: 60, y: 50, z: 0 },
            explodedPosition: { x: 120, y: 50, z: 0 }
        },
        {
            name: "Neveu-Schwarz Flux Generators",
            description: "Gimballed rings projecting B-fields into the bulk hyperspace.",
            material: "Chrome / Copper",
            function: "Stabilizes the string coupling constant.",
            assemblyOrder: 4,
            connections: ["Intersector Core"],
            failureEffect: "Strings snap, releasing pure gravitational waves.",
            cascadeFailures: ["Supergravity Lens"],
            originalPosition: { x: 0, y: 50, z: 0 },
            explodedPosition: { x: 0, y: 50, z: 100 }
        },
        {
            name: "Hydraulic Macro-Rams",
            description: "Colossal pistons utilizing compressed degenerate matter to physically force the branes against their natural repulsion.",
            material: "Chrome / Dark Steel",
            function: "Drives the branes into physical contact.",
            assemblyOrder: 5,
            connections: ["Brane Alpha", "Brane Omega"],
            failureEffect: "Failure to reach collision threshold; fizzled Big Bang.",
            cascadeFailures: ["Ekpyrotic Initiator"],
            originalPosition: { x: 0, y: 85, z: 0 },
            explodedPosition: { x: 0, y: 200, z: 0 }
        },
        {
            name: "Off-Road Transport Chassis",
            description: "A colossal tracked platform allowing the entire Intersector to be driven to seismically stable collision zones.",
            material: "Dark Steel / Rivets",
            function: "Mobility and foundational support.",
            assemblyOrder: 6,
            connections: ["Base Support Ring", "Tires", "Cabin"],
            failureEffect: "Immobility and structural collapse.",
            cascadeFailures: ["All systems"],
            originalPosition: { x: 0, y: -60, z: 0 },
            explodedPosition: { x: 0, y: -100, z: 0 }
        },
        {
            name: "V-Tread Macro Tires (x6)",
            description: "Massive rubber tires with aggressive off-road lugs and complex spoked aluminum rims.",
            material: "Rubber / Aluminum",
            function: "Transmits the sheer weight of the apparatus to the ground.",
            assemblyOrder: 7,
            connections: ["Chassis Axles"],
            failureEffect: "Immobility, chassis tilt causing beam misalignment.",
            cascadeFailures: ["Chassis"],
            originalPosition: { x: 55, y: -60, z: 50 },
            explodedPosition: { x: 150, y: -60, z: 150 }
        },
        {
            name: "Operator Command Cabin",
            description: "Pressurized, radiation-shielded control room with tinted windows and manual joysticks.",
            material: "Steel / Tinted Glass / Plastic",
            function: "Houses the chief physicist to manually override the tachyon fields if necessary.",
            assemblyOrder: 8,
            connections: ["Chassis"],
            failureEffect: "Loss of manual control.",
            cascadeFailures: ["None"],
            originalPosition: { x: 0, y: -45, z: 60 },
            explodedPosition: { x: 0, y: 0, z: 120 }
        },
        { name: "Graviton Conduit", description: "Channels closed strings.", material: "Glass", function: "Gravity manipulation", assemblyOrder: 9, connections: [], failureEffect: "Zero-G", cascadeFailures: [], originalPosition: {x:0,y:0,z:0}, explodedPosition: {x:10,y:0,z:0} },
        { name: "Tachyon Condensation Chamber", description: "Harvests tachyons.", material: "Steel", function: "Energy buffering", assemblyOrder: 10, connections: [], failureEffect: "Time inversion", cascadeFailures: [], originalPosition: {x:0,y:0,z:0}, explodedPosition: {x:10,y:0,z:0} },
        { name: "Bulk Hyperspace Modulator", description: "Tunes 5D bulk.", material: "Copper", function: "Spatial folding", assemblyOrder: 11, connections: [], failureEffect: "Spaghettification", cascadeFailures: [], originalPosition: {x:0,y:0,z:0}, explodedPosition: {x:10,y:0,z:0} },
        { name: "Ekpyrotic Initiator", description: "Triggers the collision phase.", material: "Chrome", function: "Timing", assemblyOrder: 12, connections: [], failureEffect: "Missed collision", cascadeFailures: [], originalPosition: {x:0,y:0,z:0}, explodedPosition: {x:10,y:0,z:0} },
        { name: "String Coupling Tuner", description: "Adjusts gs.", material: "Dark Steel", function: "Physics tuning", assemblyOrder: 13, connections: [], failureEffect: "Weak forces", cascadeFailures: [], originalPosition: {x:0,y:0,z:0}, explodedPosition: {x:10,y:0,z:0} },
        { name: "Supergravity Lens", description: "Focuses SUGRA waves.", material: "Glass", function: "Observation", assemblyOrder: 14, connections: [], failureEffect: "Blindness", cascadeFailures: [], originalPosition: {x:0,y:0,z:0}, explodedPosition: {x:10,y:0,z:0} },
        { name: "Heterotic String Sorter", description: "Filters SO(32) strings.", material: "Aluminum", function: "Purification", assemblyOrder: 15, connections: [], failureEffect: "Impure particles", cascadeFailures: [], originalPosition: {x:0,y:0,z:0}, explodedPosition: {x:10,y:0,z:0} },
        { name: "BPS State Preserver", description: "Maintains SUSY states.", material: "Plastic", function: "Safety", assemblyOrder: 16, connections: [], failureEffect: "SUSY breaking", cascadeFailures: [], originalPosition: {x:0,y:0,z:0}, explodedPosition: {x:10,y:0,z:0} }
    ];

    const description = `The God-Tier String Theory Brane Intersector is a monumental, highly realistic mobile research apparatus. Mounted on a colossal off-road transport chassis complete with aggressive V-tread tires, grilles, operator cabins, and extensive hydraulic routing, it is designed to physically simulate the Ekpyrotic universe model. 
    
    By utilizing macro-scale hydraulic rams, it forces two massive, undulating D3-Branes into direct physical contact. The ensuing collision triggers massive tachyon condensation, culminating in a microscopic 'Big Bang' that spews thousands of fundamental strings into the bulk hyperspace. Twelve intricately folded Calabi-Yau stabilizers prevent local spacetime from spontaneously compactifying during the extreme energy release.`;

    const quizQuestions = [
        {
            question: "In the Ekpyrotic model, what is the primary cosmological consequence of the collision between two boundary BPS branes?",
            options: [
                "The cessation of universal expansion.",
                "The generation of a hot big bang with scale-invariant density perturbations.",
                "The decay of the proton.",
                "The compactification of 3D space."
            ],
            correctAnswer: 1,
            explanation: "The Ekpyrotic model proposes our universe's Big Bang was caused by colliding branes, converting kinetic energy into matter/radiation and generating density perturbations without inflation."
        },
        {
            question: "Which p-form gauge field does a D-brane natively couple to in string theory?",
            options: [
                "The Kalb-Ramond B-field",
                "The Graviton tensor field",
                "The Ramond-Ramond (R-R) field",
                "The Dilaton scalar field"
            ],
            correctAnswer: 2,
            explanation: "D-branes carry charge under Ramond-Ramond (R-R) gauge fields, which arise from the closed string sector."
        },
        {
            question: "During a D-brane and anti-D-brane collision, what does the resulting tachyon condensation signify physically?",
            options: [
                "Mutual annihilation leaving the closed string vacuum.",
                "Fusion into an M-brane.",
                "Infinite mass stabilization.",
                "Emission of CP-violating axions."
            ],
            correctAnswer: 0,
            explanation: "Sen's conjecture states that tachyon condensation signals instability; as it rolls to its potential minimum, the branes annihilate into the closed string vacuum."
        },
        {
            question: "According to the AdS/CFT correspondence, quantum gravity in AdS space is dual to what theory on its boundary?",
            options: [
                "Topological string theory",
                "A Conformal Field Theory (CFT)",
                "Einstein-Maxwell theory",
                "Lattice gauge theory"
            ],
            correctAnswer: 1,
            explanation: "The Maldacena duality equates a gravity theory in a bulk AdS space to a Conformal Field Theory on its boundary."
        },
        {
            question: "To achieve N=1 supersymmetry in 4D Minkowski spacetime from 10D string theory, the extra 6 dimensions must be compactified on what manifold?",
            options: [
                "A 6-torus (T6)",
                "K3 surface x T2",
                "A Calabi-Yau threefold (CY3)",
                "A hypersphere (S6)"
            ],
            correctAnswer: 2,
            explanation: "Compactifying on a Calabi-Yau threefold breaks the higher supersymmetry down to exactly N=1 in the remaining 4 dimensions."
        }
    ];

    // ==========================================
    // THE ANIMATION LOOP
    // ==========================================
    const posA = braneAlphaGeom.attributes.position;
    const posO = braneOmegaGeom.attributes.position;
    const stringPosAttr = stringGeom.attributes.position;

    function generateBraneNoise(x, y, t) {
        let z = 0;
        z += Math.sin(x * 0.1 + t) * Math.cos(y * 0.1 + t) * 2.0;
        z += Math.sin(x * 0.05 - t * 0.5) * Math.cos(y * 0.07 + t * 0.8) * 3.0;
        z += Math.sin(x * 0.2 + y * 0.1 + t * 1.5) * 1.0;
        z += Math.cos(Math.sqrt(x*x + y*y) * 0.1 - t * 2) * 2.5;
        return z;
    }

    const animate = (time, speed = 1) => {
        const timeNorm = time * 0.001 * speed;
        
        // 20-second Ekpyrotic Cycle
        const cycleTime = 20;
        const currentPhase = timeNorm % cycleTime;
        
        let braneDistance = 25;
        let collisionIntensity = 0;
        
        // Phase Logic
        if (currentPhase < 8) {
            // Approaching
            braneDistance = 25 - 25 * Math.pow(currentPhase / 8, 4); 
        } else if (currentPhase < 10) {
            // Big Bang Collision!
            braneDistance = 0;
            collisionIntensity = 1.0 - (currentPhase - 8) / 2; // peaks at 8, fades to 0 at 10
        } else if (currentPhase < 18) {
            // Receding
            braneDistance = 25 * Math.pow((currentPhase - 10) / 8, 2);
        } else {
            // Idle
            braneDistance = 25;
        }

        // 1. Animate Brane Undulations and Positions
        braneAlpha.position.y = braneDistance;
        braneOmega.position.y = -braneDistance;

        const noiseMult = 1 + (25 - braneDistance) * 0.15; // More chaotic as they get close
        for (let i = 0; i < posA.count; i++) {
            const x = posA.getX(i);
            const y = posA.getY(i);
            const zOff = generateBraneNoise(x, y, timeNorm * 2) * noiseMult;
            posA.setZ(i, zOff);
            posO.setZ(i, -zOff); // Mirrored perfectly so they "kiss" exactly when distance is 0
        }
        posA.needsUpdate = true;
        posO.needsUpdate = true;

        // 2. Animate Hydraulic Macro-Rams
        pushers.forEach(p => {
            // Formula to perfectly align the piston head with the moving brane surface
            // The housing is at side*35. The brane is at side*braneDistance.
            // Piston head local offset is side*-12.5. Total reach needed = side*(braneDistance - 35)
            p.piston.position.y = p.side * (braneDistance - 35 + 12.5);
        });

        // 3. Chassis and Wheels
        wheels.forEach(w => {
            w.rotation.z -= 0.05 * speed; // Roll forward
        });

        // 4. Rotating Gears and Joysticks
        rotatingGears.forEach(g => {
            if (g.wobble) {
                g.mesh.rotation.x = Math.sin(timeNorm * 10) * 0.3;
                g.mesh.rotation.z = Math.cos(timeNorm * 8) * 0.3;
            } else if (g.steer) {
                g.mesh.rotation.y = Math.sin(timeNorm) * 0.5;
            } else {
                g.mesh.rotation[g.axis] += 0.02 * g.speed * speed;
            }
        });

        // 5. Collision Effects (Visual shaking and Emissive pulsing)
        if (collisionIntensity > 0) {
            plasmaMat.emissiveIntensity = 2 + collisionIntensity * 15;
            plasmaMat2.emissiveIntensity = 2 + collisionIntensity * 15;
            
            // Violent shaking
            const shake = collisionIntensity * 0.8;
            intersectorGroup.position.x = (Math.random() - 0.5) * shake;
            intersectorGroup.position.z = (Math.random() - 0.5) * shake;
            
            // Spawn Strings during the peak of collision
            if (currentPhase > 8 && currentPhase < 8.2) {
                for (let i = 0; i < stringCount; i++) {
                    if (!activeStrings[i] && Math.random() < 0.2) {
                        activeStrings[i] = true;
                        const rx = (Math.random() - 0.5) * 70;
                        const rz = (Math.random() - 0.5) * 70;
                        
                        stringPosAttr.setXYZ(i*2, rx, 0, rz);
                        stringPosAttr.setXYZ(i*2+1, rx, 0, rz);
                        
                        stringVelocities[i].vx = (Math.random() - 0.5) * 6;
                        stringVelocities[i].vy = (Math.random() - 0.5) * 20; // explosive Y
                        stringVelocities[i].vz = (Math.random() - 0.5) * 6;
                        stringVelocities[i].life = 1.0 + Math.random() * 2.0;
                    }
                }
            }
        } else {
            plasmaMat.emissiveIntensity = 2;
            plasmaMat2.emissiveIntensity = 2;
            intersectorGroup.position.x = 0;
            intersectorGroup.position.z = 0;
        }

        // 6. Update Particle System (Strings)
        let stringUpdated = false;
        for (let i = 0; i < stringCount; i++) {
            if (activeStrings[i]) {
                let px1 = stringPosAttr.getX(i*2);
                let py1 = stringPosAttr.getY(i*2);
                let pz1 = stringPosAttr.getZ(i*2);
                let px2 = stringPosAttr.getX(i*2+1);
                let py2 = stringPosAttr.getY(i*2+1);
                let pz2 = stringPosAttr.getZ(i*2+1);
                
                let v = stringVelocities[i];
                
                px1 += v.vx * speed * 0.1; 
                py1 += v.vy * speed * 0.1; 
                pz1 += v.vz * speed * 0.1;
                
                px2 += v.vx * speed * 0.1 + Math.sin(timeNorm*20 + i)*0.5; 
                py2 += v.vy * speed * 0.1 + Math.cos(timeNorm*25 + i)*0.5; 
                pz2 += v.vz * speed * 0.1;
                
                v.life -= 0.05 * speed;
                
                if (v.life <= 0) {
                    activeStrings[i] = false;
                    stringPosAttr.setXYZ(i*2, 0,0,0);
                    stringPosAttr.setXYZ(i*2+1, 0,0,0);
                } else {
                    stringPosAttr.setXYZ(i*2, px1, py1, pz1);
                    stringPosAttr.setXYZ(i*2+1, px2, py2, pz2);
                }
                stringUpdated = true;
            }
        }
        if (stringUpdated) {
            stringPosAttr.needsUpdate = true;
        }
    };

    return { group, parts, description, quizQuestions, animate };
}
