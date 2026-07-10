import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    group.name = "God_Tier_Time_Reversal_Matrix";

    const parts = [];

    // ==========================================
    // MATERIAL DEFINITIONS (EXTREME HIGH-TECH)
    // ==========================================
    const matNeonBlue = new THREE.MeshStandardMaterial({ 
        color: 0x0088ff, 
        emissive: 0x0044ff, 
        emissiveIntensity: 4.0, 
        roughness: 0.1, 
        metalness: 0.9 
    });
    
    const matNeonPurple = new THREE.MeshStandardMaterial({ 
        color: 0x8800ff, 
        emissive: 0x5500aa, 
        emissiveIntensity: 3.5, 
        roughness: 0.2, 
        metalness: 0.9 
    });
    
    const matNeonGreen = new THREE.MeshStandardMaterial({ 
        color: 0x00ff00, 
        emissive: 0x00aa00, 
        emissiveIntensity: 3.0, 
        roughness: 0.3, 
        metalness: 0.7 
    });
    
    const matHoloWire = new THREE.MeshStandardMaterial({ 
        color: 0x00ffff, 
        emissive: 0x00ffff, 
        emissiveIntensity: 1.5, 
        wireframe: true, 
        transparent: true, 
        opacity: 0.6 
    });
    
    const matChronalCore = new THREE.MeshStandardMaterial({ 
        color: 0xffffff, 
        emissive: 0xffffff, 
        emissiveIntensity: 6.0, 
        transparent: true, 
        opacity: 0.95 
    });

    const matGold = new THREE.MeshStandardMaterial({ color: 0xffcc00, metalness: 1.0, roughness: 0.2 });
    const matDarkTech = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.6 });

    // ==========================================
    // PART 1: MASSIVE CHRONOLOGICAL ANCHOR BASE
    // ==========================================
    const baseGroup = new THREE.Group();
    
    // Main foundation disc (Extremely precise geometry to hold tachyon flow)
    const baseGeo = new THREE.CylinderGeometry(40, 42, 4, 128);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.position.y = 2;
    baseGroup.add(baseMesh);

    // Inner secondary structural ring to anchor the core pedestal
    const innerRingGeo = new THREE.CylinderGeometry(20, 20.5, 4.5, 64);
    const innerRingMesh = new THREE.Mesh(innerRingGeo, steel);
    innerRingMesh.position.y = 2.25;
    baseGroup.add(innerRingMesh);

    // Outer chronological boundary ring
    const ringGeo1 = new THREE.TorusGeometry(38, 2, 32, 128);
    const ringMesh1 = new THREE.Mesh(ringGeo1, steel);
    ringMesh1.rotation.x = Math.PI / 2;
    ringMesh1.position.y = 4;
    baseGroup.add(ringMesh1);

    // Deep-tread lugs around the base (Aggressive off-road tread style for grounding temporal recoil)
    for(let i=0; i<180; i++) {
        const lugGeo = new THREE.BoxGeometry(1.5, 4.5, 5);
        const lug = new THREE.Mesh(lugGeo, rubber);
        const angle = (i / 180) * Math.PI * 2;
        lug.position.set(Math.cos(angle) * 41.5, 2, Math.sin(angle) * 41.5);
        lug.rotation.y = -angle;
        
        // Detailed micro-treads inside the lug
        const microGeo = new THREE.BoxGeometry(1.6, 0.5, 4);
        const microTread = new THREE.Mesh(microGeo, steel);
        microTread.position.y = 2.2;
        lug.add(microTread);
        
        baseGroup.add(lug);
    }

    // Energy distribution lines radiating outwards on the base floor
    for(let i=0; i<24; i++) {
        const lineGeo = new THREE.BoxGeometry(36, 0.5, 1);
        const line = new THREE.Mesh(lineGeo, matNeonBlue);
        const angle = (i / 24) * Math.PI * 2;
        line.position.set(Math.cos(angle) * 18, 4.1, Math.sin(angle) * 18);
        line.rotation.y = -angle;
        baseGroup.add(line);
    }

    // Heat sink fins
    for(let i=0; i<36; i++) {
        const finGeo = new THREE.BoxGeometry(4, 2, 0.2);
        const fin = new THREE.Mesh(finGeo, aluminum);
        const angle = (i / 36) * Math.PI * 2;
        fin.position.set(Math.cos(angle) * 30, 4.5, Math.sin(angle) * 30);
        fin.rotation.y = -angle;
        baseGroup.add(fin);
    }

    // Base Group final addition
    group.add(baseGroup);
    parts.push({
        name: 'Chronological_Anchor_Base',
        description: 'Massive stabilization platform containing subterranean tachyon heat sinks and structural anchors.',
        material: 'Dark Steel / Rubber / Neon Blue',
        function: 'Prevents the local area from being torn apart by immense chronological sheer forces.',
        assemblyOrder: 1,
        connections: ['Containment_Pillars', 'Core_Pedestal', 'Gimbal_Ring_Alpha'],
        failureEffect: 'Structural collapse leading to immediate paradox singularity.',
        cascadeFailures: ['Containment_Pillars', 'Operator_Console_Prime', 'Hydraulic_Supports'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -30, z: 0}
    });

    // ==========================================
    // PART 2: MICRO-CHRONAL SENSOR ARRAY (GREEBLES)
    // ==========================================
    const greebleGroup = new THREE.Group();
    for(let i=0; i<600; i++) {
        const geoType = Math.floor(Math.random() * 4);
        let gGeo;
        
        // Massive variety of detailed primitive constructs for hyper-realism
        if (geoType === 0) gGeo = new THREE.BoxGeometry(0.5, 0.8, 0.5);
        else if (geoType === 1) gGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.2, 12);
        else if (geoType === 2) gGeo = new THREE.TorusGeometry(0.4, 0.15, 12, 16);
        else gGeo = new THREE.IcosahedronGeometry(0.4, 0);
        
        const gMat = Math.random() > 0.5 ? darkSteel : steel;
        const gMesh = new THREE.Mesh(gGeo, gMat);
        
        // Place them on the base within the safe zones
        const radius = 22 + Math.random() * 14;
        const angle = Math.random() * Math.PI * 2;
        gMesh.position.set(Math.cos(angle) * radius, 4.6, Math.sin(angle) * radius);
        
        gMesh.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
        greebleGroup.add(gMesh);
    }
    group.add(greebleGroup);
    
    parts.push({
        name: 'Micro_Chronal_Sensors',
        description: '600+ microscopic telemetry sensors scattered across the anchor base.',
        material: 'Dark Steel / Steel',
        function: 'Monitors micro-fluctuations in the localized entropy field in real-time.',
        assemblyOrder: 2,
        connections: ['Chronological_Anchor_Base'],
        failureEffect: 'Slight calibration errors leading to delayed temporal snapping.',
        cascadeFailures: ['Stabilization_Ring_Gamma'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -20, z: 0}
    });

    // ==========================================
    // PART 3: HYDRAULIC SHOCK ABSORBERS
    // ==========================================
    const hydraulicGroup = new THREE.Group();
    const hydraulicCount = 12;
    
    for(let i=0; i<hydraulicCount; i++) {
        const angle = (i / hydraulicCount) * Math.PI * 2;
        
        const outerPistonGeo = new THREE.CylinderGeometry(1.5, 1.5, 8, 32);
        const outerPiston = new THREE.Mesh(outerPistonGeo, steel);
        outerPiston.position.set(Math.cos(angle) * 16, 8, Math.sin(angle) * 16);
        
        // Detailed piston head
        const headGeo = new THREE.CylinderGeometry(2, 2, 1, 32);
        const head = new THREE.Mesh(headGeo, chrome);
        head.position.y = -4;
        outerPiston.add(head);

        // Inner sliding piston
        const innerPistonGeo = new THREE.CylinderGeometry(0.8, 0.8, 12, 32);
        const innerPiston = new THREE.Mesh(innerPistonGeo, copper);
        innerPiston.position.set(0, 4, 0);
        
        // Ring seals on the inner piston
        for(let r=0; r<4; r++) {
            const sealGeo = new THREE.TorusGeometry(0.85, 0.1, 8, 16);
            const seal = new THREE.Mesh(sealGeo, rubber);
            seal.position.y = -2 + r * 1.5;
            seal.rotation.x = Math.PI / 2;
            innerPiston.add(seal);
        }

        outerPiston.add(innerPiston);
        hydraulicGroup.add(outerPiston);
    }
    group.add(hydraulicGroup);

    parts.push({
        name: 'Hydraulic_Shock_Absorbers',
        description: 'Heavy-duty copper-core pistons designed to absorb temporal kickback.',
        material: 'Steel / Copper / Chrome / Rubber',
        function: 'Maintains absolute 0-point stability when entropy reverses.',
        assemblyOrder: 3,
        connections: ['Chronological_Anchor_Base', 'Core_Pedestal'],
        failureEffect: 'Intense mechanical vibration shattering the pedestal.',
        cascadeFailures: ['Core_Pedestal'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 10, z: 0}
    });

    // ==========================================
    // PART 4: CORE PEDESTAL
    // ==========================================
    const pedestalGroup = new THREE.Group();
    
    // Lathe Geometry for smooth, high-tech curved base
    const pedPoints = [];
    for (let i = 0; i <= 20; i++) {
        const u = i / 20;
        pedPoints.push(new THREE.Vector2(Math.sin(u * Math.PI) * 4 + 8, u * 12));
    }
    const pedGeo = new THREE.LatheGeometry(pedPoints, 64);
    const pedMesh = new THREE.Mesh(pedGeo, chrome);
    pedMesh.position.y = 12;
    pedestalGroup.add(pedMesh);

    // Pedestal Energy Ring
    const pedRingGeo = new THREE.TorusGeometry(9.5, 0.4, 32, 64);
    const pedRing = new THREE.Mesh(pedRingGeo, matNeonPurple);
    pedRing.rotation.x = Math.PI / 2;
    pedRing.position.y = 18;
    pedestalGroup.add(pedRing);

    group.add(pedestalGroup);
    parts.push({
        name: 'Core_Pedestal',
        description: 'Hydraulically isolated mounting point utilizing complex Lathe Geometry curves for optimal energy routing.',
        material: 'Chrome / Neon Purple',
        function: 'Serves as the firing platform for the central entropy shards.',
        assemblyOrder: 4,
        connections: ['Hydraulic_Shock_Absorbers', 'Entropy_Core_Containment'],
        failureEffect: 'Core misalignment causing localized time loops.',
        cascadeFailures: ['Entropy_Core_Shards'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 40, z: 0}
    });

    // ==========================================
    // PART 5 - 8: CONTAINMENT PILLARS (N, S, E, W)
    // ==========================================
    const pillarPositions = [
        {x: 28, z: 28}, {x: -28, z: 28}, {x: 28, z: -28}, {x: -28, z: -28}
    ];
    const pillarMeshes = [];
    const pillarPulsers = [];

    pillarPositions.forEach((pos, idx) => {
        const pillarGroup = new THREE.Group();
        
        // Massive Outer Shaft
        const shaftGeo = new THREE.CylinderGeometry(4, 5, 50, 64);
        const shaft = new THREE.Mesh(shaftGeo, aluminum);
        shaft.position.y = 29;
        pillarGroup.add(shaft);

        // Intricate Inner Glowing Core Tube
        const coreTubeGeo = new THREE.CylinderGeometry(2, 2, 48, 32);
        const coreTube = new THREE.Mesh(coreTubeGeo, matNeonPurple);
        coreTube.position.y = 29;
        pillarGroup.add(coreTube);
        pillarPulsers.push(coreTube);

        // Over 40 heat sink ridges per pillar for extreme complexity
        for(let j=0; j<40; j++) {
            const ringGeo = new THREE.TorusGeometry(4.5, 0.4, 16, 64);
            const ring = new THREE.Mesh(ringGeo, steel);
            ring.position.y = 5 + j * 1.2;
            ring.rotation.x = Math.PI / 2;
            pillarGroup.add(ring);
        }

        // Heavy bolt connections at the base of the pillar
        for(let b=0; b<8; b++) {
            const boltGeo = new THREE.CylinderGeometry(0.8, 0.8, 2, 16);
            const bolt = new THREE.Mesh(boltGeo, chrome);
            const bAngle = (b / 8) * Math.PI * 2;
            bolt.position.set(Math.cos(bAngle)*6, 5, Math.sin(bAngle)*6);
            pillarGroup.add(bolt);
        }

        // Plasma vent at the top
        const ventGeo = new THREE.CylinderGeometry(2.5, 4, 3, 32);
        const vent = new THREE.Mesh(ventGeo, darkSteel);
        vent.position.y = 52;
        pillarGroup.add(vent);

        pillarGroup.position.set(pos.x, 0, pos.z);
        group.add(pillarGroup);

        parts.push({
            name: `Containment_Pillar_0${idx+1}`,
            description: `Towering tachyon suppression pillar containing pulsing neon-purple plasma conduits and over 40 thermal ridges.`,
            material: 'Aluminum / Neon Plasma / Chrome / Dark Steel',
            function: 'Generates the perimeter stabilization field to trap time inside.',
            assemblyOrder: 5 + idx,
            connections: ['Chronological_Anchor_Base', 'Energy_Conduits_Grid'],
            failureEffect: 'Field breach leading to chronological leakage into the environment.',
            cascadeFailures: ['Chronological_Anchor_Base', 'Stabilization_Rings'],
            originalPosition: {x: pos.x, y: 0, z: pos.z},
            explodedPosition: {x: pos.x * 2.5, y: 20, z: pos.z * 2.5}
        });
    });

    // ==========================================
    // PART 9 - 11: GIMBAL STABILIZATION RINGS
    // ==========================================
    const gimbalGroup = new THREE.Group();
    gimbalGroup.position.y = 35; // Center of the temporal explosion
    const rings = [];

    const ringData = [
        { radius: 24, thickness: 1.8, color: steel, name: 'Alpha' },
        { radius: 21, thickness: 1.4, color: copper, name: 'Beta' },
        { radius: 18, thickness: 1.0, color: matGold, name: 'Gamma' },
    ];

    ringData.forEach((data, index) => {
        // Massive highly-detailed ring structure
        const ringGeo = new THREE.TorusGeometry(data.radius, data.thickness, 64, 256);
        const ringMesh = new THREE.Mesh(ringGeo, data.color);
        
        // Advanced structural nodes along the ring
        for(let i=0; i<12; i++) {
            const nodeGroup = new THREE.Group();
            
            const nodeBaseGeo = new THREE.BoxGeometry(data.thickness*2.5, data.thickness*2.5, data.thickness*2.5);
            const nodeBase = new THREE.Mesh(nodeBaseGeo, darkSteel);
            nodeGroup.add(nodeBase);

            const nodeLightGeo = new THREE.SphereGeometry(data.thickness, 32, 32);
            const nodeLight = new THREE.Mesh(nodeLightGeo, matNeonBlue);
            nodeGroup.add(nodeLight);

            const angle = (i / 12) * Math.PI * 2;
            nodeGroup.position.set(Math.cos(angle) * data.radius, Math.sin(angle) * data.radius, 0);
            
            // Align rotation to normal
            nodeGroup.rotation.z = angle;
            
            ringMesh.add(nodeGroup);
        }

        // Inner glowing track inside the Torus (fake by using slightly offset torus)
        const trackGeo = new THREE.TorusGeometry(data.radius, data.thickness * 0.4, 32, 256);
        const trackMesh = new THREE.Mesh(trackGeo, matNeonGreen);
        trackMesh.scale.set(1.02, 1.02, 1.02);
        ringMesh.add(trackMesh);

        rings.push(ringMesh);
        gimbalGroup.add(ringMesh);

        parts.push({
            name: `Stabilization_Ring_${data.name}`,
            description: `Hyper-precise gyroscope ring ${data.name} heavily augmented with neon nodes and inner glowing tracks.`,
            material: 'Various Metals / Neon Nodes / Dark Steel',
            function: 'Counteracts temporal drift by spinning on dynamic gimbal lock axes.',
            assemblyOrder: 9 + index,
            connections: ['Core_Pedestal', 'Entropy_Core_Shards'],
            failureEffect: 'Loss of temporal coordinates, sending the room into prehistoric times.',
            cascadeFailures: ['Entropy_Core_Shards'],
            originalPosition: {x: 0, y: 35, z: 0},
            explodedPosition: {x: 0, y: 35 + (index+1)*15, z: 0}
        });
    });
    group.add(gimbalGroup);

    // ==========================================
    // PART 12: THE ENTROPY CORE (1000 SHARDS)
    // ==========================================
    const coreGroup = new THREE.Group();
    coreGroup.position.y = 35; // Center inside the gimbal rings

    const shardMeshes = [];
    const shardCount = 1000;
    
    // Create 1000 highly distinct, complex shards that will explode and reverse
    for(let i=0; i<shardCount; i++) {
        // Varying sharp irregular geometries
        const geoType = Math.random();
        let shardGeo;
        if(geoType < 0.4) {
            shardGeo = new THREE.TetrahedronGeometry(Math.random() * 0.8 + 0.2, 0);
        } else if (geoType < 0.7) {
            shardGeo = new THREE.OctahedronGeometry(Math.random() * 0.6 + 0.2, 0);
        } else {
            shardGeo = new THREE.IcosahedronGeometry(Math.random() * 0.5 + 0.1, 0);
        }
        
        // Randomly scale to make them look like sharp glass splinters and ruined fragments
        shardGeo.scale(1, Math.random() * 4 + 1, Math.random() * 2 + 0.5);

        // Mix of extremely bright materials
        let shardMat;
        const matRoll = Math.random();
        if(matRoll > 0.8) shardMat = matChronalCore;
        else if(matRoll > 0.4) shardMat = glass;
        else if(matRoll > 0.1) shardMat = matNeonBlue;
        else shardMat = matGold;

        const shard = new THREE.Mesh(shardGeo, shardMat);
        
        // Spherical Fibonacci distribution for a perfectly even, dense spherical shell
        const phi = Math.acos( -1 + ( 2 * i ) / shardCount );
        const theta = Math.sqrt( shardCount * Math.PI ) * phi;
        
        // Thickness of the sphere shell
        const r = 3 + Math.random() * 3.5;
        
        const originalPos = new THREE.Vector3(
            r * Math.cos(theta) * Math.sin(phi),
            r * Math.sin(theta) * Math.sin(phi),
            r * Math.cos(phi)
        );
        
        shard.position.copy(originalPos);
        
        // Complex Explosion Logic Vectors
        const outwardDir = originalPos.clone().normalize();
        
        // Some shards explode further than others
        const explosionDistance = 35 + Math.random() * 60;
        
        // Apply slight chaotic drift to the explosion vector
        outwardDir.x += (Math.random() - 0.5) * 0.2;
        outwardDir.y += (Math.random() - 0.5) * 0.2;
        outwardDir.z += (Math.random() - 0.5) * 0.2;
        outwardDir.normalize();

        const explodedPos = originalPos.clone().add(outwardDir.multiplyScalar(explosionDistance));
        
        // Store massive amount of metadata per shard for the animation loop
        shard.userData = {
            originalPos: originalPos.clone(),
            explodedPos: explodedPos,
            rotSpeed: new THREE.Vector3(
                (Math.random()-0.5)*0.8, 
                (Math.random()-0.5)*0.8, 
                (Math.random()-0.5)*0.8
            ),
            originalRot: new THREE.Euler(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI)
        };
        
        shard.rotation.copy(shard.userData.originalRot);
        
        coreGroup.add(shard);
        shardMeshes.push(shard);
    }
    
    group.add(coreGroup);

    parts.push({
        name: 'Entropy_Core_Shards',
        description: '1000 individual tachyon-infused crystal shards. This is the heart of the machine that physically shatters and reconstructs.',
        material: 'Chronal Matter / Glass / Neon Blue / Gold',
        function: 'Acts as the focal point of the entropy reversal field, demonstrating macroscopic time reversal.',
        assemblyOrder: 12,
        connections: ['Stabilization_Ring_Gamma'],
        failureEffect: 'Permanent localized entropy increase resulting in heat death of the laboratory.',
        cascadeFailures: ['The_Universe'],
        originalPosition: {x: 0, y: 35, z: 0},
        explodedPosition: {x: 0, y: 70, z: 0}
    });

    // ==========================================
    // PART 13: ENERGY CONDUITS (MASSIVE BEZIER TUBES)
    // ==========================================
    const conduitGroup = new THREE.Group();
    
    // Spline curves for chaotic yet highly structured hydraulic/energy pipes
    // We create 24 massive sweeping pipes
    for(let i=0; i<24; i++) {
        const angle = (i / 24) * Math.PI * 2;
        const radiusStart = 10;
        const radiusMid = 30 + (i % 2 === 0 ? 10 : 0); // Alternate sweeping arches
        const radiusEnd = 40;

        const startPos = new THREE.Vector3(Math.cos(angle)*radiusStart, 12, Math.sin(angle)*radiusStart);
        const midPos = new THREE.Vector3(Math.cos(angle)*radiusMid, 45, Math.sin(angle)*radiusMid);
        const endPos = new THREE.Vector3(Math.cos(angle)*radiusEnd, 3, Math.sin(angle)*radiusEnd);
        
        const curve = new THREE.QuadraticBezierCurve3(startPos, midPos, endPos);
        
        // High polygon tube for perfect smoothness
        const tubeGeo = new THREE.TubeGeometry(curve, 64, 1.0, 16, false);
        const tubeMesh = new THREE.Mesh(tubeGeo, copper);
        
        conduitGroup.add(tubeMesh);

        // Add glowing inner tube exposed in sections (simulate by a slightly smaller neon tube inside)
        const innerTubeGeo = new THREE.TubeGeometry(curve, 64, 0.5, 8, false);
        const innerTubeMesh = new THREE.Mesh(innerTubeGeo, matNeonGreen);
        conduitGroup.add(innerTubeMesh);

        // Add physical support bands around the tubes
        for(let s=0.1; s<0.9; s+=0.1) {
            const pt = curve.getPoint(s);
            const tangent = curve.getTangent(s);
            
            const bandGeo = new THREE.TorusGeometry(1.2, 0.3, 16, 32);
            const band = new THREE.Mesh(bandGeo, darkSteel);
            band.position.copy(pt);
            
            // Orient band along the curve
            const up = new THREE.Vector3(0,1,0);
            const axis = new THREE.Vector3().crossVectors(up, tangent).normalize();
            const radians = Math.acos(up.dot(tangent));
            band.quaternion.setFromAxisAngle(axis, radians);
            
            conduitGroup.add(band);
        }
    }
    group.add(conduitGroup);

    parts.push({
        name: 'Energy_Conduit_Grid',
        description: 'Vast network of Quadratic Bezier copper tubes routing temporal energy from the base to the core.',
        material: 'Copper / Neon Green Plasma / Dark Steel',
        function: 'Distributes raw chronological energy evenly to avoid chronal sheer.',
        assemblyOrder: 13,
        connections: ['Chronological_Anchor_Base', 'Core_Pedestal'],
        failureEffect: 'Energy buildup leading to localized micro-supernova.',
        cascadeFailures: ['Containment_Pillars', 'Operator_Console_Prime'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -40, z: 0}
    });

    // ==========================================
    // PART 14 & 15: OPERATOR CONSOLES (PRIME & SECUNDUS)
    // ==========================================
    const buildConsole = (posX, posZ, angleRot) => {
        const consoleGrp = new THREE.Group();
        
        // Massive Central Desk Array (Extruded Shape for non-box geometry)
        const deskShape = new THREE.Shape();
        deskShape.moveTo(-6, -3);
        deskShape.lineTo(6, -3);
        deskShape.lineTo(8, 0);
        deskShape.lineTo(6, 3);
        deskShape.lineTo(-6, 3);
        deskShape.lineTo(-8, 0);
        deskShape.lineTo(-6, -3);

        const extrudeSettings = { depth: 5, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.2, bevelThickness: 0.2 };
        const deskGeo = new THREE.ExtrudeGeometry(deskShape, extrudeSettings);
        const desk = new THREE.Mesh(deskGeo, darkSteel);
        desk.rotation.x = Math.PI / 2;
        desk.position.y = 5;
        consoleGrp.add(desk);

        // Multiple Giant Screens
        const screenGeo = new THREE.BoxGeometry(8, 5, 0.5);
        const screenMain = new THREE.Mesh(screenGeo, tinted);
        screenMain.position.set(0, 8.5, -2.5);
        screenMain.rotation.x = -Math.PI / 8;
        consoleGrp.add(screenMain);

        const screenSideGeo = new THREE.BoxGeometry(4, 5, 0.5);
        
        const screenLeft = new THREE.Mesh(screenSideGeo, tinted);
        screenLeft.position.set(-6, 8.5, -1.5);
        screenLeft.rotation.x = -Math.PI / 8;
        screenLeft.rotation.y = Math.PI / 6;
        consoleGrp.add(screenLeft);

        const screenRight = new THREE.Mesh(screenSideGeo, tinted);
        screenRight.position.set(6, 8.5, -1.5);
        screenRight.rotation.x = -Math.PI / 8;
        screenRight.rotation.y = -Math.PI / 6;
        consoleGrp.add(screenRight);

        // Huge Holographic Display floating above
        const holoGeo = new THREE.CylinderGeometry(5, 5, 4, 32, 1, true, 0, Math.PI);
        const holo = new THREE.Mesh(holoGeo, matHoloWire);
        holo.position.set(0, 13, 0);
        holo.rotation.x = Math.PI / 6;
        consoleGrp.add(holo);

        // Extreme detail: Hundreds of tiny buttons and glowing sliders on the desk
        for(let i=0; i<80; i++) {
            const btnGeo = new THREE.BoxGeometry(0.3, 0.3, 0.3);
            const btnColor = Math.random() > 0.5 ? matNeonBlue : (Math.random() > 0.5 ? plastic : matNeonGreen);
            const btn = new THREE.Mesh(btnGeo, btnColor);
            
            // Scatter buttons across the desk surface
            const bx = (Math.random() - 0.5) * 10;
            const bz = (Math.random() - 0.5) * 4 + 1;
            btn.position.set(bx, 5.2, bz);
            consoleGrp.add(btn);
        }

        // Add control joysticks
        for(let j=0; j<2; j++) {
            const stickBase = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1, 0.5, 16), steel);
            stickBase.position.set(j === 0 ? -4 : 4, 5.25, 2);
            consoleGrp.add(stickBase);

            const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 2, 16), chrome);
            stick.position.set(j === 0 ? -4 : 4, 6.25, 2);
            stick.rotation.x = Math.PI / 8;
            consoleGrp.add(stick);
            
            const knob = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), matNeonPurple);
            knob.position.set(j === 0 ? -4 : 4, 7.25, 1.6);
            consoleGrp.add(knob);
        }
        
        consoleGrp.position.set(posX, 0, posZ);
        consoleGrp.rotation.y = angleRot;
        group.add(consoleGrp);
    };

    buildConsole(0, 48, Math.PI); // Prime Console
    buildConsole(0, -48, 0); // Secundus Console

    parts.push({
        name: 'Operator_Console_Prime',
        description: 'Massive telemetry station featuring curved extruded desks, wrap-around tinted screens, joysticks, and holographic readouts.',
        material: 'Dark Steel / Tinted Glass / Hologram / Chrome',
        function: 'Allows PhD-level operators to monitor entropy flow and adjust tachyon limits.',
        assemblyOrder: 14,
        connections: ['Chronological_Anchor_Base'],
        failureEffect: 'Loss of human oversight; machine defaults to paradox generation.',
        cascadeFailures: [],
        originalPosition: {x: 0, y: 0, z: 48},
        explodedPosition: {x: 0, y: 15, z: 65}
    });
    
    parts.push({
        name: 'Operator_Console_Secundus',
        description: 'Secondary telemetry station for absolute redundancy in the event of chronological shift.',
        material: 'Dark Steel / Tinted Glass / Hologram / Chrome',
        function: 'Backup control matrix and secondary paradox override.',
        assemblyOrder: 15,
        connections: ['Chronological_Anchor_Base'],
        failureEffect: 'None unless Prime fails simultaneously.',
        cascadeFailures: [],
        originalPosition: {x: 0, y: 0, z: -48},
        explodedPosition: {x: 0, y: 15, z: -65}
    });

    // ==========================================
    // EXTREME ANIMATION LOGIC (STATE MACHINE)
    // ==========================================
    let localTime = 0;
    
    // Core Animation States: 
    // 0 = Idle/Charge
    // 1 = Explode Outward (Entropy Increase)
    // 2 = Freeze (Tension / Maximum Entropy reached)
    // 3 = Snap Back (Time Reversal / Entropy Decrease)
    let state = 0; 
    let stateTimer = 0;

    function animate(time, speed, meshes) {
        // We use speed to scale our local passage of time
        localTime += speed * 0.015;
        stateTimer += speed * 0.015;

        // 1. Gimbal Rings rotate continuously but chaotically to simulate gimbal lock avoidance
        rings[0].rotation.x += speed * 0.02;
        rings[0].rotation.y += speed * 0.015;

        rings[1].rotation.y -= speed * 0.03;
        rings[1].rotation.z += speed * 0.025;

        rings[2].rotation.x -= speed * 0.04;
        rings[2].rotation.z -= speed * 0.035;

        // 2. Pillars pulse with extreme energy
        const pulse = (Math.sin(localTime * 3) + 1) / 2; // 0 to 1
        pillarPulsers.forEach(mesh => {
            mesh.material.emissiveIntensity = 2 + pulse * 5; // Throbs violently
        });

        // 3. State Machine for Shards (Entropy Reversal Demonstration)
        const STATE_DURATION_IDLE = 4.0;
        const STATE_DURATION_EXPLODE = 1.2;
        const STATE_DURATION_FREEZE = 2.5;
        const STATE_DURATION_REVERSE = 1.0;

        if(state === 0) { 
            // ================= STATE 0: IDLE =================
            // Shards hover slightly in their original positions, buzzing with energy
            shardMeshes.forEach(shard => {
                const hoverOffset = Math.sin(localTime * 5 + shard.position.x) * 0.8;
                shard.position.y = shard.userData.originalPos.y + hoverOffset;
                
                // Slow ambient rotation
                shard.rotation.x += shard.userData.rotSpeed.x * speed * 0.5;
                shard.rotation.y += shard.userData.rotSpeed.y * speed * 0.5;
                shard.rotation.z += shard.userData.rotSpeed.z * speed * 0.5;
            });

            if(stateTimer > STATE_DURATION_IDLE) {
                state = 1;
                stateTimer = 0;
            }
        } 
        else if (state === 1) { 
            // ================= STATE 1: EXPLODE =================
            // Violent outward trajectory
            const progress = Math.min(stateTimer / STATE_DURATION_EXPLODE, 1.0);
            
            // Cubic ease out (starts fast, slows down)
            const easeOut = 1 - Math.pow(1 - progress, 3); 
            
            shardMeshes.forEach(shard => {
                shard.position.lerpVectors(shard.userData.originalPos, shard.userData.explodedPos, easeOut);
                
                // Rapid chaotic spin
                shard.rotation.x += shard.userData.rotSpeed.x * speed * 8;
                shard.rotation.y += shard.userData.rotSpeed.y * speed * 8;
                shard.rotation.z += shard.userData.rotSpeed.z * speed * 8;
            });

            if(stateTimer > STATE_DURATION_EXPLODE) {
                state = 2;
                stateTimer = 0;
            }
        }
        else if (state === 2) { 
            // ================= STATE 2: FREEZE =================
            // Shards are frozen in mid-air, extreme tension
            // We apply violent micro-vibrations to simulate chronological resistance
            shardMeshes.forEach(shard => {
                shard.position.x = shard.userData.explodedPos.x + (Math.random() - 0.5) * 0.4;
                shard.position.y = shard.userData.explodedPos.y + (Math.random() - 0.5) * 0.4;
                shard.position.z = shard.userData.explodedPos.z + (Math.random() - 0.5) * 0.4;
            });

            if(stateTimer > STATE_DURATION_FREEZE) {
                state = 3;
                stateTimer = 0;
            }
        }
        else if (state === 3) { 
            // ================= STATE 3: REVERSE (TIME SNAP) =================
            const progress = Math.min(stateTimer / STATE_DURATION_REVERSE, 1.0);
            
            // Quartic ease in (starts slow, snaps incredibly fast at the end)
            const easeIn = Math.pow(progress, 4); 
            
            shardMeshes.forEach(shard => {
                // Lerp back from exploded to original
                shard.position.lerpVectors(shard.userData.explodedPos, shard.userData.originalPos, easeIn);
                
                // Reverse rotation violently backwards
                shard.rotation.x -= shard.userData.rotSpeed.x * speed * 15;
                shard.rotation.y -= shard.userData.rotSpeed.y * speed * 15;
                shard.rotation.z -= shard.userData.rotSpeed.z * speed * 15;
            });

            if(stateTimer > STATE_DURATION_REVERSE) {
                state = 0;
                stateTimer = 0;
                
                // Snap exactly to original to avoid any floating point drift
                shardMeshes.forEach(shard => {
                    shard.position.copy(shard.userData.originalPos);
                });
            }
        }
    }

    const description = "God-Tier Time Reversal Matrix: An immensely complex, towering construct capable of isolating local chronological fields and forcing absolute localized entropy reduction. Featuring 1000 individually tracked tachyon crystal shards that violently explode outwards, freeze in mid-air under extreme tension, and physically snap back into a perfect spherical core. Constructed using over 15 interconnected sub-assemblies including gimbal rings, bezier energy conduits, and hyper-detailed operator consoles.";

    const quizQuestions = [
        {
            question: "In the context of the fluctuation theorem governing this matrix, which fundamental requirement ensures the time-reversal asymmetry of macroscopic systems under observation?",
            options: [
                "The assumption of molecular chaos (Stosszahlansatz).",
                "The invariant trace of the local density matrix.",
                "Zero initial entanglement across the boundary condition.",
                "Symmetric heat capacity in the tachyon sink."
            ],
            correctAnswer: 0,
            explanation: "The fluctuation theorem quantifies the probability of entropy-producing trajectories vs entropy-consuming ones. The asymmetry at the macroscopic scale heavily relies on the Stosszahlansatz, assuming pre-collision particle velocities are uncorrelated."
        },
        {
            question: "According to the Jarzynski equality utilized by the Operator Consoles, how is the free energy difference between two equilibrium states related to the non-equilibrium work?",
            options: [
                "It equals the arithmetic mean of the work over all trajectories.",
                "It is exponentially weighted against the reciprocal of the temperature.",
                "It is inversely proportional to the partition function ratio.",
                "It ignores non-equilibrium heat dissipation entirely."
            ],
            correctAnswer: 1,
            explanation: "The Jarzynski equality states that exp(-Delta F / kT) = <exp(-W / kT)>. Thus, the free energy difference relates to the exponentially weighted average of the work."
        },
        {
            question: "When the matrix enters State 3 (Time Reversal), achieving negative total entropy production in the core, which principle is explicitly localized to avoid universal paradox?",
            options: [
                "The Pauli Exclusion Principle.",
                "The Second Law of Thermodynamics.",
                "The Heisenberg Uncertainty Principle.",
                "The Bekenstein Bound."
            ],
            correctAnswer: 1,
            explanation: "The Second Law dictates that total entropy of an isolated system can never decrease over time. The matrix creates a non-isolated localized field, extracting entropy and venting it via the pillars to bypass global violation."
        },
        {
            question: "What role does the Loschmidt echo play in the Stabilization Rings' functionality?",
            options: [
                "It measures the rate of tachyon decay in the energy conduits.",
                "It quantifies the sensitivity of the time-reversed quantum dynamics to microscopic perturbations.",
                "It balances the hydraulic pressure in the core pedestal.",
                "It synchronizes the holographic displays on the operator consoles."
            ],
            correctAnswer: 1,
            explanation: "The Loschmidt echo measures the revival of a quantum state after forward and backward evolution perturbed by a small error. The Stabilization Rings monitor this to ensure the time reversal perfectly reconstructs the shards without quantum decoherence."
        },
        {
            question: "How does the Bekenstein bound constrain the Entropy Core's maximal data reconstruction rate during the 'Snap Back' phase?",
            options: [
                "It limits the physical velocity of the returning shards.",
                "It defines the maximum amount of information that can be stored within the core's finite spherical volume.",
                "It dictates the required thickness of the copper Energy Conduits.",
                "It prevents the Operator Consoles from overheating."
            ],
            correctAnswer: 1,
            explanation: "The Bekenstein bound implies there is a maximum amount of information (entropy) that can be contained in a finite region of space. The core must remain within this informational limit to accurately reconstruct the exact molecular arrangement of the shards."
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
