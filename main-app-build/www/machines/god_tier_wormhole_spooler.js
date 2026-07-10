import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // =========================================================================
    // EXOTIC & HIGH-TECH MATERIALS
    // =========================================================================
    const matEmissiveBlue = new THREE.MeshStandardMaterial({ 
        color: 0x001133, 
        emissive: 0x0088ff, 
        emissiveIntensity: 3.5, 
        roughness: 0.1, 
        metalness: 0.9 
    });
    
    const matEmissivePurple = new THREE.MeshStandardMaterial({ 
        color: 0x220033, 
        emissive: 0xaa00ff, 
        emissiveIntensity: 4.5, 
        roughness: 0.2, 
        metalness: 0.8 
    });

    const matEmissiveOrange = new THREE.MeshStandardMaterial({ 
        color: 0x331100, 
        emissive: 0xff6600, 
        emissiveIntensity: 5.0, 
        roughness: 0.3, 
        metalness: 0.7 
    });

    const matEmissiveRed = new THREE.MeshStandardMaterial({ 
        color: 0x220000, 
        emissive: 0xff0033, 
        emissiveIntensity: 4.0, 
        roughness: 0.2, 
        metalness: 0.9 
    });

    const matLensing = new THREE.MeshPhysicalMaterial({ 
        transmission: 0.99, 
        opacity: 1, 
        metalness: 0.1, 
        roughness: 0.02, 
        ior: 2.5, 
        thickness: 2.0, 
        color: 0xddffff, 
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const matHologram = new THREE.MeshPhysicalMaterial({ 
        transmission: 0.8, 
        opacity: 0.85, 
        metalness: 0.2, 
        roughness: 0.1, 
        ior: 1.2, 
        color: 0x00ffff, 
        emissive: 0x0066aa, 
        emissiveIntensity: 2.0, 
        wireframe: true 
    });

    const matDarkAlloy = new THREE.MeshStandardMaterial({
        color: 0x111111,
        metalness: 0.95,
        roughness: 0.4,
        envMapIntensity: 1.5
    });

    const matGoldFoil = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        metalness: 1.0,
        roughness: 0.2,
        bumpScale: 0.05
    });

    const matSuperconductor = new THREE.MeshStandardMaterial({
        color: 0x050505,
        metalness: 1.0,
        roughness: 0.0,
        emissive: 0x001122,
        emissiveIntensity: 0.5
    });

    const matWarning = new THREE.MeshStandardMaterial({
        color: 0xffcc00,
        metalness: 0.5,
        roughness: 0.8
    });

    // =========================================================================
    // GEOMETRY HELPERS
    // =========================================================================
    function createBeveledExtrude(pts, depth, bevel) {
        const shape = new THREE.Shape();
        if(pts.length > 0) {
            shape.moveTo(pts[0][0], pts[0][1]);
            for(let i = 1; i < pts.length; i++) {
                shape.lineTo(pts[i][0], pts[i][1]);
            }
            shape.lineTo(pts[0][0], pts[0][1]);
        }
        return new THREE.ExtrudeGeometry(shape, { 
            depth: depth, 
            bevelEnabled: true, 
            bevelThickness: bevel, 
            bevelSize: bevel, 
            bevelSegments: 8, 
            curveSegments: 32 
        });
    }

    function createLathe(pointsArray, segments) {
        const pts = pointsArray.map(p => new THREE.Vector2(p[0], p[1]));
        return new THREE.LatheGeometry(pts, segments);
    }

    function createSineTube(radius, height, coils, thickness, segments) {
        class SineCurve extends THREE.Curve {
            constructor(scale = 1) {
                super();
                this.scale = scale;
            }
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                const angle = t * Math.PI * 2 * coils;
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;
                const y = (t - 0.5) * height;
                return optionalTarget.set(x, y, z).multiplyScalar(this.scale);
            }
        }
        const path = new SineCurve();
        return new THREE.TubeGeometry(path, segments, thickness, 16, false);
    }

    function createComplexCable(startPt, endPt, controlPt1, controlPt2, thickness) {
        const curve = new THREE.CubicBezierCurve3(
            new THREE.Vector3(...startPt),
            new THREE.Vector3(...controlPt1),
            new THREE.Vector3(...controlPt2),
            new THREE.Vector3(...endPt)
        );
        return new THREE.TubeGeometry(curve, 64, thickness, 12, false);
    }

    // =========================================================================
    // PART 1: MAIN BASE PLATFORM & GRAVITON ANCHORS
    // =========================================================================
    const baseGroup = new THREE.Group();
    
    // Core octagonal foundation
    const basePts = [];
    for (let i = 0; i < 16; i++) {
        let angle = (i / 16) * Math.PI * 2;
        let r = i % 2 === 0 ? 50 : 45;
        basePts.push([Math.cos(angle) * r, Math.sin(angle) * r]);
    }
    const baseGeom = createBeveledExtrude(basePts, 8, 1);
    const baseMesh = new THREE.Mesh(baseGeom, matDarkAlloy);
    baseMesh.rotation.x = Math.PI / 2;
    baseMesh.position.y = -4;
    baseGroup.add(baseMesh);

    // Inner detail ring
    const innerRingGeom = new THREE.TorusGeometry(35, 2, 32, 64);
    const innerRingMesh = new THREE.Mesh(innerRingGeom, matEmissiveBlue);
    innerRingMesh.rotation.x = Math.PI / 2;
    innerRingMesh.position.y = 4.5;
    baseGroup.add(innerRingMesh);

    // Graviton Anchors
    const anchorGeom = new THREE.CylinderGeometry(4, 6, 12, 8);
    for(let i=0; i<4; i++) {
        const angle = (i/4) * Math.PI * 2 + (Math.PI/4);
        const anchor = new THREE.Mesh(anchorGeom, darkSteel);
        anchor.position.set(Math.cos(angle) * 48, 2, Math.sin(angle) * 48);
        
        // Add detail ribs to anchors
        const ribGeom = new THREE.BoxGeometry(10, 2, 1);
        for(let j=0; j<3; j++) {
            const rib = new THREE.Mesh(ribGeom, matWarning);
            rib.position.y = -2 + j*2;
            rib.lookAt(0, rib.position.y, 0);
            anchor.add(rib);
        }
        
        baseGroup.add(anchor);
    }

    meshes.base = baseGroup;
    group.add(baseGroup);
    parts.push({
        name: "Main Base Platform & Anchors",
        description: "A massive, heavily shielded foundation utilizing Graviton Anchors to pin the assembly to the local spacetime metric, preventing topological tearing during operation.",
        material: "Dark Alloy / Superconductor / Warning Trim",
        function: "Provides absolute inertial stability against extreme negative energy fluctuations.",
        assemblyOrder: 1,
        connections: ["Graviton Anchors", "Inner Stabilizing Ring", "Coolant System"],
        failureEffect: "Catastrophic structural shear leading to immediate microscopic black hole formation.",
        cascadeFailures: ["Graviton Anchors", "Singularity Containment"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -20, z: 0}
    });

    // =========================================================================
    // PART 2: COOLING SYSTEM PUMPING UNIT
    // =========================================================================
    const coolantGroup = new THREE.Group();
    meshes.coolantPipes = [];
    
    // Add 24 sinusoidal coolant pipes winding around the base
    for(let i=0; i<24; i++) {
        const angleOffset = (i/24) * Math.PI * 2;
        const pipeGeom = createSineTube(32, 8, 3, 0.5, 128);
        const pipe = new THREE.Mesh(pipeGeom, copper);
        pipe.rotation.y = angleOffset;
        pipe.position.y = 4;
        coolantGroup.add(pipe);
        meshes.coolantPipes.push(pipe);
    }

    // Coolant Reservoirs
    const reservoirGeom = new THREE.CapsuleGeometry(3, 10, 16, 32);
    for(let i=0; i<8; i++) {
        const angle = (i/8) * Math.PI * 2;
        const res = new THREE.Mesh(reservoirGeom, glass);
        res.position.set(Math.cos(angle)*38, 8, Math.sin(angle)*38);
        
        // Inner glowing fluid
        const fluidGeom = new THREE.CapsuleGeometry(2.5, 9.5, 16, 32);
        const fluid = new THREE.Mesh(fluidGeom, matEmissiveBlue);
        res.add(fluid);
        
        coolantGroup.add(res);
    }

    meshes.coolantGroup = coolantGroup;
    group.add(coolantGroup);
    parts.push({
        name: "Superfluid Helium-4 Cooling System",
        description: "An intricate network of sinusoidal thermal transfer pipes and high-pressure reservoirs pumping superfluid liquid helium to maintain near-absolute-zero temperatures.",
        material: "Copper / Quartz Glass / Emissive Fluid",
        function: "Bleeds off extreme waste heat generated by macroscopic exotic matter stabilization.",
        assemblyOrder: 2,
        connections: ["Main Base", "Superconducting Power Lines", "Primary Spool Hub"],
        failureEffect: "Thermal runaway resulting in spontaneous vaporization of the stabilization rings.",
        cascadeFailures: ["Flux Capacitors", "Stabilizing Ring Alpha"],
        originalPosition: {x: 0, y: 4, z: 0},
        explodedPosition: {x: 0, y: 0, z: 30}
    });

    // =========================================================================
    // PART 3: QUANTUM SPOOL HUB
    // =========================================================================
    const spoolHubPts = [
        [4, -15], [8, -14], [12, -14], [15, -12], [15, -10], 
        [5, -8], [5, 8], [15, 10], [15, 12], [12, 14], [8, 14], [4, 15]
    ];
    const spoolHubGeom = createLathe(spoolHubPts, 128);
    const spoolHub = new THREE.Mesh(spoolHubGeom, steel);
    spoolHub.position.y = 25;
    
    // Add intricate flanges to the hub
    const flangeGeom = new THREE.BoxGeometry(32, 1, 2);
    for(let i=0; i<36; i++) {
        const angle = (i/36) * Math.PI * 2;
        const flange = new THREE.Mesh(flangeGeom, chrome);
        flange.position.set(Math.cos(angle)*8, 0, Math.sin(angle)*8);
        flange.lookAt(0, 0, 0);
        spoolHub.add(flange);
    }

    meshes.spoolHub = spoolHub;
    group.add(spoolHub);
    parts.push({
        name: "Quantum Spool Hub",
        description: "The primary rotating chassis constructed from neutron-star density lattice. It houses the macroscopic threading mechanism.",
        material: "Neutron-Lattice Steel / Chrome Flanges",
        function: "Reels and aligns the microscopic quantum threads into a unified cable structure.",
        assemblyOrder: 3,
        connections: ["Spool Drive Shaft", "Primary Lensing Array", "Thread Convergence Node"],
        failureEffect: "Severe thread misalignment, causing localized space-time fragmentation.",
        cascadeFailures: ["Primary Lensing Array", "Cable Output"],
        originalPosition: {x: 0, y: 25, z: 0},
        explodedPosition: {x: 0, y: 40, z: 0}
    });

    // =========================================================================
    // PART 4: SPOOL DRIVE SHAFT & GEARBOX
    // =========================================================================
    const driveGroup = new THREE.Group();
    driveGroup.position.y = 25;

    const shaftGeom = new THREE.CylinderGeometry(3.8, 3.8, 40, 32);
    const shaft = new THREE.Mesh(shaftGeom, darkSteel);
    shaft.rotation.z = Math.PI / 2;
    driveGroup.add(shaft);

    meshes.gears = [];
    const gearGeom = new THREE.CylinderGeometry(10, 10, 2, 24);
    const toothGeom = new THREE.BoxGeometry(2, 2, 2);
    
    for(let g=0; g<4; g++) {
        const gear = new THREE.Mesh(gearGeom, steel);
        gear.position.x = -15 + g*10;
        gear.rotation.z = Math.PI / 2;
        
        for(let t=0; t<24; t++) {
            const angle = (t/24) * Math.PI * 2;
            const tooth = new THREE.Mesh(toothGeom, steel);
            tooth.position.set(Math.cos(angle)*10, 0, Math.sin(angle)*10);
            tooth.rotation.y = -angle;
            gear.add(tooth);
        }
        driveGroup.add(gear);
        meshes.gears.push(gear);
    }

    meshes.driveShaft = driveGroup;
    group.add(driveGroup);
    parts.push({
        name: "Spool Drive Shaft & Relativistic Gearbox",
        description: "A highly reinforced drive train capable of transmitting petawatts of mechanical power. The gearbox steps up rotation speeds to near-light fractions.",
        material: "Dark Steel / Hardened Chromium",
        function: "Translates primary motor torque into extreme RPMs for the Spool Hub.",
        assemblyOrder: 4,
        connections: ["Quantum Spool Hub", "Superconducting Power Lines"],
        failureEffect: "Catastrophic mechanical shear; shrapnel accelerated to relativistic velocities.",
        cascadeFailures: ["Quantum Spool Hub", "Control Cabin"],
        originalPosition: {x: 0, y: 25, z: 0},
        explodedPosition: {x: -40, y: 25, z: 0}
    });

    // =========================================================================
    // PART 5: NEGATIVE MASS STABILIZING RING ALPHA
    // =========================================================================
    const ringAlphaGroup = new THREE.Group();
    ringAlphaGroup.position.y = 25;

    const knotGeomAlpha = new THREE.TorusKnotGeometry(22, 1.5, 256, 32, 3, 4);
    const ringAlpha = new THREE.Mesh(knotGeomAlpha, matEmissivePurple);
    ringAlphaGroup.add(ringAlpha);

    // Add flux nodes to the ring
    const nodeGeom = new THREE.OctahedronGeometry(2.5, 1);
    for(let i=0; i<12; i++) {
        const angle = (i/12) * Math.PI * 2;
        const node = new THREE.Mesh(nodeGeom, matDarkAlloy);
        node.position.set(Math.cos(angle)*22, Math.sin(angle)*22, 0);
        ringAlphaGroup.add(node);
    }

    meshes.ringAlpha = ringAlphaGroup;
    group.add(ringAlphaGroup);
    parts.push({
        name: "Negative Mass Stabilizing Ring Alpha",
        description: "The inner primary toroid circulating pure exotic matter (negative energy density) to fulfill the Null Energy Condition violations required by the wormhole throat.",
        material: "Exotic Matter Emissive / Dark Alloy Nodes",
        function: "Maintains the topological stability of the macroscopic wormhole throat.",
        assemblyOrder: 5,
        connections: ["Quantum Spool Hub", "Stabilizing Ring Beta", "Exotic Matter Injector"],
        failureEffect: "Wormhole throat collapse, severing the connection instantly.",
        cascadeFailures: ["Wormhole Thread", "Thread Convergence Node"],
        originalPosition: {x: 0, y: 25, z: 0},
        explodedPosition: {x: 0, y: 25, z: 40}
    });

    // =========================================================================
    // PART 6: NEGATIVE MASS STABILIZING RING BETA
    // =========================================================================
    const ringBetaGroup = new THREE.Group();
    ringBetaGroup.position.y = 25;

    const knotGeomBeta = new THREE.TorusKnotGeometry(30, 2, 256, 32, 2, 5);
    const ringBeta = new THREE.Mesh(knotGeomBeta, matEmissiveBlue);
    ringBetaGroup.add(ringBeta);

    meshes.ringBeta = ringBetaGroup;
    group.add(ringBetaGroup);
    parts.push({
        name: "Negative Mass Stabilizing Ring Beta",
        description: "The secondary outer toroid acting as a redundancy buffer and shaping field for the exotic matter distribution.",
        material: "Exotic Matter Emissive (Blue)",
        function: "Shapes the negative energy field gradient to prevent boundary layer shear.",
        assemblyOrder: 6,
        connections: ["Stabilizing Ring Alpha", "Primary Lensing Array"],
        failureEffect: "Boundary shear leading to Hawking radiation bursts.",
        cascadeFailures: ["Operator Cabin", "Primary Lensing Array"],
        originalPosition: {x: 0, y: 25, z: 0},
        explodedPosition: {x: 0, y: 25, z: -50}
    });

    // =========================================================================
    // PART 7: PRIMARY LENSING ARRAY
    // =========================================================================
    const lensingGroup = new THREE.Group();
    lensingGroup.position.y = 25;
    meshes.lenses = [];

    const lensTrackGeom = new THREE.TorusGeometry(18, 0.5, 16, 64);
    const lensTrack = new THREE.Mesh(lensTrackGeom, chrome);
    lensTrack.rotation.x = Math.PI / 2;
    lensingGroup.add(lensTrack);

    const singleLensGeom = new THREE.CylinderGeometry(1.5, 1.5, 0.5, 32);
    for(let i=0; i<36; i++) {
        const angle = (i/36) * Math.PI * 2;
        const lensMesh = new THREE.Mesh(singleLensGeom, matLensing);
        lensMesh.position.set(Math.cos(angle)*18, 0, Math.sin(angle)*18);
        lensMesh.rotation.x = Math.PI / 2;
        lensMesh.rotation.z = angle;
        
        // Add tiny emissive rims to each lens
        const rimGeom = new THREE.TorusGeometry(1.6, 0.2, 8, 32);
        const rim = new THREE.Mesh(rimGeom, matEmissiveOrange);
        rim.rotation.x = Math.PI/2;
        lensMesh.add(rim);

        lensingGroup.add(lensMesh);
        meshes.lenses.push(lensMesh);
    }

    meshes.lensingArray = lensingGroup;
    group.add(lensingGroup);
    parts.push({
        name: "Primary Spatial Lensing Array",
        description: "An array of 36 extreme-index metamaterial lenses that optically and gravitationally twist the invisible quantum threads.",
        material: "Metamaterial Glass / Chrome Track / Orange Emissive",
        function: "Focuses and intertwines quantum threads before they enter the convergence node.",
        assemblyOrder: 7,
        connections: ["Quantum Spool Hub", "Relativistic Spindles"],
        failureEffect: "Threads fail to converge, whipping wildly and slicing through normal matter.",
        cascadeFailures: ["Wormhole Thread", "Control Cabin"],
        originalPosition: {x: 0, y: 25, z: 0},
        explodedPosition: {x: 0, y: 60, z: 0}
    });

    // =========================================================================
    // PART 8, 9, 10: RELATIVISTIC SPINDLES 1, 2, & 3
    // =========================================================================
    meshes.spindles = [];
    for(let s=0; s<3; s++) {
        const spindleGroup = new THREE.Group();
        const angle = (s/3) * Math.PI * 2;
        spindleGroup.position.set(Math.cos(angle)*25, 45, Math.sin(angle)*25);
        spindleGroup.lookAt(0, 25, 0); // Point towards the center hub

        const bodyGeom = new THREE.CylinderGeometry(2, 4, 15, 6);
        const body = new THREE.Mesh(bodyGeom, steel);
        body.rotation.x = Math.PI / 2;
        spindleGroup.add(body);

        const tipGeom = new THREE.ConeGeometry(2, 5, 16);
        const tip = new THREE.Mesh(tipGeom, matEmissivePurple);
        tip.position.z = 10;
        tip.rotation.x = Math.PI / 2;
        spindleGroup.add(tip);

        meshes.spindles.push(spindleGroup);
        group.add(spindleGroup);
        
        parts.push({
            name: `Relativistic Spindle ${s+1}`,
            description: "A high-velocity spinning extrusion point that feeds individual microscopic wormholes into the primary array.",
            material: "Steel / Purple Emissive Tip",
            function: "Feeds and pre-tensions the individual quantum wormholes.",
            assemblyOrder: 8 + s,
            connections: ["Primary Lensing Array", "Thread Convergence Node"],
            failureEffect: "Spindle detachment leading to relativistic shrapnel bombardment.",
            cascadeFailures: ["Primary Lensing Array", "Cooling System"],
            originalPosition: {x: Math.cos(angle)*25, y: 45, z: Math.sin(angle)*25},
            explodedPosition: {x: Math.cos(angle)*50, y: 70, z: Math.sin(angle)*50}
        });
    }

    // =========================================================================
    // PART 11: THREAD CONVERGENCE NODE
    // =========================================================================
    const nodeGroup = new THREE.Group();
    nodeGroup.position.y = 25;

    const coreGeom = new THREE.IcosahedronGeometry(4, 2);
    const coreMesh = new THREE.Mesh(coreGeom, matEmissiveOrange);
    nodeGroup.add(coreMesh);

    const wireCoreGeom = new THREE.IcosahedronGeometry(5, 1);
    const wireCoreMesh = new THREE.Mesh(wireCoreGeom, matHologram);
    nodeGroup.add(wireCoreMesh);

    // Floating fragments around the node
    meshes.nodeFragments = [];
    const fragGeom = new THREE.TetrahedronGeometry(1, 0);
    for(let i=0; i<20; i++) {
        const frag = new THREE.Mesh(fragGeom, matGoldFoil);
        const fAngle = (i/20) * Math.PI * 2;
        const fDist = 7 + Math.random()*3;
        frag.position.set(Math.cos(fAngle)*fDist, (Math.random()-0.5)*10, Math.sin(fAngle)*fDist);
        nodeGroup.add(frag);
        meshes.nodeFragments.push({ mesh: frag, dist: fDist, angle: fAngle, speed: 0.02 + Math.random()*0.05 });
    }

    meshes.convergenceNode = nodeGroup;
    group.add(nodeGroup);
    parts.push({
        name: "Thread Convergence Node",
        description: "The singularity point where all microscopic threads are merged topologically into a single macroscopic conduit.",
        material: "Orange Emissive / Holographic Confinement Field / Gold Foil Fragments",
        function: "Fuses the wormhole boundaries, multiplying their capacity exponentially.",
        assemblyOrder: 11,
        connections: ["Primary Lensing Array", "Relativistic Spindles", "Macroscopic Cable Extruder"],
        failureEffect: "Topological explosion creating a localized vacuum decay bubble.",
        cascadeFailures: ["EVERYTHING"],
        originalPosition: {x: 0, y: 25, z: 0},
        explodedPosition: {x: 0, y: 25, z: 20}
    });

    // =========================================================================
    // PART 12: MACROSCOPIC CABLE EXTRUDER
    // =========================================================================
    const extruderPts = [
        [4, 0], [10, -5], [12, -15], [10, -25], [6, -35], [5, -40]
    ];
    const extruderGeom = createLathe(extruderPts, 64);
    const extruder = new THREE.Mesh(extruderGeom, matDarkAlloy);
    extruder.position.y = 15;
    
    // Add pulsing neon rings to the extruder
    meshes.extruderRings = [];
    for(let i=0; i<4; i++) {
        const rGeom = new THREE.TorusGeometry(11 - i*1.5, 0.4, 16, 64);
        const rMesh = new THREE.Mesh(rGeom, matEmissiveRed);
        rMesh.rotation.x = Math.PI / 2;
        rMesh.position.y = -10 - (i*8);
        extruder.add(rMesh);
        meshes.extruderRings.push(rMesh);
    }

    meshes.extruder = extruder;
    group.add(extruder);
    parts.push({
        name: "Macroscopic Cable Extruder",
        description: "A heavily shielded, converging nozzle that forces the woven quantum threads into a dense, stable macroscopic cable.",
        material: "Dark Alloy / Pulsing Red Emissives",
        function: "Provides the final physical constraint and energy shielding for the outgoing cable.",
        assemblyOrder: 12,
        connections: ["Thread Convergence Node", "Glowing Cable Output", "Hydraulic Tensioners"],
        failureEffect: "Cable unravelling; immediate exposure of raw singularity threads to the atmosphere.",
        cascadeFailures: ["Glowing Cable Output"],
        originalPosition: {x: 0, y: 15, z: 0},
        explodedPosition: {x: 0, y: -15, z: 0}
    });

    // =========================================================================
    // PART 13: HYDRAULIC TENSIONERS (LEFT & RIGHT)
    // =========================================================================
    const tensionerGroup = new THREE.Group();
    meshes.pistons = [];

    for(let side of [-1, 1]) {
        const tBaseGeom = new THREE.BoxGeometry(6, 12, 6);
        const tBase = new THREE.Mesh(tBaseGeom, darkSteel);
        tBase.position.set(side * 25, 10, -15);
        
        const cylGeom = new THREE.CylinderGeometry(2, 2, 20, 16);
        const cyl = new THREE.Mesh(cylGeom, chrome);
        cyl.position.set(0, 10, 5);
        cyl.rotation.x = Math.PI / 4;
        
        const rodGeom = new THREE.CylinderGeometry(1, 1, 25, 16);
        const rod = new THREE.Mesh(rodGeom, steel);
        rod.position.y = 10;
        cyl.add(rod);
        meshes.pistons.push({ cyl, rod, side });
        
        tBase.add(cyl);
        tensionerGroup.add(tBase);
    }

    meshes.tensioners = tensionerGroup;
    group.add(tensionerGroup);
    parts.push({
        name: "Hydraulic Tensioners",
        description: "Massive active-suspension pistons that absorb the immense gravitational recoil generated during thread convergence.",
        material: "Dark Steel Base / Chrome Cylinders / Steel Rods",
        function: "Dampens micro-fractures in the local metric by physically pushing back against gravitational waves.",
        assemblyOrder: 13,
        connections: ["Main Base Platform", "Macroscopic Cable Extruder"],
        failureEffect: "Uncontrolled oscillation tearing the facility apart via resonance.",
        cascadeFailures: ["Macroscopic Cable Extruder", "Main Base Platform"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 10, z: -30}
    });

    // =========================================================================
    // PART 14: EXOTIC MATTER INJECTOR PORT
    // =========================================================================
    const injectorGroup = new THREE.Group();
    
    const tankGeom = new THREE.CapsuleGeometry(4, 15, 32, 32);
    const tank1 = new THREE.Mesh(tankGeom, matGoldFoil);
    tank1.position.set(-20, 15, 25);
    const tank2 = new THREE.Mesh(tankGeom, matGoldFoil);
    tank2.position.set(-30, 15, 20);
    
    // Warning stripes
    const stripeGeom = new THREE.CylinderGeometry(4.1, 4.1, 2, 32);
    const stripe = new THREE.Mesh(stripeGeom, matWarning);
    tank1.add(stripe.clone());
    tank2.add(stripe.clone());

    const injectorPipe = createComplexCable([-20, 15, 25], [0, 25, 0], [-10, 30, 20], [-5, 25, 10], 1.5);
    const iPipeMesh = new THREE.Mesh(injectorPipe, copper);
    
    const injectorPipe2 = createComplexCable([-30, 15, 20], [0, 25, 0], [-15, 40, 10], [-5, 25, 5], 1.5);
    const iPipeMesh2 = new THREE.Mesh(injectorPipe2, copper);

    injectorGroup.add(tank1, tank2, iPipeMesh, iPipeMesh2);
    
    meshes.injector = injectorGroup;
    group.add(injectorGroup);
    parts.push({
        name: "Exotic Matter Injector Port",
        description: "High-pressure containment vessels storing Casimir-derived negative energy fluid, injected directly into the stabilization rings.",
        material: "Gold Foil Shielding / Warning Stripes / Copper Pipes",
        function: "Supplies the negative mass required to keep the macroscopic wormhole open.",
        assemblyOrder: 14,
        connections: ["Stabilizing Ring Alpha", "Main Base Platform"],
        failureEffect: "Exotic matter leak causing extreme localized anti-gravity and spaghettification.",
        cascadeFailures: ["Stabilizing Ring Alpha", "Stabilizing Ring Beta"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -40, y: 0, z: 40}
    });

    // =========================================================================
    // PART 15: SPACETIME DISRUPTOR COILS
    // =========================================================================
    const disruptorGroup = new THREE.Group();
    meshes.disruptorRings = [];

    const dRingGeom = new THREE.TorusGeometry(8, 1, 16, 48);
    for(let i=0; i<8; i++) {
        const ring = new THREE.Mesh(dRingGeom, matSuperconductor);
        ring.position.y = 5 + (i * 3);
        ring.rotation.x = Math.PI / 2;
        
        // Add glowing inner trace
        const traceGeom = new THREE.TorusGeometry(7.5, 0.3, 8, 48);
        const trace = new THREE.Mesh(traceGeom, matEmissiveBlue);
        trace.rotation.x = Math.PI/2;
        ring.add(trace);

        disruptorGroup.add(ring);
        meshes.disruptorRings.push(ring);
    }
    
    disruptorGroup.position.set(30, 0, 0); // Offset to the side
    meshes.disruptor = disruptorGroup;
    group.add(disruptorGroup);

    parts.push({
        name: "Spacetime Disruptor Coils",
        description: "A stack of superconducting toroids that generate extreme magnetic fields to actively suppress spontaneous virtual particle pair production near the throat.",
        material: "Superconductor / Blue Emissive Traces",
        function: "Prevents vacuum fluctuations from instantly evaporating the wormhole via Hawking-like radiation.",
        assemblyOrder: 15,
        connections: ["Main Base Platform", "Superconducting Power Lines"],
        failureEffect: "Intense bursts of hard gamma radiation as the vacuum rapidly boils.",
        cascadeFailures: ["Operator Cabin", "Exotic Matter Injector"],
        originalPosition: {x: 30, y: 0, z: 0},
        explodedPosition: {x: 60, y: 0, z: 0}
    });

    // =========================================================================
    // PART 16: CONTROL CABIN / MONITORING STATION
    // =========================================================================
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(0, 35, 45); // Hovering slightly in front
    
    const cabinBodyGeom = createBeveledExtrude([
        [-8, -5], [8, -5], [10, 0], [8, 5], [-8, 5], [-10, 0]
    ], 10, 0.5);
    const cabinBody = new THREE.Mesh(cabinBodyGeom, darkSteel);
    cabinBody.rotation.x = Math.PI / 2;
    cabinGroup.add(cabinBody);

    // Front Window
    const windowGeom = new THREE.PlaneGeometry(14, 8);
    const frontWindow = new THREE.Mesh(windowGeom, tinted);
    frontWindow.position.set(0, -2, -5.1);
    frontWindow.rotation.y = Math.PI;
    cabinGroup.add(frontWindow);

    // Glowing Monitors inside (visible through glass ideally, placed just behind it)
    const monitorGeom = new THREE.BoxGeometry(3, 2, 0.2);
    const m1 = new THREE.Mesh(monitorGeom, matEmissiveBlue);
    m1.position.set(-4, -2, -4);
    const m2 = new THREE.Mesh(monitorGeom, matEmissiveRed);
    m2.position.set(0, -1, -4);
    const m3 = new THREE.Mesh(monitorGeom, matEmissiveOrange);
    m3.position.set(4, -2, -4);
    cabinGroup.add(m1, m2, m3);

    meshes.cabin = cabinGroup;
    group.add(cabinGroup);

    parts.push({
        name: "Operator Control Cabin",
        description: "A heavily shielded, lead-lined command deck where chrononauts monitor the spooling process and manage tensioner feedback loops.",
        material: "Dark Steel / Tinted Anti-Radiation Glass / Glowing Monitors",
        function: "Provides human oversight and manual override capabilities for the automated spooler.",
        assemblyOrder: 16,
        connections: ["Main Base Platform (via data cables)", "Thread Convergence Node (telemetry)"],
        failureEffect: "Loss of manual control; extreme radiation exposure to occupants.",
        cascadeFailures: ["None directly, but prevents recovery of other failures."],
        originalPosition: {x: 0, y: 35, z: 45},
        explodedPosition: {x: 0, y: 60, z: 80}
    });

    // =========================================================================
    // PART 17: GLOWING CABLE OUTPUT (THE WOVEN THREAD)
    // =========================================================================
    // The final macroscopic cable dropping down into the planetary core
    const cableCurve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(0, -10, 0),
        new THREE.Vector3(0, -30, 0),
        new THREE.Vector3(10, -50, 10),
        new THREE.Vector3(10, -100, 10) // drops far below
    );
    const cableGeom = new THREE.TubeGeometry(cableCurve, 128, 4, 32, false);
    const cableMesh = new THREE.Mesh(cableGeom, matHologram);
    
    // Core of the cable
    const solidCableGeom = new THREE.TubeGeometry(cableCurve, 128, 2.5, 16, false);
    const solidCable = new THREE.Mesh(solidCableGeom, matEmissivePurple);
    cableMesh.add(solidCable);

    meshes.cableOutput = cableMesh;
    group.add(cableMesh);

    parts.push({
        name: "Macroscopic Wormhole Cable Output",
        description: "The final woven product: a stable, petameter-long thread capable of connecting distant star systems instantaneously.",
        material: "Holographic Confinement Shell / Purple Emissive Core",
        function: "Acts as the physical tether and transit pathway through hyperspace.",
        assemblyOrder: 17,
        connections: ["Macroscopic Cable Extruder"],
        failureEffect: "The cable snaps, violently whipping across the solar system at the speed of light.",
        cascadeFailures: ["Everything in its path"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -50, z: 0}
    });

    // =========================================================================
    // PART 18: FLUX CAPACITANCE BANKS
    // =========================================================================
    const fluxGroup = new THREE.Group();
    meshes.fluxCylinders = [];
    const fCylGeom = new THREE.CylinderGeometry(2, 2, 18, 16);
    
    for(let i=0; i<12; i++) {
        const angle = (i/12) * Math.PI * 2;
        const fCyl = new THREE.Mesh(fCylGeom, aluminum);
        fCyl.position.set(Math.cos(angle)*40, 9, Math.sin(angle)*40);
        
        // Emissive bands
        const bandGeom = new THREE.CylinderGeometry(2.1, 2.1, 1, 16);
        const band1 = new THREE.Mesh(bandGeom, matEmissiveBlue);
        band1.position.y = 4;
        const band2 = new THREE.Mesh(bandGeom, matEmissiveBlue);
        band2.position.y = -4;
        fCyl.add(band1, band2);

        fluxGroup.add(fCyl);
        meshes.fluxCylinders.push({ cyl: fCyl, b1: band1, b2: band2 });
    }

    meshes.fluxBanks = fluxGroup;
    group.add(fluxGroup);
    parts.push({
        name: "Flux Capacitance Banks",
        description: "A circular array of rapid-discharge capacitors providing the terawatts of instantaneous power needed to fuse the wormhole topologies.",
        material: "Aluminum / Blue Emissive Bands",
        function: "Stores and rapidly releases energy bursts to overcome topological resistance.",
        assemblyOrder: 18,
        connections: ["Main Base Platform", "Thread Convergence Node"],
        failureEffect: "Electrical arcing vaporizing the immediate facility.",
        cascadeFailures: ["Superconducting Power Lines", "Cooling System"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -20, z: -40}
    });

    // =========================================================================
    // PART 19: SUPERCONDUCTING POWER LINES
    // =========================================================================
    const linesGroup = new THREE.Group();
    for(let i=0; i<6; i++) {
        const angle = (i/6) * Math.PI * 2;
        const startX = Math.cos(angle)*40;
        const startZ = Math.sin(angle)*40;
        
        const path = new THREE.CubicBezierCurve3(
            new THREE.Vector3(startX, 18, startZ),
            new THREE.Vector3(startX*0.5, 30, startZ*0.5),
            new THREE.Vector3(0, 35, 0),
            new THREE.Vector3(0, 25, 0)
        );
        const lineGeom = new THREE.TubeGeometry(path, 32, 0.8, 8, false);
        const line = new THREE.Mesh(lineGeom, rubber);
        linesGroup.add(line);
    }
    meshes.powerLines = linesGroup;
    group.add(linesGroup);
    
    parts.push({
        name: "Superconducting Power Lines",
        description: "Thick, heavily insulated cables transferring power from the Flux Banks to the central Convergence Node.",
        material: "High-density Rubber / Superconducting Core",
        function: "Transmits peak power safely across the facility.",
        assemblyOrder: 19,
        connections: ["Flux Capacitance Banks", "Thread Convergence Node"],
        failureEffect: "Plasma fires and complete loss of spooling power.",
        cascadeFailures: ["Thread Convergence Node"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 20, z: 0}
    });

    // =========================================================================
    // PART 20: SINGULARITY CONTAINMENT FIELD
    // =========================================================================
    const fieldGeom = new THREE.SphereGeometry(32, 32, 32);
    const fieldMesh = new THREE.Mesh(fieldGeom, matLensing);
    fieldMesh.position.y = 25;
    
    // Add an inner wireframe shell for a high-tech look
    const wireFieldGeom = new THREE.SphereGeometry(31.5, 16, 16);
    const wireFieldMesh = new THREE.Mesh(wireFieldGeom, matHologram);
    fieldMesh.add(wireFieldMesh);

    meshes.magField = fieldMesh;
    group.add(fieldMesh);
    
    parts.push({
        name: "Singularity Containment Field Generator",
        description: "An invisible but heavily distorting spherical barrier of spatially lensed spacetime, designed to catch micro-singularities if containment is breached.",
        material: "Lensed Spacetime (Refractive) / Holographic Wireframe",
        function: "The ultimate fail-safe against planetary destruction.",
        assemblyOrder: 20,
        connections: ["Main Base Platform", "Thread Convergence Node"],
        failureEffect: "Event horizon expansion consuming the planet.",
        cascadeFailures: ["The entire Earth"],
        originalPosition: {x: 0, y: 25, z: 0},
        explodedPosition: {x: 0, y: 80, z: 0}
    });


    // =========================================================================
    // DESCRIPTION & QUIZ QUESTIONS
    // =========================================================================
    const description = "The God Tier Wormhole Spooler is a pinnacle of Type II civilization engineering. It ingests chaotic microscopic quantum wormholes, stabilizing them using vast amounts of negative-mass exotic matter. It then weaves and spins these subatomic tunnels through a Relativistic Gearbox and a Thread Convergence Node, ultimately extruding a permanent, macroscopic transit cable capable of instant interstellar communication and travel. The machine employs extreme spatial lensing, superconducting disruptors, and graviton anchoring to prevent catastrophic topological shears.";

    const quizQuestions = [
        {
            question: "In the context of Morris-Thorne traversable wormholes, what specific property of the stress-energy tensor is violated by the exotic matter required to keep the throat open?",
            options: [
                "Null Energy Condition (NEC)",
                "Weak Energy Condition (WEC)",
                "Dominant Energy Condition (DEC)",
                "Strong Energy Condition (SEC)"
            ],
            answer: 0
        },
        {
            question: "For a traversable wormhole constructed using the Visser thin-shell formalism, the junction conditions (Lanczos equations) relate the surface stress-energy tensor of the shell to what geometric quantity?",
            options: [
                "The Ricci scalar of the ambient spacetime",
                "The jump in the extrinsic curvature across the shell",
                "The Weyl tensor invariants",
                "The trace of the first fundamental form"
            ],
            answer: 1
        },
        {
            question: "Topologically, creating a wormhole that connects two distinct, previously unconnected asymptotic regions of a single spatial hypersurface changes its first Betti number ($b_1$) to what?",
            options: [
                "0",
                "1",
                "2",
                "-1"
            ],
            answer: 1
        },
        {
            question: "Under the ER=EPR conjecture, what severely restricts the ability to send macroscopic amounts of classical information instantaneously through a quantum wormhole formed by entangled black holes?",
            options: [
                "Hawking radiation evaporation rate",
                "The holographic bound and the requirement of classical communication to resolve causality",
                "The No-Cloning theorem",
                "The Bekenstein-Hawking entropy limit"
            ],
            answer: 1
        },
        {
            question: "When stabilizing a microscopic quantum wormhole using Casimir energy, the presence of negative energy density is restricted by Quantum Energy Inequalities (QEIs). How does the lower bound of the allowed negative energy density typically scale with the sampling time duration Δt?",
            options: [
                "It is proportional to Δt²",
                "It is inversely proportional to the fourth power of the time duration (Δt⁻⁴)",
                "It is inversely proportional to the square root of the time duration (Δt⁻¹/²)",
                "It scales logarithmically with Δt"
            ],
            answer: 1
        }
    ];

    // =========================================================================
    // ANIMATION LOGIC
    // =========================================================================
    function animate(time, speed, meshes) {
        const t = time * speed;
        
        // Hub and Spindles
        if(meshes.spoolHub) meshes.spoolHub.rotation.y = t * 2.0;
        if(meshes.driveShaft) meshes.driveShaft.rotation.z = t * 5.0;
        
        if(meshes.gears) {
            meshes.gears.forEach((g, i) => {
                // Alternating gear directions
                g.rotation.y = (i % 2 === 0 ? 1 : -1) * t * 5.0;
            });
        }

        // Stabilizing Rings - Counter rotating and pulsing
        if(meshes.ringAlpha) {
            meshes.ringAlpha.rotation.x = Math.sin(t) * 0.2;
            meshes.ringAlpha.rotation.y = -t * 1.5;
            const scaleAlpha = 1.0 + Math.sin(t * 5.0) * 0.05;
            meshes.ringAlpha.scale.set(scaleAlpha, scaleAlpha, scaleAlpha);
            // Pulse emissive material
            meshes.ringAlpha.children[0].material.emissiveIntensity = 4.0 + Math.sin(t * 10) * 2.0;
        }
        
        if(meshes.ringBeta) {
            meshes.ringBeta.rotation.x = Math.cos(t) * 0.1;
            meshes.ringBeta.rotation.y = t * 1.2;
            meshes.ringBeta.rotation.z = Math.sin(t * 0.5) * 0.1;
            meshes.ringBeta.children[0].material.emissiveIntensity = 3.0 + Math.cos(t * 8) * 1.5;
        }

        // Lensing Array
        if(meshes.lensingArray) {
            meshes.lensingArray.rotation.y = t * 3.0;
            meshes.lenses.forEach((lens, idx) => {
                lens.rotation.x = Math.PI / 2 + Math.sin(t * 2.0 + idx) * 0.5;
                // Inner rim pulses
                lens.children[0].material.emissiveIntensity = 2.0 + Math.sin(t * 15 + idx) * 2.0;
            });
        }

        // Relativistic Spindles
        if(meshes.spindles) {
            meshes.spindles.forEach((sGroup, i) => {
                // Spin extremely fast
                sGroup.children[0].rotation.y = t * 20.0 + i;
                // Oscillate position slightly to simulate tension
                const baseDist = 25;
                const offset = Math.sin(t * 10.0 + i) * 0.5;
                const angle = (i/3) * Math.PI * 2;
                sGroup.position.set(
                    Math.cos(angle) * (baseDist + offset),
                    45 + Math.cos(t * 5 + i) * 1,
                    Math.sin(angle) * (baseDist + offset)
                );
            });
        }

        // Thread Convergence Node
        if(meshes.convergenceNode) {
            meshes.convergenceNode.rotation.y = -t * 4.0;
            meshes.convergenceNode.rotation.x = t * 2.0;
            const nodeScale = 1.0 + Math.sin(t * 12.0) * 0.15;
            meshes.convergenceNode.scale.set(nodeScale, nodeScale, nodeScale);
            
            // Core materials flashing
            meshes.convergenceNode.children[0].material.emissiveIntensity = 5.0 + Math.random() * 5.0; // Sparking effect
        }

        // Node floating fragments
        if(meshes.nodeFragments) {
            meshes.nodeFragments.forEach(fragData => {
                fragData.angle += fragData.speed * speed;
                fragData.mesh.position.x = Math.cos(fragData.angle) * fragData.dist;
                fragData.mesh.position.z = Math.sin(fragData.angle) * fragData.dist;
                fragData.mesh.rotation.x += 0.1;
                fragData.mesh.rotation.y += 0.2;
            });
        }

        // Cable Extruder Rings
        if(meshes.extruderRings) {
            meshes.extruderRings.forEach((ring, i) => {
                ring.rotation.y = t * (i+1);
                ring.material.emissiveIntensity = 2.0 + Math.sin(t * 8 - i) * 2.0;
                ring.scale.setScalar(1.0 + Math.sin(t * 5 + i)*0.05);
            });
        }

        // Hydraulic Tensioners
        if(meshes.pistons) {
            meshes.pistons.forEach(p => {
                // Oscillating piston rods
                p.rod.position.y = 10 + Math.sin(t * 15 + p.side) * 3.0;
            });
        }

        // Spacetime Disruptor Coils
        if(meshes.disruptorRings) {
            meshes.disruptorRings.forEach((ring, i) => {
                ring.rotation.z = Math.sin(t * 2.0 + i * 0.5) * 0.2;
                ring.position.y = 5 + (i * 3) + Math.sin(t * 4 + i) * 0.3;
                ring.children[0].material.emissiveIntensity = 1.0 + Math.sin(t * 20 - i*0.5)*3.0; // Rapid sequencing
            });
        }

        // Flux Banks Emissives
        if(meshes.fluxCylinders) {
            meshes.fluxCylinders.forEach((f, i) => {
                const intensity = 1.0 + Math.max(0, Math.sin(t * 5 + i)) * 4.0; // Sequential charging glow
                f.b1.material.emissiveIntensity = intensity;
                f.b2.material.emissiveIntensity = intensity;
            });
        }

        // Containment Field
        if(meshes.magField) {
            meshes.magField.rotation.y = t * 0.5;
            meshes.magField.rotation.z = t * 0.2;
            // Pulsing the refractive index slightly or scale
            const fieldScale = 1.0 + Math.sin(t * 3.0) * 0.02;
            meshes.magField.scale.set(fieldScale, fieldScale, fieldScale);
        }

        // Macroscopic Cable Output flow effect
        if(meshes.cableOutput) {
            // Spin the inner core
            meshes.cableOutput.children[0].rotation.y = t * 5.0;
            meshes.cableOutput.children[0].material.emissiveIntensity = 4.0 + Math.sin(t * 10) * 2.0;
        }
    }

    return { group, parts, description, quizQuestions, animate, meshes };
}
