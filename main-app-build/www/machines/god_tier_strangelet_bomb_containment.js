import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const animatableMeshes = [];

    // ==========================================
    // CUSTOM HIGH-TECH & HYPER-REALISTIC MATERIALS
    // ==========================================
    const strangeletMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000,
        emissive: 0xaa00ff,
        emissiveIntensity: 10,
        roughness: 0.0,
        metalness: 1.0,
        wireframe: false
    });

    const fieldMaterialPrimary = new THREE.MeshStandardMaterial({
        color: 0x00aaff,
        emissive: 0x00aaff,
        emissiveIntensity: 2.5,
        transparent: true,
        opacity: 0.15,
        wireframe: true,
        side: THREE.DoubleSide
    });

    const fieldMaterialSecondary = new THREE.MeshStandardMaterial({
        color: 0xff0055,
        emissive: 0xff0022,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.1,
        wireframe: true,
        side: THREE.DoubleSide
    });

    const plasmaMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffaa00,
        emissiveIntensity: 5.0,
        transparent: true,
        opacity: 0.8
    });

    const glowingScreenMat = new THREE.MeshStandardMaterial({
        color: 0x000000,
        emissive: 0x00ff88,
        emissiveIntensity: 1.5
    });

    const warningLightMat = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 0
    });

    // ==========================================
    // UTILITY BUILDER FUNCTIONS
    // ==========================================
    function createBoltRing(radius, count, yPos, parentGroup, material) {
        const boltGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 6);
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const bolt = new THREE.Mesh(boltGeo, material);
            bolt.position.set(Math.cos(angle) * radius, yPos, Math.sin(angle) * radius);
            bolt.rotation.x = Math.PI / 2;
            bolt.rotation.z = angle;
            parentGroup.add(bolt);
        }
    }

    function createPipeSpline(points, radius, material) {
        const curve = new THREE.CatmullRomCurve3(points);
        const pipeGeo = new THREE.TubeGeometry(curve, 64, radius, 12, false);
        return new THREE.Mesh(pipeGeo, material);
    }

    // ==========================================
    // PART 1: STRANGELET CORE (THE INFECTIOUS NUGGET)
    // ==========================================
    const coreGroup = new THREE.Group();
    const coreGeo = new THREE.IcosahedronGeometry(0.8, 4);
    // Perturb vertices for a jagged, terrifyingly dense look
    const pos = coreGeo.attributes.position;
    for(let i=0; i<pos.count; i++){
        pos.setXYZ(
            i, 
            pos.getX(i) * (0.9 + Math.random()*0.2), 
            pos.getY(i) * (0.9 + Math.random()*0.2), 
            pos.getZ(i) * (0.9 + Math.random()*0.2)
        );
    }
    coreGeo.computeVertexNormals();
    const coreMesh = new THREE.Mesh(coreGeo, strangeletMaterial);
    
    // Core orbiting chaotic fragments
    const fragments = new THREE.Group();
    const fragGeo = new THREE.TetrahedronGeometry(0.1, 1);
    for(let i=0; i<30; i++) {
        const frag = new THREE.Mesh(fragGeo, strangeletMaterial);
        frag.position.set(
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 3
        );
        frag.userData = {
            orbitSpeed: Math.random() * 5 + 2,
            orbitAxis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize(),
            offset: Math.random() * Math.PI * 2
        };
        fragments.add(frag);
    }
    coreGroup.add(coreMesh);
    coreGroup.add(fragments);
    coreGroup.position.set(0, 15, 0);
    group.add(coreGroup);

    parts.push({
        name: "Strangelet Singular Core",
        description: "A terrifyingly dense, infectious nugget of strange matter. Its strong interaction parameters are actively attempting to convert all surrounding hadronic matter into strange quarks. Highly volatile.",
        material: "Strangelet Void/Emissive",
        function: "The target of containment.",
        assemblyOrder: 1,
        connections: ["Inner Confinement Field"],
        failureEffect: "Instantaneous conversion of the planet into a strange star. Total existence failure.",
        cascadeFailures: ["Everything"],
        originalPosition: coreGroup.position.clone(),
        explodedPosition: new THREE.Vector3(0, 45, 0)
    });
    animatableMeshes.push({ mesh: coreMesh, type: 'thrash', intensity: 1.0 });
    animatableMeshes.push({ mesh: fragments, type: 'fragments_orbit', fragmentsList: fragments.children });

    // ==========================================
    // PART 2 & 3: ELECTROMAGNETIC CONFINEMENT FIELDS
    // ==========================================
    const innerFieldGeo = new THREE.IcosahedronGeometry(2.5, 3);
    const innerField = new THREE.Mesh(innerFieldGeo, fieldMaterialSecondary);
    innerField.position.copy(coreGroup.position);
    group.add(innerField);

    const outerFieldGeo = new THREE.IcosahedronGeometry(4.5, 4);
    const outerField = new THREE.Mesh(outerFieldGeo, fieldMaterialPrimary);
    outerField.position.copy(coreGroup.position);
    group.add(outerField);

    parts.push({
        name: "Secondary Chromodynamic Repulsion Field",
        description: "Projects high-frequency localized gluon-field disruptions to prevent the strangelet's color-flavor locked surface from interacting with normal baryonic matter.",
        material: "Photon/Gluon Plasma",
        function: "Inner boundary of defense.",
        assemblyOrder: 2,
        connections: ["Strangelet Singular Core", "Primary Confinement Field"],
        failureEffect: "Strangelet begins absorbing the vacuum energy, expanding rapidly.",
        cascadeFailures: ["Primary Confinement Field"],
        originalPosition: innerField.position.clone(),
        explodedPosition: new THREE.Vector3(-10, 25, 0)
    });
    
    parts.push({
        name: "Primary Electromagnetic Cage",
        description: "A massive, hyper-redundant cage operating at 10^15 Tesla. It physically levitates the strange matter chunk via extreme diamagnetism.",
        material: "Hardlight/Electromagnetic",
        function: "Outer boundary of defense.",
        assemblyOrder: 3,
        connections: ["Magnetic Torus Rings"],
        failureEffect: "Physical breach of containment.",
        cascadeFailures: ["Base Housing"],
        originalPosition: outerField.position.clone(),
        explodedPosition: new THREE.Vector3(10, 25, 0)
    });

    animatableMeshes.push({ mesh: innerField, type: 'pulse_field', baseScale: 1.0, speed: 15, warningMat: warningLightMat });
    animatableMeshes.push({ mesh: outerField, type: 'rotate_field', speed: 1.5 });

    // ==========================================
    // PART 4 - 6: SUPERCONDUCTING MAGNETIC TORUS RINGS
    // ==========================================
    const ringGroup = new THREE.Group();
    const rings = [];
    const toruses = [
        { radius: 6, tube: 0.8, rotX: Math.PI/2, rotY: 0, name: "Equatorial Magnetic Pinch Ring" },
        { radius: 6.5, tube: 0.6, rotX: 0, rotY: Math.PI/4, name: "Polar Azimuthal Confinement Ring Alpha" },
        { radius: 6.5, tube: 0.6, rotX: 0, rotY: -Math.PI/4, name: "Polar Azimuthal Confinement Ring Beta" }
    ];

    toruses.forEach((tConfig, index) => {
        const torusGeo = new THREE.TorusGeometry(tConfig.radius, tConfig.tube, 32, 100);
        const torusMesh = new THREE.Mesh(torusGeo, chrome);
        torusMesh.rotation.set(tConfig.rotX, tConfig.rotY, 0);
        
        // Add highly detailed flux emitter lugs around the torus
        const lugCount = 36;
        const lugGeo = new THREE.BoxGeometry(tConfig.tube*2.5, tConfig.tube*0.5, tConfig.tube*1.5);
        for(let i=0; i<lugCount; i++) {
            const angle = (i / lugCount) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeo, darkSteel);
            lug.position.set(Math.cos(angle) * tConfig.radius, Math.sin(angle) * tConfig.radius, 0);
            lug.rotation.z = angle;
            torusMesh.add(lug);
        }
        
        rings.push(torusMesh);
        ringGroup.add(torusMesh);

        parts.push({
            name: tConfig.name,
            description: "Houses liquid-helium cooled YBCO superconducting coils generating the macroscopic levitation forces.",
            material: "Chrome/Superconductors/Dark Steel",
            function: "Generates massive magnetic fields.",
            assemblyOrder: 4 + index,
            connections: ["Coolant Pipes", "Primary Electromagnetic Cage"],
            failureEffect: "Magnetic field collapse resulting in the strangelet falling through the Earth.",
            cascadeFailures: ["Base Station"],
            originalPosition: coreGroup.position.clone(),
            explodedPosition: new THREE.Vector3(0, 15, (index+1)*15)
        });
    });
    ringGroup.position.copy(coreGroup.position);
    group.add(ringGroup);
    animatableMeshes.push({ mesh: rings[1], type: 'gimbal', axis: 'y', speed: 2.0 });
    animatableMeshes.push({ mesh: rings[2], type: 'gimbal', axis: 'x', speed: -1.5 });

    // ==========================================
    // PART 7: EXTREME BASE STATION HOUSING (LATHE & EXTRUDE)
    // ==========================================
    const baseGroup = new THREE.Group();
    
    const basePoints = [];
    basePoints.push(new THREE.Vector2(0.1, 0));
    basePoints.push(new THREE.Vector2(12, 0));
    basePoints.push(new THREE.Vector2(11, 2));
    basePoints.push(new THREE.Vector2(11.5, 2.5));
    basePoints.push(new THREE.Vector2(8, 6));
    basePoints.push(new THREE.Vector2(8, 8));
    basePoints.push(new THREE.Vector2(4, 9));
    basePoints.push(new THREE.Vector2(4, 10));
    basePoints.push(new THREE.Vector2(2.5, 11));
    basePoints.push(new THREE.Vector2(2.5, 12));
    basePoints.push(new THREE.Vector2(0.1, 12));

    const baseGeo = new THREE.LatheGeometry(basePoints, 64);
    const baseMesh = new THREE.Mesh(baseGeo, steel);
    baseGroup.add(baseMesh);

    // Giant Hexagonal Base Plate
    const hexShape = new THREE.Shape();
    const hexRadius = 16;
    for(let i=0; i<6; i++) {
        const angle = (i/6) * Math.PI * 2;
        if(i===0) hexShape.moveTo(Math.cos(angle)*hexRadius, Math.sin(angle)*hexRadius);
        else hexShape.lineTo(Math.cos(angle)*hexRadius, Math.sin(angle)*hexRadius);
    }
    hexShape.lineTo(Math.cos(0)*hexRadius, Math.sin(0)*hexRadius);
    
    const hexExtrudeSettings = { depth: 1, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.5, bevelThickness: 0.5 };
    const basePlateGeo = new THREE.ExtrudeGeometry(hexShape, hexExtrudeSettings);
    const basePlate = new THREE.Mesh(basePlateGeo, darkSteel);
    basePlate.rotation.x = Math.PI / 2;
    basePlate.position.y = 0;
    baseGroup.add(basePlate);

    // Bolting the base
    createBoltRing(10, 32, 2.1, baseGroup, chrome);
    createBoltRing(7.5, 24, 6.1, baseGroup, chrome);

    // Base glowing core shafts
    const shaftGeo = new THREE.CylinderGeometry(1.5, 1.5, 12, 16);
    const shaftMesh = new THREE.Mesh(shaftGeo, glowingScreenMat);
    shaftMesh.position.y = 6;
    baseGroup.add(shaftMesh);

    group.add(baseGroup);

    parts.push({
        name: "Reinforced Neutron-Absorbing Base Foundation",
        description: "Anchors the entire containment unit. Forged from ultra-dense depleted uranium alloys mixed with boron to absorb stray neutron radiation.",
        material: "Depleted Uranium / Dark Steel",
        function: "Structural support and radiation shielding.",
        assemblyOrder: 0,
        connections: ["Magnetic Torus Rings", "Coolant Pumps", "Floor"],
        failureEffect: "Structural collapse under extreme localized gravity.",
        cascadeFailures: ["Everything"],
        originalPosition: baseGroup.position.clone(),
        explodedPosition: new THREE.Vector3(0, -10, 0)
    });
    animatableMeshes.push({ mesh: shaftMesh, type: 'pulse_color', speed: 5 });

    // ==========================================
    // PART 8 - 10: FRANTIC ROBOTIC REPAIR ARMS (IK CHAIN SETUP)
    // ==========================================
    const armGroup = new THREE.Group();
    const arms = [];

    function createRoboticArm(baseAngle, heightOffset, reachLimit) {
        const armBase = new THREE.Group();
        
        // Pivot mount
        const mount = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1, 1, 16), chrome);
        mount.position.y = 0.5;
        armBase.add(mount);

        // Shoulder
        const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.9, 16, 16), steel);
        shoulder.position.y = 1;
        armBase.add(shoulder);

        // Bicep (Extruded shape for complex tech look)
        const bicepShape = new THREE.Shape();
        bicepShape.moveTo(0, -0.5);
        bicepShape.lineTo(0.5, 0);
        bicepShape.lineTo(0.3, reachLimit/2);
        bicepShape.lineTo(-0.3, reachLimit/2);
        bicepShape.lineTo(-0.5, 0);
        bicepShape.lineTo(0, -0.5);
        const bicepGeo = new THREE.ExtrudeGeometry(bicepShape, { depth: 0.6, bevelEnabled: false });
        const bicep = new THREE.Mesh(bicepGeo, darkSteel);
        bicep.position.set(0, 0.5, -0.3); // Offset for joint
        shoulder.add(bicep);

        // Elbow
        const elbow = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.8, 16), chrome);
        elbow.rotation.x = Math.PI / 2;
        elbow.position.set(0, reachLimit/2, 0.3);
        bicep.add(elbow);

        // Forearm
        const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.5, reachLimit/2, 16), steel);
        forearm.position.set(0, reachLimit/4, 0);
        elbow.add(forearm);

        // Wrist & Claw
        const wrist = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 16), chrome);
        wrist.position.set(0, reachLimit/4, 0);
        forearm.add(wrist);

        // Claw fingers
        const fingerGeo = new THREE.BoxGeometry(0.1, 0.8, 0.2);
        const f1 = new THREE.Mesh(fingerGeo, rubber);
        f1.position.set(0.2, 0.4, 0);
        f1.rotation.z = -0.2;
        const f2 = new THREE.Mesh(fingerGeo, rubber);
        f2.position.set(-0.2, 0.4, 0);
        f2.rotation.z = 0.2;
        wrist.add(f1, f2);

        // Hydraulic secondary piston (details)
        const pistonGeo = new THREE.CylinderGeometry(0.1, 0.1, reachLimit/2.5, 8);
        const piston = new THREE.Mesh(pistonGeo, chrome);
        piston.position.set(0.4, reachLimit/4, 0);
        shoulder.add(piston);

        armBase.position.set(Math.cos(baseAngle) * 8, heightOffset, Math.sin(baseAngle) * 8);
        armBase.lookAt(0, heightOffset, 0); // Point inwards

        armGroup.add(armBase);
        
        return { root: armBase, shoulder: shoulder, elbow: elbow, wrist: wrist, f1: f1, f2: f2, currentTarget: new THREE.Vector3(), targetTime: 0 };
    }

    const arm1 = createRoboticArm(0, 3, 10);
    const arm2 = createRoboticArm(Math.PI * 0.66, 3, 10);
    const arm3 = createRoboticArm(Math.PI * 1.33, 3, 10);
    arms.push(arm1, arm2, arm3);

    group.add(armGroup);

    ["Alpha", "Beta", "Gamma"].forEach((designation, index) => {
        parts.push({
            name: `Hyper-Articulated Repair Automaton ${designation}`,
            description: "Extremely fast, AI-driven robotic limb designed to instantly weld and replace blown micro-emitters on the primary confinement field as they are continuously destroyed by particle spray.",
            material: "Titanium/Steel/Rubber",
            function: "Active real-time damage mitigation.",
            assemblyOrder: 7 + index,
            connections: ["Base Foundation", "Confinement Fields"],
            failureEffect: "Containment field decay exceeds repair rate. Catastrophic breach.",
            cascadeFailures: ["Confinement Fields"],
            originalPosition: arms[index].root.position.clone(),
            explodedPosition: new THREE.Vector3(Math.cos(index)*20, 5, Math.sin(index)*20)
        });
    });

    animatableMeshes.push({ mesh: null, type: 'arms_frantic', armsData: arms });

    // ==========================================
    // PART 11: HYDRAULIC COOLANT PUMPING ARRAY
    // ==========================================
    const coolantGroup = new THREE.Group();
    const pumpCount = 8;
    for(let i=0; i<pumpCount; i++) {
        const angle = (i/pumpCount) * Math.PI * 2;
        const radius = 9;
        
        // Pump Body
        const pumpGeo = new THREE.CylinderGeometry(1, 1.5, 4, 16);
        const pump = new THREE.Mesh(pumpGeo, aluminum);
        pump.position.set(Math.cos(angle)*radius, 2, Math.sin(angle)*radius);
        coolantGroup.add(pump);

        // Pipe leading up to the core
        const pipePoints = [
            new THREE.Vector3(Math.cos(angle)*radius, 4, Math.sin(angle)*radius),
            new THREE.Vector3(Math.cos(angle)*(radius-2), 8, Math.sin(angle)*(radius-2)),
            new THREE.Vector3(Math.cos(angle)*4, 12, Math.sin(angle)*4),
            new THREE.Vector3(Math.cos(angle)*2, 14, Math.sin(angle)*2)
        ];
        const pipe = createPipeSpline(pipePoints, 0.3, copper);
        coolantGroup.add(pipe);

        // Warning light on pump
        const lightGeo = new THREE.SphereGeometry(0.3, 8, 8);
        const light = new THREE.Mesh(lightGeo, warningLightMat);
        light.position.set(Math.cos(angle)*radius, 4.2, Math.sin(angle)*radius);
        coolantGroup.add(light);
        animatableMeshes.push({ mesh: light, type: 'strobe', offset: i });
    }
    group.add(coolantGroup);

    parts.push({
        name: "Cryogenic Liquid Helium Cascade Pumps",
        description: "Pumps absolute-zero liquid helium into the superconducting ring arrays at a rate of 50,000 liters per second to prevent critical quenching.",
        material: "Aluminum/Copper",
        function: "Thermal regulation.",
        assemblyOrder: 10,
        connections: ["Magnetic Torus Rings", "Base Foundation"],
        failureEffect: "Superconductors quench, immediately halting the magnetic confinement.",
        cascadeFailures: ["Magnetic Torus Rings", "Primary Electromagnetic Cage"],
        originalPosition: new THREE.Vector3(0,2,0),
        explodedPosition: new THREE.Vector3(0, -5, -20)
    });

    // ==========================================
    // PART 12: DIAGNOSTIC & OPERATOR CABIN (SUICIDE BOOTH)
    // ==========================================
    const cabinGroup = new THREE.Group();
    
    // Cabin Body
    const cabinGeo = new THREE.BoxGeometry(4, 3, 4);
    const cabin = new THREE.Mesh(cabinGeo, darkSteel);
    cabin.position.set(13, 1.5, 0);
    cabinGroup.add(cabin);

    // Tinted Glass window facing the core
    const windowGeo = new THREE.PlaneGeometry(3.5, 2);
    const windowMesh = new THREE.Mesh(windowGeo, tinted);
    windowMesh.position.set(11.01, 1.5, 0);
    windowMesh.rotation.y = -Math.PI / 2;
    cabinGroup.add(windowMesh);

    // Operator Screens Inside (Glowing)
    const screenGeo = new THREE.BoxGeometry(0.1, 1, 2);
    const screen1 = new THREE.Mesh(screenGeo, glowingScreenMat);
    screen1.position.set(11.2, 1.5, 1);
    screen1.rotation.y = Math.PI / 4;
    cabinGroup.add(screen1);
    
    const screen2 = new THREE.Mesh(screenGeo, glowingScreenMat);
    screen2.position.set(11.2, 1.5, -1);
    screen2.rotation.y = -Math.PI / 4;
    cabinGroup.add(screen2);

    // Thick cable from cabin to base
    const cabCablePoints = [
        new THREE.Vector3(13, 0.5, 2),
        new THREE.Vector3(12, 0.5, 4),
        new THREE.Vector3(10, 0.5, 6),
        new THREE.Vector3(8, 0.5, 7)
    ];
    const cabCable = createPipeSpline(cabCablePoints, 0.4, rubber);
    cabinGroup.add(cabCable);

    group.add(cabinGroup);

    parts.push({
        name: "Terminal Diagnostics Cabin",
        description: "Heavily shielded observation booth. Due to the extreme radiation environment, human operators assigned here are on a one-way trip, tasked with manual overrides when the AI fails.",
        material: "Lead-Lined Dark Steel / Tinted Glass",
        function: "Manual fail-deadly override.",
        assemblyOrder: 11,
        connections: ["Base Foundation"],
        failureEffect: "Loss of manual oversight. If AI goes rogue or fails, destruction is guaranteed.",
        cascadeFailures: ["None directly, but severely limits mitigation options."],
        originalPosition: cabin.position.clone(),
        explodedPosition: new THREE.Vector3(25, 0, 0)
    });

    // ==========================================
    // PART 13: PLASMA INJECTOR ARRAY
    // ==========================================
    const plasmaGroup = new THREE.Group();
    const injectorGeo = new THREE.CylinderGeometry(0.2, 0.6, 3, 12);
    
    for(let i=0; i<4; i++) {
        const injector = new THREE.Mesh(injectorGeo, chrome);
        const angle = (i/4) * Math.PI * 2;
        injector.position.set(Math.cos(angle)*3, 12, Math.sin(angle)*3);
        injector.lookAt(0, 15, 0);
        injector.rotateX(Math.PI / 2);
        
        const plasmaBeamGeo = new THREE.CylinderGeometry(0.05, 0.05, 5, 8);
        const plasmaBeam = new THREE.Mesh(plasmaBeamGeo, plasmaMaterial);
        plasmaBeam.position.y = 2.5;
        injector.add(plasmaBeam);
        
        plasmaGroup.add(injector);
        animatableMeshes.push({ mesh: plasmaBeam, type: 'plasma_beam', seed: i });
    }
    group.add(plasmaGroup);

    parts.push({
        name: "Quark-Gluon Plasma Injectors",
        description: "Fires streams of high-energy plasma directly into the confinement field to satisfy the strangelet's absorption rate, preventing it from consuming the electromagnetic field itself.",
        material: "Chrome / Plasma",
        function: "Matter appeasement.",
        assemblyOrder: 12,
        connections: ["Confinement Fields", "Coolant Pumps"],
        failureEffect: "Strangelet starves and breaches containment seeking matter.",
        cascadeFailures: ["Primary Electromagnetic Cage"],
        originalPosition: new THREE.Vector3(0, 12, 0),
        explodedPosition: new THREE.Vector3(0, 30, -10)
    });

    // ==========================================
    // PART 14: QUANTUM STATE STABILIZER
    // ==========================================
    const stabilizerGroup = new THREE.Group();
    const stabRing = new THREE.Mesh(new THREE.TorusGeometry(3.5, 0.2, 16, 64), glowingScreenMat);
    stabRing.position.set(0, 15, 0);
    stabRing.rotation.x = Math.PI / 2;
    stabilizerGroup.add(stabRing);
    
    // Hanging sensors
    for(let i=0; i<8; i++) {
        const sensorGeo = new THREE.BoxGeometry(0.2, 1, 0.2);
        const sensor = new THREE.Mesh(sensorGeo, steel);
        const angle = (i/8) * Math.PI * 2;
        sensor.position.set(Math.cos(angle)*3.5, 14.5, Math.sin(angle)*3.5);
        stabilizerGroup.add(sensor);
    }
    group.add(stabilizerGroup);

    parts.push({
        name: "Quantum State Stabilizer Array",
        description: "Emits a highly calibrated probability-wave collapsing field to ensure the strangelet remains in a predictable dimensional state.",
        material: "Exotic Metamaterials",
        function: "Dimensional anchoring.",
        assemblyOrder: 13,
        connections: ["Base Foundation"],
        failureEffect: "Strangelet undergoes quantum tunneling, bypassing all physical and electromagnetic barriers instantly.",
        cascadeFailures: ["All Containment"],
        originalPosition: stabRing.position.clone(),
        explodedPosition: new THREE.Vector3(0, 40, 10)
    });
    animatableMeshes.push({ mesh: stabRing, type: 'spin_rapid', axis: 'z', speed: 5 });

    // ==========================================
    // PART 15: ENERGY SIPHON & RADIATOR STACKS
    // ==========================================
    const radiatorGroup = new THREE.Group();
    const radTowerGeo = new THREE.BoxGeometry(2, 8, 2);
    for(let i=0; i<3; i++) {
        const angle = (i/3) * Math.PI * 2;
        const tower = new THREE.Mesh(radTowerGeo, darkSteel);
        tower.position.set(Math.cos(angle)*15, 4, Math.sin(angle)*15);
        
        // Heat fins
        for(let j=0; j<10; j++) {
            const finGeo = new THREE.BoxGeometry(2.5, 0.1, 2.5);
            const fin = new THREE.Mesh(finGeo, aluminum);
            fin.position.y = -3 + (j * 0.6);
            tower.add(fin);
        }
        radiatorGroup.add(tower);
    }
    group.add(radiatorGroup);

    parts.push({
        name: "Hawking Radiation Siphon Stacks",
        description: "Captures and radiates excess extreme-energy photons emitted by the thrashing strangelet, preventing the containment room from vaporizing.",
        material: "Tungsten/Aluminum",
        function: "Energy dissipation.",
        assemblyOrder: 14,
        connections: ["Floor", "Base Foundation"],
        failureEffect: "Room temperature exceeds 10,000 K. Meltdown of all mechanical parts.",
        cascadeFailures: ["Robotic Arms", "Coolant Pumps"],
        originalPosition: new THREE.Vector3(0,4,0),
        explodedPosition: new THREE.Vector3(0, -10, 30)
    });

    // ==========================================
    // EXTREME ANIMATION LOGIC
    // ==========================================
    const animate = (time, speed, meshes) => {
        const t = time * speed;
        
        animatableMeshes.forEach(animData => {
            if (animData.type === 'thrash') {
                // Chaotic, terrifying movement
                animData.mesh.position.x = (Math.random() - 0.5) * 0.2 + Math.sin(t * 50) * 0.1;
                animData.mesh.position.y = (Math.random() - 0.5) * 0.2 + Math.cos(t * 43) * 0.1;
                animData.mesh.position.z = (Math.random() - 0.5) * 0.2 + Math.sin(t * 37) * 0.1;
                
                animData.mesh.rotation.x += Math.random() * 0.5;
                animData.mesh.rotation.y += Math.random() * 0.5;
                
                // Pulsing emissive intensity
                animData.mesh.material.emissiveIntensity = 5 + Math.random() * 15;
            } 
            else if (animData.type === 'fragments_orbit') {
                animData.fragmentsList.forEach(frag => {
                    const data = frag.userData;
                    const orbitAngle = t * data.orbitSpeed + data.offset;
                    
                    // Complex orbital math around core
                    frag.position.set(
                        Math.cos(orbitAngle) * 1.5,
                        Math.sin(orbitAngle * 1.3) * 1.5,
                        Math.sin(orbitAngle) * 1.5
                    );
                    frag.position.applyAxisAngle(data.orbitAxis, orbitAngle * 0.5);
                    
                    frag.rotation.x += 0.1;
                    frag.rotation.y += 0.2;
                });
            }
            else if (animData.type === 'pulse_field') {
                // Field occasionally flashing warning colors due to stress
                const stress = Math.sin(t * 2) * Math.cos(t * 5.3) * Math.sin(t * 11);
                const isFailing = stress > 0.8;
                
                const scale = animData.baseScale + Math.random() * 0.05;
                animData.mesh.scale.set(scale, scale, scale);
                animData.mesh.rotation.y += 0.01 * speed;
                animData.mesh.rotation.x += 0.005 * speed;

                if (isFailing) {
                    animData.mesh.material = animData.warningMat;
                    animData.mesh.material.emissiveIntensity = 4;
                    animData.mesh.material.wireframe = false;
                } else {
                    animData.mesh.material = fieldMaterialSecondary;
                    animData.mesh.material.wireframe = true;
                }
            }
            else if (animData.type === 'rotate_field') {
                animData.mesh.rotation.y -= 0.02 * animData.speed * speed;
                animData.mesh.rotation.z += 0.01 * animData.speed * speed;
                animData.mesh.scale.setScalar(1.0 + Math.sin(t*10)*0.01);
            }
            else if (animData.type === 'gimbal') {
                animData.mesh.rotation[animData.axis] += 0.05 * animData.speed * speed;
            }
            else if (animData.type === 'pulse_color') {
                animData.mesh.material.emissiveIntensity = 1 + Math.sin(t * animData.speed) * 0.5;
            }
            else if (animData.type === 'strobe') {
                // Intense strobe effect
                const strobe = (Math.floor(t * 20 + animData.offset) % 4 === 0) ? 5 : 0;
                animData.mesh.material.emissiveIntensity = strobe;
            }
            else if (animData.type === 'plasma_beam') {
                // Sputtering plasma
                animData.mesh.scale.y = 1 + Math.random() * 0.5;
                animData.mesh.material.emissiveIntensity = 2 + Math.random() * 4;
            }
            else if (animData.type === 'spin_rapid') {
                animData.mesh.rotation[animData.axis] += 0.2 * animData.speed * speed;
            }
            else if (animData.type === 'arms_frantic') {
                // Procedural IK-like frantic repairing
                animData.armsData.forEach(arm => {
                    // Pick a new target on the confinement field periodically
                    if (t > arm.targetTime) {
                        arm.currentTarget.set(
                            (Math.random() - 0.5) * 6,
                            (Math.random() - 0.5) * 6 + 15,
                            (Math.random() - 0.5) * 6
                        );
                        arm.targetTime = t + Math.random() * 0.5 + 0.1; // Very fast changes
                    }

                    // Move base to point towards target yaw
                    const dx = arm.currentTarget.x - arm.root.position.x;
                    const dz = arm.currentTarget.z - arm.root.position.z;
                    const targetYaw = Math.atan2(dz, dx);
                    
                    // Simple lerp for rotation
                    arm.root.rotation.y += (targetYaw - arm.root.rotation.y) * 0.2;

                    // Frantic shoulder and elbow twitching based on noise
                    arm.shoulder.rotation.z = Math.sin(t * 15 + arm.root.position.x) * 0.5 - 0.5;
                    arm.elbow.rotation.z = Math.cos(t * 12 + arm.root.position.z) * 0.8 + 1.0;
                    
                    // Wrist rotating wildly (welding action)
                    arm.wrist.rotation.x += 0.5;
                    arm.wrist.rotation.z = Math.sin(t * 30) * 0.5;
                    
                    // Claws snapping
                    const clawSnip = Math.abs(Math.sin(t * 20));
                    arm.f1.rotation.z = -0.2 - clawSnip * 0.3;
                    arm.f2.rotation.z = 0.2 + clawSnip * 0.3;
                });
            }
        });
    };

    // ==========================================
    // PHD-LEVEL NUCLEAR/PARTICLE PHYSICS QUIZ
    // ==========================================
    const quizQuestions = [
        {
            question: "According to the Bodmer-Witten hypothesis, why might strange quark matter (SQM) be the true absolute ground state of hadronic matter?",
            options: [
                "Because strange quarks carry no color charge, making them immune to the strong force.",
                "Because the inclusion of a third quark flavor (strange) in the Fermi sea lowers the energy per baryon below that of iron-56.",
                "Because strange quarks decay instantaneously into up and down quarks via the weak interaction, releasing binding energy.",
                "Because SQM exhibits a net positive strangeness quantum number, which is topologically protected."
            ],
            correctAnswer: 1
        },
        {
            question: "In the Color-Flavor Locked (CFL) phase of extremely dense strange quark matter, which phenomenon dominates the physical state?",
            options: [
                "Total confinement of gluons into glueballs, creating a perfect insulator.",
                "Cooper pairing of quarks of all three flavors and three colors, leading to color superconductivity.",
                "Spontaneous symmetry breaking of the electromagnetic force, resulting in magnetic monopoles.",
                "The emission of massive W and Z bosons at room temperature."
            ],
            correctAnswer: 1
        },
        {
            question: "What is the expected behavior of the electric charge-to-mass ratio (Z/A) of a massive strangelet as its baryon number (A) asymptotically approaches infinity (bulk strange matter)?",
            options: [
                "Z/A approaches 1, behaving like a massive proton.",
                "Z/A approaches zero, typically scaling as A^(1/3) due to electron screening and weak equilibration between quark flavors.",
                "Z/A becomes increasingly negative until it undergoes spontaneous fission.",
                "Z/A scales linearly with A, resulting in infinite charge density."
            ],
            correctAnswer: 1
        },
        {
            question: "If a negatively charged strangelet interacts with an ordinary atomic nucleus, what is the sequence of the primary mechanism of conversion?",
            options: [
                "Coulomb capture of the nucleus, absorption of nucleons, subsequent weak interaction equilibration, and emission of energy/neutrons.",
                "Instantaneous strong-force repulsion, scattering the nucleus as high-energy alpha particles.",
                "Gravitational collapse into a microscopic black hole due to local density spikes.",
                "Electron capture leading to the emission of a massive neutrino burst and annihilation."
            ],
            correctAnswer: 0
        },
        {
            question: "Which of the following is considered a potential theoretical astrophysical signature of a strange star (composed entirely of strange quark matter) that distinguishes it from a traditional neutron star?",
            options: [
                "It emits only perfectly coherent, monochromatic hawking radiation.",
                "Its mass-radius relationship allows for arbitrarily small radii at lower masses, unbound by the typical nuclear crust limits of a neutron star.",
                "It possesses no magnetic field whatsoever due to the Meissner effect in the CFL phase.",
                "It rotates exactly at the speed of light due to the conservation of strange-angular momentum."
            ],
            correctAnswer: 1
        }
    ];

    return {
        group,
        parts,
        description: "WARNING: ULTRA GOD TIER CONTAINMENT SYSTEM. Houses a singular, highly infectious Strangelet. Implements macroscopic electromagnetic levitation, chromodynamic repulsion fields, and frantic AI-driven robotic repair to stave off the complete conversion of the Earth into strange matter. Do not tap on the glass.",
        quizQuestions,
        animate
    };
}
