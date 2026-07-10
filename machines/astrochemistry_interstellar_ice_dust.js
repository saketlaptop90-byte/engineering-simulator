import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // ==========================================
    // 1. CUSTOM ASTROCHEMISTRY MATERIALS
    // ==========================================
    const silicateMaterial = new THREE.MeshStandardMaterial({
        color: 0x5a5a5a,
        roughness: 0.9,
        metalness: 0.2,
        bumpScale: 0.2,
        wireframe: false
    });

    const h2oIceMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x88ccff,
        transmission: 0.8,
        opacity: 1.0,
        transparent: true,
        metalness: 0.1,
        roughness: 0.2,
        ior: 1.31,
        thickness: 5.0,
        specularIntensity: 1.0,
        side: THREE.DoubleSide
    });

    const coIceMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffeebb,
        transmission: 0.6,
        opacity: 0.9,
        transparent: true,
        metalness: 0.0,
        roughness: 0.4,
        ior: 1.25,
        thickness: 3.0,
        side: THREE.DoubleSide
    });

    const organicsMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x442211,
        transmission: 0.2,
        opacity: 0.95,
        transparent: true,
        metalness: 0.1,
        roughness: 0.8,
        clearcoat: 0.3,
        side: THREE.DoubleSide
    });

    const uvPhotonMaterial = new THREE.MeshStandardMaterial({
        color: 0xaa00ff,
        emissive: 0xcc55ff,
        emissiveIntensity: 3.0,
        roughness: 0,
        metalness: 0
    });

    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 2.0
    });

    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 2.0
    });

    const atomH = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
    const atomC = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.4 });
    const atomO = new THREE.MeshStandardMaterial({ color: 0xff0000, roughness: 0.2 });
    const atomN = new THREE.MeshStandardMaterial({ color: 0x0000ff, roughness: 0.2 });
    const bondMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.3, metalness: 0.6 });

    // ==========================================
    // 2. HELPER FUNCTIONS
    // ==========================================
    function createIrregularGeometry(radius, detail, noiseScale, seed) {
        const geo = new THREE.IcosahedronGeometry(radius, detail);
        const posAttribute = geo.attributes.position;
        const vertex = new THREE.Vector3();
        for (let i = 0; i < posAttribute.count; i++) {
            vertex.fromBufferAttribute(posAttribute, i);
            const noise = (Math.sin(vertex.x * seed) + Math.cos(vertex.y * seed * 1.5) + Math.sin(vertex.z * seed * 0.8)) * noiseScale;
            vertex.add(vertex.clone().normalize().multiplyScalar(noise));
            posAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
        }
        geo.computeVertexNormals();
        return geo;
    }

    function createAtom(r, mat) {
        return new THREE.Mesh(new THREE.SphereGeometry(r, 16, 16), mat);
    }
    
    function createBond(length) {
        const bond = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, length, 8), bondMat);
        bond.rotation.x = Math.PI / 2;
        const wrapper = new THREE.Group();
        wrapper.add(bond);
        bond.position.z = length / 2;
        return wrapper;
    }

    // ==========================================
    // 3. THE DUST GRAIN & ICE MANTLES
    // ==========================================
    const grainGroup = new THREE.Group();
    group.add(grainGroup);
    meshes.grainGroup = grainGroup;

    // Silicate Core
    const coreRadius = 60;
    const coreGeom = createIrregularGeometry(coreRadius, 5, 12, 1.1);
    const coreMesh = new THREE.Mesh(coreGeom, silicateMaterial);
    grainGroup.add(coreMesh);
    
    parts.push({
        name: 'Amorphous Silicate Core',
        description: 'The massive, jagged foundation of the interstellar dust grain formed in stellar outflows. Features immense fractal surface area.',
        material: 'Silicate (Mg/Fe/SiO4)',
        function: 'Catalytic surface for H2 formation and base substrate for ice mantle accretion.',
        assemblyOrder: 1,
        connections: ['h2o_ice_mantle'],
        failureEffect: 'Loss of substrate; cloud chemistry crashes.',
        cascadeFailures: ['ice_collapse', 'organic_loss'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -150, z: 0 }
    });

    // Add immense complexity to the core via nodules
    const noduleGroup = new THREE.Group();
    coreMesh.add(noduleGroup);
    for(let i=0; i<15; i++) {
        const nr = 10 + Math.random() * 15;
        const nMesh = new THREE.Mesh(createIrregularGeometry(nr, 3, 5, i*2.2), silicateMaterial);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        const r = coreRadius * 0.8;
        nMesh.position.set(r*Math.sin(phi)*Math.cos(theta), r*Math.sin(phi)*Math.sin(theta), r*Math.cos(phi));
        nMesh.rotation.set(Math.random(), Math.random(), Math.random());
        noduleGroup.add(nMesh);
    }

    // H2O Ice Mantle
    const h2oRadius = 75;
    const h2oGeom = createIrregularGeometry(h2oRadius, 5, 8, 3.3);
    const h2oMesh = new THREE.Mesh(h2oGeom, h2oIceMaterial);
    grainGroup.add(h2oMesh);
    meshes.h2oIce = h2oMesh;

    parts.push({
        name: 'Polar H2O Ice Mantle',
        description: 'The inner, translucent layer of amorphous solid water. Highly complex and crystalline in places.',
        material: 'Amorphous Solid Water (ASW)',
        function: 'Traps volatiles and mediates photochemistry.',
        assemblyOrder: 2,
        connections: ['silicate_core', 'co_ice_mantle'],
        failureEffect: 'Volatile depletion.',
        cascadeFailures: ['photochemical_matrix_loss'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 150 }
    });

    // CO Ice Mantle
    const coRadius = 85;
    const coGeom = createIrregularGeometry(coRadius, 5, 6, 4.4);
    const coMesh = new THREE.Mesh(coGeom, coIceMaterial);
    grainGroup.add(coMesh);
    meshes.coIce = coMesh;

    parts.push({
        name: 'Apolar CO/CO2 Ice Mantle',
        description: 'Outer frozen layer of carbon monoxide and dioxide resulting from catastrophic freeze-out.',
        material: 'Solid CO/CO2',
        function: 'Carbon reservoir for prebiotic chemistry.',
        assemblyOrder: 3,
        connections: ['h2o_ice_mantle', 'complex_organics'],
        failureEffect: 'No carbon precursors for organics.',
        cascadeFailures: ['astrobiological_sterility'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -150 }
    });

    // Complex Organics Maculas
    const organicsGroup = new THREE.Group();
    grainGroup.add(organicsGroup);
    for(let i=0; i<25; i++) {
        const or = 8 + Math.random() * 8;
        const oMesh = new THREE.Mesh(createIrregularGeometry(or, 3, 4, i*1.1), organicsMaterial);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        const r = coRadius - 2 + Math.random()*3;
        oMesh.position.set(r*Math.sin(phi)*Math.cos(theta), r*Math.sin(phi)*Math.sin(theta), r*Math.cos(phi));
        organicsGroup.add(oMesh);
    }
    
    parts.push({
        name: 'Complex Organic Maculas (COMs)',
        description: 'Dark, highly processed patches of tholins and complex organic molecules synthesised via UV processing.',
        material: 'Tholin Residue',
        function: 'Prebiotic chemical storage.',
        assemblyOrder: 4,
        connections: ['co_ice_mantle'],
        failureEffect: 'Loss of life precursors.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 150, y: 0, z: 0 }
    });

    // ==========================================
    // 4. EMBEDDED MOLECULES (Methanol & Water)
    // ==========================================
    const molGroup = new THREE.Group();
    grainGroup.add(molGroup);
    meshes.molecules = [];

    function buildMethanol() {
        const m = new THREE.Group();
        const c = createAtom(1.5, atomC);
        const o = createAtom(1.3, atomO); o.position.set(3, 0, 0);
        const h1 = createAtom(0.9, atomH); h1.position.set(-1, 2.5, 1);
        const h2 = createAtom(0.9, atomH); h2.position.set(-1, -2.5, 1);
        const h3 = createAtom(0.9, atomH); h3.position.set(-1, 0, -2.5);
        const h4 = createAtom(0.9, atomH); h4.position.set(4.5, 2, 0);
        m.add(c, o, h1, h2, h3, h4);
        
        const bCO = createBond(3); bCO.lookAt(o.position); m.add(bCO);
        const bCH1 = createBond(c.position.distanceTo(h1.position)); bCH1.lookAt(h1.position); m.add(bCH1);
        const bCH2 = createBond(c.position.distanceTo(h2.position)); bCH2.lookAt(h2.position); m.add(bCH2);
        const bCH3 = createBond(c.position.distanceTo(h3.position)); bCH3.lookAt(h3.position); m.add(bCH3);
        const bOH = createBond(o.position.distanceTo(h4.position)); bOH.position.copy(o.position); bOH.lookAt(h4.position); m.add(bOH);
        return m;
    }

    for(let i=0; i<40; i++) {
        const mol = buildMethanol();
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        const r = coRadius + Math.random() * 5;
        mol.position.set(r*Math.sin(phi)*Math.cos(theta), r*Math.sin(phi)*Math.sin(theta), r*Math.cos(phi));
        mol.lookAt(0,0,0);
        mol.scale.set(0.8, 0.8, 0.8);
        molGroup.add(mol);
        meshes.molecules.push({ mesh: mol, basePos: mol.position.clone(), phase: Math.random() * Math.PI * 2 });
    }

    parts.push({
        name: 'Surface Methanol Structures',
        description: 'Microscopic 3D representations of CH3OH synthesised on the grain surface.',
        material: 'Methanol Ice',
        function: 'Hub molecule for complex astrobiology.',
        assemblyOrder: 5,
        connections: ['co_ice_mantle'],
        failureEffect: 'Halt in sugar synthesis.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -150, y: 0, z: 0 }
    });

    // ==========================================
    // 5. HYPER-REALISTIC NANO-ROVER (The Harvester)
    // ==========================================
    // A heavy-duty engineering vehicle parked on top of the dust grain.
    const roverGroup = new THREE.Group();
    // Position it at the top of the grain (Y = coRadius)
    roverGroup.position.set(0, coRadius - 2, 0);
    group.add(roverGroup);
    meshes.rover = roverGroup;

    // A. Chassis
    const chassisShape = new THREE.Shape();
    chassisShape.moveTo(-10, -3);
    chassisShape.lineTo(15, -3);
    chassisShape.lineTo(18, 0);
    chassisShape.lineTo(15, 3);
    chassisShape.lineTo(-10, 3);
    chassisShape.lineTo(-12, 0);
    chassisShape.lineTo(-10, -3);
    const chassisExtrude = { depth: 10, bevelEnabled: true, bevelThickness: 0.5, bevelSize: 0.5, bevelSegments: 4 };
    const chassisGeom = new THREE.ExtrudeGeometry(chassisShape, chassisExtrude);
    chassisGeom.center(); // Center it
    const chassis = new THREE.Mesh(chassisGeom, darkSteel);
    chassis.position.y = 8;
    roverGroup.add(chassis);

    parts.push({
        name: 'Nano-Rover Main Chassis',
        description: 'Heavy-duty extruded dark steel chassis of the microscopic ice harvester vehicle.',
        material: 'Dark Steel / Carbon Nanotubes',
        function: 'Provides structural integrity for the extraction operations on the astrochemical ice.',
        assemblyOrder: 6,
        connections: ['suspension', 'cabin', 'boom_base'],
        failureEffect: 'Total vehicle collapse.',
        cascadeFailures: ['mission_failure'],
        originalPosition: { x: 0, y: coRadius + 6, z: 0 },
        explodedPosition: { x: 0, y: coRadius + 60, z: 0 }
    });

    // B. Operator Cabin
    const cabinShape = new THREE.Shape();
    cabinShape.moveTo(-5, 0);
    cabinShape.lineTo(5, 0);
    cabinShape.lineTo(4, 6);
    cabinShape.lineTo(-4, 6);
    cabinShape.lineTo(-5, 0);
    const cabinGeom = new THREE.ExtrudeGeometry(cabinShape, { depth: 8, bevelEnabled: true, bevelThickness: 0.2, bevelSize: 0.2 });
    cabinGeom.center();
    const cabin = new THREE.Mesh(cabinGeom, steel);
    cabin.position.set(-2, 14, 0);
    roverGroup.add(cabin);

    // Tinted glass windows
    const windowGeom = new THREE.BoxGeometry(7, 4, 8.2);
    const windows = new THREE.Mesh(windowGeom, tinted);
    windows.position.set(-2, 14.5, 0);
    roverGroup.add(windows);

    // Interior: Control Panel & Steering
    const consoleGeom = new THREE.BoxGeometry(3, 2, 6);
    const controlPanel = new THREE.Mesh(consoleGeom, plastic);
    controlPanel.position.set(1, 13, 0);
    roverGroup.add(controlPanel);

    // Glowing screens on panel
    const screenGeom = new THREE.PlaneGeometry(1.5, 1);
    const screen1 = new THREE.Mesh(screenGeom, neonBlue);
    screen1.position.set(2.51, 13.5, 1);
    screen1.rotation.y = Math.PI / 2;
    roverGroup.add(screen1);
    const screen2 = new THREE.Mesh(screenGeom, neonRed);
    screen2.position.set(2.51, 13.5, -1);
    screen2.rotation.y = Math.PI / 2;
    roverGroup.add(screen2);

    // Steering Wheel & Joysticks
    const steerGeom = new THREE.TorusGeometry(0.8, 0.15, 8, 24);
    const steeringWheel = new THREE.Mesh(steerGeom, rubber);
    steeringWheel.position.set(1.5, 14.5, 0);
    steeringWheel.rotation.y = Math.PI / 2;
    steeringWheel.rotation.x = -Math.PI / 6;
    roverGroup.add(steeringWheel);
    meshes.steeringWheel = steeringWheel;

    const joyGeom = new THREE.CylinderGeometry(0.1, 0.1, 1.5);
    const joystick1 = new THREE.Mesh(joyGeom, aluminum);
    joystick1.position.set(1.5, 14, 2);
    roverGroup.add(joystick1);
    const joystick2 = new THREE.Mesh(joyGeom, aluminum);
    joystick2.position.set(1.5, 14, -2);
    roverGroup.add(joystick2);

    parts.push({
        name: 'Microscopic Operator Cabin & Controls',
        description: 'Pressurized cabin with tinted windows, neon glowing control screens, steering wheels, and joysticks.',
        material: 'Steel, Tinted Glass, Plastic',
        function: 'Houses the nanobot operator executing precise extraction of complex organics.',
        assemblyOrder: 7,
        connections: ['chassis'],
        failureEffect: 'Loss of vehicle control.',
        cascadeFailures: ['boom_crash'],
        originalPosition: { x: -2, y: coRadius + 14, z: 0 },
        explodedPosition: { x: -30, y: coRadius + 80, z: 0 }
    });

    // C. Tires and Rims
    function buildTire() {
        const tGroup = new THREE.Group();
        // Main rubber torus
        const tGeom = new THREE.TorusGeometry(3, 1.5, 16, 64);
        const tMesh = new THREE.Mesh(tGeom, rubber);
        tGroup.add(tMesh);
        // Hundreds of tiny extruded lugs for off-road traction
        const lugGeom = new THREE.BoxGeometry(2.0, 0.8, 1.2);
        for(let i=0; i<40; i++) {
            const angle = (i / 40) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeom, rubber);
            lug.position.set(Math.cos(angle) * 3, Math.sin(angle) * 3, 0);
            lug.rotation.z = angle;
            tGroup.add(lug);
        }
        // Rim
        const rimGeom = new THREE.CylinderGeometry(2.2, 2.2, 2.0, 32);
        const rim = new THREE.Mesh(rimGeom, aluminum);
        rim.rotation.x = Math.PI / 2;
        tGroup.add(rim);
        // Complex spokes
        const spokeGeom = new THREE.CylinderGeometry(0.2, 0.2, 4.4, 8);
        for(let i=0; i<6; i++) {
            const spoke = new THREE.Mesh(spokeGeom, chrome);
            spoke.rotation.z = (i / 6) * Math.PI;
            tGroup.add(spoke);
        }
        return tGroup;
    }

    const wheels = [];
    const wheelPositions = [
        { x: 10, y: 3.5, z: 7 },
        { x: -10, y: 3.5, z: 7 },
        { x: 10, y: 3.5, z: -7 },
        { x: -10, y: 3.5, z: -7 }
    ];

    wheelPositions.forEach((pos, idx) => {
        const w = buildTire();
        w.position.set(pos.x, pos.y, pos.z);
        roverGroup.add(w);
        wheels.push(w);
        
        parts.push({
            name: `Heavy Off-Road Tire Array ${idx+1}`,
            description: `Torus geometry with aggressive box-geometry treads and cylindrical chrome spokes for maximum traction on astrochemical ice.`,
            material: 'Synthetic Rubber / Aluminum / Chrome',
            function: 'Provides mobility across the highly irregular, freezing surface of the dust grain.',
            assemblyOrder: 8 + idx,
            connections: ['chassis_axle'],
            failureEffect: 'Loss of mobility; rover becomes stranded.',
            cascadeFailures: [],
            originalPosition: { x: pos.x, y: coRadius + pos.y, z: pos.z },
            explodedPosition: { x: pos.x * 3, y: coRadius + pos.y, z: pos.z * 3 }
        });
    });
    meshes.wheels = wheels;

    // D. Articulated Hydraulic Boom & Drill
    const boomGroup = new THREE.Group();
    boomGroup.position.set(12, 10, 0);
    roverGroup.add(boomGroup);
    
    // Boom Base Turret
    const turretGeom = new THREE.CylinderGeometry(2, 2, 3, 16);
    const turret = new THREE.Mesh(turretGeom, steel);
    boomGroup.add(turret);

    // Boom Arm
    const armGroup = new THREE.Group();
    armGroup.position.set(0, 1.5, 0);
    boomGroup.add(armGroup);
    meshes.boomArm = armGroup;

    const armGeom = new THREE.BoxGeometry(16, 1.5, 1.5);
    armGeom.translate(8, 0, 0);
    const armMesh = new THREE.Mesh(armGeom, aluminum);
    armGroup.add(armMesh);

    // Drill attached to the end of the arm
    const drillGroup = new THREE.Group();
    drillGroup.position.set(16, 0, 0);
    armGroup.add(drillGroup);
    
    const drillConeGeom = new THREE.ConeGeometry(1, 4, 16);
    drillConeGeom.translate(0, -2, 0);
    const drillCone = new THREE.Mesh(drillConeGeom, chrome);
    drillGroup.add(drillCone);
    meshes.drill = drillGroup;

    parts.push({
        name: 'Articulated Hydraulic Boom & Extractor Drill',
        description: 'Massive articulated arm culminating in a high-speed chrome drill cone.',
        material: 'Aluminum / Chrome',
        function: 'Drills through the CO2 ice mantle to extract trapped complex organics.',
        assemblyOrder: 12,
        connections: ['chassis', 'hydraulic_pistons'],
        failureEffect: 'Inability to extract resources.',
        cascadeFailures: ['mission_failure'],
        originalPosition: { x: 12, y: coRadius + 10, z: 0 },
        explodedPosition: { x: 50, y: coRadius + 50, z: 0 }
    });

    // E. Hydraulic Pistons (Cylinder in Cylinder)
    const pistonGroup = new THREE.Group();
    roverGroup.add(pistonGroup);

    // Base mount on chassis
    const pistonBasePos = new THREE.Vector3(5, 10, 0);
    // Outer cylinder
    const pistonOuterGroup = new THREE.Group();
    pistonOuterGroup.position.copy(pistonBasePos);
    pistonGroup.add(pistonOuterGroup);
    
    const pOuterGeom = new THREE.CylinderGeometry(0.6, 0.6, 6, 16);
    pOuterGeom.translate(0, 3, 0);
    pOuterGeom.rotateX(Math.PI / 2); // align along +Z
    const pistonOuter = new THREE.Mesh(pOuterGeom, darkSteel);
    pistonOuterGroup.add(pistonOuter);

    // Inner cylinder
    const pInnerGeom = new THREE.CylinderGeometry(0.4, 0.4, 6, 16);
    pInnerGeom.translate(0, 3, 0);
    pInnerGeom.rotateX(Math.PI / 2);
    const pistonInner = new THREE.Mesh(pInnerGeom, chrome);
    pistonOuterGroup.add(pistonInner);
    
    meshes.piston = {
        outer: pistonOuterGroup,
        inner: pistonInner,
        basePos: pistonBasePos,
        armOffset: new THREE.Vector3(8, -0.75, 0) // Where it attaches on the arm
    };

    parts.push({
        name: 'Heavy Hydraulic Actuation System',
        description: 'Nested cylindrical pistons driving the main boom arm articulation with incredible force.',
        material: 'Dark Steel / Chrome',
        function: 'Translates fluid pressure into immense mechanical leverage.',
        assemblyOrder: 13,
        connections: ['chassis', 'boom_arm'],
        failureEffect: 'Boom arm collapses under gravity.',
        cascadeFailures: ['drill_destruction'],
        originalPosition: { x: 5, y: coRadius + 10, z: 0 },
        explodedPosition: { x: 10, y: coRadius + 40, z: -20 }
    });

    // F. Hydraulic Lines / Hoses (TubeGeometry)
    class HoseCurve extends THREE.Curve {
        constructor() { super(); }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const x = 5 + t * 7;
            const y = 8 + Math.sin(t * Math.PI) * 4;
            const z = 2;
            return optionalTarget.set(x, y, z);
        }
    }
    const hoseGeom = new THREE.TubeGeometry(new HoseCurve(), 20, 0.2, 8, false);
    const hoseMesh = new THREE.Mesh(hoseGeom, rubber);
    roverGroup.add(hoseMesh);

    parts.push({
        name: 'Flexible Hydraulic Tubing',
        description: 'Thick, high-pressure synthetic rubber hoses (TubeGeometry) routing fluid to the pistons.',
        material: 'Reinforced Rubber',
        function: 'Delivers hydraulic fluid from the central pumps to the boom actuators.',
        assemblyOrder: 14,
        connections: ['hydraulic_pumps', 'pistons'],
        failureEffect: 'Catastrophic fluid leak; loss of actuation pressure.',
        cascadeFailures: ['piston_lock', 'boom_drop'],
        originalPosition: { x: 8, y: coRadius + 10, z: 2 },
        explodedPosition: { x: 8, y: coRadius + 30, z: 20 }
    });

    // G. Exhaust Stacks & Grilles
    const exhaustGeom = new THREE.CylinderGeometry(0.5, 0.5, 4, 16);
    const ex1 = new THREE.Mesh(exhaustGeom, darkSteel);
    ex1.position.set(-12, 10, 3);
    roverGroup.add(ex1);
    const ex2 = new THREE.Mesh(exhaustGeom, darkSteel);
    ex2.position.set(-12, 10, -3);
    roverGroup.add(ex2);
    
    // Front grille
    const grilleGroup = new THREE.Group();
    for(let i=0; i<6; i++) {
        const bar = new THREE.Mesh(new THREE.BoxGeometry(0.2, 4, 8), chrome);
        bar.position.set(15.1 + i*0.4, 8, 0);
        grilleGroup.add(bar);
    }
    roverGroup.add(grilleGroup);

    parts.push({
        name: 'Twin Exhaust Stacks & Cooling Grille',
        description: 'Rear vertical exhaust cylinders and front interlaced chrome cooling grilles.',
        material: 'Dark Steel / Chrome',
        function: 'Vents extreme heat and waste particles generated by the nanobot fusion reactor.',
        assemblyOrder: 15,
        connections: ['chassis', 'reactor'],
        failureEffect: 'Reactor overheats.',
        cascadeFailures: ['meltdown'],
        originalPosition: { x: -12, y: coRadius + 10, z: 3 },
        explodedPosition: { x: -40, y: coRadius + 10, z: 30 }
    });

    // ==========================================
    // 6. DYNAMIC PARTICLE SYSTEMS
    // ==========================================
    
    // A. UV Photon Bombardment from space
    const photonGroup = new THREE.Group();
    group.add(photonGroup);
    meshes.photons = [];
    
    for (let i = 0; i < 150; i++) {
        const photon = new THREE.Mesh(new THREE.SphereGeometry(0.8, 8, 8), uvPhotonMaterial);
        const dist = 200 + Math.random() * 100;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        photon.position.set(dist*Math.sin(phi)*Math.cos(theta), dist*Math.sin(phi)*Math.sin(theta), dist*Math.cos(phi));
        const velocity = photon.position.clone().normalize().multiplyScalar(-(30 + Math.random() * 40));
        photonGroup.add(photon);
        meshes.photons.push({ mesh: photon, velocity: velocity, active: true, originalDist: dist });
    }

    // B. Rover Exhaust Smoke
    const smokeGroup = new THREE.Group();
    roverGroup.add(smokeGroup);
    meshes.smokeParticles = [];
    const smokeMat = new THREE.MeshBasicMaterial({ color: 0x444444, transparent: true, opacity: 0.6 });
    for(let i=0; i<30; i++) {
        const s = new THREE.Mesh(new THREE.SphereGeometry(0.6, 4, 4), smokeMat);
        s.visible = false;
        smokeGroup.add(s);
        meshes.smokeParticles.push({ mesh: s, life: 0, maxLife: 1.5, vel: new THREE.Vector3() });
    }

    parts.push({
        name: 'Interstellar UV Radiation Field & Photochemistry',
        description: 'Simulated high-energy Lyman-alpha photons bombarding the ice mantle, alongside rover exhaust emissions.',
        material: 'Energy / Particulates',
        function: 'Drives non-thermal photodesorption and powers the radical synthesis of organics in the ice.',
        assemblyOrder: 16,
        connections: ['grain_surface'],
        failureEffect: 'No chemistry occurs.',
        cascadeFailures: [],
        originalPosition: { x: 100, y: 100, z: 100 },
        explodedPosition: { x: 200, y: 200, z: 200 }
    });

    // ==========================================
    // 7. METADATA & QUIZ
    // ==========================================
    const description = "The Interstellar Ice Dust & Harvester model is a massive, hyper-realistic 3D simulation bridging astrochemistry and advanced mechanical engineering. At its core lies a colossal, highly irregular Amorphous Silicate Dust Grain, enveloped by multiple distinct layers of astrochemical ice (Polar H2O and Apolar CO/CO2), and speckled with Complex Organic Maculas (COMs) where methanol molecules are physically modeled. To explore this microscopic world, a highly complex, heavy-duty Nano-Rover has been deployed on the surface. This massive vehicle features fully articulated off-road tires with hundreds of extruded lugs, complex chrome spoked rims, a pressurized operator cabin with tinted windows and neon glowing control panels, twin exhaust stacks, and a massive hydraulic boom arm driven by nested cylindrical pistons and flexible rubber tubing. The entire scene is alive: the grain tumbles, UV photons bombard the ice causing localized flashes, the rover drives along the surface, its hydraulic arm articulates with perfect mathematical precision, the drill spins, and exhaust smoke billows into the void.";

    const quizQuestions = [
        {
            question: "In the context of the modeled interstellar dust grain, what is the role of the Amorphous Silicate Core?",
            options: [
                "It emits UV radiation to melt the ice.",
                "It provides an immense, fractal catalytic surface area for atoms to accrete, migrate, and react to form molecules like H2.",
                "It serves as a fuel tank for the Nano-Rover.",
                "It magnetically repels complex organic molecules."
            ],
            correctAnswer: 1,
            explanation: "The silicate core is the foundational substrate. Its irregular geometry provides deep potential wells where atoms can trap, meet, and chemically react."
        },
        {
            question: "Why does the model feature two distinct main ice layers (H2O and CO/CO2)?",
            options: [
                "Water is heavier and sinks below the CO.",
                "They represent different phases of molecular cloud collapse; water freezes out early at higher temperatures (~100K), while CO freezes out catastrophically later at ~20K.",
                "The Nano-Rover separated them using its drill.",
                "UV photons naturally push CO to the outside."
            ],
            correctAnswer: 1,
            explanation: "Ice mantles form sequentially based on volatility. H2O is less volatile and forms the inner polar layer, while highly volatile CO freezes only in the coldest, densest cloud cores."
        },
        {
            question: "Observe the Nano-Rover's hydraulic piston. Mathematically, how does the inner cylinder maintain connection with the moving boom arm?",
            options: [
                "It relies purely on gravity to slide down.",
                "It continuously re-calculates its angle (via trigonometry/LookAt) and adjusts its scale/position to bridge the distance between the fixed chassis anchor and the dynamic boom anchor.",
                "It is a static mesh that just clips through the arm.",
                "It bends like a rubber hose."
            ],
            correctAnswer: 1,
            explanation: "To animate realistically, the piston must calculate the vector between its base and the attachment point on the articulating arm, orienting itself and extending exactly to that length."
        },
        {
            question: "What astrochemical process is simulated by the purple glowing particles (UV Photons) impacting the ice surface?",
            options: [
                "Thermal ablation, melting the entire grain.",
                "Non-thermal photodesorption and photochemistry, where single photon impacts break specific molecular bonds to create reactive radicals without heating the bulk grain.",
                "Adding more silicate to the core.",
                "Charging the Nano-Rover's batteries."
            ],
            correctAnswer: 1,
            explanation: "In the 10K environment of a dense cloud, thermal reactions are halted. UV photons provide the localized energy spikes needed to break bonds and drive complex organic synthesis."
        },
        {
            question: "What is the mechanical purpose of the hundreds of tiny BoxGeometry 'lugs' arrayed on the rover's TorusGeometry tires?",
            options: [
                "To make the tires look aesthetically pleasing.",
                "To dramatically increase the polygon count for no reason.",
                "To function as aggressive off-road treads, providing essential mechanical grip and traction on the highly irregular, slippery astrochemical ice surface.",
                "To puncture the ice and release trapped gases."
            ],
            correctAnswer: 2,
            explanation: "Standard smooth tires (pure Torus) would slip on ice. Extruded treads dig into the microscopic asperities of the surface, translating rotational torque into forward momentum."
        }
    ];

    // ==========================================
    // 8. ANIMATION LOOP
    // ==========================================
    function animate(time, speed, meshes) {
        const delta = 0.016 * speed;

        // 1. Tumbling of the Grain and Rover as a unit
        meshes.grainGroup.rotation.y += 0.05 * delta;
        meshes.grainGroup.rotation.x += 0.02 * delta;
        meshes.rover.position.x = Math.sin(time * 0.2 * speed) * 5; // Rover drives slightly back and forth
        
        // 2. Animate Wheels & Steering
        meshes.wheels.forEach(w => {
            w.rotation.z -= 2.0 * delta * Math.cos(time * 0.2 * speed); // Roll
        });
        meshes.steeringWheel.rotation.z = Math.sin(time * speed) * 0.5;

        // 3. Articulate Hydraulic Boom & Drill
        // Sine wave for smooth up/down motion
        const boomAngle = (Math.sin(time * 1.5 * speed) * 0.4) - 0.2; // -0.6 to +0.2 radians
        meshes.boomArm.rotation.z = boomAngle;
        
        // Spin the drill
        meshes.drill.rotation.x += 15 * delta;

        // 4. IK for Hydraulic Piston
        const pOuter = meshes.piston.outer;
        const pInner = meshes.piston.inner;
        const bPos = meshes.piston.basePos; // chassis local
        
        // Find world/local pos of arm attachment
        // Arm pivot is at (0, 1.5, 0) relative to boomGroup which is at (12, 10, 0)
        // Let's do it purely in roverGroup space.
        // boomGroup is at (12, 10, 0). Arm pivot is (12, 11.5, 0).
        const pivotX = 12;
        const pivotY = 11.5;
        
        // offset in arm space
        const ox = meshes.piston.armOffset.x;
        const oy = meshes.piston.armOffset.y;
        
        // Rotate offset by boomAngle
        const attachX = pivotX + (ox * Math.cos(boomAngle) - oy * Math.sin(boomAngle));
        const attachY = pivotY + (ox * Math.sin(boomAngle) + oy * Math.cos(boomAngle));
        
        // Vector from piston base to attachment
        const dx = attachX - bPos.x;
        const dy = attachY - bPos.y;
        
        // Calculate angle and distance in 2D (Z=0 plane)
        const angle = Math.atan2(dy, dx);
        const dist = Math.hypot(dx, dy);
        
        // Apply rotation to outer group (it rotates around Z)
        pOuter.rotation.z = angle;
        // The cylinder geometry was aligned to +Z by rotateX(PI/2) initially, 
        // wait, we rotated X so it points along Z.
        // If we rotate Z of the group, it spins around Z, but we want it to point towards the target.
        // Since we are in XY plane, pointing means rotating around Z! 
        // But if geometry is along Z, rotating around Z just rolls it.
        // Let's use lookAt. It's much easier.
        
        const targetPos = new THREE.Vector3(attachX, attachY, 0);
        // pOuter is in roverGroup space.
        // lookAt requires world space if object is in world, but since roverGroup is root of these, we can use localToWorld
        const pOuterWorld = pOuter.getWorldPosition(new THREE.Vector3());
        // fake a target in world
        const targetWorld = meshes.rover.localToWorld(targetPos.clone());
        pOuter.lookAt(targetWorld);
        
        // Scale/Move inner piston to bridge the gap
        // Since outer is 6 units long, base to tip. Inner is also 6.
        // We move inner along Z by distance - some overlap
        pInner.position.z = dist * 0.5;

        // 5. Embedded Molecule Jitter
        meshes.molecules.forEach(m => {
            m.phase += 5 * delta;
            m.mesh.position.x = m.basePos.x + Math.sin(m.phase) * 0.1;
            m.mesh.position.y = m.basePos.y + Math.cos(m.phase * 1.3) * 0.1;
            m.mesh.position.z = m.basePos.z + Math.sin(m.phase * 0.7) * 0.1;
        });

        // 6. UV Photon Bombardment
        meshes.photons.forEach(p => {
            if(p.active) {
                p.mesh.position.addScaledVector(p.velocity, delta);
                if(p.mesh.position.length() < 90) { // hit ice mantle
                    p.active = false;
                    p.mesh.visible = false;
                    // Flash effect
                    meshes.coIce.material.emissive.setHex(0x110033);
                    setTimeout(() => { if(meshes.coIce.material) meshes.coIce.material.emissive.setHex(0x000000); }, 100);
                }
            } else {
                if(Math.random() < 0.05 * speed) {
                    p.active = true;
                    p.mesh.visible = true;
                    const theta = Math.random() * Math.PI * 2;
                    const phi = Math.acos((Math.random() * 2) - 1);
                    p.mesh.position.set(p.originalDist*Math.sin(phi)*Math.cos(theta), p.originalDist*Math.sin(phi)*Math.sin(theta), p.originalDist*Math.cos(phi));
                    p.velocity.copy(p.mesh.position).normalize().multiplyScalar(-(30 + Math.random() * 40));
                }
            }
        });

        // 7. Exhaust Smoke Emission
        if(Math.random() < 0.3 * speed) {
            // find dead particle
            for(let i=0; i<meshes.smokeParticles.length; i++) {
                const s = meshes.smokeParticles[i];
                if(s.life <= 0) {
                    s.life = s.maxLife;
                    // Spawn at one of the exhaust stacks
                    const stackOffset = Math.random() > 0.5 ? 3 : -3;
                    s.mesh.position.set(-12, 12, stackOffset);
                    s.vel.set(-1 + Math.random()*2, 5 + Math.random()*3, -1 + Math.random()*2);
                    s.mesh.visible = true;
                    s.mesh.material.opacity = 0.6;
                    break;
                }
            }
        }
        // Update smoke
        meshes.smokeParticles.forEach(s => {
            if(s.life > 0) {
                s.life -= delta;
                s.mesh.position.addScaledVector(s.vel, delta);
                s.mesh.scale.setScalar(1.0 + (s.maxLife - s.life)); // grow
                s.mesh.material.opacity = (s.life / s.maxLife) * 0.6; // fade
                if(s.life <= 0) s.mesh.visible = false;
            }
        });
    }

    return { group, parts, description, quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createInterstellarIceDust() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
