import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Animation registry
    const animationMeshes = {
        wheels: [],
        needles: [],
        rings: [],
        bubbles: [],
        pistons: [],
        lines: [],
        rotors: [],
        tears: [],
        spikes: [],
        vents: []
    };

    // -------------------------------------------------------------------------
    // CUSTOM ADVANCED MATERIALS
    // -------------------------------------------------------------------------
    const trueVacuumMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x00ffff,
        emissiveIntensity: 4.0,
        transparent: true,
        opacity: 0.9,
        wireframe: false,
        roughness: 0.0,
        metalness: 1.0
    });

    const falseVacuumMat = new THREE.MeshStandardMaterial({
        color: 0x220022,
        emissive: 0x8800ff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.6,
        wireframe: true,
        roughness: 0.2,
        metalness: 0.8
    });

    const realityTearMat = new THREE.MeshStandardMaterial({
        color: 0x000000,
        emissive: 0xff0044,
        emissiveIntensity: 5.0,
        transparent: true,
        opacity: 0.8,
        wireframe: false,
        side: THREE.DoubleSide
    });

    const glowingNeedleMat = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff88,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.8
    });

    const plasmaVentMat = new THREE.MeshStandardMaterial({
        color: 0xff8800,
        emissive: 0xff4400,
        emissiveIntensity: 3.0,
        transparent: true,
        opacity: 0.7
    });

    const neonPanelMat = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0044ff,
        emissiveIntensity: 1.5
    });

    // -------------------------------------------------------------------------
    // HELPER FUNCTIONS
    // -------------------------------------------------------------------------
    
    function createComplexWheel(radius, tube, radialSegments, tubularSegments) {
        const wheelGroup = new THREE.Group();
        
        // Main Tire Body
        const tireGeo = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments);
        const tire = new THREE.Mesh(tireGeo, rubber);
        wheelGroup.add(tire);

        // Microscopic Aggressive Treads (Lugs)
        const numLugs = 180;
        const lugGeo = new THREE.BoxGeometry(tube * 0.9, tube * 0.35, tube * 1.3);
        for (let i = 0; i < numLugs; i++) {
            const angle = (i / numLugs) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeo, rubber);
            lug.position.x = Math.cos(angle) * radius;
            lug.position.y = Math.sin(angle) * radius;
            lug.rotation.z = angle;
            if (i % 2 === 0) {
                lug.position.z = tube * 0.45;
                lug.rotation.x = 0.25;
            } else {
                lug.position.z = -tube * 0.45;
                lug.rotation.x = -0.25;
            }
            wheelGroup.add(lug);
        }

        // Rim Configuration
        const rimRadius = radius - tube * 0.85;
        const rimGeo = new THREE.CylinderGeometry(rimRadius, rimRadius, tube * 1.6, 64);
        const rim = new THREE.Mesh(rimGeo, darkSteel);
        rim.rotation.x = Math.PI / 2;
        wheelGroup.add(rim);

        // Complex Spoke Array
        const numSpokes = 24;
        const spokeGeo = new THREE.CylinderGeometry(tube * 0.15, tube * 0.25, rimRadius * 2, 16);
        for (let i = 0; i < numSpokes / 2; i++) {
            const angle = (i / (numSpokes / 2)) * Math.PI;
            const spoke = new THREE.Mesh(spokeGeo, chrome);
            spoke.rotation.z = angle;
            spoke.rotation.x = Math.PI / 2;
            wheelGroup.add(spoke);
        }

        // Inner Hub / Axle Mount
        const hubGeo = new THREE.CylinderGeometry(tube * 1.2, tube * 1.2, tube * 1.9, 32);
        const hub = new THREE.Mesh(hubGeo, steel);
        hub.rotation.x = Math.PI / 2;
        wheelGroup.add(hub);

        // Hub Bolts
        const boltGeo = new THREE.CylinderGeometry(tube * 0.1, tube * 0.1, tube * 2.1, 8);
        for (let j = 0; j < 8; j++) {
            const bAngle = (j / 8) * Math.PI * 2;
            const bolt = new THREE.Mesh(boltGeo, chrome);
            bolt.position.x = Math.cos(bAngle) * (tube * 0.8);
            bolt.position.y = Math.sin(bAngle) * (tube * 0.8);
            bolt.rotation.x = Math.PI / 2;
            wheelGroup.add(bolt);
        }

        return wheelGroup;
    }

    function createHydraulicPiston(length, radius) {
        const pistonGroup = new THREE.Group();
        
        // Outer Cylinder
        const outerGeo = new THREE.CylinderGeometry(radius, radius, length * 0.6, 32);
        const outer = new THREE.Mesh(outerGeo, darkSteel);
        outer.position.y = length * 0.3;
        pistonGroup.add(outer);

        // Inner Rod
        const innerGeo = new THREE.CylinderGeometry(radius * 0.6, radius * 0.6, length * 0.8, 32);
        const inner = new THREE.Mesh(innerGeo, chrome);
        inner.position.y = length * 0.6;
        pistonGroup.add(inner);

        // Base Mount
        const mountGeo = new THREE.BoxGeometry(radius * 3, radius * 2, radius * 3);
        const mount = new THREE.Mesh(mountGeo, steel);
        pistonGroup.add(mount);

        // Top Eyelet
        const eyeGeo = new THREE.TorusGeometry(radius, radius * 0.4, 16, 32);
        const eye = new THREE.Mesh(eyeGeo, steel);
        eye.position.y = length;
        eye.rotation.y = Math.PI / 2;
        pistonGroup.add(eye);

        return { group: pistonGroup, rod: inner, eye: eye };
    }

    // -------------------------------------------------------------------------
    // 1. MASSIVE CHASSIS CONSTRUCTION
    // -------------------------------------------------------------------------
    const chassisAssembly = new THREE.Group();
    
    const chassisShape = new THREE.Shape();
    chassisShape.moveTo(-120, -20);
    chassisShape.lineTo(120, -20);
    chassisShape.lineTo(140, 0);
    chassisShape.lineTo(120, 30);
    chassisShape.lineTo(40, 45);
    chassisShape.lineTo(-40, 45);
    chassisShape.lineTo(-120, 30);
    chassisShape.lineTo(-140, 0);
    chassisShape.lineTo(-120, -20);

    const chassisExtrudeOpts = { depth: 80, bevelEnabled: true, bevelSegments: 8, steps: 10, bevelSize: 2, bevelThickness: 2 };
    const chassisGeo = new THREE.ExtrudeGeometry(chassisShape, chassisExtrudeOpts);
    // Center the chassis geometry
    chassisGeo.translate(0, 0, -40);
    const mainChassis = new THREE.Mesh(chassisGeo, darkSteel);
    chassisAssembly.add(mainChassis);

    // Chassis Ribbing / Armor Plating
    for(let i = -100; i <= 100; i += 20) {
        const ribGeo = new THREE.BoxGeometry(10, 70, 86);
        const rib = new THREE.Mesh(ribGeo, steel);
        rib.position.set(i, 10, 0);
        chassisAssembly.add(rib);
    }

    chassisAssembly.position.set(0, 60, 0);
    group.add(chassisAssembly);

    parts.push({
        name: "God-Tier Crawler Chassis",
        description: "Massive hyper-dense dark steel chassis designed to withstand localized gravitational anomalies and reality shearing.",
        material: "Dark Steel / Armor Plating",
        function: "Structural foundation for all vacuum extraction and containment modules.",
        assemblyOrder: 1,
        connections: ["Suspension Systems", "Containment Vessel", "Command Cabin"],
        failureEffect: "Complete structural compromise leading to immediate implosion of the local spacetime geometry.",
        cascadeFailures: ["Containment Breach", "Siphon Misalignment"],
        originalPosition: { x: 0, y: 60, z: 0 },
        explodedPosition: { x: 0, y: 150, z: 0 }
    });

    // -------------------------------------------------------------------------
    // 2. 8-WHEEL SUSPENSION & DRIVE SYSTEM
    // -------------------------------------------------------------------------
    const wheelPositions = [
        { id: "FL", x: 100, y: 30, z: 50 },
        { id: "FR", x: 100, y: 30, z: -50 },
        { id: "ML1", x: 35, y: 30, z: 55 },
        { id: "MR1", x: 35, y: 30, z: -55 },
        { id: "ML2", x: -35, y: 30, z: 55 },
        { id: "MR2", x: -35, y: 30, z: -55 },
        { id: "RL", x: -100, y: 30, z: 50 },
        { id: "RR", x: -100, y: 30, z: -50 },
    ];

    wheelPositions.forEach((pos, index) => {
        const wRadius = (pos.id.includes("M")) ? 22 : 28;
        const wTube = (pos.id.includes("M")) ? 8 : 10;
        
        const wheel = createComplexWheel(wRadius, wTube, 64, 64);
        wheel.position.set(pos.x, pos.y, pos.z);
        group.add(wheel);
        animationMeshes.wheels.push(wheel);

        // Suspension Arm
        const armGeo = new THREE.BoxGeometry(20, 10, 30);
        const arm = new THREE.Mesh(armGeo, steel);
        arm.position.set(pos.x, pos.y + 20, (pos.z > 0) ? pos.z - 20 : pos.z + 20);
        arm.rotation.x = (pos.z > 0) ? -0.5 : 0.5;
        group.add(arm);

        // Hydraulic strut
        const strut = createHydraulicPiston(40, 3);
        strut.group.position.set(pos.x, pos.y + 10, (pos.z > 0) ? pos.z - 10 : pos.z + 10);
        strut.group.lookAt(pos.x, pos.y + 50, 0);
        group.add(strut.group);

        parts.push({
            name: `Drive Wheel Assembly ${pos.id}`,
            description: `Ultra-heavy-duty omni-directional drive wheel with ${pos.id.includes("M") ? "support" : "primary"} micro-lug traction configuration.`,
            material: "Synthetic Rubber, Chrome, Dark Steel",
            function: "Provides mobile stability and fine positioning required for delicate needle insertion.",
            assemblyOrder: 2 + index,
            connections: ["Crawler Chassis", "Suspension Systems"],
            failureEffect: "Loss of mobility; potential tipping inducing a shift in the vacuum bubble's center of mass.",
            cascadeFailures: ["Needle Shear", "Vessel Destabilization"],
            originalPosition: { x: pos.x, y: pos.y, z: pos.z },
            explodedPosition: { x: pos.x * 2, y: pos.y, z: pos.z * 2 }
        });
    });

    // -------------------------------------------------------------------------
    // 3. CONTAINMENT VESSEL (MASSIVE TORUS LATHE)
    // -------------------------------------------------------------------------
    const vesselGroup = new THREE.Group();
    vesselGroup.position.set(0, 150, 0);

    const vesselPoints = [];
    for (let i = 0; i <= 100; i++) {
        const t = i / 100;
        const radius = 60 + Math.sin(t * Math.PI) * 25 + Math.sin(t * Math.PI * 5) * 2;
        const y = (t - 0.5) * 120;
        vesselPoints.push(new THREE.Vector2(radius, y));
    }
    const vesselGeo = new THREE.LatheGeometry(vesselPoints, 128);
    const vessel = new THREE.Mesh(vesselGeo, darkSteel);
    vesselGroup.add(vessel);

    // Inner glowing lining
    const liningPoints = [];
    for (let i = 0; i <= 100; i++) {
        const t = i / 100;
        const radius = 58 + Math.sin(t * Math.PI) * 23;
        const y = (t - 0.5) * 115;
        liningPoints.push(new THREE.Vector2(radius, y));
    }
    const liningGeo = new THREE.LatheGeometry(liningPoints, 64);
    const lining = new THREE.Mesh(liningGeo, neonPanelMat);
    vesselGroup.add(lining);

    group.add(vesselGroup);

    parts.push({
        name: "Toroidal Containment Vessel",
        description: "Massive lathed dark steel vessel utilizing harmonic magnetic compression to stabilize the false vacuum boundary.",
        material: "Dark Steel, Neon Plasma Lining",
        function: "Contains the true vacuum bubble and shields the external environment from reality degradation.",
        assemblyOrder: 15,
        connections: ["Crawler Chassis", "Siphon Needle Array", "True Vacuum Bubble"],
        failureEffect: "Instantaneous expansion of the true vacuum at the speed of light, obliterating the universe.",
        cascadeFailures: ["Total Universal Existence Failure"],
        originalPosition: { x: 0, y: 150, z: 0 },
        explodedPosition: { x: 0, y: 250, z: 0 }
    });

    // -------------------------------------------------------------------------
    // 4. THE BUBBLE (TRUE VACUUM CORE + FALSE VACUUM MARGIN)
    // -------------------------------------------------------------------------
    const bubbleGroup = new THREE.Group();
    bubbleGroup.position.set(0, 150, 0);

    // True Vacuum Core (Highly subdivided for vertex animation)
    const trueCoreGeo = new THREE.IcosahedronGeometry(35, 12);
    // Store original vertices for wobble effect
    const corePos = trueCoreGeo.attributes.position;
    trueCoreGeo.userData = { originalPositions: [] };
    for(let i=0; i<corePos.count; i++) {
        trueCoreGeo.userData.originalPositions.push(new THREE.Vector3(corePos.getX(i), corePos.getY(i), corePos.getZ(i)));
    }
    const trueCore = new THREE.Mesh(trueCoreGeo, trueVacuumMat);
    bubbleGroup.add(trueCore);
    animationMeshes.bubbles.push({ mesh: trueCore, speed: 3.0, amplitude: 1.5, complexity: 5.0 });

    // False Vacuum Margin (Outer shell, wireframe-like)
    const falseMarginGeo = new THREE.IcosahedronGeometry(42, 8);
    const marginPos = falseMarginGeo.attributes.position;
    falseMarginGeo.userData = { originalPositions: [] };
    for(let i=0; i<marginPos.count; i++) {
        falseMarginGeo.userData.originalPositions.push(new THREE.Vector3(marginPos.getX(i), marginPos.getY(i), marginPos.getZ(i)));
    }
    const falseMargin = new THREE.Mesh(falseMarginGeo, falseVacuumMat);
    bubbleGroup.add(falseMargin);
    animationMeshes.bubbles.push({ mesh: falseMargin, speed: 1.5, amplitude: 2.5, complexity: 2.0 });

    group.add(bubbleGroup);

    parts.push({
        name: "True Vacuum Core Bubble",
        description: "A pocket of lower-energy vacuum state, vibrating violently against the constraints of our false vacuum reality.",
        material: "Condensed Quantum Foam (True Vacuum)",
        function: "Source of infinite zero-point energy extraction.",
        assemblyOrder: 16,
        connections: ["False Vacuum Margin", "Siphon Needles"],
        failureEffect: "Bubble expansion.",
        cascadeFailures: ["Universal Phase Transition"],
        originalPosition: { x: 0, y: 150, z: 0 },
        explodedPosition: { x: 0, y: 150, z: 100 }
    });

    parts.push({
        name: "False Vacuum Margin Layer",
        description: "The delicate, artificially thickened domain wall separating the true vacuum from our universe.",
        material: "Excited Higgs Field Margin",
        function: "Acts as a buffer preventing immediate runaway expansion of the core.",
        assemblyOrder: 17,
        connections: ["True Vacuum Core", "Containment Vessel"],
        failureEffect: "Thinning of the wall leading to quantum tunneling breach.",
        cascadeFailures: ["True Vacuum Core Breach"],
        originalPosition: { x: 0, y: 150, z: 0 },
        explodedPosition: { x: 0, y: 150, z: -100 }
    });

    // -------------------------------------------------------------------------
    // 5. MICROSCOPIC PRECISION SIPHON NEEDLES
    // -------------------------------------------------------------------------
    const needleGroup = new THREE.Group();
    needleGroup.position.set(0, 150, 0);
    const numNeedles = 24;

    for (let i = 0; i < numNeedles; i++) {
        const phi = Math.acos( -1 + ( 2 * i ) / numNeedles );
        const theta = Math.sqrt( numNeedles * Math.PI ) * phi;

        const r = 85; // Starting radius outside the vessel
        const nx = r * Math.cos(theta) * Math.sin(phi);
        const ny = r * Math.sin(theta) * Math.sin(phi);
        const nz = r * Math.cos(phi);

        const nAssembly = new THREE.Group();

        // Base Housing
        const baseGeo = new THREE.CylinderGeometry(4, 6, 15, 32);
        const base = new THREE.Mesh(baseGeo, darkSteel);
        base.position.y = 7.5;
        nAssembly.add(base);

        // Retractable Shaft
        const shaftGeo = new THREE.CylinderGeometry(1.5, 2, 30, 32);
        const shaft = new THREE.Mesh(shaftGeo, chrome);
        shaft.position.y = 30;
        nAssembly.add(shaft);

        // Micro-injector tip
        const tipGeo = new THREE.ConeGeometry(1.5, 10, 32);
        const tip = new THREE.Mesh(tipGeo, glowingNeedleMat);
        tip.position.y = 50;
        nAssembly.add(tip);

        // Hydraulic actuators for the needle
        const nHydGeo = new THREE.CylinderGeometry(0.5, 0.5, 20, 16);
        const nHyd1 = new THREE.Mesh(nHydGeo, copper);
        nHyd1.position.set(3, 20, 0);
        nAssembly.add(nHyd1);
        const nHyd2 = new THREE.Mesh(nHydGeo, copper);
        nHyd2.position.set(-3, 20, 0);
        nAssembly.add(nHyd2);

        nAssembly.position.set(nx, ny, nz);
        nAssembly.lookAt(0, 0, 0);
        nAssembly.rotateX(Math.PI / 2); // Align Y with inward vector

        nAssembly.userData = {
            basePos: new THREE.Vector3(nx, ny, nz),
            dir: new THREE.Vector3(-nx, -ny, -nz).normalize(),
            phase: Math.random() * Math.PI * 2,
            speed: 0.5 + Math.random() * 0.5
        };

        needleGroup.add(nAssembly);
        animationMeshes.needles.push(nAssembly);
    }
    group.add(needleGroup);

    parts.push({
        name: "Omni-Directional Siphon Needle Array",
        description: "24 independently articulated, microscopic-precision energy extraction siphons. Tip width is measured in Planck lengths.",
        material: "Chrome, Dark Steel, Emissive Metamaterials",
        function: "Penetrates the false vacuum margin to siphon raw zero-point energy without collapsing the bubble.",
        assemblyOrder: 18,
        connections: ["Containment Vessel", "True Vacuum Core", "Energy Routing Network"],
        failureEffect: "Puncturing the bubble wall too deeply causes a localized reality tear.",
        cascadeFailures: ["Reality Tearing", "Containment Vessel Rupture"],
        originalPosition: { x: 0, y: 150, z: 0 },
        explodedPosition: { x: 200, y: 150, z: 0 }
    });

    // -------------------------------------------------------------------------
    // 6. REALITY TEARING RINGS
    // -------------------------------------------------------------------------
    const ringGroup = new THREE.Group();
    ringGroup.position.set(0, 150, 0);

    const ringRadii = [90, 100, 110, 120];
    ringRadii.forEach((r, idx) => {
        // Outer mechanical ring
        const rGeo = new THREE.TorusGeometry(r, 2, 32, 128);
        const rMesh = new THREE.Mesh(rGeo, steel);
        
        // Inner tearing energy ring (custom buffer geometry for spiked chaos)
        const tearGeo = new THREE.BufferGeometry();
        const tearVerts = [];
        for(let i=0; i<360; i++) {
            const angle = (i / 360) * Math.PI * 2;
            const radVar = r - 5 + Math.random() * 10;
            tearVerts.push(Math.cos(angle)*radVar, Math.sin(angle)*radVar, (Math.random()-0.5)*5);
        }
        tearGeo.setAttribute('position', new THREE.Float32BufferAttribute(tearVerts, 3));
        const tearLines = new THREE.LineLoop(tearGeo, new THREE.LineBasicMaterial({ color: 0xff0044, transparent: true, opacity: 0.8 }));
        
        const subGroup = new THREE.Group();
        subGroup.add(rMesh);
        subGroup.add(tearLines);
        
        subGroup.rotation.x = Math.random() * Math.PI;
        subGroup.rotation.y = Math.random() * Math.PI;

        ringGroup.add(subGroup);
        animationMeshes.rings.push({
            mesh: subGroup,
            tearLines: tearLines,
            speedX: (Math.random() - 0.5) * 2.0,
            speedY: (Math.random() - 0.5) * 2.0,
            speedZ: (Math.random() - 0.5) * 2.0
        });
    });
    group.add(ringGroup);

    parts.push({
        name: "Reality Tearing Containment Rings",
        description: "High-velocity gyroscopic stabilizer rings laced with exotic matter to mend micro-tears in spacetime.",
        material: "Steel, Exotic Matter Plasma",
        function: "Counteracts the localized gravitational sheer forces generated by the extraction process.",
        assemblyOrder: 19,
        connections: ["Containment Vessel"],
        failureEffect: "Spacetime micro-fractures propagate, leaking radiation from alternate dimensions.",
        cascadeFailures: ["Observer Sensor Array Blinding", "Chassis Melting"],
        originalPosition: { x: 0, y: 150, z: 0 },
        explodedPosition: { x: 0, y: 350, z: 0 }
    });

    // -------------------------------------------------------------------------
    // 7. COMPLEX HYDRAULIC & COOLANT LINES (TUBE GEOMETRY)
    // -------------------------------------------------------------------------
    const lineGroup = new THREE.Group();
    
    // Generate 30 erratic cooling lines running from chassis to vessel
    for (let i = 0; i < 30; i++) {
        const startX = (Math.random() - 0.5) * 200;
        const startZ = (Math.random() - 0.5) * 100;
        
        const endAngle = Math.random() * Math.PI * 2;
        const endX = Math.cos(endAngle) * 80;
        const endZ = Math.sin(endAngle) * 80;

        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(startX, 60, startZ),
            new THREE.Vector3(startX * 0.8, 90, startZ * 0.8 + (Math.random() - 0.5)*50),
            new THREE.Vector3(endX * 1.5, 120, endZ * 1.5 + (Math.random() - 0.5)*50),
            new THREE.Vector3(endX, 150, endZ)
        ]);

        const tubeGeo = new THREE.TubeGeometry(curve, 64, 1.5 + Math.random(), 16, false);
        const isCoolant = Math.random() > 0.5;
        const tube = new THREE.Mesh(tubeGeo, isCoolant ? copper : neonPanelMat);
        lineGroup.add(tube);
        
        if (!isCoolant) {
            animationMeshes.lines.push({ mesh: tube, phase: Math.random() * Math.PI * 2 });
        }
    }
    group.add(lineGroup);

    parts.push({
        name: "High-Pressure Coolant & Energy Routing Network",
        description: "An intricate, chaotic tangle of super-cooled copper and plasma conduits.",
        material: "Copper, Plasma Conduits",
        function: "Transfers raw zero-point energy to the turbines while continuously cooling the vessel shell.",
        assemblyOrder: 20,
        connections: ["Containment Vessel", "Chassis", "Turbines"],
        failureEffect: "Massive thermal runaway causing instantaneous vessel vaporization.",
        cascadeFailures: ["Vessel Destabilization"],
        originalPosition: { x: 0, y: 100, z: 0 },
        explodedPosition: { x: 0, y: 100, z: 150 }
    });

    // -------------------------------------------------------------------------
    // 8. OPERATOR CABIN (HIGH DETAIL)
    // -------------------------------------------------------------------------
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(0, 100, 100);

    // Cabin Shell
    const cShape = new THREE.Shape();
    cShape.moveTo(-30, 0);
    cShape.lineTo(30, 0);
    cShape.lineTo(40, 30);
    cShape.lineTo(20, 50);
    cShape.lineTo(-20, 50);
    cShape.lineTo(-40, 30);
    cShape.lineTo(-30, 0);
    const cExtrude = { depth: 50, bevelEnabled: true, bevelSegments: 4, steps: 4, bevelSize: 1, bevelThickness: 1 };
    const cGeo = new THREE.ExtrudeGeometry(cShape, cExtrude);
    cGeo.translate(0, 0, -25);
    const cabinShell = new THREE.Mesh(cGeo, steel);
    cabinGroup.add(cabinShell);

    // Front Window (Tinted Glass)
    const winGeo = new THREE.PlaneGeometry(50, 25);
    const windowMesh = new THREE.Mesh(winGeo, tinted);
    windowMesh.position.set(0, 35, 26);
    windowMesh.rotation.x = -0.2;
    cabinGroup.add(windowMesh);

    // Interior Details
    const seatGeo = new THREE.BoxGeometry(10, 15, 10);
    const seat = new THREE.Mesh(seatGeo, rubber);
    seat.position.set(0, 10, 0);
    cabinGroup.add(seat);

    const consoleGeo = new THREE.BoxGeometry(40, 15, 15);
    const controlConsole = new THREE.Mesh(consoleGeo, darkSteel);
    controlConsole.position.set(0, 15, 15);
    cabinGroup.add(controlConsole);

    // Glowing Screens
    for(let i=0; i<3; i++) {
        const screenGeo = new THREE.PlaneGeometry(10, 8);
        const screen = new THREE.Mesh(screenGeo, neonPanelMat);
        screen.position.set(-12 + i*12, 25, 20);
        screen.rotation.x = -0.3;
        cabinGroup.add(screen);
        animationMeshes.glows.push({ mesh: screen, phase: Math.random() * 10 });
    }

    // Joysticks
    const stickGeo = new THREE.CylinderGeometry(0.5, 0.5, 8, 16);
    const stickL = new THREE.Mesh(stickGeo, chrome);
    stickL.position.set(-10, 25, 10);
    stickL.rotation.x = 0.5;
    cabinGroup.add(stickL);
    
    const stickR = new THREE.Mesh(stickGeo, chrome);
    stickR.position.set(10, 25, 10);
    stickR.rotation.x = 0.5;
    cabinGroup.add(stickR);

    // Emergency Scram Button
    const scramGeo = new THREE.CylinderGeometry(2, 2, 2, 16);
    const scramMat = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0x550000 });
    const scram = new THREE.Mesh(scramGeo, scramMat);
    scram.position.set(0, 23, 12);
    cabinGroup.add(scram);

    // Roof Radar/Antenna array
    const radarMast = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 30, 16), steel);
    radarMast.position.set(0, 65, 0);
    cabinGroup.add(radarMast);

    const radarDish = new THREE.Mesh(new THREE.SphereGeometry(8, 16, 16, 0, Math.PI), plastic);
    radarDish.position.set(0, 80, 0);
    radarDish.rotation.x = Math.PI / 2;
    cabinGroup.add(radarDish);
    animationMeshes.rotors.push({ mesh: radarDish, axis: 'y', speed: 1.0 });

    group.add(cabinGroup);

    parts.push({
        name: "Operator Command Cabin",
        description: "Heavily shielded, pressurized command center for the singular operator brave (or foolish) enough to pilot this rig.",
        material: "Steel, Tinted Armorglass",
        function: "Houses pilot, control consoles, and the emergency scram systems.",
        assemblyOrder: 21,
        connections: ["Chassis"],
        failureEffect: "Operator is exposed to raw chronal radiation, resulting in instant biological de-synchronization.",
        cascadeFailures: ["Loss of Manual Override"],
        originalPosition: { x: 0, y: 100, z: 100 },
        explodedPosition: { x: 0, y: 100, z: 250 }
    });

    parts.push({
        name: "Quantum Field Control Panel & Joysticks",
        description: "Tactile interface for micrometric adjustments of the 24 siphon needles.",
        material: "Dark Steel, Neon Displays, Chrome",
        function: "Translates human macro-movements into Planck-scale needle adjustments.",
        assemblyOrder: 22,
        connections: ["Operator Command Cabin"],
        failureEffect: "Loss of needle control.",
        cascadeFailures: ["Needle Puncture Event"],
        originalPosition: { x: 0, y: 115, z: 115 },
        explodedPosition: { x: 0, y: 115, z: 300 }
    });

    // -------------------------------------------------------------------------
    // 9. EXHAUST STACKS & PLASMA VENTS
    // -------------------------------------------------------------------------
    const ventGroup = new THREE.Group();
    for (let i = 0; i < 6; i++) {
        const xPos = (i % 2 === 0) ? -100 : 100;
        const zPos = -40 + Math.floor(i / 2) * 30;

        const stackBase = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 40, 32), darkSteel);
        stackBase.position.set(xPos, 80, zPos);
        ventGroup.add(stackBase);

        const stackFlap = new THREE.Mesh(new THREE.CylinderGeometry(6, 6, 5, 32), chrome);
        stackFlap.position.set(xPos, 100, zPos);
        ventGroup.add(stackFlap);

        // Plasma Flame
        const flameGeo = new THREE.ConeGeometry(4, 20, 16);
        const flame = new THREE.Mesh(flameGeo, plasmaVentMat);
        flame.position.set(xPos, 110, zPos);
        ventGroup.add(flame);
        animationMeshes.vents.push({ mesh: flame, phase: Math.random() * Math.PI * 2 });
    }
    group.add(ventGroup);

    parts.push({
        name: "Plasma Exhaust Stacks",
        description: "Six towering thermal exhaust arrays designed to vent Hawking radiation generated by micro-black holes in the cooling system.",
        material: "Dark Steel, Chrome, Plasma",
        function: "Prevents chassis meltdown by venting extreme exotic thermal loads.",
        assemblyOrder: 23,
        connections: ["Chassis", "Coolant Lines"],
        failureEffect: "Thermal cascade melting the chassis.",
        cascadeFailures: ["Structural Compromise"],
        originalPosition: { x: 0, y: 80, z: -10 },
        explodedPosition: { x: 0, y: 80, z: -150 }
    });

    // -------------------------------------------------------------------------
    // 10. AFT POWER GENERATION TURBINE & ANCHOR SPIKES
    // -------------------------------------------------------------------------
    const aftGroup = new THREE.Group();
    aftGroup.position.set(0, 60, -120);

    const turbineHousingGeo = new THREE.CylinderGeometry(30, 30, 60, 64);
    const turbineHousing = new THREE.Mesh(turbineHousingGeo, darkSteel);
    turbineHousing.rotation.z = Math.PI / 2;
    aftGroup.add(turbineHousing);

    const rotorGeo = new THREE.TorusGeometry(20, 5, 16, 64);
    const rotor1 = new THREE.Mesh(rotorGeo, chrome);
    rotor1.position.x = -30;
    rotor1.rotation.y = Math.PI / 2;
    aftGroup.add(rotor1);
    animationMeshes.rotors.push({ mesh: rotor1, axis: 'x', speed: 5.0 });

    const rotor2 = new THREE.Mesh(rotorGeo, chrome);
    rotor2.position.x = 30;
    rotor2.rotation.y = Math.PI / 2;
    aftGroup.add(rotor2);
    animationMeshes.rotors.push({ mesh: rotor2, axis: 'x', speed: -5.0 });

    // Temporal Anchor Spikes (drilling into the ground)
    for (let i = -1; i <= 1; i += 2) {
        const spikeGeo = new THREE.ConeGeometry(5, 50, 16);
        const spike = new THREE.Mesh(spikeGeo, steel);
        spike.position.set(i * 40, -25, 0);
        spike.rotation.x = Math.PI; // point down
        aftGroup.add(spike);
        animationMeshes.spikes.push({ mesh: spike, phase: Math.random() * Math.PI });
    }

    group.add(aftGroup);

    parts.push({
        name: "Aft Power Generation Turbine",
        description: "Massive dual-rotor turbine converting captured zero-point energy into conventional electrical power for the chassis.",
        material: "Dark Steel, Chrome Rotors",
        function: "Self-sustains the harvester's massive energy requirements once extraction begins.",
        assemblyOrder: 24,
        connections: ["Chassis", "Coolant Lines"],
        failureEffect: "Loss of power to containment vessel.",
        cascadeFailures: ["Vessel Destabilization", "Total Universal Failure"],
        originalPosition: { x: 0, y: 60, z: -120 },
        explodedPosition: { x: 0, y: -50, z: -250 }
    });

    parts.push({
        name: "Temporal Anchor Spikes",
        description: "Heavy durasteel spikes that penetrate the bedrock and lock the harvester's frame to the local flow of time.",
        material: "Steel",
        function: "Prevents the harvester from drifting into the future or past during high-extraction phases.",
        assemblyOrder: 25,
        connections: ["Aft Turbine", "Chassis"],
        failureEffect: "Harvester spontaneously exists 5 minutes in the past, occupying the same space as itself, causing a massive explosion.",
        cascadeFailures: ["Paradoxical Annihilation"],
        originalPosition: { x: 0, y: 35, z: -120 },
        explodedPosition: { x: 0, y: -100, z: -120 }
    });

    // -------------------------------------------------------------------------
    // LADDERS, RAILS, AND MICRO DETAILS (Adding complexity)
    // -------------------------------------------------------------------------
    const ladderGroup = new THREE.Group();
    for (let l = -1; l <= 1; l += 2) {
        for(let step = 0; step < 20; step++) {
            const stepMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 8, 8), aluminum);
            stepMesh.position.set(l * 125, 10 + step * 5, 0);
            stepMesh.rotation.z = Math.PI / 2;
            ladderGroup.add(stepMesh);
        }
        // Rails
        const railGeo = new THREE.CylinderGeometry(0.7, 0.7, 100, 8);
        const rail1 = new THREE.Mesh(railGeo, steel);
        rail1.position.set(l * 125 - 4, 60, 0);
        ladderGroup.add(rail1);
        const rail2 = new THREE.Mesh(railGeo, steel);
        rail2.position.set(l * 125 + 4, 60, 0);
        ladderGroup.add(rail2);
    }
    group.add(ladderGroup);
    
    parts.push({
        name: "Maintenance Access Ladders & Rails",
        description: "Frail aluminum steps allowing engineers to scale the impossibly dangerous chassis.",
        material: "Aluminum, Steel",
        function: "Manual access to the vessel shell for field repairs.",
        assemblyOrder: 26,
        connections: ["Chassis"],
        failureEffect: "Engineer falls to their doom.",
        cascadeFailures: [],
        originalPosition: { x: 125, y: 60, z: 0 },
        explodedPosition: { x: 300, y: 60, z: 0 }
    });

    // -------------------------------------------------------------------------
    // QUIZ QUESTIONS (PhD LEVEL QFT)
    // -------------------------------------------------------------------------
    const quizQuestions = [
        {
            question: "In the context of Coleman-De Luccia tunneling, what is the exact physical significance of the Euclidean bounce solution O(4) symmetric instanton?",
            options: [
                "It represents the classical trajectory of the field rolling down the potential hill.",
                "It describes the classically forbidden path through the potential barrier, dictating the dominant contribution to the path integral for the decay rate.",
                "It determines the final thermal energy state of the true vacuum after percolation.",
                "It acts as a topological defect preventing the complete decay of the false vacuum."
            ],
            correctAnswer: 1,
            explanation: "The Euclidean bounce solution evaluates the action in imaginary time, providing the semi-classical exponent for the quantum tunneling rate through the barrier separating the vacua."
        },
        {
            question: "How does the inclusion of gravitational backreaction via the Israel junction conditions affect the nucleation rate of a true vacuum bubble?",
            options: [
                "It generally suppresses the decay rate, and can strictly stabilize the false vacuum if the true vacuum possesses a large negative cosmological constant.",
                "It universally enhances the decay rate by providing a gravitational assist to the domain wall.",
                "It forces the nucleating bubble to have a radius exactly equal to the Schwarzschild radius.",
                "It prevents the nucleation of bubbles altogether unless the background spacetime is Anti-de Sitter."
            ],
            correctAnswer: 0,
            explanation: "Gravitational effects, particularly when the true vacuum has a negative energy density (AdS), can increase the effective action of the bounce, thereby exponentially suppressing the decay, sometimes rendering the false vacuum absolutely stable."
        },
        {
            question: "When evaluating the effective potential for a first-order phase transition at finite temperature, which term plays the critical role in restoring symmetry at high T?",
            options: [
                "The Coleman-Weinberg one-loop logarithmic correction.",
                "The term proportional to T^2 phi^2, generated by thermal fluctuations of particles coupled to the scalar field.",
                "The negative mass-squared term at tree level.",
                "The instanton-induced symmetry breaking parameter."
            ],
            correctAnswer: 1,
            explanation: "High-temperature expansions of the thermal effective potential yield a term ~ c T^2 phi^2, which provides a positive effective mass squared at the origin, restoring the symmetry when T is greater than the critical temperature."
        },
        {
            question: "What is the primary assumption and utility of the 'thin-wall approximation' in calculating false vacuum decay?",
            options: [
                "It assumes the barrier is infinitely high, making the transition instantaneous.",
                "It assumes the bubble wall contains no tension or localized energy density.",
                "It assumes the energy difference (epsilon) between the true and false vacua is small compared to the barrier height, allowing the action to be written analytically in terms of surface tension and volume energy.",
                "It implies the scalar field mass must be zero to allow thin domain walls."
            ],
            correctAnswer: 2,
            explanation: "The thin-wall approximation treats the bubble wall as a sharp boundary with a defined surface tension (S1). The action is then approximated as a competition between the volume energy gain and the surface area cost, simplifying the calculation of the critical radius."
        },
        {
            question: "If the expansion rate of a de Sitter universe (Hubble parameter H) vastly exceeds the nucleation rate (Gamma) of true vacuum bubbles, what cosmological scenario unfolds?",
            options: [
                "The true vacuum bubbles immediately coalesce and trigger a Big Crunch.",
                "The false vacuum transitions classically via a slow-roll mechanism rather than tunneling.",
                "The universe enters a state of eternal inflation, as the physical volume of the false vacuum grows faster than it is consumed by nucleating bubbles.",
                "The cosmological constant decays to exactly zero globally."
            ],
            correctAnswer: 2,
            explanation: "Because the false vacuum volume expands exponentially as V ~ e^(3Ht), if Gamma << H^4, the bubbles of true vacuum are driven apart by the expansion faster than they expand or nucleate, leading to eternal inflation in the false vacuum."
        }
    ];

    // -------------------------------------------------------------------------
    // ANIMATION LOGIC (Massive, complex synchronized animation)
    // -------------------------------------------------------------------------
    function animate(time, speed = 1.0, meshes = []) {
        const delta = speed * 0.05;

        // 1. Wheel Rotation (driving forward)
        animationMeshes.wheels.forEach(wheel => {
            wheel.rotation.z -= delta;
        });

        // 2. Bubble Wobble (Vertex manipulation for hyper-realism)
        animationMeshes.bubbles.forEach(bData => {
            const pos = bData.mesh.geometry.attributes.position;
            const orig = bData.mesh.geometry.userData.originalPositions;
            for(let i = 0; i < pos.count; i++) {
                const o = orig[i];
                // Complex sine wave displacement based on spatial coordinates and time
                const offset = Math.sin(time * bData.speed + o.x * 0.1) * Math.cos(time * bData.speed * 0.8 + o.y * 0.15) * bData.amplitude;
                const noise = Math.sin(o.z * bData.complexity + time) * 0.5;
                pos.setXYZ(i, o.x + offset + noise, o.y + offset + noise, o.z + offset + noise);
            }
            pos.needsUpdate = true;
            bData.mesh.rotation.y += delta * 0.2;
            bData.mesh.rotation.x += delta * 0.1;
        });

        // 3. Siphon Needles (Precise In/Out movement)
        animationMeshes.needles.forEach(nAssembly => {
            const basePos = nAssembly.userData.basePos;
            const dir = nAssembly.userData.dir;
            // Oscillate linearly along the inward direction vector
            const extension = Math.sin(time * nAssembly.userData.speed + nAssembly.userData.phase) * 15; 
            nAssembly.position.set(
                basePos.x + dir.x * extension,
                basePos.y + dir.y * extension,
                basePos.z + dir.z * extension
            );
        });

        // 4. Reality Tearing Rings (Wild chaotic rotation)
        animationMeshes.rings.forEach(rData => {
            rData.mesh.rotation.x += rData.speedX * delta;
            rData.mesh.rotation.y += rData.speedY * delta;
            rData.mesh.rotation.z += rData.speedZ * delta;
            
            // Pulse the tearing lines material opacity
            if (rData.tearLines.material) {
                rData.tearLines.material.opacity = 0.5 + Math.sin(time * 5.0) * 0.5;
            }
        });

        // 5. Line pulsating (Coolant / Energy lines)
        animationMeshes.lines.forEach(lData => {
            const scalePulse = 1.0 + Math.sin(time * 8.0 + lData.phase) * 0.1;
            lData.mesh.scale.set(scalePulse, scalePulse, scalePulse);
        });

        // 6. Glowing cabin screens
        animationMeshes.glows.forEach(gData => {
            gData.mesh.material.emissiveIntensity = 1.0 + Math.sin(time * 10.0 + gData.phase) * 1.0;
        });

        // 7. Mechanical Rotors (Turbines / Radar)
        animationMeshes.rotors.forEach(rData => {
            if (rData.axis === 'x') rData.mesh.rotation.x += rData.speed * delta;
            if (rData.axis === 'y') rData.mesh.rotation.y += rData.speed * delta;
            if (rData.axis === 'z') rData.mesh.rotation.z += rData.speed * delta;
        });

        // 8. Plasma Vents (Flicker and scale)
        animationMeshes.vents.forEach(vData => {
            const flicker = 0.8 + Math.random() * 0.4;
            vData.mesh.scale.y = 1.0 + Math.sin(time * 20.0 + vData.phase) * 0.2 * flicker;
            vData.mesh.material.opacity = 0.6 + Math.sin(time * 15.0) * 0.3;
        });

        // 9. Anchor Spikes (Pneumatic hammering effect)
        animationMeshes.spikes.forEach(sData => {
            // Rapid violent shaking
            const shake = Math.sin(time * 50.0 + sData.phase) * 1.5;
            sData.mesh.position.y = -25 + shake;
        });
    }

    return {
        group,
        parts,
        description: "The God-Tier False Vacuum Harvester is an impossibly complex, mobile dreadnought designed to safely puncture the localized domain wall of our universe. By maintaining a highly unstable bubble of true vacuum within its massive toroidal containment vessel, it siphons infinite zero-point energy. It features microscopic precision siphon arrays, massive off-road tracks, reality-tearing suppression rings, and chaotic plasma vents. Operating this machine risks instantaneous universal phase transition annihilation.",
        quizQuestions,
        animate
    };
}
