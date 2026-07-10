import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};
    
    const description = "The God-Tier Chronosphere Time Vault is an incomprehensibly complex, hyper-advanced machine designed to freeze a localized region of spacetime. It perfectly preserves its contents outside the normal flow of time by utilizing rotating temporal engines, a tachyon-infused stasis field, and an array of microscopic singularity containment units.";

    // ==========================================
    // CUSTOM HYPER-TECH MATERIALS
    // ==========================================
    const neonBlue = new THREE.MeshStandardMaterial({ 
        color: 0x0000ff, 
        emissive: 0x0055ff, 
        emissiveIntensity: 2.5, 
        metalness: 0.8, 
        roughness: 0.1 
    });
    
    const neonPurple = new THREE.MeshStandardMaterial({ 
        color: 0x8a2be2, 
        emissive: 0x8a2be2, 
        emissiveIntensity: 3.0, 
        metalness: 0.9, 
        roughness: 0.2 
    });
    
    const neonOrange = new THREE.MeshStandardMaterial({
        color: 0xff4500,
        emissive: 0xff4500,
        emissiveIntensity: 3.5,
        metalness: 0.5,
        roughness: 0.2
    });
    
    const stasisMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x002244,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.4,
        transmission: 0.95,
        ior: 1.52,
        roughness: 0.05,
        metalness: 0.1,
        side: THREE.DoubleSide,
        depthWrite: false
    });
    
    const quantumGold = new THREE.MeshStandardMaterial({ 
        color: 0xffd700, 
        emissive: 0xffaa00, 
        emissiveIntensity: 0.5, 
        metalness: 1.0, 
        roughness: 0.3 
    });
    
    const darkEnergySteel = new THREE.MeshStandardMaterial({ 
        color: 0x111111, 
        metalness: 0.95, 
        roughness: 0.4, 
        clearcoat: 1.0 
    });

    const chronotonWire = new THREE.MeshStandardMaterial({
        color: 0x00ffcc,
        emissive: 0x00ffaa,
        emissiveIntensity: 1.5,
        metalness: 0.8,
        roughness: 0.2,
        wireframe: true
    });

    // ==========================================
    // PROCEDURAL GENERATION ARRAYS
    // ==========================================
    meshes.rotators = [];
    meshes.pistonsInner = [];
    meshes.pistonsOuter = [];
    meshes.gears = [];
    meshes.frozenParticles = [];
    meshes.temporalRings = [];
    meshes.stasisPulses = [];
    meshes.exhaustStreams = [];
    
    // ==========================================
    // HELPER FUNCTIONS
    // ==========================================
    
    // Generates a massive gear with highly detailed teeth
    function createComplexGear(outerRadius, innerRadius, thickness, teethCount, material) {
        const shape = new THREE.Shape();
        const step = (Math.PI * 2) / teethCount;
        for (let i = 0; i < teethCount; i++) {
            const angle = i * step;
            const nextAngle = (i + 0.5) * step;
            
            shape.lineTo(Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius);
            shape.lineTo(Math.cos(nextAngle) * outerRadius, Math.sin(nextAngle) * outerRadius);
            
            const indentAngle1 = (i + 0.6) * step;
            const indentAngle2 = (i + 0.9) * step;
            shape.lineTo(Math.cos(indentAngle1) * innerRadius, Math.sin(indentAngle1) * innerRadius);
            shape.lineTo(Math.cos(indentAngle2) * innerRadius, Math.sin(indentAngle2) * innerRadius);
        }
        shape.closePath();
        
        // Create hole in middle
        const holePath = new THREE.Path();
        holePath.absarc(0, 0, innerRadius * 0.5, 0, Math.PI * 2, false);
        shape.holes.push(holePath);

        const extrudeSettings = { 
            depth: thickness, 
            bevelEnabled: true, 
            bevelSegments: 3, 
            steps: 1, 
            bevelSize: 0.2, 
            bevelThickness: 0.2 
        };
        
        const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        geo.center();
        const mesh = new THREE.Mesh(geo, material);
        return mesh;
    }

    // Creates hydraulic pistons that will animate
    function createHydraulicPiston(length, radius, materialOuter, materialInner) {
        const group = new THREE.Group();
        
        const outerGeo = new THREE.CylinderGeometry(radius, radius, length * 0.6, 32);
        const outerMesh = new THREE.Mesh(outerGeo, materialOuter);
        outerMesh.position.y = length * 0.3;
        group.add(outerMesh);
        
        const innerGeo = new THREE.CylinderGeometry(radius * 0.7, radius * 0.7, length * 0.8, 32);
        const innerMesh = new THREE.Mesh(innerGeo, materialInner);
        innerMesh.position.y = length * 0.4;
        group.add(innerMesh);
        
        // Adding detailed base mounts
        const mountGeo = new THREE.BoxGeometry(radius * 3, radius * 0.5, radius * 3);
        const mount1 = new THREE.Mesh(mountGeo, darkSteel);
        mount1.position.y = 0;
        const mount2 = new THREE.Mesh(mountGeo, darkSteel);
        mount2.position.y = length * 0.6;
        outerMesh.add(mount1);
        innerMesh.add(mount2);
        
        meshes.pistonsInner.push({ mesh: innerMesh, baseLength: length * 0.4 });
        
        return group;
    }

    // Creates detailed pipe arrays
    function createPipeArray(radius, tube, segments, material, count, spread) {
        const group = new THREE.Group();
        for(let i=0; i<count; i++) {
            const path = new THREE.CatmullRomCurve3([
                new THREE.Vector3(-spread/2 + (spread/count)*i, 0, 0),
                new THREE.Vector3(-spread/2 + (spread/count)*i, radius, radius),
                new THREE.Vector3(0, radius*2, radius*2),
                new THREE.Vector3(spread/2 - (spread/count)*i, radius, radius*3)
            ]);
            const tubeGeo = new THREE.TubeGeometry(path, segments, tube, 16, false);
            const tubeMesh = new THREE.Mesh(tubeGeo, material);
            group.add(tubeMesh);
        }
        return group;
    }

    // ==========================================
    // COMPONENT: GRAVITATIONAL ANCHOR BASE
    // ==========================================
    const baseGroup = new THREE.Group();
    
    // Massive extruded star shape for base
    const baseShape = new THREE.Shape();
    const basePoints = 16;
    const baseOuter = 35;
    const baseInner = 28;
    for(let i=0; i<basePoints; i++) {
        const a = (i / basePoints) * Math.PI * 2;
        const r = (i % 2 === 0) ? baseOuter : baseInner;
        if(i === 0) baseShape.moveTo(Math.cos(a)*r, Math.sin(a)*r);
        else baseShape.lineTo(Math.cos(a)*r, Math.sin(a)*r);
    }
    baseShape.closePath();
    
    const baseExtrude = { depth: 4, bevelEnabled: true, bevelSegments: 5, steps: 1, bevelSize: 1.5, bevelThickness: 2 };
    const baseGeo = new THREE.ExtrudeGeometry(baseShape, baseExtrude);
    const baseMesh = new THREE.Mesh(baseGeo, darkEnergySteel);
    baseMesh.rotation.x = Math.PI / 2;
    baseMesh.position.y = -2;
    baseGroup.add(baseMesh);

    // Floor grille details
    const grilleGeo = new THREE.CylinderGeometry(baseInner - 2, baseInner - 2, 4.5, 64);
    const grilleMesh = new THREE.Mesh(grilleGeo, steel);
    baseGroup.add(grilleMesh);
    
    // Outer neon ring around base
    const baseRingGeo = new THREE.TorusGeometry(baseOuter + 1, 0.5, 16, 128);
    const baseRing = new THREE.Mesh(baseRingGeo, neonBlue);
    baseRing.rotation.x = Math.PI / 2;
    baseRing.position.y = 1;
    baseGroup.add(baseRing);
    meshes.stasisPulses.push(baseRing);

    group.add(baseGroup);

    parts.push({
        name: "Gravitational Anchor Base",
        description: "Massive dark energy steel platform anchoring the chronosphere to local spacetime. Prevents the vault from drifting into alternate dimensions during temporal shifts.",
        material: "Dark Energy Steel, Neon Blue Conduits",
        function: "Spatial stabilization",
        assemblyOrder: 1,
        connections: ["Time Stream Stabilizers", "Dimensional Tethers"],
        failureEffect: "Spontaneous dimensional drifting.",
        cascadeFailures: ["Chronosphere Grid", "Stasis Field Projector"],
        originalPosition: { x: 0, y: -2, z: 0 },
        explodedPosition: { x: 0, y: -15, z: 0 }
    });

    // ==========================================
    // COMPONENT: CENTRAL VAULT & STASIS FIELD
    // ==========================================
    const vaultGroup = new THREE.Group();
    vaultGroup.position.y = 15;
    
    // Core object (e.g. an incredibly complex artifact being preserved)
    const artifactGeo = new THREE.IcosahedronGeometry(2, 2);
    const artifact = new THREE.Mesh(artifactGeo, quantumGold);
    vaultGroup.add(artifact);
    
    // Adding rotating quantum rings around the artifact
    for(let i=0; i<3; i++) {
        const artRingGeo = new THREE.TorusGeometry(3 + (i*0.5), 0.1, 16, 64);
        const artRing = new THREE.Mesh(artRingGeo, neonPurple);
        artRing.rotation.x = Math.random() * Math.PI;
        artRing.rotation.y = Math.random() * Math.PI;
        vaultGroup.add(artRing);
        meshes.rotators.push({ mesh: artRing, axis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize(), speed: 2 + i });
    }

    // Stasis Field Sphere (Translucent, glowing)
    const stasisGeo = new THREE.SphereGeometry(8, 64, 64);
    const stasisMesh = new THREE.Mesh(stasisGeo, stasisMaterial);
    vaultGroup.add(stasisMesh);

    // Frozen Particles inside Stasis Field
    // These particles must remain COMPLETELY STATIC to demonstrate frozen time.
    for(let i=0; i<200; i++) {
        const pGeo = new THREE.SphereGeometry(0.05 + Math.random()*0.1, 8, 8);
        const pMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const pMesh = new THREE.Mesh(pGeo, pMat);
        
        // Random position within sphere
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        const r = Math.cbrt(Math.random()) * 7.5; // inside the radius of 8
        
        pMesh.position.x = r * Math.sin(phi) * Math.cos(theta);
        pMesh.position.y = r * Math.sin(phi) * Math.sin(theta);
        pMesh.position.z = r * Math.cos(phi);
        
        vaultGroup.add(pMesh);
    }

    // Vault Outer Shell / Lattice
    const latticeGeo = new THREE.IcosahedronGeometry(8.2, 3);
    const latticeMat = new THREE.MeshStandardMaterial({
        color: 0x333333,
        metalness: 0.9,
        roughness: 0.1,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const lattice = new THREE.Mesh(latticeGeo, latticeMat);
    vaultGroup.add(lattice);

    group.add(vaultGroup);

    parts.push({
        name: "Central Vault & Stasis Field",
        description: "The primary containment unit where the flow of time is absolute zero. Features a tachyon-infused stasis bubble and a quantum gold artifact core.",
        material: "Stasis Metamaterial, Quantum Gold, Chronoton Wire",
        function: "Preservation of matter and state",
        assemblyOrder: 15,
        connections: ["Engine Alpha", "Engine Beta", "Engine Gamma", "Engine Delta"],
        failureEffect: "Rapid aging and spontaneous entropy of the contained artifact.",
        cascadeFailures: ["None. If this fails, the mission is over."],
        originalPosition: { x: 0, y: 15, z: 0 },
        explodedPosition: { x: 0, y: 35, z: 0 }
    });

    // ==========================================
    // COMPONENT: 4 TEMPORAL ENGINES
    // ==========================================
    const engineDistance = 22;
    const engineHeight = 15;
    
    function buildTemporalEngine(name, angleOffset) {
        const engineGroup = new THREE.Group();
        
        const x = Math.cos(angleOffset) * engineDistance;
        const z = Math.sin(angleOffset) * engineDistance;
        engineGroup.position.set(x, engineHeight, z);
        engineGroup.lookAt(0, engineHeight, 0); // Point towards the center

        // Engine Core Hub
        const hubGeo = new THREE.SphereGeometry(3, 32, 32);
        const hub = new THREE.Mesh(hubGeo, darkSteel);
        engineGroup.add(hub);

        // Neon Core visible through hub
        const neonCoreGeo = new THREE.SphereGeometry(3.1, 16, 16);
        const neonCoreMat = new THREE.MeshBasicMaterial({ color: 0xff4500, wireframe: true });
        const neonCore = new THREE.Mesh(neonCoreGeo, neonCoreMat);
        engineGroup.add(neonCore);
        meshes.rotators.push({ mesh: neonCore, axis: new THREE.Vector3(1, 0, 0), speed: -5 });

        // Outer Rotating Rings (Massive and complex)
        for(let r=0; r<4; r++) {
            const ringR = 4 + (r * 1.5);
            const ringGroup = new THREE.Group();
            
            // Main ring body
            const ringGeo = new THREE.TorusGeometry(ringR, 0.4, 32, 100);
            const ringMat = (r % 2 === 0) ? steel : chrome;
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ringGroup.add(ring);
            
            // Add teeth/lugs around the ring for complexity
            const lugCount = 20 + (r * 10);
            const lugGeo = new THREE.BoxGeometry(0.8, 0.8, 1.5);
            for(let l=0; l<lugCount; l++) {
                const lAngle = (l / lugCount) * Math.PI * 2;
                const lug = new THREE.Mesh(lugGeo, darkSteel);
                lug.position.set(Math.cos(lAngle)*ringR, Math.sin(lAngle)*ringR, 0);
                lug.rotation.z = lAngle;
                
                // Add tiny neon lights to some lugs
                if(l % 3 === 0) {
                    const lightGeo = new THREE.BoxGeometry(0.9, 0.9, 0.2);
                    const light = new THREE.Mesh(lightGeo, neonBlue);
                    lug.add(light);
                }
                
                ringGroup.add(lug);
            }
            
            // Rotate rings in different axes
            ringGroup.rotation.x = Math.random() * Math.PI;
            ringGroup.rotation.y = Math.random() * Math.PI;
            engineGroup.add(ringGroup);
            
            meshes.temporalRings.push({ 
                mesh: ringGroup, 
                axis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize(), 
                speed: (Math.random() * 2 + 1) * (r % 2 === 0 ? 1 : -1)
            });
        }
        
        // Massive Gears driving the engine at the back
        const gear1 = createComplexGear(5, 3, 1, 24, copper);
        gear1.position.z = -5;
        engineGroup.add(gear1);
        meshes.gears.push({ mesh: gear1, axis: new THREE.Vector3(0,0,1), speed: 1.5 });
        
        const gear2 = createComplexGear(3, 1.5, 0.8, 12, darkSteel);
        gear2.position.set(2, 3, -4.5);
        engineGroup.add(gear2);
        meshes.gears.push({ mesh: gear2, axis: new THREE.Vector3(0,0,1), speed: -3.0 });
        
        // Hydraulics connecting hub to base
        for(let h=0; h<3; h++) {
            const hydAngle = (h / 3) * Math.PI * 2;
            const piston = createHydraulicPiston(10, 0.5, chrome, steel);
            // Position at bottom of engine, pointing down to base
            piston.position.set(Math.cos(hydAngle)*2, -4, Math.sin(hydAngle)*2);
            piston.rotation.x = Math.PI / 2; // Point outwards/downwards
            
            // To make it look right, we orient it toward the base
            piston.lookAt(new THREE.Vector3(0, -engineHeight, 0));
            engineGroup.add(piston);
        }

        // Projector lens aiming at the vault
        const lensGeo = new THREE.CylinderGeometry(1.5, 2.5, 3, 32);
        const lens = new THREE.Mesh(lensGeo, glass);
        lens.rotation.x = Math.PI / 2;
        lens.position.z = 3;
        engineGroup.add(lens);
        
        // Inner glowing core in lens
        const lensCoreGeo = new THREE.SphereGeometry(1.2, 16, 16);
        const lensCore = new THREE.Mesh(lensCoreGeo, neonPurple);
        lensCore.position.z = 2;
        engineGroup.add(lensCore);
        meshes.stasisPulses.push(lensCore);

        group.add(engineGroup);

        parts.push({
            name: `Temporal Engine ${name}`,
            description: `A massive, frame-dragging temporal projector. Spins at relativistic speeds to generate a localized chronoton displacement field.`,
            material: "Dark Steel, Chrome, Glass, Neon Arrays",
            function: "Spacetime distortion",
            assemblyOrder: 5,
            connections: ["Gravitational Anchor Base", "Central Vault & Stasis Field", "Dimensional Tethers"],
            failureEffect: "Asymmetric time dilation resulting in spaghettification of the immediate area.",
            cascadeFailures: ["Central Vault", "Quantum Locking Mechanism"],
            originalPosition: { x: x, y: engineHeight, z: z },
            explodedPosition: { x: x * 2.5, y: engineHeight * 1.5, z: z * 2.5 }
        });
        
        return engineGroup;
    }

    buildTemporalEngine("Alpha", 0);
    buildTemporalEngine("Beta", Math.PI / 2);
    buildTemporalEngine("Gamma", Math.PI);
    buildTemporalEngine("Delta", Math.PI * 1.5);

    // ==========================================
    // COMPONENT: DIMENSIONAL TETHERS & CONDUITS
    // ==========================================
    // Massive cables connecting the engines to the central vault base
    const tetherGroup = new THREE.Group();
    
    for(let i=0; i<4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        const x = Math.cos(angle) * engineDistance;
        const z = Math.sin(angle) * engineDistance;
        
        const path = new THREE.CatmullRomCurve3([
            new THREE.Vector3(x, engineHeight - 3, z),
            new THREE.Vector3(x * 0.7, 5, z * 0.7),
            new THREE.Vector3(x * 0.4, 2, z * 0.4),
            new THREE.Vector3(Math.cos(angle)*10, 0, Math.sin(angle)*10)
        ]);
        
        // Main structural tether
        const tetherGeo = new THREE.TubeGeometry(path, 64, 1.2, 16, false);
        const tether = new THREE.Mesh(tetherGeo, darkSteel);
        tetherGroup.add(tether);
        
        // Glowing conduit wrapped around tether
        const conduitGeo = new THREE.TubeGeometry(path, 128, 1.4, 6, false);
        const conduitMat = new THREE.MeshStandardMaterial({
            color: 0x000000,
            wireframe: true,
            emissive: 0xff4500,
            emissiveIntensity: 2
        });
        const conduit = new THREE.Mesh(conduitGeo, conduitMat);
        // Make the conduit spiral by rotating it slightly, though TubeGeometry along curve makes this tricky.
        // We'll just rely on the wireframe + emissive for a high-tech look.
        tetherGroup.add(conduit);
        
        meshes.exhaustStreams.push(conduit);
    }
    group.add(tetherGroup);
    
    parts.push({
        name: "Dimensional Tethers",
        description: "Heavy-duty dark steel cables routing raw paradox-energy from the engines down into the gravitational anchor.",
        material: "Dark Steel, Neon Orange Conduits",
        function: "Energy routing and stabilization",
        assemblyOrder: 8,
        connections: ["Temporal Engines", "Gravitational Anchor Base"],
        failureEffect: "Energy backlash causing localized temporal loops.",
        cascadeFailures: ["Gravitational Anchor Base"],
        originalPosition: { x: 0, y: 5, z: 0 },
        explodedPosition: { x: 0, y: -10, z: 0 }
    });

    // ==========================================
    // COMPONENT: OPERATOR CONSOLE & CHRONOSPHERE GRID
    // ==========================================
    const consoleGroup = new THREE.Group();
    consoleGroup.position.set(0, 0, 30);
    
    // Console Desk
    const deskGeo = new THREE.BoxGeometry(10, 3, 4);
    const desk = new THREE.Mesh(deskGeo, steel);
    desk.position.y = 1.5;
    consoleGroup.add(desk);
    
    // Holographic displays
    for(let i=0; i<3; i++) {
        const screenGeo = new THREE.PlaneGeometry(3, 2);
        const screenMat = new THREE.MeshBasicMaterial({ 
            color: 0x00ffff, 
            transparent: true, 
            opacity: 0.7, 
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending
        });
        const screen = new THREE.Mesh(screenGeo, screenMat);
        screen.position.set(-3 + (i*3), 4, -1);
        screen.rotation.x = -Math.PI / 6;
        
        // Add random grid lines to screens
        const gridHelper = new THREE.GridHelper(3, 10, 0xffffff, 0xffffff);
        gridHelper.rotation.x = Math.PI / 2;
        screen.add(gridHelper);
        
        consoleGroup.add(screen);
    }
    
    // Console control joysticks
    for(let i=0; i<2; i++) {
        const stickGeo = new THREE.CylinderGeometry(0.1, 0.1, 1, 8);
        const stick = new THREE.Mesh(stickGeo, plastic);
        stick.position.set(-2 + (i*4), 3.5, 0);
        stick.rotation.x = Math.PI / 8;
        
        const knobGeo = new THREE.SphereGeometry(0.3, 16, 16);
        const knob = new THREE.Mesh(knobGeo, rubber);
        knob.position.y = 0.5;
        stick.add(knob);
        
        consoleGroup.add(stick);
    }
    group.add(consoleGroup);

    parts.push({
        name: "Operator Console",
        description: "The primary interface for monitoring the Bekenstein bound and chronoton flux. Shielded with localized tachyon dampeners.",
        material: "Steel, Plastic, Rubber, Holographic Projections",
        function: "User Interface and System Diagnostics",
        assemblyOrder: 20,
        connections: ["Gravitational Anchor Base"],
        failureEffect: "Loss of control over the stasis field calibration.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 30 },
        explodedPosition: { x: 0, y: 5, z: 50 }
    });

    // ==========================================
    // COMPONENT: SINGULARITY CONTAINMENT FIELD
    // ==========================================
    const containmentGroup = new THREE.Group();
    containmentGroup.position.y = 25; // Above the vault
    
    // Torus ring holding the singularity
    const contRingGeo = new THREE.TorusGeometry(12, 1, 32, 64);
    const contRing = new THREE.Mesh(contRingGeo, chrome);
    contRing.rotation.x = Math.PI / 2;
    containmentGroup.add(contRing);
    
    // Energy beams pointing inward
    for(let i=0; i<8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const beamGeo = new THREE.CylinderGeometry(0.2, 0.5, 12, 16);
        const beam = new THREE.Mesh(beamGeo, neonBlue);
        
        beam.position.set(Math.cos(angle)*6, 0, Math.sin(angle)*6);
        beam.rotation.z = Math.PI / 2;
        beam.rotation.y = -angle;
        containmentGroup.add(beam);
    }
    
    // The Singularity (a pitch black sphere distorting space)
    const singGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const singMat = new THREE.MeshBasicMaterial({ color: 0x000000 }); // Absolute black
    const singularity = new THREE.Mesh(singGeo, singMat);
    containmentGroup.add(singularity);
    
    // Event horizon glow
    const horizonGeo = new THREE.SphereGeometry(1.7, 32, 32);
    const horizonMat = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide
    });
    const horizon = new THREE.Mesh(horizonGeo, horizonMat);
    containmentGroup.add(horizon);
    
    meshes.rotators.push({ mesh: horizon, axis: new THREE.Vector3(0, 1, 0), speed: 10 });
    group.add(containmentGroup);

    parts.push({
        name: "Singularity Containment Field",
        description: "Houses a captive microscopic black hole used to generate the extreme gravitational sheer required to puncture standard spacetime.",
        material: "Chrome, Neon Emitters, Degenerate Matter",
        function: "Power generation and gravity sheer",
        assemblyOrder: 10,
        connections: ["Central Vault"],
        failureEffect: "Immediate consumption of the facility and planet by the microscopic singularity.",
        cascadeFailures: ["Everything"],
        originalPosition: { x: 0, y: 25, z: 0 },
        explodedPosition: { x: 0, y: 60, z: 0 }
    });

    // ==========================================
    // COMPONENT: TACHYON EXHAUST PIPES
    // ==========================================
    const exhaustGroup = new THREE.Group();
    const ePipeGeo = new THREE.CylinderGeometry(1, 1, 8, 16);
    
    for(let i=0; i<4; i++) {
        const angle = (i / 4) * Math.PI * 2 + (Math.PI / 4);
        const pipe = new THREE.Mesh(ePipeGeo, copper);
        pipe.position.set(Math.cos(angle)*15, 4, Math.sin(angle)*15);
        pipe.rotation.x = Math.PI / 4;
        pipe.rotation.y = -angle;
        
        // Exhaust gas (particle planes)
        const gasGeo = new THREE.PlaneGeometry(3, 10);
        const gasMat = new THREE.MeshBasicMaterial({
            color: 0x00ffcc,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide
        });
        const gas = new THREE.Mesh(gasGeo, gasMat);
        gas.position.y = 6;
        pipe.add(gas);
        meshes.exhaustStreams.push(gas);
        
        exhaustGroup.add(pipe);
    }
    group.add(exhaustGroup);

    parts.push({
        name: "Tachyon Exhaust Pipes",
        description: "Vents excess faster-than-light particles generated by the engines to prevent causal paradox buildup within the facility.",
        material: "Copper, Tachyon Gas",
        function: "Paradox venting",
        assemblyOrder: 12,
        connections: ["Gravitational Anchor Base"],
        failureEffect: "Causality loop; actions happen before they are initiated.",
        cascadeFailures: ["Operator Console"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -5, z: -25 }
    });

    // ==========================================
    // COMPONENT: QUANTUM LOCKING MECHANISM
    // ==========================================
    const lockGroup = new THREE.Group();
    lockGroup.position.y = 15;
    
    // A massive enclosing cage that locks into place
    const cageRadius = 9;
    for(let i=0; i<6; i++) {
        const cageRingGeo = new THREE.TorusGeometry(cageRadius, 0.3, 16, 64, Math.PI);
        const cageRing = new THREE.Mesh(cageRingGeo, steel);
        cageRing.rotation.y = (i / 6) * Math.PI * 2;
        cageRing.rotation.x = Math.PI / 2;
        
        // Add locking bolts
        const boltGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
        const bolt = new THREE.Mesh(boltGeo, darkSteel);
        bolt.position.set(cageRadius, 0, 0);
        cageRing.add(bolt);
        
        lockGroup.add(cageRing);
        meshes.rotators.push({ mesh: cageRing, axis: new THREE.Vector3(0, 0, 1), speed: 0.2 });
    }
    group.add(lockGroup);

    parts.push({
        name: "Quantum Locking Mechanism",
        description: "Interlocking steel rings that generate a counter-rotating gravito-magnetic field to nullify the shear stress of the temporal engines.",
        material: "Steel, Dark Steel Bolts",
        function: "Frame-dragging nullification",
        assemblyOrder: 17,
        connections: ["Central Vault"],
        failureEffect: "Tidal forces shred the central vault.",
        cascadeFailures: ["Central Vault"],
        originalPosition: { x: 0, y: 15, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 0 } // Expands radially in animation, handled in app
    });

    // ==========================================
    // COMPONENT: COOLANT SYSTEMS
    // ==========================================
    const coolantGroup = createPipeArray(0.5, 0.2, 64, tinted, 12, 40);
    coolantGroup.position.y = -2;
    group.add(coolantGroup);

    parts.push({
        name: "Quantum Coolant Systems",
        description: "Circulates liquid helium-3 mixed with exotic matter to cool the hyper-dense circuitry.",
        material: "Tinted Glass, Exotic Coolant",
        function: "Thermal regulation",
        assemblyOrder: 3,
        connections: ["Gravitational Anchor Base"],
        failureEffect: "Thermalization of the temporal engines.",
        cascadeFailures: ["Temporal Engines"],
        originalPosition: { x: 0, y: -2, z: 0 },
        explodedPosition: { x: -20, y: -10, z: 20 }
    });

    // ==========================================
    // QUIZ QUESTIONS (PhD LEVEL)
    // ==========================================
    const quizQuestions = [
        {
            question: "In the context of the Alcubierre drive metric adapted for this Time Vault, what is the required energy density configuration to sustain the temporal bubble without violating the weak energy condition, and how does the Chronosphere bypass this constraint?",
            options: [
                "Positive energy density is required; bypassed via zero-point energy harvesting.",
                "Negative energy density is required; bypassed via localized Casimir-effect tachyon fields.",
                "Infinite energy density is required; bypassed by the microscopic singularity.",
                "Zero energy density is required; bypassed through quantum tunneling."
            ],
            correctAnswer: 1,
            explanation: "To create closed timelike curves or stasis bubbles (similar to warp metrics), general relativity requires regions of negative energy density, which violates the weak energy condition. The Chronosphere achieves this using the localized Casimir effect infused with tachyons."
        },
        {
            question: "How does the Stasis Field compensate for the Hawking radiation emitted by the microscopic singularities in the Temporal Engines, preventing thermalization of the preserved object?",
            options: [
                "By freezing the radiation using absolute zero coolant.",
                "By absorbing the radiation into the dark energy steel base.",
                "By routing the thermal energy through a closed-timelike curve heat sink, returning the energy to a past state.",
                "By reflecting the radiation using a perfectly mirrored chronoton grid."
            ],
            correctAnswer: 2,
            explanation: "Hawking radiation from the singularity would instantly incinerate the vault. A closed-timelike curve heat sink allows the system to continuously dump heat into its own past, effectively nullifying the entropy increase in the present reference frame."
        },
        {
            question: "According to the holographic principle, preserving an object's exact quantum state requires storing its full boundary information. What is the Bekenstein bound of the Chronosphere's central vault assuming a radius of 2 meters?",
            options: [
                "Approximately 10^20 bits.",
                "Approximately 10^45 bits.",
                "Approximately 10^70 bits, encoded within the holographic chronoton grid.",
                "Infinite bits, as quantum states are continuous."
            ],
            correctAnswer: 2,
            explanation: "The Bekenstein bound defines the maximum amount of information required to perfectly describe a given volume of space down to the quantum level. For a 2-meter radius, this scales with the surface area in Planck units, equating to roughly 10^70 bits."
        },
        {
            question: "If a chronological protection agency were to detect the Chronosphere, what specific signature of the Cauchy horizon instability would they look for?",
            options: [
                "The emission of low-frequency gravity waves.",
                "The exponential blue-shifting of vacuum fluctuations at the stasis field boundary.",
                "The spontaneous decay of protons within the anchor base.",
                "The emission of visible neon blue light."
            ],
            correctAnswer: 1,
            explanation: "As predicted by Stephen Hawking's chronology protection conjecture, the boundary of a region permitting time travel (the Cauchy horizon) causes vacuum fluctuations to circulate and blue-shift exponentially, creating an intense, detectable energy signature."
        },
        {
            question: "The Temporal Engines exhibit a Lense-Thirring effect (frame-dragging) of tremendous magnitude. What prevents the resulting ergosphere from shredding the central vault via tidal forces?",
            options: [
                "The strength of the dark energy steel.",
                "A counter-rotating gravito-magnetic field generated by the Quantum Locking Mechanism.",
                "The tachyon exhaust pipes venting the tidal forces.",
                "The frozen particles acting as a physical buffer."
            ],
            correctAnswer: 1,
            explanation: "Frame-dragging around massive rotating objects (like the temporal engines) creates an ergosphere that forces all matter to rotate with it. The Quantum Locking Mechanism counteracts this sheer by producing an equal and opposite gravito-magnetic field, nullifying local stress."
        }
    ];

    // ==========================================
    // ANIMATION LOOP
    // ==========================================
    function animate(time, speed, animatedMeshes) {
        const t = time * speed;
        
        // 1. Rotate standard meshes (Engine rings, gear mechanisms)
        if (meshes.rotators) {
            meshes.rotators.forEach(rot => {
                rot.mesh.rotateOnAxis(rot.axis, 0.01 * rot.speed * speed);
            });
        }
        
        if (meshes.gears) {
            meshes.gears.forEach(gear => {
                gear.mesh.rotateOnAxis(gear.axis, 0.05 * gear.speed * speed);
            });
        }
        
        // 2. Complex Temporal Rings - erratic, high-speed, physics-defying rotations
        if (meshes.temporalRings) {
            meshes.temporalRings.forEach((ring, index) => {
                // Combine steady rotation with a sine wave flutter for a "glitching time" effect
                const flutter = Math.sin(t * 10 + index) * 0.05;
                ring.mesh.rotateOnAxis(ring.axis, (0.02 * ring.speed * speed) + (flutter * speed));
                
                // Pulsing scale for distortion effect
                const scaleOsc = 1 + Math.sin(t * 5 + index) * 0.02;
                ring.mesh.scale.set(scaleOsc, scaleOsc, scaleOsc);
            });
        }
        
        // 3. Hydraulics Pumping in sync with time fluctuations
        if (meshes.pistonsInner) {
            meshes.pistonsInner.forEach((piston, index) => {
                // Piston moves in and out based on a sine wave
                const move = Math.sin(t * 3 + index) * 1.5;
                // Base position + movement
                piston.mesh.position.y = piston.baseLength + move;
            });
        }
        
        // 4. Stasis Pulses - glowing elements surging with energy
        if (meshes.stasisPulses) {
            meshes.stasisPulses.forEach((pulse, index) => {
                const intensity = (Math.sin(t * 8 + index) + 1) / 2; // 0 to 1
                if(pulse.material.emissiveIntensity !== undefined) {
                    pulse.material.emissiveIntensity = 1 + (intensity * 3);
                }
            });
        }
        
        // 5. Exhaust streams flickering like plasma
        if (meshes.exhaustStreams) {
            meshes.exhaustStreams.forEach(stream => {
                // Rapid opacity changes
                if (stream.material.opacity !== undefined) {
                    stream.material.opacity = 0.3 + Math.random() * 0.4;
                }
                // Rapid emissive flickering for the conduits
                if (stream.material.emissiveIntensity !== undefined) {
                    stream.material.emissiveIntensity = 2 + Math.random() * 2;
                }
            });
        }
        
        // 6. The Frozen Particles remain COMPLETELY STILL. 
        // We explicitly DO NOT animate meshes.frozenParticles to show that time inside the stasis bubble is stopped.
    }

    return { group, parts, description, quizQuestions, animate };
}
