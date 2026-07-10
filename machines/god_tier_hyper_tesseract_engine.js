import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // ============================================================================
    // CUSTOM GOD-TIER MATERIALS
    // ============================================================================
    const neonBlue = new THREE.MeshStandardMaterial({ 
        color: 0x00ffff, 
        emissive: 0x00ffff, 
        emissiveIntensity: 2.5, 
        transparent: true, 
        opacity: 0.9,
        wireframe: false 
    });
    
    const neonPurple = new THREE.MeshStandardMaterial({ 
        color: 0xaa00ff, 
        emissive: 0x6600aa, 
        emissiveIntensity: 2.0,
        wireframe: false 
    });
    
    const quantumCoreMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 3.0,
        metalness: 1.0,
        roughness: 0.0,
        transparent: true,
        opacity: 0.8,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const holographicMat = new THREE.MeshBasicMaterial({
        color: 0x00ffcc,
        transparent: true,
        opacity: 0.3,
        wireframe: true,
        side: THREE.DoubleSide
    });

    const exhaustGlow = new THREE.MeshStandardMaterial({
        color: 0xff5500,
        emissive: 0xff2200,
        emissiveIntensity: 4.0
    });

    // ============================================================================
    // 4D MATHEMATICS & TESSERACT LOGIC (PhD Level Spatial Processing)
    // ============================================================================
    class Vector4 {
        constructor(x, y, z, w) {
            this.x = x; this.y = y; this.z = z; this.w = w;
        }
    }

    const tesseractVertices4D = [];
    // Generate 16 vertices of a hypercube
    for (let i = 0; i < 16; i++) {
        const x = (i & 1) ? 1 : -1;
        const y = (i & 2) ? 1 : -1;
        const z = (i & 4) ? 1 : -1;
        const w = (i & 8) ? 1 : -1;
        tesseractVertices4D.push(new Vector4(x, y, z, w));
    }

    const tesseractEdges = [];
    // Find all edges (vertices differing by exactly one coordinate bit)
    for (let i = 0; i < 16; i++) {
        for (let j = i + 1; j < 16; j++) {
            let diffs = 0;
            if ((i & 1) !== (j & 1)) diffs++;
            if ((i & 2) !== (j & 2)) diffs++;
            if ((i & 4) !== (j & 4)) diffs++;
            if ((i & 8) !== (j & 8)) diffs++;
            if (diffs === 1) tesseractEdges.push([i, j]);
        }
    }

    // 4D Rotation Function
    function rotate4D(v, angleXW, angleYW, angleZW, angleXY, angleYZ, angleZX) {
        let x = v.x, y = v.y, z = v.z, w = v.w;
        let nx, ny, nz, nw;

        // XW plane rotation
        nx = x * Math.cos(angleXW) - w * Math.sin(angleXW);
        nw = x * Math.sin(angleXW) + w * Math.cos(angleXW);
        x = nx; w = nw;

        // YW plane rotation
        ny = y * Math.cos(angleYW) - w * Math.sin(angleYW);
        nw = y * Math.sin(angleYW) + w * Math.cos(angleYW);
        y = ny; w = nw;

        // ZW plane rotation
        nz = z * Math.cos(angleZW) - w * Math.sin(angleZW);
        nw = z * Math.sin(angleZW) + w * Math.cos(angleZW);
        z = nz; w = nw;

        // XY plane rotation
        nx = x * Math.cos(angleXY) - y * Math.sin(angleXY);
        ny = x * Math.sin(angleXY) + y * Math.cos(angleXY);
        x = nx; y = ny;

        // YZ plane rotation
        ny = y * Math.cos(angleYZ) - z * Math.sin(angleYZ);
        nz = y * Math.sin(angleYZ) + z * Math.cos(angleYZ);
        y = ny; z = nz;

        // ZX plane rotation
        nz = z * Math.cos(angleZX) - x * Math.sin(angleZX);
        nx = z * Math.sin(angleZX) + x * Math.cos(angleZX);
        z = nz; x = nx;

        return new Vector4(x, y, z, w);
    }

    // Stereographic projection from 4D to 3D
    function project4Dto3D(v4) {
        const distance = 3.0; // Distance of light source / viewpoint in 4D space
        const w = 1.0 / (distance - v4.w);
        return new THREE.Vector3(
            v4.x * w,
            v4.y * w,
            v4.z * w
        );
    }

    // ============================================================================
    // PROCEDURAL COMPONENT GENERATORS
    // ============================================================================
    const dynamicMeshes = {}; // Store references for the animate function

    // 1. COMPLEX TREADED TIRES
    function createTire(radius, width, segments, radialSegments) {
        const tireGroup = new THREE.Group();
        
        // Main Torus for the tire body
        const tireGeom = new THREE.TorusGeometry(radius, width / 2, radialSegments, segments);
        const tireMesh = new THREE.Mesh(tireGeom, rubber);
        tireGroup.add(tireMesh);

        // Intricate Extruded Lugs (Aggressive off-road treads)
        const lugGeom = new THREE.BoxGeometry(width * 1.2, width * 0.4, width * 0.4);
        const numLugs = 60;
        for (let i = 0; i < numLugs; i++) {
            const angle = (i / numLugs) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeom, rubber);
            
            // Positioning along the circumference of the torus
            lug.position.x = Math.cos(angle) * (radius + width / 2 * 0.8);
            lug.position.y = Math.sin(angle) * (radius + width / 2 * 0.8);
            
            // Rotation to face outward
            lug.rotation.z = angle;
            
            // Chevron pattern alternating
            lug.rotation.x = (i % 2 === 0) ? Math.PI / 8 : -Math.PI / 8;
            
            tireGroup.add(lug);
        }

        // Complex Rim & Spokes
        const rimGeom = new THREE.CylinderGeometry(radius * 0.7, radius * 0.7, width * 1.05, 32);
        const rimMesh = new THREE.Mesh(rimGeom, darkSteel);
        rimMesh.rotation.x = Math.PI / 2;
        tireGroup.add(rimMesh);

        const hubGeom = new THREE.CylinderGeometry(radius * 0.2, radius * 0.2, width * 1.2, 16);
        const hubMesh = new THREE.Mesh(hubGeom, chrome);
        hubMesh.rotation.x = Math.PI / 2;
        tireGroup.add(hubMesh);

        const numSpokes = 12;
        for (let i = 0; i < numSpokes; i++) {
            const angle = (i / numSpokes) * Math.PI * 2;
            
            // Complex Y-split spokes using grouped cylinders
            const spokeBase = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.05, radius * 0.08, radius * 0.4, 8), aluminum);
            spokeBase.position.x = Math.cos(angle) * (radius * 0.35);
            spokeBase.position.y = Math.sin(angle) * (radius * 0.35);
            spokeBase.rotation.z = angle + Math.PI / 2;
            tireGroup.add(spokeBase);

            const spokeFork1 = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.03, radius * 0.05, radius * 0.35, 8), chrome);
            spokeFork1.position.x = Math.cos(angle - 0.1) * (radius * 0.65);
            spokeFork1.position.y = Math.sin(angle - 0.1) * (radius * 0.65);
            spokeFork1.rotation.z = angle + Math.PI / 2 - 0.2;
            tireGroup.add(spokeFork1);

            const spokeFork2 = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.03, radius * 0.05, radius * 0.35, 8), chrome);
            spokeFork2.position.x = Math.cos(angle + 0.1) * (radius * 0.65);
            spokeFork2.position.y = Math.sin(angle + 0.1) * (radius * 0.65);
            spokeFork2.rotation.z = angle + Math.PI / 2 + 0.2;
            tireGroup.add(spokeFork2);
        }

        // Inner glowing brake disc
        const brakeGeom = new THREE.TorusGeometry(radius * 0.5, radius * 0.1, 8, 32);
        const brakeMesh = new THREE.Mesh(brakeGeom, exhaustGlow);
        tireGroup.add(brakeMesh);
        
        return tireGroup;
    }

    // 2. HYDRAULIC PISTONS (Nested Cylinders with dynamic articulation support)
    function createHydraulicStrut(length, radius) {
        const strut = new THREE.Group();
        
        // Outer housing
        const housing = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length * 0.6, 16), darkSteel);
        housing.position.y = length * 0.3;
        strut.add(housing);

        // Fluid lines wrapping the housing
        const lineCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(radius + 0.1, 0, 0),
            new THREE.Vector3(0, length * 0.2, radius + 0.1),
            new THREE.Vector3(-radius - 0.1, length * 0.4, 0),
            new THREE.Vector3(0, length * 0.6, -radius - 0.1)
        ]);
        const lineGeom = new THREE.TubeGeometry(lineCurve, 20, radius * 0.1, 8, false);
        const lineMesh = new THREE.Mesh(lineGeom, copper);
        strut.add(lineMesh);

        // Inner piston
        const piston = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.6, radius * 0.6, length * 0.6, 16), chrome);
        piston.position.y = length * 0.6; // Will be animated
        strut.add(piston);

        // Joint knuckles
        const bottomJoint = new THREE.Mesh(new THREE.SphereGeometry(radius * 1.2, 16, 16), steel);
        strut.add(bottomJoint);
        
        const topJoint = new THREE.Mesh(new THREE.SphereGeometry(radius * 0.9, 16, 16), steel);
        topJoint.position.y = length * 0.9;
        piston.add(topJoint);

        return { group: strut, piston: piston, length: length };
    }

    // 3. TESSERACT CORE (The glowing 4D hypercube projection)
    function createTesseractCore() {
        const coreGroup = new THREE.Group();
        const nodes = [];
        const edges = [];

        // Create 16 spheres for vertices
        const nodeGeom = new THREE.SphereGeometry(0.3, 32, 32);
        for (let i = 0; i < 16; i++) {
            const node = new THREE.Mesh(nodeGeom, quantumCoreMat);
            coreGroup.add(node);
            nodes.push(node);
            
            // Add a smaller inner glowing core to each node
            const innerGlow = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), neonBlue);
            node.add(innerGlow);
        }

        // Create 32 cylinders for edges
        const edgeGeom = new THREE.CylinderGeometry(0.05, 0.05, 1, 16);
        // Shift origin to bottom so we can easily stretch them using scale and lookAt
        edgeGeom.translate(0, 0.5, 0); 
        edgeGeom.rotateX(Math.PI / 2);

        for (let i = 0; i < 32; i++) {
            const edge = new THREE.Mesh(edgeGeom, holographicMat);
            coreGroup.add(edge);
            edges.push({ mesh: edge, indices: tesseractEdges[i] });
        }

        return { group: coreGroup, nodes: nodes, edges: edges };
    }

    // 4. CONTAINMENT GIMBALS (Intricate nested rotating rings)
    function createContainmentGimbals() {
        const gimbalGroup = new THREE.Group();
        const rings = [];

        const ringProfiles = [
            { radius: 6.0, tube: 0.4, color: steel, speed: 0.01, axis: new THREE.Vector3(1, 0, 0) },
            { radius: 5.2, tube: 0.3, color: darkSteel, speed: 0.015, axis: new THREE.Vector3(0, 1, 0) },
            { radius: 4.4, tube: 0.2, color: copper, speed: 0.02, axis: new THREE.Vector3(0, 0, 1) },
            { radius: 3.6, tube: 0.15, color: chrome, speed: 0.03, axis: new THREE.Vector3(1, 1, 0).normalize() }
        ];

        ringProfiles.forEach((profile, index) => {
            const ringHolder = new THREE.Group();
            
            // Base Torus
            const ringMesh = new THREE.Mesh(new THREE.TorusGeometry(profile.radius, profile.tube, 32, 100), profile.color);
            ringHolder.add(ringMesh);

            // Add mechanical teeth/gears along the ring
            const numTeeth = 36 + index * 12;
            const toothGeom = new THREE.BoxGeometry(profile.tube * 3, profile.tube * 1.5, profile.tube * 0.5);
            for(let i=0; i<numTeeth; i++) {
                const angle = (i / numTeeth) * Math.PI * 2;
                const tooth = new THREE.Mesh(toothGeom, steel);
                tooth.position.set(Math.cos(angle) * profile.radius, Math.sin(angle) * profile.radius, 0);
                tooth.rotation.z = angle;
                ringHolder.add(tooth);
            }

            // Add glowing emitters on the ring
            const numEmitters = 8;
            for(let i=0; i<numEmitters; i++) {
                const angle = (i / numEmitters) * Math.PI * 2;
                const emitter = new THREE.Mesh(new THREE.SphereGeometry(profile.tube * 1.2, 16, 16), neonPurple);
                emitter.position.set(Math.cos(angle) * profile.radius, Math.sin(angle) * profile.radius, 0);
                ringHolder.add(emitter);
            }

            gimbalGroup.add(ringHolder);
            rings.push({ group: ringHolder, axis: profile.axis, speed: profile.speed });
        });

        return { group: gimbalGroup, rings: rings };
    }

    // 5. OPERATOR CABIN (Highly detailed control station)
    function createOperatorCabin() {
        const cabin = new THREE.Group();

        // Main pod body (LatheGeometry for sleek sci-fi look)
        const points = [];
        for ( let i = 0; i <= 10; i ++ ) {
            points.push( new THREE.Vector2( Math.sin( i * 0.2 ) * 3 + 1, ( i - 5 ) * 0.8 ) );
        }
        const podGeom = new THREE.LatheGeometry( points, 32 );
        const pod = new THREE.Mesh( podGeom, darkSteel );
        pod.rotation.x = Math.PI / 2;
        cabin.add(pod);

        // Tinted Glass Canopy
        const canopyGeom = new THREE.SphereGeometry(2.5, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2.5);
        const canopy = new THREE.Mesh(canopyGeom, tinted);
        canopy.position.y = 1.0;
        cabin.add(canopy);

        // Interior Console
        const consoleGeom = new THREE.BoxGeometry(3, 1, 1);
        const consoleMesh = new THREE.Mesh(consoleGeom, plastic);
        consoleMesh.position.set(0, 0.5, 1.5);
        consoleMesh.rotation.x = -Math.PI / 6;
        cabin.add(consoleMesh);

        // Holographic Screens
        const screenGeom = new THREE.PlaneGeometry(1.5, 1);
        for(let i=0; i<3; i++) {
            const screen = new THREE.Mesh(screenGeom, new THREE.MeshBasicMaterial({ color: 0x00ffcc, transparent: true, opacity: 0.6, side: THREE.DoubleSide }));
            screen.position.set((i-1)*1.6, 1.5, 1.2);
            screen.rotation.x = -Math.PI / 8;
            screen.rotation.y = (i-1) * -Math.PI / 6;
            cabin.add(screen);
        }

        // Joysticks
        const stickGeom = new THREE.CylinderGeometry(0.05, 0.05, 0.5);
        const stick1 = new THREE.Mesh(stickGeom, chrome);
        stick1.position.set(-1, 1, 1.3);
        stick1.rotation.x = Math.PI / 4;
        cabin.add(stick1);

        const stick2 = new THREE.Mesh(stickGeom, chrome);
        stick2.position.set(1, 1, 1.3);
        stick2.rotation.x = Math.PI / 4;
        cabin.add(stick2);

        // Command Seat
        const seatGeom = new THREE.BoxGeometry(1, 0.2, 1);
        const seat = new THREE.Mesh(seatGeom, rubber);
        seat.position.set(0, 0.2, 0);
        cabin.add(seat);

        const backrestGeom = new THREE.BoxGeometry(1, 1.5, 0.2);
        const backrest = new THREE.Mesh(backrestGeom, rubber);
        backrest.position.set(0, 0.95, -0.4);
        cabin.add(backrest);

        return cabin;
    }

    // 6. MASSIVE CHASSIS AND PIPING
    function createChassis() {
        const chassis = new THREE.Group();

        // Main Base Plate
        const baseGeom = new THREE.BoxGeometry(20, 2, 26);
        const base = new THREE.Mesh(baseGeom, darkSteel);
        chassis.add(base);

        // Cooling Vents (Extrude geometry)
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.lineTo(1, 0);
        shape.lineTo(0.5, 2);
        shape.lineTo(-0.5, 2);
        shape.lineTo(0, 0);

        const extrudeSettings = { depth: 24, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 };
        const ventGeom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        
        const leftVent = new THREE.Mesh(ventGeom, steel);
        leftVent.position.set(-9, 1, -12);
        chassis.add(leftVent);

        const rightVent = new THREE.Mesh(ventGeom, steel);
        rightVent.position.set(9, 1, -12);
        chassis.add(rightVent);

        // Hexagonal Plasma Conduits
        const hexCurve1 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-8, 3, 10),
            new THREE.Vector3(-12, 6, 0),
            new THREE.Vector3(-8, 8, -10),
            new THREE.Vector3(0, 10, -12)
        ]);
        const conduitGeom1 = new THREE.TubeGeometry(hexCurve1, 64, 0.8, 6, false);
        const conduit1 = new THREE.Mesh(conduitGeom1, copper);
        chassis.add(conduit1);

        const hexCurve2 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(8, 3, 10),
            new THREE.Vector3(12, 6, 0),
            new THREE.Vector3(8, 8, -10),
            new THREE.Vector3(0, 10, -12)
        ]);
        const conduitGeom2 = new THREE.TubeGeometry(hexCurve2, 64, 0.8, 6, false);
        const conduit2 = new THREE.Mesh(conduitGeom2, copper);
        chassis.add(conduit2);

        // Exhaust Stacks
        const stackGeom = new THREE.CylinderGeometry(1.5, 1.5, 8, 16);
        const stack1 = new THREE.Mesh(stackGeom, chrome);
        stack1.position.set(-6, 6, -10);
        chassis.add(stack1);

        const stackGlow1 = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 8.1, 16), exhaustGlow);
        stackGlow1.position.set(-6, 6, -10);
        chassis.add(stackGlow1);

        const stack2 = new THREE.Mesh(stackGeom, chrome);
        stack2.position.set(6, 6, -10);
        chassis.add(stack2);

        const stackGlow2 = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 8.1, 16), exhaustGlow);
        stackGlow2.position.set(6, 6, -10);
        chassis.add(stackGlow2);

        // Rivets around the base
        const rivetGeom = new THREE.SphereGeometry(0.2, 8, 8);
        for(let i=0; i<40; i++) {
            const x = -9.5 + (i%20)*1.0;
            const z = (i < 20) ? 12.8 : -12.8;
            const rivet = new THREE.Mesh(rivetGeom, steel);
            rivet.position.set(x, 1, z);
            chassis.add(rivet);
        }

        return chassis;
    }


    // ============================================================================
    // MACHINE ASSEMBLY
    // ============================================================================

    // Build the Chassis
    const chassisGroup = createChassis();
    chassisGroup.position.set(0, 0, 0);
    group.add(chassisGroup);

    // Build the Wheels
    dynamicMeshes.wheels = [];
    const wheelPositions = [
        new THREE.Vector3(-12, 0, 10),
        new THREE.Vector3(12, 0, 10),
        new THREE.Vector3(-12, 0, -10),
        new THREE.Vector3(12, 0, -10)
    ];
    
    wheelPositions.forEach((pos, index) => {
        const wheel = createTire(4, 3, 64, 64);
        wheel.position.copy(pos);
        if (index % 2 !== 0) wheel.rotation.y = Math.PI; // Flip right side wheels
        group.add(wheel);
        dynamicMeshes.wheels.push(wheel);
    });

    // Build Hydraulic Suspensions
    dynamicMeshes.pistons = [];
    wheelPositions.forEach((pos) => {
        const strutData = createHydraulicStrut(6, 0.8);
        strutData.group.position.set(pos.x > 0 ? pos.x - 2 : pos.x + 2, pos.y + 1, pos.z);
        strutData.group.rotation.z = pos.x > 0 ? Math.PI / 6 : -Math.PI / 6;
        group.add(strutData.group);
        dynamicMeshes.pistons.push(strutData.piston);
    });

    // Build Containment Gimbals
    const gimbalData = createContainmentGimbals();
    gimbalData.group.position.set(0, 15, 0);
    group.add(gimbalData.group);
    dynamicMeshes.gimbalRings = gimbalData.rings;

    // Build Tesseract Core
    const tesseractData = createTesseractCore();
    // It sits inside the gimbals
    gimbalData.group.add(tesseractData.group);
    dynamicMeshes.tesseractNodes = tesseractData.nodes;
    dynamicMeshes.tesseractEdges = tesseractData.edges;

    // Build Operator Cabin
    const cabinGroup = createOperatorCabin();
    cabinGroup.position.set(0, 8, 14);
    group.add(cabinGroup);

    // Build Particle Field (Quantum noise)
    const particleGeom = new THREE.BufferGeometry();
    const particleCount = 2000;
    const posArray = new Float32Array(particleCount * 3);
    for(let i=0; i<particleCount*3; i++) {
        posArray[i] = (Math.random() - 0.5) * 40;
    }
    particleGeom.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
        size: 0.15,
        color: 0x00ffff,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    const particleSystem = new THREE.Points(particleGeom, particleMat);
    particleSystem.position.set(0, 15, 0);
    group.add(particleSystem);
    dynamicMeshes.particles = particleSystem;


    // ============================================================================
    // PARTS MANIFEST (Hyper-detailed metadata for Engineering Simulator)
    // ============================================================================
    parts.push({
        name: "Omni-Directional Tesseract Core",
        description: "The primary 4D projection matrix. Folds space-time to generate infinite torque without breaking causality.",
        material: "Quantum Core Substrate",
        function: "Space-Time Folding",
        assemblyOrder: 1,
        connections: ["Alpha Gimbal", "Beta Gimbal", "Gamma Gimbal"],
        failureEffect: "Spontaneous dimensional collapse; vehicle paradoxically ceases to have ever existed.",
        cascadeFailures: ["Chronal integrity loss", "Complete existence failure"],
        originalPosition: { x: 0, y: 15, z: 0 },
        explodedPosition: { x: 0, y: 35, z: 0 }
    });

    parts.push({
        name: "Alpha Containment Gimbal",
        description: "Outer stabilizing ring. Prevents the 4D manifold from intersecting with local 3D spacetime inappropriately.",
        material: "Reinforced Steel",
        function: "Dimensional Stabilization",
        assemblyOrder: 2,
        connections: ["Omni-Directional Tesseract Core", "Beta Gimbal"],
        failureEffect: "Core leak resulting in severe gravity fluctuations.",
        cascadeFailures: ["Beta Gimbal overload"],
        originalPosition: { x: 0, y: 15, z: 0 },
        explodedPosition: { x: -15, y: 30, z: 0 }
    });

    parts.push({
        name: "Beta Containment Gimbal",
        description: "Secondary axis ring ensuring rotational degrees of freedom into the W-axis are properly mapped to XYZ.",
        material: "Darkened Carbon Steel",
        function: "W-Axis Mapping",
        assemblyOrder: 3,
        connections: ["Alpha Gimbal", "Gamma Gimbal"],
        failureEffect: "Objects nearby undergo spontaneous mirroring.",
        cascadeFailures: ["Gamma Gimbal misalignment"],
        originalPosition: { x: 0, y: 15, z: 0 },
        explodedPosition: { x: 15, y: 30, z: 0 }
    });

    parts.push({
        name: "Gamma Containment Gimbal",
        description: "Tertiary ring. Synchronizes the temporal drift of the folded space with local universal time.",
        material: "Supercooled Copper",
        function: "Temporal Syncing",
        assemblyOrder: 4,
        connections: ["Beta Gimbal", "Delta Gimbal"],
        failureEffect: "Local time dilation; engine appears frozen to outside observers.",
        cascadeFailures: ["Delta Gimbal shatter"],
        originalPosition: { x: 0, y: 15, z: 0 },
        explodedPosition: { x: 0, y: 30, z: -15 }
    });

    parts.push({
        name: "Delta Containment Gimbal",
        description: "Innermost ring, directly interfacing with the hypercube's vertices. Woven with superconducting chrome.",
        material: "Chromium Isotope",
        function: "Direct Core Interfacing",
        assemblyOrder: 5,
        connections: ["Gamma Gimbal", "Omni-Directional Tesseract Core"],
        failureEffect: "Instantaneous violent unfolding of the tesseract, obliterating the solar system.",
        cascadeFailures: ["Core Detonation"],
        originalPosition: { x: 0, y: 15, z: 0 },
        explodedPosition: { x: 0, y: 30, z: 15 }
    });

    parts.push({
        name: "Massive Terrain-Rending Tread (Front-Left)",
        description: "A gigantic, ultra-aggressive off-road wheel capable of gripping non-Euclidean surfaces.",
        material: "Hyper-vulcanized Rubber and Chrome",
        function: "Locomotion",
        assemblyOrder: 6,
        connections: ["Hydraulic Strut FL", "Chassis Base"],
        failureEffect: "Loss of traction; potential slippage into the 4th dimension.",
        cascadeFailures: ["Axle snap"],
        originalPosition: { x: -12, y: 0, z: 10 },
        explodedPosition: { x: -25, y: 0, z: 20 }
    });

    parts.push({
        name: "Massive Terrain-Rending Tread (Front-Right)",
        description: "A gigantic, ultra-aggressive off-road wheel capable of gripping non-Euclidean surfaces.",
        material: "Hyper-vulcanized Rubber and Chrome",
        function: "Locomotion",
        assemblyOrder: 7,
        connections: ["Hydraulic Strut FR", "Chassis Base"],
        failureEffect: "Loss of traction; potential slippage into the 4th dimension.",
        cascadeFailures: ["Axle snap"],
        originalPosition: { x: 12, y: 0, z: 10 },
        explodedPosition: { x: 25, y: 0, z: 20 }
    });

    parts.push({
        name: "Massive Terrain-Rending Tread (Rear-Left)",
        description: "A gigantic, ultra-aggressive off-road wheel capable of gripping non-Euclidean surfaces.",
        material: "Hyper-vulcanized Rubber and Chrome",
        function: "Locomotion",
        assemblyOrder: 8,
        connections: ["Hydraulic Strut RL", "Chassis Base"],
        failureEffect: "Drifting out of the space-time continuum.",
        cascadeFailures: ["Transmission collapse"],
        originalPosition: { x: -12, y: 0, z: -10 },
        explodedPosition: { x: -25, y: 0, z: -20 }
    });

    parts.push({
        name: "Massive Terrain-Rending Tread (Rear-Right)",
        description: "A gigantic, ultra-aggressive off-road wheel capable of gripping non-Euclidean surfaces.",
        material: "Hyper-vulcanized Rubber and Chrome",
        function: "Locomotion",
        assemblyOrder: 9,
        connections: ["Hydraulic Strut RR", "Chassis Base"],
        failureEffect: "Drifting out of the space-time continuum.",
        cascadeFailures: ["Transmission collapse"],
        originalPosition: { x: 12, y: 0, z: -10 },
        explodedPosition: { x: 25, y: 0, z: -20 }
    });

    parts.push({
        name: "Hydraulic Suspension Matrix",
        description: "Multi-ton piston array that absorbs the shocks of reality-warping terrain.",
        material: "Dark Steel and Chrome",
        function: "Shock Absorption & Articulation",
        assemblyOrder: 10,
        connections: ["Treads", "Chassis Base"],
        failureEffect: "Cabin experiences 500G of force.",
        cascadeFailures: ["Cabin structural failure"],
        originalPosition: { x: -10, y: 1, z: 10 },
        explodedPosition: { x: -20, y: 5, z: 15 }
    });

    parts.push({
        name: "Hexagonal Plasma Conduits",
        description: "Channels raw 4D energy from the core into the locomotive transmission.",
        material: "Superconducting Copper",
        function: "Energy Transfer",
        assemblyOrder: 11,
        connections: ["Alpha Gimbal", "Chassis Base"],
        failureEffect: "Plasma leakage melting the hull.",
        cascadeFailures: ["Chassis vaporization"],
        originalPosition: { x: 0, y: 5, z: 0 },
        explodedPosition: { x: 0, y: -10, z: 0 }
    });

    parts.push({
        name: "Operator Command Cabin",
        description: "Highly shielded pod where the engineer monitors the dimensional folding parameters.",
        material: "Dark Steel and Tinted Glass",
        function: "Navigation and Control",
        assemblyOrder: 12,
        connections: ["Chassis Base"],
        failureEffect: "Operator is exposed to raw unshielded 4D radiation.",
        cascadeFailures: ["Loss of control", "Operator spontaneous evolution into energy being"],
        originalPosition: { x: 0, y: 8, z: 14 },
        explodedPosition: { x: 0, y: 15, z: 30 }
    });

    parts.push({
        name: "Holographic Nav-Screens",
        description: "Displays multi-dimensional telemetry arrays for the operator.",
        material: "Hard Light",
        function: "UI Display",
        assemblyOrder: 13,
        connections: ["Operator Command Cabin"],
        failureEffect: "Blind navigation.",
        cascadeFailures: ["Collision with a higher dimension"],
        originalPosition: { x: 0, y: 9.5, z: 15.2 },
        explodedPosition: { x: 0, y: 12, z: 35 }
    });

    parts.push({
        name: "Chromium Exhaust Stacks",
        description: "Vents excess Hawking radiation generated by the miniature singularities in the engine.",
        material: "Chrome and Glowing Plasma",
        function: "Thermal Management",
        assemblyOrder: 14,
        connections: ["Chassis Base"],
        failureEffect: "Overheating leading to a localized black hole.",
        cascadeFailures: ["Event horizon expansion"],
        originalPosition: { x: -6, y: 6, z: -10 },
        explodedPosition: { x: -15, y: 20, z: -25 }
    });

    parts.push({
        name: "Extruded Heat Sinks",
        description: "Hundreds of steel fins designed to dissipate thermal loads in vacuum and atmosphere alike.",
        material: "Steel",
        function: "Passive Cooling",
        assemblyOrder: 15,
        connections: ["Chassis Base"],
        failureEffect: "Efficiency drop in power transfer.",
        cascadeFailures: ["Plasma Conduit melting"],
        originalPosition: { x: -9, y: 1, z: -12 },
        explodedPosition: { x: -20, y: 1, z: -30 }
    });

    parts.push({
        name: "Main Chassis Hull",
        description: "The indestructible foundational plate that holds the God Tier Engine together.",
        material: "Dark Steel",
        function: "Structural Integrity",
        assemblyOrder: 16,
        connections: ["All subsystems"],
        failureEffect: "Machine disintegrates into its constituent atoms.",
        cascadeFailures: ["Total system failure"],
        originalPosition: { x: 0, y: 1, z: 0 },
        explodedPosition: { x: 0, y: -20, z: 0 }
    });


    // ============================================================================
    // PHD LEVEL TOPOLOGY & 4D MATH QUIZ QUESTIONS
    // ============================================================================
    const quizQuestions = [
        {
            question: "Consider the Omni-Directional Tesseract Core. What is the Euler characteristic (V - E + F - C) of a standard 4D hypercube?",
            options: [
                "2",
                "0",
                "1",
                "-2"
            ],
            correctAnswer: 1,
            explanation: "In a tesseract, Vertices (V) = 16, Edges (E) = 32, Faces (F) = 24, and Cells (C) = 8. The generalized Euler characteristic for a 4-dimensional convex polytope is V - E + F - C = 0. Therefore, 16 - 32 + 24 - 8 = 0."
        },
        {
            question: "The Containment Gimbals undergo complex rotations. What is the order of the rotation group (hyperoctahedral group) of the 4D hypercube?",
            options: [
                "24",
                "384",
                "192",
                "1152"
            ],
            correctAnswer: 1,
            explanation: "The symmetry group of an n-cube is the hyperoctahedral group of degree n, with order 2^n * n!. For a 4-cube, this is 2^4 * 4! = 16 * 24 = 384."
        },
        {
            question: "If the Tesseract Core's containment fails and intersects with a 3-dimensional hyperplane in our spacetime, what is the maximum possible number of vertices in the resulting 3D cross-section?",
            options: [
                "6",
                "8",
                "12",
                "14"
            ],
            correctAnswer: 2,
            explanation: "The intersection of a 4-dimensional hypercube with a 3-dimensional hyperplane can form various polyhedra. The cross-section with the maximum number of vertices is a rhombicuboctahedron-like or truncated octahedral shape, but specifically, the maximum number of vertices for a hyperplane slice of a tesseract is 12 (forming a cuboctahedron or similar 12-vertex shapes depending on the exact angle)."
        },
        {
            question: "To stabilize the Beta Gimbal, you must calculate the number of m-dimensional faces in an n-cube. What is the formula for the number of m-faces in an n-dimensional hypercube?",
            options: [
                "2^(n-m) * n! / (m! * (n-m)!)",
                "2^m * n! / (m! * (n-m)!)",
                "n^m / m!",
                "2^n * m!"
            ],
            correctAnswer: 0,
            explanation: "The number of m-dimensional faces in an n-cube is given by 2^(n-m) * (n choose m), which expands to 2^(n-m) * n! / (m! * (n-m)!)."
        },
        {
            question: "When projecting the 4D Tesseract Core into the 3D operator screen via a vertex-first perspective, what 3D shape forms the outer boundary (envelope) of the projection?",
            options: [
                "Cuboctahedron",
                "Rhombic Dodecahedron",
                "Truncated Octahedron",
                "Icosahedron"
            ],
            correctAnswer: 1,
            explanation: "When a tesseract is projected into 3D space vertex-first (along the long diagonal), its outer boundary forms a Rhombic Dodecahedron, consisting of 12 rhombic faces."
        }
    ];

    // ============================================================================
    // GOD-TIER ANIMATION LOOP (Extreme complexity & synchronization)
    // ============================================================================
    let time4D = 0;
    
    const animate = (time, speed, meshes) => {
        const delta = speed * 0.01;
        time4D += delta * 0.5;

        // 1. Rotate the Wheels (Terrain locomotion)
        if (dynamicMeshes.wheels) {
            dynamicMeshes.wheels.forEach(wheel => {
                // Wheels roll around the X-axis locally (they are rotated in assembly)
                wheel.rotation.z -= delta * 2.0; 
            });
        }

        // 2. Animate Hydraulic Pistons (Sine wave pumping)
        if (dynamicMeshes.pistons) {
            dynamicMeshes.pistons.forEach((piston, index) => {
                const offset = index * Math.PI / 2;
                // Move piston up and down
                piston.position.y = 3.6 + Math.sin(time * speed * 2 + offset) * 1.5;
            });
        }

        // 3. Rotate Containment Gimbals (Complex nested axes)
        if (dynamicMeshes.gimbalRings) {
            dynamicMeshes.gimbalRings.forEach((ringData, index) => {
                ringData.group.rotateOnAxis(ringData.axis, ringData.speed * speed * 2);
            });
        }

        // 4. Animate 4D Tesseract Core
        // Angles for 6 rotation planes in 4D
        const angleXW = time4D * 1.1;
        const angleYW = time4D * 0.7;
        const angleZW = time4D * 1.3;
        const angleXY = time4D * 0.5;
        const angleYZ = time4D * 0.9;
        const angleZX = time4D * 0.3;

        // Calculate new 3D positions for all 16 vertices
        const projectedVertices3D = [];
        for (let i = 0; i < 16; i++) {
            const v4 = tesseractVertices4D[i];
            const rotated4D = rotate4D(v4, angleXW, angleYW, angleZW, angleXY, angleYZ, angleZX);
            const projected3D = project4Dto3D(rotated4D);
            projectedVertices3D.push(projected3D);

            // Update sphere meshes (scale by 3 to make it larger inside the gimbals)
            if (dynamicMeshes.tesseractNodes && dynamicMeshes.tesseractNodes[i]) {
                const nodeMesh = dynamicMeshes.tesseractNodes[i];
                nodeMesh.position.copy(projected3D).multiplyScalar(3.0);
                
                // Pulse the emissive glow based on the W coordinate
                const wIntensity = (rotated4D.w + 1.5) / 3.0; // Normalized roughly 0 to 1
                nodeMesh.children[0].material.emissiveIntensity = wIntensity * 5.0;
                nodeMesh.scale.setScalar(0.5 + wIntensity * 0.8);
            }
        }

        // Update 32 edge cylinders
        if (dynamicMeshes.tesseractEdges) {
            for (let i = 0; i < 32; i++) {
                const edgeData = dynamicMeshes.tesseractEdges[i];
                const p1 = projectedVertices3D[edgeData.indices[0]].clone().multiplyScalar(3.0);
                const p2 = projectedVertices3D[edgeData.indices[1]].clone().multiplyScalar(3.0);

                const mesh = edgeData.mesh;
                
                // Position at p1
                mesh.position.copy(p1);
                
                // Look at p2
                mesh.lookAt(p2);
                
                // Scale length to distance between p1 and p2
                const dist = p1.distanceTo(p2);
                mesh.scale.set(1, dist, 1); // Y is length because we rotated the geometry initially
                
                // Rotate 90 degrees on X because of the lookAt vs Cylinder geometry default alignment
                mesh.rotateX(Math.PI / 2);
            }
        }

        // 5. Animate Particle Field (Swirling quantum noise)
        if (dynamicMeshes.particles) {
            dynamicMeshes.particles.rotation.y += delta * 0.2;
            dynamicMeshes.particles.rotation.z += delta * 0.1;
            
            const positions = dynamicMeshes.particles.geometry.attributes.position.array;
            for(let i=0; i<positions.length; i+=3) {
                // Subtle swirling noise
                positions[i] += Math.sin(time + positions[i+1]) * 0.05 * speed;
                positions[i+1] += Math.cos(time + positions[i+2]) * 0.05 * speed;
                positions[i+2] += Math.sin(time + positions[i]) * 0.05 * speed;
                
                // Boundary check to keep them contained
                if (positions[i] > 20) positions[i] = -20;
                if (positions[i] < -20) positions[i] = 20;
                if (positions[i+1] > 20) positions[i+1] = -20;
                if (positions[i+1] < -20) positions[i+1] = 20;
                if (positions[i+2] > 20) positions[i+2] = -20;
                if (positions[i+2] < -20) positions[i+2] = 20;
            }
            dynamicMeshes.particles.geometry.attributes.position.needsUpdate = true;
        }

        // 6. Pulse Chassis Lights
        exhaustGlow.emissiveIntensity = 3.0 + Math.sin(time * speed * 10) * 2.0;
    };

    return { 
        group, 
        parts, 
        description: "God-Tier Hyper Tesseract Engine. A massive, complex piece of machinery integrating aggressive off-road treads, massive hydraulic articulation, and a functioning 4D hypercube core generating infinite dimensional torque.",
        quizQuestions, 
        animate 
    };
}
