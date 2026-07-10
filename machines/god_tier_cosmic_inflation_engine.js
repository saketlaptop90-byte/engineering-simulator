import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

/**
 * GOD TIER COSMIC INFLATION ENGINE
 * 
 * WARNING: The manipulation of the inflaton scalar field within a localized laboratory frame
 * presents existential risks including, but not limited to: false vacuum decay, runaway exponential 
 * spatial expansion, spontaneous symmetry breaking of local physical laws, and total annihilation 
 * of the host universe.
 * 
 * Proceed with absolute caution.
 */

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // =================================================================================================
    // 1. HYPER-ADVANCED METAMATERIALS & COSMIC SHADERS
    // =================================================================================================
    
    const neutroniumAlloy = new THREE.MeshStandardMaterial({
        color: 0x0a0a0a,
        roughness: 0.8,
        metalness: 0.9,
        wireframe: false
    });

    const falseVacuumMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x000000,
        emissive: 0x220044,
        emissiveIntensity: 3.5,
        transmission: 0.95,
        opacity: 1,
        transparent: true,
        roughness: 0.05,
        ior: 2.5,
        side: THREE.DoubleSide
    });

    const intenseEnergyMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x00ffff,
        emissiveIntensity: 8.0,
        wireframe: true,
        transparent: true,
        opacity: 0.8
    });

    const chronosMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        emissive: 0xaa7700,
        emissiveIntensity: 2.0,
        wireframe: false,
        metalness: 1.0,
        roughness: 0.2
    });

    const spaceTimeGridMaterial = new THREE.LineBasicMaterial({
        color: 0x00ffcc,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    const darkEnergyMaterial = new THREE.MeshStandardMaterial({
        color: 0x110033,
        emissive: 0x330066,
        emissiveIntensity: 4.0,
        transparent: true,
        opacity: 0.9,
        metalness: 0.5,
        roughness: 0.1
    });

    const plasmaMaterial = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 5.0,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
    });

    const tachyonMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 10.0,
        transparent: true,
        opacity: 0.5
    });

    const supergravityMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000,
        emissive: 0x000000,
        roughness: 0.0,
        metalness: 1.0,
        envMapIntensity: 2.0
    });

    const crystalCoreMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 1.0,
        opacity: 1,
        metalness: 0,
        roughness: 0,
        ior: 2.0,
        thickness: 5.0,
        emissive: 0x00aaff,
        emissiveIntensity: 1.0
    });

    const exoticMatterMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x003300,
        emissiveIntensity: 1.5,
        wireframe: true,
        roughness: 0.4
    });

    // =================================================================================================
    // 2. MONOLITHIC CONTAINMENT BASE & ANCHORS
    // =================================================================================================

    // 2.1 The Massive Base Platform (LatheGeometry for perfectly swept futuristic curves)
    const basePoints = [];
    for (let i = 0; i <= 100; i++) {
        const t = i / 100;
        const radius = (Math.sin(t * Math.PI) * 15 + 30) * (1 - t * 0.3);
        const height = -25 + t * 15;
        basePoints.push(new THREE.Vector2(radius, height));
    }
    const baseGeom = new THREE.LatheGeometry(basePoints, 256);
    const baseMesh = new THREE.Mesh(baseGeom, neutroniumAlloy);
    group.add(baseMesh);
    meshes.base = baseMesh;

    // 2.2 Base Detailing (Hexagonal Grid Plates on top of the base)
    const hexGroup = new THREE.Group();
    const hexGeom = new THREE.CylinderGeometry(0.9, 0.9, 0.5, 6);
    for (let x = -25; x <= 25; x += 2) {
        for (let z = -25; z <= 25; z += 2) {
            if (x * x + z * z < 500) {
                const hex = new THREE.Mesh(hexGeom, darkSteel);
                hex.position.set(x + (Math.abs(z) % 4 === 0 ? 1 : 0), -10.25, z);
                hexGroup.add(hex);
            }
        }
    }
    group.add(hexGroup);
    meshes.hexPlates = hexGroup;

    // 2.3 Singularity Anchors (8 massive obelisks that lock the engine to the current dimension)
    const anchorGroup = new THREE.Group();
    const anchorGeom = new THREE.CylinderGeometry(2, 6, 40, 8);
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const anchor = new THREE.Mesh(anchorGeom, darkSteel);
        anchor.position.set(Math.cos(angle) * 35, 5, Math.sin(angle) * 35);
        anchor.rotation.x = -Math.PI / 6;
        anchor.rotation.y = -angle;
        
        // Inner glowing core of the anchor
        const anchorCoreGeom = new THREE.CylinderGeometry(0.5, 1.5, 42, 8);
        const anchorCore = new THREE.Mesh(anchorCoreGeom, intenseEnergyMaterial);
        anchor.add(anchorCore);

        // Intricate hydraulic bracing for each anchor
        const braceGeom = new THREE.CylinderGeometry(0.5, 0.5, 20, 16);
        const brace1 = new THREE.Mesh(braceGeom, steel);
        brace1.position.set(0, -10, -5);
        brace1.rotation.x = Math.PI / 4;
        anchor.add(brace1);

        const brace2 = new THREE.Mesh(braceGeom, steel);
        brace2.position.set(0, -10, 5);
        brace2.rotation.x = -Math.PI / 4;
        anchor.add(brace2);

        anchorGroup.add(anchor);
    }
    group.add(anchorGroup);
    meshes.anchors = anchorGroup;

    // =================================================================================================
    // 3. INFLATON GENERATOR CORE & FALSE VACUUM CHAMBER
    // =================================================================================================

    // 3.1 The False Vacuum Chamber (Highly tessellated Icosahedron)
    const vacuumGeom = new THREE.IcosahedronGeometry(12, 5);
    const vacuumMesh = new THREE.Mesh(vacuumGeom, falseVacuumMaterial);
    vacuumMesh.position.set(0, 15, 0);
    group.add(vacuumMesh);
    meshes.falseVacuum = vacuumMesh;

    // 3.2 The Inflaton Crystal Core (Inside the vacuum chamber)
    const crystalGeom = new THREE.OctahedronGeometry(4, 2);
    const crystalMesh = new THREE.Mesh(crystalGeom, crystalCoreMaterial);
    crystalMesh.position.set(0, 15, 0);
    group.add(crystalMesh);
    meshes.crystalCore = crystalMesh;

    // 3.3 Quantum Fluctuator Rings (Nested TorusKnots surrounding the chamber)
    const ringGroup = new THREE.Group();
    ringGroup.position.set(0, 15, 0);
    
    const ring1Geom = new THREE.TorusKnotGeometry(14, 0.5, 256, 32, 2, 3);
    const ring1 = new THREE.Mesh(ring1Geom, chrome);
    ringGroup.add(ring1);
    
    const ring2Geom = new THREE.TorusKnotGeometry(16, 0.2, 256, 32, 3, 4);
    const ring2 = new THREE.Mesh(ring2Geom, chronosMaterial);
    ring2.rotation.x = Math.PI / 2;
    ringGroup.add(ring2);
    
    const ring3Geom = new THREE.TorusKnotGeometry(18, 0.8, 256, 32, 1, 5);
    const ring3 = new THREE.Mesh(ring3Geom, darkEnergyMaterial);
    ring3.rotation.y = Math.PI / 2;
    ringGroup.add(ring3);

    group.add(ringGroup);
    meshes.quantumRings = ringGroup;

    // =================================================================================================
    // 4. SPACE-TIME FABRIC MATRIX (The visual representation of space tearing)
    // =================================================================================================

    const gridGeom = new THREE.BufferGeometry();
    const gridPositions = [];
    const gridSize = 40;
    const gridSteps = 24;
    const stepSize = (gridSize * 2) / gridSteps;
    
    for(let x = -gridSize; x <= gridSize; x += stepSize) {
        for(let y = -gridSize; y <= gridSize; y += stepSize) {
            for(let z = -gridSize; z <= gridSize; z += stepSize) {
                // Horizontal lines
                if (x < gridSize) {
                    gridPositions.push(x, y + 15, z, x + stepSize, y + 15, z);
                }
                // Vertical lines
                if (y < gridSize) {
                    gridPositions.push(x, y + 15, z, x, y + stepSize + 15, z);
                }
                // Depth lines
                if (z < gridSize) {
                    gridPositions.push(x, y + 15, z, x, y + 15, z + stepSize);
                }
            }
        }
    }
    gridGeom.setAttribute('position', new THREE.Float32BufferAttribute(gridPositions, 3));
    const spaceGrid = new THREE.LineSegments(gridGeom, spaceTimeGridMaterial);
    group.add(spaceGrid);
    meshes.spaceGrid = spaceGrid;
    meshes.originalGridPositions = new Float32Array(gridPositions); // Store original for morphing

    // =================================================================================================
    // 5. DARK ENERGY INJECTORS & PLASMA CONDUITS
    // =================================================================================================

    const injectorGroup = new THREE.Group();
    const conduitGroup = new THREE.Group();
    
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        
        // Injector Housing
        const injGeom = new THREE.CylinderGeometry(1.5, 2.5, 15, 12);
        const injector = new THREE.Mesh(injGeom, steel);
        injector.position.set(Math.cos(angle) * 22, -5, Math.sin(angle) * 22);
        injector.lookAt(new THREE.Vector3(0, 15, 0));
        injector.rotateX(Math.PI / 2);
        
        // Emissive Injector Core
        const injCoreGeom = new THREE.CylinderGeometry(0.8, 0.8, 16, 12);
        const injCore = new THREE.Mesh(injCoreGeom, plasmaMaterial);
        injector.add(injCore);
        
        injectorGroup.add(injector);

        // Complex Plasma Conduits (TubeGeometry along a spline)
        class CustomSinCurve extends THREE.Curve {
            constructor(scale = 1) {
                super();
                this.scale = scale;
            }
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                const tx = Math.cos(angle) * (22 + t * 10);
                const ty = -10 - Math.sin(t * Math.PI) * 5;
                const tz = Math.sin(angle) * (22 + t * 10);
                return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
            }
        }
        const path = new CustomSinCurve(1);
        const tubeGeom = new THREE.TubeGeometry(path, 64, 0.6, 8, false);
        const tubeMesh = new THREE.Mesh(tubeGeom, glass);
        
        // Inner plasma stream
        const innerTubeGeom = new THREE.TubeGeometry(path, 64, 0.3, 8, false);
        const innerTubeMesh = new THREE.Mesh(innerTubeGeom, tachyonMaterial);
        tubeMesh.add(innerTubeMesh);

        conduitGroup.add(tubeMesh);
    }
    group.add(injectorGroup);
    group.add(conduitGroup);
    meshes.injectors = injectorGroup;
    meshes.conduits = conduitGroup;

    // =================================================================================================
    // 6. DIMENSIONAL HEAT SINKS (Extreme Geometric Complexity)
    // =================================================================================================

    const heatSinkGroup = new THREE.Group();
    const sinkCount = 144;
    for (let i = 0; i < sinkCount; i++) {
        const angle = (i / sinkCount) * Math.PI * 2;
        // Extruded custom shape for high-tech look
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.lineTo(6, 0);
        shape.lineTo(8, 4);
        shape.lineTo(4, 12);
        shape.lineTo(0, 6);
        shape.lineTo(0, 0);
        
        const extrudeSettings = { depth: 0.2, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.1, bevelThickness: 0.1 };
        const hGeom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const hMesh = new THREE.Mesh(hGeom, copper);
        
        hMesh.position.set(Math.cos(angle) * 30, -20, Math.sin(angle) * 30);
        hMesh.rotation.y = -angle + Math.PI/2;
        hMesh.rotation.x = Math.PI / 12;
        
        // Add tiny cooling fins to each heat sink
        for(let j=0; j<5; j++) {
            const finGeom = new THREE.BoxGeometry(0.1, 10, 2);
            const fin = new THREE.Mesh(finGeom, aluminum);
            fin.position.set(2, 6, 0.5 + j * 0.4);
            hMesh.add(fin);
        }

        heatSinkGroup.add(hMesh);
    }
    group.add(heatSinkGroup);
    meshes.heatSinks = heatSinkGroup;

    // =================================================================================================
    // 7. SUPERGRAVITY TORUS & MAGNETIC CONFINEMENT COILS
    // =================================================================================================

    const torusGeom = new THREE.TorusGeometry(28, 3, 64, 128);
    const torusMesh = new THREE.Mesh(torusGeom, supergravityMaterial);
    torusMesh.position.set(0, -5, 0);
    torusMesh.rotation.x = Math.PI / 2;
    group.add(torusMesh);
    meshes.supergravityTorus = torusMesh;

    const coilGroup = new THREE.Group();
    for(let i=0; i<36; i++) {
        const angle = (i / 36) * Math.PI * 2;
        const coilGeom = new THREE.TorusGeometry(3.5, 0.4, 16, 32);
        const coilMesh = new THREE.Mesh(coilGeom, chrome);
        coilMesh.position.set(Math.cos(angle) * 28, -5, Math.sin(angle) * 28);
        coilMesh.rotation.y = -angle;
        coilMesh.rotation.x = Math.PI / 2;
        coilGroup.add(coilMesh);
    }
    group.add(coilGroup);
    meshes.magneticCoils = coilGroup;

    // =================================================================================================
    // 8. CONTROL OBELISK & SCALAR FIELD RESONATORS
    // =================================================================================================

    const obeliskGeom = new THREE.CylinderGeometry(0.1, 3, 30, 4);
    const obeliskMesh = new THREE.Mesh(obeliskGeom, neutroniumAlloy);
    obeliskMesh.position.set(0, -5, 45);
    
    // Obelisk Control Screen (Glowing)
    const screenGeom = new THREE.PlaneGeometry(3, 10);
    const screenMesh = new THREE.Mesh(screenGeom, new THREE.MeshStandardMaterial({
        color: 0x000000, emissive: 0x00ff00, emissiveIntensity: 2.0, side: THREE.DoubleSide
    }));
    screenMesh.position.set(0, 5, 1.55);
    obeliskMesh.add(screenMesh);
    
    group.add(obeliskMesh);
    meshes.controlObelisk = obeliskMesh;

    const resonatorGroup = new THREE.Group();
    const resGeom = new THREE.BoxGeometry(2, 8, 2);
    for(let i=0; i<6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const res = new THREE.Mesh(resGeom, exoticMatterMaterial);
        res.position.set(Math.cos(angle) * 10, 25, Math.sin(angle) * 10);
        resonatorGroup.add(res);
    }
    group.add(resonatorGroup);
    meshes.resonators = resonatorGroup;

    // =================================================================================================
    // 9. COSMIC HORIZON SHELL (The outer boundary preventing universal collapse)
    // =================================================================================================

    const horizonGeom = new THREE.SphereGeometry(60, 64, 64);
    const horizonMat = new THREE.MeshStandardMaterial({
        color: 0x000011,
        transparent: true,
        opacity: 0.15,
        wireframe: true,
        emissive: 0x000033,
        emissiveIntensity: 0.5,
        side: THREE.BackSide
    });
    const horizonMesh = new THREE.Mesh(horizonGeom, horizonMat);
    group.add(horizonMesh);
    meshes.horizonShell = horizonMesh;

    // =================================================================================================
    // 10. PART DEFINITIONS (MASSIVE LORE & FUNCTIONALITY)
    // =================================================================================================

    parts.push({
        name: "Monolithic Containment Base",
        description: "A super-massive structure constructed from hyper-dense neutronium alloy. It provides absolute spatial anchoring to prevent the engine from being torn apart by its own localized spatial expansion.",
        material: "Neutronium Alloy / Dark Steel",
        function: "Spatial Anchoring & Structural Integrity",
        assemblyOrder: 1,
        connections: ["Singularity Anchors", "Supergravity Torus"],
        failureEffect: "Engine dislodges from baseline reality, expanding infinitely into the multiverse.",
        cascadeFailures: ["Total existential collapse", "Vacuum decay propagation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -50, z: 0 }
    });

    parts.push({
        name: "Singularity Anchors",
        description: "Eight massive obelisks utilizing microscopic primordial black holes to lock the engine's reference frame to the host dimension, resisting the sheer force of creating new spacetime.",
        material: "Dark Steel / Intense Plasma Core",
        function: "Dimensional Tethering",
        assemblyOrder: 2,
        connections: ["Monolithic Containment Base", "Magnetic Confinement Coils"],
        failureEffect: "Spacetime shear forces tear the laboratory and surrounding planet into fundamental particles.",
        cascadeFailures: ["Gravitational tidal disruption"],
        originalPosition: { x: 0, y: 5, z: 0 },
        explodedPosition: { x: 0, y: 10, z: 0 } // Explodes radially outward in animation logic
    });

    parts.push({
        name: "False Vacuum Chamber",
        description: "A highly tessellated icosahedron field that encapsulates a region of spacetime artificially held in a false vacuum state, poised on the precipice of a phase transition.",
        material: "Metamaterial / Emissive Void",
        function: "Inflaton Field Confinement",
        assemblyOrder: 3,
        connections: ["Inflaton Crystal Core", "Quantum Fluctuator Rings"],
        failureEffect: "Spontaneous vacuum decay destroying the universe at the speed of light.",
        cascadeFailures: ["Universal Phase Transition", "End of everything"],
        originalPosition: { x: 0, y: 15, z: 0 },
        explodedPosition: { x: 0, y: 60, z: 0 }
    });

    parts.push({
        name: "Inflaton Crystal Core",
        description: "The crystalline heart of the engine, designed to excite the scalar inflaton field and drive it up its potential energy hill, initiating the inflationary epoch.",
        material: "Exotic Crystal / Tachyonic Emission",
        function: "Scalar Field Excitation",
        assemblyOrder: 4,
        connections: ["False Vacuum Chamber"],
        failureEffect: "Field rolls down potential too quickly, causing immediate big crunch within the chamber.",
        cascadeFailures: ["Localized singularity formation"],
        originalPosition: { x: 0, y: 15, z: 0 },
        explodedPosition: { x: 0, y: 100, z: 0 }
    });

    parts.push({
        name: "Quantum Fluctuator Rings",
        description: "Nested TorusKnot geometries that induce targeted quantum fluctuations, seeding the newly created spacetime with primordial density perturbations to prevent a perfectly smooth, lifeless micro-universe.",
        material: "Chronos Alloy / Chrome / Dark Energy",
        function: "Density Perturbation Seeding",
        assemblyOrder: 5,
        connections: ["False Vacuum Chamber"],
        failureEffect: "New universe lacks structure formation entirely.",
        cascadeFailures: ["Cosmological uniformity anomaly"],
        originalPosition: { x: 0, y: 15, z: 0 },
        explodedPosition: { x: 0, y: 40, z: 0 } // Explodes radially
    });

    parts.push({
        name: "Space-Time Fabric Matrix",
        description: "A macroscopic physical manifestation and sensor grid for the underlying metric tensor of space, visualized as tearing and multiplying lines of intense energy.",
        material: "Hard-Light Hologram",
        function: "Metric Tensor Visualization & Stabilization",
        assemblyOrder: 6,
        connections: ["Containment Base", "Cosmic Horizon Shell"],
        failureEffect: "Loss of metric tensor coherence; distances become undefined.",
        cascadeFailures: ["Infinite distance paradox", "Spacetime dissolution"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 80, z: 0 }
    });

    parts.push({
        name: "Dark Energy Injectors",
        description: "Twelve angular injector housings that pump massive quantities of negative pressure energy into the chamber, counteracting the immense gravitational pull of the singularity anchors.",
        material: "Steel / Plasma Core",
        function: "Cosmological Constant Manipulation",
        assemblyOrder: 7,
        connections: ["Plasma Conduits", "False Vacuum Chamber"],
        failureEffect: "Expansion halts prematurely, leading to immediate localized collapse.",
        cascadeFailures: ["Micro-Big Crunch"],
        originalPosition: { x: 0, y: -5, z: 0 },
        explodedPosition: { x: 0, y: -20, z: 0 } // Explodes radially
    });

    parts.push({
        name: "Plasma Conduits",
        description: "Intricate, undulating glass and tachyon tubes that transport superheated, dimensionally-folded plasma from the external reactors directly into the Dark Energy Injectors.",
        material: "Glass / Tachyon Plasma",
        function: "Energy Transport",
        assemblyOrder: 8,
        connections: ["Dark Energy Injectors", "Dimensional Heat Sinks"],
        failureEffect: "Catastrophic plasma breach.",
        cascadeFailures: ["Vaporization of the laboratory sector"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -30, z: 0 }
    });

    parts.push({
        name: "Dimensional Heat Sinks",
        description: "144 meticulously arrayed copper and aluminum extrusions designed to vent the unimaginable entropy generated by creating new spacetime, bleeding it off into bulk hyperspace.",
        material: "Copper / Aluminum",
        function: "Hyper-entropic Dissipation",
        assemblyOrder: 9,
        connections: ["Monolithic Containment Base"],
        failureEffect: "Thermal runaway causes the new spacetime to boil into a quark-gluon plasma instantly.",
        cascadeFailures: ["Hyper-thermal detonation"],
        originalPosition: { x: 0, y: -20, z: 0 },
        explodedPosition: { x: 0, y: -50, z: 0 } // Explodes radially
    });

    parts.push({
        name: "Supergravity Torus",
        description: "A massive, perfectly reflective ring that generates a localized supergravity field, mediating the interactions between the high-energy physics of the core and the standard model physics outside.",
        material: "Perfect Reflector / Supergravity Metamaterial",
        function: "Gravitational Gradient Smoothing",
        assemblyOrder: 10,
        connections: ["Magnetic Confinement Coils"],
        failureEffect: "Gravitational gradient shears matter at the atomic level.",
        cascadeFailures: ["Atomic spaghettification"],
        originalPosition: { x: 0, y: -5, z: 0 },
        explodedPosition: { x: 0, y: -15, z: 0 }
    });

    parts.push({
        name: "Magnetic Confinement Coils",
        description: "36 chrome toruses wrapped around the Supergravity Torus, carrying petamperes of current to generate magnetic fields strong enough to confine the exotic matter reactions.",
        material: "Chrome",
        function: "Exotic Matter Confinement",
        assemblyOrder: 11,
        connections: ["Supergravity Torus"],
        failureEffect: "Exotic matter leaks, converting standard matter into strangelets.",
        cascadeFailures: ["Strangelet conversion of the planet"],
        originalPosition: { x: 0, y: -5, z: 0 },
        explodedPosition: { x: 0, y: -15, z: 0 } // Explodes radially
    });

    parts.push({
        name: "Control Obelisk",
        description: "A solitary, foreboding structure housing the primary quantum supercomputers required to solve the nonlinear Einstein field equations in real-time to maintain engine stability.",
        material: "Neutronium Alloy / Glowing Screens",
        function: "Real-time Field Equation Processing",
        assemblyOrder: 12,
        connections: ["Monolithic Containment Base"],
        failureEffect: "Loss of control; equations diverge to infinity.",
        cascadeFailures: ["Unpredictable spacetime topology changes"],
        originalPosition: { x: 0, y: -5, z: 45 },
        explodedPosition: { x: 0, y: -5, z: 80 }
    });

    parts.push({
        name: "Scalar Field Resonators",
        description: "Six exotic matter blocks that resonate at the precise frequency of the inflaton field, acting as a tuning fork to prevent the field from decaying prematurely.",
        material: "Exotic Matter",
        function: "Inflaton Field Tuning",
        assemblyOrder: 13,
        connections: ["False Vacuum Chamber"],
        failureEffect: "Inflaton field decays unevenly, creating domain walls.",
        cascadeFailures: ["Topological defect proliferation"],
        originalPosition: { x: 0, y: 25, z: 0 },
        explodedPosition: { x: 0, y: 50, z: 0 } // Explodes radially
    });

    parts.push({
        name: "Cosmic Horizon Shell",
        description: "A faint, wireframe boundary that marks the absolute limit of the localized expansion. Beyond this shell, standard physics applies. Within it, space is multiplying exponentially.",
        material: "Holographic Boundary",
        function: "Expansion Delimitation",
        assemblyOrder: 14,
        connections: ["Space-Time Fabric Matrix"],
        failureEffect: "Expansion breaches containment, inflating the solar system to the size of the observable universe in a fraction of a second.",
        cascadeFailures: ["Total localized erasure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });

    parts.push({
        name: "Base Hexagonal Armor Plates",
        description: "Heavy ablative armor protecting the sensitive neutronium base from the stray tachyonic radiation emitted during the engine's spool-up phase.",
        material: "Dark Steel",
        function: "Radiation Shielding",
        assemblyOrder: 15,
        connections: ["Monolithic Containment Base"],
        failureEffect: "Base degradation over time.",
        cascadeFailures: ["Long-term structural failure"],
        originalPosition: { x: 0, y: -10.25, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 } // Explodes upward
    });

    // =================================================================================================
    // 11. EXTREME ANIMATION LOGIC (Math-heavy visual effects)
    // =================================================================================================

    function animate(time, speed, partsMeshes) {
        const t = time * speed;
        
        // 1. Crystal Core Pulsing
        meshes.crystalCore.rotation.y = t * 2.0;
        meshes.crystalCore.rotation.x = t * 1.5;
        const pulse = (Math.sin(t * 8) + 1) / 2;
        meshes.crystalCore.material.emissiveIntensity = 1.0 + pulse * 4.0;
        meshes.crystalCore.scale.setScalar(1.0 + pulse * 0.2);

        // 2. Quantum Fluctuator Rings Complex Rotation
        const rings = meshes.quantumRings.children;
        if (rings.length >= 3) {
            rings[0].rotation.x = t * 1.0;
            rings[0].rotation.y = t * 1.2;
            rings[1].rotation.y = -t * 1.5;
            rings[1].rotation.z = t * 0.8;
            rings[2].rotation.x = -t * 0.5;
            rings[2].rotation.z = -t * 1.1;
        }

        // 3. False Vacuum Chamber Expansion / Contraction (Breathing effect)
        meshes.falseVacuum.rotation.y = t * 0.2;
        meshes.falseVacuum.scale.setScalar(1.0 + Math.sin(t * 2) * 0.05);
        meshes.falseVacuum.material.emissiveIntensity = 2.0 + Math.abs(Math.cos(t * 4)) * 3.0;

        // 4. Space-Time Grid Tearing Effect (The core visual effect)
        const positions = meshes.spaceGrid.geometry.attributes.position.array;
        const orig = meshes.originalGridPositions;
        
        // Bubble radius expands faster than light, loops back
        const bubbleRadius = (t * 20) % 60; 
        
        for(let i = 0; i < positions.length; i += 3) {
            const ox = orig[i];
            const oy = orig[i+1];
            const oz = orig[i+2];
            
            // Calculate distance from the center of the false vacuum chamber (0, 15, 0)
            const dx = ox;
            const dy = oy - 15;
            const dz = oz;
            const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
            
            // If the grid point is within the expanding bubble, stretch it violently outward
            if (dist < bubbleRadius && dist > 2) {
                // The stretch factor increases the closer the bubble edge is, simulating tearing
                const stretch = 1 + ((bubbleRadius - dist) / bubbleRadius) * 1.5 * Math.sin(t * 15 + dist);
                
                // Add high-frequency noise to simulate quantum tearing
                const noiseX = (Math.random() - 0.5) * 0.5;
                const noiseY = (Math.random() - 0.5) * 0.5;
                const noiseZ = (Math.random() - 0.5) * 0.5;

                positions[i] = dx * stretch + noiseX;
                positions[i+1] = dy * stretch + 15 + noiseY;
                positions[i+2] = dz * stretch + noiseZ;
            } else {
                // Return to original state slowly if bubble passed
                positions[i] += (ox - positions[i]) * 0.1;
                positions[i+1] += (oy - positions[i+1]) * 0.1;
                positions[i+2] += (oz - positions[i+2]) * 0.1;
            }
        }
        meshes.spaceGrid.geometry.attributes.position.needsUpdate = true;
        
        // Dynamic color shift for the grid
        meshes.spaceGrid.material.color.setHSL((t * 0.1) % 1, 1.0, 0.5);

        // 5. Plasma Injectors Pulsing
        meshes.injectors.children.forEach((injector, index) => {
            const core = injector.children[0];
            const delay = index * 0.5;
            core.material.emissiveIntensity = 2.0 + Math.sin(t * 10 + delay) * 4.0;
        });

        // 6. Supergravity Torus Rotation
        meshes.supergravityTorus.rotation.z = -t * 0.5;
        
        // 7. Magnetic Coils Cascading Effect
        meshes.magneticCoils.children.forEach((coil, index) => {
            const active = Math.sin(t * 5 + index * 0.2) > 0.8;
            if (active) {
                coil.scale.setScalar(1.2);
                coil.material.emissive = new THREE.Color(0xffffff);
                coil.material.emissiveIntensity = 5.0;
            } else {
                coil.scale.setScalar(1.0);
                coil.material.emissive = new THREE.Color(0x000000);
            }
        });

        // 8. Scalar Resonators Orbiting
        meshes.resonators.rotation.y = t * 1.5;
        meshes.resonators.children.forEach((res, index) => {
            res.position.y = 25 + Math.sin(t * 6 + index) * 5;
            res.rotation.x = t * 3 + index;
            res.rotation.z = t * 2 - index;
        });

        // 9. Cosmic Horizon Shell pulsing
        meshes.horizonShell.material.opacity = 0.1 + Math.sin(t * 2) * 0.05;
        meshes.horizonShell.rotation.y = t * 0.05;
    }

    // =================================================================================================
    // 12. EXTREME PhD-LEVEL QUIZ QUESTIONS
    // =================================================================================================

    const quizQuestions = [
        {
            question: "In the context of slow-roll inflation, which of the following conditions is mathematically strictly required for the scalar potential V(φ) to drive a sustained period of exponential cosmic expansion?",
            options: [
                "The potential must be exactly zero at the global minimum, and the field must have infinite kinetic energy.",
                "The slow-roll parameters ε (epsilon) and η (eta) must be significantly less than 1, implying a flat potential where kinetic energy is negligible compared to potential energy.",
                "The field φ must be coupled to the Ricci scalar R with a non-minimal coupling constant exactly equal to 1/6.",
                "The inflaton field must be a vector field with a spontaneously broken U(1) gauge symmetry."
            ],
            correctAnswer: 1,
            explanation: "Slow-roll inflation requires the potential to be very flat. This is quantified by the slow-roll parameters ε ≈ (M_P^2 / 2)(V'/V)^2 and η ≈ M_P^2 (V''/V). For sustained exponential expansion, the kinetic energy must be much smaller than the potential energy, which happens when ε, η << 1."
        },
        {
            question: "What is the primary mechanism by which microscopic primordial quantum fluctuations are converted into the macroscopic, classical density perturbations that seed cosmic structure?",
            options: [
                "They undergo rapid Hawking radiation at the boundary of the false vacuum chamber, crystallizing into matter.",
                "They decay into heavy W and Z bosons which then quickly annihilate into a thermal bath of photons.",
                "The modes of the quantum field are stretched beyond the Hubble horizon (comoving horizon shrinks during inflation), causing them to 'freeze out' and undergo quantum decoherence, becoming classical perturbations.",
                "The inflaton field collides with pre-existing cosmic strings, snapping them and releasing pure kinetic energy."
            ],
            correctAnswer: 2,
            explanation: "During inflation, the accelerated expansion stretches the wavelengths of quantum fluctuations faster than the speed of light, pushing them outside the causal Hubble horizon. Once outside, causal physics cannot act on them; they freeze in amplitude and become classical perturbations, later re-entering the horizon to seed galaxies."
        },
        {
            question: "Which scalar spectral index (n_s) value corresponds strictly to a perfectly scale-invariant Harrison-Zel'dovich spectrum, and what does the observed cosmological value (n_s ≈ 0.96) imply about the inflationary phase?",
            options: [
                "n_s = 0.0; It implies that inflation is still happening right now in our observable universe.",
                "n_s = 1.0; The slightly 'red-tilted' observed value (0.96) implies that the inflationary expansion was not perfectly exponential and that the slow-roll phase was dynamically evolving towards an end.",
                "n_s = -1.0; It implies that the universe is actually contracting at small scales.",
                "n_s = 0.96; It implies that inflation was perfectly scale-invariant, and observational errors account for the 0.04 difference."
            ],
            correctAnswer: 1,
            explanation: "A perfectly scale-invariant spectrum (Harrison-Zel'dovich) has n_s = 1. The observed red tilt (n_s ≈ 0.96) is a critical triumph of inflationary theory; it indicates that the expansion rate was slowly decreasing (the field was rolling down the potential), which is necessary for inflation to eventually end and reheat the universe."
        },
        {
            question: "In models of 'Eternal Inflation', what precise quantum mechanical process dictates the transition of a localized pocket universe from a false vacuum state to a true vacuum state?",
            options: [
                "Schrödinger equation collapse via observer observation.",
                "Coleman-De Luccia tunneling (quantum tunneling through a potential energy barrier), nucleating bubbles of true vacuum that expand at the speed of light.",
                "The spontaneous emission of a graviton from the singularity.",
                "Thermal excitation over the potential barrier driven by the Unruh effect."
            ],
            correctAnswer: 1,
            explanation: "In eternal inflation, regions of space get trapped in a metastable 'false vacuum' minimum. They transition to the lower energy 'true vacuum' via quantum tunneling through the potential barrier, a process described by Coleman and De Luccia. This nucleates a bubble of true vacuum that rapidly expands."
        },
        {
            question: "How does the tensor-to-scalar ratio (r), which measures the amplitude of primordial gravitational waves relative to density perturbations, directly relate to the fundamental energy scale of inflation in canonical single-field models?",
            options: [
                "The energy scale is inversely proportional to the square root of r.",
                "They are completely independent; r only depends on the coupling to dark matter.",
                "The energy scale of inflation V^(1/4) is directly proportional to r^(1/4), specifically V^(1/4) ≈ (r / 0.01)^(1/4) × 10^16 GeV.",
                "r determines the mass of the inflaton, while the energy scale determines its velocity."
            ],
            correctAnswer: 2,
            explanation: "The amplitude of tensor perturbations (gravitational waves) depends only on the Hubble parameter during inflation, which in turn depends on the energy scale V. Therefore, measuring r directly determines the energy scale at which inflation occurred. If r is around 0.01, the energy scale is around 10^16 GeV, near the Grand Unified Theory (GUT) scale."
        }
    ];

    return {
        group,
        parts,
        description: "The God Tier Cosmic Inflation Engine. A terrifyingly complex device capable of artificially manipulating the scalar inflaton field to induce a localized phase of exponential spatial expansion. It generates a false vacuum bubble and tears the very metric tensor of space, requiring PhD-level physics to comprehend and operate.",
        quizQuestions,
        animate
    };
}
