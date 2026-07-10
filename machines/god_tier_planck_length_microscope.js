import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // -------------------------------------------------------------------------
    // HELPER FUNCTIONS & CUSTOM MATERIALS
    // -------------------------------------------------------------------------
    const createNeon = (color, intensity) => new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: intensity,
        transparent: true,
        opacity: 0.9,
        wireframe: false,
        roughness: 0.1,
        metalness: 0.5
    });

    const neonBlue = createNeon(0x00ffff, 2.0);
    const neonPurple = createNeon(0xaa00ff, 2.5);
    const neonOrange = createNeon(0xff5500, 1.8);
    const neonGreen = createNeon(0x00ff00, 2.0);
    const quantumMaterial = createNeon(0x00ffcc, 3.0);
    quantumMaterial.wireframe = true;
    
    const exoticGlass = new THREE.MeshPhysicalMaterial({
        color: 0x88ccff,
        metalness: 0.1,
        roughness: 0.05,
        transmission: 0.9, // glass-like
        transparent: true,
        ior: 2.5, // High index of refraction for metric distortion
        thickness: 1.0
    });

    // -------------------------------------------------------------------------
    // 1. QUANTUM ISOLATION FOUNDATION
    // -------------------------------------------------------------------------
    const baseGroup = new THREE.Group();
    
    // Core Base Lathe
    const basePts = [];
    for(let i=0; i<=50; i++) {
        const y = i * 0.1;
        const radius = 10 + Math.sin(y * Math.PI) * 0.5 - (y * 0.5);
        basePts.push(new THREE.Vector2(Math.max(radius, 2), y));
    }
    const baseGeo = new THREE.LatheGeometry(basePts, 128);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseGroup.add(baseMesh);

    // Seismic Damping Hex-Pads
    const padGroup = new THREE.Group();
    for(let i=0; i<16; i++) {
        const padGeo = new THREE.CylinderGeometry(1.2, 1.5, 0.5, 6);
        const pad = new THREE.Mesh(padGeo, rubber);
        const theta = (i / 16) * Math.PI * 2;
        pad.position.set(Math.cos(theta) * 11, 0.25, Math.sin(theta) * 11);
        
        // Add tiny bolts to the pads
        for(let j=0; j<6; j++) {
            const boltGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.6, 8);
            const bolt = new THREE.Mesh(boltGeo, chrome);
            const bTheta = (j / 6) * Math.PI * 2;
            bolt.position.set(Math.cos(bTheta)*0.8, 0.1, Math.sin(bTheta)*0.8);
            pad.add(bolt);
        }
        padGroup.add(pad);
    }
    baseGroup.add(padGroup);
    
    // Sub-terrestrial Energy Siphon Ring
    const siphonGeo = new THREE.TorusGeometry(10.5, 0.3, 32, 128);
    const siphon = new THREE.Mesh(siphonGeo, copper);
    siphon.rotation.x = Math.PI / 2;
    siphon.position.y = 0.5;
    baseGroup.add(siphon);

    group.add(baseGroup);
    meshes.base = baseGroup;
    parts.push({
        name: "Quantum Isolation Foundation",
        description: "A monumental, multi-tiered foundation constructed from hyper-dense dark steel and meta-rubber. It acts as an absolute seismic and quantum decoherence dampener, establishing a localized inertial reference frame perfectly decoupled from Earth's macro-vibrations.",
        material: "Dark Steel, Meta-Rubber, Copper",
        function: "Vibration isolation and spatial anchoring",
        assemblyOrder: 1,
        connections: ["MainSupportPylons", "FusionReactorBanks"],
        failureEffect: "Quantum decoherence in the sample area leading to immediate loss of Planck-scale resolution.",
        cascadeFailures: ["CoreVacuumChamber", "HolographicProjector"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -20, z: 0}
    });

    // -------------------------------------------------------------------------
    // 2. FUSION REACTOR BANKS
    // -------------------------------------------------------------------------
    const reactorGroup = new THREE.Group();
    for(let i=0; i<4; i++) {
        const rGroup = new THREE.Group();
        
        const coreGeo = new THREE.CylinderGeometry(1.5, 1.5, 3, 32);
        const core = new THREE.Mesh(coreGeo, steel);
        core.position.y = 1.5;
        rGroup.add(core);

        // Glowing fusion plasma chamber
        const plasmaGeo = new THREE.CylinderGeometry(1.6, 1.6, 1, 32);
        const plasma = new THREE.Mesh(plasmaGeo, neonOrange);
        plasma.position.y = 1.5;
        rGroup.add(plasma);

        // Cooling ribs
        for(let j=0; j<10; j++) {
            const ribGeo = new THREE.TorusGeometry(1.7, 0.1, 16, 64);
            const rib = new THREE.Mesh(ribGeo, aluminum);
            rib.position.y = 0.5 + j * 0.22;
            rib.rotation.x = Math.PI / 2;
            rGroup.add(rib);
        }

        const theta = (i / 4) * Math.PI * 2 + Math.PI/4;
        rGroup.position.set(Math.cos(theta) * 7, 0, Math.sin(theta) * 7);
        reactorGroup.add(rGroup);
    }
    group.add(reactorGroup);
    meshes.reactors = reactorGroup;
    parts.push({
        name: "Fusion Reactor Banks",
        description: "Quad-array cold fusion reactors supplying the petawatts of power required to generate spacetime-bending gravitational waves.",
        material: "Steel, Aluminum, Plasma",
        function: "Power generation",
        assemblyOrder: 2,
        connections: ["QuantumIsolationFoundation", "EnergyConduitNetwork"],
        failureEffect: "Catastrophic power loss, rapid gravitational decompression.",
        cascadeFailures: ["PrimaryInterferometerRing"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: 30}
    });

    // -------------------------------------------------------------------------
    // 3. MAIN SUPPORT PYLONS
    // -------------------------------------------------------------------------
    const pylonGroup = new THREE.Group();
    const pylonCount = 6;
    for(let i=0; i<pylonCount; i++) {
        const pylonSubGroup = new THREE.Group();
        
        // Extruded complex shape for pylon
        const pShape = new THREE.Shape();
        pShape.moveTo(-1, 0);
        pShape.lineTo(1, 0);
        pShape.lineTo(0.5, 15);
        pShape.lineTo(-0.5, 15);
        pShape.lineTo(-1, 0);
        
        const extrudeSettings = { depth: 1, bevelEnabled: true, bevelSegments: 3, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 };
        const pGeo = new THREE.ExtrudeGeometry(pShape, extrudeSettings);
        const pylon = new THREE.Mesh(pGeo, steel);
        pylon.position.z = -0.5; // Center depth
        pylonSubGroup.add(pylon);
        
        // Internal structural trusses (X-bracing)
        for(let j=0; j<7; j++) {
            const yOffset = 2 + j * 1.8;
            const xCross1Geo = new THREE.BoxGeometry(1.5 - j*0.1, 0.1, 1.2);
            const xCross1 = new THREE.Mesh(xCross1Geo, chrome);
            xCross1.position.y = yOffset;
            xCross1.rotation.z = Math.PI / 6;
            pylonSubGroup.add(xCross1);

            const xCross2Geo = new THREE.BoxGeometry(1.5 - j*0.1, 0.1, 1.2);
            const xCross2 = new THREE.Mesh(xCross2Geo, chrome);
            xCross2.position.y = yOffset;
            xCross2.rotation.z = -Math.PI / 6;
            pylonSubGroup.add(xCross2);
        }

        // Hydraulic lift actuators alongside pylon
        const actuatorGeo = new THREE.CylinderGeometry(0.2, 0.2, 10, 16);
        const actuator = new THREE.Mesh(actuatorGeo, darkSteel);
        actuator.position.set(0, 5, 0.8);
        pylonSubGroup.add(actuator);
        
        const pistonGeo = new THREE.CylinderGeometry(0.1, 0.1, 10, 16);
        const piston = new THREE.Mesh(pistonGeo, chrome);
        piston.position.set(0, 10, 0.8);
        pylonSubGroup.add(piston);

        const theta = (i / pylonCount) * Math.PI * 2;
        pylonSubGroup.position.set(Math.cos(theta) * 5, 4.5, Math.sin(theta) * 5);
        pylonSubGroup.rotation.y = -theta + Math.PI/2;
        pylonGroup.add(pylonSubGroup);
    }
    group.add(pylonGroup);
    meshes.pylons = pylonGroup;
    parts.push({
        name: "Main Support Pylons & Hydraulics",
        description: "Six hyper-dense extruded steel pylons reinforced with chromium X-bracing. Integrated hydraulic actuators constantly adjust micro-elevations to counteract planetary tidal forces.",
        material: "Steel, Chrome",
        function: "Structural support and micro-alignment",
        assemblyOrder: 3,
        connections: ["QuantumIsolationFoundation", "InterferometerGimbal"],
        failureEffect: "Misalignment of the gravitational focal point.",
        cascadeFailures: ["CoreVacuumChamber", "SpatialDistortionLens"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 20, z: 0}
    });

    // -------------------------------------------------------------------------
    // 4. INTERFEROMETER GIMBAL ASSEMBLY
    // -------------------------------------------------------------------------
    const gimbalGroup = new THREE.Group();
    gimbalGroup.position.y = 18;

    const gimbalOuterGeo = new THREE.TorusGeometry(9, 0.5, 32, 128);
    const gimbalOuter = new THREE.Mesh(gimbalOuterGeo, darkSteel);
    gimbalOuter.rotation.x = Math.PI / 2;
    gimbalGroup.add(gimbalOuter);

    // Gimbal Mounts connecting to pylons
    for(let i=0; i<6; i++) {
        const mountGeo = new THREE.BoxGeometry(1.5, 1, 1.5);
        const mount = new THREE.Mesh(mountGeo, steel);
        const theta = (i / 6) * Math.PI * 2;
        mount.position.set(Math.cos(theta) * 9, 0, Math.sin(theta) * 9);
        mount.rotation.y = -theta;
        gimbalGroup.add(mount);
    }

    group.add(gimbalGroup);
    meshes.gimbal = gimbalGroup;
    parts.push({
        name: "Interferometer Gimbal Framework",
        description: "The stationary framework suspending the dynamic rotating rings. It acts as the physical bridge between the pylons and the gyroscopic arrays.",
        material: "Dark Steel",
        function: "Suspending rotational arrays",
        assemblyOrder: 4,
        connections: ["MainSupportPylons", "PrimaryInterferometerRing"],
        failureEffect: "Ring collision and explosive kinetic energy release.",
        cascadeFailures: ["All Rings"],
        originalPosition: {x: 0, y: 18, z: 0},
        explodedPosition: {x: 0, y: 35, z: 0}
    });

    // -------------------------------------------------------------------------
    // 5. PRIMARY INTERFEROMETER RING
    // -------------------------------------------------------------------------
    const primaryRingGroup = new THREE.Group();
    primaryRingGroup.position.y = 18;

    const pRingGeo = new THREE.TorusGeometry(8, 0.4, 64, 256);
    const pRing = new THREE.Mesh(pRingGeo, chrome);
    primaryRingGroup.add(pRing);

    // Grav-wave Emitter Nodes
    for(let i=0; i<32; i++) {
        const nodeGroup = new THREE.Group();
        const baseGeo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
        const baseMesh = new THREE.Mesh(baseGeo, copper);
        nodeGroup.add(baseMesh);

        const tipGeo = new THREE.CylinderGeometry(0, 0.3, 0.8, 16);
        const tipMesh = new THREE.Mesh(tipGeo, neonBlue);
        tipMesh.position.y = 0.8;
        nodeGroup.add(tipMesh);

        const theta = (i / 32) * Math.PI * 2;
        nodeGroup.position.set(Math.cos(theta)*8, Math.sin(theta)*8, 0);
        nodeGroup.rotation.z = theta - Math.PI/2;
        primaryRingGroup.add(nodeGroup);
    }

    group.add(primaryRingGroup);
    meshes.primaryRing = primaryRingGroup;
    parts.push({
        name: "Primary Interferometer Ring",
        description: "The massive outer gyro-ring. It spins at relativistic speeds to generate the primary high-frequency gravitational wave carrier signal.",
        material: "Chrome, Copper, Neon Emitters",
        function: "Gravitational wave generation (Carrier)",
        assemblyOrder: 5,
        connections: ["InterferometerGimbal", "SecondaryInterferometerRing"],
        failureEffect: "Loss of primary carrier signal, preventing spacetime folding.",
        cascadeFailures: ["SecondaryInterferometerRing", "TertiaryInterferometerRing"],
        originalPosition: {x: 0, y: 18, z: 0},
        explodedPosition: {x: 30, y: 18, z: 0}
    });

    // -------------------------------------------------------------------------
    // 6. SECONDARY INTERFEROMETER RING
    // -------------------------------------------------------------------------
    const secondaryRingGroup = new THREE.Group();
    secondaryRingGroup.position.y = 18;

    const sRingGeo = new THREE.TorusGeometry(6.5, 0.35, 64, 200);
    const sRing = new THREE.Mesh(sRingGeo, aluminum);
    secondaryRingGroup.add(sRing);

    // Modulation Coils
    for(let i=0; i<48; i++) {
        const coilGeo = new THREE.TorusGeometry(0.5, 0.1, 16, 32);
        const coil = new THREE.Mesh(coilGeo, neonPurple);
        const theta = (i / 48) * Math.PI * 2;
        coil.position.set(Math.cos(theta)*6.5, Math.sin(theta)*6.5, 0);
        coil.rotation.y = Math.PI / 2;
        coil.rotation.x = theta;
        secondaryRingGroup.add(coil);
    }

    group.add(secondaryRingGroup);
    meshes.secondaryRing = secondaryRingGroup;
    parts.push({
        name: "Secondary Interferometer Ring",
        description: "Rotates orthogonally to the primary ring. It modulates the carrier wave to create an interference pattern precisely tuned to the Planck length (10^-35 m).",
        material: "Aluminum, Purple Neon Coils",
        function: "Wave modulation and interference tuning",
        assemblyOrder: 6,
        connections: ["PrimaryInterferometerRing", "TertiaryInterferometerRing"],
        failureEffect: "Interference pattern misalignment, causing blurry spatial resolution.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 18, z: 0},
        explodedPosition: {x: -30, y: 18, z: 0}
    });

    // -------------------------------------------------------------------------
    // 7. TERTIARY INTERFEROMETER RING
    // -------------------------------------------------------------------------
    const tertiaryRingGroup = new THREE.Group();
    tertiaryRingGroup.position.y = 18;

    const tRingGeo = new THREE.TorusGeometry(5, 0.25, 32, 128);
    const tRing = new THREE.Mesh(tRingGeo, darkSteel);
    tertiaryRingGroup.add(tRing);

    // Focusing Mirrors
    for(let i=0; i<16; i++) {
        const mirrorGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.1, 32);
        const mirror = new THREE.Mesh(mirrorGeo, glass);
        const theta = (i / 16) * Math.PI * 2;
        mirror.position.set(Math.cos(theta)*5, Math.sin(theta)*5, 0);
        mirror.rotation.x = Math.PI / 2;
        mirror.rotation.y = theta;
        tertiaryRingGroup.add(mirror);
    }

    group.add(tertiaryRingGroup);
    meshes.tertiaryRing = tertiaryRingGroup;
    parts.push({
        name: "Tertiary Focusing Ring",
        description: "The innermost ring containing exotic glass mirrors that reflect and focus the gravitational standing waves directly into the core vacuum chamber.",
        material: "Dark Steel, Exotic Glass",
        function: "Gravitational wave focusing",
        assemblyOrder: 7,
        connections: ["SecondaryInterferometerRing", "CoreVacuumChamber"],
        failureEffect: "Waves miss the core, potentially warping the laboratory environment.",
        cascadeFailures: ["OperatorConsole"],
        originalPosition: {x: 0, y: 18, z: 0},
        explodedPosition: {x: 0, y: 18, z: -30}
    });

    // -------------------------------------------------------------------------
    // 8. CORE VACUUM CHAMBER
    // -------------------------------------------------------------------------
    const coreGroup = new THREE.Group();
    coreGroup.position.y = 18;

    // Outer Glass Sphere
    const outerSphereGeo = new THREE.SphereGeometry(3.5, 64, 64);
    const outerSphere = new THREE.Mesh(outerSphereGeo, exoticGlass);
    coreGroup.add(outerSphere);

    // Inner Faraday/Gravity Cage (Icosahedron wireframe)
    const cageGeo = new THREE.IcosahedronGeometry(3.2, 3);
    const cage = new THREE.Mesh(cageGeo, new THREE.MeshStandardMaterial({color: 0x222222, wireframe: true, wireframeLinewidth: 2}));
    coreGroup.add(cage);

    // Core Metric Compressor Nodes (Suspended inside)
    for(let i=0; i<8; i++) {
        const nodeGeo = new THREE.OctahedronGeometry(0.3, 0);
        const node = new THREE.Mesh(nodeGeo, neonOrange);
        const theta = (i / 8) * Math.PI * 2;
        node.position.set(Math.cos(theta)*2.5, Math.sin(theta)*2.5, 0);
        
        // Connect node to center with a thin beam
        const beamGeo = new THREE.CylinderGeometry(0.02, 0.02, 2.5, 8);
        const beam = new THREE.Mesh(beamGeo, chrome);
        beam.position.copy(node.position).multiplyScalar(0.5);
        beam.lookAt(0,0,0);
        beam.rotateX(Math.PI/2);
        
        coreGroup.add(node);
        coreGroup.add(beam);
    }

    group.add(coreGroup);
    meshes.coreChamber = coreGroup;
    parts.push({
        name: "Core Vacuum Containment Field",
        description: "A flawless, multi-layered spherical vacuum chamber. It maintains a perfect void, utterly devoid of baryonic matter, to prevent interference with the spacetime topology observations.",
        material: "Exotic Glass, Dark Steel Wireframe, Chrome",
        function: "Isolation of the quantum observation target",
        assemblyOrder: 8,
        connections: ["TertiaryFocusingRing", "HolographicProjector"],
        failureEffect: "Catastrophic implosion, momentary creation of a microscopic black hole.",
        cascadeFailures: ["The entire facility"],
        originalPosition: {x: 0, y: 18, z: 0},
        explodedPosition: {x: 0, y: -5, z: 20}
    });

    // -------------------------------------------------------------------------
    // 9. QUANTUM FOAM MANIFESTATION (HOLOGRAPHIC TARGET)
    // -------------------------------------------------------------------------
    const foamGroup = new THREE.Group();
    foamGroup.position.y = 18;

    // The central bubbling topological manifold
    const foamGeo = new THREE.SphereGeometry(1.2, 32, 32);
    // Save original vertices for animation
    const pos = foamGeo.attributes.position;
    const originalPos = [];
    for(let i=0; i<pos.count; i++) {
        originalPos.push(new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i)));
    }
    foamGeo.userData = { originalPos };
    
    const foamMesh = new THREE.Mesh(foamGeo, quantumMaterial);
    foamGroup.add(foamMesh);

    // Orbiting probability cloud particles
    const particleGeo = new THREE.TetrahedronGeometry(0.08, 0);
    const particles = [];
    for(let i=0; i<150; i++) {
        const p = new THREE.Mesh(particleGeo, neonGreen);
        p.position.set((Math.random()-0.5)*4, (Math.random()-0.5)*4, (Math.random()-0.5)*4);
        p.userData = {
            speed: Math.random() * 0.05 + 0.02,
            radius: Math.random() * 1.5 + 1.2,
            phaseOffset: Math.random() * Math.PI * 2,
            axis: new THREE.Vector3(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5).normalize()
        };
        particles.push(p);
        foamGroup.add(p);
    }

    group.add(foamGroup);
    meshes.foamMesh = foamMesh;
    meshes.particles = particles;
    parts.push({
        name: "Quantum Foam Manifestation",
        description: "The visual culmination of the microscope's power: a live, macroscopic holographic projection of the chaotic, bubbling topology of spacetime at 10^-35 meters.",
        material: "Photonic Construct",
        function: "Visualizing Planck-scale geometry",
        assemblyOrder: 9,
        connections: ["CoreVacuumContainmentField"],
        failureEffect: "Projection glitches, causing nausea and theoretical paradoxes in observers.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 18, z: 0},
        explodedPosition: {x: 0, y: 18, z: 30}
    });

    // -------------------------------------------------------------------------
    // 10. SPATIAL DISTORTION LENSES
    // -------------------------------------------------------------------------
    const lensGroup = new THREE.Group();
    // Top Lens
    const lensTopGeo = new THREE.CylinderGeometry(2, 2, 0.4, 64);
    const lensTop = new THREE.Mesh(lensTopGeo, exoticGlass);
    lensTop.position.set(0, 22.5, 0);
    
    const ringTopGeo = new THREE.TorusGeometry(2.1, 0.15, 16, 64);
    const ringTop = new THREE.Mesh(ringTopGeo, neonBlue);
    ringTop.position.set(0, 22.5, 0);
    ringTop.rotation.x = Math.PI/2;

    // Bottom Lens
    const lensBot = lensTop.clone();
    lensBot.position.set(0, 13.5, 0);
    const ringBot = ringTop.clone();
    ringBot.position.set(0, 13.5, 0);

    lensGroup.add(lensTop, ringTop, lensBot, ringBot);
    group.add(lensGroup);
    meshes.lenses = lensGroup;
    parts.push({
        name: "Spatial Distortion Lens Array",
        description: "Dual top and bottom lenses that clamp the metric tensor, focusing the interference pattern precisely onto the focal point.",
        material: "Exotic Glass, Neon Modulators",
        function: "Metric clamping and focusing",
        assemblyOrder: 10,
        connections: ["CoreVacuumContainmentField", "InterferometerGimbal"],
        failureEffect: "Loss of focal lock; the observation point drifts wildly through local space.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -25, z: 0}
    });

    // -------------------------------------------------------------------------
    // 11. CRYOGENIC COOLING RADIATORS
    // -------------------------------------------------------------------------
    const coolingGroup = new THREE.Group();
    for(let i=0; i<8; i++) {
        const radiatorSub = new THREE.Group();
        
        const mainBlockGeo = new THREE.BoxGeometry(1.5, 6, 2);
        const mainBlock = new THREE.Mesh(mainBlockGeo, copper);
        radiatorSub.add(mainBlock);

        // Thousands of tiny micro-fins simulated by dense geometry
        for(let j=0; j<40; j++) {
            const finGeo = new THREE.BoxGeometry(1.8, 0.05, 2.2);
            const fin = new THREE.Mesh(finGeo, aluminum);
            fin.position.y = -2.9 + j * 0.15;
            radiatorSub.add(fin);
        }

        // Coolant pipes entering block
        const pipeGeo = new THREE.CylinderGeometry(0.2, 0.2, 2, 16);
        const pipe1 = new THREE.Mesh(pipeGeo, rubber);
        pipe1.position.set(0, 3.5, 0);
        radiatorSub.add(pipe1);

        const theta = (i / 8) * Math.PI * 2;
        radiatorSub.position.set(Math.cos(theta) * 11, 7, Math.sin(theta) * 11);
        radiatorSub.rotation.y = -theta;
        coolingGroup.add(radiatorSub);
    }
    group.add(coolingGroup);
    meshes.radiators = coolingGroup;
    parts.push({
        name: "Cryogenic Cooling Radiators",
        description: "Massive arrays of copper and aluminum micro-fins circulating liquid Helium-3 to maintain the superconducting state of the interferometer rings.",
        material: "Copper, Aluminum, Rubber",
        function: "Extreme thermal dissipation",
        assemblyOrder: 11,
        connections: ["QuantumIsolationFoundation", "CoolantDistributionPipes"],
        failureEffect: "Superconducting quench, massive thermal explosion.",
        cascadeFailures: ["All Rings", "InterferometerGimbal"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 25, y: 7, z: 25}
    });

    // -------------------------------------------------------------------------
    // 12. COOLANT DISTRIBUTION PIPES
    // -------------------------------------------------------------------------
    const pipesGroup = new THREE.Group();
    // Generate complex intertwined spline paths for pipes
    for(let i=0; i<8; i++) {
        const theta1 = (i / 8) * Math.PI * 2;
        const theta2 = ((i+1.5) / 8) * Math.PI * 2;
        
        const path = new THREE.CatmullRomCurve3([
            new THREE.Vector3(Math.cos(theta1)*11, 10.5, Math.sin(theta1)*11), // top of radiator
            new THREE.Vector3(Math.cos(theta1)*7, 13, Math.sin(theta1)*7),
            new THREE.Vector3(Math.cos(theta2)*4, 16, Math.sin(theta2)*4),
            new THREE.Vector3(Math.cos(theta2)*3, 18, Math.sin(theta2)*3)  // into gimbal
        ]);
        const tubeGeo = new THREE.TubeGeometry(path, 64, 0.25, 12, false);
        const tube = new THREE.Mesh(tubeGeo, plastic);
        pipesGroup.add(tube);
    }
    group.add(pipesGroup);
    parts.push({
        name: "Coolant Distribution Pipes",
        description: "Intricately routed meta-plastic tubing carrying ultra-cold fermion fluid from the radiators to the rotational arrays.",
        material: "Meta-Plastic",
        function: "Coolant transport",
        assemblyOrder: 12,
        connections: ["CryogenicCoolingRadiators", "InterferometerGimbal"],
        failureEffect: "Coolant leak, localized absolute-zero freezing of the laboratory.",
        cascadeFailures: ["InterferometerGimbal"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -25, y: 15, z: -25}
    });

    // -------------------------------------------------------------------------
    // 13. ENERGY CONDUIT NETWORK
    // -------------------------------------------------------------------------
    const conduitGroup = new THREE.Group();
    for(let i=0; i<120; i++) {
        // Random chaotic but sweeping wiring from reactors to gimbal
        const rAngle = Math.random() * Math.PI * 2;
        const rRad = 6 + Math.random() * 3;
        const start = new THREE.Vector3(Math.cos(rAngle)*rRad, 2, Math.sin(rAngle)*rRad);
        const mid = new THREE.Vector3(Math.cos(rAngle+0.5)*rRad*0.8, 10 + Math.random()*4, Math.sin(rAngle+0.5)*rRad*0.8);
        const endAngle = Math.random() * Math.PI * 2;
        const end = new THREE.Vector3(Math.cos(endAngle)*2, 17, Math.sin(endAngle)*2);
        
        const path = new THREE.CatmullRomCurve3([start, mid, end]);
        const wireGeo = new THREE.TubeGeometry(path, 32, 0.03, 5, false);
        const mat = (i%3===0) ? copper : (i%3===1 ? rubber : plastic);
        const wire = new THREE.Mesh(wireGeo, mat);
        conduitGroup.add(wire);
    }
    group.add(conduitGroup);
    parts.push({
        name: "Superconducting Conduit Network",
        description: "Thousands of individual superconducting wires linking the fusion reactors to the primary emitters.",
        material: "Copper, Rubber, Plastic",
        function: "Power routing",
        assemblyOrder: 13,
        connections: ["FusionReactorBanks", "InterferometerGimbal"],
        failureEffect: "Short circuit, arcing petawatts of energy across the room.",
        cascadeFailures: ["PrimaryInterferometerRing"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 10, z: 25}
    });

    // -------------------------------------------------------------------------
    // 14. OPERATOR CONTROL DECK
    // -------------------------------------------------------------------------
    const deckGroup = new THREE.Group();
    
    // Main Desk
    const deskGeo = new THREE.BoxGeometry(8, 0.4, 3);
    const desk = new THREE.Mesh(deskGeo, darkSteel);
    desk.position.set(0, 6, 14);
    desk.rotation.x = 0.05;
    deckGroup.add(desk);

    // Support pillars for desk
    const leg1Geo = new THREE.CylinderGeometry(0.2, 0.2, 6, 16);
    const leg1 = new THREE.Mesh(leg1Geo, steel);
    leg1.position.set(-3.5, 3, 14);
    deckGroup.add(leg1);
    
    const leg2 = leg1.clone();
    leg2.position.set(3.5, 3, 14);
    deckGroup.add(leg2);

    // Holographic Displays
    const screenCount = 5;
    for(let i=0; i<screenCount; i++) {
        const screenGeo = new THREE.PlaneGeometry(2, 1.2);
        const screen = new THREE.Mesh(screenGeo, neonBlue);
        const xPos = -4 + (i * 2);
        const zCurve = 13.5 - Math.sin((i / (screenCount-1)) * Math.PI) * 1.5;
        screen.position.set(xPos, 7.5, zCurve);
        
        // Angle screens towards center operator
        screen.lookAt(0, 7, 16);
        deckGroup.add(screen);
    }

    // Keyboards and switches
    for(let i=0; i<3; i++) {
        const keysGeo = new THREE.BoxGeometry(1.5, 0.1, 0.6);
        const keys = new THREE.Mesh(keysGeo, plastic);
        keys.position.set(-2 + i*2, 6.2, 14.5);
        keys.rotation.x = 0.1;
        deckGroup.add(keys);
    }

    group.add(deckGroup);
    parts.push({
        name: "Observer Control Deck",
        description: "The primary terminal for the researcher. Equipped with 5-axis holographic displays feeding raw topological data and vital system metrics.",
        material: "Dark Steel, Plastic, Neon Displays",
        function: "User interface and data observation",
        assemblyOrder: 14,
        connections: ["QuantumIsolationFoundation", "EnergyConduitNetwork"],
        failureEffect: "Inability to read data or shut down the machine safely.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 5, z: 35}
    });

    // -------------------------------------------------------------------------
    // 15. DIMENSIONAL FOCAL DIAL
    // -------------------------------------------------------------------------
    const dialGroup = new THREE.Group();
    
    const dialBaseGeo = new THREE.CylinderGeometry(0.8, 0.9, 0.4, 32);
    const dialBase = new THREE.Mesh(dialBaseGeo, chrome);
    dialGroup.add(dialBase);
    
    // Grips on dial
    for(let i=0; i<12; i++) {
        const gripGeo = new THREE.BoxGeometry(0.1, 0.45, 0.2);
        const grip = new THREE.Mesh(gripGeo, rubber);
        const theta = (i / 12) * Math.PI * 2;
        grip.position.set(Math.cos(theta)*0.85, 0, Math.sin(theta)*0.85);
        grip.rotation.y = -theta;
        dialGroup.add(grip);
    }

    // Glowing indicator
    const indGeo = new THREE.BoxGeometry(0.1, 0.42, 0.6);
    const ind = new THREE.Mesh(indGeo, neonOrange);
    ind.position.z = 0.6;
    dialGroup.add(ind);

    dialGroup.position.set(0, 6.3, 14.2);
    dialGroup.rotation.x = 0.1;
    group.add(dialGroup);
    meshes.dial = dialGroup;
    parts.push({
        name: "Dimensional Focal Dial",
        description: "A heavily shielded, mechanically direct-linked analog dial. It allows the operator to shift the gravitational focal length into Calabi-Yau manifolds (extra spatial dimensions).",
        material: "Chrome, Rubber, Neon",
        function: "Higher-dimensional focusing",
        assemblyOrder: 15,
        connections: ["ObserverControlDeck"],
        failureEffect: "Focus gets stuck in a 5th-dimensional pocket, returning anomalous non-Euclidean data.",
        cascadeFailures: ["QuantumFoamManifestation"],
        originalPosition: {x: 0, y: 6.3, z: 14.2},
        explodedPosition: {x: 5, y: 8, z: 20}
    });

    // -------------------------------------------------------------------------
    // 16. HARMONIC STABILIZER RODS
    // -------------------------------------------------------------------------
    const rodsGroup = new THREE.Group();
    for(let i=0; i<4; i++) {
        const rodSub = new THREE.Group();
        
        const rodGeo = new THREE.CylinderGeometry(0.15, 0.15, 20, 16);
        const rod = new THREE.Mesh(rodGeo, chrome);
        rodSub.add(rod);

        // Ring pulses along the rod
        for(let j=0; j<5; j++) {
            const ringGeo = new THREE.TorusGeometry(0.25, 0.05, 16, 32);
            const ring = new THREE.Mesh(ringGeo, neonPurple);
            ring.position.y = -8 + j*4;
            ring.rotation.x = Math.PI/2;
            rodSub.add(ring);
        }

        const theta = (i / 4) * Math.PI * 2 + Math.PI/4;
        rodSub.position.set(Math.cos(theta)*4, 18, Math.sin(theta)*4);
        rodsGroup.add(rodSub);
    }
    group.add(rodsGroup);
    meshes.rods = rodsGroup;
    parts.push({
        name: "Harmonic Stabilizer Rods",
        description: "Four massive chromium rods passing completely through the gimbal assembly. They suppress destructive resonance cascades generated by the overlapping gravity waves.",
        material: "Chrome, Neon Pulses",
        function: "Resonance dampening",
        assemblyOrder: 16,
        connections: ["QuantumIsolationFoundation", "InterferometerGimbal"],
        failureEffect: "Resonance cascade, shaking the machine apart at the subatomic level.",
        cascadeFailures: ["All Structural Components"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 40, z: 0}
    });


    const description = "The Ultra God Tier Planck Length Microscope is humanity's most ambitious construct. By utilizing converging beams of ultra-high-frequency gravitational waves generated by massive, spinning interferometry arrays, it literally compresses the local metric tensor of spacetime. This allows researchers to observe the fundamental, bubbling 'quantum foam' at scales of 10^-35 meters. Powered by quad-fusion reactors and cooled by sprawling cryogenic systems, it peers into the very fabric of reality.";

    const quizQuestions = [
        {
            question: "At the Planck scale (10^-35 meters), classical general relativity breaks down and spacetime is theorized to have a highly turbulent, complex topology. What is the standard term for this?",
            options: ["String Manifold", "Quantum Foam", "Hawking Radiation", "Cosmic Microwave Background"],
            correct: 1
        },
        {
            question: "The microscope utilizes 'Gravitational Wave Interferometry'. In physics, what propagates these gravitational waves?",
            options: ["Exchange of gravitons or ripples in the curvature of spacetime itself", "Photons traveling through a dense medium", "Fluctuations in the electromagnetic field", "Magnetic monopoles oscillating"],
            correct: 0
        },
        {
            question: "Why does theoretically probing smaller and smaller distance scales require increasingly larger amounts of energy (e.g., using massive fusion reactors)?",
            options: ["Because E=mc^2 states mass increases with distance.", "Because wavelength is inversely proportional to momentum/energy (de Broglie relation).", "Because shorter distances have higher friction.", "Because quarks repel each other more at larger distances."],
            correct: 1
        },
        {
            question: "If the 'Dimensional Focal Dial' shifts the focus into compactified extra dimensions, which string theory concept describes the 6-dimensional shapes these extra dimensions might take?",
            options: ["Minkowski space", "Schwarzschild geometry", "Calabi-Yau manifolds", "Hilbert space"],
            correct: 2
        },
        {
            question: "A critical failure of the containment field warns of 'micro-black hole formation'. What determines the minimum radius (Schwarzschild radius) at which a given mass will collapse into a black hole?",
            options: ["r = 2GM / c^2", "r = h / p", "r = G m1 m2 / r^2", "r = mc^2"],
            correct: 0
        }
    ];

    let timeObj = { t: 0 };

    const animate = (delta, speed, meshesObj = meshes) => {
        timeObj.t += delta * speed;
        const t = timeObj.t;

        // 1. Extreme Gyroscopic Ring Rotations
        if (meshesObj.primaryRing) {
            meshesObj.primaryRing.rotation.y = t * 2.5;
            // Introduce a slight wobble indicating immense torque
            meshesObj.primaryRing.rotation.z = Math.sin(t * 1.5) * 0.05;
        }
        if (meshesObj.secondaryRing) {
            meshesObj.secondaryRing.rotation.x = t * 3.2;
            meshesObj.secondaryRing.rotation.z = Math.cos(t * 1.2) * 0.08;
        }
        if (meshesObj.tertiaryRing) {
            // Counter-rotation
            meshesObj.tertiaryRing.rotation.y = -t * 4.1;
            meshesObj.tertiaryRing.rotation.x = Math.sin(t * 2.0) * 0.1;
        }

        // 2. Quantum Foam Topological Animation
        if (meshesObj.foamMesh && meshesObj.foamMesh.geometry) {
            const geo = meshesObj.foamMesh.geometry;
            const pos = geo.attributes.position;
            const orig = geo.userData.originalPos;
            
            for(let i=0; i<pos.count; i++) {
                const vertex = orig[i];
                
                // Complex 3D noise/interference simulation for the bubbling foam
                // using intersecting sine waves across multiple axes
                const noiseX = Math.sin(vertex.y * 6 + t * 8) * 0.15 + Math.cos(vertex.z * 3 - t * 4) * 0.05;
                const noiseY = Math.cos(vertex.z * 6 + t * 7) * 0.15 + Math.sin(vertex.x * 3 + t * 5) * 0.05;
                const noiseZ = Math.sin(vertex.x * 6 + t * 9) * 0.15 + Math.cos(vertex.y * 3 - t * 6) * 0.05;
                
                pos.setXYZ(i, vertex.x + noiseX, vertex.y + noiseY, vertex.z + noiseZ);
            }
            pos.needsUpdate = true;
            
            // Slow macroscopic drift of the entire foam bubble
            meshesObj.foamMesh.rotation.y = t * 0.3;
            meshesObj.foamMesh.rotation.x = t * 0.2;
        }

        // 3. Probability Cloud Particles Orbiting
        if (meshesObj.particles) {
            meshesObj.particles.forEach((p, idx) => {
                const ud = p.userData;
                // Complex orbital mechanics simulating probability distributions
                const angle = t * ud.speed * 15 + ud.phaseOffset;
                
                // Base orbit
                let x = Math.cos(angle) * ud.radius;
                let z = Math.sin(angle) * ud.radius;
                let y = Math.sin(angle * 2.5) * (ud.radius * 0.5); // figure-8-like height variation
                
                // Apply the random axis tilt
                const vec = new THREE.Vector3(x, y, z);
                vec.applyAxisAngle(ud.axis, ud.phaseOffset);
                
                p.position.copy(vec);
                
                // Pulsing size based on "probability density"
                const scale = 1 + Math.sin(t * 10 + idx) * 0.5;
                p.scale.set(scale, scale, scale);
            });
        }

        // 4. Lens Clamping / Pulsing
        if (meshesObj.lenses) {
            // Lenses subtly moving closer and further to 'focus'
            const focusShift = Math.sin(t * 2) * 0.5;
            
            // Assuming lenses[0] is top, lenses[2] is bottom based on creation order
            if(meshesObj.lenses.children.length >= 4) {
                // Top Lens and Ring
                meshesObj.lenses.children[0].position.y = 22.5 + focusShift;
                meshesObj.lenses.children[1].position.y = 22.5 + focusShift;
                // Bottom Lens and Ring
                meshesObj.lenses.children[2].position.y = 13.5 - focusShift;
                meshesObj.lenses.children[3].position.y = 13.5 - focusShift;
            }
        }

        // 5. Harmonic Stabilizer Rods Vibration
        if (meshesObj.rods) {
            meshesObj.rods.children.forEach((rodSub, idx) => {
                // Extremely high frequency micro-vibration
                const microVibe = Math.sin(t * 50 + idx) * 0.05;
                rodSub.position.y = 18 + microVibe;
                
                // Animate the neon pulses along the rod
                rodSub.children.forEach((child, cIdx) => {
                    if(cIdx > 0) { // skip the rod itself (index 0)
                        const offset = (t * 5 + cIdx) % 16;
                        child.position.y = -8 + offset;
                    }
                });
            });
        }

        // 6. Dimensional Focal Dial Auto-Calibration
        if (meshesObj.dial) {
            // Dial spins erratically as it hunts for dimensional locks
            meshesObj.dial.rotation.y = Math.sin(t * 3) * Math.cos(t * 1.5) * Math.PI;
        }
        
        // 7. Structural Stress Breathing (Pylons)
        if (meshesObj.pylons) {
            // The immense gravitational forces cause macro-scale flexing of the steel
            const stretch = 1 + Math.sin(t * 4) * 0.005;
            meshesObj.pylons.scale.set(1, stretch, 1);
        }

        // 8. Fusion Reactor Core Pulsing
        if (meshesObj.reactors) {
            meshesObj.reactors.children.forEach((reactor, idx) => {
                // reactor.children[1] is the plasma core
                if(reactor.children[1]) {
                    const pulse = 1 + Math.random() * 0.1 + Math.sin(t * 20 + idx) * 0.1;
                    reactor.children[1].scale.set(pulse, 1, pulse);
                }
            });
        }
    };

    return { group, parts, description, quizQuestions, animate };
}
