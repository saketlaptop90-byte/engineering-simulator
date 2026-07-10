import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Helper functions for complex geometries
    function createJaggedShape(width, height, detail) {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        for (let i = 0; i <= detail; i++) {
            const x = (i / detail) * width;
            const y = height + Math.sin(x * 2) * 2 + Math.cos(x * 5) * 1 + (Math.random() - 0.5) * 1.5;
            shape.lineTo(x, y);
        }
        shape.lineTo(width, 0);
        shape.lineTo(0, 0);
        return shape;
    }

    function createSmoothCurveShape(width, height, detail, offset) {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        for (let i = 0; i <= detail; i++) {
            const x = (i / detail) * width;
            const y = height + Math.sin(x * 0.5 + offset) * 3;
            shape.lineTo(x, y);
        }
        shape.lineTo(width, 0);
        shape.lineTo(0, 0);
        return shape;
    }

    const extrudeSettings = { depth: 20, bevelEnabled: true, bevelSegments: 3, steps: 5, bevelSize: 0.2, bevelThickness: 0.2 };
    
    // Hyper-Realistic Materials
    const bedrockMaterial = new THREE.MeshStandardMaterial({
        color: 0x3a4042,
        roughness: 0.9,
        metalness: 0.1,
        flatShading: true,
        name: 'BedrockMaterial'
    });

    const iceMaterialDeep = new THREE.MeshPhysicalMaterial({
        color: 0x88ccff,
        transmission: 0.9,
        opacity: 1,
        metalness: 0,
        roughness: 0.1,
        ior: 1.31,
        thickness: 5.0,
        specularIntensity: 1.0,
        clearcoat: 0.5
    });

    const iceMaterialMid = new THREE.MeshPhysicalMaterial({
        color: 0xaaeeff,
        transmission: 0.7,
        opacity: 0.9,
        metalness: 0.1,
        roughness: 0.3,
        ior: 1.31,
        thickness: 2.0
    });

    const iceMaterialBrittle = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.3,
        opacity: 0.8,
        metalness: 0.1,
        roughness: 0.6,
        clearcoat: 0.2
    });

    const waterMaterial = new THREE.MeshStandardMaterial({
        color: 0x0055ff,
        transparent: true,
        opacity: 0.6,
        roughness: 0.1,
        metalness: 0.1,
        emissive: 0x001155
    });

    const debrisMaterial = new THREE.MeshStandardMaterial({
        color: 0x554433,
        roughness: 1.0,
        flatShading: true
    });

    const glowingNeon = new THREE.MeshStandardMaterial({
        color: 0x00ffcc,
        emissive: 0x00ffcc,
        emissiveIntensity: 2.0,
        roughness: 0.2,
        metalness: 0.8
    });

    // 1. BedrockBase
    const bedrockShape = createJaggedShape(80, 10, 40);
    const bedrockGeom = new THREE.ExtrudeGeometry(bedrockShape, extrudeSettings);
    bedrockGeom.translate(-40, -10, -10);
    const bedrockMesh = new THREE.Mesh(bedrockGeom, bedrockMaterial);
    bedrockMesh.castShadow = true;
    bedrockMesh.receiveShadow = true;
    group.add(bedrockMesh);
    meshes.bedrockBase = bedrockMesh;

    parts.push({
        name: 'Bedrock Base',
        description: 'The solid rock foundation over which the glacier flows. Highly resistant to deformation but subject to intense erosion.',
        material: 'Granite/Gneiss',
        function: 'Supports the glacier mass and provides frictional resistance.',
        assemblyOrder: 1,
        connections: ['SubglacialBed', 'TerminalMoraine'],
        failureEffect: 'Catastrophic landslide if structurally compromised.',
        cascadeFailures: ['Glacier collapse', 'Basal Sliding Zone disruption'],
        originalPosition: { x: 0, y: -10, z: 0 },
        explodedPosition: { x: 0, y: -30, z: 0 }
    });

    // 2. BasalSlidingLayer
    const basalShape = new THREE.PlaneGeometry(80, 20, 32, 8);
    const basalMesh = new THREE.Mesh(basalShape, waterMaterial);
    basalMesh.rotation.x = -Math.PI / 2;
    basalMesh.position.set(0, 1.5, 0); 
    group.add(basalMesh);
    meshes.basalSlidingLayer = basalMesh;

    parts.push({
        name: 'Basal Sliding Layer',
        description: 'A pressurized film of meltwater at the ice-bedrock interface, acting as a high-pressure hydraulic lubricant.',
        material: 'Pressurized Meltwater',
        function: 'Dramatically reduces friction, allowing the entire glacier body to slide forward along the bedrock.',
        assemblyOrder: 2,
        connections: ['BedrockBase', 'GlacierIceBottomLayer'],
        failureEffect: 'Freezing to the bed, halting sliding and forcing all movement via plastic deformation.',
        cascadeFailures: ['Ice velocity reduction', 'Thickness increase'],
        originalPosition: { x: 0, y: 1.5, z: 0 },
        explodedPosition: { x: 0, y: -15, z: 0 }
    });

    // 3. SubglacialChannel
    const subChannelPath = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-40, 2, 0),
        new THREE.Vector3(-20, 2, 3),
        new THREE.Vector3(0, 1.5, -2),
        new THREE.Vector3(20, 2, 1),
        new THREE.Vector3(40, 1, 0)
    ]);
    const subChannelGeom = new THREE.TubeGeometry(subChannelPath, 64, 1.5, 8, false);
    const subChannelMesh = new THREE.Mesh(subChannelGeom, waterMaterial);
    group.add(subChannelMesh);
    meshes.subglacialChannel = subChannelMesh;

    parts.push({
        name: 'Subglacial Hydrological Channel',
        description: 'Arterial network of high-pressure subglacial rivers carved into the ice and bedrock.',
        material: 'Meltwater',
        function: 'Evacuates meltwater from the glacial system, regulating basal water pressure and sliding velocity.',
        assemblyOrder: 3,
        connections: ['BasalSlidingLayer', 'MoulinShaft'],
        failureEffect: 'Water backs up, pressure rises, causing glacier surge or catastrophic outburst flood.',
        cascadeFailures: ['Glacier surge', 'Moraine blowout'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -10, z: -15 }
    });

    // 4. GlacierIceBottomLayer (Plastic Deformation Zone)
    const deepIceShape = createSmoothCurveShape(78, 8, 20, 0);
    const deepIceGeom = new THREE.ExtrudeGeometry(deepIceShape, extrudeSettings);
    deepIceGeom.translate(-39, 2, -10);
    const deepIceMesh = new THREE.Mesh(deepIceGeom, iceMaterialDeep);
    group.add(deepIceMesh);
    meshes.glacierIceBottomLayer = deepIceMesh;

    parts.push({
        name: 'Bottom Ice Layer (Plastic Zone)',
        description: 'Deepest ice layer under immense lithostatic pressure, behaving as a ductile, slowly creeping fluid.',
        material: 'High-Density Polycrystalline Ice',
        function: 'Facilitates continuous internal deformation and flow of the glacier mass downhill.',
        assemblyOrder: 4,
        connections: ['BasalSlidingLayer', 'GlacierIceMiddleLayer'],
        failureEffect: 'N/A (Ice continuously deforms).',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 2, z: 0 },
        explodedPosition: { x: -10, y: -5, z: 0 }
    });

    // 5. GlacierIceMiddleLayer
    const midIceShape = createSmoothCurveShape(76, 12, 20, 1);
    const midIceGeom = new THREE.ExtrudeGeometry(midIceShape, extrudeSettings);
    midIceGeom.translate(-38, 10, -10);
    const midIceMesh = new THREE.Mesh(midIceGeom, iceMaterialMid);
    group.add(midIceMesh);
    meshes.glacierIceMiddleLayer = midIceMesh;

    parts.push({
        name: 'Middle Ice Layer',
        description: 'Transition zone between deep ductile ice and shallow brittle ice. Exhibits maximum shear stress gradient.',
        material: 'Glacial Ice',
        function: 'Transfers momentum from the accelerating surface to the lagging bed layers.',
        assemblyOrder: 5,
        connections: ['GlacierIceBottomLayer', 'GlacierIceTopLayer'],
        failureEffect: 'Shear banding and internal crystal realignment.',
        cascadeFailures: ['Velocity divergence'],
        originalPosition: { x: 0, y: 10, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 0 }
    });

    // 6. GlacierIceTopLayer (Brittle Zone)
    const topIceShape = createSmoothCurveShape(74, 10, 20, 2);
    const topIceGeom = new THREE.ExtrudeGeometry(topIceShape, extrudeSettings);
    topIceGeom.translate(-37, 22, -10);
    const topIceMesh = new THREE.Mesh(topIceGeom, iceMaterialBrittle);
    group.add(topIceMesh);
    meshes.glacierIceTopLayer = topIceMesh;

    parts.push({
        name: 'Top Ice Layer (Brittle Zone)',
        description: 'Uppermost 50 meters of the glacier where confining pressure is low enough that ice fractures rather than flows.',
        material: 'Aerated Glacial Ice',
        function: 'Carries surface debris and fractures to relieve extensional stress.',
        assemblyOrder: 6,
        connections: ['GlacierIceMiddleLayer', 'CrevasseSystem'],
        failureEffect: 'Extensive brittle fracturing forming crevasses and seracs.',
        cascadeFailures: ['Surface destabilization'],
        originalPosition: { x: 0, y: 22, z: 0 },
        explodedPosition: { x: 0, y: 35, z: 0 }
    });

    // 7. FirnLayer
    const firnShape = createSmoothCurveShape(70, 4, 20, 2.5);
    const firnGeom = new THREE.ExtrudeGeometry(firnShape, extrudeSettings);
    firnGeom.translate(-35, 32, -10);
    const firnMaterial = new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.9, metalness: 0 });
    const firnMesh = new THREE.Mesh(firnGeom, firnMaterial);
    group.add(firnMesh);
    meshes.firnLayer = firnMesh;

    parts.push({
        name: 'Firn Layer',
        description: 'Granular, partially compacted snow transitioning into ice.',
        material: 'Firn',
        function: 'Accumulates mass, slowly expels air bubbles, and densifies into solid glacial ice.',
        assemblyOrder: 7,
        connections: ['GlacierIceTopLayer', 'SurfaceSnow'],
        failureEffect: 'Rapid melting reduces accumulation.',
        cascadeFailures: ['Glacier retreat'],
        originalPosition: { x: 0, y: 32, z: 0 },
        explodedPosition: { x: 0, y: 45, z: 0 }
    });

    // 8. CrevasseSystem
    const crevasseGroup = new THREE.Group();
    const crevasseMaterial = new THREE.MeshPhysicalMaterial({ color: 0x66bbff, transmission: 0.5, roughness: 0.2 });
    for (let i = 0; i < 15; i++) {
        const crevasseG = new THREE.ConeGeometry(1.5 + Math.random(), 15, 3);
        const crevasseM = new THREE.Mesh(crevasseG, crevasseMaterial);
        crevasseM.rotation.x = Math.PI; 
        crevasseM.rotation.z = (Math.random() - 0.5) * 0.4;
        crevasseM.position.set(-25 + i * 4 + (Math.random() - 0.5) * 2, 30, (Math.random() - 0.5) * 15);
        crevasseGroup.add(crevasseM);
    }
    group.add(crevasseGroup);
    meshes.crevasseSystem = crevasseGroup;

    parts.push({
        name: 'Crevasse System',
        description: 'Deep, wedge-shaped fractures opening in the brittle zone due to tensile stresses.',
        material: 'Fractured Ice Void',
        function: 'Relieves stress in the brittle ice layer; acts as conduits for surface meltwater.',
        assemblyOrder: 8,
        connections: ['GlacierIceTopLayer'],
        failureEffect: 'Expansion into massive icefalls.',
        cascadeFailures: ['Hazard to climbers', 'Hydro-fracturing'],
        originalPosition: { x: 0, y: 30, z: 0 },
        explodedPosition: { x: 0, y: 55, z: 0 }
    });

    // 9. MoulinShaft
    const moulinPath = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-10, 32, 0),
        new THREE.Vector3(-11, 25, 2),
        new THREE.Vector3(-9, 15, -1),
        new THREE.Vector3(-10, 5, 1),
        new THREE.Vector3(-10, 2, 0)
    ]);
    const moulinGeom = new THREE.TubeGeometry(moulinPath, 32, 1.2, 8, false);
    const moulinMesh = new THREE.Mesh(moulinGeom, waterMaterial);
    group.add(moulinMesh);
    meshes.moulinShaft = moulinMesh;

    parts.push({
        name: 'Moulin Shaft',
        description: 'A near-vertical, tubular chute carved by swirling surface meltwater.',
        material: 'Meltwater',
        function: 'Rapidly transports huge volumes of surface meltwater directly to the basal sliding zone.',
        assemblyOrder: 9,
        connections: ['SurfaceSnow', 'SubglacialChannel'],
        failureEffect: 'Blockage causes supraglacial lakes.',
        cascadeFailures: ['Basal pressure spikes'],
        originalPosition: { x: -10, y: 15, z: 0 },
        explodedPosition: { x: -30, y: 30, z: -20 }
    });

    // 10. TerminalMoraine
    const terminalMoraineGroup = new THREE.Group();
    for (let i = 0; i < 200; i++) {
        const rockG = new THREE.IcosahedronGeometry(Math.random() * 2 + 0.5, 0);
        const rockM = new THREE.Mesh(rockG, debrisMaterial);
        rockM.position.set(38 + Math.random() * 8, -5 + Math.random() * 8, -12 + Math.random() * 24);
        rockM.rotation.set(Math.random(), Math.random(), Math.random());
        terminalMoraineGroup.add(rockM);
    }
    group.add(terminalMoraineGroup);
    meshes.terminalMoraine = terminalMoraineGroup;

    parts.push({
        name: 'Terminal Moraine',
        description: 'A massive chaotic ridge of unsorted glacial till dumped at the furthest point of advance.',
        material: 'Glacial Till / Rocks',
        function: 'Marks maximum extent of glacier; acts as natural dam.',
        assemblyOrder: 10,
        connections: ['BedrockBase'],
        failureEffect: 'Dam failure causes Glacial Lake Outburst Floods (GLOFs).',
        cascadeFailures: ['Downstream devastation'],
        originalPosition: { x: 38, y: -5, z: 0 },
        explodedPosition: { x: 60, y: -5, z: 0 }
    });

    // 11. LateralMoraine
    const lateralMoraineGroup = new THREE.Group();
    for (let i = 0; i < 150; i++) {
        const rockG = new THREE.IcosahedronGeometry(Math.random() * 1.5 + 0.5, 0);
        const rockM = new THREE.Mesh(rockG, debrisMaterial);
        rockM.position.set(-30 + i * 0.45, 10 + Math.sin(i * 0.1) * 15, -11 + Math.random() * 3);
        rockM.rotation.set(Math.random(), Math.random(), Math.random());
        lateralMoraineGroup.add(rockM);
    }
    group.add(lateralMoraineGroup);
    meshes.lateralMoraine = lateralMoraineGroup;

    parts.push({
        name: 'Lateral Moraine',
        description: 'Parallel ridges of debris deposited along the sides of the glacier.',
        material: 'Angular Debris',
        function: 'Shields ice margins from solar radiation.',
        assemblyOrder: 11,
        connections: ['GlacierIceTopLayer'],
        failureEffect: 'Slope failure leading to debris flows.',
        cascadeFailures: ['Ice flow disruption'],
        originalPosition: { x: 0, y: 15, z: -11 },
        explodedPosition: { x: 0, y: 20, z: -30 }
    });

    // 12. MeltwaterStream
    const streamPath = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-30, 36, 5),
        new THREE.Vector3(-20, 34, 3),
        new THREE.Vector3(-10, 32, 0)
    ]);
    const streamGeom = new THREE.TubeGeometry(streamPath, 32, 0.8, 8, false);
    const streamMesh = new THREE.Mesh(streamGeom, waterMaterial);
    group.add(streamMesh);
    meshes.meltwaterStream = streamMesh;

    parts.push({
        name: 'Supraglacial Meltwater Stream',
        description: 'Fast-flowing rivers of meltwater coursing over the glacier surface.',
        material: 'Meltwater',
        function: 'Collects ablation water, routing it into crevasses and moulins.',
        assemblyOrder: 12,
        connections: ['FirnLayer', 'MoulinShaft'],
        failureEffect: 'Rapid channel downcutting and canyon formation.',
        cascadeFailures: ['Moulin widening'],
        originalPosition: { x: -20, y: 34, z: 2 },
        explodedPosition: { x: -20, y: 50, z: 15 }
    });

    // 13. BedrockStriations
    const striationGroup = new THREE.Group();
    const striationMaterial = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 1.0 });
    for (let i = 0; i < 50; i++) {
        const stripG = new THREE.CylinderGeometry(0.2, 0.2, 10 + Math.random() * 10, 4);
        const stripM = new THREE.Mesh(stripG, striationMaterial);
        stripM.rotation.z = Math.PI / 2;
        stripM.position.set(-30 + Math.random() * 60, -2 + Math.random() * 5, -9 + Math.random() * 18);
        striationGroup.add(stripM);
    }
    group.add(striationGroup);
    meshes.bedrockStriations = striationGroup;

    parts.push({
        name: 'Bedrock Striations & Grooves',
        description: 'Deep gouges and scratches carved into the bedrock by hard rocks dragged along the base.',
        material: 'Scored Rock',
        function: 'Indicates past ice flow direction; demonstrates erosive power.',
        assemblyOrder: 13,
        connections: ['BedrockBase'],
        failureEffect: 'Eventual pulverization into glacial flour.',
        cascadeFailures: ['Increased sediment load'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -20, z: 15 }
    });

    // 14. SupraglacialDebris
    const supraDebrisGroup = new THREE.Group();
    for (let i = 0; i < 100; i++) {
        const rockG = new THREE.IcosahedronGeometry(Math.random() * 0.8 + 0.2, 0);
        const rockM = new THREE.Mesh(rockG, debrisMaterial);
        rockM.position.set(-35 + Math.random() * 65, 34 + Math.random() * 4, -8 + Math.random() * 16);
        rockM.rotation.set(Math.random(), Math.random(), Math.random());
        supraDebrisGroup.add(rockM);
    }
    group.add(supraDebrisGroup);
    meshes.supraglacialDebris = supraDebrisGroup;

    parts.push({
        name: 'Supraglacial Debris Cover',
        description: 'A dark layer of dust, rocks, and biological matter (cryoconite) covering the ablation zone.',
        material: 'Rock/Dust/Cryoconite',
        function: 'Alters surface albedo, strongly affecting local melt rates.',
        assemblyOrder: 14,
        connections: ['GlacierIceTopLayer'],
        failureEffect: 'Runaway melting if albedo drops drastically.',
        cascadeFailures: ['Massive ablation rate increase'],
        originalPosition: { x: 0, y: 35, z: 0 },
        explodedPosition: { x: 0, y: 60, z: 0 }
    });

    // 15. IceShearPlanes
    const shearPlaneGroup = new THREE.Group();
    const shearMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.1, side: THREE.DoubleSide });
    for (let i = 0; i < 5; i++) {
        const planeG = new THREE.PlaneGeometry(70, 15);
        const planeM = new THREE.Mesh(planeG, shearMaterial);
        planeM.position.set(0, 15 + i * 3, 0);
        planeM.rotation.x = Math.PI / 2;
        planeM.rotation.y = 0.1; 
        shearPlaneGroup.add(planeM);
    }
    group.add(shearPlaneGroup);
    meshes.iceShearPlanes = shearPlaneGroup;

    parts.push({
        name: 'Internal Shear Planes',
        description: 'Bands of alternating clear and bubbly ice caused by intense internal shear deformation.',
        material: 'Recrystallized Ice',
        function: 'Represents the primary mechanism of internal plastic flow.',
        assemblyOrder: 15,
        connections: ['GlacierIceMiddleLayer'],
        failureEffect: 'Severe anisotropic weakness.',
        cascadeFailures: ['Unpredictable ice avalanches'],
        originalPosition: { x: 0, y: 20, z: 0 },
        explodedPosition: { x: -20, y: 20, z: -20 }
    });

    // 16. High-Tech Glaciology Sensor Array (Fulfills multi-function/high-tech/materials requirement)
    const sensorGroup = new THREE.Group();
    
    // Main array tower
    const towerGeom = new THREE.CylinderGeometry(0.5, 0.5, 12, 16);
    const towerMesh = new THREE.Mesh(towerGeom, aluminum);
    towerMesh.position.set(-15, 40, 0);
    sensorGroup.add(towerMesh);

    // Radar dish
    const dishGeom = new THREE.SphereGeometry(1.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 3);
    const dishMesh = new THREE.Mesh(dishGeom, chrome);
    dishMesh.rotation.x = -Math.PI / 2;
    dishMesh.position.set(-15, 46, 0);
    sensorGroup.add(dishMesh);

    // Glowing data conduit
    const conduitGeom = new THREE.CylinderGeometry(0.1, 0.1, 12, 8);
    const conduitMesh = new THREE.Mesh(conduitGeom, glowingNeon);
    conduitMesh.position.set(-15, 40, 0.6);
    sensorGroup.add(conduitMesh);
    meshes.sensorConduit = conduitMesh;

    // Borehole probe descending into ice
    const probeGeom = new THREE.CylinderGeometry(0.2, 0.2, 35, 8);
    const probeMesh = new THREE.Mesh(probeGeom, steel);
    probeMesh.position.set(-15, 17, 0);
    sensorGroup.add(probeMesh);

    group.add(sensorGroup);
    meshes.sensorArray = sensorGroup;

    parts.push({
        name: 'Glaciology Sensor Array',
        description: 'Advanced telemetry station featuring ground-penetrating radar, borehole inclinometers, and basal pressure transducers.',
        material: 'Aluminum, Chrome, Steel, Optics',
        function: 'Monitors ice velocity, sheer strain, basal water pressure, and thermodynamic profiles in real-time.',
        assemblyOrder: 16,
        connections: ['SurfaceSnow', 'GlacierIceBottomLayer'],
        failureEffect: 'Loss of critical telemetry data predicting glacial collapse.',
        cascadeFailures: ['Inability to warn of imminent GLOF'],
        originalPosition: { x: -15, y: 30, z: 0 },
        explodedPosition: { x: -15, y: 70, z: 0 }
    });

    // Hydraulic Pressure Nodes (Visual effect)
    const hydraulicNodes = new THREE.InstancedMesh(new THREE.SphereGeometry(0.3, 8, 8), glowingNeon, 50);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < 50; i++) {
        dummy.position.set(-30 + Math.random() * 60, 2 + Math.random() * 3, -8 + Math.random() * 16);
        dummy.updateMatrix();
        hydraulicNodes.setMatrixAt(i, dummy.matrix);
    }
    group.add(hydraulicNodes);
    meshes.hydraulicNodes = hydraulicNodes;

    // Centering the whole model
    group.position.set(0, -15, 0);
    group.scale.set(0.5, 0.5, 0.5);

    // Complex Animation Loop
    const animate = (time, speed, activeMeshes) => {
        const t = time * speed;
        
        // Ice layers parabolic flow profile
        if (activeMeshes.glacierIceBottomLayer) {
            activeMeshes.glacierIceBottomLayer.position.x = Math.sin(t * 0.1) * 0.5;
        }
        if (activeMeshes.glacierIceMiddleLayer) {
            activeMeshes.glacierIceMiddleLayer.position.x = Math.sin(t * 0.1) * 1.5;
        }
        if (activeMeshes.glacierIceTopLayer) {
            activeMeshes.glacierIceTopLayer.position.x = Math.sin(t * 0.1) * 2.5;
        }
        if (activeMeshes.firnLayer) {
            activeMeshes.firnLayer.position.x = Math.sin(t * 0.1) * 2.8;
        }

        // Basal sliding layer (water) flowing
        if (activeMeshes.basalSlidingLayer) {
            activeMeshes.basalSlidingLayer.material.map && (activeMeshes.basalSlidingLayer.material.map.offset.x -= 0.05 * speed);
            activeMeshes.basalSlidingLayer.position.x = Math.sin(t * 0.5) * 0.2; 
        }

        // Subglacial channel pulsing
        if (activeMeshes.subglacialChannel) {
            activeMeshes.subglacialChannel.scale.setScalar(1 + Math.sin(t * 5) * 0.1);
        }

        // Moulin water pulsing
        if (activeMeshes.moulinShaft) {
            activeMeshes.moulinShaft.scale.x = 1 + Math.cos(t * 4) * 0.1;
            activeMeshes.moulinShaft.scale.z = 1 + Math.cos(t * 4) * 0.1;
        }

        // Crevasse dynamics (opening and closing slightly)
        if (activeMeshes.crevasseSystem) {
            activeMeshes.crevasseSystem.children.forEach((crevasse, idx) => {
                crevasse.scale.x = 1 + Math.sin(t * 0.2 + idx) * 0.2;
                crevasse.position.x += Math.sin(t * 0.1) * 0.005; 
            });
        }

        // Meltwater stream flow
        if (activeMeshes.meltwaterStream) {
            activeMeshes.meltwaterStream.scale.setScalar(1 + Math.sin(t * 8) * 0.05);
        }

        // Debris creeping forward
        if (activeMeshes.supraglacialDebris) {
            activeMeshes.supraglacialDebris.position.x = Math.sin(t * 0.1) * 2.8; 
        }

        // Shear planes shifting
        if (activeMeshes.iceShearPlanes) {
            activeMeshes.iceShearPlanes.children.forEach((plane, idx) => {
                plane.position.x = Math.sin(t * 0.1) * (1 + idx * 0.5);
            });
        }

        // Hydraulic pressure nodes pumping
        if (activeMeshes.hydraulicNodes) {
            for (let i = 0; i < 50; i++) {
                dummy.position.set(-30 + ((i * 1.3) % 60), 2 + Math.sin(t * 3 + i) * 1, -8 + ((i * 0.7) % 16));
                dummy.scale.setScalar(1 + Math.sin(t * 10 + i) * 0.5);
                dummy.updateMatrix();
                activeMeshes.hydraulicNodes.setMatrixAt(i, dummy.matrix);
            }
            activeMeshes.hydraulicNodes.instanceMatrix.needsUpdate = true;
        }

        // High-tech sensor array animation (spinning radar, pulsing neon)
        if (activeMeshes.sensorArray) {
            activeMeshes.sensorArray.children[1].rotation.z = t * 2; // spin radar dish
        }
        if (activeMeshes.sensorConduit) {
            activeMeshes.sensorConduit.material.emissiveIntensity = 1.0 + Math.sin(t * 15) * 1.0;
        }
    };

    const description = "A massive, ultra high-tech cross-sectional model of a flowing glacier system. This complex machine demonstrates the biomechanics of ice deformation, basal sliding, subglacial hydrology, and brittle fracture mechanics (crevasses). Visualizes differential velocity profiles and features an advanced Glaciology Telemetry Array continuously monitoring the ice-bedrock interface.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Basal Sliding Layer?",
            options: [
                "To freeze the glacier firmly to the bedrock.",
                "To act as a high-pressure hydraulic lubricant reducing friction.",
                "To reflect solar radiation back into the atmosphere.",
                "To absorb impurities from the bedrock."
            ],
            correctAnswer: 1,
            explanation: "The basal sliding layer consists of pressurized meltwater that acts as a lubricant, dramatically reducing friction and allowing the entire mass of the glacier to slide forward over the bedrock."
        },
        {
            question: "Why do crevasses primarily form in the Top Ice Layer rather than the Bottom Ice Layer?",
            options: [
                "The top layer is warmer and melts faster.",
                "The top layer lacks the immense confining lithostatic pressure found at depth, allowing it to fracture in a brittle manner.",
                "Crevasses are dug by supraglacial streams.",
                "The bottom layer moves faster than the top layer."
            ],
            correctAnswer: 1,
            explanation: "The upper 50 meters of a glacier experiences low confining pressure. When subjected to tension, it fractures brittlely, forming crevasses. Deeper ice is under extreme pressure and flows plastically instead."
        },
        {
            question: "What is the role of a Moulin in the glacial system?",
            options: [
                "It is a vertical shaft that transports massive volumes of surface meltwater directly to the basal sliding zone.",
                "It is a type of debris deposit at the snout.",
                "It is a sheer cliff face of ice.",
                "It is a frozen lake on the glacier surface."
            ],
            correctAnswer: 0,
            explanation: "Moulins are essentially giant vertical drainpipes carved by swirling meltwater. They route water from the surface straight down to the bed, which can rapidly increase basal water pressure and accelerate basal sliding."
        },
        {
            question: "How does the 'velocity profile' of a glacier typically look?",
            options: [
                "The bottom moves the fastest, dragging the top.",
                "The entire glacier moves at exactly the same speed like a solid block.",
                "The top center moves the fastest, while the sides and bottom move slower due to friction.",
                "Velocity is entirely random throughout the ice mass."
            ],
            correctAnswer: 2,
            explanation: "Due to internal plastic deformation and frictional drag along the bed and valley walls, the surface ice in the center of the glacier flows the fastest, creating a parabolic velocity profile."
        },
        {
            question: "What material makes up a Terminal Moraine?",
            options: [
                "Pure, unadulterated glacial ice.",
                "A ridge of unsorted glacial till (rocks, gravel, clay) bulldozed and deposited at the maximum extent of the glacier.",
                "Highly pressurized subglacial water.",
                "A smooth sheet of exposed bedrock."
            ],
            correctAnswer: 1,
            explanation: "Terminal moraines are massive ridges of chaotic, unsorted debris (till) that the glacier acts like a conveyor belt to transport and dump at its furthest point of advance, marking its maximum historical extent."
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
export function createGlacierFlow() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
