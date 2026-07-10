import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const updatables = [];

    // --- CUSTOM GOD-TIER MATERIALS ---
    const exoticMatterMat = new THREE.MeshPhysicalMaterial({
        color: 0x110022,
        emissive: 0x3300ff,
        emissiveIntensity: 0.8,
        metalness: 1.0,
        roughness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        transparent: true,
        opacity: 0.9,
        wireframe: false
    });

    const cherenkovGlowMat = new THREE.MeshStandardMaterial({
        color: 0x00aaff,
        emissive: 0x0055ff,
        emissiveIntensity: 3.5,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending
    });

    const tachyonBeamMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xccffff,
        emissiveIntensity: 8.0,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const chronosyncMetal = new THREE.MeshStandardMaterial({
        color: 0x333344,
        metalness: 0.9,
        roughness: 0.2,
        emissive: 0x001133,
        emissiveIntensity: 0.2
    });

    const neonBlueScreenMat = new THREE.MeshStandardMaterial({
        color: 0x000000,
        emissive: 0x00aaff,
        emissiveIntensity: 1.5
    });

    const neonRedScreenMat = new THREE.MeshStandardMaterial({
        color: 0x000000,
        emissive: 0xff2200,
        emissiveIntensity: 1.5
    });

    // --- PROCEDURAL GEOMETRY GENERATORS ---

    // Generates a complex truss cylinder (like a radio tower mast)
    function createTrussMast(radius, height, segments, verticalSegments) {
        const mastGroup = new THREE.Group();
        const strutGeo = new THREE.CylinderGeometry(radius * 0.05, radius * 0.05, height, 8);
        const diagGeo = new THREE.CylinderGeometry(radius * 0.04, radius * 0.04, Math.sqrt(Math.pow(height/verticalSegments, 2) + Math.pow(radius*2, 2)), 8);
        const ringGeo = new THREE.TorusGeometry(radius, radius * 0.06, 8, segments);

        // Vertical struts
        for (let i = 0; i < segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            const strut = new THREE.Mesh(strutGeo, steel);
            strut.position.set(Math.cos(angle) * radius, height / 2, Math.sin(angle) * radius);
            mastGroup.add(strut);
        }

        // Horizontal rings and diagonals
        const sectionHeight = height / verticalSegments;
        for (let j = 0; j <= verticalSegments; j++) {
            const h = j * sectionHeight;
            const ring = new THREE.Mesh(ringGeo, steel);
            ring.rotation.x = Math.PI / 2;
            ring.position.y = h;
            mastGroup.add(ring);

            if (j < verticalSegments) {
                for (let i = 0; i < segments; i++) {
                    const angle1 = (i / segments) * Math.PI * 2;
                    const angle2 = ((i + 1) / segments) * Math.PI * 2;
                    
                    const p1 = new THREE.Vector3(Math.cos(angle1) * radius, h, Math.sin(angle1) * radius);
                    const p2 = new THREE.Vector3(Math.cos(angle2) * radius, h + sectionHeight, Math.sin(angle2) * radius);
                    
                    const diagDistance = p1.distanceTo(p2);
                    const customDiagGeo = new THREE.CylinderGeometry(radius * 0.03, radius * 0.03, diagDistance, 8);
                    
                    const diag = new THREE.Mesh(customDiagGeo, aluminum);
                    const midPoint = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
                    diag.position.copy(midPoint);
                    diag.lookAt(p2);
                    diag.rotateX(Math.PI / 2);
                    mastGroup.add(diag);
                }
            }
        }
        return mastGroup;
    }

    // Generates a massive complex parabolic dish with panels
    function createComplexDish(radius, depth, radialSegments, tubularSegments) {
        const dishGroup = new THREE.Group();
        
        // Base solid dish using LatheGeometry
        const points = [];
        for (let i = 0; i <= 20; i++) {
            const t = i / 20;
            const x = t * radius;
            const y = (x * x) / (4 * depth); // Parabola equation: y = x^2 / 4a
            points.push(new THREE.Vector2(x, y));
        }
        
        const latheGeo = new THREE.LatheGeometry(points, radialSegments);
        // We use exotic matter for the dish itself
        const dishMesh = new THREE.Mesh(latheGeo, exoticMatterMat);
        // Make it double sided
        dishMesh.material.side = THREE.DoubleSide;
        dishGroup.add(dishMesh);

        // Add panel lines/ribs
        for (let i = 0; i < radialSegments; i++) {
            const angle = (i / radialSegments) * Math.PI * 2;
            const ribGeo = new THREE.TubeGeometry(
                new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(p.x * Math.cos(angle), p.y, p.x * Math.sin(angle)))),
                20, radius * 0.015, 8, false
            );
            const rib = new THREE.Mesh(ribGeo, darkSteel);
            dishGroup.add(rib);
        }

        // Circular concentric ribs
        for (let i = 1; i <= 5; i++) {
            const t = i / 5;
            const x = t * radius;
            const y = (x * x) / (4 * depth);
            const ringGeo = new THREE.TorusGeometry(x, radius * 0.015, 8, radialSegments);
            const ring = new THREE.Mesh(ringGeo, darkSteel);
            ring.rotation.x = Math.PI / 2;
            ring.position.y = y;
            dishGroup.add(ring);
        }

        // Back support structure (Truss cone)
        for (let i = 0; i < radialSegments; i+=2) {
            const angle = (i / radialSegments) * Math.PI * 2;
            const outerX = radius * Math.cos(angle);
            const outerZ = radius * Math.sin(angle);
            const outerY = (radius * radius) / (4 * depth);
            
            const supportPath = new THREE.LineCurve3(
                new THREE.Vector3(outerX, outerY, outerZ),
                new THREE.Vector3(0, -depth * 0.5, 0)
            );
            const supportGeo = new THREE.TubeGeometry(supportPath, 1, radius * 0.02, 8, false);
            const support = new THREE.Mesh(supportGeo, steel);
            dishGroup.add(support);
        }

        // Focal Point Receiver Struts
        const focalY = depth; // Focus of parabola is at a=depth
        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2;
            const startX = (radius * 0.5) * Math.cos(angle);
            const startZ = (radius * 0.5) * Math.sin(angle);
            const startY = (Math.pow(radius*0.5, 2)) / (4 * depth);
            
            const strutPath = new THREE.LineCurve3(
                new THREE.Vector3(startX, startY, startZ),
                new THREE.Vector3(0, focalY, 0)
            );
            const strut = new THREE.Mesh(new THREE.TubeGeometry(strutPath, 1, radius * 0.02, 8, false), chrome);
            dishGroup.add(strut);
        }

        // Focal Receiver Assembly
        const focalReceiverGroup = new THREE.Group();
        focalReceiverGroup.position.y = focalY;
        
        const focalCore = new THREE.Mesh(new THREE.SphereGeometry(radius * 0.08, 32, 32), cherenkovGlowMat);
        focalReceiverGroup.add(focalCore);
        
        const focalRing1 = new THREE.Mesh(new THREE.TorusGeometry(radius * 0.15, radius * 0.01, 16, 32), darkSteel);
        focalRing1.rotation.x = Math.PI / 2;
        focalReceiverGroup.add(focalRing1);
        
        const focalRing2 = new THREE.Mesh(new THREE.TorusGeometry(radius * 0.2, radius * 0.01, 16, 32), chrome);
        focalRing2.rotation.y = Math.PI / 2;
        focalReceiverGroup.add(focalRing2);

        updatables.push((time, speed) => {
            focalRing1.rotation.x = time * speed * 5;
            focalRing1.rotation.y = time * speed * 3;
            focalRing2.rotation.z = -time * speed * 4;
            focalRing2.rotation.x = time * speed * 2;
            focalCore.scale.setScalar(1 + Math.sin(time * speed * 10) * 0.1);
        });

        dishGroup.add(focalReceiverGroup);

        return dishGroup;
    }

    // Generates complex hydraulic piston
    function createHydraulicPiston(length, radius) {
        const pistonGroup = new THREE.Group();
        
        const cylinderGeo = new THREE.CylinderGeometry(radius, radius, length * 0.6, 16);
        const cylinder = new THREE.Mesh(cylinderGeo, darkSteel);
        cylinder.position.y = length * 0.3;
        pistonGroup.add(cylinder);

        const rodGeo = new THREE.CylinderGeometry(radius * 0.6, radius * 0.6, length * 0.6, 16);
        const rod = new THREE.Mesh(rodGeo, chrome);
        rod.position.y = length * 0.7;
        pistonGroup.add(rod);

        const jointGeo = new THREE.SphereGeometry(radius * 1.5, 16, 16);
        const joint1 = new THREE.Mesh(jointGeo, steel);
        joint1.position.y = 0;
        pistonGroup.add(joint1);

        const joint2 = new THREE.Mesh(jointGeo, steel);
        joint2.position.y = length;
        pistonGroup.add(joint2);

        return pistonGroup;
    }

    // --- ASSEMBLING THE ARRAY ---

    // 1. FOUNDATION MATRIX
    const foundationGroup = new THREE.Group();
    const baseGeo = new THREE.CylinderGeometry(150, 160, 20, 12);
    const base = new THREE.Mesh(baseGeo, darkSteel);
    base.position.y = 10;
    foundationGroup.add(base);

    // Add immense piping around base
    for(let i=0; i<24; i++) {
        const angle = (i / 24) * Math.PI * 2;
        const pipePath = new THREE.CurvePath();
        const start = new THREE.Vector3(Math.cos(angle)*155, 0, Math.sin(angle)*155);
        const mid1 = new THREE.Vector3(Math.cos(angle)*170, 5, Math.sin(angle)*170);
        const mid2 = new THREE.Vector3(Math.cos(angle)*170, 15, Math.sin(angle)*170);
        const end = new THREE.Vector3(Math.cos(angle)*145, 20, Math.sin(angle)*145);
        
        pipePath.add(new THREE.LineCurve3(start, mid1));
        pipePath.add(new THREE.LineCurve3(mid1, mid2));
        pipePath.add(new THREE.LineCurve3(mid2, end));
        
        const pipeGeo = new THREE.TubeGeometry(pipePath, 16, 1.5, 8, false);
        const pipe = new THREE.Mesh(pipeGeo, copper);
        foundationGroup.add(pipe);
    }

    group.add(foundationGroup);
    parts.push({
        name: "Temporal Foundation Matrix",
        description: "A massive super-dense anchor deeply rooted into the local bedrock and spacetime continuum. It prevents the colossal array from being displaced backward in time due to the immense recoil of tachyonic emissions.",
        material: "darkSteel",
        function: "Structural and chronal anchoring.",
        assemblyOrder: 1,
        connections: ["Gravimetric Support Struts", "Cooling Pipelines"],
        failureEffect: "Spatiotemporal drift, causing the entire facility to oscillate violently between the present and 4.2 seconds in the past, eventually tearing itself apart via structural superposition.",
        cascadeFailures: ["Temporal Core", "Antenna Dish"],
        originalPosition: { x: 0, y: 10, z: 0 },
        explodedPosition: { x: 0, y: -50, z: 0 }
    });

    // 2. TEMPORAL STABILIZATION GYROSCOPES
    const gyroGroup = new THREE.Group();
    gyroGroup.position.y = 50;
    
    const ringRadius1 = 80;
    const ringRadius2 = 70;
    const ringRadius3 = 60;

    const ringGeo1 = new THREE.TorusGeometry(ringRadius1, 5, 16, 64);
    const ringGeo2 = new THREE.TorusGeometry(ringRadius2, 4, 16, 64);
    const ringGeo3 = new THREE.TorusGeometry(ringRadius3, 3, 16, 64);

    const outerRing = new THREE.Mesh(ringGeo1, chronosyncMetal);
    const middleRing = new THREE.Mesh(ringGeo2, chrome);
    const innerRing = new THREE.Mesh(ringGeo3, darkSteel);

    // Add greebles to rings
    for(let i=0; i<12; i++) {
        const angle = (i/12)*Math.PI*2;
        const greebleGeo = new THREE.BoxGeometry(8, 8, 12);
        
        const g1 = new THREE.Mesh(greebleGeo, steel);
        g1.position.set(Math.cos(angle)*ringRadius1, Math.sin(angle)*ringRadius1, 0);
        g1.lookAt(0,0,0);
        outerRing.add(g1);
        
        const g2 = new THREE.Mesh(greebleGeo, copper);
        g2.position.set(Math.cos(angle)*ringRadius2, Math.sin(angle)*ringRadius2, 0);
        g2.lookAt(0,0,0);
        middleRing.add(g2);
        
        const g3 = new THREE.Mesh(greebleGeo, steel);
        g3.position.set(Math.cos(angle)*ringRadius3, Math.sin(angle)*ringRadius3, 0);
        g3.lookAt(0,0,0);
        innerRing.add(g3);
    }

    outerRing.add(middleRing);
    middleRing.add(innerRing);
    gyroGroup.add(outerRing);

    // Support pillars for gyros
    const pillarGeo = new THREE.CylinderGeometry(8, 10, 40, 16);
    const p1 = new THREE.Mesh(pillarGeo, darkSteel);
    p1.position.set(-ringRadius1 - 5, -20, 0);
    const p2 = new THREE.Mesh(pillarGeo, darkSteel);
    p2.position.set(ringRadius1 + 5, -20, 0);
    gyroGroup.add(p1);
    gyroGroup.add(p2);

    group.add(gyroGroup);

    updatables.push((time, speed) => {
        outerRing.rotation.x = time * speed * 0.5;
        middleRing.rotation.y = time * speed * 1.2;
        innerRing.rotation.z = time * speed * 2.1;
    });

    parts.push({
        name: "Chrono-Stabilization Gyroscopes",
        description: "A three-axis massive gimbal system that maintains local temporal inertia. By spinning exotic matter rings at relativistic speeds, it generates a localized frame-dragging effect that counters the chronological sheer forces exerted by the tachyon beam.",
        material: "chronosyncMetal",
        function: "Temporal inertia frame-dragging and causality protection.",
        assemblyOrder: 2,
        connections: ["Foundation Matrix", "Exotic Matter Reactor Core"],
        failureEffect: "Loss of causality synchronization. Incoming messages from the future would overwrite the memories of the operators before they are received.",
        cascadeFailures: ["Exotic Matter Reactor Core"],
        originalPosition: { x: 0, y: 50, z: 0 },
        explodedPosition: { x: 0, y: 50, z: 150 }
    });

    // 3. EXOTIC MATTER REACTOR CORE
    const coreGroup = new THREE.Group();
    coreGroup.position.set(0, 0, 0);
    innerRing.add(coreGroup); // Attached to the innermost gyro

    const reactorVesselGeo = new THREE.SphereGeometry(30, 32, 32);
    const reactorVessel = new THREE.Mesh(reactorVesselGeo, glass);
    // Tinted glowing glass effect
    reactorVessel.material.color.setHex(0x0022aa);
    reactorVessel.material.transparent = true;
    reactorVessel.material.opacity = 0.4;
    coreGroup.add(reactorVessel);

    // Cherenkov Glow inner sphere
    const glowSphereGeo = new THREE.SphereGeometry(25, 32, 32);
    const glowSphere = new THREE.Mesh(glowSphereGeo, cherenkovGlowMat);
    coreGroup.add(glowSphere);

    // Pulsing core logic
    updatables.push((time, speed) => {
        const pulse = 1 + Math.sin(time * speed * 5) * 0.05;
        glowSphere.scale.set(pulse, pulse, pulse);
        glowSphere.material.emissiveIntensity = 3.5 + Math.sin(time * speed * 8) * 1.5;
    });

    // Containment rings around core
    for(let i=0; i<4; i++) {
        const cRingGeo = new THREE.TorusGeometry(32, 2, 16, 64);
        const cRing = new THREE.Mesh(cRingGeo, chrome);
        cRing.rotation.x = Math.PI / 2;
        cRing.position.y = (i - 1.5) * 12;
        coreGroup.add(cRing);
    }

    parts.push({
        name: "Exotic Matter Reactor Core & Cherenkov Containment",
        description: "Houses the ultra-dense exotic matter required to catalyze tachyonic particle generation. As virtual particles violate the speed of light within the containment vessel, they emit intense, eerie blue Cherenkov radiation into the surrounding vacuum.",
        material: "glass (vessel), cherenkovGlow (core)",
        function: "Energy generation and tachyon catalysis.",
        assemblyOrder: 3,
        connections: ["Chrono-Stabilization Gyroscopes", "Tachyon Waveguides"],
        failureEffect: "Exotic matter containment breach. Local gravity inverses, and the entire array is crushed under negative mass pressure before exploding.",
        cascadeFailures: ["Entire Array"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -100 }
    });

    // 4. MAIN TOWER MAST
    const mast = createTrussMast(20, 120, 6, 8);
    mast.position.y = 20;
    group.add(mast);

    parts.push({
        name: "Central Waveguide Truss",
        description: "A colossal reinforced lattice tower that acts as the primary physical support and phase-aligned waveguide for the tachyon emissions flowing from the core to the parabolic dish.",
        material: "steel",
        function: "Structural support and tachyon wave-guiding.",
        assemblyOrder: 4,
        connections: ["Foundation Matrix", "Antenna Dish Mount"],
        failureEffect: "Structural collapse under wind and tachyon recoil stress.",
        cascadeFailures: ["Parabolic Dish"],
        originalPosition: { x: 0, y: 80, z: 0 },
        explodedPosition: { x: -100, y: 80, z: 0 }
    });


    // 5. PARABOLIC DISH MOUNT & HYDRAULICS
    const dishMountGroup = new THREE.Group();
    dishMountGroup.position.y = 140; // Top of the mast
    group.add(dishMountGroup);

    const mountPivotGeo = new THREE.CylinderGeometry(15, 15, 30, 16);
    const mountPivot = new THREE.Mesh(mountPivotGeo, darkSteel);
    mountPivot.rotation.z = Math.PI / 2;
    dishMountGroup.add(mountPivot);

    // Large Hydraulics
    const hyd1 = createHydraulicPiston(60, 3);
    hyd1.position.set(-15, -40, 20);
    hyd1.lookAt(new THREE.Vector3(-15, 0, 0));
    dishMountGroup.add(hyd1);

    const hyd2 = createHydraulicPiston(60, 3);
    hyd2.position.set(15, -40, 20);
    hyd2.lookAt(new THREE.Vector3(15, 0, 0));
    dishMountGroup.add(hyd2);

    parts.push({
        name: "Azimuth-Elevation Articulation System",
        description: "Massive dark-steel pivot bearings and high-pressure hydraulic rams that allow the massive dish to aim at precise spatial coordinates to target receivers light-years away and years in the past.",
        material: "darkSteel",
        function: "Dish aiming and stabilization.",
        assemblyOrder: 5,
        connections: ["Central Waveguide Truss", "Parabolic Dish"],
        failureEffect: "Inability to target. Messages are sent into empty void or, worse, wrong timelines.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 140, z: 0 },
        explodedPosition: { x: 0, y: 140, z: -80 }
    });

    // 6. MASSIVE PARABOLIC DISH
    const dishRadius = 120;
    const dishDepth = 40;
    const dish = createComplexDish(dishRadius, dishDepth, 36, 12);
    
    // We attach dish to the mount pivot so it can be animated
    const dishArm = new THREE.Group();
    dishArm.add(dish);
    dishMountGroup.add(dishArm);

    // Aim the dish upwards at an angle
    dishArm.rotation.x = -Math.PI / 4;

    updatables.push((time, speed) => {
        // Slow sweeping motion to track cosmic targets
        dishMountGroup.rotation.y = Math.sin(time * speed * 0.1) * 0.5;
        dishArm.rotation.x = -Math.PI / 4 + Math.cos(time * speed * 0.15) * 0.1;
    });

    parts.push({
        name: "Primary Parabolic Exotic-Matter Reflector",
        description: "Constructed from hyper-cooled exotic matter mesh. Because tachyons have imaginary mass and travel faster than light, standard materials are completely transparent to them. This dish physically reflects and focuses particles moving backwards in time.",
        material: "exoticMatterMat",
        function: "Signal reflection, focusing, and collimation.",
        assemblyOrder: 6,
        connections: ["Articulation System", "Sub-Reflector Focal Assembly"],
        failureEffect: "Tachyon beam diffusion. Signal becomes unintelligible noise propagating across all of spacetime.",
        cascadeFailures: ["Sub-Reflector"],
        originalPosition: { x: 0, y: 140, z: 0 },
        explodedPosition: { x: 0, y: 250, z: 0 }
    });

    // 7. CONTROL CENTER & OPERATOR CABINS
    const facilityGroup = new THREE.Group();
    facilityGroup.position.set(0, 10, 80);
    group.add(facilityGroup);

    // Main Control Bunker
    const bunkerGeo = new THREE.BoxGeometry(60, 20, 40);
    const bunker = new THREE.Mesh(bunkerGeo, darkSteel);
    bunker.position.y = 10;
    facilityGroup.add(bunker);

    // Slanted Window for Bunker
    const windowGeo = new THREE.PlaneGeometry(50, 15);
    const bunkerWindow = new THREE.Mesh(windowGeo, tinted);
    bunkerWindow.position.set(0, 12, 20.1);
    bunkerWindow.rotation.x = -0.1;
    facilityGroup.add(bunkerWindow);

    // Interior Screens (visible through tinted glass if lit)
    for(let i=0; i<3; i++) {
        const screenGeo = new THREE.PlaneGeometry(12, 6);
        const screen = new THREE.Mesh(screenGeo, i===1 ? neonRedScreenMat : neonBlueScreenMat);
        screen.position.set((i-1)*15, 12, 18);
        facilityGroup.add(screen);
        
        updatables.push((time, speed) => {
            // Flickering screens
            screen.material.emissiveIntensity = 1.0 + Math.random() * 1.0;
        });
    }

    // Catwalks connecting bunker to base
    const catwalkGeo = new THREE.BoxGeometry(20, 2, 40);
    const catwalk = new THREE.Mesh(catwalkGeo, steel);
    catwalk.position.set(0, 10, -20);
    facilityGroup.add(catwalk);

    // Railings
    for(let i=0; i<2; i++) {
        const railGeo = new THREE.BoxGeometry(1, 4, 40);
        const rail = new THREE.Mesh(railGeo, steel);
        rail.position.set(i===0 ? -9.5 : 9.5, 13, -20);
        facilityGroup.add(rail);
    }

    parts.push({
        name: "Quantum Control Bunker",
        description: "A heavily shielded command center housing the paradox-resolution supercomputers. Operators here monitor the causality integrity of incoming and outgoing temporal transmissions.",
        material: "darkSteel, tinted glass",
        function: "Facility control and paradox mitigation.",
        assemblyOrder: 7,
        connections: ["Foundation Matrix"],
        failureEffect: "Operators suffer from acute temporal dissonance, remembering events that have not happened yet and forgetting their own training.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 20, z: 80 },
        explodedPosition: { x: 150, y: 20, z: 80 }
    });

    // 8. TACHYON PARTICLE BEAM SYSTEM (REVERSE TIME EFFECT)
    // To represent reverse time, particles will originate far away and converge onto the dish focus,
    // then travel down into the core. Wait, if it's emitting a message, the tachyons travel *away* from us in space,
    // but *backwards* in time.
    // Visually, to standard observers (us moving forward in time), a tachyon emitted backwards in time 
    // looks exactly like an anti-tachyon being RECEIVED from the future.
    // So the visual cue MUST be particles converging from space INTO the dish, incredibly fast.

    const particleSystemGroup = new THREE.Group();
    dishArm.add(particleSystemGroup); // Attach to dish so it aims with it

    const particleCount = 2500;
    const particleGeo = new THREE.CylinderGeometry(0.2, 0.2, 8, 4);
    particleGeo.rotateX(Math.PI / 2); // align with Z axis
    
    // We will use an InstancedMesh for extreme performance and massive scale
    const instancedParticles = new THREE.InstancedMesh(particleGeo, tachyonBeamMat, particleCount);
    
    const dummy = new THREE.Object3D();
    const particleData = [];

    // The beam extends far out along the local Y axis of the dish
    // Wait, the dish is pointing along local Y (the parabola opens along Y)
    // Let's verify parabola focus. Yes, y = x^2 / 4a, opens along +Y.
    const beamLength = 3000;
    const focalY = dishDepth;

    for (let i = 0; i < particleCount; i++) {
        // Distribute particles in a converging cone
        const distanceOut = Math.random() * beamLength;
        const angle = Math.random() * Math.PI * 2;
        
        // At focalY, spread is 0. At beamLength, spread is large (e.g. 500)
        const spreadAtDist = ((distanceOut) / beamLength) * 150;
        const radius = Math.random() * spreadAtDist;

        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = focalY + distanceOut;

        particleData.push({
            x: x,
            y: y,
            z: z,
            speed: 500 + Math.random() * 1000, // Very fast
            angle: angle,
            distRatio: distanceOut / beamLength
        });

        dummy.position.set(x, y, z);
        // Point towards focus
        dummy.lookAt(new THREE.Vector3(0, focalY, 0));
        dummy.updateMatrix();
        instancedParticles.setMatrixAt(i, dummy.matrix);
    }
    
    instancedParticles.instanceMatrix.needsUpdate = true;
    particleSystemGroup.add(instancedParticles);

    updatables.push((time, speed, delta) => {
        for (let i = 0; i < particleCount; i++) {
            const data = particleData[i];
            
            // Move particles TOWARDS the focus (Negative Y direction locally, but also constricting X/Z)
            // Visually demonstrating "reverse time" emission (looks like absorption)
            
            // Distance to focal point
            const dy = data.y - focalY;
            
            // Move inwards
            const moveStep = data.speed * delta * speed;
            let newY = data.y - moveStep;
            
            // If it hits the focus, reset it far away
            if (newY <= focalY) {
                newY = focalY + beamLength;
            }

            // Recalculate X/Z based on new Y to keep them in the cone
            const distanceOut = newY - focalY;
            const spreadAtDist = (distanceOut / beamLength) * 150;
            
            // Maintain relative position within the cross-section
            const currentRadius = Math.sqrt(data.x*data.x + data.z*data.z);
            const maxOldSpread = ((data.y - focalY) / beamLength) * 150;
            
            let radiusRatio = maxOldSpread > 0 ? currentRadius / maxOldSpread : 0;
            if (radiusRatio > 1) radiusRatio = 1;
            
            const newRadius = spreadAtDist * radiusRatio;
            
            const newX = Math.cos(data.angle) * newRadius;
            const newZ = Math.sin(data.angle) * newRadius;

            data.x = newX;
            data.y = newY;
            data.z = newZ;

            dummy.position.set(newX, newY, newZ);
            dummy.lookAt(new THREE.Vector3(0, focalY, 0));
            // stretch based on speed for motion blur effect
            dummy.scale.set(1, 1, 1 + (data.speed * 0.01)); 
            dummy.updateMatrix();
            instancedParticles.setMatrixAt(i, dummy.matrix);
        }
        instancedParticles.instanceMatrix.needsUpdate = true;
    });

    parts.push({
        name: "Retro-Causal Tachyon Beam",
        description: "The actual transmission medium. Composed of tachyons (imaginary mass, v > c). To observers moving forward in time, the emission of a signal backwards in time appears identically to an intense beam of particles rapidly converging from the depths of space into the dish. This visual 'absorption' is the physical manifestation of reverse-causality.",
        material: "tachyonBeamMat (Energy)",
        function: "Faster-than-light, backwards-in-time information transfer.",
        assemblyOrder: 8,
        connections: ["Sub-Reflector Focal Assembly"],
        failureEffect: "Information paradoxes. Receiving replies to messages that were never sent.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 300, z: 0 },
        explodedPosition: { x: 0, y: 600, z: 0 }
    });


    // 9. SUPERFLUID HELIUM COOLING TOWERS
    const coolingGroup = new THREE.Group();
    coolingGroup.position.set(0, 0, 0);
    group.add(coolingGroup);

    for(let i=0; i<4; i++) {
        const angle = (i/4) * Math.PI * 2 + (Math.PI/4); // diagonal corners
        const dist = 120;
        
        const towerGroup = new THREE.Group();
        towerGroup.position.set(Math.cos(angle)*dist, 40, Math.sin(angle)*dist);

        const towerGeo = new THREE.CylinderGeometry(15, 25, 80, 16);
        const tower = new THREE.Mesh(towerGeo, aluminum);
        towerGroup.add(tower);

        // Cooling fins
        for(let j=0; j<10; j++) {
            const finGeo = new THREE.CylinderGeometry(26, 26, 2, 16);
            const fin = new THREE.Mesh(finGeo, darkSteel);
            fin.position.y = -30 + (j*6);
            towerGroup.add(fin);
        }

        // Steam/Glow from top
        const ventGeo = new THREE.CylinderGeometry(10, 10, 5, 16);
        const vent = new THREE.Mesh(ventGeo, neonBlueScreenMat);
        vent.position.y = 42;
        towerGroup.add(vent);

        coolingGroup.add(towerGroup);
        
        updatables.push((time, speed) => {
            vent.material.emissiveIntensity = 1.0 + Math.sin(time * speed * 2 + i) * 0.5;
        });
    }

    parts.push({
        name: "Superfluid Helium Cryo-Towers",
        description: "Four massive towers pumping superfluid helium-4 at near absolute zero into the foundation and core. Essential for maintaining the superconductive states required by the Chrono-Stabilization Gyroscopes and the Exotic Matter containment fields.",
        material: "aluminum, darkSteel",
        function: "Extreme thermal management.",
        assemblyOrder: 9,
        connections: ["Foundation Matrix", "Cooling Pipelines"],
        failureEffect: "Thermal runaway. The exotic matter heats up, transitioning into normal matter and releasing enough energy to shatter the tectonic plate.",
        cascadeFailures: ["Exotic Matter Reactor Core"],
        originalPosition: { x: 120, y: 40, z: 120 },
        explodedPosition: { x: 250, y: 40, z: 250 }
    });

    // 10. CALIBRATION LASER ARRAY
    const laserGroup = new THREE.Group();
    dishArm.add(laserGroup);

    for(let i=0; i<3; i++) {
        const angle = (i/3) * Math.PI * 2;
        const radius = dishRadius * 0.9; // Edge of the dish
        
        const laserEmitterGeo = new THREE.CylinderGeometry(2, 2, 10, 8);
        const laserEmitter = new THREE.Mesh(laserEmitterGeo, darkSteel);
        
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = (radius * radius) / (4 * dishDepth); // On the dish surface
        
        laserEmitter.position.set(x, y + 5, z);
        
        // Point parallel to local Y (which is where the beam goes)
        laserEmitter.rotation.x = Math.PI / 2;
        laserGroup.add(laserEmitter);

        // The actual laser beam
        const laserBeamGeo = new THREE.CylinderGeometry(0.2, 0.2, 2000, 4);
        const laserBeam = new THREE.Mesh(laserBeamGeo, neonRedScreenMat);
        laserBeam.position.set(0, -1000, 0); // extend downwards locally, which means outwards
        laserEmitter.add(laserBeam);
        
        updatables.push((time, speed) => {
            // Blink lasers
            laserBeam.visible = Math.sin(time * speed * 15) > 0;
        });
    }

    parts.push({
        name: "Interferometric Calibration Lasers",
        description: "Standard light-speed (c) lasers mounted on the rim of the primary dish. These are used to establish a baseline spacetime coordinate grid against which the superluminal tachyon trajectories are calculated.",
        material: "darkSteel, neonRed (beam)",
        function: "Spatial alignment and targeting calibration.",
        assemblyOrder: 10,
        connections: ["Parabolic Dish"],
        failureEffect: "Misalignment of the tachyon beam by micro-arcseconds, causing the signal to miss the target receiver planet by millions of miles.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 150, z: 0 },
        explodedPosition: { x: 0, y: 150, z: -150 }
    });


    // --- QUIZ QUESTIONS ---
    const quizQuestions = [
        {
            question: "According to the Tachyonic Antitelephone paradox, sending a message faster than light allows for causality violation. If observer A moving at relativistic velocity v relative to B sends a tachyon signal to B, and B immediately replies with a tachyon signal back to A, under what condition does A receive the reply BEFORE sending the original message?",
            options: [
                "Only if both tachyon signals travel at exactly infinite velocity (v_tachyon = ∞).",
                "If the product of the tachyon velocities in both frames is less than c^2 / v.",
                "If the speed of the tachyons relative to their respective sources is greater than c^2 / v, where v is the relative velocity between A and B.",
                "It is impossible; the Lorentz transformations prevent signals from moving backward in time in the sender's own rest frame."
            ],
            correctAnswer: 2,
            explanation: "In special relativity, a signal traveling faster than light in one frame will travel backward in time in another frame moving at velocity v relative to the first. For a two-way signal (the antitelephone) to arrive before it was sent in the original rest frame, the tachyon speeds must exceed c^2 / v. This creates a closed timelike curve for the information, leading to causality paradoxes."
        },
        {
            question: "In quantum field theory, the Feinberg reinterpretation principle addresses the negative-energy states of tachyons. How does this principle resolve the paradox of observing a tachyon moving backward in time with negative energy?",
            options: [
                "By mathematically proving that negative-energy tachyons decay instantaneously into photons.",
                "By reinterpreting the absorption of a negative-energy tachyon moving backward in time as the emission of a positive-energy tachyon moving forward in time.",
                "By assuming that tachyons can only exist within the event horizon of a black hole.",
                "By applying the Pauli exclusion principle to force tachyons into positive-energy states."
            ],
            correctAnswer: 1,
            explanation: "Gerald Feinberg proposed that what appears to be a tachyon with negative energy propagating backward in time can be mathematically and physically reinterpreted as a tachyon with positive energy propagating forward in time. This is analogous to how antiparticles are treated in the Feynman-Stueckelberg interpretation, thus preserving the positive energy density of the universe."
        },
        {
            question: "Tachyons are hypothesized to have an imaginary rest mass (m = i*μ). For a normal particle with real mass, energy approaches infinity as velocity approaches c. For a tachyon, what happens to its energy and momentum as its velocity approaches infinity?",
            options: [
                "Both energy and momentum approach infinity.",
                "Energy approaches zero, and momentum approaches a non-zero minimum value (μ*c).",
                "Energy approaches an imaginary value, and momentum becomes zero.",
                "Energy and momentum both approach zero, rendering the particle undetectable."
            ],
            correctAnswer: 1,
            explanation: "The energy of a tachyon is given by E = μ*c^2 / sqrt(v^2/c^2 - 1). As v approaches infinity, the denominator goes to infinity, so E approaches 0. Its momentum p = E*v/c^2 approaches a constant minimum limit of μ*c. Thus, a zero-energy tachyon is one moving at infinite speed, effectively existing everywhere along its trajectory simultaneously."
        },
        {
            question: "If tachyons interact with ordinary matter and carry an electric charge, what unique electromagnetic signature would they continuously produce in a complete vacuum?",
            options: [
                "Bremsstrahlung radiation.",
                "Synchrotron radiation.",
                "Hawking radiation.",
                "Cherenkov radiation."
            ],
            correctAnswer: 3,
            explanation: "Cherenkov radiation is emitted when a charged particle travels through a medium faster than the phase velocity of light in that medium. Because a tachyon travels faster than the speed of light in a vacuum (c), a charged tachyon would emit Cherenkov radiation even in a perfect vacuum, continuously losing energy. Ironically, losing energy causes a tachyon to speed up."
        },
        {
            question: "In 26-dimensional bosonic string theory, the ground state of the string is tachyonic, indicating an instability in the theory. What is the physical interpretation of this 'tachyon field' rolling down to the true minimum of its potential?",
            options: [
                "The creation of a primordial black hole.",
                "The decay of the unstable D-brane on which the string is attached, leading to a phase transition into a stable vacuum.",
                "The sudden acceleration of the universe's expansion (dark energy).",
                "The conversion of all bosonic strings into fermionic strings."
            ],
            correctAnswer: 1,
            explanation: "In string theory, a tachyon does not necessarily mean a particle traveling faster than light; rather, it indicates an unstable vacuum state (a local maximum in the potential energy). Sen's conjecture explains that tachyon condensation represents the decay of an unstable D-brane. As the tachyon field rolls to the true minimum, the D-brane annihilates, leaving behind the closed string vacuum."
        }
    ];

    // --- ANIMATION FUNCTION ---
    let previousTime = 0;
    
    function animate(time, speed, meshes) {
        // time is continuous, speed is a multiplier
        const delta = time - previousTime;
        previousTime = time;

        // Execute all registered updates
        updatables.forEach(fn => fn(time, speed, delta));
    }

    return {
        group,
        parts,
        description: "The God-Tier Tachyon Communication Array is the pinnacle of hyper-relativistic engineering. It leverages exotic matter, contained within superfluid-cooled chrono-stabilization gyroscopes, to generate and focus a beam of superluminal tachyons. By manipulating the imaginary mass and inverted Lorentz kinematics of these particles, the array transmits information strictly backward in time, enabling retro-causal communication across the cosmos. Visually, the emission process appears reversed: a blinding stream of Cherenkov-radiating particles converging from the void into the exotic matter dish.",
        quizQuestions,
        animate
    };
}
